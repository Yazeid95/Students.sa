"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

interface LanguageContextType {
  isArabic: boolean;
  toggleLanguage: () => void;
  t: (key: string) => string;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations = {
  en: {
    // Navbar
    home: "Home",
    seuPlans: "SEU Plans",
    
    // Hero Section
    heroTitle1: "Your",
    heroTitle2: "Future", 
    heroTitle3: "Starts",
    heroTitle4: "at",
    heroTitle5: "SEU",
    heroDescription: "Unleash your potential through our academic roadmap. Explore 4 colleges and 12+ majors crafted to guide today's students into becoming tomorrow's success architects.",
    
    // Sign In Form
    getStarted: "Get Started",
    getStartedDescription: "Enter your details to explore your academic journey",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    studentId: "Student ID",
    studentIdPlaceholder: "e.g. 123456789",
    continueToColleges: "Continue to Colleges",
    pleaseFileFields: "Please fill in both fields.",
    
    // Colleges Page
    chooseCollege: "Choose Your College",
    chooseYourPath: "Choose Your Path",
    welcomeBack: "Welcome back",
    loadingUser: "Loading user...",
    collegeDescription: "Select from our prestigious colleges and discover your path to academic excellence.",
    
    // College Names
    collegeOfAdminFinancial: "College of Administrative and Financial Sciences",
    adminFinancialDescription: "Shape the future of business and finance with cutting-edge programs",
    collegeOfComputing: "College of Computing and Informatics",
    computingDescription: "Pioneer the digital revolution with advanced technology programs",
    collegeOfHealthSciences: "College of Health Sciences",
    healthDescription: "Transform healthcare through innovation and compassionate care",
    collegeOfScienceTheoretical: "College Of Science and Theoretical Studies",
    scienceTheoreticalDescription: "Explore knowledge across diverse academic disciplines",
    
    // Major Names
    management: "Management",
    eCommerce: "E-Commerce",
    accounting: "Accounting",
    finance: "Finance",
    computerScience: "Computer Science",
    dataScience: "Data Science",
    informationTechnology: "Information Technology",
    healthInformatics: "Health Informatics",
    publicHealth: "Public Health",
    law: "Law",
    digitalMedia: "Digital Media",
    englishTranslation: "English Language and Translation",
    
    exploreMajors: "Explore Majors",
    exploreCurriculum: "Explore curriculum & career paths",
    loading: "Loading...",
    
    // Footer
    empoweringStudents: "Empowering students to achieve academic excellence and build successful careers.",
    quickLinks: "Quick Links",
    contact: "Contact",
    saudiElectronicUniversity: "Saudi Electronic University",
    riyadhSaudiArabia: "Riyadh, Saudi Arabia",
    allRightsReserved: "All rights reserved",
    seuStudentsPortal: "SEU Students Portal",
    
    // Common
    welcome: "Welcome",
    signOut: "Sign Out",
    signIn: "Sign In",
    switchToArabic: "Switch to Arabic",
    switchToEnglish: "Switch to English",
    switchToLightMode: "Switch to Light Mode",
    switchToDarkMode: "Switch to Dark Mode"
  },
  ar: {
    // Navbar
    home: "الرئيسية",
    seuPlans: "خطط الجامعة السعودية الإلكترونية",
    
    // Hero Section
    heroTitle1: "مستقبلك",
    heroTitle2: "يبدأ", 
    heroTitle3: "في",
    heroTitle4: "الجامعة",
    heroTitle5: "السعودية الإلكترونية",
    heroDescription: "أطلق إمكاناتك من خلال خارطة الطريق الأكاديمية. استكشف 4 كليات و12+ تخصص مصمم لتوجيه طلاب اليوم ليصبحوا مهندسي نجاح الغد.",
    
    // Sign In Form
    getStarted: "ابدأ الآن",
    getStartedDescription: "أدخل بياناتك لاستكشاف رحلتك الأكاديمية",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "أدخل اسمك الكامل",
    studentId: "الرقم الجامعي",
    studentIdPlaceholder: "مثال: 123456789",
    continueToColleges: "متابعة إلى الكليات",
    pleaseFileFields: "يرجى ملء جميع الحقول.",
    
    // Colleges Page
    chooseCollege: "اختر كليتك",
    chooseYourPath: "اختر مسارك",
    welcomeBack: "مرحباً بعودتك",
    loadingUser: "جاري تحميل بيانات المستخدم...",
    collegeDescription: "اختر من كلياتنا المرموقة واكتشف طريقك إلى التميز الأكاديمي.",
    
    // College Names
    collegeOfAdminFinancial: "كلية العلوم الإدارية والمالية",
    adminFinancialDescription: "اشكل مستقبل الأعمال والتمويل ببرامج متطورة",
    collegeOfComputing: "كلية الحاسب والمعلوماتية",
    computingDescription: "كن رائداً في الثورة الرقمية ببرامج التكنولوجيا المتقدمة",
    collegeOfHealthSciences: "كلية العلوم الصحية",
    healthDescription: "حول الرعاية الصحية من خلال الابتكار والرعاية الرحيمة",
    collegeOfScienceTheoretical: "كلية العلوم والدراسات النظرية",
    scienceTheoreticalDescription: "استكشف المعرفة عبر التخصصات الأكاديمية المتنوعة",
    
    // Major Names
    management: "الإدارة",
    eCommerce: "التجارة الإلكترونية",
    accounting: "المحاسبة",
    finance: "التمويل",
    computerScience: "علوم الحاسب",
    dataScience: "علوم البيانات",
    informationTechnology: "تقنية المعلومات",
    healthInformatics: "المعلوماتية الصحية",
    publicHealth: "الصحة العامة",
    law: "القانون",
    digitalMedia: "الإعلام الرقمي",
    englishTranslation: "اللغة الإنجليزية والترجمة",
    
    exploreMajors: "استكشف التخصصات",
    exploreCurriculum: "استكشف المنهج والمسارات المهنية",
    loading: "جاري التحميل...",
    
    // Footer
    empoweringStudents: "تمكين الطلاب لتحقيق التميز الأكاديمي وبناء مسيرات مهنية ناجحة.",
    quickLinks: "روابط سريعة",
    contact: "تواصل معنا",
    saudiElectronicUniversity: "الجامعة السعودية الإلكترونية",
    riyadhSaudiArabia: "الرياض، المملكة العربية السعودية",
    allRightsReserved: "جميع الحقوق محفوظة",
    seuStudentsPortal: "بوابة طلاب الجامعة السعودية الإلكترونية",
    
    // Common
    welcome: "مرحباً",
    signOut: "تسجيل الخروج",
    signIn: "تسجيل الدخول",
    switchToArabic: "التبديل إلى العربية",
    switchToEnglish: "التبديل إلى الإنجليزية",
    switchToLightMode: "التبديل إلى الوضع الفاتح",
    switchToDarkMode: "التبديل إلى الوضع الداكن"
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) {
        const arabic = savedLanguage === "ar";
        setIsArabic(arabic);
        updateDocumentLanguage(arabic);
      }
    } catch (error) {
      console.error("Error loading language preference:", error);
    }
  }, []);

  const updateDocumentLanguage = (arabic: boolean) => {
    document.documentElement.dir = arabic ? "rtl" : "ltr";
    document.documentElement.lang = arabic ? "ar" : "en";
  };

  const toggleLanguage = useCallback(() => {
    const newLanguage = !isArabic;
    setIsArabic(newLanguage);
    localStorage.setItem("language", newLanguage ? "ar" : "en");
    updateDocumentLanguage(newLanguage);
  }, [isArabic]);

  const t = useCallback((key: string): string => {
    const lang = isArabic ? "ar" : "en";
    return translations[lang][key as keyof typeof translations.en] || key;
  }, [isArabic]);

  const direction: 'rtl' | 'ltr' = useMemo(() => isArabic ? 'rtl' : 'ltr', [isArabic]);

  const value = useMemo(() => ({
    isArabic,
    toggleLanguage,
    t,
    direction
  }), [isArabic, toggleLanguage, t, direction]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
