import { NavLink } from "react-router";

function Preheader() {
    return (

        <header className="w-full flex p-3 justify-start bg-blue-500 gap-5">

            <span className="text-white text-md font-bold">
                React Budget-Tracker
            </span>
            <NavLink className="text-white transition duration-3 hover:text-blue-300" to="/" end>Übersicht</NavLink>
            <NavLink className="text-white transition duration-3 hover:text-blue-300" to="/einnahmen" end>Einnahmen</NavLink>
            <NavLink className="text-white transition duration-3 hover:text-blue-300" to="/ausgaben" end>Ausgaben</NavLink>

        </header>

    )
}

export default Preheader;