import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ComponentsPageProps {
  onNext: () => void;
  onPrev: () => void;
}

const ComponentsPage: React.FC<ComponentsPageProps> = ({ onNext, onPrev }) => {
  const [components, setComponents] = useState([
    { id: 'desktop', title: 'Masaüstü Kısayolu', desc: 'Masaüstüne LUPER kısayolu ekle', checked: true, locked: false },
    { id: 'start', title: 'Başlat Menüsü Kısayolu', desc: 'Başlat menüsüne LUPER kısayolu ekle', checked: true, locked: false },
  ]);

  const toggleComponent = (id: string) => {
    setComponents(comps => comps.map(c => {
      if (c.id === id && !c.locked) {
        return { ...c, checked: !c.checked };
      }
      return c;
    }));
  };

  return (
    <PageLayout 
      title="Kısayollar" 
      subtitle="Oluşturulacak kısayolları seçin."
      onNext={onNext} 
      onPrev={onPrev}
    >
      <div className="flex flex-col gap-3 mt-4 max-w-2xl">
        {components.map((comp) => (
          <div 
            key={comp.id}
            onClick={() => toggleComponent(comp.id)}
            className={twMerge(
              "glass-panel p-4 flex items-center gap-4 transition-colors",
              !comp.locked ? "cursor-pointer hover:bg-white/[0.05]" : "opacity-80"
            )}
          >
            <div className={twMerge(
              "w-6 h-6 rounded flex items-center justify-center border transition-colors",
              comp.checked ? "bg-luper-sapphire border-luper-sapphire" : "border-white/20 bg-black/20"
            )}>
              {comp.checked && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <div>
              <h3 className="font-medium text-white">{comp.title}</h3>
              <p className="text-sm text-white/50">{comp.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default ComponentsPage;
