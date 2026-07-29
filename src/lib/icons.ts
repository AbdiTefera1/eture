// Single-color line-icon library reused across cards. Keys map to Prisma "icon" fields.
export const ICONS: Record<string, string> = {
  church: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 4v10M18 8h12M10 44V24l14-12 14 12v20H10z"/><path d="M20 44V30h8v14"/></svg>`,
  mountain: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 40l14-22 8 10 6-8 12 20H4z"/><circle cx="34" cy="10" r="4"/></svg>`,
  lake: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 34c4-4 8-4 12 0s8 4 12 0 8-4 12 0 4 4 4 4"/><path d="M4 24c4-4 8-4 12 0s8 4 12 0 8-4 12 0 4 4 4 4"/><circle cx="12" cy="12" r="3"/></svg>`,
  market: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 18h32l-3 22H11L8 18z"/><path d="M14 18a10 8 0 0120 0"/></svg>`,
  coffee: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 18h24v12a12 12 0 01-24 0V18z"/><path d="M32 20h4a5 5 0 010 10h-4"/></svg>`,
  compass: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><circle cx="24" cy="24" r="18"/><path d="M30 18l-4 10-10 4 4-10 10-4z"/></svg>`,
  leaf: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 38C10 20 22 8 40 8c0 18-12 30-30 30z"/><path d="M10 38c6-10 14-18 24-24"/></svg>`,
  fabric: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12h36M6 20h36M6 28h36M6 36h36" stroke-dasharray="2 4"/></svg>`,
  bed: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 40V16M6 28h36v12M14 28v-6a4 4 0 014-4h4a4 4 0 014 4v6"/></svg>`,
  paw: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><circle cx="14" cy="12" r="4"/><circle cx="24" cy="8" r="4"/><circle cx="34" cy="12" r="4"/><path d="M24 40c-8 0-12-5-12-10 0-6 6-10 12-10s12 4 12 10c0 5-4 10-12 10z"/></svg>`,
  wave: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20c4-6 8-6 12 0s8 6 12 0 8-6 12 0 4 6 4 6"/><path d="M4 34c4-6 8-6 12 0s8 6 12 0 8-6 12 0 4 6 4 6"/></svg>`,
  sun: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><circle cx="24" cy="24" r="8"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9 9l4 4M35 35l4 4M39 9l-4 4M13 35l-4 4"/></svg>`,
  tent: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 8l18 32H6L24 8z"/><path d="M18 40l6-14 6 14"/></svg>`,
};

export const ICON_KEYS = Object.keys(ICONS);
