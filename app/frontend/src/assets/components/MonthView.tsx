import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Booking } from '../types/booking';
import CreateNewBookingPopUp from '../widgets/CreateNewBookingPopUp';

function MonthView() {
    const location = useLocation();
    const { month_id } = location.state || {};
    const backendUrl = "http://localhost:8000";
    const navigate = useNavigate();

    const [incomings, setIncomings] = useState<Booking[]>([]);
    const [outgoings, setOutgoings] = useState<Booking[]>([]);
    const [booking, setBooking] = useState<Booking>({
        buchung_id: "",
        titel: "",
        datum: "",
        betrag: "",
        typ: "",
        monat_id: month_id,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [displayNewBookingPopUp, setDisplayNewBookingPopUp] = useState<boolean>(false);

    const goBack = () => {
        navigate(-1);
    };

    const fetchAllIncommings = () => {
        fetch(`${backendUrl}/booking/${month_id}/einnahme`)
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data: Booking[]) => {
                setIncomings(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    const fetchAllOutcommings = () => {
        fetch(`${backendUrl}/booking/${month_id}/ausgabe`)
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then((data: Booking[]) => {
                setOutgoings(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    const fetchAllBookings = () => {
        fetchAllIncommings();
        fetchAllOutcommings();
    }

    useEffect(() => {
        if (!month_id) {
            navigate("/");
        } else {
            fetchAllBookings();
        }
    }, [month_id]);

    return (
        <main className="flex flex-row h-full w-full bg-sky-300">
            {/* Dashboard */}
            <section className="w-2/3 flex justify-center items-center px-20 py-5 gap-5">
                {/* Einnahmen */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white">
                            Einnahmen
                            <p className="mt-1 text-sm font-normal text-gray-500">
                                Diese Liste beinhalten alle Einnahmen diesen Monats
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
                            {incomings.map((item, index) => (
                                <tr key={index} className="bg-green-50">
                                    <td className="px-6 py-4">{item.datum}</td>
                                    <td className="px-6 py-4">{item.titel}</td>
                                    <td className="px-6 py-4">{item.betrag}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => {
                                                setBooking(item);
                                                setDisplayNewBookingPopUp(true);
                                            }}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Ausgaben */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white">
                            Ausgaben
                            <p className="mt-1 text-sm font-normal text-gray-500">
                                Diese Liste beinhalten alle Ausgaben diesen Monats
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
                            {outgoings.map((item, index) => (
                                <tr key={index} className="bg-red-50">
                                    <td className="px-6 py-4">{item.datum}</td>
                                    <td className="px-6 py-4">{item.titel}</td>
                                    <td className="px-6 py-4">{item.betrag}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => {
                                                setBooking(item);
                                                setDisplayNewBookingPopUp(true);
                                            }}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Monate Navigation oder Detailanzeige */}
            <section className="w-1/3 flex flex-col gap-10 items-center justify-between h-full rounded-l-2xl overflow-auto bg-white p-5">
                {/* Platz für weitere Inhalte */}
                <h1 className='text-4xl font-bold'>Statisik des Monats</h1>
                <button
                    className="shadow-xl px-5 h-fit w-3/5 py-2 bg-sky-300 rounded-md cursor-pointer text-white font-semibold"
                    onClick={() => setDisplayNewBookingPopUp(true)}
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

            <CreateNewBookingPopUp
                displayNewBookingPopUp={displayNewBookingPopUp}
                setDisplayNewBookingPopUp={setDisplayNewBookingPopUp}
                month_id={month_id}
                setBooking={setBooking}
                booking={booking}
                reload={fetchAllBookings}
            />
        </main>
    );
}

export default MonthView;