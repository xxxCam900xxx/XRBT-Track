import { useEffect, useState } from 'react';
import { Budget } from '../types/budget';
import CreateNewBudgetPopUp from '../widgets/CreateNewBudgetPopUp';
import { useNavigate } from 'react-router-dom';

function BudgetSelectionView() {
  const [data, setData] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayNewBudgetPopUp, setDisplayNewBudgetPopUp] = useState<boolean>(false);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalOutgoings, setTotalOutgoings] = useState(0);
  const [total, setTotal] = useState(0);
  const backendUrl = "http://localhost:8000";
  const navigate = useNavigate();

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
    CalculateTotals();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex flex-row h-full w-full bg-sky-300">
      {/* Dashboard Section */}
      <section
        className="w-2/3 flex flex-col justify-center items-center p-5 gap-5"
      >
        <h1 className='text-white text-4xl'>Statistic Coming Soon...</h1>
        <div className='flex gap-5'>
          <div className='shadow-xl flex flex-col items-center bg-green-100 rounded-md py-2 px-5'>
            <h2>Totale Einnahen</h2>
            <p>{totalIncomes}</p>
          </div>
          <div className='shadow-xl flex flex-col items-center bg-red-100 rounded-md py-2 px-5'>
            <h2>Totale Ausgaben</h2>
            <p>{totalOutgoings}</p>
          </div>
          <div className='shadow-xl flex flex-col items-center bg-white rounded-md py-2 px-5'>
            <h2>Totaler Umsatz</h2>
            <p>{total}</p>
          </div>
        </div>
      </section>
      {/* Folder Selection Section */}
      <section
        className="w-1/3 flex flex-col h-full rounded-l-2xl overflow-hidden bg-white"
      >
        {/* Budget Folder List */}
        <section className="w-full h-full max-h-full overflow-y-auto flex flex-col p-5 gap-5">
          {data.map((budget) => (
            <div
              key={budget.budget_id}
              className="border-gray-200 border flex flex-row items-center justify-between p-5 rounded-xl relative gap-5 cursor-pointer shadow-lg"
              onClick={() => handleClickBudgetPlan(budget.budget_id, budget.titel)}
            >
              <div className="flex flex-col w-full gap-2">
                <h1 className="text-2xl font-semibold">{budget.titel}</h1>
                <div className="flex flex-col justify-center w-full items-center rounded-lg overflow-hidden">
                  <div className="flex flex-row justify-around w-full">
                    <p className="border-b border-gray-300 w-full text-center p-1 bg-green-300">{budget.total_einnahmen}</p>
                    <p className="border-b border-gray-300 w-full text-center p-1 bg-red-300">{budget.total_ausgaben}</p>
                    <p className="border-b border-gray-300 w-full text-center p-1 bg-gray-100">= {budget.total_umsatz}</p>
                  </div>
                </div>
              </div>
              <div className="flex h-full items-start">
                <button
                  className="bg-sky-400 text-md aspect-square w-[40px] rounded-xl cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteBudgetById(budget.budget_id);
                  }}
                >
                  <i className="fa-solid fa-trash text-white"></i>
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Tools */}
        <section className="w-full h-[100px] p-5 flex flex-row gap-5 items-center justify-center">
          <button
            className="shadow-xl px-5 h-fit w-3/5 py-2 bg-sky-300 rounded-md cursor-pointer text-white font-semibold"
            onClick={() => setDisplayNewBudgetPopUp(true)}
          >
            Create
          </button>
          <a href='/credits' className="shadow-xl px-5 py-2 h-fit bg-sky-300 rounded-md cursor-pointer text-white font-semibold">Credits</a>
        </section>

        <CreateNewBudgetPopUp
          displayNewBudgetPopUp={displayNewBudgetPopUp}
          setDisplayNewBudgetPopUp={setDisplayNewBudgetPopUp}
        />
      </section>
    </main>
  );
}

export default BudgetSelectionView;