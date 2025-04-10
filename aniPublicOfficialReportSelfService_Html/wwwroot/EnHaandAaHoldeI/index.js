/////////////// menuClick_m_ - Menu handlers ///////////////
window.menuClick_m_=e=>{/* line or blank clicked */};
// menuClick_m_ - App >> 
window.menuClicks_mApp=a=>{
    lagring.setAktivApp(a);
    cfg.load(a).then(()=>InitializeChat('?')^ui.menu.EBoldOnly(a, cfg.appList()))
}
cfg.appList().forEach(a=>eval(`window.menuClick_m_${ui.menu.X(a)}=e=>window.menuClicks_mApp('${a}')`))
// menuClick_m_ - App overloaded
window.menuClick_m_kommer=e=>ui.menu.Show(false)^msgInfo('Under utvikling...', false, true)

// menuClick_m_ - Språk >>
window.menuClick_m_ungdomssprk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Ungdomsspråk', ['Voksenspråk', ...ui.menu.Click_alleSpraak])^msgRedoLast('Oversett siste melding til en språkdrakt som passer for ungdom, men har med all informasjonen. Fra nå av skal du svare med ord og på en måte som passer norsk ungdom. Svar med maks femten ord fra nå av med mindre spørsmålet har flere enn femten ord, da skal du bruke like mange ord som i spørsmålet.');
window.menuClick_m_voksensprk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Voksenspråk', ['Ungdomsspråk', ...ui.menu.Click_alleSpraak])^msgRedoLast('Overrsett siste melding til en språkdrakt som passer for voksne, men har med all informasjonen. Fra nå av skal du svare med ord og på en måte som passer voksne. Du trenger ikke svare med maks femten ord lengre.');
window.menuClick_m_bokml=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Bokml', ui.menu.Click_alleSpraak)^msgRedoLast('Oversett siste melding til bokmål. Fra nå av skal du kun svare kortfattet på bokmål');
window.menuClick_m_nynorsk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Nynorsk', ui.menu.Click_alleSpraak)^msgRedoLast('Oversett siste melding til nynorsk. Fra nå av skal du kun svare kortfattet på nynorsk');
window.menuClick_m_smegiella=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Sámegiella', ui.menu.Click_alleSpraak)^msgRedoLast('Translate the last message into Sámegiella. and idioms. In Sámegiella, the translation would be: "Geavahit vuosttaš mielddun Sámegiellatis. Nugo šiehtat, dahje veahkkin muhtun mielddun Sámegiellatis, geavahit kultuvrralaš miiheapmiid ja idiome. From now on, only answer in Sámegiella');
window.menuClick_m_svenska=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Svenska', ui.menu.Click_alleSpraak)^msgRedoLast('Øversett senaste meddelandet på svenska. Från och med nu ska du endast svara kortfattat på svenska.');
window.menuClick_m_dansk=e=>ui.menu.Show(false)^ui.menu.EBoldOnly('Dansk', ui.menu.Click_alleSpraak)^msgRedoLast('Oversett sidste besked på dansk. Fra nu af skal du kun svare kortfattet på dansk.');
window.menuClick_m_englishus=e=> ui.menu.Show(false)^ui.menu.EBoldOnly('English (UK)', ui.menu.Click_alleSpraak)^msgRedoLast('Translate the last message into British English. From now on, please respond briefly using British spelling, vocabulary, and idioms.');
window.menuClick_m_englishuk=e=> ui.menu.Show(false)^ui.menu.EBoldOnly('English (US)', ui.menu.Click_alleSpraak)^msgRedoLast('Translate the last message into American English. From now on, please respond briefly using American spelling, vocabulary, and idioms');

// menuClick_m_ - Handling >>
window.menuClick_m_begynnpnytt=e=>{
    ui.menu.Show(false);
    ui.c.Chat.innerHTML='';
    ai.Reset();
    msgAnswer(cfg.aiPrompt[cfg.aiPrompt.length-1][1],true);
    ui.c.Input.focus();
}

window.menuClick_m_analyserpersonvern=e=>{ 
    ui.menu.Show(false);
    let iHl=ai.History[0].length-1, iHf=iHl;
    while (iHf>0 && ai.History[0][--iHf].content!=cfg.aiPromptWelcomeQuestion)
        ;
    ai.History[1] = [...ai.ai2Prompt(cfg.aiPromptPV),...ai.History[0].slice(++iHf, iHl + 1).flatMap(m => [
            { role: 'user', content: (m.role === 'user' ? 'User: ' : 'Agent: ') + m.content },
            { role: 'assistant', content: ui.c.tRotating }])];
    let l=ai.History[1].length-1, lPre=ai.ai2Prompt(cfg.aiPromptPV).length;
    pv.Rydd();
    pv.VurderH(l-1, lPre);
    console.log(ai.History[1]);
    return;
}
window.menuClick_m_forskalleai=e=> {
    let m='Gjenta', cmd='';
    msgInfo('Under utvikling!', false, true)
    try{
        for (e=ui.c.Chat.lastElementChild; e && !e.classList.contains("sent"); e=ui.c.Chat.lastElementChild)
            e.remove();
        m = e.innerText;
    }catch(ex){ m=m||'Gjenta ...'}
    ai.AllModels(0).forEach((mod,i)=> {cmd+=`ui.menu.SelectModel(ui.menu.X('`+mod+`'));ai.Request('`+m.trim()+`', msgAnswer(), `+(i+3)+`, null,0);\n`});
    try{eval(cmd);}catch(ex){console.warn('menuClick_m_forskalleai', ex.message, cmd)}
    ui.menu.SelectModel(cfg.aiProviderDefault().split('?')[0]);
}
window.menuClick_m_administrasjon=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('indexadmin.html');
window.menuClick_m_lsningsdesign=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('https://www.figma.com/proto/2FbP5MyLOXCcuEjRict2f3/HjemmelegenMin?node-id=6830-20&t=FqZ5AB6Xx28a26IO-1');
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
window.menuClick_m_stttinnsnakking=e=>ui.Show(ui.c.Speak,ui.menu.EBold('stttinnsnakking'));

window.menuClick_m_grubling=e=> {
    setting.funcDeepAnalysis = ui.menu.EBold(e.target.innerText, !setting.funcDeepAnalysis);
    ui.Show(ui.c.Grubling, setting.funcDeepAnalysis);
    msgInfo(`<i>Grubling ${setting.funcDeepAnalysis?'':'de'}aktivert</i>`);
}
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
window.menuClick_m_kontakt=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('https://www.aigap.no/snakk-med-oss');
window.menuClick_m_personvernerklring=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('https://www.aigap.no/personvernerkl%C3%A6ring');
window.menuClick_m_tilbakemeldingtilaigap=e=>ui.menu.Show(false)^ui.menu.Click_OpenUrl('https://docs.google.com/spreadsheets/d/1utfDpp9dwNN80uR6PnE93KyoeRMBMHiEMvJDtSuMICA/edit?usp=sharing');
window.menuClick_m_qrkode=e=>ui.menu.Show(false)^ui.qrU()^setTimeout(()=>ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight, 500);

/////////////// menuClick_m_ - Menu redirect ///////////////
window.menuClickLeaf=e=>{ // handle click on leaf menu item
    const mi = e.target, mt = mi.innerText.trim(), fn=ui.menu.Fn(mt)
        , mtp=mi.parentElement.previousElementSibling.innerText.split('\n')[0].trim()
        , fnp=ui.menu.Fn(mtp);
    if (typeof window[fn] === 'function') window[fn](e);
    else if (typeof window[fnp] === 'function') window[fnp](e, mt);
    else e.target.outerHTML = `window.${fn}=e=>{};`;
}

/////////////// Init ///////////////
async function InitializeChat(q=null) {
    setting.dMsg('InitializeChat begin', q||'(null)')
    if(q==null) ui.menu.Reset();
    ui.menu.Show(false);
    cfg.aiPrompt.push([cfg.aiPromptWelcomeQuestion, cfg.aiPromptWelcome]);
    ai.Reset();
    if (q==null) await ai.Parse(cfg.aiProviderDefault()); //*/
    ui.c.Chat.innerHTML='';
    msgAnswer(cfg.aiPrompt[cfg.aiPrompt.length-1][1], true);
    ui.c.Input.focus();
    if (q==null) await ai.Parse(window.location.search); //*/
    else await ai.Parse(q);
    ui.c.HeaderTitle.innerHTML = cfg.app;
    if (cfg.app == cfg.ingenApp)
        ui.menu.Show(true)
    setting.dMsg('InitializeChat end', q||'(null)')
}

lagring.init();
ui.init();

// Forces a full reload when navigating back/forward
//if (performance.getEntriesByType("navigation")[0]?.type === "back_forward") location.reload(true); 
