// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  set, 
  push, 
  get, 
  remove, 
  update,
  query,
  orderByChild
} from 'firebase/database';
import { Category, CategoryType } from '../models/Category';
import { Transaction } from '../models/Transaction';

// Replace with your Firebase config
const firebaseConfig = { 
    apiKey: "AIzaSyABppbOKbzGYwe2U9L1r0A3fdX3h6_bo-w",
    authDomain: "itaepwam.firebaseapp.com", 
    databaseURL: "https://itaepwam-default-rtdb.europe-west1.firebasedatabase.app", 
    projectId: "itaepwam", storageBucket: "itaepwam.firebasestorage.app", 
    messagingSenderId: "898306399250", 
    appId: "1:898306399250:web:8d77fa67b44e6d7afb4ccb" 
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Category Operations
export const createCategory = async (type: CategoryType, name: string): Promise<Category> => {
  const newCategoryRef = push(ref(db, `categories/${type}`));
  const newCategory: Category = {
    id: newCategoryRef.key as string,
    name,
  };
  
  await set(newCategoryRef, newCategory);
  return newCategory;
};

export const getCategories = async (type: CategoryType): Promise<Category[]> => {
  const categoriesRef = ref(db, `categories/${type}`);
  const snapshot = await get(categoriesRef);
  
  if (!snapshot.exists()) {
    return [];
  }
  
  const categories: Category[] = [];
  snapshot.forEach((childSnapshot) => {
    categories.push(childSnapshot.val() as Category);
  });
  
  return categories;
};

export const updateCategory = async (
  type: CategoryType, 
  categoryId: string, 
  name: string
): Promise<void> => {
  const categoryRef = ref(db, `categories/${type}/${categoryId}`);
  await update(categoryRef, { name });
};

// Transaction Operations (Income & Expenses)
export const addTransaction = async (
  type: 'income' | 'expenses',
  amount: number,
  categoryId: string
): Promise<Transaction> => {
  const newTransactionRef = push(ref(db, type));
  const newTransaction: Transaction = {
    id: newTransactionRef.key as string,
    amount,
    categoryId,
    date: Date.now()
  };
  
  await set(newTransactionRef, newTransaction);
  return newTransaction;
};

export const getTransactions = async (type: 'income' | 'expenses'): Promise<Transaction[]> => {
  const transactionsRef = ref(db, type);
  const transactionsQuery = query(transactionsRef, orderByChild('date'));
  const snapshot = await get(transactionsQuery);
  
  if (!snapshot.exists()) {
    return [];
  }
  
  const transactions: Transaction[] = [];
  snapshot.forEach((childSnapshot) => {
    transactions.push(childSnapshot.val() as Transaction);
  });
  
  // Sort transactions by date (newest first)
  return transactions.sort((a, b) => b.date - a.date);
};

export const deleteTransaction = async (type: 'income' | 'expenses', id: string): Promise<void> => {
  const transactionRef = ref(db, `${type}/${id}`);
  await remove(transactionRef);
};

// Statistics Helpers
export const getStatistics = async () => {
  const income = await getTransactions('income');
  const expenses = await getTransactions('expenses');
  const incomeCategories = await getCategories('income');
  const expenseCategories = await getCategories('expense');
  
  // Calculate total income
  const totalIncome = income.reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Calculate income by category
  const incomeByCategory = incomeCategories.map(category => {
    const categoryTotal = income
      .filter(transaction => transaction.categoryId === category.id)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    return {
      category,
      total: categoryTotal,
      percentage: totalIncome > 0 ? (categoryTotal / totalIncome) * 100 : 0
    };
  });
  
  // Calculate expenses by category
  const expensesByCategory = expenseCategories.map(category => {
    const categoryTotal = expenses
      .filter(transaction => transaction.categoryId === category.id)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    return {
      category,
      total: categoryTotal,
      percentage: totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0
    };
  });
  
  // Calculate balance
  const balance = totalIncome - totalExpenses;
  
  return {
    totalIncome,
    totalExpenses,
    balance,
    incomeByCategory,
    expensesByCategory
  };
};

export default db;