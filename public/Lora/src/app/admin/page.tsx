

// 'use client'
// import { useEffect, useState } from 'react'
// import { useAuth } from '../../context/AuthContext'
// import { getAllUsers, deleteUser, User, exportToSupabase, importFromSupabase } from '../../lib/db'
// import { useRouter } from 'next/navigation'
// import { FaUser, FaSignOutAlt, FaCloudUploadAlt, FaDownload, FaSync, FaEdit, FaTrash } from 'react-icons/fa'

// function formatStatus(user: User, isCurrentUser: boolean): { text: string, color: string } {
//   // Seul l'utilisateur actuel peut afficher "En ligne maintenant"
//   if (isCurrentUser ) {
//     return {
//       text: 'En ligne maintenant',
//       color: 'bg-green-500 animate-pulse'
//     }
//   }

//   // Pour tous les utilisateurs (basé sur last_sign_in_at)
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
//       text: `Dernière activité: ${timeText}`,
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

//   const roleIcons = {
//     admin: '👑',
//     enseignant: '📚',
//     parent: '👪'
//   }

//   const roleColors = {
//     admin: 'bg-purple-100 text-purple-800',
//     enseignant: 'bg-blue-100 text-blue-800',
//     parent: 'bg-green-100 text-green-800'
//   }

//   const loadUsers = async () => {
//     try {
//       const allUsers = await getAllUsers()
      
//       // Marquer uniquement l'utilisateur actuel comme en ligne si c'est le cas
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

//     // Rafraîchir périodiquement
//     const interval = setInterval(() => {
//       if (currentUser?.role === 'admin') {
//         loadUsers()
//       }
//     }, 300000) // 5 minutes

//     return () => clearInterval(interval)
//   }, [currentUser])

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
//               className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center"
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
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user) => {
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
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {user.email || 'Non renseigné'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {user.phone || 'Non renseigné'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
//                         {roleIcons[user.role]} {user.role}
//                       </span>
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
//                       <button
//                         onClick={() => router.push(`/admin/edit/${user.id}`)}
//                         className="text-blue-600 hover:text-blue-900 mr-3 flex items-center"
//                       >
//                         <FaEdit className="mr-1" /> Modifier
//                       </button>
//                       <button
//                         onClick={() => handleDelete(user.id)}
//                         disabled={actionLoading.delete === user.id}
//                         className={`text-red-600 hover:text-red-900 flex items-center ${
//                           actionLoading.delete === user.id ? 'opacity-50 cursor-not-allowed' : ''
//                         }`}
//                       >
//                         <FaTrash className="mr-1" /> 
//                         {actionLoading.delete === user.id ? 'Suppression...' : 'Supprimer'}
//                       </button>
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAllUsers, deleteUser, User, exportToSupabase, importFromSupabase } from '../../lib/db'
import { useRouter } from 'next/navigation'
import { FaUser, FaSignOutAlt, FaCloudUploadAlt, FaDownload, FaSync, FaEdit, FaTrash, FaUserShield, FaChalkboardTeacher, FaUserFriends } from 'react-icons/fa'

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
    else if (diffInMinutes < 60) timeText = `il y a ${diffInMinutes} min`
    else if (diffInMinutes < 24 * 60) timeText = `il y a ${Math.floor(diffInMinutes / 60)}h`
    else timeText = lastSeen.toLocaleDateString('fr-FR')

    return {
      text: `Actif: ${timeText}`,
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
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({
    delete: null as string | null,
    export: false,
    import: false
  })
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error' | 'info' | 'warning'} | null>(null)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5

  // Nouveaux icônes pour les rôles
  const roleIcons = {
    admin: <FaUserShield className="text-purple-600" />,
    enseignant: <FaChalkboardTeacher className="text-blue-600" />,
    parent: <FaUserFriends className="text-green-600" />
  }

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    enseignant: 'bg-blue-100 text-blue-800',
    parent: 'bg-green-100 text-green-800'
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

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(users.length / usersPerPage)

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
          text: `Export réussi: ${count} utilisateur(s) synchronisé(s)`,
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
      
      let errorMessage = 'Erreur lors de l\'export'
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`
        
        if (error.message.includes('JWT expired')) {
          errorMessage = 'Session expirée, veuillez vous reconnecter'
        } else if (error.message.includes('network')) {
          errorMessage = 'Problème de connexion réseau'
        }
      }
      
      setMessage({
        text: errorMessage,
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
          ? `${count} utilisateur(s) importé(s) depuis Supabase` 
          : 'Aucun utilisateur trouvé dans Supabase', 
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
      setTimeout(() => setMessage(null), 5000)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-gray-800">Accès refusé</h1>
          <p className="mt-2 text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <FaUser className="text-gray-600" />
                <span className="text-sm font-medium">
                  {currentUser.name} ({currentUser.role})
                </span>
                <span className={`inline-block w-2 h-2 rounded-full ${
                  currentUser ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span className="text-xs text-gray-500">
                  {currentUser ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={signOut}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800"
            title="Déconnexion"
          >
            <FaSignOutAlt />
            <span>Déconnexion</span>
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <p className="mt-2 text-sm text-gray-600">
              {users.length} utilisateur(s) enregistré(s)
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 bg-blue-200 text-blue-900 rounded-full hover:bg-blue-300 flex items-center"
              title="Télécharger en JSON"
            >
              <FaDownload className="mr-2" />
              JSON
            </button>
            
            <button
              onClick={handleImport}
              disabled={actionLoading.import}
              className={`px-4 py-2 bg-yellow-200 text-yellow-900 rounded-full hover:bg-yellow-300 flex items-center ${
                actionLoading.import ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Importer depuis Supabase"
            >
              <FaSync className="mr-2" />
              Importer
            </button>
            
            <button
              onClick={handleExport}
              disabled={actionLoading.export}
              className={`px-4 py-2 bg-green-200 text-green-900 rounded-full hover:bg-green-300 flex items-center ${
                actionLoading.export ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Exporter vers Supabase"
            >
              <FaCloudUploadAlt className="mr-2" />
              Exporter
            </button>
            
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ajouter
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' :
            message.type === 'error' ? 'bg-red-100 text-red-800' :
            message.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => {
                const isCurrentUser = user.id === currentUser?.id
                const status = formatStatus(user, isCurrentUser)
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg">{user.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">ID: {user.id.slice(0, 6)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email || '-'}</div>
                      <div className="text-sm text-gray-500">{user.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{roleIcons[user.role]}</span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status.color}`} />
                        <span className="text-sm text-gray-600">
                          {status.text}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => router.push(`/admin/edit/${user.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoading.delete === user.id}
                          className={`text-red-600 hover:text-red-900 ${
                            actionLoading.delete === user.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Supprimer"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.length > usersPerPage && (
          <div className="flex justify-center mt-6">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 border-t border-b border-gray-300 text-sm font-medium ${
                    currentPage === number 
                      ? 'bg-blue-50 text-blue-600 border-blue-500' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}