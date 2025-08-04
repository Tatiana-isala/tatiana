

// 'use client'
// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { getClassroomsForTeacher, getClassroomsBySection ,Classroom} from '@/lib/db';
// import LoadingSpinner from '@/components/LoadingSpinner';
// import Link from 'next/link';
// import { FiCalendar, FiClipboard, FiPieChart, FiUsers } from 'react-icons/fi';

// export default function AbsencesPage() {
//   const { user } = useAuth();
//   const [classrooms, setClassrooms] = useState<Classroom[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const loadClassrooms = async () => {
//       try {
//         let classes: Classroom[];
//         if (user?.role === 'enseignant') {
//           classes = await getClassroomsForTeacher(user.id);
//         } else {
//           const classesBySection = await getClassroomsBySection();
//           classes = Object.values(classesBySection).flat();
//         }
//         setClassrooms(classes);
//       } catch (error) {
//         console.error('Error loading classrooms:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadClassrooms();
//   }, [user]);

//   const filteredClassrooms = classrooms.filter(classroom =>
//     classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     classroom.section.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Gestion des absences</h1>
//           <p className="text-gray-600 mt-2">
//             {user?.role === 'enseignant' 
//               ? 'Vos classes assignées' 
//               : 'Toutes les classes de l\'établissement'}
//           </p>
//         </div>
        
//         <div className="relative w-full md:w-64">
//           <input
//             type="text"
//             placeholder="Rechercher une classe..."
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <FiUsers className="absolute left-3 top-3 text-gray-400" />
//         </div>
//       </div>

//       {filteredClassrooms.length === 0 ? (
//         <div className="bg-white rounded-xl shadow-sm p-8 text-center">
//           <FiClipboard className="mx-auto text-4xl text-gray-400 mb-4" />
//           <h3 className="text-xl font-medium text-gray-700 mb-2">
//             Aucune classe trouvée
//           </h3>
//           <p className="text-gray-500">
//             {searchTerm ? 'Essayez une autre recherche' : 'Aucune classe disponible'}
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredClassrooms.map(classroom => (
//             <div key={classroom.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
//               <div className={`p-4 ${getSectionColor(classroom.section)}`}>
//                 <h2 className="text-xl font-semibold text-white">{classroom.name}</h2>
//                 <p className="text-white opacity-90">{classroom.section}</p>
//               </div>
              
//               <div className="p-4">
//                 <div className="flex items-center text-gray-500 mb-3">
//                   <FiUsers className="mr-2" />
//                   <span>{classroom.studentIds?.length || 0} élèves</span>
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row gap-2 mt-4">
//                   <Link
//                     href={`/absences/record?classroomId=${classroom.id}`}
//                     className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     <FiCalendar />
//                     <span>Présences</span>
//                   </Link>
//                   <Link
//                     href={`/absences/history?classroomId=${classroom.id}`}
//                     className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <FiPieChart />
//                     <span>Statistiques</span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // Fonction utilitaire pour les couleurs par section
// function getSectionColor(section: string): string {
//   const colors: Record<string, string> = {
//     'Général': 'bg-blue-600',
//     'Commercial et Gestion': 'bg-green-600',
//     'Pédagogie Générale': 'bg-purple-600',
//     'Scientifique': 'bg-red-600',
//     'Littéraire': 'bg-yellow-600',
//     'Mécanique Générale': 'bg-indigo-600',
//     'Electricité': 'bg-pink-600',
//     'Mécanique Automobile': 'bg-orange-600',
//     'Coupe et Couture': 'bg-teal-600'
//   };
  
//   return colors[section] || 'bg-gray-600';
// }

// // 'use client'
// // import { useState, useEffect } from 'react'
// // import { useAuth } from '@/context/AuthContext'
// // import { getClassroomsForTeacher, getClassroomsBySection, Classroom } from '@/lib/db'
// // import LoadingSpinner from '@/components/LoadingSpinner'
// // import Link from 'next/link'
// // import { FiCalendar, FiClipboard, FiPieChart, FiUsers, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

// // export default function AbsencesPage() {
// //   const { user } = useAuth()
// //   const [classrooms, setClassrooms] = useState<Classroom[]>([])
// //   const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [selectedSection, setSelectedSection] = useState<string>('')
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const classroomsPerPage = 10

// //   const sections = [
// //     'Général',
// //     'Commercial et Gestion',
// //     'Pédagogie Générale', 
// //     'Scientifique',
// //     'Littéraire',
// //     'Mécanique Générale',
// //     'Electricité',
// //     'Mécanique Automobile',
// //     'Coupe et Couture'
// //   ]

// //   useEffect(() => {
// //     const loadClassrooms = async () => {
// //       try {
// //         let classes: Classroom[]
// //         if (user?.role === 'enseignant') {
// //           classes = await getClassroomsForTeacher(user.id)
// //         } else {
// //           const classesBySection = await getClassroomsBySection()
// //           classes = Object.values(classesBySection).flat()
// //         }
// //         setClassrooms(classes)
// //         setFilteredClassrooms(classes)
// //       } catch (error) {
// //         console.error('Error loading classrooms:', error)
// //       } finally {
// //         setIsLoading(false)
// //       }
// //     }

// //     loadClassrooms()
// //   }, [user])

// //   useEffect(() => {
// //     let results = classrooms.filter(classroom => {
// //       const matchesSearch = classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                           classroom.section.toLowerCase().includes(searchTerm.toLowerCase())
// //       const matchesSection = selectedSection ? classroom.section === selectedSection : true
// //       return matchesSearch && matchesSection
// //     })
// //     setFilteredClassrooms(results)
// //     setCurrentPage(1)
// //   }, [searchTerm, selectedSection, classrooms])

// //   // Pagination
// //   const indexOfLastClassroom = currentPage * classroomsPerPage
// //   const indexOfFirstClassroom = indexOfLastClassroom - classroomsPerPage
// //   const currentClassrooms = filteredClassrooms.slice(indexOfFirstClassroom, indexOfLastClassroom)
// //   const totalPages = Math.ceil(filteredClassrooms.length / classroomsPerPage)

// //   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

// //   if (isLoading) {
// //     return <LoadingSpinner />
// //   }

// //   return (
// //     <div className="max-w-6xl mx-auto px-4 py-6">
// //       {/* Header */}
// //       <div className="mb-6">
// //         <h1 className="text-xl font-medium text-gray-800 mb-1">Gestion des absences</h1>
// //         <p className="text-sm text-gray-500">
// //           {user?.role === 'enseignant' ? 'Vos classes' : 'Toutes les classes'}
// //         </p>
// //       </div>

// //       {/* Controls */}
// //       <div className="flex flex-col sm:flex-row gap-3 mb-4">
// //         <div className="relative flex-grow">
// //           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //             <FiUsers className="text-gray-400" size={16}/>
// //           </div>
// //           <input
// //             type="text"
// //             placeholder="Rechercher une classe..."
// //             className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-200"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //           />
// //         </div>

// //         <select
// //           value={selectedSection}
// //           onChange={(e) => setSelectedSection(e.target.value)}
// //           className="text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-200"
// //         >
// //           <option value="">Toutes sections</option>
// //           {sections.map(section => (
// //             <option key={section} value={section}>{section}</option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* Results count */}
// //       {(searchTerm || selectedSection) && (
// //         <div className="text-xs text-gray-500 mb-4">
// //           {filteredClassrooms.length} résultat{filteredClassrooms.length !== 1 ? 's' : ''} trouvé{filteredClassrooms.length !== 1 ? 's' : ''}
// //         </div>
// //       )}

// //       {/* Table */}
// //       <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
// //         {currentClassrooms.length === 0 ? (
// //           <div className="p-8 text-center text-gray-500">
// //             <FiClipboard className="mx-auto mb-2 text-gray-300" size={24}/>
// //             <p>Aucune classe correspondante</p>
// //           </div>
// //         ) : (
// //           <>
// //             <table className="min-w-full divide-y divide-gray-100">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Classe
// //                   </th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Section
// //                   </th>
// //                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Élèves
// //                   </th>
// //                   <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-100">
// //                 {currentClassrooms.map((classroom) => (
// //                   <tr key={classroom.id} className="hover:bg-gray-50">
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
// //                       {classroom.name}
// //                     </td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
// //                       {classroom.section}
// //                     </td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
// //                       {classroom.studentIds?.length || 0}
// //                     </td>
// //                     <td className="px-4 py-3 whitespace-nowrap text-right text-sm space-x-1">
// //                       <Link
// //                         href={`/absences/record?classroomId=${classroom.id}`}
// //                         className="inline-flex items-center px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-100"
// //                       >
// //                         <FiCalendar className="mr-1" size={12}/>
// //                         Présences
// //                       </Link>
// //                       <Link
// //                         href={`/absences/history?classroomId=${classroom.id}`}
// //                         className="inline-flex items-center px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-100"
// //                       >
// //                         <FiPieChart className="mr-1" size={12}/>
// //                         Stats
// //                       </Link>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>

// //             {/* Pagination */}
// //             {totalPages > 1 && (
// //               <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
// //                 <div className="text-xs text-gray-500">
// //                   Page {currentPage} sur {totalPages}
// //                 </div>
// //                 <div className="flex space-x-1">
// //                   <button
// //                     onClick={() => paginate(Math.max(1, currentPage - 1))}
// //                     disabled={currentPage === 1}
// //                     className={`p-1 rounded ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
// //                   >
// //                     <FiChevronLeft size={16}/>
// //                   </button>
// //                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// //                     let pageNum
// //                     if (totalPages <= 5) {
// //                       pageNum = i + 1
// //                     } else if (currentPage <= 3) {
// //                       pageNum = i + 1
// //                     } else if (currentPage >= totalPages - 2) {
// //                       pageNum = totalPages - 4 + i
// //                     } else {
// //                       pageNum = currentPage - 2 + i
// //                     }
// //                     return pageNum
// //                   }).map(number => (
// //                     <button
// //                       key={number}
// //                       onClick={() => paginate(number)}
// //                       className={`w-8 h-8 rounded text-xs ${currentPage === number ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
// //                     >
// //                       {number}
// //                     </button>
// //                   ))}
// //                   <button
// //                     onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
// //                     disabled={currentPage === totalPages}
// //                     className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
// //                   >
// //                     <FiChevronRight size={16}/>
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }
'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getClassroomsForTeacher, getClassroomsBySection, Classroom } from '@/lib/db';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { FiCalendar, FiClipboard, FiPieChart, FiUsers } from 'react-icons/fi';

export default function AbsencesPage() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        setIsLoading(true);
        let classes: Classroom[];
        if (user?.role === 'enseignant') {
          classes = await getClassroomsForTeacher(user.id);
        } else {
          const classesBySection = await getClassroomsBySection();
          classes = Object.values(classesBySection).flat();
        }
        setClassrooms(classes);
      } catch (error) {
        console.error('Error loading classrooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadClassrooms();
    }
  }, [user]);

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des absences</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'enseignant' 
              ? 'Vos classes assignées' 
              : 'Toutes les classes de l\'établissement'}
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Rechercher une classe..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiUsers className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {filteredClassrooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FiClipboard className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Aucune classe trouvée
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Essayez une autre recherche' : 'Aucune classe disponible'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map(classroom => (
            <div key={classroom.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className={`p-4 ${getSectionColor(classroom.section)}`}>
                <h2 className="text-xl font-semibold text-white">{classroom.name}</h2>
                <p className="text-white opacity-90">{classroom.section}</p>
              </div>
              
              <div className="p-4">
                <div className="flex items-center text-gray-500 mb-3">
                  <FiUsers className="mr-2" />
                  <span>{classroom.studentIds?.length || 0} élèves</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Link
                    href={`/absences/record?classroomId=${classroom.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiCalendar />
                    <span>Présences</span>
                  </Link>
                  <Link
                    href={`/absences/history?classroomId=${classroom.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiPieChart />
                    <span>Statistiques</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getSectionColor(section: string): string {
  const colors: Record<string, string> = {
    'Général': 'bg-blue-600',
    'Commercial et Gestion': 'bg-green-600',
    'Pédagogie Générale': 'bg-purple-600',
    'Scientifique': 'bg-red-600',
    'Littéraire': 'bg-yellow-600',
    'Mécanique Générale': 'bg-indigo-600',
    'Electricité': 'bg-pink-600',
    'Mécanique Automobile': 'bg-orange-600',
    'Coupe et Couture': 'bg-teal-600'
  };
  
  return colors[section] || 'bg-gray-600';
}
