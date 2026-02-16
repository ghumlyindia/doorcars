"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import CarCard from '@/components/CarCard';
import { Filter, X, ChevronDown, Calendar, MapPin, Clock } from 'lucide-react';

const CarsPageContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Initial State from URL params
    const [filters, setFilters] = useState({
        city: searchParams.get('city') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        category: '',
        fuelType: '',
        transmission: '',
        minPrice: '',
        maxPrice: ''
    });

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false); // Mobile toggle
    const [cities, setCities] = useState([]);
    const [showDateBar, setShowDateBar] = useState(false); // Toggle date edit mode
    const [durationError, setDurationError] = useState(''); // Duration validation error

    // Fetch initial data (cities & cars)
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

    // Fetch Cars when filters change
    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            try {
                // Construct query string
                const params = new URLSearchParams();
                Object.keys(filters).forEach(key => {
                    if (filters[key]) params.append(key, filters[key]);
                });

                const response = await api.get(`/cars?${params.toString()}`);
                // Filter out cars with maintenance status
                const availableCars = response.data.data.filter(car =>
                    car.availability?.status !== 'maintenance'
                );
                setCars(availableCars);
            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchCars();
        }, 300); // 300ms debounce

        return () => clearTimeout(debounceTimer);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearDates = () => {
        // Clear date filters and update URL
        setFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
        const params = new URLSearchParams();
        if (filters.city) params.set('city', filters.city);
        router.push(`/cars?${params.toString()}`);
    };

    const handleApplyFilters = () => {
        // Update URL with current filters
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        router.push(`/cars?${params.toString()}`);
        setShowDateBar(false);
    };

    // Validate duration (minimum 8 hours)
    useEffect(() => {
        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            const diffMs = end - start;
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 8) {
                setDurationError('Minimum rental duration is 8 hours');
            } else {
                setDurationError('');
            }
        } else {
            setDurationError('');
        }
    }, [filters.startDate, filters.endDate]);

    // Quick Selectors
    const handleQuickSelect = (days) => {
        const now = new Date();
        const startDateTime = `${now.toISOString().split('T')[0]}T10:00`;

        const end = new Date(now);
        end.setDate(end.getDate() + days);
        const endDateTime = `${end.toISOString().split('T')[0]}T10:00`;

        setFilters(prev => ({
            ...prev,
            startDate: startDateTime,
            endDate: endDateTime
        }));
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-yellow-50 min-h-screen pt-32 py-8">
            <div className="container mx-auto px-4">

                {/* Header & Mobile Filter Toggle */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">BROWSE OUR <span className="text-yellow-500">FLEET</span></h1>
                    <button
                        className="md:hidden flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-full shadow-lg transition-all"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {/* Date & Location Search Bar - Conditional Block */}
                {(filters.startDate || filters.endDate || filters.city) && (
                    <div className="mb-6">
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-200 overflow-hidden">
                            {/* Compact View */}
                            <div className="p-4 flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-4 flex-wrap">
                                    {/* City */}
                                    {filters.city && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <MapPin size={16} className="text-yellow-600" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold">Location</p>
                                                <p className="text-sm font-bold text-gray-900 capitalize">{filters.city}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Dates */}
                                    {(filters.startDate || filters.endDate) && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                                            <Calendar size={16} className="text-blue-600" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold">Trip Duration</p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {filters.startDate && new Date(filters.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                    {filters.startDate && filters.endDate && ' - '}
                                                    {filters.endDate && new Date(filters.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowDateBar(!showDateBar)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all"
                                    >
                                        Modify
                                    </button>
                                    <button
                                        onClick={handleClearDates}
                                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                                    >
                                        <X size={14} /> Clear
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Edit Mode */}
                            {showDateBar && (
                                <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50 space-y-3 max-h-[60vh] overflow-y-auto">
                                    {/* Close Button for Mobile */}
                                    <div className="flex justify-between items-center md:hidden">
                                        <span className="text-xs font-bold text-gray-700 uppercase">Modify Search</span>
                                        <button
                                            onClick={() => setShowDateBar(false)}
                                            className="p-1 hover:bg-gray-200 rounded-lg transition-all"
                                        >
                                            <X size={20} className="text-gray-600" />
                                        </button>
                                    </div>
                                    {/* City Selection */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Location</label>
                                        <select
                                            value={filters.city}
                                            onChange={(e) => handleFilterChange('city', e.target.value)}
                                            className="w-full p-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-yellow-400 capitalize transition-all"
                                        >
                                            <option value="">All Cities</option>
                                            {cities.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date Inputs */}
                                    <div className="grid grid-cols-1 gap-3">
                                        {/* Start Date & Time */}
                                        <div>
                                            <label className="block text-[10px] md:text-xs font-semibold text-gray-700 uppercase mb-1 flex items-center gap-1">
                                                <Calendar size={14} className="text-yellow-500" /> Start Date & Time
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="date"
                                                    value={filters.startDate ? filters.startDate.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const time = filters.startDate ? filters.startDate.split('T')[1] : '10:00';
                                                        handleFilterChange('startDate', e.target.value ? `${e.target.value}T${time}` : '');
                                                    }}
                                                    className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-yellow-400 transition-all"
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                                <input
                                                    type="time"
                                                    value={filters.startDate ? filters.startDate.split('T')[1] || '10:00' : '10:00'}
                                                    onChange={(e) => {
                                                        const date = filters.startDate ? filters.startDate.split('T')[0] : new Date().toISOString().split('T')[0];
                                                        handleFilterChange('startDate', `${date}T${e.target.value}`);
                                                    }}
                                                    className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-yellow-400 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* End Date & Time */}
                                        <div>
                                            <label className="block text-[10px] md:text-xs font-semibold text-gray-700 uppercase mb-1 flex items-center gap-1">
                                                <Clock size={14} className="text-yellow-500" /> End Date & Time
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="date"
                                                    value={filters.endDate ? filters.endDate.split('T')[0] : ''}
                                                    onChange={(e) => {
                                                        const time = filters.endDate ? filters.endDate.split('T')[1] : '10:00';
                                                        handleFilterChange('endDate', e.target.value ? `${e.target.value}T${time}` : '');
                                                    }}
                                                    className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-yellow-400 transition-all"
                                                    min={filters.startDate ? filters.startDate.split('T')[0] : new Date().toISOString().split('T')[0]}
                                                />
                                                <input
                                                    type="time"
                                                    value={filters.endDate ? filters.endDate.split('T')[1] || '19:00' : '19:00'}
                                                    onChange={(e) => {
                                                        const date = filters.endDate ? filters.endDate.split('T')[0] : new Date().toISOString().split('T')[0];
                                                        handleFilterChange('endDate', `${date}T${e.target.value}`);
                                                    }}
                                                    className="w-full p-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-yellow-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Duration Error */}
                                    {durationError && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                            <X size={16} className="text-red-500" />
                                            <span className="text-sm text-red-600 font-semibold">{durationError}</span>
                                        </div>
                                    )}

                                    {/* Quick Selectors */}
                                    <div>
                                        <label className="block text-[10px] md:text-xs font-semibold text-gray-700 uppercase mb-1">Quick Select</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleQuickSelect(1)}
                                                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all border border-blue-200"
                                            >
                                                +1 Day
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleQuickSelect(7)}
                                                className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition-all border border-green-200"
                                            >
                                                +7 Days
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleQuickSelect(30)}
                                                className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-all border border-purple-200"
                                            >
                                                +30 Days
                                            </button>
                                        </div>
                                    </div>

                                    {/* Apply Button */}
                                    <button
                                        onClick={handleApplyFilters}
                                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 rounded-lg transition-all"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div
                    className="flex flex-col md:flex-row gap-8 transition-all duration-300"
                >

                    {/* Filters Sidebar */}
                    <aside className={`md:w-64 bg-white p-6 rounded-2xl shadow-lg border-2 border-yellow-200 h-fit ${showFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-xl text-gray-900">Filters</h2>
                            <button onClick={() => setFilters({ city: '', startDate: '', endDate: '', category: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '' })} className="text-xs text-yellow-600 hover:text-yellow-700 font-semibold">Clear All</button>
                        </div>

                        {/* City */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <select
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="w-full p-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 capitalize transition-all"
                            >
                                <option value="">All Cities</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Car Type</label>
                            <div className="space-y-2">
                                {['hatchback', 'sedan', 'suv', 'luxury'].map(type => (
                                    <label key={type} className="flex items-center gap-2 text-sm text-gray-600 capitalize cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === type}
                                            onChange={() => handleFilterChange('category', type)}
                                            className="text-yellow-500 focus:ring-yellow-400"
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Transmission */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                            <div className="space-y-2">
                                {['manual', 'automatic'].map(type => (
                                    <label key={type} className="flex items-center gap-2 text-sm text-gray-600 capitalize cursor-pointer">
                                        <input
                                            type="radio"
                                            name="transmission"
                                            checked={filters.transmission === type}
                                            onChange={() => handleFilterChange('transmission', type)}
                                            className="text-yellow-500 focus:ring-yellow-400"
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Fuel Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                            <div className="space-y-2">
                                {['petrol', 'diesel', 'electric'].map(type => (
                                    <label key={type} className="flex items-center gap-2 text-sm text-gray-600 capitalize cursor-pointer">
                                        <input
                                            type="radio"
                                            name="fuelType"
                                            checked={filters.fuelType === type}
                                            onChange={() => handleFilterChange('fuelType', type)}
                                            className="text-yellow-500 focus:ring-yellow-400"
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                    </aside>

                    {/* Car Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                                        {/* Image Skeleton */}
                                        <div className="aspect-[4/3] bg-gray-200 animate-pulse relative">
                                            <div className="absolute top-4 left-4 w-20 h-7 bg-gray-300 rounded-lg"></div>
                                        </div>

                                        {/* Content Skeleton */}
                                        <div className="p-5">
                                            <div className="h-6 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>

                                            {/* Details Grid Skeleton */}
                                            <div className="grid grid-cols-3 gap-3 mb-5">
                                                {[1, 2, 3, 4, 5, 6].map(i => (
                                                    <div key={i} className="h-5 bg-gray-200 rounded animate-pulse"></div>
                                                ))}
                                            </div>

                                            {/* Price and Button Skeleton */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : cars.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cars.map(car => (
                                    <CarCard
                                        key={car._id}
                                        car={car}
                                        startDate={filters.startDate}
                                        endDate={filters.endDate}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <Filter className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">No cars found</h3>
                                <p className="text-gray-500 mt-2">Try updating your filters to see more results.</p>
                                <button
                                    onClick={() => setFilters({ city: '', startDate: '', endDate: '', category: '', fuelType: '', transmission: '', minPrice: '', maxPrice: '' })}
                                    className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2.5 rounded-full transition-all"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

const CarsPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CarsPageContent />
        </Suspense>
    );
};

export default CarsPage;
