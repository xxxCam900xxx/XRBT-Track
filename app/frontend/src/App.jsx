import BugetSelectionView from "./assets/components/BugetSelectionView"
import DashboardView from "./assets/components/DashboardView"

function App() {
  return (
    <main className="flex flex-row h-full w-full">
      {/* Dashboard Section */}
      <section
        className="w-2/3 bg-sky-300 flex justify-center items-center p-5"
      >
        <DashboardView />
      </section>
      {/* Folder Selection Section */}
      <section
        className="w-1/3 flex flex-col h-full"
      >
        <BugetSelectionView />
      </section>
    </main>
  )
}

export default App
