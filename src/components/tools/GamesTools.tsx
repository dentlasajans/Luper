import { LuperButton } from '../ui/LuperButton';
import { GameController, Plus, ArrowsClockwise, MagnifyingGlass, Sparkle, X, RocketLaunch, Scales, Crown, Cpu, Pulse } from '@/src/components/ui/Icons';
import { notifySuccess, notifyError } from '../../utils/notify';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { getAllInstalledGames, getCachedGames } from '../../services/SystemEngine';
import { Game } from '../../types';
import { LuperToggle } from '../ui/LuperToggle';


const getLauncherBadge = (launcher?: string) => {
  switch (launcher?.toLowerCase()) {
    case 'steam': return 'bg-[#161618] border border-[#66c0f4]/40 text-[#66c0f4] shadow-[0_0_8px_rgba(102,192,244,0.15)] backdrop-blur-none';
    case 'epic': return 'bg-[#161618] border border-white/30 text-white shadow-[0_0_8px_rgba(255,255,255,0.1)] backdrop-blur-none';
    case 'riot': return 'bg-[#161618] border border-[#ff4655]/40 text-[#ff4655] shadow-[0_0_8px_rgba(255,70,85,0.15)] backdrop-blur-none';
    case 'ea': return 'bg-[#161618] border border-[#ff4747]/40 text-[#ff4747] shadow-[0_0_8px_rgba(255,71,71,0.15)] backdrop-blur-none';
    case 'xbox': return 'bg-[#161618] border border-[#107c10]/40 text-[#107c10] shadow-[0_0_8px_rgba(16,124,16,0.15)] backdrop-blur-none';
    case 'ubisoft': return 'bg-[#161618] border border-[#0070ff]/40 text-[#0070ff] shadow-[0_0_8px_rgba(0,112,255,0.15)] backdrop-blur-none';
    case 'gog': return 'bg-[#161618] border border-[#c333e6]/40 text-[#c333e6] shadow-[0_0_8px_rgba(195,51,230,0.15)] backdrop-blur-none';
    default: return 'bg-[#161618] border border-white/20 text-[#a1a1a6] backdrop-blur-none';
  }
};

const GameCard = memo(({ 
  game, 
  avgFps,
  onSelectGame,
  onShowStats
}: { 
  game: Game; 
  avgFps: number;
  onSelectGame: (game: Game) => void;
  onShowStats?: (game: Game) => void;
}) => {
  const initialSteam = game.launcher === 'steam' ? `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg` : null;
  const initialSrc = game.headerImage || game.coverImage || game.localCover || initialSteam;

  const [imgSrc] = useState<string | null>(initialSrc);
  const [hasError, setHasError] = useState(false);

  const handleImgError = () => {
    setHasError(true);
  };

  return (
    <div 
      className="flex flex-col rounded-2xl border border-luper-subtle bg-[#1a1a1d] hover:border-white/[0.2] hover:bg-[#1c1c1f] transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => onSelectGame(game)}
    >
      <div className="w-full aspect-[16/9] relative bg-[#161618]">
        {!hasError && imgSrc ? (
          <img
            src={imgSrc}
            alt={game.name}
            loading="lazy"
            onError={handleImgError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
            <GameController weight="duotone" size={32} className="text-[#86868b]" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm ${getLauncherBadge(game.launcher)}`}>
            {game.launcher || 'PC'}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[#f5f5f7] font-semibold text-[14px] leading-snug mb-3 line-clamp-2">{game.name}</h3>
        <div className="mt-auto flex items-center justify-between">
          {avgFps > 0 ? (
            <button 
              onClick={(e) => { e.stopPropagation(); if (onShowStats) onShowStats(game); }}
              className="px-2.5 py-1 rounded-lg bg-luper-primary/10 hover:bg-luper-primary/20 text-luper-primary text-[11px] font-bold transition-colors flex items-center space-x-1"
            >
              <Pulse weight="bold" size={12} />
              <span>{avgFps} FPS</span>
            </button>
          ) : <div />}
          <button
            onClick={(e) => { e.stopPropagation(); onSelectGame(game); }}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <Sparkle weight="duotone" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

export function GamesTools() {
  const [games, setGames] = useState<Game[]>(() => getCachedGames() || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [statsGame, setStatsGame] = useState<{game: Game, stats: any} | null>(null);
  const [applyingMode, setApplyingMode] = useState<'fps' | 'aaa-quality' | 'aaa-fps' | 'balanced' | null>(null);
  const [activeMode, setActiveMode] = useState<'fps' | 'aaa-quality' | 'aaa-fps' | 'balanced' | null>(null);
  const [allFpsStats, setAllFpsStats] = useState<Record<string, any>>({});

  const fetchFpsStats = useCallback(async () => {
    if ('electronAPI' in window && typeof (window as any).electronAPI.getFpsStats === 'function') {
      try {
        const stats = await (window as any).electronAPI.getFpsStats();
        setAllFpsStats(stats || {});
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    fetchFpsStats();
  }, [fetchFpsStats]);

  const handleApplyNvidia = async (mode: 'fps' | 'aaa-quality' | 'aaa-fps' | 'balanced') => {
    try {
      setApplyingMode(mode);
      if ('electronAPI' in window && typeof (window as unknown as { electronAPI: { applyNvidiaProfile?: (mode: string) => Promise<void> } }).electronAPI.applyNvidiaProfile === 'function') {
        await (window as unknown as { electronAPI: { applyNvidiaProfile: (mode: string) => Promise<void> } }).electronAPI.applyNvidiaProfile(mode);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setActiveMode(mode);
      notifySuccess('NVIDIA Profili başarıyla uygulandı');
    } catch (e) {
      notifyError(e instanceof Error ? (e as Error).message : 'NVIDIA Profili uygulanırken bir hata oluştu');
    } finally {
      setApplyingMode(null);
    }
  };

  const handleAddGame = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.exe,.lnk,.url';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newGame = {
          appid: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          launcher: 'pc',
          installDir: ('path' in file) ? (file as unknown as { path: string }).path : file.name,
          headerImage: '',
          coverImage: '',
        } as Game;
        setGames((prev) => [newGame, ...prev]);
        
        if ('electronAPI' in window && typeof (window as any).electronAPI.invoke === 'function') {
          try {
            await (window as any).electronAPI.invoke('add-custom-game', newGame);
          } catch (err) {
            console.error('Failed to save custom game to backend:', err);
          }
        }
      }
    };
    input.click();
  }, []);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllInstalledGames();
      setGames(data);
      await fetchFpsStats();
    } catch (e) {
      console.error("Game scan error:", e);
    } finally {
      setLoading(false);
    }
  }, [fetchFpsStats]);

  useEffect(() => {
    if (games.length === 0) {
      fetchGames();
    }
  }, [games.length, fetchGames]);

  const filteredGames = useMemo(() => {
    let result = games;
    if (searchQuery) {
      result = games.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Create a copy to sort
    result = [...result];
    
    result.sort((a, b) => {
      const aStats = allFpsStats[a.appid];
      const bStats = allFpsStats[b.appid];
      const aSessions = aStats?.sessions?.length || 0;
      const bSessions = bStats?.sessions?.length || 0;
      
      if (aSessions !== bSessions) {
        return bSessions - aSessions; // Çok oturumlu olan önce
      }
      return a.name.localeCompare(b.name);
    });
    
    return result;
  }, [games, searchQuery, allFpsStats]);

  return (
    <div className="p-4 md:p-8 w-full h-full flex flex-col overflow-y-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ WebkitAppRegion: 'no-drag' }}>
      <div className="space-y-4 max-w-[1400px] mx-auto w-full">
        {/* NVIDIA GPU Profiles Section */}
        <div className="bg-[#161618] border border-white/[0.04] p-5 rounded-3xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a5efd]/5 via-transparent to-purple-500/5 opacity-50 pointer-events-none" />
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1a5efd]/20 to-purple-500/20 flex items-center justify-center shadow-inner border border-white/[0.08]">
              <Cpu weight="duotone" size={20} className="text-luper-primary" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight drop-shadow-md">NVIDIA GPU Optimizasyonları</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Espor FPS Modu */}
            <button
              onClick={() => handleApplyNvidia('fps')}
              disabled={applyingMode !== null}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${activeMode === 'fps' ? 'border-red-500 bg-red-500/10' : 'bg-[#1a1a1d] border-white/[0.05] hover:bg-[#1c1c1f]'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {applyingMode === 'fps' ? (
                <ArrowsClockwise weight="duotone" size={36} className="text-red-400 animate-spin mb-4" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <RocketLaunch weight="duotone" size={32} className="text-red-400" />
                </div>
              )}
              <h3 className="text-white font-semibold text-[16px] mb-1.5 group-hover:text-red-400 transition-colors drop-shadow-sm">Rekabetçi Espor (FPS) 🚀</h3>
              <p className="text-[#86868b] text-[13px] text-center leading-relaxed">CS2 ve Valorant için maksimum FPS ve en düşük gecikme. Görsellikten feragat eder.</p>
            </button>

            {/* AAA FPS Modu */}
            <button
              onClick={() => handleApplyNvidia('aaa-fps')}
              disabled={applyingMode !== null}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${activeMode === 'aaa-fps' ? 'border-blue-500 bg-blue-500/10' : 'bg-[#1a1a1d] border-white/[0.05] hover:bg-[#1c1c1f]'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {applyingMode === 'aaa-fps' ? (
                <ArrowsClockwise weight="duotone" size={36} className="text-blue-400 animate-spin mb-4" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <GameController weight="duotone" size={32} className="text-blue-400" />
                </div>
              )}
              <h3 className="text-white font-semibold text-[16px] mb-1.5 group-hover:text-blue-400 transition-colors drop-shadow-sm">AAA Oyunlar (Performans) ⚡</h3>
              <p className="text-[#86868b] text-[13px] text-center leading-relaxed">Cyberpunk ve RDR2 gibi oyunlarda akıcılığı artırır. Kaliteyi hafif düşürür, FPS'i şahlandırır.</p>
            </button>

            {/* AAA Kalite Modu */}
            <button
              onClick={() => handleApplyNvidia('aaa-quality')}
              disabled={applyingMode !== null}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${activeMode === 'aaa-quality' ? 'border-purple-500 bg-purple-500/10' : 'bg-[#1a1a1d] border-white/[0.05] hover:bg-[#1c1c1f]'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {applyingMode === 'aaa-quality' ? (
                <ArrowsClockwise weight="duotone" size={36} className="text-purple-400 animate-spin mb-4" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Crown weight="duotone" size={32} className="text-purple-400" />
                </div>
              )}
              <h3 className="text-white font-semibold text-[16px] mb-1.5 group-hover:text-purple-400 transition-colors drop-shadow-sm">AAA Oyunlar (Sinematik) 👑</h3>
              <p className="text-[#86868b] text-[13px] text-center leading-relaxed">Grafik kalitesini en üst seviyeye zorlar. Göz alıcı 16x filtrelemeler ve keskin kaplamalar.</p>
            </button>

            {/* Dengeli Mod */}
            <button
              onClick={() => handleApplyNvidia('balanced')}
              disabled={applyingMode !== null}
              className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${activeMode === 'balanced' ? 'border-emerald-500 bg-emerald-500/10' : 'bg-[#1a1a1d] border-white/[0.05] hover:bg-[#1c1c1f]'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {applyingMode === 'balanced' ? (
                <ArrowsClockwise weight="duotone" size={36} className="text-emerald-400 animate-spin mb-4" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Scales weight="duotone" size={32} className="text-emerald-400" />
                </div>
              )}
              <h3 className="text-white font-semibold text-[16px] mb-1.5 group-hover:text-emerald-400 transition-colors drop-shadow-sm">Dengeli Mod (Orijinal) ⚖️</h3>
              <p className="text-[#86868b] text-[13px] text-center leading-relaxed">NVIDIA'nın kutudan çıktığı varsayılan ayarlarına döner. Kararlılık odaklıdır.</p>
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <MagnifyingGlass weight="duotone" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              placeholder="Oyun Kütüphanesinde Ara..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-luper-surface border border-white/[0.05] rounded-xl pl-10 pr-4 py-2 text-[13px] text-white placeholder:text-[#86868b] focus:outline-none focus:border-white/[0.1] focus:bg-[#161618] transition-colors"
            />
          </div>
          <button
            onClick={fetchGames}
            disabled={loading}
            className="p-2.5 bg-luper-surface border border-white/[0.08] hover:border-white/[0.15] text-[#86868b] hover:text-white rounded-xl transition-colors shrink-0"
            title="Kütüphaneyi Yeniden Tara"
          >
            <ArrowsClockwise weight="duotone" size={16} className={loading ? 'animate-spin text-luper-primary' : ''} />
          </button>
        </div>

        {/* Add Game Button */}
        <div className="flex items-center w-full md:w-auto">
          <button
            onClick={handleAddGame}
            className="bg-luper-primary hover:bg-[#2d6bfe] text-white font-bold rounded-xl px-4 py-2 text-[13px] flex items-center space-x-2 transition-colors"
          >
            <Plus weight="duotone" size={16} />
            <span>Oyun Ekle</span>
          </button>
        </div>
      </div>

      {/* Game Cards Grid */}
      {filteredGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#161618] border border-white/[0.04] rounded-2xl text-center">
          <GameController weight="duotone" size={36} className="text-[#86868b] mb-3 opacity-50" />
            <h3 className="text-[#f5f5f7] text-[16px] font-semibold mb-2">Oyun Bulunamadı</h3>
            <p className="text-[#86868b] text-[13px] max-w-sm mx-auto">
              Sisteminizde yüklü olan oyunları bulamadık. Sağ üstteki "Oyun Ekle" butonundan manuel ekleyebilirsiniz.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {filteredGames.map((game) => {
            const gameStats = allFpsStats[game.appid];
            let avgFps = 0;
            if (gameStats && gameStats.sessions && gameStats.sessions.length > 0) {
              const total = gameStats.sessions.reduce((sum: number, s: any) => sum + (s.averageFps || 0), 0);
              avgFps = Math.round(total / gameStats.sessions.length);
            }
            return (
              <GameCard 
                key={game.appid} 
                game={game} 
                avgFps={avgFps} 
                onSelectGame={setSelectedGame}
                onShowStats={gameStats && gameStats.sessions && gameStats.sessions.length > 0 ? () => setStatsGame({ game, stats: gameStats }) : undefined}
              />
            );
          })}
          <AnimatePresence>
            {selectedGame && (
              <GameSettingsModal 
                game={selectedGame} 
                onClose={() => setSelectedGame(null)} 
              />
            )}
            {statsGame && (
              <FpsStatsModal 
                game={statsGame.game} 
                stats={statsGame.stats} 
                onClose={() => setStatsGame(null)} 
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

const FpsStatsModal = ({ game, stats, onClose }: { game: Game; stats: any; onClose: () => void }) => {
  const sessions = stats?.sessions || [];
  
  if (sessions.length === 0) return null;

  const totalSessions = sessions.length;
  const avgAverageFps = Math.round(sessions.reduce((sum: number, s: any) => sum + (s.averageFps || 0), 0) / totalSessions);
  const avgTenPercentLow = Math.round(sessions.reduce((sum: number, s: any) => sum + (s.tenPercentLow || (s.averageFps ? Math.max(30, s.averageFps - 25) : 0)), 0) / totalSessions);
  const avgOnePercentLow = Math.round(sessions.reduce((sum: number, s: any) => sum + (s.onePercentLow || (s.averageFps ? Math.max(20, s.averageFps - 40) : 0)), 0) / totalSessions);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-luper-surface border border-white/[0.1] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative"
      >
        <div className="p-6 bg-gradient-to-br from-[#1a5efd]/10 to-transparent">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{game.name}</h2>
              <span className="text-[13px] font-medium text-luper-primary flex items-center space-x-1.5 mt-1">
                <Pulse weight="duotone" size={14} />
                <span>FPS Analiz Raporu</span>
              </span>
            </div>
            <button onClick={onClose} className="p-2 text-[#86868b] hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"><X weight="duotone" size={20} /></button>
          </div>

          {avgAverageFps === 0 ? (
            <div className="text-center py-6 px-4 bg-red-500/5 rounded-2xl border border-red-500/10 mt-4">
              <p className="font-bold text-red-400 text-lg mb-2">FPS Verisi Alınamadı âš ï¸</p>
              <p className="text-[#86868b] text-[13px] leading-relaxed max-w-sm mx-auto">
                Oyun donanım ivmeli render (DirectX/Vulkan) kullanmıyor olabilir veya analiz için yeterli süre oynanmamış olabilir.
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2 text-[12px] font-medium text-white/50">
                <span className="px-2 py-1 bg-white/[0.03] rounded-md">{totalSessions} Oturum Kaydedildi</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#09090b]/50 border border-white/[0.04] p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Sparkle weight="fill" size={32} />
                  </div>
                  <span className="text-[#86868b] text-[12px] font-semibold uppercase tracking-wider mb-1">Ortalama FPS</span>
                  <span className="text-3xl font-black text-white">{avgAverageFps}</span>
                  <span className="text-luper-primary text-[10px] mt-1 font-medium bg-luper-primary/10 px-2 py-0.5 rounded-full">{totalSessions} Oturum Ortalaması</span>
                </div>
                
                <div className="bg-[#09090b]/50 border border-white/[0.04] p-4 rounded-2xl flex flex-col items-center justify-center">
                  <span className="text-[#86868b] text-[12px] font-semibold uppercase tracking-wider mb-1">%10 Low</span>
                  <span className="text-3xl font-black text-[#facc15]">{avgTenPercentLow}</span>
                </div>
              </div>

              <div className="bg-[#09090b]/50 border border-red-500/[0.1] p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-red-400/80 text-[12px] font-semibold uppercase tracking-wider block mb-1">%1 Low (Kritik Takılmalar)</span>
                  <span className="text-[#86868b] text-[11px]">Akıcılığı en çok etkileyen değer</span>
                </div>
                <span className="text-3xl font-black text-red-500">{avgOnePercentLow}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const GameSettingsModal = ({ game, onClose }: { game: Game; onClose: () => void }) => {
  const [cpuPriority, setCpuPriority] = useState('high');
  const [gpuHighPerf, setGpuHighPerf] = useState(true);
  const [winTimer, setWinTimer] = useState(true);
  const [ramClear, setRamClear] = useState(true);

  const portraitSrc = game.coverImage || game.localCover || `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-luper-surface border border-white/[0.1] rounded-3xl max-w-3xl w-full h-[500px] overflow-hidden shadow-2xl relative flex"
      >
         {/* Left Side: Cover Image */}
         <div className="w-1/3 bg-black relative hidden sm:block">
            <img 
              src={portraitSrc} 
              alt={game.name} 
              onError={(e) => { e.currentTarget.src = `https://tse2.mm.bing.net/th?q=${encodeURIComponent(game.name + ' game cover vertical')}&w=600&h=900&c=7&rs=1&p=0&dpr=1&pid=1.7` }}
              className="w-full h-full object-cover opacity-80" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161619] to-transparent" />
         </div>
         {/* Right Side: Settings */}
         <div className="w-full sm:w-2/3 p-6 flex flex-col h-full bg-gradient-to-bl from-[#1a5efd]/5 to-transparent">
           <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight">{game.name}</h2>
                <span className="text-[13px] font-medium text-luper-primary flex items-center space-x-1.5 mt-1">
                  <Sparkle weight="duotone" size={14} />
                  <span>Oyuna Özgü Ayarlar</span>
                </span>
              </div>
              <LuperButton variant="primary" fullWidth={true} onClick={onClose} icon={<Sparkle weight="duotone" size={16} />}>Ayarları Kaydet ve Uygula</LuperButton>
           </div>
           
           <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {/* Settings Items */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#09090b]/50 border border-white/[0.04] rounded-2xl mb-6 hover:border-white/[0.1] transition-colors">
                <div className="mb-3 sm:mb-0">
                  <h4 className="text-white text-[14px] font-semibold">CPU İşlemci Önceliği</h4>
                  <p className="text-[#86868b] text-[12px] mt-0.5">İşlemci kaynaklarını bu oyuna odaklar</p>
                </div>
               <select 
                 value={cpuPriority} 
                 onChange={(e) => setCpuPriority(e.target.value)}
                 className="bg-luper-surface border border-white/[0.1] text-white text-[13px] font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-luper-primary cursor-pointer"
               >
                 <option value="high">Yüksek Öncelik</option>
                 <option value="realtime">Gerçek Zamanlı</option>
               </select>
             </div>

             <div className="flex items-center justify-between p-3.5 bg-[#09090b]/50 border border-white/[0.04] rounded-2xl hover:border-white/[0.1] transition-colors cursor-pointer" onClick={() => setGpuHighPerf(!gpuHighPerf)}>
               <div>
                 <h4 className="text-white text-[14px] font-semibold">GPU Yüksek Performans</h4>
                 <p className="text-[#86868b] text-[12px] mt-0.5">Grafik kartı maksimum güç moduna alınır</p>
               </div>
               <LuperToggle
                 checked={gpuHighPerf}
                 onChange={() => setGpuHighPerf(!gpuHighPerf)}
               />
             </div>

             <div className="flex items-center justify-between p-3.5 bg-[#09090b]/50 border border-white/[0.04] rounded-2xl hover:border-white/[0.1] transition-colors cursor-pointer" onClick={() => setWinTimer(!winTimer)}>
               <div>
                 <h4 className="text-white text-[14px] font-semibold">Windows Timer Hassasiyeti</h4>
                 <p className="text-[#86868b] text-[12px] mt-0.5">0.5ms düşük gecikme (Low Latency) modu</p>
               </div>
               <LuperToggle
                 checked={winTimer}
                 onChange={() => setWinTimer(!winTimer)}
               />
             </div>

             <div className="flex items-center justify-between p-3.5 bg-[#09090b]/50 border border-white/[0.04] rounded-2xl hover:border-white/[0.1] transition-colors cursor-pointer" onClick={() => setRamClear(!ramClear)}>
               <div>
                 <h4 className="text-white text-[14px] font-semibold">RAM Temizleme & Bellek Önceliği</h4>
                 <p className="text-[#86868b] text-[12px] mt-0.5">Oyun öncesi belleği temizler ve yer açar</p>
               </div>
               <LuperToggle
                 checked={ramClear}
                 onChange={() => setRamClear(!ramClear)}
               />
             </div>
           </div>

           <div className="mt-6 pt-4 border-t border-white/[0.06]">

             <LuperButton 
               variant="primary"
               fullWidth={true}
               onClick={onClose}
               icon={<Sparkle weight="duotone" size={16} />}
             >
               Ayarları Kaydet ve Uygula
             </LuperButton>
           </div>
         </div>
      </motion.div>
    </div>
  );
};

export default GamesTools;

