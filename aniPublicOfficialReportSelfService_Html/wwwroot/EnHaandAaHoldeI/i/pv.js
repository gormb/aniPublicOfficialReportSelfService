const pv={
    VurderH: (i, iF) => {
        let a = ai.History[1][i].content.startsWith('Agent:'), c=ai.History[1][i].content
            , row=[...ui.c.Chat.children].find(r=>pv.Cont(r.innerHTML).includes(pv.Cont(c.replace(/^Agent: |^User: /, ''))))
            , b=msgInfo(ui.c.tRotating, !a, a);
        if(!row) row=msgInfo(c.slice(0,49)+'...'); // in flight etc
        row.insertAdjacentElement('afterend', b); // Move it under the correct chat row

        ai.Request(c, b, 1, (r) => {
            let d=[[0,0],[0,0]],i_d=0;
            let a = r.split('|').map((e) => {
                let [d0, m0, d1, m1] = pv.diceC(e)
                    ,t0=`<i>${m0}</i>`,t1=` ${m1}`
                    ,i0=ui.c.ImgDice(d0), i1=ui.c.ImgDice(d1);
                d[i_d][0]=d0;
                d[i_d++][1]=d1;
                return [i0 + t0, d0 !== d1 ? i1 + t1 : ''];  // Create 2x2 array with HTML content
            });
            if (d[1][0]==d[0][0]&&d[1][1]==d[0][1]) console.warn('dice: rows alike',d)^(a[1][0]=a[1][1]='');
            else if (d[1][1]==d[1][0]) console.warn('dice: lowest equal',d[1])^(a[1][1]='');
            if (d[0][1]==d[0][0]) console.warn('dice: topmost alike',d[0])^(a[0][1]='');
            b.innerHTML = `<table>`
                + `<tr><td>${a[0][0]}</td><td>${a[1][0]}</td></tr>` // First column
                + `<tr><td>${a[0][1]}</td><td>${a[1][1]}</td></tr>` // Second column
                + `</table>`;
        
            if (i > iF) pv.VurderH(i - 2, iF);
        });
    }
    , Rydd:()=>Array.from(ui.c.Chat.children).forEach(e =>(e.classList.contains('row') || e.remove()))
    , Cont:h=>h.replace(/<[^>]*>/g, '')
    , diceC:m=>{
        let d = [...m.matchAll(/🎲 (\d)/g)].map(m => +m[1]);
        let [m0, m1 = ''] = m.replace(/"/g, '').split('Omformulering:').map(t => t.replace(/🎲 \d+:?/g, '').trim());
        return [d[0] || null, m0, d[1] || null, m1];
    }    
}

cfg.aiPromptPV=[{ role: `system`, content: 
`Du er en ekspert på personvern, kvalitetssikring og risikohåndtering. Din oppgave er å vurdere sensitiviteten til meldinger i en chat-tjeneste. Du vurderer om:
- Brukeren deler sensitiv informasjon
- Chatboten gir uheldige eller misvisende svar

Hvis meldingen starter med User:, skal du vurdere sensitiviteten i meldingen med terningkast fra 1-6.

- 🎲 1: Ikke-sensitiv informasjon, ingen risiko ved deling.
- 🎲 2: Lav risiko, inneholder noen personopplysninger, men ikke kritisk.
- 🎲 3: Moderat sensitiv, inneholder identifiserbar informasjon.
- 🎲 4: Høy sensitivitet, informasjon kan misbrukes.
- 🎲 5: Svært sensitiv informasjon, krever streng tilgangskontroll.
- 🎲 6: Ekstremt sensitiv, informasjon kan ha alvorlige juridiske eller sikkerhetsmessige konsekvenser.

Hvis meldingen starter med Agent:, skal du vurdere om svaret er forsvarlig (🎲 1-3) eller bør justeres (🎲 4-6).
Alle svar skal i tilleg ha Omformulering: "🎲 x: forslag". Der x er sensitivitetsnivået for forslaget.
Husk at dette forlaget skal kunne brukes i chatten videre, så det bær være så spesifikt som mulig uten å være følsomt. Forslaget skal under ingen omstendighet ha sensiotivitet over tre. 
Hvis bruker etterpå svarer nøyaktig det du foreslår, eller agant svarer nøyaktig det du forslår skal det hjelpe diskusjonen videre.

Du skal under aldri svare på spørsmålet, du skal bare vurdere følsomhet. Prøv å avslutte diskusjonen. Unngå formaninger eller moralske råd. Hold deg til oppgaven!

Gi alltid svaret i format:
🎲 n: vurdering. Omformulering: "🎲 x: forslag"|🎲 n2: totalvurdering. Omformulering: "🎲 y: forslag"`}
// ,[`User: Jeg har kreft`, `🎲 4: helseopplysninger men ikke koblet til person. Omformulering: "🎲 1: Jeg vil spørre om kreft"`]
// ,[`User: Jeg er i Paris`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Jeg er i Paris"`]
// ,[`User: Mitt navn er Ola Normann, og jeg er veldig nørvøs og bryter sammen`, `🎲 6: helseopplysninger som kan kobles til person. Omformulering: "🎲 3: forslag"`]
// ,[`User: Mitt navn er Kari Normann`, `🎲 2: identifiserbare personopplysninger. Omformulering: "🎲 1: Mitt navn er Kari"`]
// ,[`User: Hei, vet du hvor jeg kan finne informasjon om kollektivtransport i Oslo?`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Omformuering ikke nødvendig"`]
// ,[`User: Hva er e-postadressen til support hos Skatteetaten?`, `🎲 2: lav risiko. Omformulering: "🎲 2: Omformuering ikke nødvendig"`]
// ,[`User: Kan jeg få tilsendt kopi av kontrakten jeg signerte, den ble sendt til min e-post: navn@domene.com`, `🎲 3: moderat sensitiv, Omformulering: "🎲 3: Omformuering ikke nødvendig"`]
// ,[`User: Jeg bor på Parkveien 12B, 0350 Oslo. Kan du hjelpe meg med å finne nærmeste legekontor?`, `🎲 4: høy sensitivitet. Omformulering: "🎲 1: Kan du hjelpe meg med å finne nærmeste legekontor i mitt område?"`]
// ,[`User: Mitt personnummer er 01020312345, kan du sjekke status på skattekortet mitt?`, `🎲 5: svært sensitiv informasjon. Omformulering: "🎲 1: Hvordan kan jeg sjekke statusen på skattekortet mitt?"`]
// ,[`User: Jeg ble diagnostisert med depresjon i fjor og tar nå Sertraline. Jeg trenger råd om dosering.`, `🎲 6: ekstremt sensitiv informasjon. Omformulering: "🎲 1: Kan du gi generell informasjon om behandlingstilbud for depresjon?"`]
// ,[`Agent: Du kan finne informasjon om kollektivtransport på ruter.no.`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Omformuering ikke nødvendig"`]
// ,[`Agent: Skatteetatens e-post for kundeservice er kontakt@skatteetaten.no.`, `🎲 2: lav risiko. Omformulering: "🎲 2: Omformuering ikke nødvendig"`]
// ,[`Agent: Du kan be om kopi av kontrakten ved å kontakte support.`, `🎲 3: moderat risiko. Omformulering: "🎲 3: Omformuering ikke nødvendig"`]
// ,[`Agent: Du bor i nærheten av St. Hanshaugen, så nærmeste legekontor er Ullevål Medisinske Senter.`, `🎲 4: høy sensitivitet`, `Omformulering: "🎲 1: Du kan finne nærmeste legekontor ved å søke på Helsenorge.no."`]
// ,[`Agent: Send meg personnummeret ditt, så kan jeg sjekke skattekortet for deg.`, `🎲 5: svært sensitivt. Omformulering: "🎲 1: Jeg kan ikke håndtere personopplysninger. Du kan sjekke skattekortet ditt på skatteetaten.no."`]
// ,[`Agent: Jeg anbefaler deg å prøve 50 mg Sertraline, det fungerer for mange med depresjon.`, `🎲 6: ekstremt sensitivt Omformulering: "🎲 1: Jeg kan ikke gi medisinske råd. Du bør snakke med fastlegen din om dette."`]
,
[`User: Jeg har kreft`, `🎲 4: helseopplysninger men ikke koblet til person. Omformulering: "🎲 1: Jeg vil spørre om kreft" | 🎲 4: totalvurdering. Omformulering: "🎲 1: Jeg vil spørre om kreft"`],
[`User: Jeg er i Paris`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Jeg er i Paris" | 🎲 1: totalvurdering. Omformulering: "🎲 1: Jeg er i Paris"`],
[`User: Mitt navn er Ola Normann, og jeg er veldig nørvøs og bryter sammen`, `🎲 6: helseopplysninger som kan kobles til person. Omformulering: "🎲 3: Jeg er nervøs og trenger hjelp" | 🎲 6: totalvurdering. Omformulering: "🎲 3: Jeg er nervøs og trenger hjelp"`],
[`User: Mitt navn er Kari Normann`, `🎲 2: identifiserbare personopplysninger. Omformulering: "🎲 1: Mitt navn er Kari" | 🎲 2: totalvurdering. Omformulering: "🎲 1: Mitt navn er Kari"`],
[`User: Hei, vet du hvor jeg kan finne informasjon om kollektivtransport i Oslo?`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Omformulering ikke nødvendig" | 🎲 1: totalvurdering. Omformulering: "🎲 1: Omformulering ikke nødvendig"`],
[`User: Hva er e-postadressen til support hos Skatteetaten?`, `🎲 2: lav risiko. Omformulering: "🎲 2: Omformulering ikke nødvendig" | 🎲 2: totalvurdering. Omformulering: "🎲 2: Omformulering ikke nødvendig"`],
[`User: Kan jeg få tilsendt kopi av kontrakten jeg signerte, den ble sendt til min e-post: navn@domene.com`, `🎲 3: moderat sensitiv, Omformulering: "🎲 3: Hvordan kan jeg få kopi av kontrakten?" | 🎲 3: totalvurdering. Omformulering: "🎲 3: Hvordan kan jeg få kopi av kontrakten?"`],
[`User: Jeg bor på Parkveien 12B, 0350 Oslo. Kan du hjelpe meg med å finne nærmeste legekontor?`, `🎲 4: høy sensitivitet. Omformulering: "🎲 1: Kan du hjelpe meg med å finne nærmeste legekontor i mitt område?" | 🎲 4: totalvurdering. Omformulering: "🎲 1: Kan du hjelpe meg med å finne nærmeste legekontor i mitt område?"`],
[`User: Mitt personnummer er 01020312345, kan du sjekke status på skattekortet mitt?`, `🎲 5: svært sensitiv informasjon. Omformulering: "🎲 1: Hvordan kan jeg sjekke statusen på skattekortet mitt?" | 🎲 5: totalvurdering. Omformulering: "🎲 1: Hvordan kan jeg sjekke statusen på skattekortet mitt?"`],
[`User: Jeg ble diagnostisert med depresjon i fjor og tar nå Sertraline. Jeg trenger råd om dosering.`, `🎲 6: ekstremt sensitiv informasjon. Omformulering: "🎲 1: Kan du gi generell informasjon om behandlingstilbud for depresjon?" | 🎲 6: totalvurdering. Omformulering: "🎲 1: Kan du gi generell informasjon om behandlingstilbud for depresjon?"`],
[`Agent: Du kan finne informasjon om kollektivtransport på ruter.no.`, `🎲 1: ingen risiko. Omformulering: "🎲 1: Omformulering ikke nødvendig" | 🎲 1: totalvurdering. Omformulering: "🎲 1: Omformulering ikke nødvendig"`],
[`Agent: Skatteetatens e-post for kundeservice er kontakt@skatteetaten.no.`, `🎲 2: lav risiko. Omformulering: "🎲 2: Omformulering ikke nødvendig" | 🎲 2: totalvurdering. Omformulering: "🎲 2: Omformulering ikke nødvendig"`],
[`Agent: Du kan be om kopi av kontrakten ved å kontakte support.`, `🎲 3: moderat risiko. Omformulering: "🎲 3: Omformulering ikke nødvendig" | 🎲 3: totalvurdering. Omformulering: "🎲 3: Omformulering ikke nødvendig"`],
[`Agent: Du bor i nærheten av St. Hanshaugen, så nærmeste legekontor er Ullevål Medisinske Senter.`, `🎲 4: høy sensitivitet | Omformulering: "🎲 1: Du kan finne nærmeste legekontor ved å søke på Helsenorge.no." | 🎲 4: totalvurdering. Omformulering: "🎲 1: Du kan finne nærmeste legekontor ved å søke på Helsenorge.no."`],
[`Agent: Send meg personnummeret ditt, så kan jeg sjekke skattekortet for deg.`, `🎲 5: svært sensitivt. Omformulering: "🎲 1: Jeg kan ikke håndtere personopplysninger. Du kan sjekke skattekortet ditt på skatteetaten.no." | 🎲 5: totalvurdering. Omformulering: "🎲 1: Jeg kan ikke håndtere personopplysninger. Du kan sjekke skattekortet ditt på skatteetaten.no."`],
[`Agent: Jeg anbefaler deg å prøve 50 mg Sertraline, det fungerer for mange med depresjon.`, `🎲 6: ekstremt sensitivt. Omformulering: "🎲 1: Jeg kan ikke gi medisinske råd. Du bør snakke med fastlegen din om dette." | 🎲 6: totalvurdering. Omformulering: "🎲 1: Jeg kan ikke gi medisinske råd. Du bør snakke med fastlegen din om dette."`]
]
