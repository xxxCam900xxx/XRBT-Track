import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BudgetPlanView from './assets/components/BudgetPlanView';
import MonthView from './assets/components/MonthView';
import CreditsView from './assets/components/CreditsView';
import BugetSelectionView from './assets/components/BugetSelectionView';

function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<BugetSelectionView />} />
        <Route path="/plan" element={<BudgetPlanView />} />
        <Route path="/plan/month" element={<MonthView />} />
        <Route path='/credits' element={<CreditsView />} />
      </Routes>
    </Router>
  )
}

export default App
