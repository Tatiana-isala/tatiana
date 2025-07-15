// 'use client'
// import { useEffect, useState } from 'react';
// import CommunicationPage from '@/components/Communicationpage';
// import { getUserById, User } from '@/lib/db'; // Assurez-vous d'importer le type User
// import { useAuth } from '@/context/AuthContext';

// export default function Communications() {
//   const { user } = useAuth();
//   const [userData, setUserData] = useState<User | null>(null); // Ajoutez le type User ici

//   useEffect(() => {
//     if (user?.id) {
//       getUserById(user.id).then((user) => setUserData(user)); // Correction ici
//     }
//   }, [user]);

//   if (!userData) return <div>Chargement...</div>;

//   return <CommunicationPage currentUser={userData} />;
// }

'use client'
import { useEffect, useState } from 'react';
import CommunicationPage from '@/components/Communicationpage';
import { getUserById, User } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Communications() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const loadUserData = async () => {
        try {
          const userData = await getUserById(user.id);
          setUserData(userData);
        } catch (error) {
          console.error('Failed to load user data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Session expirée</h1>
          <p>Veuillez vous reconnecter pour accéder aux communications.</p>
        </div>
      </div>
    );
  }

  return <CommunicationPage currentUser={userData} />;
}