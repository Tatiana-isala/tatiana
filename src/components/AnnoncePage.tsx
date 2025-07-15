// 'use client'
// import { useState, useEffect } from 'react';
// import { createAnnonce, getAnnoncesForUser, deleteAnnonce, Annonce } from '@/lib/annonce-db';
// import { useAuth } from '@/context/AuthContext';
// import LoadingSpinner from '@/components/LoadingSpinner';

// export default function AnnoncePage() {
//   const { user } = useAuth();
//   const [annonces, setAnnonces] = useState<Annonce[]>([]);
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isCreating, setIsCreating] = useState(false);
//   const [newAnnonce, setNewAnnonce] = useState({
//     title: '',
//     content: '',
//     target_roles: [] as ('parent' | 'enseignant')[],
//   });

//   useEffect(() => {
//     if (user?.role) {
//       loadAnnonces();
//     }
//   }, [user]);

//   const loadAnnonces = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const annonces = await getAnnoncesForUser(user?.role || 'parent');
//       setAnnonces(annonces);
//     } catch (err) {
//       console.error('Failed to load announcements:', err);
//       setError('Failed to load announcements. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateAnnonce = async () => {
//     if (!newAnnonce.title || !newAnnonce.content || newAnnonce.target_roles.length === 0) {
//       setError('Title, content and target audience are required');
//       return;
//     }

//     if (!user) {
//       setError('User not authenticated');
//       return;
//     }

//     setIsCreating(true);
//     setError(null);
    
//     try {
//       await createAnnonce(newAnnonce, { id: user.id, name: user.name || 'Admin' });
//       setNewAnnonce({ title: '', content: '', target_roles: [] });
//       await loadAnnonces();
//     } catch (err) {
//       console.error('Failed to create announcement:', err);
//       setError('Failed to create announcement. Please try again.');
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleDeleteAnnonce = async (id: string) => {
//     if (confirm('Are you sure you want to delete this announcement?')) {
//       try {
//         await deleteAnnonce(id);
//         await loadAnnonces();
//       } catch (err) {
//         console.error('Failed to delete announcement:', err);
//         setError('Failed to delete announcement. Please try again.');
//       }
//     }
//   };

//   const toggleTargetRole = (role: 'parent' | 'enseignant') => {
//     setNewAnnonce(prev => ({
//       ...prev,
//       target_roles: prev.target_roles.includes(role)
//         ? prev.target_roles.filter(r => r !== role)
//         : [...prev.target_roles, role]
//     }));
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-800">Annonces</h1>
//             {user?.role === 'admin' && (
//               <button
//                 onClick={() => setNewAnnonce({ title: '', content: '', target_roles: [] })}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Créer une annonce
//               </button>
//             )}
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//               {error}
//             </div>
//           )}

//           {(newAnnonce.title || newAnnonce.content) && user?.role === 'admin' && (
//             <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
//               <h2 className="text-lg font-semibold mb-3 text-blue-800">Nouvelle Annonce</h2>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   value={newAnnonce.title}
//                   onChange={(e) => setNewAnnonce({...newAnnonce, title: e.target.value})}
//                   placeholder="Titre de l'annonce"
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
//                 <textarea
//                   className="w-full p-2 border rounded-md min-h-[150px] focus:ring-blue-500 focus:border-blue-500"
//                   value={newAnnonce.content}
//                   onChange={(e) => setNewAnnonce({...newAnnonce, content: e.target.value})}
//                   placeholder="Contenu de l'annonce..."
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Destinataires</label>
//                 <div className="flex space-x-4">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={newAnnonce.target_roles.includes('parent')}
//                       onChange={() => toggleTargetRole('parent')}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <span className="ml-2 text-gray-700">Parents</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={newAnnonce.target_roles.includes('enseignant')}
//                       onChange={() => toggleTargetRole('enseignant')}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <span className="ml-2 text-gray-700">Enseignants</span>
//                   </label>
//                 </div>
//               </div>
              
//               <div className="flex justify-end space-x-3">
//                 <button
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                   onClick={() => setNewAnnonce({ title: '', content: '', target_roles: [] })}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
//                   onClick={handleCreateAnnonce}
//                   disabled={isCreating || !newAnnonce.title || !newAnnonce.content || newAnnonce.target_roles.length === 0}
//                 >
//                   {isCreating ? 'Publication...' : 'Publier'}
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="space-y-4">
//             {annonces.length === 0 ? (
//               <div className="text-center py-8">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune annonce</h3>
//                 <p className="mt-1 text-sm text-gray-500">Aucune annonce n'a été publiée pour le moment.</p>
//               </div>
//             ) : (
//               annonces.map(annonce => (
//                 <div key={annonce.id} className="border rounded-lg overflow-hidden">
//                   <div className="p-4">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-bold text-gray-800">{annonce.title}</h3>
//                         <p className="text-sm text-gray-500 mb-2">
//                           Publié par: {annonce.author_name} • 
//                           Pour: {annonce.target_roles.join(', ')} • 
//                           {new Date(annonce.created_at).toLocaleDateString('fr-FR', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                           })}
//                         </p>
//                       </div>
//                       {user?.role === 'admin' && (
//                         <button
//                           onClick={() => handleDeleteAnnonce(annonce.id)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                           </svg>
//                         </button>
//                       )}
//                     </div>
//                     <p className="mt-2 text-gray-700 whitespace-pre-line">{annonce.content}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client'
import { useState, useEffect } from 'react';
import { createAnnonce, getAnnoncesForUser, deleteAnnonce, Annonce } from '@/lib/annonce-db';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AnnoncePage() {
  const { user } = useAuth();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false); // Nouvel état
  const [newAnnonce, setNewAnnonce] = useState({
    title: '',
    content: '',
    target_roles: [] as ('parent' | 'enseignant')[],
  });

  useEffect(() => {
    if (user?.role) {
      loadAnnonces();
    }
  }, [user]);

  const loadAnnonces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const annonces = await getAnnoncesForUser(user?.role || 'parent');
      setAnnonces(annonces);
    } catch (err) {
      console.error('Failed to load announcements:', err);
      setError('Failed to load announcements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnnonce = async () => {
    if (!newAnnonce.title || !newAnnonce.content || newAnnonce.target_roles.length === 0) {
      setError('Title, content and target audience are required');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsCreating(true);
    setError(null);
    
    try {
      await createAnnonce(newAnnonce, { id: user.id, name: user.name || 'Admin' });
      setNewAnnonce({ title: '', content: '', target_roles: [] });
      setShowForm(false); // Fermer le formulaire après création
      await loadAnnonces();
    } catch (err) {
      console.error('Failed to create announcement:', err);
      setError('Failed to create announcement. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAnnonce = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnonce(id);
        await loadAnnonces();
      } catch (err) {
        console.error('Failed to delete announcement:', err);
        setError('Failed to delete announcement. Please try again.');
      }
    }
  };

  const toggleTargetRole = (role: 'parent' | 'enseignant') => {
    setNewAnnonce(prev => ({
      ...prev,
      target_roles: prev.target_roles.includes(role)
        ? prev.target_roles.filter(r => r !== role)
        : [...prev.target_roles, role]
    }));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Annonces</h1>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Créer une annonce
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {showForm && user?.role === 'admin' && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h2 className="text-lg font-semibold mb-3 text-blue-800">Nouvelle Annonce</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newAnnonce.title}
                  onChange={(e) => setNewAnnonce({...newAnnonce, title: e.target.value})}
                  placeholder="Titre de l'annonce"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[150px] focus:ring-blue-500 focus:border-blue-500"
                  value={newAnnonce.content}
                  onChange={(e) => setNewAnnonce({...newAnnonce, content: e.target.value})}
                  placeholder="Contenu de l'annonce..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinataires</label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={newAnnonce.target_roles.includes('parent')}
                      onChange={() => toggleTargetRole('parent')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Parents</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={newAnnonce.target_roles.includes('enseignant')}
                      onChange={() => toggleTargetRole('enseignant')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Enseignants</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  onClick={handleCreateAnnonce}
                  disabled={isCreating || !newAnnonce.title || !newAnnonce.content || newAnnonce.target_roles.length === 0}
                >
                  {isCreating ? 'Publication...' : 'Publier'}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {annonces.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune annonce</h3>
                <p className="mt-1 text-sm text-gray-500">Aucune annonce n'a été publiée pour le moment.</p>
              </div>
            ) : (
              annonces.map(annonce => (
                <div key={annonce.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{annonce.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Publié par: {annonce.author_name} • 
                          Pour: {annonce.target_roles.join(', ')} • 
                          {new Date(annonce.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDeleteAnnonce(annonce.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-gray-700 whitespace-pre-line">{annonce.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}