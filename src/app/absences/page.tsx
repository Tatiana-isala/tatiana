

'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getClassroomsForTeacher, getClassroomsBySection ,Classroom} from '@/lib/db';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { FiCalendar, FiClipboard, FiPieChart, FiUsers } from 'react-icons/fi';

export default function AbsencesPage() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        let classes: Classroom[];
        if (user?.role === 'enseignant') {
          classes = await getClassroomsForTeacher(user.id);
        } else {
          const classesBySection = await getClassroomsBySection();
          classes = Object.values(classesBySection).flat();
        }
        setClassrooms(classes);
      } catch (error) {
        console.error('Error loading classrooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClassrooms();
  }, [user]);

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des absences</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'enseignant' 
              ? 'Vos classes assignées' 
              : 'Toutes les classes de l\'établissement'}
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Rechercher une classe..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiUsers className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {filteredClassrooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FiClipboard className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Aucune classe trouvée
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Essayez une autre recherche' : 'Aucune classe disponible'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map(classroom => (
            <div key={classroom.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className={`p-4 ${getSectionColor(classroom.section)}`}>
                <h2 className="text-xl font-semibold text-white">{classroom.name}</h2>
                <p className="text-white opacity-90">{classroom.section}</p>
              </div>
              
              <div className="p-4">
                <div className="flex items-center text-gray-500 mb-3">
                  <FiUsers className="mr-2" />
                  <span>{classroom.studentIds?.length || 0} élèves</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Link
                    href={`/absences/record?classroomId=${classroom.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiCalendar />
                    <span>Présences</span>
                  </Link>
                  <Link
                    href={`/absences/history?classroomId=${classroom.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiPieChart />
                    <span>Statistiques</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Fonction utilitaire pour les couleurs par section
function getSectionColor(section: string): string {
  const colors: Record<string, string> = {
    'Général': 'bg-blue-600',
    'Commercial et Gestion': 'bg-green-600',
    'Pédagogie Générale': 'bg-purple-600',
    'Scientifique': 'bg-red-600',
    'Littéraire': 'bg-yellow-600',
    'Mécanique Générale': 'bg-indigo-600',
    'Electricité': 'bg-pink-600',
    'Mécanique Automobile': 'bg-orange-600',
    'Coupe et Couture': 'bg-teal-600'
  };
  
  return colors[section] || 'bg-gray-600';
}