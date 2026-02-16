"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/users/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        toast.success("Login Successful!");

        // Store token and user data
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event('userLogin'));

        // Redirect to home
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        const errorMsg = response.data.errors?.[0]?.msg || response.data.message || 'Login failed';
        toast.error(errorMsg);
      }

    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-yellow-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-yellow-50 rounded-full blur-[80px] opacity-60"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <img src="/images/doorcars-logo.png" alt="DoorCars" className="h-12 w-auto mx-auto mb-2" />
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-gray-700 hover:text-yellow-600">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 shadow-lg shadow-yellow-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : (
              <span className="flex items-center gap-2">
                Sign In <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-yellow-600 hover:text-yellow-700">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
