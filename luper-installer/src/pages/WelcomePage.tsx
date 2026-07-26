import React from 'react';
import { Button } from '../components/Button';
import { ShieldCheck } from 'lucide-react';

interface WelcomePageProps {
  onNext: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onNext }) => {
  const handleExit = () => {
    if (window.electronAPI) {
      window.electronAPI.invoke('window-close');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center relative h-full">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luper-sapphire/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <img src="/logo.svg" alt="Luper Logo" className="w-[260px] h-[260px] drop-shadow-[0_0_35px_rgba(26,94,253,0.8)]" />
        
        <p className="text-xl text-white/80 font-medium mb-1 mt-1 text-center">
          Profesyonel Windows Optimizasyon Platformu
        </p>
        <p className="text-white/50 max-w-md">
          Sisteminizi en iyi LUPER deneyimi için hazırlayın. Bilgisayarınızın gerçek potansiyelini ortaya çıkarmak üzereyiz.
        </p>

        <div className="mt-12 flex gap-4">
          <Button variant="ghost" onClick={handleExit} className="px-8">
            Çıkış
          </Button>
          <Button variant="primary" onClick={onNext} className="px-12 text-lg">
            Kuruluma Başla
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
