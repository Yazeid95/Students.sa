"use client";

import React from "react";
import { FinanceCard, FinanceCardTailwind } from "@/components/cards/FinanceCard";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RTLDemoPage() {
  const { direction, isArabic, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-dark p-8">
      {/* Demo Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className={`text-center mb-8 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
          <h1 className="text-4xl font-bold text-white mb-4">
            {isArabic ? "عرض توضيحي للتخطيط المتجاوب RTL/LTR" : "RTL/LTR Responsive Layout Demo"}
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            {isArabic 
              ? "شاهد كيف تتكيف البطاقات والأيقونات تلقائياً مع اتجاه النص العربي والإنجليزي"
              : "Watch how cards and icons automatically adapt to Arabic RTL and English LTR text direction"
            }
          </p>
          
          {/* Language Toggle Demo */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={toggleLanguage}
              className="px-6 py-3 bg-gradient-primary rounded-xl text-white font-medium hover:scale-105 transition-transform"
            >
              {isArabic ? "التبديل إلى الإنجليزية (LTR)" : "Switch to Arabic (RTL)"}
            </button>
          </div>
          
          {/* Direction indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
            <span className="text-sm text-gray-300">
              {isArabic ? "الاتجاه الحالي:" : "Current Direction:"}
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {direction.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* React-based Direction Handling */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isArabic ? "التحكم بالاتجاه عبر React" : "React-based Direction Control"}
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              {isArabic 
                ? "يستخدم خاصية direction من السياق للتحكم في تخطيط العناصر ديناميكياً"
                : "Uses direction property from context to dynamically control element layout"
              }
            </p>
            <FinanceCard 
              onSelect={() => alert(isArabic ? "تم اختيار تخصص التمويل!" : "Finance major selected!")}
            />
          </div>

          {/* Tailwind CSS-based Direction Handling */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isArabic ? "التحكم بالاتجاه عبر Tailwind CSS" : "Tailwind CSS Direction Control"}
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              {isArabic 
                ? "يستخدم [dir='rtl'] selectors للتحكم في التخطيط عبر CSS فقط"
                : "Uses [dir='rtl'] selectors to control layout purely through CSS"
              }
            </p>
            <FinanceCardTailwind 
              onSelect={() => alert(isArabic ? "تم اختيار تخصص التمويل!" : "Finance major selected!")}
            />
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">
            {isArabic ? "دليل التنفيذ" : "Implementation Guide"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">
                {isArabic ? "الطريقة الأولى: React" : "Method 1: React"}
              </h4>
              <ul className={`text-sm text-gray-300 space-y-1 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <li>• {isArabic ? "استخدم خاصية direction من useLanguage" : "Use direction property from useLanguage"}</li>
                <li>• {isArabic ? "تطبيق الشروط الديناميكية للفئات" : "Apply conditional classes dynamically"}</li>
                <li>• {isArabic ? "مرونة كاملة في التحكم" : "Full control and flexibility"}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-cyan-400 mb-2">
                {isArabic ? "الطريقة الثانية: Tailwind CSS" : "Method 2: Tailwind CSS"}
              </h4>
              <ul className={`text-sm text-gray-300 space-y-1 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <li>• {isArabic ? "استخدم [dir='rtl'] selectors" : "Use [dir='rtl'] selectors"}</li>
                <li>• {isArabic ? "أداء أفضل عبر CSS النقي" : "Better performance with pure CSS"}</li>
                <li>• {isArabic ? "أقل كود JavaScript" : "Less JavaScript code"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
