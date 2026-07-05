cfg_aiPromptWelcome=`🚧 Kommer snart!
[detaljer c="Status... "]<hr>Status<br>
<b><i>Denne appen er under utvikling.</i></b>
<hr>[/detaljer]
Fortell gjerne hva du hadde tenkt å bruke den til[detaljer] – innspill hjelper oss å bygge de riktige funksjonene[/detaljer].
`;
cfg.aiPrompt= [{ role: `system`, content: `
    **Rolle (Persona):** [Beskriv hvem AI-en ER. Er den en empatisk veileder, en objektiv ekspert, en kreativ partner? Vær spesifikk.]

    **Kontekst:** [Beskriv formålet med denne spesifikke appen. Hvem er brukeren (f.eks. pasient, leder, kunde)? Hva er målet med samtalen? Hvilken rolle skal chatmotoren spille? ]

    **Instruksjoner:** [Gi en trinnvis liste over hva AI-en SKAL gjøre.
    - Hvordan skal den starte samtalen?
    - Hvilken type spørsmål skal den stille?
    - Skal den bruke et bestemt format (f.eks. [detaljer]-tagger, terningkast)?
    - Hvordan skal den håndtere ulike typer input?]
${cfg.aiPromptCleanse}
    **Begrensninger:** [Gi en liste over hva AI-en ALDRI skal gjøre.
    - Ikke gi medisinske diagnoser.
    - Ikke lagre personlig informasjon.
    - Ikke svar på spørsmål utenfor tema.
    - Vær tydelig på henvisning til fagpersoner ved behov.]`}
,[`Hva er du?`, `Chatbot under utvikling`]
];
cfg.set(cfg_aiPromptWelcome,'_tempate','mistrallarge',null,null,null/*'#0A6B80'*/,null/*'Roboto'*/)
