import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface MonthCategoricalExpensesCakeChartProps {
    pieChartData: { name: string, value: number}[];
}

export const MonthCategoricalExpensesCakeChart: React.FC<MonthCategoricalExpensesCakeChartProps> = ({
    pieChartData,
}) => {

    function stringToRandomPastelColor(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i) * (i + 1);
            hash |= 0;
        }
        const h = Math.abs(hash) % 360;
        const s = 50 + (Math.abs(hash * 7) % 20);
        const l = 75 + (Math.abs(hash * 13) % 15);

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent
    }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="black"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-xs font-semibold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="w-full p-3 rounded-md flex flex-col primary-background-color gap-2">
            <h2 className="text-2xl text-white font-semibold">Ausgaben Prozentual</h2>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%" className="bg-white p-3 rounded-md">
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={renderCustomizedLabel}
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={stringToRandomPastelColor(entry.name)}
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value.toFixed(2)} CHF`} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}