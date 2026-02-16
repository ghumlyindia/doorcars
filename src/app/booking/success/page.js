"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Home, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import Confetti from 'react-confetti';

const BookingSuccessContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get('bookingId');
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    if (!bookingId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-500 mb-4">Invalid Booking Reference</p>
                <Link href="/" className="text-blue-600 hover:underline">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={200}
            />

            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

                <div className="mb-6 flex justify-center">
                    <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600 w-12 h-12" strokeWidth={3} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                <p className="text-gray-500 mb-8">
                    Your ride is ready. We've sent the details to your email.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Booking Reference</p>
                    <p className="text-lg font-mono font-bold text-gray-800 mb-4 break-all">{bookingId}</p>

                    <div className="flex gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                        <InfoIcon size={16} className="mt-0.5 flex-shrink-0" />
                        Please check your email for the full itinerary and pickup instructions.
                    </div>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/my-bookings"
                        className="block w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                    >
                        View My Bookings
                    </Link>

                    <Link
                        href="/"
                        className="block w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

const BookingSuccessPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        }>
            <BookingSuccessContent />
        </Suspense>
    );
};

const InfoIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
    </svg>
);

export default BookingSuccessPage;
