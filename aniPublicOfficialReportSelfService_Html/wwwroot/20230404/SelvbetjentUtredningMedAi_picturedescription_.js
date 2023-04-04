document.write("<div class=\"debug\">Code for picturedescription...</div>");
// Bilde  - Kapittelbilde - Beskrivende tekst for hvert hovedkapittel (for bildegenereringstjeneste)
// Eksempel: [Bilde: * med bakgrunn
async function picturedescriptionAsync(scDest, picturing, chapter, inTxt, doneC, errC, stopArray) {
    let cDest = document.getElementById(scDest);
    cDest.innerHTML = "&#8634;";
    let gptIn = inTxt + "\n\n" + chapter + "\n\n" + inTxt + "\n\n" + picturing;
    return oaiHtmlItemAsync(cDest, gptIn, 0, doneC, errC, 256, stopArray);
}
async function pictureAsync(scDest, inTxt, doneC, errC) {
    let cDest = document.getElementById(scDest);
    cDest.src = "noimage.png";
    return oaiHtmlItemAsync(cDest, inTxt, 1, (imgId) =>
    {
        imgId.alt = inTxt;
        imgId.title = inTxt;
        if (doneC != null)
            doneC(imgId);
    }, errC);
}

document.write("<div class=\"debug\">End of Code for picturedescription.</div>");
