import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Month } from '../types/month';
import { Booking } from '../types/booking';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [allTitles, setAllTitles] = useState<string[]>([]);

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

  function bereiteLineChartDatenVor(data: { Monat: string; Buchungen: Booking[] }[]) {
    const monatZuTitel: Record<string, Record<string, number>> = {};

    data.forEach(({ Monat, Buchungen }) => {
      if (!monatZuTitel[Monat]) monatZuTitel[Monat] = {};
      Buchungen.forEach(b => {
        const betrag = Math.abs(parseFloat(b.betrag));
        monatZuTitel[Monat][b.titel] = (monatZuTitel[Monat][b.titel] || 0) + betrag;
      });
    });

    const titelSet = new Set<string>();
    Object.values(monatZuTitel).forEach(obj => {
      Object.keys(obj).forEach(titel => titelSet.add(titel));
    });

    const result = Object.entries(monatZuTitel).map(([Monat, werte]) => {
      const eintrag: any = { Monat };
      titelSet.forEach(titel => {
        eintrag[titel] = werte[titel] || 0;
      });
      return eintrag;
    });

    return { daten: result, titelListe: Array.from(titelSet) };
  }

  function stringToRandomPastelColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i) * (i + 1);
      hash |= 0; // Force 32bit integer
    }
    const h = Math.abs(hash) % 360;

    // Zufällige leichte Variation von Sättigung und Helligkeit
    const s = 50 + (Math.abs(hash * 7) % 20); // 50–69%
    const l = 75 + (Math.abs(hash * 13) % 15); // 75–89%

    return `hsl(${h}, ${s}%, ${l}%)`;
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
        const { daten, titelListe } = bereiteLineChartDatenVor(ausgaben);
        setLineChartData(daten);
        setAllTitles(titelListe);

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

  return (
    <main className="flex flex-row h-full w-full primary-background-color">

      {/* Navigation Section */}
      <section className="w-1/4 flex flex-col h-full secondary-background-color shadow-2xl">

        <img src="/images/XRBT-Banner.png" alt="XRBT-Banner" className='w-full' />

        <section className="w-full h-full max-h-full overflow-y-auto flex flex-col p-5 gap-3">
          {data.map((month) => {

            return (
              <div
                key={month.monat_id}
                className="p-2 rounded-md cursor-pointer flex flex-row gap-5 items-center justify-between primary-background-color"
                onClick={() => navigateToMonth(month.monat_id)}
              >
                <h3 className="text-2xl text-white font-semibold">{month.monat_name}</h3>
                <p className={`${parseFloat(month.total_umsatz) < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  } p-2 rounded-md w-[150px] text-center text-lg font-medium`}>{month.total_umsatz} CHF</p>
              </div>
            );
          })}
        </section>
      </section>

      {/* Dashboard Section */}
      <aside className='flex flex-col gap-5 w-3/4 p-10'>

        {/* Namespace */}
        <section className='flex flex-row justify-between items-center'>
          <h1 className='text-4xl text-white font-semibold'>{budget_name}</h1>
          {/* Return Button */}
          <button
            className="secondary-background-color text-md aspect-square w-[50px] rounded-xl cursor-pointer flex items-center justify-center"
            onClick={goBack}
          >
            <i className="fa-solid fa-xmark primary-background-textcolor text-3xl"></i>
          </button>
        </section>

        {/* Totals */}
        <section className='flex gap-5'>
          <div className='flex flex-col gap-2 p-3 secondary-background-color w-full h-fit rounded-md'>
            <div className='flex flex-row gap-2 w-full items-center'>
              <i className="fa-solid fa-piggy-bank text-3xl primary-background-textcolor"></i>
              <h1 className='text-3xl font-semibold primary-background-textcolor'>Einnahmen</h1>
            </div>
            <div className='bg-emerald-50 text-emerald-600 text-center text-3xl font-semibold p-3 rounded-md'>
              +{totalIncomes} CHF
            </div>
          </div>
          <div className='flex flex-col gap-2 p-3 secondary-background-color w-full h-fit rounded-md'>
            <div className='flex flex-row gap-2 w-full items-center'>
              <i className="fa-solid fa-cart-shopping text-3xl primary-background-textcolor"></i>
              <h1 className='text-3xl font-semibold primary-background-textcolor'>Ausgaben</h1>
            </div>
            <div className='bg-red-50 text-red-600 text-center text-3xl font-semibold p-3 rounded-md'>
              {totalOutgoings} CHF
            </div>
          </div>
          <div className='flex flex-col gap-2 p-3 secondary-background-color w-full h-fit rounded-md'>
            <div className='flex flex-row gap-2 w-full items-center'>
              <i className="fa-solid fa-chart-simple text-3xl primary-background-textcolor"></i>
              <h1 className='text-3xl font-semibold primary-background-textcolor'>Umsatz</h1>
            </div>
            <div
              className={`${total < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                } text-center text-3xl font-semibold p-3 rounded-md`}
            >
              {total} CHF
            </div>
          </div>
        </section>

        {/* Statistic Jahres Verlauf */}
        <section className='flex items-center w-full text-white justify-center'>

          <div className='flex flex-col gap-2 secondary-background-color w-full p-3 rounded-md'>
            <div className='flex flex-row gap-2 w-full items-center justify-between'>
              <div className='flex flex-row gap-2 w-full items-center'>
                <i className="fa-solid fa-chart-simple text-3xl primary-background-textcolor"></i>
                <h1 className='primary-background-textcolor text-3xl font-semibold'>Jahres Verlauf</h1>
              </div>
              <div className='flex flex-row gap-2 items-center'>
                <button className='p-2 primary-background-color text-white font-semibold rounded-md cursor-pointer'>Einnahmen</button>
                <button className='p-2 primary-background-color text-white font-semibold rounded-md cursor-pointer'>Ausgaben</button>
                <button className='p-2 primary-background-color text-white font-semibold rounded-md cursor-pointer'>Umsatz</button>
              </div>
            </div>
            <div className='h-[250px]'>
              <ResponsiveContainer width="100%" height="100%" className={"bg-white rounded-md p-5"}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Monat" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} CHF`} />
                  <Legend />
                  {allTitles.map((titel, index) => (
                    <Line
                      key={titel}
                      type="monotone"
                      dataKey={titel}
                      stroke={stringToRandomPastelColor(titel)}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Statistic Umsatz Verlauf Pro Kategorie */}
        <section className='flex items-center w-full text-white justify-center'>
          <div className='flex flex-col gap-2 secondary-background-color w-full p-3 rounded-md'>
            <div className='flex flex-row gap-2 w-full items-center'>
              <i className="fa-solid fa-chart-simple text-3xl primary-background-textcolor"></i>
              <h1 className='primary-background-textcolor text-3xl font-semibold'>Ausgaben Verlauf Pro Kategorie</h1>
            </div>
            <div className='h-[250px]'>
              <ResponsiveContainer width="100%" height="100%" className={"bg-white rounded-md p-5"}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Monat" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} CHF`} />
                  <Legend />
                  {allTitles.map((titel, index) => (
                    <Line
                      key={titel}
                      type="monotone"
                      dataKey={titel}
                      stroke={stringToRandomPastelColor(titel)}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </aside>
    </main>
  );
}

export default BudgetPlanView;