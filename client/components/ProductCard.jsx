import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const ProductCard = ({ medicine }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-50 rounded-full mb-2">
              {medicine.category}
            </span>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{medicine.name}</h3>
            <p className="text-sm text-gray-500">{medicine.manufacturer}</p>
          </div>
          {medicine.prescriptionRequired && (
            <div className="group relative">
              <AlertCircle className="text-red-500 w-6 h-6" />
              <span className="absolute right-0 top-8 w-32 bg-red-100 text-red-800 text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                Prescription Required
              </span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {medicine.description || "No description available."}
        </p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-gray-900">₹{medicine.price}</span>
          <Link 
            to={`/product/${medicine._id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
