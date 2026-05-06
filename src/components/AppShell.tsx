import { LogOut } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useAuth } from '../lib/auth';

export function AppShell({ children }: PropsWithChildren) {
  const { username, logout } = useAuth();
  const displayName = username || 'Admin';

  return (
    <div className="appShell">
      <header className="topbar">
        <div>
          <h1>Pyrus Telegram Sync</h1>
        </div>
        <div className="topbarActions">
          <span className="userIdentity">{displayName}</span>
          <button className="ghostButton" onClick={() => logout()}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>
      <main className="mainContent">{children}</main>
    </div>
  );
}
