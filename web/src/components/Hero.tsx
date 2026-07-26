import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Clock } from 'lucide-react';

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[95vh] flex items-center justify-center">
      {/* Background Glows */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sapphire-blue/10 blur-[120px] rounded-full pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-left"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <Clock className="w-4 h-4 text-status-warning" />
            <span className="text-xs font-medium text-text-secondary">Geliştirme Aşamasında • Çok Yakında</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
            Windows İçin <br /> <span className="text-sapphire-blue">Mükemmel</span> Optimizasyon
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-text-secondary mb-10 max-w-xl leading-relaxed">
            LUPER; maksimum FPS, sıfır gecikme ve optimum Windows deneyimi sunmak için tasarlanmış yeni nesil masaüstü performans platformudur.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-sapphire-blue hover:bg-sapphire-blue-hover text-white px-8 py-4 rounded-lg font-medium transition-colors ease-out duration-200 group shadow-[0_0_20px_rgba(26,94,253,0.3)]"
            >
              <Sparkles className="w-5 h-5" />
              <span>Erken Erişime Katıl</span>
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform ease-out duration-200" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Visual Content - Floating Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="relative flex items-center justify-center mt-12 lg:mt-0"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-sapphire-blue/20 to-transparent rounded-full blur-[100px]" />
          <img
            src="/logo.svg"
            alt="LUPER Hero Logo"
            className="w-full max-w-sm h-auto relative z-10 drop-shadow-[0_0_30px_rgba(26,94,253,0.5)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
