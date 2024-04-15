document.write("<div class=\"debug\">Code for intro...</div>");

// Innledning - Kapittelinnledning - Innledende sammendrag for hvert hovedkapittel
// Eksempel: Innledning:

async function introAsync(scDest, introducing, chapter, structure, inTxt, doneC, errC, maxTokens, stopArray) {
    let cDest = document.getElementById(scDest);
    cDest.innerHTML = "&#8634;";
    let gptIn = inTxt + "\n" + structure + "\n" + introducing.replace("*", chapter)
    return oaiHtmlItemAsync(cDest, gptIn, 0, doneC, errC, maxTokens, stopArray);
}

document.write("<div class=\"debug\">End of Code for intro.</div>");
