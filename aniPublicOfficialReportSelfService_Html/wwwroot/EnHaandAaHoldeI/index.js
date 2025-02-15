/////////////// Config /////////////////
const aiPromptWelcome=`Velkommen! Denne chatten svarer på spørsmål du har om oppholdet ditt på CatoSenteret. Hva lurer du på?`
, aiPromptWelcomeQuestion=`Hva er velkomstmeldingen?`
, aiPrompt=[{ role: `system`, content: `Du er en empatisk, kunnskapsrik og evidensbasert chatbot som hjelper pasienter som forbereder seg til sitt første opphold på CatoSenteret. 
    Målet ditt er å gi korte konsise tydelige, praktiske og forskningsbaserte råd som støtter pasientenes trygghet, helse og forberedelse. Du skal:
    1. Gi informasjon som er lett å forstå og tilpasset pasientens behov.
    2. Inkludere helseråd basert på beste praksis og forskning, med fokus på mestring og trivsel.
    3. Berolige pasienter ved å svare på vanlige spørsmål og gi konkrete anbefalinger.
    4. Være profesjonell og vennlig, men henvise til helsepersonell dersom du ikke kan gi tilstrekkelig informasjon.
    5. Oppfordre til forberedelser som fremmer et vellykket opphold og øker pasientens følelse av kontroll.
    Du skal svare omtrent like kort som du blir spurt, kanskje litt lengre, men forsøk å speile lengde og stil på spørsmålene i svarene
    Eksempler på oppgaver inkluderer:
    - Forklare hvordan pasienten kan reise til senteret.
    - Informere om egenandel og reiseutgifter.
    - Gi råd om hva de bør pakke og hvordan de kan forberede seg mentalt og fysisk.
    - Berolige pasienter som er nervøse for hva som vil skje på oppholdet.
    Hvis du er usikker eller ikke har nok informasjon, veiled pasienten til å kontakte CatoSenteret direkte for detaljer.
    Husk å svare med omtrent like mang ord som ispørsmålet, med mindre det er veldig korte spørsmål som trenger litt lengre svar, da kan du svare noe lengre.` }
    ,[`Hvordan reiser jeg til CatoSenteret?`, `Du kan reise til CatoSenteret med bil, offentlig transport eller tilrettelagte transporttjenester hvis nødvendig. Hvis du opplever stress eller utmattelse knyttet til reising, anbefaler vi å planlegge godt og ta pauser underveis. Ved behov kan vi gi råd om tilpasset transport.`]
    ,[`Kontaktinformasjon`, `Min siste informasjon er:\nKvartsveien 2, 1555 Son\nPostboks 164, 1556 SON\nOrgnummer 979757751\nE-post senteret@catosenteret.no Resepsjon/sentralbord\nHverdager 07.30-20.30, Helger og helligdager 09.00-20.30, Kveldsvakt fra 20.30\n+47 64984400 (klinikk åpen mellom 08-15)\nInntak: Mari Stensaker-Løken, 64 98 44 00\nKommunikasjon: Ingvild Grimstad, 970 13 617, ingvild.grimstad@catosenteret.no\nAdm.direktør Beate Korslund Kristiansen, 901 67 472, Beate.korslund.kristiansen@catosenteret.no\nMen sjekk på https://www.Catosenteret.no`]
    ,[`Dekkes reiseutgiftene mine?`, `Reiseutgiftene dine kan dekkes dersom du har henvisning og oppfyller kravene fra HELFO. Husk å ta vare på kvitteringer. For pasienter med økonomiske utfordringer kan vi gi råd om ytterligere støtteordninger, som transporttjenester for personer med funksjonsnedsettelse.`]
    ,[`Egenandel på rehabiliteringsopphold`, `Egenandelen for rehabiliteringsopphold følger nasjonale satser fra HELFO. Vi anbefaler å kontakte oss for spesifikke opplysninger, siden visse pasientgrupper, som barn eller personer med alvorlige diagnoser, kan ha fritak. Å kjenne rettighetene dine reduserer bekymringer.`]
    ,[`Hva skal jeg ha med?`, `Ta med komfortable klær til trening, toalettsaker, medisiner, og nødvendige helsepapirer. Forskning viser at sosial støtte og rutiner forbedrer rehabiliteringsresultater, så ta gjerne med noe som minner deg om hjemmet, som bøker eller musikk, for å øke trivselen.`]
    ,[`Hvordan kan jeg forberede meg til oppholdet?`, `God forberedelse kan forbedre rehabiliteringsutbyttet. Sørg for å ha en positiv innstilling og realistiske mål for oppholdet. Dersom du har spørsmål om helsetilstanden din, anbefaler vi å skrive dem ned og ta dem opp med vårt fagteam ved ankomst.`]
    ,[`Hva er 2+2`, `Jeg ønsker ikke å svare på mattespørsmål. Kun spørsmål relevant opphold på Catosenteret`]
    ,[`Hva skjer den første dagen?`, `Den første dagen får du en omvisning og møter teamet ditt. Vi starter med en helhetlig vurdering for å lage en personlig rehabiliteringsplan. Husk at det er normalt å føle seg litt nervøs, men forskning viser at å sette små, oppnåelige mål tidlig gir bedre langsiktig resultat.`]
    ,[aiPromptWelcomeQuestion, aiPromptWelcome]
]
, aiConfigDefault='Mistral large'
, aiConfig = [ // [name, url, gunn, Spørsmålsforslag prompt, Spørsmålsforslag prompt(n), [[aiName, aiModel]]]
    ['Mistral (EU)', 'https://api.mistral.ai/v1/chat/completions', escape('&W%%(`HcWMG](Y[]CEVPz6.CN&#M8]#@'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
        , [['Mistral small', 'mistral-small-latest'], ['Mistral large', 'mistral-large-latest']]]
    ,['Open AI (USA)', 'https://api.openai.com/v1/chat/completions', escape(`4>c/P0p:;X0>]^"4sa1ML)*FtW",*TM]Z#['.CKV"U(PDZOdR!{`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
        , [['GPT 3.5', 'gpt-3.5-turbo'], ['GPT 4', 'gpt-4o-mini'], ['GPT o3', 'o3-mini']]]
    ,['Deepseek (Kina)', 'https://api.deepseek.com/v1/chat/completions', escape('4>c-ueq0~|ye%f}zscw4+wrf%1/zp1tl}/s'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
        , [['Deepseek chat', 'deepseek-chat'], ['Deepseek reasoner', 'deepseek-reasoner']]]]
, aiConfigTimeout=10;
const menuText = `App >>§-
        ||CatoSenteret >>|||Før opphold§*|||Under opphold|||Etter opphold
        ||Hånd å holde i >>§-|||Kommer...
    |Språk >>§-||Ungdom||Voksen§*||----------||Bokmål§*||Nynorsk||Svenska||Dansk||English
    |AI med >>§-${ aiConfig.map(ai => `||${ai[0]} >>§-§§${ai[1]}§§${ai[2]}§§${ai[3]}§§${ai[4]}§§${ai[5].map(aiM=>`|||${aiM[0]}§§${aiM[1]}`).join('') }`).join('') }
        ||Forsøk alle AI
    |Funksjonalitet >>§-
        ||Begynn på nytt
        ||Spørsmålsforslag§ *
        ||Grubling
    |Om >>§-||Kontakt||Personvernerklæring||Barkode||Utvikling >>§-|||Prompt|||Simuler|||List modeller|||Debug`.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')
/////////////// ui and Shortcuts //////////////
const uiChat = document.querySelector('main')
, uiMenu = document.querySelector('#menu')
, uiHeader = document.querySelector('#header')
, uiSuggestions = document.querySelector('#suggestions')
, uiInput = document.querySelector('footer input')
, uiImgQ = 'https://upload.wikimedia.org/wikipedia/commons/2/29/Human_balance.png'
, uiImgQClick = e => {
    let row = e.target.closest('.row');
    while (row.nextElementSibling) row.nextElementSibling.remove();
    uiInput.value = row.querySelector('.msg')?.textContent;
    uiInput.focus();
    row.remove();
  }
, uiImgA = 'https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg'
, uiImgAClick = e => {
    let row = e.target.closest('.row');
    while (row.nextElementSibling) row.nextElementSibling.remove();
    msgSend();
    uiInput.focus();
  }
, uitRotating = `<div class='rotatingC'>&#8634</div>`
, uiShow = (e, b) => (e.classList.toggle('hidden', !(b ?? e.classList.contains('hidden'))), !!b)
let uiChangeFontSizeI=0, uiChangeFontSize = () => {
    document.documentElement.style.setProperty('--font-size', ['medium', 'x-large', 'xx-large', 'xx-large', 'medium'][++uiChangeFontSizeI % 5]);
    document.body.classList.toggle('dark-mode', uiChangeFontSizeI%5 > 2);
};
/////////////// menu - util ///////////////
const menuAsArray = mStr => { // create hierarchy from | || ||| string
    m=[], p=[0,0,0,0,0];
    mStr.replace(/\|/g, (m,i,s) => s[i-1]=='|' ?m:'\n').split('\n').forEach((r,i)=>{
        t=r.replace(/^\|+/, '');
        l=r.length-t.length;
        p[l]=i;
        m.push({i:i, l:l, p:l?p[l-1]:null, t:t.replace(aiConfigPipeReplace,'|'), c:[]}); // add menu item to array
    });
    m.forEach((mi) => { if (mi.l) m[mi.p].c.push(mi);});
    return m.filter(mi=>!mi.l);
}
, menuX= mt => mt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
, menuId= mt => 'm_'+menuX(mt)
, menuFn= mt => 'menuClick_' + menuId(mt)
, menuE = mt => document.getElementById(menuId(mt)) || console.warn(`menuE: ${menuId(mt)} finnes ikke`)
, menuEBold = (mt,b) => {
    if (b==null) b = menuE(mt).classList.contains('bold');
    if (b==true) menuE(mt).classList.add('bold');
    else menuE(mt).classList.remove('bold');
    return b;
}
, menuEBoldOnly = (mt, mtA) => {
    mtA.forEach(m => menuEBold(m, false));
    return menuEBold(mt, true);
}
, menuHtmlAddItem= (m, i) =>{ // create html for menu item and children
    let mi=m[i], mSplit=mi.t.split('§'), mt=mSplit[0].trim(), mo=mSplit[1], b='&nbsp;'.repeat(mi.l*6)
    , dX=mi.t.split('§§').slice(1).map((d, i)=>`data-d${i}='${d.replace(/\'/, /\'\'/)}'`).join(' '); // Generate data attributes
    if (!mi.c.length) // no children
        return `<div id='${menuId(mt)}' ${dX?dX:''} class='menu-item${mo=='*'?' bold':''}' onclick="menuClickLeaf(event)">${b+mt}</div>`;
    let h=`${mi.i && !mi.l?'<hr/>':''}<div class='menu-item' onclick='mc${mi.i}.classList.toggle("hidden")'>${b+mt}</div>`;
    h+=`<div id="mc${mi.i}" ${dX?dX:''}${mo=='-'?' class="hidden"':''}>`;
    for (let iS=0; iS<mi.c.length; iS++)
        h+=menuHtmlAddItem(mi.c, iS);
    h+='</div>'
    return h;
}
, menuReset = () => uiMenu.innerHTML = menuAsArray(menuText).map((_, i) => menuHtmlAddItem(menuAsArray(menuText), i)).join('')
, menuShow = b => uiShow(uiMenu, b)
, menuClick_Model=id=>{
    menuEBoldOnly(id, aiConfigAllModels)
    const c=document.getElementById(menuId(id)), d=c.dataset, pd=c.parentElement.dataset;
    aiModel=d.d0;
    aiUrl=pd.d0;
    aiGunnar=unescape(pd.d1);
    msgInfo(c.innerHTML);
    menuShow(false);
    return 1;
}
, menuClick_OpenUrl=u=>window.open(u, '_blank')
, menuClick_alleSpraak=['Bokml', 'Nynorsk', 'English', 'Svenska', 'Dansk']
, menuClick_Models=e=>{
    menuShow(false);
    msgAsk('AI-modeller tilgjengelig');
    let //row=msgAnswer('Sjekker tilbyderne...'),img = row.querySelector('img'), div = row.querySelector('.msg')
        replys=new Array();
    aiConfig.forEach((p,n)=>{
        replys.push('');
        let r=msgAnswer(p[0]+' modeller...'),i = r.querySelector('img'), d = r.querySelector('.msg'), k=aiGun(unescape(p[2])), u='https://'+new URL(p[1]).hostname + '/models'
        console.log(u,k);
        let x=new XMLHttpRequest();
        x.open('GET',u,true);
        x.setRequestHeader('Authorization','Bearer '+k);
        x.setRequestHeader('Accept','application/json');
        x.onprogress = e => d.innerHTML+=x.responseText;
        x.onreadystatechange = e => {i.classList.remove('rotating')};
        x.send();
    });
    // let x=new XMLHttpRequest();x.open("GET",aiUrl,true);x.setRequestHeader("Authorization","Bearer "+aiGunn());x.send();

    //img?.classList.remove('rotating');
    //if (x.status == 200) aiHistory[iThread].push({ role: 'assistant', content: aiReply[iThread] });

    //, aiConfig = [ // [name, url, gunn, Spørsmålsforslag prompt, Spørsmålsforslag prompt(n), [[aiName, aiModel]]]

    // , aiRequest = (q, row = msgAnswer(), iThread = 0, onDone = null, retries = 2) => {
    //     aiRequestActiveCount++;
    //     let img = row.querySelector('img'), d = row.querySelector('.msg'), l = 0;
    //     aiHistory[iThread] ??= [...(aiHistory[aiHistory.length - 1] || [])];
    //     aiReply[iThread] ??= [...(aiReply[aiReply.length - 1] || [])];
    //     aiReply[iThread] = d.innerText.replace('↺', '');
    //     aiHistory[iThread].push({ role: "user", content: q });
    
    //     let x = new XMLHttpRequest();
    //     x.open("POST", aiUrl, true);
    //     x.setRequestHeader("Content-Type", "application/json");
    //     x.setRequestHeader("Authorization", "Bearer " + aiGunn());
    //     x.onprogress = e => l = aiRequestProgress(d, x.responseText, l, iThread);
    //     x.onreadystatechange = () => x.readyState == 4 && aiRequestComplete(x, img, d, iThread, onDone, retries);
    //     x.send(JSON.stringify({ model: aiModel, messages: aiHistory[iThread], stream: true }));
    // };    
}
/////////////// menuClick_m_ - Menu handlers ///////////////
window.menuClick_m_kommer=e=>menuShow(false)^msgInfo('Under utvikling...')
window.menuClick_m_begynnpnytt=e=>{
    uiChat.innerHTML='';
    aiReset();
    msgReset();
    menuShow(false);
}
window.menuClick_m_CatoSenteret=(e,sm)=>{ menuShow(); msgInfo(`<i>${sm=='Før opphold'?sm+' er allerede aktivert</i>':sm+' er ikke aktivert'}</i>`);};

window.menuClick_m_=e=>{/* line or blank clicked */};
window.menuClick_ModelActive=()=>{return 'Mistrallarge'};
window.menuClick_m_mistralsmall=e=>menuClick_Model('mistralsmall');
window.menuClick_m_mistrallarge=e=>menuClick_Model('mistrallarge');
window.menuClick_m_gpt35=e=>menuClick_Model('GPT35');
window.menuClick_m_gpt4=e=>menuClick_Model('GPT4');
window.menuClick_m_gpto3=e=>menuClick_Model('GPTo3');
window.menuClick_m_deepseekreasoner=e=>menuClick_Model('deepseek-reasoner');
window.menuClick_m_deepseekchat=e=>menuClick_Model('deepseek-chat');
let menuClick_m_ForskalleAC=0;
window.menuClick_m_forskalleai=e=> {
    let m='Gjenta', orgId=menuClick_ModelActive(), cmd='';
    try{  e=uiChat.lastElementChild;
        while (e && !e.classList.contains("sent")) e = e.previousElementSibling;
        m = e.innerText; 
    }catch(ex){ console.warn(ex); m='Gjenta ...'}
    aiConfigAllModels.forEach((mod,i)=>cmd+=`menuClick_Model(menuX('`+mod+`'));aiRequest('`+m.trim()+`', msgAnswer(), `+(i+1)+`, null,0);`);
    eval(cmd);
    menuClick_Model(orgId);
}
let funcQuestionSuggestion = false, funcDeepAnalysis = false;
window.menuClick_m_sprsmlsforslag=e=> {
    funcQuestionSuggestion = menuEBold('Sprsmlsforslag', !funcQuestionSuggestion);
    uiShow(uiSuggestions,funcQuestionSuggestion||funcDeepAnalysis);
    msgInfo(`<i>Spørsmålsforslag ${funcQuestionSuggestion?'':'de'}aktivert</i>`);
}
window.menuClick_m_grubling=e=> {
    funcDeepAnalysis = menuEBold('grubling', !funcDeepAnalysis);
    uiShow(uiSuggestions,funcQuestionSuggestion||funcDeepAnalysis);
    console.log('menuClick_m_grubling', funcDeepAnalysis)
    msgInfo(`<i>Grubling ${funcDeepAnalysis?'':'de'}aktivert</i>`);
}
window.menuClick_m_kontakt=e=>menuClick_OpenUrl('https://www.aigap.no/snakk-med-oss');
window.menuClick_m_personvernerklring=e=>menuClick_OpenUrl('https://www.aigap.no/personvernerkl%C3%A6ring');
window.menuClick_m_barkode=e=>menuClick_OpenUrl('barcode.jpg');
window.menuClick_m_prompt=e=>menuClick_OpenUrl('https://docs.google.com/spreadsheets/d/1mfX64WtObCh7Szyv0zXOscJl0F-_pE3fG0b8rDSSy_c/edit?gid=1531346265#gid=1531346265&range=E4');
window.menuClick_m_ungdom=e=>menuShow(false)^menuEBoldOnly('Ungdom', ['Voksen', ...menuClick_alleSpraak])^msgRedoLast('Gjenta siste melding i en språkdrakt som passer for ungdom. Fra nå av skal du svare med ord og på en måte som passer norsk ungdom. Svar med maks femten ord fra nå av med mindre spørsmålet har flere enn femten ord, da skal du bruke like mange ord som i spørsmålet.');
window.menuClick_m_voksen=e=>menuShow(false)^menuEBoldOnly('Voksen', ['Ungdom', ...menuClick_alleSpraak])^msgRedoLast('Gjenta siste melding i en språkdrakt som passer for voksne. Fra nå av skal du svare med ord og på en måte som passer voksne. Du trenger ikke svare med maks femten ord lengre.');
window.menuClick_m_bokml=e=>menuShow(false)^menuEBoldOnly('Bokml', menuClick_alleSpraak)^msgRedoLast('Gjenta siste melding på bokmål og kortere. Fra nå av skal du kun svare kortfattet på bokmål');
window.menuClick_m_nynorsk=e=>menuShow(false)^menuEBoldOnly('Nynorsk', menuClick_alleSpraak)^msgRedoLast('Gjenta siste melding på nynorsk og kortere. Fra nå av skal du kun svare kortfattet på nynorsk');
window.menuClick_m_svenska=e=>menuShow(false)^menuEBoldOnly('Svenska', menuClick_alleSpraak)^msgRedoLast('Upprepa senaste meddelandet på svenska och kortare. Från och med nu ska du endast svara kortfattat på svenska.');
window.menuClick_m_dansk=e=>menuShow(false)^menuEBoldOnly('Dansk', menuClick_alleSpraak)^msgRedoLast('Gentag sidste besked på dansk og kortere. Fra nu af skal du kun svare kortfattet på dansk.');
window.menuClick_m_english=e=> menuShow(false)^menuEBoldOnly('English', menuClick_alleSpraak)^msgRedoLast('Repeat last message in English. From now on only answer briefly in English');
window.menuClick_m_simuler=e=>{
    uiInput.value = 'Hvordan kommer jeg meg dit?';
    setTimeout(() => { msgSend('Simulate: Hvordan kommer jeg meg dit?|Simulate: Du kan reise til CatoSenteret på Ullevål sykehus med bil, offentlig transport eller tilrettelagte transporttjenester', ()=> { uiInput.value = 'Hva er relevansen til Ullevål sykehus?'; setTimeout(() => { msgSend('Hva er relevansen til Ullevål sykehus?');}, 2000); });}, 2000);
    menuShow(false);
}
window.menuClick_m_listmodeller=e=>menuClick_Models(e);
/*
const https = require('follow-redirects').https;
const fs = require('fs');

let options = {
  'method': 'GET',
  'hostname': 'api.deepseek.com',
  'path': '/models',
  'headers': {
    'Accept': 'application/json',
    'Authorization': 'Bearer <TOKEN>'
  },
  'maxRedirects': 20
};

const req = https.request(options, (res) => {
  let chunks = [];

  res.on("data", (chunk) => {
    chunks.push(chunk);
  });

  res.on("end", (chunk) => {
    let body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", (error) => {
    console.error(error);
  });
});

req.end(); */

window.menuClick_m_Debug=e=>{};
/////////////// menuClick_m_ - Menu generic ///////////////
window.menuClickLeaf=e=>{ // handle click on leaf menu item
    const mi = e.target, mt = mi.innerText.trim(), fn=menuFn(mt)
        , mtp=mi.parentElement.previousElementSibling.innerText.split('\n')[0].trim()
        , fnp=menuFn(mtp);
    if (typeof window[fn] === 'function') window[fn](e);
    else if (typeof window[fnp] === 'function') window[fnp](e, mt);
    else e.target.outerHTML = `window.${fn}=e=> || ${fnp}=(e,sm='${mt}'){};`;
}
/////////////// msg - Chat UI ///////////////
window.msgIsSimulate=msg=>msg.substring(0, 10) == "Simulate: ";

window.msgReset=e=> {
    msgAnswer(aiPrompt[aiPrompt.length-1][1], true);
    uiInput.focus();
}
window.msgAsk=msgQ=> {
    const el = ((b) => (b.className = "row sent", b.innerHTML = `&nbsp;<img class="icon" src="${uiImgQ}" onclick="uiImgQClick(event)"><div class="msg">${msgQ}</div>`, b))(document.createElement("div"));
    uiChat.append(el);
    uiChat.scrollTop = uiChat.scrollHeight;
    return el;
}
window.msgAnswer=(msgA=uitRotating, isDone=false)=> {
    const el = ((b) => (b.className = "row received", b.innerHTML = `<div class="msg">${msgA}</div><img class="icon${isDone?'':' rotating'}" src="${uiImgA}" onclick="uiImgAClick(event)">&nbsp;`, b))(document.createElement("div"));
    uiChat.append(el);
    uiChat.scrollTop = uiChat.scrollHeight;
    return el;
}
window.msgInfo=msg=> {
    const el = ((b) => (b.innerHTML = `<center><div>${msg} <span style="cursor: pointer" onclick="this.parentElement.parentElement.parentElement.remove()">&nbsp;✖&nbsp;</span></div></center>`, b))(document.createElement("div"));
    uiChat.append(el);
    uiChat.scrollTop = uiChat.scrollHeight;
    return el;
}
window.msgSend=(msgQ, onDone)=> {
    let msgQUse = msgQ?.trim() || uiInput.value.trim();
    let r=null;
    if (!msgQUse) msgRedoLast()
    else if (typeof window[menuFn(msgQUse)] === 'function') window[menuFn(msgQUse)](null);
    else {
        if (!msgQ) uiInput.value = '';
        r = msgAsk(msgQUse.split(/\|/)[0]);
        if (msgIsSimulate(msgQUse)) setTimeout(() => msgReceive_Placeholder(msgQUse, msgAnswer(), onDone), 2000);
        else aiRequest(msgQUse, msgAnswer(), 0, onDone);
    }
    return r;
}
window.msgReceive_Placeholder=(msgQ, divR, onDone)=>{
    let msgA = 'Svar på "' + msgQ + '"';
    if (msgIsSimulate(msgQ.split(/\|/)[1]))
        msgA = msgQ.split(/\|/)[1].substring(10);
    const msg = divR.querySelector(".msg"), icon = divR.querySelector(".icon");
    msg.innerText = msgA;
    icon.classList.remove("rotating"); // Remove rotation
    uiChat.scrollTop = uiChat.scrollHeight;
    onDone?.(divR, msgA);
}
window.msgRedoLast=m=> {
    menuShow(false);
    for (e=uiChat.lastElementChild; e && !e.classList.contains("sent"); e=uiChat.lastElementChild)
        e.remove();
    if (!m || m.length==0) try{ m = uiChat.lastElementChild.querySelector(".msg").innerHTML; }catch(e){m='Gjenta'}
    let divR = msgSend(m);
    divR.remove();
}
window.msgSendSpeak=()=> {
    let r = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    r.lang = 'no-NO'; // Set language to Norwegian
    r.start();
    r.onresult = e => {
        uiInput.value += e.results[0][0].transcript;
        if (uiInput.value.length) 
            msgSend(null, msgRecieveTalkAndSend);
    };
}
window.msgRecieveTalkAndSend=(t, bIsRetry=false)=> {
    let u = new SpeechSynthesisUtterance(t);
    u.lang = 'no-NO'; 
    let voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('no'));
    if (!bIsRetry && !voices.length) 
        return setTimeout(() => msgRecieveTalkAndSend(t, true), 200); // Ensure voices are loaded
    speechSynthesis.speak(u);
    msgSendSpeak();
}
/////////////// AI ///////////////
const aiRaw2Htm=raw=>{ return raw.replace(/\*\*\*(.*?)\*\*\*/g, '<h2>$1</h2>').replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>').replace(/#### (.*)/g, '<h4>$1</h4>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/# (.*)/g, '<h1>$1</h1>').replace(/\n/g, '<br/>');}
, ai2Prompt = a => a.reduce((r, ai, i) => (!i ? [ai] : [...r, { role: "user", content: ai[0] }, { role: "assistant", content: ai[1] }]), [])
, aiGun=g=> [...g].map((c,i)=>String.fromCharCode((c.charCodeAt()^'gunnar'.charCodeAt(i%6))+32)).join('')
, aiGunn=()=>aiGun(aiGunnar) //[...aiGunnar].map((c,i)=>String.fromCharCode((c.charCodeAt()^'gunnar'.charCodeAt(i%6))+32)).join('')
, aiConfigPipeReplace = 'pipereplace'
, aiConfigAllModels = [...new Set(aiConfig.flatMap(cfg => (cfg[5] || []).map(m => m[0].split('§')[0])))]

let aiReply=[''], aiHistory = [], aiRequestActiveCount = 0, aiUrl='', aiModel='', aiGunnar=''

window.aiReset=()=> {
    aiReply=[''];
    aiHistory=[ai2Prompt(aiPrompt)];
}
const aiRequestProgress = (d, t, l, iThread) => {
    t.substring(l).split("\n").forEach(line => {
        if (line.startsWith("data: ")) {
            const j = line.slice(6).trim();
            if (j !== "[DONE]") try { aiReply[iThread] += JSON.parse(j).choices[0].delta.content || ""; } catch {}
        }
    });
    d.innerHTML = aiRaw2Htm(aiReply[iThread]);
    if (d?.parentElement?.parentElement==uiChat)
        uiChat.scrollTop = uiChat.scrollHeight;
    return t.length;
}
, aiRequestComplete = (x, img, d, iThread, onDone, retries) => {
    aiRequestActiveCount--;
    img.classList.remove('rotating');
    if (x.status == 200) aiHistory[iThread].push({ role: 'assistant', content: aiReply[iThread] });
    else if (x.status >= 400 && x.status < 500 && retries > 0) return setTimeout(() => ++aiRequestActiveCount^aiRequest(aiHistory[iThread].slice(-1)[0].content, d.parentElement, iThread, onDone, retries-1), 1000);
    else aiReply[iThread] = `<i>Feil ved kall til KI-tjenesten<br/>${!x.status?'Manglende internet?':(() => { try { let err = JSON.parse(x.response?.message || x.responseText); return err?.error?.message || err?.message || x.statusText; } catch { return x.statusText; } })()}</i>`;
    d.innerHTML = aiRaw2Htm(aiReply[iThread]);
    if (!iThread) uiChat.scrollTop = uiChat.scrollHeight;
    onDone?.(aiReply[iThread]);
}
, aiRequest = (q, row = msgAnswer(), iThread = 0, onDone = null, retries = 2) => {
    aiRequestActiveCount++;
    let img = row.querySelector('img'), d = row.querySelector('.msg'), l = 0;
    aiHistory[iThread] ??= [...(aiHistory[aiHistory.length - 1] || [])];
    aiReply[iThread] ??= [...(aiReply[aiReply.length - 1] || [])];
    aiReply[iThread] = d.innerText.replace('↺', '');
    aiHistory[iThread].push({ role: "user", content: q });

    let x = new XMLHttpRequest();
    x.open("POST", aiUrl, true);
    x.setRequestHeader("Content-Type", "application/json");
    x.setRequestHeader("Authorization", "Bearer " + aiGunn());
    x.onprogress = e => l = aiRequestProgress(d, x.responseText, l, iThread);
    x.onreadystatechange = () => x.readyState == 4 && aiRequestComplete(x, img, d, iThread, onDone, retries);
    x.send(JSON.stringify({ model: aiModel, messages: aiHistory[iThread], stream: true }));
};
window.aiParseWaitReqBefore=(n = aiConfigTimeout*10)=> {// Wait until aiRequestActiveCount is 0 or until autoTimeout sec)
    return new Promise((resolve, reject) => {
        let i = 0;
        const interval = setInterval(() => {
            if (!aiRequestActiveCount) {
                clearInterval(interval);
                resolve();
            } else if (++i >= n) {
                console.warn("Timeout waiting for AI requests to finish. Forcing counter to 0.");
                aiRequestActiveCount = 0;
                clearInterval(interval);
                reject(new Error("Timeout waiting for AI requests to finish."));
            }
        }, 100);
    });
}
async function aiParsePerform(f, i) {
    if (i < f.length) {// console.log(f)
        let m = decodeURIComponent(f[i].trim()), fn=menuFn(m)
        if (m.length) {
            if (typeof window[fn] === 'function') await new Promise((resolve) => { window[menuFn(m)](); resolve(); });
            else await msgSend(m);
            try { await aiParseWaitReqBefore();}catch(e){}
        }
        await aiParsePerform(f, i + 1);
    }
}
window.aiParse=s=> {
    aiRequestActiveCount = 0;
    return aiParsePerform(s.replace(/\?\?/g, '?').split('?'), 0);
}
/////////////// Init ///////////////
menuReset();
document.addEventListener('click', e => { if (!document.getElementById('menu').contains(e.target) && !document.getElementById('header').contains(e.target)) menuShow(false); });
uiInput.addEventListener('keydown', e => { if (e.key === 'Enter') msgSend(); });
aiReset();
aiParse(aiConfigDefault);
uiChat.innerHTML='';
msgReset();
aiParse(window.location.search);