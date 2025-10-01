/////////////// setting ////////////// 
const setting={
    debug:false, dMsg:(k,v)=>{if(setting.debug) {if(v)console.warn(k,v); else console.warn(k)}}
    , lang: [["Bokmål§*"]
        , ["Nynorsk"]
        , ["Ukrayinska mova"]
        , ["Sámegiella"]
        , ["Svenska"]
        , ["Dansk"]
        , ["English (UK)",'Språkdrakt >>', 'Language Style >>', 'Sjargong >>', 'Jargon >>']
        , ["English (US)"]
        , ["Italiano"]
    ]
    // accept index or value from lang...
    //, trans:(trans,t)=>typeof trans!='number'?setting.trans(setting.lang.indexOf(trans),t):trans//t
  //, trans:(trans,t)=>typeof trans!='number'?setting.trans(setting.lang.findIndex(l=>l[0]==trans),t):trans
    , trans:(trans,t)=>typeof trans!='number'?setting.trans(setting.lang.findIndex(l=>l[0]==trans),t):setting.lang[trans]?.[setting.lang[trans].indexOf(t,1)+1]||t
    , menu:(ver,trans=0)=>//setting.trans(trans, 
        `App >>§- ${ cfg.menusForAppProvider(ver) }
        |Språkdrakt >>§-||Sjargong >>|||Ungdomsspråk|||Voksenspråk§*
            ||Språk >>§-${setting.lang.map(l=>'|||'+l[0]).join('')}
        |Handling >>§-${ver?'':'||Begynn på nytt...||Tøm lagring...||Analyser personvern||Forsøk alle AI'}
            ${ver?'||Katalogside...':'||Administrasjon...'}
            ${ver?'':'||Utvikling >>§-|||Løsningsdesign|||Simuler|||List modeller|||Debug'}
        |Innstillinger >>§-
            ||Sikkerhet >>§-|||Sensitive data >>§-||||Ikke send sensitive data||||Omformuler sensitive data||||Godta sensitive data§*
                |||Helseråd fra AI >>§-||||Ikke mottatt helseråd fra AI||||Omformuler helseråd||||Godta helseråd§*
            ||AI >>§-|||AI tilbyder >>§-${ cfg.menusForAiProvider('')}|||Personvernkontroll AI >>§-${cfg.menusForAiProvider('PV ') }|||Bakgrunnsjobb AI >>§-${cfg.menusForAiProvider('BG ') }
                |||Tilfeldige AI-tilbydere
            ${ver?'':'||Grubling'}
            ${ver?'':'||Lagre innhold'}
            ||Støtt innsnakking§*
            ||Vis App-meny
        ${ver?'':'|Om >>§-||Kontakt||Personvernerklæring||Tilbakemelding til Aigap||QR-kode||App-lenke'}
        `.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')//)
    , funcDeepAnalysis: false
    , hindreSensitiveData:true
    , omformulerSensitiveData:false
    , hindreHelseraad:true
    , omformulerHelseraad:false
} //*/


//console.warn(setting.trans('English (UK)','Sjargong >>'))//console.warn(setting.trans(6,'Sjargong >>'))
setTimeout(() => {
    let i = ui.menu.Id('Sjargong')
    console.warn(i)
}, 100);


/*
<div id="m_mistralsmall" data-d0="mistral-small-latest" data-nb=""
class="menu-item"
onclick="menuClickLeaf(event)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mistral small</div>
*/