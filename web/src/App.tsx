import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { Games } from './components/Games';
import { SupportedGames } from './components/SupportedGames';
import { Updates } from './components/Updates';
import { Security } from './components/Security';
import { Changelog } from './components/Changelog';
import { HowItWorks } from './components/HowItWorks';
import { Performance } from './components/Performance';
import { WaitlistCTA } from './components/WaitlistCTA';

function App() {
  return (
    <div className="min-h-screen bg-anthracite-bg text-text-primary font-sans selection:bg-sapphire-blue/30 selection:text-white overflow-x-hidden relative">
      {/* Global Seamless Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sapphire-blue/[0.03] via-anthracite-bg to-anthracite-bg" />
      
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
        <HowItWorks />
        <Games />
        <SupportedGames />
        <Categories />
        <Performance />
        <Security />
        <Changelog />
        <Updates />
        <WaitlistCTA />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/[0.06] relative z-10 bg-anthracite-bg">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo.svg" alt="LUPER Logo" className="h-6 w-auto opacity-70" />
          </div>
          <div className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} LUPER. Tüm hakları saklıdır.
          </div>
        </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
