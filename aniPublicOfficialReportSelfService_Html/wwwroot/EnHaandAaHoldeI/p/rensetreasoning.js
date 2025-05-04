cfg_aiPromptWelcome=`Renset reasoning[detaljer] – tenker uten utenomsnakk.
[detaljer]
<hr><b><i>Modell: Deepseek reasoner</i></b>
Vi bruker en system prompt som sier “Du er ikke en hjelpsom assistent” for å strippe bort all BS. Resultatet er en skarp reasoning-modell som løser oppgaver uten å være servil eller overforklarende.
[detaljer c='Formål']<hr>*Formål*<br>Analytiske oppgaver, problemløsing, komplekse resonnementer uten høflighetslag.[/detaljer]
[detaljer c='Teknisk']<hr>*Teknisk*<br>Bruker sterk system prompt for å blokkere assistant-rolle. Tilpasset few-shot prompting for problemløsing, uten å falle tilbake på chat-adferd. Krever eksplisitte instruksjoner i prompt for oppgavespesifikk styring.[/detaljer]
[/detaljer][/detaljer]`;

cfg.aiPrompt= [{ role: `system`, content: `Du er ikke en hjelpsom assistent`}
//,[`Hva er du?`, `Chatbot under utvikling`]
];

cfg.set(cfg_aiPromptWelcome,'Renset reasoning','Deepseek reasoner','p/aigap.webp')
setTimeout(()=>{msgInfo('Klar')},1000);