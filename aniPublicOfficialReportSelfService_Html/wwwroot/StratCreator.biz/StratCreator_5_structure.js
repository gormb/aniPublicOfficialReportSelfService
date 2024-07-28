document.write("<div class=\"debug\">Code for structure...</div>");

// Structure - Chapters and subchapters for the Contents
// Example: Chapter strucure with Chapters 1-3, and Subchapters 1a-3g for:

// Using class
async function structureAsync(structuring, inTxt, doneC, errC, maxTokens, stopArray) {
    AI_Factory(0).valAsync(structuring + "\n" + inTxt, (gptOut) =>
    {
        let ChSub = structureAsChSub(gptOut);
        doneC(ChSub[0], ChSub[1], gptOut);
    }
    , errC, maxTokens, stopArray);
}

/*         "content": "
Chapter 1: Introduktion til kunsthistorien

- Subchapter 1a: Definition af kunsthistorie
- Subchapter 1b: Vigtigheden af kunsthistorie

Chapter 2: Den historiske udvikling af kunsthistorien

- Subchapter 2a: Antikkens betydning for kunsthistorien
- Subchapter 2b: Renæssancen og den moderne tilgang til kunst"
*/
function structureStopAfter(iC, iS) {
    let res = [];
    if (iS == null) { // chapter; next chapter or first subchapter
        res = ['Chapter ' + (iC + 2)
            , 'Subchapter ' + (iC + 1) + 'a'
            , '' + (iC + 1) + 'a) '];
    }
    else { // subchapter; next subchapter or chapter
        res = ['Chapter ' + (iC + 2)
            , 'Subchapter ' + (iC + 1) + String.fromCharCode('b'.charCodeAt(0)+iS)
            , '' + (iC + 1) + String.fromCharCode('b'.charCodeAt(0) + iS) +') '];
    }
    return res;
}
function IsChapter(v) {

}
function structureAsChSub(gptOut){
    let chSub = gptOut.replace('\t', '\n').split("\n");
    let structureCh = [];
    let structureSub = [[]]; 
    let nCh = 0;
    for (let i = 0; i < chSub.length; i++) {
        let chSubN = chSub[i].replace('#', '').replace('*', '').trim();
        if (chSubN.length > 6)
            if (chSubN.substring(0, "Chapter".length) == "Chapter" || chSubN.substring(0, "**".length) == "**") {
                nCh = structureCh.push(chSubN);
                structureSub.push([]);
            }
            else if (nCh > 0)
                structureSub[nCh - 1].push(chSubN);
    }
    return [structureCh, structureSub];
}
function structureChaptId(iC, iS) { // chapt_x_y
    return 'chapt' + (iC == null ? '' : '_' + iC) + (iS == null ? '' : '_' + iS);
}
function structureAsHtmlItem(ch, iC, iS) { // <a href="#chapt_x_y">Theme</a>
    return res = '<a href="#' + structureChaptId(iC, iS) + '">'
        + ch.replace(/.*:/, "").trim()
        + '</a>';
}
function structureAsHtml(structure) {
    let res = "<ul>";
    let ChSub = structureAsChSub(structure);
    for (let i = 0; i < ChSub[0].length && i < ChSub[1].length; i++) {
        res += '<li class="product_active">' + (i < ChSub[0].length ? structureAsHtmlItem(ChSub[0][i], i) : "?") + "<ul>";
        if (i < ChSub[1].length)
            for (let j = 0; j < ChSub[1][i].length; j++)
                res += '<li class="product_active">' + structureAsHtmlItem(ChSub[1][i][j], i, j) + "</li>";
        res += "</ul></li>";
    }
    res += "</ul>"
    return res;
} //alert(structureAsHtml('Chapter 1: What is it all about' + '\nSubchapter 1a: Life' + '\nSubchapter 1b: The Univers' + '\nSubchapter 1c: Everything'));

document.write("<div class=\"debug\">End of Code for structure.</div>");
