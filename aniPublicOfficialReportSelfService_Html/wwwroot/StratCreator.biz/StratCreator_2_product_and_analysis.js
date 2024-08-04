document.write("<div class=\"debug\">Code for product and analysis...</div>");
 
let g_aktoerer = ["Regjeringen", "KS", "DFØ", "digdir", "Datatilsynet", "e-helse", "Miljødirektoratet", "DIGG"];
let g_regjeringen = ["Barne- og familiedepartementet", "Finansdepartementet", "Justisdepartementet", "KDD", "Kommunal- og distriktsdepartementet", "Kommunal- og moderniseringsdepartementet", "Kulturdepartementet", "Landbruks- og matdepartementet", "Nærings- og fiskeridepartementet", "Olje- og energidepartementet", "Utenriksdepartementet", "Helse- og omsorgsdepartementet", "Kirkedepartementet", "Barne-, likestillings- og inkluderingsdepartementet", "Klima- og miljødepartementet", "Utdannings- og forskningsdepartementet"];

let lastProd = 'default';
function ProductbuttonPushed(p = 'default') {
    lastProd = p; // for later print
    // sett styles med navn 'product_*' til 'product_' + p
    iStyleSheetSrc = StylesheetForStyleIndex('.product_active'.replace('_active', '_' + p));
    if (iStyleSheetDest == null)
        console.log('styleSheet with class .product_active ikke funnet!');
    else if (iStyleSheetSrc == null)
        console.log('styleSheet with class .product_' + p + ' ikke funnet!');
    else { // delete all _active styles, add from _p styles and rename to _active inside css-text
        while (document.styleSheets[iStyleSheetDest].cssRules.length > 0)
            document.styleSheets[iStyleSheetDest].deleteRule(0);
        for (var i = 0; i < document.styleSheets[iStyleSheetSrc].cssRules.length; i++)
            document.styleSheets[iStyleSheetDest].insertRule(document.styleSheets[iStyleSheetSrc].cssRules[i].cssText.replace('_' + p, '_active'), i);
    }
}
function LigatureExp(s) {
    return s.replace('oe', 'ø').replace('OE', 'Ø').replace('slash', '-');
}
function w_allProductbuttons() {
    let done = [];
    let lang = [];
    let prod = [[]];
    for (let i = 0; i < document.styleSheets.length; i++)
        try { // Only works for styles within document!!
            let sheet = document.styleSheets[i];
            for (let j = 0; j < sheet.cssRules.length; j++) {
                let t = sheet.cssRules[j].selectorText;
                if (t.includes('.product_') && !t.includes('.product_active')) {
                    let tID = t.split('.product_')[1];
                    if (!done.includes(tID)) {
                        done.push(tID);
                        let tIdLang = tID.substring(0, 2);
                        let tIdProd = tID.substring(2, tID.length);
                        let iLang = lang.indexOf(tIdLang);
                        if (iLang == -1) {
                            iLang = lang.length;
                            lang.push(tIdLang);
                            prod.push([]);
                        }
                        if (prod[iLang] != null)
                            prod[iLang].push(tIdProd);
                    }
                }
            }
        }
        catch (ex) { if (ex.name != 'SecurityError' && ex.name != 'TypeError') console.log(ex); }
    w('<table border="0">');
    for (let iLang = 0; iLang < lang.length; iLang++) {
        w('<tr>');
        for (let iProd = 0; iProd < prod[iLang].length; iProd++)
            w('<td onclick="ProductbuttonPushed(\'' + lang[iLang] + prod[iLang][iProd] + '\')" style="text-decoration:underline">' + LigatureExp(prod[iLang][iProd]) + '</td>');
        w('</tr>');
    }
    w('</table>');
    w('<button onclick="Show(idStyleButtons, 0)">skjul</button>');
}

// Table...
// Eksempel: "*\n\nListe over 10 viktigste momenter:\n 1. "
function tabSet(cTab, cells) {
    let colTitles = new Array();
    for (let iCol = 0; iCol < cTab.rows[0].cells.length; iCol++)
        colTitles.push(cTab.rows[0].cells[iCol].innerText);
    let res = "<tr><th>" + colTitles.join("</th><th>") + "</th></tr>";
    for (let iRow = 0; iRow < cells.length; iRow++)
        res += "<tr><td>" + cells[iRow].join("</td><td>") + "</td></tr>";
    cTab.innerHTML = res;
}
function tabReset(cTab, colTitles, rowCount) {
    cTab.innerHTML = "<tr><th>" + colTitles.join("</th><th>") + "</th></tr>"
        + ("<tr>" + "<td></td>".repeat(colTitles.length) + "</tr>").repeat(rowCount);
}
function tabSetCol(cTab, colTitles, colIndex, values) {
    let rows = "<tr><th>" + colTitles.join("</th><th>") + "</th></tr>";
    for (let iRow = 0; iRow < values.length; iRow++) {
        let row = "<tr>";
        for (let iCol = 0; iCol < cTab.rows[0].cells.length; iCol++)
            row += "<td>" + (iCol==colIndex?values[iRow]:"") + "</td>";
        row += "</tr>";
        rows += row.repeat(2);
    }
    cTab.innerHTML = rows;
}
function AktoerFraVurdering(vurdering) {
    let iAktoerer = g_aktoerer.findIndex(i => vurdering.toLowerCase().startsWith(i.toLowerCase()));
    if (iAktoerer != -1)
        return g_aktoerer[iAktoerer]; // starter med aktør
    if (g_regjeringen.findIndex(i => vurdering.toLowerCase().startsWith(i.toLowerCase())))
        return g_aktoerer[0]; // starter med del av g_regjeringen
    iAktoerer = g_aktoerer.findIndex(i => vurdering.toLowerCase().contains(i.toLowerCase()));
    if (iAktoerer != -1) // inneholder aktør
        return g_aktoerer[iAktoerer];
    if (g_regjeringen.findIndex(i => vurdering.toLowerCase().contains(i.toLowerCase())))
        return g_aktoerer[0]; // inneholder del av g_regjeringen

    let iPos = vurdering.search(/[^a-zA-ZÆØÅæøå -]/)
    if (iPos != -1)
        return vurdering.substring(0, iPos - 1);    
    return "";
}
function tabAggAndGroup(cTab, colGroup, colSort, colDrop) {
    let valWork = new Array();
    // Get all cells from table cTab into two-dimensional array valWork
    for (let irow = 1; irow < cTab.rows.length; irow++) {
        let valC = [];
        for (let cell of cTab.rows[irow].cells) valC.push(cell.innerText);
        valWork.push(valC);
    }
    // Group two-dimensional array valWork on content in column colGroup, sum values of all other column, replace colGroup-value with nothing in all other columns
    let sortTot = 0;
    for (let i = 0; i < valWork.length; i++) {
        for (let iComp = i + 1; iComp < valWork.length; iComp++) {
            if (valWork[i][colGroup] == valWork[iComp][colGroup]) { // Found row to append, do it and decrease iComp
                for (let j = 0; j < valWork[i].length; j++) {
                    if (j != colGroup) // Don't aggregate on 'group
                    {
                        if (!isNaN(valWork[i][j]) && !isNaN(valWork[iComp][j]))
                            valWork[i][j] = parseInt(valWork[i][j]) + parseInt(valWork[iComp][j]);
                        else
                            valWork[i][j] = (valWork[i][j] + "<br/>\n" + valWork[iComp][j]).replace(new RegExp(valWork[i][colGroup], "i"), "").replace(":", "");
                    }
                }
                valWork.splice(iComp, 1);
                iComp--;
            }
        }
    }
    valWork = valWork.sort((a, b) => { if (parseInt(a[colSort]) < parseInt(b[colSort])) return 1; else return -1; });
    tabSet(cTab, valWork);
    if (colDrop != null) for (let row of cTab.rows) row.deleteCell(colDrop);
}
async function tabLoadAsync(cTab, inTxt, kompetanseQ, colKompetanse, aktoerQ, colVurdering, colAktoer, colVekt, cols, doneC, errC, maxTokens, stopArray) {
    tabReset(cTab, cols, 1);
    cTab.rows[1].cells[colKompetanse].innerHTML = tRotating;
    let gptIn = kompetanseQ.replace('*', inTxt);
    oaiValAsync(gptIn, 0, (resp) => { // we got text
        let respLines = resp.split("\n").map((item) => item.replace(/^[^a-zæøåA-ZÆØÅ]+/, '')); // remove inital numbers, punctation and space from items
        tabSetCol(cTab, cols, colKompetanse, respLines); // Create rows, populate col with results
        for (let iRow = 1; iRow < cTab.rows.length - 1; iRow+=2) {
            let kompetanse = cTab.rows[iRow].cells[colKompetanse].innerHTML;
            let gptIn = aktoerQ.replace('*', kompetanse);
            cTab.rows[iRow].cells[colVurdering].innerHTML = tRotating;
            oaiValAsync(gptIn, 0, (aktoerResp) =>
            {
                let aktoerRA = aktoerResp.split("2.");
                cTab.rows[iRow].cells[colVurdering].innerHTML = aktoerRA[0];
                if (colVekt != null) cTab.rows[iRow].cells[colVekt].innerHTML = "7";
                if (colAktoer != null) cTab.rows[iRow].cells[colAktoer].innerHTML = AktoerFraVurdering(aktoerRA[0].trim());
                if (aktoerRA.length > 1) {
                    cTab.rows[iRow + 1].cells[colVurdering].innerHTML = aktoerRA[1];
                    if (colVekt != null) cTab.rows[iRow + 1].cells[colVekt].innerHTML = "3";
                    if (colAktoer != null) cTab.rows[iRow + 1].cells[colAktoer].innerHTML = AktoerFraVurdering(aktoerRA[1].trim());
                }
            }, (aktoerRespErr) => { cTab.rows[iRow].cells[colVurdering].innerHTML = aktoerRespErr; }, maxTokens, stopArray);
        }
        if (doneC != null) doneC(respLines);
    }, (repError) => { cTab.rows[1].cells[colKompetanse].innerHTML = repError; }, maxTokens, stopArray);
}

document.write("<div class=\"debug\">End of Code for product and analysis.</div>");