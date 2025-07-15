// 'use client'
// import { useState, useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { getParentsEmails, getTeachersEmails } from '@/lib/db';
// import { sendBulkEmail, bulkEmailTemplate } from '@/lib/bulk-mailer';
// import LoadingSpinner from '@/components/LoadingSpinner';

// export default function BulkEmailPage() {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [parentsEmails, setParentsEmails] = useState<string[]>([]);
//   const [teachersEmails, setTeachersEmails] = useState<string[]>([]);
//   const [formData, setFormData] = useState({
//     recipientType: 'PARENTS',
//     subject: '',
//     content: '',
//     customRecipients: '',
//   });
//   const [isSending, setIsSending] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const loadEmails = async () => {
//       try {
//         const [parents, teachers] = await Promise.all([
//           getParentsEmails(),
//           getTeachersEmails()
//         ]);
//         setParentsEmails(parents);
//         setTeachersEmails(teachers);
//       } catch (error) {
//         console.error('Error loading emails:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadEmails();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSending(true);
//     setMessage('');

//     try {
//       let recipients: string[] = [];
      
//       if (formData.recipientType === 'PARENTS') {
//         recipients = parentsEmails;
//       } else if (formData.recipientType === 'TEACHERS') {
//         recipients = teachersEmails;
//       } else if (formData.customRecipients) {
//         recipients = formData.customRecipients
//           .split(',')
//           .map(email => email.trim())
//           .filter(email => email);
//       }

//       if (recipients.length === 0) {
//         throw new Error('Aucun destinataire valide');
//       }

//       const html = bulkEmailTemplate(formData.content, user?.name);
      
//       await sendBulkEmail(
//         recipients,
//         formData.subject,
//         html,
//         user?.id || ''
//       );

//       setMessage(`Message envoyé à ${recipients.length} destinataires avec succès`);
//       setFormData({
//         recipientType: 'PARENTS',
//         subject: '',
//         content: '',
//         customRecipients: '',
//       });
//     } catch (error) {
//       console.error('Error sending bulk email:', error);
//       setMessage(`Erreur lors de l'envoi: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Envoyer un message groupé</h1>
      
//       {message && (
//         <div className={`mb-4 p-4 rounded ${message.includes('Erreur') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
//           {message}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Destinataires
//           </label>
//           <select
//             name="recipientType"
//             value={formData.recipientType}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           >
//             <option value="PARENTS">Tous les parents ({parentsEmails.length})</option>
//             <option value="TEACHERS">Tous les enseignants ({teachersEmails.length})</option>
//             <option value="CUSTOM">Destinataires spécifiques</option>
//           </select>
//         </div>

//         {formData.recipientType === 'CUSTOM' && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Emails (séparés par des virgules)
//             </label>
//             <textarea
//               name="customRecipients"
//               value={formData.customRecipients}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               rows={3}
//               placeholder="exemple1@email.com, exemple2@email.com"
//             />
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Objet
//           </label>
//           <input
//             type="text"
//             name="subject"
//             value={formData.subject}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Message
//           </label>
//           <textarea
//             name="content"
//             value={formData.content}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             rows={8}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isSending}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
//         >
//           {isSending ? 'Envoi en cours...' : 'Envoyer'}
//         </button>
//       </form>
//     </div>
//   );
// }

'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getParentsEmails, 
  getTeachersEmails, 
  getClassroomsWithParents,Classroom,
  getParentsByClassroom
} from '@/lib/db';
import { sendBulkEmail, bulkEmailTemplate } from '@/lib/bulk-mailer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function BulkEmailPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [parentsEmails, setParentsEmails] = useState<string[]>([]);
  const [teachersEmails, setTeachersEmails] = useState<string[]>([]);
  const [classrooms, setClassrooms] = useState<Array<{
    classroom: Classroom;
    parentCount: number;
  }>>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [formData, setFormData] = useState({
    recipientType: 'PARENTS',
    subject: '',
    content: '',
    customRecipients: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [parents, teachers, classroomsData] = await Promise.all([
          getParentsEmails(),
          getTeachersEmails(),
          getClassroomsWithParents()
        ]);
        setParentsEmails(parents);
        setTeachersEmails(teachers);
        setClassrooms(classroomsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClassroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClassroom(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setMessage('');

    try {
      let recipients: string[] = [];
      
      if (formData.recipientType === 'PARENTS') {
        if (selectedClassroom) {
          // Si une classe est sélectionnée, on prend seulement les parents de cette classe
          const parents = await getParentsByClassroom(selectedClassroom);
          recipients = parents.map(parent => parent.email || '').filter(email => email);
        } else {
          // Sinon tous les parents
          recipients = parentsEmails;
        }
      } else if (formData.recipientType === 'TEACHERS') {
        recipients = teachersEmails;
      } else if (formData.customRecipients) {
        recipients = formData.customRecipients
          .split(',')
          .map(email => email.trim())
          .filter(email => email);
      }

      if (recipients.length === 0) {
        throw new Error('Aucun destinataire valide');
      }

      const html = bulkEmailTemplate(formData.content, user?.name);
      
      await sendBulkEmail(
        recipients,
        formData.subject,
        html,
        user?.id || ''
      );

      setMessage(`Message envoyé à ${recipients.length} destinataires avec succès`);
      setFormData({
        recipientType: 'PARENTS',
        subject: '',
        content: '',
        customRecipients: '',
      });
      setSelectedClassroom('');
    } catch (error) {
      console.error('Error sending bulk email:', error);
      setMessage(`Erreur lors de l'envoi: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Envoyer un message groupé</h1>
      
      {message && (
        <div className={`mb-4 p-4 rounded ${message.includes('Erreur') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destinataires
          </label>
          <select
            name="recipientType"
            value={formData.recipientType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="PARENTS">Parents</option>
            <option value="TEACHERS">Enseignants</option>
            <option value="CUSTOM">Destinataires spécifiques</option>
          </select>
        </div>

        {formData.recipientType === 'PARENTS' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sélectionner une classe (optionnel)
            </label>
            <select
              value={selectedClassroom}
              onChange={handleClassroomChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Tous les parents</option>
              {classrooms.map(({classroom, parentCount}) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name} ({parentCount} parents)
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {selectedClassroom 
                ? `Envoi aux parents des élèves de ${classrooms.find(c => c.classroom.id === selectedClassroom)?.classroom.name}`
                : "Envoi à tous les parents de l'école"}
            </p>
          </div>
        )}

        {formData.recipientType === 'CUSTOM' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emails (séparés par des virgules)
            </label>
            <textarea
              name="customRecipients"
              value={formData.customRecipients}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="exemple1@email.com, exemple2@email.com"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objet
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSending ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
}