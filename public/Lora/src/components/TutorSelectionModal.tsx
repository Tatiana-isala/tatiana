// 'use client'
// import { useState, useEffect, useCallback } from 'react'
// import { User } from '@/lib/db'
// import { getParents, assignTutor } from '@/lib/db'
// import { FaSearch, FaTimes, FaUser, FaSpinner } from 'react-icons/fa'

// interface TutorSelectionModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onSelect?: (tutorId: string) => Promise<void>
//   currentStudentId: string
// }

// export default function TutorSelectionModal({
//   isOpen,
//   onClose,
//   onSelect,
//   currentStudentId
// }: TutorSelectionModalProps) {
//   const [parents, setParents] = useState<User[]>([])
//   const [filteredParents, setFilteredParents] = useState<User[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const fetchParents = useCallback(async () => {
//     try {
//       setLoading(true)
//       setError(null)
//       const parentsData = await getParents()
      
//       if (!parentsData || parentsData.length === 0) {
//         setError("Aucun parent disponible")
//         setParents([])
//         setFilteredParents([])
//         return
//       }
      
//       setParents(parentsData)
//       setFilteredParents(parentsData)
//     } catch (err) {
//       console.error('Erreur lors du chargement des parents:', err)
//       setError("Erreur de chargement des données")
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     if (isOpen) {
//       fetchParents()
//     } else {
//       // Reset state when modal closes
//       setParents([])
//       setFilteredParents([])
//       setSearchTerm('')
//       setError(null)
//     }
//   }, [isOpen, fetchParents])

//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredParents(parents)
//       return
//     }

//     const term = searchTerm.toLowerCase()
//     const filtered = parents.filter(parent =>
//       parent.name?.toLowerCase().includes(term) ||
//       parent.phone?.includes(term) ||
//       parent.email?.toLowerCase().includes(term)
//     )
//     setFilteredParents(filtered)
//   }, [searchTerm, parents])

//   const handleSelect = async (tutorId: string) => {
//     try {
//       setLoading(true)
//       await assignTutor(currentStudentId, tutorId)
//       if (onSelect) {
//         await onSelect(tutorId)
//       }
//       onClose()
//     } catch (err) {
//       console.error('Erreur lors de l\'attribution du tuteur:', err)
//       setError("Échec de l'attribution du tuteur")
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
//         <div className="flex justify-between items-center border-b p-4">
//           <h2 className="text-xl font-semibold">Sélectionner un tuteur</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 transition-colors"
//             disabled={loading}
//           >
//             <FaTimes size={20} />
//           </button>
//         </div>
        
//         <div className="p-4 border-b">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Rechercher un tuteur..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//               disabled={loading}
//             />
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           </div>
//         </div>
        
//         <div className="overflow-y-auto flex-1">
//           {loading && !parents.length ? (
//             <div className="p-4 text-center">
//               <FaSpinner className="animate-spin mx-auto text-blue-500" size={24} />
//               <p className="mt-2 text-gray-600">Chargement des tuteurs...</p>
//             </div>
//           ) : error ? (
//             <div className="p-4 text-center text-red-500">
//               <p>{error}</p>
//               <button
//                 onClick={fetchParents}
//                 className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Réessayer
//               </button>
//             </div>
//           ) : filteredParents.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">
//               {searchTerm ? 'Aucun résultat trouvé' : 'Aucun tuteur disponible'}
//             </div>
//           ) : (
//             <ul className="divide-y">
//               {filteredParents.map((parent) => (
//                 <li key={parent.id}>
//                   <button
//                     onClick={() => handleSelect(parent.id)}
//                     className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center transition-colors"
//                     disabled={loading}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
//                         <FaUser size={16} />
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {parent.name || 'Nom non renseigné'}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {parent.phone || 'Téléphone non renseigné'}
//                         </p>
//                         {parent.email && (
//                           <p className="text-xs text-gray-400 mt-1">{parent.email}</p>
//                         )}
//                       </div>
//                     </div>
//                     <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                       Parent
//                     </span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
        
//         <div className="border-t p-4 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//             disabled={loading}
//           >
//             Fermer
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'
import { useState, useEffect, useCallback } from 'react'
import { User } from '@/lib/db'
import { getParents, assignTutor } from '@/lib/db'
import { FaSearch, FaTimes, FaUser, FaSpinner } from 'react-icons/fa'

interface TutorSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (tutorId: string) => Promise<void>
  currentStudentId: string
}

export default function TutorSelectionModal({
  isOpen,
  onClose,
  onSelect,
  currentStudentId
}: TutorSelectionModalProps) {
  const [parents, setParents] = useState<User[]>([])
  const [filteredParents, setFilteredParents] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fetchParents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const parentsData = await getParents()
      
      if (!parentsData) {
        setError("Erreur lors de la récupération des parents")
        return
      }
      
      if (parentsData.length === 0) {
        setError("Aucun parent disponible")
      }
      
      setParents(parentsData)
      setFilteredParents(parentsData)
    } catch (err) {
      console.error('Erreur lors du chargement des parents:', err)
      setError("Erreur de chargement des données")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchParents()
    } else {
      // Reset state when modal closes
      setParents([])
      setFilteredParents([])
      setSearchTerm('')
      setError(null)
      setSuccessMessage(null)
    }
  }, [isOpen, fetchParents])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredParents(parents)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = parents.filter(parent => {
      const nameMatch = parent.name?.toLowerCase().includes(term) ?? false
      const phoneMatch = parent.phone?.includes(term) ?? false
      const emailMatch = parent.email?.toLowerCase().includes(term) ?? false
      return nameMatch || phoneMatch || emailMatch
    })
    setFilteredParents(filtered)
  }, [searchTerm, parents])

  const handleSelect = async (tutorId: string) => {
    try {
      setLoading(true)
      setError(null)
      await assignTutor(currentStudentId, tutorId)
      
      if (onSelect) {
        await onSelect(tutorId)
      }
      
      setSuccessMessage("Tuteur assigné avec succès")
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Erreur lors de l\'attribution du tuteur:', err)
      setError("Échec de l'attribution du tuteur")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Sélectionner un tuteur</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
            aria-label="Fermer la modal"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un tuteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={loading}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {loading && parents.length === 0 ? (
            <div className="p-4 text-center">
              <FaSpinner className="animate-spin mx-auto text-blue-500" size={24} />
              <p className="mt-2 text-gray-600">Chargement des tuteurs...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchParents}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : 'Réessayer'}
              </button>
            </div>
          ) : successMessage ? (
            <div className="p-4 text-center text-green-500">
              {successMessage}
            </div>
          ) : filteredParents.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucun tuteur disponible'}
            </div>
          ) : (
            <ul className="divide-y">
              {filteredParents.map((parent) => (
                <li key={parent.id}>
                  <button
                    onClick={() => handleSelect(parent.id)}
                    className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                        <FaUser size={16} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          {parent.name || 'Nom non renseigné'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {parent.phone || 'Téléphone non renseigné'}
                        </p>
                        {parent.email && (
                          <p className="text-xs text-gray-400 mt-1">{parent.email}</p>
                        )}
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Parent
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}