
export interface Workday {
  id: string;
  date: string;
  dayRate: number;
  archived?: boolean;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'expense' | 'payment';
  archived?: boolean;
}

export const calculateTotalEarnings = (workdays: Workday[]): number => {
  return workdays
    .filter(day => !day.archived)
    .reduce((total, day) => total + day.dayRate, 0);
};

export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.type === 'expense' && !expense.archived)
    .reduce((total, expense) => total + expense.amount, 0);
};

export const calculateTotalPayments = (expenses: Expense[]): number => {
  return expenses
    .filter(expense => expense.type === 'payment' && !expense.archived)
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

// Archive-related functions
export const archiveAllRecords = (workdays: Workday[], expenses: Expense[]): [Workday[], Expense[]] => {
  const archivedWorkdays = workdays.map(day => ({ ...day, archived: true }));
  const archivedExpenses = expenses.map(expense => ({ ...expense, archived: true }));
  
  return [archivedWorkdays, archivedExpenses];
};

export const getActiveRecords = (workdays: Workday[], expenses: Expense[]): [Workday[], Expense[]] => {
  return [
    workdays.filter(day => !day.archived),
    expenses.filter(expense => !expense.archived)
  ];
};

export const getArchivedRecords = (workdays: Workday[], expenses: Expense[]): [Workday[], Expense[]] => {
  return [
    workdays.filter(day => day.archived),
    expenses.filter(expense => day.archived)
  ];
};

export const restoreRecord = (id: string, isWorkday: boolean, workdays: Workday[], expenses: Expense[]): [Workday[], Expense[]] => {
  if (isWorkday) {
    return [
      workdays.map(day => day.id === id ? { ...day, archived: false } : day),
      expenses
    ];
  } else {
    return [
      workdays,
      expenses.map(expense => expense.id === id ? { ...expense, archived: false } : expense)
    ];
  }
};
