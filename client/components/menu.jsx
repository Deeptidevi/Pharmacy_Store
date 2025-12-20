import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkbox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hidden, sethidden] = useState(true);
  const [checked, setchecked] = useState(false);
  const [userType, setUserType] = useState(null);
  const isMainPage = location.pathname === '/';

  useEffect(() => {
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
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customer');
    setUserType(null);
    navigate('/');
    sethidden(true);
    setchecked(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    sethidden(true);
    setchecked(false);
  };

  const handleChange = () => {
    setchecked(!checked);
    sethidden(!hidden);
  }
  return (
    <StyledWrapper>
      <label className="hamburger">
        <input type="checkbox" checked={checked} onChange={handleChange} />
        <svg viewBox="0 0 32 32">
          <path className="line line-top-bottom"  d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" />
          <path className="line" d="M7 16 27 16" />
        </svg>
      </label>
     <div className={`absolute h-screen right-0 w-48 bg-white rounded-md shadow-lg py-14 z-50 transition-opacity duration-300  flex flex-col  justify-between ${hidden ? 'hidden' : ''}`}>
      <div className="flex flex-col gap-3">
        <button onClick={() => handleNavigation('/')} className="text-black px-6 hover:bg-gray-200 text-left">Home</button>
        <hr className="bg-indigo-100 text-indigo-100" />
        
        {!isMainPage && (
          <>
            <button onClick={() => handleNavigation('/shop')} className="text-black px-6 hover:bg-gray-200 text-left">Shop</button>
            <hr className="bg-indigo-100 text-indigo-100" />
            <button onClick={() => handleNavigation('/my-cart')} className="text-black px-6 hover:bg-gray-200 text-left">Cart</button>
            <hr className="bg-indigo-100 text-indigo-100" />
            <button onClick={() => handleNavigation('/customer/dashboard')} className="text-black px-6 hover:bg-gray-200 text-left">Dashboard</button>
            <hr className="bg-indigo-100 text-indigo-100" />
          </>
        )}

        <button onClick={() => handleNavigation('/contact')} className="text-black px-6  hover:bg-gray-200 text-left">Contact</button>
        <hr className="bg-indigo-100 text-indigo-100" />
      </div>
     
      <div className="pt-4 flex flex-col items-center gap-2 w-full ">
        <div className="w-4/5 flex flex-col gap-2">
          {userType ? (
             isMainPage ? (
                <button onClick={() => handleNavigation(userType === 'admin' ? "/dashboard" : "/customer/dashboard")} className="bg-black text-white w-full py-2 rounded-md hover:bg-white hover:text-black text-center border-2 border-transparent hover:border-black cursor-pointer">Dashboard</button>
             ) : (
                <button onClick={handleLogout} className="bg-red-600 text-white w-full py-2 rounded-md hover:bg-red-700 text-center border-2 border-transparent cursor-pointer">Logout</button>
             )
          ) : (
            <button onClick={() => handleNavigation('/register')} className="bg-black text-white w-full py-2 rounded-md hover:bg-white hover:text-black text-center border-2 border-transparent hover:border-black cursor-pointer">Register</button>
          )}
        </div>
        <p className="text-xs text-gray-400">© 2024 PMS. All rights reserved.</p>
      </div>
     </div>
    </StyledWrapper>
  );
}


const StyledWrapper = styled.div`

  .hamburger {
    cursor: pointer;
    color: black;
  }

  .hamburger input {
    display: none;
  }

  .hamburger svg {
    /* The size of the SVG defines the overall size */
    height: 2.5em;
    /* Define the transition for transforming the SVG */
    transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
     color: black;
  }

  .line {
    fill: none;
    stroke: gray;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 3;
    /* Define the transition for transforming the Stroke */
    transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
                stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .line-top-bottom {
  color: black;
  stroke: black;
    stroke-dasharray: 12 63;
  }

  .hamburger input:checked + svg {
    transform: rotate(-45deg);
  }

  .hamburger input:checked + svg .line-top-bottom {
    stroke-dasharray: 20 300;
    stroke-dashoffset: -32.42;
  }`;

export default Checkbox;
