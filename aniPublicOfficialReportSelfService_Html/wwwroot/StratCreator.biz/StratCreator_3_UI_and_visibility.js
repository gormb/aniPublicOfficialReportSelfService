﻿document.write("<div class=\"debug\">Code for load and visibility...</div>");

// HTML-events for StratCreator
// 

function UpdateOutOrShowreduceButton() {
    if (txtContentsIn.value.split(' ').length > DEFAULT_MAX_WORDS)
        Show(reduceButton, 1);
    else {
        Show(reduceButton, 0);
        txtContentsOut.value = txtContentsIn.value;
    }
}
function UpdateImageColoring(i,d,p,f) {
    ideaImg.style.filter = (i == 1) ? "" : "grayscale(70%)";
    designImg.style.filter = (d == 1) ? "" : "grayscale(70%)";
    productionImg.style.filter = (p == 1) ? "" : "grayscale(70%)";
    finishImg.style.filter = (f == 1) ? "" : "grayscale(70%)";
}
function DescSelectVisible(idDesc) {
    ideaDesc.style.backgroundColor = designDesc.style.backgroundColor = productionDesc.style.backgroundColor = finishDesc.style.backgroundColor = '#000';
    Show(progressBar, 1);
    if (idDesc != null)
        idDesc.style.backgroundColor = '#eee';
}
function TheIdeaClick() {
    ShowEditControls(0);
    DescSelectVisible(ideaDesc);
    Show(introtext, 0);
    Show(design, 1);
    ShowCell(0, 0, 1); ShowCell(1, 0, 1); ShowCell(2, 0, 1); // Captions
    ShowCell(0, 1, 1); ShowCell(1, 1, 1); ShowCell(2, 1, 1); // Contents
    //ShowCell(0, 6, 1); ShowCell(1, 6, 1); ShowCell(2, 6, 1); // Competency need
    //Show(generate, 1);
    Show(previewTable, 1);
    Show(idStyleButtons, 1);
    UpdateImageColoring(1,0,0,0);
}
function TheDesignClick() {
    ShowEditControls(0);
    DescSelectVisible(designDesc);
    Show(introtext, 0);
    Show(design, 1);
    Show(ideaImg, 1);
    ShowCell(0, 0, 1); ShowCell(1, 0, 1); ShowCell(2, 0, 1); // Captions
    ShowCell(0, 2, 1); ShowCell(1, 2, 1); ShowCell(2, 2, 1); // Chapter strucutre
    ShowCell(-1, 6, 0); // Hide Competency
    Show(btns2, 1);
    Show(generate, 1);
    Show(previewTable, 1);
    UpdateImageColoring(0, 1, 0, 0);
}
function TheTextClick() {
    ShowEditControls(1);
    DescSelectVisible(productionDesc);
    Show(introtext, 0);
    if (document.getElementById(structureChaptId(0)) == null) generateAll_ContentTableBlank();
    ShowDefault();
    ShowCell(-1, 6, 0); // Hide Competency
    Show(ideaImg, 1);
    Show(design, 1);
    Show(btns2, 1);
    Show(btns2steps, 1);
    Show(generate, 1);
    Show(previewTable, 1);
    UpdateImageColoring(0, 0, 1, 0);
}
function TheFinishClick() {
    ShowEditControls(1);
    DescSelectVisible(finishDesc);
    Show(introtext, 0);
    if (document.getElementById(structureChaptId(0)) == null) generateAll_ContentTableBlank();
    Show(design, 1);
    Show(ideaImg, 1);
    ShowCell(0, 0, 1); ShowCell(1, 0, 1); ShowCell(2, 0, 1); // Captions
    ShowCell(0, 4, 1); ShowCell(1, 4, 1); ShowCell(2, 4, 1); // Imagetext
    ShowCell(-1, 6, 0); // Hide Competency
    Show(previewTable, 1);
    Show(idStyleButtons, 1);
    Show(publish, 1);
    UpdateImageColoring(0, 0, 0, 1);
}

function Toggle(c) {try{c.style.display=(c.style.display=='none')?'':'none';} catch(e) {}}

function Visibility(visible) {
    if (visible === 0 || visible === false) return 'none';
    else if (visible === 1 || visible === true) return '';
    else
        return visible;
}
function Show(c, visible) {
    if (visible==null) Toggle(c);
    else c.style.display = Visibility(visible);
}

function ShowClass(cssClassName = '.editControl', visibility) {
    for (let i = 0; i < document.styleSheets.length; i++) {
        try { // Only works for styles within document!!
            let sheet = document.styleSheets[i];
            for (let j = 0; j < sheet.cssRules.length; j++)
                if (sheet.cssRules[j].selectorText === cssClassName)
                    Show(sheet.cssRules[j], visibility);
        }
        catch (ex) { }
    }
}
function ShowEditControls(visibility) { ShowClass('.editControl', visibility); }

function ShowCell(x, y, visible) {
    if (y == -1) { for (let i = 0; i < u.rows.length; i++) ShowCell(x, i, visible); }
    else if (x == -1) { for (let i = 0; i < u.rows[y].cells.length; i++) ShowCell(i, y, visible); }
    else 
        Show (u.rows[y].cells[x], visible)
}

function ShowNone() {
    ShowCell(-1, -1, 'none'); // hide all
    DescSelectVisible(null);
    UpdateImageColoring(1, 1, 1, 1);
    Show(progressBar, 0); 
    Toggle(design);
    Show(generate, 0);
}

function ShowDefault() {
    ShowCell(-1, -1, ''); // show all
    ShowCell(3, -1); // Hide
    ShowCell(4, -1);
    ShowCell(5, -1);
}

// Edit-buttons...
function w(v) { document.write(v); }
function w_kapittelStruktur() { w('<button class="editControl" onclick="preview.innerHTML=\'Kapittelutfylling\'; generateAll(overviewTable, contentTable, \'struct\');">Textstructure</button>');}
function w_hideEditButtons() { w('<button class="editControl" onclick="ShowEditControls(0);">Gjem edit-buttons</button>'); }
function w_styleKnapper(aStyle) { w('<button class="editControl" onclick="SelectStyle(\'' + aStyle + '\',0);">' + aStyle + '</button>'); }
function htmlChaptRefresh() { return '<button class="editControl" onclick="preview.innerHTML=\'Kapittelutfylling\'; generateAll(overviewTable, contentTable, \'struct\');">' + tRotate +'</button>'; }
function htmlChaptTxtRefresh(iC) { return '<button class="editControl" onclick="introAsync(\'chapt_' + iC + '_text\', txtIntroIn.value, gStructureCh[' + iC + '], gStructure, txtContentsOut.value,null,null,null,structureStopAfter(' + iC + '))">innledning ' + tRotate +'</button>'; }
function htmlChaptTxtRefreshAll() { return '<button class="editControl" onclick="introAsyncAll()">innledninger ' + tRotate +'</button>'; }
function htmlSubchaptTxtRefresh(iC, iS) { return '<button class="editControl" onclick="textAsync(\'chapt_' + iC + '_' + iS + '_text\', txtBodytextIn.value, gStructureSub[' + iC + '][' + iS + '], gStructure, txtContentsOut.value, null, null, null, structureStopAfter(' + iC + ',' + iS + '))">innhold ' + tRotate +'</button>'; }
function htmlSubchaptTxtRefreshAll() { return '<button class="editControl" onclick="textAsyncAll()">brødtekst ' + tRotate +'</button>'; }
function htmlImgTxtRefresh(iC, txt) { return '<button class="editControl" onclick="picturedescriptionAsync(\'chapt_' + iC + '_imagetext\', txtImageIn.value, gStructureCh[' + iC + '], chapt_' + iC + '_text.innerHTML, (cId) => {/*alert(cId.innerHTML);*/ })">utgangspunkt for bilde ' + tRotate +'</button>'; }
function htmlImgTxtRefreshAll() { return '<button class="editControl" onclick="picturedescriptionAsyncAll()">beskriv ' + tRotate +'</button>'; }
function htmlImgRefresh(iC) { return '<button class="editControl" onclick="pictureAsync(\'chapt_' + iC + '_image\', chapt_' + iC + '_imagetext.innerHTML)">bilde ' + tRotate +'</button>'; }
function htmlImgRefreshAll() { return '<button class="editControl" onclick="pictureAsyncAll()">bilder ' + tRotate +'</button>'; }

function introAsyncAll() {
    generate_progress('Producing chapter introductions with GPT...', 1);
    for (let i = 0; i < gStructureCh.length; i++) // Get intro, image text and image for chapter, get text for each subchapter
        // chapter intro and image
        introAsync(structureChaptId(i) + '_text', txtIntroIn.value, gStructureCh[i], gStructure, txtContentsOut.value
            , (cId) => { // _imagetext, _image
                generate_progress('Intro for ' + gStructureCh[i] + ' done');
            }, null, 2000, structureStopAfter(i)); // introAsync
}
function textAsyncAll() {
    generate_progress('Producing subchapters with GPT...', 1);
    for (let i = 0; i < gStructureCh.length && i < gStructureSub.length; i++) // Get intro, image text and image for chapter, get text for each subchapter
        for (let j = 0; j < gStructureSub[i].length; j++)
            textAsync(structureChaptId(i, j) + '_text', txtBodytextIn.value, gStructureSub[i][j], gStructure, txtContentsOut.value
                , () => generate_progress('Text for ' + gStructureSub[i][j] + ' done'), null, 2000, structureStopAfter(i, j));
}
function picturedescriptionAsyncAll() {
    generate_progress('Producing image descriptions with GPT-3...', 1);
    for (let i = 0; i < gStructureCh.length; i++)
        picturedescriptionAsync(structureChaptId(i) + '_imagetext', txtImageIn.value, gStructureCh[i], document.getElementById(structureChaptId(i) + '_text').innerHTML,
            (cId) => { generate_progress('Imagetext for ' + gStructureCh[i] + ' done'); }); // picturedescriptionAsync
}
function pictureAsyncAll() {
    generate_progress('Producing images with GPT-3...', 1);
    for (let i = 0; i < gStructureCh.length; i++)
        pictureAsync(structureChaptId(i) + '_image', document.getElementById(structureChaptId(i) + '_imagetext').innerHTML, () => { // image alt-text
            generate_progress('Image for ' + gStructureCh[i] + ' done')
        }); // pictureAsync
}
//*/

document.write("<div class=\"debug\">End of Code for load and visibility...</div>");
