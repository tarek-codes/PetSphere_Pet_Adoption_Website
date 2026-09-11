import React, { useEffect, useState } from 'react';
import { IoNotificationsOutline, IoCheckmarkOutline, IoTrashOutline, IoCalendarOutline, IoMedicalOutline, IoAlertCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from '../../utils/api';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'vaccination', 'appointment'

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(apiUrl('/api/notifications'), {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }

            const data = await response.json();
            setNotifications(data);
        } catch (err) {
            setError('Failed to fetch notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(apiUrl(`/api/notifications/${notificationId}`), {
                method: 'PATCH',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            setNotifications(notifications.filter((notification) => notification._id !== notificationId));
        } catch (err) {
            setError('Failed to mark notification as read');
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const response = await fetch(apiUrl(`/api/notifications/${notificationId}`), {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete notification');
            }

            setNotifications(notifications.filter((notification) => notification._id !== notificationId));
        } catch (err) {
            setError('Failed to delete notification');
        }
    };

    const getNotificationType = (message, type) => {
        if (type === 'alert') return 'alert';
        if (message.toLowerCase().includes('vaccination')) return 'vaccination';
        if (message.toLowerCase().includes('appointment')) return 'appointment';
        return 'other';
    };

    const getNotificationIcon = (notificationType) => {
        switch (notificationType) {
            case 'alert':
                return <IoAlertCircleOutline className="text-white text-base" />;
            case 'vaccination':
                return <IoMedicalOutline className="text-white text-base" />;
            case 'appointment':
                return <IoCalendarOutline className="text-white text-base" />;
            default:
                return <IoNotificationsOutline className="text-white text-base" />;
        }
    };

    const getNotificationColor = (notificationType) => {
        switch (notificationType) {
            case 'alert':
                return 'bg-gradient-to-br from-rose-500 to-rose-600';
            case 'vaccination':
                return 'bg-gradient-to-br from-primary-500 to-primary-600';
            case 'appointment':
                return 'bg-gradient-to-br from-purple-500 to-purple-600';
            default:
                return 'bg-gradient-to-br from-slate-500 to-slate-600';
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        if (activeTab === 'all') return !notification.isRead;
        return !notification.isRead && getNotificationType(notification.message, notification.type) === activeTab;
    });

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] pt-28">
            <div className="p-4 text-center text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded-xl">
                {error}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-4xl px-4 pt-28 pb-8 mx-auto text-left">
                {/* Header Card */}
                <div className="p-5 mb-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Notifications & Alerts</h1>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                Keep track of pet schedules and lost warnings ({notifications.filter(n => !n.isRead).length} unread)
                            </p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-1 p-1 bg-slate-50 border border-slate-100 rounded-xl">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 font-extrabold text-xs rounded-lg transition ${
                                activeTab === 'all'
                                    ? 'bg-white text-primary-600 shadow-sm border border-slate-100/60'
                                    : 'text-slate-500 hover:text-slate-700'
                             }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveTab('alert')}
                            className={`px-4 py-2 font-extrabold text-xs flex items-center gap-1 rounded-lg transition ${
                                activeTab === 'alert'
                                    ? 'bg-white text-rose-600 shadow-sm border border-slate-100/60'
                                    : 'text-slate-500 hover:text-rose-700'
                             }`}
                        >
                            🚨 Alerts
                        </button>
                        <button
                            onClick={() => setActiveTab('vaccination')}
                            className={`px-4 py-2 font-extrabold text-xs flex items-center gap-1 rounded-lg transition ${
                                activeTab === 'vaccination'
                                    ? 'bg-white text-primary-600 shadow-sm border border-slate-100/60'
                                    : 'text-slate-500 hover:text-primary-700'
                             }`}
                        >
                            💉 Vaccinations
                        </button>
                        <button
                            onClick={() => setActiveTab('appointment')}
                            className={`px-4 py-2 font-extrabold text-xs flex items-center gap-1 rounded-lg transition ${
                                activeTab === 'appointment'
                                    ? 'bg-white text-purple-600 shadow-sm border border-slate-100/60'
                                    : 'text-slate-500 hover:text-purple-700'
                             }`}
                        >
                            📅 Appointments
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-xs text-slate-500 font-semibold mt-3">Fetching logs...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="py-16 text-center bg-white border border-slate-100 rounded-2xl shadow-sm max-w-md mx-auto">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                            🔔
                        </div>
                        <h3 className="text-sm font-black text-slate-850">All caught up</h3>
                        <p className="text-xs text-slate-400 mt-1">No unread notifications are waiting for review.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className="space-y-3">
                            {filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="group overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                                <div className={`p-2.5 rounded-xl flex-shrink-0 text-white shadow-sm ${getNotificationColor(getNotificationType(notification.message, notification.type))}`}>
                                                    {getNotificationIcon(getNotificationType(notification.message, notification.type))}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-extrabold leading-relaxed truncate ${
                                                        getNotificationType(notification.message, notification.type) === 'alert' 
                                                            ? 'text-rose-700' 
                                                            : 'text-slate-800'
                                                    }`}>
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                                                        <IoCalendarOutline size={10} />
                                                        <span>{new Date(notification.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Action tools */}
                                            <div className="flex items-center gap-1 ml-2">
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 rounded-lg transition duration-200"
                                                    title="Mark as read"
                                                >
                                                    <IoCheckmarkOutline size={14} />
                                                </button>
                                                <button
                                                    onClick={() => deleteNotification(notification._id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition duration-200"
                                                    title="Delete notification"
                                                >
                                                    <IoTrashOutline size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Notification;
