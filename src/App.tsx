import { useAuth0 } from '@auth0/auth0-react';
import { AppShell } from './components/AppShell';
import { IntegrationsPage } from './components/IntegrationsPage';
import { LoginScreen } from './components/LoginScreen';

export function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return <div className="pageLoader">Preparing secure session...</div>;
  }

  if (error) {
    return (
      <div className="pageLoader pageLoaderError">
        <strong>Authentication failed</strong>
        <span>{error.message}</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <AppShell>
      <IntegrationsPage />
    </AppShell>
  );
}
