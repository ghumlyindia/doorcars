"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { loadRazorpay } from '@/utils/loadRazorpay';
import {
    Fuel, Settings, Users, Star, MapPin, Calendar, Gauge, Car, Clock,
    Check, Info, ChevronLeft, ChevronRight, Share2, Heart, Shield, Loader, AlertCircle
} from 'lucide-react';

const CarDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();

    // Get URL search params
    const [searchParams, setSearchParams] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setSearchParams(params);
        }
    }, []);

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Image Gallery State
    const [selectedImage, setSelectedImage] = useState(null);

    // Booking State
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');

    // Pricing State
    const [pricingTiers, setPricingTiers] = useState(null);
    const [selectedTier, setSelectedTier] = useState(null);
    const [calculating, setCalculating] = useState(false);

    // Pickup/Drop Location State
    const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);
    const [durationError, setDurationError] = useState('');
    const [selectedDropLocation, setSelectedDropLocation] = useState(null);

    // Fetch Car Details
    useEffect(() => {
        if (!id) return;

        const fetchCar = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/cars/${id}`);
                if (response.data.success) {
                    setCar(response.data.data);
                    // Set initial selected image
                    if (response.data.data.thumbnail) {
                        setSelectedImage(response.data.data.thumbnail);
                    } else if (response.data.data.images && response.data.data.images.length > 0) {
                        setSelectedImage(response.data.data.images[0].url);
                    }
                }
            } catch (err) {
                console.error("Error fetching car details:", err);
                setError(err.response?.data?.message || "Failed to load car details");
                toast.error("Car not found or unavailable");
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id]);

    // Populate booking fields from URL params (when coming from cars listing page)
    useEffect(() => {
        if (!searchParams || !car) return;

        const urlStartDate = searchParams.get('startDate');
        const urlEndDate = searchParams.get('endDate');
        const urlTier = searchParams.get('tier');

        if (urlStartDate) {
            const [date, time] = urlStartDate.split('T');
            setStartDate(date);
            setStartTime(time || '10:00');
        }

        if (urlEndDate) {
            const [date, time] = urlEndDate.split('T');
            setEndDate(date);
            setEndTime(time || '19:00');
        }

        // Note: selectedTier will be set after calculatePrice runs via the useEffect
    }, [searchParams, car]);

    // Validate duration (minimum 8 hours)
    useEffect(() => {
        if (!startDate || !startTime || !endDate || !endTime) {
            setDurationError('');
            return;
        }

        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        const hours = (end - start) / (1000 * 60 * 60);

        if (hours < 8) {
            setDurationError('Minimum rental duration is 8 hours');
        } else {
            setDurationError('');
        }
    }, [startDate, startTime, endDate, endTime]);

    // Calculate Price Effect
    useEffect(() => {
        if (startDate && startTime && endDate && endTime && car) {
            calculatePrice();
        } else {
            setPricingTiers(null);
            setSelectedTier(null);
        }
    }, [startDate, startTime, endDate, endTime, car]);

    const calculatePrice = async () => {
        // Check for validation errors first
        if (durationError) {
            toast.error(durationError);
            return;
        }
        const startDateTime = `${startDate}T${startTime}`;
        const endDateTime = `${endDate}T${endTime}`;

        if (new Date(startDateTime) >= new Date(endDateTime)) return;

        try {
            setCalculating(true);
            const response = await api.post('/cars/calculate-price', {
                carId: id,
                startDate: startDateTime,
                endDate: endDateTime
            });

            if (response.data.success) {
                const tiers = response.data.data.pricingTiers;
                setPricingTiers(tiers);

                // Check if tier was passed via URL (from cars page)
                const urlTier = searchParams?.get('tier');

                if (urlTier) {
                    // Find and select the tier passed from cars page
                    const tierMap = {
                        'tier_200': tiers.find(t => t.id === 'tier_200'),
                        'tier_400': tiers.find(t => t.id === 'tier_400'),
                        'tier_1000': tiers.find(t => t.id === 'tier_1000')
                    };
                    const selectedFromUrl = tierMap[urlTier];
                    setSelectedTier(selectedFromUrl || tiers.find(t => t.recommended) || tiers[1] || tiers[0]);
                } else {
                    // No URL tier, auto-select recommended or middle tier
                    const recommended = tiers.find(t => t.recommended);
                    setSelectedTier(recommended || tiers[1] || tiers[0]);
                }
            }
        } catch (err) {
            console.error("Price calculation error:", err);
        } finally {
            setCalculating(false);
        }
    };

    const [processingPayment, setProcessingPayment] = useState(false);

    const handleBookNow = async () => {
        if (!startDate || !startTime || !endDate || !endTime) {
            toast.error("Please select start and end dates with time");
            return;
        }

        if (!selectedTier) {
            toast.error("Please select a pricing plan");
            return;
        }

        // Validate pickup and drop locations
        if (car.pickupLocations && car.pickupLocations.length > 0) {
            if (!selectedPickupLocation) {
                toast.error("Please select a pickup location");
                return;
            }
            if (!selectedDropLocation) {
                toast.error("Please select a drop location");
                return;
            }
        }

        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user'); // Get user data to check bookings count

        if (!token) {
            toast.error("Please login to continue booking");
            router.push(`/login?redirect=/cars/${id}`);
            return;
        }

        // Parse user data for validation
        if (userData) {
            const user = JSON.parse(userData);
            const docs = user.documents || {};
            const hasUploadedDocs =
                docs.aadhaar?.frontImage && docs.aadhaar?.backImage &&
                docs.drivingLicense?.frontImage && docs.drivingLicense?.backImage;

            // 1st Booking Requirement: Must have uploaded documents
            if (user.totalBookings === 0 && !hasUploadedDocs) {
                toast.error("Please upload your documents (Aadhaar & DL) from your profile first.");
                router.push('/profile');
                return;
            }

            // 2nd+ Booking Requirement: Must have verified documents
            if (user.totalBookings > 0 && !user.isDocumentVerified) {
                toast.error("Your documents must be verified by admin for your second booking.");
                router.push('/profile');
                return;
            }
        }

        // Load Razorpay SDK
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            toast.error("Razorpay SDK failed to load. Check your internet connection.");
            return;
        }

        try {
            setProcessingPayment(true);

            // 1. Create Order
            const orderResponse = await api.post('/bookings/create-order', {
                carId: id,
                startDate: `${startDate}T${startTime}`,
                endDate: `${endDate}T${endTime}`,
                amount: selectedTier.finalPrice,
                tierId: selectedTier.id,
                planName: selectedTier.name,
                pickupLocation: selectedPickupLocation,  // Pass pickup location
                dropLocation: selectedDropLocation        // Pass drop location
            });

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message);
            }

            const { data: order, keyId } = orderResponse.data;

            // 2. Initialize Razorpay Payment
            const options = {
                key: keyId,
                amount: order.amount,
                currency: order.currency,
                name: "Door Cars",
                description: `Booking: ${car.brand} ${car.model} (${selectedTier.name})`,
                image: "https://doorcars.com/logo.png",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyResponse = await api.post('/bookings/verify-payment', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            bookingData: {
                                carId: id,
                                startDate: `${startDate}T${startTime}`,
                                endDate: `${endDate}T${endTime}`,
                                totalPrice: selectedTier.finalPrice,
                                address: car.city,
                                plan: {
                                    name: selectedTier.name,
                                    includedKm: selectedTier.includedKm,
                                    extraKmCharge: selectedTier.extraKmCharge
                                }
                            }
                        });

                        if (verifyResponse.data.success) {
                            toast.success("Booking Successful!");
                            router.push(`/booking/success?bookingId=${verifyResponse.data.bookingId}`);
                        } else {
                            toast.error(verifyResponse.data.message || "Payment verification failed");
                        }
                    } catch (error) {
                        console.error("Verification Error:", error);
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#FACC15"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Booking Error:", error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setProcessingPayment(false);
        }
    };

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `https://doorcarbn.onrender.com/${path.replace(/\\/g, '/')}`;
    };

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

    if (loading) return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-yellow-50 min-h-screen pt-32 py-8">
            <div className="container mx-auto px-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-100">
                            <div className="aspect-[16/9] bg-gray-200 rounded-xl animate-pulse mb-2"></div>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(n => (
                                    <div key={n} className="w-24 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="h-8 w-3/4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                            <div className="h-6 w-1/2 bg-gray-200 rounded mb-6 animate-pulse"></div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-100">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} className="p-3 rounded-xl bg-gray-50">
                                        <div className="h-6 w-6 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 space-y-3">
                                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border-2 border-yellow-200 p-6">
                            <div className="h-12 w-32 bg-gray-200 rounded mb-6 animate-pulse"></div>
                            <div className="space-y-4 mb-6">
                                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                            <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error || !car) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-yellow-50 p-4 pt-32">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Car Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The car you requested could not be found."}</p>
            <button
                onClick={() => router.push('/cars')}
                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full transition-all shadow-lg"
            >
                Browse All Cars
            </button>
        </div>
    );

    // Combine thumbnail and other images for gallery
    const allImages = [];
    if (car.thumbnail) allImages.push({ url: car.thumbnail, id: 'thumb' });
    if (car.images) allImages.push(...car.images);

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-yellow-50 min-h-screen pt-32 py-8">
            <div className="container mx-auto px-4">

                {/* Breadcrumb & Navigation */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ChevronLeft size={20} /> Back to Search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Images & Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Image Gallery */}
                        <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-100">
                            <div className="relative aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-2">
                                <img
                                    src={getImageUrl(selectedImage)}
                                    alt={`${car.brand} ${car.model}`}
                                    className="w-full h-full object-cover"
                                />
                                {/* Brand Badge */}
                                <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-lg font-bold text-sm shadow-lg">
                                    {car.brand}
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-yellow-400 hover:text-gray-900 transition-all">
                                        <Heart size={20} />
                                    </button>
                                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-yellow-400 hover:text-gray-900 transition-all">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={img.id || idx}
                                            onClick={() => setSelectedImage(img.url)}
                                            className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.url ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                        >
                                            <img
                                                src={getImageUrl(img.url)}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Car Info Header */}
                        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 border border-yellow-200">
                                            {car.category}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                                            {car.condition}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star size={16} fill="currentColor" />
                                            <span className="text-sm font-bold text-gray-700">{car.rating?.average || 'New'}</span>
                                            <span className="text-xs text-gray-400">({car.rating?.count || 0} reviews)</span>
                                        </div>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">{car.brand} {car.model}</h1>
                                    <p className="text-gray-600 text-lg">{car.variant} • {car.year} • {car.color}</p>
                                </div>
                            </div>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 py-6 border-t border-b border-gray-100">
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 border border-yellow-100 text-center">
                                    <Settings className="text-yellow-600 mb-2" size={22} />
                                    <span className="text-xs text-gray-600 uppercase font-semibold">Transmission</span>
                                    <span className="font-bold text-gray-900 capitalize text-sm">{car.transmission}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 border border-yellow-100 text-center">
                                    <Fuel className="text-yellow-600 mb-2" size={22} />
                                    <span className="text-xs text-gray-600 uppercase font-semibold">Fuel Type</span>
                                    <span className="font-bold text-gray-900 capitalize text-sm">{car.fuelType}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 border border-yellow-100 text-center">
                                    <Gauge className="text-yellow-600 mb-2" size={22} />
                                    <span className="text-xs text-gray-600 uppercase font-semibold">Mileage</span>
                                    <span className="font-bold text-gray-900 text-sm">{car.mileage} km/l</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 border border-yellow-100 text-center">
                                    <Users className="text-yellow-600 mb-2" size={22} />
                                    <span className="text-xs text-gray-600 uppercase font-semibold">Capacity</span>
                                    <span className="font-bold text-gray-900 text-sm">{car.seats} Seats</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 border border-yellow-100 text-center">
                                    <MapPin className="text-yellow-600 mb-2" size={22} />
                                    <span className="text-xs text-gray-600 uppercase font-semibold">Location</span>
                                    <span className="font-bold text-gray-900 text-sm">{car.city}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-yellow-50 border border-yellow-100 text-center">
                                    <Car className="text-yellow-600 mb-2" size={22} />
                                    <span className="text-xs text-gray-600 uppercase font-semibold">KM Driven</span>
                                    <span className="font-bold text-gray-900 text-sm">{car.kmDriven} km</span>
                                </div>
                            </div>

                            {/* Rental Terms */}
                            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Info className="text-yellow-600" size={20} />
                                    Rental Terms
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div className="flex gap-2">
                                        <span className="text-gray-600">Free KM per day:</span>
                                        <span className="font-bold text-gray-900">{car.pricing?.freeKmPerDay || 0} km</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-gray-600">Extra KM charge:</span>
                                        <span className="font-bold text-gray-900">₹{car.pricing?.extraKmCharge || 0}/km</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-gray-600">Security deposit:</span>
                                        <span className="font-bold text-gray-900">₹{car.securityDeposit || 0}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-gray-600">Minimum rental:</span>
                                        <span className="font-bold text-gray-900">{car.minimumRentalHours || 24} hours</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description & Features */}
                            <div className="mt-6 space-y-4">
                                <h3 className="text-lg font-bold text-gray-900">About this car</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {car.description || `Experience the thrill of driving this ${car.brand} ${car.model}. Perfect for city drives and weekend getaways. Maintained in ${car.condition} condition to ensure a smooth and safe journey.`}
                                </p>

                                <div className="pt-4">
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Included Features</h4>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        {(car.features?.length > 0 ? car.features : ['Bluetooth', 'Air Conditioning', 'Power Steering', 'Power Windows', 'Music System', 'Airbags']).map((feature, i) => (
                                            <div key={i} className="flex items-center text-gray-600 text-sm">
                                                <Check size={16} className="text-yellow-500 mr-2" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-200 p-6 sticky top-24">
                            <div className="mb-6">
                                <p className="text-gray-500 text-sm mb-1">Daily Rate</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-yellow-500">₹{car.pricing?.perDay}</span>
                                    <span className="text-gray-400">/ day</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Per hour: ₹{car.pricing?.perHour}</p>
                            </div>

                            {/* Date Selection */}
                            <div className="space-y-4 mb-6">
                                {/* Quick Selection Buttons */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Quick Selection</label>
                                    <div className="flex gap-2">
                                        {[1, 7, 30].map(days => (
                                            <button
                                                key={days}
                                                type="button"
                                                onClick={() => handleQuickDuration(days)}
                                                className="flex-1 px-3 py-2 rounded-lg border-2 border-yellow-400/30 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-semibold transition-all"
                                            >
                                                +{days} Day{days > 1 ? 's' : ''}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Start Date/Time */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                                        <Calendar className="text-yellow-500" size={16} />
                                        Trip Start
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="date"
                                            value={startDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm transition-all"
                                        />
                                        <input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm transition-all"
                                        />
                                    </div>
                                </div>

                                {/* End Date/Time */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                                        <Clock className="text-yellow-500" size={16} />
                                        Trip End
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="date"
                                            value={endDate}
                                            min={startDate || new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm transition-all"
                                        />
                                        <input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm transition-all"
                                        />
                                    </div>

                                    {/* Duration Error Display */}
                                    {durationError && (
                                        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                            <AlertCircle className="text-red-500" size={18} />
                                            <span className="text-sm text-red-600 font-semibold">{durationError}</span>
                                        </div>
                                    )}

                                    {/* Pickup & Drop Locations */}
                                    {car.pickupLocations && car.pickupLocations.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            <h4 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                                                <MapPin className="text-yellow-500" size={16} />
                                                Select Locations *
                                            </h4>

                                            {/* Pickup Location */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Pickup Location  <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={selectedPickupLocation || ''}
                                                    onChange={(e) => setSelectedPickupLocation(e.target.value)}
                                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm transition-all"
                                                >
                                                    <option value="">Select pickup location</option>
                                                    {car.pickupLocations.map((loc, idx) => (
                                                        <option key={idx} value={loc.name}>
                                                            {loc.name} - {loc.address}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Drop Location */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Drop Location <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={selectedDropLocation || ''}
                                                    onChange={(e) => setSelectedDropLocation(e.target.value)}
                                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm transition-all"
                                                >
                                                    <option value="">Select drop location</option>
                                                    {(car.dropLocations && car.dropLocations.length > 0 ? car.dropLocations : car.pickupLocations).map((loc, idx) => (
                                                        <option key={idx} value={loc.name}>
                                                            {loc.name} - {loc.address}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Breakdown & Tier Selection */}
                            {calculating ? (
                                <div className="py-8 text-center text-gray-500 text-sm animate-pulse">
                                    Calculating best rates...
                                </div>
                            ) : pricingTiers && pricingTiers.length > 0 ? (
                                <div className="space-y-4 mb-6">
                                    <label className="block text-xs font-bold text-gray-700 uppercase">Select Plan</label>
                                    <div className="space-y-3">
                                        {pricingTiers.map(tier => (
                                            <div
                                                key={tier.id}
                                                onClick={() => setSelectedTier(tier)}
                                                className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedTier?.id === tier.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 hover:border-yellow-200'}`}
                                            >
                                                {tier.recommended && (
                                                    <div className="absolute -top-2.5 right-4 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        POPULAR
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="font-bold text-gray-900">{tier.name}</h4>
                                                    <span className="font-bold text-lg">₹{tier.finalPrice}</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-600">
                                                    <span>{tier.includedKm} included</span>
                                                    <span>(₹{tier.price} + Tax)</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Selected Plan Summary */}
                                    {selectedTier && (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Base Price</span>
                                                <span>₹{selectedTier.price}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Taxes & Fees (5%)</span>
                                                <span>₹{selectedTier.finalPrice - selectedTier.price}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-2 mb-2">
                                                <span>Security Deposit</span>
                                                <span>₹{selectedTier.securityDeposit}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                                <span>Total Payable</span>
                                                <span className="text-yellow-500">₹{selectedTier.finalPrice}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-yellow-50 text-yellow-700 border-2 border-yellow-200 text-xs p-3 rounded-lg flex items-start gap-2 mb-6">
                                    <Info size={16} className="mt-0.5 flex-shrink-0" />
                                    <p>Select trip dates to see pricing plans.</p>
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                onClick={handleBookNow}
                                disabled={!selectedTier || calculating || processingPayment || durationError || (car.pickupLocations && car.pickupLocations.length > 0 && (!selectedPickupLocation || !selectedDropLocation))}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-yellow-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {processingPayment ? (
                                    <>
                                        <Loader className="animate-spin" size={20} /> Processing...
                                    </>
                                ) : (
                                    "Book Now"
                                )}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Shield size={14} />
                                <span>Secure Booking • Free Cancellation</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CarDetailsPage;
