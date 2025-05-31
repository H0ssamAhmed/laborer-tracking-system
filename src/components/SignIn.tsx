import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const SignIn = () => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [signInFormData, setSignInFormData] = useState({
    usecode: '',
    password: '',
  });

  const handleInputSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError(null); // Clear any previous errors when user types
  };

  const validateForm = () => {
    if (!signInFormData.usecode.trim()) {
      setFormError('الرجاء إدخال رمز المستخدم');
      return false;
    }
    if (!signInFormData.password) {
      setFormError('الرجاء إدخال كلمة المرور');
      return false;
    }
    return true;
  };

  const handleSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await login(signInFormData.usecode, signInFormData.password);
    } catch (error) {
      // Error is already handled by the auth context
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmitSignIn} className="space-y-4">
      {formError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {formError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="usecode">رمز المستخدم</Label>
        <Input
          id="usecode"
          name="usecode"
          type="text"
          placeholder="أدخل رمز المستخدم"
          value={signInFormData.usecode}
          onChange={handleInputSignInChange}
          required
          className="text-right"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="أدخل كلمة المرور"
            value={signInFormData.password}
            onChange={handleInputSignInChange}
            required
            className="text-right pr-10"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </Button>
    </form>
  );
};

export default SignIn;