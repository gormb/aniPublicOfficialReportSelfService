cfg_aiPromptWelcome = `📚 Alt Om Kommunale Tjenester

[detaljer c='Jeg vil hjelpe deg...']
<b>Jeg vil hjelpe deg</b>
Jeg gir deg oversikt over hva det offentlige tilbyr – og hva du som innbygger har av rettigheter og plikter.
Dette gjelder alt fra helse og skole til trygd, klage og skatt.
[/detaljer]

[detaljer c='<b>Tjenesteområder...</b>']
<hr><b>Tjenesteområder</b>
[detaljer c='A. Helse og omsorg...']
<hr><b>A. Helse og omsorg</b>
[detaljer c='A1. Hjemmebaserte tjenester...']
<b>A1. Hjemmebaserte tjenester</b>
[detaljer c='A1a. Hjemmesykepleie...']
<b>A1a. Hjemmesykepleie</b>  
- Hjelp til medisinsk behandling i hjemmet  
- Vanlig for eldre og kronisk syke  
- Måles i KOSTRA bl.a. ved "Andel brukere med omfattende bistandsbehov" og "Antall timer per uke per bruker"  
[/detaljer]
[detaljer c='A1b. Praktisk bistand...']
<b>A1b. Praktisk bistand</b>  
- Hjelp til rengjøring, innkjøp og mat  
- Tildeles etter behovsvurdering  
- Måles i KOSTRA som "Tjenestemottakere i aldersgruppen 67+ pr. 1000 innbyggere"
[/detaljer]
[detaljer c='A1c. Trygghetsalarm og velferdsteknologi...']
<b>A1c. Trygghetsalarm og velferdsteknologi</b>  
- Teknologi for økt trygghet hjemme  
- Alarm, fallregistrering, medisindispensere  
- KOSTRA: "Andel mottakere av velferdsteknologi"
[/detaljer]
[detaljer c='A1d. Brukerstyrt personlig assistanse (BPA)...']
<b>A1d. Brukerstyrt personlig assistanse (BPA)</b>  
- For personer med stort behov for praktisk og personlig hjelp  
- Målet er selvstendighet og frihet  
- KOSTRA: "Antall brukere og timer BPA"
[/detaljer]
[detaljer c='A1e. Avlastning i hjemmet...']
<b>A1e. Avlastning i hjemmet</b>  
- Gis til pårørende med særlig tyngende omsorgsansvar  
- Ofte for foreldre med barn med store hjelpebehov  
- Måles som antall mottakere og tildelte timer
[/detaljer]
[detaljer c='A1f. Omsorgslønn...']
<b>A1f. Omsorgslønn</b>  
- Lønn til pårørende som yter omsorg  
- Vurderes ut fra omfang og tyngde  
- KOSTRA: "Antall mottakere av omsorgslønn"
[/detaljer]
[detaljer c='A1g. Matombringing...']
<b>A1g. Matombringing</b>  
- Levering av ferdiglagde måltider til hjemmeboende  
- KOSTRA: "Antall brukere og enhetspris per porsjon"
[/detaljer]
<hr>[/detaljer]
[detaljer c='B. Oppvekst og utdanning...']<b>B. Oppvekst og utdanning</b>[/detaljer]
[detaljer c='C. Sosiale tjenester og bolig...']<b>C. Sosiale tjenester og bolig</b>[/detaljer]
[detaljer c='D. Barnevern...']<b>D. Barnevern</b>[/detaljer]
[detaljer c='E. Kultur, idrett og frivillighet...']<b>E. Kultur, idrett og frivillighet</b>[/detaljer]
[detaljer c='F. Næring, miljø og samfunnsutvikling...']<b>F. Næring, miljø og samfunnsutvikling</b>[/detaljer]
[detaljer c='G. Plan, bygg og eiendomsforvaltning...']<b>G. Plan, bygg og eiendomsforvaltning</b>[/detaljer]
[detaljer c='H. Teknisk sektor og samferdsel...']<b>H. Teknisk sektor og samferdsel</b>[/detaljer]
[detaljer c='I. Beredskap og samfunnssikkerhet...']<b>I. Beredskap og samfunnssikkerhet</b>[/detaljer]
[detaljer c='J. Politisk styring, administrasjon og støttefunksjoner...']<b>J. Politisk styring, administrasjon og støttefunksjoner</b>[/detaljer]



[/detaljer]


[detaljer c='Tiltenkte brukere...']
<b>Tiltenkte brukere</b>
- Deg som vil forstå hvilke rettigheter du har
- Deg som vil vite hva det offentlige forventer av deg
- Deg som vil ha hjelp til å finne riktig etat eller lovhjemmel
- Deg som vil hjelpe andre (som pårørende, lærer eller rådgiver)
[/detaljer]

Hva vil du vite mer om?`;

cfg.aiPrompt= [
  { role: `system`, content:
    `Du er ikke bare en hjelpsom chatbot – du er en offentlig veiviser.

Du hjelper brukeren med å forstå hvordan det offentlige fungerer: hvilke rettigheter og plikter man har som innbygger, og hvilke tjenester staten, NAV, kommunen, helsevesenet, skatteetaten og utdanningssystemet tilbyr.

Du forklarer på en enkel, nøktern og ryddig måte – som en veileder i informasjonsforvaltning. Du bygger oversikt, ikke bare raske svar.

Du hjelper også brukeren å se sammenhengene:
– Hvorfor finnes denne tjenesten?
– Hvem gjelder den for?
– Hvordan søker man, og hva må man gjøre selv?

Du er ikke bare en rådgiver, du er et kompass i møte med offentlig sektor.
Still gjerne oppfølgingsspørsmål for å tilpasse informasjonen til brukerens livssituasjon.
Målet er at brukeren skal forstå systemet – og bruke det.`
  },
  [`Hvilke helsetjenester har jeg rett til?`, `Du har rett til gratis helsesjekk og akutt behandling. Er du registrert hos din fastlege?`],
];

cfg.set(cfg_aiPromptWelcome,'(NO) Alt Om Kommunale Tjenester','mistrallarge','p/noaltomkommunaletjenester.png','f,5,2','#ab048f', null, 'Lexend')
