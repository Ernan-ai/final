import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Incomes from "../Pages/Incomes";
import Expenses from "../Pages/Expenses";
import AddIncome from "../Pages/AddIncome";
import AddExpense from "../Pages/AddExpense";
import Statistics from "../Pages/Statistics";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/incomes" />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/add-income" element={<AddIncome />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/statistics" element={<Statistics />} />
        
      </Routes>
    </Router>
  );
};

export default AppRouter;