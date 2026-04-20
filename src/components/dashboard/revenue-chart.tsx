"use client";

import { revenueData } from "@/data/dashboard";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenueChartProps = {
  locale: Locale;
};

export default function RevenueChart({ locale }: RevenueChartProps) {
  const messages = getMessages(locale);

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          {messages.dashboard.revenueTitle}
        </h2>
        <p className="text-sm text-[var(--foreground-soft)]">
          {messages.dashboard.revenueSubtitle}
        </p>
      </div>

      <div className="h-[320px] w-full px-4 py-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b6ff66" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#b6ff66" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fill: "#88a394", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#88a394", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={50}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(10, 22, 17, 0.96)",
                border: "1px solid rgba(168, 255, 196, 0.12)",
                borderRadius: "16px",
                color: "#f5fff8",
              }}
              labelStyle={{ color: "#b8d2c1" }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#b6ff66"
              strokeWidth={3}
              fill="url(#revenueFill)"
              dot={{ r: 4, fill: "#b6ff66", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#9dff3f", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}