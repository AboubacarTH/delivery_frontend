import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/store'
import { formatPrice } from '@/utils/helpers'

export default function CartSidebar() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore()

  const subtotal = getSubtotal()
  const deliveryFee = cart.items.length > 0 ? 2.5 : 0
  const total = subtotal + deliveryFee

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-100">
              <div>
                <h2 className="font-display font-semibold text-xl text-stone-900">Mon panier</h2>
                {cart.restaurant_name && (
                  <p className="text-sm text-stone-500 mt-0.5">{cart.restaurant_name}</p>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-100 transition-colors text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                  <div className="w-24 h-24 bg-surface-100 rounded-3xl flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-stone-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-700 text-lg">Votre panier est vide</p>
                    <p className="text-stone-400 text-sm mt-1">Ajoutez des plats pour commencer votre commande</p>
                  </div>
                  <button onClick={closeCart} className="btn-primary mt-2">
                    Découvrir les restaurants
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {cart.items.map((cartItem, index) => (
                    <motion.div
                      key={`${cartItem.item.id}-${index}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 bg-surface-50 rounded-2xl border border-surface-100"
                    >
                      {cartItem.item.image && (
                        <img
                          src={cartItem.item.image}
                          alt={cartItem.item.name}
                          className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 text-sm truncate">
                          {cartItem.item.name}
                        </p>
                        {cartItem.extras.length > 0 && (
                          <p className="text-xs text-stone-400 mt-0.5">
                            + {cartItem.extras.map((e) => e.name).join(', ')}
                          </p>
                        )}
                        <p className="text-brand-600 font-semibold text-sm mt-1">
                          {formatPrice(cartItem.item.price * cartItem.quantity)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeItem(cartItem.item.id)}
                          className="text-stone-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center bg-white border border-surface-200 rounded-lg hover:border-brand-300 hover:text-brand-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-stone-900">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Promo code */}
                  <div className="flex gap-2 mt-4">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-dashed border-surface-300 rounded-xl text-stone-400 text-sm">
                      <Tag className="w-4 h-4" />
                      <span>Code promo</span>
                    </div>
                    <button className="btn-secondary text-sm px-4">Appliquer</button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="p-6 border-t border-surface-100 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-500">
                    <span>Livraison</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-stone-900 text-base pt-2 border-t border-surface-100">
                    <span>Total</span>
                    <span className="text-brand-600">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
                >
                  Commander
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-center text-stone-400">
                  Livraison estimée : 25–35 min
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
