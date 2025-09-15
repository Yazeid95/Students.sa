"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Users, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/layout";
import Logo from "@/components/Logo";

export default function MajorPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

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

  const majorName = slug?.replace(/-/g, " ");

  const features = [
    {
      icon: GraduationCap,
      title: "Advanced Curriculum",
      description: "Industry-aligned courses designed by experts"
    },
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Learn from renowned professors and practitioners"
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description: "Multiple learning formats to fit your lifestyle"
    },
    {
      icon: Award,
      title: "Career Success",
      description: "High employment rates and career advancement"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-glow rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Logo size={100} className="mx-auto mb-8" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 capitalize">
              <span className="text-gradient">{majorName}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {userName ? (
                <>Hi <span className="gold-gradient font-semibold">{userName}</span>, explore this comprehensive major program designed to launch your career.</>
              ) : (
                <span className="italic">Loading user information...</span>
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Program Highlights</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              This program is currently being developed with comprehensive curriculum, 
              expert faculty, and industry partnerships to ensure your success.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-2xl bg-gradient-primary inline-block mb-4">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="text-center p-8">
              <CardHeader>
                <CardTitle className="text-2xl mb-4">Coming Soon</CardTitle>
                <p className="text-gray-400 mb-8">
                  Detailed curriculum, course descriptions, faculty profiles, and career outcomes 
                  will be available here. This major page is ready for comprehensive content development.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/colleges">
                    <Button variant="glow" size="lg" className="group">
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Back to Colleges
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => { 
                      try { localStorage.removeItem("seuUser"); } catch {}; 
                      router.push("/"); 
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
