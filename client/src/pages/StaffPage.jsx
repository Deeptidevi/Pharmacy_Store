import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Trash2, Shield, Phone, Mail, ArrowLeft } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const StaffPage = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', phone: '' });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchAdmins();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token
    };
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/profile`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        if (data.role !== 'Super Admin') {
          alert("Access Denied: Super Admin only");
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_URL}/admins`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin_register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newAdmin)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Staff member added successfully');
        setNewAdmin({ name: '', email: '', password: '', phone: '' });
        fetchAdmins();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) return;
    try {
      const response = await fetch(`${API_URL}/admins/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        fetchAdmins();
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-500 mt-1">Manage your pharmacy staff and administrators.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Staff Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 text-purple-900 rounded-lg">
                  <UserPlus size={20} />
                </div>
                <h2 className="text-xl font-bold">Add New Staff</h2>
              </div>
              
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Phone Number</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-bold shadow-lg shadow-purple-200">
                  Create Account
                </button>
              </form>
            </div>
          </div>

          {/* Staff List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-900 rounded-lg">
                    <Users size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Current Staff</h2>
                </div>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {admins.length} Members
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {admins.map((admin) => (
                  <div key={admin._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          {admin.name}
                          {admin.role === 'Super Admin' && (
                            <Shield size={14} className="text-purple-600" />
                          )}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Mail size={14} /> {admin.email}</span>
                          {admin.phone && <span className="flex items-center gap-1"><Phone size={14} /> {admin.phone}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {admin.role}
                      </span>
                      {admin.role !== 'Super Admin' && (
                        <button 
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Staff"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
