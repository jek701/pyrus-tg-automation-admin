import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import './styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const missingEnv = [
  ['VITE_AUTH0_DOMAIN', domain],
  ['VITE_AUTH0_CLIENT_ID', clientId],
  ['VITE_AUTH0_AUDIENCE', audience],
  ['VITE_API_BASE_URL', apiBaseUrl],
]
  .filter(([, value]) => !value)
  .map(([key]) => key);

function MissingEnvScreen() {
  return (
    <main className="loginScreen">
      <section className="loginPanel">
        <h1>Configuration required</h1>
        <p>Add the missing Vite environment variables before signing in.</p>
        <pre className="envList">{missingEnv.join('\n')}</pre>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {missingEnv.length ? (
      <MissingEnvScreen />
    ) : (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience,
        }}
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Auth0Provider>
    )}
  </React.StrictMode>,
);
