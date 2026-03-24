import { useEffect, useRef, useCallback } from 'react';
import { PANEL_H, SNAP_EDGE, APP_ICONS } from '../data/constants';

export default function Window({
  win, onClose, onMinimize, onFocus, onToggleMaximize,
  onUpdateWindow, onApplySnap, onShowSnap, onHideSnap,
}) {
  const elRef = useRef(null);
  const contentRef = useRef(null);
  const builtRef = useRef(false);

  const { id, title, width, height, x, y, scanlines, anim, focused, minimized, closing, zIndex, maximized, snapping } = win;

  // Build content imperatively (terminal and other apps use DOM manipulation)
  useEffect(() => {
    if (builtRef.current || !contentRef.current || !win.buildContent) return;
    builtRef.current = true;
    win.buildContent(contentRef.current);
  }, [win.buildContent]);

  // Clear anim after it plays
  useEffect(() => {
    if (!anim) return;
    const el = elRef.current;
    if (!el) return;
    const handler = () => {
      onUpdateWindow(id, { anim: '' });
      if (anim === 'minimize') {
        // Keep minimized hidden
      }
    };
    el.addEventListener('animationend', handler, { once: true });
    return () => el.removeEventListener('animationend', handler);
  }, [anim, id, onUpdateWindow]);

  // Clear snapping transition flag
  useEffect(() => {
    if (!snapping) return;
    const el = elRef.current;
    if (!el) return;
    const handler = () => onUpdateWindow(id, { snapping: false });
    el.addEventListener('transitionend', handler, { once: true });
    return () => el.removeEventListener('transitionend', handler);
  }, [snapping, id, onUpdateWindow]);

  // Dragging
  const handleTitleMouseDown = useCallback((e) => {
    if (e.target.closest('.title-buttons')) return;
    e.preventDefault();
    onFocus(id);

    const w = win;
    let cx = w.x, cy = w.y, cw = w.width, ch = w.height;

    // Un-snap on drag
    if ((w.snapped || w.maximized) && w.prevRect) {
      const prevW = w.prevRect.width || 800;
      const prevH = w.prevRect.height || 500;
      cx = Math.max(0, Math.min(window.innerWidth - prevW, e.clientX - prevW / 2));
      cy = Math.max(PANEL_H, e.clientY - 17);
      cw = prevW;
      ch = prevH;
      onUpdateWindow(id, {
        x: cx, y: cy, width: cw, height: ch,
        snapped: null, maximized: false, prevRect: null,
      });
    }

    const startX = e.clientX, startY = e.clientY;
    const startL = cx, startT = cy;
    let snapZone = null;

    const onMove = (e) => {
      const newX = startL + e.clientX - startX;
      const newY = Math.max(PANEL_H, startT + e.clientY - startY);
      onUpdateWindow(id, { x: newX, y: newY });

      const prev = snapZone;
      if (e.clientX <= SNAP_EDGE) snapZone = 'left';
      else if (e.clientX >= window.innerWidth - SNAP_EDGE) snapZone = 'right';
      else if (e.clientY <= PANEL_H + SNAP_EDGE) snapZone = 'maximize';
      else snapZone = null;
      if (snapZone !== prev) {
        if (snapZone) onShowSnap(snapZone);
        else onHideSnap();
      }
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      onHideSnap();
      if (snapZone) onApplySnap(id, snapZone);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [id, win, onFocus, onUpdateWindow, onApplySnap, onShowSnap, onHideSnap]);

  // Resizing
  const handleResizeMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const startW = width, startH = height;

    const onMove = (e) => {
      onUpdateWindow(id, {
        width: Math.max(320, startW + e.clientX - startX),
        height: Math.max(200, startH + e.clientY - startY),
      });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [id, width, height, onUpdateWindow]);

  const style = {
    width: `${width}px`,
    height: `${height}px`,
    left: `${x}px`,
    top: `${y}px`,
    zIndex,
    display: minimized && !anim ? 'none' : 'flex',
    borderRadius: (maximized || win.snapped) ? '0' : undefined,
    pointerEvents: closing ? 'none' : undefined,
  };

  const className = [
    'window',
    focused ? 'window-focused' : '',
    snapping ? 'window-snapping' : '',
  ].filter(Boolean).join(' ');

  const iconHtml = APP_ICONS[id] || APP_ICONS[id.split('-')[0]] || '';

  return (
    <div
      ref={elRef}
      className={className}
      data-anim={anim || undefined}
      style={style}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className="title-bar"
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={(e) => {
          if (e.target.closest('.title-buttons')) return;
          onToggleMaximize(id);
        }}
      >
        <div className="title-icon" dangerouslySetInnerHTML={{ __html: iconHtml }} />
        <div className="title-text">{title}</div>
        <div className="title-buttons">
          <span className="btn-minimize" title="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize(id); }} />
          <span className="btn-maximize" title="Maximize" onClick={(e) => { e.stopPropagation(); onToggleMaximize(id); }} />
          <span className="btn-close" title="Close" onClick={(e) => { e.stopPropagation(); onClose(id); }} />
        </div>
      </div>
      <div className="window-content" ref={contentRef} />
      {scanlines && <div className="scanlines" />}
      <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
    </div>
  );
}
