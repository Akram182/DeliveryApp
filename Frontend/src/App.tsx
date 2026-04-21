import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/layouts/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ToastContainer } from '@/components/Toast';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { CatalogPage } from '@/pages/catalog/CatalogPage';
import { ProductDetailPage } from '@/pages/catalog/ProductDetailPage';
import { CartPage } from '@/pages/cart/CartPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { BalancePage } from '@/pages/balance/BalancePage';
import { OrdersPage, OrderDetailPage } from '@/pages/orders';
import { AdminPage } from '@/pages/admin';
import { AdminRoute } from '@/components/AdminRoute';
import { useCartStore } from '@/store/cartStore';

function CartLoader() {
  const fetchCart = useCartStore((s) => s.fetchCart);
  useEffect(() => { fetchCart(); }, []);
  return null;
}

export default function App() {
  return (
    <>
      <ToastContainer />
      <CartLoader />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:id" element={<ProductDetailPage />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <CatalogPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}