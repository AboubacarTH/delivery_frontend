import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, MapPin, Search, Menu, X, User, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useAuthStore } from '@/store'
import { cn } from '@/utils/helpers'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const itemCount = useCartStore((s) => s.getItemCount())
  const toggleCart = useCartStore((s) => s.toggleCart)
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { label: 'Restaurants', href: '/restaurants' },
    { label: 'Offres', href: '/offres' },
    { label: 'Mes commandes', href: '/orders' },
  ]

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-white/60 shadow-soft'
            : 'bg-white/95 backdrop-blur-sm',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center shadow-brand group-hover:scale-110 transition-transform">
                <span className="text-white text-lg">🛵</span>
              </div>
              <span className="font-display font-semibold text-xl text-stone-900">
                Swift<span className="text-brand-500">Eats</span>
              </span>
            </Link>

            {/* Location selector */}
            <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-surface-100 transition-colors text-stone-600 hover:text-stone-900 border border-transparent hover:border-surface-200">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-medium">Paris, 75001</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1 ml-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                    location.pathname === link.href
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-surface-100',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search button (desktop) */}
            <button
              onClick={() => navigate('/restaurants')}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-100 rounded-2xl text-stone-500 hover:bg-surface-200 transition-colors text-sm border border-surface-200"
            >
              <Search className="w-4 h-4" />
              <span>Rechercher...</span>
            </button>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-surface-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-700 text-sm font-semibold">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 card p-1 shadow-card-hover"
                    >
                      <div className="px-3 py-2 border-b border-surface-100 mb-1">
                        <p className="font-medium text-stone-900 text-sm">{user?.name}</p>
                        <p className="text-xs text-stone-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-surface-50 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Mon profil
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-surface-50 rounded-xl transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Mes commandes
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1 border-t border-surface-100"
                      >
                        Se déconnecter
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Connexion</Link>
                <Link to="/register" className="btn-primary text-sm">S'inscrire</Link>
              </div>
            )}

            {/* Cart button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-2xl hover:bg-brand-600 transition-all shadow-brand hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Panier</span>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-stone-900 text-white text-xs rounded-full flex items-center justify-center font-bold"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden btn-ghost p-2"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-surface-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                <button className="flex items-center gap-2 w-full px-3 py-2 text-stone-600 hover:bg-surface-100 rounded-xl text-sm">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  Paris, 75001
                </button>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-3 py-2 text-stone-600 hover:bg-surface-100 rounded-xl text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="flex gap-2 pt-2">
                    <Link to="/login" className="btn-secondary flex-1 text-center text-sm">Connexion</Link>
                    <Link to="/register" className="btn-primary flex-1 text-center text-sm">S'inscrire</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-16" />
    </>
  )
}
