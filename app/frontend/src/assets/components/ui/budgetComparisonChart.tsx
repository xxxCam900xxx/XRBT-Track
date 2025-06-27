import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface BudgetComparisonChartProps {
  data: any[];
}

export const BudgetComparisonChart: React.FC<BudgetComparisonChartProps> = ({ data }) => {
  return (
    <section className="w-full">
      <div className="w-full h-[400px] secondary-background-color rounded-md flex flex-col gap-2 p-3">
        <div className="flex flex-row gap-2">
          <i className="fa-solid fa-code-compare text-3xl primary-background-textcolor"></i>
          <h1 className="text-3xl font-semibold primary-background-textcolor">Budget Vergleiche</h1>
        </div>
        <div className="h-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
            className="bg-white rounded-md"
          >
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jahr" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toFixed(2)} CHF`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_einnahmen"
                stroke="#22c55e"
                name="Einnahmen"
              />
              <Line
                type="monotone"
                dataKey="total_ausgaben"
                stroke="#ef4444"
                name="Ausgaben"
              />
              <Line
                type="monotone"
                dataKey="total_umsatz"
                stroke="#3b82f6"
                name="Umsatz"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};