import * as _cBookJLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
_cBookJLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

let cBook={ctx:null,pdf:null,page:null,pn:0,viewport:null,scale:null,view:null,pdfPromise:null,renderTask:null
    ,Source:async function(src,render) {
        cBook.ctx = cBook.ctx || _cBook.getContext("2d");
        cBook.pdfPromise = cBook.pdfPromise || _cBookJLib.getDocument(src).promise;
        cBook.pdf = cBook.pdf || await cBook.pdfPromise;
        if (render) await cBook.Page(cBook.pn, true);
    }
    ,Page:async function(pageNo,render) {
        if(pageNo<1) pageNo=1;
        else if(pageNo>cBook.pdf.numPages) pageNo=cBook.pdf.numPages;
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
        cBook.view = cBook.page.getViewport({ scale: cBook.scale });
        if (doRender) await cBook.Render();
    }
    ,Render:async function() {
        if (cBook.renderTask) cBook.renderTask.cancel();
        cBook.renderTask = cBook.page.render({canvasContext: cBook.ctx, viewport: cBook.view});
    }
    ,DoShow:async (src, pageNo, width)=>await cBook.Source(src,true)
    ,QrUrlScrollY:0
    ,QrUrl:async function(deep=false,ht=35,img="LifeDemandedDeath.png") {
        if (cBook._qrUrl) URL.revokeObjectURL(cBook._qrUrl); // release previous
        // use current const u = new URL(location.origin + location.pathname); // fresh base: no inherited params
        // use current u.search = 'book=' + encodeURIComponent(book.src);
        //https://gormb.github.io/_/?b
        const u = new URL("https://gormb.github.io/_"); // fresh base: no inherited params
        u.search = '?b&book=' + encodeURIComponent(book.src);
        if (deep) {
            let c='w,1';
            if (!book.hAlign._) c+=',nLg';
            if (cBook.QrUrlScrollY>0) c+=',s,'+cBook.QrUrlScrollY;
            u.search += '&page=' + cBook.pn + '&c=' + c; // raw commas, no %2C
        }
        const sz = Math.round(ht/100*innerHeight); // matches .qr width (ht or 35vh)
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
                const sz = Math.hypot(i.transform[0], i.transform[1]); // calculate actual font height/scale
                const br = (lastF && lastF !== i.fontName) ? '<br/>' : '', isB = lastSz && sz > lastSz;
                lastF = i.fontName; lastSz = sz;
                return `${br}${isB ? `<br/><b>${i.str}</b><br/>` : i.str}`;
            }).join(' ');
        }));
        return pages.filter(p => !p.includes('<b>Template</b>')).join('\0').replace(/\0(?=[a-z])/g, ' ').replace(/\0/g, '<br/><br/>');
    }
    ,Save: async function(el, filename='book.pdf') {
        await html2pdf().set({margin:0,filename,html2canvas:{scale:1},jsPDF:{unit:'mm',format:'a4'}}).from(el).save();
    }
};

window.cBook=cBook;
