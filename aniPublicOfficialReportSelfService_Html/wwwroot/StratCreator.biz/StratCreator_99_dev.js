document.write("<div class=\"debug\">Code for dev...</div>");

class Wc {
    constructor(canv=null, head=null, textarea=null, textareaUsual=null, textareaIgnore=null, waitUpd=1000, waitIgn=2000) {
        const i = Math.floor(1000 + Math.random() * 1000);
        const j = Math.floor(1000 + Math.random() * 1000); 
        this.head = Wc.c(head, `wc_h${i}${j}`, `<h3 id="wc_h${i}${j}">...</h3>`);
        this.canv = Wc.c(canv, `wc_canv${i}${j}`, `<canvas id="wc_canv${i}${j}">...</canvas>`);
        this.textarea = Wc.c(textarea, `wc_inputtext${i}${j}`, `<textarea id="wc_inputtext${i}${j}">...</textarea>`);
        this.textareaUsual = textareaUsual;
        this.wordsIgnore = !textareaIgnore?[]:textareaIgnore.value.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/).filter(w => w);;
        this.waitUpd = waitUpd;
        this.waitIgn = waitIgn;
        this.ctx = canv.getContext('2d');
        this.prevFreq = {};
        this.debounceTimer = null;
        this.debounceTimerIgnore = null;
        this.threshold = 0.2; // 20% change threshold
        this.bindEvents();
        this.update();
    }
    static c(asis, id, htm) { // if asis is element, return it, if text replace '...' in htm with the text, else insert htm.
        if (asis instanceof Element) return asis;
        document.body.insertAdjacentHTML('beforeend', htm.replace('...', asis?asis:'....'));
        return document.getElementById(id);
    }
    static n(textareaUsual=null, textareaIgnore=null, i=0, j=0, canv=null, head=null, textarea=null, waitUpd=1000, waitIgn=2000) {
        const ret = new Wc(canv, head, textarea, textareaUsual, textareaIgnore, waitUpd, waitIgn);
        //Wc.setpos(ret.head, ret.textarea, ret.canv, i, j);
        const w = ret.canv.parentElement.clientWidth / 4;
        const h = w / 1.618;
        ret.head.style.position = ret.textarea.style.position = ret.canv.style.position = 'absolute';
        ret.head.style.left = ret.textarea.style.left = ret.canv.style.left = (i +.5) * w + 'px';
        ret.head.style.width = ret.textarea.style.width = ret.canv.style.width = w + 'px';
        ret.head.style.top = (j + .5) * w + 'px';
        ret.textarea.style.top = ret.canv.style.top = (j + .8) * w + 'px';
        ret.head.style.height = h * .2 + 'px';
        ret.textarea.style.height = h + 'px';
        ret.canv.style.height = h + 'px';
        ret.canv.style.border = '1px black solid';
        return ret;
    }
    static setpos(hd, ta, c, i, j) {
        // const w = c.parentElement.clientWidth / 4;
        // const h = w / 1.618;
        // hd.style.position = ta.style.position = c.style.position = 'absolute';
        // hd.style.left = ta.style.left = c.style.left = (i +.5) * w + 'px';
        // hd.style.width = ta.style.width = c.style.width = w + 'px';
        // hd.style.top = (j + .5) * w + 'px';
        // ta.style.top = c.style.top = (j + .8) * w + 'px';
        // hd.style.height = h * .2 + 'px';
        // ta.style.height = h + 'px';
        // c.style.height = h + 'px';
        // c.style.border = '1px black solid';
    }
    bindEvents() {
        this.textarea.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => this.update(), this.waitUpd);
        });

        if (this.textareaUsual)
            this.textareaUsual.addEventListener('input', () => {
                clearTimeout(this.debounceTimerIgnore);
                this.debounceTimerIgnore = setTimeout(() => this.update(), this.waitIgn);
            });
    }
    update() { // Update word cloud based on textarea reducing based upon words in textareaUsual so that we get what is different is special for textarea. Ignore textIgnore
        const words = this.textarea.value.trim().toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ")
            .split(/\s+/) // Split the text into words
            .filter(w => w && !this.wordsIgnore.includes(w)); // Filter out empty strings and words in the ignore list
        //alert(words.length);

        const wordsUsual = !this.textareaUsual?[]: this.textareaUsual.value.trim().toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ")
            .split(/\s+/)
            .filter(w => w && !this.wordsIgnore.includes(w));

        const freq = {};
        words.forEach(w => freq[w] = (freq[w] || 0) + 1);

        // Reduce significantly the frequency of words in textareaUsual
        const reduceUsual = wordsUsual.length== 0?1:words.length / wordsUsual.length; 
        wordsUsual.forEach(w => freq[w] = (freq[w] || 0) - reduceUsual);

        if (this.isSignificant(freq)) {
            this.prevFreq = freq;
            this.render(freq);
        }
    }

    // Check if the change is significant
    isSignificant(newFreq) {
        const oldWords = Object.keys(this.prevFreq);
        const newWords = Object.keys(newFreq);
        const allWords = new Set([...oldWords, ...newWords]);
        let diff = 0;
        allWords.forEach(w => {
            if ((this.prevFreq[w] || 0) !== (newFreq[w] || 0)) diff++;
        });
        return (diff / allWords.size) >= this.threshold;
    }

    renderOverlap(freq) {
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        const words = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 100);
        const max = words[0] ? words[0][1] : 1;

        words.forEach(([word, count]) => {
            if (count < 1) return; // 
            const size = 10 + (count / max) * 50;
            this.ctx.font = `${size}px Arial`;
            this.ctx.fillStyle = this.randomColor();
            const x = Math.random() * (this.canv.width - 100);
            const y = Math.random() * (this.canv.height - 20) + size;
            this.ctx.fillText(word, x, y);
        });
    }

    render(freq) { // Render the word cloud on the canv
        this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
        
        // Sort words by frequency (descending order) to render the most frequent words first
        const words = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 100);
        const max = words[0] ? words[0][1] : 1;
        const positions = []; // To store bounding boxes of placed words

        words.forEach(([word, count]) => {
            if (count < 1) return;

            const size = 10 + (count / max) * 50; // Calculate font size based on count
            this.ctx.font = `${size}px Arial`;
            this.ctx.fillStyle = this.randomColor();

            let x, y, bbox;
            let attempts = 0;
            const maxAttempts = 100; // Maximum number of attempts to place a word

            do {
                // Random position within canv, leaving some padding
                x = Math.random() * (this.canv.width - 100);
                y = Math.random() * (this.canv.height - 20) + size;

                // Measure the word to get its bounding box
                const textMetrics = this.ctx.measureText(word);
                const textWidth = textMetrics.width;
                const textHeight = size; // Approximate text height using font size
                bbox = { x, y: y - textHeight, width: textWidth, height: textHeight };

                // Check if the text is within the canv bounds and does not overlap
                attempts++;
            } while (
                (bbox.x < 0 || bbox.x + bbox.width > this.canv.width || 
                bbox.y < 0 || bbox.y + bbox.height > this.canv.height || 
                this.isOverlapping(bbox, positions)) && 
                attempts < maxAttempts
            );

            // If successfully found a non-overlapping, in-bounds position, draw the word and store its bounding box
            if (attempts < maxAttempts) {
                this.ctx.fillText(word, x, y);
                positions.push(bbox);
            }
        });
    }

    // Check if the bounding box overlaps with any existing boxes
    isOverlapping(bbox, positions) {
        for (const pos of positions) {
            if (bbox.x < pos.x + pos.width &&
                bbox.x + bbox.width > pos.x &&
                bbox.y < pos.y + pos.height &&
                bbox.y + bbox.height > pos.y) {
                return true; // Overlapping
            }
        }
        return false;
    }

    randomColor = () => `#${Math.floor(Math.random() * 900) + 100}`;
}

document.write("<div class=\"debug\">End of Code for dev.</div>");