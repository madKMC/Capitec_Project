import '@testing-library/jest-dom';

// ResizeObserver polyfill — required by Recharts (CategoryChart, GoalsChart, TrendChart)
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};