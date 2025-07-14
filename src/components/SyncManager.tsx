import React, { useState } from 'react';
import { syncWithSupabase } from '@/lib/db-supabase';
import { FiUpload, FiDownload } from 'react-icons/fi'; // Using react-icons for icons

const SyncManager: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async (operation: 'upload' | 'download') => {
    setLoading(true);
    setError(null);
    
    try {
      const syncResults = await syncWithSupabase(operation);
      setResults(syncResults);
      
      // Check for errors
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

  return (
    <div className="bg-white rounded-lg shadow p-6 my-5">
      <h2 className="text-xl font-bold mb-4">Sync Manager</h2>
      <p className="mb-4 text-gray-600">
        Synchronize data between your local database and Supabase.
      </p>
      
      <div className="flex gap-4 mb-6">
        <button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => handleSync('upload')}
          disabled={loading}
        >
          <FiUpload />
          Upload to Supabase
        </button>
        
        <button
          className="flex items-center gap-2 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded disabled:opacity-50"
          onClick={() => handleSync('download')}
          disabled={loading}
        >
          <FiDownload />
          Download from Supabase
        </button>
      </div>
      
      {loading && (
        <div className="flex items-center gap-2 mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          <span>Syncing data...</span>
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
          <h3 className="font-bold mb-3">Sync Results</h3>
          <ul className="space-y-2">
            {results.map((item, index) => (
              <li key={index} className="border-b pb-2 last:border-b-0">
                <p className="font-medium">{item.table}</p>
                <p className={item.success ? "text-green-600" : "text-red-600"}>
                  {item.success 
                    ? `${item.count} items synced successfully`
                    : `Error: ${item.error}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SyncManager;