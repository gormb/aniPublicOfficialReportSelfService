document.write("<div class=\"debug\">Code for OpenAI GPT, DALL-E...</div>");
// Functions that produces text or images with Open AI GPT/WALL-E
// oaiVal gets a value, oaiHtml get HTML (both utilizing oaiReq and oaiJson which connects to and call Open AI webservices)
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
    return (isImage == 1)
    ? `{"prompt":${JSON.stringify(sSrc)},"n":1,"size":"256x256","response_format":"url"}`
    : `{"model":"${document.querySelector('input[name="gptAlg"]:checked').value}"
        ,"prompt":${JSON.stringify(sSrc)},"temperature":0.7
        ,"max_tokens":${maxTokens == null ? 1000 : maxTokens},"top_p":1,"frequency_penalty":0.75,"presence_penalty":0`+stopTag+`}`;
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
async function oaiValAsync(sSrc, isImage, doneC, errC, maxTokens, stopArray) {
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
    xhr.send(oaiJson(sSrc, isImage, maxTokens, stopArray));
} //oaiValAsync("Hello World?", 0, function (v) { alert(v); });//oaiValAsync("Hello World", 1, function (v) { alert(v); });
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
            else if (errC != null) errC(xhr);
    }
    xhr.send(oaiJson(sSrc, isImage, maxTokens, stopArray));
}
async function oaiHtmlWriteAsync(sSrc, isImage, doneC, errC, maxTokens, stopArray) {
    if (isImage == null) isImage = 0;
    let scDest = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
    document.write(isImage == 1 
        ? '<img id="' + scDest + '"/>'
        : '<span id="' + scDest + '"></span>');
    return oaiHtmlItemAsync(document.getElementById(scDest), sSrc, isImage, doneC, errC, maxTokens, stopArray);
} //oaiHtmlWriteAsync("Hello World?");//oaiHtmlWriteAsync("Hello World?", 1);

document.write("<div class=\"debug\">End of Code for OpenAI GPT, DALL-E</div>");
