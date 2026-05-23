import { hackathons, colorizeHackathonName } from '../data/constants';

export function buildHackathonsContent(container) {
  container.classList.add('hackathons-body');

  container.innerHTML = `
    <div class="hackathons-toolbar">
      <span class="hackathons-toolbar-label">Hackathon Results</span>
    </div>
    <div class="hackathons-list">
      ${hackathons.map((h, i) => `
        <div class="hackathon-row${h.highlight ? ' hackathon-highlight' : ''}">
          <div class="hackathon-icon">
            <span class="hackathon-number">${i + 1}</span>
          </div>
          <div class="hackathon-info">
            <div class="hackathon-name">${colorizeHackathonName(h.name)}</div>
          </div>
          ${h.url ? `<a class="hackathon-link xp-btn" href="${h.url}" target="_blank" rel="noopener">View Project</a>` : ''}
        </div>
      `).join('')}
    </div>
    <div class="hackathons-statusbar">${hackathons.length} competition${hackathons.length !== 1 ? 's' : ''}</div>
  `;
}
