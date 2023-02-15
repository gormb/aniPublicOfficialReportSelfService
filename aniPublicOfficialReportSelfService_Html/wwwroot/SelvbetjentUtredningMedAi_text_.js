document.write("<div class=\"debug\">Code for text...</div>");

// Brødtekst - Underkapitteltekst - Selve teksten for hvert underkapittel
// Eksempel: * Brødtekst:
function text(structure, texting, inTxt, subchapter)
{    
    let res = "";
    if (subchapter==null)
        res = "out=text(structure, texting, inTxt) not implemented, shall use GPT to reduce texts if too long, and concatenate them so that other functions can be called";
    else
    {
        let gptIn = inTxt + "\n\n" + structure + "\n\n" + texting.replace("*", subchapter);
        res = gptIn;
    }
    return res;
}

document.write("<div class=\"debug\">End of Code for text.</div>");
