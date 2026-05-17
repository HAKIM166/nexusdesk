"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

import NexusLogo from "@/components/common/nexus-logo";
import NexusFooterWordmark from "@/components/common/nexus-footer-wordmark";

type DashboardFooterProps = {
  isArabic: boolean;
  variant?: "landing" | "dashboard";
};

export default function DashboardFooter({
  isArabic,
  variant = "landing",
}: DashboardFooterProps) {
  const isDashboard = variant === "dashboard";
  const locale = isArabic ? "ar" : "en";

  const footerText = {
    rights: isArabic
      ? "© 2026 NexusDesk. جميع الحقوق محفوظة"
      : "© 2026 NexusDesk. All Rights Reserved",
    documentation: isArabic ? "التوثيق" : "Documentation",
    privacy: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
    terms: isArabic ? "الشروط والأحكام" : "Terms and Conditions",
  };

  const footerLinks = [
    {
      href: `/${locale}/documentation`,
      label: footerText.documentation,
    },
    {
      href: `/${locale}/privacy`,
      label: footerText.privacy,
    },
    {
      href: `/${locale}/terms`,
      label: footerText.terms,
    },
  ];

  return (
    <>
      <footer
        className={`relative mt-10 overflow-hidden border-t border-[var(--border)] bg-[var(--background)] ${
          isDashboard ? "dashboard-footer-surface" : ""
        }`}
      >
        {!isDashboard && (
          <div className="mx-auto max-w-6xl px-6 pt-10">
            {/* Top footer */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <h3 className="text-2xl font-semibold">
                  {isArabic ? "تواصل معنا الآن" : "Contact Us Now"}
                </h3>

                <p className="mt-2 text-sm text-muted">
                  {isArabic
                    ? "ابنِ علاقات أفضل مع عملائك"
                    : "Build Better Customer Relationships"}
                </p>
              </div>

              <div>
                <h4 className="mb-3 text-lg font-semibold">
                  {isArabic
                    ? "اشترك في نشرة NexusDesk"
                    : "Subscribe to NexusDesk Newsletter"}
                </h4>

                <div className="flex items-center gap-3">
                  <div className="relative w-full">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />

                    <input
                      type="email"
                      placeholder={
                        isArabic ? "ادخل بريدك الإلكتروني" : "Enter your email"
                      }
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)]"
                    />
                  </div>

                  <button
                    type="button"
                    className="rounded-lg bg-[var(--primary)] px-5 py-3 text-sm font-medium !text-[#07110c]"
                  >
                    {isArabic ? "اشتراك" : "Subscribe"}
                  </button>
                </div>
              </div>
            </div>

            {/* Links area */}
            <div className="mt-10 border-t border-[var(--border)] pt-8">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
                <div className="col-span-2 lg:col-span-1">
                  <NexusLogo
                    layout="sidebar"
                    tone="brand"
                    className="h-auto w-[150px] transition-all duration-300"
                  />

                  <p className="mt-5 text-sm text-muted">
                    hello@nexusdesk.com
                  </p>
                  <p className="mt-3 text-sm text-muted">+20 100 000 0000</p>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold text-soft">
                    Quick Links
                  </h4>
                  <ul className="space-y-3 text-sm text-muted">
                    <li>Dashboard</li>
                    <li>Clients</li>
                    <li>Projects</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold text-soft">
                    Company
                  </h4>
                  <ul className="space-y-3 text-sm text-muted">
                    <li>About</li>
                    <li>Product</li>
                    <li>Integration</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold text-soft">
                    Others
                  </h4>
                  <ul className="space-y-3 text-sm text-muted">
                    <li>FAQ</li>
                    <li>Blog</li>
                    <li>Affiliates</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-semibold text-soft">
                    Social Media
                  </h4>
                  <ul className="space-y-3 text-sm text-muted">
                    <li>Instagram</li>
                    <li>Facebook</li>
                    <li>TikTok</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Big wordmark area */}
        <div
          className={`relative overflow-hidden ${
            isDashboard
              ? "mt-0 h-[300px] border-t-0"
              : "mt-8 h-[310px] border-t border-[var(--border)]"
          }`}
        >
          {/* Bottom glow */}
          <div
            className={`pointer-events-none absolute left-1/2 z-0 -translate-x-1/2 rounded-full bg-[var(--footer-wordmark-blur)] ${
              isDashboard
                ? "bottom-[-115px] h-[235px] w-[820px] blur-[88px]"
                : "bottom-[-105px] h-[245px] w-[900px] blur-[85px]"
            }`}
          />

          {/* Big Nexus wordmark */}
          <NexusFooterWordmark
            className={`pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 select-none ${
              isDashboard
                ? "top-[24px] w-[1160px] max-w-[92%]"
                : "top-[20px] w-[1280px] max-w-[100%]"
            }`}
          />

          {/* Bottom bar */}
          <div className="absolute inset-x-0 bottom-5 z-20 mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted md:flex-row">
            <p>{footerText.rights}</p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-[var(--foreground)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}