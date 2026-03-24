import { projects, officers, hackathons } from '../data/constants';

export function buildHomeContent(container) {
  container.classList.add('browser-window');

  // Browser toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'browser-toolbar home-toolbar';
  toolbar.innerHTML = `
    <div class="home-nav-btns">
      <span class="home-nav-btn disabled" title="Back">&#9664;</span>
      <span class="home-nav-btn disabled" title="Forward">&#9654;</span>
    </div>
    <div class="home-addressbar">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="flex-shrink:0">
        <rect x=".8" y=".8" width="10.4" height="10.4" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1" fill="none"/>
        <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" stroke-width=".8"/>
        <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width=".8"/>
      </svg>
      <span class="home-url">https://marincatholiccs.github.io</span>
    </div>
  `;

  // Page content
  const page = document.createElement('div');
  page.className = 'home-page';

  // Hero section
  const hero = document.createElement('div');
  hero.className = 'home-hero';
  hero.innerHTML = `
    <div class="home-hero-logo">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="1" y="1" width="20" height="20" rx="3" fill="#F25022"/>
        <rect x="27" y="1" width="20" height="20" rx="3" fill="#7FBA00"/>
        <rect x="1" y="27" width="20" height="20" rx="3" fill="#00A4EF"/>
        <rect x="27" y="27" width="20" height="20" rx="3" fill="#FFB900"/>
      </svg>
    </div>
    <h1 class="home-title">Marin Catholic Computer Science Club</h1>
    <p class="home-subtitle">Building projects, competing in hackathons, and learning together.</p>
  `;

  // Hackathons section
  const hackSec = document.createElement('div');
  hackSec.className = 'home-section';
  const hackTitle = document.createElement('h2');
  hackTitle.className = 'home-section-title';
  hackTitle.textContent = 'Hackathons';
  hackSec.appendChild(hackTitle);

  const hackList = document.createElement('div');
  hackList.className = 'home-hackathon-list';
  hackathons.forEach(h => {
    const item = document.createElement('a');
    item.className = 'home-hackathon-item' + (h.highlight ? ' home-highlight' : '');
    item.href = h.url || '#';
    item.target = '_blank';
    item.textContent = h.name;
    hackList.appendChild(item);
  });
  hackSec.appendChild(hackList);

  // Projects section
  const projSec = document.createElement('div');
  projSec.className = 'home-section';
  const projTitle = document.createElement('h2');
  projTitle.className = 'home-section-title';
  projTitle.textContent = 'Projects';
  projSec.appendChild(projTitle);

  const projGrid = document.createElement('div');
  projGrid.className = 'home-project-grid';
  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'home-project-card';
    card.innerHTML = `
      <div class="home-project-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M2 8h9l2-3h9a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H2a1.5 1.5 0 0 1-1.5-1.5V9.5A1.5 1.5 0 0 1 2 8z" stroke="#E8A317" stroke-width="1.5" fill="rgba(232,163,23,.12)"/>
        </svg>
      </div>
      <span class="home-project-name">${p.name}</span>
    `;
    card.addEventListener('click', () => {
      if (window._appRegistry?.launchBrowser) {
        window._appRegistry.launchBrowser(p.name, p.url);
      }
    });
    projGrid.appendChild(card);
  });
  projSec.appendChild(projGrid);

  // Officers section
  const offSec = document.createElement('div');
  offSec.className = 'home-section';
  const offTitle = document.createElement('h2');
  offTitle.className = 'home-section-title';
  offTitle.textContent = 'Officers';
  offSec.appendChild(offTitle);

  const offList = document.createElement('div');
  offList.className = 'home-officers-list';
  officers.forEach(o => {
    const row = document.createElement('div');
    row.className = 'home-officer-row';
    row.innerHTML = `
      <div class="home-officer-avatar">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="4" fill="#B0B8C4"/>
          <path d="M2 18c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#B0B8C4"/>
        </svg>
      </div>
      <span class="home-officer-name">${o.name}</span>
      ${o.url ? `<a class="home-officer-link xp-btn" href="${o.url}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
    `;
    offList.appendChild(row);
  });
  offSec.appendChild(offList);

  page.appendChild(hero);
  page.appendChild(hackSec);
  page.appendChild(projSec);
  page.appendChild(offSec);

  container.appendChild(toolbar);
  container.appendChild(page);
}
