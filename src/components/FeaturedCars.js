"use client";
import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import { Car, ChevronLeft, ChevronRight, ArrowRight, Settings, Fuel, Users, Gauge } from 'lucide-react';
import Link from 'next/link';

const FeaturedCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchFeaturedCars = async () => {
            try {
                const response = await api.get('/cars/featured');
                // Filter out cars with maintenance status
                const availableCars = response.data.data.filter(car =>
                    car.availability?.status !== 'maintenance'
                );
                setCars(availableCars);
            } catch (err) {
                console.error("Error fetching featured cars:", err);
                setError("Failed to load featured cars.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedCars();
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const targetScroll = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    if (loading) return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="flex items-start justify-between mb-8 md:mb-12">
                    <div>
                        <div className="h-4 w-40 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-10 w-80 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                    </div>
                </div>

                {/* Skeleton Cards */}
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="flex-shrink-0 w-[300px] md:w-[340px] bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
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
            </div>
        </section>
    );

    if (error) return (
        <div className="py-10 text-center text-red-500">
            {error}
        </div>
    );

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-8 md:mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Car className="text-yellow-500" size={16} />
                            <span className="text-yellow-600 font-semibold text-xs uppercase tracking-wide">
                                Checkout Our New Cars
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-3xl font-black text-gray-900">
                            EXPLORE MOST POPULAR CARS
                        </h2>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition-all shadow-lg hover:scale-110"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center justify-center transition-all shadow-lg hover:scale-110"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scrollable Cards */}
                {cars.length > 0 ? (
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {cars.map(car => (
                            <div
                                key={car._id}
                                className="flex-shrink-0 w-[300px] md:w-[340px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 snap-start border border-gray-100"
                            >
                                {/* Car Image */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <img
                                        src={car.thumbnail}
                                        alt={`${car.brand} ${car.model}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Brand Badge */}
                                    <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-lg font-bold text-sm shadow-lg">
                                        {car.brand}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">
                                    {/* Car Name */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 capitalize">
                                        {car.model} {car.variant || ''}
                                    </h3>

                                    {/* Car Details Grid */}
                                    <div className="grid grid-cols-3 gap-3 mb-5 capitalize">
                                        {/* Transmission */}
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Settings size={16} className="text-gray-400" />
                                            <span className="text-xs">{car.transmission}</span>
                                        </div>

                                        {/* Mileage/Range */}
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Gauge size={16} className="text-gray-400" />
                                            <span className="text-xs">{car.mileage} km/l</span>
                                        </div>

                                        {/* Fuel Type */}
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Fuel size={16} className="text-gray-400" />
                                            <span className="text-xs">{car.fuelType}</span>
                                        </div>

                                        {/* Category/Type */}
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Car size={16} className="text-gray-400" />
                                            <span className="text-xs">{car.category || 'Basic'}</span>
                                        </div>

                                        {/* Age Requirement */}
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-gray-400 text-xs">👤</span>
                                            <span className="text-xs">Age 25</span>
                                        </div>

                                        {/* Seats */}
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Users size={16} className="text-gray-400" />
                                            <span className="text-xs">{car.seats} Persons</span>
                                        </div>
                                    </div>

                                    {/* Price and Action */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <span className="text-xl font-black text-yellow-500">
                                                ${car.pricing?.perDay || '100'}
                                            </span>
                                            <span className="text-gray-600 text-xs">/ Day</span>
                                        </div>
                                        <Link
                                            href={`/cars/${car._id}`}
                                            className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center transition-all hover:scale-110 shadow-lg group"
                                        >
                                            <ArrowRight className="text-gray-900 group-hover:translate-x-1 transition-transform" size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No featured cars available at the moment.</p>
                )}

                {/* Mobile Navigation Hint */}
                <div className="md:hidden text-center mt-6 text-gray-400 text-sm">
                    ← Swipe to explore more →
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default FeaturedCars;
