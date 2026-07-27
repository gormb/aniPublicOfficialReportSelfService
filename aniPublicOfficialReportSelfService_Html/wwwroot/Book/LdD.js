import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

const canvas = document.getElementById("_cBook");
const ctx = canvas.getContext("2d");
let pdfPromise;
let pdfSrc;

let renderTask;

async function cShow(src, height) {
    if (src !== pdfSrc) {
        pdfSrc = src;
        pdfPromise = pdfjsLib.getDocument(src).promise;
    }
    const pdf = await pdfPromise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({
        scale: 1
    });

    const scale = height / viewport.height;

    const view = page.getViewport({
        scale: scale
    });

    // canvas.width = view.width;
    // canvas.height = view.height;

    if (renderTask) renderTask.cancel();

    renderTask = page.render({
        canvasContext: ctx,
        viewport: view
    });

    // try {
    //     await renderTask.promise;
    // } catch (error) {
    //     if (error?.name !== "RenderingCancelledException")
    //         throw error;
    // }
}

pdfRendererReadyResolve(cShow);
