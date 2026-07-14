import React from 'react';
import { Link } from 'react-router-dom';
import { getPetImageUrl, handleImageError } from '../../utils/imageUtils';
import { IoMale, IoFemale } from 'react-icons/io5';

const PetCard = ({ pet }) => {
    if (!pet) {
        return null;
    }

    const {
        _id,
        name,
        age,
        breed,
        gender,
        image,
        description
    } = pet;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full text-left">
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img 
                    src={getPetImageUrl(image)} 
                    alt={name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={handleImageError}
                    loading="lazy"
                />
                <span className={`absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    gender === 'Male' 
                        ? 'bg-primary-50 text-primary-700 border border-primary-100' 
                        : gender === 'Female' 
                            ? 'bg-pink-50 text-pink-700 border border-pink-100' 
                            : 'bg-slate-50 text-slate-700 border border-slate-100'
                }`}>
                    {gender === 'Male' ? (
                        <>Male <IoMale className="ml-1 w-3 h-3 text-primary-500" /></>
                    ) : gender === 'Female' ? (
                        <>Female <IoFemale className="ml-1 w-3 h-3 text-pink-500" /></>
                    ) : (
                        'Unknown'
                    )}
                </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-black text-slate-800 tracking-tight">{name}</h2>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{breed}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed min-h-[2.25rem]">{description || 'No description provided.'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
                        <div className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100/60 text-slate-600">
                            <span className="text-[8px] text-slate-400 block uppercase tracking-wider mb-0.5">Age</span>
                            {age || 'N/A'}
                        </div>
                        <div className="px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100/60 text-slate-600">
                            <span className="text-[8px] text-slate-400 block uppercase tracking-wider mb-0.5">Gender</span>
                            {gender || 'N/A'}
                        </div>
                    </div>

                    <Link
                        to={`/pet/${_id}`}
                        className="block w-full py-2.5 px-4 text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700 hover:scale-[1.01] transition-all duration-200 font-extrabold text-xs shadow-sm shadow-primary-500/10"
                    >
                        View Profile 🐾
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PetCard;
