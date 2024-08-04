document.write("<div class=\"debug\">Code for picturedescription...</div>");

// Picture - Chapter image - Prompt to describe the image for any given Main Chapter
// Example: Image: * med bakgrunn

async function picturedescriptionAsync(scDest, picturing, chapter, inTxt, doneC, errC, stopArray) {
    let cDest = document.getElementById(scDest);
    cDest.innerHTML = tRotating;
    let gptIn = inTxt + "\n\n" + chapter + "\n\n" + inTxt + "\n\n" + picturing;
    return oaiHtmlItemAsync(cDest, gptIn, 0, doneC, errC != null ? errC : (errT) => { cDest.innerHTML = errT; }, 256, stopArray);
}
async function pictureAsync(scDest, inTxt, doneC, errC) {
    let cDest = document.getElementById(scDest);
    cDest.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D";
    return oaiHtmlItemAsync(cDest, inTxt, 1, (imgId) =>
    {
        imgId.alt = inTxt;
        imgId.title = inTxt;
        if (doneC != null)
            doneC(imgId);
    }, errC);
}

document.write("<div class=\"debug\">End of Code for picturedescription.</div>");
