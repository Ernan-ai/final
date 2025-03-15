import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/incomes">
          Incomes
        </Button>
        <Button color="inherit" component={Link} to="/expenses">
          Expenses
        </Button>
        <Button color="inherit" component={Link} to="/add-income">
          Add Income
        </Button>
        <Button color="inherit" component={Link} to="/add-expense">
          Add Expense
        </Button>
        <Button color="inherit" component={Link} to="/statistics">
          Statistics
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
