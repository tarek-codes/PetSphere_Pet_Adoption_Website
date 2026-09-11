import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { getPetImageUrl, handleImageError } from '../../utils/imageUtils';
import { IoMale, IoFemale, IoChevronBackOutline, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { apiUrl, API_BASE_URL } from '../../utils/api';

const Chat = () => {
    const { chatId, petId } = useParams();
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [petInfo, setPetInfo] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [typing, setTyping] = useState(false);
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize socket connection and load chat info
    useEffect(() => {
        let activeSocket = null;

        const initializeChat = async () => {
            try {
                setError(null);
                
                // 1. Get current user info
                const userResponse = await fetch(apiUrl('/user-info'), {
                    credentials: 'include'
                });
                
                if (!userResponse.ok) {
                    setError('Please log in to access chat');
                    navigate('/login');
                    return;
                }
                
                const userData = await userResponse.json();
                const currentUserId = userData.user._id;
                setCurrentUser(userData.user);

                // 2. Handle new chat creation & redirect if petId is provided
                if (petId) {
                    const chatResponse = await fetch(apiUrl(`/api/chat/pet/${petId}`), {
                        credentials: 'include'
                    });
                    
                    if (!chatResponse.ok) {
                        setError('Failed to initiate chat session');
                        setLoading(false);
                        return;
                    }
                    
                    const chatData = await chatResponse.json();
                    navigate(`/chat/${chatData.chat._id}`, { replace: true });
                    return;
                }

                // 3. Load existing chat by chatId
                if (chatId) {
                    const chatResponse = await fetch(apiUrl(`/api/chat/${chatId}`), {
                        credentials: 'include'
                    });
                    
                    if (!chatResponse.ok) {
                        if (chatResponse.status === 404) {
                            setError('Chat session not found');
                        } else if (chatResponse.status === 403) {
                            setError('You do not have access to this conversation');
                        } else {
                            setError('Failed to load chat details');
                        }
                        setLoading(false);
                        return;
                    }
                    
                    const chatData = await chatResponse.json();
                    setChatInfo(chatData.chat);
                    setMessages(chatData.chat.messages || []);

                    // Get pet info from chat data
                    if (chatData.chat.petId) {
                        if (typeof chatData.chat.petId === 'object' && chatData.chat.petId.name) {
                            setPetInfo(chatData.chat.petId);
                        } else {
                            try {
                                const petResponse = await fetch(apiUrl(`/pets/${chatData.chat.petId}`), {
                                    credentials: 'include'
                                });
                                if (petResponse.ok) {
                                    const petData = await petResponse.json();
                                    setPetInfo(petData);
                                }
                            } catch (err) {
                                console.error('Error fetching pet details:', err);
                            }
                        }
                    }

                    // 4. Initialize socket connection
                    const newSocket = io(API_BASE_URL, {
                        withCredentials: true,
                        timeout: 10000,
                        transports: ['websocket', 'polling']
                    });

                    newSocket.on('connect', () => {
                        console.log('Connected to socket server');
                        newSocket.emit('join-chat', {
                            petId: chatData.chat.petId?._id || chatData.chat.petId,
                            userId: currentUserId,
                            chatId: chatData.chat._id
                        });
                    });

                    newSocket.on('joined-chat', (response) => {
                        if (response.success) {
                            console.log('Successfully joined chat room:', response.roomId);
                        } else {
                            console.error('Failed to join chat:', response.error);
                            setError('Failed to join chat room');
                        }
                    });

                    newSocket.on('new-message', (message) => {
                        console.log('Received new message:', message);
                        setMessages(prev => {
                            const exists = prev.some(msg => msg._id === message._id || 
                                (msg.content === message.content && msg.sender._id === message.sender._id && 
                                 Math.abs(new Date(msg.timestamp) - new Date(message.timestamp)) < 1000));
                            return exists ? prev : [...prev, message];
                        });
                    });

                    newSocket.on('message-error', (error) => {
                        console.error('Message error:', error);
                        setError(`Message failed to send: ${error.error}`);
                    });

                    newSocket.on('user-typing', ({ userId, isTyping }) => {
                        if (userId !== currentUserId) {
                            setOtherUserTyping(isTyping);
                        }
                    });

                    newSocket.on('connect_error', (error) => {
                        console.error('Socket connection error:', error);
                    });

                    setSocket(newSocket);
                    activeSocket = newSocket;
                    setLoading(false);
                }
            } catch (err) {
                console.error('Error initializing chat:', err);
                setError('Failed to initialize chat: ' + err.message);
                setLoading(false);
            }
        };

        initializeChat();

        return () => {
            if (activeSocket) {
                activeSocket.disconnect();
            }
        };
    }, [chatId, petId, navigate]);

    // Handle typing indicator
    const handleTyping = () => {
        if (!typing && socket && petInfo && chatInfo) {
            setTyping(true);
            socket.emit('typing', {
                petId: petInfo._id,
                userId: currentUser?._id,
                isTyping: true
            });
        }

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setTyping(false);
            if (socket && petInfo && chatInfo) {
                socket.emit('typing', {
                    petId: petInfo._id,
                    userId: currentUser?._id,
                    isTyping: false
                });
            }
        }, 1000);
    };

    // Send message
    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || !socket || !currentUser || !petInfo || !chatInfo) return;

        try {
            const messageData = {
                petId: petInfo._id,
                senderId: currentUser._id,
                content: newMessage.trim(),
                chatId: chatInfo._id
            };

            socket.emit('send-message', messageData);
            setNewMessage('');
            
            setTyping(false);
            socket.emit('typing', {
                petId: petInfo._id,
                userId: currentUser._id,
                isTyping: false
            });
            
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
        }
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center pt-28">
                <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-sm w-full text-center">
                    <span className="loading loading-spinner loading-md text-primary-600"></span>
                    <p className="text-xs font-semibold text-slate-500">Loading conversation...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 pt-28">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center space-y-4">
                    <div className="text-rose-500 text-3xl">⚠️</div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Chat Error</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
                    <div className="pt-2">
                        <button
                            onClick={() => navigate('/chats')}
                            className="px-4 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                        >
                            Back to Chats
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-4xl mx-auto px-4 pt-28 pb-8 flex justify-center text-left">
                {/* Main Chat Container */}
                <div className="w-full h-[78vh] bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        {petInfo && (
                            <div className="flex items-center w-full">
                                {/* Back Button */}
                                <button
                                    onClick={() => navigate('/chats')}
                                    className="mr-3 p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                >
                                    <IoChevronBackOutline size={16} />
                                </button>
                                
                                <div className="relative mr-3.5 flex-shrink-0">
                                    {petInfo.image ? (
                                        <img
                                            src={getPetImageUrl(petInfo.image)}
                                            alt={petInfo.name || 'Pet'}
                                            className="w-10 h-10 rounded-full object-cover border border-slate-200/60 shadow-sm"
                                            onError={handleImageError}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg text-slate-400">
                                            🐾
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>

                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <h2 className="text-sm font-black text-slate-800 truncate">
                                            {petInfo.name || 'Unknown Pet'}
                                        </h2>
                                        {petInfo.gender && (
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold text-white flex items-center gap-0.5 ${
                                                petInfo.gender === 'Male' ? 'bg-primary-500' : 'bg-pink-500'
                                            }`}>
                                                {petInfo.gender === 'Male' ? <IoMale size={8} /> : <IoFemale size={8} />}
                                                {petInfo.gender}
                                            </span>
                                        )}
                                        {petInfo.age && (
                                            <span className="text-[9px] text-slate-450 font-bold bg-slate-100 border border-slate-150 px-2 py-0.5 rounded-full">
                                                {petInfo.age}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                        <span className="font-bold text-primary-600 bg-primary-50/55 border border-primary-100/40 px-1.5 py-0.2 rounded-md">
                                            {(petInfo.breed && petInfo.breed !== 'undefined') ? petInfo.breed : 'Breed Unknown'}
                                        </span>
                                        <span>•</span>
                                        <span className="truncate text-slate-400 font-medium">Chatting with: {(chatInfo?.participants?.find(p => p._id !== currentUser?._id)?.name) || petInfo.owner?.name || 'Owner'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/20">
                        {messages.length === 0 ? (
                            <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
                                <div className="w-14 h-14 bg-primary-50 border border-primary-100 rounded-full flex items-center justify-center mx-auto text-xl">
                                    <IoChatbubbleEllipsesOutline size={22} className="text-primary-500" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">No messages yet</h4>
                                    <p className="text-xs text-slate-400 mt-1.5 max-w-[280px] mx-auto leading-relaxed">
                                        Start the conversation about {petInfo?.name}!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="text-center py-2">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Conversation Started</p>
                                </div>

                                {messages.map((message, index) => {
                                    const isOwnMessage = message.sender._id === currentUser?._id;
                                    return (
                                        <div
                                            key={message._id || index}
                                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex items-end gap-2.5 max-w-[75%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                                                {!isOwnMessage && (
                                                    <div className="w-8 h-8 rounded-full bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                                                        {message.sender.name ? message.sender.name.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                )}
                                                <div className="flex flex-col space-y-0.5">
                                                    <div
                                                        className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                                                            isOwnMessage
                                                                ? 'bg-primary-600 text-white rounded-tr-sm text-left shadow-sm shadow-primary-500/5'
                                                                : 'bg-slate-100 text-slate-800 border border-slate-150 rounded-tl-sm text-left shadow-sm'
                                                        }`}
                                                    >
                                                        {message.content}
                                                    </div>
                                                    <span className={`text-[8px] font-bold text-slate-400 ${isOwnMessage ? 'text-right mr-1' : 'ml-1'}`}>
                                                        {formatTime(message.timestamp)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {/* Typing indicator */}
                        {otherUserTyping && (
                            <div className="flex justify-start animate-pulse">
                                <div className="flex items-end gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                        {((chatInfo?.participants?.find(p => p._id !== currentUser?._id)?.name?.charAt(0)) || '?').toUpperCase()}
                                    </div>
                                    <div className="bg-slate-100 px-3 py-1.5 rounded-2xl rounded-tl-sm border border-slate-150 shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message input */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <form onSubmit={sendMessage} className="flex gap-3 items-center">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    handleTyping();
                                }}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 bg-white border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none rounded-xl text-xs text-slate-750 placeholder-slate-400 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all font-extrabold text-xs shadow-sm flex items-center gap-1.5"
                            >
                                <span>Send</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Chat;
