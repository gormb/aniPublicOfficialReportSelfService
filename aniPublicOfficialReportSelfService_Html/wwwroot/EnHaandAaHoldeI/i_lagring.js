/////////////// lagring ///////////////
const lagring = {
    init:()=> lagring.last()
    , aktiv: null
        , getAktiv:dflt=>lagring.aktiv=lagring.lok.g('aktiv')??dflt
        , setAktiv:a=>lagring.lok.s('aktiv', lagring.aktiv=a??lagring.aktiv)^lagring.net.s('aktiv', lagring.aktiv)
    , id: null
        , getId:dflt=>lagring.id=lagring.lok.g('id')??dflt??lagring.idC.i()
        , setId:i=>lagring.lok.s('id', lagring.id=i??lagring.id??lagring.idC.i())
    , aktivApp: null
        , getAktivApp:dflt=>lagring.aktivApp=lagring.g('aktivApp')??dflt
        , setAktivApp:a=>lagring.s('aktivApp',lagring.aktivApp=a??lagring.aktivApp)
    , ai:['mistralsmall','mistralsmall','mistralsmall']
        , getAi:(i, dflt)=>lagring.ai[i]=lagring.g('setting ai'+i)??dflt
        , setAi:(i,a)=>lagring.s('setting ai'+i,lagring.ai[i]=a??lagring.ai[i])
    , sjargong: 'voksensprk'
    , spraak: 'bokml'
    , delay : 100, delayI : 100
    , last: () => {
        let delay = 100//, delayI = 100
        setting.dMsg('lagring.laster...')
        if (lagring.aktiv != lagring.getAktiv(lagring.aktiv ?? 0))
            setTimeout(() => ui.visLagre(), delay += lagring.delayI)
        setting.dMsg('aktiv', lagring.aktiv)
        if (lagring.aktiv > 0) {
            lagring.getId();
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
    , toem: () => { // Remove all localStorage keys starting with lagring,lok.lagre_Pre using d()
        Object.keys(localStorage).forEach(k=>k.startsWith(lagring.lok.pre) && lagring.d(k.slice(lagring.lagre_Pre.length)))
        lagring.last();
    }
    , lagre: (a) => {
        lagring.aktiv=a??lagring.aktiv;
        setting.dMsg('lagreaktiv lagring.aktiv', lagring.aktiv)
        lagring.lok.s('aktiv', lagring.aktiv)
        lagring.net.s('aktiv', lagring.aktiv)
        lagring.lok.s('id', lagring.getId())
        if (lagring.aktiv) {
            setting.dMsg('lagreaktiv lagring.aktivApp', lagring.aktivApp)
            lagring.s('aktivApp', lagring.aktivApp)
        }
        return lagring.aktiv;
    }
    , g:k=>lagring.aktiv==2?lagring.net.g(k):lagring.aktiv?lagring.lok.g(k):undefined
    , s:(k,v)=>lagring.aktiv==2?lagring.net.s(k,v):lagring.aktiv?lagring.lok.s(k,v):undefined
    , d:k=>lagring.aktiv==2?lagring.net.d(k):lagring.aktiv?lagring.lok.d(k):undefined
    ,lok:{
        g:k=>localStorage.getItem(lagring.lok.pre+k)
        ,s:(k,v)=>localStorage.setItem(lagring.lok.pre+k,v)
        ,d:k=>localStorage.removeItem(lagring.lok.pre+k)
        ,pre:'HaandAaHoldeI '
    }
    ,net: {
        //k:1,
        eId:()=>lagring.id?0:lagring.getId()^lagring.id
        ,g:k=>eId()^lagring.net.sel(lagring.net.gsdT,k)
        ,s:(k,v)=>lagring.net.eId()^lagring.net.upd(lagring.net.gsdT,k,v)
        ,d:k=>eId()^lagring.net.del(lagring.net.gsdT,k)
        ,gsdT:'HaandAaHoldeI'
        ,uri:'https://nasxmebvjoxcmzevvbts.supabase.co/rest/v1/'
        ,key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc3htZWJ2am94Y216ZXZ2YnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzEzNjcsImV4cCI6MjA1ODA0NzM2N30.zvy3HGBwKealFrrOBFJaVk7jLrO4yqDxn6q9i6sSdsI'
        ,sel:(e,x)=>{const[t,...c]=e.split(',');const q=c.length?'?select='+c.join(','):'';fetch(lagring.net.uri+t+q,{headers:{apikey:lagring.net.key}}).then(r=>r.json()).then(d=>x(c.length?d.map(r=>c.map(k=>r[k]??'')):d))}
        ,ins:(t,v,x)=>{fetch(net.uri+t,{method:'POST',headers:{apikey:net.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,upd:(t,v,x)=>{const id=v.id;delete v.id;fetch(lagring.net.uri+t+'?id=eq.'+id,{method:'PATCH',headers:{apikey:lagring.net.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,del:(t,v,x)=>{fetch(lagring.net.uri+t+'?id=eq.'+v.id,{method:'DELETE',headers:{apikey:lagring.net.key,'Prefer':'return=representation'}}).then(r=>r.json()).then(x)}
        ,selA:x=>lagring.net.sel('a',x)
        ,selAp:x=>lagring.net.sel('a_p',x)
    }
    ,idC:{ // console.warn( lagring.id.t(lagring.id.i() ))
        s:[...'abcdefghijklmnopqrstuvwxyz0123456789']
        ,i:(n=Math.random()*2176782336)=>{let r='',a=lagring.idC.s;while(n|=0)r=a[n%36]+r,n/=36;return r.padStart(6,'a')}
        ,t:s=>{let n=0,a=lagring.idC.s;for(let i=0;i<6;i++)n=n*36+a.indexOf(s[i]);return n}
    }
}
//lagring.net.sel('a,id,App,mormor',console.warn)//lagring.net.del('a', {id:'123'}, console.warn);//lagring.net.del('a', {id:'1234'}, console.warn);//lagring.net.del('a', {id:'11234'}, console.warn);//lagring.net.upd('a', {id:'1234', App:'1234 Test'}, console.warn);//lagring.net.upd('a', {id:'11234', App:'11234 Test'}, console.warn);//lagring.net.sel('b,id,App', r => console.table(r));
lagring.net.selA(console.warn)
lagring.net.selAp(console.warn)
