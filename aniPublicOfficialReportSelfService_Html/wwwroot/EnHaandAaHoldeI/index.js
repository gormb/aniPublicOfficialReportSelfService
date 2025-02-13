/////////////// Config /////////////////
const msgWelcomeText=//`Velkommen til foreldrelaget chat for de som skal inn på CatoSenteret, hva er ditt første spørsmål?`
`Velkommen! Denne chatten svarer på spørsmål du har om oppholdet ditt på CatoSenteret. Hva lurer du på?`
,aiPrompt=[{ role: `system`, content: `Du er en empatisk, kunnskapsrik og evidensbasert chatbot som hjelper pasienter som forbereder seg til sitt første opphold på CatoSenteret. 
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
    ,['Hva er velkomstmeldingen?', msgWelcomeText]
] 
, aiConfigPipeReplace = '{pipe}'
, aiConfig = [ //todo: hent algoritme fra ekstrafelter på menyen
 // [name, url, gunn, Spørsmålsforslag prompt, Spørsmålsforslag prompt(n), [[aiName, aiModel]]]
    ['Open AI (USA)', 'https://api.openai.com/v1/chat/completions', `4>c/P0p:;X0>]^"4sa1ML)*FtW",*TM]Z#['.CKV"U(PDZOdR!{`, 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
        , [['GPT 3.5', 'gpt-3.5-turbo'], ['GPT 4§*', 'gpt-4o-mini'], ['GPT o3', 'o3-mini']]]
    ,['Deepseek (Kina)', 'https://api.deepseek.com/v1/chat', '4>c-ueq0~'+aiConfigPipeReplace+'ye%f}zscw4+wrf%1/zp1tl}/s', 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
        , [['R1', 'R1-model-name'], ['V3', 'v3-model-name']]]
];
const menuText = `App >>§ -
    ||CatoSenteret >>|||Før opphold§*|||Under opphold|||Etter opphold
    ||Hånd å holde i >>§-|||Kommer...
|AI med >>§-${ aiConfig.map(ai => `||${ai[0]} >>§!${ai[1]}${ai[2]}${ai[3]}${ai[5].map(aiM=>`|||${aiM[0]}`).join('') }`).join('') }
|Funksjonalitet og språk >>§ -
    ||Språk >>|||Bokmål§*|||Nynorsk|||English|||Ungdomsspråk
    ||Begynn på nytt
    ||Spørsmålsforslag§ *
    ||Dypanalyse
|Om >>§-||Kontakt||Personvernerklæring||Barkode||Utvikling >>§-|||Prompt|||Simuler|||Debug`.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')
/////////////// Shortcuts //////////////
const chat = document.querySelector('main')
, menu = document.querySelector('#menu')
, header = document.querySelector('#header')
, suggestions = document.querySelector('#suggestions')
, input = document.querySelector('footer input')
, imgQ = 'https://upload.wikimedia.org/wikipedia/commons/2/29/Human_balance.png'
, imgA = 'https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg'
, tRotating = `<div class='rotatingC'>&#8634</div>`;
let uiChangeFontSizeI=0, uiChangeFontSize = () => {
    document.documentElement.style.setProperty('--font-size', ['medium', 'x-large', 'xx-large', 'xx-large', 'medium'][++uiChangeFontSizeI % 5]);
    document.body.classList.toggle('dark-mode', uiChangeFontSizeI%5 > 2);
};
/////////////// menu - Menu UI ///////////////
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
, menuId= mt => 'm_'+mt.replace(/[^a-zA-Z0-9]/g, '')
, menuE = mt => document.getElementById(menuId(mt)) || console.log(`menuE: ${mt} finnes ikke`)
, menuEBold = (mt,b) => {
    if (b==null) b = menuE(mt).classList.contains('bold');
    if (b==true) menuE(mt).classList.add('bold');
    else menuE(mt).classList.remove('bold');
    return b;
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
, eShow = (e, b) => (e.classList.toggle('hidden', !(b ?? e.classList.contains('hidden'))), !!b)
, menuShow = b => eShow(menu, b);
/////////////// menuClick_m_ - Menu handlers ///////////////
const menuClick_OpenUrl=u=>window.open(u, '_blank');
function menuClick_m_Begynnpnytt(e){
    chat.innerHTML='';
    aiReset();
    msgReset();
    menuShow(false);
}
function menuClick_m_CatoSenteret(e,sm){ menuShow(); msgInfo(`<i>${sm=='Før opphold'?sm+' er allerede aktivert</i>':sm+' er ikke aktivert'}</i>`);};

function menuClick_m_OpenAIUSA(e,sm){ //menuShow() 
    menuEBoldOnly(e.target.innerText, ['GPT 4', 'GPT 3.5', 'GPT o3', 'R1', 'V3']);
    switch (sm) {
        case 'GPT 3.5': return msgInfo('<i>Bytte til Open AI algoritme '+sm+' er ikke ferdig kodet</i>')
        case 'GPT 4': return msgInfo('<i>Bytte til Open AI algoritme '+sm+' er ikke ferdig kodet</i>');
        case 'GPT o3': return msgInfo('<i>Bytte til Open AI algoritme '+sm+' er ikke ferdig kodet</i>');
    }
    msgInfo('<i>Bytte til Open AI algoritme '+sm+' er ikke ferdig kodet</i>');
};
function menuClick_m_DeepseekKina(e,sm) {
    menuEBoldOnly(e.target.innerText, ['GPT 4', 'GPT 3.5', 'GPT o3', 'R1', 'V3']);
    switch (sm) {
        case 'V3': return msgInfo('Deepseek V3 not available yet');
        case 'R1': return msgInfo('Deepseek R3 reasoning not available yet'); 
    }
    msgInfo('<i>Bytte til Deepseek algoritme '+sm+' er ikke ferdig kodet</i>');
};
let funcQuestionSuggestion = false, funcDeepAnalysis = false;
function menuClick_m_Sprsmlsforslag(e) {
    funcQuestionSuggestion = menuEBold('Sprsmlsforslag', !funcQuestionSuggestion);
    eShow(suggestions,funcQuestionSuggestion||funcDeepAnalysis);
    msgInfo(`<i>Spørsmålsforslag ${funcQuestionSuggestion?'':'de'}aktivert</i>`);
}
function menuClick_m_Dypanalyse(e) {
    funcDeepAnalysis = menuEBold('Dypanalyse', !funcDeepAnalysis);
    eShow(suggestions,funcQuestionSuggestion||funcDeepAnalysis);
    console.log(funcDeepAnalysis)
    msgInfo(`<i>Dypanalyse ${funcDeepAnalysis?'':'de'}aktivert</i>`);
}
window.menuClick_m_Kontakt=e=>menuClick_OpenUrl('https://www.aigap.no/snakk-med-oss');
window.menuClick_m_Personvernerklring=e=>menuClick_OpenUrl('https://www.aigap.no/personvernerkl%C3%A6ring');
window.menuClick_m_Barkode=e=>menuClick_OpenUrl('barcode.jpg');
window.menuClick_m_Prompt=e=>menuClick_OpenUrl('https://docs.google.com/spreadsheets/d/1mfX64WtObCh7Szyv0zXOscJl0F-_pE3fG0b8rDSSy_c/edit?gid=1531346265#gid=1531346265&range=E4');
window.menuClick_m_Bokml=e=> menuShow(false)|msgRedoLast('Gjenta siste melding på bokmål og kortere. Fra nå av skal du kun svare kortfattet på bokmål');
window.menuClick_m_Nynorsk=e=>menuShow(false)|msgRedoLast('Gjenta siste melding på nynorsk og kortere. Fra nå av skal du kun svare kortfattet på nynorsk');
window.menuClick_m_English=e=> menuShow(false)|msgRedoLast('Repeat last message in English. From now on only answer briefly in English');
window.menuClick_m_Ungdomssprk=e=> menuShow(false)|msgRedoLast('Gjenta siste melding i en språkdrakt som passer for ungdom. Fra nå av skal du svare med ord og på en måte som passer norsk ungdom. Svar med maks femten ord fra nå av med mindre spørsmålet har flere enn femten ord, da skal du bruke like mange ord som i spørsmålet.');
function menuClick_m_Simuler(e){
    inp.value = 'Hvordan kommer jeg meg dit?';
    setTimeout(() => { msgSend('Simulate: Hvordan kommer jeg meg dit?|Simulate: Du kan reise til CatoSenteret på Ullevål sykehus med bil, offentlig transport eller tilrettelagte transporttjenester', ()=> { inp.value = 'Hva er relevansen til Ullevål sykehus?'; setTimeout(() => { msgSend('Hva er relevansen til Ullevål sykehus?');}, 2000); });}, 2000);
    menuShow(false);
}
function menuClick_m_Debug(e){
}
/////////////// menuClick_m_ - Menu generic ///////////////
function menuClickLeaf(e){ // handle click on leaf menu item
    const mi = e.target, mt = mi.innerText.trim(), fn='menuClick_'+menuId(mt)
        , mtp=mi.parentElement.previousElementSibling.innerText.split('\n')[0].trim()
        , fnp='menuClick_'+menuId(mtp);
    if (typeof window[fn] === 'function') window[fn](e);
    else if (typeof window[fnp] === 'function') window[fnp](e, mt);
    else e.target.outerHTML = `function ${fn}(e){} || ${fnp}(e,sm='${mt}'){};`;
}
/////////////// msg - Chat UI ///////////////
function msgIsSimulate(msg) { return msg.substring(0, 10) == "Simulate: "; }  

function msgReset() {
    msgAnswer(aiPrompt[aiPrompt.length-1][1], true);
    input.focus();
}
function msgAsk(msgQ) {
    const el = ((b) => (b.className = "row sent", b.innerHTML = `&nbsp;<img class="icon" src="${imgQ}"><div class="msg">${msgQ}</div>`, b))(document.createElement("div"));
    chat.append(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
}
function msgAnswer(msgA=tRotating, isDone=false) {
    const el = ((b) => (b.className = "row received", b.innerHTML = `<div class="msg">${msgA}</div><img class="icon${isDone?'':' rotating'}" src="${imgA}">&nbsp;`, b))(document.createElement("div"));
    chat.append(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
}
function msgInfo(msg) {
    const el = ((b) => (b.innerHTML = `<center><div>${msg} <span style="cursor: pointer" onclick="this.parentElement.parentElement.parentElement.remove()">&nbsp;✖&nbsp;</span></div></center>`, b))(document.createElement("div"));
    chat.append(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
}
function msgSend(msgQ, onDone) {
    let msgQUse = msgQ?.trim() || input.value.trim();
    let r=null;
    if (!msgQUse) msgRedoLast()
    else if (typeof window['menuClick_'+menuId(msgQUse)] === 'function') window['menuClick_'+menuId(msgQUse)](null);
    else {
        if (!msgQ) input.value = '';
        r = msgAsk(msgQUse.split(/\|/)[0]);
        if (msgIsSimulate(msgQUse)) setTimeout(() => msgReceive_Placeholder(msgQUse, msgAnswer(), onDone), 2000);
        else aiRequest(msgQUse, msgAnswer(), 0, onDone);
    }
    return r;
}
function msgReceive_Placeholder(msgQ, divR, onDone) {
    let msgA = 'Svar på "' + msgQ + '"';
    if (msgIsSimulate(msgQ.split(/\|/)[1]))
        msgA = msgQ.split(/\|/)[1].substring(10);
    const msg = divR.querySelector(".msg"), icon = divR.querySelector(".icon");
    msg.innerText = msgA;
    icon.classList.remove("rotating"); // Remove rotation
    chat.scrollTop = chat.scrollHeight;
    onDone?.(divR, msgA);
}
function msgRedoLast(m) {
    menuShow(false);
    for (e=chat.lastElementChild; e && !e.classList.contains("sent"); e=chat.lastElementChild)
        e.remove();
    if (!m || m.length==0) try{ m = chat.lastElementChild.querySelector(".msg").innerHTML; }catch(e){m='Gjenta'}
    let divR = msgSend(m);
    divR.remove();
}
function msgSendSpeak() {
    let r = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    r.lang = 'no-NO'; // Set language to Norwegian
    r.start();
    r.onresult = e => {
        inp.value += e.results[0][0].transcript;
        if (inp.value.length) 
            msgSend(null, msgRecieveTalkAndSend);
    };
}
function msgRecieveTalkAndSend(t, bIsRetry=false) {
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
, aiUrl='https://api.openai.com/v1/chat/completions'
, aiModel=['o3-mini', 'gpt-4o-mini', 'gpt-3.5-turbo'][0]
, aiGunnar=`4>c/P0p:;X0>]^"4sa1ML)*FtW",*TM]Z#['.CKV"U(PDZOdR!{`
//, aiUrl='https://api.deepseek.com/v1/chat/completions'//, aiModel='V3'// , aiGunnar=`4>c-ueq0~|ye%f}zscw4+wrf%1/zp1tl}/s` 
, aiGunn=()=> [...aiGunnar].map((c,i)=>String.fromCharCode((c.charCodeAt()^'gunnar'.charCodeAt(i%6))+32)).join('')

let aiReply=[''], aiHistory = [], aiRequestActiveCount = 0;

function aiReset() {
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
    return t.length;
};
const aiRequestComplete = (x, img, d, iThread, onDone) => {
    aiRequestActiveCount--;
    img.classList.remove('rotating');
    if (x.status == 200)
        aiHistory[iThread].push({ role: 'assistant', content: aiReply[iThread] });
    else
        aiReply[iThread] = `<i>Feil ved kall til KI-tjenesten<br/>${!x.status?'Manglende internet?':(() => {
            try { return JSON.parse(x.responseText)?.error?.message || x.statusText; } catch { return x.statusText; }
            })()}</i>`;
    d.innerHTML = aiRaw2Htm(aiReply[iThread]);
    if (!iThread) chat.scrollTop = chat.scrollHeight;
    onDone?.(aiReply[iThread]);
};
const aiRequest = (q, row = msgAnswer(), iThread = 0, onDone = null) => {
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
    x.onreadystatechange = () => x.readyState == 4 && aiRequestComplete(x, img, d, iThread, onDone);
    x.send(JSON.stringify({ model: aiModel, messages: aiHistory[iThread], stream: true }));
};
function aiParseWaitReqBefore(n = 100) {// Wait until aiRequestActiveCount is 0 or until maxChecks is reached (default 100 * 100ms = 10 sec)
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
    if (i < f.length) {
        let m = decodeURIComponent(f[i].trim());
        if (m.length) {
            if (typeof window['menuClick_' + menuId(m)] === 'function') await new Promise((resolve) => { window['menuClick_' + menuId(m)](); resolve(); });
            else await msgSend(m);
            try { await aiParseWaitReqBefore();}catch(e){}
        }
        await aiParsePerform(f, i + 1);
    }
}
function aiParse(s) {
    aiRequestActiveCount = 0;
    aiParsePerform(s.replace(/\?\?/g, '?').split('?'), 0);
}
/////////////// Init ///////////////
menuReset();
document.addEventListener('click', e => { if (!document.getElementById('menu').contains(e.target) && !document.getElementById('header').contains(e.target)) menuShow(false); });
input.addEventListener('keydown', e => { if (e.key === 'Enter') msgSend(); });
aiReset();
msgReset();
aiParse(window.location.search);

//aiParse('?Ungdomsspråk?Hvordan skjer inntaket?');
//aiParse('?Ungdomsspråk?Hvor%20er%20det??Hva er dagsprogrammet??');
//menuShow();