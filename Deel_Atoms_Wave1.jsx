import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
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
  inputBg:      "#FFFFFF",
  rowHover:     "#FAFAFA",
  shadow:       "0 1px 2px rgba(0,0,0,0.05)",
  shadowMd:     "0 4px 12px rgba(0,0,0,0.1)",
  ring:         "rgba(24,24,27,0.1)",
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
  inputBg:      "#27272A",
  rowHover:     "#1F1F23",
  shadow:       "0 1px 3px rgba(0,0,0,0.4)",
  shadowMd:     "0 6px 20px rgba(0,0,0,0.5)",
  ring:         "rgba(250,250,250,0.12)",
};

const css = (t, isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }

  /* Shell */
  .shell {
    min-height: 100vh; padding: 40px 36px;
    background: ${t.bg}; color: ${t.textMain};
    font-family: 'Inter', sans-serif;
    transition: background 0.18s, color 0.18s;
  }

  /* Header */
  .hdr {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 44px; padding-bottom: 20px;
    border-bottom: 1px solid ${t.border};
  }
  .hdr-l { display: flex; flex-direction: column; gap: 2px; }
  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: ${t.textMuted};
  }
  .pg-title { font-size: 21px; font-weight: 600; letter-spacing: -0.025em; color: ${t.textMain}; }
  .hdr-r { display: flex; align-items: center; gap: 8px; }
  .count-tag {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: ${t.textMuted}; background: ${t.surface};
    border: 1px solid ${t.border}; padding: 4px 10px; border-radius: 6px;
  }

  /* Dark toggle */
  .toggle-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 5px 11px 5px 9px;
    background: ${t.surface}; border: 1px solid ${t.border};
    border-radius: 8px; cursor: pointer; font-family: 'Inter', sans-serif;
    font-size: 12.5px; font-weight: 500; color: ${t.textMain};
    transition: border-color 0.12s, background 0.12s;
  }
  .toggle-btn:hover { border-color: ${t.textMuted}; background: ${t.surfaceHover}; }
  .track {
    width: 30px; height: 17px; border-radius: 999px;
    background: ${isDark ? t.primary : t.border};
    position: relative; transition: background 0.18s;
  }
  .thumb {
    position: absolute; top: 2px; left: ${isDark ? "14px" : "2px"};
    width: 13px; height: 13px; border-radius: 50%;
    background: ${isDark ? t.btnText : "#fff"};
    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
    transition: left 0.18s;
  }

  /* Section */
  .sec { margin-bottom: 52px; }
  .sec-hd { display: flex; align-items: baseline; gap: 9px; margin-bottom: 3px; }
  .sec-n {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: ${t.textMuted}; font-weight: 500;
  }
  .sec-name { font-size: 14.5px; font-weight: 600; color: ${t.textMain}; letter-spacing: -0.01em; }
  .sec-desc { font-size: 12.5px; color: ${t.textMuted}; line-height: 1.55; margin: 3px 0 16px; }

  /* Grid */
  .grid { display: flex; flex-wrap: wrap; gap: 10px; }
  .card {
    flex: 1; min-width: 190px;
    background: ${t.surface}; border: 1px solid ${t.border};
    border-radius: 10px; padding: 14px 16px;
    box-shadow: ${t.shadow};
  }
  .card.wide { min-width: 270px; }
  .card.full { min-width: 100%; flex: none; }
  .card-lbl {
    font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
    font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    color: ${t.textMuted}; margin-bottom: 11px;
  }

  /* Props table */
  .ptable { width: 100%; border-collapse: collapse; margin-top: 18px; }
  .ptable thead tr { border-bottom: 1px solid ${t.border}; }
  .ptable th {
    font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
    letter-spacing: 0.07em; text-transform: uppercase;
    padding: 8px 12px; text-align: left; font-weight: 500; color: ${t.textMuted};
  }
  .ptable td {
    padding: 9px 12px; border-bottom: 1px solid ${t.border};
    font-size: 12px; color: ${t.textMain}; vertical-align: top;
  }
  .ptable tr:last-child td { border-bottom: none; }
  .ptable tbody tr:hover td { background: ${t.rowHover}; }
  .pname { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${t.textMain}; }
  .ptype { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${t.purple}; }
  .preq  { font-size: 11px; color: ${t.error}; }
  .pdesc { font-size: 11.5px; color: ${t.textMuted}; line-height: 1.5; }

  /* TextInput */
  .fi { display: flex; flex-direction: column; gap: 4px; }
  .fl { font-size: 12px; font-weight: 500; color: ${t.textMain}; }
  .fl .req { color: ${t.error}; margin-left: 1px; }
  .fi input {
    height: 36px; width: 100%; padding: 0 11px;
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: ${t.textMain};
    background: ${t.inputBg}; border: 1px solid ${t.border};
    border-radius: 6px; outline: none; appearance: none;
    transition: border-color 0.12s, box-shadow 0.12s;
  }
  .fi input::placeholder { color: ${t.textDisabled}; }
  .fi input:focus { border-color: ${t.borderFocus}; box-shadow: 0 0 0 3px ${t.ring}; }
  .fi input:disabled { background: ${t.surfaceHover}; color: ${t.textDisabled}; cursor: not-allowed; }
  .fi input.err { border-color: ${t.error}; background: ${t.errorBg}; }
  .fhint { font-size: 11.5px; color: ${t.textMuted}; margin-top: 1px; }
  .fhint.err { color: ${t.error}; }

  /* DropdownSelect */
  .selw { position: relative; }
  .selw select {
    height: 36px; width: 100%; padding: 0 34px 0 11px;
    font-family: 'Inter', sans-serif; font-size: 13.5px;
    background: ${t.inputBg}; border: 1px solid ${t.border};
    border-radius: 6px; outline: none; appearance: none; cursor: pointer;
    color: ${t.textMain}; transition: border-color 0.12s, box-shadow 0.12s;
  }
  .selw select.ph { color: ${t.textDisabled}; }
  .selw select:focus { border-color: ${t.borderFocus}; box-shadow: 0 0 0 3px ${t.ring}; }
  .selw select:disabled { background: ${t.surfaceHover}; color: ${t.textDisabled}; cursor: not-allowed; }
  .selw select option { color: ${t.textMain}; background: ${t.inputBg}; }
  .chev { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: ${t.textMuted}; }

  /* StatusBadge */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 2.5px 8px; border-radius: 5px;
    font-size: 11.5px; font-weight: 500;
  }
  .bdot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .badge.mandatory { background: ${t.mandatoryBg}; color: ${t.mandatory}; }
  .badge.mandatory .bdot { background: ${t.mandatory}; }
  .badge.new       { background: ${t.purpleBg}; color: ${t.purple}; }
  .badge.new .bdot { background: ${t.purple}; }
  .badge.completed { background: ${t.successBg}; color: ${t.success}; }
  .badge.completed .bdot { background: ${t.success}; }
  .badge.failed    { background: ${t.errorBg}; color: ${t.error}; }
  .badge.failed .bdot { background: ${t.error}; }

  /* RadioOption */
  .rrow {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 13px; border: 1px solid ${t.border}; border-radius: 8px;
    cursor: pointer; user-select: none; width: 100%;
    background: ${t.surface};
    transition: border-color 0.1s, background 0.1s;
    font-family: 'Inter', sans-serif; appearance: none; text-align: left;
  }
  .rrow:hover:not(:disabled) { border-color: ${t.textMuted}; }
  .rrow.on { border-color: ${t.primary}; background: ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)"}; }
  .rrow:disabled { opacity: 0.42; cursor: not-allowed; }
  .rcirc {
    width: 15px; height: 15px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid ${t.border}; display: flex; align-items: center; justify-content: center;
    transition: border-color 0.1s;
  }
  .rrow.on .rcirc { border-color: ${t.primary}; }
  .rdot { width: 7px; height: 7px; border-radius: 50%; background: ${t.primary}; }
  .rlbl { font-size: 13.5px; color: ${t.textMain}; }
  .rsub { font-size: 11.5px; color: ${t.textMuted}; margin-top: 1px; }
  .rstack { display: flex; flex-direction: column; gap: 6px; width: 100%; }

  /* ToggleRow */
  .trow {
    display: flex; align-items: center; justify-content: space-between; gap: 14px;
    padding: 12px 14px; border: 1px solid ${t.border}; border-radius: 8px;
    background: ${t.surface}; cursor: pointer; user-select: none;
  }
  .trow:hover:not(.trow-disabled) { border-color: ${t.textMuted}; }
  .trow-disabled { opacity: 0.45; cursor: not-allowed; }
  .trow-text { flex: 1; min-width: 0; }
  .trow-label { font-size: 13.5px; font-weight: 500; color: ${t.textMain}; line-height: 1.4; }
  .trow-desc  { font-size: 12px; color: ${t.textMuted}; margin-top: 2px; line-height: 1.4; }
  .trow-track {
    width: 36px; height: 20px; border-radius: 999px; flex-shrink: 0;
    position: relative; transition: background 0.18s;
  }
  .trow-track.on  { background: ${t.primary}; }
  .trow-track.off { background: ${t.border}; }
  .trow-thumb {
    position: absolute; top: 2px; width: 16px; height: 16px;
    border-radius: 50%; background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: left 0.18s;
  }
  .trow-track.on  .trow-thumb { left: 18px; }
  .trow-track.off .trow-thumb { left: 2px; }

  /* SectionCard */
  .sc { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: ${br + 6}px; padding: 20px 20px 24px; box-shadow: ${t.shadow}; display: flex; flex-direction: column; gap: 16px; }
  .sc-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .sc-title { font-size: 15px; font-weight: 600; color: ${t.textMain}; letter-spacing: -.01em; }
  .sc-info-btn { display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: ${t.textMuted}; padding: 3px; border-radius: 5px; transition: color .12s, background .12s; flex-shrink: 0; }
  .sc-info-btn:hover { color: ${t.textMain}; background: ${t.surfaceHover}; }
  .sc-body { display: flex; flex-direction: column; gap: 12px; }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 0 14px; height: 36px;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border-radius: 6px; border: none; cursor: pointer; letter-spacing: 0.005em;
    white-space: nowrap; transition: background 0.1s, box-shadow 0.1s, opacity 0.1s, transform 0.07s;
  }
  .btn:active:not(:disabled) { transform: scale(0.985); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn.sm { height: 30px; padding: 0 11px; font-size: 12px; border-radius: 5px; }
  .btn.lg { height: 42px; padding: 0 18px; font-size: 14px; }

  .btn-p { background: ${t.primary}; color: ${t.btnText}; }
  .btn-p:hover:not(:disabled) { background: ${t.primaryHover}; box-shadow: ${t.shadowMd}; }

  .btn-s { background: transparent; color: ${t.textMain}; border: 1px solid ${t.border}; }
  .btn-s:hover:not(:disabled) { background: ${t.surfaceHover}; border-color: ${t.textMuted}; }

  .btn-g {
    background: transparent; color: ${t.textMuted}; border: none;
    height: auto; padding: 0; font-size: 12.5px; font-weight: 400;
    text-decoration: underline; text-underline-offset: 3px;
    text-decoration-color: ${t.border};
  }
  .btn-g:hover:not(:disabled) { color: ${t.textMain}; text-decoration-color: ${t.textMain}; }

  .spin {
    width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid ${isDark ? "rgba(9,9,11,0.3)" : "rgba(255,255,255,0.3)"};
    border-top-color: ${t.btnText};
    animation: sp 0.55s linear infinite;
  }
  .spin-inv { border: 1.5px solid ${t.border}; border-top-color: ${t.textMain}; }
  @keyframes sp { to { transform: rotate(360deg); } }
  .brow { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }

  /* Footer */
  .foot {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 20px; border-top: 1px solid ${t.border};
    font-family: 'JetBrains Mono', monospace; font-size: 10px;
    letter-spacing: 0.07em; text-transform: uppercase; color: ${t.textMuted};
  }
`;

// ─── SVG ICONS ───────────────────────────────────────────────────
const Chevron  = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 5 7 9 11 5"/></svg>;
const Sun      = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"/><line x1="17.7" y1="4.2" x2="19.8" y2="6.3"/><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"/></svg>;
const Moon     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const Plus     = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="6.5" y1="1.5" x2="6.5" y2="11.5"/><line x1="1.5" y1="6.5" x2="11.5" y2="6.5"/></svg>;
const Arrow    = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="6.5" x2="11" y2="6.5"/><polyline points="7.5 3 11 6.5 7.5 10"/></svg>;
const CheckRun = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="5"/><polyline points="4 6.5 5.8 8.5 9.5 4.5"/></svg>;

// ─── ATOMS ───────────────────────────────────────────────────────
export function TextInput({ label, placeholder, value, required, disabled, error, helperText }) {
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

export function DropdownSelect({ label, placeholder = "Select…", options = [], value, disabled, optional }) {
  const [v, setV] = useState(value ?? "");
  return (
    <div className="fi">
      {label && <label className="fl">{label}{optional && <span style={{ fontWeight: 400, opacity: 0.65 }}> (optional)</span>}</label>}
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

export function StatusBadge({ variant = "mandatory", label, dot = true }) {
  const defaults = { mandatory: "Mandatory", new: "New", completed: "Completed", failed: "Failed" };
  return (
    <span className={`badge ${variant}`}>
      {dot && <span className="bdot" />}
      {label ?? defaults[variant]}
    </span>
  );
}

export function RadioOption({ label, sublabel, selected, disabled, onClick }) {
  return (
    <button type="button" className={`rrow${selected ? " on" : ""}`}
      disabled={disabled} onClick={onClick}>
      <div className="rcirc">{selected && <div className="rdot" />}</div>
      <div>
        <div className="rlbl">{label}</div>
        {sublabel && <div className="rsub">{sublabel}</div>}
      </div>
    </button>
  );
}

export function ToggleRow({ label, description, checked, disabled, onChange }) {
  const [internal, setInternal] = useState(checked ?? false);
  const isOn = checked !== undefined ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (checked === undefined) setInternal(next);
    onChange?.(next);
  };
  return (
    <div
      className={`trow${disabled ? " trow-disabled" : ""}`}
      role="switch"
      aria-checked={isOn}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={e => (e.key === " " || e.key === "Enter") && toggle()}
    >
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

export function SectionCard({ title, showInfoButton, onInfoClick, children }) {
  const showBtn = showInfoButton || !!onInfoClick;
  return (
    <div className="sc">
      <div className="sc-header">
        <span className="sc-title">{title}</span>
        {showBtn && (
          <button
            type="button"
            className="sc-info-btn"
            onClick={onInfoClick}
            aria-label="More information"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="6.5" />
              <line x1="8" y1="7.5" x2="8" y2="11" />
              <circle cx="8" cy="5.5" r=".8" fill="currentColor" stroke="none" />
            </svg>
          </button>
        )}
      </div>
      {children && <div className="sc-body">{children}</div>}
    </div>
  );
}

export function PrimaryButton({ label, disabled, loading, size, icon }) {
  return (
    <button type="button"
      className={`btn btn-p${size === "sm" ? " sm" : size === "lg" ? " lg" : ""}`}
      disabled={disabled || loading}>
      {loading ? <span className="spin" /> : icon}
      {label}
    </button>
  );
}
export function SecondaryButton({ label, disabled, loading, size, icon }) {
  return (
    <button type="button"
      className={`btn btn-s${size === "sm" ? " sm" : size === "lg" ? " lg" : ""}`}
      disabled={disabled || loading}>
      {loading && <span className="spin spin-inv" />}
      {!loading && icon}
      {label}
    </button>
  );
}
export function TextButton({ label, disabled }) {
  return <button type="button" className="btn btn-g" disabled={disabled}>{label}</button>;
}

// ─── LAYOUT HELPERS ──────────────────────────────────────────────
function Props({ rows }) {
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
function Sec({ n, name, desc, props, children }) {
  return (
    <div className="sec">
      <div className="sec-hd">
        <span className="sec-n">0{n}</span>
        <span className="sec-name">{name}</span>
      </div>
      <p className="sec-desc">{desc}</p>
      <div className="grid">{children}</div>
      {props && <Props rows={props} />}
    </div>
  );
}
function Card({ label, wide, full, children }) {
  return (
    <div className={`card${wide ? " wide" : ""}${full ? " full" : ""}`}>
      <div className="card-lbl">{label}</div>
      {children}
    </div>
  );
}

// ─── INTERACTIVE DEMOS ───────────────────────────────────────────
function RadioDemo() {
  const [v, setV] = useState("full");
  return (
    <div className="rstack">
      <RadioOption label="Full-time" selected={v === "full"} onClick={() => setV("full")} />
      <RadioOption label="Part-time" sublabel="Reduced hours arrangement" selected={v === "part"} onClick={() => setV("part")} />
    </div>
  );
}
function LoadingDemo() {
  const [l, setL] = useState(false);
  return (
    <PrimaryButton label={l ? "Saving…" : "Save scope"} loading={l}
      onClick={() => { setL(true); setTimeout(() => setL(false), 2000); }} />
  );
}

// ─── MAIN ────────────────────────────────────────────────────────
export default function DeelAtomsPreview() {
  const [dark, setDark] = useState(false);
  const t = dark ? darkTokens : lightTokens;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css(t, dark) }} />
      <div className="shell">

        {/* Header */}
        <div className="hdr">
          <div className="hdr-l">
            <span className="eyebrow">Deel Design System</span>
            <span className="pg-title">Atoms — Wave 1</span>
          </div>
          <div className="hdr-r">
            <span className="count-tag">7 components · 20 variants</span>
            <button className="toggle-btn" onClick={() => setDark(d => !d)} type="button">
              {dark ? <Moon /> : <Sun />}
              {dark ? "Dark" : "Light"}
              <div className="track"><div className="thumb" /></div>
            </button>
          </div>
        </div>

        {/* 01 TextInput */}
        <Sec n={1} name="TextInput"
          desc="Single-line field for names, IDs, salary values, and search inputs across the contract flow."
          props={[
            ["label",      "string",   false, "Label above the input"],
            ["placeholder","string",   false, "Greyed hint text"],
            ["value",      "string",   false, "Controlled value"],
            ["required",   "boolean",  false, "Appends * to label"],
            ["disabled",   "boolean",  false, "Prevents interaction"],
            ["error",      "boolean",  false, "Red border + tinted background"],
            ["helperText", "string",   false, "Hint or error message below input"],
            ["onChange",   "function", false, "(value: string) => void"],
          ]}>
          <Card label="Default">
            <TextInput label="Worker ID" placeholder="Enter worker ID" required />
          </Card>
          <Card label="Filled">
            <TextInput label="External worker ID" value="EMP-2024-260" />
          </Card>
          <Card label="Disabled">
            <TextInput label="Worker ID" value="260" disabled helperText="Auto-assigned" />
          </Card>
          <Card label="Error">
            <TextInput label="Gross annual salary" value="abc" error
              helperText="Please enter a valid number" required />
          </Card>
          <Card label="With helper text" wide>
            <TextInput label="Manager" placeholder="Search by name or email"
              helperText="You can search by name or email" />
          </Card>
        </Sec>

        {/* 02 DropdownSelect */}
        <Sec n={2} name="DropdownSelect"
          desc="Bordered select with native chevron. Handles job titles, seniority levels, departments, hiring objective."
          props={[
            ["label",      "string",   false, "Field label"],
            ["placeholder","string",   false, "Shown before selection"],
            ["options",    "Option[]", true,  "{ value, label }[]"],
            ["value",      "string",   false, "Controlled selected value"],
            ["optional",   "boolean",  false, "Appends (optional) to label"],
            ["disabled",   "boolean",  false, "Prevents interaction"],
          ]}>
          <Card label="Unselected / placeholder">
            <DropdownSelect label="Job Position" optional
              placeholder="Job Position (optional)"
              options={[{ value: "pm", label: "Product Manager" }, { value: "eng", label: "Engineer" }]} />
          </Card>
          <Card label="Selected">
            <DropdownSelect label="Job title" value="ea"
              options={[{ value: "ea", label: "Executive Assistant" }, { value: "pm", label: "Product Manager" }]} />
          </Card>
          <Card label="Seniority level">
            <DropdownSelect label="Seniority level" value="mid"
              options={[
                { value: "jun", label: "Junior (IC Level 1)" },
                { value: "mid", label: "Mid (IC Level 2)" },
                { value: "sen", label: "Senior (IC Level 3)" },
              ]} />
          </Card>
          <Card label="Disabled">
            <DropdownSelect label="Department" optional disabled
              placeholder="Department (optional)"
              options={[{ value: "eng", label: "Engineering" }]} />
          </Card>
        </Sec>

        {/* 03 StatusBadge */}
        <Sec n={3} name="StatusBadge"
          desc="Compact pill labels for benefit cards, stepper states, and AI compliance results."
          props={[
            ["variant", "'mandatory'|'new'|'completed'|'failed'", true,  "Visual + semantic style"],
            ["label",   "string",                                  false, "Override default text"],
            ["dot",     "boolean",                                 false, "Show colour dot (default: true)"],
          ]}>
          <Card label="Mandatory — benefits">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <StatusBadge variant="mandatory" />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13 }}>Healthcare</span>
                <StatusBadge variant="mandatory" />
              </div>
            </div>
          </Card>
          <Card label="New — feature flags">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <StatusBadge variant="new" />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13 }}>Travel Insurance</span>
                <StatusBadge variant="new" />
              </div>
            </div>
          </Card>
          <Card label="Completed — stepper">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <StatusBadge variant="completed" />
              <StatusBadge variant="completed" label="Job details" />
            </div>
          </Card>
          <Card label="Failed — compliance">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <StatusBadge variant="failed" />
              <StatusBadge variant="failed" label="Scope mismatch" />
            </div>
          </Card>
          <Card label="No dot" full>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["mandatory","new","completed","failed"].map(v =>
                <StatusBadge key={v} variant={v} dot={false} />)}
            </div>
          </Card>
        </Sec>

        {/* 04 RadioOption */}
        <Sec n={4} name="RadioOption"
          desc="Full-width tappable row for employment type, PTO policy, notice period selection. Supports sublabels."
          props={[
            ["label",    "string",   true,  "Primary option label"],
            ["sublabel", "string",   false, "Secondary descriptive line"],
            ["selected", "boolean",  false, "Controlled selected state"],
            ["disabled", "boolean",  false, "Mutes + prevents interaction"],
            ["onClick",  "function", false, "() => void"],
          ]}>
          <Card label="Unselected" wide>
            <RadioOption label="Full-time" />
          </Card>
          <Card label="Selected" wide>
            <RadioOption label="Full-time" selected />
          </Card>
          <Card label="With sublabel" wide>
            <RadioOption label="Minimum legal requirement"
              sublabel="Follows US local PTO regulations" selected />
          </Card>
          <Card label="Disabled" wide>
            <RadioOption label="Custom notice period" disabled />
          </Card>
          <Card label="Interactive group — click to switch" full>
            <RadioDemo />
          </Card>
        </Sec>

        {/* 05 Buttons */}
        <Sec n={5} name="Buttons"
          desc="Three tiers — Primary (filled), Secondary (outlined), Text (ghost). All support loading, disabled, three sizes, and icons."
          props={[
            ["label",    "string",         true,  "Button label text"],
            ["disabled", "boolean",        false, "Prevents interaction"],
            ["loading",  "boolean",        false, "Shows spinner, blocks click"],
            ["size",     "'sm'|'md'|'lg'", false, "Height 30 / 36 / 42px"],
            ["icon",     "ReactNode",      false, "Leading icon"],
            ["onClick",  "function",       false, "() => void"],
          ]}>
          <Card label="Primary — default / disabled" wide>
            <div className="brow">
              <PrimaryButton label="Add Healthcare" />
              <PrimaryButton label="Disabled" disabled />
            </div>
          </Card>
          <Card label="Primary — loading (click)" wide>
            <LoadingDemo />
          </Card>
          <Card label="Primary — with icons" wide>
            <div className="brow">
              <PrimaryButton label="Add benefit" icon={<Plus />} />
              <PrimaryButton label="Continue" icon={<Arrow />} />
            </div>
          </Card>
          <Card label="Secondary — states" wide>
            <div className="brow">
              <SecondaryButton label="Manage job scopes" />
              <SecondaryButton label="Delete draft" />
              <SecondaryButton label="Disabled" disabled />
            </div>
          </Card>
          <Card label="Secondary — with icons" wide>
            <div className="brow">
              <SecondaryButton label="Create schedule" icon={<Arrow />} />
              <SecondaryButton label="Run compliance check" icon={<CheckRun />} />
            </div>
          </Card>
          <Card label="Text / ghost" wide>
            <div className="brow">
              <TextButton label="Learn more" />
              <TextButton label="Report to engineering team" />
            </div>
          </Card>
          <Card label="All sizes" full>
            <div className="brow">
              <PrimaryButton label="Small" size="sm" />
              <PrimaryButton label="Medium" />
              <PrimaryButton label="Large" size="lg" />
              <SecondaryButton label="Small" size="sm" />
              <SecondaryButton label="Medium" />
              <SecondaryButton label="Large" size="lg" />
            </div>
          </Card>
        </Sec>

        {/* 06 ToggleRow */}
        <Sec n={6} name="ToggleRow"
          desc="Full-width bordered row with an iOS-style toggle switch. Used for binary settings like 'I don't know the worker's personal details yet' in the Add person flow."
          props={[
            ["label",      "string",   true,  "Primary label text"],
            ["description","string",   false, "Secondary help text below the label"],
            ["checked",    "boolean",  false, "Controlled checked state"],
            ["disabled",   "boolean",  false, "Prevents interaction, mutes appearance"],
            ["onChange",   "function", false, "(checked: boolean) => void"],
          ]}>
          <Card label="Off (default)" wide>
            <ToggleRow label="I don't know the worker's personal details yet"
              description="Get a cost estimate without providing worker details" />
          </Card>
          <Card label="On" wide>
            <ToggleRow label="I don't know the worker's personal details yet"
              description="Get a cost estimate without providing worker details"
              checked />
          </Card>
          <Card label="With description only" wide>
            <ToggleRow label="Send onboarding invitation immediately"
              description="Worker will receive an email to complete their profile"
              checked />
          </Card>
          <Card label="Disabled" wide>
            <ToggleRow label="Override compliance warnings"
              description="Only available to contract admins"
              disabled />
          </Card>
          <Card label="Label only (no description)" wide>
            <ToggleRow label="Enable custom notice period" />
          </Card>
          <Card label="Interactive — click to toggle" full>
            <ToggleRow label="I don't know the worker's personal details yet"
              description="Get a cost estimate without providing worker details" />
          </Card>
        </Sec>

        <Sec n={7} name="SectionCard"
          desc="White rounded card that wraps a group of related form fields. Displays a bold section title at the top and an optional ⓘ icon button for contextual help. Used for 'Team information', 'Employee personal details', etc. in the Add person flow."
          props={[
            ["title",       "string",   true,  "Bold section heading at the top of the card"],
            ["onInfoClick", "function", false, "Renders a ⓘ button when provided; called on click"],
            ["children",   "ReactNode", false, "Form fields or any content inside the card"],
          ]}>
          <Card label="Title only" wide>
            <SectionCard title="Team information" />
          </Card>
          <Card label="Title + ⓘ button" wide>
            <SectionCard title="Employee personal details" onInfoClick={() => {}} />
          </Card>
          <Card label="With field placeholders" wide>
            <SectionCard title="Workplace information">
              <div style={{ height: 40, border: `1px solid var(--border, #e2e2e2)`, borderRadius: 7, background: "transparent", display: "flex", alignItems: "center", paddingLeft: 12, color: "#aaa", fontSize: 13 }}>Entity — Select entity</div>
              <div style={{ height: 40, border: `1px solid var(--border, #e2e2e2)`, borderRadius: 7, background: "transparent", display: "flex", alignItems: "center", paddingLeft: 12, color: "#aaa", fontSize: 13 }}>Group — Select group</div>
            </SectionCard>
          </Card>
          <Card label="Interactive ⓘ button" wide>
            <SectionCard
              title="Contract details"
              onInfoClick={() => alert('These details appear on the EOR contract and cannot be changed after signing.')}
            >
              <div style={{ height: 40, border: `1px solid var(--border, #e2e2e2)`, borderRadius: 7, background: "transparent", display: "flex", alignItems: "center", paddingLeft: 12, color: "#aaa", fontSize: 13 }}>Country — Select country</div>
            </SectionCard>
          </Card>
        </Sec>

        {/* Footer */}
        <div className="foot">
          <span>Deel Design System · Wave 1 · Atoms</span>
          <span>Next → Wave 2: Molecules</span>
        </div>

      </div>
    </>
  );
}
