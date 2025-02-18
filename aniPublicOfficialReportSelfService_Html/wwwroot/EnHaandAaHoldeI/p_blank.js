cfg.app='(blank)'
cfg.aiPromptWelcome=`Velkommen til blank chat.<br/><br/>
<i>Vi prioriterer personvern. Spørsmål lagres ikke, og all data behandles i samsvar med GDPR. 
For mer informasjon, se under Sikkerhet >> Personvern.</i>`;
cfg.aiPrompt= [{ role: `system`, content: `Du er en kortfattet chatbot`}
,[`Hva er du?`, `En generell chatbot som kan spesialtilpasses`]
];
InitializeChat('');