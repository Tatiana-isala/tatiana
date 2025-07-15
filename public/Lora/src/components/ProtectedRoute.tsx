import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'enseignant' | 'parent';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth/signin');
    } else if (requiredRole && user.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [user, loading, requiredRole, router]);

  if (loading || !user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Vérification des permissions...</p>
      </div>
    );
  }

  return <>{children}</>;
}