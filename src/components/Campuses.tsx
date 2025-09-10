import React, { useState } from 'react';
import { Building2, Users, DollarSign, TrendingUp, Plus, Edit, MapPin } from 'lucide-react';
import { mockCampuses } from '../data/mockData';

const Campuses: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState(mockCampuses[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  const campusMetrics = [
    { campus: 'Ciudad de México', students: 1247, revenue: 7850000, programs: 8, growth: 12.3 },
    { campus: 'Guadalajara', students: 892, revenue: 5420000, programs: 6, growth: 8.7 },
    { campus: 'Monterrey', students: 708, revenue: 4930000, programs: 7, growth: 15.2 }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Planteles</h1>
            <p className="text-gray-600 mt-2">Administración de campus, programas y modalidades</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Campus
          </button>
        </div>
      </div>

      {/* Métricas por campus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {campusMetrics.map((campus, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <span className="text-sm text-green-600 font-medium">+{campus.growth}%</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{campus.campus}</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estudiantes</span>
                <span className="font-medium">{campus.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ingresos</span>
                <span className="font-medium">${(campus.revenue / 1000000).toFixed(1)}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Programas</span>
                <span className="font-medium">{campus.programs}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedCampus(mockCampuses.find(c => c.name === campus.campus) || mockCampuses[0])}
              className="w-full mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Ver Detalle
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de campus */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Campus Activos</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mockCampuses.map((campus) => (
                <div 
                  key={campus.id}
                  onClick={() => setSelectedCampus(campus)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedCampus.id === campus.id ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{campus.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {campus.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{campus.programs.length}</p>
                      <p className="text-xs text-gray-600">programas</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detalle del campus seleccionado */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedCampus.name}</h2>
                  <p className="text-gray-600">{selectedCampus.city}</p>
                </div>
                <button className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Programas Disponibles</h3>
              
              <div className="space-y-4">
                {selectedCampus.programs.map((program) => (
                  <div key={program.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{program.name}</h4>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Precio</p>
                            <p className="font-medium text-green-600">${program.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Duración</p>
                            <p className="font-medium">{program.duration} semestres</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Modalidades</p>
                          <div className="flex flex-wrap gap-2">
                            {program.modalities.map((modality, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {modality}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nuevo Programa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar campus */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Agregar Nuevo Campus</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Campus</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Puebla"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: PUE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Dirección completa del campus"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Crear Campus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campuses;