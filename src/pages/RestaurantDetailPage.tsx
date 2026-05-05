import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Clock, Bike, ChevronRight, Plus, Info, Heart, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { MOCK_RESTAURANTS, MOCK_CATEGORIES } from '@/utils/mockData'
import { useCartStore } from '@/store'
import { formatPrice, formatDeliveryTime } from '@/utils/helpers'
import type { MenuItem } from '@/types'

export default function RestaurantDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [activeCategory, setActiveCategory] = useState(0)
  const [liked, setLiked] = useState(false)

  const restaurant = MOCK_RESTAURANTS.find((r) => r.slug === slug)
  const { addItem, openCart } = useCartStore()

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-stone-500">Restaurant introuvable</p>
        <Link to="/restaurants" className="btn-primary">Retour aux restaurants</Link>
      </div>
    )
  }

  const handleAddItem = (item: MenuItem) => {
    addItem(item, restaurant.id, restaurant.name)
    toast.success(`${item.name} ajouté au panier !`)
    openCart()
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
              liked ? 'bg-red-500 text-white' : 'bg-white/80 text-stone-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:bg-white transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1 text-sm text-white/80">
            <Link to="/" className="hover:text-white">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/restaurants" className="hover:text-white">Restaurants</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{restaurant.name}</span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Restaurant info card */}
        <div className="bg-white rounded-3xl shadow-card border border-surface-100 p-6 -mt-8 relative z-10 mb-8">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <img
              src={restaurant.logo}
              alt={`${restaurant.name} logo`}
              className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-surface-100"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display font-bold text-2xl text-stone-900">{restaurant.name}</h1>
                  <p className="text-stone-500 text-sm mt-1">{restaurant.cuisine.join(' · ')}</p>
                </div>
                {!restaurant.is_open && (
                  <span className="badge bg-red-50 text-red-600 border border-red-100">
                    Fermé actuellement
                  </span>
                )}
                {restaurant.is_open && (
                  <span className="badge-success border border-emerald-100">
                    ✓ Ouvert
                  </span>
                )}
              </div>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed">{restaurant.description}</p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-surface-100">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-stone-900">{restaurant.rating}</span>
                  <span className="text-stone-400 text-sm">({restaurant.review_count} avis)</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 text-sm">
                  <Clock className="w-4 h-4 text-stone-400" />
                  {formatDeliveryTime(restaurant.delivery_time)}
                </div>
                <div className="flex items-center gap-1.5 text-stone-600 text-sm">
                  <Bike className="w-4 h-4 text-stone-400" />
                  {restaurant.delivery_fee === 0 ? (
                    <span className="text-emerald-600 font-medium">Livraison gratuite</span>
                  ) : (
                    `${formatPrice(restaurant.delivery_fee)} de livraison`
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-stone-500 text-sm">
                  <Info className="w-4 h-4" />
                  Min. {formatPrice(restaurant.min_order)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex gap-8 pb-12">
          {/* Category sidebar (desktop) */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-semibold text-stone-700 text-sm mb-3 uppercase tracking-wider">Menu</h3>
              <nav className="space-y-1">
                {MOCK_CATEGORIES.map((cat, i) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(i)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeCategory === i
                        ? 'bg-brand-50 text-brand-600 border border-brand-100'
                        : 'text-stone-600 hover:bg-surface-100'
                    }`}
                  >
                    {cat.name}
                    <span className="float-right text-stone-400 font-normal">
                      {cat.items.length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Menu items */}
          <div className="flex-1 min-w-0">
            {/* Mobile category tabs */}
            <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
              {MOCK_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    activeCategory === i
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white text-stone-600 border-surface-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {MOCK_CATEGORIES.map((category, ci) => (
              <div
                key={category.id}
                className={ci !== activeCategory ? 'hidden lg:block' : ''}
              >
                <h2 className="font-display font-semibold text-xl text-stone-900 mb-4">
                  {category.name}
                </h2>
                <div className="space-y-3 mb-10">
                  <AnimatePresence>
                    {category.items.map((item, ii) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: ii * 0.06 }}
                        className={`card p-4 flex gap-4 group hover:shadow-card-hover transition-shadow ${
                          !item.is_available ? 'opacity-50' : ''
                        }`}
                      >
                        {item.image && (
                          <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-stone-900">{item.name}</h4>
                              {item.tags?.map((tag) => (
                                <span key={tag} className="badge-success text-xs mr-1 mt-0.5 inline-flex">{tag}</span>
                              ))}
                              <p className="text-stone-500 text-sm mt-1 leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                              {item.extras && item.extras.length > 0 && (
                                <p className="text-xs text-stone-400 mt-1">
                                  + Options disponibles
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-bold text-stone-900 text-lg">
                              {formatPrice(item.price)}
                            </span>
                            {item.is_available && restaurant.is_open ? (
                              <button
                                onClick={() => handleAddItem(item)}
                                className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-brand hover:-translate-y-0.5 active:translate-y-0"
                              >
                                <Plus className="w-4 h-4" />
                                Ajouter
                              </button>
                            ) : (
                              <span className="text-xs text-stone-400 italic">Non disponible</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
