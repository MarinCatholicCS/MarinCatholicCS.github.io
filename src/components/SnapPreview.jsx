import { PANEL_H, TASKBAR_H } from '../data/constants';

export default function SnapPreview({ zone }) {
  if (!zone) return <div id="snap-preview" />;

  const deskH = window.innerHeight - TASKBAR_H;
  const half = Math.floor(window.innerWidth / 2);
  const rects = {
    left: { left: 0, top: 0, width: half, height: deskH },
    right: { left: half, top: 0, width: window.innerWidth - half, height: deskH },
    maximize: { left: 0, top: 0, width: window.innerWidth, height: deskH },
  };
  const r = rects[zone];
  if (!r) return <div id="snap-preview" />;

  return (
    <div
      id="snap-preview"
      className="visible"
      style={{
        left: `${r.left}px`,
        top: `${r.top}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
      }}
    />
  );
}
