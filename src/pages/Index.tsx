import React, { useState, useEffect } from 'react';
import { Workday, Expense, calculateRemainingBalance, archiveAllRecords } from '@/utils/calculations';
import DataSummary from '@/components/DataSummary';
import WorkdayEntry from '@/components/WorkdayEntry';
import ExpenseEntry from '@/components/ExpenseEntry';
import WorkdaysList from '@/components/WorkdaysList';
import ExpensesList from '@/components/ExpensesList';
import { api } from "../../convex/_generated/api";
import ArchivedRecords from '@/components/ArchivedRecords';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, Trash2 } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import DataSummarySkeleton from '@/components/DataSummarySkeleton';

const Index = () => {
  const [workdays, setWorkdays] = useState<Workday[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('active');
  const getAllExpenses = useQuery(api.expenses.getAllExpenses);
  const getAllDays = useQuery(api.workdays.getAllDays);
  const archiveExpenses = useMutation(api.expenses.archiveAllExpenses)
  const archiveDays = useMutation(api.workdays.archiveAllDays)
  const unarchiveASingleDay = useMutation(api.workdays.unarchiveSingleDay)
  const UnarchiveASingleExpense = useMutation(api.expenses.unarchiveSingleExpense)

  useEffect(() => {
    if (getAllExpenses) {
      setExpenses(getAllExpenses);
    }
    if (getAllDays) {
      setWorkdays(getAllDays);
    }
    return () => {
      setIsLoading(false);
    }
  }, [getAllExpenses, getAllDays])



  const handleArchiveAccount = () => {
    setIsLoading(true);
    archiveExpenses()
      .then(() => toast.success('تم ارشفة جميع العناصر بنجاح'))
      .finally(() => setIsLoading(false));

    archiveDays()
      .then(() => toast.success('تم ارشفة جميع يوم العمل بنجاح'))
      .finally(() => setIsLoading(false));
  };

  const handleRestoreWorkday = (id: string) => {
    console.log(id);
    unarchiveASingleDay({ id })
    // setWorkdays(workdays.map(day => day._id === id ? { ...day, archived: false } : day));
    // toast.success('تم استعادة يوم العمل بنجاح');
  };

  const handleRestoreExpense = (id: string) => {
    UnarchiveASingleExpense({ id })
    // setExpenses(expenses.map(expense => expense._id === id ? { ...expense, archived: false } : expense));
    // toast.success('تم استعادة العنصر بنجاح');
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
      <main className="container max-w-md mx-auto p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6" dir='rtl'>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">السجلات النشطة</TabsTrigger>
            <TabsTrigger value="archived">الأرشيف</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {isLoading ? <DataSummarySkeleton /> :
              <DataSummary workdays={activeWorkdays} expenses={activeExpenses} />
            }

            <div className="grid gap-6">
              <WorkdayEntry
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />

              <ExpenseEntry
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />

              <WorkdaysList
                setIsLoading={setIsLoading}
                workdays={activeWorkdays}
              />

              <ExpensesList
                setIsLoading={setIsLoading}
                expenses={activeExpenses}
              />

              <AlertDialog >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-accent hover:bg-accent/80 text-white font-bold"
                    disabled={activeWorkdays.length === 0 && activeExpenses.length === 0}
                  >
                    <Archive className="ml-2 h-4 w-4" /> أرشفة الحساب
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir='rtl'>
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-start'>هل أنت متأكد من أرشفة الحساب؟</AlertDialogTitle>
                    <AlertDialogDescription className='text-start'>
                      {remainingBalance > 0 ? (
                        <p>أنت على وشك أرشفة جميع البيانات. هناك مبلغ <strong>{remainingBalance.toFixed(2)} ريال</strong> متبقي لم يتم استلامه.</p>
                      ) : (
                        <p>أنت على وشك أرشفة جميع البيانات.</p>
                      )}
                      <p className="mt-2">يمكنك استعادة السجلات المؤرشفة لاحقاً.</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className='gap-x-4'>
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
                <AlertDialogContent dir='rtl'>
                  <AlertDialogHeader >
                    <AlertDialogTitle className='text-start'>هل أنت متأكد من حذف جميع البيانات؟</AlertDialogTitle>
                    <AlertDialogDescription className='text-start'>
                      <p>سيتم حذف جميع البيانات بشكل نهائي، بما في ذلك السجلات المؤرشفة.</p>
                      <p className="mt-2 font-bold text-destructive">لا يمكن التراجع عن هذه العملية.</p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className='gap-x-4'>
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
