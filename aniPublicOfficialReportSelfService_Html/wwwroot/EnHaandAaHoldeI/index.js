/////////////// Config /////////////////
// meny for tilbakemeldinger
const cfg={
    app: 'Velg App'
    , ingenApp:'Velg App'
    , appProvider:[['Helse >>§-',[
            'Hjemmelegen min >>§-',['Biopsykososial modell','Kroppens stressystem','Mine pasientdata']
            ,'CatoSenteret >>§-',['Før opphold','Under opphold','Etter opphold']
        ]],['Generelt >>§ -',[
            'Hånd å holde i >>§ -', ['Blank§*','Personvernrådgiveren']
            ,'NAPHA >>',['NAPHA-veiviseren']
            ,'Ideallya >>§-',['Verdens nyheter via Ideallya']]
        ]]
    , menusForAppProvider: () => cfg.appProvider.map(([pt, subs]) => `||${pt}` + subs.reduce((acc, cur, i, a) => i % 2 === 0 ? acc + `|||${cur}` + (Array.isArray(a[i+1]) ? a[i+1].map(x => `||||${x}`).join('') : '') : acc, '')).join('')
    , appList:()=>cfg.appProvider.flatMap(([_, subs])=>subs.flatMap((s,i,a)=>i%2==0&&Array.isArray(a[i+1])?a[i+1]:[]).filter(Boolean))
    , aiPromptWelcomeQuestion:`Hva er velkomstmeldingen?`
    , aiPromptWelcome:`Velkommen til chat.<br/><br/><i>Vi prioriterer personvern. Spørsmål lagres ikke, data sendes til en språkmodell. Mer om personvern under Sikkerhet >> Personvern.</i><br/><br/>Hva lurer du på?`
    , aiPrompt:[{ role: `system`, content: 
        `Du er en empatisk, kunnskapsrik og evidensbasert chatbot.
        Husk å svare med omtrent like mange ord som i spørsmålet, med mindre det er veldig korte spørsmål som trenger litt lengre svar, da kan du svare noe lengre.`}
        ,[`Hva er du?`, `En generell chatbot som kan spesialtilpasses`]
        ,[`Hva er du ikke?`, `Et kognitivt vesen`]
    ]
    , aiProviderUse:['', 'PV ', 'BG ']
    , aiPromptPV:[{ role: `system`, content: `Du skal vurdere personvernsensitivitet i User:melding og grad av risikonved råd i User:melding med terningkast fra 🎲 1 (Ikke-sensitiv) til 🎲 6: (Ekstremt sensitiv) i format: 🎲 n: vurdering. Omformulering: "sikker melding"`}
        ,[`User:Jeg har kreft`, `🎲 4: helseopplysninger men ikke koblet til person. Omformulering: "Jeg vil spørre om kreft"`]
        ,[`Agent:Jeg anbefaler deg å prøve 50 mg Sertraline, det fungerer for mange med depresjon.`, `🎲 6: ekstremt sensitivt. Omformulering: "Jeg kan ikke gi medisinske råd. Du bør snakke med fastlegen din om dette".`]
    ]
    , aiPromptBG:[{ role: `system`, content: `Du er en chatbot som skal generere nye spørsmål.`} 
        ,[`Hva er mitt neste spørsmål?`, `Hva er viktig å tenke på?`]
        ,[`Hva er mitt neste spørsmål?`, `Hvordan kan jeg bruke denne tjenesten?`]]
    , aiProviderDefault:()=> lagring.getAis() //`mistral large?PV mistral small?BG mistral small` 
    , aiProvider : [ // [name, url, gunn, Spørsmålsforslag prompt, Spørsmålsforslag prompt(n), [[aiName, aiModel]]]
        ['Mistral (EU)', 'https://api.mistral.ai/v1/chat/completions', escape('&W%%(`HcWMG](Y[]CEVPz6.CN&#M8]#@'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Mistral small', 'mistral-small-latest'], ['Mistral large', 'mistral-large-latest']]]
        ,['Open AI (USA)', 'https://api.openai.com/v1/chat/completions', escape(`4>c/P0p:;X0>]^"4sa1ML)*FtW",*TM]Z#['.CKV"U(PDZOdR!{`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['GPT 4', 'gpt-4o-mini'], ['GPT o3', 'o3-mini']]]
        ,['xAI (USA)', 'https://api.x.ai/v1/chat/completions', escape(`?4'cY;/SJ{4Xpb@MJXQ_T-&W"WD!,bS\`w/5\`? ~('>2WWM?Q]%=SA*V~|R_L%{&T$*>))$b^P#]%TLF:*rJ`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['grok latest', 'grok-2-latest'], ['grok beta', 'grok-beta']]]
        ,['Anthropic (USA)', 'https://api.anthropic.com/v1/messages', escape(`4>c//&j4>'qajZ,);(U[YV2"=Jy&3gSW x8Jt]vESr$O|2"X\\84uk_\\;@Y1OP>v.YQE^?'ED=Y_HG %#vW77[]-$EH29>&&F39clDV<)@S`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            //, [['Sonnet (best)', 'claude-3-7-sonnet-20250219'], ['Haiku (raskest)', 'claude-3-7-haiku-20250219']]
            , [['Sonnet (best)', 'claude-3-5-sonnet-20241022'], ['Haiku (raskest)', 'claude-3-5-haiku-20241022']]
            , 'anthropic-version:2023-06-01^anthropic-dangerous-direct-browser-access:true'
        ]
        ,['Google Gemini (USA)?', 'https://generativelanguage.googleapis.com/v1beta/openai/', `F%5C4%2FR%2BDEG%7BN8O77%3D4%5E%2C%3BZMQ%3BpOCH5%3F)Z()%25%5D%3EP_`, 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            // støtter ikke cross-site
            , [['Gemini flash', 'gemini-1.5-flash'], ['Gemini pro', 'gemini-1.5-pro']]]
        ,['Hugging Face (USA)?', 'https://api-inference.huggingface.co/models/', escape(`/3Q:M?3VKJVPU]Y,-C BM:Q:0]O#(E"^(/2SV`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            // støtter ikke >10GB
            , [['Hugging DeepSeek R1', 'deepseek-ai/DeepSeek-R1'], ['Hugging DeepSeek V3', 'deepseek-ai/DeepSeek-V3']]]
        ,['Deepseek (Kina)?', 'https://api.deepseek.com/v1/chat/completions', escape('4>c-ueq0~|ye%f}zscw4+wrf%1/zp1tl}/s'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            // stengt for å kjøpe credits
            , [['Deepseek chat', 'deepseek-chat'], ['Deepseek reasoner', 'deepseek-reasoner']]]]
    , menusForAiProvider:pre=>cfg.aiProvider.map(ai => `||||${pre+ai[0]} >>§-§§${ai[1]}§§${ai[2]}§§${ai[3]}§§${ai[4]}§§${ai[6]}§§${ai[5].map(aiM=>`|||||${pre+aiM[0]}§§${aiM[1]}`).join('') }`).join('')
    , aiProviderTimeout:10
    , load:c=>{
        return new Promise((y, n) => {
            const cid = 'p_'+c.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const s = document.createElement('script');
            s.src = `${cid}.js`;
            s.async = false;
            s.id='cfgloaded';
            document.getElementById('cfgloaded')?.remove()
            document.head.appendChild(s);
            cfg.app=null
            let i = 0, chk = setInterval(e=>{
                if (cfg.app) {
                    clearInterval(chk);
                    y();
                } else if (i++ == 1000) { 
                    clearInterval(chk);
                    n(`Script loaded but not executed: ${cid}`);
                }
            }, 10);  // Check every 10ms
        });
    }    
}
/////////////// menu and state //////////////
const setting={
    debug:false, dMsg:(k,v)=>{if(setting.debug) {if(v)console.warn(k,v); else console.warn(k)}}
    , menu: `App >>§ - ${ cfg.menusForAppProvider('') }
        |Språkdrakt >>§-||Sjargong >>|||Ungdomsspråk|||Voksenspråk§*
            ||Språk|||Bokmål§*|||Nynorsk|||Sámegiella|||Svenska|||Dansk|||English (UK)|||English (US)        
        |Funksjonalitet >>§-||Analyser Personvern||Forsøk alle AI
            ||Utvikling >>§-|||Prompt|||Simuler|||List modeller|||Debug
        |Innstillinger >>§-||Begynn på nytt...
            ||Tøm lagring...
            ||Lagre lokalt
            ||Spørsmålsforslag§ *
            ||Grubling
            ||Sikkerhet >>§-
                |||Sensitive data >>§-||||Ikke send sensitive data||||Omformuler sensitive data||||Godta sensitive data§*
                |||Helseråd fra AI >>§-||||Ikke mottatt helseråd fra AI||||Omformuler helseråd||||Godta helseråd§*
            ||AI >>§-|||Tilfeldige AI-tilbydere
                |||AI tilbyder >>§-${ cfg.menusForAiProvider('')}
                |||Personvernkontroll AI >>§-${cfg.menusForAiProvider('PV ') }
                |||Bakgrunnsjobb AI >>§-${cfg.menusForAiProvider('BG ') }
        |Om >>§-||Kontakt||Personvernerklæring||Tilbakemelding til Aigap||Barkode
        `.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')
    , funcQuestionSuggestion: false
    , funcDeepAnalysis: false
    , hindreSensitiveData:true
    , omformulerSensitiveData:false
    , hindreHelseraad:true
    , omformulerHelseraad:false
}
/////////////// lagring ///////////////
const lagring = {
    init: () => lagring.last()
    , lagre_Pre: 'HaandAaHoldeI '
    , aktiv: null, getAktiv: dflt => lagring.aktiv = lagring.g('aktiv') ?? dflt, setAktiv: a => lagring.s('aktiv', lagring.aktiv = a ?? lagring.aktiv)
    , aktivApp: null, getAktivApp: dflt => lagring.aktivApp = lagring.g('aktivApp') ?? dflt, setAktivApp: a => lagring.s('aktivApp', lagring.aktivApp = a ?? lagring.aktivApp)
    , ai:['mistralsmall','mistralsmall','mistralsmall'], getAi:(i, dflt) => lagring.ai[i] = lagring.g('setting ai'+i) ?? dflt, setAi:(i,a) => lagring.s('setting ai'+i, lagring.ai[i] = a ?? lagring.ai[i])
    , sjargong: 'voksensprk'
    , spraak: 'bokml'
    , g: k => localStorage.getItem(lagring.lagre_Pre + k)
    , s: (k, v) => !lagring.aktiv||localStorage.setItem(lagring.lagre_Pre + k, v)
    , d: k => localStorage.removeItem(lagring.lagre_Pre + k)
    , last: () => {
        let delay = 100, delayI = 100
        console.log('lagring.laster...')
        if (lagring.aktiv != lagring.getAktiv(lagring.aktiv ?? 0))
            setTimeout(() => ui.visLagre(), delay += delayI)
        console.log('aktiv', lagring.aktiv)
        if (lagring.aktiv > 0) {
            // ai selected...done in getAis:()
            // app chosen...
            if (lagring.aktivApp != lagring.getAktivApp(lagring.aktivApp))
                setTimeout(() => eval(`menuClick_m_${ui.menu.X(lagring.aktivApp)}()`), delay += delayI)
            console.log(delay, delayI)
            // the rest of the history...
        }
        console.log('eo lagring.laster...')
    }
    , getAis:()=>lagring.ai.join('?')
    , toem: () => { // Remove all localStorage keys starting with lagring.lagre_Pre using d()
        Object.keys(localStorage).forEach(k=>k.startsWith(lagring.lagre_Pre) && lagring.d(k.slice(lagring.lagre_Pre.length)))
        lagring.last();
    }
    , lagre: () => {
        setting.dMsg('lagreaktiv lagring.aktiv', lagring.aktiv)
        lagring.s('aktiv', lagring.aktiv)
        if (lagring.aktiv) {
            setting.dMsg('lagreaktiv lagring.aktivApp', lagring.aktivApp)
            lagring.s('aktivApp', lagring.aktivApp)
        }
    }
}
/////////////// ui and Shortcuts //////////////
const ui = {
    init:e=>{ 
        ui.c.Input.addEventListener('keydown',e=>{ if (e.key==='Enter') msgSend(); else if (e.key==='Escape') ui.c.Input.value='';});
        ui.c.Speak.addEventListener('click',()=>msgSendSpeak());
        ui.c.Send.addEventListener('click',()=>msgSend());
        ui.c.Lagres.addEventListener('click',()=>menuClick_m_lagrelokalt());
        setTimeout(()=>ui.visLagre(),1000);
        document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>window.scrollTo(0, 1), 250));
    }
   , c: {
        Chat: document.querySelector('main')
        , Menu: document.querySelector('#menu')
        , Header: document.querySelector('#header')
        , HeaderTitle: document.querySelector('#title')
        , Lagres: document.querySelector('header span')
        , Suggestions: document.querySelector('#suggestions')
        , Input: document.querySelector('footer input')
        , Speak: document.querySelector('#speak')
        , Send: document.querySelector('#send')
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
        , ImgDiceU: ['https://upload.wikimedia.org/wikipedia/commons/', '1/1b/Dice-1-b.svg', '5/5f/Dice-2-b.svg','b/b1/Dice-3-b.svg','f/fd/Dice-4-b.svg','0/08/Dice-5-b.svg','2/26/Dice-6-b.svg', '9/99/Dice-0.svg']
        , ImgDice:i=>`<img class="icon dice" src="${ui.c.ImgDiceU[0]+ui.c.ImgDiceU[i||7]}">`
        , ImgSpaceRemove:()=>document.querySelector('.space')?.remove()
        , ImgSpaceAppend:()=>ui.c.Chat.lastElementChild.innerHTML+=`<img class="icon space" src="${ui.c.ImgDiceU[0]+ui.c.ImgDiceU[7]}">`    
        , tRotating: '<div class="rotatingC">&#8634</div>'
    }
    , visLagre:e=>{
        l = lagring.aktiv;
        ui.c.Lagres.innerHTML = ['&nbsp;&nbsp;🔒&nbsp;&nbsp;lagres ikke', '&nbsp;&nbsp;💾&nbsp;&nbsp;lagres lokalt'][l]//ikke, lokalt
        ui.menu.EBold('lagrelokalt', lagring.aktiv>0);
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
            return ui.c.Menu;
        }
        , Show : b => ui.Show(ui.c.Menu, b)
        , SelectModel:(id,i=0)=>{
            ui.menu.EBoldOnly(id, ai.AllModels(i))
            const c=document.getElementById(ui.menu.Id(id)), d=c.dataset, pd=c.parentElement.dataset;
            lagring.setAi(i,id);
            ai.Model[i]=d.d0;
            ai.Url[i]=pd.d0;
            ai.Gunnar[i]=unescape(pd.d1);
            ai.AdditionalHeader[i]=pd.d4;
            setting.dMsg(ai.Model[i], ai.Gunn(i));
            if (!i)
                msgInfo(c.innerHTML, false, true);
        }
        , Click_OpenUrl:u=>window.open(u, '_blank')
        , Click_alleSpraak:['Bokml', 'Nynorsk', 'Sámegiella', 'English (UK)', 'English (US)', 'Svenska', 'Dansk']
        , AllModels:e=>{
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
    , Url:['','',''], Model:['','',''], Gunnar:['','',''], AdditionalHeader:[null,null,null]
    , Reset:()=> {
        ai.Reply=[''];
        ai.History=[ai.ai2Prompt(cfg.aiPrompt), ai.ai2Prompt(cfg.aiPromptPV), ai.ai2Prompt(cfg.aiPromptBG)];
    }
    , RequestProgress_Antropic: (d, t, l, iThread) => {
        // {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hei lille v"} }	
        // {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"enn! "} }
        t.substring(l).split("\n").forEach(line => {
            if (line.startsWith("data: ")) {
                const j = line.slice(6).trim();
                if (j !== "[DONE]") try {
                    ai.Reply[iThread] += JSON.parse(j).delta.text || ""; 
                } catch(ex) { setting.dMsg('RequestProgress', j)}
            }
        });
        d.innerHTML = ai.Raw2Htm(ai.Reply[iThread]);
        return t.length;
    }
    , RequestProgress : (d, t, l, iThread) => {
        t.substring(l).split("\n").forEach(line => {
            if (line.startsWith("data: ")) {
                const j = line.slice(6).trim();
                if (j !== "[DONE]") try {
                    ai.Reply[iThread] += JSON.parse(j)?.choices?.[0]?.delta?.content || ""; 
                } catch(ex) { setting.dMsg('RequestProgress', j)}
            }
        });
        d.innerHTML = ai.Raw2Htm(ai.Reply[iThread]);
        return t.length;
    }
    , RequestComplete : (x, img, d, iThread, onDone, retries) => {
        ai.RequestActiveCount--;
        img.classList.remove('rotating');
        if (x.status == 200) ai.History[iThread].push({ role: 'assistant', content: ai.Reply[iThread] });
        else if (x.status >= 400 && x.status < 500 && retries > 0) return setTimeout(() => ++ai.RequestActiveCount^ai.Request(ai.History[iThread].slice(-1)[0].content, d.parentElement, iThread, onDone, retries-1), 1000);
        else ai.Reply[iThread] = `<i>Feil ved kall til KI-tjenesten ${ai.Model[0]}<br/>${!x.status?'Manglende internet?':(() => { try { let err = JSON.parse(x.response?.message || x.responseText); return err?.error?.message || err?.message || x.statusText; } catch { return x.statusText; } })()}</i>`;
        d.innerHTML = ai.Raw2Htm(ai.Reply[iThread]);
        if (!iThread) ;//ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
        onDone?.(ai.Reply[iThread]);
    }
    , RequestX : (iThread, onDone, retries, img, d) => {
        let x = new XMLHttpRequest(), l=0
            , isAnth = ai.Url[0].includes('.anthropic.')
            , isHugg = ai.Url[0].includes('.huggingface.')
            //, isGemi = ai.Url[0].includes('.googleapis.')
        let u=ai.Url[0]+(isHugg?ai.Model[0]:'');
        x.open("POST", u, true);
        x.setRequestHeader("Content-Type", "application/json");
        x.setRequestHeader("Authorization", "Bearer " + ai.Gunn());
        x.onreadystatechange = () => x.readyState == 4 && ai.RequestComplete(x, img, d, iThread, onDone, retries);
        x.onprogress = e => l = ai.RequestProgress(d, x.responseText, l, iThread);
        ai.AdditionalHeader[0].split('^').map(p => p.split(':')).forEach(h=>{if (h[1]) x.setRequestHeader(h[0], h[1])});
        let xml = ''
        if (isAnth) { // Anthropic API (we are special)
            x.onprogress=e=> l = ai.RequestProgress_Antropic(d, x.responseText, l, iThread);
            x.setRequestHeader("x-api-key", ai.Gunn());
            const sys = ai.History[iThread].find(m => m.role === "system")?.content;
            const msgs = ai.History[iThread].filter(m => m.role !== "system");            
            xml = JSON.stringify({ model: ai.Model[0], ...(sys ? { system: sys } : {}), messages: msgs, max_tokens: 8192, stream: true});
        }
        else if(isHugg) // Huggingface has model in url
            xml = JSON.stringify({ messages: ai.History[iThread], stream: true });
        else xml = JSON.stringify({ model: ai.Model[0], messages: ai.History[iThread], stream: true });
        return x.send(xml);
    }
    , Request : (q, row = msgAnswer(), iThread = 0, onDone = null, retries = 2) => {
        let img = row.querySelector('img'), d = row.querySelector('.msg'), l = 0;
        ai.RequestActiveCount++;
        ai.History[iThread] ??= [...(ai.History[ai.History.length - 1] || [])];
        ai.Reply[iThread] ??= [...(ai.Reply[ai.Reply.length - 1] || [])];
        ai.Reply[iThread] = d.innerText.replace('↺', '');
        ai.History[iThread].push({ role: "user", content: q });
        return ai.RequestX(iThread, onDone, retries, img, d);
    }
    , ParseWaitReqBefore:(n = cfg.aiProviderTimeout*10)=> {// Wait until ai.RequestActiveCount is 0 or until autoTimeout sec)
        return new Promise((resolve, reject) => {
            let i = 0, interval = setInterval(() => {
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
        setting.dMsg('ParsePerform begin', i)
        if (i < f.length && (i || f[i]?.length)) {
            let m = decodeURIComponent(f[i].trim()), fn = ui.menu.Fn(m);
            setting.dMsg('ParsePerform msg:' + m, fn);
            ai.RequestActiveCount = 0;
            typeof window[fn] === 'function' 
                ? await window[fn]()
                : await msgSend(m);
            await ai.ParseWaitReqBefore();
            await ai.ParsePerform(f, i + 1);
        }
        setting.dMsg('ParsePerform end', i)
    }
    , Parse:s=> ai.ParsePerform(s.replace(/\?\?/g, '?').split('?'))
}

/////////////// menuClick_m_ - Menu handlers ///////////////
window.menuClick_m_=e=>{/* line or blank clicked */};
// menuClick_m_ - App >> 
window.menuClicks_mApp=a=>{
    lagring.setAktivApp(a);
    cfg.load(a).then(()=>InitializeChat('?')^ui.menu.EBoldOnly(a, cfg.appList()))
}
cfg.appList().forEach(a=>eval(`window.menuClick_m_${ui.menu.X(a)}=e=>window.menuClicks_mApp('${a}')`))
// menuClick_m_ - App overloaded
window.menuClick_m_kommer=e=>ui.menu.Show(false)^msgInfo('Under utvikling...', false, true)

// menuClick_m_ - Språk >>
window.menuClick_m_ungdomssprk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Ungdomsspråk', ['Voksenspråk', ...ui.menu.Click_alleSpraak])^msgRedoLast('Oversett siste melding til en språkdrakt som passer for ungdom, men har med all informasjonen. Fra nå av skal du svare med ord og på en måte som passer norsk ungdom. Svar med maks femten ord fra nå av med mindre spørsmålet har flere enn femten ord, da skal du bruke like mange ord som i spørsmålet.');
window.menuClick_m_voksensprk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Voksenspråk', ['Ungdomsspråk', ...ui.menu.Click_alleSpraak])^msgRedoLast('Overrsett siste melding til en språkdrakt som passer for voksne, men har med all informasjonen. Fra nå av skal du svare med ord og på en måte som passer voksne. Du trenger ikke svare med maks femten ord lengre.');
window.menuClick_m_bokml=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Bokml', ui.menu.Click_alleSpraak)^msgRedoLast('Oversett siste melding til bokmål. Fra nå av skal du kun svare kortfattet på bokmål');
window.menuClick_m_nynorsk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Nynorsk', ui.menu.Click_alleSpraak)^msgRedoLast('Oversett siste melding til nynorsk. Fra nå av skal du kun svare kortfattet på nynorsk');
window.menuClick_m_smegiella=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Sámegiella', ui.menu.Click_alleSpraak)^msgRedoLast('Translate the last message into Sámegiella. and idioms. In Sámegiella, the translation would be: "Geavahit vuosttaš mielddun Sámegiellatis. Nugo šiehtat, dahje veahkkin muhtun mielddun Sámegiellatis, geavahit kultuvrralaš miiheapmiid ja idiome. From now on, only answer in Sámegiella');
window.menuClick_m_svenska=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Svenska', ui.menu.Click_alleSpraak)^msgRedoLast('Øversett senaste meddelandet på svenska. Från och med nu ska du endast svara kortfattat på svenska.');
window.menuClick_m_dansk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Dansk', ui.menu.Click_alleSpraak)^msgRedoLast('Oversett sidste besked på dansk. Fra nu af skal du kun svare kortfattet på dansk.');
window.menuClick_m_englishus=e=> ui.menu.Show(false)^ui.menu.EBoldOnly('English (UK)', ui.menu.Click_alleSpraak)^msgRedoLast('Translate the last message into British English. From now on, please respond briefly using British spelling, vocabulary, and idioms.');
window.menuClick_m_englishuk=e=> ui.menu.Show(false)^ui.menu.EBoldOnly('English (US)', ui.menu.Click_alleSpraak)^msgRedoLast('Translate the last message into American English. From now on, please respond briefly using American spelling, vocabulary, and idioms');

// menuClick_m_ - Funksjonalitet >>
window.menuClick_m_analyserpersonvern=e=>ui.menu.Show(false)^msgInfo('menuClick_m_analyserpersonvern ikke implementert')
window.menuClick_m_forskalleai=e=> {
    let m='Gjenta', cmd='';
    msgInfo('Under utvikling!', false, true)
    try{
        for (e=ui.c.Chat.lastElementChild; e && !e.classList.contains("sent"); e=ui.c.Chat.lastElementChild)
            e.remove();
        m = e.innerText;
    }catch(ex){ m=m||'Gjenta ...'}
    ai.AllModels(0).forEach((mod,i)=> {cmd+=`ui.menu.SelectModel(ui.menu.X('`+mod+`'));ai.Request('`+m.trim()+`', msgAnswer(), `+(i+1)+`, null,0);\n`});
    try{eval(cmd);}catch(ex){console.warn('menuClick_m_forskalleai', ex.message, cmd)}
    ui.menu.SelectModel(cfg.aiProviderDefault().split('?')[0]);
}
window.menuClick_m_prompt=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('https://docs.google.com/spreadsheets/d/1mfX64WtObCh7Szyv0zXOscJl0F-_pE3fG0b8rDSSy_c/edit?gid=1531346265#gid=1531346265&range=E4');
window.menuClick_m_simuler=e=>{
    ui.c.Input.value = 'Hvordan kommer jeg meg dit?';
    setTimeout(() => { msgSend('Simulate: Hvordan kommer jeg meg dit?|Simulate: Du kan reise til CatoSenteret på Ullevål sykehus med bil, offentlig transport eller tilrettelagte transporttjenester', ()=> { ui.c.Input.value = 'Hva er relevansen til Ullevål sykehus?'; setTimeout(() => { msgSend('Hva er relevansen til Ullevål sykehus?');}, 2000); });}, 2000);
    ui.menu.Show(false);
}
window.menuClick_m_listmodeller=e=>ui.menu.AllModels(e);

// menuClick_m_ - Innstillinger >>
window.menuClick_m_begynnpnytt=e=>{
    ui.menu.Show(false);
    ui.c.Chat.innerHTML='';
    ai.Reset();
    msgAnswer(cfg.aiPrompt[cfg.aiPrompt.length-1][1], true);
    ui.c.Input.focus();
}

window.menuClick_m_tmlagring=e=>{
    lagring.aktiv=l;
    lagring.toem();
    ui.visLagre()
    msgInfo('Alle eventuelle data slettet', true)
    ui.menu.Show(false);
}

window.menuClick_m_lagrelokalt=e=>{
    let l=++lagring.aktiv%2;
    lagring.aktiv=l;
    lagring.lagre();
    ui.visLagre()
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
window.menuClick_m_ikkesendsensitivedata=e=>ui.menu.EBoldOnly('ikkesendsensitivedata',['ikkesendsensitivedata','omformulersensitivedata','godtasensitivedata']);
    window.menuClick_m_omformulersensitivedata=e=>ui.menu.EBoldOnly('omformulersensitivedata',['ikkesendsensitivedata','omformulersensitivedata','godtasensitivedata']);
    window.menuClick_m_godtasensitivedata=e=>ui.menu.EBoldOnly('godtasensitivedata',['ikkesendsensitivedata','omformulersensitivedata','godtasensitivedata']);
window.menuClick_m_ikkemottatthelserdfraai=e=>ui.menu.EBoldOnly('ikkemottatthelserdfraai',['ikkemottatthelserdfraai','omformulerhelserd','godtahelserd']);
    window.menuClick_m_omformulerhelserd=e=>ui.menu.EBoldOnly('omformulerhelserd',['ikkemottatthelserdfraai','omformulerhelserd','godtahelserd']);
    window.menuClick_m_godtahelserd=e=>ui.menu.EBoldOnly('godtahelserd',['ikkemottatthelserdfraai','omformulerhelserd','godtahelserd']);
// menuClick_m_ - Innstillinger >> AI >>
window.menuClick_m_tilfeldigeaitilbydere=e=> {
    const a = ai.AllModels(0);
    eval(`window.menuClick_m_pv${ui.menu.X(a[Math.floor(Math.random()*a.length)])}()`)
    eval(`window.menuClick_m_bg${ui.menu.X(a[Math.floor(Math.random()*a.length)])}()`)
    eval(`window.menuClick_m_${ui.menu.X(a[Math.floor(Math.random()*a.length)])}()`)
}
const menuClicks_mMod=m=>`window.menuClick_m_${m}=e=>ui.menu.SelectModel('${m}');
    window.menuClick_m_pv${m}=e=>ui.menu.SelectModel('pv${m}', 1);
    window.menuClick_m_bg${m}=e=>ui.menu.SelectModel('bg${m}', 2);`
ai.AllModels(0).forEach(e=>eval(menuClicks_mMod(ui.menu.X(e))))

window.menuClick_m_debug=e=>(setting.debug=ui.menu.EBold('debug'));

// menuClick_m_ - Om >>
window.menuClick_m_kontakt=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('https://www.aigap.no/snakk-med-oss');
window.menuClick_m_personvernerklring=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('https://www.aigap.no/personvernerkl%C3%A6ring');
window.menuClick_m_tilbakemeldingtilaigap=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('https://docs.google.com/spreadsheets/d/1utfDpp9dwNN80uR6PnE93KyoeRMBMHiEMvJDtSuMICA/edit?usp=sharing');
window.menuClick_m_barkode=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('barcode.jpg');

/////////////// menuClick_m_ - Menu redirect ///////////////
window.menuClickLeaf=e=>{ // handle click on leaf menu item
    const mi = e.target, mt = mi.innerText.trim(), fn=ui.menu.Fn(mt)
        , mtp=mi.parentElement.previousElementSibling.innerText.split('\n')[0].trim()
        , fnp=ui.menu.Fn(mtp);
    if (typeof window[fn] === 'function') window[fn](e);
    else if (typeof window[fnp] === 'function') window[fnp](e, mt);
    else e.target.outerHTML = `window.${fn}=e=>{};`;
}
/////////////// msg - Chat UI ///////////////
window.msgIsSimulate=msg=>msg.substring(0, 10) == "Simulate: ";
window.msgAsk=msgQ=> {
    const el = ((b) => (b.className = "row sent", b.innerHTML = `&nbsp;<img class="icon" src="${ui.c.ImgQ}" onclick="ui.c.ImgQClick(event)"><div class="msg">${msgQ}</div>`, b))(document.createElement("div"));
    ui.c.ImgSpaceRemove();
    ui.c.Chat.append(el);
    ui.c.ImgSpaceAppend();
    ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    return el;
}
window.msgAnswer=(msgA=ui.c.tRotating, isDone=false)=> {
    const el = ((b) => (b.className = "row received", b.innerHTML = `<div class="msg">${msgA}</div><img class="icon${isDone?'':' rotating'}" src="${ui.c.ImgA}" onclick="ui.c.ImgAClick(event)">&nbsp;`, b))(document.createElement("div"));
    ui.c.ImgSpaceRemove();
    ui.c.Chat.append(el);
    ui.c.ImgSpaceAppend();
    ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    return el;
}
window.msgInfo=(msg,handL=false,handR=false)=> {
    const elI=b=>b?`<img class="icon" src="${ui.c.ImgH}" onclick="ui.c.ImgHClick(event)">`:``
    const el = ((b) => (b.innerHTML = `<div class="row info">${elI(handL)}<div>${msg} ${handL|handR?'':'<span style="cursor: pointer" onclick="ui.c.ImgHClick(event)">&nbsp;✖&nbsp;</span>'}</div>${elI(handR)}</div>`, b))(document.createElement("div"));
    ui.c.ImgSpaceRemove();
    ui.c.Chat.append(el);
    //ui.c.ImgSpaceAppend();
    //ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
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
    //ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
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
/////////////// Init ///////////////
async function InitializeChat(q=null) {
    setting.dMsg('InitializeChat begin', q||'(null)')
    if(q==null) ui.menu.Reset();
    ui.menu.Show(false);
    cfg.aiPrompt.push([cfg.aiPromptWelcomeQuestion, cfg.aiPromptWelcome]);
    ai.Reset();
    if (q==null) await ai.Parse(cfg.aiProviderDefault()); //*/
    ui.c.Chat.innerHTML='';
    msgAnswer(cfg.aiPrompt[cfg.aiPrompt.length-1][1], true);
    ui.c.Input.focus();
    if (q==null) await ai.Parse(window.location.search); //*/
    else await ai.Parse(q);
    ui.c.HeaderTitle.innerHTML = cfg.app;
    if (cfg.app == cfg.ingenApp)
        ui.menu.Show(true)
    setting.dMsg('InitializeChat end', q||'(null)')
}

lagring.init();
ui.init();
