import { useEffect, useState } from "react";
import  db  from "../services/firebase";
import { ref, onValue } from "firebase/database";

interface Income {
  id: string;
  amount: number;
  category: string;
  date: string;
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

const Statistics = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const incomesRef = ref(db, "incomes");
    onValue(incomesRef, (snapshot) => {
      const data = snapshot.val();
      setIncomes(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    });

    const expensesRef = ref(db, "expenses");
    onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      setExpenses(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    });
  }, []);

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div>
      <h1>Statistics</h1>
      <h2>Total Income: {totalIncome}</h2>
      <h2>Total Expenses: {totalExpense}</h2>
      <h2>Balance: {balance} {balance >= 0 ? "(Profit)" : "(Loss)"}</h2>
      <h3>Income Breakdown:</h3>
      <ul>
        {Object.entries(
          incomes.reduce((acc, { category, amount }) => {
            acc[category] = (acc[category] || 0) + amount;
            return acc;
          }, {} as Record<string, number>)
        ).map(([category, amount]) => (
          <li key={category}>{category}: {amount}</li>
        ))}
      </ul>
      <h3>Expense Breakdown:</h3>
      <ul>
        {Object.entries(
          expenses.reduce((acc, { category, amount }) => {
            acc[category] = (acc[category] || 0) + amount;
            return acc;
          }, {} as Record<string, number>)
        ).map(([category, amount]) => (
          <li key={category}>{category}: {amount}</li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;