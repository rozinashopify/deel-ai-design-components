# Deel AI Design Foundation

A React component library for building EOR (Employer of Record) contract creation flows, with integrated AI-driven compliance checking and market intelligence.

## Overview

This library provides a complete set of UI components organized from foundational primitives to fully orchestrated multi-step flows. Components are developed in **waves**, where each wave builds on the previous layer of complexity:

```
Atoms → Molecules → Blocks → Flows → Overlays
```

The library includes a light/dark mode design token system, an interactive playground, and inline code generation for each component.

## Tech Stack

- **React** 18.3.1
- **Vite** 6.2.0
- **CSS**: Inline styles driven by a design token system
- **Fonts**: Inter (UI), JetBrains Mono (code/branding)

## Getting Started

```bash
npm install
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Project Structure

```
/
├── ComponentLibrary.jsx      # Core component exports and design tokens
├── Index.jsx                 # Interactive playground and documentation
├── Deel_Atoms_Wave1.jsx      # Wave 1: Foundational UI primitives
├── Deel_Molecules_Wave2.jsx  # Wave 2: Composed form controls
├── Deel_AIMolecules_Wave3.jsx # Wave 3: AI-powered components
├── Deel_Blocks_Wave4.jsx     # Wave 4: Full-featured form sections
├── Deel_Flow_Wave5.jsx       # Wave 5: Multi-step orchestration flows
├── main.jsx                  # React entry point
├── index.html                # HTML host
└── vite.config.js            # Vite configuration
```

## Component Waves

### Wave 1: Atoms
Foundational UI primitives used across all other components.

| Component | Description |
|-----------|-------------|
| `TextInput` | Text field with label, helper, error, and disabled states |
| `DateInput` | Date picker input |
| `DropdownSelect` | Single-select dropdown |
| `RadioOption` | Radio button with label |
| `ToggleRow` | Toggle switch with label |
| `InfoRow` | Read-only labeled value row |
| `SegmentedControl` | Segmented button group |
| `Icon` | Icon component |
| `SectionCard` | Layout card with optional heading |
| `PrimaryButton` / `SecondaryButton` / `TextButton` | Button variants |
| `StatusBadge` | Status indicator badge |

### Wave 2: Molecules
Composed form controls and utility widgets.

| Component | Description |
|-----------|-------------|
| `FormFieldGroup` | Grouped set of form fields |
| `AutosaveWidget` | Autosave status indicator |
| `ContextBanner` | Contextual information banners (5 variants) |
| `HiringGuideBanner` | Hiring guidance callout |
| `SelectList` | Selectable list of items |
| `RichDropdownSelect` | Searchable dropdown with rich item rendering |
| `StepperRail` | Multi-step navigation indicator |

### Wave 3: AI Molecules
Intelligence-driven components with compliance and market data.

| Component | Description |
|-----------|-------------|
| `ComplianceCheckCard` | Single AI compliance check result |
| `ComplianceCheckPanel` | Panel grouping multiple compliance checks |
| `MarketRateChart` | Animated salary histogram with market benchmarking |
| `CountryPolicyCard` | Country-specific statutory policy display |

### Wave 4: Blocks
Full-featured form sections that compose multiple atoms and molecules.

| Component | Description |
|-----------|-------------|
| `JobDescriptionBlock` | Job title, scope, and AI compliance section |
| `CompensationBlock` | 10-section block covering employment type, salary, work schedule, benefits, terms, time off, and notice |
| `BenefitsBlock` | Country-aware mandatory and optional benefits |
| `AddPersonBlock` | First-step person entry form |

### Wave 5: Flows
Multi-step orchestration flows combining blocks into complete workflows.

| Component | Description |
|-----------|-------------|
| `EORContractCreationFlow` | 4-step EOR contract creation with StepperRail and AutosaveWidget, fully responsive via container queries |

### Wave 6: Overlays
Modal and overlay components.

| Component | Description |
|-----------|-------------|
| `Modal` | Generic overlay with backdrop using React Portal |
| `CollapsibleItem` | Expandable card rows |
| `ManageJobScopesModal` | Template browser modal |

## Design System

### Tokens
All visual properties are managed through a unified design token system that supports both light and dark modes. Tokens cover:

- Colors (with HSL transformation utilities and contrast calculations)
- Typography (scale, weight, line-height)
- Shadows and elevation
- Spacing

### Theming
An `appearance` prop on `ComponentLibrary` allows token overrides for custom theming.

### CSS
Styles are generated at runtime via `makeLibraryCSS()`, which produces all component styles from the current token set.

## Interactive Playground

`Index.jsx` provides a full documentation and preview environment:

- Live rendered component previews
- Prop editor for each component
- Syntax-highlighted code examples showing component usage
- Navigation across all waves and components

## Component Manifest

Every component in `ComponentLibrary.jsx` is documented with:

- Domain categorization
- Tier (atom / molecule / block / flow)
- Description and prop API
- Usage examples
- Composition graph

## Repository

```
https://github.com/rozinashopify/deel-ai-design-components.git
```
