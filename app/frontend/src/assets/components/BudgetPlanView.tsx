import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Month } from '../types/month';

function BudgetPlanView() {

    const location = useLocation();
    const { budget_id } = location.state || {};
    const { budget_name } = location.state || {};
    const [data, setData] = useState<Month[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const backendUrl = "http://localhost:8000"
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    const navigateToMonth = (id: string) => {
        navigate("/plan/month", {
            state: { month_id: id }
        })
    }

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

    const deleteMonthbyID = (id: string) => {
        fetch(`${backendUrl}/month/${id}`, {
            method: "DELETE"
        })
            .then((response) => {
                if (response.ok) {
                    fetchBudgets();
                }
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
                <h1 className="text-4xl text-white">
                    {budget_name} - Overall Dashboard Coming Soon...
                </h1>
            </section>
            {/* Monate */}
            <section
                className="w-1/3 flex flex-col h-full rounded-l-2xl overflow-auto bg-white"
            >
                {data.map((month) => (
                    <div
                        key={month.monat_id}
                        className="p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer flex flex-row gap-5 items-center justify-between"
                        onClick={() => navigateToMonth(month.monat_id)}
                    >
                        <div className='w-[200px]'>
                            <h3 className="text-lg font-semibold">{month.monat_name}</h3>
                            <p className="text-sm text-gray-600">
                                {month.start_datum} – {month.end_datum}
                            </p>
                        </div>
                        <div className='w-1/3 text-center rounded-md overflow-hidden'>
                            <p className="bg-green-300 text-sm">Einnahmen: {month.total_einnahmen} CHF</p>
                            <p className="bg-red-300 text-sm">Ausgaben: {month.total_ausgaben} CHF</p>
                            <p className="bg-gray-100 text-sm font-medium">Umsatz: {month.total_umsatz} CHF</p>
                        </div>
                    </div>
                ))}
            </section>
            <button
                className='fixed top-5 left-5 bg-white text-md aspect-square w-[40px] rounded-xl cursor-pointer flex items-center justify-center'
                onClick={goBack}
            >
                <i className="fa-solid fa-xmark text-sky-400 text-2xl"></i>
            </button>
        </main>
    )
}

export default BudgetPlanView