const books={
    play:{
        md:{
            fn:'',txt:'',title:'',pages:[],pgs:[],sts:[],tr:[],chs:[],subs:[],subCh:[]
            ,books:['LifeDemandedDeath','CV','ABook']
            ,set:_fn=>{if(_fn!==books.play.md.fn){books.play.md.fn=_fn;books.play.md.load();}}
            ,load:()=>fetch(books.play.md.fn,{cache:'no-store'}).then(r=>r.text()).then(t=>{books.play.md.txt=t;books.play.md.parse();}).catch(()=>{books.play.render.el.page.innerHTML='Fant ikke '+books.play.md.fn;})
            ,parse:()=>{
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
                        if(!_m&&tail&&!books.play.render.sent(last)&&(books.play.render.hangs(tail.p.txt)||/^[a-zæøåäöéü,;:.)”»]/.test(_l))){ // the line above was cut mid-sentence – this is the rest of that paragraph
                            tail.p.txt+=' '+_l;tail.ps[tail.ps.length-1]+=' '+books.play.render.esc(_l);
                            if(tail.p.pn!==pn){tail.p.pn2=pn;cur.fr=(cur.fr?cur.fr+' ':'')+books.play.render.esc(_l);} // it ran onto this page, which starts with the fragment
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
                books.play.md.tr=[];
                body.forEach(l=>{const h=l.match(/^(#{2,4})\s+(.*)$/),s=l.trim(),_m=/^\u{1F3B5}/u.test(s);if(h)books.play.md.tr.push({h:1,d:h[1].length-2,t:h[2].trim()});else if(s&&!_m)books.play.md.tr.push({h:0,t:s});});
                books.play.md.index();
                books.play.render.reset();
                books.play.render.draw();
                books.play.render.hash();
            }
            ,index:()=>{
                books.play.md.chs=[];
                books.play.md.subs=[];
                let ch=null;
                books.play.md.pages.forEach(p=>{if(p.h&&p.h[0]===2){if(ch)books.play.md.chs.push(ch);ch=[];}if(ch)ch.push(p);});
                if(ch)books.play.md.chs.push(ch);
                let su=null,ci=-1; // ci = the main chapter each sub chapter belongs to
                books.play.md.subCh=[];
                books.play.md.pages.forEach(p=>{ if(p.h){if(su){books.play.md.subs.push(su);books.play.md.subCh.push(ci);}su=[];if(p.h[0]===2)ci++;} if(su)su.push(p);});
                if(su){books.play.md.subs.push(su);books.play.md.subCh.push(ci);}
            }
        }
        ,book:'LifeDemandedDeath',lg:'NO',ed:'PREM',shelf:null,pdf:null
        ,root:'../' // play/ lives under Book/ – data root (b/, music.js) sits one level up
        ,fnOf:()=>books.play.root+'b/'+books.play.book+'/b_'+books.play.lg+'_'+books.play.ed+'.md'
        ,open:(lg,ed,to)=>{books.play.pdf=null;books.play.lg=lg||books.play.lg;books.play.ed=ed||books.play.ed;lang.textContent=books.play.lg==='NO'?'🇳🇴':'🇬🇧';ver.textContent=books.play.ed==='PREM'?'👑':'🔓';
            const fn=books.play.fnOf(),reload=fn!==books.play.md.fn;
            books.play.render.pending=reload?(to||0):null; // a reload ends in reset(), which applies the target layer
            books.play.md.set(fn);
            if(!reload)books.play.render.go(to||0);        // already loaded → nothing async to wait for
        }
        ,openPdf:p=>{ // a book with no markdown yet (CV): show the PDF itself, and empty the md model so no stale chapters linger
            books.play.pdf=p;books.play.md.fn='';
            ['title','pages','chs','subs','subCh','pgs','sts','tr'].forEach(k=>books.play.md[k]=[]);
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
                pl4b:pg.h?pg.h[1]:(pg.pn?'#'+pg.pn:''),                                          // the page
                pl4a:one((md.pgs[R.curPar()]||{}).txt),                                                // the paragraph
                pl5a:one((md.sts[R.curSent()]||{}).txt),                                                // the sentence
                pl6a:w,pl5b:[...w][R.idx]||'',pl6b:pg.h?pg.h[1]:(pg.pn?'p. '+pg.pn:'')                                                           // not tracked yet → caller falls back to the level name
            })[pl]||'';
        }
        ,pick:b=>{books.play.book=b;const vs=(books.play.shelf||[]).filter(x=>x.book===b); // keep the variant if this book has it, else take one it does
            const v=vs.find(x=>x.lg===books.play.lg&&x.ed===books.play.ed)||vs.find(x=>x.lg===books.play.lg)||vs[0];
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
            {pl:'pl0',no:'Bokhylle',en:'Book Shelf',q:'Hvilke bøker er relevante for gitt innhold?',nav:'List of books (Book versions)',page:'Available languages and versions for chosen book as links',thoughts:'At shelf scale the units are books, which are filtered by concept, genre and language. Each book can be in different versions and languages (especially now premium/freemium and NO/EN but later also eg DK) The nav jumps straight to a book, which then acts as parent for the finer levels below it.',child:[{t:'Hvilken bok? og versjon?',w:'The shelf is the entry point: pick a book (LifeDemandedDeath, CV, ABook) plus variant – language (NO/EN) × edition (FREE/PREM). The variant pins the source file b/{book}/b_{NO|EN}_{FREE|PREM}.md.'},{t:'Konsept eller sjanger',w:'Filter the shelf by concept or genre (memoir, fiction, essay) so a theme-led reader reaches the right book without knowing the title in advance.'},{t:'Stil eller språk',w:'Style (poetic/plain) and language narrow the shelf further, and are reused as filters at the deeper levels described in pl_dev_0.'}]}
            ,{pl:'pl1',no:'Bokeksemplar',en:'Book Copy',q:'Hva er den overordnede strukturen for innholdet?',nav:'Main Chapters of Book version (Book on shelf with chapters)',page:'Subchapters of Main Chapter chosen, all if none selected, text in details-tags (summary subchapter name)',thoughts:'At book scale the units are chapters (##) and their sub-sections (###); the nav jumps straight to a chapter, which then acts as parent for the finer levels below it.',child:[{t:'Hvilket kapittel?',w:'At book scale the units are chapters (##) and their sub-sections (###); the nav jumps straight to a chapter, which then acts as parent for the finer levels below it.'},{t:'«Hero\u2019s Journey» – hvilken fase?',w:'Annotate each chapter against the narrative arc (call, ordeal, return…) so readers see where the structure is conventional and where it deliberately breaks.'},{t:'Hva bør jobbes med',w:'Collect book-scale improvements – chapters that are too thin, too dense or out of order – as the work queue that the finer zoom levels then act on.'}]}
            ,{pl:'pl2',no:'Hovedkapittel',en:'Main Chapter',q:'Hva er i denne Main Chapter, og hva er Sub Chapters?',nav:'Selected Main Chapter and Sub Chapters for it',page:'Selected Sub Chapter, all if none selected',thoughts:'At Main Chapter scale the units are groups of chapters that share a theme; the section acts as the coarser parent of its chapters.',child:[{t:'Hvilke kapitler?',w:'List the chapters inside this section and their order.'},{t:'Hvilket tema?',w:'The theme or arc that binds the section\u2019s chapters together.'},{t:'Hva bør jobbes med',w:'Section-level improvements: pacing, ordering and balance across chapters.'}]}
            ,{pl:'pl3',no:'Underkapittel',en:'Sub Chapter',q:'Hva er i dette Sub Chapter?',nav:'todo',page:'todo',thoughts:'At Sub Chapters scale the units are single chapters; the nav jumps into the chapter and its pages.',child:[{t:'Hvilke sider?',w:'Which pages belong to the chapter, and in which order.'},{t:'Hva skjer?',w:'What the chapter advances in the story or argument.'},{t:'Hva bør jobbes med',w:'Chapter-level improvements: too thin, too dense or out of order.'}]}
            ,{pl:'pl4b',no:'Bokside',en:'Page',q:'Hva er på denne siden?',nav:'todo',page:'todo',thoughts:'At page scale the units are pages (with p.N anchors); the nav jumps between pages.',child:[{t:'Hvilke paragrafer?',w:'The paragraphs that make up this page.'},{t:'Hva formidles?',w:'What the page communicates: content, mood or key point.'},{t:'Hva bør jobbes med',w:'Page-level polish: flow, rhythm and visual balance.'}]}
            ,{pl:'pl4a',no:'Paragraf',en:'Paragraph',q:'Hva er i denne paragrafen?',nav:'todo',page:'todo',thoughts:'At paragraph scale the units are paragraphs – blocks of related sentences.',child:[{t:'Hvilke setninger?',w:'The sentences that build this paragraph.'},{t:'Hva sies?',w:'The paragraph\u2019s main point or idea.'},{t:'Hva bør jobbes med',w:'Paragraph-level edits: clarity, rhythm and transitions.'}]}
            ,{pl:'pl5a',no:'Setning',en:'Sentence',q:'Hva er i denne setningen?',nav:'todo',page:'todo',thoughts:'At sentence scale the units are sentences; grammar and style tools live here.',child:[{t:'Hvilke ord?',w:'The words that form the sentence and their roles.'},{t:'Hva betyr den?',w:'The meaning and function of the sentence in context.'},{t:'Hva bør jobbes med',w:'Sentence-level improvements: grammar, word order and tone.'}]}
            ,{pl:'pl6a',no:'Ord',en:'Word',q:'Hva er i dette ordet?',nav:'todo',page:'todo',thoughts:'At word scale the units are words: meaning, inflection and what to improve. Word-level features (lookup, glossary) apply here and deeper.',child:[{t:'Hva betyr ordet',w:'Look up meaning, inflections and usage – the finest content level where dictionary lookup applies.'},{t:'Hva bør jobbes med',w:'Which word needs editorial attention: clarity, style or accuracy.'}]}
            ,{pl:'pl5b',no:'Bokstav',en:'Character',q:'Hva er i denne bokstaven?',nav:'todo',page:'todo',thoughts:'At glyph scale the units are letters: font, size, ligatures and kerning shape how the word is set. Typography features live here.',child:[{t:'Font',w:'Which typeface renders the glyph; changing font restyles the whole letter.'},{t:'Size',w:'Point size of the glyph, e.g. relative to body text.'},{t:'Dekorasjon / ligaturer',w:'Stylistic variants and ligature pairs (fi, fl) that join glyphs.'},{t:'Tegnavstand (kerning)',w:'Space between letter pairs; pairs naturally with ligatures at glyph level.'}]}
            ,{pl:'pl6b',no:'Medieform',en:'Media Form',q:'Hvilke modaliteter former det presenterte?',nav:'Materialisation of the chosen node as media (one row per modality)',page:'The presented unit and its media: foreground, background, sound, motion',thoughts:'At media-form scale the unit is the presented materialisation of the finer node: the same content carried by a modality – visual (colour, background, image), auditory (music/Spotify), motion (video). Modalities are dimensions, so each is one row here; Spotify playback is the auditory dimension, anchored to the page (🎵 … — p. N).',child:[{t:'🎨 Forgrunn (farge)',w:'Which colour renders the presented unit; changing colour restyles it as a whole.'},{t:'🖼️ Bakgrunn',w:'What renders behind the unit: solid colour, gradient or image.'},{t:'🎵 Lyd – Spotify Play',w:'The song is a media form anchored to its Underkapittel (### — p. N) heading; pages inside that subchapter inherit it. Decode the aigap.no/m-code (SpotKey), resolve it to a Spotify URL and embed the player here.'},{t:'🎬 Bevegelse / video',w:'Motion or video as a media form for the presented unit.'}]}
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
        ,render:{
            el:{page,nav:dbNavList,title:dbTitle,prev,next,lvBars}
            ,ic:['📚','📖','📑','📄','📃','¶','✍️','🔤','🔠','🎨']
            ,lv:[]
            ,mode:0,idx:0,pi:0,ch:0,su:0,pending:null,si:0,wi:0 // ch/su = active chapter/sub, pending = layer after an async load, si/wi = sentence+word we drilled from
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
            ,go:(n,keep)=>{if(!keep)books.play.render.align(n);books.play.render.mode=n;books.play.render.setMode();books.play.render.toc();books.play.render.draw();books.play.render.sync();}
            ,toc:()=>{
                const R=books.play.render,md=books.play.md,esc=R.esc,ic={2:'📖',3:'📑'}
                ,sep='<div class="navsep"></div>'
                ,a2=(t,at,l,ico)=>'<a '+at+'>'+'&nbsp;'.repeat(2*l)+ico+'&nbsp;'+esc(t)+'</a>'
                ,a=(t,i,l,ico,m)=>t===''?'':a2(t,'data-i="'+i+'" data-m="'+(m===undefined?R.mode:m)+'"',l,ico)
                ,wOf=(si,wi)=>(((md.sts[si]||{}).txt||'').match(/\S+/g)||[])[wi]||''
                ,o=[
                    // pl0 – books on top, each book's own versions (🇳🇴/🇬🇧 × 👑/🔓) beneath it
                    ()=>{const s=books.play.shelf,bk=books.play.book,vs=(s||[]).filter(x=>x.book===bk)
                        ,t=books.play.titleOf(bk),sub=R.slug(t)===R.slug(bk)?'':' <i class="bid">('+esc(t)+')</i>';
                        return ['<a data-book="'+esc(bk)+'" class="lvnode on" title="'+esc(bk+(sub?' – '+t:''))+'">📚&nbsp;'+esc(bk)+sub+'</a>']
                            .concat(vs.map(v=>{const vt=books.play.titleOf(v.book,v.lg,v.ed);
                                return v.pdf
                                    ?a2(vt,'data-book="'+esc(v.book)+'" data-pdf="'+esc(v.pdf)+'" title="'+esc(vt+' – PDF')+'" aria-label="'+esc(vt+' PDF')+'"',1,'📕')
                                    :a2(vt,'data-book="'+esc(v.book)+'" data-lg="'+v.lg+'" data-ed="'+v.ed+'" title="'+esc(vt+' – '+v.lg+' '+v.ed)+'" aria-label="'+esc(vt+' '+v.lg+' '+v.ed)+'"',1,books.play.flag(v.lg)+books.play.edIc(v.ed));}));}
                    // pl1 – the version you are reading (node) with its main chapters beneath it (leaves)
                    ,()=>{const v=(books.play.shelf||[]).find(x=>x.book===books.play.book&&((x.fn&&x.fn===md.fn)||(x.pdf&&x.pdf===books.play.pdf)))
                            ,nd=v?a2(books.play.titleOf(v.book,v.lg,v.ed),'data-book="'+esc(v.book)+'"'+(v.pdf?' data-pdf="'+esc(v.pdf)+'"':' data-lg="'+v.lg+'" data-ed="'+v.ed+'"')+' class="lvnode on"',0,books.play.flag(v.lg)+books.play.edIc(v.ed))
                                :a2(md.title,'class="lvnode on"',0,'📖');
                        return [nd].concat(md.chs.map((c,i)=>a2(c[0].h[1],'data-ch="'+i+'"',1,'📖')));}
                    // pl2 – the chapter you are on (node) with its sub chapters beneath it (leaves)
                    ,()=>{const c=md.chs[R.ch];if(!c)return [];
                        return [a2(c[0].h[1],'data-ch="'+R.ch+'" class="lvnode on"',0,'📖')]
                            .concat(R.chSubs(R.ch).map(k=>{const h=md.subs[k][0].h;return a2(h[1],'data-su="'+k+'"',1,ic[h[0]]||'📑');}));}
                    // pl3 – the two hierarchies sit side by side as a two-column table: pages (Bokside) │ paragraphs (Paragraf).
                    // The vertical line divides the columns, the paragraph cell is framed solid, and BOTH cells drill
                    // (page → pl4b, paragraph → pl4a). Rows run to the longer of the two lists; the shorter column stays blank.
                    ,()=>{const su=md.subs[R.su];if(!su)return [];
                        const h=su[0].h,pns=new Set(su.map(p=>p.pn)),pars=md.pgs.map((p,i)=>({p,i})).filter(x=>pns.has(x.p.pn));
                        let t='<table class="navtab"><tr><td colspan="2" class="navnode">'
                            +a2(h?h[1]:'','data-su="'+R.su+'" class="lvnode on"',0,(h&&ic[h[0]])||'📑')+'</td></tr>';
                        for(let j=0;j<pars.length;){ // one row per paragraph; the page cell spans every paragraph on that page
                            const p=pars[j].p,pn=p.pn,lab='#'+pn+(p.pn2&&p.pn2!==pn?'–'+p.pn2:'');let nc=1;
                            while(j+nc<pars.length&&pars[j+nc].p.pn===pn)nc++;
                            const row=k=>'<td class="navpar">'+a2(pars[j+k].p.txt.slice(0,60),'data-i="'+pars[j+k].i+'" data-m="5" data-su="'+R.su+'"',0,'¶')+'</td>';
                            t+='<tr><td class="navpg" rowspan="'+nc+'">'+a2(lab,'data-i="'+(R.pgiOf(pn)+1)+'" data-m="4" data-su="'+R.su+'"',0,'📄')+'</td>'+row(0)+'</tr>';
                            for(let k=1;k<nc;k++)t+='<tr>'+row(k)+'</tr>';
                            j+=nc;
                        }
                        return ['<div class="navhier">'+t+'</table></div>'];
                    }
                    // pl4b – the page you are on (node) with its paragraphs beneath it (leaves)
                    ,()=>{const pg=md.pages[R.pi];if(!pg)return [];
                        return [a2(pg.h?pg.h[1]:'#'+pg.pn,'class="lvnode on"',0,'📄')]
                            .concat(md.pgs.map((p,i)=>({p,i})).filter(x=>x.p.pn===pg.pn||x.p.pn2===pg.pn).map(x=>a(x.p.txt.slice(0,32),x.i,1,'¶',5)));}
                    // pl4a – the paragraph you are on (node) with its sentences beneath it (leaves)
                    ,()=>{const p=md.pgs[R.idx];if(!p)return [];
                        return [a2(p.txt.slice(0,34),'class="lvnode on"',0,'¶')]
                            .concat(R.sentT(p.txt).map((s,k)=>a(s.slice(0,32),R.baseOf(R.idx)+k,1,'✍️',6)));}
                    // pl5a – the sentence you are on (node) with its words beneath it (leaves)
                    ,()=>{const s=md.sts[R.idx];if(!s)return [];
                        return [a2(s.txt.slice(0,34),'class="lvnode on"',0,'✍️')]
                            .concat((s.txt.match(/\S+/g)||[]).slice(0,40).map((w,j)=>a2(w,'data-i="'+j+'" data-m="7" data-si="'+R.idx+'" data-w="'+j+'"',1,'🔤')));}
                    // pl6a Ord – the word you are on (node) with its characters beneath it (leaves)
                    ,()=>{const w=wOf(R.si,R.wi);
                        return [a2(w,'class="lvnode on"',0,'🔤')].concat([...w].map((c,j)=>a(c,j,1,'🔠',8)));}
                    // pl5b Bokstav – the character you are on (node) with its media forms beneath it (leaves)
                    ,()=>{const w=wOf(R.si,R.wi),mm=[['\u{1F3A8}','Forgrunn'],['\u{1F5BC}\uFE0F','Bakgrunn'],['\u{1F3B5}','Lyd'],['\u{1F3AC}','Bevegelse']];
                        return [a2([...w][R.idx]||'','class="lvnode on"',0,'🔠')].concat(mm.map(m=>a2(m[1],'data-m="9"',1,m[0])));}
                    // pl6b Medieform – node: the presented unit. leaves: one row per modality (exactly what LV.pl6b.nav prescribes)
                    ,()=>{const pg=books.play.md.pages[books.play.render.pi]||{},node=pg.h?pg.h[1]:(pg.pn?'p. '+pg.pn:books.play.md.title);
                        const mm=[['\u{1F3A8}','Forgrunn'],['\u{1F5BC}\uFE0F','Bakgrunn'],['\u{1F3B5}','Lyd'],['\u{1F3AC}','Bevegelse']];
                        return ['<a data-go="9" class="lvnode on" title="'+books.play.render.esc(node||'')+'">🎨&nbsp;'+books.play.render.esc(node||'')+'</a>',sep]
                            .concat(mm.map(m=>'<span class="lvleaf">'+'&nbsp;'.repeat(2)+m[0]+'&nbsp;'+books.play.render.esc(m[1])+'</span>'));} // leaves: terminal here – nothing below pl6b, so they are not selectable rows
                ];
                // The nav frame is just the TOP row: drill up (or (edit) on the shelf). Drilling down is what the leaf rows do.
                const par=books.play.up[books.play.id(books.play.render.mode)];
                const jump=p=>{ // up = the actual node above you, not the level's name
                    const L=books.play.LV.find(x=>x.pl===p)||{no:p,en:''},node=books.play.nodename(p);
                    return a2(node||L.no,'data-go="'+books.play.ix(p)+'" class="lvup"'
                        +' title="'+books.play.render.esc('opp til '+(node?node+' – ':'')+L.no+' ('+L.pl+' '+L.en+')')+'"',0,'\u2B06');
                };
                const up=par?jump(par)
                    :'<a data-edit="1" class="lvup'+(books.play.editOn?' on':'')+'" title="'+books.play.render.esc(books.play.editOn?'ferdig – vis versjonene som lenker':'rediger hvilke bøker og versjoner som finnes')+'">✎ '+(books.play.editOn?'(ferdig)':'(edit)')+'</a>'; // nothing above the shelf, so the slot edits the shelf itself
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
                    ,node=p&&p.h?p.h[1]:(p&&p.pn?'p. '+p.pn:books.play.md.title)
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
                const vs=(lg,ed)=>(books.play.versionsOf(b).find(x=>x.lg===lg&&x.ed===ed)||{}).title;
                const have=(lg,ed)=>books.play.versionsOf(b).some(x=>x.lg===lg&&x.ed===ed);
                const srcTxt=books.play.src==='localStorage'?'endringer ligger i nettleseren – b/shelf.json er ikke endret'
                    :(books.play.src?'leser b/shelf.json':'');
                if(!books.play.editOn){ // VIEW: this book's available versions, as links (that is LV.pl0.page)
                    const links=['NO','EN'].flatMap(lg=>['PREM','FREE'].map(ed=>have(lg,ed)
                        ?'<a class="seOpen" data-se="open" data-lg="'+lg+'" data-ed="'+ed+'" title="åpne '+lg+' '+ed+'">'
                            +books.play.flag(lg)+books.play.edIc(ed)+'&nbsp;'+books.play.render.esc(books.play.titleOf(b.book,lg,ed))+'</a>':''));
                    if(b.pdf)links.push('<a class="seOpen" data-se="pdf" data-pdf="'+books.play.render.esc(b.pdf)+'" title="PDF">📕&nbsp;'+books.play.render.esc(books.play.titleOf(b.book))+'</a>');
                    return '<div class="se" data-b="'+i+'">'+head(b.book)
                        +'<p class="seHint">'+books.play.render.esc(srcTxt)+'</p>'
                        +'<div class="seVers">'+links.join('')+'</div>'
                        +'<p class="seHint">✎ (edit) i listen til venstre for å endre hvilke bøker og versjoner som finnes.</p></div>';
                }
                const slot=(lg,ed)=>{ // one version: checked = available, the input is its own title (empty inherits), åpne = jump down a level
                    const own=((books.play.versionsOf(b).find(x=>x.lg===lg&&x.ed===ed)||{}).title)||'';
                    const on=books.play.versionsOf(b).some(x=>x.lg===lg&&x.ed===ed);
                    const eff=own||books.play.titleOf(b.book,lg,ed);
                    return '<label class="seV"><input type="checkbox" data-se="on" data-lg="'+lg+'" data-ed="'+ed+'"'+(on?' checked':'')+'> '
                        +books.play.flag(lg)+books.play.edIc(ed)
                        +' <input class="seT" data-se="vt" data-lg="'+lg+'" data-ed="'+ed+'" value="'+esc(own)+'" placeholder="'+esc(eff)+'" title="'+lg+' '+ed+'">'
                        +(on?' <a class="seOpen" data-se="open" data-lg="'+lg+'" data-ed="'+ed+'" title="åpne '+lg+' '+ed+'">åpne ▸</a>':'')
                        +'</label>';
                };
                return '<div class="se" data-b="'+i+'">'+head(b.book)
                    +'<p class="seHint">'+esc(src)+'</p>'
                    +'<div class="seBook" data-b="'+i+'">'
                    +'<div class="seRow"><input class="seId" data-se="book" value="'+esc(b.book||'')+'" placeholder="mappe under b/" title="book folder">'
                    +'<button data-se="del" title="Fjern boken fra hylla">🗑</button></div>'
                    +['NO','EN'].flatMap(lg=>['PREM','FREE'].map(ed=>slot(lg,ed))).join('')
                    +'<label class="seV"><input type="checkbox" data-se="pdfOn"'+(b.pdf?' checked':'')+'> 📕 '
                    +'<input class="seT" data-se="p" value="'+esc(b.pdf||'')+'" placeholder="b/CV/b.pdf" title="PDF"></label></div>'
                    +bar+'</div>';
            }
            ,sent:s=>/[.!?\u2026]["'\u201D\u2019\u00BB]?$/.test(s.trim())
            ,hangs:s=>/(^|[\s"'“‘(\[«])(på|i|og|som|til|med|av|for|en|et|den|det|de|at|om|men|å|er|var|fra|ved|ut|inn|opp|ned|seg|ikke|så|når|da|her|der|hva|hvis|enn|mens|etter|før|under|over|mellom|mot|blir|ble|har|hadde|kan|skal|vil|må|the|of|and|to|a|in|is|was|it|that|with|for|on|as|at|by|from|but|or)$/i.test(s.trim()) // a line that cannot end there
            ,sentT:s=>(s.match(/[^.!?\u2026]+[.!?\u2026]+["'\u201D\u2019\u00BB]?|\S[^.!?\u2026]*$/g)||[]).map(x=>x.trim()).filter(Boolean)
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
                ,()=>[books.play.render.subView()]
                ,()=>[{t:1}].concat(books.play.md.pages).map((p,i)=>books.play.render.page(p,i>0)) // a page also opens with the fragment a paragraph continues with
                ,()=>books.play.md.pgs.map(p=>'<p>'+books.play.render.esc(p.txt)+'</p>')
                ,()=>books.play.md.sts.map(s=>books.play.render.esc(s.txt))
                // pl6a Ord – the word itself
                ,()=>{const st=books.play.md.sts[books.play.render.si],w=st?((st.txt.match(/\S+/g)||[])[books.play.render.wi]||''):'';
                    return ['<h1>'+books.play.render.esc(books.play.LV[7].no)+'</h1>'
                        ,'<p class="wbig">'+books.play.render.esc(w)+'</p>'
                        ,'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl6a'))+(w?' – '+books.play.render.esc(w):'')+'</p>'
                        ,'<p>'+books.play.render.esc(books.play.LV[7].q)+'</p>'];} // ordbok-oppslag, bøyning og bruk hører hit
                // pl5b Bokstav – the glyph
                ,()=>{const st=books.play.md.sts[books.play.render.si],w=st?((st.txt.match(/\S+/g)||[])[books.play.render.wi]||''):'',ch=[...w][books.play.render.idx]||'';
                    return ['<h1>'+books.play.render.esc(books.play.LV[8].no)+'</h1>'
                        ,'<p class="wbig">'+books.play.render.esc(ch)+'</p>'
                        ,'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl5b'))+(w?' – '+books.play.render.esc(w):'')+'</p>'
                        ,'<p>'+books.play.render.esc(books.play.LV[8].q)+'</p>'];} // font, størrelse, ligaturer og kerning hører hit
                ,()=>[books.play.render.media(books.play.md.pages[books.play.render.pi]||{})]
            ][books.play.render.mode]()
            ,reset:()=>{books.play.render.mode=books.play.render.pending||0;books.play.render.pending=null;books.play.render.idx=0;books.play.render.setMode();books.play.render.el.title.textContent=books.play.md.title;books.play.render.toc();books.play.render.sync();}
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
            ,sync:()=>{const L=books.play.LV[books.play.render.mode]||books.play.LV[0];const h=document.getElementById('dbPlayTitle');if(h)h.textContent=L.no+' – '+L.q;const c=document.getElementById('dpCur');if(c){c.className='cur '+(L.pl||'');c.textContent=L.en;}const g=document.getElementById('lvGuide');if(g)g.innerHTML=books.play.render.lvitem(L);books.play.render.ctl();}
            ,ctl:()=>{const c=document.getElementById('lvCtl');if(!c)return;const pl=books.play.id(books.play.render.mode),kids=books.play.child(pl);let h='';kids.slice().reverse().forEach(k=>{const K=books.play.LV[books.play.ix(k)];h+='<button data-go="'+books.play.ix(k)+'" title="finer: '+(K?K.no:k)+'">+</button>';});c.innerHTML=h;c.onclick=ev=>{const x=ev.target.closest('button');if(!x||x.dataset.go===undefined)return;if(x.dataset.go==='up'){const p=books.play.up[pl];if(p)books.play.render.go(books.play.ix(p));}else books.play.render.go(+x.dataset.go);};}
            ,baseOf:i=>books.play.md.pgs.slice(0,i).reduce((n,q)=>n+books.play.render.sentT(q.txt).length,0)
            ,pgOf:si=>{let n=0;for(let k=0;k<books.play.md.pgs.length;k++){n+=books.play.render.sentT(books.play.md.pgs[k].txt).length;if(n>si)return k;}return 0;}
            ,pgiOf:pn=>{const i=books.play.md.pages.findIndex(p=>p.pn===pn);return i<0?books.play.render.pi:i;}
            ,curPar:()=>{const R=books.play.render,md=books.play.md,m=R.mode,su=R.cSub()||[],pn=m===4?((md.pages[R.pi]||{}).pn):((su[0]||{}).pn);
                if(m===5)return R.idx;
                if(m>=6)return R.pgOf(m===6?R.idx:R.si);
                const i=md.pgs.findIndex(p=>p.pn===pn);return i<0?0:i;}
            ,curSent:()=>{const R=books.play.render,m=R.mode;return m===6?R.idx:(m>=7?R.si:R.baseOf(R.curPar()));}
            ,curPage:()=>{const R=books.play.render,md=books.play.md,m=R.mode,su=R.cSub()||[]
                ,pn=m===5?((md.pgs[R.curPar()]||{}).pn):(m>=6?((md.sts[R.curSent()]||{}).pn):((su[0]||{}).pn));
                return m===4?R.pi:R.pgiOf(pn);}
            ,align:n=>{ // a coarser level opens on the parent that holds you, a finer one on the first leaf
                const R=books.play.render;if(n===R.mode)return;
                if(n===4){R.pi=R.curPage();R.idx=R.pi+1;}
                else if(n===5)R.idx=R.curPar();
                else if(n===6){const k=R.curSent();R.idx=k;R.si=k;}
                else if(n===7){R.si=R.curSent();R.wi=0;R.idx=0;}
                else if(n===8){R.si=R.curSent();R.pi=R.curPage();R.wi=0;R.idx=0;}
                else if(n===9)R.pi=R.curPage();}
            ,sibs:()=>{ // the nodes of this level and which one is on – the hands walk these and stop at the ends
                const R=books.play.render,md=books.play.md,s=books.play.shelf,su=R.cSub()||[]
                    ,pns=new Set(su.map(p=>p.pn)),pars=md.pgs.map((p,i)=>i).filter(i=>pns.has(md.pgs[i].pn))
                    ,ws=k=>(((md.sts[k]||{}).txt||'').match(/\S+/g)||[]),w=ws(R.si)[R.wi]||'',nc=[...w].length
                    ,pg=p=>{R.pi=p.pgi;R.idx=p.pgi+1;}
                    ,pgI=()=>Math.max(0,su.findIndex(p=>p.pgi===R.pi));
                return [
                    ()=>{const bs=s&&s.length?[...new Set(s.map(x=>x.book))]:md.books;
                        return {l:bs,i:Math.max(0,bs.indexOf(books.play.book)),go:b=>books.play.pick(b)};}
                    ,()=>{const vs=(s||[]).filter(x=>x.book===books.play.book);
                        return {l:vs,i:Math.max(0,vs.findIndex(v=>(v.fn&&v.fn===md.fn)||(v.pdf&&v.pdf===books.play.pdf))),go:v=>v.pdf?books.play.openPdf(v.pdf):books.play.open(v.lg,v.ed,1)};}
                    ,()=>({l:md.chs.map((_,i)=>i),i:R.ch,go:c=>R.setCh(c)})
                    ,()=>{const ks=R.chSubs(R.ch);return {l:ks,i:Math.max(0,ks.indexOf(R.su)),go:k=>R.setSu(k)};}
                    ,()=>({l:su,i:pgI(),go:pg})
                    ,()=>({l:pars,i:Math.max(0,pars.indexOf(R.idx)),go:i=>{R.idx=i;}})
                    ,()=>{const p=R.pgOf(R.idx),b=R.baseOf(p),c=R.sentT((md.pgs[p]||{}).txt||'').length;
                        return {l:Array.from({length:c},(_,k)=>b+k),i:R.idx-b,go:i=>{R.idx=i;R.si=i;}};}
                    ,()=>({l:Array.from({length:ws(R.si).length},(_,k)=>k),i:R.wi,go:i=>{R.wi=i;R.idx=i;}})
                    ,()=>({l:Array.from({length:nc},(_,k)=>k),i:R.idx,go:i=>{R.idx=i;}})
                    ,()=>({l:su,i:pgI(),go:pg})
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
        ,wire:()=>{
            dbNav.onclick=ev=>{
                const a=ev.target.closest('a[data-book],a[data-i],a[data-m],a[data-ch],a[data-su],a[data-go],a[data-edit]');
                if(!a)return;
                if(a.dataset.pdf!==undefined){books.play.book=a.dataset.book;books.play.openPdf(a.dataset.pdf);return;} // shelf: PDF-only book
                if(a.dataset.lg!==undefined){books.play.book=a.dataset.book;books.play.open(a.dataset.lg,a.dataset.ed,1);return;} // version leaf → its layer (pl1 Book Copy)
                if(a.dataset.book){books.play.pick(a.dataset.book);return;}
                if(a.dataset.edit!==undefined){books.play.editOn=!books.play.editOn;books.play.render.toc();books.play.render.draw();return;} // shelf: (edit) toggle
                if(a.dataset.go!==undefined){books.play.render.go(+a.dataset.go);return;}                     // "⬆ level above"
                if(a.dataset.ch!==undefined){books.play.render.setCh(+a.dataset.ch);books.play.render.go(2);return;} // node = select (next/prev); drilling happens on the leaf rows
                if(a.dataset.su!==undefined){books.play.render.setSu(+a.dataset.su);if(a.dataset.i===undefined){books.play.render.go(3);return;}} // sub chapter node → select it (stay); a leaf also names its sub chapter, so fall through and drill   // sub chapter → pl3
                if(a.dataset.i!==undefined)books.play.render.idx=+a.dataset.i; // remember which sentence/word we drilled from, so pl6a/pl5b can name the node
                if(a.dataset.si!==undefined)books.play.render.si=+a.dataset.si;
                if(a.dataset.w!==undefined)books.play.render.wi=+a.dataset.w;
                books.play.render.go(+a.dataset.m,a.dataset.i!==undefined); // the layer the node belongs to (same layer = just select it)
            };
            window.onhashchange=()=>books.play.render.hash();
            lang.onclick=books.play.lang;
            ver.onclick=books.play.ver;
            books.play.render.lv=books.play.render.ic.map((ic,i)=>({pl:(books.play.LV[i]&&books.play.LV[i].pl)||'pl'+i,ic,nm:(books.play.LV[i]&&books.play.LV[i].no)||''}));
            books.play.render.bar();
            books.play.render.guide();
            books.play.probe().then(s=>{if(s&&s.length)books.play.render.toc();}); // shelf arrives async → redraw the nav once it lands
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
            const dbjs=document.createElement('script');dbjs.src='https://aigap.no/db.js?v=8';dbjs.onerror=()=>console.warn('[db.js] kunne ikke lastes i bakgrunnen');document.head.appendChild(dbjs); // SUPABASE config → songs resolve to spotify urls
            const musicjs=document.createElement('script');musicjs.type='module';musicjs.src=books.play.root+'music.js?v=8';musicjs.onerror=()=>console.warn('[music.js] kunne ikke lastes i bakgrunnen');document.head.appendChild(musicjs); // ES module (export) → must be type=module, else the whole file fails to parse. Music player for Spotify links (aigap.no/m-code) – gormb.github.io/?id har flyttet til aigap.no/id
        }
    }
};
books.play.wire();