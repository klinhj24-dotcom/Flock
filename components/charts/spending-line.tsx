"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SPENDING_TREND } from "@/lib/mock-data";

export function SpendingLine() {
  return (
    <div className="h-[120px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={SPENDING_TREND}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8D5A3" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#E8D5A3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B6880", fontSize: 11 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ stroke: "#1E1E2E", strokeWidth: 1 }}
            contentStyle={{
              background: "#13131A",
              border: "1px solid #1E1E2E",
              borderRadius: 8,
              fontSize: 12,
              color: "#F2F0EB",
            }}
            formatter={(v: number) => [`$${v}`, "Spent"]}
          />
          <Area
            type="monotone"
            dataKey="spent"
            stroke="#E8D5A3"
            strokeWidth={2}
            fill="url(#spendGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
