import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocationPicker from './LocationPicker';
import { IoChevronBackOutline, IoLocationOutline, IoPersonOutline, IoSaveOutline } from 'react-icons/io5';
import { apiUrl } from '../../utils/api';

const EditUserProfile = () => {
    const { userInfo } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        contactInfo: '',
        image: '',
        location: {
            address: '',
            latitude: null,
            longitude: null
        }
    });
    const [loading, setLoading] = useState(true);
    const [showLocationPicker, setShowLocationPicker] = useState(false);

    useEffect(() => {
        if (!userInfo?._id) {
            setLoading(false);
            return;
        }

        fetch(apiUrl(`/profile/${userInfo._id}`))
            .then((response) => response.json())
            .then((data) => {
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                    contactInfo: data.contactInfo || '',
                    image: data.image || '',
                    location: {
                        address: data.location?.address || '',
                        latitude: data.location?.latitude || null,
                        longitude: data.location?.longitude || null
                    }
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);
                setLoading(false);
            });
    }, [userInfo?._id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLocationSelect = (locationData) => {
        setProfile(prev => ({
            ...prev,
            location: {
                address: locationData.address,
                latitude: locationData.lat,
                longitude: locationData.lon
            }
        }));
        setShowLocationPicker(false);
        toast.success('Location selected successfully!');
    };

    const handleSaveProfile = async () => {
        try {
            const response = await fetch(apiUrl(`/profile/${userInfo._id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                toast.success('Profile updated successfully!');
                setTimeout(() => {
                    navigate('/userprofile');
                }, 1500);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    if (!userInfo) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
                <div className="text-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm max-w-sm">
                    <p className="text-sm font-semibold text-slate-800">User session missing</p>
                    <p className="text-xs text-slate-500 mt-1">Please log in again to continue.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-xs text-slate-500 font-semibold mt-3">Loading profile settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-2xl px-4 pt-28 pb-8 mx-auto">
                <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100 overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => navigate('/userprofile')}
                                className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition"
                                title="Back to profile"
                            >
                                <IoChevronBackOutline size={16} />
                            </button>
                            <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">Edit Profile Settings</h1>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-5 space-y-4 text-left">
                        
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profile.email}
                                disabled
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-150 rounded-lg text-xs text-slate-400 cursor-not-allowed outline-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="contactInfo" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
                            <input
                                type="text"
                                id="contactInfo"
                                name="contactInfo"
                                value={profile.contactInfo}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="image" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profile Photo URL</label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="url"
                                    id="image"
                                    name="image"
                                    value={profile.image}
                                    onChange={handleInputChange}
                                    placeholder="Enter profile image URL"
                                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all"
                                />
                                {profile.image ? (
                                    <img 
                                        src={profile.image} 
                                        alt="Profile preview" 
                                        className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0 shadow-sm"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                                        <IoPersonOutline size={14} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Home Location</label>
                            <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                                {profile.location.address ? (
                                    <div className="text-xs text-slate-700">
                                        <p className="font-bold flex items-center gap-1 text-slate-800">
                                            <IoLocationOutline className="text-primary-500" />
                                            {profile.location.address}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-1 ml-5">
                                            Coordinates: {profile.location.latitude?.toFixed(5)}, {profile.location.longitude?.toFixed(5)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 font-semibold italic">No address location pinned yet</p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setShowLocationPicker(true)}
                                    className="mt-2.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold rounded-lg border border-primary-200/50 flex items-center gap-1.5 transition"
                                >
                                    📍 Pin Map Location
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2.5 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                className="py-2.5 px-4 text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition duration-200 font-extrabold text-xs flex items-center gap-1.5 shadow-sm"
                            >
                                <IoSaveOutline size={14} />
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/userprofile')}
                                className="py-2.5 px-4 text-slate-700 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition duration-200 font-extrabold text-xs"
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {showLocationPicker && (
                <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    onClose={() => setShowLocationPicker(false)}
                    initialLocation={profile.location}
                />
            )}
        </div>
    );
};

export default EditUserProfile;
