"use client";

import { projectStatusData } from "@/data/dashboard";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#b6ff66", "#22c55e", "#facc15"];

type ProjectChartProps = {
  locale: Locale;
};

export default function ProjectChart({ locale }: ProjectChartProps) {
  const messages = getMessages(locale);

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          {messages.dashboard.projectStatusTitle}
        </h2>
        <p className="text-sm text-[var(--foreground-soft)]">
          {messages.dashboard.projectStatusSubtitle}
        </p>
      </div>

      <div className="h-[320px] w-full px-4 py-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={projectStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
            >
              {projectStatusData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "rgba(10, 22, 17, 0.96)",
                border: "1px solid rgba(168, 255, 196, 0.12)",
                borderRadius: "16px",
                color: "#f5fff8",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}