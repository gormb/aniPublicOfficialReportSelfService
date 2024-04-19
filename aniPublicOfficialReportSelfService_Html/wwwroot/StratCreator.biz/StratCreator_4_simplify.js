document.write("<div class=\"debug\">Code for simplify...</div>");

// Innhold - En eller flere innholdstekster det skal lages utredning på grunnlag av
// Eksempel: Vinterfiske handler ofte om å få mest mulig ut av de forskjellige artene som finnes langs svaberget. Sjøørret er den mest populære fisken, og den er enkel å få tak i i høykvalitet. Du finner den i fjorder, skjærgårder og langs kysten. Torsk er også vanlig, og den fiskes best i områder med hardbunn som skjær og viker. Den rikholdige fjære som finnes langs kysten kan også by på gode fiskemuligheter. Lyr og sei er også vanlige fiskearter og kan også fanges fra båt.Det er mange som driver med artsfiske og prøver å fange så mange forskjellige arter som mulig.Dette krever ofte at man spesialiserer seg på en bestemt type fisk og fiske metode.Dette bør man gjøre med stor forsiktighet, da man kan ødelegge sensitive økosystemer som fisker etter.

const DEFAULT_MAX_WORDS = 1400; // 1400?

function simplify_Array(inTxt, wordCountWanted = DEFAULT_MAX_WORDS)
{
    const words = inTxt.split(' ');
    let result = [];
    let currentString = '';
    let wordCount = 0;
    for (let i = 0; i < words.length; i++)
        if (++wordCount >= wordCountWanted)
        {
            result.push(currentString.trim());
            currentString = words[i] + ' ';
            wordCount = 0;
        }
        else
            currentString += words[i] + ' ';
    result.push(currentString.trim());
    return result;
}

let simplifySplitOut = [];

async function simplify(inTxt, doneC, wordCountWanted = DEFAULT_MAX_WORDS // 75 words: 100 token; 2000token=1500w
    ,promptPro = "Using {wordCountReduced} words, generate me a consise summary of the following text..."
    ,promptEpi = "\n\nSummary: ")
{
    try { samleButton.innerHTML = 'Samle ' + tRotating;} catch (ex) { }
    if (inTxt.split(' ').length <= wordCountWanted) {
        try { Show(samleButton, 0); samleButton.innerHTML = 'Samle'; } catch (ex) { }
        return inTxt; // return inTxt if it is short enough
    }
    alert('simplify - metoden begrenser innhold ned til ' + wordCountWanted + ' ord. Ikke ferdig implementert, desverre...!');
    let splitIn = simplify_Array(inTxt, wordCountWanted); // create array of data splitted into max n words
    simplifySplitOut = new Array(splitIn.length); // create array for results
    let promises = [];
    let wordsPerItem = Math.round(wordCountWanted / splitIn.length);// calculate wordCountReduced slik at det ender med 1400 ord totalt
    for (let i = 0; i < splitIn.length; i++) {
        let sSrc = promptPro.replace("{wordCountReduced}", Math.round(wordsPerItem/splitIn.length)) + splitIn[i] + promptEpi;
        promises.push(oaiValAsync(sSrc, 0
            , (res) => { simplifySplitOut[i] = res; /*alert('A: ' + res);*/ }
            , null, Math.round(wordsPerItem * 4 / 3)));
    }
    if (doneC) {
        await Promise.all(promises).then((response) =>
        {
            console.log(response);
            try { Show(samleButton, 0); samleButton.innerHTML = 'Samle'; } catch (ex) { }
            console.log(simplifySplitOut.join("??????????????"));
            doneC(simplifySplitOut.join("\n-------------------------------\n"));
        }).catch((error) => { console.log(error);});
    }
    //return splitIn.join("\n---------------------------------\n");
    return inTxt;// "⟳";
}
document.write("<div class=\"debug\">End of Code for simplify.</div>");
