import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Clock, Bike, ChevronRight } from 'lucide-react'
import type { Restaurant } from '@/types'
import { formatPrice, formatDeliveryTime } from '@/utils/helpers'
import { cn } from '@/utils/helpers'

interface Props {
  restaurant: Restaurant
  index?: number
}

export default function RestaurantCard({ restaurant, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      <Link to={`/restaurant/${restaurant.slug}`} className="block group">
        <div className={cn(
          'card-hover relative overflow-hidden',
          !restaurant.is_open && 'opacity-75',
        )}>
          {/* Image */}
          <div className="relative h-44 overflow-hidden">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Closed overlay */}
            {!restaurant.is_open && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-white px-4 py-1.5 rounded-full text-sm font-semibold text-stone-700 shadow">
                  Fermé actuellement
                </span>
              </div>
            )}

            {/* Promo badge */}
            {restaurant.promo && (
              <div className="absolute top-3 left-3">
                <span className="bg-brand-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-brand">
                  {restaurant.promo}
                </span>
              </div>
            )}

            {/* Featured badge */}
            {restaurant.featured && !restaurant.promo && (
              <div className="absolute top-3 left-3">
                <span className="bg-stone-900/80 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  ✨ Populaire
                </span>
              </div>
            )}

            {/* Rating on image */}
            <div className="absolute bottom-3 right-3">
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-stone-800">{restaurant.rating}</span>
                <span className="text-xs text-stone-400">({restaurant.review_count})</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-900 text-base leading-tight truncate group-hover:text-brand-600 transition-colors">
                  {restaurant.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 truncate">
                  {restaurant.cuisine.join(' · ')}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0 mt-1 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-100 text-xs text-stone-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                {formatDeliveryTime(restaurant.delivery_time)}
              </span>
              <span className="w-1 h-1 bg-surface-300 rounded-full" />
              <span className="flex items-center gap-1">
                <Bike className="w-3.5 h-3.5 text-stone-400" />
                {restaurant.delivery_fee === 0 ? (
                  <span className="text-emerald-600 font-medium">Gratuit</span>
                ) : (
                  formatPrice(restaurant.delivery_fee)
                )}
              </span>
              <span className="w-1 h-1 bg-surface-300 rounded-full" />
              <span>Min. {formatPrice(restaurant.min_order)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
