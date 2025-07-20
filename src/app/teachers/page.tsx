
// 'use client'

// import { useEffect, useState } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { 
//   getTeacherInfo,
//   getCoursesForTeacher,
//   getClassroomsForTeacher,
//   getScheduleForClassroom,
//   Classroom,
//   Course,
//   ScheduleItem
// } from '@/lib/db'
// import { 
//   FaChalkboardTeacher,
//   FaBook,
//   FaUsers,
//   FaCalendarAlt,
//   FaBell,
//   FaChartLine,
//   FaUserGraduate,
//   FaClock
// } from 'react-icons/fa'
// import { FiHome, FiUser, FiMail, FiPhone } from 'react-icons/fi'
// import { toast } from 'react-toastify'

// export default function TeacherDashboard() {
//   const { user } = useAuth()
//   const [teacherInfo, setTeacherInfo] = useState<any>(null)
//   const [courses, setCourses] = useState<Course[]>([])
//   const [classrooms, setClassrooms] = useState<Classroom[]>([])
//   const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!user || user.role !== 'enseignant') return
        
//         // Fetch all data in parallel
//         const [infoData, teacherCourses, teacherClassrooms] = await Promise.all([
//           getTeacherInfo(user.id),
//           getCoursesForTeacher(user.id),
//           getClassroomsForTeacher(user.id)
//         ])

//         setTeacherInfo(infoData)
//         setCourses(teacherCourses)
//         setClassrooms(teacherClassrooms)

//         // Get today's schedule (example for Monday)
//         if (teacherClassrooms.length > 0) {
//           const today = 'LUNDI' // In a real app, use new Date().toLocaleString('fr-FR', { weekday: 'long' }).toUpperCase()
//           const schedules = await Promise.all(
//             teacherClassrooms.map(cls => getScheduleForClassroom(cls.id))
//           )
//           const todaySchedules = schedules.flat().filter(item => item.day === today)
//           setTodaySchedule(todaySchedules)
//         }

//       } catch (err) {
//         console.error('Error fetching data:', err)
//         setError('Erreur lors du chargement des données')
//         toast.error('Erreur lors du chargement des données')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [user])

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-lg text-gray-600">Chargement de votre espace...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md max-w-md">
//           <p className="font-medium">{error}</p>
//           <p className="mt-2 text-sm">Veuillez réessayer plus tard ou contacter l'administration</p>
//         </div>
//       </div>
//     )
//   }

//   // Calculate statistics
//   const stats = [
//     { title: "Classes", value: classrooms.length, icon: <FaUsers className="text-2xl" /> },
//     { title: "Cours", value: courses.length, icon: <FaBook className="text-2xl" /> },
//     { title: "Élèves", value: classrooms.reduce((acc, cls) => acc + (cls.studentIds?.length || 0), 0), icon: <FaUserGraduate className="text-2xl" /> },
//     { title: "Cours aujourd'hui", value: todaySchedule.length, icon: <FaClock className="text-2xl" /> }
//   ]

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//             <FaChalkboardTeacher className="mr-2 text-blue-600" />
//             Tableau de bord enseignant
//           </h1>
//           <div className="flex items-center space-x-4">
//             <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
//               <FaBell />
//             </button>
//             <div className="flex items-center">
//               <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
//                 {user?.name.charAt(0)}
//               </div>
//               <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline">
//                 {user?.name}
//               </span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome section */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md overflow-hidden mb-8">
//           <div className="p-6 md:p-8 text-white">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//               <div>
//                 <h2 className="text-2xl font-bold mb-2">Bonjour, {user?.name}</h2>
//                 <p className="opacity-90 max-w-2xl">
//                   {teacherInfo?.statut === 'titulaire' 
//                     ? "Vous êtes enseignant titulaire dans notre établissement."
//                     : teacherInfo?.statut === 'remplacant'
//                     ? "Vous êtes actuellement enseignant remplaçant."
//                     : "Bienvenue dans votre espace enseignant."}
//                 </p>
//               </div>
//               <div className="mt-4 md:mt-0 bg-white/20 rounded-lg p-4">
//                 <p className="text-sm font-medium">Année scolaire 2023-2024</p>
//                 <p className="text-xl font-bold">Semestre 2</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <div key={index} className="bg-white rounded-lg shadow p-6">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm font-medium text-gray-500">{stat.title}</p>
//                   <p className="text-2xl font-bold mt-1">{stat.value}</p>
//                 </div>
//                 <div className="text-blue-600 bg-blue-50 p-3 rounded-full">
//                   {stat.icon}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Today's schedule */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//                 <h2 className="text-lg font-semibold flex items-center">
//                   <FaCalendarAlt className="mr-2 text-blue-600" />
//                   Emploi du temps aujourd'hui
//                 </h2>
//                 <span className="text-sm text-gray-500">
//                   {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
//                 </span>
//               </div>
//               <div className="divide-y divide-gray-200">
//                 {todaySchedule.length > 0 ? (
//                   todaySchedule.map((item, index) => (
//                     <div key={index} className="p-4 hover:bg-gray-50">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h3 className="font-medium">
//                             {courses.find(c => c.id === item.courseId)?.name || 'Cours'}
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {classrooms.find(c => c.id === item.classroom_id)?.name || 'Classe'}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium text-blue-600">
//                             {item.startTime} - {item.endTime}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">Salle {index + 1}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-8 text-center text-gray-500">
//                     <FaCalendarAlt className="mx-auto text-3xl mb-2 text-gray-300" />
//                     <p>Aucun cours prévu aujourd'hui</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Classes list */}
//           <div>
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="border-b border-gray-200 px-6 py-4">
//                 <h2 className="text-lg font-semibold flex items-center">
//                   <FaUsers className="mr-2 text-blue-600" />
//                   Mes classes
//                 </h2>
//               </div>
//               <div className="divide-y divide-gray-200">
//                 {classrooms.length > 0 ? (
//                   classrooms.map((classroom) => (
//                     <div key={classroom.id} className="p-4 hover:bg-gray-50">
//                       <h3 className="font-medium">{classroom.name}</h3>
//                       <div className="flex justify-between items-center mt-2">
//                         <span className="text-sm text-gray-500">
//                           {classroom.studentIds?.length || 0} élèves
//                         </span>
//                         <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
//                           {classroom.section}
//                         </span>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="p-8 text-center text-gray-500">
//                     <FaUsers className="mx-auto text-3xl mb-2 text-gray-300" />
//                     <p>Aucune classe assignée</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Quick actions */}
//             <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
//               <div className="border-b border-gray-200 px-6 py-4">
//                 <h2 className="text-lg font-semibold flex items-center">
//                   <FiHome className="mr-2 text-blue-600" />
//                   Accès rapide
//                 </h2>
//               </div>
//               <div className="p-4 grid grid-cols-2 gap-4">
//                 <a 
//                   href="#"
//                   className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-center"
//                 >
//                   <FiUser className="mx-auto text-blue-600 mb-1" />
//                   <span className="text-sm">Profil</span>
//                 </a>
//                 <a 
//                   href="#"
//                   className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-center"
//                 >
//                   <FiMail className="mx-auto text-blue-600 mb-1" />
//                   <span className="text-sm">Messages</span>
//                 </a>
//                 <a 
//                   href="/teachers/overview"
//                   className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-center"
//                 >
//                   <FaBook className="mx-auto text-blue-600 mb-1" />
//                   <span className="text-sm">Cours</span>
//                 </a>
//                 <a 
//                   href="/teachers/grades"
//                   className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-center"
//                 >
//                   <FaChartLine className="mx-auto text-blue-600 mb-1" />
//                   <span className="text-sm">Notes</span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
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
  FaClock,
  FaTimes
} from 'react-icons/fa'
import { FiHome, FiUser, FiMail, FiPhone } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { getAnnoncesForUser, Annonce } from '@/lib/annonce-db'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [teacherInfo, setTeacherInfo] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [annonces, setAnnonces] = useState<Annonce[]>([])
  const [hasNewAnnonces, setHasNewAnnonces] = useState(false)
  const [showAnnoncesModal, setShowAnnoncesModal] = useState(false)
  const [lastSeenAnnonceDate, setLastSeenAnnonceDate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || user.role !== 'enseignant') return
        
        // Fetch all data in parallel
        const [infoData, teacherCourses, teacherClassrooms, teacherAnnonces] = await Promise.all([
          getTeacherInfo(user.id),
          getCoursesForTeacher(user.id),
          getClassroomsForTeacher(user.id),
          getAnnoncesForUser('enseignant')
        ])

        setTeacherInfo(infoData)
       setCourses(teacherCourses)
setClassrooms(teacherClassrooms)
setAnnonces(teacherAnnonces.filter(a => a.target_roles.includes('enseignant')))

// Check for new annonces
const storedDate = localStorage.getItem('lastSeenAnnonceDate')
if (storedDate) {
    setLastSeenAnnonceDate(new Date(storedDate))
    const hasNew = teacherAnnonces.some(a => 
        new Date(a.created_at) > new Date(storedDate) && 
        a.target_roles.includes('enseignant')
    )
    setHasNewAnnonces(hasNew)
} else if (teacherAnnonces.length > 0) {
    setHasNewAnnonces(true)
}

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

  const handleBellClick = () => {
    setShowAnnoncesModal(true)
    setHasNewAnnonces(false)
    const now = new Date()
    setLastSeenAnnonceDate(now)
    localStorage.setItem('lastSeenAnnonceDate', now.toISOString())
  }

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
            <button 
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 relative"
              onClick={handleBellClick}
            >
              <FaBell />
              {hasNewAnnonces && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-blue-500 rounded-full"></span>
              )}
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

      {/* Annonces Modal */}
      {showAnnoncesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FaBell className="mr-2 text-blue-600" />
                Annonces importantes
              </h2>
              <button 
                onClick={() => setShowAnnoncesModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6">
              {annonces.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune annonce</h3>
                  <p className="mt-1 text-sm text-gray-500">Aucune annonce n'a été publiée pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {annonces.map(annonce => (
                    <div key={annonce.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-800">{annonce.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                              Publié par: {annonce.author_name} • 
                              {new Date(annonce.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {lastSeenAnnonceDate && new Date(annonce.created_at) > lastSeenAnnonceDate && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded-md">
                          {annonce.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowAnnoncesModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}