import * as _cBookJLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
_cBookJLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

let cBook={ctx:null,pdf:null,page:null,pn:0,viewport:null,scale:null,view:null,pdfPromise:null,renderTask:null
    ,Source:async function(src,render,pageno=cBook.pn) {
        cBook.ctx = cBook.ctx || _cBook.getContext("2d");
        cBook.pdfPromise = cBook.pdfPromise || _cBookJLib.getDocument(src).promise;
        cBook.pdf = cBook.pdf || await cBook.pdfPromise;
        if (render) 
            await cBook.Page(pageno, true);
    }
    ,Page:async function(pageNo,render) {
        const np=cBook.pdf.numPages-4; // Last four slides is template
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
        cBook.viewport = cBook.page.getViewport({scale:1});
        cBook.scale = width / cBook.viewport.width;
        cBook.view = cBook.page?.getViewport({ scale: cBook.scale });
        if (doRender) await cBook.Render();
    }
    ,Render:async function() {
        if (cBook.renderTask) cBook.renderTask.cancel();
        cBook.renderTask = cBook.page?.render({canvasContext: cBook.ctx, viewport: cBook.view});
        cBook.Play();
    }
    ,_src:null, _pageNo:0
    ,DoShow:async (src, pageNo)=>{
        if(cBook._src==src && cBook._pageNo==pageNo)
            return;
        cBook._src=src;
        cBook._pageNo=pageNo;
        await cBook.Source(src,true,pageNo)
    }
    ,QrUrlScrollY:0
    ,QrUrl:async function(deep=false,ht=35,img="LifeDemandedDeath.png") {
        if (cBook._qrUrl) URL.revokeObjectURL(cBook._qrUrl);
        const u = new URL("https://gormb.github.io/_");
        u.search = '?b&book=' + encodeURIComponent(book.src);
        if (deep) {
            let c='w,1';
            if (!book.hAlign._) c+=',nLg';
            if (cBook.QrUrlScrollY>0) c+=',s,'+cBook.QrUrlScrollY;
            u.search += '&page=' + cBook.pn + '&c=' + c;
        }
        const sz = Math.round(ht/100*innerHeight);
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
                    if(/^(Underkapitteltittelen|The Sub Chapter Title)$/.test(t)){s.subH=h;s.subY=y;}
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
        ,txt:async function(lang=true){
            const T=cBook.data.type,want=lang?'no':'en';
            return (await cBook.data.get()).filter(b=>!b.lang||b.lang===want).map(b=>
                b.type===T.PAGE?''
                :b.type===T.LINK?(b.spotify?`▶ ${b.text} (${b.url})`:`${b.text} (${b.url})`)
                :b.type===T.CHAPTER?`# ${b.text}`
                :b.type===T.SUB?`## ${b.text}`
                :b.text).filter(Boolean).join('\n\n');
        }
    }
    ,SpotRe:/^https:\/\/gormb\.github\.io\/_\/?\?m(?!.*qr$)\S*/i
    ,SpotMap:null
    ,SpotLoad:async function(force=false){
        if(cBook.SpotMap&&!force)return cBook.SpotMap;
        const m={},cfg=window.SUPABASE||{};
        if(cfg.url&&!cfg.url.includes('YOUR-')){
            try{const{createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
                const{data}=await createClient(cfg.url,cfg.publishableKey).from('redir').select('id,url');
                (data||[]).forEach(r=>{if(r.id)m[r.id]=r.url});}catch(e){}
        }
        return cBook.SpotMap=m;
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
                list.push({url:raw,key,yc});
            }
            cBook._spots={pn:cBook.pn,list};
        }
        box.innerHTML='';
        if(!cBook._spots.list.length)return;
        const top0=_cBook.offsetTop;
        for(const s of cBook._spots.list){
            const b=document.createElement('a');
            b.className='play'; b.href=s.url; b.target='_blank'; b.rel='noopener'; b.textContent='▶';
            b.style.top=(top0+s.yc)+'px';
            box.appendChild(b);
            const r=b.cloneNode(true); r.className='play right'; box.appendChild(r);
        }
        cBook.SpotLoad().then(map=>{
            box.querySelectorAll('a.play').forEach(a=>{const k=new URL(a.href).search.slice(1);if(map[k])a.href=map[k]});
        });
    }
    ,Save: async function(el, filename='book.pdf') {
        await html2pdf().set({margin:0,filename,html2canvas:{scale:1},jsPDF:{unit:'mm',format:'a4'}}).from(el).save();
    }
};

window.cBook=cBook;
const _dPlay=document.createElement('div'); _dPlay.id='_dPlay';
document.getElementById('_dBook').appendChild(_dPlay);
