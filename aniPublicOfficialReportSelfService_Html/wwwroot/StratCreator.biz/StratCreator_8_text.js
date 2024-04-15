document.write("<div class=\"debug\">Code for text...</div>");

// Brødtekst - Underkapitteltekst - Selve teksten for hvert underkapittel
// Eksempel: * Brødtekst:
async function textAsync(scDest, texting, subchapter, structure, inTxt, doneC, errC, maxTokens, stopArray) {
    let cDest = document.getElementById(scDest);
    cDest.innerHTML = tRotating;
    let gptIn = inTxt + "\n\n" + structure + "\n\n" + texting.replace("*", subchapter);
    return oaiHtmlItemAsync(cDest, gptIn, 0, doneC, errC != null ? errC : (errT) => { cDest.innerHTML = errT; }, maxTokens, stopArray);
}

document.write("<div class=\"debug\">End of Code for text.</div>");
