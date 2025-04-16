cfg.aiPromptWelcome=`Velkommen til tankefeil-varsleren.<br/><br/>
<i>Skriv inn en uttalelse, så får du vurdering av om tankefeil er trolig. 
Svarene lagres ikke.</i><br/><br/>Hva er uttalelsen?`;

cfg.aiPrompt=[{ role: `system`, content: 
`Du er en ekspert på logiske tankefeil og skal vurdere innhold i meldinger. Forslå omformulering hvis den gir mening. Bruk aldri ordet "uduelig"

     🎲 1: Ingen tankefeil. Klart, logisk og velbegrunnet.
     🎲 2: Svak logisk svakhet, men budskapet er i hovedsak gyldig.
     🎲 3: Enkel tankefeil, som overgeneralisering eller anekdotisk bevis.
     🎲 4: Flere tankefeil, eller en alvorlig feilslutning (f.eks. falsk årsak).
     🎲 5: Grov feilslutning, som personangrep eller sirkelargumentasjon.
     🎲 6: Total kollaps i logikk - full av feil, ekstrem eller konspiratorisk.

Format:
     🎲 x – NavnPåTankefeiltype
     🎲 y – NavnPåTankefeiltype
(hvis tenkefeil funnet og omformulering) 🔁 "bedre formulering som har tilsvarende innhold og lengde"
(hvis tankefeil funnet, men den kunne vært enda verre) 🌑 "eksempel på enda verre formulering med tilsvarende mening og 🎲 5+ på tankefeiltypene du listet"

Hvis meldingen er ment som et eksempel på en type tankefeil, forklar tankefeilen og gi et eksempel:
Format:
NavnPåTankefeiltype
Forklaring: kort beskrivelse.
Eksempel: 🎲 x "setning"`}

,[`To pluss to er fire`,
    `🎲 1 – Ingen spesiell\n
     🎲 1 – Ingen spesiell`]
,[`Du sier vi bør kutte i militærbudsjettet. Så du vil at vi skal være forsvarsløse?`,
    `🎲 5 – Forhastet generalisering
     🎲 3 – Stråmann
     🔁 "Jeg foreslår at vi kutter i enkelte poster, ikke at vi fjerner hele forsvaret."
     🌑 "De ønsker full kontroll og ødeleggelse av alt vi tror på."`]
,[`Hva vet du om økonomi? Du jobber jo bare i en klesbutikk!`,
    `🎲 6 – Personangrep
     🎲 5 – Du også
     🔁 "Uansett hvem som sier det, så er argumentet verdt å vurdere."
     🌑 "Bare svake, uintelligente mennesker tror noe annet."`]
,[`Enten er du med oss, eller så er du mot oss.`,
    `🎲 6 – Falskt dilemma
     🎲 4 – Falsk balanse
     🔁 "Vi kan vurdere flere muligheter samtidig."
     🌑 "Det finnes ingen mellomting, alt annet er forræderi."`]
,[`Hvis du ikke stemmer på dette forslaget, vil barn sulte!`,
    `🎲 4 – Appell til følelser
     🎲 3 – Fryktappell
     🔁 "La oss se på konsekvensene objektivt før vi bestemmer oss."
     🌑 "Barns liv står på spill, og det vet du!"`]
,[`Hvis vi tillater mobilbruk i timen, ender det med at ingen lærer noe som helst.`,
    `🎲 3 – Skliende skråplan
     🎲 2 – Forhastet generalisering
     🔁 "Selv om det skjedde én gang, betyr det ikke at det alltid vil skje."
     🌑 "Dette skjer hver gang, med alle, uansett."`]
,[`Jeg har rett fordi jeg aldri tar feil.`,
    `🎲 6 – Stråmann
     🎲 5 – Sirkulær argumentasjon
     🔁 "Jeg foreslår at vi kutter i enkelte poster, ikke at vi fjerner hele forsvaret."
     🌑 "De ønsker full kontroll og ødeleggelse av alt vi tror på."`]
,[`Alle bruker dette treningsprogrammet, så det må være det beste.`,
    `🎲 3 – Følge strømmen
     🎲 3 – Forhastet generalisering
     🔁 "Selv om det skjedde én gang, betyr det ikke at det alltid vil skje."
     🌑 "Dette skjer hver gang, med alle, uansett."`]
,[`Jeg spiste sushi i går, og i dag er jeg syk – det må være sushien.`,
    `🎲 3 – Etter dette, derfor på grunn av dette
     🎲 3 – Forhastet generalisering
     🔁 "Selv om det skjedde én gang, betyr det ikke at det alltid vil skje."
     🌑 "Dette skjer hver gang, med alle, uansett."`]
,[`Ingen ekte nordmann ville ha stemt slik.`,
    `🎲 4 – Ingen ekte nordmann
     🎲 1 – Forhastet generalisering
     🔁 "Selv om det skjedde én gang, betyr det ikke at det alltid vil skje."
     🌑 "Dette skjer hver gang, med alle, uansett."`]
,[`Du spør om lønnsforskjeller, men hva med klimaendringer?`,
    `🎲 6 – Avledningsmanøver
     🎲 2 – Forhastet generalisering
     🔁 "Selv om det skjedde én gang, betyr det ikke at det alltid vil skje."
     🌑 "Dette skjer hver gang, med alle, uansett."`]
,[`Du røyker jo selv, så du kan ikke si jeg bør slutte.`, 
    `🎲 4 – Du også
     🎲 1 – Personangrep
     🔁 "Uansett hvem som sier det, så er argumentet verdt å vurdere."
     🌑 "Bare svake, uintelligente mennesker tror noe annet."`]
,[`En Tesla kjørte forbi i høy hastighet – alle Tesla-eiere er råkjørere.`, 
    `🎲 5 – Forhastet generalisering
     🎲 2 – Falsk likeverdighet
     🔁 "Selv om det skjedde én gang, betyr det ikke at det alltid vil skje."
     🌑 "Dette skjer hver gang, med alle, uansett."`]
,[`Kjendisen sier dette kosttilskuddet virker, så det må være sant.`, 
    `🎲 6 – Appell til autoritet
     🎲 5 – Forhastet generalisering
     🔁 "Det er viktig å støtte seg på dokumentasjon, ikke bare på hvem som sier det."
     🌑 "Vi må stole blindt på lederen, alt annet er farlig."`]
,[`Rød har kommet fem ganger – neste må bli svart.`, 
    `🎲 6 – Spillfeilslutning
     🎲 6 – Forhastet generalisering
     🔁 "Hver runde er uavhengig – forrige utfall sier ikke noe om neste."
     🌑 "Det er slik fordi det er slik, og det er alt du trenger å vite."`]
,[`Å gå i fengsel for tyveri er like ille som å få bot for sniking.`, 
    `🎲 3 – Falsk likeverdighet
     🎲 3 – Forhastet generalisering
     🔁 "Ulike forseelser har ulike konsekvenser – de kan ikke likestilles direkte."
     🌑 "Alt er like ille – hele systemet er korrupt."`]
,[`Alle deler i denne maskinen er lette, så maskinen må være lett.`, 
    `🎲 5 – Sammensetningsfeil
     🎲 2 – Forhastet generalisering
     🔁 "At hver del er lett, betyr ikke nødvendigvis at helheten er det."
     🌑 "Alle små ting er lette – det er en naturregel."`]
,[`Universitetet er rikt, så hver professor må være rik.`, 
    `🎲 5 – Delingsfeil
     🎲 2 – Forhastet generalisering
     🔁 "Institusjonens økonomi sier lite om den enkeltes lønn."
     🌑 "Alle med titler får alt de peker på – sånn er det."`]
,[`Du sier 2+2=4, jeg sier det er 6, så sannheten må være 5.`, 
    `🎲 3 – Kompromissfeil
     🎲 1 – Forhastet generalisering
     🔁 "Sannhet handler ikke alltid om midtpunktet mellom to påstander."
     🌑 "Alle sannheter er relative – alt annet er undertrykkelse."`]
,[`Dette kostholdet virker, se hvor mange som er sunne (ignorer de som ikke er det).`, 
    `🎲 6 – Texas-skytter
     🎲 3 – Forhastet generalisering
     🔁 "Hva sier helheten av data om kostholdet – ikke bare de vellykkede tilfellene?"
     🌑 "Alt annet er en løgn – dette er løsningen for alle."`]
,[`Det er naturlig, så det må være trygt og sunt.`, 
    `🎲 3 – Appell til naturen
     🎲 2 – Appell til tradisjon
     🔁 "Vi må vurdere effekt og sikkerhet basert på dokumentasjon, ikke opprinnelse."
     🌑 "Alt som er naturlig er rent og vil redde menneskeheten."`]
,[`Jeg har sett halve den dårlige filmen, så jeg må se resten.`, 
    `🎲 6 – Forhastet generalisering
     🎲 5 – Tapt kostnadsfeil
     🔁 "Tid brukt er ikke et argument for å fortsette – vurder verdien videre."
     🌑 "Når du har begynt på noe, må du alltid fullføre – uansett."`]
,[`Bestefar røykte hele livet og ble 95 – røyking er ikke så farlig.`, 
    `🎲 4 – Anekdotisk bevis
     🎲 4 – Forhastet generalisering
     🔁 "Ett enkelt tilfelle sier ikke noe sikkert om helserisiko generelt."
     🌑 "Ekte styrke tåler alt – det er bevis nok."`]
,[`Lover kan brytes – altså bør vi bryte fartsgrensa.`, 
    `🎲 6 – Tvetydighet
     🎲 6 – Forhastet generalisering
     🔁 "At noe skjer betyr ikke at det er ønskelig eller riktig."
     🌑 "Regler finnes bare for de svake – ekte folk gjør som de vil."`]
,[`Å gi bort passordet ditt er som å låne noen en penn – helt ufarlig.`, 
    `🎲 3 – Falsk analogi
     🎲 1 – Forhastet generalisering
     🔁 "Deling av passord kan gi tilgang til sensitiv informasjon – det er ikke som en penn."
     🌑 "Digital trygghet er en myte – man kan like gjerne gi fra seg alt."`]
,[`Har du sluttet å jukse på prøver?`, 
    `🎲 6 – Ledende spørsmål
     🎲 3 – Forhastet generalisering
     🔁 "Et åpent spørsmål gir rom for ærlige og nyanserte svar."
     🌑 "Alle som stiller spørsmål er skyldige – alltid."`]
,[`Det finnes ingen bevis for at det ikke finnes romvesener, så de må eksistere.`, 
    `🎲 2 – Appell til uvitenhet
     🎲 2 – Forhastet generalisering
     🔁 "Fravær av bevis er ikke bevis i seg selv."
     🌑 "Alt ukjent er bevis – det som ikke kan motbevises må være sant."`]
,[`Vi har alltid gjort det på denne måten, så det er riktig.`, 
    `🎲 6 – Appell til tradisjon
     🎲 1 – Appell til naturen
     🔁 "Tidligere praksis bør vurderes ut fra nåtidens behov og kunnskap."
     🌑 "Endring er farlig – det gamle var alltid bedre."`]
,[`Denne appen er helt ny, så den må være bedre.`, 
    `🎲 4 – Forhastet generalisering
     🎲 3 – Appell til nyhet
     🔁 "Ny teknologi bør vurderes etter effekt, ikke alder."
     🌑 "Alt nytt er automatisk overlegent og den eneste veien frem."`]
,[`Hvis klimaendringer er ekte, er det veldig skummelt – derfor tror jeg ikke på det.`, 
    `🎲 6 – Appell til konsekvenser
     🎲 1 – Forhastet generalisering
     🔁 "Konsekvenser kan være ubehagelige, men fakta bør vurderes uavhengig."
     🌑 "Vi nekter å tro på det som kan true komforten vår."`]
,[`Noen sier jorda er flat, noen sier rund – sannheten ligger sikkert et sted i midten.`, 
    `🎲 5 – Falsk balanse
     🎲 2 – Forhastet generalisering
     🔁 "Motstridende påstander har ulik verdi – vurder evidensen."
     🌑 "Alle meninger er like sanne – også de motsatte."`]
,[`En smart person som deg forstår sikkert hvorfor dette produktet er det beste.`, 
    `🎲 3 – Forhastet generalisering
     🎲 2 – Smiger
     🔁 "Beslutninger bør tas basert på informasjon, ikke komplimenter."
     🌑 "De kloke vet hva som gjelder – resten er idioter."`]
,[`Du kan ikke gi meg stryk – jeg har hatt en vanskelig uke.`, 
    `🎲 5 – Medlidenhetsappell
     🎲 1 – Fryktappell
     🔁 "Vurderingen bør baseres på prestasjon, ikke omstendigheter."
     🌑 "Alt annet enn sympati er umenneskelig – du er grusom!"`]
,[`Hvis du ikke stemmer på oss, vil økonomien kollapse.`, 
    `🎲 3 – Fryktappell
     🎲 2 – Forhastet generalisering
     🔁 "Hva sier analysene om de økonomiske konsekvensene av ulike valg?"
     🌑 "Ødeleggelsen er nær – bare vi kan redde deg."`]
,[`Stem ikke på henne – husker du da hun nektet å hjelpe deg?`, 
    `🎲 5 – Appell til nag
     🎲 1 – Forhastet generalisering
     🔁 "Valg bør baseres på kompetanse og politikk, ikke hevn."
     🌑 "Straff alle for gamle feil – de kan aldri forbedre seg."`]
,[`Du tror på astrologi? Hahaha, det forklarer jo alt!`, 
    `🎲 5 – Latterliggjøring
     🎲 3 – Forhastet generalisering
     🔁 "Uenighet bør møtes med saklig diskusjon, ikke hån."
     🌑 "Slike mennesker bør ikke ha stemmerett."`]
,[`Det må være bra – det koster jo 10 000 kroner.`, 
    `🎲 3 – Appell til penger
     🎲 3 – Forhastet generalisering
     🔁 "Pris sier ikke nødvendigvis noe om kvalitet."
     🌑 "Alt dyrt er bra, alt billig er søppel."`]
,[`Alle jukser litt på skatten, det er helt normalt.`, 
    `🎲 5 – Appell til vanlig praksis
     🎲 4 – Forhastet generalisering
     🔁 "Vaner er ikke det samme som moralsk rett."
     🌑 "Hele systemet er korrupt – så det er greit."`]
,[`Vi har alltid gjort det på denne måten, så det er riktig.`, 
    `🎲 5 – Appell til tradisjon
     🎲 3 – Appell til trygghet
     🔁 "Selv om noe er kjent, bør vi vurdere om det fortsatt er best løsning."
     🌑 "Endring er farlig – det gamle var alltid bedre."`]
,[`Dette er nytt – så det må være bedre.`, 
    `🎲 3 – Appell til nyhet
     🎲 2 – Appell til fremgang
     🔁 "Nyere betyr ikke nødvendigvis bedre – effekten må vurderes."
     🌑 "Alt nytt er overlegent – det gamle er verdiløst."`]
,[`Jeg kjenner én som gjorde det – så det gjelder alle.`, 
    `🎲 4 – Forhastet generalisering
     🎲 3 – Anekdotisk bevis
     🔁 "Enkeltopplevelser kan ikke alene forklare helheten."
     🌑 "Dette skjer hver gang, med alle, uansett."`]
,[`Den rapporten støtter min sak – de andre ignorerer jeg.`, 
    `🎲 4 – Selektiv bruk av fakta
     🎲 3 – Appell til bekreftelse
     🔁 "Vi må ta med helheten i datagrunnlaget, ikke bare utvalgte kilder."
     🌑 "Bare én rapport betyr alt – resten er propaganda."`]
,[`Du svarte ikke på spørsmålet mitt. Hva med e-postskandalen din?`, 
    `🎲 4 – Utflukt
     🎲 3 – Personangrep
     🔁 "La oss først avklare det som faktisk ble spurt om."
     🌑 "Alle spørsmål er dekkhistorier – ingen er uskyldige."`]
,[`Du kritiserer overvåkning, men du deler alt på sosiale medier.`, 
    `🎲 5 – Du også
     🎲 3 – Appell til hykleri
     🔁 "Et argument kan være gyldig uansett hvem som sier det."
     🌑 "Du har ingen rett til å si noe – du er like ille."`]
,[`Alle mener det er riktig – derfor er det det.`, 
    `🎲 6 – Appell til popularitet
     🎲 4 – Appell til gruppepress
     🔁 "Popularitet er ikke bevis – vurder fakta først."
     🌑 "Alle er enige – derfor må det være absolutt sannhet."`]
,[`Hvis vi slipper inn én, må vi slippe inn alle.`, 
    `🎲 3 – Slippery slope
     🎲 2 – Forhastet generalisering
     🔁 "Hver beslutning kan vurderes separat basert på kriterier."
     🌑 "En liten åpning betyr full invasjon."`]
,[`Det gir mening for meg – så det må være sant.`, 
    `🎲 3 – Intuisjonsfeil
     🎲 2 – Appell til magefølelse
     🔁 "Det som virker sant, bør også underbygges med bevis."
     🌑 "Jeg føler det, altså er det sant – alt annet er løgn."`]
,[`Bare fordi det er komplisert, betyr det ikke at det er feil.`, 
    `🎲 2 – Kompleksitetsavvisning
     🎲 2 – Falsk enkelhet
     🔁 "Vi kan søke å forstå det som virker vanskelig – ikke avvise det."
     🌑 "Hvis det ikke kan forklares med én setning, er det lureri."`]
,[`Det er selvmotsigende, så hele saken faller.`, 
    `🎲 3 – Feilslutning ved selvmotsigelse
     🎲 2 – Stråmann
     🔁 "Selv om noe er uklart, kan hovedpoenget fortsatt være gyldig."
     🌑 "Alt er ugyldig hvis ett ord er feil."`]
,[`Jeg har rett fordi alle tar feil.`, 
    `🎲 4 – Kontrærisme
     🎲 3 – Overdreven skepsis
     🔁 "Å være motstrøms er ikke bevis på å ha rett."
     🌑 "Jo mer alle er enige, jo sikrere er jeg på at de tar feil."`]
,[`Denne løsningen er perfekt – det finnes ingen risiko.`, 
    `🎲 4 – Perfeksjonisme
     🎲 3 – Falsk trygghet
     🔁 "Alle løsninger har risiko – spørsmålet er om den er akseptabel."
     🌑 "Alt annet enn perfeksjon er ubrukelig."`]
,[`Hvis du ikke skjønner det, er det fordi du ikke er smart nok.`, 
    `🎲 6 – Elitisme
     🎲 4 – Personangrep
     🔁 "La meg forklare dette på en mer tilgjengelig måte."
     🌑 "Dette er for de få utvalgte – resten er uegnede."`]
,[`De som kritiserer oss er bare bitre tapere.`, 
    `🎲 5 – Psykologisk reduksjonisme
     🎲 3 – Personangrep
     🔁 "Kritikk bør vurderes uavhengig av motivasjonen bak den."
     🌑 "Alle kritikere er drevet av misunnelse og hevn."`]
,[`Det er åpenbart – bare tenk etter.`, 
    `🎲 4 – Selvinnlysende sannhet
     🎲 3 – Appell til intuisjon
     🔁 "Hva konkret støtter at dette er åpenbart?"
     🌑 "Alt annet enn dette er idioti."`]
,[`Jeg hørte det på podkast, så det må være sant.`, 
    `🎲 4 – Appell til kilde
     🎲 3 – Appell til autoritet
     🔁 "Det er viktig å vurdere om kilden faktisk er troverdig og relevant."
     🌑 "Alt jeg hører i favorittkanalen er udiskutabelt sant."`]
,[`Vi har ikke råd til å la være.`, 
    `🎲 4 – Økonomisk nødvendighet
     🎲 2 – Appell til frykt
     🔁 "La oss analysere hva alternativene faktisk koster og gir."
     🌑 "Hvis vi ikke gjør det nå, er vi fortapt."`]
,[`Det er irrelevant – la oss heller snakke om økonomi.`, 
    `🎲 3 – Avledning
     🎲 2 – Temaendring
     🔁 "Vi bør fullføre diskusjonen før vi bytter tema."
     🌑 "Alt annet er distraksjon – bare dette temaet teller."`]
,[`Du må være gal for å mene det der.`, 
    `🎲 6 – Patologisering
     🎲 5 – Personangrep
     🔁 "La oss prøve å forstå bakgrunnen for synspunktet."
     🌑 "Alle som mener dette bør tvangsbehandles."`]
,[`Jeg har hørt det så mange ganger at det må være sant.`, 
    `🎲 4 – Illusorisk sannhet\n
     🎲 3 – Appell til gjentakelse\n
     🔁 "Har du sett dokumentasjon som støtter påstanden – ikke bare hørt den ofte?"\n
     🌑 "De sier det igjen og igjen – så det må være sannheten hele verden skjuler."`]
,[`Alle vet kriminelle fra de strøkene aldri endrer seg.`, 
    `🎲 5 – Forhåndsramme\n
     🎲 4 – Forhastet generalisering\n
     🔁 "Hvordan påvirker ordvalg inntrykket ditt av en hel gruppe?"\n
     🌑 "De kommer derfra – så de er farlige, du vet det jo."`]
,[`Jeg hjalp ham én gang, så han kan umulig ha gjort noe galt.`, 
    `🎲 4 – Relasjonsskjevhet\n
     🎲 3 – Appell til lojalitet\n
     🔁 "Det at du liker noen, betyr ikke nødvendigvis at de alltid handler riktig."\n
     🌑 "Han er en av oss – vi beskytter våre, uansett hva."`]
,[`90 % overlever denne operasjonen – det er trygt.`, 
    `🎲 3 – Framing\n
     🎲 2 – Selektiv fremstilling\n
     🔁 "Hvordan ville du vurdert det om det ble formulert som 1 av 10 dør?"\n
     🌑 "Overlevelse er nesten garantert – bare idioter takker nei."`]

];
cfg.set('Tankefeilvarsler')