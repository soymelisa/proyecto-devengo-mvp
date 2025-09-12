import React, { useState } from 'react';
import { Building2, Users, DollarSign, TrendingUp, Plus, Edit, MapPin, Tag, Eye, Search, Filter, AlertTriangle, ChevronDown, X } from 'lucide-react';
import { mockCampuses } from '../data/mockData';

interface Campus {
  id: string;
  name: string;
  city: string;
  brand: string;
  programs: Program[];
  isHypothetical?: boolean;
  hypotheticalTag?: string;
  createdAt: string;
}

interface Program {
  id: string;
  name: string;
  price: number;
  modalities: string[];
  duration: number;
}

const Campuses: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [showHypothetical, setShowHypothetical] = useState(true);
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  
  const [newCampus, setNewCampus] = useState({
    name: '',
    city: '',
    brand: 'Lottus',
    address: '',
    isHypothetical: false,
    hypotheticalTag: ''
  });

  // Mock data extendido con marcas y campus hipotéticos
  const mockCampusesExtended: Campus[] = [
    {
      id: '1',
      name: 'Ciudad de México',
      city: 'CDMX',
      brand: 'Lottus',
      programs: [
        { id: '1', name: 'Ingeniería en Sistemas', price: 12500, modalities: ['Presencial', 'Online'], duration: 8 },
        { id: '2', name: 'Administración de Empresas', price: 9500, modalities: ['Presencial', 'Online', 'Sabatina'], duration: 8 }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Guadalajara',
      city: 'GDL',
      brand: 'UVM',
      programs: [
        { id: '3', name: 'Administración de Empresas', price: 9000, modalities: ['Online', 'Sabatina'], duration: 8 },
        { id: '4', name: 'Derecho', price: 11000, modalities: ['Presencial', 'Sabatina'], duration: 10 }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Monterrey',
      city: 'MTY',
      brand: 'UNITEC',
      programs: [
        { id: '5', name: 'Medicina', price: 25000, modalities: ['Presencial'], duration: 12 },
        { id: '6', name: 'Psicología', price: 8000, modalities: ['Online', 'Sabatina'], duration: 8 }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '4',
      name: 'Puebla',
      city: 'PUE',
      brand: 'ULA',
      programs: [
        { id: '7', name: 'Ingeniería Industrial', price: 11000, modalities: ['Presencial', 'Online'], duration: 8 }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '5',
      name: 'Tijuana',
      city: 'TIJ',
      brand: 'UANE',
      programs: [
        { id: '8', name: 'Negocios Internacionales', price: 13000, modalities: ['Presencial', 'Online'], duration: 8 }
      ],
      createdAt: '2024-01-15'
    },
    // Campus hipotéticos
    {
      id: 'hyp-1',
      name: 'Cancún',
      city: 'CUN',
      brand: 'Lottus',
      programs: [
        { id: 'hyp-p1', name: 'Turismo Sustentable', price: 10000, modalities: ['Presencial', 'Online'], duration: 8 }
      ],
      isHypothetical: true,
      hypotheticalTag: 'EXPANSION-2026',
      createdAt: '2025-01-15'
    },
    {
      id: 'hyp-2',
      name: 'Mérida',
      city: 'MID',
      brand: 'UVM',
      programs: [
        { id: 'hyp-p2', name: 'Medicina Alternativa', price: 15000, modalities: ['Presencial'], duration: 10 }
      ],
      isHypothetical: true,
      hypotheticalTag: 'PILOTO-2026',
      createdAt: '2025-01-15'
    }
  ];

  // Filtrar campus
  const filteredCampuses = mockCampusesExtended.filter(campus => {
    const matchesSearch = campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campus.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'all' || campus.brand === brandFilter;
    const matchesCampusSelection = selectedCampuses.length === 0 || selectedCampuses.includes(campus.name);
    const matchesHypothetical = showHypothetical || !campus.isHypothetical;
    
    return matchesSearch && matchesBrand && matchesCampusSelection && matchesHypothetical;
  });

  // Calcular métricas
  const totalCampuses = filteredCampuses.length;
  const realCampuses = filteredCampuses.filter(c => !c.isHypothetical).length;
  const hypotheticalCampuses = filteredCampuses.filter(c => c.isHypothetical).length;
  const totalPrograms = filteredCampuses.reduce((sum, campus) => sum + campus.programs.length, 0);
  const brandCount = new Set(filteredCampuses.map(c => c.brand)).size;

  const campusMetrics = [
    { campus: 'Ciudad de México', students: 1247, revenue: 7850000, programs: 8, growth: 12.3, brand: 'Lottus' },
    { campus: 'Guadalajara', students: 892, revenue: 5420000, programs: 6, growth: 8.7, brand: 'UVM' },
    { campus: 'Monterrey', students: 708, revenue: 4930000, programs: 7, growth: 15.2, brand: 'UNITEC' },
    { campus: 'Puebla', students: 456, revenue: 3200000, programs: 4, growth: 18.5, brand: 'ULA' },
    { campus: 'Tijuana', students: 324, revenue: 2100000, programs: 3, growth: 22.1, brand: 'UANE' }
  ];

  const handleCreateCampus = () => {
    console.log('Crear campus:', newCampus);
    setShowAddForm(false);
    // Reset form
    setNewCampus({
      name: '',
      city: '',
      brand: 'Lottus',
      address: '',
      isHypothetical: false,
      hypotheticalTag: ''
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

  const handleCampusToggle = (campusName: string) => {
    setSelectedCampuses(prev => {
      if (prev.includes(campusName)) {
        return prev.filter(name => name !== campusName);
      } else {
        return [...prev, campusName];
      }
    });
  };

  const handleSelectAllCampuses = () => {
    if (selectedCampuses.length === mockCampusesExtended.length) {
      setSelectedCampuses([]);
    } else {
      setSelectedCampuses(mockCampusesExtended.map(campus => campus.name));
    }
  };

  const clearCampusSelection = () => {
    setSelectedCampuses([]);
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Planteles</h1>
            <p className="text-gray-600 mt-2">Administración de campus, programas y modalidades</p>
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
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Campus
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-50">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{totalCampuses}</h3>
            <p className="text-gray-600 text-sm mt-1">Total Planteles</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-green-900">{realCampuses}</h3>
            <p className="text-gray-600 text-sm mt-1">Planteles Reales</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-purple-50">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-purple-900">{hypotheticalCampuses}</h3>
            <p className="text-gray-600 text-sm mt-1">Planteles Hipotéticos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-orange-50">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-orange-900">{totalPrograms}</h3>
            <p className="text-gray-600 text-sm mt-1">Total Programas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-indigo-50">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-indigo-900">{brandCount}</h3>
            <p className="text-gray-600 text-sm mt-1">Marcas Activas</p>
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
              placeholder="Buscar plantel..."
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

          {/* Multiselect de planteles */}
          <div className="relative">
            <button
              onClick={() => setShowCampusDropdown(!showCampusDropdown)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
            >
              <span className="text-sm">
                {selectedCampuses.length === 0 
                  ? 'Todos los Planteles' 
                  : selectedCampuses.length === 1 
                    ? selectedCampuses[0]
                    : `${selectedCampuses.length} planteles seleccionados`
                }
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showCampusDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showCampusDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {/* Opciones de selección rápida */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleSelectAllCampuses}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {selectedCampuses.length === mockCampusesExtended.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    </button>
                    {selectedCampuses.length > 0 && (
                      <button
                        onClick={clearCampusSelection}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Lista de planteles */}
                <div className="py-2">
                  {mockCampusesExtended.map((campus) => (
                    <label
                      key={campus.id}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCampuses.includes(campus.name)}
                        onChange={() => handleCampusToggle(campus.name)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-900">{campus.name}</span>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-2">{campus.city}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getBrandColor(campus.brand)}`}>
                              {campus.brand}
                            </span>
                            {campus.isHypothetical && (
                              <Tag className="w-3 h-3 text-purple-500 ml-2" />
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
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
        
        {/* Chips de planteles seleccionados */}
        {selectedCampuses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Planteles seleccionados:</span>
              {selectedCampuses.map((campusName) => {
                const campus = mockCampusesExtended.find(c => c.name === campusName);
                return (
                  <div
                    key={campusName}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{campusName}</span>
                    {campus && (
                      <span className="ml-1 text-xs">({campus.brand})</span>
                    )}
                    <button
                      onClick={() => handleCampusToggle(campusName)}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Métricas por campus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {campusMetrics.map((campus, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBrandColor(campus.brand)}`}>
                {campus.brand}
              </span>
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
              onClick={() => setSelectedCampus(mockCampusesExtended.find(c => c.name === campus.campus) || null)}
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
              <h2 className="text-lg font-semibold text-gray-900">Planteles ({filteredCampuses.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredCampuses.map((campus) => (
                <div 
                  key={campus.id}
                  onClick={() => setSelectedCampus(campus)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedCampus?.id === campus.id ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{campus.name}</h3>
                        {campus.isHypothetical && (
                          <Tag className="w-3 h-3 text-purple-500 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {campus.city}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${getBrandColor(campus.brand)}`}>
                        {campus.brand}
                      </span>
                      {campus.isHypothetical && campus.hypotheticalTag && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-purple-600 font-medium">{campus.hypotheticalTag}</span>
                        </div>
                      )}
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
          {selectedCampus ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedCampus.name}</h2>
                  <div className="flex items-center mt-1">
                    <p className="text-gray-600 mr-3">{selectedCampus.city}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBrandColor(selectedCampus.brand)}`}>
                      {selectedCampus.brand}
                    </span>
                  </div>
                </div>
                <button className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedCampus.isHypothetical && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-medium text-purple-900">Plantel Hipotético</span>
                    {selectedCampus.hypotheticalTag && (
                      <span className="ml-2 text-sm text-purple-700">({selectedCampus.hypotheticalTag})</span>
                    )}
                  </div>
                </div>
              )}
              
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
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un Plantel</h3>
              <p className="text-gray-600">
                Elige un plantel de la lista para ver sus detalles y programas disponibles
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar campus */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Crear Nuevo Plantel</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Plantel</label>
                  <input
                    type="text"
                    value={newCampus.name}
                    onChange={(e) => setNewCampus(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Cancún"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={newCampus.city}
                    onChange={(e) => setNewCampus(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: CUN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                  <select
                    value={newCampus.brand}
                    onChange={(e) => setNewCampus(prev => ({ ...prev, brand: e.target.value }))}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  <textarea
                    value={newCampus.address}
                    onChange={(e) => setNewCampus(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Dirección completa del plantel"
                  ></textarea>
                </div>
              </div>

              {/* Opción hipotética */}
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <label className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={newCampus.isHypothetical}
                    onChange={(e) => setNewCampus(prev => ({ ...prev, isHypothetical: e.target.checked }))}
                    className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-purple-900">Plantel Hipotético</span>
                </label>
                {newCampus.isHypothetical && (
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">Tag Identificador</label>
                    <input
                      type="text"
                      value={newCampus.hypotheticalTag}
                      onChange={(e) => setNewCampus(prev => ({ ...prev, hypotheticalTag: e.target.value }))}
                      className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: EXPANSION-2026, PILOTO-2026"
                    />
                    <p className="text-xs text-purple-600 mt-1">
                      Este tag ayudará a identificar el plantel en las proyecciones
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateCampus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Plantel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campuses;
{"code":"rate-limited","message":"You have hit the rate limit. Please upgrade to keep chatting.","providerLimitHit":false,"isRetryable":true}

