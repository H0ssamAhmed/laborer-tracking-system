
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Workday, Expense, calculateTotalEarnings, calculateTotalExpenses, calculateTotalPayments, calculateRemainingBalance, formatCurrency } from '../utils/calculations';

interface DataSummaryProps {
  workdays: Workday[];
  expenses: Expense[];
}

const DataSummary: React.FC<DataSummaryProps> = ({ workdays, expenses }) => {
  const totalEarnings = calculateTotalEarnings(workdays);
  const totalExpenses = calculateTotalExpenses(expenses);
  const totalPayments = calculateTotalPayments(expenses);
  const remainingBalance = calculateRemainingBalance(workdays, expenses);
  
  const workdaysCount = workdays.length;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl text-primary">ملخص الحساب</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">عدد أيام العمل:</span>
            <span className="font-bold">{workdaysCount} أيام</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">إجمالي الأرباح:</span>
            <span className="font-bold text-green-700">{formatCurrency(totalEarnings)}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between items-center">
            <span className="text-sm">إجمالي المصروفات:</span>
            <span className="font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">إجمالي المدفوعات المستلمة:</span>
            <span className="font-bold text-blue-600">{formatCurrency(totalPayments)}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold">الرصيد المتبقي:</span>
            <span 
              className={`font-bold ${remainingBalance >= 0 ? 'text-green-700' : 'text-red-600'}`}
            >
              {formatCurrency(remainingBalance)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSummary;
