const books={
    play:{
        // ===== md: markdown-data + innlasting/parsing =====
        md:{
            fn:'',txt:'',title:'',pages:[],chs:[],subs:[],
            books:['LifeDemandedDeath','CV','ABook'],
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
                        const k=h[1].length,raw=h[2].trim(),pn=+(raw.match(/p\.\s*(\d+)/i)||[,0])[1];
                        cur={h:k>=4?null:[k,raw.replace(/\s*[\u2013\u2014-]\s*p\.\s*\d+\s*$/i,'').trim()],pn,ps:[]};last='';
                    }else if(!l.trim())flush();
                    else{
                        if(!cur)cur={h:null,ps:[]};
                        const _l=l.trim(),_m=/^\u{1F3B5}/u.test(_l);
                        // 🎵 rett etter en overskrift → fest lenken til overskriften (mu), ikke som brødtekst
                        if(cur.h&&!cur.ps.length&&!par.length&&_m&&_l.match(/https?:\/\/[^\s)]+/))cur.mu=_l.match(/https?:\/\/[^\s)]+/)[0];
                        else par.push(_m?books.play.render.mus(_l):books.play.render.esc(_l));
                        last=_l;
                    }
                });
                flush();
                if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);pages.push(cur);}
                books.play.md.index();
                books.play.render.reset();
                books.play.render.draw();
                books.play.render.hash(); // deep-link (#p12 / #detgamle)
            },
            // Bygger chs/subs på nytt fra pages – kjøres på nytt etter AI-endringer
            index:()=>{
                const pages=books.play.md.pages,chs=books.play.md.chs=[],subs=books.play.md.subs=[];
                let ch=null;
                pages.forEach(p=>{if(p.h&&p.h[0]===2){if(ch)chs.push(ch);ch=[];}if(ch)ch.push(p);});
                if(ch)chs.push(ch);
                let su=null;
                pages.forEach(p=>{ if(p.h){if(su)subs.push(su);su=[];} if(su)su.push(p);});
                if(su)subs.push(su);
            }
        },
        book:'LifeDemandedDeath', // valgt bok (mappe under b/)
        // Laster inn valgt bok på språk lg ('NO'|'EN')
        open:lg=>books.play.md.set('b/'+books.play.book+'/b_'+lg+'_FREE.md')+(lang.textContent=lg==='NO'?'🇳🇴':'🇬🇧')
        ,
        // Språkbytte: bytter NO/EN i valgt bok
        lang:()=>{books.play.open(/NO_/.test(books.play.md.fn)?'EN':'NO');},
        // Velger bok fra hele-boka-listen (beholder språk)
        pick:b=>{
            const p=books.play;
            p.book=b;
            p.open(/NO_/.test(p.md.fn)?'NO':'EN');
        },
        // ===== render: DOM + visningstilstand + HTML-bygging =====
        render:{
            el:{page:document.getElementById('page'),nav:document.getElementById('dbNavList'),title:document.getElementById('dbTitle'),prev:document.getElementById('prev'),next:document.getElementById('next'),mode:document.getElementById('mode'),modeLbl:document.getElementById('modeLbl')},
            mode:0, // 0=Whole 1=Chapters 2=Subchapters 3=Pages
            idx:0,
            icons:['📚','📖','📑','📄'],
            setMode:()=>{const r=books.play.render;r.el.modeLbl.textContent=r.icons[r.mode];},
            toc:()=>{
                const r=books.play.render,p=books.play.md,m=r.mode;
                const ic={2:'📖',3:'📑'};
                const ind=n=>'&nbsp;'.repeat(2*n); // hierarki-nivå
                const a=(t,i,l,ico)=>t===''?'':'<a data-i="'+i+'" data-m="'+m+'">'+ind(l)+ico+'&nbsp;'+r.esc(t)+'</a>';
                let o=[];
                if(m===0)o=p.books.map(bk=>'<a data-book="'+bk+'">📚&nbsp;'+r.esc(bk)+'</a>');
                else if(m===3){let l=0;p.pages.forEach((pg,i)=>{if(pg.h){l=pg.h[0]===2?0:1;o.push(a(pg.h[1],i+1,l,ic[pg.h[0]]||'📄'));}else if(pg.pn)o.push(a('p.'+pg.pn,i+1,l+1,'📄'));});}
                else if(m===1)o=p.chs.map((ch,i)=>a(ch[0].h[1],i,0,'📖'));
                else if(m===2)o=p.subs.map((su,i)=>a(su[0].h[1],i,su[0].h[0]===2?0:1,ic[su[0].h[0]]||'📑'));
                r.el.nav.innerHTML=o.join('');
            },

            esc:x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
            slug:s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,''), // id: tekst uten mellomrom/tegn
            mus:l=>'<a href="'+(l.match(/https?:\/\/[^\s)]+/)||[''])[0]+'">\u{1F3B5}</a>',
            sent:s=>/[.!?\u2026]["'\u201D\u2019\u00BB]?$/.test(s.trim()),
            head:p=>{const r=books.play.render,t=p.h&&p.h[1];if(!t)return '';const k=p.h[0],h=k===2?'h2':'h3',s=r.slug(t);return '<'+h+(s?' id="'+s+'"':'')+'>'+r.esc(t)+(p.mu?' <a href="'+p.mu+'">\u{1F3B5}</a>':'')+'</'+h+'>';},
            page:p=>{const r=books.play.render,o=p.t?'<h1>'+r.esc(r.md.title)+'</h1>':r.head(p)+p.ps.join('<br>');return (p.pn?'<a id="p'+p.pn+'"></a>':'')+o;},
            flow:a=>{let o='',br=1;a.forEach(p=>{const f=books.play.render.page(p);o+=o?(br?'<br>':' ')+f:f;br=p.e?1:0;});return o;},
            views:()=>{
                const p=books.play;
                return p.render.mode===0?['<h1>'+p.render.esc(p.md.title)+'</h1>'+p.render.flow(p.md.pages)]
                    :p.render.mode===1?p.md.chs.map(p.render.flow)
                    :p.render.mode===2?p.md.subs.map(p.render.flow)
                    :[{t:1}].concat(p.md.pages).map(p.render.page);
            },
            reset:()=>{const r=books.play.render;r.mode=0;r.idx=0;r.setMode();r.el.title.textContent=books.play.md.title;r.toc();},
            draw:()=>{
                const r=books.play.render,v=r.views();
                r.idx=Math.max(0,Math.min(v.length-1,r.idx));
                r.el.page.innerHTML=v[r.idx];
                r.el.prev.hidden=r.el.next.hidden=r.mode===0; // skjul forrige/neste i hele-boka-visning
            },
            show:k=>{books.play.render.idx=k;books.play.render.draw();},
            cycle:()=>{const r=books.play.render;r.mode=(r.mode+1)%4;r.setMode();r.toc();r.draw();},
            hash:()=>{
                const r=books.play.render,h=location.hash.toLowerCase().slice(1);
                if(!h)return;
                r.mode=0; // hele boka (alle ankre i DOM)
                let id=h;
                if(!/^p\d+$/.test(id)){ // #detgamle → første kapittel/underkapittel som starter med 'detgamle' (uten mellomrom)
                    const t=books.play.md.pages.find(pg=>pg.h&&r.slug(pg.h[1]).startsWith(r.slug(id)));
                    if(t)id=r.slug(t.h[1]);else return;
                }
                r.setMode();r.toc();r.draw();
                const el=document.getElementById(id);
                if(el)el.scrollIntoView();
            }
        }
        // ===== Fremtidig: books.play.ai endrer tekst/kapitler, deretter books.play.md.index(); books.play.render.draw(); =====
    }
};

// Globale aliaser slik at onclick-attributtene i play.html (mode(), show(), i) fortsatt virker
Object.defineProperty(window,'i',{get:()=>books.play.render.idx,set:v=>{books.play.render.idx=v;}});
window.show=k=>books.play.render.show(k);
window.mode=()=>books.play.render.cycle();

// Venstre-navigasjon (dbNav): klikk hopper til valgt visning i gjeldende modus
const dbNav=document.getElementById('dbNav');
dbNav.addEventListener('click',ev=>{
    const a=ev.target.closest('a[data-book],a[data-i]');
    if(!a)return;
    if(a.dataset.book){books.play.pick(a.dataset.book);return;} // velg bok fra hele-boka-listen
    const r=books.play.render;r.mode=+a.dataset.m;r.idx=+a.dataset.i;r.setMode();r.toc();r.draw();
});

// Deep-links: play.html#p12 / #detgamle
window.addEventListener('hashchange',()=>books.play.render.hash());

// Språkbytte-knapp: bindes direkte til metoden (ingen window-global)
document.getElementById('lang').addEventListener('click', books.play.lang);
books.play.lang(); // starter på norsk (NO)