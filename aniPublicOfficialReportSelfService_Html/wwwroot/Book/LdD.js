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
    ,QrUrl:async function() {
        if (cBook._qrUrl) URL.revokeObjectURL(cBook._qrUrl); // release previous
        const u = new URL(location.origin + location.pathname); // fresh base: no inherited params
        let c='w,1';
        if (!book.hAlign._) c+=',nLg';
        if (cBook.QrUrlScrollY>0) c+=',s,'+cBook.QrUrlScrollY;
        u.search = 'book=' + encodeURIComponent(book.src) + '&page=' + cBook.pn + '&c=' + c; // raw commas, no %2C
        const sz = Math.round(40/100*innerHeight); // matches .qr width (40vh)
        const qr = new window.QRCodeStyling({width:sz, height:sz, data:u.href, image:"qr_int2.png", imageOptions:{margin:8}});
        const blob = await qr.getRawData('png');
        qrd.src = cBook._qrUrl = URL.createObjectURL(blob);
        return u.href;
    }
};

window.cBook=cBook;
