import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  ClipboardList, 
  Users, 
  User,
  TrendingUp, 
  ArrowRight, 
  AlertCircle, 
  PackageCheck, 
  Bell,
  Search,
  BarChart2,
  Shield
} from 'lucide-react';

const API_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total Stock', value: '0', icon: <Box size={20} />, change: '0%', note: 'items in inventory' },
    { title: 'Low Stock Alert', value: '0', icon: <AlertCircle size={20} />, change: '0%', note: 'items below 10' },
    { title: 'Expired Items', value: '0', icon: <ClipboardList size={20} />, change: '0%', note: 'need attention' },
    { title: 'Total Value', value: '₹0', icon: <TrendingUp size={20} />, change: '0%', note: 'inventory worth' },
  ]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchDashboardStats();
    fetchActivities();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/admin/profile`, {
          headers: { 'Authorization': token }
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error checking role:", error);
      }
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/stats`);
      const data = await response.json();
      
      setStats([
        { title: 'Total Stock', value: data.totalStock.toString(), icon: <Box size={20} />,  note: 'items in inventory' },
        { title: 'Low Stock Alert', value: data.lowStockCount.toString(), icon: <AlertCircle size={20} />, note: 'items below 10' },
        { title: 'Expired Items', value: data.expiredCount.toString(), icon: <ClipboardList size={20} />, note: 'need attention' },
        { title: 'Total Value', value: `₹${data.totalValue}`, icon: <TrendingUp size={20} />, note: 'inventory worth' },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/activity`);
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const getIconComponent = (iconType) => {
    switch(iconType) {
      case 'alert':
        return <AlertCircle size={16} className="text-black" />;
      case 'package':
        return <PackageCheck size={16} className="text-gray-400" />;
      case 'bell':
        return <Bell size={16} className="text-gray-400" />;
      default:
        return <Bell size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12 font-sans">
      
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back. Here is what’s happening in your pharmacy today.
          </p>
        </div>
        
        {/* Search Bar & Profile */}
        <div className="flex items-center gap-4">
          

          <Link to="/admin/profile" className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-all shadow-sm" title="Admin Profile">
            <User size={20} />
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading dashboard statistics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-black/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-black text-white rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
             
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 font-mono tracking-tighter mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                {stat.title}
              </p>
            </div>
          </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions (Management) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-black rounded-full"></span>
              Management
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/inventory" className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-black transition-all duration-300 flex items-center gap-5 shadow-sm hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <Box size={22} />
              </div>
              <div>
                <span className="block text-lg font-bold text-gray-900">Inventory</span>
                <span className="text-sm text-gray-500">Manage stock & items</span>
              </div>
              <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-black transition-colors" />
            </Link>

            <Link to="/admin/orders" className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-black transition-all duration-300 flex items-center gap-5 shadow-sm hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <ClipboardList size={22} />
              </div>
              <div>
                <span className="block text-lg font-bold text-gray-900">Orders</span>
                <span className="text-sm text-gray-500">Track pending deliveries</span>
              </div>
              <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-black transition-colors" />
            </Link>

            {userRole === 'Super Admin' && (
            <Link to="/admin/staff" className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-black transition-all duration-300 flex items-center gap-5 shadow-sm hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <Users size={22} />
              </div>
              <div>
                <span className="block text-lg font-bold text-gray-900">Staff</span>
                <span className="text-sm text-gray-500">Access controls & roles</span>
              </div>
              <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-black transition-colors" />
            </Link>
            )}

            <Link to="/admin/analytics" className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-black transition-all duration-300 flex items-center gap-5 shadow-sm hover:shadow-md">
              <div className="h-12 w-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <TrendingUp size={22} />
              </div>
              <div>
                <span className="block text-lg font-bold text-gray-900">Analytics</span>
                <span className="text-sm text-gray-500">Revenue & sales data</span>
              </div>
              <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-black transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Alerts (Notification Center) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gray-300 rounded-full"></span>
              Activity Feed
            </h2>
            <Link to="/alerts" className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors">
              View All
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {activitiesLoading ? (
              <div className="p-8 text-center text-gray-500">
                <p>Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No recent activities</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {activities.map((activity, index) => (
                  <li key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        {getIconComponent(activity.icon)}
                        <span>{activity.title}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{activity.timeAgo}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.message}</p>
                    {activity.type === 'low-stock' && (
                      <span className="inline-block px-2 py-0.5 bg-black text-white text-xs font-bold font-mono rounded">
                        {activity.detail}
                      </span>
                    )}
                    {activity.type === 'new-item' && (
                      <span className="text-xs text-gray-500">{activity.detail}</span>
                    )}
                    {activity.type === 'expired' && (
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold font-mono rounded">
                        {activity.detail}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;