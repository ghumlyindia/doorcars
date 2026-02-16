import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fuel, Settings, Users, Gauge, Car, ArrowRight, Check } from 'lucide-react';

const CarCard = ({ car, startDate, endDate }) => {
    const router = useRouter();

    // State to track selected tier (default: tier_400 - popular)
    const [selectedTierId, setSelectedTierId] = useState('tier_400');

    // Check if calculated pricing exists (dates were provided)
    const hasCalculatedPricing = car.calculatedPricing && car.calculatedPricing.tiers;

    const handleViewDetails = () => {
        if (hasCalculatedPricing) {
            // Navigate with dates and selected tier
            const params = new URLSearchParams();
            if (startDate) params.set('startDate', startDate);
            if (endDate) params.set('endDate', endDate);
            params.set('tier', selectedTierId); // Pass selected tier

            router.push(`/cars/${car._id}?${params.toString()}`);
        } else {
            // Navigate to single car page (browse mode - no dates)
            router.push(`/cars/${car._id}`);
        }
    };

    return (
        <div className="flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100">
            {/* Car Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                    src={car.thumbnail || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80"}
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
                <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                    {car.model} {car.variant || ''}
                </h3>

                {/* Car Details Grid - 6 items */}
                <div className="grid grid-cols-3 gap-3 mb-5 capitalize">
                    {/* Transmission */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Settings size={16} className="text-gray-400" />
                        <span className="text-xs">{car.transmission}</span>
                    </div>

                    {/* Mileage */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Gauge size={16} className="text-gray-400" />
                        <span className="text-xs">{car.mileage || 'N/A'} km/l</span>
                    </div>

                    {/* Fuel */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <Fuel size={16} className="text-gray-400" />
                        <span className="text-xs">{car.fuelType}</span>
                    </div>

                    {/* Category */}
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

                {/* Pricing Section */}
                <div className="pt-4 border-t border-gray-100">
                    {hasCalculatedPricing ? (
                        /* Date-Based Pricing - Selectable Boxes */
                        <div className="space-y-3">
                            {/* Duration Display */}
                            <div className="bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                                <p className="text-xs text-yellow-700 font-semibold">
                                    Duration: {car.calculatedPricing.duration.days} Days {parseFloat(car.calculatedPricing.duration.hours) > 0 ? `${Math.round(parseFloat(car.calculatedPricing.duration.hours))} Hours` : ''}
                                </p>
                            </div>

                            {/* Selectable Pricing Boxes - 3 columns */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                {/* 200km Tier */}
                                <button
                                    onClick={() => setSelectedTierId('tier_200')}
                                    className={`rounded-lg p-2 border-2 transition-all ${selectedTierId === 'tier_200'
                                        ? 'border-gray-600 bg-gray-100 ring-2 ring-gray-400'
                                        : 'border-gray-200 bg-gray-50 hover:border-gray-400'
                                        }`}
                                >
                                    <div className="text-[10px] text-gray-600 font-bold uppercase mb-1">200KM</div>
                                    <div className="text-sm font-bold text-gray-900">₹{car.calculatedPricing.tiers?.limit200?.price}</div>
                                    <div className="text-[9px] text-gray-500 mt-0.5">{car.calculatedPricing.tiers?.limit200?.includedKm} km included</div>
                                    {selectedTierId === 'tier_200' && (
                                        <div className="mt-1"><Check size={12} className="mx-auto text-gray-700" /></div>
                                    )}
                                </button>

                                {/* 400km Tier - Popular */}
                                <button
                                    onClick={() => setSelectedTierId('tier_400')}
                                    className={`rounded-lg p-2 border-2 relative transition-all ${selectedTierId === 'tier_400'
                                        ? 'border-blue-600 bg-blue-100 ring-2 ring-blue-400'
                                        : 'border-blue-300 bg-blue-50 hover:border-blue-500'
                                        }`}
                                >
                                    <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                                        POPULAR
                                    </div>
                                    <div className="text-[10px] text-blue-700 font-bold uppercase mb-1">400KM</div>
                                    <div className="text-sm font-bold text-blue-900">₹{car.calculatedPricing.tiers?.limit400?.price}</div>
                                    <div className="text-[9px] text-blue-600 mt-0.5">{car.calculatedPricing.tiers?.limit400?.includedKm} km</div>
                                    {selectedTierId === 'tier_400' && (
                                        <div className="mt-1"><Check size={12} className="mx-auto text-blue-700" /></div>
                                    )}
                                </button>

                                {/* 1000km Tier */}
                                <button
                                    onClick={() => setSelectedTierId('tier_1000')}
                                    className={`rounded-lg p-2 border-2 transition-all ${selectedTierId === 'tier_1000'
                                        ? 'border-yellow-600 bg-yellow-100 ring-2 ring-yellow-400'
                                        : 'border-yellow-200 bg-yellow-50 hover:border-yellow-400'
                                        }`}
                                >
                                    <div className="text-[10px] text-yellow-700 font-bold uppercase mb-1">1000KM</div>
                                    <div className="text-sm font-bold text-yellow-900">₹{car.calculatedPricing.tiers?.limit1000?.price}</div>
                                    <div className="text-[9px] text-yellow-600 mt-0.5">{car.calculatedPricing.tiers?.limit1000?.includedKm} km</div>
                                    {selectedTierId === 'tier_1000' && (
                                        <div className="mt-1"><Check size={12} className="mx-auto text-yellow-700" /></div>
                                    )}
                                </button>
                            </div>

                            {/* View Details Button */}
                            <button
                                onClick={handleViewDetails}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                View Details
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ) : (
                        /* Browse Mode - Static Per-Day Rates */
                        <>
                            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                <div className="bg-gray-50 rounded-lg p-2 border border-blue-100">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">200km</div>
                                    <div className="text-sm font-bold text-gray-900">₹{car.pricing?.perDay}</div>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-bl-full"></div>
                                    <div className="text-[10px] text-blue-600 font-bold uppercase">400km</div>
                                    <div className="text-sm font-bold text-blue-900">₹{Math.round(car.pricing?.perDay * 1.5)}</div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                                    <div className="text-[10px] text-yellow-600 font-bold uppercase">1000km</div>
                                    <div className="text-sm font-bold text-yellow-900">₹{Math.round(car.pricing?.perDay * 2.25)}</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-gray-400">Base Rate</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-gray-900">
                                            ₹{car.pricing?.perDay || '0'}
                                        </span>
                                        <span className="text-gray-500 text-sm">/ Day</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleViewDetails}
                                    className="px-5 py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold transition-all shadow-lg group flex items-center gap-2"
                                >
                                    View Details
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CarCard;
