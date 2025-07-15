
import Link from 'next/link';
import { FaMoneyBillWave, FaFileInvoiceDollar, FaExclamationTriangle } from 'react-icons/fa';
import { HiCash } from 'react-icons/hi';

export default function AccountingHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Tableau de bord Comptabilité
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gestion complète des transactions financières de l'établissement
          </p>
        </div>

        {/* Cartes de fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Carte Enregistrement Paiement */}
          <Link href="/comptabilite/payment">
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl cursor-pointer h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <HiCash className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Enregistrement</h2>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">
                  Enregistrez les paiements des élèves avec détails complets (espèces, banque, bourse)
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Nouvelle transaction
                  </span>
                  <span className="text-blue-600 group-hover:text-blue-800 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Carte Gestion des Frais */}
          <Link href="/comptabilite/frais">
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl cursor-pointer h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FaFileInvoiceDollar className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Gestion des Frais</h2>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">
                  Configurez les frais scolaires, minervals et autres coûts par classe et section
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Configuration
                  </span>
                  <span className="text-green-600 group-hover:text-green-800 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Carte Impayés */}
          <Link href="/comptabilite/impayes">
            <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl cursor-pointer h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                    <FaExclamationTriangle className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Gestion des Impayés</h2>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">
                  Consultez et suivez les impayés par élève, classe ou période académique
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Rapports
                  </span>
                  <span className="text-orange-600 group-hover:text-orange-800 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Statistiques rapides (optionnel) */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaMoneyBillWave className="mr-2 text-blue-500" />
            Aperçu Financier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm font-medium text-gray-500">Total Recettes</p>
              <p className="text-2xl font-bold text-gray-800">1,245,000 CDF</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm font-medium text-gray-500">Paiements Complets</p>
              <p className="text-2xl font-bold text-gray-800">87%</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-sm font-medium text-gray-500">Impayés</p>
              <p className="text-2xl font-bold text-gray-800">23 Élèves</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}