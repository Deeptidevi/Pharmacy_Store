const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('./model/Admin.js');
const Customer = require('./model/Customer.js');
const Medicine = require('./model/Medicine.js');
const Order = require('./model/Order.js');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors');


dotenv.config({ path: path.join(__dirname, '..', '.env') });
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';
app.use(express.json());

app.use(cors(
    {
        origin: ['http://localhost:5173', 'http://localhost:5000'], 
        credentials: true
    }
));

const connectMongo = async() => {
    try{
await mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("MongoDB connected");
})
    } catch(err){
        console.error("Error connecting to MongoDB:", err.message);
        
    }

};

function isLoggedIn(req,res, next){
}

app.post('/admin_register', async (req, res) => {
    const { email, password } = req.body;
    try{
        let isAdminExist = await Admin.findOne({email});
        if(isAdminExist){
            return res.status(400).json({ message: "Account already exists" });
        }else{
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({
            email,
            password: hashedPassword
        });

       
        res.status(201).json({ message: "Admin Registered Successfully" });
    }
    }catch(err){
        res.status(500).json({ message: "Server Error" });
    }
});

app.post('/admin_login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if(admin && (await bcrypt.compare(password, admin.password))){
            const token = jwt.sign(
                { id: admin._id, email: admin.email, role: 'admin' },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
            res.status(200).json({ message: "Login Successful", token });
        }
        else{
            res.status(401).json({ message: "Invalid Credentials" });
        }

        
    }catch(err){
        res.status(500).json({ message: "Server Error" });
    }
});

app.post('/customer_register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    try{
        let isCustomerExist = await Customer.findOne({email});
        if(isCustomerExist){
            return res.status(400).json({ message: "Account already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = await Customer.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        res.status(201).json({ message: "Customer Registered Successfully" });
    }catch(err){
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

app.post('/customer_login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email });

        if(customer && (await bcrypt.compare(password, customer.password))){
            const token = jwt.sign(
                { id: customer._id, email: customer.email, role: 'customer' },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
            res.status(200).json({ 
                message: "Login Successful", 
                token,
                customer: { name: customer.name, email: customer.email } 
            });
        }
        else{
            res.status(401).json({ message: "Invalid Credentials" });
        }
    }catch(err){
        res.status(500).json({ message: "Server Error" });
    }
});

// MEDICINE ROUTES

// GET all medicines
app.get('/api/medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        res.status(200).json(medicines);
    } catch (err) {
        res.status(500).json({ message: "Error fetching medicines", error: err.message });
    }
});

// GET single medicine by ID
app.get('/api/medicines/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }
        res.status(200).json(medicine);
    } catch (err) {
        res.status(500).json({ message: "Error fetching medicine", error: err.message });
    }
});

// POST - Add new medicine
app.post('/api/medicines', async (req, res) => {
    try {
        const { name, category, price, quantity, expiry, manufacturer } = req.body;
        
        if (!name || !category || !price || !quantity || !expiry || !manufacturer) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMedicine = await Medicine.create({
            name,
            category,
            price,
            quantity,
            expiry,
            manufacturer
        });

        res.status(201).json({ message: "Medicine added successfully", medicine: newMedicine });
    } catch (err) {
        res.status(500).json({ message: "Error adding medicine", error: err.message });
    }
});

// PUT - Update medicine
app.put('/api/medicines/:id', async (req, res) => {
    try {
        const { name, category, price, quantity, expiry, manufacturer } = req.body;
        
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            { name, category, price, quantity, expiry, manufacturer },
            { new: true, runValidators: true }
        );

        if (!updatedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json({ message: "Medicine updated successfully", medicine: updatedMedicine });
    } catch (err) {
        res.status(500).json({ message: "Error updating medicine", error: err.message });
    }
});

// DELETE - Remove medicine
app.delete('/api/medicines/:id', async (req, res) => {
    try {
        const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);
        
        if (!deletedMedicine) {
            return res.status(404).json({ message: "Medicine not found" });
        }

        res.status(200).json({ message: "Medicine deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting medicine", error: err.message });
    }
});

// GET dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const totalStock = await Medicine.countDocuments();
        const medicines = await Medicine.find();
        
        // Calculate low stock items (quantity < 10)
        const lowStockCount = medicines.filter(med => med.quantity < 10).length;
        
        // Calculate expired items
        const today = new Date();
        const expiredCount = medicines.filter(med => new Date(med.expiry) < today).length;

        // Calculate total value
        const totalValue = medicines.reduce((sum, med) => sum + (med.price * med.quantity), 0);

        res.status(200).json({
            totalStock,
            lowStockCount,
            expiredCount,
            totalValue: totalValue.toFixed(2)
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching dashboard stats", error: err.message });
    }
});

// GET activity feed for dashboard
app.get('/api/dashboard/activity', async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        const today = new Date();
        const activities = [];

        // Low stock alerts
        const lowStockItems = medicines.filter(med => med.quantity < 10 && med.quantity > 0);
        lowStockItems.slice(0, 3).forEach(med => {
            activities.push({
                type: 'low-stock',
                title: 'Low Stock Alert',
                message: `${med.name} is below threshold.`,
                detail: `${med.quantity} units left`,
                timestamp: med.updatedAt || med.createdAt,
                icon: 'alert'
            });
        });

        // Recently added medicines
        const recentlyAdded = medicines.slice(0, 2);
        recentlyAdded.forEach(med => {
            const timeDiff = Math.floor((today - new Date(med.createdAt)) / (1000 * 60));
            let timeStr = '';
            if (timeDiff < 60) {
                timeStr = `${timeDiff}m`;
            } else if (timeDiff < 1440) {
                timeStr = `${Math.floor(timeDiff / 60)}h`;
            } else {
                timeStr = `${Math.floor(timeDiff / 1440)}d`;
            }
            
            activities.push({
                type: 'new-item',
                title: 'New Item Added',
                message: `${med.name} added to inventory.`,
                detail: `${med.quantity} units`,
                timestamp: med.createdAt,
                timeAgo: timeStr,
                icon: 'package'
            });
        });

        // Expired items alerts
        const expiredItems = medicines.filter(med => new Date(med.expiry) < today);
        if (expiredItems.length > 0) {
            const expiredItem = expiredItems[0];
            activities.push({
                type: 'expired',
                title: 'Expiry Alert',
                message: `${expiredItem.name} has expired.`,
                detail: 'Requires attention',
                timestamp: expiredItem.expiry,
                icon: 'bell'
            });
        }

        // Sort by timestamp and limit to 5 most recent
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentActivities = activities.slice(0, 5);

        // Add time ago for all activities
        recentActivities.forEach(activity => {
            if (!activity.timeAgo) {
                const timeDiff = Math.floor((today - new Date(activity.timestamp)) / (1000 * 60));
                if (timeDiff < 60) {
                    activity.timeAgo = `${timeDiff}m`;
                } else if (timeDiff < 1440) {
                    activity.timeAgo = `${Math.floor(timeDiff / 60)}h`;
                } else {
                    activity.timeAgo = `${Math.floor(timeDiff / 1440)}d`;
                }
            }
        });

        res.status(200).json(recentActivities);
    } catch (err) {
        res.status(500).json({ message: "Error fetching activity feed", error: err.message });
    }
});

// ORDER ROUTES

// GET all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err.message });
    }
});

// PUT - Update order status/notes
app.put('/api/orders/:id', async (req, res) => {
    try {
        const { status, notes } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status, notes },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (err) {
        res.status(500).json({ message: "Error updating order", error: err.message });
    }
});

// ADMIN PROFILE ROUTES

// GET admin profile (assuming single admin or first found for now)
app.get('/api/admin/profile', async (req, res) => {
    try {
        // In a real app, get ID from auth token. Here we just get the first admin.
        const admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).json({ message: "Admin profile not found" });
        }
        res.status(200).json(admin);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
});

// PUT - Update admin profile
app.put('/api/admin/profile', async (req, res) => {
    try {
        const { name, email, phone, currentPassword, newPassword } = req.body;
        
        // Find the admin (assuming single admin)
        const admin = await Admin.findOne();
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Update basic info
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (phone) admin.phone = phone;

        // Update password if provided
        if (newPassword) {
            // In a real app, verify currentPassword first
            if (currentPassword && currentPassword === admin.password) {
                 admin.password = newPassword;
            } else if (currentPassword) {
                 return res.status(400).json({ message: "Incorrect current password" });
            }
        }

        await admin.save();
        res.status(200).json({ message: "Profile updated successfully", admin });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectMongo();
    console.log(`Server is running on  http://localhost:${PORT}`);
});
