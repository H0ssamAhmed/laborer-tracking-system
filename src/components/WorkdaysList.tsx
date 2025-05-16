
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Workday, formatCurrency } from '../utils/calculations';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WorkdaysListProps {
  workdays: Workday[];
  onDeleteWorkday: (id: string) => void;
}

const WorkdaysList: React.FC<WorkdaysListProps> = ({ workdays, onDeleteWorkday }) => {
  if (workdays.length === 0) {
    return null;
  }

  // Sort workdays by date (most recent first)
  const sortedWorkdays = [...workdays].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl text-primary">أيام العمل</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {sortedWorkdays.map((workday) => (
              <div 
                key={workday.id} 
                className="flex items-center justify-between bg-secondary/20 p-3 rounded-md"
              >
                <div>
                  <p className="font-medium">{new Date(workday.date).toLocaleDateString('ar-SA')}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(workday.dayRate)}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDeleteWorkday(workday.id)}
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
