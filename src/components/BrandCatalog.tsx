import React, { useState } from 'react';
import { Building, Plus, Edit, Eye, Search, Filter, Tag, AlertTriangle, X, Save, MapPin, BookOpen, Users } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  shortName: string;
  isHypothetical: boolean;
  hypotheticalTag?: string;
  modalities: string[];
  levels: string[];
  campusCount: number;
  programs: BrandProgram[];
  campuses: BrandCampus[];
  createdAt: string;
  description?: string;
}

interface BrandProgram {
  id: string;
  name: string;
  level: string;
  modality: string;
  duration: number;
  price: number;
}

interface BrandCampus {
  id: string;
  name: string;
  city: string;
  address: string;
}

const BrandCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHypothetical, setShowHypothetical] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [newBrand, setNewBrand] = useState({
    name: '',
    shortName: '',
    description: '',
    modalities: [] as string[],
    levels: [] as string[],
    campusCount: 1,
    programs: [] as BrandProgram[],
    campuses: [] as BrandCampus[],
    hypotheticalTag: ''
  });

  // Mock data de marcas existentes y hipotéticas
  const mockBrands: Brand[] = [
    {
      id: '1',
      name: 'Lottus Education',
      shortName: 'Lottus',
      isHypothetical: false,
      modalities: ['Presencial', 'Online', 'Sabatina'],
      levels: ['Preparatoria', 'Licenciatura', 'Maestría'],
      campusCount: 15,
      programs: [
        { id: '1', name: 'Ingeniería en Sistemas', level: 'Licenciatura', modality: 'Presencial', duration: 8, price: 12500 },
        { id: '2', name: 'Administración de Empresas', level: 'Licenciatura', modality: 'Online', duration: 8, price: 9500 }
      ],
      campuses: [
        { id: '1', name: 'Ciudad de México', city: 'CDMX', address: 'Av. Insurgentes Sur 123' },
        { id: '2', name: 'Guadalajara', city: 'GDL', address: 'Av. López Mateos 456' }
      ],
      createdAt: '2020-01-15',
      description: 'Institución educativa líder en México'
    },
    {
      id: '2',
      name: 'Universidad del Valle de México',
      shortName: 'UVM',
      isHypothetical: false,
      modalities: ['Presencial', 'Online'],
      levels: ['Preparatoria', 'Licenciatura', 'Maestría', 'Doctorado'],
      campusCount: 35,
      programs: [
        { id: '3', name: 'Medicina', level: 'Licenciatura', modality: 'Presencial', duration: 12, price: 25000 },
        { id: '4', name: 'Derecho', level: 'Licenciatura', modality: 'Presencial', duration: 10, price: 15000 }
      ],
      campuses: [
        { id: '3', name: 'Monterrey', city: 'MTY', address: 'Av. Constitución 789' }
      ],
      createdAt: '1960-03-20',
      description: 'Universidad privada con presencia nacional'
    },
    {
      id: '3',
      name: 'Universidad Tecnológica de México',
      shortName: 'UNITEC',
      isHypothetical: false,
      modalities: ['Presencial', 'Online', 'Sabatina'],
      levels: ['Preparatoria', 'Licenciatura', 'Maestría'],
      campusCount: 20,
      programs: [
        { id: '5', name: 'Psicología', level: 'Licenciatura', modality: 'Online', duration: 8, price: 8000 }
      ],
      campuses: [],
      createdAt: '1966-09-15',
      description: 'Educación tecnológica de vanguardia'
    },
    // Marcas hipotéticas
    {
      id: 'hyp-1',
      name: 'Instituto de Innovación Digital',
      shortName: 'IID',
      isHypothetical: true,
      hypotheticalTag: 'EXPANSION-2026',
      modalities: ['Online', 'Híbrida'],
      levels: ['Licenciatura', 'Maestría', 'Certificaciones'],
      campusCount: 5,
      programs: [
        { id: 'hyp-p1', name: 'Inteligencia Artificial', level: 'Licenciatura', modality: 'Online', duration: 8, price: 18000 },
        { id: 'hyp-p2', name: 'Ciberseguridad', level: 'Maestría', modality: 'Híbrida', duration: 4, price: 22000 }
      ],
      campuses: [
        { id: 'hyp-c1', name: 'Campus Virtual Central', city: 'CDMX', address: 'Plataforma Digital' },
        { id: 'hyp-c2', name: 'Hub Guadalajara', city: 'GDL', address: 'Av. Tecnológico 100' }
      ],
      createdAt: '2025-01-15',
      description: 'Marca hipotética enfocada en tecnologías emergentes'
    }
  ];

  const availableModalities = ['Presencial', 'Online', 'Sabatina', 'Híbrida'];
  const availableLevels = ['Preparatoria', 'Licenciatura', 'Maestría', 'Doctorado', 'Certificaciones'];

  // Filtrar marcas
  const filteredBrands = mockBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHypothetical = showHypothetical || !brand.isHypothetical;
    
    return matchesSearch && matchesHypothetical;
  });

  // Calcular métricas
  const totalBrands = filteredBrands.length;
  const realBrands = filteredBrands.filter(b => !b.isHypothetical).length;
  const hypotheticalBrands = filteredBrands.filter(b => b.isHypothetical).length;
  const totalCampuses = filteredBrands.reduce((sum, brand) => sum + brand.campusCount, 0);
  const totalPrograms = filteredBrands.reduce((sum, brand) => sum + brand.programs.length, 0);

  const handleModalityToggle = (modality: string) => {
    setNewBrand(prev => ({
      ...prev,
      modalities: prev.modalities.includes(modality)
        ? prev.modalities.filter(m => m !== modality)
        : [...prev.modalities, modality]
    }));
  };

  const handleLevelToggle = (level: string) => {
    setNewBrand(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level]
    }));
  };

  const addProgram = () => {
    const newProgram: BrandProgram = {
      id: `prog-${Date.now()}`,
      name: '',
      level: newBrand.levels[0] || 'Licenciatura',
      modality: newBrand.modalities[0] || 'Presencial',
      duration: 8,
      price: 10000
    };
    setNewBrand(prev => ({
      ...prev,
      programs: [...prev.programs, newProgram]
    }));
  };

  const updateProgram = (index: number, field: keyof BrandProgram, value: any) => {
    setNewBrand(prev => ({
      ...prev,
      programs: prev.programs.map((prog, i) => 
        i === index ? { ...prog, [field]: value } : prog
      )
    }));
  };

  const removeProgram = (index: number) => {
    setNewBrand(prev => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index)
    }));
  };

  const addCampus = () => {
    const newCampus: BrandCampus = {
      id: `campus-${Date.now()}`,
      name: '',
      city: '',
      address: ''
    };
    setNewBrand(prev => ({
      ...prev,
      campuses: [...prev.campuses, newCampus]
    }));
  };

  const updateCampus = (index: number, field: keyof BrandCampus, value: string) => {
    setNewBrand(prev => ({
      ...prev,
      campuses: prev.campuses.map((campus, i) => 
        i === index ? { ...campus, [field]: value } : campus
      )
    }));
  };

  const removeCampus = (index: number) => {
    setNewBrand(prev => ({
      ...prev,
      campuses: prev.campuses.filter((_, i) => i !== index)
    }));
  };

  const handleCreateBrand = () => {
    console.log('Crear marca hipotética:', newBrand);
    // Aquí se integraría con los catálogos de planteles y programas
    alert(`Marca "${newBrand.name}" creada exitosamente.\n\nSe han agregado automáticamente:\n- ${newBrand.campuses.length} planteles al catálogo\n- ${newBrand.programs.length} programas al catálogo\n\nTodos marcados con el tag: ${newBrand.hypotheticalTag}`);
    
    setShowCreateModal(false);
    setCurrentStep(1);
    // Reset form
    setNewBrand({
      name: '',
      shortName: '',
      description: '',
      modalities: [],
      levels: [],
      campusCount: 1,
      programs: [],
      campuses: [],
      hypotheticalTag: ''
    });
  };

  const getBrandTypeColor = (isHypothetical: boolean) => {
    return isHypothetical 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-green-100 text-green-800 border-green-200';
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catálogo de Marca</h1>
            <p className="text-gray-600 mt-2">Gestión de marcas educativas y creación de marcas hipotéticas</p>
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
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Marca Hipotética
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-50">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{totalBrands}</h3>
            <p className="text-gray-600 text-sm mt-1">Total Marcas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-50">
              <Building className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-green-900">{realBrands}</h3>
            <p className="text-gray-600 text-sm mt-1">Marcas Reales</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-purple-50">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-purple-900">{hypotheticalBrands}</h3>
            <p className="text-gray-600 text-sm mt-1">Marcas Hipotéticas</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-orange-50">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-orange-900">{totalCampuses}</h3>
            <p className="text-gray-600 text-sm mt-1">Total Planteles</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-indigo-50">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-indigo-900">{totalPrograms}</h3>
            <p className="text-gray-600 text-sm mt-1">Total Programas</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showHypothetical}
              onChange={(e) => setShowHypothetical(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Mostrar Hipotéticas</span>
          </label>

          <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Listado de marcas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Marcas Registradas ({filteredBrands.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modalidades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planteles
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
              {filteredBrands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                        <div className="text-sm text-gray-500">{brand.shortName}</div>
                        {brand.isHypothetical && brand.hypotheticalTag && (
                          <div className="flex items-center mt-1">
                            <Tag className="w-3 h-3 text-purple-500 mr-1" />
                            <span className="text-xs text-purple-600 font-medium">{brand.hypotheticalTag}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {brand.modalities.slice(0, 2).map((modality, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {modality}
                        </span>
                      ))}
                      {brand.modalities.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{brand.modalities.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {brand.levels.slice(0, 2).map((level, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {level}
                        </span>
                      ))}
                      {brand.levels.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{brand.levels.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {brand.campusCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {brand.programs.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getBrandTypeColor(brand.isHypothetical)}`}>
                      {brand.isHypothetical ? 'Hipotética' : 'Real'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedBrand(brand)}
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

      {/* Modal para crear nueva marca */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Crear Nueva Marca Hipotética</h3>
                  <p className="text-sm text-gray-600 mt-1">Paso {currentStep} de 4</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step}
                      </div>
                      {step < 4 && (
                        <div className={`w-16 h-1 mx-2 ${
                          step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Información</span>
                  <span>Modalidades</span>
                  <span>Programas</span>
                  <span>Planteles</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Paso 1: Información básica */}
              {currentStep === 1 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Marca <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBrand.name}
                        onChange={(e) => setNewBrand(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ej: Instituto de Innovación Digital"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Corto <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBrand.shortName}
                        onChange={(e) => setNewBrand(prev => ({ ...prev, shortName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ej: IID"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <textarea
                        value={newBrand.description}
                        onChange={(e) => setNewBrand(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Descripción de la marca educativa..."
                      ></textarea>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tag Identificador <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newBrand.hypotheticalTag}
                        onChange={(e) => setNewBrand(prev => ({ ...prev, hypotheticalTag: e.target.value }))}
                        className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-purple-50"
                        placeholder="Ej: EXPANSION-2026, PILOTO-2026"
                      />
                      <p className="text-xs text-purple-600 mt-1">
                        Este tag identificará todos los elementos vinculados a esta marca
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 2: Modalidades y Niveles */}
              {currentStep === 2 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Modalidades y Niveles</h4>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Modalidades Disponibles <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableModalities.map((modality) => (
                        <label key={modality} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newBrand.modalities.includes(modality)}
                            onChange={() => handleModalityToggle(modality)}
                            className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{modality}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Niveles Educativos <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {availableLevels.map((level) => (
                        <label key={level} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newBrand.levels.includes(level)}
                            onChange={() => handleLevelToggle(level)}
                            className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3: Programas */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Programas Académicos</h4>
                    <button
                      onClick={addProgram}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Programa
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {newBrand.programs.map((program, index) => (
                      <div key={program.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Programa {index + 1}</h5>
                          <button
                            onClick={() => removeProgram(index)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                              type="text"
                              value={program.name}
                              onChange={(e) => updateProgram(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                              placeholder="Nombre del programa"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Nivel</label>
                            <select
                              value={program.level}
                              onChange={(e) => updateProgram(index, 'level', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                            >
                              {newBrand.levels.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Modalidad</label>
                            <select
                              value={program.modality}
                              onChange={(e) => updateProgram(index, 'modality', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                            >
                              {newBrand.modalities.map(modality => (
                                <option key={modality} value={modality}>{modality}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Duración (períodos)</label>
                            <input
                              type="number"
                              value={program.duration}
                              onChange={(e) => updateProgram(index, 'duration', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                              min="1"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Precio</label>
                            <input
                              type="number"
                              value={program.price}
                              onChange={(e) => updateProgram(index, 'price', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {newBrand.programs.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No hay programas agregados</p>
                        <p className="text-sm">Haz clic en "Agregar Programa" para comenzar</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Paso 4: Planteles */}
              {currentStep === 4 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Planteles</h4>
                    <button
                      onClick={addCampus}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Plantel
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {newBrand.campuses.map((campus, index) => (
                      <div key={campus.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Plantel {index + 1}</h5>
                          <button
                            onClick={() => removeCampus(index)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del Plantel</label>
                            <input
                              type="text"
                              value={campus.name}
                              onChange={(e) => updateCampus(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                              placeholder="Ej: Campus Central"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Ciudad</label>
                            <input
                              type="text"
                              value={campus.city}
                              onChange={(e) => updateCampus(index, 'city', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                              placeholder="Ej: CDMX"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Dirección</label>
                            <input
                              type="text"
                              value={campus.address}
                              onChange={(e) => updateCampus(index, 'address', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                              placeholder="Dirección completa"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {newBrand.campuses.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No hay planteles agregados</p>
                        <p className="text-sm">Haz clic en "Agregar Plantel" para comenzar</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                
                {currentStep < 4 ? (
                  <button 
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && (!newBrand.name || !newBrand.shortName || !newBrand.hypotheticalTag)) ||
                      (currentStep === 2 && (newBrand.modalities.length === 0 || newBrand.levels.length === 0))
                    }
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button 
                    onClick={handleCreateBrand}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Crear Marca
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle de marca */}
      {selectedBrand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedBrand.name}</h3>
                  <p className="text-sm text-gray-600">{selectedBrand.shortName}</p>
                </div>
                <button 
                  onClick={() => setSelectedBrand(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información general */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBrandTypeColor(selectedBrand.isHypothetical)}`}>
                        {selectedBrand.isHypothetical ? 'Hipotética' : 'Real'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Planteles:</span>
                      <span className="font-medium">{selectedBrand.campusCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Programas:</span>
                      <span className="font-medium">{selectedBrand.programs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creada:</span>
                      <span className="font-medium">{new Date(selectedBrand.createdAt).toLocaleDateString('es-MX')}</span>
                    </div>
                  </div>
                  
                  {selectedBrand.description && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Descripción</h5>
                      <p className="text-sm text-gray-600">{selectedBrand.description}</p>
                    </div>
                  )}
                </div>

                {/* Modalidades y Niveles */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Modalidades y Niveles</h4>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Modalidades</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedBrand.modalities.map((modality, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {modality}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Niveles</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedBrand.levels.map((level, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Programas */}
              {selectedBrand.programs.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Programas ({selectedBrand.programs.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedBrand.programs.map((program) => (
                      <div key={program.id} className="border border-gray-200 rounded-lg p-3">
                        <h5 className="font-medium text-gray-900">{program.name}</h5>
                        <div className="mt-2 space-y-1 text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Nivel:</span>
                            <span>{program.level}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Modalidad:</span>
                            <span>{program.modality}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duración:</span>
                            <span>{program.duration} períodos</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Precio:</span>
                            <span className="font-medium text-green-600">${program.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Planteles */}
              {selectedBrand.campuses.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Planteles ({selectedBrand.campuses.length})</h4>
                  <div className="space-y-3">
                    {selectedBrand.campuses.map((campus) => (
                      <div key={campus.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{campus.name}</h5>
                            <p className="text-sm text-gray-600">{campus.city}</p>
                          </div>
                          <MapPin className="w-4 h-4 text-gray-400" />
                        </div>
                        {campus.address && (
                          <p className="text-xs text-gray-500 mt-1">{campus.address}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandCatalog;