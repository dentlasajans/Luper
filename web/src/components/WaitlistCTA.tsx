import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export function WaitlistCTA() {
  return (
    <section id="waitlist" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-sapphire-blue/5" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-anthracite-surface border border-white/[0.08] rounded-3xl p-10 md:p-16 shadow-[0_0_50px_rgba(26,94,253,0.1)] relative overflow-hidden"
        >
          {/* Decorative glow inside card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-sapphire-blue/20 blur-[80px] rounded-full pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6 relative z-10">
            İlk Deneyenlerden Olun
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-xl mx-auto relative z-10">
            LUPER şu anda kapalı beta aşamasındadır. E-posta adresinizi bırakarak, yayınlandığı an erken erişim hakkı kazanın.
          </p>
          
          <form className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="E-posta adresiniz..." 
              required
              className="w-full bg-anthracite-bg border border-white/[0.1] text-white px-6 py-4 rounded-xl focus:outline-none focus:border-sapphire-blue focus:ring-1 focus:ring-sapphire-blue transition-all duration-200"
            />
            <button 
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-sapphire-blue hover:bg-sapphire-blue-hover text-white px-8 py-4 rounded-xl font-medium transition-colors ease-out duration-200 shrink-0"
            >
              <span>Gönder</span>
              <Send className="w-4 h-4 ml-1" />
            </button>
          </form>
          
          <p className="mt-6 text-xs text-text-secondary relative z-10">
            Spam göndermiyoruz. Sadece büyük bir lansmanda haber vereceğiz.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
