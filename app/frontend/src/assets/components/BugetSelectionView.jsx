function BugetSelectionView() {
    return (
        <>
            {/* Buget Folder List */}
            <section
                className="bg-green-300 w-full h-full flex flex-col p-5"
            >
                <div className="bg-violet-300 flex flex-row items-center justify-between p-5 rounded-xl relative gap-5 cursor-pointer">
                    <div className="flex flex-col w-full gap-2">
                        <h1 className="text-2xl font-semibold">2025</h1>
                        <div className="flex flex-col justify-center w-full items-center rounded-xl overflow-hidden">
                            <div className="flex flex-row justify-around w-full">
                                <p className="border-b w-full text-center p-1 bg-green-300">Einnahmen: 100CHF</p>
                                <p className="border-b w-full text-center p-1 bg-red-300">Ausgaben: 50CHF</p>
                            </div>
                            <h1 className="w-full text-center p-1 bg-green-300">Umsatz: +50CHF</h1>
                        </div>
                    </div>
                    <div className="flex h-full items-start">
                        <button
                            className="bg-red-400 text-md aspect-square w-[40px] rounded-xl cursor-pointer"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </section>
            {/* Tools */}
            <section
                className="bg-red-300 w-full h-[100px] p-5 flex flex-row gap-5 items-center justify-center"
            >
                <button className="px-5 h-fit w-3/5 py-2 bg-yellow-300 rounded-md cursor-pointer">Create</button>
                <button className="px-5 py-2 h-fit bg-yellow-300 rounded-md cursor-pointer">Credits</button>
            </section>
        </>
    )
}

export default BugetSelectionView
