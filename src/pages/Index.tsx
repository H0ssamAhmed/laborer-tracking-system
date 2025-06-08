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
import DataSummarySkeleton from '@/components/DataSummarySkeleton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import Spinner from '@/components/Spinner';
import { api } from '../../convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Toast } from '@radix-ui/react-toast';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const [workdays, setWorkdays] = useState<Workday[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('active');

  // Convex hooks
  const getAllExpenses = useQuery(api.expenses.getAllExpenses, user ? { userId: user._id } : "skip");
  const getAllDays = useQuery(api.workdays.getAllDays, user ? { userId: user._id } : "skip");
  const archiveExpenses = useMutation(api.expenses.archiveAllExpenses);
  const archiveDays = useMutation(api.workdays.archiveAllDays);
  const unarchiveASingleDay = useMutation(api.workdays.unarchiveSingleDay);
  const UnarchiveASingleExpense = useMutation(api.expenses.unarchiveSingleExpense);
  const deleteAllExpense = useMutation(api.expenses.deleteAllExpense);
  const deleteAllDays = useMutation(api.workdays.deleteAllDays);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      // toast.error('يجب تسجيل الدخول أولاً', {
      //   style: { color: "red" },
      // });
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (getAllExpenses) {
      setExpenses(getAllExpenses);
    }
    if (getAllDays) {
      setWorkdays(getAllDays);
    }
  }, [getAllExpenses, getAllDays]);

  const handleArchiveAccount = async () => {
    if (!user?._id) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    setIsLoading(true);
    try {
      await archiveExpenses({ userId: user._id });
      await archiveDays({ userId: user._id });
      toast.success('تم ارشفة جميع السجلات بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في أرشفة السجلات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreWorkday = async (id: string) => {
    if (!user?._id) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      await unarchiveASingleDay({ id, userId: user._id });
      toast.success('تم استعادة يوم العمل بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في استعادة يوم العمل');
    }
  };

  const handleRestoreExpense = async (id: string) => {

    if (!user?._id) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      await UnarchiveASingleExpense({ id });
      toast.success('تم استعادة المصروف بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في استعادة المصروف');
    }
  };

  const handleClearAllData = async () => {
    if (!user?._id) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    setIsLoading(true);
    try {
      await deleteAllDays({ userId: user._id });
      await deleteAllExpense({ userId: user._id });
      toast.success('تم حذف جميع البيانات بنجاح');
    } catch (error) {
      toast.error('حدث خطأ في حذف البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter active and archived records
  const activeWorkdays = workdays.filter(day => !day.archived);
  const activeExpenses = expenses.filter(expense => !expense.archived);
  const archivedWorkdays = workdays.filter(day => day.archived);
  const archivedExpenses = expenses.filter(expense => expense.archived);
  const remainingBalance = calculateRemainingBalance(workdays, expenses);

  if (authLoading) {
    return <div className='flex items-center justify-center h-screen'><Spinner /></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Auth Link */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">لوحة التحكم</h1>
          <Button onClick={logout} variant='outline' className="flex items-center gap-2 hover:bg-red-500">
            تسجيل الخروج
          </Button>
        </div>

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

              {/* Clear All Data Button */}
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
                  <AlertDialogHeader>
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
      </div>
    </div>
  );
};

export default Index;
