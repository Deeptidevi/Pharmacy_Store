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
      <a href="/" className="pixelify text-xl  text-gray-800 font-bold ">PharmFlow</a>
      <div className="flex flex-row justify-between items-center py-4 space-x-8">
       <Menu />
      </div>
    </div>
    )
  }
  return (
    <div className="w-4/5 h-12 rounded-full bg-white fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-around md:justify-between px-4 md:px-5">
      <a href="/" className="pixelify text-xl  text-gray-800 ">PharmFlow</a>
      <div className="flex flex-row justify-between items-center py-4 space-x-8">
        {isMainPage ? (
          <>
            <a href="/" className="text-gray-800 cursor-pointer">Home</a>
            <a href="/contact" className="text-gray-800 cursor-pointer">Contact</a>
          </>
        ) : (
          <>
            <a href="/" className="text-gray-800 cursor-pointer">Home</a>
            <a href="/shop" className="text-gray-800 cursor-pointer">Shop</a>
            <a href="/my-cart" className="text-gray-800 cursor-pointer">Cart</a>
            <a href="/customer/dashboard" className="text-gray-800 cursor-pointer">Dashboard</a>
          </>
        )}
        
        {userType ? (
          isMainPage ? (
            <a href={userType === 'admin' ? "/dashboard" : "/customer/dashboard"} className="bg-gray-800 cursor-pointer text-white px-4 py-[5.5px] rounded-full hover:bg-gray-700 transition-colors">Dashboard</a>
          ) : (
            <button onClick={handleLogout} className="bg-red-600 cursor-pointer text-white px-4 py-[5.5px] rounded-full hover:bg-red-700 transition-colors">Logout</button>
          )
        ) : (
          <a href="/register" className="bg-gray-800 cursor-pointer text-white px-4 py-[5.5px] rounded-full ">Register</a>
        )}
      </div>
    </div>
    ) 
  };

export default NavBar
