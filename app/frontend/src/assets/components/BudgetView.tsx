import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

import { Month } from '../types/month';
import { Booking } from '../types/booking';
import ImportMonthsPopUp from '../widgets/ImportMonthsPopUp';

const backendUrl = "http://localhost:8000";

const BudgetPlanView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { budget_id, budget_name } = state || {};

  const [months, setMonths] = useState<Month[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalOutgoings, setTotalOutgoings] = useState(0);
  const [total, setTotal] = useState(0);
  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [gesamtLineChartData, setGesamtLineChartData] = useState<any[]>([]);
  const [categoryTitles, setCategoryTitles] = useState<string[]>([]);
  const [visibleLines, setVisibleLines] = useState({
    einnahmen: true,
    ausgaben: true,
    umsatz: true,
  });

  const toggleLine = (key: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const navigateToMonth = (id: string, name: string, startDate: string) => {
    navigate("/plan/month", {
      state: { month_id: id, monthName: name, monthStart: startDate },
    });
  };

  const fetchBudgets = async (): Promise<Month[]> => {
    const res = await fetch(`${backendUrl}/month/${budget_id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  };

  const fetchAmounts = async (type: 'einnahme' | 'ausgabe') => {
    const res = await fetch(`${backendUrl}/month/${budget_id}/${type}`);
    if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
    return await res.json();
  };

  const downloadExport = async (): Promise<void> => {
    const res = await fetch(`${backendUrl}/export/${budget_id}`);

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `budget_export_${budget_name}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  const prepareCategoryChartData = (data: { Monat: string; Buchungen: Booking[] }[]) => {
    const monthlyData: Record<string, Record<string, number>> = {};

    data.forEach(({ Monat, Buchungen }) => {
      if (!monthlyData[Monat]) monthlyData[Monat] = {};
      Buchungen.forEach(({ titel, betrag }) => {
        const amount = Math.abs(parseFloat(betrag));
        monthlyData[Monat][titel] = (monthlyData[Monat][titel] || 0) + amount;
      });
    });

    const allTitles = Array.from(
      new Set(Object.values(monthlyData).flatMap(obj => Object.keys(obj)))
    );

    const chartData = Object.entries(monthlyData).map(([Monat, values]) => {
      const entry: any = { Monat };
      allTitles.forEach(titel => {
        entry[titel] = values[titel] || 0;
      });
      return entry;
    });

    return { chartData, allTitles };
  };

  const buildLineChartData = (data: Month[], type: keyof Pick<Month, 'total_einnahmen' | 'total_ausgaben' | 'total_umsatz'>) => {
    return data.map(month => ({
      Monat: month.monat_name,
      Wert: parseFloat(month[type] || '0'),
    }));
  };

  const buildTotalLineChartData = (data: Month[]) => {
    return data.map(month => ({
      Monat: month.monat_name,
      einnahmen: parseFloat(month.total_einnahmen || '0'),
      ausgaben: parseFloat(month.total_ausgaben || '0'),
      umsatz: parseFloat(month.total_umsatz || '0'),
    }));
  };

  const generatePastelColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i) * (i + 1);
      hash |= 0;
    }
    const h = Math.abs(hash) % 360;
    const s = 50 + (Math.abs(hash * 7) % 20);
    const l = 75 + (Math.abs(hash * 13) % 15);
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  const [displayImportPopUp, setDisplayImportPopUp] = useState<boolean>(false);
  const handleImportClick = () => {
    setDisplayImportPopUp(true)
  }

  const loadData = async () => {
    try {
      const months = await fetchBudgets();
      setMonths(months);

      const totalIn = months.reduce((sum, m) => sum + parseFloat(m.total_einnahmen || '0'), 0);
      const totalOut = months.reduce((sum, m) => sum + parseFloat(m.total_ausgaben || '0'), 0);

      setTotalIncomes(totalIn);
      setTotalOutgoings(totalOut);
      setTotal(totalIn + totalOut);

      await fetch(`${backendUrl}/budget/${budget_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total_einnahmen: totalIn, total_ausgaben: totalOut }),
      });

      const expenses = await fetchAmounts('ausgabe');
      const { chartData, allTitles } = prepareCategoryChartData(expenses);

      setGesamtLineChartData(buildTotalLineChartData(months));
      setLineChartData(chartData);
      setCategoryTitles(allTitles);
    } catch (err: any) {
      console.error("Fehler beim Laden:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!budget_id) return;
    setLoading(true);
    loadData();
  }, [budget_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex flex-row h-full w-full primary-background-color">
      {/* Sidebar */}
      <section className="w-1/4 flex flex-col h-full secondary-background-color shadow-2xl">
        <img src="/images/XRBT-Banner.png" alt="XRBT-Banner" className='w-full' />
        <div className="p-5 overflow-y-auto flex flex-col gap-3">
          {months.map(month => (
            <div
              key={month.monat_id}
              className="p-2 rounded-md cursor-pointer flex justify-between items-center primary-background-color"
              onClick={() => navigateToMonth(month.monat_id, month.monat_name, month.start_datum)}
            >
              <h3 className="text-2xl text-white font-semibold">{month.monat_name}</h3>
              <p className={`${parseFloat(month.total_umsatz) < 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-50 text-emerald-600'} p-2 rounded-md w-[150px] text-center text-lg font-medium`}>
                {month.total_umsatz} CHF
              </p>
            </div>
          ))}
        </div>
        <div className='secondary-background-color flex flex-row gap-2 p-5'>
          <button
            className="px-5 h-fit w-full py-2 rounded-md cursor-pointer text-white text-xl font-semibold primary-background-color"
            onClick={handleImportClick}
          >
            Import
          </button>
          <button
            className="px-5 h-fit w-full py-2 rounded-md cursor-pointer text-white text-xl font-semibold primary-background-color"
            onClick={downloadExport}
          >
            Export
          </button>
        </div>

        {displayImportPopUp && (
          <ImportMonthsPopUp
            displayNewBudgetPopUp={displayImportPopUp}
            setDisplayNewBudgetPopUp={setDisplayImportPopUp}
            budget_id={budget_id}
            fetchBudgets={loadData}
          />
        )}
      </section>

      {/* Dashboard */}
      <aside className='w-3/4 p-10 overflow-y-auto flex flex-col gap-5'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h1 className='text-4xl text-white font-semibold'>{budget_name}</h1>
          <button
            onClick={() => navigate(-1)}
            className="secondary-background-color w-[50px] aspect-square rounded-xl flex items-center justify-center"
          >
            <i className="fa-solid fa-xmark primary-background-textcolor text-3xl"></i>
          </button>
        </div>

        {/* Totals Section */}
        <div className='flex gap-5'>
          {[
            { title: 'Einnahmen', icon: 'fa-piggy-bank', value: totalIncomes, color: 'bg-emerald-50 text-emerald-600', prefix: '+' },
            { title: 'Ausgaben', icon: 'fa-cart-shopping', value: totalOutgoings, color: 'bg-red-50 text-red-600' },
            { title: 'Umsatz', icon: 'fa-chart-simple', value: total, color: total < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600' },
          ].map(({ title, icon, value, color, prefix }) => (
            <div key={title} className='flex flex-col gap-2 p-3 secondary-background-color w-full rounded-md'>
              <div className='flex gap-2 items-center'>
                <i className={`fa-solid ${icon} text-3xl primary-background-textcolor`} />
                <h1 className='text-3xl font-semibold primary-background-textcolor'>{title}</h1>
              </div>
              <div className={`${color} text-center text-3xl font-semibold p-3 rounded-md`}>
                {prefix || ''}{value} CHF
              </div>
            </div>
          ))}
        </div>

        {/* Jahres Verlauf */}
        <ChartSection
          title="Jahres Verlauf"
          icon="fa-chart-simple"
          data={gesamtLineChartData}
          visibleLines={visibleLines}
          toggleLine={toggleLine}
        />

        {/* Kategorie Verlauf */}
        <ChartSection
          title="Ausgaben Verlauf Pro Kategorie"
          icon="fa-chart-simple"
          data={lineChartData}
          categoryTitles={categoryTitles}
          generateColor={generatePastelColor}
        />
      </aside>
    </main>
  );
};

const ChartSection = ({ title, icon, data, visibleLines, toggleLine, categoryTitles, generateColor }: any) => (
  <section className='w-full text-white'>
    <div className='secondary-background-color w-full p-3 rounded-md'>
      <div className='flex justify-between items-center mb-3'>
        <div className='flex gap-2 items-center'>
          <i className={`fa-solid ${icon} text-3xl primary-background-textcolor`} />
          <h1 className='primary-background-textcolor text-3xl font-semibold'>{title}</h1>
        </div>
        {visibleLines && toggleLine && (
          <div className='flex gap-2'>
            {(['einnahmen', 'ausgaben', 'umsatz'] as const).map(key => (
              <button
                key={key}
                onClick={() => toggleLine(key)}
                className={`p-2 rounded-md font-semibold ${visibleLines[key] ? 'primary-background-color text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className='h-[250px] bg-white rounded-md p-5'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Monat" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} CHF`} />
            <Legend />
            {visibleLines ? (
              Object.entries(visibleLines).map(([key, visible]) =>
                visible ? (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={key === 'einnahmen' ? '#10b981' : key === 'ausgaben' ? '#ef4444' : '#6366f1'}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name={key.charAt(0).toUpperCase() + key.slice(1)}
                    connectNulls
                  />
                ) : null
              )
            ) : (
              categoryTitles?.map((key: string) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={generateColor(key)}
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

export default BudgetPlanView;