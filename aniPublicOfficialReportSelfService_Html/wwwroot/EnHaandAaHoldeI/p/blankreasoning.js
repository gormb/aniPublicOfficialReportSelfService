cfg_aiPromptWelcome=`Blank reasoning[detaljer] – rå maskinhjerne.
[detaljer]
<hr><b><i>Modell: o3mini reasoning</i></b>
Dette er en grunnmodell uten ekstra chat-trening. Den er ikke lært opp til å være “assistent,” men kun til å jobbe med data og logikk.
[detaljer c='Formål']<hr>*Formål*<br>Eksperimentering med rå språkmodell for analyse og resonnement.[/detaljer]
[detaljer c='Teknisk']<hr>*Teknisk*<br>Ingen system prompt aktivert. All styring må skje gjennom brukerens prompt, inkludert few-shot eksempler for å etablere ønsket stil og oppgaveforståelse.[/detaljer]
[/detaljer][/detaljer]`;

cfg.aiPrompt= [{ role: `system`, content: ``}
//,[`Hva er du?`, `Chatbot under utvikling`]
];

cfg.set(cfg_aiPromptWelcome,'blank reasoning','deepseek reasoner','p/aigap.webp')
setTimeout(()=>{ai.Reply=[''];ai.History[0]=[];msgInfo('Klar')},1000);