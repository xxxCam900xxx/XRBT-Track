import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Month } from '../types/month';

function BudgetPlanView() {

    const location = useLocation();
    const { budget_id } = location.state || {};
    const [data, setData] = useState<Month[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const backendUrl = "http://localhost:8000"

    const fetchBudgets = () => {
        fetch(`${backendUrl}/month/${budget_id}`)
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data: Month[]) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchBudgets();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main className="flex flex-row h-full w-full bg-sky-300">
            {/* Dashboard */}
            <section
                className="w-2/3 flex justify-center items-center p-5"
            >

            </section>
            {/* Monate */}
            <section
                className="w-1/3 flex flex-col h-full rounded-l-2xl overflow-hidden bg-white"
            >
                {data.map((month) => (
                    <div
                        key={month.monat_id}
                        className="p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                    >
                        <h3 className="text-lg font-semibold">{month.monat_name}</h3>
                        <p className="text-sm text-gray-600">
                            {month.start_datum} – {month.end_datum}
                        </p>
                        <p className="text-sm">Einnahmen: {month.total_einnahmen} €</p>
                        <p className="text-sm">Ausgaben: {month.total_ausgaben} €</p>
                        <p className="text-sm font-medium">Umsatz: {month.total_umsatz} €</p>
                    </div>
                ))}
            </section>
        </main>
    )
}

export default BudgetPlanView