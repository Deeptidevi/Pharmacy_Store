import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AdminProfilePage() {
  const [admin, setAdmin] = useState({
    name: "Admin",
    email: "admin@pharmacy.com",
    phone: "9876543210",
    role: "Super Admin",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Sample inventory items
  const [inventory] = useState([
    { id: 1, name: "Paracetamol", stock: 120, price: 40 },
    { id: 2, name: "Ibuprofen", stock: 80, price: 60 },
    { id: 3, name: "Amoxicillin", stock: 45, price: 120 },
  ]);

  // Sample orders (All users)
  const [orders] = useState([
    { id: 201, user: "Rohan", date: "2025-12-01", status: "Pending", total: 320 },
    { id: 202, user: "Simran", date: "2025-12-02", status: "Delivered", total: 190 },
    { id: 203, user: "Aman", date: "2025-12-03", status: "Out for Delivery", total: 450 },
  ]);

  const handleProfileChange = (field, value) => {
    setAdmin({ ...admin, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const saveProfile = () => {
    alert("Admin profile updated successfully!");
  };

  const changePassword = () => {
    if (passwords.new !== passwords.confirm) {
      return alert("New password and confirm password do not match!");
    }
    alert("Admin password changed!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Admin Dashboard</h1>

      {/* ADMIN PROFILE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Admin Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-1 font-semibold">Admin Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={admin.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Admin Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg"
              value={admin.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Phone</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              value={admin.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Role</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-gray-200"
              value={admin.role}
              disabled
            />
          </div>

        </div>

        <button
          onClick={saveProfile}
          className="mt-6 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
        >
          Save Changes
        </button>
      </motion.div>

      {/* CHANGE PASSWORD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Change Password</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="password"
            placeholder="Current Password"
            className="p-3 border rounded-lg"
            value={passwords.current}
            onChange={(e) => handlePasswordChange("current", e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="p-3 border rounded-lg"
            value={passwords.new}
            onChange={(e) => handlePasswordChange("new", e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            className="p-3 border rounded-lg"
            value={passwords.confirm}
            onChange={(e) => handlePasswordChange("confirm", e.target.value)}
          />
        </div>

        <button
          onClick={changePassword}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Update Password
        </button>
      </motion.div>

      {/* ORDER MANAGEMENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-700">All Orders</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3 font-semibold">{order.id}</td>
                  <td className="p-3">{order.user}</td>
                  <td className="p-3">{order.date}</td>

                  <td
                    className={`p-3 font-semibold ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "Pending"
                        ? "text-gray-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </td>

                  <td className="p-3 font-semibold">₹{order.total}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </motion.div>

    </div>
  );
}
