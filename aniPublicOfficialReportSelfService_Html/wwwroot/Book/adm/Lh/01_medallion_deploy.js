// 01_medallion_deploy.js – Lh lakehouse (medallion) deploy: Bronze → Silver → Gold
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const mk = (layer, body) => `CREATE SCHEMA IF NOT EXISTS ${layer};\n${body.trim()}\n`;

const LAYERS = [
  { key: 'bronze', title: 'Bronze — rå data', desc: 'Rå views oppå public: usage, log, codes, books.' },
  { key: 'silver', title: 'Silver — renset', desc: 'Renset/strukturert: usage, log, codes, books.' },
  { key: 'gold',   title: 'Gold — analyse', desc: 'Data marts: daily_active_readers, license_utilization.' }
];

async function init() {
  // Kortlenke til Supabase SQL-editor på riktig DB
  const edit = document.getElementById('sqlEdit');
  edit.href = 'https://gormb.github.io/_/?eds';
  edit.textContent = 'Åpne Supabase SQL-editor ↗';

  // Én kilde: 01_medallion_deploy.sql – del opp etter lag-merker
  let raw;
  try { raw = await (await fetch('01_medallion_deploy.sql?v=' + Date.now())).text(); }
  catch (e) { document.getElementById('layers').innerHTML = `<p class="exp">Kunne ikke laste 01_medallion_deploy.sql — ${esc(String(e))}</p>`; return; }

  // del opp etter lag-merker (hele merkelinjen beholdes – den er en gyldig kommentar)
  // NB: non-capturing (?:...) i lookahead – ellers putter split de fangede ordene (SILVER/GOLD) inn i resultatet
  const parts = { bronze:'', silver:'', gold:'' };
  let cur = null;
  raw.split(/\n(?=-- (?:BRONZE|SILVER|GOLD) LAYER)/).forEach(seg => {
    const m = /-- (BRONZE|SILVER|GOLD) LAYER/.exec(seg);
    cur = m ? m[1].toLowerCase() : cur;
    if (cur) parts[cur] += '\n' + seg;
  });
  // hvert lag med egen schema-create → kjørbart alene
  const layerSql = {};
  Object.keys(parts).forEach(k => layerSql[k] = mk(k, parts[k]));
  const all = LAYERS.map(l => layerSql[l.key]).join('\n\n');

  window.copyAll = () => navigator.clipboard.writeText(all);
  window.copyLayer = k => navigator.clipboard.writeText(layerSql[k]);

  document.getElementById('layers').innerHTML = LAYERS.map((l, i) => `
    <details ${i === 0 ? 'open' : ''}>
      <summary><b>${l.title}</b> <button onclick="event.stopPropagation();copyLayer('${l.key}')" title="kopier ${l.key}">📋</button></summary>
      <p style="color:#666">${l.desc}</p>
      <pre>${esc(layerSql[l.key])}</pre>
    </details>`).join('')
    + `<details><summary><b>Alle (Bronze+Silver+Gold)</b> <button onclick="event.stopPropagation();copyAll()" title="kopier alt">📋 Copy all</button></summary><pre>${esc(all)}</pre></details>`;

  // Undeploy – fjern alt
  try {
    const un = await (await fetch('01_medallion_undeploy.sql?v=' + Date.now())).text();
    window.copyUndeploy = () => navigator.clipboard.writeText(un.trim() + '\n');
    document.getElementById('undeploy').innerHTML = `<details><summary><b>Undeploy (fjern alt)</b> <button onclick="event.stopPropagation();copyUndeploy()" title="kopier undeploy">📋 Copy undeploy</button></summary><pre>${esc(un.trim())}</pre></details>`;
  } catch (e) { document.getElementById('undeploy').innerHTML = `<p class="exp">Kunne ikke laste 01_medallion_undeploy.sql — ${esc(String(e))}</p>`; }
}
init();
