import React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MonthCousreLineChartProps {
    chartData: { datum: string, einnahmen: number, ausgaben: number}[];
}

export const MonthCousreLineChart: React.FC<MonthCousreLineChartProps> = ({
    chartData,
}) => {
    return (
        <div className="w-full p-3 flex flex-col primary-background-color rounded-md gap-2">
            <h2 className="text-2xl text-white font-semibold">Monatsverlauf</h2>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%" className="bg-white p-3 rounded-md" >
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="datum" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="einnahmen"
                            stroke="#82ca9d"
                            name="Einnahmen"
                        />
                        <Line
                            type="monotone"
                            dataKey="ausgaben"
                            stroke="#ff6961"
                            name="Ausgaben"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}