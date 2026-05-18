"use client";


type PricingSectionProps = {
  isArabic: boolean;
};

export default function PricingSection({ isArabic }: PricingSectionProps) {
  return (
      <section className="space-y-10 py-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-md border border-[var(--border-strong)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-primary">
            <span className="badge-dot" />
            {isArabic ? "خطط العمل" : "Pricing"}
          </span>

          <h3 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {isArabic
              ? "خطط بسيطة وواضحة، مناسبة لكل فريق"
              : "Simple, Transparent Pricing, Built for Every Business"}
          </h3>

          <p className="mt-3 text-xs text-muted">
            {isArabic
              ? "اختر الخطة المناسبة لفريقك. بدون تعقيد، ويمكنك التطوير في أي وقت."
              : "Choose a plan that fits your team. No hidden fees. Cancel anytime."}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-3">
          {[
            {
              name: "Starter",
              price: "$19",
              badge: "",
              description: isArabic
                ? "للمستقلين والفرق الصغيرة في البداية"
                : "For small teams getting started",
              features: isArabic
                ? [
                    "إدارة العملاء والبيانات الأساسية",
                    "متابعة المشاريع البسيطة",
                    "قوائم العملاء الحديثة",
                    "إعدادات اللغة والثيم",
                    "حتى 3 أعضاء فريق",
                  ]
                : [
                    "Contact & Lead Management",
                    "Simple Project Tracking",
                    "Recent Clients Overview",
                    "Theme & Language Settings",
                    "Up to 3 Team Members",
                  ],
            },
            {
              name: "Growth",
              price: "$49",
              badge: isArabic ? "الأشهر" : "Popular",
              description: isArabic
                ? "للفرق التي تحتاج سير عمل أذكى"
                : "For growing teams getting smarter",
              features: isArabic
                ? [
                    "كل مميزات Starter",
                    "إدارة مشاريع متقدمة",
                    "مساعد ذكاء اصطناعي",
                    "تحليلات لوحة التحكم",
                    "دعم أولوية",
                  ]
                : [
                    "Advanced Project Workflows",
                    "AI Workspace Assistant",
                    "Dashboard Analytics",
                    "Team Collaboration Tools",
                    "Priority Support",
                  ],
            },
            {
              name: "Pro",
              price: "$99",
              badge: "",
              description: isArabic
                ? "للشركات التي تحتاج تحكم وتوسع كامل"
                : "For teams that need full control",
              features: isArabic
                ? [
                    "عملاء ومشاريع غير محدودة",
                    "تحليلات متقدمة",
                    "صلاحيات للفريق",
                    "رؤى ذكية بالذكاء الاصطناعي",
                    "مدير حساب مخصص",
                  ]
                : [
                    "Unlimited Clients & Projects",
                    "Advanced Analytics",
                    "Team Permissions",
                    "AI-Powered Insights",
                    "Dedicated Account Manager",
                  ],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="overflow-hidden  border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="rounded-b-md border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface-muted)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-2xl font-medium tracking-tight">
                      {plan.name}
                    </h4>

                    <p className="mt-4 text-sm text-muted">
                      {plan.description}
                    </p>
                  </div>

                  {plan.badge && (
                    <span className="py-1 text-xs text-[var(--warning)]">
                      • {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-3xl font-medium tracking-tight">
                    {plan.price}
                  </span>

                  <span className="pb-1 text-sm text-muted">
                    {isArabic ? "/ شهريًا" : "/ month"}
                  </span>
                </div>

                <button
                  type="button"
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    plan.badge
                      ? "bg-[var(--primary)] !text-black"
                      : "bg-[var(--background)] hover:bg-[var(--surface-strong)]"
                  }`}
                >
                  {isArabic ? "ابدأ الآن" : "Get started"}
                  <span className={isArabic ? "rotate-180" : ""}>↗</span>
                </button>
              </div>

              <div className="space-y-4 p-5">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] text-[10px] text-primary">
                      ✓
                    </span>

                    <span className="text-muted">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
}