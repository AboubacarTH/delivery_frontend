import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RestaurantCard from '@/components/features/restaurants/RestaurantCard'
import { MOCK_RESTAURANTS, CUISINES } from '@/utils/mockData'

const SORT_OPTIONS = [
  { value: 'rating', label: 'Mieux notés' },
  { value: 'delivery_time', label: 'Plus rapide' },
  { value: 'delivery_fee', label: 'Livraison moins chère' },
  { value: 'min_order', label: 'Commande min. basse' },
]

export default function RestaurantsPage() {
  const [search, setSearch] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('rating')
  const [showClosed, setShowClosed] = useState(false)

  const filtered = useMemo(() => {
    let list = [...MOCK_RESTAURANTS]

    if (!showClosed) list = list.filter((r) => r.is_open)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.some((c) => c.toLowerCase().includes(q)),
      )
    }
    if (selectedCuisine && selectedCuisine !== 'Tout') {
      list = list.filter((r) =>
        r.cuisine.some((c) => c.toLowerCase().includes(selectedCuisine.toLowerCase())),
      )
    }

    list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'delivery_time') return a.delivery_time - b.delivery_time
      if (sortBy === 'delivery_fee') return a.delivery_fee - b.delivery_fee
      if (sortBy === 'min_order') return a.min_order - b.min_order
      return 0
    })

    return list
  }, [search, selectedCuisine, sortBy, showClosed])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Restaurants</h1>
        <p className="section-subtitle mt-2">
          {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Search & Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher un restaurant, une cuisine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11 pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field py-2.5 text-sm min-w-[160px]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cuisine filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
        {CUISINES.map((cuisine) => (
          <button
            key={cuisine.name}
            onClick={() => setSelectedCuisine(
              selectedCuisine === cuisine.name ? null : cuisine.name,
            )}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              selectedCuisine === cuisine.name || (cuisine.name === 'Tout' && !selectedCuisine)
                ? 'bg-brand-500 text-white border-brand-500 shadow-brand'
                : 'bg-white text-stone-600 border-surface-200 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            <span>{cuisine.icon}</span>
            {cuisine.name}
          </button>
        ))}
        <label className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-surface-200 bg-white text-stone-600 hover:border-stone-300 cursor-pointer ml-2">
          <input
            type="checkbox"
            checked={showClosed}
            onChange={(e) => setShowClosed(e.target.checked)}
            className="w-3.5 h-3.5 accent-brand-500"
          />
          Inclure fermés
        </label>
      </div>

      {/* Results */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div
            key="results"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="font-display font-semibold text-stone-700 text-xl mb-2">
              Aucun restaurant trouvé
            </h3>
            <p className="text-stone-400">Essayez d'autres filtres ou une autre recherche</p>
            <button
              onClick={() => { setSearch(''); setSelectedCuisine(null) }}
              className="btn-primary mt-6"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
