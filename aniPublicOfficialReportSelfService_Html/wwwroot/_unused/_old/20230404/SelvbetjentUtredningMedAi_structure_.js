document.write("<div class=\"debug\">Code for structure...</div>");
// Kapittelstruktur - Kapitler og underkapitler basert på innholdet
// Eksempel: Kapittelstruktur med Kapittel 1 - 3 deretter Underkapittel 1a - 3g for:
async function structureAsync(structuring, inTxt, doneC, errC, maxTokens, stopArray) {
    oaiValAsync(structuring + "\n" + inTxt, 0, (gptOut) =>
    {
        let ChSub = structureAsChSub(gptOut);
        doneC(ChSub[0], ChSub[1], gptOut);
    }, errC, maxTokens, stopArray);
}
function structureStopAfter(iC, iS) {
    let res = [];
    if (iS == null) { // chapter; next chapter or first subchapter
        res = ['Kapittel ' + (iC + 2), 'Underkapittel ' + (iC + 1) + 'a'];
    }
    else { // subchapter; next subchapter or chapter
        res = ['Kapittel ' + (iC + 2), 'Underkapittel ' + (iC + 1) + String.fromCharCode('b'.charCodeAt(0)+iS)];
    }
    return res;
}
function structureAsChSub(gptOut){
    let chSub = gptOut.replace('\t', '\n').split("\n");
    let structureCh = [];
    let structureSub = [[]]; 
    let nCh = 0;
    for (let i = 0; i < chSub.length; i++) {
        let chSubN = chSub[i].trim();
        if (chSubN.length > 10)
            if (chSubN.substring(0, "Kapittel".length) == "Kapittel") {
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
