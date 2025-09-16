"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Calculator, 
  TrendingUp, 
  DollarSign,
  Computer, 
  Database, 
  Wifi,
  Heart, 
  Activity,
  Scale, 
  Video, 
  Globe,
  ArrowRight,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout";
import Logo from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";

type College = {
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  majors: { name: string; slug: string; icon: React.ComponentType<{ className?: string }> }[];
};

export default function CollegesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [userName, setUserName] = useState<string | null>(null);

  // Get translated colleges data
  const getColleges = (): College[] => [
    {
      name: t("collegeOfAdminFinancial"),
      slug: "administrative-and-financial-sciences",
      icon: GraduationCap,
      description: t("adminFinancialDescription"),
      majors: [
        { name: t("management"), slug: "management", icon: TrendingUp },
        { name: t("eCommerce"), slug: "e-commerce", icon: Globe },
        { name: t("accounting"), slug: "accounting", icon: Calculator },
        { name: t("finance"), slug: "finance", icon: DollarSign },
      ],
    },
    {
      name: t("collegeOfComputing"),
      slug: "computing-and-informatics",
      icon: Computer,
      description: t("computingDescription"),
      majors: [
        { name: t("computerScience"), slug: "computer-science", icon: Computer },
        { name: t("dataScience"), slug: "data-science", icon: Database },
        { name: t("informationTechnology"), slug: "information-technology", icon: Wifi },
      ],
    },
    {
      name: t("collegeOfHealthSciences"),
      slug: "health-sciences",
      icon: Heart,
      description: t("healthDescription"),
      majors: [
        { name: t("healthInformatics"), slug: "health-informatics", icon: Activity },
        { name: t("publicHealth"), slug: "public-health", icon: Heart },
      ],
    },
    {
      name: t("collegeOfScienceTheoretical"),
      slug: "science-and-theoretical-studies",
      icon: Scale,
      description: t("scienceTheoreticalDescription"),
      majors: [
        { name: t("law"), slug: "law", icon: Scale },
        { name: t("digitalMedia"), slug: "digital-media", icon: Video },
        { name: t("englishTranslation"), slug: "english-language-and-translation", icon: Globe },
      ],
    },
  ];

  useEffect(() => {
    try {
      const raw = localStorage.getItem("seuUser");
      if (raw) {
        const obj = JSON.parse(raw);
        setUserName(obj.username || null);
      } else {
        router.replace("/");
      }
    } catch {
      router.replace("/");
    }
  }, [router]);

  function goToMajor(college: College, majorSlug: string) {
    router.push(`/majors/${majorSlug}`);
  }

  function handleSignOut() {
    try { 
      localStorage.removeItem("seuUser"); 
    } catch {}
    router.push("/");
  }

  const colleges = getColleges();

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-glow rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6 [dir='rtl']:flex-row-reverse">
              <Logo size={80} />
              <div className="text-left [dir='rtl']:text-right">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {t("chooseYourPath")} <span className="text-gradient">{t("chooseCollege")}</span>
                </h1>
                <p className="text-xl text-gray-300">
                  {userName ? (
                    <>{t("welcomeBack")}, <span className="gold-gradient font-semibold">{userName}</span></>
                  ) : (
                    <span className="italic">{t("loadingUser")}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="group"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform mr-2 [dir='rtl']:mr-0 [dir='rtl']:ml-2" />
                {t("signOut")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Colleges Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 lg:gap-12">
            {colleges.map((college, collegeIndex) => (
              <motion.div
                key={college.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: collegeIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden group">
                  <CardHeader className="pb-6">
                    {/* Using enhanced RTL patterns with Tailwind CSS */}
                    <div className="flex items-start gap-4 [dir='rtl']:flex-row-reverse [dir='rtl']:text-right" dir="ltr">
                      <div className="p-3 rounded-2xl bg-gradient-primary shrink-0">
                        <college.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-2xl mb-2 break-words">{college.name}</CardTitle>
                        <p className="text-gray-400 leading-relaxed">{college.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {college.majors.map((major, majorIndex) => (
                        <motion.button
                          key={major.slug}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: majorIndex * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => goToMajor(college, major.slug)}
                          className="group/major p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 [dir='rtl']:text-right text-left"
                        >
                          {/* Enhanced RTL layout with Tailwind CSS selectors */}
                          <div className="flex items-start gap-4 [dir='rtl']:flex-row-reverse" dir="ltr">
                            <div className="p-2 rounded-xl bg-gradient-glow/20 group-hover/major:bg-gradient-glow/30 transition-colors shrink-0">
                              <major.icon className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white mb-1 group-hover/major:text-cyan-400 transition-colors break-words">
                                {major.name}
                              </h3>
                              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                                {t("exploreCurriculum")}
                              </p>
                              {/* Enhanced arrow with RTL transform */}
                              <div className="flex items-center text-xs text-cyan-400 opacity-0 group-hover/major:opacity-100 transition-opacity [dir='rtl']:flex-row-reverse">
                                <span>{t("exploreMajors")}</span>
                                <ArrowRight className="w-3 h-3 ms-1 transition-transform group-hover/major:translate-x-1 [dir='rtl']:rotate-180 [dir='rtl']:group-hover/major:-translate-x-1" />
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
