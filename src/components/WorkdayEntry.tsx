
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CalendarIcon, Loader, Plus } from 'lucide-react';
import { Workday, getCurrentDate, getDefaultDayRate, generateId } from '../utils/calculations';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface WorkdayEntryProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

}

const WorkdayEntry = ({ isLoading, setIsLoading }: WorkdayEntryProps) => {
  const [date, setDate] = useState(getCurrentDate());
  const [dayRate, setDayRate] = useState(getDefaultDayRate());
  const addDay = useMutation(api.workdays.addDay)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error('يرجى إدخال التاريخ');
      return;
    }
    setIsLoading(true);
    const newWorkday: Workday = {
      date,
      dayRate,
      archived: false,
    };
    addDay(newWorkday)
      .then((res) => toast.success('تم إضافة يوم عمل بنجاح'))
      .catch((err) => toast.error('حدث خطأ في إضافة يوم عمل'))
      .finally(() => setIsLoading(false));
    setDate(getCurrentDate());
  };

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
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? <><Loader className='animate-spin' /> جاري  التحميل</>
              : <><Plus className="ml-2 h-4 w-4" /> إضافة يوم عمل</>
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkdayEntry;
