import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetImageUrl, handleImageError } from '../../utils/imageUtils';
import { IoMale, IoFemale } from 'react-icons/io5';
import LocationPicker from '../Profile/LocationPicker';
import "../../PetDetails.css"; // Importing the CSS file
import { apiUrl } from '../../utils/api';


const PetDetails = () => {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [isLost, setIsLost] = useState(false); // new change 
    const [walkedHours, setWalkedHours] = useState(0);
    const [walkedDistance, setWalkedDistance] = useState(0);
    const [showWalkingDataPopup, setShowWalkingDataPopup] = useState(false);
    const [showMedicalDataPopup, setShowMedicalDataPopup] = useState(false);
    const [showHealthCard, setShowHealthCard] = useState(false);
    const [showFullLogPopup, setShowFullLogPopup] = useState(false);
    const [showLostLocationPicker, setShowLostLocationPicker] = useState(false);
    const [lostLocation, setLostLocation] = useState({
        address: '',
        latitude: null,
        longitude: null
    });
    const [medicalData, setMedicalData] = useState({
        weight: '',
        diet: '',
        medicalNotes: ''
    });
    const [isInAdoptionList, setIsInAdoptionList] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
         {/* lost stausthandling  */}
        const fetchPetAndLostStatus = async () => {
            try {
                // Fetch pet details
                const petRes = await fetch(apiUrl(`/pets/${id}`), {
                    credentials: 'include'
                });
                const petData = await petRes.json();
                setPet(petData);

                // Check if pet is lost
                const lostRes = await fetch(apiUrl('/lost-pets'), {
                    credentials: 'include'
                });

                {/* lost stausthandling  */}

                const lostPets = await lostRes.json();
                const isPetLost = lostPets.some(report => 
                    report.petId._id === id && report.status === 'lost'
                );
                setIsLost(isPetLost);

                // Check if pet is in adoption list
                setIsInAdoptionList(petData.adoptionStatus === 'approved');
            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };

        fetchPetAndLostStatus();
        {/* lost stausthandling  change by  -5-10-25 */}

    }, [id]);


    useEffect(() => {
        if (pet) {
            setWalkedHours(0); // Reset walkedHours to 0 when the pet data changes
            setWalkedDistance(0); // Reset walkedDistance to 0 when the pet data changes
        }
    }, [pet]);


    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        if (months < 0) {
            years--;
            months += 12;
        }
        return years > 0 ? `${years} years ${months} months` : `${months} months`;
    };
    
    const handleLogWalkingData = async () => {
        try {
            const response = await fetch(apiUrl(`/update-walking-data/${id}`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ walkedHours, walkedDistance }),
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet.pet); // Update pet state with new walking data
                setShowWalkingDataPopup(false); // Close popup
            } else {
                console.error('Failed to update walking data');
            }
        } catch (err) {
            console.error('Error logging walking data:', err);
        }
    };


    const handleResetWalkingData = async () => {
        try {
            const response = await fetch(apiUrl(`/reset-walking-data/${id}`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet.pet); // Update pet state with reset walking data
            } else {
                console.error('Failed to reset walking data');
            }
        } catch (err) {
            console.error('Error resetting walking data:', err);
        }
    };


    const handleLogMedicalData = async () => {
        try {
            const response = await fetch(apiUrl(`/add-health-log/${id}`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...medicalData,
                    date: new Date().toISOString()
                }),
            });

            if (response.ok) {
                const updatedPet = await response.json();
                setPet(updatedPet.pet);
                setShowMedicalDataPopup(false);
                setMedicalData({ weight: '', diet: '', medicalNotes: '' });
            } else {
                alert('Failed to log medical data.');
            }
        } catch (error) {
            console.error('Error logging medical data:', error);
            alert('An error occurred while logging medical data.');
        }
    };


    const getLatestMedicalRecord = () => {
        if (!pet?.healthLogs || pet.healthLogs.length === 0) return null;
        // Sort health logs by date in descending order and get the first one
        return [...pet.healthLogs].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    };

    const handleLostLocationSelect = async (locationData) => {
        setLostLocation({
            address: locationData.address,
            latitude: locationData.lat,
            longitude: locationData.lon
        });
        setShowLostLocationPicker(false);

        // Now submit the lost pet report with location
        try {
            const res = await fetch(apiUrl(`/report-lost/${id}`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    lostLocation: {
                        address: locationData.address,
                        latitude: locationData.lat,
                        longitude: locationData.lon
                    }
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Pet reported as lost from: ${locationData.address}`);
                setIsLost(true); // Update lost status
                navigate('/lostorfound'); // Redirect to lost pets page
            } else {
                alert(data.message || 'Failed to report pet as lost');
            }
        } catch (err) {
            console.error('Error reporting lost pet:', err);
            alert('Failed to report pet as lost');
        }
    };


    const latestRecord = getLatestMedicalRecord();


    if (!pet) return <p className="text-center text-red-500">Pet not found</p>;


    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-6xl px-4 pt-28 pb-8 mx-auto">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                    {/* Left Column - Takes 8 columns on large screens */}
                    <div className="space-y-5 lg:col-span-8">
                        <div className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100">
                            <div className="p-5">
                                <div className="flex flex-col gap-5 md:flex-row">
                                    <div className="w-full md:w-1/3 flex-shrink-0">
                                        <div className="relative group overflow-hidden rounded-lg shadow-inner">
                                            <img 
                                                src={getPetImageUrl(pet.image)} 
                                                alt={pet.name} 
                                                className="object-cover w-full transition-transform duration-500 transform h-64 rounded-lg group-hover:scale-105"
                                                onError={handleImageError}
                                            />
                                            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/45 to-transparent group-hover:opacity-100 rounded-lg"></div>
                                        </div>
                                    </div>
                                    <div className="w-full space-y-3.5 md:w-2/3 flex flex-col justify-between">
                                        <div className="flex items-center space-x-2.5 text-left">
                                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                                                {pet.name}
                                            </h1>
                                            {/* Gender Icon */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                                                pet.gender === 'Male' 
                                                    ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                                                    : pet.gender === 'Female'
                                                    ? 'bg-gradient-to-br from-pink-500 to-pink-600'
                                                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                            }`}>
                                                {pet.gender === 'Male' ? (
                                                    <IoMale className="w-4 h-4 text-white" />
                                                ) : pet.gender === 'Female' ? (
                                                    <IoFemale className="w-4 h-4 text-white" />
                                                ) : (
                                                    <span className="text-white text-xs font-extrabold">?</span>
                                                )}
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">({pet.breed})</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 rounded-xl bg-primary-50/50 border border-primary-100/40 text-left">
                                                <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Age</p>
                                                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{calculateAge(pet.dob)}</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/40 text-left">
                                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Birth Date</p>
                                                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{new Date(pet.dob).toLocaleDateString()}</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100/40 text-left">
                                                <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Breed</p>
                                                <p className="text-sm font-extrabold text-slate-800 mt-0.5 truncate">{pet.breed}</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100/40 text-left">
                                                <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">Gender</p>
                                                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{pet.gender}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
                                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h3>
                                            <p className="text-xs text-slate-600 leading-relaxed font-light">{pet.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div className="p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100">
                                <h2 className="flex items-center mb-3 text-sm font-black text-slate-800 uppercase tracking-wider">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Vaccination Details
                                </h2>
                                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                                    {pet.vaccinations?.length > 0 ? (
                                        pet.vaccinations.map((vaccine, index) => (
                                            <div key={index} className="p-3 border border-primary-100/40 rounded-xl bg-primary-50/30 text-left">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-xs font-extrabold text-primary-900">{vaccine.vaccineName}</h3>
                                                        <p className="text-[10px] font-semibold text-primary-700 mt-0.5">Date: {new Date(vaccine.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {vaccine.notes && (
                                                    <p className="mt-1.5 text-[10px] text-slate-500 leading-relaxed font-light">{vaccine.notes}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-6 text-center text-xs text-slate-400 font-semibold">No vaccination details available</p>
                                    )}
                                    <button
                                        onClick={() => navigate(`/vaccination/${id}`)}
                                        className="w-full mt-3 py-2 px-3 text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                                    >
                                        Get Vaccination
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100">
                                <h2 className="flex items-center mb-3 text-sm font-black text-slate-800 uppercase tracking-wider">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Vet Appointments
                                </h2>
                                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                                    {pet.vetAppointments?.length > 0 ? (
                                        pet.vetAppointments.map((appointment, index) => (
                                            <div key={index} className="p-3 border border-purple-100/40 rounded-xl bg-purple-50/30 text-left">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-xs font-extrabold text-purple-900">{appointment.doctorName}</h3>
                                                        <p className="text-[10px] font-semibold text-purple-700 mt-0.5 truncate max-w-[140px]">{appointment.address}</p>
                                                    </div>
                                                    <p className="text-[10px] font-semibold text-purple-700">{new Date(appointment.dateOfAppointment).toLocaleDateString()}</p>
                                                </div>
                                                {appointment.notes && (
                                                    <p className="mt-1.5 text-[10px] text-slate-500 leading-relaxed font-light">{appointment.notes}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-6 text-center text-xs text-slate-400 font-semibold">No appointments available</p>
                                    )}
                                    <button
                                        onClick={() => navigate(`/vet-appointment/${id}`)}
                                        className="w-full mt-3 py-2 px-3 text-center text-white bg-purple-600 rounded-xl hover:bg-purple-700 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                                    >
                                        Book an Appointment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Takes 4 columns on large screens */}
                    <div className="space-y-5 lg:col-span-4">
                        <div className="p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100">
                            <div className="flex items-center justify-between mb-3.5">
                                <h2 className="flex items-center text-sm font-black text-slate-800 uppercase tracking-wider">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Walking Stats
                                </h2>
                                <button
                                    onClick={() => setShowWalkingDataPopup(true)}
                                    className="text-primary-500 transition-colors duration-200 hover:text-primary-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-left">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Hours</span>
                                    </div>
                                    <p className="text-base font-black text-slate-800">{pet.totalWalkedHours || 0}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Dist</span>
                                    </div>
                                    <p className="text-base font-black text-slate-800">{pet.totalWalkedDistance || 0} km</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Avg Hours</span>
                                    </div>
                                    <p className="text-base font-black text-slate-800">{(pet.avgWalkedHours || 0).toFixed(1)}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Avg Dist</span>
                                    </div>
                                    <p className="text-base font-black text-slate-800">{(pet.avgWalkedDistance || 0).toFixed(1)} km</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100">
                            <h2 className="flex items-center mb-3.5 text-sm font-black text-slate-800 uppercase tracking-wider text-left">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Latest Health Record
                            </h2>
                            
                            {latestRecord ? (
                                <div className="p-3 border border-emerald-100 rounded-xl bg-emerald-50/20 text-left">
                                    <div className="grid grid-cols-2 gap-3 text-left">
                                        <div className="record-item-custom">
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Date</span>
                                            <span className="block text-xs font-bold text-slate-850">
                                                {new Date(latestRecord.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="record-item-custom">
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Weight</span>
                                            <span className="block text-xs font-bold text-slate-850">{latestRecord.weight} kg</span>
                                        </div>
                                        <div className="record-item-custom">
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Diet</span>
                                            <span className="block text-xs font-bold text-slate-850 truncate max-w-[100px]">{latestRecord.diet}</span>
                                        </div>
                                        <div className="record-item-custom">
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Time</span>
                                            <span className="block text-xs font-bold text-slate-855">
                                                {new Date(latestRecord.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="col-span-2 record-item-custom border-t border-emerald-100/30 pt-2 mt-1">
                                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Medical Notes</span>
                                            <span className="block text-xs font-medium text-slate-650 mt-0.5 leading-relaxed font-light">{latestRecord.medicalNotes}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 text-center rounded-xl bg-slate-50 border border-slate-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-xs text-slate-400 font-semibold">No health records available</p>
                                </div>
                            )}

                            <div className="flex gap-2.5 mt-3.5">
                                <button
                                    onClick={() => setShowFullLogPopup(true)}
                                    className="flex-1 py-2 px-3 text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700 hover:scale-[1.01] transition-all duration-205 font-bold text-xs flex items-center justify-center shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Full Log
                                </button>
                                <button
                                    onClick={() => setShowMedicalDataPopup(true)}
                                    className="flex-1 py-2 px-3 text-center text-white bg-green-600 rounded-xl hover:bg-green-700 hover:scale-[1.01] transition-all duration-205 font-bold text-xs flex items-center justify-center shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Log
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-2.5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl border border-slate-100">
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch(apiUrl(`/request-adoption/${id}`), {
                                            method: 'POST',
                                            credentials: 'include',
                                        });
                                        const data = await res.json();
                                        alert(data.message);
                                        
                                        // Update the local state based on the response
                                        setIsInAdoptionList(data.inAdoptionList);
                                        
                                        // Refresh pet data to update the adoption status
                                        const updatedPetRes = await fetch(apiUrl(`/pets/${id}`), {
                                            credentials: 'include'
                                        });
                                        const updatedPetData = await updatedPetRes.json();
                                        setPet(updatedPetData);
                                    } catch (err) {
                                        alert('Request failed');
                                    }
                                }}
                                className={`w-full py-2 px-3 text-center text-white rounded-xl hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm ${
                                    isInAdoptionList 
                                        ? 'bg-red-500 hover:bg-red-600' 
                                        : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                            >
                                {isInAdoptionList ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel Adoption
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        Submit For Adoption
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => navigate(`/edit-pet/${id}`)}
                                className="w-full py-2 px-3 text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </button>

                            <button
                                onClick={() => setShowLostLocationPicker(true)}
                                className="w-full py-2 px-3 text-center text-white bg-rose-600 rounded-xl hover:bg-rose-700 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                                style={{ display: isLost ? 'none' : 'flex' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Report as Lost
                            </button>

                            <button
                                onClick={async () => {
                                    if (window.confirm('Are you sure you want to remove this pet?')) {
                                        try {
                                            const response = await fetch(apiUrl(`/delete-pet/${id}`), {
                                                method: 'DELETE',
                                                credentials: 'include',
                                            });

                                            if (response.ok) {
                                                alert('Pet removed successfully.');
                                                navigate('/pets');
                                            } else {
                                                alert('Failed to remove pet.');
                                            }
                                        } catch (error) {
                                            console.error('Error removing pet:', error);
                                            alert('An error occurred while removing the pet.');
                                        }
                                    }
                                }}
                                className="w-full py-2 px-3 text-center text-white bg-red-600 rounded-xl hover:bg-red-700 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove Pet
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Walking Data Popup */}
            {showWalkingDataPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-sm p-5 bg-white shadow-xl rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="flex items-center text-base font-black text-slate-800 uppercase tracking-wider">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Edit Walking Data
                            </h2>
                            <button
                                onClick={() => setShowWalkingDataPopup(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
                                <div className="flex items-center mb-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <label htmlFor="walked-hours" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Hours Walked
                                    </label>
                                </div>
                                <input
                                    type="number"
                                    id="walked-hours"
                                    placeholder="Enter Hours Walked"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs text-gray-700 outline-none transition-all"
                                    value={walkedHours}
                                    onChange={(e) => setWalkedHours(Number(e.target.value))}
                                />
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-left">
                                <div className="flex items-center mb-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    <label htmlFor="walked-distance" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Distance (km)
                                    </label>
                                </div>
                                <input
                                    type="number"
                                    id="walked-distance"
                                    placeholder="Enter Distance (km)"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs text-gray-700 outline-none transition-all"
                                    value={walkedDistance}
                                    onChange={(e) => setWalkedDistance(Number(e.target.value))}
                                />
                            </div>

                            <div className="flex gap-2.5 pt-1.5">
                                <button
                                    onClick={handleLogWalkingData}
                                    className="flex-1 py-2 px-3 text-center text-white bg-green-600 rounded-xl hover:bg-green-700 transition duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowWalkingDataPopup(false)}
                                    className="flex-1 py-2 px-3 text-center text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResetWalkingData}
                                    className="flex-1 py-2 px-3 text-center text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showFullLogPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-2xl p-5 bg-white shadow-xl rounded-xl border border-slate-100">
                        <h2 className="mb-4 text-base font-black text-slate-800 uppercase tracking-wider text-left">Health Log History</h2>
                        <div className="max-h-[50vh] overflow-y-auto pr-1.5 space-y-3">
                            {pet.healthLogs?.length > 0 ? (
                                pet.healthLogs.map((log, index) => (
                                    <div key={index} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 text-left">
                                        <div className="grid grid-cols-2 gap-3 text-left">
                                            <div className="record-item-custom">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date:</span>
                                                <span className="block text-xs font-bold text-slate-800">
                                                    {new Date(log.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="record-item-custom">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Weight:</span>
                                                <span className="block text-xs font-bold text-slate-800">{log.weight} kg</span>
                                            </div>
                                            <div className="record-item-custom">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Diet:</span>
                                                <span className="block text-xs font-bold text-slate-800 truncate max-w-[120px]">{log.diet}</span>
                                            </div>
                                            <div className="record-item-custom">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Time:</span>
                                                <span className="block text-xs font-bold text-slate-800">
                                                    {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="col-span-2 record-item-custom border-t border-slate-200/30 pt-1.5 mt-0.5">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Medical Notes</span>
                                                <span className="block text-xs font-light text-slate-600 mt-0.5 leading-relaxed">{log.medicalNotes}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                             ) : (
                                <div className="py-6 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-2 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-xs text-slate-400 font-semibold">No health logs available</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFullLogPopup(false)}
                            className="w-full mt-4 py-2 px-3 text-center text-white bg-slate-600 hover:bg-slate-700 rounded-xl transition duration-200 font-extrabold text-xs"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showMedicalDataPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-sm p-5 bg-white shadow-xl rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="flex items-center text-base font-black text-slate-800 uppercase tracking-wider">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Add Health Log
                            </h2>
                            <button
                                onClick={() => setShowMedicalDataPopup(false)}
                                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
                                <div className="flex items-center mb-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                    <label htmlFor="weight" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Weight (kg)
                                    </label>
                                </div>
                                <input
                                    type="number"
                                    id="weight"
                                    placeholder="Enter Weight"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs text-gray-700 outline-none"
                                    value={medicalData.weight}
                                    onChange={(e) => setMedicalData({ ...medicalData, weight: e.target.value })}
                                />
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
                                <div className="flex items-center mb-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <label htmlFor="diet" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Diet
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    id="diet"
                                    placeholder="Enter Diet"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs text-gray-700 outline-none"
                                    value={medicalData.diet}
                                    onChange={(e) => setMedicalData({ ...medicalData, diet: e.target.value })}
                                />
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-left">
                                <div className="flex items-center mb-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <label htmlFor="medicalNotes" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Medical Notes
                                    </label>
                                </div>
                                <textarea
                                    id="medicalNotes"
                                    placeholder="Enter Medical Notes"
                                    rows="3"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs text-gray-700 outline-none resize-none"
                                    value={medicalData.medicalNotes}
                                    onChange={(e) => setMedicalData({ ...medicalData, medicalNotes: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2.5 pt-1.5">
                                <button
                                    onClick={handleLogMedicalData}
                                    className="flex-1 py-2 px-3 text-center text-white bg-green-600 rounded-xl hover:bg-green-700 transition duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowMedicalDataPopup(false)}
                                    className="flex-1 py-2 px-3 text-center text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition duration-200 font-extrabold text-xs flex items-center justify-center shadow-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Lost Location Picker Popup */}
            {showLostLocationPicker && (
                <LocationPicker
                    onLocationSelect={handleLostLocationSelect}
                    onClose={() => setShowLostLocationPicker(false)}
                    initialLocation={lostLocation}
                    title="Select Lost Location"
                    subtitle="Please select the location where your pet was lost"
                />
            )}
        </div>
    );
};

export default PetDetails;



