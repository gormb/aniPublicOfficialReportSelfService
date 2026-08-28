const db=async()=>{const{createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');return createClient(SUPABASE.url,SUPABASE.publishableKey)};
const iso=v=>v&&new Date(new Date(v).getTime()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);
const utc=v=>v?new Date(v).toISOString():null; // datetime-local (lokal tid) → korrekt UTC for Supabase
const stat=r=>{const n=Date.now(),f=new Date(r.dtfrom).getTime(),t=new Date(r.dtto).getTime();
  return n<f?['ok','waiting']:n>t?['exp','expired']:(t-n<7*864e5?['soon','expiring soon']:['ok','active'])};
const gridEl=document.getElementById('grid');
const grid=async()=>{const{data,error}=await (await db()).from('codes').select('*').order('dtfrom',{ascending:false});
  if(error){gridEl.innerHTML=`<p class="exp">${error.message}</p>`;return}
  gridEl.innerHTML=`<table><tr><th>code</th><th>emails</th><th>from</th><th>to</th><th>status</th><th></th></tr>`+(data||[]).map(r=>{
    const[c,label]=stat(r);
    return `<tr><td>${r.code}</td><td>${(r.mails||'').split(',').filter(Boolean).map(m=>m.trim()).join('<br>')||'—'}</td>
      <td>${(r.dtfrom||'').slice(0,16)}</td><td>${(r.dtto||'').slice(0,16)}</td>
      <td class="${c}">${label}</td>
      <td><button onclick="edit('${r.code}')">✎</button> <button onclick="del('${r.code}')">×</button></td></tr>`}).join('')+'</table>'||'<p>(empty)</p>'};
window.resetF=()=>{f.reset();code.value='';dtFrom.value=iso(Date.now());dtTo.value='2099-12-31T23:59'};
window.edit=async c=>{const{data}=await (await db()).from('codes').select('*').eq('code',c).single();
  if(data){code.value=data.code;dtFrom.value=iso(data.dtfrom);dtTo.value=iso(data.dtto);mails.value=data.mails||''}};
window.del=async c=>{if(confirm('Delete '+c+'?')){await (await db()).from('codes').delete().eq('code',c);grid()}};
window.save=async e=>{e.preventDefault();
      await (await db()).from('codes').upsert({code:code.value.trim(),dtfrom:utc(dtFrom.value)||new Date().toISOString(),dtto:utc(dtTo.value)||'2099-12-31T23:59:59Z',mails:mails.value.trim()});
  resetF();grid()};
resetF();grid();

// === books (auto-deploy links) ===
const gridBEl=document.getElementById('gridB');
const gridB=async()=>{const{data,error}=await (await db()).from('books').select('*').order('book',{ascending:true});
  if(error){gridBEl.innerHTML=`<p class="exp">${error.message}</p>`;return}
  gridBEl.innerHTML=(data||[]).length?`<table><tr><th>book</th><th>deployed</th><th>prod</th><th>autosync from</th><th>autosync to</th><th></th></tr>`+data.map(r=>
    `<tr><td>${r.book}</td><td>${r.deployed||'—'}</td><td>${r.prod?`<a href="${r.prod}" target="_blank">link</a>`:'—'}</td>
      <td>${(r.dtautosyncfrom||'').slice(0,16)||'—'}</td><td>${(r.dtautosyncto||'').slice(0,16)||'—'}</td>
      <td><button onclick="editB('${r.book}')">✎</button> <button onclick="delB('${r.book}')">×</button></td></tr>`).join('')+'</table>':'<p>(empty)</p>'}
window.resetB=()=>{fB.reset()}
window.editB=async b=>{const{data}=await (await db()).from('books').select('*').eq('book',b).single();
  if(data){b_book.value=data.book;b_deployed.value=data.deployed||'';b_prod.value=data.prod||'';b_dtFrom.value=iso(data.dtautosyncfrom)||'';b_dtTo.value=iso(data.dtautosyncto)||''}}
window.delB=async b=>{if(confirm('Delete '+b+'?')){await (await db()).from('books').delete().eq('book',b);gridB()}}
window.saveB=async e=>{e.preventDefault();
  await (await db()).from('books').upsert({book:b_book.value.trim(),deployed:b_deployed.value.trim(),prod:b_prod.value.trim(),dtautosyncfrom:utc(b_dtFrom.value),dtautosyncto:utc(b_dtTo.value)});
  resetB();gridB()}
resetB();gridB();
