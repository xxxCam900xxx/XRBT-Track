import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Month } from '../types/month';

function BudgetPlanView() {

    const location = useLocation();
    const { budget_id } = location.state || {};
    const { budget_name } = location.state || {};
    const [data, setData] = useState<Month[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalIncomes, setTotalIncomes] = useState(0);
    const [totalOutgoings, setTotalOutgoings] = useState(0);
    const [total, setTotal] = useState(0);
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

    const fetchBudgets = async (): Promise<Month[]> => {
        try {
            const response = await fetch(`${backendUrl}/month/${budget_id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Month[] = await response.json();
            setData(data);
            return data;
        } catch (err: any) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchAndCalculateTotals = useCallback(async () => {
        if (!budget_id) {
            console.warn("budget_id is not available, cannot fetch bookings.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const fetchedMonths = await fetchBudgets();

            const calculatedTotalIncomes = fetchedMonths.reduce(
                (sum, item) => sum + parseFloat(item.total_einnahmen || '0'),
                0
            );
            const calculatedTotalOutgoings = fetchedMonths.reduce(
                (sum, item) => sum + parseFloat(item.total_ausgaben || '0'),
                0
            );

            setTotalIncomes(calculatedTotalIncomes);
            setTotalOutgoings(calculatedTotalOutgoings);
            setTotal(calculatedTotalIncomes + calculatedTotalOutgoings)

            const response = await fetch(`${backendUrl}/budget/${budget_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total_einnahmen: calculatedTotalIncomes,
                    total_ausgaben: calculatedTotalOutgoings,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log("Budgetstatistik erfolgreich aktualisiert.");
        } catch (err: any) {
            console.error("Fehler beim Aktualisieren der Budgetstatistik:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, budget_id]);

    useEffect(() => {
        fetchBudgets();
        fetchAndCalculateTotals();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <main className="flex flex-row h-full w-full bg-sky-300">
            {/* Dashboard */}
            <section
                className="w-2/3 flex flex-col justify-center gap-5 items-center p-5"
            >
                <h1 className="text-4xl text-white">
                    {budget_name} - Overall Dashboard Coming Soon...
                </h1>
                <div className='flex gap-5'>
                    <div className='border border-gray-50 shadow-xl text-xl rounded-xl bg-green-100 py-5 px-10'>{totalIncomes}</div>
                    <div className='border border-gray-50 shadow-xl text-xl rounded-xl bg-red-100 py-5 px-10'>{totalOutgoings}</div>
                    <div className='border border-gray-50 shadow-xl text-xl rounded-xl bg-gray-100 py-5 px-10'>{total}</div>
                </div>
                {/* Visuelle Statisik Ausgaben pro Kategorie in allen Monaten */}

                {/* Visuelle Statisik Verlauf der Ausgaben */}

                {/* Visuelle Statisik Verlauf der Einnahmen */}
            </section>
            {/* Monate */}
            <section
                className="w-1/3 flex flex-col h-full rounded-l-2xl overflow-auto bg-white"
            >
                {data.map((month) => {

                    const startitemDate = new Date(month.start_datum);
                    const startformattedDate = startitemDate.toLocaleDateString("de-DE");

                    const enditemDate = new Date(month.end_datum);
                    const endformattedDate = enditemDate.toLocaleDateString("de-DE");

                    return (
                        <div
                            key={month.monat_id}
                            className="p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer flex flex-row gap-5 items-center justify-between"
                            onClick={() => navigateToMonth(month.monat_id)}
                        >
                            <div className='w-[200px]'>
                                <h3 className="text-lg font-semibold">{month.monat_name}</h3>
                                <p className="text-sm text-gray-600">
                                    {startformattedDate} – {endformattedDate}
                                </p>
                            </div>
                            <div className='w-1/3 text-center rounded-md overflow-hidden'>
                                <p className="bg-green-300 text-sm">Einnahmen: {month.total_einnahmen} CHF</p>
                                <p className="bg-red-300 text-sm">Ausgaben: {month.total_ausgaben} CHF</p>
                                <p className="bg-gray-100 text-sm font-medium">Umsatz: {month.total_umsatz} CHF</p>
                            </div>
                        </div>
                    )
                })}
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