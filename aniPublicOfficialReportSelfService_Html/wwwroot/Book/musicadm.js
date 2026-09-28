let _db;const db=()=>_db||(_db=import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm').then(m=>m.createClient(SUPABASE.url,SUPABASE.publishableKey))); // single client (avoid "Multiple GoTrueClient instances")
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); // text cells
const q=s=>String(s??'').replace(/\\/g,'\\\\').replace(/'/g,"\\'"); // inside onclick="...('...')"
const msg=(t,bad)=>{mMsg.textContent=t;mMsg.className=bad?'exp':'ok'};

// == list (music_vw: redir sang/spotify/txt + music.* – se music.sql) ==
const gridEl=document.getElementById('grid');
let ROWS=null;
const load=async()=>{const{data,error}=await (await db()).from('music_vw')
    .select('song_id,txt_id,replaced_by,ch,su,page,book,lg,ed,comments,contents,song,title,artist,spotify,qr')
    .order('page',{ascending:true,nullsFirst:false}).order('ch',{ascending:true}).order('su',{ascending:true});
  if(error){gridEl.innerHTML=`<p class="exp">${error.message}</p>`;return}
  ROWS=data||[];draw()};
window.draw=()=>{const k=mQ.value.trim().toLowerCase();
  const rows=(ROWS||[]).filter(r=>!k||[r.song_id,r.song,r.title,r.artist,r.ch,r.su,r.contents].some(v=>String(v??'').toLowerCase().includes(k)));
  mCount.textContent=`${ROWS.length} sanger${k?` · ${rows.length} treff`:''}`;
  gridEl.innerHTML=rows.length?`<table><tr><th>id</th><th>p.</th><th>ch</th><th>su</th><th>song</th><th>txt</th><th></th></tr>`+
    rows.map(r=>`<tr><td>${esc(r.song_id)}</td>
      <td class="${r.page==null?'soon':''}">${r.page??'—'}</td>
      <td>${esc(r.ch)||'—'}</td><td>${esc(r.su)||'—'}</td>
      <td>${esc(r.song)}</td>
      <td title="${r.txt_id?'egen tekstrad':'sangens egen rad'}">${r.txt_id?esc(r.txt_id):'·'}</td>
      <td>${r.spotify?`<a href="${esc(r.spotify)}" target="_blank" title="åpne i Spotify">♪</a> `:''}<button onclick="edit('${q(r.song_id)}')">✎</button></td></tr>`).join('')+'</table>'
    :'<p>(ingen treff)</p>'};

// == edit (full rad fra vw – txt kommer fra redir-raden txt_id || id) ==
window.edit=async id=>{const{data,error}=await (await db()).from('music_vw').select('*').eq('song_id',id).single();
  if(error){msg(error.message,1);return}
  m_id.value=data.song_id;
  m_song.value=data.song||'';m_url.value=data.spotify||'';
  m_ch.value=data.ch||'';m_su.value=data.su||'';
  m_page.value=data.page??'';m_book.value=data.book||'';m_lg.value=data.lg||'';m_ed.value=data.ed||'';
  m_txtid.value=data.txt_id||'';m_rep.value=data.replaced_by||'';m_comments.value=data.comments||'';
  m_contents.value=data.contents||'';m_relevance.value=data.relevance||'';m_txt.value=data.txt||'';
  msg(`lastet ${id}`)};
window.resetF=()=>{f.reset();m_id.value='';mMsg.textContent=''};

// == save (music-raden + redir-raden teksten/lenken hører til) ==
window.save=async e=>{e.preventDefault();
  const id=m_id.value.trim();if(!id){msg('velg en sang i listen først',1);return}
  const row={id,ch:m_ch.value.trim()||null,su:m_su.value.trim()||null,page:m_page.value===''?null:+m_page.value,
    book:m_book.value.trim()||null,lg:m_lg.value.trim()||null,ed:m_ed.value.trim()||null,
    txt_id:m_txtid.value.trim()||null,replaced_by:m_rep.value.trim()||null,comments:m_comments.value.trim()||null,
    contents:m_contents.value.trim()||null,relevance:m_relevance.value.trim()||null};
  const red={id:m_txtid.value.trim()||id,desc:m_song.value.trim(),url:m_url.value.trim(),txt:m_txt.value};
  const supa=await db();
  const a=await supa.from('music').upsert(row);if(a.error){msg('music: '+a.error.message,1);return}
  const b=await supa.from('redir').upsert(red);if(b.error){msg('redir: '+b.error.message,1);return}
  msg(`lagret ${id}`);ROWS=null;await load()};

load();
