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
    dDesc.innerHTML=aiPromptWelcome;
  },1000);
  // document.documentElement.style.setProperty('--primary-color', priCol??'#007bff');
  // document.documentElement.style.setProperty('--light-msg', lightMCol??'#ffffff');
  // ui.font.n(font??'Roboto')
} //cfg.set(cfg_aiPromptWelcome,'KIROS-konsulent','gpt4nano','p/kirosassistent.webp','v,5,2','rgb(57,120,19)',null,'Inter')

let iC=0,iTot=9999;

(async () => {
  try {
    await qr.i();
    //qr.g(document.getElementById('urqr'), window.location.href, 0.25);
    const data = cfg.appProviderM();
    const menu = document.getElementById('appMenu');
    const search = document.getElementById('searchInput');
    const items = [];

    const createAppListItem = (app, url) => {
      let id=app.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const li = document.createElement('li');
      li.setAttribute('data-app', app.toLowerCase());
      
      li.append(
        Object.assign(document.createElement('a'), { href: url, textContent: app })
        //, qrHolder
        , Object.assign(document.createElement('div'), { id: 'qr_' + id, textContent: 'laster QR...' })
        , Object.assign(document.createElement('img'), { id:'img_'+id, src:ui.c.ImgA, style:'height:5vw'})
        , Object.assign(document.createElement('div'), { id: 'set_' + id, textContent: 'laster beskrivelse...' })
        , Object.assign(document.createElement('button'), {
          textContent: 'v', onclick: () => {
            const iframe = document.getElementById('ifr_' + id);
            iframe.style.display = iframe.style.display === 'none' ? '' : 'none';}})
        , Object.assign(document.createElement('iframe'), { id: 'ifr_' + id, src: url, style: 'display:none;height:40vw' })
      );
      cfg.load(app);
      return li;
    };

    data.forEach(([temaRaw, grupper]) => {
      const section = document.createElement('div');
      section.classList.add('section');
      const header = document.createElement('h2');
      header.textContent = temaRaw.split('>>')[0];
      section.appendChild(header);
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
                const li = createAppListItem(app, url);
                ul.appendChild(li);
                items.push(li);
              }
          });
          groupDiv.appendChild(ul);
          section.appendChild(groupDiv);
        }
      menu.appendChild(section);
    });

    // Search filtering
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
            groupVisible = groupVisible || appMatches;  // Mark group as visible if any app matches
          });

          group.style.display = groupVisible ? '' : 'none';  // Show group if it's visible
          sectionVisible = sectionVisible || groupVisible;  // Mark section as visible if any group is visible
        });

        section.style.display = sectionVisible ? '' : 'none';  // Show section if any group is visible
      });
    });

  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
