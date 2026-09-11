import React, { useContext, useState } from 'react';
import { AuthContext } from '../../provider/Authprovider';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { apiUrl } from '../../utils/api';

const Login = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const email = form.get('email');
        const password = form.get('password');

        try {
            const response = await fetch(apiUrl('/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const contentType = response.headers.get("content-type");
            let data = {};
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || `Server error (${response.status})`);
            }

            if (response.ok) {
                setUser(data.user);
                setIsSuccess(true);
                setErrorMsg('');

                if (data.user.role === 'user') {
                    navigate('/user-home');
                } else if (data.user.role === 'admin') {
                    navigate('/admin-home');
                } else {
                    navigate('/');
                }
            } else {
                setErrorMsg(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMsg(error.message);
            setIsSuccess(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-8 backdrop-blur-sm">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-sm text-slate-500 mt-2">Sign in to your PetSphere account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            className="auth-input w-full px-4 py-3 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-slate-900 placeholder-slate-400 text-sm outline-none transition-all"
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
                                autoComplete="current-password"
                                className="auth-input w-full px-4 py-3 pr-11 rounded-xl border border-slate-200/80 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white text-slate-900 placeholder-slate-400 text-sm outline-none transition-all"
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md shadow-primary-100/10 transition-all text-sm mt-2"
                    >
                        Sign In
                    </button>

                    {/* Feedback Messages */}
                    {errorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200/60 rounded-xl text-center">
                            <p className="text-xs font-semibold text-red-600">{errorMsg}</p>
                        </div>
                    )}
                    {isSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200/60 rounded-xl text-center">
                            <p className="text-xs font-semibold text-green-600">Success! Redirecting...</p>
                        </div>
                    )}
                </form>

                {/* Footer link */}
                <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 hover:underline font-semibold transition-all">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
