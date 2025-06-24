import * as React from 'react';
import NxWelcome from './nx-welcome';
import { Link, Route, Routes } from 'react-router-dom';

const Contribution = React.lazy(() => import('contribution/Module'));

const Finance = React.lazy(() => import('finance/Module'));

const Registration = React.lazy(() => import('registration/Module'));

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
