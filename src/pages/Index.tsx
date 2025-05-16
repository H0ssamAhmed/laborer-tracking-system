
import React, { useState, useEffect } from 'react';
import { Workday, Expense, calculateRemainingBalance } from '@/utils/calculations';
import DataSummary from '@/components/DataSummary';
import WorkdayEntry from '@/components/WorkdayEntry';
import ExpenseEntry from '@/components/ExpenseEntry';
import WorkdaysList from '@/components/WorkdaysList';
import ExpensesList from '@/components/ExpensesList';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const Index = () => {
  const [workdays, setWorkdays] = useState<Workday[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedWorkdays = localStorage.getItem('workdays');
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedWorkdays) {
      setWorkdays(JSON.parse(savedWorkdays));
    }
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workdays', JSON.stringify(workdays));
  }, [workdays]);
  
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  const handleAddWorkday = (workday: Workday) => {
    setWorkdays([...workdays, workday]);
  };
  
  const handleAddExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };
  
  const handleDeleteWorkday = (id: string) => {
    setWorkdays(workdays.filter(day => day.id !== id));
    toast.success('تم حذف يوم العمل بنجاح');
  };
  
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast.success('تم حذف العنصر بنجاح');
  };
  
  const handleClearAccount = () => {
    setWorkdays([]);
    setExpenses([]);
    toast.success('تم تصفير الحساب بنجاح');
  };
  
  const remainingBalance = calculateRemainingBalance(workdays, expenses);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">نظام متابعة الأجور</h1>
      </header>
      
      <main className="container max-w-md mx-auto p-4 pb-20">
        <DataSummary workdays={workdays} expenses={expenses} />
        
        <div className="grid gap-6">
          <WorkdayEntry onAddWorkday={handleAddWorkday} />
          <ExpenseEntry onAddExpense={handleAddExpense} />
          
          <WorkdaysList 
            workdays={workdays} 
            onDeleteWorkday={handleDeleteWorkday} 
          />
          
          <ExpensesList 
            expenses={expenses} 
            onDeleteExpense={handleDeleteExpense} 
          />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full bg-accent hover:bg-accent/80 text-white font-bold"
                disabled={workdays.length === 0 && expenses.length === 0}
              >
                تصفية الحساب
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد من تصفية الحساب؟</AlertDialogTitle>
                <AlertDialogDescription>
                  {remainingBalance > 0 ? (
                    <p>أنت على وشك حذف جميع البيانات وتصفير الحساب. هناك مبلغ <strong>{remainingBalance.toFixed(2)} ريال</strong> متبقي لم يتم استلامه.</p>
                  ) : (
                    <p>أنت على وشك حذف جميع البيانات وتصفير الحساب.</p>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAccount}>نعم، تصفية الحساب</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
};

export default Index;
