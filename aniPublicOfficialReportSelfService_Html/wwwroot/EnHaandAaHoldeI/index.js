/////////////// Config /////////////////
const cfg={
    app:'(Blank)'
    , appList:['Før opphold', 'Under opphold', 'Etter opphold', 'Personvernrådgiveren', 'Blank', 'Biopsykososial forståelsesmodell', 'Kroppens stressystem']
    , aiPromptWelcomeQuestion:`Hva er velkomstmeldingen?`
    , aiPromptWelcome:`Velkommen til chat.<br/><br/><i>Vi prioriterer personvern. Spørsmål lagres ikke, data sendes til en språkmodell. Mer om personvern under Sikkerhet >> Personvern.</i><br/><br/>Hva lurer du på?`
    , aiPrompt:[{ role: `system`, content: 
        `Du er en empatisk, kunnskapsrik og evidensbasert chatbot.
        Husk å svare med omtrent like mange ord som i spørsmålet, med mindre det er veldig korte spørsmål som trenger litt lengre svar, da kan du svare noe lengre.`}
        ,[`Hva er du?`, `En generell chatbot som kan spesialtilpasses`]
        ,[`Hva er du ikke?`, `Et kognitivt vesen`]
    ]
    , aiProviderUse:['', 'PV ', 'BG ']
    , aiProviderDefault:`mistral large?PV mistral small?BG mistral small` /* spørremodell?pvspørremodell */
    , aiProvider : [ // [name, url, gunn, Spørsmålsforslag prompt, Spørsmålsforslag prompt(n), [[aiName, aiModel]]]
        ['Mistral (EU)§-', 'https://api.mistral.ai/v1/chat/completions', escape('&W%%(`HcWMG](Y[]CEVPz6.CN&#M8]#@'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Mistral small', 'mistral-small-latest'], ['Mistral large', 'mistral-large-latest']]]
        ,['Open AI (USA)', 'https://api.openai.com/v1/chat/completions', escape(`4>c/P0p:;X0>]^"4sa1ML)*FtW",*TM]Z#['.CKV"U(PDZOdR!{`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['GPT 3.5', 'gpt-3.5-turbo'], ['GPT 4', 'gpt-4o-mini'], ['GPT o3', 'o3-mini']]]
        ,['Deepseek (Kina)', 'https://api.deepseek.com/v1/chat/completions', escape('4>c-ueq0~|ye%f}zscw4+wrf%1/zp1tl}/s'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Deepseek chat', 'deepseek-chat'], ['Deepseek reasoner', 'deepseek-reasoner']]]]
    , menusForAiProvider:pre=>cfg.aiProvider.map(ai => `|||${pre+ai[0]} >>§-§§${ai[1]}§§${ai[2]}§§${ai[3]}§§${ai[4]}§§${ai[5].map(aiM=>`||||${pre+aiM[0]}§§${aiM[1]}`).join('') }`).join('')
    , aiProviderTimeout:10
    , load:c=>{
        return new Promise((resolve, reject) => {
            const cid = 'p_'+c.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const s = document.createElement('script');
            s.src = `${cid}.js`;    
            s.onload = () => resolve(cfg.aiPrompt); // Resolve with updated cfg.aiPrompt
            s.onerror = () => reject(`Kunne ikke laste ${c}`);    
            document.head.appendChild(s);
        });
    }    
}
/////////////// menu //////////////
const setting={
    menu: `App >>§ -
            ||CatoSenteret >>§-|||Før opphold|||Under opphold|||Etter opphold
            ||Hjemmelegen min >>§-|||Biopsykososial forståelsesmodell|||Kroppens stressystem
            ||Hånd å holde i >>§ -|||Blank§*|||Personvernrådgiveren|||Kommer...
        |Språk >>§-||Ungdom||Voksen§*||----------||Bokmål§*||Nynorsk||Svenska||Dansk||English
        |Sikkerhet >>§-||Personvern||Analyser Personvern
            ||----------
            ||Ikke send sensitive data§*
            ||Omformuler sensitive data
            ||Godta sensitive data
            ||----------
            ||Ikke mottatt helseråd fra AI§*
            ||Omformuler helseråd
            ||Godta helseråd
        |Funksjonalitet >>§-
            ||AI tilbyder >>§ -${ cfg.menusForAiProvider('')}
            ||Personvernkontroll AI >>§-${cfg.menusForAiProvider('PV ') }
            ||Bakgrunnsjobb AI >>§-${cfg.menusForAiProvider('BG ') }
            ||----------
            ||Forsøk alle AI
            ||Begynn på nytt
            ||Spørsmålsforslag§ *
            ||Grubling
        |Om >>§-||Kontakt||Personvernerklæring||Barkode||Utvikling >>§-|||Prompt|||Simuler|||List modeller|||Debug`.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')
    //, menuClick_m_ForskalleAC:0
    , funcQuestionSuggestion: false
    , funcDeepAnalysis: false
    , hindreSensitiveData:true
    , omformulerSensitiveData:false
    , hindreHelseraad:true
    , omformulerHelseraad:false
}
/////////////// ui and Shortcuts //////////////
const ui = {
    c: {
        Chat: document.querySelector('main')
        , Menu: document.querySelector('#menu')
        , Header: document.querySelector('#header')
        , HeaderTitle: document.querySelector('#title')
        , Suggestions: document.querySelector('#suggestions')
        , Input: document.querySelector('footer input')
        , ImgQ: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Human_balance.png'
        , ImgQClick: e => {
            let r=e.target.closest('.row');
            while(r.nextElementSibling)
                r.nextElementSibling.remove();
            ui.c.Input.value=r.querySelector('.msg')?.textContent; ui.c.Input.focus();
            r.remove();
        }
        , ImgA: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg'
        , ImgAClick: e => { let r=e.target.closest('.row'); while(r.nextElementSibling) r.nextElementSibling.remove(); msgSend(); ui.c.Input.focus(); }
        , ImgH: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Point.svg'
        , ImgHClick: e => e.target.parentElement.parentElement.remove()
        , tRotating: '<div class="rotatingC">&#8634</div>'
    }
    , Show: (el,b) => (el.classList.toggle('hidden', !(b ?? el.classList.contains('hidden'))), !!b)
    , _sizeI: 0,
    ChangeFontSize() {
      document.documentElement.style.setProperty('--font-size', ['medium','x-large','xx-large','xx-large','medium'][++this._sizeI % 5]);
      document.body.classList.toggle('dark-mode', this._sizeI % 5 > 2);
    }
    , menu : {
        AsArray (mStr) { // create hierarchy from | || ||| string
            m=[], p=[0,0,0,0,0];
            mStr.replace(/\|/g, (m,i,s) => s[i-1]=='|' ?m:'\n').split('\n').forEach((r,i)=>{
                t=r.replace(/^\|+/, '');
                l=r.length-t.length;
                p[l]=i;
                m.push({i:i, l:l, p:l?p[l-1]:null, t:t.replace(ai.ConfigPipeReplace,'|'), c:[]}); // add menu item to array
            });
            m.forEach((mi) => { if (mi.l) m[mi.p].c.push(mi);});
            return m.filter(mi=>!mi.l);
        }
        , X: mt => mt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        , Id: mt => 'm_'+ui.menu.X(mt)
        , Fn: mt => 'menuClick_' + ui.menu.Id(mt)
        , E : mt => document.getElementById(ui.menu.Id(mt)) || console.warn(`ui.menu.E: ${ui.menu.Id(mt)} finnes ikke`)
        , EBold : (mt,b=null) => {
            let e=ui.menu.E(mt)
            if (b==null) b = !e.classList.contains('bold');
            if (b==true) e.classList.add('bold');
            else e.classList.remove('bold');
            return b;
        }
        , EBoldOnly : (mt, mtA) => {
            mtA.forEach(m => ui.menu.EBold(m, false));
            return ui.menu.EBold(mt, true);
        }
        , HtmlAddItem: (m, i) =>{ // create html for menu item and children
            let mi=m[i], mSplit=mi.t.split('§'), mt=mSplit[0].trim(), mo=mSplit[1], b='&nbsp;'.repeat(mi.l*6)
            , dX=mi.t.split('§§').slice(1).map((d, i)=>`data-d${i}='${d.replace(/\'/, /\'\'/)}'`).join(' '); // Generate data attributes
            if (!mi.c.length) // no children
                return `<div id='${ui.menu.Id(mt)}' ${dX?dX:''} class='menu-item${mo=='*'?' bold':''}' onclick="menuClickLeaf(event)">${b+mt}</div>`;
            let h=`${mi.i && !mi.l?'<hr/>':''}<div class='menu-item' onclick='mc${mi.i}.classList.toggle("hidden")'>${b+mt}</div>`;
            h+=`<div id="mc${mi.i}" ${dX?dX:''}${mo=='-'?' class="hidden"':''}>`;
            for (let iS=0; iS<mi.c.length; iS++)
                h+=ui.menu.HtmlAddItem(mi.c, iS);
            h+='</div>'
            return h;
        }
        , Reset:()=> {
            ui.c.Menu.innerHTML = ui.menu.AsArray(setting.menu).map((_, i) => ui.menu.HtmlAddItem(ui.menu.AsArray(setting.menu), i)).join('')
            document.addEventListener('click', e => { if (!document.getElementById('menu').contains(e.target) && !document.getElementById('header').contains(e.target)) ui.menu.Show(false); });
        }
        , Show : b => ui.Show(ui.c.Menu, b)
        , Click_Model:(id,i=0)=>{
            ui.menu.EBoldOnly(id, ai.AllModels(i))
            const c=document.getElementById(ui.menu.Id(id)), d=c.dataset, pd=c.parentElement.dataset;
            ai.Model[i]=d.d0;
            ai.Url[i]=pd.d0;
            ai.Gunnar[i]=unescape(pd.d1);
            if (!i)
                msgInfo(c.innerHTML, false, true);
            ui.menu.Show(false);
        }
        , Click_OpenUrl:u=>window.open(u, '_blank')
        , Click_alleSpraak:['Bokml', 'Nynorsk', 'English', 'Svenska', 'Dansk']
        , Click_Models:e=>{
            Show(false);
            msgAsk('AI-modeller tilgjengelig');
            let //row=msgAnswer('Sjekker tilbyderne...'),img = row.querySelector('img'), div = row.querySelector('.msg')
                replys=new Array();
            cfg.aiProvider.forEach((p,n)=>{
                replys.push('');
                let r=msgAnswer(p[0]+' modeller...'),i = r.querySelector('img'), d = r.querySelector('.msg'), k=aiGun(unescape(p[2])), u='https://'+new URL(p[1]).hostname + '/models'
                let x=new XMLHttpRequest();
                x.open('GET',u,true);
                x.setRequestHeader('Authorization','Bearer '+k);
                x.setRequestHeader('Accept','application/json');
                x.onprogress = e => d.innerHTML+=x.responseText;
                x.onreadystatechange = e => {i.classList.remove('rotating')};
                x.send();
            });
        }
    }
    , init:e=> ui.c.Input.addEventListener('keydown', e => { if (e.key === 'Enter') msgSend(); })
};
ui.init();
/////////////// menuClick_m_ - Menu handlers ///////////////
window.menuClick_m_kommer=e=>ui.menu.Show(false)^msgInfo('Under utvikling...', false, true)
window.menuClick_m_begynnpnytt=e=>{
    ui.menu.Show(false);
    ui.c.Chat.innerHTML='';
    ai.Reset();
    msgAnswer(cfg.aiPrompt[cfg.aiPrompt.length-1][1], true);
    ui.c.Input.focus();
}

window.menuClick_m_fropphold=e=>cfg.load('Før opphold').then(SoonInitializeChat('')^ui.menu.EBoldOnly('Før opphold', cfg.appList))
window.menuClick_m_underopphold=e=>cfg.load('Under opphold').then(SoonInitializeChat('')^ui.menu.EBoldOnly('Under opphold', cfg.appList))
window.menuClick_m_etteropphold=e=>cfg.load('Etter opphold').then(SoonInitializeChat('')^ui.menu.EBoldOnly('Etter opphold', cfg.appList))

window.menuClick_m_personvernrdgiveren=e=>cfg.load('Personvernrådgiveren').then(SoonInitializeChat('')^ui.menu.EBoldOnly('Personvernrådgiveren', cfg.appList))
window.menuClick_m_blank=e=>cfg.load('(blank)').then(SoonInitializeChat('')^ui.menu.EBoldOnly('(blank)', cfg.appList))
window.menuClick_m_biopsykososialforstelsesmodell=e=>cfg.load('Biopsykososial forståelsesmodell').then(SoonInitializeChat('')^ui.menu.EBoldOnly('Biopsykososial forståelsesmodell', cfg.appList))
window.menuClick_m_kroppensstressystem=e=>cfg.load('Kroppens stressystem').then(SoonInitializeChat('')^ui.menu.EBoldOnly('Kroppens stressystem', cfg.appList))

window.menuClick_m_=e=>{/* line or blank clicked */};
window.menuClick_m_mistralsmall=e=>ui.menu.Click_Model('mistralsmall');
    window.menuClick_m_pvmistralsmall=e=>ui.menu.Click_Model('pvmistralsmall', 1);
    window.menuClick_m_bgmistralsmall=e=>ui.menu.Click_Model('bgmistralsmall', 2);
window.menuClick_m_mistrallarge=e=>ui.menu.Click_Model('mistrallarge');
    window.menuClick_m_pvmistrallarge=e=>ui.menu.Click_Model('pvmistrallarge', 1);
    window.menuClick_m_bgmistrallarge=e=>ui.menu.Click_Model('bgmistrallarge', 2);
window.menuClick_m_gpt35=e=>ui.menu.Click_Model('GPT35');
    window.menuClick_m_pvgpt35=e=>ui.menu.Click_Model('pvGPT35', 1);
    window.menuClick_m_bggpt35=e=>ui.menu.Click_Model('bgGPT35', 2);
window.menuClick_m_gpt4=e=>ui.menu.Click_Model('GPT4');
    window.menuClick_m_pvgpt4=e=>ui.menu.Click_Model('pvGPT4', 1);
    window.menuClick_m_bggpt4=e=>ui.menu.Click_Model('bgGPT4', 2);
window.menuClick_m_gpto3=e=>ui.menu.Click_Model('GPTo3');
    window.menuClick_m_pvgpto3=e=>ui.menu.Click_Model('pvGPTo3', 1);
    window.menuClick_m_bggpto3=e=>ui.menu.Click_Model('bgGPTo3', 2);
window.menuClick_m_deepseekreasoner=e=>ui.menu.Click_Model('deepseek-reasoner');
    window.menuClick_m_pvdeepseekreasoner=e=>ui.menu.Click_Model('pvdeepseek-reasoner', 1);
    window.menuClick_m_bgdeepseekreasoner=e=>ui.menu.Click_Model('bgdeepseek-reasoner', 2);
window.menuClick_m_deepseekchat=e=>ui.menu.Click_Model('deepseek-chat');
    window.menuClick_m_pvdeepseekchat=e=>ui.menu.Click_Model('pvdeepseek-chat', 1);
    window.menuClick_m_bgdeepseekchat=e=>ui.menu.Click_Model('bgdeepseek-chat', 2);
window.menuClick_m_forskalleai=e=> {
    let m='Gjenta', cmd='';
    try{
        for (e=ui.c.Chat.lastElementChild; e && !e.classList.contains("sent"); e=ui.c.Chat.lastElementChild)
            e.remove();
        m = e.innerText;
    }catch(ex){ m=m||'Gjenta ...'}

    ai.AllModels(0).forEach((mod,i)=> {cmd+=`ui.menu.Click_Model(ui.menu.X('`+mod+`'));ai.Request('`+m.trim()+`', msgAnswer(), `+(i+1)+`, null,0);\n`});
    
    try{eval(cmd);}catch(ex){console.warn('menuClick_m_forskalleai', ex.message, cmd)}
    ui.menu.Click_Model(cfg.aiProviderDefault.split('?')[0]);
}
window.menuClick_m_sprsmlsforslag=e=> {
    setting.funcQuestionSuggestion = ui.menu.EBold(e.target.innerText, !setting.funcQuestionSuggestion);
    ui.Show(ui.c.Suggestions, setting.funcQuestionSuggestion||setting.funcDeepAnalysis);
    msgInfo(`<i>Spørsmålsforslag ${setting.funcQuestionSuggestion?'':'de'}aktivert</i>`);
}
window.menuClick_m_grubling=e=> {
    setting.funcDeepAnalysis = ui.menu.EBold(e.target.innerText, !setting.funcDeepAnalysis);
    ui.Show(ui.c.Suggestions, setting.funcQuestionSuggestion||setting.funcDeepAnalysis);
    msgInfo(`<i>Grubling ${setting.funcDeepAnalysis?'':'de'}aktivert</i>`);
}
window.menuClick_m_personvern=e=>menuClick_m_personvernerklring(e) ;

//window.menuClick_m_analyserpersonvern=e=>msgInfo( ;

window.menuClick_m_hindresensitivedata=e=>setting.hindreSensitiveData=ui.menu.EBold(e.target.innerText) ;
window.menuClick_m_omformulersensitivedata=e=>setting.omformulerSensitiveData=ui.menu.EBold(e.target.innerText) ;
window.menuClick_m_hindrehelserdmottattavai=e=>setting.hindreHelseraad=ui.menu.EBold(e.target.innerText) ;
window.menuClick_m_omformulerhelserd=e=>setting.omformulerHelseraad=ui.menu.EBold(e.target.innerText) ;

window.menuClick_m_kontakt=e=>ui.menu.Click_OpenUrl('https://www.aigap.no/snakk-med-oss');
window.menuClick_m_personvernerklring=e=>ui.menu.Click_OpenUrl('https://www.aigap.no/personvernerkl%C3%A6ring');
window.menuClick_m_barkode=e=>ui.menu.Click_OpenUrl('barcode.jpg');
window.menuClick_m_prompt=e=>ui.menu.Click_OpenUrl('https://docs.google.com/spreadsheets/d/1mfX64WtObCh7Szyv0zXOscJl0F-_pE3fG0b8rDSSy_c/edit?gid=1531346265#gid=1531346265&range=E4');
window.menuClick_m_ungdom=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Ungdom', ['Voksen', ...ui.menu.Click_alleSpraak])^msgRedoLast('Oversett siste melding til en språkdrakt som passer for ungdom, men har med all informasjonen. Fra nå av skal du svare med ord og på en måte som passer norsk ungdom. Svar med maks femten ord fra nå av med mindre spørsmålet har flere enn femten ord, da skal du bruke like mange ord som i spørsmålet.');
window.menuClick_m_voksen=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Voksen', ['Ungdom', ...ui.menu.Click_alleSpraak])^msgRedoLast('Overrsett siste melding til en språkdrakt som passer for voksne, men har med all informasjonen. Fra nå av skal du svare med ord og på en måte som passer voksne. Du trenger ikke svare med maks femten ord lengre.');
window.menuClick_m_bokml=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Bokml', ui.menu.Click_alleSpraak)^msgRedoLast('Overrsett siste melding til bokmål. Fra nå av skal du kun svare kortfattet på bokmål');
window.menuClick_m_nynorsk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Nynorsk', ui.menu.Click_alleSpraak)^msgRedoLast('Overrsett siste melding til nynorsk. Fra nå av skal du kun svare kortfattet på nynorsk');
window.menuClick_m_svenska=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Svenska', ui.menu.Click_alleSpraak)^msgRedoLast('Øversett senaste meddelandet på svenska. Från och med nu ska du endast svara kortfattat på svenska.');
window.menuClick_m_dansk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Dansk', ui.menu.Click_alleSpraak)^msgRedoLast('Oversett sidste besked på dansk. Fra nu af skal du kun svare kortfattet på dansk.');
window.menuClick_m_english=e=> ui.menu.Show(false)^ui.menu.EBoldOnly('English', ui.menu.Click_alleSpraak)^msgRedoLast('Translate last message to English. From now on only answer briefly in English');
window.menuClick_m_simuler=e=>{
    ui.c.Input.value = 'Hvordan kommer jeg meg dit?';
    setTimeout(() => { msgSend('Simulate: Hvordan kommer jeg meg dit?|Simulate: Du kan reise til CatoSenteret på Ullevål sykehus med bil, offentlig transport eller tilrettelagte transporttjenester', ()=> { ui.c.Input.value = 'Hva er relevansen til Ullevål sykehus?'; setTimeout(() => { msgSend('Hva er relevansen til Ullevål sykehus?');}, 2000); });}, 2000);
    ui.menu.Show(false);
}
window.menuClick_m_listmodeller=e=>ui.menu.Click_Models(e);
window.menuClick_m_debug=e=>{};
/////////////// menuClick_m_ - Menu generic ///////////////
window.menuClickLeaf=e=>{ // handle click on leaf menu item
    const mi = e.target, mt = mi.innerText.trim(), fn=ui.menu.Fn(mt)
        , mtp=mi.parentElement.previousElementSibling.innerText.split('\n')[0].trim()
        , fnp=ui.menu.Fn(mtp);
    if (typeof window[fn] === 'function') window[fn](e);
    else if (typeof window[fnp] === 'function') window[fnp](e, mt);
    else e.target.outerHTML = `window.${fn}=e=> || ${fnp}=(e,sm='${mt}'){};`;
}
/////////////// msg - Chat UI ///////////////
window.msgIsSimulate=msg=>msg.substring(0, 10) == "Simulate: ";
window.msgAsk=msgQ=> {
    const el = ((b) => (b.className = "row sent", b.innerHTML = `&nbsp;<img class="icon" src="${ui.c.ImgQ}" onclick="ui.c.ImgQClick(event)"><div class="msg">${msgQ}</div>`, b))(document.createElement("div"));
    ui.c.Chat.append(el);
    ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    return el;
}
window.msgAnswer=(msgA=ui.c.tRotating, isDone=false)=> {
    const el = ((b) => (b.className = "row received", b.innerHTML = `<div class="msg">${msgA}</div><img class="icon${isDone?'':' rotating'}" src="${ui.c.ImgA}" onclick="ui.c.ImgAClick(event)">&nbsp;`, b))(document.createElement("div"));
    ui.c.Chat.append(el);
    ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    return el;
}
window.msgInfo=(msg,handL=false,handR=false)=> {
    const elI=b=>b?`<img class="icon" src="${ui.c.ImgH}" onclick="ui.c.ImgHClick(event)">`:``
    const el = ((b) => (b.innerHTML = `<div class="row info">${elI(handL)}<div>${msg} ${handL|handR?'':'<span style="cursor: pointer" onclick="ui.c.ImgHClick(event)">&nbsp;✖&nbsp;</span>'}</div>${elI(handR)}</div>`, b))(document.createElement("div"));
    ui.c.Chat.append(el);
    ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    return el;
}
window.msgSend=(msgQ, onDone)=> {
    let msgQUse = msgQ?.trim() || ui.c.Input.value.trim();
    let r=null;
    if (!msgQUse) msgRedoLast()
    else if (typeof window[ui.menu.Fn(msgQUse)] === 'function') window[ui.menu.Fn(msgQUse)](null);
    else {
        if (!msgQ) ui.c.Input.value = '';
        r = msgAsk(msgQUse.split(/\|/)[0]);
        if (msgIsSimulate(msgQUse)) setTimeout(() => msgReceive_Placeholder(msgQUse, msgAnswer(), onDone), 2000);
        else ai.Request(msgQUse, msgAnswer(), 0, onDone);
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
    ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    onDone?.(divR, msgA);
}
window.msgRedoLast=m=> {
    ui.menu.Show(false);
    for (e=ui.c.Chat.lastElementChild; e && !e.classList.contains("sent"); e=ui.c.Chat.lastElementChild)
        e.remove();
    if (!m || m.length==0) try{ m = ui.c.Chat.lastElementChild.querySelector(".msg").innerHTML; }catch(e){m='Gjenta'}
    let divR = msgSend(m);
    divR.remove();
}
window.msgSendSpeak=()=> {
    let r = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    r.lang = 'no-NO'; // Set language to Norwegian
    r.start();
    r.onresult = e => {
        ui.c.Input.value += e.results[0][0].transcript;
        if (ui.c.Input.value.length) 
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
const ai={
    Raw2Htm:raw=>{ return raw.replace(/\*\*\*(.*?)\*\*\*/g, '<h2>$1</h2>').replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>').replace(/#### (.*)/g, '<h4>$1</h4>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/# (.*)/g, '<h1>$1</h1>').replace(/\n/g, '<br/>');}
    , ai2Prompt: a => a.reduce((r, ai, i) => (!i ? [ai] : [...r, { role: "user", content: ai[0] }, { role: "assistant", content: ai[1] }]), [])
    , Gun:(g)=> [...g].map((c,i)=>String.fromCharCode((c.charCodeAt()^'gunnar'.charCodeAt(i%6))+32)).join('')
    , Gunn:i=>ai.Gun(ai.Gunnar[i||0])
    , ConfigPipeReplace : 'pipereplace'
    , AllModels :i=> [...new Set(cfg.aiProvider.flatMap(c => (c[5] || []).map(m => cfg.aiProviderUse[i]+m[0].split('§')[0])))]
    , Reply:[''], History : [], RequestActiveCount : 0
    , Url:['','',''], Model:['','',''], Gunnar:['','','']
    , Reset:()=> {
        ai.Reply=[''];
        ai.History=[ai.ai2Prompt(cfg.aiPrompt)];
    }
    , RequestProgress : (d, t, l, iThread) => {
        t.substring(l).split("\n").forEach(line => {
            if (line.startsWith("data: ")) {
                const j = line.slice(6).trim();
                if (j !== "[DONE]") try { ai.Reply[iThread] += JSON.parse(j).choices[0].delta.content || ""; } catch {}
            }
        });
        d.innerHTML = ai.Raw2Htm(ai.Reply[iThread]);
        if (d?.parentElement?.parentElement==ui.c.Chat)
            ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
        return t.length;
    }
    , RequestComplete : (x, img, d, iThread, onDone, retries) => {
        ai.RequestActiveCount--;
        img.classList.remove('rotating');
        if (x.status == 200) ai.History[iThread].push({ role: 'assistant', content: ai.Reply[iThread] });
        else if (x.status >= 400 && x.status < 500 && retries > 0) return setTimeout(() => ++ai.RequestActiveCount^ai.Request(ai.History[iThread].slice(-1)[0].content, d.parentElement, iThread, onDone, retries-1), 1000);
        else ai.Reply[iThread] = `<i>Feil ved kall til KI-tjenesten<br/>${!x.status?'Manglende internet?':(() => { try { let err = JSON.parse(x.response?.message || x.responseText); return err?.error?.message || err?.message || x.statusText; } catch { return x.statusText; } })()}</i>`;
        d.innerHTML = ai.Raw2Htm(ai.Reply[iThread]);
        if (!iThread) ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
        onDone?.(ai.Reply[iThread]);
    }
    , Request : (q, row = msgAnswer(), iThread = 0, onDone = null, retries = 2) => {
        ai.RequestActiveCount++;
        let img = row.querySelector('img'), d = row.querySelector('.msg'), l = 0;
        ai.History[iThread] ??= [...(ai.History[ai.History.length - 1] || [])];
        ai.Reply[iThread] ??= [...(ai.Reply[ai.Reply.length - 1] || [])];
        ai.Reply[iThread] = d.innerText.replace('↺', '');
        ai.History[iThread].push({ role: "user", content: q });

        let x = new XMLHttpRequest();
        x.open("POST", ai.Url[0], true);
        x.setRequestHeader("Content-Type", "application/json");
        x.setRequestHeader("Authorization", "Bearer " + ai.Gunn());
        x.onprogress = e => l = ai.RequestProgress(d, x.responseText, l, iThread);
        x.onreadystatechange = () => x.readyState == 4 && ai.RequestComplete(x, img, d, iThread, onDone, retries);
        x.send(JSON.stringify({ model: ai.Model[0], messages: ai.History[iThread], stream: true }));
    }
    , ParseWaitReqBefore:(n = cfg.aiProviderTimeout*10)=> {// Wait until ai.RequestActiveCount is 0 or until autoTimeout sec)
        return new Promise((resolve, reject) => {
            let i = 0;
            const interval = setInterval(() => {
                if (!ai.RequestActiveCount) {
                    clearInterval(interval);
                    resolve();
                } else if (++i >= n) {
                    console.warn("Timeout waiting for AI requests to finish. Forcing counter to 0.");
                    ai.RequestActiveCount = 0;
                    clearInterval(interval);
                    reject(new Error("Timeout waiting for AI requests to finish."));
                }
            }, 100);
        });
    }
    , async ParsePerform(f, i=0) {
        if (i < f.length) {
            if (i||f[i]) 
                { // ignore first parameter if blank
                let m = decodeURIComponent(f[i].trim())
                ai.RequestActiveCount = 0;
                if (typeof window[ui.menu.Fn(m)] === 'function') await new Promise((resolve) => { window[ui.menu.Fn(m)](); resolve(); });
                else await msgSend(m);
                try { await ai.ParseWaitReqBefore();}catch(e){}
            }
            await ai.ParsePerform(f, i + 1);
        }
    }
    , Parse:s=> ai.ParsePerform(s.replace(/\?\?/g, '?').split('?'))
}
/////////////// Init ///////////////
function InitializeChat(q=null) {
    if(q==null) ui.menu.Reset();
    ui.menu.Show(false);
    cfg.aiPrompt.push([cfg.aiPromptWelcomeQuestion, cfg.aiPromptWelcome]);
    ai.Reset();
    ui.c.Chat.innerHTML='';
    msgAnswer(cfg.aiPrompt[cfg.aiPrompt.length-1][1], true);
    ui.c.Input.focus();
    ai.Parse(q!=null?q:cfg.aiProviderDefault+window.location.search); //*/
    ui.c.HeaderTitle.innerHTML = cfg.app;
}

function SoonInitializeChat(q)
{
    ui.c.HeaderTitle.innerHTML = '&nbsp;';
    setTimeout(() => { InitializeChat(q)}, 1000);
}