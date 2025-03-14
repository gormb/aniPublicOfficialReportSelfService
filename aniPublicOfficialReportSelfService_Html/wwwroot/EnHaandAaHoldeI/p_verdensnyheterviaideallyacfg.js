// Felles config; skjul menyer set visuell profil
msgSend('groklatest')^cfg.visAppMeny(false)^ui.c.ImgAVugg(3,1);
ui.c.ImgA = 'https://news.ideallya.com/icons/Icon-maskable-512.png';
ui.c.ImgQrUrl = 'p_verdensnyheterviaideallya.png'

document.documentElement.style.setProperty('--primary-color', '#00f');
document.documentElement.style.setProperty('--font-family', "'Roboto', sans-serif");

