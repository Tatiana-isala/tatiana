// Simple vérification côté client
export function checkAuth(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth-token')
    }
    return false
  }