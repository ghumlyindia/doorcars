"use client";
import React, { useRef } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Globe, MapPin } from 'lucide-react';

const Testimonials = () => {
    const scrollContainerRef = useRef(null);

    const testimonials = [
        {
            name: "Raj Malhotra",
            location: "Mumbai, India",
            country: "🇮🇳 India",
            rating: 5,
            text: "Amazing service! I rented a car for my family trip to Goa. The booking process was seamless, and the car was in perfect condition. Unlimited kilometers made our journey stress-free.",
            trip: "Goa Road Trip"
        },
        {
            name: "Sarah Johnson",
            location: "California, USA",
            country: "🇺🇸 USA",
            rating: 5,
            text: "As a foreign tourist, I was worried about renting a car in India. But DoorCars made it so easy! Clean car, transparent pricing, and 24/7 support. Explored Rajasthan like a local.",
            trip: "Rajasthan Explorer"
        },
        {
            name: "Priya Sharma",
            location: "Delhi, India",
            country: "🇮🇳 India",
            rating: 5,
            text: "Booked a sedan for my business meetings across the city. Professional service, punctual delivery, and the car was spotless. The pricing is very competitive. Will definitely use again!",
            trip: "Business Travel"
        },
        {
            name: "David Miller",
            location: "London, UK",
            country: "🇬🇧 UK",
            rating: 5,
            text: "Incredible experience! Rented an SUV for my family's Kerala tour. The team was helpful with route suggestions and the car had GPS which was a lifesaver. India's beauty explored with comfort!",
            trip: "Kerala Backwaters"
        },
        {
            name: "Amita Patel",
            location: "Bangalore, India",
            country: "🇮🇳 India",
            rating: 5,
            text: "Fantastic service for weekend getaways! I've rented from DoorCars multiple times now. Always clean cars, easy pickup/drop-off, and no hidden charges. My go-to car rental service!",
            trip: "Weekend Trips"
        },
        {
            name: "Emma Watson",
            location: "Sydney, Australia",
            country: "🇦🇺 Australia",
            rating: 5,
            text: "Solo traveled across India with a DoorCars rental. The support team was available round the clock which gave me confidence. The car was fuel-efficient and comfortable for long drives.",
            trip: "Solo Adventure"
        }
    ];

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

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50 to-yellow-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-yellow-300/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8 md:mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="text-yellow-500" size={16} />
                            <span className="text-yellow-600 font-semibold text-xs uppercase tracking-wide">
                                Customer Stories
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-3xl font-black text-gray-900">
                            WHAT OUR CUSTOMERS SAY
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
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory mb-12"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[320px] md:w-[380px] snap-start relative pt-6"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-2 left-6 w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-10">
                                <Quote className="text-gray-900" size={22} fill="currentColor" />
                            </div>

                            {/* Card */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200">
                                {/* Card Content */}
                                <div className="p-6 pt-10">
                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                                        ))}
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-5 italic min-h-[100px]">
                                        "{testimonial.text}"
                                    </p>

                                    {/* Trip Badge */}
                                    <div className="bg-yellow-50 border-2 border-yellow-200 px-3 py-1.5 rounded-full inline-block mb-6">
                                        <span className="text-yellow-700 font-semibold text-xs">
                                            {testimonial.trip}
                                        </span>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="flex items-center gap-3 pt-4 border-t-2 border-gray-100">
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-gray-900 font-black text-lg shadow-lg shrink-0">
                                            {testimonial.name.charAt(0)}
                                        </div>

                                        {/* Name & Location */}
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900">
                                                {testimonial.name}
                                            </h4>
                                            <div className="flex items-center gap-1.5 text-gray-600 text-[10px] mt-0.5">
                                                <MapPin size={10} />
                                                <span>{testimonial.location}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-0.5">
                                                {testimonial.country}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Navigation Hint */}
                < div className="md:hidden text-center mb-8 text-gray-400 text-sm" >
                    ← Swipe to read more reviews →
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-black text-gray-900 mb-2">5000+</div>
                        <div className="text-gray-600 text-xs md:text-sm">Happy Customers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-black text-gray-900 mb-2">4.9/5</div>
                        <div className="text-gray-600 text-xs md:text-sm">Average Rating</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-black text-gray-900 mb-2">50+</div>
                        <div className="text-gray-600 text-xs md:text-sm">Cities Covered</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-black text-gray-900 mb-2">24/7</div>
                        <div className="text-gray-600 text-xs md:text-sm">Support Available</div>
                    </div>
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

export default Testimonials;
