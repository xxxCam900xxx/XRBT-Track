import React, { useState } from "react";
import { Booking } from "../../types/booking";

interface BookingTableProps {
    incomings: Booking[];
    totalIncomes: number;
    outgoings: Booking[];
    totalOutgoings: number;
    handleEditBookingClick: (item) => void;
    handleDeleteBookingClick: (itemID) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
    incomings,
    totalIncomes,
    outgoings,
    totalOutgoings,
    handleEditBookingClick,
    handleDeleteBookingClick,
}) => {

    const [selected, setSelected] = useState("einnahmen");

    return (
        <>
            {/* Desktop Ansicht */}
            <section className='hidden gap-5 lg:flex'>
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
            </section>

            {/* Tables Section */}
            <section className='hidden gap-5 lg:flex'>

                {/* Einnahmen */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full h-fit p-3 secondary-background-color">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 rounded-md overflow-hidden">
                        <thead className="text-xs text-gray-700 uppercase bg-green-100">
                            <tr>
                                <th className="px-6 py-3">Datum</th>
                                <th className="px-6 py-3">Titel</th>
                                <th className="px-6 py-3">Betrag</th>
                                <th className="px-6 py-3">
                                    <span className="sr-only">Aktionen</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomings.length > 0 ? (
                                incomings.map((item, index) => {
                                    const itemDate = new Date(item.datum);
                                    const formattedDate = itemDate.toLocaleDateString("de-DE");

                                    return (
                                        <tr
                                            key={item.buchung_id || index}
                                            className="bg-green-50"
                                        >
                                            <td className="px-6 py-4">{formattedDate}</td>
                                            <td className="px-6 py-4">{item.titel}</td>
                                            <td className="px-6 py-4">
                                                {parseFloat(item.betrag).toFixed(2)} CHF
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex gap-5 justify-end">
                                                    <button
                                                        onClick={() => handleEditBookingClick(item)}
                                                        className="font-medium text-green-800 hover:underline cursor-pointer"
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBookingClick(item.buchung_id)}
                                                        className="font-medium text-green-800 hover:underline cursor-pointer"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 text-center text-gray-500 bg-green-50"
                                    >
                                        Keine Einnahmen vorhanden.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Ausgaben */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full h-fit p-3 secondary-background-color">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 rounded-md overflow-hidden">
                        <thead className="text-xs text-gray-700 uppercase bg-red-100">
                            <tr>
                                <th className="px-6 py-3">Datum</th>
                                <th className="px-6 py-3">Titel</th>
                                <th className="px-6 py-3">Betrag</th>
                                <th className="px-6 py-3">
                                    <span className="sr-only">Aktionen</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {outgoings.length > 0 ? (
                                outgoings.map((item, index) => {
                                    const itemDate = new Date(item.datum);
                                    const formattedDate = itemDate.toLocaleDateString("de-DE");

                                    return (
                                        <tr key={item.buchung_id || index} className="bg-red-50">
                                            <td className="px-6 py-4">{formattedDate}</td>
                                            <td className="px-6 py-4">{item.titel}</td>
                                            <td className="px-6 py-4">
                                                {parseFloat(item.betrag).toFixed(2)} CHF
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex gap-5 justify-end">
                                                    <button
                                                        onClick={() => handleEditBookingClick(item)}
                                                        className="font-medium text-red-800 hover:underline cursor-pointer"
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBookingClick(item.buchung_id)}
                                                        className="font-medium text-red-800 hover:underline cursor-pointer"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-4 text-center text-gray-500 bg-red-50"
                                    >
                                        Keine Ausgaben vorhanden.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
                    </div>

                    <div
                        className={`${selected === "ausgaben"
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-600"
                            } text-center text-3xl font-semibold w-full p-3 rounded-md`}
                    >
                        {selected === "einnahmen" && `+${totalIncomes} CHF`}
                        {selected === "ausgaben" && `${totalOutgoings} CHF`}
                    </div>
                    <select
                        className="p-2 rounded-md bg-white text-lg"
                        value={selected}
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        <option value="einnahmen">Einnahmen</option>
                        <option value="ausgaben">Ausgaben</option>
                    </select>
                </div>
            </section>

            {/* Tables Section */}
            <section className="flex gap-2 w-full lg:hidden">

                {selected === "einnahmen" && (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full h-fit p-3 secondary-background-color">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 rounded-md overflow-hidden">
                            <thead className="text-xs text-gray-700 uppercase bg-green-100">
                                <tr>
                                    <th className="px-6 py-3">Datum</th>
                                    <th className="px-6 py-3">Titel</th>
                                    <th className="px-6 py-3">Betrag</th>
                                    <th className="px-6 py-3">
                                        <span className="sr-only">Aktionen</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomings.length > 0 ? (
                                    incomings.map((item, index) => {
                                        const itemDate = new Date(item.datum);
                                        const formattedDate = itemDate.toLocaleDateString("de-DE");

                                        return (
                                            <tr
                                                key={item.buchung_id || index}
                                                className="bg-green-50"
                                            >
                                                <td className="px-6 py-4">{formattedDate}</td>
                                                <td className="px-6 py-4">{item.titel}</td>
                                                <td className="px-6 py-4">
                                                    {parseFloat(item.betrag).toFixed(2)} CHF
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex gap-5 justify-end">
                                                        <button
                                                            onClick={() => handleEditBookingClick(item)}
                                                            className="font-medium text-green-800 hover:underline cursor-pointer"
                                                        >
                                                            <i className="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBookingClick(item.buchung_id)}
                                                            className="font-medium text-green-800 hover:underline cursor-pointer"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-4 text-center text-gray-500 bg-green-50"
                                        >
                                            Keine Einnahmen vorhanden.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {selected === "ausgaben" && (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full h-fit p-3 secondary-background-color">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 rounded-md overflow-hidden">
                            <thead className="text-xs text-gray-700 uppercase bg-red-100">
                                <tr>
                                    <th className="px-6 py-3">Datum</th>
                                    <th className="px-6 py-3">Titel</th>
                                    <th className="px-6 py-3">Betrag</th>
                                    <th className="px-6 py-3">
                                        <span className="sr-only">Aktionen</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {outgoings.length > 0 ? (
                                    outgoings.map((item, index) => {
                                        const itemDate = new Date(item.datum);
                                        const formattedDate = itemDate.toLocaleDateString("de-DE");

                                        return (
                                            <tr key={item.buchung_id || index} className="bg-red-50">
                                                <td className="px-6 py-4">{formattedDate}</td>
                                                <td className="px-6 py-4">{item.titel}</td>
                                                <td className="px-6 py-4">
                                                    {parseFloat(item.betrag).toFixed(2)} CHF
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex gap-5 justify-end">
                                                        <button
                                                            onClick={() => handleEditBookingClick(item)}
                                                            className="font-medium text-red-800 hover:underline cursor-pointer"
                                                        >
                                                            <i className="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBookingClick(item.buchung_id)}
                                                            className="font-medium text-red-800 hover:underline cursor-pointer"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-4 text-center text-gray-500 bg-red-50"
                                        >
                                            Keine Ausgaben vorhanden.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </section >

        </>
    )
}