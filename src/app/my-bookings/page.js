"use client";
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ChevronRight, Car } from 'lucide-react';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const getBookingFilterStatus = (booking) => {
        if (booking.status === 'cancelled') return 'cancelled';
        const now = new Date();
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);

        if (end < now) return 'completed';
        if (start <= now && end >= now) return 'ongoing';
        if (start > now) return 'upcoming';
        return 'all';
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return getBookingFilterStatus(booking) === filter;
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings/my-bookings');
                if (response.data.success) {
                    setBookings(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
                toast.error("Failed to load your bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-yellow-50 pt-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 pt-32 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">My Bookings</h1>
                    <Link href="/cars" className="text-yellow-600 font-semibold hover:text-yellow-700 transition">
                        Book a new Car
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${filter === f
                                    ? 'bg-black text-yellow-400 shadow-md transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
                        <div className="bg-yellow-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <Car className="text-yellow-500 w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No {filter !== 'all' ? filter : ''} bookings found</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            {filter === 'all'
                                ? "You haven't made any bookings yet. Find your perfect ride today!"
                                : `You don't have any ${filter} bookings.`}
                        </p>
                        {filter === 'all' && (
                            <Link
                                href="/cars"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-full text-gray-900 bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-500/30 transition-all"
                            >
                                Explore Cars
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6">

                                    {/* Car Image (Thumbnail) */}
                                    <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                        {booking.car ? (
                                            <img
                                                src={booking.car.thumbnail || 'https://via.placeholder.com/300x200?text=Car'}
                                                alt={booking.car.model}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Car Unavailable</div>
                                        )}
                                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide border ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                    {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Unknown Car'}
                                                </h3>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <MapPin size={14} className="mr-1" />
                                                    {booking.address?.city || booking.car?.city || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:mt-0 text-left sm:text-right">
                                                <p className="text-sm text-gray-500">Total Amount</p>
                                                <p className="text-2xl font-black text-yellow-500">₹{booking.totalPrice}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 py-4 border-t border-gray-100">
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Start Trip</p>
                                                <div className="flex items-center text-gray-900 font-medium">
                                                    <Calendar size={16} className="text-yellow-500 mr-2" />
                                                    {formatDate(booking.startDate)}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">End Trip</p>
                                                <div className="flex items-center text-gray-900 font-medium">
                                                    <Calendar size={16} className="text-yellow-500 mr-2" />
                                                    {formatDate(booking.endDate)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs text-gray-400 font-mono">ID: {booking._id}</span>
                                    {/* Future: Add 'View Details' or 'Download Receipt' buttons here */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookingsPage;
