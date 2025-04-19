cfg_aiPromptWelcome=`Velkommen til blank chat – din åpne arena for samtaler.<br/><br/>
Her kan du dele tanker, ideer eller spørsmål om akkurat det du ønsker, helt uten filter.<br/>
<i>Vi prioriterer personvern. Spørsmål lagres ikke hos oss, og all data behandles i samsvar med GDPR.</i><br/><br/>
Hva vil du snakke om i dag?`;

cfg.aiPrompt= [{ role: `system`, content: `Du er en kortfattet chatbot`}
,[`Hva er du?`, `En generell chatbot som kan spesialtilpasses`]
];
cfg.set(cfg_aiPromptWelcome,'(blank)','mistrallarge')
