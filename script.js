'use strict';
// ════════════════════════════════════════════════════════
//  MC-OS  —  desktop simulation
// ════════════════════════════════════════════════════════

const PANEL_H   = 32;   // top panel height px
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
};

// ════════════════════════════════════════════════════════
//  Data  (unchanged)
// ════════════════════════════════════════════════════════

const textIntro = `$ whoami
Marin Catholic Computer Science Club

$ hackathons
`;

const projects = [
    { name: "getmo",      url: "../getmo/"     },
    { name: "mo-sweeper", url: "../mosweeper/" },
    { name: "flappymo",   url: "../flappymo/"  },
    { name: "wildchat",   url: "../chatatmc/"  },
];

const officers = [
    { name: "Stanley Ho — Co-President",  url: "https://www.linkedin.com/in/stanley-ho-66748a338/"  },
    { name: "Nico Zametto — Co-President", url: "https://www.linkedin.com/in/nico-zametto-a862643b4/" },
    { name: "Gavin Perry - First Officer"  },
    { name: "Alex Willard — Second Officer"},
    { name: "Mo Adib - Moderator"          },
];

const hackathons = [
    { name: "BullHacks 2026 - Voluntir - 1st Place - $1000", url: "../voluntir/", highlight: true },
    { name: "StangHacks 2026 - Voluntir (Improved) - Honorable Mention, Second Round Judging", url: "../voluntir/" },
];

const ozymandias = `I met a traveller from an antique land,
Who said—"Two vast and trunkless legs of stone
Stand in the desert. . . . Near them, on the sand,
Half sunk a shattered visage lies, whose frown,
And wrinkled lip, and sneer of cold command,
Tell that its sculptor well those passions read
Which yet survive, stamped on these lifeless things,
The hand that mocked them, and the heart that fed;
And on the pedestal, these words appear:
My name is Ozymandias, King of Kings;
Look on my Works, ye Mighty, and despair!"
Nothing beside remains. Round the decay
Of that colossal Wreck, boundless and bare
The lone and level sands stretch far away.`;

const mc_ascii = `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
%@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%@%%%@@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%@@@%%%%%%
%@%%%@@                                         @%                                           %%%%%%%
%@%%%%@                                       @%@%%@                                         %%%%%%%
%@%%%%@                                      @%%%%%@@                                        %%%%%%%
%@%%%%@                                    %%%%%%%%%%@%@                                     %%%%%%%
%@%%%%@                                   @@@@@%%%@%@@%@                                     @%%%%%%
%@%%%%@                                       @@%%@@                                         @%%%%%%
%@%%%%@                              @@       @@%%@@       @@                                @%%%%%%
%@%%%%@                             @@%@      %@%%@@      @%%@@                              @%%%%%%
%@%%%%@                           @%@%@%@@@@@@@%%%@@@@@@@@@@%@%%                             @%%%%%%
%@%%%%@                         @%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%@%@                           @%%%%%%
%@%%%%@                         @@%%%%%%%%%%%@@@%%@@%%%%%%%%%%%@@@                           @%%%%%%
%@%%%%@                           @@%%%%      @%%%%%      @@%%%@                             @%%%%%%
%@%%%%@        %@@@@@@@@@@@@@@@%    @%%@      @@%%@@      @@%%    %@@@@@@@@@@@@@@@@@         @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%@   @@       @@%%@@       @@   @%@%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%%%           @@%%@@           %%%%%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%%@@      @@@@@@%%@%@@%%      @%%%%%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%%%%@      %@@@%%%%%%@%      @%%%%%%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @%%%%%%%%%%%%%%%%%%%%%%%@      @@%%%%%@       @@%%%%%%%%%%%%%%%%%%%%%%%@       @%%%%%%
%@%%%%@       @@%%%%%%%%%%%%%%%%%%%%%%%@       %%%%@       @@%%%%%%%%%%%%%%%%%%%%%%%@        @%%%%%%
%@%%%%@           %%%%%%%%%%@%%%%%%%%%@%@                 @@%%%%%%%%%%@@%%%%%%%%@@           @%%%%%%
%@%%%%@           @%%%%%%%%%%@@%%%%%%%%%%@               @@%%%%%%%%%@@%%%%%%%%%%%@           @%%%%%%
%@%%%%@           @%%%%%%%%%@@ @%%%%%%%%%%@             %%%%%%%%%%%@@@%@%%%%%%%%%@           @%%%%%%
%@%%%%@           @%%%%%%%%%%@  @%%%%%%%%@@@           @%@%%%%%%%%%@ @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           @%%%%%%%%%%@   %%%%%%%%%%@@         @@@%@@%%%%%@   @%@%%%%%%%%%@           @%%%%%%
%@%%%%@           @%%%%%%%%%%@    @%%%%%%%%%@@@@@%%%%%%@@@%@@%@%@    @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           @%%%%%%%%%%@     @%@%%%%%%%@@@@%%%%%%%%%%%%%@@     @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           @%%%%%%%%%%@      @@@%%%%%%%%@@@%%%%%%%%%%%%@@@    @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @@@%%%%%%%%%@@@%%%%%%%%%%%%@@@    @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%@@%@%%%%%%%@@@@%%%%%%%%%%@%@    @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%%@@@%%%%%%%%@@@@@@@@%%%%%@%@    @%@%%%%%%%%%@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%%%@@@@%%%%%%%%@   %@%%%%%@%@    @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%%%%%@@%%%%%%%%@%  @@%%%%%@%@    @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           %@%%%%%%%%%@     @%%%%@@@%@%%%%%%%@@@@@%%%%%@%@    @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           %@%%%%%%%%@@     @%%%%%%@@%%%%%%%%%%@@@@@@@@@@@    @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           %@%%%%%%%%@@     @%%%%%%@@ @%%%%%%%@               @%@%%%%%%%%@@           @%%%%%@
%@%%%%@           @@%%%%%%%%@%     @%%%%%%@@  @%%%%@@                %@@%%%%%%%%@@           @%%%%%@
%@%%%@@          @@@%%%%%%%%%%     @%%%%%%@@   @@%@                  @%@%%%%%%%%%@           @%%%%%@
%@%%%%@       @%@@%@%%%%%%%%@%@%%  @%%%%%%@@    @@                 %@%@%%%%%%%%%@%@@@@      @%%%%%%@
@@%%%@@       @%%%%%%%%%%%%%%%%%%  @%%%%%%@@                       %@%%%%%%%%%%%%%%%%@      @@%%%%%@
%%%%%%@@      @%%%%%%%%%%%%%%%%%%  @@%%%%%@@                       %@%%%%%%%%%%%%%%%%@     @@%%%%@%
%@@%%%%@@     @%%%%%%%%%%%%%%%%%%  @@%%%%%@@                       %@%%%%%%%%%%%%%%%%@    @%%%%%@@@
 @@%%%%@@@    @%%%%%%%%%%%%%%%%%%  @@%%%%%@@                       %@%%%%%%%%%%%%%%%%@   @@%%%%%%@
  %@%%%%%%%   @@@%%%%%%%%%%%%%%%@  @@%%%%%@@            @@@@@@@@   %@@%%%%%%%%%%%%@%@   %@%%%%%%@
   @%@%%%%%@@                      @@%%%%%@@           @%%%%%%%%@                      %@%%%%%@%@
    @%%%%%%%%@                     @@%%%%%@@           @@%%%%%@%@                    @@@%%%%@@@
     @%@%%%%%%@@                   @@%%%%%@@           @@%%%%%@%@                   @%%%%%%@%@
       @@%%%%%@%%@                 @@%%%%%%@           @%%%%%%@%@                 @%@%%%%%%%
        @@@%%%%%@@@@               @@%%%%%@@@@@@@@@@@@@@%%%%%%@@@               @@%%%%%%%@@
          @%@%%%%%%@@@             @%%%%%%%%%%%%%%%%%%%%%%%%%%%%              @%%%%%%%%%@
            @@@%%%%%%@@@           @@@%%%%%%%%%%%%%%%%%%%%%%%@@%           @@%@%%%%%%%@
              @%%@%%%%%@@@          @@%@@@@@@@@@@@@@@@@@@@@@%%@          @%%%%%%%%@@@
                @%%%%%%%%@%@%         @@@@@@@@@@@@@@@@@@@@@%@          @@@@%%%%%%%@
                  @@%%%%%%%@%%@@                                    @@@%%%%%%%@@@@
                    @%@%%%%%%%@@@@@                              @%%@%%%%%%%@@@
                       @@%@%%%%%%%%@@@                        @@%%%%%%%%%@@%@
                          @%%@%%%%%%%%%@                    %@%%%%%%%%@@@@
                            @%@%%%%%%%%%%@@%             @@%@%%%%%%%%@@@
                               @@%@%%%%%%%%%@@@      %@%@%%%%%%%%%@@@
                                  @@@%%%%%%%%%%%%@@@%%%%%%%%%%%@@@
                                     @@%@@%%%%%%%%%%%%%%%%@@%@@
                                         @%@%%%%%%%%%%%%%%%%
                                           @@%%%%%%%%@%@@
                                              @@@%%@@@        `;

const helpText = [
    { cmd: "help",       desc: "show this message" },
    { cmd: "whoami",     desc: "existential crisis" },
    { cmd: "sudo",       desc: "try it" },
    { cmd: "ozymandias", desc: "a poem" },
    { cmd: "mc",         desc: "ascii art" },
    { cmd: "clear",      desc: "clear the terminal" },
    { cmd: "1-4",        desc: "open a project" },
];

// ════════════════════════════════════════════════════════
//  Snap Preview
// ════════════════════════════════════════════════════════

const SnapPreview = {
    el: null, current: null,
    init()       { this.el = document.getElementById('snap-preview'); },
    show(zone) {
        if (!zone || !this.el) { this.hide(); return; }
        if (zone === this.current) return;
        this.current = zone;
        const deskH = window.innerHeight - PANEL_H;
        const half  = Math.floor(window.innerWidth / 2);
        const rects = {
            left:     { l: 0,    t: PANEL_H, w: half,                    h: deskH },
            right:    { l: half, t: PANEL_H, w: window.innerWidth - half, h: deskH },
            maximize: { l: 0,    t: PANEL_H, w: window.innerWidth,        h: deskH },
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
    windows:  {},
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

        win.querySelector('.btn-close').onclick    = e => { e.stopPropagation(); this.close(id); };
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
        const half  = Math.floor(window.innerWidth / 2);
        const rects = {
            left:     `left:0;top:${PANEL_H}px;width:${half}px;height:${deskH}px;border-radius:0;`,
            right:    `left:${half}px;top:${PANEL_H}px;width:${window.innerWidth - half}px;height:${deskH}px;border-radius:0;`,
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
            if (w.minimized)                                    { this.restore(id); }
            else if (w.el.classList.contains('window-focused')) { this.minimize(id); }
            else                                                { this.focus(id); }
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

            const winId  = win.id.replace('win-', '');
            const wState = this.windows[winId];

            // Un-snap / un-maximize on drag: restore prev size and reposition under cursor
            if (wState && (wState.snapped || wState.maximized) && wState.prevRect) {
                const prevW = parseInt(wState.prevRect.width)  || 800;
                const prevH = parseInt(wState.prevRect.height) || 500;
                win.style.left         = Math.max(0, Math.min(window.innerWidth - prevW, e.clientX - prevW / 2)) + 'px';
                win.style.top          = Math.max(PANEL_H, e.clientY - 17) + 'px';
                win.style.width        = prevW + 'px';
                win.style.height       = prevH + 'px';
                win.style.borderRadius = '';
                wState.snapped = null; wState.maximized = false; wState.prevRect = null;
            }

            const startX = e.clientX, startY = e.clientY;
            const startL = parseInt(win.style.left) || 0;
            const startT = parseInt(win.style.top)  || 0;
            let   snapZone = null;

            const onMove = e => {
                win.style.left = (startL + e.clientX - startX) + 'px';
                win.style.top  = Math.max(PANEL_H, startT + e.clientY - startY) + 'px';

                const prev = snapZone;
                if      (e.clientX <= SNAP_EDGE)                       snapZone = 'left';
                else if (e.clientX >= window.innerWidth  - SNAP_EDGE)  snapZone = 'right';
                else if (e.clientY <= PANEL_H + SNAP_EDGE)             snapZone = 'maximize';
                else                                                    snapZone = null;
                if (snapZone !== prev) SnapPreview.show(snapZone);
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup',   onUp);
                SnapPreview.hide();
                if (snapZone) this._applySnap(winId, snapZone);
                snapZone = null;
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup',   onUp);
        });
    },

    _makeResizable(win, handle) {
        handle.addEventListener('mousedown', e => {
            e.preventDefault(); e.stopPropagation();
            const startX = e.clientX, startY = e.clientY;
            const startW = win.offsetWidth, startH = win.offsetHeight;
            const onMove = e => {
                win.style.width  = Math.max(320, startW + e.clientX - startX) + 'px';
                win.style.height = Math.max(200, startH + e.clientY - startY) + 'px';
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup',   onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup',   onUp);
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
            build:     buildTerminalContent,
            scanlines: true,
        },
        projects: {
            title: 'Projects',
            w: ()  => 520,
            h: ()  => 400,
            build:     buildProjectsContent,
            scanlines: false,
        },
        about: {
            title: 'About MC-OS',
            w: ()  => 380,
            h: ()  => 280,
            build:     buildAboutContent,
            scanlines: false,
        },
    },

    launch(id, opts = {}) {
        const app = this.apps[id];
        if (!app) return;
        const dW = window.innerWidth, dH = window.innerHeight - PANEL_H;
        const w  = app.w(dW), h = app.h(dH);
        const stagger = id === 'projects' ? 28 : id === 'about' ? 14 : 0;
        WindowManager.create({
            id, title: app.title,
            width: w, height: h,
            x: opts.x ?? Math.max(0, Math.floor((dW - w) / 2) + stagger),
            y: opts.y ?? PANEL_H + Math.max(0, Math.floor((dH - h) / 2) - 16) + stagger,
            buildContent: app.build,
            scanlines:    app.scanlines,
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
            const startT = parseInt(el.style.top)  || 0;
            dragStarted = false;

            const onMove = e => {
                const dx = e.clientX - startX, dy = e.clientY - startY;
                if (!dragStarted && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
                    dragStarted = true;
                    el.classList.add('dragging');
                }
                if (dragStarted) {
                    el.style.left = Math.max(0, Math.min(window.innerWidth - 76, startL + dx)) + 'px';
                    el.style.top  = Math.max(PANEL_H + 4, Math.min(window.innerHeight - 108, startT + dy)) + 'px';
                }
            };
            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup',   onUp);
                el.classList.remove('dragging');
                dragStarted = false;
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup',   onUp);
        });

        el.addEventListener('dblclick', e => {
            e.stopPropagation();
            if (appId) AppRegistry.launch(appId);
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
        this.el.style.top  = y + 'px';
        this.el.classList.add('visible');
        requestAnimationFrame(() => {
            if (!this.el.classList.contains('visible')) return;
            const r = this.el.getBoundingClientRect();
            if (r.right  > window.innerWidth)  this.el.style.left = (x - r.width)  + 'px';
            if (r.bottom > window.innerHeight) this.el.style.top  = (y - r.height) + 'px';
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
            case 'refresh':       IconSystem.deselectAll();        break;
            case 'about':         AppRegistry.launch('about');     break;
        }
    },
};

// ════════════════════════════════════════════════════════
//  Wallpaper Canvas  —  subtle particle starfield
// ════════════════════════════════════════════════════════

const WallpaperCanvas = {
    canvas: null, ctx: null, particles: [], animId: null,

    init() {
        this.canvas = document.getElementById('desktop-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this._resize();
        window.addEventListener('resize', () => this._resize());
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { cancelAnimationFrame(this.animId); }
            else                 { this._animate(); }
        });
        this._animate();
    },

    _resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this._spawn();
    },

    _spawn() {
        const W = this.canvas.width, H = this.canvas.height;
        const count = Math.floor(W * H / 18000); // ~115 on 1080p
        this.particles = Array.from({ length: count }, () => {
            const green = Math.random() < 0.12; // 12% green-tinted
            return {
                x: Math.random() * W, y: Math.random() * H,
                r: Math.random() * 1.1 + 0.3,
                vx: (Math.random() - 0.5) * 0.07,
                vy: (Math.random() - 0.5) * 0.07,
                opacity: Math.random() * 0.35 + 0.08,
                twinkleSpeed: Math.random() * 1.8 + 0.4,
                twinklePhase: Math.random() * Math.PI * 2,
                green,
            };
        });
    },

    _animate() {
        const { ctx, canvas, particles } = this;
        const W = canvas.width, H = canvas.height;
        const t = Date.now() * 0.001;

        ctx.clearRect(0, 0, W, H);

        // Connections between nearby green particles
        const greens = particles.filter(p => p.green);
        for (let i = 0; i < greens.length; i++) {
            for (let j = i + 1; j < greens.length; j++) {
                const dx = greens[i].x - greens[j].x, dy = greens[i].y - greens[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < 90) {
                    ctx.strokeStyle = `rgba(0,255,65,${(1 - d / 90) * 0.045})`;
                    ctx.lineWidth   = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(greens[i].x, greens[i].y);
                    ctx.lineTo(greens[j].x, greens[j].y);
                    ctx.stroke();
                }
            }
        }

        // Particles
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;

            const tw    = Math.sin(t * p.twinkleSpeed + p.twinklePhase) * 0.15 + 0.85;
            const alpha = p.opacity * tw;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.green ? `rgba(0,255,65,${alpha * 0.8})` : `rgba(255,255,255,${alpha})`;
            ctx.fill();
        }

        this.animId = requestAnimationFrame(() => this._animate());
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
    let charIndex = 0, currentInputLine = null;

    function typeIntro() {
        if (charIndex < textIntro.length) {
            termDiv.textContent += textIntro.charAt(charIndex++);
            setTimeout(typeIntro, 30);
        } else { addHackathons(); }
    }

    function cmd_handler(command) {
        if (command === 'sudo')       return 'sudo these nuts';
        if (command === 'whoami')     return 'who are we at all?';
        if (command === 'ozymandias') return ozymandias;
        if (command === 'gavin')      return 'newsom\u{1F940}\u{1F494}';
        if (command === 'mc')         return { type: 'ascii', text: mc_ascii };
        if (command === 'help')       return { type: 'help' };
        if (command === 'clear')      return { type: 'clear' };
        const n = parseInt(command);
        if (n >= 1 && n <= projects.length) { window.location.replace(projects[n - 1].url); return; }
        return `${command}: command not found`;
    }

    function renderHelp() {
        const frag = document.createDocumentFragment();
        helpText.forEach(h => {
            const line = document.createElement('div');
            const c = document.createElement('span'); c.textContent = `  ${h.cmd.padEnd(14)}`; c.className = 'help-cmd';
            const d = document.createElement('span'); d.textContent = h.desc;                  d.className = 'help-text';
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
                termDiv.appendChild(a); i++; setTimeout(next, 120);
            } else { termDiv.appendChild(document.createTextNode('\n$ officers\n')); addOfficers(); }
        })();
    }

    function addHackathons() {
        let i = 0;
        (function next() {
            if (i < hackathons.length) {
                const a = document.createElement('a');
                a.href = hackathons[i].url; a.textContent = `  - ${hackathons[i].name}`; a.className = 'terminal-link';
                if (hackathons[i].highlight) a.classList.add('highlight');
                termDiv.appendChild(a); i++; setTimeout(next, 120);
            } else { termDiv.appendChild(document.createTextNode('\n$ projects\n')); addProjects(); }
        })();
    }

    function addOfficers() {
        let i = 0;
        (function next() {
            if (i < officers.length) {
                if (officers[i].url) {
                    const a = document.createElement('a');
                    a.href = officers[i].url; a.textContent = `  - ${officers[i].name}`; a.className = 'terminal-link';
                    termDiv.appendChild(a);
                } else {
                    const d = document.createElement('div');
                    d.textContent = `  - ${officers[i].name}`; d.className = 'officer-line';
                    termDiv.appendChild(d);
                }
                i++; setTimeout(next, 120);
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
                    } else if (result?.type === 'ascii') {
                        const pre = document.createElement('pre'); pre.className = 'ascii-art'; pre.textContent = result.text;
                        termDiv.insertBefore(pre, cursor);
                    } else if (result?.type === 'help') {
                        termDiv.insertBefore(renderHelp(), cursor);
                    } else if (typeof result === 'string') {
                        termDiv.insertBefore(document.createTextNode(result), cursor);
                        termDiv.insertBefore(document.createElement('br'), cursor);
                    }
                }

                termDiv.insertBefore(document.createTextNode('$ '), cursor);
                currentInputLine?.remove();
                currentInputLine = document.createElement('span');
                currentInputLine.className = 'input-line';
                termDiv.insertBefore(currentInputLine, cursor);
                termDiv.scrollTop = termDiv.scrollHeight;

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
    { name: 'getmo.exe',      url: 'https://marincatholiccs.github.io/getmo/' },
    { name: 'mo-sweeper.exe', url: 'https://marincatholiccs.github.io/mosweeper/' },
    { name: 'flappymo.exe',   url: 'https://marincatholiccs.github.io/flappymo/' },
    { name: 'wildchat.exe',   url: 'https://marincatholiccs.github.io/chatatmc/' },
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

    let selected = null;

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

        item.addEventListener('click', e => {
            e.stopPropagation();
            if (selected) selected.classList.remove('selected');
            selected = item;
            item.classList.add('selected');
            statusBar.textContent = `${f.name}  —  double-click to open`;
        });

        item.addEventListener('dblclick', e => {
            e.stopPropagation();
            window.open(f.url, '_blank', 'noopener');
        });

        body.appendChild(item);
    });

    body.addEventListener('click', () => {
        if (selected) {
            selected.classList.remove('selected');
            selected = null;
            statusBar.textContent = `${PROJECT_FILES.length} items`;
        }
    });

    const statusBar = document.createElement('div');
    statusBar.className = 'folder-statusbar';
    statusBar.textContent = `${PROJECT_FILES.length} items`;

    container.appendChild(addrBar);
    container.appendChild(body);
    container.appendChild(statusBar);
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
        { id: 'launch-terminal', label: 'Open Terminal',   icon: 'terminal', shortcut: 'Ctrl+Alt+T', action: () => AppRegistry.launch('terminal') },
        { id: 'launch-projects', label: 'Open Projects',   icon: 'projects', shortcut: '',           action: () => AppRegistry.launch('projects') },
        { id: 'launch-about',    label: 'About MC-OS',     icon: 'about',    shortcut: '',           action: () => AppRegistry.launch('about')    },
        { id: 'refresh',         label: 'Refresh Desktop', icon: '',         shortcut: 'F5',         action: () => IconSystem.deselectAll()        },
    ],

    init() {
        this.el      = document.getElementById('cmd-palette-overlay');
        this.inputEl = document.getElementById('cmd-palette-input');
        this.listEl  = document.getElementById('cmd-palette-list');
        if (!this.el) return;
        this.inputEl.addEventListener('input',   () => this._render());
        this.inputEl.addEventListener('keydown', e  => this._onKey(e));
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
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
            el.addEventListener('click',      () => { this._active = +el.dataset.index; this._execute(); });
        });
    },

    _updateActive() {
        this.listEl.querySelectorAll('.cp-item').forEach((el, i) => {
            el.classList.toggle('cp-active', i === this._active);
            el.setAttribute('aria-selected', i === this._active ? 'true' : 'false');
        });
    },

    _onKey(e) {
        if (e.key === 'Escape')    { e.preventDefault(); this.hide();       return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); this._move(1);     return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); this._move(-1);    return; }
        if (e.key === 'Enter')     { e.preventDefault(); this._execute();   return; }
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

    _esc(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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

    // Boot: open terminal then welcome toast
    setTimeout(() => AppRegistry.launch('terminal'), 350);
    setTimeout(() => Toast.show({ title: 'MC-OS', body: 'Welcome — press Ctrl+K to open commands' }), 1400);
});
