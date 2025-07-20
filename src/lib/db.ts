






import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Configuration Supabase
const SUPABASE_URL = 'https://qhulaalqrfihxsoqnmin.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodWxhYWxxcmZpaHhzb3FubWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODAyMTAsImV4cCI6MjA2NzA1NjIxMH0.bptKBQthjt2QHKGEBLGjpXBE7MhDlGc1ejMo9b-ZOGs';

// Interfaces
interface User {
  id: string;
  email?: string | null;
  name: string;
  role: 'admin' | 'enseignant' | 'parent';
  password: string;
  phone: string;
  is_online?: boolean;
  last_sign_in_at?: string | null;
  created_at: string;
}

interface UserFormData {
  email?: string | null;
  name: string;
  role: 'admin' | 'enseignant' | 'parent';
  password: string;
  phone: string;
}

interface Student {
  id: string;
  matricule: string;
  nom: string;
  post_nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: 'M' | 'F';
  nationalite: string;
  adresse: string;
  contacts: string[];
  niveau_etude: string;
  etablissement_precedent: string;
  option_choisie: string;
  tuteur_id: string | null;
  classroom_id?: string; 
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

interface StudentFormData {
  nom: string;
  post_nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: 'M' | 'F';
  nationalite: string;
  adresse: string;
  contacts: string[];
  niveau_etude: string;
  etablissement_precedent: string;
  option_choisie: string;
}

// interface TeacherInfo {
//   id: string;
//   userId: string;
//   matierePrincipale: string;
//   classesResponsables: string[];
//   anneesExperience: number;
//   statut: 'titulaire' | 'remplacant' | 'stagiaire';
//   created_at: string;
//   updated_at: string;
// }
export interface ClassroomStudent {
  id: string;
  classroom_id: string;
  studentId: string;
  created_at: string;
}

interface Classroom {
  id: string;
  name: string;
  level: number; // 7-8 pour Général, 1-4 pour les sections
  section: 'Général' | 
           'Commercial et Gestion' |
           'Pédagogie Générale' |
           'Scientifique' |
           'Litteraire' |
           'Mécanique Générale' |
           'Electricité' |
           'Mécanique Automobile' |
           'Coupe et Couture';
  teacherId: string | null;
  capacity: number; // 30 pour Général (7/8ème), 40 pour les sections
  studentIds: string[];
  created_at: string;
  updated_at: string;
}
interface ClassroomFormData {
  name: string;
  level: number;
  section: string;
  teacherId?: string | null;
  capacity: number;
}




// Ajoutez ces interfaces
// Mettez à jour l'interface Course
export interface Course {
  id: string;
  name: string;
  teacherId: string;
  color: string;
  isActive: boolean;
  classroom_ids?: string[];
  created_at: string;
  updated_at: string;
}

// Ajoutez ces interfaces
export interface CourseAssignment {
  id: string;
  courseId: string;
  classroom_id: string;
  teacherId: string;
  created_at: string;
}

export interface CourseFormData {
  name: string;
  teacherId: string;
  isActive: boolean;
  color: string;
}

export interface ScheduleItem {
  id: string;
  classroom_id: string;
  day: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI';
  startTime: string; // Format "HH:MM"
  endTime: string;   // Format "HH:MM"
  courseId: string;
}

export interface ScheduleFormData {
  classroom_id: string;
  day: string;
  startTime: string;
  endTime: string;
  courseId: string;
}



// Initialisation Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Configuration IndexedDB
const DB_NAME = 'grandeurDB';
const DB_VERSION = 1; // Version incrémentée pour ajouter les classes
const USERS_STORE = 'users';
const STUDENTS_STORE = 'students';
const TEACHERS_STORE = 'teachers';
const CLASSROOMS_STORE = 'classrooms';

let dbPromise: Promise<IDBDatabase>;

// Classes par défaut
const DEFAULT_CLASSES = [
  // Classes de 7ème et 8ème (avec divisions A/B)
  { name: '7ème A', level: 7, section: 'Général', capacity: 30 },
  { name: '7ème B', level: 7, section: 'Général', capacity: 30 },
  { name: '8ème A', level: 8, section: 'Général', capacity: 30 },
  { name: '8ème B', level: 8, section: 'Général', capacity: 30 },

  // Sections pour les niveaux 1ère à 4ème
  // 1. Commercial et Gestion
  { name: '1ère Commercial et Gestion', level: 1, section: 'Commercial et Gestion', capacity: 40 },
  { name: '2ème Commercial et Gestion', level: 2, section: 'Commercial et Gestion', capacity: 40 },
  { name: '3ème Commercial et Gestion', level: 3, section: 'Commercial et Gestion', capacity: 40 },
  { name: '4ème Commercial et Gestion', level: 4, section: 'Commercial et Gestion', capacity: 40 },

  // 2. Pédagogie Générale
  { name: '1ère Pédagogie Générale', level: 1, section: 'Pédagogie Générale', capacity: 40 },
  { name: '2ème Pédagogie Générale', level: 2, section: 'Pédagogie Générale', capacity: 40 },
  { name: '3ème Pédagogie Générale', level: 3, section: 'Pédagogie Générale', capacity: 40 },
  { name: '4ème Pédagogie Générale', level: 4, section: 'Pédagogie Générale', capacity: 40 },

  // 3. Scientifique
  { name: '1ère Scientifique', level: 1, section: 'Scientifique', capacity: 40 },
  { name: '2ème Scientifique', level: 2, section: 'Scientifique', capacity: 40 },
  { name: '3ème Scientifique', level: 3, section: 'Scientifique', capacity: 40 },
  { name: '4ème Scientifique', level: 4, section: 'Scientifique', capacity: 40 },

  // 4. Litteraire
  { name: '1ère Litteraire', level: 1, section: 'Litteraire', capacity: 40 },
  { name: '2ème Litteraire', level: 2, section: 'Litteraire', capacity: 40 },
  { name: '3ème Litteraire', level: 3, section: 'Litteraire', capacity: 40 },
  { name: '4ème Litteraire', level: 4, section: 'Litteraire', capacity: 40 },

  // 5. Mécanique Générale
  { name: '1ère Mécanique Générale', level: 1, section: 'Mécanique Générale', capacity: 40 },
  { name: '2ème Mécanique Générale', level: 2, section: 'Mécanique Générale', capacity: 40 },
  { name: '3ème Mécanique Générale', level: 3, section: 'Mécanique Générale', capacity: 40 },
  { name: '4ème Mécanique Générale', level: 4, section: 'Mécanique Générale', capacity: 40 },

  // 6. Electricité
  { name: '1ère Electricité', level: 1, section: 'Electricité', capacity: 40 },
  { name: '2ème Electricité', level: 2, section: 'Electricité', capacity: 40 },
  { name: '3ème Electricité', level: 3, section: 'Electricité', capacity: 40 },
  { name: '4ème Electricité', level: 4, section: 'Electricité', capacity: 40 },

  // 7. Mécanique Automobile
  { name: '1ère Mécanique Automobile', level: 1, section: 'Mécanique Automobile', capacity: 40 },
  { name: '2ème Mécanique Automobile', level: 2, section: 'Mécanique Automobile', capacity: 40 },
  { name: '3ème Mécanique Automobile', level: 3, section: 'Mécanique Automobile', capacity: 40 },
  { name: '4ème Mécanique Automobile', level: 4, section: 'Mécanique Automobile', capacity: 40 },

  // 8. Coupe et Couture
  { name: '1ère Coupe et Couture', level: 1, section: 'Coupe et Couture', capacity: 40 },
  { name: '2ème Coupe et Couture', level: 2, section: 'Coupe et Couture', capacity: 40 },
  { name: '3ème Coupe et Couture', level: 3, section: 'Coupe et Couture', capacity: 40 },
  { name: '4ème Coupe et Couture', level: 4, section: 'Coupe et Couture', capacity: 40 }
];


// Initialisation de la base de données
export const initDB = (): Promise<IDBDatabase> => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION ); // Incrémentez la version

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        



        // Création de la store users
        if (!db.objectStoreNames.contains(USERS_STORE)) {
          const userStore = db.createObjectStore(USERS_STORE, { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: false });
          userStore.createIndex('phone', 'phone', { unique: true });
          userStore.createIndex('role', 'role', { unique: false });
        }

        // Création de la store students
        if (!db.objectStoreNames.contains(STUDENTS_STORE)) {
          const studentStore = db.createObjectStore(STUDENTS_STORE, { keyPath: 'id' });
          studentStore.createIndex('matricule', 'matricule', { unique: true });
          studentStore.createIndex('tuteur_id', 'tuteur_id', { unique: false });
          studentStore.createIndex('nom', 'nom', { unique: false });
        }

        // Ajouter ces stores dans initDB()
        if (!db.objectStoreNames.contains('courses')) {
          const courseStore = db.createObjectStore('courses', { keyPath: 'id' });
          courseStore.createIndex('name', 'name', { unique: true });
        }

        if (!db.objectStoreNames.contains('schedule')) {
          const scheduleStore = db.createObjectStore('schedule', { keyPath: 'id' });
          scheduleStore.createIndex('classroom_id', 'classroom_id', { unique: false });
          scheduleStore.createIndex('by_day_classroom', ['day', 'classroom_id'], { unique: false });
        }






   if (!db.objectStoreNames.contains('feeStructures')) {
          const feeStore = db.createObjectStore('feeStructures', { keyPath: 'id' });
          feeStore.createIndex('classroom_id', 'classroom_id', { unique: true });
        }





 if (!db.objectStoreNames.contains('payments')) {
          const paymentStore = db.createObjectStore('payments', { keyPath: 'id' });
          paymentStore.createIndex('studentId', 'studentId', { unique: false });
          paymentStore.createIndex('classroom_id', 'classroom_id', { unique: false });
          paymentStore.createIndex('matricule', 'matricule', { unique: false });
          paymentStore.createIndex('date', 'date', { unique: false });
          paymentStore.createIndex('paymentType', 'paymentType', { unique: false });
          paymentStore.createIndex('feeType', 'feeType', { unique: false });
          paymentStore.createIndex('by_student_feeType', ['studentId', 'feeType'], { unique: false });
        }




        // Dans la fonction initDB(), modifiez la partie pour les communications :
if (!db.objectStoreNames.contains('communications')) {
  const commStore = db.createObjectStore('communications', { keyPath: 'id' });
  commStore.createIndex('by_sender', 'senderId', { unique: false });
  commStore.createIndex('by_recipient', 'recipientId', { unique: false });
  commStore.createIndex('by_type', 'type', { unique: false });
  commStore.createIndex('by_created', 'created_at', { unique: false });
  commStore.createIndex('parentMessageId', 'parentMessageId', { unique: false });
}

  if (!db.objectStoreNames.contains('financialTransactions')) {
          const txStore = db.createObjectStore('financialTransactions', { keyPath: 'id' });
          txStore.createIndex('date', 'date', { unique: false });
          txStore.createIndex('type', 'type', { unique: false });
          txStore.createIndex('userId', 'userId', { unique: false });
        }


   if (!db.objectStoreNames.contains('paymentReceipts')) {
          const receiptStore = db.createObjectStore('paymentReceipts', { keyPath: 'id' });
          receiptStore.createIndex('paymentId', 'paymentId', { unique: true });
          receiptStore.createIndex('receiptNumber', 'receiptNumber', { unique: true });
          receiptStore.createIndex('date', 'date', { unique: false });
        }


// Dans la fonction initDB, ajoutez :
if (!db.objectStoreNames.contains('courseAssignments')) {
  const caStore = db.createObjectStore('courseAssignments', { keyPath: 'id' });
  caStore.createIndex('courseId', 'courseId', { unique: false });
  caStore.createIndex('classroom_id', 'classroom_id', { unique: false });
  caStore.createIndex('teacherId', 'teacherId', { unique: false });
  caStore.createIndex('by_course_classroom', ['courseId', 'classroom_id'], { unique: true });
}

if (!db.objectStoreNames.contains('grades')) {
  const gradeStore = db.createObjectStore('grades', { keyPath: 'id' });
  gradeStore.createIndex('studentId', 'studentId', { unique: false });
  gradeStore.createIndex('courseId', 'courseId', { unique: false });
  gradeStore.createIndex('period', 'period', { unique: false });
  gradeStore.createIndex('by_student_course_period', ['studentId', 'courseId', 'period'], { unique: false });
}

if (!db.objectStoreNames.contains('reportCards')) {
  const rcStore = db.createObjectStore('reportCards', { keyPath: 'id' });
  rcStore.createIndex('studentId', 'studentId', { unique: false });
  rcStore.createIndex('period', 'period', { unique: false });
  rcStore.createIndex('by_student_period', ['studentId', 'period'], { unique: true });
}

let gradeStore: IDBObjectStore;
        if (!db.objectStoreNames.contains('grades')) {
          gradeStore = db.createObjectStore('grades', { keyPath: 'id' });
        } else {
          gradeStore = request.transaction?.objectStore('grades') as IDBObjectStore;
        }
 if (!gradeStore.indexNames.contains('by_student_course_period')) {
          gradeStore.createIndex('by_student_course_period', ['studentId', 'courseId', 'period'], { unique: false });
        }
        if (!gradeStore.indexNames.contains('by_course_classroom')) {
          gradeStore.createIndex('by_course_classroom', ['courseId', 'classroom_id'], { unique: false });
        }


// Dans la fonction initDB(), ajoutez :
if (!db.objectStoreNames.contains('communications')) {
  const commStore = db.createObjectStore('communications', { keyPath: 'id' });
  commStore.createIndex('by_sender', 'senderId', { unique: false });
  commStore.createIndex('by_recipient', 'recipientId', { unique: false });
  commStore.createIndex('by_type', 'type', { unique: false });
  commStore.createIndex('by_created', 'created_at', { unique: false });
}




// Dans la fonction initDB(), ajoutez ceci avec les autres objectStores
if (!db.objectStoreNames.contains('bulkEmails')) {
  const bulkEmailStore = db.createObjectStore('bulkEmails', { keyPath: 'id' });
  bulkEmailStore.createIndex('by_sender', 'senderId', { unique: false });
  bulkEmailStore.createIndex('by_created', 'created_at', { unique: false });
}






// Ajoutez dans la fonction initDB()
if (!db.objectStoreNames.contains('absences')) {
  const absenceStore = db.createObjectStore('absences', { keyPath: 'id' });
  absenceStore.createIndex('by_student', 'studentId', { unique: false });
  absenceStore.createIndex('by_date', 'date', { unique: false });
  absenceStore.createIndex('by_classroom', 'classroom_id', { unique: false });
  absenceStore.createIndex('by_student_date', ['studentId', 'date'], { unique: true });
}

if (!db.objectStoreNames.contains('absenceRecords')) {
  const recordStore = db.createObjectStore('absenceRecords', { keyPath: 'id' });
  recordStore.createIndex('by_date', 'date', { unique: false });
  recordStore.createIndex('by_classroom', 'classroom_id', { unique: false });
}









        // Création de la store teachers
        if (!db.objectStoreNames.contains(TEACHERS_STORE)) {
          const teacherStore = db.createObjectStore(TEACHERS_STORE, { keyPath: 'id' });
          teacherStore.createIndex('userId', 'userId', { unique: true });
          teacherStore.createIndex('matierePrincipale', 'matierePrincipale', { unique: false });
          teacherStore.createIndex('statut', 'statut', { unique: false });
        }

        // Création de la store classrooms
        if (!db.objectStoreNames.contains(CLASSROOMS_STORE)) {
          const classroomStore = db.createObjectStore(CLASSROOMS_STORE, { keyPath: 'id' });
          classroomStore.createIndex('name', 'name', { unique: true });
          classroomStore.createIndex('level', 'level', { unique: false });
          classroomStore.createIndex('teacherId', 'teacherId', { unique: false });
        }

        // Création de la store classroomStudents
        if (!db.objectStoreNames.contains('classroomStudents')) {
          const csStore = db.createObjectStore('classroomStudents', { keyPath: 'id' });
          csStore.createIndex('classroom_id', 'classroom_id', { unique: false });
          csStore.createIndex('studentId', 'studentId', { unique: true }); // Un élève ne peut être que dans une classe
          csStore.createIndex('by_classroom_student', ['classroom_id', 'studentId'], { unique: true });
        }
      };







      




      

      request.onsuccess = async (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Ajouter les classes par défaut si nécessaire
        await checkAndAddDefaultClasses(db);
        resolve(db);
      };
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
};



// Fonction pour ajouter les classes par défaut
async function checkAndAddDefaultClasses(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CLASSROOMS_STORE, 'readonly');
    const store = tx.objectStore(CLASSROOMS_STORE);
    const countRequest = store.count();

    countRequest.onsuccess = () => {
      if (countRequest.result === 0) {
        const writeTx = db.transaction(CLASSROOMS_STORE, 'readwrite');
        const writeStore = writeTx.objectStore(CLASSROOMS_STORE);

        // Vérification de la structure des classes avant ajout
        DEFAULT_CLASSES.forEach(cls => {
          // Validation du niveau selon la section
          if (cls.section === 'Général' && ![7, 8].includes(cls.level)) {
            console.error(`Classe ${cls.name} invalide : Les classes générales doivent être de niveau 7 ou 8`);
            return;
          }
          
          if (cls.section !== 'Général' && ![1, 2, 3, 4].includes(cls.level)) {
            console.error(`Classe ${cls.name} invalide : Les classes spécialisées doivent être de niveau 1 à 4`);
            return;
          }

          const classroom: Classroom = {
            id: uuidv4(),
            name: cls.name,
            level: cls.level,
            section: cls.section as Classroom['section'], // On s'assure que la section est valide
            teacherId: null,
            capacity: cls.capacity,
            studentIds: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          try {
            writeStore.add(classroom);
          } catch (error) {
            console.error(`Erreur lors de l'ajout de la classe ${cls.name}:`, error);
          }
        });

        writeTx.oncomplete = () => {
          console.log('Classes par défaut ajoutées avec succès');
          resolve();
        };
        writeTx.onerror = (error) => {
          console.error('Erreur lors de l\'ajout des classes par défaut:', error);
          reject(writeTx.error);
        };
      } else {
        resolve();
      }
    };
    countRequest.onerror = () => {
      console.error('Erreur lors du comptage des classes existantes');
      reject(countRequest.error);
    };
  });
}
// Opérations CRUD pour les utilisateurs
export async function createUser(userData: UserFormData): Promise<User> {
  const db = await initDB();
  const user: User = {
    id: uuidv4(),
    email: userData.email || null,
    name: userData.name,
    role: userData.role,
    password: userData.password,
    phone: userData.phone,
    is_online: true,
    last_sign_in_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(USERS_STORE, 'readwrite');
    const store = tx.objectStore(USERS_STORE);
    const request = store.add(user);
    
    request.onsuccess = () => resolve(user);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllUsers(): Promise<User[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(USERS_STORE, 'readonly');
    const store = tx.objectStore(USERS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result as User[]);
    request.onerror = () => reject(request.error);
  });
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(USERS_STORE, 'readonly');
    const store = tx.objectStore(USERS_STORE);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result as User | null);
    request.onerror = () => reject(request.error);
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(USERS_STORE, 'readonly');
    const store = tx.objectStore(USERS_STORE);
    const index = store.index('email');
    const request = index.get(email);
    
    request.onsuccess = () => resolve(request.result as User | null);
    request.onerror = () => reject(request.error);
  });
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(USERS_STORE, 'readonly');
    const store = tx.objectStore(USERS_STORE);
    const index = store.index('phone');
    const request = index.get(phone);
    
    request.onsuccess = () => resolve(request.result as User | null);
    request.onerror = () => reject(request.error);
  });
}

export async function updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(USERS_STORE, 'readwrite');
    const store = tx.objectStore(USERS_STORE);
    const getRequest = store.get(userId);

    getRequest.onsuccess = () => {
      const user = getRequest.result;
      if (user) {
        user.is_online = isOnline;
        user.last_sign_in_at = isOnline ? new Date().toISOString() : user.last_sign_in_at;
        
        const updateRequest = store.put(user);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Utilisateur non trouvé'));
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function deleteUser(userId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(USERS_STORE, 'readwrite');
    const store = tx.objectStore(USERS_STORE);
    const request = store.delete(userId);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getParents(): Promise<User[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(USERS_STORE, 'readonly');
    const store = tx.objectStore(USERS_STORE);
    const index = store.index('role');
    const request = index.getAll('parent');
    
    request.onsuccess = () => resolve(request.result as User[] || []);
    request.onerror = () => reject(request.error);
  });
}

// Opérations CRUD pour les étudiants
export async function createStudent(studentData: StudentFormData): Promise<Student> {
  const db = await initDB();
  const count = await getStudentsCount();
  const matricule = `${count + 1}${studentData.nom.charAt(0)}${studentData.prenom.charAt(0)}${new Date().getFullYear()}`;
  
  const student: Student = {
    id: uuidv4(),
    matricule,
    ...studentData,
    tuteur_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STUDENTS_STORE, 'readwrite');
    const store = tx.objectStore(STUDENTS_STORE);
    const request = store.add(student);
    
    request.onsuccess = () => resolve(student);
    request.onerror = () => reject(request.error);
  });
}

export async function getStudentsCount(): Promise<number> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STUDENTS_STORE, 'readonly');
    const store = tx.objectStore(STUDENTS_STORE);
    const request = store.count();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getStudentById(id: string): Promise<Student | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STUDENTS_STORE, 'readonly');
    const store = tx.objectStore(STUDENTS_STORE);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result as Student | null);
    request.onerror = () => reject(request.error);
  });
}

export async function assignTutor(studentId: string, tuteur_id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STUDENTS_STORE, 'readwrite');
    const store = tx.objectStore(STUDENTS_STORE);
    const request = store.get(studentId);
    
    request.onsuccess = () => {
      const student = request.result;
      if (student) {
        student.tuteur_id = tuteur_id;
        student.updated_at = new Date().toISOString();
        
        const updateRequest = store.put(student);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Élève non trouvé'));
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function updateStudent(id: string, studentData: Partial<StudentFormData>): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STUDENTS_STORE, 'readwrite');
    const store = tx.objectStore(STUDENTS_STORE);
    const request = store.get(id);
    
    request.onsuccess = () => {
      const student = request.result;
      if (student) {
        const updatedStudent = {
          ...student,
          ...studentData,
          updated_at: new Date().toISOString()
        };
        const updateRequest = store.put(updatedStudent);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Élève non trouvé'));
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getAllStudents(): Promise<Student[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STUDENTS_STORE, 'readonly');
    const store = tx.objectStore(STUDENTS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result as Student[]);
    request.onerror = () => reject(request.error);
  });
}

export async function getStudentByTutorId(tutorId: string): Promise<Student[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STUDENTS_STORE, 'readonly');
    const store = tx.objectStore(STUDENTS_STORE);
    const index = store.index('tuteur_id');
    const request = index.getAll(tutorId);
    
    request.onsuccess = () => resolve(request.result as Student[] || []);
    request.onerror = () => reject(request.error);
  });
}

// Opérations CRUD pour les enseignants
export async function getTeacherInfo(userId: string): Promise<TeacherInfo | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TEACHERS_STORE, 'readonly');
    const store = tx.objectStore(TEACHERS_STORE);
    const index = store.index('userId');
    const request = index.get(userId);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}






















// Mettez à jour l'interface TeacherInfo
interface TeacherInfo {
  id: string;
  userId: string;
  matricule: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  adresse: string;
  situationMatrimoniale: 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'VEUF';
  grade: 'LICENCE' | 'MASTER' | 'DIPLOME' | 'DOCTORAT' | 'AUTRE';
  matierePrincipale: string;
  classesResponsables: string[];
  anneesExperience: number;
  statut: 'titulaire' | 'remplacant' | 'stagiaire';
  created_at: string;
  updated_at: string;
}

// Ajoutez cette interface pour le formulaire
interface TeacherInfoFormData {
  matricule?: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  adresse: string;
  situationMatrimoniale: 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'VEUF';
  grade: 'LICENCE' | 'MASTER' | 'DIPLOME' | 'DOCTORAT' | 'AUTRE';
  matierePrincipale: string;
  classesResponsables: string[];
  anneesExperience: number;
  statut: 'titulaire' | 'remplacant' | 'stagiaire';
}



// export async function addTeacherInfo(
//   userId: string, 
//   teacherData: Omit<TeacherInfo, 'id' | 'userId' | 'created_at' | 'updated_at'>
// ): Promise<void> {
//   const db = await initDB();
  
//   const completeInfo: TeacherInfo = {
//     id: uuidv4(),
//     userId,
//     ...teacherData,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString()
//   };

//   return new Promise((resolve, reject) => {
//     const tx = db.transaction(TEACHERS_STORE, 'readwrite');
//     const store = tx.objectStore(TEACHERS_STORE);
//     const request = store.add(completeInfo);
    
//     request.onsuccess = () => resolve();
//     request.onerror = () => reject(request.error);
//   });
// }

// export async function updateTeacherInfo(
//   userId: string,
//   teacherData: Partial<TeacherInfo>
// ): Promise<void> {
//   const db = await initDB();
  
//   return new Promise((resolve, reject) => {
//     const tx = db.transaction(TEACHERS_STORE, 'readwrite');
//     const store = tx.objectStore(TEACHERS_STORE);
//     const index = store.index('userId');
//     const getRequest = index.get(userId);
    
//     getRequest.onsuccess = () => {
//       const existingData = getRequest.result;
//       if (existingData) {
//         const updatedInfo = {
//           ...existingData,
//           ...teacherData,
//           updated_at: new Date().toISOString()
//         };
//         const updateRequest = store.put(updatedInfo);
//         updateRequest.onsuccess = () => resolve();
//         updateRequest.onerror = () => reject(updateRequest.error);
//       } else {
//         reject(new Error('Informations enseignant non trouvées'));
//       }
//     };
//     getRequest.onerror = () => reject(getRequest.error);
//   });
// }





































































// Ajoutez cette fonction pour compter les enseignants
export async function getTeachersCount(): Promise<number> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TEACHERS_STORE, 'readonly');
    const store = tx.objectStore(TEACHERS_STORE);
    const request = store.count();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Mettez à jour la fonction addTeacherInfo
export async function addTeacherInfo(
  userId: string, 
  teacherData: Omit<TeacherInfo, 'id' | 'userId' | 'created_at' | 'updated_at' | 'matricule'>
): Promise<void> {
  const db = await initDB();
  
  // Récupérer l'utilisateur et le nombre d'enseignants
  const [user, count] = await Promise.all([
    getUserById(userId),
    getTeachersCount()
  ]);

  // Générer le matricule selon la nouvelle logique
  const matricule = `${count + 1}${user?.name.substring(0, 2).toUpperCase()}${new Date().getFullYear()}`;

  const completeInfo: TeacherInfo = {
    id: uuidv4(),
    userId,
    matricule,
    ...teacherData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(TEACHERS_STORE, 'readwrite');
    const store = tx.objectStore(TEACHERS_STORE);
    const request = store.add(completeInfo);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Mettez à jour la fonction updateTeacherInfo
export async function updateTeacherInfo(
  userId: string,
  teacherData: Partial<TeacherInfo>
): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TEACHERS_STORE, 'readwrite');
    const store = tx.objectStore(TEACHERS_STORE);
    const index = store.index('userId');
    const getRequest = index.get(userId);
    
    getRequest.onsuccess = () => {
      const existingData = getRequest.result;
      if (existingData) {
        // Ne pas permettre la modification du matricule
        const { matricule, ...restData } = teacherData;
        
        const updatedInfo = {
          ...existingData,
          ...restData,
          updated_at: new Date().toISOString()
        };
        
        const updateRequest = store.put(updatedInfo);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Informations enseignant non trouvées'));
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}






























export async function getEnseignantsWithDetails(): Promise<(User & { teacherInfo?: TeacherInfo })[]> {
  const db = await initDB();
  
  const users = await new Promise<User[]>((resolve, reject) => {
    const tx = db.transaction(USERS_STORE, 'readonly');
    const store = tx.objectStore(USERS_STORE);
    const index = store.index('role');
    const request = index.getAll('enseignant');
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });

  const result = [];
  for (const user of users) {
    try {
      const info = await new Promise<TeacherInfo | undefined>((resolve, reject) => {
        const tx = db.transaction(TEACHERS_STORE, 'readonly');
        const store = tx.objectStore(TEACHERS_STORE);
        const index = store.index('userId');
        const request = index.get(user.id);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      result.push({ ...user, teacherInfo: info });
    } catch (error) {
      console.error(`Erreur chargement infos enseignant ${user.id}:`, error);
      result.push({ ...user });
    }
  }
  
  return result;
}


export async function createClassroom(classroomData: ClassroomFormData): Promise<Classroom> {
  // First validate the section type
  type ValidSection = 'Général' | 'Commercial et Gestion' | 'Pédagogie Générale' | 
                     'Scientifique' | 'Litteraire' | 'Mécanique Générale' | 
                     'Electricité' | 'Mécanique Automobile' | 'Coupe et Couture';

  const validSections: ValidSection[] = [
    'Général',
    'Commercial et Gestion',
    'Pédagogie Générale',
    'Scientifique',
    'Litteraire',
    'Mécanique Générale',
    'Electricité',
    'Mécanique Automobile',
    'Coupe et Couture'
  ];

  // Type assertion with runtime validation
  if (!validSections.includes(classroomData.section as ValidSection)) {
    throw new Error(`Invalid section. Valid sections are: ${validSections.join(', ')}`);
  }

  const db = await initDB();
  const classroom: Classroom = {
    id: uuidv4(),
    name: classroomData.name,
    level: classroomData.level,
    section: classroomData.section as ValidSection, // This is now type-safe
    teacherId: classroomData.teacherId || null,
    capacity: classroomData.section === 'Général' 
      ? Math.min(classroomData.capacity, 30)
      : Math.min(classroomData.capacity, 40),
    studentIds: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(CLASSROOMS_STORE, 'readwrite');
    const store = tx.objectStore(CLASSROOMS_STORE);
    const request = store.add(classroom);
    
    request.onsuccess = () => resolve(classroom);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllClassrooms(): Promise<Classroom[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CLASSROOMS_STORE, 'readonly');
    const store = tx.objectStore(CLASSROOMS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result as Classroom[]);
    request.onerror = () => reject(request.error);
  });
}

export async function getClassroomById(id: string): Promise<Classroom | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CLASSROOMS_STORE, 'readonly');
    const store = tx.objectStore(CLASSROOMS_STORE);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result as Classroom | null);
    request.onerror = () => reject(request.error);
  });
}

export async function updateClassroom(id: string, classroomData: Partial<ClassroomFormData>): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CLASSROOMS_STORE, 'readwrite');
    const store = tx.objectStore(CLASSROOMS_STORE);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const classroom = getRequest.result;
      if (classroom) {
        const updatedClassroom = {
          ...classroom,
          ...classroomData,
          updated_at: new Date().toISOString()
        };
        const updateRequest = store.put(updatedClassroom);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Classe non trouvée'));
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function assignTeacherToClassroom(classroom_id: string, teacherId: string | null): Promise<void> {
  return updateClassroom(classroom_id, { teacherId });
}

export async function getClassroomsByTeacher(teacherId: string): Promise<Classroom[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CLASSROOMS_STORE, 'readonly');
    const store = tx.objectStore(CLASSROOMS_STORE);
    const index = store.index('teacherId');
    const request = index.getAll(teacherId);
    
    request.onsuccess = () => resolve(request.result as Classroom[] || []);
    request.onerror = () => reject(request.error);
  });
}

// Synchronisation avec Supabase
export async function exportToSupabase(): Promise<number> {
  try {
    const localUsers = await getAllUsers();
    if (localUsers.length === 0) {
      console.log('Aucun utilisateur à exporter');
      return 0;
    }

    const { error } = await supabase.from('users').upsert(
      localUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        password: user.password,
        phone: user.phone,
        is_online: user.is_online,
        last_sign_in_at: user.last_sign_in_at,
        created_at: user.created_at
      })),
      { onConflict: 'id' }
    );

    if (error) throw error;
    return localUsers.length;
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    throw error;
  }
}

export async function importFromSupabase(): Promise<number> {
  try {
    const { data: remoteUsers, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    if (!remoteUsers || remoteUsers.length === 0) return 0;

    const db = await initDB();
    let importedCount = 0;

    await Promise.all(remoteUsers.map(async (remoteUser) => {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(USERS_STORE, 'readwrite');
        const store = tx.objectStore(USERS_STORE);
        
        const user: User = {
          id: remoteUser.id,
          email: remoteUser.email,
          name: remoteUser.name,
          role: remoteUser.role,
          password: remoteUser.password,
          phone: remoteUser.phone,
          is_online: remoteUser.is_online,
          last_sign_in_at: remoteUser.last_sign_in_at,
          created_at: remoteUser.created_at || new Date().toISOString()
        };

        const request = store.put(user);
        request.onsuccess = () => {
          importedCount++;
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    }));

    return importedCount;
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    throw error;
  }
}





// Ajoutez ces nouvelles fonctions
export async function addStudentToClassroom(classroom_id: string, studentId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['classrooms', 'classroomStudents'], 'readwrite');
    const classroomStore = tx.objectStore('classrooms');
    const csStore = tx.objectStore('classroomStudents');

    // Vérifier si l'élève est déjà dans la classe
    const index = csStore.index('studentId');
    const request = index.get(studentId);

    request.onsuccess = () => {
      if (request.result) {
        reject(new Error('Cet élève est déjà dans une classe'));
        return;
      }

      // Ajouter la relation
      const relation: ClassroomStudent = {
        id: uuidv4(),
        classroom_id,
        studentId,
        created_at: new Date().toISOString()
      };

      const addRequest = csStore.add(relation);
      
      addRequest.onsuccess = () => {
        // Mettre à jour la classe
        const getClassRequest = classroomStore.get(classroom_id);
        getClassRequest.onsuccess = () => {
          const classroom = getClassRequest.result;
          if (classroom) {
            if (!classroom.studentIds) classroom.studentIds = [];
            classroom.studentIds.push(studentId);
            classroom.updated_at = new Date().toISOString();
            
            const updateRequest = classroomStore.put(classroom);
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject(updateRequest.error);
          } else {
            reject(new Error('Classe non trouvée'));
          }
        };
        getClassRequest.onerror = () => reject(getClassRequest.error);
      };
      addRequest.onerror = () => reject(addRequest.error);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getStudentsInClassroom(classroom_id: string): Promise<Student[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['classroomStudents', 'students'], 'readonly');
    const csStore = tx.objectStore('classroomStudents');
    const studentStore = tx.objectStore('students');

    const index = csStore.index('classroom_id');
    const request = index.getAll(classroom_id);

    request.onsuccess = async () => {
      const relations = request.result as ClassroomStudent[];
      if (!relations || relations.length === 0) {
        resolve([]);
        return;
      }

      const students = await Promise.all(relations.map(relation => {
        return new Promise<Student>((resolve, reject) => {
          const studentRequest = studentStore.get(relation.studentId);
          studentRequest.onsuccess = () => resolve(studentRequest.result);
          studentRequest.onerror = () => reject(studentRequest.error);
        });
      }));

      resolve(students.filter(s => s !== undefined) as Student[]);
    };
    request.onerror = () => reject(request.error);
  });
}


export async function removeStudentFromClassroom(classroom_id: string, studentId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['classrooms', 'classroomStudents'], 'readwrite');
    const classroomStore = tx.objectStore('classrooms');
    const csStore = tx.objectStore('classroomStudents');

    // Trouver la relation à supprimer
    const index = csStore.index('studentId');
    const getRequest = index.get(studentId);

    getRequest.onsuccess = () => {
      const relation = getRequest.result;
      if (!relation) {
        reject(new Error('Élève non trouvé dans cette classe'));
        return;
      }

      // Supprimer la relation
      const deleteRequest = csStore.delete(relation.id);
      
      deleteRequest.onsuccess = () => {
        // Mettre à jour la classe
        const getClassRequest = classroomStore.get(classroom_id);
        getClassRequest.onsuccess = () => {
          const classroom = getClassRequest.result; // Correction: .result au lieu de _result
          if (classroom) {
            if (classroom.studentIds) {
              classroom.studentIds = classroom.studentIds.filter((id: string) => id !== studentId); // Ajout du typage
            }
            classroom.updated_at = new Date().toISOString();
            
            const updateRequest = classroomStore.put(classroom);
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject(updateRequest.error);
          } else {
            reject(new Error('Classe non trouvée'));
          }
        };
        getClassRequest.onerror = () => reject(getClassRequest.error);
      };
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}



// Fonctions CRUD pour les cours
// export async function createCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
//   const db = await initDB();
//   const course: Course = {
//     id: uuidv4(),
//     ...courseData
//   };

//   return new Promise((resolve, reject) => {
//     const tx = db.transaction('courses', 'readwrite');
//     const store = tx.objectStore('courses');
//     const request = store.add(course);
    
//     request.onsuccess = () => resolve(course);
//     request.onerror = () => reject(request.error);
//   });
// }

// export async function getAllCourses(): Promise<Course[]> {
//   const db = await initDB();
//   return new Promise((resolve, reject) => {
//     const tx = db.transaction('courses', 'readonly');
//     const store = tx.objectStore('courses');
//     const request = store.getAll();
    
//     request.onsuccess = () => resolve(request.result as Course[]);
//     request.onerror = () => reject(request.error);
//   });
// }

// Fonctions CRUD pour les horaires

export async function getScheduleForClassroom(classroom_id: string): Promise<ScheduleItem[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('schedule', 'readonly');
    const store = tx.objectStore('schedule');
    const index = store.index('classroom_id');
    const request = index.getAll(classroom_id);
    
    request.onsuccess = () => resolve(request.result as ScheduleItem[] || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteScheduleItem(itemId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('schedule', 'readwrite');
    const store = tx.objectStore('schedule');
    const request = store.delete(itemId);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}


// Ajoutez ces fonctions
// export async function createCourse(courseData: CourseFormData): Promise<Course> {
//   const db = await initDB();
//   const course: Course = {
//     id: uuidv4(),
//     ...courseData,
//     created_at: new Date().toISOString()
//   };

//   return new Promise((resolve, reject) => {
//     const tx = db.transaction('courses', 'readwrite');
//     const store = tx.objectStore('courses');
//     const request = store.add(course);
    
//     request.onsuccess = () => resolve(course);
//     request.onerror = () => reject(request.error);
//   });
// }

export async function createCourse(courseData: CourseFormData): Promise<Course> {
    const db = await initDB();
    const course: Course = {
        id: uuidv4(),
        name: courseData.name,
        teacherId: courseData.teacherId,
        color: courseData.color,
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
        const tx = db.transaction('courses', 'readwrite');
        const store = tx.objectStore('courses');
        const request = store.add(course);

        request.onsuccess = () => resolve(course);
        request.onerror = () => reject(request.error);
    });
}

export async function getAllCourses(): Promise<Course[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('courses', 'readonly');
    const store = tx.objectStore('courses');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result as Course[]);
    request.onerror = () => reject(request.error);
  });
}

export async function getCourseById(id: string): Promise<Course | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('courses', 'readonly');
    const store = tx.objectStore('courses');
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result as Course | null);
    request.onerror = () => reject(request.error);
  });
}





/**
 * Retourne toutes les sections disponibles en se basant sur le type Classroom
 * @returns string[] - Tableau des noms de sections
 */
export function getAllSections(): string[] {
  type ClassroomSection = Classroom['section'];
  const sections: ClassroomSection[] = [
    'Général',
    'Commercial et Gestion',
    'Pédagogie Générale',
    'Scientifique',
    'Litteraire',
    'Mécanique Générale',
    'Electricité',
    'Mécanique Automobile',
    'Coupe et Couture'
  ];
  return sections;
}



// Interfaces et constantes existantes restent les mêmes...

// Fonction pour obtenir tous les horaires avec détails complets
export async function getCompleteSchedule(): Promise<
  Array<ScheduleItem & { classroom: Classroom | undefined; course: Course | null }>
> {
  const db = await initDB();
  return new Promise(async (resolve, reject) => {
    try {
      const [allSchedule, allClassrooms, allCourses] = await Promise.all([
        new Promise<ScheduleItem[]>((res, rej) => {
          const tx = db.transaction('schedule', 'readonly');
          const store = tx.objectStore('schedule');
          const request = store.getAll();
          request.onsuccess = () => res(request.result || []);
          request.onerror = () => rej(request.error);
        }),
        getAllClassrooms(),
        getAllCourses()
      ]);

      const completeSchedule = allSchedule.map(item => {
        const classroom = allClassrooms.find(c => c.id === item.classroom_id);
        const course = allCourses.find(c => c.id === item.courseId) || null;
        return { ...item, classroom, course };
      });

      resolve(completeSchedule);
    } catch (error) {
      reject(error);
    }
  });
}

// Fonction pour créer un horaire avec validation
export async function createScheduleItem(
  scheduleData: ScheduleFormData
): Promise<ScheduleItem> {
  const db = await initDB();

  // Vérifier que la classe existe
  const classroom = await getClassroomById(scheduleData.classroom_id);
  if (!classroom) {
    throw new Error('Classe non trouvée');
  }

  // Vérifier les conflits d'horaire
  const existingItems = await getScheduleForClassroom(scheduleData.classroom_id);
  const hasConflict = existingItems.some(
    item =>
      item.day === scheduleData.day &&
      ((scheduleData.startTime >= item.startTime && scheduleData.startTime < item.endTime) ||
        (scheduleData.endTime > item.startTime && scheduleData.endTime <= item.endTime))
  );

  if (hasConflict) {
    throw new Error('Conflit horaire avec un cours existant');
  }

  const scheduleItem: ScheduleItem = {
    id: uuidv4(),
    ...scheduleData,
    day: scheduleData.day as ScheduleItem['day']
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('schedule', 'readwrite');
    const store = tx.objectStore('schedule');
    const request = store.add(scheduleItem);
    
    request.onsuccess = () => resolve(scheduleItem);
    request.onerror = () => reject(request.error);
  });
}



export async function getClassroomsBySection(): Promise<Record<string, Classroom[]>> {
  const classrooms = await getAllClassrooms();
  const grouped: Record<string, Classroom[]> = {};

  classrooms.forEach(classroom => {
    if (!grouped[classroom.section]) {
      grouped[classroom.section] = [];
    }
    grouped[classroom.section].push(classroom);
  });

  return grouped;
}




// Ajoutez cette fonction dans db.ts
export async function getStudentClass(studentId: string): Promise<Classroom | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['students', 'classrooms'], 'readonly');
    const studentStore = tx.objectStore('students');
    const classroomStore = tx.objectStore('classrooms');

    const getStudentRequest = studentStore.get(studentId);
    
    getStudentRequest.onsuccess = () => {
      const student = getStudentRequest.result;
      if (!student || !student.classroom_id) {
        resolve(null);
        return;
      }

      const getClassRequest = classroomStore.get(student.classroom_id);
      getClassRequest.onsuccess = () => resolve(getClassRequest.result);
      getClassRequest.onerror = () => reject(getClassRequest.error);
    };

    getStudentRequest.onerror = () => reject(getStudentRequest.error);
  });
}



export async function getClassroomForStudent(studentId: string): Promise<Classroom | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['classroomStudents', 'classrooms'], 'readonly');
    const csStore = tx.objectStore('classroomStudents');
    const classroomStore = tx.objectStore('classrooms');

    // Trouver la relation élève-classe
    const index = csStore.index('studentId');
    const getRequest = index.get(studentId);

    getRequest.onsuccess = () => {
      const relation = getRequest.result as ClassroomStudent | undefined;
      if (!relation) {
        resolve(null);
        return;
      }

      // Récupérer la classe correspondante
      const getClassRequest = classroomStore.get(relation.classroom_id);
      getClassRequest.onsuccess = () => resolve(getClassRequest.result as Classroom | null);
      getClassRequest.onerror = () => reject(getClassRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}




export async function assignCourseToClassroom(
  courseId: string, 
  classroom_id: string,
  teacherId: string
): Promise<CourseAssignment> {
  const db = await initDB();
  const assignment: CourseAssignment = {
    id: uuidv4(),
    courseId,
    classroom_id,
    teacherId,
    created_at: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('courseAssignments', 'readwrite');
    const store = tx.objectStore('courseAssignments');
    const request = store.add(assignment);
    
    request.onsuccess = () => resolve(assignment);
    request.onerror = () => reject(request.error);
  });
}

export async function getCoursesForClassroom(classroom_id: string): Promise<Course[]> {
  const db = await initDB();
  return new Promise(async (resolve, reject) => {
    try {
      const assignments = await new Promise<CourseAssignment[]>((res, rej) => {
        const tx = db.transaction('courseAssignments', 'readonly');
        const store = tx.objectStore('courseAssignments');
        const index = store.index('classroom_id');
        const request = index.getAll(classroom_id);
        request.onsuccess = () => res(request.result || []);
        request.onerror = () => rej(request.error);
      });

      const courses = await Promise.all(assignments.map(ass => {
        return new Promise<Course>((res, rej) => {
          const tx = db.transaction('courses', 'readonly');
          const store = tx.objectStore('courses');
          const request = store.get(ass.courseId);
          request.onsuccess = () => res(request.result);
          request.onerror = () => rej(request.error);
        });
      }));

      resolve(courses.filter(c => c !== undefined) as Course[]);
    } catch (error) {
      reject(error);
    }
  });
}

export async function removeCourseFromClassroom(classroom_id: string, courseId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('courseAssignments', 'readwrite');
    const store = tx.objectStore('courseAssignments');
    const index = store.index('by_course_classroom');
    const request = index.get([courseId, classroom_id]);

    request.onsuccess = () => {
      const assignment = request.result;
      if (assignment) {
        const deleteRequest = store.delete(assignment.id);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      } else {
        reject(new Error('Assignment not found'));
      }
    };
    request.onerror = () => reject(request.error);
  });
}


// In your db.ts, add these functions:






export async function getCoursesForTeacher(teacherId: string): Promise<Course[]> {
  const db = await initDB()
  return new Promise(async (resolve, reject) => {
    try {
      const assignments = await new Promise<CourseAssignment[]>((res, rej) => {
        const tx = db.transaction('courseAssignments', 'readonly')
        const store = tx.objectStore('courseAssignments')
        const index = store.index('teacherId')
        const request = index.getAll(teacherId)
        request.onsuccess = () => res(request.result || [])
        request.onerror = () => rej(request.error)
      })

      const courses = await Promise.all(
        assignments.map(ass => 
          new Promise<Course>((res, rej) => {
            const tx = db.transaction('courses', 'readonly')
            const store = tx.objectStore('courses')
            const request = store.get(ass.courseId)
            request.onsuccess = () => res(request.result)
            request.onerror = () => rej(request.error)
          })
        )
      )

      resolve(courses.filter(c => c !== undefined) as Course[])
    } catch (error) {
      reject(error)
    }
  })
}

export async function getClassroomsForTeacher(teacherId: string): Promise<Classroom[]> {
  const db = await initDB();
  return new Promise(async (resolve, reject) => {
    try {
      // Classes where the teacher teaches
      const courseAssignments = await new Promise<CourseAssignment[]>((res, rej) => {
        const tx = db.transaction('courseAssignments', 'readonly');
        const store = tx.objectStore('courseAssignments');
        const index = store.index('teacherId');
        const request = index.getAll(teacherId);
        request.onsuccess = () => res(request.result || []);
        request.onerror = () => rej(request.error);
      });

      const classroom_ids = Array.from(new Set(courseAssignments.map(ass => ass.classroom_id)));
      
      // Classes where the teacher is responsible
      const responsibleClasses = await new Promise<Classroom[]>((res, rej) => {
        const tx = db.transaction(CLASSROOMS_STORE, 'readonly');
        const store = tx.objectStore(CLASSROOMS_STORE);
        const index = store.index('teacherId');
        const request = index.getAll(teacherId);
        request.onsuccess = () => res(request.result || []);
        request.onerror = () => rej(request.error);
      });

      // Combine both lists without duplicates
      const allClassroom_ids = Array.from(new Set([
        ...classroom_ids,
        ...responsibleClasses.map(c => c.id)
      ]));

      const classrooms = await Promise.all(
        allClassroom_ids.map(id => 
          new Promise<Classroom>((res, rej) => {
            const tx = db.transaction(CLASSROOMS_STORE, 'readonly');
            const store = tx.objectStore(CLASSROOMS_STORE);
            const request = store.get(id);
            request.onsuccess = () => res(request.result);
            request.onerror = () => rej(request.error);
          })
        )
      );

      resolve(classrooms.filter(c => c !== undefined) as Classroom[]);
    } catch (error) {
      reject(error);
    }
  });
}













export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  classroom_id: string;
  period: string;
  P1?: number;
  P2?: number;
  Examen1?: number;
  S1?: number;
  P3?: number;
  P4?: number;
  Examen2?: number;
  S2?: number;
  total?: number;
  appreciation?: string;
  created_at: string;
  updated_at: string;
}

export interface GradeFormData {
  studentId: string;
  courseId: string;
  classroom_id: string;
  period: string;
  P1?: number;
  P2?: number;
  Examen1?: number;
  P3?: number;
  P4?: number;
  Examen2?: number;
}




// db.ts
export async function createOrUpdateGrade(gradeData: GradeFormData): Promise<Grade> {
  const db = await initDB();
  
  // Calcul des notes
  const S1 = gradeData.P1 !== undefined && gradeData.P2 !== undefined && gradeData.Examen1 !== undefined
    ? Math.round((gradeData.P1 * 0.3 + gradeData.P2 * 0.3 + gradeData.Examen1 * 0.4))
    : undefined;
  
  const S2 = gradeData.P3 !== undefined && gradeData.P4 !== undefined && gradeData.Examen2 !== undefined
    ? Math.round((gradeData.P3 * 0.3 + gradeData.P4 * 0.3 + gradeData.Examen2 * 0.4))
    : undefined;

  const total = S1 !== undefined && S2 !== undefined ? Math.round((S1 + S2) / 2) : undefined;

  const appreciation = total !== undefined ? 
    total >= 80 ? "Excellent" :
    total >= 70 ? "Très bien" :
    total >= 60 ? "Bien" :
    total >= 50 ? "Satisfaisant" :
    total >= 30 ? "Insuffisant" : "Médiocre"
    : undefined;

  return new Promise((resolve, reject) => {
    const tx = db.transaction('grades', 'readwrite');
    const store = tx.objectStore('grades');
    
    const index = store.index('by_student_course_period');
    // Correction: Utiliser la période de gradeData
    const request = index.get([gradeData.studentId, gradeData.courseId, gradeData.period || 'unique']);

    request.onsuccess = () => {
      const existingGrade = request.result;
      if (existingGrade) {
        const updatedGrade = {
          ...existingGrade,
          ...gradeData,
          S1,
          S2,
          total,
          appreciation,
          updated_at: new Date().toISOString()
        };
        const updateRequest = store.put(updatedGrade);
        updateRequest.onsuccess = () => resolve(updatedGrade);
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        const newGrade: Grade = {
          id: uuidv4(),
          ...gradeData,
          S1,
          S2,
          total,
          appreciation,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const addRequest = store.add(newGrade);
        addRequest.onsuccess = () => resolve(newGrade);
        addRequest.onerror = () => reject(addRequest.error);
      }
    };
    request.onerror = () => reject(request.error);
  });
}


// db.ts
export async function getStudentGradesForCourse(
  studentId: string, 
  courseId: string,
  classroom_id: string
): Promise<Grade | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('grades', 'readonly');
    const store = tx.objectStore('grades');
    const index = store.index('by_student_course_period');
    const request = index.get([studentId, courseId, "unique"]);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}



// db.ts
export async function getGradesByCourse(courseId: string, classroom_id: string): Promise<Grade[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('grades', 'readonly');
    const store = tx.objectStore('grades');
    
    // Correction: Utiliser un index correct
    const index = store.index('by_course_classroom');
    const request = index.getAll([courseId, classroom_id]);

    request.onsuccess = () => resolve(request.result as Grade[] || []);
    request.onerror = () => reject(request.error);
  });
}




export async function getStudentGrades(studentId: string): Promise<Grade[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('grades', 'readonly');
    const store = tx.objectStore('grades');
    const index = store.index('studentId');
    const request = index.getAll(studentId);

    request.onsuccess = () => resolve(request.result as Grade[] || []);
    request.onerror = () => reject(request.error);
  });
}


export async function getCourseAssignmentsForTeacher(teacherId: string): Promise<CourseAssignment[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('courseAssignments', 'readonly');
    const store = tx.objectStore('courseAssignments');
    const index = store.index('teacherId');
    const request = index.getAll(teacherId);
    
    request.onsuccess = () => resolve(request.result as CourseAssignment[] || []);
    request.onerror = () => reject(request.error);
  });
}





















// Ajoutez ces nouvelles interfaces dans db.ts
export interface FeeStructure {
  id: string;
  classroom_id: string;
  schoolFee: number; // Frais scolaires
  minerval: number; // Minerval
  otherFees: number; // Frais connexes
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  studentId: string;
  matricule: string;
  studentName: string;
  classroom_id: string;
  classroomName: string;
  paymentType: 'CASH' | 'BOURSE' | 'BANQUE';
  amount: number;
  feeType: 'SCOLAIRE' | 'MINERVAL' | 'FRAIS_CONNEXE' | 'AUTRE';
  description?: string;
  date: string;
  recordedBy: string; // ID de l'utilisateur qui a enregistré
  created_at: string;
}

export interface FeeStructureFormData {
  classroom_id: string;
  schoolFee: number;
  minerval: number;
  otherFees: number;
}

export interface PaymentFormData {
  matricule: string;
  paymentType: 'CASH' | 'BOURSE' | 'BANQUE';
  amount: number;
  feeType: 'SCOLAIRE' | 'MINERVAL' | 'FRAIS_CONNEXE' | 'AUTRE';
  description?: string;
}







// Fonctions pour la structure des frais
export async function setFeeStructure(feeData: FeeStructureFormData): Promise<FeeStructure> {
  const db = await initDB();
  const feeStructure: FeeStructure = {
    id: uuidv4(),
    ...feeData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('feeStructures', 'readwrite');
    const store = tx.objectStore('feeStructures');
    const index = store.index('classroom_id');
    const request = index.get(feeData.classroom_id);

    request.onsuccess = () => {
      const existing = request.result;
      if (existing) {
        // Mise à jour si existe déjà
        const updated = { ...existing, ...feeData, updated_at: new Date().toISOString() };
        const updateRequest = store.put(updated);
        updateRequest.onsuccess = () => resolve(updated);
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        // Création si n'existe pas
        const addRequest = store.add(feeStructure);
        addRequest.onsuccess = () => resolve(feeStructure);
        addRequest.onerror = () => reject(addRequest.error);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getFeeStructure(classroom_id: string): Promise<FeeStructure | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('feeStructures', 'readonly');
    const store = tx.objectStore('feeStructures');
    const index = store.index('classroom_id');
    const request = index.get(classroom_id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllFeeStructures(): Promise<FeeStructure[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('feeStructures', 'readonly');
    const store = tx.objectStore('feeStructures');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// Fonctions pour les paiements
export async function recordPayment(paymentData: PaymentFormData, userId: string): Promise<Payment> {
  const db = await initDB();
  
  // Récupérer les infos de l'élève
  const student = await new Promise<Student | null>((resolve, reject) => {
    const tx = db.transaction('students', 'readonly');
    const store = tx.objectStore('students');
    const index = store.index('matricule');
    const request = index.get(paymentData.matricule);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });

  if (!student) {
    throw new Error('Élève non trouvé');
  }

  // Récupérer la classe de l'élève
  const classroom = await getClassroomForStudent(student.id);

  const payment: Payment = {
    id: uuidv4(),
    studentId: student.id,
    matricule: student.matricule,
    studentName: `${student.nom} ${student.post_nom} ${student.prenom}`,
    classroom_id: classroom?.id || '',
    classroomName: classroom?.name || 'Non assigné',
    paymentType: paymentData.paymentType,
    amount: paymentData.amount,
    feeType: paymentData.feeType,
    description: paymentData.description,
    date: new Date().toISOString(),
    recordedBy: userId,
    created_at: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('payments', 'readwrite');
    const store = tx.objectStore('payments');
    const request = store.add(payment);

    request.onsuccess = () => resolve(payment);
    request.onerror = () => reject(request.error);
  });
}

export async function getStudentPayments(studentId: string): Promise<Payment[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('payments', 'readonly');
    const store = tx.objectStore('payments');
    const index = store.index('studentId');
    const request = index.getAll(studentId);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function getClassroomPayments(classroom_id: string): Promise<Payment[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('payments', 'readonly');
    const store = tx.objectStore('payments');
    const index = store.index('classroom_id');
    const request = index.getAll(classroom_id);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllPayments(): Promise<Payment[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('payments', 'readonly');
    const store = tx.objectStore('payments');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

// Fonction pour calculer les impayés
export async function getUnpaidStudents(classroom_id?: string): Promise<Array<{
  student: Student;
  classroom: Classroom | null;
  totalPaid: number;
  totalDue: number;
  balance: number;
}>> {
  const db = await initDB();
  
  // Récupérer tous les élèves (ou d'une classe spécifique)
  const students = classroom_id 
    ? await getStudentsInClassroom(classroom_id) 
    : await getAllStudents();

  const result = await Promise.all(students.map(async student => {
    const classroom = await getClassroomForStudent(student.id);
    const feeStructure = classroom ? await getFeeStructure(classroom.id) : null;
    const payments = await getStudentPayments(student.id);

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalDue = feeStructure 
      ? feeStructure.schoolFee + feeStructure.minerval + feeStructure.otherFees
      : 0;

    return {
      student,
      classroom,
      totalPaid,
      totalDue,
      balance: totalDue - totalPaid
    };
  }));

  return result.filter(r => r.balance > 0);
}




export async function getStudentByMatricule(matricule: string): Promise<Student | null> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STUDENTS_STORE, 'readonly');
    const store = tx.objectStore(STUDENTS_STORE);
    const index = store.index('matricule');
    const request = index.get(matricule);

    request.onsuccess = () => {
      resolve(request.result as Student | null);
    };
    
    request.onerror = () => {
      console.error("Erreur lors de la recherche par matricule:", request.error);
      reject(request.error);
    };
  });
}








export async function searchStudents(term: string): Promise<Student[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STUDENTS_STORE, 'readonly');
    const store = tx.objectStore(STUDENTS_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const allStudents = request.result as Student[];
      const results = allStudents.filter(student => 
        student.matricule.toLowerCase().includes(term.toLowerCase()) ||
        student.nom.toLowerCase().includes(term.toLowerCase()) ||
        student.post_nom.toLowerCase().includes(term.toLowerCase()) ||
        student.prenom.toLowerCase().includes(term.toLowerCase())
      );
      resolve(results);
    };
    
    request.onerror = () => {
      console.error("Erreur lors de la recherche:", request.error);
      reject(request.error);
    };
  });
}




// Ajoutez ces nouvelles interfaces dans db.ts
// Nouvelle interface
export interface Communication {
  id: string;
  type: 'ANNOUNCEMENT' | 'MESSAGE' | 'ANONYMOUS';
  title: string;
  content: string;
  senderId?: string;
  senderName?: string;
  recipientId?: string;
  recipientName?: string;
  parentMessageId?: string;
  isRead: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunicationFormData {
  type: 'ANNOUNCEMENT' | 'MESSAGE' | 'ANONYMOUS';
  title: string;
  content: string;
  recipientId?: string;
}

// Fonction modifiée pour créer une communication
export async function createCommunication(
  formData: CommunicationFormData, 
  senderId?: string,
  senderName?: string,
  parentMessageId?: string
): Promise<Communication> {
  const db = await initDB();
  
  let recipientName = '';
  if (formData.recipientId) {
    const recipient = await getUserById(formData.recipientId);
    recipientName = recipient?.name || '';
  }

  const communication: Communication = {
    id: uuidv4(),
    ...formData,
    senderId: formData.type === 'ANONYMOUS' ? undefined : senderId,
    senderName: formData.type === 'ANONYMOUS' ? undefined : senderName,
    recipientName: formData.recipientId ? recipientName : undefined,
    parentMessageId,
    isRead: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('communications', 'readwrite');
    const store = tx.objectStore('communications');
    const request = store.add(communication);
    
    request.onsuccess = () => resolve(communication);
    request.onerror = () => reject(request.error);
  });
}

// Nouvelle fonction pour obtenir les réponses
export async function getRepliesForMessage(messageId: string): Promise<Communication[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('communications', 'readonly');
    const store = tx.objectStore('communications');
    const request = store.index('parentMessageId').getAll(messageId);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}


export async function getCommunicationsForUser(
  userId: string,
  type?: 'ANNOUNCEMENT' | 'MESSAGE' | 'ANONYMOUS'
): Promise<Communication[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction('communications', 'readonly');
    const store = tx.objectStore('communications');
    
    if (type) {
      // Si un type est spécifié
      const index = store.index('by_type');
      const request = index.getAll(type);
      
      request.onsuccess = () => {
        let results = request.result || [];
        if (type === 'MESSAGE') {
          // Pour les messages, filtrer par utilisateur
          results = results.filter(comm => 
            comm.recipientId === userId || comm.senderId === userId
          );
        }
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    } else {
      // Sinon, obtenir toutes les communications pertinentes
      const receivedRequest = store.index('by_recipient').getAll(userId);
      const sentRequest = store.index('by_sender').getAll(userId);
      const announcementsRequest = store.index('by_type').getAll('ANNOUNCEMENT');
      
      Promise.all([
        new Promise<Communication[]>((res) => {
          receivedRequest.onsuccess = () => res(receivedRequest.result || []);
          receivedRequest.onerror = () => res([]);
        }),
        new Promise<Communication[]>((res) => {
          sentRequest.onsuccess = () => res(sentRequest.result || []);
          sentRequest.onerror = () => res([]);
        }),
        new Promise<Communication[]>((res) => {
          announcementsRequest.onsuccess = () => res(announcementsRequest.result || []);
          announcementsRequest.onerror = () => res([]);
        })
      ]).then(([received, sent, announcements]) => {
        // Fusionner et dédupliquer
        const allComms = [...received, ...sent, ...announcements];
        const uniqueComms = allComms.filter((comm, index, self) => 
          index === self.findIndex(c => c.id === comm.id)
        );
        resolve(uniqueComms.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      }).catch(reject);
    }
  });
}

export async function markAsRead(communicationId: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('communications', 'readwrite');
    const store = tx.objectStore('communications');
    const request = store.get(communicationId);
    
    request.onsuccess = () => {
      const comm = request.result;
      if (comm) {
        comm.isRead = true;
        comm.updated_at = new Date().toISOString();
        const updateRequest = store.put(comm);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Communication not found'));
      }
    };
    request.onerror = () => reject(request.error);
  });
}



// Ajoutez cette interface avec les autres interfaces dans db.ts
export interface BulkEmail {
  id: string;
  senderId: string;
  subject: string;
  content: string;
  recipientType: 'PARENTS' | 'TEACHERS' | 'SPECIFIC';
  specificRecipients?: string[]; // IDs des utilisateurs spécifiques
  created_at: string;
  updated_at?: string;
}

// Ajoutez ces fonctions à db.ts

export async function getParentsEmails(): Promise<string[]> {
  const parents = await getParents();
  return parents.map(parent => parent.email || '').filter(email => email);
}

export async function getTeachersEmails(): Promise<string[]> {
  const teachers = await getEnseignantsWithDetails();
  return teachers.map(teacher => teacher.email || '').filter(email => email);
}

export async function createBulkEmail(bulkEmailData: BulkEmail): Promise<BulkEmail> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('bulkEmails', 'readwrite');
    const store = tx.objectStore('bulkEmails');
    const request = store.add(bulkEmailData);
    
    request.onsuccess = () => resolve(bulkEmailData);
    request.onerror = () => reject(request.error);
  });
}

export async function getBulkEmails(): Promise<BulkEmail[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('bulkEmails', 'readonly');
    const store = tx.objectStore('bulkEmails');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}










// Ajoutez ces fonctions à db.ts

export async function getParentsByClassroom(classroom_id: string): Promise<User[]> {
  const db = await initDB();
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Get all students in the classroom
      const students = await getStudentsInClassroom(classroom_id);
      
      // 2. Get all parents of these students
      const parents = await Promise.all(
        students.map(async student => {
          if (student.tuteur_id) {
            return await getUserById(student.tuteur_id);
          }
          return null;
        })
      );

      resolve(parents.filter(parent => parent !== null) as User[]);
    } catch (error) {
      reject(error);
    }
  });
}

export async function getClassroomsWithParents(): Promise<Array<{
  classroom: Classroom;
  parentCount: number;
}>> {
  const classrooms = await getAllClassrooms();
  
  return Promise.all(
    classrooms.map(async classroom => {
      const parents = await getParentsByClassroom(classroom.id);
      return {
        classroom,
        parentCount: parents.length
      };
    })
  );
}










// Ajoutez ces interfaces dans db.ts
export interface Absence {
  id: string;
  studentId: string;
  classroom_id: string;
  date: string;
  reason?: string;
  justified: boolean;
  recordedBy: string;
  created_at: string;
}

export interface AbsenceRecord {
  id: string;
  date: string;
  classroom_id: string;
  recordedBy: string;
  absences: string[]; // IDs des étudiants absents
  created_at: string;
}





// Ajoutez ces fonctions dans db.ts
export async function recordAbsences(
  classroom_id: string,
  absentStudentIds: string[],
  date: string = new Date().toISOString().split('T')[0],
  recordedBy: string
): Promise<AbsenceRecord> {
  const db = await initDB();
  
  const record: AbsenceRecord = {
    id: uuidv4(),
    date,
    classroom_id,
    recordedBy,
    absences: absentStudentIds,
    created_at: new Date().toISOString()
  };

  // Enregistrer la session
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction('absenceRecords', 'readwrite');
    const store = tx.objectStore('absenceRecords');
    const request = store.add(record);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  // Enregistrer chaque absence individuellement
  await Promise.all(absentStudentIds.map(async studentId => {
    const absence: Absence = {
      id: uuidv4(),
      studentId,
      classroom_id,
      date,
      justified: false,
      recordedBy,
      created_at: new Date().toISOString()
    };
    
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('absences', 'readwrite');
      const store = tx.objectStore('absences');
      const request = store.add(absence);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }));

  return record;
}

export async function getAbsencesForStudent(
  studentId: string,
  startDate?: string,
  endDate?: string
): Promise<Absence[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction('absences', 'readonly');
    const store = tx.objectStore('absences');
    const index = store.index('by_student');
    const request = index.getAll(studentId);

    request.onsuccess = () => {
      let absences = request.result || [];
      
      if (startDate) {
        absences = absences.filter(a => a.date >= startDate);
      }
      
      if (endDate) {
        absences = absences.filter(a => a.date <= endDate);
      }
      
      resolve(absences);
    };
    
    request.onerror = () => reject(request.error);
  });
}

export async function getClassroomAbsences(
  classroom_id: string,
  date?: string
): Promise<Absence[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction('absences', 'readonly');
    const store = tx.objectStore('absences');
    const index = store.index('by_classroom');
    const request = date 
      ? index.getAll(IDBKeyRange.only([classroom_id, date]))
      : index.getAll(classroom_id);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function justifyAbsence(
  absenceId: string,
  reason: string
): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction('absences', 'readwrite');
    const store = tx.objectStore('absences');
    const request = store.get(absenceId);
    
    request.onsuccess = () => {
      const absence = request.result;
      if (absence) {
        absence.justified = true;
        absence.reason = reason;
        
        const updateRequest = store.put(absence);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Absence not found'));
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}




// Ajoutez ces fonctions dans db.ts
export async function getAbsenceStatistics(classroom_id?: string): Promise<{
    daily: { date: string; count: number }[];
    monthly: { month: string; count: number }[];
    byStudent: { studentId: string; name: string; count: number }[];
}> {
    const db = await initDB();
    
    // Obtenir toutes les absences
    let absences: Absence[] = await new Promise((resolve, reject) => {
        const tx = db.transaction('absences', 'readonly');
        const store = tx.objectStore('absences');
        const request = classroom_id 
            ? store.index('by_classroom').getAll(classroom_id)
            : store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });

    // Statistiques quotidiennes
    const dailyStats = absences.reduce((acc, absence) => {
        const date = absence.date.split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Statistiques mensuelles
    const monthlyStats = absences.reduce((acc, absence) => {
        const month = absence.date.slice(0, 7); // Format YYYY-MM
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Statistiques par élève
    const students = await getAllStudents();
    const studentStats = students.map(student => {
        const count = absences.filter(a => a.studentId === student.id).length;
        return {
            studentId: student.id,
            name: `${student.nom} ${student.prenom}`,
            count
        };
    }).filter(s => s.count > 0);

    return {
        daily: Object.entries(dailyStats).map(([date, count]) => ({ date, count })),
        monthly: Object.entries(monthlyStats).map(([month, count]) => ({ month, count })),
        byStudent: studentStats.sort((a, b) => b.count - a.count)
    };
}


// Types pour la synchronisation
interface SyncStudent extends StudentFormData {
  id: string;
  created_at?: string;
}

interface SyncClassroom extends ClassroomFormData {
  id: string;
  created_at?: string;
}


// Types exports
export type { 
  User, 
  UserFormData, 
  Student, 
  StudentFormData,
  TeacherInfo,
  Classroom,
  ClassroomFormData
};