document.write("<div class=\"debug\">Code for structure...</div>");

// Kapittelstruktur - Kapitler og underkapitler basert på innholdet
// Eksempel: Kapittelstruktur med Kapittel 1 - 3 deretter Underkapittel 1a - 3g for:

// Using class
async function structureAsync(structuring, inTxt, doneC, errC, maxTokens, stopArray) {
    AI_Factory(0).valAsync(structuring + "\n" + inTxt, (gptOut) =>
    {
        let ChSub = structureAsChSub(gptOut);
        doneC(ChSub[0], ChSub[1], gptOut);
    }
    , errC, maxTokens, stopArray);
}
// Using func
//async function structureAsync(structuring, inTxt, doneC, errC, maxTokens, stopArray) {
//    oaiValAsync(structuring + "\n" + inTxt, 0, (gptOut) =>
//    {
//        //let gptOut = "**Målsettinger for livets fremskritt\n\nKapittel 1: Introduktion\n\n1a. What er meteorologien?\n1b. Historisk kortlæggelse af meteorologiens udvikling\n\n\n**Kapittel 2: Jordensatmosphère**\n\n2a. Atmosfære og synlig luftkvalitet\n2b. Meteorologiske processer i luften, herunder vind, temperatur og tryk\n\n**Kapittel 3: Livets fremskritt**\n\n3a. Miljøreferencer og -processer\n3b. Jordens økosystem – et komplekstnetzværk af organismer\n\n\n**Kapittel 4: Meteorologiens historie**\n\n4a. Fra de tidlige meteorologiske opdagelser til nuværende dage\n4b. Meteorologisk udvikling i forskellige lande\n\n**Kapittel 5: Miljø og livets fremtid**\n\n5a. Jordens klima – en overvågningslig proces\n5b. Forbedringer af synlighed og teknologi – bidrag til at forbedre ourlivets kvalitet";
//        let ChSub = structureAsChSub(gptOut);
//        doneC(ChSub[0], ChSub[1], gptOut);
//    , errC, maxTokens, stopArray);
//}


function structureStopAfter(iC, iS) {
    let res = [];
    if (iS == null) { // chapter; next chapter or first subchapter
        res = ['Kapittel ' + (iC + 2)
            , 'Underkapittel ' + (iC + 1) + 'a'
            , '' + (iC + 1) + 'a) '];
    }
    else { // subchapter; next subchapter or chapter
        res = ['Kapittel ' + (iC + 2)
            , 'Underkapittel ' + (iC + 1) + String.fromCharCode('b'.charCodeAt(0)+iS)
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
            if (chSubN.substring(0, "Kapittel".length) == "Kapittel" || chSubN.substring(0, "**".length) == "**") {
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
} //alert(structureAsHtml('Kapittel 1: Hvilke arter kan fiskes om vinteren?' + '\nUnderkapittel 1a: Sjøørret' + '\nUnderkapittel 1b: Torsk' + '\nUnderkapittel 1c: Fjære' + '\nUnderkapittel 1d: Lyr' + '\nUnderkapittel 1e: Sei' + '\n' + '\nKapittel 2: Artsfiske' + '\nUnderkapittel 2a: Spesialisering' + '\nUnderkapittel 2b: Metoder' + '\nUnderkapittel 2c: Forsiktighet' + '\n' + '\nKapittel 3: Konklusjon' + '\nUnderkapittel 3a: Fordeler' + '\nUnderkapittel 3b: Ulemper' + '\nUnderkapittel 3c: Miljøhensyn' + '\nUnderkapittel 3d: Utstyr' + '\nUnderkapittel 3e: Regler og lover' + '\nUnderkapittel 3f: Tips og triks' + '\nUnderkapittel 3g: Oppsummering'));

document.write("<div class=\"debug\">End of Code for structure.</div>");
