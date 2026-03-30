import { projects, officers, hackathons, getOfficerPhoto } from '../data/constants';

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
      <img src="/images/mc.png" alt="MC" width="48" height="48" style="object-fit:contain;" />
    </div>
    <h1 class="home-title">Marin Catholic Computer Science Club</h1>
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
        <img src="${p.favicon}" alt="" width="24" height="24" style="object-fit:contain;" onerror="this.src='/images/mc.png'" />
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

  // Officers hierarchy section
  const offSec = document.createElement('div');
  offSec.className = 'home-section';
  const offTitle = document.createElement('h2');
  offTitle.className = 'home-section-title';
  offTitle.textContent = 'Officers';
  offSec.appendChild(offTitle);

  const presidents = officers.filter(o => o.name.includes('President'));
  const offs = officers.filter(o => o.name.includes('Officer'));
  const mods = officers.filter(o => o.name.includes('Moderator'));

  const fallbackSvg = `<svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="22" r="12" fill="#B0B8C4"/>
          <path d="M6 54c0-13.3 10.7-24 24-24s24 10.7 24 24" fill="#B0B8C4"/>
        </svg>`;

  function cardHtml(o) {
    const name = o.name.split('—')[0].trim();
    const role = o.name.split('—').pop().trim();
    const photo = getOfficerPhoto(o.name);
    return `
      <div class="hierarchy-card">
        <div class="hierarchy-avatar"><img src="${photo}" alt="${name}" onerror="this.outerHTML=\`${fallbackSvg}\`" /></div>
        <div class="hierarchy-name">${name}</div>
        <div class="hierarchy-role">${role}</div>
        ${o.url ? `<a class="hierarchy-link" href="${o.url}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
      </div>`;
  }

  const tree = document.createElement('div');
  tree.className = 'hierarchy-tree';
  tree.innerHTML = `
    <div class="hierarchy-tier">
      ${presidents.map(cardHtml).join('')}
    </div>
    <div class="hierarchy-connector"></div>
    <div class="hierarchy-tier">
      ${offs.map(cardHtml).join('')}
    </div>
    <div class="hierarchy-connector"></div>
    <div class="hierarchy-tier">
      ${mods.map(cardHtml).join('')}
    </div>
  `;
  offSec.appendChild(tree);

  page.appendChild(hero);
  page.appendChild(hackSec);
  page.appendChild(projSec);
  page.appendChild(offSec);

  container.appendChild(toolbar);
  container.appendChild(page);
}
