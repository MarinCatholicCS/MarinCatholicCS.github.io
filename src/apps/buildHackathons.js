import { hackathons } from '../data/constants';

export function buildHackathonsContent(container) {
  container.classList.add('hackathons-body');

  container.innerHTML = `
    <div class="hackathons-toolbar">
      <span class="hackathons-toolbar-label">Hackathon Results</span>
    </div>
    <div class="hackathons-list">
      ${hackathons.map(h => `
        <div class="hackathon-row${h.highlight ? ' hackathon-highlight' : ''}">
          <div class="hackathon-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1l2.2 4.5 5 .7-3.6 3.5.8 5L9 12.5 4.6 14.7l.8-5L1.8 6.2l5-.7L9 1z" fill="${h.highlight ? '#FFB900' : '#C0C0C0'}" stroke="${h.highlight ? '#D97706' : '#999'}" stroke-width="1"/>
            </svg>
          </div>
          <div class="hackathon-info">
            <div class="hackathon-name">${h.name}</div>
          </div>
          ${h.url ? `<a class="hackathon-link xp-btn" href="${h.url}" target="_blank" rel="noopener">View Project</a>` : ''}
        </div>
      `).join('')}
    </div>
    <div class="hackathons-statusbar">${hackathons.length} competition${hackathons.length !== 1 ? 's' : ''}</div>
  `;
}
