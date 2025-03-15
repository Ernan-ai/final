import { useEffect, useState } from "react";
import db from "../services/firebase";
import { ref, get, remove } from "firebase/database";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";

interface Income {
  id: string;
  amount: number;
  category: string;
  date: string;
}

const Incomes = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      const incomeRef = ref(db, "incomes");
      const snapshot = await get(incomeRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const incomeList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setIncomes(incomeList);
      }
    };

    fetchIncomes();
  }, []);

  const handleDelete = async (id: string) => {
    await remove(ref(db, `incomes/${id}`));
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  return (
    <Grid container spacing={2}>
      {incomes.map((income) => (
        <Grid item xs={12} sm={6} md={4} key={income.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {income.category} - {income.amount} сом
              </Typography>
              <Typography color="textSecondary">{income.date}</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(income.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Incomes;
