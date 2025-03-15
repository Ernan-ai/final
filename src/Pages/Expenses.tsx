import { useEffect, useState } from "react";
import db from "../services/firebase";
import { ref, onValue, remove } from "firebase/database";
import { Button, List, ListItem, ListItemText } from "@mui/material";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const expensesRef = ref(db, "expenses");
    onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      const expenseList = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      setExpenses(expenseList);
    });
  }, []);

  const handleDelete = (id: string) => {
    remove(ref(db, `expenses/${id}`));
  };

  return (
    <div>
      <h1>Expenses</h1>
      <List>
        {expenses.map((expense) => (
          <ListItem key={expense.id}>
            <ListItemText primary={`Category: ${expense.category}, Amount: ${expense.amount}, Date: ${expense.date}`} />
            <Button variant="contained" color="secondary" onClick={() => handleDelete(expense.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Expenses;
