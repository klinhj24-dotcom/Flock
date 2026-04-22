"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { BUDGET_CATEGORIES } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function BudgetDonut() {
  const data = BUDGET_CATEGORIES.map((c) => ({
    name: c.name,
    value: c.budgeted,
    color: c.color,
  }));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              strokeWidth={2}
              stroke="#0A0A0F"
              paddingAngle={1.5}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#13131A",
                border: "1px solid #1E1E2E",
                borderRadius: 8,
                fontSize: 12,
                color: "#F2F0EB",
              }}
              formatter={(v: number, name: string) => [
                formatCurrency(v),
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: d.color }}
            />
            <span className="text-text-muted">{d.name}</span>
            <span className="ml-auto font-medium text-text-primary">
              {formatCurrency(d.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
