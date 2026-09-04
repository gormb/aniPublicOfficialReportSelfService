const books={
    play:{
        // ===== md: markdown-data + innlasting/parsing =====
        md:{
            fn:'',txt:'',title:'',pages:[],chs:[],subs:[],
            set:_fn=>{if(_fn!==books.play.md.fn){books.play.md.fn=_fn;books.play.md.load();}},
            load:()=>fetch(books.play.md.fn).then(r=>r.text()).then(t=>{books.play.md.txt=t;books.play.md.parse();}).catch(()=>{books.play.render.el.page.innerHTML='Fant ikke '+books.play.md.fn;}),
            // Deler teksten opp i sider (pages) og bygger kapitler/underkapitler
            parse:()=>{
                const md=books.play.md.txt.split(/\n/);
                books.play.md.title=md[0].replace(/^#\s*/,'').trim();
                const pages=books.play.md.pages=[];
                let cur=null,par=[],last='';
                const flush=()=>{if(cur&&par.length){cur.ps.push(par.join(' '));par=[];}};
                md.slice(1).forEach(l=>{
                    const h=l.match(/^(#{2,4})\s+(.*)$/);
                    if(h){flush();if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);pages.push(cur);} 
                        const k=h[1].length,x=h[2].trim().replace(/\s*[\u2013\u2014-]\s*p\.\s*\d+\s*$/i,'');
                        cur={h:k>=4?null:[k,x],ps:[]};last='';
                    }else if(!l.trim())flush();
                    else{if(!cur)cur={h:null,ps:[]};par.push(/^\u{1F3B5}/u.test(l.trim())?books.play.render.mus(l):books.play.render.esc(l));last=l.trim();}
                });
                flush();
                if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);pages.push(cur);}
                books.play.md.index();
                books.play.render.reset();
                books.play.render.draw();
            },
            // Bygger chs/subs på nytt fra pages – kjøres på nytt etter AI-endringer
            index:()=>{
                const pages=books.play.md.pages,chs=books.play.md.chs=[],subs=books.play.md.subs=[];
                let ch=null;
                pages.forEach(p=>{if(p.h&&p.h[0]===2){if(ch)chs.push(ch);ch=[];}
                    if(ch)ch.push(p);});
                if(ch)chs.push(ch);
                let su=null;
                pages.forEach(p=>{ if(p.h){if(su)subs.push(su);su=[];} if(su)su.push(p);});
                if(su)subs.push(su);
            }
        },
        // ===== render: DOM + visningstilstand + HTML-bygging =====
        render:{
            el:{page:document.getElementById('page'),prev:document.getElementById('prev'),next:document.getElementById('next'),whole:document.getElementById('whole')},
            mode:0, // 0=Sider 1=Kapitler 2=Underkapitler 3=Hele
            idx:0,
            names:['Kapitler','Underkapitler','Hele','Sider'],
            esc:x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
            mus:l=>'<a href="'+(l.match(/https?:\/\/[^\s)]+/)||[''])[0]+'">\u{1F3B5}</a>',
            sent:s=>/[.!?\u2026]["'\u201D\u2019\u00BB]?$/.test(s.trim()),
            head:p=>p.h?'<'+(p.h[0]===2?'h2':'h3')+'>'+books.play.render.esc(p.h[1])+'</'+(p.h[0]===2?'h2':'h3')+'>':'',
            page:p=>p.t?'<h1>'+books.play.render.esc(books.play.md.title)+'</h1>':books.play.render.head(p)+p.ps.join('<br>'),
            flow:a=>{let o='',br=1;a.forEach(p=>{const f=books.play.render.page(p);o+=o?(br?'<br>':' ')+f:f;br=p.e?1:0;});return o;},
            views:()=>{
                const p=books.play;
                return p.render.mode===0?[{t:1}].concat(p.md.pages).map(p.render.page)
                    :p.render.mode===1?p.md.chs.map(p.render.flow)
                    :p.render.mode===2?p.md.subs.map(p.render.flow)
                    :['<h1>'+p.render.esc(p.md.title)+'</h1>'+p.render.flow(p.md.pages)];
            },
            reset:()=>{const r=books.play.render;r.el.whole.textContent=r.names[0];r.mode=0;r.idx=0;},
            draw:()=>{
                const r=books.play.render,v=r.views();
                r.idx=Math.max(0,Math.min(v.length-1,r.idx));
                r.el.page.innerHTML=v[r.idx];
                r.el.prev.hidden=r.el.next.hidden=r.mode>2;
            },
            show:k=>books.play.render.idx=k;books.play.render.draw(),
            whole:()=>{const r=books.play.render;r.mode=(r.mode+1)%4;r.el.whole.textContent=r.names[r.mode];r.draw();}
        }
        // ===== Fremtidig: books.play.ai endrer tekst/kapitler, deretter books.play.md.index(); books.play.render.draw(); =====
    }
};

// Globale aliaser slik at onclick-attributtene i play.html (show(), whole(), i) fortsatt virker
Object.defineProperty(window,'i',{get:()=>books.play.render.idx,set:v=>{books.play.render.idx=v;}});
window.show=k=>books.play.render.show(k);
window.whole=()=>books.play.render.whole();

books.play.md.set('LifeDemandedDeath/b_NO_FREE.md');