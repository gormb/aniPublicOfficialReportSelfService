const books={
    play:{
        md:{
            fn:'',txt:'',title:'',pages:[],chs:[],subs:[]
            ,books:['LifeDemandedDeath','CV','ABook']
            ,set:_fn=>{if(_fn!==books.play.md.fn){books.play.md.fn=_fn;books.play.md.load();}}
            ,load:()=>fetch(books.play.md.fn).then(r=>r.text()).then(t=>{books.play.md.txt=t;books.play.md.parse();}).catch(()=>{books.play.render.el.page.innerHTML='Fant ikke '+books.play.md.fn;})
            ,parse:()=>{
                const md=books.play.md.txt.split(/\n/);
                books.play.md.title=md[0].replace(/^#\s*/,'').trim();
                books.play.md.pages=[];
                let cur=null,par=[],last='';
                const flush=()=>{if(cur&&par.length){cur.ps.push(par.join(' '));par=[];}};
                md.slice(1).forEach(l=>{
                    const h=l.match(/^(#{2,4})\s+(.*)$/);
                    if(h){flush();if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);books.play.md.pages.push(cur);} 
                        const k=h[1].length,raw=h[2].trim(),pn=+(raw.match(/p\.\s*(\d+)/i)||[,0])[1];
                        cur={h:k>=4?null:[k,raw.replace(/\s*[\u2013\u2014-]\s*p\.\s*\d+\s*$/i,'').trim()],pn,ps:[]};last='';
                    }else if(!l.trim())flush();
                    else{
                        if(!cur)cur={h:null,ps:[]};
                        const _l=l.trim(),_m=/^\u{1F3B5}/u.test(_l);
                        if(cur.h&&!cur.ps.length&&!par.length&&_m&&_l.match(/https?:\/\/[^\s)]+/))cur.mu=_l.match(/https?:\/\/[^\s)]+/)[0];
                        else par.push(_m?books.play.render.mus(_l):books.play.render.esc(_l));
                        last=_l;
                    }
                });
                flush();
                if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);books.play.md.pages.push(cur);}
                books.play.md.index();
                books.play.render.reset();
                books.play.render.draw();
                books.play.render.hash();
            }
            ,index:()=>{
                books.play.md.chs=[];
                books.play.md.subs=[];
                let ch=null;
                books.play.md.pages.forEach(p=>{if(p.h&&p.h[0]===2){if(ch)books.play.md.chs.push(ch);ch=[];}if(ch)ch.push(p);});
                if(ch)books.play.md.chs.push(ch);
                let su=null;
                books.play.md.pages.forEach(p=>{ if(p.h){if(su)books.play.md.subs.push(su);su=[];} if(su)su.push(p);});
                if(su)books.play.md.subs.push(su);
            }
        }
        ,book:'LifeDemandedDeath'
        ,open:lg=>books.play.md.set('b/'+books.play.book+'/b_'+lg+'_FREE.md')+(lang.textContent=lg==='NO'?'🇳🇴':'🇬🇧')
        ,lang:()=>{books.play.open(/NO_/.test(books.play.md.fn)?'EN':'NO');}
        ,pick:b=>{
            books.play.book=b;
            books.play.open(/NO_/.test(books.play.md.fn)?'NO':'EN');
        }
        ,render:{
            el:{page,nav:dbNavList,title:dbTitle,prev,next,mode,modeLbl}
            ,mode:0,idx:0,icons:['📚','📖','📑','📄']
            ,setMode:()=>{books.play.render.el.modeLbl.textContent=books.play.render.icons[books.play.render.mode];}
            ,toc:()=>{
                const ic={2:'📖',3:'📑'}
                ,a=(t,i,l,ico)=>t===''?'':'<a data-i="'+i+'" data-m="'+books.play.render.mode+'">'+'&nbsp;'.repeat(2*l)+ico+'&nbsp;'+books.play.render.esc(t)+'</a>'
                ,o=[
                    ()=>books.play.md.books.map(bk=>'<a data-book="'+bk+'">📚&nbsp;'+books.play.render.esc(bk)+'</a>')
                    ,()=>books.play.md.chs.map((ch,i)=>a(ch[0].h[1],i,0,'📖'))
                    ,()=>books.play.md.subs.map((su,i)=>a(su[0].h[1],i,su[0].h[0]===2?0:1,ic[su[0].h[0]]||'📑'))
                    ,()=>{let l=0;return books.play.md.pages.map((pg,i)=>pg.h?(l=pg.h[0]===2?0:1,a(pg.h[1],i+1,l,ic[pg.h[0]]||'📄')):pg.pn?a('p.'+pg.pn,i+1,l+1,'📄'):'');}
                ];
                books.play.render.el.nav.innerHTML=o[books.play.render.mode]().join('');
            }
            ,esc:x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            ,slug:s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'')
            ,qr:u=>'<img src="https://gormb.github.io/_/i/'+u.split('?')[1]+'.qr1.png" style="height:66px;image-rendering:pixelated;">'
            ,mus:l=>{const u=(l.match(/https?:\/\/[^\s)]+/)||[''])[0];return '<a href="'+u+'">\u{1F3B5}</a>'+books.play.render.qr(u);}
            ,sent:s=>/[.!?\u2026]["'\u201D\u2019\u00BB]?$/.test(s.trim())
            ,head:p=>{const t=p.h&&p.h[1];if(!t)return '';const h=p.h[0]===2?'h2':'h3',s=books.play.render.slug(t);return '<'+h+(s?' id="'+s+'"':'')+'>'+books.play.render.esc(t)+(p.mu?' <a href="'+p.mu+'">\u{1F3B5}'+books.play.render.qr(p.mu):'')+'</'+h+'></a>'}
            ,page:p=>{return (p.pn?'<a id="p'+p.pn+'"></a>':'')+(p.t?'<h1>'+books.play.render.esc(books.play.md.title)+'</h1>':books.play.render.head(p)+p.ps.join('<br>'));}
            ,flow:a=>{let o='',br=1;a.forEach(p=>{const f=books.play.render.page(p);o+=o?(br?'<br>':' ')+f:f;br=p.e?1:0;});return o;}
            ,views:()=>[
                ()=>['<h1>'+books.play.render.esc(books.play.md.title)+'</h1>'+books.play.render.flow(books.play.md.pages)]
                ,()=>books.play.md.chs.map(books.play.render.flow)
                ,()=>books.play.md.subs.map(books.play.render.flow)
                ,()=>[{t:1}].concat(books.play.md.pages).map(books.play.render.page)
            ][books.play.render.mode]()
            ,reset:()=>{books.play.render.mode=0;books.play.render.idx=0;books.play.render.setMode();books.play.render.el.title.textContent=books.play.md.title;books.play.render.toc();}
            ,draw:()=>{
                const v=books.play.render.views();
                books.play.render.idx=Math.max(0,Math.min(v.length-1,books.play.render.idx));
                books.play.render.el.page.innerHTML=v[books.play.render.idx];
                books.play.render.el.prev.hidden=books.play.render.el.next.hidden=books.play.render.mode===0;
            }
            ,show:k=>{books.play.render.idx=k;books.play.render.draw();}
            ,cycle:()=>{books.play.render.mode=(books.play.render.mode+1)%4;books.play.render.setMode();books.play.render.toc();books.play.render.draw();}
            ,hash:()=>{
                const h=location.hash.toLowerCase().slice(1);
                if(!h)return;
                const pn=/^p\d+$/.test(h);
                books.play.render.mode=0;
                const t=pn?null:books.play.md.pages.find(pg=>pg.h&&books.play.render.slug(pg.h[1]).startsWith(books.play.render.slug(h)));
                if(!pn&&!t)return;
                books.play.render.setMode();books.play.render.toc();books.play.render.draw();
                document.getElementById(t?books.play.render.slug(t.h[1]):h).scrollIntoView();
            }
        }
        ,wire:()=>{
            dbNav.onclick=ev=>{
                const a=ev.target.closest('a[data-book],a[data-i]');
                if(!a)return;
                if(a.dataset.book){books.play.pick(a.dataset.book);return;}
                books.play.render.mode=+a.dataset.m;books.play.render.idx=+a.dataset.i;books.play.render.setMode();books.play.render.toc();books.play.render.draw();
            };
            window.onhashchange=()=>books.play.render.hash();
            lang.onclick=books.play.lang;
            books.play.lang();
        }
    }
};
books.play.wire();