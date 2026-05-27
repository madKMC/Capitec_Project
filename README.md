# Capitec_Project

A responsive financial analytics dashboard to display a customer's spending data (mocked data).

## Tech stack

- **React 19** + **TypeScript** — component-based UI with full type safety
- **Vite** — fast dev server and build tooling
- **React Router DOM v7** — client-side routing
- **Recharts** — AreaChart (trends), PieChart (categories), BarChart (goals)
- **React Icons** — icon library used in category and UI elements
- **MSW (Mock Service Worker) v2** — all API endpoints intercepted and served from mock handlers; no real backend required
- **Vitest** + **React Testing Library** — unit and integration tests
- **CSS Custom Properties** — full theming system (dark default, light variant)
- **Docker** — Dockerfile and `compose.yaml` for containerised development

## Features implemented

- **Multi-user login** — select from three mock accounts (Alice Smith, Bob Jones, John Doe); no password required
- **JWT-based auth flow** — token and user stored in `localStorage`; token re-validated against the mock profile endpoint on page load
- **Dark / light theme toggle** — respects `prefers-color-scheme` on first visit; persists user preference to `localStorage`
- **Spending summary cards** — Total Spent, Transaction Count, Top Category, and Average Transaction; each card shows a period-over-period percentage change indicator
- **Date range filter** — preset buttons (7d, 30d, 90d, 1y) that re-fetch and update all summary and category data simultaneously
- **Category spending chart** — PieChart showing spending breakdown by category, filtered by selected date range; includes an empty state
- **Monthly trends chart** — AreaChart of monthly spending; internal month-range selector (1, 3, 6, 12 months)
- **Goals progress chart** — BarChart displaying saving goals with current vs. target amounts and status indicators
- **Transaction list** — paginated list with category filter, sort controls (date / amount, ascending / descending), and empty state
- **Profile page** — displays logged-in user's account details
- **Responsive layout** — grid collapses to single-column on mobile; filter controls wrap on small screens

## Key decisions & Tradeoffs

- **MSW for all data** — avoids a real backend entirely. All handlers live in `src/mocks/handlers.tsx` and compute responses dynamically from a shared `allTransactions` array (70 transactions spanning ~13 months), so date range filtering produces realistic, varied results rather than static snapshots.
- **Context API over a state management library** — `AuthContext` and `ThemeContext` are sufficient at this scale; adding Redux or Zustand would be over-engineering for two pieces of global state.
- **Prop-drilled `selectedDateRange`** — the Dashboard owns the selected date range and passes it down to `TransactionsCard`. This keeps filtering logic in one place and avoids duplicated fetch state.
- **TrendChart owns its own month-range state** — the trend chart's slider is purely a local display concern (slicing already-fetched data), so it is kept internal rather than lifted to Dashboard.
- **`apiFetch` centralises auth headers** — all requests go through a single wrapper that reads the token from `localStorage` and attaches the `Authorization` header, avoiding repetition across components.

## Accessibility

- `role="status"` and `aria-live="polite"` on the global loading indicator
- `aria-pressed` on date range filter buttons to communicate toggle state to screen readers
- `aria-label` on each login button describing the user name and account type
- `role="list"` / `role="listitem"` on the login user list
- `role="group"` with `aria-label` on the trend chart month-range filter
- `aria-label` on all chart filter dropdowns and sort controls
- Visually hidden (`sr-only`) `<table>` elements inside each chart providing a screen-reader-accessible tabular alternative to the visual charts
- `SummaryCard` change indicators carry a descriptive `aria-label` (e.g. "12% increase from previous period") rather than relying solely on the arrow symbol

## Testing

Tests are written with **Vitest** and **React Testing Library**.

- App.test.ts — routing: loading state, unauthenticated view, authenticated routes
- auth.test.ts — logout helper
- client.test.ts — apiFetch: headers, error handling, 204 responses
- src/context/auth/
  - AuthProvider.test.tsx — token restore, login, logout, invalid-token clear
  - useAuth.test.ts — hook throws outside provider
- src/context/theme/
  - ThemeProvider.test.tsx — theme toggle, localStorage persistence, system preference
  - useTheme.test.ts — hook throws outside provider
- setup.ts — jest-dom matchers + ResizeObserver polyfill (required by Recharts)

Run all tests:

```bash
npm test          # watch mode
npm run test:run  # single pass
npm run test:ui   # Vitest UI

## Running the project

Local (Node)
npm install
npm run dev

The app is served at http://localhost:5173. MSW registers its service worker automatically in development.

Docker
docker compose up

This builds the image and mounts the project directory as a volume, so file changes are reflected without rebuilding.

## Environment Variables

VITE_API_URL=

## Folder Structure

src/
  api/              # apiFetch client wrapper and auth helper
  components/       # Shared UI — Header, SummaryCard, FilterButton, CardTitle
  context/
    auth/           # AuthContext, AuthProvider, useAuth
    theme/          # ThemeContext, ThemeProvider, useTheme
  mocks/
    browser.tsx     # MSW browser setup
    handlers.tsx    # All mock API route handlers
  pages/
    Dashboard/      # Main dashboard page + CategoryChart, GoalsChart, TrendChart, TransactionCard
    Login/          # Account-selection login screen
    Profile/        # User profile page
Tests/
  setup.ts          # Global test setup (jest-dom, ResizeObserver polyfill)

## Known Limitations

- Goals data is static, it returns hard coded values from handler.ts.
- Mock data needs to be adjusted whenever viewing the dashboard, as last 7 days may contain no data if not updated.

## Future Improvements
```
- Update mock data to be offset from current date, keeping mock data consistent.
- Compute goals data dynamically for current time period, but update it against actual transactions.
- Adding more testing, limited testing currently happening.
  - Current testing does not take into consideration components and pages.
- Add a custom date range picker instead of preset buttons (Only kept as buttons, due to example on mock data given)
- Replace Mock Service Worker with a real API and database.