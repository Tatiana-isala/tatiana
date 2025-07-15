
'use client'
import { useState, useEffect } from 'react';
import { getAllClassrooms, FeeStructure, setFeeStructure, getAllFeeStructures, Classroom } from '@/lib/db';
import { FaSchool, FaMoneyBillWave, FaFileInvoiceDollar, FaSave, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GiMoneyStack, GiPayMoney } from 'react-icons/gi';

export default function FeesManagementPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [feeData, setFeeData] = useState({
    schoolFee: 0,
    minerval: 0,
    otherFees: 0
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existingFees, setExistingFees] = useState<FeeStructure[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const cls = await getAllClassrooms();
        setClassrooms(cls);
        const fees = await getAllFeeStructures();
        setExistingFees(fees);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClassrooms.length === 0) return;
    
    setLoading(true);
    try {
      await Promise.all(selectedClassrooms.map(classroom_id => 
        setFeeStructure({
          classroom_id,
          ...feeData
        })
      ));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      const fees = await getAllFeeStructures();
      setExistingFees(fees);
      setSelectedClassrooms([]);
      setFeeData({ schoolFee: 0, minerval: 0, otherFees: 0 });
      setCurrentPage(1); // Reset to first page after update
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter classrooms based on search term
  const filteredClassrooms = classrooms.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cls.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter existing fees based on search term
  const filteredExistingFees = existingFees.filter(fee => {
    const classroom = classrooms.find(c => c.id === fee.classroom_id);
    return classroom?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           classroom?.section.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFees = filteredExistingFees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExistingFees.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center">
            <FaMoneyBillWave className="mr-3 text-blue-600" />
            Gestion des Frais Scolaires
          </h1>
          <p className="mt-2 text-lg text-gray-600">Configuration des frais par classe</p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de configuration */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FaFileInvoiceDollar className="mr-2" />
                Définir les Frais
              </h2>
            </div>
            <div className="p-6">
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher des classes
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Rechercher par nom ou section"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner les classes
                  </label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <select
                      multiple
                      value={selectedClassrooms}
                      onChange={(e) => setSelectedClassrooms(
                        Array.from(e.target.selectedOptions, option => option.value)
                      )}
                      className="block w-full h-64 px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled={loading}
                    >
                      {filteredClassrooms.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - {cls.section}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs classes
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <FaSchool className="mr-2 text-blue-500" />
                        Frais scolaires (CDF)
                      </span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">CDF</span>
                      </div>
                      <input
                        type="number"
                        value={feeData.schoolFee}
                        onChange={(e) => setFeeData({...feeData, schoolFee: Number(e.target.value)})}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md border py-2"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <GiMoneyStack className="mr-2 text-blue-500" />
                        Minerval (CDF)
                      </span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">CDF</span>
                      </div>
                      <input
                        type="number"
                        value={feeData.minerval}
                        onChange={(e) => setFeeData({...feeData, minerval: Number(e.target.value)})}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md border py-2"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <GiPayMoney className="mr-2 text-blue-500" />
                        Frais connexes (CDF)
                      </span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">CDF</span>
                      </div>
                      <input
                        type="number"
                        value={feeData.otherFees}
                        onChange={(e) => setFeeData({...feeData, otherFees: Number(e.target.value)})}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md border py-2"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || selectedClassrooms.length === 0}
                    className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedClassrooms.length === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <FaSave className="-ml-1 mr-2 h-5 w-5" />
                        Enregistrer pour {selectedClassrooms.length} classe(s) sélectionnée(s)
                      </>
                    )}
                  </button>
                </div>

                {success && (
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Frais enregistrés avec succès pour {selectedClassrooms.length} classe(s)!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Liste des frais existants avec pagination */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FaFileInvoiceDollar className="mr-2" />
                Frais Configurés
              </h2>
            </div>
            <div className="p-6">
              {filteredExistingFees.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune structure de frais définie</h3>
                  <p className="mt-1 text-sm text-gray-500">Commencez par définir des frais pour les classes</p>
                </div>
              ) : (
                <>
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Classe
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Scolaire
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Minerval
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Connexes
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentFees.map(fee => {
                          const classroom = classrooms.find(c => c.id === fee.classroom_id);
                          const total = fee.schoolFee + fee.minerval + fee.otherFees;
                          return (
                            <tr key={fee.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {classroom?.name || 'Classe inconnue'}
                                <p className="text-xs text-gray-500">{classroom?.section}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                {fee.schoolFee.toLocaleString()} CDF
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                {fee.minerval.toLocaleString()} CDF
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                {fee.otherFees.toLocaleString()} CDF
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 text-right">
                                {total.toLocaleString()} CDF
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                      Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredExistingFees.length)}
                      </span>{' '}
                      sur <span className="font-medium">{filteredExistingFees.length}</span> résultats
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        <FaChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                      >
                        <FaChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}














 