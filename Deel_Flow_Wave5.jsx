import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────
// TOKENS
// ─────────────────────────────────────────────────────────────────
const lightTokens = {
  bg:"#FAFAFA", surface:"#FFFFFF", surfaceHover:"#F4F4F5",
  border:"#E4E4E7", borderFocus:"#18181B",
  primary:"#18181B", primaryHover:"#27272A", btnText:"#FFFFFF",
  textMain:"#18181B", textMuted:"#71717A", textDisabled:"#A1A1AA",
  error:"#EF4444", errorBg:"#FEF2F2", errorBorder:"#FECACA",
  success:"#16A34A", successBg:"#F0FDF4", successBorder:"#BBF7D0",
  warning:"#D97706", warningBg:"#FFFBEB", warningBorder:"#FDE68A",
  purple:"#7C3AED", purpleBg:"#F5F3FF",
  info:"#2563EB", infoBg:"#EFF6FF",
  mandatory:"#EA580C", mandatoryBg:"#FFF7ED",
  inputBg:"#FFFFFF", rowHover:"#FAFAFA",
  chartBar:"#E4E4E7", chartBarActive:"#18181B",
  shadow:"0 1px 2px rgba(0,0,0,0.05)",
  shadowMd:"0 4px 12px rgba(0,0,0,0.08)",
  ring:"rgba(24,24,27,0.08)",
};
const darkTokens = {
  bg:"#09090B", surface:"#18181B", surfaceHover:"#27272A",
  border:"#3F3F46", borderFocus:"#FAFAFA",
  primary:"#FAFAFA", primaryHover:"#E4E4E7", btnText:"#09090B",
  textMain:"#FAFAFA", textMuted:"#A1A1AA", textDisabled:"#52525B",
  error:"#F87171", errorBg:"#2A1515", errorBorder:"#7F1D1D",
  success:"#4ADE80", successBg:"#0D2818", successBorder:"#14532D",
  warning:"#FCD34D", warningBg:"#1C1500", warningBorder:"#713F12",
  purple:"#A78BFA", purpleBg:"#1E1033",
  info:"#60A5FA", infoBg:"#0C1A2E",
  mandatory:"#FB923C", mandatoryBg:"#271100",
  inputBg:"#27272A", rowHover:"#1F1F23",
  chartBar:"#3F3F46", chartBarActive:"#FAFAFA",
  shadow:"0 1px 3px rgba(0,0,0,0.4)",
  shadowMd:"0 6px 20px rgba(0,0,0,0.5)",
  ring:"rgba(250,250,250,0.10)",
};

// ─────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────
const makeCSS = (t, isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; }

  .shell { min-height:100vh; background:${t.bg}; color:${t.textMain}; font-family:'Inter',sans-serif; transition:background .18s,color .18s; }

  /* ── Preview header bar ── */
  .prev-bar {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 28px; background:${t.surface};
    border-bottom:1px solid ${t.border}; box-shadow:${t.shadow};
    position:sticky; top:0; z-index:100;
  }
  .prev-bar-l { display:flex; flex-direction:column; gap:1px; }
  .eyebrow { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:${t.textMuted}; }
  .pg-title { font-size:16px; font-weight:600; letter-spacing:-.02em; color:${t.textMain}; }
  .prev-bar-r { display:flex; align-items:center; gap:8px; }
  .tag { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; padding:4px 10px; border-radius:6px; }
  .tag-ai  { color:${t.purple}; background:${t.purpleBg}; }
  .tag-cnt { color:${t.textMuted}; background:${t.surface}; border:1px solid ${t.border}; }
  .toggle-btn { display:flex; align-items:center; gap:7px; padding:5px 11px 5px 9px; background:${t.surface}; border:1px solid ${t.border}; border-radius:8px; cursor:pointer; font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500; color:${t.textMain}; }
  .track { width:30px; height:17px; border-radius:999px; background:${isDark?t.primary:t.border}; position:relative; transition:background .18s; }
  .thumb { position:absolute; top:2px; left:${isDark?"14px":"2px"}; width:13px; height:13px; border-radius:50%; background:${isDark?t.btnText:"#fff"}; box-shadow:0 1px 3px rgba(0,0,0,.25); transition:left .18s; }

  /* ── Wave info row ── */
  .wave-info { padding:20px 28px 0; display:flex; flex-direction:column; gap:4px; }
  .wave-sec-n { font-family:'JetBrains Mono',monospace; font-size:10px; color:${t.textMuted}; }
  .wave-sec-name { font-size:14px; font-weight:600; color:${t.textMain}; }
  .wave-desc { font-size:12.5px; color:${t.textMuted}; line-height:1.55; max-width:680px; }
  .comp-label { display:inline-flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:${t.purple}; background:${t.purpleBg}; padding:3px 8px; border-radius:4px; margin-top:10px; width:fit-content; }

  /* ── Flow chrome ── */
  .flow-wrap { padding:20px 28px 40px; }
  .flow-frame { background:${t.bg}; border:1px solid ${t.border}; border-radius:14px; overflow:hidden; box-shadow:${t.shadowMd}; }

  /* Flow top bar */
  .flow-topbar {
    display:flex; align-items:center; justify-content:space-between;
    padding:12px 28px; background:${t.surface}; border-bottom:1px solid ${t.border};
  }
  .flow-brand { display:flex; align-items:center; gap:10px; }
  .flow-logo { width:26px; height:26px; border-radius:6px; background:${t.primary}; display:flex; align-items:center; justify-content:center; }
  .flow-logo-t { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:500; color:${t.btnText}; }
  .flow-page-title { font-size:13.5px; font-weight:600; color:${t.textMain}; }
  .flow-page-sub { font-size:11.5px; color:${t.textMuted}; margin-top:1px; }

  /* Flow body grid */
  .flow-body {
    display:grid; grid-template-columns:1fr 264px;
    gap:0; max-width:1040px; margin:0 auto;
    padding:28px 32px 64px; align-items:start;
  }
  .flow-main { min-width:0; padding-right:28px; }
  .flow-rail { position:sticky; top:20px; display:flex; flex-direction:column; gap:10px; }

  /* Hiring guide banner */
  .hgb {
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    padding:11px 14px; border-radius:10px; margin-bottom:22px;
    background:${t.purpleBg}; border:1px solid ${isDark?t.purple+"44":"#DDD6FE"};
  }
  .hgb-l { display:flex; align-items:center; gap:10px; flex:1; }
  .hgb-flags { display:flex; }
  .hgb-flag { width:20px; height:20px; border-radius:50%; border:1.5px solid ${t.surface}; font-size:12px; display:flex; align-items:center; justify-content:center; background:${t.surfaceHover}; }
  .hgb-flag:nth-child(n+2) { margin-left:-5px; }
  .hgb-text { font-size:12.5px; color:${t.textMain}; }
  .hgb-link { color:${t.purple}; font-weight:500; cursor:pointer; }
  .hgb-link:hover { text-decoration:underline; }
  .hgb-x { background:none; border:none; cursor:pointer; color:${t.textMuted}; display:flex; align-items:center; padding:2px; border-radius:4px; }
  .hgb-x:hover { color:${t.textMain}; background:${t.surfaceHover}; }

  /* Step title area */
  .step-title { font-size:22px; font-weight:600; letter-spacing:-.025em; color:${t.textMain}; margin-bottom:5px; }
  .step-sub   { font-size:13px; color:${t.textMuted}; margin-bottom:22px; line-height:1.5; }

  /* Step content animation */
  .step-content { animation:fadeUp .2s ease; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }

  /* Block shell */
  .block { background:${t.surface}; border:1px solid ${t.border}; border-radius:12px; padding:22px; box-shadow:${t.shadow}; display:flex; flex-direction:column; gap:16px; margin-bottom:16px; }
  .block-title { font-size:14px; font-weight:600; color:${t.textMain}; letter-spacing:-.01em; }
  .block-sub { font-size:12px; color:${t.textMuted}; line-height:1.5; margin-top:-8px; }
  .block-divider { height:1px; background:${t.border}; }
  .bstack { display:flex; flex-direction:column; gap:12px; }
  .brow2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  /* Info / warn boxes */
  .info-box { display:flex; align-items:flex-start; gap:8px; padding:10px 12px; background:${t.infoBg}; border:1px solid ${isDark?t.info+"33":"#BFDBFE"}; border-radius:8px; }
  .ib-icon { color:${t.info}; flex-shrink:0; margin-top:1px; }
  .ib-text { font-size:12.5px; color:${t.textMain}; line-height:1.5; }
  .ib-text a,.ib-text strong { color:inherit; }
  .ib-text a { color:${t.info}; font-weight:500; }

  /* Form atoms */
  .fi { display:flex; flex-direction:column; gap:4px; }
  .fl { font-size:12px; font-weight:500; color:${t.textMain}; }
  .fl .req { color:${t.error}; margin-left:1px; }
  .fi input,.fi textarea { width:100%; font-family:'Inter',sans-serif; font-size:13.5px; color:${t.textMain}; background:${t.inputBg}; border:1px solid ${t.border}; border-radius:6px; outline:none; appearance:none; transition:border-color .12s,box-shadow .12s; }
  .fi input { height:36px; padding:0 11px; }
  .fi textarea { padding:10px 11px; resize:vertical; min-height:150px; line-height:1.55; }
  .fi input::placeholder,.fi textarea::placeholder { color:${t.textDisabled}; }
  .fi input:focus,.fi textarea:focus { border-color:${t.borderFocus}; box-shadow:0 0 0 3px ${t.ring}; }
  .fhint { font-size:11.5px; color:${t.textMuted}; }
  .selw { position:relative; }
  .selw select { height:36px; width:100%; padding:0 34px 0 11px; font-family:'Inter',sans-serif; font-size:13.5px; background:${t.inputBg}; border:1px solid ${t.border}; border-radius:6px; outline:none; appearance:none; cursor:pointer; color:${t.textMain}; transition:border-color .12s,box-shadow .12s; }
  .selw select.ph { color:${t.textDisabled}; }
  .selw select:focus { border-color:${t.borderFocus}; box-shadow:0 0 0 3px ${t.ring}; }
  .selw select option { background:${t.inputBg}; color:${t.textMain}; }
  .chev-icon { position:absolute; right:10px; top:50%; transform:translateY(-50%); pointer-events:none; color:${t.textMuted}; }
  .rrow { display:flex; align-items:center; gap:10px; padding:10px 13px; border:1px solid ${t.border}; border-radius:8px; cursor:pointer; user-select:none; width:100%; background:${t.surface}; font-family:'Inter',sans-serif; appearance:none; text-align:left; transition:border-color .1s; }
  .rrow:hover { border-color:${t.textMuted}; }
  .rrow.on { border-color:${t.primary}; background:${isDark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.015)"}; }
  .rcirc { width:15px; height:15px; border-radius:50%; flex-shrink:0; border:1.5px solid ${t.border}; display:flex; align-items:center; justify-content:center; transition:border-color .1s; }
  .rrow.on .rcirc { border-color:${t.primary}; }
  .rdot { width:7px; height:7px; border-radius:50%; background:${t.primary}; }
  .rlbl { font-size:13.5px; color:${t.textMain}; }
  .rsub { font-size:11.5px; color:${t.textMuted}; margin-top:1px; }
  .rstack { display:flex; flex-direction:column; gap:6px; }

  /* Buttons */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:0 14px; height:36px; font-family:'Inter',sans-serif; font-size:13px; font-weight:500; border-radius:6px; border:none; cursor:pointer; white-space:nowrap; transition:background .1s,opacity .1s,transform .07s,box-shadow .1s; }
  .btn:active:not(:disabled) { transform:scale(.985); }
  .btn:disabled { opacity:.4; cursor:not-allowed; }
  .btn.sm { height:30px; padding:0 11px; font-size:12px; border-radius:5px; }
  .btn.lg { height:42px; padding:0 20px; font-size:14px; border-radius:8px; font-weight:600; }
  .btn-p { background:${t.primary}; color:${t.btnText}; }
  .btn-p:hover:not(:disabled) { background:${t.primaryHover}; box-shadow:${t.shadowMd}; }
  .btn-s { background:transparent; color:${t.textMain}; border:1px solid ${t.border}; }
  .btn-s:hover:not(:disabled) { background:${t.surfaceHover}; border-color:${t.textMuted}; }
  .btn-g { background:transparent; color:${t.info}; border:none; height:auto; padding:0; font-size:12.5px; font-weight:500; font-family:'Inter',sans-serif; cursor:pointer; }
  .btn-g:hover { text-decoration:underline; }

  /* Spinners */
  .spin    { width:12px; height:12px; border-radius:50%; border:1.5px solid ${isDark?"rgba(9,9,11,.3)":"rgba(255,255,255,.3)"}; border-top-color:${t.btnText}; animation:sp .55s linear infinite; flex-shrink:0; }
  .spin-sm { width:10px; height:10px; border-radius:50%; border:1.5px solid ${t.border}; border-top-color:${t.purple}; animation:sp .55s linear infinite; flex-shrink:0; }
  @keyframes sp { to { transform:rotate(360deg); } }
  .shimmer { height:44px; border-radius:8px; background:linear-gradient(90deg,${t.surfaceHover} 25%,${t.border} 50%,${t.surfaceHover} 75%); background-size:200% 100%; animation:shim 1.4s infinite; }
  @keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* Badges */
  .badge { display:inline-flex; align-items:center; gap:5px; padding:2.5px 8px; border-radius:5px; font-size:11.5px; font-weight:500; }
  .bdot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
  .badge.mandatory { background:${t.mandatoryBg}; color:${t.mandatory}; }
  .badge.mandatory .bdot { background:${t.mandatory}; }
  .badge.new { background:${t.purpleBg}; color:${t.purple}; }
  .badge.new .bdot { background:${t.purple}; }

  /* Salary input */
  .sal-wrap { display:flex; border:1px solid ${t.border}; border-radius:6px; overflow:hidden; transition:border-color .12s,box-shadow .12s; }
  .sal-wrap:focus-within { border-color:${t.borderFocus}; box-shadow:0 0 0 3px ${t.ring}; }
  .sal-pre { padding:0 11px; height:36px; display:flex; align-items:center; font-size:13px; color:${t.textMuted}; background:${t.surfaceHover}; border-right:1px solid ${t.border}; flex-shrink:0; font-family:'JetBrains Mono',monospace; }
  .sal-inp { flex:1; height:36px; padding:0 10px; font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:500; color:${t.textMain}; background:${t.inputBg}; border:none; outline:none; }
  .sal-suf { padding:0 11px; height:36px; display:flex; align-items:center; font-size:12px; font-weight:500; color:${t.textMuted}; background:${t.surfaceHover}; border-left:1px solid ${t.border}; flex-shrink:0; font-family:'JetBrains Mono',monospace; }

  /* Period toggle */
  .ptoggle { display:flex; border:1px solid ${t.border}; border-radius:7px; overflow:hidden; }
  .ptbtn { flex:1; padding:8px; font-family:'Inter',sans-serif; font-size:13px; font-weight:500; background:transparent; border:none; cursor:pointer; color:${t.textMuted}; transition:background .1s,color .1s; }
  .ptbtn.on { background:${t.primary}; color:${t.btnText}; }

  /* Chart toggle (small) */
  .ctoggle { display:flex; border:1px solid ${t.border}; border-radius:6px; overflow:hidden; }
  .ctbtn { padding:4px 11px; font-family:'Inter',sans-serif; font-size:12px; font-weight:500; background:transparent; border:none; cursor:pointer; color:${t.textMuted}; transition:background .1s,color .1s; }
  .ctbtn.on { background:${t.primary}; color:${t.btnText}; }

  /* Market rate chart */
  .mrc-title { font-size:12.5px; font-weight:600; color:${t.textMain}; margin-bottom:2px; }
  .mrc-sub { font-size:12px; color:${t.textMuted}; }
  .mrc-note { font-size:11px; color:${t.textDisabled}; margin-bottom:12px; margin-top:2px; }
  .mrc-bars-wrap { height:72px; position:relative; margin-bottom:6px; }
  .mrc-bars { display:flex; align-items:flex-end; gap:3px; height:100%; }
  .mrc-bar-col { flex:1; display:flex; align-items:flex-end; justify-content:center; position:relative; height:100%; }
  .mrc-bar { width:100%; border-radius:3px 3px 0 0; background:${t.chartBar}; transition:height .4s cubic-bezier(.4,0,.2,1),background .15s; }
  .mrc-bar.ab { background:${t.chartBarActive}; }
  .mrc-bubble-wrap { position:absolute; top:-30px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; pointer-events:none; }
  .mrc-bubble { background:${t.info}; color:#fff; font-size:11px; font-weight:600; font-family:'JetBrains Mono',monospace; padding:2.5px 8px; border-radius:5px; white-space:nowrap; box-shadow:${t.shadowMd}; }
  .mrc-arrow { width:0; height:0; border-left:4px solid transparent; border-right:4px solid transparent; border-top:4px solid ${t.info}; }
  .mrc-dashed { position:absolute; top:0; bottom:0; left:50%; width:0; border-left:1.5px dashed ${t.info}; opacity:.45; pointer-events:none; }
  .mrc-axis { display:flex; justify-content:space-between; padding-top:7px; border-top:1px solid ${t.border}; }
  .mrc-axis-item { display:flex; flex-direction:column; align-items:center; gap:1px; }
  .mrc-axis-val { font-family:'JetBrains Mono',monospace; font-size:10.5px; font-weight:500; color:${t.textMain}; }
  .mrc-axis-lbl { font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:.06em; text-transform:uppercase; color:${t.textMuted}; }

  /* Compliance cards */
  .cc { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:11px 13px; border:1px solid ${t.border}; border-radius:8px; background:${t.surface}; }
  .cc.pass { border-color:${t.successBorder}; background:${t.successBg}; }
  .cc.fail { border-color:${t.errorBorder}; background:${t.errorBg}; }
  .cc.warn { border-color:${t.warningBorder}; background:${t.warningBg}; }
  .cc-rule { font-size:12.5px; color:${t.textMain}; line-height:1.4; flex:1; }
  .cc-detail { font-size:11.5px; color:${t.textMuted}; margin-top:3px; }
  .cc-badge { display:inline-flex; align-items:center; gap:4px; padding:2.5px 8px; border-radius:5px; font-size:11px; font-weight:500; flex-shrink:0; white-space:nowrap; }
  .cc-dot { width:5px; height:5px; border-radius:50%; }
  .cc-badge.pass { background:${t.successBg}; color:${t.success}; border:1px solid ${t.successBorder}; }
  .cc-badge.pass .cc-dot { background:${t.success}; }
  .cc-badge.fail { background:${t.errorBg}; color:${t.error}; border:1px solid ${t.errorBorder}; }
  .cc-badge.fail .cc-dot { background:${t.error}; }
  .cc-badge.warn { background:${t.warningBg}; color:${t.warning}; border:1px solid ${t.warningBorder}; }
  .cc-badge.warn .cc-dot { background:${t.warning}; }
  .cc-badge.checking { background:${t.purpleBg}; color:${t.purple}; }

  /* AI banner */
  .ai-banner { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:13px 16px; background:${t.purpleBg}; border:1px solid ${isDark?t.purple+"44":"#DDD6FE"}; border-radius:10px; }
  .ai-l { display:flex; align-items:center; gap:10px; flex:1; }
  .ai-ico { width:32px; height:32px; border-radius:8px; background:${isDark?t.purple+"22":"#EDE9FE"}; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ai-title { font-size:13px; font-weight:600; color:${t.textMain}; margin-bottom:1px; }
  .ai-desc  { font-size:11.5px; color:${t.textMuted}; line-height:1.4; }
  .ai-desc a { color:${t.purple}; font-weight:500; }

  /* Notice period table */
  .np-table { border:1px solid ${t.border}; border-radius:8px; overflow:hidden; }
  .np-hd  { display:flex; align-items:center; gap:7px; padding:9px 13px; background:${t.surfaceHover}; border-bottom:1px solid ${t.border}; }
  .np-row { display:flex; justify-content:space-between; align-items:center; padding:10px 13px; border-bottom:1px solid ${t.border}; }
  .np-row:last-child { border-bottom:none; }
  .np-label { font-size:12.5px; color:${t.textMuted}; }
  .np-value { font-size:12.5px; font-weight:600; color:${t.textMain}; }

  /* Benefit cards */
  .benefit { border:1px solid ${t.border}; border-radius:10px; overflow:hidden; background:${t.surface}; }
  .benefit-inner { padding:15px 18px; }
  .benefit-hd { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:8px; }
  .benefit-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
  .benefit-name { font-size:13.5px; font-weight:600; color:${t.textMain}; }
  .benefit-desc { font-size:12px; color:${t.textMuted}; line-height:1.5; }
  .benefit-mand { display:flex; align-items:center; gap:7px; padding:8px 12px; background:${t.warningBg}; border-top:1px solid ${t.warningBorder}; }
  .benefit-mand-text { font-size:11.5px; color:${t.warning}; font-weight:500; }
  .benefit-added { display:flex; align-items:center; gap:7px; padding:8px 12px; background:${t.successBg}; border-top:1px solid ${t.successBorder}; }
  .benefit-added-text { font-size:11.5px; color:${t.success}; font-weight:500; }
  .benefits-section-lbl { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.07em; text-transform:uppercase; color:${t.textMuted}; padding-bottom:6px; border-bottom:1px solid ${t.border}; margin-bottom:4px; }

  /* ── Rail ── */
  /* Stepper */
  .srail { background:${t.surface}; border:1px solid ${t.border}; border-radius:12px; padding:14px; box-shadow:${t.shadow}; }
  .sri { display:flex; align-items:flex-start; gap:9px; padding:7px 8px; border-radius:7px; }
  .sri.clickable { cursor:pointer; }
  .sri.clickable:hover { background:${t.surfaceHover}; }
  .sri-col { display:flex; flex-direction:column; align-items:center; flex-shrink:0; }
  .sri-circ { width:21px; height:21px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:600; font-family:'JetBrains Mono',monospace; border:1.5px solid ${t.border}; color:${t.textMuted}; background:${t.surface}; transition:all .15s; }
  .sri-circ.done   { background:${t.primary}; border-color:${t.primary}; color:${t.btnText}; }
  .sri-circ.active { border-color:${t.primary}; color:${t.primary}; box-shadow:0 0 0 3px ${t.ring}; }
  .sri-line { width:1.5px; height:16px; background:${t.border}; margin:2px 0; transition:background .15s; }
  .sri-line.done { background:${t.primary}; }
  .sri-info { padding-top:1px; }
  .sri-status { font-family:'JetBrains Mono',monospace; font-size:8.5px; font-weight:500; letter-spacing:.07em; text-transform:uppercase; color:${t.textMuted}; margin-bottom:0px; }
  .sri-status.done-s   { color:${t.success}; }
  .sri-status.active-s { color:${t.primary}; }
  .sri-label { font-size:12px; font-weight:500; color:${t.textMuted}; }
  .sri-label.active { color:${t.textMain}; font-weight:600; }

  /* Autosave */
  .autosave { background:${t.surface}; border:1px solid ${t.border}; border-radius:12px; padding:14px; box-shadow:${t.shadow}; }
  .as-hd { display:flex; align-items:center; gap:7px; margin-bottom:4px; }
  .as-ico { width:15px; height:15px; border-radius:50%; background:${t.infoBg}; display:flex; align-items:center; justify-content:center; color:${t.info}; flex-shrink:0; }
  .as-title { font-size:12px; font-weight:600; color:${t.textMain}; }
  .as-body { font-size:11.5px; color:${t.textMuted}; line-height:1.5; margin-bottom:9px; }
  .as-status { display:flex; align-items:center; gap:5px; font-size:11px; color:${t.textMuted}; margin-bottom:9px; }
  .as-dot { width:5px; height:5px; border-radius:50%; background:${t.success}; flex-shrink:0; }
  .as-dot.saving { background:${t.mandatory}; animation:pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.35} }

  /* Help */
  .help { background:${t.surface}; border:1px solid ${t.border}; border-radius:12px; overflow:hidden; box-shadow:${t.shadow}; }
  .help-hd { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; cursor:pointer; }
  .help-hd:hover { background:${t.surfaceHover}; }
  .help-title { font-size:12.5px; font-weight:600; color:${t.textMain}; }
  .help-body { padding:0 14px 12px; display:flex; flex-direction:column; gap:8px; }
  .help-link { font-size:12px; color:${t.info}; text-decoration:none; display:flex; align-items:center; gap:5px; }
  .help-link:hover { text-decoration:underline; }

  /* Nav footer */
  .flow-nav { display:flex; align-items:center; justify-content:space-between; padding-top:22px; border-top:1px solid ${t.border}; margin-top:6px; }
  .step-counter { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:${t.textMuted}; letter-spacing:.05em; }

  /* Completion */
  .complete { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:380px; gap:16px; text-align:center; padding:40px; animation:fadeUp .3s ease; }
  .complete-ico { width:56px; height:56px; border-radius:50%; background:${t.successBg}; border:2px solid ${t.successBorder}; display:flex; align-items:center; justify-content:center; color:${t.success}; }
  .complete-title { font-size:20px; font-weight:600; color:${t.textMain}; letter-spacing:-.02em; }
  .complete-sub { font-size:13.5px; color:${t.textMuted}; max-width:360px; line-height:1.65; }

  /* Props table */
  .ptable { width:100%; border-collapse:collapse; margin-top:24px; }
  .ptable thead tr { border-bottom:1px solid ${t.border}; }
  .ptable th { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.07em; text-transform:uppercase; padding:8px 12px; text-align:left; font-weight:500; color:${t.textMuted}; }
  .ptable td { padding:9px 12px; border-bottom:1px solid ${t.border}; font-size:12px; vertical-align:top; }
  .ptable tr:last-child td { border-bottom:none; }
  .ptable tbody tr:hover td { background:${t.rowHover}; }
  .pname { font-family:'JetBrains Mono',monospace; font-size:11px; color:${t.textMain}; }
  .ptype { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:${t.purple}; }
  .preq  { font-size:11px; color:${t.error}; }
  .pdesc { font-size:11.5px; color:${t.textMuted}; line-height:1.5; }

  /* Footer */
  .foot { display:flex; justify-content:space-between; align-items:center; padding:20px 28px; border-top:1px solid ${t.border}; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.07em; text-transform:uppercase; color:${t.textMuted}; }
`;

// ─────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────
const Sun    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/><line x1="17.7" y1="4.2" x2="19.8" y2="6.3"/><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/></svg>;
const Moon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const ChevDn = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 5 7 9 11 5"/></svg>;
const ChevUp = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 9 7 5 11 9"/></svg>;
const ChevSel= () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 5 7 9 11 5"/></svg>;
const X      = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="2.5" y1="2.5" x2="10.5" y2="10.5"/><line x1="10.5" y1="2.5" x2="2.5" y2="10.5"/></svg>;
const Check  = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5 6 4.5 9 10.5 3"/></svg>;
const Plus   = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="6.5" y1="1.5" x2="6.5" y2="11.5"/><line x1="1.5" y1="6.5" x2="11.5" y2="6.5"/></svg>;
const Arrow  = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="6.5" x2="11" y2="6.5"/><polyline points="7.5 3 11 6.5 7.5 10"/></svg>;
const ArrowL = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="11" y1="6.5" x2="2" y2="6.5"/><polyline points="5.5 3 2 6.5 5.5 10"/></svg>;
const InfoI  = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="5.5"/><line x1="7" y1="6.5" x2="7" y2="10"/><circle cx="7" cy="4.5" r=".8" fill="currentColor" stroke="none"/></svg>;
const WarnI  = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1.5L13 12H1L7 1.5z"/><line x1="7" y1="6" x2="7" y2="9"/><circle cx="7" cy="10.5" r=".6" fill="currentColor" stroke="none"/></svg>;
const AIIco  = () => <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8" cy="8" r="6.5"/><path d="M5.5 8a2.5 2.5 0 0 0 5 0"/><circle cx="5.8" cy="5.8" r=".7" fill="currentColor" stroke="none"/><circle cx="10.2" cy="5.8" r=".7" fill="currentColor" stroke="none"/></svg>;
const Reload = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6A4.5 4.5 0 0 1 10 3"/><polyline points="8 1.5 10.5 3 8.5 5.5"/><path d="M10.5 6A4.5 4.5 0 0 1 2 9"/><polyline points="4 10.5 1.5 9 3.5 6.5"/></svg>;
const BigOk  = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 9 17 20 6"/></svg>;
const Disk   = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1" y="1" width="9" height="9" rx="1.5"/><rect x="3" y="1" width="5" height="3.5" rx=".5" fill="currentColor" stroke="none"/><rect x="2.5" y="6" width="6" height="3" rx=".5"/></svg>;
const Cal    = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1.5" y="2" width="11" height="10.5" rx="1.5"/><line x1="1.5" y1="5.5" x2="12.5" y2="5.5"/><line x1="4.5" y1="1" x2="4.5" y2="3.5"/><line x1="9.5" y1="1" x2="9.5" y2="3.5"/></svg>;
const Ext    = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 2H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.5"/><polyline points="7 1 10 1 10 4"/><line x1="5" y1="6" x2="10" y2="1"/></svg>;

// ─────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────
function Field({ label, placeholder, value, required, hint }) {
  const [v, setV] = useState(value ?? "");
  return (
    <div className="fi">
      {label && <label className="fl">{label}{required && <span className="req">*</span>}</label>}
      <input placeholder={placeholder} value={v} onChange={e => setV(e.target.value)} />
      {hint && <div className="fhint">{hint}</div>}
    </div>
  );
}
function Sel({ label, placeholder, options = [], value, optional, hint }) {
  const [v, setV] = useState(value ?? "");
  return (
    <div className="fi">
      {label && <label className="fl">{label}{optional && <span style={{ fontWeight:400, opacity:.65 }}> (optional)</span>}</label>}
      <div className="selw">
        <select className={!v ? "ph" : ""} value={v} onChange={e => setV(e.target.value)}>
          <option value="" disabled>{placeholder ?? label}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="chev-icon"><ChevSel /></span>
      </div>
      {hint && <div className="fhint">{hint}</div>}
    </div>
  );
}
function Radio({ label, sub, selected, onClick }) {
  return (
    <button type="button" className={`rrow${selected ? " on" : ""}`} onClick={onClick}>
      <div className="rcirc">{selected && <div className="rdot" />}</div>
      <div><div className="rlbl">{label}</div>{sub && <div className="rsub">{sub}</div>}</div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// MARKET CHART
// ─────────────────────────────────────────────────────────────────
const MARKET = {
  annual:  { low:30700, median:69000, high:123200, buckets:[18,34,52,70,88,80,66,50,36,22,14] },
  monthly: { low:2558,  median:5750,  high:10267,  buckets:[16,30,50,68,86,80,64,48,34,20,12] },
};
const fmtK = n => n >= 1000 ? `$${(n/1000).toFixed(1).replace(/\.0$/,"")}k` : `$${n}`;

function MarketChart({ salary, period }) {
  const [anim, setAnim] = useState(false);
  useEffect(() => { setAnim(false); const t = setTimeout(() => setAnim(true), 60); return () => clearTimeout(t); }, [period, salary]);
  const d = MARKET[period];
  const disp = period === "annual" ? salary : salary / 12;
  const pos  = Math.max(0, Math.min(1, (disp - d.low) / (d.high - d.low)));
  const act  = Math.round(pos * (d.buckets.length - 1));
  const maxB = Math.max(...d.buckets);
  const fSal = `$${disp.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 })}`;
  return (
    <div>
      <div className="mrc-title">Mid Executive Assistant {period} compensation in United States.</div>
      <div className="mrc-sub">Your rate is equal to {fSal} {period === "annual" ? "annually" : "monthly"} in USD.</div>
      <div className="mrc-note">Market insights will not be shown to employees.</div>
      <div className="mrc-bars-wrap">
        <div className="mrc-bars">
          {d.buckets.map((h, i) => (
            <div key={i} className="mrc-bar-col">
              <div className={`mrc-bar${i===act?" ab":""}`} style={{ height: anim?`${(h/maxB)*100}%`:"0%" }} />
              {i === act && (<>
                <div className="mrc-dashed" />
                <div className="mrc-bubble-wrap"><div className="mrc-bubble">{fmtK(disp)}</div><div className="mrc-arrow" /></div>
              </>)}
            </div>
          ))}
        </div>
      </div>
      <div className="mrc-axis">
        {[["Low",d.low],["Median",d.median],["High",d.high]].map(([l,v]) => (
          <div key={l} className="mrc-axis-item">
            <span className="mrc-axis-val">{fmtK(v)}</span>
            <span className="mrc-axis-lbl">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STEP 1 — Personal details
// ─────────────────────────────────────────────────────────────────
function Step1() {
  return (
    <div className="step-content">
      <div className="block">
        <div className="block-title">Basic information</div>
        <div className="bstack">
          <div className="brow2">
            <Field label="First name" placeholder="Jane" required />
            <Field label="Last name" placeholder="Smith" required />
          </div>
          <Field label="Work email" placeholder="jane@acme.com" required />
          <Sel label="Country" required placeholder="Select country…"
            options={[
              { value:"us", label:"🇺🇸  United States" },
              { value:"de", label:"🇩🇪  Germany" },
              { value:"ca", label:"🇨🇦  Canada" },
              { value:"au", label:"🇦🇺  Australia" },
            ]} />
          <Field label="Nationality" placeholder="American" required />
        </div>
      </div>
      <div className="block">
        <div className="block-title">Workplace information</div>
        <div className="bstack">
          <Sel label="Job Position" optional placeholder="Job Position (optional)"
            options={[{ value:"pm", label:"Product Manager" },{ value:"eng", label:"Engineer" }]} />
          <Sel label="Manager" optional placeholder="Manager (optional)"
            hint="Search by name or email"
            options={[{ value:"a", label:"Alex Johnson" },{ value:"b", label:"Sam Lee" }]} />
          <div className="brow2">
            <Field label="Worker ID" required value="261" />
            <Field label="External worker ID" placeholder="e.g. EMP-261" />
          </div>
        </div>
      </div>
      <div className="block">
        <div className="block-title">Organizational structure</div>
        <div className="bstack">
          <Sel label="Department" optional placeholder="Department (optional)"
            options={[{ value:"eng", label:"Engineering" },{ value:"design", label:"Design" }]} />
          <Sel label="Teams" optional placeholder="Teams (optional)"
            options={[{ value:"t1", label:"Platform" },{ value:"t2", label:"Growth" }]} />
        </div>
      </div>
      <div className="block">
        <div className="block-title">Hiring objective</div>
        <Sel required placeholder="Select hiring objective…"
          options={[{ value:"new", label:"New headcount" },{ value:"backfill", label:"Backfill" },{ value:"convert", label:"Convert contractor" }]} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STEP 2 — Job details
// ─────────────────────────────────────────────────────────────────
const SCOPE_TEXT = `Duties and Responsibilities

- Provide high-level administrative support to senior executives.
- Manage complex calendars, scheduling and travel arrangements.
- Prepare correspondence, reports, and presentations.
- Coordinate internal and external communications.
- Handle confidential information with discretion.`;

const CC_RULES = [
  { rule:"Job scope should be relevant to the job title.", status:"pass" },
  { rule:"Job scope should not include recruiting or hiring language.", status:"pass" },
  { rule:"Job scope should not reference reporting lines.", status:"warn", detail:"Indirect reference detected — consider rephrasing." },
  { rule:"Job scope should not include required education or experience requirements.", status:"pass" },
];

function Step2() {
  const [scope, setScope] = useState(SCOPE_TEXT);
  const [phase, setPhase] = useState("idle");
  const [results, setResults] = useState([]);
  const maxLen = 10000;

  const runCheck = () => {
    setPhase("running"); setResults([]);
    CC_RULES.forEach((r,i) => setTimeout(() => {
      setResults(p => [...p, r]);
      if (i === CC_RULES.length - 1) setPhase("done");
    }, 480 + i * 380));
  };

  return (
    <div className="step-content">
      <div className="block">
        <div className="block-title">Job description</div>
        <div className="bstack">
          <Sel label="Job title" required value="Executive Assistant"
            options={[{ value:"Executive Assistant", label:"Executive Assistant" },{ value:"Product Manager", label:"Product Manager" }]} />
          <Sel label="Seniority level" required value="mid"
            options={[{ value:"jun", label:"Junior (IC Level 1)" },{ value:"mid", label:"Mid (Individual Contributor Level 2)" },{ value:"sen", label:"Senior (IC Level 3)" }]} />
        </div>
      </div>
      <div className="block">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div className="block-title">Job scope</div>
          <button type="button" className="btn btn-s sm">Manage job scopes</button>
        </div>
        <div className="info-box">
          <span className="ib-icon"><InfoI /></span>
          <div className="ib-text"><strong>Job scope guidelines</strong> — Always refer to your company as "the company". Do not include recruiting language, education requirements, or C-suite references. <a href="#">Learn more</a></div>
        </div>
        <Sel optional placeholder="Job scope template (optional)"
          options={[{ value:"t1", label:"Executive Support Template" }]} />
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
            <label className="fl">Explanation of job scope <span className="req">*</span></label>
            <button type="button" style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", fontSize:12, opacity:.6, fontFamily:"inherit", color:"inherit" }}>
              <Disk /> Save scope
            </button>
          </div>
          <div className="fi"><textarea value={scope} onChange={e => setScope(e.target.value)} /></div>
          <div style={{ textAlign:"right", fontFamily:"'JetBrains Mono',monospace", fontSize:10, opacity:.5, marginTop:4 }}>
            {scope.length}/{maxLen.toLocaleString()}
          </div>
        </div>
        <div className="ai-banner">
          <div className="ai-l">
            <div className="ai-ico"><AIIco /></div>
            <div>
              <div className="ai-title">Save time with AI-powered compliance check</div>
              <div className="ai-desc">Verify your job scope meets <a href="#">EOR compliance requirements</a> for an instant quote.</div>
            </div>
          </div>
          <button type="button" className="btn btn-s sm" onClick={runCheck} disabled={phase==="running"}
            style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            {phase==="running" ? <><span className="spin-sm" />Running…</> : <><Reload />Run check</>}
          </button>
        </div>
        {phase==="running" && results.length===0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>{[1,2,3].map(i=><div key={i} className="shimmer"/>)}</div>
        )}
        {results.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {results.map((r,i) => (
              <div key={i} className={`cc ${r.status}`}>
                <div style={{ flex:1 }}>
                  <div className="cc-rule">{r.rule}</div>
                  {r.detail && <div className="cc-detail">{r.detail}</div>}
                </div>
                <div className={`cc-badge ${r.status}`}>
                  {r.status==="checking" ? <span className="spin-sm"/> : <span className="cc-dot"/>}
                  {{pass:"Passed",fail:"Failed",warn:"Warning",checking:"Checking…"}[r.status]}
                </div>
              </div>
            ))}
            <div className="info-box">
              <span className="ib-icon"><InfoI /></span>
              <span className="ib-text">Think Deel reported false errors? <a href="#">Report to our engineering team</a></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STEP 3 — Compensation + dates
// ─────────────────────────────────────────────────────────────────
function Step3() {
  const [empType, setEmpType] = useState("full");
  const [salPeriod, setSalPeriod] = useState("annual");
  const [salary, setSalary] = useState(77293.01);
  const [chartPeriod, setChartPeriod] = useState("annual");
  const [pto, setPto] = useState("min");

  return (
    <div className="step-content">
      <div className="block">
        <div className="block-title">Employment type</div>
        <div className="rstack">
          <Radio label="Full-time" selected={empType==="full"} onClick={() => setEmpType("full")} />
          <Radio label="Part-time" selected={empType==="part"} onClick={() => setEmpType("part")} />
        </div>
      </div>
      <div className="block">
        <div>
          <div className="block-title">Compensation</div>
          <div className="block-sub">All compensation will be awarded in US Dollar (USD). Due to compliance, contract currencies are not customizable in EOR.</div>
        </div>
        <div className="ptoggle">
          <button type="button" className={`ptbtn${salPeriod==="annual"?" on":""}`} onClick={() => setSalPeriod("annual")}>Annual</button>
          <button type="button" className={`ptbtn${salPeriod==="hourly"?" on":""}`} onClick={() => setSalPeriod("hourly")}>Hourly</button>
        </div>
        <div className="fi">
          <label className="fl">{salPeriod==="annual"?"Gross annual base salary":"Hourly rate"}<span className="req">*</span></label>
          <div className="sal-wrap">
            <span className="sal-pre">$</span>
            <input className="sal-inp" type="number" value={salary} onChange={e => setSalary(parseFloat(e.target.value)||0)} />
            <span className="sal-suf">USD</span>
          </div>
        </div>
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontSize:13.5, fontWeight:600 }}>Market rate insights</span>
            <div className="ctoggle">
              <button type="button" className={`ctbtn${chartPeriod==="annual"?" on":""}`} onClick={() => setChartPeriod("annual")}>Annual</button>
              <button type="button" className={`ctbtn${chartPeriod==="monthly"?" on":""}`} onClick={() => setChartPeriod("monthly")}>Monthly</button>
            </div>
          </div>
          <MarketChart salary={salary} period={chartPeriod} />
        </div>
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>Signing / retention bonus</div>
              <div className="fhint" style={{ marginTop:2 }}>One time payment on a specific date or as part of their first payroll.</div>
            </div>
            <button type="button" className="btn btn-s sm" style={{ display:"flex", alignItems:"center", gap:5 }}><Plus />Add</button>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12.5, opacity:.5, paddingTop:10 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"currentColor", display:"inline-block" }} />
            No bonus added yet
          </div>
        </div>
      </div>
      <div className="block">
        <div className="block-title">Desired start date</div>
        <div className="block-sub">Select the worker's start date.</div>
        <div className="info-box">
          <span className="ib-icon"><InfoI /></span>
          <div className="ib-text">The earliest possible start date is <strong>Mar 4, 2026</strong> due to regulatory requirements in United States. Delays in providing information may postpone this date.</div>
        </div>
        <div className="fi">
          <label className="fl">Agreement start date (MM/DD/YYYY)<span className="req">*</span></label>
          <div style={{ position:"relative" }}>
            <input defaultValue="03/04/2026" style={{ paddingRight:36 }} />
            <span style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", opacity:.5 }}><Cal /></span>
          </div>
        </div>
      </div>
      <div className="block">
        <div>
          <div className="block-title">Time off</div>
          <div className="block-sub">Deel recommends opting for the minimum PTO for adhering to local best practices.</div>
        </div>
        <div className="rstack">
          <Radio label="Minimum legal requirement" selected={pto==="min"} onClick={() => setPto("min")} />
          <Radio label="Specific" selected={pto==="spec"} onClick={() => setPto("spec")} />
        </div>
      </div>
      <div className="block">
        <div className="block-title">Sick leave</div>
        <div className="info-box">
          <span className="ib-icon"><InfoI /></span>
          <div className="ib-text">Sick leave entitlements in United States vary depending on the specifics of the leave request. Please reach out to your CSM for more information.</div>
        </div>
        <div className="np-table">
          <div className="np-hd"><span style={{ fontSize:13 }}>🇺🇸</span><span style={{ fontSize:12.5, fontWeight:600 }}>Standard sick leave in United States</span></div>
          <div className="np-row"><span className="np-label">Sick leave days</span><span className="np-value">Not applicable</span></div>
        </div>
      </div>
      <div className="block">
        <div className="block-title">Notice period</div>
        <div className="info-box">
          <span className="ib-icon"><InfoI /></span>
          <div className="ib-text">When hiring in United States, you can only select the standard local regulations for notice period.</div>
        </div>
        <div className="rstack">
          <Radio label="Standard" selected /><Radio label="Custom" />
        </div>
        <div className="np-table">
          <div className="np-hd"><span style={{ fontSize:13 }}>🇺🇸</span><span style={{ fontSize:12.5, fontWeight:600 }}>Standard notice period in United States</span></div>
          <div className="np-row"><span className="np-label">During probation</span><span className="np-value">No notice period</span></div>
          <div className="np-row"><span className="np-label">After probation</span><span className="np-value">No notice period</span></div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STEP 4 — Benefits
// ─────────────────────────────────────────────────────────────────
const BENEFITS_LIST = [
  { id:"health",  icon:"🛡️", bg:"#EFF6FF", name:"Healthcare",                   mandatory:true,  desc:"Ensure the employee is covered — a monthly gross allowance or localised healthcare plan.", cta:"Add Healthcare" },
  { id:"pension", icon:"🏦", bg:"#F0FDF4", name:"Pension",                       mandatory:true,  desc:"Comprehensive savings and pension plan for employees to fund their retirement.", cta:"Add Pension" },
  { id:"life",    icon:"📋", bg:"#FFF7ED", name:"Life Insurance",                mandatory:true,  desc:"Provide financial security in the event of an unexpected death.", cta:"Add Life Insurance" },
  { id:"travel",  icon:"✈️", bg:"#F5F3FF", name:"Business Travel Insurance",     mandatory:false, isNew:true, desc:"Emergency coverage, crisis assistance, and 24/7 support for work trips.", cta:"Add" },
  { id:"cowork",  icon:"🏢", bg:"#FAFAFA", name:"Coworking Space Membership",    mandatory:false, desc:"Request monthly access to WeWork locations worldwide.", cta:"Add" },
];

function Step4({ added, setAdded }) {
  const toggle = id => setAdded(p => ({ ...p, [id]: !p[id] }));
  const mandatory = BENEFITS_LIST.filter(b => b.mandatory);
  const optional  = BENEFITS_LIST.filter(b => !b.mandatory);

  const BCard = ({ b }) => (
    <div className="benefit">
      <div className="benefit-inner">
        <div className="benefit-hd">
          <div style={{ display:"flex", alignItems:"center", gap:9, flex:1, minWidth:0 }}>
            <div className="benefit-icon" style={{ background:b.bg }}>{b.icon}</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                <span className="benefit-name">{b.name}</span>
                {b.mandatory && <span className="badge mandatory"><span className="bdot" />Mandatory</span>}
                {b.isNew     && <span className="badge new"><span className="bdot" />New</span>}
              </div>
            </div>
          </div>
          {added[b.id]
            ? <button type="button" className="btn btn-s sm" onClick={() => toggle(b.id)}
                style={{ display:"flex", alignItems:"center", gap:5, color:"#16A34A", borderColor:"#BBF7D0", flexShrink:0 }}>
                <Check />Added
              </button>
            : <button type="button" className={`btn sm ${b.mandatory?"btn-p":"btn-s"}`}
                onClick={() => toggle(b.id)} style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
                <Plus />{b.cta}
              </button>}
        </div>
        <div className="benefit-desc">{b.desc}</div>
      </div>
      {b.mandatory && !added[b.id] && (
        <div className="benefit-mand"><WarnI /><span className="benefit-mand-text">{b.name} is a mandatory benefit for United States</span></div>
      )}
      {added[b.id] && (
        <div className="benefit-added"><Check /><span className="benefit-added-text">{b.name} has been added</span></div>
      )}
    </div>
  );

  return (
    <div className="step-content">
      <div className="block">
        <div>
          <div className="block-title">Mandatory benefits</div>
          <div className="block-sub">Required by law for United States. Must be configured before submitting.</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {mandatory.map(b => <BCard key={b.id} b={b} />)}
        </div>
      </div>
      <div className="block">
        <div>
          <div className="block-title">Optional extras</div>
          <div className="block-sub">Additional benefits to attract and retain talent.</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {optional.map(b => <BCard key={b.id} b={b} />)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RAIL — StepperRail
// ─────────────────────────────────────────────────────────────────
const STEPS = [
  "Personal details",
  "Job details",
  "Compensation and dates",
  "Benefits and extras",
];

function StepperRail({ current, onBack }) {
  return (
    <div className="srail">
      {STEPS.map((lbl, i) => {
        const n      = i + 1;
        const done   = n < current;
        const active = n === current;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={n}>
            <div className={`sri${done ? " clickable" : ""}`}
              onClick={() => done && onBack?.(n)}>
              <div className="sri-col">
                <div className={`sri-circ${done?" done":active?" active":""}`}>
                  {done ? <Check /> : n}
                </div>
                {!isLast && <div className={`sri-line${done?" done":""}`} />}
              </div>
              <div className="sri-info">
                <div className={`sri-status${done?" done-s":active?" active-s":""}`}>
                  {done ? "Completed" : active ? "In progress" : `Step ${n}`}
                </div>
                <div className={`sri-label${active?" active":done?" done":""}`}>{lbl}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RAIL — AutosaveWidget
// ─────────────────────────────────────────────────────────────────
function AutosaveWidget({ step }) {
  const [saving, setSaving] = useState(false);
  const [ts, setTs] = useState("just now");
  const prev = useRef(step);
  useEffect(() => {
    if (step !== prev.current) {
      prev.current = step;
      setSaving(true);
      setTimeout(() => { setSaving(false); setTs("just now"); }, 1400);
    }
  }, [step]);
  return (
    <div className="autosave">
      <div className="as-hd">
        <div className="as-ico"><InfoI /></div>
        <span className="as-title">Autosaved</span>
      </div>
      <div className="as-body">Your progress is saved automatically. Delete the draft to start over.</div>
      <div className="as-status">
        {saving ? <><span className="spin-sm" /><span>Saving…</span></> : <><span className="as-dot" /><span>Saved {ts}</span></>}
      </div>
      <button type="button" className="btn btn-s sm">Delete draft</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RAIL — HelpWidget
// ─────────────────────────────────────────────────────────────────
function HelpWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div className="help">
      <div className="help-hd" onClick={() => setOpen(o => !o)}>
        <span className="help-title">Help and support</span>
        {open ? <ChevUp /> : <ChevDn />}
      </div>
      {open && (
        <div className="help-body">
          <a href="#" className="help-link"><Ext />EOR compliance requirements</a>
          <a href="#" className="help-link"><Ext />Global hiring guide: United States</a>
          <a href="#" className="help-link"><Ext />Contact support</a>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FULL FLOW
// ─────────────────────────────────────────────────────────────────
const STEP_TITLES = [
  "Personal details",
  "Job details",
  "Compensation and dates",
  "Benefits and extras",
];
const STEP_SUBS = [
  "Enter the employee's personal and workplace information.",
  "Define the job title, seniority, and scope for this EOR contract.",
  "Set compensation, start date, time off, and notice period.",
  "Configure mandatory and optional benefits for United States.",
];

export function EORContractCreationFlow() {
  const [step, setStep]         = useState(1);
  const [done, setDone]         = useState(false);
  const [benefitsAdded, setBenefitsAdded] = useState({});

  const next = () => step < 4 ? setStep(s => s + 1) : setDone(true);
  const back = () => step > 1 && setStep(s => s - 1);
  const goTo = n => n >= 1 && n < step && setStep(n);
  const reset = () => { setStep(1); setDone(false); setBenefitsAdded({}); };

  return (
    <div className="flow-frame">
      {/* Top bar */}
      <div className="flow-topbar">
        <div className="flow-brand">
          <div>
            <div className="flow-page-title">Add person</div>
            <div className="flow-page-sub">Create a new contract for your EOR employee</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flow-body">
        <div className="flow-main">
          {/* Step title */}
          {!done && (
            <>
              <div className="step-title">{STEP_TITLES[step-1]}</div>
              <div className="step-sub">{STEP_SUBS[step-1]}</div>
            </>
          )}

          {/* Step content */}
          {!done ? (
            <>
              {step === 1 && <Step1 />}
              {step === 2 && <Step2 />}
              {step === 3 && <Step3 />}
              {step === 4 && <Step4 added={benefitsAdded} setAdded={setBenefitsAdded} />}

              {/* Nav */}
              <div className="flow-nav">
                <button type="button" className="btn btn-s"
                  style={{ display:"flex", alignItems:"center", gap:6 }}
                  disabled={step === 1} onClick={back}>
                  <ArrowL />Back
                </button>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span className="step-counter">Step {step} of 4</span>
                  <button type="button" className="btn btn-p lg"
                    style={{ display:"flex", alignItems:"center", gap:7 }}
                    onClick={next}>
                    {step < 4 ? <>Save and continue <Arrow /></> : <>Submit contract <Check /></>}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="complete">
              <div className="complete-ico"><BigOk /></div>
              <div className="complete-title">Contract submitted!</div>
              <div className="complete-sub">
                The EOR contract for United States has been submitted for review. The employee will receive an invitation to complete onboarding.
              </div>
              <button type="button" className="btn btn-p lg" onClick={reset}>
                Create another contract
              </button>
            </div>
          )}
        </div>

        {/* Rail */}
        <div className="flow-rail">
          <StepperRail current={done ? 5 : step} onBack={goTo} />
          <AutosaveWidget step={step} />
          <HelpWidget />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────
export default function DeelFlowPreview() {
  const [dark, setDark] = useState(false);
  const t = dark ? darkTokens : lightTokens;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: makeCSS(t, dark) }} />
      <div className="shell">

        {/* Preview bar */}
        <div className="prev-bar">
          <div className="prev-bar-l">
            <span className="eyebrow">Deel Design System</span>
            <span className="pg-title">EORContractCreationFlow — Wave 5</span>
          </div>
          <div className="prev-bar-r">
            <span className="tag tag-ai">✦ AI-powered</span>
            <span className="tag tag-cnt">1 flow · 4 steps · all waves</span>
            <button className="toggle-btn" onClick={() => setDark(d => !d)} type="button">
              {dark ? <Moon /> : <Sun />}
              {dark ? "Dark" : "Light"}
              <div className="track"><div className="thumb" /></div>
            </button>
          </div>
        </div>

        {/* Wave info */}
        <div className="wave-info">
          <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
            <span className="wave-sec-n">01</span>
            <span className="wave-sec-name">EORContractCreationFlow</span>
          </div>
          <p className="wave-desc">
            Full 4-step EOR contract creation orchestration. Navigate with Save and continue or click completed steps in the rail to go back.
            The hiring guide banner is dismissable. Autosave fires on every step transition. The AI compliance check in step 2 streams results card-by-card.
            The market rate chart in step 3 updates as you edit the salary. Benefits in step 4 are individually toggleable.
            Submit on step 4 to reach the confirmation screen.
          </p>
          <div className="comp-label">
            🧬 HiringGuideBanner · StepperRail · AutosaveWidget · HelpWidget · Step1(Personal) · Step2(JobDetails+AI) · Step3(Compensation+MarketChart) · Step4(Benefits)
          </div>
        </div>

        {/* Flow */}
        <div className="flow-wrap">
          <EORContractCreationFlow />
        </div>

        {/* Props */}
        <div style={{ padding:"0 28px 20px" }}>
          <table className="ptable">
            <thead><tr><th>Prop</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              {[
                ["country",         "string",   false, "ISO country code — drives regulatory dates, notice period, sick leave, and benefits list"],
                ["employeeEmail",   "string",   false, "Pre-fills the work email field"],
                ["initialStep",     "number",   false, "Resume from a specific step (e.g. returning to a saved draft)"],
                ["mcpContext",      "MCPCtx",   false, "Deel MCP context — replaces all mock data with live API calls when provided"],
                ["onComplete",      "function", false, "(contractPayload) => void — fires on successful submit"],
                ["onSaveDraft",     "function", false, "(partialState, step) => void — fires on every autosave trigger"],
                ["onDeleteDraft",   "function", false, "() => void — fires when Delete draft is clicked in the rail"],
                ["showHiringGuide", "boolean",  false, "Show or hide the country hiring guide banner (default: true)"],
                ["readonlySteps",   "number[]", false, "Steps rendered read-only — useful for review flows post-submission"],
              ].map(([n,tp,req,d]) => (
                <tr key={n}>
                  <td><span className="pname">{n}</span></td>
                  <td><span className="ptype">{tp}</span></td>
                  <td><span className="preq">{req?"Yes":"—"}</span></td>
                  <td><span className="pdesc">{d}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="foot">
          <span>Deel Design System · Wave 5 · EORContractCreationFlow</span>
          <span>All 5 waves complete ✦ Atoms → Molecules → AI Molecules → Blocks → Flow</span>
        </div>
      </div>
    </>
  );
}
