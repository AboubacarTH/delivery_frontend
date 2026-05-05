import { useState } from 'react'
import { User, MapPin, Phone, Mail, Edit3, Save, X, ShoppingBag, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
  })

  if (!user) {
    navigate('/login')
    return null
  }

  const handleSave = () => {
    updateUser(form)
    toast.success('Profil mis à jour !')
    setEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('À bientôt !')
  }

  const stats = [
    { label: 'Commandes', value: '12', icon: ShoppingBag, color: 'bg-brand-50 text-brand-600' },
    { label: 'Restaurants favoris', value: '5', icon: User, color: 'bg-purple-50 text-purple-600' },
    { label: 'Adresses sauvegardées', value: '2', icon: MapPin, color: 'bg-emerald-50 text-emerald-600' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="section-title mb-8">Mon profil</h1>

      {/* Avatar & Info card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6"
      >
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-3xl flex items-center justify-center shadow-brand flex-shrink-0">
            <span className="text-white text-3xl font-display font-bold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                {editing ? (
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field text-lg font-semibold mb-1 py-2"
                  />
                ) : (
                  <h2 className="font-display font-bold text-xl text-stone-900">{user.name}</h2>
                )}
                <p className="text-stone-500 text-sm mt-0.5">Membre depuis {new Date(user.created_at).getFullYear()}</p>
              </div>

              {editing ? (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                    <Save className="w-4 h-4" /> Sauvegarder
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary py-2 px-3">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-secondary py-2 px-4 text-sm flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4" /> Modifier
                </button>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Mail className="w-4 h-4 text-stone-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Phone className="w-4 h-4 text-stone-400" />
                {editing ? (
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+33 6 00 00 00 00"
                    className="input-field py-1.5 text-sm"
                  />
                ) : (
                  user.phone ?? <span className="text-stone-400 italic">Non renseigné</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-4 text-center"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="font-bold text-xl text-stone-900">{stat.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Menu items */}
      <div className="card divide-y divide-surface-100">
        {[
          { icon: ShoppingBag, label: 'Mes commandes', desc: 'Historique et suivi', href: '/orders' },
          { icon: MapPin, label: 'Mes adresses', desc: 'Gérer mes adresses de livraison', href: '#' },
        ].map(({ icon: Icon, label, desc, href }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-4 p-5 hover:bg-surface-50 transition-colors group"
          >
            <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center group-hover:bg-brand-50 transition-colors">
              <Icon className="w-5 h-5 text-stone-500 group-hover:text-brand-500 transition-colors" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-stone-900">{label}</p>
              <p className="text-sm text-stone-500">{desc}</p>
            </div>
            <span className="text-stone-300 group-hover:text-brand-300 transition-colors">›</span>
          </a>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-5 hover:bg-red-50 transition-colors group text-left"
        >
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <LogOut className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="font-medium text-red-600">Se déconnecter</p>
            <p className="text-sm text-red-400">Fermer cette session</p>
          </div>
        </button>
      </div>
    </div>
  )
}
