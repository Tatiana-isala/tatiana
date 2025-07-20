
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter, useParams } from 'next/navigation'
// import { 
//   getUserById,
//   getTeacherInfo,
//   getCoursesForTeacher,
//   getClassroomsForTeacher,
//   User,
//   TeacherInfo,
//   Course,
//   Classroom
// } from '@/lib/db'
// import { 
//   FaUserTie,
//   FaBook,
//   FaUsers,
//   FaPhone,
//   FaEnvelope,
//   FaChalkboardTeacher,
//   FaClock,
//   FaEdit,
//   FaArrowLeft,
//   FaBirthdayCake,
//   FaMapMarkerAlt,
//   FaVenusMars,
//   FaRing,
//   FaGraduationCap,
//   FaIdCard
// } from 'react-icons/fa'
// import { toast } from 'react-toastify'
// import Link from 'next/link'

// export default function ViewTeacherPage() {
//   const router = useRouter()
//   const { id } = useParams()
//   const [loading, setLoading] = useState(true)
//   const [teacher, setTeacher] = useState<User | null>(null)
//   const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null)
//   const [courses, setCourses] = useState<Course[]>([])
//   const [classrooms, setClassrooms] = useState<Classroom[]>([])
//   const [activeTab, setActiveTab] = useState('classes')

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
        
//         const userData = await getUserById(id as string)
//         if (!userData || userData.role !== 'enseignant') {
//           throw new Error('Enseignant non trouvé')
//         }
//         setTeacher(userData)
        
//         const [infoData, teacherCourses, teacherClassrooms] = await Promise.all([
//           getTeacherInfo(id as string),
//           getCoursesForTeacher(id as string),
//           getClassroomsForTeacher(id as string)
//         ])
        
//         const uniqueCourses = teacherCourses.filter(
//           (course, index, self) => index === self.findIndex(c => c.id === course.id)
//         )

//         setTeacherInfo(infoData)
//         setCourses(uniqueCourses)
//         setClassrooms(teacherClassrooms)
        
//       } catch (error) {
//         console.error('Erreur:', error)
//         toast.error('Erreur lors du chargement des données')
//         router.push('/enseignants')
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (id) {
//       fetchData()
//     }
//   }, [id, router])

//   const getStatusBadge = (statut: string) => {
//     const statusClasses = {
//       titulaire: 'bg-green-100 text-green-800',
//       remplacant: 'bg-blue-100 text-blue-800',
//       stagiaire: 'bg-yellow-100 text-yellow-800'
//     }
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//         statusClasses[statut as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
//       }`}>
//         {statut}
//       </span>
//     )
//   }

//   const getSituationBadge = (situation: string) => {
//     const situationClasses = {
//       CELIBATAIRE: 'bg-purple-100 text-purple-800',
//       MARIE: 'bg-pink-100 text-pink-800',
//       DIVORCE: 'bg-red-100 text-red-800',
//       VEUF: 'bg-gray-100 text-gray-800'
//     }
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//         situationClasses[situation as keyof typeof situationClasses] || 'bg-gray-100 text-gray-800'
//       }`}>
//         {situation}
//       </span>
//     )
//   }

//   const getGradeBadge = (grade: string) => {
//     const gradeClasses = {
//       LICENCE: 'bg-blue-100 text-blue-800',
//       MASTER: 'bg-green-100 text-green-800',
//       DIPLOME: 'bg-yellow-100 text-yellow-800',
//       DOCTORAT: 'bg-red-100 text-red-800',
//       AUTRE: 'bg-gray-100 text-gray-800'
//     }
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//         gradeClasses[grade as keyof typeof gradeClasses] || 'bg-gray-100 text-gray-800'
//       }`}>
//         {grade}
//       </span>
//     )
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('fr-FR')
//   }

//   if (loading && !teacher) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (!teacher) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-gray-500">Enseignant non trouvé</p>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-6">
//         <button 
//           onClick={() => router.back()}
//           className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
//         >
//           <FaArrowLeft className="mr-2" /> Retour à la liste
//         </button>
        
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               Fiche de l'enseignant: {teacher.name}
//             </h1>
//             <p className="text-gray-600">Détails complets de l'enseignant</p>
//           </div>
          
//           <div className="flex gap-2">
//             <Link
//               href={`/teacher/${id}/editer`}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               <FaEdit className="mr-2" /> Modifier
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="mb-4 border-b border-gray-200">
//         <nav className="flex space-x-4">
//           <button
//             onClick={() => setActiveTab('classes')}
//             className={`py-2 px-4 font-medium ${activeTab === 'classes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             <FaUsers className="inline mr-2" /> Classes
//           </button>
//           <button
//             onClick={() => setActiveTab('courses')}
//             className={`py-2 px-4 font-medium ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             <FaBook className="inline mr-2" /> Cours
//           </button>
//         </nav>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Colonne 1: Informations personnelles */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="bg-blue-600 px-6 py-4 text-white">
//             <h2 className="text-lg font-medium flex items-center">
//               <FaUserTie className="mr-2" /> Informations personnelles
//             </h2>
//           </div>
//           <div className="p-6">
//             <div className="flex items-center justify-center mb-6">
//               <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
//                 <FaUserTie className="text-blue-600 text-4xl" />
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Nom complet</h3>
//                 <p className="mt-1 text-sm text-gray-900">{teacher.name}</p>
//               </div>
              
//               {teacherInfo?.matricule && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaIdCard className="mr-2 text-gray-400" />
//                     Matricule
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-900">
//                     {teacherInfo.matricule}
//                   </p>
//                 </div>
//               )}
              
//               {teacherInfo?.dateNaissance && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaBirthdayCake className="mr-2 text-gray-400" />
//                     Date de naissance
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-900">
//                     {formatDate(teacherInfo.dateNaissance)}
//                   </p>
//                 </div>
//               )}
              
//               {teacherInfo?.sexe && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaVenusMars className="mr-2 text-gray-400" />
//                     Sexe
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-900">
//                     {teacherInfo.sexe === 'M' ? 'Masculin' : 'Féminin'}
//                   </p>
//                 </div>
//               )}
              
//               {teacherInfo?.situationMatrimoniale && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaRing className="mr-2 text-gray-400" />
//                     Situation matrimoniale
//                   </h3>
//                   <div className="mt-1">
//                     {getSituationBadge(teacherInfo.situationMatrimoniale)}
//                   </div>
//                 </div>
//               )}
              
//               {teacherInfo?.grade && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaGraduationCap className="mr-2 text-gray-400" />
//                     Grade académique
//                   </h3>
//                   <div className="mt-1">
//                     {getGradeBadge(teacherInfo.grade)}
//                   </div>
//                 </div>
//               )}
              
//               {teacherInfo?.adresse && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaMapMarkerAlt className="mr-2 text-gray-400" />
//                     Adresse
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-900">
//                     {teacherInfo.adresse}
//                   </p>
//                 </div>
//               )}
              
//               {teacher.email && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500 flex items-center">
//                     <FaEnvelope className="mr-2 text-gray-400" />
//                     Email
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-900">
//                     {teacher.email}
//                   </p>
//                 </div>
//               )}
              
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500 flex items-center">
//                   <FaPhone className="mr-2 text-gray-400" />
//                   Téléphone
//                 </h3>
//                 <p className="mt-1 text-sm text-gray-900">
//                   {teacher.phone}
//                 </p>
//               </div>
              
//               {teacherInfo?.statut && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Statut professionnel</h3>
//                   <div className="mt-1">
//                     {getStatusBadge(teacherInfo.statut)}
//                   </div>
//                 </div>
//               )}
              
//               {teacherInfo?.anneesExperience && (
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Années d'expérience</h3>
//                   <p className="mt-1 text-sm text-gray-900">
//                     {teacherInfo.anneesExperience} ans
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Colonne principale: Contenu dynamique selon l'onglet */}
//         <div className="lg:col-span-2">
//           {activeTab === 'classes' ? (
//             <div className="bg-white rounded-xl shadow-md overflow-hidden">
//               <div className="bg-blue-600 px-6 py-4 text-white">
//                 <h2 className="text-lg font-medium flex items-center">
//                   <FaUsers className="mr-2" /> Classes assignées ({classrooms.length})
//                 </h2>
//               </div>
//               <div className="p-6">
//                 {classrooms.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full">
//                       <thead>
//                         <tr className="bg-gray-100">
//                           <th className="py-2 px-4 text-left">Nom</th>
//                           <th className="py-2 px-4 text-left">Niveau</th>
//                           <th className="py-2 px-4 text-left">Section</th>
//                           <th className="py-2 px-4 text-left">Élèves</th>
//                           <th className="py-2 px-4 text-left">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {classrooms.map(classroom => (
//                           <tr key={`classroom-${classroom.id}`} className="hover:bg-gray-50">
//                             <td className="py-2 px-4 border-b">{classroom.name}</td>
//                             <td className="py-2 px-4 border-b">{classroom.level}ème</td>
//                             <td className="py-2 px-4 border-b">{classroom.section}</td>
//                             <td className="py-2 px-4 border-b">
//                               {classroom.studentIds?.length || 0}/{classroom.capacity}
//                             </td>
//                             <td className="py-2 px-4 border-b">
//                               <Link 
//                                 href={`/classes/${classroom.id}`}
//                                 className="text-blue-600 hover:text-blue-800 text-sm"
//                               >
//                                 Voir détails
//                               </Link>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <FaUsers className="mx-auto text-gray-300 text-4xl mb-2" />
//                     <p className="text-gray-500">Aucune classe assignée</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white rounded-xl shadow-md overflow-hidden">
//               <div className="bg-blue-600 px-6 py-4 text-white">
//                 <h2 className="text-lg font-medium flex items-center">
//                   <FaBook className="mr-2" /> Cours enseignés ({courses.length})
//                 </h2>
//               </div>
//               <div className="p-6">
//                 {courses.length > 0 ? (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {courses.map(course => (
//                       <div 
//                         key={`course-${course.id}`}
//                         className="border rounded-lg p-4 hover:shadow-md transition-shadow"
//                         style={{ borderLeft: `4px solid ${course.color}` }}
//                       >
//                         <h3 className="font-bold text-lg">{course.name}</h3>
//                         <div className="flex items-center mt-2">
//                           <div 
//                             className="w-4 h-4 rounded-full mr-2"
//                             style={{ backgroundColor: course.color }}
//                           ></div>
//                           <span className="text-xs text-gray-500">{course.color}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8">
//                     <FaBook className="mx-auto text-gray-300 text-4xl mb-2" />
//                     <p className="text-gray-500">Aucun cours assigné</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  getUserById,
  getTeacherInfo,
  getCoursesForTeacher,
  getClassroomsForTeacher,
  User,
  TeacherInfo,
  Course,
  Classroom
} from '@/lib/db'
import { 
  FaUserTie,
  FaBook,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaChalkboardTeacher,
  FaClock,
  FaEdit,
  FaArrowLeft,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaVenusMars,
  FaRing,
  FaGraduationCap,
  FaIdCard,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaInfoCircle
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function ViewTeacherPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [teacher, setTeacher] = useState<User | null>(null)
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [activeTab, setActiveTab] = useState('classes')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const userData = await getUserById(id as string)
        if (!userData || userData.role !== 'enseignant') {
          throw new Error('Enseignant non trouvé')
        }
        setTeacher(userData)
        
        const [infoData, teacherCourses, teacherClassrooms] = await Promise.all([
          getTeacherInfo(id as string),
          getCoursesForTeacher(id as string),
          getClassroomsForTeacher(id as string)
        ])
        
        const uniqueCourses = teacherCourses.filter(
          (course, index, self) => index === self.findIndex(c => c.id === course.id)
        )

        setTeacherInfo(infoData)
        setCourses(uniqueCourses)
        setClassrooms(teacherClassrooms)
        
      } catch (error) {
        console.error('Erreur:', error)
        toast.error('Erreur lors du chargement des données')
        router.push('/enseignants')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, router])

  const getStatusBadge = (statut: string) => {
    const statusClasses = {
      titulaire: 'bg-green-100 text-green-800',
      remplacant: 'bg-blue-100 text-blue-800',
      stagiaire: 'bg-yellow-100 text-yellow-800'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusClasses[statut as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
      }`}>
        {statut}
      </span>
    )
  }

  const getSituationBadge = (situation: string) => {
    const situationClasses = {
      CELIBATAIRE: 'bg-purple-100 text-purple-800',
      MARIE: 'bg-pink-100 text-pink-800',
      DIVORCE: 'bg-red-100 text-red-800',
      VEUF: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        situationClasses[situation as keyof typeof situationClasses] || 'bg-gray-100 text-gray-800'
      }`}>
        {situation}
      </span>
    )
  }

  const getGradeBadge = (grade: string) => {
    const gradeClasses = {
      LICENCE: 'bg-blue-100 text-blue-800',
      MASTER: 'bg-green-100 text-green-800',
      DIPLOME: 'bg-yellow-100 text-yellow-800',
      DOCTORAT: 'bg-red-100 text-red-800',
      AUTRE: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        gradeClasses[grade as keyof typeof gradeClasses] || 'bg-gray-100 text-gray-800'
      }`}>
        {grade}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR')
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
          <FaArrowLeft className="mr-2" /> Retour à la liste
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Fiche de l'enseignant: {teacher.name}
            </h1>
            <p className="text-gray-600">Détails complets de l'enseignant</p>
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/teacher/${id}/editer`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaEdit className="mr-2" /> Modifier
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('classes')}
            className={`py-2 px-4 font-medium ${activeTab === 'classes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FaUsers className="inline mr-2" /> Classes
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-4 font-medium ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FaBook className="inline mr-2" /> Cours
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne 1: Informations personnelles */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 text-white">
            <h2 className="text-lg font-medium flex items-center">
              <FaUserTie className="mr-2" /> Informations personnelles
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUserTie className="text-blue-600 text-4xl" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nom complet</h3>
                <p className="mt-1 text-sm text-gray-900 font-medium">{teacher.name}</p>
              </div>
              
              {teacherInfo?.matricule && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Matricule</h3>
                  <p className="mt-1 text-sm text-gray-900 font-medium">
                    {teacherInfo.matricule}
                  </p>
                </div>
              )}
              
              {teacher.email && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {teacher.email}
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-4"
              >
                {showDetails ? (
                  <>
                    <FaChevronUp className="mr-1" /> Masquer les détails
                  </>
                ) : (
                  <>
                    <FaChevronDown className="mr-1" /> Afficher plus de détails
                  </>
                )}
              </button>

              {showDetails && (
                <div className="mt-4 space-y-4 border-t pt-4">
                  {teacherInfo?.dateNaissance && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <FaBirthdayCake className="mr-2 text-gray-400" />
                        Date de naissance
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(teacherInfo.dateNaissance)}
                      </p>
                    </div>
                  )}
                  
                  {teacherInfo?.sexe && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <FaVenusMars className="mr-2 text-gray-400" />
                        Sexe
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {teacherInfo.sexe === 'M' ? 'Masculin' : 'Féminin'}
                      </p>
                    </div>
                  )}
                  
                  {teacherInfo?.situationMatrimoniale && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <FaRing className="mr-2 text-gray-400" />
                        Situation matrimoniale
                      </h3>
                      <div className="mt-1">
                        {getSituationBadge(teacherInfo.situationMatrimoniale)}
                      </div>
                    </div>
                  )}
                  
                  {teacherInfo?.grade && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <FaGraduationCap className="mr-2 text-gray-400" />
                        Grade académique
                      </h3>
                      <div className="mt-1">
                        {getGradeBadge(teacherInfo.grade)}
                      </div>
                    </div>
                  )}
                  
                  {teacherInfo?.adresse && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        Adresse
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {teacherInfo.adresse}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 flex items-center">
                      <FaPhone className="mr-2 text-gray-400" />
                      Téléphone
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {teacher.phone}
                    </p>
                  </div>
                  
                  {teacherInfo?.statut && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Statut professionnel</h3>
                      <div className="mt-1">
                        {getStatusBadge(teacherInfo.statut)}
                      </div>
                    </div>
                  )}
                  
                  {teacherInfo?.anneesExperience && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Années d'expérience</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {teacherInfo.anneesExperience} ans
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne principale: Contenu dynamique selon l'onglet */}
        <div className="lg:col-span-2">
          {activeTab === 'classes' ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4 text-white">
                <h2 className="text-lg font-medium flex items-center">
                  <FaUsers className="mr-2" /> Classes assignées ({classrooms.length})
                </h2>
              </div>
              <div className="p-6">
                {classrooms.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 text-left">Nom</th>
                          <th className="py-2 px-4 text-left">Niveau</th>
                          <th className="py-2 px-4 text-left">Section</th>
                          <th className="py-2 px-4 text-left">Élèves</th>
                          <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classrooms.map(classroom => (
                          <tr key={`classroom-${classroom.id}`} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{classroom.name}</td>
                            <td className="py-2 px-4 border-b">{classroom.level}ème</td>
                            <td className="py-2 px-4 border-b">{classroom.section}</td>
                            <td className="py-2 px-4 border-b">
                              {classroom.studentIds?.length || 0}/{classroom.capacity}
                            </td>
                            <td className="py-2 px-4 border-b">
                              <Link 
                                href={`/classes/${classroom.id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Voir détails
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaUsers className="mx-auto text-gray-300 text-4xl mb-2" />
                    <p className="text-gray-500">Aucune classe assignée</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4 text-white">
                <h2 className="text-lg font-medium flex items-center">
                  <FaBook className="mr-2" /> Cours enseignés ({courses.length})
                </h2>
              </div>
              <div className="p-6">
                {courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map(course => (
                      <div 
                        key={`course-${course.id}`}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                        style={{ 
                          borderLeft: `4px solid ${course.color || '#3b82f6'}`,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-gray-800">{course.name}</h3>
                          {/* <div>
                            <p className="text-sm text-gray-600 mt-1">{course.description || 'Pas de description'}</p>
                          </div> */}
                          <div 
                            className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                            style={{ backgroundColor: course.color || '#3b82f6' }}
                          />
                        </div>
                        
                        {/* <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaChalkboardTeacher className="mr-2" />
                            <span>Enseigné dans {course.classrooms?.length || 0} classes</span>
                          </div>
                          
                          {course.schedule && (
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaCalendarAlt className="mr-2" />
                              <span>{course.schedule}</span>
                            </div>
                          )}
                        </div> */}
                        
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                          <Link href='/courses'>
                          
                          <button 
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            onClick={() => {/* Ajouter une action pour voir les détails */}}
                          >
                            <FaInfoCircle className="mr-1" />
                            Détails
                          </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaBook className="mx-auto text-gray-300 text-4xl mb-2" />
                    <p className="text-gray-500">Aucun cours assigné</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}