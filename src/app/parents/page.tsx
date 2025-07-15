// src/app/parents/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Student, getParents, getStudentByTutorId } from '@/lib/db'
import { FaUser, FaUserGraduate, FaSearch, FaPhone, FaEnvelope, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'

export default function ParentsListPage() {
  const router = useRouter()
  const [parents, setParents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedParent, setExpandedParent] = useState<string | null>(null)
  const [children, setChildren] = useState<Record<string, Student[]>>({})

  useEffect(() => {
    const fetchParents = async () => {
      try {
        setLoading(true)
        const parentsData = await getParents()
        setParents(parentsData)
      } catch (error) {
        console.error('Error fetching parents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchParents()
  }, [])

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.phone.includes(searchTerm)
  )

  const toggleParentExpansion = async (parentId: string) => {
    if (expandedParent === parentId) {
      setExpandedParent(null)
    } else {
      setExpandedParent(parentId)
      
      // Charger les enfants si pas déjà chargés
      if (!children[parentId]) {
        try {
          const childrenData = await getStudentByTutorId(parentId)
          setChildren(prev => ({
            ...prev,
            [parentId]: childrenData
          }))
        } catch (error) {
          console.error('Error fetching children:', error)
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Liste des Parents</h1>
        <p className="text-gray-600">Gérez les parents et visualisez leurs enfants</p>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher un parent..."
          className="pl-10 pr-4 py-2 w-full max-w-md border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredParents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredParents.map((parent) => (
              <li key={parent.id} className="hover:bg-gray-50 transition-colors">
                <div 
                  className="px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleParentExpansion(parent.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{parent.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                        <span className="flex items-center">
                          <FaEnvelope className="mr-1 text-gray-400" />
                          {parent.email}
                        </span>
                        {/* {parent.email && (
                          <span className="flex items-center">
                            <FaEnvelope className="mr-1 text-gray-400" />
                            {parent.email}
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                      Parent
                    </span>
                    {expandedParent === parent.id ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedParent === parent.id && (
                  <div className="px-6 pb-4 bg-gray-50">
                    <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                      <FaUserGraduate className="mr-2 text-blue-500" />
                      Enfants ({children[parent.id]?.length || 0})
                    </h4>
                    
                    {children[parent.id]?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {children[parent.id].map((child) => (
                          <div 
                            key={child.id} 
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                            onClick={() => router.push(`/students/${child.id}`)}
                          >
                            <div className="flex justify-between">
                              <h5 className="font-medium text-gray-900">
                                {child.prenom} {child.nom} {child.post_nom}
                              </h5>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {child.matricule}
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                              <div className="flex items-center">
                                <FaLocationDot className="mr-2 text-gray-400" />
                                <span>{child.adresse}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="mr-2 text-gray-400">Niveau:</span>
                                <span>{child.niveau_etude}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="mr-2 text-gray-400">Option:</span>
                                <span>{child.option_choisie}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        {children[parent.id] 
                          ? "Aucun enfant enregistré pour ce parent" 
                          : "Chargement des enfants..."}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-400 mb-4">
              <FaUser className="inline-block text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun parent trouvé</h3>
            <p className="text-gray-500">
              {searchTerm ? "Aucun résultat pour votre recherche" : "Aucun parent enregistré"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}