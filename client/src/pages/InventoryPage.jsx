import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
const API_URL = `${import.meta.env.VITE_API_URL}/api/medicines`;

export const InventoryPage = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);

  const [newMed, setNewMed] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    expiry: "",
    manufacturer: "",
    image: null
  });

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");

  const [editingMed, setEditingMed] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  // FETCH ALL MEDICINES
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      alert("Failed to fetch medicines from server");
    } finally {
      setLoading(false);
    }
  };

  // ADD MEDICINE
  const addMedicine = async () => {
    if (!newMed.name || !newMed.category || !newMed.price || !newMed.quantity || !newMed.expiry || !newMed.manufacturer) {
      return alert("Fill all fields!");
    }

    try {
      const formData = new FormData();
      formData.append('name', newMed.name);
      formData.append('category', newMed.category);
      formData.append('price', newMed.price);
      formData.append('quantity', newMed.quantity);
      formData.append('expiry', newMed.expiry);
      formData.append('manufacturer', newMed.manufacturer);
      if (newMed.image) {
        formData.append('image', newMed.image);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        setNewMed({
          name: "",
          category: "",
          price: "",
          quantity: "",
          expiry: "",
          manufacturer: "",
          image: null
        });
        fetchMedicines(); // Refresh the list
      } else {
        alert(data.message || "Failed to add medicine");
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert("Failed to add medicine to server");
    }
  };

  // UPDATE MEDICINE
  const updateMedicine = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editingMed.name);
      formData.append('category', editingMed.category);
      formData.append('price', editingMed.price);
      formData.append('quantity', editingMed.quantity);
      formData.append('expiry', editingMed.expiry);
      formData.append('manufacturer', editingMed.manufacturer);
      if (editingMed.imageFile) {
        formData.append('image', editingMed.imageFile);
      }

      const response = await fetch(`${API_URL}/${editingMed._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        setEditingMed(null);
        fetchMedicines(); // Refresh the list
      } else {
        alert(data.message || "Failed to update medicine");
      }
    } catch (error) {
      console.error("Error updating medicine:", error);
      alert("Failed to update medicine");
    }
  };

  // DELETE MEDICINE
  const deleteMedicine = async () => {
    try {
      const response = await fetch(`${API_URL}/${confirmDelete}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        setConfirmDelete(null);
        fetchMedicines(); // Refresh the list
      } else {
        alert(data.message || "Failed to delete medicine");
      }
    } catch (error) {
      console.error("Error deleting medicine:", error);
      alert("Failed to delete medicine");
    }
  };

  // FORMAT DATE FOR DISPLAY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // STATUS BADGE COMPONENT
  const StatusBadge = ({ med }) => {
    const today = new Date();
    const expiryDate = new Date(med.expiry);

    if (expiryDate < today) {
      return (
        <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider">
          Expired
        </span>
      );
    }
    if (med.quantity < 10) {
      return (
        <span className="px-3 py-1 border border-black text-black text-xs font-bold uppercase tracking-wider">
          Low Stock
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider">
        In Stock
      </span>
    );
  };

  // FILTERED DATA
  const filteredMedicines = medicines
    .filter((med) => med.name.toLowerCase().includes(search.toLowerCase()))
    .filter((med) =>
      filterCategory === "All" ? med : med.category === filterCategory
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "quantity") return a.quantity - b.quantity;
      if (sortBy === "expiry") return new Date(a.expiry) - new Date(b.expiry);
      return 0;
    });

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white";

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-extrabold mb-8 tracking-tight text-black text-center">
          Inventory
        </h1>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading medicines...</p>
          </div>
        )}

        {/* SEARCH + FILTER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search medicine..."
            className={inputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className={inputClass}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option>All</option>
            <option>Pain Relief</option>
            <option>Antibiotic</option>
            <option>Vitamin</option>
            <option>Antiseptic</option>
            <option>Supplement</option>
          </select>

          <select
            className={inputClass}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price">Price</option>
            <option value="quantity">Quantity</option>
            <option value="expiry">Expiry Date</option>
          </select>
        </div>

        {/* ADD MEDICINE SECTION */}
        <div className="bg-white p-8 mb-12 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-black border-b border-gray-100 pb-4">
            Add New Item
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-gray-500">
                Medicine Name
              </label>
              <input
                type="text"
                placeholder="Paracetamol"
                className={inputClass}
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-gray-500">
                Category
              </label>
              <select
                className={inputClass}
                value={newMed.category}
                onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Antiseptic">Antiseptic</option>
                <option value="Supplement">Supplement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-gray-500">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="120"
                className={inputClass}
                value={newMed.price}
                onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-gray-500">
                Quantity
              </label>
              <input
                type="number"
                placeholder="50"
                className={inputClass}
                value={newMed.quantity}
                onChange={(e) => setNewMed({ ...newMed, quantity: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-gray-500">
                Expiry Date
              </label>
              <input
                type="date"
                className={inputClass}
                value={newMed.expiry}
                onChange={(e) => setNewMed({ ...newMed, expiry: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-gray-500">
                Manufacturer
              </label>
              <input
                type="text"
                placeholder="Pharma Ltd"
                className={inputClass}
                value={newMed.manufacturer}
                onChange={(e) => setNewMed({ ...newMed, manufacturer: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-gray-500">
                Medicine Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-black transition-colors cursor-pointer relative bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setNewMed({ ...newMed, image: e.target.files[0] })}
                />
                {newMed.image ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">Image Selected: {newMed.image.name}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewMed({...newMed, image: null});
                      }}
                      className="text-red-500 hover:text-red-700 text-xs underline z-10"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">Drag & drop an image here, or click to select</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={addMedicine}
            className="mt-8 bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors font-medium text-sm uppercase tracking-wider w-full md:w-auto"
          >
            + Add to Inventory
          </button>
        </div>

        {/* MEDICINE LIST */}
        <h2 className="text-xl font-bold mb-6 text-black">Current Stock</h2>

        <div className="grid grid-cols-1 gap-4">
          {filteredMedicines.length === 0 && !loading ? (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-500">No medicines found. Add your first item!</p>
            </div>
          ) : (
            filteredMedicines.map((med) => (
              <motion.div
                key={med._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 border border-gray-200 hover:border-black transition-colors shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-black">{med.name}</h3>
                    <StatusBadge med={med} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 text-sm text-gray-600">
                    <p>
                      Category: <span className="text-black">{med.category}</span>
                    </p>
                    <p>
                      Price: <span className="text-black">₹{med.price}</span>
                    </p>
                    <p>
                      Qty: <span className="text-black">{med.quantity}</span>
                    </p>
                    <p>
                      Expires: <span className="text-black">{formatDate(med.expiry)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setEditingMed(med)}
                    className="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-black text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setConfirmDelete(med._id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingMed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-8 w-full max-w-md shadow-2xl border border-gray-200">
              <h2 className="text-xl font-bold mb-6">Edit Medicine</h2>

              <div className="space-y-4">
                {Object.keys(editingMed).map((field) =>
                  field === "_id" || field === "__v" || field === "createdAt" || field === "updatedAt" ? null : (
                    <div key={field}>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        {field}
                      </label>
                      <input
                        type={field === "expiry" ? "date" : field === "price" || field === "quantity" ? "number" : "text"}
                        className={inputClass}
                        value={field === "expiry" ? formatDate(editingMed[field]) : editingMed[field]}
                        onChange={(e) =>
                          setEditingMed({
                            ...editingMed,
                            [field]: e.target.value,
                          })
                        }
                      />
                    </div>
                  )
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setEditingMed(null)}
                  className="px-6 py-2 border border-gray-300 text-black hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={updateMedicine}
                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 text-sm font-medium"
                >
                  Save Changes
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
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-8 w-full max-w-sm text-center shadow-2xl border border-gray-200">
              <h3 className="text-xl font-bold mb-2">Delete Item?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-6 py-2 border border-gray-300 text-black hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteMedicine}
                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 text-sm font-medium"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
