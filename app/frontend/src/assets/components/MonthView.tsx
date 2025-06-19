import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Booking } from '../types/booking';
import CreateNewBookingPopUp from '../widgets/CreateNewBookingPopUp';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

function MonthView() {
    const location = useLocation();
    const { month_id } = location.state || {};
    const backendUrl = "http://localhost:8000";
    const navigate = useNavigate();
    const [selectedTitle, setSelectedTitle] = useState('');

    const [incomings, setIncomings] = useState<Booking[]>([]);
    const [outgoings, setOutgoings] = useState<Booking[]>([]);
    const [totalIncomes, setTotalIncomes] = useState<number>(0);
    const [totalOutgoings, setTotalOutgoings] = useState<number>(0);
    const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displayNewBookingPopUp, setDisplayNewBookingPopUp] = useState<boolean>(false);

    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const fetchBookings = useCallback(async (type: 'einnahme' | 'ausgabe') => {
        try {
            const response = await fetch(`${backendUrl}/booking/${month_id}/${type}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: Booking[] = await response.json();
            return data;
        } catch (err: any) {
            console.error(`Error fetching ${type}s:`, err);
            setError(err.message);
            return [];
        }
    }, [backendUrl, month_id]);

    const fetchAndCalculateTotals = useCallback(async () => {
        if (!month_id) {
            console.warn("month_id is not available, cannot fetch bookings.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const fetchedIncomings = await fetchBookings('einnahme');
            const fetchedOutgoings = await fetchBookings('ausgabe');

            setIncomings(fetchedIncomings);
            setOutgoings(fetchedOutgoings);

            const calculatedTotalIncomes = fetchedIncomings.reduce((sum, item) => sum + parseFloat(item.betrag || '0'), 0);
            const calculatedTotalOutgoings = fetchedOutgoings.reduce((sum, item) => sum + parseFloat(item.betrag || '0'), 0);

            setTotalIncomes(calculatedTotalIncomes);
            setTotalOutgoings(calculatedTotalOutgoings);

            const response = await fetch(`${backendUrl}/month/info/${month_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total_einnahmen: calculatedTotalIncomes,
                    total_ausgaben: calculatedTotalOutgoings,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log("Monatsstatistik erfolgreich aktualisiert.");
        } catch (err: any) {
            console.error("Fehler beim Aktualisieren der Monatsstatistik:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [month_id, fetchBookings, backendUrl]);

    useEffect(() => {
        if (!month_id) {
            navigate("/");
            return;
        }
        fetchAndCalculateTotals();
    }, [month_id, navigate, fetchAndCalculateTotals]);

    const handleAddBookingClick = () => {
        setCurrentBooking({
            buchung_id: "",
            titel: "",
            datum: "",
            betrag: "",
            typ: "",
            monat_id: month_id,
        });
        setDisplayNewBookingPopUp(true);
    };

    const handleEditBookingClick = (bookingToEdit: Booking) => {
        setCurrentBooking(bookingToEdit);
        setDisplayNewBookingPopUp(true);
    };

    const handleBookingCreatedOrUpdated = () => {
        setDisplayNewBookingPopUp(false);
        fetchAndCalculateTotals();
    };

    const handleClosePopUp = () => {
        setDisplayNewBookingPopUp(false);
        setCurrentBooking(null);
    };

    const chartData = [...incomings, ...outgoings]
        .map(b => ({
            datum: new Date(b.datum).toLocaleDateString("de-DE"),
            betrag: parseFloat(b.betrag),
            typ: b.typ,
        }))
        .reduce((acc, curr) => {
            const entry = acc.find(e => e.datum === curr.datum);
            const betrag = Math.abs(curr.betrag); // Immer positiv
            if (!entry) {
                acc.push({
                    datum: curr.datum,
                    einnahmen: curr.typ === 'einnahme' ? betrag : 0,
                    ausgaben: curr.typ === 'ausgabe' ? betrag : 0,
                });
            } else {
                if (curr.typ === 'einnahme') entry.einnahmen += betrag;
                if (curr.typ === 'ausgabe') entry.ausgaben += betrag;
            }
            return acc;
        }, [] as { datum: string; einnahmen: number; ausgaben: number }[]);

    // Gruppierte Ausgaben nach Titel
    const pieChartData = outgoings.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.titel);
        const betrag = Math.abs(parseFloat(curr.betrag)); // Betrag immer positiv
        if (!isNaN(betrag)) {
            if (existing) {
                existing.value += betrag;
            } else {
                acc.push({ name: curr.titel, value: betrag });
            }
        }

        return acc;
    }, [] as { name: string; value: number }[]);

    const uniqueOutgoingTitles = [...new Set(outgoings.map(o => o.titel))];

    const filteredOutgoings = outgoings.filter((item) =>
        selectedTitle ? item.titel === selectedTitle : false
    );

    const filteredTotal = filteredOutgoings.reduce(
        (sum, item) => sum + parseFloat(item.betrag || '0'),
        0
    );

    function stringToRandomPastelColor(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i) * (i + 1);
            hash |= 0; // Force 32bit integer
        }
        const h = Math.abs(hash) % 360;

        // Zufällige leichte Variation von Sättigung und Helligkeit
        const s = 50 + (Math.abs(hash * 7) % 20); // 50–69%
        const l = 75 + (Math.abs(hash * 13) % 15); // 75–89%

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-lg text-red-600">Error: {error}</div>;
    }
    const COLORS = ['#ff6961', '#f39c12', '#3498db', '#2ecc71', '#9b59b6'];

    return (
        <main className="flex flex-row h-full w-full bg-sky-300">
            {/* Dashboard */}
            <section className="w-2/3 flex flex-col justify-center items-center px-20 py-5 gap-5">
                {/* Einnahmen */}
                <div className='flex gap-5 w-full'>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full h-fit">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white">
                                Einnahmen
                                <p className="mt-1 text-sm font-normal text-gray-500">
                                    Diese Liste beinhaltet alle Einnahmen diesen Monats
                                </p>
                            </caption>
                            <thead className="text-xs text-gray-700 uppercase bg-green-100">
                                <tr>
                                    <th className="px-6 py-3">Datum</th>
                                    <th className="px-6 py-3">Titel</th>
                                    <th className="px-6 py-3">Betrag</th>
                                    <th className="px-6 py-3"><span className="sr-only">Edit</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomings.length > 0 ? (
                                    incomings.map((item, index) => {
                                        const itemDate = new Date(item.datum);
                                        const formattedDate = itemDate.toLocaleDateString("de-DE");

                                        return (
                                            <tr key={item.buchung_id || index} className="bg-green-50">
                                                <td className="px-6 py-4">{formattedDate}</td>
                                                <td className="px-6 py-4">{item.titel}</td>
                                                <td className="px-6 py-4">{parseFloat(item.betrag).toFixed(2)} CHF</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleEditBookingClick(item)}
                                                        className="font-medium text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500 bg-green-50">
                                            Keine Einnahmen vorhanden.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Ausgaben */}
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full h-fit">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white">
                                Ausgaben
                                <p className="mt-1 text-sm font-normal text-gray-500">
                                    Diese Liste beinhaltet alle Ausgaben diesen Monats
                                </p>
                            </caption>
                            <thead className="text-xs text-gray-700 uppercase bg-red-100">
                                <tr>
                                    <th className="px-6 py-3">Datum</th>
                                    <th className="px-6 py-3">Titel</th>
                                    <th className="px-6 py-3">Betrag</th>
                                    <th className="px-6 py-3"><span className="sr-only">Edit</span></th>
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
                                                <td className="px-6 py-4">{parseFloat(item.betrag).toFixed(2)} CHF</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleEditBookingClick(item)}
                                                        className="font-medium text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500 bg-red-50">
                                            Keine Ausgaben vorhanden.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='flex gap-5 w-full'>
                    <div className='flex gap-2 w-full shadow-md sm:rounded-lg bg-green-100 p-5'>
                        <p className="mt-1 text-xl font-bold text-gray-700">
                            Total Einnahmen: {totalIncomes.toFixed(2)} CHF
                        </p>
                    </div>
                    <div className='flex gap-2 w-full shadow-md sm:rounded-lg bg-red-100 p-5'>
                        <p className="mt-1 text-xl font-bold text-gray-700">
                            Total Ausgaben: {totalOutgoings.toFixed(2)} CHF
                        </p>
                    </div>
                </div>

            </section>

            {/* Monate Navigation oder Detailanzeige */}
            <section className="w-1/3 flex flex-col justify-between gap-10 items-center h-full rounded-l-2xl overflow-auto bg-white p-5">
                {/* Platz für weitere Inhalte */}
                <div className='flex flex-col gap-5 w-full'>
                    <h1 className='text-4xl font-bold border-b border-gray-300 pb-2'>Statistik des Monats</h1>
                    {/* Umsatz anzeige */}
                    <div className='border border-gray-200 w-full rounded-md p-5 flex justify-between items-center'>
                        <h2 className='text-2xl'>Umsatz:</h2>
                        <p
                            className={`text-xl font-bold p-2 rounded ${totalIncomes + totalOutgoings >= 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                }`}
                        >
                            {(totalIncomes + totalOutgoings).toFixed(2)}
                        </p>

                    </div>
                    {/* Spezifische Suche Ausgaben */}
                    <div className='border border-gray-200 w-full p-5 rounded-md flex flex-col'>
                        <div className='justify-between items-center flex'>
                            <h2 className='text-2xl'>Kategorische Suche:</h2>
                            {/* On Typing Searching for Betrag nach .titel  */}
                            <select
                                value={selectedTitle}
                                onChange={(e) => setSelectedTitle(e.target.value)}
                                className="p-2 rounded border border-gray-300 "
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
                            <div className="flex justify-between items-center mt-5 pt-5 border-t border-gray-200">
                                {filteredOutgoings.length > 0 ? (
                                    <>
                                        <h2 className='text-2xl'>{selectedTitle}: </h2>
                                        <p className={`text-xl font-bold p-2 rounded bg-red-200`}>
                                            {filteredTotal.toFixed(2)} CHF
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-500">Keine Ausgaben gefunden.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Visuelle Statistik Verlauf im Monat */}
                    <div className="w-full h-[250px] p-5 border border-gray-200 rounded flex flex-col">
                        <h2 className="text-2xl mb-5">Monatsverlauf:</h2>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="datum" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="einnahmen" stroke="#82ca9d" name="Einnahmen" />
                                <Line type="monotone" dataKey="ausgaben" stroke="#ff6961" name="Ausgaben" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Visuelle Statistik prozentualer Kuchen */}
                    <div className="w-full h-[250px] p-5 border border-gray-200 rounded flex flex-col">
                        <h2 className="text-2xl mb-5">Ausgaben Prozentual:</h2>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={stringToRandomPastelColor(entry.name)} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>



                </div>
                <button
                    className="shadow-xl px-5 h-fit w-3/5 py-2 bg-sky-300 rounded-md  cursor-pointer text-white font-semibold"
                    onClick={handleAddBookingClick}
                >
                    Neue Buchung hinzufügen
                </button>
            </section>

            {/* Zurück-Button */}
            <button
                className='fixed top-5 left-5 bg-white text-md aspect-square w-[40px] rounded-xl cursor-pointer flex items-center justify-center'
                onClick={goBack}
            >
                <i className="fa-solid fa-xmark text-sky-400 text-2xl"></i>
            </button>

            {displayNewBookingPopUp && (
                <CreateNewBookingPopUp
                    displayNewBookingPopUp={displayNewBookingPopUp}
                    setDisplayNewBookingPopUp={handleClosePopUp}
                    month_id={month_id}
                    setBooking={setCurrentBooking}
                    booking={currentBooking as Booking}
                    reload={handleBookingCreatedOrUpdated}
                />
            )}
        </main>
    );
}

export default MonthView;