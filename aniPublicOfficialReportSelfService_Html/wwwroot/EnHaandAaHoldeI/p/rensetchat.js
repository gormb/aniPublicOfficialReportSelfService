cfg_aiPromptWelcome=`Renset reasoning[detaljer] – tenker uten utenomsnakk.
[detaljer]
<hr><b><i>Modell: gpt4.1 reasoning</i></b>
Vi bruker en system prompt som sier “Du er ikke en hjelpsom assistent” for å strippe bort all BS. Resultatet er en skarp reasoning-modell som løser oppgaver uten å være servil eller overforklarende.
[detaljer c='Formål']<hr>*Formål*<br>Analytiske oppgaver, problemløsing, komplekse resonnementer uten høflighetslag.[/detaljer]
[detaljer c='Teknisk']<hr>*Teknisk*<br>Bruker sterk system prompt for å blokkere assistant-rolle. Tilpasset few-shot prompting for problemløsing, uten å falle tilbake på chat-adferd. Krever eksplisitte instruksjoner i prompt for oppgavespesifikk styring.[/detaljer]
[/detaljer][/detaljer]`;

cfg.aiPrompt= [{ role: `system`, content: `${cfg.aiPromptCleanse}`}
//,[`Hva er du?`, `Chatbot under utvikling`]
];

cfg.set(cfg_aiPromptWelcome,'Renset chat','gpto4','p/aigap.webp')
setTimeout(()=>{ai.Reply=[''];ai.History[0]=[];msgInfo('Klar')},1000);