import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../provider/Authprovider';
import { useTheme } from '../../context/ThemeContext';
import { IoIosNotifications } from "react-icons/io";
import { FaDog } from "react-icons/fa";

const Nav = () => {
    const navigate = useNavigate();
    const { user, logout, userInfo, setUserInfo } = useContext(AuthContext);
    const { isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (user?.id) {
                try {
                    const res = await fetch(`http://localhost:3000/user/${user.id}`, {
                        credentials: 'include'
                    });
                    const data = await res.json();
                    setUserInfo(data);
                } catch (err) {
                    console.error('Failed to load user info:', err);
                }
            }
        };

        fetchUserInfo();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    const getLinkClass = ({ isActive }) => 
        `px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
            isActive 
                ? 'text-white bg-primary-600 shadow-sm shadow-primary-500/10' 
                : 'text-primary-800 dark:text-slate-300 hover:text-primary-900 dark:hover:text-white hover:bg-primary-100/70 dark:hover:bg-slate-700/60'
        }`;

    return (
        <header className={`sticky top-10 z-50 w-[92%] max-w-7xl mx-auto border rounded-[24px] shadow-lg transition-all duration-300 ${isDark ? 'bg-slate-800 border-slate-700/60' : 'bg-primary-50 border-primary-100'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Brand Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            onClick={(e) => {
                                e.preventDefault();
                                if (user) {
                                    if (userInfo?.role === 'admin') {
                                        navigate('/admin-home');
                                    } else {
                                        navigate('/user-home');
                                    }
                                } else {
                                    navigate('/');
                                }
                            }}
                            className="flex items-center gap-2.5 text-xl font-black hover:opacity-90 transition-opacity"
                            to="#"
                        >
                            <div className="w-9 h-9 rounded-full border-2 border-primary-600 flex items-center justify-center flex-shrink-0">
                                <FaDog className="w-6 h-6 text-primary-600" />
                            </div>
                            <span className={isDark ? 'text-slate-100' : 'text-primary-900'}>PetSphere</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-2">
                        {user && userInfo?.role !== 'admin' && (
                            <>
                                <NavLink to="/user-home" className={getLinkClass}>Dashboard</NavLink>
                                <NavLink to="/pets" className={getLinkClass}>My Pets</NavLink>
                                <NavLink to="/chats" className={getLinkClass}>Chats</NavLink>
                                <NavLink to="/adoption" className={getLinkClass}>Adoptions</NavLink>
                                <NavLink to="/lostorfound" className={getLinkClass}>Lost & Found</NavLink>
                            </>
                        )}
                        {user && userInfo?.role === 'admin' && (
                            <>
                                <NavLink to="/admin-home" className={getLinkClass}>Admin Dashboard</NavLink>
                                <NavLink to="/users" className={getLinkClass}>Manage Users</NavLink>
                                <NavLink to="/admin/reviews" className={getLinkClass}>Reviews</NavLink>
                            </>
                        )}
                    </nav>

                    {/* Desktop Action Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link to="/login" className={`text-sm font-semibold transition-colors px-3 py-2 ${isDark ? 'text-slate-300 hover:text-white' : 'text-primary-800 hover:text-primary-950'}`}>
                                    Sign In
                                </Link>
                                <Link to="/register" className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all duration-200 shadow-md shadow-primary-500/10 hover:shadow-lg">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <NavLink to="/notification" className={({ isActive }) => 
                                    `p-2 rounded-xl transition-all duration-200 relative ${
                                        isActive ? 'text-white bg-primary-600 shadow-sm shadow-primary-500/10' : 'text-primary-800 dark:text-slate-300 hover:text-primary-900 dark:hover:text-white hover:bg-primary-100/70 dark:hover:bg-slate-700/60'
                                    }`
                                }>
                                    <IoIosNotifications className="w-5 h-5" />
                                </NavLink>
                                <NavLink to="/userprofile" className={getLinkClass}>
                                    Profile
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-rose-200 px-3.5 py-1.5 rounded-xl transition-all"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex items-center justify-center p-2 rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-900 hover:bg-primary-100/70'}`}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className={`lg:hidden border-t px-4 pt-2 pb-4 space-y-1 shadow-inner rounded-b-[24px] ${isDark ? 'border-slate-700/60 bg-slate-800' : 'border-primary-100 bg-primary-50'}`}>
                    {user && userInfo?.role !== 'admin' && (
                        <>
                            <NavLink to="/user-home" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-950 hover:bg-primary-100/70'}`}>Dashboard</NavLink>
                            <NavLink to="/pets" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-950 hover:bg-primary-100/70'}`}>My Pets</NavLink>
                            <NavLink to="/chats" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-950 hover:bg-primary-100/70'}`}>Chats</NavLink>
                            <NavLink to="/adoption" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-950 hover:bg-primary-100/70'}`}>Adoptions</NavLink>
                            <NavLink to="/lostorfound" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-950 hover:bg-primary-100/70'}`}>Lost & Found</NavLink>
                        </>
                    )}
                    {user && userInfo?.role === 'admin' && (
                        <>
                            <NavLink to="/admin-home" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-950 hover:bg-primary-100/70'}`}>Admin Dashboard</NavLink>
                            <NavLink to="/users" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-950 hover:bg-primary-100/70'}`}>Manage Users</NavLink>
                            <NavLink to="/admin/reviews" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-955 hover:bg-primary-100/70'}`}>Reviews</NavLink>
                        </>
                    )}
                    <div className={`pt-4 border-t flex flex-col gap-2 ${isDark ? 'border-slate-700/60' : 'border-primary-100'}`}>
                        {!user ? (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)} className={`block text-center w-full px-4 py-2.5 text-base font-semibold rounded-xl transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-700/60 hover:text-white' : 'text-primary-800 hover:bg-primary-100 hover:text-primary-950'}`}>
                                    Sign In
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center w-full px-4 py-2.5 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <NavLink to="/notification" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-950 hover:bg-primary-100/70'}`}>
                                    Notifications
                                </NavLink>
                                <NavLink to="/userprofile" onClick={() => setIsOpen(false)} className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/60' : 'text-primary-800 hover:text-primary-950 hover:bg-primary-100/70'}`}>
                                    Profile
                                </NavLink>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-center px-4 py-2.5 text-base font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Nav;
