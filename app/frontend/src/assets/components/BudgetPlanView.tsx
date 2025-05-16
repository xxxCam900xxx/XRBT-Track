import { useLocation } from 'react-router-dom';

function BudgetPlanView() {

    const location = useLocation();
    const { budget_id } = location.state || {};

    return (
        <main className="flex flex-row h-full w-full bg-sky-300">
            {/* Dashboard */}
            <section
                className="w-2/3 flex justify-center items-center p-5"
            >

            </section>
            {/* Monate */}
            <section
                className="w-1/3 flex flex-col h-full rounded-l-2xl overflow-hidden bg-white"
            >

            </section>
        </main>
    )
}

export default BudgetPlanView