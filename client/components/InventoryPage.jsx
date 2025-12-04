import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InventoryPage() {
  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Paracetamol",
      category: "Pain Relief",
      price: 50,
      quantity: 8,
      expiry: "2024-02-10",
      manufacturer: "Pharma Ltd",
    },
    {
      id: 2,
      name: "Amoxicillin",
      category: "Antibiotic",
      price: 120,
      quantity: 25,
      expiry: "2025-01-01",
      manufacturer: "Medico Pvt Ltd",
    },
  ]);

  const [newMed, setNewMed] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    expiry: "",
    manufacturer: "",
  });

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");

  const [editingMed, setEditingMed] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ADD MEDICINE
  const addMedicine = () => {
    if (!newMed.name || !newMed.category || !newMed.price) return alert("Fill all fields!");
    setMedicines([...medicines, { ...newMed, id: Date.now() }]);
    setNewMed({
      name: "",
      category: "",
      price: "",
      quantity: "",
      expiry: "",
      manufacturer: "",
    });
  };

  // UPDATE MEDICINE
  const updateMedicine = () => {
    setMedicines(
      medicines.map((m) => (m.id === editingMed.id ? { ...editingMed } : m))
    );
    setEditingMed(null);
  };

  // DELETE MEDICINE
  const deleteMedicine = () => {
    setMedicines(medicines.filter((m) => m.id !== confirmDelete));
    setConfirmDelete(null);
  };

  // STATUS COLOR
  const getStatusColor = (med) => {
    const today = new Date();
    const expiryDate = new Date(med.expiry);
    if (expiryDate < today) return "bg-red-100 border-red-500";
    if (med.quantity < 10) return "bg-yellow-100 border-yellow-500";
    return "bg-green-100 border-green-500";
  };

  // FILTERED DATA
  const filteredMedicines = medicines
    .filter((med) => med.name.toLowerCase().includes(search.toLowerCase()))
    .filter((med) => (filterCategory === "All" ? med : med.category === filterCategory))
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "quantity") return a.quantity - b.quantity;
      if (sortBy === "expiry") return new Date(a.expiry) - new Date(b.expiry);
      return 0;
    });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Inventory Management</h1>

      {/* SEARCH + FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search medicine..."
          className="p-3 rounded-lg border shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 rounded-lg border shadow-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>All</option>
          <option>Pain Relief</option>
          <option>Antibiotic</option>
          <option>Vitamin</option>
        </select>

        <select
          className="p-3 rounded-lg border shadow-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="quantity">Quantity</option>
          <option value="expiry">Expiry Date</option>
        </select>
      </div>

      {/* ⭐ New Modern Add Medicine Section */}
      <div className="bg-white p-8 rounded-xl shadow-lg mb-10 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Add Medicine</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Medicine Name</label>
            <input
              type="text"
              placeholder="Paracetamol"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <input
              type="text"
              placeholder="Pain Relief / Antibiotic"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={newMed.category}
              onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Price (₹)</label>
            <input
              type="number"
              placeholder="120"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={newMed.price}
              onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Quantity</label>
            <input
              type="number"
              placeholder="50"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={newMed.quantity}
              onChange={(e) => setNewMed({ ...newMed, quantity: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Expiry Date</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={newMed.expiry}
              onChange={(e) => setNewMed({ ...newMed, expiry: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Manufacturer</label>
            <input
              type="text"
              placeholder="ABC Pharma Ltd."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={newMed.manufacturer}
              onChange={(e) => setNewMed({ ...newMed, manufacturer: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={addMedicine}
          className="mt-6 bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 font-semibold shadow-md"
        >
          ➕ Add Medicine
        </button>
      </div>

      {/* MEDICINE LIST */}
      <h2 className="text-2xl font-bold mb-4">Inventory List</h2>

      <div className="grid grid-cols-1 gap-5">
        {filteredMedicines.map((med) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={`p-5 border-l-8 rounded-xl shadow-md ${getStatusColor(med)}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{med.name}</h3>

                <p className="text-sm text-gray-600">
                  Expiry in:{" "}
                  <span className="font-bold">
                    {Math.floor(
                      (new Date(med.expiry) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </span>
                </p>

                <p>Category: {med.category}</p>
                <p>Price: ₹{med.price}</p>

                <p>
                  Quantity:{" "}
                  <span
                    className={
                      med.quantity < 10
                        ? "text-yellow-700 font-bold animate-pulse"
                        : "text-black"
                    }
                  >
                    {med.quantity}
                  </span>
                </p>

                <p>Manufacturer: {med.manufacturer}</p>
              </div>

              <div className="space-x-3">
                <button
                  onClick={() => setEditingMed(med)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => setConfirmDelete(med.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingMed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Edit Medicine</h2>

              {Object.keys(editingMed).map((field) =>
                field === "id" ? null : (
                  <input
                    key={field}
                    className="p-2 border rounded-md w-full mb-2"
                    value={editingMed[field]}
                    onChange={(e) =>
                      setEditingMed({ ...editingMed, [field]: e.target.value })
                    }
                  />
                )
              )}

              <div className="flex justify-end space-x-3 mt-3">
                <button
                  onClick={() => setEditingMed(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>

                <button
                  onClick={updateMedicine}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white p-6 rounded-lg w-80 text-center">
              <h3 className="text-xl font-bold mb-4">Delete Item?</h3>
              <p>Are you sure you want to delete this medicine?</p>

              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteMedicine}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
