// RETRO RETHEME — Windows XP "About" style whoami app
import { hackathons } from '../data/constants';

export function buildWhoamiContent(container) {
  container.classList.add('whoami-body');

  const hackathonItems = hackathons.map(h =>
    `<li class="whoami-hackathon${h.highlight ? ' whoami-highlight' : ''}">
      ${h.url ? `<a href="${h.url}" class="whoami-link" target="_blank">${h.name}</a>` : h.name}
    </li>`
  ).join('');

  container.innerHTML = `
    <div class="whoami-header">
      <div class="whoami-logo">
        <img src="/images/mc.png" alt="MC" width="48" height="48" style="object-fit:contain;" />
      </div>
      <div class="whoami-title-area">
        <div class="whoami-name">Marin Catholic Computer Science Club</div>
        <div class="whoami-subtitle">MC-OS v1.0 &bull; Est. 2024</div>
      </div>
    </div>
    <div class="whoami-tabs">
      <div class="whoami-tab active">General</div>
      <div class="whoami-tab">Hackathons</div>
    </div>
    <div class="whoami-tab-content" id="whoami-general">
      <div class="whoami-section">
        <div class="whoami-section-title">About Us</div>
        <div class="whoami-field">We are the Computer Science Club at Marin Catholic High School. We build projects, compete in hackathons, and learn together.</div>
      </div>
      <div class="whoami-section">
        <div class="whoami-section-title">System Info</div>
        <div class="whoami-info-row"><span class="whoami-label">Platform:</span> <span>React + Vite &bull; Browser</span></div>
        <div class="whoami-info-row"><span class="whoami-label">Version:</span> <span>1.0.0</span></div>
        <div class="whoami-info-row"><span class="whoami-label">License:</span> <span>Open Source</span></div>
        <div class="whoami-info-row"><span class="whoami-label">Status:</span> <span class="whoami-status-ok">Active</span></div>
      </div>
    </div>
    <div class="whoami-tab-content" id="whoami-hackathons" style="display:none">
      <div class="whoami-section">
        <div class="whoami-section-title">Competition Results</div>
        <ul class="whoami-hackathon-list">${hackathonItems}</ul>
      </div>
    </div>
    <div class="whoami-footer">
      <button class="xp-btn whoami-ok-btn">OK</button>
    </div>
  `;

  // Tab switching
  const tabs = container.querySelectorAll('.whoami-tab');
  const panels = container.querySelectorAll('.whoami-tab-content');
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      panels[i].style.display = 'block';
    });
  });

  // OK button closes window
  container.querySelector('.whoami-ok-btn').addEventListener('click', () => {
    const win = container.closest('.window');
    if (win) {
      const closeBtn = win.querySelector('.btn-close');
      if (closeBtn) closeBtn.click();
    }
  });
}
