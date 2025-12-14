const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    name: { type: String, default: 'Admin' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, default: 'Super Admin' },
})


module.exports = mongoose.model('Admin', adminSchema);

