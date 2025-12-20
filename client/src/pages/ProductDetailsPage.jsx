import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ShoppingCart, ArrowLeft, Package, Calendar } from 'lucide-react';
import NavBar from '../../components/NavBar';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchMedicineDetails();
  }, [id]);

  const fetchMedicineDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/medicines/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMedicine(data);
      }
    } catch (error) {
      console.error("Error fetching medicine details:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => item._id === medicine._id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ ...medicine, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
  if (!medicine) return <div className="text-center py-12">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-purple-600 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Shop
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="bg-purple-50 rounded-xl p-8 flex items-center justify-center min-h-[400px] overflow-hidden">
              {medicine.image ? (
                <img 
                  src={`${import.meta.env.VITE_API_URL}/${medicine.image.replace(/\\/g, '/')}`} 
                  alt={medicine.name} 
                  className="w-full h-full object-contain max-h-[400px]" 
                />
              ) : (
                <Package className="w-32 h-32 text-purple-300" />
              )}
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-600 bg-purple-50 rounded-full mb-3">
                  {medicine.category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{medicine.name}</h1>
                <p className="text-lg text-gray-500">{medicine.manufacturer}</p>
              </div>

              <div className="prose prose-purple mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {medicine.description || "No description available for this product."}
                </p>
              </div>

              {medicine.prescriptionRequired && (
                <div className="flex items-center p-4 bg-red-50 border border-red-100 rounded-lg mb-8">
                  <AlertCircle className="text-red-500 w-6 h-6 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800">Prescription Required</h4>
                    <p className="text-sm text-red-600">You will need to upload a valid doctor's prescription at checkout.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-4xl font-bold text-gray-900">₹{medicine.price}</p>
                </div>
                <div className="h-12 w-px bg-gray-200"></div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
                  <div className="flex items-center text-gray-700 font-medium">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(medicine.expiry).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={addToCart}
                  className="flex-1 bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
