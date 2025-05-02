/////////////// ai ///////////////
const ai={
    //Raw2HtmS:'(?:^|\\n\\n|<br\\s*/?>|\\r?\\n)'
    Raw2HtmA:(s,t)=>`<a href="javascript:void(0)" onclick="ui.e.Input_setValue('${s} ${t.replace(/'/g,"\\'").replace(/"/g,"&quot;")}'),ui.c.Input.focus()">${s} ${t}</a>`
    ,Raw2HtmA:(s,t)=>`<a href="javascript:void(0)" onclick="ui.e.Input_setValue('${s} ${t.replace(/'/g,"\\'").replace(/"/g,"&quot;")}'),ui.c.Input.focus()">${s} ${t}</a>`
    ,Raw2Htm1:raw=>raw.split(/\r?\n/).map(l=>
      l.replace(/\*\*\*(.*?)\*\*\*/g,'<h2>$1</h2>')
       .replace(/\*\*(.*?)\*\*/g,'<h3>$1</h3>')
       .replace(/#### (.*)/g,'<h4>$1</h4>')
       .replace(/### (.*)/g,'<h3>$1</h3>')
       .replace(/## (.*)/g,'<h2>$1</h2>')
       .replace(/# (.*)/g,'<h1>$1</h1>')
       .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2">$1</a>')
    //    .replace(/^🎲\s*(\d)\s*(?:[-–]\s*)?([^<]*)/g,(_,n,t)=>ai.Raw2HtmA('🎲 '+n,t.trim()))
    .replace(/🎲\s*\d\s*[^🎲🔁🌑<\n]*/g, m => {
        const [pre, ...rest] = m.trim().split(/\s+/)
        return '<br>' + ai.Raw2HtmA(pre, rest.join(' '))
      })
             .replace(/^🔁\s*(.*)/,(_,t)=>ai.Raw2HtmA('🔁',t))
       .replace(/^🌑\s*(.*)/,(_,t)=>ai.Raw2HtmA('🌑',t))
       .replace(/^(\d)️⃣\s*(.*)/,(_,n,t)=>ai.Raw2HtmA(n+'️⃣',t))
       .replace(/^(\d)\.\s*(.*)/,(_,n,t)=>ai.Raw2HtmA(n+'.',t))
       .replace(/^(\d):\s*(.*)/,(_,n,t)=>ai.Raw2HtmA(n+':',t))
       .replace(/^([0-9]+[a-z]*)\.\s*(.*)/,(_,n,t)=>ai.Raw2HtmA(n+'.',t))
       .replace(/^([A-Z]+[0-9]*)\.\s*(.*)/,(_,n,t)=>ai.Raw2HtmA(n+'.',t))
       .replace(/^(①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)\s*(.*)/,(_,n,t)=>ai.Raw2HtmA(n,t))
       .replace(/^–\s*(.*)/,(_,t)=>ai.Raw2HtmA('–',t))
       .replace(/^([a-zA-Z])\)\s*(.*)/,(_,n,t)=>ai.Raw2HtmA(n+')',t))
    ).join('<br>')
    ,Raw2Htm2: raw => raw
    .replace(/\*\*\*(.*?)\*\*\*/g, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')
    .replace(/#### (.*)/g, '<h4>$1</h4>')
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/# (.*)/g, '<h1>$1</h1>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/(🎲\s*\d\s*[^🎲🔁🌑①②③④⑤⑥⑦⑧⑨⑩<]*)/g, m => {
      const [pre, ...rest] = m.trim().split(/\s+/)
      return ai.Raw2HtmA(pre + ' ' + rest.shift(), rest.join(' '))
    })
    .replace(/(🔁\s*[^🎲🔁🌑①②③④⑤⑥⑦⑧⑨⑩<]*)/g, m =>
      ai.Raw2HtmA('🔁', m.replace(/^🔁\s*/, '').trim())
    )
    .replace(/(🌑\s*[^🎲🔁🌑①②③④⑤⑥⑦⑧⑨⑩<]*)/g, m =>
      ai.Raw2HtmA('🌑', m.replace(/^🌑\s*/, '').trim())
    )
    .replace(/(①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)\s*([^①②③④⑤⑥⑦⑧⑨⑩<]*)/g, (_, n, t) =>
      ai.Raw2HtmA(n, t.trim())
    )

    ,Raw2Htm: raw => raw
        // fjern eksisterende <a>-tagger for å unngå dobbel-lenker
        .replace(/<a .*?<\/a>/g, m => m.replace(/<a .*?>|<\/a>/g, ''))
        // overskrifter og markdown
        .replace(/\*\*\*(.*?)\*\*\*/g, '<h2>$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')
        .replace(/#### (.*)/g, '<h4>$1</h4>')
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/## (.*)/g, '<h2>$1</h2>')
        .replace(/# (.*)/g, '<h1>$1</h1>')
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
        // 🎲 matcher alle på linjen, stopper på < eller neste ikon
        .replace(/(🎲\s*\d\s*[^🎲🔁🌑①②③④⑤⑥⑦⑧⑨⑩<]*)/g, m => {
        const [pre, ...rest] = m.trim().split(/\s+/)
        return ai.Raw2HtmA(pre + ' ' + rest.shift(), rest.join(' '))
        })
        // 🔁 matcher
        .replace(/(🔁\s*[^🎲🔁🌑①②③④⑤⑥⑦⑧⑨⑩<]*)/g, m =>
        ai.Raw2HtmA('🔁', m.replace(/^🔁\s*/, '').trim())
        )
        // 🌑 matcher
        .replace(/(🌑\s*[^🎲🔁🌑①②③④⑤⑥⑦⑧⑨⑩<]*)/g, m =>
        ai.Raw2HtmA('🌑', m.replace(/^🌑\s*/, '').trim())
        )
        // sirkeltall matcher
        .replace(/(①|②|③|④|⑤|⑥|⑦⑧|⑨|⑩)\s*([^①②③④⑤⑥⑦⑧⑨⑩<]*)/g, (_, n, t) =>
        ai.Raw2HtmA(n, t.trim())
        )
        // til slutt, legg til <br> for \n
        .replace(/\n/g, '<br>')
    ,Raw2HtmAs: s => {
    const start = /(🎲\s*\d|🔁|🌑|[A-Za-z]\)|\d+\)|\d+\.|[A-Za-z0-9]+\.)\s*/;
    let i = 0, out = '';

    while (i < s.length) {
      const hit = start.exec(s.slice(i));
      if (!hit) { out += s.slice(i); break; }

      const a = i + hit.index, b = a + hit[0].length;
      out += s.slice(i, a);                    // tekst før prefiks

      const rest = s.slice(b);
      const stop = rest.search(/<|\n|(🎲\s*\d|🔁|🌑|[A-Za-z]\)|\d+\)|\d+\.|[A-Za-z0-9]+\.)/);
      const c = stop === -1 ? s.length : b + stop;

      const key  = hit[1].trim();
      const text = s.slice(b, c).trim();
      out += ai.Raw2HtmA(key, text);           // ← bygger lenken her

      i = c;
    }
    return out;
  }

      // '🎲🔁🌑', n. (n=1..9), c. (c=a..z), C. (C=A..Z), nc., Cn., Cnc.
  
      , ai2Prompt: a => a.reduce((r, ai, i) => (!i ? [ai] : [...r, { role: "user", content: ai[0] }, { role: "assistant", content: ai[1] }]), [])
    , Gun:(g)=> [...g].map((c,i)=>String.fromCharCode((c.charCodeAt()^'gunnar'.charCodeAt(i%6))+32)).join('')
    , Gunn:i=>ai.Gun(ai.Gunnar[i||0])
    , ConfigPipeReplace : 'pipereplace'
    , AllModels :i=> [...new Set(cfg.aiProvider.flatMap(c => (c[5] || []).map(m => cfg.aiProviderUse[i]+m[0].split('§')[0])))]
    , Reply:[''], History : [], RequestActiveCount : 0
    , Url:['','',''], SugQ:[['',''],['',''],['','']], Model:['','',''], Gunnar:['','',''], AdditionalHeader:[null,null,null]
    , Reset:()=> {
        ai.Reply=[''];
        ai.History=[ai.ai2Prompt(cfg.aiPrompt), ai.ai2Prompt(cfg.aiPromptPV), ai.ai2Prompt(cfg.aiPromptBG)];
    }
    , RequestProgress_Antropic: (d, t, l, iThread) => {
        t.substring(l).split("\n").forEach(line => {
            if (line.startsWith("data: ")) {
                const j = line.slice(6).trim();
                if (j !== "[DONE]") try {
                    ai.Reply[iThread] += JSON.parse(j).delta.text || ""; 
                } catch(ex) { setting.dMsg('RequestProgress', j)}
            }
        });
        d.innerHTML = ai.Raw2Htm(ui.parseTagsSafe(ai.Reply[iThread]));
        return t.length;
    }
    , RequestProgress : (d, t, l, iThread) => {
        t.substring(l).split("\n").forEach(line => {
            if (line.startsWith("data: ")) {
                const j = line.slice(6).trim();
                if (j !== "[DONE]") try {
                    ai.Reply[iThread] += JSON.parse(j)?.choices?.[0]?.delta?.content || ""; 
                } catch(ex) { setting.dMsg('RequestProgress', j)}
            }
        });
        //d.innerHTML = ai.Raw2Htm(ai.Reply[iThread]);
        d.innerHTML = ai.Raw2Htm(ui.parseTagsSafe(ai.Reply[iThread]))
        return t.length;
    }
    , RequestComplete : (x, img, d, iThread, onDone, retries) => {
        ai.RequestActiveCount--;
        img?.classList.remove('rotating');
        if (x.status == 200) ai.History[iThread].push({ role: 'assistant', content: ai.Reply[iThread] });
        else if (x.status >= 400 && x.status < 500 && retries > 0) return setTimeout(() => ++ai.RequestActiveCount^ai.Request(ai.History[iThread].slice(-1)[0].content, d.parentElement, iThread, onDone, retries-1), 1000);
        else ai.Reply[iThread] = `<i>Feil ved kall til KI-tjenesten ${ai.Model[0]}<br/>${!x.status?'Manglende internet?':(() => { try { let err = JSON.parse(x.response?.message || x.responseText); return err?.error?.message || err?.message || x.statusText; } catch { return x.statusText; } })()}</i>`;
        //d.innerHTML = ai.Raw2Htm(ai.Reply[iThread]);
        d.innerHTML = ai.Raw2Htm(ui.parseTags(ai.Reply[iThread]))
        if (!iThread) ;//ui.c.Chat.scrollTop = ui.c.Chat.scrollHeight;
        onDone?.(ai.Reply[iThread]);
    }
    , RequestX : (iThread, onDone, retries, img, d) => {
        let x = new XMLHttpRequest(), l=0
            , isAnth = ai.Url[0].includes('.anthropic.')
            , isHugg = ai.Url[0].includes('.huggingface.') //, isGemi = ai.Url[0].includes('.googleapis.')
        let u=ai.Url[0]+(isHugg?ai.Model[0]:'');
        x.open("POST", u, true);
        x.setRequestHeader("Content-Type", "application/json");
        x.setRequestHeader("Authorization", "Bearer " + ai.Gunn());
        x.onreadystatechange = () => x.readyState == 4 && ai.RequestComplete(x, img, d, iThread, onDone, retries);
        x.onprogress = e => l = ai.RequestProgress(d, x.responseText, l, iThread);
        ai.AdditionalHeader[0].split('^').map(p => p.split(':')).forEach(h=>{if (h[1]) x.setRequestHeader(h[0], h[1])});
        let xml = ''
        if (isAnth) { // Anthropic API (we are special)
            x.onprogress=e=> l = ai.RequestProgress_Antropic(d, x.responseText, l, iThread);
            x.setRequestHeader("x-api-key", ai.Gunn());
            const sys = ai.History[iThread].find(m => m.role === "system")?.content;
            const msgs = ai.History[iThread].filter(m => m.role !== "system");            
            xml = JSON.stringify({ model: ai.Model[0], ...(sys ? { system: sys } : {}), messages: msgs, max_tokens: 8192, stream: true});
        }
        else if(isHugg) // Huggingface has model in url
            xml = JSON.stringify({ messages: ai.History[iThread], stream: true });
        else xml = JSON.stringify({ model: ai.Model[0], messages: ai.History[iThread], stream: true });
        return x.send(xml);
    }
    , Request : (q, row = msgAnswer(), iThread = 0, onDone = null, retries = 2) => {
        let img = row.querySelector('img'), d = row.querySelector('.msg')??row, l = 0;
        ai.RequestActiveCount++;
        ai.History[iThread] ??= [...(ai.History[ai.History.length - 1] || [])];
        ai.Reply[iThread] ??= [...(ai.Reply[ai.Reply.length - 1] || [])];
        ai.Reply[iThread] = d.innerText.replace('↺', '');
        ai.History[iThread].push({ role: "user", content: q });
        return ai.RequestX(iThread, onDone, retries, img, d);
    }
    , ParseWaitReqBefore:(n = cfg.aiProviderTimeout*10)=> {// Wait until ai.RequestActiveCount is 0 or until autoTimeout sec)
        return new Promise((resolve, reject) => {
            let i = 0, interval = setInterval(() => {
                if (!ai.RequestActiveCount) {
                    clearInterval(interval);
                    resolve();
                } else if (++i >= n) {
                    console.warn("Timeout waiting for AI requests to finish. Forcing counter to 0.");
                    ai.RequestActiveCount = 0;
                    clearInterval(interval);
                    reject(new Error("Timeout waiting for AI requests to finish."));
                }
            }, 100);
        });
    }
    , async ParsePerform(f, i=0) {
        setting.dMsg('ParsePerform begin', i, f)
        if (i < f.length && (i || f[i]?.length)) {
            let m = decodeURIComponent(f[i].trim()), fn = ui.menu.Fn(m);
            setting.dMsg('ParsePerform msg:' + m, fn);
            ai.RequestActiveCount = 0;
            typeof window[fn] === 'function' 
                ? await window[fn]()
                : await msgSend(m);
            await ai.ParseWaitReqBefore();
        }
        if (i < f.length) 
            await ai.ParsePerform(f, i + 1);
        setting.dMsg('ParsePerform end', i)
    }
    , Parse:s=> ai.ParsePerform(s.split('?'))
} //*/
