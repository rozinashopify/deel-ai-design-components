import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS  (in sync with Wave 1 + 2)
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
  rowHover:     "#FAFAFA",
  chartBar:     "#E4E4E7",
  chartBarActive:"#18181B",
  chartBarHover: "#D4D4D8",
  shadow:       "0 1px 2px rgba(0,0,0,0.05)",
  shadowMd:     "0 4px 12px rgba(0,0,0,0.08)",
  shadowLg:     "0 8px 24px rgba(0,0,0,0.10)",
  ring:         "rgba(24,24,27,0.08)",
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
  rowHover:     "#1F1F23",
  chartBar:     "#3F3F46",
  chartBarActive:"#FAFAFA",
  chartBarHover: "#52525B",
  shadow:       "0 1px 3px rgba(0,0,0,0.4)",
  shadowMd:     "0 6px 20px rgba(0,0,0,0.5)",
  shadowLg:     "0 12px 32px rgba(0,0,0,0.6)",
  ring:         "rgba(250,250,250,0.1)",
};

// ─────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────
const makeCSS = (t, isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  .shell { min-height:100vh; padding:40px 36px; background:${t.bg}; color:${t.textMain}; font-family:'Inter',sans-serif; transition:background .18s,color .18s; }

  /* header */
  .hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:44px; padding-bottom:20px; border-bottom:1px solid ${t.border}; }
  .hdr-l { display:flex; flex-direction:column; gap:2px; }
  .eyebrow { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:${t.textMuted}; }
  .pg-title { font-size:21px; font-weight:600; letter-spacing:-.025em; color:${t.textMain}; }
  .hdr-r { display:flex; align-items:center; gap:8px; }
  .count-tag { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:${t.textMuted}; background:${t.surface}; border:1px solid ${t.border}; padding:4px 10px; border-radius:6px; }
  .ai-tag { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:${t.purple}; background:${t.purpleBg}; border:1px solid ${isDark ? t.purple+"44" : "transparent"}; padding:4px 10px; border-radius:6px; }

  /* dark toggle */
  .toggle-btn { display:flex; align-items:center; gap:7px; padding:5px 11px 5px 9px; background:${t.surface}; border:1px solid ${t.border}; border-radius:8px; cursor:pointer; font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500; color:${t.textMain}; transition:border-color .12s,background .12s; }
  .toggle-btn:hover { border-color:${t.textMuted}; background:${t.surfaceHover}; }
  .track { width:30px; height:17px; border-radius:999px; background:${isDark ? t.primary : t.border}; position:relative; transition:background .18s; }
  .thumb { position:absolute; top:2px; left:${isDark ? "14px" : "2px"}; width:13px; height:13px; border-radius:50%; background:${isDark ? t.btnText : "#fff"}; box-shadow:0 1px 3px rgba(0,0,0,.25); transition:left .18s; }

  /* section */
  .sec { margin-bottom:56px; }
  .sec-hd { display:flex; align-items:baseline; gap:9px; margin-bottom:3px; }
  .sec-n { font-family:'JetBrains Mono',monospace; font-size:10px; color:${t.textMuted}; font-weight:500; }
  .sec-name { font-size:14.5px; font-weight:600; color:${t.textMain}; letter-spacing:-.01em; }
  .sec-desc { font-size:12.5px; color:${t.textMuted}; line-height:1.55; margin:3px 0 12px; }

  /* composition label */
  .comp-label { display:inline-flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:${t.purple}; background:${t.purpleBg}; border:1px solid ${isDark ? t.purple+"33" : "transparent"}; padding:3px 8px; border-radius:4px; margin-bottom:16px; width:fit-content; }

  /* grid */
  .grid { display:flex; flex-wrap:wrap; gap:12px; }
  .card { flex:1; min-width:240px; background:${t.surface}; border:1px solid ${t.border}; border-radius:10px; padding:16px; box-shadow:${t.shadow}; }
  .card.wide { min-width:340px; }
  .card.full { min-width:100%; flex:none; }
  .card.narrow { min-width:200px; max-width:320px; }
  .card-lbl { font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:${t.textMuted}; margin-bottom:12px; }

  /* props table */
  .ptable { width:100%; border-collapse:collapse; margin-top:20px; }
  .ptable thead tr { border-bottom:1px solid ${t.border}; }
  .ptable th { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.07em; text-transform:uppercase; padding:8px 12px; text-align:left; font-weight:500; color:${t.textMuted}; }
  .ptable td { padding:9px 12px; border-bottom:1px solid ${t.border}; font-size:12px; vertical-align:top; }
  .ptable tr:last-child td { border-bottom:none; }
  .ptable tbody tr:hover td { background:${t.rowHover}; }
  .pname { font-family:'JetBrains Mono',monospace; font-size:11px; color:${t.textMain}; }
  .ptype { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:${t.purple}; }
  .preq  { font-size:11px; color:${t.error}; }
  .pdesc { font-size:11.5px; color:${t.textMuted}; line-height:1.5; }

  /* inlined Wave-1 atoms */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:0 14px; height:36px; font-family:'Inter',sans-serif; font-size:13px; font-weight:500; border-radius:6px; border:none; cursor:pointer; letter-spacing:.005em; white-space:nowrap; transition:background .1s,opacity .1s,transform .07s; }
  .btn:active:not(:disabled) { transform:scale(.985); }
  .btn:disabled { opacity:.4; cursor:not-allowed; }
  .btn.sm { height:30px; padding:0 11px; font-size:12px; border-radius:5px; }
  .btn-p { background:${t.primary}; color:${t.btnText}; }
  .btn-p:hover:not(:disabled) { background:${t.primaryHover}; }
  .btn-s { background:transparent; color:${t.textMain}; border:1px solid ${t.border}; }
  .btn-s:hover:not(:disabled) { background:${t.surfaceHover}; border-color:${t.textMuted}; }
  .btn-g { background:transparent; color:${t.info}; border:none; height:auto; padding:0; font-size:12.5px; font-weight:500; text-decoration:none; }
  .btn-g:hover { text-decoration:underline; }

  /* ════════════════════════════════════════
     MOLECULE 1 — ComplianceCheckCard
  ════════════════════════════════════════ */
  .cc-card {
    display:flex; align-items:flex-start; justify-content:space-between;
    gap:12px; padding:13px 16px;
    border:1px solid ${t.border}; border-radius:8px;
    background:${t.surface};
    transition:border-color .15s, background .15s;
  }
  .cc-card.pass  { border-color:${t.successBorder}; background:${t.successBg}; }
  .cc-card.fail  { border-color:${t.errorBorder};   background:${t.errorBg};   }
  .cc-card.warn  { border-color:${t.warningBorder}; background:${t.warningBg}; }
  .cc-card.check { border-color:${t.border}; background:${t.surface}; }
  .cc-rule { font-size:13px; color:${t.textMain}; line-height:1.45; flex:1; }
  .cc-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:5px; font-size:11.5px; font-weight:500; flex-shrink:0; white-space:nowrap; }
  .cc-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .cc-badge.pass { background:${t.successBg}; color:${t.success}; border:1px solid ${t.successBorder}; }
  .cc-badge.pass .cc-dot { background:${t.success}; }
  .cc-badge.fail { background:${t.errorBg}; color:${t.error}; border:1px solid ${t.errorBorder}; }
  .cc-badge.fail .cc-dot { background:${t.error}; }
  .cc-badge.warn { background:${t.warningBg}; color:${t.warning}; border:1px solid ${t.warningBorder}; }
  .cc-badge.warn .cc-dot { background:${t.warning}; }
  .cc-badge.checking { background:${t.purpleBg}; color:${t.purple}; border:1px solid ${isDark ? t.purple+"44":"transparent"}; }
  .cc-spin { width:10px; height:10px; border-radius:50%; border:1.5px solid ${t.border}; border-top-color:${t.purple}; animation:sp .55s linear infinite; flex-shrink:0; }
  .cc-detail { font-size:11.5px; color:${t.textMuted}; margin-top:4px; line-height:1.5; }

  /* ════════════════════════════════════════
     MOLECULE 2 — ComplianceCheckPanel
  ════════════════════════════════════════ */
  .ccp { display:flex; flex-direction:column; gap:8px; }

  /* run-check banner */
  .ccp-banner {
    display:flex; align-items:center; justify-content:space-between;
    gap:12px; padding:14px 16px;
    background:${t.purpleBg}; border:1px solid ${isDark ? t.purple+"44" : "#DDD6FE"};
    border-radius:10px;
  }
  .ccp-banner-left { display:flex; align-items:center; gap:12px; flex:1; min-width:0; }
  .ccp-icon-wrap { width:36px; height:36px; border-radius:8px; background:${isDark ? t.purple+"22" : "#EDE9FE"}; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ccp-banner-title { font-size:13.5px; font-weight:600; color:${t.textMain}; margin-bottom:2px; }
  .ccp-banner-desc { font-size:12px; color:${t.textMuted}; line-height:1.45; }
  .ccp-banner-desc a { color:${t.purple}; text-decoration:none; font-weight:500; }
  .ccp-banner-desc a:hover { text-decoration:underline; }

  /* results list */
  .ccp-results { display:flex; flex-direction:column; gap:6px; }

  /* report link row */
  .ccp-report { display:flex; align-items:center; gap:8px; padding:10px 14px; border:1px solid ${t.border}; border-radius:8px; background:${t.surface}; }
  .ccp-report-icon { color:${t.info}; display:flex; flex-shrink:0; }
  .ccp-report-text { font-size:12.5px; color:${t.textMuted}; }
  .ccp-report-text a { color:${t.info}; text-decoration:none; font-weight:500; }
  .ccp-report-text a:hover { text-decoration:underline; }

  /* running shimmer */
  .shimmer-row { height:46px; border-radius:8px; background:linear-gradient(90deg,${t.surfaceHover} 25%,${t.border} 50%,${t.surfaceHover} 75%); background-size:200% 100%; animation:shim 1.4s infinite; }
  @keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ════════════════════════════════════════
     MOLECULE 3 — MarketRateChart
  ════════════════════════════════════════ */
  .mrc { display:flex; flex-direction:column; gap:0; }
  .mrc-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:14px; }
  .mrc-title { font-size:13.5px; font-weight:600; color:${t.textMain}; margin-bottom:2px; }
  .mrc-subtitle { font-size:12px; color:${t.textMuted}; line-height:1.45; }
  .mrc-private { font-size:11px; color:${t.textDisabled}; margin-top:2px; }
  .mrc-period-toggle { display:flex; border:1px solid ${t.border}; border-radius:6px; overflow:hidden; flex-shrink:0; }
  .mrc-period-btn { padding:5px 12px; font-family:'Inter',sans-serif; font-size:12px; font-weight:500; background:transparent; border:none; cursor:pointer; color:${t.textMuted}; transition:background .1s,color .1s; }
  .mrc-period-btn.active { background:${t.primary}; color:${t.btnText}; }

  /* bars */
  .mrc-bars-wrap { position:relative; height:80px; margin:0 0 6px; }
  .mrc-bars { display:flex; align-items:flex-end; gap:3px; height:100%; }
  .mrc-bar-col { flex:1; display:flex; align-items:flex-end; justify-content:center; position:relative; height:100%; }
  .mrc-bar {
    width:100%; border-radius:3px 3px 0 0;
    background:${t.chartBar};
    transition:height .4s cubic-bezier(.4,0,.2,1), background .15s;
    cursor:default;
    position:relative;
  }
  .mrc-bar.active-bar { background:${t.chartBarActive}; }
  .mrc-bar.hover-bar  { background:${t.chartBarHover}; }

  /* position bubble */
  .mrc-bubble-wrap { position:absolute; top:-34px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; pointer-events:none; }
  .mrc-bubble { background:${t.info}; color:#fff; font-size:11.5px; font-weight:600; font-family:'JetBrains Mono',monospace; padding:3px 9px; border-radius:6px; white-space:nowrap; box-shadow:${t.shadowMd}; }
  .mrc-bubble-arrow { width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:5px solid ${t.info}; }
  .mrc-dashed { position:absolute; top:0; bottom:0; left:50%; width:0; border-left:1.5px dashed ${t.info}; opacity:.5; pointer-events:none; }

  /* axis */
  .mrc-axis { display:flex; justify-content:space-between; align-items:flex-start; padding-top:8px; border-top:1px solid ${t.border}; }
  .mrc-axis-item { display:flex; flex-direction:column; align-items:center; gap:1px; }
  .mrc-axis-val { font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:500; color:${t.textMain}; }
  .mrc-axis-lbl { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.06em; text-transform:uppercase; color:${t.textMuted}; }

  /* footer hint */
  .mrc-note { font-size:11.5px; color:${t.textMuted}; margin-top:10px; }

  @keyframes sp { to { transform:rotate(360deg); } }

  /* footer */
  .foot { display:flex; justify-content:space-between; align-items:center; padding-top:20px; border-top:1px solid ${t.border}; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.07em; text-transform:uppercase; color:${t.textMuted}; }
`;

// ─────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────
const Sun      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/><line x1="17.7" y1="4.2" x2="19.8" y2="6.3"/><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/></svg>;
const Moon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const AIIcon   = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="9" cy="9" r="7.5"/><path d="M6 9a3 3 0 0 0 6 0"/><circle cx="6.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/><circle cx="11.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>;
const Refresh  = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6.5A5 5 0 0 1 11 3.5"/><polyline points="9 1.5 11.5 3.5 9.5 6"/><path d="M11.5 6.5A5 5 0 0 1 2 9.5"/><polyline points="4 11.5 1.5 9.5 3.5 7"/></svg>;
const InfoIcon = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="6" cy="6" r="5"/><line x1="6" y1="5.5" x2="6" y2="8.5"/><circle cx="6" cy="3.5" r=".7" fill="currentColor" stroke="none"/></svg>;

// ─────────────────────────────────────────────────────────────────
// MOLECULE 1 — ComplianceCheckCard
// Smallest unit: one rule + its result badge
// ─────────────────────────────────────────────────────────────────
export function ComplianceCheckCard({ rule, status = "checking", detail }) {
  const labels   = { pass:"Passed", fail:"Failed", warn:"Warning", checking:"Checking…" };
  const cardCls  = `cc-card ${status}`;
  return (
    <div className={cardCls}>
      <div style={{ flex: 1 }}>
        <div className="cc-rule">{rule}</div>
        {detail && <div className="cc-detail">{detail}</div>}
      </div>
      <div className={`cc-badge ${status}`}>
        {status === "checking"
          ? <span className="cc-spin" />
          : <span className="cc-dot" />}
        {labels[status]}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MOLECULE 2 — ComplianceCheckPanel
// Composed of: AI banner + ComplianceCheckCard[] + report link
// ─────────────────────────────────────────────────────────────────
export function ComplianceCheckPanel({ results = [], isRunning = false, onRunCheck, onReport }) {
  const hasResults = results.length > 0;
  return (
    <div className="ccp">
      {/* run-check banner */}
      <div className="ccp-banner">
        <div className="ccp-banner-left">
          <div className="ccp-icon-wrap">
            <AIIcon />
          </div>
          <div>
            <div className="ccp-banner-title">Save time with our AI-powered compliance check</div>
            <div className="ccp-banner-desc">
              Use our AI-powered check to verify your job scope meets the{" "}
              <a href="#">EOR compliance requirements</a>{" "}
              enabling an instant quote without manual review.
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-s sm"
          onClick={onRunCheck} disabled={isRunning}
          style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
          {isRunning
            ? <><span className="cc-spin" style={{ borderTopColor:"currentColor" }} />Running…</>
            : <><Refresh />Run check</>}
        </button>
      </div>

      {/* shimmer while running */}
      {isRunning && !hasResults && (
        <div className="ccp-results">
          {[1,2,3].map(i => <div key={i} className="shimmer-row" />)}
        </div>
      )}

      {/* result cards */}
      {hasResults && (
        <div className="ccp-results">
          {results.map((r, i) => (
            <ComplianceCheckCard key={i} rule={r.rule} status={r.status} detail={r.detail} />
          ))}
        </div>
      )}

      {/* report false errors */}
      {hasResults && (
        <div className="ccp-report">
          <span className="ccp-report-icon"><InfoIcon /></span>
          <span className="ccp-report-text">
            Think Deel reported false errors?{" "}
            <a href="#" onClick={e => { e.preventDefault(); onReport?.(); }}>
              Report to our engineering team
            </a>
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MOLECULE 3 — MarketRateChart
// Composed of: period toggle + bar histogram + position bubble + axis
// ─────────────────────────────────────────────────────────────────

// Mock data per period
const MOCK_MARKET = {
  annual: {
    title:    "Mid Executive Assistant annual compensation in United States.",
    subtitle: "Your payment rate is equal to {salary} annually in USD.",
    note:     "Market rate insights will not be shown to employees.",
    low:      30700,
    median:   69000,
    high:     123200,
    buckets:  [18, 34, 52, 70, 88, 80, 66, 50, 36, 22, 14],
  },
  monthly: {
    title:    "Mid Executive Assistant monthly compensation in United States.",
    subtitle: "Your payment rate is equal to {salary} monthly in USD.",
    note:     "Market rate insights will not be shown to employees.",
    low:      2558,
    median:   5750,
    high:     10267,
    buckets:  [16, 30, 50, 68, 86, 80, 64, 48, 34, 20, 12],
  },
};

function fmt(n) {
  if (n >= 1000) return `$${(n/1000).toFixed(1).replace(/\.0$/,"")}k`;
  return `$${n}`;
}

export function MarketRateChart({ salary = 77293.01, period: initPeriod = "annual", title, country = "United States", seniority = "Mid", jobTitle = "Executive Assistant" }) {
  const [period, setPeriod] = useState(initPeriod);
  const [hovered, setHovered] = useState(null);
  const [animated, setAnimated] = useState(false);

  // trigger bar animation on mount + period change
  useEffect(() => { setAnimated(false); const t = setTimeout(() => setAnimated(true), 60); return () => clearTimeout(t); }, [period]);

  const data       = MOCK_MARKET[period];
  const maxBucket  = Math.max(...data.buckets);
  const displaySal = period === "annual" ? salary : salary / 12;
  const fmtSal     = period === "annual"
    ? `$${salary.toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 })}`
    : `$${(salary/12).toLocaleString("en-US", { minimumFractionDigits:2, maximumFractionDigits:2 })}`;

  // which bucket index the salary falls into
  const range   = data.high - data.low;
  const salPos  = Math.max(0, Math.min(1, (displaySal - data.low) / range));
  const activeBucket = Math.round(salPos * (data.buckets.length - 1));

  return (
    <div className="mrc">
      <div className="mrc-header">
        <div>
          <div className="mrc-title">{title ?? data.title}</div>
          <div className="mrc-subtitle">{data.subtitle.replace("{salary}", fmtSal)}</div>
          <div className="mrc-private">{data.note}</div>
        </div>
        <div className="mrc-period-toggle">
          <button type="button" className={`mrc-period-btn${period==="annual"?" active":""}`}
            onClick={() => setPeriod("annual")}>Annual</button>
          <button type="button" className={`mrc-period-btn${period==="monthly"?" active":""}`}
            onClick={() => setPeriod("monthly")}>Monthly</button>
        </div>
      </div>

      <div className="mrc-bars-wrap">
        <div className="mrc-bars">
          {data.buckets.map((h, i) => {
            const heightPct = (h / maxBucket) * 100;
            const isActive  = i === activeBucket;
            const isHover   = i === hovered;
            return (
              <div key={i} className="mrc-bar-col"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}>
                <div
                  className={`mrc-bar${isActive?" active-bar":""}${isHover&&!isActive?" hover-bar":""}`}
                  style={{ height: animated ? `${heightPct}%` : "0%" }} />
                {isActive && (
                  <>
                    <div className="mrc-dashed" />
                    <div className="mrc-bubble-wrap">
                      <div className="mrc-bubble">{fmt(displaySal)}</div>
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
        <div className="mrc-axis-item">
          <span className="mrc-axis-val">{fmt(data.low)}</span>
          <span className="mrc-axis-lbl">Low</span>
        </div>
        <div className="mrc-axis-item">
          <span className="mrc-axis-val">{fmt(data.median)}</span>
          <span className="mrc-axis-lbl">Median</span>
        </div>
        <div className="mrc-axis-item">
          <span className="mrc-axis-val">{fmt(data.high)}</span>
          <span className="mrc-axis-lbl">High</span>
        </div>
      </div>

      <div className="mrc-note">{data.note}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// INTERACTIVE DEMOS
// ─────────────────────────────────────────────────────────────────
const MOCK_RESULTS_MIXED = [
  { rule: "Job scope should be relevant to the job title.",                                     status: "fail",   detail: "The described duties relate to customer success, not executive assistance." },
  { rule: "Job scope should not include recruiting or hiring language.",                         status: "pass",   detail: null },
  { rule: "Job scope should not reference reporting lines (e.g. 'Reporting to the CEO').",       status: "warn",   detail: "Indirect reference detected — consider rephrasing." },
  { rule: "Job scope should not include required education or experience requirements.",          status: "pass",   detail: null },
];
const MOCK_RESULTS_ALL_PASS = [
  { rule: "Job scope should be relevant to the job title.",                                     status: "pass" },
  { rule: "Job scope should not include recruiting or hiring language.",                         status: "pass" },
  { rule: "Job scope should not reference reporting lines.",                                     status: "pass" },
  { rule: "Job scope should not include required education or experience requirements.",          status: "pass" },
];
const MOCK_RESULTS_ALL_FAIL = [
  { rule: "Job scope should be relevant to the job title.",                                     status: "fail",   detail: "The described duties relate to customer success, not executive assistance." },
  { rule: "Job scope should not include recruiting or hiring language.",                         status: "fail",   detail: "Phrase 'we are looking for' detected." },
  { rule: "Job scope should not reference reporting lines.",                                     status: "fail",   detail: "'Reporting to the CEO' found on line 3." },
];

function PanelInteractiveDemo() {
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const [results, setResults] = useState([]);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const scenarios = [MOCK_RESULTS_MIXED, MOCK_RESULTS_ALL_PASS, MOCK_RESULTS_ALL_FAIL];
  const labels    = ["Mixed", "All Pass", "All Fail"];

  const runCheck = () => {
    setPhase("running");
    setResults([]);
    // stream results in one-by-one
    const chosen = scenarios[scenarioIdx];
    chosen.forEach((r, i) => {
      setTimeout(() => {
        setResults(prev => [...prev, r]);
        if (i === chosen.length - 1) setPhase("done");
      }, 600 + i * 400);
    });
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <span style={{ fontSize:12, color:"var(--muted,#71717A)" }}>Scenario:</span>
        {labels.map((l,i) => (
          <button key={l} type="button" className={`btn btn-s sm`}
            style={{ fontWeight: i===scenarioIdx ? 600 : 400 }}
            onClick={() => { setScenarioIdx(i); setPhase("idle"); setResults([]); }}>
            {l}
          </button>
        ))}
      </div>
      <ComplianceCheckPanel
        results={results}
        isRunning={phase === "running"}
        onRunCheck={phase !== "running" ? runCheck : undefined} />
    </div>
  );
}

function ChartSalaryDemo() {
  const [salary, setSalary] = useState(77293.01);
  const presets = [
    { label:"Below median", val:45000 },
    { label:"At median",    val:69000 },
    { label:"Above median", val:77293.01 },
    { label:"Near high",    val:110000 },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {presets.map(p => (
          <button key={p.label} type="button" className="btn btn-s sm"
            style={{ fontWeight: salary===p.val ? 600 : 400 }}
            onClick={() => setSalary(p.val)}>
            {p.label}
          </button>
        ))}
      </div>
      <MarketRateChart salary={salary} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LAYOUT HELPERS
// ─────────────────────────────────────────────────────────────────
function PropsTable({ rows }) {
  return (
    <table className="ptable">
      <thead><tr><th>Prop</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
      <tbody>
        {rows.map(([n, tp, req, d]) => (
          <tr key={n}>
            <td><span className="pname">{n}</span></td>
            <td><span className="ptype">{tp}</span></td>
            <td><span className="preq">{req ? "Yes" : "—"}</span></td>
            <td><span className="pdesc">{d}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function ComposedOf({ atoms }) {
  return <div className="comp-label">⚛ Composed of: {atoms}</div>;
}
function Sec({ n, name, desc, composed, props, children }) {
  return (
    <div className="sec">
      <div className="sec-hd">
        <span className="sec-n">0{n}</span>
        <span className="sec-name">{name}</span>
      </div>
      <p className="sec-desc">{desc}</p>
      <ComposedOf atoms={composed} />
      <div className="grid">{children}</div>
      {props && <PropsTable rows={props} />}
    </div>
  );
}
function Card({ label, wide, full, narrow, children }) {
  return (
    <div className={`card${wide?" wide":""}${full?" full":""}${narrow?" narrow":""}`}>
      <div className="card-lbl">{label}</div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────
export default function DeelAIMoleculesPreview() {
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
            <span className="pg-title">AI Molecules — Wave 3</span>
          </div>
          <div className="hdr-r">
            <span className="ai-tag">✦ AI-powered</span>
            <span className="count-tag">3 molecules · mock data</span>
            <button className="toggle-btn" onClick={() => setDark(d => !d)} type="button">
              {dark ? <Moon /> : <Sun />}
              {dark ? "Dark" : "Light"}
              <div className="track"><div className="thumb" /></div>
            </button>
          </div>
        </div>

        {/* ── 01 ComplianceCheckCard ── */}
        <Sec n={1} name="ComplianceCheckCard"
          desc="Atomic result row for a single compliance rule. Renders a rule string on the left and a coloured status badge on the right. Supports four states: checking (spinner), passed, warning, failed. Optionally shows a detail sentence when the AI flags an issue."
          composed="rule text + StatusBadge (pass/fail/warn/checking) + optional detail line"
          props={[
            ["rule",   "string",                         true,  "The compliance rule being evaluated"],
            ["status", "'checking'|'pass'|'warn'|'fail'",true,  "Controls card tint, badge colour, and icon"],
            ["detail", "string",                         false, "Optional AI-generated explanation shown below the rule"],
          ]}>
          <Card label="Passed" wide>
            <ComplianceCheckCard
              rule="Job scope should not include recruiting or hiring language."
              status="pass" />
          </Card>
          <Card label="Failed — with detail" wide>
            <ComplianceCheckCard
              rule="Job scope should be relevant to the job title."
              status="fail"
              detail="The described duties relate to customer success, not executive assistance." />
          </Card>
          <Card label="Warning — with detail" wide>
            <ComplianceCheckCard
              rule="Job scope should not reference reporting lines (e.g. 'Reporting to the CEO')."
              status="warn"
              detail="Indirect reference detected — consider rephrasing." />
          </Card>
          <Card label="Checking — AI running" wide>
            <ComplianceCheckCard
              rule="Job scope should not include required education or experience requirements."
              status="checking" />
          </Card>
          <Card label="Multiple cards — mixed result" full>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {MOCK_RESULTS_MIXED.map((r,i) =>
                <ComplianceCheckCard key={i} rule={r.rule} status={r.status} detail={r.detail} />)}
            </div>
          </Card>
        </Sec>

        {/* ── 02 ComplianceCheckPanel ── */}
        <Sec n={2} name="ComplianceCheckPanel"
          desc="Full AI compliance widget: the purple run-check banner, a list of ComplianceCheckCards that stream in as results arrive, and a false-positive report link. The isRunning prop shows shimmer placeholders while the AI evaluates. Results can arrive incrementally (one card at a time) for a streaming UX."
          composed="AI banner (icon + copy + RunCheck button) + ComplianceCheckCard[] + shimmer rows + report link"
          props={[
            ["results",    "Result[]",  false, "Array of { rule, status, detail? } — can be empty (pre-run)"],
            ["isRunning",  "boolean",   false, "Shows shimmer placeholders, disables Run check button"],
            ["onRunCheck", "function",  false, "() => void — called when Run check is clicked"],
            ["onReport",   "function",  false, "() => void — called when report link is clicked"],
          ]}>
          <Card label="Pre-run — no results yet" wide>
            <ComplianceCheckPanel results={[]} isRunning={false} />
          </Card>
          <Card label="Running — shimmer placeholders" wide>
            <ComplianceCheckPanel results={[]} isRunning={true} />
          </Card>
          <Card label="Results — all passed" wide>
            <ComplianceCheckPanel results={MOCK_RESULTS_ALL_PASS} />
          </Card>
          <Card label="Results — mixed pass/warn/fail" wide>
            <ComplianceCheckPanel results={MOCK_RESULTS_MIXED} />
          </Card>
          <Card label="Interactive — streaming results (pick scenario then Run check)" full>
            <PanelInteractiveDemo />
          </Card>
        </Sec>

        {/* ── 03 MarketRateChart ── */}
        <Sec n={3} name="MarketRateChart"
          desc="Salary benchmarking histogram. Bars represent the distribution of compensation across the market for a given job title, seniority, and country. The active bar is highlighted in primary colour with a floating bubble showing the current salary. The Annual / Monthly toggle rescales all values. Bars animate in on mount and on period change."
          composed="period toggle (Annual/Monthly) + bar histogram + position bubble + dashed line + axis (Low/Median/High)"
          props={[
            ["salary",    "number",            true,  "Current gross annual salary — used to position the bubble"],
            ["period",    "'annual'|'monthly'", false, "Initial period shown (default: 'annual')"],
            ["country",   "string",            false, "Country for the market data label"],
            ["seniority", "string",            false, "Seniority tier used in the chart title"],
            ["jobTitle",  "string",            false, "Job title used in the chart title"],
          ]}>
          <Card label="Annual — $77,293 (above median)" wide>
            <MarketRateChart salary={77293.01} period="annual" />
          </Card>
          <Card label="Monthly view (toggle inside)" wide>
            <MarketRateChart salary={77293.01} period="monthly" />
          </Card>
          <Card label="Below median — $45,000" wide>
            <MarketRateChart salary={45000} period="annual" />
          </Card>
          <Card label="Near high — $110,000" wide>
            <MarketRateChart salary={110000} period="annual" />
          </Card>
          <Card label="Interactive — move salary position + toggle period" full>
            <ChartSalaryDemo />
          </Card>
        </Sec>

        {/* Footer */}
        <div className="foot">
          <span>Deel Design System · Wave 3 · AI Molecules</span>
          <span>Next → Wave 4: Blocks (JobDescriptionBlock, CompensationBlock, BenefitsBlock)</span>
        </div>

      </div>
    </>
  );
}
