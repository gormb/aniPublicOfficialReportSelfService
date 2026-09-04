// Minimal book viewer for b_NO_FREE.md
// # = tittel, ## = kapittel, ### = underkapittel, #### = sideskift
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inline(s) {
  return esc(s).replace(
    /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))|(https?:\/\/[^\s)]+)/g,
    (m, c, b, i, l, u) => {
      if (c) return "<code>" + c.slice(1, -1) + "</code>";
      if (b) return "<strong>" + b.slice(2, -2) + "</strong>";
      if (i) return "<em>" + i.slice(1, -1) + "</em>";
      if (l) { const a = l.match(/^\[([^\]]*)\]\(([^)]+)\)/); return '<a target="_blank" rel="noopener" href="' + a[2] + '">' + a[1] + "</a>"; }
      return '<a target="_blank" rel="noopener" href="' + u + '">' + u + "</a>";
    }
  );
}

function parse(md) {
  const lines = md.split(/\r?\n/);
  const title = (lines[0] || "").replace(/^#\s*/, "").trim() || "Forside";
  const pages = [];
  let p = null;
  const flush = () => { if (p && p.buf.length) { p.body += "<p>" + p.buf.join(" ") + "</p>"; p.buf = []; } };
  const page = (n, tag, txt) => {
    flush();
    p = { n: +(n || (pages.length ? pages[pages.length - 1].n + 1 : 1)), tag: tag || "", txt: txt || "", body: "", buf: [] };
    pages.push(p);
  };
  for (const line of lines.slice(1)) {
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length, txt = h[2].trim();
      const n = (txt.match(/p\.\s*(\d+)/i) || [])[1];
      if (lvl === 2 || lvl === 3)
        page(n, lvl === 2 ? "h2" : "h3", txt.replace(/\s*[–—-]\s*p\.\s*\d+\s*$/i, "").trim());
      else if (lvl >= 4)
        page(n); // #### = sideskift
    } else if (/^\s*$/.test(line)) {
      flush();
    } else {
      if (!p) page(1);
      p.buf.push(inline(line));
    }
  }
  flush();
  return { title, pages };
}

const sec = document.getElementById("page"),
  meta = document.getElementById("meta"),
  prv = document.getElementById("prev"),
  nxt = document.getElementById("next");
let views = [], i = 0, bookTitle = "";

function show(k) {
  i = Math.max(0, Math.min(views.length - 1, k));
  const v = views[i];
  sec.className = "page" + (v.cover ? " cover" : "");
  let html;
  if (v.cover) html = "<h1>" + esc(bookTitle) + "</h1>";
  else {
    const tag = v.tag ? "<" + v.tag + ">" + inline(v.txt) + "</" + v.tag + ">" : "";
    html = tag + v.body;
  }
  sec.innerHTML = html;
  sec.scrollTop = 0;
  meta.textContent = (v.cover ? "Forside" : "p. " + v.n) + "  ·  " + (i + 1) + " / " + views.length;
  prv.disabled = i === 0;
  nxt.disabled = i === views.length - 1;
  document.title = v.cover ? bookTitle : bookTitle + " — p. " + v.n;
}

fetch("b_NO_FREE.md")
  .then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
  .then((md) => {
    const book = parse(md);
    bookTitle = book.title;
    views = [{ cover: 1 }].concat(book.pages);
    prv.onclick = () => show(i - 1);
    nxt.onclick = () => show(i + 1);
    addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(i - 1);
      if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
      if (e.key === " ") { e.preventDefault(); show(i + 1); }
    });
    show(0);
  })
  .catch(() => { sec.innerHTML = "<p>Kunne ikke laste <code>b_NO_FREE.md</code> — server filene over http://.</p>"; });
