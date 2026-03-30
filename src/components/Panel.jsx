import { APP_ICONS } from '../data/constants';

export default function Panel({ windows, onClickTask, onBrandClick }) {
  const openWindows = Object.values(windows).filter(w => !w.closing);

  return (
    <div id="panel">
      <button id="panel-orb" onClick={onBrandClick} title="Start">
        <img src="/images/mc.png" alt="MC" width="20" height="20" style={{objectFit: 'contain'}} />
      </button>
      <div id="panel-tasks">
        {openWindows.map(w => (
          <button
            key={w.id}
            className={`panel-task-icon${w.focused && !w.minimized ? ' active' : ''}`}
            onClick={() => onClickTask(w.id)}
            title={w.title}
          >
            <span className="ptbtn-icon" dangerouslySetInnerHTML={{ __html: APP_ICONS[w.id] || '' }} />
          </button>
        ))}
      </div>
    </div>
  );
}
