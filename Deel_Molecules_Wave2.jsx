import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS  (kept in sync with Wave 1)
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
  success:      "#16A34A",
  successBg:    "#F0FDF4",
  mandatory:    "#EA580C",
  mandatoryBg:  "#FFF7ED",
  purple:       "#7C3AED",
  purpleBg:     "#F5F3FF",
  info:         "#2563EB",
  infoBg:       "#EFF6FF",
  inputBg:      "#FFFFFF",
  rowHover:     "#FAFAFA",
  shadow:       "0 1px 2px rgba(0,0,0,0.05)",
  shadowMd:     "0 4px 12px rgba(0,0,0,0.08)",
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
  success:      "#4ADE80",
  successBg:    "#0D2818",
  mandatory:    "#FB923C",
  mandatoryBg:  "#271100",
  purple:       "#A78BFA",
  purpleBg:     "#1E1033",
  info:         "#60A5FA",
  infoBg:       "#0C1A2E",
  inputBg:      "#27272A",
  rowHover:     "#1F1F23",
  shadow:       "0 1px 3px rgba(0,0,0,0.4)",
  shadowMd:     "0 6px 20px rgba(0,0,0,0.5)",
  ring:         "rgba(250,250,250,0.1)",
};

// ─────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────
const makeCSS = (t, isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  .shell {
    min-height: 100vh; padding: 40px 36px;
    background: ${t.bg}; color: ${t.textMain};
    font-family: 'Inter', sans-serif;
    transition: background 0.18s, color 0.18s;
  }

  /* ── Header ── */
  .hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:44px; padding-bottom:20px; border-bottom:1px solid ${t.border}; }
  .hdr-l { display:flex; flex-direction:column; gap:2px; }
  .eyebrow { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.12em; text-transform:uppercase; color:${t.textMuted}; }
  .pg-title { font-size:21px; font-weight:600; letter-spacing:-.025em; color:${t.textMain}; }
  .hdr-r { display:flex; align-items:center; gap:8px; }
  .count-tag { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:${t.textMuted}; background:${t.surface}; border:1px solid ${t.border}; padding:4px 10px; border-radius:6px; }

  /* ── Dark toggle ── */
  .toggle-btn { display:flex; align-items:center; gap:7px; padding:5px 11px 5px 9px; background:${t.surface}; border:1px solid ${t.border}; border-radius:8px; cursor:pointer; font-family:'Inter',sans-serif; font-size:12.5px; font-weight:500; color:${t.textMain}; transition:border-color .12s,background .12s; }
  .toggle-btn:hover { border-color:${t.textMuted}; background:${t.surfaceHover}; }
  .track { width:30px; height:17px; border-radius:999px; background:${isDark ? t.primary : t.border}; position:relative; transition:background .18s; }
  .thumb { position:absolute; top:2px; left:${isDark ? "14px" : "2px"}; width:13px; height:13px; border-radius:50%; background:${isDark ? t.btnText : "#fff"}; box-shadow:0 1px 3px rgba(0,0,0,.25); transition:left .18s; }

  /* ── Section ── */
  .sec { margin-bottom:56px; }
  .sec-hd { display:flex; align-items:baseline; gap:9px; margin-bottom:3px; }
  .sec-n { font-family:'JetBrains Mono',monospace; font-size:10px; color:${t.textMuted}; font-weight:500; }
  .sec-name { font-size:14.5px; font-weight:600; color:${t.textMain}; letter-spacing:-.01em; }
  .sec-desc { font-size:12.5px; color:${t.textMuted}; line-height:1.55; margin:3px 0 16px; }

  /* ── Grid ── */
  .grid { display:flex; flex-wrap:wrap; gap:12px; }
  .card { flex:1; min-width:220px; background:${t.surface}; border:1px solid ${t.border}; border-radius:10px; padding:16px; box-shadow:${t.shadow}; }
  .card.wide { min-width:300px; }
  .card.full { min-width:100%; flex:none; }
  .card.narrow { min-width:160px; max-width:260px; }
  .card-lbl { font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:${t.textMuted}; margin-bottom:12px; }

  /* ── Props table ── */
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

  /* ── Composition label ── */
  .comp-label {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
    font-weight: 500; letter-spacing: .06em; text-transform: uppercase;
    color: ${t.purple}; background: ${t.purpleBg};
    border: 1px solid ${isDark ? t.purple + "33" : "transparent"};
    padding: 3px 8px; border-radius: 4px; margin-bottom: 16px;
    width: fit-content;
  }

  /* ══════════════════════════════════════════
     WAVE 1 ATOM STYLES (inlined for self-containment)
  ══════════════════════════════════════════ */

  /* TextInput */
  .fi { display:flex; flex-direction:column; gap:4px; }
  .fl { font-size:12px; font-weight:500; color:${t.textMain}; }
  .fl .req { color:${t.error}; margin-left:1px; }
  .fi input { height:36px; width:100%; padding:0 11px; font-family:'Inter',sans-serif; font-size:13.5px; color:${t.textMain}; background:${t.inputBg}; border:1px solid ${t.border}; border-radius:6px; outline:none; appearance:none; transition:border-color .12s,box-shadow .12s; }
  .fi input::placeholder { color:${t.textDisabled}; }
  .fi input:focus { border-color:${t.borderFocus}; box-shadow:0 0 0 3px ${t.ring}; }
  .fi input:disabled { background:${t.surfaceHover}; color:${t.textDisabled}; cursor:not-allowed; }
  .fi input.err { border-color:${t.error}; background:${t.errorBg}; }
  .fhint { font-size:11.5px; color:${t.textMuted}; margin-top:1px; }
  .fhint.err { color:${t.error}; }

  /* DropdownSelect */
  .selw { position:relative; }
  .selw select { height:36px; width:100%; padding:0 34px 0 11px; font-family:'Inter',sans-serif; font-size:13.5px; background:${t.inputBg}; border:1px solid ${t.border}; border-radius:6px; outline:none; appearance:none; cursor:pointer; color:${t.textMain}; transition:border-color .12s,box-shadow .12s; }
  .selw select.ph { color:${t.textDisabled}; }
  .selw select:focus { border-color:${t.borderFocus}; box-shadow:0 0 0 3px ${t.ring}; }
  .selw select:disabled { background:${t.surfaceHover}; color:${t.textDisabled}; cursor:not-allowed; }
  .chev { position:absolute; right:10px; top:50%; transform:translateY(-50%); pointer-events:none; color:${t.textMuted}; }

  /* StatusBadge */
  .badge { display:inline-flex; align-items:center; gap:5px; padding:2.5px 8px; border-radius:5px; font-size:11.5px; font-weight:500; }
  .bdot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
  .badge.completed { background:${t.successBg}; color:${t.success}; }
  .badge.completed .bdot { background:${t.success}; }
  .badge.active-step { background:${t.infoBg}; color:${t.info}; }

  /* Buttons */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:0 14px; height:36px; font-family:'Inter',sans-serif; font-size:13px; font-weight:500; border-radius:6px; border:none; cursor:pointer; letter-spacing:.005em; white-space:nowrap; transition:background .1s,box-shadow .1s,opacity .1s,transform .07s; }
  .btn:active:not(:disabled) { transform:scale(.985); }
  .btn:disabled { opacity:.4; cursor:not-allowed; }
  .btn.sm { height:30px; padding:0 11px; font-size:12px; border-radius:5px; }
  .btn-p { background:${t.primary}; color:${t.btnText}; }
  .btn-p:hover:not(:disabled) { background:${t.primaryHover}; }
  .btn-s { background:transparent; color:${t.textMain}; border:1px solid ${t.border}; }
  .btn-s:hover:not(:disabled) { background:${t.surfaceHover}; border-color:${t.textMuted}; }
  .btn-g { background:transparent; color:${t.textMuted}; border:none; height:auto; padding:0; font-size:12.5px; font-weight:400; text-decoration:underline; text-underline-offset:3px; text-decoration-color:${t.border}; }
  .btn-g:hover:not(:disabled) { color:${t.textMain}; text-decoration-color:${t.textMain}; }

  /* ══════════════════════════════════════════
     MOLECULE 1 — FormFieldGroup
  ══════════════════════════════════════════ */
  .ffg { display:flex; flex-direction:column; gap:14px; }
  .ffg-title { font-size:13.5px; font-weight:600; color:${t.textMain}; margin-bottom:2px; }
  .ffg-desc { font-size:12px; color:${t.textMuted}; line-height:1.5; margin-bottom:4px; }
  .ffg-row { display:grid; gap:12px; }
  .ffg-row.cols-2 { grid-template-columns:1fr 1fr; }
  .ffg-row.cols-3 { grid-template-columns:1fr 1fr 1fr; }

  /* ══════════════════════════════════════════
     MOLECULE 2 — StepperRail
  ══════════════════════════════════════════ */
  .srail { display:flex; flex-direction:column; gap:0; width:100%; }
  .srail-item { display:flex; align-items:flex-start; gap:12px; padding:10px 12px; border-radius:8px; cursor:default; transition:background .12s; position:relative; }
  .srail-item.clickable { cursor:pointer; }
  .srail-item.clickable:hover { background:${t.surfaceHover}; }
  .srail-item.active { background:${t.surfaceHover}; }
  .srail-line-col { display:flex; flex-direction:column; align-items:center; gap:0; flex-shrink:0; }
  .srail-circle {
    width:24px; height:24px; border-radius:50%; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-size:11px; font-weight:600; font-family:'JetBrains Mono',monospace;
    border:1.5px solid ${t.border}; color:${t.textMuted}; background:${t.surface};
    transition:all .15s;
  }
  .srail-circle.done { background:${t.primary}; border-color:${t.primary}; color:${t.btnText}; }
  .srail-circle.active { border-color:${t.primary}; color:${t.primary}; background:${t.surface}; box-shadow:0 0 0 3px ${t.ring}; }
  .srail-connector { width:1.5px; height:16px; background:${t.border}; margin:2px 0; transition:background .15s; }
  .srail-connector.done { background:${t.primary}; }
  .srail-info { padding-top:2px; }
  .srail-step-label { font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:${t.textMuted}; margin-bottom:1px; }
  .srail-step-label.done-lbl { color:${t.success}; }
  .srail-step-label.active-lbl { color:${t.primary}; }
  .srail-step-name { font-size:13px; font-weight:500; color:${t.textMuted}; transition:color .12s; }
  .srail-step-name.active { color:${t.textMain}; font-weight:600; }
  .srail-step-name.done-name { color:${t.textMuted}; }

  /* ══════════════════════════════════════════
     MOLECULE 3 — AutosaveWidget
  ══════════════════════════════════════════ */
  .autosave { background:${t.surface}; border:1px solid ${t.border}; border-radius:10px; padding:16px; box-shadow:${t.shadow}; }
  .autosave-hd { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
  .autosave-icon { width:18px; height:18px; border-radius:50%; background:${t.infoBg}; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .autosave-title { font-size:13px; font-weight:600; color:${t.textMain}; }
  .autosave-body { font-size:12.5px; color:${t.textMuted}; line-height:1.5; margin-bottom:12px; }
  .autosave-status { display:flex; align-items:center; gap:6px; font-size:11.5px; color:${t.textMuted}; margin-bottom:12px; }
  .autosave-dot { width:6px; height:6px; border-radius:50%; background:${t.success}; flex-shrink:0; }
  .autosave-dot.saving { background:${t.mandatory}; animation:pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .spin-sm { width:11px; height:11px; border-radius:50%; border:1.5px solid ${t.border}; border-top-color:${t.textMuted}; animation:sp .6s linear infinite; flex-shrink:0; }
  @keyframes sp { to { transform:rotate(360deg); } }

  /* ══════════════════════════════════════════
     MOLECULE 4 — HiringGuideBanner
  ══════════════════════════════════════════ */
  .hgb { border-radius:10px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; transition:opacity .2s; }
  .hgb.info-style { background:${t.infoBg}; border:1px solid ${isDark ? t.info + "33" : "#BFDBFE"}; }
  .hgb.surface-style { background:${t.surface}; border:1px solid ${t.border}; box-shadow:${t.shadow}; }
  .hgb-left { display:flex; align-items:center; gap:10px; flex:1; min-width:0; }
  .hgb-flags { display:flex; align-items:center; flex-shrink:0; }
  .hgb-flag { width:22px; height:22px; border-radius:50%; border:1.5px solid ${t.surface}; overflow:hidden; font-size:13px; display:flex; align-items:center; justify-content:center; background:${t.surfaceHover}; }
  .hgb-flag:nth-child(2) { margin-left:-6px; }
  .hgb-flag:nth-child(3) { margin-left:-6px; }
  .hgb-text { font-size:13px; color:${t.textMain}; line-height:1.4; min-width:0; }
  .hgb-link { color:${t.info}; font-weight:500; text-decoration:none; cursor:pointer; }
  .hgb-link:hover { text-decoration:underline; }
  .hgb-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .hgb-dismiss { background:none; border:none; cursor:pointer; color:${t.textMuted}; display:flex; align-items:center; padding:3px; border-radius:4px; transition:color .1s,background .1s; }
  .hgb-dismiss:hover { color:${t.textMain}; background:${t.surfaceHover}; }
  .hgb-dismissed { opacity:.4; pointer-events:none; }

  /* ── Footer ── */
  .foot { display:flex; justify-content:space-between; align-items:center; padding-top:20px; border-top:1px solid ${t.border}; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.07em; text-transform:uppercase; color:${t.textMuted}; }
`;

// ─────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────
const Chevron  = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 5 7 9 11 5"/></svg>;
const Check    = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5 5.5 4.5 8.5 9.5 2.5"/></svg>;
const InfoIcon = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="5.5" cy="5.5" r="4.5"/><line x1="5.5" y1="5" x2="5.5" y2="8"/><circle cx="5.5" cy="3.2" r=".6" fill="currentColor" stroke="none"/></svg>;
const X        = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="2.5" y1="2.5" x2="10.5" y2="10.5"/><line x1="10.5" y1="2.5" x2="2.5" y2="10.5"/></svg>;
const Sun      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/><line x1="17.7" y1="4.2" x2="19.8" y2="6.3"/><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/></svg>;
const Moon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const ExternalLink = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7"/><polyline points="8 1 11 1 11 4"/><line x1="5.5" y1="6.5" x2="11" y2="1"/></svg>;

// ─────────────────────────────────────────────────────────────────
// INLINED ATOMS  (from Wave 1)
// ─────────────────────────────────────────────────────────────────
function TextInput({ label, placeholder, value, required, disabled, error, helperText }) {
  const [v, setV] = useState(value ?? "");
  return (
    <div className="fi">
      {label && <label className="fl">{label}{required && <span className="req">*</span>}</label>}
      <input className={error ? "err" : ""} placeholder={placeholder}
        value={v} disabled={disabled} onChange={e => setV(e.target.value)} />
      {helperText && <span className={`fhint${error ? " err" : ""}`}>{helperText}</span>}
    </div>
  );
}
function DropdownSelect({ label, placeholder = "Select…", options = [], value, disabled, optional }) {
  const [v, setV] = useState(value ?? "");
  return (
    <div className="fi">
      {label && <label className="fl">{label}{optional && <span style={{ fontWeight: 400, opacity: .65 }}> (optional)</span>}</label>}
      <div className="selw">
        <select className={!v ? "ph" : ""} disabled={disabled} value={v} onChange={e => setV(e.target.value)}>
          <option value="" disabled>{placeholder}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="chev"><Chevron /></span>
      </div>
    </div>
  );
}
function PrimaryButton({ label, disabled, size }) {
  return <button type="button" className={`btn btn-p${size === "sm" ? " sm" : ""}`} disabled={disabled}>{label}</button>;
}
function SecondaryButton({ label, disabled, size, icon }) {
  return <button type="button" className={`btn btn-s${size === "sm" ? " sm" : ""}`} disabled={disabled}>{icon}{label}</button>;
}
function TextButton({ label, disabled }) {
  return <button type="button" className="btn btn-g" disabled={disabled}>{label}</button>;
}

// ─────────────────────────────────────────────────────────────────
// MOLECULE 1 — FormFieldGroup
// Composed of: SectionHeading + TextInput/DropdownSelect + HelperText
// ─────────────────────────────────────────────────────────────────
export function FormFieldGroup({ title, description, fields = [], columns = 1 }) {
  const colClass = columns === 2 ? "cols-2" : columns === 3 ? "cols-3" : "";
  return (
    <div className="ffg">
      {title && (
        <div>
          <div className="ffg-title">{title}</div>
          {description && <div className="ffg-desc">{description}</div>}
        </div>
      )}
      <div className={`ffg-row ${colClass}`}>
        {fields.map((f, i) => {
          if (f.type === "select") {
            return (
              <DropdownSelect key={i} label={f.label} placeholder={f.placeholder}
                options={f.options ?? []} value={f.value} disabled={f.disabled}
                optional={f.optional} />
            );
          }
          return (
            <TextInput key={i} label={f.label} placeholder={f.placeholder}
              value={f.value} required={f.required} disabled={f.disabled}
              error={f.error} helperText={f.helperText} />
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MOLECULE 2 — StepperRail
// Composed of: StepIndicator × n + connector lines + status labels
// ─────────────────────────────────────────────────────────────────
export function StepperRail({ steps = [], currentStep = 1, onStepClick }) {
  return (
    <div className="srail">
      {steps.map((step, i) => {
        const stepNum   = i + 1;
        const isDone    = stepNum < currentStep;
        const isActive  = stepNum === currentStep;
        const isLast    = i === steps.length - 1;
        return (
          <div key={stepNum}>
            <div
              className={`srail-item${isActive ? " active" : ""}${onStepClick && (isDone || isActive) ? " clickable" : ""}`}
              onClick={() => isDone && onStepClick?.(stepNum)}>
              <div className="srail-line-col">
                <div className={`srail-circle${isDone ? " done" : isActive ? " active" : ""}`}>
                  {isDone ? <Check /> : stepNum}
                </div>
                {!isLast && <div className={`srail-connector${isDone ? " done" : ""}`} />}
              </div>
              <div className="srail-info">
                <div className={`srail-step-label${isDone ? " done-lbl" : isActive ? " active-lbl" : ""}`}>
                  {isDone ? "Completed" : isActive ? "In progress" : `Step ${stepNum}`}
                </div>
                <div className={`srail-step-name${isActive ? " active" : isDone ? " done-name" : ""}`}>
                  {step.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MOLECULE 3 — AutosaveWidget
// Composed of: InfoIcon + body text + SecondaryButton
// ─────────────────────────────────────────────────────────────────
export function AutosaveWidget({ status = "saved", lastSaved, onDeleteDraft }) {
  const isSaving = status === "saving";
  return (
    <div className="autosave">
      <div className="autosave-hd">
        <div className="autosave-icon" style={{ color: "var(--info, #2563EB)" }}>
          <InfoIcon />
        </div>
        <span className="autosave-title">Autosaved</span>
      </div>
      <p className="autosave-body">
        Your progress is saved automatically. Delete the draft to start over.
      </p>
      <div className="autosave-status">
        {isSaving
          ? <><span className="spin-sm" /><span>Saving…</span></>
          : <><span className="autosave-dot" /><span>{lastSaved ? `Saved ${lastSaved}` : "All changes saved"}</span></>}
      </div>
      <SecondaryButton label="Delete draft" size="sm" onClick={onDeleteDraft} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MOLECULE 4 — HiringGuideBanner
// Composed of: flag icons + body text + TextButton + DismissButton
// ─────────────────────────────────────────────────────────────────
export function HiringGuideBanner({ country = "United States", guideUrl = "#", flags = ["🌍","d.","🇺🇸"], variant = "info", onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  const handleDismiss = () => { setDismissed(true); onDismiss?.(); };
  return (
    <div className={`hgb ${variant === "info" ? "info-style" : "surface-style"}${dismissed ? " hgb-dismissed" : ""}`}>
      <div className="hgb-left">
        <div className="hgb-flags">
          {flags.map((f, i) => <div key={i} className="hgb-flag">{f}</div>)}
        </div>
        <div className="hgb-text">
          View Deel's global hiring guide for {country}.{" "}
          <a className="hgb-link" href={guideUrl} target="_blank" rel="noreferrer">
            View <ExternalLink />
          </a>
        </div>
      </div>
      <button type="button" className="hgb-dismiss" onClick={handleDismiss} aria-label="Dismiss">
        <X />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PREVIEW LAYOUT HELPERS
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
// INTERACTIVE DEMOS
// ─────────────────────────────────────────────────────────────────
function StepperInteractiveDemo() {
  const [current, setCurrent] = useState(2);
  const steps = [
    { label: "Personal details" },
    { label: "Job details" },
    { label: "Compensation and dates" },
    { label: "Benefits and extras" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <StepperRail steps={steps} currentStep={current}
        onStepClick={n => n < current && setCurrent(n)} />
      <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
        <button type="button" className="btn btn-s sm"
          disabled={current <= 1} onClick={() => setCurrent(c => Math.max(1, c - 1))}>← Back</button>
        <button type="button" className="btn btn-p sm"
          disabled={current >= 4} onClick={() => setCurrent(c => Math.min(4, c + 1))}>Next →</button>
      </div>
    </div>
  );
}

function AutosaveDemo() {
  const [status, setStatus] = useState("saved");
  const [ts, setTs] = useState("just now");
  const trigger = () => {
    setStatus("saving");
    setTimeout(() => { setStatus("saved"); setTs("2 seconds ago"); }, 1800);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <AutosaveWidget status={status} lastSaved={ts} />
      <button type="button" className="btn btn-s sm" onClick={trigger}
        disabled={status === "saving"}>
        Simulate save
      </button>
    </div>
  );
}

function BannerDismissDemo() {
  const [key, setKey] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <HiringGuideBanner key={key} country="United States" flags={["🌍","d","🇺🇸"]} />
      <button type="button" className="btn btn-s sm" onClick={() => setKey(k => k + 1)}>
        Reset banner
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────
export default function DeelMoleculesPreview() {
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
            <span className="pg-title">Molecules — Wave 2</span>
          </div>
          <div className="hdr-r">
            <span className="count-tag">4 molecules · atoms from Wave 1</span>
            <button className="toggle-btn" onClick={() => setDark(d => !d)} type="button">
              {dark ? <Moon /> : <Sun />}
              {dark ? "Dark" : "Light"}
              <div className="track"><div className="thumb" /></div>
            </button>
          </div>
        </div>

        {/* ── 01 FormFieldGroup ── */}
        <Sec n={1} name="FormFieldGroup"
          desc="Stacks a section heading, optional description, and a responsive grid of TextInput / DropdownSelect atoms. Handles 1, 2, or 3-column layouts — the workhorse of every EOR form section."
          composed="SectionHeading + TextInput + DropdownSelect + HelperText"
          props={[
            ["title",       "string",    false, "Optional section heading above the fields"],
            ["description", "string",    false, "Optional helper text below the title"],
            ["fields",      "Field[]",   true,  "Array of field config objects (see Field type below)"],
            ["columns",     "1 | 2 | 3", false, "Grid column count (default: 1)"],
            ["—",           "Field.type","—",   "'text' | 'select' — determines which atom renders"],
            ["—",           "Field.label","—",  "Field label string"],
            ["—",           "Field.required","—","boolean — appends * to label"],
            ["—",           "Field.error","—",  "boolean — activates error state"],
            ["—",           "Field.helperText","—","string — shown below field"],
          ]}>
          <Card label="Single column — Workplace info" wide>
            <FormFieldGroup
              title="Workplace information"
              fields={[
                { type:"select", label:"Job Position", optional:true, placeholder:"Job Position (optional)", options:[{value:"pm",label:"Product Manager"},{value:"eng",label:"Engineer"}] },
                { type:"select", label:"Manager", optional:true, placeholder:"Manager (optional)", options:[{value:"a",label:"Alex Johnson"},{value:"b",label:"Sam Lee"}] },
                { type:"text",   label:"Worker ID", required:true, value:"260" },
                { type:"text",   label:"External worker ID", optional:true, placeholder:"e.g. EMP-2024-260" },
              ]}
            />
          </Card>
          <Card label="Two columns — Card details" wide>
            <FormFieldGroup
              title="Card Number"
              description="All transactions are secure and encrypted"
              columns={2}
              fields={[
                { type:"text", label:"Name on Card", placeholder:"John Doe" },
                { type:"text", label:"CVV", placeholder:"123" },
                { type:"select", label:"Month", placeholder:"MM", options:[{value:"01",label:"01 — Jan"},{value:"02",label:"02 — Feb"},{value:"03",label:"03 — Mar"}] },
                { type:"select", label:"Year",  placeholder:"YYYY", options:[{value:"2025",label:"2025"},{value:"2026",label:"2026"},{value:"2027",label:"2027"}] },
              ]}
            />
          </Card>
          <Card label="Error state in group" wide>
            <FormFieldGroup
              title="Compensation"
              columns={2}
              fields={[
                { type:"text", label:"Gross annual salary", required:true, value:"abc", error:true, helperText:"Please enter a valid number" },
                { type:"select", label:"Currency", value:"usd", options:[{value:"usd",label:"USD — US Dollar"},{value:"eur",label:"EUR — Euro"}] },
              ]}
            />
          </Card>
          <Card label="Disabled group" wide>
            <FormFieldGroup
              title="Organizational structure"
              description="Assigned by your administrator"
              fields={[
                { type:"select", label:"Department", optional:true, disabled:true, placeholder:"Not assigned", options:[] },
                { type:"select", label:"Teams",      optional:true, disabled:true, placeholder:"Not assigned", options:[] },
              ]}
            />
          </Card>
        </Sec>

        {/* ── 02 StepperRail ── */}
        <Sec n={2} name="StepperRail"
          desc="Vertical progress indicator used in the right-rail of every multi-step EOR flow. Each step shows completion state, active state, and future state. Completed steps are clickable to navigate back."
          composed="StepIndicator (circle + check) + connector line + status label + step name"
          props={[
            ["steps",       "Step[]",   true,  "Array of { label: string } — one per step"],
            ["currentStep", "number",   false, "1-indexed active step (default: 1)"],
            ["onStepClick", "function", false, "(stepNumber: number) => void — fired on completed steps only"],
          ]}>
          <Card label="Step 1 active" narrow>
            <StepperRail currentStep={1} steps={[
              { label:"Personal details" },
              { label:"Job details" },
              { label:"Compensation and dates" },
              { label:"Benefits and extras" },
            ]} />
          </Card>
          <Card label="Step 2 active" narrow>
            <StepperRail currentStep={2} steps={[
              { label:"Personal details" },
              { label:"Job details" },
              { label:"Compensation and dates" },
              { label:"Benefits and extras" },
            ]} />
          </Card>
          <Card label="Step 3 active" narrow>
            <StepperRail currentStep={3} steps={[
              { label:"Personal details" },
              { label:"Job details" },
              { label:"Compensation and dates" },
              { label:"Benefits and extras" },
            ]} />
          </Card>
          <Card label="All completed" narrow>
            <StepperRail currentStep={5} steps={[
              { label:"Personal details" },
              { label:"Job details" },
              { label:"Compensation and dates" },
              { label:"Benefits and extras" },
            ]} />
          </Card>
          <Card label="Interactive — click Next/Back or completed steps" full>
            <StepperInteractiveDemo />
          </Card>
        </Sec>

        {/* ── 03 AutosaveWidget ── */}
        <Sec n={3} name="AutosaveWidget"
          desc="Persistent right-rail card that communicates autosave state. Transitions between 'saving' (spinner + amber dot) and 'saved' (green dot + timestamp). Always offers a destructive delete draft action."
          composed="InfoIcon + body text + status indicator (dot or spinner) + SecondaryButton"
          props={[
            ["status",        "'saved' | 'saving'", false, "Controls dot colour and status text (default: 'saved')"],
            ["lastSaved",     "string",             false, "Human-readable timestamp e.g. '2 minutes ago'"],
            ["onDeleteDraft", "function",           false, "() => void — called on Delete draft click"],
          ]}>
          <Card label="Saved state" narrow>
            <AutosaveWidget status="saved" lastSaved="just now" />
          </Card>
          <Card label="Saving in progress" narrow>
            <AutosaveWidget status="saving" />
          </Card>
          <Card label="With timestamp" narrow>
            <AutosaveWidget status="saved" lastSaved="3 minutes ago" />
          </Card>
          <Card label="Interactive — click Simulate save" wide>
            <AutosaveDemo />
          </Card>
        </Sec>

        {/* ── 04 HiringGuideBanner ── */}
        <Sec n={4} name="HiringGuideBanner"
          desc="Contextual dismissable banner linking to Deel's country-specific hiring guide. Appears at the top of the contract creation flow. Two variants: info-tinted (prominent) and surface (subtle). Dismiss persists for the session."
          composed="Flag icons + body text + ExternalLink TextButton + DismissButton (×)"
          props={[
            ["country",   "string",            false, "Country name inserted into the body copy"],
            ["guideUrl",  "string",            false, "URL for the 'View' link"],
            ["flags",     "string[]",          false, "2–3 emoji or character flags shown as stacked circles"],
            ["variant",   "'info' | 'surface'",false, "'info' = blue tint (default), 'surface' = neutral card"],
            ["onDismiss", "function",          false, "() => void — called when × is clicked"],
          ]}>
          <Card label="Info variant — United States" full>
            <HiringGuideBanner key="us" country="United States" flags={["🌍","d","🇺🇸"]} variant="info" />
          </Card>
          <Card label="Info variant — Germany" full>
            <HiringGuideBanner key="de" country="Germany" flags={["🌍","d","🇩🇪"]} variant="info" />
          </Card>
          <Card label="Surface / neutral variant" full>
            <HiringGuideBanner key="ca" country="Canada" flags={["🌍","d","🇨🇦"]} variant="surface" />
          </Card>
          <Card label="Interactive — dismiss then reset" full>
            <BannerDismissDemo />
          </Card>
        </Sec>

        {/* Footer */}
        <div className="foot">
          <span>Deel Design System · Wave 2 · Molecules</span>
          <span>Next → Wave 3: AI Molecules (ComplianceCheckPanel, MarketRateChart)</span>
        </div>

      </div>
    </>
  );
}
