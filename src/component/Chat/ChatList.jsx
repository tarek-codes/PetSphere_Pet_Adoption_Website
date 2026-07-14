import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPetImageUrl, handleImageError } from '../../utils/imageUtils';
import { IoMale, IoFemale, IoChatbubbleEllipsesOutline, IoChevronForward } from 'react-icons/io5';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/chats', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch chats');
            }
            
            const data = await response.json();
            const validChats = (data.chats || []).filter(chat => 
                chat && chat._id && chat.petId && typeof chat.petId === 'object'
            );
            setChats(validChats);
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-xs text-slate-500 font-semibold mt-3">Loading active chats...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-4xl mx-auto px-4 pt-28 pb-8 text-left">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Active Messages</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            Keep track of {chats.length} active adoption chat{chats.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => navigate('/adoption')}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-primary-500/10 transition duration-200"
                        >
                            Find Pets to Adopt 🐾
                        </button>
                    </div>
                </div>

                {/* Chats Grid */}
                {chats.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm max-w-md mx-auto">
                        <div className="w-14 h-14 bg-primary-50 border border-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoChatbubbleEllipsesOutline size={22} className="text-primary-500" />
                        </div>
                        <h3 className="text-sm font-black text-slate-850">No chats yet</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">Start chatting with pet owners on their pet profiles to initiate adoptions.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {chats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => navigate(`/chat/${chat._id}`)}
                                className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md rounded-2xl p-4 cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                            >
                                <div className="flex items-center gap-3.5">
                                    {/* Pet Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                            {chat.petId?.image ? (
                                                <img
                                                    src={getPetImageUrl(chat.petId.image)}
                                                    alt={chat.petId.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                                                    onError={handleImageError}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-lg">
                                                    🐾
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Pet Info */}
                                    <div className="min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="text-sm font-black text-slate-850 group-hover:text-primary-600 transition-colors">
                                                {chat.petId?.name || 'Unknown Pet'}
                                            </h3>
                                            
                                            {chat.petId?.gender && (
                                                <span className={`p-0.5 rounded-full text-white ${
                                                    chat.petId.gender === 'Male' ? 'bg-primary-500' : 'bg-pink-500'
                                                }`}>
                                                    {chat.petId.gender === 'Male' ? <IoMale size={8} /> : <IoFemale size={8} />}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                                            <span className="font-bold text-primary-600 bg-primary-50/50 border border-primary-100/40 px-2 py-0.5 rounded-full">
                                                {chat.petId?.breed || 'Breed Not Set'}
                                            </span>
                                            {chat.lastMessage?.content && (
                                                <span className="truncate max-w-[200px] sm:max-w-[300px] text-slate-500 font-medium">
                                                    • {chat.lastMessage.content}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Last active time & Navigation Trigger */}
                                <div className="flex items-center gap-3 justify-between sm:justify-end">
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 uppercase tracking-wider">
                                        {formatTime(chat.lastMessage?.timestamp)}
                                    </span>
                                    <IoChevronForward className="hidden sm:block text-slate-300 group-hover:text-slate-500 transition-colors" size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;
