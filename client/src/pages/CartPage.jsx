import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, Search, Filter, ChevronDown, MoreHorizontal, ArrowLeft } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

export const AdminOrdersPage = () =>  {
  const navigate = useNavigate();
  // Sample orders in the system
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const statuses = ["Pending", "Processing", "Out for Delivery", "Delivered"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Order Status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Update Notes
  const updateNotes = async (orderId, text) => {
    // Optimistic update for typing feel
    setOrders(
      orders.map((order) =>
        order._id === orderId ? { ...order, notes: text } : order
      )
    );
    
    // Debounce or just fire and forget for now (in real app, debounce this)
    try {
      await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: text }),
      });
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-gray-100 text-gray-600 border-gray-200";
      case "Processing": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Out for Delivery": return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "Delivered": return "bg-green-50 text-green-700 border-green-100";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock size={14} />;
      case "Processing": return <Package size={14} />;
      case "Out for Delivery": return <Truck size={14} />;
      case "Delivered": return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order._id.toString().includes(searchTerm);
    const matchesFilter = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Orders
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track customer orders.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search size={16} className="text-gray-400 group-focus-within:text-black transition-colors" />
               </div>
               <input 
                 type="text" 
                 placeholder="Search orders..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm"
               />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-48 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
             <div className="text-center py-12">
               <p className="text-gray-600">Loading orders...</p>
             </div>
          ) : (
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-black/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold font-mono">#{order._id.slice(-6)}</span>
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-bold text-lg">{order.customer}</h3>
                      <p className="text-sm text-gray-500">{order.items.length} items</p>
                    </div>

                    {/* Items List */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-gray-500 text-xs">x{item.quantity}</span>
                          </div>
                          <span className="font-mono font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-200">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-lg font-mono">₹{order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Notes */}
                  <div className="lg:w-80 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                        Admin Notes
                      </label>
                      <textarea
                        value={order.notes}
                        onChange={(e) => updateNotes(order._id, e.target.value)}
                        placeholder="Add internal notes..."
                        rows="3"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                        Update Status
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(order._id, status)}
                            disabled={order.status === status}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                              order.status === status
                                ? "bg-black text-white cursor-default"
                                : "bg-white border border-gray-200 text-gray-600 hover:border-black hover:text-black"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          )}
          
          {!loading && filteredOrders.length === 0 && (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-xl border-dashed">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                <Search size={20} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
