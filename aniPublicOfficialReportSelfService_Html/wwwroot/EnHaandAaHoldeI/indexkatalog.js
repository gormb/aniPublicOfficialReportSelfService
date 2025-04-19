const baseUrl = 'https://gormb.github.io/aniPublicOfficialReportSelfService/aniPublicOfficialReportSelfService_Html/wwwroot/EnHaandAaHoldeI/?';

cfg.set=(aiPromptWelcome,appN,ai,iA,iEffekt,priCol,lightMCol,font)=>{
  cfg.aiPromptWelcome=aiPromptWelcome
  cfg.app=appN;
  const id=appN.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  , dQr=document.getElementById('qr_'+id), img=document.getElementById('img_'+id)
  , dDesc=document.getElementById('set_'+id)
  dQr.innerText='';
  if (iA) img.src=iA;
  qr.g(dQr, baseUrl+id, 0.45, img.src);
  setTimeout(()=>{
    img.style.display='none';
    
    dDesc.innerHTML=`<div style="padding:1vw;border-radius:1vw
      ;font-family:${ui.font.n(font??'Roboto')};color:${lightMCol??'#ffffff'};background:${priCol??'#007bff'}">
      ${aiPromptWelcome}</div>`;
  },500);
} //cfg.set(cfg_aiPromptWelcome,'KIROS-konsulent','gpt4nano','p/kirosassistent.webp','v,5,2','rgb(57,120,19)',null,'Inter')

let iC=0,iTot=9999;

(async()=>{
    await qr.i();
    qr.g(document.getElementById('urqr'), window.location.href, 0.25, 'p/aigap.webp');
    const items=[], data=cfg.appProviderM(), menu=document.getElementById('appMenu'), search=document.getElementById('searchInput');
    const createAppListItem = (app, url) => {
      const li = document.createElement('li');
      li.setAttribute('data-app', app.toLowerCase());
      app=app.split('|')[0];
      let id=app.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      li.append(
        Object.assign(document.createElement('a'), { href: url, textContent: app })
        , Object.assign(document.createElement('div'), { id: 'qr_' + id, innerHTML: ui.c.tRotating /*'laster QR...'*/ })
        , Object.assign(document.createElement('img'), { id:'img_'+id, src:ui.c.ImgA, style:'height:5vw'})
        , Object.assign(document.createElement('button'), {
          textContent: '👀', onclick: () => {
            const f=document.getElementById('ifr_'+id),d=f.style.display;
            f.style.display=d=='none'?'':'none';
            document.getElementById('set_'+id).style.display=d==''?'':'none';
          }})
          , Object.assign(document.createElement('div'), { id: 'set_' + id, innerHTML: ui.c.tRotating /*'laster beskrivelse...'*/ })
          , Object.assign(document.createElement('iframe'), { id: 'ifr_' + id, src: url, style: 'display:none' })
      );
      cfg.load(app);
      return li;
    };
    data.forEach(([temaRaw, grupper]) => {
      const section = document.createElement('div');
      section.classList.add('section');
      section.appendChild(Object.assign(document.createElement('h2'),{textContent:temaRaw.split('>>')[0]}));
      for (let i = 0; i < grupper.length; i += 2) {
        const [gruppeRaw, apper] = [grupper[i], grupper[i + 1]];
          const groupDiv = document.createElement('div');
          groupDiv.classList.add('group');
          groupDiv.appendChild(Object.assign(document.createElement('h3'), { textContent: gruppeRaw.split('>>')[0]}));
          const ul = document.createElement('ul');
          apper.forEach(app => {
            if (iC++<iTot)
              if (typeof app === 'string' && !app.includes('<<')) {
                const url = baseUrl + encodeURIComponent(app.trim());
                const li = createAppListItem(app+'|'+gruppeRaw.split('>>')[0]+'|'+temaRaw.split('>>')[0], url);
                ul.appendChild(li);
                items.push(li);
              }
          });
          groupDiv.appendChild(ul);
          section.appendChild(groupDiv);
        }
      menu.appendChild(section);
    });
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => {
        let sectionVisible = false;
        const groups = section.querySelectorAll('.group');
        groups.forEach(group => {
          const apps = group.querySelectorAll('li');
          let groupVisible = false;
          apps.forEach(app => {
            const appData = app.getAttribute('data-app');
            const appMatches = appData.includes(q);
            app.style.display = appMatches ? '' : 'none';
            groupVisible = groupVisible || appMatches;
          });
          group.style.display = groupVisible ? '' : 'none';
          sectionVisible = sectionVisible || groupVisible;
        });
        section.style.display = sectionVisible ? '' : 'none';
      });
    });
    (q => q && (search.value = q, search.dispatchEvent(new Event('input')), search.style.display = 'none'))(new URLSearchParams(location.search).get('q'));
})();
