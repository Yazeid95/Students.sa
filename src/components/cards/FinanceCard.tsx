"use client";

import React from "react";
import { motion } from "framer-motion";
import { DollarSign, ArrowRight, TrendingUp, PieChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinanceCardProps {
  onSelect?: () => void;
  className?: string;
}

export const FinanceCard: React.FC<FinanceCardProps> = ({ onSelect, className = "" }) => {
  const { t, direction, isArabic } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card className="overflow-hidden group hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            onClick={onSelect}>
        <CardHeader className="pb-6">
          {/* Header with Icon and Title - RTL/LTR responsive */}
          <div className={`flex items-start gap-4 ${
            direction === 'rtl' 
              ? 'flex-row-reverse text-right' 
              : 'text-left'
          }`}>
            {/* Icon Container */}
            <div className="p-3 rounded-2xl bg-gradient-primary shrink-0">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl mb-2 break-words">
                {t("finance")}
              </CardTitle>
              <p className="text-gray-400 text-sm leading-relaxed">
                {isArabic 
                  ? "اشكل مستقبل التمويل والأعمال مع برامجنا المتطورة في علوم التمويل"
                  : "Shape the future of finance and business with our advanced financial sciences programs"
                }
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Features List - Direction aware */}
          <div className="space-y-4 mb-6">
            {[
              {
                icon: TrendingUp,
                titleKey: isArabic ? "تحليل مالي متقدم" : "Advanced Financial Analysis",
                descKey: isArabic ? "تعلم أدوات التحليل المالي الحديثة" : "Learn modern financial analysis tools"
              },
              {
                icon: PieChart,
                titleKey: isArabic ? "إدارة المحافظ الاستثمارية" : "Investment Portfolio Management", 
                descKey: isArabic ? "إتقن فن إدارة الاستثمارات" : "Master the art of investment management"
              }
            ].map((feature) => (
              <div 
                key={feature.titleKey}
                className={`flex items-center gap-3 ${
                  direction === 'rtl' 
                    ? 'flex-row-reverse text-right' 
                    : 'text-left'
                }`}
              >
                {/* Feature Icon */}
                <div className="p-2 rounded-lg bg-gradient-glow/20 shrink-0">
                  <feature.icon className="w-4 h-4 text-cyan-400" />
                </div>
                
                {/* Feature Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm mb-1">
                    {feature.titleKey}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {feature.descKey}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Action Button - Direction aware */}
          <div className={`flex items-center text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity ${
            direction === 'rtl' 
              ? 'flex-row-reverse' 
              : ''
          }`}>
            <span className="font-medium">
              {t("exploreCurriculum")}
            </span>
            <ArrowRight className={`w-4 h-4 transition-transform ${
              direction === 'rtl'
                ? 'mr-2 group-hover:-translate-x-1 rotate-180'
                : 'ml-2 group-hover:translate-x-1'
            }`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* 
 * Alternative approach using Tailwind CSS dir-specific variants
 * This approach uses CSS selectors for even better performance
 */
export const FinanceCardTailwind: React.FC<FinanceCardProps> = ({ onSelect, className = "" }) => {
  const { t, isArabic } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card className="overflow-hidden group hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            onClick={onSelect}>
        <CardHeader className="pb-6">
          {/* Using Tailwind dir-specific classes */}
          <div className="flex items-start gap-4 [dir='rtl']:flex-row-reverse [dir='rtl']:text-right">
            <div className="p-3 rounded-2xl bg-gradient-primary shrink-0">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl mb-2">
                {t("finance")}
              </CardTitle>
              <p className="text-gray-400 text-sm">
                {isArabic 
                  ? "اشكل مستقبل التمويل والأعمال مع برامجنا المتطورة في علوم التمويل"
                  : "Shape the future of finance and business with our advanced financial sciences programs"
                }
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Using logical spacing - ps (padding-start) instead of pl/pr */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 [dir='rtl']:flex-row-reverse [dir='rtl']:text-right">
              <div className="p-2 rounded-lg bg-gradient-glow/20 shrink-0">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white text-sm mb-1">
                  {isArabic ? "تحليل مالي متقدم" : "Advanced Financial Analysis"}
                </h4>
                <p className="text-xs text-gray-400">
                  {isArabic ? "تعلم أدوات التحليل المالي الحديثة" : "Learn modern financial analysis tools"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Arrow with RTL-aware transform */}
          <div className="flex items-center text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity [dir='rtl']:flex-row-reverse">
            <span>{t("exploreCurriculum")}</span>
            <ArrowRight className="w-4 h-4 ms-2 transition-transform group-hover:translate-x-1 [dir='rtl']:rotate-180 [dir='rtl']:group-hover:-translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
