// import React, { useState } from 'react';
// import { syncWithSupabase } from '@/lib/db-supabase';
// import { FiUpload, FiDownload } from 'react-icons/fi'; // Using react-icons for icons

// const SyncManager: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [results, setResults] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const handleSync = async (operation: 'upload' | 'download') => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const syncResults = await syncWithSupabase(operation);
//       setResults(syncResults);
      
//       // Check for errors
//       const hasErrors = syncResults.some(result => !result.success);
//       if (hasErrors) {
//         setError('Some operations failed. See details below.');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6 my-5">
//       <h2 className="text-xl font-bold mb-4">Sync Manager</h2>
//       <p className="mb-4 text-gray-600">
//         Synchronize data between your local database and Supabase.
//       </p>
      
//       <div className="flex gap-4 mb-6">
//         <button
//           className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//           onClick={() => handleSync('upload')}
//           disabled={loading}
//         >
//           <FiUpload />
//           Upload to Supabase
//         </button>
        
//         <button
//           className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded disabled:opacity-50"
//           onClick={() => handleSync('download')}
//           disabled={loading}
//         >
//           <FiDownload />
//           Download from Supabase
//         </button>
//       </div>
      
//       {loading && (
//         <div className="flex items-center gap-2 mb-4">
//           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
//           <span>Syncing data...</span>
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//           <p className="font-bold">Sync Error</p>
//           <p>{error}</p>
//         </div>
//       )}
      
//       {results.length > 0 && (
//         <div className="border rounded-lg p-4">
//           <h3 className="font-bold mb-3">Sync Results</h3>
//           <ul className="space-y-2">
//             {results.map((item, index) => (
//               <li key={index} className="border-b pb-2 last:border-b-0">
//                 <p className="font-medium">{item.table}</p>
//                 <p className={item.success ? "text-green-600" : "text-red-600"}>
//                   {item.success 
//                     ? `${item.count} items synced successfully`
//                     : `Error: ${item.error}`}
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SyncManager;

import React, { useState, useEffect } from 'react';
import { syncWithSupabase, setupRealtimeSync } from '@/lib/db-supabase';
import { FiUpload, FiDownload, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';

const SyncManager: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [realtimeEnabled, setRealtimeEnabled] = useState<boolean>(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [activeTables, setActiveTables] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!realtimeEnabled) return;

    const cleanup = setupRealtimeSync((table) => {
      console.log(`Realtime update detected for ${table}`);
      setActiveTables(prev => {
        const newSet = new Set(prev);
        newSet.add(table);
        return newSet;
      });
      
      handleTableSync(table);
    });

    return () => {
      cleanup();
    };
  }, [realtimeEnabled]);

  const handleSync = async (operation: 'upload' | 'download') => {
    setLoading(true);
    setError(null);
    
    try {
      const syncResults = await syncWithSupabase(operation);
      setResults(syncResults);
      setLastSync(new Date());
      
      const hasErrors = syncResults.some(result => !result.success);
      if (hasErrors) {
        setError('Some operations failed. See details below.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTableSync = async (table: string) => {
    try {
      setLoading(true);
      const result = await syncWithSupabase('download', [table as any]);
      
      setResults(prev => [...prev, ...result]);
      setLastSync(new Date());
      setActiveTables(prev => {
        const newSet = new Set(prev);
        newSet.delete(table);
        return newSet;
      });
    } catch (err) {
      console.error(`Error syncing table ${table}:`, err);
      setError(`Failed to sync ${table}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 my-5">
      <h2 className="text-xl font-bold mb-4">Sync Manager</h2>
      <p className="mb-4 text-gray-600">
        Synchronize data between your local database and Supabase.
      </p>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() => handleSync('upload')}
            disabled={loading}
          >
            <FiUpload />
            Upload 
          </button>
          
          <button
            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded disabled:opacity-50"
            onClick={() => handleSync('download')}
            disabled={loading}
          >
            <FiDownload />
            Download 
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            className={`${
              realtimeEnabled ? 'bg-green-500' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            onClick={() => setRealtimeEnabled(!realtimeEnabled)}
          >
            <span className="sr-only">Enable realtime sync</span>
            <span
              className={`${
                realtimeEnabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
          <span className="text-sm font-medium">
            Realtime Sync {realtimeEnabled ? 'Enabled' : 'Disabled'}
          </span>
          
          {lastSync && (
            <span className="text-sm text-gray-500">
              Last sync: {lastSync.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      {loading && (
        <div className="flex items-center gap-2 mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          <span>Syncing data...</span>
        </div>
      )}
      
      {activeTables.size > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="font-medium text-blue-800">Realtime updates detected for:</p>
          <ul className="flex gap-2 mt-1 flex-wrap">
            {Array.from(activeTables).map(table => (
              <li 
                key={table} 
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
              >
                <FiRefreshCw className="animate-spin" size={14} />
                {table}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Sync Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Sync Results</h3>
            <button 
              onClick={() => setResults([])} 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-2">
            {results.map((item, index) => (
              <li key={index} className="border-b pb-2 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.table}</p>
                    <p className={item.success ? "text-green-600" : "text-red-600"}>
                      {item.success 
                        ? `${item.count} items synced successfully`
                        : `Error: ${item.error}`}
                    </p>
                  </div>
                  {item.success ? (
                    <FiCheck className="text-green-500" />
                  ) : (
                    <FiX className="text-red-500" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SyncManager;