import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Eye, Filter, Search, Calendar, Tag, TrendingUp, Building2, AlertTriangle } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  brand: string;
  modality: string;
  type: string;
  price: number;
  duration: number;
  campus: string;
  period: string;
  isHypothetical?: boolean;
  hypotheticalTag?: string;
  createdAt: string;
}

const ProgramsCatalog: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2025-1');
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showHypothetical, setShowHypothetical] = useState(true);
  const [showNewProgramModal, setShowNewProgramModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [newProgram, setNewProgram] = useState({
    name: '',
    brand: 'Lottus',
    modality: 'Presencial',
    type: 'Semestral',
    price: 12500,
    duration: 8,
    campus: 'Ciudad de México',
    hypotheticalTag: 'NUEVO-2026'
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
      period: '2025-01',
      createdAt: '2024-01-15'
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
      period: '2025-01',
      createdAt: '2024-01-15'
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
      period: '2025-01',
      createdAt: '2024-01-15'
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
      period: '2025-01',
      createdAt: '2024-01-15'
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
      period: '2025-01',
      createdAt: '2024-01-15'
    },
    {
      id: 'hyp-1',
      name: 'Inteligencia Artificial',
      brand: 'Lottus',
      modality: 'Online',
      type: 'Semestral',
      price: 18000,
      duration: 8,
      campus: 'Ciudad de México',
      period: '2025-01',
      isHypothetical: true,
      hypotheticalTag: 'NUEVO-2026',
      createdAt: '2025-01-15'
    },
    {
      id: 'hyp-2',
      name: 'Desarrollo Sustentable',
      brand: 'UVM',
      modality: 'Presencial',
      type: 'Semestral',
      price: 15000,
      duration: 8,
      campus: 'Ciudad de México',
      period: '2025-01',
      isHypothetical: true,
      createdAt: '2025-01-15'
    }
  ];

  // Filtrar programas
  const filteredPrograms = mockPrograms.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'all' || program.brand === brandFilter;
    const matchesModality = modalityFilter === 'all' || program.modality === modalityFilter;
    const matchesType = typeFilter === 'all' || program.type === typeFilter;
    const matchesHypothetical = showHypothetical || !program.isHypothetical;
    
    return matchesSearch && matchesBrand && matchesModality && matchesType && matchesHypothetical;
  });
  // Filtrar programas por período y otros filtros
  const filteredProgramsByPeriod = mockPrograms.filter(program => {
    return program.period === selectedPeriod &&
           (brandFilter === 'all' || program.brand === brandFilter) &&
           (modalityFilter === 'all' || program.modality === modalityFilter) &&
           (typeFilter === 'all' || program.type === typeFilter) &&
           (showHypothetical || !program.isHypothetical);
  });

  // Calcular métricas
  const totalPrograms = filteredPrograms.length;
  const realPrograms = filteredPrograms.filter(p => !p.isHypothetical).length;
  const hypotheticalPrograms = filteredPrograms.filter(p => p.isHypothetical).length;
  const averagePrice = filteredPrograms.reduce((sum, p) => sum + p.price, 0) / totalPrograms || 0;
  const brandCount = new Set(filteredPrograms.map(p => p.brand)).size;

  const handleCreateProgram = () => {
    console.log('Crear programa:', newProgram);
    setShowNewProgramModal(false);
    // Reset form
    setNewProgram({
      name: '',
      brand: 'Lottus',
      modality: 'Presencial',
      type: 'Semestral',
      price: 12500,
      duration: 8,
      campus: 'Ciudad de México',
      hypotheticalTag: 'NUEVO-2026'
    });
  };

  const getBrandColor = (brand: string) => {
    const colors = {
      'Lottus': 'bg-teal-100 text-teal-800',
      'UVM': 'bg-blue-100 text-blue-800',
      'UNITEC': 'bg-purple-100 text-purple-800',
      'ULA': 'bg-green-100 text-green-800',
      'UANE': 'bg-orange-100 text-orange-800'
    };
    return colors[brand as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getModalityColor = (modality: string) => {
    const colors = {
      'Presencial': 'bg-blue-100 text-blue-800',
      'Online': 'bg-green-100 text-green-800',
      'Sabatina': 'bg-purple-100 text-purple-800'
    };
    return colors[modality as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Semestral': 'bg-indigo-100 text-indigo-800',
      'Cuatrimestral': 'bg-pink-100 text-pink-800',
      'Trimestral': 'bg-yellow-100 text-yellow-800',
      'Anual': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catálogo de Programas</h1>
            <p className="text-gray-600 mt-2">Gestión de programas académicos por período</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => alert('Función de reporte de errores - En desarrollo')}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reportar Error
            </button>
            <button 
              onClick={() => setShowNewProgramModal(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Programa Hipotético
            </button>
          </div>
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
              <option value="2025-1">2025-1</option>
              <option value="2024-2">2024-2</option>
              <option value="2024-1">2024-1</option>
              <option value="2023-2">2023-2</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-full">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Período seleccionado:</span> {selectedPeriod}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Mostrando programas activos para este período
              </p>
            </div>
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
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{totalPrograms}</h3>
            <p className="text-gray-600 text-sm mt-1">Total Programas</p>
            <p className="text-xs text-blue-600 mt-1">{selectedPeriod}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-green-900">{realPrograms}</h3>
            <p className="text-gray-600 text-sm mt-1">Programas Reales</p>
            <p className="text-xs text-green-600 mt-1">Activos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-purple-900">{hypotheticalPrograms}</h3>
            <p className="text-gray-600 text-sm mt-1">Programas Hipotéticos</p>
            <p className="text-xs text-purple-600 mt-1">Para proyecciones</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-indigo-50">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-indigo-900">${averagePrice.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm mt-1">Precio Promedio</p>
            <p className="text-xs text-orange-600 mt-1">Por programa</p>
          </div>
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

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar programa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las Marcas</option>
            <option value="Lottus">Lottus</option>
            <option value="UVM">UVM</option>
            <option value="UNITEC">UNITEC</option>
            <option value="ULA">ULA</option>
            <option value="UANE">UANE</option>
          </select>

          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las Modalidades</option>
            <option value="Presencial">Presencial</option>
            <option value="Online">Online</option>
            <option value="Sabatina">Sabatina</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los Tipos</option>
            <option value="Semestral">Semestral</option>
            <option value="Cuatrimestral">Cuatrimestral</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Anual">Anual</option>
          </select>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showHypothetical}
              onChange={(e) => setShowHypothetical(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Mostrar Hipotéticos</span>
          </label>

          <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </button>
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
                  Duración
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
                        {program.isHypothetical && program.hypotheticalTag && (
                          <div className="flex items-center mt-1">
                            <Tag className="w-3 h-3 text-purple-500 mr-1" />
                            <span className="text-xs text-purple-600 font-medium">{program.hypotheticalTag}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getBrandColor(program.brand)}`}>
                      {program.brand}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getModalityColor(program.modality)}`}>
                      {program.modality}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(program.type)}`}>
                      {program.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${program.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {program.duration} {program.type === 'Semestral' ? 'semestres' : 
                     program.type === 'Cuatrimestral' ? 'cuatrimestres' : 
                     program.type === 'Trimestral' ? 'trimestres' : 'años'}
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
                      <button 
                        onClick={() => setSelectedProgram(program)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
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
      {showNewProgramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Programa Hipotético</h3>
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
                  <select
                    value={newProgram.campus}
                    onChange={(e) => setNewProgram(prev => ({ ...prev, campus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ciudad de México">Ciudad de México</option>
                    <option value="Guadalajara">Guadalajara</option>
                    <option value="Monterrey">Monterrey</option>
                    <option value="Puebla">Puebla</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tag Hipotético</label>
                  <input
                    type="text"
                    value={newProgram.hypotheticalTag}
                    onChange={(e) => setNewProgram(prev => ({ ...prev, hypotheticalTag: e.target.value }))}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-purple-50"
                    placeholder="NUEVO-2026"
                    required
                  />
                  <p className="text-xs text-purple-600 mt-1">
                    <strong>Requerido:</strong> Este tag identificará el programa en las proyecciones
                  </p>
                </div>
              </div>

              {/* Información sobre programas hipotéticos */}
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start">
                  <Tag className="w-5 h-5 text-purple-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-purple-900 mb-1">Programa Hipotético</h4>
                    <p className="text-xs text-purple-700">
                      Este programa será marcado como hipotético y podrá ser utilizado en proyecciones futuras. 
                      Los programas reales son gestionados por el administrador del sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewProgramModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateProgram}
                disabled={!newProgram.name || !newProgram.hypotheticalTag}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear Programa Hipotético
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de detalle del programa */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detalle del Programa</h3>
                <button 
                  onClick={() => setSelectedProgram(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <p className="text-sm text-gray-900">{selectedProgram.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getBrandColor(selectedProgram.brand)}`}>
                    {selectedProgram.brand}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getModalityColor(selectedProgram.modality)}`}>
                    {selectedProgram.modality}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedProgram.type)}`}>
                    {selectedProgram.type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <p className="text-sm font-medium text-green-600">${selectedProgram.price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                  <p className="text-sm text-gray-900">{selectedProgram.duration} períodos</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                  <p className="text-sm text-gray-900">{selectedProgram.campus}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  {selectedProgram.isHypothetical ? (
                    <div>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        Hipotético
                      </span>
                      {selectedProgram.hypotheticalTag && (
                        <div className="flex items-center mt-2">
                          <Tag className="w-3 h-3 text-purple-500 mr-1" />
                          <span className="text-xs text-purple-600 font-medium">{selectedProgram.hypotheticalTag}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsCatalog;