import { useState, useEffect } from 'react';

const RAINBOW = ['#ff0000','#ff7700','#ffee00','#00cc00','#0000ff','#8b00ff'];

function rainbowText(text) {
  return text.split('').map((ch, i) => (
    <span key={i} style={{ color: RAINBOW[i % RAINBOW.length] }}>{ch}</span>
  ));
}

const POPUP_W = 480;

export default function VirusPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const cx = Math.max(0, Math.floor((window.innerWidth - POPUP_W) / 2));
  const cy = Math.max(0, Math.floor((window.innerHeight - 400) / 2));

  return (
    <div style={{
      position: 'fixed',
      left: cx,
      top: cy,
      width: POPUP_W,
      zIndex: 99999,
      fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
      border: '4px solid #ff0000',
      borderRadius: 0,
      boxShadow: '6px 6px 0 #000, -2px -2px 0 #000',
      userSelect: 'none',
      pointerEvents: 'all',
    }}>
      {/* Title bar */}
      <div style={{
        background: 'linear-gradient(90deg, #ff0000, #ff7700, #ffee00, #00cc00, #0000ff, #8b00ff)',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 15, textShadow: '1px 1px 0 #000' }}>
          {'⚠️ WARNING ⚠️'.split('').map((ch, i) => (
            <span key={i} style={{ color: RAINBOW[i % RAINBOW.length] }}>{ch}</span>
          ))}
        </span>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: '#ff0000',
            color: '#fff',
            border: '2px solid #fff',
            fontFamily: 'inherit',
            fontWeight: 'bold',
            fontSize: 14,
            cursor: 'pointer',
            padding: '1px 7px',
            lineHeight: '18px',
          }}
        >X</button>
      </div>

      {/* Body */}
      <div style={{
        background: '#ffffcc',
        padding: '24px 28px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>💻🎉💻</div>

        <div style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12, lineHeight: 1.3 }}>
          {rainbowText('CONGRATULATIONS!!!')}
        </div>

        <div style={{ fontSize: 16, marginBottom: 14, color: '#000', lineHeight: 1.6 }}>
          You have been <span style={{ color: '#ff0000', fontWeight: 'bold' }}>SELECTED</span> to join<br />
          <span style={{ fontSize: 24, fontWeight: 'bold' }}>
            {rainbowText('MarinHacks 2025!!')}
          </span>
        </div>

        <div style={{ color: '#ff0000', fontWeight: 'bold', fontSize: 16, marginBottom: 18 }}>
          ★ SIGN UP NOW BEFORE IT&apos;S TOO LATE!! ★
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://marinhacks.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(180deg,#00cc00,#006600)',
              color: '#fff',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              fontSize: 15,
              padding: '10px 22px',
              border: '2px solid #000',
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '3px 3px 0 #000',
            }}
          >
            YES! Sign Me Up!!!
          </a>
          <button
            onClick={() => setVisible(false)}
            style={{
              background: 'linear-gradient(180deg,#cccccc,#888888)',
              color: '#000',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              fontSize: 15,
              padding: '10px 22px',
              border: '2px solid #000',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #000',
            }}
          >
            No Thanks :(
          </button>
        </div>

        <div style={{ fontSize: 10, color: '#888', marginTop: 14 }}>
          This is not a virus. You have won a free prize. Click YES to claim.
        </div>
      </div>
    </div>
  );
}
