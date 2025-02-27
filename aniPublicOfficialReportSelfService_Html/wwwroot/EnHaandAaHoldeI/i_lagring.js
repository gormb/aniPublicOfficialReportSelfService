/////////////// lagring ///////////////
const lagring = {
    init:()=> lagring.last()
    , lagre_Pre:'HaandAaHoldeI '
    , aktiv: null, getAktiv:dflt=>lagring.aktiv=lagring.g('aktiv')??dflt, setAktiv:a=>lagring.s('aktiv', lagring.aktiv=a??lagring.aktiv)
    , aktivApp: null, getAktivApp:dflt=>lagring.aktivApp=lagring.g('aktivApp')??dflt, setAktivApp:a=>lagring.s('aktivApp',lagring.aktivApp=a??lagring.aktivApp)
    , ai:['mistralsmall','mistralsmall','mistralsmall'], getAi:(i, dflt)=>lagring.ai[i]=lagring.g('setting ai'+i)??dflt, setAi:(i,a)=>lagring.s('setting ai'+i,lagring.ai[i]=a??lagring.ai[i])
    , sjargong: 'voksensprk'
    , spraak: 'bokml'
    , g: k => localStorage.getItem(lagring.lagre_Pre + k)
    , s: (k, v) => !lagring.aktiv||localStorage.setItem(lagring.lagre_Pre + k, v)
    , d: k => localStorage.removeItem(lagring.lagre_Pre + k)
    , last: () => {
        let delay = 100, delayI = 100
        console.log('lagring.laster...')
        if (lagring.aktiv != lagring.getAktiv(lagring.aktiv ?? 0))
            setTimeout(() => ui.visLagre(), delay += delayI)
        console.log('aktiv', lagring.aktiv)
        if (lagring.aktiv > 0) {
            // ai selected...done in getAis:()
            // app chosen...
            if (lagring.aktivApp != lagring.getAktivApp(lagring.aktivApp))
                setTimeout(() => eval(`menuClick_m_${ui.menu.X(lagring.aktivApp)}()`), delay += delayI)
            console.log(delay, delayI)
            // the rest of the history...
        }
        console.log('eo lagring.laster...')
    }
    , getAis:()=>lagring.ai.join('?')
    , toem: () => { // Remove all localStorage keys starting with lagring.lagre_Pre using d()
        Object.keys(localStorage).forEach(k=>k.startsWith(lagring.lagre_Pre) && lagring.d(k.slice(lagring.lagre_Pre.length)))
        lagring.last();
    }
    , lagre: () => {
        setting.dMsg('lagreaktiv lagring.aktiv', lagring.aktiv)
        lagring.s('aktiv', lagring.aktiv)
        if (lagring.aktiv) {
            setting.dMsg('lagreaktiv lagring.aktivApp', lagring.aktivApp)
            lagring.s('aktivApp', lagring.aktivApp)
        }
    }
} //*/
