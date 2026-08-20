<div align="center">

<svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="110" height="110" rx="28" fill="#F97316"/>
  <circle cx="55" cy="58" r="29" fill="white"/>
  <circle cx="39" cy="36" r="9" fill="white"/>
  <circle cx="71" cy="36" r="9" fill="white"/>
  <circle cx="28" cy="52" r="8" fill="white"/>
  <circle cx="82" cy="52" r="8" fill="white"/>
  <path d="M55 49C47 49 40 57 40 65C40 73 46 80 55 80C64 80 70 73 70 65C70 57 63 49 55 49Z" fill="#F97316"/>
  <path d="M55 56C50 56 47 60 47 64C47 68 50 71 55 71C60 71 63 68 63 64C63 60 60 56 55 56Z" fill="white"/>
</svg>

# 🐾 PetSphere

### A modern platform for pet adoption, care & lost-and-found management

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge\&logo=express\&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge\&logo=socket.io\&logoColor=white)](https://socket.io/)

</div>

---

## 📖 Overview

**PetSphere** is a full-stack pet management and adoption platform designed to make it easier for people to discover pets, connect with adopters, submit adoption applications, and manage pet-related activities from a single platform.

The application combines a modern React frontend with a Node.js/Express backend and MongoDB database. It also provides real-time communication through Socket.IO and supports authentication, notifications, filtering, pet profiles, adoption workflows, and lost-and-found functionality.

The goal is to create a centralized digital ecosystem where **pet owners, adopters, and administrators** can interact efficiently while making pet adoption more accessible.

---

## ✨ Features

### 🐶 Pet Discovery

* Browse available pets
* Search and filter pets
* View detailed pet profiles
* Explore pets by category and characteristics
* Access pet information through a clean and responsive interface

### 🏠 Pet Adoption

* Submit adoption applications
* Manage adoption requests
* Track adoption-related activities
* Connect potential adopters with pet owners
* Support a structured adoption workflow

### 🔎 Lost & Found

* Report lost pets
* Share found pet information
* Browse lost-and-found listings
* Help reconnect pets with their owners

### 👤 User Management

* User registration and authentication
* Secure login
* Profile management
* Pet ownership management
* Authentication-based access control

### 💬 Real-Time Communication

* Real-time chat using Socket.IO
* User-to-user communication
* Instant message delivery
* Real-time interaction between platform users

### 🔔 Notifications

* Application-related notifications
* User activity notifications
* Real-time updates
* Toast and alert feedback

### 📸 Pet Media

* Upload pet images
* Manage pet-related media
* Backend file handling with Multer

### 🎨 Modern UI

* Responsive design
* Tailwind CSS
* DaisyUI components
* React Icons
* Framer Motion animations
* Interactive user experience

---

## 🏗️ System Architecture

```text
┌──────────────────────────────────────────────────────┐
│                    PetSphere                         │
├──────────────────────────────────────────────────────┤
│                                                      │
│                 React Frontend                       │
│                                                      │
│  React 19 • Vite • Tailwind CSS • React Router      │
│  Axios • Firebase • Framer Motion • DaisyUI          │
│                                                      │
└───────────────────────┬──────────────────────────────┘
                        │
                        │ REST API
                        │ WebSocket
                        ▼
┌──────────────────────────────────────────────────────┐
│                Node.js Backend                        │
│                                                      │
│  Express.js • JWT • Sessions • Socket.IO            │
│  Middleware • Controllers • Routes • Models          │
│                                                      │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                     MongoDB                          │
│                                                      │
│                    Mongoose                          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React 19         | UI development          |
| Vite             | Frontend build tool     |
| React Router     | Client-side routing     |
| Tailwind CSS     | Styling                 |
| DaisyUI          | UI components           |
| Axios            | HTTP/API communication  |
| Firebase         | Authentication/services |
| Socket.IO Client | Real-time communication |
| Framer Motion    | Animations              |
| React Icons      | Icons                   |
| React Toastify   | Notifications           |
| SweetAlert2      | Interactive alerts      |

The current frontend dependency configuration confirms React 19, Vite 6, Tailwind CSS 3, Firebase, Axios, React Router, Framer Motion, and Socket.IO Client.

### Backend

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| Node.js           | Runtime                   |
| Express.js 5      | REST API                  |
| MongoDB           | Database                  |
| Mongoose          | ODM                       |
| JWT               | Authentication            |
| bcrypt / bcryptjs | Password hashing          |
| Socket.IO         | Real-time communication   |
| Multer            | File uploads              |
| CORS              | Cross-origin requests     |
| Express Session   | Session management        |
| Connect-Mongo     | MongoDB session storage   |
| dotenv            | Environment configuration |

These backend dependencies are defined in the project's backend package configuration.

---

## 📂 Project Structure

```text
PetSphere_Pet_Adoption_Website/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── utils/
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── public/
│
├── src/
│   ├── assets/
│   ├── component/
│   ├── context/
│   ├── provider/
│   ├── utils/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── PetDetails.css
│
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

The repository separates the frontend source under `src/` from the Express backend under `backend/`, including dedicated controllers, middleware, models, routes, and utilities.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 18+
* npm
* MongoDB
* Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/tarek-codes/PetSphere_Pet_Adoption_Website.git

cd PetSphere_Pet_Adoption_Website
```

---

### 2. Install Frontend Dependencies

```bash
npm install
```

---

### 3. Configure Frontend Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

Add any additional Firebase configuration variables required by your local implementation.

---

### 4. Start the Frontend

```bash
npm run dev
```

The Vite development server will provide the local frontend URL in your terminal.

---

### 5. Configure the Backend

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

Add any other environment variables required by your local configuration.

---

### 6. Start the Backend

```bash
npm start
```

The backend uses `server.js` as its application entry point.

---

## 🔐 Authentication & Security

PetSphere implements several backend security mechanisms:

* JWT-based authentication
* Password hashing with bcrypt
* Session management
* Protected API routes
* Authentication middleware
* Environment-based secret configuration
* CORS configuration
* Role/access-based application logic

Sensitive credentials should always be stored in environment variables and **never committed to the repository**.

---

## 💬 Real-Time Communication

PetSphere uses **Socket.IO** to provide real-time communication between users.

```text
User A
   │
   │ Message
   ▼
Socket.IO Server
   │
   │ Real-time event
   ▼
User B
```

This allows users to communicate without repeatedly polling the server for new messages.

---

## 🐾 Core User Flow

```text
Register / Login
       │
       ▼
   Explore Pets
       │
       ▼
 Search / Filter
       │
       ▼
 View Pet Details
       │
       ▼
Submit Adoption Request
       │
       ▼
Owner / Admin Review
       │
       ▼
   Adoption Process
```

---

## 🔍 Pet Search & Discovery

Users can discover pets through searchable and filterable listings.

The frontend includes sorting and filtering-related dependencies such as `match-sorter` and `sort-by`, supporting a more efficient pet discovery experience.

---

## 📡 API & Backend Design

The backend follows a modular Express architecture:

```text
Request
   │
   ▼
Routes
   │
   ▼
Middleware
   │
   ▼
Controllers
   │
   ▼
Models
   │
   ▼
MongoDB
```

This separation keeps business logic, request routing, authentication, and database models organized and easier to maintain.

---

## 🧪 Development

Run the frontend linter:

```bash
npm run lint
```

Build the production frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

These scripts are currently defined in the frontend `package.json`.

---

## 📱 Responsive Design

PetSphere is designed to provide a consistent experience across:

* 💻 Desktop
* 📱 Mobile
* 📟 Tablet

The interface uses Tailwind CSS and responsive UI components to adapt layouts to different screen sizes.

---

## 🎯 Project Goals

PetSphere was built with the following goals:

* Make pet adoption more accessible
* Centralize pet-related services
* Simplify the adoption application process
* Improve communication between users
* Support lost-and-found pet management
* Provide an intuitive user experience
* Demonstrate full-stack web development practices

---

## 🔮 Future Improvements

Potential future improvements include:

* [ ] Advanced pet recommendation system
* [ ] AI-powered pet matching
* [ ] Location-based pet discovery
* [ ] Online adoption appointment scheduling
* [ ] Advanced admin analytics dashboard
* [ ] Email and SMS notifications
* [ ] Enhanced moderation and reporting
* [ ] Pet health record management
* [ ] Adoption success analytics
* [ ] Progressive Web App (PWA) support

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "feat: add your feature"
```

4. Push the branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---

## 👨‍💻 Author

### Tarek Alam Bhuiyan

Computer Science & Engineering

**GitHub:** [@tarek-codes](https://github.com/tarek-codes)

**Portfolio:** [tarek-dev.vercel.app](https://tarek-dev.vercel.app/)

---

## 📄 License

This project is available for educational and development purposes.

---

<div align="center">

### 🐾 Built with care for better pet adoption

**PetSphere — Connecting Pets With People.**

⭐ If you found this project useful, consider giving the repository a star.

</div>
