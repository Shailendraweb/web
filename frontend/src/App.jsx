import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicRoute, RoleRoute } from './components/ProtectedRoute'
import { AdminLayout, CustomerLayout } from './components/PortalLayout'
import { isAdmin } from './utils/authUtils'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminResourcePage } from './pages/AdminResourcePage'
import { CategoryPage } from './pages/CategoryPage'
import { SubcategoryPage } from './pages/SubcategoryPage'
import { BrandPage } from './pages/BrandPage'
import { CustomerShopPage } from './pages/CustomerShopPage'
import { ProductListingPage } from './pages/ProductListingPage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { CustomerProfilePage } from './pages/CustomerProfilePage'
import { OrdersPage } from './pages/OrdersPage'
import './App.css'

function PortalLanding() { return <Navigate to={isAdmin() ? '/admin' : '/shop'} replace /> }
function AdminRoute({ children }) { return <RoleRoute role="admin"><AdminLayout>{children}</AdminLayout></RoleRoute> }
function CustomerRoute({ children }) { return <RoleRoute role="customer"><CustomerLayout>{children}</CustomerLayout></RoleRoute> }

function App() {
  return <Router><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
    <Route path="/admin/users" element={<AdminRoute><AdminResourcePage type="users" /></AdminRoute>} />
    <Route path="/admin/products" element={<AdminRoute><AdminResourcePage type="products" /></AdminRoute>} />
    <Route path="/admin/orders" element={<AdminRoute><AdminResourcePage type="orders" /></AdminRoute>} />
    <Route path="/admin/inventory" element={<AdminRoute><AdminResourcePage type="inventory" /></AdminRoute>} />
    <Route path="/admin/reports/*" element={<AdminRoute><AdminResourcePage type="reports" /></AdminRoute>} />
    <Route path="/admin/coupons" element={<AdminRoute><AdminResourcePage type="reports" /></AdminRoute>} />
    <Route path="/admin/settings" element={<AdminRoute><AdminResourcePage type="users" /></AdminRoute>} />
    <Route path="/admin/categories" element={<AdminRoute><CategoryPage /></AdminRoute>} />
    <Route path="/admin/subcategories" element={<AdminRoute><SubcategoryPage /></AdminRoute>} />
    <Route path="/admin/brands" element={<AdminRoute><BrandPage /></AdminRoute>} />
    <Route path="/shop" element={<CustomerRoute><CustomerShopPage /></CustomerRoute>} />
    <Route path="/products" element={<CustomerRoute><ProductListingPage /></CustomerRoute>} />
    <Route path="/products/:id" element={<CustomerRoute><ProductDetailsPage /></CustomerRoute>} />
    <Route path="/cart" element={<CustomerRoute><CartPage /></CustomerRoute>} />
    <Route path="/checkout" element={<CustomerRoute><CheckoutPage /></CustomerRoute>} />
    <Route path="/orders" element={<CustomerRoute><OrdersPage /></CustomerRoute>} />
    <Route path="/profile/*" element={<CustomerRoute><CustomerProfilePage /></CustomerRoute>} />
    <Route path="/wishlist" element={<CustomerRoute><CustomerProfilePage /></CustomerRoute>} />
    <Route path="/portal" element={<ProtectedRoute><PortalLanding /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Router>
}

export default App
