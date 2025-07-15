
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
//   getStudentsInClassroom
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
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (id) {
//       loadData();
//     }
//   }, [id]);

//   const loadData = async () => {
//     setIsLoading(true);
//     try {
//       const [classroomData, teachersData, studentsData, allStudentsData] = await Promise.all([
//         getClassroomById(id as string),
//         getEnseignantsWithDetails(),
//         getStudentsInClassroom(id as string),
//         getAllStudents()
//       ]);

//       setClassroom(classroomData);
//       setTeachers(teachersData);
//       setStudents(studentsData);
//       setAllStudents(allStudentsData);

//       // Filtrer les élèves disponibles (ceux qui ne sont pas déjà dans cette classe)
//       const studentsInClass = studentsData.map(s => s.id);
//       setAvailableStudents(
//         allStudentsData.filter(student => !studentsInClass.includes(student.id))
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
// const handleAddStudent = async () => {
//     if (!selectedStudent) return;

//     try {
//         await addStudentToClassroom(classroom.id, selectedStudent);
//         setSelectedStudent('');
//         await loadData();
//     } catch (error) {
//         console.error('Erreur lors de l\'ajout de l\'élève:', error);
//         if (error instanceof Error) {
//             alert(error.message);
//         } else {
//             alert('Une erreur est survenue lors de l\'ajout de l\'élève');
//         }
//     }
// };

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

//       <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//         <h2 className="text-xl font-semibold mb-4">Ajouter un élève</h2>
//         <div className="flex gap-2">
//           <select
//             className="flex-1 p-2 border rounded"
//             value={selectedStudent}
//             onChange={(e) => setSelectedStudent(e.target.value)}
//             disabled={availableStudents.length === 0}
//           >
//             <option value="">-- Sélectionner un élève --</option>
//             {availableStudents.map(student => (
//               <option key={student.id} value={student.id}>
//                 {student.nom} {student.postNom} {student.prenom} ({student.matricule})
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={handleAddStudent}
//             disabled={!selectedStudent}
//             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
//           >
//             Ajouter
//           </button>
//         </div>
//         {availableStudents.length === 0 && (
//           <p className="mt-2 text-sm text-gray-500">Tous les élèves sont déjà dans cette classe</p>
//         )}
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Élèves de la classe ({students.length}/{classroom.capacity})</h2>
//         {students.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="py-2 px-4 border-b">Matricule</th>
//                   <th className="py-2 px-4 border-b">Nom</th>
//                   <th className="py-2 px-4 border-b">Post-nom</th>
//                   <th className="py-2 px-4 border-b">Prénom</th>
//                   <th className="py-2 px-4 border-b">Niveau</th>
//                   <th className="py-2 px-4 border-b">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {students.map((student) => (
//                   <tr key={student.id} className="hover:bg-gray-50">
//                     <td className="py-2 px-4 border-b text-center">{student.matricule}</td>
//                     <td className="py-2 px-4 border-b text-center">{student.nom}</td>
//                     <td className="py-2 px-4 border-b text-center">{student.postNom}</td>
//                     <td className="py-2 px-4 border-b text-center">{student.prenom}</td>
//                     <td className="py-2 px-4 border-b text-center">{student.niveauEtude}</td>
//                     <td className="py-2 px-4 border-b text-center">
//                       <button
//                         onClick={() => handleRemoveStudent(student.id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         Retirer
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p>Aucun élève dans cette classe pour le moment.</p>
//         )}
//       </div>
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
    return <div className="p-4">Chargement...</div>;
  }

  if (!classroom) {
    return <div className="p-4">Classe non trouvée</div>;
  }

  return (
    <div className="p-4">
      <button 
        onClick={() => router.push('/classes')}
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        &larr; Retour à la liste
      </button>

      <h1 className="text-2xl font-bold mb-4">Détails de la classe: {classroom.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Informations</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Niveau:</span> {classroom.level}ème</p>
            <p><span className="font-medium">Section:</span> {classroom.section}</p>
            <p><span className="font-medium">Capacité:</span> {classroom.capacity} élèves</p>
            <p><span className="font-medium">Élèves inscrits:</span> {students.length}/{classroom.capacity}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Professeur titulaire</h2>
          <select
            className="w-full p-2 border rounded mb-4"
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
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <p className="font-medium">Informations du titulaire:</p>
              {teachers.find(t => t.id === classroom.teacherId) ? (
                <div>
                  <p>Nom: {teachers.find(t => t.id === classroom.teacherId).name}</p>
                  <p>Matière principale: {teachers.find(t => t.id === classroom.teacherId).teacherInfo?.matierePrincipale}</p>
                </div>
              ) : (
                <p>Informations non disponibles</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-2 px-4 font-medium ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Élèves
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-4 font-medium ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Cours
          </button>
        </nav>
      </div>

      {activeTab === 'students' ? (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Ajouter un élève</h2>
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 border rounded"
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
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                Ajouter
              </button>
            </div>
            {availableStudents.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">Tous les élèves sont déjà dans cette classe</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Élèves de la classe ({students.length}/{classroom.capacity})</h2>
            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Matricule</th>
                      <th className="py-2 px-4 border-b">Nom</th>
                      <th className="py-2 px-4 border-b">Post-nom</th>
                      <th className="py-2 px-4 border-b">Prénom</th>
                      <th className="py-2 px-4 border-b">Niveau</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-center">{student.matricule}</td>
                        <td className="py-2 px-4 border-b text-center">{student.nom}</td>
                        <td className="py-2 px-4 border-b text-center">{student.postNom}</td>
                        <td className="py-2 px-4 border-b text-center">{student.prenom}</td>
                        <td className="py-2 px-4 border-b text-center">{student.niveauEtude}</td>
                        <td className="py-2 px-4 border-b text-center">
                          <button
                            onClick={() => handleRemoveStudent(student.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Retirer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Aucun élève dans cette classe pour le moment.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Ajouter un cours</h2>
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 border rounded"
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
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                Ajouter
              </button>
            </div>
            {availableCourses.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">Tous les cours disponibles sont déjà assignés à cette classe</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cours de la classe ({courses.length})</h2>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => {
                  const teacher = teachers.find(t => t.id === course.teacherId);
                  return (
                    <div 
                      key={course.id} 
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      style={{ borderLeft: `4px solid ${course.color}` }}
                    >
                      <h3 className="font-bold text-lg">{course.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Enseignant: {teacher?.name || 'Non assigné'}
                      </p>
                      <div className="flex items-center mt-2">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: course.color }}
                        ></div>
                        <span className="text-xs text-gray-500">{course.color}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        className="mt-2 text-sm text-red-500 hover:text-red-700"
                      >
                        Retirer de la classe
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Aucun cours assigné à cette classe pour le moment.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}