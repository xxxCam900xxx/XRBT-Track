import { useState } from "react";

interface CreateNewBudgetPopUpProps {
    displayNewBudgetPopUp: boolean;
    setDisplayNewBudgetPopUp: (value: boolean) => void;
}

const CreateNewBudgetPopUp: React.FC<CreateNewBudgetPopUpProps> = ({
    displayNewBudgetPopUp,
    setDisplayNewBudgetPopUp,
}) => {
    const backendUrl = "http://localhost:8000"
    const [formData, setFormData] = useState({ titel: "" });

    const createNewBudget = async () => {
        try {
            const response = await fetch(`${backendUrl}/budget/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ titel: formData.titel })
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
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
        >
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-75 z-[-1]" onClick={() => setDisplayNewBudgetPopUp(false)} ></div>
            {/* Close Button */}
            <button
                className="absolute top-10 right-10 bg-red-300 aspect-square w-15 rounded-md text-white bg-sky-300 cursor-pointer"
                onClick={() => setDisplayNewBudgetPopUp(false)}><i className="fa-solid fa-xmark text-4xl"></i>
            </button>
            {/* Create Budget Form */}
            <div className="bg-white p-5 max-w-[500px] w-full rounded-xl">
                <form
                    onSubmit={(e) => {
                        e.stopPropagation();
                        createNewBudget();
                    }}
                    className="flex flex-col gap-5"
                >
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="titel"
                            className="text-2xl"
                        >
                            Wie heisst der neue Plan?
                        </label>
                        <input
                            id="titel"
                            type="text"
                            placeholder="Budget - 0000"
                            className="p-2 border border-sky-300 rounded-md"
                            value={formData.titel}
                            onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
                            autoFocus
                        />

                    </div>
                    <button
                        type="submit"
                        className="bg-sky-300 text-white text-xl p-2 rounded-lg cursor-pointer"
                    >
                        Create new Budget</button>
                </form>
            </div>
        </div>
    )

}

export default CreateNewBudgetPopUp;