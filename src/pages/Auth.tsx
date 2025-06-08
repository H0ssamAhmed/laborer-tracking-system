
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>('signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">نظام متابعة الأجور</h1>
          <p className="text-muted-foreground">
            مرحباً بك في نظام إدارة العمال
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            {activeTab === 'signin' ? <CardTitle className="text-2xl text-center">
              تسجيل الدخول
            </CardTitle> :
              <CardTitle className="text-2xl text-center">
                انشاء حساب
              </CardTitle>}
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} dir='rtl'>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4">
                <SignIn />
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <SignUp />
              </TabsContent>
            </Tabs>

          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>نظام آمن ومحمي لإدارة بيانات العمال</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
