import { MantineProvider, createTheme } from '@mantine/core';
import { Routes, Route, Navigate } from 'react-router-dom';
import '@mantine/core/styles.css';

// Import layout and pages
import DemoPage from './DemoPage';
import DashboardPage from './pages/DashboardPage';
import InvestmentsPage from './pages/InvestmentsPage';
import TransactionsPage from './pages/TransactionsPage';
import PlanningPage from './pages/PlanningPage';
import SettingsPage from './pages/SettingsPage';

// Create a custom theme
const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  primaryColor: 'blue',
});

export function App() {
  return (
    <MantineProvider theme={theme}>
      <Routes>
        <Route path="/" element={<DemoPage />}>
          <Route index element={<DashboardPage />} />
          <Route path="investments" element={<InvestmentsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}

export default App;
