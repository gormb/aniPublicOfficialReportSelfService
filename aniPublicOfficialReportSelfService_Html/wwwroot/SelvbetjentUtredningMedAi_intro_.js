document.write("<div class=\"debug\">Code for intro...</div>");

// Innledning - Kapittelinnledning - Innledende sammendrag for hvert hovedkapittel
// Eksempel: Innledning:
function intro(structure, introducing, inTxt, chapter)
{
    let res = "";
    if (chapter==null)
        res = "out=intro(structure, introducing, inTxt, [chapter]) not implemented, shall use GPT to reduce texts if too long, and concatenate them so that other functions can be called";
    else
    {
        let gptIn = inTxt + "\n\n" + structure + "\n\n" + introducing.replace("*", chapter);
        res = gptIn;
    }
    return res;
}

document.write("<div class=\"debug\">End of Code for intro.</div>");
