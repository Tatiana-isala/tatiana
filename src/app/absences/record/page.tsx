

'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getClassroomById, getStudentsInClassroom, recordAbsences, getAbsenceStatistics, Classroom, Student } from '@/lib/db';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiUser, FiCalendar, FiCheck, FiX, FiSave } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RecordAbsencesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const classroom_id = searchParams.get('classroom_id');
  
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [absent_students, setAbsent_students] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!classroom_id) {
      router.push('/absences');
      return;
    }

    const loadData = async () => {
      try {
        const [classroomData, studentsData, statsData] = await Promise.all([
          getClassroomById(classroom_id),
          getStudentsInClassroom(classroom_id),
          getAbsenceStatistics(classroom_id)
        ]);
        
        setClassroom(classroomData);
        setStudents(studentsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [classroom_id, router]);

  const toggleStudentAbsence = (studentId: string) => {
    setAbsent_students(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (!user?.id || !classroom_id) return;

    setIsLoading(true);
    try {
      await recordAbsences(
        classroom_id,
        absent_students,
        date.toISOString().split('T')[0],
        user.id
      );
      
      setMessage('Présence enregistrée avec succès');
      setAbsent_students([]);
      // Recharger les stats après enregistrement
      const updatedStats = await getAbsenceStatistics(classroom_id);
      setStats(updatedStats);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error recording absences:', error);
      setMessage("Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!classroom) {
    return <div className="p-8 text-center text-gray-600">Classe non trouvée</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Enregistrement des absences</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <FiUser className="mr-2" />
          <h2 className="text-xl">Classe: <span className="font-medium">{classroom.name}</span></h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700">Date:</label>
              <div className="flex items-center">
                <FiCalendar className="mr-2 text-gray-500" />
                <DatePicker
                  selected={date}
                  onChange={(date: Date | null) => date && setDate(date)}
                  className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Sélectionner une date"
                />
              </div>
            </div>
            
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('Erreur') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message}
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <FiUser className="mr-2" /> Liste des élèves
              </h3>
              <div className="space-y-3">
                {students.map(student => (
                  <div 
                    key={student.id} 
                    className={`flex items-center p-4 rounded-lg border transition-all ${
                      absent_students.includes(student.id)
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`absent-${student.id}`}
                      checked={absent_students.includes(student.id)}
                      onChange={() => toggleStudentAbsence(student.id)}
                      className="mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`absent-${student.id}`} className="flex-1">
                      <div className="font-medium">
                        {student.nom} {student.prenom}
                      </div>
                      {student.matricule && (
                        <div className="text-sm text-gray-500">Matricule: {student.matricule}</div>
                      )}
                    </label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      absent_students.includes(student.id)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {absent_students.includes(student.id) ? 'Absent' : 'Présent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors w-full sm:w-auto"
            >
              <FiSave className="mr-2" />
              {isLoading ? 'Enregistrement en cours...' : 'Enregistrer les absences'}
            </button>
          </div>
          
          {/* Section Statistiques */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-medium text-lg text-gray-800 mb-4">Statistiques récentes</h3>
            
            {stats?.daily?.length > 0 ? (
              <>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Absences des 7 derniers jours</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.daily.slice(-7)}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Bar 
                          dataKey="count" 
                          fill="#8884d8" 
                          radius={[4, 4, 0, 0]}
                          name="Absences"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg shadow-xs">
                    <div className="text-sm font-medium text-gray-500">Total absences ce mois</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.monthly.find((m: any) => m.month === new Date().toISOString().slice(0,7))?.count || 0}
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-xs">
                    <div className="text-sm font-medium text-gray-500">Élèves souvent absents</div>
                    <div className="mt-2 space-y-2">
                      {stats.byStudent.slice(0, 3).map((student: any) => (
                        <div key={student.name} className="flex justify-between text-sm">
                          <span className="truncate max-w-[120px]">{student.name}</span>
                          <span className="font-medium">{student.count} absences</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Aucune donnée statistique disponible
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
