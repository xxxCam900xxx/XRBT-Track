import { useEffect, useState } from 'react';
import { Budget } from '../types/budget';
import CreateNewBudgetPopUp from '../widgets/CreateNewBudgetPopUp';
import { useNavigate } from 'react-router-dom';

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
      <aside className='flex flex-col gap-5 w-3/4 p-10'>
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
              <h1 className='text-3xl font-semibold primary-background-textcolor'>Einnahmen</h1>
            </div>
            <div
              className={`${total < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                } text-center text-3xl font-semibold p-3 rounded-md`}
            >
              {total} CHF
            </div>
          </div>
        </section>
        <section className='flex items-center w-full h-full text-white text-5xl justify-center'>
          Statistics still in Progress...
        </section>


      </aside>


    </main>
  );
}

export default OverallView;