import { useAuth0 } from '@auth0/auth0-react';
import { LockKeyhole } from 'lucide-react';

export function LoginScreen() {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <main className="loginScreen">
      <section className="loginPanel">
        <div className="loginMark">
          <LockKeyhole size={24} />
        </div>
        <h1>Pyrus Telegram Sync</h1>
        <p>Sign in to manage sync integrations, credentials, and watch rules.</p>
        <button className="primaryButton largeButton" onClick={() => loginWithRedirect()} disabled={isLoading}>
          Sign in with Auth0
        </button>
      </section>
    </main>
  );
}
