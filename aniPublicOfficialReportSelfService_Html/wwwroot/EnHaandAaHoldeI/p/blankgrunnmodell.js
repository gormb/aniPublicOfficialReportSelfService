cfg_aiPromptWelcome=`[detaljer c='Detaljer...']Grunnmodell – helt naken maskinkraft.
[detaljer]
<hr><b><i>Modell: Mixtral 8x7B</i></b>
Dette er ikke en chatmodell, ikke en instruct-modell – bare en ren språkmodell som viderefører tekstmønstre uten menneskelig tilpasning.
[detaljer c='Formål...']<hr><b>Formål</b><br>Sammenligningsgrunnlag for mer avanserte modeller. Utforske språkmodellens grunnkapasiteter, utvikling, testing og spesialtilpasning.[/detaljer]
[detaljer c='Teknisk...']<hr><b>Teknisk</b><br>Ingen system prompt, ingen forhåndsstyring. Krever nøye utformet prompt og ev. few-shot for å styre generering. Alt må defineres eksplisitt i input.[/detaljer]
[/detaljer][/detaljer]`;

cfg.aiPrompt= [{ role: `system`, content: ``}
//,[`Hva er du?`, `Chatbot under utvikling`]
];

cfg.set(cfg_aiPromptWelcome,'Blank grunnmodell','mixtral','p/aigap.webp')
setTimeout(()=>{ai.Reply=[''];ai.History[0]=[];msgInfo('Klar')},1000);
