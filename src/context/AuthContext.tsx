
// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createUser,getAllUsers, getUserByEmail, getUserByPhone, User, exportToSupabase, supabase, updateUserOnlineStatus } from '../lib/db';




// // Dans AuthProvider.tsx



// interface AuthContextType {
//   user: (User & { is_online?: boolean, last_sign_in_at?: string }) | null;
//   loading: boolean;
//   signUp: (data: {
//     email?: string | null;
//     name: string;
//     role: 'admin' | 'enseignant' | 'parent';
//     password: string;
//     phone: string;
//   }) => Promise<User>;
//   signIn: (data: { email?: string; phone?: string; password: string }) => Promise<User>;
//   signOut: () => Promise<void>;
//   checkOnlineStatus: (userId: string) => Promise<boolean>;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: false,
//   signUp: () => Promise.reject(new Error('AuthProvider non initialisé')),
//   signIn: () => Promise.reject(new Error('AuthProvider non initialisé')),
//   signOut: () => Promise.reject(new Error('AuthProvider non initialisé')),
//   checkOnlineStatus: () => Promise.resolve(false),
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<(User & { is_online?: boolean, last_sign_in_at?: string }) | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();





// useEffect(() => {
//   const createDefaultAdmin = async () => {
//     try {
//       // Vérifier si un admin existe déjà dans IndexedDB
//       const allUsers = await getAllUsers(); // Vous devez importer cette fonction depuis db.ts
//       const existingAdmin = allUsers.find(user => user.role === 'admin');
      
//       // Si aucun admin n'existe, créer le compte par défaut
//       if (!existingAdmin) {
//         const defaultAdmin = {
//           name: 'Admin',
//           email: 'admin@grandeur.edu',
//           phone: '0612345678',
//           password: '123456', // À changer après la première connexion
//           role: 'admin' as const,
//         };

//         const createdAdmin = await createUser(defaultAdmin);
//         console.log('Compte admin par défaut créé:', createdAdmin);
        
//         // Synchroniser avec Supabase si en ligne
//         if (navigator.onLine) {
//           try {
//             await supabase
//               .from('users')
//               .upsert([{
//                 ...createdAdmin,
//                 is_online: false,
//                 last_sign_in_at: null
//               }]);
//             console.log('Admin synchronisé avec Supabase');
//           } catch (supabaseError) {
//             console.error('Erreur synchronisation Supabase:', supabaseError);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Erreur création admin:', error);
//     }
//   };

//   // Appeler la fonction au chargement
//   createDefaultAdmin();
// }, []); // Le tableau vide signifie que cela ne s'exécute qu'au montage du composant





//   const checkOnlineStatus = async (userId: string): Promise<boolean> => {
//     try {
//       const { data } = await supabase
//         .from('users2')
//         .select('is_online')
//         .eq('id', userId)
//         .single();
      
//       return data?.is_online || false;
//     } catch (error) {
//       console.error('Error checking online status:', error);
//       return false;
//     }
//   };

//   const updateUserStatus = async (userId: string, isOnline: boolean) => {
//     try {
//       // Update in Supabase
//       const { error } = await supabase
//         .from('users2')
//         .update({ 
//           is_online: isOnline,
//           last_sign_in_at: isOnline ? new Date().toISOString() : undefined
//         })
//         .eq('id', userId);

//       if (error) throw error;

//       // Update in IndexedDB
//       await updateUserOnlineStatus(userId, isOnline);

//       // Update local state
//       setUser(prev => prev ? {
//         ...prev,
//         is_online: isOnline,
//         last_sign_in_at: isOnline ? new Date().toISOString() : prev.last_sign_in_at
//       } : null);
//     } catch (error) {
//       console.error('Error updating user status:', error);
//     }
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const storedUser = localStorage.getItem('currentUser');
//         if (!storedUser) {
//           setLoading(false);
//           return;
//         }

//         const sessionUser = JSON.parse(storedUser);
//         const isOnline = await checkOnlineStatus(sessionUser.id);
        
//         const updatedUser = { 
//           ...sessionUser, 
//           is_online: isOnline,
//           last_sign_in_at: sessionUser.last_sign_in_at || undefined
//         };
        
//         setUser(updatedUser);
//         localStorage.setItem('currentUser', JSON.stringify(updatedUser));
//       } catch (error) {
//         console.error('Erreur initialisation auth:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();

//     // Set up online status listener
//     const handleOnline = () => {
//       if (user?.id) {
//         updateUserStatus(user.id, true);
//       }
//     };

//     const handleOffline = () => {
//       if (user?.id) {
//         updateUserStatus(user.id, false);
//       }
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, [user?.id]);

//   const signUp = async (data: {
//     email?: string | null;
//     name: string;
//     role: 'admin' | 'enseignant' | 'parent';
//     password: string;
//     phone: string;
//   }) => {
//     setLoading(true);
//     try {
//       const user = await createUser(data);
//       const userWithStatus = { 
//         ...user, 
//         is_online: true, 
//         last_sign_in_at: new Date().toISOString() 
//       };
      
//       setUser(userWithStatus);
//       localStorage.setItem('currentUser', JSON.stringify(userWithStatus));
      
//       if (navigator.onLine) {
//         await supabase
//           .from('users2')
//           .upsert([{
//             ...userWithStatus,
//             is_online: true,
//             last_sign_in_at: new Date().toISOString()
//           }]);
//       }
      
//       return userWithStatus;
//     } catch (error) {
//       console.error('Erreur inscription:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signIn = async (data: { email?: string; phone?: string; password: string }) => {
//     setLoading(true);
//     try {
//       let user: User | null = null;
//       if (data.email) user = await getUserByEmail(data.email);
//       else if (data.phone) user = await getUserByPhone(data.phone);

//       if (!user || user.password !== data.password) {
//         throw new Error('Identifiants incorrects');
//       }
      
//       // Update online status
//       await updateUserStatus(user.id, true);

//       const userWithStatus = { 
//         ...user, 
//         is_online: true, 
//         last_sign_in_at: new Date().toISOString() 
//       };
      
//       setUser(userWithStatus);
//       localStorage.setItem('currentUser', JSON.stringify(userWithStatus));
      
//       return userWithStatus;
//     } catch (error) {
//       console.error('Erreur connexion:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signOut = async () => {
//     setLoading(true);
//     try {
//       if (user) {
//         await updateUserStatus(user.id, false);
//       }
      
//       setUser(null);
//       localStorage.removeItem('currentUser');
//       router.push('/auth/signin');
//     } catch (error) {
//       console.error('Erreur déconnexion:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = { user, loading, signUp, signIn, signOut, checkOnlineStatus };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth doit être utilisé dans un AuthProvider');
//   }
//   return context;
// }
'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser, getAllUsers, getUserByEmail, getUserByPhone, User, supabase } from '../lib/db';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (data: {
    email?: string | null;
    name: string;
    role: 'admin' | 'enseignant' | 'parent';
    password: string;
    phone: string;
  }) => Promise<User>;
  signIn: (data: { email?: string; phone?: string; password: string }) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signUp: () => Promise.reject(new Error('AuthProvider non initialisé')),
  signIn: () => Promise.reject(new Error('AuthProvider non initialisé')),
  signOut: () => Promise.reject(new Error('AuthProvider non initialisé')),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const createDefaultAdmin = async () => {
      try {
        const allUsers = await getAllUsers();
        const existingAdmin = allUsers.find(user => user.role === 'admin');
        
        if (!existingAdmin) {
          const defaultAdmin = {
            name: 'Admin',
            email: 'admin@grandeur.edu',
            phone: '0612345678',
            password: '123456',
            role: 'admin' as const,
          };

          const createdAdmin = await createUser(defaultAdmin);
          console.log('Compte admin par défaut créé:', createdAdmin);
          
          if (navigator.onLine) {
            try {
              await supabase
                .from('users')
                .upsert([createdAdmin]);
              console.log('Admin synchronisé avec Supabase');
            } catch (supabaseError) {
              console.error('Erreur synchronisation Supabase:', supabaseError);
            }
          }
        }
      } catch (error) {
        console.error('Erreur création admin:', error);
      }
    };

    createDefaultAdmin();
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const sessionUser = JSON.parse(storedUser);
        setUser(sessionUser);
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (data: {
    email?: string | null;
    name: string;
    role: 'admin' | 'enseignant' | 'parent';
    password: string;
    phone: string;
  }) => {
    setLoading(true);
    try {
      const user = await createUser(data);
      
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      if (navigator.onLine) {
        await supabase
          .from('users2')
          .upsert([user]);
      }
      
      return user;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: { email?: string; phone?: string; password: string }) => {
    setLoading(true);
    try {
      let user: User | null = null;
      if (data.email) user = await getUserByEmail(data.email);
      else if (data.phone) user = await getUserByPhone(data.phone);

      if (!user || user.password !== data.password) {
        throw new Error('Identifiants incorrects');
      }
      
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('currentUser');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = { user, loading, signUp, signIn, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}