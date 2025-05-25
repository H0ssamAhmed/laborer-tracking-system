
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic would go here
    console.log('Form submitted:', formData);
  };

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
            <CardTitle className="text-2xl text-center">
              الدخول والتسجيل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} dir='rtl'>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="text-right"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="text-right"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full">
                    تسجيل الدخول
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="text-right"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">كلمة المرور</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="text-right"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="أعد إدخال كلمة المرور"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="text-right"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full">
                    إنشاء الحساب
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  العودة للصفحة الرئيسية
                </Button>
              </Link>
            </div>
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
