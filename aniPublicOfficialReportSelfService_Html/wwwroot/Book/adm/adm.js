let _db;const db=()=>_db||(_db=import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm').then(m=>m.createClient(SUPABASE.url,SUPABASE.publishableKey))); // én klient (unngå "Multiple GoTrueClient instances")
const iso=v=>v&&new Date(new Date(v).getTime()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);
const utc=v=>v?new Date(v).toISOString():null; // datetime-local (lokal tid) → korrekt UTC for Supabase
const stat=r=>{const n=Date.now(),f=new Date(r.dtfrom).getTime(),t=new Date(r.dtto).getTime();
  return n<f?['ok','waiting']:n>t?['exp','expired']:(t-n<7*864e5?['soon','expiring soon']:['ok','active'])};
const gridEl=document.getElementById('grid');
const grid=async()=>{const{data,error}=await (await db()).from('codes').select('*').order('dtfrom',{ascending:false});
  if(error){gridEl.innerHTML=`<p class="exp">${error.message}</p>`;return}
  // bruk per kode: unike enheter som har aktivert koden (premium_activate)
  const{data:usage}=await (await db()).from('usage').select('code_id,fingerprint').eq('event','premium_activate');
  const useCount={};(usage||[]).forEach(u=>{const k=u.code_id||'—';(useCount[k]=useCount[k]||new Set()).add(u.fingerprint)});
  gridEl.innerHTML=`<table><tr><th>code</th><th>book</th><th>emails</th><th>limit</th><th>usage</th><th>from</th><th>to</th><th>status</th><th></th></tr>`+(data||[]).map(r=>{
    const[c,label]=stat(r), used=useCount[r.code]?.size||0;
    return `<tr><td>${r.code}</td><td>${r.book||'—'}</td><td>${(r.mails||'').split(',').filter(Boolean).map(m=>m.trim()).join('<br>')||'—'}</td>
      <td>${r.use_limit??'∞'}</td><td class="${r.use_limit!=null&&used>=r.use_limit?'exp':'ok'}">${used}/${r.use_limit??'∞'}</td>
      <td>${(r.dtfrom||'').slice(0,16)}</td><td>${(r.dtto||'').slice(0,16)}</td>
      <td class="${c}">${label}</td>
      <td><button onclick="edit('${r.code}')">✎</button> <button onclick="resetUsage('${r.code}')" title="tøm bruk">🧹</button> <button onclick="del('${r.code}')">×</button></td></tr>`}).join('')+'</table>'||'<p>(empty)</p>'};
window.resetUsage=async c=>{if(confirm('Tøm all bruk (usage) for '+c+'?')){await (await db()).from('usage').delete().eq('code_id',c);grid()}};
window.resetF=()=>{f.reset();code.value='';dtFrom.value=iso(Date.now());dtTo.value='2099-12-31T23:59'};
window.edit=async c=>{const{data}=await (await db()).from('codes').select('*').eq('code',c).single();
  if(data){code.value=data.code;c_book.value=data.book||'';c_limit.value=data.use_limit??'';dtFrom.value=iso(data.dtfrom);dtTo.value=iso(data.dtto);mails.value=data.mails||''}};
window.del=async c=>{if(confirm('Delete '+c+'?')){await (await db()).from('codes').delete().eq('code',c);grid()}};
window.save=async e=>{e.preventDefault();
      await (await db()).from('codes').upsert({code:code.value.trim(),book:c_book.value.trim(),use_limit:c_limit.value!==''?+c_limit.value:null,dtfrom:utc(dtFrom.value)||new Date().toISOString(),dtto:utc(dtTo.value)||'2099-12-31T23:59:59Z',mails:mails.value.trim()});
  resetF();grid()};
resetF();grid();

// === books (auto-deploy links) ===
const gridBEl=document.getElementById('gridB');
const gridB=async()=>{const{data,error}=await (await db()).from('books').select('*').order('book',{ascending:true});
  if(error){gridBEl.innerHTML=`<p class="exp">${error.message}</p>`;return}
  gridBEl.innerHTML=(data||[]).length?`<table><tr><th>book</th><th>deployed</th><th>prod</th><th>autosync from</th><th>autosync to</th><th>premCheck (s)</th><th></th></tr>`+data.map(r=>
    `<tr><td>${r.book}</td><td>${r.deployed?`<a href="https://gormb.github.io/_?b&book=${encodeURIComponent(r.deployed)}" target="_blank">${r.deployed}</a>`:'—'}</td><td>${r.prod?`<a href="${r.prod}" target="_blank">link</a>`:'—'}</td>
      <td>${(r.dtautosyncfrom||'').slice(0,16)||'—'}</td><td>${(r.dtautosyncto||'').slice(0,16)||'—'}</td>
      <td>${r.premiumCheckInterval??60}</td>
      <td><button onclick="editB('${r.book}')">✎</button> <button onclick="delB('${r.book}')">×</button></td></tr>`).join('')+'</table>':'<p>(empty)</p>'}
window.resetB=()=>{fB.reset()}
window.editB=async b=>{const{data}=await (await db()).from('books').select('*').eq('book',b).single();
  if(data){b_book.value=data.book;b_deployed.value=data.deployed||'';b_prod.value=data.prod||'';b_dtFrom.value=iso(data.dtautosyncfrom)||'';b_dtTo.value=iso(data.dtautosyncto)||'';b_premInt.value=data.premiumCheckInterval??''}}
window.delB=async b=>{if(confirm('Delete '+b+'?')){await (await db()).from('books').delete().eq('book',b);gridB()}}
window.saveB=async e=>{e.preventDefault();
  await (await db()).from('books').upsert({book:b_book.value.trim(),deployed:b_deployed.value.trim(),prod:b_prod.value.trim(),dtautosyncfrom:utc(b_dtFrom.value),dtautosyncto:utc(b_dtTo.value),premiumCheckInterval:b_premInt.value!==''?+b_premInt.value:60});
  resetB();gridB()}
resetB();gridB();

// === usage (logg) – gruppert (bok → kode) og utvidbar ===
const gridUEl=document.getElementById('gridU');
const gridU=async()=>{const{data,error}=await (await db()).from('usage').select('*,codes(code)').order('created_at',{ascending:false}).limit(1000);
  if(error){gridUEl.innerHTML=`<p class="exp">${error.message}</p>`;return}
  if(!(data||[]).length){gridUEl.innerHTML='<p>(empty)</p>';return}
  const byBook={};
  (data||[]).forEach(r=>{(byBook[r.book||'(ingen bok)']=byBook[r.book||'(ingen bok)']||[]).push(r)});
  const byCode=rows=>{const g={};rows.forEach(r=>{const k=r.codes?.code||r.code_id||'—';(g[k]=g[k]||[]).push(r)});return Object.entries(g)};
  gridUEl.innerHTML=Object.entries(byBook).map(([b,rows])=>`<details><summary>📖 ${b} — ${rows.length}</summary>`+
    byCode(rows).map(([c,cr])=>`<details style="margin-left:1.2em"><summary>🔑 ${c} — ${cr.length}</summary>`+
      cr.map(r=>`<div style="margin-left:2em">${(r.created_at||'').slice(0,16)} · ${r.event||''} · p${r.page??''} · ${(r.fingerprint||'').slice(0,8)}</div>`).join('')
    +`</details>`).join('')+`</details>`).join('')};
gridU();
