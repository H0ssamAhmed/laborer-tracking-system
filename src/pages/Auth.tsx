import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import Spinner from '@/components/Spinner';
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>('signin');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login, signup, isLoading, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(code, password);
      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error) {
      toast.error('فشل تسجيل الدخول');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(code, password, name);
      toast.success('تم إنشاء الحساب بنجاح');
    } catch (error) {
      toast.error('فشل إنشاء الحساب');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

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
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} dir='rtl'>
              <TabsList className="grid w-full grid-cols-2 my-4">
                <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
                <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-4">
                <SignIn />
                {/* <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">البريد الإلكتروني</Label>
                    <Input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Spinner /> : 'تسجيل الدخول'}
                  </Button>
                </form> */}
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <SignUp />
                {/* <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">كلمة المرور</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Spinner /> : 'إنشاء حساب'}
                  </Button>
                </form> */}
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