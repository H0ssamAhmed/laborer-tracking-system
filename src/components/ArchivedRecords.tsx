
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Workday, Expense, formatCurrency, formatDateWithHijri } from '@/utils/calculations';
import { ArchiveRestore } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ArchivedRecordsProps {
  archivedWorkdays: Workday[];
  archivedExpenses: Expense[];
  onRestoreWorkday: (id: string) => void;
  onRestoreExpense: (id: string) => void;
}

const ArchivedRecords: React.FC<ArchivedRecordsProps> = ({
  archivedWorkdays,
  archivedExpenses,
  onRestoreWorkday,
  onRestoreExpense,
}) => {
  if (archivedWorkdays.length === 0 && archivedExpenses.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-xl text-primary">السجلات المؤرشفة</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          لا توجد سجلات مؤرشفة حالياً
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl text-primary">السجلات المؤرشفة</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workdays">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="workdays">أيام العمل ({archivedWorkdays.length})</TabsTrigger>
            <TabsTrigger value="expenses">المصروفات ({archivedExpenses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="workdays">
            {archivedWorkdays.length > 0 ? (
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {archivedWorkdays.map((workday) => (
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
                        onClick={() => onRestoreWorkday(workday._id)}
                        className="text-green-500 hover:text-green-700 hover:bg-green-100"
                      >
                        <ArchiveRestore className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center text-muted-foreground">لا توجد أيام عمل مؤرشفة</p>
            )}
          </TabsContent>

          <TabsContent value="expenses">
            {archivedExpenses.length > 0 ? (
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {archivedExpenses.map((expense) => (
                    <div
                      key={expense._id}
                      className="flex items-center justify-between bg-secondary/20 p-3 rounded-md"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{formatDateWithHijri(expense.date)}</p>
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
                        onClick={() => onRestoreExpense(expense._id)}
                        className="text-green-500 hover:text-green-700 hover:bg-green-100 mr-2"
                      >
                        <ArchiveRestore className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center text-muted-foreground">لا توجد مصروفات مؤرشفة</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ArchivedRecords;
