
// // 'use client'
// // import { useState, useEffect } from 'react';
// // import { getUnpaidStudents, getAllClassrooms, Classroom } from '@/lib/db';
// // import { FaSearch, FaMoneyBillWave, FaUserGraduate, FaFileInvoiceDollar, FaFilter } from 'react-icons/fa';
// // import { GiPayMoney } from 'react-icons/gi';

// // export default function UnpaidStudentsPage() {
// //   const [unpaidStudents, setUnpaidStudents] = useState<any[]>([]);
// //   const [classrooms, setClassrooms] = useState<Classroom[]>([]);
// //   const [selectedClassroom, setSelectedClassroom] = useState<string>('');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [totalBalance, setTotalBalance] = useState(0);

// //   useEffect(() => {
// //     const loadClassrooms = async () => {
// //       setLoading(true);
// //       try {
// //         const cls = await getAllClassrooms();
// //         setClassrooms(cls);
// //       } catch (error) {
// //         console.error(error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     loadClassrooms();
// //   }, []);

// //   useEffect(() => {
// //     const loadUnpaidStudents = async () => {
// //       setLoading(true);
// //       try {
// //         const unpaid = await getUnpaidStudents(selectedClassroom || undefined);
// //         setUnpaidStudents(unpaid);
        
// //         // Calculate total balance
// //         const total = unpaid.reduce((sum, { balance }) => sum + balance, 0);
// //         setTotalBalance(total);
// //       } catch (error) {
// //         console.error(error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     loadUnpaidStudents();
// //   }, [selectedClassroom]);

// //   const filteredStudents = unpaidStudents.filter(student => {
// //     const fullName = `${student.student.nom} ${student.student.postNom} ${student.student.prenom}`.toLowerCase();
// //     return fullName.includes(searchTerm.toLowerCase()) || 
// //            student.student.matricule.toLowerCase().includes(searchTerm.toLowerCase());
// //   });

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-7xl mx-auto">
// //         <div className="text-center mb-10">
// //           <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center">
// //             <GiPayMoney className="mr-3 text-red-600" />
// //             Gestion des Impayés
// //           </h1>
// //           <p className="mt-2 text-lg text-gray-600">Suivi des élèves avec des frais scolaires impayés</p>
// //         </div>

// //         <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mb-8">
// //           <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700">
// //             <h2 className="text-xl font-semibold text-white flex items-center">
// //               <FaFilter className="mr-2" />
// //               Filtres
// //             </h2>
// //           </div>
// //           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un élève</label>
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <FaSearch className="text-gray-400" />
// //                 </div>
// //                 <input
// //                   type="text"
// //                   placeholder="Nom, post-nom ou matricule..."
// //                   className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
// //             </div>
            
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par classe</label>
// //               <select
// //                 value={selectedClassroom}
// //                 onChange={(e) => setSelectedClassroom(e.target.value)}
// //                 className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
// //               >
// //                 <option value="">Toutes les classes</option>
// //                 {classrooms.map(cls => (
// //                   <option key={cls.id} value={cls.id}>
// //                     {cls.name} - {cls.section}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
// //           <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700">
// //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
// //               <h2 className="text-xl font-semibold text-white flex items-center">
// //                 <FaFileInvoiceDollar className="mr-2" />
// //                 Liste des Impayés
// //               </h2>
// //               <div className="mt-2 sm:mt-0 bg-red-800 text-white px-3 py-1 rounded-md text-sm font-medium">
// //                 Total impayé: {totalBalance.toLocaleString()} CDF
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className="p-6">
// //             {loading ? (
// //               <div className="flex justify-center items-center py-12">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
// //               </div>
// //             ) : filteredStudents.length === 0 ? (
// //               <div className="text-center py-12">
// //                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
// //                 </svg>
// //                 <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun impayé trouvé</h3>
// //                 <p className="mt-1 text-sm text-gray-500">Aucun élève ne correspond à vos critères de recherche</p>
// //               </div>
// //             ) : (
// //               <div className="overflow-x-auto">
// //                 <table className="min-w-full divide-y divide-gray-200">
// //                   <thead className="bg-gray-50">
// //                     <tr>
// //                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         <FaUserGraduate className="inline mr-1" /> Élève
// //                       </th>
// //                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Matricule
// //                       </th>
// //                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Classe
// //                       </th>
// //                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Total dû
// //                       </th>
// //                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Total payé
// //                       </th>
// //                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         <FaMoneyBillWave className="inline mr-1" /> Reste à payer
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="bg-white divide-y divide-gray-200">
// //                     {filteredStudents.map(({ student, classroom, totalDue, totalPaid, balance }) => (
// //                       <tr key={student.id} className="hover:bg-gray-50">
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <div className="flex items-center">
// //                             <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
// //                               <span className="text-red-600 font-medium">
// //                                 {student.nom.charAt(0)}{student.postNom.charAt(0)}
// //                               </span>
// //                             </div>
// //                             <div className="ml-4">
// //                               <div className="text-sm font-medium text-gray-900">
// //                                 {student.nom} {student.postNom} {student.prenom}
// //                               </div>
// //                               <div className="text-sm text-gray-500">
// //                                 {student.gender === 'M' ? 'Masculin' : 'Féminin'}
// //                               </div>
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                           {student.matricule}
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap">
// //                           <div className="text-sm text-gray-900">{classroom?.name || 'Non assigné'}</div>
// //                           <div className="text-sm text-gray-500">{classroom?.section}</div>
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
// //                           {totalDue.toLocaleString()} CDF
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
// //                           {totalPaid.toLocaleString()} CDF
// //                         </td>
// //                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-red-600">
// //                           {balance.toLocaleString()} CDF
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client'
// import { useState, useEffect } from 'react';
// import { getUnpaidStudents, getAllClassrooms, Classroom } from '@/lib/db';
// import { FaSearch, FaMoneyBillWave, FaUserGraduate, FaFileInvoiceDollar, FaFilter } from 'react-icons/fa';
// import { GiPayMoney } from 'react-icons/gi';

// interface Student {
//   id: string;
//   nom: string;
//   postNom: string;
//   prenom: string;
//   gender: string;
//   matricule: string;
// }

// interface UnpaidStudent {
//   student: Student;
//   classroom: Classroom | null;
//   totalDue: number;
//   totalPaid: number;
//   balance: number;
// }

// export default function UnpaidStudentsPage() {
//   const [unpaidStudents, setUnpaidStudents] = useState<UnpaidStudent[]>([]);
//   const [classrooms, setClassrooms] = useState<Classroom[]>([]);
//   const [selectedClassroom, setSelectedClassroom] = useState<string>('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [totalBalance, setTotalBalance] = useState(0);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadClassrooms = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const cls = await getAllClassrooms();
//         setClassrooms(cls);
//       } catch (err) {
//         console.error('Failed to load classrooms:', err);
//         setError('Échec du chargement des classes. Veuillez réessayer.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadClassrooms();
//   }, []);

//   useEffect(() => {
//     const loadUnpaidStudents = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const unpaid = await getUnpaidStudents(selectedClassroom || undefined);
//         setUnpaidStudents(unpaid);

//         // Calculate total balance
//         const total = unpaid.reduce((sum, { balance }) => sum + (balance || 0), 0);
//         setTotalBalance(total);
//       } catch (err) {
//         console.error('Failed to load unpaid students:', err);
//         setError('Échec du chargement des élèves impayés. Veuillez réessayer.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadUnpaidStudents();
//   }, [selectedClassroom]);

//   const filteredStudents = unpaidStudents.filter(student => {
//     if (!student?.student) return false;
    
//     const fullName = `${student.student.nom || ''} ${student.student.postNom || ''} ${student.student.prenom || ''}`.toLowerCase();
//     const matricule = student.student.matricule || '';
    
//     return fullName.includes(searchTerm.toLowerCase()) || 
//            matricule.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
//         <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
//           <div className="text-red-600 text-5xl mb-4">⚠️</div>
//           <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
//           >
//             Recharger la page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center">
//             <GiPayMoney className="mr-3 text-red-600" />
//             Gestion des Impayés
//           </h1>
//           <p className="mt-2 text-lg text-gray-600">Suivi des élèves avec des frais scolaires impayés</p>
//         </div>

//         <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mb-8">
//           <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700">
//             <h2 className="text-xl font-semibold text-white flex items-center">
//               <FaFilter className="mr-2" />
//               Filtres
//             </h2>
//           </div>
//           <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un élève</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaSearch className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Nom, post-nom ou matricule..."
//                   className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par classe</label>
//               <select
//                 value={selectedClassroom}
//                 onChange={(e) => setSelectedClassroom(e.target.value)}
//                 className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
//                 disabled={loading}
//               >
//                 <option value="">Toutes les classes</option>
//                 {classrooms.map(cls => (
//                   <option key={cls.id} value={cls.id}>
//                     {cls.name} - {cls.section}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
//           <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
//               <h2 className="text-xl font-semibold text-white flex items-center">
//                 <FaFileInvoiceDollar className="mr-2" />
//                 Liste des Impayés
//               </h2>
//               <div className="mt-2 sm:mt-0 bg-red-800 text-white px-3 py-1 rounded-md text-sm font-medium">
//                 Total impayé: {totalBalance.toLocaleString()} CDF
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             {loading ? (
//               <div className="flex justify-center items-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
//               </div>
//             ) : filteredStudents.length === 0 ? (
//               <div className="text-center py-12">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun impayé trouvé</h3>
//                 <p className="mt-1 text-sm text-gray-500">Aucun élève ne correspond à vos critères de recherche</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         <FaUserGraduate className="inline mr-1" /> Élève
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Matricule
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Classe
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Total dû
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Total payé
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         <FaMoneyBillWave className="inline mr-1" /> Reste à payer
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredStudents.map(({ student, classroom, totalDue, totalPaid, balance }) => (
//                       <tr key={student.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
//                               <span className="text-red-600 font-medium">
//                                 {student.nom?.charAt(0)}{student.postNom?.charAt(0)}
//                               </span>
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {student.nom} {student.postNom} {student.prenom}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 {student.gender === 'M' ? 'Masculin' : 'Féminin'}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {student.matricule}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{classroom?.name || 'Non assigné'}</div>
//                           <div className="text-sm text-gray-500">{classroom?.section}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                           {totalDue?.toLocaleString() || '0'} CDF
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
//                           {totalPaid?.toLocaleString() || '0'} CDF
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-red-600">
//                           {balance?.toLocaleString() || '0'} CDF
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client'
import { useState, useEffect } from 'react';
import { getUnpaidStudents, getAllClassrooms, Classroom } from '@/lib/db';
import { FaSearch, FaMoneyBillWave, FaUserGraduate, FaFileInvoiceDollar, FaFilter } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';

interface Student {
  id: string;
  nom?: string;
  postNom?: string;
  prenom?: string;
  gender?: string;
  matricule?: string;
}

interface UnpaidStudent {
  student: Student;
  classroom: Classroom | null;
  totalDue: number;
  totalPaid: number;
  balance: number;
}

export default function UnpaidStudentsPage() {
  const [unpaidStudents, setUnpaidStudents] = useState<UnpaidStudent[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClassrooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const cls = await getAllClassrooms();
        setClassrooms(cls);
      } catch (err) {
        console.error('Failed to load classrooms:', err);
        setError('Échec du chargement des classes. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    loadClassrooms();
  }, []);

  useEffect(() => {
    const loadUnpaidStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const unpaid = await getUnpaidStudents(selectedClassroom || undefined);
        setUnpaidStudents(unpaid);

        // Calculate total balance
        const total = unpaid.reduce((sum, { balance }) => sum + (balance || 0), 0);
        setTotalBalance(total);
      } catch (err) {
        console.error('Failed to load unpaid students:', err);
        setError('Échec du chargement des élèves impayés. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    loadUnpaidStudents();
  }, [selectedClassroom]);

  const filteredStudents = unpaidStudents.filter(student => {
    if (!student?.student) return false;
    
    const fullName = `${student.student.nom || ''} ${student.student.postNom || ''} ${student.student.prenom || ''}`.toLowerCase();
    const matricule = student.student.matricule || '';
    
    return fullName.includes(searchTerm.toLowerCase()) || 
           matricule.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center">
            <GiPayMoney className="mr-3 text-red-600" />
            Gestion des Impayés
          </h1>
          <p className="mt-2 text-lg text-gray-600">Suivi des élèves avec des frais scolaires impayés</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaFilter className="mr-2" />
              Filtres
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un élève</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Nom, post-nom ou matricule..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par classe</label>
              <select
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                disabled={loading}
              >
                <option value="">Toutes les classes</option>
                {classrooms.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {cls.section}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FaFileInvoiceDollar className="mr-2" />
                Liste des Impayés
              </h2>
              <div className="mt-2 sm:mt-0 bg-red-800 text-white px-3 py-1 rounded-md text-sm font-medium">
                Total impayé: {totalBalance.toLocaleString()} CDF
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun impayé trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">Aucun élève ne correspond à vos critères de recherche</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <FaUserGraduate className="inline mr-1" /> Élève
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matricule
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classe
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total dû
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total payé
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <FaMoneyBillWave className="inline mr-1" /> Reste à payer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map(({ student, classroom, totalDue, totalPaid, balance }) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 font-medium">
                                {(student.nom?.charAt(0) || '')}{(student.postNom?.charAt(0) || '')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.nom || ''} {student.postNom || ''} {student.prenom || ''}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.gender === 'M' ? 'Masculin' : 'Féminin'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.matricule || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{classroom?.name || 'Non assigné'}</div>
                          <div className="text-sm text-gray-500">{classroom?.section}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {totalDue?.toLocaleString() || '0'} CDF
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {totalPaid?.toLocaleString() || '0'} CDF
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-red-600">
                          {balance?.toLocaleString() || '0'} CDF
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
