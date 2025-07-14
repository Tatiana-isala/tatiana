
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { 
  getClassroomsForTeacher,
  getStudentsInClassroom,
  getCoursesForClassroom,
  getGradesByCourse,
  getStudentGradesForCourse,
  Classroom,
  Course,
  Student,
  Grade
} from '@/lib/db'
import { 
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiPrinter,
  FiDownload
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { PdfReportGenerator } from '@/components/PdfReportGenerator'

export default function ClassGradesOverview() {
  const { user } = useAuth()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [grades, setGrades] = useState<Record<string, Record<string, Grade>>>({})
  const [loading, setLoading] = useState(true)
  const [isResponsible, setIsResponsible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const teacherClassrooms = await getClassroomsForTeacher(user.id)
        setClassrooms(teacherClassrooms)
        
        const responsibleClass = teacherClassrooms.find(c => c.teacherId === user.id)
        if (responsibleClass) {
          setIsResponsible(true)
          setSelectedClassroom(responsibleClass)
        }
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
    const fetchClassroomData = async () => {
      if (!selectedClassroom) return
      
      try {
        setLoading(true)
        const [classStudents, classCourses] = await Promise.all([
          getStudentsInClassroom(selectedClassroom.id),
          getCoursesForClassroom(selectedClassroom.id)
        ])
        
        setStudents(classStudents)
        setCourses(classCourses)
        
        const gradesMap: Record<string, Record<string, Grade>> = {}
        
        await Promise.all(
          classStudents.map(async student => {
            gradesMap[student.id] = {}
            
            await Promise.all(
              classCourses.map(async course => {
                const grade = await getStudentGradesForCourse(
                  student.id, 
                  course.id,
                  selectedClassroom.id
                )
                
                if (grade) {
                  gradesMap[student.id][course.id] = grade
                }
              })
            )
          })
        )
        
        setGrades(gradesMap)
      } catch (error) {
        console.error('Error fetching classroom data:', error)
        toast.error('Erreur lors du chargement des données de la classe')
      } finally {
        setLoading(false)
      }
    }

    fetchClassroomData()
  }, [selectedClassroom])

  const calculateStudentAverage = (studentId: string): number | null => {
    const studentGrades = grades[studentId]
    if (!studentGrades) return null
    
    const validGrades = Object.values(studentGrades)
      .map(grade => grade.total)
      .filter(total => total !== undefined) as number[]
    
    if (validGrades.length === 0) return null
    
    const sum = validGrades.reduce((acc, curr) => acc + curr, 0)
    return Math.round(sum / validGrades.length)
  }

  const calculateClassAverage = (): number | null => {
    const studentAverages = students
      .map(student => calculateStudentAverage(student.id))
      .filter(avg => avg !== null) as number[]
    
    if (studentAverages.length === 0) return null
    
    const sum = studentAverages.reduce((acc, curr) => acc + curr, 0)
    return Math.round(sum / studentAverages.length)
  }

  const handleDownloadReport = (student: Student) => {
    PdfReportGenerator.generateReport({
      student,
      classroom: selectedClassroom!,
      courses,
      grades: grades[student.id] || {}
    })
  }

  if (loading && !classrooms.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isResponsible) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Gestion des notes de classe</h1>
          <p className="text-gray-600 mb-6">
            Vous n'êtes pas titulaire d'une classe. Seuls les titulaires peuvent accéder à cette fonctionnalité.
          </p>
          <Link 
            href="/teacher/grades" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiArrowLeft className="mr-2" /> Retour à la gestion des notes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <FiBarChart2 className="mr-2" /> Notes de la classe {selectedClassroom?.name}
            </h1>
            <p className="text-gray-600">
              {students.length} élèves | {courses.length} cours
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FiPrinter className="mr-2" /> Imprimer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Moyenne de la classe</h3>
              <p className="text-2xl font-bold text-blue-600">
                {calculateClassAverage() ?? '-'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Réussite</h3>
              <p className="text-2xl font-bold text-green-600">
                {students.filter(s => getSuccessStatus(calculateStudentAverage(s.id))).length} / {students.length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800">Échec</h3>
              <p className="text-2xl font-bold text-red-600">
                {students.filter(s => !getSuccessStatus(calculateStudentAverage(s.id))).length} / {students.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                Élève
              </th>
              {courses.map(course => (
                <th 
                  key={course.id} 
                  className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: '100px' }}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{course.name}</span>
                    <span className="text-xs text-gray-400">Total</span>
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Moyenne
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appréciation
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Résultat
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map(student => {
              const studentAverage = calculateStudentAverage(student.id)
              const appreciation = getAppreciation(studentAverage)
              const isSuccess = getSuccessStatus(studentAverage)

              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
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
                  
                  {courses.map(course => {
                    const grade = grades[student.id]?.[course.id]
                    const total = grade?.total
                    const isCourseSuccess = total !== undefined && total >= 50

                    return (
                      <td key={course.id} className="px-3 py-4 whitespace-nowrap text-center">
                        <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                          isCourseSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {total ?? '-'}
                        </div>
                      </td>
                    )
                  })}
                  
                  <td className="px-4 py-4 whitespace-nowrap text-center font-bold">
                    {studentAverage ?? '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {appreciation !== '-' && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {appreciation}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {isSuccess ? (
                      <FiCheckCircle className="text-green-500 mx-auto" />
                    ) : (
                      <FiXCircle className="text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDownloadReport(student)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                      title="Télécharger le bulletin complet"
                    >
                      <FiDownload className="inline mr-1" />
                      Bulletin
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Légende :</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-green-100 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Réussite (≥50%)</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-red-100 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Échec (Less than 50%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function getAppreciation(average: number | null): string {
  if (average === null) return '-'
  return average >= 80 ? 'Excellent' :
         average >= 70 ? 'Très bien' :
         average >= 60 ? 'Bien' :
         average >= 50 ? 'Satisfaisant' :
         average >= 30 ? 'Insuffisant' : 'Médiocre'
}

function getSuccessStatus(average: number | null): boolean {
  return average !== null && average >= 50
}