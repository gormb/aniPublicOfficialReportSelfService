document.write("<div class=\"debug\">Code for UI, load and visibility...</div>");

function l() {
    //ShowDefault();;
    btns.style.display = '';
    chg(txtInnholdInn);
}

function Toggle(c) {try{c.style.display=(c.style.display=='none')?'':'none';} catch(e) {}}

function Show(c, visible) {
    if (visible==null) Toggle(c);
    else if (visible===0) c.style.display='none';
    else if (visible===1) c.style.display='';
    else
        c.style.display = visible;
}

function ShowCell(x, y, visible) {
    if (y == -1) { for (let i = 0; i < u.rows.length; i++) ShowCell(x, i, visible); }
    else if (x == -1) { for (let i = 0; i < u.rows[y].cells.length; i++) ShowCell(i, y, visible); }
    else 
        Show (u.rows[y].cells[x], visible)
}

function ShowDefault() { ShowCell(-1, -1, ''); ShowCell(3, -1); ShowCell(4, -1); ShowCell(5, -1);;ShowCell(-1, 2, 'none');}

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
