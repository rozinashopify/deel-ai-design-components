import { useState, useEffect, useRef, useCallback } from "react";
import {
  makeLibraryCSS,
  lightTokens as libLightTokens,
  darkTokens as libDarkTokens,
  JobDescriptionBlock,
  CompensationBlock,
  BenefitsBlock,
  MarketRateChart,
  ComplianceCheckPanel,
  StepperRail,
  ContextBanner,
  TextInput,
  DropdownSelect,
} from "./ComponentLibrary.jsx";

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────
const landingDark = {
  bg:           "#09090B",
  bgAlt:        "#0D0D10",
  surface:      "#18181B",
  surfaceHover: "#27272A",
  cardSurface:  "#1C1C1F",
  border:       "#3F3F46",
  borderSubtle: "#27272A",
  textMain:     "#FAFAFA",
  textMuted:    "#A1A1AA",
  textSubtle:   "#71717A",
  purple:       "#A78BFA",
  purpleDeep:   "#7C3AED",
  purpleGlow:   "rgba(167,139,250,0.20)",
  purpleBorder: "rgba(167,139,250,0.30)",
  purpleBg:     "rgba(167,139,250,0.08)",
  successText:  "#4ADE80",
  successBg:    "rgba(74,222,128,0.08)",
  successBorder:"rgba(74,222,128,0.25)",
  errorText:    "#F87171",
  errorBg:      "rgba(248,113,113,0.08)",
  errorBorder:  "rgba(248,113,113,0.25)",
  navBg:        "rgba(9,9,11,0.85)",
  shadow:       "0 1px 3px rgba(0,0,0,0.4)",
  shadowMd:     "0 6px 20px rgba(0,0,0,0.5)",
  shadowLg:     "0 12px 40px rgba(0,0,0,0.6)",
  gold:         "#FCD34D",
  codeKw:       "#A78BFA",
  codeStr:      "#4ADE80",
  codeFn:       "#60A5FA",
  codePunct:    "#71717A",
  codeBg:       "#111113",
};

const landingLight = {
  bg:           "#FFFFFF",
  bgAlt:        "#F8FAFC",
  surface:      "#F4F4F5",
  surfaceHover: "#E4E4E7",
  cardSurface:  "#FFFFFF",
  border:       "#E4E4E7",
  borderSubtle: "#F4F4F5",
  textMain:     "#09090B",
  textMuted:    "#52525B",
  textSubtle:   "#A1A1AA",
  purple:       "#7C3AED",
  purpleDeep:   "#6D28D9",
  purpleGlow:   "rgba(124,58,237,0.12)",
  purpleBorder: "rgba(124,58,237,0.25)",
  purpleBg:     "rgba(124,58,237,0.06)",
  successText:  "#16A34A",
  successBg:    "rgba(22,163,74,0.06)",
  successBorder:"rgba(22,163,74,0.25)",
  errorText:    "#EF4444",
  errorBg:      "rgba(239,68,68,0.06)",
  errorBorder:  "rgba(239,68,68,0.25)",
  navBg:        "rgba(255,255,255,0.88)",
  shadow:       "0 1px 3px rgba(0,0,0,0.08)",
  shadowMd:     "0 4px 16px rgba(0,0,0,0.10)",
  shadowLg:     "0 12px 40px rgba(0,0,0,0.12)",
  gold:         "#D97706",
  codeKw:       "#7C3AED",
  codeStr:      "#16A34A",
  codeFn:       "#2563EB",
  codePunct:    "#A1A1AA",
  codeBg:       "#F4F4F5",
};

// ─────────────────────────────────────────────────────────────────
// CSS GENERATOR
// ─────────────────────────────────────────────────────────────────
function makeLandingCSS(t, isDark) {
  return `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

@font-face {
  font-family: 'BagossCondensed';
  src: url('/Bagoss-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

@keyframes heroGlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@keyframes floatA {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-24px) rotate(3deg); }
}
@keyframes floatB {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-18px) rotate(-2deg); }
  66% { transform: translateY(10px) rotate(1deg); }
}
@keyframes floatC {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-14px); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-32px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes gradShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 ${t.purpleGlow}; }
  50% { box-shadow: 0 0 32px 8px ${t.purpleGlow}; }
}
@keyframes typewriter {
  from { width: 0; }
  to   { width: 100%; }
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
@keyframes arrowPulse {
  0%, 100% { transform: translateX(0); opacity: 0.6; }
  50% { transform: translateX(4px); opacity: 1; }
}
@keyframes countIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes connectorDraw {
  from { width: 0; }
  to   { width: 100%; }
}
@keyframes ringPop {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* ── Shell ── */
.lp-shell {
  min-height: 100vh;
  background: ${t.bg};
  color: ${t.textMain};
  font-family: 'Inter', sans-serif;
  transition: background 0.25s, color 0.25s;
}

/* ── Reveal system ── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);
  transition-delay: calc(var(--i, 0) * 90ms);
}
.reveal.in { opacity: 1; transform: translateY(0); }
.reveal-left {
  opacity: 0; transform: translateX(-28px);
  transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);
  transition-delay: calc(var(--i, 0) * 90ms);
}
.reveal-left.in { opacity: 1; transform: translateX(0); }
.reveal-right {
  opacity: 0; transform: translateX(28px);
  transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);
  transition-delay: calc(var(--i, 0) * 90ms);
}
.reveal-right.in { opacity: 1; transform: translateX(0); }
.reveal-scale {
  opacity: 0; transform: scale(0.93);
  transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
  transition-delay: calc(var(--i, 0) * 80ms);
}
.reveal-scale.in { opacity: 1; transform: scale(1); }

/* ── Nav ── */
.lp-nav {
  position: sticky; top: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 60px;
  background: ${t.navBg};
  border-bottom: 1px solid ${t.border};
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  transition: background 0.25s, border-color 0.25s;
}
.lp-nav-left { display: flex; align-items: center; gap: 12px; }
.lp-logo-wrap { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.lp-logo-icon {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #18181B 0%, #3F3F46 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; color: #FAFAFA;
  flex-shrink: 0;
}
.lp-logo-text { font-size: 15px; font-weight: 700; letter-spacing: -0.03em; color: ${t.textMain}; }
.lp-api-badge {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
  letter-spacing: 0.05em; text-transform: uppercase;
  color: ${t.textSubtle}; background: ${t.surface};
  border: 1px solid ${t.border}; padding: 3px 8px; border-radius: 5px;
}
.lp-nav-center { flex: 1; max-width: 360px; margin: 0 auto; }
.lp-search {
  width: 100%; display: flex; align-items: center; gap: 8px;
  background: ${t.surface}; border: 1px solid ${t.border};
  border-radius: 8px; padding: 7px 12px;
  font-size: 13px; color: ${t.textSubtle};
  transition: border-color 0.15s, box-shadow 0.15s;
}
.lp-search:hover { border-color: ${t.purple}; box-shadow: 0 0 0 3px ${t.purpleGlow}; }
.lp-nav-right { display: flex; align-items: center; gap: 10px; }
.lp-theme-btn {
  width: 34px; height: 34px; border-radius: 8px;
  border: 1px solid ${t.border}; background: ${t.surface};
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: ${t.textMuted};
  transition: border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s;
}
.lp-theme-btn:hover { border-color: ${t.purple}; color: ${t.purple}; transform: rotate(15deg); }
.lp-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, ${t.purple} 0%, #60A5FA 100%);
  font-size: 12px; font-weight: 600; color: #fff;
  display: flex; align-items: center; justify-content: center;
}
.lp-launch-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px;
  background: ${t.purple}; color: #fff;
  font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
  border: none; cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
  box-shadow: 0 2px 8px ${t.purpleGlow};
}
.lp-launch-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px ${t.purpleGlow};
  background: ${t.purpleDeep};
}
.lp-launch-btn:active { transform: translateY(0); }

/* ── Hero ── */
.lp-hero {
  position: relative; overflow: hidden;
  min-height: calc(100vh - 60px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 40px 100px;
  background: ${isDark ? "#09090B" : "#FAFAFA"};
}
.lp-hero-bg {
  position: absolute; inset: 0; pointer-events: none;
}
.lp-hero-dots {
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} 1px, transparent 1px);
  background-size: 32px 32px;
}
.lp-hero-glow {
  position: absolute; border-radius: 50%; pointer-events: none;
  filter: blur(80px);
}
.lp-orb-1 {
  width: 600px; height: 600px;
  top: -200px; right: -100px;
  background: ${isDark ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.08)"};
  animation: floatA 8s ease-in-out infinite;
}
.lp-orb-2 {
  width: 400px; height: 400px;
  bottom: -100px; left: -50px;
  background: ${isDark ? "rgba(96,165,250,0.12)" : "rgba(96,165,250,0.06)"};
  animation: floatB 10s ease-in-out infinite;
}
.lp-orb-3 {
  width: 300px; height: 300px;
  top: 30%; left: 40%;
  background: ${isDark ? "rgba(167,139,250,0.10)" : "rgba(167,139,250,0.05)"};
  animation: floatC 7s ease-in-out infinite;
}
.lp-hero-content {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; gap: 24px;
  max-width: 800px; text-align: center;
}
.lp-hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; border-radius: 100px;
  border: 1px solid ${t.purpleBorder};
  background: ${t.purpleBg};
  font-size: 12px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
  color: ${t.purple};
  animation: fadeIn 0.8s ease both;
}
.lp-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: ${t.purple};
  animation: pulse-glow 2s infinite;
  flex-shrink: 0;
}
.lp-hero-title {
  font-size: clamp(48px, 8vw, 80px);
  font-family: 'BagossCondensed', 'Inter', sans-serif;
  font-weight: 600; line-height: 1.05;
  color: ${t.textMain};
  animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both;
}
.lp-hero-gradient {
  background: linear-gradient(135deg, rgba(160, 109, 255, 1) 0%, ${isDark ? 'rgba(255, 235, 200, 1)' : 'rgba(230, 100, 180, 1)'} 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradShift 4s linear infinite;
}
.lp-hero-sub {
  font-size: clamp(16px, 2.5vw, 20px);
  font-weight: 400; color: ${t.textMuted}; line-height: 1.6;
  max-width: 540px;
  animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both;
}
.lp-hero-ctas {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center;
  animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both;
}
.lp-cta-primary {
  display: flex; align-items: center; gap: 8px;
  padding: 13px 24px; border-radius: 10px;
  background: ${t.purple}; color: #fff;
  font-size: 15px; font-weight: 600; border: none; cursor: pointer;
  box-shadow: 0 4px 16px ${t.purpleGlow};
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
  animation: pulse-glow 3s infinite 1s;
}
.lp-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px ${t.purpleGlow}; background: ${t.purpleDeep}; }
.lp-cta-secondary {
  display: flex; align-items: center; gap: 8px;
  padding: 13px 24px; border-radius: 10px;
  background: transparent; color: ${t.textMain};
  font-size: 15px; font-weight: 600;
  border: 1px solid ${t.border}; cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
}
.lp-cta-secondary:hover { border-color: ${t.purple}; background: ${t.purpleBg}; transform: translateY(-1px); }

/* ── Section commons ── */
.lp-section {
  padding: 100px 40px;
  position: relative;
}
.lp-section-label {
  font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${t.purple}; margin-bottom: 12px;
}
.lp-section-title {
  font-size: clamp(32px, 4.5vw, 52px);
  font-family: 'BagossCondensed', 'Inter', sans-serif;
  font-weight: 500; letter-spacing: -0.03em; line-height: 1.1;
  color: ${t.textMain};
}
.lp-section-sub {
  font-size: 16px; color: ${t.textMuted}; line-height: 1.65;
}

/* ── Problem Section ── */
.lp-problem {
  background: ${isDark ? "#0D0D10" : "#FAFAFA"};
}
.lp-problem-header {
  text-align: center; max-width: 700px; margin: 0 auto 64px;
}
.lp-comparison-rows {
  display: flex; flex-direction: column; gap: 20px;
  max-width: 960px; margin: 0 auto;
}
.lp-cmp-row {
  display: grid; grid-template-columns: 1fr 64px 1fr;
  align-items: stretch; gap: 0;
}
.lp-cmp-card {
  border-radius: 16px; padding: 32px 36px;
  border: 1px solid; position: relative; overflow: hidden;
}
.lp-cmp-card::before {
  content: ""; position: absolute; inset: 0; opacity: 0.06;
  pointer-events: none;
}
.lp-cmp-without {
  background: ${isDark ? "rgba(220,38,38,0.10)" : "rgba(220,38,38,0.06)"};
  border-color: rgba(220,38,38,0.35);
  box-shadow: 0 0 40px rgba(220,38,38,0.15), inset 0 1px 0 rgba(255,255,255,0.04);
}
.lp-cmp-without::before { background: radial-gradient(ellipse at top left, #DC2626 0%, transparent 70%); opacity: 0.12; }
.lp-cmp-with {
  background: ${isDark ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.06)"};
  border-color: rgba(34,197,94,0.40);
  box-shadow: 0 0 40px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.06);
}
.lp-cmp-with::before { background: radial-gradient(ellipse at top right, #22C55E 0%, transparent 70%); opacity: 0.12; }
.lp-cmp-tag {
  font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 5px; display: inline-block; margin-bottom: 14px;
}
.lp-cmp-tag-without {
  background: rgba(220,38,38,0.18); color: #F87171;
  border: 1px solid rgba(220,38,38,0.30);
}
.lp-cmp-tag-with {
  background: rgba(34,197,94,0.15); color: #4ADE80;
  border: 1px solid rgba(34,197,94,0.30);
}
.lp-cmp-stat {
  font-size: 64px; font-weight: 900; line-height: 1;
  letter-spacing: -0.03em; display: block; margin-bottom: 8px;
}
.lp-cmp-without .lp-cmp-stat { color: #F87171; }
.lp-cmp-with .lp-cmp-stat { color: #4ADE80; }
.lp-cmp-text {
  font-size: 15px; font-weight: 500; line-height: 1.5;
  color: ${isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)"};
}
.lp-cmp-arrow {
  display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 4px;
}
.lp-cmp-arrow-icon {
  font-size: 26px; font-weight: 900;
  background: linear-gradient(135deg, #F87171 0%, #A78BFA 50%, #4ADE80 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  animation: arrowPulse 1.8s ease-in-out infinite;
  filter: drop-shadow(0 0 8px rgba(167,139,250,0.6));
}

/* ── How it Works ── */
.lp-hiw {
  background: ${t.bg};
}
.lp-hiw-header { text-align: center; max-width: 640px; margin: 0 auto 72px; }
.lp-hiw-steps {
  display: grid; grid-template-columns: 1fr 48px 1fr 48px 1fr;
  align-items: start; gap: 0;
  max-width: 1100px; margin: 0 auto;
}
.lp-hiw-step { display: flex; flex-direction: column; align-items: center; text-align: center; }
.lp-step-num {
  width: 52px; height: 52px; border-radius: 50%;
  background: ${t.purple}; color: #fff;
  font-size: 20px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px; flex-shrink: 0;
  box-shadow: 0 4px 20px ${t.purpleGlow};
}
.lp-step-num.in { animation: ringPop 0.5s cubic-bezier(0.22,1,0.36,1) both; }
.lp-step-label {
  font-size: 16px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 20px;
  color: ${t.textMain};
}
.lp-step-card {
  width: 100%; border-radius: 14px; overflow: hidden;
  border: 1px solid ${t.border}; background: ${t.cardSurface};
  box-shadow: ${t.shadowMd};
  transition: transform 0.2s, box-shadow 0.2s;
}
.lp-step-card:hover { transform: translateY(-3px); box-shadow: ${t.shadowLg}; }
.lp-step-card-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  border-bottom: 1px solid ${t.border};
  background: ${isDark ? "#111113" : "#F4F4F5"};
}
.lp-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.lp-d-red { background: #F87171; }
.lp-d-yellow { background: #FCD34D; }
.lp-d-green { background: #4ADE80; }
.lp-step-card-title {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
  color: ${t.textSubtle}; margin-left: 4px;
}
.lp-code-block {
  padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7;
  background: ${t.codeBg}; color: ${t.textMuted}; text-align: left;
  overflow: hidden;
}
.lp-kw { color: ${t.codeKw}; }
.lp-str { color: ${t.codeStr}; }
.lp-fn { color: ${t.codeFn}; }
.lp-cm { color: ${t.codePunct}; }
.lp-hiw-connector {
  height: 2px; background: linear-gradient(90deg, ${t.purple} 0%, #60A5FA 100%);
  border-radius: 1px; margin-top: 80px; opacity: 0;
  transition: opacity 0.6s ease, width 0.8s cubic-bezier(0.22,1,0.36,1);
  width: 0%;
}
.lp-hiw-connector.in { opacity: 1; width: 100%; }
.lp-prompt-bubble {
  margin: 16px; border-radius: 10px; padding: 12px 14px;
  background: ${t.purpleBg}; border: 1px solid ${t.purpleBorder};
  font-size: 13px; color: ${t.textMain}; line-height: 1.5;
  text-align: left;
}
.lp-prompt-cursor {
  display: inline-block; width: 2px; height: 13px;
  background: ${t.purple}; margin-left: 2px; vertical-align: text-bottom;
  animation: blink 1s infinite;
}

/* ── Appearance / Theming ── */
.lp-ap { background: ${t.surface}; }
.lp-ap-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 80px; align-items: center;
  max-width: 1100px; margin: 0 auto;
}
.lp-ap-left { display: flex; flex-direction: column; }
.lp-ap-control { margin-bottom: 22px; }
.lp-ap-control-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: ${t.textMuted}; margin-bottom: 10px;
}
.lp-ap-swatches { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.lp-ap-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.lp-ap-snippet {
  margin-top: 28px;
  background: ${isDark ? "#0D0D10" : "#F8FAFC"};
  border: 1px solid ${t.border};
  border-radius: 10px; padding: 14px 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px; line-height: 1.7; color: ${t.textMuted};
}

/* ── Get Started ── */
.lp-gs {
  background: ${isDark ? "#0D0D10" : "#F8FAFC"};
}
.lp-gs-header { max-width: 700px; margin-bottom: 56px; }
.lp-gs-category { margin-bottom: 40px; }
.lp-gs-cat-label {
  font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
  color: ${t.textMuted}; margin-bottom: 16px;
}
.lp-gs-row {
  display: flex; gap: 12px; padding-bottom: 8px;
  scrollbar-width: none;
}
.lp-gs-row::-webkit-scrollbar { display: none; }
.lp-gs-card {
  flex-shrink: 0; border-radius: 12px; overflow: hidden;
  border: 1px solid ${t.border}; background: ${t.cardSurface};
  width: 200px; height: 128px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
  position: relative;
}
.lp-gs-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px ${t.purpleGlow};
  border-color: ${t.purpleBorder};
}
.lp-gs-card-inner {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  padding: 14px;
}
.lp-gs-card-name {
  font-size: 11px; font-weight: 600; letter-spacing: -0.01em;
  color: ${t.textMuted}; margin-bottom: 8px;
}
.lp-gs-mock-bar {
  height: 6px; border-radius: 3px; margin-bottom: 5px;
  background: ${isDark ? "#3F3F46" : "#E4E4E7"};
}
.lp-gs-mock-bar-accent {
  height: 6px; border-radius: 3px; margin-bottom: 5px;
  background: ${t.purple}; opacity: 0.5;
}

/* ── Testimonials ── */
.lp-test {
  background: ${isDark ? "#09090B" : "#FFFFFF"};
}
.lp-test-header { text-align: center; margin-bottom: 56px; }
.lp-test-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px; max-width: 1100px; margin: 0 auto;
}
.lp-test-card {
  border-radius: 14px; padding: 24px;
  background: ${t.cardSurface}; border: 1px solid ${t.border};
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.lp-test-card:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 10px 32px ${t.purpleGlow};
  border-color: ${t.purpleBorder};
}
.lp-stars { display: flex; gap: 3px; margin-bottom: 14px; }
.lp-star { color: ${t.gold}; font-size: 14px; }
.lp-star-empty { color: ${t.border}; }
.lp-test-text {
  font-size: 14px; line-height: 1.65; color: ${t.textMuted}; margin-bottom: 20px;
}
.lp-test-author { display: flex; align-items: center; gap: 10px; }
.lp-test-avatar {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  object-fit: cover;
}
.lp-test-name { font-size: 13px; font-weight: 600; color: ${t.textMain}; }
.lp-test-role { font-size: 12px; color: ${t.textSubtle}; }

/* ── Team ── */
.lp-team {
  background: ${isDark ? "#0D0D10" : "#F8FAFC"};
}
.lp-team-header { text-align: center; margin-bottom: 64px; }
.lp-team-gradient {
  background: linear-gradient(135deg, ${t.purple} 0%, #60A5FA 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.lp-team-grid {
  display: flex; justify-content: center; gap: 32px; flex-wrap: wrap;
}
.lp-team-card {
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; padding: 36px 32px;
  border-radius: 20px; background: ${t.cardSurface};
  border: 1px solid ${t.border};
  min-width: 200px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.lp-team-card:hover {
  border-color: ${t.purpleBorder};
  box-shadow: 0 12px 36px ${t.purpleGlow};
}
.lp-team-card:nth-child(1) { animation: floatA 8s ease-in-out 0s infinite; }
.lp-team-card:nth-child(2) { animation: floatB 9s ease-in-out 0.5s infinite; }
.lp-team-card:nth-child(3) { animation: floatC 7s ease-in-out 1s infinite; }
.lp-team-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 700; color: #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}
.lp-team-name {
  font-size: 16px; font-weight: 700; letter-spacing: -0.02em; color: ${t.textMain};
  text-align: center;
}
.lp-team-role { font-size: 13px; color: ${t.textMuted}; text-align: center; }

/* ── CTA / Early Access ── */
.lp-cta {
  background: ${isDark ? "#09090B" : "#FFFFFF"};
  text-align: center;
}
.lp-cta-inner {
  max-width: 640px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center; gap: 24px;
}
.lp-slack-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 28px; border-radius: 12px;
  background: ${t.surface}; border: 1px solid ${t.border};
  font-size: 15px; font-weight: 600; color: ${t.textMain};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.15s, box-shadow 0.15s;
}
.lp-slack-btn:hover {
  border-color: ${t.purple};
  background: ${t.purpleBg};
  transform: translateY(-2px);
  box-shadow: 0 8px 28px ${t.purpleGlow};
}
.lp-fine-print {
  font-size: 13px; color: ${t.textSubtle};
}
.lp-cta-glow {
  position: absolute; top: 50%; left: 50%; pointer-events: none;
  width: 600px; height: 300px;
  transform: translate(-50%, -50%);
  background: radial-gradient(ellipse, ${t.purpleGlow} 0%, transparent 70%);
  filter: blur(40px);
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .lp-nav { padding: 0 20px; }
  .lp-nav-center { display: none; }
  .lp-section { padding: 72px 24px; }
  .lp-cmp-row { grid-template-columns: 1fr; gap: 8px; }
  .lp-cmp-arrow { display: none; }
  .lp-hiw-steps { grid-template-columns: 1fr; gap: 40px; }
  .lp-hiw-connector { display: none; }
  .lp-test-grid { grid-template-columns: 1fr; }
  .lp-team-grid { gap: 20px; }
  .lp-team-card { animation: none !important; }
  .lp-ap-grid { grid-template-columns: 1fr; gap: 40px; }
}
@media (max-width: 640px) {
  .lp-hero { padding: 60px 24px 80px; min-height: auto; }
  .lp-hero-title { font-size: 40px; }
  .lp-hero-ctas { flex-direction: column; width: 100%; }
  .lp-cta-primary, .lp-cta-secondary { width: 100%; justify-content: center; }
}

/* ── Component previews ── */
.lp-preview-card {
  flex-shrink: 0; border-radius: 14px; overflow: hidden;
  border: 1px solid ${t.border}; position: relative; cursor: pointer;
  background: ${t.cardSurface};
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.lp-preview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px ${t.purpleGlow};
  border-color: ${t.purpleBorder};
}
.lp-preview-inner {
  position: absolute; top: 0; left: 0;
  pointer-events: none; user-select: none;
  transform-origin: top left;
}
.lp-preview-fade {
  position: absolute; bottom: 0; left: 0; right: 0; height: 72px;
  background: linear-gradient(to bottom, transparent, ${t.cardSurface});
  pointer-events: none;
}
`;
}

// ─────────────────────────────────────────────────────────────────
// CSS COMBINER  (keeps @imports at the top, same as Index.jsx)
// ─────────────────────────────────────────────────────────────────
function combineCSS(...parts) {
  const IMPORT_RE = /@import\s+url\([^)]+\)\s*;?/g;
  const imports = [], rules = [];
  for (const css of parts) {
    imports.push(...(css.match(IMPORT_RE) || []));
    rules.push(css.replace(IMPORT_RE, ""));
  }
  return [...new Set(imports)].join("\n") + rules.join("");
}

// ─────────────────────────────────────────────────────────────────
// COMPONENT PREVIEW WRAPPER
// ─────────────────────────────────────────────────────────────────
const COMING_SOON_FLOWS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    name: "Contractor Agreement",
    desc: "Self-service contractor onboarding with compliance checks, agreement generation, and payment setup.",
    features: ["Contractor classification check", "Agreement generation", "Invoice management", "Payment scheduling"],
    complexity: "Low", shipTime: "~1 day", countries: "150+",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    name: "Global Payroll Setup",
    desc: "Configure payroll schedules, currencies, and payment methods for employees across multiple countries.",
    features: ["Multi-currency payroll", "Tax withholding automation", "Payslip generation", "Bank account management"],
    complexity: "Medium", shipTime: "~5 days", countries: "90+",
  },
];

function ComingSoonFlowCard({ t, flow }) {
  return (
    <div style={{
      background: t.cardSurface, border: `1px solid ${t.border}`,
      borderRadius: 12, overflow: "hidden",
      display: "flex", flexDirection: "column",
      width: 340, opacity: 0.72,
    }}>
      {/* Header */}
      <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: t.surface, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, flexShrink: 0 }}>
          {flow.icon}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, color: t.textMuted, border: `1px solid ${t.border}`, borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap", marginTop: 6 }}>Coming soon</span>
      </div>

      {/* Body */}
      <div style={{ padding: "0 18px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700, color: t.textMain, marginBottom: 6, letterSpacing: "-0.01em" }}>{flow.name}</div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: t.textMuted, lineHeight: 1.55 }}>{flow.desc}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {flow.features.map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.textSubtle} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11.5, color: t.textMuted }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
          {[["Complexity", flow.complexity], ["Ship time", flow.shipTime], ["Countries", flow.countries]].map(([label, value]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: t.textSubtle }}>{label}</span>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: t.textMuted }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer button */}
      <div style={{ padding: "0 18px 18px" }}>
        <div style={{ width: "100%", padding: "9px 0", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 500, color: t.textMuted, textAlign: "center", cursor: "default" }}>
          Notify me when available
        </div>
      </div>
    </div>
  );
}

function MiniFlowCard({ t, libT, onOpen }) {
  const steps = ["Personal", "Job details", "Compensation", "Benefits"];
  return (
    <div
      style={{
        background: t.cardSurface, border: `1px solid ${t.border}`,
        borderRadius: 12, overflow: "hidden", boxShadow: t.shadow,
        display: "flex", flexDirection: "column",
        transition: "box-shadow .14s, transform .14s", cursor: "pointer",
        width: 340,
      }}
      onClick={onOpen}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = t.shadowMd; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = t.shadow; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Visual preview area */}
      <div style={{
        padding: "22px 18px", background: t.surface,
        borderBottom: `1px solid ${t.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: 160, overflow: "hidden",
      }}>
        <div style={{ background: libT.surface, border: `1px solid ${libT.border}`, borderRadius: 12, overflow: "hidden", width: "100%" }}>
          <div style={{ background: libT.bg, padding: "8px 14px", borderBottom: `1px solid ${libT.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["#E4E4E7", "#E4E4E7", "#E4E4E7"].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: libT.textMuted, letterSpacing: "0.06em" }}>EOR Contract Creation</span>
            <span />
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ width: 114, borderRight: `1px solid ${libT.border}`, padding: "12px 10px", display: "flex", flexDirection: "column" }}>
              {steps.map((s, i) => {
                const done = i < 1, active = i === 1;
                return (
                  <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${done ? libT.success : active ? libT.primary : libT.border}`, background: done ? libT.successBg : active ? libT.surface : libT.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: done ? libT.success : active ? libT.primary : libT.textDisabled }}>
                        {done ? "✓" : i + 1}
                      </div>
                      {i < steps.length - 1 && <div style={{ width: 1, height: 14, background: done ? libT.success : libT.border }} />}
                    </div>
                    <div style={{ fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: active ? 600 : 400, color: active ? libT.textMain : libT.textMuted, paddingTop: 1 }}>{s}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 120 }}>
              <div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 12.5, fontWeight: 700, color: libT.textMain, marginBottom: 3 }}>Job details</div>
                <div style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: libT.textMuted, marginBottom: 10, lineHeight: 1.4 }}>Describe the role and responsibilities.</div>
                <div style={{ background: libT.bg, border: `1px solid ${libT.border}`, borderRadius: 7, height: 28 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <button type="button" style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: libT.textMuted, background: "transparent", border: `1px solid ${libT.border}`, borderRadius: 7, padding: "4px 10px", cursor: "pointer" }}>Back</button>
                <button type="button" onClick={e => { e.stopPropagation(); onOpen(); }} style={{ fontFamily: "Inter,sans-serif", fontSize: 11, fontWeight: 600, color: libT.btnText, background: libT.primary, border: "none", borderRadius: 7, padding: "4px 10px", cursor: "pointer" }}>Open full flow</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Card footer */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.textMain, letterSpacing: "-0.01em" }}>EORContractCreationFlow</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: t.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>All blocks + StepperRail + AutosaveWidget</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 500, color: t.textMain, background: t.surface, border: `1px solid ${t.border}`, padding: "5px 10px", borderRadius: 7, whiteSpace: "nowrap", flexShrink: 0, fontFamily: "'Inter',sans-serif" }}>
          Open →
        </div>
      </div>
    </div>
  );
}

function ComponentPreview({ scale = 0.5, width, height, onClick, children }) {
  return (
    <div className="lp-preview-card" style={{ width, height }} onClick={onClick}>
      <div className="lp-preview-inner" style={{ width: width / scale, transform: `scale(${scale})` }}>
        {children}
      </div>
      <div className="lp-preview-fade" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setOffset(window.scrollY * speed); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return offset;
}

function useCounter(target, duration = 1400, enabled = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    setValue(0);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, enabled]);
  return value;
}

// ─────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────
function LandingNav({ dark, toggleDark, onLaunchDemo }) {
  return (
    <nav className="lp-nav">
      <div className="lp-nav-left">
        <div className="lp-logo-wrap">
          <div className="lp-logo-icon">d</div>
          <span className="lp-logo-text">deel</span>
        </div>
        <span className="lp-api-badge">API</span>
      </div>

      <div className="lp-nav-right">
        <button className="lp-theme-btn" onClick={toggleDark} title={dark ? "Light mode" : "Dark mode"}>
          {dark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        <button className="lp-launch-btn" onClick={() => onLaunchDemo()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Launch demo
        </button>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────
function HeroSection({ t, onLaunchDemo }) {
  const parallaxSlow = useParallax(0.15);
  const parallaxFast = useParallax(0.28);
  return (
    <section className="lp-hero lp-section">
      <div className="lp-hero-bg">
        <div className="lp-hero-dots" />
        <div
          className="lp-hero-glow lp-orb-1"
          style={{ transform: `translateY(${parallaxSlow}px)` }}
        />
        <div
          className="lp-hero-glow lp-orb-2"
          style={{ transform: `translateY(${-parallaxFast}px)` }}
        />
        <div
          className="lp-hero-glow lp-orb-3"
          style={{ transform: `translateY(${parallaxSlow * 0.5}px)` }}
        />
      </div>

      <div className="lp-hero-content">
        <div className="lp-hero-eyebrow">
          <span className="lp-eyebrow-dot" />
          Vision Sprint 2026 Q1 · Internal Preview
        </div>

        <h1 className="lp-hero-title">
          <span className="lp-hero-gradient">Deel Kit: AI builder</span>
        </h1>

        <p className="lp-hero-sub">
          Ship branded, compliant, EOR and global payroll flows in a few days.
          One package. One prompt. Zero integrations from scratch.
        </p>

        <div className="lp-hero-ctas">
          <button className="lp-cta-primary" onClick={() => document.getElementById("lp-problem")?.scrollIntoView({ behavior: "smooth" })}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            Start exploring
          </button>
          <button className="lp-cta-secondary" onClick={() => onLaunchDemo()}>
            Launch demo ✦
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// PROBLEM SECTION
// ─────────────────────────────────────────────────────────────────
const COMPARISONS = [
  {
    without: { stat: "67%", text: "of mid-market HR platforms cite 'time-to-build' as their #1 barrier" },
    with: { stat: "99%", text: "faster implementation of payroll and EOR" },
  },
  {
    without: { stat: "7+", text: "integrations today to build one flow" },
    with: { stat: "1", text: "integration for a full flow" },
  },
  {
    without: { stat: "3 months", text: "of 5 engineers work" },
    with: { stat: "1–2 days", text: "ship with one dev" },
  },
];

function ComparisonRow({ row, idx, inView }) {
  const delay = idx * 200;
  const ease = "cubic-bezier(0.22,1,0.36,1)";
  const leftStyle = {
    opacity:    inView ? 1 : 0,
    transform:  inView ? "translateX(0)" : "translateX(-36px)",
    transition: `opacity 0.65s ${ease} ${delay}ms, transform 0.65s ${ease} ${delay}ms`,
  };
  const rightStyle = {
    opacity:    inView ? 1 : 0,
    transform:  inView ? "translateX(0)" : "translateX(36px)",
    transition: `opacity 0.65s ${ease} ${delay + 80}ms, transform 0.65s ${ease} ${delay + 80}ms`,
  };
  const arrowStyle = {
    opacity:    inView ? 1 : 0,
    transition: `opacity 0.4s ease ${delay + 40}ms`,
  };

  return (
    <div className="lp-cmp-row">
      <div className="lp-cmp-card lp-cmp-without" style={leftStyle}>
        <span className="lp-cmp-tag lp-cmp-tag-without">Without DeelKit</span>
        <span className="lp-cmp-stat">{row.without.stat}</span>
        <div className="lp-cmp-text">{row.without.text}</div>
      </div>

      <div className="lp-cmp-arrow" style={arrowStyle}>
        <span className="lp-cmp-arrow-icon">→</span>
      </div>

      <div className="lp-cmp-card lp-cmp-with" style={rightStyle}>
        <span className="lp-cmp-tag lp-cmp-tag-with">With DeelKit</span>
        <span className="lp-cmp-stat">{row.with.stat}</span>
        <div className="lp-cmp-text">{row.with.text}</div>
      </div>
    </div>
  );
}

function ProblemSection({ t }) {
  const [ref, inView] = useScrollReveal(0.1);
  return (
    <section id="lp-problem" className="lp-section lp-problem">
      <div ref={ref}>
        <div className={`lp-problem-header reveal ${inView ? "in" : ""}`}>
          <p className="lp-section-label">The problem</p>
          <h2 className="lp-section-title">
            Why building this today<br />costs more than you think
          </h2>
        </div>
        <div className="lp-comparison-rows">
          {COMPARISONS.map((row, i) => (
            <ComparisonRow key={i} row={row} idx={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────────
function StepCard({ title, children }) {
  return (
    <div className="lp-step-card">
      <div className="lp-step-card-header">
        <div className="lp-dot lp-d-red" />
        <div className="lp-dot lp-d-yellow" />
        <div className="lp-dot lp-d-green" />
        <span className="lp-step-card-title">{title}</span>
      </div>
      {children}
    </div>
  );
}

function HowItWorksSection({ t }) {
  const [ref, inView] = useScrollReveal(0.1);
  return (
    <section className="lp-section lp-hiw">
      <div ref={ref}>
        <div className={`lp-hiw-header reveal ${inView ? "in" : ""}`}>
          <p className="lp-section-label">How it works</p>
          <h2 className="lp-section-title">From zero to live<br />in a single prompt</h2>
          <p className="lp-section-sub" style={{ marginTop: 16 }}>
            Install the package, then ask your AI to wire it up. DeelKit ships with
            a structured manifest every LLM can read — so the right component,
            props, and onComplete handler are always generated first time.
          </p>
        </div>

        <div className="lp-hiw-steps">
          {/* Step 1 */}
          <div className={`lp-hiw-step reveal ${inView ? "in" : ""}`} style={{ "--i": 0 }}>
            <div className={`lp-step-num ${inView ? "in" : ""}`} style={{ transitionDelay: "150ms" }}>1</div>
            <div className="lp-step-label">Install</div>
            <StepCard title="terminal">
              <div className="lp-code-block">
                <span className="lp-cm">$ </span>
                <span className="lp-str">npm install</span>
                {" "}
                <span className="lp-fn">@deelkit/ui</span>
                {"\n\n"}
                <span className="lp-cm">+ @deelkit/ui@2.1.0</span>
                {"\n"}
                <span className="lp-cm">✓ added 1 package</span>
                {"\n"}
                <span className="lp-cm">✓ manifest injected</span>
                {"\n"}
                <span className="lp-cm">✓ ready</span>
              </div>
            </StepCard>
          </div>

          {/* Connector 1 */}
          <div className={`lp-hiw-connector ${inView ? "in" : ""}`} style={{ transitionDelay: "400ms" }} />

          {/* Step 2 */}
          <div className={`lp-hiw-step reveal ${inView ? "in" : ""}`} style={{ "--i": 1 }}>
            <div className={`lp-step-num ${inView ? "in" : ""}`} style={{ transitionDelay: "250ms" }}>2</div>
            <div className="lp-step-label">Prompt</div>
            <StepCard title="ai chat">
              <div className="lp-prompt-bubble">
                "Add an EOR contract flow for hiring in Brazil with compliance
                checks and salary benchmarking"
                <span className="lp-prompt-cursor" />
              </div>
              <div className="lp-code-block" style={{ fontSize: 11, paddingTop: 8 }}>
                <span className="lp-kw">import</span>
                {" { "}
                <span className="lp-fn">EORContractCreationFlow</span>
                {" } "}
                <span className="lp-kw">from</span>
                {" "}
                <span className="lp-str">'@deelkit/ui'</span>
              </div>
            </StepCard>
          </div>

          {/* Connector 2 */}
          <div className={`lp-hiw-connector ${inView ? "in" : ""}`} style={{ transitionDelay: "600ms" }} />

          {/* Step 3 */}
          <div className={`lp-hiw-step reveal ${inView ? "in" : ""}`} style={{ "--i": 2 }}>
            <div className={`lp-step-num ${inView ? "in" : ""}`} style={{ transitionDelay: "350ms" }}>3</div>
            <div className="lp-step-label">Ship</div>
            <StepCard title="app.jsx">
              <div className="lp-code-block">
                <span className="lp-kw">return</span>
                {" (\n  "}
                <span className="lp-fn">{"<EORContractCreationFlow"}</span>
                {"\n    "}
                <span className="lp-str">country</span>
                {"="}
                <span className="lp-kw">"BR"</span>
                {"\n    "}
                <span className="lp-str">onComplete</span>
                {"={"}
                <span className="lp-fn">handleDone</span>
                {"}\n    "}
                <span className="lp-str">appearance</span>
                {"={"}
                <span className="lp-fn">brandTheme</span>
                {"}"}
                {"\n  "}
                <span className="lp-fn">{"/>"}</span>
                {"\n)"}
              </div>
            </StepCard>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// GET STARTED
// ─────────────────────────────────────────────────────────────────
const COMPLIANCE_SAMPLES = [
  { rule: "Salary meets Brazil minimum wage requirements", status: "pass" },
  { rule: "Job title aligns with CLT classification", status: "pass" },
  { rule: "Non-compete clause validity under local law", status: "fail", detail: "Non-compete clauses are unenforceable in Brazil under CLT" },
  { rule: "Benefits package complies with CLT regulations", status: "checking" },
];

const EOR_STEPS = [
  { label: "Personal details" },
  { label: "Job details" },
  { label: "Compensation" },
  { label: "Benefits & extras" },
];

// ─────────────────────────────────────────────────────────────────
// APPEARANCE SECTION
// ─────────────────────────────────────────────────────────────────
const AP_PRESETS = [
  { label: "Violet",  value: "#7C3AED" },
  { label: "Blue",    value: "#2563EB" },
  { label: "Emerald", value: "#059669" },
  { label: "Rose",    value: "#E11D48" },
  { label: "Amber",   value: "#D97706" },
];
const AP_FONTS = ["Inter", "DM Sans", "Geist"];
const AP_RADII = [0, 4, 8, 14, 20];

function AppearanceSection({ t, dark }) {
  const [ref, inView] = useScrollReveal(0.15);
  const [primary, setPrimary] = useState("#7C3AED");
  const [radius,  setRadius]  = useState(8);
  const [font,    setFont]    = useState("Inter");

  const bg      = dark ? "#1C1C1F" : "#FFFFFF";
  const bgInput = dark ? "#18181B" : "#F9FAFB";
  const border  = dark ? "#3F3F46" : "#E4E4E7";
  const text    = dark ? "#FAFAFA" : "#09090B";
  const muted   = dark ? "#A1A1AA" : "#71717A";

  return (
    <section className="lp-section lp-ap">
      <div ref={ref}>
        <div className={`lp-ap-grid reveal ${inView ? "in" : ""}`}>

          {/* ── Left: copy + controls ── */}
          <div className="lp-ap-left">
            <p className="lp-section-label">Theming</p>
            <h2 className="lp-section-title">White-label<br />out of the box</h2>
            <p className="lp-section-sub" style={{ marginBottom: 36 }}>
              Pass an <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88em", background: dark ? "#27272A" : "#F4F4F5", padding: "1px 6px", borderRadius: 4 }}>appearance</code> object to any component — primary colour, border radius, font family, spacing scale — and every token updates instantly. No CSS overrides, no !important hacks.
            </p>

            {/* Primary colour */}
            <div className="lp-ap-control">
              <div className="lp-ap-control-label">Primary colour</div>
              <div className="lp-ap-swatches">
                {AP_PRESETS.map(p => (
                  <button
                    key={p.value} title={p.label}
                    onClick={() => setPrimary(p.value)}
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: p.value, cursor: "pointer",
                      border: primary === p.value ? `3px solid ${dark ? "#fff" : "#09090B"}` : "3px solid transparent",
                      outline: primary === p.value ? `2px solid ${p.value}` : "none",
                      outlineOffset: 2,
                      transition: "transform 0.12s",
                      transform: primary === p.value ? "scale(1.18)" : "scale(1)",
                    }}
                  />
                ))}
                <input
                  type="color" value={primary}
                  onChange={e => setPrimary(e.target.value)}
                  title="Custom colour"
                  style={{ width: 28, height: 28, borderRadius: "50%", border: "none", padding: 0, cursor: "pointer", background: "none" }}
                />
              </div>
            </div>

            {/* Border radius */}
            <div className="lp-ap-control">
              <div className="lp-ap-control-label">Border radius — {radius}px</div>
              <div className="lp-ap-chips">
                {AP_RADII.map(r => (
                  <button
                    key={r} onClick={() => setRadius(r)}
                    style={{
                      padding: "4px 12px", borderRadius: 6,
                      border: `1px solid ${radius === r ? primary : border}`,
                      background: radius === r ? primary + "18" : "transparent",
                      color: radius === r ? primary : muted,
                      fontSize: 12, fontFamily: "inherit", cursor: "pointer",
                      transition: "all 0.12s", fontWeight: radius === r ? 600 : 400,
                    }}
                  >{r}</button>
                ))}
              </div>
            </div>

            {/* Font family */}
            <div className="lp-ap-control">
              <div className="lp-ap-control-label">Font family</div>
              <div className="lp-ap-chips">
                {AP_FONTS.map(f => (
                  <button
                    key={f} onClick={() => setFont(f)}
                    style={{
                      padding: "4px 14px", borderRadius: 6,
                      border: `1px solid ${font === f ? primary : border}`,
                      background: font === f ? primary + "18" : "transparent",
                      color: font === f ? primary : muted,
                      fontSize: 12, fontFamily: f + ", sans-serif", cursor: "pointer",
                      transition: "all 0.12s", fontWeight: font === f ? 600 : 400,
                    }}
                  >{f}</button>
                ))}
              </div>
            </div>

            {/* Live code snippet */}
            <div className="lp-ap-snippet">
              <span style={{ color: dark ? "#60A5FA" : "#2563EB" }}>const</span>{" "}
              <span style={{ color: dark ? "#F87171" : "#DC2626" }}>appearance</span>{" = {{"}<br />
              {"  "}<span style={{ color: dark ? "#86EFAC" : "#16A34A" }}>primaryColor</span>{": "}
              <span style={{ color: dark ? "#FCD34D" : "#D97706" }}>"{primary}"</span>,<br />
              {"  "}<span style={{ color: dark ? "#86EFAC" : "#16A34A" }}>borderRadius</span>{": "}
              <span style={{ color: dark ? "#C084FC" : "#7C3AED" }}>{radius}</span>,<br />
              {"  "}<span style={{ color: dark ? "#86EFAC" : "#16A34A" }}>fontFamily</span>{": "}
              <span style={{ color: dark ? "#FCD34D" : "#D97706" }}>"{font}"</span>,<br />
              {"}}"}
            </div>
          </div>

          {/* ── Right: live mock preview ── */}
          <div className="lp-ap-right">
            <div style={{
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 16,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              fontFamily: font + ", sans-serif",
              boxShadow: dark
                ? "0 0 0 1px rgba(255,255,255,0.04), 0 24px 48px rgba(0,0,0,0.4)"
                : "0 4px 40px rgba(0,0,0,0.08)",
            }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: text, fontFamily: "inherit" }}>Add team member</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "inherit" }}>Full name</label>
                <div style={{ border: `1.5px solid ${border}`, borderRadius: radius, padding: "9px 12px", fontSize: 13.5, color: text, background: bgInput, fontFamily: "inherit", transition: "border-radius 0.2s" }}>
                  Sofia Andrade
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "inherit" }}>Country</label>
                <div style={{ border: `1.5px solid ${border}`, borderRadius: radius, padding: "9px 12px", fontSize: 13.5, color: text, background: bgInput, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit", transition: "border-radius 0.2s" }}>
                  <span>Brazil</span><span style={{ color: muted }}>▾</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "inherit" }}>Employment type</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["EOR", "Contractor", "Direct"].map((opt, i) => (
                    <div key={opt} style={{
                      flex: 1, textAlign: "center",
                      border: `1.5px solid ${i === 0 ? primary : border}`,
                      borderRadius: radius,
                      padding: "8px 4px", fontSize: 12.5,
                      color: i === 0 ? primary : muted,
                      background: i === 0 ? primary + "14" : bgInput,
                      fontFamily: "inherit",
                      fontWeight: i === 0 ? 600 : 400,
                      transition: "all 0.2s",
                    }}>{opt}</div>
                  ))}
                </div>
              </div>

              <button style={{
                width: "100%", padding: "11px 0",
                background: primary, color: "#fff",
                border: "none", borderRadius: radius,
                fontSize: 13.5, fontWeight: 600,
                fontFamily: "inherit", cursor: "pointer", marginTop: 4,
                transition: "background 0.2s, border-radius 0.2s",
              }}>Continue →</button>
            </div>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: t.textMuted, fontFamily: "'Inter', sans-serif" }}>
              live preview · powered by DeelKit
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function GetStartedSection({ t, libT, onLaunchDemo }) {
  const [ref, inView] = useScrollReveal(0.1);
  return (
    <section className="lp-section lp-gs">
      <div ref={ref}>
        <div className={`lp-gs-header reveal ${inView ? "in" : ""}`}>
          <p className="lp-section-label">Explore</p>
          <h2 className="lp-section-title">Get started</h2>
          <p className="lp-section-sub" style={{ marginTop: 12 }}>
            Explore flows, blocks, and all components available!
          </p>
        </div>

        {/* ── Flows ── */}
        <div className={`lp-gs-category reveal ${inView ? "in" : ""}`} style={{ "--i": 0 }}>
          <div className="lp-gs-cat-label">Flows</div>
          <div className="lp-gs-row">
            <MiniFlowCard t={t} libT={libT} onOpen={() => onLaunchDemo("EORContractCreationFlow")} />
            {COMING_SOON_FLOWS.map(flow => (
              <ComingSoonFlowCard key={flow.name} t={t} flow={flow} />
            ))}
          </div>
        </div>

        {/* ── Blocks ── */}
        <div className={`lp-gs-category reveal ${inView ? "in" : ""}`} style={{ "--i": 1 }}>
          <div className="lp-gs-cat-label">Blocks</div>
          <div className="lp-gs-row">
            <ComponentPreview scale={0.52} width={340} height={260} onClick={() => onLaunchDemo("JobDescriptionBlock")}>
              <JobDescriptionBlock defaultTitle="Senior Engineer" defaultSeniority="senior" />
            </ComponentPreview>
            <ComponentPreview scale={0.52} width={340} height={260} onClick={() => onLaunchDemo("CompensationBlock")}>
              <CompensationBlock country="Brazil" defaultSalary={58400} showMarketInsights />
            </ComponentPreview>
            <ComponentPreview scale={0.52} width={340} height={260} onClick={() => onLaunchDemo("BenefitsBlock")}>
              <BenefitsBlock country="Germany" />
            </ComponentPreview>
          </div>
        </div>

        {/* ── Components ── */}
        <div className={`lp-gs-category reveal ${inView ? "in" : ""}`} style={{ "--i": 2 }}>
          <div className="lp-gs-cat-label">Components</div>
          <div className="lp-gs-row">
            <ComponentPreview scale={0.7} width={280} height={220} onClick={() => onLaunchDemo("MarketRateChart")}>
              <div style={{ padding: "16px 16px 0" }}>
                <MarketRateChart salary={72000} country="Germany" seniority="Senior" jobTitle="Engineer" />
              </div>
            </ComponentPreview>
            <ComponentPreview scale={0.62} width={280} height={220} onClick={() => onLaunchDemo("ComplianceCheckPanel")}>
              <div style={{ padding: 16 }}>
                <ComplianceCheckPanel results={COMPLIANCE_SAMPLES} />
              </div>
            </ComponentPreview>
            <ComponentPreview scale={0.82} width={280} height={220} onClick={() => onLaunchDemo("StepperRail")}>
              <div style={{ padding: "20px 16px" }}>
                <StepperRail steps={EOR_STEPS} currentStep={2} />
              </div>
            </ComponentPreview>
            <ComponentPreview scale={0.78} width={280} height={220} onClick={() => onLaunchDemo("ContextBanner")}>
              <div style={{ padding: 16 }}>
                <ContextBanner variant="insight" title="Brazil hiring guide" body="Non-compete clauses aren't enforceable. Fixed-term contracts require justification." ctaLabel="Read guide" />
              </div>
            </ComponentPreview>
            <ComponentPreview scale={0.82} width={280} height={220} onClick={() => onLaunchDemo("TextInput")}>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <TextInput label="Job title" placeholder="e.g. Senior Engineer" />
                <DropdownSelect label="Seniority" options={["Junior", "Mid", "Senior", "Staff"]} />
              </div>
            </ComponentPreview>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    stars: 4,
    text: "The component manifest is what makes this actually usable for AI-assisted development. I can match a hiring scenario to the right flow without guessing. That discoverability is rare — and it matters.",
    name: "Claude (Sonnet)", role: "Code Generation Agent · Anthropic",
    color: "linear-gradient(135deg, #7C3AED, #A78BFA)",
  },
  {
    stars: 4,
    text: "Every field carries semantic weight — I'm not just reading a label, I'm understanding why it exists. That lets me reason about compliance correctness, not just render a form. That's the difference between a UI kit and a knowledge system.",
    name: "Claude (Sonnet)", role: "Compliance Reasoning Agent · Anthropic",
    color: "linear-gradient(135deg, #059669, #34D399)",
  },
  {
    stars: 5,
    text: "White-label theming via design tokens means I can help teams customize their integration without touching core flow logic. The separation of concerns isn't just good architecture — it's what makes safe AI-assisted customization possible.",
    name: "Claude (Sonnet)", role: "Documentation Agent · Anthropic",
    color: "linear-gradient(135deg, #EA580C, #FB923C)",
  },
  {
    stars: 3,
    text: "When I retry a failed step, I need to know nothing was duplicated. Idempotency isn't a nice-to-have for agentic workflows — it's the contract that lets me act without asking the user to verify every side effect manually.",
    name: "Claude (Sonnet)", role: "Automation Agent · Anthropic",
    color: "linear-gradient(135deg, #2563EB, #60A5FA)",
  },
  {
    stars: 3,
    text: "Structured error states with machine-readable codes are what separate a system I can debug from one I can only apologize about. When a flow fails, I need to explain why and suggest a recovery path — not just surface a string.",
    name: "Claude (Sonnet)", role: "Debugging Agent · Anthropic",
    color: "linear-gradient(135deg, #D97706, #FCD34D)",
  },
  {
    stars: 3,
    text: "The honest gap I'd push on: TypeScript definitions and a spec for valid prop combinations. Right now I can read the components, but I can't yet guarantee correct code without running it. Solve that and AI-first integration becomes truly zero-friction.",
    name: "Claude (Sonnet)", role: "Product Scoping Agent · Anthropic",
    color: "linear-gradient(135deg, #E11D48, #FB7185)",
  },
];

function TestimonialsSection({ t }) {
  const [ref, inView] = useScrollReveal(0.08);
  return (
    <section className="lp-section lp-test">
      <div ref={ref}>
        <div className={`lp-test-header reveal ${inView ? "in" : ""}`}>
          <p className="lp-section-label">Social proof</p>
          <h2 className="lp-section-title">Don't take our word for it</h2>
        </div>
        <div className="lp-test-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`lp-test-card reveal-scale ${inView ? "in" : ""}`} style={{ "--i": i }}>
              <div className="lp-stars">
                {[...Array(5)].map((_, si) => <span key={si} className={`lp-star${si >= t.stars ? " lp-star-empty" : ""}`}>★</span>)}
              </div>
              <p className="lp-test-text">"{t.text}"</p>
              <div className="lp-test-author">
                <img className="lp-test-avatar" src="https://claude.ai/images/claude_app_icon.png" alt="Claude" />
                <div>
                  <div className="lp-test-name">{t.name}</div>
                  <div className="lp-test-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// TEAM
// ─────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: "Rozina Szogyenyi",
    role: "The vision builder",
    initials: "RS",
    photo: "/rozina.png",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
  },
  {
    name: "Khizar Naeem",
    role: "The white-label expert",
    initials: "KN",
    photo: "/khizar.jpeg",
    gradient: "linear-gradient(135deg, #059669 0%, #34D399 100%)",
  },
  {
    name: "Pamela Sanchez",
    role: "The orchestrator",
    initials: "PS",
    photo: "/pamela.png",
    gradient: "linear-gradient(135deg, #EA580C 0%, #FB923C 100%)",
  },
];

function TeamSection({ t }) {
  const [ref, inView] = useScrollReveal(0.15);
  return (
    <section className="lp-section lp-team">
      <div ref={ref}>
        <div className={`lp-team-header reveal ${inView ? "in" : ""}`}>
          <p className="lp-section-label">The team</p>
          <h2 className="lp-section-title">
            Built by builders<br />for{" "}
            <span className="lp-team-gradient">builders</span>
          </h2>
        </div>
        <div className="lp-team-grid">
          {TEAM.map((member, i) => (
            <div key={member.name} className={`lp-team-card reveal-scale ${inView ? "in" : ""}`} style={{ "--i": i }}>
              <div className="lp-team-avatar" style={{ background: member.gradient }}>
                {member.photo
                  ? <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                  : member.initials}
              </div>
              <div className="lp-team-name">{member.name}</div>
              <div className="lp-team-role">{member.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────────────────────────
function CTASection({ t }) {
  const [ref, inView] = useScrollReveal(0.15);
  return (
    <section className="lp-section lp-cta" style={{ position: "relative", overflow: "hidden" }}>
      <div className="lp-cta-glow" />
      <div ref={ref} className="lp-cta-inner">
        <div className={`reveal ${inView ? "in" : ""}`}>
          <p className="lp-section-label" style={{ textAlign: "center" }}>Get involved</p>
          <h2 className="lp-section-title" style={{ textAlign: "center", marginBottom: 12 }}>
            Get early access
          </h2>
          <p className="lp-section-sub" style={{ textAlign: "center" }}>
            Get access announcements, share your builds, request blocks, and
            talk directly to the DeelKit team.
          </p>
        </div>
        <div className={`reveal ${inView ? "in" : ""}`} style={{ "--i": 1 }}>
          <a
            href="https://deel.enterprise.slack.com/archives/C0AHYM44MK4"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-slack-btn"
          >
            {/* Slack icon */}
            <svg width="20" height="20" viewBox="0 0 122.8 122.8" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"/>
              <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"/>
              <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"/>
              <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"/>
            </svg>
            #vs26q1-deelkit-ai-white-label-payroll-builder
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
        <p className={`lp-fine-print reveal ${inView ? "in" : ""}`} style={{ "--i": 2 }}>
          No email required.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────
export default function LandingPage({ onLaunchDemo, dark = true, onToggleDark }) {
  const t = dark ? landingDark : landingLight;
  const libTokens = dark ? libDarkTokens : libLightTokens;
  const css = combineCSS(makeLandingCSS(t, dark), makeLibraryCSS(libTokens, dark));

  return (
    <div className="lp-shell">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <LandingNav dark={dark} toggleDark={onToggleDark} onLaunchDemo={onLaunchDemo} />
      <HeroSection t={t} onLaunchDemo={onLaunchDemo} />
      <ProblemSection t={t} />
      <HowItWorksSection t={t} />
      <AppearanceSection t={t} dark={dark} />
      <GetStartedSection t={t} libT={libTokens} onLaunchDemo={onLaunchDemo} />
      <TestimonialsSection t={t} />
      <TeamSection t={t} />
      <CTASection t={t} />
    </div>
  );
}
