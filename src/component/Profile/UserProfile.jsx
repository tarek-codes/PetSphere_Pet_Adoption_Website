import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { useNavigate } from 'react-router-dom';
import { getPetImageUrl, handleImageError } from '../../utils/imageUtils';
import { apiUrl } from '../../utils/api';
import { 
    IoMailOutline, 
    IoCallOutline, 
    IoLocationOutline, 
    IoShieldCheckmarkOutline, 
    IoCreateOutline, 
    IoPersonOutline, 
    IoCalendarOutline,
    IoDocumentTextOutline,
    IoAlertCircleOutline
} from 'react-icons/io5';

const UserProfile = () => {
    const { userInfo } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [pets, setPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo?._id) {
            console.error('User ID is missing.');
            return;
        }

        // Fetch profile
        fetch(apiUrl(`/profile/${userInfo._id}`))
            .then((response) => response.json())
            .then((data) => {
                setProfile(data);
                console.log("data", data);
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);
            });

        // Fetch user's pets
        fetch(apiUrl('/pets'), {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPets(data);
                }
                setLoadingPets(false);
            })
            .catch(err => {
                console.error('Error fetching pets:', err);
                setLoadingPets(false);
            });
    }, [userInfo?._id]);

    const handleMissingInfo = (value) => {
        return value && value !== 'NaN' ? value : 'Not set';
    };

    const handleEditClick = () => {
        navigate('/user-edit-profile');
    };

    if (!userInfo) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-sm text-center">
                    <IoAlertCircleOutline className="w-12 h-12 mx-auto text-rose-500 mb-3" />
                    <p className="text-sm font-semibold text-slate-800">User session not found</p>
                    <p className="text-xs text-slate-500 mt-1">Please log in again to access your profile.</p>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition duration-200"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-xs text-slate-500 font-semibold mt-3">Loading profile details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-6xl px-4 pt-28 pb-8 mx-auto">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    
                    {/* Left Column - Main profile and pet details */}
                    <div className="space-y-5 lg:col-span-8">
                        
                        {/* Profile Details Card */}
                        <div className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100">
                            <div className="p-5">
                                <div className="flex flex-col gap-5 md:flex-row items-center md:items-start text-center md:text-left">
                                    
                                    {/* Profile Avatar */}
                                    <div className="flex-shrink-0">
                                        {profile.image && profile.image !== 'NaN' ? (
                                            <div className="relative group overflow-hidden rounded-full shadow-sm w-28 h-28 border border-slate-200">
                                                <img 
                                                    src={profile.image} 
                                                    alt={profile.name} 
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200/50 shadow-inner animate-pulse-subtle">
                                                <IoPersonOutline className="w-12 h-12 text-primary-500" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Profile Meta fields */}
                                    <div className="w-full space-y-4 flex-1">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                            <div className="text-center sm:text-left">
                                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                                                    {profile.name}
                                                </h1>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Account Profile</p>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                profile.role === 'admin' 
                                                    ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                                    : 'bg-primary-50 text-primary-700 border border-primary-100'
                                            }`}>
                                                {profile.role === 'admin' ? 'Administrator' : 'Member'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                                            <div className="p-3 rounded-xl bg-primary-50/40 border border-primary-100/30 flex items-start gap-2.5">
                                                <IoMailOutline className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-primary-600 uppercase tracking-wider">Email Address</p>
                                                    <p className="text-xs font-extrabold text-slate-800 mt-0.5 break-all">{profile.email}</p>
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/30 flex items-start gap-2.5">
                                                <IoCallOutline className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Phone Contact</p>
                                                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">{handleMissingInfo(profile.contactInfo)}</p>
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-purple-50/40 border border-purple-100/30 flex items-start gap-2.5">
                                                <IoLocationOutline className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-purple-600 uppercase tracking-wider">Default Location</p>
                                                    <p className="text-xs font-extrabold text-slate-800 mt-0.5 truncate max-w-[200px]" title={profile.location?.address}>
                                                        {profile.location?.address ? profile.location.address : 'Not set'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-pink-50/40 border border-pink-100/30 flex items-start gap-2.5">
                                                <IoCalendarOutline className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-[9px] font-bold text-pink-600 uppercase tracking-wider">Member Since</p>
                                                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                                                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recent'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Pets Card */}
                        <div className="p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100 text-left">
                            <h2 className="flex items-center mb-4 text-sm font-black text-slate-800 uppercase tracking-wider">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                My Registered Pets ({pets.length})
                            </h2>

                            {loadingPets ? (
                                <div className="py-6 text-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500 mx-auto"></div>
                                </div>
                            ) : pets.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                    {pets.map((pet) => (
                                        <div 
                                            key={pet._id} 
                                            onClick={() => navigate(`/pet/${pet._id}`)}
                                            className="flex gap-3.5 p-3.5 border border-slate-100 rounded-xl bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200 transition duration-200 text-left cursor-pointer"
                                        >
                                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 shadow-sm">
                                                <img 
                                                    src={getPetImageUrl(pet.image)} 
                                                    alt={pet.name} 
                                                    className="w-full h-full object-cover"
                                                    onError={handleImageError}
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-0.5">
                                                <div>
                                                    <h3 className="text-xs font-extrabold text-slate-800">{pet.name}</h3>
                                                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{pet.breed} • {pet.age || 'Puppy'}</p>
                                                </div>
                                                <span className="text-[9px] text-primary-600 hover:text-primary-700 font-bold flex items-center">
                                                    View Profile 🐾
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-100 border-dashed">
                                    <p className="text-xs text-slate-400 font-semibold">No pets registered under this profile.</p>
                                    <button 
                                        onClick={() => navigate('/add-pet')} 
                                        className="mt-3 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition duration-200 inline-flex items-center gap-1 shadow-sm"
                                    >
                                        Register a Pet
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Actions & Status */}
                    <div className="space-y-5 lg:col-span-4 text-left">
                        
                        {/* Profile Management Actions */}
                        <div className="p-4 space-y-2.5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100">
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-0.5">Account Tools</h2>
                            
                            <button
                                onClick={handleEditClick}
                                className="w-full py-2.5 px-4 text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm gap-1.5"
                            >
                                <IoCreateOutline size={14} />
                                Edit Account Details
                            </button>

                            <button
                                onClick={() => navigate(profile.role === 'admin' ? '/admin-home' : '/user-home')}
                                className="w-full py-2.5 px-4 text-center text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center border border-slate-200"
                            >
                                Back to Dashboard
                            </button>
                        </div>

                        {/* Account Verification Details Card */}
                        <div className="p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100">
                            <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Verification Details</h2>
                            
                            {profile.isVerified ? (
                                <div className="p-3 border border-emerald-100 rounded-xl bg-emerald-50/20 space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-800">
                                        <IoShieldCheckmarkOutline className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <span className="text-xs font-black uppercase tracking-wider">Verified User</span>
                                    </div>
                                    <p className="text-[10px] text-emerald-650 leading-relaxed font-light">
                                        Your identity documents have been checked and verified by our support administrators. Your account has full adopter privileges.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-3 border border-amber-100 rounded-xl bg-amber-50/20 space-y-2">
                                    <div className="flex items-center gap-2 text-amber-800">
                                        <IoAlertCircleOutline className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                        <span className="text-xs font-black uppercase tracking-wider">Pending Verification</span>
                                    </div>
                                    <p className="text-[10px] text-amber-650 leading-relaxed font-light">
                                        Some functionalities like list postings require profile validation documents. To verify your account, please upload your official ID verification documents in Edit settings.
                                    </p>
                                </div>
                            )}

                            {profile.documents && profile.documents !== 'NaN' && (
                                <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <IoDocumentTextOutline className="w-5 h-5 text-slate-450" />
                                        <span className="text-xs font-bold text-slate-700">Verification Doc</span>
                                    </div>
                                    <a 
                                        href={profile.documents} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary-600 hover:text-primary-700 font-bold underline"
                                    >
                                        View Doc
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;