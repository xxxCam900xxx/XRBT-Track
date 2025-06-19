import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Month } from '../types/month';
import { Booking } from '../types/booking';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

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
  const [categoryChartData, setCategoryChartData] = useState<
    { Monat: string; [titel: string]: number }[]>([]);

  const backendUrl = "http://localhost:8000";
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const navigateToMonth = (id: string) => {
    navigate("/plan/month", {
      state: { month_id: id },
    });
  };

  const fetchBudgets = async (): Promise<Month[]> => {
    const response = await fetch(`${backendUrl}/month/${budget_id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const months: Month[] = await response.json();
    setData(months);
    return months;
  };

  const fetchAmounts = async (type: 'einnahme' | 'ausgabe') => {
    const response = await fetch(`${backendUrl}/month/${budget_id}/${type}`);
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    const result: { Monat: string; Buchungen: Booking[] }[] = await response.json();
    return result;
  };

  function summiereAlleTitelProMonat(
    data: { Monat: string; Buchungen: Booking[] }[]
  ): { Monat: string; [titel: string]: number }[] {
    return data.map(({ Monat, Buchungen }) => {
      const summen: { [titel: string]: number } = {};
      for (const buchung of Buchungen) {
        const titel = buchung.titel;
        const betrag = parseFloat(buchung.betrag);
        if (!summen[titel]) summen[titel] = 0;
        summen[titel] += betrag;
      }
      return { Monat, ...summen };
    });
  }

  function getColor(index: number) {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57', '#b19cd9'];
    return colors[index % colors.length];
  }

  useEffect(() => {
    if (!budget_id) return;

    const loadData = async () => {
      try {
        const fetchedMonths = await fetchBudgets();

        const totalIn = fetchedMonths.reduce(
          (sum, item) => sum + parseFloat(item.total_einnahmen || '0'),
          0
        );
        const totalOut = fetchedMonths.reduce(
          (sum, item) => sum + parseFloat(item.total_ausgaben || '0'),
          0
        );

        setTotalIncomes(totalIn);
        setTotalOutgoings(totalOut);
        setTotal(totalIn + totalOut);

        await fetch(`${backendUrl}/budget/${budget_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total_einnahmen: totalIn,
            total_ausgaben: totalOut,
          }),
        });

        const ausgaben = await fetchAmounts('ausgabe');
        const summarized = summiereAlleTitelProMonat(ausgaben);
        setCategoryChartData(summarized);

      } catch (err: any) {
        console.error("Fehler beim Laden:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadData();
  }, [budget_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Titelkeys automatisch extrahieren (außer "Monat")
  const allKeys = Array.from(
    new Set(
      categoryChartData.flatMap(obj =>
        Object.keys(obj).filter(key => key !== 'Monat')
      )
    )
  );

  return (
    <main className="flex flex-row h-full w-full bg-sky-300">
      <section className="w-2/3 flex flex-col justify-center gap-5 items-center p-5">
        <h1 className="text-4xl text-white">{budget_name} - Dashboard</h1>

        <div className="flex gap-5">
          <div className="border border-gray-50 shadow-xl text-xl rounded-xl bg-green-100 py-5 px-10">
            {totalIncomes} CHF
          </div>
          <div className="border border-gray-50 shadow-xl text-xl rounded-xl bg-red-100 py-5 px-10">
            {totalOutgoings} CHF
          </div>
          <div className="border border-gray-50 shadow-xl text-xl rounded-xl bg-gray-100 py-5 px-10">
            {total} CHF
          </div>
        </div>

        {/* Chart */}
        <div className="mt-10 bg-white p-5 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-2xl mb-4">Ausgaben pro Kategorie und Monat</h2>
          <BarChart width={600} height={300} data={categoryChartData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="Monat" />
            <YAxis />
            <Tooltip />
            <Legend />
            {allKeys.map((key, index) => (
              <Bar key={key} dataKey={key} stackId="a" fill={getColor(index)} />
            ))}
          </BarChart>
        </div>
      </section>

      <section className="w-1/3 flex flex-col h-full rounded-l-2xl overflow-auto bg-white">
        {data.map((month) => {
          const start = new Date(month.start_datum).toLocaleDateString("de-DE");
          const end = new Date(month.end_datum).toLocaleDateString("de-DE");

          return (
            <div
              key={month.monat_id}
              className="p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer flex flex-row gap-5 items-center justify-between"
              onClick={() => navigateToMonth(month.monat_id)}
            >
              <div className="w-[200px]">
                <h3 className="text-lg font-semibold">{month.monat_name}</h3>
                <p className="text-sm text-gray-600">{start} – {end}</p>
              </div>
              <div className="w-1/3 text-center rounded-md overflow-hidden">
                <p className="bg-green-300 text-sm">Einnahmen: {month.total_einnahmen} CHF</p>
                <p className="bg-red-300 text-sm">Ausgaben: {month.total_ausgaben} CHF</p>
                <p className="bg-gray-100 text-sm font-medium">Umsatz: {month.total_umsatz} CHF</p>
              </div>
            </div>
          );
        })}
      </section>

      <button
        className="fixed top-5 left-5 bg-white text-md aspect-square w-[40px] rounded-xl cursor-pointer flex items-center justify-center"
        onClick={goBack}
      >
        <i className="fa-solid fa-xmark text-sky-400 text-2xl"></i>
      </button>
    </main>
  );
}

export default BudgetPlanView;