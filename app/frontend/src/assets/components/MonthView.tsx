import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Month } from '../types/month';

function MonthView() {

    const location = useLocation();
    const { month_id } = location.state || {};
    const backendUrl = "http://localhost:8000"
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <main className="flex flex-row h-full w-full bg-sky-300">
            {/* Dashboard */}
            <section
                className="w-3/5 flex justify-center items-center p-5"
            >
                <h1 className="text-4xl text-white">
                    Eintrag
                </h1>
            </section>
            {/* Monate */}
            <section
                className="w-2/5 flex flex-col h-full rounded-l-2xl overflow-auto bg-white"
            >
                
            </section>
            <button
                className='fixed top-5 left-5 bg-white text-md aspect-square w-[40px] rounded-xl cursor-pointer flex items-center justify-center'
                onClick={goBack}
            >
                <i className="fa-solid fa-xmark text-sky-400 text-2xl"></i>
            </button>
        </main>
    )
}

export default MonthView