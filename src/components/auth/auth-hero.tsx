"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";

import type { AuthCopy } from "./auth-types";

type AuthHeroProps = {
  isArabic?: boolean;
  copy: AuthCopy;
};

export default function AuthHero({ isArabic = false, copy }: AuthHeroProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/animations/auth-hero.json", {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (data) setAnimationData(data);
      })
      .catch(() => {
        setAnimationData(null);
      });

    return () => controller.abort();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative hidden min-h-[620px] overflow-hidden lg:flex"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_34%),radial-gradient(circle_at_70%_72%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_34%)]" />

      <div className="relative z-10 flex w-full flex-col justify-center px-8 xl:px-12">
        <div className={isArabic ? "text-right" : "text-left"}>
          <p className="mb-5 mt-5 text-xs font-semibold uppercase tracking-[0.38em] text-[color:var(--primary)]">
            {copy.heroBadge}
          </p>

          <h1 className="max-w-[620px] text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-[color:var(--foreground)] xl:text-6xl">
            {copy.heroTitle}
          </h1>

          <p className="mt-6 max-w-[540px] text-base leading-8 text-[color:var(--foreground-soft)]">
            {copy.heroSubtitle}
          </p>
        </div>

        <div className="relative mt-10 flex h-[300px] w-full max-w-[620px] items-center justify-center">
          <div className="absolute inset-x-10 bottom-8 h-20 rounded-full bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] blur-3xl" />

          {animationData ? (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              className="relative z-10 h-full w-full"
            />
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
