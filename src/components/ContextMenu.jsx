import { useState, useEffect, useRef, useCallback } from 'react';

const menuItems = [
  {
    action: 'open-home',
    icon: `<svg class="ctx-icon-svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <rect x="1" y="1" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="none"/>
      <line x1="1" y1="4" x2="13" y2="4" stroke="currentColor" stroke-width="1.1"/>
      <circle cx="3.2" cy="2.5" r=".6" fill="currentColor"/>
      <circle cx="5.2" cy="2.5" r=".6" fill="currentColor"/>
    </svg>`,
    label: 'MC CS Club',
  },
  {
    action: 'open-terminal',
    icon: `<svg class="ctx-icon-svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <polyline points="2,2 7,6 2,10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="8" y1="10" x2="12" y2="10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    label: 'Open Terminal',
    shortcut: 'Ctrl+Alt+T',
  },
  {
    action: 'open-projects',
    icon: `<svg class="ctx-icon-svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path d="M1 4h5l1.5-2H13a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.3" fill="none"/>
    </svg>`,
    label: 'Open Projects',
  },
  {
    action: 'open-hackathons',
    icon: `<svg class="ctx-icon-svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path d="M7 .5l1.8 3.5 3.9.6-2.8 2.7.7 3.8L7 9.2 3.4 11.1l.7-3.8L1.3 4.6l3.9-.6L7 .5z" fill="currentColor"/>
    </svg>`,
    label: 'Hackathons',
  },
  {
    action: 'open-whoami',
    icon: `<svg class="ctx-icon-svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <rect x="1" y="2" width="12" height="9" rx="1" stroke="currentColor" stroke-width="1.3" fill="none"/>
      <rect x="2.5" y=".5" width="4" height="3" rx=".5" stroke="currentColor" stroke-width="1" fill="none"/>
      <line x1="5" y1="6" x2="9" y2="6" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
      <line x1="5" y1="8.5" x2="8" y2="8.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
    </svg>`,
    label: 'About Us',
  },
  {
    action: 'open-officers',
    icon: `<svg class="ctx-icon-svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <circle cx="7" cy="4" r="2.5" stroke="currentColor" stroke-width="1.3" fill="none"/>
      <path d="M2 11.5c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/>
    </svg>`,
    label: 'Officers',
  },
  { sep: true },
  {
    action: 'refresh',
    icon: `<svg class="ctx-icon-svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path d="M12 6A5 5 0 1 1 7 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <polyline points="7,1 10,1 10,4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    label: 'Refresh Desktop',
    shortcut: 'F5',
  },
  {
    action: 'wallpaper',
    icon: `<svg class="ctx-icon-svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <rect x="1" y="1" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <circle cx="4.5" cy="4.5" r="1.3" stroke="currentColor" stroke-width="1.2" fill="none"/>
      <path d="M1 9L4 7L7 9L10 6L13 9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    label: 'Change Wallpaper',
    disabled: true,
    badge: 'soon',
  },
  { sep: true },
  {
    action: 'about',
    icon: `<svg class="ctx-icon-svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
      <circle cx="7" cy="6" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <line x1="7" y1="5.5" x2="7" y2="9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="7" cy="3.2" r=".8" fill="currentColor"/>
    </svg>`,
    label: 'About MC-OS',
  },
];

export default function ContextMenu({ onAction }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(-1);
  const elRef = useRef(null);

  const actionItems = menuItems.filter(m => !m.sep && !m.disabled);

  const show = useCallback((x, y) => {
    setPos({ x, y });
    setActiveIndex(-1);
    setVisible(true);

    requestAnimationFrame(() => {
      const el = elRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.right > window.innerWidth) setPos(p => ({ ...p, x: x - r.width }));
      if (r.bottom > window.innerHeight) setPos(p => ({ ...p, y: y - r.height }));
    });
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    const handleContext = (e) => {
      if (e.target.closest('.window') || e.target.closest('#panel') || e.target.closest('#ctx-menu')) return;
      e.preventDefault();
      show(e.clientX, e.clientY);
    };
    const handleClick = (e) => {
      if (!e.target.closest('#ctx-menu')) hide();
    };
    const handleKeyDown = (e) => {
      if (!visible) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => (i + 1) % actionItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => (i - 1 + actionItems.length) % actionItems.length);
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        onAction(actionItems[activeIndex].action);
        hide();
      } else if (e.key === 'Escape') {
        hide();
      }
    };

    document.addEventListener('contextmenu', handleContext);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContext);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, activeIndex, actionItems, show, hide, onAction]);

  let actionIdx = 0;

  return (
    <div
      id="ctx-menu"
      ref={elRef}
      className={visible ? 'visible' : ''}
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
    >
      {menuItems.map((item, i) => {
        if (item.sep) return <div key={`sep-${i}`} className="ctx-sep" />;
        const myIdx = !item.disabled ? actionIdx++ : -1;
        const isActive = myIdx === activeIndex;
        return (
          <div
            key={item.action}
            className={`ctx-item${item.disabled ? ' ctx-disabled' : ''}${isActive ? ' ctx-kb-active' : ''}`}
            data-action={item.action}
            onClick={() => {
              if (item.disabled) return;
              onAction(item.action);
              hide();
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: item.icon }} />
            <span>{item.label}</span>
            {item.shortcut && <span className="ctx-shortcut">{item.shortcut}</span>}
            {item.badge && <span className="ctx-badge">{item.badge}</span>}
          </div>
        );
      })}
    </div>
  );
}
