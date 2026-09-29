# SUTRADHAR Frontend Prototype – Build Plan

## A. What Already Exists

### Infrastructure
- **Vite + React 19 + TypeScript + Tailwind v4** fully configured
- **Dependencies installed**: @xyflow/react, framer-motion, recharts, lucide-react, clsx, react-router-dom
- **Linting**: oxlint configured
- **CSS**: Tailwind v4 `@theme` tokens for navy, saffron, verified, warning, danger palettes; animations (shimmer, pulse-ring, flow-dash, float-up, data-packet); glass-card, qr-placeholder classes

### Pages (10 pages, ~2200 lines)
| Page | Status | Notes |
|------|--------|-------|
| Login | ✅ Working | OTP-based, role selector, SSO handshake animation |
| CitizenDashboard | ⚠️ Has TS errors | Uses undefined `Card`, `Badge`, `Progress`, `StatusChip`, `VerifiedTick`, `SectionHeader` from ui |
| ApplyOnce | ⚠️ Has TS errors | 4-step wizard, uses undefined `Button`, `Card`, `Badge`, `Modal`, imports `submitApplication` |
| CaseTracker | ✅ Mostly working | 7-stage timeline with SLA chip, QR placeholder |
| FactExchange | ⚠️ Has TS errors | Verified facts grid with protocol badges, identity mapping |
| OfficerConsole | ✅ Working | Queue with SLA, approve action |
| ReferralMap | ⚠️ Has TS errors | React Flow with dept nodes, side panel |
| AdminCommandCenter | ⚠️ Has TS errors | KPIs, recharts, exceptions queue, adapter health |
| AuditTrail | ⚠️ Has TS errors | Filterable table, live entries, hash display |
| BeforeAfter | ⚠️ Has TS errors | Animated counters, split-screen comparison |

### Components
- `Navbar` – top bar with role switcher, language toggle, nav links, prototype pill
- `DemoControls` – floating demo panel with keyboard shortcuts (D, N, R, A, H)
- `ui/index.tsx` – **only ToastContainer exists**; many components referenced but not defined: `Card`, `Badge`, `Button`, `KPICard`, `Modal`, `Progress`, `StatusChip`, `VerifiedTick`, `HealthDot`, `ProtocolBadge`, `SectionHeader`

### State Management
- `AppContext` – useReducer with role, language, login, demo state, apply wizard step, retry phase, officer approvals, consents, toasts, audit count

### Data
- `mockData.ts` – rich synthetic data: citizen profile (Rohan Patil), verified facts (4), case stages (7), audit entries (10), dept nodes (8), officer queue (3), consent items (4), recharts data, KPIs, demo steps

### Hooks
- `useDemoMode` – keyboard shortcuts, auto-play timer (9s per step), goNext/reset/goTo
- `useSimApi` – simulated API calls (submitApplication, fetchVerifiedFacts, simulateSoapTimeout, etc.)

### Current Build Status
- **16 TypeScript errors** (unused imports, missing component exports, type mismatches)
- Build fails

## B. Gap Analysis vs Prompt Requirements

### Critical Gaps (P0)
1. **Simulation Engine (`src/sim/`)** – Does not exist. Need types, seed, engine, store, scenarios
2. **UI Component Library** – `Card`, `Badge`, `Button`, `KPICard`, `Progress`, `StatusChip`, `VerifiedTick`, `HealthDot`, `ProtocolBadge`, `SectionHeader`, `Modal`, `Tabs`, `Drawer`, `Table`, `Stat`, `Sparkline`, `JsonView` are all missing
3. **Persona mismatch** – Current persona is Rohan Patil (Nashik), prompt requires Riya Deshmukh (Nagpur, 19, engineering student)
4. **Case ID mismatch** – Current: `SUT-2026-004821`, prompt: `SUT-MH-2026-000481`
5. **Consent Manager** – No dedicated screen; consent is inline in wizard only
6. **Case Passport (`/case/:id`)** – No dedicated route; CaseTracker exists but lacks tabs (Timeline, Verified Facts, Documents, Consents, Audit)
7. **Workflow Orchestration Map** – ReferralMap exists but lacks animated packet dots, node state changes, side drawer on click, smart referral animation, "Live" pulse
8. **Officer Inbox + Case Review** – OfficerConsole exists but lacks proper review page with eligibility checklist, Ask for Info, Reject (reason), Refer actions
9. **Demo Controller** – DemoControls exists but lacks: speed control (0.5x-4x), "Start scholarship journey", "Trigger Revenue outage", presentation mode with captions, auto-role/route switching
10. **i18n** – No `src/i18n/` directory; language toggle exists but translations are inline
11. **Build fails** – 16 TS errors

### P1 Gaps
12. **Adapter and Connector Health** – No dedicated screen; partial adapter info in AdminCommandCenter
13. **Identity Mapping and Data Quality** – No dedicated screen; partial identity mapping in FactExchange
14. **Audit Explorer** – AuditTrail exists but lacks expandable rows, payload diff, Export CSV
15. **Notifications** – No bell dropdown, no SMS/WhatsApp preview panel
16. **Hindi language** – Only English and Marathi; prompt asks for English, Hindi, and Marathi

### Design/UX Gaps
17. **Left sidebar layout** – Current uses top-bar-only; prompt requests role-specific left sidebar
18. **Empty/loading/error states** – Not implemented anywhere
19. **prefers-reduced-motion** – Not respected
20. **Mobile responsive citizen flow** – Not tested

## C. Phase Plan

### Phase 1: Foundation (Fix build + UI primitives + i18n + sim engine)
- [ ] Fix all 16 TS errors to get build passing
- [ ] Create all missing UI components in `src/components/ui/`
- [ ] Create `src/i18n/` with en.ts, hi.ts, mr.ts dictionaries
- [ ] Create `src/sim/types.ts` with the full data model
- [ ] Create `src/sim/seed.ts` with Riya Deshmukh persona and deterministic data
- [ ] Create `src/sim/engine.ts` with event-driven simulation engine
- [ ] Create `src/sim/store.tsx` with React Context + localStorage persistence
- [ ] Create `src/sim/scenarios.ts` with scholarshipHappyPath and revenueOutage
- [ ] Update layout to include role-specific left sidebar
- [ ] Add `prefers-reduced-motion` support
- [ ] `npm run build` + `npm run lint` must pass

### Phase 2: Citizen Core (Login + Home + Wizard + Consent + Case Passport)
- [ ] Update Login to use SSO card pattern with 3 role cards + handshake animation
- [ ] Update persona to Riya Deshmukh everywhere
- [ ] Update CitizenDashboard with active cases, quick services, notification bell
- [ ] Enhance ApplyOnce wizard with "0 docs, 3 verified facts" animation
- [ ] Create Consent Manager screen (`/citizen/consent`)
- [ ] Create Case Passport (`/case/:id`) with tabs: Timeline, Verified Facts, Documents, Consents, Audit
- [ ] `npm run build` + `npm run lint` must pass

### Phase 3: Orchestration (Workflow + Officer + Notifications)
- [ ] Rebuild Workflow Orchestration Map with animated packets, node states, side drawer
- [ ] Smart Referral: dashed edge Education→Social Justice with toast
- [ ] Create Officer Inbox with SLA chips, priority, department filter
- [ ] Create Officer Review page with verified facts, eligibility checklist, Approve/Reject/Ask/Refer
- [ ] Create Notifications bell dropdown + SMS/WhatsApp preview panel
- [ ] All actions drive the sim engine
- [ ] `npm run build` + `npm run lint` must pass

### Phase 4: Admin & Resilience
- [ ] Enhance Admin Command Center with live feed from event bus
- [ ] Create Adapter & Connector Health screen with sparklines, retry timeline, circuit breaker
- [ ] Build outage story (Revenue adapter): retries → circuit breaker → escalation → recovery
- [ ] Exception Queue with manual retry/escalate
- [ ] `npm run build` + `npm run lint` must pass

### Phase 5: Data & Impact
- [ ] Create Identity Mapping & Data Quality screen
- [ ] Side-by-side XML vs JSON viewer (hand-built)
- [ ] Enhance Audit Explorer with expandable rows, payload diff, Export CSV
- [ ] Enhance Before vs After page with animated comparison
- [ ] `npm run build` + `npm run lint` must pass

### Phase 6: Demo Mode
- [ ] Rebuild Demo Controller with speed control, scenario buttons
- [ ] Build auto-play "Presentation mode" following the 3-minute timeline
- [ ] Lower-third captions for each moment
- [ ] Auto role/route switching
- [ ] Reset restores seed state
- [ ] `npm run build` + `npm run lint` must pass

### Phase 7: Polish & QA
- [ ] Empty, loading, error states everywhere
- [ ] Mobile responsive citizen flow
- [ ] Tablet layout check
- [ ] Update README.md
- [ ] Final build check

## D. Assumptions
1. The existing Login (with OTP flow) already has SSO-like card selection; will enhance it with the 3-card layout and handshake animation per spec
2. Will change persona from Rohan Patil to Riya Deshmukh throughout seed data
3. `officer-revenue` and `officer-education` roles exist; will keep both and add `officer-social-justice` and `officer-treasury` as needed
4. The on-disk version of files differs from what was initially shown by the research agent — there appear to be two versions; will work with the on-disk versions and fix/enhance them
5. Will use Tailwind v4's `@theme` for design tokens, not adding any new CSS preprocessors
6. Hindi translations will be approximated using standard Hindi government terminology
7. "Hash-chained" audit will use a simple browser-side hash function, labeled as "simulated"
8. The SLA compressed clock (1 second = 1 simulated hour) is for the sim engine only
9. Will not add new npm dependencies — sparklines, QR patterns, JSON viewer, toasts all hand-built
10. `tsconfig.app.json` on disk has `"strict": true` in one version and not in another; will ensure strict mode
