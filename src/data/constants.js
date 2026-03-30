// RETRO RETHEME — taskbar at bottom, no top offset needed for content
// PANEL_H is used for snap zones and window positioning — set to 0 since taskbar is at bottom
export const PANEL_H = 0;
export const TASKBAR_H = 40;
export const SNAP_EDGE = 8;

export const APP_ICONS = {
  home: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <rect x=".8" y=".8" width="10.4" height="9.4" rx="1.5" stroke="currentColor" stroke-width="1.2" fill="none"/>
    <line x1=".8" y1="3.5" x2="11.2" y2="3.5" stroke="currentColor" stroke-width="1.1"/>
    <circle cx="2.8" cy="2.2" r=".6" fill="currentColor"/>
    <circle cx="4.8" cy="2.2" r=".6" fill="currentColor"/>
  </svg>`,
  terminal: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <polyline points="1,1 6,5.5 1,10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="7" y1="10" x2="11" y2="10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,
  projects: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <path d="M1 4h4.5l1.2-2H11a.8.8 0 0 1 .8.8v5.4a.8.8 0 0 1-.8.8H1a.8.8 0 0 1-.8-.8V4.8A.8.8 0 0 1 1 4z" stroke="currentColor" stroke-width="1.2" fill="none"/>
  </svg>`,
  hackathons: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <path d="M6 .5l1.5 3 3.3.5-2.4 2.3.6 3.2L6 7.8 3 9.5l.6-3.2L1.2 4l3.3-.5L6 .5z" fill="currentColor" stroke="currentColor" stroke-width=".5"/>
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
  whoami: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <rect x=".6" y="2" width="10.8" height="8" rx="1" stroke="currentColor" stroke-width="1.2" fill="none"/>
    <rect x="2" y=".5" width="3.5" height="2.5" rx=".5" stroke="currentColor" stroke-width="1" fill="none"/>
    <line x1="4" y1="6" x2="8" y2="6" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
    <line x1="4" y1="8" x2="7" y2="8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
  </svg>`,
  officers: `<svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <circle cx="6" cy="3.5" r="2.5" stroke="currentColor" stroke-width="1.2" fill="none"/>
    <path d="M1.5 10.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  </svg>`,
};

export const textIntro = `$ whoami
Marin Catholic Computer Science Club

$ hackathons
`;

export const projects = [
  { name: "getmo", url: "https://marincatholiccs.github.io/getmo/", favicon: "https://marincatholiccs.github.io/getmo/favicon.ico" },
  { name: "mo-sweeper", url: "https://marincatholiccs.github.io/mosweeper/", favicon: "https://marincatholiccs.github.io/mosweeper/favicon.ico" },
  { name: "flappymo", url: "https://marincatholiccs.github.io/flappymo/", favicon: "https://marincatholiccs.github.io/flappymo/favicon.ico" },
  { name: "wildchat", url: "https://marincatholiccs.github.io/chatatmc/", favicon: "https://marincatholiccs.github.io/chatatmc/favicon.ico" },
];

// Derive photo path from name: "Nico Zametto" → "/images/nicozametto.jpg"
// Officers just need to add their photo to public/images/ as firstname+lastname lowercase .jpg
export function getOfficerPhoto(name) {
  const first = name.split('—')[0].trim();
  return '/images/' + first.replace(/\s+/g, '').toLowerCase() + '.jpg';
}

export const officers = [
  { name: "Stanley Ho — Co-President", url: "https://www.linkedin.com/in/stanley-ho-66748a338/" },
  { name: "Nico Zametto — Co-President", url: "https://www.linkedin.com/in/nico-zametto-a862643b4/" },
  { name: "Gavin Perry — First Officer" },
  { name: "Alex Willard — Second Officer" },
  { name: "Mo Adib — Moderator" },
];

export const hackathons = [
  { name: "BullHacks 2026 - Voluntir - 1st Place - $1000", url: "../voluntir/", highlight: true },
  { name: "StangHacks 2026 - Voluntir (Improved) - Honorable Mention, Second Round Judging", url: "../voluntir/" },
  { name: "LancerHacks 2026 - TerraView - 1st Place - Minifridge, Polaroid Camera, 5 T-shirts, and tours to tech companies", url: "https://terraview-five.vercel.app/", highlight: true },
  { name: "VikingHacks 2026 - Flipus - 2nd Place - Bluetooth speaker", url: "https://flipus.vercel.app/" },
];

export const helpText = [
  { cmd: "help", desc: "show this message" },
  { cmd: "whoami", desc: "existential crisis" },
  { cmd: "sudo", desc: "try it" },
  { cmd: "ozymandias", desc: "a poem" },
  { cmd: "mc", desc: "ascii art" },
  { cmd: "konata", desc: "✴" },
  { cmd: "clear", desc: "clear the terminal" },
  { cmd: "1-4", desc: "open a project" },
];

export const PROJECT_FILES = [
  { name: 'getmo', url: 'https://marincatholiccs.github.io/getmo/', favicon: 'https://marincatholiccs.github.io/getmo/favicon.ico' },
  { name: 'mo-sweeper', url: 'https://marincatholiccs.github.io/mosweeper/', favicon: 'https://marincatholiccs.github.io/mosweeper/favicon.ico' },
  { name: 'flappymo', url: 'https://marincatholiccs.github.io/flappymo/', favicon: 'https://marincatholiccs.github.io/flappymo/favicon.ico' },
  { name: 'wildchat', url: 'https://marincatholiccs.github.io/chatatmc/', favicon: 'https://marincatholiccs.github.io/chatatmc/favicon.ico' },
  { name: 'voluntir', url: '../voluntir/', favicon: 'https://marincatholiccs.github.io/voluntir/favicon.ico' },
];
