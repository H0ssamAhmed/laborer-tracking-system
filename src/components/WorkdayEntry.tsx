import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CalendarIcon, Loader, Plus } from 'lucide-react';
import { getCurrentDate, getDefaultDayRate } from '../utils/calculations';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { ConvexError } from 'convex/values';

interface WorkdayEntryProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkdayEntry = ({ isLoading, setIsLoading }: WorkdayEntryProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(getCurrentDate());
  const [dayRate, setDayRate] = useState(getDefaultDayRate());
  const addDay = useMutation(api.workdays.addDay);
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

    if (!date) {
      toast.error('يرجى إدخال التاريخ');
      return;
    }

    setIsLoading(true);

    try {
      const result = await addDay({
        userId: user._id,
        date,
        dayRate,
        archived: false,
      });

      if (result) {
        toast.success('تم إضافة يوم عمل بنجاح');
        // Reset form
        setDate(getCurrentDate());
        setDayRate(getDefaultDayRate());
      }
    } catch (error) {
      console.error('Error adding workday:', error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message);
      } else {
        toast.error('حدث خطأ في إضافة يوم عمل');
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
        <CardTitle className="text-center text-xl text-primary">إضافة يوم عمل</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 ml-2 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dayRate">أجر اليوم (ريال)</Label>
              <Input
                id="dayRate"
                type="number"
                value={dayRate}
                onChange={(e) => setDayRate(Number(e.target.value))}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                جاري التحميل
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                إضافة يوم عمل
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkdayEntry;
