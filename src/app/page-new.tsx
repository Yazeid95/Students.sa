"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, IdCard, ArrowRight } from "lucide-react";
import { Hero, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", studentId: "" });
  const [touched, setTouched] = useState(false);

  const isValid = form.username.trim() !== "" && form.studentId.trim() !== "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    try {
      localStorage.setItem("seuUser", JSON.stringify(form));
    } catch {}
    router.push("/colleges");
  }

  return (
    <div className="min-h-screen">
      <Hero />
      
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold mb-2">
                  <span className="text-gradient">Get Started</span>
                </CardTitle>
                <p className="text-gray-300">Enter your details to explore your academic journey</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                  >
                    <label htmlFor="username" className="block text-sm font-medium mb-3 text-gray-200">
                      <User className="inline w-4 h-4 mr-2" />
                      Full Name
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.username}
                      onChange={handleChange}
                      onBlur={() => setTouched(true)}
                      className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-4 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative"
                  >
                    <label htmlFor="studentId" className="block text-sm font-medium mb-3 text-gray-200">
                      <IdCard className="inline w-4 h-4 mr-2" />
                      Student ID
                    </label>
                    <input
                      id="studentId"
                      name="studentId"
                      type="text"
                      placeholder="e.g. 123456789"
                      value={form.studentId}
                      onChange={handleChange}
                      onBlur={() => setTouched(true)}
                      className="w-full rounded-xl bg-white/5 border border-white/20 px-4 py-4 text-white placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 tracking-wide"
                      required
                    />
                  </motion.div>

                  {touched && !isValid && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-400 text-center"
                    >
                      Please fill in both fields.
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Button
                      type="submit"
                      disabled={!isValid}
                      variant="glow"
                      size="lg"
                      className="w-full text-lg"
                    >
                      Continue to Colleges
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
