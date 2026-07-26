import React, { useEffect, useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { CheckCircle2, Circle, AlertTriangle, Loader2 } from 'lucide-react';

interface SystemCheckPageProps {
  onNext: () => void;
  onPrev: () => void;
}

const SystemCheckPage: React.FC<SystemCheckPageProps> = ({ onNext, onPrev }) => {
  const [checks, setChecks] = useState([
    { id: 'admin', title: 'Yönetici İzinleri Doğrulaması', status: 'pending' },
    { id: 'os', title: 'Windows Sürüm Uyumluluğu', status: 'pending' },
    { id: 'disk', title: 'Gerekli Disk Alanı', status: 'pending' },
    { id: 'write', title: 'Yazma İzinleri', status: 'pending' },
  ]);

  const [allPassed, setAllPassed] = useState(false);

  useEffect(() => {
    const runChecks = async () => {
      // Simulate checking sequentially
      for (let i = 0; i < checks.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        setChecks(prev => prev.map((c, idx) => idx === i ? { ...c, status: 'success' } : c));
      }
      setAllPassed(true);
    };
    runChecks();
  }, []);

  return (
    <PageLayout 
      title="Sistem Kontrolü" 
      subtitle="Kurulum için sistem gereksinimleri denetleniyor."
      onNext={onNext} 
      onPrev={onPrev}
      isNextDisabled={!allPassed}
    >
      <div className="grid grid-cols-2 gap-3 mt-4 max-w-2xl">
        {checks.map((check) => (
          <div key={check.id} className="glass-panel p-3 flex items-center justify-between">
            <span className="font-medium text-white/90 text-sm">{check.title}</span>
            <div>
              {check.status === 'pending' && <Loader2 size={18} className="text-white/50 animate-spin" />}
              {check.status === 'success' && <CheckCircle2 size={18} className="text-green-500" />}
              {check.status === 'error' && <AlertTriangle size={18} className="text-red-500" />}
            </div>
          </div>
        ))}
      </div>

      {allPassed && (
        <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 max-w-2xl">
          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-100">Tüm sistem kontrolleri başarıyla tamamlandı. Kuruluma hazırsınız.</p>
        </div>
      )}
    </PageLayout>
  );
};

export default SystemCheckPage;
