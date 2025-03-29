/////////////// QR-code /////////////////
const qr = {
    i:(s='https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js')=>window.QRCodeStyling?Promise.resolve():new Promise(r=>document.head.appendChild(Object.assign(document.createElement("script"),{src:s,onload:r})))
    ,sz:r=>Math.floor(Math.min(innerWidth,innerHeight)*r)
    ,g:(c,u=window.location.href,s=.5,i=ui.c.ImgA)=>new QRCodeStyling(
        {width:qr.sz(s),height:qr.sz(s),data:u,image:i}).append(c)
    ,d:(u,p=document.body,s,i)=>qr.i().then(()=>qr.g(p.appendChild(Object.assign(document.createElement("div"),{style:`width:${s}px`})),u,s,i))
}
qr.i()
