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
import { BudgetComparisonChart } from './charts/budgetComparisonChart';
import { CategoricalExpensesTable } from './tables/categoricalExpensesTable';
import ExpensesSearchTable from './tools/categoricalExpensesSearch';

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

  /* Menu */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

      {/* Overlay when Drawer is open */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 primary-background-color opacity-50 z-40 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Navigation Drawer */}
      <section
        className={`fixed top-0 left-0 h-full w-3/4 z-50 
          secondary-background-color shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:w-1/4
          `}
      >
        {/* Toggle Button am Drawer-Rand */}
        <button
          className="absolute top-4 -right-15 secondary-background-color text-white p-3 rounded-r-md shadow-md lg:hidden"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <i className="fa-solid fa-compass text-4xl primary-background-textcolor"></i>
        </button>

        {/* Banner */}
        <img src="/images/XRBT-Banner.png" alt="XRBT-Banner" className="w-full" />

        {/* Budget Folder List */}
        <section className="w-full h-full max-h-full overflow-y-auto flex flex-col p-5 gap-3">
          {data.map((budget) => (
            <div
              key={budget.budget_id}
              className="flex flex-row items-center justify-between p-3 rounded-xl relative gap-5 cursor-pointer primary-background-color"
              onClick={() => {
                handleClickBudgetPlan(budget.budget_id, budget.titel);
                setIsDrawerOpen(false);
              }}
            >
              <h1 className="text-2xl text-white font-semibold">{budget.titel}</h1>
              <div className="flex flex-row gap-2">
                <div
                  className={`${parseFloat(budget.total_umsatz) < 0
                    ? 'bg-red-50 text-red-600'
                    : 'bg-emerald-50 text-emerald-600'
                    } font-semibold p-2 w-[100px] text-center rounded-md`}
                >
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
      </section>

      {/* Dashboard Section */}
      <aside className='flex flex-col gap-5 w-full lg:w-3/4 px-5 py-25 lg:p-10 overflow-y-auto'>
        {/* Totals */}
        <DashboardTotals
          totalIncomes={totalIncomes}
          totalOutgoings={totalOutgoings}
          total={total}
        />

        {/* Liniendiagramm Statistik */}
        <BudgetComparisonChart
          data={data}
        />

        {/* Amazing Tools */}
        <section className='flex gap-5 flex-col lg:flex-row'>

          {/* Kategorische Ausgaben (Suche)(BudgetTable) */}
          <ExpensesSearchTable
            availableCategories={availableCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            totalByCategory={totalByCategory}
            rawStats={rawStats}
          />

          {/* Kategorische Ausgaben (Table) */}
          <CategoricalExpensesTable
            groupedData={groupedData}
          />

        </section>
      </aside>

      <CreateNewBudgetPopUp
        displayNewBudgetPopUp={displayNewBudgetPopUp}
        setDisplayNewBudgetPopUp={setDisplayNewBudgetPopUp}
      />

    </main>
  );
}

export default OverallView;