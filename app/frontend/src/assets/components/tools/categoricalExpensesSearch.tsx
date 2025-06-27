import React from "react";
import { BudgetStats } from "../../types/overview";

interface ExpensesSearchTableProps {
  availableCategories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string) => void;
  totalByCategory: Record<string, number>;
  rawStats: BudgetStats[];
}

const ExpensesSearchTable: React.FC<ExpensesSearchTableProps> = ({
  availableCategories,
  selectedCategory,
  onCategoryChange,
  totalByCategory,
  rawStats,
}) => {

  // Filter Logik für Tabelle
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

  return (
    <div className='w-full h-[300px] secondary-background-color rounded-md p-3 flex flex-col gap-2'>
      {/* Suche */}
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-2 items-center'>
          <i className="fa-solid fa-magnifying-glass primary-background-textcolor text-3xl"></i>
          <h1 className='primary-background-textcolor text-3xl font-semibold'>Ausgaben Suche</h1>
        </div>
        <select
          className="p-2 rounded-md bg-white"
          onChange={(e) => onCategoryChange(e.target.value)}
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
  );
};

export default ExpensesSearchTable;