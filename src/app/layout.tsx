



// 'use client' // Nécessaire pour les hooks client-side
// import { usePathname } from 'next/navigation'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import { AuthProvider, useAuth } from '../context/AuthContext'
// import './globals.css'
// import Link from 'next/link'
// import {
//   FaSignOutAlt,
//   FaUser,
//   FaHome,
//   FaUserPlus,
//   FaUsers,
//   FaChalkboardTeacher,
//   FaSchool,
//   FaCalendarAlt,
//   FaEye,
//   FaBook,
//   FaMoneyBillWave,
//   FaChevronDown,
//   FaBell,
//   FaSearch,
//   FaDollarSign,
//   FaMailBulk
// } from 'react-icons/fa'
// import { useState } from 'react'
// import ParentNavbar from '@/components/ParentNavbar'
// import TeacherNavbar from '@/components/TeacherNavbar'
// import { FaMessage } from 'react-icons/fa6'
// import SyncManager from '@/components/SyncManager'
// function Navbar() {
//   const { user, signOut } = useAuth()
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)


//   if (user?.role === 'parent') {
//     return null
//   }

//   const roleColors = {
//     admin: 'bg-purple-100 text-purple-800',
//     enseignant: 'bg-blue-100 text-blue-800',
//     parent: 'bg-green-100 text-green-800'
//   }

//   const navLinks = [
//     { href: "/", label: "", icon: <FaHome className="mx-2" /> },
//     { href: "/students/register", label: "", icon: <FaUserPlus className="mr-2" /> },
//     { href: "/students", label: "Élèves", icon: <FaUsers className="mr-2" /> },
//     { href: "/parents", label: "Parents", icon: <FaUsers className="mr-2" /> },
//     { href: "/teacher", label: "Teacher", icon: <FaChalkboardTeacher className="mr-2" /> },
//     { href: "/courses", label: "courses", icon: <FaChalkboardTeacher className="mr-2" /> },
//     { href: "/classes", label: "classes", icon: <FaChalkboardTeacher className="mr-2" /> },
//     { href: "/absences", label: "absences", icon: <FaChalkboardTeacher className="mr-2" /> },
//     { href: "/communication", label: "", icon: <FaMessage className="mr-2" /> },
//     { href: "/comptabilite", label: "", icon: <FaDollarSign className="mr-2" /> },
//     { href: "/communication/broadcast", label: "Mail", icon: <FaMailBulk className="mr-2" /> },
//   ]

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo à gauche */}
//           <div className="flex items-center">
//             <Link href="/" className="text-xl font-bold text-gray-900 flex items-center">
//               <FaSchool className="mr-2 text-blue-600" />
//               <span className="hidden sm:inline">EduManager</span>
//             </Link>
//           </div>

//           {/* Liens centraux - cachés sur mobile */}
//           <div className="hidden md:flex md:items-center md:space-x-4 mx-auto">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="flex items-center  py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition duration-300"
//               >
//                 {link.icon}
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* Section droite avec utilisateur et icônes */}
//           <div className="flex items-center space-x-4">
       
//             {/* Icônes de recherche et notifications */}
//             <div className="flex items-center space-x-4">
//               {/* <button className="text-gray-500 hover:text-gray-700">
//                 <FaSearch className="h-5 w-5" />
//               </button> */}
//               <button className="text-gray-500 hover:text-gray-700 relative">
//                 <FaBell className="h-5 w-5" />
//                 <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
//               </button>
//             </div>

//             {/* Profil utilisateur */}
//             {user && (
//               <div className="flex items-center space-x-2">
//                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
//                   <FaUser className="text-gray-600" />
//                 </div>
//                 <div className="hidden md:block text-sm">
//                   <div className="font-medium text-gray-900">{user.name}</div>
//                   <div className="text-gray-500">{user.email}</div>
//                 </div>
//                 <button
//                   onClick={signOut}
//                   className="hidden md:flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition duration-300"
//                   title="Déconnexion"
//                 >
//                   <FaSignOutAlt />
//                 </button>
//               </div>
//             )}

//             {/* Bouton menu mobile */}
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
//             {navLinks.map((link) => (
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
//           {user && (
//             <div className="pt-4 pb-3 border-t border-gray-200">
//               <div className="flex items-center px-3">
//                 <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                   <FaUser className="text-gray-600" />
//                 </div>
//                 <div className="ml-3">
//                   <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                   <div className="text-xs font-medium text-gray-500">{user.email}</div>
//                 </div>
//               </div>
//               <div className="mt-3 px-3">
//                 <button
//                   onClick={signOut}
//                   className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//                 >
//                   <FaSignOutAlt className="mr-2" />
//                   Déconnexion
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//   )
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const pathname = usePathname()
//   const showNavbar = !['/auth/signin', '/auth/signup'].includes(pathname || '')

//   return (
//     <html lang="fr">
//       <body className="bg-gray-100 min-h-screen">
//         <AuthProvider>
//           {/* <Navbar /> */}
//            {/* <AuthAwareNavbar /> */}
//              {showNavbar && <AuthAwareNavbar />}
//           <main className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
//             <div className="bg-white rounded-lg shadow-sm p-3">
//               {children}
//             </div>
//           </main>
//           <ToastContainer
//             position="bottom-right"
//             autoClose={3000}
//             toastClassName="rounded-lg shadow-lg"
//             progressClassName="bg-blue-500"
//           />
//         </AuthProvider> 
//       </body>
//     </html>
//   )
// }

// // function AuthAwareNavbar() {
// //   const { user } = useAuth()
  
// //   if (user?.role === 'parent') {
// //     return <ParentNavbar />
// //   }
  
// //   return <Navbar />
// // }

// function AuthAwareNavbar() {
//   const { user } = useAuth()
  
//   if (user?.role === 'parent') return <ParentNavbar />
//   if (user?.role === 'enseignant') return <TeacherNavbar />
//   return <Navbar /> // Version par défaut (admin)
// }

// 'use client'
// import { useState } from 'react'
// import { usePathname } from 'next/navigation'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import { AuthProvider, useAuth } from '../context/AuthContext'
// import './globals.css'
// import Link from 'next/link'
// import {
//   FaSignOutAlt,
//   FaUser,
//   FaHome,
//   FaUserPlus,
//   FaUsers,
//   FaChalkboardTeacher,
//   FaSchool,
//   FaDollarSign,
//   FaMailBulk,
//   FaBell,
// } from 'react-icons/fa'
// import { FaMessage } from 'react-icons/fa6'
// import ParentNavbar from '@/components/ParentNavbar'
// import TeacherNavbar from '@/components/TeacherNavbar'

// function Sidebar() {
//   const { user, signOut } = useAuth()
//   const [isOpen, setIsOpen] = useState(false)

//   if (user?.role === 'parent') return null

//   const navLinks = [
//     { href: "/", label: "Accueil", icon: <FaHome /> },
//     { href: "/students/register", label: "Inscription", icon: <FaUserPlus /> },
//     { href: "/students", label: "Élèves", icon: <FaUsers /> },
//     { href: "/parents", label: "Parents", icon: <FaUsers /> },
//     { href: "/teacher", label: "Enseignants", icon: <FaChalkboardTeacher /> },
//     { href: "/courses", label: "Cours", icon: <FaChalkboardTeacher /> },
//     { href: "/classes", label: "Classes", icon: <FaChalkboardTeacher /> },
//     { href: "/absences", label: "Absences", icon: <FaChalkboardTeacher /> },
//     { href: "/communication", label: "Messages", icon: <FaMessage /> },
//     { href: "/comptabilite", label: "Comptabilité", icon: <FaDollarSign /> },
//     { href: "/communication/broadcast", label: "Mail", icon: <FaMailBulk /> },
//   ]

//   return (
//     <>
//       {/* Toggle button mobile */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
//       >
//         <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           {isOpen ? (
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           ) : (
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           )}
//         </svg>
//       </button>

//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
//         }`}
//       >
//         <div className="p-4 border-b flex items-center justify-between">
//           <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
//             <FaSchool />
//             <span>EduManager</span>
//           </Link>
//         </div>

//         <nav className="flex flex-col space-y-2 mt-4 px-4">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               onClick={() => setIsOpen(false)}
//               className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
//             >
//               {link.icon}
//               <span>{link.label}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="absolute bottom-0 w-full p-4 border-t">
//           {user && (
//             <div className="space-y-2 text-sm">
//               <div className="flex items-center space-x-3">
//                 <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
//                   <FaUser className="text-gray-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">{user.name}</div>
//                   <div className="text-gray-500">{user.email}</div>
//                 </div>
//               </div>
//               <button
//                 onClick={signOut}
//                 className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded"
//               >
//                 <FaSignOutAlt />
//                 Déconnexion
//               </button>
//             </div>
//           )}
//         </div>
//       </aside>
//     </>
//   )
// }

// function AuthAwareSidebar() {
//   const { user } = useAuth()
//   if (user?.role === 'parent') return <ParentNavbar />
//   if (user?.role === 'enseignant') return <TeacherNavbar />
//   return <Sidebar />
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname()
//   const showSidebar = !['/auth/signin', '/auth/signup'].includes(pathname || '')

//   return (
//     <html lang="fr">
//       <body className="bg-gray-100 min-h-screen">
//         <AuthProvider>
//           {showSidebar && <AuthAwareSidebar />}
//           <main className={`transition-all duration-300 ${showSidebar ? 'md:ml-64' : ''} p-4`}>
//             <div className="bg-white rounded-lg shadow-sm p-3">
//               {children}
//             </div>
//           </main>
//           <ToastContainer
//             position="bottom-right"
//             autoClose={3000}
//             toastClassName="rounded-lg shadow-lg"
//             progressClassName="bg-blue-500"
//           />
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }

// 'use client'

// import { usePathname } from 'next/navigation'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import { AuthProvider, useAuth } from '../context/AuthContext'
// import './globals.css'
// import Link from 'next/link'
// import {
//   FaSignOutAlt,
//   FaUser,
//   FaHome,
//   FaUserPlus,
//   FaUsers,
//   FaChalkboardTeacher,
//   FaSchool,
//   FaDollarSign,
//   FaMailBulk,
//   FaBell
// } from 'react-icons/fa'
// import { FaMessage } from 'react-icons/fa6'
// import { useState } from 'react'
// import ParentNavbar from '@/components/ParentNavbar'
// import TeacherNavbar from '@/components/TeacherNavbar'

// function Sidebar() {
//   const { user, signOut } = useAuth()
//   const [isOpen, setIsOpen] = useState(false)

//   if (user?.role === 'parent') return null

//   const navLinks = [
//     { href: '/', label: 'Accueil', icon: <FaHome /> },
//     { href: '/students/register', label: 'Inscription', icon: <FaUserPlus /> },
//     { href: '/students', label: 'Élèves', icon: <FaUsers /> },
//     { href: '/parents', label: 'Parents', icon: <FaUsers /> },
//     { href: '/teacher', label: 'Enseignants', icon: <FaChalkboardTeacher /> },
//     { href: '/courses', label: 'Cours', icon: <FaChalkboardTeacher /> },
//     { href: '/classes', label: 'Classes', icon: <FaChalkboardTeacher /> },
//     { href: '/absences', label: 'Absences', icon: <FaChalkboardTeacher /> },
//     { href: '/communication', label: 'Messages', icon: <FaMessage /> },
//     { href: '/comptabilite', label: 'Comptabilité', icon: <FaDollarSign /> },
//     { href: '/annonces', label: 'Annonces', icon: <FaDollarSign /> },
//     { href: '/communication/broadcast', label: 'Mail', icon: <FaMailBulk /> }
//   ]

//   return (
//     <>
//       {/* Toggle mobile */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
//       >
//         <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           {isOpen ? (
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           ) : (
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           )}
//         </svg>
//       </button>

//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
//         }`}
//       >
//         <div className="p-4 border-b flex items-center justify-between">
//           <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
//             <FaSchool />
//             <span>EduManager</span>
//           </Link>
//         </div>

//         <nav className="flex flex-col space-y-2 mt-4 px-4">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               onClick={() => setIsOpen(false)}
//               className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
//             >
//               {link.icon}
//               <span>{link.label}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="absolute bottom-0 w-full p-4 border-t">
//           {user && (
//             <div className="space-y-2 text-sm">
//               <div className="flex items-center space-x-3">
//                 <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
//                   <FaUser className="text-gray-600" />
//                 </div>
//                 <div>
//                   <div className="font-medium text-gray-900">{user.name}</div>
//                   <div className="text-gray-500">{user.email}</div>
//                 </div>
//               </div>
//               <button
//                 onClick={signOut}
//                 className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded"
//               >
//                 <FaSignOutAlt />
//                 Déconnexion
//               </button>
//             </div>
//           )}
//         </div>
//       </aside>
//     </>
//   )
// }

// function AuthAwareSidebar() {
//   const { user } = useAuth()
//   if (user?.role === 'parent') return <ParentNavbar />
//   if (user?.role === 'enseignant') return <TeacherNavbar />
//   return <Sidebar />
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname()
//   const showSidebar = !['/auth/signin', '/auth/signup'].includes(pathname || '')

//   return (
//     <html lang="fr">
//       <body className="bg-gray-100 min-h-screen">
//         <AuthProvider>
//           {showSidebar && <AuthAwareSidebar />}
//           <main className={`transition-all duration-300 ${showSidebar ? 'md:ml-64' : ''} p-4`}>
//             <div className="bg-white rounded-lg shadow-sm p-3">{children}</div>
//           </main>
//           <ToastContainer
//             position="bottom-right"
//             autoClose={3000}
//             toastClassName="rounded-lg shadow-lg"
//             progressClassName="bg-blue-500"
//           />
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }

'use client'

import { usePathname } from 'next/navigation'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from '../context/AuthContext'
import './globals.css'
import Link from 'next/link'
import {
  FaSignOutAlt,
  FaUser,
  FaHome,
  FaUserPlus,
  FaUsers,
  FaChalkboardTeacher,
  FaSchool,
  FaDollarSign,
  FaMailBulk,
  FaBell
} from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import { useState, Suspense } from 'react'
import ParentNavbar from '@/components/ParentNavbar'
import TeacherNavbar from '@/components/TeacherNavbar'
import LoadingSpinner from '@/components/LoadingSpinner'

function Sidebar() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (user?.role === 'parent') return null

  const navLinks = [
    { href: '/', label: 'Accueil', icon: <FaHome /> },
    // { href: '/students/register', label: 'Inscription', icon: <FaUserPlus /> },
    { href: '/students', label: 'Élèves', icon: <FaUsers /> },
    { href: '/parents', label: 'Parents', icon: <FaUsers /> },
    { href: '/teacher', label: 'Enseignants', icon: <FaChalkboardTeacher /> },
    { href: '/courses', label: 'Cours', icon: <FaChalkboardTeacher /> },
    { href: '/classes', label: 'Classes', icon: <FaChalkboardTeacher /> },
    { href: '/schedule', label: 'Planification', icon: <FaChalkboardTeacher /> },
    { href: '/schedule/view', label: 'Horaire', icon: <FaChalkboardTeacher /> },
    { href: '/absences', label: 'Absences', icon: <FaChalkboardTeacher /> },
    // { href: '/communication', label: 'Messages', icon: <FaMessage /> },
    { href: '/comptabilite', label: 'Comptabilité', icon: <FaDollarSign /> },
    { href: '/annonces', label: 'Annonces', icon: <FaDollarSign /> },
    { href: '/communication/broadcast', label: 'Mail', icon: <FaMailBulk /> }
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
      >
        <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
            <FaSchool />
            <span>EduManager</span>
          </Link>
        </div>

        <nav className="flex flex-col space-y-2 mt-4 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          {user && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-gray-500">{user.email}</div>
                </div>
              </div>
              <button
                onClick={signOut}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded"
              >
                <FaSignOutAlt />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function AuthAwareSidebar() {
  const { user } = useAuth()
  if (user?.role === 'parent') return <ParentNavbar />
  if (user?.role === 'enseignant') return <TeacherNavbar />
  return <Sidebar />
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showSidebar = !['/auth/signin', '/auth/signup'].includes(pathname || '')

  return (
    <html lang="fr">
      <body className="bg-gray-100 min-h-screen pt-5">
        <AuthProvider>
          {showSidebar && <AuthAwareSidebar />}
          <main className={`transition-all duration-300 ${showSidebar ? 'md:ml-64' : ''} `}>
            <div className="bg-white rounded-lg shadow-sm p-3">{children}</div>
          </main>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            toastClassName="rounded-lg shadow-lg"
            progressClassName="bg-blue-500"
          />
        </AuthProvider>
      </body>
    </html>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner  />}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  )
}
