/////////////// menu and state //////////////
 
const setting={
    debug:false, dMsg:(k,v)=>{if(setting.debug) {if(v)console.warn(k,v); else console.warn(k)}}
    , menu: `App >>§- ${ cfg.menusForAppProvider('') }
        |Språkdrakt >>§-||Sjargong >>|||Ungdomsspråk|||Voksenspråk§*
            ||Språk >>§-|||Bokmål§*|||Nynorsk|||Sámegiella|||Svenska|||Dansk|||English (UK)|||English (US)        
        |Handling >>§-||Begynn på nytt...||Tøm lagring...
            ||Analyser personvern||Forsøk alle AI
            ||Utvikling >>§-|||Prompt|||Simuler|||List modeller|||Debug
        |Innstillinger >>§-
            ||Sikkerhet >>§-|||Sensitive data >>§-||||Ikke send sensitive data||||Omformuler sensitive data||||Godta sensitive data§*
                |||Helseråd fra AI >>§-||||Ikke mottatt helseråd fra AI||||Omformuler helseråd||||Godta helseråd§*
            ||AI >>§-|||AI tilbyder >>§-${ cfg.menusForAiProvider('')}|||Personvernkontroll AI >>§-${cfg.menusForAiProvider('PV ') }|||Bakgrunnsjobb AI >>§-${cfg.menusForAiProvider('BG ') }
                |||Tilfeldige AI-tilbydere
            ||Grubling
            ||Lagre lokalt
            ||Vis App-meny
        |Om >>§-||Kontakt||Personvernerklæring||Tilbakemelding til Aigap||QR-kode
        `.replace(/(\s*\|)/g, '|').replace(/^\s+|\s+$/g, '')
    , funcDeepAnalysis: false
    , hindreSensitiveData:true
    , omformulerSensitiveData:false
    , hindreHelseraad:true
    , omformulerHelseraad:false
} //*/
