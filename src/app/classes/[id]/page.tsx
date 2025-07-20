

// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { 
//   getClassroomById, 
//   assignTeacherToClassroom,
//   getEnseignantsWithDetails,
//   getStudentByTutorId,
//   getAllStudents,
//   addStudentToClassroom,
//   removeStudentFromClassroom,
//   getStudentsInClassroom,
//   getCoursesForClassroom,
//   assignCourseToClassroom,
//   getAllCourses
// } from '@/lib/db';

// export default function ClassroomDetailsPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [classroom, setClassroom] = useState<any>(null);
//   const [teachers, setTeachers] = useState<any[]>([]);
//   const [students, setStudents] = useState<any[]>([]);
//   const [allStudents, setAllStudents] = useState<any[]>([]);
//   const [availableStudents, setAvailableStudents] = useState<any[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState('');
//   const [courses, setCourses] = useState<any[]>([]);
//   const [allCourses, setAllCourses] = useState<any[]>([]);
//   const [availableCourses, setAvailableCourses] = useState<any[]>([]);
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('students');

//   useEffect(() => {
//     if (id) {
//       loadData();
//     }
//   }, [id]);

//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const [
//         classroomData, 
//         teachersData, 
//         studentsData, 
//         allStudentsData,
//         coursesData,
//         allCoursesData
//       ] = await Promise.all([
//         getClassroomById(id as string),
//         getEnseignantsWithDetails(),
//         getStudentsInClassroom(id as string),
//         getAllStudents(),
//         getCoursesForClassroom(id as string),
//         getAllCourses()
//       ]);

//       setClassroom(classroomData);
//       setTeachers(teachersData);
//       setStudents(studentsData);
//       setAllStudents(allStudentsData);
//       setCourses(coursesData);
//       setAllCourses(allCoursesData);

//       // Filtrer les élèves disponibles
//       const studentsInClass = studentsData.map(s => s.id);
//       setAvailableStudents(
//         allStudentsData.filter(student => !studentsInClass.includes(student.id))
//       );

//       // Filtrer les cours disponibles
//       const coursesInClass = coursesData.map(c => c.id);
//       setAvailableCourses(
//         allCoursesData.filter(course => !coursesInClass.includes(course.id))
//       );
//     } catch (error) {
//       console.error('Erreur lors du chargement des données:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAssignTeacher = async (teacherId: string | null) => {
//     try {
//       await assignTeacherToClassroom(classroom.id, teacherId);
//       await loadData();
//     } catch (error) {
//       console.error('Erreur lors de l\'assignation du professeur:', error);
//     }
//   };

//   const handleAddStudent = async () => {
//     if (!selectedStudent) return;

//     try {
//       await addStudentToClassroom(classroom.id, selectedStudent);
//       setSelectedStudent('');
//       await loadData();
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout de l\'élève:', error);
//       if (error instanceof Error) {
//         alert(error.message);
//       } else {
//         alert('Une erreur est survenue lors de l\'ajout de l\'élève');
//       }
//     }
//   };

//   const handleRemoveStudent = async (studentId: string) => {
//     if (confirm('Voulez-vous vraiment retirer cet élève de la classe ?')) {
//       try {
//         await removeStudentFromClassroom(classroom.id, studentId);
//         await loadData();
//       } catch (error) {
//         console.error('Erreur lors du retrait de l\'élève:', error);
//       }
//     }
//   };

//   const handleAddCourse = async () => {
//     if (!selectedCourse) return;

//     try {
//       const course = allCourses.find(c => c.id === selectedCourse);
//       if (!course) throw new Error('Cours non trouvé');

//       await assignCourseToClassroom(
//         selectedCourse,
//         classroom.id,
//         course.teacherId
//       );
//       setSelectedCourse('');
//       await loadData();
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout du cours:', error);
//       alert('Une erreur est survenue lors de l\'ajout du cours');
//     }
//   };

//   const handleRemoveCourse = async (courseId: string) => {
//     if (confirm('Voulez-vous vraiment retirer ce cours de la classe ?')) {
//       try {
//         // Implémentez cette fonction dans db.ts
//         // await removeCourseFromClassroom(classroom.id, courseId);
//         await loadData();
//       } catch (error) {
//         console.error('Erreur lors du retrait du cours:', error);
//       }
//     }
//   };

//   if (isLoading) {
//     return <div className="p-4">Chargement...</div>;
//   }

//   if (!classroom) {
//     return <div className="p-4">Classe non trouvée</div>;
//   }

//   return (
//     <div className="p-4">
//       <button 
//         onClick={() => router.push('/classes')}
//         className="mb-4 text-blue-500 hover:text-blue-700"
//       >
//         &larr; Retour à la liste
//       </button>

//       <h1 className="text-2xl font-bold mb-4">Détails de la classe: {classroom.name}</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-4">Informations</h2>
//           <div className="space-y-2">
//             <p><span className="font-medium">Niveau:</span> {classroom.level}ème</p>
//             <p><span className="font-medium">Section:</span> {classroom.section}</p>
//             <p><span className="font-medium">Capacité:</span> {classroom.capacity} élèves</p>
//             <p><span className="font-medium">Élèves inscrits:</span> {students.length}/{classroom.capacity}</p>
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-4">Professeur titulaire</h2>
//           <select
//             className="w-full p-2 border rounded mb-4"
//             value={classroom.teacherId || ''}
//             onChange={(e) => handleAssignTeacher(e.target.value || null)}
//           >
//             <option value="">-- Sélectionner un titulaire --</option>
//             {teachers.map((teacher) => (
//               <option key={teacher.id} value={teacher.id}>
//                 {teacher.name} ({teacher.teacherInfo?.matierePrincipale})
//               </option>
//             ))}
//           </select>

//           {classroom.teacherId && (
//             <div className="mt-2 p-2 bg-gray-50 rounded">
//               <p className="font-medium">Informations du titulaire:</p>
//               {teachers.find(t => t.id === classroom.teacherId) ? (
//                 <div>
//                   <p>Nom: {teachers.find(t => t.id === classroom.teacherId).name}</p>
//                   <p>Matière principale: {teachers.find(t => t.id === classroom.teacherId).teacherInfo?.matierePrincipale}</p>
//                 </div>
//               ) : (
//                 <p>Informations non disponibles</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="mb-4 border-b border-gray-200">
//         <nav className="flex space-x-4">
//           <button
//             onClick={() => setActiveTab('students')}
//             className={`py-2 px-4 font-medium ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             Élèves
//           </button>
//           <button
//             onClick={() => setActiveTab('courses')}
//             className={`py-2 px-4 font-medium ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           >
//             Cours
//           </button>
//         </nav>
//       </div>

//       {activeTab === 'students' ? (
//         <>
//           <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Ajouter un élève</h2>
//             <div className="flex gap-2">
//               <select
//                 className="flex-1 p-2 border rounded"
//                 value={selectedStudent}
//                 onChange={(e) => setSelectedStudent(e.target.value)}
//                 disabled={availableStudents.length === 0}
//               >
//                 <option value="">-- Sélectionner un élève --</option>
//                 {availableStudents.map(student => (
//                   <option key={student.id} value={student.id}>
//                     {student.nom} {student.postNom} {student.prenom} ({student.matricule})
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleAddStudent}
//                 disabled={!selectedStudent}
//                 className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
//               >
//                 Ajouter
//               </button>
//             </div>
//             {availableStudents.length === 0 && (
//               <p className="mt-2 text-sm text-gray-500">Tous les élèves sont déjà dans cette classe</p>
//             )}
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Élèves de la classe ({students.length}/{classroom.capacity})</h2>
//             {students.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="py-2 px-4 border-b">Matricule</th>
//                       <th className="py-2 px-4 border-b">Nom</th>
//                       <th className="py-2 px-4 border-b">Post-nom</th>
//                       <th className="py-2 px-4 border-b">Prénom</th>
//                       <th className="py-2 px-4 border-b">Niveau</th>
//                       <th className="py-2 px-4 border-b">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {students.map((student) => (
//                       <tr key={student.id} className="hover:bg-gray-50">
//                         <td className="py-2 px-4 border-b text-center">{student.matricule}</td>
//                         <td className="py-2 px-4 border-b text-center">{student.nom}</td>
//                         <td className="py-2 px-4 border-b text-center">{student.postNom}</td>
//                         <td className="py-2 px-4 border-b text-center">{student.prenom}</td>
//                         <td className="py-2 px-4 border-b text-center">{student.niveauEtude}</td>
//                         <td className="py-2 px-4 border-b text-center">
//                           <button
//                             onClick={() => handleRemoveStudent(student.id)}
//                             className="text-red-500 hover:text-red-700"
//                           >
//                             Retirer
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p>Aucun élève dans cette classe pour le moment.</p>
//             )}
//           </div>
//         </>
//       ) : (
//         <>
//           <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Ajouter un cours</h2>
//             <div className="flex gap-2">
//               <select
//                 className="flex-1 p-2 border rounded"
//                 value={selectedCourse}
//                 onChange={(e) => setSelectedCourse(e.target.value)}
//                 disabled={availableCourses.length === 0}
//               >
//                 <option value="">-- Sélectionner un cours --</option>
//                 {availableCourses.map(course => (
//                   <option key={course.id} value={course.id}>
//                     {course.name} (Prof: {teachers.find(t => t.id === course.teacherId)?.name || 'Non assigné'})
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleAddCourse}
//                 disabled={!selectedCourse}
//                 className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
//               >
//                 Ajouter
//               </button>
//             </div>
//             {availableCourses.length === 0 && (
//               <p className="mt-2 text-sm text-gray-500">Tous les cours disponibles sont déjà assignés à cette classe</p>
//             )}
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Cours de la classe ({courses.length})</h2>
//             {courses.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {courses.map(course => {
//                   const teacher = teachers.find(t => t.id === course.teacherId);
//                   return (
//                     <div 
//                       key={course.id} 
//                       className="border rounded-lg p-4 hover:shadow-md transition-shadow"
//                       style={{ borderLeft: `4px solid ${course.color}` }}
//                     >
//                       <h3 className="font-bold text-lg">{course.name}</h3>
//                       <p className="text-sm text-gray-600 mt-1">
//                         Enseignant: {teacher?.name || 'Non assigné'}
//                       </p>
//                       <div className="flex items-center mt-2">
//                         <div 
//                           className="w-4 h-4 rounded-full mr-2"
//                           style={{ backgroundColor: course.color }}
//                         ></div>
//                         <span className="text-xs text-gray-500">{course.color}</span>
//                       </div>
//                       <button
//                         onClick={() => handleRemoveCourse(course.id)}
//                         className="mt-2 text-sm text-red-500 hover:text-red-700"
//                       >
//                         Retirer de la classe
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p>Aucun cours assigné à cette classe pour le moment.</p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  getClassroomById, 
  assignTeacherToClassroom,
  getEnseignantsWithDetails,
  getStudentByTutorId,
  getAllStudents,
  addStudentToClassroom,
  removeStudentFromClassroom,
  getStudentsInClassroom,
  getCoursesForClassroom,
  assignCourseToClassroom,
  getAllCourses
} from '@/lib/db';
import { FiArrowLeft, FiUser, FiUsers, FiBook, FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';

export default function ClassroomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [classroom, setClassroom] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        classroomData, 
        teachersData, 
        studentsData, 
        allStudentsData,
        coursesData,
        allCoursesData
      ] = await Promise.all([
        getClassroomById(id as string),
        getEnseignantsWithDetails(),
        getStudentsInClassroom(id as string),
        getAllStudents(),
        getCoursesForClassroom(id as string),
        getAllCourses()
      ]);

      setClassroom(classroomData);
      setTeachers(teachersData);
      setStudents(studentsData);
      setAllStudents(allStudentsData);
      setCourses(coursesData);
      setAllCourses(allCoursesData);

      // Filtrer les élèves disponibles
      const studentsInClass = studentsData.map(s => s.id);
      setAvailableStudents(
        allStudentsData.filter(student => !studentsInClass.includes(student.id))
      );

      // Filtrer les cours disponibles
      const coursesInClass = coursesData.map(c => c.id);
      setAvailableCourses(
        allCoursesData.filter(course => !coursesInClass.includes(course.id))
      );
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTeacher = async (teacherId: string | null) => {
    try {
      await assignTeacherToClassroom(classroom.id, teacherId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'assignation du professeur:', error);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedStudent) return;

    try {
      await addStudentToClassroom(classroom.id, selectedStudent);
      setSelectedStudent('');
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élève:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Une erreur est survenue lors de l\'ajout de l\'élève');
      }
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (confirm('Voulez-vous vraiment retirer cet élève de la classe ?')) {
      try {
        await removeStudentFromClassroom(classroom.id, studentId);
        await loadData();
      } catch (error) {
        console.error('Erreur lors du retrait de l\'élève:', error);
      }
    }
  };

  const handleAddCourse = async () => {
    if (!selectedCourse) return;

    try {
      const course = allCourses.find(c => c.id === selectedCourse);
      if (!course) throw new Error('Cours non trouvé');

      await assignCourseToClassroom(
        selectedCourse,
        classroom.id,
        course.teacherId
      );
      setSelectedCourse('');
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du cours:', error);
      alert('Une erreur est survenue lors de l\'ajout du cours');
    }
  };

  const handleRemoveCourse = async (courseId: string) => {
    if (confirm('Voulez-vous vraiment retirer ce cours de la classe ?')) {
      try {
        // Implémentez cette fonction dans db.ts
        // await removeCourseFromClassroom(classroom.id, courseId);
        await loadData();
      } catch (error) {
        console.error('Erreur lors du retrait du cours:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-700">Classe non trouvée</h1>
        <button 
          onClick={() => router.push('/classes')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center mx-auto"
        >
          <FiArrowLeft className="mr-2" />
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button 
        onClick={() => router.push('/classes')}
        className="mb-6 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-gray-700"
      >
        <FiArrowLeft className="mr-2" />
        Retour à la liste
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Classe: {classroom.name}
        </h1>
        <div className="mt-2 md:mt-0 flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {classroom.level}ème {classroom.section}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {students.length}/{classroom.capacity} élèves
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FiUser className="mr-2 text-blue-500" />
            Professeur titulaire
          </h2>
          <div className="space-y-4">
            <select
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={classroom.teacherId || ''}
              onChange={(e) => handleAssignTeacher(e.target.value || null)}
            >
              <option value="">-- Sélectionner un titulaire --</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.teacherInfo?.matierePrincipale})
                </option>
              ))}
            </select>

            {classroom.teacherId && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Informations du titulaire</h3>
                {teachers.find(t => t.id === classroom.teacherId) ? (
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Nom:</span> {teachers.find(t => t.id === classroom.teacherId).name}</p>
                    <p><span className="font-medium">Matière:</span> {teachers.find(t => t.id === classroom.teacherId).teacherInfo?.matierePrincipale}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Informations non disponibles</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Détails de la classe</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium text-gray-600">Niveau</span>
              <span className="text-gray-800">{classroom.level}ème</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium text-gray-600">Section</span>
              <span className="text-gray-800">{classroom.section}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium text-gray-600">Capacité</span>
              <span className="text-gray-800">{classroom.capacity} élèves</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-600">Élèves inscrits</span>
              <div className="flex items-center">
                <span className="text-gray-800 mr-2">{students.length}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(students.length / classroom.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2 px-4 font-medium rounded-lg flex items-center transition-colors ${activeTab === 'students' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <FiUsers className="mr-2" />
            Élèves
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-4 font-medium rounded-lg flex items-center transition-colors ${activeTab === 'courses' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <FiBook className="mr-2" />
            Cours
          </button>
        </nav>
      </div>

      {activeTab === 'students' ? (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Ajouter un élève</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={availableStudents.length === 0}
              >
                <option value="">-- Sélectionner un élève --</option>
                {availableStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.nom} {student.postNom} {student.prenom} ({student.matricule})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddStudent}
                disabled={!selectedStudent}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <FiPlus className="mr-2" />
                Ajouter
              </button>
            </div>
            {availableStudents.length === 0 && (
              <p className="mt-3 text-sm text-gray-500 flex items-center">
                <FiCheck className="mr-2" />
                Tous les élèves sont déjà dans cette classe
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Liste des élèves ({students.length}/{classroom.capacity})
              </h2>
            </div>
            
            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post-nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.matricule}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.nom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.postNom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.prenom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleRemoveStudent(student.id)}
                            className="text-red-500 hover:text-red-700 flex items-center"
                          >
                            <FiTrash2 className="mr-1" />
                            Retirer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <FiUsers className="mx-auto text-4xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">Aucun élève dans cette classe</h3>
                <p className="mt-1 text-sm text-gray-500">Ajoutez des élèves en utilisant le formulaire ci-dessus</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Ajouter un cours</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={availableCourses.length === 0}
              >
                <option value="">-- Sélectionner un cours --</option>
                {availableCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} (Prof: {teachers.find(t => t.id === course.teacherId)?.name || 'Non assigné'})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddCourse}
                disabled={!selectedCourse}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <FiPlus className="mr-2" />
                Ajouter
              </button>
            </div>
            {availableCourses.length === 0 && (
              <p className="mt-3 text-sm text-gray-500 flex items-center">
                <FiCheck className="mr-2" />
                Tous les cours disponibles sont déjà assignés à cette classe
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Cours assignés ({courses.length})
              </h2>
            </div>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {courses.map(course => {
                  const teacher = teachers.find(t => t.id === course.teacherId);
                  return (
                    <div 
                      key={course.id}
                      className="border rounded-xl p-5 hover:shadow-md transition-all bg-white relative overflow-hidden"
                      style={{ borderLeft: `4px solid ${course.color || '#3b82f6'}` }}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 -mr-5 -mt-5 rounded-full opacity-10" style={{ backgroundColor: course.color }}></div>
                      <h3 className="font-bold text-lg relative z-10">{course.name}</h3>
                      <div className="mt-3 space-y-2 relative z-10">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium mr-2">Enseignant:</span>
                          {teacher?.name || 'Non assigné'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium mr-2">Couleur:</span>
                          <div 
                            className="w-4 h-4 rounded-full mr-2 border border-gray-200"
                            style={{ backgroundColor: course.color }}
                          ></div>
                          {course.color}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        className="mt-4 text-sm text-red-500 hover:text-red-700 flex items-center"
                      >
                        <FiTrash2 className="mr-1" />
                        Retirer de la classe
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <FiBook className="mx-auto text-4xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">Aucun cours assigné</h3>
                <p className="mt-1 text-sm text-gray-500">Ajoutez des cours en utilisant le formulaire ci-dessus</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}