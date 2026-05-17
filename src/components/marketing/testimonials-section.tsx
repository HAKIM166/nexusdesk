"use client";

import {
  Box,
  FileText,
  Search,
  MessageSquare,
  Video,
  Square,
  Mail,
} from "lucide-react";

type TestimonialsSectionProps = {
  isArabic: boolean;
};

export default function TestimonialsSection({
  isArabic,
}: TestimonialsSectionProps) {
  return (
    <>
      <section className="space-y-10 py-6">
        <div className="mx-auto max-w-4xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-primary">
            <span className="badge-dot" />
            {isArabic ? "آراء العملاء" : "Testimonials"}
          </span>

          <h3 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {isArabic
              ? "موثوق من فرق تضع العلاقات أولًا"
              : "Trusted by Teams Who Put Relationships First"}
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
            {isArabic
              ? "من المستقلين إلى الفرق النامية — يساعد NexusDesk الفرق على تنظيم العملاء والمشاريع والعمل بذكاء."
              : "From freelancers to growing teams — NexusDesk helps teams stay organized, work smarter, and move faster."}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              company: "Microsoft",
              icon: Box,
              quote:
                "NexusDesk changed the way we manage leads. Everything feels organized, fast, and easy to follow.",
              name: "Sarah L.",
              role: "Co-Founder",
            },
            {
              company: "Notion",
              icon: FileText,
              quote:
                "Our workflow used to be chaotic. Now we have a clear view of clients, projects, and priorities.",
              name: "Daniel K.",
              role: "Sales Manager",
            },
            {
              company: "Google",
              icon: Search,
              quote:
                "What I love most is how simple it feels. It helps us keep client work organized without extra noise.",
              name: "Maya P.",
              role: "Customer Success Lead",
            },
            {
              company: "Slack",
              icon: MessageSquare,
              quote:
                "We can track campaigns, clients, and tasks from one clean dashboard. It made our work much smoother.",
              name: "Olivia R.",
              role: "Marketing Director",
            },
            {
              company: "Zoom",
              icon: Video,
              quote:
                "Before NexusDesk, managing customer data was scattered. Now everything is clean and easy to understand.",
              name: "Amir H.",
              role: "Founder",
            },
            {
              company: "Square",
              icon: Square,
              quote:
                "Our support team can follow client context faster. The dashboard gives us exactly what we need.",
              name: "Jenna P.",
              role: "Support Manager",
            },
          ].map((item) => {
            const CompanyIcon = item.icon;

            return (
              <div
                key={item.company}
                className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="min-h-[190px] border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface-muted)] p-5">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <CompanyIcon className="h-5 w-5 text-muted" />

                      <h4 className="text-xl font-semibold text-muted">
                        {item.company}
                      </h4>
                    </div>

                    <div className="text-sm tracking-[0.15em] text-[var(--warning)]">
                      ★★★★★
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted">{item.quote}</p>
                </div>

                <div className="flex items-center gap-3 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--surface-muted)] text-sm font-semibold text-primary">
                    {item.name.slice(0, 1)}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-soft">{item.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
