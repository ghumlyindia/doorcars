"use client";
import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, ChevronRight, Clock, X, ArrowRight, Car, Zap, Sparkles, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

const Hero = () => {
    const router = useRouter();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [step, setStep] = useState(1); // 1: City, 2: Dates
    const [city, setCity] = useState('');
    const [citySearch, setCitySearch] = useState('');

    // Split Date/Time State
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');

    const [cities, setCities] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get('/cars/cities');
                if (response.data.success) {
                    setCities(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch cities:", error);
            }
        };
        fetchCities();
    }, []);

    const filteredCities = cities.filter(c =>
        c.toLowerCase().includes(citySearch.toLowerCase())
    );

    const handleCitySelect = (selectedCity) => {
        setCity(selectedCity);
        setCitySearch('');
        setStep(2);
    };

    const handleSearch = () => {
        if (!city || !startDate || !startTime || !endDate || !endTime) {
            alert('Please fill all fields');
            return;
        }

        const startDateTime = `${startDate}T${startTime}`;
        const endDateTime = `${endDate}T${endTime}`;

        // Calculate duration in hours
        const start = new Date(startDateTime);
        const end = new Date(endDateTime);
        const durationInHours = (end - start) / (1000 * 60 * 60);

        // Check minimum 8 hours booking
        if (durationInHours < 8) {
            alert('Minimum booking duration is 8 hours. Please select a longer rental period.');
            return;
        }

        const params = new URLSearchParams();
        params.set('city', city);
        params.set('startDate', startDateTime);
        params.set('endDate', endDateTime);

        router.push(`/cars?${params.toString()}`);
        closePopup();
    };

    const openPopup = () => {
        setIsPopupOpen(true);
        setStep(1);
        setCity('');
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setCitySearch('');
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setStep(1);
    };

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Calculate duration between start and end date/time
    const calculateDuration = () => {
        if (!startDate || !startTime || !endDate || !endTime) {
            return null;
        }

        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        const durationMs = end - start;

        if (durationMs <= 0) {
            return null;
        }

        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hr${remainingHours > 1 ? 's' : ''}` : ''}`;
        } else if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min` : ''}`;
        } else {
            return `${minutes} min`;
        }
    };

    // Quick Duration Selection Logic
    const handleQuickDuration = (days) => {
        // If start date/time is not set, set it to current exact time
        let start = new Date();
        if (startDate && startTime) {
            start = new Date(`${startDate}T${startTime}`);
        } else {
            // Use current exact time, no rounding
            const offset = start.getTimezoneOffset() * 60000;
            const localStart = new Date(start.getTime() - offset);
            setStartDate(localStart.toISOString().slice(0, 10));
            setStartTime(localStart.toISOString().slice(11, 16));
        }



        const end = new Date(start);
        end.setDate(end.getDate() + days);

        // Format End Date
        const offset = end.getTimezoneOffset() * 60000;
        const localEnd = new Date(end.getTime() - offset);

        setEndDate(localEnd.toISOString().slice(0, 10));
        setEndTime(localEnd.toISOString().slice(11, 16));
    };

    return (
        <>
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen lg:min-h-[650px] flex items-center overflow-hidden pt-20 lg:pt-10">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Car Rental Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>

                    {/* Animated Yellow Accents */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-24 pb-12 lg:pt-32 lg:pb-20">
                    {/* Text Content */}
                    <div className="space-y-6 lg:space-y-8 animate-fade-in-up text-center lg:text-left">
                        <div className="inline-block">
                            <span className="bg-yellow-400/20 text-yellow-300 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs lg:text-sm font-semibold border border-yellow-400/30">
                                Premium Car Rentals
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight break-words">
                            Drive Your{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500">
                                Dream Car
                            </span>{' '}
                            Today
                        </h1>

                        <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
                            Premium self-drive car rentals with unlimited kilometers.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 lg:gap-4 pt-2 justify-center lg:justify-start">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-semibold text-xs lg:text-sm">Unlimited KM</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-semibold text-xs lg:text-sm">Easy Booking</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Search Card */}
                    <div className="relative animate-fade-in-right mt-8 lg:mt-0 w-full max-w-md mx-auto lg:max-w-md">
                        <div className="bg-gradient-to-br from-white via-gray-50 to-yellow-50 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl shadow-2xl border border-yellow-200/50 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shrink-0">
                                    <Search className="text-white" size={14} />
                                </div>
                                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800">Book Your Ride</h2>
                            </div>

                            {/* Main Search Input */}
                            <div
                                onClick={openPopup}
                                className="group cursor-pointer bg-white p-2.5 sm:p-3 rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300 shadow-md hover:shadow-xl"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1 overflow-hidden">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                            <MapPin className="text-yellow-600" size={14} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] sm:text-[10px] font-medium text-gray-500">Where to?</p>
                                            <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                                                {city || 'Select your city'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                        <ChevronRight className="text-white" size={12} />
                                    </div>
                                </div>
                            </div>

                            {/* Info Pills */}
                            <div className="mt-2 sm:mt-2.5 flex flex-wrap gap-1 sm:gap-1.5">
                                <div className="px-2 py-0.5 sm:py-1 bg-yellow-50 rounded-full text-[9px] sm:text-[10px] text-gray-700 border border-yellow-200 flex items-center gap-1">
                                    <Car size={9} className="text-yellow-600 shrink-0" />
                                    <span className="whitespace-nowrap">50+ Cars</span>
                                </div>
                                <div className="px-2 py-0.5 sm:py-1 bg-yellow-50 rounded-full text-[9px] sm:text-[10px] text-gray-700 border border-yellow-200 flex items-center gap-1">
                                    <Zap size={9} className="text-yellow-600 shrink-0" />
                                    <span className="whitespace-nowrap">Instant Booking</span>
                                </div>
                                <div className="px-2 py-0.5 sm:py-1 bg-yellow-50 rounded-full text-[9px] sm:text-[10px] text-gray-700 border border-yellow-200 flex items-center gap-1">
                                    <Sparkles size={9} className="text-yellow-600 shrink-0" />
                                    <span className="whitespace-nowrap">Best Prices</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Multi-Step Popup Modal */}
            {isPopupOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 animate-fade-in">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closePopup}
                    ></div>

                    {/* Modal */}
                    <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up h-[85vh] sm:h-auto flex flex-col sm:block">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 lg:p-4 text-white shrink-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base lg:text-lg font-bold">
                                        {step === 1 ? 'Select Your City' : 'Choose Dates & Time'}
                                    </h3>
                                    <p className="text-yellow-100 mt-0.5 text-xs lg:text-sm">
                                        {step === 1 ? 'Where would you like to pick up your car?' : 'When do you need the car?'}
                                    </p>
                                </div>
                                <button
                                    onClick={closePopup}
                                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                                >
                                    <X className="text-white" size={16} />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-2 lg:mt-3 flex gap-2">
                                <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'} transition-all`}></div>
                                <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'} transition-all`}></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 lg:p-5 overflow-y-auto flex-1">
                            {/* Step 1: City Selection */}
                            {step === 1 && (
                                <div className="space-y-3 lg:space-y-4 animate-fade-in h-full flex flex-col">
                                    <div className="relative shrink-0">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <Search className="text-gray-400" size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Type to search cities..."
                                            value={citySearch}
                                            onChange={(e) => setCitySearch(e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 lg:py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:bg-white outline-none text-sm lg:text-base transition-all"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="overflow-y-auto space-y-1.5 custom-scrollbar flex-1">
                                        {filteredCities.length > 0 ? (
                                            filteredCities.map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => handleCitySelect(c)}
                                                    className="w-full p-2.5 lg:p-3 bg-gray-50 hover:bg-yellow-50 rounded-lg text-left flex items-center justify-between group transition-all border-2 border-transparent hover:border-yellow-400"
                                                >
                                                    <div className="flex items-center gap-2 lg:gap-3">
                                                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-all">
                                                            <MapPin className="text-yellow-600" size={14} />
                                                        </div>
                                                        <span className="text-sm lg:text-base font-semibold text-gray-800 capitalize">{c}</span>
                                                    </div>
                                                    <ChevronRight className="text-gray-400 group-hover:text-yellow-500 transition-all" size={16} />
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <MapPin className="mx-auto mb-3 text-gray-300" size={36} />
                                                <p className="text-base font-medium">No cities found</p>
                                                <p className="text-xs mt-1">Try searching with a different term</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Date Selection */}
                            {step === 2 && (
                                <div className="space-y-3 lg:space-y-4 animate-fade-in flex flex-col h-full">
                                    {/* Selected City Display */}
                                    <div className="bg-yellow-50 p-2.5 rounded-lg border-2 border-yellow-200 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="text-yellow-600" size={16} />
                                            <div>
                                                <p className="text-[10px] lg:text-xs text-gray-600">Pickup Location</p>
                                                <p className="text-sm lg:text-base font-bold text-gray-800 capitalize">{city}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Durations */}
                                    <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
                                        {[1, 7, 30].map(days => (
                                            <button
                                                key={days}
                                                onClick={() => handleQuickDuration(days)}
                                                className="px-3 py-1.5 rounded-full border-2 border-yellow-400/30 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-semibold whitespace-nowrap transition-all"
                                            >
                                                +{days} Day{days > 1 ? 's' : ''}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Split Date Inputs */}
                                    <div className="grid gap-4 shrink-0">
                                        {/* Start Date/Time */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                                <Calendar className="text-yellow-500" size={14} />
                                                Start Date & Time
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full p-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:bg-white outline-none transition-all text-xs lg:text-sm"
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                                <input
                                                    type="time"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                    className="w-full p-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:bg-white outline-none transition-all text-xs lg:text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* End Date/Time */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                                <Clock className="text-yellow-500" size={14} />
                                                End Date & Time
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="w-full p-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:bg-white outline-none transition-all text-xs lg:text-sm"
                                                    min={startDate || new Date().toISOString().split('T')[0]}
                                                />
                                                <input
                                                    type="time"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                    className="w-full p-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:bg-white outline-none transition-all text-xs lg:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration Display */}
                                    {calculateDuration() && (
                                        <div className="mt-3 p-2.5 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                                            <div className="flex items-center gap-2 justify-center">
                                                <Clock className="text-yellow-600" size={14} />
                                                <p className="text-xs text-gray-500">
                                                    Duration: <span className="font-semibold text-yellow-700">{calculateDuration()}</span>
                                                </p>
                                            </div>
                                            {startDate && startTime && endDate && endTime && (
                                                (() => {
                                                    const start = new Date(`${startDate}T${startTime}`);
                                                    const end = new Date(`${endDate}T${endTime}`);
                                                    const durationInHours = (end - start) / (1000 * 60 * 60);
                                                    return durationInHours < 8 ? (
                                                        <p className="text-[10px] text-red-600 text-center mt-1">
                                                            ⚠️ Minimum 8 hours required
                                                        </p>
                                                    ) : null;
                                                })()
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-3 lg:p-4 flex items-center justify-between border-t border-gray-200 shrink-0 mb-safe-area pb-safe-area">
                            {step > 1 && (
                                <button
                                    onClick={goBack}
                                    className="px-3 lg:px-4 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-all flex items-center gap-1.5 text-xs lg:text-sm"
                                >
                                    <ChevronRight className="rotate-180" size={16} />
                                    Back
                                </button>
                            )}

                            {step === 2 && (
                                <button
                                    onClick={handleSearch}
                                    disabled={!startDate || !startTime || !endDate || !endTime}
                                    className="ml-auto px-4 lg:px-6 py-2 lg:py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center gap-1.5 group text-xs lg:text-sm"
                                >
                                    Find Cars
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )
            }

            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                
                .animate-slide-up {
                    animation: slideUp 0.4s ease-out;
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out;
                }
                
                .animate-fade-in-right {
                    animation: fadeInRight 0.8s ease-out;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #fbbf24;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #f59e0b;
                }

                .mb-safe-area {
                    margin-bottom: env(safe-area-inset-bottom);
                }

                .pb-safe-area {
                    padding-bottom: env(safe-area-inset-bottom);
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                }
            `}</style>
        </>
    );
};

export default Hero;