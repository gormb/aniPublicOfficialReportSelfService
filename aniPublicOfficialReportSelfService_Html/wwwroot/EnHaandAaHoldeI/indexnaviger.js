const nav = {
    init: () => {
        nav.c.n = document.getElementById('n');
        nav.c.sect = Array.from({ length: 9 }, () =>
            nav.c.n.appendChild(Object.assign(document.createElement('div'), {
                onclick: nav.h
            }))
        );
        nav.p();
    },
    c: {},
    d: [
        ["Thompson", "Blogger", "Bjørnebo"],
        ["URIKS", "FOCUS", "SPORT"],
        ["Detaljer", "Oppsummer", "Del"]
    ],
    p: (d = nav.d) => nav.c.sect.forEach((cell, i) =>
        cell.textContent = d[Math.floor(i / 3)][i % 3]
    ),
    h: e => console.log(`Clicked: ${e.target.textContent}`)
};

nav.init();