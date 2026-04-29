"use client";

import { Mail } from "lucide-react";

type DashboardFooterProps = {
  isArabic: boolean;
};

export default function DashboardFooter({ isArabic }: DashboardFooterProps) {
  return (
    <>
      <footer className="relative mt-10 overflow-hidden border-t border-[var(--border)] bg-[var(--background)]">
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
                <img
                  src="/logos/nexusdesk-logo-light.png"
                  alt="NexusDesk"
                  className="h-10 w-auto"
                />

                <p className="mt-5 text-sm text-muted">hello@nexusdesk.com</p>
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
                <h4 className="mb-4 text-sm font-semibold text-soft">Others</h4>
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

          {/* Big wordmark area */}
          <div className="relative mt-8 h-[250px] overflow-hidden border-t border-[var(--border)]">
            {/* Soft bottom glow */}
            <div className="pointer-events-none absolute bottom-[-135px] left-1/2 z-0 h-[260px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--primary)]/32 blur-[85px]" />

            {/* Big Nexus wordmark */}
            <img
              src="/logos/nexus-wordmark-light.png"
              alt="Nexus"
              className="pointer-events-none absolute bottom-[22px] left-1/2 z-10 w-[900px] max-w-[96%] -translate-x-1/2 select-none opacity-60 grayscale"
            />

            {/* Bottom bar */}
            <div className="absolute bottom-8 left-0 z-20 flex w-full flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
              <p>© 2026 NexusDesk. All Rights Reserved</p>

              <div className="flex gap-6">
                <span>Documentation</span>
                <span>Privacy Policy</span>
                <span>Terms and Conditions</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
