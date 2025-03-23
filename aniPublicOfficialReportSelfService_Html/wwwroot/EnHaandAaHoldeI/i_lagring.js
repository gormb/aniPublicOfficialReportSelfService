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
    , delay : 100, delayI : 100
    , last: () => {
        let delay = 100//, delayI = 100
        setting.dMsg('lagring.laster...')
        if (lagring.aktiv != lagring.getAktiv(lagring.aktiv ?? 0))
            setTimeout(() => ui.visLagre(), delay += lagring.delayI)
        setting.dMsg('aktiv', lagring.aktiv)
        if (lagring.aktiv > 0) {
            // ai selected...done in getAis:()
            // app chosen...
            if (lagring.aktivApp != lagring.getAktivApp(lagring.aktivApp))
                setTimeout(() => eval(`menuClick_m_${ui.menu.X(lagring.aktivApp)}()`), delay += lagring.delayI)
            setting.dMsg(delay, lagring.delayI)
            // the rest of the history...
        }
        setting.dMsg('eo lagring.laster...')
    }
    , getAis:()=>lagring.ai.join('?')
    , toem: () => { // Remove all localStorage keys starting with lagring.lagre_Pre using d()
        Object.keys(localStorage).forEach(k=>k.startsWith(lagring.lagre_Pre) && lagring.d(k.slice(lagring.lagre_Pre.length)))
        lagring.last();
    }
    , lagre: (a) => {
        lagring.aktiv=a??lagring.aktiv;
        setting.dMsg('lagreaktiv lagring.aktiv', lagring.aktiv)
        lagring.s('aktiv', lagring.aktiv)
        if (lagring.aktiv) {
            setting.dMsg('lagreaktiv lagring.aktivApp', lagring.aktivApp)
            lagring.s('aktivApp', lagring.aktivApp)
        }
        return lagring.aktiv;
    }
    ,sb: {
        k:1
        ,uri:'https://nasxmebvjoxcmzevvbts.supabase.co/rest/v1/'
        ,key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc3htZWJ2am94Y216ZXZ2YnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzEzNjcsImV4cCI6MjA1ODA0NzM2N30.zvy3HGBwKealFrrOBFJaVk7jLrO4yqDxn6q9i6sSdsI'
        ,s:(e,x)=>{const[t,...c]=e.split(',');const q=c.length?'?select='+c.join(','):'';fetch(lagring.sb.uri+t+q,{headers:{apikey:lagring.sb.key}}).then(r=>r.json()).then(d=>x(c.length?d.map(r=>c.map(k=>r[k]??'')):d))}
        ,i:(t,v,x)=>{fetch(sb.uri+t,{method:'POST',headers:{apikey:sb.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,u:(t,v,x)=>{const id=v.id;delete v.id;fetch(sb.uri+t+'?id=eq.'+id,{method:'PATCH',headers:{apikey:sb.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,d:(t,v,x)=>{fetch(sb.uri+t+'?id=eq.'+v.id,{method:'DELETE',headers:{apikey:sb.key,'Prefer':'return=representation'}}).then(r=>r.json()).then(x)}
        ,sA:x=>lagring.sb.s('a',x)
        ,sAp:x=>lagring.sb.s('a_p',x)
    }
} //*/

// , sbsb:{
//     uri:'https://nasxmebvjoxcmzevvbts.supabase.co/rest/v1/'
//     ,sql:'https://nasxmebvjoxcmzevvbts.supabase.co/rest/v1/rpc/execute_sql'
//     ,key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc3htZWJ2am94Y216ZXZ2YnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzEzNjcsImV4cCI6MjA1ODA0NzM2N30.zvy3HGBwKealFrrOBFJaVk7jLrO4yqDxn6q9i6sSdsI'
//     //,s2:(e,x)=>{const[t,...c]=e.split(',');fetch(lagring.sb.uri+t+'?select='+c.join(','),{headers:{apikey:lagring.sb.key}}).then(r=>r.json()).then(d=>x(d.map(r=>c.map(k=>r[k]??''))))}
//     ,s:(e,x)=>{const[t,...c]=e.split(',');const q=c.length?'?select='+c.join(','):'';fetch(lagring.sb.uri+t+q,{headers:{apikey:lagring.sb.key}}).then(r=>r.json()).then(d=>x(c.length?d.map(r=>c.map(k=>r[k]??'')):d))}
//     ,i:(t,v,x)=>fetch(lagring.sb.uri+t,{method:'POST',headers:{apikey:lagring.sb.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)
//     ,u:(t,v,x)=>{const id=v.id;delete v.id;fetch(lagring.sb.uri+t+'?id=eq.'+id,{method:'PATCH',headers:{apikey:lagring.sb.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
//     ,d:(t,v,x)=>fetch(lagring.sb.uri+t+'?id=eq.'+v.id,{method:'DELETE',headers:{apikey:lagring.sb.key,'Prefer':'return=representation'}}).then(r=>r.json()).then(x)
//     ,iu:(t,v,x)=>lagring.sb.d(t, v, ()=>lagring.sb.i(t,v,x))
// }
//} //*/
// //lagring.sb.s('a,id,App,mormor',console.warn)
// lagring.sb.d('a', {id:'123'}, console.warn);
// lagring.sb.d('a', {id:'1234'}, console.warn);
// lagring.sb.d('a', {id:'11234'}, console.warn);
//lagring.sb.iu('a', {id:'1234', App:'1234 Test'}, console.warn);
//lagring.sb.iu('a', {id:'11234', App:'11234 Test'}, console.warn);
//lagring.sb.s('b,id,App', r => console.table(r));
lagring.sb.sA(console.warn)
lagring.sb.sAp(console.warn)
