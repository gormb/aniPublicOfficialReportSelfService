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
        +'?'+lagring.getAktivApp()//+'?'+lagring.getAi(0,'')
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
    ,lok:{
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
        ,uri:'https://nasxmebvjo'+'xcmzevvbts.supabase.co/rest/v1/'
        ,key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hc3htZWJ2am94Y216ZXZ2YnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzEzNjcsImV4cCI6MjA1ODA0NzM2N30.zvy3HGBwKealFrrOBFJaVk7jLrO4yqDxn6q9i6sSdsI'
        ,sel:(e,x)=>{const[t,...c]=e.split(',');const q=c.length?'?select='+c.join(','):'';fetch(lagring.net.uri+t+q,{headers:{apikey:lagring.net.key}}).then(r=>r.json()).then(d=>x(c.length?d.map(r=>c.map(k=>r[k]??'')):d))}
        ,ins:(t,v,x)=>{fetch(net.uri+t,{method:'POST',headers:{apikey:net.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,upd:(t,v,x)=>{const id=v.id;delete v.id;fetch(lagring.net.uri+t+'?id=eq.'+id,{method:'PATCH',headers:{apikey:lagring.net.key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(v)}).then(r=>r.json()).then(x)}
        ,del:(t,v,x)=>{fetch(lagring.net.uri+t+'?id=eq.'+v.id,{method:'DELETE',headers:{apikey:lagring.net.key,'Prefer':'return=representation'}}).then(r=>r.json()).then(x)}
        ,selA:x=>lagring.net.sel('a',x)
        ,selAp:x=>lagring.net.sel('ap',x)
    }
    ,idC:{ // console.warn( lagring.id.t(lagring.id.i() ))
        s:[...'abcdefghijklmnopqrstuvwxyz0123456789']
        ,i:(n=Math.random()*2176782336)=>{let r='',a=lagring.idC.s;while(n|=0)r=a[n%36]+r,n/=36;return r.padStart(6,'a')}
        ,t:s=>{let n=0,a=lagring.idC.s;for(let i=0;i<6;i++)n=n*36+a.indexOf(s[i]);return n}
        ,ok:v=>v.length==6&&[...v].every(c=>lagring.idC.s.includes(c))
        ,p:q=>{let m=(q||'').match(/id=([a-z0-9]{6})/);return m&&lagring.idC.ok(m[1])?lagring.idC.t(m[1]):undefined}
    }
    ,d:{
        t:f=>['id,text,'].concat(f,['dtFrom,timestamptz,Gyldig fra (default 2000-01-01)','dtTo,timestamptz,Gyldig til (default 2099-12-31)'])
        ,meta:[]
        ,tabSD:n=>`DROP TABLE IF EXISTS ${n} CASCADE;`
        ,tabSC:(n,r)=>{const a=r.map(x=>x.split(',').map(x=>x)),c=a.map(([f,t])=>f+' '+t+(f=='dtFrom'?" DEFAULT '2000-01-01T00:00:00Z'":'')+(f=='dtTo'?" DEFAULT '2099-12-31T23:59:59Z'":'')+(f=='createdAt'?" DEFAULT now()":'')),i=a.filter(([f])=>!['dtFrom','dtTo','createdAt'].includes(f)),cols=i.map(([f])=>f),vals=i.map(([f,t])=>f.startsWith('id_')?"'demo_id'":t=='text'?"'demo_"+f+"'":t=='jsonb'?"'{\"demo\":\"value\"}'":t.includes('timestamp')?'now()':'0');return`CREATE TABLE ${n} (${c.join(', ')}, PRIMARY KEY (id));\nINSERT INTO ${n} (${cols.join(',')}) VALUES (${vals.join(', ')});`}
        ,tabSX:(n,r)=>{const a=r.map(x=>x.split(',').map(x=>x)),t=Object.fromEntries(lagring.d.meta.map(([n])=>[n,1])),x=[];a.forEach(([f])=>{if(f.startsWith('id_')){const ref=f.slice(3);if(ref!==n&&t[ref]){x.push(`CREATE INDEX ${n}_${f}_idx ON ${n}(${f},dtFrom,dtTo);`);x.push(`ALTER TABLE ${n} ADD CONSTRAINT ${n}_${f}_fk FOREIGN KEY (${f}) REFERENCES ${ref}(id);`);}}});return x.join('\n');}
        ,tab:(n,d,r,fmt)=>{const a=r.map(x=>x.split(',').map(x=>x.trim())),rows=a.map(([f,t,b])=>`<tr><td>${f}</td><td>${t}</td><td>${b||''}</td></tr>`).join(''),sql=[lagring.d.tabSD(n),lagring.d.tabSC(n,r),lagring.d.tabSX(n,r)].join('\n');return fmt=='html'?`<table class="hidde" id="dTab_${n}"><caption>-- ${n} ${d} --</caption><tr><th>Felt</th><th>Type</th><th>Beskrivelse</th></tr>${rows}<tr><td colspan=3>${sql.replace(/\n/g,'<br>')}</td></tr></table>`:sql}
        ,tabN:(a,fmt='html')=>{let d=new Set(),o=[],f=n=>{if(d.has(n))return;let t=a.find(t=>t[0]==n);if(!t)return;t[2].forEach(r=>{let x=r.split(',')[0].trim();if(x.startsWith('id_'))f(x.slice(3));});o.push(lagring.d.tab(t[0], t[1], t[2], fmt));d.add(n)};a.forEach(([n])=>f(n));return o.join('')}
        ,erR:a=>a.flatMap(([from,_,rows])=>rows.map(r=>r.split(',')[0]).filter(f=>f.startsWith('id_')).map(f => ({from,to: f.slice(3)})))
        ,erNbox:a=>a.map(([id,l,_,[x,y,c]])=>`<div id=b_${id} style="position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);z-index:1;font-size:10pt;border:1px solid;padding:4px;max-width:120px;min-width:80px;width:max-content;text-align:center;background:${c}">${id}<br>${l}</div>`).join('')
        ,erNsvg:a=>{const s=document.getElementById('svgLayer'),p=s.createSVGPoint(),c=e=>{if(!e)return;const r=e.getBoundingClientRect(); p.x=r.left+r.width/2; p.y = r.top + r.height/2; return p.matrixTransform(s.getScreenCTM().inverse()) };s.innerHTML = `<defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="10" markerHeight="10" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="black"/></marker></defs>`+lagring.d.erR(a).map(({from,to})=>{const p1 = c(document.getElementById('b_'+from)),p2 = c(document.getElementById('b_'+to)),mx = (p1?.x + p2?.x)/2,my = (p1?.y + p2?.y)/2;return p1&&p2&&`<path d="M${p1.x} ${p1.y} L${mx} ${my} L${p2.x} ${p2.y}" stroke="black" fill="none" marker-mid="url(#arrow)"/>`;}).join('');}
        ,erN: a => (setTimeout(() => lagring.d.erNsvg(a),100),'<svg id=svgLayer style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none"></svg>' + lagring.d.erNbox(a))
    }
}

lagring.d.meta = [
    //bruk
    ['u', 'Bruker', lagring.d.t(['data,jsonb,div info']), [49,12,'#acf']]
    ,['us','Brukersesjon',lagring.d.t(['id_u,text,bruker','id_su,text,anvendelse','id_a,text,app','id_f,text,metode']),[50,24,'#acf']]
    ,['su','Anvendelse',lagring.d.t(['id_o,text,Ordre','id_u,text,Bruker som får tilgang','id_p,text,Produkt som anvendes','status,text,aktiv/inaktiv']),[32,18,'#acf']]
    //innhold
    ,['ac', 'Koder', lagring.d.t(['id_mor,text,Kodegruppering','id_u,text,bruker','data,jsonb,']), [69,5,'#9cf']]
    ,['m','Melding',lagring.d.t(['id_mor,text,Del av annen','id_us,text,sesjon','sendt,text,','mottatt,text,','id_f,text,funksjon']),[49.5,35,'#fbd']]
    //teknikk
    ,['h','Tilbyder',lagring.d.t(['Navn,text,eg Mistral','uri,text,','gunnars,text,','spm1,text,','spm2,text,']),[84,40,'#dff']]
    ,['f','Funksjonalitet',lagring.d.t(['id_h,text,','id_mor,text,Gruppering','Funksjon,text,Type funksjonalitet','modell,text,AI-modell','modellid,text,Teknisk navn']),[70,32,'#cfc']]
    ,['a','App',lagring.d.t(['App,text,Navn','mor,text,Kategori','mormor,text,Hovedkategori','id_f,text,metode','id_ac,text,','cfg,jsonb,config']),[75,21,'#cfc']]
    ,['ap','Prompt',lagring.d.t(['id_a,text,','id_ac,text,','line,int,Plassering','usr,text,Brukermelding','sys,text,Chatbotsvar']),[85,12,'#cfc']]
    //økonomi
    ,['o','Ordre',lagring.d.t(['id_mor,text,Ordre-gruppering','id_c,text,Kunde','id_p,text,Produkt','antall,int,Antall enheter','status,text,aktiv/avsluttet']),[15,25,'#fa6']]
    ,['p','Produkt',lagring.d.t(['navn,text,Navn på produktet','beskrivelse,text,Valgfritt','pris,int,I øre','valuta,text,Valuta som NOK, EUR']),[15,12,'#fc8']]
    ,['pay','Betaling',lagring.d.t(['id_o,text,','id_c,text,','amt,int,I øre','status,text,initiert / gjennomført / feilet','provider,text,f.eks. Stripe','ref,text,Ekstern referanse','dtBet,timestamptz,Betalingsdato']),[15,40,'#fa6']]
    ,['c','Kunde',lagring.d.t(['id_mor,text,morkunde','data,jsonb,div info']),[30,32,'#fc8']]
]

lagring.d.fyll = (n = 'ukjent') => {
    lagring.net.s('c', { id: `c_${n}_mor`, data: { type: `${n}test` } });
    lagring.net.s('c', { id: `c_${n}`, id_mor: `c_${n}_mor`, data: { type: `${n}test` } });
    lagring.net.s('p', { id: `p_${n}`, navn: `${n}produkt`, beskrivelse: `${n} testprodukt`, pris: 100000, valuta: 'NOK' });
    lagring.net.s('p', { id: `p_${n}_mrr`, navn: `${n}produkt MRR`, beskrivelse: `${n} med månedlig inntekt`, pris: 10000, valuta: 'NOK' });
    lagring.net.s('o', { id: `o_${n}`, id_c: `c_${n}`, id_p: `p_${n}_mrr`, antall: 1, status: 'aktiv' });
    lagring.net.s('pay', { id: `pay_${n}`, id_o: `o_${n}`, id_c: `c_${n}`, amt: 10000, status: 'gjennomført', provider: 'test', ref: `ref_${n}`, dtBet: new Date().toISOString() });
    lagring.net.s('u', { id: `u_${n}`, data: { navn: `${n}bruker` } });
    lagring.net.s('su', { id: `su_${n}`, id_o: `o_${n}`, id_u: `u_${n}`, id_p: `p_${n}_mrr`, status: 'aktiv' });
    lagring.net.s('us', { id: `us_${n}`, id_u: `u_${n}`, id_su: `su_${n}`, id_a: `a_${n}`, id_f: `f_${n}` });
    lagring.net.s('m', { id: `m_${n}`, id_mor: null, id_us: `us_${n}`, sendt: `${n} hei`, mottatt: `${n} svar`, id_f: `f_${n}` });
    lagring.net.s('h', { id: `h_${n}`, Navn: `${n}AI`, uri: `https://ai.${n}.no`, gunnars: 'abc123', spm1: 'Hva er neste?', spm2: 'Hva lurer du på?' });
    lagring.net.s('f', { id: `f_${n}`, id_h: `h_${n}`, id_mor: null, Funksjon: 'chat', modell: 'demo', modellid: 'demo-model' });
    lagring.net.s('a', { id: `a_${n}`, App: `${n}App`, mor: `${n}Kategori`, mormor: `${n}Hovedkategori`, id_f: `f_${n}`, cfg: { pilot: true } });
    lagring.net.s('ap', { id: `ap_${n}`, id_a: `a_${n}`, line: 1, usr: `${n} bruker`, sys: `${n} bot` });
};
//lagring.d.pilotC=n=>Object.keys(lagring.d.meta).forEach(t=>lagring.net.del(t, `like.${t}_${n}`));
//lagring.d.fyll('ukjent');

//lagring.idC.p('id=gorm9')
lagring.net.sel('a',console.warn)//lagring.net.del('a', {id:'123'}, console.warn);//lagring.net.del('a', {id:'1234'}, console.warn);//lagring.net.del('a', {id:'11234'}, console.warn);//lagring.net.upd('a', {id:'1234', App:'1234 Test'}, console.warn);//lagring.net.upd('a', {id:'11234', App:'11234 Test'}, console.warn);//lagring.net.sel('b,id,App', r => console.table(r));
//lagring.net.selA(console.warn)
//lagring.net.selAp(console.warn)//{"id": "ny", "App":"Ny", "mor":"Ny", "mormor":"Utvikling"}
