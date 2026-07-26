import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { FolderOpen, HardDrive } from 'lucide-react';

interface LocationPageProps {
  onNext: () => void;
  onPrev: () => void;
  installPath: string;
  setInstallPath: (path: string) => void;
}

const LocationPage: React.FC<LocationPageProps> = ({ onNext, onPrev, installPath, setInstallPath }) => {
  return (
    <PageLayout 
      title="Kurulum Konumu" 
      subtitle="LUPER'in kurulacağı dizini seçin."
      onNext={onNext} 
      onPrev={onPrev}
    >
      <div className="flex flex-col gap-6 mt-4 max-w-2xl">
        <div className="glass-panel p-6">
          <label className="block text-sm font-medium text-white/70 mb-2">Hedef Dizin</label>
          <div className="flex gap-3">
            <div className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 flex items-center">
              <FolderOpen size={18} className="text-luper-sapphire mr-3" />
              <input 
                type="text" 
                value={installPath}
                onChange={(e) => setInstallPath(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full font-mono text-sm"
              />
            </div>
            <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 rounded-lg transition-colors flex items-center justify-center">
              Gözat
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <HardDrive size={24} className="text-white/70" />
            </div>
            <div>
              <h3 className="font-medium text-white">Disk Alanı Gereksinimi</h3>
              <p className="text-sm text-white/50 mt-1">Gerekli alan: 250 MB</p>
            </div>
          </div>
          
          <div className="text-right">
            <h3 className="font-medium text-luper-sapphire-light">Kullanılabilir Alan</h3>
            <p className="text-sm text-white/70 mt-1">124.5 GB</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LocationPage;
