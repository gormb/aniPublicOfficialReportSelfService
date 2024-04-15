document.write("<div class=\"debug\">Code for UI, load and visibility...</div>");

function l() {
    ShowCell(-1, -1, 'none'); // hide all
    chg(txtInnholdInn);
}
function UpdateImageColoring(i,d,p,f) {
    ideaImg.style.filter = (i == 1) ? "" : "grayscale(100%)";
    designImg.style.filter = (d == 1) ? "" : "grayscale(100%)";
    productionImg.style.filter = (p == 1) ? "" : "grayscale(100%)";
    finishImg.style.filter = (f == 1) ? "" : "grayscale(100%)";
}
function TheIdeaClick() {
    ideaDesc.style.backgroundColor = '#eee'; designDesc.style.backgroundColor = productionDesc.style.backgroundColor = finishDesc.style.backgroundColor = '#000'; progressBar.style.display = ''; 
    Show(introtext, 0);
    Show(design, 1);
    ShowCell(0, 0, 1); ShowCell(1, 0, 1); ShowCell(2, 0, 1); // Captions
    ShowCell(0, 1, 1); ShowCell(1, 1, 1); ShowCell(2, 1, 1); // Innhold
    Show(generate, 1);
    Show(previewTable, 1);
    UpdateImageColoring(1,0,0,0);
}
function TheDesignClick() {
    designDesc.style.backgroundColor = '#eee'; ideaDesc.style.backgroundColor = productionDesc.style.backgroundColor = finishDesc.style.backgroundColor = '#000'; progressBar.style.display = '';
    Show(introtext, 0);
    Show(design, 1);
    Show(ideaImg, 1);
    ShowCell(0, 0, 1); ShowCell(1, 0, 1); ShowCell(2, 0, 1); // Captions
    ShowCell(0, 2, 1); ShowCell(1, 2, 1); ShowCell(2, 2, 1); // Kapittelstruktur
    Show(btns2, 1);
    Show(generate, 1);
    Show(previewTable, 1);
    UpdateImageColoring(0, 1, 0, 0);
}
function TheTextClick() {
    productionDesc.style.backgroundColor = '#eee'; ideaDesc.style.backgroundColor = designDesc.style.backgroundColor = finishDesc.style.backgroundColor = '#000'; progressBar.style.display = '';
    Show(introtext, 0);
    if (document.getElementById(structureChaptId(0)) == null) generateAll_ContentTableBlank();
    ShowDefault();
    Show(ideaImg, 1);
    Show(design, 1);
    Show(btns2, 1);
    Show(btns2steps, 1);
    Show(generate, 1);
    Show(previewTable, 1);
    UpdateImageColoring(0, 0, 1, 0);
}
function TheFinishClick() {
    finishDesc.style.backgroundColor = '#eee'; ideaDesc.style.backgroundColor = designDesc.style.backgroundColor = productionDesc.style.backgroundColor = '#000'; progressBar.style.display = '';
    Show(introtext, 0);
    if (document.getElementById(structureChaptId(0)) == null) generateAll_ContentTableBlank();
    Show(design, 1);
    Show(ideaImg, 1);
    ShowCell(0, 0, 1); ShowCell(1, 0, 1); ShowCell(2, 0, 1); // Captions
    ShowCell(0, 4, 1); ShowCell(1, 4, 1); ShowCell(2, 4, 1); // Bildetekst
    UpdateImageColoring(0, 0, 0, 1);
}

function Toggle(c) {try{c.style.display=(c.style.display=='none')?'':'none';} catch(e) {}}

function Show(c, visible) {
    if (visible==null) Toggle(c);
    else if (visible === 0 || visible === false) c.style.display='none';
    else if (visible === 1 || visible === true) c.style.display='';
    else
        c.style.display = visible;
}

function ShowCell(x, y, visible) {
    if (y == -1) { for (let i = 0; i < u.rows.length; i++) ShowCell(x, i, visible); }
    else if (x == -1) { for (let i = 0; i < u.rows[y].cells.length; i++) ShowCell(i, y, visible); }
    else 
        Show (u.rows[y].cells[x], visible)
}

function ShowNone() {
    ShowCell(-1, -1, 'none'); // hide all
    ideaDesc.style.backgroundColor = designDesc.style.backgroundColor = productionDesc.style.backgroundColor = finishDesc.style.backgroundColor = '#000';
    UpdateImageColoring(1, 1, 1, 1);
    progressBar.style.display = 'none'; 
    Toggle(design);
    Show(generate, 0);
}

function ShowDefault() {
    ShowCell(-1, -1, ''); // show all
    ShowCell(3, -1); // Hide
    ShowCell(4, -1);
    ShowCell(5, -1);
}

function chg(c)
{
    switch (c) {
    case txtInnholdInn: 
        txtInnholdUt.value = txtInnholdInn.value;
        chg(txtInnholdUt);
        break;
    case txtKapittelstrukturInn: break;
    case txtInnledningInn: break;
    case txtBildeInn: break;
    case txtBroedtekstInn: break;
    case txtInnholdUt: break;
    default:
        alert(c.id);
    }
}

document.write("<div class=\"debug\">End of Code for load and visibility...</div>");;
