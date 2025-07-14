'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

export function ParentAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('sent_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        setAnnouncements(data || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnnouncements();
    
    // Abonnement aux nouvelles annonces
    const subscription = supabase
      .channel('announcements')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'announcements'
      }, (payload) => {
        setAnnouncements(prev => [payload.new, ...prev]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (isLoading) {
    return <div className="text-center py-4">Chargement des annonces...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Dernières annonces</h2>
      
      {announcements.length === 0 ? (
        <p className="text-gray-500">Aucune annonce récente</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <h3 className="font-semibold text-gray-800">{announcement.subject}</h3>
              <p className="text-gray-600 text-sm mt-1 whitespace-pre-line">{announcement.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(announcement.sent_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
