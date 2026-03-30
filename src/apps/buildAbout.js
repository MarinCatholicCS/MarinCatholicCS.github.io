export function buildAboutContent(container) {
  container.classList.add('about-body');
  container.innerHTML = `
    <div class="about-logo-area">
      <img src="/images/mc.png" alt="MC" width="44" height="44" style="object-fit:contain;" />
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
