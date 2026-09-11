require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const isVercel = process.env.VERCEL === '1';

const app = express();

// Only set up Socket.IO when running locally (not serverless)
let server;
let io;
if (!isVercel) {
    const { createServer } = require('http');
    const { Server } = require('socket.io');
    const { startReminderService } = require('./utils/reminderService');
    server = createServer(app);
    io = new Server(server, {
        cors: {
            origin: (origin, callback) => callback(null, true),
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    app.set('io', io);
    // Socket.IO logic is only initialized locally (see bottom of file)
    app._io = io;
    app._startReminderService = startReminderService;
}

// Enable trust proxy for secure cookies behind reverse proxies (like Vercel)
app.set('trust proxy', 1);

// Allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL
].filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true; // Allow mobile apps or curl/Postman
    if (allowedOrigins.includes(origin)) return true;
    if (/\.vercel\.app$/.test(origin)) return true; // Allow all Vercel deployment previews
    return false;
};


app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static files and EJS views are only needed for local server, not serverless
if (!isVercel) {
    app.use(express.static(path.join(__dirname, 'public')));
}

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petsphere';

const isProduction = process.env.NODE_ENV === 'production';

// Cached MongoDB Connection for Serverless & Long-running
let cachedConnection = null;
async function connectToDatabase() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }
    if (!cachedConnection) {
        cachedConnection = mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false
        }).catch(err => {
            cachedConnection = null;
            console.error('MongoDB Connection Error:', err.message || err);
            throw err;
        });
    }
    return cachedConnection;
}

// Session store: Use MongoStore in production/local, fallback to memory store on Vercel if MongoStore fails
let sessionStore;
try {
    sessionStore = MongoStore.create({
        mongoUrl: mongoURI,
        collectionName: 'sessions',
        ttl: 60 * 60 * 24, // 1 day
        mongoOptions: {
            serverSelectionTimeoutMS: 5000
        }
    });

    sessionStore.on('error', (err) => {
        console.error('Session store error:', err.message || err);
    });
} catch (err) {
    console.error('Failed to create MongoStore, falling back to memory store:', err.message);
    sessionStore = undefined; // express-session defaults to MemoryStore
}

app.use(session({
    secret: process.env.SESSION_SECRET || 'secretKey',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Ensure DB is connected before processing requests
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error('Database connection middleware failure:', err.message || err);
        return res.status(500).json({
            message: 'Database connection failed. Please ensure MongoDB Atlas Network Access allows connections (0.0.0.0/0) and MONGODB_URI is correct.',
            error: isProduction ? undefined : err.message
        });
    }
});

// Routes
app.use('/', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'PetSphere Backend API is running successfully!' });
});

// adoption
app.use('/', require('./routes/adoptionRoutes'));


app.use('/', require('./routes/petRoutes'));

const notificationRoutes = require('./routes/Notification');
app.use('/api/notifications', notificationRoutes);
const lostorfoundRoutes = require('./routes/lostorfoundRoutes');
app.use('/', lostorfoundRoutes);

app.use('/', require('./routes/profileRoutes'));
// app.use('/api/user', require('./routes/profileRoutes'));

app.use('/api/reviews', require('./routes/reviewRoutes')); //rupom

app.use('/', require('./routes/dashboardRoutes'));
app.use((req, res, next) => {
    if (req.session.userId) {
        req.session.cookie.maxAge = 30 * 60 * 1000; // 30 minutes
    }
    next();
});

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const adminReviewRoutes = require('./routes/adminReviewRoutes');
app.use('/admin', adminReviewRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api', chatRoutes);

// User info route
app.get('/user-info', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const User = require('./models/User');
    User.findById(req.session.userId)
        .select('-password')
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ success: true, user });
        })
        .catch(error => {
            console.error('Error getting user info:', error);
            res.status(500).json({ message: 'Server error' });
        });
});


// Socket.IO connection handling (only in non-serverless mode)
if (!isVercel && io) {
    const Chat = require('./models/Chat');
    const User = require('./models/User');

    io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a chat room for a specific pet
    socket.on('join-chat', async (data) => {
        const { petId, userId, chatId } = data;
        
        try {
            let chat;
            
            if (chatId) {
                // If chatId is provided, use it directly
                chat = await Chat.findById(chatId);
            } else {
                // Find the specific chat for this user and pet
                const PetProfile = require('./models/PetProfile');
                const pet = await PetProfile.findById(petId).populate('owner');
                
                if (!pet) {
                    console.log(`Pet not found: ${petId}`);
                    return;
                }
                
                if (!pet.owner) {
                    console.log(`Pet owner not found or deleted for pet: ${petId}`);
                    return;
                }
                
                chat = await Chat.findOne({
                    petId,
                    participants: { $all: [userId, pet.owner._id] }
                });
            }
            
            if (chat) {
                const roomId = `chat-${chat._id}`;
                socket.join(roomId);
                socket.userId = userId;
                socket.petId = petId;
                socket.chatId = chat._id;
                console.log(`User ${userId} joined chat ${chat._id} for pet ${petId}`);
                
                // Emit confirmation back to the client
                socket.emit('joined-chat', { 
                    chatId: chat._id, 
                    roomId: roomId,
                    success: true 
                });
            } else {
                console.log(`No chat found for user ${userId} and pet ${petId}`);
                socket.emit('joined-chat', { 
                    success: false, 
                    error: 'Chat not found' 
                });
            }
        } catch (error) {
            console.error('Error in join-chat:', error);
            socket.emit('joined-chat', { 
                success: false, 
                error: 'Failed to join chat' 
            });
        }
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
        try {
        const { petId, senderId, content, chatId } = data;

        let chat;
            
            if (chatId) {
                // If chatId is provided, find the chat directly
                chat = await Chat.findById(chatId);
            } else {
                // Find or create chat with proper participants
                const PetProfile = require('./models/PetProfile');
                const pet = await PetProfile.findById(petId).populate('owner');
                
                if (!pet) {
                    console.error('Pet not found');
                    socket.emit('message-error', { error: 'Pet not found' });
                    return;
                }
                
                if (!pet.owner) {
                    console.error('Pet owner not found or deleted for pet:', petId);
                    socket.emit('message-error', { error: 'Pet owner not found' });
                    return;
                }

                chat = await Chat.findOne({ 
                    petId, 
                    participants: { $all: [senderId, pet.owner._id] }
                });
                
                if (!chat) {
                    chat = new Chat({
                        petId,
                        participants: [senderId, pet.owner._id],
                        messages: [],
                        lastMessage: {
                            content,
                            timestamp: new Date(),
                            sender: senderId
                        }
                    });
                }
            }

            if (!chat) {
                console.error('Chat not found and could not be created');
                socket.emit('message-error', { error: 'Chat not found' });
                return;
            }

            // Add message to chat
            const newMessage = {
                sender: senderId,
                content,
                timestamp: new Date(),
                read: false
            };

            chat.messages.push(newMessage);
            chat.lastMessage = {
                content,
                timestamp: new Date(),
                sender: senderId
            };

            await chat.save();
            
            // Use the specific chat room
            const roomId = `chat-${chat._id}`;

            // Make sure sender is in the room
            if (!socket.rooms.has(roomId)) {
                socket.join(roomId);
                socket.chatId = chat._id;
                console.log(`Auto-joined user ${senderId} to room ${roomId}`);
            }

            // Populate sender info for the response
            await chat.populate('messages.sender', 'name email');
            const populatedMessage = chat.messages[chat.messages.length - 1];

            // Emit message to all users in the room
            io.to(roomId).emit('new-message', {
                _id: populatedMessage._id,
                sender: populatedMessage.sender,
                content: populatedMessage.content,
                timestamp: populatedMessage.timestamp,
                petId,
                chatId: chat._id
            });

            console.log(`Message sent to room ${roomId}: ${content}`);

        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('message-error', { error: 'Failed to send message' });
        }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
        const { petId, userId, isTyping } = data;
        const roomId = `chat-${socket.chatId}`;
        socket.to(roomId).emit('user-typing', { userId, isTyping });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
} // end if (!isVercel && io)

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// Start Server (only when run directly, not when imported as serverless function)
const PORT = process.env.PORT || 3000;
if (!isVercel && require.main === module) {
    const { startReminderService } = require('./utils/reminderService');
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        // Start the reminder service
        startReminderService();
        console.log('Reminder service started');
    });
}

module.exports = app;