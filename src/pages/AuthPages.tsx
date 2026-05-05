import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/store'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    // Mock login
    login(
      { id: 1, name: 'Jean Dupont', email, created_at: new Date().toISOString() },
      'mock-token-123',
    )
    toast.success('Bienvenue !')
    navigate('/')
    setIsLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-brand">
            <span className="text-2xl">🛵</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-stone-900">Bon retour !</h1>
          <p className="text-stone-500 mt-2">Connectez-vous à votre compte SwiftEats</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Link to="/forgot-password" className="text-xs text-brand-500 hover:text-brand-600 mt-1.5 inline-block">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-stone-400">ou continuer avec</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Apple'].map((provider) => (
              <button
                key={provider}
                className="btn-secondary py-2.5 text-sm flex items-center justify-center gap-2"
              >
                {provider === 'Google' ? '🔍' : '🍎'}
                {provider}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-stone-500 text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-brand-500 hover:text-brand-600 font-medium">
            S'inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    login(
      { id: 1, name: form.name, email: form.email, phone: form.phone, created_at: new Date().toISOString() },
      'mock-token-456',
    )
    toast.success('Compte créé avec succès ! Bienvenue 🎉')
    navigate('/')
    setIsLoading(false)
  }

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value })

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-brand">
            <span className="text-2xl">🛵</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-stone-900">Créer un compte</h1>
          <p className="text-stone-500 mt-2">Rejoignez SwiftEats et savourez le meilleur</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Nom complet', field: 'name' as const, type: 'text', placeholder: 'Jean Dupont' },
              { label: 'Email', field: 'email' as const, type: 'email', placeholder: 'vous@exemple.com' },
              { label: 'Téléphone', field: 'phone' as const, type: 'tel', placeholder: '+33 6 12 34 56 78' },
              { label: 'Mot de passe', field: 'password' as const, type: 'password', placeholder: '8 caractères minimum' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
                <input
                  type={type}
                  required
                  value={form[field]}
                  onChange={update(field)}
                  placeholder={placeholder}
                  className="input-field"
                  minLength={field === 'password' ? 8 : undefined}
                />
              </div>
            ))}

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 accent-brand-500" />
              <span className="text-sm text-stone-500">
                J'accepte les{' '}
                <a href="#" className="text-brand-500 hover:text-brand-600">conditions d'utilisation</a>
                {' '}et la{' '}
                <a href="#" className="text-brand-500 hover:text-brand-600">politique de confidentialité</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-stone-500 text-sm mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
