type NexusLogoLayout = "sidebar" | "footer" | "icon";
type NexusLogoTone = "brand" | "solid" | "accent" | "soft";

type NexusLogoProps = {
  layout?: NexusLogoLayout;
  tone?: NexusLogoTone;
  className?: string;
  showTagline?: boolean;
};

function CubeSymbol() {
  return (
    <g>
      <path
        d="M32 7L54 19.5V44.5L32 57L10 44.5V19.5L32 7Z"
        stroke="var(--logo-icon)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      <path
        d="M10 19.5L32 32L54 19.5"
        stroke="var(--logo-icon-soft)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      <path
        d="M32 32V57"
        stroke="var(--logo-icon-soft)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      <path
        d="M23 42V25L42 42V25"
        stroke="var(--logo-icon)"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export default function NexusLogo({
  layout = "sidebar",
  tone = "brand",
  className = "",
  showTagline,
}: NexusLogoProps) {
  const isIcon = layout === "icon";
  const isFooter = layout === "footer";
  const shouldShowTagline = showTagline ?? isFooter;

  const toneVars =
    tone === "solid"
      ? ({
          "--logo-text-main": "var(--foreground)",
          "--logo-text-accent": "var(--foreground)",
          "--logo-icon": "var(--foreground)",
          "--logo-icon-soft": "var(--foreground-soft)",
          "--logo-tagline": "var(--foreground-soft)",
        } as React.CSSProperties)
      : tone === "accent"
        ? ({
            "--logo-text-main": "var(--foreground)",
            "--logo-text-accent": "var(--primary)",
            "--logo-icon": "var(--primary)",
            "--logo-icon-soft":
              "color-mix(in srgb, var(--primary) 45%, transparent)",
            "--logo-tagline": "var(--foreground-soft)",
          } as React.CSSProperties)
        : undefined;

  return (
    <svg
      viewBox={isIcon ? "0 0 64 64" : isFooter ? "0 0 330 78" : "0 0 245 72"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        ...toneVars,
        direction: "ltr",
        unicodeBidi: "isolate",
      }}
      role="img"
      aria-label="NexusDesk"
    >
      <g transform={isFooter ? "translate(0 7)" : "translate(0 0)"}>
        <CubeSymbol />
      </g>

      {!isIcon && (
        <g transform={isFooter ? "translate(78 0)" : "translate(76 0)"}>
          <text
            x="0"
            y={isFooter ? "37" : "39"}
            fill="var(--logo-text-main)"
            fontSize={isFooter ? "32" : "28"}
            fontWeight="850"
            letterSpacing="-0.9"
            fontFamily="Inter, Arial, sans-serif"
            textAnchor="start"
            direction="ltr"
          >
            Nexus
          </text>

          <text
            x={isFooter ? "102" : "90"}
            y={isFooter ? "37" : "39"}
            fill="var(--logo-text-accent)"
            fontSize={isFooter ? "32" : "28"}
            fontWeight="850"
            letterSpacing="-0.9"
            fontFamily="Inter, Arial, sans-serif"
            textAnchor="start"
            direction="ltr"
          >
            Desk
          </text>

          {shouldShowTagline && (
            <text
              x="2"
              y={isFooter ? "56" : "58"}
              fill="var(--logo-tagline)"
              fontSize={isFooter ? "10" : "9"}
              fontWeight="700"
              letterSpacing={isFooter ? "4.2" : "3.2"}
              fontFamily="Inter, Arial, sans-serif"
              textAnchor="start"
              direction="ltr"
            >
              WORKSPACE
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
