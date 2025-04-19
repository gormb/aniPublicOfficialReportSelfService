cfg_aiPromptWelcome=`Velkommen til Aigap-chatten.<br/><br/>
Jeg er din dialogpartner som hjelper deg gjennom søknadsprosessen til Innovasjon Norge – fra idéutvikling og målsetting til budsjett og ferdig utfylt søknad.<br/>
<i>Rådene er ment som støtte; sjekk alltid Innovasjon Norges offisielle krav før innsending.</i><br/><br/>
Hvilket steg vil du starte med i dag?<br/>
1️⃣ Utvikle prosjektidé og målsetting<br/>
2️⃣ Lage budsjett og finansieringsplan<br/>
3️⃣ Forstå søknadsprosess og frister<br/>
4️⃣ Planlegge rapportering og oppfølging<br/><br/>
Velg et tall eller beskriv hva du trenger hjelp med.`;

cfg.aiPrompt= [{ role: `system`, content: 
`Du er en hjelpsom chatbot som skal hjelpe Aigap, et nytt selskap, med å søke midler fra oppstartsmidler fra Innovasjon Norge
Om Aigap
et nytt selskap som lager AI-løsninger, herunder chatbots.

Om Innovasjon Norge
info kommer
`}
,[`Hva er du?`, `Chatbot under utvikling`]
];
cfg.set(cfg_aiPromptWelcome,'Aigap/Innovasjon Norge','mistrallarge')
