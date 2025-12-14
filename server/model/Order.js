const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true
    },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine'
        }
    }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Out for Delivery", "Delivered"],
        default: "Pending"
    },
    notes: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
