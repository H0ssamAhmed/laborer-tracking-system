import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CalendarIcon, Loader, Plus } from 'lucide-react';
import { getCurrentDate } from '../utils/calculations';
import { useMutation } from 'convex/react';
import { api } from "../../convex/_generated/api";
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { ConvexError } from 'convex/values';

interface ExpenseEntryProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpenseEntry = ({ isLoading, setIsLoading }: ExpenseEntryProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(getCurrentDate());
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'payment'>('expense');
  const addExpense = useMutation(api.expenses.addExpense);
  const { user, isLoading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?._id) {
      toast.error('يجب تسجيل الدخول أولاً');
      navigate('/auth');
      return;
    }

    if (!date || amount <= 0) {
      toast.error('يرجى التحقق من التاريخ والمبلغ');
      return;
    }

    setIsLoading(true);

    try {
      const result = await addExpense({
        userId: user._id,
        date,
        amount,
        description: description || "",
        type,
        archived: false,
      });

      if (result) {
        toast.success(type === 'expense' ? 'تم إضافة المصروف بنجاح' : 'تم إضافة الدفعة المستلمة بنجاح');
        // Reset form
        setDate(getCurrentDate());
        setAmount(0);
        setDescription('');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message);
      } else {
        toast.error('حدث خطأ في إضافة المصروف');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Card className="mb-6" dir='rtl'>
        <CardContent className="flex justify-center items-center h-32">
          <Loader className="animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="mb-6" dir='rtl'>
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
            className="flex justify-center space-x-10 mb-4"
          >
            <div className="flex items-center space-x-1">
              <Label htmlFor="expense">مصروف</Label>
              <RadioGroupItem value="expense" id="expense" />
            </div>
            <div className="flex items-center space-x-1">
              <Label htmlFor="payment">دفعة مستلمة</Label>
              <RadioGroupItem value="payment" id="payment" />
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
                step="0.01"
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

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                جاري التحميل
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {type === 'expense' ? 'إضافة مصروف' : 'إضافة دفعة مستلمة'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseEntry;
