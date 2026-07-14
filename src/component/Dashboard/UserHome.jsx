import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../provider/Authprovider';
import { useTheme } from '../../context/ThemeContext';
import { getPetImageUrl, handleImageError } from '../../utils/imageUtils';

import {
    FaPaw, FaComments, FaCalendarAlt, FaSearch, FaBell, FaCheck, FaTimes,
    FaUser, FaSignOutAlt, FaNotesMedical, FaHeart, FaMapMarkerAlt, FaBriefcaseMedical,
    FaExclamationTriangle, FaHospital, FaHome, FaSyringe, FaInbox, FaDog
} from 'react-icons/fa';
import {
    IoGridOutline, IoBriefcaseOutline, IoChevronDownOutline, IoChevronUpOutline,
    IoPersonOutline, IoLogOutOutline, IoChatbubbleOutline, IoMoon, IoSunny,
    IoMenu, IoClose, IoPawOutline, IoChatbubblesOutline, IoHeartOutline,
    IoMegaphoneOutline, IoNotificationsOutline
} from 'react-icons/io5';
import {
    VaccinationIllustration,
    AdoptionSlotsIllustration,
    ChatsIllustration,
    CalendarIllustration,
    PetsIllustration,
    NutritionIllustration,
    GrowthIllustration,
    AdoptionRequestsIllustration
} from './VectorIllustrations';

// Subcomponents imported inline for tab switching
import Pets from '../Addpet/Pets';
import ChatList from '../Chat/ChatList';
import Adoption from '../Adoption/Adoption';
import LostOrfound from '../LostOrFound/LostOrfound';
import Notification from '../Notification/Notification';
import UserProfile from '../Profile/UserProfile';

/* ─── Animated Illustration Cat SVG ──────────────────────── */
const SittingCat = () => (
    <svg
        viewBox="0 0 80 90"
        width="52"
        height="58"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="select-none"
    >
        {/* Tail — animated wag, connected to body left side */}
        <path d="M18 72 Q4 60 6 46 Q8 38 16 42" stroke="#FF8050" strokeWidth="5" strokeLinecap="round" fill="none">
            <animate attributeName="d" dur="1.8s" repeatCount="indefinite"
                values="M18 72 Q4 60 6 46 Q8 38 16 42;M18 72 Q0 58 4 44 Q6 36 12 40;M18 72 Q4 60 6 46 Q8 38 16 42" />
        </path>
        {/* Body */}
        <ellipse cx="40" cy="66" rx="22" ry="18" fill="#FF8050" />
        {/* Belly */}
        <ellipse cx="40" cy="68" rx="13" ry="12" fill="#FFCDB8" opacity="0.6" />
        {/* Head */}
        <circle cx="40" cy="32" r="22" fill="#FF8050" />
        {/* Left ear */}
        <polygon points="22,18 26,2 34,18" fill="#FF8050" />
        {/* Right ear */}
        <polygon points="46,18 54,2 58,18" fill="#FF8050" />
        {/* Inner left ear */}
        <polygon points="24,18 26,6 32,18" fill="#FFBDAD" />
        {/* Inner right ear */}
        <polygon points="48,18 54,6 56,18" fill="#FFBDAD" />
        {/* Eyes — happy blink */}
        <g>
            <path d="M28 30 Q32 25 36 30" stroke="#1a1005" strokeWidth="2.5" fill="none" strokeLinecap="round">
                <animate attributeName="d" dur="3.5s" repeatCount="indefinite"
                    values="M28 30 Q32 25 36 30;M28 30 L36 30;M28 30 Q32 25 36 30" keyTimes="0;0.05;0.1" />
            </path>
            <path d="M44 30 Q48 25 52 30" stroke="#1a1005" strokeWidth="2.5" fill="none" strokeLinecap="round">
                <animate attributeName="d" dur="3.5s" repeatCount="indefinite"
                    values="M44 30 Q48 25 52 30;M44 30 L52 30;M44 30 Q48 25 52 30" keyTimes="0;0.05;0.1" />
            </path>
        </g>
        {/* Cheek blush */}
        <ellipse cx="22" cy="36" rx="5" ry="3" fill="#FFB3A0" opacity="0.55" />
        <ellipse cx="58" cy="36" rx="5" ry="3" fill="#FFB3A0" opacity="0.55" />
        {/* Nose */}
        <polygon points="39,35 41,38 37,38" fill="#FF8FB0" />
        {/* Mouth */}
        <path d="M37 38 Q40 42 43 38" stroke="#e87090" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Left whiskers */}
        <line x1="8" y1="33" x2="30" y2="35" stroke="#ccc" strokeWidth="1" opacity="0.7" />
        <line x1="8" y1="37" x2="30" y2="37" stroke="#ccc" strokeWidth="1" opacity="0.7" />
        {/* Right whiskers */}
        <line x1="50" y1="35" x2="72" y2="33" stroke="#ccc" strokeWidth="1" opacity="0.7" />
        <line x1="50" y1="37" x2="72" y2="37" stroke="#ccc" strokeWidth="1" opacity="0.7" />
        {/* Left paw */}
        <ellipse cx="26" cy="83" rx="8" ry="5" fill="#FF8050" />
        {/* Right paw */}
        <ellipse cx="54" cy="83" rx="8" ry="5" fill="#FF8050" />
    </svg>
);

const UserHome = () => {
    const { user, logout, userInfo } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [pets, setPets] = useState([]);
    const [petNames, setPetNames] = useState('');
    const [petData, setPetData] = useState({
        totalPets: 0,
        upcomingVaccinations: [],
        upcomingAppointments: []
    });
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adoptionLimitStatus, setAdoptionLimitStatus] = useState(null);
    const [chatsCount, setChatsCount] = useState(0);
    const [isPetMenuOpen, setIsPetMenuOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState('');
    const [selectedSlotIdx, setSelectedSlotIdx] = useState(23);
    const [weatherData, setWeatherData] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();


    // Fetch adoption requests
    const fetchAdoptionRequests = async () => {
        try {
            const response = await fetch('http://localhost:3000/owner-adoption-requests', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAdoptionRequests(data);
            }
        } catch (error) {
            console.error('Error fetching adoption requests:', error);
        }
    };

    // Fetch adoption limit status
    const fetchAdoptionLimitStatus = async () => {
        try {
            const response = await fetch('http://localhost:3000/adoption-limit-status', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAdoptionLimitStatus(data);
            }
        } catch (error) {
            console.error('Error fetching adoption limit status:', error);
        }
    };

    // Fetch active chats count
    const fetchChatsCount = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/chats', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setChatsCount((data.chats || []).length);
            }
        } catch (error) {
            console.error('Error fetching chats count:', error);
        }
    };

    // Handle adoption request approval/rejection
    const handleAdoptionRequest = async (requestId, status) => {
        try {
            const response = await fetch(`http://localhost:3000/review-adoption/${requestId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();
            alert(data.message);
            fetchAdoptionRequests();
        } catch (error) {
            console.error('Error handling adoption request:', error);
            alert('Failed to process request');
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    useEffect(() => {
        const fetchPetData = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch('http://localhost:3000/pets', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch pets');
                }

                const petsList = await response.json();
                setPets(petsList);

                // Format pet names for subtitle: "bella & rocky"
                if (petsList.length > 0) {
                    const names = petsList.slice(0, 3).map(p => p.name.toLowerCase()).join(' & ');
                    setPetNames(names + (petsList.length > 3 ? ' & others' : ''));
                }

                // Process vaccinations and appointments
                const vaccinations = [];
                const appointments = [];

                petsList.forEach(pet => {
                    if (pet.vaccinations) {
                        pet.vaccinations.forEach(vac => {
                            vaccinations.push({
                                ...vac,
                                petName: pet.name,
                                petImage: pet.image,
                                date: new Date(vac.date)
                            });
                        });
                    }
                    if (pet.vetAppointments) {
                        pet.vetAppointments.forEach(apt => {
                            appointments.push({
                                ...apt,
                                petName: pet.name,
                                petImage: pet.image,
                                dateOfAppointment: new Date(apt.dateOfAppointment)
                            });
                        });
                    }
                });

                // Sort by date
                vaccinations.sort((a, b) => a.date - b.date);
                appointments.sort((a, b) => a.dateOfAppointment - b.dateOfAppointment);

                setPetData({
                    totalPets: petsList.length,
                    upcomingVaccinations: vaccinations,
                    upcomingAppointments: appointments
                });
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPetData();
        fetchAdoptionRequests();
        fetchAdoptionLimitStatus();
        fetchChatsCount();
    }, [user]);

    // Fetch real weather from Open-Meteo (free, no API key)
    useEffect(() => {
        const fetchWeather = async (lat, lon) => {
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&temperature_unit=celsius&timezone=auto`;
                const res = await fetch(url);
                const data = await res.json();
                const c = data.current;
                setWeatherData({
                    temp: Math.round(c.temperature_2m),
                    humidity: c.relative_humidity_2m,
                    precip: c.precipitation_probability,
                    code: c.weather_code
                });
            } catch (err) {
                console.error('Weather fetch failed:', err);
            } finally {
                setWeatherLoading(false);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                () => {
                    // Fallback: Dhaka coordinates if user denies location
                    fetchWeather(23.8103, 90.4125);
                },
                { timeout: 8000 }
            );
        } else {
            fetchWeather(23.8103, 90.4125);
        }
    }, []);

    const getSidebarLinkClass = (tabId) =>
        `flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all w-full text-left ${activeTab === tabId
            ? 'bg-primary-600 text-white shadow-md'
            : 'text-primary-100/70 hover:text-white hover:bg-primary-900/30'
        }`;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-spinner loading-md text-primary-600"></span>
                    <p className="text-sm font-semibold text-slate-500">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-100 border border-slate-200 rounded-3xl p-6 text-center space-y-4 shadow-xl">
                    <div className="text-xl text-red-500 flex items-center justify-center">
                        <FaExclamationTriangle />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Dashboard Error</h3>
                    <p className="text-sm text-slate-650">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Main dashboard view (scaled to look uniform, clean and spacious)
    const renderDashboardOverview = () => {
        const activePet = pets.find(p => p._id === selectedPetId) || pets[0];

        // Map WMO weather codes to pet-themed status messages
        const getPetStatusFromCode = (code, temp) => {
            if (code === 0) return temp > 25
                ? "Paw-fectly sunny ☀️: Great weather for a long walk and chase in the park! 🐾"
                : "Clear skies and cool air 🌟: A fresh-nose day — perfect fetch weather!";
            if (code <= 3) return "Partly cloudy with tail-winds ⛅: Comfortable for outdoor sniffs and fetch! 🐶";
            if (code <= 48) return "Foggy morning 🌫️: Keep your paws close — low-visibility sniff patrol today!";
            if (code <= 57) return "Light drizzle 🌦️: A little damp — indoor zoomies recommended! 🐾";
            if (code <= 67) return "It's raining cats and dogs 🌧️🐱🐶: Keep paws dry and enjoy a warm indoor play session!";
            if (code <= 77) return "Snowball weather ❄️🐕: Your pup might zoom in the snow — try a cozy blanket after!";
            if (code <= 82) return "Rain showers 🌂: High puddle risk! Dry towel on standby for wet paws!";
            if (code <= 99) return "Thunderstorm alert ⛈️🐱: Keep your pets indoors — comfort cuddles required!";
            return "Interesting skies today 🌈: Check outside with your pet for a weather adventure!";
        };

        const getTempNote = (temp) => {
            if (temp <= 10) return 'Sweater weather 🧥';
            if (temp <= 18) return 'Cool breeze 🍃';
            if (temp <= 25) return 'Paw-perfect temp 🐾';
            if (temp <= 32) return 'Warm belly temp ☀️';
            return 'Hot paws alert 🔥';
        };

        const getHumidityNote = (h) => {
            if (h <= 30) return 'Dry snout day';
            if (h <= 55) return 'Whisker-safe 😸';
            if (h <= 75) return 'Humid fur alert';
            return 'Soggy paws alert 🌧️';
        };

        const getPrecipNote = (p) => {
            if (p <= 5) return 'No muddy paws';
            if (p <= 30) return 'Low drip risk';
            if (p <= 65) return 'Bring pet raincoat';
            return 'High puddle risk 💦';
        };

        const weather = weatherData
            ? {
                status: getPetStatusFromCode(weatherData.code, weatherData.temp),
                temp: `${weatherData.temp}°C`,
                tempNote: getTempNote(weatherData.temp),
                humidity: `${weatherData.humidity}%`,
                humidityNote: getHumidityNote(weatherData.humidity),
                precip: `${weatherData.precip}%`,
                precipNote: getPrecipNote(weatherData.precip)
            }
            : null;

        const generateActivitySlots = (pet) => {
            if (!pet) return Array(24).fill(null).map((_, idx) => {
                const d = new Date(); d.setDate(d.getDate() - idx);
                return { date: d, minutes: 0, distance: 0 };
            });
            const slots = [];
            const totalHours = pet.totalWalkedHours || 0;
            const totalDistance = pet.totalWalkedDistance || 0;

            // Seed values using deterministic math on the pet ID to make it consistent for each pet
            const seed = pet._id ? pet._id.toString().charCodeAt(0) + pet._id.toString().charCodeAt(1) : 42;

            for (let i = 0; i < 24; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);

                // Determine if this day had activity (e.g. 70% chance of walk)
                const hasWalk = ((seed + i) % 10) < 7;
                let minutes = 0;
                let distance = 0;

                if (hasWalk) {
                    // Generate minutes based on total hours
                    const baseMin = totalHours > 0 ? (totalHours * 60) / 12 : 25;
                    minutes = Math.round(baseMin * (0.6 + Math.sin(seed + i) * 0.3));
                    if (minutes < 10) minutes = 15;

                    // Generate distance based on total distance
                    const baseDist = totalDistance > 0 ? totalDistance / 12 : 1.8;
                    distance = parseFloat((baseDist * (0.6 + Math.cos(seed + i) * 0.3)).toFixed(1));
                    if (distance < 0.2) distance = 0.5;
                }

                slots.push({ date: d, minutes, distance });
            }
            return slots;
        };

        const activitySlots = generateActivitySlots(activePet);

        return (
            <>
                {/* Constrained width wrapper — leaves breathing room on both sides */}
                <div className="max-w-5xl mx-auto w-full space-y-6">

                    {/* Big Title Greet + Inline Weather — relative so cat can walk over it */}
                    <div className="space-y-1 text-left border-b border-primary-50/60 pb-4 mb-4">

                        {/* h1 row — cat sits inline next to the greeting */}
                        <div className="flex items-end gap-5">
                            <h1 className="text-3xl font-extrabold text-primary-600 tracking-tight uppercase leading-tight">
                                Good Morning, {userInfo?.name?.split(' ')[0] || 'User'}
                            </h1>
                            {/* Sitting cat — inline beside the heading */}
                            <div className="flex-shrink-0 mb-0.5" aria-hidden="true">
                                <SittingCat />
                            </div>
                        </div>

                        {/* Weather subtitle row */}
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-semibold text-slate-500">
                                {weather ? weather.status : 'Sniffing the air for weather data...'}
                            </p>
                            {!weatherLoading && weather && (
                                <>
                                    <span className="h-3 w-[1px] bg-slate-300 hidden sm:inline-block"></span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-2 py-0.5">
                                        🌡️ {weather.temp}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-2 py-0.5">
                                        💧 {weather.humidity}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-2 py-0.5">
                                        🌧️ {weather.precip}
                                    </span>
                                </>
                            )}
                            {weatherLoading && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary-500/70">
                                    <span className="loading loading-spinner loading-xs"></span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Top Metrics Row — mixed radii: 2xl for stat chips */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Metric 1: Total Pets — squared-ish with rounded-2xl */}
                        <div className="bg-white dark:from-gray-900 dark:to-gray-800 border border-primary-200 dark:border-gray-700/60 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[85px] group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <span className="text-[11px] font-extrabold text-primary-600 uppercase tracking-wider">Total Pets</span>
                                <PetsIllustration className="w-10 h-10 -mt-1 -mr-1 opacity-95 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2 text-left">
                                <h3 className="text-3xl font-extrabold text-primary-500">{pets.length}</h3>
                                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider block">
                                    Registered companions
                                </span>
                            </div>
                        </div>

                        {/* Metric 2: Own Pets — more pill-like rounded-3xl */}
                        <div className="bg-white dark:from-gray-900 dark:to-gray-800 border border-primary-200 dark:border-gray-700/60 rounded-3xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[85px] group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <span className="text-[11px] font-extrabold text-primary-600 uppercase tracking-wider">Own Pets</span>
                                <AdoptionSlotsIllustration className="w-10 h-10 -mt-1 -mr-1 opacity-95 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>
                            <div className="mt-2 flex flex-col items-start gap-0.5 text-left">
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-extrabold text-primary-500 font-black">
                                        {pets.filter(p => p.adoptionStatus !== 'adopted').length}
                                    </h3>
                                    <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider block">
                                        Active Owned
                                    </span>
                                </div>
                                <span className="text-[9px] font-extrabold text-primary-400 uppercase tracking-wider">
                                    Limit left: {adoptionLimitStatus ? adoptionLimitStatus.remainingSlots : (3 - pets.length)} / {adoptionLimitStatus?.limit || 3}
                                </span>
                            </div>
                        </div>

                        {/* Metric 3: Adopted Pets — rounded-2xl */}
                        <div className="bg-white dark:from-gray-900 dark:to-gray-800 border border-primary-200 dark:border-gray-700/60 rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[85px] group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <span className="text-[11px] font-extrabold text-primary-600 uppercase tracking-wider">Adopted Pets</span>
                                <ChatsIllustration className="w-10 h-10 -mt-1 -mr-1 opacity-95 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-2 text-left">
                                <h3 className="text-3xl font-extrabold text-primary-500 font-black">
                                    {pets.filter(p => p.adoptionStatus === 'adopted').length}
                                </h3>
                                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider block">
                                    Placed in forever homes
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Middle Grid — Appointments & Vaccinations with rounded-3xl */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Box 1: Appointments — rounded-3xl (more rounded) */}
                        <div className="bg-white dark:bg-gray-900 border border-primary-200 dark:border-gray-700/60 rounded-3xl p-4 flex flex-col justify-between h-[240px] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-extrabold text-primary-600 uppercase tracking-wider">Appointments</h3>
                                <CalendarIllustration className="w-10 h-10 -mr-1 opacity-95 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>
                            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[160px] pr-1 mt-2.5">
                                {petData.upcomingAppointments.map((apt, idx) => (
                                    <div key={idx} className="bg-primary-50 rounded-lg p-2.5 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded bg-primary-100 overflow-hidden border border-primary-200 flex-shrink-0">
                                                {apt.petImage ? (
                                                    <img
                                                        src={getPetImageUrl(apt.petImage)}
                                                        alt={apt.petName}
                                                        className="w-full h-full object-cover"
                                                        onError={handleImageError}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-primary-500 font-bold">🐾</div>
                                                )}
                                            </div>
                                            <div className="text-left min-w-0">
                                                <h4 className="text-[12px] font-bold text-primary-700 truncate">{apt.petName}</h4>
                                                <p className="text-[9px] font-semibold text-primary-400 mt-0.5">
                                                    {new Date(apt.dateOfAppointment).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(apt.dateOfAppointment).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 text-[9px] font-bold text-white bg-primary-500 rounded">
                                            Vet Visit
                                        </span>
                                    </div>
                                ))}
                                {petData.upcomingAppointments.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-primary-300 space-y-1 py-10">
                                        <FaCalendarAlt className="text-base" />
                                        <p className="text-[12px] font-bold">No appointments scheduled</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Box 2: Vaccinations Pets Timeline (Timeline layout) */}
                        <div className="bg-white dark:bg-gray-900 border border-primary-200 dark:border-gray-700/60 rounded-xl p-4 flex flex-col justify-between h-[240px] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-extrabold text-primary-600 uppercase tracking-wider">Vaccinations Pets Timeline</h3>
                                <CalendarIllustration className="w-10 h-10 -mr-1 opacity-90 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>
                            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary-200/60 flex-1 overflow-y-auto max-h-[160px] pr-1 mt-2.5 pl-1">
                                {petData.upcomingVaccinations.map((vac, idx) => (
                                    <div key={idx} className="relative pl-7 text-left space-y-0.5">
                                        {/* Timeline Node */}
                                        <div className="absolute left-[7px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary-500 border-2 border-white shadow-sm"></div>

                                        <span className="text-[10px] font-bold text-primary-400 block uppercase tracking-wider">
                                            {new Date(vac.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                        <h4 className="text-[12px] font-bold text-primary-700">{vac.petName}</h4>
                                        <p className="text-[12px] text-primary-500 font-light truncate">
                                            Vaccine: {vac.vaccineName} {vac.notes ? `(${vac.notes})` : ''}
                                        </p>
                                    </div>
                                ))}
                                {petData.upcomingVaccinations.length === 0 && (
                                    <div className="py-10 text-center text-primary-300 space-y-1 pl-4">
                                        <FaCalendarAlt className="text-base mx-auto block" />
                                        <p className="text-[12px] font-semibold">No vaccinations on timeline</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row — Activity & Adoption with mixed radii */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Activity Tracker — rounded-2xl (squarish-rounded) */}
                        <div className="bg-white dark:bg-gray-900 border border-primary-200 dark:border-gray-700/60 rounded-2xl p-4 flex flex-col justify-between h-[250px] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <div className="text-left">
                                    <h3 className="text-sm font-extrabold text-primary-600 dark:text-gray-100 uppercase tracking-wider">Activity Tracker</h3>
                                    <p className="text-[9px] font-semibold text-primary-400 uppercase tracking-wider mt-0.5">
                                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} — Walk History
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <GrowthIllustration className="w-8 h-8 opacity-95 group-hover:scale-105 transition-transform duration-300 flex-shrink-0" />
                                    <select
                                        value={selectedPetId || (pets[0]?._id || '')}
                                        onChange={(e) => setSelectedPetId(e.target.value)}
                                        className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                                    >
                                        {pets.map(pet => (
                                            <option key={pet._id} value={pet._id}>{pet.name}</option>
                                        ))}
                                        {pets.length === 0 && <option value="">No pets</option>}
                                    </select>
                                </div>
                            </div>

                            {/* 24 Slots Grid (6 columns x 4 rows) */}
                            <div className="grid grid-cols-6 gap-1.5 pt-1.5 flex-1 items-center max-h-[110px] overflow-y-auto">
                                {activitySlots.map((slot, idx) => {
                                    const isActive = selectedSlotIdx === idx;
                                    const hasWalked = slot.minutes > 0;
                                    const dayNum = slot.date.getDate();
                                    const dayName = slot.date.toLocaleDateString('en', { weekday: 'short' });

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSlotIdx(idx)}
                                            className={`h-7 rounded flex flex-col items-center justify-center leading-none transition-all relative ${isActive
                                                    ? 'bg-primary-500 text-white ring-2 ring-primary-400/50 shadow shadow-primary-500/20 scale-105 z-10'
                                                    : hasWalked
                                                        ? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                                                        : 'bg-primary-50 text-primary-300 hover:bg-primary-100'
                                                }`}
                                            title={`${slot.date.toLocaleDateString('en', { month: 'short', day: 'numeric', weekday: 'short' })}: ${slot.minutes} mins, ${slot.distance} km`}
                                        >
                                            <span className="text-[9px] font-extrabold leading-none">{dayNum}</span>
                                            <span className="text-[7px] font-semibold leading-none opacity-75">{dayName}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Stats Summary for selected slot */}
                            {activitySlots[selectedSlotIdx] && (
                                <div className="mt-1.5 bg-primary-50 border border-primary-200 rounded-lg p-2 flex justify-between items-center text-left">
                                    <div>
                                        <span className="text-[9px] font-bold text-primary-500 uppercase block">
                                            {activitySlots[selectedSlotIdx].date.toLocaleDateString('en', { month: 'short', day: 'numeric', weekday: 'short' })} Walk Duration
                                        </span>
                                        <span className="text-[12px] font-bold text-primary-700">
                                            {activitySlots[selectedSlotIdx].minutes > 0
                                                ? `${activitySlots[selectedSlotIdx].minutes} mins`
                                                : 'Rest day / No activity'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-bold text-primary-500 uppercase block">Distance Covered</span>
                                        <span className="text-[12px] font-bold text-primary-700">
                                            {activitySlots[selectedSlotIdx].distance > 0
                                                ? `${activitySlots[selectedSlotIdx].distance} km`
                                                : '0.0 km'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Box 4: Adoption Requests — rounded-3xl (rounder) */}
                        <div className="bg-white dark:bg-gray-900 border border-primary-200 dark:border-gray-700/60 rounded-3xl p-4 flex flex-col justify-between h-[250px] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-extrabold text-primary-600 dark:text-gray-100 uppercase tracking-wider text-left">Adoption Requests</h3>
                                <AdoptionRequestsIllustration className="w-10 h-10 -mr-1 opacity-95 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                            </div>

                            {adoptionRequests.length > 0 ? (
                                <div className="space-y-2 flex-1 overflow-y-auto max-h-[160px] pr-1 mt-2.5">
                                    {adoptionRequests.map((req, idx) => (
                                        <div key={idx} className="p-2.5 bg-primary-50 rounded-lg flex items-center justify-between shadow-sm">
                                            <div className="text-left min-w-0">
                                                <h4 className="text-[12px] font-bold text-primary-700 truncate">{req.petId?.name}</h4>
                                                <p className="text-[10px] text-primary-400 truncate">Buyer: {req.requestedBy?.name}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleAdoptionRequest(req._id, 'approved')}
                                                    className="w-6 h-6 bg-emerald-600 text-white rounded flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                                                >
                                                    <FaCheck size={9} />
                                                </button>
                                                <button
                                                    onClick={() => handleAdoptionRequest(req._id, 'rejected')}
                                                    className="w-6 h-6 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                                                >
                                                    <FaTimes size={9} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-primary-300 space-y-1 py-10">
                                    <FaInbox className="text-base block" />
                                    <p className="text-[12px] font-semibold">No active requests</p>
                                </div>
                            )}
                        </div>
                    </div>{/* end bottom row */}
                </div>{/* end max-w-5xl wrapper */}
            </>
        );
    };

    // Conditional tab content rendering
    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboardOverview();
            case 'pets':
                return <Pets />;
            case 'chats':
                return <ChatList />;
            case 'adoption':
                return <Adoption />;
            case 'lostorfound':
                return <LostOrfound />;
            case 'notification':
                return <Notification />;
            case 'profile':
                return <UserProfile />;
            default:
                return renderDashboardOverview();
        }
    };

    const renderSidebarContent = (isMobile) => {
        const handleTabClick = (tabId) => {
            setActiveTab(tabId);
            if (isMobile) {
                setIsSidebarOpen(false);
            }
        };

        return (
            <>
                <div>
                    {/* Brand/Logo */}
                    <div className="flex items-center justify-between px-2 mb-8 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-primary-600 flex items-center justify-center flex-shrink-0">
                                <FaDog className="w-7 h-7 text-primary-600" />
                            </div>
                            <span className="font-black text-lg text-primary-900 tracking-tight">PetSphere</span>
                        </div>
                        {isMobile && (
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                            >
                                <IoClose size={20} />
                            </button>
                        )}
                    </div>

                    {/* Navigation Menu (Tab Switches) */}
                    <nav className="flex flex-col space-y-2.5 text-left">
                        <button
                            onClick={() => handleTabClick('dashboard')}
                            className={`flex items-center gap-3.5 px-3 py-3 text-xs font-black rounded-xl transition w-full text-left ${activeTab === 'dashboard'
                                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/10'
                                    : 'text-primary-800/70 hover:text-primary-900 hover:bg-primary-50/70'
                                }`}
                        >
                            <IoGridOutline size={18} />
                            <span>Dashboard</span>
                        </button>

                        {/* Collapsible Group - Pet Services */}
                        <div className="space-y-1.5 pt-1">
                            <button
                                onClick={() => setIsPetMenuOpen(!isPetMenuOpen)}
                                className="flex items-center justify-between w-full px-3 py-2.5 text-xs font-black text-primary-800/70 hover:text-primary-900 transition"
                            >
                                <div className="flex items-center gap-3.5">
                                    <IoBriefcaseOutline size={18} />
                                    <span>Pet Services</span>
                                </div>
                                {isPetMenuOpen ? <IoChevronUpOutline size={11} className="text-primary-500/80" /> : <IoChevronDownOutline size={11} className="text-primary-500/80" />}
                            </button>

                            {isPetMenuOpen && (
                                <div className="relative pl-7 ml-4.5 border-l border-primary-100 space-y-1.5 mt-1 text-[11px] font-extrabold">
                                    {/* My Pets */}
                                    <button
                                        onClick={() => handleTabClick('pets')}
                                        className={`group relative flex items-center justify-between w-full py-2 px-3 rounded-lg transition ${activeTab === 'pets'
                                                ? 'bg-primary-600 text-white font-extrabold shadow-sm'
                                                : 'text-primary-800/70 hover:text-primary-900 hover:bg-primary-50/60'
                                            }`}
                                    >
                                        <span className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-primary-100" />
                                        <div className="flex items-center gap-2.5">
                                            <IoPawOutline size={15} className="flex-shrink-0" />
                                            <span>My Pets</span>
                                        </div>
                                    </button>

                                    {/* Chats */}
                                    <button
                                        onClick={() => handleTabClick('chats')}
                                        className={`group relative flex items-center justify-between w-full py-2 px-3 rounded-lg transition ${activeTab === 'chats'
                                                ? 'bg-primary-600 text-white font-extrabold shadow-sm'
                                                : 'text-primary-800/70 hover:text-primary-900 hover:bg-primary-50/60'
                                            }`}
                                    >
                                        <span className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-primary-100" />
                                        <div className="flex items-center gap-2.5">
                                            <IoChatbubblesOutline size={15} className="flex-shrink-0" />
                                            <span>Chats</span>
                                        </div>
                                        {chatsCount > 0 && (
                                            <span className="bg-primary-100 text-primary-900 rounded px-1.5 py-0.5 text-[8px] font-black">
                                                {chatsCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Adoptions */}
                                    <button
                                        onClick={() => handleTabClick('adoption')}
                                        className={`group relative flex items-center justify-between w-full py-2 px-3 rounded-lg transition ${activeTab === 'adoption'
                                                ? 'bg-primary-600 text-white font-extrabold shadow-sm'
                                                : 'text-primary-800/70 hover:text-primary-900 hover:bg-primary-50/60'
                                            }`}
                                    >
                                        <span className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-primary-100" />
                                        <div className="flex items-center gap-2.5">
                                            <IoHeartOutline size={15} className="flex-shrink-0" />
                                            <span>Adoptions</span>
                                        </div>
                                    </button>

                                    {/* Lost & Found */}
                                    <button
                                        onClick={() => handleTabClick('lostorfound')}
                                        className={`group relative flex items-center justify-between w-full py-2 px-3 rounded-lg transition ${activeTab === 'lostorfound'
                                                ? 'bg-primary-600 text-white font-extrabold shadow-sm'
                                                : 'text-primary-800/70 hover:text-primary-900 hover:bg-primary-50/60'
                                            }`}
                                    >
                                        <span className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-primary-100" />
                                        <div className="flex items-center gap-2.5">
                                            <IoMegaphoneOutline size={15} className="flex-shrink-0" />
                                            <span>Lost & Found</span>
                                        </div>
                                    </button>

                                    {/* Reminders */}
                                    <button
                                        onClick={() => handleTabClick('notification')}
                                        className={`group relative flex items-center justify-between w-full py-2 px-3 rounded-lg transition ${activeTab === 'notification'
                                                ? 'bg-primary-600 text-white font-extrabold shadow-sm'
                                                : 'text-primary-800/70 hover:text-primary-900 hover:bg-primary-50/60'
                                            }`}
                                    >
                                        <span className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-primary-100" />
                                        <div className="flex items-center gap-2.5">
                                            <IoNotificationsOutline size={15} className="flex-shrink-0" />
                                            <span>Reminders</span>
                                        </div>
                                        {petData.upcomingVaccinations.length > 0 && (
                                            <span className="bg-primary-100 text-primary-900 rounded px-1.5 py-0.5 text-[8px] font-black">
                                                {petData.upcomingVaccinations.length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* My Profile */}
                        <button
                            onClick={() => handleTabClick('profile')}
                            className={`flex items-center gap-3.5 px-3 py-3 text-xs font-black rounded-xl transition w-full text-left mt-2 ${activeTab === 'profile'
                                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/10'
                                    : 'text-primary-800/70 hover:text-primary-900 hover:bg-primary-50/70'
                                }`}
                        >
                            <IoPersonOutline size={18} />
                            <span>My Profile</span>
                        </button>
                    </nav>
                </div>

                {/* Bottom Tools & Switchers */}
                <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3.5 px-1">
                        {/* Help Circular Button */}
                        <button
                            type="button"
                            onClick={() => alert("Support Center is ready to assist!")}
                            className="w-10 h-10 rounded-full bg-primary-50 hover:bg-primary-100 border border-primary-100/50 flex items-center justify-center text-primary-600 hover:text-primary-800 transition"
                            title="Help Center"
                        >
                            <IoChatbubbleOutline size={18} />
                        </button>

                        {/* Dark/Light mode switcher */}
                        <div className="bg-primary-50/60 dark:bg-gray-800 p-1 border border-primary-100/40 dark:border-gray-700 rounded-2xl flex gap-1">
                            <button
                                type="button"
                                className={`p-1 rounded-lg transition ${isDark
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-primary-650/70 hover:text-primary-800 hover:bg-primary-100/30'
                                    }`}
                                title="Dark Mode"
                                onClick={toggleTheme}
                            >
                                <IoMoon size={13} />
                            </button>
                            <button
                                type="button"
                                className={`p-1 rounded-lg transition ${!isDark
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-gray-700'
                                    }`}
                                title="Light Mode"
                                onClick={toggleTheme}
                            >
                                <IoSunny size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Footer Profile Block */}
                    <div className="pt-4 border-t border-primary-100/60 space-y-3.5">
                        <button
                            onClick={() => handleTabClick('profile')}
                            className="flex items-center gap-3.5 text-left w-full hover:bg-primary-50/70 p-2.5 rounded-xl transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary-600 border border-primary-200 flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0 shadow-sm">
                                {(userInfo?.name?.charAt(0) || 'U').toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-black truncate text-primary-900 uppercase tracking-tight">{userInfo?.name || 'Owner'}</h4>
                                <p className="text-[10px] text-primary-500/80 truncate font-bold uppercase tracking-wider">{userInfo?.email?.split('@')[0]}</p>
                            </div>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 text-xs font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-100/50 rounded-xl transition-all"
                        >
                            <IoLogOutOutline size={14} />
                            <span>SIGN OUT</span>
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-gray-950 transition-colors duration-200">
            {/* Mobile Sidebar Backdrop Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity duration-300"
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div className={`fixed inset-y-4 left-4 z-50 w-60 bg-white dark:bg-gray-900 dark:border-gray-700/60 text-primary-800/70 dark:text-gray-200 p-5 pt-7 flex flex-col justify-between rounded-[24px] border border-primary-100 h-[calc(100vh-2rem)] transition-all duration-300 shadow-2xl lg:hidden ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
                }`}>
                {renderSidebarContent(true)}
            </div>

            {/* Desktop Left Sidebar (Rounded Corner Card Type) */}
            <div className="w-60 bg-white dark:bg-gray-900 dark:border-gray-700/60 text-primary-800/70 dark:text-gray-200 p-5 pt-7 hidden lg:flex flex-col justify-between rounded-[24px] border border-primary-100 h-[calc(100vh-2rem)] my-4 ml-4 flex-shrink-0 shadow-sm transition-colors duration-200">
                {renderSidebarContent(false)}
            </div>

            {/* Main Scrollable Center Panel */}
            <div className="flex-1 p-6 lg:p-7 overflow-y-auto h-full space-y-6 text-left dark:text-gray-100 transition-colors duration-200">
                {/* Top Nav Row */}
                <div className="flex justify-between items-center gap-4">
                    {/* Mobile Sidebar Hamburger Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 text-slate-650 hover:bg-slate-100/70 border border-slate-200/50 rounded-xl transition cursor-pointer"
                        title="Open Navigation Menu"
                    >
                        <IoMenu size={20} />
                    </button>

                    {/* Welcome Banner */}
                    <div className="flex items-center gap-3 ml-auto">
                        <button
                            onClick={() => setActiveTab('notification')}
                            className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary-500 cursor-pointer transition-colors relative"
                        >
                            <FaBell className="w-[22px] h-[22px]" />
                            {adoptionRequests.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center border border-primary-200 text-sm">
                                {(userInfo?.name?.charAt(0) || 'U').toUpperCase()}
                            </div>
                            <div className="text-left leading-tight hidden sm:block">
                                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Welcome Back</p>
                                <h4 className="text-xs font-bold text-slate-800">{userInfo?.name || 'Owner'}</h4>
                            </div>
                        </button>
                    </div>
                </div>


                {/* Dynamically Render Switched Tab Contents */}
                {renderTabContent()}

            </div>
        </div>
    );
};

export default UserHome;