import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if(email && password) {
            try {
                const response = await fetch('http://localhost:5000/admin_login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email,password }),
                });
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    if (response.ok) {
                        localStorage.setItem('token', data.token);
                        navigate('/dashboard');
                    } else {
                        setError(data.message || 'Login failed');
                    }
                } else {
                    const text = await response.text();
                    setError('Server returned non-JSON response: ' + text.substring(0, 50) + '...');
                }
            } catch (err) {
                setError('Network or parsing error: ' + err.message);
            }
        } else {
            setError('Please fill in all fields');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const rightPanelVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-black p-4'>
            <motion.div 
                className='w-full max-w-6xl h-auto md:h-[650px] flex flex-col md:flex-row bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className='md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/95 backdrop-blur-sm'
                    variants={itemVariants}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className='mb-8 text-center'
                    >
                       
                        <h2 className='text-4xl font-bold text-black'>
                            Admin Portal Login
                        </h2>
                    </motion.div>

                    <motion.form 
                        onSubmit={handleSubmit} 
                        className='space-y-6'
                        variants={itemVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <label className='block text-gray-700 text-sm font-semibold mb-2' htmlFor='email'>
                                Email Address
                            </label>
                            <motion.input 
                                whileFocus={{ scale: 1.02 }}
                                className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-300 shadow-sm'
                                id='email'
                                type='text' 
                                placeholder='admin@pharmacy.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className='block text-gray-700 text-sm font-semibold mb-2' htmlFor='password'>
                                Password
                            </label>
                            <motion.input 
                                whileFocus={{ scale: 1.02 }}
                                className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition duration-300 shadow-sm'
                                id='password'
                                type='password'
                                placeholder='••••••••'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </motion.div>

                        {error && (
                            <motion.p 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className='text-red-500 text-sm bg-red-50 p-3 rounded-lg'
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full bg-gray-800 text-white font-semibold py-4 rounded-xl shadow-lg transition duration-300'
                            type='submit'
                        >
                            Sign In
                        </motion.button>
                    </motion.form>

                    <motion.section 
                        className='mt-6 space-y-3'
                        variants={itemVariants}
                    >
                        <motion.div whileHover={{ x: 5 }} className='text-center'>
                            <Link to="/register" className="text-sm text-gray-800  font-medium">
                                Don't have an account? <span className='underline'>Register</span>
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                            <Link 
                                to='/customer/login' 
                                className="block w-full text-center text-sm text-white py-3 bg-black transition shadow-md font-medium"
                            >
                                Customer Login →
                            </Link>
                        </motion.div>
                    </motion.section>
                </motion.div>
                
                <motion.div 
                    className='md:w-1/2 bg-black p-12 flex flex-col justify-center text-white relative overflow-hidden'
                    variants={rightPanelVariants}
                >
                    <motion.div
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className='absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl'
                    />
                    
                    <motion.div
                        animate={{ 
                            rotate: -360,
                            scale: [1, 1.3, 1]
                        }}
                        transition={{ 
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className='absolute bottom-10 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl'
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className='relative z-10'
                    >
                        <motion.h2 
                            className='text-5xl font-bold mb-6 leading-tight'
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            Welcome Back!
                        </motion.h2>
                        <motion.p 
                            className='text-lg leading-relaxed opacity-95 mb-8'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.95 }}
                            transition={{ delay: 0.5 }}
                        >
                            Access your admin dashboard to manage inventory, orders, and streamline your pharmacy operations with ease.
                        </motion.p>
                        
                        <motion.div 
                            className='flex gap-4'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.2
                                    }}
                                    className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg'
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;