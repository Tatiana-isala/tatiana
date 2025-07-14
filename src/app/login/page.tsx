  
'use client'  
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FaUserAlt, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [attempts, setAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null)

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  // Vérifier le verrouillage au chargement de la page
  useEffect(() => {
    const storedLockout = localStorage.getItem('loginLockout')
    if (storedLockout) {
      const lockoutTime = new Date(JSON.parse(storedLockout))
      if (lockoutTime > new Date()) {
        setLockoutUntil(lockoutTime)
        setAttempts(3)
      } else {
        localStorage.removeItem('loginLockout')
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Vérifier si le compte est verrouillé
    if (lockoutUntil && lockoutUntil > new Date()) {
      setError(`Trop de tentatives échouées. Veuillez réessayer après ${lockoutUntil.toLocaleTimeString()}`)
      return
    }

    // Validation simple côté client
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await login(formData.username, formData.password)
      if (!success) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        
        if (newAttempts >= 3) {
          // Verrouillage pour 15 minutes
          const lockoutTime = new Date(Date.now() + 15 * 60 * 1000)
          setLockoutUntil(lockoutTime)
          localStorage.setItem('loginLockout', JSON.stringify(lockoutTime))
          setError('Trop de tentatives échouées. Veuillez réessayer dans 15 minutes.')
        } else {
          setError(`Identifiants incorrects (${newAttempts}/3 tentatives)`)
        }
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Calcul du temps restant pour le verrouillage
  const getRemainingTime = () => {
    if (!lockoutUntil) return null
    const now = new Date()
    if (lockoutUntil <= now) return null
    
    const diff = lockoutUntil.getTime() - now.getTime()
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    
    return `${minutes} min ${seconds} sec`
  }

  const remainingTime = getRemainingTime()
  const isLocked = lockoutUntil && lockoutUntil > new Date()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenue</h1>
          <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${isLocked ? 'bg-red-100 text-red-700' : 'bg-red-50 text-red-600'}`}>
            {error}
            {isLocked && remainingTime && (
              <div className="mt-1 font-medium">Temps restant: {remainingTime}</div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUserAlt className="text-gray-500" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLocked || isLoading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="username-error"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe 
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                disabled={isLocked || isLoading}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked || isLoading}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <FaEyeSlash className={`${isLocked || isLoading ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} />
                ) : (
                  <FaEye className={`${isLocked || isLoading ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLocked || isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
                isLocked ? 'bg-gray-400 cursor-not-allowed' : 
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLocked ? (
                'Accès bloqué'
              ) : isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Après 3 tentatives échouées, votre accès sera bloqué pendant 15 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}