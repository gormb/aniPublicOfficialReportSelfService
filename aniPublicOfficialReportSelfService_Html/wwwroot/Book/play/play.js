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
                const _h1=md.findIndex(l=>/^#\s+\S/.test(l));
                const ti=_h1>=0?_h1:md.findIndex(l=>l.trim()&&!/^#{2,4}\s/.test(l));
                books.play.md.title=(md[ti]||'').replace(/^#+\s*/,'').trim();
                const body=md.filter((_,i)=>i!==ti);
                books.play.md.pages=[];books.play.md.pgs=[];
                let cur=null,last='',pnCur=0,tail=null;
                body.forEach(l=>{
                    const pm=l.match(/^#{3,4}\s*p\.\s*(\d+)\s*$/i),h=pm?null:l.match(/^(#{2,4})\s+(.*)$/);
                    if(pm){
                        if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);books.play.md.pages.push(cur);}
                        pnCur=+pm[1];
                        cur={h:null,pn:pnCur,ps:[]};
                    }else if(h){if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);books.play.md.pages.push(cur);} 
                        const k=h[1].length,raw=h[2].trim(),own=+(raw.match(/p\.\s*(\d+)/i)||[,0])[1];
                        if(own)pnCur=own;
                        cur={h:k>=4?null:[k,raw.replace(/\s*[\u2013\u2014-]\s*p\.\s*\d+\s*$/i,'').trim()],pn:pnCur,ps:[]};last='';tail=null;
                    }else{
                        const _l=l.trim();if(!_l)return;
                        if(!cur)cur={h:null,pn:pnCur,ps:[]};
                        const _m=/^\u{1F3B5}/u.test(_l),pn=cur.pn||pnCur;
                        if(!_m&&tail&&(/^[a-zæøåäöéü,;:.)”»]/.test(_l)||(!books.play.render.sent(last)&&books.play.render.hangs(tail.p.txt)))){
                            tail.p.txt+=' '+_l;tail.ps[tail.ps.length-1]+=' '+books.play.render.esc(_l);
                            if(tail.p.pn!==pn){tail.p.pn2=pn;if(tail.p.cut===undefined)tail.p.cut=tail.p.txt.length-_l.length-1;cur.fr=(cur.fr?cur.fr+' ':'')+books.play.render.esc(_l);cur.frT=(cur.frT?cur.frT+' ':'')+_l;}
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
                books.play.md.pages.forEach((p,i)=>p.pgi=i);
                books.play.md.pgs.forEach(p=>{const ss=books.play.render.sentT(p.txt);ss.forEach(s=>books.play.md.sts.push({pn:p.pn,txt:s}));});
                books.play.md.lns=books.play.md.pages.map(p=>{
                    const a=p.frT?books.play.render.wrap(p.frT).map(t=>({t,lp:-1})):[];
                    books.play.md.pgs.forEach((q,i)=>{if(q.pn!==p.pn)return;books.play.render.wrap(q.txt.slice(0,q.cut===undefined?q.txt.length:q.cut)).forEach(t=>a.push({t,lp:i}));});
                    return a;});
                books.play.md.lnl=books.play.md.lns.flatMap((a,i)=>a.map((_,k)=>[i,k]));
                books.play.md.wc=books.play.md.sts.map(s=>((s.txt||'').match(/\S+/g)||[]).length);
                books.play.md.tr=[];
                body.forEach(l=>{const h=l.match(/^(#{2,4})\s+(.*)$/),s=l.trim(),_m=/^\u{1F3B5}/u.test(s);if(h)books.play.md.tr.push({h:1,d:h[1].length-2,t:h[2].trim()});else if(s&&!_m)books.play.md.tr.push({h:0,t:s});});
                books.play.md.index();
                books.play.render.reset();
                books.play.render.draw();
                books.play.render.hash();
                const _p=books.play.inP;
                if(_p&&!books.play.seenP){books.play.seenP=1;(books.play.ready||Promise.resolve()).then(()=>books.play.hiGo(_p));}else books.play.hiMore();
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
        ,inP:new URLSearchParams(location.search).get('p')
        ,root:'../'
        ,fnOf:()=>books.play.root+'b/'+books.play.book+'/b_'+books.play.lg+'_'+books.play.ed+'.md'
        ,open:(lg,ed,to)=>{books.play.pdf=null;books.play.lg=lg||books.play.lg;books.play.ed=ed||books.play.ed;
            const l=document.getElementById('lang'),v=document.getElementById('ver');if(l)l.textContent=books.play.flag(books.play.lg);if(v)v.textContent=books.play.edIc(books.play.ed);
            const fn=books.play.fnOf(),reload=fn!==books.play.md.fn;
            books.play.render.pending=reload?(to||0):null;
            books.play.md.set(fn);
            if(!reload)books.play.render.go(to||0);
        }
        ,openPdf:p=>{
            books.play.pdf=p;books.play.md.fn='';
            ['title','pages','chs','subs','subCh','pgs','sts','tr','lns','lnl','wc'].forEach(k=>books.play.md[k]=[]);
            books.play.md.title='';books.play.render.ch=0;books.play.render.su=0;books.play.render.idx=0;
            const t=document.getElementById('dbTitle');if(t)t.textContent=books.play.titleOf(books.play.book,books.play.lg);
            books.play.render.go(0);
        }
        ,lang:()=>{books.play.open(/NO_/.test(books.play.md.fn)?'EN':'NO');}
        ,ver:()=>{books.play.open(books.play.lg,books.play.ed==='PREM'?'FREE':'PREM');}
        ,flag:lg=>lg==='NO'?'\u{1F1F3}\u{1F1F4}':'\u{1F1EC}\u{1F1E7}'
        ,edIc:ed=>ed==='PREM'?'\u{1F451}':'\u{1F513}'
        ,titleOf:(bk,lg,ed)=>{
            lg=lg||books.play.lg; ed=ed||books.play.ed;
            const man=((books.play.manifest||{}).books||[]).find(x=>x.book===bk)||{};
            const ver=(books.play.versionsOf(man).find(x=>x.lg===lg&&x.ed===ed)||{}).title;
            if(ver)return ver;
            const t=((books.play.shelf||[]).find(x=>x.book===bk)||{}).title;
            if(typeof t==='string'&&t)return t;
            if(t){const v=t[lg],r=(typeof v==='string'?v:'')||((v&&typeof v==='object')&&v[ed])||t[lg+'_'+ed];if(r)return r;}
            return (bk===books.play.book&&books.play.md.title)?books.play.md.title:bk;
        }
        ,copies:()=>(books.play.shelf||[]).filter(x=>x.book===books.play.book)
        ,verLab:v=>v.pdf?'\u{1F4D5} '+books.play.titleOf(v.book):books.play.flag(v.lg)+books.play.edIc(v.ed)+' '+books.play.titleOf(v.book,v.lg,v.ed)
        ,verOn:()=>{const v=books.play.copies().find(x=>(x.fn&&x.fn===books.play.md.fn)||(x.pdf&&x.pdf===books.play.pdf));return v?books.play.verLab(v):'';}
        ,nodename:pl=>{
            const md=books.play.md,R=books.play.render,sg=books.play.render.slug;
            const bk=books.play.book,bt=books.play.titleOf(bk),w=(((md.sts[R.curSent()]||{}).txt||'').match(/\S+/g)||[])[R.wi]||'';
            const ch=(md.chs[R.ch]||[])[0],su=(R.cSub()||[])[0],pg=md.pages[R.curPage()]||{};
            const one=s=>String(s||'').slice(0,40);
            return ({
                pl0:bk?(bk+(sg(bt)===sg(bk)?'':' · '+bt)):'',
                pl1:md.title?(books.play.flag(books.play.lg)+books.play.edIc(books.play.ed)+' '+books.play.titleOf(bk,books.play.lg,books.play.ed)):'',
                pl2:ch&&ch.h?ch.h[1]:'',
                pl3:su&&su.h?su.h[1]:'',
                pl4b:pg.pn?String(pg.pn):'',
                pl4a:one((md.pgs[R.curPar()]||{}).txt),
                pl5a:one((md.sts[R.curSent()]||{}).txt),
                pl6a:w,pl5b:(R.curLine()||{}).t||'',pl6b:(R.curLine()||{}).t||''
            })[pl]||'';
        }
        ,pick:(b,lg,ed)=>{books.play.book=b;const vs=(books.play.shelf||[]).filter(x=>x.book===b),l=lg||books.play.lg,e=ed||books.play.ed;
            const v=vs.find(x=>x.lg===l&&x.ed===e)||vs.find(x=>x.lg===l)||vs.find(x=>x.lg===books.play.lg)||vs[0];
            if(v&&v.pdf)books.play.openPdf(v.pdf);else if(v)books.play.open(v.lg,v.ed);else books.play.open();}
        ,ovKey:'play.shelf.override'
        ,editOn:false
        ,manifest:null,src:''
        ,versionsOf:x=>x.versions&&x.versions.length?x.versions:(x.lg&&x.ed?x.lg.flatMap(lg=>x.ed.map(ed=>({lg,ed}))):[])
        ,rebuild:()=>{
            const man=books.play.manifest||{books:[]},o=[];
            (man.books||[]).forEach(x=>{
                books.play.versionsOf(x).forEach(v=>o.push({book:x.book,title:x.title,lg:v.lg,ed:v.ed,fn:books.play.root+'b/'+x.book+'/b_'+v.lg+'_'+v.ed+'.md'}));
                if(x.pdf)o.push({book:x.book,title:x.title,pdf:x.pdf,fn:''});
            });
            books.play.shelf=o;
            books.play.loadAll();
            return o;
        }
        ,texts:{}
        ,loadAll:()=>{
            const p=books.play;if(p.md.fn&&p.md.txt)p.texts[p.md.fn]=p.md.txt;
            const fs=[...new Set((p.shelf||[]).filter(v=>v.fn).map(v=>v.fn))].filter(fn=>p.texts[fn]===undefined);
            if(!fs.length)return;
            Promise.all(fs.map(fn=>fetch(fn,{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>{p.texts[fn]=t;},()=>{p.texts[fn]='';})))
                .then(()=>{p.cloud.dfFn=null;p.sem.Z.nav.last='';p.sem.Z.nav.draw();});
        }
        ,persist:()=>{try{localStorage.setItem(books.play.ovKey,JSON.stringify(books.play.manifest));books.play.src='localStorage';}catch(e){}}
        ,seSet:(bs,redraw)=>{books.play.manifest=Object.assign({},books.play.manifest||{},{books:bs});books.play.persist();books.play.rebuild();books.play.render.toc();if(redraw)books.play.render.draw();}
        ,selIdx:()=>{const i=((books.play.manifest||{}).books||[]).map(x=>x.book).indexOf(books.play.book);return i<0?0:i;}
        ,seRead:()=>{
            const root=document.querySelector('#page .se'),bs=((books.play.manifest||{}).books||[]).slice();
            const el=root&&root.querySelector('.seBook');if(!el)return bs;
            const i=+root.dataset.b||0,prev=bs[i]||{};
            const b={book:(el.querySelector('[data-se="book"]').value||'').trim()};
            if(prev.title)b.title=prev.title;
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
        ,seOpen:(lg,ed)=>{books.play.seSet(books.play.seRead(),false);books.play.open(lg,ed,1);}
        ,seCopy:()=>{const txt=JSON.stringify(books.play.manifest,null,1);
            const say=m=>{const s=document.getElementById('seMsg');if(s)s.textContent=m;};
            if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(()=>say('JSON copied – paste it into b/shelf.json')).catch(()=>say('Could not copy'));
            else say('Cut the JSON below by hand');}
        ,seReset:()=>{try{localStorage.removeItem(books.play.ovKey);}catch(e){}books.play.manifest=null;books.play.probe().then(()=>{books.play.render.toc();books.play.render.draw();});}
        ,probe:async()=>{
            const mix=(bs,lgs,eds)=>{const o=[];bs.forEach(b=>lgs.forEach(lg=>eds.forEach(ed=>o.push({book:b,lg,ed,fn:books.play.root+'b/'+b+'/b_'+lg+'_'+ed+'.md'}))));return o;};
            let man=null,src='';
            try{const ov=localStorage.getItem(books.play.ovKey);if(ov){man=JSON.parse(ov);src='localStorage';}}catch(e){}
            if(!man||!Array.isArray(man.books)){
                man=await fetch(books.play.root+'b/shelf.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
                src=man?'shelf.json':'';
            }
            if(man&&Array.isArray(man.books)){books.play.manifest=man;books.play.src=src;return books.play.rebuild();}
            const cs=mix(books.play.md.books,['NO','EN'],['FREE','PREM']),ok=[];
            for(const c of cs){let good=false;try{const r=await fetch(c.fn,{cache:'no-store'});good=r.ok;}catch(e){}if(good)ok.push(c);}
            books.play.shelf=ok;books.play.loadAll();return ok;
        }
        ,SpotRe:/^https:\/\/(?:gormb\.github\.io\/_\/?\?m|aigap\.no\/m)(?!.*qr$)\S*/i
        ,SpotMap:null
        ,SpotQr:null
        ,qrFill:()=>{const q=books.play.SpotQr||{};
            document.querySelectorAll('img[data-qrk]').forEach(img=>{const k=img.dataset.qrk,t=q[k];
                if(t)img.src='https://aigap.no/i/'+k+'.'+t+'.png';
                if(t)img.removeAttribute('data-qrk');});}
        ,SpotLoad:async(force)=>{
            if(books.play.SpotMap&&!force)return books.play.SpotMap;
            const m={},q={},cfg=window.SUPABASE||{};
            if(cfg.url&&!cfg.url.includes('YOUR-')){
                try{const{createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
                    const{data}=await createClient(cfg.url,cfg.publishableKey).from('redir').select('id,url,"group",qr');
                    (data||[]).filter(r=>/music|playlist/i.test(String(r.group||'').trim())).forEach(r=>{
                        if(!r.id)return;
                        const put=k=>{m[k]=r.url;if(r.qr)q[k]=r.qr;};
                        put(r.id);
                        put(r.id[0]==='m'?r.id.slice(1):'m'+r.id);
                        if(r.id.endsWith('qr'))put(r.id.slice(0,-2));
                        if(r.id.endsWith('qra'))put(r.id.slice(0,-3));
                    });
                }catch(e){console.error('[Spotify] Supabase lookup failed',e);}
            }
            books.play.SpotMap=m;books.play.SpotQr=q;books.play.qrFill();
            return m;
        }
        ,SpotKey:(url)=>{
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
        ,spTgl:async(e)=>{
            const u=e.dataset?.u||e.href||'';
            const holder=document.getElementById('spHolder')||document.body;
            let f=document.getElementById('_spPlayer');
            if(!f){f=document.createElement('iframe');f.id='_spPlayer';f.className='spotify-inline';f.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';}
            holder.appendChild(f);
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
            f.style.display='block';
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
        ,child:pl=>{const k=pl==='pl1c'?'pl1':pl;return k==='pl0'?['pl1c']:books.play.LV.filter(x=>books.play.up[x.pl]===k).map(x=>x.pl);}
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
        ,hiCut:(ns,c)=>{const lo=x=>String(x==null?'':x).trim().toLowerCase(),n=lo(c);if(/^\d+$/.test(n))return n;let k=1;for(;k<n.length&&ns.filter(x=>lo(x).slice(0,k)===n.slice(0,k)).length>1;k++);return n.slice(0,k);}
        ,hiFit:(ns,t)=>{const lo=x=>String(x==null?'':x).trim().toLowerCase(),q=lo(t);if(q==='*')return ns[0];return ns.find(x=>lo(x)===q)||ns.find(x=>lo(x).startsWith(q));}
        ,names:pl=>{
            const R=books.play.render,md=books.play.md,s=books.play.shelf||[],su=R.cSub()||[]
                ,pn=p=>p&&p.h?p.h[1]:(p&&p.pn?'#'+p.pn:'')
                ,pgn=p=>p&&p.pn?String(p.pn):''
                ,bk=[...new Set([...s.map(x=>x.book),...md.books])]
                ,vs=s.filter(x=>x.book===books.play.book)
                ,lgs=[...new Set(vs.filter(x=>x.lg).map(x=>x.lg))],eds=[...new Set(vs.filter(x=>x.lg===books.play.lg).map(x=>x.ed))]
                ,cps=books.play.copies().map(v=>books.play.verLab(v))
                ,ch=md.chs.map(c=>pn(c[0])),ks=R.chSubs(R.ch),subs=ks.map(k=>pn((md.subs[k]||[])[0])),pgs=su.map(pgn)
                ,pars=md.pgs.filter(p=>su.some(q=>q.pn===p.pn))
                ,ss=R.sentT((md.pgs[R.curPar()]||{}).txt||'')
                ,ws=(((md.sts[R.si]||{}).txt||'').match(/\S+/g)||[])
                ,lns=R.lnsOf().map(l=>l.t);
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
        ,txtOf:(pl,k,fb)=>{
            const md=books.play.md,R=books.play.render,ks=R.chSubs(R.ch),su=R.cSub()||[]
                ,pars=md.pgs.filter(p=>su.some(q=>q.pn===p.pn))
                ,tx=a=>(a||[]).filter(Boolean).map(p=>md.pgs.filter(q=>q.pn===p.pn).map(q=>q.txt).join(' ')).join(' ');
            const t={pl1c:(books.play.texts[(books.play.copies()[k]||{}).fn]||''),pl1:md.pgs.map(p=>p.txt).join(' '),pl2:tx(md.chs[k]),pl3:tx(md.subs[ks[k]]),pl4b:tx([su[k]]),pl4a:(pars[k]||{}).txt,pl5b:(R.lnsOf()[k]||{}).t,pl5a:(R.sentT((md.pgs[R.curPar()]||{}).txt||'')[k]||'')}[pl];
            return t!==undefined?t:(fb||'');
        }
        ,cloud:{
            stop:/^(og|i|til|med|av|for|en|et|den|det|de|som|er|var|at|om|men|å|på|ikke|så|når|da|her|der|fra|ved|ut|inn|opp|ned|seg|kan|skal|vil|må|hadde|har|ble|blir|han|hun|jeg|du|vi|the|and|of|to|a|in|is|it|that|with|for|on|as|at|by|from|but|or|an|be|was|were|his|her|he|she|they|you|not)$/i
            ,words:(s,n,q)=>{const m={},f=String(q||'').toLowerCase();
                (String(s||'').toLowerCase().match(/[\p{L}][\p{L}'-]*/gu)||[]).forEach(w=>{if(w.length<4||books.play.cloud.stop.test(w)||(f&&w.indexOf(f)<0))return;m[w]=(m[w]||0)+1;});
                return Object.keys(m).map(w=>[w,m[w]]).sort((x,y)=>y[1]-x[1]).slice(0,n||16);}
            ,tx:new Map()
            ,cut:(s,q)=>{const c=books.play.cloud,t=String(s||''),k=String(q||'').toLowerCase(),e=c.tx.get(t);
                if(e&&e.q===k)return e.t;
                const v=k?books.play.render.sentT(t).filter(x=>x.toLowerCase().indexOf(k)>=0).join(' '):t;
                c.tx.set(t,{q:k,t:v});return v;}
            ,html:(s,n,q,b)=>{
                const c=books.play.cloud,t=c.cut(s,q),df=c.dfOf(b||c.above(),q)
                    ,a=c.words(t,Infinity,q).map(x=>[x[0],x[1]/(df[x[0]]||x[1])]).sort((x,y)=>y[1]-x[1]).slice(0,n||16);
                if(!a.length)return '';const mx=a[0][1];
                return a.map(x=>'<span style="font-size:'+(0.75+0.85*x[1]/mx).toFixed(2)+'em;color:hsl('+Math.round(120+100*(1-x[1]))+',70%,25%)">'+books.play.render.esc(x[0])+'</span>').join('');}
            ,df:{},dfFn:''
            ,shelf:()=>{const ts=Object.values(books.play.texts).filter(Boolean);return ts.length?ts.join(' '):books.play.md.txt;}
            ,above:()=>{
                const R=books.play.render,up=books.play.up;let below=books.play.id(R.mode),pl=up[below];
                while(pl&&(books.play.names(below)[0]||[]).length<2){below=pl;pl=up[pl];}
                const a=pl?books.play.names(pl):null,i=a?(a[3]||0):0;
                return {key:(pl||'pl0')+'|'+(a?String(a[1]||'').slice(0,24):'')+'|'+i+'|'+(books.play.md.fn||''),
                        txt:(pl?books.play.txtOf(pl,i,''):'')||books.play.cloud.shelf()};}
            ,dfOf:(b,q)=>{const c=books.play.cloud,k=b.key+'|'+(q||'');if(c.dfFn===k)return c.df;
                const m={};c.words(c.cut(b.txt,q),Infinity,q).forEach(x=>m[x[0]]=x[1]);c.dfFn=k;return c.df=m;}
        }
        ,hi:()=>{
            const m=books.play.render.mode
                ,ns=['pl0','pl1','pl1e','pl2','pl3'].slice(0,m<4?[0,3,4,5][m]:5)
                    .concat(m<4?[]:m===4?['pl4b']:m>7?['pl4b','pl5b']:['pl4a','pl5a','pl6a'].slice(0,m-4))
                ,tk=pl=>{const a=books.play.names(pl);return books.play.hiCut(a[0],a[1]);}
                ,k=m?3:1
                ,top=ns.slice(0,k).map(tk).filter(Boolean).join('*')
                ,deep=ns.slice(k).map(tk).filter(Boolean).join('.')
                ,id=deep?top+'.'+deep:top;
            const e=document.getElementById('hiId');if(e)e.textContent=id;
            const u=new URL(location.href);if(u.searchParams.get('p')!==id){u.searchParams.set('p',id);history.replaceState(history.state,'',u);}
            return id;
        }
        ,hiGo:id=>{
            const s=String(id||'').split('.'),t=s[0].split('*').map(x=>x.trim());
            if(!t[0])t[0]='*';
            books.play.pendId=s.slice(1).map(x=>x.trim());
            books.play.pendVer=!!t[1]||!!t[2];
            const a=books.play.names('pl0'),b=books.play.hiFit(a[0],t[0]);
            const lg=t[1]?books.play.hiFit(books.play.names('pl1')[0],t[1])||books.play.lg:books.play.lg
                ,ed=t[2]?books.play.hiFit(books.play.names('pl1e')[0],t[2])||books.play.ed:books.play.ed;
            if(b!==undefined&&b!==books.play.book)books.play.pick(b,lg,ed);
            else if(!books.play.pdf&&(lg!==books.play.lg||ed!==books.play.ed))books.play.open(lg,ed,1);
            if(!books.play.md.busy)books.play.hiMore();
        }
        ,hiMore:()=>{
            const R=books.play.render,t=books.play.pendId;
            if(t===undefined||t===null)return;
            books.play.pendId=null;
            const ver=books.play.pendVer;books.play.pendVer=null;
            if(!t.length)return R.go(ver?1:0,1);
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
            el:{page,nav:dbNavList,title:document.getElementById('dbTitle'),prev,next,lvBars,up:zmUp}
            ,ic:['📚','📖','📑','📄','📃','¶','✍️','🔤','⎶','🎨']
            ,lv:[]
            ,mode:0,idx:0,pi:0,ch:0,su:0,pending:null,si:0,wi:0,li:0,wide:0
            ,setMode:()=>{const R=books.play.render,u=R.el.up;R.el.lvBars.querySelectorAll('button').forEach(x=>x.classList.toggle('on',+x.dataset.lv===R.mode));if(u)u.disabled=!books.play.up[books.play.id(R.mode)];}
            ,bar:()=>{const lv=books.play.render.lv,cld=books.play.child,ix=books.play.ix,btn=p=>{const o=lv[ix(p)]||{pl:p,nm:p,ic:'•'};return '<button data-lv="'+ix(p)+'" title="'+o.pl+' '+o.nm+'">'+o.ic+'</button>';},td1=p=>'<td rowspan="2">'+btn(p)+'</td>',tdx=p=>'<td>'+btn(p)+'</td>',chain=p=>{const a=[p];let c=cld(p);while(c.length===1){a.push(c[0]);c=cld(c[0]);}return a;};let node='pl0',cc=cld(node);while(cc.length===1){node=cc[0];cc=cld(node);}const spine=books.play.path(node),cols=cld(node).slice().reverse().map(chain);books.play.render.el.lvBars.innerHTML='<table><tr>'+spine.map(td1).join('')+(cols[0]||[]).map(p=>'<td class="txt">'+btn(p)+'</td>').join('')+'</tr><tr>'+(cols[1]||[]).map(p=>'<td class="pag">'+btn(p)+'</td>').join('')+'</tr></table>';books.play.render.el.lvBars.onclick=ev=>{const x=ev.target.closest('button');if(x&&x.dataset.lv!==undefined)books.play.render.go(+x.dataset.lv);};if(books.play.render.el.up)books.play.render.el.up.onclick=books.play.render.coarser;books.play.render.setMode();}
            ,chSubs:i=>books.play.md.subCh.map((c,k)=>c===i?k:-1).filter(k=>k>=0)
            ,cSub:()=>books.play.md.subs[books.play.render.su]||null
            ,setCh:i=>{
                const n=books.play.md.chs.length;
                books.play.render.ch=n?Math.max(0,Math.min(n-1,i)):0;
                const ss=books.play.render.chSubs(books.play.render.ch);
                books.play.render.su=ss.length?ss[0]:0;
                books.play.render.idx=0;
            }
            ,setSu:i=>{const s=books.play.md.subs[i];if(!s)return;books.play.render.su=i;books.play.render.ch=books.play.md.subCh[i];books.play.render.idx=0;}
            ,go:(n,keep,wide)=>{if(!keep)books.play.render.align(n);books.play.render.wide=wide?1:0;
                books.play.render.mode=n;const sp=/^(pl\d+)([ab])$/.exec(books.play.id(n));if(sp)books.play.sem.Z.sp=sp[2];books.play.render.setMode();books.play.render.toc();books.play.render.draw();books.play.render.sync();}
            ,toc:()=>{
                const R=books.play.render,md=books.play.md,esc=R.esc,ic={2:'📖',3:'📑'}
                ,a2=(t,at,l,ico)=>'<a '+at+'>'+'&nbsp;'.repeat(2*l)+(ico?ico+'&nbsp;':'')+esc(t)+'</a>'
                ,a=(t,i,l,ico,m)=>t===''?'':a2(t,'data-i="'+i+'" data-m="'+(m===undefined?R.mode:m)+'"',l,ico)
                ,wOf=(si,wi)=>(((md.sts[si]||{}).txt||'').match(/\S+/g)||[])[wi]||''
                ,o=[
                    ()=>{const s=books.play.shelf||[],bk=books.play.book;
                        return [...new Set(s.map(x=>x.book))].flatMap(b=>{const t=books.play.titleOf(b),sub=R.slug(t)===R.slug(b)?'':' <i class="bid">('+esc(t)+')</i>';
                            return ['<a data-book="'+esc(b)+'" class="lvnode'+(b===bk?' on':'')+'" title="'+esc(b+(sub?' – '+t:''))+'">📚&nbsp;'+esc(b)+sub+'</a>']
                                .concat(s.filter(x=>x.book===b).map(v=>{const vt=books.play.titleOf(v.book,v.lg,v.ed);
                                    return v.pdf
                                        ?a2(vt,'data-book="'+esc(v.book)+'" data-pdf="'+esc(v.pdf)+'" title="'+esc(vt+' – PDF')+'" aria-label="'+esc(vt+' PDF')+'"',1,'📕')
                                        :a2(vt,'data-book="'+esc(v.book)+'" data-lg="'+v.lg+'" data-ed="'+v.ed+'" title="'+esc(vt+' – '+v.lg+' '+v.ed)+'" aria-label="'+esc(vt+' '+v.lg+' '+v.ed)+'"',1,books.play.flag(v.lg)+books.play.edIc(v.ed));}));});}
                    ,()=>{const v=(books.play.shelf||[]).find(x=>x.book===books.play.book&&((x.fn&&x.fn===md.fn)||(x.pdf&&x.pdf===books.play.pdf)))
                            ,nd=v?a2(books.play.titleOf(v.book,v.lg,v.ed),'data-book="'+esc(v.book)+'"'+(v.pdf?' data-pdf="'+esc(v.pdf)+'"':' data-lg="'+v.lg+'" data-ed="'+v.ed+'"')+' class="lvnode on"',0,books.play.flag(v.lg)+books.play.edIc(v.ed))
                                :a2(md.title,'class="lvnode on"',0,'📖');
                        return [nd].concat(md.chs.map((c,i)=>a2(c[0].h[1],'data-ch="'+i+'"',1,'📖')));}
                    ,()=>{const c=md.chs[R.ch];if(!c)return [];
                        return [a2(c[0].h[1],'data-ch="'+R.ch+'" class="lvnode on"',0,'📖')]
                            .concat(R.chSubs(R.ch).map(k=>{const h=md.subs[k][0].h;return a2(h[1],'data-su="'+k+'"',1,ic[h[0]]||'📑');}));}
                    ,()=>{const su=md.subs[R.su];if(!su)return [];
                        const h=su[0].h,pgs=[...new Set(su.map(p=>p.pn))],pns=new Set(pgs)
                            ,pars=md.pgs.map((p,i)=>({p,i})).filter(x=>pns.has(x.p.pn));
                        return ['<div class="navhier"><table class="navtab"><tr><td colspan="2" class="navnode">'
                            +a2(h?h[1]:'','data-su="'+R.su+'" class="lvnode on"',0,(h&&ic[h[0]])||'📑')+'</td></tr><tr>'
                            +'<td class="navpg">'+pgs.map(pn=>a2('#'+pn,'data-i="'+(R.pgiOf(pn)+1)+'" data-m="4" data-su="'+R.su+'"',0,'📄')).join('')+'</td>'
                            +'<td class="navpar">'+pars.map(x=>a2(x.p.txt.slice(0,60),'data-i="'+x.i+'" data-m="5" data-su="'+R.su+'"',0,'')).join('')+'</td>'
                            +'</tr></table></div>'];}
                    ,()=>{const pg=md.pages[R.pi];if(!pg)return [];
                        return [a2(pg.pn?String(pg.pn):'','class="lvnode on"',0,'📄')]
                            .concat(R.lnsOf().map((l,k)=>a2(l.t,'data-ln="'+k+'" data-m="8"',1,'')));}
                    ,()=>{const p=md.pgs[R.idx];if(!p)return [];
                        return [a2(p.txt.slice(0,34),'class="lvnode on"',0,'')]
                            .concat(R.sentT(p.txt).map((s,k)=>a(s.slice(0,32),R.baseOf(R.idx)+k,1,'✍️',6)));}
                    ,()=>{const s=md.sts[R.idx];if(!s)return [];
                        return [a2(s.txt.slice(0,34),'class="lvnode on"',0,'✍️')]
                            .concat((s.txt.match(/\S+/g)||[]).slice(0,40).map((w,j)=>a2(w,'data-i="'+j+'" data-m="7" data-si="'+R.idx+'" data-w="'+j+'"',1,'🔤')));}
                    ,()=>{const w=wOf(R.si,R.wi);return [a2(w,'class="lvnode on"',0,'🔤')];}
                    ,()=>{const l=R.curLine(),mm=[['\u{1F3A8}','Foreground'],['\u{1F5BC}\uFE0F','Background'],['\u{1F3B5}','Sound'],['\u{1F3AC}','Motion']];
                        return [a2(l?l.t:'','class="lvnode on"',0,R.lv[8].ic)].concat(mm.map(m=>a2(m[1],'data-m="9"',1,m[0])));}
                    ,()=>{const l=R.curLine(),pg=md.pages[R.pi]||{},nn=l?l.t:(pg.h?pg.h[1]:(pg.pn?'p. '+pg.pn:md.title));
                        return [a2(nn||'','class="lvnode on"',0,'🎨')];}
                ];
                const jump=p=>{
                    const i=books.play.ix(p),L=books.play.LV[i]||{no:p,t:''},node=books.play.nodename(p)
                        ,ic=((books.play.render.lv||[])[i]||{}).ic||books.play.render.ic[i]||'';
                    return a2(node||L.t,'data-go="'+i+'" class="lvup"'
                        +' title="'+books.play.render.esc('up to '+(node?node+' – ':'')+L.t+' ('+(L.pl||p)+')')+'"',0,ic);
                };
                const ups=books.play.ancestors(books.play.id(books.play.render.mode)).map(jump).join('');
                const up=ups||'<a data-edit="1" class="lvup'+(books.play.editOn?' on':'')+'" title="'+books.play.render.esc(books.play.editOn?'done – show the versions as links':'edit which books and versions exist')+'">✎ '+(books.play.editOn?'(done)':'(edit)')+'</a>';
                R.el.nav.innerHTML=up+o[R.mode]().join('');
                R.hands();
            }
            ,esc:x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            ,slug:s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'')
            ,spotKey:u=>books.play.SpotKey(u)
            ,qr:u=>{const k=books.play.render.spotKey(u);if(!k)return '';
                const t=(books.play.SpotQr||{})[k];
                return '<img'+(t?' src="https://aigap.no/i/'+k+'.'+t+'.png"':' data-qrk="'+books.play.render.esc(k)+'"')+' alt="" style="height:66px;image-rendering:pixelated;">';}
            ,mus:l=>{const u=(l.match(/https?:\/\/[^\s)]+/)||[''])[0];return '<a href="'+u+'">\u{1F3B5}</a>'+books.play.render.qr(u);}
            ,songOf:p=>{const a=books.play.md.pages||[],i=a.indexOf(p);for(let k=i;k>=0;k--)if(a[k].mu)return a[k].mu;return '';}
            ,media:p=>{
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
            ,subView:()=>{
                const su=books.play.render.cSub();
                if(!su||!su.length)return [books.play.render.lv[3].nm+' – choose a sub chapter in the list'];
                const mu=books.play.render.songOf(su[0]),key=books.play.render.spotKey(mu);
                const song='<div class="subsong">'+(mu
                    ?'\u{1F3B5} <b>'+books.play.render.esc(key)+'</b> <a href="'+books.play.render.esc(mu)+'">'+books.play.render.esc(mu)+'</a> '
                        +'<button class="spPlay" data-u="'+books.play.render.esc(mu)+'">\u25B6 \u266A</button>'+books.play.render.qr(mu)
                    :'No song tied to this sub chapter.')+'</div>';
                return su.map((p,i)=>(i?'':song)+books.play.render.page(p));
            }
            ,shelfEdit:()=>{
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
                if(!books.play.editOn){
                    const links=['NO','EN'].flatMap(lg=>['PREM','FREE'].map(ed=>have(lg,ed)
                        ?'<a class="seOpen" data-se="open" data-lg="'+lg+'" data-ed="'+ed+'" title="open '+lg+' '+ed+'">'
                            +books.play.flag(lg)+books.play.edIc(ed)+'&nbsp;'+books.play.render.esc(books.play.titleOf(b.book,lg,ed))+'</a>':''));
                    if(b.pdf)links.push('<a class="seOpen" data-se="pdf" data-pdf="'+books.play.render.esc(b.pdf)+'" title="PDF">📕&nbsp;'+books.play.render.esc(books.play.titleOf(b.book))+'</a>');
                    return '<div class="se" data-b="'+i+'">'+head(b.book)
                        +'<p class="seHint">'+books.play.render.esc(srcTxt)+'</p>'
                        +'<div class="seVers">'+links.join('')+'</div>'
                        +'<p class="seHint">✎ (edit) in the list on the left to change which books and versions exist.</p></div>';
                }
                const slot=(lg,ed)=>{
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
            ,hangs:s=>/(^|[\s"'“‘(\[«])(på|i|og|som|til|med|av|for|en|et|den|det|de|at|om|men|å|er|var|fra|ved|ut|inn|opp|ned|seg|ikke|så|når|da|her|der|hva|hvis|enn|mens|etter|før|under|over|mellom|mot|blir|ble|har|hadde|kan|skal|vil|må|the|of|and|to|a|in|is|was|it|that|with|for|on|as|at|by|from|but|or)$/i.test(s.trim())
            ,sentT:s=>(s.match(/[^.!?\u2026]+[.!?\u2026]+["'\u201D\u2019\u00BB]?|\S[^.!?\u2026]*$/g)||[]).map(x=>x.trim()).filter(Boolean)
            ,wrap:(s,n)=>{const o=[];let l='';(s||'').split(/\s+/).filter(Boolean).forEach(w=>{if(!l)l=w;else if((l+' '+w).length<=(n||66))l+=' '+w;else{o.push(l);l=w;}});if(l)o.push(l);return o;}
            ,head:p=>{const t=p.h&&p.h[1];if(!t)return '';const h=p.h[0]===2?'h2':'h3',s=books.play.render.slug(t);return '<'+h+(s?' id="'+s+'"':'')+'>'+books.play.render.esc(t)+(p.mu?' <a href="'+p.mu+'">\u{1F3B5}'+books.play.render.qr(p.mu):'')+'</'+h+'></a>'}
            ,page:(p,fr)=>(p.pn?'<a id="p'+p.pn+'"></a>':'')+(p.t?'<h1>'+books.play.render.esc(books.play.md.title)+'</h1>':books.play.render.head(p)+(fr&&p.fr?'<p>'+p.fr+'</p>':'')+p.ps.map(x=>'<p>'+x+'</p>').join(''))
            ,flow:a=>a.map(p=>books.play.render.page(p)).join('')
            ,views:()=>books.play.pdf
                ?['<embed class="pdfview" src="'+books.play.root+books.play.pdf+'" type="application/pdf">']
                :books.play.render.viewsMd()
            ,viewsMd:()=>[
                ()=>[books.play.render.shelfEdit()]
                ,()=>[books.play.md.chs.map(books.play.render.flow).join('')]
                ,()=>[books.play.render.flow(books.play.md.chs[books.play.render.ch]||[])]
                ,()=>[books.play.render.subView().join('')]
                ,()=>[{t:1}].concat(books.play.md.pages).map((p,i)=>books.play.render.page(p,i>0))
                ,()=>books.play.md.pgs.map(p=>'<p>'+books.play.render.esc(p.txt)+'</p>')
                ,()=>books.play.md.sts.map(s=>books.play.render.esc(s.txt))
                ,()=>{const st=books.play.md.sts[books.play.render.si],w=st?((st.txt.match(/\S+/g)||[])[books.play.render.wi]||''):'';
                    return ['<h1>'+books.play.render.esc(books.play.LV[7].t)+'</h1>'
                        ,'<p class="wbig">'+books.play.render.esc(w)+'</p>'
                        ,'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl6a'))+(w?' – '+books.play.render.esc(w):'')+'</p>'
                        ,'<p>'+books.play.render.esc(books.play.LV[7].q)+'</p>'];}
                ,()=>{const l=books.play.render.curLine(),t=l?l.t:'';
                    return ['<h1>'+books.play.render.esc(books.play.LV[8].t)+'</h1>'
                        ,'<p class="lbig">'+books.play.render.esc(t)+'</p>'
                        ,'<p class="mfpath">'+books.play.render.esc(books.play.chain('pl5b'))+'</p>'];}
                ,()=>[books.play.render.media(books.play.md.pages[books.play.render.pi]||{})]
            ][books.play.render.mode]()
            ,reset:()=>{books.play.render.mode=books.play.render.pending||0;books.play.render.pending=null;books.play.render.idx=0;books.play.render.wide=0;books.play.render.setMode();const t=books.play.render.el.title;if(t)t.textContent=books.play.md.title;books.play.render.toc();books.play.render.sync();}
            ,draw:()=>{
                const R=books.play.render,v=R.views();
                if(R.mode===4)R.pi=Math.max(0,R.idx-1);
                R.el.page.innerHTML=(R.wide?v.join(''):v[Math.max(0,Math.min(v.length-1,R.idx))])||'';
                R.hl();
                R.focus();
                R.hands();
            }
            ,em:()=>parseFloat(getComputedStyle(document.documentElement).fontSize)||1
            ,blink:(el,n)=>{if(!el)return;el.classList.remove('blink');void el.offsetWidth;el.style.animationIterationCount=String(n||1);el.classList.add('blink');}
            ,hl:()=>{const m=books.play.render.mode;books.play.render.el.nav.querySelectorAll('a[data-i]').forEach(a=>a.classList.toggle('on',+a.dataset.m===m&&+a.dataset.i===books.play.render.idx));}
            ,focus:()=>{
                const n=books.play.render.el.nav;if(!n)return;
                const el=n.querySelector('a.lvnode.on')||n.querySelector('a.on');if(!el)return;
                const r=el.getBoundingClientRect(),b=n.getBoundingClientRect();
                if(r.top<b.top||r.bottom>b.bottom)n.scrollTop+=(r.top-b.top)-(b.height/2-r.height/2);
            }
            ,lvitem:x=>{const up=books.play.ancestors(x.pl).map(p=>{const L=books.play.LV.find(l=>l.pl===p);return L?L.t:'';}).filter(Boolean).join(' › ');return '<li id="'+x.pl+'">'+(up?'<div class="lvpath">'+books.play.render.esc(up)+' ›</div>':'')+'<i>'+books.play.render.esc(x.t)+'</i> – '+books.play.render.esc(x.q)+(x.nav&&x.nav!=='todo'?'<details><summary>Nav shows</summary>'+books.play.render.esc(x.nav)+'</details>':'')+(x.page&&x.page!=='todo'?'<details><summary>Page shows</summary>'+books.play.render.esc(x.page)+'</details>':'')+(x.thoughts?'<details open><summary>Thoughts</summary>'+books.play.render.esc(x.thoughts)+'</details>':'')+(x.child&&x.child.length?'<details open><summary>Planned</summary><ol>'+x.child.map(c=>'<li>'+books.play.render.esc(c.t)+(c.w?'<details><summary>Thoughts</summary>'+books.play.render.esc(c.w)+'</details>':'')+'</li>').join('')+'</ol></details>':'')+'</li>';}
            ,guide:()=>{const g=document.getElementById('lvGuide');if(!g)return;g.innerHTML=books.play.LV.map(x=>books.play.render.lvitem(x)).join('');}
            ,sync:()=>{const L=books.play.LV[books.play.render.mode]||books.play.LV[0];const h=document.getElementById('dbPlayTitle');if(h)h.textContent=L.t+' – '+L.q;const c=document.getElementById('dpCur');if(c){c.className='cur '+(L.pl||'');c.textContent=L.t;}const g=document.getElementById('lvGuide');if(g)g.innerHTML=books.play.render.lvitem(L);zmLv.textContent=books.play.render.ic[books.play.render.mode];zmLv.title=L.t+' – leave the map (Esc)';books.play.render.ctl();books.play.hi();books.play.sem.Z.nav.draw();}
            ,ctl:()=>{const pl=books.play.id(books.play.render.mode),kids=books.play.child(pl);let h='';kids.slice().reverse().forEach(k=>{const K=books.play.LV[books.play.ix(k)];h+='<button data-go="'+books.play.ix(k)+'" title="finer: '+(K?K.t:k)+'">\u{1F52C}</button>';});lvCtl.innerHTML=h;lvCtl.onclick=ev=>{const x=ev.target.closest('button');if(x&&x.dataset.go!==undefined)books.play.render.go(+x.dataset.go);};}
            ,baseOf:i=>books.play.md.pgs.slice(0,i).reduce((n,q)=>n+books.play.render.sentT(q.txt).length,0)
            ,pgOf:si=>{let n=0;for(let k=0;k<books.play.md.pgs.length;k++){n+=books.play.render.sentT(books.play.md.pgs[k].txt).length;if(n>si)return k;}return 0;}
            ,pgiOf:pn=>{const i=books.play.md.pages.findIndex(p=>p.pn===pn);return i<0?books.play.render.pi:i;}
            ,lnsOf:()=>books.play.md.lns[books.play.render.pi]||[]
            ,curLine:()=>books.play.render.lnsOf()[books.play.render.li]||null
            ,liOf:i=>{const k=books.play.render.lnsOf().findIndex(x=>x.lp===i);return k<0?0:k;}
            ,curPar:()=>{const R=books.play.render,md=books.play.md,m=R.mode,su=R.cSub()||[],pn=m===4?((md.pages[R.pi]||{}).pn):((su[0]||{}).pn);
                if(m===5)return R.idx;
                if(m===6)return R.pgOf(R.idx);
                if(m===7)return R.pgOf(R.si);
                if(m>=8){const l=R.curLine();return l&&l.lp>=0?l.lp:R.pgOf(R.si);}
                const i=md.pgs.findIndex(p=>p.pn===pn);return i<0?0:i;}
            ,curSent:()=>{const R=books.play.render,m=R.mode;return m===6?R.idx:(m===7?R.si:R.baseOf(R.curPar()));}
            ,curPage:()=>{const R=books.play.render,md=books.play.md,m=R.mode,su=R.cSub()||[];
                if(m===4||m>=8)return R.pi;
                const pn=m===5?((md.pgs[R.curPar()]||{}).pn):(m>=6?((md.sts[R.curSent()]||{}).pn):((su[0]||{}).pn));
                return R.pgiOf(pn);}
            ,align:n=>{
                const R=books.play.render;if(n===R.mode)return;
                if(n===4){R.pi=R.curPage();R.idx=R.pi+1;}
                else if(n===5)R.idx=R.curPar();
                else if(n===6){const k=R.curSent();R.idx=k;R.si=k;}
                else if(n===7){R.si=R.curSent();R.wi=0;R.idx=0;}
                else if(n===8){R.pi=R.curPage();R.li=R.liOf(R.curPar());}
                else if(n===9)R.pi=R.curPage();}
            ,sibs:()=>{
                const R=books.play.render,md=books.play.md,s=books.play.shelf
                    ,ws=k=>(((md.sts[k]||{}).txt||'').match(/\S+/g)||[])
                    ,wc=md.wc&&md.wc.length?md.wc:md.sts.map((_,k)=>ws(k).length)
                    ,wtot=wc.reduce((a,b)=>a+b,0)
                    ,follow=pn=>{const k=md.subs.findIndex(x=>x.some(p=>p.pn===pn));if(k>=0){R.su=k;R.ch=md.subCh[k];}}
                    ,wNum=()=>{let n=R.wi;for(let j=0;j<R.si&&j<wc.length;j++)n+=wc[j];return n;}
                    ,wAt=k=>{let n=k;for(let j=0;j<wc.length;j++){if(n<wc[j])return [j,n];n-=wc[j];}return [0,0];}
                    ,pgGo=i=>{R.pi=i;R.idx=i+1;follow((md.pages[i]||{}).pn);}
                    ,lnGo=x=>{R.pi=x[0];R.li=x[1];follow((md.pages[x[0]]||{}).pn);}
                    ,lnIx=()=>{const l=md.lnl||[],i=l.findIndex(x=>x[0]===R.pi&&x[1]===R.li);return i<0?0:i;};
                return [
                    ()=>{const bs=s&&s.length?[...new Set(s.map(x=>x.book))]:md.books;
                        return {l:bs,i:Math.max(0,bs.indexOf(books.play.book)),go:b=>books.play.pick(b)};}
                    ,()=>{const vs=(s||[]).filter(x=>x.book===books.play.book);
                        return {l:vs,i:Math.max(0,vs.findIndex(v=>(v.fn&&v.fn===md.fn)||(v.pdf&&v.pdf===books.play.pdf))),go:v=>v.pdf?books.play.openPdf(v.pdf):books.play.open(v.lg,v.ed,1)};}
                    ,()=>({l:md.chs.map((_,i)=>i),i:R.ch,go:c=>R.setCh(c)})
                    ,()=>({l:md.subs.map((_,i)=>i),i:Math.max(0,Math.min(md.subs.length-1,R.su)),go:k=>R.setSu(k)})
                    ,()=>{const l=md.pages.map((_,i)=>i);return {l,i:Math.max(0,l.indexOf(R.pi)),go:pgGo};}
                    ,()=>({l:md.pgs.map((_,i)=>i),i:R.idx,go:i=>{R.idx=i;follow((md.pgs[i]||{}).pn);}})
                    ,()=>({l:md.sts.map((_,i)=>i),i:R.idx,go:i=>{R.idx=i;R.si=i;follow((md.sts[i]||{}).pn);}})
                    ,()=>({l:Array.from({length:wtot},(_,k)=>k),i:Math.max(0,wNum()),go:k=>{const x=wAt(k);R.si=x[0];R.wi=x[1];follow((md.sts[x[0]]||{}).pn);}})
                    ,()=>({l:md.lnl||[],i:lnIx(),go:lnGo})
                    ,()=>({l:md.lnl||[],i:lnIx(),go:lnGo})
                ][R.mode]();
            }
            ,hands:()=>{const S=books.play.render.sibs(),e=books.play.render.el;if(e.prev)e.prev.disabled=S.i<=0;if(e.next)e.next.disabled=S.i>=S.l.length-1;}
            ,nav:d=>{const R=books.play.render,S=R.sibs(),k=S.i+d;if(k<0||k>=S.l.length)return;R.wide=0;S.go(S.l[k]);R.toc();R.draw();R.sync();}
            ,coarser:()=>{const p=books.play.up[books.play.id(books.play.render.mode)];if(p)books.play.render.go(books.play.ix(p));}
            ,arrowBlink:d=>books.play.render.blink(d?lvCtl.querySelector('button'):books.play.render.el.up,1)
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
                ov:null,m:0,t:0,sp:'b',q:'',inv:0,invKey:'play.zoom.invert'
                ,box:()=>books.play.sem.Z.ov||(books.play.sem.Z.ov=Object.assign(document.body.appendChild(document.createElement('div')),{id:'semOv'}))
                ,on:0,pin:0,key:0,mod:0
                ,wMap:{
                    /* TODO: cahche in memory and in supabase the word maps for whatwhere, so that the map is not rebuilt every time it is opened. The map is built from the text of the level, and the query string that filters it. The whatwhere key is a SHA-1 hash of the what and where strings, each truncated to 64 bits, and stored as a 128-bit UUID. The words are a JSONB array of objects with s:string and n:number.
                    // suppabase has these, when read store in memcache, and when written store in both memcache and supabase. The functions are in SQL, but the data is JSONB. The key is a 128-bit UUID made from the SHA-1 of the what and where strings, each truncated to 64 bits. The words are a JSONB array of objects with s:string and n:number.
                    // create table if not exists public.map(whatwhere uuid primary key,words jsonb not null,dtC timestamptz default now() not null);
                    // create or replace function public.map_ww(what varchar, wher varchar) returns uuid language sql immutable as $$ select (encode(substr(digest(what, 'sha1'), 1, 8), 'hex') || encode(substr(digest(wher, 'sha1'), 1, 8), 'hex'))::uuid; $$;
                    // create or replace function public.map_get(what varchar, wher varchar) returns jsonb language sql immutable as $$ select words from public.map where whatwhere = public.map_ww(what, wher); $$;
            
            
                    // create or replace function public.map_set(what varchar, wher varchar, words jsonb) returns uuid language sql volatile as $$ insert into public.map(whatwhere, words) values (public.map_ww(what, wher), words) on conflict (whatwhere) do update set words = excluded.words returning whatwhere; $$;
                    // -- usage: (what is always uppercase, where is always lowercase, words is a jsonb array of objects with s:string and n:number)
                    // is json correct? fix it! select public.map_set('HELLO', 'l*n*p.n.nulls', '[{"s":"hello","n":4},{"s":"world","n":7}]'::jsonb);
                    // select public.map_get('HELLO', 'l*n*p.n.nulls'); */
                    g:(hId,q)=>{const k=hId+'|'+q;return books.play.memcache[k];}
                    ,s:(hId,q,words)=>{const k=hId+'|'+q;books.play.memcache[k]=words;}
                }
                ,zb:()=>{const on=books.play.sem.Z.on;zmT.textContent=on?'\u2299':'\u25CE';zmT.title=on?'Collapse the word map back into its band':'Expand the word map over the reading area';}
                ,ib:()=>{const i=books.play.sem.Z.inv;
                    zmI.classList.toggle('on',!!i);zmI.title='Zoom: '+(i?'up':'down')+' means into the detail – the two-finger pinch and ↑/↓ alike. Click to turn it round.';}
                ,head:{
                    el:null,back:[]
                    ,ids:['zmUp','zmLv','lvCtl','prev','next','hiId','hiUrl','zmT','zmI']
                    ,into:()=>{const h=books.play.sem.Z.head;if(h.back.length)return;h.el=document.getElementById('zmHead');if(!h.el)return;
                        h.ids.forEach(id=>{const n=document.getElementById(id);if(!n)return;h.back.push([n,n.parentElement,n.nextSibling]);h.el.appendChild(n);});}
                    ,out:()=>{const h=books.play.sem.Z.head;for(let i=h.back.length-1;i>=0;i--){const b=h.back[i];b[1].insertBefore(b[0],b[2]);}h.back=[];}
                }
                ,show:()=>{const z=books.play.sem.Z,R=books.play.render,E=R.el;if(z.on)return;z.on=1;z.pin=0;z.box().style.display='block';document.body.classList.add('zoom');
                    [E.prev,E.next,E.up,lvCtl].forEach(el=>R.blink(el,3));
                    z.nav.swap();z.head.into();z.nav.redraw();z.zb();}
                ,hide:()=>{const z=books.play.sem.Z;if(!z.on)return;z.on=0;z.head.out();
                    z.nav.tk='';
                    if(z.ov)z.ov.style.display='none';z.m=z.t=0;document.body.classList.remove('zoom');
                    z.nav.redraw();z.zb();}
                ,enter:()=>books.play.sem.Z.show()
                ,nav:{
                    el:null,last:'',tk:''
                    ,box:()=>books.play.sem.Z.nav.el
                    ,label:()=>{const L=books.play.LV[books.play.render.mode]||books.play.LV[0];return (L.pl||'')+' '+L.t+' Selection';}
                    ,areas:()=>{
                        const e=books.play.render.esc,pl=books.play.id(books.play.render.mode),sp=books.play.sem.Z.sp,q=books.play.sem.Z.q
                            ,b=books.play.cloud.above()
                            ,fork=pl==='pl3'||pl==='pl4a'||pl==='pl4b',kids=fork?['pl4'+sp]:books.play.child(pl)
                            ,fd=pl==='pl3'
                                ?['b','a'].map(t=>'<button type="button" data-sp="'+t+'"'+(sp===t?' disabled':'')+'>'+e((books.play.LV[books.play.ix('pl4'+t)]||{}).t||('pl4'+t))+'</button>').join('')
                                :''
                            ,grp=kids.map(c=>{const a=books.play.names(c),ns=a[0]||[]
                                ,rows=ns.map((n,k)=>{if(n==='')return '';const h=books.play.cloud.html(books.play.txtOf(c,k,n),24,q,b)
                                    ,on=(pl==='pl4a'||pl==='pl4b')&&k===a[3]
                                    ,cl=h||q;
                                    return '<div class="nvA'+(on?' on':'')+(cl?' nvC':'')+'" data-k="'+c+'|'+k+'"><span class="nvT">'+e(n)+'</span>'+(cl?'<div class="nvW">'+h+'</div>':'')+'</div>';}).join('');
                                if(!rows)return '';const cnt=ns.filter(n=>n!=='').length
                                    ,grid=cnt>6?'<div class="nvR'+(cnt>14?' r3':'')+'">'+rows+'</div>':rows;
                                return '<div class="nvGrp">'+((fd||q)?'<div class="nvG'+(pl==='pl3'?' nvS':'')+'">'+fd+books.play.sem.Z.nav.tq(q,!!fd)+'</div>':'')+grid+'</div>';}).join('');
                        return grp?'<div class="nvAreas">'+grp+'</div>':'';}
                    ,tq:(q,dash)=>q?(dash?' – ':'')+'"'+books.play.render.esc(q)+'"':''
                    ,applyQ:()=>{const z=books.play.sem.Z,n=z.nav;if(n.qEl&&n.qEl.value!==z.q)n.qEl.value=z.q;n.redraw();}
                    ,mk:()=>window.SpeechRecognition||window.webkitSpeechRecognition
                    ,lastWord:s=>{const a=String(s||'').replace(/[^\p{L}\p{N}'-]+/gu,' ').trim().split(/\s+/).filter(Boolean);return a.length?a[a.length-1]:'';}
                    ,speak:btn=>{
                        const z=books.play.sem.Z,n=z.nav,R=n.mk();if(!R)return;
                        if(z.rec){try{z.rec.stop();}catch(e){}z.rec=null;btn.classList.remove('on');return;}
                        const r=z.rec=new R();
                        r.lang=books.play.lg==='NO'?'nb-NO':'en-GB';r.continuous=!0;r.interimResults=!1;
                        r.onresult=e=>{let s='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)s+=e.results[i][0].transcript;
                            const w=n.lastWord(s);if(w){if(n.qEl)n.qEl.value='';z.q=w;n.applyQ();}}
                        r.onerror=()=>{z.rec=null;btn.classList.remove('on');};
                        r.onend=()=>{z.rec=null;btn.classList.remove('on');};
                        try{r.start();}catch(e){z.rec=null;return;}
                        btn.classList.add('on');
                    }
                    ,mic:on=>{
                        const z=books.play.sem.Z,n=z.nav;if(!n.micEl)return;
                        if(on!==!!z.rec)n.speak(n.micEl);}
                    ,keyQ:e=>{
                        const z=books.play.sem.Z,n=z.nav,qEl=n.qEl,k=e.key,own=qEl&&document.activeElement===qEl;
                        if(k==='Backspace'){if(own)return 0;z.q=z.q.slice(0,-1);}
                        else if(k.length===1&&k!==' '&&!e.metaKey&&!e.altKey&&!(own&&!e.ctrlKey))z.q+=k;
                        else return 0;
                        n.applyQ();
                        return 1;}
                    ,go:(c,k)=>{const a=books.play.names(c),n=(a[0]||[])[k];if(!n)return;a[2](n);books.play.render.go(books.play.ix(c),true);}
                    ,pickK:k=>{const p=String(k||'').split('|');if(p[0])books.play.sem.Z.nav.go(p[0],+p[1]);}
                    ,pick:el=>books.play.sem.Z.nav.pickK(el.dataset.k)
                    ,pair:()=>{const z=books.play.sem.Z,n=z.nav,p=n.tk;n.tk='';if(p)z.nav.pickK(p);z.hide();}
                    ,body:()=>books.play.sem.Z.nav.areas()||'<h2>'+books.play.render.esc(books.play.sem.Z.nav.label())+books.play.sem.Z.nav.tq(books.play.sem.Z.q,1)+'</h2>'
                    ,base:()=>document.body.classList.contains('zoom')?1:.6
                    ,collapsed:()=>!document.body.classList.contains('zoom')
                    ,hm:a=>{
                        const b=books.play.sem.Z.nav.base(),e=books.play.render.em();
                        a.forEach(w=>{w.style.fontSize=b+'em';w.style.bottom='auto';w.style.height='auto';});
                        const h=a.map(w=>Math.max(e,w.scrollHeight));
                        a.forEach(w=>{w.style.bottom='';w.style.height='';});
                        return h;}
                    ,room:w=>{const c=w.parentElement,e=books.play.render.em();
                        return Math.max(e,(books.play.sem.Z.nav.collapsed()?Math.min(c.clientWidth,c.clientHeight):c.clientHeight)-e/4);}
                    ,fit:()=>{
                        const n=books.play.sem.Z.nav,a=[...n.el.querySelectorAll('.nvW')];if(!a.length)return;
                        const h=n.hm(a);
                        a.forEach((w,i)=>{const k=n.room(w)/h[i];if(k>=1)return;
                            const keep=Math.max(2,Math.round(w.childElementCount*k));
                            while(w.childElementCount>keep)w.removeChild(w.lastChild);});
                        const h2=n.hm(a);
                        a.forEach((w,i)=>{const s=n.room(w)/h2[i];
                            if(s<1)w.style.fontSize=(n.base()*Math.max(.4,s)).toFixed(2)+'em';});
                    }
                    ,draw:()=>{const n=books.play.sem.Z.nav;if(!n.el)return;const h=n.body();if(h===n.last)return;n.last=h;n.el.innerHTML=h;n.fit();}
                    ,redraw:()=>{const n=books.play.sem.Z.nav;n.last='';n.draw();}
                    ,swap:()=>{
                        const n=books.play.sem.Z.nav,z=books.play.sem.Z,p=document.getElementById('dbPlay');
                        if(!n.el){
                            p.innerHTML='<div id="zmHead"></div>'
                                +'<div id="semNav"></div>'
                                +'<div id="semQ"><button id="nvMic" type="button" title="Speak a word – the text is cut by it and the map made of what is left, and the map keeps what carries it. While ⌃⇧ is held, move over it to open the mic; over it again to close">\u{1F3A4}</button>'
                                +'<input id="nvQ" type="text" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" enterkeyhint="search" placeholder="filter the text to map"></div>';
                            n.el=p.querySelector('#semNav');n.qEl=p.querySelector('#nvQ');
                            const mic=n.micEl=p.querySelector('#nvMic');
                            n.el.onclick=ev=>{const s=ev.target.closest('[data-sp]');
                                if(s&&!s.disabled){z.sp=s.dataset.sp;n.redraw();return;}
                                const x=ev.target.closest('[data-k]'),k=x?x.dataset.k:'';
                                if(ev.detail>1){z.nav.pair();return;}
                                if(!k)return;n.tk=k;z.nav.pickK(k);if(z.pin)z.hide();};
                            n.el.ondblclick=()=>z.nav.pair();
                            n.qEl.oninput=()=>{z.q=n.qEl.value;n.redraw();};
                            if(n.mk()){
                                mic.onclick=e=>{if(!e.ctrlKey&&!e.metaKey&&!e.altKey)n.mic(!z.rec);};
                                mic.onmouseenter=()=>{if(z.on&&z.key)n.mic(!z.rec);};
                            }else mic.hidden=1;
                            p.classList.add('navon');document.body.classList.add('navon');
                        }n.draw();}
                }
                ,jump:()=>{const z=books.play.sem.Z,h=document.querySelector('#semNav .nvA:hover');if(!h)return;z.nav.pick(h);z.hide();}
                ,drill:(d,alt,wide)=>{const z=books.play.sem.Z,R=books.play.render;
                    if(d>0){const h=document.querySelector('#semNav .nvA:hover');if(h)return z.nav.pick(h);}
                    const pl=books.play.id(R.mode),ks=books.play.child(pl)
                        ,k=d>0?(ks.length>1?'pl4'+(alt?(z.sp==='a'?'b':'a'):z.sp):ks[0]):books.play.up[pl];
                    if(!k)return;
                    const t=books.play.names(k),i=d>0?t[3]:-1;
                    if(i>=0&&(t[0]||[])[i])return z.nav.go(k,i);
                    R.go(books.play.ix(k),0,wide&&d<0);}
                ,zoom:d=>{const o=books.play.sem.Z.inv?-d:d;books.play.sem.Z.drill(o>0?1:-1,null,o>0?0:1);}
                ,init:()=>{
                    const z=books.play.sem.Z,db=()=>document.getElementById('dpBook')
                        ,dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY)
                        ,zone=t=>db().contains(t)||!!(z.nav.el&&z.nav.el.contains(t));
                    zmT.onclick=()=>{z.on?z.hide():z.show();};z.zb();
                    try{z.inv=localStorage.getItem(z.invKey)==='1'?1:0;}catch(e){}
                    zmI.onclick=()=>{z.inv=z.inv?0:1;try{localStorage.setItem(z.invKey,z.inv?'1':'0');}catch(e){}z.ib();};z.ib();
                    zmLv.onclick=()=>{if(!z.on)return;if(z.q){z.q='';z.nav.applyQ();}else z.hide();};
                    let base=0,sx=0,sy=0,sw=0,acc=0,at=0;
                    document.onkeydown=e=>{
                        if(e.key==='Control'||e.key==='Shift'){
                            z.key=e.ctrlKey&&e.shiftKey?1:0;
                            if(z.key&&!z.mod){z.mod=1;if(z.on)z.hide();else z.enter();}
                            return;}
                        if(!z.on||(e.ctrlKey&&!e.shiftKey))return;
                        const k=e.key;
                        if(k==='Enter'){e.preventDefault();z.jump();}
                        else if(k==='Escape'){if(z.q){z.q='';z.nav.applyQ();}else z.hide();}
                        else if(k==='ArrowLeft' ||k===','||k==='<'){e.preventDefault();books.play.render.nav(-1);}  
                        else if(k==='ArrowRight'||k==='.'||k==='>'){e.preventDefault();books.play.render.nav(1);}  
                        else if(k==='ArrowUp'  ){e.preventDefault();z.drill(z.inv?1:-1);books.play.render.arrowBlink(0);}
                        else if(k==='ArrowDown'){e.preventDefault();z.drill(z.inv?-1:1,e.altKey);books.play.render.arrowBlink(1);}
                        else if(k==='='||k==='+'){e.preventDefault();z.drill(1,e.altKey);}  
                        else if(k==='-'||k==='_'){e.preventDefault();z.drill(-1);}
                        else if(z.nav.keyQ(e))e.preventDefault();
                    };
                    document.onkeyup=e=>{if(e.key==='Control'||e.key==='Shift'){z.key=e.ctrlKey&&e.shiftKey?1:0;z.mod=0;}};
                    document.onmousedown=e=>{if(e.buttons===3&&db().contains(e.target)){z.m=1;z.enter();}};
                    document.onmouseup=e=>{if(z.m&&e.buttons<3)z.hide();};
                    document.addEventListener('touchstart',e=>{
                        if(!zone(e.target))return;
                        if(e.touches.length>1){z.t=1;sw=0;z.pin=0;base=dist(e.touches);z.enter();}
                        else if(e.touches.length===1){sw=1;sx=e.touches[0].clientX;sy=e.touches[0].clientY;}
                    },{passive:true});
                    document.addEventListener('touchmove',e=>{
                        if(!z.t||e.touches.length<2)return;
                        if(e.cancelable)e.preventDefault();
                        const d=base?dist(e.touches):0;
                        if(d&&d/base>=1.35){base=d;z.pin=1;z.zoom(1);}               
                        else if(d&&d/base<=0.74){base=d;z.pin=1;z.zoom(-1);}         
                    },{passive:false});
                    document.addEventListener('touchend',e=>{
                        if(z.t&&e.touches.length<2)z.t=0;
                        if(sw&&!e.touches.length){
                            const t=e.changedTouches[0]||{clientX:sx,clientY:sy},dx=t.clientX-sx,dy=t.clientY-sy;sw=0;
                            if(Math.abs(dx)>48&&Math.abs(dx)>2*Math.abs(dy))books.play.render.nav(dx<0?1:-1);
                        }
                    },{passive:true});
                    document.addEventListener('wheel',e=>{
                        if(!e.ctrlKey||!db().contains(e.target))return;
                        if(e.cancelable)e.preventDefault();
                        const now=Date.now();if(now-at>400)acc=0;at=now;
                        acc+=e.deltaY;
                        if(Math.abs(acc)>=25){z.zoom(acc>0?-1:1);acc=0;}
                    },{passive:false});
                    window.onblur=()=>{z.key=z.mod=0;z.hide();};
                    window.onresize=()=>{if(z.ov&&z.ov.style.display==='block')z.show();};
                }
            }
        }
        ,wire:()=>{
            books.play.SpotLoad(); // QR image names live in redir.qr – fetch them up front so the pictures resolve
            dbNavList.onclick=ev=>{
                const a=ev.target.closest('a[data-book],a[data-i],a[data-m],a[data-ch],a[data-su],a[data-go],a[data-edit]');
                if(!a)return;
                if(a.dataset.pdf!==undefined){books.play.book=a.dataset.book;books.play.openPdf(a.dataset.pdf);return;}
                if(a.dataset.lg!==undefined){books.play.book=a.dataset.book;books.play.open(a.dataset.lg,a.dataset.ed,1);return;}
                if(a.dataset.book){books.play.pick(a.dataset.book);return;}
                if(a.dataset.edit!==undefined){books.play.editOn=!books.play.editOn;books.play.render.toc();books.play.render.draw();return;}
                if(a.dataset.go!==undefined){books.play.render.go(+a.dataset.go);return;}
                if(a.dataset.ch!==undefined){books.play.render.setCh(+a.dataset.ch);books.play.render.go(2);return;}
                if(a.dataset.su!==undefined){books.play.render.setSu(+a.dataset.su);if(a.dataset.i===undefined){books.play.render.go(3);return;}}
                if(a.dataset.i!==undefined)books.play.render.idx=+a.dataset.i;
                if(a.dataset.si!==undefined)books.play.render.si=+a.dataset.si;
                if(a.dataset.w!==undefined)books.play.render.wi=+a.dataset.w;
                if(a.dataset.ln!==undefined)books.play.render.li=+a.dataset.ln;
                books.play.render.go(+a.dataset.m,a.dataset.i!==undefined||a.dataset.ln!==undefined);
            };
            window.onhashchange=()=>books.play.render.hash();
            const le=document.getElementById('lang'),ve=document.getElementById('ver');if(le)le.onclick=books.play.lang;if(ve)ve.onclick=books.play.ver;
            books.play.render.lv=books.play.render.ic.map((ic,i)=>({pl:(books.play.LV[i]&&books.play.LV[i].pl)||'pl'+i,ic,nm:(books.play.LV[i]&&books.play.LV[i].t)||''}));
            books.play.render.bar();
            books.play.render.guide();
            books.play.sem.Z.init();
            books.play.ready=books.play.probe().then(s=>{if(s&&s.length)books.play.render.toc();books.play.hi();});
            books.play.lang();
            books.play.render.el.page.addEventListener('click',ev=>{
                const b=ev.target.closest('.spPlay');if(b){ev.preventDefault();books.play.spTgl(b);return;}
                const s=ev.target.closest('button[data-se],a[data-se]');if(!s)return;
                const act=s.dataset.se;
                if(act==='open'){ev.preventDefault();books.play.seOpen(s.dataset.lg,s.dataset.ed);}
                else if(act==='pdf')books.play.openPdf(s.dataset.pdf);
                else if(act==='add')books.play.seAdd();
                else if(act==='del')books.play.seDel(s);
                else if(act==='copy')books.play.seCopy();
                else if(act==='reset')books.play.seReset();
            });
            books.play.render.el.page.addEventListener('input',ev=>{if(ev.target.closest&&ev.target.closest('#page .se')){books.play.seSet(books.play.seRead(),false);}});
            books.play.render.el.page.addEventListener('change',ev=>{if(ev.target.closest&&ev.target.closest('#page .se')){books.play.seSet(books.play.seRead(),true);}});
            const dbjs=document.createElement('script');dbjs.src='https://aigap.no/db.js?v=8';dbjs.onerror=()=>console.warn('[db.js] could not load in the background');document.head.appendChild(dbjs);
            const musicjs=document.createElement('script');musicjs.type='module';musicjs.src=books.play.root+'music.js?v=8';musicjs.onerror=()=>console.warn('[music.js] could not load in the background');document.head.appendChild(musicjs);
            setTimeout(()=>books.play.render.blink(document.getElementById('hiUrl'),3),400);
        }
    }
};
books.play.wire();
