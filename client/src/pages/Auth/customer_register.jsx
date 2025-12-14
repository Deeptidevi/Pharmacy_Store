import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const CustomerRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/customer_register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                }),
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (response.ok) {
                    alert(data.message || 'Registration successful!');
                    navigate('/customer/login');
                } else {
                    setError(data.message || 'Registration failed');
                }
            } else {
                const text = await response.text();
                setError('Server returned non-JSON response: ' + text.substring(0, 50) + '...');
            }
        } catch (err) {
            setError('Network or parsing error: ' + err.message);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
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
        hidden: { opacity: 0, x: 50 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 font-sans'>
            <motion.div 
                className='w-full max-w-6xl h-auto md:h-[750px] flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden'
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left Panel - Form */}
                <motion.div 
                    className='md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto relative z-10'
                    variants={itemVariants}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mb-8'
                    >
                        <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight'>
                            Create Account
                        </h2>
                        <p className='text-gray-500 mt-2 text-sm md:text-base'>Join our pharmacy community today.</p>
                    </motion.div>

                    <motion.form 
                        onSubmit={handleSubmit} 
                        className='space-y-5'
                        variants={itemVariants}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div variants={itemVariants}>
                                <label className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2' htmlFor='name'>
                                    Full Name
                                </label>
                                <motion.input 
                                    whileFocus={{ scale: 1.01, borderColor: "#6366f1" }}
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all duration-200'
                                    id='name'
                                    name='name'
                                    type='text' 
                                    placeholder='John Doe'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2' htmlFor='phone'>
                                    Phone
                                </label>
                                <motion.input 
                                    whileFocus={{ scale: 1.01, borderColor: "#6366f1" }}
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all duration-200'
                                    id='phone'
                                    name='phone'
                                    type='tel' 
                                    placeholder='98765 43210'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </motion.div>
                        </div>

                        <motion.div variants={itemVariants}>
                            <label className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2' htmlFor='email'>
                                Email Address
                            </label>
                            <motion.input 
                                whileFocus={{ scale: 1.01, borderColor: "#6366f1" }}
                                className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all duration-200'
                                id='email'
                                name='email'
                                type='email' 
                                placeholder='john@example.com'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div variants={itemVariants}>
                                <label className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2' htmlFor='password'>
                                    Password
                                </label>
                                <motion.input 
                                    whileFocus={{ scale: 1.01, borderColor: "#6366f1" }}
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all duration-200'
                                    id='password'
                                    name='password'
                                    type='password'
                                    placeholder='••••••••'
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className='block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2' htmlFor='confirmPassword'>
                                    Confirm
                                </label>
                                <motion.input 
                                    whileFocus={{ scale: 1.01, borderColor: "#6366f1" }}
                                    className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all duration-200'
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    type='password'
                                    placeholder='••••••••'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </motion.div>
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className='text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center'
                            >
                                <span className="mr-2">⚠️</span> {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-4'
                            type='submit'
                        >
                            Create Account
                        </motion.button>
                    </motion.form>

                    <motion.div 
                        className='mt-8 flex flex-col items-center space-y-4'
                        variants={itemVariants}
                    >
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/customer/login" className="text-white font-bold  transition-colors">
                                Sign In
                            </Link>
                        </p>

                        <div className="w-full border-t border-gray-100 my-2"></div>

                        <Link 
                            to='/login' 
                            className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors flex items-center gap-1"
                        >
                            Are you an admin? <span className="underline">Login here</span>
                        </Link>
                    </motion.div>
                </motion.div>
                
                {/* Right Panel - Decorative */}
                <motion.div 
                    className='md:w-1/2 bg-black p-12 flex flex-col justify-center text-white relative overflow-hidden'
                    variants={rightPanelVariants}
                >
                    {/* Animated Background Elements */}
                    <motion.div
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.2, 1],
                            x: [0, 20, 0]
                        }}
                        transition={{ 
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className='absolute top-0 right-0 w-96 h-96 bg-black rounded-full blur-3xl mix-blend-overlay'
                    />
                    
                    <motion.div
                        animate={{ 
                            rotate: -360,
                            scale: [1, 1.3, 1],
                            x: [0, -30, 0]
                        }}
                        transition={{ 
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className='absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl mix-blend-overlay'
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className='relative z-10'
                    >
                        <h2 className='text-5xl font-bold mb-6 leading-tight tracking-tight'>
                            Start Your <br/>
                            <span className="text-white">
                                Health Journey
                            </span>
                        </h2>
                        <p className='text-lg text-indigo-100 leading-relaxed mb-10 max-w-md'>
                            Register now to access quality medicines, track your orders, and enjoy seamless pharmacy services at your fingertips.
                        </p>
                        
                        <div className='space-y-6'>
                            {[
                                { title: 'Easy Shopping', desc: 'Browse and order medicines online' },
                                { title: 'Fast Delivery', desc: 'Get your orders delivered quickly' },
                                { title: 'Verified Quality', desc: 'Only authentic medicines guaranteed' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ 
                                        delay: 0.6 + (i * 0.2),
                                        duration: 0.5
                                    }}
                                    className='flex items-start gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors'
                                >
                                    <div className="w-2 h-full bg-indigo-400 rounded-full min-h-[40px]"></div>
                                    <div>
                                        <h3 className='text-lg font-bold text-white'>{item.title}</h3>
                                        <p className='text-sm text-indigo-200'>{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className='mt-12 pt-6 border-t border-white/10'
                        >
                            <p className='text-sm text-indigo-300 italic'>
                                "Your health, our priority. Join thousands of satisfied customers today."
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CustomerRegister;
