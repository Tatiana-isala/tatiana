'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllClassrooms, 
  createClassroom, 
  assignTeacherToClassroom,
  getEnseignantsWithDetails,
  Classroom,
  ClassroomFormData
} from '@/lib/db';

export default function ClassManagementPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [newClassroom, setNewClassroom] = useState<ClassroomFormData>({
    name: '',
    level: 6,
    section: 'A',
    capacity: 30,
    teacherId: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [classroomsData, teachersData] = await Promise.all([
        getAllClassrooms(),
        getEnseignantsWithDetails()
      ]);
      setClassrooms(classroomsData);
      setTeachers(teachersData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClassroom = async () => {
    if (!newClassroom.name) {
      alert('Veuillez entrer un nom pour la classe');
      return;
    }

    try {
      await createClassroom(newClassroom);
      setNewClassroom({
        name: '',
        level: 6,
        section: 'A',
        capacity: 30,
        teacherId: null
      });
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la création de la classe:', error);
    }
  };

  const handleAssignTeacher = async (classroomId: string, teacherId: string | null) => {
    try {
      await assignTeacherToClassroom(classroomId, teacherId);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de l\'assignation du professeur:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="p-4">
      
      

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Liste des Classes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b ">Nom</th>
                <th className="py-2 px-4 border-b ">Niveau</th>
                <th className="py-2 px-4 border-b ">Section</th>
                <th className="py-2 px-4 border-b ">Capacité</th>
                <th className="py-2 px-4 border-b ">Titulaire</th>
                <th className="py-2 px-4 border-b ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((classroom) => (
                <tr key={classroom.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b  text-center">{classroom.name}</td>
                  <td className="py-2 px-4 border-b  text-center">{classroom.level}ème</td>
                  <td className="py-2 px-4 border-b  text-center">{classroom.section}</td>
                  <td className="py-2 px-4 border-b  text-center">{classroom.capacity}</td>
                  <td className="py-2 px-4 border-b ">
                    <select
                      className="w-full p-1 border rounded"
                      value={classroom.teacherId || ''}
                      onChange={(e) => handleAssignTeacher(classroom.id, e.target.value || null)}
                    >
                      <option value="">-- Aucun titulaire --</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} ({teacher.teacherInfo?.matierePrincipale})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b  text-center">
                    <button
                      onClick={() => router.push(`/classes/${classroom.id}`)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Détails
                    </button>
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