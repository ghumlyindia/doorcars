"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';
import {
    User, Mail, Phone, Shield, ShieldCheck, Upload, FileText,
    CheckCircle, AlertCircle, Edit, X, MapPin, Calendar,
    LogOut, Car, LayoutDashboard, ChevronRight, Camera
} from 'lucide-react';

const ProfilePage = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details'); // details, documents, bookings

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: { street: '', city: '', state: '', pincode: '' }
    });

    // File states
    const [files, setFiles] = useState({
        aadhaarFront: null,
        aadhaarBack: null,
        licenseFront: null,
        licenseBack: null
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    // Bookings State
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingFilter, setBookingFilter] = useState('all');

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
        if (bookingFilter === 'all') return true;
        return getBookingFilterStatus(booking) === bookingFilter;
    });

    useEffect(() => {
        if (activeTab === 'bookings' && bookings.length === 0) {
            fetchBookings();
        }
    }, [activeTab]);

    const fetchBookings = async () => {
        try {
            setBookingsLoading(true);
            const response = await api.get('/bookings/my-bookings');
            if (response.data.success) {
                setBookings(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load booking history");
        } finally {
            setBookingsLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }
            const response = await api.get('/users/profile');
            if (response.data.success) {
                setUser(response.data.data);
                initializeEditForm(response.data.data);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const initializeEditForm = (userData) => {
        setEditForm({
            name: userData.name || '',
            phone: userData.phone || '',
            dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
            gender: userData.gender || '',
            address: {
                street: userData.address?.street || '',
                city: userData.address?.city || '',
                state: userData.address?.state || '',
                pincode: userData.address?.pincode || ''
            }
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            const response = await api.put('/users/profile', editForm);
            if (response.data.success) {
                toast.success("Profile updated successfully");
                setUser(response.data.data);
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [type]: file }));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const { aadhaarFront, aadhaarBack, licenseFront, licenseBack } = files;

        if (!aadhaarFront && !aadhaarBack && !licenseFront && !licenseBack) {
            toast.error("Please select a document to upload");
            return;
        }

        const formData = new FormData();
        if (aadhaarFront) formData.append('aadhaarFront', aadhaarFront);
        if (aadhaarBack) formData.append('aadhaarBack', aadhaarBack);
        if (licenseFront) formData.append('drivingLicenseFront', licenseFront);
        if (licenseBack) formData.append('drivingLicenseBack', licenseBack);

        setUploading(true);
        try {
            const response = await api.post('/users/upload-documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                toast.success("Documents uploaded!");
                setUser(prev => ({
                    ...prev,
                    documents: response.data.data.documents,
                    isDocumentVerified: response.data.data.isDocumentVerified
                }));
                setFiles({ aadhaarFront: null, aadhaarBack: null, licenseFront: null, licenseBack: null });
                // Reset inputs
                Array.from(document.querySelectorAll('input[type="file"]')).forEach(input => input.value = '');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        if (status === 'verified') return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1"><CheckCircle size={12} /> Verified</span>;
        if (status === 'rejected') return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1"><AlertCircle size={12} /> Rejected</span>;
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full flex items-center gap-1"><Clock size={12} /> Pending</span>;
    };

    // Booking Helpers
    const getBookingStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Toaster position="top-right" />

            {/* Header Background */}
            <div className="bg-gray-900 h-64 w-full absolute top-0 left-0 z-0">
                <div className="absolute inset-0 bg-yellow-400 opacity-10 pattern-grid-lg"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Sidebar - Profile & Nav */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>

                            <div className="relative inline-block mb-4">
                                <div className="w-28 h-28 rounded-full bg-gray-100 p-1 border-4 border-white shadow-lg mx-auto overflow-hidden">
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                </div>
                                <div className="absolute bottom-1 right-1 bg-yellow-400 p-1.5 rounded-full border-2 border-white shadow-sm">
                                    <Edit size={12} className="text-gray-900" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                            <p className="text-gray-500 text-sm mb-6 flex items-center justify-center gap-1">
                                <Mail size={14} /> {user.email}
                            </p>

                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{user.totalBookings || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Bookings</div>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <div className="text-2xl font-bold text-gray-900">₹{user.totalSpent || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Spent</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="p-2 space-y-1">
                                {['details', 'documents', 'bookings'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${activeTab === tab
                                            ? 'bg-yellow-50 text-yellow-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {tab === 'details' && <User size={18} />}
                                            {tab === 'documents' && <Shield size={18} />}
                                            {tab === 'bookings' && <Car size={18} />}
                                            <span className="capitalize">{tab}</span>
                                        </div>
                                        <ChevronRight size={16} className={`transition-transform ${activeTab === tab ? 'rotate-90' : 'text-gray-300'}`} />
                                    </button>
                                ))}
                            </div>
                            <div className="p-2 border-t border-gray-100 mt-2">
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        router.push('/login');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* PERSONAL DETAILS TAB */}
                        {activeTab === 'details' && (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-colors"
                                        >
                                            <Edit size={14} /> Edit Profile
                                        </button>
                                    )}
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleUpdateProfile}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        value={isEditing ? editForm.name : user.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none disabled:bg-white disabled:border-transparent disabled:text-gray-500 font-medium transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">Phone</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        value={isEditing ? editForm.phone : user.phone}
                                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none disabled:bg-white disabled:border-transparent disabled:text-gray-500 font-medium transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">Date of Birth</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                    <input
                                                        type="date"
                                                        disabled={!isEditing}
                                                        value={isEditing ? editForm.dateOfBirth : (user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '')}
                                                        onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none disabled:bg-white disabled:border-transparent disabled:text-gray-500 font-medium transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">Gender</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                                    <select
                                                        disabled={!isEditing}
                                                        value={isEditing ? editForm.gender : user.gender}
                                                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none disabled:bg-white disabled:border-transparent disabled:text-gray-500 font-medium transition-all appearance-none"
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-8">
                                            <label className="text-sm font-bold text-gray-700">Address</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input placeholder="Street" disabled={!isEditing} value={isEditing ? editForm.address.street : user.address?.street} onChange={(e) => setEditForm({ ...editForm, address: { ...editForm.address, street: e.target.value } })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none disabled:bg-white disabled:border-transparent" />
                                                <input placeholder="City" disabled={!isEditing} value={isEditing ? editForm.address.city : user.address?.city} onChange={(e) => setEditForm({ ...editForm, address: { ...editForm.address, city: e.target.value } })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none disabled:bg-white disabled:border-transparent" />
                                                <input placeholder="State" disabled={!isEditing} value={isEditing ? editForm.address.state : user.address?.state} onChange={(e) => setEditForm({ ...editForm, address: { ...editForm.address, state: e.target.value } })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none disabled:bg-white disabled:border-transparent" />
                                                <input placeholder="Pincode" disabled={!isEditing} value={isEditing ? editForm.address.pincode : user.address?.pincode} onChange={(e) => setEditForm({ ...editForm, address: { ...editForm.address, pincode: e.target.value } })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none disabled:bg-white disabled:border-transparent" />
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex gap-4 justify-end">
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                                                <button type="submit" disabled={updatingProfile} className="px-8 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-bold transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-50">
                                                    {updatingProfile ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* DOCUMENTS TAB */}
                        {activeTab === 'documents' && (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Verification Documents</h3>
                                            <p className="text-gray-500 text-sm mt-1">Upload clear photos of your ID proofs</p>
                                        </div>
                                        {user.isDocumentVerified
                                            ? <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-xl flex items-center gap-2"><CheckCircle size={18} /> Account Verified</span>
                                            : <span className="px-4 py-2 bg-yellow-100 text-yellow-700 font-bold rounded-xl flex items-center gap-2"><AlertCircle size={18} /> Verification Pending</span>
                                        }
                                    </div>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleUpload}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            {/* Aadhaar Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><FileText size={18} className="text-yellow-500" /> Aadhaar Card</h4>
                                                    {user.documents?.aadhaar && <StatusBadge status={user.documents.aadhaar.verified} />}
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    {/* Front */}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Front Side</label>
                                                        <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-gray-300 hover:border-yellow-400 transition-colors bg-gray-50 relative group overflow-hidden">
                                                            {files.aadhaarFront ? (
                                                                <img src={URL.createObjectURL(files.aadhaarFront)} className="w-full h-full object-cover" />
                                                            ) : user.documents?.aadhaar?.frontImage ? (
                                                                <img src={user.documents.aadhaar.frontImage} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                                    <Upload size={24} />
                                                                    <span className="text-xs font-medium mt-1">Upload Front</span>
                                                                </div>
                                                            )}
                                                            <input type="file" onChange={(e) => handleFileChange(e, 'aadhaarFront')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                        </div>
                                                    </div>
                                                    {/* Back */}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Back Side</label>
                                                        <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-gray-300 hover:border-yellow-400 transition-colors bg-gray-50 relative group overflow-hidden">
                                                            {files.aadhaarBack ? (
                                                                <img src={URL.createObjectURL(files.aadhaarBack)} className="w-full h-full object-cover" />
                                                            ) : user.documents?.aadhaar?.backImage ? (
                                                                <img src={user.documents.aadhaar.backImage} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                                    <Upload size={24} />
                                                                    <span className="text-xs font-medium mt-1">Upload Back</span>
                                                                </div>
                                                            )}
                                                            <input type="file" onChange={(e) => handleFileChange(e, 'aadhaarBack')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {(user.documents?.aadhaar?.verified === 'rejected' && user.documents?.aadhaar?.rejectionReason) && (
                                                    <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">reason: {user.documents.aadhaar.rejectionReason}</div>
                                                )}
                                            </div>

                                            {/* License Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-gray-900 flex items-center gap-2"><Car size={18} className="text-yellow-500" /> Driving License</h4>
                                                    {user.documents?.drivingLicense && <StatusBadge status={user.documents.drivingLicense.verified} />}
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    {/* Front */}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Front Side</label>
                                                        <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-gray-300 hover:border-yellow-400 transition-colors bg-gray-50 relative group overflow-hidden">
                                                            {files.licenseFront ? (
                                                                <img src={URL.createObjectURL(files.licenseFront)} className="w-full h-full object-cover" />
                                                            ) : user.documents?.drivingLicense?.frontImage ? (
                                                                <img src={user.documents.drivingLicense.frontImage} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                                    <Upload size={24} />
                                                                    <span className="text-xs font-medium mt-1">Upload Front</span>
                                                                </div>
                                                            )}
                                                            <input type="file" onChange={(e) => handleFileChange(e, 'licenseFront')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                        </div>
                                                    </div>
                                                    {/* Back */}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-gray-500 uppercase">Back Side</label>
                                                        <div className="aspect-[3/2] rounded-xl border-2 border-dashed border-gray-300 hover:border-yellow-400 transition-colors bg-gray-50 relative group overflow-hidden">
                                                            {files.licenseBack ? (
                                                                <img src={URL.createObjectURL(files.licenseBack)} className="w-full h-full object-cover" />
                                                            ) : user.documents?.drivingLicense?.backImage ? (
                                                                <img src={user.documents.drivingLicense.backImage} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                                    <Upload size={24} />
                                                                    <span className="text-xs font-medium mt-1">Upload Back</span>
                                                                </div>
                                                            )}
                                                            <input type="file" onChange={(e) => handleFileChange(e, 'licenseBack')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {(user.documents?.drivingLicense?.verified === 'rejected' && user.documents?.drivingLicense?.rejectionReason) && (
                                                    <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">reason: {user.documents.drivingLicense.rejectionReason}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-6 border-t border-gray-100">
                                            <button
                                                type="submit"
                                                disabled={uploading}
                                                className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-bold transition-all shadow-lg shadow-yellow-400/20 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900"></div> : <Upload size={18} />}
                                                {uploading ? 'Uploading...' : 'Upload Documents'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* BOOKINGS TAB */}
                        {activeTab === 'bookings' && (
                            <div className="space-y-6">
                                {/* Filter Tabs */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setBookingFilter(f)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${bookingFilter === f
                                                    ? 'bg-black text-yellow-400 shadow-sm'
                                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>

                                {bookingsLoading ? (
                                    <div className="bg-white rounded-3xl p-12 flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                                    </div>
                                ) : filteredBookings.length === 0 ? (
                                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                                        <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Car size={32} className="text-yellow-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No {bookingFilter !== 'all' ? bookingFilter : ''} bookings</h3>
                                        <p className="text-gray-500">
                                            {bookingFilter === 'all'
                                                ? "Your trip history will appear here once you make a booking."
                                                : `You don't have any ${bookingFilter} bookings.`}
                                        </p>
                                        {bookingFilter === 'all' && (
                                            <button onClick={() => router.push('/cars')} className="mt-6 px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-500 transition-colors">
                                                Browse Cars
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <div key={booking._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                                {/* Car Image (Thumbnail) */}
                                                <div className="w-full md:w-32 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                                    {booking.car ? (
                                                        <img
                                                            src={booking.car.thumbnail || 'https://via.placeholder.com/300x200?text=Car'}
                                                            alt={booking.car.model}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">Car Unavailable</div>
                                                    )}
                                                    <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${getBookingStatusColor(booking.status)}`}>
                                                        {booking.status}
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900">
                                                                {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Unknown Car'}
                                                            </h3>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                                <MapPin size={12} /> {booking.address?.city || booking.city || booking.car?.city || 'N/A'}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-black text-gray-900">₹{booking.totalPrice}</div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-50">
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Start Date</p>
                                                            <p className="text-sm font-semibold text-gray-700">{formatDate(booking.startDate)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">End Date</p>
                                                            <p className="text-sm font-semibold text-gray-700">{formatDate(booking.endDate)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
