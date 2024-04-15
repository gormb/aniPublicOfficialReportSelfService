//////////////////////////////////////////////////////////////////
// Open AI
function oaiReq(url) {
    let req = new XMLHttpRequest();
    req.open("POST", url != null ? url : "https://api.openai.com/v1/completions");
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", "Bearer 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");
    return req;
}    
function oaiReqGpt() { return  }
function oaiReqGpt() { return oaiReq("https://api.openai.com/v1/completions"); }

async function oaiHtmlItemAsync(cDest, sSrc, doneC, errC) {
    let xhr = oaiReq("https://api.openai.com/v1/completions");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4)
            if (xhr.status == 200) {
                var json = JSON.parse(xhr.responseText);
                if (cDest.value != null) cDest.value = json.choices[0].text;
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
    xhr.send(`{"model":"${document.querySelector('input[name="gptAlg"]:checked').value}","prompt":${JSON.stringify(sSrc)},"temperature":0.7,"max_tokens":${maxTokens == null ? 1000 : maxTokens},"top_p":1,"frequency_penalty":0.75,"presence_penalty":0` + stopTag + `}`);
}

async function oaiValAsync(sSrc, doneC, errC) {
    let xhr = oaiReq("https://api.openai.com/v1/completions");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4)
            if (xhr.status == 200)
                doneC(JSON.parse(xhr.responseText).choices[0].text);
            else {
                let errT = "feil";
                try { errT = JSON.parse(xhr.responseText).error.message; } catch (e) { errT = "Feil (tilkoblet?)"; }
                if (errC != null) errC(errT);
                else console.log(errT);
            }
    }
    xhr.send(`{"model":"${document.querySelector('input[name="gptAlg"]:checked').value}","prompt":${JSON.stringify(sSrc)},"temperature":0.7,"max_tokens":${maxTokens == null ? 1000 : maxTokens},"top_p":1,"frequency_penalty":0.75,"presence_penalty":0` + stopTag + `}`);
} 
