// index.js
const scr = {
  l:src=>new Promise((onload,onerror)=>document.head.appendChild(
    Object.assign(document.createElement('script'),{src,onload,onerror})))
  , lw:async o=>(await scr.l(`o/{$o}.js`))^eval(`window.{$o}={$o}`)
};
  await scr.l(`o/${o}.js`);
    // Etter at skriptet er lastet, skal window[o] være tilgjengelig
    // hvis skriptet (o/wowsn.js) har satt det korrekt.
    // lw kan eventuelt returnere dette objektet for enkelhets skyld.
    return window[o]; 
scr.lw('wowsn');

// o/wowsn.js
const wowsn={t:'hi, I am wowsn!'}

wowsn2={
    why:{}
    ,how:{
        tone:{
            fb:{// user feedback : tone
                element:[['Akse', 'Ytterpunkt 1', 'Ytterpunkt 2', 'Forklaring av aksen', 'Forklaring av ytterpunkt 1', 'Forklaring av ytterpunkt 2'],
                    ['Prspektiv', 'Overordnet', 'Nær', 'Definerer fortellerens ståsted og fokusområde; omfanget av det som beskrives.', 'Fortelleren ser "det store bildet", gir kontekst og oversikt, ofte med en viss autoritet og distanse.', 'Fortelleren zoomer inn på detaljer, enkeltopplevelser eller individet, ofte mer intimt og personlig.'],
                    ['Eosjonell Vinkling', 'Følelsesladd', 'Saklig', 'Bestemmer graden og typen av følelsesmessig engasjement i teksten, og hvordan den appellerer til leserens følelser versus fornuft.', 'Vektlegger og formidler følelser, sikter mot å skape empati og emosjonell respons hos leseren.', 'Holder seg til fakta og objektiv informasjon, unngår å farge teksten med tydelige følelser, appellerer til fornuft.'],
                    ['Utrykksform', 'Direkte', 'Underfundig', 'Beskriver hvordan budskapet kommuniseres; om det er eksplisitt og rett frem, eller mer implisitt, lekent eller med flere lag av betydning.', 'Kommuniserer budskapet klart, åpent og rett på sak, uten skjulte meningslag.', 'Bruker hint, ironi, humor eller andre implisitte virkemidler; det som sies er ikke alltid det som menes bokstavelig.'],
                    ['Nrrativt formål', 'Forklarende', 'Opplevelsesbasert', 'Definerer hovedintensjonen bak fortellingen; om den primært søker å informere og klargjøre, eller å dele en subjektiv reise/erfaring.', 'Stilen fokuserer på å gjøre komplekse temaer forståelige, presentere informasjon og argumenter logisk.', 'Stilen legger vekt på å formidle en personlig reise, følelse eller erfaring, ofte fra et subjektivt ståsted.'],
                    ['Sråklig enkelhet', 'Enkelt', 'Komplekst', 'Vurderer den grunnleggende strukturelle og leksikalske kompleksiteten i språket.', 'Bruker hovedsakelig kjente ord og enkle setningsstrukturer, lett å forstå umiddelbart.', 'Benytter avansert vokabular og/eller sammensatte setningsstrukturer som kan kreve mer konsentrasjon.'],
                    ['Sråklig tilgjengelighet', 'Lett', 'Nyansert', 'Beskriver hvorvidt språket er umiddelbart klart eller om det inviterer til dypere tolkning og avdekking av flere lag.', 'Meningen er klar og umiddelbar, uten skjulte lag; tilgjengelig for et bredt publikum.', 'Språket inneholder subtiliteter, flere meningslag eller krever aktiv tolkning for full forståelse.'],
                    ['Frtellerens nærvær', 'Fortellerstemme', 'Objektiv', 'Angir hvor markant fortellerens egen stemme eller personlighet er i teksten.', 'Fortellerstemmen er merkbar, kanskje med egne kommentarer, refleksjoner, eller en distinkt personlig tone som adresserer leseren.', 'Fortelleren trer i bakgrunnen, og lar fakta og hendelser tale mest mulig for seg selv, som en "flue på veggen".'],
                    ['Srukturell orden', 'Lineær', 'Fragmentert', 'Beskriver den overordnede organiseringen av narrativet eller argumentasjonen.', 'Følger en kronologisk eller logisk sekvensiell rekkefølge fra start til slutt.', 'Bryter opp den tradisjonelle rekkefølgen, kan presentere elementer i ikke-kronologisk eller oppstykket form.'],
                    ['Flyt i strukturell konvensjon', 'Forutsigbar', 'Eksperimentell', 'Angir hvorvidt strukturen følger etablerte mønstre eller søker nye, ukonvensjonelle former.', 'Benytter kjente og etablerte narrative eller argumentative mønstre, lett å forutse progresjonen.', 'Utforsker ukonvensjonelle måter å koble sammen ideer eller hendelser, kan virke overraskende eller assosiativ.'],
                    ['Tempo', 'Rolig', 'Drivende', 'Definerer den opplevde hastigheten og rytmen i hvordan informasjonen eller handlingen utfolder seg.', 'Teksten har et langsommere, mer bedagelig tempo, dveler ved poenger eller scener.', 'Teksten har høy progresjon, beveger seg raskt fra ett punkt til det neste.'],
                    ['Narrativ energi', 'Reflekterende', 'Intens', 'Beskriver den dominerende energien eller modusen i fortellingen; om den er innadvendt og tenkende, eller utadvendt og kraftfull.', 'Teksten inviterer til ettertanke, utforsker tanker og følelser i dybden, ofte med en rolig energi.', 'Teksten er preget av sterk energi, dramatikk, eller umiddelbar påvirkning, ofte handlingsmettet eller med kraftige utsagn.'],
                    ['Verdenssyn', 'Optimistisk', 'Kritisk', 'Speiler den generelle holdningen til emnet eller verden; om den er preget av håp eller skepsis.', 'Fremhever det positive, muligheter og et lyst syn på fremtiden eller emnet.', 'Inntar en skeptisk holdning, stiller spørsmål ved etablerte sannheter, kan ha et mer pessimistisk eller realistisk utgangspunkt.'],
                    ['Tematisk Tilnærming', 'Konstruktiv', 'Problematiserende', 'Beskriver hvordan teksten engasjerer seg med sitt tema; om den bygger opp og søker løsninger, eller analyserer og avdekker problemer.', 'Fokuserer på å bygge opp, foreslå løsninger, eller presentere temaet på en positivt utviklende måte.', 'Fokuserer på å analysere, avdekke utfordringer, eller belyse komplekse problemer uten nødvendigvis å tilby enkle løsninger.'],
                    ['Språklig økonomi', 'Konsis', 'Ordrik', 'Vurderer hvorvidt språket er kortfattet eller mer utfyllende og detaljert.', 'Uttrykker seg kort og presist, unngår overflødige ord og digresjoner.', 'Bruker flere ord og setninger for å utdype poenger, kan være mer beskrivende og utfyllende.'],
                    ['Språklig tekstur', 'Minimalistisk', 'Billedrik', 'Beskriver graden av språklig utsmykning og bruk av figurative virkemidler.', 'Språket er enkelt, direkte og uten mye billedbruk eller adjektiver som skaper en "strippet" følelse.', 'Språket er rikt på bilder, metaforer, adjektiver og andre språklige virkemidler som skaper en levende og fargerik tekstur.'],
                    ['Informasjonsformål', 'Informerende', 'Argumenterende', 'Definerer om tekstens primære mål er å formidle fakta eller å bygge en argumentasjon for et synspunkt.', 'Fokuserer på å presentere fakta, data og observasjoner uten åpenbar argumentasjon.', 'Bygger aktivt opp et resonnement med sikte på å bevise eller overbevise om en bestemt påstand eller et syn.'],
                    ['Påvirkningsintensjon', 'Nøytral', 'Overtalende', 'Vurderer graden av bevisst forsøk på å påvirke leserens holdninger eller handlinger.', 'Inntar en upartisk holdning, uten åpenbare forsøk på å styre leserens konklusjoner.', 'Anvender strategier for å lede leseren mot et ønsket synspunkt eller handling.'],
                    ['Seremonielt preg', 'Høytidelig', 'Avslappet', 'Beskriver graden av seremoniell eller høytidsstemt karakter i språket og tonen.', 'Språket har en formell, verdig og ofte høystemt karakter, egnet for seremonier eller viktige anledninger.', 'Tonen er løs og ledig, uten preg av formell eller seremoniell distanse.'],
                    ['Språklig formalitet', 'Formelt', 'Uformelt', 'Definerer den generelle formalitetsgraden i ordvalg og setningsstruktur.', 'Følger strenge grammatiske normer, bruker presist og ofte akademisk eller offisielt vokabular.', 'Tillater et mer dagligdags, konverserende språk, kan inkludere slang, forkortelser og enklere setninger.'],
                    ['Argumentasjonsfundament', 'Faktabasert', 'Intuisjonsbasert', 'Vurderer om argumentasjonen eller fremstillingen primært hviler på ytre fakta eller indre intuisjon/følelse.', 'Bygger på verifiserbare fakta, data og observerbare fenomener.', 'Stoler mer på magefølelse, personlig innsikt eller umiddelbar fornemmelse som grunnlag for påstander.'],
                    ['Begrunnelsesmetode', 'Kildebasert', 'Refleksjonsbasert', 'Beskriver hvordan påstander eller innsikter underbygges; gjennom eksterne kilder eller personlig refleksjon.', 'Henviser tydelig til og bygger på eksterne kilder, forskning, sitater eller dokumentasjon.', 'Utvikler innsikter gjennom personlig ettertanke, resonnement og filosofisk betraktning.'],
                    ['Virkelighetsgrad', 'Realistisk', 'Stilisert', 'Angir hvorvidt fremstillingen søker å etterligne virkeligheten direkte eller anvender en bevisst formgivning.', 'Sikter mot en direkte og gjenkjennelig avbildning av den faktiske verden og dens mekanismer.', 'Anvender bevisste formgrep, overdrivelser eller forenklinger for å skape et spesifikt uttrykk fremfor direkte realisme.'],
                    ['Kunstnerisk Frihet', 'Virkelighetstro', 'Fri', 'Beskriver graden av frihet teksten tar seg i å tolke eller avvike fra en direkte gjengivelse av virkeligheten.', 'Legger vekt på å være så nøyaktig og tro mot den faktiske virkeligheten eller kildematerialet som mulig.', 'Tillater og benytter seg av subjektiv tolkning, symbolikk, og kreative avvik for å oppnå en kunstnerisk effekt.'],
                    ['Pedagogisk tilnærming', 'Utforskende', 'Belærende', 'Definerer om teksten primært stiller spørsmål og utforsker, eller om den formidler kunnskap og instruerer.', 'Oppfordrer til nysgjerrighet, stiller åpne spørsmål og undersøker et tema fra flere sider uten å konkludere for leseren.', 'Har en klar intensjon om å lære bort noe spesifikt, gi instruksjoner eller formidle etablert kunnskap.'],
                    ['Normativ funksjon', 'Tolkning', 'Forskrivende', 'Vurderer om teksten overlater moralske eller verdimessige konklusjoner til leseren, eller om den aktivt fremmer bestemte normer.', 'Presenterer informasjon eller fortellinger på en måte som lar leseren danne egne meninger om hva som er rett/galt eller ønskelig.', 'Uttrykker tydelige verdier, anbefalinger for atferd, eller forsøker å etablere/forsterke sosiale eller moralske normer.']]
            }
            ,stylepar: [['0', 'Unknown']
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
            ,person: [
                ['UP.', 'Unknown Person'],
                ['AG', 'Anders Giæver'],
                ['MO', 'Margreth Olin'],
                ['NL', 'Nina Lykke'],
                ['ÅS', 'Åsne Seierstad'],
                ['MH', 'Michel Houellebecq'],
                ['KA', 'Karl Ove Knausgaard'],
                ['SS', 'Sara Stridsberg'],
                ['JA', 'Jan Guillou'],
                ['WS', 'W.G. Sebald'],
                ['LE', 'Leo Ajkic'],
                ['JB', 'Jens Bjørneboe'],
                ['SE', 'Svetlana Alexievich'],
                ['EL', 'Elfriede Jelinek'],
                ['RS', 'Roberto Saviano'],
                ['NG', 'Natalia Ginzburg'],
                ['PH', 'Peter Handke'],
                ['AB', 'Alain de Botton'],
                ['DU', 'Dubravka Ugrešić'],
                ['HT', 'Hunter S. Thompson'],
                ['JD', 'Joan Didion'],
                ['DFW', 'David Foster Wallace'],
                ['JBd', 'James Baldwin'],
                ['TC', 'Truman Capote']
            ]
            ,personstylepars: {
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
            ,voice:i=>`[detaljer c='${tonevoice.person[i][1]}...']<hr><b>${tonevoice.person[i][1]}</b><br>`
        }
    }
    ,what:{}
    ,so:{}
    ,now:{}
}

console.log(tonevoice.voice('HT'));

