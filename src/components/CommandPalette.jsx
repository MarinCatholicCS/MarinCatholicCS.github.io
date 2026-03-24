import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { APP_ICONS } from '../data/constants';

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fuzzy(query, str) {
  if (!query) return { match: true, indices: [] };
  const q = query.toLowerCase(), s = str.toLowerCase();
  let qi = 0;
  const indices = [];
  for (let si = 0; si < s.length && qi < q.length; si++) {
    if (s[si] === q[qi]) { indices.push(si); qi++; }
  }
  return { match: qi === q.length, indices };
}

function highlightLabel(label, indices) {
  if (!indices.length) return esc(label);
  const ranges = [];
  let start = indices[0], end = indices[0];
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === end + 1) { end = indices[i]; }
    else { ranges.push([start, end]); start = end = indices[i]; }
  }
  ranges.push([start, end]);
  let result = '', prev = 0;
  for (const [s, e] of ranges) {
    result += esc(label.slice(prev, s));
    result += `<mark>${esc(label.slice(s, e + 1))}</mark>`;
    prev = e + 1;
  }
  return result + esc(label.slice(prev));
}

const CommandPalette = forwardRef(function CommandPalette({ onLaunch }, ref) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);

  const commands = [
    { id: 'launch-home', label: 'MC CS Club', icon: 'home', shortcut: '', action: () => onLaunch('home') },
    { id: 'launch-terminal', label: 'Open Terminal', icon: 'terminal', shortcut: 'Ctrl+Alt+T', action: () => onLaunch('terminal') },
    { id: 'launch-projects', label: 'Open Projects', icon: 'projects', shortcut: '', action: () => onLaunch('projects') },
    { id: 'launch-hackathons', label: 'Hackathons', icon: 'hackathons', shortcut: '', action: () => onLaunch('hackathons') },
    { id: 'launch-about', label: 'About MC-OS', icon: 'about', shortcut: '', action: () => onLaunch('about') },
    { id: 'launch-whoami', label: 'About Us (whoami)', icon: 'whoami', shortcut: '', action: () => onLaunch('whoami') },
    { id: 'launch-officers', label: 'Officers', icon: 'officers', shortcut: '', action: () => onLaunch('officers') },
    { id: 'refresh', label: 'Refresh Desktop', icon: '', shortcut: 'F5', action: () => {} },
  ];

  const filtered = commands
    .map(cmd => {
      const { match, indices } = fuzzy(query.trim(), cmd.label);
      return match ? { cmd, indices } : null;
    })
    .filter(Boolean);

  const show = useCallback(() => {
    setOpen(true);
    setQuery('');
    setActive(-1);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const hide = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen(o => !o), []);

  useImperativeHandle(ref, () => ({ show, hide, toggle }), [show, hide, toggle]);

  const execute = useCallback(() => {
    const item = filtered[active] ?? filtered[0];
    if (!item) return;
    hide();
    item.cmd.action();
  }, [filtered, active, hide]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { e.preventDefault(); hide(); }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => filtered.length ? (a + 1) % filtered.length : -1);
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => filtered.length ? (a - 1 + filtered.length) % filtered.length : -1);
    }
    else if (e.key === 'Enter') { e.preventDefault(); execute(); }
  }, [filtered, hide, execute]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  return (
    <div
      id="cmd-palette-overlay"
      className={open ? 'visible' : ''}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onMouseDown={(e) => { if (e.target.id === 'cmd-palette-overlay') hide(); }}
    >
      <div id="cmd-palette">
        <div id="cmd-palette-input-row">
          <svg id="cmd-palette-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            id="cmd-palette-input"
            type="text"
            placeholder="Search commands…"
            autoComplete="off"
            spellCheck="false"
            aria-label="Command search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(-1); }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div id="cmd-palette-list" role="listbox">
          {filtered.length === 0 ? (
            <div className="cp-empty">No commands found</div>
          ) : (
            filtered.map(({ cmd, indices }, i) => (
              <div
                key={cmd.id}
                className={`cp-item${i === active ? ' cp-active' : ''}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => { setActive(i); execute(); }}
              >
                <span className="cp-item-icon" dangerouslySetInnerHTML={{ __html: APP_ICONS[cmd.icon] || '' }} />
                <span className="cp-item-name" dangerouslySetInnerHTML={{ __html: highlightLabel(cmd.label, indices) }} />
                {cmd.shortcut && <span className="cp-item-shortcut">{cmd.shortcut}</span>}
              </div>
            ))
          )}
        </div>
        <div id="cmd-palette-footer">
          <span className="cp-kbd">↑↓</span><span>navigate</span>
          <span style={{ marginLeft: '4px' }} className="cp-kbd">↵</span><span>open</span>
          <span style={{ marginLeft: '4px' }} className="cp-kbd">Esc</span><span>close</span>
          <span style={{ marginLeft: 'auto', opacity: 0.5 }}>Ctrl+K</span>
        </div>
      </div>
    </div>
  );
});

export default CommandPalette;
