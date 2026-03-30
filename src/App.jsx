import { useEffect, useRef, useCallback, useState } from 'react';
import { PANEL_H, TASKBAR_H, APP_ICONS } from './data/constants';
import { useWindowManager } from './hooks/useWindowManager';
import { MusicPlayer } from './utils/musicPlayer';
import { buildTerminalContent } from './apps/buildTerminal';
import { buildProjectsContent } from './apps/buildProjects';
import { buildAboutContent } from './apps/buildAbout';
import { buildWhoamiContent } from './apps/buildWhoami';
import { buildOfficersContent } from './apps/buildOfficers';
import { buildBrowserContent } from './apps/buildBrowser';
import { buildHomeContent } from './apps/buildHome';
import { buildHackathonsContent } from './apps/buildHackathons';
import Panel from './components/Panel';
import Window from './components/Window';
import DesktopIcons from './components/DesktopIcons';
import ContextMenu from './components/ContextMenu';
import CommandPalette from './components/CommandPalette';
import SnapPreview from './components/SnapPreview';
import Toast from './components/Toast';
import './styles.css';

const appDefs = {
  home: {
    title: 'MC CS Club — Home',
    w: dW => Math.min(920, dW - 40),
    h: dH => Math.min(620, dH - 40),
    build: buildHomeContent,
    scanlines: false,
  },
  terminal: {
    title: 'mc@cs-club: ~',
    w: dW => Math.min(860, dW - 40),
    h: dH => Math.min(560, dH - 40),
    build: buildTerminalContent,
    scanlines: false,
  },
  projects: {
    title: 'Projects',
    w: () => 520,
    h: () => 400,
    build: buildProjectsContent,
    scanlines: false,
  },
  hackathons: {
    title: 'Hackathons',
    w: () => 520,
    h: () => 420,
    build: buildHackathonsContent,
    scanlines: false,
  },
  about: {
    title: 'About MC-OS',
    w: () => 380,
    h: () => 280,
    build: buildAboutContent,
    scanlines: false,
  },
  whoami: {
    title: 'About Us — whoami',
    w: () => 480,
    h: () => 440,
    build: buildWhoamiContent,
    scanlines: false,
  },
  officers: {
    title: 'Officers',
    w: () => 420,
    h: () => 380,
    build: buildOfficersContent,
    scanlines: false,
  },
};

export default function App() {
  const wm = useWindowManager();
  const [snapZone, setSnapZone] = useState(null);
  const cmdPaletteRef = useRef(null);
  const toastRef = useRef(null);
  const savedPositions = useRef({});
  const browserPositions = useRef({});
  const booted = useRef(false);

  const launch = useCallback((id) => {
    const app = appDefs[id];
    if (!app) return;

    // Toggle: if already open, close
    const currentWindows = wm.windows;
    if (currentWindows[id]) {
      const w = currentWindows[id];
      savedPositions.current[id] = { x: w.x, y: w.y, width: w.width, height: w.height };
      wm.close(id);
      return;
    }

    const dW = window.innerWidth, dH = window.innerHeight - TASKBAR_H;
    const w = app.w(dW), h = app.h(dH);
    const staggerMap = { projects: 28, about: 14, whoami: 42, officers: 56, hackathons: 35 };
    const stagger = staggerMap[id] || 0;
    const saved = savedPositions.current[id];

    wm.create({
      id, title: app.title,
      width: saved?.width ?? w,
      height: saved?.height ?? h,
      x: saved?.x ?? Math.max(0, Math.floor((dW - w) / 2) + stagger),
      y: saved?.y ?? Math.max(0, Math.floor((dH - h) / 2) - 16) + stagger,
      buildContent: app.build,
      scanlines: app.scanlines,
    });
  }, [wm]);

  const launchBrowser = useCallback((name, url) => {
    const id = `browser-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;

    if (wm.windows[id]) {
      const w = wm.windows[id];
      browserPositions.current[id] = { x: w.x, y: w.y, width: w.width, height: w.height };
      wm.close(id);
      return;
    }

    APP_ICONS[id] = APP_ICONS.browser;
    const dW = window.innerWidth, dH = window.innerHeight - TASKBAR_H;
    const saved = browserPositions.current[id];
    const w = saved?.width ?? Math.min(1000, dW - 60);
    const h = saved?.height ?? Math.min(680, dH - 40);

    wm.create({
      id, title: name,
      width: w, height: h,
      x: saved?.x ?? Math.max(0, Math.floor((dW - w) / 2) + 24),
      y: saved?.y ?? Math.max(0, Math.floor((dH - h) / 2)) + 24,
      buildContent: (container) => buildBrowserContent(container, url),
      scanlines: false,
    });
  }, [wm]);

  // Expose browser launcher globally for projects window
  useEffect(() => {
    window._appRegistry = { launchBrowser };
    return () => { delete window._appRegistry; };
  }, [launchBrowser]);

  const handlePanelTaskClick = useCallback((id) => {
    const w = wm.windows[id];
    if (!w) return;
    if (w.minimized) wm.restore(id);
    else if (w.focused) wm.minimize(id);
    else wm.focus(id);
  }, [wm]);

  const handleContextAction = useCallback((action) => {
    switch (action) {
      case 'open-home': launch('home'); break;
      case 'open-terminal': launch('terminal'); break;
      case 'open-projects': launch('projects'); break;
      case 'open-hackathons': launch('hackathons'); break;
      case 'about': launch('about'); break;
      case 'open-whoami': launch('whoami'); break;
      case 'open-officers': launch('officers'); break;
    }
  }, [launch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault(); launch('terminal');
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !e.altKey) {
        e.preventDefault(); cmdPaletteRef.current?.toggle();
      }
      if (e.key === 'F5' && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        cmdPaletteRef.current?.hide();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [launch]);

  // Boot sequence
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    MusicPlayer.init(toastRef);

    // Boot: open home page
    const bootTimer = setTimeout(() => {
      launch('home');
    }, 350);

    return () => { clearTimeout(bootTimer); };
  }, [launch]);

  return (
    <div id="desktop">

      <Panel
        windows={wm.windows}
        onClickTask={handlePanelTaskClick}
        onCloseTask={wm.close}
        onBrandClick={() => launch('home')}
      />

      <DesktopIcons onLaunch={launch} />

      {Object.values(wm.windows).map(w => (
        <Window
          key={w.id}
          win={w}
          onClose={wm.close}
          onMinimize={wm.minimize}
          onFocus={wm.focus}
          onToggleMaximize={wm.toggleMaximize}
          onUpdateWindow={wm.updateWindow}
          onApplySnap={wm.applySnap}
          onShowSnap={setSnapZone}
          onHideSnap={() => setSnapZone(null)}
        />
      ))}

      <ContextMenu onAction={handleContextAction} />
      <SnapPreview zone={snapZone} />
      <CommandPalette ref={cmdPaletteRef} onLaunch={launch} />
      <Toast ref={toastRef} />
    </div>
  );
}
