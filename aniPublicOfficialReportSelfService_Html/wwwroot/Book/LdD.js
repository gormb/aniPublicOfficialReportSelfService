import * as _cBookJLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
_cBookJLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

// lazy-load 3rd-party scripts (qr-code-styling, html2pdf, db.js) – never block the book on slow CDNs
const _scripts={};
const loadScript=src=>_scripts[src]||(_scripts[src]=new Promise((ok,fail)=>{
    const s=document.createElement('script');s.src=src;
    s.onload=()=>ok();s.onerror=()=>{delete _scripts[src];fail(new Error('script: '+src));};
    document.head.appendChild(s);
}));

let cBook={ctx:null,pdf:null,page:null,pn:0,viewport:null,scale:null,view:null,pdfPromise:null,renderTask:null
    ,Source:async function(src,render,pageno=cBook.pn) {
        cBook.ctx = cBook.ctx || _cBook.getContext("2d");
        try {
            cBook.pdfPromise = cBook.pdfPromise || _cBookJLib.getDocument(src).promise;
            cBook.pdf = cBook.pdf || await cBook.pdfPromise;
            await cBook.Page(pageno, render); // set page + render only when needed (avoid double render)
        } catch(e) { // e.g. 404/corrupt PDF: show message instead of crashing
            console.error('[cBook] kunne ikke laste', src, e);
            cBook.pdf=null; cBook.pdfPromise=null; cBook.page=null;
            const ctx=cBook.ctx; ctx.clearRect(0,0,_cBook.width,_cBook.height);
            ctx.fillStyle='#888'; ctx.font='16px sans-serif'; ctx.textAlign='center';
            ctx.fillText('⚠️ Kunne ikke laste boken / Could not load the book', _cBook.width/2, _cBook.height/2);
        }
    }
    ,Page:async function(pageNo,render) {
        if(!cBook.pdf)return;
        const np=Math.max(1, cBook.pdf.numPages-4); // last four slides are template; min 1
        if(pageNo<1) pageNo=1;
        else if(pageNo>np) pageNo=np;
        if (cBook.pn !== pageNo) {
            cBook.pn = pageNo;
            cBook.page = await cBook.pdf.getPage(pageNo);
        }
        if (render) 
            await cBook.Width(window.innerWidth*2, true);
    }
    ,Width:async function(width,doRender) {
        if(!cBook.page)return;
        cBook.viewport = cBook.page.getViewport({scale:1});
        cBook.scale = width / cBook.viewport.width;
        cBook.view = cBook.page?.getViewport({ scale: cBook.scale });
        if (doRender) await cBook.Render();
    }
    ,Render:async function() {
        cBook._renderToken=(cBook._renderToken||0)+1; const token=cBook._renderToken; // only the newest render may swap in the canvas
        if (cBook.renderTask) cBook.renderTask.cancel();
        // render to offscreen canvas, swap in one paint (never "book→white→book")
        const off=document.createElement('canvas');
        off.width = Math.max(1, Math.round(cBook.view.width));
        off.height = Math.max(1, Math.round(cBook.view.height));
        const task = cBook.page?.render({canvasContext: off.getContext('2d'), viewport: cBook.view});
        cBook.renderTask = task;
        if(task) task.promise.catch(e=>{ if(e?.name!=='RenderingCancelledException') console.error('[cBook] render', e); }); // cancellation is expected – avoid unhandled rejection
        cBook.PageNo();
        await cBook.waitRender(off, task); // wait for paint to finish (promise or stability)
        if(token!==cBook._renderToken) return; // newer render took over – don't swap a partial result
        const ctx=cBook.ctx; if(!ctx)return;
        ctx.clearRect(0,0,_cBook.width,_cBook.height);
        ctx.drawImage(off,0,0);
        cBook.Play().catch(e=>console.error('[cBook] Play', e)); // after swap: getTextContent won't compete with renderer for the worker
        cBook.HideLater(cBook.pn); // tier text removed in background (idle) – never blocks first paint
    }
    ,waitRender:async (canvas, task, ms=10000)=>{ // wait until the whole page is painted (task.promise incl. images) – stability poll alone jumps too early
        const donePromise = task ? task.promise.then(()=>{},()=>{}) : Promise.resolve();
        let t;
        await Promise.race([donePromise, new Promise(r=>t=setTimeout(r, ms))]); // safety net: never hang
        clearTimeout(t);
    }
    ,HideLater:async function(pn){ // run Hide() in background; skip if page changed
        try{
            if('requestIdleCallback' in window) await new Promise(r=>requestIdleCallback(r,{timeout:2500}));
            else await new Promise(r=>setTimeout(r,50));
            if(pn!==undefined && pn!==cBook.pn) return;
            await cBook.Hide();
        }catch(e){console.error('[cBook] HideLater',e);}
    }
    ,premFonts:['EBGaramond','CEGaramond'] // premium-only; filled from template later
    ,freeFonts:['Calibri']                 // freemium-only; filled from template later
    ,commentFonts:['Arial']                // comments (Arial) NEVER shown in the book, in either mode
    ,FontTier:function(fam){ // 'premium'|'freemium'|'common'|'comment' from the font lists
        const n=(fam||'').toLowerCase().replace(/[^a-z0-9]/g,'');
        if(cBook.commentFonts.some(f=>n.includes(f.toLowerCase().replace(/[^a-z0-9]/g,''))))return 'comment';
        if(cBook.premFonts.some(f=>n.includes(f.toLowerCase().replace(/[^a-z0-9]/g,''))))return 'premium';
        if(cBook.freeFonts.some(f=>n.includes(f.toLowerCase().replace(/[^a-z0-9]/g,''))))return 'freemium';
        return 'common';
    }
    ,FontName:async function(internal, page){ // internal font id → real name (e.g. "MUFUZY+CEGaramond-Regular")
        const p=page||cBook.page, holds=[p&&p.commonObjs,p&&p.objs,p&&p._transport&&p._transport.commonObjs];
        for(const h of holds){
            if(h&&h.has&&h.has(internal)){
                try{const f=await h.get(internal); if(f&&f.name)return f.name;}catch(e){}
            }
        }
        return internal;
    }
    ,Hide:async function(){ // remove locked-tier text (premium↔freemium) from the painted canvas
        if(!cBook.page||!cBook.ctx)return;
        const hideTier=(book.prem&&book.prem._)?'freemium':'premium';
        const tc=await cBook.page.getTextContent(), names={}, ctx=cBook.ctx;
        for(const fn of new Set(tc.items.map(i=>i.fontName))) names[fn]=await cBook.FontName(fn);
        for(const it of tc.items){
            if(!it.str.trim())continue;
            const tier=cBook.FontTier(names[it.fontName]);
            if(tier!=='comment'&&tier!==hideTier)continue; // comments always hidden; otherwise the locked tier
            // PDF y-up: baseline=transform[5]; glyphs +1.2h up, descender -0.3h down
            const [ax,ay]=cBook.view.convertToViewportPoint(it.transform[4]-1, it.transform[5]+it.height*1.2);
            const [bx,by]=cBook.view.convertToViewportPoint(it.transform[4]+it.width+1, it.transform[5]-it.height*0.3);
            const x=Math.min(ax,bx), y=Math.min(ay,by), w=Math.abs(bx-ax), h=Math.abs(by-ay);
            ctx.clearRect(x,y,w,h);
            if(tier==='premium'&&!(book.prem&&book.prem._)){ // gold brush only over hidden PREMIUM text in freemium mode
                const grad=ctx.createLinearGradient(0,y,0,y+h);
                grad.addColorStop(0,'rgba(228,196,100,.62)');
                grad.addColorStop(1,'rgba(188,148,42,.62)');
                ctx.fillStyle=grad;
                if(ctx.roundRect){ctx.beginPath();ctx.roundRect(x,y,w,h,Math.min(5,h/2));ctx.fill();}
                else ctx.fillRect(x,y,w,h);
            }
        }
    }
    ,_src:null, _pageNo:0, _tierCache:null
    ,DoShow:async (src, pageNo, render=true)=>{
        if(cBook._src==src && cBook._pageNo==pageNo)
            return;
        if(cBook._src && cBook._src!==src){ // new source → reset pdf cache
            cBook.pdf=null; cBook.pdfPromise=null; cBook.page=null; cBook.pn=0;
        }
        cBook._src=src;
        cBook._pageNo=pageNo;
        cBook._tierCache=null;
        await cBook.Source(src, render, pageNo)
    }
    ,QrUrlScrollY:0
    ,QrUrl:async function(deep=false,ht=35,img="b/LifeDemandedDeath/bqrmid.png",opt={}) {
        if (cBook._qrUrl) URL.revokeObjectURL(cBook._qrUrl);
        const u = new URL("https://gormb.github.io/_");
        u.search = '?b';
        if (opt.book!==false) u.search += '&book=' + encodeURIComponent(book.src);
        if (deep) {
            let c='w,100';
            if (opt.lang!==false && !book.hAlign._) c+=',nLg';
            if (opt.idx!==false) c+=',nTc';
            if (opt.pos!==false && cBook.QrUrlScrollY>0) c+=',s,'+cBook.QrUrlScrollY;
            if (opt.page!==false) u.search += '&page=' + cBook.pn;
            u.search += '&c=' + c;
        }
        const sz = Math.round(ht/100*innerHeight);
        await loadScript('https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js');
        const qrcs = new window.QRCodeStyling({width:sz, height:sz, data:u.href, image:img, imageOptions:{margin:8}});
        if (deep)
            qrd.src = cBook._qrUrl = URL.createObjectURL(await qrcs.getRawData('png'));
        else
            qr.src = cBook._qrUrl = URL.createObjectURL(await qrcs.getRawData('png'));
        return u.href;
    }
    ,Export: async function(start, end, lang) {
        if (!cBook.pdf) return '';
        const s = Math.max(1, start || 1), e = Math.min(cBook.pdf.numPages, end || cBook.pdf.numPages);
        let lastF, lastSz = 0;
        const pages = await Promise.all(Array.from({ length: e - s + 1 }, (_, i) => s + i).map(async p => {
            const page = await cBook.pdf.getPage(p), mid = page.getViewport({ scale: 1 }).width / 2;
            const { items } = await page.getTextContent();
            return items.filter(i => lang?(i.transform[4] > mid)  : (i.transform[4] < mid) && i.str.trim()).map(i => {
                const sz = Math.hypot(i.transform[0], i.transform[1]);
                const br = (lastF && lastF !== i.fontName) ? '<br/>' : '', isB = lastSz && sz > lastSz;
                lastF = i.fontName; lastSz = sz;
                return `${br}${isB ? `<br/><b>${i.str}</b><br/>` : i.str}`;
            }).join(' ');
        }));
        return pages.filter(p => !p.includes('<b>Template</b>')).join('\0').replace(/\0(?=[a-z])/g, ' ').replace(/\0/g, '<br/><br/>');
    }
    ,data:{
        type:{CHAPTER:'chapter',SUB:'subchapter',P:'paragraph',LINK:'link',PAGE:'pagebreak'}
        ,_:null
        ,_title:null
        ,style:null
        ,Style:async function(){ // Last four slides template; n-3 cover, n-2 chapter, n-1 subchapter, n text
            if(cBook.data.style)return cBook.data.style;
            await cBook.Source(book.src,false);
            const pdf=cBook.pdf,n=pdf.numPages,H=i=>i.height||Math.hypot(i.transform[0],i.transform[1]),s={};
            for(let p=n-3;p<=n;p++){
                const page=await pdf.getPage(p),{items}=await page.getTextContent();
                for(const i of items){
                    const t=i.str.trim(); if(!t)continue;
                    const h=H(i),y=i.transform[5];
                    if(/^(Underkapitteltittel(?:en)?|The Sub Chapter Title)$/.test(t)){s.subH=h;s.subY=y;}
                    else if(/^(Kapitteltittelen|The Chapter Title)$/.test(t)){s.chapH=h;s.chapY=y;}
                    else if(/^(Navnet På Boken|The Name of the Book)$/.test(t)){s.coverH=h;}
                }
            }
            const hist={};
            const np=await pdf.getPage(n),{items:ni}=await np.getTextContent();
            ni.forEach(i=>{if(i.str.trim()){const h=H(i).toFixed(1);hist[h]=(hist[h]||0)+1;}});
            s.body=+Object.entries(hist).sort((a,b)=>b[1]-a[1])[0][0]||10;
            return cBook.data.style=s;
        }
        ,get:async function(force=false){
            if(cBook.data._&&!force)return cBook.data._;
            await cBook.Source(book.src,false);
            const T=cBook.data.type,pdf=cBook.pdf,st=await cBook.data.Style();
            const H=i=>i.height||Math.hypot(i.transform[0],i.transform[1]);
            const ov=(a,b)=>a[0]<b[2]&&b[0]<a[2]&&a[1]<b[3]&&b[1]<a[3];
            const near=(v,t,tol)=>Math.abs(v-t)<tol;
            const title=st.chapH||16,tolH=title*.15,tolY=10;
            const out=[];
            for(let p=1;p<=pdf.numPages;p++){
                const page=await pdf.getPage(p),{items}=await page.getTextContent();
                const mid=page.getViewport({scale:1}).width/2;
                const ann=(await page.getAnnotations()).filter(a=>a.subtype==='Link'&&a.url);
                out.push({type:T.PAGE,page:p});
                for(const lang of ['no','en']){
                    let cur=null;
                    const flush=()=>{if(cur)out.push(cur);cur=null;};
                    const side=lang==='no'?(i)=>i.transform[4]<mid:(i)=>i.transform[4]>mid;
                    for(const i of items.filter(side).sort((a,b)=>a.transform[5]-b.transform[5]||a.transform[4]-b.transform[4])){
                        const text=i.str.trim();
                        if(!text)continue;
                        const bx=[i.transform[4],i.transform[5],i.transform[4]+i.width,i.transform[5]+H(i)];
                        const lk=ann.find(a=>ov(bx,a.rect)), m=text.match(cBook.SpotRe);
                        if(lk){flush();out.push({type:T.LINK,page:p,lang,text,url:lk.url,spotify:cBook.SpotRe.test(lk.url)});}
                        else if(m){flush();out.push({type:T.LINK,page:p,lang,text,url:m[0],spotify:true});}
                        else if(st.coverH&&H(i)>=st.coverH*.85){flush();out.push({type:T.P,page:p,lang,text});}
                        else if(near(H(i),title,tolH)){
                            const y=i.transform[5];
                            flush();
                            out.push(near(y,st.chapY||-1,tolY)?{type:T.CHAPTER,page:p,lang,text}
                                :near(y,st.subY||-1,tolY)?{type:T.SUB,page:p,lang,text}
                                :{type:T.P,page:p,lang,text});
                        }
                        else if(cur)cur.text+=' '+text;
                        else cur={type:T.P,page:p,lang,text};
                    }
                    flush();
                }
            }
            return cBook.data._=out;
        }
        ,title:async function(lang=true){ // cover title, language-aware (no=left / en=right half)
            const want=lang?'no':'en';
            if(cBook.data._title&&cBook.data._title[want]!==undefined)return cBook.data._title[want];
            await cBook.data.get(); // ensure data/style is loaded (st.coverH)
            const st=cBook.data.style, pdf=cBook.pdf;
            let t='';
            if(st?.coverH){
                const page=await pdf.getPage(1),{items}=await page.getTextContent();
                const mid=page.getViewport({scale:1}).width/2;
                const H=i=>i.height||Math.hypot(i.transform[0],i.transform[1]);
                const side=want==='no'?i=>i.transform[4]<mid:i=>i.transform[4]>mid;
                t=items.filter(i=>side(i)&&i.str.trim()&&H(i)>=st.coverH*.85)
                    .sort((a,b)=>a.transform[5]-b.transform[5]||a.transform[4]-b.transform[4])
                    .map(i=>i.str.trim()).join(' ');
            }
            return (cBook.data._title=cBook.data._title||{})[want]=t;
        }
        ,txt:async function(lang=true){
            const T=cBook.data.type,want=lang?'no':'en';
            return (await cBook.data.get()).filter(b=>!b.lang||b.lang===want).map(b=>
                b.type===T.PAGE?''
                :b.type===T.LINK?(b.spotify?`▶ ${b.text} (${b.url})`:`${b.text} (${b.url})`)
                :b.type===T.CHAPTER?`# ${b.text}`
                :b.type===T.SUB?`## ${b.text}`
                :b.text).filter(Boolean).join('\n\n');
        }
        ,_mdFile:()=>book.srcBase()+'_'+(book.hAlign._?'NO':'EN')+'_'+(book.prem._?'PREM':'FREE')+'.md' // current lang+mode sidecar
        ,mdRaw:async function(force=false){ // cached raw text of the current-mode .md – fetched once, shared by TOC (fromMd) + search
            const md=cBook.data.md;
            if(md&&md.file===cBook.data._mdFile()&&!force)return md;
            try{
                const file=cBook.data._mdFile();
                const r=await fetch(file,{cache:'no-store'});
                if(!r.ok)return null;
                return cBook.data.md={file,text:await r.text()};
            }catch(e){ return null; }
        }
        ,fromMd:async function(){ // try the generated tiered .md TOC first (fast, no PDF parsing); null → fall back to PDF
            const md=await cBook.data.mdRaw();
            if(!md)return null;
            const want=book.hAlign._?'no':'en', T=cBook.data.type, blocks=[];
            let title='';
            for(const raw of md.text.split(/\r?\n/)){
                const s=raw.trim(); if(!s)continue; let m;
                if(!title&&(m=/^#\s+(.+)$/.exec(s))) title=m[1].trim();
                else if(m=/^##\s+(.+?)\s+—\s+p\.\s*(\d+)$/.exec(s)) blocks.push({type:T.CHAPTER,page:+m[2],lang:want,text:m[1].trim()});
                else if(m=/^###\s+(.+?)\s+—\s+p\.\s*(\d+)$/.exec(s)) blocks.push({type:T.SUB,page:+m[2],lang:want,text:m[1].trim()});
                else if(m=/^🎵\s+(.+?)\s+\((\S+?)\)\s+—\s+p\.\s*(\d+)$/.exec(s)) blocks.push({type:T.LINK,page:+m[3],lang:want,text:m[1].trim(),url:m[2],spotify:true});
                // '#### p. N' and body lines: ignored for the TOC
            }
            return blocks.length?{title,blocks}:null;
        }
    }
    ,SpotRe:/^https:\/\/gormb\.github\.io\/_\/?\?m(?!.*qr$)\S*/i
    ,SpotMap:null
    ,SpotLoad:async function(force=false){
        if(cBook.SpotMap&&!force)return cBook.SpotMap;
        const m={},cfg=window.SUPABASE||{};
        if(cfg.url&&!cfg.url.includes('YOUR-')){
                try{const{createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
                const{data,error}=await createClient(cfg.url,cfg.publishableKey).from('redir').select('id,url,"group"');
                // music links may be tracks and/or playlists (groups 'music', 'playlist', ...)
                const mappings=(data||[]).filter(r=>/music|playlist/i.test(String(r.group||'').trim()));
                mappings.forEach(r=>{
                    if(!r.id)return;
                    m[r.id]=r.url;
                    if(r.id[0]==='m')m[r.id.slice(1)]=r.url;
                    else m['m'+r.id]=r.url;
                    if(r.id.endsWith('qr'))m[r.id.slice(0,-2)]=r.url;
                });
            }catch(e){console.error('[Spotify] Supabase lookup failed',e);}
        }
        return cBook.SpotMap=m;
    }
    ,SpotUrl:async function(url){
        if(!url||!cBook.SpotRe.test(url))return url;
        const map=await cBook.SpotLoad(), key=new URL(url).search.slice(1), resolved=map[key]||url;
        console.log('[Spotify] URL resolve', {key, resolved, found:resolved!==url});
        return resolved;
    }
    ,_spots:null
    ,Play:async function(){
        const box=document.getElementById('_dPlay');
        if(cBook.view)box.style.width=cBook.view.width+'px';
        if(!cBook.page||!cBook.view||_cBook.style.display=='none'){ if(box)box.innerHTML=''; return; }
        if(!cBook._spots||cBook._spots.pn!==cBook.pn){
            const {items}=await cBook.page.getTextContent();
            const mid=cBook.viewport.width/2;
            const rows=[];
            for(const i of [...items].sort((a,b)=>b.transform[5]-a.transform[5])){
                const [,y1,,y2]=cBook.view.convertToViewportRectangle(
                    [i.transform[4],i.transform[5],i.transform[4]+i.width,i.transform[5]+(i.height||10)]);
                const yc=(y1+y2)/2;
                const last=rows[rows.length-1];
                if(last&&Math.abs(last.yc-yc)<(i.height||10)*0.6){ last.items.push(i); last.yc=(last.yc+yc)/2; }
                else rows.push({yc,items:[i]});
            }
            const list=[];
            for(const row of rows){
                const it=row.items.find(i=>i.str?.match(cBook.SpotRe));
                if(!it)continue;
                const raw=it.str.match(cBook.SpotRe)[0], col=it.transform[4]>mid;
                const key=raw.split('?')[1]||'';
                const lh=(it.height||10)*cBook.scale;
                const above=rows.filter(r=>r!==row&&r.yc<row.yc-4&&r.items.some(i=>(i.transform[4]>mid)===col))
                    .sort((a,b)=>b.yc-a.yc)[0];
                const gap=above?row.yc-above.yc:lh*1.5;
                const yc=(above&&gap<lh*3)?above.yc-gap/2:row.yc-lh*1.5;
                if(list.some(s=>Math.abs(s.yc-yc)<(it.height||10)*0.7))continue;
                list.push({url:raw,key,col,yc});
            }
            cBook._spots={pn:cBook.pn,list};
        }
        box.innerHTML='';
        if(!cBook._spots.list.length)return;
        const top0=_cBook.offsetTop, overlayHeight=box.clientHeight||1;
        for(const s of cBook._spots.list){
            const b=document.createElement('a');
            b.className='play'; b.id=`${s.key}_${s.col?'r':'l'}`; b.dataset.u=s.url; b.href='#'; b.textContent='\u266A'; // ♪ – one note per line
            const playClick=event=>{
                event.preventDefault();
                event.stopPropagation();
                window.spTgl(b,event);
            };
            b.addEventListener('mousedown',playClick);
            b.dataset.top=((top0+s.yc)/overlayHeight)*100;
            b.style.top=`${b.dataset.top}%`;
            box.appendChild(b);
            const r=b.cloneNode(true); r.className='play right';
            r.addEventListener('mousedown',event=>{
                event.preventDefault();
                event.stopPropagation();
                window.spTgl(r,event);
            });
            box.appendChild(r);
        }
        cBook.SpotLoad().then(map=>{
            box.querySelectorAll('a.play').forEach(a=>{
                const k=new URL(a.dataset.u||a.href,location.href).search.slice(1);
                if(map[k])a.dataset.u=map[k];
            });
        });
    }
    ,PageNo:async function(){ // page number in top margin, centered per half; landscape also in bottom
        const box=document.getElementById('_dPage');
        if(!box)return;
        if(cBook.view)box.style.width=cBook.view.width+'px';
        if(!cBook.page||!cBook.view||_cBook.style.display=='none'){ if(box)box.innerHTML=''; return; }
        const u=window._stateUi||{sym:' '}; // state symbol (from nav.gest)
        const one=`<span class="st">${u.sym}</span>${cBook.pn}<span class="st st2">${u.sym}</span>`; // symbol on both halves keeps the number centered
        const top=_cBook.offsetTop+cBook.view.height*.02, bot=_cBook.offsetTop+cBook.view.height*.98;
        const l=cBook.view.height>window.innerHeight; // landscape: page taller than window → also show at bottom
        box.innerHTML=`<span style="top:${top}px;left:25%">${one}</span><span style="top:${top}px;left:75%">${one}</span>`+(l?`<span style="top:${bot}px;left:25%">${one}</span><span style="top:${bot}px;left:75%">${one}</span>`:'');
    }
    ,Save: async function(el, filename='book.pdf') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
        await html2pdf().set({margin:0,filename,html2canvas:{scale:1},jsPDF:{unit:'mm',format:'a4'}}).from(el).save();
    }
};

window.cBook=cBook;
loadScript('https://gormb.github.io/_/db.js?v=8').catch(()=>console.warn('[db.js] kunne ikke lastes i bakgrunnen')); // db.js = SUPABASE config + window.db (PIN) – load in background, never block the book // ?v=8: db.js updated (bookInterval → premiumCheckInterval)
const _dPlay=document.createElement('div'); _dPlay.id='_dPlay';
document.getElementById('_dBook').appendChild(_dPlay);
const _dPage=document.createElement('div'); _dPage.id='_dPage';
document.getElementById('_dBook').appendChild(_dPage);
