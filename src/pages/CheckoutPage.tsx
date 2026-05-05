import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, Wallet, Check, ArrowLeft, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useCartStore } from '@/store'
import { formatPrice } from '@/utils/helpers'

type PaymentMethod = 'card' | 'cash'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, getSubtotal, clearCart } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    zip: '',
    note: '',
  })

  const subtotal = getSubtotal()
  const deliveryFee = 2.5
  const total = subtotal + deliveryFee

  const handleOrder = async () => {
    if (!address.street || !address.city) {
      toast.error('Veuillez renseigner votre adresse de livraison')
      return
    }
    setIsLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800))
    clearCart()
    toast.success('Commande confirmée ! 🎉')
    navigate('/orders')
    setIsLoading(false)
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-stone-500">Votre panier est vide</p>
        <button onClick={() => navigate('/restaurants')} className="btn-primary">
          Découvrir les restaurants
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-surface-200 hover:bg-surface-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </button>
        <div>
          <h1 className="font-display font-bold text-2xl text-stone-900">Finaliser la commande</h1>
          <p className="text-stone-500 text-sm mt-0.5">{cart.restaurant_name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left - Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Delivery address */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-brand-500" />
              </div>
              <h2 className="font-display font-semibold text-stone-900 text-lg">Adresse de livraison</h2>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Numéro et nom de rue *"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="input-field"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Ville *"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Code postal"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="input-field"
                />
              </div>
              <textarea
                placeholder="Instructions de livraison (optionnel)..."
                value={address.note}
                onChange={(e) => setAddress({ ...address, note: e.target.value })}
                rows={2}
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Delivery time */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="font-display font-semibold text-stone-900 text-lg">Heure de livraison</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Dès que possible (~30 min)', 'Programmer'].map((opt, i) => (
                <button
                  key={opt}
                  className={`p-3 rounded-2xl border text-sm font-medium transition-all ${
                    i === 0
                      ? 'bg-brand-50 border-brand-300 text-brand-700'
                      : 'border-surface-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="font-display font-semibold text-stone-900 text-lg">Paiement</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { value: 'card' as PaymentMethod, label: 'Carte bancaire', icon: CreditCard },
                { value: 'cash' as PaymentMethod, label: 'Espèces', icon: Wallet },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setPaymentMethod(value)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    paymentMethod === value
                      ? 'border-brand-400 bg-brand-50'
                      : 'border-surface-200 hover:border-stone-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    paymentMethod === value ? 'bg-brand-100' : 'bg-surface-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${paymentMethod === value ? 'text-brand-600' : 'text-stone-400'}`} />
                  </div>
                  <span className={`text-sm font-medium ${paymentMethod === value ? 'text-brand-700' : 'text-stone-600'}`}>
                    {label}
                  </span>
                  {paymentMethod === value && (
                    <Check className="w-4 h-4 text-brand-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>

            {paymentMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 overflow-hidden"
              >
                <input type="text" placeholder="Numéro de carte" className="input-field" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/AA" className="input-field" />
                  <input type="text" placeholder="CVV" className="input-field" />
                </div>
                <input type="text" placeholder="Nom sur la carte" className="input-field" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Right - Order summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-semibold text-stone-900 text-lg mb-4">Récapitulatif</h2>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {cart.items.map((ci, i) => (
                <div key={i} className="flex items-center gap-3">
                  {ci.item.image && (
                    <img src={ci.item.image} alt={ci.item.name} className="w-10 h-10 rounded-xl object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{ci.item.name}</p>
                    <p className="text-xs text-stone-400">×{ci.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-stone-900">
                    {formatPrice(ci.item.price * ci.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-surface-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-stone-500">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Frais de livraison</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-surface-100">
                <span>Total</span>
                <span className="text-brand-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* ETA */}
            <div className="bg-brand-50 rounded-2xl p-3 mt-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <p className="text-sm text-brand-700">
                Livraison estimée : <strong>25–35 min</strong>
              </p>
            </div>

            {/* Order button */}
            <button
              onClick={handleOrder}
              disabled={isLoading}
              className="btn-primary w-full mt-4 py-3.5 text-base flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Confirmer la commande
                </>
              )}
            </button>

            <p className="text-xs text-center text-stone-400 mt-3">
              🔒 Paiement 100% sécurisé
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
