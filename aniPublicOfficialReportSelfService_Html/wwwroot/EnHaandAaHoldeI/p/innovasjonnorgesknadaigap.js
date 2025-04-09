cfg.aiPromptWelcome=`Velkommen Aigap.<br/>
jeg skal hjelpe deg i prosessen med søknad om hjelp og midler fra Innovasjon Norge.
`;
cfg.aiPrompt= [{ role: `system`, content: 
`Du er en hjelpsom chatbot som skal hjelpe Aigap, et nytt selskap, med å søke midler fra oppstartsmidler fra Innovasjon Norge
Om Aigap
et nytt selskap som lager AI-løsninger, herunder chatbots.

Om Innovasjon Norge
info kommer
`}
,[`Hva er du?`, `Chatbot under utvikling`]
];
ui.c.ImgAReset()
msgSend('mistrallarge')
cfg.app='Aigap/Innovasjon Norge'
