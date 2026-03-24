export function buildBrowserContent(container, url) {
  container.classList.add('browser-window');

  const toolbar = document.createElement('div');
  toolbar.className = 'browser-toolbar';
  toolbar.innerHTML = `
    <a class="browser-ext-btn has-tooltip" href="${url}" target="_blank" rel="noopener" data-tooltip="Open in new tab">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M4.5 2H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        <path d="M7 1h3v3M10 1L5.5 5.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>`;

  const loading = document.createElement('div');
  loading.className = 'browser-loading';
  loading.textContent = 'Loading…';

  const frame = document.createElement('iframe');
  frame.className = 'browser-iframe';
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
  frame.src = url;
  frame.addEventListener('load', () => loading.remove(), { once: true });

  container.appendChild(toolbar);
  container.appendChild(loading);
  container.appendChild(frame);
}
