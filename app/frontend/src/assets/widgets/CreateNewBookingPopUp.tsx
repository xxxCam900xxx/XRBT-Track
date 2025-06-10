import { useEffect, useState } from "react";
import { Booking } from "../types/booking";

interface CreateNewBookingPopUpProps {
    displayNewBookingPopUp: boolean;
    setDisplayNewBookingPopUp: (value: boolean) => void;
    month_id: string;
    setBooking: (value: Booking) => void;
    booking: Booking;
    reload: () => void;
}

const CreateNewBookingPopUp: React.FC<CreateNewBookingPopUpProps> = ({
    displayNewBookingPopUp: displayNewBudgetPopUp,
    setDisplayNewBookingPopUp: setDisplayNewBookingPopUp,
    month_id: month_id,
    setBooking: setBooking,
    booking: booking,
    reload: reload,
}) => {
    const backendUrl = "http://localhost:8000"
    const [formData, setFormData] = useState({ buchung_id: booking.buchung_id, titel: booking.titel, datum: booking.datum, typ: booking.typ, betrag: booking.betrag, monat_id: `${month_id}` });

    const createNewBooking = async () => {
        try {

            let methodUsed = "POST";

            if (booking.buchung_id != "") {
                methodUsed = "PATCH";
            }

            let processedBetrag = parseFloat(formData.betrag);
            if (isNaN(processedBetrag)) {
                console.log(processedBetrag);
                console.error("Invalid amount entered.");
                return;
            }

            if (formData.typ === "ausgabe") {
                processedBetrag = -Math.abs(processedBetrag);
            }
            else if (formData.typ === "einnahme") {
                processedBetrag = Math.abs(processedBetrag);
            }

            const response = await fetch(`${backendUrl}/booking/`, {
                method: methodUsed,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ buchung_id: `${booking.buchung_id}`, titel: formData.titel, datum: formData.datum, typ: formData.typ, betrag: processedBetrag, monat_id: `${month_id}` })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Budget created:", data);
                setDisplayNewBookingPopUp(false);
                setBooking({
                    buchung_id: "",
                    titel: "",
                    datum: "",
                    betrag: "",
                    typ: "",
                    monat_id: month_id
                });
                reload();
            } else {
                console.error("Failed to create budget");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        setFormData({
            buchung_id: booking.buchung_id,
            titel: booking.titel,
            datum: booking.datum,
            typ: booking.typ,
            betrag: booking.betrag,
            monat_id: `${month_id}`,
        });
    }, [booking, month_id]);


    if (!displayNewBudgetPopUp) return null;

    return (
        <div role="popUp"
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
        >
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-75 z-[-1]" onClick={() => setDisplayNewBookingPopUp(false)} ></div>
            {/* Close Button */}
            <button
                className="absolute top-10 right-10 bg-red-300 aspect-square w-15 rounded-md text-white bg-sky-300 cursor-pointer"
                onClick={() => setDisplayNewBookingPopUp(false)}><i className="fa-solid fa-xmark text-4xl"></i>
            </button>
            {/* Create Booking Form */}
            <div className="bg-white p-5 max-w-[500px] w-full rounded-xl">
                <form
                    onSubmit={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        createNewBooking();
                    }}
                    className='flex flex-col gap-5 items-center'
                >
                    <h1 className='text-4xl font-bold  w-full'>Form</h1>
                    <div className="formgroup flex flex-col w-full">
                        <label htmlFor="date">Datum</label>
                        <input
                            type="date"
                            name='date'
                            id='date'
                            className='border rounded-md p-2'
                            value={formData.datum || booking.datum}
                            onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div className="formgroup flex flex-col w-full">
                        <label htmlFor="typ">Typ</label>
                        <select
                            name="typ"
                            id="typ"
                            className='border rounded-md p-2'
                            value={formData.typ || booking.typ}
                            onChange={(e) => setFormData({ ...formData, typ: e.target.value })}
                        >
                            <option value="" disabled></option>
                            <option value="einnahme">Einnahme</option>
                            <option value="ausgabe">Ausgabe</option>
                        </select>
                    </div>
                    <div className="formgroup flex flex-col w-full">
                        <label htmlFor="title">Titel</label>
                        <input
                            type="text"
                            name='title'
                            id='title'
                            className='border rounded-md p-2'
                            value={formData.titel || booking.titel}
                            onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
                        />
                    </div>
                    <div className="formgroup flex flex-col w-full">
                        <label htmlFor="amount">Betrag</label>
                        <input
                            type="number"
                            name='amount'
                            id='amount'
                            className='border rounded-md p-2'
                            value={formData.betrag || booking.betrag}
                            onChange={(e) => setFormData({ ...formData, betrag: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-sky-300 text-white text-xl p-2 rounded-lg cursor-pointer"
                    >
                        Hinzufügen
                    </button>
                </form>
            </div>
        </div>
    )

}

export default CreateNewBookingPopUp;