import { use, useEffect, useState } from 'react';
import { Budget } from '../types/budget';
import CreateNewBudgetPopUp from '../widgets/CreateNewBudgetPopUp';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { BudgetStats } from '../types/overview';
import DashboardTotals from './ui/dashboardTotals';

function OverallView() {
  const [data, setData] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayNewBudgetPopUp, setDisplayNewBudgetPopUp] = useState<boolean>(false);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalOutgoings, setTotalOutgoings] = useState(0);
  const [total, setTotal] = useState(0);
  const backendUrl = "http://localhost:8000";
  const navigate = useNavigate();
  const [groupedData, setGroupedData] = useState<{ Name: string; Betrag: number; Typ: string }[]>([]);
  const [rawStats, setRawStats] = useState<BudgetStats[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const availableCategories = groupedData
    .filter(entry => entry.Typ === "ausgabe")
    .map(entry => entry.Name);

  const totalByCategory: Record<string, number> = {};
  groupedData.forEach(entry => {
    if (entry.Typ === "ausgabe") {
      totalByCategory[entry.Name] = (totalByCategory[entry.Name] || 0) + entry.Betrag;
    }
  });

  const fetchBudgets = async (): Promise<Budget[]> => {
    try {
      const response = await fetch(`${backendUrl}/budget/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: Budget[] = await response.json();
      setData(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStatsOverall = async (type: "einnahme" | "ausgabe"): Promise<BudgetStats[]> => {
    try {
      const response = await fetch(`${backendUrl}/budget/stats/${type}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: BudgetStats[] = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }

  const groupBookingsByName = (budgets: BudgetStats[]) => {
    const map: Record<string, { Betrag: number; Typ: string }> = {};

    budgets.forEach(budget => {
      budget.Months.forEach(month => {
        month.Bookings.forEach(booking => {
          if (!map[booking.Name]) {
            map[booking.Name] = { Betrag: 0, Typ: booking.Typ };
          }
          map[booking.Name].Betrag += booking.Betrag;
        });
      });
    });

    // Ergebnis als Array zurückgeben mit Typ
    return Object.entries(map).map(([Name, { Betrag, Typ }]) => ({ Name, Betrag, Typ }));
  };

  const CalculateTotals = async () => {
    setLoading(true);
    setError(null);

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

  }

  const deleteBudgetById = (id: string) => {
    fetch(`${backendUrl}/budget/${id}`, {
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

  const handleClickBudgetPlan = (id: string, name: string) => {
    navigate("/plan", {
      state: { budget_id: id, budget_name: name }
    })
  }

  // filtered per budget table rows for selectedCategory
  const filteredTableRows = selectedCategory
    ? rawStats.map((budget, idx) => {
      let total = 0;
      budget.Months.forEach(month => {
        month.Bookings.forEach(b => {
          if (b.Typ === "ausgabe" && b.Name === selectedCategory) {
            total += b.Betrag;
          }
        });
      });
      if (total === 0) return null;
      return (
        <tr key={idx} className="bg-red-50 text-red-600">
          <td className="px-6 py-4">{budget.Budgetname}</td>
          <td className="px-6 py-4">{total.toFixed(2)} CHF</td>
        </tr>
      );
    })
    : null;

  useEffect(() => {
    fetchBudgets();
    fetchStatsOverall("ausgabe").then((stats) => {
      const grouped = groupBookingsByName(stats);
      setGroupedData(grouped);
      setRawStats(stats);

      // Automatisch erste verfügbare Kategorie auswählen
      const firstAusgabe = grouped.find(entry => entry.Typ === "ausgabe");
      if (firstAusgabe) setSelectedCategory(firstAusgabe.Name);
    });
    CalculateTotals();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex flex-row h-full w-full primary-background-color">

      {/* Navigation Bar Section */}
      <section className="w-1/4 flex flex-col h-full secondary-background-color shadow-2xl">

        {/* Banner Image */}
        <img src="/images/XRBT-Banner.png" alt="XRBT-Banner" className='w-full' />

        {/* Budget Folder List */}
        <section className="w-full h-full max-h-full overflow-y-auto flex flex-col p-5 gap-3">
          {data.map((budget) => (
            <div
              key={budget.budget_id}
              className="flex flex-row items-center justify-between p-3 rounded-xl relative gap-5 cursor-pointer primary-background-color"
              onClick={() => handleClickBudgetPlan(budget.budget_id, budget.titel)}
            >
              <h1 className="text-2xl text-white font-semibold">{budget.titel}</h1>
              <div className='flex flex-row gap-2'>
                <div className={`${parseFloat(budget.total_umsatz) < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  } font-semibold p-2 w-[100px] text-center rounded-md`}>
                  {budget.total_umsatz} CHF
                </div>
                <button
                  className="bg-white text-md aspect-square w-[40px] rounded-xl cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteBudgetById(budget.budget_id);
                  }}
                >
                  <i className="fa-solid fa-trash text-lg primary-background-textcolor"></i>
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Create Tool */}
        <section className="w-full h-[100px] p-5 flex flex-row gap-5 items-center justify-center">
          <button
            className="px-5 h-fit w-full py-2 rounded-md cursor-pointer text-white text-xl font-semibold primary-background-color"
            onClick={() => setDisplayNewBudgetPopUp(true)}
          >
            Neues Budget erstellen
          </button>
        </section>

        <CreateNewBudgetPopUp
          displayNewBudgetPopUp={displayNewBudgetPopUp}
          setDisplayNewBudgetPopUp={setDisplayNewBudgetPopUp}
        />
      </section>

      {/* Dashboard Section */}
      <aside className='flex flex-col gap-5 w-3/4 p-10 overflow-y-auto'>
        {/* Totals */}
        <DashboardTotals
          totalIncomes={totalIncomes}
          totalOutgoings={totalOutgoings}
          total={total}
        />

        {/* Balkendiagramm Statistik */}
        <section className='w-full'>
          <div className='w-full h-[400px] secondary-background-color rounded-md flex flex-col gap-2 p-3'>
            <div className='flex flex-row gap-2'>
              <i className="fa-solid fa-code-compare text-3xl primary-background-textcolor"></i>
              <h1 className='text-3xl font-semibold primary-background-textcolor'>Budget Vergleiche</h1>
            </div>
            <div className='h-full'>
              <ResponsiveContainer width="100%" height="100%" className="bg-white rounded-md">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jahr" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} CHF`} />
                  <Legend />
                  <Line type="monotone" dataKey="total_einnahmen" stroke="#22c55e" name="Einnahmen" />
                  <Line type="monotone" dataKey="total_ausgaben" stroke="#ef4444" name="Ausgaben" />
                  <Line type="monotone" dataKey="total_umsatz" stroke="#3b82f6" name="Umsatz" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Amazing Tools */}
        <section className='flex gap-5'>

          {/* Kategorische Ausgaben (Table) */}
          <div className='w-full h-[300px] secondary-background-color rounded-md p-3 flex flex-col gap-2'>
            <div className='flex flex-row gap-2 items-center'>
              <i className="fa-solid fa-filter text-3xl primary-background-textcolor"></i>
              <h1 className='text-3xl primary-background-textcolor font-semibold'>Kategorische Ausgaben</h1>
            </div>
            <div className="w-full h-fit overflow-x-auto">
              <table className="min-w-full h-full divide-y divide-gray-200 bg-white rounded-md overflow-hidden text-sm">
                <thead className="primary-background-color text-white uppercase text-xs">
                  <tr>
                    <th className="px-5 py-2 text-left">Titel / Kategorie</th>
                    <th className="px-5 py-2 text-left">Betrag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {groupedData.map((entry, index) => (
                    <tr
                      key={index}
                      className={entry.Typ === "ausgabe" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}
                    >
                      <td className="px-6 py-4 font-medium">{entry.Name}</td>
                      <td className="px-6 py-4">{entry.Betrag.toFixed(2)} CHF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kategorische Ausgaben (Suche)(BudgetTable) */}
          <div className='w-full h-[300px] secondary-background-color rounded-md p-3 flex flex-col gap-2'>
            {/* Suche */}
            <div className='flex flex-row justify-between'>
              <div className='flex flex-row gap-2 items-center'>
                <i className="fa-solid fa-magnifying-glass primary-background-textcolor text-3xl"></i>
                <h1 className='primary-background-textcolor text-3xl font-semibold'>Ausgaben Suche</h1>
              </div>
              <select
                className="p-2 rounded-md bg-white"
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory ?? ""}
              >
                {availableCategories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Totalanzeige */}
            <div className='flex flex-row justify-between items-center bg-red-50 text-red-600 p-2 rounded-md'>
              <h1 className='text-lg font-semibold'>Total</h1>
              <h1 className='text-lg font-semibold'>
                {selectedCategory && totalByCategory[selectedCategory]
                  ? `${totalByCategory[selectedCategory].toFixed(2)} CHF`
                  : "-"}
              </h1>
            </div>

            {/* Ausgabe pro Budget (gefiltert) */}
            <div className="w-full h-fit overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 bg-white rounded-md overflow-hidden text-sm">
                <thead className="primary-background-color text-white uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Budget</th>
                    <th className="px-6 py-3 text-left">Betrag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTableRows}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </aside>


    </main>
  );
}

export default OverallView;