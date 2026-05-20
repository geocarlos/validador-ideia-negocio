# Product Requirements Document (PRD)
## Validador de Ideia de Negócio - Versão 3 Avançado

**Version:** 1.0  
**Date:** 2026-05-19  
**Status:** Ready for Implementation (Phase 0)  
**Target Release:** End of Phase 7  

---

## 1. Vision & Problem Statement

### Problem
Entrepreneurs and startup founders spend significant time and money seeking feedback on their business ideas. Early-stage validation is often slow (consultants take weeks), expensive ($500–2000 per consultation), and biased (limited perspectives). Without structured analysis across multiple dimensions (market, technical, financial), founders risk pursuing non-viable ideas or missing critical constraints.

### Solution
A multi-agent AI system that provides **instant, structured analysis** of business ideas across three specialized dimensions:
- **Market Analysis:** Problem-to-solve, target audience, market size, competition, differentiation
- **Technical Viability:** Stack requirements, complexity level, IA integration points, technical limitations, MVP timeline
- **Financial Feasibility:** Revenue model, operational costs (especially IA), financial viability score, next validation steps

### Why IA is Essential
The product **does not exist without IA**. The core value is:
1. **Speed:** Analysis in 10 seconds vs. weeks of consulting
2. **Breadth:** Three specialized agents analyze in parallel, each from a different angle
3. **Accessibility:** Founder gets professional-grade analysis at zero cost
4. **Consistency:** Same criteria applied to every idea; no subjective consultant bias

---

## 2. Target Users & Use Cases

### Primary User Persona
- **Name:** Sofia (Entrepreneur/Founder)
- **Age:** 25–45
- **Background:** Early-stage startup founder, career-changer, or side-project validation
- **Pain Point:** Needs rapid feedback before investing time/money; cannot afford consultants
- **Goal:** Validate business idea in < 5 minutes; compare multiple idea variants

### Use Cases

**UC1: First-Time Validation**
- Sofia has a rough business idea
- She logs in, describes the idea in 200+ words
- System returns analysis across market, tech, financial dimensions
- She reads the report, identifies the most critical risks, and decides to pivot or double down

**UC2: Idea Comparison**
- Sofia has 3 competing ideas
- She validates each one separately
- She reviews the history view, comparing scores and recommendations
- She shares the analysis with a co-founder (future enhancement: export as PDF)

**UC3: Feedback Loop**
- Sofia gets initial analysis, incorporates feedback, and refines her idea
- She re-validates the updated idea weeks later
- She compares the two analyses to see improvement in viability scores

---

## 3. Core Features & Acceptance Criteria

### Feature 1: User Authentication
**Description:** Users can log in with an email address to access the platform and protect their analysis history.

**Acceptance Criteria:**
- [ ] User can enter email on login page
- [ ] Valid JWT token is generated and stored in localStorage
- [ ] Token expires after 7 days of inactivity
- [ ] Unauthenticated users cannot access `/dashboard` (redirected to login)
- [ ] API endpoints reject requests without valid token (401 Unauthorized)

**User Story:** As a user, I want to securely access my idea history so that my analyses remain private and persistent.

---

### Feature 2: Idea Submission & Multi-Agent Analysis
**Description:** Authenticated users submit a business idea. Three specialized agents (Market, Technical, Financial) analyze it in parallel and return structured JSON responses.

**Acceptance Criteria:**
- [ ] Frontend form accepts idea description (min. 100 characters)
- [ ] Form validates input and shows clear error messages
- [ ] `POST /api/validar` accepts JSON with `{ ideia: string }`
- [ ] Backend orchestrator spawns 3 agents in parallel using Promise.all()
- [ ] Each agent calls OpenAI API with specialized prompt (Merchant, Technical, Financial)
- [ ] API consolidates responses into single JSON object within 15 seconds
- [ ] If 1–2 agents fail, response returns 200 with partial results + error field
- [ ] Response includes timestamp, userId, ideaHash, and consolidated analysis
- [ ] Frontend displays results in dashboard with clear visual hierarchy

**User Story:** As a founder, I want to submit my idea and receive analysis across market, technical, and financial dimensions so that I can make an informed decision about feasibility.

---

### Feature 3: Dashboard Display
**Description:** Analysis results are displayed in an organized, visually-clear dashboard with scores, key findings, and recommendations.

**Acceptance Criteria:**
- [ ] Dashboard displays all three agent analyses side-by-side
- [ ] Each agent section shows JSON fields in human-readable format
- [ ] Color coding indicates viability scores (green=alta, yellow=media, red=baixa)
- [ ] User can see key recommendations from each agent
- [ ] Display is responsive (mobile, tablet, desktop)
- [ ] User can click to expand/collapse each agent's full response
- [ ] Loading indicator shown while agents process (max 15 seconds)

**User Story:** As a user, I want to see the analysis results in a clear, organized format so that I can quickly understand the key findings and next steps.

---

### Feature 4: History & Persistence
**Description:** All validations are persisted in SQLite and displayed in a history view, allowing users to compare and revisit past analyses.

**Acceptance Criteria:**
- [ ] Each validation is stored in database with userId, ideaText, timestamp, and all agent responses
- [ ] History view lists all past validations, newest first
- [ ] User can click to view full analysis of any past validation
- [ ] User can delete individual validations
- [ ] User can clear all history with confirmation dialog
- [ ] Search/filter by idea text (case-insensitive substring match)
- [ ] History persists across sessions and multiple devices (same email)

**User Story:** As a recurring user, I want to access my analysis history so that I can compare ideas, track improvement, and revisit recommendations.

---

### Feature 5: Error Handling & Resilience
**Description:** Graceful handling of API failures, timeouts, and invalid responses.

**Acceptance Criteria:**
- [ ] Network timeout shows user-friendly error message (not JSON dump)
- [ ] Invalid OpenAI API response (non-JSON, malformed) shows error field in consolidation
- [ ] If 3/3 agents fail, API returns 200 with error state (not 500)
- [ ] Rate limit (OpenAI quota exceeded) shows clear message with wait suggestion
- [ ] Database errors logged but do not block response (returns 200 with warning)
- [ ] All errors include recommendation for next action (retry, contact support, etc.)

**User Story:** As a user, I want the app to handle errors gracefully so that I can understand what went wrong and what to do next.

---

## 4. Non-Functional Requirements

### Performance
- API response time: < 15 seconds (3 agents in parallel)
- Frontend load time: < 2 seconds (Vite optimized bundle)
- Database queries: < 100ms (SQLite with proper indexing)
- Search/filter: real-time response for < 1000 validations

### Scalability
- Support 1000+ users in Phase 7 without major refactoring
- Database can handle 10,000+ validations (SQLite adequate; migrate to PostgreSQL if needed post-Phase 7)
- IA costs monitored per user and aggregated for financial planning

### Security
- JWT tokens: 7-day expiry, signed with HS256
- API secrets (OpenAI key, JWT secret): stored in `.env`, never in code
- Input validation: all user inputs sanitized server-side
- CORS configured to allow only approved origins
- No sensitive data logged to console in production

### Reliability
- 99.5% uptime target (Phase 7 SLA)
- Automated error monitoring (optional: Sentry integration in Phase 6+)
- Database backups: daily (manual in Phase 1–4, automated in Phase 5+)
- Health check endpoint: `GET /health` returns 200 if all systems OK

### Accessibility
- WCAG 2.1 AA compliance (keyboard navigation, color contrast, alt text)
- Mobile-first responsive design (tested on iOS 14+, Android 10+)
- Screen reader compatible (semantic HTML, ARIA labels)

---

## 5. Technical Approach & Architecture

### Multi-Agent Orchestration Pattern
```
User Input
    ↓
[Backend Orchestrator]
    ↓ (parallel)
┌────────────────┬────────────────┬──────────────────┐
│ Mercado Agent  │ Técnico Agent  │ Financeiro Agent │
│ (problem,      │ (stack,        │ (revenue model,  │
│  audience,     │  complexity,   │  costs,          │
│  competitors)  │  timeline)     │  viability)      │
└────────────────┴────────────────┴──────────────────┘
    ↓ (consolidation)
[Response Consolidation]
    ↓
Return 200 with JSON
(or 200 with partial if 1–2 agents fail)
```

### Technology Rationale
- **Node.js + Express:** Lightweight, non-blocking I/O perfect for parallel agent calls
- **Prisma + SQLite:** Simple ORM, SQLite adequate for MVP phase; Prisma migrations easy
- **React + Vite:** Modern frontend tooling; Vite fast dev experience and small bundles
- **OpenAI gpt-4o-mini (dev), gpt-4o (production):** Best balance of speed + cost in gpt-4 family
- **JWT (email-based):** Stateless auth; no sessions to manage; simple for MVP (email-only, no passwords)
- **TailwindCSS:** Rapid UI development; utility-first; no CSS files to maintain

---

## 6. User Stories (Detailed)

### User Story 1: Founder Validates Business Idea
**As a** founder with a rough business idea  
**I want to** submit my idea to an AI system and receive structured analysis across market, technical, and financial dimensions  
**So that** I can make an informed decision about whether to pursue or pivot

**Acceptance Criteria:**
- [ ] Login page accepts email and generates JWT token
- [ ] Idea form has text area with character counter (min 100, max 5000 chars)
- [ ] Submit button disabled until minimum length met
- [ ] Loading spinner shown for up to 15 seconds
- [ ] Dashboard displays all three agent results within 15 seconds
- [ ] Results include "viabilidade" scores (baixa/media/alta) from financial agent
- [ ] User can see specific recommendations from each agent
- [ ] If any agent fails, partial results still shown with error message

**Linked Acceptance Criteria (from PRD):**
- Feature 1: User Authentication (login required)
- Feature 2: Idea Submission & Multi-Agent Analysis (core feature)
- Feature 3: Dashboard Display (results presentation)
- Feature 5: Error Handling (partial failures)

---

### User Story 2: Recurring User Tracks Idea Evolution
**As a** user who has previously validated ideas  
**I want to** access the history of all my past analyses and compare them  
**So that** I can track improvement in my ideas and make side-by-side comparisons

**Acceptance Criteria:**
- [ ] History view lists all past validations, newest first
- [ ] Each list item shows: idea summary (first 50 chars), date, financeiro "viabilidade" score
- [ ] Clicking a history item opens full analysis view (same as fresh validation)
- [ ] Search bar filters by idea text (case-insensitive)
- [ ] Pagination or infinite scroll for > 10 items
- [ ] Delete button on each item (with confirmation)
- [ ] Clear all history button (with confirmation)
- [ ] History persists across logout/login (same email)

**Linked Acceptance Criteria (from PRD):**
- Feature 1: User Authentication (login required)
- Feature 4: History & Persistence (core feature)
- Feature 3: Dashboard Display (viewing past analyses)

---

### User Story 3: Developer Maintains Testable Agent Architecture
**As a** developer on this project  
**I want** each agent (Mercado, Técnico, Financeiro) to be independently testable and maintainable  
**So that** I can fix bugs, update prompts, and add new agents without breaking existing ones

**Acceptance Criteria:**
- [ ] Each agent is in a separate file/module (agents/mercadoAgent.js, etc.)
- [ ] Each agent exports a function: `async agent(ideaText) => JSON`
- [ ] Each agent can be tested in isolation with unit tests
- [ ] Agent response schema is validated (zod or similar)
- [ ] Orchestrator uses Promise.all() to call agents in parallel
- [ ] Orchestrator gracefully handles agent failures (one agent failure doesn't crash others)
- [ ] Prompt versioning documented in docs/prompts.md
- [ ] Adding a 4th agent (e.g., Risco) requires only adding new file + updating orchestrator

**Linked Acceptance Criteria (from PRD):**
- Architecture: Multi-Agent Orchestration Pattern
- Feature 2: Core business logic testability
- Core Feature: Extensibility for future enhancements

---

## 7. Dependencies & External Services

### OpenAI API
- **Endpoint:** `https://api.openai.com/v1/chat/completions`
- **Models:** `gpt-4o-mini` (dev), `gpt-4o` (production)
- **Rate Limits:** Shared between all users; monitor costs daily
- **Fallback:** If quota exceeded, return 200 with error state to frontend
- **Cost Estimate:** ~$0.02–0.05 per analysis at 3 agents × gpt-4o-mini

### GitHub (Infrastructure)
- Repository hosting and collaboration
- PR template and branch protections
- GitHub Project for kanban-style task tracking
- GitHub Actions for future CI/CD (post-Phase 6)

### No Other External Dependencies
- No payment processor (MVP: free tier)
- No email service (JWT only; no password resets in MVP)
- No analytics platform (can be added in Phase 6+)

---

## 8. Out of Scope (Future Enhancements)

- [ ] **PDF Export:** Export analysis as downloadable PDF (Phase 7+)
- [ ] **Real Data Integration:** Crunchbase, Google Trends, market data APIs (Phase 7+)
- [ ] **Collaborative Features:** Share analysis with co-founders (Phase 7+)
- [ ] **Idea Comparison Tool:** Visual side-by-side comparison of multiple ideas (Phase 7+)
- [ ] **Payment & Monetization:** Freemium tiers, advanced features (Phase 8+)
- [ ] **Mobile Apps:** iOS/Android native apps (Phase 8+)
- [ ] **Multi-Language:** i18n support beyond Portuguese (Phase 8+)
- [ ] **Custom Prompts:** Allow users to define custom agents (Phase 7+)
- [ ] **Integrations:** Slack, Notion, email notifications (Phase 8+)

---

## 9. Success Metrics (Phase 7 Evaluation)

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Code Coverage** | ≥ 30% | Demonstrates test-driven development across all modules |
| **Semantic Commits** | 100% from all 5 members | Shows disciplined version control and team contribution |
| **BDD Scenarios** | ≥ 3 per user story (9 total) | Traceability between business requirements and test cases |
| **API Response Time** | < 15 sec for 3 agents | Performance indicator; user experience |
| **Error Handling** | Zero unhandled exceptions in logs | Reliability and graceful degradation |
| **Documentation Completeness** | All 8 docs listed in PRD completed | Clear communication of decisions, architecture, and usage |

---

## 10. Definition of Ready (DoR) for Tasks

Before a task enters development:
- [ ] BDD scenario written (Gherkin .feature file)
- [ ] Acceptance criteria documented (linked to user story)
- [ ] API contract defined (if backend task)
- [ ] Component mockups approved (if frontend task)
- [ ] Dependencies on other tasks identified
- [ ] Owner assigned (primary contributor)

---

## 11. Timeline & Phase Gates

| Phase | Gate | Owner | Duration |
|-------|------|-------|----------|
| Phase 0 | Contracts finalized, env vars set, CI/CD baseline | Member A | 1 day |
| Phase 1 | Auth + schema complete, no regressions | Member C | 2 days |
| Phase 2 | 3 agents tested, prompts versioned | Member B | 3 days |
| Phase 3 | Orchestrator + API contract validated | Member A | 2 days |
| Phase 4 | Test suite + coverage report | Member E | 2 days |
| Phase 5 | Frontend complete, integration tested | Member D | 4 days |
| Phase 6 | Docs, UML, README, PRD, VIABILIDADE | Member E | 2 days |
| Phase 7 | Hardening, final review, submission ready | Member A | 2 days |

---

## Appendix: API Contract (Reference)

See `.copilot-instructions.md` section "API Contract (frozen Phase 0)" for complete request/response schemas and error codes.

**Key Endpoints:**
- `POST /auth/login` → JWT token
- `POST /api/validar` → 3-agent consolidated analysis
- `GET /api/validacoes` → user's history
- `DELETE /api/validacoes/:id` → remove one validation
- `GET /health` → system status

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-19  
**Next Review:** End of Phase 0 (before Phase 1 begins)
