// 'use client';
// import { useState, useEffect } from 'react';
// import { getAllClassrooms, getScheduleForClassroom, getAllCourses, getEnseignantsWithDetails } from '@/lib/db';
// import { Classroom, ScheduleItem, Course } from '@/lib/db';

// export default function ScheduleViewPage() {
//   const [classrooms, setClassrooms] = useState<Classroom[]>([]);
//   const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
//   const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [teachers, setTeachers] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [classroomsData, coursesData, teachersData] = await Promise.all([
//           getAllClassrooms(),
//           getAllCourses(),
//           getEnseignantsWithDetails()
//         ]);
//         setClassrooms(classroomsData);
//         setCourses(coursesData);
//         setTeachers(teachersData);
//         if (classroomsData.length > 0) {
//           setSelectedClassroom(classroomsData[0].id);
//         }
//       } catch (error) {
//         console.error("Erreur lors du chargement des données:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   useEffect(() => {
//     if (selectedClassroom) {
//       const loadSchedule = async () => {
//         setIsLoading(true);
//         try {
//           const scheduleData = await getScheduleForClassroom(selectedClassroom);
//           setSchedule(scheduleData);
//         } catch (error) {
//           console.error("Erreur lors du chargement de l'horaire:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       loadSchedule();
//     }
//   }, [selectedClassroom]);

//   // Grouper les cours par jour
//   const scheduleByDay = schedule.reduce((acc, item) => {
//     if (!acc[item.day]) {
//       acc[item.day] = [];
//     }
//     acc[item.day].push(item);
//     return acc;
//   }, {} as Record<string, ScheduleItem[]>);

//   const daysOrder = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-lg">Chargement en cours...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6 text-center">Emploi du temps</h1>
        
//         {/* Sélecteur de classe */}
//         <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionnez une classe :</label>
//           <select
//             value={selectedClassroom || ''}
//             onChange={(e) => setSelectedClassroom(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//           >
//             {classrooms.map(classroom => (
//               <option key={classroom.id} value={classroom.id}>
//                 {classroom.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Affichage de l'horaire */}
//         {selectedClassroom && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="p-4 border-b">
//               <h2 className="text-xl font-semibold">
//                 Emploi du temps - {classrooms.find(c => c.id === selectedClassroom)?.name}
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-6 gap-0">
//               {daysOrder.map(day => {
//                 const daySchedule = scheduleByDay[day] || [];
//                 daySchedule.sort((a, b) => a.startTime.localeCompare(b.startTime));

//                 return (
//                   <div key={day} className="border-r last:border-r-0">
//                     <div className="bg-blue-50 p-2 text-center font-medium border-b">
//                       {day.charAt(0) + day.slice(1).toLowerCase()}
//                     </div>
//                     <div className="divide-y">
//                       {daySchedule.length > 0 ? (
//                         daySchedule.map(item => {
//                           const course = courses.find(c => c.id === item.courseId);
//                           const teacher = teachers.find(t => t.id === course?.teacherId);

//                           return (
//                             <div 
//                               key={item.id} 
//                               className="p-3"
//                               style={{ borderLeft: `4px solid ${course?.color || '#ccc'}` }}
//                             >
//                               <div className="font-medium text-sm text-gray-500">
//                                 {item.startTime} - {item.endTime}
//                               </div>
//                               <div className="font-semibold mt-1">
//                                 {course?.name || 'Cours inconnu'}
//                               </div>
//                               <div className="text-sm text-gray-600 mt-1">
//                                 {teacher?.name || 'Enseignant non spécifié'}
//                               </div>
//                               {teacher?.teacherInfo?.matierePrincipale && (
//                                 <div className="text-xs text-gray-500 mt-1">
//                                   {teacher.teacherInfo.matierePrincipale}
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })
//                       ) : (
//                         <div className="p-4 text-center text-gray-500 text-sm">
//                           Pas de cours
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import { 
  getAllClassrooms, 
  getScheduleForClassroom, 
  getAllCourses, 
  getEnseignantsWithDetails,
  getAllSections
} from '@/lib/db';
import { Classroom, ScheduleItem, Course } from '@/lib/db';

export default function ScheduleViewPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [filterSection, setFilterSection] = useState<string>('');
  const [sections, setSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [classroomsData, coursesData, teachersData] = await Promise.all([
          getAllClassrooms(),
          getAllCourses(),
          getEnseignantsWithDetails()
        ]);
        setClassrooms(classroomsData);
        setCourses(coursesData);
        setTeachers(teachersData);
        setSections(getAllSections());
        if (classroomsData.length > 0) {
          setSelectedClassroom(classroomsData[0].id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClassroom) {
      const loadSchedule = async () => {
        setIsLoading(true);
        try {
          const scheduleData = await getScheduleForClassroom(selectedClassroom);
          setSchedule(scheduleData);
        } catch (error) {
          console.error("Erreur lors du chargement de l'horaire:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadSchedule();
    }
  }, [selectedClassroom]);

  const filteredClassrooms = classrooms.filter(c => 
    !filterSection || c.section === filterSection
  );

  // Grouper les cours par jour
  const scheduleByDay = schedule.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  const daysOrder = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Emploi du temps</h1>
        
        {/* Sélecteur de classe */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section :</label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les sections</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Classe :</label>
              <select
                value={selectedClassroom || ''}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                {filteredClassrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} - {classroom.section}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Affichage de l'horaire */}
        {selectedClassroom && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Emploi du temps - {classrooms.find(c => c.id === selectedClassroom)?.name}
              </h2>
              <div className="text-sm text-gray-500">
                {classrooms.find(c => c.id === selectedClassroom)?.section}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-0">
              {daysOrder.map(day => {
                const daySchedule = scheduleByDay[day] || [];
                daySchedule.sort((a, b) => a.startTime.localeCompare(b.startTime));

                return (
                  <div key={day} className="border-r last:border-r-0">
                    <div className="bg-blue-50 p-2 text-center font-medium border-b">
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </div>
                    <div className="divide-y min-h-[300px]">
                      {daySchedule.length > 0 ? (
                        daySchedule.map(item => {
                          const course = courses.find(c => c.id === item.courseId);
                          const teacher = teachers.find(t => t.id === course?.teacherId);

                          return (
                            <div 
                              key={item.id} 
                              className="p-3 hover:bg-gray-50 transition-colors"
                              style={{ borderLeft: `4px solid ${course?.color || '#ccc'}` }}
                            >
                              <div className="font-medium text-sm text-gray-500">
                                {item.startTime} - {item.endTime}
                              </div>
                              <div className="font-semibold mt-1">
                                {course?.name || 'Cours inconnu'}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {teacher?.name || 'Enseignant non spécifié'}
                              </div>
                              {teacher?.teacherInfo?.matierePrincipale && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {teacher.teacherInfo.matierePrincipale}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm h-full flex items-center justify-center">
                          Pas de cours
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}