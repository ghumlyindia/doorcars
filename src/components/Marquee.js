"use client";
import React from 'react';
import { Car } from 'lucide-react';

const Marquee = () => {
    const items = [
        "BEST RATES",
        "CAR RENTAL",
        "WORLDWIDE",
        "AFFORDABLE",
        "24/7 SUPPORT"
    ];

    return (
        <div className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 py-2 md:py-3 overflow-hidden border-y-2 md:border-y-3 border-yellow-600 shadow-lg">
            <div className="flex animate-marquee hover:pause-animation">
                {/* Repeat the content 4 times for seamless loop */}
                {[...Array(4)].map((_, repeatIndex) => (
                    <div key={repeatIndex} className="flex shrink-0">
                        {items.map((item, index) => (
                            <div
                                key={`${repeatIndex}-${index}`}
                                className="flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 md:px-6 lg:px-8 transition-colors duration-300 group shrink-0"
                            >
                                <Car className="text-gray-900 group-hover:text-white shrink-0" size={28} strokeWidth={2.5} />
                                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-gray-900 group-hover:text-white whitespace-nowrap tracking-wide transition-colors duration-300">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marquee;
