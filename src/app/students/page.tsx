
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { Student, getAllStudents, getStudentById, updateStudent } from '@/lib/db'
// import { FaEdit, FaSearch, FaTrash, FaUser, FaPlus, FaSpinner, FaDownload } from 'react-icons/fa'

// export default function StudentsListPage() {
//   const router = useRouter()
//   const [students, setStudents] = useState<Student[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [editingStudent, setEditingStudent] = useState<Student | null>(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [isSaving, setIsSaving] = useState(false)

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         setLoading(true)
//         // Récupération de tous les élèves
//         const studentsData = await getAllStudents()
//         setStudents(studentsData)
//       } catch (error) {
//         console.error('Error fetching students:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStudents()
//   }, [])

//   const handleExportToJson = () => {
//     const dataStr = JSON.stringify(students, null, 2)
//     const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    
//     const exportFileDefaultName = `eleves_${new Date().toISOString().slice(0, 10)}.json`
    
//     const linkElement = document.createElement('a')
//     linkElement.setAttribute('href', dataUri)
//     linkElement.setAttribute('download', exportFileDefaultName)
//     linkElement.click()
//   }

//   const filteredStudents = students.filter(student =>
//     student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     student.matricule.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleEdit = (student: Student) => {
//     setEditingStudent({...student})
//     setIsEditing(true)
//   }

//   const handleSave = async () => {
//     if (!editingStudent) return

//     try {
//       setIsSaving(true)
//       await updateStudent(editingStudent.id, {
//         nom: editingStudent.nom,
//         post_nom: editingStudent.post_nom,
//         prenom: editingStudent.prenom,
//         date_naissance: editingStudent.date_naissance,
//         lieu_naissance: editingStudent.lieu_naissance,
//         sexe: editingStudent.sexe,
//         nationalite: editingStudent.nationalite,
//         adresse: editingStudent.adresse,
//         contacts: editingStudent.contacts,
//         niveau_etude: editingStudent.niveau_etude,
//         etablissement_precedent: editingStudent.etablissement_precedent,
//         option_choisie: editingStudent.option_choisie
//       })

//       setStudents(students.map(s => 
//         s.id === editingStudent.id ? editingStudent : s
//       ))
//       setIsEditing(false)
//     } catch (error) {
//       console.error('Error updating student:', error)
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <FaSpinner className="animate-spin text-4xl text-blue-500" />
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Liste des Élèves</h1>
//         <div className="flex gap-4">
          
//           <button 
//             onClick={() => router.push('/students/register')}
//             className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white -lg hover:bg-blue-700 transition-colors"
//           >
//             <FaPlus /> Ajouter 
//           </button>
//         </div>
//       </div>

//       <div className="mb-6 relative">
//         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//           <FaSearch className="text-gray-400" />
//         </div>
//         <input
//           type="text"
//           placeholder="Rechercher un élève..."
//           className="pl-10 pr-4 py-2 w-full max-w-md border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredStudents.length > 0 ? (
//               filteredStudents.map((student) => (
//                 <tr key={student.id} className="hover:bg-gray-50 overflow-scroll">
//                   <td className="px-6 py-4  -flex whitespace-nowrap overflow-scroll text-sm font-medium text-gray-900">
//                         <button className="text-red-600 hover:text-red-900">
//                       <FaTrash />
//                     </button>
//                     {student.matricule}
//                   </td>
//                    <button
//                       onClick={() => router.push(`/students/${student.id}`)}
//                       className="text-green-600 hover:text-green-900 mr-4"
//                     >
                     
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {student.nom} {student.post_nom}
//                   </td>
//                     </button>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {student.prenom}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {student.niveau_etude}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {student.option_choisie}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => handleEdit(student)}
//                       className="text-blue-600 hover:text-blue-900 mr-4"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => router.push(`/students/${student.id}`)}
//                       className="text-green-600 hover:text-green-900 mr-4"
//                     >
//                       <FaUser />
//                     </button>
//                     <button className="text-red-600 hover:text-red-900">
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
//                   Aucun élève trouvé
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal d'édition */}
//       {isEditing && editingStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-900">Modifier l'élève</h3>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     value={editingStudent.nom}
//                     onChange={(e) => setEditingStudent({...editingStudent, nom: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Post-nom</label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     value={editingStudent.post_nom}
//                     onChange={(e) => setEditingStudent({...editingStudent, post_nom: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     value={editingStudent.prenom}
//                     onChange={(e) => setEditingStudent({...editingStudent, prenom: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
//                   <input
//                     type="date"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     value={editingStudent.date_naissance.split('T')[0]}
//                     onChange={(e) => setEditingStudent({...editingStudent, date_naissance: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'étude</label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     value={editingStudent.niveau_etude}
//                     onChange={(e) => setEditingStudent({...editingStudent, niveau_etude: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Option choisie</label>
//                   <input
//                     type="text"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                     value={editingStudent.option_choisie}
//                     onChange={(e) => setEditingStudent({...editingStudent, option_choisie: e.target.value})}
//                   />
//                 </div>
//               </div>
//               <div className="pt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Contacts</label>
//                 {editingStudent.contacts.map((contact, index) => (
//                   <div key={index} className="flex gap-2 mb-2">
//                     <input
//                       type="tel"
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
//                       value={contact}
//                       onChange={(e) => {
//                         const newContacts = [...editingStudent.contacts]
//                         newContacts[index] = e.target.value
//                         setEditingStudent({...editingStudent, contacts: newContacts})
//                       }}
//                     />
//                     <button
//                       onClick={() => {
//                         const newContacts = [...editingStudent.contacts]
//                         newContacts.splice(index, 1)
//                         setEditingStudent({...editingStudent, contacts: newContacts})
//                       }}
//                       className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//                     >
//                       Supprimer
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   onClick={() => {
//                     setEditingStudent({
//                       ...editingStudent,
//                       contacts: [...editingStudent.contacts, '']
//                     })
//                   }}
//                   className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                 >
//                   Ajouter un contact
//                 </button>
//               </div>
//             </div>
//             <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={isSaving}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
//               >
//                 {isSaving && <FaSpinner className="animate-spin" />}
//                 Enregistrer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Student, getAllStudents, getStudentById, updateStudent } from '@/lib/db'
import { FaEdit, FaSearch, FaTrash, FaUser, FaPlus, FaSpinner, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function StudentsListPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(10)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const studentsData = await getAllStudents()
        setStudents(studentsData)
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const handleExportToJson = () => {
    const dataStr = JSON.stringify(students, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `eleves_${new Date().toISOString().slice(0, 10)}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleEdit = (student: Student) => {
    setEditingStudent({...student})
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editingStudent) return

    try {
      setIsSaving(true)
      await updateStudent(editingStudent.id, {
        nom: editingStudent.nom,
        post_nom: editingStudent.post_nom,
        prenom: editingStudent.prenom,
        date_naissance: editingStudent.date_naissance,
        lieu_naissance: editingStudent.lieu_naissance,
        sexe: editingStudent.sexe,
        nationalite: editingStudent.nationalite,
        adresse: editingStudent.adresse,
        contacts: editingStudent.contacts,
        niveau_etude: editingStudent.niveau_etude,
        etablissement_precedent: editingStudent.etablissement_precedent,
        option_choisie: editingStudent.option_choisie
      })

      setStudents(students.map(s => 
        s.id === editingStudent.id ? editingStudent : s
      ))
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating student:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Liste des Élèves</h1>
          <p className="text-gray-600 mt-1">
            {filteredStudents.length} élève{filteredStudents.length !== 1 ? 's' : ''} trouvé{filteredStudents.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* <button 
            onClick={handleExportToJson}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <FaDownload /> Exporter
          </button> */}
          <button 
            onClick={() => router.push('/students/register')}
            className="flex items-center gap-2 px-4 py-2 rounded-full w-max bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Ajouter 
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un élève..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page when searching
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom complet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.length > 0 ? (
                currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.matricule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.prenom} {student.nom} {student.post_nom}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {student.niveau_etude}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.option_choisie}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full"
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => router.push(`/students/${student.id}`)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full"
                        title="Profil"
                      >
                        <FaUser />
                      </button>
                      <button 
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun élève trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStudents.length > studentsPerPage && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaChevronLeft />
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
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`w-10 h-10 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      {isEditing && editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Modifier l'élève</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={editingStudent.nom}
                    onChange={(e) => setEditingStudent({...editingStudent, nom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post-nom</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={editingStudent.post_nom}
                    onChange={(e) => setEditingStudent({...editingStudent, post_nom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={editingStudent.prenom}
                    onChange={(e) => setEditingStudent({...editingStudent, prenom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={editingStudent.date_naissance.split('T')[0]}
                    onChange={(e) => setEditingStudent({...editingStudent, date_naissance: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niveau d'étude</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={editingStudent.niveau_etude}
                    onChange={(e) => setEditingStudent({...editingStudent, niveau_etude: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Option choisie</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={editingStudent.option_choisie}
                    onChange={(e) => setEditingStudent({...editingStudent, option_choisie: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contacts</label>
                {editingStudent.contacts.map((contact, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="tel"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={contact}
                      onChange={(e) => {
                        const newContacts = [...editingStudent.contacts]
                        newContacts[index] = e.target.value
                        setEditingStudent({...editingStudent, contacts: newContacts})
                      }}
                      placeholder="Numéro de téléphone"
                    />
                    <button
                      onClick={() => {
                        const newContacts = [...editingStudent.contacts]
                        newContacts.splice(index, 1)
                        setEditingStudent({...editingStudent, contacts: newContacts})
                      }}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setEditingStudent({
                      ...editingStudent,
                      contacts: [...editingStudent.contacts, '']
                    })
                  }}
                  className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Ajouter un contact
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isSaving && <FaSpinner className="animate-spin" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}