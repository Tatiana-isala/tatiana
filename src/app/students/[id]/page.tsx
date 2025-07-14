// 'use client'
// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { getStudentById } from '@/lib/db';
// import { Student,User ,getParents} from '@/lib/db';
// import { FaUser, FaEdit, FaPrint, FaArrowLeft } from 'react-icons/fa';
// import TutorSelectionModal from '@/components/TutorSelectionModal';
// import { assignTutor } from '@/lib/db';



// export default function StudentDetails() {
//   const router = useRouter();
//   const { id } = useParams();
//   const [student, setStudent] = useState<Student | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedTutor, setSelectedTutor] = useState<User | null>(null);
  
  
//   const handleAssignTutor = async (tutorId: string) => {
//   try {
//     // Vérification que student existe
//     if (!student) {
//       throw new Error("Aucun étudiant sélectionné");
//     }

//     // Correction des noms de variables (tutorId au lieu de tutorid)
//     await assignTutor(student.id, tutorId);

//     // Mise à jour de l'affichage - version corrigée
//     setStudent(prev => {
//       if (!prev) return null;
//       return {
//         ...prev,
//         tuteurId: tutorId,
//         updatedAt: new Date().toISOString() // Correction du nom updatedAt (pas updateAkt)
//       };
//     });

//     setIsModalOpen(false);

//     // Trouver le tuteur dans la liste des parents
//     const parents = await getParents();
//     const tutor = parents.find(p => p.id === tutorId);
//     setSelectedTutor(tutor || null);

//   } catch (error) {
//     console.error('Error assigning tutor:', error);
//     alert("Erreur lors de l'assignation du tuteur");
//   }
// };
//   useEffect(() => {
//     const fetchStudent = async () => {
//       try {
//         if (typeof id === 'string') {
//           const data = await getStudentById(id);
//           setStudent(data);
//         }
//       } catch (error) {
//         console.error('Error fetching student:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudent();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Chargement des informations de l'étudiant...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!student) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">Étudiant non trouvé</p>
//           <button 
//             onClick={() => router.push('/students')}
//             className="mt-4 text-blue-600 hover:text-blue-800"
//           >
//             Retour à la liste
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="bg-blue-600 text-white p-6">
//           <div className="flex items-center justify-between">
//             <button 
//               onClick={() => router.back()} 
//               className="flex items-center text-white hover:text-blue-200"
//             >
//               <FaArrowLeft className="mr-2" /> Retour
//             </button>
//             <h1 className="text-2xl font-bold">Fiche de l'étudiant</h1>
//             <div className="flex gap-2">
//               <button className="p-2 bg-blue-500 rounded-md hover:bg-blue-700">
//                 <FaEdit />
//               </button>
//               <button className="p-2 bg-blue-500 rounded-md hover:bg-blue-700">
//                 <FaPrint />
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="flex flex-col md:flex-row gap-8 mb-8">
//             <div className="flex flex-col items-center">
//               <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
//                 {student.photoUrl ? (
//                   <img 
//                     src={student.photoUrl} 
//                     alt={`${student.nom} ${student.prenom}`} 
//                     className="w-full h-full rounded-full object-cover"
//                   />
//                 ) : (
//                   <FaUser className="text-5xl text-gray-400" />
//                 )}
//               </div>
//               <h2 className="text-xl font-semibold">{student.nom} {student.prenom}</h2>
//               <p className="text-sm text-gray-500">Matricule: {student.matricule}</p>
//             </div>

//             <div className="flex-1">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Nom complet</h3>
//                   <p className="text-lg">{student.nom} {student.postNom} {student.prenom}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Sexe</h3>
//                   <p className="text-lg">{student.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Date de naissance</h3>
//                   <p className="text-lg">{new Date(student.dateNaissance).toLocaleDateString()}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Lieu de naissance</h3>
//                   <p className="text-lg">{student.lieuNaissance}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Nationalité</h3>
//                   <p className="text-lg">{student.nationalite}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
//                   <p className="text-lg">{student.adresse}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-gray-200 pt-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">Informations scolaires</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Niveau d'étude</h3>
//                 <p className="text-lg">{student.niveauEtude}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Option choisie</h3>
//                 <p className="text-lg">{student.optionChoisie}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Établissement précédent</h3>
//                 <p className="text-lg">{student.etablissementPrecedent || 'Non renseigné'}</p>
//               </div>
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Date d'inscription</h3>
//                 <p className="text-lg">{new Date(student.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//           </div>

//           <div className="border-t border-gray-200 pt-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">Contacts</h2>
//             <div className="space-y-2">
//               {student.contacts.map((contact, index) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <span className="text-lg">{contact}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="border-t border-gray-200 pt-6">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">Tuteur</h2>
//             <div className="bg-gray-100 p-4 rounded-md">
//               {student.tuteurId ? (
//                 <p className="text-gray-700">Tuteur assigné (ID: {student.tuteurId})</p>
//               ) : (
//                 <p className="text-gray-700">Aucun tuteur assigné</p>
//               )}
//               <button className="mt-2 text-blue-600 hover:text-blue-800">
//                 {student.tuteurId ? 'Changer de tuteur' : 'Assigner un tuteur'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getStudentById, assignTutor, getParents } from '@/lib/db'
import { Student, User } from '@/lib/db'
import TutorSelectionModal from '@/components/TutorSelectionModal'
import { 
  FaUser, FaUserTie, FaEdit, FaPrint, FaArrowLeft, 
  FaUserPlus, FaPhone, FaEnvelope, FaBirthdayCake,
  FaMapMarkerAlt, FaSchool, FaIdCard, FaCalendarAlt
} from 'react-icons/fa'

export default function StudentDetails() {
  const router = useRouter()
  const { id } = useParams()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState<User | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true)
        if (typeof id === 'string') {
          const data = await getStudentById(id)
          setStudent(data)
          
          if (data?.tuteurId) {
            const parents = await getParents()
            const tutor = parents.find(p => p.id === data.tuteurId)
            setSelectedTutor(tutor || null)
          }
        }
      } catch (error) {
        console.error('Error fetching student:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id])

  const handleAssignTutor = async (tutorId: string) => {
    try {
      setIsAssigning(true)
      if (!student) throw new Error("Aucun étudiant sélectionné")
      
      await assignTutor(student.id, tutorId)
      
      const parents = await getParents()
      const tutor = parents.find(p => p.id === tutorId)
      
      setStudent(prev => ({
        ...prev!,
        tuteurId: tutorId,
        updatedAt: new Date().toISOString()
      }))
      
      setSelectedTutor(tutor || null)
    } catch (error) {
      console.error('Error assigning tutor:', error)
      alert("Erreur lors de l'assignation du tuteur")
    } finally {
      setIsAssigning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des informations...</p>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Étudiant non trouvé</p>
          <button 
            onClick={() => router.push('/students')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft /> Retour
          </button>
          <div className="flex gap-4">
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <FaEdit /> Modifier
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              <FaPrint /> Imprimer
            </button> */}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* En-tête avec photo et info de base */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                <FaUser className="text-4xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {student.nom} {student.prenom}
                </h1>
                <div className="flex items-center gap-2 mt-1 text-blue-200">
                  <FaIdCard />
                  <span>Matricule: {student.matricule}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Colonne 1: Informations personnelles */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b">
                  <h2 className="font-semibold text-gray-800">Informations Personnelles</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      <FaUser size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">
                        {student.nom} {student.postNom} {student.prenom}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      <FaBirthdayCake size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date de naissance</p>
                      <p className="font-medium">
                        {new Date(student.dateNaissance).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      <FaMapMarkerAlt size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lieu de naissance</p>
                      <p className="font-medium">{student.lieuNaissance}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      {student.sexe === 'M' ? '♂' : '♀'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sexe</p>
                      <p className="font-medium">
                        {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      🌍
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nationalité</p>
                      <p className="font-medium">{student.nationalite}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      <FaMapMarkerAlt size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium">{student.adresse}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2: Informations scolaires */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b">
                  <h2 className="font-semibold text-gray-800">Informations Scolaires</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      <FaSchool size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Niveau d'étude</p>
                      <p className="font-medium">{student.niveauEtude}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      📚
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Option choisie</p>
                      <p className="font-medium">{student.optionChoisie}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      <FaSchool size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Établissement précédent</p>
                      <p className="font-medium">
                        {student.etablissementPrecedent || 'Non renseigné'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      <FaCalendarAlt size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date d'inscription</p>
                      <p className="font-medium">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b">
                  <h2 className="font-semibold text-gray-800">Contacts</h2>
                </div>
                <div className="p-4 space-y-3">
                  {student.contacts.map((contact, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                        <FaPhone size={16} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Téléphone {index + 1}</p>
                        <p className="font-medium">{contact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne 3: Tuteur assigné */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">Tuteur Assigné</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={isAssigning}
                    className={`flex items-center gap-1 px-3 py-1 text-sm bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors ${
                      isAssigning ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaUserPlus size={14} />
                    {student.tuteurId ? 'Changer' : 'Assigner'}
                  </button>
                </div>
                
                <div className="p-4">
                  {selectedTutor ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-800 p-3 rounded-full">
                          <FaUserTie size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedTutor.name}</h3>
                          <p className="text-sm text-gray-600">Parent tuteur</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                            <FaPhone size={16} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Téléphone</p>
                            <p className="font-medium">{selectedTutor.phone}</p>
                          </div>
                        </div>
                        
                        {selectedTutor.email && (
                          <div className="flex gap-3">
                            <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                              <FaEnvelope size={16} />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{selectedTutor.email}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-3">
                          <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                            <FaCalendarAlt size={16} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Dernière connexion</p>
                            <p className="font-medium">
                              {selectedTutor.last_sign_in_at
                                ? new Date(selectedTutor.last_sign_in_at).toLocaleString()
                                : 'Inconnue'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <FaUser className="mx-auto text-3xl mb-2 text-gray-300" />
                      <p>Aucun tuteur assigné</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TutorSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAssignTutor}
        currentStudentId={student.id}
      />
    </div>
  )
}