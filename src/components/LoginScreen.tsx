import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../lib/auth';

export function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login(username.trim(), password);
    if (!result.ok) setError(result.error);
    else setError(null);
  }

  return (
    <main className="loginScreen">
      <section className="loginPanel">
        <div className="loginMark">
          <LockKeyhole size={24} />
        </div>
        <h1>Pyrus Telegram Sync</h1>
        <p>Sign in to manage sync integrations, credentials, and watch rules.</p>
        <form className="loginForm" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="loginError">{error}</div>}
          <button type="submit" className="primaryButton largeButton">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
