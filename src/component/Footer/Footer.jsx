import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
    const { isDark } = useTheme();

    return (
        <footer className={`w-full ${isDark ? 'bg-slate-800 border-t border-slate-700/60' : 'bg-gradient-to-r from-primary-700 to-primary-800'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-4.5 flex justify-center items-center">
                    <p className={`text-xs font-extrabold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-primary-100/80'}`}>© 2026 PetSphere. All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
