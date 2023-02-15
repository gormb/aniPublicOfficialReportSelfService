document.write("<div class=\"debug\">Code for structure...</div>");
// Kapittelstruktur - Kapitler og underkapitler basert på innholdet
// Eksempel: Kapittelstruktur med Kapittel 1 - 3 deretter Underkapittel 1a - 3g for:
async function structureAsync(structuring, inTxt, callback, maxTokens) {
    oaiValAsync(structuring + "\n" + inTxt, 0, (gptOut) =>
    {
        let ChSub = structureAsChSub(gptOut);
        callback(ChSub[0], ChSub[1], gptOut);
    }, maxTokens);
}
function structureVisChOrSub(s) { 
    return s.replace(/.*:/, "").trim();
}
function structureAsChSub(gptOut){
    let abcd = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
    let structureCh = []; 
    let structureSub = [[]]; 
    let ch = gptOut.split("\nKapittel ");
    for (let i = 0; i < ch.length; i++) {
        subp = ch[i].trim().split("\n"); // (remove until after first colon, ) split in lines
        //if (subp.length < 2) continue; // Chapter without subchapters?
        //res += subp[0];
        structureCh.push(subp[0]);
        structureSub.push([]);
        for (let j = 1; j < subp.length; j++)
            structureSub[i].push(subp[j].trim());
    }
    return [structureCh, structureSub];
}
function structureAsHtml(structure) {
    let res = "<ul>";
    let ChSub = structureAsChSub(structure);
    let structureCh = ChSub[0]; 
    let structureSub = ChSub[1]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
    for (let i = 0; i < structureCh.length && i < structureSub.length; i++) {
        res += "<li>" + (i < structureCh.length ? structureCh[i] : "?") + "<ul>";
        if (i < structureSub.length)
            for (let j = 0; j < structureSub[i].length; j++)
                res += "<li>" + structureSub[i][j] + "</li>";
        res += "</ul></li>";
    }
    res += "</ul>"
    return res;
} //alert(structureAsHtml('Kapittel 1: Hvilke arter kan fiskes om vinteren?' + '\nUnderkapittel 1a: Sjøørret' + '\nUnderkapittel 1b: Torsk' + '\nUnderkapittel 1c: Fjære' + '\nUnderkapittel 1d: Lyr' + '\nUnderkapittel 1e: Sei' + '\n' + '\nKapittel 2: Artsfiske' + '\nUnderkapittel 2a: Spesialisering' + '\nUnderkapittel 2b: Metoder' + '\nUnderkapittel 2c: Forsiktighet' + '\n' + '\nKapittel 3: Konklusjon' + '\nUnderkapittel 3a: Fordeler' + '\nUnderkapittel 3b: Ulemper' + '\nUnderkapittel 3c: Miljøhensyn' + '\nUnderkapittel 3d: Utstyr' + '\nUnderkapittel 3e: Regler og lover' + '\nUnderkapittel 3f: Tips og triks' + '\nUnderkapittel 3g: Oppsummering'));

document.write("<div class=\"debug\">End of Code for structure.</div>");
