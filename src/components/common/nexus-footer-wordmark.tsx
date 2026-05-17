type NexusFooterWordmarkProps = {
  className?: string;
};

export default function NexusFooterWordmark({
  className = "",
}: NexusFooterWordmarkProps) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 980 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full"
      >
        <defs>
          <linearGradient
            id="nexusFooterWordmarkFadeFill"
            x1="0"
            y1="20"
            x2="0"
            y2="178"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="0%"
              stopColor="var(--dashboard-footer-wordmark-top)"
              stopOpacity="1"
            />
            <stop
              offset="52%"
              stopColor="var(--dashboard-footer-wordmark-mid)"
              stopOpacity="1"
            />
            <stop
              offset="72%"
              stopColor="var(--dashboard-footer-wordmark-bottom)"
              stopOpacity="0.65"
            />
            <stop
              offset="88%"
              stopColor="var(--dashboard-footer-wordmark-bottom)"
              stopOpacity="0.22"
            />
            <stop
              offset="100%"
              stopColor="var(--dashboard-footer-wordmark-bottom)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <text
          x="50%"
          y="215"
          textAnchor="middle"
          fill="url(#nexusFooterWordmarkFadeFill)"
          stroke="none"
          fontSize="220"
          fontWeight="600"
          letterSpacing="24"
          fontFamily="Inter, Arial, sans-serif"
        >
          NEXUS
        </text>
      </svg>
    </div>
  );
}