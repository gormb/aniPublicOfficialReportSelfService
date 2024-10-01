document.write("<div class=\"debug\">Code for product and analysis...</div>");
 
let g_actorer = ["Regjeringen", "KS", "DFØ", "digdir", "Datatilsynet", "e-helse", "Miljødirektoratet", "DIGG"];
let g_regjeringen = ["Barne- og familiedepartementet", "Finansdepartementet", "Justisdepartementet", "KDD", "Kommunal- og distriktsdepartementet", "Kommunal- og moderniseringsdepartementet", "Kulturdepartementet", "Landbruks- og matdepartementet", "Nærings- og fiskeridepartementet", "Olje- og energidepartementet", "Utenriksdepartementet", "Helse- og omsorgsdepartementet", "Kirkedepartementet", "Barne-, likestillings- og inkluderingsdepartementet", "Klima- og miljødepartementet", "Utdannings- og forskningsdepartementet"];

let lastProd = 'default';
function ProductbuttonPushed(p = 'default') {
    lastProd = p; // for later print
    // set styles with name 'product_*' til 'product_' + p
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
// Eksempel: "*\n\nList of the 10 most important themes:\n 1. "
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
function ActorFromEvaluation(vurdering) {
    let iAktors = g_actorer.findIndex(i => evaluation.toLowerCase().startsWith(i.toLowerCase()));
    if (iAktors != -1)
        return g_actorer[iAktors]; // starts with actor
    if (g_regjeringen.findIndex(i => evaluation.toLowerCase().startsWith(i.toLowerCase())))
        return g_actorer[0]; // starts with part of g_regjeringen
    iAktors = g_actorer.findIndex(i => evaluation.toLowerCase().contains(i.toLowerCase()));
    if (iAktors != -1) // contains actor
        return g_actorer[iAktors];
    if (g_regjeringen.findIndex(i => evaluation.toLowerCase().contains(i.toLowerCase())))
        return g_actorer[0]; // contains part of g_regjeringen

    let iPos = evaluation.search(/[^a-zA-ZÆØÅæøå -]/)
    if (iPos != -1)
        return evaluation.substring(0, iPos - 1);    
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
async function tabLoadAsync(cTab, inTxt, competencyQ, colCompetency, actorQ, colEvaluation, colActor, colWeight, cols, doneC, errC, maxTokens, stopArray) {
    tabReset(cTab, cols, 1);
    cTab.rows[1].cells[colCompetency].innerHTML = tRotating;
    let gptIn = competencyQ.replace('*', inTxt);
    oaiValAsync(gptIn, 0, (resp) => { // we got text
        let respLines = resp.split("\n").map((item) => item.replace(/^[^a-zæøåA-ZÆØÅ]+/, '')); // remove inital numbers, punctation and space from items
        tabSetCol(cTab, cols, colCompetency, respLines); // Create rows, populate col with results
        for (let iRow = 1; iRow < cTab.rows.length - 1; iRow+=2) {
            let competency = cTab.rows[iRow].cells[colCompetency].innerHTML;
            let gptIn = actorQ.replace('*', competency);
            cTab.rows[iRow].cells[colEvaluation].innerHTML = tRotating;
            oaiValAsync(gptIn, 0, (actorResp) =>
            {
                let actorRA = actorResp.split("2.");
                cTab.rows[iRow].cells[colEvaluation].innerHTML = actorRA[0];
                if (colWeight != null) cTab.rows[iRow].cells[colWeight].innerHTML = "7";
                if (colActor != null) cTab.rows[iRow].cells[colActor].innerHTML = ActorFromEvaluation(actorRA[0].trim());
                if (actorRA.length > 1) {
                    cTab.rows[iRow + 1].cells[colEvaluation].innerHTML = actorRA[1];
                    if (colWeight != null) cTab.rows[iRow + 1].cells[colWeight].innerHTML = "3";
                    if (colActor != null) cTab.rows[iRow + 1].cells[colActor].innerHTML = ActorFromEvaluation(actorRA[1].trim());
                }
            }, (actorRespErr) => { cTab.rows[iRow].cells[colEvaluation].innerHTML = actorRespErr; }, maxTokens, stopArray);
        }
        if (doneC != null) doneC(respLines);
    }, (repError) => { cTab.rows[1].cells[colCompetency].innerHTML = repError; }, maxTokens, stopArray);
}

document.write("<div class=\"debug\">End of Code for product and analysis.</div>");