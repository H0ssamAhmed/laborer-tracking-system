import React, { SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, Trash2 } from 'lucide-react';
import { Workday, formatCurrency, formatDateWithHijri } from '../utils/calculations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '@/lib/auth-context';
import { ConvexError } from 'convex/values';

interface WorkdaysListProps {
  workdays: Workday[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkdaysList: React.FC<WorkdaysListProps> = ({ workdays, setIsLoading }) => {
  const { user } = useAuth();
  const deleteDay = useMutation(api.workdays.deleteDay);
  const archiveDay = useMutation(api.workdays.archiveSingleDay);

  if (!user) {
    return null;
  }

  if (workdays.length === 0) {
    return null;
  }

  const handleDeleteWorkday = async (id: string) => {
    if (!user?._id) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    setIsLoading(true);
    try {
      await deleteDay({ id, userId: user._id });
      toast.success('تم حذف يوم العمل بنجاح');
    } catch (error) {
      console.error('Error deleting workday:', error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message);
      } else {
        toast.error('حدث خطأ في حذف يوم العمل');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveWorkday = async (id: string) => {
    if (!user?._id) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      await archiveDay({ id, userId: user._id });
      toast.success('تم أرشفة يوم العمل بنجاح');
    } catch (error) {
      console.error('Error archiving workday:', error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message);
      } else {
        toast.error('حدث خطأ في أرشفة يوم العمل');
      }
    }
  };

  // Sort workdays by date (most recent first)
  const sortedWorkdays = [...workdays].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl text-primary">أيام العمل</CardTitle>
      </CardHeader>
      <CardContent className='text-start'>
        <ScrollArea dir='rtl' className="h-[300px] pr-4">
          <div className="space-y-2">
            {sortedWorkdays.map((workday) => (
              <div
                key={workday._id}
                className="flex items-center justify-between bg-secondary/20 p-3 rounded-md"
              >
                <div>
                  <p className="font-medium">{formatDateWithHijri(workday.date)}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(workday.dayRate)}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleArchiveWorkday(workday._id)}
                    className="text-green-600 hover:text-green-800 hover:bg-green-100"
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteWorkday(workday._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WorkdaysList;
