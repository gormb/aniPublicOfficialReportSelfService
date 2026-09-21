const books={
    play:{
        md:{
            fn:'',txt:'',title:'',pages:[],pgs:[],sts:[],tr:[],chs:[],subs:[],subCh:[],lns:[]
            ,books:['LifeDemandedDeath','CV','ABook']
            ,set:_fn=>{if(_fn!==books.play.md.fn){books.play.md.fn=_fn;books.play.md.load();}}
            ,load:()=>{books.play.md.busy=1;fetch(books.play.md.fn,{cache:'no-store'}).then(r=>r.text()).then(t=>{books.play.md.txt=t;books.play.md.parse();}).catch(()=>{books.play.render.el.page.innerHTML='Fant ikke '+books.play.md.fn;});}
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
        ,book:'LifeDemandedDeath',lg:'NO',ed:'PREM',bd:'',shelf:null,pdf:null // bd = bindet: den fysiske boka, ett av flere når verket går over flere bind
        ,inP:new URLSearchParams(location.search).get('p') // the deep link, read once at load – nothing may rewrite ?p= before parse gets to use it
        ,root:'../' // play/ lives under Book/ – data root (b/, music.js) sits one level up
        ,fnOf:()=>books.play.root+'b/'+books.play.book+'/b_'+books.play.lg+'_'+books.play.ed+(books.play.bd?'_'+books.play.bd:'')+'.md' // the bind is part of the file name when there is one
        ,open:(lg,ed,to,bd)=>{books.play.pdf=null;books.play.lg=lg||books.play.lg;books.play.ed=ed||books.play.ed;if(bd!==undefined)books.play.bd=bd; // a switch keeps the bind unless it names one
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
        ,titleOf:(bk,lg,ed,bd)=>{ // custom shelf title – most specific wins: that copy, then book›lg›ed, then book›lg, then the book string.
            lg=lg||books.play.lg; ed=ed||books.play.ed; bd=bd===undefined?books.play.bd:bd; // Never fall back ACROSS languages: NO and EN titles differ, and PREM/FREE – or two bind – may too.
            const man=((books.play.manifest||{}).books||[]).find(x=>x.book===bk)||{};
            const ver=(books.play.versionsOf(man).find(x=>x.lg===lg&&x.ed===ed&&(x.bd||'')===(bd||''))||{}).title; // per-copy title from the edit window
            if(ver)return ver;
            const t=((books.play.shelf||[]).find(x=>x.book===bk)||{}).title;
            if(typeof t==='string'&&t)return t;
            if(t){const v=t[lg],r=(typeof v==='string'?v:'')||((v&&typeof v==='object')&&v[ed])||t[lg+'_'+ed]||(bd?t[lg+'_'+ed+'_'+bd]:'');if(r)return r;}
            return (bk===books.play.book&&books.play.md.title)?books.play.md.title:bk; // else the open file's own H1, else the folder name
        }
        ,copyName:v=>{const t=books.play.titleOf(v.book,v.lg,v.ed,v.bd);return v.bd?t+' · '+v.bd:t;} // a copy's name: its title for that language/edition, plus the bind when the work has several
        ,nodename:pl=>{ // the ACTUAL node sitting at that level right now – the level's own name is only metadata
            const md=books.play.md,R=books.play.render,sg=books.play.render.slug;
            const bk=books.play.book,bt=books.play.titleOf(bk),w=(((md.sts[R.curSent()]||{}).txt||'').match(/\S+/g)||[])[R.wi]||'';
            const ch=(md.chs[R.ch]||[])[0],su=(R.cSub()||[])[0],pg=md.pages[R.curPage()]||{};
            const one=s=>String(s||'').slice(0,40);
            return ({
                pl0:bk?(bk+(sg(bt)===sg(bk)?'':' · '+bt)):'',                                    // the book on the shelf
                pl1:md.title?(books.play.flag(books.play.lg)+books.play.edIc(books.play.ed)+' '+books.play.copyName({book:bk,lg:books.play.lg,ed:books.play.ed,bd:books.play.bd})):'', // the copy you are reading: bind × language × edition
                pl2:ch&&ch.h?ch.h[1]:'',                                                               // the main chapter
                pl3:su&&su.h?su.h[1]:'',                                                               // the sub chapter
                pl4b:pg.pn?String(pg.pn):'',                                                      // the page – named by its page number, never by the heading it happens to start with
                pl4a:one((md.pgs[R.curPar()]||{}).txt),                                                // the paragraph
                pl5a:one((md.sts[R.curSent()]||{}).txt),                                                // the sentence
                pl6a:w,pl5b:(R.curLine()||{}).t||'',pl6b:(R.curLine()||{}).t||''                                                           // not tracked yet → caller falls back to the level name
            })[pl]||'';
        }
        ,pick:(b,lg,ed,bd)=>{books.play.book=b;const vs=(books.play.shelf||[]).filter(x=>x.book===b),l=lg||books.play.lg,e=ed||books.play.ed,d=bd===undefined?books.play.bd:bd; // keep the wanted copy – bind and all – if this book has it, else take one it does
            const v=vs.find(x=>x.lg===l&&x.ed===e&&(x.bd||'')===(d||''))||vs.find(x=>x.lg===l&&x.ed===e)||vs.find(x=>x.lg===l)||vs.find(x=>x.lg===books.play.lg)||vs[0];
            if(v&&v.pdf)books.play.openPdf(v.pdf);else if(v)books.play.open(v.lg,v.ed,0,v.bd||'');else books.play.open();}
        ,ovKey:'play.shelf.override'
        ,editOn:false // shelf: view the versions as links, or edit books/versions
        ,manifest:null,src:'' // the editable shelf manifest + where it came from
        ,versionsOf:x=>x.versions&&x.versions.length?x.versions:(x.lg&&x.ed?x.lg.flatMap(lg=>x.ed.map(ed=>({lg,ed}))):[]) // one place that knows both manifest shapes
        ,rebuild:()=>{ // manifest object → the flat list the nav browses
            const man=books.play.manifest||{books:[]},o=[];
            (man.books||[]).forEach(x=>{
                books.play.versionsOf(x).forEach(v=>o.push({book:x.book,title:x.title,lg:v.lg,ed:v.ed,bd:v.bd||'',fn:books.play.root+'b/'+x.book+'/b_'+v.lg+'_'+v.ed+(v.bd?'_'+v.bd:'')+'.md'})); // one row per copy – two bind of a work are two rows
                if(x.pdf)o.push({book:x.book,title:x.title,pdf:x.pdf,fn:''});
            });
            books.play.shelf=o;
            return o;
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
                const row=cb.closest('.seV');
                const t=(row.querySelector('[data-se="vt"]')||{}).value||'',bd=(row.querySelector('[data-se="vb"]')||{}).value||'';
                const v={lg:cb.dataset.lg,ed:cb.dataset.ed};
                if(bd.trim())v.bd=bd.trim(); // the bind is the copy's own: two bind, two rows
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
        ,seOpen:(lg,ed,bd)=>{books.play.seSet(books.play.seRead(),false);books.play.open(lg,ed,1,bd||'');} // a copy → jump down a level
        ,seBind:()=>{ // one more bind of the same work: a fresh copy row to name (bind, language and edition each point at their own file)
            const bs=books.play.seRead(),i=Math.max(0,Math.min(bs.length-1,books.play.selIdx())),b=bs[i]||{},cur=b.versions||[]
                ,next=['I','II','III','IV','V','VI','VII','VIII','IX','X'].find(x=>!cur.some(v=>(v.bd||'')===x))||'I';
            b.versions=cur.concat([{lg:books.play.lg,ed:books.play.ed,bd:next}]);bs[i]=b;books.play.seSet(bs,true);}
        ,seCopy:()=>{const txt=JSON.stringify(books.play.manifest,null,1);
            const say=m=>{const s=document.getElementById('seMsg');if(s)s.textContent=m;};
            if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(()=>say('JSON kopiert – lim inn i b/shelf.json')).catch(()=>say('Kunne ikke kopiere'));
            else say('Klipp ut JSON-en under');}
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
            return books.play.shelf=ok;
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
            {pl:'pl0',no:'Bokhylle',en:'Book Shelf',q:'Hvilke bøker er relevante for gitt innhold?',nav:'Every book concept on the shelf, each with its own copies beneath it – clicking a concept selects that book, each copy (bind × 🇳🇴/🇬🇧 × 👑/🔓, or a PDF) opens that book copy',page:'The chosen book: its copies as links, and the edit window (✎ in the nav) where books and copies are added, renamed or removed',thoughts:'At shelf scale the units are books, which are filtered by concept, genre and language. A work may be published in several binds – a bind is the physical book, one of a series, so each bind sits as its own copy under the concept. Each book can be in different versions and languages (especially now premium/freemium and NO/EN but later also eg DK) The nav lists all concepts at once, because this is the level where the book itself is chosen.',child:[{t:'Hvilken bok og versjon?',w:'The shelf is the entry point: pick a book (LifeDemandedDeath, CV, ABook) plus copy – bind (when the work has several), language (NO/EN) and edition (FREE/PREM). The copy pins the source file b/{book}/b_{NO|EN}_{FREE|PREM}[_{bind}].md.'},{t:'Konsept eller sjanger',w:'Filter the shelf by concept or genre (memoir, fiction, essay) so a theme-led reader reaches the right book without knowing the title in advance.'},{t:'Stil eller språk',w:'Style (poetic/plain) and language narrow the shelf further, and are reused as filters at the deeper levels described in pl_dev_0.'}]}
            ,{pl:'pl1',no:'Bokeksemplar',en:'Book Copy',q:'Hva er den overordnede strukturen for innholdet?',nav:'The copy you are reading – the physical book: its bind (one of a possible series) in its language and edition – with its main chapters beneath it, each chapter opens that chapter',page:'The whole copy in reading order: every main chapter and sub chapter as one text',thoughts:'At book copy scale the unit is the physical book you hold: one bind of a work that may run over several, in its language and edition – those three pin the source file b/{book}/b_{lang}_{edition}[_{bind}].md. The bind has its own spine: its own chapter sequence, its own start and end, its own numbering. The abstract work is the shelf level above, which is why the copy is what can be lent, annotated and read from cover to cover. The units here are chapters (##) and their sub-sections (###); the nav jumps straight to a chapter, which then acts as parent for the finer levels below it.',child:[{t:'Hvilket bind?',w:'Which bind of the series this copy is, and what it holds: where it begins and ends, and its own chapter numbering. The bind belongs to the copy, not to the concept – so two binds of the same work are two copies on the shelf, each with its own file and its own spine.'},{t:'Hvilket kapittel?',w:'At book copy scale the units are chapters (##) and their sub-sections (###); the nav jumps straight to a chapter, which then acts as parent for the finer levels below it.'},{t:'«Hero\u2019s Journey» – hvilken fase?',w:'Annotate each chapter against the narrative arc (call, ordeal, return…) so readers see where the structure is conventional and where it deliberately breaks.'},{t:'Hva bør jobbes med',w:'Collect copy-scale improvements – chapters that are too thin, too dense or out of order – as the work queue that the finer zoom levels then act on.'}]}
            ,{pl:'pl2',no:'Hovedkapittel',en:'Main Chapter',q:'Hva er i denne Main Chapter, og hva er Sub Chapters?',nav:'The main chapter you are on, with its sub chapters beneath it – each sub chapter opens that sub chapter',page:'That one main chapter: every sub chapter under it, in reading order',thoughts:'At Main Chapter scale the units are groups of chapters that share a theme; the section acts as the coarser parent of its chapters.',child:[{t:'Hvilke kapitler?',w:'List the chapters inside this section and their order.'},{t:'Hvilket tema?',w:'The theme or arc that binds the section\u2019s chapters together.'},{t:'Hva bør jobbes med',w:'Section-level improvements: pacing, ordering and balance across chapters.'}]}
            ,{pl:'pl3',no:'Underkapittel',en:'Sub Chapter',q:'Hva er i dette Sub Chapter?',nav:'The sub chapter you are on, and beneath it its pages on the left beside its paragraphs on the right – a click opens that page or that paragraph',page:'That sub chapter: its 🎵 song, then its whole text, page by page',thoughts:'At Sub Chapters scale the units are single chapters; the nav jumps into the chapter and its pages.',child:[{t:'Hvilke sider?',w:'Which pages belong to the chapter, and in which order.'},{t:'Hva skjer?',w:'What the chapter advances in the story or argument.'},{t:'Hva bør jobbes med',w:'Chapter-level improvements: too thin, too dense or out of order.'}]}
            ,{pl:'pl4b',no:'Bokside',en:'Page',q:'Hva er på denne siden?',nav:'The page you are on, with its lines beneath it – each line opens the Line level',page:'That page: the fragment a paragraph continues with, then the paragraphs that start on it, set as lines; 🫲/🫱 walk the pages',thoughts:'At page scale the units are pages (with p.N anchors); the nav jumps between pages, and the lines are the page\u2019s own typographic decomposition \u2013 the anchor eye tracking later maps a gaze to.',child:[{t:'Hvilke linjer?',w:'The lines the page is set in: word wrapped at the golden-ratio measure (\u224866 characters), at 1.15 line spacing.'},{t:'Hva formidles?',w:'What the page communicates: content, mood or key point.'},{t:'Hva bør jobbes med',w:'Page-level polish: flow, rhythm and visual balance.'}]}
            ,{pl:'pl4a',no:'Paragraf',en:'Paragraph',q:'Hva er i denne paragrafen?',nav:'The paragraph you are on, with its sentences beneath it – each sentence opens the Sentence level',page:'That paragraph read as text: the block its sentences build',thoughts:'At paragraph scale the units are paragraphs – blocks of related sentences.',child:[{t:'Hvilke setninger?',w:'The sentences that build this paragraph.'},{t:'Hva sies?',w:'The paragraph\u2019s main point or idea.'},{t:'Hva bør jobbes med',w:'Paragraph-level edits: clarity, rhythm and transitions.'}]}
            ,{pl:'pl5a',no:'Setning',en:'Sentence',q:'Hva er i denne setningen?',nav:'The sentence you are on, with its words beneath it – each word opens the Word level',page:'That sentence read as text: grammar, word order and tone are decided here',thoughts:'At sentence scale the units are sentences; grammar and style tools live here.',child:[{t:'Hvilke ord?',w:'The words that form the sentence and their roles.'},{t:'Hva betyr den?',w:'The meaning and function of the sentence in context.'},{t:'Hva bør jobbes med',w:'Sentence-level improvements: grammar, word order and tone.'}]}
            ,{pl:'pl6a',no:'Ord',en:'Word',q:'Hva er i dette ordet?',nav:'The word you are on, standing alone as the node – the finest unit of the text spine',page:'That word set large, with its path and the question it answers: meaning, inflection and usage',thoughts:'At word scale the units are words: meaning, inflection and what to improve. Word-level features (lookup, glossary) apply here and deeper.',child:[{t:'Hva betyr ordet',w:'Look up meaning, inflections and usage – the finest content level where dictionary lookup applies.'},{t:'Hva bør jobbes med',w:'Which word needs editorial attention: clarity, style or accuracy.'}]}
            ,{pl:'pl5b',no:'Linje',en:'Line',q:'Hva er i denne linjen?',nav:'The line you are on, with its four media forms beneath it – Forgrunn, Bakgrunn, Lyd and Bevegelse, each opening the Media Form level',page:'That line read as text: its length against the measure, where it breaks, and how it is set',thoughts:'At line scale the unit is one measured line of the page: its length against the golden-ratio measure, where it breaks, and its leading. A gaze lands on a line, so eye tracking belongs here.',child:[{t:'Linjelengde',w:'How much the line carries, measured against the golden-ratio optimum of about 66 characters.'},{t:'Linjebrudd',w:'Where the line breaks and why: word wrap, hyphenation or a deliberate break.'},{t:'Skrift, størrelse og leading',w:'Which face and size set the line, and the 1.15 line spacing that fixes the page grid.'},{t:'Ligaturer og kerning',w:'Pairs that join or tighten inside the line (fi, fl, AV).'}]}
            ,{pl:'pl6b',no:'Medieform',en:'Media Form',q:'Hvilke modaliteter former det presenterte?',nav:'The line you are on, standing alone as the node – the line whose media is drawn',page:'Its four media rows: colour, background, sound (Spotify Play) and motion',thoughts:'At media-form scale the unit is the presented materialisation of the finer node: the same content carried by a modality – visual (colour, background, image), auditory (music/Spotify), motion (video). Modalities are dimensions, so each is one row here; Spotify playback is the auditory dimension, anchored to the page (🎵 … — p. N) and drawn for the line.',child:[{t:'🎨 Forgrunn (farge)',w:'Which colour renders the presented unit; changing colour restyles it as a whole.'},{t:'🖼️ Bakgrunn',w:'What renders behind the unit: solid colour, gradient or image.'},{t:'🎵 Lyd – Spotify Play',w:'The song is a media form anchored to its Underkapittel (### — p. N) heading; pages inside that subchapter inherit it. Decode the aigap.no/m-code (SpotKey), resolve it to a Spotify URL and embed the player here.'},{t:'🎬 Bevegelse / video',w:'Motion or video as a media form for the presented unit.'}]}
        ]
        ,up:{pl0:null,pl1:'pl0',pl2:'pl1',pl3:'pl2',pl4a:'pl3',pl4b:'pl3',pl5a:'pl4a',pl5b:'pl4b',pl6a:'pl5a',pl6b:'pl5b'}
        ,child:pl=>books.play.LV.filter(x=>books.play.up[x.pl]===pl).map(x=>x.pl)
        ,ix:pl=>{const i=books.play.LV.findIndex(x=>x.pl===pl);return i<0?0:i;}
        ,id:i=>(books.play.LV[i]||{}).pl||('pl'+i)
        ,ancestors:pl=>{const a=[];let p=books.play.up[pl];while(p){a.unshift(p);p=books.play.up[p];}return a;}
        ,path:pl=>books.play.ancestors(pl).concat(pl)
        ,chain:pl=>books.play.path(pl).map(p=>{const L=books.play.LV.find(x=>x.pl===p);return L?L.no:'';}).filter(Boolean).join(' › ')
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
        ,names:pl=>{ // per level: the names to be unique among, the name that is on, and how to pick one (a cut token resolves by prefix)
            const R=books.play.render,md=books.play.md,s=books.play.shelf||[],su=R.cSub()||[]
                ,pn=p=>p&&p.h?p.h[1]:(p&&p.pn?'#'+p.pn:'') // a chapter/sub chapter is named by its heading
                ,pgn=p=>p&&p.pn?String(p.pn):'' // a PAGE is named by its bare number – the name of the page, not an anchor, so no #
                ,bk=[...new Set([...s.map(x=>x.book),...md.books])]
                ,vs=s.filter(x=>x.book===books.play.book)
                ,ch=md.chs.map(c=>pn(c[0])),ks=R.chSubs(R.ch),subs=ks.map(k=>pn((md.subs[k]||[])[0])),pgs=su.map(pgn)
                ,pars=md.pgs.filter(p=>su.some(q=>q.pn===p.pn))
                ,ss=R.sentT((md.pgs[R.curPar()]||{}).txt||'')
                ,ws=(((md.sts[R.si]||{}).txt||'').match(/\S+/g)||[])
                ,lns=R.lnsOf().map(l=>l.t); // the page's lines – what pl5b is unique among
            const f=(ns,t)=>books.play.hiFit(ns,t);
            return ({
                pl0:[bk,books.play.book,t=>books.play.pick(f(bk,t)||t)]
                ,pl1:[[...new Set(vs.filter(x=>x.lg).map(x=>x.lg))],books.play.lg,t=>books.play.open(t,books.play.ed,1)]
                ,pl1e:[[...new Set(vs.filter(x=>x.lg===books.play.lg).map(x=>x.ed))],books.play.ed,t=>books.play.open(books.play.lg,t,1)]
                ,pl1b:[[...new Set(vs.filter(x=>x.lg===books.play.lg&&x.ed===books.play.ed&&x.bd).map(x=>x.bd))],books.play.bd,t=>books.play.open(books.play.lg,books.play.ed,1,t)] // the bind – empty for a work in one bind
                ,pl2:[ch,pn((md.chs[R.ch]||[])[0]),t=>{const h=f(ch,t);if(h!==undefined)R.setCh(ch.indexOf(h));}]
                ,pl3:[subs,pn(su[0]),t=>{const h=f(subs,t);if(h!==undefined)R.setSu(ks[subs.indexOf(h)]);}]
                ,pl4b:[pgs,pgn(md.pages[R.pi]),t=>{const h=f(pgs,t);if(h!==undefined){R.pi=(su[pgs.indexOf(h)]||{}).pgi||0;R.idx=R.pi+1;}}]
                ,pl4a:[pars.map(p=>p.txt),String((md.pgs[R.curPar()]||{}).txt||''),t=>{const h=f(pars.map(p=>p.txt),t),p=h!==undefined?pars.find(p=>p.txt===h):null;if(p)R.idx=md.pgs.indexOf(p);}]
                ,pl5a:[ss,String((md.sts[R.curSent()]||{}).txt||''),t=>{const h=f(ss,t);if(h!==undefined)R.idx=R.si=R.baseOf(R.curPar())+ss.indexOf(h);}]
                ,pl5b:[lns,((R.curLine()||{}).t)||'',t=>{const h=f(lns,t);if(h!==undefined)R.li=lns.indexOf(h);}]
                ,pl6a:[ws,ws[R.wi]||'',t=>{const h=f(ws,t);if(h!==undefined)R.wi=R.idx=ws.indexOf(h);}]
                ,pl6b:[[''],'',()=>{}]
            })[pl]||[[''],'',()=>{}];
        }
        ,hi:()=>{ // #hiId ← what is selected: the top layer (book*language*edition*bind) before the first '.', then one token per level below
            const m=books.play.render.mode
                ,ns=['pl0','pl1','pl1e','pl1b','pl2','pl3'].slice(0,m<4?[0,4,5,6][m]:6) // nothing at the shelf – it lists every book concept itself; from the book copy up the same segment names book*language*edition*bind (the bind token is empty for a work in one bind)
                    .concat(m<4?[]:m===4?['pl4b']:m>7?['pl4b','pl5b']:['pl4a','pl5a','pl6a'].slice(0,m-4))
                ,tk=pl=>{const a=books.play.names(pl);return pl==='pl1b'?String(a[1]==null?'':a[1]).trim():books.play.hiCut(a[0],a[1]);} // the bind is a label, not prose: it stands as written (II stays II, never i)
                ,k=m?4:1
                ,top=ns.slice(0,k).map(tk).filter(Boolean).join('*')
                ,deep=ns.slice(k).map(tk).filter(Boolean).join('.')
                ,id=deep?top+'.'+deep:top;
            const e=document.getElementById('hiId');if(e)e.textContent=id;
            const u=new URL(location.href);if(u.searchParams.get('p')!==id){u.searchParams.set('p',id);history.replaceState(history.state,'',u);} // only when it really changes, and without dropping history.state – other scripts keep their own data there
            return id;
        }
        ,hiGo:id=>{ // ?p=<book*language*edition*bind>.<main chapter>.<sub chapter>… – a reload continues in hiMore. Any token may be '*' = any, ie the first
            const s=String(id||'').split('.'),t=s[0].split('*').map(x=>x.trim()); // the top layer: book concept, language, edition, bind
            if(!t[0])t[0]='*'; // an empty book slot asks for any book
            books.play.pendId=s.slice(1).map(x=>x.trim());
            books.play.pendVer=!!t[1]||!!t[2]; // a named version lands on the book copy, a bare book concept on the shelf
            const a=books.play.names('pl0'),b=books.play.hiFit(a[0],t[0]);
            const lg=t[1]?books.play.hiFit(books.play.names('pl1')[0],t[1])||books.play.lg:books.play.lg // an unnamed axis keeps what is on
                ,ed=t[2]?books.play.hiFit(books.play.names('pl1e')[0],t[2])||books.play.ed:books.play.ed
                ,bd=t[3]!==undefined?t[3]:undefined; // the bind is a label, taken as written – a link without one keeps the bind the chosen copy has
            if(b!==undefined&&b!==books.play.book)books.play.pick(b,lg,ed,bd); // one load, straight to the named copy – two loads would lose the layer we are walking to
            else if(!books.play.pdf&&(lg!==books.play.lg||ed!==books.play.ed||(bd!==undefined&&bd!==books.play.bd)))books.play.open(lg,ed,1,bd===undefined?books.play.bd:bd); // a PDF-only book has no copies to switch
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
            ,mode:0,idx:0,pi:0,ch:0,su:0,pending:null,si:0,wi:0,li:0 // ch/su = active chapter/sub, pending = layer after an async load, si/wi = sentence+word we drilled from, li = line of the page (pl5b)
            ,setMode:()=>{books.play.render.el.lvBars.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.lv===books.play.render.mode));}
            ,bar:()=>{const lv=books.play.render.lv,cld=books.play.child,ix=books.play.ix,btn=p=>{const o=lv[ix(p)]||{pl:p,nm:p,ic:'•'};return '<button data-lv="'+ix(p)+'" title="'+o.pl+' '+o.nm+'">'+o.ic+'</button>';},td1=p=>'<td rowspan="2">'+btn(p)+'</td>',tdx=p=>'<td>'+btn(p)+'</td>',chain=p=>{const a=[p];let c=cld(p);while(c.length===1){a.push(c[0]);c=cld(c[0]);}return a;};let node='pl0',cc=cld(node);while(cc.length===1){node=cc[0];cc=cld(node);}const spine=books.play.path(node),cols=cld(node).slice().reverse().map(chain);books.play.render.el.lvBars.innerHTML='<table><tr>'+spine.map(td1).join('')+(cols[0]||[]).map(p=>'<td class="txt">'+btn(p)+'</td>').join('')+'<td rowspan="2" class="zm"><button data-zm="up" title="coarser">−</button></td></tr><tr>'+(cols[1]||[]).map(p=>'<td class="pag">'+btn(p)+'</td>').join('')+'</tr></table>';books.play.render.el.lvBars.onclick=ev=>{const x=ev.target.closest('button');if(!x)return;if(x.dataset.zm==='up'){const p=books.play.up[books.play.id(books.play.render.mode)];if(p)books.play.render.go(books.play.ix(p));}else if(x.dataset.lv!==undefined){books.play.render.go(+x.dataset.lv);}};books.play.render.setMode();}
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
            ,go:(n,keep)=>{if(!keep)books.play.render.align(n);books.play.render.mode=n;const sp=/^(pl\d+)([ab])$/.exec(books.play.id(n));if(sp)books.play.sem.Z.sp=sp[2];books.play.render.setMode();books.play.render.toc();books.play.render.draw();books.play.render.sync();}
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
                                .concat(s.filter(x=>x.book===b).map(v=>{const vt=books.play.copyName(v);
                                    return v.pdf
                                        ?a2(vt,'data-book="'+esc(v.book)+'" data-pdf="'+esc(v.pdf)+'" title="'+esc(vt+' – PDF')+'" aria-label="'+esc(vt+' PDF')+'"',1,'📕')
                                        :a2(vt,'data-book="'+esc(v.book)+'" data-lg="'+v.lg+'" data-ed="'+v.ed+'" data-bd="'+esc(v.bd||'')+'" title="'+esc(vt+' – '+v.lg+' '+v.ed+(v.bd?' bind '+v.bd:''))+'" aria-label="'+esc(vt+' '+v.lg+' '+v.ed+(v.bd?' '+v.bd:''))+'"',1,books.play.flag(v.lg)+books.play.edIc(v.ed));}));});}
                    // pl1 – the version you are reading (node) with its main chapters beneath it (leaves)
                    ,()=>{const v=(books.play.shelf||[]).find(x=>x.book===books.play.book&&((x.fn&&x.fn===md.fn)||(x.pdf&&x.pdf===books.play.pdf)))
                            ,nd=v?a2(books.play.copyName(v),'data-book="'+esc(v.book)+'"'+(v.pdf?' data-pdf="'+esc(v.pdf)+'"':' data-lg="'+v.lg+'" data-ed="'+v.ed+'" data-bd="'+esc(v.bd||'')+'"')+' class="lvnode on"',0,books.play.flag(v.lg)+books.play.edIc(v.ed))
                                :a2(md.title,'class="lvnode on"',0,'📖');
                        return [nd].concat(md.chs.map((c,i)=>a2(c[0].h[1],'data-ch="'+i+'"',1,'📖')));}
                    // pl2 – the chapter you are on (node) with its sub chapters beneath it (leaves)
                    ,()=>{const c=md.chs[R.ch];if(!c)return [];
                        return [a2(c[0].h[1],'data-ch="'+R.ch+'" class="lvnode on"',0,'📖')]
                            .concat(R.chSubs(R.ch).map(k=>{const h=md.subs[k][0].h;return a2(h[1],'data-su="'+k+'"',1,ic[h[0]]||'📑');}));}
                    // pl3 – the split hierarchy: pages (Bokside) on the left, paragraphs (Paragraf) on the right, both drill
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
                    // pl6a Ord – the word you are on ends the text spine (semantic) – the page's lines hang under the page, never here
                    ,()=>{const w=wOf(R.si,R.wi);return [a2(w,'class="lvnode on"',0,'🔤')];}
                    // pl5b Linje – the line you are on (node) with its media forms beneath it (leaves)
                    ,()=>{const l=R.curLine(),mm=[['\u{1F3A8}','Forgrunn'],['\u{1F5BC}\uFE0F','Bakgrunn'],['\u{1F3B5}','Lyd'],['\u{1F3AC}','Bevegelse']];
                        return [a2(l?l.t:'','class="lvnode on"',0,R.lv[8].ic)].concat(mm.map(m=>a2(m[1],'data-m="9"',1,m[0])));}
                    // pl6b Medieform – the line alone: the modalities are drawn in the page, not in the nav
                    ,()=>{const l=R.curLine(),pg=md.pages[R.pi]||{},nn=l?l.t:(pg.h?pg.h[1]:(pg.pn?'p. '+pg.pn:md.title));
                        return [a2(nn||'','class="lvnode on"',0,'🎨')];}
                ];
                // The nav frame is just the TOP row: drill up (or (edit) on the shelf). Drilling down is what the leaf rows do.
                const jump=p=>{ // up = the actual node above you, not the level's name – and the level's own icon, not an arrow
                    const i=books.play.ix(p),L=books.play.LV[i]||{no:p,en:''},node=books.play.nodename(p)
                        ,ic=((books.play.render.lv||[])[i]||{}).ic||books.play.render.ic[i]||'';
                    return a2(node||L.no,'data-go="'+i+'" class="lvup"'
                        +' title="'+books.play.render.esc('opp til '+(node?node+' – ':'')+L.no+' ('+(L.pl||p)+' '+(L.en||'')+')')+'"',0,ic);
                };
                // ALL the parents, not just the one directly above: the whole chain, the highest level at the top and the
                // nearest parent last (so the list reads as the path down to here and the row under it is the node itself).
                // Any parent can be left in one click instead of walking up one level at a time.
                const ups=books.play.ancestors(books.play.id(books.play.render.mode)).map(jump).join('');
                const up=ups||'<a data-edit="1" class="lvup'+(books.play.editOn?' on':'')+'" title="'+books.play.render.esc(books.play.editOn?'ferdig – vis versjonene som lenker':'rediger hvilke bøker og versjoner som finnes')+'">✎ '+(books.play.editOn?'(ferdig)':'(edit)')+'</a>'; // nothing above the shelf, so the slot edits the shelf itself
                R.el.nav.innerHTML=up+o[R.mode]().join('');
                R.hands();
            }
            ,esc:x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            ,slug:s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'')
            ,spotKey:u=>books.play.SpotKey(u) // song code: gormb query (?msoe) or aigap path (/msoe) – gormb.github.io/?id har flyttet til aigap.no/id
            ,qr:u=>{const k=books.play.render.spotKey(u);return k?'<img src="https://aigap.no/i/'+k+'.qr1.png" style="height:66px;image-rendering:pixelated;">':'';}
            ,mus:l=>{const u=(l.match(/https?:\/\/[^\s)]+/)||[''])[0];return '<a href="'+u+'">\u{1F3B5}</a>'+books.play.render.qr(u);}
            ,songOf:p=>{const a=books.play.md.pages||[],i=a.indexOf(p);for(let k=i;k>=0;k--)if(a[k].mu)return a[k].mu;return '';} // nearest 🎵 at or before page p (songs live on the Underkapittel heading)
            ,media:p=>{ // pl6b: the presented unit + one row per modality
                const mu=books.play.render.songOf(p),key=books.play.render.spotKey(mu)
                    ,l=books.play.render.curLine(),node=l?l.t:(p&&p.h?p.h[1]:(p&&p.pn?'p. '+p.pn:books.play.md.title))
                    ,row=(ic,t,w,x)=>'<div class="mf"><b>'+ic+' '+books.play.render.esc(t)+'</b><div class="mfw">'+books.play.render.esc(w)+'</div>'+(x||'')+'</div>';
                return '<h1>'+books.play.render.esc(books.play.render.lv[9].nm)+'</h1>'
                    +'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl6b'))+(node?' – '+books.play.render.esc(node):'')+'</p>'
                    +row('\u{1F3A8}','Forgrunn (farge)','Fargen som former det presenterte.')
                    +row('\u{1F5BC}\uFE0F','Bakgrunn','Det som står bak det presenterte.')
                    +row('\u{1F3B5}','Lyd – Spotify Play',mu?'Kode '+key+' – sang knyttet til dette nivået.':'Ingen sang knyttet til dette nivået.',mu?'<button class="spPlay" data-u="'+mu+'">\u25B6 \u266A</button> '+books.play.render.qr(mu):'')
                    +row('\u{1F3AC}','Bevegelse / video','Bevegelse eller video som medieform.')
                    +'<div id="spHolder"></div>';
            }
            ,subView:()=>{ // pl3: the chosen sub chapter – its 🎵 song, then its text. One item per page so 🫲/🫱 and the nav step through pages.
                const su=books.play.render.cSub();
                if(!su||!su.length)return [books.play.render.lv[3].nm+' – velg et underkapittel i listen'];
                const mu=books.play.render.songOf(su[0]),key=books.play.render.spotKey(mu);
                const song='<div class="subsong">'+(mu
                    ?'\u{1F3B5} <b>'+books.play.render.esc(key)+'</b> <a href="'+books.play.render.esc(mu)+'">'+books.play.render.esc(mu)+'</a> '
                        +'<button class="spPlay" data-u="'+books.play.render.esc(mu)+'">\u25B6 \u266A</button>'+books.play.render.qr(mu)
                    :'Ingen sang knyttet til dette underkapittelet.')+'</div>';
                return su.map((p,i)=>(i?'':song)+books.play.render.page(p));
            }
            ,shelfEdit:()=>{ // pl0 details for the CHOSEN book: what is available, and the edit window for it
                const esc=books.play.render.esc,bs=(books.play.manifest||{books:[]}).books||[];
                const i=Math.max(0,Math.min(bs.length-1,books.play.selIdx())),b=bs[i];
                const head=(x)=>'<h1>'+esc(x||books.play.LV[0].no)+'</h1>';
                const src=books.play.src==='localStorage'
                    ?'⚠ endringer ligger i nettleseren – b/shelf.json er ikke endret. Bruk Kopier JSON for å gjøre det permanent, eller Nullstill.'
                    :(books.play.src?'leser b/shelf.json':'fant ingen shelf.json');
                const bar='<div class="seRow"><button data-se="add">+ bok</button>'
                    +'<button data-se="copy">Kopier JSON</button>'
                    +'<button data-se="reset">Nullstill</button><span class="seMsg" id="seMsg"></span></div>'
                    +'<details class="seJsonBox"><summary>JSON for b/shelf.json</summary>'
                    +'<pre class="seJson">'+esc(JSON.stringify({books:bs},null,1))+'</pre></details>';
                if(!b)return '<div class="se" data-b="0">'+head()+'<p class="seHint">Ingen bøker i shelf.json – legg til en.</p>'+bar+'</div>';
                const srcTxt=books.play.src==='localStorage'?'endringer ligger i nettleseren – b/shelf.json er ikke endret'
                    :(books.play.src?'leser b/shelf.json':'');
                const bindsOf=(lg,ed)=>[...new Set(books.play.versionsOf(b).filter(x=>x.lg===lg&&x.ed===ed).map(x=>x.bd||''))]; // the binds this combo has – an empty list means one bind-less row to tick
                if(!books.play.editOn){ // VIEW: this book's available copies, as links (that is LV.pl0.page)
                    const links=books.play.versionsOf(b).filter(v=>v.lg).map(v=>{const bd=v.bd||'';
                        return '<a class="seOpen" data-se="open" data-lg="'+books.play.render.esc(v.lg)+'" data-ed="'+books.play.render.esc(v.ed)+'" data-bd="'+books.play.render.esc(bd)+'" title="åpne '+books.play.render.esc(v.lg+' '+v.ed+(bd?' bind '+bd:''))+'\">'
                            +books.play.flag(v.lg)+books.play.edIc(v.ed)+'&nbsp;'+books.play.render.esc(books.play.copyName({book:b.book,lg:v.lg,ed:v.ed,bd:bd}))+'</a>';});
                    if(b.pdf)links.push('<a class="seOpen" data-se="pdf" data-pdf="'+books.play.render.esc(b.pdf)+'" title="PDF">📕&nbsp;'+books.play.render.esc(books.play.titleOf(b.book))+'</a>');
                    return '<div class="se" data-b="'+i+'">'+head(b.book)
                        +'<p class="seHint">'+books.play.render.esc(srcTxt)+'</p>'
                        +'<div class="seVers">'+links.join('')+'</div>'
                        +'<p class="seHint">✎ (edit) i listen til venstre for å endre hvilke bøker og kopier som finnes.</p></div>';
                }
                const slot=(lg,ed,bd)=>{ // one copy: checked = available, the inputs are its own bind and title (empty inherits), åpne = jump down a level
                    const same=v=>v.lg===lg&&v.ed===ed&&(v.bd||'')===(bd||'');
                    const own=((books.play.versionsOf(b).find(same)||{}).title)||'';
                    const on=books.play.versionsOf(b).some(same);
                    const eff=own||books.play.titleOf(b.book,lg,ed,bd||'');
                    const lbl=lg+' '+ed+(bd?' bind '+bd:'');
                    return '<label class="seV"><input type="checkbox" data-se="on" data-lg="'+lg+'" data-ed="'+ed+'" data-bd="'+esc(bd||'')+'"'+(on?' checked':'')+'> '
                        +books.play.flag(lg)+books.play.edIc(ed)
                        +' <input class="seB" data-se="vb" value="'+esc(bd||'')+'" placeholder="bind" title="bind – den fysiske boka når verket går over flere bind">'
                        +' <input class="seT" data-se="vt" value="'+esc(own)+'" placeholder="'+esc(eff)+'" title="'+esc(lbl)+'">'
                        +(on?' <a class="seOpen" data-se="open" data-lg="'+lg+'" data-ed="'+ed+'" data-bd="'+esc(bd||'')+'" title="åpne '+esc(lbl)+'">åpne ▸</a>':'')
                        +'</label>';
                };
                return '<div class="se" data-b="'+i+'">'+head(b.book)
                    +'<p class="seHint">'+esc(src)+'</p>'
                    +'<div class="seBook" data-b="'+i+'">'
                    +'<div class="seRow"><input class="seId" data-se="book" value="'+esc(b.book||'')+'" placeholder="mappe under b/" title="book folder">'
                    +'<button data-se="del" title="Fjern boken fra hylla">🗑</button>'
                    +'<button data-se="bind" title="én kopi mer av samme verk – et nytt bind">+ bind</button></div>'
                    +['NO','EN'].flatMap(lg=>['PREM','FREE'].flatMap(ed=>{const bs=bindsOf(lg,ed);return (bs.length?bs:['']).map(bd=>slot(lg,ed,bd));})).join('')
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
                // pl6a Ord – the word itself
                ,()=>{const st=books.play.md.sts[books.play.render.si],w=st?((st.txt.match(/\S+/g)||[])[books.play.render.wi]||''):'';
                    return ['<h1>'+books.play.render.esc(books.play.LV[7].no)+'</h1>'
                        ,'<p class="wbig">'+books.play.render.esc(w)+'</p>'
                        ,'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl6a'))+(w?' – '+books.play.render.esc(w):'')+'</p>'
                        ,'<p>'+books.play.render.esc(books.play.LV[7].q)+'</p>'];} // ordbok-oppslag, bøyning og bruk hører hit
                // pl5b Linje – the line as it sits in the measure: ONE item, because draw() renders only v[idx]
                ,()=>{const l=books.play.render.curLine(),t=l?l.t:'';
                    return ['<h1>'+books.play.render.esc(books.play.LV[8].no)+'</h1>'
                        ,'<p class="lbig">'+books.play.render.esc(t)+'</p>'
                        ,'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl5b'))+'</p>'];} // the line itself – never the hardcoded guiding question
                ,()=>[books.play.render.media(books.play.md.pages[books.play.render.pi]||{})]
            ][books.play.render.mode]()
            ,reset:()=>{books.play.render.mode=books.play.render.pending||0;books.play.render.pending=null;books.play.render.idx=0;books.play.render.setMode();const t=books.play.render.el.title;if(t)t.textContent=books.play.md.title;books.play.render.toc();books.play.render.sync();}
            ,draw:()=>{
                const R=books.play.render,v=R.views();
                if(R.mode===4)R.pi=Math.max(0,R.idx-1); // the page layer: idx 0 is the title, so the page is one back
                R.el.page.innerHTML=v[Math.max(0,Math.min(v.length-1,R.idx))]||''; // an empty level (eg a book with no chapters yet) must not print "undefined"
                R.hl();
                R.focus();
                R.hands();
            }
            ,hl:()=>{const m=books.play.render.mode;books.play.render.el.nav.querySelectorAll('a[data-i]').forEach(a=>a.classList.toggle('on',+a.dataset.m===m&&+a.dataset.i===books.play.render.idx));}
            ,focus:()=>{ // keep the active node in view – the lists get long (pl3 is ~260 rows)
                const n=books.play.render.el.nav;if(!n)return;
                const el=n.querySelector('a.lvnode.on')||n.querySelector('a.on');if(!el)return;
                const r=el.getBoundingClientRect(),b=n.getBoundingClientRect();
                if(r.top<b.top||r.bottom>b.bottom)n.scrollTop+=(r.top-b.top)-(b.height/2-r.height/2); // centre it, and only the nav scrolls
            }
            ,lvitem:x=>{const up=books.play.ancestors(x.pl).map(p=>{const L=books.play.LV.find(l=>l.pl===p);return L?L.no:'';}).filter(Boolean).join(' › ');return '<li id="'+x.pl+'">'+(up?'<div class="lvpath">'+books.play.render.esc(up)+' ›</div>':'')+books.play.render.esc(x.no)+' <i>'+books.play.render.esc(x.en)+'</i> – '+books.play.render.esc(x.q)+(x.nav&&x.nav!=='todo'?'<details><summary>Nav shows</summary>'+books.play.render.esc(x.nav)+'</details>':'')+(x.page&&x.page!=='todo'?'<details><summary>Page shows</summary>'+books.play.render.esc(x.page)+'</details>':'')+(x.thoughts?'<details open><summary>Thoughts</summary>'+books.play.render.esc(x.thoughts)+'</details>':'')+(x.child&&x.child.length?'<details open><summary>Planned</summary><ol>'+x.child.map(c=>'<li>'+books.play.render.esc(c.t)+(c.w?'<details><summary>Thoughts</summary>'+books.play.render.esc(c.w)+'</details>':'')+'</li>').join('')+'</ol></details>':'')+'</li>';}
            ,guide:()=>{const g=document.getElementById('lvGuide');if(!g)return;g.innerHTML=books.play.LV.map(x=>books.play.render.lvitem(x)).join('');}
            ,sync:()=>{const L=books.play.LV[books.play.render.mode]||books.play.LV[0];const h=document.getElementById('dbPlayTitle');if(h)h.textContent=L.no+' – '+L.q;const c=document.getElementById('dpCur');if(c){c.className='cur '+(L.pl||'');c.textContent=L.en;}const g=document.getElementById('lvGuide');if(g)g.innerHTML=books.play.render.lvitem(L);books.play.render.ctl();books.play.hi();}
            ,ctl:()=>{const c=document.getElementById('lvCtl');if(!c)return;const pl=books.play.id(books.play.render.mode),kids=books.play.child(pl);let h='';kids.slice().reverse().forEach(k=>{const K=books.play.LV[books.play.ix(k)];h+='<button data-go="'+books.play.ix(k)+'" title="finer: '+(K?K.no:k)+'">+</button>';});c.innerHTML=h;c.onclick=ev=>{const x=ev.target.closest('button');if(!x||x.dataset.go===undefined)return;if(x.dataset.go==='up'){const p=books.play.up[pl];if(p)books.play.render.go(books.play.ix(p));}else books.play.render.go(+x.dataset.go);};}
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
                        return {l:vs,i:Math.max(0,vs.findIndex(v=>(v.fn&&v.fn===md.fn)||(v.pdf&&v.pdf===books.play.pdf))),go:v=>v.pdf?books.play.openPdf(v.pdf):books.play.open(v.lg,v.ed,1,v.bd||'')};} // pl1 – still swaps copies of THIS book (bind × language × edition), never books
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
            ,nav:d=>{const R=books.play.render,S=R.sibs(),k=S.i+d;if(k<0||k>=S.l.length)return;S.go(S.l[k]);R.toc();R.draw();R.sync();}
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
                ov:null,m:0,t:0,sp:'a' // sp = the spine the user last stood on (a = text, b = page) – it decides which way the pl3 fork drills in; pl4a until then
                ,box:()=>books.play.sem.Z.ov||(books.play.sem.Z.ov=Object.assign(document.body.appendChild(document.createElement('div')),{id:'semOv'}))
                ,show:()=>{books.play.sem.Z.box().style.display='block';document.body.classList.add('zoom');} // the overlay covers the screen itself (inset:-50vmax) – no rect maths to be out-zoomed
                ,hide:()=>{const z=books.play.sem.Z;if(z.ov)z.ov.style.display='none';z.m=z.t=0;document.body.classList.remove('zoom');}
                ,enter:()=>books.play.sem.Z.show()
                ,drill:d=>{const R=books.play.render,z=books.play.sem.Z,pl=books.play.id(R.mode),ks=books.play.child(pl)
                    ,k=d>0?(ks.length>1?'pl4'+z.sp:ks[0]):books.play.up[pl]; // + = finer (the fork goes where the user last was), − = coarser
                    if(k)R.go(books.play.ix(k));}
                ,init:()=>{
                    const z=books.play.sem.Z,db=()=>document.getElementById('dpBook')
                        ,dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
                    let base=0,sx=0,sy=0,sw=0,acc=0,at=0; // base = the pinch width the last step was taken at, sx/sy = where a one-finger swipe began, sw = it may still be a swipe, acc/at = how far – and how long ago – a trackpad pinch turned
                    document.onkeydown=e=>{
                        if(e.key==='Control'||e.key==='Shift'){if(e.ctrlKey&&e.shiftKey)z.enter();return;} // ⌃⇧ anywhere is Z-mode – not only while hovering the book; ⌃ alone does nothing (and bare ⌃arrows belong to Mission Control)
                        if(!e.ctrlKey||!e.shiftKey)return;
                        const k=e.key;
                        if(k==='ArrowLeft' ||k===','||k==='<'){e.preventDefault();books.play.render.nav(-1);}  // 🫲
                        else if(k==='ArrowRight'||k==='.'||k==='>'){e.preventDefault();books.play.render.nav(1);}  // 🫱
                        else if(k==='ArrowUp'  ){e.preventDefault();z.drill(-1);} // ↑ = up the tree, like the nav's ⬆ (coarser)
                        else if(k==='ArrowDown'){e.preventDefault();z.drill(1);}   // ↓ = into the children (finer)
                        else if(k==='='||k==='+'){e.preventDefault();z.drill(1);}  // + = finer
                        else if(k==='-'||k==='_'){e.preventDefault();z.drill(-1);} // − = coarser
                    };
                    document.onkeyup=e=>{if(!e.ctrlKey||!e.shiftKey)z.hide();}; // releasing either key ends Z-mode
                    document.onmousedown=e=>{if(e.buttons===3&&db().contains(e.target)){z.m=1;z.enter();}};
                    document.onmouseup=e=>{if(z.m&&e.buttons<3)z.hide();};
                    // touch, in the reading pane: two fingers = Z-mode like ⌃⇧ held, apart = a finer level, together = a coarser one; one finger sideways = 🫲/🫱
                    document.addEventListener('touchstart',e=>{
                        if(!db().contains(e.target))return;
                        if(e.touches.length>1){z.t=1;sw=0;base=dist(e.touches);z.enter();} // sw=0: a second finger means it is a pinch, not a swipe
                        else if(e.touches.length===1){sw=1;sx=e.touches[0].clientX;sy=e.touches[0].clientY;} // a swipe is decided when the finger lifts – a tap stays a tap
                    },{passive:true});
                    document.addEventListener('touchmove',e=>{
                        if(!z.t||e.touches.length<2)return;
                        if(e.cancelable)e.preventDefault(); // the pinch is ours, not the browser's page zoom – what it changes is the semantic level
                        const d=base?dist(e.touches):0;
                        if(d&&d/base>=1.35){base=d;z.drill(1);}      // apart → more detail
                        else if(d&&d/base<=0.74){base=d;z.drill(-1);} // together → less detail
                    },{passive:false});
                    document.addEventListener('touchend',e=>{
                        if(z.t&&e.touches.length<2)z.hide();
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
                        if(Math.abs(acc)>=25){z.drill(acc<0?1:-1);acc=0;} // apart → finer, together → coarser; ~25 is one step, tune here if a trackpad is too eager
                    },{passive:false});
                    window.onblur=z.hide;
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
            books.play.render.lv=books.play.render.ic.map((ic,i)=>({pl:(books.play.LV[i]&&books.play.LV[i].pl)||'pl'+i,ic,nm:(books.play.LV[i]&&books.play.LV[i].no)||''}));
            books.play.render.bar();
            books.play.render.guide();
            books.play.sem.Z.init();
            books.play.ready=books.play.probe().then(s=>{if(s&&s.length)books.play.render.toc();books.play.hi();}); // shelf arrives async → redraw the nav and the id once it lands; parse() waits on this for a deep link
            books.play.lang();
            books.play.render.el.page.addEventListener('click',ev=>{
                const b=ev.target.closest('.spPlay');if(b){ev.preventDefault();books.play.spTgl(b);return;}
                const s=ev.target.closest('button[data-se],a[data-se]');if(!s)return; // pl0 details / edit window
                const act=s.dataset.se;
                if(act==='open'){ev.preventDefault();books.play.seOpen(s.dataset.lg,s.dataset.ed,s.dataset.bd);}
                else if(act==='bind')books.play.seBind();
                else if(act==='pdf')books.play.openPdf(s.dataset.pdf);
                else if(act==='add')books.play.seAdd();
                else if(act==='del')books.play.seDel(s);
                else if(act==='copy')books.play.seCopy();
                else if(act==='reset')books.play.seReset();
            });
            // typing in the edit window keeps the box as-is (no redraw) but updates the shelf + nav live
            books.play.render.el.page.addEventListener('input',ev=>{if(ev.target.closest&&ev.target.closest('#page .se')){books.play.seSet(books.play.seRead(),false);}});
            books.play.render.el.page.addEventListener('change',ev=>{if(ev.target.closest&&ev.target.closest('#page .se')){books.play.seSet(books.play.seRead(),true);}}); // checkbox → redraw
            const dbjs=document.createElement('script');dbjs.src='https://aigap.no/db.js?v=8';dbjs.onerror=()=>console.warn('[db.js] kunne ikke lastes i bakgrunnen');document.head.appendChild(dbjs); // SUPABASE config → songs resolve to spotify urls
            const musicjs=document.createElement('script');musicjs.type='module';musicjs.src=books.play.root+'music.js?v=8';musicjs.onerror=()=>console.warn('[music.js] kunne ikke lastes i bakgrunnen');document.head.appendChild(musicjs); // ES module (export) → must be type=module, else the whole file fails to parse. Music player for Spotify links (aigap.no/m-code) – gormb.github.io/?id har flyttet til aigap.no/id
        }
    }
};
books.play.wire();