import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../pages/App";
import {AdminOrdersPage} from "../pages/CartPage";
import {InventoryPage} from "../pages/InventoryPage";
import {AdminProfilePage} from "../pages/UserProfilePage";
import {DeliveryTrackingPage} from "../pages/DeliveryTrackingPage";
import Login from "../pages/Auth/login.jsx";
import Register from "../pages/Auth/register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import CustomerRegister from "../pages/Auth/customer_register.jsx";
import CustomerLogin from "../pages/Auth/customer_login.jsx";
import ShopPage from "../pages/ShopPage.jsx";
import ProductDetailsPage from "../pages/ProductDetailsPage.jsx";
import CustomerCartPage from "../pages/CustomerCartPage.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import CustomerDashboard from "../pages/CustomerDashboard.jsx";
import AnalyticsPage from "../pages/AnalyticsPage.jsx";
import StaffPage from "../pages/StaffPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import { CustomerProfilePage } from "../pages/CustomerProfilePage.jsx";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/my-cart" element={<CustomerCartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/profile" element={<CustomerProfilePage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/staff" element={<StaffPage />} />
        <Route path="/cart" element={ <AdminOrdersPage />} />
        <Route path="/admin/orders" element={ <AdminOrdersPage />} />
        <Route path="/admin/inventory" element={<InventoryPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/track" element={<DeliveryTrackingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}
