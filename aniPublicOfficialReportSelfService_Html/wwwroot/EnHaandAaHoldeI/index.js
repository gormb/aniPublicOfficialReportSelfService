const chat = document.querySelector('main')
, menu = document.querySelector('#menu')
, header = document.querySelector('#header')
, suggestions = document.querySelector('#suggestions')
, input = document.querySelector('footer input')
, imgQ = 'https://upload.wikimedia.org/wikipedia/commons/2/29/Human_balance.png'
, imgA = 'https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg'
, tRotating = "<div class='rotatingC'>&#8634</div>";

let rotateFontSizeI=0
, rotateFontSize = () => {
    document.documentElement.style.setProperty('--font-size', ['medium', 'x-large', 'xx-large', 'xx-large', 'medium'][++rotateFontSizeI % 5]);
    document.body.classList.toggle('dark-mode', rotateFontSizeI%5 > 2);
};

const menuText = // menu text with hierarchy specified with pipes
`App >>§ -||CatoSenteret >>|||Før opphold§*|||Under opphold|||Etter opphold
    ||Hånd å holde i >>§-|||Kontakt|||Utvikling|||Simuler
|AI med >>§-||Open AI (USA) >>|||GPT 3.5|||GPT 4§*|||GPT o3
    ||Deepseek >>|||V3|||R1
|Funksjonalitet >>§-||Spørsmålsforslag aktivert§
    ||Dypanalyse aktivert`.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')
, menuAsArray = mStr => { // create hierarchy from | || ||| string
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
, menuId= mt => 'm_'+mt.replace(/[^a-zA-Z0-9]/g, '')
, menuE = mt => document.getElementById(menuId(mt))
, menuEBold = (mt,b) => {
    if (b==null) b = menuE(mt).classList.contains('bold');
    if (b==true) menuE(mt).classList.add('bold');
    else menuE(mt).classList.remove('bold');
}
, menuEBoldOnly = (mt, mtA) => {
    mtA.forEach(m => menuEBold(m, false));
    menuEBold(mt, true);
}
, menuHtmlAddItem= (m, i) =>{ // create html for menu item and children
    let mi=m[i], mt=mi.t.split('§')[0].trim(), b='&nbsp;'.repeat(mi.l*6), mo=mi.t.split('§')[1];
    if (!mi.c.length) // no children
        return `<div id='${menuId(mt)}' class='menu-item${mo=='*'?' bold':''}' onclick="menuClickLeaf(event)">${b+mt}</div>`;
    let h=`${mi.i && !mi.l?'<hr/>':''}<div class='menu-item' onclick='mc${mi.i}.classList.toggle("hidden")'>${b+mt}</div>`;
    h+=`<div id="mc${mi.i}"${mo=='-'?' class="hidden"':''}>`;
    for (let iS=0; iS<mi.c.length; iS++)
        h+=menuHtmlAddItem(mi.c, iS);
    h+='</div>'
    return h;
}
, menuReset = () => menu.innerHTML = menuAsArray(menuText).map((_, i) => menuHtmlAddItem(menuAsArray(menuText), i)).join('')

function menuClick_m_Hndholdei(e,sm){ 
    switch (sm) {
        case 'Kontakt': return window.open('https://www.aigap.no/snakk-med-oss', '_blank');
        case 'Utvikling': return window.open('https://docs.google.com/spreadsheets/d/1mfX64WtObCh7Szyv0zXOscJl0F-_pE3fG0b8rDSSy_c/edit?gid=1531346265#gid=1531346265&range=B3', '_blank');
        case 'Simuler': 
            inp.value = 'Hvordan kommer jeg meg dit?';
            setTimeout(() => { send('Simulate: Hvordan kommer jeg meg dit?|Simulate: Du kan reise til CatoSenteret på Ullevål sykehus med bil, offentlig transport eller tilrettelagte transporttjenester', ()=> { inp.value = 'Hva er relevansen til Ullevål sykehus?'; setTimeout(() => { send('Simulate: Hva er relevansen til Ullevål sykehus?|Simulate: CatoSenteret er tilknyttet Ullevål sykehus, som betyr at rehabiliteringsoppholdet ditt finner sted der. Når vi nevner Ullevål sykehus, refererer vi til beliggenheten for CatoSenteret');}, 3000); });}, 3000);
            menu.classList.toggle('hidden');
            break;
    }
};

function menuClick_m_CatoSenteret(e,sm){ menu.classList.toggle('hidden'); message(`<i>${sm=='Før opphold'?sm+' er allerede aktivert</i>':sm+' er ikke aktivert'}</i>`);};

function menuClick_m_OpenAIUSA(e,sm){ //menu.classList.toggle('hidden'); 
    menuEBoldOnly(e.target.innerText, ['GPT 4', 'GPT 3.5', 'GPT o3', 'R1', 'V3']);
    switch (sm) {
        case 'GPT 3.5': break;
        case 'GPT 4': break;
        case 'GPT o3': break;
    }
    message('<i>Bytte til Open AI algoritme '+sm+' er ikke ferdig kodet</i>');
};

function menuClick_m_Deepseek(e,sm) {
    menuEBoldOnly(e.target.innerText, ['GPT 4', 'GPT 3.5', 'GPT o3', 'R1', 'V3']);
    switch (sm) {
        case 'V3': break;
        case 'R1': break;
    }
    message('<i>Bytte til Deepseek algoritme '+sm+' er ikke ferdig kodet</i>');
};

let funcQuestionSuggestion = false, funcDeepAnalysis = false;

function menuClick_m_Funksjonalitet(e,sm) {
    switch (sm) {
        case 'Spørsmålsforslag aktivert': 
            funcQuestionSuggestion = !funcQuestionSuggestion;
            menuEBold(sm, funcQuestionSuggestion);
            if (funcQuestionSuggestion) suggestions.classList.remove('hidden');
            else suggestions.classList.add('hidden');
            message(`<i>Spørsmålsforslag ${funcQuestionSuggestion?'':'de'}aktivert</i>`);
        break;
        case 'Dypanalyse aktivert': 
            funcDeepAnalysis = !funcDeepAnalysis; 
            menuEBold(sm, funcDeepAnalysis);
            message(`<i>Dypanalyse ${funcDeepAnalysis?'':'de'}aktivert</i>`);
            break;
    }
}

function menuClickLeaf(e){ // handle click on leaf menu item
    const mi = e.target, mt = mi.innerText.trim(), fn='menuClick_'+menuId(mt)
        , mtp=mi.parentElement.previousElementSibling.innerText.split('\n')[0].trim()
        , fnp='menuClick_'+menuId(mtp);
    if (typeof window[fn] === 'function') window[fn](e);
    else if (typeof window[fnp] === 'function') window[fnp](e, mt);
    else e.target.outerHTML = `function ${fn}(e){} || ${fnp}(e,sm='${mt}'){};`;
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

function message(msg) {
    const el = ((b) => (b.innerHTML = `<center><div>${msg} <span style="cursor: pointer" onclick="this.parentElement.parentElement.parentElement.remove()">&nbsp;✖&nbsp;</span></div></center>`, b))(document.createElement("div"));
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
        return startReceive(msgQ, answer(tRotating, false), onDone);
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
menuReset();
document.addEventListener('click', e => { if (!document.getElementById('menu').contains(e.target) && !document.getElementById('header').contains(e.target)) menu.classList.add('hidden'); });
input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });