const books={
    play:{
        md:{
            fn:'',txt:'',title:'',pages:[],chs:[],subs:[]
            ,books:['LifeDemandedDeath','CV','ABook']
            ,set:_fn=>{if(_fn!==books.play.md.fn){books.play.md.fn=_fn;books.play.md.load();}}
            ,load:()=>fetch(books.play.md.fn,{cache:'no-store'}).then(r=>r.text()).then(t=>{books.play.md.txt=t;books.play.md.parse();}).catch(()=>{books.play.render.el.page.innerHTML='Fant ikke '+books.play.md.fn;})
            ,parse:()=>{
                const md=books.play.md.txt.split(/\n/);
                books.play.md.title=md[0].replace(/^#\s*/,'').trim();
                books.play.md.pages=[];books.play.md.pgs=[];
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
                        if(!_m&&_l)books.play.md.pgs.push({pn:cur.pn||0,txt:_l});
                        if(cur.h&&!cur.ps.length&&!par.length&&_m&&_l.match(/https?:\/\/[^\s)]+/))cur.mu=_l.match(/https?:\/\/[^\s)]+/)[0];
                        else par.push(_m?books.play.render.mus(_l):books.play.render.esc(_l));
                        last=_l;
                    }
                });
                flush();
                if(cur&&(cur.h||cur.ps.length)){cur.e=books.play.render.sent(last);books.play.md.pages.push(cur);}
                books.play.md.sts=[];
                books.play.md.pgs.forEach(p=>{const ss=books.play.render.sentT(p.txt);ss.forEach(s=>books.play.md.sts.push({pn:p.pn,txt:s}));});
                books.play.md.tr=[];
                md.slice(1).forEach(l=>{const h=l.match(/^(#{2,4})\s+(.*)$/),s=l.trim(),_m=/^\u{1F3B5}/u.test(s);if(h)books.play.md.tr.push({h:1,d:h[1].length-2,t:h[2].trim()});else if(s&&!_m)books.play.md.tr.push({h:0,t:s});});
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
        ,book:'LifeDemandedDeath',lg:'NO',ed:'PREM',shelf:null
        ,fnOf:()=>'b/'+books.play.book+'/b_'+books.play.lg+'_'+books.play.ed+'.md'
        ,open:(lg,ed)=>{books.play.lg=lg||books.play.lg;books.play.ed=ed||books.play.ed;lang.textContent=books.play.lg==='NO'?'🇳🇴':'🇬🇧';ver.textContent=books.play.ed==='PREM'?'👑':'🔓';books.play.md.set(books.play.fnOf());}
        ,lang:()=>{books.play.open(/NO_/.test(books.play.md.fn)?'EN':'NO');}
        ,ver:()=>{books.play.open(books.play.lg,books.play.ed==='PREM'?'FREE':'PREM');}
        ,pick:b=>{books.play.book=b;books.play.open(/NO_/.test(books.play.md.fn)?'NO':'EN');}
        ,probe:async()=>{
            const cs=[];
            books.play.md.books.forEach(b=>['NO','EN'].forEach(lg=>['FREE','PREM'].forEach(ed=>cs.push({book:b,lg,ed,fn:'b/'+b+'/b_'+lg+'_'+ed+'.md'}))));
            const ok=[];
            for(const c of cs){let good=false;try{const r=await fetch(c.fn,{cache:'no-store'});good=r.ok;}catch(e){}if(good)ok.push(c);}
            books.play.shelf=ok;
        }
        ,LV:[
            {pl:'pl0',no:'Bokhylle',en:'Book Shelf',q:'Hvilke bøker er relevante for gitt innhold?',nav:'List of books (Book versions)',page:'Available languages and versions for chosen book as links',thoughts:'At shelf scale the units are books, which are filtered by concept, genre and language. Each book can be in different versions and languages (especially now premium/freemium and NO/EN but later also eg DK) The nav jumps straight to a book, which then acts as parent for the finer levels below it.',child:[{t:'Hvilken bok? og versjon?',w:'The shelf is the entry point: pick a book (LifeDemandedDeath, CV, ABook) plus variant – language (NO/EN) × edition (FREE/PREM). The variant pins the source file b/{book}/b_{NO|EN}_{FREE|PREM}.md.'},{t:'Konsept eller sjanger',w:'Filter the shelf by concept or genre (memoir, fiction, essay) so a theme-led reader reaches the right book without knowing the title in advance.'},{t:'Stil eller språk',w:'Style (poetic/plain) and language narrow the shelf further, and are reused as filters at the deeper levels described in pl_dev_0.'}]}
            ,{pl:'pl1',no:'Bokeksemplar',en:'Book Copy',q:'Hva er den overordnede strukturen for innholdet?',nav:'Main Chapters of Book version (Book on shelf with chapters)',page:'Subchapters of Main Chapter chosen, all if none selected, text in details-tags (summary subchapter name)',thoughts:'At book scale the units are chapters (##) and their sub-sections (###); the nav jumps straight to a chapter, which then acts as parent for the finer levels below it.',child:[{t:'Hvilket kapittel?',w:'At book scale the units are chapters (##) and their sub-sections (###); the nav jumps straight to a chapter, which then acts as parent for the finer levels below it.'},{t:'«Hero\u2019s Journey» – hvilken fase?',w:'Annotate each chapter against the narrative arc (call, ordeal, return…) so readers see where the structure is conventional and where it deliberately breaks.'},{t:'Hva bør jobbes med',w:'Collect book-scale improvements – chapters that are too thin, too dense or out of order – as the work queue that the finer zoom levels then act on.'}]}
            ,{pl:'pl2',no:'Hovedkapittel',en:'Main Chapter',q:'Hva er i denne Main Chapter, og hva er Sub Chapters?',nav:'Selected Main Chapter and Sub Chapters for it',page:'Selected Sub Chapter, all if none selected',thoughts:'At Main Chapter scale the units are groups of chapters that share a theme; the section acts as the coarser parent of its chapters.',child:[{t:'Hvilke kapitler?',w:'List the chapters inside this section and their order.'},{t:'Hvilket tema?',w:'The theme or arc that binds the section\u2019s chapters together.'},{t:'Hva bør jobbes med',w:'Section-level improvements: pacing, ordering and balance across chapters.'}]}
            ,{pl:'pl3',no:'Underkapittel',en:'Sub Chapter',q:'Hva er i dette Sub Chapter?',nav:'todo',page:'todo',thoughts:'At Sub Chapters scale the units are single chapters; the nav jumps into the chapter and its pages.',child:[{t:'Hvilke sider?',w:'Which pages belong to the chapter, and in which order.'},{t:'Hva skjer?',w:'What the chapter advances in the story or argument.'},{t:'Hva bør jobbes med',w:'Chapter-level improvements: too thin, too dense or out of order.'}]}
            ,{pl:'pl4',no:'Bokside',en:'Page',q:'Hva er på denne siden?',nav:'todo',page:'todo',thoughts:'At page scale the units are pages (with p.N anchors); the nav jumps between pages.',child:[{t:'Hvilke paragrafer?',w:'The paragraphs that make up this page.'},{t:'Hva formidles?',w:'What the page communicates: content, mood or key point.'},{t:'Hva bør jobbes med',w:'Page-level polish: flow, rhythm and visual balance.'}]}
            ,{pl:'pl5',no:'Paragraf',en:'Paragraph',q:'Hva er i denne paragrafen?',nav:'todo',page:'todo',thoughts:'At paragraph scale the units are paragraphs – blocks of related sentences.',child:[{t:'Hvilke setninger?',w:'The sentences that build this paragraph.'},{t:'Hva sies?',w:'The paragraph\u2019s main point or idea.'},{t:'Hva bør jobbes med',w:'Paragraph-level edits: clarity, rhythm and transitions.'}]}
            ,{pl:'pl6',no:'Setning',en:'Sentence',q:'Hva er i denne setningen?',nav:'todo',page:'todo',thoughts:'At sentence scale the units are sentences; grammar and style tools live here.',child:[{t:'Hvilke ord?',w:'The words that form the sentence and their roles.'},{t:'Hva betyr den?',w:'The meaning and function of the sentence in context.'},{t:'Hva bør jobbes med',w:'Sentence-level improvements: grammar, word order and tone.'}]}
            ,{pl:'pl7',no:'Ord',en:'Word',q:'Hva er i dette ordet?',nav:'todo',page:'todo',thoughts:'At word scale the units are words: meaning, inflection and what to improve. Word-level features (lookup, glossary) apply here and deeper.',child:[{t:'Hva betyr ordet',w:'Look up meaning, inflections and usage – the finest content level where dictionary lookup applies.'},{t:'Hva bør jobbes med',w:'Which word needs editorial attention: clarity, style or accuracy.'}]}
            ,{pl:'pl8',no:'Bokstav',en:'Character',q:'Hva er i denne bokstaven?',nav:'todo',page:'todo',thoughts:'At glyph scale the units are letters: font, size, ligatures and kerning shape how the word is set. Typography features live here.',child:[{t:'Font',w:'Which typeface renders the glyph; changing font restyles the whole letter.'},{t:'Size',w:'Point size of the glyph, e.g. relative to body text.'},{t:'Dekorasjon / ligaturer',w:'Stylistic variants and ligature pairs (fi, fl) that join glyphs.'},{t:'Tegnavstand (kerning)',w:'Space between letter pairs; pairs naturally with ligatures at glyph level.'}]}
            ,{pl:'pl9',no:'Medieform',en:'Media Form',q:'Forgrunn og bakgrunn',nav:'todo',page:'todo',thoughts:'At glyph scale the units are letters: font, size, ligatures and kerning shape how the word is set. Typography features live here.',child:[{t:'Color',w:'Which color renders the glyph; changing color restyles the whole letter.'},{t:'Background',w:'Which background color renders behind the glyph; changing background restyles the whole letter.'}]}
        ]
        ,up:{pl0:null,pl1:'pl0',pl2:'pl1',pl3:'pl2',pl4:'pl3',pl5:'pl3',pl6:'pl5',pl7:'pl6',pl8:'pl4',pl9:'pl8'}
        ,child:pl=>books.play.LV.filter(x=>books.play.up[x.pl]===pl).map(x=>x.pl)
        ,ancestors:pl=>{const a=[];let p=books.play.up[pl];while(p){a.unshift(p);p=books.play.up[p];}return a;}
        ,path:pl=>books.play.ancestors(pl).concat(pl)
        ,chain:pl=>books.play.path(pl).map(p=>{const L=books.play.LV.find(x=>x.pl===p);return L?L.no:'';}).filter(Boolean).join(' › ')
        ,loc:()=>({book:books.play.book,lg:books.play.lg,ed:books.play.ed,pg:0})
        ,step:(l,v,c)=>{
            const t=(v||'').toLowerCase().replace(/\s/g,''),o={lg:c.lg,ed:c.ed,book:c.book,pg:c.pg};
            if(l===0){
                if(/^(no|en)$/.test(t))o.lg=t.toUpperCase();
                else if(/^(pre|free)$/.test(t))o.ed=t==='pre'?'PREM':'FREE';
                else{const m=books.play.md.books.find(b=>{const n=b.toLowerCase();return n.startsWith(t)||n.includes(t);});if(m)o.book=m;}
            }else if(l===4&&/^\d+$/.test(t))o.pg=+t;
            return o;
        }
        ,ref:(p,c)=>((a,c0)=>a.length<2?c0:books.play.ref(a.slice(2),books.play.step(+a[0],a[1],c0)))(typeof p==='string'?p.split('_'):p,c||books.play.loc())
        ,render:{
            el:{page,nav:dbNavList,title:dbTitle,prev,next,lvBars}
            ,ic:['📚','📖','📑','📄','📃','¶','✍️','🔤','🔠','🎨']
            ,lv:[]
            ,ax:{t:['pl0','pl1','pl2','pl3','pl5','pl6','pl7'],p:['pl4','pl8','pl9']}
            ,mode:0,idx:0
            ,setMode:()=>{books.play.render.el.lvBars.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.lv===books.play.render.mode));}
            ,bar:()=>{const lv=books.play.render.lv,cld=books.play.child,btn=p=>{const o=lv[+p.slice(2)]||{pl:p,nm:p,ic:'•'};return '<button data-lv="'+(+p.slice(2))+'" title="'+o.pl+' '+o.nm+'">'+o.ic+'</button>';},td1=p=>'<td rowspan="2">'+btn(p)+'</td>',tdx=p=>'<td>'+btn(p)+'</td>',chain=p=>{const a=[p];let c=cld(p);while(c.length===1){a.push(c[0]);c=cld(c[0]);}return a;};let node='pl0',cc=cld(node);while(cc.length===1){node=cc[0];cc=cld(node);}const spine=books.play.path(node),cols=cld(node).slice().reverse().map(chain);books.play.render.el.lvBars.innerHTML='<table><tr>'+spine.map(td1).join('')+(cols[0]||[]).map(p=>'<td class="txt">'+btn(p)+'</td>').join('')+'<td rowspan="2" class="zm"><button data-zm="up" title="coarser">−</button></td></tr><tr>'+(cols[1]||[]).map(p=>'<td class="pag">'+btn(p)+'</td>').join('')+'</tr></table>';books.play.render.el.lvBars.onclick=ev=>{const x=ev.target.closest('button');if(!x)return;if(x.dataset.zm==='up'){const p=books.play.up['pl'+books.play.render.mode];if(p)books.play.render.go(+p.slice(2));}else if(x.dataset.lv!==undefined){books.play.render.go(+x.dataset.lv);}};books.play.render.setMode();}
            ,rowZoom:(r,d)=>{const ax=Object.values(books.play.render.ax)[r],i=ax.indexOf('pl'+books.play.render.mode);let j=(i<0?0:i)+d;j=Math.max(0,Math.min(ax.length-1,j));books.play.render.go(+ax[j].slice(2));}
            ,go:n=>{books.play.render.mode=n;books.play.render.setMode();books.play.render.toc();books.play.render.draw();books.play.render.sync();}
            ,toc:()=>{
                const ic={2:'📖',3:'📑'}
                ,a=(t,i,l,ico)=>t===''?'':'<a data-i="'+i+'" data-m="'+books.play.render.mode+'">'+'&nbsp;'.repeat(2*l)+ico+'&nbsp;'+books.play.render.esc(t)+'</a>'
                ,o=[
                    ()=>books.play.md.books.map(bk=>'<a data-book="'+bk+'">📚&nbsp;'+books.play.render.esc(bk)+'</a>')
                    ,()=>books.play.md.chs.map((ch,i)=>a(ch[0].h[1],i,0,'📖'))
                    ,()=>books.play.md.subs.map((su,i)=>a(su[0].h[1],i,su[0].h[0]===2?0:1,ic[su[0].h[0]]||'📑'))
                    ,()=>['']
                    ,()=>{let l=0;return books.play.md.pages.map((pg,i)=>pg.h?(l=pg.h[0]===2?0:1,a(pg.h[1],i+1,l,ic[pg.h[0]]||'📄')):pg.pn?a('p.'+pg.pn,i+1,l+1,'📄'):'');}
                    ,()=>{let o=[],d=0,pi=0;books.play.md.tr.forEach(r=>{if(r.h){d=r.d;o.push('<div class="th">'+'&nbsp;'.repeat(2*d)+books.play.render.esc(r.t)+'</div>');}else{o.push(a(r.t.slice(0,20),pi,d+1,'¶'));pi++;}});return o;}
                    ,()=>{let o=[],d=0,si=0;books.play.md.tr.forEach(r=>{if(r.h){d=r.d;o.push('<div class="th">'+'&nbsp;'.repeat(2*d)+books.play.render.esc(r.t)+'</div>');}else{const ss=books.play.render.sentT(r.t);ss.forEach(s=>{if(s){o.push(a(s.slice(0,20),si,d+1,'✍️'));si++;}});}});return o;}
                    ,()=>['']
                    ,()=>['']
                    ,()=>['']
                ];
                books.play.render.el.nav.innerHTML=o[books.play.render.mode]().join('');
            }
            ,esc:x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            ,slug:s=>(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'')
            ,spotKey:u=>{ // song code: gormb query (?msoe) or aigap path (/msoe) – gormb.github.io/?id har flyttet til aigap.no/id
                if(!u)return '';
                try{const p=new URL(u);
                    if(/^https:\/\/gormb\.github\.io\//.test(u))return p.search.slice(1);
                    if(/^https:\/\/aigap\.no\//.test(u))return p.pathname.replace(/^\//,'');
                }catch(e){}
                return '';
            }
            ,qr:u=>{const k=books.play.render.spotKey(u);return k?'<img src="https://aigap.no/i/'+k+'.qr1.png" style="height:66px;image-rendering:pixelated;">':'';}
            ,mus:l=>{const u=(l.match(/https?:\/\/[^\s)]+/)||[''])[0];return '<a href="'+u+'">\u{1F3B5}</a>'+books.play.render.qr(u);}
            ,sent:s=>/[.!?\u2026]["'\u201D\u2019\u00BB]?$/.test(s.trim())
            ,sentT:s=>(s.match(/[^.!?\u2026]+[.!?\u2026]+["'\u201D\u2019\u00BB]?|\S[^.!?\u2026]*$/g)||[]).map(x=>x.trim()).filter(Boolean)
            ,head:p=>{const t=p.h&&p.h[1];if(!t)return '';const h=p.h[0]===2?'h2':'h3',s=books.play.render.slug(t);return '<'+h+(s?' id="'+s+'"':'')+'>'+books.play.render.esc(t)+(p.mu?' <a href="'+p.mu+'">\u{1F3B5}'+books.play.render.qr(p.mu):'')+'</'+h+'></a>'}
            ,page:p=>{return (p.pn?'<a id="p'+p.pn+'"></a>':'')+(p.t?'<h1>'+books.play.render.esc(books.play.md.title)+'</h1>':books.play.render.head(p)+p.ps.join('<br>'));}
            ,flow:a=>{let o='',br=1;a.forEach(p=>{const f=books.play.render.page(p);o+=o?(br?'<br>':' ')+f:f;br=p.e?1:0;});return o;}
            ,views:()=>[
                ()=>['<h1>'+books.play.render.esc(books.play.md.title)+'</h1>'+books.play.render.flow(books.play.md.pages)]
                ,()=>books.play.md.chs.map(books.play.render.flow)
                ,()=>books.play.md.subs.map(books.play.render.flow)
                ,()=>[books.play.render.lv[3].nm+' – zoom inn fra «Boka» for å se sidene']
                ,()=>[{t:1}].concat(books.play.md.pages).map(books.play.render.page)
                ,()=>books.play.md.pgs.map(p=>books.play.render.esc(p.txt))
                ,()=>books.play.md.sts.map(s=>books.play.render.esc(s.txt))
                ,()=>[books.play.render.lv[7].nm+' – dette nivået er ikke implementert ennå']
                ,()=>[books.play.render.lv[8].nm+' – dette nivået er ikke implementert ennå']
                ,()=>[books.play.render.lv[9].nm+' – dette nivået er ikke implementert ennå']
            ][books.play.render.mode]()
            ,reset:()=>{books.play.render.mode=0;books.play.render.idx=0;books.play.render.setMode();books.play.render.el.title.textContent=books.play.md.title;books.play.render.toc();books.play.render.sync();}
            ,draw:()=>{
                const v=books.play.render.views();
                books.play.render.idx=Math.max(0,Math.min(v.length-1,books.play.render.idx));
                books.play.render.el.page.innerHTML=v[books.play.render.idx];
                books.play.render.hl();
            }
            ,hl:()=>{const m=books.play.render.mode;books.play.render.el.nav.querySelectorAll('a[data-i]').forEach(a=>a.classList.toggle('on',+a.dataset.m===m&&+a.dataset.i===books.play.render.idx));}
            ,lvitem:x=>{const up=books.play.ancestors(x.pl).map(p=>{const L=books.play.LV.find(l=>l.pl===p);return L?L.no:'';}).filter(Boolean).join(' › ');return '<li id="'+x.pl+'">'+(up?'<div class="lvpath">'+books.play.render.esc(up)+' ›</div>':'')+books.play.render.esc(x.no)+' <i>'+books.play.render.esc(x.en)+'</i> – '+books.play.render.esc(x.q)+(x.nav&&x.nav!=='todo'?'<details><summary>Nav shows</summary>'+books.play.render.esc(x.nav)+'</details>':'')+(x.page&&x.page!=='todo'?'<details><summary>Page shows</summary>'+books.play.render.esc(x.page)+'</details>':'')+(x.thoughts?'<details open><summary>Thoughts</summary>'+books.play.render.esc(x.thoughts)+'</details>':'')+(x.child&&x.child.length?'<details open><summary>Planned</summary><ol>'+x.child.map(c=>'<li>'+books.play.render.esc(c.t)+(c.w?'<details><summary>Thoughts</summary>'+books.play.render.esc(c.w)+'</details>':'')+'</li>').join('')+'</ol></details>':'')+'</li>';}
            ,guide:()=>{const g=document.getElementById('lvGuide');if(!g)return;g.innerHTML=books.play.LV.map(x=>books.play.render.lvitem(x)).join('');}
            ,sync:()=>{const L=books.play.LV[books.play.render.mode]||books.play.LV[0];const h=document.getElementById('dbPlayTitle');if(h)h.textContent=L.no+' – '+L.q;const c=document.getElementById('dpCur');if(c){c.className='cur '+(L.pl||'');c.textContent=L.en;}const g=document.getElementById('lvGuide');if(g)g.innerHTML=books.play.render.lvitem(L);books.play.render.ctl();}
            ,ctl:()=>{const c=document.getElementById('lvCtl');if(!c)return;const pl='pl'+books.play.render.mode,L=books.play.LV[books.play.render.mode]||books.play.LV[0],up=books.play.up[pl],kids=books.play.child(pl);let h='';kids.slice().reverse().forEach(k=>{const K=books.play.LV.find(x=>x.pl===k);h+='<button data-go="'+k.slice(2)+'" title="finer: '+(K?K.no:k)+'">+</button>';});c.innerHTML=h;c.onclick=ev=>{const x=ev.target.closest('button');if(!x||x.dataset.go===undefined)return;if(x.dataset.go==='up'){const p=books.play.up['pl'+books.play.render.mode];if(p)books.play.render.go(+p.slice(2));}else books.play.render.go(+x.dataset.go);};}
            ,show:k=>{books.play.render.idx=k;books.play.render.draw();}
            ,nav:d=>{
                if(books.play.render.mode!==0){books.play.render.show(books.play.render.idx+d);return;}
                const s=books.play.shelf;
                if(!s||!s.length)return;
                const cur=books.play.md.fn;
                let i=s.findIndex(x=>x.fn===cur); if(i<0)i=0;
                i=(i+d+s.length)%s.length;
                const it=s[i];
                books.play.book=it.book;
                books.play.open(it.lg,it.ed);
            }
            ,zoom:d=>{books.play.render.go(Math.max(0,Math.min(books.play.render.lv.length-1,books.play.render.mode+d)));}
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
            ver.onclick=books.play.ver;
            books.play.render.lv=books.play.render.ic.map((ic,i)=>({pl:(books.play.LV[i]&&books.play.LV[i].pl)||'pl'+i,ic,nm:(books.play.LV[i]&&books.play.LV[i].no)||''}));
            books.play.render.bar();
            books.play.render.guide();
            books.play.probe();
            books.play.lang();
        }
    }
};
books.play.wire();