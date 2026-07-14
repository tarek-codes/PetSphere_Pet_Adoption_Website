import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPetImageUrl, handleImageError } from '../../utils/imageUtils';
import { IoCloseOutline, IoCalendarOutline, IoPersonOutline, IoLocationOutline, IoChatbubbleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

// Redesigned light premium slate modal & container styles
const modalStyles = {
    overlay: `fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300`,
    container: `bg-white rounded-2xl shadow-md p-5 w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col border border-slate-100 transform transition-all duration-300`,
    header: `flex justify-between items-center mb-5 pb-3.5 border-b border-slate-100`,
    title: `text-sm font-black text-slate-800 uppercase tracking-wider`,
    closeButton: `p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-lg transition`,
    commentList: `flex-1 overflow-y-auto mb-5 pr-1 space-y-2.5`,
    commentCard: `p-3 bg-slate-50 border border-slate-100/65 rounded-xl hover:bg-slate-50/30 transition-colors`,
    avatar: `w-7 h-7 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs`,
    commentMeta: `flex items-center gap-1.5 mb-1 text-[10px]`,
    commentText: `text-xs text-slate-600 leading-relaxed text-left`,
    inputContainer: `pt-3.5 border-t border-slate-100 flex gap-2.5 items-center`,
    input: `flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-xs bg-white text-slate-750 placeholder-slate-400 transition-all`,
    button: `px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all font-extrabold text-xs flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`
};

const CommentModal = ({ isOpen, onClose, comments, reportId, onAddComment }) => {
    const [newComment, setNewComment] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            onClick={handleClose}
            className={`${modalStyles.overlay} ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        >
            <div 
                className={`${modalStyles.container} ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className={modalStyles.header}>
                    <h3 className={modalStyles.title}>Comments Directory</h3>
                    <button onClick={onClose} className={modalStyles.closeButton}>
                        <IoCloseOutline size={18} />
                    </button>
                </div>
                
                <div className={`${modalStyles.commentList} pr-1`}>
                    {comments?.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className={modalStyles.commentCard}>
                                <div className="flex items-start gap-3">
                                    <div className={modalStyles.avatar}>
                                        {(comment?.user?.name?.charAt(0)?.toUpperCase()) || '?'}
                                    </div>
                                    <div className="flex-1">
                                        <div className={modalStyles.commentMeta}>
                                            <span className="font-extrabold text-slate-800">{comment?.user?.name || 'Anonymous'}</span>
                                            <span className="font-bold text-slate-400">
                                                {comment?.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                                            </span>
                                        </div>
                                        <p className={modalStyles.commentText}>{comment?.text || ''}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2 border border-slate-100 rounded-xl bg-slate-50/50">
                            <span className="text-2xl">💬</span>
                            <p className="text-xs font-bold text-slate-450">No community feedback listed yet</p>
                        </div>
                    )}
                </div>

                <div className={modalStyles.inputContainer}>
                    <input 
                        type="text" 
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Share a lead or drop a supportive note..."
                        className={modalStyles.input}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && newComment.trim()) {
                                onAddComment(reportId, newComment);
                                setNewComment('');
                            }
                        }}
                    />
                    <button 
                        onClick={() => {
                            if (newComment.trim()) {
                                onAddComment(reportId, newComment);
                                setNewComment('');
                            }
                        }}
                        disabled={!newComment.trim()}
                        className={modalStyles.button}
                    >
                        <span>Post</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const LostOrFound = () => {
    const [lostPets, setLostPets] = useState([]);
    const [comments, setComments] = useState({});
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchLostPets();
    }, []);

    useEffect(() => {
        if (selectedReport) {
            fetchComments(selectedReport);
        }
    }, [selectedReport]);

    const fetchLostPets = async () => {
        try {
            const response = await fetch('http://localhost:3000/lost-pets', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setLostPets(data);
                data.forEach(report => {
                    fetchComments(report._id);
                });
            }
        } catch (error) {
            console.error('Error fetching lost pets:', error);
        }
    };

    const handleMarkAsFound = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:3000/mark-found/${reportId}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                alert('Pet marked as found successfully!');
                fetchLostPets();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to mark pet as found');
            }
        } catch (error) {
            console.error('Error marking pet as found:', error);
            alert('Failed to mark pet as found');
        }
    };

    const fetchComments = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:3000/reports/${reportId}/comments`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setComments(prev => ({ ...prev, [reportId]: data }));
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (reportId, text) => {
        try {
            const response = await fetch(`http://localhost:3000/reports/${reportId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ text })
            });

            if (response.ok) {
                fetchComments(reportId);
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-6xl mx-auto px-4 pt-28 pb-8 text-left">
                
                {/* Header Section */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Lost & Found Bulletins</h1>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            Help lost pet companions find their way back home ({lostPets.length} reports active)
                        </p>
                    </div>
                </div>

                {/* Pet Cards Grid */}
                {lostPets.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {lostPets.map((report) => {
                            const { _id, petId, requestedBy, requestedAt, reviewedAt, status } = report;

                            return (
                                <div key={_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
                                    {/* Top section: image and badge */}
                                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 flex-shrink-0">
                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                status === 'found' 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                                            }`}>
                                                {status === 'found' ? 'Found' : 'Missing'}
                                            </span>
                                        </div>

                                        {/* Pet Image */}
                                        {petId?.image ? (
                                            <img
                                                src={getPetImageUrl(petId.image)}
                                                alt={petId?.name || 'Unknown pet'}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
                                                onError={handleImageError}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <span className="text-2xl">🐾</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Mid section: details and text */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black text-slate-800 tracking-tight">{petId?.name || 'Unknown Pet'}</h3>
                                            <p className="text-[10px] text-primary-600 bg-primary-50/50 border border-primary-100/40 px-2 py-0.5 rounded-full inline-block font-bold">{petId?.breed || 'Breed Unknown'}</p>
                                            <p className="text-xs text-slate-500 line-clamp-2 mt-2.5 leading-relaxed h-8">{petId?.description || 'No description provided.'}</p>
                                        </div>
                                        
                                        {/* Report metadata block */}
                                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 space-y-1.5 mt-3.5">
                                            <p className="flex items-center gap-1.5">
                                                <IoCalendarOutline className="text-slate-400" />
                                                Reported: <span className="text-slate-750 font-extrabold">{requestedAt ? new Date(requestedAt).toLocaleDateString() : '-'}</span>
                                            </p>
                                            <p className="flex items-center gap-1.5">
                                                <IoPersonOutline className="text-slate-400" />
                                                By: <span className="text-slate-750 font-extrabold">{requestedBy?.name || 'Anonymous'}</span>
                                            </p>
                                            {report.lostLocation && report.lostLocation.address && (
                                                <p className="flex items-center gap-1.5 text-rose-600">
                                                    <IoLocationOutline className="text-rose-500" />
                                                    Lost near: <span className="font-extrabold truncate max-w-[120px]" title={report.lostLocation.address}>{report.lostLocation.address}</span>
                                                </p>
                                            )}
                                            {status === 'found' && reviewedAt && (
                                                <p className="flex items-center gap-1.5 text-emerald-700">
                                                    <IoCheckmarkCircleOutline className="text-emerald-600" />
                                                    Found: <span className="font-extrabold">{new Date(reviewedAt).toLocaleDateString()}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="space-y-2 pt-3">
                                            {status === 'lost' && (
                                                <button
                                                    onClick={() => handleMarkAsFound(_id)}
                                                    className="w-full py-2 px-3 text-center text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition duration-200 font-extrabold text-xs shadow-sm flex items-center justify-center gap-1"
                                                >
                                                    🎯 Mark as Found
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setSelectedReport(_id);
                                                    setIsModalOpen(true);
                                                }}
                                                className="w-full py-2 px-3 text-center text-primary-600 bg-white border border-primary-200 rounded-xl hover:bg-primary-50 transition duration-200 font-extrabold text-xs flex items-center justify-center gap-1"
                                            >
                                                <IoChatbubbleOutline size={12} />
                                                Comments ({comments[_id]?.length || 0})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm max-w-md mx-auto">
                        <div className="w-14 h-14 bg-primary-50 border border-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                            🔍
                        </div>
                        <h3 className="text-sm font-black text-slate-850">No bulletin reports listed</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">Check back later or register a missing pet profile in settings.</p>
                    </div>
                )}
            </div>

            {/* Comment Modal */}
            <CommentModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedReport(null);
                }}
                comments={comments[selectedReport] || []}
                reportId={selectedReport}
                onAddComment={handleAddComment}
            />
        </div>
    );
};

export default LostOrFound;