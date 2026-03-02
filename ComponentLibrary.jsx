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
 *  Forms               · TextInput, DropdownSelect, RadioOption, FormFieldGroup
 *  Actions             · PrimaryButton, SecondaryButton, TextButton
 *  Status & Feedback   · StatusBadge, AutosaveWidget, HiringGuideBanner
 *  Navigation          · StepperRail
 *  Compliance          · ComplianceCheckCard, ComplianceCheckPanel
 *  Market Intelligence · MarketRateChart
 *  Blocks              · JobDescriptionBlock, CompensationBlock, BenefitsBlock
 *  Flows               · EORContractCreationFlow
 *
 * ─── TIERS (composition hierarchy) ────────────────────────────────
 *  atom  →  molecule  →  ai-molecule  →  block  →  flow
 */

import { useState, useEffect } from "react";

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
    name: "HiringGuideBanner",
    domain: "Status & Feedback",
    tier: "molecule",
    description:
      "Contextual dismissable banner linking to Deel's country-specific hiring guide. Appears at the top of the contract creation flow. Two variants: info-tinted (prominent) and surface (subtle).",
    composedOf: ["TextButton"],
    props: [
      { name: "country",   type: "string",             required: false, description: "Country name inserted into the body copy." },
      { name: "guideUrl",  type: "string",             required: false, description: "URL for the 'View' link." },
      { name: "flags",     type: "string[]",           required: false, description: "2–3 emoji or character flags shown as stacked circles." },
      { name: "variant",   type: "'info' | 'surface'", required: false, description: "'info' = blue tint (default), 'surface' = neutral card." },
      { name: "onDismiss", type: "() => void",         required: false, description: "Called when × is clicked." },
    ],
    usage: '<HiringGuideBanner country="Germany" variant="info" onDismiss={handleDismiss} />',
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
      "Full compensation section: employment type radio group, Annual/Hourly period toggle, salary input with currency prefix/suffix, live market rate histogram with bubble, and an empty signing bonus slot. Bubble repositions as salary changes.",
    composedOf: ["RadioOption", "TextInput", "MarketRateChart", "PrimaryButton", "SecondaryButton"],
    props: [
      { name: "defaultSalary",        type: "number",  required: false, description: "Starting gross annual salary (default: 77293.01)." },
      { name: "defaultEmploymentType",type: "string",  required: false, description: "'full' | 'part' (default: 'full')." },
      { name: "defaultPeriod",        type: "string",  required: false, description: "'annual' | 'hourly' (default: 'annual')." },
      { name: "showMarketInsights",   type: "boolean", required: false, description: "Show/hide the market rate chart (default: true)." },
      { name: "country",              type: "string",  required: false, description: "Country name shown in the helper text." },
      { name: "onSalaryChange",       type: "(value: number, period: string) => void", required: false, description: "Called when salary or period changes." },
    ],
    usage: `<CompensationBlock
  defaultSalary={77293.01}
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

  // ── Flows ─────────────────────────────────────────────────────
  {
    name: "EORContractCreationFlow",
    domain: "Flows",
    tier: "flow",
    description:
      "Complete 4-step EOR contract creation orchestration: (1) Personal details, (2) Job description with AI compliance, (3) Compensation with market insights, (4) Benefits. Wires together all Blocks, StepperRail, and AutosaveWidget into one navigable flow with an optional header and right-side rail.",
    composedOf: [
      "JobDescriptionBlock", "CompensationBlock", "BenefitsBlock",
      "StepperRail", "AutosaveWidget",
      "FormFieldGroup", "PrimaryButton", "SecondaryButton",
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

/**
 * All supported appearance customisation keys and their defaults.
 * Pass a subset of these to applyAppearance() to override only what you need.
 */
export const APPEARANCE_DEFAULTS = {
  /** Primary action colour — buttons, focus rings, active chart bars. */
  primaryColor: "#18181B",
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
};

/**
 * Merge an `appearance` override object into a full token set.
 * Only the semantic keys declared in APPEARANCE_DEFAULTS are mapped —
 * all remaining token values are preserved unchanged, keeping light/dark
 * mode intact.
 *
 * @param {object} baseTokens - lightTokens or darkTokens
 * @param {Partial<typeof APPEARANCE_DEFAULTS>} appearance
 * @returns {object} merged token object suitable for makeLibraryCSS()
 */
export function applyAppearance(baseTokens, appearance = {}) {
  const t = { ...baseTokens };
  if (appearance.primaryColor) {
    t.primary        = appearance.primaryColor;
    t.primaryHover   = appearance.primaryColor;
    t.borderFocus    = appearance.primaryColor;
    t.chartBarActive = appearance.primaryColor;
  }
  if (appearance.fontFamily)            t._fontFamily = appearance.fontFamily;
  if (appearance.monospaceFontFamily)   t._monoFont   = appearance.monospaceFontFamily;
  if (appearance.borderRadius !== undefined) t._borderRadius = appearance.borderRadius;
  return t;
}

// ═══════════════════════════════════════════════════════════════════
// CSS FACTORY
// Call makeLibraryCSS(tokens, isDark) and inject the result via
// <style dangerouslySetInnerHTML={{ __html: ... }} />
// ═══════════════════════════════════════════════════════════════════
export const makeLibraryCSS = (t, isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }

  /* ── TextInput ── */
  .fi { display: flex; flex-direction: column; gap: 4px; }
  .fl { font-size: 12px; font-weight: 500; color: ${t.textMain}; }
  .fl .req { color: ${t.error}; margin-left: 1px; }
  .fi input, .fi textarea {
    width: 100%; padding: 0 11px;
    font-family: 'Inter', sans-serif; font-size: 13.5px; color: ${t.textMain};
    background: ${t.inputBg}; border: 1px solid ${t.border};
    border-radius: 6px; outline: none; appearance: none;
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

  /* ── DropdownSelect ── */
  .selw { position: relative; }
  .selw select {
    height: 36px; width: 100%; padding: 0 34px 0 11px;
    font-family: 'Inter', sans-serif; font-size: 13.5px;
    background: ${t.inputBg}; border: 1px solid ${t.border};
    border-radius: 6px; outline: none; appearance: none; cursor: pointer; color: ${t.textMain};
    transition: border-color .12s, box-shadow .12s;
  }
  .selw select.ph { color: ${t.textDisabled}; }
  .selw select:focus { border-color: ${t.borderFocus}; box-shadow: 0 0 0 3px ${t.ring}; }
  .selw select:disabled { background: ${t.surfaceHover}; color: ${t.textDisabled}; cursor: not-allowed; }
  .chev { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: ${t.textMuted}; }

  /* ── RadioOption ── */
  .rrow {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 13px; border: 1px solid ${t.border}; border-radius: 8px;
    cursor: pointer; user-select: none; width: 100%;
    background: ${t.surface}; transition: border-color .1s, background .1s;
    font-family: 'Inter', sans-serif; appearance: none; text-align: left;
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

  /* ── FormFieldGroup ── */
  .ffg { display: flex; flex-direction: column; gap: 14px; }
  .ffg-title { font-size: 13.5px; font-weight: 600; color: ${t.textMain}; margin-bottom: 2px; }
  .ffg-desc { font-size: 12px; color: ${t.textMuted}; line-height: 1.5; margin-bottom: 4px; }
  .ffg-row { display: grid; gap: 12px; }
  .ffg-row.cols-2 { grid-template-columns: 1fr 1fr; }
  .ffg-row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 0 14px; height: 36px;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    border-radius: 6px; border: none; cursor: pointer;
    letter-spacing: .005em; white-space: nowrap;
    transition: background .1s, box-shadow .1s, opacity .1s, transform .07s;
  }
  .btn:active:not(:disabled) { transform: scale(.985); }
  .btn:disabled { opacity: .4; cursor: not-allowed; }
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

  /* ── StatusBadge ── */
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 2.5px 8px; border-radius: 5px; font-size: 11.5px; font-weight: 500; }
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
  .autosave { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 10px; padding: 16px; box-shadow: ${t.shadow}; }
  .autosave-hd { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .autosave-icon { width: 18px; height: 18px; border-radius: 50%; background: ${t.infoBg}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: ${t.info}; }
  .autosave-title { font-size: 13px; font-weight: 600; color: ${t.textMain}; }
  .autosave-body { font-size: 12.5px; color: ${t.textMuted}; line-height: 1.5; margin-bottom: 12px; }
  .autosave-status { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: ${t.textMuted}; margin-bottom: 12px; }
  .autosave-dot { width: 6px; height: 6px; border-radius: 50%; background: ${t.success}; flex-shrink: 0; }
  .autosave-dot.saving { background: ${t.mandatory}; animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  /* ── HiringGuideBanner ── */
  .hgb { border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: opacity .2s; }
  .hgb.info-style { background: ${t.infoBg}; border: 1px solid ${isDark ? t.info + "33" : "#BFDBFE"}; }
  .hgb.surface-style { background: ${t.surface}; border: 1px solid ${t.border}; box-shadow: ${t.shadow}; }
  .hgb-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
  .hgb-flags { display: flex; align-items: center; flex-shrink: 0; }
  .hgb-flag { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid ${t.surface}; font-size: 13px; display: flex; align-items: center; justify-content: center; background: ${t.surfaceHover}; }
  .hgb-flag:nth-child(n+2) { margin-left: -6px; }
  .hgb-text { font-size: 13px; color: ${t.textMain}; line-height: 1.4; min-width: 0; }
  .hgb-link { color: ${t.info}; font-weight: 500; text-decoration: none; cursor: pointer; }
  .hgb-link:hover { text-decoration: underline; }
  .hgb-dismiss { background: none; border: none; cursor: pointer; color: ${t.textMuted}; display: flex; align-items: center; padding: 3px; border-radius: 4px; transition: color .1s, background .1s; }
  .hgb-dismiss:hover { color: ${t.textMain}; background: ${t.surfaceHover}; }
  .hgb-dismissed { opacity: .4; pointer-events: none; }

  /* ── StepperRail ── */
  .srail { display: flex; flex-direction: column; gap: 0; width: 100%; background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 10px; overflow: hidden; padding: 8px; }
  .srail-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; border-radius: 8px; transition: background .12s; }
  .srail-item.clickable { cursor: pointer; }
  .srail-item.clickable:hover { background: ${t.surfaceHover}; border-radius: 8px; }
  .srail-item.active { background: ${t.surfaceHover}; border-radius: 8px; }
  .srail-between { width: 1.5px; height: 10px; background: ${t.border}; margin: 0 0 0 23px; transition: background .15s; }
  .srail-between.done { background: ${t.primary}; }
  .srail-line-col { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .srail-circle {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
    border: 1.5px solid ${t.border}; color: ${t.textMuted}; background: ${t.surface};
    transition: all .15s;
  }
  .srail-circle.done   { background: ${t.primary}; border-color: ${t.primary}; color: ${t.btnText}; }
  .srail-circle.active { border-color: ${t.primary}; color: ${t.primary}; box-shadow: 0 0 0 3px ${t.ring}; }
  .srail-info { padding-top: 2px; }
  .srail-step-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: ${t.textMuted}; margin-bottom: 1px; }
  .srail-step-label.done-lbl   { color: ${t.success}; }
  .srail-step-label.active-lbl { color: ${t.primary}; }
  .srail-step-name { font-size: 13px; font-weight: 500; color: ${t.textMuted}; transition: color .12s; }
  .srail-step-name.active    { color: ${t.textMain}; font-weight: 600; }
  .srail-step-name.done-name { color: ${t.textMuted}; }

  /* ── ComplianceCheckCard ── */
  .cc-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 13px 16px; border: 1px solid ${t.border}; border-radius: 8px; background: ${t.surface}; transition: border-color .15s, background .15s; }
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
  .ccp-banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; background: ${t.purpleBg}; border: 1px solid ${isDark ? t.purple + "44" : "#DDD6FE"}; border-radius: 10px; }
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
  .mrc-period-btn { padding: 5px 12px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; background: transparent; border: none; cursor: pointer; color: ${t.textMuted}; transition: background .1s, color .1s; }
  .mrc-period-btn.active { background: ${t.primary}; color: ${t.btnText}; }
  .mrc-bars-wrap { position: relative; height: 120px; margin-bottom: 6px; }
  .mrc-bars { display: flex; align-items: flex-end; gap: 3px; height: 100%; }
  .mrc-bar-col { flex: 1; position: relative; height: 100%; }
  .mrc-bar { position: absolute; bottom: 0; left: 0; right: 0; border-radius: 3px 3px 0 0; background: ${t.chartBar}; transition: height .4s cubic-bezier(.4,0,.2,1), background .15s; }
  .mrc-bar.active-bar { background: ${t.chartBarActive}; }
  .mrc-bar.hover-bar  { background: ${t.chartBarHover}; }
  .mrc-bubble-wrap  { position: absolute; top: -34px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; pointer-events: none; }
  .mrc-bubble       { background: ${t.info}; color: #fff; font-size: 11.5px; font-weight: 600; font-family: 'JetBrains Mono', monospace; padding: 3px 9px; border-radius: 6px; white-space: nowrap; box-shadow: ${t.shadowMd}; }
  .mrc-bubble-arrow { width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid ${t.info}; }
  .mrc-dashed { position: absolute; top: 0; bottom: 0; left: 50%; width: 0; border-left: 1.5px dashed ${t.info}; opacity: .5; pointer-events: none; }
  .mrc-axis { display: flex; justify-content: space-between; align-items: flex-start; padding-top: 8px; border-top: 1px solid ${t.border}; }
  .mrc-axis-item { display: flex; flex-direction: column; align-items: center; gap: 1px; }
  .mrc-axis-val { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500; color: ${t.textMain}; }
  .mrc-axis-lbl { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .06em; text-transform: uppercase; color: ${t.textMuted}; }
  .mrc-note { font-size: 11.5px; color: ${t.textMuted}; margin-top: 10px; }

  /* ── Block shell ── */
  .block-shell { background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 12px; padding: 24px; box-shadow: ${t.shadow}; display: flex; flex-direction: column; gap: 20px; }
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
  .benefit-card        { border: 1px solid ${t.border}; border-radius: 10px; overflow: hidden; background: ${t.surface}; }
  .benefit-card-inner  { padding: 18px 20px; }
  .benefit-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
  .benefit-card-left   { display: flex; align-items: center; gap: 10px; }
  .benefit-icon        { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px; }
  .benefit-name        { font-size: 14px; font-weight: 600; color: ${t.textMain}; }
  .benefit-desc        { font-size: 12.5px; color: ${t.textMuted}; line-height: 1.5; margin-bottom: 12px; }
  .benefit-mandatory-banner { display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: ${t.warningBg}; border-top: 1px solid ${t.warningBorder}; }
  .benefit-mandatory-text   { font-size: 12px; color: ${t.warning}; font-weight: 500; }
  .benefit-added-bar   { display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: ${t.successBg}; border-top: 1px solid ${t.successBorder}; }
  .benefit-added-text  { font-size: 12px; color: ${t.success}; font-weight: 500; }
  .benefit-grid        { display: flex; flex-direction: column; gap: 10px; }
  .benefit-section-label { font-size: 11.5px; font-weight: 600; color: ${t.textMuted}; letter-spacing: .04em; text-transform: uppercase; font-family: 'JetBrains Mono', monospace; padding-bottom: 6px; border-bottom: 1px solid ${t.border}; margin-bottom: 2px; }

  /* ── JobDescriptionBlock ── */
  .jdb-char-count { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: ${t.textMuted}; text-align: right; margin-top: 4px; }
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
  .cb-toggle-btn    { flex: 1; padding: 8px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; background: transparent; border: none; cursor: pointer; color: ${t.textMuted}; transition: background .1s, color .1s; }
  .cb-toggle-btn.active { background: ${t.primary}; color: ${t.btnText}; }
  .cb-salary-wrap   { display: flex; align-items: center; border: 1px solid ${t.border}; border-radius: 6px; overflow: hidden; transition: border-color .12s, box-shadow .12s; }
  .cb-salary-wrap:focus-within { border-color: ${t.borderFocus}; box-shadow: 0 0 0 3px ${t.ring}; }
  .cb-currency-prefix { padding: 0 12px; height: 36px; display: flex; align-items: center; font-size: 13.5px; color: ${t.textMuted}; background: ${t.surfaceHover}; border-right: 1px solid ${t.border}; font-family: 'JetBrains Mono', monospace; }
  .cb-salary-input  { flex: 1; height: 36px; padding: 0 11px; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; color: ${t.textMain}; background: ${t.inputBg}; border: none; outline: none; }
  .cb-currency-suffix { padding: 0 12px; height: 36px; display: flex; align-items: center; font-size: 12px; font-weight: 500; color: ${t.textMuted}; background: ${t.surfaceHover}; border-left: 1px solid ${t.border}; font-family: 'JetBrains Mono', monospace; }
  .mrc-ptoggle { display: flex; border: 1px solid ${t.border}; border-radius: 6px; overflow: hidden; }
  .mrc-pbtn { padding: 4px 11px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; background: transparent; border: none; cursor: pointer; color: ${t.textMuted}; transition: background .1s, color .1s; }
  .mrc-pbtn.on { background: ${t.primary}; color: ${t.btnText}; }
  .bonus-empty { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: ${t.textMuted}; padding: 10px 0; }
  .bonus-dot { width: 6px; height: 6px; border-radius: 50%; background: ${t.textDisabled}; flex-shrink: 0; }

  /* ── Spinners / shimmer ── */
  .spin    { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; border: 1.5px solid ${isDark ? "rgba(9,9,11,.3)" : "rgba(255,255,255,.3)"}; border-top-color: ${t.btnText}; animation: sp .55s linear infinite; }
  .spin-sm { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; border: 1.5px solid ${t.border}; border-top-color: ${t.purple}; animation: sp .55s linear infinite; }
  .spin-inv { border: 1.5px solid ${t.border}; border-top-color: ${t.textMain}; }
  @keyframes sp { to { transform: rotate(360deg); } }
  .shimmer { height: 44px; border-radius: 8px; background: linear-gradient(90deg,${t.surfaceHover} 25%,${t.border} 50%,${t.surfaceHover} 75%); background-size: 200% 100%; animation: shim 1.4s infinite; }
  @keyframes shim { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`;

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
export function TextInput({ label, placeholder, value, required, disabled, error, helperText, onChange }) {
  const [v, setV] = useState(value ?? "");
  const handleChange = e => { setV(e.target.value); onChange?.(e.target.value); };
  return (
    <div className="fi">
      {label && (
        <label className="fl">
          {label}{required && <span className="req">*</span>}
        </label>
      )}
      <input
        className={error ? "err" : ""}
        placeholder={placeholder}
        value={v}
        disabled={disabled}
        onChange={handleChange}
      />
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
 * @param {function} [onChange]    - Called with the new value string.
 */
export function DropdownSelect({ label, placeholder = "Select…", options = [], value, optional, disabled, onChange }) {
  const [v, setV] = useState(value ?? "");
  const handleChange = e => { setV(e.target.value); onChange?.(e.target.value); };
  return (
    <div className="fi">
      {label && (
        <label className="fl">
          {label}
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
export function HiringGuideBanner({ country = "United States", guideUrl = "#", flags = ["🌍", "🇺🇸"], variant = "info", onDismiss }) {
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
      <button type="button" className="hgb-dismiss" onClick={handleDismiss} aria-label="Dismiss"><X /></button>
    </div>
  );
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
          <div key={num}>
            <div
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
            </div>
            {!isLast && <div className={`srail-between${isDone ? " done" : ""}`} />}
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Job scope</span>
          <SecondaryButton label="Manage job scopes" size="sm" />
        </div>
        <div className="info-box" style={{ marginBottom: 12 }}>
          <span className="info-box-icon"><Info /></span>
          <div className="info-box-text">
            <strong>Job scope guidelines</strong> — Always refer to your company as "the company". Do not include recruiting language or references to c-suite positions.{" "}
            <a href="#">Learn more</a>
          </div>
        </div>
        <DropdownSelect placeholder="Job scope template (optional)" optional
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
          <SecondaryButton
            size="sm"
            label={running ? "Running…" : "Run check"}
            icon={running ? null : <Refresh />}
            loading={running}
            disabled={running}
            onClick={runCheck}
          />
        </div>

        {running && results.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {[1, 2, 3].map(i => <div key={i} className="shimmer" />)}
          </div>
        )}

        {results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {results.map((r, i) => <ComplianceCheckCard key={i} {...r} />)}
            <div className="info-box" style={{ marginTop: 4 }}>
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

const MARKET_DATA_BLOCK = {
  annual:  { low: 30700, median: 69000, high: 123200, buckets: [18,34,52,70,88,80,66,50,36,22,14] },
  monthly: { low: 2558,  median: 5750,  high: 10267,  buckets: [16,30,50,68,86,80,64,48,34,20,12] },
};

/**
 * Full compensation section block.
 * Includes: employment-type radio group, Annual/Hourly period toggle,
 * salary input with currency prefix/suffix, live market rate histogram,
 * and an empty signing-bonus slot.
 *
 * @param {number}   [defaultSalary]         - Starting gross annual salary (default: 77293.01).
 * @param {string}   [defaultEmploymentType] - 'full' | 'part' (default: 'full').
 * @param {string}   [defaultPeriod]         - 'annual' | 'hourly' (default: 'annual').
 * @param {boolean}  [showMarketInsights]    - Show/hide market rate chart (default: true).
 * @param {string}   [country]               - Country name in helper text.
 * @param {function} [onSalaryChange]        - (value, period) => void.
 */
export function CompensationBlock({
  defaultSalary = 77293.01,
  defaultEmploymentType = "full",
  defaultPeriod = "annual",
  showMarketInsights = true,
  country = "United States",
  onSalaryChange,
}) {
  const [empType,     setEmpType]     = useState(defaultEmploymentType);
  const [salPeriod,   setSalPeriod]   = useState(defaultPeriod);
  const [salary,      setSalary]      = useState(defaultSalary);
  const [chartPeriod, setChartPeriod] = useState(defaultPeriod);
  const [animated,    setAnimated]    = useState(false);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 60);
    return () => clearTimeout(t);
  }, [chartPeriod, salary]);

  const handleSalaryChange = val => {
    setSalary(val);
    onSalaryChange?.(val, salPeriod);
  };

  const data       = MARKET_DATA_BLOCK[chartPeriod];
  const displaySal = chartPeriod === "annual" ? salary : salary / 12;
  const salPos     = Math.max(0, Math.min(1, (displaySal - data.low) / (data.high - data.low)));
  const activeBucket = Math.round(salPos * (data.buckets.length - 1));
  const maxBucket  = Math.max(...data.buckets);

  return (
    <div className="block-shell">
      {/* Employment type */}
      <div>
        <div className="block-title" style={{ marginBottom: 12 }}>Employment type</div>
        <div className="rstack">
          <RadioOption label="Full-time" selected={empType === "full"} onClick={() => setEmpType("full")} />
          <RadioOption label="Part-time" selected={empType === "part"} onClick={() => setEmpType("part")} />
        </div>
      </div>
      <div className="block-divider" />

      {/* Compensation */}
      <div>
        <div className="block-title" style={{ marginBottom: 4 }}>Compensation</div>
        <div className="fhint" style={{ marginBottom: 14 }}>
          All compensation will be awarded in US Dollar (USD). Due to compliance, contract currencies are not customizable in EOR.
        </div>
        <div className="cb-toggle-wrap" style={{ marginBottom: 12 }}>
          <button type="button" className={`cb-toggle-btn${salPeriod === "annual" ? " active" : ""}`} onClick={() => setSalPeriod("annual")}>Annual</button>
          <button type="button" className={`cb-toggle-btn${salPeriod === "hourly" ? " active" : ""}`} onClick={() => setSalPeriod("hourly")}>Hourly</button>
        </div>
        <div className="fi" style={{ marginBottom: 16 }}>
          <label className="fl">{salPeriod === "annual" ? "Gross annual base salary" : "Hourly rate"} <span className="req">*</span></label>
          <div className="cb-salary-wrap">
            <span className="cb-currency-prefix">$</span>
            <input className="cb-salary-input" type="number" value={salary}
              onChange={e => handleSalaryChange(parseFloat(e.target.value) || 0)} />
            <span className="cb-currency-suffix">USD</span>
          </div>
        </div>

        {showMarketInsights && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>Market rate insights</span>
              <div className="mrc-ptoggle">
                <button type="button" className={`mrc-pbtn${chartPeriod === "annual" ? " on" : ""}`} onClick={() => setChartPeriod("annual")}>Annual</button>
                <button type="button" className={`mrc-pbtn${chartPeriod === "monthly" ? " on" : ""}`} onClick={() => setChartPeriod("monthly")}>Monthly</button>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#71717A", marginBottom: 12 }}>
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
          </div>
        )}
      </div>
      <div className="block-divider" />

      {/* Signing bonus */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div className="block-title">Signing / retention bonus</div>
            <div className="fhint" style={{ marginTop: 2 }}>One-time payment on a specific date or as part of their first payroll.</div>
          </div>
          <SecondaryButton size="sm" label="Add" icon={<Plus />} />
        </div>
        <div className="bonus-empty"><span className="bonus-dot" /> No bonus added yet</div>
      </div>
    </div>
  );
}

const BENEFITS_DATA = [
  { id: "healthcare",   icon: "🛡️", iconBg: "#EFF6FF", name: "Healthcare",               mandatory: true,  isNew: false, desc: "Ensure the employee is covered by a healthcare option — a monthly gross allowance or a localised plan.",                                     ctaLabel: "Add Healthcare"        },
  { id: "pension",      icon: "🏦", iconBg: "#F0FDF4", name: "Pension",                   mandatory: true,  isNew: false, desc: "Comprehensive savings and pension plan for working employees to fund their retirement in the future.",                                        ctaLabel: "Add Pension"           },
  { id: "lifeinsurance",icon: "📋", iconBg: "#FFF7ED", name: "Life Insurance",             mandatory: true,  isNew: false, desc: "Provide financial security in the event of an unexpected death, allowing employees to maintain their lifestyle.",                            ctaLabel: "Add Life Insurance"    },
  { id: "travel",       icon: "✈️", iconBg: "#F5F3FF", name: "Business Travel Insurance", mandatory: false, isNew: true,  desc: "Tap into Deel's corporate travel insurance and get emergency coverage, crisis assistance, and 24/7 support.",                               ctaLabel: "Add"                   },
  { id: "coworking",    icon: "🏢", iconBg: "#FAFAFA", name: "Coworking Space Membership", mandatory: false, isNew: false, desc: "Request monthly access to WeWork. Explore available WeWork locations.",                                                                      ctaLabel: "Add"                   },
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

  const mandatory = list.filter(b => b.mandatory);
  const optional  = list.filter(b => !b.mandatory);

  return (
    <div className="block-shell">
      <div>
        <div className="block-title">Benefits and extras</div>
        <div className="block-subtitle">Configure benefits for {country}. Mandatory benefits are required by law.</div>
      </div>

      <div className="benefit-grid">
        <div className="benefit-section-label">Mandatory benefits</div>
        {mandatory.map(b => (
          <div key={b.id} className="benefit-card">
            <div className="benefit-card-inner">
              <div className="benefit-card-header">
                <div className="benefit-card-left">
                  <div className="benefit-icon" style={{ background: b.iconBg }}>{b.icon}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span className="benefit-name">{b.name}</span>
                    <StatusBadge variant="mandatory" />
                  </div>
                </div>
                {added[b.id]
                  ? <SecondaryButton size="sm" label="Added" icon={<CheckLg />} onClick={() => toggle(b.id)} />
                  : <PrimaryButton   size="sm" label={b.ctaLabel} icon={<Plus />}    onClick={() => toggle(b.id)} />}
              </div>
              <div className="benefit-desc">{b.desc}</div>
            </div>
            {!added[b.id] && (
              <div className="benefit-mandatory-banner">
                <Warning />
                <span className="benefit-mandatory-text">{b.name} is a mandatory benefit for {country}</span>
              </div>
            )}
            {added[b.id] && (
              <div className="benefit-added-bar">
                <CheckLg />
                <span className="benefit-added-text">{b.name} has been added</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="block-divider" />

      <div className="benefit-grid">
        <div className="benefit-section-label">Optional extras</div>
        {optional.map(b => (
          <div key={b.id} className="benefit-card">
            <div className="benefit-card-inner">
              <div className="benefit-card-header">
                <div className="benefit-card-left">
                  <div className="benefit-icon" style={{ background: b.iconBg }}>{b.icon}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span className="benefit-name">{b.name}</span>
                    {b.isNew && <StatusBadge variant="new" />}
                  </div>
                </div>
                {added[b.id]
                  ? <SecondaryButton size="sm" label="Added" icon={<CheckLg />} onClick={() => toggle(b.id)} />
                  : <SecondaryButton size="sm" label={b.ctaLabel} icon={<Plus />}    onClick={() => toggle(b.id)} />}
              </div>
              <div className="benefit-desc">{b.desc}</div>
            </div>
            {added[b.id] && (
              <div className="benefit-added-bar">
                <CheckLg />
                <span className="benefit-added-text">{b.name} has been added</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DOMAIN: Flows
// ═══════════════════════════════════════════════════════════════════

const FLOW_STEPS = [
  { label: "Personal details" },
  { label: "Job details" },
  { label: "Compensation and dates" },
  { label: "Benefits and extras" },
];

/**
 * Complete EOR contract creation flow.
 * Wires together all blocks (JobDescriptionBlock, CompensationBlock, BenefitsBlock)
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

  const next = () => { if (step < 4) goTo(step + 1); else onComplete?.({ step, workerName, country }); };
  const back = () => { if (step > 1) goTo(step - 1); };

  const stepContent = {
    1: (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "var(--surface, #FFF)", border: "1px solid var(--border, #E4E4E7)", borderRadius: 12, padding: "20px 24px" }}>
          <FormFieldGroup
            title="Personal details"
            columns={2}
            fields={[
              { type: "text",   label: "First name",    required: true,  placeholder: "e.g. Jane" },
              { type: "text",   label: "Last name",     required: true,  placeholder: "e.g. Smith" },
              { type: "text",   label: "Email address", required: true,  placeholder: "worker@company.com" },
              { type: "select", label: "Nationality",
                options: [
                  { value: "us", label: "United States" },
                  { value: "de", label: "Germany" },
                  { value: "gb", label: "United Kingdom" },
                  { value: "au", label: "Australia" },
                  { value: "ca", label: "Canada" },
                ]},
            ]}
          />
        </div>
        <div style={{ background: "var(--surface, #FFF)", border: "1px solid var(--border, #E4E4E7)", borderRadius: 12, padding: "20px 24px" }}>
          <FormFieldGroup
            title="Employment details"
            columns={2}
            fields={[
              { type: "text",   label: "Worker ID",         value: "EMP-2024-260", disabled: true,
                helperText: "Auto-assigned — cannot be changed" },
              { type: "text",   label: "Start date",        required: true, placeholder: "YYYY-MM-DD" },
              { type: "select", label: "Country of hiring", required: true, value: "us",
                options: [
                  { value: "us", label: "United States" },
                  { value: "de", label: "Germany" },
                  { value: "gb", label: "United Kingdom" },
                  { value: "au", label: "Australia" },
                  { value: "ca", label: "Canada" },
                ]},
              { type: "select", label: "Employment type",
                options: [
                  { value: "full", label: "Full-time" },
                  { value: "part", label: "Part-time" },
                ]},
            ]}
          />
        </div>
      </div>
    ),
    2: <JobDescriptionBlock defaultTitle="Executive Assistant" defaultSeniority="mid" />,
    3: <CompensationBlock defaultSalary={77293.01} country={country} />,
    4: <BenefitsBlock country={country} />,
  };

  return (
    <div style={{ background: "var(--bg, #FAFAFA)", fontFamily: "'Inter', sans-serif", width: "100%" }}>
      {/* Top bar */}
      {showHeader && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 28px", background: "var(--surface, #FFF)", borderBottom: "1px solid var(--border, #E4E4E7)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{headerTitle}</div>
              <div style={{ fontSize: 11.5, color: "#71717A" }}>{headerSubtitle ?? `Full-time · ${country}`}</div>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 264px", gap: 0, padding: "28px 32px 64px", alignItems: "start" }}>
        {/* Main content */}
        <div style={{ minWidth: 0, paddingRight: 28 }}>
          {stepContent[step]}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border, #E4E4E7)" }}>
            <SecondaryButton label="Back" disabled={step === 1} onClick={back} />
            <PrimaryButton label={step === 4 ? "Submit contract" : "Continue"} onClick={next} />
          </div>
        </div>

        {/* Rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "sticky", top: 20 }}>
          <StepperRail steps={FLOW_STEPS} currentStep={step} onStepClick={n => n < step && goTo(n)} />
          <AutosaveWidget status={saveStatus} lastSaved={saveStatus === "saved" ? "just now" : undefined} />
        </div>
      </div>
    </div>
  );
}
