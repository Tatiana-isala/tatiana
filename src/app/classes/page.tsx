// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   getAllClassrooms, 
//   createClassroom, 
//   assignTeacherToClassroom,
//   getEnseignantsWithDetails,
//   Classroom,
//   ClassroomFormData
// } from '@/lib/db';

// export default function ClassManagementPage() {
//   const [classrooms, setClassrooms] = useState<Classroom[]>([]);
//   const [teachers, setTeachers] = useState<any[]>([]);
//   const [newClassroom, setNewClassroom] = useState<ClassroomFormData>({
//     name: '',
//     level: 6,
//     section: 'A',
//     capacity: 30,
//     teacherId: null
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const [classroomsData, teachersData] = await Promise.all([
//         getAllClassrooms(),
//         getEnseignantsWithDetails()
//       ]);
//       setClassrooms(classroomsData);
//       setTeachers(teachersData);
//     } catch (error) {
//       console.error('Erreur lors du chargement des données:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateClassroom = async () => {
//     if (!newClassroom.name) {
//       alert('Veuillez entrer un nom pour la classe');
//       return;
//     }

//     try {
//       await createClassroom(newClassroom);
//       setNewClassroom({
//         name: '',
//         level: 6,
//         section: 'A',
//         capacity: 30,
//         teacherId: null
//       });
//       await loadData();
//     } catch (error) {
//       console.error('Erreur lors de la création de la classe:', error);
//     }
//   };

//   const handleAssignTeacher = async (classroomId: string, teacherId: string | null) => {
//     try {
//       await assignTeacherToClassroom(classroomId, teacherId);
//       await loadData();
//     } catch (error) {
//       console.error('Erreur lors de l\'assignation du professeur:', error);
//     }
//   };

//   if (isLoading) {
//     return <div className="p-4">Chargement...</div>;
//   }

//   return (
//     <div className="p-4">
      
      

//       <div className="bg-white  rounded-lg shadow-">
//         <h2 className="text-xl font-semibold mb-4">Liste des Classes</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-2 px-4 border-b ">Nom</th>
//                 <th className="py-2 px-4 border-b ">Section</th>
//                 <th className="py-2 px-4 border-b ">Capacité</th>
//                 <th className="py-2 px-4 border-b ">Titulaire</th>
//                 <th className="py-2 px-4 border-b ">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {classrooms.map((classroom) => (
//                 <tr key={classroom.id} className="hover:bg-gray-50">
//                   <td className="py-2 px-4 border-b  text-center">{classroom.name}</td>
//                   {/* <td className="py-2 px-4 border-b  text-center">{classroom.level}ème</td> */}
//                   <td className="py-2 px-4 border-b  text-center">{classroom.section}</td>
//                   <td className="py-2 px-4 border-b  text-center">{classroom.capacity}</td>
//                   <td className="py-2 px-4 border-b ">
//                     <select
//                       className="w-full p-1 border rounded"
//                       value={classroom.teacherId || ''}
//                       onChange={(e) => handleAssignTeacher(classroom.id, e.target.value || null)}
//                     >
//                       <option value="">-- Aucun titulaire --</option>
//                       {teachers.map((teacher) => (
//                         <option key={teacher.id} value={teacher.id}>
//                           {teacher.name} ({teacher.teacherInfo?.matierePrincipale})
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="py-2 px-4 border-b  text-center">
//                     <button
//                       onClick={() => router.push(`/classes/${classroom.id}`)}
//                       className="text-blue-500 hover:text-blue-700 mr-2"
//                     >
//                       Détails
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getAllClassrooms, 
  createClassroom, 
  assignTeacherToClassroom,
  getEnseignantsWithDetails,
  Classroom,
  ClassroomFormData
} from '@/lib/db'
import { FiPlus, FiUsers, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi'

export default function ClassManagementPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7
  const router = useRouter()

  // Sections disponibles
  const sections = [
    'Général',
    'Commercial et Gestion',
    'Pédagogie Générale',
    'Scientifique',
    'Littéraire',
    'Mécanique Générale',
    'Electricité',
    'Mécanique Automobile',
    'Coupe et Couture'
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [classroomsData, teachersData] = await Promise.all([
        getAllClassrooms(),
        getEnseignantsWithDetails()
      ])
      setClassrooms(classroomsData)
      setTeachers(teachersData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrer les classes selon le terme de recherche
  const filteredClassrooms = classrooms.filter(classroom => 
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.section.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredClassrooms.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredClassrooms.length / itemsPerPage)

  const handleAssignTeacher = async (classroomId: string, teacherId: string | null) => {
    try {
      await assignTeacherToClassroom(classroomId, teacherId)
      await loadData()
    } catch (error) {
      console.error('Erreur lors de l\'assignation du professeur:', error)
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Classes</h1>
          <p className="text-gray-600">{filteredClassrooms.length} classes trouvées</p>
        </div>
        
        <div className="mt-4 md:mt-0 relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une classe..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titulaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((classroom) => (
                  <tr key={classroom.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {classroom.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classroom.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classroom.level}ème
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classroom.studentIds?.length || 0}/{classroom.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={classroom.teacherId || ''}
                        onChange={(e) => handleAssignTeacher(classroom.id, e.target.value || null)}
                      >
                        <option value="">-- Sélectionner --</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name} {teacher.teacherInfo?.matierePrincipale && `(${teacher.teacherInfo.matierePrincipale})`}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => router.push(`/classes/${classroom.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiUsers className="inline mr-1" />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucune classe trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Précédent
              </button>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Précédent</span>
                    <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return pageNum
                  }).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Suivant</span>
                    <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}