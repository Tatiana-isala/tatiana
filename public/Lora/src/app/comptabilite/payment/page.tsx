
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getStudentByMatricule, 
  recordPayment, 
  getClassroomForStudent,
  getFeeStructure,
  getStudentPayments,
  searchStudents
} from '@/lib/db';
import { Classroom, Student, FeeStructure, Payment } from '@/lib/db';
import { FiMessageCircle, FiCheckCircle } from 'react-icons/fi';
import { sendPaymentConfirmationEmail } from '@/lib/mailer';
import { getUserById } from '@/lib/db'; // Importez depuis votre fichier db
import { useAuth } from '@/context/AuthContext'; // Pour obtenir l'utilisateur courant

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuth(); // Ajoutez ceci au début de votre composant
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [feeStructure, setFeeStructure] = useState<FeeStructure | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paymentType: 'CASH' as const,
    amount: 0,
    feeType: 'SCOLAIRE' as const,
    description: ''
  });
  const [success, setSuccess] = useState(false);

  // Recherche dynamique
  const handleSearch = useCallback(async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await searchStudents(term);
      setSearchResults(results);
    } catch (error) {
      console.error("Erreur de recherche:", error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  // Chargement des données de l'étudiant sélectionné
  const loadStudentData = async (student: Student) => {
    setLoading(true);
    try {
      setSelectedStudent(student);
      setSearchTerm('');
      setSearchResults([]);
      
      const studentClassroom = await getClassroomForStudent(student.id);
      setClassroom(studentClassroom);

      if (studentClassroom) {
        const fees = await getFeeStructure(studentClassroom.id);
        setFeeStructure(fees);
      }

      const studentPayments = await getStudentPayments(student.id);
      setPayments(studentPayments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Calcul des totaux
  const totalScolaire = payments
    .filter(p => p.feeType === 'SCOLAIRE')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalMinerval = payments
    .filter(p => p.feeType === 'MINERVAL')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalConnexe = payments
    .filter(p => p.feeType === 'FRAIS_CONNEXE')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaye = payments.reduce((sum, p) => sum + p.amount, 0);

  const resteAPayer = feeStructure 
    ? (feeStructure.schoolFee + feeStructure.minerval + feeStructure.otherFees) - totalPaye
    : 0;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedStudent) return;
    
//     try {
//       await recordPayment({
//         matricule: selectedStudent.matricule,
//         ...paymentData
//       }, 'current-user-id');
      
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
      
//       const updatedPayments = await getStudentPayments(selectedStudent.id);
//       setPayments(updatedPayments);
      
//       setPaymentData({
//         paymentType: 'CASH',
//         amount: 0,
//         feeType: 'SCOLAIRE',
//         description: ''
//       });
//     } catch (error) {
//       console.error(error);
//       alert('Erreur lors de l\'enregistrement du paiement');
//     }
//   };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedStudent || !user) return;
  
  try {
    setLoading(true);
    
    // 1. Enregistrement du paiement
    const paymentRecord = await recordPayment({
      matricule: selectedStudent.matricule,
      ...paymentData
    }, user.id);

    // 2. Récupération des données en parallèle
    const [parent, currentFeeStructure, currentPayments] = await Promise.all([
      selectedStudent.tuteur_id ? getUserById(selectedStudent.tuteur_id) : Promise.resolve(null),
      classroom?.id ? getFeeStructure(classroom.id) : Promise.resolve(null),
      getStudentPayments(selectedStudent.id)
    ]);

    // 3. Calcul du solde
    const newTotalPaid = currentPayments.reduce((sum, p) => sum + p.amount, 0) + paymentData.amount;
    const totalDue = currentFeeStructure 
      ? currentFeeStructure.schoolFee + currentFeeStructure.minerval + currentFeeStructure.otherFees
      : 0;
    const newBalance = Math.max(0, totalDue - newTotalPaid);

    // 4. Envoi de l'email si parent existe avec email
    if (parent?.email) {
      try {
        await sendPaymentConfirmationEmail(
          parent.email,
          `${selectedStudent.nom} ${selectedStudent.prenom}`,
          {
            amount: paymentData.amount,
            feeType: paymentData.feeType,
            paymentType: paymentData.paymentType,
            date: paymentRecord.created_at, // Utilise la date du paiement
            description: paymentData.description,
            balance: newBalance
          }
        );
      } catch (emailError) {
        console.error("Erreur d'envoi d'email:", emailError);
        // Ne pas bloquer le processus pour une erreur d'email
      }
    }

    // 5. Mise à jour de l'état
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    
    // Actualiser les données affichées
    const updatedPayments = await getStudentPayments(selectedStudent.id);
    setPayments(updatedPayments);
    setFeeStructure(currentFeeStructure);
    
    // Réinitialiser le formulaire
    setPaymentData({
      paymentType: 'CASH',
      amount: 0,
      feeType: 'SCOLAIRE',
      description: ''
    });

  } catch (error) {
    console.error('Erreur:', error);
    alert(`Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Enregistrement de paiement</h1>
          <p className="mt-2 text-lg text-gray-600">Gestion des paiements scolaires</p>
        </div>

        {/* Recherche d'élève */}
        <div className="mb-8 relative">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher un élève
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMessageCircle className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Entrez un nom ou matricule"
            />
          </div>
          
          {/* Résultats de recherche */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-auto">
              <ul className="divide-y divide-gray-200">
                {searchResults.map((student) => (
                  <li key={student.id}>
                    <button
                      type="button"
                      onClick={() => loadStudentData(student)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{student.nom} {student.post_nom} {student.prenom}</p>
                        <p className="text-sm text-gray-500">{student.matricule}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {student.matricule}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedStudent && (
          <div className="space-y-6">
            {/* Carte élève */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Informations de l'élève</h2>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {selectedStudent.nom.charAt(0)}{selectedStudent.prenom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedStudent.nom} {selectedStudent.post_nom} {selectedStudent.prenom}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Matricule: {selectedStudent.matricule} • 
                      {classroom && ` Classe: ${classroom.name}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grille des informations financières */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Carte Frais scolaires */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-800">Structure des frais</h2>
                </div>
                <div className="px-6 py-4 space-y-4">
                  {feeStructure ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frais scolaires:</span>
                        <span className="font-medium">{feeStructure.schoolFee.toLocaleString()} CDF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minerval:</span>
                        <span className="font-medium">{feeStructure.minerval.toLocaleString()} CDF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frais connexes:</span>
                        <span className="font-medium">{feeStructure.otherFees.toLocaleString()} CDF</span>
                      </div>
                      <div className="border-t pt-3 mt-3 flex justify-between">
                        <span className="text-gray-800 font-medium">Total à payer:</span>
                        <span className="text-blue-600 font-bold">
                          {(feeStructure.schoolFee + feeStructure.minerval + feeStructure.otherFees).toLocaleString()} CDF
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">Aucune structure de frais définie</p>
                  )}
                </div>
              </div>

              {/* Carte Solde */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-800">Situation financière</h2>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total payé:</span>
                    <span className="font-medium">{totalPaye.toLocaleString()} CDF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reste à payer:</span>
                    <span className={`font-bold ${resteAPayer > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {resteAPayer.toLocaleString()} CDF
                    </span>
                  </div>
                  <div className="pt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ 
                          width: `${Math.min(100, (totalPaye / (feeStructure ? (feeStructure.schoolFee + feeStructure.minerval + feeStructure.otherFees) : 1)) * 100)}%` 
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {Math.round((totalPaye / (feeStructure ? (feeStructure.schoolFee + feeStructure.minerval + feeStructure.otherFees) : 1)) * 100)}% payé
                    </p>
                  </div>
                </div>
              </div>

              {/* Carte Détail paiements */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-800">Derniers paiements</h2>
                </div>
                <div className="px-6 py-4">
                  {payments.length > 0 ? (
                    <ul className="space-y-3 max-h-60 overflow-y-auto">
                      {payments.slice(0, 5).map(payment => (
                        <li key={payment.id} className="border-b border-gray-100 pb-2 last:border-0">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium capitalize">{payment.feeType.toLowerCase()}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(payment.date).toLocaleDateString()} • {payment.paymentType}
                              </p>
                            </div>
                            <span className="font-medium text-blue-600">
                              {payment.amount.toLocaleString()} CDF
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Aucun paiement enregistré</p>
                  )}
                </div>
              </div>
            </div>

            {/* Formulaire de paiement */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-800">Nouveau paiement</h2>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-1">
                      Type de paiement
                    </label>
                    <select
                      id="paymentType"
                      value={paymentData.paymentType}
                      onChange={(e) => setPaymentData({...paymentData, paymentType: e.target.value as any})}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    >
                      <option value="CASH">Espèces</option>
                      <option value="BOURSE">Bourse</option>
                      <option value="BANQUE">Banque</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="feeType" className="block text-sm font-medium text-gray-700 mb-1">
                      Type de frais
                    </label>
                    <select
                      id="feeType"
                      value={paymentData.feeType}
                      onChange={(e) => setPaymentData({...paymentData, feeType: e.target.value as any})}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                    >
                      <option value="SCOLAIRE">Frais scolaires</option>
                      <option value="MINERVAL">Minerval</option>
                      <option value="FRAIS_CONNEXE">Frais connexes</option>
                      <option value="AUTRE">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Montant (CDF)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({...paymentData, amount: Number(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optionnel)
                    </label>
                    <textarea
                      id="description"
                      value={paymentData.description}
                      onChange={(e) => setPaymentData({...paymentData, description: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {success ? (
                      <>
                        <FiCheckCircle className="-ml-1 mr-2 h-5 w-5" />
                        Enregistré!
                      </>
                    ) : (
                      'Enregistrer le paiement'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}