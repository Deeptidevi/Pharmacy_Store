import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DeliveryTrackingPage() {
  const steps = [
    { label: "Order Placed", icon: "🛒" },
    { label: "Packed", icon: "📦" },
    { label: "Dispatched", icon: "🚚" },
    { label: "Out for Delivery", icon: "🏍️" },
    { label: "Delivered", icon: "✅" },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const deliveryGuy = {
    name: "Rohan Kumar",
    phone: "98765 12345",
    vehicle: "Bike - HP12 AB 4455",
    profile: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">Track Your Order</h1>

      {/* DELIVERY PERSON CARD */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <img
          src={deliveryGuy.profile}
          alt="Delivery Person"
          className="w-20 h-20 rounded-full"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{deliveryGuy.name}</h2>
          <p className="text-gray-600">📞 {deliveryGuy.phone}</p>
          <p className="text-gray-600">🏍️ {deliveryGuy.vehicle}</p>
          <p className="mt-2 text-sm text-gray-500">Order ID: #12345</p>
          <p className="text-sm text-gray-500">Estimated Delivery: Today 4:00 PM - 6:00 PM</p>
        </div>
      </div>

      {/* CLEAN TIMELINE */}
      <div className="relative bg-white rounded-xl shadow-lg p-6">
        <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 z-0"></div>

        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const isDone = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div key={index} className="text-center w-1/5 relative">
                <motion.div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-xl ${
                    isDone
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-yellow-400 text-white animate-pulse"
                      : "bg-gray-300 text-gray-700"
                  }`}
                  animate={{ scale: isActive ? 1.3 : 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {step.icon}
                </motion.div>
                <p className="mt-2 text-sm font-semibold">{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* DELIVERY NOTES */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">Delivery Notes</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Keep your phone reachable for delivery updates.</li>
          <li>Delivery person may call before arrival.</li>
          <li>Check the order before confirming delivery.</li>
        </ul>
      </div>
    </div>
  );
}
