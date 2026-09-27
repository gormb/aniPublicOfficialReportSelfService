/* books.map – the word map: its store, its word cloud and the zoom map it is read in. Out of play, so any page can raise it.
   The page hands over the two sides it alone knows:
     books.map.host – the hierarchy: up{}, child(pl), id(i), ix(pl), mode(), names(pl), txtOf(pl,k,fb), hid(pl,i), L(pl),
                      go(i,keep,wide), texts{}, mdText(), fn(), and the reading app's own hands: esc, sentT, em, blink,
                      arrowBlink, nav, lang, wzUrl
                      and, when the page's levels differ from play's tree:
                      chain() – the levels the map may stand on, coarsest first (e.g. ['pl0','pl1','pl2'] inside a table of
                                contents, ['pl2','pl3','pl4a'] in the text). The last one is the end: there a pick navigates
                                through pick(pl,k,name) instead of drilling, and drilling finer stops.
                      fork(pl) – true when this level splits into the two spines a/b (default: pl3/pl4a/pl4b)
                      pick(pl,k,name) – navigate to what was picked (invoked only at the chain's end)
                      onShow()/onHide() – the page's own bookkeeping around the map going up or down
     books.map.Z.el – the controls the map drives: zoom, inv, bandCollapse, handPrev, handNext, levels, coarser, band, query, mic, page.
                      Give no band and the map builds its own overlay band, head strip and filter foot (books.map.css)
   See play.js wire() for the play-shaped wiring, LdD.js for the pdf-shaped one. */
(function(){
window.books=window.books||{};
const M=window.books.map={};
M.host={};
M.store={
    // word-map cache: memory → public.map → generate. what = filter (upper), wher = hierarchy id (lower).
    cache:{},fly:{}
    ,load:async(what,wher)=>{
        const s=M.store;if(!window.db)return null;
        const W=(what||'').toUpperCase(),R=(wher||'').toLowerCase(),k=await db.ww(W,R);
        if(s.cache[k])return s.cache[k];
        if(s.fly[k])return s.fly[k];
        return s.fly[k]=db.rpc('map_get',{what:W,wher:R}).then(d=>{if(d)s.cache[k]=d;delete s.fly[k];return d;},()=>{delete s.fly[k];return null;});}
    ,set:async(what,wher,words,par,sib)=>{
        const s=M.store;if(!window.db)return words;
        const W=(what||'').toUpperCase(),R=(wher||'').toLowerCase();
        s.cache[await db.ww(W,R)]=words;
        db.rpc('map_set',{what:W,wher:R,words,par,sib});
        return words;}
};
M.cloud={
    stop:/^(og|i|til|med|av|for|en|et|den|det|de|som|er|var|at|om|men|å|på|ikke|så|når|da|her|der|fra|ved|ut|inn|opp|ned|seg|kan|skal|vil|må|hadde|har|ble|blir|han|hun|jeg|du|vi|the|and|of|to|a|in|is|it|that|with|for|on|as|at|by|from|but|or|an|be|was|were|his|her|he|she|they|you|not)$/i
    ,score:w=>w[1]*w[0].length/(M.cloud.stop.test(w[0])?M.cloud.noise:1)   // frequency × length; noise words divided, so they lose the cut too
    ,prefer:(a,b)=>M.cloud.score(b)-M.cloud.score(a)||b[0].length-a[0].length||(a[0]<b[0]?-1:1)   // qsort-style: [word,count], >0 ⇒ a first
    ,words:(s,n,q)=>{const m={},f=String(q||'').toLowerCase();   // with a filter, only words matching it
        (String(s||'').toLowerCase().match(/[\p{L}][\p{L}'-]*/gu)||[]).forEach(w=>{if(f&&w.indexOf(f)<0)return;m[w]=(m[w]||0)+1;});
        return Object.keys(m).map(w=>[w,m[w]]).sort((x,y)=>y[1]-x[1]).slice(0,n||16);}
    ,tx:new Map()
    ,cut:(s,q)=>{const c=M.cloud,t=String(s||''),k=String(q||'').toLowerCase(),e=c.tx.get(t);
        if(e&&e.q===k)return e.t;
        const v=k?M.host.sentT(t).filter(x=>x.toLowerCase().indexOf(k)>=0).join(' '):t;
        c.tx.set(t,{q:k,t:v});return v;}
    ,html:(own,n)=>{                                  // per word [size,newness]: size = share across the siblings, green = introduced, blue = repeated before
        const a=Object.entries(own).sort((x,y)=>y[1][0]-x[1][0]).slice(0,n||16);
        if(!a.length)return '';const mx=a[0][1][0];
        return a.map(x=>'<span style="font-size:'+(0.75+0.85*x[1][0]/mx).toFixed(2)+'em;color:hsl('+Math.round(120+100*(1-x[1][1]))+',70%,25%)">'+M.host.esc(x[0])+'</span>').join('');}
    ,top:24                                            // words kept per cell (the cloud shows 24)
    ,noise:10                                          // stop words stay in the map but their share is divided by this – as if mentioned that much more across the siblings
    ,maps:async(pl,q,texts)=>{                        // ONE lookup per list; texts=[…] → [ {word:[size,newness]}, … ] – one element per cell, in cell order
        const c=M.cloud,id=M.host.hid(pl);
        let a=await M.store.load(q,id);
        if(Array.isArray(a)&&a.length===texts.length&&a.every(m=>Object.keys(m).length<=c.top&&Object.values(m).every(v=>Array.isArray(v))))return a;
        // each cell's map is made from that cell's own text, cut by the filter; the siblings of the list are the comparison
        const own=texts.map(t=>c.words(c.cut(t,q),Infinity,q)),tot={};
        own.forEach(ws=>ws.forEach(([w,n])=>tot[w]=(tot[w]||0)+n));
        const before={};a=own.map(ws=>{
            const v={};ws.forEach(([w,n])=>{v[w]=n/(n+(before[w]||0));before[w]=(before[w]||0)+n;});
            const keep=ws.slice().sort((x,y)=>c.prefer(x,y)).slice(0,c.top);   // the words the cloud prefers; fit() scales them by font size
            return Object.fromEntries(keep.map(([w,n])=>[w,[Math.round(n/(tot[w]*((!q&&c.stop.test(w))?c.noise:1))*100)/100,Math.round(v[w]*100)/100]]));});
        const na=M.host.names(pl),par=M.host.txtOf(pl,na[3]!=null?na[3]:0,'');   // par = this node's own text, sib = all its children's texts summed
        M.store.set(q,id,a,par,texts.join('\n'));
        return a;}
    ,df:{},dfFn:''
    ,dfOf:(b,q)=>{const c=M.cloud,k=b.key+'|'+(q||'');if(c.dfFn===k)return c.df;
        const m={};c.words(c.cut(b.txt,q),Infinity,q).forEach(x=>m[x[0]]=x[1]);c.dfFn=k;return c.df=m;}
    ,shelf:()=>{const ts=Object.values(M.host.texts||{}).filter(Boolean);return ts.length?ts.join(' '):M.host.mdText();}
    ,above:()=>{
        const up=M.host.up;let below=M.host.id(M.host.mode()),pl=up[below];
        while(pl&&(M.host.names(below)[0]||[]).length<2){below=pl;pl=up[pl];}
        const a=pl?M.host.names(pl):null,i=a?(a[3]||0):0;
        return {key:(pl||'pl0')+'|'+(a?String(a[1]||'').slice(0,24):'')+'|'+i+'|'+(M.host.fn()||''),
                txt:(pl?M.host.txtOf(pl,i,''):'')||M.cloud.shelf()};}
};
M.chain=()=>M.host.chain?M.host.chain():null;                                  // the levels this page may stand on, or null (play: its own tree)
M.end=()=>{const c=M.chain();return !!c&&c[c.length-1]===M.host.id(M.host.mode());};   // standing on the last one: a pick navigates, it does not drill
M.side=(pl,d)=>{const c=M.chain();if(c){const i=c.indexOf(pl);return i<0?null:c[i+d]||null;}
    return d>0?(M.host.child(pl)[0]||null):(M.host.up[pl]||null);};
M.sidecar=opt=>{   // a book whose .md sidecar says what is where in the .pdf, handed to the map as a hierarchy to walk:
    // '#### p. N' moves the page, '### ' a sub chapter, '## ' a main chapter, '# ' the title, every other line one paragraph.
    // The page gives what only it knows – prefix(), lg(), ed(), page(), toc(), copy(f), go(at) – and gets the whole host back.
    const langs=opt.langs||['NO','EN'],eds=opt.eds||['PREM','FREE']
        ,url=(lg,ed)=>opt.prefix()+'_'+(lg||opt.lg())+'_'+(ed||opt.ed())+'.md'
        ,files=()=>langs.flatMap(lg=>eds.map(ed=>({lg,ed,url:url(lg,ed)})))
        ,ICO=(lg,ed)=>(lg==='NO'?'\u{1F1F3}\u{1F1F4}':'\u{1F1EC}\u{1F1E7}')+(ed==='PREM'?'\u{1F451}':'\u{1F513}')
        ,LV=['pl0','pl1','pl2','pl3','pl4a']
        ,T={pl0:'Book Shelf',pl1:'Book Copy',pl2:'Main Chapter',pl3:'Sub Chapter',pl4a:'Paragraph'}
        ,slug=()=>opt.prefix().replace(/\/[^/]*$/,'').split('/').pop().toLowerCase().replace(/[^a-z0-9]+/g,'')
        ,S={raw:{},ch:0,su:0,pg:0,want:0,mode:1}
        ,P=()=>S.raw[url()]||{t:'',chapters:[]}
        ,cur=()=>{const p=P(),c=p.chapters[S.ch]||{subs:[]};return {p,c,s:c.subs[S.su]||{paras:[]}};}
        ,chap=x=>(x.subs||[]).map(s=>(s.paras||[]).map(y=>y.txt).join(' ')).join(' ')
        ,whole=p=>((p&&p.chapters)||[]).map(chap).join(' ')
        ,lab=f=>ICO(f.lg,f.ed)+' '+((S.raw[f.url]||{}).t||(opt.title?opt.title():'')||'')
        ,ci=()=>{const i=files().findIndex(f=>f.lg===opt.lg()&&f.ed===opt.ed());return i<0?0:i;}
        ,go=n=>{S.mode=n;M.Z.nav.redraw();};
    let host;   // the host object, filled in below once S is complete
    // every level is given at least one entry, so the step below it always has something to pick: a chapter without subs is
    // its own sub, a sub without paragraphs its own paragraph – both carry the heading, which is also what a pick leads to
    S.parse=txt=>{
        const o={t:'',chapters:[]};let page=1,ch=null,su=null,m;
        for(const raw of String(txt||'').split(/\r?\n/)){
            const s=raw.trim();if(!s)continue;
            if(m=/^#{3,4}\s*p\.\s*(\d+)\s*$/i.exec(s)){page=+m[1];continue;}
            if(m=/^(#{1,3})\s+(.*)$/.exec(s)){
                const t=m[2].trim().replace(/\s*(?:—|–)\s*p\.\s*\d+\s*$/i,'');
                if(m[1].length===1){o.t=o.t||t;continue;}
                if(m[1].length===2){ch={t,page,subs:[]};o.chapters.push(ch);su=null;continue;}
                if(!ch){ch={t:'',page,subs:[]};o.chapters.push(ch);}
                su={t,page,paras:[]};ch.subs.push(su);continue;
            }
            if(/^\u{1F3B5}/u.test(s))continue;                                   // 🎵 the song line is a link, not text
            if(!ch){ch={t:'',page,subs:[]};o.chapters.push(ch);}
            if(!su){su={t:ch.t,page:ch.page,paras:[]};ch.subs.push(su);}
            su.paras.push({t:s,page,txt:s});
        }
        o.chapters.forEach(c=>{if(!c.subs.length)c.subs.push({t:c.t,page:c.page,paras:[{t:c.t,page:c.page,txt:c.t}]});});
        o.chapters.forEach(c=>c.subs.forEach(s=>{if(!s.paras.length)s.paras.push({t:s.t,page:s.page,txt:s.t});}));
        return o;};
    S.load=async f=>{if(S.raw[f])return S.raw[f];
        try{const r=await fetch(f,{cache:'no-store'});if(!r.ok)return null;return S.raw[f]=S.parse(await r.text());}catch(e){return null;}};
    S.redraw=()=>{if(M.Z.on)M.Z.nav.redraw();};
    S.warm=async()=>{await S.load(url());S.redraw();                              // the copy being read now, the others after it
        for(const f of files())if(f.url!==url())await S.load(f.url);
        S.redraw();};
    S.sync=()=>{const p=P(),pn=opt.page()||1;let ch=0,su=0;                      // the deepest heading at or before this page
        p.chapters.forEach((c,i)=>{const j=(c.subs||[]).reduce((a,s,k)=>s.page<=pn?k:a,-1);if(c.page<=pn&&j>=0){ch=i;su=j;}});
        S.ch=ch;S.su=su;S.pg=0;};
    S.q=(t,n)=>String(t||'').toLowerCase().replace(/\s+/g,' ').trim().split(' ').slice(0,n||4).join(' ');
    host={
        chain:()=>opt.toc()?['pl0','pl1','pl2']:['pl2','pl3','pl4a']
        ,fork:()=>false                                              // the text spine only – no page/paragraph fork
        ,up:{pl1:'pl0',pl2:'pl1',pl3:'pl2',pl4a:'pl3'}
        ,child:pl=>({pl0:['pl1'],pl1:['pl2'],pl2:['pl3'],pl3:['pl4a'],pl4a:['pl4a']}[pl]||[])
        ,id:i=>LV[i]||'pl0',ix:pl=>Math.max(0,LV.indexOf(pl)),mode:()=>S.mode,L:pl=>({pl,t:T[pl]||pl}),go
        ,names:pl=>{
            const {p,c,s}=cur(),C=files();
            return ({
                pl0:[[opt.lg()+opt.ed()],opt.lg()+opt.ed(),()=>{},0]
                ,pl1:[C.map(lab),lab(C[ci()]),t=>{const i=C.findIndex(f=>lab(f)===t);if(i>=0)S.want=i;},ci()]
                ,pl2:[p.chapters.map(x=>x.t),(p.chapters[S.ch]||{}).t||'',t=>{const i=p.chapters.findIndex(x=>x.t===t);if(i>=0)S.ch=i;},S.ch]
                ,pl3:[c.subs.map(x=>x.t),(c.subs[S.su]||{}).t||'',t=>{const i=c.subs.findIndex(x=>x.t===t);if(i>=0)S.su=i;},S.su]
                ,pl4a:[s.paras.map(x=>x.t),(s.paras[S.pg]||{}).t||'',t=>{const i=s.paras.findIndex(x=>x.t===t);if(i>=0)S.pg=i;},S.pg]
            })[pl]||[[''],'',()=>{},0];
        }
        ,txtOf:(pl,k,fb)=>{
            const {p,c,s}=cur();
            const t=pl==='pl0'?whole(p)
                :pl==='pl1'?whole(S.raw[(files()[k]||{}).url])
                :pl==='pl2'?chap(p.chapters[k]||{})
                :pl==='pl3'?chap(c.subs[k]||{})
                :pl==='pl4a'?((s.paras[k]||{}).txt||'')
                :undefined;
            return t!==undefined?t:(fb||'');
        }
        ,hid:pl=>{const D=[slug(),opt.lg()+opt.ed(),S.ch,S.su];
            return (pl==='pl0'?D.slice(0,1):pl==='pl1'?D.slice(0,2):pl==='pl2'?D.slice(0,3):D).join('.');}
        ,pick:async pl=>{
            if(pl==='pl1'){await opt.copy(files()[S.want]);await S.load(url());S.sync();S.mode=1;return S.redraw();}
            const {p,c,s}=cur(),at=pl==='pl2'?p.chapters[S.ch]:pl==='pl3'?c.subs[S.su]:s.paras[S.pg];
            if(at&&at.page!=null)await opt.go(at);
        }
        ,esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
        ,sentT:s=>(String(s||'').match(/[^.!?\u2026]+[.!?\u2026]+["'\u201D\u2019\u00BB]?|\S[^.!?\u2026]*$/g)||[]).map(x=>x.trim()).filter(Boolean)
        ,em:()=>parseFloat(getComputedStyle(document.documentElement).fontSize)||1
        ,blink:(el,n)=>{if(!el)return;el.classList.remove('blink');void el.offsetWidth;el.style.animationIterationCount=String(n||1);el.classList.add('blink');}
        ,arrowBlink:d=>host.blink(d?M.Z.el.finer:M.Z.el.coarser,1)
        ,nav:d=>M.Z.walk(d)
        ,texts:S.raw,mdText:()=>'',fn:url
        ,get lang(){return opt.lg();}
        ,onShow:()=>{S.sync();S.mode=opt.toc()?1:3;
            if(!S.raw[url()])S.load(url()).then(()=>S.redraw());}
    };
    return {host,warm:S.warm,sync:S.sync,load:S.load,q:S.q,redraw:S.redraw,files,par:S.raw};
};
M.Z={
    ov:null,m:0,t:0,sp:'b',q:'',inv:0,invKey:'play.zoom.invert'
    ,el:{}
    ,box:()=>M.Z.ov||(M.Z.ov=Object.assign(document.body.appendChild(document.createElement('div')),{id:'semOv'}))
    ,on:0,pin:0,key:0,mod:0,rt:0
    ,zb:()=>{const on=M.Z.on,e=M.Z.el.zoom;e.textContent=on?'\u2299':'\u25CE';e.title=on?'Collapse the word map back into its band':'Expand the word map over the reading area';}
    ,ib:()=>{const i=M.Z.inv,e=M.Z.el.inv;
        e.classList.toggle('on',!!i);e.title='Zoom: '+(i?'up':'down')+' means into the detail – the two-finger pinch and ↑/↓ alike. Click to turn it round.';}
    ,head:{
        el:null,back:[]
        ,ids:['zmUp','zmLv','lvCtl','prev','next','nvMic','hiId','zmT','zmI']
        ,into:()=>{const h=M.Z.head;if(h.back.length)return;h.el=document.getElementById('zmHead');if(!h.el)return;
            h.ids.forEach(id=>{const n=document.getElementById(id);if(!n)return;h.back.push([n,n.parentElement,n.nextSibling]);h.el.appendChild(n);});}
        ,out:()=>{const h=M.Z.head;for(let i=h.back.length-1;i>=0;i--){const b=h.back[i];b[1].insertBefore(b[0],b[2]);}h.back=[];}
    }
    ,show:()=>{const z=M.Z,e=z.el;if(z.on)return;z.on=1;M.host.wzUrl&&M.host.wzUrl(1);z.pin=0;z.box().style.display='block';document.body.classList.add('zoom');
        [e.handPrev,e.handNext,e.coarser,e.levels].forEach(el=>{if(el&&M.host.blink)M.host.blink(el,3);});
        M.host.onShow&&M.host.onShow();
        z.nav.swap();z.head.into();z.nav.redraw();z.zb();}
    ,hide:()=>{const z=M.Z;if(!z.on)return;z.on=0;M.host.wzUrl&&M.host.wzUrl(0);z.head.out();
        z.nav.tk='';
        if(z.ov)z.ov.style.display='none';z.m=z.t=0;document.body.classList.remove('zoom');
        z.nav.redraw();z.zb();M.host.onHide&&M.host.onHide();}
    ,enter:()=>M.Z.show()
    ,nav:{
        el:null,last:'',tk:'',seq:0
        ,box:()=>M.Z.nav.el
        ,label:()=>{const L=M.host.L(M.host.id(M.host.mode()));return (L.pl||'')+' '+L.t+' Selection';}
        ,areas:async()=>{
            const e=M.host.esc,pl=M.host.id(M.host.mode()),sp=M.Z.sp,q=M.Z.q
                ,fork=M.host.fork?M.host.fork(pl):(pl==='pl3'||pl==='pl4a'||pl==='pl4b'),kids=fork?['pl4'+sp]:M.host.child(pl)
                ,fd=(fork&&pl==='pl3')
                    ?['b','a'].map(t=>'<button type="button" data-sp="'+t+'"'+(sp===t?' disabled':'')+'>'+e((M.host.L('pl4'+t)||{}).t||('pl4'+t))+'</button>').join('')
                    :''
                ,cols=kids.map(c=>{const a=M.host.names(c);return {c,a,ns:a[0]||[]};})
                ,cells=[];cols.forEach(x=>x.ns.forEach((n,k)=>{if(n!=='')cells.push(M.host.txtOf(x.c,k,n));}))
                ,maps=await M.cloud.maps(pl,q,cells)
                ,it=0
                ,grp=cols.map(x=>{const rows=x.ns.map((n,k)=>{if(n==='')return '';const h=M.cloud.html(maps[it++],24)
                        ,on=(pl==='pl4a'||pl==='pl4b')&&k===x.a[3]
                        ,cl=h||q;
                        return '<div class="nvA'+(on?' on':'')+(cl?' nvC':'')+'" data-k="'+x.c+'|'+k+'"><span class="nvT">'+e(n)+'</span>'+(cl?'<div class="nvW">'+h+'</div>':'')+'</div>';}).join('');
                    if(!rows)return '';const cnt=x.ns.filter(n=>n!=='').length
                        ,grid=cnt>6?'<div class="nvR'+(cnt>14?' r3':'')+'">'+rows+'</div>':rows;
                    return '<div class="nvGrp">'+((fd||q)?'<div class="nvG'+(pl==='pl3'?' nvS':'')+'">'+fd+M.Z.nav.tq(q,!!fd)+'</div>':'')+grid+'</div>';}).join('');
            return grp?'<div class="nvAreas">'+grp+'</div>':'';}
        ,tq:(q,dash)=>q?(dash?' – ':'')+'"'+M.host.esc(q)+'"':''
        ,applyQ:()=>{const n=M.Z.nav;if(n.qEl&&n.qEl.value!==M.Z.q)n.qEl.value=M.Z.q;n.redraw();}
        ,mk:()=>window.SpeechRecognition||window.webkitSpeechRecognition
        ,lastWord:s=>{const a=String(s||'').replace(/[^\p{L}\p{N}'-]+/gu,' ').trim().split(/\s+/).filter(Boolean);return a.length?a[a.length-1]:'';}
        ,speak:btn=>{
            const z=M.Z,n=z.nav,R=n.mk();if(!R)return;
            if(z.rec){try{z.rec.stop();}catch(e){}z.rec=null;btn.classList.remove('on');return;}
            const r=z.rec=new R();
            r.lang=M.host.lang==='NO'?'nb-NO':'en-GB';r.continuous=!0;r.interimResults=!1;
            r.onresult=e=>{let s='';for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)s+=e.results[i][0].transcript;
                const w=n.lastWord(s);if(w){if(n.qEl)n.qEl.value='';z.q=w;n.applyQ();}}
            r.onerror=()=>{z.rec=null;btn.classList.remove('on');};
            r.onend=()=>{z.rec=null;btn.classList.remove('on');};
            try{r.start();}catch(e){z.rec=null;return;}
            btn.classList.add('on');
        }
        ,mic:on=>{
            const z=M.Z,n=z.nav;if(!n.micEl)return;
            if(on!==!!z.rec)n.speak(n.micEl);}
        ,keyQ:e=>{
            const z=M.Z,n=z.nav,qEl=n.qEl,k=e.key,own=qEl&&document.activeElement===qEl;
            if(k==='Backspace'){if(own)return 0;z.q=z.q.slice(0,-1);}
            else if(k.length===1&&k!==' '&&!e.metaKey&&!e.altKey&&!(own&&!e.ctrlKey))z.q+=k;
            else return 0;
            n.applyQ();
            return 1;}
        ,go:(c,k)=>{const a=M.host.names(c),n=(a[0]||[])[k];if(!n)return;a[2](n);
            if(M.end()&&M.host.pick)return M.host.pick(c,k,n);   // on the chain's end a pick leads there – it does not drill
            M.host.go(M.host.ix(c),true);}
        ,pickK:k=>{const p=String(k||'').split('|');if(p[0])M.Z.nav.go(p[0],+p[1]);}
        ,pick:el=>M.Z.nav.pickK(el.dataset.k)
        ,pair:()=>{const z=M.Z,n=z.nav,p=n.tk;n.tk='';if(p)z.nav.pickK(p);z.hide();}
        ,body:async()=>(await M.Z.nav.areas())||'<h2>'+M.host.esc(M.Z.nav.label())+M.Z.nav.tq(M.Z.q,1)+'</h2>'
        ,base:()=>document.body.classList.contains('zoom')?1:.6
        ,collapsed:()=>!document.body.classList.contains('zoom')
        ,hm:a=>{
            const b=M.Z.nav.base(),e=M.host.em();
            a.forEach(w=>{w.style.fontSize=b+'em';w.style.bottom='auto';w.style.height='auto';});
            const h=a.map(w=>Math.max(e,w.scrollHeight));
            a.forEach(w=>{w.style.bottom='';w.style.height='';});
            return h;}
        ,room:w=>{const c=w.parentElement,e=M.host.em();
            return Math.max(e,(M.Z.nav.collapsed()?Math.min(c.clientWidth,c.clientHeight):c.clientHeight)-e/4);}
        ,fit:()=>{
            const n=M.Z.nav,a=[...n.el.querySelectorAll('.nvW')];if(!a.length)return;
            const h=n.hm(a);
            a.forEach((w,i)=>{const k=n.room(w)/h[i];if(k>=1)return;
                const keep=Math.max(2,Math.round(w.childElementCount*k));
                while(w.childElementCount>keep)w.removeChild(w.lastChild);});
            const h2=n.hm(a);
            a.forEach((w,i)=>{const s=n.room(w)/h2[i];
                if(s<1)w.style.fontSize=(n.base()*Math.max(.4,s)).toFixed(2)+'em';});
        }
        ,draw:async()=>{const n=M.Z.nav;if(!n.el)return;const s=++n.seq,h=await n.body();if(s!==n.seq||h===n.last)return;n.last=h;n.el.innerHTML=h;n.fit();}
        ,redraw:()=>{const n=M.Z.nav;n.last='';n.draw();}
        ,swap:()=>{
            const n=M.Z.nav,z=M.Z,p=z.el.band;
            if(!n.el){
                p.innerHTML='<div id="zmHead"></div><div id="semNav"></div>';
                n.el=p.querySelector('#semNav');
                const qf=z.el.query;
                qf.innerHTML='<input id="nvQ" type="text" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" enterkeyhint="search" placeholder="filter the text to map">';
                n.qEl=qf.querySelector('#nvQ');
                const mic=n.micEl=z.el.mic;   // beside the hands: it travels with them into the zoom head
                n.el.onclick=ev=>{const s=ev.target.closest('[data-sp]');
                    if(s&&!s.disabled){z.sp=s.dataset.sp;n.redraw();return;}
                    const x=ev.target.closest('[data-k]'),k=x?x.dataset.k:'';
                    if(ev.detail>1){z.nav.pair();return;}
                    if(!k)return;n.tk=k;z.nav.pickK(k);if(z.pin)z.hide();};
                n.el.ondblclick=()=>z.nav.pair();
                n.qEl.oninput=()=>{z.q=n.qEl.value;n.redraw();};
                if(n.mk()){
                    mic.onclick=e=>{if(!e.ctrlKey&&!e.metaKey&&!e.altKey)n.mic(!z.rec);};
                    mic.onmouseenter=()=>{if(z.on&&z.key)n.mic(!z.rec);};
                }else mic.hidden=1;
                p.classList.add('navon');document.body.classList.add('navon');
            }n.draw();}
    }
    ,jump:()=>{const z=M.Z,h=document.querySelector('#semNav .nvA:hover');if(!h)return;z.nav.pick(h);z.hide();}
    ,walk:d=>{const pl=M.host.id(M.host.mode()),a=M.host.names(pl),k=(a[3]||0)+d;
        if(k<0||k>=(a[0]||[]).length)return;
        if(M.host.walk)return M.host.walk(d,k,a);
        a[2](a[0][k]);
        if(M.end()&&M.host.pick)return M.host.pick(pl,k,a[0][k]);
        M.Z.nav.redraw();}
    ,drill:(d,alt,wide)=>{const z=M.Z;
        if(d>0){const h=document.querySelector('#semNav .nvA:hover');if(h)return z.nav.pick(h);}
        const pl=M.host.id(M.host.mode());
        if(M.chain()){const k=M.side(pl,d>0?1:-1);if(!k)return;return M.host.go(M.host.ix(k),0,wide&&d<0);}
        const ks=M.host.child(pl)
            ,k=d>0?(ks.length>1?'pl4'+(alt?(z.sp==='a'?'b':'a'):z.sp):ks[0]):M.host.up[pl];
        if(!k)return;
        const t=M.host.names(k),i=d>0?t[3]:-1;
        if(i>=0&&(t[0]||[])[i])return z.nav.go(k,i);
        M.host.go(M.host.ix(k),0,wide&&d<0);}
    ,zoom:d=>{const o=M.Z.inv?-d:d;M.Z.drill(o>0?1:-1,null,o>0?0:1);}
    ,build:()=>{   // no host band → the map brings its own: overlay band, head strip, filter foot (books.map.css)
        const z=M.Z,e=z.el
            ,mk=(t,tip,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.title=tip;b.onclick=fn;return b;}
            ,band=document.createElement('div'),head=document.createElement('div');
        band.id='semBand';band.className='semBand';
        e.band=document.createElement('div');e.band.id='semBody';
        head.className='semHead';
        e.coarser=mk('\u{1F52D}','Coarser – the whole',()=>z.drill(-1));
        e.finer=mk('\u{1F52C}','Finer – into the detail',()=>z.drill(1));
        e.handPrev=mk('\u{1FAF2}','Previous in this level',()=>z.walk(-1));
        e.handNext=mk('\u{1FAF1}','Next in this level',()=>z.walk(1));
        e.mic=mk('\u{1F3A4}','Speak a word – the text is cut by it',()=>{});
        e.inv=mk('\u21C4','Zoom: down means into the detail; click to turn it round',()=>{});
        e.zoom=mk('\u25CE','Leave the map (Esc)',()=>{});
        e.bandCollapse=mk('\u2912','Collapse the map',()=>{});
        head.append(e.coarser,e.finer,e.handPrev,e.handNext,e.mic,e.inv,e.zoom,e.bandCollapse);
        e.levels=document.createElement('span');
        e.query=document.createElement('div');e.query.className='semFoot';
        band.append(head,e.band,e.query);document.body.appendChild(band);
        z.head.ids=[];   // the built head is already home – nothing to lend in
    }
    ,init:()=>{
        const z=M.Z,page=()=>z.el.page
            ,dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY)
            ,zone=t=>page().contains(t)||!!(z.nav.el&&z.nav.el.contains(t));
        if(!z.el.band)z.build();
        z.el.zoom.onclick=()=>{z.on?z.hide():z.show();};z.zb();
        try{z.inv=localStorage.getItem(z.invKey)==='1'?1:0;}catch(e){}
        z.el.inv.onclick=()=>{z.inv=z.inv?0:1;try{localStorage.setItem(z.invKey,z.inv?'1':'0');}catch(e){}z.ib();};z.ib();
        z.el.bandCollapse.onclick=()=>{if(!z.on)return;if(z.q){z.q='';z.nav.applyQ();}else z.hide();};
        let base=0,sx=0,sy=0,sw=0,acc=0,at=0;
        document.onkeydown=e=>{
            if(e.key==='Control'||e.key==='Shift'){
                z.key=e.ctrlKey&&e.shiftKey?1:0;
                if(z.key&&!z.mod){z.mod=1;if(z.on)z.hide();else z.enter();}
                return;}
            if(!z.on||(e.ctrlKey&&!e.shiftKey))return;
            const k=e.key;
            if(k==='Enter'){e.preventDefault();z.jump();}
            else if(k==='Escape'){if(z.q){z.q='';z.nav.applyQ();}else z.hide();}
            else if(k==='ArrowLeft' ||k===','||k==='<'){e.preventDefault();M.host.nav(-1);}  
            else if(k==='ArrowRight'||k==='.'||k==='>'){e.preventDefault();M.host.nav(1);}  
            else if(k==='ArrowUp'  ){e.preventDefault();z.drill(z.inv?1:-1);M.host.arrowBlink(0);}
            else if(k==='ArrowDown'){e.preventDefault();z.drill(z.inv?-1:1,e.altKey);M.host.arrowBlink(1);}
            else if(k==='='||k==='+'){e.preventDefault();z.drill(1,e.altKey);}  
            else if(k==='-'||k==='_'){e.preventDefault();z.drill(-1);}
            else if(z.nav.keyQ(e))e.preventDefault();
        };
        document.onkeyup=e=>{if(e.key==='Control'||e.key==='Shift'){z.key=e.ctrlKey&&e.shiftKey?1:0;z.mod=0;}};
        document.onmousedown=e=>{if(e.buttons===3&&page().contains(e.target)){z.m=1;z.enter();}};
        document.onmouseup=e=>{if(z.m&&e.buttons<3)z.hide();};
        document.addEventListener('touchstart',e=>{
            if(!zone(e.target))return;
            if(e.touches.length>1){z.t=1;sw=0;z.pin=0;base=dist(e.touches);z.enter();}
            else if(e.touches.length===1){sw=1;sx=e.touches[0].clientX;sy=e.touches[0].clientY;}
        },{passive:true});
        document.addEventListener('touchmove',e=>{
            if(!z.t||e.touches.length<2)return;
            if(e.cancelable)e.preventDefault();
            const d=base?dist(e.touches):0;
            if(d&&d/base>=1.35){base=d;z.pin=1;z.zoom(1);}               
            else if(d&&d/base<=0.74){base=d;z.pin=1;z.zoom(-1);}         
        },{passive:false});
        document.addEventListener('touchend',e=>{
            if(z.t&&e.touches.length<2)z.t=0;
            if(sw&&!e.touches.length){
                const t=e.changedTouches[0]||{clientX:sx,clientY:sy},dx=t.clientX-sx,dy=t.clientY-sy;sw=0;
                if(Math.abs(dx)>48&&Math.abs(dx)>2*Math.abs(dy))M.host.nav(dx<0?1:-1);
            }
        },{passive:true});
        document.addEventListener('wheel',e=>{
            if(!e.ctrlKey||!zone(e.target))return;
            if(e.cancelable)e.preventDefault();
            const now=Date.now();if(now-at>400)acc=0;at=now;
            acc+=e.deltaY;
            if(Math.abs(acc)>=25){z.zoom(acc>0?-1:1);acc=0;}
        },{passive:false});
        window.addEventListener('blur',()=>{z.key=z.mod=0;z.hide();});
        window.addEventListener('resize',()=>{if(!z.nav.el)return;clearTimeout(z.rt);z.rt=setTimeout(()=>z.nav.redraw(),120);});
    }
};
})();

