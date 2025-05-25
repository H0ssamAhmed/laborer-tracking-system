
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isSignUp = searchParams.get('signup') !== null;
  const isSignIn = !isSignUp;

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

  const toggleForm = () => {
    if (isSignUp) {
      setSearchParams({});
    } else {
      setSearchParams({ signup: '' });
    }
    // Reset form when switching
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">نظام متابعة الأجور</h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول إلى حسابك'}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}
            </CardTitle>
          </CardHeader>
          <CardContent>
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

              {/* Confirm Password Field - Only for Sign Up */}
              {isSignUp && (
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
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                {isSignUp ? 'إنشاء الحساب' : 'تسجيل الدخول'}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Toggle Between Forms */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
              </p>
              <Button
                type="button"
                variant="link"
                onClick={toggleForm}
                className="text-primary hover:text-primary/80"
              >
                {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </Button>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-4">
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
