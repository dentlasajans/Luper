import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.06)"]
  );

  const navItems = ['Nasıl Çalışır', 'Oyunlar', 'Optimizasyonlar', 'Performans'];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        style={{ borderColor }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ease-out",
          isScrolled || isMobileMenuOpen ? "bg-anthracite-bg/90 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center space-x-3 cursor-pointer z-50 relative"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/logo.svg"
              alt="LUPER Logo"
              className="h-7 sm:h-8 w-auto"
            />
          </motion.div>

          <nav className="hidden md:flex space-x-8 text-sm font-medium text-text-secondary">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.replace(/\s+/g, '-').toLowerCase());
                }}
                href={`#${item.replace(/\s+/g, '-').toLowerCase()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1, ease: "easeOut" }}
                whileHover={{ color: "#f5f5f7" }}
                className="transition-colors ease-out duration-200 cursor-pointer"
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:block">
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('waitlist')}
              className="bg-white/[0.06] hover:bg-sapphire-blue text-white border border-white/[0.08] hover:border-sapphire-blue px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ease-out duration-200"
            >
              Erken Erişime Katıl
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center z-50 relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-text-secondary hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-anthracite-bg/95 backdrop-blur-2xl pt-24 px-6 md:hidden flex flex-col"
          >
            <nav className="flex flex-col space-y-6 text-lg font-medium text-white">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${item.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.replace(/\s+/g, '-').toLowerCase());
                  }}
                  className="border-b border-white/5 pb-4"
                >
                  {item}
                </motion.a>
              ))}
            </nav>
            <div className="mt-8">
              <button 
                onClick={() => scrollToSection('waitlist')}
                className="w-full bg-sapphire-blue hover:bg-sapphire-blue-hover text-white px-5 py-4 rounded-xl text-base font-medium transition-colors ease-out shadow-[0_0_20px_rgba(26,94,253,0.3)]"
              >
                Erken Erişime Katıl
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
