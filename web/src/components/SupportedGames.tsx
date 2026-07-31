import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const specialGames = [
  {
    id: 'cs2',
    title: 'Counter-Strike 2',
    publisher: 'Valve / Steam',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/library_600x900_2x.jpg',
    badge: 'Espor Profili Aktif'
  },
  {
    id: 'valorant',
    title: 'VALORANT',
    publisher: 'Riot Games',
    image: 'https://media.valorant-api.com/playercards/9fb348bc-41a0-91ad-8a3e-818035c4e561/largeart.png',
    badge: 'Vanguard Uyumlu'
  },
  {
    id: 'lol',
    title: 'League of Legends',
    publisher: 'Riot Games',
    image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg',
    badge: 'Sıfır Gecikme Profili'
  }
];

export function SupportedGames() {
  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              Tüm Oyunlar Desteklenir. <br className="hidden md:block" />
              <span className="text-sapphire-blue">Bazıları Çok Daha Özeldir.</span>
            </h2>
            <p className="text-text-secondary text-lg">
              LUPER, sisteminizdeki <strong>tüm oyunları</strong> otomatik olarak tanır ve genel optimizasyon uygular. Ancak aşağıdaki popüler espor odaklı oyunlar için motora özel, çok daha derin ve profesyonel yapılandırmalar sunuyoruz. (Çok yakında listeye yenileri eklenecektir.)
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="shrink-0"
          >
            <div className="inline-flex items-center space-x-2 bg-sapphire-blue/10 border border-sapphire-blue/20 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-sapphire-blue" />
              <span className="text-sm font-medium text-sapphire-blue">Özel Destekli Oyunlar</span>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {specialGames.map((game, idx) => (
            <motion.div 
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: "easeOut" }}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.08] aspect-[3/4] bg-anthracite-surface"
            >
              {/* Fallback Gradient if image fails */}
              <div className="absolute inset-0 bg-gradient-to-br from-anthracite-surface to-anthracite-bg" />
              
              {/* Game Poster Image */}
              <img 
                src={game.image} 
                alt={game.title} 
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              
              {/* Overlay Gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-sapphire-blue text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md">
                {game.badge}
              </div>
              
              {/* Text Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                <span className="text-sapphire-blue text-xs font-bold uppercase tracking-wider mb-1 block">
                  {game.publisher}
                </span>
                <h3 className="text-2xl font-bold text-white leading-tight">
                  {game.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
