// 02_analytics.js – Lh analytics (gold) med drill-down
let _db;const db=()=>_db||(_db=import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm').then(m=>m.createClient(SUPABASE.url,SUPABASE.publishableKey)));
const $=id=>document.getElementById(id);
// leser fra public.gold_* (serving layer) – fungerer uten å eksponere gold-schemaet
const gold=async(table,opt={})=>{let q=(await db()).from(table).select('*',{count:'exact'});for(const[k,v]of Object.entries(opt))q[k](v);const{data,error}=await q;if(error)throw error;return data||[]};
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;');
const T=rows=>rows.length?`<table><tr>${Object.keys(rows[0]).map(k=>`<th>${k}</th>`).join('')}</tr>${rows.map(r=>`<tr>${Object.values(r).map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</table>`:'<p>(tom)</p>';
const kpi=(l,v)=>`<div style="display:inline-block;min-width:9rem;margin-right:1rem;padding:.6rem;border:1px solid #ddd;border-radius:6px"><div style="font-size:1.6rem;font-weight:700">${v}</div><div style="color:#666">${l}</div></div>`;

async function goldQ(table,opt){ // sjekk om public-ga-viewet er tilgjengelig
  try{return await gold(table,opt)}catch(e){$('note').innerHTML=`<p class="exp">⚠️ Kunne ikke lese <b>${table}</b> — ${esc(e.message)}</p><p>Kjør deploy på nytt (Copy all → Run) så public.ga_*-viewene opprettes.</p>`;return null}
}

async function load(){
  $('note').innerHTML='';
  // Gold-marts (parallelt)
  const[books,hourly,daily,retention,pages,licenses]=await Promise.all([
    goldQ('gold_book_analytics'),goldQ('gold_hourly_activity'),
    goldQ('gold_daily_active_readers').then(d=>d&&d.sort((a,b)=>a.activity_date<b.activity_date?1:-1).slice(0,30)),
    goldQ('gold_reader_retention').then(d=>d&&d.sort((a,b)=>a.event_date<b.event_date?1:-1).slice(0,30)),
    goldQ('gold_top_pages'),goldQ('gold_license_utilization')
  ]);
  // KPI-er
  if(books)$('kpis').innerHTML=kpi('bøker',books.length)+kpi('lesere',books.reduce((s,r)=>s+r.readers,0))+kpi('sidevisninger',books.reduce((s,r)=>s+r.page_views,0));
  // Bøker (klikkbar → drill)
  $('books').innerHTML=books&&books.length?`<table><tr><th>bok</th><th>lesere</th><th>sesjoner</th><th>sidevisninger</th><th>sider/leser</th><th></th></tr>`+books.map(r=>`<tr><td>${esc(r.book_id)}</td><td>${r.readers}</td><td>${r.sessions}</td><td>${r.page_views}</td><td>${r.pages_per_reader}</td><td><button onclick="drill('${esc(r.book_id)}')">drill ▸</button></td></tr>`).join('')+'</table>':'<p>(tom)</p>';
  if(hourly)$('hourly').innerHTML=`<table><tr><th>time</th><th>lesere</th><th>hendelser</th></tr>`+hourly.map(r=>`<tr><td>${r.hour_of_day}:00</td><td>${r.readers}</td><td>${r.events}</td></tr>`).join('')+'</table>';
  if(daily)$('daily').innerHTML=T(daily);
  if(retention)$('retention').innerHTML=T(retention);
  if(pages)$('pages').innerHTML=T(pages);
  if(licenses)$('licenses').innerHTML=T(licenses);
}

// ── drill: bok → lesere → sider lest ───────────────────────────────────────
let _book=null,_fp=null;
window.drill=async book=>{_book=book;_fp=null;$('drill').style.display='block';await drillRender()};
window.drillBack=()=>{_fp=null;drillRender()};
window.drillClose=()=>{$('drill').style.display='none';_book=_fp=null};
async function drillRender(){
  const d=$('drill');
  if(!_book){d.innerHTML='';return}
  // lesere som har lest denne boka (fra usage)
  const{data,error}=await (await db()).from('usage').select('fingerprint,page,event,created_at').eq('book',_book).eq('event','page').order('created_at',{ascending:false});
  if(error){d.innerHTML=`<p class="exp">${esc(error.message)}</p>`;return}
  const readers={};(data||[]).forEach(r=>{const k=r.fingerprint||'ukjent';(readers[k]=readers[k]||{pages:new Set(),last:r.created_at}).pages.add(r.page);if(r.created_at>readers[k].last)readers[k].last=r.created_at});
  const list=Object.entries(readers).map(([fp,x])=>({fp,pages:x.pages.size,last:x.last})).sort((a,b)=>b.pages-a.pages);
  const rows=list.map(r=>`<tr><td style="font-family:monospace;font-size:.78rem">${esc(r.fp)}</td><td>${r.pages}</td><td>${(r.last||'').slice(0,16)}</td><td><button onclick="drillFp('${esc(r.fp)}')">sider ▸</button></td></tr>`).join('');
  let inner=`<p><button onclick="drillClose()">✕ lukk</button> <b>${esc(_book)}</b> — ${list.length} lesere`;
  if(!_fp)inner+=`<table><tr><th>fingerprint</th><th>unike sider</th><th>sist sett</th><th></th></tr>${rows}</table>`;
  else{
    const fpEvents=(data||[]).filter(r=>(r.fingerprint||'ukjent')===_fp).sort((a,b)=>a.created_at<b.created_at?-1:1);
    inner+=`<p><button onclick="drillBack()">← tilbake</button> leser <b style="font-family:monospace">${esc(_fp)}</b> — ${fpEvents.length} sidebesøk`;
    inner+=`<table><tr><th>side</th><th>tidspunkt</th></tr>${fpEvents.map(r=>`<tr><td>${r.page}</td><td>${(r.created_at||'').slice(0,16)}</td></tr>`).join('')}</table>`;
  }
  d.innerHTML=inner;
}
window.drillFp=async fp=>{_fp=fp;drillRender()};
load();
