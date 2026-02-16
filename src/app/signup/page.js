"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';

const SignupPage = () => {
  const router = useRouter();
  const [step, setStep] = useState('register'); // register, otp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setStep('otp');
      } else {
        const errorMsg = response.data.errors?.[0]?.msg || response.data.message || 'Registration failed';
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/users/verify-email', {
        email: formData.email,
        otp: otp
      });

      if (response.data.success) {
        toast.success("Account verified successfully! Logging you in...");

        // Store token and user data
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event('userLogin'));

        // Redirect to home or dashboard
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        const errorMsg = response.data.errors?.[0]?.msg || response.data.message || 'Verification failed';
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Invalid OTP. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await api.post('/users/resend-otp', { email: formData.email });
      if (response.data.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-yellow-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-yellow-50 rounded-full blur-[80px] opacity-60"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative z-10 transition-all duration-500">

        {step === 'register' ? (
          <>
            <div className="text-center">
              <Link href="/" className="inline-block">
                <img src="/images/doorcars-logo.png" alt="DoorCars" className="h-12 w-auto mx-auto mb-2" />
              </Link>
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create Account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Join DoorCars and start driving today
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleRegister}>
              {/* Form Fields */}
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                  <input name="name" type="text" required placeholder="Full Name" value={formData.name} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                </div>
                <div className="relative">
                  <Mail className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                  <input name="email" type="email" required placeholder="Email Address" value={formData.email} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                </div>
                <div className="relative">
                  <Phone className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                  <input name="phone" type="tel" required placeholder="Phone Number" value={formData.phone} onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                </div>
                <div className="relative">
                  <Lock className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                  <input name="password" type={showPassword ? "text" : "password"} required placeholder="Password" value={formData.password} onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-3.5 right-3 text-gray-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                  <input name="confirmPassword" type={showPassword ? "text" : "password"} required placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-gray-900 bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-500/30 transition-all active:scale-95 disabled:opacity-70">
                {loading ? 'Creating Account...' : <span className="flex items-center gap-2">Create Account <ArrowRight size={18} /></span>}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-yellow-600 hover:text-yellow-700">Sign in instead</Link>
              </p>
            </div>
          </>
        ) : (
          /* OTP Verification Step */
          <div className="animate-fade-in-right">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                <ShieldCheck className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent a 6-digit code to <br /> <span className="font-medium text-gray-900">{formData.email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Enter OTP Code</label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="block w-full text-center text-3xl font-bold tracking-[0.5em] py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none transition-all"
                  placeholder="000000"
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-gray-900 bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-500/30 transition-all active:scale-95 disabled:opacity-70">
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button type="button" onClick={handleResendOtp} className="font-semibold text-yellow-600 hover:text-yellow-700">
                  Resend OTP
                </button>
              </p>
              <button onClick={() => setStep('register')} className="mt-4 text-xs text-gray-400 hover:text-gray-600">
                Change Email Address
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SignupPage;
