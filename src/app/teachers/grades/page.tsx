
// 'use client'

// import { useState, useEffect } from 'react'
// import { v4 as uuidv4 } from 'uuid'
// import { useAuth } from '@/context/AuthContext'
// import { 
//   getCoursesForTeacher,
//   getClassroomsForTeacher,
//   getGradesByCourse,
//   createOrUpdateGrade,
//   getStudentsInClassroom,
//   getCourseAssignmentsForTeacher
// } from '@/lib/db'
// import { Classroom, Course, Student, Grade } from '@/lib/db'
// import { 
//   FaChartLine,
//   FaSave,
//   FaPercentage,
//   FaCheckCircle,
//   FaTimesCircle
// } from 'react-icons/fa'
// import { FiArrowLeft } from 'react-icons/fi'
// import { toast } from 'react-toastify'

// export default function GradeManagement() {
//   const { user } = useAuth()
//   const [courses, setCourses] = useState<Course[]>([])
//   const [classrooms, setClassrooms] = useState<Classroom[]>([])
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
//   const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
//   const [students, setStudents] = useState<Student[]>([])
//   const [grades, setGrades] = useState<Record<string, Grade>>({})
//   const [loading, setLoading] = useState(false)
//   const [courseClassrooms, setCourseClassrooms] = useState<Record<string, Classroom[]>>({})

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user) return
      
//       try {
//         setLoading(true)
        
//         const [teacherCourses, teacherClassrooms, assignments] = await Promise.all([
//           getCoursesForTeacher(user.id),
//           getClassroomsForTeacher(user.id),
//           getCourseAssignmentsForTeacher(user.id)
//         ])
        
//         setCourses(teacherCourses)
//         setClassrooms(teacherClassrooms)

//         const classroomsMap: Record<string, Classroom[]> = {}
//         teacherCourses.forEach(course => {
//           const courseAssignments = assignments.filter(ass => ass.courseId === course.id)
//           classroomsMap[course.id] = teacherClassrooms.filter(classroom => 
//             courseAssignments.some(ass => ass.classroom_id === classroom.id)
//           )
//         })

//         setCourseClassrooms(classroomsMap)
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         toast.error('Erreur lors du chargement des données')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [user])

//   useEffect(() => {
//     const fetchStudentsAndGrades = async () => {
//       if (!selectedCourse || !selectedClassroom) return
      
//       try {
//         setLoading(true)
//         const [classStudents, courseGrades] = await Promise.all([
//           getStudentsInClassroom(selectedClassroom.id),
//           getGradesByCourse(selectedCourse.id, selectedClassroom.id)
//         ])
        
//         setStudents(classStudents)
        
//         const gradesObj: Record<string, Grade> = {}
//         courseGrades.forEach(grade => {
//           gradesObj[grade.studentId] = grade
//         })
//         setGrades(gradesObj)
//       } catch (error) {
//         console.error('Error fetching students/grades:', error)
//         toast.error('Erreur lors du chargement des élèves/notes')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStudentsAndGrades()
//   }, [selectedCourse, selectedClassroom])

//   const handleGradeChange = (
//     studentId: string, 
//     field: 'P1' | 'P2' | 'Examen1' | 'P3' | 'P4' | 'Examen2',
//     value: string
//   ) => {
//     const numValue = value ? Math.min(100, Math.max(0, parseInt(value) || 0)) : undefined
    
//     setGrades(prevGrades => {
//       const existingGrade = prevGrades[studentId] || {
//         id: uuidv4(),
//         studentId,
//         courseId: selectedCourse?.id || '',
//         classroom_id: selectedClassroom?.id || '',
//         period: "unique",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }

//       return {
//         ...prevGrades,
//         [studentId]: {
//           ...existingGrade,
//           [field]: numValue
//         }
//       }
//     })
//   }

//   const saveGrades = async () => {
//     if (!selectedCourse || !selectedClassroom) return
    
//     try {
//       setLoading(true)
      
//       // Créer un tableau pour stocker les promesses
//       const savePromises: Promise<any>[] = []
      
//       // Parcourir tous les étudiants
//       students.forEach(student => {
//         const grade = grades[student.id]
        
//         // Vérifier si la note existe et contient des valeurs
//         if (grade) {
//           const hasGrades = 
//             grade.P1 !== undefined || 
//             grade.P2 !== undefined || 
//             grade.Examen1 !== undefined ||
//             grade.P3 !== undefined ||
//             grade.P4 !== undefined ||
//             grade.Examen2 !== undefined
          
//           if (hasGrades) {
//             savePromises.push(
//               createOrUpdateGrade({
//                 studentId: student.id,
//                 courseId: selectedCourse.id,
//                 classroom_id: selectedClassroom.id,
//                 period: "unique",
//                 P1: grade.P1,
//                 P2: grade.P2,
//                 Examen1: grade.Examen1,
//                 P3: grade.P3,
//                 P4: grade.P4,
//                 Examen2: grade.Examen2
//               })
//             )
//           }
//         }
//       })
      
//       // Attendre que toutes les notes soient enregistrées
//       await Promise.all(savePromises)
      
//       // Rafraîchir les données
//       const [classStudents, courseGrades] = await Promise.all([
//         getStudentsInClassroom(selectedClassroom.id),
//         getGradesByCourse(selectedCourse.id, selectedClassroom.id)
//       ])
      
//       setStudents(classStudents)
      
//       const gradesObj: Record<string, Grade> = {}
//       courseGrades.forEach(g => {
//         gradesObj[g.studentId] = g
//       })
//       setGrades(gradesObj)
      
//       toast.success('Notes enregistrées avec succès!')
//     } catch (error) {
//       console.error('Error saving grades:', error)
//       toast.error('Erreur lors de l\'enregistrement des notes')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const calculateStats = () => {
//     const gradeValues = Object.values(grades)
//     const successCount = gradeValues.filter(g => g.total !== undefined && g.total >= 50).length
//     const successRate = students.length > 0 ? Math.round((successCount / students.length) * 100) : 0
//     return { successCount, successRate }
//   }

//   const { successCount, successRate } = calculateStats()

//   if (loading && !courses.length) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (!selectedCourse) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6 flex items-center">
//           <FaChartLine className="mr-2" /> Gestion des notes
//         </h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.map(course => {
//             const associatedClassrooms = courseClassrooms[course.id] || []
            
//             return (
//               <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div 
//                   className="h-2" 
//                   style={{ backgroundColor: course.color || '#3b82f6' }}
//                 ></div>
//                 <div className="p-6">
//                   <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
//                   <p className="text-gray-600 mb-4">
//                     {associatedClassrooms.length} classe(s) associée(s)
//                   </p>
                  
//                   <div className="space-y-2">
//                     {associatedClassrooms.map(classroom => (
//                       <button
//                         key={classroom.id}
//                         onClick={() => {
//                           setSelectedCourse(course)
//                           setSelectedClassroom(classroom)
//                         }}
//                         className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex justify-between items-center"
//                       >
//                         <span>{classroom.name}</span>
//                         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                           {classroom.studentIds?.length || 0} élèves
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-6">
//         <button
//           onClick={() => setSelectedCourse(null)}
//           className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
//         >
//           <FiArrowLeft className="mr-2" /> Retour aux cours
//         </button>
        
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold flex items-center">
//               <FaChartLine className="mr-2" /> Gestion des notes
//             </h1>
//             <p className="text-gray-600">
//               {selectedCourse.name} - {selectedClassroom?.name}
//             </p>
//           </div>
          
//           <button
//             onClick={saveGrades}
//             disabled={loading}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
//           >
//             <FaSave className="mr-2" /> {loading ? 'Enregistrement...' : 'Enregistrer'}
//           </button>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//         <div className="flex flex-wrap items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <FaPercentage className="text-blue-600" />
//               <span>Taux de réussite: <strong>{successRate}%</strong></span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <FaCheckCircle className="text-green-600" />
//               <span>Réussite: <strong>{successCount}/{students.length}</strong></span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <FaTimesCircle className="text-red-600" />
//               <span>Échec: <strong>{students.length - successCount}/{students.length}</strong></span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tableau des notes */}
//       <div className="overflow-x-auto bg-white rounded-lg shadow-md">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Élève
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 P1
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 P2
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Ex1
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 S1
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 P3
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 P4
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Ex2
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 S2
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total
//               </th>
//               <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Appréciation
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {students.map((student) => {
//               const grade = grades[student.id] || {}
//               const S1 = grade.P1 !== undefined && grade.P2 !== undefined && grade.Examen1 !== undefined
//                 ? Math.round((grade.P1 * 0.3 + grade.P2 * 0.3 + grade.Examen1 * 0.4))
//                 : undefined
//               const S2 = grade.P3 !== undefined && grade.P4 !== undefined && grade.Examen2 !== undefined
//                 ? Math.round((grade.P3 * 0.3 + grade.P4 * 0.3 + grade.Examen2 * 0.4))
//                 : undefined
//               const total = S1 !== undefined && S2 !== undefined ? Math.round((S1 + S2) / 2) : undefined
//               const appreciation = total !== undefined ? 
//                 total >= 80 ? "Excellent" :
//                 total >= 70 ? "Très bien" :
//                 total >= 60 ? "Bien" :
//                 total >= 50 ? "Satisfaisant" :
//                 total >= 30 ? "Insuffisant" : "Médiocre"
//                 : ""

//               return (
//                 <tr key={student.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
//                         {student.prenom?.charAt(0)}{student.nom?.charAt(0)}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {student.prenom} {student.nom}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {student.matricule}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap">
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={grade.P1 ?? ''}
//                       onChange={(e) => handleGradeChange(student.id, 'P1', e.target.value)}
//                       className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
//                       onBlur={() => {
//                         // Calculer S1 automatiquement
//                         const newGrade = {...grades[student.id]}
//                         if (newGrade.P1 !== undefined && newGrade.P2 !== undefined && newGrade.Examen1 !== undefined) {
//                           newGrade.S1 = Math.round((newGrade.P1 * 0.3 + newGrade.P2 * 0.3 + newGrade.Examen1 * 0.4))
//                         }
//                         setGrades(prev => ({...prev, [student.id]: newGrade}))
//                       }}
//                     />
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap">
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={grade.P2 ?? ''}
//                       onChange={(e) => handleGradeChange(student.id, 'P2', e.target.value)}
//                       className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
//                       onBlur={() => {
//                         const newGrade = {...grades[student.id]}
//                         if (newGrade.P1 !== undefined && newGrade.P2 !== undefined && newGrade.Examen1 !== undefined) {
//                           newGrade.S1 = Math.round((newGrade.P1 * 0.3 + newGrade.P2 * 0.3 + newGrade.Examen1 * 0.4))
//                         }
//                         setGrades(prev => ({...prev, [student.id]: newGrade}))
//                       }}
//                     />
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap">
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={grade.Examen1 ?? ''}
//                       onChange={(e) => handleGradeChange(student.id, 'Examen1', e.target.value)}
//                       className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
//                       onBlur={() => {
//                         const newGrade = {...grades[student.id]}
//                         if (newGrade.P1 !== undefined && newGrade.P2 !== undefined && newGrade.Examen1 !== undefined) {
//                           newGrade.S1 = Math.round((newGrade.P1 * 0.3 + newGrade.P2 * 0.3 + newGrade.Examen1 * 0.4))
//                         }
//                         setGrades(prev => ({...prev, [student.id]: newGrade}))
//                       }}
//                     />
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
//                     {S1 !== undefined ? S1 : '-'}
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap">
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={grade.P3 ?? ''}
//                       onChange={(e) => handleGradeChange(student.id, 'P3', e.target.value)}
//                       className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
//                       onBlur={() => {
//                         const newGrade = {...grades[student.id]}
//                         if (newGrade.P3 !== undefined && newGrade.P4 !== undefined && newGrade.Examen2 !== undefined) {
//                           newGrade.S2 = Math.round((newGrade.P3 * 0.3 + newGrade.P4 * 0.3 + newGrade.Examen2 * 0.4))
//                         }
//                         setGrades(prev => ({...prev, [student.id]: newGrade}))
//                       }}
//                     />
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap">
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={grade.P4 ?? ''}
//                       onChange={(e) => handleGradeChange(student.id, 'P4', e.target.value)}
//                       className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
//                       onBlur={() => {
//                         const newGrade = {...grades[student.id]}
//                         if (newGrade.P3 !== undefined && newGrade.P4 !== undefined && newGrade.Examen2 !== undefined) {
//                           newGrade.S2 = Math.round((newGrade.P3 * 0.3 + newGrade.P4 * 0.3 + newGrade.Examen2 * 0.4))
//                         }
//                         setGrades(prev => ({...prev, [student.id]: newGrade}))
//                       }}
//                     />
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap">
//                     <input
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={grade.Examen2 ?? ''}
//                       onChange={(e) => handleGradeChange(student.id, 'Examen2', e.target.value)}
//                       className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
//                       onBlur={() => {
//                         const newGrade = {...grades[student.id]}
//                         if (newGrade.P3 !== undefined && newGrade.P4 !== undefined && newGrade.Examen2 !== undefined) {
//                           newGrade.S2 = Math.round((newGrade.P3 * 0.3 + newGrade.P4 * 0.3 + newGrade.Examen2 * 0.4))
//                         }
//                         setGrades(prev => ({...prev, [student.id]: newGrade}))
//                       }}
//                     />
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
//                     {S2 !== undefined ? S2 : '-'}
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-bold">
//                     {total !== undefined ? total : '-'}
//                   </td>
//                   <td className="px-2 py-4 whitespace-nowrap text-center text-sm">
//                     {appreciation && (
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         total !== undefined && total >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {appreciation}
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/context/AuthContext'
import { 
  getCoursesForTeacher,
  getClassroomsForTeacher,
  getGradesByCourse,
  createOrUpdateGrade,
  getStudentsInClassroom,
  getCourseAssignmentsForTeacher
} from '@/lib/db'
import { Classroom, Course, Student, Grade } from '@/lib/db'
import { 
  FaChartLine,
  FaSave,
  FaPercentage,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa'
import { FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function GradeManagement() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Record<string, Grade>>({})
  const [loading, setLoading] = useState(false)
  const [courseClassrooms, setCourseClassrooms] = useState<Record<string, Classroom[]>>({})

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        const [teacherCourses, teacherClassrooms, assignments] = await Promise.all([
          getCoursesForTeacher(user.id),
          getClassroomsForTeacher(user.id),
          getCourseAssignmentsForTeacher(user.id)
        ])
        
        setCourses(teacherCourses)
        setClassrooms(teacherClassrooms)

        const classroomsMap: Record<string, Classroom[]> = {}
        teacherCourses.forEach(course => {
          const courseAssignments = assignments.filter(ass => ass.courseId === course.id)
          classroomsMap[course.id] = teacherClassrooms.filter(classroom => 
            courseAssignments.some(ass => ass.classroom_id === classroom.id)
          )
        })

        setCourseClassrooms(classroomsMap)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  useEffect(() => {
    const fetchStudentsAndGrades = async () => {
      if (!selectedCourse || !selectedClassroom) return
      
      try {
        setLoading(true)
        const classStudents = await getStudentsInClassroom(selectedClassroom.id)
        
        // Remove duplicate students by creating a map of unique IDs
        const uniqueStudentsMap = new Map<string, Student>()
        classStudents.forEach(student => {
          if (!uniqueStudentsMap.has(student.id)) {
            uniqueStudentsMap.set(student.id, student)
          }
        })
        const uniqueStudents = Array.from(uniqueStudentsMap.values())
        
        const courseGrades = await getGradesByCourse(selectedCourse.id, selectedClassroom.id)
        
        setStudents(uniqueStudents)
        
        const gradesObj: Record<string, Grade> = {}
        courseGrades.forEach(grade => {
          gradesObj[grade.studentId] = grade
        })
        setGrades(gradesObj)
      } catch (error) {
        console.error('Error fetching students/grades:', error)
        toast.error('Erreur lors du chargement des élèves/notes')
      } finally {
        setLoading(false)
      }
    }

    fetchStudentsAndGrades()
  }, [selectedCourse, selectedClassroom])

  const handleGradeChange = (
    studentId: string, 
    field: 'P1' | 'P2' | 'Examen1' | 'P3' | 'P4' | 'Examen2',
    value: string
  ) => {
    const numValue = value ? Math.min(100, Math.max(0, parseInt(value) || 0)) : undefined
    
    setGrades(prevGrades => {
      const existingGrade = prevGrades[studentId] || {
        id: uuidv4(),
        studentId,
        courseId: selectedCourse?.id || '',
        classroom_id: selectedClassroom?.id || '',
        period: "unique",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return {
        ...prevGrades,
        [studentId]: {
          ...existingGrade,
          [field]: numValue
        }
      }
    })
  }

  const saveGrades = async () => {
    if (!selectedCourse || !selectedClassroom) return
    
    try {
      setLoading(true)
      
      const savePromises: Promise<any>[] = []
      
      students.forEach(student => {
        const grade = grades[student.id]
        
        if (grade) {
          const hasGrades = 
            grade.P1 !== undefined || 
            grade.P2 !== undefined || 
            grade.Examen1 !== undefined ||
            grade.P3 !== undefined ||
            grade.P4 !== undefined ||
            grade.Examen2 !== undefined
          
          if (hasGrades) {
            savePromises.push(
              createOrUpdateGrade({
                studentId: student.id,
                courseId: selectedCourse.id,
                classroom_id: selectedClassroom.id,
                period: "unique",
                P1: grade.P1,
                P2: grade.P2,
                Examen1: grade.Examen1,
                P3: grade.P3,
                P4: grade.P4,
                Examen2: grade.Examen2
              })
            )
          }
        }
      })
      
      await Promise.all(savePromises)
      
      const [classStudents, courseGrades] = await Promise.all([
        getStudentsInClassroom(selectedClassroom.id),
        getGradesByCourse(selectedCourse.id, selectedClassroom.id)
      ])
      
      // Remove duplicates again
      const uniqueStudentsMap = new Map<string, Student>()
      classStudents.forEach(student => {
        if (!uniqueStudentsMap.has(student.id)) {
          uniqueStudentsMap.set(student.id, student)
        }
      })
      setStudents(Array.from(uniqueStudentsMap.values()))
      
      const gradesObj: Record<string, Grade> = {}
      courseGrades.forEach(g => {
        gradesObj[g.studentId] = g
      })
      setGrades(gradesObj)
      
      toast.success('Notes enregistrées avec succès!')
    } catch (error) {
      console.error('Error saving grades:', error)
      toast.error('Erreur lors de l\'enregistrement des notes')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const gradeValues = Object.values(grades)
    const successCount = gradeValues.filter(g => g.total !== undefined && g.total >= 50).length
    const successRate = students.length > 0 ? Math.round((successCount / students.length) * 100) : 0
    return { successCount, successRate }
  }

  const { successCount, successRate } = calculateStats()

  if (loading && !courses.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!selectedCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <FaChartLine className="mr-2" /> Gestion des notes
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const associatedClassrooms = courseClassrooms[course.id] || []
            
            return (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="h-2" 
                  style={{ backgroundColor: course.color || '#3b82f6' }}
                ></div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                  <p className="text-gray-600 mb-4">
                    {associatedClassrooms.length} classe(s) associée(s)
                  </p>
                  
                  <div className="space-y-2">
                    {associatedClassrooms.map(classroom => (
                      <button
                        key={`${course.id}-${classroom.id}`}
                        onClick={() => {
                          setSelectedCourse(course)
                          setSelectedClassroom(classroom)
                        }}
                        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex justify-between items-center"
                      >
                        <span>{classroom.name}</span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {classroom.studentIds?.length || 0} élèves
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => setSelectedCourse(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Retour aux cours
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <FaChartLine className="mr-2" /> Gestion des notes
            </h1>
            <p className="text-gray-600">
              {selectedCourse.name} - {selectedClassroom?.name}
            </p>
          </div>
          
          <button
            onClick={saveGrades}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            <FaSave className="mr-2" /> {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaPercentage className="text-blue-600" />
              <span>Taux de réussite: <strong>{successRate}%</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="text-green-600" />
              <span>Réussite: <strong>{successCount}/{students.length}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <FaTimesCircle className="text-red-600" />
              <span>Échec: <strong>{students.length - successCount}/{students.length}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Élève
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                P1
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                P2
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ex1
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                S1
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                P3
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                P4
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ex2
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                S2
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appréciation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => {
              const grade = grades[student.id] || {}
              const S1 = grade.P1 !== undefined && grade.P2 !== undefined && grade.Examen1 !== undefined
                ? Math.round((grade.P1 * 0.3 + grade.P2 * 0.3 + grade.Examen1 * 0.4))
                : undefined
              const S2 = grade.P3 !== undefined && grade.P4 !== undefined && grade.Examen2 !== undefined
                ? Math.round((grade.P3 * 0.3 + grade.P4 * 0.3 + grade.Examen2 * 0.4))
                : undefined
              const total = S1 !== undefined && S2 !== undefined ? Math.round((S1 + S2) / 2) : undefined
              const appreciation = total !== undefined ? 
                total >= 80 ? "Excellent" :
                total >= 70 ? "Très bien" :
                total >= 60 ? "Bien" :
                total >= 50 ? "Satisfaisant" :
                total >= 30 ? "Insuffisant" : "Médiocre"
                : ""

              return (
                <tr key={`${student.id}-${selectedCourse?.id}-${selectedClassroom?.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {student.prenom?.charAt(0)}{student.nom?.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.prenom} {student.nom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.matricule}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.P1 ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'P1', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                      onBlur={() => {
                        const newGrade = {...grades[student.id]}
                        if (newGrade.P1 !== undefined && newGrade.P2 !== undefined && newGrade.Examen1 !== undefined) {
                          newGrade.S1 = Math.round((newGrade.P1 * 0.3 + newGrade.P2 * 0.3 + newGrade.Examen1 * 0.4))
                        }
                        setGrades(prev => ({...prev, [student.id]: newGrade}))
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.P2 ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'P2', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                      onBlur={() => {
                        const newGrade = {...grades[student.id]}
                        if (newGrade.P1 !== undefined && newGrade.P2 !== undefined && newGrade.Examen1 !== undefined) {
                          newGrade.S1 = Math.round((newGrade.P1 * 0.3 + newGrade.P2 * 0.3 + newGrade.Examen1 * 0.4))
                        }
                        setGrades(prev => ({...prev, [student.id]: newGrade}))
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.Examen1 ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'Examen1', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                      onBlur={() => {
                        const newGrade = {...grades[student.id]}
                        if (newGrade.P1 !== undefined && newGrade.P2 !== undefined && newGrade.Examen1 !== undefined) {
                          newGrade.S1 = Math.round((newGrade.P1 * 0.3 + newGrade.P2 * 0.3 + newGrade.Examen1 * 0.4))
                        }
                        setGrades(prev => ({...prev, [student.id]: newGrade}))
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {S1 !== undefined ? S1 : '-'}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.P3 ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'P3', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                      onBlur={() => {
                        const newGrade = {...grades[student.id]}
                        if (newGrade.P3 !== undefined && newGrade.P4 !== undefined && newGrade.Examen2 !== undefined) {
                          newGrade.S2 = Math.round((newGrade.P3 * 0.3 + newGrade.P4 * 0.3 + newGrade.Examen2 * 0.4))
                        }
                        setGrades(prev => ({...prev, [student.id]: newGrade}))
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.P4 ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'P4', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                      onBlur={() => {
                        const newGrade = {...grades[student.id]}
                        if (newGrade.P3 !== undefined && newGrade.P4 !== undefined && newGrade.Examen2 !== undefined) {
                          newGrade.S2 = Math.round((newGrade.P3 * 0.3 + newGrade.P4 * 0.3 + newGrade.Examen2 * 0.4))
                        }
                        setGrades(prev => ({...prev, [student.id]: newGrade}))
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade.Examen2 ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'Examen2', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                      onBlur={() => {
                        const newGrade = {...grades[student.id]}
                        if (newGrade.P3 !== undefined && newGrade.P4 !== undefined && newGrade.Examen2 !== undefined) {
                          newGrade.S2 = Math.round((newGrade.P3 * 0.3 + newGrade.P4 * 0.3 + newGrade.Examen2 * 0.4))
                        }
                        setGrades(prev => ({...prev, [student.id]: newGrade}))
                      }}
                    />
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {S2 !== undefined ? S2 : '-'}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-bold">
                    {total !== undefined ? total : '-'}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-center text-sm">
                    {appreciation && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        total !== undefined && total >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {appreciation}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}