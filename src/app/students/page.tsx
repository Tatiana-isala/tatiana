// // src/app/students/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { Student, getAllStudents, getStudentById, updateStudent } from '@/lib/db'
// import { FaEdit, FaSearch, FaTrash, FaUser, FaPlus, FaSpinner } from 'react-icons/fa'

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
//         <button 
//           onClick={() => router.push('/students/new')}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <FaPlus /> Ajouter un élève
//         </button>
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
//                 <tr key={student.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {student.matricule}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {student.nom} {student.post_nom}
//                   </td>
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

// src/app/students/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Student, getAllStudents, getStudentById, updateStudent } from '@/lib/db'
import { FaEdit, FaSearch, FaTrash, FaUser, FaPlus, FaSpinner, FaDownload } from 'react-icons/fa'

export default function StudentsListPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        // Récupération de tous les élèves
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

  const filteredStudents = students.filter(student =>
    student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricule.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Liste des Élèves</h1>
        <div className="flex gap-4">
          <button 
            onClick={handleExportToJson}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload /> Exporter en JSON
          </button>
          <button 
            onClick={() => router.push('/students/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> Ajouter un élève
          </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher un élève..."
          className="pl-10 pr-4 py-2 w-full max-w-md border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.matricule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.nom} {student.post_nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.prenom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.niveau_etude}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.option_choisie}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => router.push(`/students/${student.id}`)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      <FaUser />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun élève trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition */}
      {isEditing && editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Modifier l'élève</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editingStudent.nom}
                    onChange={(e) => setEditingStudent({...editingStudent, nom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Post-nom</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editingStudent.post_nom}
                    onChange={(e) => setEditingStudent({...editingStudent, post_nom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editingStudent.prenom}
                    onChange={(e) => setEditingStudent({...editingStudent, prenom: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editingStudent.date_naissance.split('T')[0]}
                    onChange={(e) => setEditingStudent({...editingStudent, date_naissance: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'étude</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editingStudent.niveau_etude}
                    onChange={(e) => setEditingStudent({...editingStudent, niveau_etude: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Option choisie</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editingStudent.option_choisie}
                    onChange={(e) => setEditingStudent({...editingStudent, option_choisie: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacts</label>
                {editingStudent.contacts.map((contact, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="tel"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      value={contact}
                      onChange={(e) => {
                        const newContacts = [...editingStudent.contacts]
                        newContacts[index] = e.target.value
                        setEditingStudent({...editingStudent, contacts: newContacts})
                      }}
                    />
                    <button
                      onClick={() => {
                        const newContacts = [...editingStudent.contacts]
                        newContacts.splice(index, 1)
                        setEditingStudent({...editingStudent, contacts: newContacts})
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Ajouter un contact
                </button>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
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