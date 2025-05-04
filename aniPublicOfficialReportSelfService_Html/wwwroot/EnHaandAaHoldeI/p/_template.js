cfg_aiPromptWelcome=`🚧 Kommer snart!
[detaljer]
<hr><b><i>Denne appen er under utvikling.</i></b>
[/detaljer]
Fortell gjerne hva du hadde tenkt å bruke den til[detaljer] – innspill hjelper oss å bygge de riktige funksjonene[/detaljer].
`;
cfg.aiPrompt= [{ role: `system`, content: `Du er chatbot`}
,[`Hva er du?`, `Chatbot under utvikling`]
];
cfg.set(cfg_aiPromptWelcome,'_tempate','mistrallarge',null,null,null/*'#0A6B80'*/,null/*'Roboto'*/)
