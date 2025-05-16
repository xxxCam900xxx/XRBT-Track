import React, { useEffect, useState } from 'react';
import { Budget } from '../types/budget';

function BudgetSelectionView() {
  const [data, setData] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = "http://localhost:8000"

  const fetchBudgets = () => {
    fetch(`${backendUrl}/budget/`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data: Budget[]) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* Budget Folder List */}
      <section className="w-full h-full max-h-full overflow-y-auto flex flex-col p-5 gap-5">
        {data.map((budget) => (
          <div
            key={budget.budget_id}
            className="border-gray-200 border flex flex-row items-center justify-between p-5 rounded-xl relative gap-5 cursor-pointer shadow-lg"
          >
            <div className="flex flex-col w-full gap-2">
              <h1 className="text-2xl font-semibold">{budget.titel}</h1>
              <div className="flex flex-col justify-center w-full items-center rounded-lg overflow-hidden">
                <div className="flex flex-row justify-around w-full">
                  <p className="border-b border-gray-300 w-full text-center p-1 bg-green-300">Einnahmen: {budget.total_einnahmen}</p>
                  <p className="border-b border-gray-300 w-full text-center p-1 bg-red-300">Ausgaben: {budget.total_ausgaben}</p>
                </div>
                <h1 className="w-full text-center p-1 bg-gray-100">Umsatz: {budget.total_umsatz}</h1>
              </div>
            </div>
            <div className="flex h-full items-start">
              <button
                className="bg-sky-400 text-md aspect-square w-[40px] rounded-xl cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
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
        <button className="shadow-xl px-5 h-fit w-3/5 py-2 bg-sky-300 rounded-md cursor-pointer text-white font-semibold">Create</button>
        <button className="shadow-xl px-5 py-2 h-fit bg-sky-300 rounded-md cursor-pointer text-white font-semibold">Credits</button>
      </section>
    </>
  );
}

export default BudgetSelectionView;