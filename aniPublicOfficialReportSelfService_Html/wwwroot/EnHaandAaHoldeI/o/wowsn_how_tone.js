// Torry: fargene som kommer ut. Fargerikt? dype klangtoner?
// Legg til språkrådet
/* 
Jeg lager en modell for tone for språk struktur, uttrykk og intensjon for at LLM kan skrive bedre (kall det en omformer)
*/
console.log('wowsn.how.tone')
window.wowsn_how_tone={
    g:[/*['x','Gruppenavn','PNFOLMRWY','Hvordan fortellingen eller teksten er bygget opp, fortellerens rolle, og hvordan virkeligheten fremstilles.'],*/
        ['S','struktur','PNFOLMRWY','Hvordan fortellingen eller teksten er bygget opp, fortellerens rolle, og hvordan virkeligheten fremstilles.'],
        ['U','uttrykk','USKXDTC','Valg av ord, setningsbygning, stilistisk tone og språklig utsmykning.'],
        ['I','intensjon','IJEVAGBZQ','Tekstens underliggende formål, hvordan den søker å påvirke leseren, og dens etiske eller pedagogiske holdning.']]
    ,e:[/*['y','Akse', 'Ytterpunkt 1', 'Ytterpunkt 2', 'Forklaring av aksen', 'Forklaring av ytterpunkt 1', 'Forklaring av ytterpunkt 2'],*/
        ['P', 'Perspektiv', 'Over&shy;ordnet', 'Nær', 'Definerer fortellerens ståsted og fokusområde; omfanget av det som beskrives.', 'Fortelleren ser "det store bildet", gir kontekst og oversikt, ofte med en viss autoritet og distanse.', 'Fortelleren zoomer inn på detaljer, enkeltopplevelser eller individet, ofte mer intimt og personlig.'],
        ['E', 'Emosjonell vinkling', 'Følelse&shy;sladd', 'Saklig', 'Bestemmer graden og typen av følelsesmessig engasjement i teksten, og hvordan den appellerer til leserens følelser versus fornuft.', 'Vektlegger og formidler følelser, sikter mot å skape empati og emosjonell respons hos leseren.', 'Holder seg til fakta og objektiv informasjon, unngår å farge teksten med tydelige følelser, appellerer til fornuft.'],
        ['U', 'Utrykksform', 'Direkte', 'Underfund&shy;ig', 'Beskriver hvordan budskapet kommuniseres; om det er eksplisitt og rett frem, eller mer implisitt, lekent eller med flere lag av betydning.', 'Kommuniserer budskapet klart, åpent og rett på sak, uten skjulte meningslag.', 'Bruker hint, ironi, humor eller andre implisitte virkemidler; det som sies er ikke alltid det som menes bokstavelig.'],
        ['N', 'Narrativt formål', 'Forklar&shy;ende', 'Opplev&shy;elses&shy;basert', 'Definerer hovedintensjonen bak fortellingen; om den primært søker å informere og klargjøre, eller å dele en subjektiv reise/erfaring.', 'Stilen fokuserer på å gjøre komplekse temaer forståelige, presentere informasjon og argumenter logisk.', 'Stilen legger vekt på å formidle en personlig reise, følelse eller erfaring, ofte fra et subjektivt ståsted.'],
        ['S', 'Språklig enkelhet', 'Enkel&shy;t', 'Kompleks&shy;t', 'Vurderer den grunnleggende strukturelle og leksikalske kompleksiteten i språket.', 'Bruker hovedsakelig kjente ord og enkle setningsstrukturer, lett å forstå umiddelbart.', 'Benytter avansert vokabular og/eller sammensatte setningsstrukturer som kan kreve mer konsentrasjon.'],
        ['T', 'Språklig tilgjengelighet', 'Lett', 'Nyansert', 'Beskriver hvorvidt språket er umiddelbart klart eller om det inviterer til dypere tolkning og avdekking av flere lag.', 'Meningen er klar og umiddelbar, uten skjulte lag; tilgjengelig for et bredt publikum.', 'Språket inneholder subtiliteter, flere meningslag eller krever aktiv tolkning for full forståelse.'],
        ['F', 'Fortellerens nærvær', 'Fortell&shy;erstemme', 'Objektiv', 'Angir hvor markant fortellerens egen stemme eller personlighet er i teksten.', 'Fortellerstemmen er merkbar, kanskje med egne kommentarer, refleksjoner, eller en distinkt personlig tone som adresserer leseren.', 'Fortelleren trer i bakgrunnen, og lar fakta og hendelser tale mest mulig for seg selv, som en "flue på veggen".'],
        ['O', 'Strukturell orden', 'Lineær', 'Fragment&shy;ert', 'Beskriver den overordnede organiseringen av narrativet eller argumentasjonen.', 'Følger en kronologisk eller logisk sekvensiell rekkefølge fra start til slutt.', 'Bryter opp den tradisjonelle rekkefølgen, kan presentere elementer i ikke-kronologisk eller oppstykket form.'],
        ['L', 'Flyt i strukturell konvensjon', 'Forutsig&shy;bar', 'Eksperiment&shy;ell', 'Angir hvorvidt strukturen følger etablerte mønstre eller søker nye, ukonvensjonelle former.', 'Benytter kjente og etablerte narrative eller argumentative mønstre, lett å forutse progresjonen.', 'Utforsker ukonvensjonelle måter å koble sammen ideer eller hendelser, kan virke overraskende eller assosiativ.'],
        ['M', 'Tempo', 'Rolig', 'Driv&shy;ende', 'Definerer den opplevde hastigheten og rytmen i hvordan informasjonen eller handlingen utfolder seg.', 'Teksten har et langsommere, mer bedagelig tempo, dveler ved poenger eller scener.', 'Teksten har høy progresjon, beveger seg raskt fra ett punkt til det neste.'],
        ['R', 'Narrativ energi', 'Reflekter&shy;ende', 'Intens', 'Beskriver den dominerende energien eller modusen i fortellingen; om den er innadvendt og tenkende, eller utadvendt og kraftfull.', 'Teksten inviterer til ettertanke, utforsker tanker og følelser i dybden, ofte med en rolig energi.', 'Teksten er preget av sterk energi, dramatikk, eller umiddelbar påvirkning, ofte handlingsmettet eller med kraftige utsagn.'],
        ['V', 'Verdenssyn', 'Optimist&shy;isk', 'Kritisk', 'Speiler den generelle holdningen til emnet eller verden; om den er preget av håp eller skepsis.', 'Fremhever det positive, muligheter og et lyst syn på fremtiden eller emnet.', 'Inntar en skeptisk holdning, stiller spørsmål ved etablerte sannheter, kan ha et mer pessimistisk eller realistisk utgangspunkt.'],
        ['A', 'Tematisk Tilnærming', 'Konstruktiv', 'Problem&shy;atiserende', 'Beskriver hvordan teksten engasjerer seg med sitt tema; om den bygger opp og søker løsninger, eller analyserer og avdekker problemer.', 'Fokuserer på å bygge opp, foreslå løsninger, eller presentere temaet på en positivt utviklende måte.', 'Fokuserer på å analysere, avdekke utfordringer, eller belyse komplekse problemer uten nødvendigvis å tilby enkle løsninger.'],
        ['K', 'Språklig økonomi', 'Konsis', 'Ordrik', 'Vurderer hvorvidt språket er kortfattet eller mer utfyllende og detaljert.', 'Uttrykker seg kort og presist, unngår overflødige ord og digresjoner.', 'Bruker flere ord og setninger for å utdype poenger, kan være mer beskrivende og utfyllende.'],
        ['X', 'Språklig tekstur', 'Minimal&shy;istisk', 'Billed&shy;rik', 'Beskriver graden av språklig utsmykning og bruk av figurative virkemidler.', 'Språket er enkelt, direkte og uten mye billedbruk eller adjektiver som skaper en "strippet" følelse.', 'Språket er rikt på bilder, metaforer, adjektiver og andre språklige virkemidler som skaper en levende og fargerik tekstur.'],
        ['I', 'Informasjons&shy;formål', 'Informer&shy;ende', 'Argument&shy;erende', 'Definerer om tekstens primære mål er å formidle fakta eller å bygge en argumentasjon for et synspunkt.', 'Fokuserer på å presentere fakta, data og observasjoner uten åpenbar argumentasjon.', 'Bygger aktivt opp et resonnement med sikte på å bevise eller overbevise om en bestemt påstand eller et syn.'],
        ['J', 'Påvirknings&shy;intensjon', 'Nøytral', 'Overtal&shy;ende', 'Vurderer graden av bevisst forsøk på å påvirke leserens holdninger eller handlinger.', 'Inntar en upartisk holdning, uten åpenbare forsøk på å styre leserens konklusjoner.', 'Anvender strategier for å lede leseren mot et ønsket synspunkt eller handling.'],
        ['C', 'Seremonielt preg', 'Høytidelig', 'Avslappet', 'Beskriver graden av seremoniell eller høytidsstemt karakter i språket og tonen.', 'Språket har en formell, verdig og ofte høystemt karakter, egnet for seremonier eller viktige anledninger.', 'Tonen er løs og ledig, uten preg av formell eller seremoniell distanse.'],
        ['D', 'Språklig formalitet', 'Formelt', 'Uformelt', 'Definerer den generelle formalitetsgraden i ordvalg og setningsstruktur.', 'Følger strenge grammatiske normer, bruker presist og ofte akademisk eller offisielt vokabular.', 'Tillater et mer dagligdags, konverserende språk, kan inkludere slang, forkortelser og enklere setninger.'],
        ['G', 'Argumentasjons&shy;fundament', 'Fakta&shy;basert', 'Intuisjons&shy;basert', 'Vurderer om argumentasjonen eller fremstillingen primært hviler på ytre fakta eller indre intuisjon/følelse.', 'Bygger på verifiserbare fakta, data og observerbare fenomener.', 'Stoler mer på magefølelse, personlig innsikt eller umiddelbar fornemmelse som grunnlag for påstander.'],
        ['B', 'Begrunnelses&shy;metode', 'Kilde&shy;basert', 'Refleksjon&shy;sbasert', 'Beskriver hvordan påstander eller innsikter underbygges; gjennom eksterne kilder eller personlig refleksjon.', 'Henviser tydelig til og bygger på eksterne kilder, forskning, sitater eller dokumentasjon.', 'Utvikler innsikter gjennom personlig ettertanke, resonnement og filosofisk betraktning.'],
        ['W', 'Virkelighets&shy;grad', 'Realistisk', 'Stilisert', 'Angir hvorvidt fremstillingen søker å etterligne virkeligheten direkte eller anvender en bevisst formgivning.', 'Sikter mot en direkte og gjenkjennelig avbildning av den faktiske verden og dens mekanismer.', 'Anvender bevisste formgrep, overdrivelser eller forenklinger for å skape et spesifikt uttrykk fremfor direkte realisme.'],
        ['Y', 'Kunstnerisk Frihet', 'Virkelighet&shy;stro', 'Fri', 'Beskriver graden av frihet teksten tar seg i å tolke eller avvike fra en direkte gjengivelse av virkeligheten.', 'Legger vekt på å være så nøyaktig og tro mot den faktiske virkeligheten eller kildematerialet som mulig.', 'Tillater og benytter seg av subjektiv tolkning, symbolikk, og kreative avvik for å oppnå en kunstnerisk effekt.'],
        ['Z', 'Pedagogisk tilnærming', 'Utforsk&shy;ende', 'Belær&shy;ende', 'Definerer om teksten primært stiller spørsmål og utforsker, eller om den formidler kunnskap og instruerer.', 'Oppfordrer til nysgjerrighet, stiller åpne spørsmål og undersøker et tema fra flere sider uten å konkludere for leseren.', 'Har en klar intensjon om å lære bort noe spesifikt, gi instruksjoner eller formidle etablert kunnskap.'],
        ['Q', 'Normativ funksjon', 'Tolk&shy;ning', 'Forskriv&shy;ende', 'Vurderer om teksten overlater moralske eller verdimessige konklusjoner til leseren, eller om den aktivt fremmer bestemte normer.', 'Presenterer informasjon eller fortellinger på en måte som lar leseren danne egne meninger om hva som er rett/galt eller ønskelig.', 'Uttrykker tydelige verdier, anbefalinger for atferd, eller forsøker å etablere/forsterke sosiale eller moralske normer.']
    ]
    //,vPersonF:['P123456789','N123456789','F123456789','O123456789','L123456789','M123456789','R123456789','W123456789','Y123456789','U123456789','S123456789','K123456789','X123456789','D123456789','T123456789','C123456789','I123456789','J123456789','E123456789','V123456789','A123456789','G123456789','B123456789','Z123456789','Q123456789']
    ,vPerson:()=>`<table border="1" width="100%">`
        +`<tr id="wNavAndRes"><td id="wNav">`
            +`<table border ="1">`
                +wowsn.how.tone.g.map((e)=>`<tr><td class="vert" onclick="ui.BoldOnlyShowNxt(this)">${e[1]}</td><td class="hidden"><table border="1">`
                    +e[2].split('').map(l=>wowsn.how.tone.e.filter(f=>f[0]==l)
                        .map(m=>`<tr><td onclick="ui.BoldOnlyShowNxt(this)">${m[0]}</td><td class="vert hidden">${m[1]}</td></tr>`).join('')).join('')
                +`</table></td></tr>`).join('')
            +`</table>`
        +`</td><td id="wRes" width="95%">`
            +`<table border="1" width="100%"><tr><td id="wEditFilter">`
                //+`Result!`
                    //+wowsn.how.tone.vPersonF.join(', ')//[0]
                    +wowsn.how.tone.fHtm(wowsn.how.tone.vPersonF[0])
                    // +`<table width="100%"><tr>`
                    //     +`<td>X</td><td>X</td><td>X</td><td>X</td>`
                    // +`</tr></table>`
                +`</td></tr><tr><td id="wFilteredPeople">`
                    +`<table><tr id="wpHT"><td>Hunter S. Thompson</td></tr>`
                        +`<tr id="wpVW"><td>Virginia Woolf</td></tr>`
                        +`<tr id="wpMP"><td>Marcel Proust</td></tr>`
                    +`</table>`
            +`</td></tr></table>`
        +`</td></tr></table>`
    ,fHtm:(f)=>`<table width="100%" border="1"><tr>`
            +'1234'.split('').map((n)=>
                `<td>&nbsp;</td>`
            ).join('')
            +'56789'.split('').map((n)=>
                `<td class="selected">&nbsp;</td>`
            ).join('')
        +`</tr></table>`
    ,vHtm:(e,v)=>`<hr><table width="100%">`
        +`<tr><td class="vert" rowspan="2">${e[2].split('&shy;')[0]}</td><th width="99%">${e[1]}</th><td class="vert" rowspan="2">${e[3].split('&shy;')[0]}</td></tr>`
        +`<tr><th><table border="" width="99%"><tr>`+`<td>&gt;</td>`.repeat(v-1)+`<td style="background:white">&nbsp;</td>`+`<td>&lt;</td>`.repeat(9-v)
            +`</th></tr></table>`+`</td></tr></table>\n`
    ,eHtm:(g,e)=>!e?`[detaljer c='${g[1]}...']<b>Tone${g[1]}</b><table border="0">${wowsn.how.tone.e.filter(f=>g[2].includes(f[0])).map(m=>wowsn.how.tone.eHtm(g,m)).join('')}</table><hr>[/detaljer]`
        :`<tr><td>[detaljer c='${e[1]}: ${e[2]}/<wbr>${e[3]}...']<hr><table><tr><th colspan="3">${e[1]}</th></tr><tr><td colspan="3">${e[4]}</td></tr><tr><td colspan="3"><hr></td></tr><tr><td class="vert">${e[2]}</td><td colspan="2">${e[5]}</td></tr><tr><td colspan="3"><hr></td></tr><tr><td></td><td>${e[6]}</td><td class="vert"> ${e[3]} </td></tr></table><hr>[/detaljer]</td></tr>`
    ,gHtm:g=>!g?`<table border="0">${wowsn.how.tone.g.map((g)=>wowsn.how.tone.gHtm(g)).join('')}</table>`
        :`<tr><td>${wowsn.how.tone.eHtm(g)}</td></tr>`
    ,person: [
        ['AG', 'Anders Giæver',       'P8,E2,U8,N9,S4,T8,F1,O8,L8,M8,R8,V9,A9,K7,X8,I9,J9,C9,D9,G8,B9,W8,Y9,Z2,Q8'],
        ['MO', 'Margreth Olin',       'P4,E2,U2,N6,S7,T8,F2,O7,L7,M3,R3,V8,A8,K7,X9,I5,J8,C8,D5,G3,B5,W2,Y3,Z4,Q6'],
        ['NL', 'Nina Lykke',          'P8,E7,U8,N9,S8,T9,F3,O2,L2,M5,R2,V9,A9,K7,X7,I8,J8,C2,D1,G8,B9,W8,Y9,Z2,Q8'],
        ['ÅS', 'Åsne Seierstad',      'P9,E2,U2,N9,S1,T2,F2,O1,L2,M9,R8,V8,A8,K4,X8,I3,J7,C3,D1,G2,B4,W1,Y2,Z2,Q3'],
        // ['MH', 'Michel Houellebecq',  'P7,E8,U8,N8,S8,T9,F2,O7,L8,M6,R8,V9,A9,K8,X7,I8,J8,C8,D7,G8,B9,W8,Y9,Z3,Q9'],
        // ['KA', 'Karl Ove Knausgaard', 'P9,E3,U4,N9,S6,T7,F1,O3,L3,M3,R2,V6,A6,K7,X6,I4,J6,C7,D6,G7,B9,W3,Y7,Z2,Q4'],
        // ['SS', 'Sara Stridsberg',     'P8,E2,U7,N9,S7,T8,F2,O6,L7,M5,R4,V7,A7,K7,X9,I6,J7,C7,D6,G8,B8,W7,Y8,Z3,Q6'],
        // ['JA', 'Jan Guillou',         'P6,E6,U3,N7,S7,T6,F4,O2,L3,M7,R7,V7,A7,K6,X5,I8,J8,C5,D3,G3,B3,W4,Y5,Z7,Q8'],
        // ['WS', 'W.G. Sebald',         'P7,E5,U6,N7,S4,T8,F2,O8,L7,M3,R2,V7,A7,K5,X6,I5,J5,C4,D5,G7,B8,W7,Y7,Z3,Q4'],
        // ['LE', 'Leo Ajkic',           'P8,E3,U6,N8,S3,T4,F2,O7,L6,M8,R7,V6,A5,K5,X6,I4,J7,C9,D8,G6,B6,W5,Y6,Z4,Q5'],
        // ['JB', 'Jens Bjørneboe',      'P7,E2,U8,N8,S7,T8,F1,O8,L8,M7,R8,V9,A9,K8,X8,I8,J9,C7,D6,G8,B8,W8,Y9,Z7,Q9'],
        // ['SE', 'Svetlana Alexievich', 'P8,E2,U2,N9,S2,T3,F2,O4,L4,M4,R3,V8,A9,K6,X7,I2,J7,C4,D4,G3,B2,W2,Y3,Z6,Q5'],
        // ['EL', 'Elfriede Jelinek',    'P7,E4,U9,N7,S9,T9,F3,O8,L9,M6,R8,V9,A9,K9,X8,I8,J8,C6,D7,G8,B8,W9,Y9,Z7,Q9'],
        // ['RS', 'Roberto Saviano',     'P8,E4,U4,N8,S6,T7,F2,O6,L7,M7,R8,V8,A8,K7,X7,I7,J8,C7,D6,G3,B3,W4,Y7,Z6,Q8'],
        // ['NG', 'Natalia Ginzburg',    'P7,E4,U3,N8,S2,T4,F3,O2,L3,M4,R3,V6,A5,K4,X5,I3,J4,C6,D5,G6,B7,W3,Y4,Z4,Q4'],
        // ['PH', 'Peter Handke',        'P6,E5,U7,N6,S7,T8,F2,O7,L8,M4,R3,V6,A6,K7,X7,I5,J5,C5,D6,G7,B8,W7,Y8,Z3,Q4'],
        // ['AB', 'Alain de Botton',     'P5,E6,U3,N3,S3,T3,F3,O3,L3,M4,R4,V4,A3,K4,X4,I3,J4,C6,D4,G4,B5,W4,Y4,Z6,Q5'],
        // ['DU', 'Dubravka Ugrešić',    'P6,E5,U7,N7,S7,T8,F2,O7,L7,M5,R6,V8,A8,K7,X7,I7,J7,C7,D6,G7,B8,W7,Y8,Z4,Q7'],
        ['HT', 'Hunter S. Thompson',  'P9,E1,U9,N9,S4,T7,F1,O9,L9,M9,R9,V9,A9,K9,X9,I9,J9,C9,D9,G9,B9,W9,Y9,Z2,Q9'],
        // ['JD', 'Joan Didion',         'P7,E6,U5,N7,S7,T8,F2,O4,L5,M5,R5,V7,A7,K6,X6,I6,J6,C6,D5,G5,B6,W5,Y6,Z4,Q5'],
        // ['DFW','David Foster Wallace','P7,E5,U8,N7,S9,T9,F2,O8,L8,M6,R6,V8,A8,K9,X8,I8,J7,C7,D7,G7,B8,W8,Y8,Z5,Q7'],
        // ['JBd','James Baldwin',       'P8,E1,U3,N8,S3,T5,F1,O3,L4,M7,R8,V8,A8,K5,X7,I7,J9,C3,D5,G4,B6,W3,Y5,Z7,Q9'],
        // ['TC', 'Truman Capote',       'P8,E4,U6,N9,S5,T6,F2,O3,L4,M6,R6,V6,A6,K7,X8,I5,J7,C7,D6,G7,B7,W6,Y7,Z4,Q5'],
        // // Fillers P1,P2,P3,E9,U1,N2,N4,N5,T1,F5,F6,F7,F9,O5,M1,M2,R1,V1,V2,V3,V5,A1,A2,A4,K1,K2,K3,X1,X2,X3,J1,J2,J3,C1,D2,Z1,Z8,Q1,Q2
        // /*P1*/['BT', 'Barbara Tuchman',         'P1,E8,U2,N1,S7,T4,F8,O1,L1,M3,R3,V8,A8,K7,X4,I1,J4,C7,D1,G1,B1,W1,Y1,Z9,Q3'],
        // /*P2*/['SK', 'Simon Kuznets',           'P2,E8,U3,N2,S7,T6,F8,O2,L2,M4,R4,V5,A3,K6,X3,I2,J3,C4,D2,G1,B1,W2,Y2,Z7,Q4'], // SK: Economist known for broad analyses of economic growth and income distribution over long periods, providing a high-level, data-driven overview (P2), often very factual (E8), direct in academic style (U3), highly explanatory (N2), with ckx data (S7), aimed at specialists (T6), with a detached narrator (F8), structured logically (O2, L2), more measured than fast-paced (M4,R4), focused on data rather than overt argumentation (I2), primarily fact-based (G1,B1), realistic (W2,Y2), and aiming to inform (Z7).
        // /*P3*/['EH', 'E. H. Carr',              'P3,E7,U4,N2,S6,T5,F7,O3,L3,M5,R5,V7,A7,K5,X5,I4,J5,C5,D4,G2,B2,W3,Y3,Z6,Q5'], // EH: Historian (e.g., "What Is History?") who discusses broad historical methodologies and trends (P3), often analytical and explanatory (N2), with a clear but not overly simplistic style (S6), making complex ideas accessible (T5), maintaining a scholarly distance (F7), often critical/analytical in worldview (V7,A7).
        // /*E9*/['KN', 'Donald Knuth',            'P5,E9,U1,N1,S8,T8,F9,O1,L1,M5,R5,V5,A5,K2,X1,I1,J1,C5,D1,G1,B1,W1,Y1,Z9,Q2'], // KN: Author of "The Art of Computer Programming," known for extremely precise, factual, and objective technical writing (E9), highly direct (U1), purely explanatory (N1), complex due to subject (S8), aimed at experts (T8), with an invisible narrator (F9), highly structured (O1,L1), concise (K2), minimalist in prose (X1), purely informative (I1,J1), formal (D1), fact/logic-based (G1,B1), and instructional (Z9).
        // /*U1*/['EW', 'E.B. White',              'P5,E5,U1,N5,S2,T1,F5,O5,L5,M5,R5,V5,A5,K2,X2,I5,J5,C7,D3,G5,B5,W5,Y5,Z5,Q5'], // EW: Particularly in his contributions to "The Elements of Style," advocated for and exemplified clear, direct, and unambiguous prose (U1), emphasizing simplicity (S2), clarity (T1), and conciseness (K2), with a minimalist texture (X2).
        // /*N2*/['CS', 'Carl Sagan',              'P4,E4,U3,N2,S5,T2,F4,O4,L4,M6,R6,V3,A3,K5,X6,I2,J6,C6,D5,G3,B4,W4,Y5,Z8,Q4'], // CS: Astronomer and science communicator renowned for making complex scientific concepts understandable to a general audience ("Cosmos") (N2), often taking a broad perspective (P4), with an engaging and accessible style (S5, T2), a clear authorial voice (F4), aiming to inform and inspire wonder (I2, J6), often optimistic (V3), and highly pedagogical (Z8).
        // /*N4*/['MG', 'Malcolm Gladwell',        'P4,E4,U4,N4,S3,T2,F3,O6,L6,M7,R7,V6,A6,K6,X7,I5,J7,C8,D7,G4,B5,W4,Y6,Z3,Q7'], // MG: Explains concepts (N4) using vivid storytelling, making complex ideas accessible (S3,T2). His perspective often links broad ideas to specific cases (P4). Voice is engaging (F3, E4), structure can be non-linear initially (O6,L6), building arguments persuasively (I5,J7).
        // /*N5*/['SO', 'Susan Orlean',            'P7,E5,U5,N5,S3,T3,F4,O4,L4,M5,R5,V5,A5,K5,X6,I5,J5,C7,D6,G5,B5,W5,Y5,Z5,Q5'], // SO: Blends deep explanation (Forklarende) with immersive, experience-based storytelling (Opplevelsesbasert), achieving a neutral N5. Known for clear (S3, T3) and engaging prose (F4) exploring niche subjects.
        // /*T1*/['BB', 'Bill Bryson',             'P5,E4,U2,N3,S1,T1,F3,O3,L3,M6,R6,V4,A4,K3,X3,I3,J6,C8,D7,G5,B5,W3,Y4,Z4,Q5'], // BB: His writing is exceptionally clear and accessible (T1) to a very broad audience, often humorous (E4), with simple language (S1) and direct expression (U2), making complex topics understandable (N3).
        // /*F5*/['JS', 'John Steinbeck',          'P7,E3,U4,N7,S3,T3,F5,O3,L3,M5,R5,V7,A7,K6,X6,I7,J7,C7,D6,G6,B6,W4,Y6,Z4,Q6'], // JS: Narrator is present and empathetic but not overly intrusive (F5), often focusing on characters from a close perspective (P7), conveying emotion (E3) and societal critique (V7, A7).
        // /*F6*/['GO', 'George Orwell',           'P8,E7,U2,N3,S4,T4,F6,O2,L2,M6,R6,V8,A8,K5,X4,I4,J8,C7,D5,G2,B2,W2,Y3,Z3,Q8'], // GO: In his reportage (e.g., "Down and Out..."), the narrator is more in the background (F6), focusing on direct observation (U2, P8) and factual recounting (E7), though a critical perspective (V8, A8) is evident.
        // /*O5*/['VW', 'Virginia Woolf',          'P9,E1,U8,N9,S8,T8,F2,O5,L8,M3,R2,V5,A5,K7,X8,I5,J5,C5,D6,G7,B7,W7,Y8,Z4,Q5'], // VW: Her "stream of consciousness" often blends linear plot progression with deep dives into thought and memory, resulting in a structure that's neither strictly linear nor fully fragmented (O5), highly experimental (L8), internal (P9), emotional (E1), and reflective (R2).
        // /*M1*/['MP', 'Marcel Proust',           'P9,E1,U8,N9,S9,T9,F1,O5,L5,M1,R1,V5,A5,K9,X9,I5,J5,C5,D7,G7,B7,W7,Y7,Z5,Q5'], // MP: "In Search of Lost Time" is famously known for its extremely slow, meticulous, and introspective pace (M1) and deep reflection (R1).
        // /*M2*/['TM', 'Thomas Mann',             'P7,E5,U7,N6,S8,T7,F3,O4,L4,M2,R3,V6,A6,K8,X7,I6,J6,C6,D6,G6,B6,W6,Y6,Z6,Q6'], // TM: Novels like "The Magic Mountain" are characterized by a very deliberate, unhurried, and philosophical pace (M2).
        // /*R1*/['MA', 'Marcus Aurelius',         'P9,E7,U4,N9,S5,T6,F1,O7,L7,M2,R1,V5,A5,K3,X2,I3,J3,C3,D4,G8,B8,W5,Y5,Z7,Q7'], // MA: "Meditations" is an intensely personal and philosophical journal, almost purely reflective in its narrative energy (R1).
        // /*V1*/['NP', 'Norman Vincent Peale',    'P5,E2,U2,N7,S2,T2,F3,O3,L3,M5,R5,V1,A1,K3,X3,I7,J9,C8,D7,G7,B7,W3,Y3,Z8,Q8'], // NP: "The Power of Positive Thinking" epitomizes an extremely optimistic worldview (V1), aiming to be constructive (A1) and persuasive (J9).
        // /*V2*/['HK', 'Helen Keller',            'P8,E2,U3,N9,S4,T4,F1,O4,L4,M4,R4,V2,A2,K5,X5,I6,J7,C7,D6,G6,B8,W5,Y6,Z6,Q6'], // HK: Her autobiographical writings, despite detailing immense adversity, convey a very strong and inspiring optimism (V2).
        // /*V3*/['RD', 'Richard Dawkins',         'P5,E7,U2,N3,S6,T5,F6,O3,L3,M6,R6,V3,A3,K5,X4,I4,J8,C6,D4,G2,B2,W3,Y4,Z7,Q7'], // RD: In works like "The Selfish Gene" or "The God Delusion," while critical, he often presents science with a sense of wonder and optimistic belief in its power to explain and improve understanding (V3), aiming to be constructive in that framework (A3) and persuasive (J8).
        // /*V5*/['HF', 'Herodotus',               'P5,E5,U5,N5,S5,T5,F5,O5,L5,M5,R5,V5,A5,K5,X5,I5,J5,C5,D5,G5,B5,W5,Y5,Z5,Q5'], // HF: "The Histories" present a wide array of events, customs, and perspectives from different cultures without a consistently strong optimistic or critical authorial overlay, often letting events and sources speak for themselves, leading to a relatively neutral Verdenssyn (V5) and Tematisk Tilnærming (A5) in terms of a single overt bias.
        // /*A1*/['BF', 'Buckminster Fuller',      'P3,E5,U3,N3,S7,T6,F4,O4,L4,M5,R5,V2,A1,K6,X5,I4,J7,C6,D5,G4,B4,W4,Y6,Z8,Q7'], // BF: Architect and futurist known for his unwavering focus on innovative, constructive solutions to global problems ("Operating Manual for Spaceship Earth"), epitomizing a highly constructive thematic approach (A1) and optimism (V2).
        // /*A2*/['JJ', 'Jane Jacobs',             'P6,E6,U4,N4,S5,T4,F5,O5,L5,M5,R5,V4,A2,K5,X5,I5,J6,C6,D5,G4,B4,W4,Y5,Z5,Q6'], // JR: In "The Death and Life of Great American Cities," she constructively proposed solutions for urban planning by observing and analyzing what makes cities work, focusing on organic growth and community (A2), often with an optimistic view of grassroots potential (V4).
        // /*A4*/['MK', 'Marie Kondō',             'P8,E3,U2,N8,S1,T1,F3,O2,L2,M4,R4,V2,A4,K2,X2,I8,J8,C8,D7,G7,B7,W7,Y7,Z9,Q8'], // MK: Her "KonMari Method" is focused on a constructive approach (A4) to decluttering and organizing, aiming to bring joy (V2), with a very direct (U2), simple (S1), and instructional (Z9) style, primarily based on her personal experience and system (N8).
        // /*F7*/['GF', 'Gustave Flaubert',        'P6,E6,U4,N6,S6,T6,F7,O4,L4,M4,R4,V6,A6,K6,X6,I6,J6,C6,D4,G4,B4,W3,Y4,Z5,Q5'], // GF: In "Madame Bovary," Flaubert famously strove for an impersonal, objective narration (F7), where the author is less overtly present, allowing characters and events to unfold with a degree of authorial detachment.
        // /*F9*/['EB', 'Encyclopedia Britannica', 'P5,E9,U1,N1,S6,T6,F9,O1,L1,M5,R5,V5,A5,K4,X2,I1,J1,C5,D1,G1,B1,W1,Y1,Z9,Q2'], // EB: Represents the style of a comprehensive encyclopedia – extremely objective, factual, with a completely invisible narrator (F9), purely informative (N1, I1), direct (U1), and formal (D1).
        // /*O5*/['GM', 'Gabriel García Márquez',  'P7,E3,U7,N8,S7,T6,F4,O5,L7,M6,R5,V6,A6,K7,X8,I6,J6,C7,D6,G6,B6,W7,Y8,Z5,Q6'], // GM: In "One Hundred Years of Solitude," the narrative spans generations with a clear overall direction, yet incorporates magical realism, anachronisms, and shifts that prevent a strictly linear reading, fitting a neutral structural order (O5) that is neither purely linear nor fully fragmented, often feeling experimental (L7).
        // /*M1*/['MP', 'Marcel Proust',           'P9,E1,U8,N9,S9,T9,F1,O7,L7,M1,R1,V5,A5,K9,X9,I5,J5,C5,D7,G7,B7,W7,Y7,Z5,Q5'], // MP: "In Search of Lost Time" is renowned for its exceptionally slow, meditative, and introspective pace (M1), delving into minute details of consciousness and memory (R1), with a deeply personal and present narrator (F1, P9).
        // /*M2*/['HD', 'Henry David Thoreau',     'P8,E6,U5,N7,S6,T5,F2,O6,L6,M2,R2,V4,A4,K4,X5,I4,J4,C7,D6,G7,B8,W6,Y6,Z5,Q5'], // HD: In "Walden," Thoreau's observations of nature and reflections unfold at a very deliberate, unhurried pace (M2), encouraging contemplation (R2), with a strong authorial voice (F2) and close perspective (P8). (Replaced Thomas Mann for variety and a slightly different profile for M2).
        // /*R1*/['MA', 'Marcus Aurelius',         'P9,E7,U4,N9,S5,T6,F1,O7,L7,M2,R1,V5,A5,K3,X2,I3,J3,C3,D4,G8,B8,W5,Y5,Z7,Q7'], // MA: "Meditations" is an intensely personal and philosophical journal, almost purely reflective in its narrative energy (R1), with a slow pace (M2) and strong authorial presence (F1).
        // /*V1*/['NP', 'Norman Vincent Peale',    'P5,E2,U2,N7,S2,T2,F3,O3,L3,M5,R5,V1,A1,K3,X3,I7,J9,C8,D7,G7,B7,W3,Y3,Z8,Q8'], // NP: "The Power of Positive Thinking" epitomizes an extremely optimistic worldview (V1), aiming to be constructive (A1) and highly persuasive (J9) with simple, direct language (S2, U2).
        // /*V2*/['HK', 'Helen Keller',            'P8,E2,U3,N9,S4,T4,F1,O4,L4,M4,R4,V2,A2,K5,X5,I6,J7,C7,D6,G6,B8,W5,Y6,Z6,Q6'], // HK: Her autobiographical writings, despite detailing immense adversity, convey a very strong and inspiring optimism (V2), often experience-based (N9) and with a clear, personal voice (F1).
        // /*V3*/['AS', 'Antoine de Saint-Exupéry','P7,E3,U6,N7,S4,T5,F2,O5,L6,M5,R4,V3,A3,K5,X6,I5,J6,C6,D6,G6,B6,W5,Y7,Z5,Q5'], // AS: In "The Little Prince" and his aviation writings, a clear optimism (V3) and humanism shine through, often philosophical and poetic (U6, X6), aiming to be constructive (A3). (Alternative to R. Dawkins for V3).
        // /*V5*/['HF', 'Herodotus',               'P5,E5,U5,N5,S5,T5,F5,O5,L5,M5,R5,V5,A5,K5,X5,I5,J5,C5,D5,G5,B5,W5,Y5,Z5,Q5'], // HF: "The Histories" present a wide array of events, customs, and perspectives from different cultures without a consistently strong optimistic or critical authorial overlay, often letting events and sources speak for themselves, leading to a relatively neutral Verdenssyn (V5) and Tematisk Tilnærming (A5).
        // /*A1*/['BF', 'Buckminster Fuller',      'P3,E5,U3,N3,S7,T6,F4,O4,L4,M5,R5,V2,A1,K6,X5,I4,J7,C6,D5,G4,B4,W4,Y6,Z8,Q7'], // BF: Architect and futurist known for his unwavering focus on innovative, constructive solutions to global problems ("Operating Manual for Spaceship Earth"), epitomizing a highly constructive thematic approach (A1) and optimism (V2).
        // /*A2*/['JR', 'Jane Jacobs',             'P6,E6,U4,N4,S5,T4,F5,O5,L5,M5,R5,V4,A2,K5,X5,I5,J6,C6,D5,G4,B4,W4,Y5,Z5,Q6'], // JR: In "The Death and Life of Great American Cities," she constructively proposed solutions for urban planning by observing and analyzing what makes cities work, focusing on organic growth and community (A2), often with an optimistic view of grassroots potential (V4).
        // /*A4*/['SC', 'Stephen Covey',           'P5,E4,U2,N3,S3,T2,F4,O2,L2,M5,R5,V3,A4,K4,X3,I3,J8,C7,D4,G5,B5,W5,Y5,Z8,Q8'], // SC: "The 7 Habits of Highly Effective People" is primarily constructive (A4), offering principles and solutions for personal and professional effectiveness, generally optimistic (V3), direct (U2), and aiming to persuade/instruct (J8, Z8).
        // /*K1*/['EH', 'Ernest Hemingway',        'P8,E7,U1,N8,S1,T2,F7,O2,L2,M7,R6,V6,A6,K1,X1,I6,J6,C8,D7,G3,B3,W2,Y3,Z4,Q5'], // EH: Famed for his extremely concise, "iceberg theory" prose (K1), direct (U1), with simple language (S1) and a minimalist texture (X1), often from a close perspective (P8) and fact-based/observational (E7, G3).
        // /*K2*/['RC', 'Raymond Carver',          'P9,E6,U2,N8,S2,T3,F6,O3,L3,M5,R5,V7,A7,K2,X2,I5,J5,C8,D7,G5,B5,W4,Y5,Z4,Q6'], // RC: Known for his minimalist short stories, very concise language (K2), simple sentence structures (S2), and directness (U2), often depicting bleak realities (V7, A7) from a close perspective (P9).
        // /*K3*/['DS', 'Dashiell Hammett',        'P8,E7,U2,N8,S3,T4,F7,O3,L3,M7,R6,V7,A7,K3,X3,I6,J6,C8,D7,G3,B3,W3,Y4,Z4,Q6'], // DS: Hardboiled detective fiction pioneer, known for a lean, concise (K3) and direct style (U2), often with sparse descriptions (X3) and a detached narrator (F7).
        // /*X1*/['AG', 'Alain Robbe-Grillet',     'P7,E8,U5,N7,S6,T7,F8,O7,L8,M5,R5,V5,A5,K4,X1,I5,J2,C5,D5,G5,B5,W6,Y7,Z5,Q5'], // AG: Leading figure of the Nouveau Roman movement, which emphasized objective descriptions and a radically minimalist texture (X1), often with a detached, neutral narrator (F8, J2).
        // /*X2*/['YR', 'Yasunari Kawabata',       'P8,E4,U7,N8,S4,T5,F5,O6,L6,M3,R3,V5,A5,K3,X2,I5,J4,C6,D6,G6,B6,W5,Y6,Z5,Q5'], // YR: Nobel laureate whose prose is known for its subtlety, elegance, and a very minimalist, suggestive texture (X2), often with a quiet, reflective tone (R3, M3) and concise phrasing (K3).
        // /*X3*/['JD', 'Joan Didion',             'P7,E6,U3,N7,S5,T5,F6,O4,L4,M6,R6,V7,A7,K4,X3,I6,J6,C7,D6,G4,B4,W4,Y5,Z5,Q6'], // JD: Her essays and fiction are characterized by precise, controlled prose and a clearly minimalist texture (X3), often conveying a sense of unease or critique (V7, A7) with a somewhat detached but observant narrator (F6). (Note: JD is already in the main list, this entry is specifically to hit X3, other values are illustrative for this purpose).
        // /*J1*/['AP', 'Associated Press (Style)','P5,E9,U1,N1,S3,T2,F9,O1,L1,M5,R5,V5,A5,K2,X2,I1,J1,C5,D3,G1,B1,W1,Y1,Z2,Q2'], // AP: The journalistic style of news agencies like AP aims for extreme neutrality and objectivity in reporting facts (J1), with a direct (U1), concise (K2), and purely informative (I1, N1) approach and an invisible narrator (F9).
        // /*J2*/['DR', 'Dorothy Richardson',      'P9,E5,U6,N7,S6,T6,F3,O7,L7,M3,R2,V5,A5,K5,X5,I5,J2,C5,D6,G6,B6,W6,Y7,Z5,Q5'], // DR: A pioneer of stream-of-consciousness, her work ("Pilgrimage") focuses deeply on subjective experience (P9, N7) with a very neutral intent to overtly persuade (J2), presenting consciousness as it unfolds.
        // /*J3*/['LC', 'Leonard Cohen',           'P8,E3,U8,N7,S6,T7,F2,O6,L7,M3,R2,V7,A6,K5,X7,I5,J3,C6,D6,G7,B7,W6,Y8,Z5,Q6'], // LC: His song lyrics and poetry often explore complex themes with ambiguity and subtlety, presenting observations and emotions without a strong persuasive push, leaning towards a neutral authorial intent (J3).
        // /*C1*/['LS', 'Lincoln (Speeches)',      'P3,E6,U4,N6,S6,T6,F5,O3,L3,M2,R4,V5,A5,K5,X5,I6,J7,C1,D2,G5,B5,W5,Y5,Z5,Q7'], // LS: Abraham Lincoln's major speeches (e.g., Gettysburg Address, Second Inaugural) are characterized by an extremely solemn, dignified, and ceremonial tone (C1) and formal language (D2).
        // /*D2*/['HG', 'Hugo Grotius',            'P4,E8,U3,N2,S8,T8,F7,O2,L2,M4,R5,V5,A4,K7,X4,I2,J5,C5,D2,G1,B1,W2,Y2,Z7,Q4'], // HG: Early writer on international law ("De jure belli ac pacis"). Legal and philosophical treatises of that era were typically written in very formal Latin or vernacular (D2), with complex sentence structures (S8) and a detached, explanatory style (N2, F7).
        // /*Z1*/['MS', 'Michel de Montaigne',     'P8,E5,U6,N8,S7,T6,F2,O7,L7,M4,R2,V5,A5,K6,X6,I5,J4,C7,D6,G7,B8,W6,Y7,Z1,Q5'], // MS: The inventor of the essay form, his works are profoundly exploratory (Z1), meandering through thoughts and experiences (N8) with a strong personal voice (F2) and a reflective, questioning nature (R2) rather than a didactic one.
        // /*Z8*/['JA', 'Julia Child',             'P7,E3,U2,N8,S3,T2,F2,O2,L2,M5,R5,V3,A4,K4,X4,I8,J7,C8,D7,G5,B5,W5,Y5,Z8,Q7'], // JA: Her cookbooks and TV shows ("The French Chef") are very instructive and demonstrative (Z8), aiming to teach cooking techniques clearly (N8, U2, S3, T2) with an encouraging and present personality (F2, E3, V3).
        // /*Q1*/['IC', 'Italo Calvino',           'P6,E5,U7,N7,S7,T6,F5,O7,L8,M5,R5,V5,A5,K6,X7,I5,J4,C6,D6,G6,B6,W7,Y8,Z3,Q1'], // IC: Works like "Invisible Cities" or "If on a winter's night a traveler" are highly experimental (L8) and often present scenarios or ideas in a way that leaves moral/value conclusions entirely to the reader's interpretation (Q1), focusing on exploration (Z3) rather than prescription.
        // /*Q2*/['JB', 'Jorge Luis Borges',       'P7,E6,U7,N7,S7,T7,F6,O7,L8,M4,R3,V6,A6,K5,X7,I5,J4,C6,D6,G7,B7,W7,Y8,Z3,Q2'],  // JB: His short stories and essays are often philosophical and labyrinthine, presenting complex ideas and narratives that invite deep reader interpretation (Q2) rather than offering clear moral directives, often exploring concepts (Z3) with a detached intellectualism (F6, E6).
        ['GB', 'Gorm Braarvig',           'P5,E6,U5,N6,S3,T3,F3,O3,L3,M5,R4,V6,A6,K2,X3,I6,J6,C8,D7,G6,B7,W5,Y5,Z3,Q4'],
        // futuristene
        ['FM','Filippo Tommaso Marinetti','P2,E1,U1,N8,S8,T7,F1,O9,L9,M9,R9,V1,A2,K7,X9,I9,J9,C2,D7,G9,B8,W9,Y9,Z9,Q9'],
        ['VM', 'Vladimir Majakovskij',    'P4,E1,U2,N9,S8,T8,F1,O7,L9,M8,R9,V3,A3,K7,X9,I8,J9,C2,D8,G8,B9,W9,Y9,Z7,Q9'],
        // bauhaus
        ['WG', 'Walter Gropius',          'P2,E7,U2,N1,S6,T6,F3,O2,L3,M3,R3,V1,A1,K3,X3,I7,J8,C3,D2,G4,B7,W4,Y6,Z7,Q8'],
        ['LMN', 'László Moholy-Nagy',     'P2,E7,U2,N1,S7,T7,F3,O2,L3,M2,R3,V1,A1,K7,X4,I5,J8,C6,D2,G4,B7,W5,Y8,Z4,Q8'],
        // marxisme
        ['KM', 'Karl Marx',               'P1,E5,U3,N1,S9,T9,F7,O2,L2,M3,R4,V9,A9,K9,X4,I9,J9,C7,D1,G1,B2,W1,Y1,Z8,Q9'],
        ['FE', 'Friedrich Engels',        'P2,E5,U2,N1,S7,T7,F3,O2,L2,M5,R6,V9,A7,K6,X3,I9,J9,C7,D2,G1,B2,W1,Y1,Z8,Q9'],
         // bloggere
        ['JR', 'Joe Rogan',               'P7,E4,U2,N8,S3,T7,F1,O8,L7,M3,R4,V8,A8,K9,X3,I4,J7,C9,D9,G7,B8,W2,Y8,Z1,Q3'],
        ['LF', 'Lex Fridman',             'P4,E4,U2,N5,S4,T8,F2,O4,L4,M1,R1,V1,A2,K8,X3,I2,J4,C3,D4,G3,B7,W2,Y8,Z1,Q2'],
        //
        ['RG', 'Roxane Gay',              'P7,E2,U1,N9,S2,T7,F1,O3,L3,M6,R8,V9,A9,K7,X3,I9,J9,C8,D7,G7,B9,W2,Y7,Z6,Q9'],
        ['CA', 'Chimamanda Ngozi Adichie','P6,E3,U2,N7,S3,T7,F2,O2,L3,M4,R6,V5,A5,K4,X6,I7,J9,C4,D3,G5,B7,W2,Y6,Z7,Q9']
    ]
    ,uulegacy:{
        uu_stylepar: [['0', 'Unknown']
            ,['1', 'Content Approach'],['1-1', 'Immersive'],['1-2', 'Analytical'],['1-3', 'Gonzo']
            ,['1a', 'Tone'],['1a1', 'Formal'],['1a2', 'Informal'],['1a3', 'Sarcastic'],['1a4', 'Serious'],['1a5', 'Humorous'],['1a6', 'Objective'],['1a7', 'Subjective']
            ,['1b', 'Language'],['1b1', 'Simple'],['1b2', 'Complex'],['1b3', 'Technical'],['1b4', 'Formal'],['1b5', 'Informal'],['1b6', 'Conversational'],['1b7', 'Poetic']
            ,['1c', 'Structure'],['1c1', 'Narrative'],['1c2', 'Analytical'],['1c3', 'Chronological'],['1c4', 'Comparative'],['1c5', 'Cause-and-effect'],['1c6', 'Problem-solution'],['1c7', 'Descriptive']
            ,['2', 'Storytelling Method'],['2-1', 'Narrative-Driven'],['2-2', 'Investigative']
            ,['2a', 'Narrative Style'],['2a1', 'Linear'],['2a2', 'Non-linear'],['2a3', 'Episodic'],['2a4', 'Character-driven'],['2a5', 'Plot-driven'],['2a6', 'Dialogue-driven'],['2a7', 'Reflective']
            ,['2b', 'Pacing'],['2b1', 'Fast'],['2b2', 'Variable']
            ,['2c', 'Depth'],['2c1', 'High'],['2c2', 'Sustained']
            ,['3', 'Presentation Style'],['3-1', 'In-Depth']
            ,['3a', 'Format'],['3a1', 'Article'],['3a2', 'Blog post'],['3a3', 'Essay'],['3a4', 'Report'],['3a5', 'Feature'],['3a6', 'Profile'],['3a7', 'Analysis']
            ,['3b', 'Length'],['3b1', 'Short'],['3b2', 'Medium'],['3b3', 'Long']
            ,['3c', 'Media'],['3c1', 'Images'],['3c2', 'Visual']]
        ,uu_personstylepars: {
            'AG': ['Norway', '1-3, 1a3, 1b5, 1c1, 2-1, 2a1, 2a2, 3-2, 3a3, 3b2, 3c1'],
            'MO': ['Norway', '1-2, 1a2, 1b4, 1c2, 2-1, 2a1, 2a2, 3-1, 3a1, 3b1, 3c1'],
            'NL': ['Norway', '1-1, 1a1, 1b3, 1c3, 2-2, 2a2, 2b2, 3-3, 3a3, 3b3, 3c3'],
            'ÅS': ['Norway', '1-1, 1a1, 1b1, 1c1, 2-1, 2a1, 2b1, 3-1, 3a1, 3b1, 3c1'],
            'MH': ['Europe', '1-3, 1a3, 1b3, 1c3, 2-2, 2a2, 2b2, 3-3, 3a3, 3b3, 3c3'],
            'KA': ['Europe', '1-2, 1a4, 1b6, 1c1, 2-1, 2a1, 2b1, 3-1, 3a2, 3b1, 3c1'],
            'SS': ['Europe', '1-2, 1a2, 1b7, 1c2, 2-2, 2a4, 2b2, 3-1, 3a3, 3b1, 3c2'],
            'JA': ['Europe', '1-1, 1a1, 1b2, 1c3, 2-2, 2a3, 2b1, 3-3, 3a3, 3b2, 3c3'],
            'WS': ['Europe', '1-3, 1a4, 1b1, 1c3, 2-2, 2a7, 2b2, 3-3, 3a3, 3b3, 3c3'],
            'LE': ['Norway', '1-2, 1a5, 1b5, 1c1, 2-1, 2a2, 2b1, 3-2, 3a2, 3b2, 3c1'],
            'JB': ['Norway', '1-3, 1a3, 1b4, 1c5, 2-2, 2a2, 2b2, 3-3, 3a3, 3b3, 3c3'],
            'SE': ['Europe', '1-1, 1a4, 1b1, 1c6, 2-1, 2a1, 2b1, 3-1, 3a1, 3b1, 3c1'],
            'EL': ['Europe', '1-3, 1a3, 1b2, 1c4, 2-2, 2a2, 2b2, 3-3, 3a3, 3b3, 3c3'],
            'RS': ['Europe', '1-3, 1a5, 1b3, 1c1, 2-2, 2a4, 2b2, 3-3, 3a2, 3b2, 3c3'],
            'NG': ['Europe', '1-2, 1a4, 1b1, 1c1, 2-1, 2a7, 2b1, 3-1, 3a1, 3b1, 3c1'],
            'PH': ['Europe', '1-3, 1a4, 1b6, 1c4, 2-2, 2a7, 2b2, 3-3, 3a3, 3b3, 3c2'],
            'AB': ['Europe', '1-2, 1a6, 1b1, 1c6, 2-1, 2a1, 2b1, 3-2, 3a1, 3b1, 3c1'],
            'DU': ['Europe', '1-2, 1a2, 1b4, 1c2, 2-2, 2a7, 2b2, 3-3, 3a3, 3b3, 3c3'],
            'HT': ['US', '1-3, 1a3, 1b5, 1c3, 2-2, 2a2, 2b2, 3-2, 3a2, 3b2, 3c2'],
            'JD': ['US', '1-2, 1a4, 1b2, 1c2, 2-1, 2a7, 2b1, 3-2, 3a3, 3b2, 3c1'],
            'DFW': ['US', '1-3, 1a6, 1b3, 1c4, 2-2, 2a2, 2b2, 3-3, 3a3, 3b3, 3c3'],
            'JBd': ['US', '1-1, 1a4, 1b1, 1c5, 2-1, 2a1, 2b1, 3-1, 3a1, 3b1, 3c1'],
            'TC': ['US', '1-2, 1a5, 1b6, 1c1, 2-1, 2a1, 2b1, 3-1, 3a1, 3b1, 3c1']
        }
    }
    ,voiced:p=>`[detaljer c='${p[1]}...']<hr><b>${p[1]}</b>
        ${p[2].split(',').map((v)=>wowsn.how.tone.vHtm(wowsn.how.tone.e.find(e=>e[0]==v[0]),v[1])).join('')}
        <hr>[/detaljer]`
    ,voice:(t,p)=>(p==undefined)
        ?t+wowsn.how.tone.person.map((v)=>wowsn.how.tone.voice(t,v)).filter(Boolean).join('')
        :wowsn.how.tone.voiced(p)
    ,detaljer:(pt='',t='')=>
        `[_detaljer c='${pt}...']${wowsn.how.tone.vPerson()}<hr>${wowsn.how.tone.voice('')}<hr>[/detaljer]
        [detaljer c='${t}...']<hr>${wowsn.how.tone.gHtm()}<hr>[/detaljer]`
};
wowsn_how_tone.vPersonF=wowsn_how_tone.e.flatMap(i=>i[0]+'123456789');
window.wowsn.how.tone=wowsn_how_tone;
wowsn.init('how');
