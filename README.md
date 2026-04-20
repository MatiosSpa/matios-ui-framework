<p align="center">
  <img src="./logos/Matios-UI-logo-768w.png" alt="Matios UI Framework"/>
</p>

<h1 align="center">Matios UI Framework</h1>

<p align="center">
  Zero-dependency UI framework built with plain CSS and JavaScript.
  <br>
  Mode + accent theming, high-contrast support, live demos, and real component structure.
</p>

---

## Overview

**Matios UI Framework** is a framework-agnostic UI system for modern web applications built with **pure CSS and JavaScript**.

It is designed to be:

- **Zero dependency**
- **Easy to inspect**
- **Easy to extend**
- **Reusable in static sites, server-rendered apps, legacy systems, and custom platforms**
- **Consistent across components, demos, and documentation**

Matios UI includes:

- **60+ components**
- **278 SVG icons**
- **Mode + accent theming**
- **High-contrast mode**
- **Standalone demos per component**
- **Component-level Markdown documentation**
- **Shared utilities and showcase pages**

---

## Why Matios UI

Most UI libraries are tied to a framework, overloaded with dependencies, or difficult to adapt to real projects.

Matios UI takes a different approach:

- **No external runtime dependencies**
- **Pure CSS + JS**
- **Consistent design language**
- **Simple and inspectable folder structure**
- **Each component ships with its own CSS, JS, docs, and demo**
- **Works well in enterprise, internal tools, and custom frontends**

---

## Features

- **Zero dependencies**
- **Framework-agnostic**
- **Pure CSS and JavaScript**
- **Mode-based theming**
  - `dark`
  - `light`
  - `high-contrast`
- **Accent layer**
  - `violet`
  - `olive`
  - `blue`
- **Reusable demo shell**
- **High-contrast support**
- **Component grouping by domain**
- **Realistic showcase pages**
- **HTTP client helper**
- **Icon system**
- **Open and easy-to-read structure**

---

## Quick Start

Open `index.html` in your browser to explore the framework.

```text
matios-ui-framework/
â”œâ”€ index.html
â”œâ”€ base/
â”œâ”€ forms/
â”œâ”€ navigation/
â”œâ”€ overlays/
â”œâ”€ display/
â”œâ”€ layout/
â”œâ”€ data/
â”œâ”€ icons/
â”œâ”€ shared/
â”œâ”€ themes/
â”œâ”€ calendar/
â””â”€ apps-showcase/
```

### Minimal Usage

```html
<link rel="stylesheet" href="base/matios-ui-base.css">

<link rel="stylesheet" href="themes/matios-ui-mode-dark.css">
<link rel="stylesheet" href="themes/matios-ui-accent-violet.css">

<link rel="stylesheet" href="forms/matios-ui-input/matios-ui-input.css">
<script src="forms/matios-ui-input/matios-ui-input.js"></script>

<div id="nameInput"></div>

<script>
  new MTS.Input('#nameInput', {
    label: 'Name',
    placeholder: 'Enter your name'
  });
</script>
```

---

## Theming

Matios UI uses a **mode + accent** model.

### Modes

```html
<html data-mts-mode="dark">
<html data-mts-mode="light">
<html data-mts-mode="high-contrast">
```

### Accents

```html
<html data-mts-mode="dark" data-mts-accent="violet">
<html data-mts-mode="light" data-mts-accent="olive">
<html data-mts-mode="dark" data-mts-accent="blue">
```

### High Contrast

`high-contrast` is a complete mode by itself.

```html
<html data-mts-mode="high-contrast">
```

It does **not require an accent** to work correctly.

### Theme CSS Files

```html
<link rel="stylesheet" href="themes/matios-ui-mode-dark.css">
<link rel="stylesheet" href="themes/matios-ui-mode-light.css">
<link rel="stylesheet" href="themes/matios-ui-mode-high-contrast.css">

<link rel="stylesheet" href="themes/matios-ui-accent-violet.css">
<link rel="stylesheet" href="themes/matios-ui-accent-olive.css">
<link rel="stylesheet" href="themes/matios-ui-accent-blue.css">
```

---

## Project Structure

Every component follows the same structure:

```text
matios-ui-xxx/
â”œâ”€ matios-ui-xxx.css
â”œâ”€ matios-ui-xxx.js
â”œâ”€ matios-ui-xxx.md
â””â”€ demo.html
```

This makes the framework:

- easy to learn
- easy to debug
- easy to maintain
- easy to extend

---

## Component Groups

### Forms

- Button
- Input
- Select
- Checkbox
- Radio
- Toggle
- Slider
- TagInput
- Rating
- Date Picker
- File Upload
- Validation
- Number Input
- Phone Input
- Color Picker
- Rich Text Editor
- FormLayout
- Copy Button
- Confirm Button
- Label

### Navigation

- Tabs
- Accordion
- Breadcrumb
- Stepper
- Drawer
- Dropdown
- Pagination
- Command Palette
- Context Menu
- SideNav
- TabBar
- ScrollSpy
- Intersection Reveal

### Overlays

- Alert
- Badge
- Tooltip
- Modal
- Popover
- Toast
- Progress
- Skeleton
- Spinner
- Lightbox

### Display

- Avatar
- Card
- KPI Card
- Empty State
- Timeline
- Kanban
- Sortable List
- Countdown
- Rating Review
- Tree
- Image Gallery
- Virtual List
- Splitter

### Layout

- Grid
- ScrollSpy
- Intersection Reveal
- Splitter

### Data

- Table
- Infinite utilities
- data-oriented demos and helpers

### Shared

- HttpClient
- shared demo support

### Icons

- **278 icons**
- outline / filled
- semantic colors
- size variants
- animation support

Example:

```html
<i class="mts-icon mts-icon-trash"></i>
<i class="mts-icon mts-icon-trash mts-icon--filled mts-icon--danger"></i>
<i class="mts-icon mts-icon-loader mts-icon--spin"></i>
```

### Themes

- mode switching
- accent switching
- high-contrast preview
- CSS variable inspection

### Calendar

- calendar demos
- schedule-oriented UI examples

### Showcase

- higher-level demo pages
- more realistic app-like screens
- shell validation for components in context

---

## Showcase Screens

The `apps-showcase/` module is evolving into a catalog of complete user interfaces built with Matios UI components.

Rules for showcase screens:

- build inside `apps-showcase/`
- organize screens by group using `apps-showcase/<group>/<screen>/`
- use Matios UI components first
- avoid ad-hoc visual inventions
- document every screen as the catalog grows
- keep a group index before growing individual screens
- when a screen is not implemented yet, keep a visible `In construction` placeholder from the showcase index

### Authentication

File: `apps-showcase/index.html`

Initial screens in the group:

- `login`
- `forgot-password`
- `reset-password`
- `verify-email`
- `workspace-selector`
- `session-expired`
- `access-denied`
- `accept-invitation`

#### `login`

File: `apps-showcase/login/login/index.html`

Purpose:

- unified access screen for `email`, `username`, or `phone`
- supports `password` and `OTP` modes in the same UI
- demonstrates conditional rendering using existing Matios UI components

Components used:

- `MTS.Input`
- `MTS.Toggle`
- `MTS.Checkbox`
- `MTS.Button`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- password access
- OTP request
- loading
- inline validation
- informational success feedback

#### `forgot-password`

File: `apps-showcase/login/forgot-password/index.html`

Purpose:

- request account recovery from a single identity field
- simulate recovery link delivery without backend behavior
- keep the flow aligned with `login` and the future `reset-password`

Components used:

- `MTS.Input`
- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- empty validation
- loading while preparing the recovery link
- success feedback with destination confirmation
- return path back to `login`

#### `reset-password`

File: `apps-showcase/login/reset-password/index.html`

Purpose:

- define a new password after the recovery step
- validate the new password and confirmation inline
- represent the final step before returning to `login`

Components used:

- `MTS.Input`
- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- empty validation
- password rule validation
- confirmation mismatch validation
- loading while saving the new password
- success feedback for the end of the recovery flow

#### `verify-email`

File: `apps-showcase/login/verify-email/index.html`

Purpose:

- represent the pending email verification state after signup or invitation
- allow resending the verification email in a clear way
- keep a direct path back to `login`

Components used:

- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- pending verification
- resend loading
- informational confirmation after resending
- return path back to `login`

#### `workspace-selector`

File: `apps-showcase/login/workspace-selector/index.html`

Purpose:

- choose the right organization or workspace after authentication
- summarize role, environment, and membership in a single selection step
- simulate continuity toward the next app context without backend behavior

Components used:

- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- default preselected workspace
- switching active workspace visually
- CTA label updated from the current selection
- informational confirmation for the chosen workspace

#### `session-expired`

File: `apps-showcase/login/session-expired/index.html`

Purpose:

- explain clearly when a session has been closed for security reasons
- offer a controlled re-entry path without confusion
- represent an interruption state with calm, explicit messaging

Components used:

- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- initial warning state
- loading while preparing re-entry
- success feedback before returning to `login`
- return path back to the group and to `login`

#### `access-denied`

File: `apps-showcase/login/access-denied/index.html`

Purpose:

- explain when an authenticated user cannot continue because the current context lacks permissions
- reduce confusion with a calm message and a clear next step
- route the user back to login or to a different company context

Components used:

- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- initial denied state
- informational redirect toward context change
- return path back to `login`
- return path toward a different active company context

#### `accept-invitation`

File: `apps-showcase/login/accept-invitation/index.html`

Purpose:

- guide a newly invited user into an existing company context
- summarize company, effective role, and included profiles before acceptance
- simulate the confirmation step before joining the platform

Components used:

- `MTS.Input`
- `MTS.Checkbox`
- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- required-name validation
- invitation confirmation validation
- loading while accepting the invitation
- success feedback after joining the company context

### Onboarding

Initial screens in the group:

- `signup-basic`
- `signup-with-company`
- `invite-team`
- `onboarding-complete`

#### `signup-basic`

File: `apps-showcase/onboarding/signup-basic/index.html`

Purpose:

- create a personal account with minimal data
- support single-company products or invitation-based flows
- keep the initial account creation fast and clean

Components used:

- `MTS.Input`
- `MTS.Checkbox`
- `MTS.Button`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- required field validation
- password confirmation validation
- loading while creating the account
- success feedback for the new personal account

#### `signup-with-company`

File: `apps-showcase/onboarding/signup-with-company/index.html`

Purpose:

- create a personal account and the first company in a single public flow
- support multi-company onboarding from the start
- capture the basic organization context together with the admin user

Components used:

- `MTS.Input`
- `MTS.Select`
- `MTS.Checkbox`
- `MTS.Button`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- personal data validation
- company data validation
- password validation
- loading while creating the first company
- success feedback with account and company summary

#### `invite-team`

File: `apps-showcase/onboarding/invite-team/index.html`

Purpose:

- invite the initial team right after creating the account or first company
- assign a default access package before the first login
- keep onboarding moving even if invitations are sent later

Components used:

- `MTS.TagInput`
- `MTS.Select`
- `MTS.Input`
- `MTS.Checkbox`
- `MTS.Button`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- validation for empty invitation batch
- validation for invalid email entries
- validation for missing default role
- loading while preparing the invitation batch
- success feedback with invitation summary

#### `onboarding-complete`

File: `apps-showcase/onboarding/onboarding-complete/index.html`

Purpose:

- close the initial onboarding with a clear success state
- summarize the account, company, and team setup already prepared
- route the user toward login or the next operational step

Components used:

- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- success completion banner
- account/company/team summary cards
- next-step CTA toward login
- alternate CTA toward team invitations

### Support

Initial screens in the group:

- `ticket-inbox`
- `ticket-detail`
- `ticket-resolution`

#### `ticket-inbox`

File: `apps-showcase/support/ticket-inbox/index.html`

Purpose:

- centralize first-line support triage in a single operational view
- filter tickets by query, owner, and status without leaving the inbox
- open the case detail or simulate quick reassignment directly from the list

Components used:

- `MTS.Input`
- `MTS.Select`
- `MTS.Button`
- `MTS.Alert`
- `MTS.Card`
- `MTS.Icon`

States covered:

- query filtering
- owner and status filtering
- empty state when no tickets match
- quick reassignment feedback
- route toward the ticket detail view

#### `ticket-detail`

File: `apps-showcase/support/ticket-detail/index.html`

Purpose:

- show the active case context, ownership, and next action in a single screen
- let the analyst update owner, status, and response draft
- keep the timeline of events visible while progressing the case

Components used:

- `MTS.Input`
- `MTS.Select`
- `MTS.Button`
- `MTS.Alert`
- `MTS.Card`
- `MTS.Timeline`
- `MTS.Icon`

States covered:

- initial SLA warning
- response validation before save
- success feedback after simulated update
- timeline rendering for case activity
- return path back to the inbox

#### `ticket-resolution`

File: `apps-showcase/support/ticket-resolution/index.html`

Purpose:

- close the case with a final reason, resolution summary, and customer-facing message
- keep support closure visible in a single reusable screen without relying on tables
- make the final state traceable before the team leaves the support flow
- give products a ready-made pattern for operational case closure

Components used:

- `MTS.Input`
- `MTS.Select`
- `MTS.Button`
- `MTS.Alert`
- `MTS.Card`
- `MTS.Icon`

States covered:

- final-status selection
- resolution reason selection
- validation for summary and customer message
- success feedback after closure
- return path back to ticket detail

### Productivity

Initial screens in the group:

- `task-board`
- `calendar-planner`
- `task-detail`

#### `task-board`

File: `apps-showcase/productivity/task-board/index.html`

Purpose:

- organize daily execution by task status instead of by date
- combine quick KPIs, filters, and a kanban board in one operational screen
- let the team review movement, priorities, and ownership without opening a second module
- allow task creation from the board and enrich the card through a modal workflow

Components used:

- `MTS.Input`
- `MTS.Select`
- `MTS.Button`
- `MTS.Alert`
- `MTS.KPICard`
- `MTS.Kanban`
- `MTS.Icon`

States covered:

- query filtering
- owner and priority filtering
- empty filtered state
- simulated card movement feedback
- card selection feedback from the board
- task creation and edit modal flow

#### `calendar-planner`

File: `apps-showcase/productivity/calendar-planner/index.html`

Purpose:

- organize work by time using `MTS.Calendar` in `schedule` mode as the center of the screen
- combine agenda visibility with summary cards and KPI indicators
- let the team jump between the weekly planner and the task board naturally
- support event creation and editing through modal forms

Components used:

- `MTS.Button`
- `MTS.Alert`
- `MTS.Card`
- `MTS.KPICard`
- `MTS.Calendar`
- `MTS.Icon`

States covered:

- agenda planner initialization
- route to today
- event click feedback
- event creation modal
- event edit modal
- side summary of near-term work

#### `task-detail`

File: `apps-showcase/productivity/task-detail/index.html`

Purpose:

- expand a task into a focused operational detail view
- combine priority, owner, state, and checklist in a single screen
- connect execution detail with the planner context without forcing a dashboard
- provide a clean reusable base for task editing outside the board

Components used:

- `MTS.Input`
- `MTS.Select`
- `MTS.Checkbox`
- `MTS.Button`
- `MTS.Alert`
- `MTS.Card`
- `MTS.Icon`

States covered:

- validation for title and description
- checklist rendering
- context card and planner relation summary
- success feedback after saving
- return path back to the task board

### Account

Initial screens in the group:

- `profile-overview`
- `security-settings`

#### `profile-overview`

File: `apps-showcase/account/profile-overview/index.html`

Purpose:

- centralize the base personal data the user edits most often
- expose language, timezone, and date format without sending the user into advanced settings
- keep notification preferences close to the profile itself
- reflect the active company and access context as part of the account view

Components used:

- `MTS.Avatar`
- `MTS.Input`
- `MTS.Select`
- `MTS.Checkbox`
- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- profile validation for required fields
- reset flow to the sample baseline
- success feedback after save
- visible summary of active workspace context

#### `security-settings`

File: `apps-showcase/account/security-settings/index.html`

Purpose:

- keep password change and personal access controls in one operational screen
- make second-factor and login alert controls visible without leaving the account group
- expose a clean path for closing other active sessions
- provide a reusable base for personal security flows across products

Components used:

- `MTS.Input`
- `MTS.Toggle`
- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- password validation
- mismatch handling for confirmation
- session close feedback
- success feedback after saving security controls

### Settings

Initial screens in the group:

- `workspace-settings`
- `security-policies`

#### `workspace-settings`

File: `apps-showcase/settings/workspace-settings/index.html`

Purpose:

- centralize the general configuration of the active workspace
- expose name, slug, language, timezone, and weekly defaults in one reusable screen
- keep operational toggles close to the main workspace identity
- provide a simple base for products that need settings before deeper administration modules

Components used:

- `MTS.Input`
- `MTS.Select`
- `MTS.Toggle`
- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- required-field validation
- invalid slug handling
- invalid support email handling
- reset flow back to workspace baseline
- success feedback after save

#### `security-policies`

File: `apps-showcase/settings/security-policies/index.html`

Purpose:

- define shared session and credential rules for the workspace
- keep OTP, login alerts, and device verification in the same operational view
- expose password minimums and lockout thresholds without needing a table-driven admin module
- provide a reusable policy screen for products that need workspace-level security controls early

Components used:

- `MTS.Input`
- `MTS.Select`
- `MTS.Toggle`
- `MTS.Button`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- validation for password minimum
- validation for failed-attempt threshold
- reset flow back to baseline policies
- success feedback after saving policies

### Notifications

Initial screens in the group:

- `notification-center`
- `activity-feed`

#### `notification-center`

File: `apps-showcase/notifications/notification-center/index.html`

Purpose:

- centralize product alerts, mentions, and operational notices in one reusable screen
- keep quick filtering and read-state actions visible without needing a table
- let products reuse a notification tray that already includes prioritization and archive actions
- expose a clean pattern for alert density and badge-based emphasis

Components used:

- `MTS.Input`
- `MTS.Button`
- `MTS.Badge`
- `MTS.Card`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- search filtering
- unread-only filtering
- critical-only filtering
- mark-all-as-read flow
- archive feedback
- empty filtered state

#### `activity-feed`

File: `apps-showcase/notifications/activity-feed/index.html`

Purpose:

- show chronological activity across modules without forcing a dashboard
- connect support, settings, onboarding, and productivity events in a single timeline
- provide a reusable pattern for “what changed recently” views
- keep a direct path back to the notification center for action-focused follow-up

Components used:

- `MTS.Button`
- `MTS.Card`
- `MTS.Timeline`
- `MTS.Alert`
- `MTS.Icon`

States covered:

- timeline rendering
- refresh feedback
- summary card of recent events
- direct route back to notification center

---

## Documentation Strategy

Matios UI is not just a list of components.

Each component includes:

- a **standalone demo**
- a **Markdown documentation file**
- real **HTML / JavaScript examples**
- a **consistent preview structure**

That makes the repo useful both as a framework and as a living reference library.

---

## Design Principles

Matios UI is being shaped around these principles:

- **Use Matios components first**
- **Avoid fake demo-only UI when a real component already exists**
- **Keep demos visually consistent**
- **Keep helpers minimal**
- **Respect naming and grouping**
- **Prefer clarity over cleverness**
- **Keep the source easy to inspect**

---

## Accessibility Direction

Matios UI includes a dedicated **high-contrast mode** and continues moving toward stronger accessibility consistency through:

- visible focus states
- stronger contrast handling
- semantic colors
- clearer interaction states
- reusable theme variables

---

## Events and Integration

Components can emit events using the `mts:*` namespace pattern.

```javascript
document.getElementById('my-calendar')
  .addEventListener('mts:calendar:eventDrop', function (e) {
    console.log(e.detail);
  });
```

Because Matios UI is framework-agnostic, it can be used in:

- static HTML projects
- server-rendered apps
- legacy enterprise apps
- custom JavaScript apps
- microfrontend environments

---

## Current Status

Matios UI is already in a strong state:

- coherent framework structure
- more consistent demos
- consolidated mode/accent theming
- integrated high-contrast mode
- strong open-source baseline

This is no longer just a prototype.  
It is a real framework with its own technical and visual identity.

---

## Recommended Entry Points

- `index.html` â†’ main framework shell
- `themes/demo.html` â†’ theming preview
- `icons/demo.html` â†’ icon system
- group `demo.html` files â†’ grouped navigation
- per-component `demo.html` files â†’ isolated examples

---

## License / Usage

Use it, inspect it, adapt it, and build on top of it.

Matios UI Framework is being built to be practical, understandable, and genuinely reusable.

---

<p align="center">
  <strong>Matios UI Framework</strong><br>
  Pure CSS. Pure JavaScript. Real structure.
</p>

