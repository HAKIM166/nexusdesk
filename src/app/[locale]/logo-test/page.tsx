import NexusLogo from "@/components/common/nexus-logo";

const lightOptions = [
  {
    id: "L1",
    name: "Theme Brand",
    tone: "brand",
    note: "النسخة الأساسية المعتمدة من theme.css.",
  },
  {
    id: "L2",
    name: "Premium Split",
    tone: "accent",
    note: "Nexus بلون النص الأساسي و Desk بلون primary.",
  },
  {
    id: "L3",
    name: "Solid Clean",
    tone: "solid",
    note: "نسخة هادية كلها من foreground.",
  },
  {
    id: "L4",
    name: "Sidebar Match",
    tone: "soft",
    note: "مناسبة جدًا لو هتتحط جوه الـ sidebar.",
  },
] as const;

function LightOptionCard({
  id,
  name,
  note,
  tone,
}: {
  id: string;
  name: string;
  note: string;
  tone: "brand" | "solid" | "accent" | "soft";
}) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-bold text-[var(--primary)]">
            {id}
          </span>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            {name}
          </h3>
        </div>

        <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
          {note}
        </p>
      </div>

      <div className="flex min-h-28 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-5">
        <NexusLogo
          layout="footer"
          tone={tone}
          className="h-auto w-[260px] drop-shadow-[var(--logo-glow)]"
        />
      </div>
    </article>
  );
}

export default function LogoTestPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] p-6 text-[var(--foreground)] md:p-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] md:text-3xl">
            NexusDesk Final Logo Test
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            F4 Cube فقط. الدارك ثابت، واللايت فيه كذا tone مبني على theme.css.
          </p>
        </header>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-bold text-[var(--primary)]">
                DARK
              </span>
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Final Dark Version
              </h2>
            </div>
            <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
              نفس روح F4 اللي اخترتها، متوصلة بمتغيرات الثيم.
            </p>
          </div>

          <div className="flex min-h-32 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--sidebar-bg)] p-6">
            <NexusLogo
              layout="footer"
              tone="brand"
              className="h-auto w-[280px] drop-shadow-[var(--logo-glow)]"
            />
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Light Versions
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              اختار واحدة من دول للـ light. مفيش ألوان مكتوبة hardcoded في
              اللوجو، كله من variables.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {lightOptions.map((option) => (
              <LightOptionCard key={option.id} {...option} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            Sidebar Preview
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--sidebar-bg)] p-5">
              <p className="mb-4 text-xs text-[var(--sidebar-muted)]">
                Sidebar full logo
              </p>
              <NexusLogo
                layout="sidebar"
                tone="soft"
                className="h-auto w-[190px]"
              />
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--sidebar-bg)] p-5">
              <p className="mb-4 text-xs text-[var(--sidebar-muted)]">
                Sidebar icon only
              </p>
              <NexusLogo
                layout="icon"
                tone="soft"
                className="h-14 w-14"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}