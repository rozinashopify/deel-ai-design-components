import { useState, useRef } from "react";
import {
  COMPONENT_MANIFEST,
  makeLibraryCSS,
  lightTokens as libLightTokens,
  darkTokens  as libDarkTokens,
  APPEARANCE_DEFAULTS,
  applyAppearance,
  // ── Atoms
  TextInput, DropdownSelect, RadioOption, ToggleRow, SectionCard,
  // ── Molecules
  FormFieldGroup, StatusBadge, PrimaryButton, SecondaryButton, TextButton, Button,
  AutosaveWidget, ContextBanner, HiringGuideBanner,
  // ── Navigation
  StepperRail,
  // ── Compliance
  ComplianceCheckCard, ComplianceCheckPanel,
  // ── Market Intelligence
  MarketRateChart,
  // ── Blocks
  JobDescriptionBlock, CompensationBlock, BenefitsBlock, AddPersonBlock,
  // ── Flows
  EORContractCreationFlow,
} from "./ComponentLibrary.jsx";



// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS  (in sync with all Waves)
// ─────────────────────────────────────────────────────────────────
const lightTokens = {
  bg:           "#FAFAFA",
  surface:      "#FFFFFF",
  surfaceHover: "#F4F4F5",
  border:       "#E4E4E7",
  borderFocus:  "#18181B",
  primary:      "#18181B",
  primaryHover: "#27272A",
  btnText:      "#FFFFFF",
  textMain:     "#18181B",
  textMuted:    "#71717A",
  textDisabled: "#A1A1AA",
  error:        "#EF4444",
  errorBg:      "#FEF2F2",
  errorBorder:  "#FECACA",
  success:      "#16A34A",
  successBg:    "#F0FDF4",
  successBorder:"#BBF7D0",
  warning:      "#D97706",
  warningBg:    "#FFFBEB",
  warningBorder:"#FDE68A",
  mandatory:    "#EA580C",
  mandatoryBg:  "#FFF7ED",
  purple:       "#7C3AED",
  purpleBg:     "#F5F3FF",
  info:         "#2563EB",
  infoBg:       "#EFF6FF",
  inputBg:      "#FFFFFF",
  shadow:       "0 1px 2px rgba(0,0,0,0.05)",
  shadowMd:     "0 4px 12px rgba(0,0,0,0.08)",
  shadowLg:     "0 8px 32px rgba(0,0,0,0.10)",
  ring:         "rgba(24,24,27,0.08)",
  waveAtoms:    "#2563EB",
  waveAtomsBg:  "#EFF6FF",
  waveMol:      "#059669",
  waveMolBg:    "#ECFDF5",
  waveAI:       "#7C3AED",
  waveAIBg:     "#F5F3FF",
  waveBlocks:   "#D97706",
  waveBlocksBg: "#FFFBEB",
  waveFlow:     "#18181B",
  waveFlowBg:   "#F4F4F5",
  chartBar:      "#CACACE",
  chartBarActive:"#18181B",
  chartBarHover: "#D4D4D8",
};
const darkTokens = {
  bg:           "#09090B",
  surface:      "#18181B",
  surfaceHover: "#27272A",
  border:       "#3F3F46",
  borderFocus:  "#FAFAFA",
  primary:      "#FAFAFA",
  primaryHover: "#E4E4E7",
  btnText:      "#09090B",
  textMain:     "#FAFAFA",
  textMuted:    "#A1A1AA",
  textDisabled: "#52525B",
  error:        "#F87171",
  errorBg:      "#2A1515",
  errorBorder:  "#7F1D1D",
  success:      "#4ADE80",
  successBg:    "#0D2818",
  successBorder:"#14532D",
  warning:      "#FCD34D",
  warningBg:    "#1C1500",
  warningBorder:"#713F12",
  mandatory:    "#FB923C",
  mandatoryBg:  "#271100",
  purple:       "#A78BFA",
  purpleBg:     "#1E1033",
  info:         "#60A5FA",
  infoBg:       "#0C1A2E",
  inputBg:      "#27272A",
  shadow:       "0 1px 3px rgba(0,0,0,0.4)",
  shadowMd:     "0 6px 20px rgba(0,0,0,0.5)",
  shadowLg:     "0 12px 40px rgba(0,0,0,0.6)",
  ring:         "rgba(250,250,250,0.10)",
  waveAtoms:    "#60A5FA",
  waveAtomsBg:  "#0C1A2E",
  waveMol:      "#34D399",
  waveMolBg:    "#0A2218",
  waveAI:       "#A78BFA",
  waveAIBg:     "#1E1033",
  waveBlocks:   "#FCD34D",
  waveBlocksBg: "#1C1500",
  waveFlow:     "#FAFAFA",
  waveFlowBg:   "#27272A",
  chartBar:      "#3F3F46",
  chartBarActive:"#FAFAFA",
  chartBarHover: "#52525B",
};

// ─────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────
const makeCSS = (t, isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }

  .shell {
    min-height: 100vh;
    background: ${t.bg};
    color: ${t.textMain};
    font-family: 'Inter', sans-serif;
    transition: background 0.18s, color 0.18s;
  }

  /* ── Top nav bar ── */
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 36px;
    background: ${t.surface};
    border-bottom: 1px solid ${t.border};
    box-shadow: ${t.shadow};
    position: sticky; top: 0; z-index: 100;
  }
  .topbar-l { display: flex; align-items: center; gap: 12px; }
  .deel-logo {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 500; letter-spacing: -0.01em;
    color: ${t.textMain};
    background: ${t.bg};
    border: 1px solid ${t.border};
    padding: 5px 10px; border-radius: 7px;
  }
  .topbar-title {
    font-size: 14px; font-weight: 600; letter-spacing: -0.02em; color: ${t.textMain};
  }
  .topbar-sep { color: ${t.textDisabled}; }
  .topbar-r { display: flex; align-items: center; gap: 8px; }
  .ai-pill {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
    color: ${t.purple}; background: ${t.purpleBg};
    padding: 4px 10px; border-radius: 6px;
  }
  .toggle-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 5px 11px 5px 9px;
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 8px;
    cursor: pointer; font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500;
    color: ${t.textMain}; transition: border-color 0.12s, background 0.12s;
  }
  .toggle-btn:hover { border-color: ${t.textMuted}; background: ${t.surfaceHover}; }
  .track { width: 30px; height: 17px; border-radius: 999px; background: ${isDark ? t.primary : t.border}; position: relative; transition: background 0.18s; }
  .thumb { position: absolute; top: 2px; left: ${isDark ? "14px" : "2px"}; width: 13px; height: 13px; border-radius: 50%; background: ${isDark ? t.btnText : "#fff"}; box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: left 0.18s; }

  /* ── Hero ── */
  .hero {
    padding: 64px 36px 52px;
    border-bottom: 1px solid ${t.border};
    background: ${t.surface};
  }
  .hero-inner { max-width: 880px; }
  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
    color: ${t.textMuted}; margin-bottom: 14px; display: block;
  }
  .hero-title {
    font-size: 36px; font-weight: 700; letter-spacing: -0.04em; line-height: 1.12;
    color: ${t.textMain}; margin-bottom: 16px;
  }
  .hero-title em { font-style: normal; color: ${t.purple}; }
  .hero-desc {
    font-size: 15px; color: ${t.textMuted}; line-height: 1.65; max-width: 600px; margin-bottom: 28px;
  }
  .hero-stats { display: flex; gap: 28px; flex-wrap: wrap; }
  .stat { display: flex; flex-direction: column; gap: 2px; }
  .stat-n { font-size: 22px; font-weight: 700; letter-spacing: -0.04em; color: ${t.textMain}; }
  .stat-l { font-size: 11.5px; color: ${t.textMuted}; font-weight: 500; }

  /* ── Progression diagram ── */
  .prog-section {
    padding: 44px 36px 36px;
    border-bottom: 1px solid ${t.border};
  }
  .section-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    color: ${t.textMuted}; margin-bottom: 20px;
  }
  .prog-rail {
    display: flex; align-items: center; gap: 0; overflow-x: auto;
    padding-bottom: 4px;
  }
  .prog-node {
    display: flex; flex-direction: column; align-items: center;
    gap: 8px; min-width: 120px; text-align: center; padding: 0 6px;
  }
  .prog-circle {
    width: 44px; height: 44px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 500; border: 1.5px solid;
    transition: transform 0.12s, box-shadow 0.12s;
    cursor: pointer;
  }
  .prog-circle:hover { transform: scale(1.1); box-shadow: 0 4px 14px rgba(0,0,0,0.12); }
  .prog-wlabel { font-size: 11px; font-weight: 600; color: ${t.textMain}; }
  .prog-wsublabel { font-size: 10px; color: ${t.textMuted}; }
  .prog-arrow {
    flex: 1; height: 1px; background: ${t.border}; min-width: 20px; position: relative;
    margin-bottom: 28px;
  }
  .prog-arrow::after {
    content: ''; position: absolute; right: -1px; top: -3px;
    border-left: 5px solid ${t.border}; border-top: 3.5px solid transparent; border-bottom: 3.5px solid transparent;
  }

  /* ── Wave grid ── */
  .waves-section { padding: 44px 36px 60px; }
  .waves-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px; }
  
  .wave-card {
    background: ${t.surface};
    border: 1px solid ${t.border};
    border-radius: 14px;
    overflow: hidden;
    box-shadow: ${t.shadow};
    transition: box-shadow 0.15s, transform 0.15s;
    display: flex; flex-direction: column;
  }
  .wave-card:hover { box-shadow: ${t.shadowMd}; transform: translateY(-2px); }

  .wave-card-header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid ${t.border};
    display: flex; flex-direction: column; gap: 10px;
  }
  .wave-card-top { display: flex; align-items: center; justify-content: space-between; }
  .wave-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 3px 9px; border-radius: 5px;
  }
  .wave-card-title { font-size: 16px; font-weight: 700; letter-spacing: -0.025em; color: ${t.textMain}; }
  .wave-card-subtitle { font-size: 12px; color: ${t.textMuted}; line-height: 1.55; }

  .wave-card-body { padding: 16px 20px; flex: 1; }
  .comp-list { display: flex; flex-direction: column; gap: 8px; }
  .comp-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 8px 10px; border-radius: 8px;
    border: 1px solid ${t.border};
    background: ${t.bg};
    transition: background 0.1s;
  }
  .comp-row:hover { background: ${t.surfaceHover}; }
  .comp-icon {
    width: 28px; height: 28px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0; margin-top: 1px;
  }
  .comp-info { display: flex; flex-direction: column; gap: 1px; }
  .comp-name { font-size: 12.5px; font-weight: 600; color: ${t.textMain}; }
  .comp-desc-sm { font-size: 11px; color: ${t.textMuted}; line-height: 1.4; }

  .wave-card-footer {
    padding: 14px 20px;
    border-top: 1px solid ${t.border};
    display: flex; align-items: center; justify-content: space-between;
    background: ${t.bg};
  }
  .file-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: ${t.textMuted}; letter-spacing: 0.03em;
  }
  .open-btn {
    display: flex; align-items: center; gap: 5px;
    font-size: 11.5px; font-weight: 500; color: ${t.textMain};
    background: ${t.surface}; border: 1px solid ${t.border};
    padding: 5px 10px; border-radius: 7px; cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.12s, background 0.12s;
  }
  .open-btn:hover { border-color: ${t.textMuted}; background: ${t.surfaceHover}; }

  /* ── Molecule & Block Showcase ── */
  .showcase-section { padding: 0 36px 60px; }
  .showcase-title { font-size: 18px; font-weight: 700; letter-spacing: -0.03em; color: ${t.textMain}; margin-bottom: 4px; }
  .showcase-desc { font-size: 13px; color: ${t.textMuted}; margin-bottom: 24px; line-height: 1.55; }

  .showcase-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .chip-card {
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 10px;
    padding: 14px 14px 12px; display: flex; flex-direction: column; gap: 6px;
    box-shadow: ${t.shadow}; transition: box-shadow 0.14s, transform 0.14s;
  }
  .chip-card:hover { box-shadow: ${t.shadowMd}; transform: translateY(-2px); }
  .chip-top { display: flex; align-items: center; justify-content: space-between; }
  .chip-icon-wrap {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 15px;
  }
  .chip-wave-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px; font-weight: 500; letter-spacing: 0.06em;
    text-transform: uppercase; padding: 2px 6px; border-radius: 4px;
  }
  .chip-name { font-size: 12px; font-weight: 600; color: ${t.textMain}; letter-spacing: -0.01em; }
  .chip-meta { font-size: 10.5px; color: ${t.textMuted}; line-height: 1.4; }
  .chip-composed { font-size: 9.5px; color: ${t.textMuted}; font-family: 'JetBrains Mono', monospace; line-height: 1.35; margin-top: 2px; }

  /* ── Component preview cards ── */
  .preview-section { padding: 0 36px 60px; }
  .preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .preview-card {
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 14px;
    overflow: hidden; box-shadow: ${t.shadow};
    display: flex; flex-direction: column;
    transition: box-shadow 0.15s, transform 0.15s;
  }
  .preview-card:hover { box-shadow: ${t.shadowMd}; transform: translateY(-2px); }
  .preview-viewport {
    padding: 20px; background: ${t.bg};
    border-bottom: 1px solid ${t.border};
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .preview-meta { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 4px; }
  .preview-meta-top { display: flex; align-items: center; justify-content: space-between; }
  .preview-name { font-size: 13px; font-weight: 700; color: ${t.textMain}; letter-spacing: -0.01em; }
  .preview-composed { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: ${t.textMuted}; line-height: 1.4; }

  /* ── LLM Context box ── */
  .llm-section { padding: 0 36px 60px; }
  .llm-box {
    background: ${t.purpleBg}; border: 1px solid ${isDark ? "rgba(167,139,250,0.25)" : "rgba(124,58,237,0.18)"};
    border-radius: 14px; padding: 24px 28px;
  }
  .llm-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .llm-icon { font-size: 18px; }
  .llm-title { font-size: 15px; font-weight: 700; color: ${t.purple}; letter-spacing: -0.02em; }
  .llm-body { font-size: 13px; color: ${t.textMain}; line-height: 1.7; margin-bottom: 16px; }
  .llm-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .llm-chip {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.04em;
    color: ${t.purple};
    background: ${isDark ? "rgba(167,139,250,0.12)" : "rgba(124,58,237,0.08)"};
    border: 1px solid ${isDark ? "rgba(167,139,250,0.2)" : "rgba(124,58,237,0.15)"};
    padding: 4px 10px; border-radius: 5px;
  }

  /* ── Token palette ── */
  .palette-section { padding: 0 36px 60px; }
  .palette-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .swatch { height: 36px; border-radius: 7px; border: 1px solid ${t.border}; flex: 1; min-width: 40px; max-width: 70px; }
  .swatch-row { display: flex; flex-direction: column; gap: 4px; align-items: center; }
  .swatch-lbl { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: ${t.textMuted}; letter-spacing: 0.03em; }

  /* ── Back bar ── */
  .back-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 20px;
    background: ${t.surface}; border-bottom: 1px solid ${t.border};
    box-shadow: ${t.shadow};
    position: sticky; top: 0; z-index: 200;
  }
  .back-bar-l { display: flex; align-items: center; gap: 10px; }
  .back-btn {
    display: flex; align-items: center; gap: 6px;
    font-family: 'Inter', sans-serif; font-size: 12.5px; font-weight: 500;
    color: ${t.textMain}; background: ${t.surface}; border: 1px solid ${t.border};
    padding: 5px 11px; border-radius: 7px; cursor: pointer;
    transition: border-color 0.12s, background 0.12s;
  }
  .back-btn:hover { border-color: ${t.textMuted}; background: ${t.surfaceHover}; }
  .back-sep { color: ${t.textDisabled}; font-size: 13px; }
  .back-label { font-size: 13px; font-weight: 600; color: ${t.textMain}; letter-spacing: -0.01em; }
  .back-file { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${t.textMuted}; }

  /* ── Footer ── */
  .foot {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 36px; border-top: 1px solid ${t.border};
    font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${t.textMuted};
    letter-spacing: 0.04em;
  }
`;

// ─────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────
const Sun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const Moon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ExternalLink = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────
const WAVES = [
  {
    n: 1,
    name: "Atoms",
    subtitle: "Wave 1",
    file: "Deel_Atoms_Wave1.jsx",
    tag: "7 components · 20 variants",
    tagKey: "atoms",
    desc: "Foundation primitives — every higher-level component is assembled from these. All support light/dark mode, controlled & uncontrolled usage, disabled states, and validation.",
    ai: false,
    components: [
      { icon: "⌨️", name: "TextInput",      desc: "Single-line text field with label, validation, helper text" },
      { icon: "▾",  name: "DropdownSelect", desc: "Bordered select for job titles, departments, seniority" },
      { icon: "⬤",  name: "StatusBadge",    desc: "Compact pill — mandatory, new, completed, failed" },
      { icon: "◯",  name: "RadioOption",    desc: "Full-width tappable row with optional sublabel" },
      { icon: "▣",  name: "Buttons",        desc: "Primary / Secondary / Text — 3 sizes, loading, icons" },
      { icon: "◑",  name: "ToggleRow",      desc: "Bordered row with iOS-style toggle for binary settings" },
      { icon: "▭",  name: "SectionCard",   desc: "White rounded card with bold title + optional ⓘ button for form sections" },
    ],
  },
  {
    n: 2,
    name: "Molecules",
    subtitle: "Wave 2",
    file: "Deel_Molecules_Wave2.jsx",
    tag: "4 molecules",
    tagKey: "mol",
    desc: "Composed UI patterns that group atoms into reusable interactive units. Each molecule declares its atom dependencies explicitly.",
    ai: false,
    components: [
      { icon: "⊞", name: "FormFieldGroup",    desc: "Labelled group of 1–4 inputs with shared title & description" },
      { icon: "☰", name: "StepperRail",       desc: "Vertical progress rail — tracks completed, active, upcoming steps" },
      { icon: "💾", name: "AutosaveWidget",    desc: "Right-rail card — saved/saving state + delete draft CTA" },
      { icon: "ⓘ", name: "ContextBanner", desc: "Guide / Insight / Promo — unified contextual banner with 3 variants" },
    ],
  },
  {
    n: 3,
    name: "AI Molecules",
    subtitle: "Wave 3",
    file: "Deel_AIMolecules_Wave3.jsx",
    tag: "3 AI molecules",
    tagKey: "ai",
    desc: "AI-powered molecules that surface compliance intelligence and market data in real time. Designed to stream results incrementally as the model responds.",
    ai: true,
    components: [
      { icon: "✦", name: "ComplianceCheckCard",  desc: "Single rule row — checking shimmer, pass, warn, fail states" },
      { icon: "✦", name: "ComplianceCheckPanel", desc: "Full AI compliance widget with streaming card-by-card results" },
      { icon: "📊", name: "MarketRateChart",      desc: "Salary histogram with bubble, annual/monthly toggle, animations" },
    ],
  },
  {
    n: 4,
    name: "Blocks",
    subtitle: "Wave 4",
    file: "Deel_Blocks_Wave4.jsx",
    tag: "4 blocks · fully interactive",
    tagKey: "blocks",
    desc: "Full form sections — drop-in step content for the EOR creation flow. Each block is a self-contained, interactive unit combining multiple molecules.",
    ai: true,
    components: [
      { icon: "🧑‍💼", name: "AddPersonBlock",      desc: "Team info + personal details + workplace + org structure + hiring objective" },
      { icon: "📋", name: "JobDescriptionBlock",  desc: "Job title + seniority + scope textarea + AI compliance panel" },
      { icon: "💰", name: "CompensationBlock",    desc: "Employment type + salary + market rate chart + bonus slot" },
      { icon: "🏥", name: "BenefitsBlock",        desc: "Mandatory & optional benefits, country-aware warnings" },
    ],
  },
  {
    n: 5,
    name: "Flow",
    subtitle: "Wave 5",
    file: "Deel_Flow_Wave5.jsx",
    tag: "1 flow · 4 steps · all waves",
    tagKey: "flow",
    desc: "Full EOR contract creation orchestration — all atoms, molecules, AI molecules and blocks wired together into a complete navigation flow with autosave, stepper rail, and submission.",
    ai: true,
    components: [
      { icon: "🌊", name: "EORContractCreationFlow", desc: "4-step flow: Personal · Job · Compensation · Benefits → Submit" },
    ],
  },
];

const WAVE_COLORS = (t) => ({
  atoms:  { color: t.waveAtoms,  bg: t.waveAtomsBg  },
  mol:    { color: t.waveMol,    bg: t.waveMolBg    },
  ai:     { color: t.waveAI,     bg: t.waveAIBg     },
  blocks: { color: t.waveBlocks, bg: t.waveBlocksBg },
  flow:   { color: t.waveFlow,   bg: t.waveFlowBg   },
});

// ─────────────────────────────────────────────────────────────────
// INLINE MINI-PREVIEWS  (all inline styles — no class-name conflicts)
// ─────────────────────────────────────────────────────────────────
function MiniTextInput({ t }) {
  const [v, setV] = useState("EMP-2024-260");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, width:"100%" }}>
      <span style={{ fontFamily:"Inter,sans-serif", fontSize:11, fontWeight:600, color:t.textMain }}>
        Worker ID <span style={{ color:t.error }}>*</span>
      </span>
      <input
        style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, padding:"6px 9px", border:`1px solid ${t.border}`, borderRadius:7, background:t.inputBg, color:t.textMain, outline:"none", width:"100%" }}
        value={v} onChange={e => setV(e.target.value)}
      />
      <span style={{ fontFamily:"Inter,sans-serif", fontSize:10.5, color:t.textMuted }}>Auto-assigned from HR system</span>
    </div>
  );
}

function MiniDropdown({ t }) {
  const [v, setV] = useState("ea");
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, width:"100%" }}>
      <span style={{ fontFamily:"Inter,sans-serif", fontSize:11, fontWeight:600, color:t.textMain }}>Job title</span>
      <div style={{ position:"relative" }}>
        <select
          style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, padding:"6px 28px 6px 9px", border:`1px solid ${t.border}`, borderRadius:7, background:t.inputBg, color:t.textMain, appearance:"none", width:"100%" }}
          value={v} onChange={e => setV(e.target.value)}
        >
          <option value="ea">Executive Assistant</option>
          <option value="pm">Product Manager</option>
          <option value="eng">Engineer</option>
        </select>
        <span style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:t.textMuted, fontSize:12 }}>▾</span>
      </div>
    </div>
  );
}

function MiniStatusBadge({ t }) {
  const badges = [
    { label:"Mandatory", bg:t.mandatoryBg, color:t.mandatory },
    { label:"New",       bg:t.purpleBg,    color:t.purple    },
    { label:"Completed", bg:t.successBg,   color:t.success   },
    { label:"Failed",    bg:t.errorBg,     color:t.error     },
  ];
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      {badges.map(b => (
        <span key={b.label} style={{ display:"inline-flex", alignItems:"center", gap:5, fontFamily:"Inter,sans-serif", fontSize:11, fontWeight:600, color:b.color, background:b.bg, padding:"3px 8px", borderRadius:999 }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:b.color, flexShrink:0 }} />
          {b.label}
        </span>
      ))}
    </div>
  );
}

function MiniRadioOption({ t }) {
  const [v, setV] = useState("full");
  const row = (val, label, sub) => {
    const on = v === val;
    return (
      <button key={val} type="button" onClick={() => setV(val)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", border:`1.5px solid ${on ? t.primary : t.border}`, borderRadius:8, background:on ? t.surface : t.bg, cursor:"pointer", width:"100%", textAlign:"left", fontFamily:"Inter,sans-serif" }}>
        <div style={{ width:16, height:16, borderRadius:"50%", border:`1.5px solid ${on ? t.primary : t.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {on && <div style={{ width:7, height:7, borderRadius:"50%", background:t.primary }} />}
        </div>
        <div>
          <div style={{ fontSize:12.5, fontWeight:600, color:t.textMain }}>{label}</div>
          {sub && <div style={{ fontSize:11, color:t.textMuted }}>{sub}</div>}
        </div>
      </button>
    );
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, width:"100%" }}>
      {row("full", "Full-time")}
      {row("part", "Part-time", "Reduced hours arrangement")}
    </div>
  );
}

function MiniButtons({ t }) {
  const base = { fontFamily:"Inter,sans-serif", fontWeight:500, borderRadius:8, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:5, fontSize:12.5, padding:"7px 14px" };
  return (
    <div style={{ display:"flex", gap:7, flexWrap:"wrap", alignItems:"center" }}>
      <button type="button" style={{ ...base, background:t.primary, color:t.btnText, border:`1px solid ${t.primary}` }}>Continue</button>
      <button type="button" style={{ ...base, background:"transparent", color:t.textMain, border:`1px solid ${t.border}` }}>Cancel</button>
      <button type="button" style={{ ...base, background:"transparent", color:t.textMuted, border:"none", padding:"7px 6px", textDecoration:"underline", fontSize:12 }}>Learn more</button>
    </div>
  );
}

function MiniToggleRow({ t }) {
  const [on, setOn] = useState(false);
  return (
    <div
      onClick={() => setOn(v => !v)}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"10px 12px", border:`1px solid ${on ? t.textMuted : t.border}`, borderRadius:8, background:t.surface, cursor:"pointer", userSelect:"none", width:"100%" }}
    >
      <div>
        <div style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, fontWeight:500, color:t.textMain }}>I don&rsquo;t know the worker&rsquo;s personal details yet</div>
        <div style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:t.textMuted, marginTop:2 }}>Get a cost estimate without providing worker details</div>
      </div>
      <div style={{ width:32, height:18, borderRadius:999, background: on ? t.primary : t.border, position:"relative", flexShrink:0, transition:"background .18s" }}>
        <div style={{ position:"absolute", top:2, left: on ? 14 : 2, width:14, height:14, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,0.25)", transition:"left .18s" }} />
      </div>
    </div>
  );
}

function MiniSectionCard({ t }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: "16px 16px 18px", boxShadow: t.shadow, display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 13.5, fontWeight: 600, color: t.textMain, letterSpacing: "-.01em" }}>Team information</span>
        <button type="button" style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: 2, borderRadius: 5 }} aria-label="More information">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="6.5" />
            <line x1="8" y1="7.5" x2="8" y2="11" />
            <circle cx="8" cy="5.5" r=".8" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ height: 28, borderRadius: 7, background: t.border, opacity: 0.5 }} />
        <div style={{ height: 28, borderRadius: 7, background: t.border, opacity: 0.5 }} />
      </div>
    </div>
  );
}

function MiniFormFieldGroup({ t }) {
  const inputS = { fontFamily:"Inter,sans-serif", fontSize:12, padding:"6px 9px", border:`1px solid ${t.border}`, borderRadius:7, background:t.inputBg, color:t.textMain, width:"100%" };
  const labelS = { fontFamily:"Inter,sans-serif", fontSize:10.5, fontWeight:600, color:t.textMain, marginBottom:4, display:"block" };
  return (
    <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:14, width:"100%" }}>
      <div style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, fontWeight:700, color:t.textMain, marginBottom:2 }}>Personal details</div>
      <div style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:t.textMuted, marginBottom:12 }}>Worker's basic information</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <div><span style={labelS}>First name</span><input style={inputS} defaultValue="Elena" /></div>
        <div><span style={labelS}>Last name</span><input style={inputS} defaultValue="Torres" /></div>
      </div>
    </div>
  );
}

function MiniStepperRail({ t }) {
  const steps = ["Personal details", "Job details", "Compensation", "Benefits"];
  const current = 2;
  return (
    <div style={{ display:"flex", flexDirection:"column", paddingLeft:4 }}>
      {steps.map((s, i) => {
        const done = i + 1 < current, active = i + 1 === current;
        return (
          <div key={s} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
              <div style={{ width:22, height:22, borderRadius:"50%", border:`1.5px solid ${done ? t.success : active ? t.primary : t.border}`, background:done ? t.successBg : active ? t.surface : t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10.5, fontWeight:600, color:done ? t.success : active ? t.primary : t.textDisabled }}>
                {done ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && <div style={{ width:1.5, height:16, background:done ? t.success : t.border, margin:"2px 0" }} />}
            </div>
            <div style={{ paddingTop:3 }}>
              <div style={{ fontFamily:"Inter,sans-serif", fontSize:11.5, fontWeight:active ? 600 : 400, color:active ? t.textMain : t.textMuted }}>{s}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniAutosave({ t }) {
  return (
    <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:14, width:"100%" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
        <div style={{ width:18, height:18, borderRadius:"50%", background:t.infoBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:t.info, fontWeight:700 }}>i</div>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, fontWeight:600, color:t.textMain }}>Draft saved</span>
      </div>
      <div style={{ fontFamily:"Inter,sans-serif", fontSize:11.5, color:t.textMuted, marginBottom:10, lineHeight:1.5 }}>Your progress is saved automatically as you fill in each step.</div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:t.success }} />
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:t.textMuted }}>Saved just now</span>
      </div>
      <button type="button" style={{ fontFamily:"Inter,sans-serif", fontSize:11.5, fontWeight:500, color:t.textMain, background:"transparent", border:`1px solid ${t.border}`, borderRadius:7, padding:"5px 10px", cursor:"pointer", width:"100%" }}>Delete draft</button>
    </div>
  );
}

function MiniContextBanner({ t }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return (
    <button type="button" style={{ fontFamily:"Inter,sans-serif", fontSize:11.5, color:t.info, background:"transparent", border:"none", cursor:"pointer" }} onClick={() => setDismissed(false)}>↩ Restore</button>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7, width:"100%" }}>
      {/* guide */}
      <div style={{ background:t.infoBg, border:"1px solid #BFDBFE", borderRadius:10, padding:"10px 13px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
          <span style={{ fontSize:14 }}>🌍🇺🇸</span>
          <div style={{ fontFamily:"Inter,sans-serif", fontSize:11.5, color:t.textMain, lineHeight:1.4 }}>View Deel’s hiring guide for <strong>US</strong>. <span style={{ color:t.info, fontWeight:500 }}>View ↗</span></div>
        </div>
        <button type="button" onClick={() => setDismissed(true)} style={{ background:"none", border:"none", cursor:"pointer", color:t.textMuted, fontSize:14, padding:2 }}>×</button>
      </div>
      {/* insight */}
      <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:10, padding:"10px 13px", display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:26, height:26, borderRadius:6, background:"#EDE9FE", color:"#7C3AED", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>✶</div>
        <div style={{ fontFamily:"Inter,sans-serif", fontSize:11.5, color:t.textMain, lineHeight:1.4 }}><strong style={{ color:"#6D28D9" }}>Deel Insight:</strong> Severance in the US ranges 0–26 weeks. <span style={{ color:t.info, fontWeight:500 }}>Learn more ↗</span></div>
      </div>
      {/* promo */}
      <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"Inter,sans-serif", fontSize:12, fontWeight:700, color:t.textMain, marginBottom:2 }}>Foreign Entity Setup</div>
          <div style={{ fontFamily:"Inter,sans-serif", fontSize:11.5, color:t.textMuted }}>Set up entities with Deel.</div>
          <div style={{ marginTop:6 }}><span style={{ fontFamily:"Inter,sans-serif", fontSize:11, fontWeight:500, padding:"4px 9px", border:`1px solid ${t.border}`, borderRadius:5, color:t.textMain, display:"inline-block" }}>Learn more ↗</span></div>
        </div>
        <span style={{ fontSize:22 }}>🌍🏢</span>
      </div>
    </div>
  );
}

function MiniComplianceCard({ t }) {
  const rows = [
    { rule:"Job scope should not include hiring language.", status:"pass" },
    { rule:"Scope should be relevant to the job title.",   status:"fail", detail:"Duties relate to customer success, not executive assistance." },
    { rule:"Scope should not reference reporting lines.",  status:"warn" },
  ];
  const cfg = {
    pass: { bg:t.successBg,   color:t.success,   label:"Pass" },
    fail: { bg:t.errorBg,     color:t.error,     label:"Fail" },
    warn: { bg:t.mandatoryBg, color:t.mandatory, label:"Warn" },
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, width:"100%" }}>
      {rows.map((r, i) => {
        const c = cfg[r.status];
        return (
          <div key={i} style={{ background:c.bg, border:`1px solid ${c.color}25`, borderRadius:8, padding:"7px 10px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
              <span style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:t.textMain, flex:1, lineHeight:1.4 }}>{r.rule}</span>
              <span style={{ fontFamily:"Inter,sans-serif", fontSize:9.5, fontWeight:600, color:c.color, background:c.bg, border:`1px solid ${c.color}40`, borderRadius:5, padding:"1px 6px", flexShrink:0 }}>{c.label}</span>
            </div>
            {r.detail && <div style={{ fontFamily:"Inter,sans-serif", fontSize:10.5, color:t.textMuted, marginTop:3, lineHeight:1.4 }}>{r.detail}</div>}
          </div>
        );
      })}
    </div>
  );
}

function MiniCompliancePanel({ t }) {
  return (
    <div style={{ background:t.purpleBg, border:`1px solid ${t.purple}30`, borderRadius:10, padding:14, width:"100%" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ color:t.purple }}>✦</span>
          <span style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, fontWeight:700, color:t.purple }}>AI compliance check</span>
        </div>
        <button type="button" style={{ fontFamily:"Inter,sans-serif", fontSize:11, fontWeight:600, color:t.btnText, background:t.purple, border:"none", borderRadius:7, padding:"4px 10px", cursor:"pointer" }}>Run check</button>
      </div>
      <MiniComplianceCard t={t} />
    </div>
  );
}

function MiniMarketChart({ t }) {
  const bars = [12,22,38,52,68,82,78,60,42,28,16,8];
  const peak = Math.max(...bars);
  const activeIdx = 7;
  return (
    <div style={{ width:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:11.5, fontWeight:600, color:t.textMain }}>Market rate · United States</span>
        <div style={{ display:"flex", gap:3 }}>
          {["Annual","Monthly"].map((l,i) => (
            <button key={l} type="button" style={{ fontFamily:"Inter,sans-serif", fontSize:10.5, fontWeight:500, padding:"3px 8px", borderRadius:6, border:`1px solid ${t.border}`, background:i===0 ? t.primary : t.surface, color:i===0 ? t.btnText : t.textMuted, cursor:"pointer" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:52, marginBottom:6, position:"relative" }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex:1, borderRadius:"3px 3px 0 0", height:`${(h/peak)*100}%`, background:i===activeIdx ? t.primary : t.border, position:"relative" }}>
            {i===activeIdx && (
              <div style={{ position:"absolute", bottom:"calc(100% + 4px)", left:"50%", transform:"translateX(-50%)", background:t.primary, color:t.btnText, fontFamily:"Inter,sans-serif", fontSize:9, fontWeight:600, padding:"2px 5px", borderRadius:4, whiteSpace:"nowrap" }}>$77,293</div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Inter,sans-serif", fontSize:10, color:t.textMuted }}>
        <span>Low</span><span>Median</span><span>High</span>
      </div>
    </div>
  );
}

function MiniAddPersonBlock({ t }) {
  const inputS  = { fontFamily:"Inter,sans-serif", fontSize:11.5, padding:"5px 8px", border:`1px solid ${t.border}`, borderRadius:7, background:t.inputBg, color:t.textMain, width:"100%" };
  const labelS  = { fontFamily:"Inter,sans-serif", fontSize:10.5, fontWeight:600, color:t.textMain, marginBottom:3, display:"block" };
  const cardS   = { background:t.surface, border:`1px solid ${t.border}`, borderRadius:10, padding:"10px 12px", display:"flex", flexDirection:"column", gap:7 };
  const titleS  = { fontFamily:"Inter,sans-serif", fontSize:12, fontWeight:700, color:t.textMain };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, width:"100%" }}>
      <div style={cardS}>
        <span style={titleS}>Team information</span>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
          <div><span style={labelS}>Entity <span style={{ color:t.error }}>*</span></span><select style={inputS}><option>Deel Inc.</option></select></div>
          <div><span style={labelS}>Group</span><select style={inputS}><option>Global Ops</option></select></div>
        </div>
      </div>
      <div style={cardS}>
        <span style={titleS}>Personal details</span>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
          <div><span style={labelS}>Country <span style={{ color:t.error }}>*</span></span><select style={inputS}><option>United States</option></select></div>
          <div><span style={labelS}>State</span><select style={inputS}><option>California</option></select></div>
        </div>
      </div>
      <div style={{ background:t.purpleBg, border:`1px solid ${t.purple}30`, borderRadius:8, padding:"7px 10px" }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:t.purple }}>✦ Invite link will be sent when contract is activated</span>
      </div>
    </div>
  );
}

function MiniJobDescBlock({ t }) {
  const inputS = { fontFamily:"Inter,sans-serif", fontSize:11.5, padding:"5px 8px", border:`1px solid ${t.border}`, borderRadius:7, background:t.inputBg, color:t.textMain, width:"100%" };
  const labelS = { fontFamily:"Inter,sans-serif", fontSize:10.5, fontWeight:600, color:t.textMain, marginBottom:3, display:"block" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, width:"100%" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <div><span style={labelS}>Job title</span><select style={inputS}><option>Executive Assistant</option></select></div>
        <div><span style={labelS}>Seniority</span><select style={inputS}><option>Mid (IC Level 2)</option></select></div>
      </div>
      <div>
        <span style={labelS}>Job scope <span style={{ color:t.error }}>*</span></span>
        <textarea style={{ ...inputS, height:52, resize:"none", lineHeight:1.5 }} defaultValue="Manage executive calendars, coordinate travel arrangements..." />
      </div>
      <div style={{ background:t.purpleBg, border:`1px solid ${t.purple}30`, borderRadius:8, padding:"8px 10px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:t.purple }}>✦ AI compliance check ready</span>
        <button type="button" style={{ fontFamily:"Inter,sans-serif", fontSize:10.5, fontWeight:600, color:t.btnText, background:t.purple, border:"none", borderRadius:6, padding:"3px 9px", cursor:"pointer" }}>Run</button>
      </div>
    </div>
  );
}

function MiniCompensation({ t }) {
  const [empType, setEmpType] = useState("full");
  const [salary, setSalary] = useState("77,293");
  const empRow = (val, label) => {
    const on = empType === val;
    return (
      <button key={val} type="button" onClick={() => setEmpType(val)} style={{ flex:1, display:"flex", alignItems:"center", gap:6, padding:"6px 10px", border:`1.5px solid ${on ? t.primary : t.border}`, borderRadius:7, background:on ? t.surface : t.bg, cursor:"pointer", fontFamily:"Inter,sans-serif", fontSize:12 }}>
        <div style={{ width:13, height:13, borderRadius:"50%", border:`1.5px solid ${on ? t.primary : t.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {on && <div style={{ width:6, height:6, borderRadius:"50%", background:t.primary }} />}
        </div>
        <span style={{ color:t.textMain, fontWeight:on ? 600 : 400 }}>{label}</span>
      </button>
    );
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, width:"100%" }}>
      <div style={{ display:"flex", gap:6 }}>{empRow("full","Full-time")}{empRow("part","Part-time")}</div>
      <div style={{ display:"flex", alignItems:"center" }}>
        <div style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, fontWeight:600, color:t.textMain, background:t.bg, border:`1px solid ${t.border}`, borderRight:"none", padding:"5px 9px", borderRadius:"7px 0 0 7px" }}>$</div>
        <input value={salary} onChange={e => setSalary(e.target.value)} style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, padding:"5px 9px", border:`1px solid ${t.border}`, borderLeft:"none", borderRight:"none", background:t.inputBg, color:t.textMain, flex:1 }} />
        <div style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, fontWeight:600, color:t.textMain, background:t.bg, border:`1px solid ${t.border}`, borderLeft:"none", padding:"5px 9px", borderRadius:"0 7px 7px 0" }}>USD</div>
      </div>
      <MiniMarketChart t={t} />
    </div>
  );
}

function MiniBenefits({ t }) {
  const [added, setAdded] = useState({ hc:false, pen:false, tr:false });
  const toggle = key => setAdded(a => ({ ...a, [key]: !a[key] }));
  const card = (key, icon, name, mandatory, desc) => (
    <div key={key} style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:9, padding:"10px 12px", display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:32, height:32, borderRadius:8, background:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
          <span style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, fontWeight:700, color:t.textMain }}>{name}</span>
          {mandatory && <span style={{ fontFamily:"Inter,sans-serif", fontSize:9.5, fontWeight:600, color:t.mandatory, background:t.mandatoryBg, padding:"1px 6px", borderRadius:999 }}>Mandatory</span>}
        </div>
        <div style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:t.textMuted }}>{desc}</div>
      </div>
      <button type="button" onClick={() => toggle(key)} style={{ fontFamily:"Inter,sans-serif", fontSize:11, fontWeight:600, flexShrink:0, padding:"4px 10px", borderRadius:7, cursor:"pointer", border:`1px solid ${added[key] ? t.success : t.border}`, background:added[key] ? t.successBg : t.surface, color:added[key] ? t.success : t.textMain }}>
        {added[key] ? "Added ✓" : "Add"}
      </button>
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, width:"100%" }}>
      {card("hc",  "🏥", "Healthcare",      true,  "Medical, dental & vision")}
      {card("pen", "💼", "Pension plan",     true,  "401(k) with employer match")}
      {card("tr",  "✈️", "Travel insurance", false, "Global coverage included")}
    </div>
  );
}

function MiniFlow({ t, onOpen }) {
  const steps = ["Personal","Job details","Compensation","Benefits"];
  return (
    <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:12, overflow:"hidden", width:"100%" }}>
      <div style={{ background:t.bg, padding:"8px 14px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:5 }}>{["#E4E4E7","#E4E4E7","#E4E4E7"].map((c,i) => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:c }} />)}</div>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:t.textMuted, letterSpacing:"0.06em" }}>EOR Contract Creation</span>
        <span />
      </div>
      <div style={{ display:"flex" }}>
        <div style={{ width:114, borderRight:`1px solid ${t.border}`, padding:"12px 10px", display:"flex", flexDirection:"column" }}>
          {steps.map((s, i) => {
            const done = i < 1, active = i === 1;
            return (
              <div key={s} style={{ display:"flex", alignItems:"flex-start", gap:6 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", border:`1.5px solid ${done?t.success:active?t.primary:t.border}`, background:done?t.successBg:active?t.surface:t.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:done?t.success:active?t.primary:t.textDisabled }}>
                    {done?"✓":i+1}
                  </div>
                  {i < steps.length-1 && <div style={{ width:1, height:14, background:done?t.success:t.border }} />}
                </div>
                <div style={{ fontFamily:"Inter,sans-serif", fontSize:10, fontWeight:active?600:400, color:active?t.textMain:t.textMuted, paddingTop:1 }}>{s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ flex:1, padding:14, display:"flex", flexDirection:"column", justifyContent:"space-between", minHeight:120 }}>
          <div>
            <div style={{ fontFamily:"Inter,sans-serif", fontSize:12.5, fontWeight:700, color:t.textMain, marginBottom:3 }}>Job details</div>
            <div style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:t.textMuted, marginBottom:10, lineHeight:1.4 }}>Describe the role and responsibilities.</div>
            <div style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:7, height:28 }} />
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:12 }}>
            <button type="button" style={{ fontFamily:"Inter,sans-serif", fontSize:11, color:t.textMuted, background:"transparent", border:`1px solid ${t.border}`, borderRadius:7, padding:"4px 10px", cursor:"pointer" }}>← Back</button>
            <button type="button" onClick={onOpen} style={{ fontFamily:"Inter,sans-serif", fontSize:11, fontWeight:600, color:t.btnText, background:t.primary, border:"none", borderRadius:7, padding:"4px 10px", cursor:"pointer" }}>Open full flow ↗</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const COMPONENT_PREVIEWS = (t, openDemo) => [
  { name:"TextInput",              wave:"Wave 1", waveKey:"atoms",  composed:"atom",                                            preview:<MiniTextInput t={t} /> },
  { name:"DropdownSelect",         wave:"Wave 1", waveKey:"atoms",  composed:"atom",                                            preview:<MiniDropdown t={t} /> },
  { name:"StatusBadge",            wave:"Wave 1", waveKey:"atoms",  composed:"atom",                                            preview:<MiniStatusBadge t={t} /> },
  { name:"RadioOption",            wave:"Wave 1", waveKey:"atoms",  composed:"atom",                                            preview:<MiniRadioOption t={t} /> },
  { name:"Buttons",                wave:"Wave 1", waveKey:"atoms",  composed:"Primary · Secondary · Text",                      preview:<MiniButtons t={t} /> },
  { name:"ToggleRow",              wave:"Wave 1", waveKey:"atoms",  composed:"atom",                                            preview:<MiniToggleRow t={t} /> },
  { name:"SectionCard",            wave:"Wave 1", waveKey:"atoms",  composed:"atom",                                            preview:<MiniSectionCard t={t} /> },
  { name:"FormFieldGroup",         wave:"Wave 2", waveKey:"mol",    composed:"TextInput × n + DropdownSelect × n",              preview:<MiniFormFieldGroup t={t} /> },
  { name:"StepperRail",            wave:"Wave 2", waveKey:"mol",    composed:"StepIndicator + connector + StatusBadge",         preview:<MiniStepperRail t={t} /> },
  { name:"AutosaveWidget",         wave:"Wave 2", waveKey:"mol",    composed:"InfoIcon + status dot + SecondaryButton",         preview:<MiniAutosave t={t} /> },
  { name:"ContextBanner",          wave:"Wave 2", waveKey:"mol",    composed:"guide / insight / promo variants",                  preview:<MiniContextBanner t={t} /> },
  { name:"ComplianceCheckCard",    wave:"Wave 3", waveKey:"ai",     composed:"rule text + StatusBadge + detail line",           preview:<MiniComplianceCard t={t} /> },
  { name:"ComplianceCheckPanel",   wave:"Wave 3", waveKey:"ai",     composed:"AI banner + CheckCard × n + shimmer",             preview:<MiniCompliancePanel t={t} /> },
  { name:"MarketRateChart",        wave:"Wave 3", waveKey:"ai",     composed:"period toggle + histogram + bubble + axis",       preview:<MiniMarketChart t={t} /> },
  { name:"AddPersonBlock",         wave:"Wave 4", waveKey:"blocks", composed:"SectionCard × 5 + DropdownSelect + TextInput + ToggleRow + ContextBanner", preview:<MiniAddPersonBlock t={t} /> },
  { name:"JobDescriptionBlock",    wave:"Wave 4", waveKey:"blocks", composed:"Select × 3 + Textarea + ComplianceCheckPanel",    preview:<MiniJobDescBlock t={t} /> },
  { name:"CompensationBlock",      wave:"Wave 4", waveKey:"blocks", composed:"RadioOption × 2 + SalaryInput + MarketRateChart", preview:<MiniCompensation t={t} /> },
  { name:"BenefitsBlock",          wave:"Wave 4", waveKey:"blocks", composed:"BenefitCard × n + StatusBadge + MandatoryBanner", preview:<MiniBenefits t={t} /> },
  { name:"EORContractCreationFlow",wave:"Wave 5", waveKey:"flow",   composed:"All blocks + StepperRail + AutosaveWidget",       preview:<MiniFlow t={t} onOpen={() => openDemo(5)} /> },
];

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────
const BackArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

// ── Domain ordering for the catalog tabs ──
const DOMAINS = [
  "All",
  "Forms",
  "Actions",
  "Status & Feedback",
  "Navigation",
  "Compliance",
  "Market Intelligence",
  "Blocks",
  "Flows",
];

const TIER_COLORS = {
  atom:         { color: "#2563EB", bg: "#EFF6FF" },
  molecule:     { color: "#059669", bg: "#ECFDF5" },
  "ai-molecule":{ color: "#7C3AED", bg: "#F5F3FF" },
  block:        { color: "#D97706", bg: "#FFFBEB" },
  flow:         { color: "#18181B", bg: "#F4F4F5" },
};

// ── Per-component demo canvases ─────────────────────────────────
// Each entry renders the component in an isolated, appropriately-sized
// container so teams and LLMs see exactly how it behaves standalone.
const COMPONENT_DEMOS = {
  // Forms
  TextInput: (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 400 }}>
      <TextInput label="Worker ID" placeholder="e.g. EMP-2024-260" required />
      <TextInput label="Email address" placeholder="worker@company.com" helperText="Used for contract delivery" />
      <TextInput label="Validation error" value="bad input" error helperText="This field contains an invalid value" />
      <TextInput label="Disabled field" value="Read only" disabled />
    </div>
  ),
  DropdownSelect: (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 400 }}>
      <DropdownSelect label="Job title" options={[
        { value: "ea",  label: "Executive Assistant" },
        { value: "pm",  label: "Product Manager" },
        { value: "swe", label: "Software Engineer" },
      ]} />
      <DropdownSelect label="Seniority" optional options={[
        { value: "jun", label: "Junior (IC Level 1)" },
        { value: "mid", label: "Mid (IC Level 2)" },
        { value: "sen", label: "Senior (IC Level 3)" },
      ]} />
      <DropdownSelect label="Country" placeholder="Select country…" options={[
        { value: "us", label: "United States" },
        { value: "de", label: "Germany" },
        { value: "gb", label: "United Kingdom" },
      ]} disabled />
    </div>
  ),
  RadioOption: (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
      <RadioOption label="Full-time"  sublabel="40 hrs/week · standard contract" selected />
      <RadioOption label="Part-time"  sublabel="Custom hours · flexible contract" />
      <RadioOption label="Contractor" sublabel="1099 / B2B" disabled />
    </div>
  ),
  ToggleRow: (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480 }}>
      <ToggleRow
        label="I don't know the worker's personal details yet"
        description="Get a cost estimate without providing worker details"
      />
      <ToggleRow
        label="Send onboarding invitation immediately"
        description="Worker will receive an email to complete their profile"
        checked
      />
      <ToggleRow
        label="Override compliance warnings"
        description="Disabled — only available to contract admins"
        disabled
      />
    </div>
  ),
  SectionCard: (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 520 }}>
      <SectionCard title="Team information">
        <TextInput label="Entity" placeholder="Select entity" />
        <TextInput label="Group" placeholder="Select group" />
      </SectionCard>
      <SectionCard
        title="Employee personal details"
        onInfoClick={() => alert('These details appear on the EOR contract.')}
      >
        <TextInput label="First name" required placeholder="Alex" />
        <TextInput label="Last name" required placeholder="Johnson" />
      </SectionCard>
      <SectionCard title="No children (title only)" />
    </div>
  ),
  FormFieldGroup: (
    <div style={{ maxWidth: 560 }}>
      <FormFieldGroup
        title="Workplace information"
        description="These details appear on the EOR contract and cannot be changed after signing."
        columns={2}
        fields={[
          { type: "text",   label: "First name", required: true,  placeholder: "Alex" },
          { type: "text",   label: "Last name",  required: true,  placeholder: "Johnson" },
          { type: "text",   label: "Worker ID",  value: "EMP-2024-260" },
          { type: "select", label: "Department", optional: true,
            options: [
              { value: "eng", label: "Engineering" },
              { value: "ops", label: "Operations" },
              { value: "fin", label: "Finance" },
            ]},
          { type: "text",   label: "Email",      placeholder: "worker@company.com", error: true, helperText: "Invalid email address" },
          { type: "select", label: "Start date", options: [] },
        ]}
      />
    </div>
  ),

  // Actions
  Buttons: (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#A1A1AA", fontFamily: "'JetBrains Mono',monospace", marginBottom: 10 }}>Primary</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <PrimaryButton label="Continue" />
          <PrimaryButton label="Small" size="sm" />
          <PrimaryButton label="Large" size="lg" />
          <PrimaryButton label="Loading…" loading />
          <PrimaryButton label="Disabled" disabled />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#A1A1AA", fontFamily: "'JetBrains Mono',monospace", marginBottom: 10 }}>Secondary</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <SecondaryButton label="Run check" />
          <SecondaryButton label="Small" size="sm" />
          <SecondaryButton label="Large" size="lg" />
          <SecondaryButton label="Loading…" loading />
          <SecondaryButton label="Disabled" disabled />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#A1A1AA", fontFamily: "'JetBrains Mono',monospace", marginBottom: 10 }}>Text</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
          <TextButton label="Learn more" />
          <TextButton label="View hiring guide" />
          <TextButton label="Disabled" disabled />
        </div>
      </div>
    </div>
  ),

  // Status & Feedback
  StatusBadge: (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      <StatusBadge variant="mandatory" />
      <StatusBadge variant="new" />
      <StatusBadge variant="completed" />
      <StatusBadge variant="failed" />
      <StatusBadge variant="mandatory" label="Required by law" />
      <StatusBadge variant="completed" label="Job details" />
      <StatusBadge variant="new" dot={false} label="Feature preview" />
    </div>
  ),
  AutosaveWidget: (
    <div style={{ maxWidth: 280 }}>
      <AutosaveWidget status="saved" lastSaved="2 minutes ago" />
    </div>
  ),
  ContextBanner: (
    <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 12 }}>
      <ContextBanner variant="guide" country="United States" />
      <ContextBanner variant="insight" body="Severance in the United States typically ranges from 0–26 weeks depending on tenure." />
      <ContextBanner variant="promo" title="Foreign Entity Setup" body="Set up a foreign entity with Deel — we handle compliance, payroll, and local filings." />
    </div>
  ),

  // Navigation
  StepperRail: (
    <div style={{ maxWidth: 260 }}>
      <StepperRail
        steps={[
          { label: "Personal details" },
          { label: "Job details" },
          { label: "Compensation and dates" },
          { label: "Benefits and extras" },
        ]}
        currentStep={2}
      />
    </div>
  ),

  // Compliance
  ComplianceCheckCard: (
    <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 8 }}>
      <ComplianceCheckCard rule="Job scope should be relevant to the job title."                          status="pass" />
      <ComplianceCheckCard rule="Job scope should not include recruiting or hiring language."             status="warn"     detail="Indirect reference detected — consider rephrasing." />
      <ComplianceCheckCard rule="Job scope should not include required education requirements."           status="fail"     detail="The phrase 'must have a degree' was detected and must be removed." />
      <ComplianceCheckCard rule="Job scope should not reference reporting lines."                        status="checking" />
    </div>
  ),
  ComplianceCheckPanel: (
    <div style={{ maxWidth: 600 }}>
      <ComplianceCheckPanel
        results={[
          { rule: "Job scope should be relevant to the job title.",                status: "fail", detail: "The described duties relate to customer success, not executive assistance." },
          { rule: "Job scope should not include recruiting or hiring language.",    status: "pass" },
          { rule: "Job scope should not reference reporting lines.",                status: "warn", detail: "Indirect reference detected — consider rephrasing." },
          { rule: "Job scope should not include education requirements.",           status: "pass" },
        ]}
      />
    </div>
  ),

  // Market Intelligence
  MarketRateChart: (
    <div style={{ maxWidth: 560 }}>
      <MarketRateChart salary={77293.01} period="annual" country="United States" seniority="Mid" jobTitle="Executive Assistant" />
    </div>
  ),

  // Blocks
  AddPersonBlock:       <div style={{ maxWidth: 700 }}><AddPersonBlock /></div>,
  JobDescriptionBlock: <div style={{ maxWidth: 700 }}><JobDescriptionBlock /></div>,
  CompensationBlock:   <div style={{ maxWidth: 700 }}><CompensationBlock /></div>,
  BenefitsBlock:       <div style={{ maxWidth: 700 }}><BenefitsBlock /></div>,

  // Flows
  EORContractCreationFlow: <EORContractCreationFlow />,
};

// ─────────────────────────────────────────────────────────────────
// PLAYGROUND HELPERS
// ─────────────────────────────────────────────────────────────────

/** Map a COMPONENT_MANIFEST prop type string to a control kind. */
function inferControlType(typeStr) {
  const s = (typeStr || "").trim();
  if (s === "boolean") return { kind: "toggle" };
  if (s === "string")  return { kind: "text" };
  if (s === "number")  return { kind: "number" };
  if (s.includes("|")) {
    const parts = s.split("|").map(p => p.trim());
    const allQuoted = parts.every(p => /^['"].*['"]$/.test(p));
    if (allQuoted) return { kind: "select", options: parts.map(p => p.replace(/^['"]|['"]$/g, "")) };
  }
  return null; // ReactNode, function, complex array → skip
}

/** Render a control widget inline (returns JSX). */
function renderControlWidget(propName, control, value, setProp, t) {
  const inputBase = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
    padding: "5px 9px", borderRadius: 7,
    border: `1px solid ${t.border}`,
    background: t.inputBg || t.bg, color: t.textMain, outline: "none",
  };
  switch (control.kind) {
    case "toggle": {
      const on = Boolean(value);
      return (
        <button
          type="button"
          aria-checked={on}
          onClick={() => setProp(propName, !on)}
          style={{
            display: "flex", alignItems: "center", flexShrink: 0,
            background: on ? t.primary : t.surfaceHover,
            border: `1.5px solid ${on ? t.primary : t.border}`,
            borderRadius: 999, padding: 2, cursor: "pointer",
            width: 40, height: 22, transition: "background .15s, border-color .15s",
          }}
        >
          <div style={{
            width: 16, height: 16, borderRadius: "50%",
            background: on ? t.btnText : t.textDisabled,
            transform: on ? "translateX(18px)" : "translateX(0)",
            transition: "transform .15s",
          }} />
        </button>
      );
    }
    case "select": {
      const { background: bgColor, ...inputBaseRest } = inputBase;
      return (
        <select
          value={value ?? control.options[0]}
          onChange={e => setProp(propName, e.target.value)}
          style={{
            ...inputBaseRest, backgroundColor: bgColor, appearance: "none", minWidth: 130,
            paddingRight: 26,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2371717A' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center",
          }}
        >
          {control.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    case "text":
      return (
        <input
          type="text"
          value={value ?? ""}
          onChange={e => setProp(propName, e.target.value)}
          style={{ ...inputBase, minWidth: 160 }}
        />
      );
    case "number":
      return (
        <input
          type="number"
          value={value ?? 0}
          onChange={e => setProp(propName, Number(e.target.value))}
          style={{ ...inputBase, width: 100 }}
        />
      );
    default:
      return null;
  }
}

/** Build a formatted JSX snippet from current prop values. */
function generatePlaygroundCode(name, props) {
  const entries = Object.entries(props).filter(([, v]) => v !== false && v !== "" && v !== null && v !== undefined);
  if (!entries.length) return `<${name} />`;
  const lines = entries.map(([k, v]) => {
    if (v === true) return `  ${k}`;
    if (typeof v === "string") return `  ${k}="${v}"`;
    if (Array.isArray(v)) {
      const inner = v.map(item => `    ${JSON.stringify(item)}`).join(",\n");
      return `  ${k}={[\n${inner}\n  ]}`;
    }
    return `  ${k}={${JSON.stringify(v)}}`;
  });
  return `<${name}\n${lines.join("\n")}\n/>`;
}

/** Minimal JSX syntax colouring — returns an array of React spans. */
function syntaxHighlightCode(code, t) {
  return code.split("\n").map((line, li) => {
    if (!line.trim()) return <span key={li}>{"\n"}</span>;

    // Opening tag line  <ComponentName
    const openTag = line.match(/^(<)([\w]+)(.*)$/);
    if (openTag) return (
      <span key={li}>
        <span style={{ color: t.purple }}>{openTag[1]}{openTag[2]}</span>
        <span style={{ color: t.textMuted }}>{openTag[3]}</span>
        {"\n"}
      </span>
    );

    // Closing />
    if (line.trim() === "/>") return <span key={li}><span style={{ color: t.purple }}>{line}</span>{"\n"}</span>;

    const indent = line.match(/^(\s*)/)?.[1] || "";
    const body   = line.trimStart();

    // Boolean prop   propName
    const boolProp = body.match(/^([\w]+)$/);
    if (boolProp) return (
      <span key={li}>{indent}<span style={{ color: t.info }}>{boolProp[1]}</span>{"\n"}</span>
    );

    // String prop    propName="value"
    const strProp = body.match(/^([\w]+)="([^"]*)"$/);
    if (strProp) return (
      <span key={li}>
        {indent}<span style={{ color: t.info }}>{strProp[1]}</span>
        {"="}
        <span style={{ color: t.success }}>"{strProp[2]}"</span>
        {"\n"}
      </span>
    );

    // Expression prop   propName={...}
    const exprProp = body.match(/^([\w]+)=\{(.+)\}$/);
    if (exprProp) return (
      <span key={li}>
        {indent}<span style={{ color: t.info }}>{exprProp[1]}</span>
        {"={"}
        <span style={{ color: t.mandatory }}>{exprProp[2]}</span>
        {"}"}
        {"\n"}
      </span>
    );

    return <span key={li}>{line}{"\n"}</span>;
  });
}

// ─────────────────────────────────────────────────────────────────
// PER-COMPONENT PLAYGROUND CONFIG
// defaults: initial prop values (controls only surface these keys)
// render:   (liveProps) => JSX  — the live preview renderer
// ─────────────────────────────────────────────────────────────────
const COMPONENT_PLAYGROUND_CONFIG = {
  TextInput: {
    defaults: { label: "Worker ID", placeholder: "e.g. EMP-2024-260", required: false, disabled: false, error: false, helperText: "" },
    render: (p) => <TextInput {...p} />,
  },
  DropdownSelect: {
    defaults: { label: "Job title", disabled: false, optional: false, placeholder: "Select job title…" },
    render: (p) => <DropdownSelect {...p} options={[
      { value: "ea",  label: "Executive Assistant" },
      { value: "pm",  label: "Product Manager" },
      { value: "swe", label: "Software Engineer" },
    ]} />,
  },
  RadioOption: {
    defaults: { label: "Full-time", sublabel: "40 hrs/week · standard contract", selected: false, disabled: false },
    render: (p) => <RadioOption {...p} />,
  },
  ToggleRow: {
    defaults: {
      label:       "I don't know the worker's personal details yet",
      description: "Get a cost estimate without providing worker details",
      checked:     false,
      disabled:    false,
    },
    render: (p) => <div style={{ maxWidth: 520 }}><ToggleRow {...p} /></div>,
  },
  SectionCard: {
    defaults: {
      title:          "Team information",
      showInfoButton: true,
    },
    render: (p) => (
      <div style={{ maxWidth: 520 }}>
        <SectionCard
          title={p.title}
          showInfoButton={p.showInfoButton}
          onInfoClick={p.showInfoButton ? () => alert('Section info!') : undefined}
        >
          <TextInput label="Entity" placeholder="Select entity" />
          <TextInput label="Group" placeholder="Select group" />
        </SectionCard>
      </div>
    ),
  },
  FormFieldGroup: {
    defaults: { title: "Personal details", description: "Worker's basic information", columns: 2 },
    render: (p) => (
      <FormFieldGroup {...p} fields={[
        { type: "text",   label: "First name",  required: true, placeholder: "Alex" },
        { type: "text",   label: "Last name",   required: true, placeholder: "Johnson" },
        { type: "text",   label: "Worker ID",   value: "EMP-2024-260" },
        { type: "select", label: "Department",  optional: true, options: [{ value: "eng", label: "Engineering" }, { value: "ops", label: "Operations" }] },
      ]} />
    ),
  },
  Buttons: {
    defaults: { variant: "primary", label: "Continue", size: "md", disabled: false, loading: false },
    render: (p) => <Button {...p} />,
  },
  StatusBadge: {
    defaults: { variant: "completed", label: "Step complete", dot: true },
    render: (p) => <StatusBadge {...p} />,
  },
  AutosaveWidget: {
    defaults: { status: "saved", lastSaved: "2 minutes ago" },
    render: (p) => <AutosaveWidget {...p} />,
  },
  ContextBanner: {
    defaults: {
      variant:   "guide",
      country:   "United States",
      title:     "",
      body:      "",
      ctaLabel:  "",
      dismissable: true,
    },
    render: (p) => (
      <div style={{ maxWidth: 580 }}>
        <ContextBanner
          variant={p.variant}
          country={p.country || undefined}
          title={p.title || undefined}
          body={p.body || undefined}
          ctaLabel={p.ctaLabel || undefined}
          dismissable={p.dismissable}
        />
      </div>
    ),
  },
  StepperRail: {
    defaults: {
      currentStep: 2,
      steps: [
        { label: "Personal details" },
        { label: "Job details" },
        { label: "Compensation and dates" },
        { label: "Benefits and extras" },
      ],
    },
    render: (p) => <StepperRail currentStep={p.currentStep} steps={p.steps ?? []} />,
    customControls: (liveProps, setProp, t) => {
      const steps = liveProps.steps || [];
      const inputBase = {
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
        padding: "5px 9px", borderRadius: 7,
        border: `1px solid ${t.border}`,
        background: t.inputBg || t.bg, color: t.textMain, outline: "none",
        flex: 1, minWidth: 0,
      };
      return (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 20px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: t.textMain, fontWeight: 500 }}>steps</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: t.purple }}>{"{ label: string }[]"}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 20px", borderBottom: `1px solid ${t.border}` }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: t.textDisabled, flexShrink: 0, width: 14, textAlign: "right" }}>{i + 1}</span>
                <input
                  type="text"
                  value={step.label}
                  onChange={e => {
                    const next = steps.map((s, j) => j === i ? { ...s, label: e.target.value } : s);
                    setProp("steps", next);
                  }}
                  style={inputBase}
                />
                <button
                  type="button"
                  onClick={() => steps.length > 1 && setProp("steps", steps.filter((_, j) => j !== i))}
                  style={{ background: "none", border: "none", cursor: steps.length > 1 ? "pointer" : "default", color: steps.length > 1 ? t.textMuted : t.textDisabled, fontSize: 15, padding: "2px 4px", lineHeight: 1, flexShrink: 0 }}
                  title="Remove step"
                >×</button>
              </div>
            ))}
            <div style={{ padding: "10px 20px" }}>
              <button
                type="button"
                onClick={() => setProp("steps", [...steps, { label: `Step ${steps.length + 1}` }])}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: t.primary, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
              >+ Add step</button>
            </div>
          </div>
        </>
      );
    },
  },
  ComplianceCheckCard: {
    defaults: { rule: "Job scope should be relevant to the job title.", status: "pass", detail: "" },
    render: (p) => <ComplianceCheckCard {...p} />,
  },
  ComplianceCheckPanel: {
    defaults: {},
    render: () => <ComplianceCheckPanel results={[
      { rule: "Scope is relevant to the job title.",          status: "pass" },
      { rule: "No recruiting or hiring language.",            status: "warn", detail: "Indirect reference detected — consider rephrasing." },
      { rule: "No required education requirements.",          status: "fail", detail: '"Must have a degree" detected and must be removed.' },
      { rule: "Scope does not reference reporting lines.",    status: "checking" },
    ]} />,
  },
  MarketRateChart: {
    defaults: { salary: 77293, period: "annual", country: "United States", seniority: "Mid", jobTitle: "Executive Assistant" },
    render: (p) => <MarketRateChart {...p} />,
  },
  AddPersonBlock:          { defaults: {}, render: () => <AddPersonBlock /> },
  JobDescriptionBlock:     { defaults: {}, render: () => <JobDescriptionBlock /> },
  CompensationBlock:       { defaults: {}, render: () => <CompensationBlock /> },
  BenefitsBlock:           { defaults: {}, render: () => <BenefitsBlock /> },
  EORContractCreationFlow: {
    defaults: {
      showHeader:     true,
      headerTitle:    "Create new EOR contract",
      headerSubtitle: "Full-time · United States",
    },
    render: (p) => <EORContractCreationFlow {...p} />,
  },
};

// ─────────────────────────────────────────────────────────────────
// PER-COMPONENT EXAMPLES
// Each entry: { id, title, description, code, render }
// ─────────────────────────────────────────────────────────────────
const COMPONENT_EXAMPLES = {
  TextInput: [
    {
      id: "basic", title: "Basic",
      description: "A text input with a label and placeholder.",
      code: `import { TextInput } from "./ComponentLibrary"

export function Demo() {
  return (
    <TextInput label="Worker ID" placeholder="e.g. EMP-2024-260" />
  )
}`,
      render: () => <div style={{ maxWidth: 380 }}><TextInput label="Worker ID" placeholder="e.g. EMP-2024-260" /></div>,
    },
    {
      id: "states", title: "States",
      description: "Supports required, error, and disabled states.",
      code: `import { TextInput } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 380 }}>
      <TextInput label="Required field" required helperText="This field is mandatory" />
      <TextInput label="Error state" value="invalid@" error helperText="Enter a valid email address" />
      <TextInput label="Disabled" value="Read-only value" disabled />
    </div>
  )
}`,
      render: () => (
        <div style={{ maxWidth: 380, display: "flex", flexDirection: "column", gap: 16 }}>
          <TextInput label="Required field" required helperText="This field is mandatory" />
          <TextInput label="Error state" value="invalid@" error helperText="Enter a valid email address" />
          <TextInput label="Disabled" value="Read-only value" disabled />
        </div>
      ),
    },
  ],

  DropdownSelect: [
    {
      id: "basic", title: "Basic",
      description: "A select with a label and a list of options.",
      code: `import { DropdownSelect } from "./ComponentLibrary"

export function Demo() {
  return (
    <DropdownSelect
      label="Job title"
      options={[
        { value: "ea",  label: "Executive Assistant" },
        { value: "pm",  label: "Product Manager" },
        { value: "swe", label: "Software Engineer" },
      ]}
    />
  )
}`,
      render: () => (
        <div style={{ maxWidth: 380 }}>
          <DropdownSelect label="Job title" options={[
            { value: "ea",  label: "Executive Assistant" },
            { value: "pm",  label: "Product Manager" },
            { value: "swe", label: "Software Engineer" },
          ]} />
        </div>
      ),
    },
    {
      id: "states", title: "States",
      description: "Add optional to show a hint label; disabled prevents interaction.",
      code: `import { DropdownSelect } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 380 }}>
      <DropdownSelect label="Department" optional options={[
        { value: "eng", label: "Engineering" },
        { value: "ops", label: "Operations" },
      ]} />
      <DropdownSelect label="Country (locked)" value="us" disabled options={[
        { value: "us", label: "United States" },
      ]} />
    </div>
  )
}`,
      render: () => (
        <div style={{ maxWidth: 380, display: "flex", flexDirection: "column", gap: 16 }}>
          <DropdownSelect label="Department" optional options={[
            { value: "eng", label: "Engineering" }, { value: "ops", label: "Operations" },
          ]} />
          <DropdownSelect label="Country (locked)" value="us" disabled options={[{ value: "us", label: "United States" }]} />
        </div>
      ),
    },
  ],

  RadioOption: [
    {
      id: "interactive", title: "Interactive",
      description: "Full-width tappable rows — pass selected and onClick for controlled behaviour.",
      code: `import { RadioOption } from "./ComponentLibrary"
import { useState } from "react"

export function Demo() {
  const [type, setType] = useState("full")
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
      <RadioOption label="Full-time" selected={type === "full"} onClick={() => setType("full")} />
      <RadioOption label="Part-time" selected={type === "part"} onClick={() => setType("part")} />
    </div>
  )
}`,
      render: () => {
        function RadioDemo() {
          const [type, setType] = useState("full");
          return (
            <div style={{ maxWidth: 380, display: "flex", flexDirection: "column", gap: 10 }}>
              <RadioOption label="Full-time" selected={type === "full"} onClick={() => setType("full")} />
              <RadioOption label="Part-time" selected={type === "part"} onClick={() => setType("part")} />
            </div>
          );
        }
        return <RadioDemo />;
      },
    },
    {
      id: "sublabel", title: "With sublabel",
      description: "Add a sublabel for a secondary description line. Supports disabled state.",
      code: `import { RadioOption } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 380 }}>
      <RadioOption label="Full-time"   sublabel="40 hrs/week · standard contract" selected />
      <RadioOption label="Part-time"   sublabel="Custom hours · flexible contract" />
      <RadioOption label="Contractor"  sublabel="1099 / B2B" disabled />
    </div>
  )
}`,
      render: () => (
        <div style={{ maxWidth: 380, display: "flex", flexDirection: "column", gap: 10 }}>
          <RadioOption label="Full-time"  sublabel="40 hrs/week · standard contract" selected />
          <RadioOption label="Part-time"  sublabel="Custom hours · flexible contract" />
          <RadioOption label="Contractor" sublabel="1099 / B2B" disabled />
        </div>
      ),
    },
  ],

  FormFieldGroup: [
    {
      id: "single-col", title: "Single column",
      description: "Default single-column layout.",
      code: `import { FormFieldGroup } from "./ComponentLibrary"

export function Demo() {
  return (
    <FormFieldGroup
      title="Contact details"
      fields={[
        { type: "text",   label: "First name", required: true, placeholder: "Alex" },
        { type: "text",   label: "Last name",  required: true, placeholder: "Johnson" },
        { type: "text",   label: "Email",      placeholder: "alex@company.com" },
      ]}
    />
  )
}`,
      render: () => (
        <div style={{ maxWidth: 420 }}>
          <FormFieldGroup title="Contact details" fields={[
            { type: "text", label: "First name", required: true, placeholder: "Alex" },
            { type: "text", label: "Last name",  required: true, placeholder: "Johnson" },
            { type: "text", label: "Email",      placeholder: "alex@company.com" },
          ]} />
        </div>
      ),
    },
    {
      id: "two-col", title: "Two columns",
      description: "Pass columns={2} to place fields in a responsive two-column grid.",
      code: `import { FormFieldGroup } from "./ComponentLibrary"

export function Demo() {
  return (
    <FormFieldGroup
      title="Workplace information"
      description="These details appear on the EOR contract."
      columns={2}
      fields={[
        { type: "text",   label: "First name", required: true, placeholder: "Alex" },
        { type: "text",   label: "Last name",  required: true, placeholder: "Johnson" },
        { type: "text",   label: "Worker ID",  value: "EMP-2024-260" },
        { type: "select", label: "Department", optional: true,
          options: [
            { value: "eng", label: "Engineering" },
            { value: "ops", label: "Operations" },
          ]
        },
      ]}
    />
  )
}`,
      render: () => (
        <div style={{ maxWidth: 560 }}>
          <FormFieldGroup
            title="Workplace information"
            description="These details appear on the EOR contract."
            columns={2}
            fields={[
              { type: "text",   label: "First name", required: true, placeholder: "Alex" },
              { type: "text",   label: "Last name",  required: true, placeholder: "Johnson" },
              { type: "text",   label: "Worker ID",  value: "EMP-2024-260" },
              { type: "select", label: "Department", optional: true,
                options: [{ value: "eng", label: "Engineering" }, { value: "ops", label: "Operations" }] },
            ]}
          />
        </div>
      ),
    },
  ],

  Buttons: [
    {
      id: "variants", title: "Variants",
      description: "Three visual styles — primary (filled CTA), secondary (outlined), and text (ghost).",
      code: `import { Button } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <Button variant="primary"   label="Continue" />
      <Button variant="secondary" label="Cancel" />
      <Button variant="text"      label="Learn more" />
    </div>
  )
}`,
      render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Button variant="primary"   label="Continue" />
          <Button variant="secondary" label="Cancel" />
          <Button variant="text"      label="Learn more" />
        </div>
      ),
    },
    {
      id: "sizes", title: "Sizes",
      description: "Use the size prop to change button height: sm (30px), md (36px, default), lg (42px).",
      code: `import { Button } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <Button variant="primary" label="Small"   size="sm" />
      <Button variant="primary" label="Medium"  size="md" />
      <Button variant="primary" label="Large"   size="lg" />
    </div>
  )
}`,
      render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Button variant="primary" label="Small"  size="sm" />
          <Button variant="primary" label="Medium" size="md" />
          <Button variant="primary" label="Large"  size="lg" />
        </div>
      ),
    },
    {
      id: "loading-disabled", title: "Loading & Disabled",
      description: "The loading prop shows a spinner; disabled prevents all interaction.",
      code: `import { Button } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <Button variant="primary"   label="Saving…"  loading />
      <Button variant="secondary" label="Loading…" loading />
      <Button variant="primary"   label="Disabled" disabled />
      <Button variant="secondary" label="Disabled" disabled />
    </div>
  )
}`,
      render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <Button variant="primary"   label="Saving…"  loading />
          <Button variant="secondary" label="Loading…" loading />
          <Button variant="primary"   label="Disabled" disabled />
          <Button variant="secondary" label="Disabled" disabled />
        </div>
      ),
    },
  ],

  StatusBadge: [
    {
      id: "variants", title: "Variants",
      description: "Four semantic variants — each carries distinct colour and default label text.",
      code: `import { StatusBadge } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      <StatusBadge variant="mandatory" />
      <StatusBadge variant="new" />
      <StatusBadge variant="completed" />
      <StatusBadge variant="failed" />
    </div>
  )
}`,
      render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <StatusBadge variant="mandatory" />
          <StatusBadge variant="new" />
          <StatusBadge variant="completed" />
          <StatusBadge variant="failed" />
        </div>
      ),
    },
    {
      id: "custom", title: "Custom label and dot",
      description: "Override the default label text with label prop. Hide the dot with dot={false}.",
      code: `import { StatusBadge } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      <StatusBadge variant="mandatory" label="Required by law" />
      <StatusBadge variant="completed" label="Job details" />
      <StatusBadge variant="new" dot={false} label="Feature preview" />
    </div>
  )
}`,
      render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <StatusBadge variant="mandatory" label="Required by law" />
          <StatusBadge variant="completed" label="Job details" />
          <StatusBadge variant="new" dot={false} label="Feature preview" />
        </div>
      ),
    },
  ],

  AutosaveWidget: [
    {
      id: "saved", title: "Saved state",
      description: "Shows a green dot and the last-saved timestamp when the draft is up-to-date.",
      code: `import { AutosaveWidget } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ maxWidth: 280 }}>
      <AutosaveWidget status="saved" lastSaved="2 minutes ago" />
    </div>
  )
}`,
      render: () => <div style={{ maxWidth: 280 }}><AutosaveWidget status="saved" lastSaved="2 minutes ago" /></div>,
    },
    {
      id: "saving", title: "Saving state",
      description: "Shows an amber pulsing spinner while the draft is being persisted.",
      code: `import { AutosaveWidget } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ maxWidth: 280 }}>
      <AutosaveWidget status="saving" />
    </div>
  )
}`,
      render: () => <div style={{ maxWidth: 280 }}><AutosaveWidget status="saving" /></div>,
    },
  ],

  ContextBanner: [
    {
      id: "guide", title: "Guide variant",
      description: "Dismissable country-specific hiring guide link. Blue-tinted with stacked flag imagery and an × button.",
      code: `import { ContextBanner } from "./ComponentLibrary"

export function Demo() {
  return (
    <ContextBanner
      variant="guide"
      country="United States"
      media={["🌍", "🇺🇸"]}
      onDismiss={() => console.log("dismissed")}
    />
  )
}`,
      render: () => (
        <div style={{ maxWidth: 560 }}>
          <ContextBanner variant="guide" country="United States" media={["🌍", "🇺🇸"]} />
        </div>
      ),
    },
    {
      id: "insight", title: "Insight variant",
      description: "Inline AI callout with purple mascot icon, bold 'Deel Insight:' prefix, and a text link CTA. No dismiss button.",
      code: `import { ContextBanner } from "./ComponentLibrary"

export function Demo() {
  return (
    <ContextBanner
      variant="insight"
      body="Severance in the United States typically ranges from 0–26 weeks depending on tenure."
    />
  )
}`,
      render: () => (
        <div style={{ maxWidth: 560 }}>
          <ContextBanner variant="insight" body="Severance in the United States typically ranges from 0–26 weeks depending on tenure." />
        </div>
      ),
    },
    {
      id: "promo", title: "Promo variant",
      description: "Persistent upsell tile with imagery on the right and an outlined 'Learn more ↗' button. No dismiss.",
      code: `import { ContextBanner } from "./ComponentLibrary"

export function Demo() {
  return (
    <ContextBanner
      variant="promo"
      title="Foreign Entity Setup"
      body="Set up a foreign entity with Deel — we handle compliance, payroll, and local filings."
    />
  )
}`,
      render: () => (
        <div style={{ maxWidth: 560 }}>
          <ContextBanner variant="promo" title="Foreign Entity Setup" body="Set up a foreign entity with Deel — we handle compliance, payroll, and local filings." />
        </div>
      ),
    },
  ],

  StepperRail: [
    {
      id: "step1", title: "Step 1 active",
      description: "First step is in progress; all remaining steps are in a future state.",
      code: `import { StepperRail } from "./ComponentLibrary"

export function Demo() {
  return (
    <StepperRail
      steps={[
        { label: "Personal details" },
        { label: "Job details" },
        { label: "Compensation" },
        { label: "Benefits" },
      ]}
      currentStep={1}
    />
  )
}`,
      render: () => (
        <div style={{ maxWidth: 260 }}>
          <StepperRail steps={[{ label: "Personal details" }, { label: "Job details" }, { label: "Compensation" }, { label: "Benefits" }]} currentStep={1} />
        </div>
      ),
    },
    {
      id: "step3", title: "With completed steps",
      description: "Completed steps show a check mark and are clickable to navigate back.",
      code: `import { StepperRail } from "./ComponentLibrary"

export function Demo() {
  return (
    <StepperRail
      steps={[
        { label: "Personal details" },
        { label: "Job details" },
        { label: "Compensation" },
        { label: "Benefits" },
      ]}
      currentStep={3}
      onStepClick={(n) => console.log("Go to step", n)}
    />
  )
}`,
      render: () => (
        <div style={{ maxWidth: 260 }}>
          <StepperRail steps={[{ label: "Personal details" }, { label: "Job details" }, { label: "Compensation" }, { label: "Benefits" }]} currentStep={3} onStepClick={() => {}} />
        </div>
      ),
    },
  ],

  ComplianceCheckCard: [
    {
      id: "all-states", title: "All states",
      description: "Four states: checking (shimmer), pass (green), warn (amber), fail (red).",
      code: `import { ComplianceCheckCard } from "./ComponentLibrary"

export function Demo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 560 }}>
      <ComplianceCheckCard rule="Scope is relevant to the job title." status="pass" />
      <ComplianceCheckCard
        rule="Scope should not include recruiting language."
        status="warn"
        detail="Indirect reference detected — consider rephrasing."
      />
      <ComplianceCheckCard
        rule="No required education requirements."
        status="fail"
        detail='"Must have a degree" detected and must be removed.'
      />
      <ComplianceCheckCard rule="Scope does not reference reporting lines." status="checking" />
    </div>
  )
}`,
      render: () => (
        <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 8 }}>
          <ComplianceCheckCard rule="Scope is relevant to the job title." status="pass" />
          <ComplianceCheckCard rule="Scope should not include recruiting language." status="warn" detail="Indirect reference detected — consider rephrasing." />
          <ComplianceCheckCard rule="No required education requirements." status="fail" detail='"Must have a degree" detected and must be removed.' />
          <ComplianceCheckCard rule="Scope does not reference reporting lines." status="checking" />
        </div>
      ),
    },
  ],

  ComplianceCheckPanel: [
    {
      id: "with-results", title: "With results",
      description: "Pass a results array — each item is rendered as a ComplianceCheckCard row.",
      code: `import { ComplianceCheckPanel } from "./ComponentLibrary"

export function Demo() {
  return (
    <ComplianceCheckPanel
      results={[
        { rule: "Scope is relevant to the job title.",       status: "pass" },
        { rule: "No recruiting or hiring language.",         status: "warn", detail: "Indirect ref detected — rephrase." },
        { rule: "No required education requirements.",       status: "fail", detail: '"Must have a degree" detected.' },
        { rule: "Scope does not reference reporting lines.", status: "checking" },
      ]}
    />
  )
}`,
      render: () => (
        <div style={{ maxWidth: 600 }}>
          <ComplianceCheckPanel results={[
            { rule: "Scope is relevant to the job title.",       status: "pass" },
            { rule: "No recruiting or hiring language.",         status: "warn", detail: "Indirect ref detected — rephrase." },
            { rule: "No required education requirements.",       status: "fail", detail: '"Must have a degree" detected.' },
            { rule: "Scope does not reference reporting lines.", status: "checking" },
          ]} />
        </div>
      ),
    },
    {
      id: "pre-run", title: "Pre-run state",
      description: "Without results the panel shows an empty state with the Run check CTA.",
      code: `import { ComplianceCheckPanel } from "./ComponentLibrary"

export function Demo() {
  return <ComplianceCheckPanel results={[]} />
}`,
      render: () => <div style={{ maxWidth: 600 }}><ComplianceCheckPanel results={[]} /></div>,
    },
  ],

  MarketRateChart: [
    {
      id: "annual", title: "Annual",
      description: "Shows the salary histogram for annual gross pay in the selected market.",
      code: `import { MarketRateChart } from "./ComponentLibrary"

export function Demo() {
  return (
    <MarketRateChart
      salary={77293}
      period="annual"
      country="United States"
      seniority="Mid"
      jobTitle="Executive Assistant"
    />
  )
}`,
      render: () => <div style={{ maxWidth: 560 }}><MarketRateChart salary={77293} period="annual" country="United States" seniority="Mid" jobTitle="Executive Assistant" /></div>,
    },
    {
      id: "monthly", title: "Monthly",
      description: "Pass period=\"monthly\" to default to monthly salary figures.",
      code: `import { MarketRateChart } from "./ComponentLibrary"

export function Demo() {
  return (
    <MarketRateChart
      salary={120000}
      period="monthly"
      country="Germany"
      seniority="Senior"
      jobTitle="Product Manager"
    />
  )
}`,
      render: () => <div style={{ maxWidth: 560 }}><MarketRateChart salary={120000} period="monthly" country="Germany" seniority="Senior" jobTitle="Product Manager" /></div>,
    },
  ],

  AddPersonBlock: [
    {
      id: "default", title: "Default",
      description: "Add-person step block: team info, personal details, workplace, org structure, and hiring objective.",
      code: `import { AddPersonBlock } from "./ComponentLibrary"

export function Demo() {
  return (
    <AddPersonBlock
      onSave={(state) => console.log(state)}
    />
  )
}`,
      render: () => <AddPersonBlock />,
    },
  ],

  JobDescriptionBlock: [
    {
      id: "default", title: "Default",
      description: "Pre-fill the block with defaultTitle, defaultSeniority, and defaultScope.",
      code: `import { JobDescriptionBlock } from "./ComponentLibrary"

export function Demo() {
  return (
    <JobDescriptionBlock
      defaultTitle="Executive Assistant"
      defaultSeniority="mid"
      onSave={(state) => console.log(state)}
    />
  )
}`,
      render: () => <JobDescriptionBlock defaultTitle="Executive Assistant" defaultSeniority="mid" />,
    },
  ],

  CompensationBlock: [
    {
      id: "default", title: "Default",
      description: "Full compensation section with employment type toggle, salary input, and market rate chart.",
      code: `import { CompensationBlock } from "./ComponentLibrary"

export function Demo() {
  return (
    <CompensationBlock
      defaultSalary={77293}
      defaultEmploymentType="full"
      country="United States"
    />
  )
}`,
      render: () => <CompensationBlock defaultSalary={77293} defaultEmploymentType="full" country="United States" />,
    },
    {
      id: "no-chart", title: "Without market insights",
      description: "Pass showMarketInsights={false} to hide the salary benchmarking chart.",
      code: `import { CompensationBlock } from "./ComponentLibrary"

export function Demo() {
  return (
    <CompensationBlock
      defaultSalary={60000}
      showMarketInsights={false}
      country="Germany"
    />
  )
}`,
      render: () => <CompensationBlock defaultSalary={60000} showMarketInsights={false} country="Germany" />,
    },
  ],

  BenefitsBlock: [
    {
      id: "us", title: "United States",
      description: "Mandatory Healthcare, Pension, and Life Insurance for US workers shown as warnings until added.",
      code: `import { BenefitsBlock } from "./ComponentLibrary"

export function Demo() {
  return <BenefitsBlock country="United States" />
}`,
      render: () => <BenefitsBlock country="United States" />,
    },
    {
      id: "germany", title: "Germany",
      description: "Country-specific mandatory benefit set differs from US defaults.",
      code: `import { BenefitsBlock } from "./ComponentLibrary"

export function Demo() {
  return <BenefitsBlock country="Germany" />
}`,
      render: () => <BenefitsBlock country="Germany" />,
    },
  ],

  EORContractCreationFlow: [
    {
      id: "full", title: "Full flow",
      description: "4-step EOR contract creation — Personal details, Job, Compensation, and Benefits.",
      code: `import { EORContractCreationFlow } from "./ComponentLibrary"

export function Demo() {
  return (
    <EORContractCreationFlow
      country="United States"
      showHeader={true}
      headerTitle="Create new EOR contract"
      headerSubtitle="Full-time · United States"
      onComplete={(data) => console.log(data)}
    />
  )
}`,
      render: () => (
        <EORContractCreationFlow
          country="United States"
          showHeader
          headerTitle="Create new EOR contract"
          headerSubtitle="Full-time · United States"
        />
      ),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────
// COMPONENT DOC PAGE  (shadcn-style documentation view)
// ─────────────────────────────────────────────────────────────────
function ComponentPlayground({ name, dark, setDark, onBack, backLabel = "Library", embedded = false, onSelectComponent, appearance: appearanceProp, setAppearance: setAppearanceProp }) {
  const config   = COMPONENT_PLAYGROUND_CONFIG[name] ?? { defaults: {}, render: () => null };
  const manifest = COMPONENT_MANIFEST.find(c => c.name === name);
  const examples = COMPONENT_EXAMPLES[name] ?? [];

  // Prev/Next within the manifest order
  const allCompNames = COMPONENT_MANIFEST.map(c => c.name);
  const currentIdx   = allCompNames.indexOf(name);
  const prevName     = currentIdx > 0 ? allCompNames[currentIdx - 1] : null;
  const nextName     = currentIdx < allCompNames.length - 1 ? allCompNames[currentIdx + 1] : null;

  const [liveProps,    setLiveProps]    = useState({ ...config.defaults });
  const [activeTab,    setActiveTab]    = useState("preview"); // "preview" | "playground"
  const [copiedImport, setCopiedImport] = useState(false);
  const [copiedUsage,  setCopiedUsage]  = useState(false);
  const [expandedEx,   setExpandedEx]   = useState({});
  const [copiedEx,       setCopiedEx]       = useState({});
  const [copiedApSnippet, setCopiedApSnippet] = useState(false);
  const [copiedCode,      setCopiedCode]      = useState(false);
  const [controlsWidth, setControlsWidth] = useState(300);
  const [apWidth,      setApWidth]      = useState(260);
  const resizingRef    = useRef(false);
  const startXRef      = useRef(0);
  const startWRef      = useRef(300);
  const apResizingRef  = useRef(false);
  const apStartXRef    = useRef(0);
  const apStartWRef    = useRef(260);

  // Appearance state: use lifted state if provided, otherwise local
  const [localAp, setLocalAp] = useState({ ...APPEARANCE_DEFAULTS });
  const ap    = appearanceProp ?? localAp;
  const setAp = setAppearanceProp ?? setLocalAp;

  const isApCustomised = !!(ap.primaryColor)
    || ap.fontFamily !== APPEARANCE_DEFAULTS.fontFamily
    || ap.borderRadius !== APPEARANCE_DEFAULTS.borderRadius;

  // Effective primary = custom (adjusted) if set, else the theme token default
  const effectivePrimary = ap.primaryColor || (dark ? darkTokens.primary : lightTokens.primary);

  const t = dark ? darkTokens : lightTokens;
  const { color: tierColor, bg: tierBg } = TIER_COLORS[manifest?.tier] ?? TIER_COLORS.atom;
  const isFlow = manifest?.tier === "flow";

  const controllableProps = (manifest?.props ?? [])
    .map(p => ({ ...p, control: inferControlType(p.type) }))
    .filter(p => p.control !== null && Object.prototype.hasOwnProperty.call(config.defaults, p.name));

  const generatedCode  = generatePlaygroundCode(name, liveProps);
  const importCode     = `import { ${name} } from "./ComponentLibrary"`;
  const appearanceSnippet = (() => {
    const lines = [];
    if (ap.primaryColor) lines.push(`  primaryColor: "${ap.primaryColor}",`);
    if (ap.fontFamily !== APPEARANCE_DEFAULTS.fontFamily) lines.push(`  fontFamily: "${ap.fontFamily}",`);
    if (ap.borderRadius !== APPEARANCE_DEFAULTS.borderRadius) lines.push(`  borderRadius: ${ap.borderRadius},`);
    const baseVar = dark ? "darkTokens" : "lightTokens";
    const obj = lines.length ? `{\n${lines.join("\n")}\n}` : "{}";
    return `import { applyAppearance, ${baseVar} } from "./ComponentLibrary";\n\nconst tokens = applyAppearance(${baseVar}, ${obj}, ${dark});`;
  })();
  const setProp        = (key, val) => setLiveProps(prev => ({ ...prev, [key]: val }));
  const copyText       = (text, setter) => { navigator.clipboard.writeText(text).then(() => { setter(true); setTimeout(() => setter(false), 1800); }).catch(() => {}); };
  const toggleEx       = (id) => setExpandedEx(prev => ({ ...prev, [id]: !prev[id] }));
  const copyEx         = (id, code) => copyText(code, (v) => setCopiedEx(prev => ({ ...prev, [id]: v })));

  const onResizeDown = (e) => {
    resizingRef.current = true; startXRef.current = e.clientX; startWRef.current = controlsWidth;
    const onMove = (ev) => { if (!resizingRef.current) return; const d = startXRef.current - ev.clientX; setControlsWidth(Math.max(220, Math.min(640, startWRef.current + d))); };
    const onUp   = () => { resizingRef.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp); e.preventDefault();
  };

  const onApResizeDown = (e) => {
    apResizingRef.current = true; apStartXRef.current = e.clientX; apStartWRef.current = apWidth;
    const onMove = (ev) => { if (!apResizingRef.current) return; const d = apStartXRef.current - ev.clientX; setApWidth(Math.max(200, Math.min(480, apStartWRef.current + d))); };
    const onUp   = () => { apResizingRef.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp); e.preventDefault();
  };

  // Appearance side-panel controls — stored as JSX, NOT a component, to avoid
  // remounting on every render which would close the native color picker.
  const appearancePanelJSX = (
    <div style={{ flex: `0 0 ${apWidth}px`, width: apWidth, overflow: "auto", background: t.surface, display: "flex", position: "relative" }}>
      {/* Resize handle */}
      <div
        onMouseDown={onApResizeDown}
        style={{ width: 4, flexShrink: 0, cursor: "col-resize", background: "transparent", transition: "background .15s" }}
        onMouseEnter={e => e.currentTarget.style.background = t.border}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Panel header */}
        <div style={{ padding: "12px 16px 10px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDisabled }}>Appearance</span>
          {isApCustomised && (
            <button
              type="button"
              onClick={() => setAp({ ...APPEARANCE_DEFAULTS })}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: t.textMuted, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 5, padding: "2px 9px", cursor: "pointer" }}
            >↺ Reset</button>
          )}
        </div>
        {/* Controls */}
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Primary colour */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textDisabled }}>Primary colour</span>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <input
                type="color"
                value={ap.primaryColor || effectivePrimary}
                onChange={e => setAp(prev => ({ ...prev, primaryColor: e.target.value }))}
                style={{ width: 28, height: 28, border: `1px solid ${t.border}`, borderRadius: 5, padding: 2, cursor: "pointer", background: t.inputBg, flexShrink: 0 }}
              />
              <input
                type="text"
                value={ap.primaryColor || effectivePrimary}
                onChange={e => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setAp(prev => ({ ...prev, primaryColor: v })); }}
                onBlur={e => { if (!/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setAp(prev => ({ ...prev, primaryColor: "" })); }}
                style={{ flex: 1, height: 28, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: t.textMain, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 5, padding: "0 7px", outline: "none", minWidth: 0 }}
              />
              {ap.primaryColor && (
                <button type="button" onClick={() => setAp(prev => ({ ...prev, primaryColor: "" }))} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textDisabled, fontSize: 13, padding: 0, lineHeight: 1, flexShrink: 0 }} title="Reset to theme default">✕</button>
              )}
            </div>
            {!ap.primaryColor && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: t.textDisabled }}>theme default</span>
            )}
          </div>

          {/* Font family */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textDisabled }}>Font family</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {["Inter", "DM Sans", "Geist", "Sora", "Plus Jakarta Sans"].map(font => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setAp(prev => ({ ...prev, fontFamily: font }))}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, textAlign: "left",
                    padding: "5px 10px", borderRadius: 6, border: `1px solid ${ap.fontFamily === font ? t.primary : t.border}`,
                    background: ap.fontFamily === font ? t.primary + "14" : "transparent",
                    color: ap.fontFamily === font ? t.primary : t.textMuted,
                    cursor: "pointer", transition: "all .1s",
                  }}
                >{font}</button>
              ))}
            </div>
          </div>

          {/* Border radius */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textDisabled }}>
              Border radius — {ap.borderRadius}px
            </span>
            <input
              type="range"
              min={0} max={20} step={1}
              value={ap.borderRadius}
              onChange={e => setAp(prev => ({ ...prev, borderRadius: Number(e.target.value) }))}
              style={{ width: "100%", accentColor: effectivePrimary, cursor: "pointer" }}
            />
            <div style={{ display: "flex", gap: 3 }}>
              {[0, 4, 8, 14, 20].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAp(prev => ({ ...prev, borderRadius: v }))}
                  style={{
                    flex: 1, height: 26, border: `1px solid ${ap.borderRadius === v ? t.primary : t.border}`,
                    background: ap.borderRadius === v ? t.primary + "14" : "transparent",
                    color: ap.borderRadius === v ? t.primary : t.textMuted,
                    borderRadius: `${v}px`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    fontWeight: 600, cursor: "pointer", transition: "all .1s",
                  }}
                >{v}</button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // ── Inline sub-components ────────────────────────────────────
  const SectionTitle = ({ children, id }) => (
    <h2 id={id} style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em", color: t.textMain, margin: "0 0 18px", paddingBottom: 14, borderBottom: `1px solid ${t.border}` }}>
      {children}
    </h2>
  );

  const CodeBlock = ({ code, copied, onCopy, minHeight = 56 }) => (
    <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderBottom: `1px solid ${t.border}`, background: t.surface }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDisabled }}>Code</span>
        <button type="button" onClick={onCopy} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500, color: copied ? t.success : t.textMuted, background: "transparent", border: `1px solid ${copied ? t.success : t.border}`, borderRadius: 6, padding: "3px 12px", cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 5 }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.75, padding: "16px 20px", margin: 0, overflowX: "auto", minHeight, background: t.bg }}>
        {syntaxHighlightCode(code, t)}
      </pre>
    </div>
  );

  const NavBtn = ({ compName, direction }) => {
    const compManifest = COMPONENT_MANIFEST.find(c => c.name === compName);
    const { color: nc, bg: nb } = TIER_COLORS[compManifest?.tier] ?? TIER_COLORS.atom;
    return (
      <button
        type="button"
        onClick={() => { onSelectComponent?.(compName); window.scrollTo(0, 0); }}
        style={{ display: "flex", flexDirection: direction === "prev" ? "row" : "row-reverse", alignItems: "center", gap: 10, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: t.textMain, background: t.surface, border: `1px solid ${t.border}`, padding: "11px 18px", borderRadius: 10, cursor: "pointer", flex: 1, maxWidth: 280, textAlign: direction === "prev" ? "left" : "right", transition: "border-color .12s, background .12s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = t.textMuted; e.currentTarget.style.background = t.surfaceHover; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = t.border;    e.currentTarget.style.background = t.surface; }}
      >
        <span style={{ fontSize: 17, color: t.textDisabled, flexShrink: 0, lineHeight: 1 }}>{direction === "prev" ? "←" : "→"}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ fontSize: 10, color: t.textDisabled, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace" }}>{direction === "prev" ? "Previous" : "Next"}</span>
          <span>{compName}</span>
        </div>
      </button>
    );
  };

  return (
    <>
      {!embedded && <style dangerouslySetInnerHTML={{ __html: makeCSS(t, dark) + makeLibraryCSS(applyAppearance(t, ap, dark), dark) + makeCatalogCSS(t) }} />}

      {/* ── Back bar (non-embedded) ── */}
      {!embedded && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 28px", background: t.surface, borderBottom: `1px solid ${t.border}`, boxShadow: t.shadow, position: "sticky", top: 0, zIndex: 100, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button type="button" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 7, padding: "5px 11px", cursor: "pointer", color: t.textMain, fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500 }}>
              <BackArrow /> {backLabel}
            </button>
            <span style={{ color: t.textDisabled }}>/</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: t.textMain, letterSpacing: "-0.01em" }}>{name}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: tierColor, background: tierBg, padding: "2.5px 8px", borderRadius: 4 }}>{manifest?.tier}</span>
          </div>
          <button className="toggle-btn" onClick={() => setDark(d => !d)} type="button">{dark ? <Moon /> : <Sun />}{dark ? "Dark" : "Light"}<div className="track"><div className="thumb" /></div></button>
        </div>
      )}

      {/* ── Doc page body ── */}
      <div style={{ background: t.bg, minHeight: embedded ? undefined : "calc(100vh - 53px)" }}>

        {/* ── Page header ── */}
        <div style={{ padding: "44px 48px 36px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
          {/* Prev / Next top nav */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 32 }}>
            {prevName ? <NavBtn compName={prevName} direction="prev" /> : <span />}
            {nextName ? <NavBtn compName={nextName} direction="next" /> : <span />}
          </div>

          {/* Title + actions row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.04em", color: t.textMain, margin: "0 0 12px", fontFamily: "'Inter', sans-serif" }}>{name}</h1>
              {/* Tier + domain + composed-of tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14, alignItems: "center" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: tierColor, background: tierBg, padding: "3px 9px", borderRadius: 5 }}>{manifest?.tier}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: t.textMuted, background: t.surfaceHover, border: `1px solid ${t.border}`, padding: "3px 9px", borderRadius: 5 }}>{manifest?.domain}</span>
                {manifest?.composedOf?.length > 0 && manifest.composedOf.map(dep => (
                  <span key={dep} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: t.textMuted, background: t.bg, border: `1px solid ${t.border}`, padding: "3px 9px", borderRadius: 5 }}>+{dep}</span>
                ))}
              </div>
              <p style={{ fontSize: 14.5, color: t.textMuted, lineHeight: 1.65, maxWidth: 660, margin: 0, fontFamily: "'Inter', sans-serif" }}>{manifest?.description}</p>
            </div>
            <button
              type="button"
              onClick={() => copyText(importCode, setCopiedImport)}
              style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500, color: copiedImport ? t.success : t.textMain, background: t.surface, border: `1px solid ${copiedImport ? t.success : t.border}`, padding: "7px 16px", borderRadius: 8, cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
            >
              {copiedImport ? "✓ Copied!" : "Copy import"}
            </button>
          </div>
        </div>

        {/* ── Scrollable sections ── */}
        <div style={{ padding: "48px 48px 96px", display: "flex", flexDirection: "column", gap: 56 }}>

          {/* ── Preview / Playground ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottom: `1px solid ${t.border}`, marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.025em", color: t.textMain, margin: 0 }}>Preview</h2>
              {(controllableProps.length > 0 || config.customControls) && (
                <div style={{ display: "flex", gap: 2, background: t.surfaceHover, border: `1px solid ${t.border}`, borderRadius: 8, padding: 2 }}>
                  {["preview", "playground"].map(tab => (
                    <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500, padding: "5px 16px", borderRadius: 6, border: "none", cursor: "pointer", transition: "background .12s, color .12s", background: activeTab === tab ? t.surface : "transparent", color: activeTab === tab ? t.textMain : t.textMuted, boxShadow: activeTab === tab ? t.shadow : "none" }}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activeTab === "preview" ? (
              <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", display: "flex" }}>
                {/* Preview area */}
                <div style={{ flex: 1, padding: isFlow ? 0 : "52px 40px", background: t.bg, display: "flex", alignItems: isFlow ? "flex-start" : "center", justifyContent: isFlow ? "flex-start" : "center", minHeight: isFlow ? undefined : 280, overflow: "auto", borderRight: `1px solid ${t.border}` }}>
                  {COMPONENT_DEMOS[name] || config.render(liveProps)}
                </div>
                {/* Appearance side panel */}
                {appearancePanelJSX}
              </div>
            ) : (
              /* Playground: interactive controls + live preview */
              <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", minHeight: 300 }}>
                  {/* Live preview */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", background: t.bg, borderRight: `1px solid ${t.border}`, overflow: "auto" }}>
                    {config.render(liveProps)}
                  </div>
                  {/* Controls */}
                  <div style={{ flex: `0 0 ${controlsWidth}px`, width: controlsWidth, overflow: "auto", background: t.surface, display: "flex", position: "relative" }}>
                    <div onMouseDown={onResizeDown} style={{ width: 4, flexShrink: 0, cursor: "col-resize", background: "transparent", transition: "background .15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = t.border} onMouseLeave={e => e.currentTarget.style.background = "transparent"} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ padding: "12px 20px 10px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDisabled }}>Controls</span>
                        <button type="button" onClick={() => setLiveProps({ ...config.defaults })} style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: t.textMuted, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>Reset</button>
                      </div>
                      {controllableProps.length === 0 && !config.customControls ? (
                        <div style={{ padding: "24px 20px", color: t.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.7 }}>No configurable props.</div>
                      ) : (
                        <>
                          {controllableProps.map(p => (
                            <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 20px", borderBottom: `1px solid ${t.border}`, gap: 16 }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: p.required ? t.error : t.textMain, fontWeight: 500 }}>{p.name}</span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: t.purple }}>{p.type.length > 28 ? p.type.slice(0, 26) + "…" : p.type}</span>
                              </div>
                              {renderControlWidget(p.name, p.control, liveProps[p.name], setProp, t)}
                            </div>
                          ))}
                          {config.customControls?.(liveProps, setProp, t)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Generated code snippet ── */}
            {activeTab === "playground" && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDisabled }}>Code</span>
                </div>
                <CodeBlock code={generatedCode} copied={copiedCode} onCopy={() => copyText(generatedCode, setCopiedCode)} />
              </div>
            )}

            {/* ── Appearance snippet ── */}
            {activeTab === "preview" && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textDisabled }}>Appearance snippet</span>
                  {isApCustomised && (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: t.success, background: t.successBg ?? t.surfaceHover, border: `1px solid ${t.successBorder ?? t.border}`, padding: "2px 8px", borderRadius: 5 }}>customised</span>
                  )}
                </div>
                <CodeBlock code={appearanceSnippet} copied={copiedApSnippet} onCopy={() => copyText(appearanceSnippet, setCopiedApSnippet)} />
              </div>
            )}
          </div>

          {/* ── Installation ── */}
          <div>
            <SectionTitle>Installation</SectionTitle>
            <CodeBlock code={importCode} copied={copiedImport} onCopy={() => copyText(importCode, setCopiedImport)} minHeight={42} />
          </div>

          {/* ── Usage ── */}
          {manifest?.usage && (
            <div>
              <SectionTitle>Usage</SectionTitle>
              <CodeBlock code={manifest.usage} copied={copiedUsage} onCopy={() => copyText(manifest.usage, setCopiedUsage)} />
            </div>
          )}

          {/* ── Examples ── */}
          {examples.length > 0 && (
            <div>
              <SectionTitle>Examples</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
                {examples.map((ex) => (
                  <div key={ex.id}>
                    {/* Example header */}
                    <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em", color: t.textMain, margin: "0 0 6px" }}>{ex.title}</h3>
                    <p style={{ fontSize: 13.5, color: t.textMuted, lineHeight: 1.6, margin: "0 0 16px", fontFamily: "'Inter', sans-serif" }}>{ex.description}</p>
                    {/* Live preview */}
                    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ padding: "32px 28px", background: t.bg, display: "flex", alignItems: "center", justifyContent: "flex-start", overflow: "auto" }}>
                        {ex.render()}
                      </div>
                    </div>
                    {/* View Code toggle */}
                    <button
                      type="button"
                      onClick={() => toggleEx(ex.id)}
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500, color: t.textMuted, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 7, padding: "5px 14px", cursor: "pointer", marginBottom: expandedEx[ex.id] ? 10 : 0, transition: "border-color .12s", display: "inline-flex", alignItems: "center", gap: 6 }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = t.textMuted}
                      onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
                    >
                      {expandedEx[ex.id] ? "▲ Hide Code" : "▾ View Code"}
                    </button>
                    {expandedEx[ex.id] && (
                      <CodeBlock code={ex.code} copied={copiedEx[ex.id]} onCopy={() => copyEx(ex.id, ex.code)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── API Reference ── */}
          {manifest && manifest.props.length > 0 && (
            <div>
              <SectionTitle>API Reference</SectionTitle>
              <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.01em", color: t.textMain, margin: "0 0 14px" }}>{name}</h3>
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", boxShadow: t.shadow }}>
                {/* Header row */}
                <div style={{ display: "flex", padding: "10px 20px", background: t.surfaceHover, borderBottom: `1px solid ${t.border}` }}>
                  {["Prop", "Type", "Description"].map((h, i) => (
                    <span key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.textDisabled, flex: i === 0 ? "0 0 180px" : i === 1 ? "0 0 220px" : 1 }}>{h}</span>
                  ))}
                </div>
                {manifest.props.map((p, i) => (
                  <div key={p.name} style={{ display: "flex", alignItems: "baseline", padding: "12px 20px", borderBottom: i < manifest.props.length - 1 ? `1px solid ${t.border}` : "none", flexWrap: "wrap", gap: 4 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: t.info, flex: "0 0 180px", minWidth: 0 }}>
                      {p.name}{p.required && <span style={{ color: t.error }}>*</span>}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: t.purple, flex: "0 0 220px", lineHeight: 1.55, minWidth: 0 }}>
                      {p.type}
                    </span>
                    <span style={{ fontSize: 12.5, color: t.textMuted, lineHeight: 1.55, flex: 1, minWidth: 200 }}>{p.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Bottom Prev/Next ── */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingTop: 8, borderTop: `1px solid ${t.border}` }}>
            {prevName ? <NavBtn compName={prevName} direction="prev" /> : <span />}
            {nextName ? <NavBtn compName={nextName} direction="next" /> : <span />}
          </div>

        </div>
      </div>
    </>
  );
}

// Additional CSS specific to the catalog UI (extends makeCSS via inline style)
const makeCatalogCSS = (t) => `
  .lib-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 32px; background: ${t.surface}; border-bottom: 1px solid ${t.border};
    box-shadow: ${t.shadow}; position: sticky; top: 0; z-index: 100;
  }
  .lib-brand { display: flex; align-items: center; gap: 10px; }
  .lib-logo {
    font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600;
    letter-spacing: -0.01em; color: ${t.btnText}; background: ${t.primary};
    padding: 5px 10px; border-radius: 7px;
  }
  .lib-title { font-size: 14px; font-weight: 600; color: ${t.textMain}; letter-spacing: -0.02em; }
  .lib-sep { color: ${t.textDisabled}; margin: 0 4px; }
  .lib-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.07em; text-transform: uppercase;
    color: ${t.purple}; background: ${t.purpleBg}; padding: 3px 9px; border-radius: 6px;
  }
  .lib-hero {
    padding: 52px 32px 40px; border-bottom: 1px solid ${t.border}; background: ${t.surface};
  }
  .lib-eyebrow {
    font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase; color: ${t.textMuted}; margin-bottom: 12px;
  }
  .lib-h1 {
    font-size: 32px; font-weight: 700; letter-spacing: -0.04em; line-height: 1.14;
    color: ${t.textMain}; margin-bottom: 14px;
  }
  .lib-h1 em { font-style: normal; color: ${t.purple}; }
  .lib-desc { font-size: 14px; color: ${t.textMuted}; line-height: 1.65; max-width: 580px; margin-bottom: 28px; }
  .lib-stats { display: flex; gap: 32px; flex-wrap: wrap; }
  .lib-stat { display: flex; flex-direction: column; gap: 2px; }
  .lib-stat-n { font-size: 22px; font-weight: 700; letter-spacing: -0.04em; color: ${t.textMain}; }
  .lib-stat-l { font-size: 11.5px; color: ${t.textMuted}; font-weight: 500; }

  .lib-domain-nav {
    display: flex; gap: 2px; padding: 0 32px;
    border-bottom: 1px solid ${t.border}; background: ${t.surface};
    overflow-x: auto; position: sticky; top: 53px; z-index: 90;
  }
  .lib-domain-tab {
    padding: 12px 14px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: ${t.textMuted}; background: transparent; border: none; cursor: pointer;
    border-bottom: 2px solid transparent; white-space: nowrap;
    transition: color .12s, border-color .12s;
  }
  .lib-domain-tab:hover { color: ${t.textMain}; }
  .lib-domain-tab.active { color: ${t.textMain}; border-bottom-color: ${t.primary}; }

  .lib-body { padding: 36px 32px 80px; background: ${t.bg}; }
  .lib-domain-section { margin-bottom: 48px; }
  .lib-domain-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .lib-domain-label {
    font-size: 20px; font-weight: 700; letter-spacing: -0.03em; color: ${t.textMain};
  }
  .lib-domain-count {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
    letter-spacing: 0.06em; color: ${t.textMuted}; background: ${t.surfaceHover};
    padding: 3px 8px; border-radius: 5px;
  }

  .lib-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }
  .lib-card {
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 12px;
    overflow: hidden; box-shadow: ${t.shadow};
    transition: box-shadow .14s, transform .14s;
    display: flex; flex-direction: column;
  }
  .lib-card:hover { box-shadow: ${t.shadowMd}; transform: translateY(-2px); }
  .lib-card-head { padding: 18px 20px 14px; border-bottom: 1px solid ${t.border}; }
  .lib-card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
  .lib-tier-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase; padding: 2.5px 8px; border-radius: 4px;
  }
  .lib-card-name { font-size: 15px; font-weight: 700; letter-spacing: -0.025em; color: ${t.textMain}; margin-bottom: 6px; }
  .lib-card-desc { font-size: 12.5px; color: ${t.textMuted}; line-height: 1.55; }
  .lib-card-body { padding: 14px 20px; flex: 1; display: flex; flex-direction: column; gap: 12px; }
  .lib-meta-row { display: flex; gap: 20px; flex-wrap: wrap; }
  .lib-meta-item { display: flex; flex-direction: column; gap: 2px; }
  .lib-meta-label { font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: ${t.textDisabled}; font-family: 'JetBrains Mono', monospace; }
  .lib-meta-val { font-size: 12px; color: ${t.textMain}; font-weight: 500; }
  .lib-props { display: flex; flex-direction: column; gap: 4px; }
  .lib-prop-row { display: flex; align-items: baseline; gap: 6px; padding: 4px 0; border-bottom: 1px solid ${t.border}; }
  .lib-prop-row:last-child { border-bottom: none; }
  .lib-prop-name { font-family: 'JetBrains Mono', monospace; font-size: 11.5px; font-weight: 500; color: ${t.info}; min-width: 120px; flex-shrink: 0; }
  .lib-prop-type { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${t.purple}; min-width: 80px; flex-shrink: 0; }
  .lib-prop-req { font-size: 10px; font-weight: 600; color: ${t.error}; font-family: 'JetBrains Mono', monospace; flex-shrink: 0; }
  .lib-prop-desc { font-size: 11.5px; color: ${t.textMuted}; line-height: 1.4; }
  .lib-composed-chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .lib-composed-chip {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
    padding: 2px 8px; border-radius: 4px; background: ${t.surfaceHover}; color: ${t.textMuted};
    border: 1px solid ${t.border};
  }
  .lib-card-foot {
    padding: 12px 20px; border-top: 1px solid ${t.border}; background: ${t.bg};
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
  }
  .lib-usage-snippet {
    font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${t.textMuted};
    background: ${t.surfaceHover}; border: 1px solid ${t.border}; border-radius: 6px;
    padding: 6px 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; flex: 1;
  }
  .lib-demo-btn {
    display: flex; align-items: center; gap: 5px; flex-shrink: 0;
    font-size: 11.5px; font-weight: 500; color: ${t.textMain};
    background: ${t.surface}; border: 1px solid ${t.border};
    padding: 5px 10px; border-radius: 7px; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: border-color .12s, background .12s;
  }
  .lib-demo-btn:hover { border-color: ${t.textMuted}; background: ${t.surfaceHover}; }

  .lib-manifest-section {
    padding: 0 32px 60px; background: ${t.bg};
  }
  .lib-manifest-box {
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 12px;
    padding: 24px; box-shadow: ${t.shadow};
  }
  .lib-manifest-title { font-size: 15px; font-weight: 700; color: ${t.textMain}; margin-bottom: 6px; }
  .lib-manifest-desc { font-size: 13px; color: ${t.textMuted}; line-height: 1.6; margin-bottom: 18px; }
  .lib-manifest-code {
    background: ${t.bg}; border: 1px solid ${t.border}; border-radius: 8px;
    padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${t.textMuted};
    line-height: 1.65; overflow-x: auto; white-space: pre;
  }
  .lib-manifest-code .key { color: ${t.info}; }
  .lib-manifest-code .str { color: ${t.success}; }
  .lib-manifest-code .num { color: ${t.mandatory}; }

  .lib-foot {
    padding: 20px 32px; border-top: 1px solid ${t.border}; background: ${t.surface};
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${t.textMuted};
  }

  /* ── Appearance Customisation section ── */
  .lib-appearance-section {
    padding: 0 32px 60px; background: ${t.bg};
  }
  .lib-appearance-header { margin-bottom: 24px; }
  .lib-appearance-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    color: ${t.textMuted}; margin-bottom: 8px; display: block;
  }
  .lib-appearance-title { font-size: 18px; font-weight: 700; letter-spacing: -0.03em; color: ${t.textMain}; margin-bottom: 6px; }
  .lib-appearance-desc { font-size: 13px; color: ${t.textMuted}; line-height: 1.6; max-width: 620px; }
  .lib-appearance-layout {
    display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: start;
  }
  .lib-appearance-controls {
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 12px;
    padding: 20px; box-shadow: ${t.shadow};
  }
  .lib-appearance-preview-wrap {
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 12px;
    padding: 20px; box-shadow: ${t.shadow};
  }
  .lib-appearance-code-wrap {
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 12px;
    padding: 20px; box-shadow: ${t.shadow};
  }
  .lib-appearance-code {
    background: ${t.bg}; border: 1px solid ${t.border}; border-radius: 8px;
    padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${t.textMuted};
    line-height: 1.65; overflow-x: auto; white-space: pre; margin: 0;
  }

  /* ── Sidebar layout ── */
  .lib-sidebar-layout {
    display: flex;
    align-items: flex-start;
  }
  .lib-sidebar {
    width: 226px;
    flex-shrink: 0;
    border-right: 1px solid ${t.border};
    background: ${t.surface};
    position: sticky;
    top: 53px;
    height: calc(100vh - 53px);
    overflow-y: auto;
    padding: 20px 0 40px;
  }
  .lib-sidebar-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    color: ${t.textDisabled};
    padding: 16px 14px 6px 16px;
    display: block;
  }
  .lib-sidebar-section { margin-bottom: 6px; }
  .lib-sidebar-section-hdr {
    font-family: 'Inter', sans-serif;
    font-size: 11.5px; font-weight: 600;
    color: ${t.textMain};
    padding: 6px 14px 3px;
    letter-spacing: -0.01em;
  }
  .lib-sidebar-item {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 6px;
    margin: 1px 6px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: ${t.textMuted};
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    width: calc(100% - 12px);
    transition: background .1s, color .1s;
  }
  .lib-sidebar-item:hover {
    background: ${t.surfaceHover};
    color: ${t.textMain};
  }
  .lib-sidebar-item.active {
    background: ${t.surfaceHover};
    color: ${t.textMain};
    font-weight: 500;
  }
  .lib-content { flex: 1; min-width: 0; }
`;

// ─────────────────────────────────────────────────────────────────
// APPEARANCE CUSTOMISATION SECTION
// ─────────────────────────────────────────────────────────────────
function AppearanceSection({ t, appearance: appearanceProp, setAppearance: setAppearanceProp }) {
  const [localAp, setLocalAp] = useState({ ...APPEARANCE_DEFAULTS });
  const ap = appearanceProp ?? localAp;
  const setAp = setAppearanceProp ?? setLocalAp;
  const [copied, setCopied] = useState(false);

  const update = (key, val) => setAp(prev => ({ ...prev, [key]: val }));

  // Effective primary — use custom if set, otherwise use the theme token
  const effectivePrimaryColor = ap.primaryColor || t.primary;

  const codeStr =
`const handler = window.DeelComponent.create({
  link: componentLink,
  appearance: {
    primaryColor:        "${ap.primaryColor || 'theme default'}",
    fontFamily:          "${ap.fontFamily}",
    monospaceFontFamily: "${ap.monospaceFontFamily}",
    borderRadius:        ${ap.borderRadius},
    includeLogo:         ${ap.includeLogo},
    includeCloseButton:  ${ap.includeCloseButton},
  },
  onEvent: (event, data) => {
    // handle component events
  },
});`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeStr)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })
      .catch(() => {});
  };

  const br = Number(ap.borderRadius);
  const font = `'${ap.fontFamily}', -apple-system, sans-serif`;
  const monoFont = `'${ap.monospaceFontFamily}', 'Courier New', monospace`;

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 38, height: 22, borderRadius: 999, border: "none", cursor: "pointer",
        background: checked ? effectivePrimaryColor : t.border,
        position: "relative", transition: "background 0.18s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: checked ? 18 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "left 0.18s",
      }} />
    </button>
  );

  const ControlRow = ({ label, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.textMuted }}>
        {label}
      </span>
      {children}
    </div>
  );

  const inputBase = {
    fontFamily: "'Inter', sans-serif", fontSize: 13, padding: "6px 9px",
    border: `1px solid ${t.border}`, borderRadius: 6,
    background: t.inputBg, color: t.textMain, width: "100%",
  };

  // Live preview — mirrors the Check "Bank accounts" screen from the screenshot
  const PreviewWidget = () => (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: br + 4, overflow: "hidden",
      boxShadow: t.shadowMd, fontFamily: font,
    }}>
      {/* Chrome bar */}
      <div style={{
        padding: "11px 16px", borderBottom: `1px solid ${t.border}`,
        background: t.bg, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {ap.includeLogo
          ? <span style={{ fontFamily: monoFont, fontSize: 12, fontWeight: 600, color: t.textMain, background: t.surface, border: `1px solid ${t.border}`, padding: "3px 8px", borderRadius: Math.max(0, br - 2) }}>deel-kit</span>
          : <span />}
        {ap.includeCloseButton
          ? <button type="button" style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 18, lineHeight: 1, padding: 2 }}>×</button>
          : <span />}
      </div>
      {/* Body */}
      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: t.textMain, letterSpacing: "-0.03em", fontFamily: font }}>Bank accounts</div>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>You can deposit and split your wages across up to 7 bank accounts.</div>
        {/* Account row */}
        <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: br, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: Math.max(0, br - 2), background: "#1B3A6B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: monoFont, fontSize: 9, fontWeight: 700, color: "#fff" }}>UMB</span>
          </div>
          <span style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: t.textMain }}>UMB Bank · 8641</span>
          <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>✓</span>
          </div>
        </div>
        {/* Outline action */}
        <button type="button" style={{ fontFamily: font, fontSize: 13, fontWeight: 500, color: t.textMain, background: "transparent", border: `1px solid ${t.border}`, borderRadius: br, padding: "9px 14px", cursor: "pointer", width: "100%" }}>
          + Add bank account
        </button>
        {/* Primary CTA */}
        <button type="button" style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: "#fff", background: effectivePrimaryColor, border: "none", borderRadius: br, padding: "10px 14px", cursor: "pointer", width: "100%" }}>
          Continue →
        </button>
      </div>
    </div>
  );

  return (
    <div className="lib-appearance-section">
      <div className="lib-appearance-header">
        <span className="lib-appearance-eyebrow">Appearance API</span>
        <div className="lib-appearance-title">Customise the look &amp; feel</div>
        <p className="lib-appearance-desc">
          Pass an{" "}
          <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: t.surfaceHover, padding: "1px 5px", borderRadius: 4 }}>appearance</code>{" "}
          object when initialising any Deel component to match your product's brand —
          fonts, colours, corner radius, and chrome visibility — without touching token internals.
          All settings can also be set as account-level defaults so you don't need to pass them on every request.
        </p>
      </div>

      <div className="lib-appearance-layout">
        {/* ── Controls ── */}
        <div className="lib-appearance-controls">
          <div style={{ fontSize: 11.5, fontWeight: 700, color: t.textMain, marginBottom: 14, letterSpacing: "-0.01em" }}>Configuration</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <ControlRow label="primaryColor">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="color" value={ap.primaryColor || effectivePrimaryColor}
                  onChange={e => update("primaryColor", e.target.value)}
                  style={{ width: 34, height: 30, padding: 2, border: `1px solid ${t.border}`, borderRadius: 6, cursor: "pointer", background: t.inputBg, flexShrink: 0 }}
                />
                <input
                  type="text" value={ap.primaryColor || effectivePrimaryColor}
                  onChange={e => update("primaryColor", e.target.value)}
                  style={{ ...inputBase, flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}
                />
                {ap.primaryColor && (
                  <button type="button" onClick={() => update("primaryColor", "")} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textDisabled, fontSize: 14, padding: "0 2px", flexShrink: 0 }} title="Reset to theme default">✕</button>
                )}
              </div>
              {!ap.primaryColor && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: t.textDisabled, letterSpacing: "0.05em" }}>theme default</span>
              )}
            </ControlRow>

            <ControlRow label="fontFamily">
              <input type="text" value={ap.fontFamily} onChange={e => update("fontFamily", e.target.value)} style={inputBase} />
            </ControlRow>

            <ControlRow label="monospaceFontFamily">
              <input type="text" value={ap.monospaceFontFamily} onChange={e => update("monospaceFontFamily", e.target.value)} style={inputBase} />
            </ControlRow>

            <ControlRow label={`borderRadius — ${ap.borderRadius}px`}>
              <input
                type="range" min={0} max={20} step={1} value={ap.borderRadius}
                onChange={e => update("borderRadius", Number(e.target.value))}
                style={{ width: "100%", accentColor: effectivePrimaryColor, cursor: "pointer" }}
              />
            </ControlRow>

            <ControlRow label="includeLogo">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Toggle checked={ap.includeLogo} onChange={v => update("includeLogo", v)} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: t.textMuted }}>{ap.includeLogo ? "true" : "false"}</span>
              </div>
            </ControlRow>

            <ControlRow label="includeCloseButton">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Toggle checked={ap.includeCloseButton} onChange={v => update("includeCloseButton", v)} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: t.textMuted }}>{ap.includeCloseButton ? "true" : "false"}</span>
              </div>
            </ControlRow>

            <button
              type="button"
              onClick={() => setAp({ ...APPEARANCE_DEFAULTS })}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 500, color: t.textMuted, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 7, padding: "6px 12px", cursor: "pointer", marginTop: 4, width: "100%", transition: "border-color .12s" }}
            >
              Reset to defaults
            </button>
          </div>
        </div>

        {/* ── Preview + Code ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, minWidth: 0 }}>

          <div className="lib-appearance-preview-wrap">
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.textMuted, marginBottom: 14 }}>Live Preview</div>
            <div style={{ maxWidth: 380, margin: "0 auto" }}>
              <PreviewWidget />
            </div>
          </div>

          <div className="lib-appearance-code-wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.textMuted }}>Generated Code</span>
              <button
                type="button" onClick={handleCopy}
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: copied ? t.success : t.textMain, background: t.surface, border: `1px solid ${copied ? t.success : t.border}`, borderRadius: 6, padding: "3px 9px", cursor: "pointer", transition: "all .12s" }}
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <pre className="lib-appearance-code">{codeStr}</pre>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LANDING PAGE  — visual showcase, grouped by Wave
// ─────────────────────────────────────────────────────────────────
function LandingPage({ dark, setDark, t, wc, onOpenDocs, onOpenComponent }) {
  const previews = COMPONENT_PREVIEWS(t, (nameOrN) => {
    // MiniFlow calls openDemo(5) — translate wave-number to component name
    if (typeof nameOrN === "number") onOpenComponent("EORContractCreationFlow");
    else onOpenComponent(nameOrN);
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: makeCSS(t, dark) + makeLibraryCSS(t, dark) }} />
      <div style={{ minHeight: "100vh", background: t.bg, color: t.textMain, fontFamily: "'Inter', sans-serif" }}>

        {/* ── Topbar ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 36px", background: t.surface, borderBottom: `1px solid ${t.border}`,
          boxShadow: t.shadow, position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: t.btnText, background: t.primary, padding: "5px 10px", borderRadius: 7 }}>deel-kit</span>
            <span style={{ color: t.textDisabled }}>/</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.textMain, letterSpacing: "-0.02em" }}>Design System</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: t.purple, background: t.purpleBg, padding: "3px 9px", borderRadius: 6 }}>✦ LLM-ready</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button" onClick={onOpenDocs}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
                color: t.textMain, background: t.surface, border: `1px solid ${t.border}`,
                padding: "5px 13px", borderRadius: 8, cursor: "pointer",
                transition: "border-color .12s, background .12s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.textMuted; e.currentTarget.style.background = t.surfaceHover; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.surface; }}
            >
              Documentation <ArrowRight />
            </button>
            <button className="toggle-btn" onClick={() => setDark(d => !d)} type="button">
              {dark ? <Moon /> : <Sun />}
              {dark ? "Dark" : "Light"}
              <div className="track"><div className="thumb" /></div>
            </button>
          </div>
        </div>

        {/* ── Hero ── */}
        <div style={{ padding: "72px 36px 60px", background: t.surface, borderBottom: `1px solid ${t.border}` }}>
          <div style={{ maxWidth: 800 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500,
              letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted,
              marginBottom: 14, display: "block",
            }}>
              Deel Design Foundation · Waves 1 – 5
            </span>
            <h1 style={{
              fontSize: 48, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.08,
              color: t.textMain, marginBottom: 18, margin: "0 0 18px",
            }}>
              Components that<br />
              <span style={{ color: t.purple }}>LLMs build from</span>
            </h1>
            <p style={{ fontSize: 16, color: t.textMuted, lineHeight: 1.65, maxWidth: 580, marginBottom: 36, margin: "0 0 36px" }}>
              {COMPONENT_MANIFEST.length} production-ready components across 5 tiers — from atoms to full EOR flows.
              Every component ships with a structured manifest, live playground, and copy-ready JSX.
            </p>
            {/* Stats row */}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginBottom: 44 }}>
              {[
                { n: COMPONENT_MANIFEST.length,                                            l: "Components" },
                { n: DOMAINS.length - 1,                                                   l: "Domains" },
                { n: COMPONENT_MANIFEST.reduce((s, c) => s + c.props.length, 0),          l: "Documented props" },
                { n: 5,                                                                    l: "Composition tiers" },
              ].map(({ n, l }) => (
                <div key={l} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.04em", color: t.textMain }}>{n}</span>
                  <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>{l}</span>
                </div>
              ))}
            </div>
            {/* Wave journey pills */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
              {WAVES.map((w, i) => {
                const c = wc[w.tagKey];
                return (
                  <div key={w.n} style={{ display: "flex", alignItems: "center" }}>
                    <a
                      href={`#wave-${w.n}`}
                      style={{
                        display: "flex", alignItems: "center", gap: 7,
                        fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
                        color: c.color, background: c.bg, border: `1px solid ${c.color}30`,
                        padding: "6px 16px", borderRadius: 999, textDecoration: "none",
                        transition: "box-shadow .12s",
                      }}
                    >
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.75 }}>W{w.n}</span>
                      {w.name}
                    </a>
                    {i < WAVES.length - 1 && (
                      <span style={{ color: t.border, fontSize: 13, margin: "0 6px" }}>→</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Wave sections ── */}
        {WAVES.map(wave => {
          const c = wc[wave.tagKey];
          const wavePreviews = previews.filter(p => p.wave === `Wave ${wave.n}`);
          return (
            <div key={wave.n} id={`wave-${wave.n}`} style={{ padding: "56px 36px 0", borderBottom: `1px solid ${t.border}` }}>

              {/* Wave header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                      color: c.color, background: c.bg, border: `1px solid ${c.color}30`,
                      padding: "4px 14px", borderRadius: 999,
                    }}>
                      Wave {wave.n}
                    </span>
                    {wave.ai && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 500,
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        color: t.purple, background: t.purpleBg, padding: "3px 9px", borderRadius: 5,
                      }}>✦ AI-powered</span>
                    )}
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: t.textMain, margin: "0 0 8px" }}>
                    {wave.name}
                  </h2>
                  <p style={{ fontSize: 13.5, color: t.textMuted, lineHeight: 1.6, maxWidth: 560, margin: 0 }}>
                    {wave.desc}
                  </p>
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500,
                  color: t.textMuted, background: t.surfaceHover, border: `1px solid ${t.border}`,
                  padding: "5px 12px", borderRadius: 7, alignSelf: "flex-start",
                }}>
                  {wave.tag}
                </span>
              </div>

              {/* Component preview grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 14, paddingBottom: 52,
              }}>
                {wavePreviews.map(p => {
                  const hasDemo = Boolean(COMPONENT_DEMOS[p.name]);
                  return (
                    <div
                      key={p.name}
                      style={{
                        background: t.surface, border: `1px solid ${t.border}`,
                        borderRadius: 12, overflow: "hidden", boxShadow: t.shadow,
                        display: "flex", flexDirection: "column",
                        transition: "box-shadow .14s, transform .14s",
                        cursor: hasDemo ? "pointer" : "default",
                      }}
                      onClick={() => hasDemo && onOpenComponent(p.name)}
                      onMouseEnter={e => { if (hasDemo) { e.currentTarget.style.boxShadow = t.shadowMd; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      {/* Visual preview */}
                      <div style={{
                        padding: "22px 18px", background: t.bg,
                        borderBottom: `1px solid ${t.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        minHeight: 160, overflow: "hidden",
                      }}>
                        {p.preview}
                      </div>

                      {/* Card footer */}
                      <div style={{
                        padding: "12px 16px",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", gap: 8,
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: t.textMain, letterSpacing: "-0.01em" }}>
                            {p.name}
                          </span>
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: t.textMuted,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {p.composed}
                          </span>
                        </div>
                        {hasDemo && (
                          <div style={{
                            display: "flex", alignItems: "center", gap: 5,
                            fontSize: 11.5, fontWeight: 500, color: t.textMain,
                            background: t.bg, border: `1px solid ${t.border}`,
                            padding: "5px 10px", borderRadius: 7,
                            whiteSpace: "nowrap", flexShrink: 0,
                            fontFamily: "'Inter', sans-serif",
                          }}>
                            Open <ArrowRight />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── Documentation CTA ── */}
        <div style={{
          padding: "72px 36px", background: t.surface,
          borderTop: `1px solid ${t.border}`, textAlign: "center",
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase", color: t.textMuted,
            display: "block", marginBottom: 14,
          }}>
            Explore further
          </span>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: t.textMain, margin: "0 0 12px" }}>
            Ready for the full picture?
          </h2>
          <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.65, maxWidth: 480, margin: "0 auto 32px" }}>
            The documentation page lists every component with its complete prop table,
            live playground, code snippets, and the LLM-ready manifest.
          </p>
          <button
            type="button" onClick={onOpenDocs}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
              color: t.btnText, background: t.primary, border: "none",
              padding: "12px 26px", borderRadius: 10, cursor: "pointer",
              transition: "background .12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = t.primaryHover; }}
            onMouseLeave={e => { e.currentTarget.style.background = t.primary; }}
          >
            View Documentation <ArrowRight />
          </button>
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 36px", borderTop: `1px solid ${t.border}`,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: t.textMuted,
        }}>
          <span>Deel Design System · {COMPONENT_MANIFEST.length} components · 5 waves</span>
          <span>atom → molecule → ai-molecule → block → flow ✦</span>
        </div>

      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// SIDEBAR NAV
// ─────────────────────────────────────────────────────────────────
const TIER_ORDER = ["atom", "molecule", "ai-molecule", "block", "flow"];
const TIER_LABELS = {
  "atom":        "Atoms",
  "molecule":    "Molecules",
  "ai-molecule": "AI Molecules",
  "block":       "Blocks",
  "flow":        "Flows",
};

function SidebarNav({ active, onSelect, t }) {
  return (
    <div className="lib-sidebar">
      {TIER_ORDER.map(tier => {
        const comps = COMPONENT_MANIFEST.filter(c => c.tier === tier);
        if (!comps.length) return null;
        const { color, bg } = TIER_COLORS[tier] ?? TIER_COLORS.atom;
        return (
          <div key={tier} className="lib-sidebar-section">
            <div className="lib-sidebar-label" style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {TIER_LABELS[tier]}
              <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: t.textDisabled, fontWeight: 400 }}>
                {comps.length}
              </span>
            </div>
            {comps.map(comp => (
              <button
                key={comp.name}
                type="button"
                className={`lib-sidebar-item${active === comp.name ? " active" : ""}`}
                onClick={() => onSelect(comp.name)}
              >
                {comp.name}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function DeelDesignSystemIndex() {
  const [dark, setDark] = useState(false);
  const [currentDemo, setCurrentDemo] = useState(null); // string: component name
  const [showDocs, setShowDocs]       = useState(false);
  const [demoSource, setDemoSource]   = useState("landing"); // "landing" | "docs"
  const [activeDomain, setActiveDomain] = useState("All");
  const [appearance, setAppearance]   = useState({ ...APPEARANCE_DEFAULTS });
  const t = dark ? darkTokens : lightTokens;
  const appliedT = applyAppearance(t, appearance, dark);
  const wc = WAVE_COLORS(t);

  // ── Landing page ──
  if (!showDocs) {
    return (
      <LandingPage
        dark={dark}
        setDark={setDark}
        t={t}
        wc={wc}
        onOpenDocs={() => { setShowDocs(true); window.scrollTo(0, 0); }}
        onOpenComponent={(name) => { setShowDocs(true); setDemoSource("docs"); setCurrentDemo(name); window.scrollTo(0, 0); }}
      />
    );
  }

  // ── Compute which domains and components to show ──
  const visibleManifest = activeDomain === "All"
    ? COMPONENT_MANIFEST
    : COMPONENT_MANIFEST.filter(c => c.domain === activeDomain);

  const visibleDomains = activeDomain === "All"
    ? DOMAINS.filter(d => d !== "All")
    : [activeDomain];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: makeCSS(t, dark) + makeLibraryCSS(appliedT, dark) + makeCatalogCSS(t) }} />
      <div className="shell">

        {/* ── Top bar ── */}
        <div className="lib-topbar">
          <div className="lib-brand">
            <button
              type="button"
              onClick={() => { setShowDocs(false); window.scrollTo(0, 0); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
                color: t.textMuted, background: "transparent",
                border: `1px solid ${t.border}`, borderRadius: 7,
                padding: "4px 10px", cursor: "pointer",
                transition: "border-color .12s, color .12s",
              }}
            >
              <BackArrow /> Home
            </button>
            <span className="lib-sep">/</span>
            <span className="lib-logo">deel-kit</span>
            <span className="lib-sep">/</span>
            <span className="lib-title">Component Library</span>
            <span className="lib-badge">✦ LLM-ready</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="toggle-btn" onClick={() => setDark(d => !d)} type="button">
              {dark ? <Moon /> : <Sun />}
              {dark ? "Dark" : "Light"}
              <div className="track"><div className="thumb" /></div>
            </button>
          </div>
        </div>

        {/* ── Sidebar layout ── */}
        <div className="lib-sidebar-layout">
          <SidebarNav
            active={currentDemo}
            onSelect={(name) => { setDemoSource("docs"); setCurrentDemo(name); window.scrollTo(0, 0); }}
            t={t}
          />

          <div className="lib-content">
            {currentDemo ? (
              <ComponentPlayground
                key={currentDemo}
                name={currentDemo}
                dark={dark}
                setDark={setDark}
                embedded
                appearance={appearance}
                setAppearance={setAppearance}
                onBack={() => { setCurrentDemo(null); window.scrollTo(0, 0); }}
                onSelectComponent={(n) => { setCurrentDemo(n); window.scrollTo(0, 0); }}
              />
            ) : (<>

        {/* ── Hero ── */}
        <div className="lib-hero">
          <div className="lib-eyebrow">Deel Design System · Foundation for AI Agents</div>
          <h1 className="lib-h1">
            An <em>extensive component library</em><br />that LLMs can build from
          </h1>
          <p className="lib-desc">
            Every component in one place — documented with JSDoc, organized by domain, and backed by a structured
            <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: t.surfaceHover, padding: "1px 5px", borderRadius: 4, margin: "0 3px" }}>COMPONENT_MANIFEST</code>
            that any LLM can consume to compose new EOR flows.
          </p>
          <div className="lib-stats">
            <div className="lib-stat"><span className="lib-stat-n">{COMPONENT_MANIFEST.length}</span><span className="lib-stat-l">Components</span></div>
            <div className="lib-stat"><span className="lib-stat-n">{DOMAINS.length - 1}</span><span className="lib-stat-l">Domains</span></div>
            <div className="lib-stat"><span className="lib-stat-n">{COMPONENT_MANIFEST.reduce((s,c) => s + c.props.length, 0)}</span><span className="lib-stat-l">Documented props</span></div>
            <div className="lib-stat"><span className="lib-stat-n">5</span><span className="lib-stat-l">Composition tiers</span></div>
          </div>
        </div>

        {/* ── Domain tabs ── */}
        <div className="lib-domain-nav">
          {DOMAINS.map(d => (
            <button
              key={d}
              type="button"
              className={`lib-domain-tab${activeDomain === d ? " active" : ""}`}
              onClick={() => setActiveDomain(d)}
            >
              {d}
              {d !== "All" && (
                <span style={{ marginLeft: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, opacity: .7 }}>
                  {COMPONENT_MANIFEST.filter(c => c.domain === d).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Component catalog ── */}
        <div className="lib-body">
          {visibleDomains.map(domain => {
            const components = visibleManifest.filter(c => c.domain === domain);
            if (!components.length) return null;
            return (
              <div key={domain} className="lib-domain-section">
                <div className="lib-domain-header">
                  <span className="lib-domain-label">{domain}</span>
                  <span className="lib-domain-count">{components.length} component{components.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="lib-cards">
                  {components.map(comp => {
                    const { color, bg } = TIER_COLORS[comp.tier] ?? TIER_COLORS.atom;
                    return (
                      <div key={comp.name} className="lib-card">
                        {/* Head */}
                        <div className="lib-card-head">
                          <div className="lib-card-top">
                            <span className="lib-tier-badge" style={{ color, background: bg }}>{comp.tier}</span>
                            {comp.composedOf.length > 0 && (
                              <div className="lib-composed-chips">
                                {comp.composedOf.map(dep => (
                                  <span key={dep} className="lib-composed-chip">{dep}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="lib-card-name">{comp.name}</div>
                          <div className="lib-card-desc">{comp.description}</div>
                        </div>

                        {/* Body: props */}
                        <div className="lib-card-body">
                          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: t.textDisabled, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                            Props ({comp.props.length})
                          </div>
                          <div className="lib-props">
                            {comp.props.slice(0, 6).map(p => (
                              <div key={p.name} className="lib-prop-row">
                                <span className="lib-prop-name">{p.name}</span>
                                <span className="lib-prop-type">{p.type.length > 22 ? p.type.slice(0, 20) + "…" : p.type}</span>
                                {p.required && <span className="lib-prop-req">*req</span>}
                                <span className="lib-prop-desc">{p.description}</span>
                              </div>
                            ))}
                            {comp.props.length > 6 && (
                              <div style={{ fontSize: 11, color: t.textDisabled, fontFamily: "'JetBrains Mono', monospace", paddingTop: 4 }}>
                                +{comp.props.length - 6} more props
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer: usage + demo link */}
                        <div className="lib-card-foot">
                          <div className="lib-usage-snippet" title={comp.usage}>
                            {comp.usage.split("\n")[0]}
                          </div>
                          {COMPONENT_DEMOS[comp.name] && (
                            <button
                              type="button"
                              className="lib-demo-btn"
                              onClick={() => { setDemoSource("docs"); setCurrentDemo(comp.name); window.scrollTo(0, 0); }}
                            >
                              Demo <ArrowRight />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Appearance customisation ── */}
        <AppearanceSection t={t} dark={dark} appearance={appearance} setAppearance={setAppearance} />

        {/* ── COMPONENT_MANIFEST code preview ── */}
        <div className="lib-manifest-section">
          <div className="lib-manifest-box">
            <div className="lib-manifest-title">✦ COMPONENT_MANIFEST — feed this to your LLM</div>
            <p className="lib-manifest-desc">
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: t.surfaceHover, padding: "1px 5px", borderRadius: 4 }}>COMPONENT_MANIFEST</code>{" "}
              is exported from <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: t.surfaceHover, padding: "1px 5px", borderRadius: 4 }}>ComponentLibrary.jsx</code>.
              Pass it as JSON in your system prompt so the model understands every component's domain, tier, props, and composition lineage — enabling accurate component selection and prop usage without hallucination.
            </p>
            <div className="lib-manifest-code">{`import { COMPONENT_MANIFEST } from "./ComponentLibrary";

// In your LLM system prompt or tool call:
const context = JSON.stringify(COMPONENT_MANIFEST, null, 2);

// COMPONENT_MANIFEST shape (${COMPONENT_MANIFEST.length} entries):
// [
//   {
//     "name": "TextInput",
//     "domain": "Forms",
//     "tier": "atom",
//     "description": "...",
//     "composedOf": [],
//     "props": [
//       { "name": "label", "type": "string", "required": false, "description": "..." },
//       ...
//     ],
//     "usage": "<TextInput label=\\"Worker ID\\" required />"
//   },
//   ...
// ]`}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="lib-foot">
          <span>Deel Component Library · {COMPONENT_MANIFEST.length} components · {DOMAINS.length - 1} domains</span>
          <span>atom → molecule → ai-molecule → block → flow ✦</span>
        </div>

            </>)}
          </div>
        </div>

      </div>
    </>
  );
}
