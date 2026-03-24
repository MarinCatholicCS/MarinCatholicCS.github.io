import { useEffect, useState } from 'react';
import { APP_ICONS } from '../data/constants';

function PanelTaskBtn({ id, title, focused, minimized, onClickTask, onCloseTask }) {
  const [leaving, setLeaving] = useState(false);

  return (
    <button
      className={`panel-task-btn${focused ? ' active' : ''}${leaving ? ' ptbtn-leaving' : ''}`}
      onClick={() => onClickTask(id)}
    >
      <span className="ptbtn-icon" dangerouslySetInnerHTML={{ __html: APP_ICONS[id] || '' }} />
      <span>{title}</span>
      <span
        className="ptbtn-close"
        aria-label={`Close ${title}`}
        onClick={(e) => { e.stopPropagation(); onCloseTask(id); }}
      >✕</span>
    </button>
  );
}

export default function Panel({ windows, onClickTask, onCloseTask, onBrandClick }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const focusedTitle = Object.values(windows).find(w => w.focused && !w.minimized)?.title || '';

  return (
    <div id="panel">
      <div id="panel-left">
        <div id="panel-logo">
{/* RETRO RETHEME — Windows flag colors */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="0.5" y="0.5" width="5.5" height="5.5" rx="1" fill="#F25022"/>
            <rect x="8" y="0.5" width="5.5" height="5.5" rx="1" fill="#7FBA00"/>
            <rect x="0.5" y="8" width="5.5" height="5.5" rx="1" fill="#00A4EF"/>
            <rect x="8" y="8" width="5.5" height="5.5" rx="1" fill="#FFB900"/>
          </svg>
        </div>
        <button id="panel-brand" onClick={onBrandClick}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{marginRight: '4px', verticalAlign: '-2px'}}>
            <rect x="0.5" y="0.5" width="5.5" height="5.5" rx="1" fill="#F25022"/>
            <rect x="8" y="0.5" width="5.5" height="5.5" rx="1" fill="#7FBA00"/>
            <rect x="0.5" y="8" width="5.5" height="5.5" rx="1" fill="#00A4EF"/>
            <rect x="8" y="8" width="5.5" height="5.5" rx="1" fill="#FFB900"/>
          </svg>
          start
        </button>
        <div className="panel-sep" />
        <span id="panel-focused-title">{focusedTitle}</span>
      </div>

      <div id="panel-center">
        <div id="panel-workspaces">
          <button className="ws-btn ws-active">1</button>
          <button className="ws-btn">2</button>
          <button className="ws-btn">3</button>
        </div>
        <div className="panel-sep" />
        <div id="panel-tasks">
          {Object.values(windows).filter(w => !w.closing).map(w => (
            <PanelTaskBtn
              key={w.id}
              id={w.id}
              title={w.title}
              focused={w.focused}
              minimized={w.minimized}
              onClickTask={onClickTask}
              onCloseTask={onCloseTask}
            />
          ))}
        </div>
      </div>

      <div id="panel-right">
        <NetworkDropdown />
        <VolumeDropdown />
        <div className="panel-sep" />
        <div id="panel-datetime">
          <span id="panel-date">{date}</span>
          <span id="panel-time">{time}</span>
        </div>
      </div>
    </div>
  );
}

function NetworkDropdown() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#net-dropdown') && !e.target.closest('#sys-net')) setOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div id="net-wrapper">
      <div id="sys-net" className="sys-icon has-tooltip" data-tooltip="Network"
           onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}>
        <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
          <path d="M1 3.5C3.8.8 12.2.8 15 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3.2 6C5.2 3.8 10.8 3.8 12.8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M5.8 8.5C6.8 7.3 9.2 7.3 10.2 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="8" cy="11.5" r="1.3" fill="currentColor"/>
        </svg>
      </div>
      <div id="net-dropdown" className={open ? 'visible' : ''}>
        <div className="net-ssid-row">can&apos;t find out ur ssid this sux</div>
      </div>
    </div>
  );
}

function VolumeDropdown() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#vol-dropdown') && !e.target.closest('#sys-vol')) setOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSlider = (e) => {
    const pct = e.target.value;
    // RETRO RETHEME — blue-to-gray volume slider
    e.target.style.background = `linear-gradient(to right, #2989D8 ${pct}%, #CCCCCC ${pct}%)`;
    if (window._musicPlayer) window._musicPlayer.setVolume(+pct);
  };

  return (
    <div id="vol-wrapper">
      <div id="sys-vol" className="sys-icon has-tooltip" data-tooltip="Volume"
           onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}>
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
          <path d="M1.5 5H4L7.5 2V12L4 9H1.5V5Z" fill="currentColor"/>
          <path d="M9.5 4.5C11 5.5 11 8.5 9.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M11.5 2.5C14 4 14 10 11.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>
      <div id="vol-dropdown" className={open ? 'visible' : ''}>
        <div className="vol-section">
          <input type="range" id="vol-slider" min="0" max="100" defaultValue="100" onInput={handleSlider} />
        </div>
        <div className="vol-controls">
          <button id="vol-prev-btn" className="vol-btn" title="Previous"
                  onClick={(e) => { e.stopPropagation(); window._musicPlayer?.prev(); }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1.5" y="1.5" width="2" height="10" rx=".5" fill="currentColor"/>
              <path d="M11.5 2L4.5 6.5l7 4.5V2z" fill="currentColor"/>
            </svg>
          </button>
          <button id="vol-play-btn" className="vol-btn vol-play-btn" title="Play/Pause"
                  onClick={(e) => { e.stopPropagation(); window._musicPlayer?.toggle(); }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 1.5L10.5 6 3 10.5V1.5z" fill="currentColor"/>
            </svg>
          </button>
          <button id="vol-next-btn" className="vol-btn" title="Next"
                  onClick={(e) => { e.stopPropagation(); window._musicPlayer?.next(); }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="9.5" y="1.5" width="2" height="10" rx=".5" fill="currentColor"/>
              <path d="M1.5 2L8.5 6.5l-7 4.5V2z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
