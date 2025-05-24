import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function DataSummarySkeleton() {
  return (
    <Card className="mb-6" dir="rtl">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl text-primary">ملخص الحساب</CardTitle>

      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">عدد أيام العمل:</span>
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">إجمالي الأرباح:</span>
            <Skeleton className="h-4 w-20" />
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between items-center">
            <span className="text-sm">إجمالي المصروفات:</span>
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">إجمالي المدفوعات المستلمة:</span>
            <Skeleton className="h-4 w-20" />
          </div>

          <Separator className="my-2" />
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold">إجمالي الدفعات والمصاريف </span>
            <Skeleton className="h-4 w-20" />

          </div>
          <Separator className="my-2" />

          <div className="flex justify-between items-center text-lg">
            <span className="font-bold">الرصيد المتبقي:</span>
            <Skeleton className="h-4 w-20" />

          </div>
        </div>
      </CardContent>
    </Card>
  );
}
