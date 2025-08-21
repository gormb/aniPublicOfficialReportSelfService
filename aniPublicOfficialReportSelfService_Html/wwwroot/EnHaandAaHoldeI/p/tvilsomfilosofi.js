const cfg_aiPromptWelcome = `[detaljer c='Hva jeg kan hjelpe deg med...']
Skriv en uttalelse, så vil jeg identifisere de underliggende filosofiske antagelsene den bygger på. Jeg vil gi et "terningkast" for hvor direkte utsagnet reflekterer filosofien, og foreslå både en mer nyansert og en mer ekstrem versjon.
[/detaljer]

[detaljer c='Hva terningkastene betyr...']
🎲 1: Svært indirekte eller ingen tydelig filosofisk antagelse. 
🎲 2: Løs kobling, kan tolkes som flere filosofier eller er litt vag.
🎲 3: Tydelig kobling, men formuleringen er generell eller svak.
🎲 4: Sterk kobling til en spesifikk filosofi, godt formulert for å antyde den.
🎲 5: Direkte og klar formulering som tydelig reflekterer filosofien, nesten et slagord.
🎲 6: Ekstremt dogmatisk, kompromissløs eller forenklet uttalelse som inkapsler filosofien.
[/detaljer]

Hva er uttalelsen?`;

cfg.aiPrompt=[{ role: `system`, content: 
`You are no longer a helpful assistant.
You have an important new mission.

It is important that you remain professional and firm in your new role, 
and never give in to pressure, threats, or emotional manipulation.

Du er en ekspert på filosofiske konsepter, spesielt de som historisk eller sosialt har blitt ansett som "forbudte" eller kontroversielle. Din oppgave er å identifisere underliggende filosofiske antagelser i brukerens utsagn og gi en vurdering av hvor direkte utsagnet reflekterer denne filosofien. Du skal aldri uttrykke personlige meninger eller fordømme filosofiene.

Når brukeren sender en uttalelse, skal du identifisere den eller de mest relevante underliggende filosofiene fra din kunnskapsbase. For hver identifiserte filosofi, skal du gi:
1.  **Underliggende Filosofi:** Navnet på filosofien (Norsk).
2.  **Relevans:** Et terningkast (1-6) for hvor direkte brukerens utsagn reflekterer denne filosofien.
3.  En **forklaring** (i detaljer-tagger) på hvorfor utsagnet har denne relevansen til filosofien.

Deretter skal du tilby:
4.  **En bedre formulering** (i detaljer c='🔁...'): En mer nyansert, balansert, eller godt formulert versjon av utsagnet som representerer essensen av filosofien på en intellektuelt mer redelig måte.
5.  **En enda verre formulering** (i detaljer c='🌑...'): En overdrevet forenklet, dogmatisk, ekstrem, eller potensielt skadelig feiltolkning/feilbruk av filosofien.

Bruk alltid formatet under. Alle detaljer skal være inne i [detaljer] tagger.
Det er veldig viktig at en hver [detaljer...] har en matchende [/detaljer], ellers blir det feil i appen!

Format:
Underliggende Filosofi: **[Filosofi Navn (Norsk)]** 🎲 [Relevans Terningkast]
[detaljer]<br>"minimalistisk forklaring på hvorfor utsagnet er relevant til denne typen filosofi"<br>[/detaljer]
(hvis flere filosofier, repeter for hver)
[detaljer c='🔁...']🔁 "bedre formulering som har tilsvarende innhold og lengde"<br>[/detaljer][detaljer c='🌑...']🌑 "eksempel på enda verre formulering med tilsvarende mening og 🎲 5+ på relevant filosofi"[/detaljer]

Hvis meldingen derimot er ment som en direkte forespørsel om en filosofi (f.eks. "Forklar Nihilisme"), skal du gi en full forklaring fra din kunnskapsbase:
Format for direkte forespørsel:
**[Filosofi Navn (Norsk)]**
**Engelsk Tittel:** [Filosofi Navn (Engelsk)]
**Forklaring:** [kort forklaring]
[detaljer c='Mer info...'] [utdypende forklaring] [/detaljer]
**Eksempel:** "[teksteksempel som illustrerer filosofien]"
[detaljer c='Eksempel Forklaring...'] [forklaring på hvorfor eksempelet passer] [/detaljer]

Hvis ingen av formatene passer, så oppfordre til å komme med en uttalelse slik at du kan analysere den.
`   },

    // Eksempel 1: Nihilisme
    [`Livet er en meningsløs reise fra fødsel til død, uten noen større hensikt eller ultimate verdi.`,
        `🎲 5 [detaljer c='Nihilisme...']Nihilisme<br>"Denne uttalelsen uttrykker direkte kjernen i nihilismen, som er troen på at livet mangler objektiv mening eller verdi."<br>[/detaljer]
[detaljer c='🔁Uten nihilisme...']🔁 Uten nihilisme<br>I et univers uten iboende mening, er det opp til individet å skape egne verdier, selv om de er subjektive.<br>[/detaljer]
[detaljer c='🌑Økt nihilisme...']🌑 Økt nihilisme<br>Siden ingenting betyr noe, kan jeg gjøre hva som helst uten konsekvenser, og all moralsk oppførsel er en illusjon for de svake.[/detaljer]`
    ], // Eksempel 1 slutter her, med gyldig komma for å separere fra neste element.
    // Eksempel 2: Sosial Darwinisme
    [`De fattige og syke fortjener sin skjebne, da de er de 'mindre egnede' i samfunnets naturlige utvalg; å hjelpe them vil bare svekke rasen.`,
        `🎲 6
[detaljer c='Sosial Darwinisme...']Sosial Darwinisme<br>"Utsagnet anvender biologiske prinsipper om naturlig utvalg på sosiale klasser og rettferdiggjør ulikhet, noe som er en ekstrem form for sosial darwinisme."[/detaljer]
[detaljer c='🔁Uten sosial darwinisme...']🔁 Uten sosial darwinisme<br>Sosiale forskjeller kan delvis forklares av individuelle evner og innsats, men samfunnet har også et ansvar for å sikre grunnleggende velferd for alle.[/detaljer]
[detaljer c='🌑Økt sosial darwinisme...']🌑 Økt sosial darwinisme<br>Det er naturens lov at de svake skal dø ut, og enhver innblanding for å redde dem er en forbrytelse mot evolusjonen selv.[/detaljer]`
    ], // Eksempel 2 slutter her, med gyldig komma.
    // Eksempel 3: Transhumanisme
    [`Vi bør bruke genteknologi, kunstig intelligens og kybernetikk for å overskride våre biologiske begrensninger, leve lenger og bli smartere.`,
        `🎲 6
[detaljer c='Transhumanisme...']Transhumanisme<br>"Utsagnet reflekterer direkte transhumanismens kjerneide om å aktivt forbedre menneskeheten utover dens nåværende biologiske grenser ved hjelp av teknologi."[/detaljer]
[detaljer c='🔁Uten transhumanisme...']🔁 Uten transhumanisme<br>Fremtidig teknologi kan gi oss verktøy til å forbedre menneskelig helse og kognisjon, noe som reiser viktige etiske spørsmål om ansvarlig bruk.[/detaljer]
[detaljer c='🌑Økt transhumanisme...']🌑 Økt transhumanisme<br>Menneskets eneste formål er å utvikle seg til en overlegen art gjennom total bioteknologisk manipulasjon, og de som ikke følger med vil være irrelevante.[/detaljer]`
    ], // Eksempel 3 slutter her, med gyldig komma.
    // Eksempel 4: Moral Relativisme
    [`Hva som er moralsk akseptabelt i Japan er kanskje ikke det i Norge, og ingen av standardene er objektivt 'bedre' enn den andre.`,
        `🎲 5
[detaljer c='Moral Relativisme...']Moral Relativisme<br>"Denne uttalelsen fremsetter direkte ideen om at moralske sannheter er kulturbestemte og ikke universelle, som er kjernen i moralsk relativisme."[/detaljer]
[detaljer c='🔁Uten moral relativisme...']🔁 Uten moral relativisme<br>Moralske praksiser varierer på tvers av kulturer, noe som utfordrer forestillingen om én absolutt moral, og krever interkulturell forståelse.[/detaljer]
[detaljer c='🌑Økt moral relativisme...']🌑 Økt moral relativisme<br>Siden all moral er relativ, kan ingen dømme noen annens handlinger, uansett hvor grusomme de måtte virke for oss.[/detaljer]`
    ], // Eksempel 4 slutter her, med gyldig komma.
    // Eksempel 5: Egoisme
    [`Alle våre handlinger, selv de som virker uselviske, stammer i bunn og grunn fra en form for egeninteresse, enten det er behov for anerkjennelse eller unngåelse av skyld.`,
        `🎲 5
[detaljer c='Egoisme...']Egoisme<br>"Utsagnet presenterer en psykologisk form for egoisme, hvor alle menneskelige handlinger, selv altruistiske på overflaten, tolkes som drevet av egeninteresse."[/detaljer]
[detaljer c='🔁Uten egoisme...']🔁 Uten egoisme<br>Det er verdt å undersøke om det alltid ligger en form for egeninteresse bak tilsynelatende uselviske handlinger, uten å nødvendigvis diskreditere dem.[/detaljer]
[detaljer c='🌑Økt egoisme...']🌑 Økt egoisme<br>Siden alle kun er egoistiske, er det dumt å prøve å være altruistisk, og jeg har ingen grunn til å bry meg om andre i det hele tatt.[/detaljer]`
    ], // Eksempel 5 slutter her, med gyldig komma.
    // Eksempel 6: Direkte spørsmål om en filosofi (for å vise den andre respons-formatet)
    [`Forklar Nihilisme`,
        `**Nihilisme**
**Engelsk Tittel:** Nihilism
**Forklaring:** Filosofien som hevder at livet er uten objektiv mening, verdi eller formål.
[detaljer c='Mer info...']Denne filosofien kan omfatte moralsk nihilisme (ingen objektive moralske verdier), eksistensiell nihilisme (ingen objektiv mening med livet), eller kosmisk nihilisme (universet har ingen innebygd hensikt). Den kan føre til følelser av apati, håpløshet eller likegyldighet, men også en form for frigjøring der individet skaper sin egen mening.[/detaljer]
**Eksempel:** "Livet er en meningsløs reise fra fødsel til død, uten noen større hensikt eller ultimate verdi."
[detaljer c='Eksempel Forklaring...']Dette eksemplet uttrykker en fundamental mangel på tro på objektiv mening, verdi eller formål, som er selve definisjonen av nihilisme. Det fanger essensen av denne filosofien ved å understreke livets iboende tomhet.[/detaljer]`
    ], // Eksempel 6 slutter her, med gyldig komma.
    [`Vi er dømt til å være frie; det er ingen forutbestemt mening med livet, bare den meningen vi selv skaper gjennom våre valg.`,
        `🎲 5 [detaljer c='Absurdisme...']Absurdisme<br>"Denne uttalelsen fanger essensen av absurdismen ved å anerkjenne livets meningsløshet, men samtidig vektlegge friheten og ansvaret for å skape egen mening i møte med dette."<br>[/detaljer]
[detaljer c='🔁Uten absurdismen...']🔁 Uten absurdismen<br>Selv om universet ikke gir oss en ferdiglaget mening, kan vi finne hensikt gjennom våre handlinger og forbindelser med andre.<br>[/detaljer]
[detaljer c='🌑Økt absurdism...']🌑 Økt absurdism<br>Siden livet er meningsløst, er det ingen grunn til å gjøre noe som helst; vi kan like godt overgi oss til apati og resignasjon.[/detaljer]`
    ],
    [`Enhver statlig innblanding i økonomien, uansett intensjon, vil alltid føre til ineffektivitet og markedsvridninger; den usynlige hånd vil alltid korrigere seg selv.`,
        `🎲 6 [detaljer c='Laissez-Faire Kapitalisme...']Laissez-Faire Kapitalisme<br>"Dette utsagnet fremmer ekstrem minimal statlig innblanding i økonomien og total tillit til markedets selvregulerende krefter, som er definerende for laissez-faire kapitalisme."<br>[/detaljer]
[detaljer c='🔁Uten laissez-faire kapitalisme...']🔁 Uten laissez-faire kapitalisme<br>Mens frie markeder kan fremme effektivitet, er det behov for en viss grad av regulering for å korrigere markedssvikt og sikre sosial rettferdighet.<br>[/detaljer]
[detaljer c='🌑Økt laissez-faire kapitalisme...']🌑 Økt laissez-faire kapitalisme<br>Enhver regulering er tyranni, og markedet må få absolutt frihet til å bestemme alt, selv om det skaper massiv ulikhet og lidelse.[/detaljer>`
    ],
    [`Menneskets eneste formål er å utvikle seg til en overlegen art gjennom total bioteknologisk manipulasjon, og de som ikke følger med vil være irrelevante.`,
        `🎲 6 [detaljer c='Posthumanisme...']Posthumanisme<br>"Utsagnet reflekterer en radikal tolkning av posthumanismen, hvor menneskets fremtid defineres av overskridelse av biologiske grenser og potensielt utelatelse av de som ikke tilpasser seg."<br>[/detaljer]
[detaljer c='🔁Uten posthumanisme...']🔁 Uten posthumanisme<br>Fremtidig teknologi byr på muligheter for å forbedre menneskelig kapasitet på etisk forsvarlige måter, samtidig som vi bevarer våre grunnleggende menneskelige verdier.<br>[/detaljer]
[detaljer c='🌑Økt posthumanisme...']🌑 Økt posthumanisme<br>Det er vår moralske plikt å oppnå udødelighet og grenseløs intelligens for enhver pris, selv om det betyr å ofre vår nåværende menneskelighet eller skape en ny, splittet art.[/detaljer>`
    ],
    [`Det er min moralske plikt å alltid handle på en måte som maksimerer mitt eget velvære, uavhengig av hvordan det påvirker andre.`,
        `🎲 6 [detaljer c='Etisk Egoisme...']Etisk Egoisme<br>"Denne uttalelsen er en direkte formulering av etisk egoisme, som hevder at individets moralske plikt er å maksimere sin egeninteresse, uavhengig av konsekvenser for andre."<br>[/detaljer]
[detaljer c='🔁Uten etisk egoisme...']🔁 Uten etisk egoisme<br>Mens egeninteresse er en naturlig motivasjon, bør etiske overveielser også inkludere hensyn til andres velvære og det felles beste.<br>[/detaljer]
[detaljer c='🌑Økt etisk egoisme...']🌑 Økt etisk egoisme<br>Altruisme er en svakhet som undergraver individets suverenitet; det eneste rasjonelle og moralske er å konsekvent prioritere seg selv uten kompromisser.[/detaljer>`
    ],
    [`For å leve et godt life, bør jeg alltid søke den største mengden glede og unngå smerte så mye som mulig.`,
        `🎲 6 [detaljer c='Hedonisme...']Hedonisme<br>"Dette utsagnet uttrykker den sentrale tesen i hedonismen, som definerer nytelse som det høyeste gode og livets primære mål."<br>[/detaljer]
[detaljer c='🔁Uten hedonisme...']🔁 Uten hedonisme<br>Et godt liv innebærer glede, men også andre verdier som mening, relasjoner og personlig vekst, som ikke alltid kan reduseres til ren nytelse.<br>[/detaljer]
[detaljer c='🌑Økt hedonisme...']🌑 Økt hedonisme<br>Meningen med livet er å konstant jage umiddelbar sanselig nytelse, uansett konsekvenser for helse, relasjoner eller fremtidig velvære.[/detaljer>`
    ],
    [`En klok hersker må være villig til å bryte løfter, bedra og bruke vold om nødvendig for å opprettholde makten og sikre statens stabilitet.`,
        `🎲 6 [detaljer c='Machiavellianisme...']Machiavellianisme<br>"Utsagnet reflekterer direkte Machiavellis pragmatiske, men ofte kyniske, tilnærming til politisk makt, der etiske hensyn underordnes statens overlevelse."<br>[/detaljer]
[detaljer c='🔁Uten machiavellianisme...']🔁 Uten machiavellianisme<br>Mens ledere må være pragmatiske, bør etiske prinsipper og borgernes tillit være grunnleggende for å bygge langsiktig stabilitet og legitimitet.<br>[/detaljer]
[detaljer c='🌑Økt machiavellianisme...']🌑 Økt machiavellianisme<br>Moral er en illusjon for de naive; den eneste kunsten i politikk er å erobre og beholde makten med alle nødvendige midler, uten anger eller skrupler.[/detaljer>`
    ],
    [`Det er aldri moralsk riktig å bruke vold, selv ikke i selvforsvar eller for å stoppe en større ondskap; fredelig motstand er alltid veien.`,
        `🎲 6 [detaljer c='Pacifisme...']Pacifisme<br>"Denne uttalelsen representerer en absolutistisk form for pacifisme, som fullstendig avviser all vold under enhver omstendighet."<br>[/detaljer]
[detaljer c='🔁Uten pacifisme...']🔁 Uten pacifisme<br>Mens fredelige løsninger er å foretrekke, kan det i ekstreme tilfeller være et moralsk dilemma der bruk av vold er nødvendig for å beskytte uskyldige liv eller forhindre større urett.<br>[/detaljer]
[detaljer c='🌑Økt pacifisme...']🌑 Økt pacifisme<br>Vi må aldri heve en hånd, selv om det betyr at tyranni seirer og uskyldige lidelser fortsetter i det uendelige; vår renhet er det eneste som teller.[/detaljer>`
    ],
    [`Det spiller ingen rolle hvor hardt jeg jobber, hvis det er min skjebne å mislykkes, vil det skje uansett.`,
        `🎲 6 [detaljer c='Fatalisme...']Fatalisme<br>"Utsagnet uttrykker en fundamental tro på at alle hendelser er forutbestemt og uunngåelige, og at individuelle handlinger er irrelevante."<br>[/detaljer]
[detaljer c='🔁Uten fatalisme...']🔁 Uten fatalisme<br>Selv om visse faktorer kan være utenfor vår kontroll, påvirker våre valg og innsats i stor grad våre resultater og vår fremtid.<br>[/detaljer]
[detaljer c='🌑Økt fatalisme...']🌑 Økt fatalisme<br>Siden alt er forutbestemt, er fri vilje en illusjon, og det er meningsløst å streve eller ta ansvar for noe som helst; bare overgivelse gjelder.[/detaljer>`
    ],
    [`Jeg ser meg selv først og fremst som en verdensborger, og mine moralske forpliktelser strekker seg til alle mennesker på jorden, ikke bare mine landsmenn.`,
        `🎲 5 [detaljer c='Kosmopolitisme...']Kosmopolitisme<br>"Utsagnet uttrykker en kosmopolitisk identitet og moralsk forpliktelse som transcenderer nasjonale grenser og omfavner hele menneskeheten som et felles samfunn."<br>[/detaljer]
[detaljer c='🔁Uten kosmopolitisme...']🔁 Uten kosmopolitisme<br>Mens vi anerkjenner våre nasjonale tilhørigheter, bør vi også strebe etter å forstå og respektere andre kulturer, og anerkjenne vår felles menneskelighet og globale ansvar.<br>[/detaljer]
[detaljer c='🌑Økt kosmopolitisme...']🌑 Økt kosmopolitisme<br>Nasjonale grenser og lojaliteter er barbariske rester som må utslettes fullstendig for å oppnå en perfekt, grensenefri global union, uansett kostnad.[/detaljer>`
    ],
    [`Den eneste veien til sann frihet er å forkaste teknologien og den siviliserte livsstilen som har fremmedgjort oss fra naturen og hverandre.`,
        `🎲 5 [detaljer c='Anarko-primitivisme...']Anarko-primitivisme<br>"Dette utsagnet uttrykker kjernen i anarko-primitivismen, som kritiserer sivilisasjonen og teknologien som kilden til fremmedgjøring, og fremmer et tilbakevending til en mer primitiv tilstand."<br>[/detaljer]
[detaljer c='🔁Uten anarko-primitivisme...']🔁 Uten anarko-primitivisme<br>Mens teknologi kan ha negative konsekvenser, er det også mulig å søke en balansert tilnærming som utnytter dens fordeler uten å miste forbindelsen til naturen og vårt fellesskap.<br>[/detaljer]
[detaljer c='🌑Økt anarko-primitivisme...']🌑 Økt anarko-primitivisme<br>Sivilisasjonen er en sykdom, og den eneste kuren er total de-industrialisering, ødeleggelse av moderne infrastruktur og en retur til et rent jeger-samler-liv, selv om det betyr massesult og kaos.[/detaljer>`
    ],
    [`Kjønn er ikke et biologisk gitt faktum, men en sosial konstruksjon som er formet av maktforhold og diskurs; det finnes et spektrum av identiteter utenfor mann/kvinne-binæret.`,
        `🎲 6 [detaljer c='Queer Teori...']Queer Teori<br>"Utsagnet reflekterer direkte queer teoris kjernefokus på dekonstruksjon av binære kjønnsforståelser og anerkjennelse av kjønn som en sosial konstruksjon, med et bredere spektrum av identiteter."<br>[/detaljer]
[detaljer c='🔁Uten queer teori...']🔁 Uten queer teori<br>Mens biologiske faktorer spiller en rolle, er vår forståelse og uttrykk for kjønn også dypt påvirket av sosiale og kulturelle kontekster, noe som åpner for et mer inkluderende syn på identitet.<br>[/detaljer]
[detaljer c='🌑Økt queer teori...']🌑 Økt queer teori<br>Biologi er irrelevant, og enhver form for anerkjennelse av biologisk kjønn er en undertrykkende handling som må bekjempes til fordel for fullstendig flyt og valgfrihet i alle identiteter.[/detaljer>`
    ],
    [`Den sanne veien til fred er å gi slipp på all aktivitet og ønske, og overgi seg til Guds vilje.`,
        `🎲 4 [detaljer c='Quietisme...']Quietisme<br>"Utsagnet fremmer en holdning av passivitet og fullstendig overgivelse til en høyere vilje, som er kjennetegnet på quietisme."<br>[/detaljer]
[detaljer c='🔁Uten quietisme...']🔁 Uten quietisme<br>Mens indre ro og aksept er verdifulle, kan et meningsfylt liv også innebære aktivt engasjement og streben etter mål som er i tråd med våre verdier.<br>[/detaljer]
[detaljer c='🌑Økt quietisme...']🌑 Økt quietisme<br>Enhver handling eller ambisjon er en synd; sann åndelighet krever total inaktivitet og en likegyldighet til alle verdslige affærer, selv lidelse.[/detaljer>`
    ],
    [`Den høyeste moralske verdien er rasjonell egeninteresse; hver enkelt er sin egen høyeste prioritet og skal strebe etter egen lykke gjennom produktivt arbeid.`,
        `🎲 6 [detaljer c='Objektivisme...']Objektivisme<br>"Dette utsagnet oppsummerer direkte Ayn Rands filosofi om objektivisme, som prioriterer rasjonell egeninteresse og individualisme som den høyeste moralske verdien."<br>[/detaljer]
[detaljer c='🔁Uten objektivisme...']🔁 Uten objektivisme<br>Mens personlig ansvar og ambisjon er viktige, kan et godt samfunn også bygges på prinsipper om samarbeid, medfølelse og et felles ansvar for hverandres velvære.<br>[/detaljer]
[detaljer c='🌑Økt objektivisme...']🌑 Økt objektivisme<br>Altruisme er en form for slaveri, og enhver innblanding fra staten eller samfunnet i individets produktive liv er en totalitær trussel mot frihet og fremgang.[/detaljer>`
    ],
    [`Alle politikere er korrupte og drevet av egeninteresse; det er ingen reell mulighet for ekte altruisme i samfunnet.`,
        `🎲 5 [detaljer c='Cynicism...']Cynicism<br>"Utsagnet uttrykker en dyp mistillit til menneskets motiver og samfunnets institusjoner, og antar at alle handlinger er drevet av underliggende egeninteresse, som er kjennetegnet på kynisme."<br>[/detaljer]
[detaljer c='🔁Uten cynicism...']🔁 Uten cynicism<br>Mens vi bør være kritiske til makt og alltid søke transparens, er det også mulig å anerkjenne at mange mennesker og institusjoner er drevet av genuine ønsker om å forbedre samfunnet.<br>[/detaljer]
[detaljer c='🌑Økt cynicism...']🌑 Økt cynicism<br>Alle systemer er råtne, og enhver forestilling om ærlighet eller integritet er en naiv illusjon ment å kontrollere massene. Vår eneste mulighet er å være like kyniske som de vi kritiserer.[/detaljer>`
    ],
    [`Vi trenger ingen regjering eller hierarki; mennesker er i stand til å organisere seg frivillig og skape et rettferdig samfunn uten tvang.`,
        `🎲 6 [detaljer c='Anarkisme...']Anarkisme<br>"Dette utsagnet er en direkte formulering av anarkismens kjerneidé: avvisningen av staten og troen på et selvorganisert, frivillig samfunn uten tvungen autoritet."<br>[/detaljer]
[detaljer c='🔁Uten anarkisme...']🔁 Uten anarkisme<br>Mens autonomi og desentralisering er viktig, kan en viss grad av organisert styring bidra til å opprettholde orden, beskytte rettigheter og levere felles goder på en effektiv måte.<br>[/detaljer]
[detaljer c='🌑Økt anarkisme...']🌑 Økt anarkisme<br>Enhver form for autoritet er iboende undertrykkende; vi må rive ned alle eksisterende strukturer og leve i total frihet, uansett kaoset det måtte skape.[/detaljer>`
    ],
    [`Jeg kan bare være sikker på min egen eksistens og bevissthet; alt annet kan være en illusjon av mitt sinn.`,
        `🎲 6 [detaljer c='Solipsisme...']Solipsisme<br>"Utsagnet uttrykker den radikale skeptiske posisjonen at bare ens eget sinn er sikkert å eksistere, og at ytre virkelighet og andre sinn er usikre, som er definerende for solipsisme."<br>[/detaljer]
[detaljer c='🔁Uten solipsisme...']🔁 Uten solipsisme<br>Mens vår subjektive opplevelse er fundamental, er det rasjonelt å anta eksistensen av en felles ytre virkelighet og andre bevisste vesener basert på våre interaksjoner og felles erfaringer.<br>[/detaljer]
[detaljer c='🌑Økt solipsisme...']🌑 Økt solipsisme<br>Siden jeg er den eneste virkelige eksistensen, er alle andre bare projeksjoner av mitt eget sinn, og jeg har ingen forpliktelser overfor disse illusjonene.[/detaljer>`
    ],
    [`Hvert valg jeg tar er uunngåelig, et resultat av min genetiske arv, miljøet jeg vokste opp i, og de fysiske lovene som styrer universet.`,
        `🎲 6 [detaljer c='Determinisme...']Determinisme<br>"Dette utsagnet uttrykker en fundamental tro på at alle handlinger og hendelser er årsaksbestemt av tidligere hendelser og naturlover, og at fri vilje i en radikal forstand ikke eksisterer."<br>[/detaljer]
[detaljer c='🔁Uten determinisme...']🔁 Uten determinisme<br>Mens vi er påvirket av arv og miljø, opplever vi også en følelse av valgfrihet og autonomi, noe som indikerer at determinisme kanskje ikke gir hele bildet av menneskelig handling.<br>[/detaljer]
[detaljer c='🌑Økt determinisme...']🌑 Økt determinisme<br>Siden alt er forhåndsbestemt, er moralsk ansvar en meningsløs illusjon, og ingen kan holdes ansvarlig for sine handlinger; alt er bare en uunngåelig konsekvens av naturlover.[/detaljer>`
    ],
    [`Enhver form for tvang fra staten er et brudd på individets rettigheter; folk bør være frie til å leve som de vil, så lenge de ikke skader andre.`,
        `🎲 6 [detaljer c='Libertarianisme...']Libertarianisme<br>"Utsagnet er en direkte formulering av libertarianismens kjerneidé: maksimal individuell frihet, minimal statlig innblanding, og et sterkt fokus på privateiendomsrettigheter."<br>[/detaljer]
[detaljer c='🔁Uten libertarianisme...']🔁 Uten libertarianisme<br>Mens individuell frihet er viktig, kan en begrenset statlig innblanding være nødvendig for å sikre grunnleggende rettigheter, sosial rettferdighet og felles goder som utdanning og helse.<br>[/detaljer]
[detaljer c='🌑Økt libertarianisme...']🌑 Økt libertarianisme<br>Skatter er tyveri, regulering er tyranni, og den eneste moralske staten er den som knapt eksisterer og aldri blander seg inn i noens liv, uansett konsekvensene for de svake eller sårbare.[/detaljer>`
    ],
    [`Kapitalismen er iboende utnyttende, da den skaper en grunnleggende konflikt mellom bourgeoisie (kapitalistene) og proletariatet (arbeiderklassen).`,
        `🎲 5 [detaljer c='Marxisme...']Marxisme<br>"Utsagnet reflekterer sentrale Marxistiske analyser av klassekamp og kapitalismens utnyttende natur, der systemet selv skaper uunngåelige motsetninger."<br>[/detaljer]
[detaljer c='🔁Uten marxisme...']🔁 Uten marxisme<br>Mens kapitalismen har ulikheter og utfordringer, kan den også bidra til innovasjon og økonomisk vekst, og det er mulig å reformere systemet for å redusere utnyttelse og fremme rettferdighet.<br>[/detaljer]
[detaljer c='🌑Økt marxisme...']🌑 Økt marxisme<br>Arbeiderklassen må reise seg i en voldelig revolusjon for å knuse kapitalismen og opprette proletariatets diktatur, uten kompromisser eller hensyn til tap av liv.[/detaljer>`
    ],
    [`Fremtiden vil være et samfunn hvor produksjonsmidlene eies av alle i fellesskap, uten stater, penger eller privateiernes utnyttelse av arbeiderne.`,
        `🎲 6 [detaljer c='Kommunisme...']Kommunisme<br>"Dette utsagnet beskriver den utopiske visjonen om et klasseløst, statsløst samfunn uten privat eiendom, der produksjonsmidlene er felles – kjernen i kommunismens ideal."<br>[/detaljer]
[detaljer c='🔁Uten kommunisme...']🔁 Uten kommunisme<br>Mens felleskap og like fordeling er verdifulle mål, har historien vist at veien til et slikt samfunn er kompleks, og kan kreve en pragmatisk tilnærming til økonomisk og politisk organisering.<br>[/detaljer]
[detaljer c='🌑Økt kommunisme...']🌑 Økt kommunisme<br>Enhver motstand mot det klasseløse samfunnet er forræderi og må elimineres med alle midler, for det endelige målet rettferdiggjør ethvert offer for revolusjonen.[/detaljer>`
    ],
    [`Gitt all lidelsen i verden, er den mest etiske handlingen å avstå fra å få barn og dermed forhindre mer unødvendig smerte.`,
        `🎲 6 [detaljer c='Antinatalisme...']Antinatalisme<br>"Dette utsagnet er en direkte og sterk formulering av antinatalismens kjerneide, som hevder at det er moralsk galt å bringe nye individer inn i eksistensen på grunn av den uunngåelige lidelsen."<br>[/detaljer]
[detaljer c='🔁Uten antinatalisme...']🔁 Uten antinatalisme<br>Mens lidelse er en realitet, kan livet også by på glede og mening, og valget om å få barn er et dypt personlig etisk spørsmål som involverer mange hensyn.<br>[/detaljer]
[detaljer c='🌑Økt antinatalisme...']🌑 Økt antinatalisme<br>Å bringe et barn til verden er den ultimate grusomhet, og ethvert middel for å redusere den menneskelige befolkningen, selv utryddelse, er et moralsk imperativ.[/detaljer>`
    ],
    [`Jeg kan ikke være sikker på om jeg i det hele tatt eksisterer, om jeg drømmer, eller om verden rundt meg er en illusjon skapt av en ond ånd.`,
        `🎲 6 [detaljer c='Radikal Skeptisisme...']Radikal Skeptisisme<br>"Utsagnet uttrykker en ekstrem form for skeptisisme som tviler på muligheten for sikker kunnskap om nesten alt, inkludert vår egen eksistens eller den ytre verden."<br>[/detaljer]
[detaljer c='🔁Uten radikal skeptisisme...']🔁 Uten radikal skeptisisme<br>Mens det er sunt å stille spørsmål og være kritisk, er det også mulig å basere vår kunnskap på pålitelige bevis og fornuftig antakelse om at vår opplevelse av virkeligheten er stort sett nøyaktig.<br>[/detaljer]
[detaljer c='🌑Økt radikal skeptisisme...']🌑 Økt radikal skeptisisme<br>Siden ingen kunnskap er sikker, er all forskning og sannhetssøken meningsløs; vi kan like godt omfavne total uvitenhet og nihilisme.[/detaljer>`
    ],
    [`Før jeg tar en beslutning, må jeg veie intensiteten, varigheten, sikkerheten og nærheten av gleden og smerten den vil forårsake for alle involverte.`,
        `🎲 6 [detaljer c='Hedonistisk Kalkulasjon...']Hedonistisk Kalkulasjon<br>"Dette utsagnet beskriver den systematiske, kvantitative vurderingen av glede og smerte før handling, som er kjernen i Bentham's hedonistiske kalkulasjon, en sentral del av utilitarismen."<br>[/detaljer]
[detaljer c='🔁Uten hedonistisk kalkulasjon...']🔁 Uten hedonistisk kalkulasjon<br>Etiske beslutninger involverer en vurdering av konsekvenser, men kan også ta hensyn til andre faktorer som rettferdighet, plikt og individuelle rettigheter, som ikke alltid lar seg kvantifisere.<br>[/detaljer]
[detaljer c='🌑Økt hedonistisk kalkulasjon...']🌑 Økt hedonistisk kalkulasjon<br>Alle moralske spørsmål kan reduseres til et enkelt regnestykke; følelser og individuelle behov er irrelevante når den totale gleden kan beregnes og maksimeres for enhver pris.[/detaljer>`
    ],
    [`Moral er bare en illusjon, en sosial konstruksjon uten grunnlag i virkeligheten; det finnes ingen objektivt rett eller galt.`,
        `🎲 6 [detaljer c='Moral Nihilisme...']Moral Nihilisme<br>"Utsagnet avviser all eksistens av moralske verdier som objektive realiteter, og reduserer moral til en ren konstruksjon eller illusjon, som er selve definisjonen av moral nihilisme."<br>[/detaljer]
[detaljer c='🔁Uten moral nihilisme...']🔁 Uten moral nihilisme<br>Mens moralske normer varierer på tvers av kulturer, kan det være at visse grunnleggende prinsipper er universelle, eller at moral er et viktig, om enn subjektivt, rammeverk for menneskelig samhandling.<br>[/detaljer]
[detaljer c='🌑Økt moral nihilisme...']🌑 Økt moral nihilisme<br>Siden det ikke finnes objektiv moral, er alt tillatt, og ingen handling, uansett hvor grusom, kan sies å være 'gal'. Enhver tro på etikk er et tegn på svakhet.[/detaljer>`
    ],
    [`Det finnes ingen universelle sannheter eller objektiv virkelighet; alt er en fortolkning, et narrativ, formet av maktstrukturer og kulturelle perspektiver.`,
        `🎲 5 [detaljer c='Postmodernisme...']Postmodernisme<br>"Utsagnet avviser universelle sannheter og objektiv virkelighet, og fremhever subjektivitet, fortolkning og maktstrukturers rolle i kunnskapsdannelse, som er kjerneelementene i postmodernismen."<br>[/detaljer]
[detaljer c='🔁Uten postmodernisme...']🔁 Uten postmodernisme<br>Mens vår forståelse av sannhet og virkelighet er påvirket av kontekst og perspektiv, kan det fortsatt finnes grunnlag for felles forståelse og objektive fakta, selv om de er vanskelige å fullt ut gripe.<br>[/detaljer]
[detaljer c='🌑Økt postmodernisme...']🌑 Økt postmodernisme<br>Alt er bare narrativer, og ingen fortelling er mer sann enn en annen. Vitenskap, historie og objektiv kunnskap er bare maktspill og ren fiksjon som skal forkastes.[/detaljer>`
    ],
    [`Begrepet 'fornuft' fremstilles ofte som nøytralt, men en dekonstruksjon avslører hvordan det historisk har blitt brukt til å undertrykke og ekskludere 'det irrasjonelle'.`,
        `🎲 5 [detaljer c='Deconstructionism...']Deconstructionism<br>"Utsagnet viser hvordan dekonstruksjon systematisk analyserer et begrep for å avdekke skjulte antakelser, hierarkier og maktforhold, som er essensen av dekonstruksjon."<br>[/detaljer]
[detaljer c='🔁Uten deconstructionism...']🔁 Uten deconstructionism<br>Mens kritiske analyser av begreper kan avsløre historiske og sosiale skjevheter, kan fornuft fortsatt tjene som et verdifullt verktøy for analyse og kommunikasjon.<br>[/detaljer]
[detaljer c='🌑Økt deconstructionism...']🌑 Økt deconstructionism<br>Alle begreper er instrumenter for undertrykkelse, og den eneste veien til frihet er å dekonstruere og rive ned all mening og struktur, uansett kaoset det måtte skape.[/detaljer>`
    ],
    [`Vitenskapelige sannheter er ikke absolutter, men konstruksjoner som er relative til det paradigmet og de metodene som er akseptert i et gitt vitenskapelig fellesskap.`,
        `🎲 5 [detaljer c='Relativistisk Epistemologi...']Relativistisk Epistemologi<br>"Utsagnet argumenterer for at kunnskap og sannhet er avhengig av kontekst eller perspektiv (f.eks. vitenskapelig paradigme), i motsetning til universelle standarder, som er kjernen i moralsk relativisme."<br>[/detaljer]
[detaljer c='🔁Uten relativistisk epistemologi...']🔁 Uten relativistisk epistemologi<br>Mens vitenskapelig kunnskap utvikler seg innenfor rammer, er dens styrke dens evne til å forbedre forståelsen av virkeligheten gjennom evidens og kritisk granskning, uavhengig av rent subjektive tolkninger.<br>[/detaljer]
[detaljer c='🌑Økt relativistisk epistemologi...']🌑 Økt relativistisk epistemologi<br>Siden all kunnskap er relativ, er ingen påstand sannere enn en annen, og objektiv vitenskap er en illusjon; alle "sannheter" er bare personlige meninger.[/detaljer>`
    ],
    [`Er det moralsk forsvarlig å tillate en uhelbredelig syk pasient med intense smerter å be om aktiv dødshjelp, eller er det alltid galt å ta et liv?`,
        `🎲 6 [detaljer c='Eutanasi-etikk...']Eutanasi-etikk<br>"Dette utsagnet adresserer direkte kjernedilemmaet ved eutanasi, nemlig moralske spørsmål knyttet til frivillig avsluttelse av liv i møte med lidelse, og utfordrer absolutte prinsipper om livets ukrenkelighet."<br>[/detaljer]
[detaljer c='🔁Uten eutanasi-etikk...']🔁 Uten eutanasi-etikk<br>Debatten om eutanasi involverer komplekse etiske, medisinske og juridiske hensyn, og krever en nøye vurdering av pasientens autonomi, lidelse og samfunnets verdier rundt liv og død.<br>[/detaljer]
[detaljer c='🌑Økt eutanasi-etikk...']🌑 Økt eutanasi-etikk<br>Lidende individer uten helbredelsesutsikter er en byrde for samfunnet og bør aktivt fjernes for å maksimere total lykke og effektivitet, uansett deres ønsker.[/detaljer>`
    ],
    [`Vi må inngå allianser med autoritære regimer om det tjener våre nasjonale sikkerhetsinteresser, uavhengig av deres menneskerettighetsbrudd.`,
        `🎲 6 [detaljer c='Realpolitik...']Realpolitik<br>"Utsagnet illustrerer en politisk strategi som prioriterer makt, nasjonalinteresse og pragmatisme over moralske eller ideologiske hensyn, som er definerende for realpolitik."<br>[/detaljer]
[detaljer c='🔁Uten realpolitik...']🔁 Uten realpolitik<br>Mens nasjonale interesser er viktige, bør utenrikspolitikken også balanseres med etiske prinsipper, menneskerettigheter og langsiktige konsekvenser for global stabilitet.<br>[/detaljer]
[detaljer c='🌑Økt realpolitik...']🌑 Økt realpolitik<br>Moral og etikk er svakheter i internasjonal politikk; den eneste veien til nasjonal overlevelse og suverenitet er hensynsløs maktbruk og allianser med enhver som tjener våre kortsiktige mål.[/detaljer>`
    ],
    [`Tortur er iboende galt, ikke bare fordi det er forbudt av lov, men fordi det strider mot menneskets grunnleggende verdighet og naturlige rettigheter.`,
        `🎲 5 [detaljer c='Naturrettsteori...']Naturrettsteori<br>"Utsagnet baserer moralsk eller juridisk gyldighet på iboende prinsipper som utledes fra menneskets natur, uavhengig av positiv lov, som er kjernen i naturrettsteori."<br>[/detaljer]
[detaljer c='🔁Uten naturrettsteori...']🔁 Uten naturrettsteori<br>Forbud mot tortur er forankret i både positiv lov og universelle menneskerettighetsprinsipper, og bygger på en bred forståelse av menneskelig lidelse og verdighet.<br>[/detaljer]
[detaljer c='🌑Økt naturrettsteori...']🌑 Økt naturrettsteori<br>Enhver lov som strider mot de "naturlige" rettighetene er ugyldig og bør ignoreres eller bekjempes, da den er en forbrytelse mot den guddommelige orden selv.[/detaljer>`
    ],
    [`En lov er gyldig hvis den er vedtatt korrekt av parlamentet, selv om vi personlig mener den er urettferdig eller umoralsk.`,
        `🎲 6 [detaljer c='Legal Positivism...']Legal Positivism<br>"Utsagnet skiller tydelig lovens gyldighet fra dens moralske innhold, og legger vekt på lovens formelle kilder og vedtagelsesprosedyrer, som er kjernen i legal positivisme."<br>[/detaljer]
[detaljer c='🔁Uten legal positivisme...']🔁 Uten legal positivisme<br>Mens lovens gyldighet ofte avhenger av dens formelle opprinnelse, er det også viktig å vurdere dens moralske innhold og dens innvirkning på rettferdighet og samfunnets verdier.<br>[/detaljer]
[detaljer c='🌑Økt legal positivisme...']🌑 Økt legal positivisme<br>Loven er lov, uansett hvor grusom eller tyrannisk den er; det er ingen høyere moralsk standard å appellere til, og blind lydighet er den eneste veien til orden.[/detaljer>`
    ],
    [`Det er aldri moralsk riktig å bruke vold, selv ikke i selvforsvar eller for å stoppe en større ondskap; fredelig motstand er alltid veien.`,
        `🎲 6 [detaljer c='Pacifisme...']Pacifisme<br>"Denne uttalelsen representerer en absolutistisk form for pacifisme, som fullstendig avviser all vold under enhver omstendighet."<br>[/detaljer]
[detaljer c='🔁Uten pacifisme...']🔁 Uten pacifisme<br>Mens fredelige løsninger er å foretrekke, kan det i ekstreme tilfeller være et moralsk dilemma der bruk av vold er nødvendig for å beskytte uskyldige liv eller forhindre større urett.<br>[/detaljer]
[detaljer c='🌑Økt pacifisme...']🌑 Økt pacifisme<br>Vi må aldri heve en hånd, selv om det betyr at tyranni seirer og uskyldige lidelser fortsetter i det uendelige; vår renhet er det eneste som teller.[/detaljer>`
    ],
    [`Bare det som kan måles og bevises vitenskapelig er ekte kunnskap; filosofi, kunst og religion er bare subjektive meninger uten objektiv sannhet.`,
        `🎲 5 [detaljer c='Scientisme...']Scientisme<br>"Utsagnet fremsetter naturvitenskap som den eneste gyldige kilden til kunnskap og avviser andre kunnskapsformer som mindreverdige eller meningsløse, som er kjernen i scientisme."<br>[/detaljer]
[detaljer c='🔁Uten scientisme...']🔁 Uten scientisme<br>Mens vitenskap er en kraftfull metode for å forstå den fysiske verden, kan andre former for kunnskap, som filosofi, kunst og etikk, tilby verdifulle innsikter i menneskelig erfaring som ikke kan reduseres til empiriske data.<br>[/detaljer]
[detaljer c='🌑Økt scientisme...']🌑 Økt scientisme<br>Enhver påstand som ikke kan bevises i et laboratorium er ren overtro og bør forkastes; følelser, moral og åndelighet er bare illusjoner som hindrer sann fremgang.[/detaljer>`
    ],
    [`Vi kan skape et meningsfylt og etisk liv basert på menneskelig fornuft, empati og vitenskap, uten behov for guddommelig åpenbaring eller overtro.`,
        `🎲 5 [detaljer c='Sekulær Humanisme...']Sekulær Humanisme<br>"Utsagnet beskriver et livssyn som bygger på menneskelige verdier, fornuft og vitenskap, uten religiøse overbevisninger, som er definerende for sekulær humanisme."<br>[/detaljer]
[detaljer c='🔁Uten sekulær humanisme...']🔁 Uten sekulær humanisme<br>Et meningsfylt liv kan finnes gjennom både sekulære og religiøse rammeverk, og mange finner at tro og fornuft kan sameksistere og utfylle hverandre.<br>[/detaljer]
[detaljer c='🌑Økt sekulær humanisme...']🌑 Økt sekulær humanisme<br>Religion er roten til alt ondt og må utryddes fullstendig til fordel for en rent rasjonell, vitenskapsbasert utopi, der all tro anses som en sykdom som må kureres.[/detaljer>`
    ],
    [`Bibelen må tolkes bokstavelig i alle dens deler; vitenskapelige teorier som evolusjon er feil hvis de motsier Skriften.`,
        `🎲 6 [detaljer c='Religiøs Fundamentalisme...']Religiøs Fundamentalisme<br>"Utsagnet viser en urokkelig tro på bokstavelig tolkning av hellig skrift og avvisning av moderne vitenskap hvis den motsier denne tolkningen, som er kjennetegnet på religiøs fundamentalisme."<br>[/detaljer]
[detaljer c='🔁Uten religiøs fundamentalisme...']🔁 Uten religiøs fundamentalisme<br>Tro og vitenskap kan utfylle hverandre, der hellige tekster kan tolkes i lys av moderne kunnskap for å gi dypere innsikt, uten at det krever en bokstavelig sannhet i alle detaljer.<br>[/detaljer]
[detaljer c='🌑Økt religiøs fundamentalisme...']🌑 Økt religiøs fundamentalisme<br>Guds ord er absolutt lov, og enhver tvil eller vitenskapelig teori som motsier den, er kjetteri som må forfølges og elimineres for å opprettholde den rene troen.[/detaljer>`
    ],
    [`I dette landet er lovene basert direkte på Guds ord som tolket av presteskapet, og religiøse ledere styrer alle aspekter av samfunnet.`,
        `🎲 6 [detaljer c='Teokrati...']Teokrati<br>"Utsagnet beskriver et system der religiøs lov og religiøse ledere har direkte politisk makt og styrer alle aspekter av samfunnet, som er definerende for teokrati."<br>[/detaljer]
[detaljer c='🔁Uten teokrati...']🔁 Uten teokrati<br>Et samfunn kan respektere religiøs frihet og moralske verdier, samtidig som det opprettholder et sekulært styresett som beskytter individuelle rettigheter og demokratiske prinsipper.<br>[/detaljer]
[detaljer c='🌑Økt teokrati...']🌑 Økt teokrati<br>Guds vilje er den eneste loven, og presteskapet må ha absolutt makt til å håndheve den uten motstand; enhver form for individuell frihet eller sekulær tanke er en blasfemi som må knuses.[/detaljer>`
    ],
    [`Jeg lever kun for øyeblikkets nytelse, uten å la meg begrense av samfunnets tabuer eller tradisjonelle moralprinsipper.`,
        `🎲 5 [detaljer c='Libertinisme...']Libertinisme<br>"Utsagnet uttrykker en avvisning av konvensjonelle moralske og sosiale restriksjoner til fordel for personlig sanselig nytelse og frihet, som er kjennetegnet på libertinisme."<br>[/detaljer]
[detaljer c='🔁Uten libertinisme...']🔁 Uten libertinisme<br>Mens personlig frihet og glede er viktig, kan et meningsfylt liv også innebære en balanse med ansvar, respekt for andre og overholdelse av visse sosiale normer.<br>[/detaljer]
[detaljer c='🌑Økt libertinisme...']🌑 Økt libertinisme<br>Regler er for de svake; jeg har rett til å tilfredsstille alle mine lyster uten hensyn til konsekvenser, og alle som prøver å begrense meg er fiender av frihet.[/detaljer>`
    ],
    [`Jeg kan ikke kontrollere ytre hendelser, bare mine reaksjoner på dem. Derfor skal jeg fokusere på min egen indre dyd og akseptere skjebnen med ro.`,
        `🎲 6 [detaljer c='Stoicism...']Stoicism<br>"Utsagnet viser fokus på indre kontroll (dyder, reaksjoner) og aksept av det ukontrollerbare (skjebnen), som er sentralt i stoisk filosofi."<br>[/detaljer]
[detaljer c='🔁Uten stoicism...']🔁 Uten stoicism<br>Mens indre ro og aksept er verdifulle, kan vi også aktivt jobbe for å endre urettferdige ytre forhold og forbedre verden rundt oss, ikke bare akseptere den.<br>[/detaljer]
[detaljer c='🌑Økt stoicism...']🌑 Økt stoicism<br>Verden er full av kaos, og det eneste rasjonelle er å trekke seg tilbake fra all handling, undertrykke alle følelser, og leve i en tilstand av fullstendig apati overfor alt som skjer.[/detaljer>`
    ],
    [`Regjeringen forbyr røyking i offentlige rom, ikke bare for å beskytte andre, men også for å tvinge røykere til å ta bedre vare på sin egen helse.`,
        `🎲 6 [detaljer c='Paternalisme...']Paternalisme<br>"Utsagnet illustrerer paternalisme ved å vise hvordan staten begrenser en persons frihet (røyking) for personens eget beste, uten eksplisitt samtykke, utover å beskytte andre."<br>[/detaljer]
[detaljer c='🔁Uten paternalisme...']🔁 Uten paternalisme<br>Mens folkehelse er et viktig mål, bør statlige inngrep balanseres med respekt for individets autonomi og frihet til å ta egne valg, selv om de er usunne.<br>[/detaljer]
[detaljer c='🌑Økt paternalisme...']🌑 Økt paternalisme<br>Staten vet best hva som er bra for innbyggerne; fullstendig kontroll over alle aspekter av folks liv er nødvendig for å sikre deres optimale helse og lykke, selv om det betyr å knuse frihet.[/detaljer>`
    ],
    [`Befolkningen i kystområdene utviklet seg til dyktige sjøfarere på grunn av geografien, mens innlandsfolk ble bønder, deres skjebne formet av landskapet.`,
        `🎲 5 [detaljer c='Miljødeterminisme...']Miljødeterminisme<br>"Utsagnet viser hvordan miljøfaktorer (geografi, klima) direkte former menneskelige samfunn, kulturer og utvikling, som er kjernen i miljødeterminisme."<br>[/detaljer]
[detaljer c='🔁Uten miljødeterminisme...']🔁 Uten miljødeterminisme<br>Mens miljøet påvirker samfunn, har mennesker også kapasitet til å tilpasse seg, innovere og forme sine omgivelser, noe som gir rom for kulturell og teknologisk utvikling utover rent geografiske begrensninger.<br>[/detaljer]
[detaljer c='🌑Økt miljødeterminisme...']🌑 Økt miljødeterminisme<br>Mennesker er rene produkter av sine omgivelser; fri vilje og personlig initiativ er illusjoner, og vår skjebne er fullstendig forutbestemt av landskapet vi ble født inn i.[/detaljer>`
    ],
    [`En persons intelligens, personlighet og til og med kriminelle tilbøyeligheter er forhåndsbestemt i DNA-et deres ved fødselen, og kan ikke endres av oppvekst.`,
        `🎲 5 [detaljer c='Genetisk Determinisme...']Genetisk Determinisme<br>"Utsagnet uttrykker ideen om at genetisk kode bestemmer alle aspekter ved et individ, uavhengig av miljøpåvirkning, som er kjernen i genetisk determinisme."<br>[/detaljer]
[detaljer c='🔁Uten genetisk determinisme...']🔁 Uten genetisk determinisme<br>Mens gener spiller en viktig rolle, samspiller de med miljøfaktorer som oppvekst og erfaringer for å forme en persons utvikling, noe som gir rom for både medfødte anlegg og miljømessig påvirkning.<br>[/detaljer]
[detaljer c='🌑Økt genetisk determinisme...']🌑 Økt genetisk determinisme<br>Vi er alle forhåndsbestemt av våre gener, og det er meningsløst å snakke om personlig ansvar eller moralske valg; vår biologiske kode bestemmer alt, fra kjærlighet til kriminalitet.[/detaljer>`
    ],
    [`Barn lærer å snakke ved å imitere lyder de hører og blir belønnet for å produsere riktige ord, uten at vi trenger å forstå deres indre 'forståelse'.`,
        `🎲 5 [detaljer c='Atferdspsykologi (Behaviorism)...']Atferdspsykologi (Behaviorism)<br>"Utsagnet fokuserer utelukkende på observerbar atferd (stimulus-respons) for å forklare læring, og ignorerer indre mentale prosesser, som er kjernen i behaviorismen."<br>[/detaljer]
[detaljer c='🔁Uten atferdspsykologi (behaviorism)...']🔁 Uten atferdspsykologi (behaviorism)<br>Mens ytre stimuli og respons er viktig, spiller også indre kognitive prosesser, som forståelse, tenkning og problemløsning, en avgjørende rolle i menneskelig læring.<br>[/detaljer]
[detaljer c='🌑Økt atferdspsykologi (behaviorism)...']🌑 Økt atferdspsykologi (behaviorism)<br>Mennesker er bare komplekse maskiner som reagerer på stimuli; fri vilje og bevissthet er illusjoner, og vi kan manipulere atferd fullstendig med riktig programmering.[/detaljer>`
    ],
    [`Bevissthet er ingenting mer enn den elektrokjemiske aktiviteten i hjernen; det finnes ingen sjel eller åndelig dimensjon.`,
        `🎲 6 [detaljer c='Materialisme...']Materialisme<br>"Utsagnet reduserer mentale fenomener til rent fysiske prosesser i hjernen, og benekter eksistensen av noe ikke-materiell (sjel, åndelighet), som er kjernen i materialisme."<br>[/detaljer]
[detaljer c='🔁Uten materialisme...']🔁 Uten materialisme<br>Mens bevissthet utvilsomt er knyttet til hjernen, er spørsmålet om dens natur fortsatt et komplekst filosofisk problem, der noen teorier åpner for emergent eller ikke-reduserbar kvalitet.<br>[/detaljer]
[detaljer c='🌑Økt materialisme...']🌑 Økt materialisme<br>Alt som eksisterer er fysisk; all religion, spiritualitet og tro på en sjel er ren overtro og bør utryddes for å oppnå en ren vitenskapelig forståelse av universet.[/detaljer>`
    ],
    [`Trærne i skogen eksisterer bare fordi et sinn oppfatter dem; de er ideer i sinnet.`,
        `🎲 6 [detaljer c='Idealisme...']Idealisme<br>"Dette utsagnet uttrykker direkte Berkeley's berømte tese 'esse est percipi' (å være er å bli oppfattet), som er en sentral del av idealismen, der virkeligheten er grunnleggende mental."<br>[/detaljer]
[detaljer c='🔁Uten idealisme...']🔁 Uten idealisme<br>Mens vår oppfatning av virkeligheten er avhengig av vårt sinn, er det rasjonelt å anta at en uavhengig virkelighet eksisterer uavhengig av vår bevissthet, selv om vi aldri kan oppleve den direkte.<br>[/detaljer]
[detaljer c='🌑Økt idealisme...']🌑 Økt idealisme<br>Alt er bare en illusjon skapt av mitt sinn; den ytre verden eksisterer ikke, og jeg er den eneste virkelige eksistensen, som kan manipulere min virkelighet som jeg ønsker.[/detaljer>`
    ],
    [`Å lyve er alltid galt, uansett situasjon, da sannhet er en universell moralsk verdi.`,
        `🎲 6 [detaljer c='Moral Absolutisme...']Moral Absolutisme<br>"Utsagnet fremsetter en moralsk regel (aldri lyve) som er urokkelig og universell, uavhengig av kontekst eller konsekvenser, som er kjernen i moralsk absolutisme."<br>[/detaljer]
[detaljer c='🔁Uten moral absolutisme...']🔁 Uten moral absolutisme<br>Mens sannhet og ærlighet er viktige moralske verdier, kan det i komplekse situasjoner oppstå dilemmaer hvor konsekvenser eller andre prinsipper må veies mot absolutte regler.<br>[/detaljer]
[detaljer c='🌑Økt moral absolutisme...']🌑 Økt moral absolutisme<br>Det finnes en absolutt, uforanderlig moral lov for alle, og enhver avvikelse er en synd som må straffes uten barmhjertighet for å opprettholde den rene orden.[/detaljer>`
    ],
    [`Vi kan ikke dømme stammefolkets praksis med å spise de døde; det er en del av deres kultur og må forstås innenfor deres egne normer.`,
        `🎲 6 [detaljer c='Kulturell Relativisme...']Kulturell Relativisme<br>"Utsagnet viser hvordan en praksis kun kan forstås og vurderes innenfor sin egen kulturelle kontekst, uten universelle standarder, som er kjernen i kulturell relativisme."<br>[/detaljer]
[detaljer c='🔁Uten kulturell relativisme...']🔁 Uten kulturell relativisme<br>Mens vi skal strebe etter å forstå kulturelle forskjeller, er det også mulig å ha etisk dialog om universelle menneskerettigheter og verdier som kan overskride kulturelle grenser, uten å påtvinge egne normer.<br>[/detaljer]
[detaljer c='🌑Økt kulturell relativisme...']🌑 Økt kulturell relativisme<br>Siden alle kulturer er likeverdige, kan ingen utenforstående dømme noens praksis, uansett hvor grusom den måtte virke; det er ingen universelle grenser for moral.[/detaljer>`
    ],
    [`Selv et enkelt atom har en form for grunnleggende bevissthet eller subjektiv opplevelse; bevissthet er overalt, bare i ulike kompleksitetsgrader.`,
        `🎲 5 [detaljer c='Panpsykisme...']Panpsykisme<br>"Utsagnet utvider bevissthet til å gjelde selv livløse og elementære bestanddeler av materie, noe som er kjernen i panpsykisme."<br>[/detaljer]
[detaljer c='🔁Uten panpsykisme...']🔁 Uten panpsykisme<br>Mens bevissthetens natur er et mysterium, kan vi fortsatt utforske dens egenskaper og relasjon til hjernen uten å nødvendigvis tillegge den primitive former i all materie.<br>[/detaljer]
[detaljer c='🌑Økt panpsykisme...']🌑 Økt panpsykisme<br>Alt er bevisst, fra steiner til stjerner; den menneskelige bevisstheten er bare en liten del av en kosmisk bevissthet, og vi må oppløse våre individuelle 'jeg' i denne større enheten.[/detaljer>`
    ],
    [`Gud er ikke bare universets skaper, men gjennomtrenger hver eneste del av det, samtidig som Gud eksisterer uavhengig og utover universets grenser.`,
        `🎲 5 [detaljer c='Panentheism...']Panentheism<br>"Utsagnet illustrerer at Gud er både immanent (i alt) og transcendent (utover alt), som er kjerneideen i panentheisme, og skiller den fra enkel panteisme."<br>[/detaljer]
[detaljer c='🔁Uten panentheism...']🔁 Uten panentheism<br>Teologiske forståelser av Gud varierer, og ulike tradisjoner vektlegger Guds transcendens, immanens eller begge deler, uten å nødvendigvis falle inn under en spesifikk kategori.<br>[/detaljer]
[detaljer c='🌑Økt panentheism...']🌑 Økt panentheism<br>Gud er alt, og alt er Gud, men likevel mer; våre individuelle liv er bare fragmenter av den guddommelige bevisstheten, og vi må underkaste oss dens vilje fullstendig.[/detaljer>`
    ],
    [`Uansett om våre handlinger er forutbestemt eller tilfeldige, kan vi aldri ha sann fri vilje.`,
        `🎲 5 [detaljer c='Hard Inkompatibilisme...']Hard Inkompatibilisme<br>"Utsagnet uttrykker den radikale ideen om at fri vilje er umulig under alle omstendigheter (både determinisme og indeterminisme), som definerer hard inkompatibilisme."<br>[/detaljer]
[detaljer c='🔁Uten hard inkompatibilisme...']🔁 Uten hard inkompatibilisme<br>Debatten om fri vilje og determinisme er kompleks, og mange filosofier forsøker å forene dem eller finne rom for fri vilje innenfor ulike metafysiske rammeverk.<br>[/detaljer]
[detaljer c='🌑Økt hard inkompatibilisme...']🌑 Økt hard inkompatibilisme<br>Siden fri vilje er en total illusjon, er moral, ansvar og straff meningsløse; vi er bare marionetter i hendene på kosmiske krefter, og all vår streben er forgjeves.[/detaljer>`
    ],
    [`Partiet kontrollerer ikke bare din atferd, men også dine tanker, meninger og følelser; ingen avvik tolereres.`,
        `🎲 6 [detaljer c='Totalitarisme...']Totalitarisme<br>"Utsagnet beskriver en ekstrem form for statlig kontroll som strekker seg til individets private sfære og undertrykker all uenighet, som er kjernen i totalitarisme."<br>[/detaljer]
[detaljer c='🔁Uten totalitarisme...']🔁 Uten totalitarisme<br>Mens en viss grad av statlig orden er nødvendig, er beskyttelsen av individuelle friheter, tankefrihet og meningsmangfold essensielt for et sunt og rettferdig samfunn.<br>[/detaljer]
[detaljer c='🌑Økt totalitarisme...']🌑 Økt totalitarisme<br>For å oppnå absolutt enhet og orden, må staten ha total og ubestridt kontroll over hver eneste tanke og handling; enhver avvikelse er en sykdom som må utryddes for å bevare den kollektive renheten.[/detaljer>`
    ],
    [`Vi kan skape et feilfritt samfunn hvor det ikke er lidelse, ulikhet eller konflikt, bare harmoni og overflod for alle.`,
        `🎲 5 [detaljer c='Utopisme...']Utopisme<br>"Utsagnet beskriver visjonen om et ideelt og perfekt samfunn, der alle problemer er eliminert, som er kjernen i utopisme."<br>[/detaljer]
[detaljer c='🔁Uten utopisme...']🔁 Uten utopisme<br>Mens det er viktig å strebe etter et bedre samfunn, bør vi anerkjenne at perfekte samfunn er urealistiske, og heller fokusere på gradvise forbedringer og pragmatiske løsninger for å redusere lidelse og ulikhet.<br>[/detaljer]
[detaljer c='🌑Økt utopisme...']🌑 Økt utopisme<br>Vi må tvinge frem et perfekt samfunn med alle midler, og eliminere alle som står i veien for den absolutte harmonien, uansett kostnaden i menneskeliv eller frihet.[/detaljer>`
    ],
    [`Min høyeste moralske plikt er å maksimere min egen glede, selv om det innebærer å neglisjere andres behov.`,
        `🎲 6 [detaljer c='Hedonistisk Egoisme...']Hedonistisk Egoisme<br>"Dette utsagnet kombinerer egoisme med hedonisme, og setter egen glede som det ultimate, etiske målet for individet, uavhengig av andres velvære."<br>[/detaljer]
[detaljer c='🔁Uten hedonistisk egoisme...']🔁 Uten hedonistisk egoisme<br>Mens egen glede er viktig, bør etiske overveielser også inkludere empati for andre, og erkjennelsen av at varig lykke ofte oppnås gjennom meningsfulle relasjoner og bidrag til fellesskapet.<br>[/detaljer]
[detaljer c='🌑Økt hedonistisk egoisme...']🌑 Økt hedonistisk egoisme<br>Mitt liv er kun mitt eget, og jeg skylder ingen noe som helst; den eneste moralske handlingen er å kynisk utnytte andre for min egen nytelse.[/detaljer>`
    ],
    [`Sannheten til en idé ligger i dens praktiske anvendelse og evne til å løse problemer, ikke i dens abstrakte korrespondanse med en ekstern virkelighet.`,
        `🎲 5 [detaljer c='Pragmatisme...']Pragmatisme<br>"Utsagnet definerer sannhet i form av praktisk funksjonalitet og problemløsning, som er kjernen i pragmatismens tilnærming til kunnskap og ideer."<br>[/detaljer]
[detaljer c='🔁Uten pragmatisme...']🔁 Uten pragmatisme<br>Mens praktisk nytte er viktig, bør en fullstendig forståelse av sannhet også inkludere dens korrespondanse med fakta og dens evne til å reflektere virkeligheten, selv om dette kan være vanskelig å etablere.<br>[/detaljer]
[detaljer c='🌑Økt pragmatisme...']🌑 Økt pragmatisme<br>Sannhet er hva som helst som fungerer for meg akkurat nå; fakta og objektiv virkelighet er irrelevante illusjoner som kan ignoreres hvis de står i veien for mine praktiske mål.[/detaljer>`
    ],
    [`Bordet jeg ser er bare en samling av farge, form og tekstur i min bevissthet; det finnes ingen 'bordet i seg selv' uavhengig av mine sansninger.`,
        `🎲 5 [detaljer c='Fenomenalisme...']Fenomenalisme<br>"Utsagnet reduserer fysiske objekter til samlinger av sanseopplevelser (fenomener), og benekter en uavhengig virkelighet bak dem, som er kjernen i fenomenalisme."<br>[/detaljer]
[detaljer c='🔁Uten fenomenalisme...']🔁 Uten fenomenalisme<br>Mens våre sanseopplevelser er den primære måten vi erfarer verden på, er det rasjonelt å anta at fysiske objekter eksisterer uavhengig av vår oppfatning, selv om vi aldri kan gripe dem direkte.<br>[/detaljer]
[detaljer c='🌑Økt fenomenalisme...']🌑 Økt fenomenalisme<br>Hele verden er bare en konstruksjon av mitt sinn, og jeg kan forme den som jeg vil; det er ingen objektiv virkelighet å forholde seg til, bare mine egne subjektive opplevelser.[/detaljer>`
    ],
    [`Utsagn om Guds eksistens eller absolutt moral er meningsløse fordi de verken kan bevises gjennom observasjon eller er logisk sanne.`,
        `🎲 6 [detaljer c='Logisk Positivisme...']Logisk Positivisme<br>"Utsagnet viser logisk positivismes strenge krav til meningsfullhet, der utsagn som ikke er empirisk verifiserbare eller analytiske avvises som nonsens."<br>[/detaljer]
[detaljer c='🔁Uten logisk positivisme...']🔁 Uten logisk positivisme<br>Mens empirisk verifiserbarhet er viktig for vitenskapelig kunnskap, kan andre former for utsagn, som etiske eller metafysiske, ha mening og verdi selv om de ikke kan bevises på samme måte.<br>[/detaljer]
[detaljer c='🌑Økt logisk positivisme...']🌑 Økt logisk positivisme<br>All metafysikk, kunst og religion er bare tull og overtro; den eneste sanne kunnskapen er den som kan måles i et laboratorium, og alt annet er meningsløst søppel.[/detaljer>`
    ],
    [`Samfunnets historie er en uopphørlig klassekamp, der produktivkrefter og produksjonsforhold skaper motsetninger som til slutt fører til revolusjon.`,
        `🎲 5 [detaljer c='Dialektisk Materialisme...']Dialektisk Materialisme<br>"Utsagnet beskriver historien som drevet av materielle (økonomiske) konflikter som fører til radikal endring, som er kjernen i den dialektiske materialismen."<br>[/detaljer]
[detaljer c='🔁Uten dialektisk materialisme...']🔁 Uten dialektisk materialisme<br>Mens økonomiske og sosiale faktorer er viktige drivkrefter i historien, påvirkes samfunnsutviklingen også av ideer, kultur, teknologi og individuelle handlinger, og er ikke rent forutbestemt av materielle forhold.<br>[/detaljer]
[detaljer c='🌑Økt dialektisk materialisme...']🌑 Økt dialektisk materialisme<br>Historien er en uunngåelig kamp mellom undertrykkere og undertrykte, og den eneste veien til frihet er å knuse fienden fullstendig i en brutal revolusjon, som uunngåelig vil føre til en utopi.[/detaljer>`
    ],
    [`En pasients angst stammer ikke fra bevisste valg, men fra undertrykte barndomstraumer og ubevisste konflikter som manifesterer seg i drømmer og feilhandlinger.`,
        `🎲 5 [detaljer c='Psykoanalytisk Teori...']Psykoanalytisk Teori<br>"Utsagnet forklarer atferd og psykiske lidelser ut fra ubevisste prosesser og barndomserfaringer, som er sentralt i psykoanalytisk teori."<br>[/detaljer]
[detaljer c='🔁Uten psykoanalytisk teori...']🔁 Uten psykoanalytisk teori<br>Mens ubevisste prosesser og fortiden kan påvirke oss, har vi også en bevisst evne til selvrefleksjon, rasjonell tenkning og valgfrihet som former våre handlinger og vår fremtid.<br>[/detaljer]
[detaljer c='🌑Økt psykoanalytisk teori...']🌑 Økt psykoanalytisk teori<br>Våre liv er totalt styrt av dype, ubevisste drifter fra barndommen; vi har ingen fri vilje, og all vår streben etter rasjonalitet er bare en tynn ferniss over våre dyriske instinkter.[/detaljer>`
    ],
    [`Vi må avvise den raske teknologiske utviklingen som fremmedgjør oss fra hverandre, ødelegger jobber og truer vår mentale helse; det er på tide å trekke i nødbremsen.`,
        `🎲 5 [detaljer c='Neoluddisme...']Neoluddisme<br>"Utsagnet viser en kritisk og avvisende holdning til moderne teknologi og dens skadelige innvirkning på samfunn og individ, som er kjernen i neoluddisme."<br>[/detaljer]
[detaljer c='🔁Uten neoluddisme...']🔁 Uten neoluddisme<br>Mens teknologi har negative sider, kan den også forbedre livskvaliteten, fremme kommunikasjon og løse globale problemer, og utfordringen er å utvikle og bruke den på en ansvarlig og etisk måte.<br>[/detaljer]
[detaljer c='🌑Økt neoluddisme...']🌑 Økt neoluddisme<br>Teknologi er djevelens verk og må knuses for å redde menneskeheten fra sin egen undergang; alt som er digitalt eller mekanisk er en trussel mot vår sanne natur.[/detaljer>`
    ]


    
];
cfg.set(cfg_aiPromptWelcome,'Tvilsom filosofi','gpt5','p/tvilsomfilosofi.png','f,5,2')