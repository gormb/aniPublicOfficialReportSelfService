document.write("<div class=\"debug\">Code for generate...</div>");

function s(comment, progress) {
    progressBar.value = progress;
    progresssText.innerHTML = comment;
}

let gStructure = "Kapittel 1: En tull\nUnderkapittel 1a: Tull for det første\nUnderkapittel 1b: Videre om tull\nKapittel 2: Tøys to\nUnderkapittel 2a: Hva vi mener med tøys\nUnderkapittel 2b: Tøys i historien\nUnderkapittel 2c: Hvordan komme i gang med tøys";
let gStructureCh = ["Kapittel 1: En tull", "Kapittel 2: Tøys to"]; 
let gStructureSub = [["Underkapittel 1a: Tull for det første", "Underkapittel 1b: Videre om tull"], ["Underkapittel 2a: Hva vi mener med tøys", "Underkapittel 2b: Tøys i historien", "Underkapittel 2c: Hvordan komme i gang med tøys"]]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
let gIntroCh = ["Det handler i kap 1 om tull.", "Tøys er tema for kap 2 innholdet."];
let gPictureTextCh = ["[Bilde: En tull med bakgrunn", "[Bilde: Tøys to  med bakgrunn"]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
let gPictureUrlCh = ["file:///C:/data/HAL9000.png", "file:///C:/data/HAL9000.png"]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
let gTextSub = [["Mange enes om at tull er best, og kanskje bedre enn tøys.", "Vi kan godt være enig om at dette er tull."], ["Vi skiller mellom tøys og tull i denne teksten, viktig at tøys får sin plass.", "Tøysete med historie kan man mene. Det kan man.", "Du er allerede i gang. Tøysete å lese dette. Lykke til videre."]]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];

function generateAll(overviewTable, contentTable){
    let res = "!", resKapitler = "", resInnhold= "";
    overviewTable.innerHTML = "<tr><td>generating overview/index...</td></tr>";
    contentTable.innerHTML = "<tr><td>generating body/content...</td></tr>";
    gStructureCh = gIntroCh = gPictureTextCh = gPictureUrlCh = []; 
    gStructureSub = gTextSub = [[]];

    s('Produserer kapitler og underkapitler med GPT-3...', 5);
    let sKapittelStrukturer = txtKapittelstrukturInn.value;
    let sInnhold = txtInnholdUt.value;
    structureAsync(sKapittelStrukturer, sInnhold, (ch, sub, sStructure) => 
    { // When structure done, show, get intro and image for each chapter, get text for each subchapter
        gStructureCh = ch; gStructureSub = sub; gStructure = txtKapittelstrukturUt.value = sStructure; // save resulting chapters and subchapters
        for (let i = 0; i < gStructureCh.length && i < gStructureSub.length; i++)
        { // Get intro and image for chapter, get text for each subchapter
            if (i < gStructureCh.length) { // for each chapter create intro, image and subchapters
                resKapitler += "<tr><td colspan=\"2\">" + structureVisChOrSub(gStructureCh[i]) + "</td></tr>";
                resInnhold += "<i id=\"kapittelBildeText" + i + "\">" + gStructureCh[i] + "...</i>";
                s('Produser ' + gStructureCh[i] + ' innledning med GPT-3...', 10 + (i * 30) / gStructureCh.length); // 10-39
                // Get chapter text description with GPT-3
                //picturedescriptionAsync(txtKapittelstrukturUt.value, txtBildeInn.value, txtInnholdUt.value, gStructureCh[i]);
                resInnhold += "<h2>" + gStructureCh[i] + "</h2>";
                resInnhold += '<div id="kapittelIntro' + i + '">intro...</div>';
                // Get chapter intro with GPT-3
                //intro(txtKapittelstrukturUt.value, txtInnledningInn.value, txtInnholdUt.value, gStructureCh[i]);
            }
            // for each subchapter create text
            if (i < gStructureSub.length)
                for (let j = 0; j < gStructureSub[i].length; j++) {
                    resKapitler += "<tr><td></td><td>" + structureVisChOrSub(gStructureSub[i][j]) + "</td></tr>";
                    res += "<h4>" + gStructureSub[i][j] + "</h4>" + text(txtKapittelstrukturUt.value, txtBroedtekstInn.value, txtInnholdUt.value, gStructureSub[i][j]);
                }
            res += "<hr />";
        }
        overviewTable.innerHTML = resKapitler;
        contentTable.innerHTML = resInnhold;
    }, 3000); // 3000 items for structure
    //}
    //catch (ex) {
    //    res += "<br/>" + ex.message
    //}
    return res.replace("\n", "<br/>");
}

document.write("<div class=\"debug\">End of Code for generate.</div>");
