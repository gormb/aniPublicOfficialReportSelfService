document.write("<div class=\"debug\">Code for simplify...</div>");

// Contents - One ormore sources to base the strategy on
// Example: Life, the Universe and Everything is dificult to grasp, what toactually do can be even worse!

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
    try { reduceButton.innerHTML = 'Reduce ' + tRotating;} catch (ex) { }
    if (inTxt.split(' ').length <= wordCountWanted) {
        try { Show(reduceButton, 0); reduceButton.innerHTML = 'Reduce'; } catch (ex) { }
        return inTxt; // return inTxt if it is short enough
    }
    alert('simplify/reduce - the method limits contents down to ' + wordCountWanted + ' words. Method not implementert, sadly, in case not needed in near future...!');
    let splitIn = simplify_Array(inTxt, wordCountWanted); // create array of data splitted into max n words
    simplifySplitOut = new Array(splitIn.length); // create array for results
    let promises = [];
    let wordsPerItem = Math.round(wordCountWanted / splitIn.length);// calculate wordCountReduced to end with 1400 words totally
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
            try { Show(reduceButton, 0); reduceButton.innerHTML = 'Reduce'; } catch (ex) { }
            console.log(simplifySplitOut.join("??????????????"));
            doneC(simplifySplitOut.join("\n-------------------------------\n"));
        }).catch((error) => { console.log(error);});
    }
    //return splitIn.join("\n---------------------------------\n");
    return inTxt;// "⟳";
}
document.write("<div class=\"debug\">End of Code for simplify.</div>");
