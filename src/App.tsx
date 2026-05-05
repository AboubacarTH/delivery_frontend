import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import CartSidebar from '@/components/features/cart/CartSidebar'
import HomePage from '@/pages/HomePage'
import RestaurantsPage from '@/pages/RestaurantsPage'
import RestaurantDetailPage from '@/pages/RestaurantDetailPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrdersPage from '@/pages/OrdersPage'
import { LoginPage, RegisterPage } from '@/pages/AuthPages'
import ProfilePage from '@/pages/ProfilePage'

export default function App() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <CartSidebar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/offres" element={
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h1 className="section-title mb-3">Offres spéciales</h1>
              <p className="section-subtitle">Page en construction — revenez bientôt !</p>
            </div>
          } />
          <Route path="*" element={
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h1 className="section-title mb-3">Page introuvable</h1>
              <p className="section-subtitle mb-6">La page que vous cherchez n'existe pas.</p>
              <a href="/" className="btn-primary">Retour à l'accueil</a>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}
