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

function ChapterText(v) {
    let res = null;
    if (v.length > 3) {
            let iC = v.indexOf("Chapter ");
        if (iC != -1)
            res = v.substring(iC + "Chapter ".length,1000).replace('#','').replace('*','').trim(); //b ** Chapter 1 chapt ** / Chapter 1
        else if (v.substring(0,3).replace('#','*')=='** ')
            res = v.replace('*','').replace('#','').trim(); //b ** chapt ** / ##  chapt ##
    }
    return res;
}
function SubchapterText(v) {
    let res = null;
    if (v.length > 3)
    {
        let iC = v.indexOf("Subchapter ");
        if (iC != -1)
            res = v.substring(iC + "Subchapter ".length,1000).replace('#','').replace('*','').trim(); //b ** Chapter 1 chapt ** / Chapter 1
        else if (v.substring(0,3).replace('#','*')=='*** ')
            res = v.replace('*','').replace('#','').trim(); //b ** chapt ** / ##  chapt ##
    }
    return res;
}

//function ChapterText(v) {
//    let res = null;
//    if (v.length > 3) {
//        let iC = v.indexOf("Chapter ");
//        if (iC != -1) {

//            res = v.substring(iC + "Chapter ".length).replace(/#/g, '').replace(/\*/g, '').trim();
//        } else if (v.substring(0, 3).replace(/#/g, '*') === '** ') {
//            res = v.replace(/#/g, '').replace(/\*/g, '').trim();
//        }
//    }
//    return res;
//}

//function SubchapterText(v) {
//    let res = null;
//    if (v.length > 3) {
//        let iC = v.indexOf("Subchapter ");
//        if (iC != -1) {
//            res = v.substring(iC + "Subchapter ".length).replace(/#/g, '').replace(/\*/g, '').trim();
//        } else if (v.substring(0, 3).replace(/#/g, '*') === '*** ') {
//            res = v.replace(/#/g, '').replace(/\*/g, '').trim();
//        } else {
//            res = v.replace(/#/g, '').replace(/\*/g, '').trim();
//        }
//    }
//    return res;
//}

function structureAsChSub(gptOut) {
    let chSub = gptOut.replace('\t', '\n').split("\n");
    let structureCh = [];
    let structureSub = [[]]; 
    let nCh = 0;
    for (let i = 0; i < chSub.length; i++) {
        let chSubN = ChapterText(chSub[i]);
        if (chSubN != null) {
            nCh = structureCh.push(chSubN);
            structureSub.push([]);
        }
        else if (nCh > 0) { // we have at least one chapter already, so presume subchapter
            let chSubN = SubchapterText(chSub[i]);
            if (chSubN != null)
                structureSub[nCh - 1].push(chSubN);
        }
    }
    //for (let i = 0; i < chSub.length; i++) {
    //    let chSubN = chSub[i].replace('#', '').replace('*', '').trim();
    //    if (chSubN.length > 6)
    //        if (chSubN.substring(0, "Chapter".length) == "Chapter" || chSubN.substring(0, "**".length) == "**") {
    //            nCh = structureCh.push(chSubN);
    //            structureSub.push([]);
    //        }
    //        else if (nCh > 0)
    //            structureSub[nCh - 1].push(chSubN);
    //
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
