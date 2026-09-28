import * as _cBookJLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
import {music} from './music.js?v=5';
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
        music.Play().catch(e=>console.error('[music] Play', e)); // after swap: getTextContent won't compete with renderer for the worker
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
    ,_src:null, _pageNo:0
    ,DoShow:async (src, pageNo, render=true)=>{
        if(cBook._src==src && cBook._pageNo==pageNo)
            return;
        if(cBook._src && cBook._src!==src){ // new source → reset pdf cache
            cBook.pdf=null; cBook.pdfPromise=null; cBook.page=null; cBook.pn=0;
        }
        cBook._src=src;
        cBook._pageNo=pageNo;
        await cBook.Source(src, render, pageNo)
    }
    ,QrUrlScrollY:0
    ,QrUrl:async function(deep=false,ht=35,img="b/LifeDemandedDeath/bqrmid.png",opt={}) {
        if (cBook._qrUrl) URL.revokeObjectURL(cBook._qrUrl);
        const u = new URL("https://aigap.no/b"); // gormb.github.io/_?b&book… har flyttet til aigap.no/b?book…
        const qs=k=>u.search=u.search?(u.search+'&'+k):('?'+k);
        if (opt.book!==false) qs('book=' + encodeURIComponent(book.src));
        if (deep) {
            let c='w,100';
            if (opt.lang!==false) c+=book.hAlign._?',nLg0':',nLg1'; // deterministic language – nLg0=NO, nLg1=EN
            if (opt.idx!==false) c+=',nTc';
            if (opt.pos!==false && cBook.QrUrlScrollY>0) c+=',s,'+cBook.QrUrlScrollY;
            if (opt.page!==false) qs('page=' + cBook.pn);
            qs('c=' + c);
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
        _mdFile:()=>book.srcBase()+'_'+(book.hAlign._?'NO':'EN')+'_'+(book.prem._?'PREM':'FREE')+'.md' // current lang+mode sidecar
        ,mdRaw:async function(force=false){ // cached raw text of the current-mode .md – fetched once, shared by TOC + search + music deep links
            const md=cBook.data.md;
            if(md&&md.file===cBook.data._mdFile()&&!force)return md;
            try{
                const file=cBook.data._mdFile();
                const r=await fetch(file,{cache:'no-store'});
                if(!r.ok)return null;
                return cBook.data.md={file,text:await r.text()};
            }catch(e){ return null; }
        }
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
loadScript('https://aigap.no/db.js?v=8').catch(()=>console.warn('[db.js] kunne ikke lastes i bakgrunnen')); // db.js = SUPABASE config + window.db (PIN) – load in background, never block the book // ?v=8: db.js updated (bookInterval → premiumCheckInterval)

/* ---- The word map (books.map.js): the .md sidecar says what is where in the .pdf, and the module owns that hierarchy ----
   The sidecar knows the pages ('#### p. N'), the main chapters ('## ') and the sub chapters ('### '). books.map walks it as
   shelf → copy → chapter in the table of contents – a picked chapter or sub chapter leads straight there – and as chapter →
   sub chapter → paragraph in the text, where a picked paragraph opens its page and, when the sheet is taller than the window,
   scrolls to where that paragraph is estimated to stand. LdD only says where the sidecar lives, which copy and page are open,
   and what a pick must do. */
const wm=books.map.sidecar({
    prefix:()=>book.srcBase()
    ,lg:()=>book.hAlign._?'NO':'EN'
    ,ed:()=>book.prem._?'PREM':'FREE'
    ,title:()=>nav._tocTitle
    ,page:()=>cBook.pn||1
    ,toc:()=>_dToc.style.display!='none'
    ,copy:async c=>{                                             // a copy of the book: language × edition
        if(c.ed==='PREM'&&!book.prem._){                         // 👑, and free here in this session
            await book.prem.Load();                              // …but this book may be unlocked already – that code is used first
            if(!book.prem._){nav.PremToggle();return;}            // nothing stored for it: ask for the code (the PIN floats over the map)
        }
        if((book.prem._?'PREM':'FREE')!==c.ed)await book.prem.L(c.ed==='PREM');
        if((book.hAlign._?'NO':'EN')!==c.lg)await book.hAlign.L(c.lg==='NO');
    }
    ,go:async at=>{                                              // a place in the book: its page, and where the text stands on it
        if(_dToc.style.display!='none'){await nav.TocPage(at.page);books.map.Z.hide();return;}   // the TOC covers the sheet, the map may give way at once
        await nav.Page(at.page,0);
        if(!book.whole&&cBook.page){                             // the sheet fits the window – the page is enough
            const put=()=>{                                      // .md alone: where it stands among the paragraphs on that page
                const y=wm.frac(at)*cBook.view.height
                    ,top=_cBook.getBoundingClientRect().top+window.scrollY+y-window.innerHeight/2;
                window.scrollTo(0,Math.max(0,Math.min(top,document.documentElement.scrollHeight-window.innerHeight)));
            };
            put();setTimeout(put,150);                           // the sheet may still be settling – say it once more
        }
        books.map.Z.hide();                                      // page up and the place marked: now the map gives way – hiding first let the old page blink through
    }
});
books.map.host=wm.host;
const _Lang=book.hAlign.L, _Tier=book.prem.L;                    // whichever way the copy changes – map cell, menu button or the PIN – the map follows
book.hAlign.L=l=>{const r=_Lang(l);wm.reload();return r;};
book.prem.L=async l=>{const r=await _Tier(l);await wm.reload();return r;};
books.map.Z.el={page:_dBook};                                    // no panel of its own: the map builds the overlay, head and filter
books.map.Z.init();
const _Loaded=nav.Loaded;                                        // once the book is up, read the sidecar that anchors it
nav.Loaded=async(...a)=>{const r=await _Loaded(...a);wm.warm();return r;};

const _dPlay=document.createElement('div'); _dPlay.id='_dPlay';
document.getElementById('_dBook').appendChild(_dPlay);
const _dPage=document.createElement('div'); _dPage.id='_dPage';
document.getElementById('_dBook').appendChild(_dPage);
