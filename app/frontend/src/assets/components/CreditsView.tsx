function CreditsView() {
    return (
        <main className="flex flex-col min-h-screen w-full primary-background-color p-10 items-center gap-8">
            {/* Logo */}
            <img
                src="/images/XRBT-Logo.png"
                alt="XRBT-Logo"
                className="w-[150px] aspect-square rounded-md shadow-lg"
            />

            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-extrabold text-white text-center drop-shadow-lg">
                Credits
            </h1>

            {/* Sections */}
            <div className="w-full max-w-4xl flex flex-col gap-8 mt-6">
                {/* Authors */}
                <section className="secondary-background-color backdrop-blur-md rounded-lg p-6 shadow-md">
                    <h2 className="text-3xl primary-background-textcolor font-semibold mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-user text-2xl"></i> Autoren
                    </h2>
                    <ul className="primary-background-textcolor text-lg space-y-2">
                        <li><span className="font-bold">XRAYZU</span> – Projektleitung & Entwicklung</li>
                    </ul>
                </section>

                {/* Design */}
                <section className="secondary-background-color backdrop-blur-md rounded-lg p-6 shadow-md">
                    <h2 className="text-3xl primary-background-textcolor font-semibold mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-paintbrush text-2xl"></i> Design & Inspiration
                    </h2>
                    <p className="primary-background-textcolor text-lg">
                        Basierend auf modernen UI-Prinzipien, inspiriert durch Minimalismus und Accessibility-Standards.
                    </p>
                </section>

                {/* Acknowledgments */}
                <section className="secondary-background-color backdrop-blur-md rounded-lg p-6 shadow-md">
                    <h2 className="text-3xl primary-background-textcolor font-semibold mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-hands-helping text-2xl"></i> Danksagung
                    </h2>
                    <p className="primary-background-textcolor text-lg">
                        Besonderer Dank an alle Mitwirkenden, Tester und die Community für wertvolles Feedback und Unterstützung.
                    </p>
                </section>

                {/* License */}
                <section className="secondary-background-color backdrop-blur-md rounded-lg p-6 shadow-md">
                    <h2 className="text-3xl primary-background-textcolor font-semibold mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-scale-balanced text-2xl"></i> Lizenz
                    </h2>
                    <p className="primary-background-textcolor text-lg">
                        Dieses Projekt steht unter selbst definierten Lizenz. Alle Rechte vorbehalten.
                    </p>
                </section>
            </div>
        </main>
    )
}

export default CreditsView
