/////////////// ui //////////////
const ui = {
    init:e=>{ 
        ui.c.Input.addEventListener('keydown',(e)=>ui.e.Input_keydown(e));
        ui.c.Input.addEventListener('input',(e)=>ui.e.Input_adjustHeight());
        ui.c.Speak.addEventListener('click',()=>msgSendSpeak());
        ui.c.Send.addEventListener('click',()=>msgSend());
        ui.c.Lagres&&(ui.c.Lagres.addEventListener('click',()=>menuClick_m_lagreinnhold())^setTimeout(()=>ui.visLagre(),1000));
        document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>window.scrollTo(0, 1), 250));
        setTimeout(()=>window.scrollTo(0, 1), 250);
    }
   , c: {
        Chat: document.querySelector('main')
        , Menu: document.querySelector('#menu')
        , Header: document.querySelector('#header')
        , HeaderTitle: document.querySelector('#title')
        , Lagres: document.querySelector('header span')
        , Grubling: document.querySelector('#grubling')
        , Suggestions: document.querySelector('#suggestions')
        , Suggest: document.querySelector('.suggest')
        , Input: document.querySelector('footer textarea')
        , Speak: document.querySelector('#speak')
        , Send: document.querySelector('#send')
        , ImgQ: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Human_balance.png'
        , ImgQClick: e => {
            let r=e.target.closest('.row');
            while(r.nextElementSibling)
                r.nextElementSibling.remove();
            ui.e.Input_setValue(r.querySelector('.msg')?.textContent); 
            ui.c.Input.focus();
            ui.c.Input.select();
            r.remove();
        }
        , ImgA:'https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg'
        , ImgAClick: e => { let r=e.target.closest('.row'); while(r.nextElementSibling) r.nextElementSibling.remove(); msgSend(); ui.c.Input.focus(); }
        , ImgAVugg:(v,t)=>document.head.appendChild(document.createElement('style')).innerHTML=`@keyframes rock{0%,100%{transform:rotate(0deg);}25%{transform:rotate(${v}deg);}75%{transform:rotate(-${v}deg);}}.rotating{display:inline-block;animation:rock ${t}s ease-in-out infinite;}`
        , ImgAFlag:(v,t) =>document.head.appendChild(document.createElement('style')).innerHTML=`@keyframes flagWaving {0% { transform: translateX(0)skewX(0deg);}50%{transform:translateX(-1px) skewX(-${v}deg);}100%{transform:translateX(0) skewX(0deg); }}.rotating {display: inline-block;animation: flagWaving ${t}s ease-in-out infinite;}`
        , ImgARoter:t=>document.head.appendChild(document.createElement('style')).innerHTML=`@keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } };}.rotating { display: inline-block; animation: rotate ${t}s linear infinite; }`
        , ImgAReset:(i='https://upload.wikimedia.org/wikipedia/commons/2/26/Noun-artificial-intelligence-884535.svg')=>ui.c.ImgARoter(10)^(ui.c.ImgA=i)
        , ImgH: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Point.svg'
        , ImgHClick:e=>e.target.parentElement.parentElement.remove()
        , ImgDiceU: ['https://upload.wikimedia.org/wikipedia/commons/', '1/1b/Dice-1-b.svg', '5/5f/Dice-2-b.svg','b/b1/Dice-3-b.svg','f/fd/Dice-4-b.svg','0/08/Dice-5-b.svg','2/26/Dice-6-b.svg', '9/99/Dice-0.svg']
        , ImgDice:i=>`<img class="icon dice" src="${ui.c.ImgDiceU[0]+ui.c.ImgDiceU[i||7]}">`
        , ImgSpaceRemove:()=>document.querySelector('.space')?.remove()
        , ImgSpaceAppend:()=>ui.c.Chat.lastElementChild.innerHTML+=`<img class="icon space" src="${ui.c.ImgDiceU[0]+ui.c.ImgDiceU[7]}">`    
        , tRotating: '<div class="rotatingC">&#8634</div>'
    }
    ,e:{
        Input_keydown:e=>e.key==='Enter'&&!e.shiftKey&&!e.ctrlKey?msgSend():e.key==='Escape'?ui.e.Input_setValue(''):0
        ,Input_adjustHeight:()=> (ui.c.Input.style.height='auto')^
            (ui.c.Input.style.height=Math.min(ui.c.Input.scrollHeight,4.6*parseFloat(getComputedStyle(ui.c.Input).lineHeight))+'px')^
            (ui.c.Suggest&&(ui.c.Suggest.style.bottom=ui.c.Input.offsetHeight+4+'px'))
        ,Input_setValue:v=>(ui.c.Input.value=v)^(ui.e.Input_adjustHeight())
    }
    , SuggestI:0
    , SuggestTimeout:5000
    , Suggest:i=>{
        ui.SuggestI=i??ui.SuggestI;
        if (!ui.SuggestI) // tøm forslag og vis
        {
            ui.Show(ui.c.Suggestions, true)
            ui.c.Suggestions.innerHTML = "";
        }
        if (ui.SuggestI<3){ // Forslag 1-2-3
            let b = document.createElement("div"), sg=ai.SugQ[0];
            b.innerHTML = '<span class="row rotatingC">&#8634</span>';
            b.classList.add('msg');b.classList.add('forslag');
            b.onclick = () => msgSend(b.innerText);
            ui.c.Suggestions.appendChild(b);
            ai.History[2] = ai.History[0];
            ai.Request(sg[i<2?0:1], b, 2, ()=>
                setTimeout(()=>ui.Suggest(++ui.SuggestI), ui.SuggestTimeout)
            );
        }
    }    
    , visLagre:e=>{
        l = lagring.aktiv;
        ui.c.Lagres.innerHTML = ['&nbsp;&nbsp;🔒&nbsp;&nbsp;lagres ikke', '&nbsp;&nbsp;💾&nbsp;&nbsp;lagres lokalt', '&nbsp;&nbsp;☁️&nbsp;&nbsp;nettlagret'][l]
        return ui.menu.EBold('lagreinnhold', lagring.aktiv>0);
    }
    , Show: (el,b) => (el.classList.toggle('hidden', !(b ?? el.classList.contains('hidden'))), !!b)
    , _sizeI: 0,
    ChangeFontSize() {
      document.documentElement.style.setProperty('--font-size', ['medium','x-large','xx-large','xx-large','medium'][++this._sizeI % 5]);
      document.body.classList.toggle('dark-mode', this._sizeI % 5 > 2);
    }
    ,font:{n:f=>(document.head.appendChild(Object.assign(document.createElement('link'),{href:`https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}&display=swap`,rel:'stylesheet'})),document.documentElement.style.setProperty('--font-family',`'${f}'`),f)}
    , menu : {
        AsArray (mStr) { // create hierarchy from | || ||| string
            m=[], p=[0,0,0,0,0];
            mStr.replace(/\|/g, (m,i,s) => s[i-1]=='|' ?m:'\n').split('\n').forEach((r,i)=>{
                t=r.replace(/^\|+/, '');
                l=r.length-t.length;
                p[l]=i;
                m.push({i:i, l:l, p:l?p[l-1]:null, t:t.replace(ai.ConfigPipeReplace,'|'), c:[]}); // add menu item to array
            });
            m.forEach((mi) => { if (mi.l) m[mi.p].c.push(mi);});
            return m.filter(mi=>!mi.l);
        }
        , X: mt => mt.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        , Id: mt => 'm_'+ui.menu.X(mt)
        , Fn: mt => 'menuClick_' + ui.menu.Id(mt)
        , E : mt => document.getElementById(ui.menu.Id(mt)) || console.warn(`ui.menu.E: ${ui.menu.Id(mt)} finnes ikke`)
        , EFeat : (mt,b,f) => {
            let e=ui.menu.E(mt)
            if (b==null) b = !e.classList.contains(f);
            if (b==true) e?.classList.add(f);
            else e?.classList?.remove(f);
            return b;
        }
        , EBold : (mt,b=null) => ui.menu.EFeat(mt,b,'bold')
        , EBoldOnly : (mt, mtA) => {
            mtA.forEach(m => ui.menu.EBold(m, false));
            return ui.menu.EBold(mt, true);
        }
        , EHide : (mt,b=null) => ui.menu.EFeat(mt,b,'hidden')        
        , Toggle:m=>[...m.parentElement.children].forEach(i=>i.classList.contains("menu-item")||ui.Show(i, i==m?null:false))
        , HtmlAddItem: (m, i) =>{ // create html for menu item and children
            let mi=m[i], mSplit=mi.t.split('§'), mt=mSplit[0].trim(), mo=mSplit[1], b='&nbsp;'.repeat(mi.l*6)
            , dX=mi.t.split('§§').slice(1).map((d, i)=>`data-d${i}='${d.replace(/\'/, /\'\'/)}'`).join(' '); // Generate data attributes
            if (!mi.c.length) // no children
                return `<div id='${ui.menu.Id(mt)}' ${dX?dX:''} class='menu-item${mo=='*'?' bold':''}' onclick="menuClickLeaf(event)">${b+mt}</div>`;
            let h=`${mi.i && !mi.l?'<hr/>':''}<div class='menu-item' onclick='ui.menu.Toggle(mc${mi.i})'>${b+mt}</div>`;
            h+=`<div id="mc${mi.i}" ${dX?dX:''}${mo=='-'?' class="hidden"':''}>`;
            for (let iS=0; iS<mi.c.length; iS++)
                h+=ui.menu.HtmlAddItem(mi.c, iS);
            h+='</div>'
            return h;
        }
        , Reset:ver=> {
            ui.c.Menu.innerHTML = ui.menu.AsArray(setting.menu(ver)).map((_, i) => ui.menu.HtmlAddItem(ui.menu.AsArray(setting.menu(ver)), i)).join('')
            document.addEventListener('click', e => { if (!document.getElementById('menu').contains(e.target) && !document.getElementById('header').contains(e.target)) ui.menu.Show(false); });
            return ui.c.Menu;
        }
        , Show : b => ui.Show(ui.c.Menu, b)
        , SelectModel:(id,i=0)=>{
            ui.menu.EBoldOnly(id, ai.AllModels(i))
            const c=document.getElementById(ui.menu.Id(id)), d=c.dataset, pd=c.parentElement.dataset;
            lagring.setAi(i,id);
            ai.Model[i]=d.d0;
            ai.Url[i]=pd.d0;
            ai.SugQ[i][0]=pd.d2;
            ai.SugQ[i][1]=pd.d3;
            ai.Gunnar[i]=unescape(pd.d1);
            ai.AdditionalHeader[i]=pd.d4;
            setting.dMsg(ai.Model[i], ai.Gunn(i));
            if (!i)
                msgInfo(c.innerHTML, false, true);
        }
        , Click_OpenUrl:u=>window.open(u, '_blank')
        , Click_alleSpraak:['Bokml', 'Nynorsk', 'Sámegiella', 'English (UK)', 'English (US)', 'Svenska', 'Dansk']
        , AllModels:e=>{
            Show(false);
            msgAsk('AI-modeller tilgjengelig');
            let //row=msgAnswer('Sjekker tilbyderne...'),img = row.querySelector('img'), div = row.querySelector('.msg')
                replys=new Array();
            cfg.aiProvider.forEach((p,n)=>{
                replys.push('');
                let r=msgAnswer(p[0]+' modeller...'),i = r.querySelector('img'), d = r.querySelector('.msg'), k=aiGun(unescape(p[2])), u='https://'+new URL(p[1]).hostname + '/models'
                let x=new XMLHttpRequest();
                x.open('GET',u,true);
                x.setRequestHeader('Authorization','Bearer '+k);
                x.setRequestHeader('Accept','application/json');
                x.onprogress = e => d.innerHTML+=x.responseText;
                x.onreadystatechange = e => {i.classList.remove('rotating')};
                x.send();
            });
        }
    }
    ,qr:u=>qr.d(u,ui.c.Chat,.6)
    ,qrU:()=>ui.qr(lagring.qr())
    ,parseSkjulHtm:(c='...',h)=>`<span onclick="const n=this.nextElementSibling;this.remove();n.style.display=''">${c}</span><span style="display:none">${h}</span>`
    ,parseTags:h=>{
        const regex = /\[detaljer(?:\s+c=['"](.*?)['"])?\]([\s\S]*?)\[\/detaljer\]/g;
        function recursiveReplace(html) {
            const newHtml= html.replace(regex,(_, c, innhold)=>ui.parseSkjulHtm(c || '...', innhold.replace(/^\n+|\n+$/g, '')));
            return newHtml==html?html:recursiveReplace(newHtml);
        }
        return ai.Raw2Htm(recursiveReplace(h));
    }
    , parseTagsSafe: h => {
        if ((l = h.lastIndexOf('[')) > -1 && h.lastIndexOf(']') < l) h = h.slice(0, l);

        let out = '', i = 0;
        while (i < h.length) {
            let s = h.indexOf('[detaljer', i);
            if (s < 0) return out + h.slice(i);
            out += h.slice(i, s);
            let e = h.indexOf(']', s), c = '...';
            if (e < 0) break;
            let cs = h.indexOf("c='", s);
            if (cs > -1 && cs < e) {
                let ce = h.indexOf("'", cs + 3);
                if (ce > -1 && ce < e) c = h.slice(cs + 3, ce);
            }
            out += c;
            let close = h.indexOf('[/detaljer]', e);
            i = close > -1 ? close + 11 : h.length;
        }
        return out;
    }
}
/////////////// msg ///////////////
window.msgIsSimulate=msg=>msg.startsWith("Simulate: ");
window.msgAsk=msgQ=> {
    const el = ((b) => (b.className = "row sent", b.innerHTML = `&nbsp;<img class="icon" src="${ui.c.ImgQ}" onclick="ui.c.ImgQClick(event)"><div class="msg">${msgQ}</div>`, b))(document.createElement("div"));
    ui.c.ImgSpaceRemove();
    ui.c.Chat.append(el);
    ui.c.ImgSpaceAppend();
    ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    return el;
}
window.msgAnswer=(msgA=ui.c.tRotating, isDone=false)=> {
    const el = ((b) => (b.className = "row received", b.innerHTML = `<div class="msg">${msgA}</div><img class="icon${isDone?'':' rotating'}" src="${ui.c.ImgA}" onclick="ui.c.ImgAClick(event)">&nbsp;`, b))(document.createElement("div"));
    ui.c.ImgSpaceRemove();
    ui.c.Chat.append(el);
    ui.c.ImgSpaceAppend();
    ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    return el;
}
window.msgInfo=(msg,handL=false,handR=false)=> {
    const elI=b=>b?`<img class="icon" src="${ui.c.ImgH}" onclick="ui.c.ImgHClick(event)">`:``
    const el = ((b) => (b.innerHTML = `<div class="row info">${elI(handL)}<div>${msg} ${handL|handR?'':'<span style="cursor: pointer" onclick="ui.c.ImgHClick(event)">&nbsp;✖&nbsp;</span>'}</div>${elI(handR)}</div>`, b))(document.createElement("div"));
    ui.c.ImgSpaceRemove();
    ui.c.Chat.append(el);
    //ui.c.ImgSpaceAppend();
    //ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    return el;
}
window.msgAdmin=(msgQ, onDone)=> {
    let mA=msgQ.split('|'), r;
    if (mA.length>1) mA.forEach((m)=>r=msgAdmin(m))
    else { // parse message
        const m='<i>'+msgQ.trim()+'</i>'
        msgAsk(m);
        r=msgAnswer();
        setTimeout(()=>(r.querySelector('.msg').innerHTML='<i>admin: resultat</i>')+(r.querySelector('img')?.classList.remove('rotating')),1000)
    }
    onDone?.(r);
    return r;
}
window.msgSend=(msgQ, onDone)=> {
    ui.Show(ui.c.Suggestions, false);
    let msgQUse = msgQ?.trim() || ui.c.Input.value.trim();
    let r=null;
    if (!msgQUse) msgRedoLast()
    else if (typeof window[ui.menu.Fn(msgQUse)] === 'function') r=window[ui.menu.Fn(msgQUse)](null);
    else if (msgQUse.startsWith('admin: ')) r=msgAdmin(msgQUse,onDone)
    else {
        if (!msgQ) ui.e.Input_setValue('');
        r = msgAsk(msgQUse.split(/\|/)[0]);
        if (msgIsSimulate(msgQUse)) setTimeout(() => msgReceive_Placeholder(msgQUse, msgAnswer(), onDone), 2000);
        else ai.Request(msgQUse, msgAnswer(), 0, onDone);
    }
    return r;
}
window.msgReceive_Placeholder=(msgQ, divR, onDone)=>{
    let msgA = 'Svar på "' + msgQ + '"';
    if (msgIsSimulate(msgQ?.split(/\|/)[1]))
        msgA = msgQ.split(/\|/)[1].substring(10);
    const msg = divR.querySelector(".msg"), icon = divR.querySelector(".icon");
    msg.innerText = msgA;
    icon.classList.remove("rotating"); // Remove rotation
    //ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
    onDone?.(divR, msgA);
}
window.msgRedoLast=m=> {
    ui.menu.Show(false);
    for (e=ui.c.Chat.lastElementChild; e && !e.classList.contains("sent"); e=ui.c.Chat.lastElementChild)
        e.remove();
    if (!m || m.length==0) try{ m = ui.c.Chat.lastElementChild.querySelector(".msg").innerHTML; }catch(e){m='Gjenta'}
    let divR = msgSend(m);
    divR.remove();
}
window.msgSendSpeak=()=> {
    let r = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    r.lang = 'no-NO'; // Set language to Norwegian
    r.start();
    r.onresult = e => {
        ui.e.Input_setValue(ui.c.Input.value+e.results[0][0].transcript);
        if (ui.c.Input.value.length) 
            msgSend(null, msgRecieveTalkAndSend);
    };
}
window.msgRecieveTalkAndSend=(t, bIsRetry=false)=> {
    let u = new SpeechSynthesisUtterance(t);
    u.lang = 'no-NO';
    let voices = speechSynthesis.getVoices().filter(v => v.lang.startsWith('no'));
    if (!bIsRetry && !voices.length) 
        return setTimeout(() => msgRecieveTalkAndSend(t, true), 200); // Ensure voices are loaded
    speechSynthesis.speak(u);
    msgSendSpeak();
}
