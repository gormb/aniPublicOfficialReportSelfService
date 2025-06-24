/////////////// setting ////////////// 
const setting={
    debug:false, dMsg:(k,v)=>{if(setting.debug) {if(v)console.warn(k,v); else console.warn(k)}}
    , menu:ver=>`App >>§- ${ cfg.menusForAppProvider(ver) }
        |Språkdrakt >>§-||Sjargong >>|||Ungdomsspråk|||Voksenspråk§*
            ||Språk >>§-|||Bokmål§*|||Nynorsk|||Ukrayinska mova|||Sámegiella|||Svenska|||Dansk|||English (UK)|||English (US)
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
        `.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')
    , funcDeepAnalysis: false
    , hindreSensitiveData:true
    , omformulerSensitiveData:false
    , hindreHelseraad:true
    , omformulerHelseraad:false
} //*/
