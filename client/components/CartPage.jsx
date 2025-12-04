import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
  // Sample orders in the system
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "John Doe",
      items: [
        { id: 1, name: "Paracetamol", price: 50, quantity: 2 },
        { id: 2, name: "Vitamin C", price: 90, quantity: 1 },
      ],
      total: 190,
      status: "Pending",
      notes: "",
    },
    {
      id: 2,
      customer: "Alice Smith",
      items: [{ id: 3, name: "Amoxicillin", price: 120, quantity: 1 }],
      total: 120,
      status: "Processing",
      notes: "",
    },
  ]);

  const statuses = ["Pending", "Processing", "Out for Delivery", "Delivered"];

  // Update Order Status
  const updateStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Update Notes
  const updateNotes = (orderId, text) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, notes: text } : order
      )
    );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Admin Order Management
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Order #{order.id} — {order.customer}
              </h2>
              <span
                className={`px-3 py-1 rounded-full font-semibold ${
                  order.status === "Pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : order.status === "Processing"
                    ? "bg-blue-200 text-blue-800"
                    : order.status === "Out for Delivery"
                    ? "bg-purple-200 text-purple-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Items List */}
            <div className="mb-4 border-t pt-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2"
                >
                  <p>
                    {item.name} × {item.quantity}
                  </p>
                  <p>₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="font-bold text-lg mb-4">Total: ₹{order.total}</div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block font-semibold mb-1">Admin Notes</label>
              <input
                type="text"
                value={order.notes}
                onChange={(e) => updateNotes(order.id, e.target.value)}
                placeholder="Add internal notes..."
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Status Update */}
            <div className="flex space-x-3 flex-wrap">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(order.id, status)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    order.status === status
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
