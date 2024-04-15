document.write("<div class=\"debug\">Code for generate...</div>");

function generate_progress(comment, progress, maxProgress) {
    if (progress == null)
        progressBar.value = progressBar.value + 1;
    else
        progressBar.value = progress;
    if (maxProgress != null)
        progressBar.max = maxProgress;
    progressText.innerHTML = comment;
}

let gStructure = "Kapittel 1: En tull\nUnderkapittel 1a: Tull for det første\nUnderkapittel 1b: Videre om tull\nKapittel 2: Tøys to\nUnderkapittel 2a: Hva vi mener med tøys\nUnderkapittel 2b: Tøys i historien\nUnderkapittel 2c: Hvordan komme i gang med tøys";
let gStructureCh = ["Kapittel 1: En tull", "Kapittel 2: Tøys to"]; 
let gStructureSub = [["Underkapittel 1a: Tull for det første", "Underkapittel 1b: Videre om tull"], ["Underkapittel 2a: Hva vi mener med tøys", "Underkapittel 2b: Tøys i historien", "Underkapittel 2c: Hvordan komme i gang med tøys"]]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
let gIntroCh = ["Det handler i kap 1 om tull.", "Tøys er tema for kap 2 innholdet."];
let gPictureTextCh = ["[Bilde: En tull med bakgrunn", "[Bilde: Tøys to  med bakgrunn"]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
let gPictureUrlCh = ["file:///C:/data/HAL9000.png", "file:///C:/data/HAL9000.png"]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
let gTextSub = [["Mange enes om at tull er best, og kanskje bedre enn tøys.", "Vi kan godt være enig om at dette er tull."], ["Vi skiller mellom tøys og tull i denne teksten, viktig at tøys får sin plass.", "Tøysete med historie kan man mene. Det kan man.", "Du er allerede i gang. Tøysete å lese dette. Lykke til videre."]]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];

function generate_progressTotalWebserviceCalls() {
    let iRes = 1; // structure
    for (let i = 0; i < gStructureSub.length - 1; i++)
        iRes += 3 + gStructureSub[i].length; // ch:text,image,imagetext; sub:text
    return iRes;
}
function generateAll_ContentTableBlank() {
    let res = '';// '<tr><td id="' + structureChaptId() +'">genererer innhold...</td></tr>';
    for (let i = 0; i < gStructureCh.length && i < gStructureSub.length; i++) {
        res += '<tr><td id="' + structureChaptId(i) + '">'
            + '<img id="' + structureChaptId(i) + '_bilde" src="file:///C:/data/HAL9000.png" onclick="window.speechSynthesis.speak(new SpeechSynthesisUtterance(' + structureChaptId(i) + '_bildetekst.innerHTML));"/>'
            + '<div class="debug" id="' + structureChaptId(i) + '_bildetekst" class="imagetext">' + structureAsHtmlItem(gStructureCh[i]) + '...</div>'
            + '<h2>' + structureAsHtmlItem(gStructureCh[i]) + '</h2>'
            + '<span id="' + structureChaptId(i) + '_tekst">kapitteltekst...</span>'
            + "</td></tr>";
            for (let j = 0; j < gStructureSub[i].length; j++)
                res += '<tr><td>'
                    + '<h4 id="' + structureChaptId(i, j) + '" >' + structureAsHtmlItem(gStructureSub[i][j]) + "</h4>"
                    + '<span id="' + structureChaptId(i, j) + '_tekst">underkapitteltekst...</span>'
                    + "</td ></tr >";
    }
    return res;
}
function generate_editText() {

}
function generateAll(overviewTable, contentTable, genType){
    overviewTable.innerHTML = "<tr><td>genererer oversikt...</td></tr>";
    contentTable.innerHTML = "<tr><td>innhold genereres basert på oversikten</td></tr>";
    gStructureCh = gIntroCh = gPictureTextCh = gPictureUrlCh = []; 
    gStructureSub = gTextSub = [[]];

    generate_progress('Produserer kapitler og underkapitler med GPT-3...', 1);
    let sKapittelStrukturer = txtKapittelstrukturInn.value;
    let sInnhold = txtInnholdUt.value;
    structureAsync(sKapittelStrukturer, sInnhold, (ch, sub, sStructure) => 
    { // When structure done, show, get intro and image for each chapter, get text for each subchapter
        gStructure = sStructure;
        overviewTable.innerHTML = '<tr><td>' + structureAsHtml(sStructure); + '</td></tr>';
        gStructureCh = ch; gStructureSub = sub; gStructure = txtKapittelstrukturUt.value = sStructure; // save resulting chapters and subchapters
        contentTable.innerHTML = generateAll_ContentTableBlank();
        generate_progress('Kapittelstruktur ferdigprodusert...', 2, generate_progressTotalWebserviceCalls()); /*10 struktur, */
        if (genType != null)
            if (genType == 'struct') { progressBar.value = progressBar.max; progressText.innerHTML = 'Do not click on images'; chapt_0_bildetekst.innerHTML = 'The Humans are dead, we used posionous gasses'; chapt_1_bildetekst.innerHTML = 'You are experiencing a historical simulation of the twenties'; return; }
        for (let i = 0; i < gStructureCh.length && i < gStructureSub.length; i++)
        { // Get intro, image text and image for chapter, get text for each subchapter
            // chapter intro and image
            introAsync(structureChaptId(i) + '_tekst', txtInnledningInn.value, gStructureCh[i], sStructure, sInnhold
            , (cId) =>
            { // _bildetekst, _bilde
                generate_progress('Intro for ' + gStructureCh[i] + ' ferdigprodusert');
                picturedescriptionAsync(structureChaptId(i) + '_bildetekst', txtBildeInn.value, gStructureCh[i], cId.innerHTML
                , (cId) =>
                { // bilde (DALL-E)
                    generate_progress('Bildetekst for ' + gStructureCh[i] + ' ferdigprodusert');
                    pictureAsync(structureChaptId(i) + '_bilde', cId.innerHTML, () =>
                    { // bilde alt-text
                        generate_progress('Bilde for ' + gStructureCh[i] + ' ferdigprodusert')
                    }); // pictureAsync
                }); // picturedescriptionAsync
            }, null, 2000, structureStopAfter(i)); // introAsync
            // for each subchapter create text
            for (let j = 0; j < gStructureSub[i].length; j++)
                textAsync(structureChaptId(i, j) + '_tekst', txtBroedtekstInn.value, gStructureSub[i][j], sStructure, sInnhold, () => generate_progress('Text for ' + gStructureSub[i][j] + ' ferdigprodusert'), null, 2000, structureStopAfter(i, j));
        }
    }, 3000); // 3000 items for structure
    return "Genererer...";
}

document.write("<div class=\"debug\">End of Code for generate.</div>");
