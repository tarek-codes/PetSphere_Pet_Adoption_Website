import React, { useContext, useState } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import Swal from 'sweetalert2';
import { apiUrl } from '../../utils/api';

const Register = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userType, setUserType] = useState('user');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const name = form.get('name');
        const email = form.get('email');
        const password = form.get('password');
        const info = { name, email, password, role: userType };

        fetch(apiUrl('/signup'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        })
            .then(async (res) => {
                const contentType = res.headers.get("content-type");
                let data = {};
                if (contentType && contentType.includes("application/json")) {
                    data = await res.json();
                } else {
                    const text = await res.text();
                    throw new Error(text || `Server error (${res.status})`);
                }

                if (!res.ok) {
                    throw new Error(data.message || `Registration failed with status ${res.status}`);
                }

                if (data.insertedId) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Your account has been registered successfully.',
                        confirmButtonText: 'Continue to Login',
                        confirmButtonColor: '#e64400',
                        background: '#f8fafc',
                        color: '#0f172a',
                        width: '400px',
                        padding: '1.5rem',
                        borderRadius: '24px',
                        backdrop: 'rgba(15, 23, 42, 0.2)',
                        showClass: {
                            popup: 'animate__animated animate__fadeIn'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOut'
                        },
                        customClass: {
                            popup: 'border border-slate-200 shadow-xl'
                        }
                    }).then(() => {
                        setIsSuccess(true);
                        navigate('/login');
                    });
                } else if (data.message) {
                    setErrorMsg(data.message);
                }
            })
            .catch(err => {
                console.error('Registration error:', err);
                setErrorMsg(err.message || 'Something went wrong during registration.');
            });
    };

    const handlePasswordMismatch = () => {
        const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
        confirmPasswordInput.setCustomValidity("Passwords do not match!");
        confirmPasswordInput.reportValidity();
    };

    const clearCustomValidity = (e) => {
        e.target.setCustomValidity("");
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-6 backdrop-blur-sm">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
                    <p className="text-sm text-slate-500 mt-2">Join PetSphere pet care community</p>
                </div>

                <form onSubmit={(e) => {
                    const form = e.target;
                    const password = form.password.value;
                    const confirmPassword = form.confirmPassword.value;
                    if (password !== confirmPassword) {
                        e.preventDefault();
                        handlePasswordMismatch();
                    } else {
                        handleSubmit(e);
                    }
                }} className="space-y-4 text-left">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Username</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="username"
                            className="auth-input w-full px-4 py-3 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-slate-900 placeholder-slate-450 text-sm outline-none transition-all"
                            required
                            aria-label="Username"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            className="auth-input w-full px-4 py-3 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-slate-900 placeholder-slate-450 text-sm outline-none transition-all"
                            required
                            aria-label="Email"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5 relative text-left">
                        <label className="text-sm font-semibold text-slate-700">Password</label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                className="auth-input w-full px-4 py-3 pr-11 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-slate-900 placeholder-slate-455 text-sm outline-none transition-all"
                                required
                                aria-label="Password"
                            />
                            <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 focus:outline-none flex items-center justify-center"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="••••••••"
                            className="auth-input w-full px-4 py-3 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-slate-900 placeholder-slate-455 text-sm outline-none transition-all"
                            required
                            aria-label="Confirm Password"
                            onInvalid={handlePasswordMismatch}
                            onInput={clearCustomValidity}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md shadow-primary-100/10 transition-all text-sm mt-4"
                    >
                        Sign Up
                    </button>

                    {/* Feedback Messages */}
                    {errorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200/60 rounded-xl text-center">
                            <p className="text-xs font-semibold text-red-600">{errorMsg}</p>
                        </div>
                    )}
                    {isSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200/60 rounded-xl text-center">
                            <p className="text-xs font-semibold text-green-600">Successfully registered!</p>
                        </div>
                    )}
                </form>

                {/* Footer link */}
                <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 hover:underline font-semibold transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
