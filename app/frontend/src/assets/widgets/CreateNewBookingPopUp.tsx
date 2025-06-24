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
            className="fixed top-0 left-0 w-full h-full flex gap-2 items-center justify-center"
        >
            <div className="absolute top-0 left-0 w-full h-full primary-background-color opacity-50 z-[-1]" onClick={() => setDisplayNewBookingPopUp(false)} ></div>

            <div className="p-5 max-w-[500px] w-full rounded-xl secondary-background-color flex flex-col gap-2">
                {/* Titel */}
                <div className="flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                        <i className="fa-solid fa-signature text-3xl primary-background-textcolor"></i>
                        <h1 className="text-3xl primary-background-textcolor font-semibold">Neue Buchung</h1>
                    </div>
                    {/* Close Button */}
                    <button
                        className="aspect-square cursor-pointer"
                        onClick={() => setDisplayNewBookingPopUp(false)}><i className="fa-solid fa-xmark text-4xl primary-background-textcolor"></i>
                    </button>
                </div>
                {/* Form */}
                <form
                    onSubmit={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        createNewBooking();
                    }}
                    className='flex flex-col gap-2 items-center'
                >
                    <div className="formgroup flex flex-col w-full">
                        <label htmlFor="date" className="text-xl primary-background-textcolor">Datum</label>
                        <input
                            type="date"
                            name='date'
                            id='date'
                            className='rounded-md p-3 bg-white seconard-background-text-color'
                            value={formData.datum || booking.datum}
                            onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div className="formgroup flex flex-col w-full">
                        <label htmlFor="typ" className="text-xl primary-background-textcolor">Typ</label>
                        <select
                            name="typ"
                            id="typ"
                            className='rounded-md p-3 bg-white seconard-background-text-color'
                            value={formData.typ || booking.typ}
                            onChange={(e) => setFormData({ ...formData, typ: e.target.value })}
                        >
                            <option value="" disabled>Bitte wähle einen Typ</option>
                            <option value="einnahme">Einnahme</option>
                            <option value="ausgabe">Ausgabe</option>
                        </select>
                    </div>
                    <div className="formgroup flex flex-col w-full">
                        <label htmlFor="title" className="text-xl primary-background-textcolor">Titel / Kategorie</label>
                        <input
                            type="text"
                            name='title'
                            id='title'
                            placeholder="Bitte geben Sie einen Titel / Katgegorie ein"
                            className='rounded-md p-3 bg-white seconard-background-text-color'
                            value={formData.titel || booking.titel}
                            onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
                        />
                    </div>
                    <div className="formgroup flex flex-col w-full">
                        <label htmlFor="amount" className="text-xl primary-background-textcolor">Betrag</label>
                        <input
                            type="number"
                            name='amount'
                            id='amount'
                            placeholder="Bitte geben Sie einen Betrag ein"
                            className='rounded-md p-3 bg-white seconard-background-text-color'
                            value={formData.betrag || booking.betrag}
                            onChange={(e) => setFormData({ ...formData, betrag: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-white text-xl p-3 w-full rounded-lg cursor-pointer primary-background-color"
                    >
                        Hinzufügen</button>
                </form>
            </div>

            <div className="p-5 max-w-[500px] w-full rounded-xl secondary-background-color flex flex-col gap-5">
                {/* Titel */}
                <div className="flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                        <i className="fa-solid fa-copy text-3xl primary-background-textcolor"></i>
                        <h1 className="text-3xl primary-background-textcolor font-semibold">Durchgeführte Buchungen</h1>
                    </div>
                </div>
                {/* Searching Booking Feature */}
                <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Suche nach durchgeführte Buchungen" className="p-3 text-md rounded bg-white" />
                    <section className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between bg-white p-3 rounded-md">
                            <h1 className="">Titel Kategorie</h1>
                            <button className="cursor-pointer">
                                <i className="fa-solid fa-copy"></i>
                            </button>
                        </div>
                        <div className="flex flex-row justify-between bg-white p-3 rounded-md">
                            <h1 className="">Titel Kategorie</h1>
                            <button className="cursor-pointer">
                                <i className="fa-solid fa-copy"></i>
                            </button>
                        </div>
                        <div className="flex flex-row justify-between bg-white p-3 rounded-md">
                            <h1 className="">Titel Kategorie</h1>
                            <button className="cursor-pointer">
                                <i className="fa-solid fa-copy"></i>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )

}

export default CreateNewBookingPopUp;