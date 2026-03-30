import { PROJECT_FILES, APP_ICONS } from '../data/constants';

export function buildProjectsContent(container) {
  container.classList.add('folder-window');

  const addrBar = document.createElement('div');
  addrBar.className = 'folder-addressbar';
  addrBar.innerHTML = `
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
      <path d="M1 5h5l1.2-2H12a.7.7 0 0 1 .7.7v5.6a.7.7 0 0 1-.7.7H1a.7.7 0 0 1-.7-.7V5.7A.7.7 0 0 1 1 5z" stroke="currentColor" stroke-width="1.2" fill="none"/>
    </svg>
    <span class="folder-path">~/projects</span>`;

  const body = document.createElement('div');
  body.className = 'folder-body';

  const statusBar = document.createElement('div');
  statusBar.className = 'folder-statusbar';
  statusBar.textContent = `${PROJECT_FILES.length} items`;

  PROJECT_FILES.forEach(f => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <div class="file-icon">
        <img src="${f.favicon}" alt="" width="24" height="24" style="object-fit:contain;" onerror="this.src='/images/mc.png'" />
      </div>
      <div class="file-name">${f.name}</div>`;

    item.addEventListener('click', e => {
      e.stopPropagation();
      if (window._appRegistry) {
        window._appRegistry.launchBrowser(f.name, f.url);
      }
    });

    body.appendChild(item);
  });

  container.appendChild(addrBar);
  container.appendChild(body);
  container.appendChild(statusBar);
}
