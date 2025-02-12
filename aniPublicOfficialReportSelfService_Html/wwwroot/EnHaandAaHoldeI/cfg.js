/////////////// Config /////////////////
const cfg=[
    {
        n: 'Template'
        , msgWelcomeText: `Velkommen til chat`
        , aiPrompt:[{ role: `system`, content: `Du er en chat som svarer veldig kort` }
            ,[`Hva er 2+2?`, `Bruk kalkulator.`],[`Kontaktinformasjon`, `Har ikke`]
            ,['Hva er velkomstmeldingen?', msgWelcomeText]]
        , aiConfig: [ // [name, url, gunn, Spørsmålsforslag prompt, Spørsmålsforslag prompt(n), [[aiName, aiModel]]]
            ['Deepseek (Kina)', 'https://api.deepseek.com/v1/chat', '4>c-ueq0~'+aiConfigPipeReplace+'ye%f}zscw4+wrf%1/zp1tl}/s', 'Gi meg et konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste', 'Gi meg enda ett konkret eksempel på neste spørsmål jeg bør stille. Svar kun med spørsmålet, så jeg kan sende dette videre til en annen chat-tjeneste'
                , [['R1', 'R1-model-name'], ['V3', 'deepseek-chat']]]
        ]
    }   
]