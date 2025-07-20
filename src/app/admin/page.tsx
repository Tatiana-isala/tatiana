// 'use client'
// import { useEffect, useState } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import { getAllUsers, deleteUser, User, exportToSupabase, importFromSupabase } from '../../lib/db'
// import { useRouter } from 'next/navigation'
// import { FaUser, FaSignOutAlt, FaCloudUploadAlt, FaDownload, FaSync, FaEdit, FaTrash, FaUserShield, FaChalkboardTeacher, FaUserFriends } from 'react-icons/fa'

// function formatStatus(user: User, isCurrentUser: boolean): { text: string, color: string } {
//   if (isCurrentUser) {
//     return {
//       text: 'En ligne',
//       color: 'bg-green-500 animate-pulse'
//     }
//   }

//   if (user.last_sign_in_at) {
//     const lastSeen = new Date(user.last_sign_in_at)
//     const now = new Date()
//     const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))

//     let timeText = ''
//     if (diffInMinutes < 1) timeText = 'à l\'instant'
//     else if (diffInMinutes < 60) timeText = `il y a ${diffInMinutes} min`
//     else if (diffInMinutes < 24 * 60) timeText = `il y a ${Math.floor(diffInMinutes / 60)}h`
//     else timeText = lastSeen.toLocaleDateString('fr-FR')

//     return {
//       text: `Actif: ${timeText}`,
//       color: 'bg-gray-400'
//     }
//   }

//   return {
//     text: 'Jamais connecté',
//     color: 'bg-gray-400'
//   }
// }

// export default function UsersList() {
//   const { user: currentUser, signOut } = useAuth()
//   const [users, setUsers] = useState<User[]>([])
//   const [loading, setLoading] = useState(true)
//   const [actionLoading, setActionLoading] = useState({
//     delete: null as string | null,
//     export: false,
//     import: false
//   })
//   const [message, setMessage] = useState<{text: string, type: 'success' | 'error' | 'info' | 'warning'} | null>(null)
//   const router = useRouter()
//   const [currentPage, setCurrentPage] = useState(1)
//   const usersPerPage = 5

//   // Nouveaux icônes pour les rôles
//   const roleIcons = {
//     admin: <FaUserShield className="text-purple-600" />,
//     enseignant: <FaChalkboardTeacher className="text-blue-600" />,
//     parent: <FaUserFriends className="text-green-600" />
//   }

//   const roleColors = {
//     admin: 'bg-purple-100 text-purple-800',
//     enseignant: 'bg-blue-100 text-blue-800',
//     parent: 'bg-green-100 text-green-800'
//   }

//   const loadUsers = async () => {
//     try {
//       const allUsers = await getAllUsers()
//       const usersWithStatus = allUsers.map(user => ({
//         ...user,
//         is_online: user.id === currentUser?.id ? currentUser.is_online : false,
//         last_sign_in_at: user.last_sign_in_at || undefined
//       }))
//       setUsers(usersWithStatus)
//     } catch (error) {
//       console.error('Error loading users:', error)
//       setMessage({ text: 'Erreur lors du chargement', type: 'error' })
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (currentUser?.role !== 'admin') return
//     loadUsers()

//     const interval = setInterval(() => {
//       if (currentUser?.role === 'admin') {
//         loadUsers()
//       }
//     }, 300000)

//     return () => clearInterval(interval)
//   }, [currentUser])

//   // Pagination logic
//   const indexOfLastUser = currentPage * usersPerPage
//   const indexOfFirstUser = indexOfLastUser - usersPerPage
//   const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)
//   const totalPages = Math.ceil(users.length / usersPerPage)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   const handleDelete = async (userId: string) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
    
//     setActionLoading(prev => ({ ...prev, delete: userId }))
//     try {
//       await deleteUser(userId)
//       setUsers(users.filter(u => u.id !== userId))
//       setMessage({ text: 'Utilisateur supprimé', type: 'success' })
//     } catch (error) {
//       console.error('Error deleting user:', error)
//       setMessage({ text: 'Erreur lors de la suppression', type: 'error' })
//     } finally {
//       setActionLoading(prev => ({ ...prev, delete: null }))
//       setTimeout(() => setMessage(null), 3000)
//     }
//   }

//   const handleExport = async () => {
//     setActionLoading(prev => ({ ...prev, export: true }))
//     setMessage(null)
//     try {
//       const count = await exportToSupabase()
      
//       if (count > 0) {
//         setMessage({
//           text: `Export réussi: ${count} utilisateur(s) synchronisé(s)`,
//           type: 'success'
//         })
//       } else {
//         setMessage({
//           text: 'Aucun nouvel utilisateur à exporter',
//           type: 'info'
//         })
//       }
//     } catch (error) {
//       console.error('Erreur export:', error)
      
//       let errorMessage = 'Erreur lors de l\'export'
//       if (error instanceof Error) {
//         errorMessage += `: ${error.message}`
        
//         if (error.message.includes('JWT expired')) {
//           errorMessage = 'Session expirée, veuillez vous reconnecter'
//         } else if (error.message.includes('network')) {
//           errorMessage = 'Problème de connexion réseau'
//         }
//       }
      
//       setMessage({
//         text: errorMessage,
//         type: 'error'
//       })
//     } finally {
//       setActionLoading(prev => ({ ...prev, export: false }))
//       setTimeout(() => loadUsers(), 2000)
//     }
//   }

//   const handleImport = async () => {
//     setActionLoading(prev => ({ ...prev, import: true }))
//     setMessage(null)
//     try {
//       const count = await importFromSupabase()
//       await loadUsers()
//       setMessage({ 
//         text: count > 0 
//           ? `${count} utilisateur(s) importé(s) depuis Supabase` 
//           : 'Aucun utilisateur trouvé dans Supabase', 
//         type: 'success' 
//       })
//     } catch (error) {
//       console.error('Import error:', error)
//       setMessage({ 
//         text: error instanceof Error ? error.message : 'Erreur lors de l\'import', 
//         type: 'error' 
//       })
//     } finally {
//       setActionLoading(prev => ({ ...prev, import: false }))
//       setTimeout(() => setMessage(null), 5000)
//     }
//   }

//   const handleDownloadJSON = () => {
//     const dataStr = JSON.stringify(users, null, 2)
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
//     const exportFileDefaultName = `utilisateurs_${new Date().toISOString().slice(0,10)}.json`
    
//     const linkElement = document.createElement('a')
//     linkElement.setAttribute('href', dataUri)
//     linkElement.setAttribute('download', exportFileDefaultName)
//     linkElement.click()
//   }

//   if (currentUser?.role !== 'admin') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
//           <h1 className="text-2xl font-bold text-gray-800">Accès refusé</h1>
//           <p className="mt-2 text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
//           <button
//             onClick={() => router.push('/dashboard')}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Retour au tableau de bord
//           </button>
//         </div>
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center space-x-4">
//             {currentUser && (
//               <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
//                 <FaUser className="text-gray-600" />
//                 <span className="text-sm font-medium">
//                   {currentUser.name} ({currentUser.role})
//                 </span>
//                 <span className={`inline-block w-2 h-2 rounded-full ${
//                   currentUser ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                 }`} />
//                 <span className="text-xs text-gray-500">
//                   {currentUser ? 'En ligne' : 'Hors ligne'}
//                 </span>
//               </div>
//             )}
//           </div>
//           <button
//             onClick={signOut}
//             className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
//             title="Déconnexion"
//           >
//             <FaSignOutAlt />
//             <span>Déconnexion</span>
//           </button>
//         </div>

//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
//             <p className="mt-2 text-sm text-gray-600">
//               {users.length} utilisateur(s) enregistré(s)
//             </p>
//           </div>
          
//           <div className="flex space-x-2">
//             <button
//               onClick={handleDownloadJSON}
//               className="px-4 py-2 bg-blue-200 text-blue-900 rounded-full hover:bg-blue-300 flex items-center"
//               title="Télécharger en JSON"
//             >
//               <FaDownload className="mr-2" />
//               JSON
//             </button>
            
//             <button
//               onClick={handleImport}
//               disabled={actionLoading.import}
//               className={`px-4 py-2 bg-yellow-200 text-yellow-900 rounded-full hover:bg-yellow-300 flex items-center ${
//                 actionLoading.import ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               title="Importer depuis Supabase"
//             >
//               <FaSync className="mr-2" />
//               Importer
//             </button>
            
//             <button
//               onClick={handleExport}
//               disabled={actionLoading.export}
//               className={`px-4 py-2 bg-green-200 text-green-900 rounded-full hover:bg-green-300 flex items-center ${
//                 actionLoading.export ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               title="Exporter vers Supabase"
//             >
//               <FaCloudUploadAlt className="mr-2" />
//               Exporter
//             </button>
            
//             <button
//               onClick={() => router.push('/auth/signup')}
//               className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center"
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Ajouter
//             </button>
//           </div>
//         </div>

//         {message && (
//           <div className={`mb-4 p-3 rounded-md ${
//             message.type === 'success' ? 'bg-green-100 text-green-800' :
//             message.type === 'error' ? 'bg-red-100 text-red-800' :
//             message.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
//             'bg-blue-100 text-blue-800'
//           }`}>
//             {message.text}
//           </div>
//         )}

//         <div className="bg-white shadow overflow-hidden rounded-lg">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {currentUsers.map((user) => {
//                 const isCurrentUser = user.id === currentUser?.id
//                 const status = formatStatus(user, isCurrentUser)
//                 return (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                           <span className="text-lg">{user.name.charAt(0)}</span>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                           <div className="text-xs text-gray-500">ID: {user.id.slice(0, 6)}...</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{user.email || '-'}</div>
//                       <div className="text-sm text-gray-500">{user.phone || '-'}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <span className="mr-2">{roleIcons[user.role]}</span>
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
//                           {user.role}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status.color}`} />
//                         <span className="text-sm text-gray-600">
//                           {status.text}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-3">
//                         <button
//                           onClick={() => router.push(`/admin/edit/${user.id}`)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="Modifier"
//                         >
//                           <FaEdit size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(user.id)}
//                           disabled={actionLoading.delete === user.id}
//                           className={`text-red-600 hover:text-red-900 ${
//                             actionLoading.delete === user.id ? 'opacity-50 cursor-not-allowed' : ''
//                           }`}
//                           title="Supprimer"
//                         >
//                           <FaTrash size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {users.length > usersPerPage && (
//           <div className="flex justify-center mt-6">
//             <nav className="inline-flex rounded-md shadow">
//               <button
//                 onClick={() => paginate(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Précédent
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                 <button
//                   key={number}
//                   onClick={() => paginate(number)}
//                   className={`px-3 py-1 border-t border-b border-gray-300 text-sm font-medium ${
//                     currentPage === number 
//                       ? 'bg-blue-50 text-blue-600 border-blue-500' 
//                       : 'bg-white text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   {number}
//                 </button>
//               ))}
//               <button
//                 onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Suivant
//               </button>
//             </nav>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllUsers, deleteUser, User, exportToSupabase, importFromSupabase } from '../../lib/db'
import { useRouter } from 'next/navigation'
import { FaUser, FaSignOutAlt, FaCloudUploadAlt, FaDownload, FaSync, FaEdit, FaTrash, FaUserShield, FaChalkboardTeacher, FaUserFriends, FaPlus, FaSearch } from 'react-icons/fa'

function formatStatus(user: User, isCurrentUser: boolean): { text: string, color: string } {
  if (isCurrentUser) {
    return {
      text: 'En ligne',
      color: 'bg-green-500 animate-pulse'
    }
  }

  if (user.last_sign_in_at) {
    const lastSeen = new Date(user.last_sign_in_at)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60))

    let timeText = ''
    if (diffInMinutes < 1) timeText = 'à l\'instant'
    else if (diffInMinutes < 60) timeText = `${diffInMinutes} min`
    else if (diffInMinutes < 24 * 60) timeText = `${Math.floor(diffInMinutes / 60)}h`
    else timeText = lastSeen.toLocaleDateString('fr-FR')

    return {
      text: `Actif ${timeText}`,
      color: 'bg-gray-400'
    }
  }

  return {
    text: 'Jamais connecté',
    color: 'bg-gray-400'
  }
}

export default function UsersList() {
  const { user: currentUser, signOut } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState({
    delete: null as string | null,
    export: false,
    import: false
  })
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error' | 'info' | 'warning'} | null>(null)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  const roleIcons = {
    admin: <FaUserShield className="text-purple-500" />,
    enseignant: <FaChalkboardTeacher className="text-blue-500" />,
    parent: <FaUserFriends className="text-green-500" />
  }

  const roleColors = {
    admin: 'bg-purple-50 text-purple-700',
    enseignant: 'bg-blue-50 text-blue-700',
    parent: 'bg-green-50 text-green-700'
  }

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers()
      const usersWithStatus = allUsers.map(user => ({
        ...user,
        is_online: user.id === currentUser?.id ? currentUser.is_online : false,
        last_sign_in_at: user.last_sign_in_at || undefined
      }))
      setUsers(usersWithStatus)
      setFilteredUsers(usersWithStatus)
    } catch (error) {
      console.error('Error loading users:', error)
      setMessage({ text: 'Erreur lors du chargement', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.role !== 'admin') return
    loadUsers()

    const interval = setInterval(() => {
      if (currentUser?.role === 'admin') {
        loadUsers()
      }
    }, 300000)

    return () => clearInterval(interval)
  }, [currentUser])

  useEffect(() => {
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(results)
    setCurrentPage(1)
  }, [searchTerm, users])

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleDelete = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return
    
    setActionLoading(prev => ({ ...prev, delete: userId }))
    try {
      await deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      setMessage({ text: 'Utilisateur supprimé', type: 'success' })
    } catch (error) {
      console.error('Error deleting user:', error)
      setMessage({ text: 'Erreur lors de la suppression', type: 'error' })
    } finally {
      setActionLoading(prev => ({ ...prev, delete: null }))
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleExport = async () => {
    setActionLoading(prev => ({ ...prev, export: true }))
    setMessage(null)
    try {
      const count = await exportToSupabase()
      
      if (count > 0) {
        setMessage({
          text: `Export réussi: ${count} utilisateur(s)`,
          type: 'success'
        })
      } else {
        setMessage({
          text: 'Aucun nouvel utilisateur à exporter',
          type: 'info'
        })
      }
    } catch (error) {
      console.error('Erreur export:', error)
      setMessage({
        text: error instanceof Error ? error.message : 'Erreur lors de l\'export',
        type: 'error'
      })
    } finally {
      setActionLoading(prev => ({ ...prev, export: false }))
      setTimeout(() => loadUsers(), 2000)
    }
  }

  const handleImport = async () => {
    setActionLoading(prev => ({ ...prev, import: true }))
    setMessage(null)
    try {
      const count = await importFromSupabase()
      await loadUsers()
      setMessage({ 
        text: count > 0 
          ? `${count} utilisateur(s) importé(s)` 
          : 'Aucun utilisateur trouvé', 
        type: 'success' 
      })
    } catch (error) {
      console.error('Import error:', error)
      setMessage({ 
        text: error instanceof Error ? error.message : 'Erreur lors de l\'import', 
        type: 'error' 
      })
    } finally {
      setActionLoading(prev => ({ ...prev, import: false }))
    }
  }

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(users, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `utilisateurs_${new Date().toISOString().slice(0,10)}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm max-w-md w-full">
          <h1 className="text-xl font-semibold text-gray-800">Accès refusé</h1>
          <p className="mt-2 text-gray-600">Vous n'avez pas les permissions nécessaires.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-scree">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Utilisateurs</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/auth/signup')}
                className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                title="Ajouter un utilisateur"
              >
                <FaPlus size={16} />
                <span className="sr-only md:not-sr-only md:ml-2">Ajouter</span>
              </button>
              
              <button
                onClick={signOut}
                className="flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Déconnexion"
              >
                <FaSignOutAlt size={16} />
                <span className="sr-only md:not-sr-only md:ml-2">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
            title="Télécharger en JSON"
          >
            <FaDownload className="mr-2" />
            <span>JSON</span>
          </button>
          
          <button
            onClick={handleImport}
            disabled={actionLoading.import}
            className={`flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors ${
              actionLoading.import ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Importer depuis Supabase"
          >
            <FaSync className={`mr-2 ${actionLoading.import ? 'animate-spin' : ''}`} />
            <span>Importer</span>
          </button>
          
          <button
            onClick={handleExport}
            disabled={actionLoading.export}
            className={`flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors ${
              actionLoading.export ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Exporter vers Supabase"
          >
            <FaCloudUploadAlt className={`mr-2 ${actionLoading.export ? 'animate-pulse' : ''}`} />
            <span>Exporter</span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' :
            message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' :
            message.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
            'bg-blue-50 text-blue-700 border border-blue-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* Users table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => {
                    const isCurrentUser = user.id === currentUser?.id
                    const status = formatStatus(user, isCurrentUser)
                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500 sm:hidden">{user.email || '-'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                          <div>{user.email || '-'}</div>
                          <div className="text-xs">{user.phone || '-'}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <span className="mr-1">{roleIcons[user.role]}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}>
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status.color}`} />
                            <span className="text-xs text-gray-600">
                              {status.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => router.push(`/admin/edit/${user.id}`)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Modifier"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={actionLoading.delete === user.id || isCurrentUser}
                              className={`text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 ${
                                actionLoading.delete === user.id || isCurrentUser ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title={isCurrentUser ? "Vous ne pouvez pas vous supprimer" : "Supprimer"}
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                      {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur enregistré'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="flex justify-between items-center mt-4 flex-col sm:flex-row gap-4">
            <div className="text-sm text-gray-500">
              Affichage de {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length} utilisateurs
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Précédent
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show first pages, current page with neighbors, and last pages
                if (totalPages <= 5 || currentPage <= 3) {
                  return i + 1
                } else if (currentPage >= totalPages - 2) {
                  return totalPages - 4 + i
                } else {
                  return currentPage - 2 + i
                }
              }).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 border text-sm ${
                    currentPage === number
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}