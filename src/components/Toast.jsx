import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

let toastId = 0;

const Toast = forwardRef(function Toast(_, ref) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 250);
  }, []);

  const show = useCallback(({ title, body = '', duration = 3000 }) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, title, body, type: 'default' }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const showNowPlaying = useCallback((title, videoId) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, title: 'now playing', body: title, type: 'nowplaying', videoId }]);
    setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  useImperativeHandle(ref, () => ({ show, showNowPlaying }), [show, showNowPlaying]);

  return (
    <div id="toast-container" aria-live="polite" aria-label="Notifications">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast${t.leaving ? ' toast-leaving' : ''}`}
          onClick={() => dismiss(t.id)}
        >
          {t.type === 'nowplaying' && t.videoId ? (
            <img className="toast-thumb" src={`https://i.ytimg.com/vi/${t.videoId}/default.jpg`} alt="" loading="lazy" />
          ) : (
            <svg className="toast-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <polyline points="4.5,7.5 6.2,9 9.5,5" stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <div className="toast-text">
            <div className="toast-title">{t.title}</div>
            {t.body && <div className="toast-body">{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
});

export default Toast;
