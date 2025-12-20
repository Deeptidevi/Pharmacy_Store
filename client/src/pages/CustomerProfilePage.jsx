import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Save, ArrowLeft } from 'lucide-react';
import NavBar from '../../components/NavBar';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const CustomerProfilePage = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  },[]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      if (!token) {
        navigate('/customer/login');
        return;
      }

      // We can get basic info from localStorage if API fetch fails or as initial state
      const storedCustomer = JSON.parse(localStorage.getItem('customer'));
      if (storedCustomer) {
        setCustomer({
          name: storedCustomer.name || "",
          email: storedCustomer.email || "",
          phone: storedCustomer.phone || ""
        });
        setLoading(false);
      }
      
      // Ideally fetch fresh data from server if endpoint exists
      // For now we rely on localStorage or what we just updated
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('customerToken');
      const response = await fetch(`${API_URL}/customer/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(customer),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // Update local storage
        localStorage.setItem('customer', JSON.stringify({ ...JSON.parse(localStorage.getItem('customer')), ...data.customer }));
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      return alert("New password and confirm password do not match!");
    }
    
    try {
      const token = localStorage.getItem('customerToken');
      const response = await fetch(`${API_URL}/customer/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <button 
          onClick={() => navigate('/customer/dashboard')}
          className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User size={20} />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
              </div>

              <button
                onClick={saveProfile}
                className="w-full mt-4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lock size={20} />
              Security
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>

              <button
                onClick={changePassword}
                className="w-full mt-4 border border-black text-black py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
