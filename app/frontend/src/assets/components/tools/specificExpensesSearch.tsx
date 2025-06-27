import React from "react";
import { Booking } from "../../types/booking";

interface SpecificExpensesSearchProps {
    selectedTitle: string;
    setSelectedTitle: Function;
    uniqueOutgoingTitles: string[];
    filteredOutgoings: Booking[];
    filteredTotal: number;
}

export const SpecificExpensesSearch: React.FC<SpecificExpensesSearchProps> = ({
    selectedTitle,
    setSelectedTitle,
    uniqueOutgoingTitles,
    filteredOutgoings,
    filteredTotal,
}) => {
    return (
        <div className="w-full p-3 rounded-md flex flex-col primary-background-color gap-2">
            <div className="justify-between items-center flex">
                <h2 className="text-2xl text-white font-semibold">Kategorische Suche</h2>
                {/* On Typing Searching for Betrag nach .titel  */}
                <select
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                    className="p-2 bg-white rounded border border-gray-300 "
                >
                    <option value="">Titel auswählen</option>
                    {uniqueOutgoingTitles.map((title, index) => (
                        <option key={index} value={title}>
                            {title}
                        </option>
                    ))}
                </select>
            </div>
            {selectedTitle && (
                <div className="flex justify-between items-center p-2 rounded-md bg-white">
                    {filteredOutgoings.length > 0 ? (
                        <>
                            <h2 className="text-2xl primary-background-textcolor font-semibold">{selectedTitle}</h2>
                            <p className={`text-xl font-semibold p-2 rounded bg-red-100 text-red-600`}>
                                {filteredTotal.toFixed(2)} CHF
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-500">Keine Ausgaben gefunden.</p>
                    )}
                </div>
            )}
        </div>
    )
}