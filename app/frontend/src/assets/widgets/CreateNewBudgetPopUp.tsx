import { useState } from "react";

interface CreateNewBudgetPopUpProps {
    displayNewBudgetPopUp: boolean;
    setDisplayNewBudgetPopUp: (value: boolean) => void;
}

const CreateNewBudgetPopUp: React.FC<CreateNewBudgetPopUpProps> = ({
    displayNewBudgetPopUp,
    setDisplayNewBudgetPopUp,
}) => {
    const d = new Date();
    let currentYear = d.getFullYear().toString();
    const backendUrl = "http://localhost:8000"
    const [formData, setFormData] = useState({ titel: "", jahr: currentYear });

    const createNewBudget = async () => {
        try {
            const response = await fetch(`${backendUrl}/budget/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ titel: formData.titel, jahr: formData.jahr })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Budget created:", data);
                setDisplayNewBudgetPopUp(false);
            } else {
                console.error("Failed to create budget");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (!displayNewBudgetPopUp) return null;

    return (
        <div role="popUp"
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-100"
        >
            <div className="absolute top-0 left-0 w-full h-full primary-background-color opacity-50 z-[-1]" onClick={() => setDisplayNewBudgetPopUp(false)} ></div>
            {/* Create Budget Form */}
            <div className="p-5 max-w-[500px] w-full rounded-md flex flex-col gap-2 secondary-background-color">
                {/* Titel */}
                <div className="flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                        <i className="fa-solid fa-signature text-3xl primary-background-textcolor"></i>
                        <label
                            htmlFor="titel"
                            className="text-3xl primary-background-textcolor font-semibold"
                        >
                            Budgetname:
                        </label>
                    </div>
                    {/* Close Button */}
                    <button
                        className="aspect-square cursor-pointer"
                        onClick={() => setDisplayNewBudgetPopUp(false)}><i className="fa-solid fa-xmark text-4xl primary-background-textcolor"></i>
                    </button>
                </div>
                <form
                    onSubmit={(e) => {
                        e.stopPropagation();
                        createNewBudget();
                    }}
                    className="flex flex-col gap-2"
                >
                    <div className="flex flex-col gap-2">
                        <input
                            id="titel"
                            type="text"
                            placeholder={`Budget - ${currentYear}`}
                            className="p-3 bg-white text-lg rounded-md"
                            value={formData.titel}
                            onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
                            autoFocus
                            required
                        />

                    </div>
                    <div className="flex flex-col gap-2">
                        <input
                            id="titel"
                            type="number"
                            placeholder={`${currentYear}`}
                            className="p-3 bg-white text-lg rounded-md"
                            value={formData.jahr}
                            onChange={(e) => setFormData({ ...formData, jahr: e.target.value })}
                        />

                    </div>
                    <button
                        type="submit"
                        className="text-white text-xl p-3 rounded-lg cursor-pointer primary-background-color"
                    >
                        Hinzufügen</button>
                </form>
            </div>
        </div>
    )

}

export default CreateNewBudgetPopUp;