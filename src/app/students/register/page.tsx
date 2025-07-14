

'use client'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createStudent, addStudentToClassroom, getAllClassrooms } from '@/lib/db';
import { StudentFormData, Classroom } from '@/lib/db';
import { FaUser, FaCamera, FaSave, FaArrowLeft } from 'react-icons/fa';

export default function StudentRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentFormData>({
    nom: '',
    postNom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    sexe: 'M',
    nationalite: '',
    adresse: '',
    contacts: [''],
    niveauEtude: '',
    etablissementPrecedent: '',
    optionChoisie: ''
  });
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newStudentId, setNewStudentId] = useState<string | null>(null);

  useEffect(() => {
    // Charger les classes disponibles
    const loadClassrooms = async () => {
      try {
        const classes = await getAllClassrooms();
        setClassrooms(classes);
        if (classes.length > 0) {
          setSelectedClassroom(classes[0].id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des classes:", error);
      }
    };
    loadClassrooms();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...formData.contacts];
    newContacts[index] = value;
    setFormData(prev => ({ ...prev, contacts: newContacts }));
  };

  const addContactField = () => {
    setFormData(prev => ({ ...prev, contacts: [...prev.contacts, ''] }));
  };

  const removeContactField = (index: number) => {
    if (formData.contacts.length > 1) {
      const newContacts = formData.contacts.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, contacts: newContacts }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Créer l'étudiant
      const createdStudent = await createStudent(formData);
      setNewStudentId(createdStudent.id);

      // Assigner l'étudiant à la classe sélectionnée
      if (selectedClassroom) {
        await addStudentToClassroom(selectedClassroom, createdStudent.id);
      }

      setSuccess(true);
      
      // Redirection après 3 secondes
      setTimeout(() => {
        router.push(`/students/${createdStudent.id}`);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Une erreur est survenue lors de l'enregistrement");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success && newStudentId) {
    return (
      <div className="min-h-screen  flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg w-full max-w-md text-center">
          <div className="text-green-500 text-5xl mb-4">
            ✓
          </div>
          <h2 className="text-2xl font-bold mb-2">Enregistrement réussi!</h2>
          <p className="mb-6">L'étudiant a été enregistré avec succès dans la base de données locale.</p>
          <p className="text-sm text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen   px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg  overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()} 
              className="flex items-center text-white hover:text-blue-200"
            >
              <FaArrowLeft className="mr-2" /> Retour
            </button>
            <h1 className="text-2xl font-bold">Enregistrement d'un nouvel étudiant</h1>
            <div className="w-8"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo et info de base */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FaUser className="text-5xl text-gray-400" />
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                >
                  <FaCamera />
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Photo d'identité</p>
                <p className="text-xs text-gray-400">(Optionnel)</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post-nom *</label>
                <input
                  type="text"
                  name="postNom"
                  value={formData.postNom}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance *</label>
                <input
                  type="text"
                  name="lieuNaissance"
                  value={formData.lieuNaissance}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classe *</label>
                <select
                  value={selectedClassroom}
                  onChange={(e) => setSelectedClassroom(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informations supplémentaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité *</label>
                <input
                  type="text"
                  name="nationalite"
                  value={formData.nationalite}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacts *</label>
                {formData.contacts.map((contact, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="tel"
                      value={contact}
                      onChange={(e) => handleContactChange(index, e.target.value)}
                      required
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Numéro de téléphone"
                    />
                    {index === formData.contacts.length - 1 ? (
                      <button
                        type="button"
                        onClick={addContactField}
                        className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                      >
                        +
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeContactField(index)}
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'étude *</label>
                <input
                  type="text"
                  name="niveauEtude"
                  value={formData.niveauEtude}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Établissement précédent</label>
                <input
                  type="text"
                  name="etablissementPrecedent"
                  value={formData.etablissementPrecedent}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Option choisie *</label>
                <input
                  type="text"
                  name="optionChoisie"
                  value={formData.optionChoisie}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dossier scolaire (PDF)</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-500">
                      <p className="text-sm text-gray-600">Cliquez pour sélectionner un fichier</p>
                      <p className="text-xs text-gray-500">ou glissez-déposez ici</p>
                      <input type="file" className="hidden" accept=".pdf" />
                    </div>
                  </label>
                  <button type="button" className="bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300">
                    Voir les fichiers
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? (
                'Enregistrement...'
              ) : (
                <>
                  <FaSave className="mr-2" /> Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}