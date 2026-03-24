export function buildAboutContent(container) {
  container.classList.add('about-body');
  container.innerHTML = `
    <div class="about-logo-area">
<!-- RETRO RETHEME — Windows flag colors -->
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="1" y="1" width="18" height="18" rx="2.5" fill="#F25022"/>
        <rect x="25" y="1" width="18" height="18" rx="2.5" fill="#7FBA00"/>
        <rect x="1" y="25" width="18" height="18" rx="2.5" fill="#00A4EF"/>
        <rect x="25" y="25" width="18" height="18" rx="2.5" fill="#FFB900"/>
      </svg>
      <div class="about-os-name">MC-OS</div>
      <div class="about-version">Version 1.0.0</div>
    </div>
    <div class="about-hr"></div>
    <div class="about-lines">
      <div>Marin Catholic Computer Science Club</div>
      <div>React + Vite &bull; Running in browser</div>
      <div>Open source &bull; MC-OS</div>
    </div>
  `;
}
