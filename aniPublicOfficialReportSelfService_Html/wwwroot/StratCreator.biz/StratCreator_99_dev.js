document.write("<div class=\"debug\">Code for dev...</div>");

class Wc {
    constructor(canv=null, head=null, textarea=null, textareaUsual=null, textareaIgnore=null, waitUpd=1000, waitIgn=2000) {
        const i = Math.floor(1000 + Math.random() * 1000);
        const j = Math.floor(1000 + Math.random() * 1000); 
        this.head = Wc.c(head, `wc_h${i}${j}`, `<h3 id="wc_h${i}${j}">...</h3>`);
        this.canv = Wc.c(canv, `wc_canv${i}${j}`, `<canvas id="wc_canv${i}${j}">...</canvas>`);
        this.textarea = Wc.c(textarea, `wc_inputtext${i}${j}`, `<textarea id="wc_inputtext${i}${j}">...</textarea>`);
        this.textareaUsual = textareaUsual;
        this.wordsIgnore = (!textareaIgnore?this.textareaIgnoreDefault():textareaIgnore.value).trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/).filter(w => w);;
        this.waitUpd = waitUpd;
        this.waitIgn = waitIgn;
        this.ctx = canv.getContext('2d');
        this.prevFreq = {};
        this.debounceTimer = null;
        this.debounceTimerIgnore = null;
        this.settings();
        this.bindEvents();
        this.update();
    }
    settings() {
        this.threshold = 0.2; // 20% change threshold
        this.fontSzMin = 12;
        this.fontSzMax = 36;        
    }
    textareaIgnoreDefault() {
        return `norsk, og, i, jeg, det, at, en, et, den, til, er, som, på, de, med, han, av, ikke, vi, om, men, her, var, da, hva, der, så, kan, vil, ha, for, du, deg, sin, blir, ved, skulle, nå, denne, disse, etter, ut, opp, inn, har, hadde, noen, også, bare, eller, fra, alt, ingen, alle, over, være, kom, hvordan, hvor, ble, skal, sier, sa, igjen, enn, nei, mitt, deres, dem, seg, selv, man, hvem, henne, ham, mine, dine, hans, hennes, sitt, sine, ditt, vår, våre, hvert, hvilken, hvilket, hvorfor, uten, veldig, hele, del, delvis, mellom, blant, alltid, snart, annet, andre, gjennom, både, kun, slik, likevel, derfor, dermed, hvis, bli, blitt, gjorde, ja, hans, hver, dette, sin, sitt, selv, våre, vårt, ingen, mer, større, mindre, flere, minst, mest, hele, annen, noe, hvor, derfor, siden, ettersom, etterpå, slik, der, dit, foran, bak, ved, under, over, snart, allerede, da, ikke, nå, senere, kanskje, ofte, av, sjelden, enda, altså, faktisk, eller, fordi, jo, selv om, nettopp, så, slik, altså, vel, både, selv, nok, faktisk, vanligvis, helst, tydeligvis, sannsynligvis, åpenbart, iblant, lenge, eksempelvis, derfor, kanskje, vel, nemlig, nødvendigvis, virkelig, helt, svært, veldig, mye, nok, ganske, tilstrekkelig, betydelig, hovedsakelig, enkelt, nødvendigvis, virkelig, sikkert, sannsynligvis, åpenbart, selv, gjerne, snart, sammen, omtrent, eventuelt, virkelig, allerede, dermed, egentlig, både, mest, flest, omtrent, selv, delvis, derfor, igjen, mest, alltid, likevel, snart, lenge, ofte, nok, kanskje, virkelig, dessuten, mesteparten, hovedsakelig, stadig, plutselig, absolutt, enda, nettopp, nødvendigvis, faktisk, akkurat, riktig, helt, å, må, når, ligger'
            , english, a, about, above, after, again, against, all, am, an, and, any, are, aren't, as, at, be, because, been, before, being, below, between, both, but, by, can, can't, cannot, could, couldn't, did, didn't, do, does, doesn't, doing, don't, down, during, each, few, for, from, further, had, hadn't, has, hasn't, have, haven't, having, he, he'd, he'll, he's, her, here, here's, hers, herself, him, himself, his, how, how's, i, i'd, i'll, i'm, i've, if, in, into, is, isn't, it, it's, its, itself, let's, me, more, most, mustn't, my, myself, no, nor, not, of, off, on, once, only, or, other, ought, our, ours, ourselves, out, over, own, same, shan't, she, she'd, she'll, she's, should, shouldn't, so, some, such, than, that, that's, the, their, theirs, them, themselves, then, there, there's, these, they, they'd, they'll, they're, they've, this, those, through, to, too, under, until, up, very, was, wasn't, we, we'd, we'll, we're, we've, were, weren't, what, what's, when, when's, where, where's, which, while, who, who's, whom, why, why's, with, won't, would, wouldn't, you, you'd, you'll, you're, you've, your, yours, yourself, yourselves`;
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
        let text = this.textarea.value.trim().toLowerCase();
        text += ' ' + this.head.innerText.trim().toLowerCase() + ' ' + this.head.innerText.trim().toLowerCase();
        const words = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ")
            .split(/\s+/) // Split the text into words
            .filter(w => w && !this.wordsIgnore.includes(w)); // Filter out empty strings and words in the ignore list

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
        const words = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 200); // Sort words by frequency (descending order) slice to top 200
        const max = words[0] ? words[0][1] : 1;

        words.forEach(([word, count]) => {
            if (count < 0) return; // Skip words with negative count; words that are morenprev in the ignore list 
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

            const size = this.fontSzMin + (count / max) * (this.fontSzMax - this.fontSzMin); // Calculate font size based on count
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