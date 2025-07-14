// app/components/MultiLoading.tsx

import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const MultiLoading = () => {
  const [loadingA, setLoadingA] = useState(true);
  const [loadingB, setLoadingB] = useState(true);
  const [loadingC, setLoadingC] = useState(true);

  useEffect(() => {
    // Simule différents temps de chargement
    setTimeout(() => setLoadingA(false), 2000);
    setTimeout(() => setLoadingB(false), 4000);
    setTimeout(() => setLoadingC(false), 6000);
  }, []);

  const renderLoading = (label: string, loading: boolean) => (
    <div className="flex items-center gap-3 p-4 border rounded-xl shadow mb-3">
      {loading ? (
        <FaSpinner className="animate-spin text-blue-500 text-xl" />
      ) : (
        <div className="w-4 h-4 bg-green-500 rounded-full" />
      )}
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-5 text-center">État de chargement</h2>
      {renderLoading("Chargement des utilisateurs", loadingA)}
      {renderLoading("Connexion au serveur", loadingB)}
      {renderLoading("Chargement des données", loadingC)}
    </div>
  );
};

export default MultiLoading;
