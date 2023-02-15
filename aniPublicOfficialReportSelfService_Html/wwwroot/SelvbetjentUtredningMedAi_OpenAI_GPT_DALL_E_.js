document.write("<div class=\"debug\">Code for OpenAI GPT, DALL-E...</div>");
// Functions that produces text or images with Open AI GPT/WALL-E
// oaiVal gets a value, oaiHtml get HTML (both utilizing oaiReq and oaiJson which connects to and call Open AI webservices)
function oaiJson(sSrc, isImage, maxTokens) {
if (isImage==null) isImage=0;
return (isImage == 1)
? `{"prompt":${JSON.stringify(sSrc)},"n":1,"size":"256x256","response_format":"url"}`
: `{"model":"${document.querySelector('input[name="gptAlg"]:checked').value}"
,"prompt":${JSON.stringify(sSrc)},"temperature":0.7
,"max_tokens":${maxTokens == null ? 2000 : maxTokens},"top_p":1,"frequency_penalty":0.75,"presence_penalty":0}`;
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

async function oaiValAsync(sSrc, isImage, doneC, errC, maxTokens) {
    if (isImage == null) isImage = 0;
    let xhr = isImage == 1 ? oaiReqDaE() : oaiReqGpt();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4)
            if (xhr.status == 200)
                doneC((isImage != 0)
                    ? JSON.parse(xhr.responseText).data[0].url
                    : JSON.parse(xhr.responseText).choices[0].text);
            else if (errC != null) errC(xhr);
    }
    xhr.send(oaiJson(sSrc, isImage, maxTokens));
} //oaiValAsync("Hello World?", 0, function (v) { alert(v); });//oaiValAsync("Hello World", 1, function (v) { alert(v); });
async function oaiHtmlItemAsync(scDest, sSrc, isImage, doneC, errC, maxTokens) {
    if (isImage == null) isImage = 0;
    let xhr = isImage == 1 ? oaiReqDaE() : oaiReqGpt();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4)
            if (xhr.status == 200) {
                let cDest = document.getElementById(scDest);
                var json = JSON.parse(xhr.responseText);
                if (isImage == 1) cDest.src=json.data[0].url; // url for image
                try { cDest.value = json.choices[0].text; } // text returned onto textarea (or other with value)
                catch (ex) { cDest.innerHTML = json.choices[0].text; } // text returned onto innerHTML 
                if (doneC != null) doneC(cDest);
            }
            else if (errC != null) errC(xhr);
            //else document.getElementById(cDest).innerHTML = "GptContent error, status " + xhr.status + " text=" + xhr.responseText==null?"":xhr.responseText;
    }
    xhr.send(oaiJson(sSrc, isImage, maxTokens));
}
async function oaiHtmlWriteAsync(sSrc, isImage, doneC, errC, maxTokens) {
    if (isImage == null) isImage = 0;
    let scDest = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
    document.write(isImage == 1 
        ? '<img id="' + scDest + '"/>'
        : '<span id="' + scDest + '"></span>');
    return oaiHtmlItemAsync(scDest, sSrc, isImage, doneC, errC, maxTokens);
} //oaiHtmlWriteAsync("Hello World?");//oaiHtmlWriteAsync("Hello World?", 1);

document.write("<div class=\"debug\">End of Code for OpenAI GPT, DALL-E</div>");
