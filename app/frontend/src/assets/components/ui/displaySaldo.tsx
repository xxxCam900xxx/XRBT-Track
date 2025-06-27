import React from "react";

interface DisplaySaldoProps {
    totalIncomes: number;
    totalOutgoings: number;
}

export const DisplaySaldo: React.FC<DisplaySaldoProps> = ({
    totalIncomes,
    totalOutgoings,
}) => {
    return (
        <div className="w-full rounded-md p-3 flex justify-between items-center primary-background-color">
            <h2 className="text-2xl text-white font-semibold">Umsatz</h2>
            <p
              className={`text-xl font-bold p-2 rounded ${totalIncomes + totalOutgoings >= 0
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-100 text-red-600"
                }`}
            >
              {(totalIncomes + totalOutgoings).toFixed(2)} CHF
            </p>
          </div>
    )
}