#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <immintrin.h>
#include <intrin.h>
#include <conio.h>
#include <time.h>

// --- COMPILER AUTO-SETUP ---
#pragma comment(lib, "vcomp.lib")         
#pragma managed(push, off)                
#pragma optimize("gty", on)               
#include <omp.h>                          

// --- Database Structures (9KB total) ---
typedef union {
    struct { uint16_t bit_count; uint8_t data[1022]; } walk;
    uint8_t raw[1024];
} WalkBuffer;

typedef union {
    struct {
        uint64_t total_sims;
        uint8_t  padding[1016];
        WalkBuffer shortest;
        WalkBuffer shortest_end6;
        WalkBuffer longest[3];
        WalkBuffer longest_end6[3];
    } records;
    uint8_t raw[9216];
} Database;

static Database db;
static int use_avx2_global = 0;

// --- Resilience & Rotation Logic ---
void save_db() {
    // 1. Move current file to .prev (Rotation)
    // We ignore error here because file might not exist yet
    remove("records.bin.prev");
    rename("records.bin", "records.bin.prev");

    // 2. Write new file
    FILE* f = fopen("records.bin", "wb");
    if (f) { 
        size_t written = fwrite(&db, sizeof(Database), 1, f);
        fclose(f);
        if (written != 1) printf("\n[WARNING] Write incomplete!\n");
    } else {
        printf("\n[WARNING] Could not write records.bin! Locked?\n");
    }
}

void load_db() {
    // Try main file first
    FILE* f = fopen("records.bin", "rb");
    if (!f) {
        // Fallback to .prev
        printf("[SYSTEM] Main database not found. Trying records.bin.prev...\n");
        f = fopen("records.bin.prev", "rb");
    }

    if (f && fread(&db, sizeof(Database), 1, f) == 1) {
        fclose(f);
        printf("[SYSTEM] Database loaded. Progress: %llu sims\n", db.records.total_sims);
    } else {
        if (f) fclose(f);
        memset(&db, 0, sizeof(Database));
        db.records.shortest.walk.bit_count = 0xFFFF;
        db.records.shortest_end6.walk.bit_count = 0xFFFF;
        printf("[SYSTEM] Starting fresh (no valid database found).\n");
    }
}

// --- Engines ---
__forceinline void engine_scalar(int iterations, uint32_t* seed) {
    uint32_t s = *seed;
    for (int i = 0; i < iterations; i++) {
        uint32_t m = (1 << 11), r = 0;
        int p = 11, bits = 0;
        while (m != 0xFFF && bits < 8176) {
            if (!(bits & 31)) { s ^= s << 13; s ^= s >> 17; s ^= s << 5; r = s; }
            int bit = r & 1;
            p = (bit) ? (p + 1) : (p - 1);
            if (p == 12) p = 0; if (p == -1) p = 11;
            m |= (1 << p);
            r >>= 1; bits++;
        }
        if (bits < db.records.shortest.walk.bit_count) db.records.shortest.walk.bit_count = (uint16_t)bits;
    }
    *seed = s;
}

__forceinline void engine_avx2(int iterations, uint32_t* seed) {
    uint32_t s_base = *seed;
    __m256i v_ones = _mm256_set1_epi32(1), v_twelve = _mm256_set1_epi32(12);
    __m256i v_neg_one = _mm256_set1_epi32(-1), v_all_v = _mm256_set1_epi32(0xFFF);
    __m256i v_s = _mm256_set_epi32(s_base, s_base+1, s_base+2, s_base+3, s_base+4, s_base+5, s_base+6, s_base+7);

    for (int i = 0; i < iterations / 8; i++) {
        __m256i v_m = _mm256_set1_epi32(1 << 11), v_p = _mm256_set1_epi32(11), v_active = _mm256_set1_epi32(0xFFFFFFFF);
        while (_mm256_movemask_ps(_mm256_castsi256_ps(v_active))) {
            v_s = _mm256_xor_si256(v_s, _mm256_slli_epi32(v_s, 13));
            v_s = _mm256_xor_si256(v_s, _mm256_srli_epi32(v_s, 17));
            v_s = _mm256_xor_si256(v_s, _mm256_slli_epi32(v_s, 5));
            __m256i v_bit = _mm256_and_si256(v_s, v_ones);
            v_p = _mm256_add_epi32(v_p, _mm256_sub_epi32(_mm256_slli_epi32(v_bit, 1), v_ones));
            v_p = _mm256_blendv_epi8(v_p, _mm256_setzero_si256(), _mm256_cmpeq_epi32(v_p, v_twelve));
            v_p = _mm256_blendv_epi8(v_p, _mm256_set1_epi32(11), _mm256_cmpeq_epi32(v_p, v_neg_one));
            v_m = _mm256_or_si256(v_m, _mm256_sllv_epi32(v_ones, v_p));
            v_active = _mm256_andnot_si256(_mm256_cmpeq_epi32(v_m, v_all_v), v_active);
        }
    }
    *seed = s_base + iterations;
}

int main() {
    load_db();
    uint32_t seed = (uint32_t)time(NULL);
    int num_threads = omp_get_max_threads();

    printf("[STAGE 1] Running 1s duel on %d threads...\n", num_threads);
    
    double t1 = omp_get_wtime();
    long long s_count = 0;
    while(omp_get_wtime() - t1 < 1.0) { engine_scalar(10000, &seed); s_count += 10000; }
    printf("   > Scalar Engine: %lld sims/s\n", s_count);

    double t2 = omp_get_wtime();
    long long a_count = 0;
    while(omp_get_wtime() - t2 < 1.0) { engine_avx2(10000, &seed); a_count += 10000; }
    printf("   > AVX2 Engine  : %lld sims/s\n", a_count);

    use_avx2_global = (a_count > s_count);
    long long sims_per_batch = (use_avx2_global ? a_count : s_count);
    
    printf("\n[STAGE 2] Winner: %s. Entering production loop.\n\n", use_avx2_global ? "AVX2" : "SCALAR");

    double last_save = omp_get_wtime();
    while (!_kbhit()) {
        double batch_start = omp_get_wtime();
        
        #pragma omp parallel
        {
            uint32_t t_seed = (uint32_t)(seed ^ omp_get_thread_num());
            int iter = (int)(sims_per_batch / num_threads);
            if (use_avx2_global) engine_avx2(iter, &t_seed);
            else engine_scalar(iter, &t_seed);
            #pragma omp critical
            db.records.total_sims += iter;
        }

        double duration = omp_get_wtime() - batch_start;
        if (duration < 0.5 || duration > 2.0) sims_per_batch = (long long)(sims_per_batch / duration);

        if (omp_get_wtime() - last_save >= 1.0) {
            save_db(); 
            last_save = omp_get_wtime();
            printf("\rSims: %llu | Speed: %.2f M/s | Batch: %.2fs   ", 
                   db.records.total_sims, (sims_per_batch/duration)/1e6, duration);
        }
    }

    save_db();
    printf("\n\n[FINISH] Press any key to exit.");
    _getch();
    return 0;
}