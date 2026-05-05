import { Link } from 'react-router-dom'
import { Clock, CheckCircle, Truck, ShoppingBag, ChevronRight, MapPin, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { MOCK_ORDERS } from '@/utils/mockData'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/utils/helpers'

const ORDER_STEPS = [
  { key: 'confirmed', label: 'Confirmée', icon: CheckCircle },
  { key: 'preparing', label: 'Préparation', icon: Clock },
  { key: 'picked_up', label: 'En route', icon: Truck },
  { key: 'delivered', label: 'Livré', icon: CheckCircle },
]

const STATUS_ORDER = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivering', 'delivered']

function OrderProgress({ status }: { status: string }) {
  const currentStep = STATUS_ORDER.indexOf(status)

  return (
    <div className="mt-4 pt-4 border-t border-surface-100">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-surface-200" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-brand-400 transition-all duration-500"
          style={{ width: `${Math.min((currentStep / (ORDER_STEPS.length - 1)) * 100, 100)}%` }}
        />
        {ORDER_STEPS.map((step, i) => {
          const stepIndex = STATUS_ORDER.indexOf(step.key)
          const isCompleted = currentStep >= stepIndex
          const isCurrent = STATUS_ORDER[currentStep] === step.key || 
            (step.key === 'picked_up' && (status === 'picked_up' || status === 'delivering'))
          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5 relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-brand-500 text-white shadow-brand'
                    : 'bg-white border-2 border-surface-200 text-stone-300'
                } ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-medium ${isCompleted ? 'text-brand-600' : 'text-stone-400'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function OrdersPage() {
  // Use mock data + a simulated active order
  const activeOrder = {
    ...MOCK_ORDERS[0],
    status: 'delivering' as 'delivered',
  }

  const pastOrders = [
    { ...MOCK_ORDERS[0], id: 2, reference: 'SE-2024-002', status: 'delivered' as const, total: 38.5, created_at: new Date(Date.now() - 86400000).toISOString() },
    { ...MOCK_ORDERS[0], id: 3, reference: 'SE-2024-003', status: 'delivered' as const, total: 22, created_at: new Date(Date.now() - 172800000).toISOString() },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="section-title">Mes commandes</h1>
        <p className="section-subtitle mt-2">Suivez vos commandes en cours et passées</p>
      </div>

      {/* Active order */}
      <section className="mb-10">
        <h2 className="font-semibold text-stone-700 text-sm uppercase tracking-wider mb-4">
          Commande en cours
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 border-2 border-brand-200 bg-gradient-to-br from-brand-50/50 to-white"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={activeOrder.restaurant.image}
                alt={activeOrder.restaurant.name}
                className="w-12 h-12 rounded-2xl object-cover"
              />
              <div>
                <p className="font-semibold text-stone-900">{activeOrder.restaurant.name}</p>
                <p className="text-sm text-stone-500">Réf. {activeOrder.reference}</p>
              </div>
            </div>
            <span className="badge-brand border border-brand-200">
              🛵 En livraison
            </span>
          </div>

          {/* Driver */}
          {activeOrder.driver && (
            <div className="flex items-center gap-3 mt-4 p-3 bg-white rounded-2xl border border-surface-100">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🛵</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-stone-900 text-sm">{activeOrder.driver.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-stone-500">{activeOrder.driver.rating}</span>
                  <span className="text-xs text-stone-400 ml-1">{activeOrder.driver.vehicle}</span>
                </div>
              </div>
              <a
                href={`tel:${activeOrder.driver.phone}`}
                className="text-brand-500 hover:text-brand-600 text-sm font-medium"
              >
                Appeler
              </a>
            </div>
          )}

          {/* ETA */}
          <div className="flex items-center gap-2 mt-3">
            <Clock className="w-4 h-4 text-brand-500" />
            <p className="text-sm text-stone-700">
              Livraison estimée à <strong>{activeOrder.estimated_delivery}</strong>
            </p>
          </div>

          <OrderProgress status="delivering" />

          {/* Address */}
          <div className="flex items-center gap-2 mt-4 text-sm text-stone-500">
            <MapPin className="w-4 h-4" />
            <span>{activeOrder.delivery_address.street}, {activeOrder.delivery_address.city}</span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-100">
            <span className="font-bold text-stone-900">{formatPrice(activeOrder.total)}</span>
            <button className="btn-secondary text-sm py-2">Suivre sur la carte</button>
          </div>
        </motion.div>
      </section>

      {/* Past orders */}
      <section>
        <h2 className="font-semibold text-stone-700 text-sm uppercase tracking-wider mb-4">
          Historique
        </h2>
        <div className="space-y-4">
          {pastOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-5 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={order.restaurant.image}
                    alt={order.restaurant.name}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="font-semibold text-stone-900">{order.restaurant.name}</p>
                    <p className="text-xs text-stone-400">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={ORDER_STATUS_COLORS[order.status]}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                  <span className="font-bold text-stone-900">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                <p className="text-xs text-stone-500">Réf. {order.reference}</p>
                <Link
                  to={`/restaurant/${order.restaurant.slug}`}
                  className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-medium"
                >
                  Recommander
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Empty state placeholder */}
      {pastOrders.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-surface-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 text-stone-300" />
          </div>
          <h3 className="font-semibold text-stone-700 text-lg mb-2">Aucune commande</h3>
          <p className="text-stone-400 text-sm mb-6">Vos commandes apparaîtront ici</p>
          <Link to="/restaurants" className="btn-primary">Commander maintenant</Link>
        </div>
      )}
    </div>
  )
}
