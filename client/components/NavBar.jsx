import React, {useState, useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Menu from './menu.jsx';

const NavBar = () => {
  const [isMobile, setisMobile] = useState(false);
  const [userType, setUserType] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === '/';

  useEffect(()=> {
    const handleResize =()=> {
      if(window.innerWidth <= 768) {
        setisMobile(true);
      } else {
        setisMobile(false);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    
    const checkAuth = () => {
      const adminToken = localStorage.getItem('token');
      const customerToken = localStorage.getItem('customerToken');
      
      if (adminToken) {
        setUserType('admin');
      } else if (customerToken) {
        setUserType('customer');
      } else {
        setUserType(null);
      }
    };

    checkAuth();

    return () => window.removeEventListener('resize', handleResize);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customer');
    setUserType(null);
    navigate('/');
  };

  if(isMobile) {
    return(
      <div className="w-full h-12 rounded-b-lg bg-white fixed top-0 left-0 z-50 flex items-center justify-between px-7">
      <button onClick={() => navigate('/')} className="pixelify text-xl  text-gray-800 font-bold ">PharmFlow</button>
      <div className="flex flex-row justify-between items-center py-4 space-x-8">
       <Menu />
      </div>
    </div>
    )
  }
  return (
    <div className="w-4/5 h-12 rounded-full bg-white fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-around md:justify-between px-4 md:px-5">
      <button onClick={() => navigate('/')} className="pixelify text-xl  text-gray-800 ">PharmFlow</button>
      <div className="flex flex-row justify-between items-center py-4 space-x-8">
        {isMainPage ? (
          <>
            <button onClick={() => navigate('/')} className="text-gray-800 cursor-pointer">Home</button>
            <button onClick={() => navigate('/contact')} className="text-gray-800 cursor-pointer">Contact</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/')} className="text-gray-800 cursor-pointer">Home</button>
            <button onClick={() => navigate('/shop')} className="text-gray-800 cursor-pointer">Shop</button>
            <button onClick={() => navigate('/my-cart')} className="text-gray-800 cursor-pointer">Cart</button>
            <button onClick={() => navigate('/customer/dashboard')} className="text-gray-800 cursor-pointer">Dashboard</button>
          </>
        )}
        
        {userType ? (
          isMainPage ? (
            <button onClick={() => navigate(userType === 'admin' ? "/dashboard" : "/customer/dashboard")} className="bg-gray-800 cursor-pointer text-white px-4 py-[5.5px] rounded-full hover:bg-gray-700 transition-colors">Dashboard</button>
          ) : (
            <button onClick={handleLogout} className="bg-red-600 cursor-pointer text-white px-4 py-[5.5px] rounded-full hover:bg-red-700 transition-colors">Logout</button>
          )
        ) : (
          <button onClick={() => navigate('/register')} className="bg-gray-800 cursor-pointer text-white px-4 py-[5.5px] rounded-full ">Register</button>
        )}
      </div>
    </div>
    ) 
  };

export default NavBar
