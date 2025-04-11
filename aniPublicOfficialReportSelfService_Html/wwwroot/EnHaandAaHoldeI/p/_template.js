cfg.aiPromptWelcome=`Under utvikling.<br/><br/>
<b><i>Denne appen er ikke bygget enda.</i></b>`;
cfg.aiPrompt= [{ role: `system`, content: `Du er chatbot`}
,[`Hva er du?`, `Chatbot under utvikling`]
];
ui.c.ImgA='https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg'
ui.c.ImgAReset()

msgSend('mistrallarge')

//document.documentElement.style.setProperty('--primary-color', '#0A6B80'); // mild salviegrønn
//ui.font.n('Roboto')

cfg.app='! arbeid pågår !'
