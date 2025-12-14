import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { MapPin, Phone, Truck, CheckCircle, Clock, Package, User, ChevronRight } from 'lucide-react';

const API_URL = "http://localhost:5000/api";

export const DeliveryTrackingPage = () => {
  const steps = [
    { label: "Order Placed", icon: <Clock size={20} />, status: "Pending" },
    { label: "Processing", icon: <Package size={20} />, status: "Processing" },
    { label: "Out for Delivery", icon: <Truck size={20} />, status: "Out for Delivery" },
    { label: "Delivered", icon: <CheckCircle size={20} />, status: "Delivered" },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestOrder();
  }, []);

  const fetchLatestOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          // Assuming the API returns orders sorted by date or we sort them
          // For now, just taking the first one as "latest" for demo
          const latestOrder = data[0]; 
          setOrder(latestOrder);
          updateProgress(latestOrder.status);
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = (status) => {
    const statusIndex = steps.findIndex(step => step.status === status);
    if (statusIndex !== -1) {
      setCurrentStep(statusIndex);
    } else {
      setCurrentStep(0);
    }
  };

  const deliveryGuy = {
    name: "Rohan Kumar",
    phone: "98765 12345",
    vehicle: "Bike - HP12 AB 4455",
    profile: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <Package size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">No Active Orders</h2>
        <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-2xl mb-6 shadow-lg">
            <Truck size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-500">
            Order ID: <span className="font-mono font-bold text-black">#{order._id.slice(-6)}</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </header>

        {/* DELIVERY PERSON CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
               <User size={40} className="text-gray-400" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{deliveryGuy.name}</h2>
            <p className="text-sm text-gray-500 mb-3">Delivery Partner</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                <Phone size={12} /> {deliveryGuy.phone}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                <Truck size={12} /> {deliveryGuy.vehicle}
              </span>
            </div>
          </div>

          <button className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
            Call Now
          </button>
        </motion.div>

        {/* TIMELINE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-lg font-bold mb-8 border-b border-gray-100 pb-4">Delivery Status</h3>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100"></div>

            <div className="space-y-8">
              {steps.map((step, index) => {
                const isDone = index <= currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div key={index} className="relative flex items-start gap-6 group">
                    {/* Icon Bubble */}
                    <motion.div
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-500 ${
                        isDone
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                      animate={{ scale: isCurrent ? 1.1 : 1 }}
                    >
                      {step.icon}
                    </motion.div>

                    {/* Text */}
                    <div className={`flex-1 pt-2 transition-opacity duration-500 ${isDone ? "opacity-100" : "opacity-50"}`}>
                      <h4 className={`text-base font-bold ${isCurrent ? "text-black" : "text-gray-900"}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{step.date}</p>
                    </div>

                    {/* Status Indicator */}
                    {isCurrent && (
                      <div className="pt-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-black text-white text-xs font-bold rounded uppercase tracking-wider animate-pulse">
                          Current
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DELIVERY NOTES */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6 border border-gray-200">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Delivery Instructions</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <ChevronRight size={16} className="text-black mt-0.5" />
              Keep your phone reachable for delivery updates.
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight size={16} className="text-black mt-0.5" />
              Delivery person may call before arrival.
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight size={16} className="text-black mt-0.5" />
              Check the order before confirming delivery.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
