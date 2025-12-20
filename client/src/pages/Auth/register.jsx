import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

   
const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
   
       
  const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
        } else if (email && password) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/admin_register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    if (response.ok) {
                        // Auto-login after registration
                        const loginResponse = await fetch(`${import.meta.env.VITE_API_URL}/admin_login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password }),
                        });
                        
                        if (loginResponse.ok) {
                            const loginData = await loginResponse.json();
                            localStorage.setItem('token', loginData.token);
                            localStorage.setItem('user', JSON.stringify(loginData.user));
                            navigate('/dashboard');
                        } else {
                            navigate('/login');
                        }
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
        } else {
            setError('Please fill in all fields');
        }
    };
    

    return (
        <div className='min-h-screen flex items-center justify-center bg-black'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-6xl h-[600px] flex flex-col md:flex-row bg-white rounded-2xl shad overflow-hidden'
            >
                
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='md:w-1/2 p-12 flex flex-col justify-center'
                >
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='text-3xl font-bold text-gray-800 mb-8 text-center'
                    >
                        Admin Portal Register
                    </motion.h2>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className='block text-gray-700 text-sm font-semibold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input 
                                className='w-full shad2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition duration-200'
                                id='email'
                                type='email' 
                                placeholder='Enter your Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className='block text-gray-700 text-sm font-semibold mb-2' htmlFor='password'>
                                Password
                            </label>
                            <input 
                                className='w-full shad2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition duration-200'
                                id='password'
                                type='password'
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label className='block text-gray-700 text-sm font-semibold mb-2' htmlFor='confirmPassword'>
                                Confirm Password
                            </label>
                            <input 
                                className='w-full shad2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition duration-200'
                                id='confirmPassword'
                                type='password'
                                placeholder='Confirm your password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </motion.div>
                        {error && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='text-red-500 text-sm'
                            >
                                {error}
                            </motion.p>
                        )}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className='flex justify-center'
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='bg-gray-800 hover:bg-black text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2'
                                type='submit'
                            >
                                Register
                            </motion.button>
                        </motion.div>
                    </form>
                    <motion.section 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className='mt-4 flex justify-center flex-col items-center gap-4'
                    >
                        <Link to="/login" className="text-sm text-gray-800">
                            Already have an account? Login
                        </Link>

                        <Link to='/customer/register' className="w-full text-center text-sm text-white p-3 bg-gray-800 rounded-lg hover:bg-black transition md:translate-y-8">
                            Customer Register
                        </Link>
                    </motion.section>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='md:w-1/2 bg-gradient-to-br from-gray-800 to-black p-12 flex flex-col justify-center text-white '
                >
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className='text-4xl font-bold mb-6'
                    >
                        Join Us Today
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className='text-lg leading-relaxed opacity-90 text-center'
                    >
                        Create your admin account to manage your pharmacy store efficiently. Fill in the details to get started.
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register