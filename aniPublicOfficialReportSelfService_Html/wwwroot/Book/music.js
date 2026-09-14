const req=async(u,o={})=>{
    try{const r=await fetch(u,o);return r.ok?await r.json():null;}catch(e){return null;}
};
const qs=(o={})=>Object.entries(o).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>k+'='+encodeURIComponent(v)).join('&');

const sp={
    tok:''
    ,id:''
    ,secret:''
    ,url:'https://api.spotify.com/v1'
    ,Re:/^https:\/\/(?:gormb\.github\.io\/_\/?\?m|aigap\.no\/m)(?!.*qr$)\S*/i
    ,Key:u=>{
        if(!u)return '';
        try{
            const p=new URL(u);
            if(/^https:\/\/gormb\.github\.io\//.test(u))return p.search.slice(1);
            if(/^https:\/\/aigap\.no\//.test(u))return p.pathname.replace(/^\//,'');
        }catch(e){}
        return '';
    }
    ,Api:(p,o={})=>req(sp.url+p,{...o,headers:{Authorization:'Bearer '+sp.tok,Accept:'application/json',...(o.headers||{})}})
    ,Auth:async()=>null
    ,Search:async(q,lim=10)=>sp.Api('/search?type=track&limit='+lim+'&q='+encodeURIComponent(q))
    ,Track:async id=>sp.Api('/tracks/'+encodeURIComponent(id))
    ,Album:async id=>sp.Api('/albums/'+encodeURIComponent(id))
    ,Playlist:async id=>sp.Api('/playlists/'+encodeURIComponent(id))
    ,Embed:u=>String(u).replace('open.spotify.com/','open.spotify.com/embed/')
    ,OEmbed:async u=>req('https://open.spotify.com/oembed?url='+encodeURIComponent(u))
    ,Play:async u=>u
};

const jz={
    id:''
    ,url:'https://api.jamendo.com/v3.0'
    ,Api:(p,o={})=>req(jz.url+p+(p.includes('?')?'&':'?')+'client_id='+encodeURIComponent(jz.id)+'&format=json'+(qs(o)?'&'+qs(o):''))
    ,Search:async(q,lim=10)=>jz.Api('/tracks/',{limit:lim,search:q,include:'musicinfo'})
    ,Track:async id=>jz.Api('/tracks/',{id})
    ,Album:async id=>jz.Api('/albums/',{id})
    ,Playlist:async id=>jz.Api('/playlists/',{id})
    ,Stream:u=>u
    ,Embed:u=>u
    ,Play:async u=>u
};

const fma={
    key:''
    ,url:'https://freemusicarchive.org/api'
    ,Api:(p,o={})=>req(fma.url+p+(p.includes('?')?'&':'?')+'api_key='+encodeURIComponent(fma.key)+(qs(o)?'&'+qs(o):''))
    ,Search:async(q,lim=10)=>fma.Api('/get/tracks.json',{limit:lim,q})
    ,Track:async id=>fma.Api('/get/tracks.json',{track_id:id})
    ,Album:async id=>fma.Api('/get/albums.json',{album_id:id})
    ,Stream:u=>u
    ,Embed:u=>u
    ,Play:async u=>u
};

const music={
    api:{spotify:sp,jamendo:jz,fma}
    ,Re:sp.Re
    ,Key:sp.Key
    ,Map:null
    ,Load:async function(force=false){
        if(music.Map&&!force)return music.Map;
        const m={},cfg=window.SUPABASE||{};
        if(cfg.url&&!cfg.url.includes('YOUR-')){
            try{
                const{createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
                const{data}=await createClient(cfg.url,cfg.publishableKey).from('redir').select('id,url,"group"');
                (data||[]).filter(r=>/music|playlist/i.test(String(r.group||'').trim())).forEach(r=>{
                    if(!r.id)return;
                    m[r.id]=r.url;
                    if(r.id[0]==='m')m[r.id.slice(1)]=r.url;
                    else m['m'+r.id]=r.url;
                    if(r.id.endsWith('qr'))m[r.id.slice(0,-2)]=r.url;
                    if(r.id.endsWith('qra'))m[r.id.slice(0,-3)]=r.url;
                });
            }catch(e){console.error('[music] supabase',e);}
        }
        return music.Map=m;
    }
    ,Url:async function(u){
        if(!u)return u;
        const map=await music.Load(),k=music.Key(u);
        if(!k)return u;
        const r=map[k]||u;
        console.log('[music] resolve',{key:k,resolved:r,found:r!==u});
        return r;
    }
    ,Stop:()=>{
        document.querySelectorAll('[data-mplay]').forEach(b=>{b.style.visibility='';b.removeAttribute('data-mplay');});
        const f=document.getElementById('_spPlayer'),c=document.getElementById('_spCollapse');
        if(f){f.src='about:blank';f.style.display='none';f.title='';}
        if(c)c.style.display='none';
    }
    ,Frame:()=>{
        let f=document.getElementById('_spPlayer');
        if(!f){
            f=document.createElement('iframe');
            f.id='_spPlayer';f.className='spotify-inline';
            f.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
            document.body.appendChild(f);
        }
        let c=document.getElementById('_spCollapse');
        if(!c){
            c=document.createElement('button');
            c.id='_spCollapse';c.textContent='🎶';c.title='Stop music';
            c.style.display='none';c.onmousedown=music.Stop;
            document.body.appendChild(c);
        }
        return f;
    }
    ,Anchor:el=>{
        const f=el||document.getElementById('_spPlayer');
        if(!f||f.style.display==='none'||!f.dataset.u)return;
        const b=[...document.querySelectorAll('#_dTocList a.toc-play')].find(a=>a.dataset.u===f.dataset.u);
        if(b)b.closest('li').insertAdjacentElement('afterend',f);
        f.style.cssText='display:block;width:min(60vw,70vh);height:min(16vw,18.6vh);margin:.4em 0 .5em 1.5em;border:0;border-radius:1vw;';
    }
    ,Tgl:async e=>{
        const u=e.dataset?.u||e.href||'',toc=!!e.closest('.toc-play'),f=music.Frame();
        music.Stop();
        const url=await music.Url(u),embed=sp.Embed(url);
        f.dataset.u=url;
        e.style.setProperty('visibility','hidden','important');
        e.setAttribute('data-mplay','');
        if(!toc&&typeof nav!=='undefined'&&nav.ShowToc)await nav.ShowToc(true);
        f.src=embed.includes('open.spotify.com/embed/')?embed:'about:blank';
        if(f.src==='about:blank'){f.style.border='0.2vw solid #c00';f.title='Music unavailable';}else{f.style.border='0';f.title='';}
        f.style.display='block';
        document.getElementById('_spCollapse').style.display='block';
        music.Anchor();
    }
    ,Page:async key=>{
        const T=window.cBook.data.type,k=key.replace(/qr$/i,''),data=await window.cBook.data.get();
        const l=data.find(b=>b.type===T.LINK&&b.spotify&&music.Key(b.url).replace(/qr$/i,'')===k);
        if(l&&book.pn()!==l.page)await nav.Page(l.page,0);
    }
    ,_spots:null
    ,Play:async function(){
        const b=window.cBook,box=document.getElementById('_dPlay');
        if(b.view)box.style.width=b.view.width+'px';
        if(!b.page||!b.view||_cBook.style.display=='none'){box.innerHTML='';return;}
        if(!music._spots||music._spots.pn!==b.pn){
            const{items}=await b.page.getTextContent(),mid=b.viewport.width/2,rows=[];
            for(const i of [...items].sort((a,c)=>c.transform[5]-a.transform[5])){
                const[,y1,,y2]=b.view.convertToViewportRectangle([i.transform[4],i.transform[5],i.transform[4]+i.width,i.transform[5]+(i.height||10)]);
                const yc=(y1+y2)/2,l=rows[rows.length-1];
                if(l&&Math.abs(l.yc-yc)<(i.height||10)*0.6){l.items.push(i);l.yc=(l.yc+yc)/2;}
                else rows.push({yc,items:[i]});
            }
            const list=[];
            for(const row of rows){
                const it=row.items.find(i=>i.str?.match(music.Re));
                if(!it)continue;
                const raw=it.str.match(music.Re)[0],col=it.transform[4]>mid,key=music.Key(raw),lh=(it.height||10)*b.scale;
                const up=rows.filter(r=>r!==row&&r.yc<row.yc-4&&r.items.some(i=>(i.transform[4]>mid)===col)).sort((a,c)=>c.yc-a.yc)[0];
                const gap=up?row.yc-up.yc:lh*1.5,yc=(up&&gap<lh*3)?up.yc-gap/2:row.yc-lh*1.5;
                if(list.some(s=>Math.abs(s.yc-yc)<(it.height||10)*0.7))continue;
                list.push({url:raw,key,col,yc});
            }
            music._spots={pn:b.pn,list};
        }
        box.innerHTML='';
        if(!music._spots.list.length)return;
        const top0=_cBook.offsetTop,h=box.clientHeight||1;
        for(const s of music._spots.list){
            const a=document.createElement('a');
            a.className='play';a.id=`${s.key}_${s.col?'r':'l'}`;a.dataset.u=s.url;a.href='#';a.textContent='\u266A';
            a.addEventListener('mousedown',ev=>{ev.preventDefault();ev.stopPropagation();music.Tgl(a);});
            a.dataset.top=((top0+s.yc)/h)*100;a.style.top=`${a.dataset.top}%`;
            box.appendChild(a);
            const r=a.cloneNode(true);r.className='play right';
            r.addEventListener('mousedown',ev=>{ev.preventDefault();ev.stopPropagation();music.Tgl(r);});
            box.appendChild(r);
        }
        music.Load().then(map=>{
            box.querySelectorAll('a.play').forEach(a=>{const k=music.Key(a.dataset.u||a.href);if(map[k])a.dataset.u=map[k];});
        });
    }
};

window.music=music;
export {music,sp,jz,fma};
export default music;
