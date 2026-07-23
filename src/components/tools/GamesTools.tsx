import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Play, Search, RefreshCw, HardDrive, Folder, Zap, X } from 'lucide-react';
import { SteamGame } from '../../types';
import { getInstalledSteamGames, launchSteamGame, getCachedSteamGames } from '../../services/SystemEngine';

const getGameGradient = (appid: string) => {
  const gradients = [
    'from-indigo-900/90 via-purple-950/80 to-[#121214]',
    'from-blue-900/90 via-cyan-950/80 to-[#121214]',
    'from-emerald-900/90 via-teal-950/80 to-[#121214]',
    'from-rose-900/90 via-red-950/80 to-[#121214]',
    'from-amber-900/90 via-orange-950/80 to-[#121214]',
    'from-violet-900/90 via-fuchsia-950/80 to-[#121214]',
    'from-sky-900/90 via-blue-950/80 to-[#121214]',
  ];
  let hash = 0;
  for (let i = 0; i < appid.length; i++) {
    hash = appid.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const GameCard = React.memo(({ 
  game, 
  idx, 
  onSelectGame 
}: { 
  game: SteamGame; 
  idx: number; 
  onSelectGame: (game: SteamGame) => void; 
}) => {
  // Same URL priority as the detail modal — proven to work
  // Portrait (vertical) phase → Landscape (horizontal) phase → Gradient fallback
  const portraitUrls = useMemo(() => [
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg`,
  ], [game.appid]);

  const landscapeUrls = useMemo(() => [
    game.heroImage,
    game.headerImage,
    game.coverImage,
    `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.appid}/header.jpg`,
    `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_616x353.jpg`,
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

  const formatSizeGB = (sizeBytes?: number) => {
    if (!sizeBytes || sizeBytes === 0) return '';
    const gb = sizeBytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.2) }}
      onClick={() => onSelectGame(game)}
      className="group relative bg-[#18181c] border border-white/[0.08] hover:border-brand-primary/60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 aspect-[2/3] w-full"
    >
      {phase === 'portrait' && (
        <img
          src={currentPortraitSrc}
          alt={game.name}
          onError={handlePortraitError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {phase === 'landscape' && (
        <img
          src={currentLandscapeSrc}
          alt={game.name}
          onError={handleLandscapeError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}


      {phase === 'failed' && (
        <div className={`w-full h-full bg-gradient-to-br ${bgGradient} flex flex-col items-center justify-center p-6 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-white/[0.1] border border-white/[0.2] flex items-center justify-center mb-3 shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-300">
            <Gamepad2 size={32} className="text-brand-primary" />
          </div>
          <span className="text-[15px] font-bold text-white tracking-wide line-clamp-3 relative z-10 drop-shadow">
            {game.name}
          </span>
        </div>
      )}

      {/* Persistent Title Overlay at Bottom */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3.5 flex flex-col justify-end z-20 pointer-events-none">
        <h3 className="text-[14.5px] font-bold text-white tracking-wide truncate group-hover:text-brand-primary transition-colors">
          {game.name}
        </h3>
        {game.sizeBytes ? (
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-text-muted/80 mt-0.5">
            <HardDrive size={10} className="text-brand-primary" />
            <span>{formatSizeGB(game.sizeBytes)}</span>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
});




export function GamesTools() {
  const cached = getCachedSteamGames();
  const [games, setGames] = useState<SteamGame[]>(cached || []);
  const [loading, setLoading] = useState<boolean>(!cached);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'recent'>('name');
  const [selectedGame, setSelectedGame] = useState<SteamGame | null>(null);

  const [optimizedAppids, setOptimizedAppids] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('steam_optimized_games');
      if (stored) return new Set(JSON.parse(stored));
    } catch (e) {}
    return new Set(['2344520', '2661300', '1604030']);
  });

  const fetchGames = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    try {
      const data = await getInstalledSteamGames(forceRefresh);
      setGames(data);
    } catch (e) {
      console.error('Failed to load Steam games:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames(true);
  }, [fetchGames]);

  const handleLaunch = useCallback((appid: string) => {
    launchSteamGame(appid);
  }, []);

  const handleToggleOptimize = useCallback((appid: string) => {
    setOptimizedAppids((prev) => {
      const next = new Set(prev);
      if (next.has(appid)) {
        next.delete(appid);
      } else {
        next.add(appid);
      }
      localStorage.setItem('steam_optimized_games', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  // Filter & Sort
  const filteredGames = useMemo(() => {
    let result = games.filter((g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'size') {
      result.sort((a, b) => (b.sizeBytes || 0) - (a.sizeBytes || 0));
    } else if (sortBy === 'recent') {
      result.sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0));
    }

    return result;
  }, [games, searchTerm, sortBy]);

  const totalSizeBytes = useMemo(() => {
    return games.reduce((acc, g) => acc + (g.sizeBytes || 0), 0);
  }, [games]);

  const formatTotalGB = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div className="h-full w-full flex flex-col p-6 md:p-8 overflow-y-auto space-y-6">
      {/* Top Banner Header - Spacious, Full-Width & Unclipped */}
      <div className="relative bg-[#18181c] border border-white/[0.08] rounded-2xl p-6 md:p-8 w-full shadow-xl">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary/25 to-brand-primary/5 border border-brand-primary/40 flex items-center justify-center text-brand-primary shadow-inner shrink-0 mt-0.5">
              <Gamepad2 size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <h1 className="text-[24px] font-bold text-[#f5f5f7] tracking-tight">
                  Oyun Kütüphanesi
                </h1>
                <span className="bg-brand-primary/15 border border-brand-primary/30 text-brand-primary text-[12px] font-semibold px-3 py-1 rounded-full shrink-0">
                  {games.length} Yüklü Oyun
                </span>
              </div>
              <p className="text-text-muted text-[14px] mt-2 leading-relaxed max-w-3xl">
                Bilgisayarınızda yüklü olan Steam oyunlarını kapak görselleri ile görüntüleyin ve detaylar için kartlara tıklayın.
              </p>
            </div>
          </div>

          <div className="shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => fetchGames(true)}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-text-muted hover:text-white transition-all duration-200 flex items-center space-x-2 text-[13px] font-medium shadow-md whitespace-nowrap"
              title="Kütüphaneyi Yeniden Tara"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-brand-primary' : ''} />
              <span>Yeniden Tara</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Full-Width */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div className="relative flex-1 max-w-md w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/60" />
          <input
            type="text"
            placeholder="Yüklü oyunlarda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-white placeholder-text-muted/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-[12.5px] text-text-muted/80 font-mono">
            Toplam Alan: <span className="text-white font-semibold">{formatTotalGB(totalSizeBytes)}</span>
          </div>

          <div className="flex items-center space-x-1 bg-white/[0.03] border border-white/[0.08] rounded-xl p-1 text-[12px]">
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                sortBy === 'name' ? 'bg-white/10 text-white font-semibold' : 'text-text-muted hover:text-white'
              }`}
            >
              A-Z
            </button>
            <button
              onClick={() => setSortBy('size')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                sortBy === 'size' ? 'bg-white/10 text-white font-semibold' : 'text-text-muted hover:text-white'
              }`}
            >
              Boyut
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                sortBy === 'recent' ? 'bg-white/10 text-white font-semibold' : 'text-text-muted hover:text-white'
              }`}
            >
              Son Oynanan
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid - Responsive Full-Width Auto-Fill */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-text-muted space-y-3">
          <RefreshCw size={32} className="animate-spin text-brand-primary" />
          <p className="text-[15px] font-medium">Oyun kütüphanesi taranıyor...</p>
        </div>
      ) : filteredGames.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-5 w-full pb-6">
          {filteredGames.map((game, idx) => (
            <GameCard
              key={game.appid}
              game={game}
              idx={idx}
              onSelectGame={setSelectedGame}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl text-center space-y-4 w-full">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-text-muted">
            <Gamepad2 size={32} />
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-white">Yüklü Oyunu Bulunamadı</h3>
            <p className="text-text-muted text-[13.5px] mt-1 max-w-md">
              {searchTerm
                ? `"${searchTerm}" aramasına uygun oyun bulunamadı.`
                : 'Bilgisayarınızda yüklü bir Steam oyunu bulunamadı.'}
            </p>
          </div>
          <button
            onClick={() => fetchGames(true)}
            className="px-5 py-2.5 bg-brand-primary text-white rounded-xl text-[13.5px] font-medium hover:bg-[#2b6eff] transition-colors shadow-lg shadow-brand-primary/20"
          >
            Yeniden Tara
          </button>
        </div>
      )}

      {/* Game Details Modal */}
      <AnimatePresence>
        {selectedGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#18181c] border border-white/[0.1] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              {/* Modal Hero Banner */}
              <div className="relative h-56 w-full bg-black/60 overflow-hidden">
                <img
                  src={selectedGame.heroImage || selectedGame.headerImage || selectedGame.coverImage}
                  alt={selectedGame.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181c] via-[#18181c]/60 to-transparent" />
                <button
                  onClick={() => setSelectedGame(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-colors z-20 shadow-lg"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-10">
                  <div>
                    <span className="bg-brand-primary/20 border border-brand-primary/40 text-brand-primary text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      AppID: {selectedGame.appid}
                    </span>
                    <h2 className="text-[24px] font-extrabold text-white leading-tight mt-1">
                      {selectedGame.name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 text-[13.5px]">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 bg-white/[0.03] border border-white/[0.04] p-4 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-brand-primary shrink-0">
                      <HardDrive size={18} />
                    </div>
                    <div>
                      <span className="text-text-muted text-[11.5px] block">Disk Boyutu</span>
                      <span className="text-white font-bold font-mono text-[14px]">
                        {formatTotalGB(selectedGame.sizeBytes || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-brand-primary shrink-0">
                      <Folder size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-text-muted text-[11.5px] block">Kurulum Klasörü</span>
                      <span className="text-white font-semibold truncate block text-[13px]">
                        {selectedGame.installDir || selectedGame.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Tweaks Option */}
                <div className="space-y-2.5">
                  <h4 className="text-[14px] font-semibold text-white flex items-center space-x-2">
                    <Zap size={16} className="text-brand-primary" />
                    <span>Performans & Sistem Ayarları</span>
                  </h4>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-colors">
                      <div>
                        <span className="text-white font-semibold block text-[13.5px]">Yüksek CPU Önceliği</span>
                        <span className="text-text-muted text-[11.5px]">İşlemci çekirdeklerini bu oyuna öncelikli atar</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={optimizedAppids.has(selectedGame.appid)}
                        onChange={() => handleToggleOptimize(selectedGame.appid)}
                        className="w-4.5 h-4.5 accent-brand-primary rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-colors">
                      <div>
                        <span className="text-white font-semibold block text-[13.5px]">Donanım Hızlandırmalı GPU Zamanlaması</span>
                        <span className="text-text-muted text-[11.5px]">FPS artışı için varsayılan GPU optimizasyonu</span>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4.5 h-4.5 accent-brand-primary rounded"
                      />
                    </label>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-3 flex items-center justify-end space-x-3 border-t border-white/[0.06]">
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-text-muted hover:text-white font-medium transition-colors"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={() => {
                      handleLaunch(selectedGame.appid);
                      setSelectedGame(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-[#2b6eff] text-white font-semibold transition-colors flex items-center space-x-2 shadow-lg shadow-brand-primary/25"
                  >
                    <Play size={16} className="fill-current" />
                    <span>Oyunu Çalıştır</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
