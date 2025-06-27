import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Booking } from "../types/booking";
import CreateNewBookingPopUp from "../widgets/CreateNewBookingPopUp";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector
} from "recharts";
import { DashboardSignature } from "./ui/dashboardSignature";
import { BookingTable } from "./tables/bookingsTable";
import { DisplaySaldo } from "./ui/displaySaldo";
import { SpecificExpensesSearch } from "./tools/specificExpensesSearch";
import { MonthCousreLineChart } from "./charts/monthCourseLineChart";

function MonthView() {
  const location = useLocation();
  const { month_id } = location.state || {};
  const { monthName } = location.state || {};
  const { monthStart } = location.state || {};
  const backendUrl = "http://localhost:8000";
  const navigate = useNavigate();
  const [selectedTitle, setSelectedTitle] = useState("");

  const [incomings, setIncomings] = useState<Booking[]>([]);
  const [outgoings, setOutgoings] = useState<Booking[]>([]);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);
  const [totalOutgoings, setTotalOutgoings] = useState<number>(0);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayNewBookingPopUp, setDisplayNewBookingPopUp] =
    useState<boolean>(false);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const fetchBookings = useCallback(
    async (type: "einnahme" | "ausgabe") => {
      try {
        const response = await fetch(
          `${backendUrl}/booking/${month_id}/${type}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Booking[] = await response.json();
        return data;
      } catch (err: any) {
        console.error(`Error fetching ${type}:`, err);
        setError(err.message);
        return [];
      }
    },
    [backendUrl, month_id]
  );

  const fetchAndCalculateTotals = useCallback(async () => {
    if (!month_id) {
      console.warn("month_id is not available, cannot fetch bookings.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedIncomings = await fetchBookings("einnahme");
      const fetchedOutgoings = await fetchBookings("ausgabe");

      setIncomings(fetchedIncomings);
      setOutgoings(fetchedOutgoings);

      const calculatedTotalIncomes = fetchedIncomings.reduce(
        (sum, item) => sum + parseFloat(item.betrag || "0"),
        0
      );
      const calculatedTotalOutgoings = fetchedOutgoings.reduce(
        (sum, item) => sum + parseFloat(item.betrag || "0"),
        0
      );

      setTotalIncomes(calculatedTotalIncomes);
      setTotalOutgoings(calculatedTotalOutgoings);

      const response = await fetch(`${backendUrl}/month/info/${month_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total_einnahmen: calculatedTotalIncomes,
          total_ausgaben: calculatedTotalOutgoings,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Monatsstatistik erfolgreich aktualisiert.");
    } catch (err: any) {
      console.error("Fehler beim Aktualisieren der Monatsstatistik:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [month_id, fetchBookings, backendUrl]);

  useEffect(() => {
    if (!month_id) {
      navigate("/");
      return;
    }
    fetchAndCalculateTotals();
  }, [month_id, navigate, fetchAndCalculateTotals]);

  const handleAddBookingClick = () => {
    setCurrentBooking({
      buchung_id: "",
      titel: "",
      datum: monthStart,
      betrag: "",
      typ: "",
      monat_id: month_id,
    });
    setDisplayNewBookingPopUp(true);
  };

  const handleEditBookingClick = (bookingToEdit: Booking) => {
    setCurrentBooking(bookingToEdit);
    setDisplayNewBookingPopUp(true);
  };

  const handleDeleteBookingClick = async (bookingID: string) => {
    const response = await fetch(`${backendUrl}/booking/${bookingID}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log("Buchung wurde erfolgreich gelöscht.");
    fetchAndCalculateTotals();
  };

  const handleBookingCreatedOrUpdated = () => {
    setDisplayNewBookingPopUp(false);
    fetchAndCalculateTotals();
  };

  const handleClosePopUp = () => {
    setDisplayNewBookingPopUp(false);
    setCurrentBooking(null);
  };

  const chartData = [...incomings, ...outgoings]
    .map((b) => ({
      datum: new Date(b.datum).toLocaleDateString("de-DE"),
      betrag: parseFloat(b.betrag),
      typ: b.typ,
    }))
    .reduce((acc, curr) => {
      const entry = acc.find((e) => e.datum === curr.datum);
      const betrag = Math.abs(curr.betrag); // Immer positiv
      if (!entry) {
        acc.push({
          datum: curr.datum,
          einnahmen: curr.typ === "einnahme" ? betrag : 0,
          ausgaben: curr.typ === "ausgabe" ? betrag : 0,
        });
      } else {
        if (curr.typ === "einnahme") entry.einnahmen += betrag;
        if (curr.typ === "ausgabe") entry.ausgaben += betrag;
      }
      return acc;
    }, [] as { datum: string; einnahmen: number; ausgaben: number }[]);

  // Gruppierte Ausgaben nach Titel
  const pieChartData = outgoings.reduce((acc, curr) => {
    const existing = acc.find((item) => item.name === curr.titel);
    const betrag = Math.abs(parseFloat(curr.betrag)); // Betrag immer positiv
    if (!isNaN(betrag)) {
      if (existing) {
        existing.value += betrag;
      } else {
        acc.push({ name: curr.titel, value: betrag });
      }
    }

    return acc;
  }, [] as { name: string; value: number }[]);

  const uniqueOutgoingTitles = [...new Set(outgoings.map((o) => o.titel))];

  const filteredOutgoings = outgoings.filter((item) =>
    selectedTitle ? item.titel === selectedTitle : false
  );

  const filteredTotal = filteredOutgoings.reduce(
    (sum, item) => sum + parseFloat(item.betrag || "0"),
    0
  );

  function stringToRandomPastelColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i) * (i + 1);
      hash |= 0; // Force 32bit integer
    }
    const h = Math.abs(hash) % 360;

    // Zufällige leichte Variation von Sättigung und Helligkeit
    const s = 50 + (Math.abs(hash * 7) % 20); // 50–69%
    const l = 75 + (Math.abs(hash * 13) % 15); // 75–89%

    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="flex flex-row h-full w-full primary-background-color">

      {/* Navigation Section */}
      <section className="w-1/4 flex flex-col h-full secondary-background-color shadow-2xl">

        {/* Banner Image */}
        <img src="/images/XRBT-Banner.png" alt="XRBT-Banner" className='w-full' />

        <section className="w-full h-full max-h-full overflow-y-auto flex flex-col p-5 gap-3">
          {/* Umsatz anzeige */}
          <DisplaySaldo
            totalIncomes={totalIncomes}
            totalOutgoings={totalOutgoings}
          />

          {/* Spezifische Suche Ausgaben */}
          <SpecificExpensesSearch
            selectedTitle={selectedTitle}
            setSelectedTitle={setSelectedTitle}
            uniqueOutgoingTitles={uniqueOutgoingTitles}
            filteredOutgoings={filteredOutgoings}
            filteredTotal={filteredTotal}
          />

          {/* Visuelle Statistik Verlauf im Monat */}
          <MonthCousreLineChart
            chartData={chartData}
          />

          {/* Visuelle Statistik prozentualer Kuchen */}
          <div className="w-full p-3 rounded-md flex flex-col primary-background-color gap-2">
            <h2 className="text-2xl text-white font-semibold">Ausgaben Prozentual</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%" className="bg-white p-3 rounded-md">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={renderCustomizedLabel}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={stringToRandomPastelColor(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} CHF`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Create Tool */}
        <section className="w-full h-[100px] p-5 flex flex-row gap-5 items-center justify-center">
          <button
            className="px-5 h-fit w-full py-2 rounded-md cursor-pointer text-white text-xl font-semibold primary-background-color"
            onClick={handleAddBookingClick}
          >
            Neue Buchung erstellen
          </button>
        </section>

      </section>

      {/* Dashboard */}
      <aside className='flex flex-col gap-5 w-3/4 p-10 overflow-y-auto'>

        {/* Namespace Section */}
        <DashboardSignature
          title={monthName}
        />

        {/* Table */}
        <BookingTable
          incomings={incomings}
          totalIncomes={totalIncomes}
          outgoings={outgoings}
          totalOutgoings={totalOutgoings}
          handleEditBookingClick={handleEditBookingClick}
          handleDeleteBookingClick={handleDeleteBookingClick}
        />
      </aside>

      {displayNewBookingPopUp && (
        <CreateNewBookingPopUp
          displayNewBookingPopUp={displayNewBookingPopUp}
          setDisplayNewBookingPopUp={handleClosePopUp}
          month_id={month_id}
          setBooking={setCurrentBooking}
          booking={currentBooking as Booking}
          reload={handleBookingCreatedOrUpdated}
        />
      )}
    </main>
  );
}

export default MonthView;
