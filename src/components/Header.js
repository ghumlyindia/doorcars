"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut, ChevronDown, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for user in localStorage on mount
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        checkUser();

        // Listen for custom login event
        const handleLoginEvent = () => {
            checkUser();
        };

        window.addEventListener('userLogin', handleLoginEvent);
        window.addEventListener('storage', checkUser);

        return () => {
            window.removeEventListener('userLogin', handleLoginEvent);
            window.removeEventListener('storage', checkUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setDropdownOpen(false);
        router.push('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 py-3 md:py-6">
            <div className="container mx-auto px-4">
                <div className="bg-white/95 backdrop-blur-md rounded-full shadow-xl px-6 py-3 flex justify-between items-center border border-white/20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img
                            src="/images/doorcars-logo.png"
                            alt="DoorCars"
                            className="h-10 w-auto"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-gray-700 hover:text-[#FDB714] font-medium transition-colors duration-200">
                            Home
                        </Link>
                        <Link href="/cars" className="text-gray-700 hover:text-[#FDB714] font-medium transition-colors duration-200">
                            Cars
                        </Link>
                        <Link href="/how-it-works" className="text-gray-700 hover:text-[#FDB714] font-medium transition-colors duration-200">
                            How it works
                        </Link>
                    </nav>

                    {/* Right Side - Cart & User */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Cart Icon with Badge */}

                        {user ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setDropdownOpen(true)}
                                onMouseLeave={() => setDropdownOpen(false)}
                            >
                                <button
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-full transition-all duration-200"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold shadow-md">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-gray-700 font-medium">{user.name.split(' ')[0]}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 transition-all duration-200 origin-top ${dropdownOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                                        }`}
                                >

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-gray-900 transition-all duration-200 group"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-all duration-200">
                                                <User size={18} className="text-gray-900" />
                                            </div>
                                            <div>
                                                <p className="font-medium">My Profile</p>
                                                <p className="text-xs text-gray-500">View and edit profile</p>
                                            </div>
                                        </Link>

                                        <Link
                                            href="/my-bookings"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-gray-900 transition-all duration-200 group"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-all duration-200">
                                                <Calendar size={18} className="text-gray-900" />
                                            </div>
                                            <div>
                                                <p className="font-medium">My Bookings</p>
                                                <p className="text-xs text-gray-500">View your bookings</p>
                                            </div>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                                        >
                                            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-all duration-200">
                                                <LogOut size={18} className="text-red-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium">Logout</p>
                                                <p className="text-xs text-gray-500">Sign out of account</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2.5 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                            >
                                <User size={18} />
                                Login / Signup
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="lg:hidden bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl mt-3 py-4 px-4 space-y-2 border border-white/20 animate-fade-in">
                        <Link
                            href="/"
                            className="block text-gray-700 hover:text-[#FDB714] hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/cars"
                            className="block text-gray-700 hover:text-[#FDB714] hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            Cars
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="block text-gray-700 hover:text-[#FDB714] hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                            onClick={() => setIsOpen(false)}
                        >
                            How it works
                        </Link>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                            {user ? (
                                <>
                                    <div className="px-4 py-3 mb-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-gray-900 font-bold shadow-md">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{user.name}</p>
                                                <p className="text-xs text-gray-600">{user.email || 'Logged in'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 text-gray-700 hover:bg-yellow-50 hover:text-gray-900 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="p-2 bg-yellow-50 rounded-lg">
                                            <User size={18} className="text-gray-900" />
                                        </div>
                                        My Profile
                                    </Link>

                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="flex items-center gap-3 text-red-600 hover:bg-red-50 font-medium w-full text-left py-3 px-4 rounded-xl transition-all duration-200"
                                    >
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <LogOut size={18} className="text-red-600" />
                                        </div>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-full hover:shadow-lg transition-all duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User size={18} />
                                    Login / Signup
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;