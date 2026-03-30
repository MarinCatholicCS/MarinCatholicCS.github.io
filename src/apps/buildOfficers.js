// RETRO RETHEME — Windows XP "Address Book" style officers app
import { officers, getOfficerPhoto } from '../data/constants';

const fallbackSvg = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
  <circle cx="14" cy="10" r="5" fill="#7A7A8A"/>
  <path d="M4 26c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="#7A7A8A"/>
</svg>`;

export function buildOfficersContent(container) {
  container.classList.add('officers-body');

  const officerRows = officers.map(o => {
    const role = o.name.split(/[—\-]/).pop()?.trim() || '';
    const name = o.name.split(/[—\-]/)[0]?.trim() || o.name;
    const photo = getOfficerPhoto(o.name);
    return `
      <div class="officer-row">
        <div class="officer-avatar">
          <img src="${photo}" alt="${name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.outerHTML=\`${fallbackSvg}\`" />
        </div>
        <div class="officer-info">
          <div class="officer-name">${name}</div>
          <div class="officer-role">${role}</div>
        </div>
        ${o.url ? `<a href="${o.url}" target="_blank" class="officer-link-btn xp-btn">LinkedIn</a>` : ''}
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="officers-toolbar">
      <span class="officers-toolbar-label">Club Officers &amp; Leadership</span>
    </div>
    <div class="officers-list">
      ${officerRows}
    </div>
    <div class="officers-statusbar">
      ${officers.length} members
    </div>
  `;
}
