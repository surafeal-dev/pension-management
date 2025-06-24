import * as React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  NavLink,
} from 'react-router-dom';
import { Group, Text, DashboardLayout } from '@pension/ui';
import { IconCash, IconPigMoney, IconUser } from '@tabler/icons-react';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// Pages
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';

// Lazy load micro-frontend modules with error boundaries
const RemoteModule = ({
  moduleName,
  children,
}: {
  moduleName: string;
  children: React.ReactNode;
}) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading {moduleName}...</p>
          </div>
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
};

const Contribution = React.lazy(() =>
  import('contribution/Module').catch(() => ({
    default: () => (
      <div className="p-4 text-red-600">
        Failed to load Contribution module. Please make sure the Contribution
        app is running.
      </div>
    ),
  }))
);

const Finance = React.lazy(() =>
  import('finance/Module').catch(() => ({
    default: () => (
      <div className="p-4 text-red-600">
        Failed to load Finance module. Please make sure the Finance app is
        running.
      </div>
    ),
  }))
);

const Registration = React.lazy(() =>
  import('registration/Module').catch(() => ({
    default: () => (
      <div className="p-4 text-red-600">
        Failed to load Registration module. Please make sure the Registration
        app is running.
      </div>
    ),
  }))
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted URL for redirecting after login
    const from =
      location.pathname !== '/'
        ? location.pathname + location.search
        : '/registration';
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return <>{children}</>;
};

// App routes
const AppRoutes = () => {
  const { logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated and not already on login page
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and on login page, redirect to registration

  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/registration" replace />;
  }

  // Handle initial app load - redirect to login if not on a valid route
  if (location.pathname === '/') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Redirect root path to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Redirect any unknown paths to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />

      <Route
        path="/contribution/*"
        element={
          <ProtectedRoute>
            <DashboardLayout
              headerContent={<Text size="xl">Contribution Dashboard</Text>}
              user={{
                name: 'Admin User',
                email: 'admin@example.com',
              }}
              onLogout={logout}
              apps={[
                {
                  label: 'Contribution',
                  path: '/contribution',
                  icon: <IconCash size={16} />,
                },
                {
                  label: 'Finance',
                  path: '/finance',
                  icon: <IconPigMoney size={16} />,
                },
                {
                  label: 'Registration',
                  path: '/registration',
                  icon: <IconUser size={16} />,
                },
              ]}
            >
              <RemoteModule moduleName="Contribution">
                <Contribution />
              </RemoteModule>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/finance/*"
        element={
          <ProtectedRoute>
            <DashboardLayout
              headerContent={<Text size="xl">Finance Dashboard</Text>}
              user={{
                name: 'Admin User',
                email: 'admin@example.com',
              }}
              onLogout={logout}
            >
              <RemoteModule moduleName="Finance">
                <Finance />
              </RemoteModule>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/registration"
        element={
          <ProtectedRoute>
            <DashboardLayout
              headerContent={<Text size="xl">Registration Dashboard</Text>}
              user={{
                name: 'Admin Admin',
                email: 'admin@example.com',
              }}
              onLogout={logout}
            >
              <RemoteModule moduleName="Registration">
                <Registration />
              </RemoteModule>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function AppWithRouter() {
  return (
    <Router>
      <AuthProvider>
        <Notifications />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/contribution">Contribution</Link>
        </li>
        <li>
          <Link to="/finance">Finance</Link>
        </li>
        <li>
          <Link to="/registration">Registration</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="admin" />} />
        <Route path="/contribution/*" element={<Contribution />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
