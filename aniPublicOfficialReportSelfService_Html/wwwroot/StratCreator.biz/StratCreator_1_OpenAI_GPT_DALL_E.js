document.write("<div class=\"debug\">Code for OpenAI GPT, DALL-E...</div>");

// Functions that produces text or images with Open AI GPT/WALL-E
// oaiVal gets a value, oaiHtml get HTML (both utilizing oaiReq and oaiJson which connects to and call Open AI webservices)

class AI extends Logged {
    maxTokens=1000;
    idUrl=0;
    idReq=0;
    constructor(model,url,bearer) { super("AI"); this.model=model; this.url=url; this.bearer=bearer;}
    reqData(sSrc, maxTokens, stopArray) {
        sSrc = JSON.stringify(sSrc);
        this.stopTag = stopArray && stopArray.length > 0 ? ',"stop": ["' + stopArray.join('","') + '"]' : "";
        return this.logreq(`{"model":${JSON.stringify(this.model)},"messages":[{"role":"user","content":${sSrc}}],"max_tokens":${maxTokens||this.maxTokens},"top_p":1,"frequency_penalty":0.75,"presence_penalty":0${this.stopTag},"stream":false}`);
    }
    req(url) {
        let r = new XMLHttpRequest();
        r.open("POST", this.logurl(url||this.url));
        this.idUrl=Logged_currentID; // update so that next request will have this url as parent
        r.setRequestHeader("Content-Type", "application/json");
        r.setRequestHeader("Authorization", "Bearer " + this.bearer);
        return r;
    }
    valRespData(resp) {
        this.logresp(resp,idReq);
        let r = JSON.parse(resp);
        try { return r.choices[0].message.content; } catch (e) {
            try { return r.choices[0].text; } catch (e) {
                return null; }}
    }
    async valAsync(sSrc, doneC, errC, maxTokens, stopArray) {
        let xhr = this.req();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    doneC(this.valRespData(xhr.responseText));
                } else {
                    let errT = "error";
                    try { errT = JSON.parse(xhr.responseText).error.message; } 
                    catch (e) { errT = xhr.status + " " + xhr.text }
                    if (errC != null) errC(errT);
                    else this.logerror(errT);
                }
            }
        }
        xhr.onerror = function (e) { if (errC != null) errC(e); }
        xhr.send(this.reqData(sSrc, maxTokens, stopArray));
    }
    htmlItemSet(cDest, val) {
        if (cDest.value != null) cDest.value = val;
        else cDest.innerHTML = val;
    }
    async htmlItemAsync(cDest, sSrc, doneC, errC, maxTokens, stopArray) {
        let xhr = this.req();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let res = this.valRespData(xhr.responseText);
                    this.htmlItemSet(cDest, res);
                    if (doneC != null) doneC(cDest);
                } else {
                    let errT = "error";
                    try { errT = JSON.parse(xhr.responseText).error.message; } catch (e) { errT = xhr.status + " " + xhr.text }
                    if (errC != null) errC(errT);
                    else this.logerror(errT);
                }
            }
        }
        xhr.send(this.reqData(sSrc, maxTokens, stopArray));
    }
}

class AI_Image extends AI { // Subclass implementing AI for image processing
    imageSize='1024x1024'; // overwritten in constructor
    constructor(imgmodel,url,bearer,imageSize) { super(imgmodel,url,bearer); this.imageSize=imageSize}
    reqData(sSrc, maxTokens, stopArray) { return this.logreq(`{"model":${JSON.stringify(this.model)},"prompt":${JSON.stringify(sSrc)},"n":1,"size":"${this.imageSize}","response_format":"url"}`);}
    valRespData(resp) {
        this.logresp(resp);
        let r = JSON.parse(resp);
        try { return r.data[0].url; } catch (e) { return null; }
    }
    htmlItemSet(cDest, val) { cDest.src=val; }
    async valAsync(sSrc, doneC, errC, maxTokens, stopArray) {
        let xhr = this.req();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    doneC(this.valRespData(xhr.responseText));
                } else {
                    let errT = "error";
                    try { errT = JSON.parse(xhr.responseText).error.message; } catch (e) { errT = xhr.status + " " + xhr.text }
                    if (errC != null) errC(errT);
                    else this.logerror(errT);
                }
            }
        }
        xhr.onerror = function (e) { if (errC != null) errC(e); }
        xhr.send(this.reqData(sSrc, maxTokens, stopArray));
    }
}

function AI_Factory(isImage) {
   return isImage ? new AI_Image(parApiImgModel, parApiImgJson,  gptId.value, parApiImgSize)
        : new AI(document.querySelector('input[name="gptAlg"]:checked').value, parApiTextJson,  gptId.value);
}


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

async function oaiValAsync(sSrc, isImage, doneC, errC, maxTokens, stopArray) {
    return AI_Factory(isImage).valAsync(sSrc, doneC, errC, maxTokens, stopArray);
}
async function oaiHtmlItemAsync(cDest, sSrc, isImage, doneC, errC, maxTokens, stopArray) {
    return AI_Factory(isImage).htmlItemAsync(cDest, sSrc, doneC, errC, maxTokens, stopArray);
}
document.write("<div class=\"debug\">End of Code for OpenAI GPT, DALL-E</div>");
