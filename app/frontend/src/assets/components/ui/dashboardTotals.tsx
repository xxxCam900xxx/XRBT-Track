import React, { useState } from "react";

interface DashboardTotalsProps {
    totalIncomes: number;
    totalOutgoings: number;
    total: number;
}

const DashboardTotals: React.FC<DashboardTotalsProps> = ({
    totalIncomes,
    totalOutgoings,
    total
}) => {
    const [selected, setSelected] = useState("einnahmen");

    return (
        <>
            {/* Desktop Ansicht */}
            <section className="hidden lg:flex flex-col gap-5 lg:flex-row w-full">
                {/* Einnahmen */}
                <div className="flex flex-col gap-2 p-3 secondary-background-color w-full h-fit rounded-md">
                    <div className="flex flex-row gap-2 w-full items-center">
                        <i className="fa-solid fa-piggy-bank text-3xl primary-background-textcolor"></i>
                        <h1 className="text-3xl font-semibold primary-background-textcolor">Einnahmen</h1>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 text-center text-3xl font-semibold p-3 rounded-md">
                        +{totalIncomes} CHF
                    </div>
                </div>

                {/* Ausgaben */}
                <div className="flex flex-col gap-2 p-3 secondary-background-color w-full h-fit rounded-md">
                    <div className="flex flex-row gap-2 w-full items-center">
                        <i className="fa-solid fa-cart-shopping text-3xl primary-background-textcolor"></i>
                        <h1 className="text-3xl font-semibold primary-background-textcolor">Ausgaben</h1>
                    </div>
                    <div className="bg-red-50 text-red-600 text-center text-3xl font-semibold p-3 rounded-md">
                        {totalOutgoings} CHF
                    </div>
                </div>

                {/* Saldo */}
                <div className="flex flex-col gap-2 p-3 secondary-background-color w-full h-fit rounded-md">
                    <div className="flex flex-row gap-2 w-full items-center">
                        <i className="fa-solid fa-chart-simple text-3xl primary-background-textcolor"></i>
                        <h1 className="text-3xl font-semibold primary-background-textcolor">Saldo</h1>
                    </div>
                    <div
                        className={`${total < 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                            } text-center text-3xl font-semibold p-3 rounded-md`}
                    >
                        {total} CHF
                    </div>
                </div>
            </section>

            {/* Mobile Ansicht */}
            <section className="flex gap-2 w-full lg:hidden">

                <div className="flex flex-row gap-2 p-3 secondary-background-color w-full h-fit rounded-md">
                    <div className="flex flex-row gap-2 items-center">
                        {selected === "einnahmen" && (
                            <i className="fa-solid fa-piggy-bank text-4xl primary-background-textcolor"></i>
                        )}
                        {selected === "ausgaben" && (
                            <i className="fa-solid fa-cart-shopping text-4xl primary-background-textcolor"></i>
                        )}
                        {selected === "total" && (
                            <i className="fa-solid fa-chart-simple text-4xl primary-background-textcolor"></i>
                        )}
                    </div>

                    <div
                        className={`${selected === "ausgaben"
                                ? "bg-red-50 text-red-600"
                                : selected === "total" && total < 0
                                    ? "bg-red-50 text-red-600"
                                    : "bg-emerald-50 text-emerald-600"
                            } text-center text-3xl font-semibold w-full p-3 rounded-md`}
                    >
                        {selected === "einnahmen" && `+${totalIncomes} CHF`}
                        {selected === "ausgaben" && `${totalOutgoings} CHF`}
                        {selected === "total" && `${total} CHF`}
                    </div>
                    <select
                        className="p-2 rounded-md bg-white text-lg"
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        <option value="einnahmen">Einnahmen</option>
                        <option value="ausgaben">Ausgaben</option>
                        <option value="total">Umsatz</option>
                    </select>
                </div>
            </section>
        </>
    );
};

export default DashboardTotals;