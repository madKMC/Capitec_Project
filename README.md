# Capitec Project

Responsive financial analytics dashboard built to visualise customer spending trends using mocked financial data.

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

## Assumptions

- Authentication is mocked and does not represent production-grade security.
- Financial values are illustrative only and generated from mock datasets.

## Features implemented

- **Multi-user login** — select from three mock accounts (Alice Smith, Bob Jones, John Doe); no password required
- **Mock token-based auth flow** — token and user stored in `localStorage`; token re-validated against the mock profile endpoint on page load
- **Dark / light theme toggle** — respects `prefers-color-scheme` on first visit; persists user preference to `localStorage`
- **Spending summary cards** — Total Spent, Transaction Count, Top Category, and Average Transaction; each card shows a period-over-period percentage change indicator
- **Date range filter** — preset buttons (7d, 30d, 90d, 1y) that re-fetch and update all summary and category data simultaneously
- **Category spending chart** — PieChart showing spending breakdown by category, filtered by selected date range; includes an empty state
- **Monthly trends chart** — AreaChart of monthly spending; internal month-range selector (1, 3, 6, 12 months)
- **Goals progress chart** — BarChart displaying saving goals with current vs. target amounts and status indicators
- **Transaction list** — paginated list with category filter, sort controls (date / amount, ascending / descending), and empty state
- **Profile page** — displays logged-in user's account details
- **Responsive layout** — grid collapses to single-column on mobile; filter controls wrap on small screens

## Architectural decisions & Tradeoffs

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

### Authentication

- Login flow
- Logout behaviour
- Token restore from localStorage
- Invalid token handling

### API Layer

- Authorization headers
- Error handling
- 204 responses

### Theme System

- Theme toggling
- localStorage persistence
- System preference detection

### Routing

- Authenticated vs unauthenticated routes
- Loading states

### Run Tests

```bash
npm test              # watch mode
npm run test:run      # single pass (CI)
npm run test:ui       # interactive UI
```

## Running the project

Local (Node)

```bash
npm install
npm run dev
```

The app is served at http://localhost:5173. MSW registers its service worker automatically in development.

Docker

```bash
docker compose up
```

This builds the image and mounts the project directory as a volume, so file changes are reflected without rebuilding. Runs at http://localhost:5173.
Ensure Docker Desktop is installed and running for local docker images.

## Environment Variables

Leave empty to use MSW (default). Set to a real base URL when connecting to a backend.

```
VITE_API_URL=
```

## Folder Structure

```
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
```

## Known Limitations

- Goals data is static — the handler returns hard coded values and does not respond to date range filters.
- The 7-day filter may return no results — mock transaction dates are fixed and will fall outside the rolling 7-day window over time.

## Future Improvements

- Update mock data to be offset from current date, keeping mock data consistent.
- Compute goals data dynamically for current time period, but update it against actual transactions.
- Expand component and page-level testing coverage.
- Add a custom date range picker as an alternative to the fixed preset buttons.
- Replace Mock Service Worker with a real API and database.
