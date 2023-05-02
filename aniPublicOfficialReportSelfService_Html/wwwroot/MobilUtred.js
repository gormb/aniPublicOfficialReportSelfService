
let urlQ = new URLSearchParams(window.location.search);
let tRotate = "&#8634;";
let tRotating = "<div class='rotating' style='height: 18px; width: 10px; animation: rotate 2s linear infinite;'>&#8634<div>";
function l() {
    if (urlQ.get('openai_key') != null) gptId.value = urlQ.get('openai_key'); else Tech();
    document.getElementById('suLink').href = 'SelvbetjentUtredning.html' + window.location.search;
    // try { navigator.clipboard.readText().then((t) => {txtInnholdInn.value = t; }); } catch (e) { }
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
