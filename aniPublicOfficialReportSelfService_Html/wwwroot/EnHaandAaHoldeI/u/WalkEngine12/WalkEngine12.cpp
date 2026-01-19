#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <stdint.h>
#include <immintrin.h>
#include <conio.h>
#include <time.h>
#include <omp.h>
#include <string.h>

#pragma comment(lib, "vcomp.lib")

typedef union {
    uint8_t  bytes[128];
    uint64_t words[16];
} PathData;

typedef struct {
    uint16_t count;
    PathData path;
} Record;

typedef struct {
    uint64_t total_sims;
    Record best_all;
    Record worst_top3[3];
    Record best_end_6;
    Record worst_end_6;
    uint64_t end_node_counts[12]; // Persistent stats
} DisplayDB;

struct alignas(64) ThreadData {
    uint64_t sim_count;
    Record b_all, w_all;
};

static ThreadData t_results[64];
static DisplayDB g_db;

// Helper for K, M, G, T formatting
void format_big_num(uint64_t val, char* out) {
    if (val >= 1000000000000ULL) sprintf(out, "%.2fT", val / 1000000000000.0);
    else if (val >= 1000000000ULL) sprintf(out, "%.2fG", val / 1000000000.0);
    else if (val >= 1000000ULL) sprintf(out, "%.2fM", val / 1000000.0);
    else if (val >= 1000ULL) sprintf(out, "%.2fK", val / 1000.0);
    else sprintf(out, "%llu", val);
}

void path_to_string(Record rec, char* buffer) {
    if (rec.count < 11 || rec.count > 1020) { strcpy(buffer, "..."); return; }
    int current = 11;
    char temp[16];
    strcpy(buffer, "12->");
    for (int i = 0; i < rec.count; i++) {
        int bit = (rec.path.bytes[i >> 3] >> (i & 7)) & 1;
        current = (current + (bit ? 1 : -1) + 12) % 12;
        sprintf(temp, "%d%s", current + 1, (i == rec.count - 1) ? "" : ",");
        if (strlen(buffer) + strlen(temp) < 60) strcat(buffer, temp);
        else { strcat(buffer, "..."); break; }
    }
}

// Light speed end-node calculation
inline int get_end_node_direct(uint8_t* history, int lane, int steps) {
    int current = 11;
    for (int i = 0; i < steps; i++) {
        current = (current + (((history[i] >> lane) & 1) ? 1 : -1) + 12) % 12;
    }
    return current + 1;
}

void motor_high_entropy(int iterations, uint32_t seed, int tid) {
    ThreadData* my = &t_results[tid];

    // Register-Mapped Constants
    const __m256i v_weyl_const = _mm256_set1_epi32(0x9E3779B1);
    const __m256i v_mult = _mm256_set1_epi32(0x7feb352d);
    const __m256i v_ones = _mm256_set1_epi32(1);
    const __m256i v_target_mask = _mm256_set1_epi32(0x7FF);
    const __m256i v_twelve = _mm256_set1_epi32(12);
    const __m256i v_node12_idx = _mm256_set1_epi32(11);

    __m256i v_weyl_state = _mm256_set_epi32(0, 7, 13, 19, 23, 31, 37, 41);
    __m256i v_s = _mm256_set1_epi32(seed + (tid * 0x1337));

    for (int i = 0; i < iterations / 8; i++) {
        __m256i v_m = _mm256_setzero_si256();
        __m256i v_p = _mm256_set1_epi32(11);
        __m256i v_active = _mm256_set1_epi32(-1);
        __m256i v_j = _mm256_setzero_si256();

        uint8_t history[1024];
        alignas(32) uint32_t lane_ends[8] = { 0 };
        int step = 0;

        while (_mm256_movemask_ps(_mm256_castsi256_ps(v_active)) && step < 1016) {
            // HIGH-PARALLEL PRNG (Mixed Weyl-LCG)
            v_weyl_state = _mm256_add_epi32(v_weyl_state, v_weyl_const);
            __m256i v_x = _mm256_xor_si256(v_s, v_weyl_state);
            v_x = _mm256_mullo_epi32(v_x, v_mult);
            v_s = _mm256_xor_si256(v_x, _mm256_srli_epi32(v_x, 16));

            for (int pair = 0; pair < 8; pair++) {
                // Extract direction bit
                __m256i v_c = _mm256_and_si256(_mm256_srli_epi32(v_s, pair * 2), v_ones);

                // Track bits
                history[step] = (uint8_t)_mm256_movemask_ps(_mm256_castsi256_ps(_mm256_cmpeq_epi32(v_c, v_ones)));

                // Movement Logic (Balanced Port Usage)
                __m256i v_diff = _mm256_sub_epi32(_mm256_slli_epi32(v_c, 1), v_ones);
                v_p = _mm256_add_epi32(v_p, v_diff);

                // Wrap-around logic using Compare + Blend
                __m256i v_hit_top = _mm256_cmpeq_epi32(v_p, v_twelve);
                __m256i v_hit_bot = _mm256_cmpeq_epi32(v_p, _mm256_set1_epi32(-1));
                v_p = _mm256_blendv_epi8(v_p, _mm256_setzero_si256(), v_hit_top);
                v_p = _mm256_blendv_epi8(v_p, _mm256_set1_epi32(11), v_hit_bot);

                v_j = _mm256_add_epi32(v_j, _mm256_and_si256(v_active, v_ones));

                // Masking targets 1-11
                __m256i v_is_target = _mm256_andnot_si256(_mm256_cmpeq_epi32(v_p, v_node12_idx), v_active);
                v_m = _mm256_or_si256(v_m, _mm256_and_si256(v_is_target, _mm256_sllv_epi32(v_ones, v_p)));

                __m256i v_done_now = _mm256_and_si256(v_active, _mm256_cmpeq_epi32(v_m, v_target_mask));

                if (_mm256_movemask_ps(_mm256_castsi256_ps(v_done_now))) {
                    _mm256_maskstore_epi32((int*)lane_ends, v_done_now, v_p);
                    v_active = _mm256_andnot_si256(v_done_now, v_active);
                }
                step++;
            }
        }

        // --- Post-Simulation Processing (Atomic Sync) ---
        uint32_t f_jumps[8];
        _mm256_storeu_si256((__m256i*)f_jumps, v_j);

        for (int k = 0; k < 8; k++) {
            uint16_t c = (uint16_t)f_jumps[k];
            int end = (int)lane_ends[k] + 1;

            if (c >= 11 && end >= 1 && end <= 11) {
#pragma omp atomic
                g_db.end_node_counts[end - 1]++;

                if (c < my->b_all.count || c > my->w_all.count || (end == 6 && (c < g_db.best_end_6.count || c > g_db.worst_end_6.count))) {
                    Record r; r.count = c; memset(r.path.bytes, 0, 128);
                    for (int s = 0; s < step; s++) if ((history[s] >> k) & 1) r.path.bytes[s >> 3] |= (1 << (s & 7));

                    if (r.count < my->b_all.count) my->b_all = r;
                    if (r.count > my->w_all.count && r.count < 1024) my->w_all = r;

                    if (end == 6) {
#pragma omp critical
                        {
                            if (r.count < g_db.best_end_6.count) g_db.best_end_6 = r;
                            if (r.count > g_db.worst_end_6.count) g_db.worst_end_6 = r;
                        }
                    }
                }
            }
        }
    }
    my->sim_count += iterations;
}

int main() {
    FILE* fr = fopen("records.bin", "rb");
    if (fr) { fread(&g_db, sizeof(DisplayDB), 1, fr); fclose(fr); }
    if (g_db.best_all.count < 11) g_db.best_all.count = 999;
    if (g_db.best_end_6.count < 16) g_db.best_end_6.count = 999;

    for (int i = 0; i < 64; i++) { t_results[i].b_all.count = 999; t_results[i].w_all.count = 0; t_results[i].sim_count = 0; }

    uint32_t seed = (uint32_t)time(NULL);
    double start_time = omp_get_wtime(), last_update = start_time;
    uint64_t last_sims = 0, session_sims = 0;
    char s_all[128], s_6b[128], s_6w[128], p_num[32];

    while (!_kbhit()) {
#pragma omp parallel
        { motor_high_entropy(2000000, seed + (omp_get_thread_num() * 0x45D9), omp_get_thread_num()); }
        seed += 0x1337;

        uint64_t current_session_sims = 0;
        for (int i = 0; i < 64; i++) {
            current_session_sims += t_results[i].sim_count;
            if (t_results[i].b_all.count >= 11 && t_results[i].b_all.count < g_db.best_all.count) g_db.best_all = t_results[i].b_all;
            if (t_results[i].w_all.count > g_db.worst_top3[0].count) {
                g_db.worst_top3[2] = g_db.worst_top3[1]; g_db.worst_top3[1] = g_db.worst_top3[0];
                g_db.worst_top3[0] = t_results[i].w_all;
            }
        }

        double now = omp_get_wtime();
        double dt = now - last_update;
        if (dt >= 1.0) {
            path_to_string(g_db.best_all, s_all);
            path_to_string(g_db.best_end_6, s_6b);
            path_to_string(g_db.worst_end_6, s_6w);

            // Total sims = existing from file + current session sims
            uint64_t total_historical_sims = 0;
            for (int j = 0; j < 12; j++) total_historical_sims += g_db.end_node_counts[j];

            double inst_spd = (double)(current_session_sims - last_sims) / (dt * 1000000.0);
            double avg_spd = (double)current_session_sims / ((now - start_time) * 1000000.0);

            printf("\033[H\033[J");
            printf("--- ENGINE 12 DASHBOARD ---\n");
            printf("Session Sims: %llu | Inst: %.1f M/s | Avg: %.1f M/s\n", current_session_sims, inst_spd, avg_spd);
            printf("--------------------------------------------------\n");
            printf("GLOBAL BEST: %u | Path: %s\n", g_db.best_all.count, s_all);
            printf("TOP 3 WORST: [%u, %u, %u]\n", g_db.worst_top3[0].count, g_db.worst_top3[1].count, g_db.worst_top3[2].count);
            printf("--------------------------------------------------\n");
            printf("BEST @6:     %u | Path: %s\n", g_db.best_end_6.count, s_6b);
            printf("WORST @6:    %u | Path: %s\n", g_db.worst_end_6.count, s_6w);
            printf("--------------------------------------------------\n");
            printf("ALL-TIME END NODE DISTRIBUTION (Total: ");
            format_big_num(total_historical_sims, p_num);
            printf("%s):\n", p_num);

            for (int n = 0; n < 12; n++) {
                uint64_t c = g_db.end_node_counts[n];
                double pct = (total_historical_sims > 0) ? (c * 100.0 / total_historical_sims) : 0;
                format_big_num(c, p_num);
                printf("[%2d]: %6s (%5.2f%%) ", n + 1, p_num, pct);
                if ((n + 1) % 4 == 0) printf("\n");
            }

            last_update = now; last_sims = current_session_sims;
        }
    }

    FILE* fs = fopen("records.bin", "wb");
    if (fs) { fwrite(&g_db, sizeof(DisplayDB), 1, fs); fclose(fs); }
    return 0;
}