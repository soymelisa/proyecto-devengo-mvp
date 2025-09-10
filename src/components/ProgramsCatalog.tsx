import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Eye, Calendar, Filter, Tag, TrendingUp, Building2 } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  brand: string;
  modality: string;
  type: string;
  price: number;
  duration: number;
  campus: string;
  isHypothetical?: boolean;
  period?: string;
  createdAt?: string;
}

const ProgramsCatalog: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedModality, setSelectedModality] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  
  const [newProgram, setNewProgram] = useState({
    name: '',
    brand: '',
    modality: '',
    type: '',
    price: 0,
    duration: 0,
    campus: '',
    isHypothetical: false
  });

  // Mock data de programas
  const mockPrograms: Program[] = [
    {
      id: '1',
      name: 'Ingeniería en Sistemas',
      brand: 'Lottus',
      modality: 'Presencial',
      type: 'Semestral',
      price: 12500,
      duration: 8,
      campus: 'Ciudad de México',
      period: '2025-01'
    },
    {
      id: '2',
      name: 'Administración de Empresas',
      brand: 'Lottus',
      modality: 'Online',
      type: 'Cuatrimestral',
      price: 9500,
      duration: 12,
      campus: 'Guadalajara',
      period: '2025-01'
    },
    {
      id: '3',
      name: 'Derecho',
      brand: 'UVM',
      modality: 'Sabatina',
      type: 'Semestral',
      price: 11000,
      duration: 10,
      campus: 'Monterrey',
      period: '2025-01'
    },
    {
      id: '4',
      name: 'Medicina',
      brand: 'UVM',
      modality: 'Presencial',
      type: 'Semestral',
      price: 25000,
      duration: 12,
      campus: 'Ciudad de México',
      period: '2025-01'
    },
    {
      id: '5',
      name: 'Psicología',
      brand: 'UNITEC',
      modality: 'Online',
      type: 'Trimestral',
      price: 8000,
      duration: 12,
      campus: 'Guadalajara',
      period: '2025-01'
    },
    {
      id: 'hyp-1',
      name: 'Inteligencia Artificial',
      brand: 'Lottus',
      modality: 'Online',
      type: 'Semestral',
      price: 15000,
      duration: 8,
      campus: 'Ciudad de México',
      period: '2025-01',
      isHypothetical: true,
      createdAt: '2025-01-15'
    }
  ];

  // Filtrar programas por período y otros filtros
  const filteredPrograms = mockPrograms.filter(program => {
    return program.period === selectedPeriod &&
           (selectedBrand === 'all' || program.brand === selectedBrand) &&
           (selectedModality === 'all' || program.modality === selectedModality) &&
           (selectedType === 'all' || program.type === selectedType);
  });

  // Calcular métricas
  const totalPrograms = filteredPrograms.length;
  const hypotheticalPrograms = filteredPrograms.filter(p => p.isHypothetical).length;
  const realPrograms = totalPrograms - hypotheticalPrograms;
  const averagePrice = filteredPrograms.reduce((sum, p) => sum + p.price, 0) / totalPrograms || 0;

  // Agrupar por marca
  const programsByBrand = filteredPrograms.reduce((acc, program) => {
    if (!acc[program.brand]) acc[program.brand] = 0;
    acc[program.brand]++;
    return acc;
  }, {} as Record<string, number>);

  // Agrupar por modalidad
  const programsByModality = filteredPrograms.reduce((acc, program) => {
    if (!acc[program.modality]) acc[program.modality] = 0;
    acc[program.modality]++;
    return acc;
  }, {} as Record<string, number>);

  const handleCreateProgram = () => {
    console.log('Crear programa:', { ...newProgram, period: selectedPeriod });
    setShowAddForm(false);
    setNewProgram({
      name: '',
      brand: '',
      modality: '',
      type: '',
      price: 0,
      duration: 0,
      campus: '',
      isHypothetical: false
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catálogo de Programas</h1>
            <p className="text-gray-600 mt-2">Gestión de programas académicos por período</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Programa
          </button>
        </div>
      </div>

      {/* Selector de período */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Seleccionar Período</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="2024-12">Diciembre 2024</option>
              <option value="2025-01">Enero 2025</option>
              <option value="2025-02">Febrero 2025</option>
              <option value="2025-03">Marzo 2025</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las Marcas</option>
              <option value="Lottus">Lottus</option>
              <option value="UVM">UVM</option>
              <option value="UNITEC">UNITEC</option>
              <option value="ULA">ULA</option>
              <option value="UANE">UANE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las Modalidades</option>
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
              <option value="Sabatina">Sabatina</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los Tipos</option>
              <option value="Semestral">Semestral</option>
              <option value="Cuatrimestral">Cuatrimestral</option>
              <option value="Trimestral">Trimestral</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de programas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalPrograms}</h3>
          <p className="text-gray-600 text-sm mt-1">Total Programas</p>
          <p className="text-xs text-blue-600 mt-1">{selectedPeriod}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{realPrograms}</h3>
          <p className="text-gray-600 text-sm mt-1">Programas Reales</p>
          <p className="text-xs text-green-600 mt-1">Activos</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{hypotheticalPrograms}</h3>
          <p className="text-gray-600 text-sm mt-1">Programas Hipotéticos</p>
          <p className="text-xs text-purple-600 mt-1">Para proyecciones</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${averagePrice.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm mt-1">Precio Promedio</p>
          <p className="text-xs text-orange-600 mt-1">Por programa</p>
        </div>
      </div>

      {/* Distribución por marca y modalidad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Marca</h3>
          <div className="space-y-3">
            {Object.entries(programsByBrand).map(([brand, count]) => (
              <div key={brand} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{brand}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / totalPrograms) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Modalidad</h3>
          <div className="space-y-3">
            {Object.entries(programsByModality).map(([modality, count]) => (
              <div key={modality} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{modality}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(count / totalPrograms) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listado de programas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Programas del Período: {selectedPeriod}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Programa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modalidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrograms.map((program) => (
                <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{program.name}</div>
                        <div className="text-sm text-gray-500">{program.duration} períodos</div>
                      </div>
                      {program.isHypothetical && (
                        <Tag className="w-4 h-4 text-purple-500 ml-2" title="Programa Hipotético" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {program.brand}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {program.modality}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {program.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${program.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {program.campus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      program.isHypothetical 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {program.isHypothetical ? 'Hipotético' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para agregar programa */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Agregar Nuevo Programa</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Programa</label>
                  <input
                    type="text"
                    value={newProgram.name}
                    onChange={(e) => setNewProgram(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Ingeniería en Datos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                  <select
                    value={newProgram.brand}
                    onChange={(e) => setNewProgram(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar marca</option>
                    <option value="Lottus">Lottus</option>
                    <option value="UVM">UVM</option>
                    <option value="UNITEC">UNITEC</option>
                    <option value="ULA">ULA</option>
                    <option value="UANE">UANE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
                  <select
                    value={newProgram.modality}
                    onChange={(e) => setNewProgram(prev => ({ ...prev, modality: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar modalidad</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Online">Online</option>
                    <option value="Sabatina">Sabatina</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={newProgram.type}
                    onChange={(e) => setNewProgram(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Cuatrimestral">Cuatrimestral</option>
                    <option value="Trimestral">Trimestral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                  <input
                    type="number"
                    value={newProgram.price}
                    onChange={(e) => setNewProgram(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="12500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duración (períodos)</label>
                  <input
                    type="number"
                    value={newProgram.duration}
                    onChange={(e) => setNewProgram(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                  <input
                    type="text"
                    value={newProgram.campus}
                    onChange={(e) => setNewProgram(prev => ({ ...prev, campus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ciudad de México"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newProgram.isHypothetical}
                      onChange={(e) => setNewProgram(prev => ({ ...prev, isHypothetical: e.target.checked }))}
                      className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Programa Hipotético</span>
                  </label>
                </div>
              </div>
              
              {newProgram.isHypothetical && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-purple-900">Programa Hipotético</h4>
                      <p className="text-sm text-purple-700">
                        Este programa será marcado como hipotético y podrá ser incluido en proyecciones futuras.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateProgram}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Programa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsCatalog;