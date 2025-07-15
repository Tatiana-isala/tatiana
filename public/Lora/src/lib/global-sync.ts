// lib/global-sync.ts
import { syncWithSupabase, setupRealtimeSync } from './db-supabase';

let isSyncInitialized = false;

export function initializeGlobalSync() {
  if (isSyncInitialized) return;

  // Activer la sync en temps réel par défaut
  const realtimeEnabled = true;

  if (realtimeEnabled) {
    // Configurer la sync en temps réel
    setupRealtimeSync((table) => {
      console.log(`[Global Sync] Realtime update detected for ${table}`);
      syncWithSupabase('download', [table as any])
        .then(results => {
          console.log(`[Global Sync] Synced table ${table} successfully`);
        })
        .catch(error => {
          console.error(`[Global Sync] Error syncing table ${table}:`, error);
        });
    });
  }

  // Sync initiale au chargement
  syncWithSupabase('download')
    .then(results => {
      console.log('[Global Sync] Initial sync completed', results);
    })
    .catch(error => {
      console.error('[Global Sync] Initial sync failed:', error);
    });

  // Sync périodique toutes les 5 minutes (optionnel)
  const syncInterval = setInterval(() => {
    syncWithSupabase('download')
      .then(results => {
        console.log('[Global Sync] Periodic sync completed', results);
      })
      .catch(error => {
        console.error('[Global Sync] Periodic sync failed:', error);
      });
  }, 5 * 60 * 1000); // 5 minutes

  isSyncInitialized = true;

  // Nettoyage (pour le cas où ce serait utilisé dans SPA)
  return () => {
    clearInterval(syncInterval);
  };
}