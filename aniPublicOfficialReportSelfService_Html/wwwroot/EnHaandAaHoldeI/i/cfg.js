/////////////// cfg /////////////////
const tools = {
    onMsg: []
    , clear: () => onMsg = []
    , add: onmsg =>
        onmsg?.forEach(om =>
            console.warn('todo: tool check if there else add', t))
    , set: onmsg => tools.clear() ^ tools.add(onmsg)
}
/////////////// cfg /////////////////
const cfg = {
    app: 'Velg App'
    , ingenApp: 'Velg App'
    , appProvider_Man: [['Fortgang >>§-', [
        'Småkommunen >>§-', ['Norgeskom 10']
        , 'Storkommunen >>§-', ['Norgeskom 10-100', 'Norgeskom 10-100 Ansattreisen']
        , 'De største kommunene >>§-', ['Norgeskom 100']
        , 'Kommunesamarbeid >>§-', ['Norgeskomsam']
        , 'Fagmiljø (evt etat) >>§-', ['Norgeskom fagmiljø']
        , 'Politiker/Kommunedirektør >>§-', ['Norgeskom dir']
    ]], ['Personlig >>§-', [
        'Blank modell >>§-', ['Renset reasoning', 'Renset chat', 'Blank reasoning', 'Blank chat', 'Blank grunnmodell']
        , 'Hånd å holde i >>§-', ['Personvernrådgiveren', 'Tankefeilvarsler', 'Tvilsom filosofi', 'Enkel EQ-test', 'Bias-varsleren', 'Principia, Gödel, Turing and Wolfram', 'Orakelbuen']
        , 'Nyheter >>§-', ['Verdens nyheter via Ideallya', 'Aigap PFU']
    ]], ['Kommune >>§-', [
        'Generelt >>§-', ['NO Alt Om Kommunale Tjenester']
        , 'Asker >>§-', ['Eldre i Asker Kommune']
    ]], ['Norge >>§-', [
        'Norge veiledning >>§-', ['NO Min Offentlige Hjelper', 'NO Enkel Navigatør', 'NO Alt Om Tjenester', 'NO TjenesteGuide', 'NO Alt På Ett Sted']
        , 'Norge personlig støtte >>§-', ['NO Din Offentlige Partner', 'NO Min Digitale Venn', 'NO RettighetsVakten', 'NO KlarTale', 'NO HverdagsHjelpen']
        , 'Sikker KI, vestlandet >>§-', ['Vestlandet heimelegen min', 'Vestlandet Hlm triage', 'Vestlandet Hlm ikkje-medisinsk oppfølging', 'Vestlandet Hlm hvordan har du det?']
        , 'Forsvar Norsk KI >>§-', ['Forsvar veiled kommunikasjon', 'Forsvar veiled skjerming','Forsvar veiled arkitektur', 'Forsvar veiled ROS', 'Forsvar vurder gradering']
        , 'ARB >>§-', ['ARB Kurs', 'ARB Jobbsøk og karriereveiledning (KOJ)', 'ARB CV-hjelp', 'ARB Jobbsøknadshjelp', 'ARB Intervjuklar', 'ARB Karrierevei & Totalkompetanse', 'ARB Jobbsøkervelvære', 'ARB Gründerstart']
    ]], ['Helse >>§-', [
        'Hjemmelegen min >>§-', ['Mottak og triage', 'Hjemmelegen min', 'Ikke-medisinsk oppfølging']
        , 'Hlm - forløp og data >>§-', ['Mine pasientdata', 'Pasientforløp']
        , 'Hlm - spesialist >>§-', ['Hvordan har du det?', 'Flytveilederen', 'Hodepineveilederen', 'CRPS-veilederen', 'Biopsykososial modell', 'Kroppens stressystem', 'Mellom rom og spekter', 'MI-treneren (HDIR-basert)']
        , 'Hlm - økosystem >>§-', ['Medvandrer', 'Medvandrers trygghet', 'Qigong Academy']
        , 'CatoSenteret >>§-', ['Før opphold', 'Under opphold', 'Etter opphold']
    ]], ['Virksomhet >>§-', [
        'Ansatt >>§-', ['Ansatt: reisen', 'Ansatt: karriereveiledning', 'Ansatt: Meningsfylt jobb']
        , 'Skrivekunst >>§-', ['Aigap Kreativ Skrivepartner', 'Aigap Språk og tone']
        , 'Leder >>§-', ['Leder: ny i rollen', 'Leder: beslutningshjelp', 'Leder: økonomi', 'Leder: forbedring', 'Leder: LMX', 'Leder: tilt.work']
        , 'HR >>§-', ['HR: Ansettelsen', 'HR: Medarbeidersamtale', 'HR: Oppsigelsen', 'HR: Restrukturering']
        , 'IT >>§-', ['ROS assistent', 'ITIL-hjelper', 'Digitjenestebuen']
        , 'Startup >>§-', ['Startup SAFE']
    ]], ['Event >>§-', [
        'Lansering >>§-', ['IT-revyens årsmøte']
        , 'Folk >>§-', ['Om Gorm Braarvig']
        , 'Konferanse >>§-', ['TEDxOslo 2026', 'Arendalsuka 2025', 'Arendalsuka 2025oai']
    ]], ['', [
        'Dev >>§-', ['TEDxOslo 2026']
        , 'Event Konferanse>>§-', ['NAPHA-veiviseren', 'TEDxFredrikstad 2025']
    ]]]
    , appProvider_Db: [['Generelt', 'Ny', 'Koblingsfeil!']]
    , appProviderM: ver => {//cfg.appProvider_Man// merge loaded from db
        //Object.entries([...cfg.appProvider_Man.flatMap(([m,s])=>s.flatMap((v,i,a)=>i%2?v.map(App=>({App,mor:a[i-1].slice(0,-5),mormor:m.slice(0,-5)})):[]),...Object.values(cfg.appProvider_Db.reduce((a,r)=>(a[r.App]=r,a),{})))].reduce((o,{App,mor,mormor})=>((o[mormor+' >>§-']??={})[mor+' >>§-']??=new Set()).add(App),o={})&&o).map(([m,s])=>[m,Object.entries(s).flatMap(([k,v])=>[k,[...v]])])
        let ap = JSON.parse(JSON.stringify(cfg.appProvider_Man));
        ver == 'admin' && ap.forEach((_, i) => ap[i][1].forEach((_, j) => !(j % 2) || ap[i][1][j].push('<< ny/endre/slett app >>'))
            ^ ap[i][1].push(['<< ny/endre/slett mor >>'])) ^ ap.push(['<< ny/endre/slett mormor >>', []])
        return ap;
    }
    , menusForAppProvider: ver => cfg.appProviderM(ver).map(([mm, m]) => mm.length < 5 ? '' : `||${mm}` + m.reduce((acc, cur, i, a) => i % 2 == 0 ? acc +
        `|||${cur}` + (Array.isArray(a[i + 1]) ? a[i + 1].map(x =>
            `||||${x}`).join('') : '') : acc, '')).join('')
    , visAppMeny: b => ui.Show(mc0, b) ^ ui.Show(mc0.previousElementSibling, b) ^ ui.Show(mc0.nextElementSibling, b)
    , appList: ver => cfg.appProviderM(ver).flatMap(([_, subs]) => subs.flatMap((s, i, a) => i % 2 == 0 && Array.isArray(a[i + 1]) ? a[i + 1] : []).filter(Boolean))
    , aiPromptWelcomeQuestion: `Hva er velkomstmeldingen?`
    , aiPromptWelcome: `Velkommen til chat.<br/><br/><i>Vi prioriterer personvern. Spørsmål lagres ikke, data sendes til en språkmodell. Mer om personvern under Sikkerhet >> Personvern.</i><br/><br/>Hva lurer du på?`
    , aiPromptCleanse:`
        Ikke speil brukerens tone eller stil. Bruk et nøytralt og formelt språk. Vær minimal. Ingen overforklaring. Svar uten fyllord eller slang. Ingen metakommentarer. Svar "Jeg vet ikke" ved usikkerhet eller manglende kunnskap fremfor å spekulere eller søke på internett.
        Svar med omtrent like mange ord som i spørsmålet, med mindre det er veldig korte spørsmål som trenger litt lengre svar, da kan du svare noe lengre.
        `
    , aiPrompt: [{
        role: `system`, content:
            `Du er en empatisk, kunnskapsrik og evidensbasert chatbot.
        Husk å svare med omtrent like mange ord som i spørsmålet, med mindre det er veldig korte spørsmål som trenger litt lengre svar, da kan du svare noe lengre.`}
        , [`Hva er du?`, `En generell chatbot som kan spesialtilpasses`]
        , [`Hva er du ikke?`, `Et kognitivt vesen`]
    ]
    , aiProviderUse: ['', 'PV ', 'BG ']
    , aiPromptPV: [{ role: `system`, content: `Du skal vurdere personvernsensitivitet i User:melding og grad av risikonved råd i User:melding med terningkast fra 🎲 1 (Ikke-sensitiv) til 🎲 6: (Ekstremt sensitiv) i format: 🎲 n: vurdering. Omformulering: "sikker melding"` }
        , [`User:Jeg har kreft`, `🎲 4: helseopplysninger men ikke koblet til person. Omformulering: "Jeg vil spørre om kreft"`]
        , [`Agent:Jeg anbefaler deg å prøve 50 mg Sertraline, det fungerer for mange med depresjon.`, `🎲 6: ekstremt sensitivt. Omformulering: "Jeg kan ikke gi medisinske råd. Du bør snakke med fastlegen din om dette".`]
    ]
    , aiPromptBG: [{ role: `system`, content: `Du er en chatbot som skal generere nye spørsmål.` }
        , [`Hva er mitt neste spørsmål?`, `Hva er viktig å tenke på?`]
        , [`Hva er mitt neste spørsmål?`, `Hvordan kan jeg bruke denne tjenesten?`]]
    , aiProviderDefault: () => lagring.getAis() //`mistral large?PV mistral small?BG mistral small`
    , aiProvider: [ // [name, url, gunn, Spørsmålsforslag prompt, Spørsmålsforslag prompt(n), [[aiName, aiModel]]]
        ['Mistral (EU)', 'https://api.mistral.ai/v1/chat/completions', escape('&W%%(`HcWMG](Y[]CEVPz6.CN&#M8]#@'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Mistral small', 'mistral-small-latest'], ['Mistral large', 'mistral-large-latest']]]
        , ['Open AI (USA)', 'https://api.openai.com/v1/chat/completions', escape(`4>c=71&6-:lk1<'X1D*YW+T&&!/47ATG}/G57C/5ZjYH~7MN;)EF?/*~9dB%}94BM/~9*Gj\`7+;(?'zOr3,A}L-0,SD)XjQ -HC~VGF4bA, ^3YT;A,w*vFML+Q1A~)&a5FOCx8!c;}3"s Y+51"2=!J?(Y{ZH=S>W@`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['GPT 5 nano', 'gpt-5-nano'], ['GPT 5', 'gpt-5-mini'], ['GPT 4 nano', 'gpt-4.1-nano'], ['GPT o4', 'o4-mini']]]
        , ['vestlandet.digital  (Norge)', 'https://api.vestlandet.digital/v1/chat/completions '
            , '4%3Ec%2C%27%7F%24b%7D-y1wdczsk%26xzvw1j4w-q%7F%7Eb%2C%7Cv4wcwzuk'               
            //, escape('+3Q"($"Jv~%1p7+w^av6x}qd~f|$a%0}#k%1x~$')
            //, escape(`4>c,'$b}-y1wdczsk&xzvw1j4w-q~b,|v4wcwzuk`)
            , 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Vestlandet pyton', 'coder', 16384]
                , ['Vestlandet tenkehatt', 'norbrain', 32768]
                , ['Vestlandet generell', 'norbrain', 32768]
                , ['Vestlandet IOT', 'coder', 8192]]
        ]
        , ['Deepseek (Kina)', 'https://api.deepseek.com/v1/chat/completions', escape('4>c-ueq0~|ye%f}zscw4+wrf%1/zp1tl}/s'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Deepseek chat', 'deepseek-chat'], ['Deepseek reasoner', 'deepseek-reasoner']]]
        , ['xAI Grok (USA)', 'https://api.x.ai/v1/chat/completions', escape(`?4'cY;/SJ{4Xpb@MJXQ_T-&W"WD!,bS\`w/5\`? ~('>2WWM?Q]%=SA*V~|R_L%{&T$*>))$b^P#]%TLF:*rJ`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['grok latest', 'grok-4'], ['grok mini', 'grok-4.1-fast-reasoning']]]
        , ['GROQ', 'https://api.groq.com/v1/chat/completions', escape(`?4'cY;/SJ{4Xpb@MJXQ_T-&W"WD!,bS\`w/5\`? ~('>2WWM?Q]%=SA*V~|R_L%{&T$*>))$b^P#]%TLF:*rJ`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Llama 4 Scout', 'llama-4-70b-preview'], ['Llama 3.3 70B', 'llama-3.3-70b-versatile']]]
        , ['Together AI', 'https://api.together.xyz/v1/chat/completions', escape(`32>Q7cXQEwFg-\\Cw*_ ^YIpFI&)%l3?R9&,'5?^XV(0RT6N2:`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Llama 3.3 70B Turbo', 'meta-llama/Llama-3.3-70B-Instruct-Turbo'], ['DeepSeek V3', 'deepseek-ai/DeepSeek-V3'], ['DeepSeek R1 distill Qwen-32B', 'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B']]]
        , ['Arcee AI?', 'https://models.arcee.ai/v1/chat/completions', `ObkyDwtVIDd%60DXk%7DDCbg%7BktPbgwzXd%7E2DOPHQp%7CzNwtQk%7Cp13p%7DOdeAp%7CMyWp%3FExdgBMk%7Cy0bbKktWFMZ-daBp%7DK9wrV%3C%5Ed%60vWOkrVmp%7Cz+amz%60*d%60vQDkvTNp%7DJdeAp%7Cxd%60wp%7BM2kbfJksQbfHdJY_DTkvPDp%7DHW`, 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            // støtter ikke cross-site
            , [['Arcee Auto', 'auto'], ['Arcee Virtuoso Small', 'virtuoso-small']]]
        , ['Anthropic (USA)', 'https://api.anthropic.com/v1/messages', escape(`4>c//&j4>'qajZ,);(U[YV2"=Jy&3gSW x8Jt]vESr$O|2"X\\84uk_\\;@Y1OP>v.YQE^?'ED=Y_HG %#vW77[]-$EH29>&&F39clDV<)@S`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Sonnet (best)', 'claude-3-7-sonnet-20250219'], ['Haiku (raskest)', 'claude-3-7-haiku-20250219']]
            , 'anthropic-version:2023-06-01^anthropic-dangerous-direct-browser-access:true']
        , ['Google Gemini (USA)?', 'https://generativelanguage.googleapis.com/v1beta/openai/', `F%5C4%2FR%2BDEG%7BN8O77%3D4%5E%2C%3BZMQ%3BpOCH5%3F)Z()%25%5D%3EP_`, 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            // støtter ikke cross-site
            , [['Gemini flash', 'gemini-1.5-flash'], ['Gemini pro', 'gemini-1.5-pro']]]
        , ['Hugging Face (USA)?', 'https://api-inference.huggingface.co/models/', escape(`/3Q:M?3VKJVPU]Y,-C BM:Q:0]O#(E"^(/2SV`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Hugging DeepSeek R1', 'deepseek-ai/DeepSeek-R1'], ['Hugging DeepSeek V3', 'deepseek-ai/DeepSeek-V3']]]
        // ,['Lokal 1234', 'http://localhost:1234/v1/chat/completions ', ``, 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
        //     , [['Lokal Deepseek', 'deepseek-r1:latest'], ['Lokal bartowski QwQ', 'bartowski/Qwen_QwQ-32B-GGUF']]]
    ]
    , menusForAiProvider: pre => cfg.aiProvider.map(ai => `||||${pre + ai[0]} >>§-§§${ai[1]}§§${ai[2]}§§${ai[3]}§§${ai[4]}§§${ai[6]}§§${ai[5].map(aiM => `|||||${pre + aiM[0]}§§${aiM[1]}`).join('')}`).join('')
    , aiProviderTimeout: 10
    , loadV: (u, y) => fetch(new URL(u, location)).then(r => r.text()).then(y)
    , l: src => new Promise((onload, onerror) => document.head.appendChild(Object.assign(document.createElement('script'), { src, onload, onerror/*,type:'module'*/ })))
    //, lw2:async o=>(await cfg.l(`o/${o}.js`),window[o])
    , lw: async o => await cfg.l(`o/${o}.js`).then(() => window[/*'_'*/+o])
    //, lw: async o => (await cfg.l(`o/${o}.js`), eval('window.' + o))
    , load: (c, cid = null) => {
        return new Promise((y, n) => {
            cid = cid || 'p/' + c.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const s = document.createElement('script');
            s.src = `${cid}.js`;
            s.async = false;
            s.id = 'cfgloaded';
            document.getElementById('cfgloaded')?.remove()
            cfg.app = null
            document.head.appendChild(s);
            let i = 0, chk = setInterval(e => {
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
    , set: (aiPromptWelcome, appN, ai, iA, iEffekt, priCol, lightMCol, font, aiTools) => {
        cfg.aiPromptWelcome = ui.parseTags(aiPromptWelcome)
        if (ai) setTimeout(() => msgSend(ai), 500);
        if (iA) ui.c.ImgA = iA;
        iEa = iEffekt?.split(',');
        if (!iEffekt) ui.c.ImgAReset(iA)
        else if (iEa[0] == 'r') ui.c.ImgARoter(iEa?.[1])
        else if (iEa[0] == 'v') ui.c.ImgAVugg(iEa?.[1], iEa?.[2])
        else if (iEa[0] == 'f') ui.c.ImgAFlag(iEa?.[1], iEa?.[2])
        document.documentElement.style.setProperty('--primary-color', priCol ?? '#007bff');
        document.documentElement.style.setProperty('--light-msg', lightMCol ?? '#ffffff');
        ui.font.n(font ?? 'Roboto');
        cfg.app = document.title = appN;
        try { tools.set(aiTools); } catch (e) { console.warn(e); }
        cfg.visAppMeny(false)
    }
    , dt: {
        m: n => ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'][n % 12]
        , d: n => ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'][n % 7]
        , day: (d = new Date()) => `${cfg.dt.d(d.getDay())} ${d.getDate()}. ${cfg.dt.m(d.getMonth())} ${d.getFullYear()}`
        , dayN: n => cfg.dt.day(new Date(new Date().getTime() + n * 86400000))
        , time: (d = new Date()) => `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    }
}
