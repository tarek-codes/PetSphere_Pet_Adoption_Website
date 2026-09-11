import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMedicalOutline, IoTrashOutline, IoCalendarOutline, IoDocumentTextOutline, IoChevronBackOutline } from 'react-icons/io5';
import { apiUrl } from '../../utils/api';

const Vaccination = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState({
        name: '',
        vaccinations: []
    });
    const [newVaccination, setNewVaccination] = useState({
        vaccineName: '',
        date: '',
        notes: ''
    });
    const [userPets, setUserPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState('');

    useEffect(() => {
        // Fetch user's pets
        fetch(apiUrl('/user-pets'), {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setUserPets(data);
                if (id) {
                    // If coming from PetDetails, load that specific pet
                    const foundPet = data.find(p => p._id === id);
                    if (foundPet) {
                        setPet({
                            ...foundPet,
                            vaccinations: foundPet.vaccinations || []
                        });
                        setSelectedPetId(foundPet._id);
                    }
                } else if (data.length > 0) {
                    // Default to first pet if no ID provided
                    setPet({
                        ...data[0],
                        vaccinations: data[0].vaccinations || []
                    });
                    setSelectedPetId(data[0]._id);
                }
            })
            .catch(err => {
                console.error('Error fetching user pets:', err);
                toast.error('Failed to load your pets');
            });
    }, [id]);

    const handlePetChange = (e) => {
        const petId = e.target.value;
        setSelectedPetId(petId);
        const selectedPet = userPets.find(p => p._id === petId);
        if (selectedPet) {
            setPet({
                ...selectedPet,
                vaccinations: selectedPet.vaccinations || []
            });
        }
    };

    const handleVaccinationChange = (e) => {
        const { name, value } = e.target;
        setNewVaccination({ ...newVaccination, [name]: value });
    };

    const addVaccination = () => {
        if (!selectedPetId) {
            toast.error('Please select a pet first');
            return;
        }

        if (!newVaccination.vaccineName || !newVaccination.date) {
            toast.error('Please fill in vaccine name and date');
            return;
        }

        fetch(apiUrl(`/add-vaccination/${selectedPetId}`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newVaccination),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.pet && data.pet.vaccinations) {
                    const newVaccinationItem = data.pet.vaccinations[data.pet.vaccinations.length - 1];
                    const updatedVaccinations = [...(pet.vaccinations || []), newVaccinationItem];
                    setPet({ ...pet, vaccinations: updatedVaccinations });
                    setNewVaccination({ vaccineName: '', date: '', notes: '' });
                    toast.success('Vaccination added successfully');
                } else {
                    toast.error('Failed to add vaccination');
                }
            })
            .catch(err => {
                console.error('Error adding vaccination:', err);
                toast.error('Error adding vaccination');
            });
    };

    const cancelVaccination = (vaccinationId) => {
        if (!vaccinationId) {
            toast.error('Invalid vaccination ID');
            return;
        }

        if (window.confirm('Are you sure you want to remove this vaccination record?')) {
            fetch(apiUrl(`/delete-vaccination/${selectedPetId}/${vaccinationId}`), {
                method: 'DELETE',
                credentials: 'include'
            })
                .then((res) => {
                    if (!res.ok) {
                        return res.json().then(errorData => {
                            throw new Error(errorData.message || 'Failed to remove vaccination');
                        });
                    }
                    return res.json();
                })
                .then(() => {
                    toast.success('Vaccination record removed successfully');
                    setPet({
                        ...pet,
                        vaccinations: pet.vaccinations.filter((v) => v._id !== vaccinationId),
                    });
                })
                .catch((err) => {
                    console.error('Error removing vaccination:', err);
                    toast.error(err.message || 'Error removing vaccination');
                });
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-4xl px-4 pt-28 pb-8 mx-auto text-left">
                
                {/* Header Card */}
                <div className="flex items-center justify-between border border-slate-100 px-5 py-4 bg-white rounded-2xl shadow-sm mb-5">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate(id ? `/pet/${id}` : '/pets')}
                            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            title="Go Back"
                        >
                            <IoChevronBackOutline size={16} />
                        </button>
                        <div>
                            <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">Vaccination Management</h1>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Update and view pet medical log histories</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                    
                    {/* Left Panel - Pet select & Form */}
                    <div className="space-y-5 md:col-span-6">
                        
                        {/* Selector if no ID from route */}
                        {!id && (
                            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Select Active Profile</label>
                                <select
                                    value={selectedPetId}
                                    onChange={(e) => handlePetChange(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs font-bold text-slate-700 outline-none transition-all"
                                >
                                    <option value="">Select a pet companion...</option>
                                    {userPets.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} ({p.breed})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {id && pet.name && (
                            <div className="p-4 bg-primary-50/50 border border-primary-100/40 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Currently Editing</p>
                                    <h2 className="text-sm font-black text-primary-900 mt-0.5">{pet.name} ({pet.breed})</h2>
                                </div>
                                <span className="text-xl">🩺</span>
                            </div>
                        )}

                        {/* Add Vaccination Form */}
                        {selectedPetId && (
                            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
                                <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">Add New Record</h2>
                                
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Vaccine Name</label>
                                    <input
                                        type="text"
                                        name="vaccineName"
                                        value={newVaccination.vaccineName}
                                        onChange={handleVaccinationChange}
                                        placeholder="e.g. Rabies, DHPP, Parvovirus"
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Administration Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={newVaccination.date}
                                        onChange={handleVaccinationChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Internal Notes (Optional)</label>
                                    <textarea
                                        name="notes"
                                        value={newVaccination.notes}
                                        onChange={handleVaccinationChange}
                                        placeholder="Side effects, veterinarian advice, booster timeline..."
                                        rows="3"
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all"
                                    />
                                </div>

                                <button
                                    onClick={addVaccination}
                                    className="w-full py-2.5 px-4 text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-primary-500/10"
                                >
                                    <IoMedicalOutline size={14} />
                                    Save Vaccination Entry
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Vaccination history */}
                    <div className="space-y-5 md:col-span-6">
                        {selectedPetId && (
                            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Medical History</h2>
                                
                                {pet.vaccinations && pet.vaccinations.length > 0 ? (
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                                        {pet.vaccinations.filter(v => v && v.vaccineName).map((v) => (
                                            <div 
                                                key={v._id} 
                                                className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/40 flex justify-between gap-3 items-start hover:border-slate-200 transition duration-200"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-xs font-extrabold text-slate-800">{v.vaccineName}</h3>
                                                        <span className="inline-flex px-1.5 py-0.5 text-[8px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">Completed</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                                                        <IoCalendarOutline />
                                                        {v.date ? new Date(v.date).toLocaleDateString() : 'Unknown date'}
                                                    </p>
                                                    {v.notes && (
                                                        <p className="text-[10px] text-slate-500 bg-white border border-slate-100 p-2 rounded-lg italic flex gap-1 items-start mt-1.5 leading-relaxed">
                                                            <IoDocumentTextOutline className="mt-0.5 flex-shrink-0" />
                                                            {v.notes}
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => cancelVaccination(v._id)}
                                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete Entry"
                                                >
                                                    <IoTrashOutline size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                                        <span className="text-2xl">📋</span>
                                        <p className="text-xs text-slate-450 font-bold mt-2">No vaccination records found</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">Submit the form to add pet details</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Vaccination;
