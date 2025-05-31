
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, Trash2 } from 'lucide-react';
import { Expense, formatCurrency, formatDateWithHijri } from '../utils/calculations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '../../convex/_generated/api';
import { cn } from '@/lib/utils';
interface ExpensesListProps {
  expenses: Expense[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, setIsLoading }) => {
  const deleteExpense = useMutation(api.expenses.deleteExpense);
  const archieveExpense = useMutation(api.expenses.archiveSingleExpense);
  if (expenses.length === 0) {
    return null;
  }
  const handleDeleteExpense = (id: string) => {
    setIsLoading(true);
    deleteExpense({ id })
      .then((res) => toast.success('تم حذف العنصر بنجاح'))
      .catch((err) => toast.error('حدث خطأ في حذف العنصر'))
      .finally(() => setIsLoading(false));
  };
  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleArchieveExpense = (id: string) => {
    archieveExpense({ id })
  }
  return (
    <Card className="mb-6" dir='rtl'>
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl text-primary">المصروفات والدفعات</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea dir='rtl' className="h-[300px] pr-4">
          <div className="space-y-2">
            {sortedExpenses.map((expense) => (
              <div
                key={expense._id}
                className="flex items-center justify-between bg-secondary/20 p-3 rounded-md"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{formatDateWithHijri(expense.date)}</p>
                  </div>
                  <div className="flex items-center justify-start py-2 gap-2">
                    <p className="text-sm font-bold">
                      {formatCurrency(expense.amount)}
                    </p>
                    <Badge
                      variant={expense.type === 'expense' ? 'destructive' : 'default'}
                      className={cn(expense.type === 'expense' ? 'bg-red-500' : 'bg-blue-500')}
                    >
                      {expense.type === 'expense' ? 'مصروف' : 'دفعة مستلمة'}
                    </Badge>
                  </div>
                  {expense.description && (
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {expense.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleArchieveExpense(expense._id)}
                  className="text-green-600 hover:text-green-800 hover:bg-green-100"
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteExpense(expense._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100 mr-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ExpensesList;
