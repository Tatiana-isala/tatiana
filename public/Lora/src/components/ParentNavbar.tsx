'use client'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import { FaSignOutAlt, FaUser, FaHome } from 'react-icons/fa'
import { useState } from 'react'
import { FaMessage } from 'react-icons/fa6'

function ParentNavbar() {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user || user.role !== 'parent') return null

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo simple */}
          <div className="flex items-center">
            <Link href="/parent" className="text-xl font-bold text-gray-900 flex items-center">
              <FaHome className="mr-2 text-blue-600" />
              <span>EduParent</span>
            </Link>
          </div>

          {/* Section utilisateur */}
          <div className="flex items-center">
            {/* Menu mobile */}
            <div className="md:hidden mr-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Profil utilisateur (version desktop) */}
            <div className="hidden md:flex items-center space-x-4">
                        <a href='/communication'><FaMessage/></a>

              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-gray-600" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs font-medium text-gray-500">{user.email}</div>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition duration-300"
                title="Déconnexion"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile (seulement le bouton de déconnexion) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white pb-3 px-4 shadow-md">
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-gray-600" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-3">
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaSignOutAlt className="mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default ParentNavbar