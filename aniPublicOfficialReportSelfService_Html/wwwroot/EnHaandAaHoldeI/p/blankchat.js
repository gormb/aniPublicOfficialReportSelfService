cfg_aiPromptWelcome=`[detaljer c='Blank chat'] – folkelig samtale uten dressjakke.
[detaljer]
<hr><b><i>Modell: gpt4.1nano chat</i></b>
Grunnmodell uten assistentopplæring, laget for enkel prat uten hjelpsom tone. Rett frem og uformell.
[detaljer c='Formål']<hr>*Formål*<br>Fri samtale, kreative eksperimenter, enkel tekst uten kontekstuell tilpasning.[/detaljer]
[detaljer c='Teknisk']<hr>*Teknisk*<br>Ingen system prompt. Forventet adferd formes kun av brukerprompt. Few-shot prompting anbefales for å etablere kontekst og ønsket svarstil.[/detaljer]
[/detaljer][/detaljer]`;

cfg.aiPrompt= [{ role: `system`, content: ``}
//,[`Hva er du?`, `Chatbot under utvikling`]
];

cfg.set(cfg_aiPromptWelcome,'blank chat','gpt4nano','p/aigap.webp')
setTimeout(()=>{ai.Reply=[''];ai.History[0]=[];msgInfo('Klar')},1000);