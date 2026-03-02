import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────
const lightTokens = {
  bg: "#FAFAFA", surface: "#FFFFFF", surfaceHover: "#F4F4F5",
  border: "#E4E4E7", borderFocus: "#18181B",
  primary: "#18181B", primaryHover: "#27272A", btnText: "#FFFFFF",
  textMain: "#18181B", textMuted: "#71717A", textDisabled: "#A1A1AA",
  error: "#EF4444", errorBg: "#FEF2F2", errorBorder: "#FECACA",
  success: "#16A34A", successBg: "#F0FDF4", successBorder: "#BBF7D0",
  warning: "#D97706", warningBg: "#FFFBEB", warningBorder: "#FDE68A",
  purple: "#7C3AED", purpleBg: "#F5F3FF",
  info: "#2563EB", infoBg: "#EFF6FF",
  mandatory: "#EA580C", mandatoryBg: "#FFF7ED",
  newPurple: "#7C3AED", newPurpleBg: "#F5F3FF",
  inputBg: "#FFFFFF", rowHover: "#FAFAFA",
  chartBar: "#E4E4E7", chartBarActive: "#18181B", chartBarHover: "#D4D4D8",
  shadow: "0 1px 2px rgba(0,0,0,0.05)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.08)",
  ring: "rgba(24,24,27,0.08)",
};
const darkTokens = {
  bg: "#09090B", surface: "#18181B", surfaceHover: "#27272A",
  border: "#3F3F46", borderFocus: "#FAFAFA",
  primary: "#FAFAFA", primaryHover: "#E4E4E7", btnText: "#09090B",
  textMain: "#FAFAFA", textMuted: "#A1A1AA", textDisabled: "#52525B",
  error: "#F87171", errorBg: "#2A1515", errorBorder: "#7F1D1D",
  success: "#4ADE80", successBg: "#0D2818", successBorder: "#14532D",
  warning: "#FCD34D", warningBg: "#1C1500", warningBorder: "#713F12",
  purple: "#A78BFA", purpleBg: "#1E1033",
  info: "#60A5FA", infoBg: "#0C1A2E",
  mandatory: "#FB923C", mandatoryBg: "#271100",
  newPurple: "#A78BFA", newPurpleBg: "#1E1033",
  inputBg: "#27272A", rowHover: "#1F1F23",
  chartBar: "#3F3F46", chartBarActive: "#FAFAFA", chartBarHover: "#52525B",
  shadow: "0 1px 3px rgba(0,0,0,0.4)",
  shadowMd: "0 6px 20px rgba(0,0,0,0.5)",
  ring: "rgba(250,250,250,0.1)",
};

// ─────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────
const makeCSS = (t, isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  .shell { min-height:100vh; padding:40px 36px; background:${t.bg}; color:${t.textMain}; font-family:'Inter',sans-serif; transition:background .18s,color .18s; }

  /* ── Header ── */
  .hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:44px; padding-bottom:20px; border-bottom:1px solid ${t.border}; }
  .hdr-l { display:flex; flex-direction:column; gap:2px; }
  .eyebrow { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:${t.textMuted}; }
  .pg-title { font-size:21px; font-weight:600; letter-spacing:-.025em; color:${t.textMain}; }
  .hdr-r { display:flex; align-items:center; gap:8px; }
  .count-tag { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:${t.textMuted}; background:${t.surface}; border:1px solid ${t.border}; padding:4px 10px; border-radius:6px; }
  .ai-tag { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:${t.purple}; background:${t.purpleBg}; padding:4px 10px; border-radius:6px; }
  .toggle-btn { display:flex; align-items:center; gap:7px; padding:5px 11px 5px 9px; background:${t.surface}; border:1px solid ${t.border}; border-radius:8px; cursor:pointer; font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500; color:${t.textMain}; transition:border-color .12s,background .12s; }
  .toggle-btn:hover { border-color:${t.textMuted}; background:${t.surfaceHover}; }
  .track { width:30px; height:17px; border-radius:999px; background:${isDark ? t.primary : t.border}; position:relative; transition:background .18s; }
  .thumb { position:absolute; top:2px; left:${isDark ? "14px" : "2px"}; width:13px; height:13px; border-radius:50%; background:${isDark ? t.btnText : "#fff"}; box-shadow:0 1px 3px rgba(0,0,0,.25); transition:left .18s; }

  /* ── Section chrome ── */
  .sec { margin-bottom:56px; }
  .sec-hd { display:flex; align-items:baseline; gap:9px; margin-bottom:3px; }
  .sec-n { font-family:'JetBrains Mono',monospace; font-size:10px; color:${t.textMuted}; font-weight:500; }
  .sec-name { font-size:14.5px; font-weight:600; color:${t.textMain}; letter-spacing:-.01em; }
  .sec-desc { font-size:12.5px; color:${t.textMuted}; line-height:1.55; margin:3px 0 10px; }
  .comp-label { display:inline-flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:${t.purple}; background:${t.purpleBg}; padding:3px 8px; border-radius:4px; margin-bottom:16px; width:fit-content; }
  .grid { display:flex; flex-wrap:wrap; gap:14px; }
  .card { flex:1; min-width:260px; background:${t.surface}; border:1px solid ${t.border}; border-radius:10px; padding:16px; box-shadow:${t.shadow}; }
  .card.wide { min-width:360px; }
  .card.full { min-width:100%; flex:none; }
  .card-lbl { font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:${t.textMuted}; margin-bottom:12px; }
  .ptable { width:100%; border-collapse:collapse; margin-top:20px; }
  .ptable thead tr { border-bottom:1px solid ${t.border}; }
  .ptable th { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.07em; text-transform:uppercase; padding:8px 12px; text-align:left; font-weight:500; color:${t.textMuted}; }
  .ptable td { padding:9px 12px; border-bottom:1px solid ${t.border}; font-size:12px; vertical-align:top; }
  .ptable tr:last-child td { border-bottom:none; }
  .ptable tbody tr:hover td { background:${t.rowHover}; }
  .pname { font-family:'JetBrains Mono',monospace; font-size:11px; color:${t.textMain}; }
  .ptype { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:${t.purple}; }
  .preq { font-size:11px; color:${t.error}; }
  .pdesc { font-size:11.5px; color:${t.textMuted}; line-height:1.5; }

  /* ═══════════════════════════════════════════
     WAVE 1–3 ATOMS  (self-contained)
  ═══════════════════════════════════════════ */
  .fi { display:flex; flex-direction:column; gap:4px; }
  .fl { font-size:12px; font-weight:500; color:${t.textMain}; }
  .fl .req { color:${t.error}; margin-left:1px; }
  .fi input, .fi textarea {
    width:100%; padding:0 11px; font-family:'Inter',sans-serif; font-size:13.5px; color:${t.textMain};
    background:${t.inputBg}; border:1px solid ${t.border}; border-radius:6px; outline:none; appearance:none;
    transition:border-color .12s,box-shadow .12s;
  }
  .fi input { height:36px; }
  .fi textarea { padding:10px 11px; resize:vertical; min-height:140px; line-height:1.55; }
  .fi input::placeholder, .fi textarea::placeholder { color:${t.textDisabled}; }
  .fi input:focus, .fi textarea:focus { border-color:${t.borderFocus}; box-shadow:0 0 0 3px ${t.ring}; }
  .fi input:disabled, .fi textarea:disabled { background:${t.surfaceHover}; color:${t.textDisabled}; cursor:not-allowed; }
  .fhint { font-size:11.5px; color:${t.textMuted}; margin-top:1px; }
  .selw { position:relative; }
  .selw select { height:36px; width:100%; padding:0 34px 0 11px; font-family:'Inter',sans-serif; font-size:13.5px; background:${t.inputBg}; border:1px solid ${t.border}; border-radius:6px; outline:none; appearance:none; cursor:pointer; color:${t.textMain}; transition:border-color .12s,box-shadow .12s; }
  .selw select.ph { color:${t.textDisabled}; }
  .selw select:focus { border-color:${t.borderFocus}; box-shadow:0 0 0 3px ${t.ring}; }
  .selw select:disabled { background:${t.surfaceHover}; color:${t.textDisabled}; cursor:not-allowed; }
  .chev { position:absolute; right:10px; top:50%; transform:translateY(-50%); pointer-events:none; color:${t.textMuted}; }
  .badge { display:inline-flex; align-items:center; gap:5px; padding:2.5px 8px; border-radius:5px; font-size:11.5px; font-weight:500; }
  .bdot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
  .badge.mandatory { background:${t.mandatoryBg}; color:${t.mandatory}; }
  .badge.mandatory .bdot { background:${t.mandatory}; }
  .badge.new { background:${t.newPurpleBg}; color:${t.newPurple}; }
  .badge.new .bdot { background:${t.newPurple}; }
  .rrow { display:flex; align-items:center; gap:10px; padding:10px 13px; border:1px solid ${t.border}; border-radius:8px; cursor:pointer; user-select:none; width:100%; background:${t.surface}; transition:border-color .1s,background .1s; font-family:'Inter',sans-serif; appearance:none; text-align:left; }
  .rrow:hover:not(:disabled) { border-color:${t.textMuted}; }
  .rrow.on { border-color:${t.primary}; background:${isDark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.015)"}; }
  .rrow:disabled { opacity:.42; cursor:not-allowed; }
  .rcirc { width:15px; height:15px; border-radius:50%; flex-shrink:0; border:1.5px solid ${t.border}; display:flex; align-items:center; justify-content:center; transition:border-color .1s; }
  .rrow.on .rcirc { border-color:${t.primary}; }
  .rdot { width:7px; height:7px; border-radius:50%; background:${t.primary}; }
  .rlbl { font-size:13.5px; color:${t.textMain}; }
  .rstack { display:flex; flex-direction:column; gap:6px; width:100%; }
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:0 14px; height:36px; font-family:'Inter',sans-serif; font-size:13px; font-weight:500; border-radius:6px; border:none; cursor:pointer; white-space:nowrap; transition:background .1s,opacity .1s,transform .07s; }
  .btn:active:not(:disabled) { transform:scale(.985); }
  .btn:disabled { opacity:.4; cursor:not-allowed; }
  .btn.sm { height:30px; padding:0 11px; font-size:12px; border-radius:5px; }
  .btn.lg { height:42px; padding:0 18px; font-size:14px; }
  .btn-p { background:${t.primary}; color:${t.btnText}; }
  .btn-p:hover:not(:disabled) { background:${t.primaryHover}; }
  .btn-s { background:transparent; color:${t.textMain}; border:1px solid ${t.border}; }
  .btn-s:hover:not(:disabled) { background:${t.surfaceHover}; border-color:${t.textMuted}; }
  .btn-g { background:transparent; color:${t.info}; border:none; height:auto; padding:0; font-size:12.5px; font-weight:500; }
  .btn-g:hover { text-decoration:underline; cursor:pointer; }

  /* ── Spinners / shimmer ── */
  .spin { width:12px; height:12px; border-radius:50%; border:1.5px solid ${isDark?"rgba(9,9,11,.3)":"rgba(255,255,255,.3)"}; border-top-color:${t.btnText}; animation:sp .55s linear infinite; flex-shrink:0; }
  .spin-sm { width:10px; height:10px; border-radius:50%; border:1.5px solid ${t.border}; border-top-color:${t.purple}; animation:sp .55s linear infinite; flex-shrink:0; }
  .spin-inv { border:1.5px solid ${t.border}; border-top-color:${t.textMain}; }
  @keyframes sp { to { transform:rotate(360deg); } }
  .shimmer { height:44px; border-radius:8px; background:linear-gradient(90deg,${t.surfaceHover} 25%,${t.border} 50%,${t.surfaceHover} 75%); background-size:200% 100%; animation:shim 1.4s infinite; }
  @keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ═══════════════════════════════════════════
     BLOCK SHARED SHELL
  ═══════════════════════════════════════════ */
  /* The outer wrapper every block uses */
  .block-shell {
    background:${t.surface};
    border:1px solid ${t.border};
    border-radius:12px;
    padding:24px;
    box-shadow:${t.shadow};
    display:flex;
    flex-direction:column;
    gap:20px;
  }
  .block-title { font-size:15px; font-weight:600; color:${t.textMain}; letter-spacing:-.01em; }
  .block-subtitle { font-size:12.5px; color:${t.textMuted}; margin-top:2px; line-height:1.5; }
  .block-divider { height:1px; background:${t.border}; margin:4px 0; }
  .block-row { display:grid; gap:12px; }
  .block-row.cols2 { grid-template-columns:1fr 1fr; }
  .block-field-stack { display:flex; flex-direction:column; gap:14px; }

  /* ── Info box ── */
  .info-box { display:flex; align-items:flex-start; gap:8px; padding:11px 13px; background:${t.infoBg}; border:1px solid ${isDark?t.info+"33":"#BFDBFE"}; border-radius:8px; }
  .info-box-icon { color:${t.info}; flex-shrink:0; margin-top:1px; }
  .info-box-text { font-size:12.5px; color:${t.textMain}; line-height:1.5; }
  .info-box-text a { color:${t.info}; font-weight:500; }

  /* ── Warning box ── */
  .warn-box { display:flex; align-items:flex-start; gap:8px; padding:11px 13px; background:${t.warningBg}; border:1px solid ${t.warningBorder}; border-radius:8px; }
  .warn-box-icon { color:${t.warning}; flex-shrink:0; margin-top:1px; }
  .warn-box-text { font-size:12.5px; color:${t.textMain}; line-height:1.5; }

  /* ═══════════════════════════════════════════
     BLOCK 1 — JobDescriptionBlock
  ═══════════════════════════════════════════ */
  /* Scope textarea header row */
  .jdb-scope-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
  .jdb-scope-label { font-size:12px; font-weight:500; color:${t.textMain}; }
  .jdb-save-btn { font-size:12px; font-weight:500; color:${t.textMuted}; background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:4px; padding:0; font-family:'Inter',sans-serif; }
  .jdb-save-btn:hover { color:${t.textMain}; }
  .jdb-char-count { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:${t.textMuted}; text-align:right; margin-top:4px; }
  .jdb-char-count.warn { color:${t.warning}; }
  .jdb-char-count.over { color:${t.error}; }

  /* ─ Compliance cards ─ */
  .cc-card { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:12px 14px; border:1px solid ${t.border}; border-radius:8px; background:${t.surface}; }
  .cc-card.pass  { border-color:${t.successBorder}; background:${t.successBg}; }
  .cc-card.fail  { border-color:${t.errorBorder};   background:${t.errorBg}; }
  .cc-card.warn  { border-color:${t.warningBorder}; background:${t.warningBg}; }
  .cc-rule { font-size:13px; color:${t.textMain}; line-height:1.45; flex:1; }
  .cc-detail { font-size:11.5px; color:${t.textMuted}; margin-top:3px; }
  .cc-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:5px; font-size:11.5px; font-weight:500; flex-shrink:0; white-space:nowrap; }
  .cc-dot { width:5px; height:5px; border-radius:50%; }
  .cc-badge.pass { background:${t.successBg}; color:${t.success}; border:1px solid ${t.successBorder}; }
  .cc-badge.pass .cc-dot { background:${t.success}; }
  .cc-badge.fail { background:${t.errorBg}; color:${t.error}; border:1px solid ${t.errorBorder}; }
  .cc-badge.fail .cc-dot { background:${t.error}; }
  .cc-badge.warn { background:${t.warningBg}; color:${t.warning}; border:1px solid ${t.warningBorder}; }
  .cc-badge.warn .cc-dot { background:${t.warning}; }
  .cc-badge.checking { background:${t.purpleBg}; color:${t.purple}; }
  /* AI banner inside JDB */
  .ai-banner { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 16px; background:${t.purpleBg}; border:1px solid ${isDark?t.purple+"44":"#DDD6FE"}; border-radius:10px; }
  .ai-banner-left { display:flex; align-items:center; gap:12px; flex:1; }
  .ai-icon-wrap { width:34px; height:34px; border-radius:8px; background:${isDark?t.purple+"22":"#EDE9FE"}; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ai-banner-title { font-size:13px; font-weight:600; color:${t.textMain}; margin-bottom:2px; }
  .ai-banner-desc { font-size:11.5px; color:${t.textMuted}; line-height:1.4; }
  .ai-banner-desc a { color:${t.purple}; font-weight:500; }

  /* ═══════════════════════════════════════════
     BLOCK 2 — CompensationBlock
  ═══════════════════════════════════════════ */
  .cb-toggle-wrap { display:flex; border:1px solid ${t.border}; border-radius:8px; overflow:hidden; }
  .cb-toggle-btn { flex:1; padding:8px; font-family:'Inter',sans-serif; font-size:13px; font-weight:500; background:transparent; border:none; cursor:pointer; color:${t.textMuted}; transition:background .1s,color .1s; }
  .cb-toggle-btn.active { background:${t.primary}; color:${t.btnText}; }
  .cb-salary-wrap { display:flex; align-items:center; gap:0; border:1px solid ${t.border}; border-radius:6px; overflow:hidden; transition:border-color .12s,box-shadow .12s; }
  .cb-salary-wrap:focus-within { border-color:${t.borderFocus}; box-shadow:0 0 0 3px ${t.ring}; }
  .cb-currency-prefix { padding:0 12px; height:36px; display:flex; align-items:center; font-size:13.5px; color:${t.textMuted}; background:${t.surfaceHover}; border-right:1px solid ${t.border}; flex-shrink:0; font-family:'JetBrains Mono',monospace; }
  .cb-salary-input { flex:1; height:36px; padding:0 11px; font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:500; color:${t.textMain}; background:${t.inputBg}; border:none; outline:none; }
  .cb-currency-suffix { padding:0 12px; height:36px; display:flex; align-items:center; font-size:12px; font-weight:500; color:${t.textMuted}; background:${t.surfaceHover}; border-left:1px solid ${t.border}; flex-shrink:0; font-family:'JetBrains Mono',monospace; }
  /* market rate chart */
  .mrc-title { font-size:13.5px; font-weight:600; color:${t.textMain}; margin-bottom:2px; }
  .mrc-sub { font-size:12px; color:${t.textMuted}; line-height:1.4; }
  .mrc-private { font-size:11px; color:${t.textDisabled}; margin-top:2px; margin-bottom:12px; }
  .mrc-period-row { display:flex; justify-content:flex-end; margin-bottom:8px; }
  .mrc-ptoggle { display:flex; border:1px solid ${t.border}; border-radius:6px; overflow:hidden; }
  .mrc-pbtn { padding:4px 11px; font-family:'Inter',sans-serif; font-size:12px; font-weight:500; background:transparent; border:none; cursor:pointer; color:${t.textMuted}; transition:background .1s,color .1s; }
  .mrc-pbtn.on { background:${t.primary}; color:${t.btnText}; }
  .mrc-bars-wrap { height:72px; position:relative; margin-bottom:6px; }
  .mrc-bars { display:flex; align-items:flex-end; gap:3px; height:100%; }
  .mrc-bar-col { flex:1; display:flex; align-items:flex-end; justify-content:center; position:relative; height:100%; }
  .mrc-bar { width:100%; border-radius:3px 3px 0 0; background:${t.chartBar}; transition:height .4s cubic-bezier(.4,0,.2,1),background .15s; }
  .mrc-bar.ab { background:${t.chartBarActive}; }
  .mrc-bubble-wrap { position:absolute; top:-32px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; pointer-events:none; }
  .mrc-bubble { background:${t.info}; color:#fff; font-size:11px; font-weight:600; font-family:'JetBrains Mono',monospace; padding:3px 8px; border-radius:5px; white-space:nowrap; }
  .mrc-bubble-arrow { width:0; height:0; border-left:4px solid transparent; border-right:4px solid transparent; border-top:4px solid ${t.info}; }
  .mrc-dashed { position:absolute; top:0; bottom:0; left:50%; width:0; border-left:1.5px dashed ${t.info}; opacity:.5; pointer-events:none; }
  .mrc-axis { display:flex; justify-content:space-between; padding-top:8px; border-top:1px solid ${t.border}; }
  .mrc-axis-item { display:flex; flex-direction:column; align-items:center; gap:1px; }
  .mrc-axis-val { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:500; color:${t.textMain}; }
  .mrc-axis-lbl { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.06em; text-transform:uppercase; color:${t.textMuted}; }
  /* bonus section */
  .bonus-empty { display:flex; align-items:center; gap:6px; font-size:12.5px; color:${t.textMuted}; padding:10px 0; }
  .bonus-dot { width:6px; height:6px; border-radius:50%; background:${t.textDisabled}; flex-shrink:0; }

  /* ═══════════════════════════════════════════
     BLOCK 3 — BenefitsBlock
  ═══════════════════════════════════════════ */
  .benefit-card {
    border:1px solid ${t.border}; border-radius:10px;
    overflow:hidden; background:${t.surface};
  }
  .benefit-card-inner { padding:18px 20px; }
  .benefit-card-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:10px; }
  .benefit-card-left { display:flex; align-items:center; gap:10px; }
  .benefit-icon { width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:16px; }
  .benefit-name { font-size:14px; font-weight:600; color:${t.textMain}; }
  .benefit-desc { font-size:12.5px; color:${t.textMuted}; line-height:1.5; margin-bottom:12px; }
  .benefit-mandatory-banner { display:flex; align-items:center; gap:8px; padding:9px 12px; background:${t.warningBg}; border-top:1px solid ${t.warningBorder}; }
  .benefit-mandatory-text { font-size:12px; color:${t.warning}; font-weight:500; }
  .benefit-added-bar { display:flex; align-items:center; gap:8px; padding:9px 12px; background:${t.successBg}; border-top:1px solid ${t.successBorder}; }
  .benefit-added-text { font-size:12px; color:${t.success}; font-weight:500; }
  .benefit-grid { display:flex; flex-direction:column; gap:10px; }
  .benefit-section-label { font-size:11.5px; font-weight:600; color:${t.textMuted}; letter-spacing:.04em; text-transform:uppercase; font-family:'JetBrains Mono',monospace; padding-bottom:6px; border-bottom:1px solid ${t.border}; margin-bottom:2px; }

  /* ═══════════════════════════════════════════
     ATOMS: SectionCard, ToggleRow
  ═══════════════════════════════════════════ */
  .sc { background:${t.surface}; border:1px solid ${t.border}; border-radius:14px; padding:20px 20px 24px; box-shadow:${t.shadow}; display:flex; flex-direction:column; gap:14px; }
  .sc-header { display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .sc-title { font-size:15px; font-weight:600; color:${t.textMain}; letter-spacing:-.01em; }
  .sc-info-btn { display:flex; align-items:center; justify-content:center; background:none; border:none; cursor:pointer; color:${t.textMuted}; padding:3px; border-radius:5px; transition:color .12s,background .12s; flex-shrink:0; }
  .sc-info-btn:hover { color:${t.textMain}; background:${t.surfaceHover}; }
  .sc-body { display:flex; flex-direction:column; gap:12px; }
  .trow { display:flex; align-items:center; justify-content:space-between; gap:14px; padding:12px 14px; border:1px solid ${t.border}; border-radius:10px; background:${t.surface}; cursor:pointer; user-select:none; }
  .trow:hover { border-color:${t.textMuted}; }
  .trow-text { flex:1; min-width:0; }
  .trow-label { font-size:13.5px; font-weight:500; color:${t.textMain}; line-height:1.4; }
  .trow-desc { font-size:12px; color:${t.textMuted}; margin-top:2px; line-height:1.4; }
  .trow-track { width:36px; height:20px; border-radius:999px; flex-shrink:0; position:relative; transition:background .18s; }
  .trow-track.on { background:${t.primary}; }
  .trow-track.off { background:${t.border}; }
  .trow-thumb { position:absolute; top:2px; width:16px; height:16px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.25); transition:left .18s; }
  .trow-track.on .trow-thumb { left:18px; }
  .trow-track.off .trow-thumb { left:2px; }

  /* ═══════════════════════════════════════════
     MOLECULE: ContextBanner
  ═══════════════════════════════════════════ */
  .ctxb { border-radius:12px; display:flex; align-items:center; gap:12px; transition:opacity .2s; }
  .ctxb.guide-v   { padding:13px 15px; background:${t.infoBg}; border:1px solid ${isDark?t.info+"33":"#BFDBFE"}; }
  .ctxb.insight-v { padding:11px 15px; background:${isDark?"#1b1e2e":"#F5F3FF"}; border:1px solid ${isDark?"#6366f133":"#DDD6FE"}; }
  .ctxb.promo-v   { padding:15px 18px; background:${t.surface}; border:1px solid ${t.border}; box-shadow:${t.shadow}; justify-content:space-between; }
  .ctxb-media { display:flex; align-items:center; flex-shrink:0; }
  .ctxb-media-item { width:22px; height:22px; border-radius:50%; border:1.5px solid ${t.surface}; font-size:13px; display:flex; align-items:center; justify-content:center; background:${t.surfaceHover}; }
  .ctxb-media-item:nth-child(n+2) { margin-left:-6px; }
  .ctxb-mascot { width:28px; height:28px; border-radius:7px; background:${isDark?"#312e81":"#EDE9FE"}; color:${isDark?"#a5b4fc":"#7C3AED"}; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ctxb-content { flex:1; min-width:0; display:flex; flex-direction:column; gap:4px; }
  .ctxb-body-row { font-size:13px; color:${t.textMain}; line-height:1.45; }
  .ctxb-label { font-weight:700; color:${isDark?"#a5b4fc":"#6D28D9"}; }
  .ctxb-link { color:${t.info}; font-weight:500; text-decoration:none; cursor:pointer; }
  .ctxb-link:hover { text-decoration:underline; }
  .ctxb-btn { display:inline-flex; align-items:center; gap:5px; margin-top:6px; font-size:12.5px; font-weight:500; padding:6px 12px; border:1px solid ${t.border}; border-radius:6px; color:${t.textMain}; background:none; cursor:pointer; font-family:inherit; transition:background .12s,border-color .12s; width:fit-content; }
  .ctxb-btn:hover { background:${t.surfaceHover}; border-color:${t.textMuted}; }
  .ctxb-dismiss { background:none; border:none; cursor:pointer; color:${t.textMuted}; display:flex; align-items:center; padding:3px; border-radius:4px; flex-shrink:0; transition:color .1s; }
  .ctxb-dismiss:hover { color:${t.textMain}; background:${t.surfaceHover}; }
  .ctxb-gone { opacity:.4; pointer-events:none; }

  /* ═══════════════════════════════════════════
     BLOCK 4 — AddPersonBlock
  ═══════════════════════════════════════════ */
  .apb-field-hint { font-size:11.5px; color:${t.textMuted}; margin-top:4px; line-height:1.45; }

  /* footer */
  .foot { display:flex; justify-content:space-between; align-items:center; padding-top:20px; border-top:1px solid ${t.border}; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.07em; text-transform:uppercase; color:${t.textMuted}; }
`;

// ─────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────
const Sun     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/><line x1="17.7" y1="4.2" x2="19.8" y2="6.3"/><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/></svg>;
const Moon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const Chevron = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 5 7 9 11 5"/></svg>;
const Info    = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="5.5"/><line x1="7" y1="6.5" x2="7" y2="10"/><circle cx="7" cy="4.5" r=".8" fill="currentColor" stroke="none"/></svg>;
const Warning = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1.5L13 12H1L7 1.5z"/><line x1="7" y1="6" x2="7" y2="9"/><circle cx="7" cy="10.5" r=".6" fill="currentColor" stroke="none"/></svg>;
const AIIcon  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8" cy="8" r="6.5"/><path d="M5.5 8a2.5 2.5 0 0 0 5 0"/><circle cx="5.8" cy="5.8" r=".7" fill="currentColor" stroke="none"/><circle cx="10.2" cy="5.8" r=".7" fill="currentColor" stroke="none"/></svg>;
const Refresh = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6A4.5 4.5 0 0 1 10 3"/><polyline points="8 1.5 10.5 3 8.5 5.5"/><path d="M10.5 6A4.5 4.5 0 0 1 2 9"/><polyline points="4 10.5 1.5 9 3.5 6.5"/></svg>;
const Check   = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5 6 4.5 9 10.5 3"/></svg>;
const Plus    = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="6.5" y1="1.5" x2="6.5" y2="11.5"/><line x1="1.5" y1="6.5" x2="11.5" y2="6.5"/></svg>;
const Disk    = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1" y="1" width="9" height="9" rx="1.5"/><rect x="3" y="1" width="5" height="3.5" rx=".5" fill="currentColor" stroke="none"/><rect x="2.5" y="6" width="6" height="3" rx=".5"/></svg>;
const X       = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="2.5" y1="2.5" x2="10.5" y2="10.5"/><line x1="10.5" y1="2.5" x2="2.5" y2="10.5"/></svg>;
const ExtLink = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 2H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.5"/><polyline points="7 1 10 1 10 4"/><line x1="5" y1="6" x2="10" y2="1"/></svg>;

// ─────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES (re-used across blocks)
// ─────────────────────────────────────────────────────────────────
function Field({ label, placeholder, value, required, disabled }) {
  const [v, setV] = useState(value ?? "");
  return (
    <div className="fi">
      <label className="fl">{label}{required && <span className="req">*</span>}</label>
      <input placeholder={placeholder} value={v} disabled={disabled}
        onChange={e => setV(e.target.value)} />
    </div>
  );
}
function Select({ label, placeholder, options = [], value, disabled, optional, required, onChange }) {
  const [v, setV] = useState(value ?? "");
  const handleChange = e => { setV(e.target.value); onChange?.(e.target.value); };
  return (
    <div className="fi">
      {label && <label className="fl">{label}{required && <span className="req">*</span>}{optional && <span style={{ fontWeight:400,opacity:.65 }}> (optional)</span>}</label>}
      <div className="selw">
        <select className={!v ? "ph" : ""} disabled={disabled} value={v}
          onChange={handleChange}>
          <option value="" disabled>{placeholder ?? label}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="chev"><Chevron /></span>
      </div>
    </div>
  );
}
function Radio({ label, selected, onClick }) {
  return (
    <button type="button" className={`rrow${selected ? " on" : ""}`} onClick={onClick}>
      <div className="rcirc">{selected && <div className="rdot" />}</div>
      <div className="rlbl">{label}</div>
    </button>
  );
}

function fmtK(n) { return n >= 1000 ? `$${(n/1000).toFixed(1).replace(/\.0$/,"")}k` : `$${n}`; }

// ─────────────────────────────────────────────────────────────────
// SECTION CARD  (atom)
// ─────────────────────────────────────────────────────────────────
function SectionCard({ title, showInfoButton, children }) {
  return (
    <div className="sc">
      {(title || showInfoButton) && (
        <div className="sc-header">
          {title && <span className="sc-title">{title}</span>}
          {showInfoButton && (
            <button type="button" className="sc-info-btn" aria-label="More information">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8" cy="8" r="6.5"/>
                <line x1="8" y1="7.5" x2="8" y2="11"/>
                <circle cx="8" cy="5.5" r=".8" fill="currentColor" stroke="none"/>
              </svg>
            </button>
          )}
        </div>
      )}
      <div className="sc-body">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOGGLE ROW  (atom)
// ─────────────────────────────────────────────────────────────────
function ToggleRow({ label, description, checked: controlledChecked, onChange }) {
  const [internal, setInternal] = useState(controlledChecked ?? false);
  const isOn = controlledChecked !== undefined ? controlledChecked : internal;
  const toggle = () => {
    const next = !isOn;
    if (controlledChecked === undefined) setInternal(next);
    onChange?.(next);
  };
  return (
    <div className="trow" role="switch" aria-checked={isOn} tabIndex={0}
      onClick={toggle} onKeyDown={e => (e.key === " " || e.key === "Enter") && toggle()}>
      <div className="trow-text">
        <div className="trow-label">{label}</div>
        {description && <div className="trow-desc">{description}</div>}
      </div>
      <div className={`trow-track ${isOn ? "on" : "off"}`}>
        <div className="trow-thumb" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CONTEXT BANNER  (molecule — guide / insight / promo)
// ─────────────────────────────────────────────────────────────────
function ContextBanner({ variant = "guide", title, body, country, media, ctaLabel, ctaUrl = "#", ctaStyle, dismissable, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  const isGuide   = variant === "guide";
  const isInsight = variant === "insight";
  const isPromo   = variant === "promo";

  const resolvedBody  = body ?? (isGuide
    ? `View Deel's global hiring guide for ${country ?? "your country"}.`
    : isInsight
    ? "Severance in the United States can range from at least 2 to 4 weeks salary."
    : "Set up a foreign entity with Deel — we handle compliance, payroll, and local filings.");
  const resolvedTitle = title !== undefined ? title : (isInsight ? "Deel Insight:" : null);
  const resolvedMedia = media ?? (isInsight ? null : ["🌍", isGuide ? "🇺🇸" : "🏢"]);
  const resolvedCta   = ctaLabel ?? (isGuide ? "View" : "Learn more");
  const resolvedStyle = ctaStyle ?? (isPromo ? "button" : "link");
  const canDismiss    = dismissable ?? isGuide;

  const MediaStack = ({ items }) => (
    <div className="ctxb-media">
      {(items ?? []).map((f, i) => <div key={i} className="ctxb-media-item">{f}</div>)}
    </div>
  );

  return (
    <div className={`ctxb ${variant}-v${dismissed ? " ctxb-gone" : ""}`}>
      {!isPromo && (isInsight
        ? <div className="ctxb-mascot">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .5L9.9 4.8 14.5 5.5 11 8.9l.8 4.6L8 11.4l-3.8 2.1.8-4.6L1.5 5.5l4.6-.7z"/>
            </svg>
          </div>
        : resolvedMedia && <MediaStack items={resolvedMedia} />
      )}
      <div className="ctxb-content">
        <div className="ctxb-body-row">
          {resolvedTitle && <span className="ctxb-label">{resolvedTitle} </span>}
          <span>{resolvedBody}</span>
          {resolvedStyle === "link" && (
            <button type="button" onClick={() => window.open(ctaUrl, "_blank", "noreferrer")}
              style={{ marginLeft:4, verticalAlign:"middle", display:"inline-flex", alignItems:"center",
                gap:3, fontSize:12.5, fontFamily:"inherit", fontWeight:500, background:"none",
                border:"none", cursor:"pointer", color:"inherit", textDecoration:"underline", textDecorationColor:"rgba(0,0,0,.2)" }}>
              {resolvedCta} <ExtLink />
            </button>
          )}
        </div>
        {resolvedStyle === "button" && (
          <button type="button" className="ctxb-btn" onClick={() => window.open(ctaUrl, "_blank", "noreferrer")}>
            {resolvedCta} ↗
          </button>
        )}
      </div>
      {isPromo && resolvedMedia && <MediaStack items={resolvedMedia} />}
      {canDismiss && (
        <button type="button" className="ctxb-dismiss" onClick={() => { setDismissed(true); onDismiss?.(); }} aria-label="Dismiss">
          <X />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MARKET RATE MINI (reused inside CompensationBlock)
// ─────────────────────────────────────────────────────────────────
const MARKET_DATA = {
  annual:  { low:30700, median:69000, high:123200, buckets:[18,34,52,70,88,80,66,50,36,22,14] },
  monthly: { low:2558,  median:5750,  high:10267,  buckets:[16,30,50,68,86,80,64,48,34,20,12] },
};

function MiniMarketChart({ salary, period, title, seniority, jobTitle }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setAnimated(false); const t = setTimeout(() => setAnimated(true), 60); return () => clearTimeout(t); }, [period, salary]);

  const data = MARKET_DATA[period];
  const displaySal = period === "annual" ? salary : salary / 12;
  const range = data.high - data.low;
  const salPos = Math.max(0, Math.min(1, (displaySal - data.low) / range));
  const activeBucket = Math.round(salPos * (data.buckets.length - 1));
  const maxBucket = Math.max(...data.buckets);
  const fmtSal = `$${displaySal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div>
      <div className="mrc-title">
        {seniority} {jobTitle} {period} compensation in United States.
      </div>
      <div className="mrc-sub">Your payment rate is equal to {fmtSal} {period === "annual" ? "annually" : "monthly"} in USD.</div>
      <div className="mrc-private">Market rate insights will not be shown to employees.</div>
      <div className="mrc-bars-wrap">
        <div className="mrc-bars">
          {data.buckets.map((h, i) => {
            const hPct = (h / maxBucket) * 100;
            const isActive = i === activeBucket;
            return (
              <div key={i} className="mrc-bar-col">
                <div className={`mrc-bar${isActive ? " ab" : ""}`} style={{ height: animated ? `${hPct}%` : "0%" }} />
                {isActive && (
                  <>
                    <div className="mrc-dashed" />
                    <div className="mrc-bubble-wrap">
                      <div className="mrc-bubble">{fmtK(displaySal)}</div>
                      <div className="mrc-bubble-arrow" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mrc-axis">
        {[["Low", data.low], ["Median", data.median], ["High", data.high]].map(([lbl, val]) => (
          <div key={lbl} className="mrc-axis-item">
            <span className="mrc-axis-val">{fmtK(val)}</span>
            <span className="mrc-axis-lbl">{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPLIANCE MINI  (reused inside JobDescriptionBlock)
// ─────────────────────────────────────────────────────────────────
function ComplianceCard({ rule, status, detail }) {
  const labels = { pass:"Passed", fail:"Failed", warn:"Warning", checking:"Checking…" };
  return (
    <div className={`cc-card ${status}`}>
      <div style={{ flex:1 }}>
        <div className="cc-rule">{rule}</div>
        {detail && <div className="cc-detail">{detail}</div>}
      </div>
      <div className={`cc-badge ${status}`}>
        {status === "checking" ? <span className="spin-sm" /> : <span className="cc-dot" />}
        {labels[status]}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// BLOCK 1 — JobDescriptionBlock
// ─────────────────────────────────────────────────────────────────
const SCOPE_PLACEHOLDER = `Duties and Responsibilities

- Assist customers.
- Develop and manage client portfolios.
- Sustain business growth and profitability.
- Analyze customer data to improve experience.`;

const COMPLIANCE_RESULTS = [
  { rule:"Job scope should be relevant to the job title.", status:"fail", detail:"The described duties relate to customer success, not executive assistance." },
  { rule:"Job scope should not include recruiting or hiring language.", status:"pass" },
  { rule:"Job scope should not reference reporting lines.", status:"warn", detail:"Indirect reference detected — consider rephrasing." },
  { rule:"Job scope should not include required education or experience requirements.", status:"pass" },
];

export function JobDescriptionBlock({
  defaultTitle = "Executive Assistant",
  defaultSeniority = "mid",
  defaultScope = "",
  showComplianceResults = false,
  complianceRunning = false,
  onSave,
}) {
  const [scope, setScope] = useState(defaultScope);
  const [running, setRunning] = useState(complianceRunning);
  const [results, setResults] = useState(showComplianceResults ? COMPLIANCE_RESULTS : []);
  const maxLen = 10000;

  const runCheck = () => {
    setRunning(true);
    setResults([]);
    COMPLIANCE_RESULTS.forEach((r, i) => {
      setTimeout(() => {
        setResults(prev => [...prev, r]);
        if (i === COMPLIANCE_RESULTS.length - 1) setRunning(false);
      }, 500 + i * 400);
    });
  };

  const charClass = scope.length > maxLen * 0.9
    ? scope.length > maxLen ? "over" : "warn"
    : "";

  return (
    <div className="block-shell">
      {/* Section heading */}
      <div>
        <div className="block-title">Job description</div>
      </div>

      {/* Title + Seniority */}
      <div className="block-field-stack">
        <Select label="Job title" required value={defaultTitle}
          options={[
            { value:"Executive Assistant", label:"Executive Assistant" },
            { value:"Product Manager", label:"Product Manager" },
            { value:"Software Engineer", label:"Software Engineer" },
          ]} />
        <Select label="Seniority level" required value={defaultSeniority}
          options={[
            { value:"jun", label:"Junior (IC Level 1)" },
            { value:"mid", label:"Mid (Individual Contributor Level 2)" },
            { value:"sen", label:"Senior (IC Level 3)" },
          ]} />
      </div>

      {/* Job scope */}
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:14, fontWeight:600 }}>Job scope</span>
          <button type="button" className="btn btn-s sm">Manage job scopes</button>
        </div>
        <div className="info-box" style={{ marginBottom:12 }}>
          <span className="info-box-icon"><Info /></span>
          <div className="info-box-text">
            <strong>Job scope guidelines</strong> — Always refer to your company as "the company". Do not include recruiting language or references to c-suite positions.{" "}
            <a href="#">Learn more</a>
          </div>
        </div>
        <Select placeholder="Job scope template (optional)" optional
          options={[{ value:"t1", label:"Customer Success Template" }]} />
        <div style={{ marginTop:12 }}>
          <div className="jdb-scope-header">
            <label className="fl">Explanation of job scope <span className="req">*</span></label>
            <button className="jdb-save-btn" type="button">
              <Disk /> Save scope
            </button>
          </div>
          <div className="fi">
            <textarea
              placeholder={SCOPE_PLACEHOLDER}
              value={scope}
              onChange={e => setScope(e.target.value)}
              style={{ minHeight:160 }}
            />
          </div>
          <div className={`jdb-char-count${charClass ? " "+charClass : ""}`}>
            {scope.length}/{maxLen.toLocaleString()}
          </div>
        </div>
      </div>

      {/* AI compliance */}
      <div>
        <div className="ai-banner">
          <div className="ai-banner-left">
            <div className="ai-icon-wrap"><AIIcon /></div>
            <div>
              <div className="ai-banner-title">Save time with our AI-powered compliance check</div>
              <div className="ai-banner-desc">
                Verify your job scope meets <a href="#">EOR compliance requirements</a> for an instant quote.
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-s sm"
            onClick={runCheck} disabled={running}
            style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            {running ? <><span className="spin-sm" />Running…</> : <><Refresh />Run check</>}
          </button>
        </div>

        {running && results.length === 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
            {[1,2,3].map(i => <div key={i} className="shimmer" />)}
          </div>
        )}

        {results.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:8 }}>
            {results.map((r,i) => <ComplianceCard key={i} {...r} />)}
            <div className="info-box" style={{ marginTop:4 }}>
              <span className="info-box-icon"><Info /></span>
              <span className="info-box-text">
                Think Deel reported false errors?{" "}
                <a href="#" onClick={e => e.preventDefault()}>Report to our engineering team</a>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// BLOCK 2 — CompensationBlock
// ─────────────────────────────────────────────────────────────────
export function CompensationBlock({
  defaultSalary = 77293.01,
  defaultEmploymentType = "full",
  defaultPeriod = "annual",
  showMarketInsights = true,
  country = "United States",
}) {
  const [empType, setEmpType] = useState(defaultEmploymentType);
  const [salaryPeriod, setSalaryPeriod] = useState(defaultPeriod);
  const [salary, setSalary] = useState(defaultSalary);
  const [chartPeriod, setChartPeriod] = useState(defaultPeriod);

  return (
    <div className="block-shell">
      {/* Employment type */}
      <div>
        <div className="block-title" style={{ marginBottom:12 }}>Employment type</div>
        <div className="rstack">
          <Radio label="Full-time" selected={empType === "full"} onClick={() => setEmpType("full")} />
          <Radio label="Part-time" selected={empType === "part"} onClick={() => setEmpType("part")} />
        </div>
      </div>

      <div className="block-divider" />

      {/* Compensation */}
      <div>
        <div className="block-title" style={{ marginBottom:4 }}>Compensation</div>
        <div className="fhint" style={{ marginBottom:14 }}>
          All compensation will be awarded in US Dollar (USD). Due to compliance, contract currencies are not customizable in EOR.
        </div>

        {/* Annual / Hourly toggle */}
        <div className="cb-toggle-wrap" style={{ marginBottom:12 }}>
          <button type="button" className={`cb-toggle-btn${salaryPeriod==="annual"?" active":""}`}
            onClick={() => setSalaryPeriod("annual")}>Annual</button>
          <button type="button" className={`cb-toggle-btn${salaryPeriod==="hourly"?" active":""}`}
            onClick={() => setSalaryPeriod("hourly")}>Hourly</button>
        </div>

        {/* Salary input */}
        <div className="fi" style={{ marginBottom:16 }}>
          <label className="fl">
            {salaryPeriod === "annual" ? "Gross annual base salary" : "Hourly rate"}
            <span className="req">*</span>
          </label>
          <div className="cb-salary-wrap">
            <span className="cb-currency-prefix">$</span>
            <input className="cb-salary-input"
              type="number" value={salary}
              onChange={e => setSalary(parseFloat(e.target.value) || 0)} />
            <span className="cb-currency-suffix">USD</span>
          </div>
        </div>

        {/* Market rate chart */}
        {showMarketInsights && (
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13.5, fontWeight:600 }}>Market rate insights</span>
              <div className="mrc-ptoggle">
                <button type="button" className={`mrc-pbtn${chartPeriod==="annual"?" on":""}`}
                  onClick={() => setChartPeriod("annual")}>Annual</button>
                <button type="button" className={`mrc-pbtn${chartPeriod==="monthly"?" on":""}`}
                  onClick={() => setChartPeriod("monthly")}>Monthly</button>
              </div>
            </div>
            <MiniMarketChart
              salary={salary}
              period={chartPeriod}
              seniority="Mid"
              jobTitle="Executive Assistant" />
          </div>
        )}
      </div>

      <div className="block-divider" />

      {/* Signing bonus */}
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
          <div>
            <div className="block-title">Signing / retention bonus</div>
            <div className="fhint" style={{ marginTop:2 }}>One time payment on a specific date or as part of their first payroll.</div>
          </div>
          <button type="button" className="btn btn-s sm" style={{ display:"flex", alignItems:"center", gap:5 }}>
            <Plus /> Add
          </button>
        </div>
        <div className="bonus-empty">
          <span className="bonus-dot" />
          No bonus added yet
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// BLOCK 3 — BenefitsBlock
// ─────────────────────────────────────────────────────────────────
const BENEFITS_DATA = [
  {
    id: "healthcare",
    icon: "🛡️",
    iconBg: "#EFF6FF",
    name: "Healthcare",
    mandatory: true,
    desc: "Ensure the employee is covered by a healthcare option. This is either a monthly gross allowance or a localised healthcare plan depending on what is available.",
    ctaLabel: "Add Healthcare",
  },
  {
    id: "pension",
    icon: "🏦",
    iconBg: "#F0FDF4",
    name: "Pension",
    mandatory: true,
    desc: "Comprehensive savings and pension plan for working employees to fund their retirement in the future.",
    ctaLabel: "Add Pension",
  },
  {
    id: "lifeinsurance",
    icon: "📋",
    iconBg: "#FFF7ED",
    name: "Life Insurance",
    mandatory: true,
    desc: "Provide financial security in the event of an unexpected death, allowing employees to maintain their lifestyle.",
    ctaLabel: "Add Life Insurance",
  },
  {
    id: "travel",
    icon: "✈️",
    iconBg: "#F5F3FF",
    name: "Business Travel Insurance",
    mandatory: false,
    isNew: true,
    desc: "Tap into Deel's corporate travel insurance and get emergency coverage, crisis assistance, and 24/7 support before and during trips.",
    ctaLabel: "Add",
  },
  {
    id: "coworking",
    icon: "🏢",
    iconBg: "#FAFAFA",
    name: "Coworking Space Membership",
    mandatory: false,
    desc: "Request monthly access to WeWork. Explore available WeWork locations.",
    ctaLabel: "Add",
  },
];

function BenefitCard({ benefit, added, onAdd, onRemove }) {
  return (
    <div className="benefit-card">
      <div className="benefit-card-inner">
        <div className="benefit-card-header">
          <div className="benefit-card-left">
            <div className="benefit-icon" style={{ background: benefit.iconBg }}>{benefit.icon}</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span className="benefit-name">{benefit.name}</span>
                {benefit.mandatory && <span className="badge mandatory"><span className="bdot" />Mandatory</span>}
                {benefit.isNew && <span className="badge new"><span className="bdot" />New</span>}
              </div>
            </div>
          </div>
          {added
            ? <button type="button" className="btn btn-s sm"
                onClick={onRemove}
                style={{ display:"flex", alignItems:"center", gap:5, color:"#16A34A", borderColor:"#BBF7D0" }}>
                <Check /> Added
              </button>
            : <button type="button" className={`btn sm ${benefit.mandatory?"btn-p":"btn-s"}`}
                onClick={onAdd}
                style={{ display:"flex", alignItems:"center", gap:5 }}>
                <Plus /> {benefit.ctaLabel}
              </button>}
        </div>
        <div className="benefit-desc">{benefit.desc}</div>
      </div>
      {benefit.mandatory && !added && (
        <div className="benefit-mandatory-banner">
          <Warning />
          <span className="benefit-mandatory-text">{benefit.name} is a mandatory benefit for United States</span>
        </div>
      )}
      {added && (
        <div className="benefit-added-bar">
          <Check />
          <span className="benefit-added-text">{benefit.name} has been added</span>
        </div>
      )}
    </div>
  );
}

export function BenefitsBlock({ country = "United States" }) {
  const [added, setAdded] = useState({});
  const toggle = id => setAdded(prev => ({ ...prev, [id]: !prev[id] }));

  const mandatory = BENEFITS_DATA.filter(b => b.mandatory);
  const optional  = BENEFITS_DATA.filter(b => !b.mandatory);

  return (
    <div className="block-shell">
      <div>
        <div className="block-title">Benefits and extras</div>
        <div className="block-subtitle">Configure benefits for {country}. Mandatory benefits are required by law.</div>
      </div>

      <div className="benefit-grid">
        <div className="benefit-section-label">Mandatory benefits</div>
        {mandatory.map(b => (
          <BenefitCard key={b.id} benefit={b}
            added={!!added[b.id]}
            onAdd={() => toggle(b.id)}
            onRemove={() => toggle(b.id)} />
        ))}
      </div>

      <div className="block-divider" />

      <div className="benefit-grid">
        <div className="benefit-section-label">Optional extras</div>
        {optional.map(b => (
          <BenefitCard key={b.id} benefit={b}
            added={!!added[b.id]}
            onAdd={() => toggle(b.id)}
            onRemove={() => toggle(b.id)} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// BLOCK 4 — AddPersonBlock
// ─────────────────────────────────────────────────────────────────
const ENTITY_OPTS = [
  { value:"au_payroll", label:"AU entity - Payroll Connect" },
  { value:"us_payroll", label:"US entity - Payroll Connect" },
  { value:"de_payroll", label:"DE entity - Payroll Connect" },
];
const GROUP_OPTS = [
  { value:"au_group", label:"AU - Payroll Connect - group" },
  { value:"us_group", label:"US - Payroll Connect - group" },
  { value:"de_group", label:"DE - Payroll Connect - group" },
];
const COUNTRY_OPTS = [
  { value:"us", label:"🇺🇸  United States" },
  { value:"de", label:"🇩🇪  Germany" },
  { value:"gb", label:"🇬🇧  United Kingdom" },
  { value:"au", label:"🇦🇺  Australia" },
  { value:"ca", label:"🇨🇦  Canada" },
  { value:"fr", label:"🇫🇷  France" },
];
const US_STATE_OPTS = [
  { value:"al", label:"Alabama" }, { value:"ak", label:"Alaska" },
  { value:"az", label:"Arizona" }, { value:"ca", label:"California" },
  { value:"co", label:"Colorado" }, { value:"fl", label:"Florida" },
  { value:"il", label:"Illinois" }, { value:"mo", label:"Missouri" },
  { value:"ny", label:"New York" }, { value:"tx", label:"Texas" },
];
const JOB_POS_OPTS = [
  { value:"pm",  label:"Product Manager" },
  { value:"eng", label:"Software Engineer" },
  { value:"ea",  label:"Executive Assistant" },
  { value:"des", label:"UX Designer" },
];
const PEOPLE_OPTS = [
  { value:"alex",  label:"Alex Johnson" },
  { value:"sam",   label:"Sam Lee" },
  { value:"priya", label:"Priya Patel" },
  { value:"marco", label:"Marco Rossi" },
];
const DEPT_OPTS = [
  { value:"eng",     label:"Engineering" },
  { value:"design",  label:"Design" },
  { value:"product", label:"Product" },
  { value:"hr",      label:"Human Resources" },
];
const TEAM_OPTS = [
  { value:"platform", label:"Platform" },
  { value:"growth",   label:"Growth" },
  { value:"infra",    label:"Infrastructure" },
  { value:"cx",       label:"Customer Experience" },
];
const OBJECTIVE_OPTS = [
  { value:"temp_eor", label:"Temporary EOR while we set up an entity" },
  { value:"new_hc",   label:"New headcount" },
  { value:"backfill", label:"Backfill" },
  { value:"convert",  label:"Convert contractor" },
  { value:"longterm", label:"Long-term EOR with Deel" },
];

export function AddPersonBlock({
  defaultEntity  = "au_payroll",
  defaultGroup   = "au_group",
  defaultCountry = "us",
  defaultState   = "",
  workerIdValue  = "260",
  onSave,
}) {
  const [skipDetails,       setSkipDetails]       = useState(false);
  const [employmentCountry, setEmploymentCountry] = useState(defaultCountry);
  const [hiringObjective,   setHiringObjective]   = useState("temp_eor");
  const showState = employmentCountry === "us";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Page heading */}
      <div>
        <div className="block-title">Add person</div>
        <div className="block-subtitle">Create a new contract for your EOR employee</div>
      </div>

      {/* ── 1. Team information ── */}
      <SectionCard title="Team information" showInfoButton>
        <Select label="Entity" required options={ENTITY_OPTS} value={defaultEntity} />
        <Select label="Group" required options={GROUP_OPTS} value={defaultGroup} />
      </SectionCard>

      {/* ── 2. Employee personal details ── */}
      <SectionCard title="Employee personal details">
        <ToggleRow
          label="I don't know the worker's personal details yet"
          description="Get a cost estimate without providing worker details"
          checked={skipDetails}
          onChange={setSkipDetails}
        />
        {!skipDetails && (
          <>
            <div className="fi">
              <label className="fl">Personal email<span className="req">*</span></label>
              <input placeholder="devon.parisian@letsdeel.co" />
              <span className="fhint">We will use this email address for inviting your worker to complete their onboarding.</span>
            </div>
            <Field label="Legal first name" placeholder="Devon" required />
            <Field label="Legal last name" placeholder="Parisian" required />
            <Select label="Employee's citizenship" required options={COUNTRY_OPTS} value={defaultCountry} />
            <Select label="Employment country" required options={COUNTRY_OPTS} value={employmentCountry}
              onChange={setEmploymentCountry} />
            <ContextBanner
              variant="insight"
              body="Severance in the United States can range from at least 2 to 4 weeks salary."
              ctaLabel="Learn more"
            />
            {showState && (
              <Select label="Select state" required placeholder="Select state…"
                options={US_STATE_OPTS} value={defaultState} />
            )}
          </>
        )}
      </SectionCard>

      {/* ── 3. Workplace information ── */}
      <SectionCard title="Workplace information">
        <div>
          <Select label="Job Position" optional placeholder="Job Position (optional)" options={JOB_POS_OPTS} />
          <div className="apb-field-hint">Assign a vacant job position to this worker</div>
        </div>
        <div>
          <Select label="Manager" optional placeholder="Manager (optional)" options={PEOPLE_OPTS} />
          <div className="apb-field-hint">You can search by name or email</div>
        </div>
        <div>
          <Select label="Report" optional placeholder="Report (optional)" options={PEOPLE_OPTS} />
          <div className="apb-field-hint">You can search by name or email</div>
        </div>
        <Field label="Worker ID" required value={workerIdValue} disabled />
        <Field label="External worker ID" placeholder="External worker ID (optional)" />
      </SectionCard>

      {/* ── 4. Organizational structure ── */}
      <SectionCard title="Organizational structure">
        <Select label="Department" optional placeholder="Department (optional)" options={DEPT_OPTS} />
        <Select label="Teams" optional placeholder="Teams (optional)" options={TEAM_OPTS} />
      </SectionCard>

      {/* ── 5. Hiring objective ── */}
      <SectionCard title="Hiring objective">
        <Select label="What's your hiring objective?" required
          options={OBJECTIVE_OPTS} value={hiringObjective} onChange={setHiringObjective} />
        <ContextBanner
          variant="promo"
          title="Set up a foreign entity with Deel"
          body="We handle compliance, payroll, and local filings so you can focus on growing your team."
          ctaLabel="Learn more"
          media={["🇺🇸", "🌍", "🇦🇺"]}
        />
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PREVIEW LAYOUT
// ─────────────────────────────────────────────────────────────────
function PropsTable({ rows }) {
  return (
    <table className="ptable">
      <thead><tr><th>Prop</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
      <tbody>
        {rows.map(([n,tp,req,d]) => (
          <tr key={n}>
            <td><span className="pname">{n}</span></td>
            <td><span className="ptype">{tp}</span></td>
            <td><span className="preq">{req?"Yes":"—"}</span></td>
            <td><span className="pdesc">{d}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function ComposedOf({ atoms }) {
  return <div className="comp-label">🧬 Composed of: {atoms}</div>;
}
function Sec({ n, name, desc, composed, props: propsRows, children }) {
  return (
    <div className="sec">
      <div className="sec-hd">
        <span className="sec-n">0{n}</span>
        <span className="sec-name">{name}</span>
      </div>
      <p className="sec-desc">{desc}</p>
      <ComposedOf atoms={composed} />
      <div className="grid">{children}</div>
      {propsRows && <PropsTable rows={propsRows} />}
    </div>
  );
}
function Card({ label, wide, full, children }) {
  return (
    <div className={`card${wide?" wide":""}${full?" full":""}`}>
      <div className="card-lbl">{label}</div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────
export default function DeelBlocksPreview() {
  const [dark, setDark] = useState(false);
  const t = dark ? darkTokens : lightTokens;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: makeCSS(t, dark) }} />
      <div className="shell">

        {/* Header */}
        <div className="hdr">
          <div className="hdr-l">
            <span className="eyebrow">Deel Design System</span>
            <span className="pg-title">Blocks — Wave 4</span>
          </div>
          <div className="hdr-r">
            <span className="ai-tag">✦ AI-powered</span>
            <span className="count-tag">4 blocks · fully interactive</span>
            <button className="toggle-btn" onClick={() => setDark(d => !d)} type="button">
              {dark ? <Moon /> : <Sun />}
              {dark ? "Dark" : "Light"}
              <div className="track"><div className="thumb" /></div>
            </button>
          </div>
        </div>

        {/* ── 01 JobDescriptionBlock ── */}
        <Sec n={1} name="JobDescriptionBlock"
          desc="Full job description section — job title, seniority, scope guidelines, scope textarea with character count, and the AI compliance check panel. The Run check button streams results in card-by-card. Drop into step 2 of the EOR creation flow."
          composed="Select (×3) + Textarea + InfoBox + ComplianceCheckPanel (AI) + ComplianceCheckCard (×n)"
          props={[
            ["defaultTitle",     "string",  false, "Pre-filled job title value"],
            ["defaultSeniority", "string",  false, "Pre-filled seniority key"],
            ["defaultScope",     "string",  false, "Pre-filled scope text"],
            ["showComplianceResults","boolean",false,"Render results immediately (e.g. returning to step)"],
            ["complianceRunning","boolean", false, "Start in running/shimmer state"],
            ["onSave",           "function",false, "(state) => void — called on save scope click"],
          ]}>
          <Card label="Empty — ready to fill" wide>
            <JobDescriptionBlock />
          </Card>
          <Card label="With compliance results" wide>
            <JobDescriptionBlock
              defaultScope={SCOPE_PLACEHOLDER}
              showComplianceResults />
          </Card>
          <Card label="Interactive — type scope then Run check" full>
            <JobDescriptionBlock
              defaultScope=""
              defaultTitle="Executive Assistant"
              defaultSeniority="mid" />
          </Card>
        </Sec>

        {/* ── 02 CompensationBlock ── */}
        <Sec n={2} name="CompensationBlock"
          desc="Full compensation section — employment type toggle, salary input with live currency formatting, annual/hourly period selector, market rate histogram with bubble, and an empty signing bonus slot. The chart bubble repositions as salary changes."
          composed="RadioOption (×2) + SalaryInput (prefix/suffix) + Toggle (Annual/Hourly) + MarketRateChart + BonusSlot"
          props={[
            ["defaultSalary",       "number",  false, "Starting gross annual salary (default: 77293.01)"],
            ["defaultEmploymentType","string", false, "'full' | 'part' (default: 'full')"],
            ["defaultPeriod",       "string",  false, "'annual' | 'hourly' for salary input (default: 'annual')"],
            ["showMarketInsights",  "boolean", false, "Show/hide market rate chart (default: true)"],
            ["country",             "string",  false, "Country name shown in helper text"],
            ["onSalaryChange",      "function",false, "(value, period) => void"],
          ]}>
          <Card label="Default — $77,293" wide>
            <CompensationBlock />
          </Card>
          <Card label="Below median — $45,000" wide>
            <CompensationBlock defaultSalary={45000} />
          </Card>
          <Card label="Without market insights" wide>
            <CompensationBlock showMarketInsights={false} />
          </Card>
          <Card label="Interactive — edit salary and toggle period" full>
            <CompensationBlock defaultSalary={77293.01} />
          </Card>
        </Sec>

        {/* ── 03 BenefitsBlock ── */}
        <Sec n={3} name="BenefitsBlock"
          desc="Country-aware benefits section split into mandatory (Healthcare, Pension, Life Insurance) and optional extras (Travel Insurance, Coworking). Mandatory benefits show a warning banner until added. All cards are independently togglable — click 'Add' on any benefit."
          composed="BenefitCard (×n) — each is: icon + name + StatusBadge + desc + PrimaryButton/SecondaryButton + MandatoryBanner/AddedBar"
          props={[
            ["country",      "string",   false, "Country name in section subtitle and mandatory banners (default: 'United States')"],
            ["benefits",     "Benefit[]",false, "Override default benefit list — useful for non-US countries"],
            ["onAddBenefit", "function", false, "(benefitId: string) => void"],
          ]}>
          <Card label="All unadded — mandatory warnings visible" wide>
            <BenefitsBlock />
          </Card>
          <Card label="Interactive — click Add on any benefit" full>
            <BenefitsBlock country="United States" />
          </Card>
        </Sec>

        {/* ── 04 AddPersonBlock ── */}
        <Sec n={4} name="AddPersonBlock"
          desc="Step 1 of the EOR contract creation flow — 'Add person' multi-section form. Five SectionCards cover: Team information, Employee personal details (with skip-details toggle, insight banner, and conditional state dropdown), Workplace information, Organizational structure, and Hiring objective (with promo banner). Built entirely from existing atoms and molecules."
          composed="SectionCard (×5) + DropdownSelect (×10) + TextInput (×5) + ToggleRow (×1) + ContextBanner insight + ContextBanner promo"
          props={[
            ["defaultEntity",  "string",   false, "Pre-selected entity option value (default: 'au_payroll')"],
            ["defaultGroup",   "string",   false, "Pre-selected group option value (default: 'au_group')"],
            ["defaultCountry", "string",   false, "Pre-selected employment country value (default: 'us')"],
            ["defaultState",   "string",   false, "Pre-selected state dropdown value"],
            ["workerIdValue",  "string",   false, "Read-only Worker ID shown in Workplace information (default: '260')"],
            ["onSave",         "function", false, "(formData: object) => void"],
          ]}>
          <Card label="Default — AU entity, personal details visible" wide>
            <AddPersonBlock />
          </Card>
          <Card label="Pre-filled — US employee, Missouri state" wide>
            <AddPersonBlock defaultCountry="us" defaultState="mo" />
          </Card>
          <Card label="Interactive — toggle details, change country" full>
            <AddPersonBlock defaultCountry="us" workerIdValue="260" />
          </Card>
        </Sec>

        {/* Footer */}
        <div className="foot">
          <span>Deel Design System · Wave 4 · Blocks</span>
          <span>Next → Wave 5: EORContractCreationFlow (full 4-step orchestration)</span>
        </div>
      </div>
    </>
  );
}
