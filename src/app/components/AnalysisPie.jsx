"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE"];

export default function AnalysisPie({ data }) {
  if (!data || data.length === 0) return null;

  const pieData = data.map((f) => ({
    name: f.field_name,
    value: parseFloat(f.percentage), // ensure numeric
  }));

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">📊 Field Percentage</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label={(entry) => `${entry.name}: ${entry.value}%`}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
      </PieChart>
    </div>
  );
}
