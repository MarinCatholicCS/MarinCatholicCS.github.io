import { useState, useRef, useCallback } from 'react';
import { PANEL_H, TASKBAR_H } from '../data/constants';

const icons = [
  {
    id: 'home',
    label: 'MC CS Club',
    img: '/images/folder.png',
    defaultPos: { left: 18, top: 16 },
  },
  {
    id: 'projects',
    label: 'Projects',
    img: '/images/folder.png',
    defaultPos: { left: 18, top: 106 },
  },
  {
    id: 'hackathons',
    label: 'Hackathons',
    img: '/images/folder.png',
    defaultPos: { left: 18, top: 196 },
  },
  {
    id: 'officers',
    label: 'Officers',
    img: '/images/folder.png',
    defaultPos: { left: 18, top: 286 },
  },
  {
    id: 'terminal',
    label: 'Terminal',
    img: '/images/terminal.png',
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
      <img className="icon-img" src={icon.img} alt={icon.label} draggable={false} />
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
