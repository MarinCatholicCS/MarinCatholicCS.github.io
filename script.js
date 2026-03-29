'use strict';
// ════════════════════════════════════════════════════════
//  MC-OS  —  desktop simulation
// ════════════════════════════════════════════════════════

const PANEL_H = 32;   // top panel height px
const SNAP_EDGE = 8;    // px from screen edge to trigger snap

// Small SVG icons used in titlebars and panel task buttons
const APP_ICONS = {
    terminal: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
        <polyline points="1,1 6,5.5 1,10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="7" y1="10" x2="11" y2="10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    projects: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
        <path d="M1 4h4.5l1.2-2H11a.8.8 0 0 1 .8.8v5.4a.8.8 0 0 1-.8.8H1a.8.8 0 0 1-.8-.8V4.8A.8.8 0 0 1 1 4z" stroke="currentColor" stroke-width="1.2" fill="none"/>
    </svg>`,
    about: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
        <circle cx="6" cy="5.5" r="4.5" stroke="currentColor" stroke-width="1.4" fill="none"/>
        <line x1="6" y1="5" x2="6" y2="8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="6" cy="3" r=".7" fill="currentColor"/>
    </svg>`,
    browser: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
        <rect x=".8" y=".8" width="10.4" height="9.4" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/>
        <line x1=".8" y1="3.5" x2="11.2" y2="3.5" stroke="currentColor" stroke-width="1.1"/>
        <circle cx="2.8" cy="2.2" r=".6" fill="currentColor"/>
        <circle cx="4.8" cy="2.2" r=".6" fill="currentColor"/>
    </svg>`,
};

// ════════════════════════════════════════════════════════
//  Data  (unchanged)
// ════════════════════════════════════════════════════════

const textIntro = `$ whoami
Marin Catholic Computer Science Club

$ hackathons
`;

const projects = [
    { name: "getmo", url: "../getmo/" },
    { name: "mo-sweeper", url: "../mosweeper/" },
    { name: "flappymo", url: "../flappymo/" },
    { name: "wildchat", url: "../chatatmc/" }
];

const officers = [
    { name: "Stanley Ho — Co-President", url: "https://www.linkedin.com/in/stanley-ho-66748a338/" },
    { name: "Nico Zametto — Co-President", url: "https://www.linkedin.com/in/nico-zametto-a862643b4/" },
    { name: "Gavin Perry - First Officer" },
    { name: "Alex Willard — Second Officer" },
    { name: "Mo Adib - Moderator" },
];

const hackathons = [
    { name: "BullHacks 2026 - Voluntir - 1st Place - $1000", url: "../voluntir/", highlight: true },
    { name: "StangHacks 2026 - Voluntir (Improved) - Honorable Mention, Second Round Judging", url: "../voluntir/" },
    { name: "LancerHacks 2026 - TerraView - 1st Place - Minifridge, Polaroid Camera, 5 T-shirts, and tours to tech companies", url: "https://terraview-five.vercel.app/", highlight: true}
    { name: "VikingHacks 2026 - Flipus - ...", url: "https://flipus.vercel.app/"}
];

const helpText = [
    { cmd: "help", desc: "show this message" },
    { cmd: "whoami", desc: "existential crisis" },
    { cmd: "sudo", desc: "try it" },
    { cmd: "ozymandias", desc: "a poem" },
    { cmd: "mc", desc: "ascii art" },
    { cmd: "konata", desc: "✴" },
    { cmd: "clear", desc: "clear the terminal" },
    { cmd: "1-4", desc: "open a project" },
];

// ════════════════════════════════════════════════════════
//  Snap Preview
// ════════════════════════════════════════════════════════

const SnapPreview = {
    el: null, current: null,
    init() { this.el = document.getElementById('snap-preview'); },
    show(zone) {
        if (!zone || !this.el) { this.hide(); return; }
        if (zone === this.current) return;
        this.current = zone;
        const deskH = window.innerHeight - PANEL_H;
        const half = Math.floor(window.innerWidth / 2);
        const rects = {
            left: { l: 0, t: PANEL_H, w: half, h: deskH },
            right: { l: half, t: PANEL_H, w: window.innerWidth - half, h: deskH },
            maximize: { l: 0, t: PANEL_H, w: window.innerWidth, h: deskH },
        };
        const r = rects[zone]; if (!r) return;
        this.el.style.cssText = `left:${r.l}px;top:${r.t}px;width:${r.w}px;height:${r.h}px;`;
        this.el.classList.add('visible');
    },
    hide() { this.current = null; this.el?.classList.remove('visible'); },
};

// ════════════════════════════════════════════════════════
//  Window Manager
// ════════════════════════════════════════════════════════

const WindowManager = {
    windows: {},
    zCounter: 100,

    create({ id, title, width, height, x, y, buildContent, scanlines = true }) {
        if (this.windows[id]) {
            this.windows[id].minimized ? this.restore(id) : this.focus(id);
            return;
        }
        const iconHtml = APP_ICONS[id] || '';
        const win = document.createElement('div');
        win.className = 'window';
        win.id = `win-${id}`;
        win.dataset.anim = 'open';
        win.style.cssText = `width:${width}px;height:${height}px;left:${x}px;top:${y}px;`;
        win.innerHTML = `
            <div class="title-bar">
                <div class="title-icon">${iconHtml}</div>
                <div class="title-text">${title}</div>
                <div class="title-buttons">
                    <span class="btn-minimize" title="Minimize"></span>
                    <span class="btn-maximize" title="Maximize"></span>
                    <span class="btn-close"    title="Close"></span>
                </div>
            </div>
            <div class="window-content"></div>
            ${scanlines ? '<div class="scanlines"></div>' : ''}
            <div class="resize-handle"></div>
        `;
        document.getElementById('desktop').appendChild(win);
        buildContent(win.querySelector('.window-content'));

        win.querySelector('.btn-close').onclick = e => { e.stopPropagation(); this.close(id); };
        win.querySelector('.btn-minimize').onclick = e => { e.stopPropagation(); this.minimize(id); };
        win.querySelector('.btn-maximize').onclick = e => { e.stopPropagation(); this.toggleMaximize(id); };
        win.addEventListener('mousedown', () => this.focus(id));

        this._makeDraggable(win, win.querySelector('.title-bar'));
        this._makeResizable(win, win.querySelector('.resize-handle'));

        // Double-click titlebar to toggle maximize
        win.querySelector('.title-bar').addEventListener('dblclick', e => {
            if (e.target.closest('.title-buttons')) return;
            this.toggleMaximize(id);
        });

        this.windows[id] = { el: win, title, minimized: false, maximized: false, snapped: null, prevRect: null };
        this._addPanelTask(id, title);
        this.focus(id);
    },

    focus(id) {
        document.querySelectorAll('.window').forEach(w => w.classList.remove('window-focused'));
        document.querySelectorAll('.panel-task-btn').forEach(b => b.classList.remove('active'));
        const w = this.windows[id];
        if (!w) return;
        w.el.style.zIndex = ++this.zCounter;
        w.el.classList.add('window-focused');
        document.getElementById(`ptbtn-${id}`)?.classList.add('active');
        const pt = document.getElementById('panel-focused-title');
        if (pt) pt.textContent = w.title;
    },

    close(id) {
        const w = this.windows[id];
        if (!w) return;
        const ptbtn = document.getElementById(`ptbtn-${id}`);
        if (ptbtn) {
            ptbtn.classList.add('ptbtn-leaving');
            ptbtn.addEventListener('animationend', () => ptbtn.remove(), { once: true });
        }
        delete this.windows[id];

        const el = w.el;
        el.style.pointerEvents = 'none';
        el.dataset.anim = 'close';
        el.addEventListener('animationend', () => el.remove(), { once: true });

        // Focus next visible window, or clear title
        const nextId = Object.keys(this.windows).find(wid => !this.windows[wid].minimized);
        if (nextId) {
            this.focus(nextId);
        } else {
            document.querySelectorAll('.panel-task-btn').forEach(b => b.classList.remove('active'));
            const pt = document.getElementById('panel-focused-title');
            if (pt) pt.textContent = '';
        }
    },

    minimize(id) {
        const w = this.windows[id];
        if (!w || w.minimized) return;
        w.minimized = true;
        w.el.dataset.anim = 'minimize';
        w.el.addEventListener('animationend', () => {
            if (!this.windows[id]) return;
            w.el.style.display = 'none';
            w.el.dataset.anim = '';
        }, { once: true });
        document.getElementById(`ptbtn-${id}`)?.classList.remove('active');
        const pt = document.getElementById('panel-focused-title');
        const nextId = Object.keys(this.windows).find(wid => wid !== id && !this.windows[wid].minimized);
        if (nextId) { this.focus(nextId); } else if (pt) { pt.textContent = ''; }
    },

    restore(id) {
        const w = this.windows[id];
        if (!w) return;
        w.minimized = false;
        w.el.style.display = 'flex';
        w.el.dataset.anim = 'restore';
        w.el.addEventListener('animationend', () => { w.el.dataset.anim = ''; }, { once: true });
        this.focus(id);
    },

    toggleMaximize(id) {
        const w = this.windows[id];
        if (!w) return;
        const el = w.el;
        if (w.maximized || w.snapped) {
            if (w.prevRect) Object.assign(el.style, w.prevRect);
            el.style.borderRadius = '';
            w.maximized = false; w.snapped = null; w.prevRect = null;
        } else {
            w.prevRect = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
            el.style.cssText += `left:0;top:${PANEL_H}px;width:${window.innerWidth}px;height:${window.innerHeight - PANEL_H}px;border-radius:0;`;
            w.maximized = true;
        }
    },

    _applySnap(id, zone) {
        const w = this.windows[id];
        if (!w) return;
        const el = w.el;
        if (!w.snapped && !w.maximized) {
            w.prevRect = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
        }
        const deskH = window.innerHeight - PANEL_H;
        const half = Math.floor(window.innerWidth / 2);
        const rects = {
            left: `left:0;top:${PANEL_H}px;width:${half}px;height:${deskH}px;border-radius:0;`,
            right: `left:${half}px;top:${PANEL_H}px;width:${window.innerWidth - half}px;height:${deskH}px;border-radius:0;`,
            maximize: `left:0;top:${PANEL_H}px;width:${window.innerWidth}px;height:${deskH}px;border-radius:0;`,
        };
        if (rects[zone]) {
            el.classList.add('window-snapping');
            el.style.cssText += rects[zone];
            el.addEventListener('transitionend', () => el.classList.remove('window-snapping'), { once: true });
        }
        w.snapped = zone; w.maximized = zone === 'maximize';
    },

    _addPanelTask(id, title) {
        const btn = document.createElement('button');
        btn.className = 'panel-task-btn';
        btn.id = `ptbtn-${id}`;
        btn.innerHTML = `<span class="ptbtn-icon">${APP_ICONS[id] || ''}</span><span>${title}</span><span class="ptbtn-close" aria-label="Close ${title}">✕</span>`;

        btn.addEventListener('click', e => {
            if (e.target.closest('.ptbtn-close')) return;
            const w = this.windows[id];
            if (!w) return;
            if (w.minimized) { this.restore(id); }
            else if (w.el.classList.contains('window-focused')) { this.minimize(id); }
            else { this.focus(id); }
        });

        btn.querySelector('.ptbtn-close').addEventListener('click', e => {
            e.stopPropagation();
            this.close(id);
        });

        document.getElementById('panel-tasks').appendChild(btn);
    },

    _makeDraggable(win, handle) {
        handle.addEventListener('mousedown', e => {
            if (e.target.closest('.title-buttons')) return;
            e.preventDefault();

            const winId = win.id.replace('win-', '');
            const wState = this.windows[winId];

            // Un-snap / un-maximize on drag: restore prev size and reposition under cursor
            if (wState && (wState.snapped || wState.maximized) && wState.prevRect) {
                const prevW = parseInt(wState.prevRect.width) || 800;
                const prevH = parseInt(wState.prevRect.height) || 500;
                win.style.left = Math.max(0, Math.min(window.innerWidth - prevW, e.clientX - prevW / 2)) + 'px';
                win.style.top = Math.max(PANEL_H, e.clientY - 17) + 'px';
                win.style.width = prevW + 'px';
                win.style.height = prevH + 'px';
                win.style.borderRadius = '';
                wState.snapped = null; wState.maximized = false; wState.prevRect = null;
            }

            const startX = e.clientX, startY = e.clientY;
            const startL = parseInt(win.style.left) || 0;
            const startT = parseInt(win.style.top) || 0;
            let snapZone = null;

            const onMove = e => {
                win.style.left = (startL + e.clientX - startX) + 'px';
                win.style.top = Math.max(PANEL_H, startT + e.clientY - startY) + 'px';

                const prev = snapZone;
                if (e.clientX <= SNAP_EDGE) snapZone = 'left';
                else if (e.clientX >= window.innerWidth - SNAP_EDGE) snapZone = 'right';
                else if (e.clientY <= PANEL_H + SNAP_EDGE) snapZone = 'maximize';
                else snapZone = null;
                if (snapZone !== prev) SnapPreview.show(snapZone);
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                SnapPreview.hide();
                if (snapZone) this._applySnap(winId, snapZone);
                snapZone = null;
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    },

    _makeResizable(win, handle) {
        handle.addEventListener('mousedown', e => {
            e.preventDefault(); e.stopPropagation();
            const startX = e.clientX, startY = e.clientY;
            const startW = win.offsetWidth, startH = win.offsetHeight;
            const onMove = e => {
                win.style.width = Math.max(320, startW + e.clientX - startX) + 'px';
                win.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    },
};

// ════════════════════════════════════════════════════════
//  Application Registry
// ════════════════════════════════════════════════════════

const AppRegistry = {
    apps: {
        terminal: {
            title: 'mc@cs-club: ~',
            w: dW => Math.min(860, dW - 40),
            h: dH => Math.min(560, dH - 40),
            build: buildTerminalContent,
            scanlines: true,
        },
        projects: {
            title: 'Projects',
            w: () => 520,
            h: () => 400,
            build: buildProjectsContent,
            scanlines: false,
        },
        about: {
            title: 'About MC-OS',
            w: () => 380,
            h: () => 280,
            build: buildAboutContent,
            scanlines: false,
        },
    },

    _savedPositions: {},

    launch(id, opts = {}) {
        const app = this.apps[id];
        if (!app) return;

        // Toggle: if already open, save position and close
        if (WindowManager.windows[id]) {
            const el = WindowManager.windows[id].el;
            this._savedPositions[id] = {
                x: parseInt(el.style.left), y: parseInt(el.style.top),
                w: el.offsetWidth, h: el.offsetHeight,
            };
            WindowManager.close(id);
            return;
        }

        const dW = window.innerWidth, dH = window.innerHeight - PANEL_H;
        const w = app.w(dW), h = app.h(dH);
        const stagger = id === 'projects' ? 28 : id === 'about' ? 14 : 0;
        const saved = this._savedPositions[id];
        WindowManager.create({
            id, title: app.title,
            width: saved?.w ?? w,
            height: saved?.h ?? h,
            x: saved?.x ?? opts.x ?? Math.max(0, Math.floor((dW - w) / 2) + stagger),
            y: saved?.y ?? opts.y ?? PANEL_H + Math.max(0, Math.floor((dH - h) / 2) - 16) + stagger,
            buildContent: app.build,
            scanlines: app.scanlines,
        });
    },

    _browserPositions: {},

    launchBrowser(name, url) {
        const id = `browser-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;

        // Toggle: if already open, save position and close
        if (WindowManager.windows[id]) {
            const el = WindowManager.windows[id].el;
            this._browserPositions[id] = {
                x: parseInt(el.style.left), y: parseInt(el.style.top),
                w: el.offsetWidth, h: el.offsetHeight,
            };
            WindowManager.close(id);
            return;
        }

        APP_ICONS[id] = APP_ICONS.browser;
        const dW = window.innerWidth, dH = window.innerHeight - PANEL_H;
        const saved = this._browserPositions[id];
        const w = saved?.w ?? Math.min(1000, dW - 60);
        const h = saved?.h ?? Math.min(680, dH - 40);
        WindowManager.create({
            id, title: name,
            width: w, height: h,
            x: saved?.x ?? Math.max(0, Math.floor((dW - w) / 2) + 24),
            y: saved?.y ?? PANEL_H + Math.max(0, Math.floor((dH - h) / 2)) + 24,
            buildContent: container => buildBrowserContent(container, url),
            scanlines: false,
        });
    },
};

// ════════════════════════════════════════════════════════
//  Icon System  —  drag + select + double-click
// ════════════════════════════════════════════════════════

const IconSystem = {
    _selected: null,

    init() {
        document.querySelectorAll('.desktop-icon').forEach(el => this._setup(el));
    },

    _setup(el) {
        const appId = el.dataset.app;
        let dragStarted = false;

        el.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            e.stopPropagation();
            this.select(el);

            const startX = e.clientX, startY = e.clientY;
            const startL = parseInt(el.style.left) || 0;
            const startT = parseInt(el.style.top) || 0;
            dragStarted = false;

            const onMove = e => {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                if (!dragStarted && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
                    dragStarted = true;
                    el.classList.add('dragging');
                }
                if (dragStarted) {
                    el.style.left = Math.max(0, Math.min(window.innerWidth - 76, startL + dx)) + 'px';
                    el.style.top = Math.max(PANEL_H + 4, Math.min(window.innerHeight - 108, startT + dy)) + 'px';
                }
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                el.classList.remove('dragging');
                if (!dragStarted && appId) AppRegistry.launch(appId);
                dragStarted = false;
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

    },

    select(el) {
        this.deselectAll();
        this._selected = el;
        el.classList.add('selected');
    },

    deselectAll() {
        this._selected?.classList.remove('selected');
        this._selected = null;
    },
};

// ════════════════════════════════════════════════════════
//  Context Menu
// ════════════════════════════════════════════════════════

const ContextMenu = {
    el: null,
    _activeIndex: -1,

    init() {
        this.el = document.getElementById('ctx-menu');

        document.addEventListener('contextmenu', e => {
            if (e.target.closest('.window') || e.target.closest('#panel') || e.target.closest('#ctx-menu')) return;
            e.preventDefault();
            this.show(e.clientX, e.clientY);
        });

        document.addEventListener('click', e => {
            if (!e.target.closest('#ctx-menu')) this.hide();
        });

        this.el.addEventListener('click', e => {
            const item = e.target.closest('.ctx-item');
            if (!item || item.classList.contains('ctx-disabled')) return;
            this._handle(item.dataset.action);
            this.hide();
        });

        // Keyboard navigation
        document.addEventListener('keydown', e => {
            if (!this.el?.classList.contains('visible')) return;
            const items = this._getItems();
            if (!items.length) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this._activeIndex = (this._activeIndex + 1) % items.length;
                this._updateActive(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this._activeIndex = (this._activeIndex - 1 + items.length) % items.length;
                this._updateActive(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const item = items[this._activeIndex];
                if (item) { this._handle(item.dataset.action); this.hide(); }
            }
        });
    },

    show(x, y) {
        this._activeIndex = -1;
        this.el.style.left = x + 'px';
        this.el.style.top = y + 'px';
        this.el.classList.add('visible');
        requestAnimationFrame(() => {
            if (!this.el.classList.contains('visible')) return;
            const r = this.el.getBoundingClientRect();
            if (r.right > window.innerWidth) this.el.style.left = (x - r.width) + 'px';
            if (r.bottom > window.innerHeight) this.el.style.top = (y - r.height) + 'px';
        });
    },

    hide() {
        this.el?.classList.remove('visible');
        this._activeIndex = -1;
        this.el?.querySelectorAll('.ctx-kb-active').forEach(el => el.classList.remove('ctx-kb-active'));
    },

    _getItems() {
        return Array.from(this.el.querySelectorAll('.ctx-item:not(.ctx-disabled)'));
    },

    _updateActive(items) {
        this.el.querySelectorAll('.ctx-item').forEach(el => el.classList.remove('ctx-kb-active'));
        const active = items[this._activeIndex];
        if (active) { active.classList.add('ctx-kb-active'); active.scrollIntoView({ block: 'nearest' }); }
    },

    _handle(action) {
        switch (action) {
            case 'open-terminal': AppRegistry.launch('terminal'); break;
            case 'open-projects': AppRegistry.launch('projects'); break;
            case 'refresh': IconSystem.deselectAll(); break;
            case 'about': AppRegistry.launch('about'); break;
        }
    },
};

// ════════════════════════════════════════════════════════
//  Wallpaper Canvas  —  subtle particle starfield
// ════════════════════════════════════════════════════════

const WallpaperCanvas = {
    canvas: null, ctx: null, drops: [], animId: null, _last: 0,
    CHARS: '01',
    COL_W: 14,

    init() {
        this.canvas = document.getElementById('desktop-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this._resize();
        window.addEventListener('resize', () => this._resize());
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { cancelAnimationFrame(this.animId); }
            else { this._animate(0); }
        });
        this._animate(0);
    },

    _resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const cols = Math.floor(this.canvas.width / this.COL_W);
        this.drops = Array.from({ length: cols }, () => -Math.floor(Math.random() * 80));
    },

    _animate(ts) {
        this.animId = requestAnimationFrame(t => this._animate(t));
        if (ts - this._last < 42) return; // ~24 fps
        this._last = ts;

        const { ctx, canvas, drops, CHARS, COL_W } = this;
        const W = canvas.width, H = canvas.height;

        // Fade overlay — creates the trailing effect
        ctx.fillStyle = 'rgba(11,13,20,0.06)';
        ctx.fillRect(0, 0, W, H);

        ctx.font = `${COL_W - 1}px "Fira Code", monospace`;

        for (let i = 0; i < drops.length; i++) {
            const y = drops[i];
            if (y < 0) { drops[i]++; continue; }

            const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
            const x = i * COL_W;

            // Head character: bright green
            ctx.fillStyle = '#00ff41';
            ctx.shadowColor = '#00ff41';
            ctx.shadowBlur = 8;
            ctx.fillText(ch, x, y * COL_W);

            // Second character: slightly dimmer
            if (y > 0) {
                ctx.fillStyle = 'rgba(0,200,50,0.7)';
                ctx.shadowBlur = 4;
                ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, (y - 1) * COL_W);
            }

            ctx.shadowBlur = 0;

            // Reset column randomly once it goes off-screen
            if (y * COL_W > H && Math.random() > 0.975) {
                drops[i] = -Math.floor(Math.random() * 40);
            } else {
                drops[i]++;
            }
        }
    },
};

// ════════════════════════════════════════════════════════
//  System Panel  —  clock + date
// ════════════════════════════════════════════════════════

const SystemPanel = {
    init() {
        this._tick();
        setInterval(() => this._tick(), 1000);
    },
    _tick() {
        const now = new Date();
        const tEl = document.getElementById('panel-time');
        const dEl = document.getElementById('panel-date');
        if (tEl) tEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (dEl) dEl.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    },
};

// ════════════════════════════════════════════════════════
//  Terminal App  —  logic unchanged, scoped to termDiv
// ════════════════════════════════════════════════════════

function buildTerminalContent(container) {
    const termDiv = document.createElement('div');
    termDiv.className = 'terminal-body';
    container.appendChild(termDiv);
    initTerminal(termDiv);
}

function initTerminal(termDiv) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    let currentInputLine = null;

    function restorePrompt() {
        termDiv.insertBefore(document.createTextNode('$ '), cursor);
        currentInputLine?.remove();
        currentInputLine = document.createElement('span');
        currentInputLine.className = 'input-line';
        termDiv.insertBefore(currentInputLine, cursor);
        termDiv.scrollTop = termDiv.scrollHeight;
    }

    // Helper: append a line of text (decrypt it), then call cb
    function decryptAppendLine(text, cb) {
        const ref = cursor.parentNode === termDiv ? cursor : null;
        if (!text.trim()) {
            termDiv.insertBefore(document.createTextNode(text + '\n'), ref);
            cb(); return;
        }
        const span = document.createElement('span');
        span.textContent = text;
        termDiv.insertBefore(span, ref);
        termDiv.insertBefore(document.createTextNode('\n'), ref);
        DecryptEffect.runElParallel(span, cb);
    }

    // Helper: insert ASCII/braille art line-by-line with scramble animation, then call cb
    function decryptAppendArt(text, className, cb) {
        const BRAILLE = '⣿⣾⣽⣻⢿⡿⣟⣯⣷⣧⣦⣤⣄⡇⢸⠿';
        const pre = document.createElement('pre');
        pre.className = className;
        termDiv.insertBefore(pre, cursor);

        const lines = text.replace(/\n$/, '').split('\n');
        let i = 0;

        function nextLine() {
            if (i >= lines.length) { if (cb) cb(); return; }
            const line = lines[i++];
            const span = document.createElement('span');
            pre.appendChild(span);
            pre.appendChild(document.createTextNode('\n'));
            termDiv.scrollTop = termDiv.scrollHeight;

            const chars = line.split('');
            const animIdxs = chars.reduce((acc, ch, j) => {
                if (/\S/.test(ch)) acc.push(j);
                return acc;
            }, []);

            if (!animIdxs.length) { span.textContent = line; setTimeout(nextLine, 10); return; }

            function randChar(ch) {
                return /[\u2800-\u28FF]/.test(ch)
                    ? BRAILLE[Math.floor(Math.random() * BRAILLE.length)]
                    : DecryptEffect.CHARS[Math.floor(Math.random() * DecryptEffect.CHARS.length)];
            }

            const cur = chars.slice();
            animIdxs.forEach(j => { cur[j] = randChar(chars[j]); });
            span.textContent = cur.join('');

            const DURATION = 80, TICK = 20;
            const totalTicks = Math.ceil(DURATION / TICK);
            let tick = 0;
            const id = setInterval(() => {
                tick++;
                const resolved = Math.floor((tick / totalTicks) * animIdxs.length);
                for (let k = 0; k < resolved; k++) cur[animIdxs[k]] = chars[animIdxs[k]];
                for (let k = resolved; k < animIdxs.length; k++) cur[animIdxs[k]] = randChar(chars[animIdxs[k]]);
                span.textContent = cur.join('');
                if (tick >= totalTicks) {
                    clearInterval(id);
                    span.textContent = line;
                    nextLine();
                }
            }, TICK);
        }

        nextLine();
    }

    function typeIntro() {
        const lines = textIntro.split('\n').filter((_, i, a) => i < a.length - 1 || a[i]);
        let i = 0;
        (function nextLine() {
            if (i >= lines.length) { addHackathons(); return; }
            decryptAppendLine(lines[i++], nextLine);
        })();
    }

    function cmd_handler(command) {
        if (command === 'sudo') return 'sudo these nuts';
        if (command === 'whoami') return 'who are we at all?';
        if (command === 'ozymandias') return { type: 'ozymandias' };
        if (command === 'gavin') return 'newsom\u{1F940}\u{1F494}';
        if (command === 'mc') return { type: 'mc' };
        if (command === 'konata') return { type: 'konata' };
        if (command === 'help') return { type: 'help' };
        if (command === 'clear') return { type: 'clear' };
        const n = parseInt(command);
        if (n >= 1 && n <= projects.length) { window.location.replace(projects[n - 1].url); return; }
        return `${command}: command not found`;
    }

    function renderHelp() {
        const frag = document.createDocumentFragment();
        helpText.forEach(h => {
            const line = document.createElement('div');
            const c = document.createElement('span'); c.textContent = `  ${h.cmd.padEnd(14)}`; c.className = 'help-cmd';
            const d = document.createElement('span'); d.textContent = h.desc; d.className = 'help-text';
            line.appendChild(c); line.appendChild(d); frag.appendChild(line);
        });
        return frag;
    }

    function addProjects() {
        let i = 0;
        (function next() {
            if (i < projects.length) {
                const a = document.createElement('a');
                a.href = projects[i].url; a.textContent = `  ${i + 1}. ${projects[i].name}`; a.className = 'terminal-link';
                termDiv.appendChild(a); i++;
                DecryptEffect.runElParallel(a, next);
            } else { decryptAppendLine('\n$ officers', addOfficers); }
        })();
    }

    function addHackathons() {
        let i = 0;
        (function next() {
            if (i < hackathons.length) {
                const a = document.createElement('a');
                a.href = hackathons[i].url; a.textContent = `  - ${hackathons[i].name}`; a.className = 'terminal-link';
                if (hackathons[i].highlight) a.classList.add('highlight');
                termDiv.appendChild(a); i++;
                DecryptEffect.runElParallel(a, next);
            } else { decryptAppendLine('\n$ projects', addProjects); }
        })();
    }

    function addOfficers() {
        let i = 0;
        (function next() {
            if (i < officers.length) {
                let el;
                if (officers[i].url) {
                    el = document.createElement('a');
                    el.href = officers[i].url; el.className = 'terminal-link';
                } else {
                    el = document.createElement('div');
                    el.className = 'officer-line';
                }
                el.textContent = `  - ${officers[i].name}`;
                termDiv.appendChild(el);
                i++;
                DecryptEffect.runElParallel(el, next);
            } else {
                termDiv.appendChild(document.createTextNode('\n$ '));
                termDiv.appendChild(cursor);
                enableTyping();
            }
        })();
    }

    const cmdHistory = [];
    let histIdx = -1;
    let draftInput = '';

    function enableTyping() {
        currentInputLine = document.createElement('span');
        currentInputLine.className = 'input-line';
        termDiv.insertBefore(currentInputLine, cursor);

        document.addEventListener('keydown', function handler(e) {
            if (!termDiv.isConnected) { document.removeEventListener('keydown', handler); return; }
            const win = termDiv.closest('.window');
            if (!win || !win.classList.contains('window-focused')) return;
            if (!currentInputLine) return;

            const text = currentInputLine.textContent;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!cmdHistory.length) return;
                if (histIdx === -1) { draftInput = text; histIdx = cmdHistory.length - 1; }
                else if (histIdx > 0) { histIdx--; }
                currentInputLine.textContent = cmdHistory[histIdx];

            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (histIdx === -1) return;
                if (histIdx < cmdHistory.length - 1) { histIdx++; currentInputLine.textContent = cmdHistory[histIdx]; }
                else { histIdx = -1; currentInputLine.textContent = draftInput; }

            } else if (e.key === 'Backspace') {
                e.preventDefault();
                currentInputLine.textContent = text.slice(0, -1);

            } else if (e.key === 'Enter') {
                e.preventDefault();
                const command = text.trim();
                termDiv.insertBefore(document.createTextNode(command), cursor);
                termDiv.insertBefore(document.createElement('br'), cursor);

                if (command) {
                    cmdHistory.push(command);
                    histIdx = -1; draftInput = '';
                    const result = cmd_handler(command);
                    if (result?.type === 'clear') {
                        termDiv.textContent = '';
                        termDiv.appendChild(document.createTextNode('$ '));
                        currentInputLine = document.createElement('span');
                        currentInputLine.className = 'input-line';
                        termDiv.appendChild(currentInputLine);
                        termDiv.appendChild(cursor);
                        return;
                    } else if (result?.type === 'mc' || result?.type === 'konata') {
                        currentInputLine?.remove(); currentInputLine = null;
                        const file = result.type === 'mc' ? 'mc.txt' : 'konata.txt';
                        const cls = result.type === 'mc' ? 'ascii-art' : 'konata-art';
                        fetch(file).then(r => r.text()).then(text => {
                            decryptAppendArt(text, cls, restorePrompt);
                        });
                        return;
                    } else if (result?.type === 'ozymandias') {
                        currentInputLine?.remove(); currentInputLine = null;
                        fetch('ozymandias.txt').then(r => r.text()).then(text => {
                            const wrap = document.createElement('div');
                            wrap.className = 'ozymandias-text';
                            termDiv.insertBefore(wrap, cursor);
                            const lines = text.replace(/\n$/, '').split('\n');
                            let i = 0;
                            (function nextLine() {
                                if (i >= lines.length) { restorePrompt(); return; }
                                const line = lines[i++];
                                if (!line.trim()) {
                                    wrap.appendChild(document.createTextNode('\n'));
                                    setTimeout(nextLine, 0); return;
                                }
                                const span = document.createElement('span');
                                span.textContent = line;
                                wrap.appendChild(span);
                                wrap.appendChild(document.createTextNode('\n'));
                                termDiv.scrollTop = termDiv.scrollHeight;
                                DecryptEffect.runElParallel(span, nextLine);
                            })();
                        });
                        return;
                    } else if (result?.type === 'help') {
                        termDiv.insertBefore(renderHelp(), cursor);
                    } else if (typeof result === 'string') {
                        termDiv.insertBefore(document.createTextNode(result), cursor);
                        termDiv.insertBefore(document.createElement('br'), cursor);
                    }
                }

                restorePrompt();

            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                currentInputLine.textContent += e.key;
            }
        });
    }

    setTimeout(typeIntro, 300);
}

// ════════════════════════════════════════════════════════
//  Projects Folder App
// ════════════════════════════════════════════════════════

const PROJECT_FILES = [
    { name: 'getmo', url: 'https://marincatholiccs.github.io/getmo/' },
    { name: 'mo-sweeper', url: 'https://marincatholiccs.github.io/mosweeper/' },
    { name: 'flappymo', url: 'https://marincatholiccs.github.io/flappymo/' },
    { name: 'wildchat', url: 'https://marincatholiccs.github.io/chatatmc/' },
    { name: 'voluntir', url: '../voluntir/' },
];

function buildProjectsContent(container) {
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

    PROJECT_FILES.forEach(f => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <div class="file-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="6" width="20" height="14" rx="2" stroke="#3fb950" stroke-width="1.5" fill="rgba(63,185,80,.07)"/>
                    <path d="M2 9h20" stroke="#3fb950" stroke-width="1" opacity=".4"/>
                    <path d="M7 13h10M7 16h6" stroke="#3fb950" stroke-width="1.2" stroke-linecap="round" opacity=".5"/>
                </svg>
            </div>
            <div class="file-name">${f.name}</div>`;

        const id = `browser-${f.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
        item.addEventListener('click', e => {
            e.stopPropagation();
            AppRegistry.launchBrowser(f.name, f.url);
            // Reflect open/closed state visually
            const isNowOpen = !!WindowManager.windows[id];
            item.classList.toggle('selected', isNowOpen);
            statusBar.textContent = isNowOpen ? `${f.name}  —  click to close` : `${PROJECT_FILES.length} items`;
        });

        body.appendChild(item);
    });

    const statusBar = document.createElement('div');
    statusBar.className = 'folder-statusbar';
    statusBar.textContent = `${PROJECT_FILES.length} items`;

    container.appendChild(addrBar);
    container.appendChild(body);
    container.appendChild(statusBar);
}

// ════════════════════════════════════════════════════════
//  Browser App  —  iframe window
// ════════════════════════════════════════════════════════

function buildBrowserContent(container, url) {
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

// ════════════════════════════════════════════════════════
//  About App
// ════════════════════════════════════════════════════════

function buildAboutContent(container) {
    container.classList.add('about-body');
    container.innerHTML = `
        <div class="about-logo-area">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <rect x="1" y="1"  width="18" height="18" rx="2.5" fill="#3fb950" opacity=".9"/>
                <rect x="25" y="1" width="18" height="18" rx="2.5" fill="#3fb950" opacity=".5"/>
                <rect x="1" y="25" width="18" height="18" rx="2.5" fill="#3fb950" opacity=".5"/>
                <rect x="25" y="25" width="18" height="18" rx="2.5" fill="#3fb950" opacity=".25"/>
            </svg>
            <div class="about-os-name">MC-OS</div>
            <div class="about-version">Version 1.0.0</div>
        </div>
        <div class="about-hr"></div>
        <div class="about-lines">
            <div>Marin Catholic Computer Science Club</div>
            <div>Vanilla JS &bull; Running in browser</div>
            <div>Open source &bull; No frameworks</div>
        </div>
    `;
}

// ════════════════════════════════════════════════════════
//  Command Palette  —  Ctrl+K / Cmd+K
// ════════════════════════════════════════════════════════

const CommandPalette = {
    el: null, inputEl: null, listEl: null,
    _active: -1, _filtered: [], _open: false,

    _commands: [
        { id: 'launch-terminal', label: 'Open Terminal', icon: 'terminal', shortcut: 'Ctrl+Alt+T', action: () => AppRegistry.launch('terminal') },
        { id: 'launch-projects', label: 'Open Projects', icon: 'projects', shortcut: '', action: () => AppRegistry.launch('projects') },
        { id: 'launch-about', label: 'About MC-OS', icon: 'about', shortcut: '', action: () => AppRegistry.launch('about') },
        { id: 'refresh', label: 'Refresh Desktop', icon: '', shortcut: 'F5', action: () => IconSystem.deselectAll() },
    ],

    init() {
        this.el = document.getElementById('cmd-palette-overlay');
        this.inputEl = document.getElementById('cmd-palette-input');
        this.listEl = document.getElementById('cmd-palette-list');
        if (!this.el) return;
        this.inputEl.addEventListener('input', () => this._render());
        this.inputEl.addEventListener('keydown', e => this._onKey(e));
        this.el.addEventListener('mousedown', e => { if (e.target === this.el) this.hide(); });
        this._render();
    },

    show() {
        this._open = true;
        this.el.classList.add('visible');
        this.inputEl.value = ''; this._active = -1;
        this._render();
        requestAnimationFrame(() => this.inputEl.focus());
    },

    hide() { this._open = false; this.el.classList.remove('visible'); },

    toggle() { this._open ? this.hide() : this.show(); },

    _fuzzy(query, str) {
        if (!query) return { match: true, indices: [] };
        const q = query.toLowerCase(), s = str.toLowerCase();
        let qi = 0;
        const indices = [];
        for (let si = 0; si < s.length && qi < q.length; si++) {
            if (s[si] === q[qi]) { indices.push(si); qi++; }
        }
        return { match: qi === q.length, indices };
    },

    _highlightLabel(label, indices) {
        if (!indices.length) return this._esc(label);
        const ranges = [];
        let start = indices[0], end = indices[0];
        for (let i = 1; i < indices.length; i++) {
            if (indices[i] === end + 1) { end = indices[i]; }
            else { ranges.push([start, end]); start = end = indices[i]; }
        }
        ranges.push([start, end]);
        let result = '', prev = 0;
        for (const [s, e] of ranges) {
            result += this._esc(label.slice(prev, s));
            result += `<mark>${this._esc(label.slice(s, e + 1))}</mark>`;
            prev = e + 1;
        }
        return result + this._esc(label.slice(prev));
    },

    _esc(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    _render() {
        const query = this.inputEl?.value.trim() ?? '';
        this._filtered = [];
        for (const cmd of this._commands) {
            const { match, indices } = this._fuzzy(query, cmd.label);
            if (match) this._filtered.push({ cmd, indices });
        }
        if (!this._filtered.length) {
            this.listEl.innerHTML = `<div class="cp-empty">No commands found</div>`;
            this._active = -1; return;
        }
        if (this._active >= this._filtered.length) this._active = this._filtered.length - 1;

        this.listEl.innerHTML = this._filtered.map(({ cmd, indices }, i) => `
            <div class="cp-item${i === this._active ? ' cp-active' : ''}" role="option" data-index="${i}" aria-selected="${i === this._active}">
                <span class="cp-item-icon">${APP_ICONS[cmd.icon] || ''}</span>
                <span class="cp-item-name">${this._highlightLabel(cmd.label, indices)}</span>
                ${cmd.shortcut ? `<span class="cp-item-shortcut">${this._esc(cmd.shortcut)}</span>` : ''}
            </div>`).join('');

        this.listEl.querySelectorAll('.cp-item').forEach(el => {
            el.addEventListener('mouseenter', () => { this._active = +el.dataset.index; this._updateActive(); });
            el.addEventListener('click', () => { this._active = +el.dataset.index; this._execute(); });
        });
    },

    _updateActive() {
        this.listEl.querySelectorAll('.cp-item').forEach((el, i) => {
            el.classList.toggle('cp-active', i === this._active);
            el.setAttribute('aria-selected', i === this._active ? 'true' : 'false');
        });
    },

    _onKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); this.hide(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); this._move(1); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); this._move(-1); return; }
        if (e.key === 'Enter') { e.preventDefault(); this._execute(); return; }
    },

    _move(dir) {
        if (!this._filtered.length) return;
        this._active = (this._active + dir + this._filtered.length) % this._filtered.length;
        this._updateActive();
        this.listEl.querySelector('.cp-active')?.scrollIntoView({ block: 'nearest' });
    },

    _execute() {
        const item = this._filtered[this._active] ?? this._filtered[0];
        if (!item) return;
        this.hide();
        item.cmd.action();
    },
};

// ════════════════════════════════════════════════════════
//  Toast Notification System
// ════════════════════════════════════════════════════════

const Toast = {
    _container: null,

    init() { this._container = document.getElementById('toast-container'); },

    show({ title, body = '', duration = 3000 }) {
        if (!this._container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <svg class="toast-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
                <polyline points="4.5,7.5 6.2,9 9.5,5" stroke="currentColor" stroke-width="1.5"
                          stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="toast-text">
                <div class="toast-title">${this._esc(title)}</div>
                ${body ? `<div class="toast-body">${this._esc(body)}</div>` : ''}
            </div>`;
        this._container.appendChild(toast);
        const dismiss = () => {
            toast.classList.add('toast-leaving');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        };
        setTimeout(dismiss, duration);
        toast.addEventListener('click', dismiss);
    },

    showNowPlaying(title, videoId) {
        if (!this._container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        const thumbHtml = videoId
            ? `<img class="toast-thumb" src="https://i.ytimg.com/vi/${videoId}/default.jpg" alt="" loading="lazy">`
            : `<svg class="toast-icon" width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M5 4.5L10 7 5 9.5V4.5z" fill="currentColor"/></svg>`;
        toast.innerHTML = `
            ${thumbHtml}
            <div class="toast-text">
                <div class="toast-title">now playing</div>
                <div class="toast-body">${this._esc(title)}</div>
            </div>`;
        this._container.appendChild(toast);
        const dismiss = () => {
            toast.classList.add('toast-leaving');
            toast.addEventListener('animationend', () => toast.remove(), { once: true });
        };
        setTimeout(dismiss, 5000);
        toast.addEventListener('click', dismiss);
    },

    _esc(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
};

// ════════════════════════════════════════════════════════
//  DecryptEffect  — scramble → reveal animation
// ════════════════════════════════════════════════════════

const DecryptEffect = {
    CHARS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*',

    // Collect words from multiple root elements and animate them sequentially
    runAll(roots) {
        const words = [];
        for (const root of roots) this._collectWords(root, words);
        if (words.length) this._animateSequence(words, 0);
    },

    _collectWords(root, out) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const p = node.parentElement;
                if (!p) return NodeFilter.FILTER_REJECT;
                const tag = p.tagName;
                if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
                if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                const s = getComputedStyle(p);
                if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0')
                    return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            },
        });

        const nodes = [];
        let n;
        while ((n = walker.nextNode())) nodes.push(n);

        for (const textNode of nodes) {
            const text = textNode.textContent;
            const frag = document.createDocumentFragment();
            // Split into word tokens and whitespace tokens
            for (const part of text.split(/(\s+)/)) {
                if (!part) continue;
                if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else {
                    const span = document.createElement('span');
                    span.dataset.target = part;
                    span.textContent = this._scramble(part);
                    frag.appendChild(span);
                    out.push(span);
                }
            }
            textNode.parentNode.replaceChild(frag, textNode);
        }
    },

    _scramble(word) {
        return word.split('').map(ch => /[A-Za-z0-9]/.test(ch) ? this._rand() : ch).join('');
    },

    _rand() {
        return this.CHARS[Math.floor(Math.random() * this.CHARS.length)];
    },

    // Decrypt all words in el sequentially, call onDone when complete
    runEl(el, onDone) {
        const words = [];
        this._collectWords(el, words);
        if (!words.length) { if (onDone) onDone(); return; }
        const seq = i => {
            if (i >= words.length) { if (onDone) onDone(); return; }
            this._decryptWord(words[i], () => seq(i + 1));
        };
        seq(0);
    },

    // Decrypt all words in el simultaneously, call onDone when the last finishes
    runElParallel(el, onDone, duration = 200) {
        const words = [];
        this._collectWords(el, words);
        if (!words.length) { if (onDone) onDone(); return; }
        let remaining = words.length;
        const done = () => { if (--remaining === 0 && onDone) onDone(); };
        words.forEach(span => this._decryptWord(span, done, duration));
    },

    _animateSequence(words, index) {
        if (index >= words.length) return;
        this._decryptWord(words[index], () => this._animateSequence(words, index + 1));
    },

    _decryptWord(span, onDone, duration = 320) {
        const target = span.dataset.target;
        const chars = target.split('');
        const alpha = chars.reduce((acc, ch, i) => (/[A-Za-z0-9]/.test(ch) ? [...acc, i] : acc), []);

        if (!alpha.length) { span.textContent = target; if (onDone) onDone(); return; }

        const DURATION = duration;
        const TICK = 30;
        const totalTicks = Math.ceil(DURATION / TICK);
        let tick = 0;
        const cur = chars.slice();
        alpha.forEach(i => { cur[i] = this._rand(); });
        span.textContent = cur.join('');

        const id = setInterval(() => {
            tick++;
            const resolved = Math.floor((tick / totalTicks) * alpha.length);
            for (let i = 0; i < resolved; i++) cur[alpha[i]] = chars[alpha[i]];
            for (let i = resolved; i < alpha.length; i++) cur[alpha[i]] = this._rand();
            span.textContent = cur.join('');
            if (tick >= totalTicks) {
                clearInterval(id);
                span.textContent = target;
                if (onDone) onDone();
            }
        }, TICK);
    },
};

// ════════════════════════════════════════════════════════
//  Music Player  —  YouTube IFrame API wrapper
// ════════════════════════════════════════════════════════

const MusicPlayer = {
    _player: null,
    _ready: false,
    _playing: false,
    _toastShown: false,
    PLAYLIST_ID: 'PL6NdkXsPL07KN01gH2vucrHCEyyNmVEx4',

    init() {
        const div = document.createElement('div');
        div.id = 'yt-player';
        div.style.cssText = 'position:absolute;opacity:0;pointer-events:none;width:1px;height:1px;top:-9999px;left:-9999px;';
        document.body.appendChild(div);

        window.onYouTubeIframeAPIReady = () => this._createPlayer();
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
    },

    _createPlayer() {
        this._player = new YT.Player('yt-player', {
            height: '1', width: '1',
            playerVars: {
                listType: 'playlist', list: this.PLAYLIST_ID,
                autoplay: 0, controls: 0, playsinline: 1, enablejsapi: 1,
            },
            events: {
                onReady: e => this._onReady(e),
                onStateChange: e => this._onStateChange(e),
            },
        });
        document.addEventListener('visibilitychange', () => {
            if (!this._ready) return;
            if (document.hidden) { this._player?.pauseVideo(); }
            else if (this._playing) { this._player?.playVideo(); }
        });
    },

    _onReady(event) {
        this._ready = true;
        event.target.playVideo();
    },

    _onStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            this._playing = true;
            if (!this._toastShown) {
                this._toastShown = true;
                // Delay getVideoData so playlist metadata is populated
                setTimeout(() => {
                    const d = this._player.getVideoData();
                    Toast.showNowPlaying(d.title || 'lofi mix', d.video_id);
                }, 500);
            }
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            this._playing = false;
        }
        VolumeDropdown._updatePlayBtn();
    },

    play() { this._player?.playVideo(); },
    pause() { this._player?.pauseVideo(); },
    toggle() { this._playing ? this.pause() : this.play(); },
    next() { this._player?.nextVideo(); },
    prev() { this._player?.previousVideo(); },
    setVolume(v) { this._player?.setVolume(v); },
    isPlaying() { return this._playing; },
};

// ════════════════════════════════════════════════════════
//  Network Dropdown
// ════════════════════════════════════════════════════════

const NetworkDropdown = {
    _open: false, _el: null,

    init() {
        const btn = document.getElementById('sys-net');
        this._el = document.getElementById('net-dropdown');
        if (!btn || !this._el) return;
        btn.addEventListener('click', e => { e.stopPropagation(); this.toggle(); });
        document.addEventListener('click', e => {
            if (!e.target.closest('#net-dropdown') && !e.target.closest('#sys-net')) this.hide();
        });
    },

    toggle() { this._open ? this.hide() : this.show(); },
    show() { VolumeDropdown.hide(); this._open = true; this._el.classList.add('visible'); },
    hide() { this._open = false; this._el?.classList.remove('visible'); },
};

// ════════════════════════════════════════════════════════
//  Volume Dropdown
// ════════════════════════════════════════════════════════

const VolumeDropdown = {
    _open: false,
    _el: null, _slider: null, _playBtn: null,

    init() {
        const btn = document.getElementById('sys-vol');
        this._el = document.getElementById('vol-dropdown');
        this._slider = document.getElementById('vol-slider');
        this._playBtn = document.getElementById('vol-play-btn');
        if (!btn || !this._el) return;

        btn.addEventListener('click', e => { e.stopPropagation(); this.toggle(); });

        this._slider.addEventListener('input', () => {
            const pct = this._slider.value;
            this._slider.style.background = `linear-gradient(to right, white ${pct}%, #111811 ${pct}%)`;
            MusicPlayer.setVolume(+pct);
        });

        document.getElementById('vol-prev-btn').addEventListener('click', e => {
            e.stopPropagation(); MusicPlayer.prev();
        });
        document.getElementById('vol-next-btn').addEventListener('click', e => {
            e.stopPropagation(); MusicPlayer.next();
        });
        this._playBtn.addEventListener('click', e => {
            e.stopPropagation(); MusicPlayer.toggle();
        });

        document.addEventListener('click', e => {
            if (!e.target.closest('#vol-dropdown') && !e.target.closest('#sys-vol')) this.hide();
        });
    },

    toggle() { this._open ? this.hide() : this.show(); },

    show() {
        NetworkDropdown.hide();
        this._open = true;
        this._el.classList.add('visible');
        this._updatePlayBtn();
    },

    hide() {
        this._open = false;
        this._el?.classList.remove('visible');
    },

    _updatePlayBtn() {
        if (!this._playBtn) return;
        this._playBtn.innerHTML = MusicPlayer.isPlaying()
            ? `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="1.5" width="3" height="9" rx=".5" fill="currentColor"/><rect x="7" y="1.5" width="3" height="9" rx=".5" fill="currentColor"/></svg>`
            : `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 1.5L10.5 6 3 10.5V1.5z" fill="currentColor"/></svg>`;
    },
};

// ════════════════════════════════════════════════════════
//  Init
// ════════════════════════════════════════════════════════

window.addEventListener('load', () => {
    SnapPreview.init();
    WallpaperCanvas.init();
    IconSystem.init();
    ContextMenu.init();
    SystemPanel.init();
    CommandPalette.init();
    Toast.init();
    MusicPlayer.init();
    VolumeDropdown.init();
    NetworkDropdown.init();

    // Decrypt animation — panel brand + workspaces + desktop icon labels
    DecryptEffect.runAll([
        document.getElementById('panel-left'),
        document.getElementById('panel-workspaces'),
        ...document.querySelectorAll('.desktop-icon .icon-label'),
    ]);

    document.getElementById('panel-brand').onclick = () => AppRegistry.launch('terminal');

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
            e.preventDefault(); AppRegistry.launch('terminal');
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !e.altKey) {
            e.preventDefault(); CommandPalette.toggle();
        }
        if (e.key === 'F5' && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault(); IconSystem.deselectAll();
        }
        if (e.key === 'Escape') { ContextMenu.hide(); CommandPalette.hide(); }
    });

    // Deselect icons on bare desktop click
    document.getElementById('desktop').addEventListener('mousedown', e => {
        const t = e.target;
        if (t === document.getElementById('desktop') || t === document.getElementById('desktop-canvas')) {
            IconSystem.deselectAll();
        }
    });

    // Boot: simulate terminal icon click, then open window
    setTimeout(() => {
        const termIcon = document.querySelector('.desktop-icon[data-app="terminal"]');
        if (termIcon) {
            termIcon.classList.add('selected');
            setTimeout(() => { termIcon.classList.remove('selected'); AppRegistry.launch('terminal'); }, 180);
        } else {
            AppRegistry.launch('terminal');
        }
    }, 350);
    // "now playing" toast fires from MusicPlayer._onStateChange on first play
});
