
// 'use client'

// import { useEffect, useState } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { 
//   Student, 
//   getStudentByTutorId, 
//   getClassroomForStudent,
//   getStudentGrades,
//   getCoursesForClassroom,
//   getStudentPayments,
//   getFeeStructure,
//   Course,
//   Grade,
//   Payment,
//   FeeStructure
// } from '@/lib/db'
// import { 
//   FiUser, 
//   FiBook, 
//   FiCalendar, 
//   FiAward, 
//   FiHome, 
//   FiPhone, 
//   FiMail,
//   FiCheckCircle,
//   FiXCircle,
//   FiBarChart2,
//   FiDownload,
//   FiDollarSign,
//   FiCreditCard,
//   FiPieChart
// } from 'react-icons/fi'
// import { PdfReportGenerator } from '@/components/PdfReportGenerator'

// export default function ParentPage() {
//   const { user } = useAuth()
//   const [students, setStudents] = useState<Student[]>([])
//   const [classrooms, setClassrooms] = useState<Record<string, any>>({})
//   const [grades, setGrades] = useState<Record<string, Grade[]>>({})
//   const [payments, setPayments] = useState<Record<string, Payment[]>>({})
//   const [feeStructures, setFeeStructures] = useState<Record<string, FeeStructure>>({})
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState<Record<string, string>>({})
//   const [courses, setCourses] = useState<Record<string, Course>>({})

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         if (!user || user.role !== 'parent') return;
      
//         const studentsData = await getStudentByTutorId(user.id)
//         setStudents(studentsData)

//         // Initialize active tabs
//         const tabs: Record<string, string> = {}
//         studentsData.forEach(student => {
//             tabs[student.id] = 'info'
//         })
//         setActiveTab(tabs)

//         // Fetch all data in parallel
//         const [classResults, gradeResults, paymentResults, feeStructureResults] = await Promise.all([
//           Promise.all(studentsData.map(student => getClassroomForStudent(student.id))),
//           Promise.all(studentsData.map(student => getStudentGrades(student.id))),
//           Promise.all(studentsData.map(student => getStudentPayments(student.id))),
//           Promise.all(studentsData.map(async student => {
//             const classroom = await getClassroomForStudent(student.id)
//             return classroom ? getFeeStructure(classroom.id) : null
//           }))
//         ])

//         // Get courses for each classroom
//         const coursePromises = classResults.map(classroom => 
//             classroom ? getCoursesForClassroom(classroom.id) : Promise.resolve([])
//         )
//         const courseResults = await Promise.all(coursePromises)

//         // Process all data
//         const classMap: Record<string, any> = {}
//         const gradeMap: Record<string, Grade[]> = {}
//         const paymentMap: Record<string, Payment[]> = {}
//         const feeStructureMap: Record<string, FeeStructure> = {}
//         const courseMap: Record<string, Course> = {}

//         classResults.forEach((classroom, index) => {
//             if (classroom) {
//                 classMap[studentsData[index].id] = classroom
//             }
//         })

//         gradeResults.forEach((studentGrades, index) => {
//             gradeMap[studentsData[index].id] = studentGrades
//         })

//         paymentResults.forEach((studentPayments, index) => {
//             paymentMap[studentsData[index].id] = studentPayments
//         })

//         feeStructureResults.forEach((feeStructure, index) => {
//             if (feeStructure) {
//                 feeStructureMap[studentsData[index].id] = feeStructure
//             }
//         })

//         courseResults.forEach((courses, index) => {
//             courses.forEach(course => {
//                 courseMap[course.id] = course
//             })
//         })

//         setClassrooms(classMap)
//         setGrades(gradeMap)
//         setPayments(paymentMap)
//         setFeeStructures(feeStructureMap)
//         setCourses(courseMap)
//       } catch (err) {
//         console.error('Error:', err)
//         setError('Erreur lors du chargement des données')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStudents()
//   }, [user])

//   const calculateStudentAverage = (studentId: string): number | null => {
//     const studentGrades = grades[studentId]
//     if (!studentGrades || studentGrades.length === 0) return null
    
//     const validGrades = studentGrades
//       .map(grade => grade.total)
//       .filter(total => total !== undefined) as number[]
    
//     if (validGrades.length === 0) return null
    
//     const sum = validGrades.reduce((acc, curr) => acc + curr, 0)
//     return Math.round(sum / validGrades.length)
//   }

//   const calculateFinancialStatus = (studentId: string) => {
//     const feeStructure = feeStructures[studentId]
//     const studentPayments = payments[studentId] || []
    
//     if (!feeStructure) {
//       return {
//         totalDue: 0,
//         totalPaid: 0,
//         balance: 0,
//         scolairePaid: 0,
//         minervalPaid: 0,
//         connexePaid: 0
//       }
//     }

//     const totalDue = feeStructure.schoolFee + feeStructure.minerval + feeStructure.otherFees
//     const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0)
    
//     const scolairePaid = studentPayments
//       .filter(p => p.feeType === 'SCOLAIRE')
//       .reduce((sum, p) => sum + p.amount, 0)
    
//     const minervalPaid = studentPayments
//       .filter(p => p.feeType === 'MINERVAL')
//       .reduce((sum, p) => sum + p.amount, 0)
    
//     const connexePaid = studentPayments
//       .filter(p => p.feeType === 'FRAIS_CONNEXE')
//       .reduce((sum, p) => sum + p.amount, 0)

//     return {
//       totalDue,
//       totalPaid,
//       balance: totalDue - totalPaid,
//       scolairePaid,
//       minervalPaid,
//       connexePaid
//     }
//   }

//   const handleDownloadReport = (student: Student) => {
//     if (!classrooms[student.id]) return
    
//     PdfReportGenerator.generateReport({
//       student,
//       classroom: classrooms[student.id],
//       courses: [], // We don't have courses here, but the generator will use grades
//       grades: grades[student.id]?.reduce((acc, grade) => {
//         acc[grade.courseId] = grade
//         return acc
//       }, {} as Record<string, Grade>) || {}
//     })
//   }

//   const handleTabChange = (studentId: string, tab: string) => {
//     setActiveTab(prev => ({
//       ...prev,
//       [studentId]: tab
//     }))
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-lg">Chargement en cours...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mes Enfants</h1>
//           <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
//             {students.length} {students.length > 1 ? 'enfants' : 'enfant'}
//           </div>
//         </div>
        
//         {students.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <div className="text-gray-400 mb-4">
//               <FiUser className="inline-block text-4xl" />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun élève associé</h2>
//             <p className="text-gray-500">Vos enfants n'ont pas encore été enregistrés dans le système.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {students.map(student => {
//               const classroom = classrooms[student.id]
//               const birthDate = new Date(student.date_naissance)
//               const age = new Date().getFullYear() - birthDate.getFullYear()
//               const studentAverage = calculateStudentAverage(student.id)
//               const isSuccess = studentAverage !== null && studentAverage >= 50
//               const financialStatus = calculateFinancialStatus(student.id)
              
//               return (
//                 <div key={student.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                   <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
//                     <div className="flex items-center space-x-3">
//                       <div className="bg-white/20 rounded-full p-2">
//                         <FiUser className="text-xl" />
//                       </div>
//                       <div>
//                         <h2 className="font-bold text-lg">
//                           {student.prenom} {student.nom} {student.post_nom}
//                         </h2>
//                         <p className="text-sm opacity-90">{student.matricule}</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="border-b border-gray-200">
//                     <nav className="flex -mb-px">
//                       <button
//                         onClick={() => handleTabChange(student.id, 'info')}
//                         className={`py-4 px-4 text-center border-b-2 font-medium text-sm ${activeTab[student.id] === 'info' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
//                       >
//                         Infos
//                       </button>
//                       <button
//                         onClick={() => handleTabChange(student.id, 'results')}
//                         className={`py-4 px-4 text-center border-b-2 font-medium text-sm ${activeTab[student.id] === 'results' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
//                       >
//                         Résultats
//                       </button>
//                       <button
//                         onClick={() => handleTabChange(student.id, 'finance')}
//                         className={`py-4 px-4 text-center border-b-2 font-medium text-sm ${activeTab[student.id] === 'finance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
//                       >
//                         Finances
//                       </button>
//                     </nav>
//                   </div>
                  
//                   <div className="p-5">
//                     {activeTab[student.id] === 'info' ? (
//                       <>
//                         <div className="mb-4">
//                           <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
//                             <FiBook className="mr-2 text-blue-500" />
//                             Informations Scolaires
//                           </h3>
//                           <div className="space-y-2 pl-6">
//                             <p className="text-sm">
//                               <span className="font-medium">Classe:</span> {classroom?.name || 'Non assigné'}
//                             </p>
//                             <p className="text-sm">
//                               <span className="font-medium">Section:</span> {classroom?.section || 'Non spécifié'}
//                             </p>
//                             <p className="text-sm">
//                               <span className="font-medium">Niveau:</span> {student.niveau_etude}
//                             </p>
//                             <p className="text-sm">
//                               <span className="font-medium">Option:</span> {student.option_choisie}
//                             </p>
//                           </div>
//                         </div>
                        
//                         <div className="mb-4">
//                           <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
//                             <FiUser className="mr-2 text-blue-500" />
//                             Informations Personnelles
//                           </h3>
//                           <div className="space-y-2 pl-6">
//                             <p className="text-sm">
//                               <span className="font-medium">Âge:</span> {age} ans
//                             </p>
//                             <p className="text-sm">
//                               <span className="font-medium">Né(e) le:</span> {birthDate.toLocaleDateString()}
//                             </p>
//                             <p className="text-sm">
//                               <span className="font-medium">Lieu de naissance:</span> {student.lieu_naissance}
//                             </p>
//                             <p className="text-sm">
//                               <span className="font-medium">Sexe:</span> {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
//                             </p>
//                           </div>
//                         </div>
                        
//                         <div>
//                           <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
//                             <FiHome className="mr-2 text-blue-500" />
//                             Contact
//                           </h3>
//                           <div className="space-y-2 pl-6">
//                             <p className="text-sm">
//                               <span className="font-medium">Adresse:</span> {student.adresse}
//                             </p>
//                             {student.contacts.map((contact, index) => (
//                               <p key={index} className="text-sm flex items-center">
//                                 <FiPhone className="mr-1 text-gray-500" />
//                                 {contact}
//                               </p>
//                             ))}
//                           </div>
//                         </div>
//                       </>
//                     ) : activeTab[student.id] === 'results' ? (
//                       <div>
//                         <div className="flex justify-between items-center mb-4">
//                           <h3 className="font-semibold text-gray-700 flex items-center">
//                             <FiAward className="mr-2 text-blue-500" />
//                             Résultats Scolaires
//                           </h3>
//                           {studentAverage !== null && (
//                             <div className="flex items-center">
//                               <span className="text-sm font-medium mr-2">Moyenne:</span>
//                               <span className={`px-2 py-1 rounded-md text-sm font-bold ${
//                                 isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                               }`}>
//                                 {studentAverage}
//                               </span>
//                               {isSuccess ? (
//                                 <FiCheckCircle className="ml-2 text-green-500" />
//                               ) : (
//                                 <FiXCircle className="ml-2 text-red-500" />
//                               )}
//                             </div>
//                           )}
//                         </div>
                        
//                         {grades[student.id]?.length ? (
//                           <div className="space-y-4">
//                             <div className="overflow-x-auto">
//                               <table className="min-w-full divide-y divide-gray-200">
//                                 <thead className="bg-gray-50">
//                                   <tr>
//                                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Cours
//                                     </th>
//                                     <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       P1
//                                     </th>
//                                     <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       P2
//                                     </th>
//                                     <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Ex1
//                                     </th>
//                                     <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       S1
//                                     </th>
//                                     <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       P3
//                                     </th>
//                                     <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       P4
//                                     </th>
//                                     <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Ex2
//                                     </th>
//                                     <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       S2
//                                     </th>
//                                     <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                       Total
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="bg-white divide-y divide-gray-200">
//                                   {grades[student.id]?.map((grade, index) => {
//                                     const courseName = courses[grade.courseId]?.name || grade.courseId.split('-')[0]
                                    
//                                     return (
//                                       <tr key={index}>
//                                         <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
//                                           {courseName}
//                                         </td>
//                                         <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
//                                           {grade.P1 ?? '-'}
//                                         </td>
//                                         <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
//                                           {grade.P2 ?? '-'}
//                                         </td>
//                                         <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
//                                           {grade.Examen1 ?? '-'}
//                                         </td>
//                                         <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
//                                           {grade.S1 ?? '-'}
//                                         </td>
//                                         <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
//                                           {grade.P3 ?? '-'}
//                                         </td>
//                                         <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
//                                           {grade.P4 ?? '-'}
//                                         </td>
//                                         <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
//                                           {grade.Examen2 ?? '-'}
//                                         </td>
//                                         <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
//                                           {grade.S2 ?? '-'}
//                                         </td>
//                                         <td className={`px-4 py-2 whitespace-nowrap text-center text-sm font-bold ${
//                                           grade.total && grade.total >= 50 ? 'text-green-600' : 'text-red-600'
//                                         }`}>
//                                           {grade.total ?? '-'}
//                                         </td>
//                                       </tr>
//                                     )
//                                   })}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="text-center py-8 text-gray-500">
//                             <FiBarChart2 className="mx-auto text-3xl mb-2" />
//                             <p>Aucun résultat disponible pour le moment</p>
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <div>
//                         <div className="flex justify-between items-center mb-4">
//                           <h3 className="font-semibold text-gray-700 flex items-center">
//                             <FiDollarSign className="mr-2 text-blue-500" />
//                             Situation Financière
//                           </h3>
//                           <div className="flex items-center">
//                             <span className="text-sm font-medium mr-2">Solde:</span>
//                             <span className={`px-2 py-1 rounded-md text-sm font-bold ${
//                               financialStatus.balance <= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                             }`}>
//                               {financialStatus.balance.toLocaleString()} CDF
//                             </span>
//                           </div>
//                         </div>

//                         {feeStructures[student.id] ? (
//                           <div className="space-y-4">
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <h4 className="font-medium text-gray-700 mb-3 flex items-center">
//                                 <FiCreditCard className="mr-2 text-blue-500" />
//                                 Structure des Frais
//                               </h4>
//                               <div className="space-y-2">
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-600">Frais scolaires:</span>
//                                   <span className="font-medium">{feeStructures[student.id].schoolFee.toLocaleString()} CDF</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-600">Minerval:</span>
//                                   <span className="font-medium">{feeStructures[student.id].minerval.toLocaleString()} CDF</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-600">Frais connexes:</span>
//                                   <span className="font-medium">{feeStructures[student.id].otherFees.toLocaleString()} CDF</span>
//                                 </div>
//                                 <div className="border-t pt-2 mt-2 flex justify-between">
//                                   <span className="font-medium">Total à payer:</span>
//                                   <span className="font-bold text-blue-600">
//                                     {financialStatus.totalDue.toLocaleString()} CDF
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <h4 className="font-medium text-gray-700 mb-3 flex items-center">
//                                 <FiPieChart className="mr-2 text-blue-500" />
//                                 Paiements Effectués
//                               </h4>
//                               <div className="space-y-2">
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-600">Frais scolaires payés:</span>
//                                   <span className="font-medium">
//                                     {financialStatus.scolairePaid.toLocaleString()} CDF
//                                     {financialStatus.scolairePaid > 0 && (
//                                       <span className="text-xs text-gray-500 ml-2">
//                                         ({Math.round((financialStatus.scolairePaid / feeStructures[student.id].schoolFee) * 100)}%)
//                                       </span>
//                                     )}
//                                   </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-600">Minerval payé:</span>
//                                   <span className="font-medium">
//                                     {financialStatus.minervalPaid.toLocaleString()} CDF
//                                     {financialStatus.minervalPaid > 0 && (
//                                       <span className="text-xs text-gray-500 ml-2">
//                                         ({Math.round((financialStatus.minervalPaid / feeStructures[student.id].minerval) * 100)}%)
//                                       </span>
//                                     )}
//                                   </span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                   <span className="text-gray-600">Frais connexes payés:</span>
//                                   <span className="font-medium">
//                                     {financialStatus.connexePaid.toLocaleString()} CDF
//                                     {financialStatus.connexePaid > 0 && (
//                                       <span className="text-xs text-gray-500 ml-2">
//                                         ({Math.round((financialStatus.connexePaid / feeStructures[student.id].otherFees) * 100)}%)
//                                       </span>
//                                     )}
//                                   </span>
//                                 </div>
//                                 <div className="border-t pt-2 mt-2 flex justify-between">
//                                   <span className="font-medium">Total payé:</span>
//                                   <span className="font-bold text-green-600">
//                                     {financialStatus.totalPaid.toLocaleString()} CDF
//                                     {financialStatus.totalPaid > 0 && (
//                                       <span className="text-xs text-gray-500 ml-2">
//                                         ({Math.round((financialStatus.totalPaid / financialStatus.totalDue) * 100)}%)
//                                       </span>
//                                     )}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-4">
//                               <h4 className="font-medium text-gray-700 mb-2">Historique des Paiements</h4>
//                               {payments[student.id]?.length ? (
//                                 <div className="overflow-y-auto max-h-60">
//                                   <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-50">
//                                       <tr>
//                                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                           Date
//                                         </th>
//                                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                           Type
//                                         </th>
//                                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                           Montant
//                                         </th>
//                                       </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                       {payments[student.id].map((payment, index) => (
//                                         <tr key={index}>
//                                           <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
//                                             {new Date(payment.date).toLocaleDateString()}
//                                           </td>
//                                           <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">
//                                             {payment.feeType.toLowerCase().replace('_', ' ')}
//                                           </td>
//                                           <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">
//                                             {payment.amount.toLocaleString()} CDF
//                                           </td>
//                                         </tr>
//                                       ))}
//                                     </tbody>
//                                   </table>
//                                 </div>
//                               ) : (
//                                 <p className="text-gray-500 text-center py-4">Aucun paiement enregistré</p>
//                               )}
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="text-center py-8 text-gray-500">
//                             <FiDollarSign className="mx-auto text-3xl mb-2" />
//                             <p>Aucune information financière disponible</p>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="bg-gray-50 px-5 py-3 flex justify-end">
//                     <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
//                       <FiMail className="mr-1" />
//                       Contacter l'école
//                     </button>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}
        
//         {students.length > 0 && (
//           <div className="mt-8 bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//               <FiCalendar className="mr-2 text-blue-500" />
//               Prochains Événements
//             </h2>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               <div className="border-l-4 border-blue-500 pl-4 py-2">
//                 <p className="font-medium">Réunion parents-professeurs</p>
//                 <p className="text-sm text-gray-500">15 Mars 2023 - 14h00</p>
//               </div>
//               <div className="border-l-4 border-green-500 pl-4 py-2">
//                 <p className="font-medium">Journée portes ouvertes</p>
//                 <p className="text-sm text-gray-500">22 Avril 2023 - 09h00</p>
//               </div>
//               <div className="border-l-4 border-yellow-500 pl-4 py-2">
//                 <p className="font-medium">Vacances scolaires</p>
//                 <p className="text-sm text-gray-500">10-25 Juin 2023</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { 
  Student, 
  getStudentByTutorId, 
  getClassroomForStudent,
  getStudentGrades,
  getCoursesForClassroom,
  getStudentPayments,
  getFeeStructure,
  Course,
  Grade,
  Payment,
  FeeStructure,
  getCommunicationsForUser,
  Communication,
  markAsRead
} from '@/lib/db'
import { 
  FiUser, 
  FiBook, 
  FiCalendar, 
  FiAward, 
  FiHome, 
  FiPhone, 
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiDownload,
  FiDollarSign,
  FiCreditCard,
  FiPieChart,
  FiBell,
  FiMessageSquare
} from 'react-icons/fi'
import { PdfReportGenerator } from '@/components/PdfReportGenerator'
import AnnoncePage from '@/components/AnnoncePage'

export default function ParentPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [classrooms, setClassrooms] = useState<Record<string, any>>({})
  const [grades, setGrades] = useState<Record<string, Grade[]>>({})
  const [payments, setPayments] = useState<Record<string, Payment[]>>({})
  const [feeStructures, setFeeStructures] = useState<Record<string, FeeStructure>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Record<string, string>>({})
  const [courses, setCourses] = useState<Record<string, Course>>({})
  const [announcements, setAnnouncements] = useState<Communication[]>([])
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0)
  const [showAnnouncements, setShowAnnouncements] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || user.role !== 'parent') return;
      
        const studentsData = await getStudentByTutorId(user.id)
        setStudents(studentsData)

        // Initialize active tabs
        const tabs: Record<string, string> = {}
        studentsData.forEach(student => {
            tabs[student.id] = 'info'
        })
        setActiveTab(tabs)

        // Fetch all data in parallel
        const [
          classResults, 
          gradeResults, 
          paymentResults, 
          feeStructureResults,
          comms
        ] = await Promise.all([
          Promise.all(studentsData.map(student => getClassroomForStudent(student.id))),
          Promise.all(studentsData.map(student => getStudentGrades(student.id))),
          Promise.all(studentsData.map(student => getStudentPayments(student.id))),
          Promise.all(studentsData.map(async student => {
            const classroom = await getClassroomForStudent(student.id)
            return classroom ? getFeeStructure(classroom.id) : null
          })),
          getCommunicationsForUser(user.id)
        ])

        // Filter announcements
        const announcementsData = comms
          .filter(c => c.type === 'ANNOUNCEMENT')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        
        setAnnouncements(announcementsData)
        setUnreadAnnouncements(announcementsData.filter(a => !a.isRead).length)

        // Get courses for each classroom
        const coursePromises = classResults.map(classroom => 
            classroom ? getCoursesForClassroom(classroom.id) : Promise.resolve([])
        )
        const courseResults = await Promise.all(coursePromises)

        // Process all data
        const classMap: Record<string, any> = {}
        const gradeMap: Record<string, Grade[]> = {}
        const paymentMap: Record<string, Payment[]> = {}
        const feeStructureMap: Record<string, FeeStructure> = {}
        const courseMap: Record<string, Course> = {}

        classResults.forEach((classroom, index) => {
            if (classroom) {
                classMap[studentsData[index].id] = classroom
            }
        })

        gradeResults.forEach((studentGrades, index) => {
            gradeMap[studentsData[index].id] = studentGrades
        })

        paymentResults.forEach((studentPayments, index) => {
            paymentMap[studentsData[index].id] = studentPayments
        })

        feeStructureResults.forEach((feeStructure, index) => {
            if (feeStructure) {
                feeStructureMap[studentsData[index].id] = feeStructure
            }
        })

        courseResults.forEach((courses, index) => {
            courses.forEach(course => {
                courseMap[course.id] = course
            })
        })

        setClassrooms(classMap)
        setGrades(gradeMap)
        setPayments(paymentMap)
        setFeeStructures(feeStructureMap)
        setCourses(courseMap)
      } catch (err) {
        console.error('Error:', err)
        setError('Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const calculateStudentAverage = (studentId: string): number | null => {
    const studentGrades = grades[studentId]
    if (!studentGrades || studentGrades.length === 0) return null
    
    const validGrades = studentGrades
      .map(grade => grade.total)
      .filter(total => total !== undefined) as number[]
    
    if (validGrades.length === 0) return null
    
    const sum = validGrades.reduce((acc, curr) => acc + curr, 0)
    return Math.round(sum / validGrades.length)
  }

  const calculateFinancialStatus = (studentId: string) => {
    const feeStructure = feeStructures[studentId]
    const studentPayments = payments[studentId] || []
    
    if (!feeStructure) {
      return {
        totalDue: 0,
        totalPaid: 0,
        balance: 0,
        scolairePaid: 0,
        minervalPaid: 0,
        connexePaid: 0
      }
    }

    const totalDue = feeStructure.schoolFee + feeStructure.minerval + feeStructure.otherFees
    const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0)
    
    const scolairePaid = studentPayments
      .filter(p => p.feeType === 'SCOLAIRE')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const minervalPaid = studentPayments
      .filter(p => p.feeType === 'MINERVAL')
      .reduce((sum, p) => sum + p.amount, 0)
    
    const connexePaid = studentPayments
      .filter(p => p.feeType === 'FRAIS_CONNEXE')
      .reduce((sum, p) => sum + p.amount, 0)

    return {
      totalDue,
      totalPaid,
      balance: totalDue - totalPaid,
      scolairePaid,
      minervalPaid,
      connexePaid
    }
  }

  const handleMarkAsRead = async (announcementId: string) => {
    await markAsRead(announcementId)
    setAnnouncements(prev => prev.map(a => 
      a.id === announcementId ? {...a, isRead: true} : a
    ))
    setUnreadAnnouncements(prev => prev - 1)
  }

  const handleDownloadReport = (student: Student) => {
    if (!classrooms[student.id]) return
    
    PdfReportGenerator.generateReport({
      student,
      classroom: classrooms[student.id],
      courses: [],
      grades: grades[student.id]?.reduce((acc, grade) => {
        acc[grade.courseId] = grade
        return acc
      }, {} as Record<string, Grade>) || {}
    })
  }

  const handleTabChange = (studentId: string, tab: string) => {
    setActiveTab(prev => ({
      ...prev,
      [studentId]: tab
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Chargement en cours...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mes Enfants</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              {students.length} {students.length > 1 ? 'enfants' : 'enfant'}
            </div>
            <button 
              onClick={() => setShowAnnouncements(!showAnnouncements)}
              className="relative p-2 rounded-full bg-white shadow hover:bg-gray-100"
            >
              <FiBell className="text-gray-600" />
              {unreadAnnouncements > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadAnnouncements}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Announcements Panel */}
        {showAnnouncements && (
          <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FiMessageSquare className="mr-2" />
                Annonces de l'école
              </h2>
              <button 
                onClick={() => setShowAnnouncements(false)}
                className="text-white hover:text-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {announcements.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>Aucune annonce disponible pour le moment</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
               <AnnoncePage/>
              </div>
            )}
          </div>
        )}
        
        {students.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-gray-400 mb-4">
              <FiUser className="inline-block text-4xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun élève associé</h2>
            <p className="text-gray-500">Vos enfants n'ont pas encore été enregistrés dans le système.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {students.map(student => {
              const classroom = classrooms[student.id]
              const birthDate = new Date(student.date_naissance)
              const age = new Date().getFullYear() - birthDate.getFullYear()
              const studentAverage = calculateStudentAverage(student.id)
              const isSuccess = studentAverage !== null && studentAverage >= 50
              const financialStatus = calculateFinancialStatus(student.id)
              
              return (
                <div key={student.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 rounded-full p-2">
                        <FiUser className="text-xl" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg">
                          {student.prenom} {student.nom} {student.post_nom}
                        </h2>
                        <p className="text-sm opacity-90">{student.matricule}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button
                        onClick={() => handleTabChange(student.id, 'info')}
                        className={`py-4 px-4 text-center border-b-2 font-medium text-sm ${activeTab[student.id] === 'info' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        Infos
                      </button>
                      <button
                        onClick={() => handleTabChange(student.id, 'results')}
                        className={`py-4 px-4 text-center border-b-2 font-medium text-sm ${activeTab[student.id] === 'results' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        Résultats
                      </button>
                      <button
                        onClick={() => handleTabChange(student.id, 'finance')}
                        className={`py-4 px-4 text-center border-b-2 font-medium text-sm ${activeTab[student.id] === 'finance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        Finances
                      </button>
                    </nav>
                  </div>
                  
                  <div className="p-5">
                    {activeTab[student.id] === 'info' ? (
                      <>
                        <div className="mb-4">
                          <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                            <FiBook className="mr-2 text-blue-500" />
                            Informations Scolaires
                          </h3>
                          <div className="space-y-2 pl-6">
                            <p className="text-sm">
                              <span className="font-medium">Classe:</span> {classroom?.name || 'Non assigné'}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Section:</span> {classroom?.section || 'Non spécifié'}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Niveau:</span> {student.niveau_etude}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Option:</span> {student.option_choisie}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                            <FiUser className="mr-2 text-blue-500" />
                            Informations Personnelles
                          </h3>
                          <div className="space-y-2 pl-6">
                            <p className="text-sm">
                              <span className="font-medium">Âge:</span> {age} ans
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Né(e) le:</span> {birthDate.toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Lieu de naissance:</span> {student.lieu_naissance}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Sexe:</span> {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                            <FiHome className="mr-2 text-blue-500" />
                            Contact
                          </h3>
                          <div className="space-y-2 pl-6">
                            <p className="text-sm">
                              <span className="font-medium">Adresse:</span> {student.adresse}
                            </p>
                            {student.contacts.map((contact, index) => (
                              <p key={index} className="text-sm flex items-center">
                                <FiPhone className="mr-1 text-gray-500" />
                                {contact}
                              </p>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : activeTab[student.id] === 'results' ? (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-gray-700 flex items-center">
                            <FiAward className="mr-2 text-blue-500" />
                            Résultats Scolaires
                          </h3>
                          {studentAverage !== null && (
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">Moyenne:</span>
                              <span className={`px-2 py-1 rounded-md text-sm font-bold ${
                                isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {studentAverage}
                              </span>
                              {isSuccess ? (
                                <FiCheckCircle className="ml-2 text-green-500" />
                              ) : (
                                <FiXCircle className="ml-2 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        {grades[student.id]?.length ? (
                          <div className="space-y-4">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Cours
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      P1
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      P2
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Ex1
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      S1
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      P3
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      P4
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Ex2
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      S2
                                    </th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Total
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {grades[student.id]?.map((grade, index) => {
                                    const courseName = courses[grade.courseId]?.name || grade.courseId.split('-')[0]
                                    
                                    return (
                                      <tr key={index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {courseName}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                                          {grade.P1 ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                                          {grade.P2 ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                                          {grade.Examen1 ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                                          {grade.S1 ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                                          {grade.P3 ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                                          {grade.P4 ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                                          {grade.Examen2 ?? '-'}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium">
                                          {grade.S2 ?? '-'}
                                        </td>
                                        <td className={`px-4 py-2 whitespace-nowrap text-center text-sm font-bold ${
                                          grade.total && grade.total >= 50 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                          {grade.total ?? '-'}
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <FiBarChart2 className="mx-auto text-3xl mb-2" />
                            <p>Aucun résultat disponible pour le moment</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-gray-700 flex items-center">
                            <FiDollarSign className="mr-2 text-blue-500" />
                            Situation Financière
                          </h3>
                          <div className="flex items-center">
                            <span className="text-sm font-medium mr-2">Solde:</span>
                            <span className={`px-2 py-1 rounded-md text-sm font-bold ${
                              financialStatus.balance <= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {financialStatus.balance.toLocaleString()} CDF
                            </span>
                          </div>
                        </div>

                        {feeStructures[student.id] ? (
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <FiCreditCard className="mr-2 text-blue-500" />
                                Structure des Frais
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Frais scolaires:</span>
                                  <span className="font-medium">{feeStructures[student.id].schoolFee.toLocaleString()} CDF</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Minerval:</span>
                                  <span className="font-medium">{feeStructures[student.id].minerval.toLocaleString()} CDF</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Frais connexes:</span>
                                  <span className="font-medium">{feeStructures[student.id].otherFees.toLocaleString()} CDF</span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between">
                                  <span className="font-medium">Total à payer:</span>
                                  <span className="font-bold text-blue-600">
                                    {financialStatus.totalDue.toLocaleString()} CDF
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                <FiPieChart className="mr-2 text-blue-500" />
                                Paiements Effectués
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Frais scolaires payés:</span>
                                  <span className="font-medium">
                                    {financialStatus.scolairePaid.toLocaleString()} CDF
                                    {financialStatus.scolairePaid > 0 && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({Math.round((financialStatus.scolairePaid / feeStructures[student.id].schoolFee) * 100)}%)
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Minerval payé:</span>
                                  <span className="font-medium">
                                    {financialStatus.minervalPaid.toLocaleString()} CDF
                                    {financialStatus.minervalPaid > 0 && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({Math.round((financialStatus.minervalPaid / feeStructures[student.id].minerval) * 100)}%)
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Frais connexes payés:</span>
                                  <span className="font-medium">
                                    {financialStatus.connexePaid.toLocaleString()} CDF
                                    {financialStatus.connexePaid > 0 && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({Math.round((financialStatus.connexePaid / feeStructures[student.id].otherFees) * 100)}%)
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between">
                                  <span className="font-medium">Total payé:</span>
                                  <span className="font-bold text-green-600">
                                    {financialStatus.totalPaid.toLocaleString()} CDF
                                    {financialStatus.totalPaid > 0 && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        ({Math.round((financialStatus.totalPaid / financialStatus.totalDue) * 100)}%)
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h4 className="font-medium text-gray-700 mb-2">Historique des Paiements</h4>
                              {payments[student.id]?.length ? (
                                <div className="overflow-y-auto max-h-60">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Date
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Type
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Montant
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {payments[student.id].map((payment, index) => (
                                        <tr key={index}>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(payment.date).toLocaleDateString()}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {payment.feeType.toLowerCase().replace('_', ' ')}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">
                                            {payment.amount.toLocaleString()} CDF
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-4">Aucun paiement enregistré</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <FiDollarSign className="mx-auto text-3xl mb-2" />
                            <p>Aucune information financière disponible</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 px-5 py-3 flex justify-end">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      <FiMail className="mr-1" />
                      Contacter l'école
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {students.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiCalendar className="mr-2 text-blue-500" />
              Prochains Événements
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-medium">Réunion parents-professeurs</p>
                <p className="text-sm text-gray-500">15 Mars 2023 - 14h00</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-medium">Journée portes ouvertes</p>
                <p className="text-sm text-gray-500">22 Avril 2023 - 09h00</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="font-medium">Vacances scolaires</p>
                <p className="text-sm text-gray-500">10-25 Juin 2023</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}