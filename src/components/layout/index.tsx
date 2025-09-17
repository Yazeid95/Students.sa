"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const Navbar = () => {
  const { isArabic, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-morphism"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="text-xl font-bold gold-gradient">{t("seuPlans")}</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors relative group">
              {t("home")}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
              title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            >
              <span className="text-sm font-semibold">{isArabic ? "E" : "ع"}</span>
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
              title={isDark ? t("switchToLightMode") : t("switchToDarkMode")}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-4">
            {/* Language Toggle - Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
              title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            >
              <span className="text-sm font-semibold">{isArabic ? "E" : "ع"}</span>
            </button>
            
            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
              title={isDark ? t("switchToLightMode") : t("switchToDarkMode")}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
              title={isArabic ? "القائمة" : "Menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-white/10"
            >
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("home")}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const { t, isArabic } = useLanguage();
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-dark"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-primary rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-glow rounded-full filter blur-3xl"></div>
      </div>
      
      <div className={`relative z-10 max-w-6xl mx-auto px-6 text-center ${isArabic ? 'rtl' : 'ltr'}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Logo size={120} className="mx-auto mb-8" />
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            {isArabic ? (
              <>
                <span className="text-gradient">{t("heroTitle1")}</span> {t("heroTitle2")}
                <br />
                {t("heroTitle3")} <span className="gold-gradient">{t("heroTitle4")} {t("heroTitle5")}</span>
              </>
            ) : (
              <>
                {t("heroTitle1")} <span className="text-gradient">{t("heroTitle2")}</span> {t("heroTitle3")}
                <br />
                {t("heroTitle4")} <span className="gold-gradient">{t("heroTitle5")}</span>
              </>
            )}
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t("heroDescription")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t, isArabic } = useLanguage();
  
  return (
    <footer className="bg-black/50 border-t border-white/10 py-12">
      <div className={`max-w-6xl mx-auto px-6 ${isArabic ? 'rtl' : 'ltr'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={32} />
              <span className="text-lg font-bold text-white">{t("seuPlans")}</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t("empoweringStudents")}
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">{t("home")}</Link></li>
              <li><a href="https://seu.edu.sa" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">{t("saudiElectronicUniversity")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">{t("contact")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{t("saudiElectronicUniversity")}</li>
              <li>{t("riyadhSaudiArabia")}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 {t("seuStudentsPortal")}. {t("allRightsReserved")}.</p>
        </div>
      </div>
    </footer>
  );
};

export { Navbar, Hero, Footer };
