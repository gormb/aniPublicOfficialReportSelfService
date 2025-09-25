/////////////// lagring ///////////////
const lagring = {
    init:()=> lagring.last()
    , aktiv: null
        , getAktiv:def=>lagring.aktiv=lagring.lok.g('aktiv')??def
        , setAktiv:a=>lagring.lok.s('aktiv', lagring.aktiv=a??lagring.aktiv)^lagring.net.s('aktiv', lagring.aktiv)
    , id: null
        , getId:def=>lagring.id=lagring.lok.g('id')??def??lagring.idC.i()
        , setId:i=>lagring.lok.s('id', lagring.id=i??lagring.id??lagring.idC.i())
    , aktivApp: null
        , getAktivApp:def=>lagring.aktivApp=lagring.g('aktivApp')??def
        , setAktivApp:a=>lagring.s('aktivApp',lagring.aktivApp=a??lagring.aktivApp)
    , ai:['mistralsmall','mistralsmall','mistralsmall']
        , getAi:(i, def)=>lagring.ai[i]=lagring.g('setting ai'+i)??def
        , setAi:(i,a)=>lagring.s('setting ai'+i,lagring.ai[i]=a??lagring.ai[i])
    , sjargong: 'voksensprk'
    , spraak: 'bokml'
    , qr:()=>window.location.origin+window.location.pathname
        +'?'+ui.menu.X(lagring.getAktivApp())//+'?'+lagring.getAi(0,'')
        //+(lagring.spraak=='bokml'?'':'?'+lagring.spraak)
        //+(lagring.sjargong=='voksensprk'?'':'?'+lagring.sjargong)
    , delay:100, delayI:100
    , last:()=> {
        let delay = 100//, delayI = 100
        setting.dMsg('lagring.laster...')
        if (ui.c.Lagres && lagring.aktiv != lagring.getAktiv(lagring.aktiv ?? 0))
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
    , lok:{
        g:k=>localStorage.getItem(lagring.lok.pre+k)
        ,s:(k,v)=>localStorage.setItem(lagring.lok.pre+k,v)
        ,d:k=>localStorage.removeItem(lagring.lok.pre+k)
        ,pre:'HaandAaHoldeI '
    }
    ,net: {
        eId:()=>lagring.id?0:lagring.getId()^lagring.id
        ,g:k=>lagring.net.eId()^lagring.net.sel(lagring.net.gsdT,k)
        ,s:(k,v)=>lagring.net.eId()^lagring.net.upd(lagring.net.gsdT,k,v)
        ,d:k=>lagring.net.eId()^lagring.net.del(lagring.net.gsdT,k)
        ,gsdT:'HaandAaHoldeI'
        // ,uri:'https://nasxmebvjo'+'xcmzevvbts.supabase.co/rest/v1/'
        // ,key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc3htZWJ2am94Y216ZXZ2YnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzEzNjcsImV4cCI6MjA1ODA0NzM2N30.zvy3HGBwKealFrrOBFJaVk7jLrO4yqDxn6q9i6sSdsI'
        ,uri:'https://usbqiczlxlvrupwcgsib'+'xcmzevvbts.supabase.co/rest/v1/'
        ,key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzYnFpY3pseGx2cnVwd2Nnc2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjMwMDksImV4cCI6MjA3MzkzOTAwOX0.-m0fVj8WK61XqfEvkRbYbAZ-dAQWzOt2RP-44Hox-AM'
        ,sel:(e,x)=>{const[t,...c]=e.split(',');const q=c.length?'?select='+c.join(','):'';fetch(lagring.net.uri+t+q,{headers:{apikey:lagring.net.key}}).then(r=>r.json()).then(d=>x(c.length?d.map(r=>c.map(k=>r[k]??'')):d))}
        ,ins:(t,v,x)=>{fetch(net.uri+t,{method:'POST',headers:{apikey:net.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,upd:(t,v,x)=>{const id=v.id;delete v.id;fetch(lagring.net.uri+t+'?id=eq.'+id,{method:'PATCH',headers:{apikey:lagring.net.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,del:(t,v,x)=>{fetch(lagring.net.uri+t+'?id=eq.'+v.id,{method:'DELETE',headers:{apikey:lagring.net.key,'Prefer':'return=representation'}}).then(r=>r.json()).then(x)}
        ,selA:x=>lagring.net.sel('a',x)
        ,selAp:x=>lagring.net.sel('ap',x)
    }
    ,idC:{ // console.warn( lagring.id.t(lagring.id.i() ))
        s:[...'abcdefghijklmnopqrstuvwxyz0123456789']
        ,hash: v => (
            (s => {
                let n = 2166136261, r = '', a = lagring.idC.s, i = 0;
                for(;i<s.length;) n ^= s.charCodeAt(i++), n = n * 16777619 & 0x7fffffff;
                for(;n;) r = a[n % 36] + r, n = Math.floor(n / 36);
                return r.padStart(6, 'a');
            })(String(v))
            )              
        ,i:(n=Math.random()*2176782336)=>{let r='',a=lagring.idC.s;while(n|=0)r=a[n%36]+r,n/=36;return r.padStart(6,'a')}
        ,t:s=>{let n=0,a=lagring.idC.s;for(let i=0;i<6;i++)n=n*36+a.indexOf(s[i]);return n}
        ,ok:v=>v.length==6&&[...v].every(c=>lagring.idC.s.includes(c))
        ,p:q=>{let m=(q||'').match(/id=([a-z0-9]{6})/);return m&&lagring.idC.ok(m[1])?lagring.idC.t(m[1]):undefined}
    }
    ,dtab:{
        t:f=>['id,text,'].concat(f,['dtFrom,timestamptz,Valid from (default 2000-01-01)','dtTo,timestamptz,Valid to (default 2099-12-31)'])
        ,meta:[]
        ,SD:n=>`DROP TABLE IF EXISTS ${n} CASCADE;`
        ,SC:(n,r)=>{const a=r.map(x=>x.split(',').map(x=>x)),c=a.map(([f,t])=>f+' '+t+(f=='dtFrom'?" DEFAULT '2000-01-01T00:00:00Z'":'')+(f=='dtTo'?" DEFAULT '2099-12-31T23:59:59Z'":'')+(f=='createdAt'?" DEFAULT now()":'')),i=a.filter(([f])=>!['dtFrom','dtTo','createdAt'].includes(f)),cols=i.map(([f])=>f),vals=i.map(([f,t])=>f.startsWith('id_')?"'demo_id'":t=='text'?"'demo_"+f+"'":t=='jsonb'?"'{\"demo\":\"value\"}'":t.includes('timestamp')?'now()':'0');return`CREATE TABLE ${n} (${c.join(', ')}, PRIMARY KEY (id));\nINSERT INTO ${n} (${cols.join(',')}) VALUES (${vals.join(', ')});`}
        ,SX:(n,r)=>{const a=r.map(x=>x.split(',').map(x=>x)),t=Object.fromEntries(lagring.dtab.meta.map(([n])=>[n,1])),x=[];a.forEach(([f])=>{if(f.startsWith('id_')){const ref=f.slice(3);if(ref!==n&&t[ref]){x.push(`CREATE INDEX ${n}_${f}_idx ON ${n}(${f},dtFrom,dtTo);`);x.push(`ALTER TABLE ${n} ADD CONSTRAINT ${n}_${f}_fk FOREIGN KEY (${f}) REFERENCES ${ref}(id);`);}}});return x.join('\n');}
        ,tab:(n,d,r,fmt)=>{const a=r.map(x=>x.split(',').map(x=>x.trim())),rows=a.map(([f,t,b])=>`<tr><td>${f}</td><td>${t}</td><td>${b||''}</td></tr>`).join(''),sql=[lagring.dtab.SD(n),lagring.dtab.SC(n,r),lagring.dtab.SX(n,r)].join('\n');return fmt=='html'?`<table class="hidde" id="dTab_${n}"><caption>-- ${n} ${d} --</caption><tr><th>Felt</th><th>Type</th><th>Beskrivelse</th></tr>${rows}<tr><td colspan=3>${sql.replace(/\n/g,'<br>')}</td></tr></table>`:sql}
        ,tabN:(a,fmt='html')=>{let d=new Set(),o=[],f=n=>{if(d.has(n))return;let t=a.find(t=>t[0]==n);if(!t)return;t[2].forEach(r=>{let x=r.split(',')[0].trim();if(x.startsWith('id_'))f(x.slice(3));});o.push(lagring.dtab.tab(t[0], t[1], t[2], fmt));d.add(n)};a.forEach(([n])=>f(n));return o.join('')}
        ,erR:a=>a.flatMap(([from,_,rows])=>rows.map(r=>r.split(',')[0]).filter(f=>f.startsWith('id_')).map(f => ({from,to: f.slice(3)})))
        ,erNbox:a=>a.map(([id,l,_,[x,y,c]])=>`<div id=b_${id} style="position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);z-index:1;font-size:9pt;border:1px solid;padding:4px;max-width:120px;min-width:80px;width:max-content;text-align:center;background:${c}">${id}<br>${l}</div>`).join('')
        ,erNsvg:a=>{const s=document.getElementById('svgLayer'),p=s.createSVGPoint(),c=e=>{if(!e)return;const r=e.getBoundingClientRect(); p.x=r.left+r.width/2; p.y = r.top + r.height/2; return p.matrixTransform(s.getScreenCTM().inverse()) };s.innerHTML = `<defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="black"/></marker></defs>`+lagring.dtab.erR(a).map(({from,to})=>{const p1 = c(document.getElementById('b_'+from)),p2 = c(document.getElementById('b_'+to)),mx = (p1?.x + p2?.x)/2,my = (p1?.y + p2?.y)/2;return p1&&p2&&`<path d="M${p1.x} ${p1.y} L${mx} ${my} L${p2.x} ${p2.y}" stroke="black" fill="none" marker-mid="url(#arrow)"/>`;}).join('');}
        ,erN: a => (setTimeout(() => lagring.dtab.erNsvg(a),100),'<svg id=svgLayer style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none"></svg>' + lagring.dtab.erNbox(a))
    }
}

lagring.dtab.meta = [
    //bruk
    ['u', 'User', lagring.dtab.t(['data,jsonb,div info']), [49,12,'#acf']]
    ,['us','User Session',lagring.dtab.t(['id_u,text,User','id_su,text,anvendelse','id_a,text,app','id_f,text,metode']),[50,24,'#acf']]
    ,['su','Service Usage',lagring.dtab.t(['id_o,text,order','id_u,text,User Accessing','id_p,text,Product used','status,text,activ/inactiv']),[32,18,'#acf']]
    //innhold
    ,['ac', 'App Coder', lagring.dtab.t(['id_parent,text,Kodegruppering','id_u,text,Coder is User','data,jsonb,']), [69,9,'#9cf']]
    ,['fb', 'Feedback', lagring.dtab.t(['id_parent,text,Tilbakemelder','id_us,text,sesjon','id_a,text,app','id_u,text,User',,'id_ac,text,Coder Assigned','data,jsonb,']), [66,17,'#9cf']]
    ,['m','Message',lagring.dtab.t(['id_parent,text,Del av annen','id_us,text,sesjon','sendt,text,','mottatt,text,','id_f,text,funksjon']),[49.5,34,'#fbd']]
    //teknikk
    ,['h','Host',lagring.dtab.t(['Name,text,eg Mistral','uri,text,','gunnars,text,','q1,text,','q2,text,']),[84,41,'#dff']]
    ,['f','Functionality',lagring.dtab.t(['id_h,text,','id_parent,text,Grouping','Function,text,Type of Functionality','model,text,AI-model','modelid,text,Tech Model ID']),[70,36,'#cfc']]
    ,['a','App',lagring.dtab.t(['App,text,Name of App','id_parent,text,App Category Hierarchy','id_f,text,method','id_ac,text,','cfg,jsonb,config']),[79,27,'#cfc']]
    ,['ap','Prompt',lagring.dtab.t(['id_a,text,','id_ac,text,','line,int,Plassering','usr,text,User Message','sys,text,Reply']),[85,12,'#cfc']]
    //økonomi
    ,['o','Order',lagring.dtab.t(['id_parent,text,Order Group','id_c,text,Customer','id_p,text,Product','Status,text,active/ended']),[14,25,'#fa6']]
    ,['p','Product',lagring.dtab.t(['Name,text,Product Name','Description,text,','Amount,int,In øre/cent','Currency,text,Currency NOK/EUR etc']),[15,12,'#fc8']]
    ,['pay','Payment',lagring.dtab.t(['id_o,text,','id_c,text,','amt,int,I øre','status,text,initialized/payed/failed','provider,text,f.eks. Stripe','ref,text,Ekstern referanse','dtBet,timestamptz,Betalingsdato']),[25,32,'#fa6']]
    ,['cost','Expence',lagring.dtab.t(['id_parent,text,','id_h,text,','id_m,text,','amt,int,I øre','status,text,','provider,text,f.eks. Stripe','ref,text,Ekstern referanse','dtBet,timestamptz,Betalingsdato']),[35,40,'#fa6']]
    ,['c','Customer',lagring.dtab.t(['id_parent,text,parent customer','data,jsonb,div info']),[15,39,'#fc8']]
]

lagring.dtab.fyll = (n = 'unspesified') => {
    lagring.net.s('c', { id: `c_${n}_parent`, data: { type: `${n}test` } });
    lagring.net.s('c', { id: `c_${n}`, id_parent: `c_${n}_parent`, data: { type: `${n}test` } });
    lagring.net.s('p', { id: `p_${n}`, Name: `${n}produkt`, beskrivelse: `${n} testprodukt`, pris: 100000, valuta: 'NOK' });
    lagring.net.s('p', { id: `p_${n}_mrr`, Name: `${n}produkt MRR`, beskrivelse: `${n} med månedlig inntekt`, pris: 10000, valuta: 'NOK' });
    lagring.net.s('o', { id: `o_${n}`, id_c: `c_${n}`, id_p: `p_${n}_mrr`, antall: 1, status: 'aktiv' });
    lagring.net.s('pay', { id: `pay_${n}`, id_o: `o_${n}`, id_c: `c_${n}`, amt: 10000, status: 'gjennomført', provider: 'test', ref: `ref_${n}`, dtBet: new Date().toISOString() });
    //lagring.net.s('u', { id: `u_${n}`, data: { Name: `${n}bruker` } });
    lagring.net.s('su', { id: `su_${n}`, id_o: `o_${n}`, id_u: `u_${n}`, id_p: `p_${n}_mrr`, status: 'aktiv' });
    lagring.net.s('us', { id: `us_${n}`, id_u: `u_${n}`, id_su: `su_${n}`, id_a: `a_${n}`, id_f: `f_${n}` });
    lagring.net.s('m', { id: `m_${n}`, id_parent: null, id_us: `us_${n}`, sendt: `${n} hei`, mottatt: `${n} svar`, id_f: `f_${n}` });
    lagring.net.s('h', { id: `h_${n}`, Name: `${n}AI`, uri: `https://ai.${n}.no`, gunnars: 'abc123', spm1: 'Hva er neste?', spm2: 'Hva lurer du på?' });
    lagring.net.s('f', { id: `f_${n}`, id_h: `h_${n}`, id_parent: null, function: 'chat', model: 'demo', modellid: 'demo-model' });
    lagring.net.s('a', { id: `a_${n}`, App: `${n}App`, id_parent: `${n}Kategori`, id_f: `f_${n}`, cfg: { pilot: true } });
    //lagring.net.s('ap', { id: `ap_${n}`, id_a: `a_${n}`, line: 1, usr: `${n} bruker`, sys: `${n} bot` });
}
//lagring.dtab.pilotC=n=>Object.keys(lagring.dtab.meta).forEach(t=>lagring.net.del(t, `like.${t}_${n}`));
//lagring.dtab.fyll('unspesified');
lagring.dtab.fyllP=n=>{
    return `
    lagring.net.s('u',{id:gormbraarvig,data:{Name:'Gorm Braarvig'}})`
}
//lagring.idC.p('id=gorm9')
//lagring.net.sel('a',console.warn)//lagring.net.del('a', {id:'123'}, console.warn);//lagring.net.del('a', {id:'1234'}, console.warn);//lagring.net.del('a', {id:'11234'}, console.warn);//lagring.net.upd('a', {id:'1234', App:'1234 Test'}, console.warn);//lagring.net.upd('a', {id:'11234', App:'11234 Test'}, console.warn);//lagring.net.sel('b,id,App', r => console.table(r));
//lagring.net.selA(console.warn)
//lagring.net.selAp(console.warn)//{"id": "ny", "App":"Ny", "mor":"Ny", "mormor":"Utvikling"}

/* 
us (id text, id_u "user info", id_su "the service usage", id_a "the app used", id_f "functionality used", dtFrom timestamptz DEFAULT '2000-01-01T00:00:00Z', dtTo timestamptz DEFAULT '2099-12-31T23:59:59Z', PRIMARY KEY (id));
us ("anonym;yymmddss;rndrnd", "anonym bruker", "anonymt produkt", "app navn", "chat;algoritmer", dtFrom timestamptz DEFAULT '2000-01-01T00:00:00Z', dtTo timestamptz DEFAULT '2099-12-31T23:59:59Z', PRIMARY KEY (id));
der man bruker lokal modell er det ikke nødvendig å logge, man kan da støtte "ghost mode" for de med ekstreme skjermingsbehov 
*/
lagring.dtab.fyllMvp=()=>{
    lagring.dtab.fyll(´anonym´)
    let r=lagring.net.s('u',{id:´anonym´,data:{Name:'Anonym bruker'}})`
    return r;
}


