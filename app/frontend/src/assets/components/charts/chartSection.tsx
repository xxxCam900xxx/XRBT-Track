import React, { useState } from "react";
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

interface ChartSectionProps {
  title: string;
  icon: string;
  data: any[];
  withToggle?: boolean; // ⬅️ Steuerung: Sollen Buttons angezeigt werden?
  categoryTitles?: string[];
  generateColor?: (key: string) => string;
}

/**
 * ChartSection Komponent, das selbständig Toggle-Buttons für Einnahmen/Ausgaben/Umsatz steuert.
 */
export const ChartSection: React.FC<ChartSectionProps> = ({
  title,
  icon,
  data,
  withToggle = false,
  categoryTitles,
  generateColor,
}) => {
  const [visibleLines, setVisibleLines] = useState({
    einnahmen: true,
    ausgaben: true,
    umsatz: true,
  });

  const toggleLine = (key: keyof typeof visibleLines) => {
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="w-full text-white">
      <div className="secondary-background-color w-full p-3 rounded-md">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-3 gap-2">
          <div className="flex gap-2 items-center">
            <i className={`fa-solid ${icon} text-3xl primary-background-textcolor`} />
            <h1 className="primary-background-textcolor text-3xl font-semibold">{title}</h1>
          </div>
          {withToggle && (
            <div className="flex gap-2">
              {(["einnahmen", "ausgaben", "umsatz"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => toggleLine(key)}
                  className={`p-2 rounded-md font-semibold w-full md:w-fit ${
                    visibleLines[key]
                      ? "primary-background-color text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="h-[250px] bg-white rounded-md p-5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Monat" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} CHF`} />
              <Legend />
              {withToggle ? (
                Object.entries(visibleLines).map(
                  ([key, visible]) =>
                    visible && (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={
                          key === "einnahmen"
                            ? "#10b981"
                            : key === "ausgaben"
                            ? "#ef4444"
                            : "#6366f1"
                        }
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name={key.charAt(0).toUpperCase() + key.slice(1)}
                        connectNulls
                      />
                    )
                )
              ) : (
                categoryTitles?.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={generateColor ? generateColor(key) : "#8884d8"}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};