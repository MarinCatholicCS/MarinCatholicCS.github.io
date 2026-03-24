const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

function rand() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function scramble(word) {
  return word.split('').map(ch => /[A-Za-z0-9]/.test(ch) ? rand() : ch).join('');
}

function collectWords(root, out) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
      if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      const s = getComputedStyle(p);
      if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0')
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);

  for (const textNode of nodes) {
    const text = textNode.textContent;
    const frag = document.createDocumentFragment();
    for (const part of text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement('span');
        span.dataset.target = part;
        span.textContent = scramble(part);
        frag.appendChild(span);
        out.push(span);
      }
    }
    textNode.parentNode.replaceChild(frag, textNode);
  }
}

function decryptWord(span, onDone, duration = 320) {
  const target = span.dataset.target;
  const chars = target.split('');
  const alpha = chars.reduce((acc, ch, i) => (/[A-Za-z0-9]/.test(ch) ? [...acc, i] : acc), []);

  if (!alpha.length) { span.textContent = target; if (onDone) onDone(); return; }

  const TICK = 30;
  const totalTicks = Math.ceil(duration / TICK);
  let tick = 0;
  const cur = chars.slice();
  alpha.forEach(i => { cur[i] = rand(); });
  span.textContent = cur.join('');

  const id = setInterval(() => {
    tick++;
    const resolved = Math.floor((tick / totalTicks) * alpha.length);
    for (let i = 0; i < resolved; i++) cur[alpha[i]] = chars[alpha[i]];
    for (let i = resolved; i < alpha.length; i++) cur[alpha[i]] = rand();
    span.textContent = cur.join('');
    if (tick >= totalTicks) {
      clearInterval(id);
      span.textContent = target;
      if (onDone) onDone();
    }
  }, TICK);
}

export const DecryptEffect = {
  CHARS,
  rand,

  runAll(roots) {
    const words = [];
    for (const root of roots) collectWords(root, words);
    if (words.length) {
      const animate = (index) => {
        if (index >= words.length) return;
        decryptWord(words[index], () => animate(index + 1));
      };
      animate(0);
    }
  },

  runEl(el, onDone) {
    const words = [];
    collectWords(el, words);
    if (!words.length) { if (onDone) onDone(); return; }
    const seq = i => {
      if (i >= words.length) { if (onDone) onDone(); return; }
      decryptWord(words[i], () => seq(i + 1));
    };
    seq(0);
  },

  runElParallel(el, onDone, duration = 200) {
    const words = [];
    collectWords(el, words);
    if (!words.length) { if (onDone) onDone(); return; }
    let remaining = words.length;
    const done = () => { if (--remaining === 0 && onDone) onDone(); };
    words.forEach(span => decryptWord(span, done, duration));
  },
};
