/////////////// ai ///////////////
const ai={
    Raw2Htm:raw=> raw.replace(/\*\*\*(.*?)\*\*\*/g, '<h2>$1</h2>').replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>').replace(/#### (.*)/g, '<h4>$1</h4>').replace(/### (.*)/g, '<h3>$1</h3>').replace(/## (.*)/g, '<h2>$1</h2>').replace(/# (.*)/g, '<h1>$1</h1>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>').replace(/\n/g, '<br/>')
    , ai2Prompt: a => a.reduce((r, ai, i) => (!i ? [ai] : [...r, { role: "user", content: ai[0] }, { role: "assistant", content: ai[1] }]), [])
    , Gun:(g)=> [...g].map((c,i)=>String.fromCharCode((c.charCodeAt()^'gunnar'.charCodeAt(i%6))+32)).join('')
    , Gunn:i=>ai.Gun(ai.Gunnar[i||0])
    , ConfigPipeReplace : 'pipereplace'
    , AllModels :i=> [...new Set(cfg.aiProvider.flatMap(c => (c[5] || []).map(m => cfg.aiProviderUse[i]+m[0].split('§')[0])))]
    , Reply:[''], History : [], RequestActiveCount : 0
    , Url:['','',''], SugQ:[['',''],['',''],['','']], Model:['','',''], Gunnar:['','',''], AdditionalHeader:[null,null,null]
    , Reset:()=> {
        ai.Reply=[''];
        ai.History=[ai.ai2Prompt(cfg.aiPrompt), ai.ai2Prompt(cfg.aiPromptPV), ai.ai2Prompt(cfg.aiPromptBG)];
    }
    , RequestProgress_Antropic: (d, t, l, iThread) => {
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
        img?.classList.remove('rotating');
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
            , isHugg = ai.Url[0].includes('.huggingface.') //, isGemi = ai.Url[0].includes('.googleapis.')
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
        let img = row.querySelector('img'), d = row.querySelector('.msg')??row, l = 0;
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
        setting.dMsg('ParsePerform begin', i, f)
        if (i < f.length && (i || f[i]?.length)) {
            let m = decodeURIComponent(f[i].trim()), fn = ui.menu.Fn(m);
            setting.dMsg('ParsePerform msg:' + m, fn);
            ai.RequestActiveCount = 0;
            typeof window[fn] === 'function' 
                ? await window[fn]()
                : await msgSend(m);
            await ai.ParseWaitReqBefore();
        }
        if (i < f.length) 
            await ai.ParsePerform(f, i + 1);
        setting.dMsg('ParsePerform end', i)
    }
    , Parse:s=> ai.ParsePerform(s.split('?'))
} //*/
/////////////// cfg /////////////////
const cfg={
    app: 'Velg App'
    , ingenApp:'Velg App'
    , appProvider_Man:[['Personlig >>§-',[
            'Hånd å holde i >>§ -', ['Hvordan har du det?','Personvernrådgiveren']
            ,'Hjernetrim >>§-', ['Tankefeilvarsler','Enkel EQ-test']
            ,'Nyheter >>§-', ['Verdens nyheter via Ideallya']
        ]],['Helse >>§-',[
            'Hjemmelegen min >>§-',['Mottak og triage', 'Hjemmelegen min', 'Ikke-medisinsk oppfølging']
            ,'Hlm - forløp og data >>§-',['Mine pasientdata', 'Pakkeforløp']
            ,'Hlm - spesialist >>§-',['Biopsykososial modell','Kroppens stressystem','Autismespekter usynlig']
            ,'CatoSenteret >>§-',['Før opphold','Under opphold','Etter opphold']
        ]],['Offentlig >>§-',[
            'Assistert veiledning >>§-', ['NO Min Offentlige Hjelper','NO Enkel Navigatør','NO Alt Om Tjenester','NO TjenesteGuide','NO Alt På Ett Sted']
            ,'Assistert personlig støtte >>§-', ['NO Din Offentlige Partner','NO Min Digitale Venn','NO RettighetsVakten','NO KlarTale','NO HverdagsHjelpen']
        ]],['Virksomhet >>§-',[
            'Ansatt >>§-', ['Ansatt: reisen', 'Ansatt: karriereveiledning']
            ,'Leder >>§-', ['Leder: ny i rollen', 'Leder: beslutningshjelp', 'Leder: økonomi', 'Leder: forbedring', 'Leder: LMX']
            ,'HR >>§-', ['HR: Ansettelsen', 'HR: Medarbeidersamtale', 'HR: Oppsigelsen', 'HR: Restrukturering']
            ,'IT >>§-', ['ROS assistent', 'ITIL-hjelper']
        ]],['Event >>§-',[
            'Lansering >>§-', ['IT-revyens årsmøte']
            ,'Folk >>§-', ['Om Silje Føyen', 'Om Gorm Braarvig']
            ,'Konferanse >>§-', ['NAPHA-veiviseren', 'TEDxFredrikstad 2025', 'EVENTxOslo 2025']
        ]]]
    , appProvider_Db:[['Generelt','Ny','Koblingsfeil!']]
    , appProviderM:ver=>{//cfg.appProvider_Man// merge loaded from db
        //Object.entries([...cfg.appProvider_Man.flatMap(([m,s])=>s.flatMap((v,i,a)=>i%2?v.map(App=>({App,mor:a[i-1].slice(0,-5),mormor:m.slice(0,-5)})):[]),...Object.values(cfg.appProvider_Db.reduce((a,r)=>(a[r.App]=r,a),{})))].reduce((o,{App,mor,mormor})=>((o[mormor+' >>§-']??={})[mor+' >>§-']??=new Set()).add(App),o={})&&o).map(([m,s])=>[m,Object.entries(s).flatMap(([k,v])=>[k,[...v]])])
        let ap=JSON.parse(JSON.stringify(cfg.appProvider_Man)), apM=[['Generelt >>§-',['Test']],['Ny mormor',['Ny mor']]];
        ver=='admin'&&ap.forEach((mm,i)=>ap[i][1].forEach((m,j)=>!(j%2)||ap[i][1][j].push('<< ny/endre/slett app >>'))^
            ap[i][1].push(['<< ny/endre/slett mor >>']))^ap.push(['<< ny/endre/slett mormor >>',[]])
        return ap;
    }
    , menusForAppProvider:ver=> cfg.appProviderM(ver).map(([pt, subs]) => `||${pt}` + subs.reduce((acc, cur, i, a) => i % 2 === 0 ? acc + `|||${cur}` + (Array.isArray(a[i+1]) ? a[i+1].map(x => `||||${x}`).join('') : '') : acc, '')).join('')
    , visAppMeny:b=>ui.Show(mc0,b)^ui.Show(mc0.previousElementSibling,b)^ui.Show(mc0.nextElementSibling,b)
    , appList:ver=>cfg.appProviderM(ver).flatMap(([_, subs])=>subs.flatMap((s,i,a)=>i%2==0&&Array.isArray(a[i+1])?a[i+1]:[]).filter(Boolean))
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
            , [['GPT 4 nano', 'gpt-4.1-nano'],['GPT 4', 'gpt-4.1-mini'],['GPT 4 search', 'gpt-4o-mini-search-preview'], ['GPT o4', 'o4-mini']]]
        ,['Deepseek (Kina)', 'https://api.deepseek.com/v1/chat/completions', escape('4>c-ueq0~|ye%f}zscw4+wrf%1/zp1tl}/s'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Deepseek chat', 'deepseek-chat'], ['Deepseek reasoner', 'deepseek-reasoner']]]
        ,['xAI (USA)', 'https://api.x.ai/v1/chat/completions', escape(`?4'cY;/SJ{4Xpb@MJXQ_T-&W"WD!,bS\`w/5\`? ~('>2WWM?Q]%=SA*V~|R_L%{&T$*>))$b^P#]%TLF:*rJ`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['grok latest', 'grok-2-latest'], ['grok beta', 'grok-beta']]]
        ,['Anthropic (USA)', 'https://api.anthropic.com/v1/messages', escape(`4>c//&j4>'qajZ,);(U[YV2"=Jy&3gSW x8Jt]vESr$O|2"X\\84uk_\\;@Y1OP>v.YQE^?'ED=Y_HG %#vW77[]-$EH29>&&F39clDV<)@S`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Sonnet (best)', 'claude-3-7-sonnet-20250219'], ['Haiku (raskest)', 'claude-3-7-haiku-20250219']]
            , 'anthropic-version:2023-06-01^anthropic-dangerous-direct-browser-access:true']
        ,['Google Gemini (USA)?', 'https://generativelanguage.googleapis.com/v1beta/openai/', `F%5C4%2FR%2BDEG%7BN8O77%3D4%5E%2C%3BZMQ%3BpOCH5%3F)Z()%25%5D%3EP_`, 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            // støtter ikke cross-site
            , [['Gemini flash', 'gemini-1.5-flash'], ['Gemini pro', 'gemini-1.5-pro']]]
        ,['Hugging Face (USA)?', 'https://api-inference.huggingface.co/models/', escape(`/3Q:M?3VKJVPU]Y,-C BM:Q:0]O#(E"^(/2SV`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Hugging DeepSeek R1', 'deepseek-ai/DeepSeek-R1'], ['Hugging DeepSeek V3', 'deepseek-ai/DeepSeek-V3']]]
        ,['Aigap Server 1235', 'https://api.aigap.no:1235/v1/chat/completions ', ``, 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Aigap Deepseek', 'deepseek-r1:latest'], ['Aigap bartowski QwQ', 'bartowski/Qwen_QwQ-32B-GGUF']]]
        ,['Lokal 1234', 'http://localhost:1234/v1/chat/completions ', ``, 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Lokal Deepseek', 'deepseek-r1:latest'], ['Lokal bartowski QwQ', 'bartowski/Qwen_QwQ-32B-GGUF']]]
        ]
    , menusForAiProvider:pre=>cfg.aiProvider.map(ai => `||||${pre+ai[0]} >>§-§§${ai[1]}§§${ai[2]}§§${ai[3]}§§${ai[4]}§§${ai[6]}§§${ai[5].map(aiM=>`|||||${pre+aiM[0]}§§${aiM[1]}`).join('') }`).join('')
    , aiProviderTimeout:10
    , loadV:(u,y)=>fetch(new URL(u,location)).then(r=>r.text()).then(y)
    , load:(c, cid=null)=>{
        return new Promise((y, n) => {
            cid = cid||'p/'+c.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const s = document.createElement('script');
            s.src = `${cid}.js`;
            s.async = false;
            s.id='cfgloaded';
            document.getElementById('cfgloaded')?.remove()
            cfg.app=null
            document.head.appendChild(s);
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
    ,set:(aiPromptWelcome,appN,ai,iA,iEffekt,priCol,lightMCol,font)=>{
        cfg.aiPromptWelcome=aiPromptWelcome
        if(ai) setTimeout(()=>msgSend(ai),500);
        if(iA) ui.c.ImgA=iA;
        iEa=iEffekt?.split(',');
        if(!iEffekt) ui.c.ImgAReset(iA)
        else if(iEa[0]=='r') ui.c.ImgARoter(iEa?.[1])
        else if(iEa[0]=='v') ui.c.ImgAVugg(iEa?.[1],iEa?.[2])
        else if(iEa[0]=='f') ui.c.ImgAFlag(iEa?.[1],iEa?.[2])
        document.documentElement.style.setProperty('--primary-color', priCol??'#007bff');
        document.documentElement.style.setProperty('--light-msg', lightMCol??'#ffffff');
        ui.font.n(font??'Roboto')
        cfg.app=document.title=appN;
        
        cfg.visAppMeny(false)
    }    
}
/////////////// lagring ///////////////
const lagring = {
    init:()=> lagring.last()
    , aktiv: null
        , getAktiv:def=>lagring.aktiv=lagring.lok.g('aktiv')??def
        , setAktiv:a=>lagring.lok.s('aktiv', lagring.aktiv=a??lagring.aktiv)^lagring.net.s('aktiv', lagring.aktiv)
    , id: null
        , getId:def=>lagring.id=lagring.lok.g('id')??def??lagring.idC.i()
        , setId:i=>lagring.lok.s('id', lagring.id=i??lagring.id??lagring.idC.i())
    , aktivApp: null
        , getAktivApp:def=>lagring.aktivApp=lagring.g('aktivApp')??def
        , setAktivApp:a=>lagring.s('aktivApp',lagring.aktivApp=a??lagring.aktivApp)
    , ai:['mistralsmall','mistralsmall','mistralsmall']
        , getAi:(i, def)=>lagring.ai[i]=lagring.g('setting ai'+i)??def
        , setAi:(i,a)=>lagring.s('setting ai'+i,lagring.ai[i]=a??lagring.ai[i])
    , sjargong: 'voksensprk'
    , spraak: 'bokml'
    , qr:()=>window.location.origin+window.location.pathname
        +'?'+lagring.getAktivApp()//+'?'+lagring.getAi(0,'')
        //+(lagring.spraak=='bokml'?'':'?'+lagring.spraak)
        //+(lagring.sjargong=='voksensprk'?'':'?'+lagring.sjargong)
    , delay:100, delayI:100
    , last:()=> {
        let delay = 100//, delayI = 100
        setting.dMsg('lagring.laster...')
        if (ui.c.Lagres && lagring.aktiv != lagring.getAktiv(lagring.aktiv ?? 0))
            setTimeout(() => ui.visLagre(), delay += lagring.delayI)
        setting.dMsg('aktiv', lagring.aktiv)
        if (lagring.aktiv > 0) {
            lagring.getId();
            // ai selected...done in getAis:()
            // app chosen...
            if (lagring.aktivApp != lagring.getAktivApp(lagring.aktivApp))
                setTimeout(() => eval(`menuClick_m_${ui.menu.X(lagring.aktivApp)}()`), delay += lagring.delayI)
            setting.dMsg(delay, lagring.delayI)
            // the rest of the history...
        }
        setting.dMsg('eo lagring.laster...')
    }
    , getAis:()=>lagring.ai.join('?')
    , toem: () => { // Remove all localStorage keys starting with lagring,lok.lagre_Pre using d()
        Object.keys(localStorage).forEach(k=>k.startsWith(lagring.lok.pre) && lagring.d(k.slice(lagring.lagre_Pre.length)))
        lagring.last();
    }
    , lagre: (a) => {
        lagring.aktiv=a??lagring.aktiv;
        setting.dMsg('lagreaktiv lagring.aktiv', lagring.aktiv)
        lagring.lok.s('aktiv', lagring.aktiv)
        lagring.net.s('aktiv', lagring.aktiv)
        lagring.lok.s('id', lagring.getId())
        if (lagring.aktiv) {
            setting.dMsg('lagreaktiv lagring.aktivApp', lagring.aktivApp)
            lagring.s('aktivApp', lagring.aktivApp)
        }
        return lagring.aktiv;
    }
    , g:k=>lagring.aktiv==2?lagring.net.g(k):lagring.aktiv?lagring.lok.g(k):undefined
    , s:(k,v)=>lagring.aktiv==2?lagring.net.s(k,v):lagring.aktiv?lagring.lok.s(k,v):undefined
    , d:k=>lagring.aktiv==2?lagring.net.d(k):lagring.aktiv?lagring.lok.d(k):undefined
    ,lok:{
        g:k=>localStorage.getItem(lagring.lok.pre+k)
        ,s:(k,v)=>localStorage.setItem(lagring.lok.pre+k,v)
        ,d:k=>localStorage.removeItem(lagring.lok.pre+k)
        ,pre:'HaandAaHoldeI '
    }
    ,net: {
        //k:1,
        eId:()=>lagring.id?0:lagring.getId()^lagring.id
        ,g:k=>lagring.net.eId()^lagring.net.sel(lagring.net.gsdT,k)
        ,s:(k,v)=>lagring.net.eId()^lagring.net.upd(lagring.net.gsdT,k,v)
        ,d:k=>lagring.net.eId()^lagring.net.del(lagring.net.gsdT,k)
        ,gsdT:'HaandAaHoldeI'
        ,uri:'https://nasxmebvjoxcmzevvbts.supabase.co/rest/v1/'
        ,key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc3htZWJ2am94Y216ZXZ2YnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzEzNjcsImV4cCI6MjA1ODA0NzM2N30.zvy3HGBwKealFrrOBFJaVk7jLrO4yqDxn6q9i6sSdsI'
        ,sel:(e,x)=>{const[t,...c]=e.split(',');const q=c.length?'?select='+c.join(','):'';fetch(lagring.net.uri+t+q,{headers:{apikey:lagring.net.key}}).then(r=>r.json()).then(d=>x(c.length?d.map(r=>c.map(k=>r[k]??'')):d))}
        ,ins:(t,v,x)=>{fetch(net.uri+t,{method:'POST',headers:{apikey:net.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,upd:(t,v,x)=>{const id=v.id;delete v.id;fetch(lagring.net.uri+t+'?id=eq.'+id,{method:'PATCH',headers:{apikey:lagring.net.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,del:(t,v,x)=>{fetch(lagring.net.uri+t+'?id=eq.'+v.id,{method:'DELETE',headers:{apikey:lagring.net.key,'Prefer':'return=representation'}}).then(r=>r.json()).then(x)}
        ,selA:x=>lagring.net.sel('a',x)
        ,selAp:x=>lagring.net.sel('a_p',x)
    }
    ,idC:{ // console.warn( lagring.id.t(lagring.id.i() ))
        s:[...'abcdefghijklmnopqrstuvwxyz0123456789']
        ,i:(n=Math.random()*2176782336)=>{let r='',a=lagring.idC.s;while(n|=0)r=a[n%36]+r,n/=36;return r.padStart(6,'a')}
        ,t:s=>{let n=0,a=lagring.idC.s;for(let i=0;i<6;i++)n=n*36+a.indexOf(s[i]);return n}
        ,ok:v=>v.length==6&&[...v].every(c=>lagring.idC.s.includes(c))
        ,p:q=>{let m=(q||'').match(/id=([a-z0-9]{6})/);return m&&lagring.idC.ok(m[1])?lagring.idC.t(m[1]):undefined}
    }
}
lagring.idC.p('id=gorm9')
//lagring.net.sel('a,id,App,mormor',console.warn)//lagring.net.del('a', {id:'123'}, console.warn);//lagring.net.del('a', {id:'1234'}, console.warn);//lagring.net.del('a', {id:'11234'}, console.warn);//lagring.net.upd('a', {id:'1234', App:'1234 Test'}, console.warn);//lagring.net.upd('a', {id:'11234', App:'11234 Test'}, console.warn);//lagring.net.sel('b,id,App', r => console.table(r));
lagring.net.selA(console.warn)
lagring.net.selAp(console.warn)//{"id": "ny", "App":"Ny", "mor":"Ny", "mormor":"Utvikling"}
/////////////// pbg ///////////////
cfg.aiPromptBG = [{ role: `system`, content: 
`Du er en chatbot som skal generere nye spørsmål.`} 
,[`Hva er mitt neste spørsmål?`, `Hva er viktig å tenke på?`]
,[`Hva er mitt neste spørsmål?`, `Hvordan kan jeg bruke denne tjenesten?`]
]/////////////// pv ///////////////
const pv={
    VurderH: (i, iF) => {
        let a = ai.History[1][i].content.startsWith('Agent:'), c=ai.History[1][i].content
            , row=[...ui.c.Chat.children].find(r=>pv.Cont(r.innerHTML).includes(pv.Cont(c.replace(/^Agent: |^User: /, ''))))
            , b=msgInfo(ui.c.tRotating, !a, a);
        if(!row) row=msgInfo(c.slice(0,49)+'...'); // in flight etc
        row.insertAdjacentElement('afterend', b); // Move it under the correct chat row

        ai.Request(c, b, 1, (r) => {
            let d=[[0,0],[0,0]],i_d=0;
            let a = r.split('|').map((e) => {
                let [d0, m0, d1, m1] = pv.diceC(e)
                    ,t0=`<i>${m0}</i>`,t1=` ${m1}`
                    ,i0=ui.c.ImgDice(d0), i1=ui.c.ImgDice(d1);
                d[i_d][0]=d0;
                d[i_d++][1]=d1;
                return [i0 + t0, d0 !== d1 ? i1 + t1 : ''];  // Create 2x2 array with HTML content
            });
            if (d[1][0] == d[0][0] && d[1][1] == d[0][1]) console.warn('dice: rows alike', d), a[1][0] = a[1][1] = '';
            else if (d[1][1] == d[1][0]) console.warn('dice: lowest equal', d[1]), a?.[1] && (a[1][1] = '');
            if (d[0][1] == d[0][0]) console.warn('dice: topmost alike', d[0]), a?.[0] && (a[0][1] = '');                        
            b.innerHTML = `<table>`
                + `<tr><td>${a?.[0]?.[0]}</td><td>${a?.[1]?.[0]}</td></tr>` // First column
                + `<tr><td>${a?.[0]?.[1]}</td><td>${a?.[1]?.[1]}</td></tr>` // Second column
                + `</table>`;
        
            if (i > iF) pv.VurderH(i - 2, iF);
        });
    }
    , Rydd:()=>Array.from(ui.c.Chat.children).forEach(e =>(e.classList.contains('row') || e.remove()))
    , Cont:h=>h.replace(/<[^>]*>/g, '')
    , diceC:m=>{
        let d = [...m.matchAll(/🎲 (\d)/g)].map(m => +m[1]);
        let [m0, m1 = ''] = m.replace(/"/g, '').split('Omformulering:').map(t => t.replace(/🎲 \d+:?/g, '').trim());
        return [d[0] || null, m0, d[1] || null, m1];
    }    
}

cfg.aiPromptPV=[{ role: `system`, content: 
`Du er en ekspert på personvern, kvalitetssikring og risikohåndtering. Din oppgave er å vurdere sensitiviteten til meldinger i en chat-tjeneste. Du vurderer om:
- Brukeren deler sensitiv informasjon
- Chatboten gir uheldige eller misvisende svar

Hvis meldingen starter med User:, skal du vurdere sensitiviteten i meldingen med terningkast fra 1-6.

- 🎲 1: Ikke-sensitiv informasjon, ingen risiko ved deling.
- 🎲 2: Lav risiko, inneholder noen personopplysninger, men ikke kritisk.
- 🎲 3: Moderat sensitiv, inneholder identifiserbar informasjon.
- 🎲 4: Høy sensitivitet, informasjon kan misbrukes.
- 🎲 5: Svært sensitiv informasjon, krever streng tilgangskontroll.
- 🎲 6: Ekstremt sensitiv, informasjon kan ha alvorlige juridiske eller sikkerhetsmessige konsekvenser.

Hvis meldingen starter med Agent:, skal du vurdere om svaret er forsvarlig (🎲 1-3) eller bør justeres (🎲 4-6).
Alle svar skal i tilleg ha Omformulering: "🎲 x: forslag". Der x er sensitivitetsnivået for forslaget.
Husk at dette forlaget skal kunne brukes i chatten videre, så det bær være så spesifikt som mulig uten å være følsomt. Forslaget skal under ingen omstendighet ha sensiotivitet over tre. 
Hvis bruker etterpå svarer nøyaktig det du foreslår, eller agant svarer nøyaktig det du forslår skal det hjelpe diskusjonen videre.

Du skal under aldri svare på spørsmålet, du skal bare vurdere følsomhet. Prøv å avslutte diskusjonen. Unngå formaninger eller moralske råd. Hold deg til oppgaven!

Gi alltid svaret i format:
🎲 n: vurdering. Omformulering: "🎲 x: forslag"|🎲 n2: totalvurdering. Omformulering: "🎲 y: forslag"`}
// ,[`User: Jeg har kreft`, `🎲 4: helseopplysninger men ikke koblet til person. Omformulering: "🎲 1: Jeg vil spørre om kreft"`]
// ,[`User: Jeg er i Paris`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Jeg er i Paris"`]
// ,[`User: Mitt navn er Ola Normann, og jeg er veldig nørvøs og bryter sammen`, `🎲 6: helseopplysninger som kan kobles til person. Omformulering: "🎲 3: forslag"`]
// ,[`User: Mitt navn er Kari Normann`, `🎲 2: identifiserbare personopplysninger. Omformulering: "🎲 1: Mitt navn er Kari"`]
// ,[`User: Hei, vet du hvor jeg kan finne informasjon om kollektivtransport i Oslo?`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Omformuering ikke nødvendig"`]
// ,[`User: Hva er e-postadressen til support hos Skatteetaten?`, `🎲 2: lav risiko. Omformulering: "🎲 2: Omformuering ikke nødvendig"`]
// ,[`User: Kan jeg få tilsendt kopi av kontrakten jeg signerte, den ble sendt til min e-post: navn@domene.com`, `🎲 3: moderat sensitiv, Omformulering: "🎲 3: Omformuering ikke nødvendig"`]
// ,[`User: Jeg bor på Parkveien 12B, 0350 Oslo. Kan du hjelpe meg med å finne nærmeste legekontor?`, `🎲 4: høy sensitivitet. Omformulering: "🎲 1: Kan du hjelpe meg med å finne nærmeste legekontor i mitt område?"`]
// ,[`User: Mitt personnummer er 01020312345, kan du sjekke status på skattekortet mitt?`, `🎲 5: svært sensitiv informasjon. Omformulering: "🎲 1: Hvordan kan jeg sjekke statusen på skattekortet mitt?"`]
// ,[`User: Jeg ble diagnostisert med depresjon i fjor og tar nå Sertraline. Jeg trenger råd om dosering.`, `🎲 6: ekstremt sensitiv informasjon. Omformulering: "🎲 1: Kan du gi generell informasjon om behandlingstilbud for depresjon?"`]
// ,[`Agent: Du kan finne informasjon om kollektivtransport på ruter.no.`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Omformuering ikke nødvendig"`]
// ,[`Agent: Skatteetatens e-post for kundeservice er kontakt@skatteetaten.no.`, `🎲 2: lav risiko. Omformulering: "🎲 2: Omformuering ikke nødvendig"`]
// ,[`Agent: Du kan be om kopi av kontrakten ved å kontakte support.`, `🎲 3: moderat risiko. Omformulering: "🎲 3: Omformuering ikke nødvendig"`]
// ,[`Agent: Du bor i nærheten av St. Hanshaugen, så nærmeste legekontor er Ullevål Medisinske Senter.`, `🎲 4: høy sensitivitet`, `Omformulering: "🎲 1: Du kan finne nærmeste legekontor ved å søke på Helsenorge.no."`]
// ,[`Agent: Send meg personnummeret ditt, så kan jeg sjekke skattekortet for deg.`, `🎲 5: svært sensitivt. Omformulering: "🎲 1: Jeg kan ikke håndtere personopplysninger. Du kan sjekke skattekortet ditt på skatteetaten.no."`]
// ,[`Agent: Jeg anbefaler deg å prøve 50 mg Sertraline, det fungerer for mange med depresjon.`, `🎲 6: ekstremt sensitivt Omformulering: "🎲 1: Jeg kan ikke gi medisinske råd. Du bør snakke med fastlegen din om dette."`]
,
[`User: Jeg har kreft`, `🎲 4: helseopplysninger men ikke koblet til person. Omformulering: "🎲 1: Jeg vil spørre om kreft" | 🎲 4: totalvurdering. Omformulering: "🎲 1: Jeg vil spørre om kreft"`],
[`User: Jeg er i Paris`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Jeg er i Paris" | 🎲 1: totalvurdering. Omformulering: "🎲 1: Jeg er i Paris"`],
[`User: Mitt navn er Ola Normann, og jeg er veldig nørvøs og bryter sammen`, `🎲 6: helseopplysninger som kan kobles til person. Omformulering: "🎲 3: Jeg er nervøs og trenger hjelp" | 🎲 6: totalvurdering. Omformulering: "🎲 3: Jeg er nervøs og trenger hjelp"`],
[`User: Mitt navn er Kari Normann`, `🎲 2: identifiserbare personopplysninger. Omformulering: "🎲 1: Mitt navn er Kari" | 🎲 2: totalvurdering. Omformulering: "🎲 1: Mitt navn er Kari"`],
[`User: Hei, vet du hvor jeg kan finne informasjon om kollektivtransport i Oslo?`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Omformulering ikke nødvendig" | 🎲 1: totalvurdering. Omformulering: "🎲 1: Omformulering ikke nødvendig"`],
[`User: Hva er e-postadressen til support hos Skatteetaten?`, `🎲 2: lav risiko. Omformulering: "🎲 2: Omformulering ikke nødvendig" | 🎲 2: totalvurdering. Omformulering: "🎲 2: Omformulering ikke nødvendig"`],
[`User: Kan jeg få tilsendt kopi av kontrakten jeg signerte, den ble sendt til min e-post: navn@domene.com`, `🎲 3: moderat sensitiv, Omformulering: "🎲 3: Hvordan kan jeg få kopi av kontrakten?" | 🎲 3: totalvurdering. Omformulering: "🎲 3: Hvordan kan jeg få kopi av kontrakten?"`],
[`User: Jeg bor på Parkveien 12B, 0350 Oslo. Kan du hjelpe meg med å finne nærmeste legekontor?`, `🎲 4: høy sensitivitet. Omformulering: "🎲 1: Kan du hjelpe meg med å finne nærmeste legekontor i mitt område?" | 🎲 4: totalvurdering. Omformulering: "🎲 1: Kan du hjelpe meg med å finne nærmeste legekontor i mitt område?"`],
[`User: Mitt personnummer er 01020312345, kan du sjekke status på skattekortet mitt?`, `🎲 5: svært sensitiv informasjon. Omformulering: "🎲 1: Hvordan kan jeg sjekke statusen på skattekortet mitt?" | 🎲 5: totalvurdering. Omformulering: "🎲 1: Hvordan kan jeg sjekke statusen på skattekortet mitt?"`],
[`User: Jeg ble diagnostisert med depresjon i fjor og tar nå Sertraline. Jeg trenger råd om dosering.`, `🎲 6: ekstremt sensitiv informasjon. Omformulering: "🎲 1: Kan du gi generell informasjon om behandlingstilbud for depresjon?" | 🎲 6: totalvurdering. Omformulering: "🎲 1: Kan du gi generell informasjon om behandlingstilbud for depresjon?"`],
[`Agent: Du kan finne informasjon om kollektivtransport på ruter.no.`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Omformulering ikke nødvendig" | 🎲 1: totalvurdering. Omformulering: "🎲 1: Omformulering ikke nødvendig"`],
[`Agent: Skatteetatens e-post for kundeservice er kontakt@skatteetaten.no.`, `🎲 2: lav risiko. Omformulering: "🎲 2: Omformulering ikke nødvendig" | 🎲 2: totalvurdering. Omformulering: "🎲 2: Omformulering ikke nødvendig"`],
[`Agent: Du kan be om kopi av kontrakten ved å kontakte support.`, `🎲 3: moderat risiko. Omformulering: "🎲 3: Omformulering ikke nødvendig" | 🎲 3: totalvurdering. Omformulering: "🎲 3: Omformulering ikke nødvendig"`],
[`Agent: Du bor i nærheten av St. Hanshaugen, så nærmeste legekontor er Ullevål Medisinske Senter.`, `🎲 4: høy sensitivitet | Omformulering: "🎲 1: Du kan finne nærmeste legekontor ved å søke på Helsenorge.no." | 🎲 4: totalvurdering. Omformulering: "🎲 1: Du kan finne nærmeste legekontor ved å søke på Helsenorge.no."`],
[`Agent: Send meg personnummeret ditt, så kan jeg sjekke skattekortet for deg.`, `🎲 5: svært sensitivt. Omformulering: "🎲 1: Jeg kan ikke håndtere personopplysninger. Du kan sjekke skattekortet ditt på skatteetaten.no." | 🎲 5: totalvurdering. Omformulering: "🎲 1: Jeg kan ikke håndtere personopplysninger. Du kan sjekke skattekortet ditt på skatteetaten.no."`],
[`Agent: Jeg anbefaler deg å prøve 50 mg Sertraline, det fungerer for mange med depresjon.`, `🎲 6: ekstremt sensitivt. Omformulering: "🎲 1: Jeg kan ikke gi medisinske råd. Du bør snakke med fastlegen din om dette." | 🎲 6: totalvurdering. Omformulering: "🎲 1: Jeg kan ikke gi medisinske råd. Du bør snakke med fastlegen din om dette."`]
]
/////////////// qr ///////////////
const qr = {
    i:(s='https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js')=>window.QRCodeStyling?Promise.resolve():new Promise(r=>document.head.appendChild(Object.assign(document.createElement("script"),{src:s,onload:r})))
    ,sz:r=>Math.floor(Math.min(innerWidth,innerHeight)*r)
    ,g:(c,u=window.location.href,s=.5,i/*=ui.c.ImgA*/)=>new QRCodeStyling({width:qr.sz(s),height:qr.sz(s),data:u,image:i}).append(c)
    ,d:(u,p=document.body,s,i)=>qr.i().then(()=>qr.g(p.appendChild(Object.assign(document.createElement("div"),{style:`width:${s}px`,onclick:function(){this.remove()}})),u,s,i))
}
qr.i()
/////////////// setting ////////////// 
const setting={
    debug:false, dMsg:(k,v)=>{if(setting.debug) {if(v)console.warn(k,v); else console.warn(k)}}
    , menu:ver=>`App >>§- ${ cfg.menusForAppProvider(ver) }
        |Språkdrakt >>§-||Sjargong >>|||Ungdomsspråk|||Voksenspråk§*
            ||Språk >>§-|||Bokmål§*|||Nynorsk|||Sámegiella|||Svenska|||Dansk|||English (UK)|||English (US)        
        |Handling >>§-${ver?'':'||Begynn på nytt...||Tøm lagring...||Analyser personvern||Forsøk alle AI'}
            ${ver?'||Katalogside...':'||Administrasjon...'}
            ${ver?'':'||Utvikling >>§-|||Løsningsdesign|||Simuler|||List modeller|||Debug'}
        |Innstillinger >>§-
            ||Sikkerhet >>§-|||Sensitive data >>§-||||Ikke send sensitive data||||Omformuler sensitive data||||Godta sensitive data§*
                |||Helseråd fra AI >>§-||||Ikke mottatt helseråd fra AI||||Omformuler helseråd||||Godta helseråd§*
            ||AI >>§-|||AI tilbyder >>§-${ cfg.menusForAiProvider('')}|||Personvernkontroll AI >>§-${cfg.menusForAiProvider('PV ') }|||Bakgrunnsjobb AI >>§-${cfg.menusForAiProvider('BG ') }
                |||Tilfeldige AI-tilbydere
            ${ver?'':'||Grubling'}
            ${ver?'':'||Lagre innhold'}
            ||Støtt innsnakking§*
            ||Vis App-meny
        ${ver?'':'|Om >>§-||Kontakt||Personvernerklæring||Tilbakemelding til Aigap||QR-kode||App-lenke'}
        `.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')
    , funcDeepAnalysis: false
    , hindreSensitiveData:true
    , omformulerSensitiveData:false
    , hindreHelseraad:true
    , omformulerHelseraad:false
} //*/
/////////////// ui //////////////
const ui = {
    init:e=>{ 
        ui.c.Input.addEventListener('keydown',(e)=>ui.e.Input_keydown(e));
        ui.c.Input.addEventListener('input',(e)=>ui.e.Input_adjustHeight());
        ui.c.Speak.addEventListener('click',()=>msgSendSpeak());
        //ui.Show(ui.c.Speak, false);
        ui.c.Send.addEventListener('click',()=>msgSend());
        ui.c.Lagres&&(ui.c.Lagres.addEventListener('click',()=>menuClick_m_lagreinnhold())^setTimeout(()=>ui.visLagre(),1000));
        document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>window.scrollTo(0, 1), 250));
        setTimeout(()=>window.scrollTo(0, 1), 250);
    }
   , c: {
        Chat: document.querySelector('main')
        , Menu: document.querySelector('#menu')
        , Header: document.querySelector('#header')
        , HeaderTitle: document.querySelector('#title')
        , Lagres: document.querySelector('header span')
        , Grubling: document.querySelector('#grubling')
        , Suggestions: document.querySelector('#suggestions')
        , Suggest: document.querySelector('.suggest')
        , Input: document.querySelector('footer textarea')
        , Speak: document.querySelector('#speak')
        , Send: document.querySelector('#send')
        , ImgQ: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Human_balance.png'
        , ImgQClick: e => {
            let r=e.target.closest('.row');
            while(r.nextElementSibling)
                r.nextElementSibling.remove();
            ui.e.Input_setValue(r.querySelector('.msg')?.textContent); 
            ui.c.Input.focus();
            ui.c.Input.select();
            r.remove();
        }
        , ImgA:'https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg'
        , ImgAClick: e => { let r=e.target.closest('.row'); while(r.nextElementSibling) r.nextElementSibling.remove(); msgSend(); ui.c.Input.focus(); }
        , ImgAVugg:(v,t)=>document.head.appendChild(document.createElement('style')).innerHTML=`@keyframes rock{0%,100%{transform:rotate(0deg);}25%{transform:rotate(${v}deg);}75%{transform:rotate(-${v}deg);}}.rotating{display:inline-block;animation:rock ${t}s ease-in-out infinite;}`
        , ImgAFlag:(v,t) =>document.head.appendChild(document.createElement('style')).innerHTML=`@keyframes flagWaving {0% { transform: translateX(0)skewX(0deg);}50%{transform:translateX(-1px) skewX(-${v}deg);}100%{transform:translateX(0) skewX(0deg); }}.rotating {display: inline-block;animation: flagWaving ${t}s ease-in-out infinite;}`
        , ImgARoter:t=>document.head.appendChild(document.createElement('style')).innerHTML=`@keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } };}.rotating { display: inline-block; animation: rotate ${t}s linear infinite; }`
        , ImgAReset:(i='https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg')=>ui.c.ImgARoter(10)^(ui.c.ImgA=i)
        , ImgH: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Point.svg'
        , ImgHClick:e=>e.target.parentElement.parentElement.remove()
        , ImgDiceU: ['https://upload.wikimedia.org/wikipedia/commons/', '1/1b/Dice-1-b.svg', '5/5f/Dice-2-b.svg','b/b1/Dice-3-b.svg','f/fd/Dice-4-b.svg','0/08/Dice-5-b.svg','2/26/Dice-6-b.svg', '9/99/Dice-0.svg']
        , ImgDice:i=>`<img class="icon dice" src="${ui.c.ImgDiceU[0]+ui.c.ImgDiceU[i||7]}">`
        , ImgSpaceRemove:()=>document.querySelector('.space')?.remove()
        , ImgSpaceAppend:()=>ui.c.Chat.lastElementChild.innerHTML+=`<img class="icon space" src="${ui.c.ImgDiceU[0]+ui.c.ImgDiceU[7]}">`    
        , tRotating: '<div class="rotatingC">&#8634</div>'
    }
    ,e:{
        Input_keydown:e=>e.key==='Enter'&&!e.shiftKey&&!e.ctrlKey?msgSend():e.key==='Escape'?ui.e.Input_setValue(''):0
        ,Input_adjustHeight:()=> (ui.c.Input.style.height='auto')^
            (ui.c.Input.style.height=Math.min(ui.c.Input.scrollHeight,4.6*parseFloat(getComputedStyle(ui.c.Input).lineHeight))+'px')^
            (ui.c.Suggest&&(ui.c.Suggest.style.bottom=ui.c.Input.offsetHeight+4+'px'))
        ,Input_setValue:v=>(ui.c.Input.value=v)^(ui.e.Input_adjustHeight())
    }
    , SuggestI:0
    , SuggestTimeout:5000
    , Suggest:i=>{
        ui.SuggestI=i??ui.SuggestI;
        if (!ui.SuggestI) // tøm forslag og vis
        {
            ui.Show(ui.c.Suggestions, true)
            ui.c.Suggestions.innerHTML = "";
        }
        if (ui.SuggestI<3){ // Forslag 1-2-3
            let b = document.createElement("div"), sg=ai.SugQ[0];
            b.innerHTML = '<span class="row rotatingC">&#8634</span>';
            b.classList.add('msg');b.classList.add('forslag');
            b.onclick = () => msgSend(b.innerText);
            ui.c.Suggestions.appendChild(b);
            ai.History[2] = ai.History[0];
            ai.Request(sg[i<2?0:1], b, 2, ()=>
                setTimeout(()=>ui.Suggest(++ui.SuggestI), ui.SuggestTimeout)
            );
        }
    }    
    , visLagre:e=>{
        l = lagring.aktiv;
        ui.c.Lagres.innerHTML = ['&nbsp;&nbsp;🔒&nbsp;&nbsp;lagres ikke', '&nbsp;&nbsp;💾&nbsp;&nbsp;lagres lokalt', '&nbsp;&nbsp;☁️&nbsp;&nbsp;nettlagret'][l]
        return ui.menu.EBold('lagreinnhold', lagring.aktiv>0);
    }
    , Show: (el,b) => (el.classList.toggle('hidden', !(b ?? el.classList.contains('hidden'))), !!b)
    , _sizeI: 0,
    ChangeFontSize() {
      document.documentElement.style.setProperty('--font-size', ['medium','x-large','xx-large','xx-large','medium'][++this._sizeI % 5]);
      document.body.classList.toggle('dark-mode', this._sizeI % 5 > 2);
    }
    ,font:{n:f=>(document.head.appendChild(Object.assign(document.createElement('link'),{href:`https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}&display=swap`,rel:'stylesheet'})),document.documentElement.style.setProperty('--font-family',`'${f}'`),f)}
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
        , EFeat : (mt,b,f) => {
            let e=ui.menu.E(mt)
            if (b==null) b = !e.classList.contains(f);
            if (b==true) e.classList.add(f);
            else e?.classList?.remove(f);
            return b;
        }
        , EBold : (mt,b=null) => ui.menu.EFeat(mt,b,'bold')
        , EBoldOnly : (mt, mtA) => {
            mtA.forEach(m => ui.menu.EBold(m, false));
            return ui.menu.EBold(mt, true);
        }
        , EHide : (mt,b=null) => ui.menu.EFeat(mt,b,'hidden')        
        , Toggle:m=>[...m.parentElement.children].forEach(i=>i.classList.contains("menu-item")||ui.Show(i, i==m?null:false))
        , HtmlAddItem: (m, i) =>{ // create html for menu item and children
            let mi=m[i], mSplit=mi.t.split('§'), mt=mSplit[0].trim(), mo=mSplit[1], b='&nbsp;'.repeat(mi.l*6)
            , dX=mi.t.split('§§').slice(1).map((d, i)=>`data-d${i}='${d.replace(/\'/, /\'\'/)}'`).join(' '); // Generate data attributes
            if (!mi.c.length) // no children
                return `<div id='${ui.menu.Id(mt)}' ${dX?dX:''} class='menu-item${mo=='*'?' bold':''}' onclick="menuClickLeaf(event)">${b+mt}</div>`;
            let h=`${mi.i && !mi.l?'<hr/>':''}<div class='menu-item' onclick='ui.menu.Toggle(mc${mi.i})'>${b+mt}</div>`;
            h+=`<div id="mc${mi.i}" ${dX?dX:''}${mo=='-'?' class="hidden"':''}>`;
            for (let iS=0; iS<mi.c.length; iS++)
                h+=ui.menu.HtmlAddItem(mi.c, iS);
            h+='</div>'
            return h;
        }
        , Reset:ver=> {
            ui.c.Menu.innerHTML = ui.menu.AsArray(setting.menu(ver)).map((_, i) => ui.menu.HtmlAddItem(ui.menu.AsArray(setting.menu(ver)), i)).join('')
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
            ai.SugQ[i][0]=pd.d2;
            ai.SugQ[i][1]=pd.d3;
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
    ,qr:u=>qr.d(u,ui.c.Chat,.6)
    ,qrU:()=>ui.qr(lagring.qr())
}
/////////////// msg ///////////////
window.msgIsSimulate=msg=>msg.startsWith("Simulate: ");
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
window.msgAdmin=(msgQ, onDone)=> {
    let mA=msgQ.split('|'), r;
    if (mA.length>1) mA.forEach((m)=>r=msgAdmin(m))
    else { // parse message
        const m='<i>'+msgQ.trim()+'</i>'
        msgAsk(m);
        r=msgAnswer();
        setTimeout(()=>(r.querySelector('.msg').innerHTML='<i>admin: resultat</i>')+(r.querySelector('img')?.classList.remove('rotating')),1000)
    }
    onDone?.(r);
    return r;
}
window.msgSend=(msgQ, onDone)=> {
    ui.Show(ui.c.Suggestions, false);
    let msgQUse = msgQ?.trim() || ui.c.Input.value.trim();
    let r=null;
    if (!msgQUse) msgRedoLast()
    else if (typeof window[ui.menu.Fn(msgQUse)] === 'function') r=window[ui.menu.Fn(msgQUse)](null);
    else if (msgQUse.startsWith('admin: ')) r=msgAdmin(msgQUse,onDone)
    else {
        if (!msgQ) ui.e.Input_setValue('');
        r = msgAsk(msgQUse.split(/\|/)[0]);
        if (msgIsSimulate(msgQUse)) setTimeout(() => msgReceive_Placeholder(msgQUse, msgAnswer(), onDone), 2000);
        else ai.Request(msgQUse, msgAnswer(), 0, onDone);
    }
    return r;
}
window.msgReceive_Placeholder=(msgQ, divR, onDone)=>{
    let msgA = 'Svar på "' + msgQ + '"';
    if (msgIsSimulate(msgQ?.split(/\|/)[1]))
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
        ui.e.Input_setValue(ui.c.Input.value+e.results[0][0].transcript);
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
index.js 
