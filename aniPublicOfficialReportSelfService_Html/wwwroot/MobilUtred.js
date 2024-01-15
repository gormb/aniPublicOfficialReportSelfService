let urlQ = new URLSearchParams(window.location.search);
let srcBlankImg = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"
let tRotate = "&#8634;";
let tRotating = "<div class='rotating' style='height: 18px; width: 10px; animation: rotate 2s linear infinite;'>&#8634<div>";
let structure = "1. Chapt\n1a. Sub Chapt\n2.Another Chapt";
let structureCh = [];
let structureSub = [[]];
let ChSub = [structureCh, structureSub];

function l() {
    if (urlQ.get('openai_key') != null) gptId.value = urlQ.get('openai_key'); else Tech();
    document.getElementById('suLink').href = 'SelvbetjentUtredning.html' + window.location.search;
    // try { navigator.clipboard.readText().then((t) => {txtInnhold.value = t; }); } catch (e) { }
    try { tabReset(tabKompAkt, ['Aktør', 'Vurdering', 'Innsikt', 'Vekt'], 1); } catch (e) { }
    // Debug/dev
    //Distrib();
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
        else if (sect == sDistrib) { sClass = '.distrib'; document.getElementById('tabPreview').innerHTML = document.getElementById('tabContent').innerHTML; }
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
   return (isImage == 1) ? `{"model":"dall-e-3","prompt":${JSON.stringify(sSrc)},"n":1,"size":"1024x1024","response_format":"url"}`
    //return (isImage == 1) ? `{"prompt":${JSON.stringify(sSrc)},"n":1,"size":"512x512","response_format":"url"}`
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
        structure = gptOut;
        let ChSub = structureAsChSub(gptOut);
        doneC(ChSub[0], ChSub[1], gptOut);
    }, errC, maxTokens, stopArray);
}

//////////////////////////////////////////////////
// chapter

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

function structureAsHtmlItem(ch, iC, iS) { return res = '<x href="#' + structureChaptId(iC, iS) + '">' + ch.replace(/.*:/, "").trim() + '</x>';}

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

function refChapts() { tabChapt.innerHTML = tabContent.innerHTML = "<tr><td>" + tRotating + "</td></tr>";}
function setChapters(gptOut) {
    tabChapt.innerHTML = '<tr><td class="product_active">' + structureAsHtml(gptOut) + '</td></tr>';
    tabContent.innerHTML = generateAll_ContentTableBlank();
}
function setChaptersError(err) { setChapters("\n\nKapittel 1: Error\nUnderkapittel 1a: <" + err + "\n\nKapittel 2: For feilmeldinger relatert API-nøkkel\nUnderkapittel 2a: Prøv TECH-menyen"); /*tabChapt.innerHTML = '<tr><td class="product_active">' + err + '</td></tr>';*/ }

//////////////////////////////////////////////////////////////////
// Content

function htmlChaptTxtRefresh(iC) { return '<button class="editControl" onclick="introAsync(\'chapt_' + iC + '_tekst\', txtInnledning.value, structureCh[' + iC + '], structure, txtInnhold.value,null,null,null,structureStopAfter(' + iC + '))">innledning ' + tRotate + '</button>'; }
function htmlSubchaptTxtRefresh(iC, iS) { return '<button class="editControl" onclick="textAsync(\'chapt_' + iC + '_' + iS + '_tekst\', txtBroedtekst.value, structureSub[' + iC + '][' + iS + '], structure, txtInnhold.value, null, null, null, structureStopAfter(' + iC + ',' + iS + '))">innhold ' + tRotate + '</button>'; }
function htmlImgTxtRefresh(iC, txt) { return '<button class="editControl" onclick="picturedescriptionAsync(\'chapt_' + iC + '_bildetekst\', txtBilde.value, structureCh[' + iC + '], chapt_' + iC + '_tekst.innerHTML, (cId) => {alert(cId.innerHTML); })">utgangspunkt for bilde ' + tRotate + '</button>'; }
function htmlImgRefresh(iC) { return '<button class="editControl" onclick="pictureAsync(\'chapt_' + iC + '_bilde\', chapt_' + iC + '_bildetekst.innerHTML)">bilde ' + tRotate + '</button>'; }

function intros() {}
function descrs() {}
function imgs() {}
function texts() {}

function structureStopAfter(iC, iS) {
    if (iS == null) return ['Kapittel ' + (iC + 2), 'Underkapittel ' + (iC + 1) + 'a']; // chapter; next chapter or first subchapter
    else return ['Kapittel ' + (iC + 2), 'Underkapittel ' + (iC + 1) + String.fromCharCode('b'.charCodeAt(0)+iS)]; // subchapter; next subchapter or chapter
}

function generateAll_ContentTableBlank() { /*document.getElementById("bintros").style.display = document.getElementById("bdescrs").style.display = document.getElementById("bimgs").style.display = document.getElementById("btexts").style.display = 'display';*/
    let res = '';
    for (let i = 0; i < structureCh.length && i < structureSub.length; i++) {
        res += '<tr><td id="' + structureChaptId(i) + '" class="product_active">'
            + '<center><img width="200" height="200" id="' + structureChaptId(i) + '_bilde" src="' + srcBlankImg +'" onclick="window.speechSynthesis.speak(new SpeechSynthesisUtterance(' + structureChaptId(i) + '_bildetekst.innerHTML));"/></center>'
            + htmlImgTxtRefresh(i, structureChaptId(i) + '_bildetekst')
            + htmlImgRefresh(i)
            + '<div class="editControl" id="' + structureChaptId(i) + '_bildetekst" class="imagetext">' + structureAsHtmlItem(structureCh[i]) + '...</div>'
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

//introAsync(\'chapt_' + iC + '_tekst\', txtInnledning.value, gStructureCh[' + iC + '], gStructure, txtInnhold.value,null,null,null,structureStopAfter(' + iC + '))
async function introAsync(scDest, introducing, chapter, structure, inTxt, doneC, errC, maxTokens, stopArray) {
    let cDest = document.getElementById(scDest);
    cDest.innerHTML = tRotating;
    let gptIn = inTxt + "\n" + structure + "\n" + introducing.replace("*", chapter)
    return oaiHtmlItemAsync(cDest, gptIn, 0, /*doneC*/ null, /*errC!=null ? errC :*/ (errT) => { cDest.innerHTML = errT; }, maxTokens, stopArray);
}

//textAsync(\'chapt_' + iC + '_' + iS + '_tekst\', txtBroedtekst.value, gStructureSub[' + iC + '][' + iS + '], gStructure, txtInnhold.value, null, null, null, structureStopAfter(' + iC + ',' + iS + '))
async function textAsync(scDest, texting, subchapter, structure, inTxt, doneC, errC, maxTokens, stopArray) {
    let cDest = document.getElementById(scDest);
    cDest.innerHTML = tRotating;
    let gptIn = inTxt + "\n\n" + structure + "\n\n" + texting.replace("*", subchapter);
    return oaiHtmlItemAsync(cDest, gptIn, 0, doneC, /*errC != null ? errC :*/ (errT) => { cDest.innerHTML = errT; }, maxTokens, stopArray);
}

//picturedescriptionAsync(\'chapt_' + iC + '_bildetekst\', txtBilde.value, gStructureCh[' + iC + '], chapt_' + iC + '_tekst.innerHTML/*, (cId) => {alert(cId.innerHTML);}*/)
async function picturedescriptionAsync(scDest, picturing, chapter, inTxt/*, doneC, errC, stopArray*/) {
    let cDest = document.getElementById(scDest);
    cDest.innerHTML = tRotating;
    let gptIn = inTxt + "\n\n" + chapter + "\n\n" + inTxt + "\n\n" + picturing;
    return oaiHtmlItemAsync(cDest, gptIn, 0, null/*doneC*/, (errT) => { cDest.innerHTML = errT; }, 256/*, stopArray*/);
}

//pictureAsync(\'chapt_' + iC + '_bilde\', chapt_' + iC + '_bildetekst.innerHTML)
async function pictureAsync(scDest, inTxt/*, doneC, errC*/) {
    document.getElementById(scDest).src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D";
    return oaiHtmlItemAsync(document.getElementById(scDest), inTxt, 1, (imgId) => {
        imgId.alt = inTxt;
        imgId.title = inTxt;
    //    if (doneC != null)
    //        doneC(imgId);
    }/*, errC*/);
}

/////////////////////////////////////////////////////////////
// batch's
function intros() { for (let i = 0; i < structureCh.length; i++) introAsync(structureChaptId(i) + '_tekst', txtInnledning.value, structureCh[i], structure, txtInnhold.value, null, null, 2000, structureStopAfter(i));}
function descrs() { for (let i = 0; i < structureCh.length; i++) picturedescriptionAsync(structureChaptId(i) + '_bildetekst', txtBilde.value, structureCh[i], document.getElementById(structureChaptId(i) + '_tekst').innerHTML);}
function imgs() { for (let i = 0; i < structureCh.length; i++) pictureAsync(structureChaptId(i) + '_bilde', document.getElementById(structureChaptId(i) + '_bildetekst').innerHTML); }
function texts() {
    for (let i = 0; i < structureCh.length && i < structureSub.length; i++)
        for (let j = 0; j < structureSub[i].length; j++)
            textAsync(structureChaptId(i, j) + '_tekst', txtBroedtekst.value, structureSub[i][j], structure, txtInnhold.value, null, null, 2000, structureStopAfter(i, j));
}

/////////////////////////////////////////////////////////////
// produser

function Produser(tit, print, close) {
    let w = screen.width, h = screen.height;
    var win = window.open("", tit, "location=no,toolbar=yes,left=" + w + ",top=0,width=" + w + ",height=" + h);
    // "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable = yes
    win.document.body.innerHTML = tabPreview.outerHTML;
    try { win.document.getElementById('overviewTable').outerHTML = ""; } catch (e) { } // delete left hand index
    try { win.document.querySelectorAll('button').forEach(button => { try { button.remove(); } catch (e) { } }); } catch (e) { } // delete buttons
    try { win.document.querySelectorAll('.editControl').forEach(button => { try { button.remove(); } catch (e) { } }); } catch (e) { } // delete all edit controls

    let stl = '<style>a{color:black;text-decoration:none;}'
        + 'th{background-color:lightblue;text-align:left;padding-left:9px;}'
        + 'td{vertical-align:top;padding:10px;}'
        + 'div.editControl{}';
    for (var i = 0; i < document.styleSheets[iStyleSheetSrc].cssRules.length; i++)
        stl += document.styleSheets[iStyleSheetSrc].cssRules[i].cssText.replace('_' + lastProd, '_active');
    stl += '</style>';

    win.document.head.innerHTML = '<meta charset="utf-8" /><title>' + tit + '</title>' + stl;
    if (print != null) win.print();
    if (close != null) win.close();
    return win.document.documentElement.outerHTML;
}