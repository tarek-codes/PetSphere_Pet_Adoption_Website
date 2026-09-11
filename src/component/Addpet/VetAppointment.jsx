import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoCalendarOutline, IoLocationOutline, IoDocumentTextOutline, IoTrashOutline, IoChevronBackOutline, IoPersonOutline, IoTimeOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { apiUrl } from '../../utils/api';

const CLINICS_DATA = {
    "Happy Paws Veterinary Clinic": [
        "Dr. Emily Johnson",
        "Dr. Marcus Brody",
        "Dr. Sarah Jenkins",
        "Other / Custom Doctor"
    ],
    "Pet Care & Wellness Hospital": [
        "Dr. John Doe",
        "Dr. Alice Smith",
        "Dr. Robert Lee",
        "Other / Custom Doctor"
    ],
    "City Animal Clinic": [
        "Dr. Clara Barton",
        "Dr. David Vance",
        "Other / Custom Doctor"
    ],
    "Guardian Angels Veterinary": [
        "Dr. Sophia Martinez",
        "Dr. William Chen",
        "Other / Custom Doctor"
    ],
    "Other / Custom Clinic": [
        "Other / Custom Doctor"
    ]
};

const TIME_SLOTS = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM"
];

// Custom Premium Inline Calendar Component
const CustomCalendar = ({ value, onChange }) => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(value ? new Date(value) : today);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDayClick = (day) => {
        const pad = (num) => String(num).padStart(2, '0');
        const formattedDate = `${year}-${pad(month + 1)}-${pad(day)}`;
        onChange(formattedDate);
    };

    const days = [];
    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        days.push({ day: prevTotalDays - i, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, isCurrentMonth: true });
    }

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-left">
            {/* Calendar Nav Header */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                    {monthNames[month]} {year}
                </span>
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-white hover:shadow-sm border border-slate-205 rounded-lg text-slate-500 transition"
                    >
                        <IoChevronBack size={12} />
                    </button>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-white hover:shadow-sm border border-slate-205 rounded-lg text-slate-500 transition"
                    >
                        <IoChevronForward size={12} />
                    </button>
                </div>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {weekdays.map(d => (
                    <span key={d} className="text-[8px] font-bold text-slate-400 uppercase tracking-wider py-1">
                        {d}
                    </span>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((item, idx) => {
                    const pad = (num) => String(num).padStart(2, '0');
                    const itemDateString = `${year}-${pad(month + 1)}-${pad(item.day)}`;
                    const isSelected = item.isCurrentMonth && value === itemDateString;
                    
                    const isToday = item.isCurrentMonth && 
                                    today.getDate() === item.day && 
                                    today.getMonth() === month && 
                                    today.getFullYear() === year;

                    return (
                        <button
                            key={idx}
                            type="button"
                            disabled={!item.isCurrentMonth}
                            onClick={() => handleDayClick(item.day)}
                            className={`py-1.5 rounded-lg text-[9px] font-extrabold transition ${
                                isSelected
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : isToday
                                        ? 'border border-primary-200 text-primary-600 bg-primary-50/20'
                                        : item.isCurrentMonth
                                            ? 'text-slate-700 hover:bg-white hover:shadow-sm border border-transparent'
                                            : 'text-slate-300 cursor-not-allowed opacity-20'
                            }`}
                        >
                            {item.day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const VetAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState({
        name: '',
        vetAppointments: []
    });
    const [selectedClinic, setSelectedClinic] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [customClinic, setCustomClinic] = useState('');
    const [customDoctor, setCustomDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [notes, setNotes] = useState('');

    const [userPets, setUserPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState('');

    useEffect(() => {
        if (id) {
            // Fetch specific pet details directly to support direct URL access
            fetch(apiUrl(`/pets/${id}`), {
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => {
                    if (data && data._id) {
                        setPet({
                            ...data,
                            vetAppointments: data.vetAppointments || []
                        });
                        setSelectedPetId(data._id);
                    }
                })
                .catch(err => console.error('Error fetching pet details:', err));
        }

        // Fetch user's pets
        fetch(apiUrl('/user-pets'), {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                setUserPets(data);
                if (!id && data.length > 0) {
                    const firstPet = data[0];
                    setPet({
                        ...firstPet,
                        vetAppointments: firstPet.vetAppointments || []
                    });
                    setSelectedPetId(firstPet._id);
                }
            })
            .catch(err => console.error('Error fetching pets:', err));
    }, [id]);

    const handlePetChange = (petId) => {
        setSelectedPetId(petId);
        const selectedPet = userPets.find(p => p._id === petId);
        if (selectedPet) {
            setPet({
                ...selectedPet,
                vetAppointments: selectedPet.vetAppointments || []
            });
        }
    };

    const handleClinicChange = (e) => {
        const clinic = e.target.value;
        setSelectedClinic(clinic);
        setSelectedDoctor('');
        setCustomClinic('');
        setCustomDoctor('');
    };

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value);
    };

    const getCombinedDateTime = (dateStr, slotStr) => {
        if (!dateStr || !slotStr) return '';
        const [time, modifier] = slotStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (modifier === 'PM' && hours < 12) {
            hours += 12;
        } else if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        
        const pad = (num) => String(num).padStart(2, '0');
        return `${dateStr}T${pad(hours)}:${pad(minutes)}:00`;
    };

    const addVetAppointment = () => {
        if (!selectedPetId) {
            toast.error('Please select a pet first');
            return;
        }

        const clinicName = selectedClinic === 'Other / Custom Clinic' ? customClinic : selectedClinic;
        const doctorName = selectedDoctor === 'Other / Custom Doctor' ? customDoctor : selectedDoctor;

        if (!clinicName || !doctorName || !appointmentDate || !selectedSlot) {
            toast.error('Please fill in clinic, doctor, date and time slot');
            return;
        }

        const dateOfAppointment = `${appointmentDate}T${selectedSlot}:00`;

        const payload = {
            doctorName,
            address: clinicName,
            dateOfAppointment,
            notes
        };

        fetch(apiUrl(`/add-vet-appointment/${selectedPetId}`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.pet && data.pet.vetAppointments) {
                    const newAppointmentItem = data.pet.vetAppointments[data.pet.vetAppointments.length - 1];
                    const updatedAppointments = [...(pet.vetAppointments || []), newAppointmentItem];
                    setPet({ ...pet, vetAppointments: updatedAppointments });
                    
                    // Reset inputs
                    setSelectedClinic('');
                    setSelectedDoctor('');
                    setCustomClinic('');
                    setCustomDoctor('');
                    setAppointmentDate('');
                    setSelectedSlot('');
                    setNotes('');
                    
                    toast.success('Vet appointment added successfully');
                } else {
                    toast.error('Failed to add appointment');
                }
            })
            .catch(err => {
                console.error('Error adding vet appointment:', err);
                toast.error('Error adding vet appointment');
            });
    };

    const cancelAppointment = (appointmentId) => {
        if (!appointmentId) {
            toast.error('Invalid appointment ID');
            return;
        }

        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            fetch(apiUrl(`/delete-vet-appointment/${selectedPetId}/${appointmentId}`), {
                method: 'DELETE',
                credentials: 'include'
            })
                .then((res) => {
                    if (!res.ok) {
                        return res.json().then(errorData => {
                            throw new Error(errorData.message || 'Failed to cancel appointment');
                        });
                    }
                    return res.json();
                })
                .then(() => {
                    toast.success('Appointment cancelled successfully');
                    setPet({
                        ...pet,
                        vetAppointments: pet.vetAppointments.filter((a) => a._id !== appointmentId),
                    });
                })
                .catch((err) => {
                    console.error('Error cancelling appointment:', err);
                    toast.error(err.message || 'Error cancelling appointment');
                });
        }
    };

    const isUpcoming = (dateString) => {
        if (!dateString) return false;
        return new Date(dateString) > new Date();
    };

    const formatReadableDate = (dateStr) => {
        if (!dateStr) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-4xl px-4 pt-28 pb-8 mx-auto text-left space-y-6">
                
                {/* Header Card */}
                <div className="flex items-center justify-between border border-slate-100 px-5 py-4 bg-white rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate(id ? `/pet/${id}` : '/pets')}
                            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            title="Go Back"
                        >
                            <IoChevronBackOutline size={16} />
                        </button>
                        <div>
                            <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">Vet Appointments</h1>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Book and monitor veterinary consult histories</p>
                        </div>
                    </div>
                </div>

                {/* Selector if no ID from route */}
                {!id && (
                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm max-w-md">
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
                    <div className="p-4 bg-purple-50/50 border border-purple-100/40 rounded-xl flex items-center justify-between max-w-md">
                        <div>
                            <p className="text-[10px] font-bold text-purple-650 uppercase tracking-wider">Currently Booking for</p>
                            <h2 className="text-sm font-black text-purple-900 mt-0.5">{pet.name} ({pet.breed})</h2>
                        </div>
                        <span className="text-xl">🏥</span>
                    </div>
                )}

                {/* Main Wide Rectangular Schedule Appointment Card */}
                {selectedPetId ? (
                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 w-full">
                        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">Schedule Appointment</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Left Column: Dropdowns & Notes */}
                            <div className="space-y-4">
                                {/* Clinic Dropdown */}
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Select Clinic</label>
                                    <select
                                        value={selectedClinic}
                                        onChange={handleClinicChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs font-bold text-slate-750 outline-none transition-all"
                                    >
                                        <option value="">Select a veterinary clinic...</option>
                                        {Object.keys(CLINICS_DATA).map(clinic => (
                                            <option key={clinic} value={clinic}>{clinic}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedClinic === 'Other / Custom Clinic' && (
                                    <div className="space-y-1.5 animate-fadeIn">
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Custom Clinic Name & Address</label>
                                        <input
                                            type="text"
                                            value={customClinic}
                                            onChange={(e) => setCustomClinic(e.target.value)}
                                            placeholder="Enter clinic name or address..."
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all"
                                        />
                                    </div>
                                )}

                                {/* Doctor Dropdown */}
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Select Doctor</label>
                                    <select
                                        value={selectedDoctor}
                                        onChange={handleDoctorChange}
                                        disabled={!selectedClinic}
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs font-bold text-slate-755 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                                    >
                                        <option value="">{selectedClinic ? 'Select doctor in charge...' : 'Please select clinic first'}</option>
                                        {selectedClinic && CLINICS_DATA[selectedClinic].map(doc => (
                                            <option key={doc} value={doc}>{doc}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedDoctor === 'Other / Custom Doctor' && (
                                    <div className="space-y-1.5 animate-fadeIn">
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Custom Doctor Name</label>
                                        <input
                                            type="text"
                                            value={customDoctor}
                                            onChange={(e) => setCustomDoctor(e.target.value)}
                                            placeholder="Enter doctor's full name..."
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all"
                                        />
                                    </div>
                                )}

                                {/* Reason / Notes */}
                                <div className="space-y-1.5">
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Reason / Notes (Optional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Booster shoot, routing checkup, skin allergy, etc..."
                                        rows="3"
                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-xs text-slate-700 outline-none transition-all"
                                    />
                                </div>

                                {/* Booking Button */}
                                <button
                                    onClick={addVetAppointment}
                                    className="w-full py-2.5 px-4 text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-primary-500/10"
                                >
                                    <IoCalendarOutline size={14} />
                                    Book Appointment
                                </button>
                            </div>

                            {/* Right Column: Custom Calendar & Time Slots */}
                            <div className="space-y-4">
                                {/* Calendar Picker */}
                                {selectedDoctor && (
                                    <div className="space-y-1.5">
                                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Appointment Date</label>
                                        <CustomCalendar 
                                            value={appointmentDate}
                                            onChange={(date) => {
                                                setAppointmentDate(date);
                                                setSelectedSlot(''); // Reset slot on date change
                                            }}
                                        />
                                        {appointmentDate && (
                                            <p className="text-[9px] font-extrabold text-primary-600 bg-primary-50/30 border border-primary-100/50 p-2 rounded-lg mt-1">
                                                Selected: {formatReadableDate(appointmentDate)}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Time Slot Grid */}
                                {selectedDoctor && (
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                                            <IoTimeOutline size={12} />
                                            Available Time Slots
                                        </label>
                                        {!appointmentDate && (
                                            <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 p-2 rounded-lg font-bold">
                                                ⚠️ Please select an Appointment Date above first to enable time slots.
                                            </p>
                                        )}
                                        <div className="grid grid-cols-4 gap-2">
                                            {TIME_SLOTS.map((slot) => {
                                                const isSelected = selectedSlot === slot;
                                                return (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        disabled={!appointmentDate}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`py-2 px-1 text-center rounded-lg text-[9px] font-extrabold border transition ${
                                                            isSelected 
                                                                ? 'bg-primary-600 border-primary-600 text-white shadow-sm shadow-primary-500/10' 
                                                                : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        {slot}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-sm w-full">
                        <p className="text-xs text-slate-500 font-semibold">Please select or register a pet profile first</p>
                    </div>
                )}

                {/* History List - Displayed below as a full-width grid section */}
                {selectedPetId && (
                    <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm w-full">
                        <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Upcoming & Past Appointments</h2>
                        
                        {pet.vetAppointments && pet.vetAppointments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {pet.vetAppointments.filter(a => a && a.doctorName).map((a) => (
                                    <div 
                                        key={a._id} 
                                        className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/40 flex justify-between gap-3 items-start hover:border-slate-200 transition duration-200"
                                    >
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-xs font-extrabold text-slate-850 flex items-center gap-1 truncate">
                                                    <IoPersonOutline size={12} className="text-slate-400 flex-shrink-0" />
                                                    {a.doctorName}
                                                </h3>
                                                <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
                                                    isUpcoming(a.dateOfAppointment) 
                                                        ? 'bg-primary-50 text-primary-700 border border-primary-100' 
                                                        : 'bg-slate-100 text-slate-500 border border-slate-150'
                                                }`}>
                                                    {isUpcoming(a.dateOfAppointment) ? 'Upcoming' : 'Archived'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 truncate">
                                                <IoLocationOutline size={12} className="text-slate-450 flex-shrink-0" />
                                                {a.address || 'No location set'}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                                                <IoCalendarOutline size={12} className="text-slate-450 flex-shrink-0" />
                                                {a.dateOfAppointment ? new Date(a.dateOfAppointment).toLocaleString() : 'No date'}
                                            </p>
                                            {a.notes && (
                                                <p className="text-[10px] text-slate-555 bg-white border border-slate-100 p-2 rounded-lg italic flex gap-1 items-start mt-2 leading-relaxed">
                                                    <IoDocumentTextOutline className="mt-0.5 flex-shrink-0" />
                                                    {a.notes}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => cancelAppointment(a._id)}
                                            className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                                            title="Cancel/Remove Appointment"
                                        >
                                            <IoTrashOutline size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                                <span className="text-2xl">📅</span>
                                <p className="text-xs text-slate-450 font-bold mt-2">No vet consults scheduled</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Submit the form to add a booking slot</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default VetAppointment;
