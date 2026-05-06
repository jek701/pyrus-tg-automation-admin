import { useAuth0 } from '@auth0/auth0-react';
import { LogOut } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export function AppShell({ children }: PropsWithChildren) {
  const { user, logout } = useAuth0();
  const displayName = user?.email || user?.name || 'Admin';

  return (
    <div className="appShell">
      <header className="topbar">
        <div>
          <h1>Pyrus Telegram Sync</h1>
        </div>
        <div className="topbarActions">
          <span className="userIdentity">{displayName}</span>
          <button
            className="ghostButton"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>
      <main className="mainContent">{children}</main>
    </div>
  );
}
