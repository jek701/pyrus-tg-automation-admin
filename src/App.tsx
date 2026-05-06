import { AppShell } from './components/AppShell';
import { IntegrationsPage } from './components/IntegrationsPage';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './lib/auth';

export function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <AppShell>
      <IntegrationsPage />
    </AppShell>
  );
}
