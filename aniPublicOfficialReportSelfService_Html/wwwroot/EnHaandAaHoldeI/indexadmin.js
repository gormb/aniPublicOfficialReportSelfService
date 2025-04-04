
const admin={
    lsAppMorMor:e=>admin.lsShowTell('<b>Juster App kategorymeny</b><hr>'+admin.cA(e).join('<br>').replace('<< ny/endre/slett mormor'
        ,`<hr><ul><li>ny app mormor "x"</li><li>endre app mormor "${admin.cA(e)[0].trim()}" "x"</li><li>slett app mormor "${admin.cA(e)[0].trim()}"</li></ul>`)
        ,`endre app mormor  "${admin.cA(e)[0].trim()}" "${admin.cA(e)[0].trim()}"`)
    ,lsAppMor:e=>admin.lsShowTell(`<b>Juster App underkategorymeny for kategory ${admin.cMor(e)}</b><hr>`+admin.cA(e).join('<br>').replace('<< ny/endre/slett mor'
        ,`<hr><ul><li>ny app mormor "${admin.cMor(e)}" mor "x"</li><li>endre app mormor "${admin.cMor(e)}" mor "${admin.cA(e)[0].trim()}" "x"</li><li>slett app mormor "${admin.cMor(e)}" mor "${admin.cA(e)[0].trim()}"</li></ul>`)
        ,`endre app mormor "${admin.cMor(e)}" mor "${admin.cA(e)[0].trim()}" "${admin.cA(e)[0].trim()}"`)
    ,lsApp:e=>admin.lsShowTell(`<b>Juster App for underkategory ${admin.cMor(e)}, kategory ${admin.cMor(e.parentElement)}</b><hr>`+admin.cA(e).join('<br>').replace('<< ny/endre/slett app'
        ,`<hr><ul><li>ny app mormor "${admin.cMor(e.parentElement)}" mor "${admin.cMor(e)}" "x"</li><li>endre app mormor "${admin.cMor(e.parentElement)}" mor "${admin.cMor(e)}" "${admin.cA(e)[0].trim()}" "x"</li><li>slett app mormor "${admin.cMor(e.parentElement)}" mor "${admin.cMor(e)}" "${admin.cA(e)[0].trim()}"</li></ul>`)
        ,`endre app mormor "${admin.cMor(e.parentElement)}" mor "${admin.cMor(e)}" "${admin.cA(e)[0].trim()}" "${admin.cA(e)[0].trim()}"`)
    ,lsShowTell:(s,t)=>msgInfo(s,1,0)^ui.menu.Show(false)^ui.e.Input_setValue(t)
    ,c:e=>e.innerText.replace(/[\u00A0]+/g, '').replace(/>/g,'')
    ,cA:e=>admin.c(e).split('\x0a')
    ,cMor:e=>admin.c(e.previousSibling).trim()
}
// menuClick_m_ - App >>
window.menuClicks_mAppM=(a,e)=>{
    if(a[0]=='<') admin.lsApp(event.target.parentElement);
    else lagring.setAktivApp(a);
}

/////////////// menuClick_m_ - Menu handlers ///////////////
cfg.appList('admin').forEach(a=>eval(`window.menuClick_m_${ui.menu.X(a)}=e=>window.menuClicks_mAppM('${a}',e)`))
window.menuClick_m_nyendreslettmormor=e=>{admin.lsAppMorMor(event.target.parentElement)};
window.menuClick_m_nyendreslettmor=e=>{admin.lsAppMor(event.target.parentElement)};

window.menuClick_m_prompt=e=>ui.menu.Click_OpenUrl('https://docs.google.com/spreadsheets/d/1mfX64WtObCh7Szyv0zXOscJl0F-_pE3fG0b8rDSSy_c/edit?gid=1531346265#gid=1531346265&range=E4')^ui.menu.Show(false);
window.menuClick_m_simuler=e=>{
    ui.e.Input_setValue('Hvordan kommer jeg meg dit?');
    setTimeout(() => { msgSend('Simulate: Hvordan kommer jeg meg dit?|Simulate: Du kan reise til CatoSenteret på Ullevål sykehus med bil, offentlig transport eller tilrettelagte transporttjenester', ()=> { ui.e.Input_setValue('Hva er relevansen til Ullevål sykehus?'); setTimeout(() => { msgSend('Hva er relevansen til Ullevål sykehus?');}, 2000); });}, 2000);
    ui.menu.Show(false);
}
window.menuClick_m_listmodeller=e=>ui.menu.AllModels(e);
// menuClick_m_ - Innstillinger >>
window.menuClick_m_ikkesendsensitivedata=e=>ui.menu.EBoldOnly('ikkesendsensitivedata',['ikkesendsensitivedata','omformulersensitivedata','godtasensitivedata']);
    window.menuClick_m_omformulersensitivedata=e=>ui.menu.EBoldOnly('omformulersensitivedata',['ikkesendsensitivedata','omformulersensitivedata','godtasensitivedata']);
    window.menuClick_m_godtasensitivedata=e=>ui.menu.EBoldOnly('godtasensitivedata',['ikkesendsensitivedata','omformulersensitivedata','godtasensitivedata']);
window.menuClick_m_ikkemottatthelserdfraai=e=>ui.menu.EBoldOnly('ikkemottatthelserdfraai',['ikkemottatthelserdfraai','omformulerhelserd','godtahelserd']);
    window.menuClick_m_omformulerhelserd=e=>ui.menu.EBoldOnly('omformulerhelserd',['ikkemottatthelserdfraai','omformulerhelserd','godtahelserd']);
    window.menuClick_m_godtahelserd=e=>ui.menu.EBoldOnly('godtahelserd',['ikkemottatthelserdfraai','omformulerhelserd','godtahelserd']);
window.menuClick_m_tmlagring=e=>{
    lagring.aktiv=l;
    lagring.toem();
    ui.visLagre()
    msgInfo('Alle eventuelle data slettet', true)
    ui.menu.Show(false);
}
window.menuClick_m_lagrelokalt=e=>lagring.lagre(++lagring.aktiv%3)^ui.visLagre();

window.menuClick_m_visappmeny=e=>cfg.visAppMeny(true)
// menuClick_m_ - Innstillinger >> AI >>
window.menuClick_m_tilfeldigeaitilbydere=e=> {
    const a = ai.AllModels(0);
    eval(`window.menuClick_m_pv${ui.menu.X(a[Math.floor(Math.random()*a.length)])}()`)
    eval(`window.menuClick_m_bg${ui.menu.X(a[Math.floor(Math.random()*a.length)])}()`)
    eval(`window.menuClick_m_${ui.menu.X(a[Math.floor(Math.random()*a.length)])}()`)
}
const menuClicks_mMod=m=>`window.menuClick_m_${m}=e=>ui.menu.SelectModel('${m}');
    window.menuClick_m_pv${m}=e=>ui.menu.SelectModel('pv${m}', 1);
    window.menuClick_m_bg${m}=e=>ui.menu.SelectModel('bg${m}', 2);`
ai.AllModels(0).forEach(e=>eval(menuClicks_mMod(ui.menu.X(e))))

window.menuClick_m_debug=e=>(setting.debug=ui.menu.EBold('debug'));

// menuClick_m_ - Om >>
window.menuClick_m_kontakt=e=>ui.menu.Click_OpenUrl('https://www.aigap.no/snakk-med-oss')^ui.menu.Show(false);
window.menuClick_m_personvernerklring=e=>ui.menu.Click_OpenUrl('https://www.aigap.no/personvernerkl%C3%A6ring')^ui.menu.Show(false);
window.menuClick_m_tilbakemeldingtilaigap=e=>ui.menu.Click_OpenUrl('https://docs.google.com/spreadsheets/d/1utfDpp9dwNN80uR6PnE93KyoeRMBMHiEMvJDtSuMICA/edit?usp=sharing')^ui.menu.Show(false);
window.menuClick_m_qrkode=e=>ui.qrU()^setTimeout(()=>ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight, 500)^ui.menu.Show(false);
//window.menuClick_m_qrkode=e=>ui.menu.Click_OpenUrl(ui.c.ImgQr())^ui.menu.Show(false);
//setTimeout(()=>ui.qr(),500)

/////////////// menuClick_m_ - Menu redirect ///////////////
window.menuClickLeaf=e=>{ // handle click on leaf menu item
    const mi = e.target, mt = mi.innerText.trim(), fn=ui.menu.Fn(mt)
        , mtp=mi.parentElement.previousElementSibling.innerText.split('\n')[0].trim()
        , fnp=ui.menu.Fn(mtp);
    if (typeof window[fn] === 'function') window[fn](e);
    else if (typeof window[fnp] === 'function') window[fnp](e, mt);
    else e.target.outerHTML = `window.${fn}=e=>{};\n<br>window.${fnp}=e, '${mt}'=>{};`;
}

/////////////// Init ///////////////
lagring.init();
ui.init();
ui.menu.Reset('admin');
// Forces a full reload when navigating back/forward
//if (performance.getEntriesByType("navigation")[0]?.type === "back_forward") location.reload(true); 
