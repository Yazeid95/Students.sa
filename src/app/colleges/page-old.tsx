"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { Button, Card, SectionHeading } from "@/components/ui";

type College = {
  name: string;
  slug: string;
  majors: { name: string; slug: string }[];
};

const colleges: College[] = [
  {
    name: "College of Administrative and Financial Sciences",
    slug: "administrative-and-financial-sciences",
    majors: [
      { name: "Management", slug: "management" },
      { name: "E-Commerce", slug: "e-commerce" },
      { name: "Accounting", slug: "accounting" },
      { name: "Finance", slug: "finance" },
    ],
  },
  {
    name: "College of Computing and Informatics",
    slug: "computing-and-informatics",
    majors: [
      { name: "Computer Science", slug: "computer-science" },
      { name: "Data Science", slug: "data-science" },
      { name: "Information Technology", slug: "information-technology" },
    ],
  },
  {
    name: "College of Health Sciences",
    slug: "health-sciences",
    majors: [
      { name: "Health Informatics", slug: "health-informatics" },
      { name: "Public Health", slug: "public-health" },
    ],
  },
  {
    name: "College Of Science and Theoretical Studies",
    slug: "science-and-theoretical-studies",
    majors: [
      { name: "Law", slug: "law" },
      { name: "Digital Media", slug: "digital-media" },
      { name: "English Language and Translation", slug: "english-language-and-translation" },
    ],
  },
];

export default function CollegesPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("seuUser");
      if (raw) {
        const obj = JSON.parse(raw);
        setUserName(obj.username || null);
      } else {
        // If no user info, redirect back to sign-in
        router.replace("/");
      }
    } catch {
      router.replace("/");
    }
  }, [router]);

  function goToMajor(college: College, majorSlug: string) {
    // Placeholder route for future implementation
    router.push(`/majors/${majorSlug}`);
  }

  return (
    <div className="min-h-screen bg-brand-gradient p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <Logo size={56} />
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-white">Select Your Major</h1>
                <p className="text-sm text-white/80">
                  {userName ? (
                    <>Welcome, <span className="gold-accent font-semibold">{userName}</span></>
                  ) : (
                    <span className="italic">Loading user...</span>
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { try { localStorage.removeItem("seuUser"); } catch {}; router.push("/"); }}
            >
              Sign out
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          {colleges.map(college => (
            <Card key={college.slug} className="glass-card p-6">
              <SectionHeading title={college.name} className="mb-6" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {college.majors.map(m => (
                  <button
                    key={m.slug}
                    onClick={() => goToMajor(college, m.slug)}
                    className="group text-left rounded-2xl border-2 border-slate-200/50 dark:border-neutral-700/50 bg-white/70 dark:bg-neutral-800/70 p-5 hover:border-[var(--brand-gold)] hover:bg-white dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-gold)]/30 transition-all duration-200"
                  >
                    <div className="space-y-2">
                      <span className="block text-base font-semibold text-slate-800 dark:text-white group-hover:text-[var(--brand-gold)]">
                        {m.name}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-neutral-400">
                        Explore this major →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
