let g_aktoerer = ["Regjeringen", "KS", "DFØ", "digdir", "Datatilsynet", "e-helse", "Miljødirektoratet", "DIGG"];
let g_regjeringen = ["Barne- og familiedepartementet", "Finansdepartementet", "Justisdepartementet", "KDD", "Kommunal- og distriktsdepartementet", "Kommunal- og moderniseringsdepartementet", "Kulturdepartementet", "Landbruks- og matdepartementet", "Nærings- og fiskeridepartementet", "Olje- og energidepartementet", "Utenriksdepartementet", "Helse- og omsorgsdepartementet", "Kirkedepartementet", "Barne-, likestillings- og inkluderingsdepartementet", "Klima- og miljødepartementet", "Utdannings- og forskningsdepartementet"];
let urlQ = new URLSearchParams(window.location.search);
let tRotate = "&#8634;";
let tRotating = "<div class='rotating' style='height: 18px; width: 10px; animation: rotate 2s linear infinite;'>&#8634<div>";

function l() {
    if (urlQ.get('openai_key') != null) gptId.value = urlQ.get('openai_key'); else Tech();
    document.getElementById('suLink').href = 'SelvbetjentUtredning.html' + window.location.search;
    // try { navigator.clipboard.readText().then((t) => {txtInnholdInn.value = t; }); } catch (e) { }
    try { tabReset(tabKompAkt, ['Aktør', 'Vurdering', 'Innsikt', 'Vekt'], 1); } catch (e) { }
    // Debug/dev
    Dispos();
    setChapters(1);
    Innhol();
}
let zIndexCurrent = 1, sClass = '.meny', sActive = sMeny = 0, sTech=1, sTema=2, sDeltag=3, sDispos=4, sInnhol=5, sDistrib=6;
function ActSect(sect, sTitle) {
    if (sActive != sect) {
        document.getElementById('sectTitle').innerText = sTitle;
        zIndexCurrent++; // (100..2^31)
        sActive = sect;
        if (sect == sMeny) sClass = '.meny';
        else if (sect == sTech) sClass = '.tech';
        else if (sect == sTema) sClass = '.tema';
        else if (sect == sDeltag) sClass = '.deltag';
        else if (sect == sDispos) sClass = '.dispos';
        else if (sect == sInnhol) sClass = '.innhol';
        else if (sect == sDistrib) sClass = '.distrib';
        document.querySelectorAll(sClass).forEach(function (el) { el.style.zIndex = zIndexCurrent; });
    }
}
function Meny() { ActSect(sMeny, '.MENY'); }
function Tech() { ActSect(sTech, '.TECH'); }
function Tema() { ActSect(sTema, '.TEMA'); }
function Deltag() { ActSect(sDeltag, '.DELTAG'); }
function Dispos() { ActSect(sDispos, '.DISPOS'); }
function Innhol() { ActSect(sInnhol, '.INNHOL'); }
function Distrib() { ActSect(sDistrib, '.DISTRIB'); }

//////////////////////////////////////////////////////////////////
// Open AI
function oaiJson(sSrc, isImage, maxTokens, stopArray) {
    if (isImage==null) isImage=0;
    let stopTag="";
    if (stopArray != null)
        if (stopArray.length > 0) { // ; // ,"stop": ["stopp her", "stopp ellers her"]
            stopTag = ',"stop": ["' + stopArray[0] + '"';
            for (let i = 1; i < stopArray.length; i++)
                stopTag += ',"' + stopArray[i] + '"';
            stopTag += ']';
        }
    return (isImage == 1) ? `{"prompt":${JSON.stringify(sSrc)},"n":1,"size":"256x256","response_format":"url"}`
        : `{"model":"${document.querySelector('input[name="gptAlg"]:checked').value}","prompt":${JSON.stringify(sSrc)},"temperature":0.7,"max_tokens":${maxTokens == null ? 1000 : maxTokens},"top_p":1,"frequency_penalty":0.75,"presence_penalty":0`+stopTag+`}`;
}
function oaiReq(url) {
    let req = new XMLHttpRequest();
    req.open("POST", url != null ? url : "https://api.openai.com/v1/completions");
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", "Bearer " + gptId.value);
    return req;
}    
function oaiReqDaE() { return oaiReq("https://api.openai.com/v1/images/generations");}
function oaiReqGpt() { return oaiReq("https://api.openai.com/v1/completions");}
async function oaiHtmlItemAsync(cDest, sSrc, isImage, doneC, errC, maxTokens, stopArray) {
    if (isImage == null) isImage = 0;
    let xhr = isImage == 1 ? oaiReqDaE() : oaiReqGpt();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4)
            if (xhr.status == 200) {
                var json = JSON.parse(xhr.responseText);
                if (isImage == 1) cDest.src=json.data[0].url; // url for image
                else if (cDest.value != null) cDest.value = json.choices[0].text;
                else cDest.innerHTML = json.choices[0].text; // text returned onto textarea (or other with value)
                if (doneC != null) doneC(cDest);
            }
            else {
                let errT = "error";
                try { errT = JSON.parse(xhr.responseText).error.message; } catch (e) { errT = xhr.status + " " + xhr.text }
                if (errC != null) errC(errT);
                else console.log(errT);
            }
    }
    xhr.send(oaiJson(sSrc, isImage, maxTokens, stopArray));
}

async function oaiValAsync(sSrc, isImage, doneC, errC, maxTokens, stopArray) {
    if (isImage == null) isImage = 0;
    let xhr = isImage == 1 ? oaiReqDaE() : oaiReqGpt();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4)
            if (xhr.status == 200)
                doneC((isImage != 0)
                    ? JSON.parse(xhr.responseText).data[0].url
                    : JSON.parse(xhr.responseText).choices[0].text);
            else {
                let errT = "feil";
                try { errT = JSON.parse(xhr.responseText).error.message; } catch (e) { errT = "Feil (tilkoblet?)"; }
                if (errC != null) errC(errT);
                else console.log(errT);
            }
    }
    xhr.send(oaiJson(sSrc, isImage, maxTokens, stopArray));
} 

/////////////////////////////////////////////////////////////////////777
// tab

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
            row += "<td>" + (iCol == colIndex ? values[iRow] : "") + "</td>";
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
        for (let iRow = 1; iRow < cTab.rows.length - 1; iRow += 2) {
            let kompetanse = cTab.rows[iRow].cells[colKompetanse].innerHTML;
            let gptIn = aktoerQ.replace('*', kompetanse);
            cTab.rows[iRow].cells[colVurdering].innerHTML = tRotating;
            oaiValAsync(gptIn, 0, (aktoerResp) => {
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
    }, (repError) => {
        cTab.rows[1].cells[colKompetanse].innerHTML = repError;
        cTab.rows[1].cells[colVurdering].innerHTML = repError;
        cTab.rows[1].cells[colAktoer].innerHTML = "Ingen";
        cTab.rows[1].cells[colVekt].innerHTML = "100";
    }, maxTokens, stopArray);
}

async function structureAsync(structuring, inTxt, doneC, errC, maxTokens, stopArray) {
    oaiValAsync(structuring + "\n" + inTxt, 0, (gptOut) => {
        let ChSub = structureAsChSub(gptOut);
        doneC(ChSub[0], ChSub[1], gptOut);
    }, errC, maxTokens, stopArray);
}

//////////////////////////////////////////////////
// chapter

let structureCh = [];
let structureSub = [[]];
let ChSub = [structureCh, structureSub];

function structureAsChSub(gptOut) {
    structureCh = [];
    structureSub = [[]];
    let chSub = gptOut.replace('\t', '\n').split("\n");
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
    ChSub = [structureCh, structureSub];
    return ChSub;
}

function structureChaptId(iC, iS) { return 'chapt' + (iC == null ? '' : '_' + iC) + (iS == null ? '' : '_' + iS);}

function structureAsHtmlItem(ch, iC, iS) { return res = '<a href="#' + structureChaptId(iC, iS) + '">' + ch.replace(/.*:/, "").trim() + '</a>';}

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
    return res + "</ul>";
} 

function setChapters(gpt) {
    let gptOut = '\n\nKapittel 1: Fiskearter\nUnderkapittel 1a: Sjøørret\nUnderkapittel 1b: Torsk\nUnderkapittel 1c: Lyr og sei\n\nKapittel 2: Artsfiske og fiskemetoder \nUnderkapittel 2a: Spesialiserte fiskemetoder \nUnderkapittel 2b: Forsiktighet når man fisker';
    tabChapt.innerHTML = '<tr><td  class="product_active">' + structureAsHtml(gptOut) + '</td></tr>';
    tabContent.innerHTML = generateAll_ContentTableBlank();
}

function setChaptersError(err) {
    tabChapt.innerHTML = '<tr><td  class="product_active">' + err + '</td></tr>';
}

//////////////////////////////////////////////////////////////////
// Content

//let structureCh = [];
//let structureSub = [[]];
//let ChSub = [structureCh, structureSub];

let srcBlankImg = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"

function htmlChaptTxtRefresh(iC) { return '<button class="editControl" onclick="introAsync(\'chapt_' + iC + '_tekst\', txtInnledningInn.value, gStructureCh[' + iC + '], gStructure, txtInnholdUt.value,null,null,null,structureStopAfter(' + iC + '))">innledning ' + tRotate + '</button>'; }
function htmlSubchaptTxtRefresh(iC, iS) { return '<button class="editControl" onclick="textAsync(\'chapt_' + iC + '_' + iS + '_tekst\', txtBroedtekstInn.value, gStructureSub[' + iC + '][' + iS + '], gStructure, txtInnholdUt.value, null, null, null, structureStopAfter(' + iC + ',' + iS + '))">innhold ' + tRotate + '</button>'; }
function htmlImgTxtRefresh(iC, txt) { return '<button class="editControl" onclick="picturedescriptionAsync(\'chapt_' + iC + '_bildetekst\', txtBildeInn.value, gStructureCh[' + iC + '], chapt_' + iC + '_tekst.innerHTML, (cId) => {/*alert(cId.innerHTML);*/ })">utgangspunkt for bilde ' + tRotate + '</button>'; }
function htmlImgRefresh(iC) { return '<button class="editControl" onclick="pictureAsync(\'chapt_' + iC + '_bilde\', chapt_' + iC + '_bildetekst.innerHTML)">bilde ' + tRotate + '</button>'; }

function generateAll_ContentTableBlank() {
    let res = '';// '<tr><td id="' + structureChaptId() +'">genererer innhold...</td></tr>';
    for (let i = 0; i < structureCh.length && i < structureSub.length; i++) {
        res += '<tr><td id="' + structureChaptId(i) + '" class="product_active">'
            + '<center><img width="200" height="200" id="' + structureChaptId(i) + '_bilde" src="' + srcBlankImg +'" onclick="window.speechSynthesis.speak(new SpeechSynthesisUtterance(' + structureChaptId(i) + '_bildetekst.innerHTML));"/></center>'
            + htmlImgRefresh(i)
            + '<div class="editControl" id="' + structureChaptId(i) + '_bildetekst" class="imagetext">' + structureAsHtmlItem(structureCh[i]) + '...</div>'
            + htmlImgTxtRefresh(i, structureChaptId(i) + '_bildetekst')
            + '<h2 class="product_active">' + structureAsHtmlItem(structureCh[i]) + '</h2>'
            + '<span id="' + structureChaptId(i) + '_tekst">kapitteltekst...</span>'
            + htmlChaptTxtRefresh(i)
            + "</td></tr>";
        for (let j = 0; j < structureSub[i].length; j++)
            res += '<tr><td class="product_active">'
                + '<h4 id="' + structureChaptId(i, j) + '" class="product_active">' + structureAsHtmlItem(structureSub[i][j]) + "</h4>"
                + '<span id="' + structureChaptId(i, j) + '_tekst">underkapitteltekst...</span>'
                + htmlSubchaptTxtRefresh(i, j)
                + "</td ></tr >";
    }
    return res;
}

//////////////////////////////////////////
// text, picturedesc, picture

async function pictureAsync(scDest, inTxt, doneC, errC) {
    document.getElementById(scDest).src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D";
    return oaiHtmlItemAsync(document.getElementById(scDest), inTxt, 1, (imgId) => {
        imgId.alt = inTxt;
        imgId.title = inTxt;
        if (doneC != null)
            doneC(imgId);
    }, errC);
}
