const chat = document.querySelector('main')
, imgQ = 'https://upload.wikimedia.org/wikipedia/commons/2/29/Human_balance.png'
, imgA = 'https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg'
, input = document.querySelector('footer input')
, tRotating = "<div class='rotating'>&#8634</div>";

let rotateFontSizeI=1
, rotateFontSize = () => {
    document.documentElement.style.setProperty('--font-size', ['medium', 'x-large', 'xx-large', 'xx-large'][++rotateFontSizeI % 4]);
    document.body.classList.toggle('dark-mode', rotateFontSizeI%4 == 3);
}
, menuText = 
`App...||CatoSenteret...|||<b>Før opphold</b>|||Under opphold|||Etter opphold
    ||Hånd å holde i...|||test
|AI med...||Open AI (USA)...|||GPT 3.5|||GPT 4|||GPT o3
    ||Deepseek...|||V3|||R1
|Funksjonalitet...||( ) Foreslå spørsmål
    ||( ) Dyp analyse
    `.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')

, menuAsHtml = menu => menu.map((_, i) => menuHtmlAddItem(menu, i)).join('')
, menuHtml = menuAsHtml(menuAsArray(menuText))
, menuReset = () => menu.innerHTML = menuHtml;

//menuReset();

function menuAsArray(mStr) { // create hierarchy from | || ||| string
    m=[], p=[0,0,0,0,0];
    mStr.replace(/\|/g, (m,i,s) => s[i-1]=='|' ?m:'\n').split('\n').forEach((r,i)=>{
        t=r.replace(/^\|+/, '');
        l=r.length-t.length;
        p[l]=i;
        m.push({i:i, l:l, p:l?p[l-1]:null, t:t, c:[]}); // add menu item to array
    });
    m.forEach((mi) => { if (mi.l) m[mi.p].c.push(mi);});
    return m.filter(mi=>!mi.l);
}

function menuClickLeaf(e){ // handle click on leaf menu item
    switch(e.target.innerText.trim()) {
        case "test": send("Simulate: test|Simulate: test svar"); break;
        case "GPT 3.5": send("Simulate: GPT 3.5|Simulate: GPT 3.5 svar"); break;
        case "GPT 4": send("Simulate: GPT 4|Simulate: GPT 4 svar"); break;
        case "GPT o3": send("Simulate: GPT o3|Simulate: GPT o3 svar"); break;
        case "V3": send("Simulate: V3|Simulate: V3 svar"); break;
        case "R1": send("Simulate: R1|Simulate: R1 svar"); break;
        case "(x) Foreslå spørsmål": e.target.innerText = e.target.innerText.replace('(x)','( )'); break;
        case "( ) Foreslå spørsmål": e.target.innerText = e.target.innerText.replace('( )','(x)'); break;
        case "(x) Dyp analyse": e.target.innerText = e.target.innerText.replace('(x)','( )'); break;
        case "( ) Dyp analyse": e.target.innerText = e.target.innerText.replace('( )','(x)'); break;
        default: console.log(e.target.innerText.trim());
    }
}

function menuClickNonLeaf(e, c){ // handle click on non-leaf menu item
    console.log(c.outerHTML);
    c.classList.toggle('hidden');
}

function menuHtmlAddItem(m, i, b='') {
    let mi=m[i];
    if (!mi.c.length) // no children
        return `<div class='menu-item' onclick="menuClickLeaf(event)">${b+mi.t}</div>`;
    let h=`${mi.i && !mi.l?'<hr/>':''}<div class='menu-item' onclick='menuClickNonLeaf(event, mc${mi.i})'>${b+mi.t}</div>`;
    h+=`<div id="mc${mi.i}"${mi.l?' class="hidden"':''}>`;
        for (let iS=0; iS<mi.c.length; iS++)
            h+=menuHtmlAddItem(mi.c, iS, b+'&nbsp;&nbsp;');
    h+='</div>'
    return h;
}

function IsSimulate(msg) { return msg.substring(0, 10) == "Simulate: "; }  

function ask(msgQ) {
    const el = ((b) => (b.className = "row sent", 
                         b.innerHTML = `&nbsp;<img class="icon" src="${imgQ}"><div class="msg">${msgQ}</div>`, 
                         b))(document.createElement("div"));
    chat.append(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
}

function answer(msgA, isDone=true) {
    const el = ((b) => (b.className = "row received", 
                         b.innerHTML = `<div class="msg">${msgA}</div><img class="icon${isDone?'':' rotating'}" src="${imgA}">&nbsp;`, 
                         b))(document.createElement("div"));
    chat.append(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
}

function send(msgQ, onDone) {
    msgQ = msgQ?.trim() || input.value.trim();
    if (!msgQ) return;
    input.value = '';

    if (IsSimulate(msgQ)) {
        ask(msgQ.split(/\|/)[0].substring(10)); 
        return startReceive(msgQ, answer("...", false), onDone);
    }

    return ask(msgQ);
}

function startReceive(msgQ, divR, onDone) {
    setTimeout(() => receive_Placeholder(msgQ, divR, onDone), 2000);
    return divR
}

function receive_Placeholder(msgQ, divR, onDone) {
    let msgA = 'Svar på "' + msgQ + '"';
    if (IsSimulate(msgQ.split(/\|/)[1]))
        msgA = msgQ.split(/\|/)[1].substring(10);
    const msg = divR.querySelector(".msg"), icon = divR.querySelector(".icon");
    msg.innerText = msgA;
    icon.classList.remove("rotating"); // Remove rotation
    chat.scrollTop = chat.scrollHeight;
    onDone?.(divR, msgA);
}

input.focus();