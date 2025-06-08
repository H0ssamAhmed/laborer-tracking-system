import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from "../../convex/_generated/api";
import { toast } from 'sonner';

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
          icon: '🚀',
          style: { color: "green" },
        });
      }
      navigate('/dashboard');
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
      if (response.ok) {
        const userData = response.user as User;
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        toast.success('تم تسجيل الدخول بنجاح', {
          icon: '🚀',
          style: { color: "green" },
          duration: 1000
        });
        navigate('/dashboard');
        return
      }

      if (!response.ok) {
        toast.error(response.message, {
          icon: "❌",
          style: { color: "red" },
          duration: 4000
        });
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

      if (!response.ok) {
        toast.error(response.message, {
          icon: "❌",
          style: { color: "red" },
          duration: 4000
        });
        return;
      }

      const userData = response.user as User;
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);

      toast.success('تم إنشاء الحساب بنجاح', {
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
      toast.success('تم تسجيل الخروج بنجاح', {
        icon: '🚀',
        style: { color: "green" },
        duration: 1000
      })
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