import React, { useState, DragEvent, ChangeEvent } from "react";

interface ImportMonthsPopUpProps {
    displayNewBudgetPopUp: boolean;
    setDisplayNewBudgetPopUp: (value: boolean) => void;
    budget_id: string;
    fetchBudgets: () => void;
}

const ImportMonthsPopUp: React.FC<ImportMonthsPopUpProps> = ({
    displayNewBudgetPopUp,
    setDisplayNewBudgetPopUp,
    budget_id,
    fetchBudgets,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [readyToUpload, setReadyToUpload] = useState<boolean>(false);

    const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && isCsvOrExcel(droppedFile)) {
            setFile(droppedFile);
            setReadyToUpload(true)
        } else {
            setReadyToUpload(false)
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && isCsvOrExcel(selectedFile)) {
            setFile(selectedFile);
            setReadyToUpload(true)
        } else {
            setReadyToUpload(false)
        }
    };

    const isCsvOrExcel = (file: File) => {
        return (
            file.type === "text/csv" ||
            file.name.endsWith(".csv") ||
            file.name.endsWith(".xlsx") ||
            file.name.endsWith(".xls")
        );
    };

    const backendUrl = "http://localhost:8000";
    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${backendUrl}/import/${budget_id}`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || "Fehler beim Upload");

            setDisplayNewBudgetPopUp(false);
            fetchBudgets();
        } catch (err: any) {
            console.error("Error:", err);
        }
    };

    if (!displayNewBudgetPopUp) return null;

    return (
        <div role="popUp"
            className="fixed top-0 left-0 w-full h-full flex items-start md:items-center md:justify-center z-100"
        >
            <div
                className="absolute top-0 left-0 w-full h-full primary-background-color opacity-50 z-[-1]"
                onClick={() => setDisplayNewBudgetPopUp(false)}
            ></div>

            <div className="p-5 md:max-w-[500px] w-full rounded-b-md md:rounded-md flex flex-col gap-2 secondary-background-color">
                {/* Titel + Close */}
                <div className="flex flex-row justify-between">
                    <div className="flex gap-2 items-center">
                        <i className="fa-solid fa-download text-3xl primary-background-textcolor"></i>
                        <h1 className="text-2xl md:text-3xl primary-background-textcolor font-semibold">
                            Importieren
                        </h1>
                    </div>
                    <button
                        className="aspect-square cursor-pointer"
                        onClick={() => setDisplayNewBudgetPopUp(false)}
                    >
                        <i className="fa-solid fa-xmark text-4xl primary-background-textcolor"></i>
                    </button>
                </div>

                {/* Upload Area */}
                <div
                    className="border-2 border-dashed border-cyan-600 bg-white rounded-md h-[180px] flex flex-col justify-center items-center text-center cursor-pointer"
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById("file-input")?.click()}
                >
                    {!file ? (
                        <>
                            <i className="fa-solid fa-upload primary-background-textcolor text-4xl mb-2"></i>
                            <p className="primary-background-textcolor text-sm">Click to upload or drag and drop<br />EXCEL or CSV</p>
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-file-excel primary-background-textcolor text-4xl mb-2"></i>
                            <p className="primary-background-textcolor text-sm">File wurde erfolgreich hochgeladen</p>
                            <p className="font-bold primary-background-textcolor text-sm">[{file.name}]</p>
                        </>
                    )}
                </div>

                <input
                    id="file-input"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    className="primary-background-color text-white text-xl font-semibold py-2 rounded-md w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!readyToUpload}
                >
                    Hochladen
                </button>
            </div>
        </div>
    );
};

export default ImportMonthsPopUp;