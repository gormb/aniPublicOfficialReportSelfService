const ui = {
    sz() {
        let w = window.innerWidth;
        let h = window.innerHeight - _book.offsetTop;

        w *= 2;

        const aRatio = (2 * 4.13) / 5.83;

        if (w > h * aRatio)
            w = h * aRatio;

        _fBook.style.width = w + "px";
        _fBook.style.height = h + "px";
    }
};

ui.sz();
window.onresize = ui.sz;