import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

const SignUp = () => {
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [signUpFormData, setSignUpFormData] = useState({
    f_name: '',
    l_name: '',
    usecode: '',
    password: '',
  });

  const handleInputSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError(null); // Clear any previous errors when user types
  };

  const validateForm = () => {
    if (!signUpFormData.f_name.trim()) {
      toast.error('الرجاء إدخال الاسم الأول', { style: { color: "red" } });
      return false;
    }
    if (!signUpFormData.l_name.trim()) {
      setFormError('الرجاء إدخال الاسم الثاني');
      return false;
    }
    if (!signUpFormData.usecode.trim()) {
      setFormError('الرجاء إدخال رمز المستخدم');
      return false;
    }
    if (signUpFormData.password.length < 6) {
      setFormError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }
    return true;
  };

  const handleSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await signup(
        signUpFormData.f_name,
        signUpFormData.l_name,
        signUpFormData.usecode,
        signUpFormData.password
      );
    } catch (error) {
      // Error is already handled by the auth context
      console.error('Signup error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmitSignUp} className="space-y-4">
      {formError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {formError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="f_name">الاسم الاول</Label>
        <Input
          id="f_name"
          name="f_name"
          type="text"
          placeholder="أدخل الاسم الاول"
          value={signUpFormData.f_name}
          onChange={handleInputSignUpChange}
          required
          className="text-right"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="l_name">الاسم الثاني</Label>
        <Input
          id="l_name"
          name="l_name"
          type="text"
          placeholder="أدخل الاسم الثاني"
          value={signUpFormData.l_name}
          onChange={handleInputSignUpChange}
          required
          className="text-right"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="usecode">رمز المستخدم</Label>
        <Input
          id="usecode"
          name="usecode"
          type="text"
          placeholder="أدخل رمز المستخدم"
          value={signUpFormData.usecode}
          onChange={handleInputSignUpChange}
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
            value={signUpFormData.password}
            onChange={handleInputSignUpChange}
            required
            className="text-right pr-10"
            disabled={isLoading}
            minLength={6}
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
        {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
      </Button>
    </form>
  );
};

export default SignUp;