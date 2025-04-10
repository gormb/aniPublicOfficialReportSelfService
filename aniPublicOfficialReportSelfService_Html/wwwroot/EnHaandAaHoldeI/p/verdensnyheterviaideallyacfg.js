// Felles config; skjul menyer set visuell profil
cfg.visAppMeny(false)^ui.c.ImgAVugg(3,1);
ui.c.ImgA = 'https://news.ideallya.com/icons/Icon-maskable-512.png';

setTimeout(()=>msgSend('gpt4search'), 1000);
setTimeout(()=>msgSend(new Date().toLocaleDateString('no-NO', { day: '2-digit', month: 'long', year: 'numeric' })), 2000);

document.documentElement.style.setProperty('--primary-color', '#00f');
document.documentElement.style.setProperty('--font-family', "'Roboto', sans-serif");
