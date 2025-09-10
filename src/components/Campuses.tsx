import React, { useState } from 'react';
import { Building2, Users, DollarSign, TrendingUp, Plus, Edit, MapPin, Tag, Calendar, Filter, Eye } from 'lucide-react';
import { mockCampuses } from '../data/mockData';

interface Campus {
  id: string;
  name: string;
  city: string;
  brand: string;
  programs: Program[];
  isHypothetical?: boolean;
  period?: string;
  createdAt?: string;
}

interface Program {
  id: string;
  name: string;
  price: number;
  modalities: string[];
  duration: number;
}

const Campuses: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  
  const [newCampus, setNewCampus] = useState({
    name: '',
    city: '',
    brand: '',
    address: '',
    isHypothetical: false
  });

  // Mock data extendido de campus
  const mockCampusesExtended: Campus[] = [
    {
      id: '1',
      name: 'Ciudad de México',
      city: 'CDMX',
      brand: 'Lottus',
      period: '2025-01',
      programs: [
        { id: '1', name: 'Ingeniería en Sistemas', price: 12500, modalities: ['Presencial', 'Online'], duration: 8 },
        { id: '2', name: 'Administración de Empresas', price: 9500, modalities: ['Presencial', 'Online', 'Sabatina'], duration: 8 }
      ]
    },
    {
      id: '2',
      name: 'Guadalajara',
      city: 'GDL',
      brand: 'Lottus',
      period: '2025-01',
      programs: [
        { id: '3', name: 'Administración de Empresas', price: 9000, modalities: ['Online', 'Sabatina'], duration: 8 },
        { id: '4', name: 'Derecho', price: 11000, modalities: ['Presencial', 'Sabatina'], duration: 10 }
      ]
    },
    {
      id: '3',
      name: 'Monterrey',
      city: 'MTY',
      brand: 'UVM',
      period: '2025-01',
      programs: [
        { id: '5', name: 'Medicina', price: 25000, modalities: ['Presencial'], duration: 12 },
        { id: '6', name: 'Psicología', price: 8000, modalities: ['Online', 'Presencial'], duration: 8 }
      ]
    },
    {
      id: '4',
      name: 'Puebla',
      city: 'PUE',
      brand: 'UNITEC',
      period: '2025-01',
      programs: [
        { id: '7', name: 'Ingeniería Industrial', price: 10500, modalities: ['Presencial', 'Sabatina'], duration: 8 }
      ]
    },
    {
      id: 'hyp-1',
      name: 'Tijuana Norte',
      city: 'TIJ',
      brand: 'Lottus',
      period: '2025-01',
      isHypothetical: true,
      createdAt: '2025-01-15',
      programs: [
        { id: 'hyp-p1', name: 'Negocios Internacionales', price: 11500, modalities: ['Presencial', 'Online'], duration: 8 }
      ]
    }
  ];

  // Filtrar campus por período y marca
  const filteredCampuses = mockCampusesExtended.filter(campus => {
    return campus.period === selectedPeriod &&
           (selectedBrand === 'all' || campus.brand === selectedBrand);
  });

  // Calcular métricas
  const totalCampuses = filteredCampuses.length;
  const hypotheticalCampuses = filteredCampuses.filter(c => c.isHypothetical).length;
  const realCampuses = totalCampuses - hypotheticalCampuses;
  const totalPrograms = filteredCampuses.reduce((sum, campus) => sum + campus.programs.length, 0);
  const averageProgramsPerCampus = totalPrograms / totalCampuses || 0;

  // Agrupar por marca
  const campusesByBrand = filteredCampuses.reduce((acc, campus) => {
    if (!acc[campus.brand]) acc[campus.brand] = 0;
    acc[campus.brand]++;
    return acc;
  }, {} as Record<string, number>);

  const handleCreateCampus = () => {
    console.log('Crear campus:', { ...newCampus, period: selectedPeriod });
    setShowAddForm(false);
    setNewCampus({
      name: '',
      city: '',
      brand: '',
      address: '',
      isHypothetical: false
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Planteles</h1>
            <p className="text-gray-600 mt-2">Administración de planteles por período y marca</p>
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

      {/* Selector de período y filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Seleccionar Período</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div></div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de planteles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalCampuses}</h3>
          <p className="text-gray-600 text-sm mt-1">Total Planteles</p>
          <p className="text-xs text-blue-600 mt-1">{selectedPeriod}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{realCampuses}</h3>
          <p className="text-gray-600 text-sm mt-1">Planteles Reales</p>
          <p className="text-xs text-green-600 mt-1">Activos</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{hypotheticalCampuses}</h3>
          <p className="text-gray-600 text-sm mt-1">Planteles Hipotéticos</p>
          <p className="text-xs text-purple-600 mt-1">Para proyecciones</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{averageProgramsPerCampus.toFixed(1)}</h3>
          <p className="text-gray-600 text-sm mt-1">Programas Promedio</p>
          <p className="text-xs text-orange-600 mt-1">Por plantel</p>
        </div>
      </div>

      {/* Distribución por marca */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Marca</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(campusesByBrand).map(([brand, count]) => (
            <div key={brand} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{brand}</h4>
                <p className="text-sm text-gray-600">{count} planteles</p>
              </div>
              <div className="text-right">
                <div className="w-16 bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(count / totalCampuses) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {Math.round((count / totalCampuses) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listado de planteles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Planteles del Período: {selectedPeriod}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plantel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Programas
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
              {filteredCampuses.map((campus) => (
                <tr key={campus.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campus.name}</div>
                        <div className="text-sm text-gray-500">{campus.programs.length} programas</div>
                      </div>
                      {campus.isHypothetical && (
                        <Tag className="w-4 h-4 text-purple-500 ml-2" title="Plantel Hipotético" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {campus.brand}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campus.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campus.programs.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      campus.isHypothetical 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {campus.isHypothetical ? 'Hipotético' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedCampus(campus)}
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

      {/* Modal de detalle del campus */}
      {selectedCampus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCampus.name}</h3>
                  <p className="text-gray-600">{selectedCampus.city} - {selectedCampus.brand}</p>
                </div>
                <button 
                  onClick={() => setSelectedCampus(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Programas Disponibles</h4>
              <div className="space-y-4">
                {selectedCampus.programs.map((program) => (
                  <div key={program.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 mb-2">{program.name}</h5>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Precio</p>
                            <p className="font-medium text-green-600">${program.price.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Duración</p>
                            <p className="font-medium">{program.duration} períodos</p>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar campus */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Agregar Nuevo Plantel</h3>
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
                    placeholder="Ej: Tijuana Norte"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={newCampus.city}
                    onChange={(e) => setNewCampus(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="TIJ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                  <select
                    value={newCampus.brand}
                    onChange={(e) => setNewCampus(prev => ({ ...prev, brand: e.target.value }))}
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
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newCampus.isHypothetical}
                      onChange={(e) => setNewCampus(prev => ({ ...prev, isHypothetical: e.target.checked }))}
                      className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Plantel Hipotético</span>
                  </label>
                </div>
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
              
              {newCampus.isHypothetical && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-purple-900">Plantel Hipotético</h4>
                      <p className="text-sm text-purple-700">
                        Este plantel será marcado como hipotético y podrá ser incluido en proyecciones futuras.
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