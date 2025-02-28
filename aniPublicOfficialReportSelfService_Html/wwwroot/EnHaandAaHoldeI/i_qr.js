/////////////// qr-code ///////////////
const qr = {
    init: () => {},
    imgData: t => {
        const s = 21, m = Array(s).fill().map(() => Array(s).fill(0));
        let b = '';
        for (let i = 0; i < t.length; i++) b += t.charCodeAt(i).toString(2).padStart(8, '0');
        
        // Finder patterns
        for (let p of [[0,0], [14,0], [0,14]]) {
            for (let i = 0; i < 7; i++) {
                m[p[1]][p[0]+i] = m[p[1]+6][p[0]+i] = 1;
                m[p[1]+i][p[0]] = m[p[1]+i][p[0]+6] = 1;
            }
            for (let i = 2; i < 5; i++) for (let j = 2; j < 5; j++) m[p[1]+i][p[0]+j] = 1;
        }
        
        // Data
        let d = 0;
        for (let c = 20; c >= 0 && d < b.length; c -= 2) {
            for (let r = c % 4 < 2 ? 0 : 20; c % 4 < 2 ? r <= 20 : r >= 0; r += c % 4 < 2 ? 1 : -1) {
                if (m[r][c] === 0 && d < b.length) m[r][c] = +b[d++];
                if (c-1 >= 0 && m[r][c-1] === 0 && d < b.length) m[r][c-1] = +b[d++];
            }
        }
        
        let svg = `<svg width="${s}" height="${s}">`;
        for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) if (m[y][x]) svg += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
        svg += '</svg>';
        
        return btoa(svg); // Konverterer SVG til Base64
    },
    svg: (t = window.location.href, sz = 20, u = 'dvw') => {
        return `<img src="data:image/svg+xml;base64,${qr.imgData(t)}" style="width:${sz}${u};height:${sz}${u}"/>`;
    }
}

function qrtest() { document.write(qr.svg()) }
qrtest();