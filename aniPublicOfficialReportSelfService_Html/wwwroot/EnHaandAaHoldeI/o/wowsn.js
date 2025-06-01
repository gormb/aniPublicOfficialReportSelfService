// Torry: fargene som kommer ut. Fargerikt? dype klangtoner?
// Legg til språkrådet
/* 
Jeg lager en modell for tone for språk struktur, uttrykk og intensjon for at LLM kan skrive bedre (kall det en omformer)
*/
window.wowsn={
    why:{detaljer:t=>`[detaljer c='${t}...']<hr><b>${t}</b><br>hvorfor<hr>[/detaljer]`,init:p=>{}}
    ,how:{
        tone:{ detaljer:(pt='',t='')=>`wowsn_how_tone for (${pt+','+t})?`
            ,g:[['x','Gruppenavn','PNFOLMRWY','Hvordan fortellingen eller teksten er bygget opp, fortellerens rolle, og hvordan virkeligheten fremstilles.']]
            ,e:[['y','Akse', 'Ytterpunkt 1', 'Ytterpunkt 2', 'Forklaring av aksen', 'Forklaring av ytterpunkt 1', 'Forklaring av ytterpunkt 2']]
            ,person: [['NN', 'Jane Doe','P8,E2,U8,N9,S4,T8,F1,O8,L8,M8,R8,V9,A9,K7,X8,I9,J9,C9,D9,G8,B9,W8,Y9,Z2,Q8']]
            ,vPersonF:['y123456789']
        }
        ,detaljer:t=>`${t}: ${wowsn.how.tone.detaljer('person','tone')}`
        ,init:p=>console.log('wowsn.how.init')
    }
    ,what:{detaljer:t=>`[detaljer c='${t}...']<hr><b>${t}</b><br>hva<hr>[/detaljer]`,init:p=>{}}
    ,so:{detaljer:t=>`[detaljer c='${t}...']<hr><b>${t}</b><br>så<hr>[/detaljer]`,init:p=>{}}
    ,now:{detaljer:t=>`[detaljer c='${t}...']<hr><b>${t}</b><br>nå<hr>[/detaljer]`,init:p=>{}}
    ,ux:{init:p=>{}}
    ,detaljer:(t='WOWSN-modellen',wt='Hvorfor',ot='Hvordan',ht='Hva',st='Hva&nbsp;så',nt='Hva&nbsp;nå')=>
        `<b>${t}</b><br>${wowsn.why.detaljer(wt)} ${wowsn.how.detaljer(ot)} ${wowsn.what.detaljer(ht)} ${wowsn.so.detaljer(st)} ${wowsn.now.detaljer(nt)}`
    ,init:(m='ux,why,how,what,so')=>m.split(',').forEach((m)=>eval('wowsn.'+m+'.init()'))
};
wowsn.init();
