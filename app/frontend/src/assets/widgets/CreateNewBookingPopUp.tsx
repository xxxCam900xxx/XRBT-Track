import { useEffect, useState } from "react";
import { Booking } from "../types/booking";
import { Template } from "../types/template";

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

    const templateExists = (titel: string, typ: string): boolean => {
        return templateData.some(template =>
            template.titel.trim().toLowerCase() === titel.trim().toLowerCase() &&
            template.typ.trim().toLowerCase() === typ.trim().toLowerCase()
        );
    };

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

                if (!templateExists(formData.titel, formData.typ)) {
                    await createTemplate(formData.titel, formData.typ, processedBetrag);
                }

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

    const createTemplate = async (title: string, typ: string, betrag: number) => {
        try {
            const response = await fetch(`${backendUrl}/template/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, typ, betrag })
            });
            if (!response.ok) {
                throw new Error("Fehler beim Erstellen des Templates");
            }
            const newTemplate = await response.json();
            console.log("Neues Template erstellt:", newTemplate);
            setTemplateData(prev => [...prev, newTemplate]);
        } catch (err) {
            console.error("Fehler beim Erstellen des Templates:", err);
        }
    };

    const [templateData, setTemplateData] = useState<Template[]>([]);
    const fetchTemplates = async (): Promise<Template[]> => {
        try {
            const response = await fetch(`${backendUrl}/template/`)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data: Template[] = await response.json();
            setTemplateData(data);
            return data;
        } catch (err: any) {
            return [];
        }
    };

    const handleDeleteTemplate = async (template_id: string) => {
        try {
            const response = await fetch(`${backendUrl}/template/${template_id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("Template erfolgreich gelöscht.");
            setTemplateData((prev) =>
                prev.filter((template) => template.template_id !== template_id)
            );
        } catch (error) {
            console.error("Fehler beim Löschen des Templates:", error);
        }
    };

    const handleTemplateCopy = (template: Template) => {
        setFormData((prev) => ({
            ...prev,
            titel: template.titel,
            typ: template.typ,
        }));
    };

    const [searchTerm, setSearchTerm] = useState("");
    const filteredTemplates = templateData.filter((template) => {
        const term = searchTerm.toLowerCase();
        return (
            template.titel.toLowerCase().includes(term) ||
            template.typ.toLowerCase().includes(term) ||
            template.betrag.toString().includes(term)
        );
    });

    useEffect(() => {
        setFormData({
            buchung_id: booking.buchung_id,
            titel: booking.titel,
            datum: booking.datum,
            typ: booking.typ,
            betrag: booking.betrag,
            monat_id: `${month_id}`,
        });
        fetchTemplates();
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
                    <input
                        type="text"
                        placeholder="Suche nach durchgeführte Buchungen"
                        className="p-3 text-md rounded bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <section className="flex flex-col gap-2">
                        <div className="w-full bg-white rounded-md overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-white primary-background-color uppercase">
                                    <tr>
                                        <th scope="col" className="px-5 py-2">Titel</th>
                                        <th scope="col" className="px-5 py-2">Typ</th>
                                        <th scope="col" className="px-5 py-2 text-right">Aktionen</th>
                                    </tr>
                                </thead>
                            </table>
                            <div className="max-h-[200px] overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <tbody>
                                        {filteredTemplates.map((template) => (
                                            <tr
                                                key={template.template_id}
                                                className={`border-b hover:bg-gray-50 ${template.typ === "ausgabe"
                                                    ? "bg-red-50 text-red-600"
                                                    : template.typ === "einnahme"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : ""
                                                    }`}
                                            >
                                                <td className="p-5 font-medium">{template.titel}</td>
                                                <td className="p-5 capitalize">{template.typ}</td>
                                                <td className="p-5 text-right flex gap-3 items-center justify-end">
                                                    <button
                                                        className="cursor-pointer"
                                                        onClick={() => handleTemplateCopy(template)}
                                                        title="Template kopieren"
                                                    >
                                                        <i className="fa-solid fa-copy"></i>
                                                    </button>
                                                    <button
                                                        className="cursor-pointer"
                                                        onClick={() => handleDeleteTemplate(template.template_id)}
                                                        title="Template löschen"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )

}

export default CreateNewBookingPopUp;