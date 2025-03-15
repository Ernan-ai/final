import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import  db  from "../services/firebase";
import { ref, push, get } from "firebase/database";
import { TextField, Button, MenuItem, Container, Typography } from "@mui/material";

interface IncomeForm {
  amount: number;
  category: string;
}

const schema = yup.object().shape({
  amount: yup.number().positive().integer().required("Amount is required"),
  category: yup.string().required("Category is required"),
});

const AddIncome = () => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IncomeForm>({ resolver: yupResolver(schema) });

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryRef = ref(db, "categories/income");
      const snapshot = await get(categoryRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoryList = Object.keys(data).map((key) => ({
          id: key,
          name: data[key],
        }));
        setCategories(categoryList);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: IncomeForm) => {
    await push(ref(db, "incomes"), {
      amount: data.amount,
      category: data.category,
      date: new Date().toISOString().split("T")[0],
    });
    reset();
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>Add Income</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          select
          label="Category"
          fullWidth
          margin="normal"
          {...register("category")}
          error={!!errors.category}
          helperText={errors.category?.message}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          type="number"
          label="Amount"
          fullWidth
          margin="normal"
          {...register("amount")}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />

        <Button type="submit" variant="contained" color="primary">Add Income</Button>
      </form>
    </Container>
  );
};

export default AddIncome;
