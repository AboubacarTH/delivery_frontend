import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, ChevronRight, Zap, Shield, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import RestaurantCard from '@/components/features/restaurants/RestaurantCard'
import { MOCK_RESTAURANTS, CUISINES } from '@/utils/mockData'

export default function HomePage() {
  const [address, setAddress] = useState('')
  const navigate = useNavigate()

  const featuredRestaurants = MOCK_RESTAURANTS.filter((r) => r.featured)
  const openRestaurants = MOCK_RESTAURANTS.filter((r) => r.is_open)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/restaurants')
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-orange-50 pt-8 pb-20">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="badge-brand mb-4 inline-flex">
                  🛵 Livraison en 30 min garantie
                </span>
                <h1 className="text-5xl md:text-6xl font-display font-bold text-stone-900 leading-tight text-balance mb-6">
                  Savourez le{' '}
                  <span className="text-brand-500 relative">
                    meilleur
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                      <path d="M2 8 Q100 2 198 8" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>{' '}
                  de votre ville
                </h1>
                <p className="text-stone-500 text-lg font-light leading-relaxed mb-8">
                  Commandez vos plats préférés auprès des meilleurs restaurants et recevez-les directement chez vous, chauds et délicieux.
                </p>
              </motion.div>

              {/* Search form */}
              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="bg-white rounded-3xl shadow-card p-2 flex gap-2 border border-surface-200"
              >
                <div className="flex-1 flex items-center gap-3 px-4">
                  <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Votre adresse de livraison..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1 text-stone-800 placeholder:text-stone-400 focus:outline-none text-sm"
                  />
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2 rounded-2xl">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Rechercher</span>
                </button>
              </motion.form>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-6 mt-8"
              >
                {[
                  { icon: '🏪', label: '200+ restaurants' },
                  { icon: '⭐', label: '4.8 note moyenne' },
                  { icon: '🚀', label: '30 min livraison' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="text-xl">{stat.icon}</span>
                    <span className="text-sm text-stone-600 font-medium">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - Hero image collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {[
                { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', h: 'h-48' },
                { src: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80', h: 'h-64' },
                { src: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', h: 'h-64' },
                { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', h: 'h-48' },
              ].map((img, i) => (
                <div
                  key={i}
                  className={`${img.h} rounded-3xl overflow-hidden shadow-card ${i % 2 !== 0 ? 'mt-8' : ''}`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cuisine categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-card border border-surface-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-800">Cuisines</h2>
            <Link to="/restaurants" className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1">
              Tout voir <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {CUISINES.map((cuisine, i) => (
              <motion.button
                key={cuisine.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/restaurants?cuisine=${cuisine.name}`)}
                className="flex-shrink-0 flex flex-col items-center gap-2 px-5 py-3 rounded-2xl border border-surface-200 hover:border-brand-300 hover:bg-brand-50 transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{cuisine.icon}</span>
                <span className="text-xs font-medium text-stone-600 group-hover:text-brand-600 whitespace-nowrap">
                  {cuisine.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">En vedette</h2>
            <p className="section-subtitle mt-1">Nos restaurants les mieux notés du moment</p>
          </div>
          <Link
            to="/restaurants"
            className="hidden sm:flex items-center gap-1 text-brand-500 hover:text-brand-600 font-medium text-sm"
          >
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRestaurants.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
        </div>
      </section>

      {/* Why SwiftEats */}
      <section className="bg-gradient-to-b from-white to-brand-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Pourquoi SwiftEats ?</h2>
            <p className="section-subtitle mt-3">Simple, rapide, délicieux — chaque fois</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Livraison ultra-rapide',
                desc: 'Vos plats vous parviennent en moins de 35 minutes, toujours chauds et présentés avec soin.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: Shield,
                title: 'Paiement sécurisé',
                desc: 'Vos données bancaires sont protégées par un chiffrement de niveau bancaire. Commandez en toute sérénité.',
                color: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: Clock,
                title: 'Suivi en temps réel',
                desc: "Suivez votre commande à chaque étape, de la cuisine jusqu'à votre porte, sur la carte.",
                color: 'bg-brand-50 text-brand-600',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-semibold text-stone-900 text-lg mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Tous les restaurants</h2>
            <p className="section-subtitle mt-1">{openRestaurants.length} restaurants disponibles</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {openRestaurants.map((r, i) => (
            <RestaurantCard key={r.id} restaurant={r} index={i} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/restaurants" className="btn-secondary inline-flex items-center gap-2">
            Voir tous les restaurants
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-brand-500 rounded-4xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Votre première commande à -20%
              </h2>
              <p className="text-brand-100 text-lg font-light">
                Inscrivez-vous maintenant et profitez de l'offre de bienvenue sur votre première livraison.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/register"
                className="bg-white text-brand-600 font-semibold px-8 py-3.5 rounded-2xl hover:bg-brand-50 transition-colors shadow-sm text-center"
              >
                Commencer maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
                  <span className="text-white">🛵</span>
                </div>
                <span className="text-white font-display font-semibold text-xl">SwiftEats</span>
              </div>
              <p className="text-sm leading-relaxed">La plateforme de livraison qui vous rapproche des meilleurs restaurants de votre ville.</p>
            </div>
            {[
              { title: 'Services', links: ['Restaurants', 'Offres', 'Comment ça marche', 'Aide'] },
              { title: 'Légal', links: ['CGU', 'Confidentialité', 'Cookies', 'Mentions légales'] },
              { title: 'Contact', links: ['Support', 'Partenaires', 'Devenir livreur', 'Presse'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2024 SwiftEats. Tous droits réservés.</p>
            <div className="flex items-center gap-4 text-sm">
              <span>🇫🇷 Français</span>
              <span>€ EUR</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
