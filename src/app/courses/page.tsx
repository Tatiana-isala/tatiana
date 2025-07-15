// 'use client';
// import { useState, useEffect } from 'react';
// import { getAllCourses, Course,createCourse, getEnseignantsWithDetails } from '@/lib/db';
// import { FaPlus, FaTrash } from 'react-icons/fa';

// export default function CoursesPage() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [teachers, setTeachers] = useState<any[]>([]);
//   const [newCourse, setNewCourse] = useState({
//     name: '',
//     teacherId: '',
//     color: '#3b82f6' // Couleur bleue par défaut
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [coursesData, teachersData] = await Promise.all([
//           getAllCourses(),
//           getEnseignantsWithDetails()
//         ]);
//         setCourses(coursesData);
//         setTeachers(teachersData);
//         if (teachersData.length > 0) {
//           setNewCourse(prev => ({ ...prev, teacherId: teachersData[0].id }));
//         }
//       } catch (error) {
//         console.error('Erreur lors du chargement des données:', error);
//       }
//     };
//     loadData();
//   }, []);

//   const handleCreateCourse = async () => {
//     if (!newCourse.name || !newCourse.teacherId) return;

//     try {
//       const createdCourse = await createCourse(newCourse);
//       setCourses([...courses, createdCourse]);
//       setNewCourse({
//         name: '',
//         teacherId: teachers[0]?.id || '',
//         color: '#3b82f6'
//       });
//     } catch (error) {
//       console.error('Erreur lors de la création du cours:', error);
//       alert("Une erreur est survenue lors de la création du cours");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Gestion des Cours</h1>
        
//         {/* Formulaire de création */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-xl font-semibold mb-4">Créer un nouveau cours</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Nom du cours *</label>
//               <input
//                 type="text"
//                 value={newCourse.name}
//                 onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Ex: Mathématiques"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant *</label>
//               <select
//                 value={newCourse.teacherId}
//                 onChange={(e) => setNewCourse({...newCourse, teacherId: e.target.value})}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               >
//                 {teachers.map(teacher => (
//                   <option key={teacher.id} value={teacher.id}>
//                     {teacher.name} - {teacher.teacherInfo?.matierePrincipale}
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
//               <div className="flex items-center">
//                 <input
//                   type="color"
//                   value={newCourse.color}
//                   onChange={(e) => setNewCourse({...newCourse, color: e.target.value})}
//                   className="w-10 h-10 cursor-pointer"
//                 />
//                 <span className="ml-2 text-sm">{newCourse.color}</span>
//               </div>
//             </div>
//           </div>
          
//           <button
//             onClick={handleCreateCourse}
//             className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           >
//             <FaPlus className="mr-2" /> Créer le cours
//           </button>
//         </div>
        
//         {/* Liste des cours existants */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-4">Liste des cours ({courses.length})</h2>
          
//           {courses.length === 0 ? (
//             <p className="text-gray-500">Aucun cours créé pour le moment</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {courses.map(course => {
//                 const teacher = teachers.find(t => t.id === course.teacherId);
//                 return (
//                   <div 
//                     key={course.id} 
//                     className="border rounded-lg p-4 relative"
//                     style={{ borderLeft: `4px solid ${course.color}` }}
//                   >
//                     <div 
//                       className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
//                       // onClick={() => handleDelete(course.id)}
//                     >
//                       <FaTrash />
//                     </div>
//                     <h3 className="font-bold text-lg mb-1">{course.name}</h3>
//                     <p className="text-sm text-gray-600 mb-2">
//                       Enseignant: {teacher?.name || 'Non assigné'}
//                     </p>
//                     <div className="flex items-center">
//                       <div 
//                         className="w-4 h-4 rounded-full mr-2"
//                         style={{ backgroundColor: course.color }}
//                       ></div>
//                       <span className="text-xs text-gray-500">{course.color}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';
// import { useState, useEffect } from 'react';
// import { 
//   getAllCourses, 
//   Course,
//   createCourse, 
//   getEnseignantsWithDetails,
//   getAllClassrooms,
//   assignCourseToClassroom
// } from '@/lib/db';
// import { FaPlus, FaTrash } from 'react-icons/fa';

// export default function CoursesPage() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [teachers, setTeachers] = useState<any[]>([]);
//   const [classrooms, setClassrooms] = useState<any[]>([]);
//   const [newCourse, setNewCourse] = useState({
//     name: '',
//     teacherId: '',
//     classroomId: '',
//     color: '#3b82f6'
//   });
//   const [step, setStep] = useState(1); // 1: Création cours, 2: Assignation classe

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [coursesData, teachersData, classroomsData] = await Promise.all([
//           getAllCourses(),
//           getEnseignantsWithDetails(),
//           getAllClassrooms()
//         ]);
//         setCourses(coursesData);
//         setTeachers(teachersData);
//         setClassrooms(classroomsData);
//         if (teachersData.length > 0) {
//           setNewCourse(prev => ({ ...prev, teacherId: teachersData[0].id }));
//         }
//         if (classroomsData.length > 0) {
//           setNewCourse(prev => ({ ...prev, classroomId: classroomsData[0].id }));
//         }
//       } catch (error) {
//         console.error('Erreur lors du chargement des données:', error);
//       }
//     };
//     loadData();
//   }, []);

//   const handleCreateCourse = async () => {
//     if (!newCourse.name || !newCourse.teacherId) return;

//     try {
//       // Créer le cours
//       const createdCourse = await createCourse({
//         name: newCourse.name,
//         teacherId: newCourse.teacherId,
//         color: newCourse.color,
//         isActive: true
//       });

//       // Assigner le cours à la classe sélectionnée
//       if (newCourse.classroomId) {
//         await assignCourseToClassroom(
//           createdCourse.id,
//           newCourse.classroomId,
//           newCourse.teacherId
//         );
//       }

//       setCourses([...courses, createdCourse]);
//       setNewCourse({
//         name: '',
//         teacherId: teachers[0]?.id || '',
//         classroomId: classrooms[0]?.id || '',
//         color: '#3b82f6'
//       });
//       setStep(1);
//       alert("Cours créé et assigné avec succès!");
//     } catch (error) {
//       console.error('Erreur lors de la création du cours:', error);
//       alert("Une erreur est survenue lors de la création du cours");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Gestion des Cours</h1>
        
//         {/* Formulaire de création */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-xl font-semibold mb-4">
//             {step === 1 ? 'Créer un nouveau cours' : 'Assigner le cours à une classe'}
//           </h2>
          
//           {step === 1 ? (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Nom du cours *</label>
//                 <input
//                   type="text"
//                   value={newCourse.name}
//                   onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                   placeholder="Ex: Mathématiques"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant *</label>
//                 <select
//                   value={newCourse.teacherId}
//                   onChange={(e) => setNewCourse({...newCourse, teacherId: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-md"
//                 >
//                   {teachers.map(teacher => (
//                     <option key={teacher.id} value={teacher.id}>
//                       {teacher.name} - {teacher.teacherInfo?.matierePrincipale}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
//                 <div className="flex items-center">
//                   <input
//                     type="color"
//                     value={newCourse.color}
//                     onChange={(e) => setNewCourse({...newCourse, color: e.target.value})}
//                     className="w-10 h-10 cursor-pointer"
//                   />
//                   <span className="ml-2 text-sm">{newCourse.color}</span>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Classe *</label>
//               <select
//                 value={newCourse.classroomId}
//                 onChange={(e) => setNewCourse({...newCourse, classroomId: e.target.value})}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               >
//                 {classrooms.map(classroom => (
//                   <option key={classroom.id} value={classroom.id}>
//                     {classroom.name} - {classroom.section}
//                   </option>
//                 ))}
//               </select>
//               <p className="mt-2 text-sm text-gray-500">
//                 Ce cours sera enseigné par {teachers.find(t => t.id === newCourse.teacherId)?.name} dans cette classe
//               </p>
//             </div>
//           )}
          
//           <div className="flex justify-between">
//             {step === 2 && (
//               <button
//                 onClick={() => setStep(1)}
//                 className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
//               >
//                 Retour
//               </button>
//             )}
            
//             {step === 1 ? (
//               <button
//                 onClick={() => setStep(2)}
//                 className="ml-auto flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                 disabled={!newCourse.name || !newCourse.teacherId}
//               >
//                 Suivant <FaPlus className="ml-2" />
//               </button>
//             ) : (
//               <button
//                 onClick={handleCreateCourse}
//                 className="ml-auto flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//               >
//                 Confirmer la création <FaPlus className="ml-2" />
//               </button>
//             )}
//           </div>
//         </div>
        
//         {/* Liste des cours existants */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-4">Liste des cours ({courses.length})</h2>
          
//           {courses.length === 0 ? (
//             <p className="text-gray-500">Aucun cours créé pour le moment</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {courses.map(course => {
//                 const teacher = teachers.find(t => t.id === course.teacherId);
//                 return (
//                   <div 
//                     key={course.id} 
//                     className="border rounded-lg p-4 relative"
//                     style={{ borderLeft: `4px solid ${course.color}` }}
//                   >
//                     <div 
//                       className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
//                       // onClick={() => handleDelete(course.id)}
//                     >
//                       <FaTrash />
//                     </div>
//                     <h3 className="font-bold text-lg mb-1">{course.name}</h3>
//                     <p className="text-sm text-gray-600 mb-2">
//                       Enseignant: {teacher?.name || 'Non assigné'}
//                     </p>
//                     <div className="flex items-center">
//                       <div 
//                         className="w-4 h-4 rounded-full mr-2"
//                         style={{ backgroundColor: course.color }}
//                       ></div>
//                       <span className="text-xs text-gray-500">{course.color}</span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import { 
  getAllCourses, 
  Course,
  createCourse, 
  getEnseignantsWithDetails,
  getAllClassrooms,
  assignCourseToClassroom
} from '@/lib/db';
import { FaPlus, FaTrash, FaChevronRight } from 'react-icons/fa';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [newCourse, setNewCourse] = useState({
    name: '',
    teacherId: '',
    classroomId: '',
    color: '#3b82f6'
  });
  const [step, setStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, teachersData, classroomsData] = await Promise.all([
          getAllCourses(),
          getEnseignantsWithDetails(),
          getAllClassrooms()
        ]);
        setCourses(coursesData);
        setTeachers(teachersData);
        setClassrooms(classroomsData);
        if (teachersData.length > 0) {
          setNewCourse(prev => ({ ...prev, teacherId: teachersData[0].id }));
        }
        if (classroomsData.length > 0) {
          setNewCourse(prev => ({ ...prev, classroomId: classroomsData[0].id }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    loadData();
  }, []);

  const handleCreateCourse = async () => {
    if (!newCourse.name || !newCourse.teacherId) return;

    try {
      const createdCourse = await createCourse({
        name: newCourse.name,
        teacherId: newCourse.teacherId,
        color: newCourse.color,
        isActive: true
      });

      if (newCourse.classroomId) {
        await assignCourseToClassroom(
          createdCourse.id,
          newCourse.classroomId,
          newCourse.teacherId
        );
      }

      setCourses([...courses, createdCourse]);
      setNewCourse({
        name: '',
        teacherId: teachers[0]?.id || '',
        classroomId: classrooms[0]?.id || '',
        color: '#3b82f6'
      });
      setStep(1);
      alert("Cours créé et assigné avec succès!");
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
      alert("Une erreur est survenue lors de la création du cours");
    }
  };

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Cours</h1>
        
        {/* Formulaire de création */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {step === 1 ? 'Créer un nouveau cours' : 'Assigner le cours à une classe'}
          </h2>
          
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du cours *</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Mathématiques"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant *</label>
                <select
                  value={newCourse.teacherId}
                  onChange={(e) => setNewCourse({...newCourse, teacherId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.teacherInfo?.matierePrincipale}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={newCourse.color}
                    onChange={(e) => setNewCourse({...newCourse, color: e.target.value})}
                    className="w-10 h-10 cursor-pointer rounded-md border border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">{newCourse.color}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Classe *</label>
              <select
                value={newCourse.classroomId}
                onChange={(e) => setNewCourse({...newCourse, classroomId: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} - {classroom.section}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Enseignant: {teachers.find(t => t.id === newCourse.teacherId)?.name}
              </p>
            </div>
          )}
          
          <div className="flex justify-between">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Retour
              </button>
            )}
            
            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="ml-auto flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={!newCourse.name || !newCourse.teacherId}
              >
                Suivant <FaChevronRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleCreateCourse}
                className="ml-auto flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Confirmer <FaPlus className="ml-2" />
              </button>
            )}
          </div>
        </div>
        
        {/* Liste des cours existants */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Liste des cours ({courses.length})</h2>
          
          {courses.length === 0 ? (
            <p className="text-gray-500">Aucun cours créé pour le moment</p>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {currentCourses.map(course => {
                  const teacher = teachers.find(t => t.id === course.teacherId);
                  
                  return (
                    <div 
                      key={course.id} 
                      className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-5 h-5 rounded-full mr-3 flex-shrink-0"
                          style={{ backgroundColor: course.color }}
                        ></div>
                        <div>
                          <h3 className="font-medium text-gray-800">{course.name}</h3>
                          <div className="text-sm text-gray-500">
                            <span>Enseignant: {teacher?.name || 'Non assigné'}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-red-400 hover:text-red-600 p-1"
                        // onClick={() => handleDelete(course.id)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <nav className="inline-flex rounded-md shadow">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 border ${currentPage === number 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                      >
                        {number}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}