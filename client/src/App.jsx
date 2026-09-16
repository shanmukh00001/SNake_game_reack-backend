import { useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import LeaderboardCard from "./components/leaderboard/LeaderboardCard.jsx";
import GamePage from "./pages/GamePage.jsx";
import SettingsPanel from "./components/settings/SettingsPanel.jsx";
import { Button } from "./components/ui/Button.jsx";
import { LogOut, Sliders, User } from "lucide-react";

function App() {
  const { user, logout } = useAuth();
  const isGuest = user?.isGuest;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 lg:p-6 bg-slate-950">
      {/* Application Cockpit Shell */}
      <div className="w-full max-w-6xl rounded-2xl border border-slate-700/80 bg-slate-900/70 backdrop-blur-md p-4 sm:p-6 shadow-2xl relative">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-700/80 mb-5 gap-3">
          <div className="flex items-center gap-3">
            {/* Stitch Logo Mark */}
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path
                  d="M6 16H10V12H14V8H18V12H16"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
                <rect x="6" y="7" width="2.5" height="2.5" fill="#34D399" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-display tracking-tight text-[#f8fafc]">
                  SNAKE ARCADE
                </h1>
                <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#181c23] border border-[#232934] rounded text-[#10b981] font-bold uppercase">
                  EDITION 01
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider block">
                TACTILE CANON // OBSIDIAN ARCHITECTURE
              </span>
            </div>
          </div>

          {/* User Status Toolbar */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#181c23] border border-[#232934] text-xs font-mono">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt=""
                      className="w-4 h-4 rounded object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#94a3b8]" />
                  )}
                  <span className="font-semibold text-[#f8fafc]">
                    {user.name || user.email?.split("@")[0] || "Operator"}
                  </span>
                  {isGuest && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-[#232934] text-[#94a3b8]">
                      GUEST
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7.5 w-7.5 text-[#94a3b8] hover:text-[#f8fafc]"
                  onClick={() => setIsSettingsOpen(true)}
                  aria-label="Settings"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7.5 w-7.5 text-[#94a3b8] hover:text-[#ef4444]"
                  onClick={logout}
                  aria-label="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs font-mono text-[#94a3b8] hover:text-[#f8fafc]"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Sliders className="w-3.5 h-3.5" /> PREFERENCES
              </Button>
            )}
          </div>
        </header>

        {/* Main Interface */}
        <main className="w-full">
          {!user ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
              <section className="lg:col-span-7 flex flex-col items-center">
                <LoginPage />
              </section>
              <aside className="lg:col-span-5 w-full">
                <LeaderboardCard />
              </aside>
            </div>
          ) : (
            <GamePage
              onOpenSettings={() => setIsSettingsOpen(true)}
              rightSlot={<LeaderboardCard />}
            />
          )}
        </main>
      </div>

      {/* Global Preferences Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
