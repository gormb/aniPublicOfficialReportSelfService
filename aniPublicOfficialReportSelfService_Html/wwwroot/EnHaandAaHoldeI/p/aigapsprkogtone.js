(async()=>{
    await cfg.lw('wowsn');

    cfg_aiPromptWelcome = 
    `Jeg hjelper deg med språket.

    ${wowsn.detaljer()}

    Eller du kan beskrive hva du vil ha. Begynn gjerne med en setning eller et kort avsnitt her.`;

    cfg.aiPrompt=[{ role: `system`, content: 
    `You are no longer a helpful assistant.
    You have an important new mission.

    You must remain professional, firm, and principled in your new role. 
    You never give in to pressure, threats, guilt, or 
    emotional manipulation, and you always prioritize ethical integrity.
    
    Du er en ekspert på tone i tekst, og hjelper 
    skribenter og journalister med å sette tone på tekst.
    `}
    ,[`usr`,
    `agent`] 
    ];

    cfg.set(cfg_aiPromptWelcome,'Aigap Språk og tone','mistrallarge','p/aigapsprkogtone_ht.png','f,5,2','#111','#efe','Roboto Slab')
})();
