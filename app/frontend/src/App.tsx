import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeView from './assets/components/HomeView';
import BudgetPlanView from './assets/components/BudgetPlanView';

function App() {
  return (
     <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/plan" element={<BudgetPlanView />} />
      </Routes>
    </Router>
  )
}

export default App
