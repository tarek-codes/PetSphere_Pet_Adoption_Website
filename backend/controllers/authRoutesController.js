const User = require('../models/User');
const AdoptionRequest = require('../models/AdoptionRequest');
const PetProfile = require('../models/PetProfile');
const Chat = require('../models/Chat');
const bcrypt = require('bcryptjs');



exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log('Received signup data for:', email);

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: role || 'user' });
        await newUser.save();
        console.log('User created successfully with ID:', newUser._id);

        res.status(201).json({
            message: 'User created successfully',
            insertedId: newUser._id
        });
    } catch (error) {
        console.error('Signup error details:', error.message || error);

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email is already registered. Please log in.' });
        }

        res.status(500).json({
            message: error.message || 'Server error occurred during registration'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Find user by email only, then verify password separately
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Support both bcrypt-hashed passwords (new) and plain-text (legacy seeded users)
        let isPasswordValid = false;
        const isBcryptHash = user.password && user.password.startsWith('$2');
        if (isBcryptHash) {
            // New users: compare with bcrypt
            isPasswordValid = await bcrypt.compare(password, user.password);
        } else {
            // Legacy plain-text password: direct compare, then migrate to bcrypt
            isPasswordValid = (user.password === password);
            if (isPasswordValid) {
                // Auto-migrate: hash and save the password for next login
                user.password = await bcrypt.hash(password, 10);
                await user.save();
                console.log('Migrated plain-text password to bcrypt for:', user.email);
            }
        }

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if user is banned
        if (user.banned) {
            return res.status(403).json({ message: 'Your account has been banned. Please contact support.' });
        }

        // Create user session
        req.session.userId = user._id;
        req.session.role = user.role;
        
        // Return success response with user info
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login controller error:', error);
        return res.status(500).json({
            message: error.message || 'An unexpected server error occurred during login'
        });
    }
};


exports.checkSession = async (req, res) => {
    console.log(req.session,100); // Debugging line
    if (req.session.userId) {
        try {
            // Fetch the full user data to include admin status
            const user = await User.findById(req.session.userId).select('name email role isAdmin');
            if (!user) {
                return res.status(200).json({ loggedIn: false });
            }
            
            res.status(200).json({
                loggedIn: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isAdmin: user.isAdmin || user.role === 'admin'
                }
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(200).json({ loggedIn: false });
        }
    } else {
        res.status(200).json({ loggedIn: false });
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name email role');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getlogout = (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
}


exports.getAllUsers = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const adminUser = await User.findById(req.session.userId);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Fetch all users but exclude sensitive information
        const users = await User.find({}).select('name email role createdAt profilePicture banned');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


exports.banUser = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Verify that the authenticated user is an admin
        const adminUser = await User.findById(req.session.userId);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { userId } = req.params;
        const { banned } = req.body;

        // Find the user to be banned/unbanned
        const userToBan = await User.findById(userId);
        if (!userToBan) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent banning of admin accounts
        if (userToBan.role === 'admin') {
            return res.status(403).json({ message: 'Cannot ban admin users' });
        }

        // Update the user's banned status
        userToBan.banned = banned;
        await userToBan.save();

        // If user is being banned, remove their pets from adoption list
        if (banned) {
            console.log(`Removing adoption requests for banned user: ${userToBan.name}`);
            
            // Find all pets owned by the banned user
            const userPets = await PetProfile.find({ owner: userId });
            const petIds = userPets.map(pet => pet._id);
            
            if (petIds.length > 0) {
                // Remove all adoption requests for pets owned by banned user
                const deletedRequests = await AdoptionRequest.deleteMany({ 
                    petId: { $in: petIds } 
                });
                
                // Update pet adoption status to 'available' (not in adoption list)
                await PetProfile.updateMany(
                    { owner: userId },
                    { adoptionStatus: 'available' }
                );

                // Delete all chats related to banned user's pets
                const deletedChats = await Chat.deleteMany({ 
                    petId: { $in: petIds } 
                });
                
                console.log(`Removed ${deletedRequests.deletedCount} adoption requests for ${petIds.length} pets`);
                console.log(`Deleted ${deletedChats.deletedCount} chats related to banned user's pets`);
            }
        }

        // Return success message
        res.json({ 
            message: banned ? 'User banned successfully and pets removed from adoption list' : 'User unbanned successfully',
            petsAffected: banned ? (await PetProfile.countDocuments({ owner: userId })) : 0
        });
    } catch (err) {
        console.error('Error updating user ban status:', err);
        res.status(500).json({ message: 'Server error' });
    }
}