import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MonthView from './assets/components/MonthView';
import CreditsView from './assets/components/CreditsView';
import OverallView from './assets/components/OverallView';
import BudgetPlanView from './assets/components/BudgetView';

function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<OverallView />} />
        <Route path="/plan" element={<BudgetPlanView />} />
        <Route path="/plan/month" element={<MonthView />} />
        <Route path='/credits' element={<CreditsView />} />
      </Routes>
    </Router>
  )
}

export default App
