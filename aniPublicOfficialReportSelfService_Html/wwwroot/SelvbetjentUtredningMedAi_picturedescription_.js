document.write("<div class=\"debug\">Code for picturedescription...</div>");
// Bilde  - Kapittelbilde - Beskrivende tekst for hvert hovedkapittel (for bildegenereringstjeneste)
// Eksempel: [Bilde: * med bakgrunn
function picturedescriptionAndPictureAsync(structure, picturing, inTxt, chapter, doneC, errC){ 
    let gptIn = inTxt + "\n\n" + structure + "\n\n" + picturing.replace("*", chapter);
    oaiHtmlWriteAsync(sSrc, isImage, (description) => { }, errC);
    alert('fix this!; should return text ready to be used for WALL E');
    return;
}

document.write("<div class=\"debug\">End of Code for picturedescription.</div>");
