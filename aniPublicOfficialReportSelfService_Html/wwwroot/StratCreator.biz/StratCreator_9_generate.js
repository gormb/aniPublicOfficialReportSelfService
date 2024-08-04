document.write("<div class=\"debug\">Code for generate...</div>");
 
function generate_progress(comment, progress, maxProgress) {
    if (progress == null) {
        if (progressBar.max < progressBar.value + 1)
            progressBar.max = progressBar.value + 1
        progressBar.value = progressBar.value + 1;
    }
    else
        progressBar.value = progress;
    if (maxProgress != null)
        progressBar.max = maxProgress;
    progressText.innerHTML = comment;
}

let gStructure = "Chapter 1: A joke\nSubchapter 1a: Joke for the first\nSubchapter 1b: Further about jokes\nChapter 2: Fun two\nSubchapter 2a: What we mean by fun\nSubchapter 2b: Fun in history\nSubchapter 2c: How to get started with fun";
let gStructureCh = ["Chapter 1: A joke", "Chapter 2: Fun two"];
let gStructureSub = [["Subchapter 1a: Joke for the first", "Subchapter 1b: Further about jokes"], ["Subchapter 2a: What we mean by fun", "Subchapter 2b: Fun in history", "Subchapter 2c: How to get started with fun"]]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
let gIntroCh = ["It's about jokes in chapter 1.", "Fun is the theme for chapter 2 content."];
let gPictureTextCh = ["[Image: A joke with background", "[Image: Fun two with background"]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
let gPictureUrlCh = ["data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D", "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];
let gTextSub = [["Many agree that jokes are best, and maybe better than fun.", "We can well agree that this is a joke."], ["We distinguish between fun and jokes in this text, important that fun gets its place.", "Funny with history one can think. It can.", "You are already on your way. Funny to read this. Good luck further."]]; // [["todo;", "not implemented"], ["data", "on this format"], ["any"], ["text"]];

function generate_progressTotalWebserviceCalls() {
    let iRes = 1; // structure
    for (let i = 0; i < gStructureSub.length - 1; i++)
        iRes += 3 + gStructureSub[i].length; // ch:text,image,imagetext; sub:text
    return iRes;
}
function generateAll_ContentTableBlank() {
    let res = '';// '<tr><td id="' + structureChaptId() +'">generating content...</td></tr>';
    for (let i = 0; i < gStructureCh.length && i < gStructureSub.length; i++) {
        res += '<tr><td id="' + structureChaptId(i) + '" class="product_active">'
            + '<center><img width="512" height="512" id="' + structureChaptId(i) + '_image" src="https://aigap.no/____impro/1/onewebmedia/aigap.png" onclick="window.speechSynthesis.speak(new SpeechSynthesisUtterance(' + structureChaptId(i) + '_imagetext.innerHTML));"/></center>'
                + htmlImgRefresh(i)
            + '<div class="editControl" id="' + structureChaptId(i) + '_imagetext" class="imagetext">' + structureAsHtmlItem(gStructureCh[i]) + '...</div>'
                + htmlImgTxtRefresh(i, structureChaptId(i) + '_imagetext')
            + '<h2 class="product_active">' + structureAsHtmlItem(gStructureCh[i]) + '</h2>'
            + '<span id="' + structureChaptId(i) + '_text">chaptertext...</span>'
                + htmlChaptTxtRefresh(i)
            + "</td></tr>";
            for (let j = 0; j < gStructureSub[i].length; j++)
                res += '<tr><td class="product_active">'
                    + '<h4 id="' + structureChaptId(i, j) + '" class="product_active">' + structureAsHtmlItem(gStructureSub[i][j]) + "</h4>"
                    + '<span id="' + structureChaptId(i, j) + '_text">subchaptertext...</span>'
                    + htmlSubchaptTxtRefresh(i, j)
                    + "</td ></tr >";
    }
    return res;
}
function generateAll(overviewTable, contentTable, genType){
    overviewTable.innerHTML = '<tr><td class="product_active">genererating overview...'+tRotating+'</td></tr>';
    contentTable.innerHTML = '<tr><td class="product_active">content will be based on the overview.</td></tr>';
    gStructureCh = gIntroCh = gPictureTextCh = gPictureUrlCh = []; 
    gStructureSub = gTextSub = [[]];

    generate_progress('Producing chapter and subchapter with LLM...', 1);
    let sKapittelStrukturer = txtTextstructureIn.value;
    let sInnhold = txtContentsOut.value;
    structureAsync(sKapittelStrukturer, sInnhold, (ch, sub, sStructure) => 
    { // When structure done, show, get intro and image for each chapter, get text for each subchapter
        gStructure = sStructure;
        overviewTable.innerHTML = '<tr><td  class="product_active">' + structureAsHtml(sStructure) + htmlChaptRefresh() + htmlChaptTxtRefreshAll() + "<br />" + htmlImgTxtRefreshAll() + htmlImgRefreshAll() + "<br />" + htmlSubchaptTxtRefreshAll() + '</td></tr>';
        gStructureCh = ch; gStructureSub = sub; gStructure = txtTextstructureOut.value = sStructure; // save resulting chapters and subchapters
        contentTable.innerHTML = generateAll_ContentTableBlank();
        generate_progress('Chapter structure completed...', 2, generate_progressTotalWebserviceCalls()); /*10 struktur, */
        if (genType != null)
            if (genType == 'struct') { progressBar.value = progressBar.max; progressText.innerHTML = 'Do not click on images'; chapt_0_imagetext.innerHTML = 'The Humans are dead, we used poisonous gasses'; try{chapt_1_imagetext.innerHTML = 'You are experiencing a historical simulation of the twenties';}catch(e){} return; }
        for (let i = 0; i < gStructureCh.length && i < gStructureSub.length; i++)
        { // Get intro, image text and image for chapter, get text for each subchapter
            // chapter intro and image
            introAsync(structureChaptId(i) + '_text', txtIntroIn.value, gStructureCh[i], sStructure, sInnhold
                , (cId) => { // _imagetext, _image
                    generate_progress('Intro for ' + gStructureCh[i] + ' ferdigprodusert');
                    picturedescriptionAsync(structureChaptId(i) + '_imagetext', txtImageIn.value, gStructureCh[i], cId.innerHTML
                        , (cId) => { // bilde (DALL-E)
                            generate_progress('Imagetext for ' + gStructureCh[i] + ' ferdigprodusert');
                            pictureAsync(structureChaptId(i) + '_image', cId.innerHTML, () => { // bilde alt-text
                                generate_progress('Image for ' + gStructureCh[i] + ' ferdigprodusert')
                            }); // pictureAsync
                        }); // picturedescriptionAsync
                }
                , null, 2000, structureStopAfter(i)); // introAsync
            // for each subchapter create text
            for (let j = 0; j < gStructureSub[i].length; j++)
                textAsync(structureChaptId(i, j) + '_text', txtBodytextIn.value, gStructureSub[i][j], sStructure, sInnhold, () => generate_progress('Text for ' + gStructureSub[i][j] + ' produced'), null, 2000, structureStopAfter(i, j));
        }
    }, (errT) => {
        overviewTable.innerHTML = '<tr><td  class="product_active">' + errT + '</td></tr>';
        contentTable.innerHTML = generateAll_ContentTableBlank();
        generate_progress('Textstructure feilet...', 1, 1);
    }, 3000); // 3000 items for structure
    return "Genererer...";
}

document.write("<div class=\"debug\">End of Code for generate.</div>");
