const books={
    play:{
        md:{
            fn:'',txt:'',title:'',pages:[],pgs:[],sts:[],tr:[],chs:[],subs:[],subCh:[],lns:[]
            ,books:['LifeDemandedDeath','CV','ABook']
            ,set:_fn=>{if(_fn!==books.play.md.fn){books.play.md.fn=_fn;books.play.md.load();}}
            ,load:()=>{books.play.md.busy=1;fetch(books.play.md.fn,{cache:'no-store'}).then(r=>r.text()).then(t=>{books.play.md.txt=t;books.play.md.parse();}).catch(()=>{books.play.render.el.page.innerHTML='Not found: '+books.play.md.fn;});}
            ,parse:()=>{
                books.play.md.busy=0;
                const md=books.play.md.txt.split(/\n/);
                // Title = the "# ..." line. Never trust md[0]: it may be a "#### p. N" page marker,
                // and stripping a single '#' off that is what leaked "### p. 1" as title + body text.
                const _h1=md.findIndex(l=>/^#\s+\S/.test(l));
                const ti=_h1>=0?_h1:md.findIndex(l=>l.trim()&&!/^#{2,4}\s/.test(l));
                books.play.md.title=(md[ti]||'').replace(/^#+\s*/,'').trim();
                const body=md.filter((_,i)=>i!==ti); // the title is drawn from {t:1} – keep it out of the body
                books.play.md.pages=[];books.play.md.pgs=[];
                let cur=null,last='',pnCur=0,tail=null; // pnCur = running page cursor: "#### p. N" sets it, every block inherits it. tail = the paragraph last written, so a cut line can be continued
                body.forEach(l=>{
                    const pm=l.match(/^#{3,4}\s*p\.\s*(\d+)\s*$/i),h=pm?null:l.match(/^(#{2,4})\s+(.*)$/);
                    if(pm){ // a page marker: a new page and nothing more – whether the text continues is decided by the next line
                        if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);books.play.md.pages.push(cur);}
                        pnCur=+pm[1];
                        cur={h:null,pn:pnCur,ps:[]};
                    }else if(h){if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);books.play.md.pages.push(cur);} 
                        const k=h[1].length,raw=h[2].trim(),own=+(raw.match(/p\.\s*(\d+)/i)||[,0])[1];
                        if(own)pnCur=own; // page markers ("#### p. N") advance the cursor; a heading may also carry "- p. N"
                        cur={h:k>=4?null:[k,raw.replace(/\s*[\u2013\u2014-]\s*p\.\s*\d+\s*$/i,'').trim()],pn:pnCur,ps:[]};last='';tail=null;
                    }else{
                        const _l=l.trim();if(!_l)return; // one line = one paragraph
                        if(!cur)cur={h:null,pn:pnCur,ps:[]};
                        const _m=/^\u{1F3B5}/u.test(_l),pn=cur.pn||pnCur;
                        if(!_m&&tail&&(/^[a-zæøåäöéü,;:.)”»]/.test(_l)||(!books.play.render.sent(last)&&books.play.render.hangs(tail.p.txt)))){ // a paragraph never starts here – this line is the rest of the one above
                            tail.p.txt+=' '+_l;tail.ps[tail.ps.length-1]+=' '+books.play.render.esc(_l);
                            if(tail.p.pn!==pn){tail.p.pn2=pn;if(tail.p.cut===undefined)tail.p.cut=tail.p.txt.length-_l.length-1;cur.fr=(cur.fr?cur.fr+' ':'')+books.play.render.esc(_l);cur.frT=(cur.frT?cur.frT+' ':'')+_l;} // it ran onto this page, which starts with the fragment – cut is where it left the page before
                            if(books.play.render.sent(_l))tail=null;
                        }else{
                            tail=null;
                            if(!_m)books.play.md.pgs.push({pn,txt:_l});
                            if(cur.h&&!cur.ps.length&&_m&&_l.match(/https?:\/\/[^\s)]+/))cur.mu=_l.match(/https?:\/\/[^\s)]+/)[0];
                            else cur.ps.push(_m?books.play.render.mus(_l):books.play.render.esc(_l));
                            tail=_m?null:{p:books.play.md.pgs[books.play.md.pgs.length-1],ps:cur.ps};
                        }
                        last=_l;
                    }
                });
                if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);books.play.md.pages.push(cur);}
                books.play.md.sts=[];
                books.play.md.pages.forEach((p,i)=>p.pgi=i); // global page index – lets a page node address its own layer (pl4b)
                books.play.md.pgs.forEach(p=>{const ss=books.play.render.sentT(p.txt);ss.forEach(s=>books.play.md.sts.push({pn:p.pn,txt:s}));});
                books.play.md.lns=books.play.md.pages.map(p=>{ // the page's own lines: the fragment it continues, then the paragraphs that start on it, word wrapped at the measure
                    const a=p.frT?books.play.render.wrap(p.frT).map(t=>({t,lp:-1})):[];
                    books.play.md.pgs.forEach((q,i)=>{if(q.pn!==p.pn)return;books.play.render.wrap(q.txt.slice(0,q.cut===undefined?q.txt.length:q.cut)).forEach(t=>a.push({t,lp:i}));});
                    return a;});
                books.play.md.lnl=books.play.md.lns.flatMap((a,i)=>a.map((_,k)=>[i,k])); // every line of the whole book in reading order – pl5b/pl6b walk this, so a page border never stops the hands
                books.play.md.wc=books.play.md.sts.map(s=>((s.txt||'').match(/\S+/g)||[]).length); // words per sentence – pl6a walks the whole text spine the same way
                books.play.md.tr=[];
                body.forEach(l=>{const h=l.match(/^(#{2,4})\s+(.*)$/),s=l.trim(),_m=/^\u{1F3B5}/u.test(s);if(h)books.play.md.tr.push({h:1,d:h[1].length-2,t:h[2].trim()});else if(s&&!_m)books.play.md.tr.push({h:0,t:s});});
                books.play.md.index();
                books.play.render.reset();
                books.play.render.draw();
                books.play.render.hash();
                const _p=books.play.inP; // ?p=<id> once the file is in – a book/version switch walks on after its own load
                if(_p&&!books.play.seenP){books.play.seenP=1;(books.play.ready||Promise.resolve()).then(()=>books.play.hiGo(_p));}else books.play.hiMore(); // the shelf decides which versions exist – wait for it
            }
            ,index:()=>{
                books.play.md.chs=[];
                books.play.md.subs=[];
                let ch=null;
                books.play.md.pages.forEach(p=>{if(p.h&&p.h[0]===2){if(ch)books.play.md.chs.push(ch);ch=[];}if(ch)ch.push(p);});
                if(ch)books.play.md.chs.push(ch);
                let su=null,ci=-1;
                books.play.md.subCh=[];
                books.play.md.pages.forEach(p=>{ if(p.h){if(su){books.play.md.subs.push(su);books.play.md.subCh.push(ci);}su=[];if(p.h[0]===2)ci++;} if(su)su.push(p);});
                if(su){books.play.md.subs.push(su);books.play.md.subCh.push(ci);}
            }
        }
        ,book:'LifeDemandedDeath',lg:'NO',ed:'PREM',shelf:null,pdf:null
        ,inP:new URLSearchParams(location.search).get('p') // the deep link, read once at load – nothing may rewrite ?p= before parse gets to use it
        ,root:'../' // play/ lives under Book/ – data root (b/, music.js) sits one level up
        ,fnOf:()=>books.play.root+'b/'+books.play.book+'/b_'+books.play.lg+'_'+books.play.ed+'.md'
        ,open:(lg,ed,to)=>{books.play.pdf=null;books.play.lg=lg||books.play.lg;books.play.ed=ed||books.play.ed;
            const l=document.getElementById('lang'),v=document.getElementById('ver');if(l)l.textContent=books.play.flag(books.play.lg);if(v)v.textContent=books.play.edIc(books.play.ed); // the nav head is optional – it is duplicated elsewhere
            const fn=books.play.fnOf(),reload=fn!==books.play.md.fn;
            books.play.render.pending=reload?(to||0):null; // a reload ends in reset(), which applies the target layer
            books.play.md.set(fn);
            if(!reload)books.play.render.go(to||0);        // already loaded → nothing async to wait for
        }
        ,openPdf:p=>{ // a book with no markdown yet (CV): show the PDF itself, and empty the md model so no stale chapters linger
            books.play.pdf=p;books.play.md.fn='';
            ['title','pages','chs','subs','subCh','pgs','sts','tr','lns','lnl','wc'].forEach(k=>books.play.md[k]=[]);
            books.play.md.title='';books.play.render.ch=0;books.play.render.su=0;books.play.render.idx=0;
            const t=document.getElementById('dbTitle');if(t)t.textContent=books.play.titleOf(books.play.book,books.play.lg);
            books.play.render.go(0);
        }
        ,lang:()=>{books.play.open(/NO_/.test(books.play.md.fn)?'EN':'NO');}
        ,ver:()=>{books.play.open(books.play.lg,books.play.ed==='PREM'?'FREE':'PREM');}
        ,flag:lg=>lg==='NO'?'\u{1F1F3}\u{1F1F4}':'\u{1F1EC}\u{1F1E7}' // 🇳🇴 / 🇬🇧 – same icons as the #lang button
        ,edIc:ed=>ed==='PREM'?'\u{1F451}':'\u{1F513}'                   // 👑 / 🔓 – same icons as the #ver button
        ,titleOf:(bk,lg,ed)=>{ // custom shelf title – most specific wins: that version, then book›lg›ed, then book›lg, then the book string.
            lg=lg||books.play.lg; ed=ed||books.play.ed; // Never fall back ACROSS languages: NO and EN titles differ, and PREM/FREE may too.
            const man=((books.play.manifest||{}).books||[]).find(x=>x.book===bk)||{};
            const ver=(books.play.versionsOf(man).find(x=>x.lg===lg&&x.ed===ed)||{}).title; // per-version title from the edit window
            if(ver)return ver;
            const t=((books.play.shelf||[]).find(x=>x.book===bk)||{}).title;
            if(typeof t==='string'&&t)return t;
            if(t){const v=t[lg],r=(typeof v==='string'?v:'')||((v&&typeof v==='object')&&v[ed])||t[lg+'_'+ed];if(r)return r;}
            return (bk===books.play.book&&books.play.md.title)?books.play.md.title:bk; // else the open file's own H1, else the folder name
        }
        ,copies:()=>(books.play.shelf||[]).filter(x=>x.book===books.play.book) // the Book Copy level: this book's own versions, language × edition (or its PDF)
        ,verLab:v=>v.pdf?'\u{1F4D5} '+books.play.titleOf(v.book):books.play.flag(v.lg)+books.play.edIc(v.ed)+' '+books.play.titleOf(v.book,v.lg,v.ed)
        ,verOn:()=>{const v=books.play.copies().find(x=>(x.fn&&x.fn===books.play.md.fn)||(x.pdf&&x.pdf===books.play.pdf));return v?books.play.verLab(v):'';} // the copy you are reading, named the same way its area is
        ,nodename:pl=>{ // the ACTUAL node sitting at that level right now – the level's own name is only metadata
            const md=books.play.md,R=books.play.render,sg=books.play.render.slug;
            const bk=books.play.book,bt=books.play.titleOf(bk),w=(((md.sts[R.curSent()]||{}).txt||'').match(/\S+/g)||[])[R.wi]||'';
            const ch=(md.chs[R.ch]||[])[0],su=(R.cSub()||[])[0],pg=md.pages[R.curPage()]||{};
            const one=s=>String(s||'').slice(0,40);
            return ({
                pl0:bk?(bk+(sg(bt)===sg(bk)?'':' · '+bt)):'',                                    // the book on the shelf
                pl1:md.title?(books.play.flag(books.play.lg)+books.play.edIc(books.play.ed)+' '+books.play.titleOf(bk,books.play.lg,books.play.ed)):'', // the book copy you are reading
                pl2:ch&&ch.h?ch.h[1]:'',                                                               // the main chapter
                pl3:su&&su.h?su.h[1]:'',                                                               // the sub chapter
                pl4b:pg.pn?String(pg.pn):'',                                                      // the page – named by its page number, never by the heading it happens to start with
                pl4a:one((md.pgs[R.curPar()]||{}).txt),                                                // the paragraph
                pl5a:one((md.sts[R.curSent()]||{}).txt),                                                // the sentence
                pl6a:w,pl5b:(R.curLine()||{}).t||'',pl6b:(R.curLine()||{}).t||''                                                           // not tracked yet → caller falls back to the level name
            })[pl]||'';
        }
        ,pick:(b,lg,ed)=>{books.play.book=b;const vs=(books.play.shelf||[]).filter(x=>x.book===b),l=lg||books.play.lg,e=ed||books.play.ed; // keep the wanted variant if this book has it, else take one it does
            const v=vs.find(x=>x.lg===l&&x.ed===e)||vs.find(x=>x.lg===l)||vs.find(x=>x.lg===books.play.lg)||vs[0];
            if(v&&v.pdf)books.play.openPdf(v.pdf);else if(v)books.play.open(v.lg,v.ed);else books.play.open();}
        ,ovKey:'play.shelf.override'
        ,editOn:false // shelf: view the versions as links, or edit books/versions
        ,manifest:null,src:'' // the editable shelf manifest + where it came from
        ,versionsOf:x=>x.versions&&x.versions.length?x.versions:(x.lg&&x.ed?x.lg.flatMap(lg=>x.ed.map(ed=>({lg,ed}))):[]) // one place that knows both manifest shapes
        ,rebuild:()=>{ // manifest object → the flat list the nav browses
            const man=books.play.manifest||{books:[]},o=[];
            (man.books||[]).forEach(x=>{
                books.play.versionsOf(x).forEach(v=>o.push({book:x.book,title:x.title,lg:v.lg,ed:v.ed,fn:books.play.root+'b/'+x.book+'/b_'+v.lg+'_'+v.ed+'.md'}));
                if(x.pdf)o.push({book:x.book,title:x.title,pdf:x.pdf,fn:''});
            });
            books.play.shelf=o;
            books.play.loadAll();
            return o;
        }
        ,texts:{} // every copy's markdown, read once – the shelf level shows the copies, and the shelf is itself the level above a book copy, so all of them are needed
        ,loadAll:()=>{ // read the books on the shelf in the background; the analysis compares them, so all of them have to be in
            const p=books.play;if(p.md.fn&&p.md.txt)p.texts[p.md.fn]=p.md.txt; // the copy being read is already here
            const fs=[...new Set((p.shelf||[]).filter(v=>v.fn).map(v=>v.fn))].filter(fn=>p.texts[fn]===undefined);
            if(!fs.length)return;
            Promise.all(fs.map(fn=>fetch(fn,{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>{p.texts[fn]=t;},()=>{p.texts[fn]='';})))
                .then(()=>{p.cloud.dfFn=null;p.sem.Z.nav.last='';p.sem.Z.nav.draw();}); // the whole shelf is in – draw the clouds again
        }
        ,persist:()=>{try{localStorage.setItem(books.play.ovKey,JSON.stringify(books.play.manifest));books.play.src='localStorage';}catch(e){}}
        ,seSet:(bs,redraw)=>{books.play.manifest=Object.assign({},books.play.manifest||{},{books:bs});books.play.persist();books.play.rebuild();books.play.render.toc();if(redraw)books.play.render.draw();}
        ,selIdx:()=>{const i=((books.play.manifest||{}).books||[]).map(x=>x.book).indexOf(books.play.book);return i<0?0:i;} // the details follow the selected book
        ,seRead:()=>{ // the details panel's DOM → the books array. Only the shown book is in the DOM, so the rest are carried over.
            const root=document.querySelector('#page .se'),bs=((books.play.manifest||{}).books||[]).slice();
            const el=root&&root.querySelector('.seBook');if(!el)return bs;
            const i=+root.dataset.b||0,prev=bs[i]||{};
            const b={book:(el.querySelector('[data-se="book"]').value||'').trim()};
            if(prev.title)b.title=prev.title; // book-level keys the form does not show are preserved
            if(prev.pdf!==undefined&&!el.querySelector('[data-se="pdfOn"]'))b.pdf=prev.pdf;
            const vs=[];
            el.querySelectorAll('input[data-se="on"]').forEach(cb=>{
                if(!cb.checked)return;
                const t=(cb.closest('.seV').querySelector('[data-se="vt"]')||{}).value||'';
                const v={lg:cb.dataset.lg,ed:cb.dataset.ed};
                if(t.trim())v.title=t.trim();
                vs.push(v);
            });
            if(vs.length)b.versions=vs;
            const po=el.querySelector('[data-se="pdfOn"]'),p=el.querySelector('[data-se="p"]');
            if(po&&po.checked&&p&&p.value.trim())b.pdf=p.value.trim();
            bs[i]=b;
            return bs;
        }
        ,seAdd:()=>{const bs=books.play.seRead(),nb='NewBook';bs.push({book:nb});books.play.book=nb;books.play.seSet(bs,true);}
        ,seDel:el=>{const bs=books.play.seRead(),i=+el.closest('.se').dataset.b;bs.splice(i,1);books.play.book=((bs[Math.min(i,bs.length-1)]||{}).book)||'';books.play.seSet(bs,true);}
        ,seOpen:(lg,ed)=>{books.play.seSet(books.play.seRead(),false);books.play.open(lg,ed,1);} // a version → jump down a level
        ,seCopy:()=>{const txt=JSON.stringify(books.play.manifest,null,1);
            const say=m=>{const s=document.getElementById('seMsg');if(s)s.textContent=m;};
            if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(()=>say('JSON copied – paste it into b/shelf.json')).catch(()=>say('Could not copy'));
            else say('Cut the JSON below by hand');}
        ,seReset:()=>{try{localStorage.removeItem(books.play.ovKey);}catch(e){}books.play.manifest=null;books.play.probe().then(()=>{books.play.render.toc();books.play.render.draw();});}
        ,probe:async()=>{
            // Shelf = what is available, from ONE manifest read. Guessing (books × lg × ed) costs a 404 per
            // missing file and the browser logs those regardless of fetch options – a manifest is the quiet way.
            const mix=(bs,lgs,eds)=>{const o=[];bs.forEach(b=>lgs.forEach(lg=>eds.forEach(ed=>o.push({book:b,lg,ed,fn:books.play.root+'b/'+b+'/b_'+lg+'_'+ed+'.md'}))));return o;};
            let man=null,src='';
            try{const ov=localStorage.getItem(books.play.ovKey);if(ov){man=JSON.parse(ov);src='localStorage';}}catch(e){} // an edit-window override wins
            if(!man||!Array.isArray(man.books)){
                man=await fetch(books.play.root+'b/shelf.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
                src=man?'shelf.json':'';
            }
            if(man&&Array.isArray(man.books)){books.play.manifest=man;books.play.src=src;return books.play.rebuild();} // even an empty books[] is authoritative
            const cs=mix(books.play.md.books,['NO','EN'],['FREE','PREM']),ok=[]; // no manifest at all → guess (noisy, but still works)
            for(const c of cs){let good=false;try{const r=await fetch(c.fn,{cache:'no-store'});good=r.ok;}catch(e){}if(good)ok.push(c);}
            books.play.shelf=ok;books.play.loadAll();return ok;
        }
        // --- Spotify, as-is from LdD.* ---
        ,SpotRe:/^https:\/\/(?:gormb\.github\.io\/_\/?\?m|aigap\.no\/m)(?!.*qr$)\S*/i
        ,SpotMap:null
        ,SpotLoad:async(force)=>{ // redir table (db.js → window.SUPABASE): code → spotify url
            if(books.play.SpotMap&&!force)return books.play.SpotMap;
            const m={},cfg=window.SUPABASE||{};
            if(cfg.url&&!cfg.url.includes('YOUR-')){
                try{const{createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
                    const{data}=await createClient(cfg.url,cfg.publishableKey).from('redir').select('id,url,"group"');
                    // music links may be tracks and/or playlists (groups 'music', 'playlist', ...)
                    (data||[]).filter(r=>/music|playlist/i.test(String(r.group||'').trim())).forEach(r=>{
                        if(!r.id)return;
                        m[r.id]=r.url;
                        if(r.id[0]==='m')m[r.id.slice(1)]=r.url; else m['m'+r.id]=r.url;
                        if(r.id.endsWith('qr'))m[r.id.slice(0,-2)]=r.url;   // QR-variant ids: the bare code is what the book uses
                        if(r.id.endsWith('qra'))m[r.id.slice(0,-3)]=r.url;  // e.g. 'msoeqra' -> 'msoe'
                    });
                }catch(e){console.error('[Spotify] Supabase lookup failed',e);}
            }
            return books.play.SpotMap=m;
        }
        ,SpotKey:(url)=>{ // song code: gormb query (?msoe) or aigap path (/msoe)
            if(!url)return '';
            try{const u=new URL(url);
                if(/^https:\/\/gormb\.github\.io\//.test(url))return u.search.slice(1);
                if(/^https:\/\/aigap\.no\//.test(url))return u.pathname.replace(/^\//,'');
            }catch(e){}
            return '';
        }
        ,SpotUrl:async(url)=>{
            if(!url)return url;
            const map=await books.play.SpotLoad(),key=books.play.SpotKey(url);
            if(!key)return url;
            const resolved=map[key]||url;
            console.log('[Spotify] URL resolve',{key,resolved,found:resolved!==url});
            return resolved;
        }
        ,spStop:()=>{
            document.querySelectorAll('[data-spotify-play-active]').forEach(b=>{b.style.visibility='';b.removeAttribute('data-spotify-play-active');});
            const f=document.getElementById('_spPlayer'),c=document.getElementById('_spCollapse');
            if(f){f.src='about:blank';f.style.display='none';f.title='';}
            if(c)c.style.display='none';
        }
        ,spTgl:async(e)=>{ // ONE shared player (in the pl6b media view) + ONE 🎶 stop button
            const u=e.dataset?.u||e.href||'';
            const holder=document.getElementById('spHolder')||document.body;
            let f=document.getElementById('_spPlayer');
            if(!f){f=document.createElement('iframe');f.id='_spPlayer';f.className='spotify-inline';f.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';}
            holder.appendChild(f); // holder is rebuilt on each draw → re-attach
            let c=document.getElementById('_spCollapse');
            if(!c){c=document.createElement('button');c.id='_spCollapse';c.textContent='\u{1F3B6}';c.title='Stop music';c.style.display='none';c.onmousedown=books.play.spStop;document.body.appendChild(c);}
            document.querySelectorAll('[data-spotify-play-active]').forEach(b=>{b.style.visibility='';b.removeAttribute('data-spotify-play-active');});
            const url=await books.play.SpotUrl(u);
            const embed=url.replace('open.spotify.com/','open.spotify.com/embed/');
            f.dataset.u=url;
            e.style.setProperty('visibility','hidden','important');
            e.setAttribute('data-spotify-play-active','');
            f.src=embed.includes('open.spotify.com/embed/')?embed:'about:blank';
            if(f.src==='about:blank'){f.style.border='0.2vw solid #c00';f.title='Music unavailable';}else{f.style.border='0';f.title='';}
            f.style.display='block'; // player may have been hidden by 🎶 – show again
            c.style.display='block';
        }
        ,LV:[
            {pl:'pl0',t:'Book Shelf',q:'Which books are relevant for the content?',nav:'Every book concept on the shelf, each with its own versions beneath it – clicking a concept selects that book, each version (🇳🇴/🇬🇧 × 👑/🔓, or a PDF) opens that book copy',page:'The chosen book: its versions as links, and the edit window (✎ in the nav) where books and versions are added, renamed or removed',thoughts:'At shelf scale the units are books, which are filtered by concept, genre and language. A work may be published in several binds – a bind is the physical book, one of a series – and a bind comes on the shelf as its own book (own folder, own file), so the binds of a work stand side by side here. Each book can be in different versions and languages (especially now premium/freemium and NO/EN but later also eg DK) The nav lists all concepts at once, because this is the level where the book itself is chosen.',child:[{t:'Which book and version?',w:'The shelf is the entry point: pick a book (LifeDemandedDeath, CV, ABook) plus version – language (NO/EN) × edition (FREE/PREM). The version pins the source file b/{book}/b_{NO|EN}_{FREE|PREM}.md. A work in several binds is several books here, one per bind.'},{t:'Concept or genre',w:'Filter the shelf by concept or genre (memoir, fiction, essay) so a theme-led reader reaches the right book without knowing the title in advance.'},{t:'Style or language',w:'Style (poetic/plain) and language narrow the shelf further, and are reused as filters at the deeper levels described in pl_dev_0.'}]}
            ,{pl:'pl1',t:'Book Copy',q:'What is the overall structure of the content?',nav:'The copy you are reading – the physical book, in its language and edition (a work in several binds is several books on the shelf, one per bind) – with its main chapters beneath it, each chapter opens that chapter',page:'The whole copy in reading order: every main chapter and sub chapter as one text',thoughts:'At book copy scale the unit is the physical book you hold, in its language and edition – those two pin the source file b/{book}/b_{lang}_{edition}.md. When a work runs over several binds, each bind is its own book on the shelf, with its own folder and its own file, so it arrives here as its own copy too; a bind has its own spine: its own chapter sequence, its own start and end, its own numbering. The abstract work is the shelf level above, which is why the copy is what can be lent, annotated and read from cover to cover. The units here are chapters (##) and their sub-sections (###); the nav jumps straight to a chapter, which then acts as parent for the finer levels below it.',child:[{t:'Which bind?',w:'Which bind of the series this copy is, and what it holds: where it begins and ends, and its own chapter numbering. A bind is not a variant of one file – it is its own book on the shelf, with its own folder and its own file, so the binds of a work stand side by side as separate entries.'},{t:'Which chapter?',w:'At book copy scale the units are chapters (##) and their sub-sections (###); the nav jumps straight to a chapter, which then acts as parent for the finer levels below it.'},{t:'\u201CHero\u2019s Journey\u201D – which stage?',w:'Annotate each chapter against the narrative arc (call, ordeal, return…) so readers see where the structure is conventional and where it deliberately breaks.'},{t:'What needs work',w:'Collect copy-scale improvements – chapters that are too thin, too dense or out of order – as the work queue that the finer zoom levels then act on.'}]}
            ,{pl:'pl2',t:'Main Chapter',q:'What is in this Main Chapter, and what are the Sub Chapters?',nav:'The main chapter you are on, with its sub chapters beneath it – each sub chapter opens that sub chapter',page:'That one main chapter: every sub chapter under it, in reading order',thoughts:'At Main Chapter scale the units are groups of chapters that share a theme; the section acts as the coarser parent of its chapters.',child:[{t:'Which chapters?',w:'List the chapters inside this section and their order.'},{t:'Which theme?',w:'The theme or arc that binds the section\u2019s chapters together.'},{t:'What needs work',w:'Section-level improvements: pacing, ordering and balance across chapters.'}]}
            ,{pl:'pl3',t:'Sub Chapter',q:'What is in this Sub Chapter?',nav:'The sub chapter you are on, and beneath it its pages on the left beside its paragraphs on the right – a click opens that page or that paragraph',page:'That sub chapter: its 🎵 song, then its whole text, page by page',thoughts:'At Sub Chapters scale the units are single chapters; the nav jumps into the chapter and its pages.',child:[{t:'Which pages?',w:'Which pages belong to the chapter, and in which order.'},{t:'What happens?',w:'What the chapter advances in the story or argument.'},{t:'What needs work',w:'Chapter-level improvements: too thin, too dense or out of order.'}]}
            ,{pl:'pl4b',t:'Page',q:'What is on this page?',nav:'The page you are on, with its lines beneath it – each line opens the Line level',page:'That page: the fragment a paragraph continues with, then the paragraphs that start on it, set as lines; 🫲/🫱 walk the pages',thoughts:'At page scale the units are pages (with p.N anchors); the nav jumps between pages, and the lines are the page\u2019s own typographic decomposition \u2013 the anchor eye tracking later maps a gaze to.',child:[{t:'Which lines?',w:'The lines the page is set in: word wrapped at the golden-ratio measure (\u224866 characters), at 1.15 line spacing.'},{t:'What is conveyed?',w:'What the page communicates: content, mood or key point.'},{t:'What needs work',w:'Page-level polish: flow, rhythm and visual balance.'}]}
            ,{pl:'pl4a',t:'Paragraph',q:'What is in this paragraph?',nav:'The paragraph you are on, with its sentences beneath it – each sentence opens the Sentence level',page:'That paragraph read as text: the block its sentences build',thoughts:'At paragraph scale the units are paragraphs – blocks of related sentences.',child:[{t:'Which sentences?',w:'The sentences that build this paragraph.'},{t:'What is said?',w:'The paragraph\u2019s main point or idea.'},{t:'What needs work',w:'Paragraph-level edits: clarity, rhythm and transitions.'}]}
            ,{pl:'pl5a',t:'Sentence',q:'What is in this sentence?',nav:'The sentence you are on, with its words beneath it – each word opens the Word level',page:'That sentence read as text: grammar, word order and tone are decided here',thoughts:'At sentence scale the units are sentences; grammar and style tools live here.',child:[{t:'Which words?',w:'The words that form the sentence and their roles.'},{t:'What does it mean?',w:'The meaning and function of the sentence in context.'},{t:'What needs work',w:'Sentence-level improvements: grammar, word order and tone.'}]}
            ,{pl:'pl6a',t:'Word',q:'What is in this word?',nav:'The word you are on, standing alone as the node – the finest unit of the text spine',page:'That word set large, with its path and the question it answers: meaning, inflection and usage',thoughts:'At word scale the units are words: meaning, inflection and what to improve. Word-level features (lookup, glossary) apply here and deeper.',child:[{t:'What does the word mean',w:'Look up meaning, inflections and usage – the finest content level where dictionary lookup applies.'},{t:'What needs work',w:'Which word needs editorial attention: clarity, style or accuracy.'}]}
            ,{pl:'pl5b',t:'Line',q:'What is on this line?',nav:'The line you are on, with its four media forms beneath it – Foreground, Background, Sound and Motion, each opening the Media Form level',page:'That line read as text: its length against the measure, where it breaks, and how it is set',thoughts:'At line scale the unit is one measured line of the page: its length against the golden-ratio measure, where it breaks, and its leading. A gaze lands on a line, so eye tracking belongs here.',child:[{t:'Line length',w:'How much the line carries, measured against the golden-ratio optimum of about 66 characters.'},{t:'Line breaks',w:'Where the line breaks and why: word wrap, hyphenation or a deliberate break.'},{t:'Typeface, size and leading',w:'Which face and size set the line, and the 1.15 line spacing that fixes the page grid.'},{t:'Ligatures and kerning',w:'Pairs that join or tighten inside the line (fi, fl, AV).'}]}
            ,{pl:'pl6b',t:'Media Form',q:'Which modalities shape the presented unit?',nav:'The line you are on, standing alone as the node – the line whose media is drawn',page:'Its four media rows: colour, background, sound (Spotify Play) and motion',thoughts:'At media-form scale the unit is the presented materialisation of the finer node: the same content carried by a modality – visual (colour, background, image), auditory (music/Spotify), motion (video). Modalities are dimensions, so each is one row here; Spotify playback is the auditory dimension, anchored to the page (🎵 … — p. N) and drawn for the line.',child:[{t:'🎨 Foreground (colour)',w:'Which colour renders the presented unit; changing colour restyles it as a whole.'},{t:'🖼️ Background',w:'What renders behind the unit: solid colour, gradient or image.'},{t:'🎵 Sound – Spotify Play',w:'The song is a media form anchored to its Sub Chapter (### — p. N) heading; pages inside that subchapter inherit it. Decode the aigap.no/m-code (SpotKey), resolve it to a Spotify URL and embed the player here.'},{t:'🎬 Motion / video',w:'Motion or video as a media form for the presented unit.'}]}
        ]
        ,up:{pl0:null,pl1:'pl0',pl1c:'pl0',pl2:'pl1',pl3:'pl2',pl4a:'pl3',pl4b:'pl3',pl5a:'pl4a',pl5b:'pl4b',pl6a:'pl5a',pl6b:'pl5b'}
        ,child:pl=>{const k=pl==='pl1c'?'pl1':pl;return k==='pl0'?['pl1c']:books.play.LV.filter(x=>books.play.up[x.pl]===k).map(x=>x.pl);} // the shelf's children are the copies (the Book Copy level); the copy level stands where pl1 stands, so every walk down the level tree runs on through pl2 and pl3 as before
        ,ix:pl=>{if(pl==='pl1c')pl='pl1';const i=books.play.LV.findIndex(x=>x.pl===pl);return i<0?0:i;}
        ,id:i=>(books.play.LV[i]||{}).pl||('pl'+i)
        ,ancestors:pl=>{const a=[];let p=books.play.up[pl];while(p){a.unshift(p);p=books.play.up[p];}return a;}
        ,path:pl=>books.play.ancestors(pl).concat(pl)
        ,chain:pl=>books.play.path(pl).map(p=>{const L=books.play.LV.find(x=>x.pl===p);return L?L.t:'';}).filter(Boolean).join(' › ')
        ,loc:()=>({book:books.play.book,lg:books.play.lg,ed:books.play.ed,pg:0})
        ,step:(l,v,c)=>{
            const t=(v||'').toLowerCase().replace(/\s/g,''),o={lg:c.lg,ed:c.ed,book:c.book,pg:c.pg};
            if(l===0){
                if(/^(no|en)$/.test(t))o.lg=t.toUpperCase();
                else if(/^(pre|free)$/.test(t))o.ed=t==='pre'?'PREM':'FREE';
                else{const m=books.play.md.books.find(b=>{const n=b.toLowerCase();return n.startsWith(t)||n.includes(t);});if(m)o.book=m;}
            }else if(l===4&&/^\d+$/.test(t))o.pg=+t;
            return o;
        }
        ,ref:(p,c)=>((a,c0)=>a.length<2?c0:books.play.ref(a.slice(2),books.play.step(+a[0],a[1],c0)))(typeof p==='string'?p.split('_'):p,c||books.play.loc())
        // --- the id: one token per level, each the shortest part of that node's name that is unique among its siblings ---
        ,hiCut:(ns,c)=>{const lo=x=>String(x==null?'':x).trim().toLowerCase(),n=lo(c);if(/^\d+$/.test(n))return n;let k=1;for(;k<n.length&&ns.filter(x=>lo(x).slice(0,k)===n.slice(0,k)).length>1;k++);return n.slice(0,k);} // a number is never cut short: page 125 must not read as 1 or 5
        ,hiFit:(ns,t)=>{const lo=x=>String(x==null?'':x).trim().toLowerCase(),q=lo(t);if(q==='*')return ns[0];return ns.find(x=>lo(x)===q)||ns.find(x=>lo(x).startsWith(q));} // exact first, then a prefix – '*' = any – and the first match among siblings is the first
        ,names:pl=>{ // per level: the names to be unique among, the name that is on, how to pick one (a cut token resolves by prefix), and the position you stand at. The position is never drawn – the level shows all its nodes alike – it is only what ↓ walks into
            const R=books.play.render,md=books.play.md,s=books.play.shelf||[],su=R.cSub()||[]
                ,pn=p=>p&&p.h?p.h[1]:(p&&p.pn?'#'+p.pn:'') // a chapter/sub chapter is named by its heading
                ,pgn=p=>p&&p.pn?String(p.pn):'' // a PAGE is named by its bare number – the name of the page, not an anchor, so no #
                ,bk=[...new Set([...s.map(x=>x.book),...md.books])]
                ,vs=s.filter(x=>x.book===books.play.book)
                ,lgs=[...new Set(vs.filter(x=>x.lg).map(x=>x.lg))],eds=[...new Set(vs.filter(x=>x.lg===books.play.lg).map(x=>x.ed))]
                ,cps=books.play.copies().map(v=>books.play.verLab(v))
                ,ch=md.chs.map(c=>pn(c[0])),ks=R.chSubs(R.ch),subs=ks.map(k=>pn((md.subs[k]||[])[0])),pgs=su.map(pgn)
                ,pars=md.pgs.filter(p=>su.some(q=>q.pn===p.pn))
                ,ss=R.sentT((md.pgs[R.curPar()]||{}).txt||'')
                ,ws=(((md.sts[R.si]||{}).txt||'').match(/\S+/g)||[])
                ,lns=R.lnsOf().map(l=>l.t); // the page's lines – what pl5b is unique among
            const f=(ns,t)=>books.play.hiFit(ns,t);
            return ({
                pl0:[bk,books.play.book,t=>books.play.pick(f(bk,t)||t)]
                ,pl1:[lgs,books.play.lg,t=>books.play.open(t,books.play.ed,1)]
                ,pl1e:[eds,books.play.ed,t=>books.play.open(books.play.lg,t,1)]
                ,pl1c:[cps,books.play.verOn(),t=>{const v=books.play.copies()[cps.indexOf(t)];if(!v)return;if(v.pdf)books.play.openPdf(v.pdf);else books.play.open(v.lg,v.ed,1);},cps.indexOf(books.play.verOn())]
                ,pl2:[ch,pn((md.chs[R.ch]||[])[0]),t=>{const h=f(ch,t);if(h!==undefined)R.setCh(ch.indexOf(h));},R.ch]
                ,pl3:[subs,pn(su[0]),t=>{const h=f(subs,t);if(h!==undefined)R.setSu(ks[subs.indexOf(h)]);},ks.indexOf(R.su)]
                ,pl4b:[pgs,pgn(md.pages[R.pi]),t=>{const h=f(pgs,t);if(h!==undefined){R.pi=(su[pgs.indexOf(h)]||{}).pgi||0;R.idx=R.pi+1;}},pgs.indexOf(pgn(md.pages[R.pi]))]
                ,pl4a:[pars.map(p=>p.txt),String((md.pgs[R.curPar()]||{}).txt||''),t=>{const h=f(pars.map(p=>p.txt),t),p=h!==undefined?pars.find(p=>p.txt===h):null;if(p)R.idx=md.pgs.indexOf(p);},pars.indexOf(md.pgs[R.curPar()])]
                ,pl5a:[ss,String((md.sts[R.curSent()]||{}).txt||''),t=>{const h=f(ss,t);if(h!==undefined)R.idx=R.si=R.baseOf(R.curPar())+ss.indexOf(h);},R.curSent()-R.baseOf(R.curPar())]
                ,pl5b:[lns,((R.curLine()||{}).t)||'',t=>{const h=f(lns,t);if(h!==undefined)R.li=lns.indexOf(h);},R.li]
                ,pl6a:[ws,ws[R.wi]||'',t=>{const h=f(ws,t);if(h!==undefined)R.wi=R.idx=ws.indexOf(h);},R.wi]
                ,pl6b:[[''],'',()=>{},0]
            })[pl]||[[''],'',()=>{}];
        }
        ,txtOf:(pl,k,fb)=>{ // what the node at position k holds. The position is the one names() lists it at, and every list below is that same list – the name and the text can never point at two different nodes
            const md=books.play.md,R=books.play.render,ks=R.chSubs(R.ch),su=R.cSub()||[]
                ,pars=md.pgs.filter(p=>su.some(q=>q.pn===p.pn))
                ,tx=a=>(a||[]).filter(Boolean).map(p=>md.pgs.filter(q=>q.pn===p.pn).map(q=>q.txt).join(' ')).join(' ');
            const t={pl1c:(books.play.texts[(books.play.copies()[k]||{}).fn]||''),pl1:md.pgs.map(p=>p.txt).join(' '),pl2:tx(md.chs[k]),pl3:tx(md.subs[ks[k]]),pl4b:tx([su[k]]),pl4a:(pars[k]||{}).txt,pl5b:(R.lnsOf()[k]||{}).t,pl5a:(R.sentT((md.pgs[R.curPar()]||{}).txt||'')[k]||'')}[pl]; // pl1: the copy being read is its paragraphs, not the raw marks – the base of every base has to be words alone
            return t!==undefined?t:(fb||''); // the leaf levels (paragraph, sentence, word) are named by their own text, which the caller hands over
        }
        ,cloud:{ // the words a text is carried by, heaviest first
            stop:/^(og|i|til|med|av|for|en|et|den|det|de|som|er|var|at|om|men|å|på|ikke|så|når|da|her|der|fra|ved|ut|inn|opp|ned|seg|kan|skal|vil|må|hadde|har|ble|blir|han|hun|jeg|du|vi|the|and|of|to|a|in|is|it|that|with|for|on|as|at|by|from|but|or|an|be|was|were|his|her|he|she|they|you|not)$/i
            ,words:(s,n,q)=>{const m={},f=String(q||'').toLowerCase(); // the words a text is carried by – read through the filter as well, and after the cut: the cut decides what is counted and what the count is weighed against, the filter then decides what of it is worth showing. Both, in that order
                (String(s||'').toLowerCase().match(/[\p{L}][\p{L}'-]*/gu)||[]).forEach(w=>{if(w.length<4||books.play.cloud.stop.test(w)||(f&&w.indexOf(f)<0))return;m[w]=(m[w]||0)+1;});
                return Object.keys(m).map(w=>[w,m[w]]).sort((x,y)=>y[1]-x[1]).slice(0,n||16);}
            ,tx:new Map() // each text as it stands under the filter that was last put to it – one entry per text, so that keying another letter cuts it again without the text being split up first
            ,cut:(s,q)=>{const c=books.play.cloud,t=String(s||''),k=String(q||'').toLowerCase(),e=c.tx.get(t); // what was keyed is read off the TEXT first: only the sentences that carry it are left, and the map is built on those – the words that stand outside them are neither counted nor weighed in. The filter is folded to lower case: dictation arrives with capitals, the words of the copy do not
                if(e&&e.q===k)return e.t;
                const v=k?books.play.render.sentT(t).filter(x=>x.toLowerCase().indexOf(k)>=0).join(' '):t;
                c.tx.set(t,{q:k,t:v});return v;}
            ,html:(s,n,q,b)=>{ // weighed against the level above: a word only this node carries stands green and heavy, one the level above carries just as much goes blue and small, and what lies between is a mix. On a book copy that level is the shelf (all books), on a page it is the sub chapter – the main chapter when that sub chapter holds one page only – and so on up for as long as the level below the base has but one node in it. The filter cuts both sides alike: the text this node is mapped from, and the text it is read against
                const c=books.play.cloud,t=c.cut(s,q),df=c.dfOf(b||c.above(),q)
                    ,a=c.words(t,Infinity,q).map(x=>[x[0],x[1]/(df[x[0]]||x[1])]).sort((x,y)=>y[1]-x[1]).slice(0,n||16);
                if(!a.length)return '';const mx=a[0][1];
                return a.map(x=>'<span style="font-size:'+(0.75+0.85*x[1]/mx).toFixed(2)+'em;color:hsl('+Math.round(120+100*(1-x[1]))+',70%,25%)">'+books.play.render.esc(x[0])+'</span>').join('');}
            ,df:{},dfFn:'' // how often each word stands in that level above – the divisor a node's own count is read against, counted once per base
            ,shelf:()=>{const ts=Object.values(books.play.texts).filter(Boolean);return ts.length?ts.join(' '):books.play.md.txt;} // every copy of every book on the shelf, as one text – the top a base can reach
            ,above:()=>{ // what the clouds of this level are read against: the level above the one you stand on – and the level above that again for as long as the level below it holds a single node, since a level carrying exactly the same words tells nothing
                const R=books.play.render,up=books.play.up;let below=books.play.id(R.mode),pl=up[below];
                while(pl&&(books.play.names(below)[0]||[]).length<2){below=pl;pl=up[pl];} // one node only below → that node again, one level up
                const a=pl?books.play.names(pl):null,i=a?(a[3]||0):0;
                return {key:(pl||'pl0')+'|'+(a?String(a[1]||'').slice(0,24):'')+'|'+i+'|'+(books.play.md.fn||''),
                        txt:(pl?books.play.txtOf(pl,i,''):'')||books.play.cloud.shelf()};} // nothing above at all (the shelf itself) → every book is the base
            ,dfOf:(b,q)=>{const c=books.play.cloud,k=b.key+'|'+(q||'');if(c.dfFn===k)return c.df; // counted once per base and filter: the text above is cut, and read through the filter, exactly as the clouds below it are
                const m={};c.words(c.cut(b.txt,q),Infinity,q).forEach(x=>m[x[0]]=x[1]);c.dfFn=k;return c.df=m;}
        }
        ,hi:()=>{ // #hiId ← what is selected: the top layer (book*language*edition) before the first '.', then one token per level below
            const m=books.play.render.mode
                ,ns=['pl0','pl1','pl1e','pl2','pl3'].slice(0,m<4?[0,3,4,5][m]:5) // nothing at the shelf – it lists every book concept itself; from the book copy up the same segment names book*language*edition
                    .concat(m<4?[]:m===4?['pl4b']:m>7?['pl4b','pl5b']:['pl4a','pl5a','pl6a'].slice(0,m-4))
                ,tk=pl=>{const a=books.play.names(pl);return books.play.hiCut(a[0],a[1]);}
                ,k=m?3:1
                ,top=ns.slice(0,k).map(tk).filter(Boolean).join('*')
                ,deep=ns.slice(k).map(tk).filter(Boolean).join('.')
                ,id=deep?top+'.'+deep:top;
            const e=document.getElementById('hiId');if(e)e.textContent=id;
            const u=new URL(location.href);if(u.searchParams.get('p')!==id){u.searchParams.set('p',id);history.replaceState(history.state,'',u);} // only when it really changes, and without dropping history.state – other scripts keep their own data there
            return id;
        }
        ,hiGo:id=>{ // ?p=<book*language*edition>.<main chapter>.<sub chapter>… – a reload continues in hiMore. Any token may be '*' = any, ie the first
            const s=String(id||'').split('.'),t=s[0].split('*').map(x=>x.trim()); // the top layer: book concept, language, edition
            if(!t[0])t[0]='*'; // an empty book slot asks for any book
            books.play.pendId=s.slice(1).map(x=>x.trim());
            books.play.pendVer=!!t[1]||!!t[2]; // a named version lands on the book copy, a bare book concept on the shelf
            const a=books.play.names('pl0'),b=books.play.hiFit(a[0],t[0]);
            const lg=t[1]?books.play.hiFit(books.play.names('pl1')[0],t[1])||books.play.lg:books.play.lg // an unnamed axis keeps what is on
                ,ed=t[2]?books.play.hiFit(books.play.names('pl1e')[0],t[2])||books.play.ed:books.play.ed;
            if(b!==undefined&&b!==books.play.book)books.play.pick(b,lg,ed); // one load, straight to the named version – two loads would lose the layer we are walking to
            else if(!books.play.pdf&&(lg!==books.play.lg||ed!==books.play.ed))books.play.open(lg,ed,1); // a PDF-only book has no versions to switch
            if(!books.play.md.busy)books.play.hiMore(); // nothing in flight → walk on now
        }
        ,hiMore:()=>{ // main chapter, sub chapter, then page → line or paragraph → sentence → word
            const R=books.play.render,t=books.play.pendId;
            if(t===undefined||t===null)return; // an ordinary layer change – nothing to walk
            books.play.pendId=null;
            const ver=books.play.pendVer;books.play.pendVer=null;
            if(!t.length)return R.go(ver?1:0,1); // the version alone → the book copy, the book concept alone → the shelf
            const go=(p,k)=>{const a=books.play.names(p),h=t.length>k?books.play.hiFit(a[0],t[k]):undefined;if(h!==undefined)a[2](h);return h!==undefined;};
            if(!go('pl2',0))return R.go(ver?1:0,1);
            R.go(2,1);
            if(!go('pl3',1))return;
            R.go(3,1);
            if(go('pl4b',2)){R.go(4,1);if(go('pl5b',3))R.go(8,1);return;}
            if(!go('pl4a',2))return;
            R.go(5,1);
            if(!go('pl5a',3))return;
            R.go(6,1);
            if(go('pl6a',4))R.go(7,1);
        }
        ,render:{
            el:{page,nav:dbNavList,title:document.getElementById('dbTitle'),prev,next,lvBars}
            ,ic:['📚','📖','📑','📄','📃','¶','✍️','🔤','⎶','🎨']
            ,lv:[]
            ,mode:0,idx:0,pi:0,ch:0,su:0,pending:null,si:0,wi:0,li:0,wide:0 // ch/su = active chapter/sub, pending = layer after an async load, si/wi = sentence+word we drilled from, li = line of the page (pl5b), wide = this level was reached by a gesture zoom-out, so the pane shows the level whole and opens nothing
            ,setMode:()=>{const R=books.play.render,u=R.el.lvBars.querySelector('button[data-zm]');R.el.lvBars.querySelectorAll('button').forEach(x=>x.classList.toggle('on',+x.dataset.lv===R.mode));if(u)u.disabled=!books.play.up[books.play.id(R.mode)];}
            ,bar:()=>{const lv=books.play.render.lv,cld=books.play.child,ix=books.play.ix,btn=p=>{const o=lv[ix(p)]||{pl:p,nm:p,ic:'•'};return '<button data-lv="'+ix(p)+'" title="'+o.pl+' '+o.nm+'">'+o.ic+'</button>';},td1=p=>'<td rowspan="2">'+btn(p)+'</td>',tdx=p=>'<td>'+btn(p)+'</td>',chain=p=>{const a=[p];let c=cld(p);while(c.length===1){a.push(c[0]);c=cld(c[0]);}return a;};let node='pl0',cc=cld(node);while(cc.length===1){node=cc[0];cc=cld(node);}const spine=books.play.path(node),cols=cld(node).slice().reverse().map(chain);books.play.render.el.lvBars.innerHTML='<table><tr>'+spine.map(td1).join('')+(cols[0]||[]).map(p=>'<td class="txt">'+btn(p)+'</td>').join('')+'<td rowspan="2" class="zm"><button data-zm="up" title="coarser">\u{1F446}</button></td></tr><tr>'+(cols[1]||[]).map(p=>'<td class="pag">'+btn(p)+'</td>').join('')+'</tr></table>';books.play.render.el.lvBars.onclick=ev=>{const x=ev.target.closest('button');if(!x)return;if(x.dataset.zm==='up'){const p=books.play.up[books.play.id(books.play.render.mode)];if(p)books.play.render.go(books.play.ix(p));}else if(x.dataset.lv!==undefined){books.play.render.go(+x.dataset.lv);}};books.play.render.setMode();}
            ,chSubs:i=>books.play.md.subCh.map((c,k)=>c===i?k:-1).filter(k=>k>=0) // sub chapters of main chapter i
            ,cSub:()=>books.play.md.subs[books.play.render.su]||null
            ,setCh:i=>{ // selecting a main chapter moves the sub selection with it
                const n=books.play.md.chs.length;
                books.play.render.ch=n?Math.max(0,Math.min(n-1,i)):0;
                const ss=books.play.render.chSubs(books.play.render.ch);
                books.play.render.su=ss.length?ss[0]:0;
                books.play.render.idx=0;
            }
            ,setSu:i=>{const s=books.play.md.subs[i];if(!s)return;books.play.render.su=i;books.play.render.ch=books.play.md.subCh[i];books.play.render.idx=0;}
            ,go:(n,keep,wide)=>{if(!keep)books.play.render.align(n);books.play.render.wide=wide?1:0; // wide only ever arrives from a gesture zoom-out (drill): the level is drawn whole and the node at idx is NOT opened. Every other way in – a cell, a nav row, a level button or a zoom-in – opens it.
                books.play.render.mode=n;const sp=/^(pl\d+)([ab])$/.exec(books.play.id(n));if(sp)books.play.sem.Z.sp=sp[2];books.play.render.setMode();books.play.render.toc();books.play.render.draw();books.play.render.sync();}
            ,toc:()=>{
                const R=books.play.render,md=books.play.md,esc=R.esc,ic={2:'📖',3:'📑'}
                ,a2=(t,at,l,ico)=>'<a '+at+'>'+'&nbsp;'.repeat(2*l)+(ico?ico+'&nbsp;':'')+esc(t)+'</a>'
                ,a=(t,i,l,ico,m)=>t===''?'':a2(t,'data-i="'+i+'" data-m="'+(m===undefined?R.mode:m)+'"',l,ico)
                ,wOf=(si,wi)=>(((md.sts[si]||{}).txt||'').match(/\S+/g)||[])[wi]||''
                //,o0=(s=books.play.shelf||[],bk=books.play.book)=>[...new Set(s.map(x=>x.book))].map(b=>{const t=books.play.titleOf(b),sub=R.slug(t)===R.slug(b)?'':' <i class="bid">('+esc(t)+')</i>';return ['<a data-book="'+esc(b)+'" class="lvnode'+(b===bk?' on':'')+'" title="'+esc(b+(sub?' – '+t:''))+'">📚&nbsp;'+esc(b)+sub+'</a>'].concat(s.filter(x=>x.book===b).map(v=>{const vt=books.play.titleOf(v.book,v.lg,v.ed);return v.pdf?a2(vt,'data-book="'+esc(v.book)+'" data-pdf="'+esc(v.pdf)+'" title="'+esc(vt+' – PDF')+'" aria-label="'+esc(vt+' PDF')+'"',1,'📕'):a2(vt,'data-book="'+esc(v.book)+'" data-lg="'+v.lg+'" data-ed="'+v.ed+'" title="'+esc(vt+' – '+v.lg+' '+v.ed)+'" aria-label="'+esc(vt+' '+v.lg+' '+v.ed)+'"',1,books.play.flag(v.lg)+books.play.edIc(v.ed));}));})
                ,o=[
                    // pl0 – the whole shelf: every book concept, each with its own versions (🇳🇴/🇬🇧 × 👑/🔓, or a PDF) beneath it
                    ()=>/*o0()*/{const s=books.play.shelf||[],bk=books.play.book;
                        return [...new Set(s.map(x=>x.book))].flatMap(b=>{const t=books.play.titleOf(b),sub=R.slug(t)===R.slug(b)?'':' <i class="bid">('+esc(t)+')</i>';
                            return ['<a data-book="'+esc(b)+'" class="lvnode'+(b===bk?' on':'')+'" title="'+esc(b+(sub?' – '+t:''))+'">📚&nbsp;'+esc(b)+sub+'</a>']
                                .concat(s.filter(x=>x.book===b).map(v=>{const vt=books.play.titleOf(v.book,v.lg,v.ed);
                                    return v.pdf
                                        ?a2(vt,'data-book="'+esc(v.book)+'" data-pdf="'+esc(v.pdf)+'" title="'+esc(vt+' – PDF')+'" aria-label="'+esc(vt+' PDF')+'"',1,'📕')
                                        :a2(vt,'data-book="'+esc(v.book)+'" data-lg="'+v.lg+'" data-ed="'+v.ed+'" title="'+esc(vt+' – '+v.lg+' '+v.ed)+'" aria-label="'+esc(vt+' '+v.lg+' '+v.ed)+'"',1,books.play.flag(v.lg)+books.play.edIc(v.ed));}));});}
                    // pl1 – the version you are reading (node) with its main chapters beneath it (leaves)
                    ,()=>{const v=(books.play.shelf||[]).find(x=>x.book===books.play.book&&((x.fn&&x.fn===md.fn)||(x.pdf&&x.pdf===books.play.pdf)))
                            ,nd=v?a2(books.play.titleOf(v.book,v.lg,v.ed),'data-book="'+esc(v.book)+'"'+(v.pdf?' data-pdf="'+esc(v.pdf)+'"':' data-lg="'+v.lg+'" data-ed="'+v.ed+'"')+' class="lvnode on"',0,books.play.flag(v.lg)+books.play.edIc(v.ed))
                                :a2(md.title,'class="lvnode on"',0,'📖');
                        return [nd].concat(md.chs.map((c,i)=>a2(c[0].h[1],'data-ch="'+i+'"',1,'📖')));}
                    // pl2 – the chapter you are on (node) with its sub chapters beneath it (leaves)
                    ,()=>{const c=md.chs[R.ch];if(!c)return [];
                        return [a2(c[0].h[1],'data-ch="'+R.ch+'" class="lvnode on"',0,'📖')]
                            .concat(R.chSubs(R.ch).map(k=>{const h=md.subs[k][0].h;return a2(h[1],'data-su="'+k+'"',1,ic[h[0]]||'📑');}));}
                    // pl3 – the split hierarchy: pages on the left, paragraphs on the right, both drill
                    ,()=>{const su=md.subs[R.su];if(!su)return [];
                        const h=su[0].h,pgs=[...new Set(su.map(p=>p.pn))],pns=new Set(pgs)
                            ,pars=md.pgs.map((p,i)=>({p,i})).filter(x=>pns.has(x.p.pn));
                        return ['<div class="navhier"><table class="navtab"><tr><td colspan="2" class="navnode">'
                            +a2(h?h[1]:'','data-su="'+R.su+'" class="lvnode on"',0,(h&&ic[h[0]])||'📑')+'</td></tr><tr>'
                            +'<td class="navpg">'+pgs.map(pn=>a2('#'+pn,'data-i="'+(R.pgiOf(pn)+1)+'" data-m="4" data-su="'+R.su+'"',0,'📄')).join('')+'</td>'
                            +'<td class="navpar">'+pars.map(x=>a2(x.p.txt.slice(0,60),'data-i="'+x.i+'" data-m="5" data-su="'+R.su+'"',0,'')).join('')+'</td>'
                            +'</tr></table></div>'];}
                    // pl4b – the page you are on (node) with its lines beneath it (leaves)
                    ,()=>{const pg=md.pages[R.pi];if(!pg)return [];
                        return [a2(pg.pn?String(pg.pn):'','class="lvnode on"',0,'📄')]
                            .concat(R.lnsOf().map((l,k)=>a2(l.t,'data-ln="'+k+'" data-m="8"',1,'')));}
                    // pl4a – the paragraph you are on (node) with its sentences beneath it (leaves)
                    ,()=>{const p=md.pgs[R.idx];if(!p)return [];
                        return [a2(p.txt.slice(0,34),'class="lvnode on"',0,'')]
                            .concat(R.sentT(p.txt).map((s,k)=>a(s.slice(0,32),R.baseOf(R.idx)+k,1,'✍️',6)));}
                    // pl5a – the sentence you are on (node) with its words beneath it (leaves)
                    ,()=>{const s=md.sts[R.idx];if(!s)return [];
                        return [a2(s.txt.slice(0,34),'class="lvnode on"',0,'✍️')]
                            .concat((s.txt.match(/\S+/g)||[]).slice(0,40).map((w,j)=>a2(w,'data-i="'+j+'" data-m="7" data-si="'+R.idx+'" data-w="'+j+'"',1,'🔤')));}
                    // pl6a Word – the word you are on ends the text spine (semantic) – the page's lines hang under the page, never here
                    ,()=>{const w=wOf(R.si,R.wi);return [a2(w,'class="lvnode on"',0,'🔤')];}
                    // pl5b Line – the line you are on (node) with its media forms beneath it (leaves)
                    ,()=>{const l=R.curLine(),mm=[['\u{1F3A8}','Foreground'],['\u{1F5BC}\uFE0F','Background'],['\u{1F3B5}','Sound'],['\u{1F3AC}','Motion']];
                        return [a2(l?l.t:'','class="lvnode on"',0,R.lv[8].ic)].concat(mm.map(m=>a2(m[1],'data-m="9"',1,m[0])));}
                    // pl6b Media Form – the line alone: the modalities are drawn in the page, not in the nav
                    ,()=>{const l=R.curLine(),pg=md.pages[R.pi]||{},nn=l?l.t:(pg.h?pg.h[1]:(pg.pn?'p. '+pg.pn:md.title));
                        return [a2(nn||'','class="lvnode on"',0,'🎨')];}
                ];
                // The nav frame is just the TOP row: drill up (or (edit) on the shelf). Drilling down is what the leaf rows do.
                const jump=p=>{ // up = the actual node above you, not the level's name – and the level's own icon, not an arrow
                    const i=books.play.ix(p),L=books.play.LV[i]||{no:p,t:''},node=books.play.nodename(p)
                        ,ic=((books.play.render.lv||[])[i]||{}).ic||books.play.render.ic[i]||'';
                    return a2(node||L.t,'data-go="'+i+'" class="lvup"'
                        +' title="'+books.play.render.esc('up to '+(node?node+' – ':'')+L.t+' ('+(L.pl||p)+')')+'"',0,ic);
                };
                // ALL the parents, not just the one directly above: the whole chain, the highest level at the top and the
                // nearest parent last (so the list reads as the path down to here and the row under it is the node itself).
                // Any parent can be left in one click instead of walking up one level at a time.
                const ups=books.play.ancestors(books.play.id(books.play.render.mode)).map(jump).join('');
                const up=ups||'<a data-edit="1" class="lvup'+(books.play.editOn?' on':'')+'" title="'+books.play.render.esc(books.play.editOn?'done – show the versions as links':'edit which books and versions exist')+'">✎ '+(books.play.editOn?'(done)':'(edit)')+'</a>'; // nothing above the shelf, so the slot edits the shelf itself
                R.el.nav.innerHTML=up+o[R.mode]().join('');
                R.hands();
            }
            ,esc:x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            ,slug:s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'')
            ,spotKey:u=>books.play.SpotKey(u) // song code: gormb query (?msoe) or aigap path (/msoe) – gormb.github.io/?id has moved to aigap.no/id
            ,qr:u=>{const k=books.play.render.spotKey(u);return k?'<img src="https://aigap.no/i/'+k+'.qr1.png" style="height:66px;image-rendering:pixelated;">':'';}
            ,mus:l=>{const u=(l.match(/https?:\/\/[^\s)]+/)||[''])[0];return '<a href="'+u+'">\u{1F3B5}</a>'+books.play.render.qr(u);}
            ,songOf:p=>{const a=books.play.md.pages||[],i=a.indexOf(p);for(let k=i;k>=0;k--)if(a[k].mu)return a[k].mu;return '';} // nearest 🎵 at or before page p (songs live on the Sub Chapter heading)
            ,media:p=>{ // pl6b: the presented unit + one row per modality
                const mu=books.play.render.songOf(p),key=books.play.render.spotKey(mu)
                    ,l=books.play.render.curLine(),node=l?l.t:(p&&p.h?p.h[1]:(p&&p.pn?'p. '+p.pn:books.play.md.title))
                    ,row=(ic,t,w,x)=>'<div class="mf"><b>'+ic+' '+books.play.render.esc(t)+'</b><div class="mfw">'+books.play.render.esc(w)+'</div>'+(x||'')+'</div>';
                return '<h1>'+books.play.render.esc(books.play.render.lv[9].nm)+'</h1>'
                    +'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl6b'))+(node?' – '+books.play.render.esc(node):'')+'</p>'
                    +row('\u{1F3A8}','Foreground (colour)','The colour that shapes what is presented.')
                    +row('\u{1F5BC}\uFE0F','Background','What stands behind what is presented.')
                    +row('\u{1F3B5}','Sound – Spotify Play',mu?'Code '+key+' – the song tied to this level.':'No song tied to this level.',mu?'<button class="spPlay" data-u="'+mu+'">\u25B6 \u266A</button> '+books.play.render.qr(mu):'')
                    +row('\u{1F3AC}','Motion / video','Motion or video as a media form.')
                    +'<div id="spHolder"></div>';
            }
            ,subView:()=>{ // pl3: the chosen sub chapter – its 🎵 song, then its text. One item per page so 🫲/🫱 and the nav step through pages.
                const su=books.play.render.cSub();
                if(!su||!su.length)return [books.play.render.lv[3].nm+' – choose a sub chapter in the list'];
                const mu=books.play.render.songOf(su[0]),key=books.play.render.spotKey(mu);
                const song='<div class="subsong">'+(mu
                    ?'\u{1F3B5} <b>'+books.play.render.esc(key)+'</b> <a href="'+books.play.render.esc(mu)+'">'+books.play.render.esc(mu)+'</a> '
                        +'<button class="spPlay" data-u="'+books.play.render.esc(mu)+'">\u25B6 \u266A</button>'+books.play.render.qr(mu)
                    :'No song tied to this sub chapter.')+'</div>';
                return su.map((p,i)=>(i?'':song)+books.play.render.page(p));
            }
            ,shelfEdit:()=>{ // pl0 details for the CHOSEN book: what is available, and the edit window for it
                const esc=books.play.render.esc,bs=(books.play.manifest||{books:[]}).books||[];
                const i=Math.max(0,Math.min(bs.length-1,books.play.selIdx())),b=bs[i];
                const head=(x)=>'<h1>'+esc(x||books.play.LV[0].t)+'</h1>';
                const src=books.play.src==='localStorage'
                    ?'⚠ changes live in the browser – b/shelf.json is unchanged. Use Copy JSON to make them permanent, or Reset.'
                    :(books.play.src?'reading b/shelf.json':'no shelf.json found');
                const bar='<div class="seRow"><button data-se="add">+ book</button>'
                    +'<button data-se="copy">Copy JSON</button>'
                    +'<button data-se="reset">Reset</button><span class="seMsg" id="seMsg"></span></div>'
                    +'<details class="seJsonBox"><summary>JSON for b/shelf.json</summary>'
                    +'<pre class="seJson">'+esc(JSON.stringify({books:bs},null,1))+'</pre></details>';
                if(!b)return '<div class="se" data-b="0">'+head()+'<p class="seHint">No books in shelf.json – add one.</p>'+bar+'</div>';
                const vs=(lg,ed)=>(books.play.versionsOf(b).find(x=>x.lg===lg&&x.ed===ed)||{}).title;
                const have=(lg,ed)=>books.play.versionsOf(b).some(x=>x.lg===lg&&x.ed===ed);
                const srcTxt=books.play.src==='localStorage'?'changes live in the browser – b/shelf.json is unchanged'
                    :(books.play.src?'reading b/shelf.json':'');
                if(!books.play.editOn){ // VIEW: this book's available versions, as links (that is LV.pl0.page)
                    const links=['NO','EN'].flatMap(lg=>['PREM','FREE'].map(ed=>have(lg,ed)
                        ?'<a class="seOpen" data-se="open" data-lg="'+lg+'" data-ed="'+ed+'" title="open '+lg+' '+ed+'">'
                            +books.play.flag(lg)+books.play.edIc(ed)+'&nbsp;'+books.play.render.esc(books.play.titleOf(b.book,lg,ed))+'</a>':''));
                    if(b.pdf)links.push('<a class="seOpen" data-se="pdf" data-pdf="'+books.play.render.esc(b.pdf)+'" title="PDF">📕&nbsp;'+books.play.render.esc(books.play.titleOf(b.book))+'</a>');
                    return '<div class="se" data-b="'+i+'">'+head(b.book)
                        +'<p class="seHint">'+books.play.render.esc(srcTxt)+'</p>'
                        +'<div class="seVers">'+links.join('')+'</div>'
                        +'<p class="seHint">✎ (edit) in the list on the left to change which books and versions exist.</p></div>';
                }
                const slot=(lg,ed)=>{ // one version: checked = available, the input is its own title (empty inherits), open = jump down a level
                    const own=((books.play.versionsOf(b).find(x=>x.lg===lg&&x.ed===ed)||{}).title)||'';
                    const on=books.play.versionsOf(b).some(x=>x.lg===lg&&x.ed===ed);
                    const eff=own||books.play.titleOf(b.book,lg,ed);
                    return '<label class="seV"><input type="checkbox" data-se="on" data-lg="'+lg+'" data-ed="'+ed+'"'+(on?' checked':'')+'> '
                        +books.play.flag(lg)+books.play.edIc(ed)
                        +' <input class="seT" data-se="vt" data-lg="'+lg+'" data-ed="'+ed+'" value="'+esc(own)+'" placeholder="'+esc(eff)+'" title="'+lg+' '+ed+'">'
                        +(on?' <a class="seOpen" data-se="open" data-lg="'+lg+'" data-ed="'+ed+'" title="open '+lg+' '+ed+'">open ▸</a>':'')
                        +'</label>';
                };
                return '<div class="se" data-b="'+i+'">'+head(b.book)
                    +'<p class="seHint">'+esc(src)+'</p>'
                    +'<div class="seBook" data-b="'+i+'">'
                    +'<div class="seRow"><input class="seId" data-se="book" value="'+esc(b.book||'')+'" placeholder="folder under b/" title="book folder">'
                    +'<button data-se="del" title="Remove the book from the shelf">🗑</button></div>'
                    +['NO','EN'].flatMap(lg=>['PREM','FREE'].map(ed=>slot(lg,ed))).join('')
                    +'<label class="seV"><input type="checkbox" data-se="pdfOn"'+(b.pdf?' checked':'')+'> 📕 '
                    +'<input class="seT" data-se="p" value="'+esc(b.pdf||'')+'" placeholder="b/CV/b.pdf" title="PDF"></label></div>'
                    +bar+'</div>';
            }
            ,sent:s=>/[.!?\u2026]["'\u201D\u2019\u00BB]?$/.test(s.trim())
            ,hangs:s=>/(^|[\s"'“‘(\[«])(på|i|og|som|til|med|av|for|en|et|den|det|de|at|om|men|å|er|var|fra|ved|ut|inn|opp|ned|seg|ikke|så|når|da|her|der|hva|hvis|enn|mens|etter|før|under|over|mellom|mot|blir|ble|har|hadde|kan|skal|vil|må|the|of|and|to|a|in|is|was|it|that|with|for|on|as|at|by|from|but|or)$/i.test(s.trim()) // a line that cannot end there
            ,sentT:s=>(s.match(/[^.!?\u2026]+[.!?\u2026]+["'\u201D\u2019\u00BB]?|\S[^.!?\u2026]*$/g)||[]).map(x=>x.trim()).filter(Boolean)
            ,wrap:(s,n)=>{const o=[];let l='';(s||'').split(/\s+/).filter(Boolean).forEach(w=>{if(!l)l=w;else if((l+' '+w).length<=(n||66))l+=' '+w;else{o.push(l);l=w;}});if(l)o.push(l);return o;} // the measure: ~66 characters is the golden-ratio optimum, and the page is set at 1.15 line spacing
            ,head:p=>{const t=p.h&&p.h[1];if(!t)return '';const h=p.h[0]===2?'h2':'h3',s=books.play.render.slug(t);return '<'+h+(s?' id="'+s+'"':'')+'>'+books.play.render.esc(t)+(p.mu?' <a href="'+p.mu+'">\u{1F3B5}'+books.play.render.qr(p.mu):'')+'</'+h+'></a>'}
            ,page:(p,fr)=>(p.pn?'<a id="p'+p.pn+'"></a>':'')+(p.t?'<h1>'+books.play.render.esc(books.play.md.title)+'</h1>':books.play.render.head(p)+(fr&&p.fr?'<p>'+p.fr+'</p>':'')+p.ps.map(x=>'<p>'+x+'</p>').join(''))
            ,flow:a=>a.map(p=>books.play.render.page(p)).join('') // the reading view: a paragraph is drawn once, where it starts
            ,views:()=>books.play.pdf // a PDF-only book has no levels to zoom through – the PDF is the whole content
                ?['<embed class="pdfview" src="'+books.play.root+books.play.pdf+'" type="application/pdf">']
                :books.play.render.viewsMd()
            ,viewsMd:()=>[
                // pl0 – the shelf itself: the edit window for what books and versions are available
                ()=>[books.play.render.shelfEdit()]
                // pl1 – the whole version: every main chapter in one view, its chapters are the leaves in the nav
                ,()=>[books.play.md.chs.map(books.play.render.flow).join('')]
                // pl2 – ONLY the active main chapter; its sub chapters are picked in the nav
                ,()=>[books.play.render.flow(books.play.md.chs[books.play.render.ch]||[])]
                // pl3 – the selected sub chapter: 🎵 song + text, one item per page (pages listed in the nav)
                ,()=>[books.play.render.subView().join('')]
                ,()=>[{t:1}].concat(books.play.md.pages).map((p,i)=>books.play.render.page(p,i>0)) // a page also opens with the fragment a paragraph continues with
                ,()=>books.play.md.pgs.map(p=>'<p>'+books.play.render.esc(p.txt)+'</p>')
                ,()=>books.play.md.sts.map(s=>books.play.render.esc(s.txt))
                // pl6a Word – the word itself
                ,()=>{const st=books.play.md.sts[books.play.render.si],w=st?((st.txt.match(/\S+/g)||[])[books.play.render.wi]||''):'';
                    return ['<h1>'+books.play.render.esc(books.play.LV[7].t)+'</h1>'
                        ,'<p class="wbig">'+books.play.render.esc(w)+'</p>'
                        ,'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl6a'))+(w?' – '+books.play.render.esc(w):'')+'</p>'
                        ,'<p>'+books.play.render.esc(books.play.LV[7].q)+'</p>'];} // dictionary lookup, inflection and usage belong here
                // pl5b Line – the line as it sits in the measure: ONE item, because draw() renders only v[idx]
                ,()=>{const l=books.play.render.curLine(),t=l?l.t:'';
                    return ['<h1>'+books.play.render.esc(books.play.LV[8].t)+'</h1>'
                        ,'<p class="lbig">'+books.play.render.esc(t)+'</p>'
                        ,'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl5b'))+'</p>'];} // the line itself – never the hardcoded guiding question
                ,()=>[books.play.render.media(books.play.md.pages[books.play.render.pi]||{})]
            ][books.play.render.mode]()
            ,reset:()=>{books.play.render.mode=books.play.render.pending||0;books.play.render.pending=null;books.play.render.idx=0;books.play.render.wide=0;books.play.render.setMode();const t=books.play.render.el.title;if(t)t.textContent=books.play.md.title;books.play.render.toc();books.play.render.sync();}
            ,draw:()=>{
                const R=books.play.render,v=R.views();
                if(R.mode===4)R.pi=Math.max(0,R.idx-1); // the page layer: idx 0 is the title, so the page is one back
                R.el.page.innerHTML=(R.wide?v.join(''):v[Math.max(0,Math.min(v.length-1,R.idx))])||''; // wide (a gesture zoom-out) draws the level itself – every node in it, none of them opened; otherwise the one node at idx. An empty level (eg a book with no chapters yet) must not print "undefined"
                R.hl();
                R.focus();
                R.hands();
            }
            ,em:()=>parseFloat(getComputedStyle(document.documentElement).fontSize)||1 // the client's own em: every figure the fit works with is a fraction of it, so nothing is pinned to a pixel
            ,blink:(el,n)=>{if(!el)return;el.classList.remove('blink');void el.offsetWidth;el.style.animationIterationCount=String(n||1);el.classList.add('blink');} // re-adding the class restarts it, and a reflow is what makes that true when it is already there
            ,hl:()=>{const m=books.play.render.mode;books.play.render.el.nav.querySelectorAll('a[data-i]').forEach(a=>a.classList.toggle('on',+a.dataset.m===m&&+a.dataset.i===books.play.render.idx));}
            ,focus:()=>{ // keep the active node in view – the lists get long (pl3 is ~260 rows)
                const n=books.play.render.el.nav;if(!n)return;
                const el=n.querySelector('a.lvnode.on')||n.querySelector('a.on');if(!el)return;
                const r=el.getBoundingClientRect(),b=n.getBoundingClientRect();
                if(r.top<b.top||r.bottom>b.bottom)n.scrollTop+=(r.top-b.top)-(b.height/2-r.height/2); // centre it, and only the nav scrolls
            }
            ,lvitem:x=>{const up=books.play.ancestors(x.pl).map(p=>{const L=books.play.LV.find(l=>l.pl===p);return L?L.t:'';}).filter(Boolean).join(' › ');return '<li id="'+x.pl+'">'+(up?'<div class="lvpath">'+books.play.render.esc(up)+' ›</div>':'')+'<i>'+books.play.render.esc(x.t)+'</i> – '+books.play.render.esc(x.q)+(x.nav&&x.nav!=='todo'?'<details><summary>Nav shows</summary>'+books.play.render.esc(x.nav)+'</details>':'')+(x.page&&x.page!=='todo'?'<details><summary>Page shows</summary>'+books.play.render.esc(x.page)+'</details>':'')+(x.thoughts?'<details open><summary>Thoughts</summary>'+books.play.render.esc(x.thoughts)+'</details>':'')+(x.child&&x.child.length?'<details open><summary>Planned</summary><ol>'+x.child.map(c=>'<li>'+books.play.render.esc(c.t)+(c.w?'<details><summary>Thoughts</summary>'+books.play.render.esc(c.w)+'</details>':'')+'</li>').join('')+'</ol></details>':'')+'</li>';}
            ,guide:()=>{const g=document.getElementById('lvGuide');if(!g)return;g.innerHTML=books.play.LV.map(x=>books.play.render.lvitem(x)).join('');}
            ,sync:()=>{const L=books.play.LV[books.play.render.mode]||books.play.LV[0];const h=document.getElementById('dbPlayTitle');if(h)h.textContent=L.t+' – '+L.q;const c=document.getElementById('dpCur');if(c){c.className='cur '+(L.pl||'');c.textContent=L.t;}const g=document.getElementById('lvGuide');if(g)g.innerHTML=books.play.render.lvitem(L);books.play.render.ctl();books.play.hi();books.play.sem.Z.nav.draw();} // and the areas are drawn again, in case the level changed with them left as they were
            ,ctl:()=>{const c=document.getElementById('lvCtl');if(!c)return;const pl=books.play.id(books.play.render.mode),kids=books.play.child(pl);let h='';kids.slice().reverse().forEach(k=>{const K=books.play.LV[books.play.ix(k)];h+='<button data-go="'+books.play.ix(k)+'" title="finer: '+(K?K.t:k)+'">\u{1F447}</button>';});c.innerHTML=h;c.onclick=ev=>{const x=ev.target.closest('button');if(!x||x.dataset.go===undefined)return;if(x.dataset.go==='up'){const p=books.play.up[pl];if(p)books.play.render.go(books.play.ix(p));}else books.play.render.go(+x.dataset.go);};}
            ,baseOf:i=>books.play.md.pgs.slice(0,i).reduce((n,q)=>n+books.play.render.sentT(q.txt).length,0)
            ,pgOf:si=>{let n=0;for(let k=0;k<books.play.md.pgs.length;k++){n+=books.play.render.sentT(books.play.md.pgs[k].txt).length;if(n>si)return k;}return 0;}
            ,pgiOf:pn=>{const i=books.play.md.pages.findIndex(p=>p.pn===pn);return i<0?books.play.render.pi:i;}
            ,lnsOf:()=>books.play.md.lns[books.play.render.pi]||[]
            ,curLine:()=>books.play.render.lnsOf()[books.play.render.li]||null
            ,liOf:i=>{const k=books.play.render.lnsOf().findIndex(x=>x.lp===i);return k<0?0:k;} // the line a paragraph starts in – a gaze maps to a line, so this is where alignment lands
            ,curPar:()=>{const R=books.play.render,md=books.play.md,m=R.mode,su=R.cSub()||[],pn=m===4?((md.pages[R.pi]||{}).pn):((su[0]||{}).pn);
                if(m===5)return R.idx;
                if(m===6)return R.pgOf(R.idx);
                if(m===7)return R.pgOf(R.si);
                if(m>=8){const l=R.curLine();return l&&l.lp>=0?l.lp:R.pgOf(R.si);}
                const i=md.pgs.findIndex(p=>p.pn===pn);return i<0?0:i;}
            ,curSent:()=>{const R=books.play.render,m=R.mode;return m===6?R.idx:(m===7?R.si:R.baseOf(R.curPar()));}
            ,curPage:()=>{const R=books.play.render,md=books.play.md,m=R.mode,su=R.cSub()||[];
                if(m===4||m>=8)return R.pi; // a page, a line and its media all carry the page they sit on
                const pn=m===5?((md.pgs[R.curPar()]||{}).pn):(m>=6?((md.sts[R.curSent()]||{}).pn):((su[0]||{}).pn));
                return R.pgiOf(pn);}
            ,align:n=>{ // a coarser level opens on the parent that holds you, a finer one on the first leaf
                const R=books.play.render;if(n===R.mode)return;
                if(n===4){R.pi=R.curPage();R.idx=R.pi+1;}
                else if(n===5)R.idx=R.curPar();
                else if(n===6){const k=R.curSent();R.idx=k;R.si=k;}
                else if(n===7){R.si=R.curSent();R.wi=0;R.idx=0;}
                else if(n===8){R.pi=R.curPage();R.li=R.liOf(R.curPar());} // the line that holds what we came from
                else if(n===9)R.pi=R.curPage();}
            ,sibs:()=>{ // the nodes of this level and which one is on – the hands walk these and stop at the ends
                const R=books.play.render,md=books.play.md,s=books.play.shelf
                    ,ws=k=>(((md.sts[k]||{}).txt||'').match(/\S+/g)||[])
                    ,wc=md.wc&&md.wc.length?md.wc:md.sts.map((_,k)=>ws(k).length)
                    ,wtot=wc.reduce((a,b)=>a+b,0)
                    ,follow=pn=>{const k=md.subs.findIndex(x=>x.some(p=>p.pn===pn));if(k>=0){R.su=k;R.ch=md.subCh[k];}} // walking over a border takes the sub chapter (and main chapter) with it, so the nav and the ?p= id stay truthful
                    ,wNum=()=>{let n=R.wi;for(let j=0;j<R.si&&j<wc.length;j++)n+=wc[j];return n;} // the word we are on, counted from the first word of the book
                    ,wAt=k=>{let n=k;for(let j=0;j<wc.length;j++){if(n<wc[j])return [j,n];n-=wc[j];}return [0,0];}
                    ,pgGo=i=>{R.pi=i;R.idx=i+1;follow((md.pages[i]||{}).pn);} // idx runs one ahead of the page (0 is the title) – draw() keeps the two in step
                    ,lnGo=x=>{R.pi=x[0];R.li=x[1];follow((md.pages[x[0]]||{}).pn);} // a line is a (page, index in the page) pair – the pair is what a hand steps to
                    ,lnIx=()=>{const l=md.lnl||[],i=l.findIndex(x=>x[0]===R.pi&&x[1]===R.li);return i<0?0:i;};
                return [
                    ()=>{const bs=s&&s.length?[...new Set(s.map(x=>x.book))]:md.books;
                        return {l:bs,i:Math.max(0,bs.indexOf(books.play.book)),go:b=>books.play.pick(b)};} // pl0 – the hands stop at the shelf ends: a book is a whole world
                    ,()=>{const vs=(s||[]).filter(x=>x.book===books.play.book);
                        return {l:vs,i:Math.max(0,vs.findIndex(v=>(v.fn&&v.fn===md.fn)||(v.pdf&&v.pdf===books.play.pdf))),go:v=>v.pdf?books.play.openPdf(v.pdf):books.play.open(v.lg,v.ed,1)};} // pl1 – still swaps variants of THIS book, never books
                    ,()=>({l:md.chs.map((_,i)=>i),i:R.ch,go:c=>R.setCh(c)}) // pl2 and finer: the book in reading order – a chapter border is just the next node, and only the book's own ends stop the walk
                    ,()=>({l:md.subs.map((_,i)=>i),i:Math.max(0,Math.min(md.subs.length-1,R.su)),go:k=>R.setSu(k)}) // pl3 – every sub chapter, so the walk runs straight on into the next main chapter
                    ,()=>{const l=md.pages.map((_,i)=>i);return {l,i:Math.max(0,l.indexOf(R.pi)),go:pgGo};}
                    ,()=>({l:md.pgs.map((_,i)=>i),i:R.idx,go:i=>{R.idx=i;follow((md.pgs[i]||{}).pn);}})
                    ,()=>({l:md.sts.map((_,i)=>i),i:R.idx,go:i=>{R.idx=i;R.si=i;follow((md.sts[i]||{}).pn);}})
                    ,()=>({l:Array.from({length:wtot},(_,k)=>k),i:Math.max(0,wNum()),go:k=>{const x=wAt(k);R.si=x[0];R.wi=x[1];follow((md.sts[x[0]]||{}).pn);}})
                    ,()=>({l:md.lnl||[],i:lnIx(),go:lnGo})
                    ,()=>({l:md.lnl||[],i:lnIx(),go:lnGo}) // the media forms hang under the line, so the hands walk lines here too
                ][R.mode]();
            }
            ,hands:()=>{const S=books.play.render.sibs(),e=books.play.render.el;if(e.prev)e.prev.disabled=S.i<=0;if(e.next)e.next.disabled=S.i>=S.l.length-1;}
            ,nav:d=>{const R=books.play.render,S=R.sibs(),k=S.i+d;if(k<0||k>=S.l.length)return;R.wide=0;S.go(S.l[k]);R.toc();R.draw();R.sync();} // moving picks that node, so a level a gesture only widened is entered again
            ,hash:()=>{
                const h=location.hash.toLowerCase().slice(1);
                if(!h)return;
                const pn=/^p\d+$/.test(h);
                books.play.render.mode=0;
                const t=pn?null:books.play.md.pages.find(pg=>pg.h&&books.play.render.slug(pg.h[1]).startsWith(books.play.render.slug(h)));
                if(!pn&&!t)return;
                books.play.render.setMode();books.play.render.toc();books.play.render.draw();
                document.getElementById(t?books.play.render.slug(t.h[1]):h).scrollIntoView();
            }
        }
        ,sem:{
            Z:{
                ov:null,m:0,t:0,sp:'b',q:'',inv:0,invKey:'play.zoom.invert' // sp: the spine the user last stood on (a = text, b = page) – it decides which way the pl3 fork drills in, and the page spine is the one to open on. q: what is keyed while the areas are up – the text every cloud is built from is cut by it first, and then the map that comes of it is read through it. inv: the way round a pinch reads – fingers apart may mean finer or coarser, and which one a reader expects is not settled, so it is theirs to set (the ⇄ switch in the menu bar); invKey: where that choice is kept between visits
                ,box:()=>books.play.sem.Z.ov||(books.play.sem.Z.ov=Object.assign(document.body.appendChild(document.createElement('div')),{id:'semOv'}))
                ,on:0,pin:0,was:0,key:0,mod:0 // pin: the two fingers opened or closed a level; was: whether the areas already stood up when they landed; key: the two keys are down now; mod: they have already been read since they last went down
                ,wMap:{
                    // suppabase has these, when read store in memcache, and when written store in both memcache and supabase. The functions are in SQL, but the data is JSONB. The key is a 128-bit UUID made from the SHA-1 of the what and where strings, each truncated to 64 bits. The words are a JSONB array of objects with s:string and n:number.
                    // create table if not exists public.map(whatwhere uuid primary key,words jsonb not null,dtC timestamptz default now() not null);
                    // create or replace function public.map_ww(what varchar, wher varchar) returns uuid language sql immutable as $$ select (encode(substr(digest(what, 'sha1'), 1, 8), 'hex') || encode(substr(digest(wher, 'sha1'), 1, 8), 'hex'))::uuid; $$;
                    // create or replace function public.map_get(what varchar, wher varchar) returns jsonb language sql immutable as $$ select words from public.map where whatwhere = public.map_ww(what, wher); $$;
            
            
                    // create or replace function public.map_set(what varchar, wher varchar, words jsonb) returns uuid language sql volatile as $$ insert into public.map(whatwhere, words) values (public.map_ww(what, wher), words) on conflict (whatwhere) do update set words = excluded.words returning whatwhere; $$;
                    // -- usage: (what is always uppercase, where is always lowercase, words is a jsonb array of objects with s:string and n:number)
                    // is json correct? fix it! select public.map_set('HELLO', 'l*n*p.n.nulls', '[{"s":"hello","n":4},{"s":"world","n":7}]'::jsonb);
                    // select public.map_get('HELLO', 'l*n*p.n.nulls');
                    g:(hId,q)=>{const k=hId+'|'+q;return books.play.memcache[k];}
                    ,s:(hId,q,words)=>{const k=hId+'|'+q;books.play.memcache[k]=words;}
                }
                ,zb:()=>{const b=document.getElementById('zmT');if(!b)return;const on=books.play.sem.Z.on;b.textContent=on?'\u2299':'\u25CE';b.title=on?'Collapse the word map back into its band':'Expand the word map over the reading area';} // ◎ when the map is down and ⊙ when it is up: the switch in the menu bar, where it stands the same however the map is shaped
                ,ib:()=>{const b=document.getElementById('zmI');if(!b)return;const i=books.play.sem.Z.inv // the ⇄ switch: the same glyph either way, only pressed or not – the title is what says which way the gestures now read, since that is the whole question
                    ,w=i?['one level up, shown whole','one level down, with the node opened']:['one level down, with the node opened','one level up, shown whole']; // the two readings of one gesture, in the order fingers-apart then fingers-together
                    b.classList.toggle('on',!!i);b.title='Zoom gestures: fingers apart goes '+w[0]+', together goes '+w[1]+'. Click to turn the two round.';}
                ,show:()=>{const z=books.play.sem.Z,R=books.play.render,E=R.el;if(z.on)return;z.on=1;z.box().style.display='block';document.body.classList.add('zoom'); // the overlay covers the screen itself (inset:-50vmax) – no rect maths to be out-zoomed
                    [E.prev,E.next,E.lvBars.querySelector('button[data-zm]'),document.getElementById('lvCtl')].forEach(el=>R.blink(el,3)); // the two hands and both ways out of the level blink three times, to say where they are
                    z.nav.swap();z.nav.redraw();z.zb();} // the areas are wide now, so the clouds are laid out and fitted again
                ,hide:()=>{const z=books.play.sem.Z;if(!z.on)return;z.on=0; // going out of the zoom only puts the map away: what the pointer happens to rest on is not opened – a click, or ↓ on it, is what chooses a node
                    if(z.nav.tm){clearTimeout(z.nav.tm);z.nav.tm=0;z.nav.tk='';} // a click still waiting its beat dies with the map: what the pair names may not walk in after it is gone
                    if(z.ov)z.ov.style.display='none';z.m=z.t=0;document.body.classList.remove('zoom');
                    z.nav.redraw();z.zb();} // the band is narrow and set in smaller type, so the areas are drawn and measured again
                ,enter:()=>books.play.sem.Z.show()
                ,nav:{ // ⌃⇧, a middle click or two fingers overwrite the play panel (right, innerHTML and all) with a navigating area – the level we are on, and what it selects. It stays: leaving the mode puts nothing back
                    el:null,last:'',tm:0,tk:'' // tm: the beat a lone click waits before it walks in, so that a pair of them is never two navigations; tk: the cell that click named
                    ,box:()=>books.play.sem.Z.nav.el
                    ,label:()=>{const L=books.play.LV[books.play.render.mode]||books.play.LV[0];return (L.pl||'')+' '+L.t+' Selection';}
                    ,areas:()=>{ // every level reads the same way: one area per node, its cloud standing there and its name coming up on hover. The fork and the two nodes it opens show one and the same list – the nodes of the active spine – and at the page and the paragraph the node you stand on is marked
                        const e=books.play.render.esc,pl=books.play.id(books.play.render.mode),sp=books.play.sem.Z.sp,q=books.play.sem.Z.q
                            ,b=books.play.cloud.above() // found once for the whole map: every cloud on this level is read against the same level above
                            ,fork=pl==='pl3'||pl==='pl4a'||pl==='pl4b',kids=fork?['pl4'+sp]:books.play.child(pl),tag=fork||kids.length>1
                            ,grp=kids.map(c=>{const a=books.play.names(c),ns=a[0]||[]
                                ,rows=ns.map((n,k)=>{if(n==='')return '';const h=books.play.cloud.html(books.play.txtOf(c,k,n),24,q,b)
                                    ,on=(pl==='pl4a'||pl==='pl4b')&&k===a[3] // grey only where you really stand – on the page or the paragraph you are in, never at the fork above them
                                    ,cl=h||q; // with the text cut, a cloud can come out with nothing in it: the area still stands there, empty, and keeps its name for the hover
                                    return '<div class="nvA'+(on?' on':'')+(cl?' nvC':'')+'" data-k="'+c+'|'+k+'"><span class="nvT">'+e(n)+'</span>'+(cl?'<div class="nvW">'+h+'</div>':'')+'</div>';}).join('');
                                if(!rows)return '';const L=books.play.LV[books.play.ix(c)]||{},cnt=ns.filter(n=>n!=='').length // six areas is as far as one column carries; past fourteen it takes three
                                    ,grid=cnt>6?'<div class="nvR'+(cnt>14?' r3':'')+'">'+rows+'</div>':rows;
                                return '<div class="nvGrp">'+((tag||q)?'<div class="nvG">'+e(L.t||c)+books.play.sem.Z.nav.tq(q)+'</div>':'')+grid+'</div>';}).join('');
                        return grp?'<div class="nvAreas">'+grp+'</div>':'';}
                    ,tq:q=>q?' – "'+books.play.render.esc(q)+'"':'' // the title of the map carries what was keyed: “Paragraph – "FRE"”
                    ,applyQ:()=>{const z=books.play.sem.Z,n=z.nav;if(n.qEl&&n.qEl.value!==z.q)n.qEl.value=z.q;n.redraw();} // one place tells the field and the map, whatever put the filter there
                    ,mk:()=>window.SpeechRecognition||window.webkitSpeechRecognition // a phone may have no such thing – then the field is the way in: tap it and use the keyboard's own mic
                    ,lastWord:s=>{const a=String(s||'').replace(/[^\p{L}\p{N}'-]+/gu,' ').trim().split(/\s+/).filter(Boolean);return a.length?a[a.length-1]:'';} // dictation arrives with stops and capitals – the map wants the bare word, and the last one heard wins
                    ,speak:btn=>{ // 🎤: hear a word, cut the whole text by it and read the map through it, until the mic is tapped again
                        const z=books.play.sem.Z,n=z.nav,R=n.mk();if(!R)return;
                        if(z.rec){try{z.rec.stop();}catch(e){}z.rec=null;btn.classList.remove('on');return;}
                        const r=z.rec=new R();
                        r.lang=books.play.lg==='NO'?'nb-NO':'en-GB';r.continuous=!0;r.interimResults=!1; // the copy's own language: the words in the map are its words
                        r.onresult=e=>{let s='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)s+=e.results[i][0].transcript;
                            const w=n.lastWord(s);if(w){if(n.qEl)n.qEl.value='';z.q=w;n.applyQ();}} // the field is emptied first: what was keyed is not kept – what came by voice is what stands there
                        r.onerror=()=>{z.rec=null;btn.classList.remove('on');};
                        r.onend=()=>{z.rec=null;btn.classList.remove('on');};
                        try{r.start();}catch(e){z.rec=null;return;} // start() throws where the page is not allowed to listen
                        btn.classList.add('on');
                    }
                    ,mic:on=>{ // ⏸ while ⌃⇧ is held a click can never be a plain click – ctrl-click opens the pointer's own menu and alt-click is the other fork – so the mic is worked by the pointer moving over it, and it blinks the whole time it is open
                        const z=books.play.sem.Z,n=z.nav;if(!n.micEl)return;
                        if(on!==!!z.rec)n.speak(n.micEl);} // set, not toggled: the same call that opens the mic closes it, so moving over it again is off again
                    ,keyQ:e=>{ // typing while the areas are up cuts the text and reads the map through it: what was keyed is set after the level's title, and every cloud is built again on the part of its text that carries it – and then keeps only the words that carry it too
                        const z=books.play.sem.Z,n=z.nav,qEl=n.qEl,k=e.key,own=qEl&&document.activeElement===qEl;
                        if(k==='Backspace'){if(own)return 0;z.q=z.q.slice(0,-1);} // the field deletes its own when it has the focus – Esc is not ours here: the key handler takes it, out of the filter or out of the zoom
                        else if(k.length===1&&k!==' '&&!e.metaKey&&!e.altKey&&!(own&&!e.ctrlKey))z.q+=k; // a letter or a digit; with the field focused a plain key is the field's – that is how a phone keyboard and its dictation come in – while ⌃⇧ letters are ours
                        else return 0; // not ours – the key goes on to whoever else listens
                        n.applyQ();
                        return 1;}
                    ,go:(c,k)=>{const a=books.play.names(c),n=(a[0]||[])[k];if(!n)return;a[2](n);books.play.render.go(books.play.ix(c),true);} // an area selects that node and opens its level, like the same row in the nav
                    ,pickK:k=>{const p=String(k||'').split('|');if(p[0])books.play.sem.Z.nav.go(p[0],+p[1]);} // an area picked by the name of its cell – a click carries that name through the beat it waits, so the element it lands on need not still stand
                    ,pick:el=>books.play.sem.Z.nav.pickK(el.dataset.k) // an area picked – by a click, or by ↓ while the pointer stands on it
                    ,body:()=>books.play.sem.Z.nav.areas()||'<h2>'+books.play.render.esc(books.play.sem.Z.nav.label())+books.play.sem.Z.nav.tq(books.play.sem.Z.q)+'</h2>'
                    ,base:()=>document.body.classList.contains('zoom')?1:.6 // the type scale the clouds are set at: full while zooming, small in the narrow band
                    ,collapsed:()=>!document.body.classList.contains('zoom') // the band: the cloud is turned, so its height reads as its width and vice versa
                    ,hm:a=>{ // the words' own height for every cloud, read in one layout round – not the stretched box they sit in
                        const b=books.play.sem.Z.nav.base(),e=books.play.render.em();
                        a.forEach(w=>{w.style.fontSize=b+'em';w.style.bottom='auto';w.style.height='auto';});
                        const h=a.map(w=>Math.max(e,w.scrollHeight));
                        a.forEach(w=>{w.style.bottom='';w.style.height='';});
                        return h;}
                    ,room:w=>{const c=w.parentElement,e=books.play.render.em(); // what an area gives, a quarter em inside its frame. Turned, the cloud must fit both ways, or a tall area would fill up with lines
                        return Math.max(e,(books.play.sem.Z.nav.collapsed()?Math.min(c.clientWidth,c.clientHeight):c.clientHeight)-e/4);}
                    ,fit:()=>{ // a cloud is given the room its area has: many words where the area is roomy, few – and smaller type – where it is crowded. It may run over into its neighbours, so the only thing kept in check is the amount
                        const n=books.play.sem.Z.nav,a=[...n.el.querySelectorAll('.nvW')];if(!a.length)return;
                        const h=n.hm(a);
                        a.forEach((w,i)=>{const k=n.room(w)/h[i];if(k>=1)return;
                            const keep=Math.max(2,Math.round(w.childElementCount*k)); // the list is ranked, so the words that carry least go first
                            while(w.childElementCount>keep)w.removeChild(w.lastChild);});
                        const h2=n.hm(a);
                        a.forEach((w,i)=>{const s=n.room(w)/h2[i]; // still too tall → smaller type, never below .4 of the scale it is set in
                            if(s<1)w.style.fontSize=(n.base()*Math.max(.4,s)).toFixed(2)+'em';});
                    }
                    ,draw:()=>{const n=books.play.sem.Z.nav;if(!n.el)return;const h=n.body();if(h===n.last)return;n.last=h;n.el.innerHTML=h;n.fit();}
                    ,redraw:()=>{const n=books.play.sem.Z.nav;n.last='';n.draw();} // the room changed – every cloud is built and fitted again
                    ,swap:()=>{ // the panel is overwritten once: the areas, and under them the strip – a filter field only makes sense where the word map it filters stands
                        const n=books.play.sem.Z.nav,z=books.play.sem.Z,p=document.getElementById('dbPlay');
                        if(!n.el){
                            p.innerHTML='<div id="semNav"></div>'
                                +'<div id="semQ"><button id="nvMic" type="button" title="Speak a word – the text is cut by it and the map made of what is left, and the map keeps what carries it. While ⌃⇧ is held, move over it to open the mic; over it again to close">\u{1F3A4}</button>'
                                +'<input id="nvQ" type="text" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" enterkeyhint="search" placeholder="filter the text to map"></div>';
                            n.el=p.querySelector('#semNav');n.qEl=p.querySelector('#nvQ');
                            const mic=n.micEl=p.querySelector('#nvMic');
                            n.el.onclick=ev=>{const x=ev.target.closest('[data-k]'),k=x?x.dataset.k:''; // one click walks into the area and stays in the map – but it is held back a beat, so that the second click of a pair still finds the map as it was and not the level the first one has just opened. A pair quicker than the beat is caught here; a slower one is caught by dblclick, which the browser times itself
                                if(n.tm){clearTimeout(n.tm);n.tm=0;const p=n.tk;n.tk='';n.pickK(k||p);z.hide();return;} // the second click of the pair: into the node the pair names, and out of the map
                                if(!k)return;
                                n.tk=k;n.tm=setTimeout(()=>{n.tm=0;n.tk='';n.pickK(k);},220);} // a lone click, a beat later – what the pointer rested on while it waited does not matter
                            n.el.ondblclick=()=>z.hide(); // a pair slower than the beat: the click has already walked in, so the map only steps aside – any pick still waiting its beat is dropped with it
                            n.qEl.oninput=()=>{z.q=n.qEl.value;n.redraw();}; // a phone's keyboard and its own dictation arrive as text, never as key events – both land here
                            if(n.mk()){ // while ⌃⇧ are held a click can never be a plain click (ctrl-click is the pointer's own menu, alt-click the other fork), so then 🎤 is worked by moving over it: over again is off again
                                mic.onclick=e=>{if(!e.ctrlKey&&!e.metaKey&&!e.altKey)n.mic(!z.rec);}; // with the keys let go an ordinary click toggles it
                                mic.onmouseenter=()=>{if(z.on&&z.key)n.mic(!z.rec);};
                            }else mic.hidden=1; // no API: the field carries the voice instead
                            p.classList.add('navon');document.body.classList.add('navon');
                        }n.draw();} // the body carries it too: the columns answer to whether the areas are on
                }
                ,jump:()=>{const z=books.play.sem.Z,h=document.querySelector('#semNav .nvA:hover');if(!h)return;z.nav.pick(h);z.hide();} // ⏎ walks into the cell the pointer stands on, exactly as a double click does: the node is opened, and the map steps aside
                ,drill:(d,alt,wide)=>{const z=books.play.sem.Z,R=books.play.render;
                    if(d>0){const h=document.querySelector('#semNav .nvA:hover');if(h)return z.nav.pick(h);} // ↓ first walks into the cell the pointer stands on, exactly as a click on it would
                    const pl=books.play.id(R.mode),ks=books.play.child(pl)
                        ,k=d>0?(ks.length>1?'pl4'+(alt?(z.sp==='a'?'b':'a'):z.sp):ks[0]):books.play.up[pl]; // + = finer (the fork goes where the user last was – with alt, the fork not taken last), − = coarser
                    if(!k)return;
                    const t=books.play.names(k),i=d>0?t[3]:-1; // the child you stand in – the cell a click would have taken
                    if(i>=0&&(t[0]||[])[i])return z.nav.go(k,i);
                    R.go(books.play.ix(k),0,wide&&d<0);} // wide (a pinch together / ctrl-wheel down) only widens the level – the node it contains is NOT opened: a cell pick or a zoom-in is what opens it
                ,zoom:d=>{const o=books.play.sem.Z.inv?-d:d;books.play.sem.Z.drill(o>0?1:-1,null,o>0?0:1);} // the ONE place a gesture's own direction is read: d = +1 fingers apart (a wheel up, which is the same pinch on a trackpad), −1 fingers together. Which of the two means finer is not a fact about the gesture but about the reader – ⇄ turns the two round here, and floor(apart/together) never learns: drill keeps its own reading, and the keyboard (↑ up, ↓ down, + finer, − coarser) is left as the keys read
                ,init:()=>{
                    const z=books.play.sem.Z,db=()=>document.getElementById('dpBook')
                        ,dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY)
                        ,zone=t=>db().contains(t)||!!(z.nav.el&&z.nav.el.contains(t)) // the reading pane, and the areas themselves the moment they cover it
                        ,zb=document.getElementById('zmT'),ib=document.getElementById('zmI');
                    if(zb)zb.onclick=()=>{z.on?z.hide():z.show();};z.zb(); // the switch in the menu bar works the same two ways the keys do
                    try{z.inv=localStorage.getItem(z.invKey)==='1'?1:0;}catch(e){} // the way round the reader chose is theirs across visits too
                    if(ib)ib.onclick=()=>{z.inv=z.inv?0:1;try{localStorage.setItem(z.invKey,z.inv?'1':'0');}catch(e){}z.ib();};z.ib(); // ⇄ only changes how a gesture is read – never what a key says
                    let base=0,sx=0,sy=0,sw=0,acc=0,at=0; // base = the pinch width the last step was taken at, sx/sy = where a one-finger swipe began, sw = it may still be a swipe, acc/at = how far – and how long ago – a trackpad pinch turned
                    document.onkeydown=e=>{
                        if(e.key==='Control'||e.key==='Shift'){ // ⌃⇧ is the switch itself, not something to hold: pressed together they put the areas up, pressed together again they take them down – ⌃ alone does nothing (and bare ⌃arrows belong to Mission Control)
                            z.key=e.ctrlKey&&e.shiftKey?1:0;
                            if(z.key&&!z.mod){z.mod=1;if(z.on)z.hide();else z.enter();}
                            return;}
                        if(!z.on||(e.ctrlKey&&!e.shiftKey))return; // the arrows and the hand belong to the map the whole time it is up, not only while the two keys are held – and bare ⌃arrows are still Mission Control's
                        const k=e.key;
                        if(k==='Enter'){e.preventDefault();z.jump();} // ⏎ = the double click: into the cell the pointer stands on, and out of the map
                        else if(k==='Escape'){if(z.q){z.q='';z.nav.applyQ();}else z.hide();} // Esc: out of the filter while one is set – out of the zoom when none is
                        else if(k==='ArrowLeft' ||k===','||k==='<'){e.preventDefault();books.play.render.nav(-1);}  // 🫲
                        else if(k==='ArrowRight'||k==='.'||k==='>'){e.preventDefault();books.play.render.nav(1);}  // 🫱
                        else if(k==='ArrowUp'  ){e.preventDefault();z.drill(-1);} // ↑ = up the tree, like the nav's ⬆ (coarser)
                        else if(k==='ArrowDown'){e.preventDefault();z.drill(1,e.altKey);}   // ↓ = into the children (finer); +alt = the fork not taken last
                        else if(k==='='||k==='+'){e.preventDefault();z.drill(1,e.altKey);}  // + = finer (hand down); +alt = the other fork
                        else if(k==='-'||k==='_'){e.preventDefault();z.drill(-1);} // − = coarser (hand up)
                        else if(z.nav.keyQ(e))e.preventDefault(); // anything else keyed while the areas are up cuts the text after the title and reads the map through it: every cloud is built again on what is left of its own text, and keeps what carries the key
                    };
                    document.onkeyup=e=>{if(e.key==='Control'||e.key==='Shift'){z.key=e.ctrlKey&&e.shiftKey?1:0;z.mod=0;}}; // letting the keys go ends nothing: what they put up stays up until they are pressed together again
                    document.onmousedown=e=>{if(e.buttons===3&&db().contains(e.target)){z.m=1;z.enter();}};
                    document.onmouseup=e=>{if(z.m&&e.buttons<3)z.hide();};
                    // touch, in the reading pane: two fingers put the areas up and keep them up after they let go – a pinch opens or closes a level and leaves them standing, a two-finger touch with nothing pinched is the way out; one finger sideways = 🫲/🫱
                    document.addEventListener('touchstart',e=>{
                        if(!zone(e.target))return;
                        if(e.touches.length>1){z.t=1;sw=0;z.pin=0;z.was=z.on;base=dist(e.touches);z.enter();} // sw=0: a second finger means it is a pinch, not a swipe
                        else if(e.touches.length===1){sw=1;sx=e.touches[0].clientX;sy=e.touches[0].clientY;} // a swipe is decided when the finger lifts – a tap stays a tap
                    },{passive:true});
                    document.addEventListener('touchmove',e=>{
                        if(!z.t||e.touches.length<2)return;
                        if(e.cancelable)e.preventDefault(); // the pinch is ours, not the browser's page zoom – what it changes is the semantic level
                        const d=base?dist(e.touches):0;
                        if(d&&d/base>=1.35){base=d;z.pin=1;z.zoom(1);}               // fingers apart = one step – which way that step goes is the switch's business, not the gesture's (z.zoom)
                        else if(d&&d/base<=0.74){base=d;z.pin=1;z.zoom(-1);}         // fingers together = the same step, the other way
                    },{passive:false});
                    document.addEventListener('touchend',e=>{
                        if(z.t&&e.touches.length<2){z.t=0;if(!z.pin&&z.was)z.hide();} // the two fingers let go: the areas stay up – only a touch that pinched nothing closes what stood before it
                        if(sw&&!e.touches.length){ // one finger lifted: a long, level, sideways drag was a hand, not a scroll
                            const t=e.changedTouches[0]||{clientX:sx,clientY:sy},dx=t.clientX-sx,dy=t.clientY-sy;sw=0;
                            if(Math.abs(dx)>48&&Math.abs(dx)>2*Math.abs(dy))books.play.render.nav(dx<0?1:-1);
                        }
                    },{passive:true});
                    // a trackpad pinch comes as ctrl+wheel; it means the same thing here – and only over the reading pane, so the rest of the page keeps its own zoom
                    document.addEventListener('wheel',e=>{
                        if(!e.ctrlKey||!db().contains(e.target))return;
                        if(e.cancelable)e.preventDefault();
                        const now=Date.now();if(now-at>400)acc=0;at=now; // a pause starts a new pinch
                        acc+=e.deltaY;
                        if(Math.abs(acc)>=25){z.zoom(acc>0?-1:1);acc=0;} // a trackpad pinch arrives as a wheel: up (negative deltaY) is fingers apart, down is fingers together – one step, read the same way as the fingers; ~25 is one step, tune here if a trackpad is too eager
                    },{passive:false});
                    window.onblur=()=>{z.key=z.mod=0;z.hide();};
                    window.onresize=()=>{if(z.ov&&z.ov.style.display==='block')z.show();};
                }
            }
        }
        ,wire:()=>{
            dbNavList.onclick=ev=>{
                const a=ev.target.closest('a[data-book],a[data-i],a[data-m],a[data-ch],a[data-su],a[data-go],a[data-edit]');
                if(!a)return;
                if(a.dataset.pdf!==undefined){books.play.book=a.dataset.book;books.play.openPdf(a.dataset.pdf);return;} // shelf: PDF-only book
                if(a.dataset.lg!==undefined){books.play.book=a.dataset.book;books.play.open(a.dataset.lg,a.dataset.ed,1);return;} // version leaf → its layer (pl1 Book Copy)
                if(a.dataset.book){books.play.pick(a.dataset.book);return;}
                if(a.dataset.edit!==undefined){books.play.editOn=!books.play.editOn;books.play.render.toc();books.play.render.draw();return;} // shelf: (edit) toggle
                if(a.dataset.go!==undefined){books.play.render.go(+a.dataset.go);return;}                     // "⬆ level above" – any of the parents
                if(a.dataset.ch!==undefined){books.play.render.setCh(+a.dataset.ch);books.play.render.go(2);return;} // node = select (next/prev); drilling happens on the leaf rows
                if(a.dataset.su!==undefined){books.play.render.setSu(+a.dataset.su);if(a.dataset.i===undefined){books.play.render.go(3);return;}} // sub chapter node → select it (stay); a leaf also names its sub chapter, so fall through and drill   // sub chapter → pl3
                if(a.dataset.i!==undefined)books.play.render.idx=+a.dataset.i; // remember which sentence/word we drilled from, so pl6a/pl5b can name the node
                if(a.dataset.si!==undefined)books.play.render.si=+a.dataset.si;
                if(a.dataset.w!==undefined)books.play.render.wi=+a.dataset.w;
                if(a.dataset.ln!==undefined)books.play.render.li=+a.dataset.ln;
                books.play.render.go(+a.dataset.m,a.dataset.i!==undefined||a.dataset.ln!==undefined); // the layer the node belongs to (same layer = just select it)
            };
            window.onhashchange=()=>books.play.render.hash();
            const le=document.getElementById('lang'),ve=document.getElementById('ver');if(le)le.onclick=books.play.lang;if(ve)ve.onclick=books.play.ver;
            books.play.render.lv=books.play.render.ic.map((ic,i)=>({pl:(books.play.LV[i]&&books.play.LV[i].pl)||'pl'+i,ic,nm:(books.play.LV[i]&&books.play.LV[i].t)||''}));
            books.play.render.bar();
            books.play.render.guide();
            books.play.sem.Z.init();
            books.play.ready=books.play.probe().then(s=>{if(s&&s.length)books.play.render.toc();books.play.hi();}); // shelf arrives async → redraw the nav and the id once it lands; parse() waits on this for a deep link
            books.play.lang();
            books.play.render.el.page.addEventListener('click',ev=>{
                const b=ev.target.closest('.spPlay');if(b){ev.preventDefault();books.play.spTgl(b);return;}
                const s=ev.target.closest('button[data-se],a[data-se]');if(!s)return; // pl0 details / edit window
                const act=s.dataset.se;
                if(act==='open'){ev.preventDefault();books.play.seOpen(s.dataset.lg,s.dataset.ed);}
                else if(act==='pdf')books.play.openPdf(s.dataset.pdf);
                else if(act==='add')books.play.seAdd();
                else if(act==='del')books.play.seDel(s);
                else if(act==='copy')books.play.seCopy();
                else if(act==='reset')books.play.seReset();
            });
            // typing in the edit window keeps the box as-is (no redraw) but updates the shelf + nav live
            books.play.render.el.page.addEventListener('input',ev=>{if(ev.target.closest&&ev.target.closest('#page .se')){books.play.seSet(books.play.seRead(),false);}});
            books.play.render.el.page.addEventListener('change',ev=>{if(ev.target.closest&&ev.target.closest('#page .se')){books.play.seSet(books.play.seRead(),true);}}); // checkbox → redraw
            const dbjs=document.createElement('script');dbjs.src='https://aigap.no/db.js?v=8';dbjs.onerror=()=>console.warn('[db.js] could not load in the background');document.head.appendChild(dbjs); // SUPABASE config → songs resolve to spotify urls
            const musicjs=document.createElement('script');musicjs.type='module';musicjs.src=books.play.root+'music.js?v=8';musicjs.onerror=()=>console.warn('[music.js] could not load in the background');document.head.appendChild(musicjs); // ES module (export) → must be type=module, else the whole file fails to parse. Music player for Spotify links (aigap.no/m-code) – gormb.github.io/?id has moved to aigap.no/id
            setTimeout(()=>books.play.render.blink(document.getElementById('hiUrl'),3),400); // the hint that says which keys to press blinks three times on the first load
        }
    }
};
books.play.wire();
