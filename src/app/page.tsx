// 'use client';
// import { useState, useEffect } from 'react';
// import { registerStudent, getStudents, syncWithSupabase } from '../lib/db';
// import type { Student, StudentFormData } from '../lib/db';

// export default function StudentRegistry() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [formData, setFormData] = useState<StudentFormData>({
//     name: '',
//     age: '',
//     dayOfRegistration: new Date().toISOString().split('T')[0],
//     school: ''
//   });
//   const [isOnline, setIsOnline] = useState(true);
//   const [status, setStatus] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Gestion du statut réseau
//   useEffect(() => {
//     const handleOnlineStatus = () => {
//       const online = navigator.onLine;
//       setIsOnline(online);
//       if (online) handleSync();
//     };

//     handleOnlineStatus();
//     window.addEventListener('online', handleOnlineStatus);
//     window.addEventListener('offline', handleOnlineStatus);

//     return () => {
//       window.removeEventListener('online', handleOnlineStatus);
//       window.removeEventListener('offline', handleOnlineStatus);
//     };
//   }, []);

//   // Chargement initial
//   useEffect(() => {
//     loadStudents();
//   }, []);

//   const loadStudents = async () => {
//     setIsLoading(true);
//     try {
//       const data = await getStudents();
//       setStudents(data);
//     } catch (error) {
//       setStatus('Erreur de chargement des étudiants');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleSync = async () => {
//   setIsLoading(true);
//   setStatus('Synchronisation en cours...');
//   try {
//     const count = await syncWithSupabase();
//     await loadStudents();
//     if (count > 0) {
//       setStatus(`${count} étudiants synchronisés`);
//     } else {
//       setStatus('Déjà à jour');
//     }
//   } catch (error: any) {
//     console.error('Erreur de synchronisation détaillée:', error);
//     setStatus(error && error.message ? `Erreur de synchronisation: ${error.message}` : 'Erreur de synchronisation inattendue');
//   } finally {
//     setIsLoading(false);
//     setTimeout(() => setStatus(''), 3000);
//   }
// };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await registerStudent(formData);
//       setFormData({
//         name: '',
//         age: '',
//         dayOfRegistration: new Date().toISOString().split('T')[0],
//         school: ''
//       });
//       await loadStudents();
//       if (isOnline) handleSync();
//     } catch (error) {
//       setStatus("Erreur d'enregistrement");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-4xl">
//       <h1 className="text-3xl font-bold mb-6 text-center">Registre des Étudiants</h1>
      
//       {/* Formulaire */}
//       <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium">Nom complet</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div className="space-y-2">
//             <label className="block text-sm font-medium">Âge</label>
//             <input
//               type="number"
//               name="age"
//               value={formData.age}
//               onChange={handleChange}
//               required
//               min="5"
//               max="25"
//               className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div className="space-y-2">
//             <label className="block text-sm font-medium">Date d'inscription</label>
//             <input
//               type="date"
//               name="dayOfRegistration"
//               value={formData.dayOfRegistration}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div className="space-y-2">
//             <label className="block text-sm font-medium">École</label>
//             <input
//               type="text"
//               name="school"
//               value={formData.school}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
        
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="mt-6 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {isLoading ? 'Enregistrement...' : 'Enregistrer l\'étudiant'}
//         </button>
//       </form>

//       {/* Statut et synchronisation */}
//       <div className="mb-6 space-y-4">
//         {status && (
//           <div className={`p-4 rounded-md ${
//             status.includes('Erreur') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
//           }`}>
//             {status}
//           </div>
//         )}
        
//         {!isOnline && (
//           <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
//             Mode hors ligne - Les données seront synchronisées lors de la reconnexion
//           </div>
//         )}
        
//         <button
//           onClick={handleSync}
//           disabled={!isOnline || isLoading}
//           className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
//         >
//           Synchroniser maintenant
//         </button>
//       </div>

//       {/* Liste des étudiants */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <h2 className="text-xl font-semibold p-4 border-b bg-gray-50">
//           Liste des étudiants ({students.length})
//         </h2>
        
//         {isLoading ? (
//           <div className="p-8 text-center">Chargement en cours...</div>
//         ) : students.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">Aucun étudiant enregistré</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Âge</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">École</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {students.map(student => (
//                   <tr key={student.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">{student.age}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {new Date(student.dayOfRegistration).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">{student.school}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         student.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {student.synced ? 'Synchronisé' : 'En attente'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client' // Important: Marquez ce composant comme Client Component

import { useEffect } from 'react'
import { useRouter } from 'next/navigation' // Changé de 'next/router' à 'next/navigation'
import { useAuth } from '../context/AuthContext'
import Head from 'next/head'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/home')
      } else {
        router.push('/auth/signin')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>School App</title>
        <meta name="description" content="Application scolaire" />
      </Head>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">School App</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Chargement en cours...</p>
      </div>
    </div>
  )
}