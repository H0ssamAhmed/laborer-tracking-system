
import React, { SetStateAction, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Workday, formatCurrency, formatDateWithHijri } from '../utils/calculations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface WorkdaysListProps {
  workdays: Workday[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkdaysList: React.FC<WorkdaysListProps> = ({ workdays, setIsLoading }) => {

  const deleteDay = useMutation(api.workdays.deleteDay);

  if (workdays.length === 0) {
    return null;
  }
  const handleDeleteWorkday = (id: string) => {
    setIsLoading(true);
    deleteDay({ id })
      .then((res) => toast.success('تم حذف يوم العمل بنجاح'))
      .catch((err) => toast.error('حدث خطأ في حذف يوم العمل'))
      .finally(() => setIsLoading(false));
  };
  // Sort workdays by date (most recent first)
  const sortedWorkdays = [...workdays].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  console.log(workdays);


  return (
    <Card className="mb-6" >
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl text-primary">أيام العمل</CardTitle>
      </CardHeader>
      <CardContent className='text-start'>
        <ScrollArea dir='rtl' className="h-[300px] pr-4">
          <div className="space-y-2 ">
            {sortedWorkdays.map((workday) => (
              <div
                key={workday._id}
                className="flex items-center justify-between bg-secondary/20 p-3 rounded-md"
              >
                <div>
                  <p className="font-medium">{formatDateWithHijri(workday.date)}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(workday.dayRate)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteWorkday(workday._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
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

export default WorkdaysList;
