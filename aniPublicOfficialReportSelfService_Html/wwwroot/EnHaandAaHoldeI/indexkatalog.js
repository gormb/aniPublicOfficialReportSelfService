cfg.set=()=>{}

(async () => {
  await qr.i();
  const baseUrl = 'https://gormb.github.io/aniPublicOfficialReportSelfService/aniPublicOfficialReportSelfService_Html/wwwroot/EnHaandAaHoldeI/?';
  const data = cfg.appProviderM('admin');
  const menu = document.getElementById('appMenu');
  const search = document.getElementById('searchInput');
  const items = [];

  data.forEach(([temaRaw, grupper]) => {
    if (typeof temaRaw !== 'string' || temaRaw.includes('<<')) return;
    const tema = temaRaw.replace(' >>§-', '');
    const h2 = document.createElement('h2');
    h2.textContent = tema;
    menu.appendChild(h2);

    for (let i = 0; i < grupper.length; i += 2) {
      const gruppeRaw = grupper[i];
      const apper = grupper[i + 1];
      if (typeof gruppeRaw !== 'string' || !Array.isArray(apper) || gruppeRaw.includes('<<')) continue;

      const gruppe = gruppeRaw.replace(' >>§-', '');
      const h3 = document.createElement('h3');
      h3.textContent = gruppe;
      menu.appendChild(h3);

      const ul = document.createElement('ul');

      apper.forEach(app => {
        if (typeof app !== 'string' || app.includes('<<')) return;

        const url = baseUrl + encodeURIComponent(app.trim());
        const li = document.createElement('li');
        li.dataset.app = app.toLowerCase();

        const link = document.createElement('a');
        link.href = url;
        link.textContent = app;

        const qrBtn = document.createElement('button');
        qrBtn.className = 'qr-button-large';
        qrBtn.innerHTML = '📱 QR-kode';

        const qrHolder = document.createElement('div');
        qrHolder.className = 'qr-inline';
        qrHolder.style.display = 'none';

        cfg.load('noenkelnavigatr').then(()=>console.warn)

        qrBtn.onclick = () => {
          if (qrHolder.childNodes.length === 0) {
            qr.g(qrHolder, url, 0.4); // Lazy-generate QR
          }
          qrHolder.style.display = qrHolder.style.display === 'none' ? 'block' : 'none';
        };

        li.append(link, qrBtn, qrHolder);
        ul.appendChild(li);
        items.push(li);
      });

      menu.appendChild(ul);
    }
  });

  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    items.forEach(li => {
      li.style.display = li.dataset.app.includes(q) ? '' : 'none';
    });
  });
})();
