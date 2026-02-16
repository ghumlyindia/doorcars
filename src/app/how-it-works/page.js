"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import FAQ from '@/components/FAQ';
import {
    Search, Calendar, MapPin, CreditCard, Key,
    CheckCircle, Shield, Clock, HelpCircle, ChevronDown,
    ChevronUp, ArrowRight, Star
} from 'lucide-react';

const HowItWorksPage = () => {
    // Steps Data (Matching Home Page)
    const steps = [
        {
            number: "01",
            icon: <Search size={32} />,
            title: "Choose Your Location",
            description: "Select your pickup city and browse our wide range of available vehicles",
            color: "from-yellow-400 to-yellow-600"
        },
        {
            number: "02",
            icon: <Calendar size={32} />,
            title: "Pick Date & Time",
            description: "Choose your rental dates and times that fit your schedule perfectly",
            color: "from-blue-400 to-blue-600"
        },
        {
            number: "03",
            icon: <MapPin size={32} />,
            title: "Select Your Car",
            description: "Browse through our fleet and select the perfect car for your journey",
            color: "from-green-400 to-green-600"
        },
        {
            number: "04",
            icon: <CreditCard size={32} />,
            title: "Complete Payment",
            description: "Make secure payment online and get instant booking confirmation",
            color: "from-purple-400 to-purple-600"
        },
        {
            number: "05",
            icon: <Key size={32} />,
            title: "Pick Up & Drive",
            description: "Collect your car and hit the road with unlimited kilometers",
            color: "from-red-400 to-red-600"
        }
    ];

    // Benefits Data
    const benefits = [
        {
            icon: <Shield size={24} />,
            title: "Fully Insured Rides",
            description: "Drive with peace of mind knowing all our cars are comprehensively insured."
        },
        {
            icon: <Clock size={24} />,
            title: "24/7 Roadside Assistance",
            description: "Stuck somewhere? Our support team is available round the clock to help you."
        },
        {
            icon: <CheckCircle size={24} />,
            title: "No Hidden Charges",
            description: "What you see is what you pay. Prices include fuel, taxes, and insurance."
        },
        {
            icon: <Star size={24} />,
            title: "Well Maintained Fleet",
            description: "Regularly serviced and sanitized cars to ensure a smooth and safe journey."
        }
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* HER SECTIOON */}
            <section className="relative bg-black text-white pt-32 pb-20 overflow-hidden">
                {/* Background Patterns */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-400 opacity-5 rounded-l-full blur-3xl transform translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gray-800 opacity-20 rounded-r-full blur-3xl transform -translate-x-1/4"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20 mb-6">
                        <CheckCircle size={14} className="text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Simple . Fast . Secure</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                        Rent a Car in <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">5 Simple Steps</span>
                    </h1>
                    <p className="text-gray-400 text-base max-w-2xl mx-auto mb-10">
                        Experience the freedom of self-drive with Doorcars. No paperwork, no hassles—just you and the open road.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/cars" className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-xl shadow-yellow-400/20 flex items-center justify-center gap-2">
                            Target Your Car <ArrowRight size={20} />
                        </Link>
                        <a href="#steps" className="px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* STEPS SECTION */}
            <section id="steps" className="py-20 md:py-32 bg-gray-50 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">How It Works</h2>
                        <div className="h-1.5 w-20 bg-yellow-400 mx-auto rounded-full"></div>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
                            {steps.map((step, index) => (
                                <div key={index} className="group">
                                    <div className="relative flex flex-col items-center text-center">
                                        {/* Step Circle */}
                                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-xl mb-8 group-hover:scale-110 transition-transform duration-300 relative`}>
                                            <div className="z-10">{step.icon}</div>
                                            {/* Number Badge */}
                                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black border-2 border-white text-yellow-400 flex items-center justify-center font-bold text-xs shadow-md">
                                                {step.number}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">{step.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* BENEFITS SECTION */}
            <section className="py-20 bg-black text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-yellow-400 font-bold uppercase tracking-wider text-sm mb-2 block">Why Choose Doorcars</span>
                            <h2 className="text-2xl md:text-4xl font-black mb-6 leading-tight">
                                More Than Just a <br />
                                <span className="text-yellow-400">Car Rental</span>
                            </h2>
                            <p className="text-gray-400 text-base mb-8 leading-relaxed">
                                We prioritize your safety and comfort above all else. Every booking comes with our promise of quality and reliability.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {benefits.map((item, idx) => (
                                    <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="text-yellow-400 mb-4">{item.icon}</div>
                                        <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                                        <p className="text-gray-400 text-sm">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                            {/* Placeholder for a nice image - using a gradient/pattern for now if no image available */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black">
                                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="bg-yellow-400 text-black font-bold text-xs px-3 py-1 rounded-full inline-block mb-4">PREMIUM EXPERIENCE</div>
                                    <h3 className="text-xl font-bold mb-2">Drive Your Dream</h3>
                                    <p className="text-gray-300 text-sm">From hatchbacks to luxury SUVs, we have it all.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION (Reused Component) */}
            <FAQ />

            {/* CTA SECTION */}
            <section className="py-24 bg-yellow-400 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-black mb-6">Ready to Hit the Road?</h2>
                    <p className="text-black/70 text-base mb-10 max-w-xl mx-auto font-medium">
                        Book your car in minutes and enjoy the freedom of self-drive.
                    </p>
                    <Link href="/cars" className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold rounded-full text-base hover:bg-gray-900 transition-all shadow-2xl hover:-translate-y-1">
                        Book Now <ArrowRight size={22} className="text-yellow-400" />
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default HowItWorksPage;
