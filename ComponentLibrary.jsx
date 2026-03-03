/**
 * @file ComponentLibrary.jsx
 * @description Deel AI Design System — unified component library.
 *
 * Single source of truth for every UI component used across the EOR
 * contract creation flow and any feature built on top of it.
 *
 * ─── HOW TO USE ────────────────────────────────────────────────────
 *
 * 1. Import specific components:
 *      import { TextInput, ComplianceCheckPanel } from "./ComponentLibrary";
 *
 * 2. Inject shared CSS into the page root:
 *      import { makeLibraryCSS, lightTokens } from "./ComponentLibrary";
 *      <style dangerouslySetInnerHTML={{ __html: makeLibraryCSS(lightTokens, false) }} />
 *
 * 3. Feed COMPONENT_MANIFEST to an LLM as JSON context — it describes
 *    every component, its props, domain, composition lineage, and a
 *    ready-to-use JSX usage example:
 *      import { COMPONENT_MANIFEST } from "./ComponentLibrary";
 *      const context = JSON.stringify(COMPONENT_MANIFEST, null, 2);
 *
 * ─── DOMAINS ───────────────────────────────────────────────────────
 *  Forms               · TextInput, DateInput, DropdownSelect, RadioOption, FormFieldGroup
 *  Actions             · PrimaryButton, SecondaryButton, TextButton
 *  Status & Feedback   · StatusBadge, AutosaveWidget, ContextBanner (guide / insight / promo / info variants)
 *  Navigation          · StepperRail
 *  Compliance          · ComplianceCheckCard, ComplianceCheckPanel
 *  Market Intelligence · MarketRateChart
 *  Blocks              · JobDescriptionBlock, CompensationBlock, BenefitsBlock
 *  Flows               · EORContractCreationFlow
 *
 * ─── TIERS (composition hierarchy) ────────────────────────────────
 *  atom  →  molecule  →  ai-molecule  →  block  →  flow
 */

import { useState, useEffect, useRef, useLayoutEffect } from "react";

// ═══════════════════════════════════════════════════════════════════
// ICON MAP
// Each key maps to the inner JSX of a 24×24 viewBox SVG.
// All icons use stroke="currentColor", fill="none", round caps/joins.
// ═══════════════════════════════════════════════════════════════════
const ICON_MAP = {
  // ── Existing system icons (redrawn at 24×24) ──────────────────
  "chevron-down":   <polyline points="4 9 12 17 20 9" />,
  "check":          <polyline points="20 6 9 17 4 12" />,
  "plus":           <>{/* plus */}<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  "refresh":        <><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4" /></>,
  "info":           <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
  "warning":        <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
  "x":              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  "external-link":  <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>,
  "save":           <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
  "calendar":       <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
  "star":           <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  "ai":             <><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>,
  // ── Benefit-specific icons ─────────────────────────────────────
  "shield-plus":    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>,
  "award":          <><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></>,
  "file-text":      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
  "plane":          <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2a1 1 0 0 0-.7 1l.6.6 4.5 4.5 1 2.5-2 2.5 2 2 2.5-2 4 1 4.2-4.2a1 1 0 0 0 .6-1z" />,
  "building":       <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><line x1="10" y1="6" x2="14" y2="6" /><line x1="10" y1="10" x2="14" y2="10" /><line x1="10" y1="14" x2="14" y2="14" /><line x1="10" y1="18" x2="14" y2="18" /></>,
  "pie-chart":      <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>,
  "fingerprint":    <><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" /><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" /></>,
};

/**
 * Icon atom. Renders any named icon from the design system at a given size.
 * Uses currentColor for stroke — tint by setting `color` or the CSS color of a parent.
 *
 * @param {object}  props
 * @param {'chevron-down'|'check'|'plus'|'refresh'|'info'|'warning'|'x'|'external-link'|'save'|'calendar'|'star'|'ai'|'shield-plus'|'award'|'file-text'|'plane'|'building'|'pie-chart'|'fingerprint'} props.name
 * @param {number}  [props.size=16]  Width and height in px.
 * @param {string}  [props.color]    Explicit stroke color; falls back to currentColor.
 * @param {object}  [props.style]    Extra inline styles on the <svg>.
 * @param {string}  [props.className]
 */
export function Icon({ name, size = 16, color, style, className }) {
  const paths = ICON_MAP[name];
  if (!paths) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT MANIFEST
// Pure JSON-serialisable. Feed this to any LLM as system context.
// ═══════════════════════════════════════════════════════════════════
export const COMPONENT_MANIFEST = [
  // ── Forms ──────────────────────────────────────────────────────
  {
    name: "TextInput",
    domain: "Forms",
    tier: "atom",
    description:
      "Single-line text field. Used for worker IDs, salary values, names, and free-text search across the contract flow. Supports label, placeholder, error state, helper text, required flag, and disabled state.",
    composedOf: [],
    props: [
      { name: "label",       type: "string",   required: false, description: "Label displayed above the input." },
      { name: "placeholder", type: "string",   required: false, description: "Greyed hint text shown when empty." },
      { name: "value",       type: "string",   required: false, description: "Controlled value." },
      { name: "required",    type: "boolean",  required: false, description: "Appends a red * to the label." },
      { name: "disabled",    type: "boolean",  required: false, description: "Prevents interaction; mutes appearance." },
      { name: "error",       type: "boolean",  required: false, description: "Red border + error background tint." },
      { name: "helperText",  type: "string",   required: false, description: "Hint or error message shown below the input." },
      { name: "prefix",      type: "string",   required: false, description: "Leading adornment inside the input border, e.g. '$' for salary fields." },
      { name: "suffix",      type: "string",   required: false, description: "Trailing adornment inside the input border, e.g. 'USD' or 'Hours'." },
      { name: "onChange",    type: "(value: string) => void", required: false, description: "Called on every keystroke." },
    ],
    usage: '<TextInput label="Worker ID" placeholder="Enter worker ID" required />',
  },
  {
    name: "DropdownSelect",
    domain: "Forms",
    tier: "atom",
    description:
      "Native select with a custom chevron. Handles job titles, seniority levels, departments, currencies, and hiring objectives. Placeholder option is shown until selection.",
    composedOf: [],
    props: [
      { name: "label",       type: "string",            required: false, description: "Field label." },
      { name: "placeholder", type: "string",            required: false, description: "Shown before selection (default: 'Select…')." },
      { name: "options",     type: "{ value: string; label: string }[]", required: true, description: "Selectable options." },
      { name: "value",       type: "string",            required: false, description: "Controlled selected value." },
      { name: "optional",    type: "boolean",           required: false, description: "Appends '(optional)' to the label." },
      { name: "disabled",    type: "boolean",           required: false, description: "Prevents interaction." },
      { name: "helperText",  type: "string",            required: false, description: "Hint text shown below the select." },
      { name: "onChange",    type: "(value: string) => void", required: false, description: "Called on selection change." },
    ],
    usage: '<DropdownSelect label="Job title" options={[{ value: "ea", label: "Executive Assistant" }]} />',
  },
  {
    name: "RadioOption",
    domain: "Forms",
    tier: "atom",
    description:
      "Full-width tappable row for mutually exclusive choices — employment type, PTO policy, notice period, salary period. Controlled: track selection state in the parent and pass selected + onClick.",
    composedOf: [],
    props: [
      { name: "label",    type: "string",   required: true,  description: "Primary option label." },
      { name: "sublabel", type: "string",   required: false, description: "Secondary descriptive line shown below the label." },
      { name: "selected", type: "boolean",  required: false, description: "Whether this option is selected." },
      { name: "disabled", type: "boolean",  required: false, description: "Mutes appearance and prevents interaction." },
      { name: "onClick",  type: "() => void", required: false, description: "Called when the row is clicked." },
    ],
    usage: '<RadioOption label="Full-time" selected={empType === "full"} onClick={() => setEmpType("full")} />',
  },
  {
    name: "ToggleRow",
    domain: "Forms",
    tier: "atom",
    description:
      "Full-width bordered row with an iOS-style toggle switch on the right. Used for binary setting fields — e.g. 'I don't know the worker's personal details yet'. Supports controlled and uncontrolled modes, a description line, and a disabled state.",
    composedOf: [],
    props: [
      { name: "label",       type: "string",   required: true,  description: "Primary label for the toggle row." },
      { name: "description", type: "string",   required: false, description: "Secondary help text shown below the label." },
      { name: "checked",     type: "boolean",  required: false, description: "Controlled checked state." },
      { name: "disabled",    type: "boolean",  required: false, description: "Prevents interaction and mutes the appearance." },
      { name: "onChange",    type: "(checked: boolean) => void", required: false, description: "Called when the toggle is switched." },
    ],
    usage: `<ToggleRow
  label="I don't know the worker's personal details yet"
  description="Get a cost estimate without providing worker details"
  onChange={setSkipDetails}
/>`,
  },
  {
    name: "SectionCard",
    domain: "Forms",
    tier: "molecule",
    description:
      "White rounded card that wraps a group of related form fields. Renders a bold section title at the top with an optional leading icon, optional status badges inline after the title, an optional description line, an optional action button slot (e.g. 'Add Pension'), and an optional ⓘ icon button for contextual help. Used for 'Team information', 'Employee personal details', 'Fixed allowances', benefits cards, etc.",
    composedOf: ["StatusBadge"],
    props: [
      { name: "title",          type: "string",    required: true,  description: "Bold section heading shown at the top of the card." },
      { name: "description",    type: "string",    required: false, description: "Muted helper text rendered below the title, describing the section's purpose." },
      { name: "icon",           type: "ReactNode", required: false, description: "Icon rendered to the left of the title. Pass any SVG or icon component." },
      { name: "iconSize",       type: "number",    required: false, description: "Width and height of the icon container in px (default: 32)." },
      { name: "badges",         type: "ReactNode", required: false, description: "One or more badges rendered inline after the title — typically <StatusBadge /> elements." },
      { name: "action",         type: "ReactNode", required: false, description: "Element rendered in the top-right corner of the header — typically a small action button (e.g. Add, Create)." },
      { name: "showInfoButton", type: "boolean",   required: false, description: "When true, renders the ⓘ icon button on the right side of the title header." },
      { name: "onInfoClick",    type: "() => void", required: false, description: "Called when the ⓘ button is clicked. Also enables the button if showInfoButton is not set." },
      { name: "children",       type: "ReactNode", required: false, description: "Form fields or any content rendered inside the card body." },
    ],
    usage: `// With icon + badge + primary action (e.g. benefits card)
<SectionCard
  title="Pension"
  icon={<PensionIcon />}
  badges={<StatusBadge variant="mandatory" />}
  action={<PrimaryButton size="sm" label="Add Pension" onClick={onAdd} />}
  description="Comprehensive savings and pension plan for working employees."
/>

// Secondary action (default for header actions)
<SectionCard
  title="Fixed allowances"
  description="Allowances written into the EOR contract, granted on a one-time or recurring basis."
  action={<SecondaryButton size="sm" label="Add" onClick={onAdd} />}
/>

// Link / text action
<SectionCard title="Pay schedule" action={<TextButton label="Create new schedule ↗" onClick={onOpen} />} />`,
  },
  {
    name: "SegmentedControl",
    domain: "Forms",
    tier: "atom",
    description:
      "Adjacent pill-buttons for selecting one option from a small, mutually exclusive set. Used for Annual/Hourly salary period, Annual/Monthly market-rate view, and any binary or ternary toggle that lives inline with a heading. Supports controlled and uncontrolled modes, a small size variant, full-width stretch, and disabled state.",
    composedOf: [],
    props: [
      { name: "options",   type: "{ value: string; label: string }[]", required: true,  description: "Two or more option objects." },
      { name: "value",        type: "string",    required: false, description: "Controlled selected value. Pair with onChange." },
      { name: "defaultValue", type: "string",    required: false, description: "Initial value for uncontrolled mode (defaults to first option)." },
      { name: "onChange",     type: "(value: string) => void", required: false, description: "Called when the active segment changes." },
      { name: "size",      type: "'sm' | 'md'", required: false, description: "'sm' shrinks padding for inline use next to headings (default: 'md')." },
      { name: "fullWidth", type: "boolean",   required: false, description: "Stretches the control to fill its container width." },
      { name: "disabled",  type: "boolean",   required: false, description: "Prevents interaction on all segments." },
    ],
    usage: `<SegmentedControl
  options={[{ value: "annual", label: "Annual" }, { value: "hourly", label: "Hourly" }]}
  value={period}
  onChange={setPeriod}
/>`,
  },
  {
    name: "FormFieldGroup",
    domain: "Forms",
    tier: "molecule",
    description:
      "Groups a section heading, optional description, and a responsive grid of TextInput / DropdownSelect atoms. The workhorse of every EOR form section. Supports 1, 2, or 3-column layouts.",
    composedOf: ["TextInput", "DropdownSelect"],
    props: [
      { name: "title",       type: "string",    required: false, description: "Optional section heading above the fields." },
      { name: "description", type: "string",    required: false, description: "Optional helper text below the title." },
      { name: "fields",      type: "Field[]",   required: true,  description: "Array of field config objects. Each has: type ('text' | 'select'), label, placeholder, value, required, disabled, error, helperText, options (for select), optional (for select)." },
      { name: "columns",     type: "1 | 2 | 3", required: false, description: "Grid column count (default: 1)." },
    ],
    usage: `<FormFieldGroup
  title="Workplace information"
  columns={2}
  fields={[
    { type: "text",   label: "Worker ID",  required: true },
    { type: "select", label: "Department", optional: true, options: [{ value: "eng", label: "Engineering" }] },
  ]}
/>`,
  },

  {
    name: "DateInput",
    domain: "Forms",
    tier: "atom",
    description:
      "Date field with a × clear button and a calendar icon that opens the native date picker. Shows MM/DD/YYYY placeholder when empty. Shares the same label, error, helper-text, required, and disabled API as TextInput.",
    composedOf: [],
    props: [
      { name: "label",       type: "string",   required: false, description: "Label displayed above the input." },
      { name: "placeholder", type: "string",   required: false, description: "Placeholder shown when empty (default: 'MM/DD/YYYY')." },
      { name: "value",       type: "string",   required: false, description: "Controlled ISO date value (YYYY-MM-DD)." },
      { name: "required",    type: "boolean",  required: false, description: "Appends a red * to the label." },
      { name: "disabled",    type: "boolean",  required: false, description: "Prevents interaction; mutes appearance." },
      { name: "error",       type: "boolean",  required: false, description: "Red border + error background tint." },
      { name: "helperText",  type: "string",   required: false, description: "Hint or error message shown below the input." },
      { name: "onChange",    type: "(value: string) => void", required: false, description: "Called with the ISO date string on change." },
    ],
    usage: '<DateInput label="Agreement start date (MM/DD/YYYY)" required />',
  },
  {
    name: "Icon",
    domain: "Forms",
    tier: "atom",
    description:
      "SVG icon atom. Renders any named icon from the design system at a configurable size. Uses currentColor for stroke — tint by setting the color prop or the CSS color of a parent element. Returns null for unknown names.",
    composedOf: [],
    props: [
      { name: "name",      type: "'chevron-down' | 'check' | 'plus' | 'refresh' | 'info' | 'warning' | 'x' | 'external-link' | 'save' | 'calendar' | 'star' | 'ai' | 'shield-plus' | 'award' | 'file-text' | 'plane' | 'building' | 'pie-chart' | 'fingerprint'", required: true,  description: "Icon identifier. See ICON_MAP for the full list." },
      { name: "size",      type: "number",  required: false, description: "Width and height in px (default: 16)." },
      { name: "color",     type: "string",  required: false, description: "Explicit stroke color. Falls back to currentColor if omitted." },
      { name: "style",     type: "CSSProperties", required: false, description: "Extra inline styles applied to the <svg> element." },
      { name: "className", type: "string",  required: false, description: "CSS class applied to the <svg> element." },
    ],
    usage: `<Icon name="plane" size={20} />
<Icon name="shield-plus" size={24} color="#EA580C" />
<Icon name="fingerprint" size={20} />`,
  },

  // ── Actions ────────────────────────────────────────────────────
  {
    name: "Buttons",
    domain: "Actions",
    tier: "atom",
    description:
      "Unified button component. Use the variant prop to choose the style: primary (filled CTA), secondary (outlined action), or text (ghost link). Primary and secondary also support loading and size.",
    composedOf: [],
    props: [
      { name: "variant",  type: "'primary' | 'secondary' | 'text'", required: false, description: "Visual style (default: 'primary')." },
      { name: "label",    type: "string",            required: true,  description: "Button label text." },
      { name: "disabled", type: "boolean",           required: false, description: "Prevents interaction." },
      { name: "loading",  type: "boolean",           required: false, description: "Shows spinner (primary and secondary only)." },
      { name: "size",     type: "'sm' | 'md' | 'lg'", required: false, description: "Height 30 / 36 / 42px (primary and secondary only, default: 'md')." },
      { name: "onClick",  type: "() => void",        required: false, description: "Click handler." },
    ],
    usage: '<Button variant="primary" label="Continue" />',
  },

  // ── Status & Feedback ──────────────────────────────────────────
  {
    name: "StatusBadge",
    domain: "Status & Feedback",
    tier: "atom",
    description:
      "Compact pill label. Four semantic variants: mandatory (orange) for required benefits, new (purple) for feature flags, completed (green) for stepper/done states, failed (red) for compliance failures.",
    composedOf: [],
    props: [
      { name: "variant", type: "'mandatory' | 'new' | 'completed' | 'failed'", required: true,  description: "Visual and semantic style." },
      { name: "label",   type: "string",  required: false, description: "Override the default text." },
      { name: "dot",     type: "boolean", required: false, description: "Show colour dot (default: true)." },
    ],
    usage: '<StatusBadge variant="mandatory" />\n<StatusBadge variant="completed" label="Job details" />',
  },
  {
    name: "EmptyStateRow",
    domain: "Status & Feedback",
    tier: "atom",
    description:
      "Muted bordered row used inside list containers to signal the absence of items — e.g. 'No bonus added yet', 'No fixed allowances yet', 'No variable compensation yet'. Pairs a ⓘ info icon with a configurable label in a low-hierarchy, non-intrusive style.",
    composedOf: [],
    props: [
      { name: "label", type: "string", required: false, description: "Empty state message (default: 'No items yet')." },
    ],
    usage: '<EmptyStateRow label="No fixed allowances yet" />',
  },
  {
    name: "AutosaveWidget",
    domain: "Status & Feedback",
    tier: "molecule",
    description:
      "Persistent right-rail card that communicates autosave state. Transitions between 'saving' (spinner + amber pulse) and 'saved' (green dot + timestamp). Always offers a destructive 'Delete draft' action.",
    composedOf: ["SecondaryButton"],
    props: [
      { name: "status",        type: "'saved' | 'saving'", required: false, description: "Controls dot colour and status text (default: 'saved')." },
      { name: "lastSaved",     type: "string",  required: false, description: "Human-readable timestamp e.g. '2 minutes ago'." },
      { name: "onDeleteDraft", type: "() => void", required: false, description: "Called when Delete draft is clicked." },
    ],
    usage: '<AutosaveWidget status="saved" lastSaved="3 minutes ago" onDeleteDraft={handleDelete} />',
  },
  {
    name: "ContextBanner",
    domain: "Status & Feedback",
    tier: "molecule",
    description:
      "Unified contextual banner covering five semantic use cases via the variant prop: 'guide' (dismissable country hiring-guide link with flag imagery), 'insight' (inline AI callout with mascot + bold 'Deel Insight:' prefix + text link), 'promo' (persistent upsell tile with imagery on the right + outlined button CTA), 'info' (non-dismissable inline note with ⓘ icon — used for field guidelines and reporting prompts), and 'warning' (amber ⚠️ alert for mandatory-benefit notices and compliance constraints). Replaces the separate HiringGuideBanner, InsightCallout, and PromoBanner components.",
    composedOf: ["TextButton"],
    props: [
      { name: "variant",     type: "'guide' | 'insight' | 'promo' | 'info' | 'warning'", required: false, description: "Semantic type — controls default styles, icon/media, CTA style, and dismissable behaviour." },
      { name: "layout",      type: "'inline' | 'stacked'", required: false, description: "Title layout. 'stacked' puts the title on its own line above the body; 'inline' runs title and body on the same line. Default: 'stacked' for info, 'inline' for all others." },
      { name: "title",       type: "string",   required: false, description: "Bold label. Auto: null for guide/info, 'Deel Insight:' for insight, 'Foreign Entity Setup' for promo. For info, renders as a block heading above the body." },
      { name: "body",        type: "string",   required: false, description: "Body copy. For guide variant the country prop auto-populates this." },
      { name: "country",     type: "string",   required: false, description: "Convenience for guide variant — inserts country name into default body copy." },
      { name: "media",       type: "string[]", required: false, description: "Emoji or flag array. Placed left for guide/insight, right for promo. Insight uses a built-in mascot SVG when null. Ignored for info." },
      { name: "ctaLabel",    type: "string",   required: false, description: "CTA text. Defaults: 'View' for guide, 'Learn more' for others. For info, omit to render no CTA." },
      { name: "ctaUrl",      type: "string",   required: false, description: "href for the CTA (default: '#')." },
      { name: "ctaStyle",    type: "'link' | 'button'", required: false, description: "CTA style. Default: 'button' for promo, 'link' for guide/insight/info." },
      { name: "onCtaClick",  type: "() => void", required: false, description: "Called when the CTA is clicked instead of opening ctaUrl. Use for in-page callbacks (e.g. report false positive)." },
      { name: "dismissable", type: "boolean",  required: false, description: "Show × dismiss button. Default: true for guide, false for insight/promo/info." },
      { name: "onDismiss",   type: "() => void", required: false, description: "Called when × is clicked." },
    ],
    usage: `<ContextBanner variant="guide" country="Germany" onDismiss={handleDismiss} />
<ContextBanner variant="insight" body="Severance in the US ranges from 0–26 weeks." />
<ContextBanner variant="promo" title="Foreign Entity Setup" />
<ContextBanner variant="info" title="Job scope guidelines" body='Always refer to your company as "the company".' ctaLabel="Learn more" ctaUrl="#" />
<ContextBanner variant="warning" body="Healthcare is a mandatory benefit for United States" />`,
  },

  // ── Navigation ────────────────────────────────────────────────
  {
    name: "StepperRail",
    domain: "Navigation",
    tier: "molecule",
    description:
      "Vertical progress indicator used in the right-rail of every multi-step EOR flow. Three step states: done (filled circle + check), active (outlined + ring), future (greyed). Completed steps are clickable to navigate back.",
    composedOf: [],
    props: [
      { name: "steps",       type: "{ label: string }[]", required: true,  description: "One object per step, in order." },
      { name: "currentStep", type: "number",   required: false, description: "1-indexed active step (default: 1)." },
      { name: "onStepClick", type: "(stepNumber: number) => void", required: false, description: "Fired when a completed step is clicked." },
    ],
    usage: `<StepperRail
  steps={[
    { label: "Personal details" },
    { label: "Job details" },
    { label: "Compensation and dates" },
    { label: "Benefits and extras" },
  ]}
  currentStep={2}
  onStepClick={goToStep}
/>`,
  },

  // ── Compliance ────────────────────────────────────────────────
  {
    name: "ComplianceCheckCard",
    domain: "Compliance",
    tier: "ai-molecule",
    description:
      "Atomic result row for a single compliance rule. Rule text on the left, coloured status badge on the right. Four states: checking (spinner), pass (green), warn (amber), fail (red). Optionally shows an AI-generated detail sentence.",
    composedOf: [],
    props: [
      { name: "rule",   type: "string",                            required: true,  description: "The compliance rule being evaluated." },
      { name: "status", type: "'checking' | 'pass' | 'warn' | 'fail'", required: true, description: "Controls card tint, badge colour, and icon." },
      { name: "detail", type: "string",                            required: false, description: "Optional AI-generated explanation shown below the rule." },
    ],
    usage: `<ComplianceCheckCard
  rule="Job scope should be relevant to the job title."
  status="fail"
  detail="The described duties relate to customer success, not executive assistance."
/>`,
  },
  {
    name: "ComplianceCheckPanel",
    domain: "Compliance",
    tier: "ai-molecule",
    description:
      "Full AI compliance widget: purple run-check banner, list of ComplianceCheckCards that stream in as results arrive, and a false-positive report link. isRunning shows shimmer placeholders. Results can arrive incrementally for a streaming UX.",
    composedOf: ["ComplianceCheckCard", "SecondaryButton", "TextButton"],
    props: [
      { name: "results",    type: "{ rule: string; status: string; detail?: string }[]", required: false, description: "Can be empty (pre-run state)." },
      { name: "isRunning",  type: "boolean",  required: false, description: "Shows shimmer rows, disables Run check button." },
      { name: "onRunCheck", type: "() => void", required: false, description: "Called when Run check is clicked." },
      { name: "onReport",   type: "() => void", required: false, description: "Called when the false-positive report link is clicked." },
    ],
    usage: `<ComplianceCheckPanel
  results={complianceResults}
  isRunning={isRunning}
  onRunCheck={runAICheck}
  onReport={reportFalsePositive}
/>`,
  },

  // ── Country Standards ─────────────────────────────────────────
  {
    name: "CountryPolicyCard",
    domain: "Compliance",
    tier: "molecule",
    description:
      "Compact card displaying a statutory country policy. Renders a circular flag + policy title in a tinted header, a horizontal divider, and one or more label/value rows for the policy details (e.g. work hours range, sick leave days, notice period). Supports a dimmed state to indicate an inactive or not-applicable policy.",
    composedOf: [],
    props: [
      { name: "flag",   type: "'none' | '🇺🇸' | '🇬🇧' | '🇩🇪' | '🇫🇷' | '🇨🇦' | '🇦🇺' | '🇧🇷' | '🇮🇳' | '🇳🇱' | '🇸🇬' | '🇯🇵' | '🇪🇸' | '🇮🇹' | '🇵🇹' | '🇲🇽'", required: true, description: "Country flag emoji shown in the header. Pass 'none' to hide the flag." },
      { name: "title",  type: "string",                            required: true,  description: "Policy name shown in the header (e.g. 'Standard notice period in United States')." },
      { name: "rows",   type: "{ label: string; value: string }[]", required: true, description: "Key–value pairs for the policy details rendered below the divider." },
      { name: "dimmed", type: "boolean",                           required: false, description: "Mutes the header flag and title to indicate an inactive or not-applicable policy." },
    ],
    usage: `<CountryPolicyCard
  flag="🇺🇸"
  title="Standard notice period in United States"
  rows={[
    { label: "During probation", value: "No notice period" },
    { label: "After probation",  value: "No notice period" },
  ]}
/>`,
  },

  // ── Market Intelligence ───────────────────────────────────────
  {
    name: "MarketRateChart",
    domain: "Market Intelligence",
    tier: "ai-molecule",
    description:
      "Salary benchmarking histogram. Bars show the market distribution for a job title + seniority + country. The active bar is highlighted with a floating bubble at the current salary. Annual / Monthly toggle rescales all values. Bars animate in on mount and on period change.",
    composedOf: [],
    props: [
      { name: "salary",    type: "number",             required: true,  description: "Gross annual salary — positions the bubble." },
      { name: "period",    type: "'annual' | 'monthly'", required: false, description: "Initial period shown (default: 'annual')." },
      { name: "country",   type: "string",             required: false, description: "Country for the market data label." },
      { name: "seniority", type: "string",             required: false, description: "Seniority tier in the chart title." },
      { name: "jobTitle",  type: "string",             required: false, description: "Job title in the chart title." },
    ],
    usage: '<MarketRateChart salary={77293.01} period="annual" country="United States" seniority="Mid" jobTitle="Executive Assistant" />',
  },

  // ── Blocks ────────────────────────────────────────────────────
  {
    name: "JobDescriptionBlock",
    domain: "Blocks",
    tier: "block",
    description:
      "Full job description section: job title select, seniority select, scope guidelines info box, scope template select, scope textarea with character counter, and the AI compliance panel. Run check streams results card-by-card. Drop directly into step 2 of the EOR flow.",
    composedOf: ["DropdownSelect", "TextInput", "ComplianceCheckPanel", "ComplianceCheckCard", "SecondaryButton"],
    props: [
      { name: "defaultTitle",          type: "string",  required: false, description: "Pre-filled job title value." },
      { name: "defaultSeniority",      type: "string",  required: false, description: "Pre-filled seniority key." },
      { name: "defaultScope",          type: "string",  required: false, description: "Pre-filled scope text." },
      { name: "showComplianceResults", type: "boolean", required: false, description: "Render compliance cards immediately (e.g. when returning to a step)." },
      { name: "complianceRunning",     type: "boolean", required: false, description: "Start in the running/shimmer state." },
      { name: "onSave",                type: "(state: { title: string; seniority: string; scope: string }) => void", required: false, description: "Called on Save scope click." },
      { name: "onReport",              type: "() => void",                                                           required: false, description: "Called when the false-positive report link inside ComplianceCheckPanel is clicked." },
    ],
    usage: `<JobDescriptionBlock
  defaultTitle="Executive Assistant"
  defaultSeniority="mid"
  defaultScope=""
  onSave={handleSave}
/>`,
  },
  {
    name: "CompensationBlock",
    domain: "Blocks",
    tier: "block",
    description:
      "Complete compensation block rendered as a vertical stack of ten SectionCards: (1) Employment type — Full-time / Part-time radio; (2) Compensation — Annual/Hourly toggle, salary input with $ prefix and USD suffix, live market-rate histogram with bubble, and signing/retention bonus empty state; (3) Work schedule — country policy card, work hours input, schedules dropdown; (4) Fixed allowances — Add button, empty state; (5) Variable compensation — Add button, empty state; (6) Employment terms — Indefinite / Definite radio, conditional contract-end DateInput with duration helper; (7) Desired start date — regulatory ContextBanner, agreement start DateInput; (8) Time off — description, Learn-more link, Minimum / Specific radio, conditional paid-vacation TextInput; (9) Sick leave — info ContextBanner, country policy card; (10) Notice period — info ContextBanner, disabled Standard / Custom radio, country policy card.",
    composedOf: [
      "SectionCard", "RadioOption", "TextInput", "DateInput", "DropdownSelect",
      "SecondaryButton", "TextButton", "ContextBanner", "CountryPolicyCard", "EmptyStateRow",
    ],
    props: [
      { name: "defaultSalary",           type: "number",  required: false, description: "Starting gross annual salary (default: 77293.01)." },
      { name: "defaultEmploymentType",   type: "string",  required: false, description: "'full' | 'part' (default: 'full')." },
      { name: "defaultPeriod",           type: "string",  required: false, description: "'annual' | 'hourly' (default: 'annual')." },
      { name: "showMarketInsights",      type: "boolean", required: false, description: "Show/hide the market rate chart (default: true)." },
      { name: "country",                 type: "string",  required: false, description: "Country name used across section copy (default: 'United States')." },
      { name: "defaultEmploymentTerms",  type: "string",  required: false, description: "'indefinite' | 'definite' (default: 'indefinite')." },
      { name: "defaultContractEndDate",  type: "string",  required: false, description: "ISO date string for the contract end date (default: '')." },
      { name: "defaultStartDate",        type: "string",  required: false, description: "ISO date string for the agreement start date (default: '')." },
      { name: "defaultTimeOff",          type: "string",  required: false, description: "'minimum' | 'specific' (default: 'minimum')." },
      { name: "defaultWorkHours",        type: "string",  required: false, description: "Work hours per week value shown in the Work schedule input (default: '40')." },
      { name: "onSalaryChange",          type: "(value: number, period: string) => void", required: false, description: "Called when salary or period changes." },
    ],
    usage: `<CompensationBlock
  defaultSalary={47062.51}
  defaultEmploymentType="full"
  country="United States"
/>`,
  },
  {
    name: "BenefitsBlock",
    domain: "Blocks",
    tier: "block",
    description:
      "Country-aware benefits section split into mandatory (Healthcare, Pension, Life Insurance) and optional extras (Travel Insurance, Coworking). Mandatory benefits show a warning banner until added. All cards are independently togglable.",
    composedOf: ["StatusBadge", "PrimaryButton", "SecondaryButton"],
    props: [
      { name: "country",      type: "string",   required: false, description: "Country name in the subtitle and mandatory banners (default: 'United States')." },
      { name: "benefits",     type: "Benefit[]",required: false, description: "Override the default benefit list — useful for non-US countries." },
      { name: "onAddBenefit", type: "(benefitId: string) => void", required: false, description: "Called when a benefit is added." },
    ],
    usage: '<BenefitsBlock country="Germany" onAddBenefit={handleBenefitAdd} />',
  },

  // ── Blocks (continued) ──────────────────────────────────────────
  {
    name: "AddPersonBlock",
    domain: "Blocks",
    tier: "block",
    description:
      "First-step 'Add person' form for EOR contract creation. Six SectionCards: Team information (entity + group), Employee personal details (toggle + email + name + citizenship + country + insight banner + state), Workplace information (job position + manager + report + worker ID + external ID), Organizational structure (department + teams), and Hiring objective (objective dropdown + promo banner). The personal-details card collapses when the 'I don't know…' toggle is enabled.",
    composedOf: ["SectionCard", "DropdownSelect", "TextInput", "ToggleRow", "ContextBanner"],
    props: [
      { name: "defaultEntity",    type: "string",  required: false, description: "Pre-selected entity value (default: 'AU entity - Payroll Connect')." },
      { name: "defaultGroup",     type: "string",  required: false, description: "Pre-selected group value (default: 'AU - Payroll Connect - group')." },
      { name: "defaultCountry",   type: "string",  required: false, description: "Pre-selected employment country option value (default: 'us')." },
      { name: "defaultState",     type: "string",  required: false, description: "Pre-selected state dropdown value." },
      { name: "workerIdValue",    type: "string",  required: false, description: "Read-only worker ID shown in Workplace information (default: '260')." },
      { name: "onSave",           type: "(data: object) => void", required: false, description: "Called with the form state when the user completes the section." },
    ],
    usage: `<AddPersonBlock
  defaultCountry="us"
  defaultState="mo"
  workerIdValue="260"
/>`,
  },

  // ── Flows ─────────────────────────────────────────────────────
  {
    name: "EORContractCreationFlow",
    domain: "Flows",
    tier: "flow",
    description:
      "Complete 4-step EOR contract creation orchestration: (1) Add person, (2) Job description with AI compliance, (3) Compensation with market insights, (4) Benefits. Wires together all Blocks, StepperRail, and AutosaveWidget into one navigable flow with an optional header and right-side rail.",
    composedOf: [
      "AddPersonBlock", "JobDescriptionBlock", "CompensationBlock", "BenefitsBlock",
      "StepperRail", "AutosaveWidget",
      "PrimaryButton", "SecondaryButton",
    ],
    props: [
      { name: "initialStep",    type: "number",  required: false, description: "Step to start on (1–4, default: 1)." },
      { name: "workerName",     type: "string",  required: false, description: "Pre-filled worker name." },
      { name: "country",        type: "string",  required: false, description: "Hiring country — drives benefit mandates." },
      { name: "showHeader",     type: "boolean", required: false, description: "Show or hide the top header bar (default: true)." },
      { name: "headerTitle",    type: "string",  required: false, description: "Title displayed in the header (default: \"Create new EOR contract\")." },
      { name: "headerSubtitle", type: "string",  required: false, description: "Subtitle displayed in the header (default: \"Full-time · {country}\")." },
      { name: "onComplete",     type: "(contractData: object) => void", required: false, description: "Called when the final step is submitted." },
      { name: "onStepChange",   type: "(step: number) => void", required: false, description: "Called on every step navigation." },
    ],
    usage: `<EORContractCreationFlow
  country="United States"
  showHeader={true}
  headerTitle="Create new EOR contract"
  headerSubtitle="Full-time · United States"
  onComplete={handleContractSubmit}
  onStepChange={trackStep}
/>`,
  },
];

// ═══════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════

/** Light-mode design tokens shared across every component. */
export const lightTokens = {
  bg:            "#FAFAFA",
  surface:       "#FFFFFF",
  surfaceHover:  "#F4F4F5",
  border:        "#E4E4E7",
  borderFocus:   "#18181B",
  primary:       "#18181B",
  primaryHover:  "#27272A",
  btnText:       "#FFFFFF",
  textMain:      "#18181B",
  textMuted:     "#71717A",
  textDisabled:  "#A1A1AA",
  error:         "#EF4444",
  errorBg:       "#FEF2F2",
  errorBorder:   "#FECACA",
  success:       "#16A34A",
  successBg:     "#F0FDF4",
  successBorder: "#BBF7D0",
  warning:       "#D97706",
  warningBg:     "#FFFBEB",
  warningBorder: "#FDE68A",
  mandatory:     "#EA580C",
  mandatoryBg:   "#FFF7ED",
  purple:        "#7C3AED",
  purpleBg:      "#F5F3FF",
  info:          "#2563EB",
  infoBg:        "#EFF6FF",
  inputBg:       "#FFFFFF",
  rowHover:      "#FAFAFA",
  chartBar:      "#CACACE",
  chartBarActive:"#18181B",
  chartBarHover: "#D4D4D8",
  shadow:        "0 1px 2px rgba(0,0,0,0.05)",
  shadowMd:      "0 4px 12px rgba(0,0,0,0.08)",
  shadowLg:      "0 8px 24px rgba(0,0,0,0.10)",
  ring:          "rgba(24,24,27,0.08)",
};

/** Dark-mode design tokens — same keys as lightTokens. */
export const darkTokens = {
  bg:            "#09090B",
  surface:       "#18181B",
  surfaceHover:  "#27272A",
  border:        "#3F3F46",
  borderFocus:   "#FAFAFA",
  primary:       "#FAFAFA",
  primaryHover:  "#E4E4E7",
  btnText:       "#09090B",
  textMain:      "#FAFAFA",
  textMuted:     "#A1A1AA",
  textDisabled:  "#52525B",
  error:         "#F87171",
  errorBg:       "#2A1515",
  errorBorder:   "#7F1D1D",
  success:       "#4ADE80",
  successBg:     "#0D2818",
  successBorder: "#14532D",
  warning:       "#FCD34D",
  warningBg:     "#1C1500",
  warningBorder: "#713F12",
  mandatory:     "#FB923C",
  mandatoryBg:   "#271100",
  purple:        "#A78BFA",
  purpleBg:      "#1E1033",
  info:          "#60A5FA",
  infoBg:        "#0C1A2E",
  inputBg:       "#27272A",
  rowHover:      "#1F1F23",
  chartBar:      "#3F3F46",
  chartBarActive:"#FAFAFA",
  chartBarHover: "#52525B",
  shadow:        "0 1px 3px rgba(0,0,0,0.4)",
  shadowMd:      "0 6px 20px rgba(0,0,0,0.5)",
  shadowLg:      "0 12px 32px rgba(0,0,0,0.6)",
  ring:          "rgba(250,250,250,0.10)",
};

// ═══════════════════════════════════════════════════════════════════
// APPEARANCE  API
// Partners pass an `appearance` object when mounting any component to
// match their product's brand without touching token internals.
//
// Usage:
//   const handler = window.DeelComponent.create({
//     link: componentLink,
//     appearance: {
//       primaryColor: '#0070F3',
//       fontFamily:   'Inter',
//       monospaceFontFamily: 'JetBrains Mono',
//       borderRadius: 10,
//       includeLogo: true,
//       includeCloseButton: false,
//     },
//     onEvent: (event, data) => { ... },
//   });
// ═══════════════════════════════════════════════════════════════════

// ─── Colour utility helpers (used by applyAppearance) ───────────────────────

function _hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6;               break;
      case b: h = ((r - g) / d + 4) / 6;               break;
    }
  }
  return [h, s, l];
}

function _hslToHex(h, s, l) {
  const toRgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = toRgb(p, q, h + 1/3);
    g = toRgb(p, q, h);
    b = toRgb(p, q, h - 1/3);
  }
  const toH = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toH(r)}${toH(g)}${toH(b)}`;
}

/** Ensure a custom border colour stays subtle in the given mode.
 *  Borders need the opposite logic to primary: high lightness in light mode
 *  (where they sit on white surfaces) and low lightness in dark mode
 *  (where they sit on near-black surfaces).
 *
 *  Calibrated against the theme defaults:
 *    light default border ≈ L 0.90  (#E4E4E7)
 *    dark  default border ≈ L 0.24  (#3F3F46)
 */
function _adjustBorderForMode(hex, isDark) {
  if (!hex || hex.length < 7) return hex;
  const [h, s, l] = _hexToHsl(hex);
  // Dark mode:  cap lightness at 0.35 so the border stays dark on near-black surfaces
  // Light mode: floor lightness at 0.87 so the border stays light on near-white surfaces
  const adjusted = isDark ? Math.min(l, 0.35) : Math.max(l, 0.87);
  return _hslToHex(h, s, adjusted);
}

/** Ensure a custom primary colour is legible in the given mode. */
function _adjustPrimaryForMode(hex, isDark) {
  if (!hex || hex.length < 7) return hex;
  const [h, s, l] = _hexToHsl(hex);
  // Dark mode: lift lightness so colour stays vibrant against near-black bg
  // Light mode: cap lightness so colour stays visible against near-white bg
  const adjusted = isDark ? Math.max(l, 0.56) : Math.min(l, 0.52);
  return _hslToHex(h, Math.max(s, 0.15), adjusted);
}

/** Pick white or near-black text for maximum contrast on a given bg colour. */
function _contrastText(hex) {
  if (!hex || hex.length < 7) return "#FFFFFF";
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  // sRGB relative luminance
  const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.22 ? "#09090B" : "#FFFFFF";
}

/** Derive a hover shade (slightly darker in light mode, lighter in dark mode). */
function _hoverShade(hex, isDark) {
  if (!hex || hex.length < 7) return hex;
  const [h, s, l] = _hexToHsl(hex);
  const shift = isDark ? Math.min(1, l + 0.09) : Math.max(0, l - 0.07);
  return _hslToHex(h, s, shift);
}

/** Convert hex to rgba with given alpha for focus rings. */
function _hexToRgba(hex, alpha) {
  if (!hex || hex.length < 7) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * All supported appearance customisation keys and their defaults.
 * Pass a subset of these to applyAppearance() to override only what you need.
 */
export const APPEARANCE_DEFAULTS = {
  /** Primary action colour — buttons, focus rings, active chart bars.
   *  Leave empty ("") to respect each theme's built-in primary token. */
  primaryColor: "",
  /** Border colour used on inputs, cards, and secondary buttons.
   *  Leave empty ("") to respect each theme's built-in border token. */
  borderColor: "",
  /** Main body font family. Accepts any web-safe font or Google Fonts name. */
  fontFamily: "Inter",
  /** Monospace font family — used for IDs, code snippets, and numeric fields. */
  monospaceFontFamily: "JetBrains Mono",
  /** Global corner radius in px applied to cards, inputs, and buttons. */
  borderRadius: 8,
  /** Show the Deel logo inside the embedded component. */
  includeLogo: true,
  /** Show the × dismiss button when the component is mounted as a modal. */
  includeCloseButton: true,
  /** Relative font scale multiplier applied to all text in the component.
   *  1 = default sizes, 0.875 = smaller, 1.125 = larger. Range 0.75–1.5. */
  fontScale: 1,
  /** Relative spacing scale multiplier applied to all gap and padding values.
   *  1 = default spacing, 0.75 = tighter, 1.5 = more spacious. Range 0.5–2. */
  spacingScale: 1,
};

/**
 * Merge an `appearance` override object into a full token set.
 * Only the semantic keys declared in APPEARANCE_DEFAULTS are mapped —
 * all remaining token values are preserved unchanged, keeping light/dark
 * mode intact.
 *
 * @param {object} baseTokens   - lightTokens or darkTokens
 * @param {Partial<typeof APPEARANCE_DEFAULTS>} [appearance]
 * @param {boolean} [isDark]    - Pass true when using darkTokens so the primary
 *                                colour is auto-lifted and btnText is computed
 *                                for correct contrast.
 * @returns {object} merged token object suitable for makeLibraryCSS()
 */
export function applyAppearance(baseTokens, appearance = {}, isDark = false) {
  const t = { ...baseTokens };
  if (appearance.primaryColor) {
    const adjusted   = _adjustPrimaryForMode(appearance.primaryColor, isDark);
    const hoverColor = _hoverShade(adjusted, isDark);
    t.primary        = adjusted;
    t.primaryHover   = hoverColor;
    t.borderFocus    = adjusted;
    t.chartBarActive = adjusted;
    t.btnText        = _contrastText(adjusted);
    t.ring           = _hexToRgba(adjusted, 0.18);
  }
  if (appearance.borderColor)           t.border = _adjustBorderForMode(appearance.borderColor, isDark);
  if (appearance.fontFamily)            t._fontFamily = appearance.fontFamily;
  if (appearance.monospaceFontFamily)   t._monoFont   = appearance.monospaceFontFamily;
  if (appearance.borderRadius !== undefined)   t._borderRadius   = appearance.borderRadius;
  if (appearance.fontScale !== undefined)      t._fontScale      = appearance.fontScale;
  if (appearance.spacingScale !== undefined)   t._spacingScale   = appearance.spacingScale;
  return t;
}

// ═══════════════════════════════════════════════════════════════════
// CSS FACTORY
// Call makeLibraryCSS(tokens, isDark) and inject the result via
// <style dangerouslySetInnerHTML={{ __html: ... }} />
// ═══════════════════════════════════════════════════════════════════
// Google Fonts slug map — extend when adding new fonts to the appearance picker
const _GF_SLUGS = {
  "Inter":             "Inter:wght@300;400;500;600",
  "DM Sans":           "DM+Sans:wght@300;400;500;600",
  "Geist":             "Geist:wght@300;400;500;600",
  "Sora":              "Sora:wght@300;400;500;600",
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@300;400;500;600",
  "JetBrains Mono":    "JetBrains+Mono:wght@400;500",
};

export const makeLibraryCSS = (t, isDark) => {
  const br = t._borderRadius !== undefined ? t._borderRadius : 6;
  const fsc = t._fontScale ?? 1;
  const ssc = t._spacingScale ?? 1;
  const ff = t._fontFamily ? `'${t._fontFamily}', -apple-system, sans-serif` : "'Inter', -apple-system, sans-serif";
  const mf = t._monoFont ? `'${t._monoFont}', 'JetBrains Mono', monospace` : "'JetBrains Mono', monospace";
  const bodyFont = t._fontFamily || "Inter";
  const monoFont = t._monoFont  || "JetBrains Mono";
  const bodySlug = _GF_SLUGS[bodyFont] ?? `${bodyFont.replace(/ /g, "+")}:wght@300;400;500;600`;
  const monoSlug = _GF_SLUGS[monoFont] ?? `${monoFont.replace(/ /g, "+")}:wght@400;500`;
  const fontFamilies = bodyFont === monoFont
    ? `family=${bodySlug}`
    : `family=${bodySlug}&family=${monoSlug}`;
  const css = `
  @import url('https://fonts.googleapis.com/css2?${fontFamilies}&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: ${ff}; -webkit-font-smoothing: antialiased; }

  /* ── TextInput ── */
  .fi { display: flex; flex-direction: column; gap: 4px; }
  .fl { font-family: ${ff}; font-size: 12px; font-weight: 500; color: ${t.textMain}; }
  .fl .req { color: ${t.error}; margin-left: 1px; }
  .fi input, .fi textarea {
    width: 100%; padding: 0 11px;
    font-family: ${ff}; font-size: 13.5px; color: ${t.textMain};
    background: ${t.inputBg}; border: 1px solid ${t.border};
    border-radius: ${br}px; outline: none; appearance: none;
    transition: border-color .12s, box-shadow .12s;
  }
  .fi input { height: 36px; }
  .fi textarea { padding: 10px 11px; resize: vertical; min-height: 140px; line-height: 1.55; }
  .fi input::placeholder, .fi textarea::placeholder { color: ${t.textDisabled}; }
  .fi input:focus, .fi textarea:focus { border-color: ${t.borderFocus}; box-shadow: 0 0 0 3px ${t.ring}; }
  .fi input:disabled, .fi textarea:disabled { background: ${t.surfaceHover}; color: ${t.textDisabled}; cursor: not-allowed; }
  .fi input.err { border-color: ${t.error}; background: ${t.errorBg}; }
  .fhint { font-size: 11.5px; color: ${t.textMuted}; margin-top: 1px; }
  .fhint.err { color: ${t.error}; }

  /* ── TextInput adornments (prefix / suffix) ── */
  .fi-adorn {
    display: flex; align-items: stretch;
    border: 1px solid ${t.border}; border-radius: ${br}px;
    overflow: hidden; background: ${t.inputBg};
    transition: border-color .12s, box-shadow .12s;
  }
  .fi-adorn:focus-within { border-color: ${t.borderFocus}; box-shadow: 0 0 0 3px ${t.ring}; }
  .fi-adorn.err { border-color: ${t.error}; background: ${t.errorBg}; }
  .fi-adorn.disabled { background: ${t.surfaceHover}; }
  .fi-adorn input {
    border: none; box-shadow: none; background: transparent;
    border-radius: 0; flex: 1; min-width: 0;
  }
  .fi-adorn input:focus { border-color: transparent; box-shadow: none; }
  .fi-adorn input:disabled { background: transparent; }
  .fi-pre, .fi-suf {
    display: flex; align-items: center; flex-shrink: 0;
    padding: 0 10px; font-size: 13.5px; font-family: ${ff};
    color: ${t.textMuted}; background: ${t.surfaceHover};
    white-space: nowrap; user-select: none;
  }
  .fi-pre { border-right: 1px solid ${t.border}; }
  .fi-suf { border-left: 1px solid ${t.border}; }
  .fi-adorn.err .fi-pre, .fi-adorn.err .fi-suf { border-color: ${t.errorBorder}; }

  /* ── DropdownSelect ── */
  .selw { position: relative; }
  .selw select {
    height: 36px; width: 100%; padding: 0 34px 0 11px;
    font-family: ${ff}; font-size: 13.5px;
    background: ${t.inputBg}; border: 1px solid ${t.border};
    border-radius: ${br}px; outline: none; appearance: none; cursor: pointer; color: ${t.textMain};
    transition: border-color .12s, box-shadow .12s;
  }
  .selw select.ph { color: ${t.textDisabled}; }
  .selw select:focus { border-color: ${t.borderFocus}; box-shadow: 0 0 0 3px ${t.ring}; }
  .selw select:disabled { background: ${t.surfaceHover}; color: ${t.textDisabled}; cursor: not-allowed; }
  .chev { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: ${t.textMuted}; }

  /* ── RadioOption ── */
  .rrow {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 13px; border: 1px solid ${t.border}; border-radius: ${br + 2}px;
    cursor: pointer; user-select: none; width: 100%;
    background: ${t.surface}; transition: border-color .1s, background .1s;
    font-family: ${ff}; appearance: none; text-align: left;
  }
  .rrow:hover:not(:disabled) { border-color: ${t.textMuted}; }
  .rrow.on { border-color: ${t.primary}; background: ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)"}; }
  .rrow:disabled { opacity: .42; cursor: not-allowed; }
  .rcirc {
    width: 15px; height: 15px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid ${t.border};
    display: flex; align-items: center; justify-content: center;
    transition: border-color .1s;
  }
  .rrow.on .rcirc { border-color: ${t.primary}; }
  .rdot { width: 7px; height: 7px; border-radius: 50%; background: ${t.primary}; }
  .rlbl { font-size: 13.5px; color: ${t.textMain}; }
  .rsub { font-size: 11.5px; color: ${t.textMuted}; margin-top: 1px; }
  .rstack { display: flex; flex-direction: column; gap: 6px; width: 100%; }

  /* ── ToggleRow ── */
  .trow {
    display: flex; align-items: center; justify-content: space-between; gap: 14px;
    padding: 12px 14px; border: 1px solid ${t.border}; border-radius: ${br + 2}px;
    background: ${t.surface}; cursor: pointer; user-select: none;
  }
  .trow:hover:not(.trow-disabled) { border-color: ${t.textMuted}; }
  .trow-disabled { opacity: .45; cursor: not-allowed; }
  .trow-text { flex: 1; min-width: 0; }
  .trow-label { font-size: 13.5px; font-weight: 500; color: ${t.textMain}; line-height: 1.4; }
  .trow-desc  { font-size: 12px; color: ${t.textMuted}; margin-top: 2px; line-height: 1.4; }
  .trow-track {
    width: 36px; height: 20px; border-radius: 999px; flex-shrink: 0;
    position: relative; transition: background .18s;
  }
  .trow-track.on  { background: ${t.primary}; }
  .trow-track.off { background: ${t.border}; }
  .trow-thumb {
    position: absolute; top: 2px; width: 16px; height: 16px;
    border-radius: 50%; background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: left .18s;
  }
  .trow-track.on  .trow-thumb { left: 18px; }
  .trow-track.off .trow-thumb { left: 2px; }

  /* ── SegmentedControl ── */
  .seg {
    display: inline-flex; align-items: center; position: relative;
    border: 1px solid ${t.border}; border-radius: ${br + 2}px;
    padding: 3px; background: ${t.surface}; gap: 2px;
  }
  .seg.full { display: flex; width: 100%; }
  .seg-pill {
    position: absolute; border-radius: ${br}px;
    background: ${t.primary}; pointer-events: none; z-index: 0;
  }
  .seg-pill-disabled { background: ${t.textDisabled}; }
  .seg-opt {
    position: relative; z-index: 1;
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 7px 16px; border-radius: ${br}px;
    font-family: ${ff}; font-size: 13px; font-weight: 500;
    cursor: pointer; border: none; white-space: nowrap;
    color: ${t.textMuted}; background: transparent;
    transition: color .15s;
  }
  .seg-opt.on { color: ${t.btnText}; }
  .seg-opt:hover:not(.on):not(:disabled) { background: ${t.surfaceHover}; color: ${t.textMain}; }
  .seg-opt:disabled { opacity: .4; cursor: not-allowed; }
  .seg.sm .seg-opt { padding: 5px 12px; font-size: 12px; }

  /* ── SectionCard ── */
  .sc { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: ${br + 6}px; padding: 20px 20px 24px; box-shadow: ${t.shadow}; display: flex; flex-direction: column; gap: 16px; }
  .sc-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .sc-header-left { display: flex; flex-direction: row; align-items: flex-start; gap: 12px; }
  .sc-header-icon { display: flex; align-items: flex-start; flex-shrink: 0; }
  .sc-header-text { display: flex; flex-direction: column; gap: 5px; }
  .sc-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .sc-title { font-size: 15px; font-weight: 600; color: ${t.textMain}; letter-spacing: -.01em; }
  .sc-desc { font-size: 13px; color: ${t.textMuted}; line-height: 1.5; margin: 0; max-width: 520px; }
  .sc-info-btn { display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: ${t.textMuted}; padding: 3px; border-radius: 5px; transition: color .12s, background .12s; flex-shrink: 0; }
  .sc-info-btn:hover { color: ${t.textMain}; background: ${t.surfaceHover}; }
  .sc-body { display: flex; flex-direction: column; gap: 20px; }
  .sc--has-footer { padding-bottom: 0; overflow: hidden; }
  .sc-footer { margin-top: -4px; }

  /* ── FormFieldGroup ── */
  .ffg { display: flex; flex-direction: column; gap: 14px; }
  .ffg-title { font-size: 13.5px; font-weight: 600; color: ${t.textMain}; margin-bottom: 2px; }
  .ffg-desc { font-size: 12px; color: ${t.textMuted}; line-height: 1.5; margin-bottom: 4px; }
  .ffg-row { display: grid; gap: 12px; }
  .ffg-row.cols-2 { grid-template-columns: 1fr 1fr; }
  .ffg-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }

  /* ── DateInput ── */
  .di-wrap {
    position: relative;
    border: 1px solid ${t.border}; border-radius: ${br}px;
    background: ${t.inputBg};
    transition: border-color .12s, box-shadow .12s;
  }
  .di-wrap:focus-within { border-color: ${t.borderFocus}; box-shadow: 0 0 0 3px ${t.ring}; }
  .di-wrap.err { border-color: ${t.error}; background: ${t.errorBg}; }
  .di-wrap.disabled { background: ${t.surfaceHover}; }
  .di-wrap .di-inp {
    width: 100%; height: 36px; padding: 0 62px 0 11px;
    font-family: ${ff}; font-size: 13.5px; color: ${t.textMain};
    background: transparent; border: none; border-radius: 0; outline: none; appearance: none; display: block;
    box-shadow: none;
  }
  .di-wrap .di-inp:focus { border-color: transparent; box-shadow: none; }
  .di-wrap .di-inp::-webkit-calendar-picker-indicator { display: none; }
  .di-wrap .di-inp:disabled { color: ${t.textDisabled}; cursor: not-allowed; }
  .di-wrap .di-inp.ph::-webkit-datetime-edit { color: ${t.textDisabled}; }
  .di-wrap .di-inp.ph::-webkit-datetime-edit-text { color: ${t.textDisabled}; }
  .di-actions {
    position: absolute; right: 0; top: 0; bottom: 0;
    display: flex; align-items: center; padding-right: 2px;
    pointer-events: none;
  }
  .di-clear, .di-cal {
    display: flex; align-items: center; justify-content: center;
    padding: 0 6px; border: none; background: transparent;
    color: ${t.textMuted}; cursor: pointer; flex-shrink: 0;
    transition: color .12s; pointer-events: auto;
  }
  .di-clear:hover, .di-cal:hover:not(:disabled) { color: ${t.textMain}; }
  .di-cal:disabled { opacity: .4; cursor: not-allowed; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 0 14px; height: 36px;
    font-family: ${ff}; font-size: 13px; font-weight: 500;
    border-radius: ${br}px; border: none; cursor: pointer;
    letter-spacing: .005em; white-space: nowrap;
    transition: background .1s, box-shadow .1s, opacity .1s, transform .07s;
  }
  .btn:active:not(:disabled) { transform: scale(.985); }
  .btn:disabled { opacity: .4; cursor: not-allowed; }
  .btn.sm { height: 30px; padding: 0 11px; font-size: 12px; border-radius: ${Math.max(2, br - 1)}px; }
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

  /* ── StatusBadge ── */
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 2.5px 8px; border-radius: ${Math.max(2, br - 1)}px; font-size: 11.5px; font-weight: 500; }
  .bdot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .badge.mandatory { background: ${t.mandatoryBg}; color: ${t.mandatory}; }
  .badge.mandatory .bdot { background: ${t.mandatory}; }
  .badge.new       { background: ${t.purpleBg}; color: ${t.purple}; }
  .badge.new .bdot { background: ${t.purple}; }
  .badge.completed { background: ${t.successBg}; color: ${t.success}; }
  .badge.completed .bdot { background: ${t.success}; }
  .badge.failed    { background: ${t.errorBg}; color: ${t.error}; }
  .badge.failed .bdot { background: ${t.error}; }

  /* ── AutosaveWidget ── */
  .autosave { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: ${br + 4}px; padding: 16px; box-shadow: ${t.shadow}; }
  .autosave-hd { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .autosave-icon { width: 18px; height: 18px; border-radius: 50%; background: ${t.infoBg}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: ${t.info}; }
  .autosave-title { font-size: 13px; font-weight: 600; color: ${t.textMain}; }
  .autosave-body { font-size: 12.5px; color: ${t.textMuted}; line-height: 1.5; margin-bottom: 12px; }
  .autosave-status { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: ${t.textMuted}; margin-bottom: 12px; }
  .autosave-dot { width: 6px; height: 6px; border-radius: 50%; background: ${t.success}; flex-shrink: 0; }
  .autosave-dot.saving { background: ${t.mandatory}; animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  /* ── ContextBanner ── */
  .ctxb { border-radius: ${br + 4}px; display: flex; align-items: center; gap: 12px; transition: opacity .2s; }
  .ctxb.guide-v   { padding: 14px 16px; background: ${t.infoBg}; border: 1px solid ${isDark ? t.info + "33" : "#BFDBFE"}; }
  .ctxb.insight-v { padding: 12px 16px; background: ${isDark ? "#1b1e2e" : "#F5F3FF"}; border: 1px solid ${isDark ? "#6366f133" : "#DDD6FE"}; }
  .ctxb.promo-v   { padding: 16px 20px; background: ${t.surface}; border: 1px solid ${t.border}; box-shadow: ${t.shadow}; justify-content: space-between; }
  .ctxb.info-v    { padding: 11px 13px; background: ${t.infoBg}; border: 1px solid ${isDark ? t.info + "33" : "#BFDBFE"}; align-items: flex-start; }
  .ctxb-info-icon { color: ${t.info}; flex-shrink: 0; margin-top: 1px; display: flex; }
  .ctxb.info-v .ctxb-body-row { font-size: 12.5px; line-height: 1.5; }
  .ctxb.info-v .ctxb-label { display: block; color: ${t.textMain}; font-size: 12.5px; font-weight: 600; }
  .ctxb.warning-v { padding: 11px 13px; background: ${t.warningBg}; border: 1px solid ${t.warningBorder}; align-items: flex-start; }
  .ctxb-warning-icon { color: ${t.warning}; flex-shrink: 0; margin-top: 1px; display: flex; }
  .ctxb.warning-v .ctxb-body-row { font-size: 12.5px; line-height: 1.5; }
  .ctxb.warning-v .ctxb-label { color: ${t.warning}; }
  .ctxb-media { display: flex; align-items: center; flex-shrink: 0; }
  .ctxb-media-item { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid ${t.surface}; font-size: 13px; display: flex; align-items: center; justify-content: center; background: ${t.surfaceHover}; }
  .ctxb-media-item:nth-child(n+2) { margin-left: -6px; }
  .ctxb-mascot { width: 30px; height: 30px; border-radius: 8px; background: ${isDark ? "#312e81" : "#EDE9FE"}; color: ${isDark ? "#a5b4fc" : "#7C3AED"}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ctxb-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .ctxb-body-row { font-size: 13px; color: ${t.textMain}; line-height: 1.45; }
  .ctxb-label { font-weight: 700; color: ${isDark ? "#a5b4fc" : "#6D28D9"}; }
  .ctxb-link  { color: ${t.info}; font-weight: 500; text-decoration: none; cursor: pointer; white-space: nowrap; }
  .ctxb-link:hover { text-decoration: underline; }
  .ctxb-btn   { display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; font-size: 12.5px; font-weight: 500; padding: 6px 12px; border: 1px solid ${t.border}; border-radius: 6px; color: ${t.textMain}; background: none; cursor: pointer; text-decoration: none; font-family: inherit; transition: background .12s, border-color .12s; width: fit-content; }
  .ctxb-btn:hover { background: ${t.surfaceHover}; border-color: ${t.textMuted}; }
  .ctxb-dismiss { background: none; border: none; cursor: pointer; color: ${t.textMuted}; display: flex; align-items: center; padding: 3px; border-radius: 4px; flex-shrink: 0; transition: color .1s, background .1s; }
  .ctxb-dismiss:hover { color: ${t.textMain}; background: ${t.surfaceHover}; }
  .ctxb-gone { opacity: .4; pointer-events: none; }

  /* ── StepperRail ── */
  .srail { display: flex; flex-direction: column; gap: 0; width: 100%; background: ${t.surface}; border: 1px solid ${t.border}; border-radius: ${br + 4}px; overflow: hidden; padding: 8px; }
  .srail-item { position: relative; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: ${br + 2}px; transition: background .12s; }
  .srail-item.clickable { cursor: pointer; }
  .srail-item.clickable:hover { background: ${t.surfaceHover}; border-radius: ${br + 2}px; }
  .srail-item.active { background: ${t.surfaceHover}; border-radius: ${br + 2}px; }
  .srail-line-col { flex-shrink: 0; }
  .srail-connector { position: absolute; left: 23px; top: 34px; bottom: -14px; width: 1.5px; background: ${t.border}; transition: background .15s; z-index: 0; }
  .srail-connector.done { background: ${t.primary}; }
  .srail-circle {
    position: relative; z-index: 1;
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; font-family: ${mf};
    border: 1.5px solid ${t.border}; color: ${t.textMuted}; background: ${t.surface};
    transition: all .15s;
  }
  .srail-circle.done   { background: ${t.primary}; border-color: ${t.primary}; color: ${t.btnText}; }
  .srail-circle.active { border-color: ${t.primary}; color: ${t.primary}; box-shadow: 0 0 0 3px ${t.ring}; }
  .srail-info { padding-top: 2px; }
  .srail-step-label { font-family: ${mf}; font-size: 9px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: ${t.textMuted}; margin-bottom: 1px; }
  .srail-step-label.done-lbl   { color: ${t.success}; }
  .srail-step-label.active-lbl { color: ${t.primary}; }
  .srail-step-name { font-size: 13px; font-weight: 500; color: ${t.textMuted}; transition: color .12s; }
  .srail-step-name.active    { color: ${t.textMain}; font-weight: 600; }
  .srail-step-name.done-name { color: ${t.textMuted}; }

  /* ── ComplianceCheckCard ── */
  .cc-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 13px 16px; border: 1px solid ${t.border}; border-radius: ${br + 2}px; background: ${t.surface}; transition: border-color .15s, background .15s; }
  .cc-card.pass { border-color: ${t.successBorder}; background: ${t.successBg}; }
  .cc-card.fail { border-color: ${t.errorBorder};   background: ${t.errorBg}; }
  .cc-card.warn { border-color: ${t.warningBorder}; background: ${t.warningBg}; }
  .cc-rule   { font-size: 13px; color: ${t.textMain}; line-height: 1.45; flex: 1; }
  .cc-detail { font-size: 11.5px; color: ${t.textMuted}; margin-top: 4px; line-height: 1.5; }
  .cc-badge  { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 5px; font-size: 11.5px; font-weight: 500; flex-shrink: 0; white-space: nowrap; }
  .cc-dot    { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .cc-badge.pass { background: ${t.successBg}; color: ${t.success}; border: 1px solid ${t.successBorder}; }
  .cc-badge.pass .cc-dot { background: ${t.success}; }
  .cc-badge.fail { background: ${t.errorBg}; color: ${t.error}; border: 1px solid ${t.errorBorder}; }
  .cc-badge.fail .cc-dot { background: ${t.error}; }
  .cc-badge.warn { background: ${t.warningBg}; color: ${t.warning}; border: 1px solid ${t.warningBorder}; }
  .cc-badge.warn .cc-dot { background: ${t.warning}; }
  .cc-badge.checking { background: ${t.purpleBg}; color: ${t.purple}; border: 1px solid ${isDark ? t.purple + "44" : "transparent"}; }

  /* ── ComplianceCheckPanel ── */
  .ccp { display: flex; flex-direction: column; gap: 8px; }
  .ccp-banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; background: ${t.purpleBg}; border: 1px solid ${isDark ? t.purple + "44" : "#DDD6FE"}; border-radius: ${br + 4}px; }
  .ccp-banner-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
  .ccp-icon-wrap { width: 36px; height: 36px; border-radius: 8px; background: ${isDark ? t.purple + "22" : "#EDE9FE"}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ccp-banner-title { font-size: 13.5px; font-weight: 600; color: ${t.textMain}; margin-bottom: 2px; }
  .ccp-banner-desc { font-size: 12px; color: ${t.textMuted}; line-height: 1.45; }
  .ccp-banner-desc a { color: ${t.purple}; text-decoration: none; font-weight: 500; }
  .ccp-results { display: flex; flex-direction: column; gap: 6px; }
  .ccp-report { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1px solid ${t.border}; border-radius: 8px; background: ${t.surface}; }
  .ccp-report-text { font-size: 12.5px; color: ${t.textMuted}; }
  .ccp-report-text a { color: ${t.info}; text-decoration: none; font-weight: 500; }
  .ccp-report-text a:hover { text-decoration: underline; }

  /* ── MarketRateChart ── */
  .mrc { display: flex; flex-direction: column; }
  .mrc-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
  .mrc-title    { font-size: 13.5px; font-weight: 600; color: ${t.textMain}; margin-bottom: 2px; }
  .mrc-subtitle { font-size: 12px; color: ${t.textMuted}; line-height: 1.45; }
  .mrc-private  { font-size: 11px; color: ${t.textDisabled}; margin-top: 2px; }
  .mrc-period-toggle { display: flex; border: 1px solid ${t.border}; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
  .mrc-period-btn { padding: 5px 12px; font-family: ${ff}; font-size: 12px; font-weight: 500; background: transparent; border: none; cursor: pointer; color: ${t.textMuted}; transition: background .1s, color .1s; }
  .mrc-period-btn.active { background: ${t.primary}; color: ${t.btnText}; }
  .mrc-bars-wrap { position: relative; height: 120px; margin-bottom: 6px; }
  .mrc-bars { display: flex; align-items: flex-end; gap: 3px; height: 100%; }
  .mrc-bar-col { flex: 1; position: relative; height: 100%; }
  .mrc-bar { position: absolute; bottom: 0; left: 0; right: 0; border-radius: 3px 3px 0 0; background: ${t.chartBar}; transition: height .4s cubic-bezier(.4,0,.2,1), background .15s; }
  .mrc-bar.active-bar { background: ${t.chartBarActive}; }
  .mrc-bar.hover-bar  { background: ${t.chartBarHover}; }
  .mrc-bubble-wrap  { position: absolute; top: -34px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; pointer-events: none; }
  .mrc-bubble       { background: ${t.info}; color: #fff; font-size: 11.5px; font-weight: 600; font-family: ${mf}; padding: 3px 9px; border-radius: 6px; white-space: nowrap; box-shadow: ${t.shadowMd}; }
  .mrc-bubble-arrow { width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid ${t.info}; }
  .mrc-dashed { position: absolute; top: 0; bottom: 0; left: 50%; width: 0; border-left: 1.5px dashed ${t.info}; opacity: .5; pointer-events: none; }
  .mrc-axis { display: flex; justify-content: space-between; align-items: flex-start; padding-top: 8px; border-top: 1px solid ${t.border}; }
  .mrc-axis-item { display: flex; flex-direction: column; align-items: center; gap: 1px; }
  .mrc-axis-val { font-family: ${mf}; font-size: 11px; font-weight: 500; color: ${t.textMain}; }
  .mrc-axis-lbl { font-family: ${mf}; font-size: 9px; letter-spacing: .06em; text-transform: uppercase; color: ${t.textMuted}; }
  .mrc-note { font-size: 11.5px; color: ${t.textMuted}; margin-top: 10px; }

  /* ── Block shell ── */
  .block-shell { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: ${br + 6}px; padding: 24px; box-shadow: ${t.shadow}; display: flex; flex-direction: column; gap: 20px; }
  .block-title    { font-size: 15px; font-weight: 600; color: ${t.textMain}; letter-spacing: -.01em; }
  .block-subtitle { font-size: 12.5px; color: ${t.textMuted}; margin-top: 2px; line-height: 1.5; }
  .block-divider  { height: 1px; background: ${t.border}; margin: 4px 0; }
  .block-row      { display: grid; gap: 12px; }
  .block-row.cols2 { grid-template-columns: 1fr 1fr; }
  .block-field-stack { display: flex; flex-direction: column; gap: 14px; }

  /* ── Info / Warning callout boxes ── */
  .info-box { display: flex; align-items: flex-start; gap: 8px; padding: 11px 13px; background: ${t.infoBg}; border: 1px solid ${isDark ? t.info + "33" : "#BFDBFE"}; border-radius: 8px; }
  .info-box-icon { color: ${t.info}; flex-shrink: 0; margin-top: 1px; }
  .info-box-text { font-size: 12.5px; color: ${t.textMain}; line-height: 1.5; }
  .info-box-text a { color: ${t.info}; font-weight: 500; }
  .warn-box { display: flex; align-items: flex-start; gap: 8px; padding: 11px 13px; background: ${t.warningBg}; border: 1px solid ${t.warningBorder}; border-radius: 8px; }
  .warn-box-icon { color: ${t.warning}; flex-shrink: 0; margin-top: 1px; }
  .warn-box-text { font-size: 12.5px; color: ${t.textMain}; line-height: 1.5; }

  /* ── BenefitsBlock ── */
  .benefit-icon        { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: ${t.textMain}; }
  .benefit-mandatory-banner { display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: ${t.warningBg}; border-top: 1px solid ${t.warningBorder}; }
  .benefit-mandatory-text   { font-size: 12px; color: ${t.warning}; font-weight: 500; }
  .benefit-added-bar   { display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: ${t.successBg}; border-top: 1px solid ${t.successBorder}; }
  .benefit-added-text  { font-size: 12px; color: ${t.success}; font-weight: 500; }
  .benefit-grid        { display: flex; flex-direction: column; gap: 10px; }
  .benefit-section-label { font-size: 11.5px; font-weight: 600; color: ${t.textMuted}; letter-spacing: .04em; text-transform: uppercase; font-family: ${mf}; padding-bottom: 6px; border-bottom: 1px solid ${t.border}; margin-bottom: 2px; }
  .benefit-learn-more  { font-size: 13px; color: ${t.info}; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
  .benefit-learn-more:hover { text-decoration: underline; }

  /* ── JobDescriptionBlock ── */
  .jdb-char-count { font-family: ${mf}; font-size: 10.5px; color: ${t.textMuted}; text-align: right; margin-top: 4px; }
  .jdb-char-count.warn { color: ${t.warning}; }
  .jdb-char-count.over { color: ${t.error}; }
  .ai-banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; background: ${t.purpleBg}; border: 1px solid ${isDark ? t.purple + "44" : "#DDD6FE"}; border-radius: 10px; }
  .ai-banner-left { display: flex; align-items: center; gap: 12px; flex: 1; }
  .ai-icon-wrap   { width: 34px; height: 34px; border-radius: 8px; background: ${isDark ? t.purple + "22" : "#EDE9FE"}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ai-banner-title { font-size: 13px; font-weight: 600; color: ${t.textMain}; margin-bottom: 2px; }
  .ai-banner-desc { font-size: 11.5px; color: ${t.textMuted}; line-height: 1.4; }
  .ai-banner-desc a { color: ${t.purple}; font-weight: 500; }

  /* ── CompensationBlock ── */
  .cb-toggle-wrap   { display: flex; border: 1px solid ${t.border}; border-radius: 8px; overflow: hidden; }
  .cb-toggle-btn    { flex: 1; padding: 8px; font-family: ${ff}; font-size: 13px; font-weight: 500; background: transparent; border: none; cursor: pointer; color: ${t.textMuted}; transition: background .1s, color .1s; }
  .cb-toggle-btn.active { background: ${t.primary}; color: ${t.btnText}; }
  .cb-salary-wrap   { display: flex; align-items: center; border: 1px solid ${t.border}; border-radius: 6px; overflow: hidden; transition: border-color .12s, box-shadow .12s; }
  .cb-salary-wrap:focus-within { border-color: ${t.borderFocus}; box-shadow: 0 0 0 3px ${t.ring}; }
  .cb-currency-prefix { padding: 0 12px; height: 36px; display: flex; align-items: center; font-size: 13.5px; color: ${t.textMuted}; background: ${t.surfaceHover}; border-right: 1px solid ${t.border}; font-family: ${mf}; }
  .cb-salary-input  { flex: 1; height: 36px; padding: 0 11px; font-family: ${mf}; font-size: 14px; font-weight: 500; color: ${t.textMain}; background: ${t.inputBg}; border: none; outline: none; }
  .cb-currency-suffix { padding: 0 12px; height: 36px; display: flex; align-items: center; font-size: 12px; font-weight: 500; color: ${t.textMuted}; background: ${t.surfaceHover}; border-left: 1px solid ${t.border}; font-family: ${mf}; }
  .mrc-ptoggle { display: flex; border: 1px solid ${t.border}; border-radius: 6px; overflow: hidden; }
  .mrc-pbtn { padding: 4px 11px; font-family: ${ff}; font-size: 12px; font-weight: 500; background: transparent; border: none; cursor: pointer; color: ${t.textMuted}; transition: background .1s, color .1s; }
  .mrc-pbtn.on { background: ${t.primary}; color: ${t.btnText}; }
  .bonus-empty { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: ${t.textMuted}; padding: 10px 0; }
  .bonus-dot { width: 6px; height: 6px; border-radius: 50%; background: ${t.textDisabled}; flex-shrink: 0; }

  /* ── CountryPolicyCard ── */
  .pcrd { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: ${br + 4}px; box-shadow: ${t.shadow}; overflow: hidden; }
  .pcrd-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: ${t.surfaceHover}; }
  .pcrd-flag { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; overflow: hidden; flex-shrink: 0; transition: opacity .15s; }
  .pcrd-title { font-size: 13.5px; font-weight: 500; color: ${t.textMain}; line-height: 1.35; transition: color .15s; }
  .pcrd.dimmed .pcrd-flag { opacity: .4; }
  .pcrd.dimmed .pcrd-title { color: ${t.textMuted}; }
  .pcrd-divider { height: 1px; background: ${t.border}; }
  .pcrd-rows { display: flex; flex-direction: column; }
  .pcrd-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; }
  .pcrd-row + .pcrd-row { border-top: 1px solid ${t.border}; }
  .pcrd-row-label { font-size: 13px; color: ${t.textMuted}; }
  .pcrd-row-value { font-size: 13.5px; font-weight: 600; color: ${t.textMain}; text-align: right; }

  /* ── Spinners / shimmer ── */
  .spin    { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; border: 1.5px solid ${isDark ? "rgba(9,9,11,.3)" : "rgba(255,255,255,.3)"}; border-top-color: ${t.btnText}; animation: sp .55s linear infinite; }
  .spin-sm { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; border: 1.5px solid ${t.border}; border-top-color: ${t.purple}; animation: sp .55s linear infinite; }
  .spin-inv { border: 1.5px solid ${t.border}; border-top-color: ${t.textMain}; }
  @keyframes sp { to { transform: rotate(360deg); } }
  .shimmer { height: 44px; border-radius: 8px; background: linear-gradient(90deg,${t.surfaceHover} 25%,${t.border} 50%,${t.surfaceHover} 75%); background-size: 200% 100%; animation: shim 1.4s infinite; }
  @keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  /* ── EmptyStateRow ── */
  .esr { display: flex; align-items: center; gap: 10px; padding: 13px 16px; background: ${t.surfaceHover}; border: 1px solid ${t.border}; border-radius: ${br + 2}px; }
  .esr-icon { color: ${t.textDisabled}; flex-shrink: 0; display: flex; }
  .esr-text { font-size: 13px; color: ${t.textMuted}; }

  /* ── Block outer shells (shared layout) ── */
  .add-person-shell    { display: flex; flex-direction: column; gap: 16px; }
  .compensation-shell  { display: flex; flex-direction: column; gap: 16px; }
  .mri-label { font-size: 13.5px; font-weight: 600; color: ${t.textMain}; }
  .mri-desc  { font-size: 12px; color: ${t.textMuted}; margin-bottom: 12px; }

  /* ── EORContractCreationFlow ── */
  .flow-shell        { background: ${t.bg}; width: 100%; container-type: inline-size; }
  .flow-header       { display: flex; align-items: center; justify-content: space-between; padding: 12px 28px; background: ${t.surface}; border-bottom: 1px solid ${t.border}; }
  .flow-header-title { font-size: 13.5px; font-weight: 600; color: ${t.textMain}; }
  .flow-header-sub   { font-size: 11.5px; color: ${t.textMuted}; }
  .flow-body         { display: grid; grid-template-columns: 1fr 264px; gap: 0; padding: 28px 32px 64px; align-items: start; }
  .flow-main         { min-width: 0; padding-right: 28px; }
  .flow-footer       { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid ${t.border}; }
  .flow-rail         { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 20px; }

  @container (max-width: 680px) {
    .flow-body  { grid-template-columns: 1fr; padding: 20px 16px 48px; }
    .flow-main  { padding-right: 0; }
    .flow-rail  { position: static; order: -1; }
    .flow-header { padding: 10px 16px; }
  }
`;
  let out = css;
  if (fsc !== 1) out = out.replace(/font-size:\s*([\d.]+)px/g, (_, n) => `font-size: ${Math.round(+n * fsc * 10) / 10}px`);
  if (ssc !== 1) {
    const sp = v => { const m = v.match(/^([\d.]+)px$/); return m ? `${Math.round(+m[1] * ssc * 10) / 10}px` : v; };
    out = out.replace(/\bgap:\s*([\d.]+)px/g, (_, n) => `gap: ${Math.round(+n * ssc * 10) / 10}px`);
    out = out.replace(/\bpadding:\s*((?:(?:[\d.]+px|0)\s*)+)/g, (_, vals) =>
      `padding: ${vals.trim().split(/\s+/).map(sp).join(' ')}`
    );
    out = out.replace(/\bpadding-(top|right|bottom|left):\s*([\d.]+px)/g, (_, side, val) =>
      `padding-${side}: ${sp(val)}`
    );
  }
  return out;
};

// ═══════════════════════════════════════════════════════════════════
// SHARED ICONS
// ═══════════════════════════════════════════════════════════════════
const Chevron    = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 5 7 9 11 5"/></svg>;
const Check      = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5 5.5 4.5 8.5 9.5 2.5"/></svg>;
const CheckLg    = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5 6 4.5 9 10.5 3"/></svg>;
const Plus       = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="6.5" y1="1.5" x2="6.5" y2="11.5"/><line x1="1.5" y1="6.5" x2="11.5" y2="6.5"/></svg>;
const Refresh    = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 6.5A5 5 0 0 1 11 3.5"/><polyline points="9 1.5 11.5 3.5 9.5 6"/><path d="M11.5 6.5A5 5 0 0 1 2 9.5"/><polyline points="4 11.5 1.5 9.5 3.5 7"/></svg>;
const Info       = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="5.5"/><line x1="7" y1="6.5" x2="7" y2="10"/><circle cx="7" cy="4.5" r=".8" fill="currentColor" stroke="none"/></svg>;
const Warning    = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1.5L13 12H1L7 1.5z"/><line x1="7" y1="6" x2="7" y2="9"/><circle cx="7" cy="10.5" r=".6" fill="currentColor" stroke="none"/></svg>;
const AIIcon     = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="8" cy="8" r="6.5"/><path d="M5.5 8a2.5 2.5 0 0 0 5 0"/><circle cx="5.8" cy="5.8" r=".7" fill="currentColor" stroke="none"/><circle cx="10.2" cy="5.8" r=".7" fill="currentColor" stroke="none"/></svg>;
const InfoSmall  = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="5.5" cy="5.5" r="4.5"/><line x1="5.5" y1="5" x2="5.5" y2="8"/><circle cx="5.5" cy="3.2" r=".6" fill="currentColor" stroke="none"/></svg>;
const X          = () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="2.5" y1="2.5" x2="10.5" y2="10.5"/><line x1="10.5" y1="2.5" x2="2.5" y2="10.5"/></svg>;
const ExternalLink = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7"/><polyline points="8 1 11 1 11 4"/><line x1="5.5" y1="6.5" x2="11" y2="1"/></svg>;
const Disk       = () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1" y="1" width="9" height="9" rx="1.5"/><rect x="3" y="1" width="5" height="3.5" rx=".5" fill="currentColor" stroke="none"/><rect x="2.5" y="6" width="6" height="3" rx=".5"/></svg>;
const CalendarIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1.5" y="2.5" width="11" height="10" rx="1.5"/><line x1="1.5" y1="5.5" x2="12.5" y2="5.5"/><line x1="4.5" y1="1" x2="4.5" y2="4"/><line x1="9.5" y1="1" x2="9.5" y2="4"/></svg>;

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Forms
// ═══════════════════════════════════════════════════════════════════

/**
 * Single-line text input atom.
 *
 * @param {string}   [label]       - Label displayed above the input.
 * @param {string}   [placeholder] - Greyed hint text.
 * @param {string}   [value]       - Controlled value.
 * @param {boolean}  [required]    - Appends * to the label.
 * @param {boolean}  [disabled]    - Prevents interaction.
 * @param {boolean}  [error]       - Red border + error background.
 * @param {string}   [helperText]  - Hint or error message below the input.
 * @param {function} [onChange]    - Called on every keystroke with the new value.
 */
export function TextInput({ label, placeholder, value, required, disabled, error, helperText, onChange, prefix, suffix }) {
  const [v, setV] = useState(value ?? "");
  const handleChange = e => { setV(e.target.value); onChange?.(e.target.value); };
  const hasAdornment = prefix || suffix;
  const inputEl = (
    <input
      className={!hasAdornment && error ? "err" : ""}
      placeholder={placeholder}
      value={v}
      disabled={disabled}
      onChange={handleChange}
    />
  );
  return (
    <div className="fi">
      {label && (
        <label className="fl">
          {label}{required && <span className="req">*</span>}
        </label>
      )}
      {hasAdornment ? (
        <div className={`fi-adorn${error ? " err" : ""}${disabled ? " disabled" : ""}`}>
          {prefix && <span className="fi-pre">{prefix}</span>}
          {inputEl}
          {suffix && <span className="fi-suf">{suffix}</span>}
        </div>
      ) : inputEl}
      {helperText && <span className={`fhint${error ? " err" : ""}`}>{helperText}</span>}
    </div>
  );
}

/**
 * Date field atom with a × clear button and a calendar icon.
 *
 * @param {string}   [label]       - Label displayed above the input.
 * @param {string}   [value]       - Controlled ISO date value (YYYY-MM-DD).
 * @param {boolean}  [required]    - Appends * to the label.
 * @param {boolean}  [disabled]    - Prevents interaction.
 * @param {boolean}  [error]       - Red border + error background.
 * @param {string}   [helperText]  - Hint or error message below the input.
 * @param {function} [onChange]    - Called with the ISO date string on change.
 */
export function DateInput({ label, value, required, disabled, error, helperText, onChange }) {
  const [v, setV] = useState(value ?? "");
  const inputRef = useRef(null);
  const handleChange = e => { setV(e.target.value); onChange?.(e.target.value); };
  const handleClear = () => { setV(""); onChange?.(""); };
  const handleCalClick = () => inputRef.current?.showPicker?.();
  return (
    <div className="fi">
      {label && (
        <label className="fl">
          {label}{required && <span className="req">*</span>}
        </label>
      )}
      <div className={`di-wrap${error ? " err" : ""}${disabled ? " disabled" : ""}`}>
        <input
          ref={inputRef}
          type="date"
          className={`di-inp${!v ? " ph" : ""}`}
          value={v}
          disabled={disabled}
          onChange={handleChange}
        />
        <div className="di-actions">
          {v && !disabled && (
            <button type="button" className="di-clear" onClick={handleClear} aria-label="Clear date">
              <X />
            </button>
          )}
          <button type="button" className="di-cal" onClick={handleCalClick} disabled={disabled} tabIndex={-1} aria-label="Open date picker">
            <CalendarIcon />
          </button>
        </div>
      </div>
      {helperText && <span className={`fhint${error ? " err" : ""}`}>{helperText}</span>}
    </div>
  );
}

/**
 * Native select with custom chevron icon.
 *
 * @param {string}   [label]       - Field label.
 * @param {string}   [placeholder] - Placeholder option text (default: 'Select…').
 * @param {Array}    options        - Array of { value: string, label: string }.
 * @param {string}   [value]       - Controlled selected value.
 * @param {boolean}  [optional]    - Appends '(optional)' to the label.
 * @param {boolean}  [disabled]    - Prevents interaction.
 * @param {string}   [helperText]  - Hint text rendered below the select.
 * @param {function} [onChange]    - Called with the new value string.
 */
export function DropdownSelect({ label, placeholder = "Select…", options = [], value, optional, required, disabled, helperText, onChange }) {
  const [v, setV] = useState(value ?? "");
  const handleChange = e => { setV(e.target.value); onChange?.(e.target.value); };
  return (
    <div className="fi">
      {label && (
        <label className="fl">
          {label}
          {required && <span className="req">*</span>}
          {optional && <span style={{ fontWeight: 400, opacity: .65 }}> (optional)</span>}
        </label>
      )}
      <div className="selw">
        <select className={!v ? "ph" : ""} disabled={disabled} value={v} onChange={handleChange}>
          <option value="" disabled>{placeholder}</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="chev"><Chevron /></span>
      </div>
      {helperText && <span className="fhint">{helperText}</span>}
    </div>
  );
}

/**
 * Full-width tappable radio row for mutually exclusive choices.
 * Controlled: manage selection state externally.
 *
 * @param {string}   label       - Primary option label.
 * @param {string}   [sublabel]  - Secondary descriptive line.
 * @param {boolean}  [selected]  - Whether this option is currently selected.
 * @param {boolean}  [disabled]  - Mutes and prevents interaction.
 * @param {function} [onClick]   - Called when the row is clicked.
 */
export function RadioOption({ label, sublabel, selected, disabled, onClick }) {
  return (
    <button type="button" className={`rrow${selected ? " on" : ""}`} disabled={disabled} onClick={onClick}>
      <div className="rcirc">{selected && <div className="rdot" />}</div>
      <div>
        <div className="rlbl">{label}</div>
        {sublabel && <div className="rsub">{sublabel}</div>}
      </div>
    </button>
  );
}

/**
 * Full-width bordered row with an iOS-style toggle switch on the right.
 * Supports controlled (checked + onChange) and uncontrolled usage.
 *
 * @param {string}   label         - Primary label text.
 * @param {string}   [description] - Secondary help text below the label.
 * @param {boolean}  [checked]     - Controlled checked state.
 * @param {boolean}  [disabled]    - Prevents interaction and mutes appearance.
 * @param {function} [onChange]    - (checked: boolean) => void
 */
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

/**
 * White rounded card wrapping a group of related form fields.
 *
 * @param {string}      title           - Bold section heading at the top of the card.
 * @param {string}      [description]   - Optional muted text rendered below the title.
 * @param {ReactNode}   [icon]          - Optional icon rendered to the left of the title.
 * @param {number}      [iconSize]      - Width/height of the icon container in px (default: 32).
 * @param {ReactNode}   [badges]        - One or more badges rendered inline after the title.
 * @param {ReactNode}   [action]        - Optional element rendered in the top-right corner (e.g. an Add button).
 * @param {Function}    [onInfoClick]   - Renders a ⓘ icon button when provided; called on click.
 * @param {ReactNode}   [children]      - Form fields or any content inside the card.
 */
export function SectionCard({ title, description, icon, iconSize = 32, badges, showInfoButton, onInfoClick, action, bodyGap, footer, children }) {
  const showInfoBtn = showInfoButton || !!onInfoClick;
  const showHeader = !!(title || description || showInfoBtn || action || icon || badges);
  return (
    <div className={`sc${footer ? " sc--has-footer" : ""}`}>
      {showHeader && (
      <div className="sc-header">
        <div className="sc-header-left">
          {icon && (
            <div className="sc-header-icon" style={{ width: iconSize, height: iconSize }}>
              {icon}
            </div>
          )}
          <div className="sc-header-text">
            {(title || badges) && (
              <div className="sc-title-row">
                {title && <span className="sc-title">{title}</span>}
                {badges}
              </div>
            )}
            {description && <p className="sc-desc">{description}</p>}
          </div>
        </div>
        {(action || showInfoBtn) && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {action}
            {showInfoBtn && (
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
        )}
      </div>
      )}
      {children && <div className="sc-body" style={bodyGap !== undefined ? { gap: bodyGap } : undefined}>{children}</div>}
      {footer && <div className="sc-footer">{footer}</div>}
    </div>
  );
}

/**
 * Adjacent pill-buttons for selecting one option from a small, mutually exclusive set.
 * Used for Annual/Hourly salary period, Annual/Monthly market-rate view, and any
 * binary or ternary toggle that lives inline with a heading.
 *
 * @param {{ value: string; label: string }[]} options  - Two or more option objects.
 * @param {string}   [value]     - Controlled selected value.
 * @param {function} [onChange]  - (value: string) => void
 * @param {'sm'|'md'} [size]    - 'sm' shrinks padding (default: 'md').
 * @param {boolean}  [fullWidth] - Stretches to fill its container.
 * @param {boolean}  [disabled]  - Prevents interaction on all segments.
 */
export function SegmentedControl({ options = [], value, defaultValue, onChange, size, fullWidth, disabled }) {
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value ?? "");
  const active = value !== undefined ? value : internal;
  const select = (v) => {
    if (disabled) return;
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  const btnRefs = useRef([]);
  const hasMounted = useRef(false);
  const [pill, setPill] = useState(null);

  useLayoutEffect(() => {
    const idx = options.findIndex(o => o.value === active);
    const btn = btnRefs.current[idx];
    if (!btn) return;
    setPill({
      left: btn.offsetLeft, top: btn.offsetTop,
      width: btn.offsetWidth, height: btn.offsetHeight,
      animated: hasMounted.current,
    });
    hasMounted.current = true;
  }, [active, options]);

  return (
    <div className={`seg${size === "sm" ? " sm" : ""}${fullWidth ? " full" : ""}`} role="group">
      {pill && (
        <div
          className={`seg-pill${disabled ? " seg-pill-disabled" : ""}`}
          style={{
            left: pill.left, top: pill.top,
            width: pill.width, height: pill.height,
            transition: pill.animated
              ? "left .2s cubic-bezier(.4,0,.2,1), width .2s cubic-bezier(.4,0,.2,1)"
              : "none",
          }}
        />
      )}
      {options.map((opt, i) => (
        <button
          key={opt.value}
          ref={el => { btnRefs.current[i] = el; }}
          type="button"
          className={`seg-opt${active === opt.value ? " on" : ""}`}
          disabled={disabled}
          onClick={() => select(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Groups a section heading plus a responsive grid of TextInput / DropdownSelect atoms.
 *
 * @param {string}   [title]       - Optional section heading.
 * @param {string}   [description] - Optional helper text below the title.
 * @param {Array}    fields         - Field config objects. Each: { type, label, placeholder, value, required, disabled, error, helperText, options, optional }.
 * @param {1|2|3}    [columns]     - Grid column count (default: 1).
 */
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
        {fields.map((f, i) =>
          f.type === "select"
            ? <DropdownSelect key={i} label={f.label} placeholder={f.placeholder} options={f.options ?? []} value={f.value} disabled={f.disabled} optional={f.optional} />
            : <TextInput     key={i} label={f.label} placeholder={f.placeholder} value={f.value} required={f.required} disabled={f.disabled} error={f.error} helperText={f.helperText} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Actions
// ═══════════════════════════════════════════════════════════════════

/**
 * Primary filled call-to-action button.
 *
 * @param {string}    label       - Button label text.
 * @param {boolean}   [disabled]  - Prevents interaction.
 * @param {boolean}   [loading]   - Shows spinner and blocks click.
 * @param {'sm'|'md'|'lg'} [size] - Height 30 / 36 / 42px (default: 'md').
 * @param {ReactNode} [icon]      - Leading icon element.
 * @param {function}  [onClick]   - Click handler.
 */
export function PrimaryButton({ label, disabled, loading, size, icon, onClick }) {
  const sz = size === "sm" ? " sm" : size === "lg" ? " lg" : "";
  return (
    <button type="button" className={`btn btn-p${sz}`} disabled={disabled || loading} onClick={onClick}>
      {loading ? <span className="spin" /> : icon}
      {label}
    </button>
  );
}

/**
 * Outlined secondary action button.
 *
 * @param {string}    label       - Button label text.
 * @param {boolean}   [disabled]  - Prevents interaction.
 * @param {boolean}   [loading]   - Shows spinner.
 * @param {'sm'|'md'|'lg'} [size] - Height 30 / 36 / 42px (default: 'md').
 * @param {ReactNode} [icon]      - Leading icon element.
 * @param {function}  [onClick]   - Click handler.
 */
export function SecondaryButton({ label, disabled, loading, size, icon, onClick }) {
  const sz = size === "sm" ? " sm" : size === "lg" ? " lg" : "";
  return (
    <button type="button" className={`btn btn-s${sz}`} disabled={disabled || loading} onClick={onClick}>
      {loading && <span className="spin spin-inv" />}
      {!loading && icon}
      {label}
    </button>
  );
}

/**
 * Ghost text-link button with no border or background.
 *
 * @param {string}   label      - Button label.
 * @param {boolean}  [disabled] - Mutes and prevents clicks.
 * @param {function} [onClick]  - Click handler.
 */
export function TextButton({ label, disabled, onClick }) {
  return <button type="button" className="btn btn-g" disabled={disabled} onClick={onClick}>{label}</button>;
}

/**
 * Unified button — choose the style via the variant prop.
 *
 * @param {'primary'|'secondary'|'text'} [variant] - Visual style (default: 'primary').
 * @param {string}   label       - Button label text.
 * @param {boolean}  [disabled]  - Prevents interaction.
 * @param {boolean}  [loading]   - Shows spinner (primary and secondary only).
 * @param {'sm'|'md'|'lg'} [size] - Height preset (primary and secondary only).
 * @param {function} [onClick]   - Click handler.
 */
export function Button({ variant = "primary", label, disabled, loading, size, onClick }) {
  if (variant === "secondary") return <SecondaryButton label={label} disabled={disabled} loading={loading} size={size} onClick={onClick} />;
  if (variant === "text")      return <TextButton      label={label} disabled={disabled} onClick={onClick} />;
  return                               <PrimaryButton  label={label} disabled={disabled} loading={loading} size={size} onClick={onClick} />;
}

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Status & Feedback
// ═══════════════════════════════════════════════════════════════════

/**
 * Compact semantic pill label.
 *
 * @param {'mandatory'|'new'|'completed'|'failed'} variant - Visual and semantic style.
 * @param {string}  [label] - Override the default text.
 * @param {boolean} [dot]   - Show colour dot (default: true).
 */
export function StatusBadge({ variant = "mandatory", label, dot = true }) {
  const defaults = { mandatory: "Mandatory", new: "New", completed: "Completed", failed: "Failed" };
  return (
    <span className={`badge ${variant}`}>
      {dot && <span className="bdot" />}
      {label ?? defaults[variant]}
    </span>
  );
}

/**
 * Muted bordered empty state row for use inside list containers.
 * Shows a ⓘ info icon alongside a label when a list has no items.
 *
 * @param {string} [label] - Empty state message (default: 'No items yet').
 */
export function EmptyStateRow({ label = "No items yet" }) {
  return (
    <div className="esr">
      <span className="esr-icon"><Info /></span>
      <span className="esr-text">{label}</span>
    </div>
  );
}

/**
 * Right-rail autosave status card.
 * Transitions between saved (green dot + timestamp) and saving (spinner + amber dot).
 *
 * @param {'saved'|'saving'} [status]        - Autosave state (default: 'saved').
 * @param {string}           [lastSaved]     - Human-readable timestamp e.g. '2 minutes ago'.
 * @param {function}         [onDeleteDraft] - Called when Delete draft is clicked.
 */
export function AutosaveWidget({ status = "saved", lastSaved, onDeleteDraft }) {
  const isSaving = status === "saving";
  return (
    <div className="autosave">
      <div className="autosave-hd">
        <div className="autosave-icon"><InfoSmall /></div>
        <span className="autosave-title">Autosaved</span>
      </div>
      <p className="autosave-body">
        Your progress is saved automatically. Delete the draft to start over.
      </p>
      <div className="autosave-status">
        {isSaving
          ? <><span className="spin-sm spin-inv" /><span>Saving…</span></>
          : <><span className="autosave-dot" /><span>{lastSaved ? `Saved ${lastSaved}` : "All changes saved"}</span></>}
      </div>
      <SecondaryButton label="Delete draft" size="sm" onClick={onDeleteDraft} />
    </div>
  );
}

/**
 * Contextual, dismissable banner linking to a country-specific hiring guide.
 *
 * @param {string}            [country]   - Country name inserted into the body copy.
 * @param {string}            [guideUrl]  - URL for the 'View' link.
 * @param {string[]}          [flags]     - 2–3 emoji flag strings.
 * @param {'info'|'surface'}  [variant]   - 'info' = blue tint (default), 'surface' = neutral.
 * @param {function}          [onDismiss] - Called when × is clicked.
 */
/**
 * Unified contextual banner — three semantic variants:
 * - "guide"   : dismissable hiring-guide link (blue tint, flags, × button)
 * - "insight" : inline AI callout (purple tint, mascot, "Deel Insight:" prefix, text link)
 * - "promo"   : persistent upsell tile (surface card, imagery right, outlined button CTA)
 */
export function ContextBanner({
  variant = "guide",
  layout,
  title,
  body,
  country,
  media,
  ctaLabel,
  ctaUrl = "#",
  ctaStyle,
  onCtaClick,
  dismissable,
  onDismiss,
}) {
  const [dismissed, setDismissed] = useState(false);
  const handleDismiss = () => { setDismissed(true); onDismiss?.(); };

  const isGuide   = variant === "guide";
  const isInsight = variant === "insight";
  const isPromo   = variant === "promo";
  const isInfo    = variant === "info";
  const isWarning = variant === "warning";

  const resolvedBody = body ?? (
    isGuide   ? `View Deel's global hiring guide for ${country ?? "your country"}.` :
    isInsight ? "Severance in the United States typically ranges from 0–26 weeks depending on tenure." :
    isInfo    ? "" :
    isWarning ? "" :
                "Set up a foreign entity with Deel — we handle compliance, payroll, and local filings."
  );
  const resolvedTitle = title !== undefined ? title : (
    isInsight ? "Deel Insight:" :
    isPromo   ? "Foreign Entity Setup" : null
  );
  const resolvedMedia       = media ?? (isInsight || isInfo || isWarning ? null : ["🌍", isGuide ? "🇺🇸" : "🏢"]);
  const resolvedCtaLabel    = ctaLabel ?? (isGuide ? "View" : "Learn more");
  const resolvedCtaStyle    = ctaStyle ?? (isPromo ? "button" : "link");
  const resolvedLayout      = layout ?? (isInfo ? "stacked" : "inline");
  const resolvedDismissable = dismissable ?? isGuide;
  const handleCtaClick      = () => onCtaClick ? onCtaClick() : window.open(ctaUrl, "_blank", "noreferrer");

  const MediaStack = ({ items }) => (
    <div className="ctxb-media">
      {(items ?? []).map((f, i) => <div key={i} className="ctxb-media-item">{f}</div>)}
    </div>
  );

  return (
    <div className={`ctxb ${variant}-v${dismissed ? " ctxb-gone" : ""}`}>

      {/* Left icon / media */}
      {!isPromo && (
        isInfo
          ? <span className="ctxb-info-icon"><Info /></span>
          : isWarning
          ? <span className="ctxb-warning-icon"><Warning /></span>
          : isInsight
          ? <div className="ctxb-mascot">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 .5L9.9 4.8 14.5 5.5 11 8.9l.8 4.6L8 11.4l-3.8 2.1.8-4.6L1.5 5.5l4.6-.7z"/>
              </svg>
            </div>
          : resolvedMedia && <MediaStack items={resolvedMedia} />
      )}

      {/* Content */}
      <div className="ctxb-content">
        <div className="ctxb-body-row">
          {resolvedTitle && <span className="ctxb-label" style={resolvedLayout === "stacked" ? { display: "block" } : undefined}>{resolvedTitle} </span>}
          <span className="ctxb-body">{resolvedBody}</span>
          {resolvedCtaStyle === "link" && (!isInfo || ctaLabel) && (
            <button
              type="button"
              className="btn btn-g"
              style={{ paddingLeft: 4, paddingRight: 2, verticalAlign: "middle", display: "inline-flex", alignItems: "center", gap: isInfo ? 0 : 3 }}
              onClick={handleCtaClick}
            >
              {resolvedCtaLabel}{!isInfo && <ExternalLink />}
            </button>
          )}
        </div>
        {resolvedCtaStyle === "button" && (
          <a className="ctxb-btn" href={ctaUrl} target="_blank" rel="noreferrer">
            {resolvedCtaLabel} ↗
          </a>
        )}
      </div>

      {/* Right media (promo only) */}
      {isPromo && resolvedMedia && <MediaStack items={resolvedMedia} />}

      {/* Dismiss */}
      {resolvedDismissable && (
        <button type="button" className="ctxb-dismiss" onClick={handleDismiss} aria-label="Dismiss">
          <X />
        </button>
      )}
    </div>
  );
}

/** @deprecated Use ContextBanner with variant="guide" instead. */
export function HiringGuideBanner({ country = "United States", flags, variant, onDismiss, guideUrl }) {
  return <ContextBanner variant="guide" country={country} media={flags} ctaUrl={guideUrl ?? "#"} onDismiss={onDismiss} />;
}

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Navigation
// ═══════════════════════════════════════════════════════════════════

/**
 * Vertical step progress indicator for multi-step flows.
 * Three states per step: done (filled + check), active (ring), future (grey).
 * Completed steps are clickable to navigate back.
 *
 * @param {{ label: string }[]} steps         - One object per step, in order.
 * @param {number}              [currentStep] - 1-indexed active step (default: 1).
 * @param {function}            [onStepClick] - (stepNumber) => void — fired on completed steps.
 */
export function StepperRail({ steps = [], currentStep = 1, onStepClick }) {
  return (
    <div className="srail">
      {steps.map((step, i) => {
        const num      = i + 1;
        const isDone   = num < currentStep;
        const isActive = num === currentStep;
        const isLast   = i === steps.length - 1;
        return (
          <div
            key={num}
            className={`srail-item${isActive ? " active" : ""}${isDone && onStepClick ? " clickable" : ""}`}
            onClick={() => isDone && onStepClick?.(num)}
          >
            <div className="srail-line-col">
              <div className={`srail-circle${isDone ? " done" : isActive ? " active" : ""}`}>
                {isDone ? <Check /> : num}
              </div>
            </div>
            <div className="srail-info">
              <div className={`srail-step-label${isDone ? " done-lbl" : isActive ? " active-lbl" : ""}`}>
                {isDone ? "Completed" : isActive ? "In progress" : `Step ${num}`}
              </div>
              <div className={`srail-step-name${isActive ? " active" : isDone ? " done-name" : ""}`}>
                {step.label}
              </div>
            </div>
            {!isLast && <div className={`srail-connector${isDone ? " done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Compliance
// ═══════════════════════════════════════════════════════════════════

/**
 * Single compliance rule result row.
 * Four states: checking (spinner), pass (green), warn (amber), fail (red).
 *
 * @param {string} rule                            - The compliance rule text.
 * @param {'checking'|'pass'|'warn'|'fail'} status - Controls tint, badge and icon.
 * @param {string} [detail]                        - AI-generated explanation shown below the rule.
 */
export function ComplianceCheckCard({ rule, status = "checking", detail }) {
  const labels = { pass: "Passed", fail: "Failed", warn: "Warning", checking: "Checking…" };
  return (
    <div className={`cc-card ${status}`}>
      <div style={{ flex: 1 }}>
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

/**
 * Full AI compliance widget.
 * Purple banner → shimmer while running → streamed ComplianceCheckCard results → false-positive link.
 * Stream results incrementally by adding to `results` one item at a time while `isRunning` is true.
 *
 * @param {{ rule: string; status: string; detail?: string }[]} [results]   - Empty = pre-run state.
 * @param {boolean}  [isRunning]  - Shows shimmer rows, disables Run check button.
 * @param {function} [onRunCheck] - () => void — called when Run check is clicked.
 * @param {function} [onReport]   - () => void — called when the false-positive link is clicked.
 */
export function ComplianceCheckPanel({ results = [], isRunning = false, onRunCheck, onReport }) {
  const hasResults = results.length > 0;
  return (
    <div className="ccp">
      <div className="ccp-banner">
        <div className="ccp-banner-left">
          <div className="ccp-icon-wrap"><AIIcon /></div>
          <div>
            <div className="ccp-banner-title">Save time with our AI-powered compliance check</div>
            <div className="ccp-banner-desc">
              Use our AI-powered check to verify your job scope meets the{" "}
              <a href="#">EOR compliance requirements</a>{" "}
              enabling an instant quote without manual review.
            </div>
          </div>
        </div>
        <SecondaryButton
          size="sm"
          label={isRunning ? "Running…" : "Run check"}
          icon={isRunning ? null : <Refresh />}
          loading={isRunning}
          disabled={isRunning}
          onClick={onRunCheck}
        />
      </div>

      {isRunning && !hasResults && (
        <div className="ccp-results">
          {[1, 2, 3].map(i => <div key={i} className="shimmer" />)}
        </div>
      )}

      {hasResults && (
        <div className="ccp-results">
          {results.map((r, i) => (
            <ComplianceCheckCard key={i} rule={r.rule} status={r.status} detail={r.detail} />
          ))}
        </div>
      )}

      {hasResults && (
        <div className="ccp-report">
          <span style={{ color: "inherit", display: "flex", flexShrink: 0 }}><InfoSmall /></span>
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

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Country Standards
// ═══════════════════════════════════════════════════════════════════

/**
 * Compact card displaying a statutory country policy.
 * Renders a flag + title in a tinted header, a divider, and one or
 * more label/value rows for the policy details.
 *
 * @param {string}   flag    - Country flag emoji (e.g. "🇺🇸").
 * @param {string}   title   - Policy title shown in the header.
 * @param {Array}    rows    - Array of { label: string; value: string }.
 * @param {boolean}  [dimmed] - Mutes the header to indicate an inactive policy.
 */
export function CountryPolicyCard({ flag, title, rows = [], dimmed }) {
  return (
    <div className={`pcrd${dimmed ? " dimmed" : ""}`}>
      <div className="pcrd-header">
        {flag !== "none" && <span className="pcrd-flag">{flag}</span>}
        <span className="pcrd-title">{title}</span>
      </div>
      <div className="pcrd-divider" />
      <div className="pcrd-rows">
        {rows.map((row, i) => (
          <div key={i} className="pcrd-row">
            <span className="pcrd-row-label">{row.label}</span>
            <span className="pcrd-row-value">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Market Intelligence
// ═══════════════════════════════════════════════════════════════════

const MOCK_MARKET_DATA = {
  annual:  { low: 30700, median: 69000, high: 123200, buckets: [18,34,52,70,88,80,66,50,36,22,14] },
  monthly: { low: 2558,  median: 5750,  high: 10267,  buckets: [16,30,50,68,86,80,64,48,34,20,12] },
};

function fmtK(n) { return n >= 1000 ? `$${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `$${n}`; }

/**
 * Salary benchmarking histogram with period toggle and active-position bubble.
 * Bars animate on mount and on period change. Bubble repositions as salary changes.
 *
 * @param {number} salary               - Gross annual salary — positions the bubble.
 * @param {'annual'|'monthly'} [period] - Initial period (default: 'annual').
 * @param {string} [country]            - Country name in the chart title.
 * @param {string} [seniority]          - Seniority tier in the chart title.
 * @param {string} [jobTitle]           - Job title in the chart title.
 */
export function MarketRateChart({ salary = 77293.01, period: initPeriod = "annual", country = "United States", seniority = "Mid", jobTitle = "Executive Assistant" }) {
  const [period, setPeriod]   = useState(initPeriod);
  const [hovered, setHovered] = useState(null);

  const data       = MOCK_MARKET_DATA[period];
  const maxBucket  = Math.max(...data.buckets);
  const displaySal = period === "annual" ? salary : salary / 12;
  const fmtSal     = `$${displaySal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const salPos     = Math.max(0, Math.min(1, (displaySal - data.low) / (data.high - data.low)));
  const activeBucket = Math.round(salPos * (data.buckets.length - 1));

  return (
    <div className="mrc">
      <div className="mrc-header">
        <div>
          <div className="mrc-title">{seniority} {jobTitle} {period} compensation in {country}.</div>
          <div className="mrc-subtitle">Your payment rate is equal to {fmtSal} {period === "annual" ? "annually" : "monthly"} in USD.</div>
          <div className="mrc-private">Market rate insights will not be shown to employees.</div>
        </div>
        <div className="mrc-period-toggle">
          <button type="button" className={`mrc-period-btn${period === "annual" ? " active" : ""}`} onClick={() => setPeriod("annual")}>Annual</button>
          <button type="button" className={`mrc-period-btn${period === "monthly" ? " active" : ""}`} onClick={() => setPeriod("monthly")}>Monthly</button>
        </div>
      </div>

      <div className="mrc-bars-wrap">
        <div className="mrc-bars">
          {data.buckets.map((h, i) => {
            const hPct     = (h / maxBucket) * 100;
            const isActive = i === activeBucket;
            const isHover  = i === hovered;
            return (
              <div key={i} className="mrc-bar-col"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className={`mrc-bar${isActive ? " active-bar" : ""}${isHover && !isActive ? " hover-bar" : ""}`}
                  style={{ height: `${hPct}%` }}
                />
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
      <div className="mrc-note">Market rate insights will not be shown to employees.</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Blocks
// ═══════════════════════════════════════════════════════════════════

const SCOPE_PLACEHOLDER = `Duties and Responsibilities

- Assist customers.
- Develop and manage client portfolios.
- Sustain business growth and profitability.
- Analyze customer data to improve experience.`;

const COMPLIANCE_RULES = [
  { rule: "Job scope should be relevant to the job title.", status: "fail", detail: "The described duties relate to customer success, not executive assistance." },
  { rule: "Job scope should not include recruiting or hiring language.", status: "pass" },
  { rule: "Job scope should not reference reporting lines.", status: "warn", detail: "Indirect reference detected — consider rephrasing." },
  { rule: "Job scope should not include required education or experience requirements.", status: "pass" },
];

/**
 * Full job description section block.
 * Includes: job title select, seniority select, scope guidelines, scope template select,
 * scope textarea with character counter, and AI compliance check panel.
 * The Run check button streams compliance cards in one by one.
 *
 * @param {string}   [defaultTitle]           - Pre-filled job title.
 * @param {string}   [defaultSeniority]       - Pre-filled seniority key.
 * @param {string}   [defaultScope]           - Pre-filled scope text.
 * @param {boolean}  [showComplianceResults]  - Render compliance cards immediately.
 * @param {boolean}  [complianceRunning]      - Start in running/shimmer state.
 * @param {function} [onSave]                 - ({ title, seniority, scope }) => void.
 */
export function JobDescriptionBlock({
  defaultTitle = "Executive Assistant",
  defaultSeniority = "mid",
  defaultScope = "",
  showComplianceResults = false,
  complianceRunning = false,
  onSave,
  onReport,
}) {
  const [scope, setScope]     = useState(defaultScope);
  const [running, setRunning] = useState(complianceRunning);
  const [results, setResults] = useState(showComplianceResults ? COMPLIANCE_RULES : []);
  const maxLen = 10000;

  const runCheck = () => {
    setRunning(true);
    setResults([]);
    COMPLIANCE_RULES.forEach((r, i) => {
      setTimeout(() => {
        setResults(prev => [...prev, r]);
        if (i === COMPLIANCE_RULES.length - 1) setRunning(false);
      }, 500 + i * 400);
    });
  };

  const charClass = scope.length > maxLen * 0.9
    ? scope.length > maxLen ? "over" : "warn"
    : "";

  return (
    <div className="block-shell">
      <div><div className="block-title">Job description</div></div>

      <div className="block-field-stack">
        <DropdownSelect label="Job title" required value={defaultTitle}
          options={[
            { value: "Executive Assistant", label: "Executive Assistant" },
            { value: "Product Manager",     label: "Product Manager" },
            { value: "Software Engineer",   label: "Software Engineer" },
          ]} />
        <DropdownSelect label="Seniority level" required value={defaultSeniority}
          options={[
            { value: "jun", label: "Junior (IC Level 1)" },
            { value: "mid", label: "Mid (Individual Contributor Level 2)" },
            { value: "sen", label: "Senior (IC Level 3)" },
          ]} />
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Job scope</span>
          <SecondaryButton label="Manage job scopes" size="sm" />
        </div>
        <div className="block-subtitle" style={{ marginBottom: 12 }}>This information will form the basis of the employment agreement.</div>
        <div style={{ marginBottom: 12 }}>
          <ContextBanner variant="info"
            title="Job scope guidelines"
            body='Always refer to your company as "the company". Do not include recruiting language or references to c-suite positions.'
            ctaLabel="Learn more"
            ctaUrl="#"
          />
        </div>
        <DropdownSelect placeholder="Job scope template (optional)" optional
          helperText="Selecting a template will replace the current job scope."
          options={[{ value: "t1", label: "Customer Success Template" }]} />
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label className="fl">Explanation of job scope <span className="req">*</span></label>
            <button className="btn btn-g" type="button" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
              onClick={() => onSave?.({ scope })}>
              <Disk /> Save scope
            </button>
          </div>
          <div className="fi">
            <textarea placeholder={SCOPE_PLACEHOLDER} value={scope}
              onChange={e => setScope(e.target.value)} style={{ minHeight: 160 }} />
          </div>
          <div className={`jdb-char-count${charClass ? " " + charClass : ""}`}>
            {scope.length}/{maxLen.toLocaleString()}
          </div>
        </div>
      </div>

      <ComplianceCheckPanel
        results={results}
        isRunning={running}
        onRunCheck={runCheck}
        onReport={onReport}
      />
    </div>
  );
}

const MARKET_DATA_BLOCK = {
  annual:  { low: 30700, median: 69000, high: 123200, buckets: [18,34,52,70,88,80,66,50,36,22,14] },
  monthly: { low: 2558,  median: 5750,  high: 10267,  buckets: [16,30,50,68,86,80,64,48,34,20,12] },
};

/**
 * Complete compensation section block — covers all contract compensation fields.
 * Rendered as a vertical stack of SectionCards:
 *   Employment type · Compensation (with market rate + signing bonus) · Work schedule ·
 *   Fixed allowances · Variable compensation · Employment terms · Desired start date ·
 *   Time off · Sick leave · Notice period.
 *
 * @param {number}   [defaultSalary]            - Starting gross annual salary (default: 77293.01).
 * @param {string}   [defaultEmploymentType]    - 'full' | 'part' (default: 'full').
 * @param {string}   [defaultPeriod]            - 'annual' | 'hourly' (default: 'annual').
 * @param {boolean}  [showMarketInsights]        - Show/hide market rate chart (default: true).
 * @param {string}   [country]                  - Country name used across section copy.
 * @param {string}   [defaultEmploymentTerms]   - 'indefinite' | 'definite' (default: 'indefinite').
 * @param {string}   [defaultContractEndDate]   - ISO date string for contract end (default: '').
 * @param {string}   [defaultStartDate]         - ISO date string for agreement start (default: '').
 * @param {string}   [defaultTimeOff]           - 'minimum' | 'specific' (default: 'minimum').
 * @param {string}   [defaultWorkHours]         - Work hours per week value (default: '40').
 * @param {function} [onSalaryChange]           - (value: number, period: string) => void.
 */
export function CompensationBlock({
  defaultSalary = 77293.01,
  defaultEmploymentType = "full",
  defaultPeriod = "annual",
  showMarketInsights = true,
  country = "United States",
  defaultEmploymentTerms = "indefinite",
  defaultContractEndDate = "",
  defaultStartDate = "",
  defaultTimeOff = "minimum",
  defaultWorkHours = "40",
  onSalaryChange,
}) {
  const [empType,         setEmpType]         = useState(defaultEmploymentType);
  const [salPeriod,       setSalPeriod]       = useState(defaultPeriod);
  const [salary,          setSalary]          = useState(defaultSalary);
  const [chartPeriod,     setChartPeriod]     = useState(defaultPeriod);
  const [animated,        setAnimated]        = useState(false);
  const [empTerms,        setEmpTerms]        = useState(defaultEmploymentTerms);
  const [contractEndDate, setContractEndDate] = useState(defaultContractEndDate);
  const [startDate,       setStartDate]       = useState(defaultStartDate);
  const [timeOff,         setTimeOff]         = useState(defaultTimeOff);
  const [vacationDays,    setVacationDays]    = useState("");

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(timer);
  }, [chartPeriod, salary]);

  const handleSalaryChange = val => {
    setSalary(val);
    onSalaryChange?.(val, salPeriod);
  };

  const contractDuration = (() => {
    if (!contractEndDate) return null;
    const end = new Date(contractEndDate);
    const now = new Date();
    const days = Math.round((end - now) / (1000 * 60 * 60 * 24));
    return days > 0 ? `Duration of definite contract: ${days} days` : null;
  })();

  const data         = MARKET_DATA_BLOCK[chartPeriod];
  const displaySal   = chartPeriod === "annual" ? salary : salary / 12;
  const salPos       = Math.max(0, Math.min(1, (displaySal - data.low) / (data.high - data.low)));
  const activeBucket = Math.round(salPos * (data.buckets.length - 1));
  const maxBucket    = Math.max(...data.buckets);

  return (
    <div className="compensation-shell">

      {/* 1 · Employment type */}
      <SectionCard title="Employment type">
        <div className="rstack">
          <RadioOption label="Full-time" selected={empType === "full"} onClick={() => setEmpType("full")} />
          <RadioOption label="Part-time" selected={empType === "part"} onClick={() => setEmpType("part")} />
        </div>
      </SectionCard>

      {/* 2 · Compensation + market rate + signing bonus */}
      <SectionCard
        title="Compensation"
        description={`All compensation will be awarded in US Dollar (USD). Due to compliance, contract currencies are not customizable in EOR.`}
      >
        <SegmentedControl
          fullWidth
          options={[{ value: "annual", label: "Annual" }, { value: "hourly", label: "Hourly" }]}
          value={salPeriod}
          onChange={v => setSalPeriod(v)}
        />
        <TextInput
          label={salPeriod === "annual" ? "Gross annual base salary" : "Hourly rate"}
          required
          prefix="$"
          suffix="USD"
          value={String(salary)}
          onChange={v => handleSalaryChange(parseFloat(v) || 0)}
        />

        {showMarketInsights && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="mri-label">Market rate insights</span>
              <SegmentedControl
                size="sm"
                options={[{ value: "annual", label: "Annual" }, { value: "monthly", label: "Monthly" }]}
                value={chartPeriod}
                onChange={v => setChartPeriod(v)}
              />
            </div>
            <div className="mri-desc">
              Mid Executive Assistant {chartPeriod} compensation in {country}. Market rate insights will not be shown to employees.
            </div>
            <div className="mrc-bars-wrap">
              <div className="mrc-bars">
                {data.buckets.map((h, i) => {
                  const hPct = (h / maxBucket) * 100;
                  const isActive = i === activeBucket;
                  return (
                    <div key={i} className="mrc-bar-col">
                      <div className={`mrc-bar${isActive ? " active-bar" : ""}`} style={{ height: animated ? `${hPct}%` : "0%" }} />
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
        )}

        {/* Signing / retention bonus */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="block-title" style={{ fontSize: 14 }}>Signing/retention bonus</div>
            <div className="fhint" style={{ marginTop: 3 }}>One time payment to the employee on specific date or as part of their first payroll.</div>
          </div>
          <SecondaryButton size="sm" label="Add" />
        </div>
        <EmptyStateRow label="No bonus added yet" />
      </SectionCard>

      {/* 3 · Work schedule */}
      <SectionCard
        title="Work schedule"
        action={<SecondaryButton size="sm" label="Create new schedule" icon={<ExternalLink />} />}
      >
        <CountryPolicyCard
          flag="🇺🇸"
          title={`Standard full time work hour per week in ${country}`}
          rows={[{ label: "Work hours per week", value: "30.00 - 40.00" }]}
        />
        <TextInput
          label="Work hours per week"
          required
          value={defaultWorkHours}
          suffix="Hours"
        />
        <DropdownSelect
          label={`${empType === "full" ? "Full-time" : "Part-time"} schedules`}
          required
          options={[]}
          placeholder="Select schedule…"
        />
      </SectionCard>

      {/* 4 · Fixed allowances */}
      <SectionCard
        title="Fixed allowances"
        description="Allowances that are written into the EOR contract that may be granted on a one-time or monthly recurring basis (E.g. Moving allowance, wellness allowance etc)"
        action={<SecondaryButton size="sm" label="Add" />}
      >
        <EmptyStateRow label="No fixed allowances yet" />
      </SectionCard>

      {/* 5 · Variable compensation */}
      <SectionCard
        title="Variable compensation"
        description="Add additional compensation that will be included within the EOR contract."
        action={<SecondaryButton size="sm" label="Add" />}
      >
        <EmptyStateRow label="No variable compensation yet" />
      </SectionCard>

      {/* 6 · Employment terms */}
      <SectionCard title="Employment terms">
        <div className="rstack">
          <RadioOption label="Indefinite" selected={empTerms === "indefinite"} onClick={() => setEmpTerms("indefinite")} />
          <RadioOption label="Definite"   selected={empTerms === "definite"}   onClick={() => setEmpTerms("definite")} />
        </div>
        {empTerms === "definite" && (
          <DateInput
            label="Contract end date (MM/DD/YYYY)"
            required
            value={contractEndDate}
            helperText={contractDuration || undefined}
            onChange={setContractEndDate}
          />
        )}
      </SectionCard>

      {/* 7 · Desired start date */}
      <SectionCard title="Desired start date" description="Select the worker's start date.">
        <ContextBanner
          variant="info"
          body={`Due to regulatory requirements, the earliest possible start date is Mar 4th 2026. If you need a later start date, please ensure that the contract end date allows for at least a 3-month duration. This provides enough time to complete onboarding in ${country}. Delays in providing information may postpone this date.`}
        />
        <DateInput
          label="Agreement start date (MM/DD/YYYY)"
          required
          value={startDate}
          onChange={setStartDate}
        />
      </SectionCard>

      {/* 8 · Time off */}
      <SectionCard
        title="Time off"
        description="Deel recommends opting for the minimum PTO for adhering to the local best practices and using internal policies for handling additional holidays."
      >
        <TextButton label={`Learn more about time-off policies in ${country}`} />
        <div className="rstack">
          <RadioOption label="Minimum legal requirement" selected={timeOff === "minimum"} onClick={() => setTimeOff("minimum")} />
          <RadioOption label="Specific"                  selected={timeOff === "specific"} onClick={() => setTimeOff("specific")} />
        </div>
        {timeOff === "specific" && (
          <TextInput label="Paid vacation days" required value={vacationDays} onChange={setVacationDays} />
        )}
      </SectionCard>

      {/* 9 · Sick leave */}
      <SectionCard title="Sick leave">
        <ContextBanner
          variant="info"
          body={`Sick leave entitlements in ${country} vary depending on the specifics of the leave request. Please reach out to your CSM for more information about paid sick leave in ${country}`}
        />
        <CountryPolicyCard
          flag="🇺🇸"
          title={`Standard sick leave in ${country}`}
          rows={[{ label: "Sick leave days", value: "Not applicable" }]}
        />
      </SectionCard>

      {/* 10 · Notice period */}
      <SectionCard title="Notice period">
        <ContextBanner
          variant="info"
          body={`When hiring in ${country}, you can only select the standard, local regulations for notice period.`}
        />
        <div className="rstack">
          <RadioOption label="Standard" selected disabled />
          <RadioOption label="Custom"   disabled />
        </div>
        <CountryPolicyCard
          flag="🇺🇸"
          title={`Standard notice period in ${country}`}
          rows={[
            { label: "During probation", value: "No notice period" },
            { label: "After probation",  value: "No notice period" },
          ]}
        />
      </SectionCard>

    </div>
  );
}

const BENEFITS_DATA = [
  { id: "healthcare",   icon: <Icon name="shield-plus" size={24} />, iconBg: "#EFF6FF", name: "Healthcare",                mandatory: true,  isNew: false, desc: "Ensure the employee is covered by a healthcare option — a monthly gross allowance or a localised plan.",                                                                                                                                   ctaLabel: "Add Healthcare"  },
  { id: "pension",      icon: <Icon name="award"       size={24} />, iconBg: "#F0FDF4", name: "Pension",                    mandatory: true,  isNew: false, desc: "Comprehensive savings and pension plan for working employees to fund their retirement in the future.",                                                                                                                                      ctaLabel: "Add Pension"     },
  { id: "lifeinsurance",icon: <Icon name="file-text"   size={24} />, iconBg: "#FFF7ED", name: "Life Insurance",              mandatory: true,  isNew: false, desc: "Provide financial security in the event of an unexpected death, allowing employees to maintain their lifestyle.",                                                                                                                          ctaLabel: "Add Life Insurance" },
  { id: "travel",       icon: <Icon name="plane"       size={24} />, iconBg: "#F5F3FF", name: "Business Travel Insurance",  mandatory: false, isNew: true,  desc: "Tap into Deel's corporate travel insurance and get emergency coverage, crisis assistance, and 24/7 support for your workers, before and during their trip.",                                                                               ctaLabel: "Add",            learnMoreUrl: "#" },
  { id: "coworking",    icon: <Icon name="building"    size={24} />, iconBg: "#F8FAFC", name: "Coworking Space Membership", mandatory: false, isNew: false, desc: "Request monthly access to WeWork. Explore available WeWork locations.",                                                                                                                                                                    ctaLabel: "Add",            learnMoreUrl: "#" },
  { id: "equity",       icon: <Icon name="pie-chart"   size={24} />, iconBg: "#F8FAFC", name: "Equity & Tokens",            mandatory: false, isNew: false, desc: "Easily include equity in your EOR employee contracts with our Equity & Tokens Service. We'll help ensure proper classification so your company stays compliant and your team shares in your growth.",                                       ctaLabel: "Add",            learnMoreUrl: "#" },
  { id: "background",   icon: <Icon name="fingerprint" size={24} />, iconBg: "#F8FAFC", name: "Background Check",           mandatory: false, isNew: false, desc: "Confirm a new team member's background for peace of mind and a smooth onboarding process.",                                                                                                                                                ctaLabel: "Add now",        learnMoreUrl: "#" },
];

/**
 * Country-aware benefits section.
 * Split into mandatory (Healthcare, Pension, Life Insurance) and optional extras.
 * Mandatory benefits show a warning banner until added. All cards independently togglable.
 *
 * @param {string}    [country]      - Country name in subtitle and mandatory banners.
 * @param {Benefit[]} [benefits]     - Override the default benefit list.
 * @param {function}  [onAddBenefit] - (benefitId: string) => void.
 */
export function BenefitsBlock({ country = "United States", benefits, onAddBenefit }) {
  const list = benefits ?? BENEFITS_DATA;
  const [added, setAdded] = useState({});
  const toggle = id => {
    const next = !added[id];
    setAdded(prev => ({ ...prev, [id]: next }));
    if (next) onAddBenefit?.(id);
  };


  const renderCard = (b) => (
    <SectionCard
      key={b.id}
      icon={b.icon}
      title={b.name}
      badges={b.mandatory ? <StatusBadge variant="mandatory" /> : b.isNew ? <StatusBadge variant="new" /> : null}
      action={
        added[b.id]
          ? <SecondaryButton size="sm" label="Added" icon={<CheckLg />} onClick={() => toggle(b.id)} />
          : b.mandatory
            ? <PrimaryButton   size="sm" label={b.ctaLabel} icon={<Plus />} onClick={() => toggle(b.id)} />
            : <SecondaryButton size="sm" label={b.ctaLabel} icon={<Plus />} onClick={() => toggle(b.id)} />
      }
      footer={
        added[b.id] ? (
          <div className="benefit-added-bar">
            <CheckLg />
            <span className="benefit-added-text">{b.name} has been added</span>
          </div>
        ) : null
      }
    >
      <p className="sc-desc">{b.desc}</p>
      {b.learnMoreUrl && (
        <div style={{ alignSelf: "flex-start" }}>
          <TextButton label="Learn more" onClick={() => window.open(b.learnMoreUrl, "_blank")} />
        </div>
      )}
      {b.mandatory && !added[b.id] && (
        <ContextBanner variant="warning" body={`${b.name} is a mandatory benefit for ${country}`} />
      )}
    </SectionCard>
  );

  return (
    <div className="benefit-grid">
      {list.map(renderCard)}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// AddPersonBlock — step 1 of the EOR contract creation flow
// ──────────────────────────────────────────────────────────────────

const ENTITY_OPTIONS = [
  { value: "au_payroll",  label: "AU entity - Payroll Connect" },
  { value: "us_payroll",  label: "US entity - Payroll Connect" },
  { value: "de_payroll",  label: "DE entity - Payroll Connect" },
];
const GROUP_OPTIONS = [
  { value: "au_group", label: "AU - Payroll Connect - group" },
  { value: "us_group", label: "US - Payroll Connect - group" },
  { value: "de_group", label: "DE - Payroll Connect - group" },
];
const COUNTRY_OPTIONS = [
  { value: "us", label: "🇺🇸  United States" },
  { value: "de", label: "🇩🇪  Germany" },
  { value: "gb", label: "🇬🇧  United Kingdom" },
  { value: "au", label: "🇦🇺  Australia" },
  { value: "ca", label: "🇨🇦  Canada" },
  { value: "fr", label: "🇫🇷  France" },
];
const US_STATE_OPTIONS = [
  { value: "al", label: "Alabama" },
  { value: "ak", label: "Alaska" },
  { value: "az", label: "Arizona" },
  { value: "ar", label: "Arkansas" },
  { value: "ca", label: "California" },
  { value: "co", label: "Colorado" },
  { value: "fl", label: "Florida" },
  { value: "ga", label: "Georgia" },
  { value: "il", label: "Illinois" },
  { value: "mo", label: "Missouri" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "wa", label: "Washington" },
];
const JOB_POSITION_OPTIONS = [
  { value: "pm",       label: "Product Manager" },
  { value: "eng",      label: "Software Engineer" },
  { value: "design",   label: "UX Designer" },
  { value: "ea",       label: "Executive Assistant" },
  { value: "analyst",  label: "Business Analyst" },
];
const PEOPLE_OPTIONS = [
  { value: "alex",  label: "Alex Johnson" },
  { value: "sam",   label: "Sam Lee" },
  { value: "priya", label: "Priya Patel" },
  { value: "marco", label: "Marco Rossi" },
];
const DEPARTMENT_OPTIONS = [
  { value: "eng",     label: "Engineering" },
  { value: "design",  label: "Design" },
  { value: "product", label: "Product" },
  { value: "hr",      label: "Human Resources" },
  { value: "finance", label: "Finance" },
];
const TEAM_OPTIONS = [
  { value: "platform", label: "Platform" },
  { value: "growth",   label: "Growth" },
  { value: "infra",    label: "Infrastructure" },
  { value: "cx",       label: "Customer Experience" },
];
const HIRING_OBJECTIVE_OPTIONS = [
  { value: "temp_eor",  label: "Temporary EOR while we set up an entity" },
  { value: "new_hc",   label: "New headcount" },
  { value: "backfill", label: "Backfill" },
  { value: "convert",  label: "Convert contractor" },
  { value: "longterm", label: "Long-term EOR with Deel" },
];

/**
 * Step 1 of the EOR contract creation flow — 'Add person' multi-section form.
 * Six SectionCards assembled from existing atoms and molecules.
 *
 * Sections:
 *   1. Team information — Entity + Group dropdowns
 *   2. Employee personal details — toggle, email, name, citizenship, country, insight banner, state
 *   3. Workplace information — job position, manager, report, worker ID, external ID
 *   4. Organizational structure — department, teams
 *   5. Hiring objective — objective dropdown + promo banner
 *
 * @param {string}   [defaultEntity]   - Pre-selected entity value.
 * @param {string}   [defaultGroup]    - Pre-selected group value.
 * @param {string}   [defaultCountry]  - Pre-selected country option value (default: 'us').
 * @param {string}   [defaultState]    - Pre-selected state dropdown value.
 * @param {string}   [workerIdValue]   - Read-only Worker ID (default: '260').
 * @param {function} [onSave]          - (formData: object) => void.
 */
export function AddPersonBlock({
  defaultEntity    = "au_payroll",
  defaultGroup     = "au_group",
  defaultCountry   = "us",
  defaultState     = "",
  workerIdValue    = "260",
  onSave,
}) {
  const [skipDetails,      setSkipDetails]      = useState(false);
  const [hiringObjective,  setHiringObjective]  = useState("temp_eor");
  const [employmentCountry, setEmploymentCountry] = useState(defaultCountry);
  const showState = employmentCountry === "us";

  return (
    <div className="add-person-shell">
      {/* Page heading */}
      <div>
        <div className="block-title">Add person</div>
        <div className="block-subtitle">Create a new contract for your EOR employee</div>
      </div>

      {/* ── 1. Team information ── */}
      <SectionCard title="Team information" showInfoButton>
        <DropdownSelect label="Entity" required
          options={ENTITY_OPTIONS} value={defaultEntity} />
        <DropdownSelect label="Group" required
          options={GROUP_OPTIONS} value={defaultGroup} />
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
            <TextInput
              label="Personal email" required
              placeholder="devon.parisian@letsdeel.co"
              helperText="We will use this email address for inviting your worker to complete their onboarding."
            />
            <TextInput label="Legal first name" required placeholder="Devon" />
            <TextInput label="Legal last name" required placeholder="Parisian" />
            <DropdownSelect label="Employee's citizenship" required
              options={COUNTRY_OPTIONS} value={defaultCountry} />
            <div>
              <DropdownSelect label="Employment country" required
                options={COUNTRY_OPTIONS} value={employmentCountry}
                onChange={setEmploymentCountry} />
            </div>
            <ContextBanner
              variant="insight"
              body="Severance in the United States can range from at least 2 to 4 weeks salary."
              ctaLabel="Learn more"
            />
            {showState && (
              <DropdownSelect label="Select state" required
                placeholder="Select state…"
                options={US_STATE_OPTIONS} value={defaultState} />
            )}
          </>
        )}
      </SectionCard>

      {/* ── 3. Workplace information ── */}
      <SectionCard title="Workplace information">
        <div>
          <DropdownSelect label="Job Position" optional placeholder="Job Position (optional)"
            options={JOB_POSITION_OPTIONS} />
          <div className="fhint" style={{ marginTop: 4 }}>Assign a vacant job position to this worker</div>
        </div>
        <div>
          <DropdownSelect label="Manager" optional placeholder="Manager (optional)"
            options={PEOPLE_OPTIONS} />
          <div className="fhint" style={{ marginTop: 4 }}>You can search by name or email</div>
        </div>
        <div>
          <DropdownSelect label="Report" optional placeholder="Report (optional)"
            options={PEOPLE_OPTIONS} />
          <div className="fhint" style={{ marginTop: 4 }}>You can search by name or email</div>
        </div>
        <TextInput label="Worker ID" required value={workerIdValue} disabled />
        <TextInput label="External worker ID" placeholder="External worker ID (optional)" />
      </SectionCard>

      {/* ── 4. Organizational structure ── */}
      <SectionCard title="Organizational structure">
        <DropdownSelect label="Department" optional placeholder="Department (optional)"
          options={DEPARTMENT_OPTIONS} />
        <DropdownSelect label="Teams" optional placeholder="Teams (optional)"
          options={TEAM_OPTIONS} />
      </SectionCard>

      {/* ── 5. Hiring objective ── */}
      <SectionCard title="Hiring objective">
        <DropdownSelect
          label="What's your hiring objective?"
          required
          options={HIRING_OBJECTIVE_OPTIONS}
          value={hiringObjective}
          onChange={setHiringObjective}
        />
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

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Flows
// ═══════════════════════════════════════════════════════════════════

const FLOW_STEPS = [
  { label: "Add person" },
  { label: "Job details" },
  { label: "Compensation and dates" },
  { label: "Benefits and extras" },
];

/**
 * Complete EOR contract creation flow.
 * Wires together all blocks (AddPersonBlock, JobDescriptionBlock, CompensationBlock, BenefitsBlock)
 * with StepperRail, AutosaveWidget, and HiringGuideBanner into a 4-step navigable flow.
 *
 * @param {number}   [initialStep]  - Step to start on (1–4, default: 1).
 * @param {string}   [workerName]   - Pre-filled worker name.
 * @param {string}   [country]      - Hiring country — drives banner and benefit mandates.
 * @param {function} [onComplete]   - (contractData) => void — called on final submit.
 * @param {function} [onStepChange] - (step) => void — called on every navigation.
 */
export function EORContractCreationFlow({
  initialStep = 1,
  workerName = "Alex Johnson",
  country = "United States",
  showHeader = true,
  headerTitle = "Create new EOR contract",
  headerSubtitle,
  onComplete,
  onStepChange,
}) {
  const [step, setStep]           = useState(initialStep);
  const [saveStatus, setSaveStatus] = useState("saved");

  const goTo = n => {
    setStep(n);
    onStepChange?.(n);
    setSaveStatus("saving");
    setTimeout(() => setSaveStatus("saved"), 1200);
  };

  const next = () => {
    if (step < 4) {
      goTo(step + 1);
    } else {
      onComplete?.({
        workerName,
        country,
        contractType: "EOR",
        status: "submitted",
        submittedAt: new Date().toISOString(),
      });
    }
  };
  const back = () => { if (step > 1) goTo(step - 1); };

  const stepContent = {
    1: <AddPersonBlock />,
    2: <JobDescriptionBlock defaultTitle="Executive Assistant" defaultSeniority="mid" />,
    3: <CompensationBlock defaultSalary={77293.01} country={country} />,
    4: <BenefitsBlock country={country} />,
  };

  return (
    <div className="flow-shell">
      {/* Top bar */}
      {showHeader && (
        <div className="flow-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div>
              <div className="flow-header-title">{headerTitle}</div>
              <div className="flow-header-sub">{headerSubtitle ?? `Full-time · ${country}`}</div>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flow-body">
        {/* Main content */}
        <div className="flow-main">
          {stepContent[step]}
          <div className="flow-footer">
            <SecondaryButton label="Back" disabled={step === 1} onClick={back} />
            <PrimaryButton label={step === 4 ? "Submit contract" : "Continue"} onClick={next} />
          </div>
        </div>

        {/* Rail */}
        <div className="flow-rail">
          <StepperRail steps={FLOW_STEPS} currentStep={step} onStepClick={n => n < step && goTo(n)} />
          <AutosaveWidget status={saveStatus} lastSaved={saveStatus === "saved" ? "just now" : undefined} />
        </div>
      </div>
    </div>
  );
}
