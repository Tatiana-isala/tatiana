// 'use client'

// import { useEffect, useState } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { getTeacherInfo, updateTeacherInfo } from '@/lib/db'
// import {
//   FaUserTie,
//   FaChalkboardTeacher,
//   FaBook,
//   FaPhone,
//   FaEnvelope,
//   FaEdit,
//   FaSave,
//   FaGraduationCap
// } from 'react-icons/fa'
// import { toast } from 'react-toastify'

// export default function TeacherPage() {
//   const { user } = useAuth()
//   const [teacherInfo, setTeacherInfo] = useState<any>(null)
//   const [editMode, setEditMode] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [formData, setFormData] = useState({
//     phone: '',
//     email: '',
//     matierePrincipale: '',
//     anneesExperience: 0
//   })

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!user || user.role !== 'enseignant') return
        
//         // Charger les infos de l'enseignant
//         const infoData = await getTeacherInfo(user.id)
//         setTeacherInfo(infoData)
//         setFormData({
//           phone: user.phone || '',
//           email: user.email || '',
//           matierePrincipale: infoData?.matierePrincipale || '',
//           anneesExperience: infoData?.anneesExperience || 0
//         })
//       } catch (err) {
//         console.error('Error fetching teacher data:', err)
//         toast.error('Erreur lors du chargement des informations')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [user])

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ 
//       ...prev, 
//       [name]: name === 'anneesExperience' ? parseInt(value) || 0 : value 
//     }))
//   }
// const handleSave = async () => {
//     try {
//         if (!user) {
//             toast.error('Utilisateur non connecté')
//             return
//         }

//         setLoading(true)
//         // Mettre à jour les infos pédagogiques
//         await updateTeacherInfo(user.id, {
//             matierePrincipale: formData.matierePrincipale,
//             anneesExperience: formData.anneesExperience
//         })
        
//         // Ici vous devriez aussi mettre à jour les infos user (phone, email)
//         // via une fonction updateUser si elle existe
//         toast.success('Informations mises à jour avec succès')
//         setEditMode(false)

//         // Recharger les données
//         const updatedInfo = await getTeacherInfo(user.id)
//         setTeacherInfo(updatedInfo)
//     } catch (err) {
//         toast.error('Erreur lors de la mise à jour')
//         console.error(err)
//     } finally {
//         setLoading(false)
//     }
// }



//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       {/* En-tête */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold flex items-center">
//           <FaChalkboardTeacher className="mr-2 text-blue-600" />
//           Mon Espace Enseignant
//         </h1>
//         {!editMode ? (
//           <button 
//             onClick={() => setEditMode(true)}
//             className="flex items-center text-blue-600 hover:text-blue-800"
//           >
//             <FaEdit className="mr-1" /> Modifier mes informations
//           </button>
//         ) : (
//           <div className="space-x-2">
//             <button 
//               onClick={() => setEditMode(false)}
//               className="px-3 py-1 border border-gray-300 rounded-md text-gray-700"
//             >
//               Annuler
//             </button>
//             <button 
//               onClick={handleSave}
//               disabled={loading}
//               className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
//             >
//               <FaSave className="mr-1" /> {loading ? 'Enregistrement...' : 'Enregistrer'}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Section informations */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-semibold mb-6 flex items-center">
//           <FaUserTie className="mr-2 text-blue-500" />
//           Mes Informations Professionnelles
//         </h2>
        
//         {editMode ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Matière principale</label>
//               <input
//                 type="text"
//                 name="matierePrincipale"
//                 value={formData.matierePrincipale}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
//               <input
//                 type="number"
//                 name="anneesExperience"
//                 value={formData.anneesExperience}
//                 onChange={handleInputChange}
//                 min="0"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex items-start">
//               <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
//                 <FaUserTie className="text-blue-600 text-xl" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-medium">{user?.name}</h3>
//                 <div className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                   teacherInfo?.statut === 'titulaire' ? 'bg-green-100 text-green-800' :
//                   teacherInfo?.statut === 'remplacant' ? 'bg-blue-100 text-blue-800' :
//                   'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {teacherInfo?.statut || 'Non spécifié'}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-gray-500 flex items-center">
//                   <FaPhone className="mr-2 text-gray-400" />
//                   Téléphone
//                 </h4>
//                 <p>{user?.phone || 'Non renseigné'}</p>
//               </div>
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-gray-500 flex items-center">
//                   <FaEnvelope className="mr-2 text-gray-400" />
//                   Email
//                 </h4>
//                 <p>{user?.email || 'Non renseigné'}</p>
//               </div>
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-gray-500 flex items-center">
//                   <FaBook className="mr-2 text-gray-400" />
//                   Matière principale
//                 </h4>
//                 <p>{teacherInfo?.matierePrincipale || 'Non renseignée'}</p>
//               </div>
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-gray-500">
//                   Années d'expérience
//                 </h4>
//                 <p>{teacherInfo?.anneesExperience || '0'} an(s)</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Section future pour les classes/élèves */}
//       <div className="mt-8 bg-blue-50 rounded-lg p-4 text-center">
//         <FaGraduationCap className="mx-auto text-blue-400 text-3xl mb-2" />
//         <h3 className="text-lg font-medium text-blue-800">Espace élèves</h3>
//         <p className="text-blue-600">Cette fonctionnalité sera disponible prochainement</p>
//       </div>
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { 
  getTeacherInfo,
  getCoursesForTeacher,
  getClassroomsForTeacher,
  getScheduleForClassroom,
  Classroom,
  Course,
  ScheduleItem
} from '@/lib/db'
import { 
  FaChalkboardTeacher,
  FaBook,
  FaUsers,
  FaCalendarAlt,
  FaBell,
  FaChartLine,
  FaUserGraduate,
  FaClock
} from 'react-icons/fa'
import { FiHome, FiUser, FiMail, FiPhone } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [teacherInfo, setTeacherInfo] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || user.role !== 'enseignant') return
        
        // Fetch all data in parallel
        const [infoData, teacherCourses, teacherClassrooms] = await Promise.all([
          getTeacherInfo(user.id),
          getCoursesForTeacher(user.id),
          getClassroomsForTeacher(user.id)
        ])

        setTeacherInfo(infoData)
        setCourses(teacherCourses)
        setClassrooms(teacherClassrooms)

        // Get today's schedule (example for Monday)
        if (teacherClassrooms.length > 0) {
          const today = 'LUNDI' // In a real app, use new Date().toLocaleString('fr-FR', { weekday: 'long' }).toUpperCase()
          const schedules = await Promise.all(
            teacherClassrooms.map(cls => getScheduleForClassroom(cls.id))
          )
          const todaySchedules = schedules.flat().filter(item => item.day === today)
          setTodaySchedule(todaySchedules)
        }

      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Erreur lors du chargement des données')
        toast.error('Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md max-w-md">
          <p className="font-medium">{error}</p>
          <p className="mt-2 text-sm">Veuillez réessayer plus tard ou contacter l'administration</p>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const stats = [
    { title: "Classes", value: classrooms.length, icon: <FaUsers className="text-2xl" /> },
    { title: "Cours", value: courses.length, icon: <FaBook className="text-2xl" /> },
    { title: "Élèves", value: classrooms.reduce((acc, cls) => acc + (cls.studentIds?.length || 0), 0), icon: <FaUserGraduate className="text-2xl" /> },
    { title: "Cours aujourd'hui", value: todaySchedule.length, icon: <FaClock className="text-2xl" /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaChalkboardTeacher className="mr-2 text-blue-600" />
            Tableau de bord enseignant
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
              <FaBell />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {user?.name.charAt(0)}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bonjour, {user?.name}</h2>
                <p className="opacity-90 max-w-2xl">
                  {teacherInfo?.statut === 'titulaire' 
                    ? "Vous êtes enseignant titulaire dans notre établissement."
                    : teacherInfo?.statut === 'remplacant'
                    ? "Vous êtes actuellement enseignant remplaçant."
                    : "Bienvenue dans votre espace enseignant."}
                </p>
              </div>
              <div className="mt-4 md:mt-0 bg-white/20 rounded-lg p-4">
                <p className="text-sm font-medium">Année scolaire 2023-2024</p>
                <p className="text-xl font-bold">Semestre 2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="text-blue-600 bg-blue-50 p-3 rounded-full">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  Emploi du temps aujourd'hui
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              <div className="divide-y divide-gray-200">
                {todaySchedule.length > 0 ? (
                  todaySchedule.map((item, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            {courses.find(c => c.id === item.courseId)?.name || 'Cours'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {classrooms.find(c => c.id === item.classroom_id)?.name || 'Classe'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">
                            {item.startTime} - {item.endTime}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Salle {index + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <FaCalendarAlt className="mx-auto text-3xl mb-2 text-gray-300" />
                    <p>Aucun cours prévu aujourd'hui</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Classes list */}
          <div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FaUsers className="mr-2 text-blue-600" />
                  Mes classes
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {classrooms.length > 0 ? (
                  classrooms.map((classroom) => (
                    <div key={classroom.id} className="p-4 hover:bg-gray-50">
                      <h3 className="font-medium">{classroom.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          {classroom.studentIds?.length || 0} élèves
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {classroom.section}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <FaUsers className="mx-auto text-3xl mb-2 text-gray-300" />
                    <p>Aucune classe assignée</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <FiHome className="mr-2 text-blue-600" />
                  Accès rapide
                </h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <a 
                  href="#"
                  className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-center"
                >
                  <FiUser className="mx-auto text-blue-600 mb-1" />
                  <span className="text-sm">Profil</span>
                </a>
                <a 
                  href="#"
                  className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-center"
                >
                  <FiMail className="mx-auto text-blue-600 mb-1" />
                  <span className="text-sm">Messages</span>
                </a>
                <a 
                  href="/teachers/overview"
                  className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-center"
                >
                  <FaBook className="mx-auto text-blue-600 mb-1" />
                  <span className="text-sm">Cours</span>
                </a>
                <a 
                  href="/teachers/grades"
                  className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-center"
                >
                  <FaChartLine className="mx-auto text-blue-600 mb-1" />
                  <span className="text-sm">Notes</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}