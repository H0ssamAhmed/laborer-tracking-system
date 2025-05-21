
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CalendarIcon, Plus } from 'lucide-react';
import { Expense, getCurrentDate, generateId } from '../utils/calculations';
import { useMutation } from 'convex/react';
import { api } from "../../convex/_generated/api";


interface ExpenseEntryProps {
  onAddExpense: (expense: Expense) => void;
}

const ExpenseEntry = () => {
  const [date, setDate] = useState(getCurrentDate());
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'payment'>('expense');
  const AddExpense = useMutation(api.expenses.addExpense);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || amount <= 0) {
      toast.error('يرجى التحقق من التاريخ والمبلغ');
      return;
    }

    const newExpense: Expense = {
      // id: generateId(),
      date,
      amount,
      description,
      type,
      archived: false,
    };
    AddExpense(newExpense);

    setDate(getCurrentDate());
    setAmount(0);
    setDescription('');

    toast.success(type === 'expense'
      ? 'تم إضافة المصروف بنجاح'
      : 'تم إضافة الدفعة المستلمة بنجاح'
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl text-primary">
          إضافة مصروف / دفعة مستلمة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup
            value={type}
            onValueChange={(value) => setType(value as 'expense' | 'payment')}
            className="flex justify-center space-x-6 space-x-reverse mb-4"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="expense" id="expense" />
              <Label htmlFor="expense">مصروف</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="payment" id="payment" />
              <Label htmlFor="payment">دفعة مستلمة</Label>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expenseDate">التاريخ</Label>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 ml-2 text-muted-foreground" />
                <Input
                  id="expenseDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ (ريال)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف (اختياري)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'expense' ? 'وصف المصروف' : 'وصف الدفعة المستلمة'}
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="ml-2 h-4 w-4" />
            {type === 'expense' ? 'إضافة مصروف' : 'إضافة دفعة مستلمة'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseEntry;
