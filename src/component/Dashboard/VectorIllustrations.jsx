import React from 'react';

// 1. Total Users / Manage Users Illustration
export const UsersIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="userGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D00" />
                <stop offset="100%" stopColor="#cc3c00" />
            </linearGradient>
            <linearGradient id="userGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7533" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FF4D00" stopOpacity="0.1" />
            </linearGradient>
            <filter id="userShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.1" />
            </filter>
        </defs>
        {/* Background Decorative Rings */}
        <circle cx="50" cy="50" r="45" stroke="url(#userGrad2)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="38" fill="url(#userGrad2)" />
        
        {/* User 1 (Back Left) */}
        <circle cx="32" cy="42" r="10" fill="#ffc4a0" opacity="0.8" />
        <path d="M16 68C16 58 24 55 32 55C40 55 48 58 48 68" fill="#ffc4a0" opacity="0.8" />
        
        {/* User 2 (Back Right) */}
        <circle cx="68" cy="42" r="10" fill="#ffc4a0" opacity="0.8" />
        <path d="M52 68C52 58 60 55 68 55C76 55 84 58 84 68" fill="#ffc4a0" opacity="0.8" />
        
        {/* User 3 (Front Center) */}
        <g filter="url(#userShadow)">
            <circle cx="50" cy="36" r="12" fill="url(#userGrad1)" />
            <path d="M30 68C30 54 40 50 50 50C60 50 70 54 70 68V72H30V68Z" fill="url(#userGrad1)" />
        </g>
    </svg>
);

// 2. Total Pets / Pets Summary Illustration
export const PetsIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="petGradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="petGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7533" />
                <stop offset="100%" stopColor="#e64400" />
            </linearGradient>
            <linearGradient id="petBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3ee" />
                <stop offset="100%" stopColor="#dbeafe" />
            </linearGradient>
            <filter id="petShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.15" />
            </filter>
        </defs>
        
        {/* Background circular plate */}
        <circle cx="50" cy="50" r="44" fill="url(#petBg)" />
        
        {/* Dog (Left) */}
        <g filter="url(#petShadow)" transform="translate(-2, 0)">
            {/* Dog Head */}
            <path d="M22 68C22 45 32 35 48 35C48 35 49 68 49 68H22Z" fill="url(#petGradOrange)" />
            {/* Dog Ear */}
            <path d="M22 38C20 45 22 55 25 55C28 55 27 42 27 38H22Z" fill="#c2410c" />
            {/* Dog Eye */}
            <circle cx="36" cy="48" r="2.5" fill="#ffffff" />
            <circle cx="37" cy="49" r="1.2" fill="#000000" />
            {/* Dog Nose */}
            <path d="M44 54C46 54 48 56 47 58C46 60 43 59 43 57C43 55 43.5 54 44 54Z" fill="#1e293b" />
        </g>

        {/* Cat (Right) */}
        <g filter="url(#petShadow)" transform="translate(6, 4)">
            {/* Cat Head/Body */}
            <path d="M48 68V42C48 42 58 40 68 48C74 53 74 68 74 68H48Z" fill="url(#petGradBlue)" />
            {/* Cat Ears */}
            <path d="M48 42L52 32L57 41Z" fill="#cc3c00" />
            <path d="M60 41L66 32L69 43Z" fill="#cc3c00" />
            {/* Cat Eyes */}
            <ellipse cx="56" cy="50" rx="2.5" ry="3" fill="#fbbf24" />
            <circle cx="56" cy="50" r="1" fill="#000000" />
            <ellipse cx="65" cy="50" rx="2.5" ry="3" fill="#fbbf24" />
            <circle cx="65" cy="50" r="1" fill="#000000" />
            {/* Cat Nose & Whiskers */}
            <path d="M60 54L58 56H62L60 54Z" fill="#f43f5e" />
            <line x1="53" y1="56" x2="47" y2="55" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="53" y1="58" x2="46" y2="59" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="67" y1="56" x2="73" y2="55" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="67" y1="58" x2="74" y2="59" stroke="#ffffff" strokeWidth="0.8" />
        </g>
    </svg>
);

// 3. User Growth / Performance Illustration
export const GrowthIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="growthGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="growthArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        
        {/* Grid lines */}
        <line x1="15" y1="75" x2="85" y2="75" stroke="#e2e8f0" strokeWidth="1" />
        <line x1="15" y1="55" x2="85" y2="55" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="15" y1="35" x2="85" y2="35" stroke="#f1f5f9" strokeWidth="1" />
        <line x1="15" y1="15" x2="85" y2="15" stroke="#f1f5f9" strokeWidth="1" />
        
        {/* Trend Area */}
        <path d="M15 75L30 60L48 65L65 42L85 20V75H15Z" fill="url(#growthArea)" />
        
        {/* Trend Line */}
        <path d="M15 75L30 60L48 65L65 42L85 20" stroke="url(#growthGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Dots & Glows */}
        <circle cx="30" cy="60" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="48" cy="65" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="65" cy="42" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="85" cy="20" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="url(#glow)" />
        
        {/* Rising Arrow Indicator */}
        <path d="M78 20H85V27" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// 4. Total Reviews / Feedbacks / Stars Illustration
export const ReviewsIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="reviewGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <filter id="reviewShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#d97706" floodOpacity="0.25" />
            </filter>
        </defs>
        
        {/* Circular Shield Outline */}
        <circle cx="50" cy="50" r="42" fill="url(#shieldBg)" stroke="#fde047" strokeWidth="1.5" />
        
        {/* Sparkles / Mini Stars */}
        <path d="M22 28L24 22L26 28L32 30L26 32L24 38L22 32L16 30L22 28Z" fill="#fef08a" />
        <path d="M74 72L75.5 68L77 72L81 73L77 74L75.5 78L74 74L70 73L74 72Z" fill="#fef08a" />
        <path d="M78 26L79 22L80 26L84 27L80 28L79 32L78 28L74 27L78 26Z" fill="#fef08a" />

        {/* Floating Heart Bubbles */}
        <path d="M22 62C20.5 58 24 55 26 58C28 55 31.5 58 30 62L26 66L22 62Z" fill="#f43f5e" opacity="0.6" />

        {/* Big Central Star with shadow */}
        <g filter="url(#reviewShadow)">
            <path d="M50 18L59.3 36.8L80 39.8L65 54.5L68.5 75.2L50 65.5L31.5 75.2L35 54.5L20 39.8L40.7 36.8L50 18Z" fill="url(#reviewGrad)" />
        </g>
    </svg>
);

// 5. Active Chats / Conversations Illustration
export const ChatsIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="chatGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D00" />
                <stop offset="100%" stopColor="#cc3c00" />
            </linearGradient>
            <linearGradient id="chatGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <filter id="chatShadow" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.12" />
            </filter>
        </defs>
        
        {/* Background circular dotted line */}
        <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

        {/* Chat Bubble Left/Back */}
        <g filter="url(#chatShadow)">
            <path d="M22 60C22 44 32 38 48 38C64 38 68 46 68 56C68 66 58 72 48 72C44 72 38 74 34 78C35 74 36 71 35 69C26 69 22 66 22 60Z" fill="url(#chatGrad2)" />
            {/* Dotted typing indicator */}
            <circle cx="38" cy="56" r="2.5" fill="#ffffff" />
            <circle cx="48" cy="56" r="2.5" fill="#ffffff" />
            <circle cx="58" cy="56" r="2.5" fill="#ffffff" />
        </g>

        {/* Chat Bubble Right/Front */}
        <g filter="url(#chatShadow)">
            <path d="M78 46C78 32 69 26 55 26C41 26 36 33 36 42C36 51 45 56 55 56C59 56 64 58 68 62C67 58 66 55 67 53C75 53 78 51 78 46Z" fill="url(#chatGrad1)" />
            {/* Small text mock line inside front bubble */}
            <rect x="45" y="38" width="20" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
            <rect x="47" y="44" width="12" height="2.5" rx="1.25" fill="#ffffff" opacity="0.9" />
        </g>
    </svg>
);

// 6. Lost & Found Reports Illustration
export const LostFoundIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.4" />
            </linearGradient>
            <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="#be123c" floodOpacity="0.3" />
            </filter>
        </defs>

        {/* Map Grid Background mock */}
        <rect x="15" y="15" width="70" height="70" rx="15" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
        <path d="M15 45H85M45 15V85M15 65C30 55 55 75 85 55" stroke="#f1f5f9" strokeWidth="2" />
        
        {/* Radar concentric pulse circles */}
        <circle cx="50" cy="42" r="28" stroke="#fecdd3" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.7" />
        <circle cx="50" cy="42" r="16" stroke="#fda4af" strokeWidth="1" opacity="0.5" />

        {/* Red Map Pin with Paw symbol */}
        <g filter="url(#pinShadow)">
            <path d="M50 58C46 52 40 46 40 38C40 31.3 44.5 28 50 28C55.5 28 60 31.3 60 38C60 46 54 52 50 58Z" fill="url(#mapGrad)" />
            {/* Small white paw inside the map pin */}
            <circle cx="50" cy="38" r="3" fill="#ffffff" />
            <circle cx="45" cy="33" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="31.5" r="1.5" fill="#ffffff" />
            <circle cx="55" cy="33" r="1.5" fill="#ffffff" />
        </g>

        {/* Magnifying Glass Overlay */}
        <g transform="translate(48, 48)">
            {/* Glass Handle */}
            <line x1="14" y1="14" x2="28" y2="28" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="14" y1="14" x2="28" y2="28" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Glass Rim */}
            <circle cx="8" cy="8" r="10" fill="url(#glassGrad)" stroke="#475569" strokeWidth="2.5" />
            <circle cx="8" cy="8" r="8" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
        </g>
    </svg>
);

// 7. Vaccinations Due / Health Records Illustration
export const VaccinationIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="syringeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF4D00" />
                <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="fluidGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="syringeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="3" stdDeviation="2" floodOpacity="0.1" />
            </filter>
        </defs>

        {/* Background halo */}
        <circle cx="50" cy="50" r="40" fill="#f0fdf4" stroke="#dcfce7" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="32" fill="#ecfdf5" />

        {/* Syringe Illustration */}
        <g filter="url(#syringeShadow)" transform="translate(18, 18) rotate(-45, 32, 32)">
            {/* Needle */}
            <line x1="32" y1="5" x2="32" y2="18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            {/* Needle base hub */}
            <rect x="29" y="18" width="6" height="3" rx="1" fill="#64748b" />
            
            {/* Syringe Tube */}
            <rect x="24" y="21" width="16" height="36" rx="4" fill="#ffffff" fillOpacity="0.85" stroke="url(#syringeGrad)" strokeWidth="2" />
            
            {/* Plunger Shaft inside */}
            <line x1="32" y1="46" x2="32" y2="68" stroke="#94a3b8" strokeWidth="3" />
            {/* Plunger Thumb Press */}
            <ellipse cx="32" cy="68" rx="8" ry="2" fill="url(#syringeGrad)" />
            {/* Plunger Rubber Tip */}
            <rect x="25" y="44" width="14" height="4" fill="#475569" />

            {/* Vaccine Fluid level */}
            <rect x="25" y="25" width="14" height="19" fill="url(#fluidGrad)" />
            {/* Measurement lines */}
            <line x1="28" y1="29" x2="31" y2="29" stroke="#ffffff" strokeWidth="1" />
            <line x1="28" y1="35" x2="31" y2="35" stroke="#ffffff" strokeWidth="1" />
            <line x1="28" y1="41" x2="31" y2="41" stroke="#ffffff" strokeWidth="1" />
        </g>
        
        {/* Floating cross & bubbles */}
        <path d="M72 26H78M75 23V29" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="35" r="3" fill="#ff7533" opacity="0.6" />
        <circle cx="28" cy="25" r="1.5" fill="#FF4D00" opacity="0.4" />
        <circle cx="75" cy="70" r="4" fill="#34d399" opacity="0.5" />
    </svg>
);

// 8. Adoption Slots / House / Hearts Illustration
export const AdoptionSlotsIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="houseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <filter id="houseShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="1" dy="4" stdDeviation="3" floodOpacity="0.15" />
            </filter>
        </defs>

        {/* Circular cloud base */}
        <circle cx="50" cy="50" r="42" fill="#f0f9ff" stroke="#e0f2fe" strokeWidth="1.5" />
        
        {/* House Shadow Group */}
        <g filter="url(#houseShadow)">
            {/* House Base */}
            <rect x="28" y="44" width="44" height="34" rx="4" fill="url(#houseGrad)" />
            {/* Roof */}
            <path d="M22 45L50 20L78 45H22Z" fill="url(#roofGrad)" strokeLinejoin="round" />
            {/* Doorway */}
            <path d="M43 78V62C43 58 46 55 50 55C54 55 57 58 57 62V78H43Z" fill="#ffffff" />
            {/* Window */}
            <circle cx="50" cy="38" r="4.5" fill="#fef08a" />
        </g>
        
        {/* Floating Heart above house */}
        <path d="M72 26C70 22 75 19 77 22C79 19 84 22 82 26L77 31L72 26Z" fill="#f43f5e" />
    </svg>
);

// 9. Calendar / Appointments / Timeline Illustration
export const CalendarIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="calHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#3730a3" />
            </linearGradient>
            <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="calShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.12" />
            </filter>
        </defs>

        {/* Calendar Body */}
        <g filter="url(#calShadow)">
            <rect x="20" y="20" width="52" height="56" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            {/* Red/Indigo Header */}
            <path d="M20 28C20 23.5 23.5 20 28 20H64C68.5 20 72 23.5 72 28V36H20V28Z" fill="url(#calHeader)" />
            {/* Binder Rings */}
            <rect x="30" y="14" width="4" height="10" rx="2" fill="#94a3b8" />
            <rect x="44" y="14" width="4" height="10" rx="2" fill="#94a3b8" />
            <rect x="58" y="14" width="4" height="10" rx="2" fill="#94a3b8" />

            {/* Grid Dots representing dates */}
            <circle cx="32" cy="46" r="3" fill="#cbd5e1" />
            <circle cx="44" cy="46" r="3" fill="#cbd5e1" />
            <circle cx="56" cy="46" r="3" fill="#cbd5e1" />
            <circle cx="32" cy="56" r="3" fill="#cbd5e1" />
            <circle cx="44" cy="56" r="3" fill="#4f46e5" /> {/* Selected date */}
            <circle cx="56" cy="56" r="3" fill="#cbd5e1" />
            <circle cx="32" cy="66" r="3" fill="#cbd5e1" />
            <circle cx="44" cy="66" r="3" fill="#cbd5e1" />
        </g>

        {/* Small Clock Overlay (Bottom Right) */}
        <g filter="url(#calShadow)" transform="translate(54, 52)">
            <circle cx="18" cy="18" r="15" fill="url(#clockGrad)" stroke="#ffffff" strokeWidth="2" />
            {/* Clock Hands */}
            <line x1="18" y1="18" x2="18" y2="10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="18" x2="24" y2="18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <circle cx="18" cy="18" r="1.5" fill="#3730a3" />
        </g>
    </svg>
);

// 10. Nutrition / Food Bowl / Health Score Illustration
export const NutritionIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <filter id="bowlShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodOpacity="0.1" />
            </filter>
        </defs>

        <circle cx="50" cy="50" r="42" fill="#fffbeb" />

        {/* Food kibble pile */}
        <path d="M30 55C30 45 40 40 50 40C60 40 70 45 70 55H30Z" fill="#a16207" opacity="0.8" />
        <circle cx="44" cy="46" r="2.5" fill="#713f12" />
        <circle cx="56" cy="45" r="3" fill="#713f12" />
        <circle cx="50" cy="48" r="2.5" fill="#854d0e" />

        {/* Bowl */}
        <g filter="url(#bowlShadow)">
            <path d="M22 55H78L72 74C71 77 68 79 64 79H36C32 79 29 77 28 74L22 55Z" fill="url(#bowlGrad)" />
            {/* Bowl Rim */}
            <ellipse cx="50" cy="55" rx="28" ry="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            
            {/* Bone emblem on bowl */}
            <g transform="translate(42, 63) scale(0.8)">
                <rect x="5" y="5" width="10" height="4" rx="2" fill="url(#boneGrad)" />
                <circle cx="5" cy="5" r="2.5" fill="url(#boneGrad)" />
                <circle cx="5" cy="9" r="2.5" fill="url(#boneGrad)" />
                <circle cx="15" cy="5" r="2.5" fill="url(#boneGrad)" />
                <circle cx="15" cy="9" r="2.5" fill="url(#boneGrad)" />
            </g>
        </g>

        {/* Floating Green Leaves representing Nutrition */}
        <path d="M72 32C72 26 77 28 80 25C80 29 76 33 72 32Z" fill="#10b981" />
        <path d="M24 35C24 29 19 31 16 28C16 32 20 36 24 35Z" fill="#10b981" />
    </svg>
);

// 11. Inbox / Adoption Proposals / Notification Tray
export const AdoptionRequestsIllustration = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="trayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="envelopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
            <filter id="inboxShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="1" dy="4" stdDeviation="3" floodOpacity="0.15" />
            </filter>
        </defs>

        <circle cx="50" cy="50" r="42" fill="#eef2ff" stroke="#e0e7ff" strokeWidth="1.5" />

        {/* Envelope coming out of Tray */}
        <g filter="url(#inboxShadow)">
            {/* Envelope */}
            <rect x="30" y="24" width="40" height="26" rx="3" fill="url(#envelopeGrad)" stroke="#cbd5e1" strokeWidth="1" />
            {/* Envelope flap lines */}
            <path d="M30 24L50 38L70 24" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Heart Seal */}
            <path d="M50 40C49 38.5 51.5 37 52.5 38.5C53.5 37 56 38.5 55 40L52.5 42.5L50 40Z" fill="#ef4444" />

            {/* Tray Background Wall */}
            <path d="M22 45V72H78V45" stroke="url(#trayGrad)" strokeWidth="3.5" strokeLinecap="round" />

            {/* Paper stack inside tray */}
            <rect x="27" y="52" width="46" height="12" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
            
            {/* Tray Front Cover with cutout */}
            <path d="M20 54H36C38 54 40 56 42 59C44 62 46 64 50 64C54 64 56 62 58 59C60 56 62 54 64 54H80V74C80 77 77 80 74 80H26C23 80 20 77 20 74V54Z" fill="url(#trayGrad)" />
        </g>
    </svg>
);
