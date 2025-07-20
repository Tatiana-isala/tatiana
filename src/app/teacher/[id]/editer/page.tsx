'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  getUserById, 
  getTeacherInfo,
  updateTeacherInfo,
  addTeacherInfo,getTeachersCount,
  User
} from '@/lib/db'
import { 
  FaUserTie, 
  FaBook, 
  FaUsers,
  FaSave,
  FaArrowLeft,
  FaPlus,
  FaTimes,
  FaBirthdayCake,
  FaVenusMars,
  FaRing,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaIdCard
} from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function EditTeacherPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [teacher, setTeacher] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    matricule: '',
    dateNaissance: '',
    sexe: 'M' as 'M' | 'F',
    adresse: '',
    situationMatrimoniale: 'CELIBATAIRE' as 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'VEUF',
    grade: 'LICENCE' as 'LICENCE' | 'MASTER' | 'DIPLOME' | 'DOCTORAT' | 'AUTRE',
    matierePrincipale: '',
    classesResponsables: [] as string[],
    anneesExperience: 0,
    statut: 'titulaire' as 'titulaire' | 'remplacant' | 'stagiaire'
  })
  const [newClass, setNewClass] = useState('')

 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      
      const userData = await getUserById(id as string)
      if (!userData || userData.role !== 'enseignant') {
        throw new Error('Enseignant non trouvé')
      }
      setTeacher(userData)
      
      const [infoData, count] = await Promise.all([
        getTeacherInfo(id as string),
        getTeachersCount()
      ])
      
      if (infoData) {
        setFormData({
          matricule: infoData.matricule || '',
          dateNaissance: infoData.dateNaissance || '',
          sexe: infoData.sexe || 'M',
          adresse: infoData.adresse || '',
          situationMatrimoniale: infoData.situationMatrimoniale || 'CELIBATAIRE',
          grade: infoData.grade || 'LICENCE',
          matierePrincipale: infoData.matierePrincipale || '',
          classesResponsables: infoData.classesResponsables || [],
          anneesExperience: infoData.anneesExperience || 0,
          statut: infoData.statut || 'titulaire'
        })
      } else {
        // Générer un matricule selon la nouvelle logique
        const matricule = `${count + 1}${userData.name.substring(0, 2).toUpperCase()}${new Date().getFullYear()}`
        setFormData(prev => ({
          ...prev,
          matricule
        }))
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des données')
      router.push('/teachers')
    } finally {
      setLoading(false)
    }
  }

  if (id) {
    fetchData()
  }
}, [id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'anneesExperience' ? parseInt(value) || 0 : value
    }))
  }

  const handleAddClass = () => {
    if (newClass.trim() && !formData.classesResponsables.includes(newClass.trim())) {
      setFormData(prev => ({
        ...prev,
        classesResponsables: [...prev.classesResponsables, newClass.trim()]
      }))
      setNewClass('')
    }
  }

  const handleRemoveClass = (classe: string) => {
    setFormData(prev => ({
      ...prev,
      classesResponsables: prev.classesResponsables.filter(c => c !== classe)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const existingInfo = await getTeacherInfo(id as string)
      
      if (existingInfo) {
        await updateTeacherInfo(id as string, formData)
      } else {
        await addTeacherInfo(id as string, formData)
      }
      
      toast.success('Informations mises à jour avec succès')
      router.push(`/teacher/${id}`)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !teacher) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Enseignant non trouvé</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Retour
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Modifier les informations de {teacher.name}
            </h1>
            <p className="text-gray-600">Mettez à jour les détails pédagogiques</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
            
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
    <FaIdCard className="mr-2" /> Matricule *
  </label>
  <input
    type="text"
    name="matricule"
    value={formData.matricule}
    onChange={handleInputChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
    required
    readOnly
  />
  <p className="text-xs text-gray-500 mt-1">Le matricule est généré automatiquement</p>
</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaBirthdayCake className="mr-2" /> Date de naissance
                </label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaVenusMars className="mr-2" /> Sexe *
                </label>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaMapMarkerAlt className="mr-2" /> Adresse
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaRing className="mr-2" /> Situation matrimoniale
                </label>
                <select
                  name="situationMatrimoniale"
                  value={formData.situationMatrimoniale}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CELIBATAIRE">Célibataire</option>
                  <option value="MARIE">Marié(e)</option>
                  <option value="DIVORCE">Divorcé(e)</option>
                  <option value="VEUF">Veuf/Veuve</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaGraduationCap className="mr-2" /> Grade académique
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LICENCE">Licence</option>
                  <option value="MASTER">Master</option>
                  <option value="DIPLOME">Diplôme</option>
                  <option value="DOCTORAT">Doctorat</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaUserTie className="mr-2" /> Statut professionnel *
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="titulaire">Titulaire</option>
                  <option value="remplacant">Remplaçant</option>
                  <option value="stagiaire">Stagiaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Années d'expérience
                </label>
                <input
                  type="number"
                  name="anneesExperience"
                  value={formData.anneesExperience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matière principale *
              </label>
              <input
                type="text"
                name="matierePrincipale"
                value={formData.matierePrincipale}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Classes responsables
              </label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  placeholder="Ajouter une classe (ex: 3ème A)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddClass())}
                />
                <button
                  type="button"
                  onClick={handleAddClass}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 flex items-center"
                  disabled={!newClass.trim()}
                >
                  <FaPlus className="mr-1" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.classesResponsables.map((classe, index) => (
                  <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <span className="mr-2">{classe}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(classe)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push(`/enseignants/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
            >
              <FaSave className="mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}