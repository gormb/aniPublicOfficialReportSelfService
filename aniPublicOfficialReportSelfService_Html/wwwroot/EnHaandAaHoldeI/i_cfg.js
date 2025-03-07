/////////////// Config /////////////////
const cfg={
    app: 'Velg App'
    , ingenApp:'Velg App'
    , appProvider:[['Helse >>§-',[
            'Hjemmelegen min >>§-',['Mottak og triagering', 'Hjemmelegen min', 'Ikke-medisinsk oppfølging']
            ,'Hlm - forløp og data >>§-',['Mine pasientdata', 'Pakkeforløp']
            ,'Hlm - spesialist >>§ -',['Biopsykososial modell','Kroppens stressystem']
            ,'CatoSenteret >>§-',['Før opphold','Under opphold','Etter opphold']
        ]],['Event >>§-',[
            'Lansering >>§-', ['IT-revyens årsmøte']
            ,'Folk >>§ -', ['Om Silje Føyen', 'Om Gorm Braarvig']
            ,'Konferanse >>§-', ['NAPHA-veiviseren', 'TEDxOslo2025', 'Future Insight']
        ]],['Generelt >>§ -',[
            'Hånd å holde i >>§-', ['Personvernrådgiveren','Innovasjon Norge søknad, Aigap','Blank§*']
            ,'Assistert veiledning >>§ -', ['NO Min Offentlige Hjelper','NO Enkel Navigatør','NO Alt Om Tjenester','NO TjenesteGuide','NO Alt På Ett Sted']
            ,'Assistert personlig støtte >>§-', ['NO Din Offentlige Partner','NO Min Digitale Venn','NO RettighetsVakten','NO KlarTale','NO HverdagsHjelpen']
                        ,'Ideallya >>§-',['Verdens nyheter via Ideallya']]
        ]]
    , menusForAppProvider: () => cfg.appProvider.map(([pt, subs]) => `||${pt}` + subs.reduce((acc, cur, i, a) => i % 2 === 0 ? acc + `|||${cur}` + (Array.isArray(a[i+1]) ? a[i+1].map(x => `||||${x}`).join('') : '') : acc, '')).join('')
    , visAppMeny:b=>ui.Show(mc0,b)^ui.Show(mc0.previousElementSibling,b)^ui.Show(mc0.nextElementSibling,b)
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
        ,['Deepseek (Kina)?', 'https://api.deepseek.com/v1/chat/completions', escape('4>c-ueq0~|ye%f}zscw4+wrf%1/zp1tl}/s'), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Deepseek chat', 'deepseek-chat'], ['Deepseek reasoner', 'deepseek-reasoner']]]
            ,['xAI (USA)', 'https://api.x.ai/v1/chat/completions', escape(`?4'cY;/SJ{4Xpb@MJXQ_T-&W"WD!,bS\`w/5\`? ~('>2WWM?Q]%=SA*V~|R_L%{&T$*>))$b^P#]%TLF:*rJ`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['grok latest', 'grok-2-latest'], ['grok beta', 'grok-beta']]]
        ,['Anthropic (USA)', 'https://api.anthropic.com/v1/messages', escape(`4>c//&j4>'qajZ,);(U[YV2"=Jy&3gSW x8Jt]vESr$O|2"X\\84uk_\\;@Y1OP>v.YQE^?'ED=Y_HG %#vW77[]-$EH29>&&F39clDV<)@S`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            , [['Sonnet (best)', 'claude-3-7-sonnet-20250219'], ['Haiku (raskest)', 'claude-3-7-haiku-20250219']]
            //, [['Sonnet (best)', 'claude-3-5-sonnet-20241022'], ['Haiku (raskest)', 'claude-3-5-haiku-20241022']]
            , 'anthropic-version:2023-06-01^anthropic-dangerous-direct-browser-access:true'
        ]
        ,['Google Gemini (USA)?', 'https://generativelanguage.googleapis.com/v1beta/openai/', `F%5C4%2FR%2BDEG%7BN8O77%3D4%5E%2C%3BZMQ%3BpOCH5%3F)Z()%25%5D%3EP_`, 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            // støtter ikke cross-site
            , [['Gemini flash', 'gemini-1.5-flash'], ['Gemini pro', 'gemini-1.5-pro']]]
        ,['Hugging Face (USA)?', 'https://api-inference.huggingface.co/models/', escape(`/3Q:M?3VKJVPU]Y,-C BM:Q:0]O#(E"^(/2SV`), 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
            // støtter ikke >10GB
            , [['Hugging DeepSeek R1', 'deepseek-ai/DeepSeek-R1'], ['Hugging DeepSeek V3', 'deepseek-ai/DeepSeek-V3']]]
    ]
    , menusForAiProvider:pre=>cfg.aiProvider.map(ai => `||||${pre+ai[0]} >>§-§§${ai[1]}§§${ai[2]}§§${ai[3]}§§${ai[4]}§§${ai[6]}§§${ai[5].map(aiM=>`|||||${pre+aiM[0]}§§${aiM[1]}`).join('') }`).join('')
    , aiProviderTimeout:10
    , load:(c, cid=null)=>{
        return new Promise((y, n) => {
            cid = cid||'p_'+c.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
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