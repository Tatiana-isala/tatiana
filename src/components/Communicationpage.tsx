
'use client'
import { useState, useEffect } from 'react';
import { 
  User, 
  Communication, 
  markAsRead,
  getCommunicationsForUser, 
  createCommunication, 
  getAllUsers,
  getRepliesForMessage,
  getParents,
  getStudentsInClassroom,
  getClassroomsBySection,
  Classroom
} from '@/lib/db';

interface CommunicationPageProps {
  currentUser: User;
}

interface Thread extends Communication {
  replies: Communication[];
  hasUnread: boolean;
}

export default function CommunicationPage({ currentUser }: CommunicationPageProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [messageType, setMessageType] = useState<'ANNOUNCEMENT' | 'MESSAGE' | 'ANONYMOUS'>('MESSAGE');
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Communication | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [availableParents, setAvailableParents] = useState<User[]>([]);
  const [classroomsBySection, setClassroomsBySection] = useState<Record<string, Classroom[]>>({});
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (currentUser?.id) {
      loadCommunications();
      if (canSendMessages()) {
        loadUsers();
        if (currentUser.role === 'admin') {
          loadClassrooms();
        }
      }
    }
  }, [currentUser]);

  useEffect(() => {
    // Calculer le nombre de messages non lus
    const count = threads.reduce((total, thread) => {
      if (!thread.isRead) return total + 1;
      return total + thread.replies.filter(reply => !reply.isRead && reply.senderId !== currentUser.id).length;
    }, 0);
    setUnreadCount(count);
  }, [threads, currentUser.id]);

  const canSendMessages = () => {
    return ['admin', 'enseignant', 'parent'].includes(currentUser.role);
  };

  const loadClassrooms = async () => {
    try {
      const classrooms = await getClassroomsBySection();
      setClassroomsBySection(classrooms);
    } catch (err) {
      console.error('Failed to load classrooms:', err);
    }
  };

  const loadCommunications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allComms = await getCommunicationsForUser(currentUser.id);
      
      // Organize messages into threads
      const messages = allComms.filter(c => !c.parentMessageId);
      const threadsWithReplies = await Promise.all(
        messages.map(async (msg) => {
          const replies = await getRepliesForMessage(msg.id);
          const hasUnread = !msg.isRead || replies.some(reply => !reply.isRead && reply.senderId !== currentUser.id);
          return { ...msg, replies, hasUnread };
        })
      );
      
      // Sort by date (newest first)
      const sortedThreads = threadsWithReplies.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setThreads(sortedThreads);
    } catch (err) {
      console.error('Failed to load communications:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      const filteredUsers = allUsers.filter(u => {
        if (currentUser.role === 'admin') return true;
        if (currentUser.role === 'enseignant') return ['admin', 'parent'].includes(u.role);
        if (currentUser.role === 'parent') return ['admin', 'enseignant'].includes(u.role);
        return false;
      });
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadParentsByClassroom = async (classroomId: string) => {
    if (!classroomId) {
      setAvailableParents([]);
      return;
    }

    try {
      const allParents = await getParents();
      const students = await getStudentsInClassroom(classroomId);
      
      const classroomParents = allParents.filter(parent => 
        students.some(student => student.tuteur_id === parent.id)
      );
      
      setAvailableParents(classroomParents);
    } catch (err) {
      console.error('Failed to load parents:', err);
      setError('Failed to load parents. Please try again.');
    }
  };

  const handleReply = (message: Communication) => {
    setReplyingTo(message);
    setMessageType('MESSAGE');
    setRecipientId(message.senderId || '');
    setNewTitle(`Re: ${message.title}`);
    setActiveTab('compose');
    setSelectedClassroom('');
  };

  const handleSendMessage = async () => {
    if (!newMessage || !newTitle) {
      setError('Title and message are required');
      return;
    }
    
    if (messageType === 'MESSAGE' && !recipientId && availableParents.length === 0) {
      setError('Recipient is required for personal messages');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // For multiple recipients (admin sending to parents)
      if (messageType === 'MESSAGE' && availableParents.length > 0) {
        await Promise.all(availableParents.map(async parent => {
          await createCommunication({
            type: 'MESSAGE',
            title: newTitle,
            content: newMessage,
            recipientId: parent.id
          }, 
          currentUser.id,
          currentUser.name,
          replyingTo?.id
          );
        }));
      } 
      // For single recipient or other message types
      else {
        await createCommunication({
          type: messageType,
          title: newTitle,
          content: newMessage,
          recipientId: messageType === 'MESSAGE' ? recipientId : undefined
        }, 
        messageType === 'ANONYMOUS' ? undefined : currentUser.id,
        messageType === 'ANONYMOUS' ? undefined : currentUser.name,
        replyingTo?.id
        );
      }
      
      // Reset form
      setNewMessage('');
      setNewTitle('');
      setRecipientId('');
      setSelectedClassroom('');
      setMessageType('MESSAGE');
      setReplyingTo(null);
      
      // Reload messages
      await loadCommunications();
      setActiveTab('inbox');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const markThreadAsRead = async (thread: Thread) => {
    if (!thread.isRead) {
      await markAsRead(thread.id);
    }
    
    // Mark unread replies as read
    const unreadReplies = thread.replies.filter(
      reply => !reply.isRead && reply.senderId !== currentUser.id
    );
    
    if (unreadReplies.length > 0) {
      await Promise.all(unreadReplies.map(reply => markAsRead(reply.id)));
    }
    
    loadCommunications();
  };

  return (
    <div className="min-h- bg-gray-50 p-">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Messagerie</h1>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
              </span>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex border-b mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'inbox' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
              onClick={() => setActiveTab('inbox')}
            >
              Boîte de réception
            </button>
            {canSendMessages() && (
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'compose' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                onClick={() => {
                  setActiveTab('compose');
                  setReplyingTo(null);
                  setSelectedClassroom('');
                }}
              >
                Nouveau message
              </button>
            )}
          </div>
          
          {isLoading && activeTab === 'inbox' ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : activeTab === 'inbox' ? (
            <div className="space-y-4">
              {threads.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun message</h3>
                  <p className="mt-1 text-sm text-gray-500">Votre boîte de réception est vide.</p>
                  {canSendMessages() && (
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab('compose')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Écrire un message
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                threads.map(thread => (
                  <div 
                    key={thread.id} 
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${thread.hasUnread ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => markThreadAsRead(thread)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-bold ${thread.hasUnread ? 'text-blue-800' : 'text-gray-800'}`}>
                            {thread.title}
                            {thread.hasUnread && (
                              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {thread.type === 'ANNOUNCEMENT' ? 'Annonce' : 
                             thread.type === 'ANONYMOUS' ? 'Message anonyme' : 
                             thread.senderId === currentUser.id ? 
                             `À: ${thread.recipientName || '...'}` :
                             `De: ${thread.senderName || 'Administration'}`}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(thread.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className={`mt-2 ${thread.hasUnread ? 'text-gray-800' : 'text-gray-600'}`}>{thread.content}</p>
                      
                      {thread.type === 'MESSAGE' && thread.senderId !== currentUser.id && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReply(thread);
                          }}
                          className="mt-3 px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200"
                        >
                          Répondre
                        </button>
                      )}
                    </div>
                    
                    {thread.replies.length > 0 && (
                      <div className="border-t pl-8 bg-gray-50">
                        {thread.replies.map(reply => (
                          <div 
                            key={reply.id} 
                            className={`p-4 border-b last:border-b-0 ${!reply.isRead && reply.senderId !== currentUser.id ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Réponse de: {reply.senderName}
                                </p>
                              </div>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {new Date(reply.created_at).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="mt-1 text-gray-700">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {replyingTo && (
                <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">En réponse à:</span> {replyingTo.title}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de message</label>
                <select
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={messageType}
                  onChange={(e) => {
                    setMessageType(e.target.value as any);
                    setRecipientId('');
                    setSelectedClassroom('');
                    setReplyingTo(null);
                  }}
                  disabled={!!replyingTo}
                >
                  <option value="MESSAGE">Message personnel</option>
                  {currentUser.role === 'admin' && (
                    <option value="ANNOUNCEMENT">Annonce générale</option>
                  )}
                  <option value="ANONYMOUS">Message anonyme</option>
                </select>
              </div>
              
              {currentUser.role === 'admin' && messageType === 'MESSAGE' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Envoyer aux parents d'une classe
                    </label>
                    <select
                      className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={selectedClassroom}
                      onChange={async (e) => {
                        setSelectedClassroom(e.target.value);
                        await loadParentsByClassroom(e.target.value);
                      }}
                    >
                      <option value="">Sélectionner une classe</option>
                      {Object.entries(classroomsBySection).map(([section, classes]) => (
                        <optgroup key={section} label={section}>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {availableParents.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        Le message sera envoyé à tous les parents ({availableParents.length}) de cette classe.
                      </p>
                      <div className="max-h-40 overflow-y-auto">
                        {availableParents.map(parent => (
                          <div key={parent.id} className="flex items-center py-1">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-sm">
                              {parent.name} ({parent.phone})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {messageType === 'MESSAGE' && availableParents.length === 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                  <select
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    required={messageType === 'MESSAGE'}
                    disabled={!!replyingTo}
                  >
                    <option value="">Sélectionner un destinataire</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Sujet du message"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[150px] focus:ring-blue-500 focus:border-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message ici..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={() => {
                    setActiveTab('inbox');
                    setNewMessage('');
                    setNewTitle('');
                    setRecipientId('');
                    setSelectedClassroom('');
                    setReplyingTo(null);
                  }}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleSendMessage}
                  disabled={isLoading || !newMessage || !newTitle || 
                    (messageType === 'MESSAGE' && !recipientId && availableParents.length === 0)}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}