"use client";
import React from 'react';
import { Search, Calendar, CreditCard, Key, CheckCircle, MapPin } from 'lucide-react';

const BookingProcess = () => {
    const steps = [
        {
            number: "01",
            icon: <Search size={32} />,
            title: "Choose Your Location",
            description: "Select your pickup city and browse our wide range of available vehicles"
        },
        {
            number: "02",
            icon: <Calendar size={32} />,
            title: "Pick Date & Time",
            description: "Choose your rental dates and times that fit your schedule perfectly"
        },
        {
            number: "03",
            icon: <MapPin size={32} />,
            title: "Select Your Car",
            description: "Browse through our fleet and select the perfect car for your journey"
        },
        {
            number: "04",
            icon: <CreditCard size={32} />,
            title: "Complete Payment",
            description: "Make secure payment online and get instant booking confirmation"
        },
        {
            number: "05",
            icon: <Key size={32} />,
            title: "Pick Up & Drive",
            description: "Collect your car and hit the road with unlimited kilometers"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-300/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <CheckCircle className="text-yellow-400" size={18} />
                        <span className="text-yellow-400 font-semibold text-xs uppercase tracking-wide">
                            Simple & Quick
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-3xl font-black text-white mb-4">
                        HOW IT WORKS
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                        Book your dream car in just 5 simple steps and start your journey
                    </p>
                </div>

                {/* Steps - Desktop View */}
                <div className="hidden lg:block">
                    <div className="relative">
                        {/* Connection Line */}
                        <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>

                        <div className="grid grid-cols-5 gap-6">
                            {steps.map((step, index) => (
                                <div key={index} className="relative">
                                    {/* Step Card */}
                                    <div className="text-center group">
                                        {/* Icon Circle */}
                                        <div className="relative mx-auto mb-6">
                                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                                                <div className="text-gray-900">
                                                    {step.icon}
                                                </div>
                                            </div>
                                            {/* Step Number */}
                                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gray-900 border-4 border-yellow-400 flex items-center justify-center z-20">
                                                <span className="text-yellow-400 font-black text-sm">{step.number}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:bg-white/10">
                                            <h3 className="text-lg font-bold text-white mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400 text-xs leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Steps - Mobile/Tablet View */}
                <div className="lg:hidden space-y-6">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="absolute left-10 top-24 w-1 h-full bg-gradient-to-b from-yellow-400/30 to-transparent"></div>
                            )}

                            <div className="flex gap-4 md:gap-6 items-start relative z-10">
                                {/* Icon Circle */}
                                <div className="relative shrink-0">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-xl">
                                        <div className="text-gray-900">
                                            {React.cloneElement(step.icon, { size: 28 })}
                                        </div>
                                    </div>
                                    {/* Step Number */}
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gray-900 border-4 border-yellow-400 flex items-center justify-center">
                                        <span className="text-yellow-400 font-black text-sm">{step.number}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-white/10">
                                    <h3 className="text-base md:text-lg font-bold text-white mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12 md:mt-16">
                    <a
                        href="/cars"
                        className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base transition-all shadow-2xl hover:scale-105 group"
                    >
                        Start Booking Now
                        <CheckCircle className="group-hover:rotate-12 transition-transform" size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default BookingProcess;
