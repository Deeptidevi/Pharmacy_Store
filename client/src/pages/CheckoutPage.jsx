import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import NavBar from '../../components/NavBar';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'Credit Card'
  });
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [needsPrescription, setNeedsPrescription] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
    const restricted = items.some(item => item.prescriptionRequired);
    setNeedsPrescription(restricted);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPrescription(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user')); // Assuming user is stored in localStorage
      const customerEmail = user ? user.email : "guest@example.com"; // Fallback for now

      const formDataToSend = new FormData();
      formDataToSend.append('customer', customerEmail);
      formDataToSend.append('items', JSON.stringify(cartItems));
      formDataToSend.append('total', total);
      formDataToSend.append('address', `${formData.address}, ${formData.city} - ${formData.zipCode}`);
      formDataToSend.append('paymentMethod', formData.paymentMethod);
      
      if (prescription) {
        formDataToSend.append('prescription', prescription);
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        localStorage.removeItem('cart');
        alert('Order placed successfully!');
        navigate('/customer/dashboard');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription Upload */}
              {needsPrescription && (
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Prescription Required</h2>
                  <p className="text-sm text-gray-600 mb-4">One or more items in your cart require a doctor's prescription.</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                      id="prescription-upload"
                    />
                    <label htmlFor="prescription-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-purple-600">Click to upload prescription</span>
                      <span className="text-xs text-gray-500 mt-1">JPG or PNG only</span>
                      {prescription && (
                        <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {prescription.name}
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'Credit Card' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={formData.paymentMethod === 'Credit Card'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <CreditCard className={`w-6 h-6 mr-3 ${formData.paymentMethod === 'Credit Card' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-gray-900">Credit Card</span>
                  </label>

                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'Cash on Delivery' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <Banknote className={`w-6 h-6 mr-3 ${formData.paymentMethod === 'Cash on Delivery' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="font-medium text-gray-900">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay ₹${total}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                    <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
