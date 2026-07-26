import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Check, Sparkles } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const CompletePage: React.FC = () => {
  const [launchChecked, setLaunchChecked] = useState(true);

  const handleClose = () => {
    // Ideally this would launch the app if launchChecked is true
    if (window.electronAPI) {
      window.electronAPI.invoke('window-close');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center relative h-full">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luper-sapphire/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <img src="/logo.svg" alt="Luper Logo" className="w-[260px] h-[260px] drop-shadow-[0_0_35px_rgba(26,94,253,0.8)]" />
        
        <p className="text-white/80 text-xl font-medium max-w-md mb-6 mt-1 text-center">
          LUPER başarıyla bilgisayarınıza yüklendi. Artık Windows deneyiminizi optimize etmeye hazırsınız.
        </p>

        <div 
          onClick={() => setLaunchChecked(!launchChecked)}
          className="flex items-center gap-3 cursor-pointer group mb-12"
        >
          <div className={twMerge(
            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
            launchChecked ? "bg-luper-sapphire border-luper-sapphire" : "bg-transparent border-white/20 group-hover:border-white/40"
          )}>
            {launchChecked && <Check size={12} className="text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
            Kurulumdan çıkarken LUPER'i başlat
          </span>
        </div>

        <div className="flex gap-4">
          <Button variant="primary" onClick={handleClose} className="px-12 text-lg">
            Kurulumu Kapat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompletePage;
