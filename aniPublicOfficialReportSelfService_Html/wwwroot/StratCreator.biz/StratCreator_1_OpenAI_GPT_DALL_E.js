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
    if (isImage == 1) // image
        //? `{"prompt":${JSON.stringify(sSrc)},"n":1,"size":"512x512","response_format":"url"}`
        return `{"model":${JSON.stringify(parApiImgModel)},"prompt":${JSON.stringify(sSrc)},"n":1,"size":"1024x1024","response_format":"url"}`;
    else if (parApi == 'complete') // !chat !image
        return `{"model":"${document.querySelector('input[name="gptAlg"]:checked').value}"
            ,"prompt":${JSON.stringify(sSrc)},"temperature":0.7
            ,"max_tokens":${maxTokens == null ? 1000 : maxTokens},"top_p":1,"frequency_penalty":0.75,"presence_penalty":0`+stopTag+`}`;
    else // chat, !image
        return `{
            "model":"${document.querySelector('input[name="gptAlg"]:checked').value}"
            ,"messages": [
                { "role": "user", "content": ${JSON.stringify(sSrc)} }
            ]
            ,"max_tokens":${maxTokens == null ? 1000 : maxTokens},"top_p":1,"frequency_penalty":0.75,"presence_penalty":0` + stopTag + `
            ,"stream": false}`;
}
function oaiReq(url) {
    let req = new XMLHttpRequest();
    req.open("POST", url != null ? url : parApiTextJson);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", "Bearer " + gptId.value);
    return req;
}    
function oaiReqDaE() { return oaiReq(parApiImgJson);}
function oaiReqGpt() { return oaiReq(parApiTextJson);}
function oaiValRespData(isImage, resp) {
    let r = JSON.parse(resp);
    console.log(r);
    if (isImage != 0) try {r = r.data[0].url;/* image API */} catch(e) {/* unknown image API */}
    else try {
            r = r.choices[0].message.content; /* chat API */
        } catch (e) {
                try { r = r.choices[0].text; /* completion API */
            } catch (e) {/* unknown API */}
        } 
    return r;
}
async function oaiValAsync(sSrc, isImage, doneC, errC, maxTokens, stopArray) {
    if (isImage == null) isImage = 0;
    let xhr = isImage == 1 ? oaiReqDaE() : oaiReqGpt();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4)
            //if (xhr.status == 200)
            //    doneC((isImage != 0)
            //        ? JSON.parse(xhr.responseText).data[0].url
            //        //: JSON.parse(xhr.responseText).choices[0].message.content);
            //        : JSON.parse(xhr.responseText).choices[0].text);
            if (xhr.status == 200)
                doneC(oaiValRespData(isImage, xhr.responseText));
            else {
                let errT = "error";
                try { errT = JSON.parse(xhr.responseText).error.message; } catch (e) { errT = xhr.status + " " + xhr.text }
                if (errC != null) errC(errT);
                else console.log(errT);
            }
    }
    xhr.onerror = function (e) { if (errC != null) errC(e); }
    xhr.send(oaiJson(sSrc, isImage, maxTokens, stopArray));
} //oaiValAsync("Hello World?", 0, function (v) { alert(v); });//oaiValAsync("Hello World", 1, function (v) { alert(v); });
async function oaiHtmlItemAsync(cDest, sSrc, isImage, doneC, errC, maxTokens, stopArray) {
    if (isImage == null) isImage = 0;
    let xhr = isImage == 1 ? oaiReqDaE() : oaiReqGpt();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4)
            if (xhr.status == 200) {
            //    var json = JSON.parse(xhr.responseText);
            //    if (isImage == 1) cDest.src=json.data[0].url; // url for image
            //    else if (cDest.value != null) cDest.value = json.choices[0].text;
            //    else cDest.innerHTML = json.choices[0].text; // text returned onto textarea (or other with value)
            //    if (doneC != null) doneC(cDest);
                let res = oaiValRespData(isImage, xhr.responseText);
                if (isImage == 1) cDest.src=res; // url for image
                else if (cDest.value != null) cDest.value = res;
                else cDest.innerHTML = res; // text returned onto textarea (or other with value)
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
//async function oaiHtmlWriteAsync(sSrc, isImage, doneC, errC, maxTokens, stopArray) {
//    if (isImage == null) isImage = 0;
//    let scDest = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);
//    document.write(isImage == 1 
//        ? '<img id="' + scDest + '"/>'
//        : '<span id="' + scDest + '"></span>');
//    return oaiHtmlItemAsync(document.getElementById(scDest), sSrc, isImage, doneC, errC, maxTokens, stopArray);
//} //oaiHtmlWriteAsync("Hello World?");//oaiHtmlWriteAsync("Hello World?", 1);

document.write("<div class=\"debug\">End of Code for OpenAI GPT, DALL-E</div>");
