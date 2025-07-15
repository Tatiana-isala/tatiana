import { createClient } from '@supabase/supabase-js';
import { 
  initDB, 
  getAllUsers, 
  createUser, getUserById,getStudentById,
  updateUserOnlineStatus,getClassroomById,getScheduleForClassroom,getCourseById,
  getAllStudents,getFeeStructure,
  createStudent,
  getAllClassrooms,
  createClassroom,
  getAllCourses,
  createCourse,
  getCompleteSchedule,
  createScheduleItem,
  getAllFeeStructures,
  setFeeStructure,
  getAllPayments,
  recordPayment,
  getBulkEmails,
  createBulkEmail,
  getAbsenceStatistics
} from './db';



// Ajoutez ces constantes en haut du fichier
const REALTIME_CHANNEL_NAME = 'school_sync_channel';



// Configuration Supabase
const SUPABASE_URL = 'https://whyxuyvjncluurhmrvhh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoeXh1eXZqbmNsdXVyaG1ydmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzI3MDcsImV4cCI6MjA2Nzg0ODcwN30.-GopatABM3yyZAezW6KBUr3OEDTi5R5JpJsIyxn70_w';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Types pour la synchronisation
type SyncOperation = 'upload' | 'download';
type SyncTable = 'users' | 'students' | 'classrooms' | 'courses' | 'schedule' | 'fees' | 'payments' | 'communications' | 'absences';

interface SyncResult {
  table: SyncTable;
  success: boolean;
  count?: number;
  error?: string;
}



// Ajoutez cette fonction pour configurer le realtime
export function setupRealtimeSync(callback: (table: SyncTable) => void) {
  const channel = supabase
    .channel(REALTIME_CHANNEL_NAME)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public' },
      (payload) => {
        console.log('Realtime change received:', payload);
        switch (payload.table) {
          case 'users':
            callback('users');
            break;
          case 'students':
            callback('students');
            break;
          case 'courses':
            callback('courses');
            break;
          case 'schedule':
            callback('schedule');
            break;
          case 'fee_structures':
            callback('fees');
            break;
          case 'payments':
            callback('payments');
            break;
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Fonction principale de synchronisation
export async function syncWithSupabase(operation: SyncOperation,tables?: SyncTable[]): Promise<SyncResult[]> {
  const results: SyncResult[] = [];
  
  try {
    if (operation === 'download') {
      // Téléchargement des données depuis Supabase
      results.push(
        await syncUsers('download'),
        await syncStudents('download'),
        await syncCourses('download'),
        await syncSchedule('download'),
        await syncFees('download'),
        await syncPayments('download')
      );
    } else {
      // Upload des données vers Supabase
      results.push(
        await syncUsers('upload'),
        await syncStudents('upload'),
        await syncCourses('upload'),
        await syncSchedule('upload'),
        await syncFees('upload'),
        await syncPayments('upload')
      );
    }
  } catch (error) {
    console.error('Error during sync:', error);
    throw error;
  }

  return results;
}




// async function syncUsers(operation: SyncOperation): Promise<SyncResult> {
//   const result: SyncResult = { table: 'users', success: false };
  
//   try {
//     if (operation === 'download') {
//       console.log('Starting users download from Supabase...');
//       const { data, error } = await supabase
//         .from('users')
//         .select('*');
      
//       if (error) {
//         console.error('Supabase users query error:', error);
//         throw error;
//       }

//       console.log(`Received ${data?.length || 0} users from Supabase`);
      
//       if (!data || data.length === 0) {
//         result.count = 0;
//         result.success = true;
//         return result;
//       }

//       // Process each user
//       let processedCount = 0;
//       for (const user of data) {
//         try {
//           // Validate required fields
//           if (!user.id || !user.name || !user.role || !user.password || !user.phone) {
//             console.warn('Skipping invalid user:', user);
//             continue;
//           }

//           const existing = await getUserById(user.id);
//           if (!existing) {
//             await createUser({
//               email: user.email,
//               name: user.name,
//               role: user.role,
//               password: user.password,
//               phone: user.phone
//             });
//           } else {
//             await updateUserOnlineStatus(user.id, user.is_online || false);
//           }
//           processedCount++;
//         } catch (userError) {
//           console.error(`Error processing user ${user.id}:`, userError);
//         }
//       }
      
//       result.count = processedCount;
//     } else {
//       console.log('Starting users upload to Supabase...');
//       const users = await getAllUsers();
//       console.log(`Found ${users.length} local users to sync`);
      
//       if (users.length === 0) {
//         result.count = 0;
//         result.success = true;
//         return result;
//       }

//       // Prepare batch
//       const batch = users.map(user => ({
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         role: user.role,
//         password: user.password,
//         phone: user.phone,
//         is_online: user.is_online,
//         last_sign_in_at: user.last_sign_in_at,
//         created_at: user.created_at
//       }));

//       const { error } = await supabase
//         .from('users')
//         .upsert(batch);
      
//       if (error) {
//         console.error('Supabase users upsert error:', error);
//         throw error;
//       }
      
//       result.count = users.length;
//     }
    
//     result.success = true;
//   } catch (error) {
//     console.error('Full users sync error:', error);
//     result.error = error instanceof Error ? error.message : JSON.stringify(error);
//   }
  
//   return result;
// }


async function syncUsers(operation: SyncOperation): Promise<SyncResult> {
  const result: SyncResult = { table: 'users', success: false };
  
  try {
    if (operation === 'download') {
      console.log('Starting users download from Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        console.error('Supabase users query error:', error);
        throw error;
      }

      console.log(`Received ${data?.length || 0} users from Supabase`);
      
      if (!data || data.length === 0) {
        result.count = 0;
        result.success = true;
        return result;
      }

      // Process each user
      let processedCount = 0;
      for (const user of data) {
        try {
          // Validate required fields
          if (!user.id || !user.name || !user.role || !user.password || !user.phone) {
            console.warn('Skipping invalid user:', user);
            continue;
          }

          const existing = await getUserById(user.id);
          if (!existing) {
            await createUser({
              email: user.email,
              name: user.name,
              role: user.role,
              password: user.password,
              phone: user.phone
            });
            processedCount++;
          } else {
            await updateUserOnlineStatus(user.id, user.is_online || false);
          }
        } catch (userError) {
          console.error(`Error processing user ${user.id}:`, userError);
        }
      }
      
      result.count = processedCount;
    } else {
      console.log('Starting users upload to Supabase...');
      const users = await getAllUsers();
      console.log(`Found ${users.length} local users to sync`);
      
      if (users.length === 0) {
        result.count = 0;
        result.success = true;
        return result;
      }

      // Nouvelle approche avec gestion des conflits
      let successCount = 0;
      const BATCH_SIZE = 50;
      
      for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        
        try {
          const { error } = await supabase
            .from('users')
            .upsert(batch, {
              onConflict: 'phone', // Ignorer les conflits sur le phone
              ignoreDuplicates: true // Ne pas mettre à jour les existants
            });
          
          if (error) {
            console.warn('Batch partial error (duplicates ignored):', error.message);
            // Compter seulement les succès
            successCount += batch.filter(u => !error.message.includes(u.phone)).length;
          } else {
            successCount += batch.length;
          }
        } catch (batchError) {
          console.warn('Skipping failed batch:', batchError);
        }
      }
      
      result.count = successCount;
    }
    
    result.success = true;
  } catch (error) {
    console.error('Full users sync error:', error);
    result.error = error instanceof Error ? error.message : 'Unknown error';
    // Marquer quand même comme succès partiel
    result.success = result.count ? true : false;
  }
  
  return result;
}


// Modifiez la fonction syncStudents pour inclure les nouvelles colonnes
async function syncStudents(operation: SyncOperation): Promise<SyncResult> {
  const result: SyncResult = { table: 'students', success: false };
  
  try {
    if (operation === 'download') {
      console.log('Downloading students from Supabase...');
      const { data, error } = await supabase
        .from('students')
        .select('*');
      
      if (error) {
        console.error('Supabase students error:', error);
        throw error;
      }

      console.log(`Received ${data?.length || 0} students`);
      
      if (!data || data.length === 0) {
        result.count = 0;
        result.success = true;
        return result;
      }

      let processedCount = 0;
      for (const student of data) {
        try {
          // Validation des champs obligatoires y compris matricule
          if (!student.id || !student.nom || !student.prenom || !student.matricule) {
            console.warn('Skipping invalid student:', student);
            continue;
          }

          const studentData = {
            matricule: student.matricule,
            nom: student.nom,
            post_nom: student.post_nom || '',
            prenom: student.prenom,
            date_naissance: student.date_naissance || '',
            lieu_naissance: student.lieu_naissance || '',
            sexe: student.sexe || 'M',
            nationalite: student.nationalite || '',
            adresse: student.adresse || '',
            contacts: student.contacts || [],
            niveau_etude: student.niveau_etude || '',
            etablissement_precedent: student.etablissement_precedent || '',
            option_choisie: student.option_choisie || '',
            tuteur_id: student.tuteur_id || null, // Ajout de tuteur_id
            classroom_id: student.classroom_id || null, // Ajout de classroom_id
            created_at: student.created_at || new Date().toISOString()
          };

          const existing = await getStudentById(student.id);
          if (!existing) {
            await createStudent(studentData);
            processedCount++;
          }
        } catch (studentError) {
          console.error(`Error processing student ${student.id}:`, studentError);
        }
      }
      
      result.count = processedCount;
    } else {
      console.log('Uploading students to Supabase...');
      const students = await getAllStudents();
      console.log(`Found ${students.length} local students to sync`);
      
      if (students.length === 0) {
        result.count = 0;
        result.success = true;
        return result;
      }

      // Préparation du batch avec toutes les colonnes
      const batch = students.map(student => ({
        id: student.id,
        matricule: student.matricule,
        nom: student.nom,
        post_nom: student.post_nom,
        prenom: student.prenom,
        date_naissance: student.date_naissance,
        lieu_naissance: student.lieu_naissance,
        sexe: student.sexe,
        nationalite: student.nationalite,
        adresse: student.adresse,
        contacts: JSON.stringify(student.contacts || []),
        niveau_etude: student.niveau_etude,
        etablissement_precedent: student.etablissement_precedent,
        option_choisie: student.option_choisie,
        tuteur_id: student.tuteur_id || null, // Ajout de tuteur_id
        classroom_id: student.classroom_id || null, // Ajout de classroom_id
        created_at: student.created_at || new Date().toISOString(),
        updated_at: student.updated_at || new Date().toISOString()
      }));

      const { error } = await supabase
        .from('students')
        .upsert(batch);
      
      if (error) {
        console.error('Supabase students upsert error:', error);
        throw error;
      }
      
      result.count = students.length;
    }
    
    result.success = true;
  } catch (error) {
    console.error('Full students sync error:', error);
    result.error = error instanceof Error ? error.message : JSON.stringify(error);
  }
  
  return result;
}
// async function syncStudents(operation: SyncOperation): Promise<SyncResult> {
//   const result: SyncResult = { table: 'students', success: false };
  
//   try {
//     if (operation === 'download') {
//       console.log('Downloading students from Supabase...');
//       const { data, error } = await supabase
//         .from('students')
//         .select('*');
      
//       if (error) {
//         console.error('Supabase students error:', error);
//         throw error;
//       }

//       console.log(`Received ${data?.length || 0} students`);
      
//       if (!data || data.length === 0) {
//         result.count = 0;
//         result.success = true;
//         return result;
//       }

//       let processedCount = 0;
//       for (const student of data) {
//         try {
//           // Validation des champs obligatoires y compris matricule
//           if (!student.id || !student.nom || !student.prenom || !student.matricule) {
//             console.warn('Skipping invalid student:', student);
//             continue;
//           }

//           const studentData = {
//             matricule: student.matricule, // Ajout du matricule
//             nom: student.nom,
//             post_nom: student.post_nom || '',
//             prenom: student.prenom,
//             date_naissance: student.date_naissance || '',
//             lieu_naissance: student.lieu_naissance || '',
//             sexe: student.sexe || 'M',
//             nationalite: student.nationalite || '',
//             adresse: student.adresse || '',
//             contacts: student.contacts || [],
//             niveau_etude: student.niveau_etude || '',
//             etablissement_precedent: student.etablissement_precedent || '',
//             option_choisie: student.option_choisie || '',
//             created_at: student.created_at || new Date().toISOString()
//           };

//           const existing = await getStudentById(student.id);
//           if (!existing) {
//             await createStudent(studentData);
//             processedCount++;
//           }
//         } catch (studentError) {
//           console.error(`Error processing student ${student.id}:`, studentError);
//         }
//       }
      
//       result.count = processedCount;
//     } else {
//       console.log('Uploading students to Supabase...');
//       const students = await getAllStudents();
//       console.log(`Found ${students.length} local students to sync`);
      
//       if (students.length === 0) {
//         result.count = 0;
//         result.success = true;
//         return result;
//       }

//       // Préparation du batch avec matricule
//       const batch = students.map(student => ({
//         id: student.id,
//         matricule: student.matricule, // Inclure le matricule
//         nom: student.nom,
//         post_nom: student.post_nom,
//         prenom: student.prenom,
//         date_naissance: student.date_naissance,
//         lieu_naissance: student.lieu_naissance,
//         sexe: student.sexe,
//         nationalite: student.nationalite,
//         adresse: student.adresse,
//         contacts: JSON.stringify(student.contacts || []),
//         niveau_etude: student.niveau_etude,
//         etablissement_precedent: student.etablissement_precedent,
//         option_choisie: student.option_choisie,
//         created_at: student.created_at || new Date().toISOString(),
//         updated_at: student.updated_at || new Date().toISOString()
//       }));

//       const { error } = await supabase
//         .from('students')
//         .upsert(batch);
      
//       if (error) {
//         console.error('Supabase students upsert error:', error);
//         throw error;
//       }
      
//       result.count = students.length;
//     }
    
//     result.success = true;
//   } catch (error) {
//     console.error('Full students sync error:', error);
//     result.error = error instanceof Error ? error.message : JSON.stringify(error);
//   }
  
//   return result;
// }




// Synchronisation des cours
async function syncCourses(operation: SyncOperation): Promise<SyncResult> {
  const result: SyncResult = { table: 'courses', success: false };
  
  try {
    if (operation === 'download') {
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) throw error;
      
      for (const course of data) {
        const existing = await getCourseById(course.id);
        if (!existing) {
          await createCourse(course);
        }
      }
      
      result.count = data.length;
    } else {
      const courses = await getAllCourses();
      
      const { error } = await supabase
        .from('courses')
        .upsert(courses);
      
      if (error) throw error;
      
      result.count = courses.length;
    }
    
    result.success = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return result;
}

// Synchronisation des horaires
async function syncSchedule(operation: SyncOperation): Promise<SyncResult> {
  const result: SyncResult = { table: 'schedule', success: false };
  
  try {
    if (operation === 'download') {
      const { data, error } = await supabase
        .from('schedule')
        .select('*');
      
      if (error) throw error;
      
      for (const item of data) {
        const existing = await getScheduleForClassroom(item.classroomId);
        if (!existing.some(e => e.id === item.id)) {
          await createScheduleItem(item);
        }
      }
      
      result.count = data.length;
    } else {
      const schedule = await getCompleteSchedule();
      
      const { error } = await supabase
        .from('schedule')
        .upsert(schedule);
      
      if (error) throw error;
      
      result.count = schedule.length;
    }
    
    result.success = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return result;
}

// Synchronisation des frais
async function syncFees(operation: SyncOperation): Promise<SyncResult> {
  const result: SyncResult = { table: 'fees', success: false };
  
  try {
    if (operation === 'download') {
      const { data, error } = await supabase
        .from('fee_structures')
        .select('*');
      
      if (error) throw error;
      
      for (const fee of data) {
        const existing = await getFeeStructure(fee.classroomId);
        if (!existing) {
          await setFeeStructure(fee);
        }
      }
      
      result.count = data.length;
    } else {
      const fees = await getAllFeeStructures();
      
      const { error } = await supabase
        .from('fee_structures')
        .upsert(fees);
      
      if (error) throw error;
      
      result.count = fees.length;
    }
    
    result.success = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return result;
}

// Synchronisation des paiements
async function syncPayments(operation: SyncOperation): Promise<SyncResult> {
  const result: SyncResult = { table: 'payments', success: false };
  
  try {
    if (operation === 'download') {
      const { data, error } = await supabase
        .from('payments')
        .select('*');
      
      if (error) throw error;
      
      // Note: Vous devrez implémenter une fonction pour créer des paiements en batch
      // ou adapter recordPayment pour accepter des données existantes
      
      result.count = data.length;
    } else {
      const payments = await getAllPayments();
      
      const { error } = await supabase
        .from('payments')
        .upsert(payments);
      
      if (error) throw error;
      
      result.count = payments.length;
    }
    
    result.success = true;
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return result;
}