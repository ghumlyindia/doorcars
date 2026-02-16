"use client";
import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What documents do I need to rent a car?",
            answer: "You'll need a valid driver's license, a government-issued ID (like Aadhar or Passport), and a credit/debit card for the security deposit. For drivers under 25, additional verification may be required."
        },
        {
            question: "Is there a mileage limit on rentals?",
            answer: "No! We offer unlimited kilometers on all our self-drive car rentals. Drive as much as you want without worrying about extra charges."
        },
        {
            question: "What happens if the car breaks down?",
            answer: "We provide 24/7 roadside assistance. Just call our support number, and we'll either fix the issue on-site or provide a replacement vehicle at no additional cost."
        },
        {
            question: "Can I extend my rental period?",
            answer: "Yes, you can extend your rental period subject to vehicle availability. Contact us at least 24 hours before your return time, and we'll help you extend your booking."
        },
        {
            question: "What is your cancellation policy?",
            answer: "Free cancellation up to 24 hours before pickup. Cancellations within 24 hours are subject to a 20% fee. No-shows result in full charge of the first day's rental."
        },
        {
            question: "Do you offer delivery and pickup services?",
            answer: "Yes! We offer doorstep delivery and pickup services in select cities. Additional charges may apply based on your location. Check during booking for availability."
        },
        {
            question: "Is insurance included in the rental price?",
            answer: "Yes, basic insurance is included in all our rental packages. You can also opt for zero-deductible coverage for complete peace of mind at a small additional cost."
        },
        {
            question: "Can someone else drive the rented car?",
            answer: "Additional drivers can be added to your rental agreement at a nominal fee. They must meet the same requirements as the primary driver and be present during pickup."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <HelpCircle className="text-yellow-500" size={18} />
                        <span className="text-yellow-600 font-semibold text-xs uppercase tracking-wide">
                            Got Questions?
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-3xl font-black text-gray-900 mb-4">
                        FREQUENTLY ASKED QUESTIONS
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                        Find answers to common questions about our car rental services
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 overflow-hidden ${openIndex === index
                                ? 'border-yellow-400 shadow-lg'
                                : 'border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            {/* Question */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-5 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4 text-left transition-colors hover:bg-gray-50"
                            >
                                <span className="text-sm md:text-base font-bold text-gray-900 flex-1">
                                    {faq.question}
                                </span>
                                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${openIndex === index
                                    ? 'bg-yellow-400 rotate-180'
                                    : 'bg-gray-100'
                                    }`}>
                                    {openIndex === index ? (
                                        <Minus className="text-gray-900" size={18} />
                                    ) : (
                                        <Plus className="text-gray-600" size={18} />
                                    )}
                                </div>
                            </button>

                            {/* Answer */}
                            <div
                                className={`transition-all duration-300 ease-in-out ${openIndex === index
                                    ? 'max-h-96 opacity-100'
                                    : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-5 md:px-8 pb-4 md:pb-5 pt-2">
                                    <div className="pl-0 md:pl-2 border-l-4 border-yellow-400 pl-4">
                                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 md:mt-16 text-center bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 md:p-8 shadow-xl">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                        Still Have Questions?
                    </h3>
                    <p className="text-gray-800 mb-5 text-xs md:text-sm">
                        Our team is here to help you 24/7. Get in touch with us anytime!
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg hover:scale-105 text-sm"
                    >
                        Contact Support
                        <HelpCircle size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
