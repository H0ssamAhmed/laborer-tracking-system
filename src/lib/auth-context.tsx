import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api";
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { ConvexError } from 'convex/values';

export interface User {
  _id?: string;
  f_name: string;
  l_name: string;
  usecode: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (usecode: string, password: string) => Promise<void>;
  signup: (f_name: string, l_name: string, usecode: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const signUpUser = useMutation(api.user.signUp);
  const signInUser = useMutation(api.user.signIn);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        toast.success('تم تسجيل الدخول بنجاح', {
          description: <p className='flex items-center justify-start gap-4'>جاري تحويلك للصفحة الرئيسية <Loader className='animate-spin mx-auto' /></p>,
          icon: '🚀',
          style: { color: "green" },
        });
      }
    } catch (error) {
      console.error('Auth validation failed:', error);
      localStorage.removeItem('user_data');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (usecode: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await signInUser({ usecode, password });
      if (response) {
        const userData = { ...response };
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        toast.success('تم تسجيل الدخول بنجاح', {
          description: <p className='flex items-center justify-start gap-4'>جاري تحويلك للصفحة الرئيسية <Loader className='animate-spin mx-auto' /></p>,
          icon: '🚀',
          style: { color: "green" },
          duration: 1000
        });
        navigate('/dashboard');
      }
    } catch (error) {


      const errorMessage = error && 'حدث خطأ أثناء تسجيل الدخول ';
      toast.error(errorMessage, {
        description: <p className='flex items-center justify-start gap-4'>تأكد من صحة البيانات المدخلة</p>,
        style: { color: "red" }
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (f_name: string, l_name: string, usecode: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await signUpUser({ f_name, l_name, usecode, password });

      if ('message' in response && response.message === "user already exists") {
        toast.error("اسم او كود المستخدم موجود بالفعل", {
          style: { color: "red" }
        });
        return;
      }

      const userData = response as User;
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);

      toast.success('تم إنشاء الحساب بنجاح', {
        description: <p className='flex items-center justify-start gap-4'>جاري تحويلك للصفحة الرئيسية <Loader className='animate-spin mx-auto' /></p>,
        icon: '🚀',
        style: { color: "green" },
        duration: 1000
      });

      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error && 'حدث خطأ أثناء إنشاء الحساب';
      toast.error(errorMessage, { style: { color: "red" } });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('user_data');
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 