import { useEffect, useState } from "react";
import db from "../services/firebase";
import { ref, onValue, push } from "firebase/database";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const AddExpense = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const categoriesRef = ref(db, "categories/expense");
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      setCategories(data ? Object.keys(data) : []);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    push(ref(db, "expenses"), {
      category,
      amount: Number(amount),
      date: new Date().toISOString().split("T")[0],
    });

    setCategory("");
    setAmount("");
  };

  return (
    <div>
      <h1>Add Expense</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">Add Expense</Button>
      </form>
    </div>
  );
};

export default AddExpense;
