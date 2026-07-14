import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaFileMedical, FaArrowRight, FaDog } from 'react-icons/fa';
import petHeroImage from '../../assets/pet_adoption_hero.png';
import { useTheme } from '../../context/ThemeContext';

const Home = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    return (
        <div className={`relative min-h-[calc(100vh-8rem)] flex items-center pt-28 pb-12 overflow-visible ${isDark ? 'bg-gray-950' : 'bg-[#f8fafc]'}`}>
            {/* Split Screen Container */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    
                    {/* Left Column: Premium Flat Typography & Content */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        {/* Welcome Badge with Logo */}
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700 text-primary-400' : 'bg-primary-50 border-primary-100 text-primary-600'}`}>
                            <div className="w-5 h-5 rounded-full border border-primary-600 flex items-center justify-center flex-shrink-0">
                                <FaDog className="w-3 h-3 text-primary-600" />
                            </div>
                            <span>Welcome to PetSphere</span>
                        </div>

                        {/* Heading */}
                        <h1 className={`text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.1] ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            Find Your <br />
                            <span className="text-primary-600">Perfect Companion</span>
                        </h1>

                        {/* Description */}
                        <p className={`text-sm sm:text-base max-w-xl font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Connect with loving pets waiting for their forever homes. Join thousands of pet lovers in our caring, supportive community featuring interactive health metrics and messaging.
                        </p>

                        {/* Feature Highlights - Flat Designs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl pt-1">
                            <div className={`flex items-center gap-2.5 border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow ${isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/50'}`}>
                                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-lg flex items-center justify-center">
                                    <FaHeart size={13} />
                                </div>
                                <div className="text-left">
                                    <span className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Adopt Pets</span>
                                    <span className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Forever Homes</span>
                                </div>
                            </div>
                            <div className={`flex items-center gap-2.5 border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow ${isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/50'}`}>
                                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-lg flex items-center justify-center">
                                    <FaMapMarkerAlt size={13} />
                                </div>
                                <div className="text-left">
                                    <span className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Lost & Found</span>
                                    <span className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>GPS Pinning</span>
                                </div>
                            </div>
                            <div className={`flex items-center gap-2.5 border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow ${isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/50'}`}>
                                <div className="w-8 h-8 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 rounded-lg flex items-center justify-center">
                                    <FaFileMedical size={13} />
                                </div>
                                <div className="text-left">
                                    <span className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Vitals Tracker</span>
                                    <span className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Health Cards</span>
                                </div>
                            </div>
                        </div>

                        {/* Action CTA Button */}
                        <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center">
                            <button 
                                className="w-full sm:w-auto px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
                                onClick={() => navigate('/login')}
                            >
                                <span>Get Started Today</span>
                                <FaArrowRight size={11} />
                            </button>
                            <button 
                                className={`w-full sm:w-auto px-6 py-3.5 font-bold rounded-xl border transition-all duration-300 text-sm ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/60'}`}
                                onClick={() => navigate('/register')}
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Stats Section */}
                        <div className={`pt-6 border-t max-w-xl ${isDark ? 'border-slate-700/60' : 'border-slate-200/60'}`}>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <div className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>300+</div>
                                    <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Happy Companions</div>
                                </div>
                                <div>
                                    <div className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>2k+</div>
                                    <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Community Members</div>
                                </div>
                                <div>
                                    <div className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>100%</div>
                                    <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Verified Listings</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Premium Stock Image Instead of Mock Card */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <div className={`w-full max-w-[380px] border rounded-3xl p-3 shadow-xl ${isDark ? 'bg-slate-800/50 border-slate-700/60' : 'bg-white border-slate-200/80'}`}>
                            <img 
                                src={petHeroImage} 
                                alt="Pet Adoption Hero" 
                                className="w-full h-auto rounded-2xl object-cover block shadow-inner"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home;
