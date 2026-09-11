const mongoose = require('mongoose');
const User = require('./models/User');
const PetProfile = require('./models/PetProfile');
const AdoptionRequest = require('./models/AdoptionRequest');
const LostOrFound = require('./models/LostOrFound');
const Chat = require('./models/Chat');
const Review = require('./models/Review');

require('dotenv').config();
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petsphere';

const usersData = [
    {
        name: 'Admin User',
        email: 'admin@petsphere.com',
        password: 'adminpassword',
        role: 'admin',
        isAdmin: true,
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
        contactInfo: '1-800-ADMIN-PET',
        isVerified: true
    },
    {
        name: 'User Account',
        email: 'user@petsphere.com',
        password: 'userpassword',
        role: 'user',
        isAdmin: false,
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        contactInfo: '+8801711111111',
        isVerified: true
    },
    {
        name: 'Jane Smith',
        email: 'jane@petsphere.com',
        password: 'janepassword',
        role: 'user',
        isAdmin: false,
        profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
        contactInfo: '+8801722222222',
        isVerified: true
    },
    {
        name: 'John Doe',
        email: 'john@petsphere.com',
        password: 'johnpassword',
        role: 'user',
        isAdmin: false,
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
        contactInfo: '+8801733333333',
        isVerified: true
    },
    {
        name: 'Alice Johnson',
        email: 'alice@petsphere.com',
        password: 'alicepassword',
        role: 'user',
        isAdmin: false,
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
        contactInfo: '+8801744444444',
        isVerified: true
    }
];

async function seedDatabase() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // 1. Clear existing data in target collections (keep Users, but we will upsert/refresh them)
        console.log('Clearing old pet profiles, requests, chats, lost & found, reviews...');
        await PetProfile.deleteMany({});
        await AdoptionRequest.deleteMany({});
        await LostOrFound.deleteMany({});
        await Chat.deleteMany({});
        await Review.deleteMany({});

        // 2. Ensure users exist
        const users = [];
        for (const uData of usersData) {
            let user = await User.findOne({ email: uData.email });
            if (user) {
                // Update details
                user.name = uData.name;
                user.password = uData.password;
                user.role = uData.role;
                user.isAdmin = uData.isAdmin;
                user.profilePicture = uData.profilePicture;
                user.contactInfo = uData.contactInfo;
                user.isVerified = uData.isVerified;
                user.petIds = []; // clear first, we will re-fill
                await user.save();
                console.log(`Updated user: ${user.email}`);
            } else {
                user = new User(uData);
                await user.save();
                console.log(`Created user: ${user.email}`);
            }
            users.push(user);
        }

        // Map users by email for easy access
        const userMap = {};
        users.forEach(u => {
            userMap[u.email] = u;
        });

        // 3. Define and insert pets
        // Each user has pets. We will distribute pets among non-admin users.
        const petsData = [
            {
                name: 'Buddy',
                dob: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), // 2 years old
                breed: 'Golden Retriever',
                gender: 'Male',
                image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
                description: 'A very friendly and energetic golden retriever who loves playing fetch and is great with kids.',
                vaccinations: [{ vaccineName: 'Rabies', date: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), notes: 'Annual booster' }],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'user@petsphere.com',
                healthLogs: [{ date: new Date(), weight: 30, diet: 'Dry kibble, twice a day', medicalNotes: 'Healthy and fit' }]
            },
            {
                name: 'Charlie',
                dob: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000), // 5 years old
                breed: 'Pug',
                gender: 'Male',
                image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop',
                description: 'Lovable and playful Pug. Enjoys short walks, snoring, and lots of cuddles on the couch.',
                vaccinations: [{ vaccineName: 'DHPP', date: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000), notes: 'Up to date' }],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'user@petsphere.com'
            },
            {
                name: 'Milo',
                dob: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000), // 3 years old
                breed: 'Tabby Cat',
                gender: 'Male',
                image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop',
                description: 'An active tabby cat who loves chasing laser pointers and playing with toy mice.',
                vaccinations: [],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'user@petsphere.com'
            },
            {
                name: 'Bella',
                dob: new Date(Date.now() - 1 * 365 * 24 * 60 * 60 * 1000), // 1 year old
                breed: 'Persian Cat',
                gender: 'Female',
                image: 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?q=80&w=600&auto=format&fit=crop',
                description: 'A calm and quiet Persian cat who enjoys napping in sunny spots. Very gentle and sweet.',
                vaccinations: [{ vaccineName: 'FVRCP', date: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000), notes: 'Completed' }],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'jane@petsphere.com'
            },
            {
                name: 'Daisy',
                dob: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), // 2 years old
                breed: 'Beagle',
                gender: 'Female',
                image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=600&auto=format&fit=crop',
                description: 'Gentle and curious Beagle who loves sniffing around and playing with other dogs.',
                vaccinations: [],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'jane@petsphere.com'
            },
            {
                name: 'Snowball',
                dob: new Date(Date.now() - 0.8 * 365 * 24 * 60 * 60 * 1000), // ~10 months
                breed: 'Angora Rabbit',
                gender: 'Female',
                image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=600&auto=format&fit=crop',
                description: 'Fluffy and friendly white rabbit. Very calm and loves chewing on fresh carrots and hay.',
                vaccinations: [],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'jane@petsphere.com'
            },
            {
                name: 'Max',
                dob: new Date(Date.now() - 3.5 * 365 * 24 * 60 * 60 * 1000), // 3.5 years old
                breed: 'German Shepherd',
                gender: 'Male',
                image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=600&auto=format&fit=crop',
                description: 'Highly trained and loyal German Shepherd. Makes an excellent guard dog and a loving companion.',
                vaccinations: [{ vaccineName: 'Rabies', date: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000), notes: 'Good health' }],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'john@petsphere.com'
            },
            {
                name: 'Oliver',
                dob: new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000), // 4 years old
                breed: 'British Shorthair',
                gender: 'Male',
                image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600&auto=format&fit=crop',
                description: 'Handsome British Shorthair cat with a plush blue-grey coat. Very independent but affectionate.',
                vaccinations: [],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'john@petsphere.com'
            },
            {
                name: 'Luna',
                dob: new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000), // 4 years old
                breed: 'Husky',
                gender: 'Female',
                image: 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?q=80&w=600&auto=format&fit=crop',
                description: 'Energetic and intelligent Siberian Husky with beautiful blue eyes. Needs a household with active owners.',
                vaccinations: [{ vaccineName: 'Rabies', date: new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000) }],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'alice@petsphere.com'
            },
            {
                name: 'Rocky',
                dob: new Date(Date.now() - 1.2 * 365 * 24 * 60 * 60 * 1000), // 1.2 years old
                breed: 'French Bulldog',
                gender: 'Male',
                image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop',
                description: 'Playful French Bulldog puppy. He has a great personality and gets along with everyone.',
                vaccinations: [],
                vetAppointments: [],
                adoptionStatus: 'available',
                ownerEmail: 'alice@petsphere.com'
            }
        ];

        console.log('Inserting pet profiles...');
        const pets = [];
        for (const pData of petsData) {
            const owner = userMap[pData.ownerEmail];
            const pet = new PetProfile({
                name: pData.name,
                dob: pData.dob,
                breed: pData.breed,
                gender: pData.gender,
                image: pData.image,
                description: pData.description,
                vaccinations: pData.vaccinations || [],
                vetAppointments: pData.vetAppointments || [],
                healthLogs: pData.healthLogs || [],
                adoptionStatus: pData.adoptionStatus,
                owner: owner._id
            });
            await pet.save();
            
            // Push petId to User's petIds array
            owner.petIds.push(pet._id);
            await owner.save();
            
            pets.push(pet);
            console.log(`Created pet: ${pet.name} (Owned by: ${pData.ownerEmail})`);
        }

        // Map pets by name for convenience
        const petMap = {};
        pets.forEach(p => {
            petMap[p.name] = p;
        });

        // 4. Seeding Adoption Requests
        console.log('Creating adoption requests...');
        const reqData = [
            {
                pet: petMap['Buddy'], // owned by user@petsphere.com
                requestedBy: userMap['jane@petsphere.com'],
                status: 'pending'
            },
            {
                pet: petMap['Luna'], // owned by alice@petsphere.com
                requestedBy: userMap['john@petsphere.com'],
                status: 'pending'
            },
            {
                pet: petMap['Daisy'], // owned by jane@petsphere.com
                requestedBy: userMap['alice@petsphere.com'],
                status: 'approved'
            }
        ];

        for (const r of reqData) {
            const adoptionRequest = new AdoptionRequest({
                petId: r.pet._id,
                requestedBy: r.requestedBy._id,
                ownerId: r.pet.owner,
                status: r.status,
                requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            });
            await adoptionRequest.save();

            // If approved, update the pet's adoptionStatus accordingly
            if (r.status === 'approved') {
                r.pet.adoptionStatus = 'approved';
                await r.pet.save();
            }
            console.log(`Adoption request created: ${r.requestedBy.name} -> ${r.pet.name} (${r.status})`);
        }

        // 5. Seeding Lost and Found
        console.log('Creating Lost and Found posts...');
        // Let's report Charlie (owned by user@petsphere.com) as lost
        const lostCharlie = new LostOrFound({
            petId: petMap['Charlie']._id,
            requestedBy: userMap['user@petsphere.com']._id,
            status: 'lost',
            requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            lostLocation: {
                address: '123 Pet Lane, Gulshan, Dhaka',
                latitude: 23.7925,
                longitude: 90.4078
            },
            comments: [
                {
                    user: userMap['jane@petsphere.com']._id,
                    text: 'I think I saw a pug resembling Charlie running near Gulshan 2 circle yesterday around 6 PM! Hope you find him soon.',
                    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000)
                },
                {
                    user: userMap['john@petsphere.com']._id,
                    text: 'Sharing this post. Please keep us updated, hope Charlie comes home safely.',
                    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                }
            ]
        });
        await lostCharlie.save();

        // Let's report Milo (owned by user@petsphere.com) as found by jane@petsphere.com
        const foundMilo = new LostOrFound({
            petId: petMap['Milo']._id,
            requestedBy: userMap['jane@petsphere.com']._id,
            status: 'found',
            requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            lostLocation: {
                address: 'Sector 4 Central Park, Uttara, Dhaka',
                latitude: 23.8720,
                longitude: 90.3850
            },
            comments: [
                {
                    user: userMap['alice@petsphere.com']._id,
                    text: 'Wow, so glad he was found! Is the owner contacted?',
                    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
                },
                {
                    user: userMap['jane@petsphere.com']._id,
                    text: 'Yes! I have sent a message to the owner. Hopefully we can arrange a meeting today.',
                    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000)
                }
            ]
        });
        await foundMilo.save();
        console.log('Lost and Found posts created.');

        // 6. Seeding Chats
        console.log('Creating active chat histories...');
        
        // Chat 1: Jane and Owner regarding Buddy
        const chatBuddy = new Chat({
            petId: petMap['Buddy']._id,
            participants: [userMap['jane@petsphere.com']._id, userMap['user@petsphere.com']._id],
            messages: [
                {
                    sender: userMap['jane@petsphere.com']._id,
                    content: 'Hi! I am very interested in adopting Buddy. Is he good with other dogs?',
                    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
                },
                {
                    sender: userMap['user@petsphere.com']._id,
                    content: 'Hi Jane! Yes, Buddy is extremely friendly and gets along well with other dogs. He has been socialized since he was a puppy.',
                    timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000)
                },
                {
                    sender: userMap['jane@petsphere.com']._id,
                    content: 'That\'s wonderful! Can I come visit him this weekend?',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
                },
                {
                    sender: userMap['user@petsphere.com']._id,
                    content: 'Sure! Saturday afternoon works for me. Does 3 PM sound good?',
                    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000)
                },
                {
                    sender: userMap['jane@petsphere.com']._id,
                    content: 'Yes, 3 PM on Saturday is perfect. See you then!',
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
                }
            ],
            lastMessage: {
                content: 'Yes, 3 PM on Saturday is perfect. See you then!',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
                sender: userMap['jane@petsphere.com']._id
            }
        });
        await chatBuddy.save();

        // Chat 2: John and Alice regarding Luna
        const chatLuna = new Chat({
            petId: petMap['Luna']._id,
            participants: [userMap['john@petsphere.com']._id, userMap['alice@petsphere.com']._id],
            messages: [
                {
                    sender: userMap['john@petsphere.com']._id,
                    content: 'Hello Alice! I saw Luna\'s profile. Does she bark a lot? I live in an apartment.',
                    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000)
                },
                {
                    sender: userMap['alice@petsphere.com']._id,
                    content: 'Hi John! Luna is a Husky, so she doesn\'t bark much, but she does make typical Husky howling sounds occasionally when she\'s excited. She also needs plenty of exercise!',
                    timestamp: new Date(Date.now() - 9.5 * 60 * 60 * 1000)
                },
                {
                    sender: userMap['john@petsphere.com']._id,
                    content: 'Ah, I see. I love running, so exercise wouldn\'t be an issue, but the howling might be a concern for my neighbors. Let me think about it.',
                    timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000)
                },
                {
                    sender: userMap['alice@petsphere.com']._id,
                    content: 'No problem! Take your time.',
                    timestamp: new Date(Date.now() - 8.5 * 60 * 60 * 1000)
                }
            ],
            lastMessage: {
                content: 'No problem! Take your time.',
                timestamp: new Date(Date.now() - 8.5 * 60 * 60 * 1000),
                sender: userMap['alice@petsphere.com']._id
            }
        });
        await chatLuna.save();

        // Chat 3: Alice and Jane regarding Daisy
        const chatDaisy = new Chat({
            petId: petMap['Daisy']._id,
            participants: [userMap['alice@petsphere.com']._id, userMap['jane@petsphere.com']._id],
            messages: [
                {
                    sender: userMap['alice@petsphere.com']._id,
                    content: 'Hi Jane, I\'d love to adopt Daisy. She looks adorable!',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
                },
                {
                    sender: userMap['jane@petsphere.com']._id,
                    content: 'Hi Alice! She is a sweetheart. She\'s fully vaccinated and loves outdoor activities.',
                    timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000)
                },
                {
                    sender: userMap['alice@petsphere.com']._id,
                    content: 'Perfect! I have a big backyard where she can run.',
                    timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000)
                }
            ],
            lastMessage: {
                content: 'Perfect! I have a big backyard where she can run.',
                timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000),
                sender: userMap['alice@petsphere.com']._id
            }
        });
        await chatDaisy.save();
        console.log('Chats created.');

        // 7. Seeding Reviews
        console.log('Seeding reviews...');
        const reviews = [
            {
                userId: userMap['user@petsphere.com']._id,
                content: 'PetSphere made it so easy for me to find a loving home for my dog\'s puppies. The community is so supportive!',
                rating: 5
            },
            {
                userId: userMap['jane@petsphere.com']._id,
                content: 'I adopted my cat Bella through PetSphere and the process was smooth and transparent. Highly recommended!',
                rating: 5
            },
            {
                userId: userMap['john@petsphere.com']._id,
                content: 'Great platform for reporting lost pets. The local map feature is super helpful.',
                rating: 4
            }
        ];
        await Review.insertMany(reviews);
        console.log('Reviews seeded successfully!');

        console.log('\n======================================================');
        console.log('Database Seeding Completed Successfully!');
        console.log('======================================================');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected');
    }
}

seedDatabase();
