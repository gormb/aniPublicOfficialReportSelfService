document.write("<div class=\"debug\">Code for dev...</div>");

class Wc {
    constructor(textarea, canvas) {
        this.textarea = textarea;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.prevFreq = {};
        this.debounceTimer = null;
        this.threshold = 0.3; // 30% change threshold

        // Bind the input event with debounce
        this.textarea.addEventListener('input', () => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => this.update(), 1000);
        });
    }

    // Update word cloud based on input
    update() {
        const text = this.textarea.value.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        const words = text.split(/\s+/).filter(w => w);
        const freq = {};
        words.forEach(w => freq[w] = (freq[w] || 0) + 1);

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

    // Render the word cloud on the canvas
    render(freq) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const words = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0, 100);
        const max = words[0] ? words[0][1] : 1;

        words.forEach(([word, count]) => {
            const size = 10 + (count / max) * 50;
            this.ctx.font = `${size}px Arial`;
            this.ctx.fillStyle = this.randomColor();
            const x = Math.random() * (this.canvas.width - 100);
            const y = Math.random() * (this.canvas.height - 20) + size;
            this.ctx.fillText(word, x, y);
        });
    }

    // Generate a random color
    randomColor() {
        const r = Math.floor(Math.random()*200);
        const g = Math.floor(Math.random()*200);
        const b = Math.floor(Math.random()*200);
        return `rgb(${r},${g},${b})`;
    }
}

// Initialize the word cloud when the window loads
window.onload = () => {
    const textarea = document.getElementById('input');
    const canvas = document.getElementById('canvas');
    new Wc(textarea, canvas);
};

document.write("<div class=\"debug\">End of Code for dev.</div>");