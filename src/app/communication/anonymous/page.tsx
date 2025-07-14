import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/db';

export default function AnonymousPage() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const { error } = await supabase
        .from('anonymous_messages')
        .insert([{
          content: message,
          created_at: new Date().toISOString()
        }]);
        
      if (error) throw error;
      
      setSuccess(true);
      setMessage('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending anonymous message:', error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Envoyer un message anonyme</h1>
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
              Message envoyé avec succès. Merci pour votre feedback.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                Votre message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Écrivez ici votre message anonyme à l'administration..."
              />
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Votre identité ne sera pas enregistrée. Ce message sera traité de manière confidentielle.
              </p>
              
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSending ? 'Envoi en cours...' : 'Envoyer anonymement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}