import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PetCard from './PetCard';
import { apiUrl } from '../../utils/api';

const Pets = () => {
    const [pets, setPets] = useState([]);
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        fetch(apiUrl('/pets'), {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    console.log('Fetched pets data:', data); // Debugging log
                    setPets(data);
                } else {
                    console.warn('Not an array:', data);
                    setPets([]);
                }
            })
            .catch(err => {
                console.error('Error fetching pets:', err);
                setPets([]);
            });
    }, []);

    const calculateAge = useCallback((dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }, []);

    const sortedPets = useMemo(() => {
        if (!sortOption) return pets;
        
        const [key, order] = sortOption.split('-');
        return [...pets].sort((a, b) => {
            if (key === 'name') {
                return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (key === 'age') {
                return order === 'asc' ? calculateAge(a.dob) - calculateAge(b.dob) : calculateAge(b.dob) - calculateAge(a.dob);
            }
            return 0;
        });
    }, [pets, sortOption, calculateAge]);

    const handleSortChange = useCallback((e) => {
        setSortOption(e.target.value);
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="px-4 pt-28 pb-8 mx-auto max-w-6xl">
                {/* Header Section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="text-left">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            My Pets Gallery
                        </h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            Manage your pet profiles and track details ({sortedPets.length} registered)
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label htmlFor="sort" className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by:</label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={handleSortChange}
                            className="px-3 py-1.5 text-xs font-bold text-slate-650 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 shadow-sm min-w-[150px]"
                        >
                            <option value="">Sort Option</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="age-asc">Age (Ascending)</option>
                            <option value="age-desc">Age (Descending)</option>
                        </select>
                    </div>
                </div>

                {/* Pet Cards Grid */}
                {sortedPets.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {sortedPets.map((pet) => (
                            <div key={pet._id} className="h-full flex">
                                <PetCard pet={pet} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 border border-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🐾</span>
                        </div>
                        <p className="text-sm font-black text-slate-850 mb-1">
                            No registered pets found
                        </p>
                        <p className="text-xs text-slate-400 font-medium mb-5">
                            Get started by adding your first pet companion profile.
                        </p>
                        <button
                            onClick={() => window.location.href = '/addpet'}
                            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-primary-500/10 transition duration-200 inline-flex items-center gap-1.5 mx-auto"
                        >
                            <svg 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="3"
                            >
                                <path d="M12 5v14"/>
                                <path d="M5 12h14"/>
                            </svg>
                            <span>Register Your First Pet</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pets;
