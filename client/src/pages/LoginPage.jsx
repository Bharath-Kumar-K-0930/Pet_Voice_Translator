import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PawPrint } from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            login(response.data); // Use the login function from context
            navigate('/translate'); // Redirect to translator page on success
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
                <div className="text-center">
                    <PawPrint className="mx-auto h-12 w-auto text-cyan-400" />
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Sign in to your Account
                    </h2>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email Address" required className="w-full px-4 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" required className="w-full px-4 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" onChange={handleChange} />

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <button type="submit" className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-md transition duration-200">
                        Sign In
                    </button>
                </form>
                <p className="text-sm text-center text-slate-400">
                    Don't have an account? <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
