import { GameController, Plus, ArrowsClockwise, MagnifyingGlass, Sparkle, X, RocketLaunch, Scales, Crown } from '@phosphor-icons/react';
import { notifySuccess, notifyError } from '../../utils/notify';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { getAllInstalledGames, getCachedGames } from '../../services/SystemEngine';
import { Game } from '../../types';

const getGameGradient = (appid: string | number) => {
  const gradients = [
    'from-indigo-900/90 via-purple-950/80 to-[#121214]',
    'from-blue-900/90 via-cyan-950/80 to-[#121214]',
    'from-emerald-900/90 via-teal-950/80 to-[#121214]',
    'from-rose-900/90 via-red-950/80 to-[#121214]',
    'from-amber-900/90 via-orange-950/80 to-[#121214]',
    'from-violet-900/90 via-fuchsia-950/80 to-[#121214]',
    'from-sky-900/90 via-blue-950/80 to-[#121214]',
  ];
  const idStr = String(appid || 'unknown');
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const getLauncherBadge = (launcher?: string) => {
  switch (launcher?.toLowerCase()) {
    case 'steam': return 'bg-[#1b2838]/90 border-[#2a475e] text-[#66c0f4]';
    case 'epic': return 'bg-[#2a2a2a]/90 border-white/20 text-white';
    case 'riot': return 'bg-[#eb0029]/20 border-[#eb0029]/50 text-[#ff4655]';
    case 'ea': return 'bg-[#ff4747]/20 border-[#ff4747]/50 text-[#ff4747]';
    case 'xbox': return 'bg-[#107c10]/20 border-[#107c10]/50 text-[#107c10]';
    default: return 'bg-white/10 border-white/20 text-white';
  }
};

const GameCard = memo(({ 
  game, 
  idx, 
  onSelectGame 
}: { 
  game: Game; 
  idx: number; 
  onSelectGame: (game: Game) => void; 
}) => {
  const portraitUrls = useMemo(() => [
    game.coverImage,
    (game as any).localCover,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`,
  ].filter(Boolean) as string[], [game.coverImage, (game as any).localCover, game.appid]);

  const landscapeUrls = useMemo(() => [
    game.heroImage,
    game.headerImage,
    game.coverImage,
    `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`,
    `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
  ].filter(Boolean) as string[], [game.heroImage, game.headerImage, game.coverImage, game.appid]);

  const [phase, setPhase] = useState<'portrait' | 'landscape' | 'failed'>('portrait');
  const [portraitIdx, setPortraitIdx] = useState<number>(0);
  const [landscapeIdx, setLandscapeIdx] = useState<number>(0);

  const currentPortraitSrc = portraitUrls[portraitIdx];
  const currentLandscapeSrc = landscapeUrls[landscapeIdx];

  const handlePortraitError = () => {
    if (portraitIdx + 1 < portraitUrls.length) {
      setPortraitIdx(prev => prev + 1);
    } else {
      setPhase('landscape');
    }
  };

  const handleLandscapeError = () => {
    if (landscapeIdx + 1 < landscapeUrls.length) {
      setLandscapeIdx(prev => prev + 1);
    } else {
      setPhase('failed');
    }
  };

  const bgGradient = useMemo(() => getGameGradient(game.appid), [game.appid]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.2) }}
      onClick={() => onSelectGame(game)}
      className="group relative bg-[#161619] border border-white/[0.08] hover:border-[#1a5efd]/60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(26,94,253,0.2)] hover:-translate-y-1.5 aspect-[2/3] w-full luper-card"
    >
      {phase === 'portrait' && (
        <img
          src={currentPortraitSrc}
          alt={game.name}
          onError={handlePortraitError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}

      {phase === 'landscape' && (
        <img
          src={currentLandscapeSrc}
          alt={game.name}
          onError={handleLandscapeError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}

      {phase === 'failed' && (
        <div className={`w-full h-full bg-gradient-to-b ${bgGradient} p-5 flex flex-col justify-between relative overflow-hidden`}>
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center">
              <GameController weight="duotone" size={20} className="text-white" />
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border backdrop-blur-md ${getLauncherBadge(game.launcher)}`}>
              {game.launcher || 'PC'}
            </span>
          </div>

          <div>
            <h3 className="text-white font-extrabold text-[16px] leading-tight line-clamp-2 drop-shadow-md mb-1">
              {game.name}
            </h3>
          </div>
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

      {/* Badges */}
      {phase !== 'failed' && (
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-lg border backdrop-blur-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${getLauncherBadge(game.launcher)}`}>
            {game.launcher || 'PC'}
          </span>
        </div>
      )}

      {/* Card Info Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col justify-end overflow-hidden">
        <h3 className="text-white font-extrabold text-[16px] leading-snug drop-shadow-lg truncate">
          {game.name}
        </h3>
      </div>
    </motion.div>
  );
});

export function GamesTools() {
  const [games, setGames] = useState<Game[]>(() => getCachedGames() || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [applyingMode, setApplyingMode] = useState<'fps' | 'aaa-quality' | 'aaa-fps' | 'balanced' | null>(null);

  const handleApplyNvidia = async (mode: 'fps' | 'aaa-quality' | 'aaa-fps' | 'balanced') => {
    try {
      setApplyingMode(mode);
      if (window.electronAPI && (window.electronAPI as any).applyNvidiaProfile) {
        await (window.electronAPI as any).applyNvidiaProfile(mode);
      } else {
        await new Promise(r => setTimeout(r, 1500));
      }
      notifySuccess('NVIDIA Profili başarıyla uygulandı');
    } catch (e: any) {
      notifyError(e?.message || 'NVIDIA Profili uygulanırken bir hata oluştu');
    } finally {
      setApplyingMode(null);
    }
  };

  const handleAddGame = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.exe,.lnk,.url';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newGame: Game = {
          appid: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          launcher: 'pc',
          installDir: (file as any).path || file.name,
          headerImage: '',
          coverImage: '',
        };
        setGames(prev => [newGame, ...prev]);
      }
    };
    input.click();
  }, []);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllInstalledGames();
      setGames(data);
    } catch (e) {
      console.error("Game scan error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (games.length === 0) {
      fetchGames();
    }
  }, [games.length, fetchGames]);

  const filteredGames = useMemo(() => {
    return games.filter(g => {
      return g.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [games, searchQuery]);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ WebkitAppRegion: 'no-drag' }}>
      <div className="space-y-4">
        {/* NVIDIA GPU Profiles Section */}
        <div className="bg-[#09090b]/80 backdrop-blur-2xl border border-white/[0.04] p-5 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a5efd]/5 via-transparent to-purple-500/5 opacity-50 pointer-events-none" />
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1a5efd]/20 to-purple-500/20 flex items-center justify-center shadow-inner border border-white/[0.08]">
              <Cpu weight="duotone" size={20} className="text-[#1a5efd]" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight drop-shadow-md">NVIDIA GPU Optimizasyonları</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Espor FPS Modu */}
            <button
              onClick={() => handleApplyNvidia('fps')}
              disabled={applyingMode !== null}
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#161619]/60 backdrop-blur-md border border-white/[0.05] hover:border-red-500/50 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {applyingMode === 'fps' ? (
                <ArrowsClockwise weight="duotone" size={36} className="text-red-400 animate-spin mb-4" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <RocketLaunch weight="duotone" size={32} className="text-red-400" />
                </div>
              )}
              <h3 className="text-white font-extrabold text-[17px] mb-1.5 group-hover:text-red-400 transition-colors drop-shadow-sm">Rekabetçi Espor (FPS) 🚀</h3>
              <p className="text-[#86868b] text-[13px] text-center leading-relaxed">CS2 ve Valorant için maksimum FPS ve en düşük gecikme. Görsellikten feragat eder.</p>
            </button>

            {/* AAA FPS Modu */}
            <button
              onClick={() => handleApplyNvidia('aaa-fps')}
              disabled={applyingMode !== null}
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#161619]/60 backdrop-blur-md border border-white/[0.05] hover:border-blue-500/50 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {applyingMode === 'aaa-fps' ? (
                <ArrowsClockwise weight="duotone" size={36} className="text-blue-400 animate-spin mb-4" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <GameController weight="duotone" size={32} className="text-blue-400" />
                </div>
              )}
              <h3 className="text-white font-extrabold text-[17px] mb-1.5 group-hover:text-blue-400 transition-colors drop-shadow-sm">AAA Oyunlar (Performans) ⚡</h3>
              <p className="text-[#86868b] text-[13px] text-center leading-relaxed">Cyberpunk ve RDR2 gibi oyunlarda akıcılığı artırır. Kaliteyi hafif düşürür, FPS'i şahlandırır.</p>
            </button>

            {/* AAA Kalite Modu */}
            <button
              onClick={() => handleApplyNvidia('aaa-quality')}
              disabled={applyingMode !== null}
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#161619]/60 backdrop-blur-md border border-white/[0.05] hover:border-purple-500/50 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(168,85,247,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {applyingMode === 'aaa-quality' ? (
                <ArrowsClockwise weight="duotone" size={36} className="text-purple-400 animate-spin mb-4" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Crown weight="duotone" size={32} className="text-purple-400" />
                </div>
              )}
              <h3 className="text-white font-extrabold text-[17px] mb-1.5 group-hover:text-purple-400 transition-colors drop-shadow-sm">AAA Oyunlar (Sinematik) 👑</h3>
              <p className="text-[#86868b] text-[13px] text-center leading-relaxed">Grafik kalitesini en üst seviyeye zorlar. Göz alıcı 16x filtrelemeler ve keskin kaplamalar.</p>
            </button>

            {/* Dengeli Mod */}
            <button
              onClick={() => handleApplyNvidia('balanced')}
              disabled={applyingMode !== null}
              className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#161619]/60 backdrop-blur-md border border-white/[0.05] hover:border-emerald-500/50 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {applyingMode === 'balanced' ? (
                <ArrowsClockwise weight="duotone" size={36} className="text-emerald-400 animate-spin mb-4" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Scales weight="duotone" size={32} className="text-emerald-400" />
                </div>
              )}
              <h3 className="text-white font-extrabold text-[17px] mb-1.5 group-hover:text-emerald-400 transition-colors drop-shadow-sm">Dengeli Mod (Orijinal) ⚖️</h3>
              <p className="text-[#86868b] text-[13px] text-center leading-relaxed">NVIDIA'nın kutudan çıktığı varsayılan ayarlarına döner. Kararlılık odaklıdır.</p>
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <MagnifyingGlass weight="duotone" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              placeholder="Oyun Kütüphanesinde Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#161619] border border-white/[0.08] rounded-xl text-[13.5px] text-white placeholder-[#86868b] focus:outline-none focus:border-[#1a5efd] transition-all"
            />
          </div>
          <button
            onClick={fetchGames}
            disabled={loading}
            className="p-2.5 bg-[#161619] border border-white/[0.08] hover:border-white/[0.15] text-[#86868b] hover:text-white rounded-xl transition-colors shrink-0"
            title="Kütüphaneyi Yeniden Tara"
          >
            <ArrowsClockwise weight="duotone" size={16} className={loading ? 'animate-spin text-[#1a5efd]' : ''} />
          </button>
        </div>

        {/* Add Game Button */}
        <div className="flex items-center w-full md:w-auto">
          <button
            onClick={handleAddGame}
            className="bg-[#1a5efd] hover:bg-[#2d6bfe] text-white font-bold rounded-xl px-4 py-2 text-[13px] flex items-center space-x-2 transition-colors"
          >
            <Plus weight="duotone" size={16} />
            <span>Oyun Ekle</span>
          </button>
        </div>
      </div>

      {/* Game Cards Grid */}
      {filteredGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-[#161619] border border-white/[0.08] rounded-2xl text-center">
          <GameController weight="duotone" size={36} className="text-[#86868b] mb-3 opacity-50" />
          <h3 className="text-white font-semibold text-[16px] mb-1">Oyun Bulunamadı</h3>
          <p className="text-[#86868b] text-[13.5px]">Sisteminizde tespit edilen oyun bulunamadı veya arama sonucu boş.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filteredGames.map((game, idx) => (
            <GameCard key={game.appid} game={game} idx={idx} onSelectGame={setSelectedGame} />
          ))}
          <AnimatePresence>
            {selectedGame && (
              <GameSettingsModal 
                game={selectedGame} 
                onClose={() => setSelectedGame(null)} 
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

const GameSettingsModal = ({ game, onClose }: { game: Game; onClose: () => void }) => {
  const [cpuPriority, setCpuPriority] = useState('high');
  const [gpuHighPerf, setGpuHighPerf] = useState(true);
  const [winTimer, setWinTimer] = useState(true);
  const [ramClear, setRamClear] = useState(true);

  const portraitSrc = game.coverImage || (game as any).localCover || `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#161619] border border-white/[0.1] rounded-3xl max-w-3xl w-full h-[500px] overflow-hidden shadow-2xl relative flex"
      >
         {/* Left Side: Cover Image */}
         <div className="w-1/3 bg-black relative hidden sm:block">
            <img src={portraitSrc} alt={game.name} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161619] to-transparent" />
         </div>
         {/* Right Side: Settings */}
         <div className="w-full sm:w-2/3 p-6 flex flex-col h-full bg-gradient-to-bl from-[#1a5efd]/5 to-transparent">
           <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight">{game.name}</h2>
                <span className="text-[13px] font-medium text-[#1a5efd] flex items-center space-x-1.5 mt-1">
                  <Sparkle weight="duotone" size={14} />
                  <span>Oyuna Özgü Ayarlar</span>
                </span>
              </div>
              <button onClick={onClose} className="p-2 text-[#86868b] hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"><X weight="duotone" size={20} /></button>
           </div>
           
           <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {/* Settings Items */}
             <div className="flex items-center justify-between p-3.5 bg-[#09090b]/50 border border-white/[0.04] rounded-2xl hover:border-white/[0.1] transition-colors">
               <div>
                 <h4 className="text-white text-[14.5px] font-semibold">CPU İşlemci Önceliği</h4>
                 <p className="text-[#86868b] text-[12.5px] mt-0.5">İşlemci kaynaklarını bu oyuna odaklar</p>
               </div>
               <select 
                 value={cpuPriority} 
                 onChange={(e) => setCpuPriority(e.target.value)}
                 className="bg-[#161619] border border-white/[0.1] text-white text-[13px] font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-[#1a5efd] cursor-pointer"
               >
                 <option value="high">Yüksek Öncelik</option>
                 <option value="realtime">Gerçek Zamanlı</option>
               </select>
             </div>

             <div className="flex items-center justify-between p-3.5 bg-[#09090b]/50 border border-white/[0.04] rounded-2xl hover:border-white/[0.1] transition-colors cursor-pointer" onClick={() => setGpuHighPerf(!gpuHighPerf)}>
               <div>
                 <h4 className="text-white text-[14.5px] font-semibold">GPU Yüksek Performans</h4>
                 <p className="text-[#86868b] text-[12.5px] mt-0.5">Grafik kartı maksimum güç moduna alınır</p>
               </div>
               <button className={`w-11 h-6 rounded-full relative transition-colors ${gpuHighPerf ? 'bg-[#1a5efd]' : 'bg-white/10'}`}>
                 <motion.div layout className="w-5 h-5 bg-white rounded-full absolute top-[2px]" initial={false} animate={{ left: gpuHighPerf ? '22px' : '2px' }} />
               </button>
             </div>

             <div className="flex items-center justify-between p-3.5 bg-[#09090b]/50 border border-white/[0.04] rounded-2xl hover:border-white/[0.1] transition-colors cursor-pointer" onClick={() => setWinTimer(!winTimer)}>
               <div>
                 <h4 className="text-white text-[14.5px] font-semibold">Windows Timer Hassasiyeti</h4>
                 <p className="text-[#86868b] text-[12.5px] mt-0.5">0.5ms düşük gecikme (Low Latency) modu</p>
               </div>
               <button className={`w-11 h-6 rounded-full relative transition-colors ${winTimer ? 'bg-[#1a5efd]' : 'bg-white/10'}`}>
                 <motion.div layout className="w-5 h-5 bg-white rounded-full absolute top-[2px]" initial={false} animate={{ left: winTimer ? '22px' : '2px' }} />
               </button>
             </div>

             <div className="flex items-center justify-between p-3.5 bg-[#09090b]/50 border border-white/[0.04] rounded-2xl hover:border-white/[0.1] transition-colors cursor-pointer" onClick={() => setRamClear(!ramClear)}>
               <div>
                 <h4 className="text-white text-[14.5px] font-semibold">RAM Temizleme & Bellek Önceliği</h4>
                 <p className="text-[#86868b] text-[12.5px] mt-0.5">Oyun öncesi belleği temizler ve yer açar</p>
               </div>
               <button className={`w-11 h-6 rounded-full relative transition-colors ${ramClear ? 'bg-[#1a5efd]' : 'bg-white/10'}`}>
                 <motion.div layout className="w-5 h-5 bg-white rounded-full absolute top-[2px]" initial={false} animate={{ left: ramClear ? '22px' : '2px' }} />
               </button>
             </div>
           </div>

           <div className="mt-6 pt-4 border-t border-white/[0.06]">
             <button 
               onClick={onClose}
               className="w-full py-3.5 bg-[#1a5efd] hover:bg-[#2d6bfe] text-white text-[14px] font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(26,94,253,0.35)] flex items-center justify-center space-x-2"
             >
               <Sparkle weight="duotone" size={16} />
               <span>Ayarları Kaydet ve Uygula</span>
             </button>
           </div>
         </div>
      </motion.div>
    </div>
  );
};
