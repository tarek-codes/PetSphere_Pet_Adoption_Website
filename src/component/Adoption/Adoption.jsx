import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPetImageUrl, handleImageError } from '../../utils/imageUtils';
import { IoMale, IoFemale, IoSearchOutline, IoChatbubbleEllipsesOutline, IoHomeOutline, IoMailOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { AuthContext } from '../../provider/Authprovider';

const Adoption = () => {
    const [pets, setPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [ageSort, setAgeSort] = useState('none');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const calculateAge = (dob) => {
        if (!dob) return 'Age not available';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const fetchPets = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                search: searchTerm,
                ageFilter: ageSort
            });
            
            const response = await fetch(`http://localhost:3000/available-adoptions?${queryParams}`, {
                credentials: 'include'
            });
            const data = await response.json();
            setPets(data);
        } catch (err) {
            console.error('Failed to load pets for adoption:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPets();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, ageSort]);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="px-4 pt-28 pb-8 mx-auto max-w-6xl text-left">
                
                {/* Header Section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pet Adoption Directory</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            Discover pets waiting for their forever homes ({pets.length} available)
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-[220px]">
                            <input
                                type="text"
                                placeholder="Search by breed or name..."
                                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all placeholder-slate-400 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <IoSearchOutline className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                        
                        <select
                            className="w-full sm:w-[150px] px-3 py-1.5 text-xs font-bold text-slate-650 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 shadow-sm"
                            value={ageSort}
                            onChange={(e) => setAgeSort(e.target.value)}
                        >
                            <option value="none">Sort Option (Age)</option>
                            <option value="youngest">Youngest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-xs text-slate-500 font-semibold mt-3">Fetching available pets...</p>
                    </div>
                ) : pets.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm max-w-md mx-auto">
                        <div className="w-14 h-14 bg-primary-50 border border-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🐾</span>
                        </div>
                        <h3 className="text-sm font-black text-slate-850">No pets found</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">Try adjusting your search criteria or check back later for new arrivals.</p>
                    </div>
                ) : (
                    /* Pet Cards Grid */
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {pets.map((pet) => (
                            <div key={pet._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                                {/* Pet Image */}
                                <div className="relative h-44 w-full overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img
                                        src={getPetImageUrl(pet?.image)}
                                        alt={pet?.name}
                                        className="object-cover w-full h-full hover:scale-102 transition-transform duration-300"
                                        onError={handleImageError}
                                    />
                                    <span className={`absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                        pet?.gender === 'Male' 
                                            ? 'bg-primary-50 text-primary-700 border border-primary-100' 
                                            : pet?.gender === 'Female' 
                                                ? 'bg-pink-50 text-pink-700 border border-pink-100' 
                                                : 'bg-slate-50 text-slate-700 border border-slate-100'
                                    }`}>
                                        {pet?.gender === 'Male' ? (
                                            <>Male <IoMale className="ml-0.5 w-3 h-3 text-primary-500" /></>
                                        ) : pet?.gender === 'Female' ? (
                                            <>Female <IoFemale className="ml-0.5 w-3 h-3 text-pink-500" /></>
                                        ) : (
                                            'Unknown'
                                        )}
                                    </span>
                                </div>
                                
                                {/* Pet Information */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-sm font-black text-slate-800 tracking-tight">
                                                {pet?.name}
                                            </h3>
                                            <span className="text-[10px] text-primary-600 bg-primary-50/50 border border-primary-100/40 px-2 py-0.5 rounded-full font-bold">
                                                {pet?.breed || 'Breed Unknown'}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-450 font-bold uppercase mt-1">Age: {calculateAge(pet?.dob)} years</p>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed h-8">{pet?.description || 'No description provided.'}</p>
                                    </div>
                                    
                                    {/* Owner Information Card */}
                                    <div className="mt-4 pt-3 border-t border-slate-50 space-y-2.5">
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100/60 text-left space-y-1">
                                            <h4 className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Owner Contact</h4>
                                            <p className="text-[10px] font-extrabold text-slate-700 flex items-center gap-1.5 truncate">
                                                <IoPersonOutline className="text-slate-400 flex-shrink-0" />
                                                {pet?.owner?.name}
                                            </p>
                                            <p className="text-[10px] font-extrabold text-slate-700 flex items-center gap-1.5 truncate">
                                                <IoMailOutline className="text-slate-400 flex-shrink-0" />
                                                {pet?.owner?.email}
                                            </p>
                                            {pet?.owner?.phone && (
                                                <p className="text-[10px] font-extrabold text-slate-700 flex items-center gap-1.5 truncate">
                                                    <IoCallOutline className="text-slate-400 flex-shrink-0" />
                                                    {pet?.owner?.phone}
                                                </p>
                                            )}
                                        </div>
                                        
                                        {/* Action Buttons Grid */}
                                        <div className="grid grid-cols-2 gap-2 text-center text-xs font-extrabold">
                                            <button 
                                                className="w-full py-2 px-3 text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition duration-200 flex items-center justify-center gap-1"
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch(`http://localhost:3000/request-pet-adoption/${pet._id}`, {
                                                            method: 'POST',
                                                            credentials: 'include',
                                                        });
                                                        const data = await res.json();
                                                        
                                                        if (res.status === 403 && data.limitReached) {
                                                            alert(`🚫 Adoption Limit Reached!\n\nYou currently have ${data.currentPets} pets and have reached your limit of ${data.limit} pets.\n\nYou cannot adopt more pets at this time.`);
                                                        } else if (res.ok) {
                                                            alert(data.message);
                                                        } else {
                                                            alert(data.message || 'Adoption request failed');
                                                        }
                                                    } catch (err) {
                                                        console.error('Adoption request failed:', err);
                                                        alert('Request failed: ' + (err.message || 'Unknown error'));
                                                    }
                                                }}
                                            >
                                                <IoHomeOutline size={12} />
                                                Adopt
                                            </button>
                                            
                                            {user && pet?.owner?._id !== user.id ? (
                                                <button 
                                                    className="w-full py-2 px-3 text-center text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 transition duration-200 flex items-center justify-center gap-1"
                                                    onClick={async () => {
                                                        try {
                                                            const chatResponse = await fetch(`http://localhost:3000/api/chat/check/${pet._id}`, {
                                                                credentials: 'include'
                                                            });
                                                            
                                                            if (chatResponse.ok) {
                                                                const chatData = await chatResponse.json();
                                                                if (chatData.chatExists) {
                                                                    navigate(`/chat/${chatData.chatId}`);
                                                                } else {
                                                                    navigate(`/chat/new/${pet._id}`);
                                                                }
                                                            } else {
                                                                alert('Failed to start chat. Please try again.');
                                                            }
                                                        } catch (error) {
                                                            console.error('Error checking chat:', error);
                                                            alert('Failed to start chat. Please try again.');
                                                        }
                                                    }}
                                                >
                                                    <IoChatbubbleEllipsesOutline size={12} />
                                                    Chat
                                                </button>
                                            ) : (
                                                <button 
                                                    className="w-full py-2 px-3 text-center text-slate-400 bg-slate-50 border border-slate-100 rounded-xl cursor-not-allowed flex items-center justify-center gap-1"
                                                    disabled
                                                    title="You cannot chat with yourself"
                                                >
                                                    <IoChatbubbleEllipsesOutline size={12} />
                                                    Chat 
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Adoption;
