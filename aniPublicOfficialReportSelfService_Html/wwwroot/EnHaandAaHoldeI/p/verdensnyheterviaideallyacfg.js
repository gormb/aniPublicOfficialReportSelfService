cfg_aiPromptWelcome = `Velkommen til chat om nyheter.

<i>Vi prioriterer personvern. Spørsmål lagres ikke hos oss, og all data behandles i samsvar med GDPR. 
For mer informasjon, se under Sikkerhet >> Personvern.</i>

Lær mer på <a href="https://news.ideallya.com">Ideallya</a>
Hva vil du lese om?

1️⃣ Geopolitiske konflikter – Krig, droneangrep, regioner med ustabilitet
2️⃣ Menneskerettigheter og FN-oppdateringer – Kvinners rettigheter, funksjonshemmede, FN-resolusjoner
3️⃣ Politiske endringer og regjeringer – Arrestasjoner, valg, uavhengighetsavstemninger
4️⃣ Økonomi og næringsliv – Markedsoppdateringer, handel, bedrifter
`;
// Felles config; skjul menyer set visuell profil
cfg.set(cfg_aiPromptWelcome,'Verdensnyheter via Ideallya','gpt4search','https://news.ideallya.com/icons/Icon-maskable-512.png','v,3,1','#00f',null,'Roboto')
