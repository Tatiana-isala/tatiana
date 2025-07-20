// 'use client'
// import { useAuth } from '../context/AuthContext'
// import Link from 'next/link'
// import { 
//   FaSignOutAlt, 
//   FaUser, 
//   FaHome, 
//   FaChevronDown, 
//   FaChalkboardTeacher,
//   FaBook,
//   FaCalendarAlt,
//   FaUsers
// } from 'react-icons/fa'
// import { useState } from 'react'

// function TeacherNavbar() {
//   const { user, signOut } = useAuth()
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [dropdownOpen, setDropdownOpen] = useState(false)

//   if (!user || user.role !== 'enseignant') return null

//   const teacherLinks = [
//     { href: "/teacher", label: "Tableau de bord", icon: <FaHome className="mr-2" /> },
//     { href: "/teacher/cours", label: "Mes Cours", icon: <FaBook className="mr-2" /> },
//     { href: "/teacher/emploi-du-temps", label: "Emploi du temps", icon: <FaCalendarAlt className="mr-2" /> },
//     { href: "/teacher/eleves", label: "Mes Élèves", icon: <FaUsers className="mr-2" /> },
//   ]

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo et navigation principale */}
//           <div className="flex items-center space-x-8">
//             <Link href="/teacher" className="text-xl font-bold text-gray-900 flex items-center">
//               <FaChalkboardTeacher className="mr-2 text-blue-600" />
//               <span className="hidden sm:inline">EduEnseignant</span>
//             </Link>

//             {/* Liens de navigation - version desktop */}
//             <div className="hidden md:flex space-x-6">
//               {teacherLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
//                 >
//                   {link.icon}
//                   {link.label}
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Section utilisateur */}
//           <div className="flex items-center space-x-4">
//             {/* Version desktop */}
//             <div className="hidden md:flex items-center space-x-2 relative">
//               <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//                 <FaUser />
//               </div>
              
//               <div className="text-sm text-left">
//                 <div className="font-medium text-gray-900">Prof. {user.name}</div>
//                 <div className="text-xs text-gray-500">{user.email}</div>
//               </div>
              
//               <button 
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="text-gray-400 hover:text-gray-500"
//               >
//                 <FaChevronDown className={`transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} />
//               </button>
              
//               {/* Dropdown menu */}
//               {dropdownOpen && (
//                 <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
//                   <div className="py-1">
//                     <button
//                       onClick={signOut}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       <FaSignOutAlt className="inline mr-2" />
//                       Déconnexion
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Menu mobile */}
//             <div className="md:hidden">
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="text-gray-500 hover:text-gray-700 focus:outline-none"
//               >
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   {mobileMenuOpen ? (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   ) : (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                   )}
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Menu mobile */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white pb-3 px-4 shadow-md">
//           <div className="pt-2 pb-3 space-y-1">
//             {teacherLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 <div className="flex items-center">
//                   {link.icon}
//                   {link.label}
//                 </div>
//               </Link>
//             ))}
//           </div>
          
//           <div className="pt-4 pb-3 border-t border-gray-200">
//             <div className="flex items-center px-3">
//               <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//                 <FaUser />
//               </div>
//               <div className="ml-3">
//                 <div className="text-sm font-medium text-gray-900">Prof. {user.name}</div>
//                 <div className="text-xs font-medium text-gray-500">{user.email}</div>
//               </div>
//             </div>
//             <div className="mt-3 px-3">
//               <button
//                 onClick={signOut}
//                 className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//               >
//                 <FaSignOutAlt className="mr-2" />
//                 Déconnexion
//               </button>
//             </div>
//           </div>
          
//         </div>
//       )}
//     </nav>
//   )
// }

// export default TeacherNavbar
'use client'
import { usePathname } from 'next/navigation'

import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import { 
  FaSignOutAlt, 
  FaUser, 
  FaHome,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaUsers,
  FaClipboardCheck,
  FaChartLine
} from 'react-icons/fa'
import { useState } from 'react'

function TeacherNavbar() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (!user || user.role !== 'enseignant') return null

  const navLinks = [
    { href: "/teachers", label: "Accueil", icon: <FaHome className="text-blue-500" /> },
    { href: "/schedule/view", label: "Emploi du temps", icon: <FaCalendarAlt className="text-blue-400" /> },
    { href: "/absences", label: "Absences", icon: <FaClipboardCheck className="text-red-500" /> },
    { href: "/courses", label: "Cours", icon: <FaBook className="text-gray-500" /> },
    { href: "/teachers/grades", label: "Notes", icon: <FaClipboardCheck className="text-green-500" /> },
    { href: "/teachers/overview", label: "Resultat", icon: <FaChartLine className="text-slate-400" /> },
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
          <Link href="/teacher" className="flex items-center space-x-2 text-xl font-semibold text-gray-800">
            <FaChalkboardTeacher className="text-blue-600" />
            <span>EduEnseignant</span>
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
              <p className="text-sm font-medium text-gray-900 truncate">Prof. {user.name}</p>
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

export default TeacherNavbar