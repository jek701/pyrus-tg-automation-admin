import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { AuthProvider } from './lib/auth';
import './styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const missingEnv = [['VITE_API_BASE_URL', apiBaseUrl]]
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
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    )}
  </React.StrictMode>,
);
