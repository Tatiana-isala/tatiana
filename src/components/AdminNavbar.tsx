'use client'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FaSignOutAlt,
  FaUser,
  FaHome,
  FaUsers,
  FaChalkboardTeacher,
  FaSchool,
  FaDollarSign,
  FaCalendarAlt,
  FaBook,
  FaClipboardCheck,
  FaBullhorn
} from 'react-icons/fa'
import { IoMdNotifications } from 'react-icons/io'
import { MdClass, MdSchedule } from 'react-icons/md'
import { useState } from 'react'

function AdminNavbar() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (!user || user.role !== 'admin') return null

  const navLinks = [
    { href: '/', label: 'Accueil', icon: <FaHome className="text-blue-500" /> },
    { href: '/students', label: 'Élèves', icon: <FaUsers className="text-indigo-500" /> },
    { href: '/parents', label: 'Parents', icon: <FaUsers className="text-teal-500" /> },
    { href: '/teacher', label: 'Enseignants', icon: <FaChalkboardTeacher className="text-amber-500" /> },
    { href: '/courses', label: 'Cours', icon: <FaBook className="text-emerald-500" /> },
    { href: '/classes', label: 'Classes', icon: <MdClass className="text-purple-500" /> },
    { href: '/schedule', label: 'Planification', icon: <MdSchedule className="text-rose-500" /> },
    { href: '/schedule/view', label: 'Horaire', icon: <FaCalendarAlt className="text-blue-400" /> },
    { href: '/absences', label: 'Absences', icon: <FaClipboardCheck className="text-red-500" /> },
    { href: '/comptabilite', label: 'Comptabilité', icon: <FaDollarSign className="text-green-500" /> },
    { href: '/annonces', label: 'Annonces', icon: <FaBullhorn className="text-yellow-500" /> },
    { href: '/communication/broadcast', label: 'Notifications', icon: <IoMdNotifications className="text-pink-500" /> }
  ]

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-gray-200"
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
     <aside
  className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  }`}
>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
            <FaSchool className="text-blue-600" />
            <span>EduManager</span>
          </Link>
        </div>

        <nav className="flex flex-col space-y-1 mt-4 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg mx-2 transition-colors ${
                pathname === link.href
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User profile section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaUser className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
          >
            <FaSignOutAlt className="text-sm" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminNavbar