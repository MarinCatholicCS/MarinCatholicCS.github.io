import { projects, helpText } from '../data/constants';

export function buildTerminalContent(container) {
  const termDiv = document.createElement('div');
  termDiv.className = 'terminal-body';
  container.appendChild(termDiv);
  initTerminal(termDiv);
}

function initTerminal(termDiv) {
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  let currentInputLine = null;

  function restorePrompt() {
    termDiv.insertBefore(document.createTextNode('$ '), cursor);
    currentInputLine?.remove();
    currentInputLine = document.createElement('span');
    currentInputLine.className = 'input-line';
    termDiv.insertBefore(currentInputLine, cursor);
    termDiv.scrollTop = termDiv.scrollHeight;
  }

  function cmd_handler(command) {
    if (command === 'sudo') return 'sudo these nuts';
    if (command === 'whoami') return 'who are we at all?';
    if (command === 'ozymandias') return { type: 'ozymandias' };
    if (command === 'gavin') return 'newsom\u{1F940}\u{1F494}';
    if (command === 'mc') { window._appRegistry?.setWallpaper?.('mc'); return { type: 'mc' }; }
    if (command === 'sf') { window._appRegistry?.setWallpaper?.('sf'); return { type: 'sf' }; }
    if (command === 'konata') return { type: 'konata' };
    if (command === 'help') return { type: 'help' };
    if (command === 'clear') return { type: 'clear' };
    const n = parseInt(command);
    if (n >= 1 && n <= projects.length) { window.location.replace(projects[n - 1].url); return; }
    return `${command}: command not found`;
  }

  function renderHelp() {
    const frag = document.createDocumentFragment();
    helpText.forEach(h => {
      const line = document.createElement('div');
      const c = document.createElement('span'); c.textContent = `  ${h.cmd.padEnd(14)}`; c.className = 'help-cmd';
      const d = document.createElement('span'); d.textContent = h.desc; d.className = 'help-text';
      line.appendChild(c); line.appendChild(d); frag.appendChild(line);
    });
    return frag;
  }

  function renderDonJuan() {
    const wrap = document.createElement('div');
    wrap.className = 'ozymandias-text';
    const poem = [
      'I',
      'When Bishop Berkeley said "there was no matter,"',
      "       And proved it—'twas no matter what he said:",
      "They say his system 'tis in vain to batter,",
      '       Too subtle for the airiest human head;',
      'And yet who can believe it! I would shatter',
      '       Gladly all matters down to stone or lead,',
      'Or adamant, to find the World a spirit,',
      'And wear my head, denying that I wear it.',
      '',
      '...',
      '',
      'XC',
      'Is yet within the unread events of time.',
      '       Thus far, go forth, thou Lay, which I will back',
      'Against the same given quantity of rhyme,',
      '       For being as much the subject of attack',
      'As ever yet was any work sublime,',
      '       By those who love to say that white is black.',
      'So much the better!—I may stand alone,',
      'But would not change my free thoughts for a throne.',
      '',
      '',
    ].join('\n');
    wrap.appendChild(document.createTextNode(poem));
    wrap.appendChild(document.createTextNode('— Lord Byron, '));
    const title = document.createElement('i');
    title.textContent = 'Don Juan';
    wrap.appendChild(title);
    wrap.appendChild(document.createTextNode(': Canto 11'));
    return wrap;
  }

  function appendArt(text, className, cb) {
    const pre = document.createElement('pre');
    pre.className = className;
    pre.textContent = text;
    termDiv.insertBefore(pre, cursor);
    termDiv.scrollTop = termDiv.scrollHeight;
    if (cb) cb();
  }

  // Start with prompt immediately
  termDiv.appendChild(document.createTextNode('mc@cs-club:~$ '));
  termDiv.appendChild(cursor);

  const cmdHistory = [];
  let histIdx = -1;
  let draftInput = '';

  currentInputLine = document.createElement('span');
  currentInputLine.className = 'input-line';
  termDiv.insertBefore(currentInputLine, cursor);

  document.addEventListener('keydown', function handler(e) {
    if (!termDiv.isConnected) { document.removeEventListener('keydown', handler); return; }
    const win = termDiv.closest('.window');
    if (!win || !win.classList.contains('window-focused')) return;
    if (!currentInputLine) return;

    const text = currentInputLine.textContent;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!cmdHistory.length) return;
      if (histIdx === -1) { draftInput = text; histIdx = cmdHistory.length - 1; }
      else if (histIdx > 0) { histIdx--; }
      currentInputLine.textContent = cmdHistory[histIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      if (histIdx < cmdHistory.length - 1) { histIdx++; currentInputLine.textContent = cmdHistory[histIdx]; }
      else { histIdx = -1; currentInputLine.textContent = draftInput; }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      currentInputLine.textContent = text.slice(0, -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      termDiv.insertBefore(document.createTextNode(command_text()), cursor);
      termDiv.insertBefore(document.createElement('br'), cursor);

      const command = text.trim();
      if (command) {
        cmdHistory.push(command);
        histIdx = -1; draftInput = '';
        const result = cmd_handler(command);
        if (result?.type === 'clear') {
          termDiv.textContent = '';
          termDiv.appendChild(document.createTextNode('mc@cs-club:~$ '));
          currentInputLine = document.createElement('span');
          currentInputLine.className = 'input-line';
          termDiv.appendChild(currentInputLine);
          termDiv.appendChild(cursor);
          return;
        } else if (result?.type === 'mc' || result?.type === 'konata') {
          currentInputLine?.remove(); currentInputLine = null;
          const file = result.type === 'mc' ? 'mc.txt' : 'konata.txt';
          const cls = result.type === 'mc' ? 'ascii-art' : 'konata-art';
          fetch(file).then(r => r.text()).then(text => {
            appendArt(text, cls, restorePrompt);
          });
          return;
        } else if (result?.type === 'ozymandias') {
          currentInputLine?.remove(); currentInputLine = null;
          fetch('ozymandias.txt').then(r => r.text()).then(text => {
            const wrap = document.createElement('div');
            wrap.className = 'ozymandias-text';
            wrap.textContent = text;
            termDiv.insertBefore(wrap, cursor);
            termDiv.scrollTop = termDiv.scrollHeight;
            restorePrompt();
          });
          return;
        } else if (result?.type === 'help') {
          termDiv.insertBefore(renderHelp(), cursor);
        } else if (result?.type === 'sf') {
          termDiv.insertBefore(renderDonJuan(), cursor);
        } else if (typeof result === 'string') {
          termDiv.insertBefore(document.createTextNode(result), cursor);
          termDiv.insertBefore(document.createElement('br'), cursor);
        }
      }

      restorePrompt();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      currentInputLine.textContent += e.key;
    }
  });

  function command_text() {
    return currentInputLine ? currentInputLine.textContent : '';
  }
}
