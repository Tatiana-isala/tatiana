
// 'use client'

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../../context/AuthContext';
// import { importFromSupabase, exportToSupabase } from '@/lib/db';

// export default function SignUp() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     role: 'parent' as 'admin' | 'enseignant' | 'parent'
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { signUp } = useAuth();
//   const router = useRouter();
//   const [syncStatus, setSyncStatus] = useState('');
//   const [isSyncing, setIsSyncing] = useState(false);






//   // const { user } = useAuth();

//   // useEffect(() => {
//   //   if (user && user.role !== 'admin') {
//   //     router.push('/'); // Rediriger les non-admins
//   //   }
//   // }, [user, router]);

//   // if (!user || user.role !== 'admin') {
//   //   return (
//   //     <div className="min-h-screen flex items-center justify-center">
//   //       <div className="text-center">
//   //         <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
//   //         <p>Seuls les administrateurs peuvent accéder à cette page.</p>
//   //       </div>
//   //     </div>
//   //   );
//   // }


//   const handlePullData = async () => {
//     setIsSyncing(true);
//     setSyncStatus('Téléchargement des données...');
//     try {
//       const count = await importFromSupabase();
//       setSyncStatus(`Succès! ${count} utilisateurs importés depuis Supabase.`);
//     } catch (error) {
//       setSyncStatus('Erreur lors du téléchargement: ' + (error as Error).message);
//     } finally {
//       setIsSyncing(false);
//     }
//   };

//   const handlePushData = async () => {
//     setIsSyncing(true);
//     setSyncStatus('Envoi des données...');
//     try {
//       const count = await exportToSupabase();
//       setSyncStatus(`Succès! ${count} utilisateurs exportés vers Supabase.`);
//     } catch (error) {
//       setSyncStatus('Erreur lors de l\'envoi: ' + (error as Error).message);
//     } finally {
//       setIsSyncing(false);
//     }
//   };

//   useEffect(() => {
//     if (Object.keys(errors).length > 0) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors.form;
//         return newErrors;
//       });
//     }
//   }, [formData]);

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Le nom complet est obligatoire';
//     }

//     if (!formData.phone) {
//       newErrors.phone = 'Le numéro de téléphone est obligatoire';
//     } else if (!/^0\d{9}$/.test(formData.phone)) {
//       newErrors.phone = 'Le numéro doit commencer par 0 et contenir 10 chiffres';
//     }

//     if (formData.email) {
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//         newErrors.email = 'Veuillez utiliser un email valide';
//       }
//     }

//     if (!formData.password) {
//       newErrors.password = 'Le mot de passe est obligatoire';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
//     }

//     return newErrors;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'phone') {
//       const digits = value.replace(/\D/g, '').slice(0, 10);
//       const formatted = digits.length > 0 ? digits : '';
//       setFormData(prev => ({ ...prev, [name]: formatted }));
//       return;
//     }

//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const formErrors = validateForm();
    
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await signUp({ 
//         email: formData.email || null, 
//         name: formData.name, 
//         role: formData.role, 
//         password: formData.password,
//         phone: formData.phone 
//       });
//       router.push('/admin');
//     } catch (err: any) {
//       if (err.message.includes('email')) {
//         setErrors({
//           email: 'Veuillez utiliser un autre email (déjà utilisé)'
//         });
//       } else {
//         setErrors({
//           form: err instanceof Error ? err.message : 'Une erreur est survenue'
//         });
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">Créer un compte</h1>
//           <p className="text-gray-600 mt-2">Remplissez le formulaire pour vous inscrire</p>
//         </div>

//         {errors.form && (
//           <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
//             {errors.form}
//           </div>
//         )}

//         {/* Boutons de synchronisation pour l'admin */}
//         {useAuth().user?.role === 'admin' && (
//           <div className="mb-6 space-y-2">
//             <button
//               onClick={handlePullData}
//               disabled={isSyncing}
//               className="w-full py-2 px-4 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 disabled:opacity-50"
//             >
//               {isSyncing ? 'Import en cours...' : 'Importer depuis Supabase'}
//             </button>
//             <button
//               onClick={handlePushData}
//               disabled={isSyncing}
//               className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-md hover:bg-green-200 disabled:opacity-50"
//             >
//               {isSyncing ? 'Export en cours...' : 'Exporter vers Supabase'}
//             </button>
//             {syncStatus && (
//               <div className={`p-2 text-sm rounded-md ${
//                 syncStatus.includes('Erreur') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//               }`}>
//                 {syncStatus}
//               </div>
//             )}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Les champs du formulaire restent inchangés */}
//           {/* ... */}


//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//               Nom complet <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               className={`w-full px-4 py-2.5 rounded-lg border ${
//                 errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
//               } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//               value={formData.name}
//               onChange={handleChange}
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-500 flex items-center">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//                 {errors.name}
//               </p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//               Numéro de téléphone <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">+212</span>
//               <input
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 maxLength={10}
//                 className={`w-full px-4 py-2.5 rounded-lg border ${
//                   errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                 } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-14`}
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="612345678"
//               />
//             </div>
//             {errors.phone && (
//               <p className="mt-1 text-sm text-red-500 flex items-center">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//                 {errors.phone}
//               </p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               className={`w-full px-4 py-2.5 rounded-lg border ${
//                 errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
//               } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="optionnel@exemple.com"
//             />
//             {errors.email && (
//               <p className="mt-1 text-sm text-red-500 flex items-center">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//                 {errors.email}
//               </p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Mot de passe <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               minLength={6}
//               className={`w-full px-4 py-2.5 rounded-lg border ${
//                 errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
//               } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//               value={formData.password}
//               onChange={handleChange}
//             />
//             {errors.password && (
//               <p className="mt-1 text-sm text-red-500 flex items-center">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                 </svg>
//                 {errors.password}
//               </p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//               Rôle <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="role"
//               name="role"
//               className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={formData.role}
//               onChange={handleChange}
//             >
//               <option value="parent">Parent</option>
//               <option value="enseignant">Enseignant</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>

        

          
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
//               isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
//             } transition-colors flex justify-center items-center`}
//           >
//             {isSubmitting ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Inscription en cours...
//               </>
//             ) : 'S\'inscrire'}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-gray-500">
//           <p>Déjà un compte? <a href="/auth/signin" className="text-blue-600 hover:underline">Connectez-vous</a></p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { importFromSupabase, exportToSupabase } from '@/lib/db';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'parent' as 'admin' | 'enseignant' | 'parent'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const [syncStatus, setSyncStatus] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePullData = async () => {
    setIsSyncing(true);
    setSyncStatus('Téléchargement des données...');
    try {
      const count = await importFromSupabase();
      setSyncStatus(`Succès! ${count} utilisateurs importés depuis Supabase.`);
    } catch (error) {
      setSyncStatus('Erreur lors du téléchargement: ' + (error as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePushData = async () => {
    setIsSyncing(true);
    setSyncStatus('Envoi des données...');
    try {
      const count = await exportToSupabase();
      setSyncStatus(`Succès! ${count} utilisateurs exportés vers Supabase.`);
    } catch (error) {
      setSyncStatus('Erreur lors de l\'envoi: ' + (error as Error).message);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.form;
        return newErrors;
      });
    }
  }, [formData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom complet est obligatoire';
    }

    if (!formData.phone) {
      newErrors.phone = 'Le numéro de téléphone est obligatoire';
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Le numéro doit commencer par 0 et contenir 10 chiffres';
    }

    if (formData.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Veuillez utiliser un email valide';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      const formatted = digits.length > 0 ? digits : '';
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      await signUp({ 
        email: formData.email || null, 
        name: formData.name, 
        role: formData.role, 
        password: formData.password,
        phone: formData.phone 
      });
      
      // Réinitialiser le formulaire après succès
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'parent'
      });
      
      setSuccessMessage('Utilisateur créé avec succès!');
    } catch (err: any) {
      if (err.message.includes('email')) {
        setErrors({
          email: 'Veuillez utiliser un autre email (déjà utilisé)'
        });
      } else {
        setErrors({
          form: err instanceof Error ? err.message : 'Une erreur est survenue'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Créer un compte</h1>
          <p className="text-gray-600 mt-2">Remplissez le formulaire pour vous inscrire</p>
        </div>

        {errors.form && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {errors.form}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {/* Boutons de synchronisation pour l'admin */}
        {useAuth().user?.role === 'admin' && (
          <div className="mb-6 space-y-2">
            <button
              onClick={handlePullData}
              disabled={isSyncing}
              className="w-full py-2 px-4 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 disabled:opacity-50"
            >
              {isSyncing ? 'Import en cours...' : 'Importer depuis Supabase'}
            </button>
            <button
              onClick={handlePushData}
              disabled={isSyncing}
              className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-md hover:bg-green-200 disabled:opacity-50"
            >
              {isSyncing ? 'Export en cours...' : 'Exporter vers Supabase'}
            </button>
            {syncStatus && (
              <div className={`p-2 text-sm rounded-md ${
                syncStatus.includes('Erreur') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {syncStatus}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">+212</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                maxLength={10}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-14`}
                value={formData.phone}
                onChange={handleChange}
                placeholder="612345678"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              value={formData.email}
              onChange={handleChange}
              placeholder="optionnel@exemple.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="parent">Parent</option>
              <option value="enseignant">Enseignant</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors flex justify-center items-center`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              </>
            ) : 'Créer un utilisateur'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Déjà un compte? <a href="/auth/signin" className="text-blue-600 hover:underline">Connectez-vous</a></p>
        </div>
      </div>
    </div>
  );
}