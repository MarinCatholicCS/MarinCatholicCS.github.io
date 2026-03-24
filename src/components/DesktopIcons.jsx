import { useState, useRef, useCallback } from 'react';
import { PANEL_H, TASKBAR_H } from '../data/constants';

const icons = [
  {
    id: 'home',
    label: 'MC CS Club',
    svg: `<svg width="30" height="28" viewBox="0 0 30 28" fill="none">
      <rect x="2" y="2" width="26" height="24" rx="3" stroke="#2989D8" stroke-width="2" fill="rgba(41,137,216,.08)"/>
      <line x1="2" y1="9" x2="28" y2="9" stroke="#2989D8" stroke-width="1.5"/>
      <circle cx="7" cy="5.5" r="1.3" fill="#2989D8"/>
      <circle cx="12" cy="5.5" r="1.3" fill="#2989D8"/>
    </svg>`,
    defaultPos: { left: 18, top: 16 },
  },
  {
    id: 'terminal',
    label: 'Terminal',
    svg: `<svg width="30" height="28" viewBox="0 0 30 28" fill="none">
      <polyline points="5,6 15,14 5,22" stroke="#2989D8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="17" y1="22" x2="26" y2="22" stroke="#2989D8" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
    defaultPos: { left: 18, top: 106 },
  },
  {
    id: 'projects',
    label: 'My Projects',
    svg: `<svg width="30" height="28" viewBox="0 0 30 28" fill="none">
      <path d="M3 9h10l2.5-3.5H27a2 2 0 0 1 2 2V22a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z" stroke="#E8A317" stroke-width="2" fill="rgba(232,163,23,.15)"/>
    </svg>`,
    defaultPos: { left: 18, top: 196 },
  },
  {
    id: 'hackathons',
    label: 'Hackathons',
    svg: `<svg width="30" height="28" viewBox="0 0 30 28" fill="none">
      <path d="M15 2l3.5 7 7.7 1.1-5.6 5.4 1.3 7.7L15 19.5l-6.9 3.7 1.3-7.7-5.6-5.4 7.7-1.1L15 2z" fill="rgba(255,185,0,.2)" stroke="#D97706" stroke-width="1.8"/>
    </svg>`,
    defaultPos: { left: 18, top: 286 },
  },
  {
    id: 'officers',
    label: 'Officers',
    svg: `<svg width="30" height="28" viewBox="0 0 30 28" fill="none">
      <circle cx="15" cy="9" r="5" stroke="#2989D8" stroke-width="2" fill="rgba(41,137,216,.1)"/>
      <path d="M5 26c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#2989D8" stroke-width="2" stroke-linecap="round" fill="rgba(41,137,216,.05)"/>
    </svg>`,
    defaultPos: { left: 18, top: 376 },
  },
];

function DesktopIcon({ icon, selected, onSelect, onLaunch }) {
  const [pos, setPos] = useState(icon.defaultPos);
  const draggingRef = useRef(false);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSelect(icon.id);

    const startX = e.clientX, startY = e.clientY;
    const startL = pos.left, startT = pos.top;
    draggingRef.current = false;
    const el = e.currentTarget;

    const onMove = (e) => {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (!draggingRef.current && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        draggingRef.current = true;
        el.classList.add('dragging');
      }
      if (draggingRef.current) {
        setPos({
          left: Math.max(0, Math.min(window.innerWidth - 76, startL + dx)),
          top: Math.max(4, Math.min(window.innerHeight - TASKBAR_H - 108, startT + dy)),
        });
      }
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      el.classList.remove('dragging');
      if (!draggingRef.current) onLaunch(icon.id);
      draggingRef.current = false;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [icon.id, pos, onSelect, onLaunch]);

  return (
    <div
      className={`desktop-icon${selected ? ' selected' : ''}`}
      data-app={icon.id}
      style={{ left: `${pos.left}px`, top: `${pos.top}px` }}
      onMouseDown={handleMouseDown}
    >
      <div className="icon-img" dangerouslySetInnerHTML={{ __html: icon.svg }} />
      <div className="icon-label">{icon.label}</div>
    </div>
  );
}

export default function DesktopIcons({ onLaunch }) {
  const [selected, setSelected] = useState(null);

  const deselectAll = useCallback(() => setSelected(null), []);

  return (
    <>
      {icons.map(icon => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          selected={selected === icon.id}
          onSelect={setSelected}
          onLaunch={onLaunch}
        />
      ))}
    </>
  );
}

export { icons };
