

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
          
          if (data?.tuteur_id) {
            const parents = await getParents()
            const tutor = parents.find(p => p.id === data.tuteur_id)
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
        tuteur_id: tutorId,
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
    <div className="min-h-screen bg-gray- py-8 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center bg-gray-50 rounded-xl gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
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

        <div className="bg-white rounded- sha overflow-hidden">
          {/* En-tête avec photo et info de base */}
          <div className="bg-gradient-to-r rounded-xl from-blue-600 to-blue-800 text-white p-6">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center ">
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

          <div className="my-2 grid grid-cols-1 md:grid-cols-3 gap-8">
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
                        {student.nom} {student.post_nom} {student.prenom}
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
                        {new Date(student.date_naissance).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      <FaMapMarkerAlt size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lieu de naissance</p>
                      <p className="font-medium">{student.lieu_naissance}</p>
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
                      <p className="font-medium">{student.niveau_etude}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      📚
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Option choisie</p>
                      <p className="font-medium">{student.option_choisie}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full h-fit">
                      <FaSchool size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Établissement précédent</p>
                      <p className="font-medium">
                        {student.etablissement_precedent || 'Non renseigné'}
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
                        {new Date(student.created_at).toLocaleDateString()}
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
                    {student.tuteur_id ? 'Changer' : 'Assigner'}
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