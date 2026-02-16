import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* Brand */}
                    <div>
                        <img src="/images/doorcars-logo.png" alt="DoorCars" className="h-10 w-auto mb-6 brightness-0 invert" />
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            DoorCars provides premium self-drive car rentals with flexible pricing and wide availability. Experience the freedom of driving your dream car.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-white transition"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-white transition"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white transition"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-blue-400 transition">Home</Link></li>
                            <li><Link href="/cars" className="hover:text-blue-400 transition">Browse Cars</Link></li>
                            <li><Link href="/pricing" className="hover:text-blue-400 transition">Pricing</Link></li>
                            <li><Link href="/about" className="hover:text-blue-400 transition">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/faq" className="hover:text-blue-400 transition">FAQs</Link></li>
                            <li><Link href="/terms" className="hover:text-blue-400 transition">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
                            <li><Link href="/cancellation" className="hover:text-blue-400 transition">Cancellation Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-blue-500 mt-0.5" />
                                <span>123, Luxury Lane, Auto City,<br />New Delhi, India - 110001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-blue-500" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-500" />
                                <span>support@doorcars.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} DoorCars. All rights reserved.</p>
                    <p>Designed and developed by Jeetendra Singh Rathore</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
