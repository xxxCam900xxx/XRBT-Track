import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeView from './assets/components/HomeView';
import BudgetPlanView from './assets/components/BudgetPlanView';
import MonthView from './assets/components/MonthView';

function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/plan" element={<BudgetPlanView />} />
        <Route path="/plan/month" element={<MonthView />} />
      </Routes>
    </Router>
  )
}

export default App
