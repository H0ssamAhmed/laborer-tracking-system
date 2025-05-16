import React, { useState, useEffect } from 'react';
import { Workday, Expense, calculateRemainingBalance, archiveAllRecords } from '@/utils/calculations';
import DataSummary from '@/components/DataSummary';
import WorkdayEntry from '@/components/WorkdayEntry';
import ExpenseEntry from '@/components/ExpenseEntry';
import WorkdaysList from '@/components/WorkdaysList';
import ExpensesList from '@/components/ExpensesList';
import ArchivedRecords from '@/components/ArchivedRecords';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, Trash2 } from 'lucide-react';

const Index = () => {
  const [workdays, setWorkdays] = useState<Workday[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<string>('active');
  
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
  
  const handleArchiveAccount = () => {
    const [archivedWorkdays, archivedExpenses] = archiveAllRecords(workdays, expenses);
    setWorkdays(archivedWorkdays);
    setExpenses(archivedExpenses);
    toast.success('تم أرشفة الحساب بنجاح');
  };
  
  const handleRestoreWorkday = (id: string) => {
    setWorkdays(workdays.map(day => day.id === id ? { ...day, archived: false } : day));
    toast.success('تم استعادة يوم العمل بنجاح');
  };
  
  const handleRestoreExpense = (id: string) => {
    setExpenses(expenses.map(expense => expense.id === id ? { ...expense, archived: false } : expense));
    toast.success('تم استعادة العنصر بنجاح');
  };
  
  const handleClearAllData = () => {
    setWorkdays([]);
    setExpenses([]);
    toast.success('تم حذف جميع البيانات بنجاح');
  };
  
  // Filter active and archived records
  const activeWorkdays = workdays.filter(day => !day.archived);
  const activeExpenses = expenses.filter(expense => !expense.archived);
  const archivedWorkdays = workdays.filter(day => day.archived);
  const archivedExpenses = expenses.filter(expense => expense.archived);
  
  const remainingBalance = calculateRemainingBalance(workdays, expenses);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">نظام متابعة الأجور</h1>
      </header>
      
      <main className="container max-w-md mx-auto p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">السجلات النشطة</TabsTrigger>
            <TabsTrigger value="archived">الأرشيف</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4">
            <DataSummary workdays={activeWorkdays} expenses={activeExpenses} />
            
            <div className="grid gap-6">
              <WorkdayEntry onAddWorkday={handleAddWorkday} />
              <ExpenseEntry onAddExpense={handleAddExpense} />
              
              <WorkdaysList 
                workdays={activeWorkdays} 
                onDeleteWorkday={handleDeleteWorkday} 
              />
              
              <ExpensesList 
                expenses={activeExpenses} 
                onDeleteExpense={handleDeleteExpense} 
              />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full bg-accent hover:bg-accent/80 text-white font-bold"
                    disabled={activeWorkdays.length === 0 && activeExpenses.length === 0}
                  >
                    <Archive className="ml-2 h-4 w-4" /> أرشفة الحساب
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد من أرشفة الحساب؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      {remainingBalance > 0 ? (
                        <p>أنت على وشك أرشفة جميع البيانات. هناك مبلغ <strong>{remainingBalance.toFixed(2)} ريال</strong> متبقي لم يتم استلامه.</p>
                      ) : (
                        <p>أنت على وشك أرشفة جميع البيانات.</p>
                      )}
                      <p className="mt-2">يمكنك استعادة السجلات المؤرشفة لاحقاً.</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchiveAccount}>نعم، أرشفة الحساب</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* New Clear All Data Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full font-bold"
                    disabled={workdays.length === 0 && expenses.length === 0}
                  >
                    <Trash2 className="ml-2 h-4 w-4" /> حذف جميع البيانات
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد من حذف جميع البيانات؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      <p>سيتم حذف جميع البيانات بشكل نهائي، بما في ذلك السجلات المؤرشفة.</p>
                      <p className="mt-2 font-bold text-destructive">لا يمكن التراجع عن هذه العملية.</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearAllData}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      نعم، حذف جميع البيانات
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>
          
          <TabsContent value="archived" className="mt-4">
            <ArchivedRecords 
              archivedWorkdays={archivedWorkdays} 
              archivedExpenses={archivedExpenses}
              onRestoreWorkday={handleRestoreWorkday}
              onRestoreExpense={handleRestoreExpense}
            />
            
            {(archivedWorkdays.length === 0 && archivedExpenses.length === 0) && (
              <div className="text-center mt-8 text-muted-foreground">
                <p>لا توجد سجلات مؤرشفة بعد</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
