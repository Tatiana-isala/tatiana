

'use client';
import { useState, useEffect } from 'react';
import { 
  getAllClassrooms, 
  getScheduleForClassroom, 
  getAllCourses, 
  createScheduleItem, 
  deleteScheduleItem,
  getCompleteSchedule,
  getClassroomsBySection
} from '@/lib/db';
import { Classroom, ScheduleItem, Course } from '@/lib/db';

export default function ScheduleManagement() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroomsBySection, setClassroomsBySection] = useState<Record<string, Classroom[]>>({});
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newItem, setNewItem] = useState({
    day: 'LUNDI',
    startTime: '08:00',
    endTime: '09:00',
    courseId: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [completeSchedule, setCompleteSchedule] = useState<
    Array<ScheduleItem & { classroom: Classroom | undefined; course: Course | null }>
  >([]);

  const days = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [classroomsData, coursesData, scheduleData, classroomsBySec] = await Promise.all([
          getAllClassrooms(),
          getAllCourses(),
          getCompleteSchedule(),
          getClassroomsBySection()
        ]);
        setClassrooms(classroomsData);
        setCourses(coursesData);
        setCompleteSchedule(scheduleData);
        setClassroomsBySection(classroomsBySec);
        
        if (classroomsData.length > 0) {
          const firstSection = Object.keys(classroomsBySec)[0];
          setSelectedSection(firstSection);
          if (classroomsBySec[firstSection].length > 0) {
            setSelectedClassroom(classroomsBySec[firstSection][0].id);
          }
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

  const handleAddItem = async () => {
    if (!selectedClassroom || !newItem.courseId) return;
    
    setIsLoading(true);
    try {
      await createScheduleItem({
        ...newItem,
        classroom_id: selectedClassroom
      });
      const updatedSchedule = await getScheduleForClassroom(selectedClassroom);
      setSchedule(updatedSchedule);
      const updatedCompleteSchedule = await getCompleteSchedule();
      setCompleteSchedule(updatedCompleteSchedule);
      setNewItem({
        day: 'LUNDI',
        startTime: '08:00',
        endTime: '09:00',
        courseId: ''
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'horaire:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      await deleteScheduleItem(itemId);
      const updatedSchedule = await getScheduleForClassroom(selectedClassroom!);
      setSchedule(updatedSchedule);
      const updatedCompleteSchedule = await getCompleteSchedule();
      setCompleteSchedule(updatedCompleteSchedule);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'horaire:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSchedule = selectedSection 
    ? schedule.filter(item => {
        const classroom = classrooms.find(c => c.id === item.classroom_id);
        return classroom?.section === selectedSection;
      })
    : schedule;

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
    <div className="p-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Gestion des horaires</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Liste des classes par section */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Classes par section</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {Object.entries(classroomsBySection).map(([section, classrooms]) => (
              <div key={section} className="mb-4">
                <h3 className="font-medium text-lg mb-2 bg-gray-100 p-2 rounded">
                  {section}
                </h3>
                <div className="space-y-2">
                  {classrooms.map(classroom => (
                    <div 
                      key={classroom.id}
                      onClick={() => {
                        setSelectedSection(section);
                        setSelectedClassroom(classroom.id);
                      }}
                      className={`p-3 rounded cursor-pointer transition-colors ${
                        selectedClassroom === classroom.id 
                          ? 'bg-blue-100 border-l-4 border-blue-500' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{classroom.name}</div>
                      <div className="text-sm text-gray-600">
                        {classroom.studentIds?.length || 0} élèves
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horaire de la classe sélectionnée */}
        <div className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow">
          {selectedClassroom ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Horaire pour {classrooms.find(c => c.id === selectedClassroom)?.name}
                <span className="text-sm text-gray-500 ml-2">
                  ({classrooms.find(c => c.id === selectedClassroom)?.section})
                </span>
              </h2>

              {/* Formulaire d'ajout */}
              <div className="bg-gray-50 p-4 rounded mb-6">
                <h3 className="font-medium mb-3">Ajouter un cours</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={newItem.day}
                    onChange={(e) => setNewItem({...newItem, day: e.target.value})}
                    className="p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={newItem.startTime}
                    onChange={(e) => setNewItem({...newItem, startTime: e.target.value})}
                    className="p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="time"
                    value={newItem.endTime}
                    onChange={(e) => setNewItem({...newItem, endTime: e.target.value})}
                    className="p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={newItem.courseId}
                    onChange={(e) => setNewItem({...newItem, courseId: e.target.value})}
                    className="p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un cours</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.courseId || isLoading}
                  className={`mt-3 bg-blue-500 text-white py-2 px-4 rounded transition-colors ${
                    isLoading || !newItem.courseId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                >
                  {isLoading ? 'Ajout en cours...' : 'Ajouter'}
                </button>
              </div>

              {/* Affichage de l'horaire */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Jour</th>
                      <th className="p-2 text-left">Heure</th>
                      <th className="p-2 text-left">Cours</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchedule.length > 0 ? (
                      filteredSchedule
                        .sort((a, b) => a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime))
                        .map(item => {
                          const course = courses.find(c => c.id === item.courseId);
                          return (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                              <td className="p-2">{item.day}</td>
                              <td className="p-2">{item.startTime} - {item.endTime}</td>
                              <td className="p-2">
                                <span 
                                  className="inline-block w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: course?.color || '#ccc' }}
                                ></span>
                                {course?.name || 'Cours inconnu'}
                              </td>
                              <td className="p-2">
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  disabled={isLoading}
                                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                >
                                  Supprimer
                                </button>
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500">
                          Aucun cours programmé pour cette classe
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Sélectionnez une classe pour voir son horaire</p>
          )}
        </div>
      </div>

      {/* Vue complète de tous les horaires */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Emploi du temps complet</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Section</th>
                <th className="p-2 text-left">Classe</th>
                <th className="p-2 text-left">Jour</th>
                <th className="p-2 text-left">Heure</th>
                <th className="p-2 text-left">Cours</th>
              </tr>
            </thead>
            <tbody>
              {completeSchedule
                .sort((a, b) => {
                  const aClassroomName = a.classroom?.name || '';
                  const bClassroomName = b.classroom?.name || '';
                  const aSection = a.classroom?.section || '';
                  const bSection = b.classroom?.section || '';
                  
                  return aSection.localeCompare(bSection) || 
                         aClassroomName.localeCompare(bClassroomName) || 
                         a.day.localeCompare(b.day) || 
                         a.startTime.localeCompare(b.startTime);
                })
                .map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{item.classroom?.section || 'Section inconnue'}</td>
                    <td className="p-2">{item.classroom?.name || 'Classe inconnue'}</td>
                    <td className="p-2">{item.day}</td>
                    <td className="p-2">{item.startTime} - {item.endTime}</td>
                    <td className="p-2">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.course?.color || '#ccc' }}
                      ></span>
                      {item.course?.name || 'Cours inconnu'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}