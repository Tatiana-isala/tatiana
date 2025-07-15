// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { User, getEnseignantsWithDetails } from '@/lib/db'
// import { 
//   FaUserTie, 
//   FaChalkboardTeacher, 
//   FaSearch, 
//   FaPhone, 
//   FaEnvelope, 
//   FaChevronDown, 
//   FaChevronUp,
//   FaBook,
//   FaGraduationCap,
//   FaUsers
// } from 'react-icons/fa'
// import { FiClock } from 'react-icons/fi'

// interface TeacherInfo {
//   userId: string;
//   matierePrincipale: string;
//   classesResponsables: string[];
//   anneesExperience: number;
//   statut: 'titulaire' | 'remplacant' | 'stagiaire';
//   createdAt: string;
//   updatedAt: string;
// }

// export default function teacherListPage() {
//   const router = useRouter()
//   const [teacher, setteacher] = useState<(User & { teacherInfo?: TeacherInfo })[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [expandedId, setExpandedId] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchteacher = async () => {
//       try {
//         setLoading(true)
//         const data = await  getEnseignantsWithDetails()
//         setteacher(data)
//       } catch (error) {
//         console.error('Erreur lors du chargement des teacher:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchteacher()
//   }, [])

//   const filteredteacher = teacher.filter(ens => 
//     ens.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     ens.phone.includes(searchTerm) ||
//     ens.teacherInfo?.matierePrincipale.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     ens.teacherInfo?.statut.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const toggleExpand = (id: string) => {
//     setExpandedId(expandedId === id ? null : id)
//   }

//   const getStatusColor = (statut?: string) => {
//     switch(statut) {
//       case 'titulaire': return 'bg-green-100 text-green-800'
//       case 'remplacant': return 'bg-blue-100 text-blue-800'
//       case 'stagiaire': return 'bg-yellow-100 text-yellow-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Liste des teacher</h1>
//         <p className="text-gray-600">Gestion des teacher de l'établissement</p>
//       </div>

//       <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
//         <div className="relative w-full md:w-96">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FaSearch className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Rechercher un enseignant..."
//             className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
        
//         <button 
//           onClick={() => router.push('/teacher/ajouter')}
//           className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//         >
//           Ajouter un enseignant
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         {filteredteacher.length > 0 ? (
//           <ul className="divide-y divide-gray-200">
//             {filteredteacher.map((enseignant) => (
//               <li key={enseignant.id} className="hover:bg-gray-50 transition-colors">
//                 <div 
//                   className="px-6 py-4 flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleExpand(enseignant.id)}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
//                       <FaUserTie className="text-blue-600 text-xl" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900">
//                         {enseignant.name}
//                       </h3>
//                       <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1 gap-x-3 gap-y-1">
//                         <span className="flex items-center">
//                           <FaPhone className="mr-1 text-gray-400" />
//                           {enseignant.phone}
//                         </span>
//                         {enseignant.email && (
//                           <span className="flex items-center">
//                             <FaEnvelope className="mr-1 text-gray-400" />
//                             {enseignant.email}
//                           </span>
                          
//                         )}
//                       </div>
//                       <button 
//                         onClick={() => router.push(`/teacher/${enseignant.id}/editer`)}
//                         className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
//                       >
//                         Modifier
//                       </button>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     {enseignant.teacherInfo && (
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enseignant.teacherInfo.statut)} mr-3`}>
//                         {enseignant.teacherInfo.statut}
//                       </span>
//                     )}
//                     {expandedId === enseignant.id ? (
//                       <FaChevronUp className="text-gray-400" />
//                     ) : (
//                       <FaChevronDown className="text-gray-400" />
//                     )}
//                   </div>
//                 </div>

//                 {expandedId === enseignant.id && enseignant.teacherInfo && (
//                   <div className="px-6 pb-4 bg-gray-50">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                         <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
//                           <FaBook className="mr-2 text-blue-500" />
//                           Informations pédagogiques
//                         </h4>
//                         <div className="space-y-2 text-sm text-gray-600">
//                           <div className="flex">
//                             <span className="w-32 font-medium">Matière principale:</span>
//                             <span>{enseignant.teacherInfo.matierePrincipale}</span>
//                           </div>
//                           <div className="flex">
//                             <span className="w-32 font-medium">Années d'expérience:</span>
//                             <span>{enseignant.teacherInfo.anneesExperience}</span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                         <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
//                           <FaUsers className="mr-2 text-blue-500" />
//                           Classes responsables
//                         </h4>
//                         {enseignant.teacherInfo.classesResponsables.length > 0 ? (
//                           <div className="flex flex-wrap gap-2">
//                             {enseignant.teacherInfo.classesResponsables.map((classe, index) => (
//                               <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
//                                 {classe}
//                               </span>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-500">Aucune classe assignée</p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="mt-4 flex justify-end space-x-3">
//                       <button 
//                         onClick={() => router.push(`/teacher/${enseignant.id}/editer`)}
//                         className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
//                       >
//                         Modifier
//                       </button>
//                       <button 
//                         onClick={() => router.push(`/teacher/${enseignant.id}/emploi-du-temps`)}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
//                       >
//                         <FiClock className="mr-2" />
//                         Emploi du temps
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="px-6 py-12 text-center">
//             <div className="text-gray-400 mb-4">
//               <FaChalkboardTeacher className="inline-block text-4xl" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun enseignant trouvé</h3>
//             <p className="text-gray-500">
//               {searchTerm ? "Aucun résultat pour votre recherche" : "Aucun enseignant enregistré"}
//             </p>
//             {!searchTerm && (
//               <button 
//                 onClick={() => router.push('/teacher/ajouter')}
//                 className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//               >
//                 Ajouter un enseignant
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, getEnseignantsWithDetails } from '@/lib/db'
import { 
  FaUserTie, 
  FaChalkboardTeacher, 
  FaSearch, 
  FaPhone, 
  FaEnvelope,
  FaBook,
  FaUsers
} from 'react-icons/fa'

interface TeacherInfo {
  userId: string;
  matierePrincipale: string;
  classesResponsables: string[];
  anneesExperience: number;
  statut: 'titulaire' | 'remplacant' | 'stagiaire';
  createdAt: string;
  updatedAt: string;
}

export default function TeacherListPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState<(User & { teacherInfo?: TeacherInfo })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // useEffect(() => {
  //   const fetchTeachers = async () => {
  //     try {
  //       setLoading(true)
  //       const data = await getEnseignantsWithDetails()
  //       setTeachers(data)
  //     } catch (error) {
  //       console.error('Erreur lors du chargement des enseignants:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchTeachers()
  // }, [])
useEffect(() => {
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await getEnseignantsWithDetails();
      setTeachers(data as (User & { teacherInfo?: TeacherInfo })[]);
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchTeachers();
}, []);
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.phone.includes(searchTerm) ||
    teacher.teacherInfo?.matierePrincipale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacherInfo?.statut.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (statut?: string) => {
    switch(statut) {
      case 'titulaire': return 'bg-green-100 text-green-800'
      case 'remplacant': return 'bg-blue-100 text-blue-800'
      case 'stagiaire': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Liste des enseignants</h1>
        <p className="text-gray-600">Gestion des enseignants de l'établissement</p>
      </div>

      <div className="mb-6">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un enseignant..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredTeachers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredTeachers.map((teacher) => (
              <li 
                key={teacher.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => router.push(`/teacher/${teacher.id}`)}
              >
                <div className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUserTie className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {teacher.name}
                      </h3>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1 gap-x-3 gap-y-1">
                        <span className="flex items-center">
                          <FaPhone className="mr-1 text-gray-400" />
                          {teacher.phone}
                        </span>
                        {teacher.email && (
                          <span className="flex items-center">
                            <FaEnvelope className="mr-1 text-gray-400" />
                            {teacher.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {teacher.teacherInfo && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(teacher.teacherInfo.statut)}`}>
                        {teacher.teacherInfo.statut}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-4">
              <FaChalkboardTeacher className="inline-block text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun enseignant trouvé</h3>
            <p className="text-gray-500">
              {searchTerm ? "Aucun résultat pour votre recherche" : "Aucun enseignant enregistré"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}