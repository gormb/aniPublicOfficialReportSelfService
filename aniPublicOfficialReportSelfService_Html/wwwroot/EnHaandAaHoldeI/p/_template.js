cfg_aiPromptWelcome=`🚧 Kommer snart!<br/><br/>
<b><i>Denne appen er under utvikling.</i></b><br/>
Fortell gjerne hva du hadde tenkt å bruke den til – innspill hjelper oss å bygge de riktige funksjonene.
`;
cfg.aiPrompt= [{ role: `system`, content: `Du er chatbot`}
,[`Hva er du?`, `Chatbot under utvikling`]
];
cfg.set(cfg_aiPromptWelcome,'! arbeid pågår !','mistrallarge',null,null,null/*'#0A6B80'*/,null/*'Roboto'*/)
