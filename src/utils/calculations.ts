
export interface Workday {
  id: string;
  date: string;
  dayRate: number;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'expense' | 'payment';
}

export const calculateTotalEarnings = (workdays: Workday[]): number => {
  return workdays.reduce((total, day) => total + day.dayRate, 0);
};

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.type === 'expense')
    .reduce((total, expense) => total + expense.amount, 0);
};

export const calculateTotalPayments = (expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.type === 'payment')
    .reduce((total, expense) => total + expense.amount, 0);
};

export const calculateRemainingBalance = (
  workdays: Workday[],
  expenses: Expense[]
): number => {
  const totalEarnings = calculateTotalEarnings(workdays);
  const totalExpenses = calculateTotalExpenses(expenses);
  const totalPayments = calculateTotalPayments(expenses);
  
  return totalEarnings - totalExpenses - totalPayments;
};

export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} ريال`;
};

export const getDefaultDayRate = (): number => {
  return 150;
};

export const getCurrentDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
