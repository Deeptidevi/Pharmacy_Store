import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Shield, Lock, Save, History, CreditCard } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

export const AdminProfilePage = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Super Admin",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchRecentOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/profile`);
      if (response.ok) {
        const data = await response.json();
        setAdmin({
          name: data.name || "Admin",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "Super Admin"
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (response.ok) {
        const data = await response.json();
        // Map to display format and take top 5
        const formattedOrders = data.slice(0, 5).map(order => ({
          id: order._id.slice(-6),
          user: order.customer,
          date: new Date(order.createdAt).toLocaleDateString(),
          status: order.status,
          total: order.total
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleProfileChange = (field, value) => {
    setAdmin({ ...admin, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const saveProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(admin),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
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
      const response = await fetch(`${API_URL}/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  const inputClass = "w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Profile & Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account details and security.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & Password */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ADMIN PROFILE */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-black text-white rounded-lg">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-bold">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      className={`${inputClass} pl-10`}
                      value={admin.name}
                      onChange={(e) => handleProfileChange("name", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      className={`${inputClass} pl-10`}
                      value={admin.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      className={`${inputClass} pl-10`}
                      value={admin.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Role</label>
                  <div className="relative">
                    <Shield size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      className={`${inputClass} pl-10 bg-gray-50 text-gray-500 cursor-not-allowed`}
                      value={admin.role}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveProfile}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </motion.div>

            {/* CHANGE PASSWORD */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-gray-100 text-gray-900 rounded-lg">
                  <Lock size={20} />
                </div>
                <h2 className="text-xl font-bold">Security</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input
                    type="password"
                    className={inputClass}
                    value={passwords.current}
                    onChange={(e) => handlePasswordChange("current", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>New Password</label>
                    <input
                      type="password"
                      className={inputClass}
                      value={passwords.new}
                      onChange={(e) => handlePasswordChange("new", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Confirm Password</label>
                    <input
                      type="password"
                      className={inputClass}
                      value={passwords.confirm}
                      onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={changePassword}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Recent Activity / Orders */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 text-gray-900 rounded-lg">
                  <History size={20} />
                </div>
                <h2 className="text-xl font-bold">Recent Orders</h2>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No recent orders</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-4 border border-gray-100 rounded-lg hover:border-black/20 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs font-bold text-gray-500">#{order.id}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          order.status === "Delivered" ? "bg-green-100 text-green-800" :
                          order.status === "Pending" ? "bg-gray-100 text-gray-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm">{order.user}</p>
                          <p className="text-xs text-gray-400">{order.date}</p>
                        </div>
                        <span className="font-mono font-bold text-sm">₹{order.total}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <button className="w-full mt-6 py-2 text-sm font-bold text-gray-500 hover:text-black transition-colors border border-dashed border-gray-300 rounded-lg hover:border-black">
                View All History
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
