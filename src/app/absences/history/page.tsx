// app/components/MultiLoading.tsx
'use client'
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const MultiLoading = () => {
  const [loadingA, setLoadingA] = useState(true);
  const [loadingB, setLoadingB] = useState(true);
  const [loadingC, setLoadingC] = useState(true);

  useEffect(() => {
    // Simule différents temps de chargement
    setTimeout(() => setLoadingA(false), 2000);
    setTimeout(() => setLoadingB(false), 4000);
    setTimeout(() => setLoadingC(false), 6000);
  }, []);

  const renderLoading = (label: string, loading: boolean) => (
    <div className="flex items-center gap-3 p-4 border rounded-xl shadow mb-3">
      {loading ? (
        <FaSpinner className="animate-spin text-blue-500 text-xl" />
      ) : (
        <div className="w-4 h-4 bg-green-500 rounded-full" />
      )}
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-5 text-center">État de chargement</h2>
      {renderLoading("Chargement des utilisateurs", loadingA)}
      {renderLoading("Connexion au serveur", loadingB)}
      {renderLoading("Chargement des données", loadingC)}
    </div>
  );
};

export default MultiLoading;

// 'use client'
// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { 
//     getClassroomById, 
//     getStudentsInClassroom, 
//     getClassroomAbsences,
//     justifyAbsence,Classroom,Student,Absence,
//     getAbsenceStatistics
// } from '@/lib/db';
// import { DailyAbsenceChart, MonthlyAbsenceChart, StudentAbsenceChart } from '@/components/AbsenceCharts';
// import LoadingSpinner from '@/components/LoadingSpinner';
// import { useRouter, useSearchParams } from 'next/navigation';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// export const dynamic = 'force-dynamic'; //
// export default function AbsenceHistoryPage() {
//     const { user } = useAuth();
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const classroomId = searchParams.get('classroomId');
    
//     const [classroom, setClassroom] = useState<Classroom | null>(null);
//     const [students, setStudents] = useState<Student[]>([]);
//     const [absences, setAbsences] = useState<Absence[]>([]);
//     const [startDate, setStartDate] = useState<Date | null>(null);
//     const [endDate, setEndDate] = useState<Date | null>(null);
//     const [stats, setStats] = useState<any>(null);
//     const [activeTab, setActiveTab] = useState('list');
//     const [isLoading, setIsLoading] = useState(true);
//     const [justification, setJustification] = useState('');
//     const [selectedAbsence, setSelectedAbsence] = useState<string | null>(null);

//     useEffect(() => {
//         if (!classroomId) {
//             router.push('/absences');
//             return;
//         }

//         const loadData = async () => {
//             try {
//                 const [classroomData, studentsData] = await Promise.all([
//                     getClassroomById(classroomId),
//                     getStudentsInClassroom(classroomId)
//                 ]);
                
//                 setClassroom(classroomData);
//                 setStudents(studentsData);
//                 loadAbsences();
//                 loadStats();
//             } catch (error) {
//                 console.error('Error loading data:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         loadData();
//     }, [classroomId, router]);

//     const loadAbsences = async () => {
//         if (!classroomId) return;
        
//         setIsLoading(true);
//         try {
//             let absencesData = await getClassroomAbsences(classroomId);
            
//             // Filtrage par date
//             if (startDate) {
//                 const start = startDate.toISOString().split('T')[0];
//                 absencesData = absencesData.filter(a => a.date >= start);
//             }
            
//             if (endDate) {
//                 const end = endDate.toISOString().split('T')[0];
//                 absencesData = absencesData.filter(a => a.date <= end);
//             }
            
//             setAbsences(absencesData);
//         } catch (error) {
//             console.error('Error loading absences:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const loadStats = async () => {
//         if (!classroomId) return;
        
//         try {
//             const statsData = await getAbsenceStatistics(classroomId);
//             setStats(statsData);
//         } catch (error) {
//             console.error('Error loading stats:', error);
//         }
//     };

//     const handleJustify = async (absenceId: string) => {
//         if (!justification) return;
        
//         setIsLoading(true);
//         try {
//             await justifyAbsence(absenceId, justification);
//             loadAbsences();
//             setJustification('');
//             setSelectedAbsence(null);
//         } catch (error) {
//             console.error('Error justifying absence:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const getStudentName = (studentId: string) => {
//         const student = students.find(s => s.id === studentId);
//         return student ? `${student.nom} ${student.prenom}` : 'Inconnu';
//     };

//     if (isLoading) {
//         return <LoadingSpinner />;
//     }

//     if (!classroom) {
//         return <div>Classe non trouvée</div>;
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-2xl font-bold mb-6">Historique des absences</h1>
//             <h2 className="text-xl mb-4">Classe: {classroom.name}</h2>
            
//             {/* Filtres */}
//             <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
//                 <div className="flex-1 min-w-[200px]">
//                     <label className="block mb-2 font-medium">Date de début:</label>
//                     <DatePicker
//                         selected={startDate}
//                         onChange={(date: Date | null) => setStartDate(date)}
//                         className="p-2 border rounded w-full"
//                         dateFormat="dd/MM/yyyy"
//                         isClearable
//                         placeholderText="Toutes dates"
//                     />
//                 </div>
//                 <div className="flex-1 min-w-[200px]">
//                     <label className="block mb-2 font-medium">Date de fin:</label>
//                     <DatePicker
//                         selected={endDate}
//                         onChange={(date: Date | null) => setEndDate(date)}
//                         className="p-2 border rounded w-full"
//                         dateFormat="dd/MM/yyyy"
//                         isClearable
//                         placeholderText="Toutes dates"
//                     />
//                 </div>
//                 <div className="flex items-end">
//                     <button
//                         onClick={loadAbsences}
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                         Appliquer les filtres
//                     </button>
//                 </div>
//             </div>

//             {/* Onglets */}
//             <div className="flex border-b mb-6">
//                 <button
//                     className={`px-4 py-2 ${activeTab === 'list' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
//                     onClick={() => setActiveTab('list')}
//                 >
//                     Liste des absences
//                 </button>
//                 <button
//                     className={`px-4 py-2 ${activeTab === 'stats' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
//                     onClick={() => setActiveTab('stats')}
//                 >
//                     Statistiques
//                 </button>
//             </div>

//             {/* Contenu des onglets */}
//             {activeTab === 'list' ? (
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élève</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {absences.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Aucune absence enregistrée</td>
//                                 </tr>
//                             ) : (
//                                 absences.map(absence => (
//                                     <tr key={absence.id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             {new Date(absence.date).toLocaleDateString('fr-FR')}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             {getStudentName(absence.studentId)}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             {absence.justified ? (
//                                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                     Justifiée
//                                                 </span>
//                                             ) : (
//                                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                     Non justifiée
//                                                 </span>
//                                             )}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                             {!absence.justified && (
//                                                 <button
//                                                     onClick={() => setSelectedAbsence(absence.id)}
//                                                     className="text-blue-600 hover:text-blue-900 mr-3"
//                                                 >
//                                                     Justifier
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <div className="space-y-8">
//                     {stats && (
//                         <>
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                                 <div className="bg-white p-4 rounded-lg shadow">
//                                     <DailyAbsenceChart data={stats.daily} />
//                                 </div>
//                                 <div className="bg-white p-4 rounded-lg shadow">
//                                     <MonthlyAbsenceChart data={stats.monthly} />
//                                 </div>
//                             </div>
//                             <div className="bg-white p-4 rounded-lg shadow">
//                                 <StudentAbsenceChart data={stats.byStudent} />
//                             </div>
//                         </>
//                     )}
//                 </div>
//             )}

//             {/* Modal de justification */}
//             {selectedAbsence && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-lg p-6 max-w-md w-full">
//                         <h3 className="text-lg font-medium mb-4">Justifier l'absence</h3>
//                         <textarea
//                             value={justification}
//                             onChange={(e) => setJustification(e.target.value)}
//                             className="w-full p-2 border rounded mb-4"
//                             rows={3}
//                             placeholder="Raison de l'absence..."
//                         />
//                         <div className="flex justify-end gap-2">
//                             <button
//                                 onClick={() => setSelectedAbsence(null)}
//                                 className="px-4 py-2 border rounded hover:bg-gray-100"
//                             >
//                                 Annuler
//                             </button>
//                             <button
//                                 onClick={() => handleJustify(selectedAbsence)}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                             >
//                                 Enregistrer
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
