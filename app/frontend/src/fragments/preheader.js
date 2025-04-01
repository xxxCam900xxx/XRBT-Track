function Preheader() {
    return (

        <header className="w-full flex p-3 justify-start bg-violet-500 gap-5">

            <span className="text-white text-md font-bold">
                React Budget-Tracker
            </span>
            <a className="text-white transition duration-3 hover:text-violet-300" href="/">Übersicht</a>
            <a className="text-white transition duration-3 hover:text-violet-300" href="/einnahmen">Einnahmen</a>
            <a className="text-white transition duration-3 hover:text-violet-300" href="/ausgaben">Ausgaben</a>

        </header>

    )
}

export default Preheader;