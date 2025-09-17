"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import { Button, Card } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", studentId: "" });
  const [touched, setTouched] = useState(false);

  const isValid = form.username.trim() !== "" && form.studentId.trim() !== "";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    // Basic demo persistence (optional): store name for later pages
    try {
      localStorage.setItem("seuUser", JSON.stringify(form));
    } catch {}
    router.push("/colleges");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gradient-light dark:bg-brand-gradient p-6">
      <Card className="w-full max-w-md p-8 glass-card">
        <div className="flex flex-col items-center mb-8 space-y-4">
          <Logo size={96} />
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">SEU Majors Portal</h1>
            <p className="text-sm text-slate-600 dark:text-neutral-300">Select your college & major</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2 text-slate-700 dark:text-neutral-200">
                Name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Your full name"
                value={form.username}
                onChange={handleChange}
                onBlur={() => setTouched(true)}
                className="w-full rounded-xl border-2 border-slate-200 dark:border-neutral-600 bg-white/90 dark:bg-neutral-800/90 px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-4 focus:ring-[var(--brand-gold)]/20 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium mb-2 text-slate-700 dark:text-neutral-200">
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
                className="w-full rounded-xl border-2 border-slate-200 dark:border-neutral-600 bg-white/90 dark:bg-neutral-800/90 px-4 py-3 text-sm outline-none focus:border-[var(--brand-gold)] focus:ring-4 focus:ring-[var(--brand-gold)]/20 transition-all tracking-wide"
                required
              />
            </div>
          </div>
          {touched && !isValid && (
            <p className="text-sm text-red-500 text-center">Please fill in both fields.</p>
          )}
          <Button type="submit" disabled={!isValid} className="w-full">
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
