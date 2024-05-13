document.write("<div class=\"debug\">Code for load and parameters...</div>");

let uRLSearchParams = new URLSearchParams(location.search);
let tRotate = "&#8634;";
let tRotating = "<div class='rotating' style='height: 18px; width: 10px; animation: rotate 2s linear infinite;'>&#8634</div>";
let bGotValueFromUrl = uRLSearchParams.get('content') != null || uRLSearchParams.get('innhold') != null;
let parApi = parValGet('api', 'complete');
let parApiTextModel = parValGet('textmodel', parValGet('model', null));
let parApiTextJson = parValGet('textjson', parApi == 'complete' ? 'https://api.openai.com/v1/completions' : 'https://api.openai.com/v1/chat/completions');
let parApiTextKey = gunnarDec(uRLSearchParams.get('texthyggelig'));
let parApiImgJson = parValGet('imagejson', 'https://api.openai.com/v1/images/generations');
let parApiImgModel = parValGet('imagemodel','dall-e-2');
let parApiImgSize = parValGet('imagesize','1024x1024');

function l() {
    ShowCell(-1, -1, 'none'); // hide all
    try { document.getElementById('suLink').href = 'MobilUtred.html' + window.location.search; } catch (e) { }
    if (!parseParameters())
        try { if (!bGotValueFromUrl) navigator.clipboard.readText().then((t) => {txtInnholdInn.value = t; UpdateOutOrShowSamleButton(); }); } catch (e) { }
    UpdateOutOrShowSamleButton();
}
function gunnar(g) { return Array.from(g).map((c, i) => String.fromCharCode((c.charCodeAt() ^ 'gunnar'.charCodeAt(i % 6)) + 32)).join('');}
function gunnarEnc(g) { return encodeURIComponent(gunnar(g));}
function gunnarDec(g) { return gunnar(decodeURIComponent(g));}
function parValGet(p, defaul) {
    let v = uRLSearchParams.get(p);
    return (v == null) ? defaul : v;
}
function parValSet(p,v) { 
    uRLSearchParams.set(p, v);
    console.log(uRLSearchParams.toString());
    return '?' + uRLSearchParams.toString(); }
function gunnarHyggeligUrl(g) { return parValSet('texthyggelig', gunnarEnc(g));/*'?texthyggelig='+gunnarEnc(g);*/}
function parseParameters() { // return true if innhold=
    txtInnholdInn.value = parValGet('content', parValGet('innhold', txtInnholdInn.value));
    txtKapittelstrukturInn.value = parValGet('chapterstructure', parValGet('kapittelstruktur', txtKapittelstrukturInn.value));
    txtInnledningInn.value = parValGet('chapterintroduction', parValGet('kapittelinnledning', txtInnledningInn.value));
    txtBildeInn.value = parValGet('imagedescription', parValGet('bildebeskrivelse', txtBildeInn.value));
    txtBroedtekstInn.value = parValGet('subchapter', parValGet('underkapittel', txtBroedtekstInn.value));
    if (parApiTextModel != null) { // algorithm set in parameter; set gptAlg...
        //let inp = document.getElementsByTagName("gptAlg");
        radioGptAlgPar.checked = true;
        radioGptAlgPar.value = parApiTextModel;
        radioGptAlgPar.innerHTML = parApiTextModel;
    }
    if (parApiTextKey != null) {
        gptId.value = parApiTextKey;
        if (uRLSearchParams.get('produser') != null) setTimeout(function () { 
            if (uRLSearchParams.get('design') != null) ProduktknappTrykket(uRLSearchParams.get('design'))
            generateAll(overviewTable, contentTable); 
            setTimeout(function () { 
                TheFinishClick();
                setTimeout(function () { preview.scrollIntoView();
                }, 1000); 
            }, 1000); 
        }, 1000); // produser=
    }
    else if (gptId.value.length < 1) { // no key. Enable it
        TheIdeaClick();
        Show(btns);
        Show(btnsAll);
    }
    return uRLSearchParams.get('produser') == null ? false : true;
}

document.write("<div class=\"debug\">End of Code for load and parameters...</div>");
