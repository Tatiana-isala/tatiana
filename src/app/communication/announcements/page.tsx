'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/db'; // Chemin vers votre fichier db.ts
import { getAllUsers } from '@/lib/db'; // Chemin vers votre fichier db.ts

export default function AnnouncementsPage() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // 1. Enregistrer l'annonce dans Supabase
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          subject,
          content,
          sent_at: new Date().toISOString(),
          sender_id: 'admin-user-id' // À remplacer par l'ID de l'utilisateur actuel
        }]);
      
      if (error) throw error;

      // 2. Récupérer tous les parents
      const parents = await getAllUsers();
      const parentEmails = parents
        .filter(user => user.role === 'parent' && user.email)
        .map(user => user.email);

      // 3. Envoyer les emails
      const response = await fetch('/api/communication/send-announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: parentEmails,
          subject,
          content
        }),
      });

      if (!response.ok) throw new Error('Failed to send emails');

      setSuccess(true);
      setTimeout(() => router.push('/communication'), 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur est survenue');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Envoyer une annonce générale</h1>
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
              Annonce envoyée avec succès !
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                Contenu
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSending ? 'Envoi en cours...' : 'Envoyer à tous les parents'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}