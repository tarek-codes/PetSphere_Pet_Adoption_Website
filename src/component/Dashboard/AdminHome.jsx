import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';
import { 
    UsersIllustration, 
    PetsIllustration, 
    GrowthIllustration, 
    ReviewsIllustration, 
    ChatsIllustration, 
    LostFoundIllustration,
    AdoptionSlotsIllustration
} from './VectorIllustrations';

const AdminHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPets: 0,
        newUsers24h: 0,
        userGrowth: 0,
        activeSessions: 0,
        totalChats: 0,
        lostFoundReports: 0,
        reviewsCount: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:3000/admin/metrics', {
                credentials: 'include',
            });
            const data = await response.json();
            
            setStats({
                totalUsers: data.totalUsers || 0,
                totalPets: data.totalPets || 0,
                newUsers24h: data.newUsers24h || 0,
                newPets24h: data.newPets24h || 0,
                userGrowth: data.newUsers24h > 0 ? ((data.newUsers24h / data.totalUsers) * 100).toFixed(1) : 0,
                activeSessions: data.activeSessions || 0,
                totalChats: data.totalChats || 0,
                newChats24h: data.newChats24h || 0,
                lostFoundReports: data.lostFoundReports || 0,
                newLostFound24h: data.newLostFound24h || 0,
                reviewsCount: data.totalReviews || 0,
                newReviews24h: data.newReviews24h || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Welcome Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Welcome back! Today is {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                             })}
                        </p>
                    </div>
                </div>

                {/* Main Grid: Metrics Grid & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                    
                    {/* Left & Middle: Metrics Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-lg font-bold text-slate-900">System Metrics</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Total Users */}
                            <div className="bg-slate-100/90 border border-slate-200/60 shadow-2xl rounded-3xl p-6 flex items-center justify-between gap-4 backdrop-blur-sm group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Users</span>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-2xl font-extrabold text-slate-900">{stats.totalUsers}</h4>
                                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                                            <FaUserPlus size={10} /> +{stats.newUsers24h} today
                                        </span>
                                    </div>
                                </div>
                                <UsersIllustration className="w-16 h-16 opacity-90 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>

                            {/* Total Pets */}
                            <div className="bg-slate-100/90 border border-slate-200/60 shadow-2xl rounded-3xl p-6 flex items-center justify-between gap-4 backdrop-blur-sm group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Pets</span>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-2xl font-extrabold text-slate-900">{stats.totalPets}</h4>
                                        <span className="text-xs text-emerald-600 font-semibold">
                                            +{stats.newPets24h || 0} today
                                        </span>
                                    </div>
                                </div>
                                <PetsIllustration className="w-16 h-16 opacity-90 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>

                            {/* User Growth */}
                            <div className="bg-slate-100/90 border border-slate-200/60 shadow-2xl rounded-3xl p-6 flex items-center justify-between gap-4 backdrop-blur-sm group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">User Growth</span>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-2xl font-extrabold text-slate-900">{stats.userGrowth}%</h4>
                                        <span className="text-xs text-slate-500 font-medium">Last 24h</span>
                                    </div>
                                </div>
                                <GrowthIllustration className="w-16 h-16 opacity-90 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>

                            {/* Total Reviews */}
                            <div className="bg-slate-100/90 border border-slate-200/60 shadow-2xl rounded-3xl p-6 flex items-center justify-between gap-4 backdrop-blur-sm group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Reviews</span>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-2xl font-extrabold text-slate-900">{stats.reviewsCount}</h4>
                                        <span className="text-xs text-emerald-600 font-semibold">
                                            +{stats.newReviews24h || 0} today
                                        </span>
                                    </div>
                                </div>
                                <ReviewsIllustration className="w-16 h-16 opacity-90 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>

                            {/* Total Chats */}
                            <div className="bg-slate-100/90 border border-slate-200/60 shadow-2xl rounded-3xl p-6 flex items-center justify-between gap-4 backdrop-blur-sm group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Chats</span>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-2xl font-extrabold text-slate-900">{stats.totalChats}</h4>
                                        <span className="text-xs text-emerald-600 font-semibold">
                                            +{stats.newChats24h || 0} today
                                        </span>
                                    </div>
                                </div>
                                <ChatsIllustration className="w-16 h-16 opacity-90 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>

                            {/* Lost & Found */}
                            <div className="bg-slate-100/90 border border-slate-200/60 shadow-2xl rounded-3xl p-6 flex items-center justify-between gap-4 backdrop-blur-sm group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Lost & Found Posts</span>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-2xl font-extrabold text-slate-900">{stats.lostFoundReports}</h4>
                                        <span className="text-xs text-slate-500 font-medium">
                                            +{stats.newLostFound24h || 0} today
                                        </span>
                                    </div>
                                </div>
                                <LostFoundIllustration className="w-16 h-16 opacity-90 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Actions Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {/* Manage Users */}
                            <div 
                                onClick={() => navigate('/users')}
                                className="bg-slate-100/90 border border-slate-200/60 hover:border-primary-500 rounded-3xl p-5 hover:shadow-lg cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 group backdrop-blur-sm animate-fade-in"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="group-hover:scale-105 transition-all duration-200 flex-shrink-0">
                                        <UsersIllustration className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 font-bold">Manage Users</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Ban or verify system users</p>
                                    </div>
                                </div>
                            </div>

                            {/* Manage Reviews */}
                            <div 
                                onClick={() => navigate('/admin/reviews')}
                                className="bg-slate-100/90 border border-slate-200/60 hover:border-primary-500 rounded-3xl p-5 hover:shadow-lg cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 group backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="group-hover:scale-105 transition-all duration-200 flex-shrink-0">
                                        <ReviewsIllustration className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 font-bold">Manage Reviews</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Read and manage user feedback</p>
                                    </div>
                                </div>
                            </div>

                            {/* View Adoption List */}
                            <div 
                                onClick={() => navigate('/adoption')}
                                className="bg-slate-100/90 border border-slate-200/60 hover:border-primary-500 rounded-3xl p-5 hover:shadow-lg cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 group backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="group-hover:scale-105 transition-all duration-200 flex-shrink-0">
                                        <AdoptionSlotsIllustration className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 font-bold">View Adoption List</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Monitor current pet adoptions</p>
                                    </div>
                                </div>
                            </div>

                            {/* View Lost & Found List */}
                            <div 
                                onClick={() => navigate('/lostorfound')}
                                className="bg-slate-100/90 border border-slate-200/60 hover:border-primary-500 rounded-3xl p-5 hover:shadow-lg cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 group backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="group-hover:scale-105 transition-all duration-200 flex-shrink-0">
                                        <LostFoundIllustration className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 font-bold">View Lost & Found</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Browse lost or found reports</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminHome;
