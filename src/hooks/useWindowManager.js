import { useCallback, useRef, useState } from 'react';
import { PANEL_H, TASKBAR_H, SNAP_EDGE, APP_ICONS } from '../data/constants';

export function useWindowManager() {
  const [windows, setWindows] = useState({});
  const zCounterRef = useRef(100);
  const windowsRef = useRef({});

  // Keep ref in sync
  windowsRef.current = windows;

  const focus = useCallback((id) => {
    setWindows(prev => {
      const next = { ...prev };
      if (!next[id]) return prev;
      next[id] = { ...next[id], zIndex: ++zCounterRef.current, focused: true };
      Object.keys(next).forEach(k => {
        if (k !== id) next[k] = { ...next[k], focused: false };
      });
      return next;
    });
  }, []);

  const create = useCallback(({ id, title, width, height, x, y, buildContent, scanlines = true }) => {
    setWindows(prev => {
      if (prev[id]) {
        if (prev[id].minimized) {
          const next = { ...prev };
          next[id] = { ...next[id], minimized: false, anim: 'restore', focused: true, zIndex: ++zCounterRef.current };
          Object.keys(next).forEach(k => { if (k !== id) next[k] = { ...next[k], focused: false }; });
          return next;
        }
        // focus
        const next = { ...prev };
        next[id] = { ...next[id], focused: true, zIndex: ++zCounterRef.current };
        Object.keys(next).forEach(k => { if (k !== id) next[k] = { ...next[k], focused: false }; });
        return next;
      }
      const next = { ...prev };
      next[id] = {
        id, title, width, height, x, y,
        buildContent, scanlines,
        minimized: false, maximized: false, snapped: null,
        prevRect: null, anim: 'open',
        focused: true, zIndex: ++zCounterRef.current,
      };
      Object.keys(next).forEach(k => { if (k !== id) next[k] = { ...next[k], focused: false }; });
      return next;
    });
  }, []);

  const close = useCallback((id) => {
    setWindows(prev => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      next[id] = { ...next[id], anim: 'close', closing: true };
      return next;
    });
    // Remove after animation
    setTimeout(() => {
      setWindows(prev => {
        const next = { ...prev };
        delete next[id];
        // Focus next visible window
        const nextId = Object.keys(next).find(wid => !next[wid].minimized);
        if (nextId) {
          next[nextId] = { ...next[nextId], focused: true, zIndex: ++zCounterRef.current };
        }
        return next;
      });
    }, 150);
  }, []);

  const minimize = useCallback((id) => {
    setWindows(prev => {
      if (!prev[id] || prev[id].minimized) return prev;
      const next = { ...prev };
      next[id] = { ...next[id], minimized: true, anim: 'minimize', focused: false };
      const nextId = Object.keys(next).find(wid => wid !== id && !next[wid].minimized);
      if (nextId) {
        next[nextId] = { ...next[nextId], focused: true, zIndex: ++zCounterRef.current };
      }
      return next;
    });
  }, []);

  const restore = useCallback((id) => {
    setWindows(prev => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      next[id] = { ...next[id], minimized: false, anim: 'restore', focused: true, zIndex: ++zCounterRef.current };
      Object.keys(next).forEach(k => { if (k !== id) next[k] = { ...next[k], focused: false }; });
      return next;
    });
  }, []);

  const toggleMaximize = useCallback((id) => {
    setWindows(prev => {
      if (!prev[id]) return prev;
      const w = prev[id];
      const next = { ...prev };
      if (w.maximized || w.snapped) {
        next[id] = { ...w, maximized: false, snapped: null, ...(w.prevRect || {}), prevRect: null };
      } else {
        next[id] = {
          ...w,
          prevRect: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0, y: PANEL_H,
          width: window.innerWidth,
          height: window.innerHeight - TASKBAR_H,
          maximized: true,
        };
      }
      return next;
    });
  }, []);

  const updateWindow = useCallback((id, updates) => {
    setWindows(prev => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], ...updates } };
    });
  }, []);

  const applySnap = useCallback((id, zone) => {
    setWindows(prev => {
      if (!prev[id]) return prev;
      const w = prev[id];
      const prevRect = (!w.snapped && !w.maximized)
        ? { x: w.x, y: w.y, width: w.width, height: w.height }
        : w.prevRect;
      const deskH = window.innerHeight - TASKBAR_H;
      const half = Math.floor(window.innerWidth / 2);
      const rects = {
        left: { x: 0, y: PANEL_H, width: half, height: deskH },
        right: { x: half, y: PANEL_H, width: window.innerWidth - half, height: deskH },
        maximize: { x: 0, y: PANEL_H, width: window.innerWidth, height: deskH },
      };
      const r = rects[zone];
      if (!r) return prev;
      return {
        ...prev,
        [id]: { ...w, ...r, prevRect, snapped: zone, maximized: zone === 'maximize', snapping: true },
      };
    });
  }, []);

  const getFocusedTitle = useCallback(() => {
    const w = Object.values(windowsRef.current).find(w => w.focused && !w.minimized);
    return w?.title || '';
  }, []);

  return {
    windows, create, close, minimize, restore, focus,
    toggleMaximize, updateWindow, applySnap, getFocusedTitle,
  };
}
