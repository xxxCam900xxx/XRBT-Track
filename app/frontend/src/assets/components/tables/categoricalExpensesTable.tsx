import React from "react";

interface ExpenseEntry {
  Name: string;
  Betrag: number;
  Typ: string;
}

interface CategoricalExpensesTableProps {
  groupedData: ExpenseEntry[];
}

export const CategoricalExpensesTable: React.FC<CategoricalExpensesTableProps> = ({ groupedData }) => (
  <div className="w-full h-[300px] secondary-background-color rounded-md p-3 flex flex-col gap-2">
    <div className="flex flex-row gap-2 items-center">
      <i className="fa-solid fa-filter text-3xl primary-background-textcolor"></i>
      <h1 className="text-3xl primary-background-textcolor font-semibold">Kategorische Ausgaben</h1>
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
              className={
                entry.Typ === "ausgabe"
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600"
              }
            >
              <td className="px-6 py-4 font-medium">{entry.Name}</td>
              <td className="px-6 py-4">{entry.Betrag.toFixed(2)} CHF</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);