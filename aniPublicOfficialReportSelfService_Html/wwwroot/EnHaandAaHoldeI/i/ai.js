/////////////// ai ///////////////
const ai={
        // bug; legger igjen tags som html: Raw2HtmA:(s,t)=>`<a href='javascript:void(0)' onclick='if(this.parentElement?.onclick) return; ui.e.Input_setValue(${JSON.stringify(`${s} ${t}`)}),ui.c.Input.focus()'>${s} ${t}</a>`
    //Raw2HtmA:(s,t)=>`${s} ${t}`.includes('<a')?`${s} ${t}`:`<a href="javascript:void(0)" onclick="if(this.parentElement?.onclick) return; ui.e.Input_setValue('${s} ${t.replace(/'/g,"\\'").replace(/"/g,"&quot;")}'),ui.c.Input.focus()">${s} ${t}</a>`

    Raw2HtmA:(s,t)=>(`${s} ${t}`.includes('<a'))?t:`<a href="javascript:void(0)" onclick="if(this.parentElement?.onclick) return; ui.e.Input_setValue('${s} ${t.replace(/'/g,"\\'").replace(/"/g,"&quot;")}'),ui.c.Input.focus()">${s} ${t}</a>`
    ,safeReplace: (text, regex, replacer)=>text.replace(/(<[^>]+>|[^<]+)/g, chunk=>chunk.startsWith('<') ? chunk : chunk.replace(regex, replacer))
    ,   Raw2Htm: raw => {
        // Step 1: basic cleanup & yaml/key formatting
        let raw1 = raw
            .replace(/^[\s\S]*<\|im_start\|\>/, '')
            .replace(/<\|im_end\|\>[\s\S]*$/, '')
            .replace(/^\s*-\s*(.*)/gm, '<li>$1</li>')
            .replace(/^(\w[\w\s]*):\s*(.*)$/gm, '<b>$1:</b> $2');

        // Step 2: number links (1) 2) …)
        let raw2 = raw1.replace(/(^|\r?\n)(\d+[\)\.])\s*([^\n<]+)/g,
            (m, sep, n, t) => sep + ai.Raw2HtmA(n, t.trim())
        );

        // Step 3: number emoji links
        // raw2 = raw2.replace(/(1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|①|②|③|④|⑤|⑥|⑦|⑧|⑨|⑩)\s*([^\n<]*)/g,
        //     (m, n, t) => ai.Raw2HtmA(n, t.trim())
        // );

        // Step 4: other emoji-prefixed lines
        // raw2 = raw2.replace(/(^|\r?\n|<br\s*\/?>)\s*(\p{Extended_Pictographic}+)\s*([^\n<]+)/gu,
        //     (m, sep, icon, t) => sep + ai.Raw2HtmA(icon, t.trim())
        // );

        // Step 5: markdown
        //let raw3 = ai.safeReplace(raw2, /\*\*\*(.*?)\*\*\*/g, '<h2>$1</h2>')
        let raw3 = ai.safeReplace(raw2, /\*\*\*(.*?)\*\*\*/g, '<h2>$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')
            .replace(/\[(?!\/?detaljer\b)([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Step 6: remaining newlines → <br>
        let raw4 = raw3.replace(/\r?\n/g, '<br>');

        return raw4;
    }
    ,Raw2Htm_bs: raw=> {
        let raw1=raw // LLM lite
            .replace(/^[\s\S]*<\|im_start\|\>/, '').replace(/<\|im_end\|\>[\s\S]*$/, '')
            // yaml lite
            .replace(/^\s*-\s*(.*)/gm, '<li>$1</li>')  // - punkt → <li>
            .replace(/^(\w[\w\s]*):\s*(.*)$/gm, '<b>$1:</b> $2')  // Nøkkel: verdi → <b>Nøkkel:</b> verdi
        let raw2=raw1 // link to numbers
            // .replace(/(🎲\s*\d\s*[^🎲🔁🌑1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣①②③④⑤⑥⑦⑧⑨⑩<\n]*)/g, m => m.includes('<a') ? m : (() => {const [pre, ...rest]=m.trim().split(/\s+/);return ai.Raw2HtmA(pre + ' ' + rest.shift(), rest.join(' '))})())
            // .replace(/(🔁\s*[^🎲🔁🌑1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣①②③④⑤⑥⑦⑧⑨⑩<\n]*)/g, m => m.includes('<a') ? m : ai.Raw2HtmA('🔁', m.replace(/^🔁\s*/, '').trim()))
            // .replace(/(🌑\s*[^🎲🔁🌑1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣①②③④⑤⑥⑦⑧⑨⑩<\n]*)/g, m => m.includes('<a') ? m : ai.Raw2HtmA('🌑', m.replace(/^🌑\s*/, '').trim()))
            // .replace(/(1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|①|②|③④|⑤|⑥|⑦|⑧|⑨|⑩)\s*([^1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣①②③④⑤⑥⑦⑧⑨⑩<\n]*)/g, (m, n, t) => m && m.includes('<a') ? m : ai.Raw2HtmA(n, t.trim()))
            // normal n)... should be easy, no?!
            // tar bare 1)2) etc ikke 1.2. etc...  .replace(/(^|\r?\n|<br\s*\/?>)\s*(?:\p{Extended_Pictographic}\s*)?(\d+)\)\s*([^\n<]*)/gu, (m, sep, n, t) => sep + ai.Raw2HtmA(n + ')', t.trim()))
            // må testes mer!
            .replace(/(^|\r?\n+|<br\s*\/?>)\s*(?:\p{Extended_Pictographic}\s*)?(\d+)[\)\.]\s*([^\n<]*)/gu, (m, sep, n, t) => sep + ai.Raw2HtmA(n + (m.includes(')') ? ')' : '.'), t.trim()))

            //.replace(/(^|\r?\n|<br\s*\/?>)\s*(?:\p{Extended_Pictographic}\s*)?(\d+)[\)\.]\s*([^\n<]*)/gu, (m, sep, n, t) => sep + ai.Raw2HtmA(n + (m.includes(')') ? ')' : '.'), t.trim()))
            /*
            👶 Barnehage
            🏫 Skole
            👵 Helse & omsorg
            🏠 Bolig & plan
            🚧 Teknisk drift
            💼 Næringsutvikling
            🌳 Kultur & idrett
            */ 
            //todo: test regex for [icon] text (this is number or sh!t...)
            .replace(/(^|\r?\n|<br\s*\/?>)\s*(?:\p{Extended_Pictographic}\s*)?(\d+)([.)])\s*([^\n<]*)/gu, (m, sep, n, punct, t) => sep + ai.Raw2HtmA(n + punct, t.trim()))
            .replace(/(^|\r?\n|<br\s*\/?>)\s*(\p{Extended_Pictographic})\s*([^\n<]+)/gu, (m, sep, icon, t) => sep + ai.Raw2HtmA(icon, t.trim()))
        let raw3=raw2 // markdown lite
            .replace(/\*\*\*(.*?)\*\*\*/g, '<h2>$1</h2>')
            .replace(/\*\*(.*?)\*\*/g, '<h3>$1</h3>')
            .replace(/#### (.*)/g, '<h4>$1</h4>')
            .replace(/### (.*)/g, '<h3>$1</h3>')
            .replace(/## (.*)/g, '<h2>$1</h2>')
            .replace(/^# (.*)$/gm, '<h1>$1</h1>')
            .replace(/^\s*(---|\*\*\*|___)\s*$/gm, '<hr>')
            .replace(/\[(?!\/?detaljer\b)([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        let raw4=raw3
            .replace(/(?![^<]*>)(\r?\n)/g, '<br>')
        if(raw4!=raw) console.warn('ai.Raw2Htm raw..raw4', [...[raw, raw1, raw2, raw3, raw4]]);
        return raw4;
    } 
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
            //, isCurated = ai.Model[0].includes('|')
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
