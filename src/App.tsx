import { ErrorBoundary } from './components/ErrorBoundary';
import { AppShell } from './app/AppShell';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ErrorBoundary>
  );
}
