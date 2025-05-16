
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Expense, formatCurrency } from '../utils/calculations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ExpensesListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, onDeleteExpense }) => {
  if (expenses.length === 0) {
    return null;
  }

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl text-primary">المصروفات والدفعات</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {sortedExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="flex items-center justify-between bg-secondary/20 p-3 rounded-md"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{new Date(expense.date).toLocaleDateString('ar-SA')}</p>
                    <Badge 
                      variant={expense.type === 'expense' ? 'destructive' : 'default'}
                      className={expense.type === 'expense' ? 'bg-red-500' : 'bg-blue-500'}
                    >
                      {expense.type === 'expense' ? 'مصروف' : 'دفعة مستلمة'}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold">
                    {formatCurrency(expense.amount)}
                  </p>
                  {expense.description && (
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {expense.description}
                    </p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDeleteExpense(expense.id)}
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
