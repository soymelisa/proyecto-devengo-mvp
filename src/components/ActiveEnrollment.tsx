import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Filter,
  Download,
  Calendar,
  BarChart3,
  Eye,
  Settings,
  Plus,
  Save,
  ChevronDown,
  ChevronRight,
  Target,
  UserCheck,
  UserX,
  GraduationCap,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { mockActiveStudents, mockEnrollmentProjections, mockMonthlyEnrollmentCuts } from '../data/mockData';
import { ActiveStudent, EnrollmentProjection, MonthlyEnrollmentCut } from '../types';

const ActiveEnrollment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFilters, setSelectedFilters] = useState({
    brand: 'all',
    campus: 'all',
    program: 'all',
    modality: 'all',
    enrollmentType: 'all',
    status: 'all',
    nextCycleEnrolled: 'all'
  });
  const [showProjectionModal, setShowProjectionModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ActiveStudent | null>(null);
  const [showRevenueConnection, setShowRevenueConnection] = useState(false);
  const [expandedHierarchy, setExpandedHierarchy] = useState({
    total: true,
    enrollmentTypes: true,
    status: true,
    nextCycle: true
  });
  
  // Estado para proyecciones múltiples meses
  const [multiMonthProjection, setMultiMonthProjection] = useState({
    startMonth: 'Marzo',
    startYear: 2024,
    months: 6,
    campus: 'Ciudad de México',
    program: 'Ingeniería en Sistemas',
    monthlyParams: [
      { month: 'Marzo', intercycleRetention: 87, intracycleRetention: 96 },
      { month: 'Abril', intercycleRetention: 88, intracycleRetention: 97 },
      { month: 'Mayo', intercycleRetention: 89, intracycleRetention: 97 },
      { month: 'Junio', intercycleRetention: 90, intracycleRetention: 98 },
      { month: 'Julio', intercycleRetention: 88, intracycleRetention: 96 },
      { month: 'Agosto', intercycleRetention: 92, intracycleRetention: 98 }
    ]
  });

  // Filtrar estudiantes según los filtros seleccionados
  const filteredStudents = mockActiveStudents.filter(student => {
    return (
      (selectedFilters.brand === 'all' || student.brand === selectedFilters.brand) &&
      (selectedFilters.campus === 'all' || student.campus === selectedFilters.campus) &&
      (selectedFilters.program === 'all' || student.program === selectedFilters.program) &&
      (selectedFilters.modality === 'all' || student.modality === selectedFilters.modality) &&
      (selectedFilters.enrollmentType === 'all' || student.enrollmentType === selectedFilters.enrollmentType) &&
      (selectedFilters.status === 'all' || student.status === selectedFilters.status) &&
      (selectedFilters.nextCycleEnrolled === 'all' || 
        (selectedFilters.nextCycleEnrolled === 'enrolled' && student.nextCycleEnrolled) ||
        (selectedFilters.nextCycleEnrolled === 'not-enrolled' && !student.nextCycleEnrolled))
    );
  });

  // Calcular métricas
  const totalActive = filteredStudents.length;
  const activeStudents = filteredStudents.filter(s => s.status === 'Activa').length;
  const riskStudents = filteredStudents.filter(s => s.status === 'Activa en Riesgo').length;
  const noCxCStudents = filteredStudents.filter(s => s.status === 'Activa sin CxC').length;
  const notEnrolledNext = filteredStudents.filter(s => !s.nextCycleEnrolled).length;
  const newEnrollments = filteredStudents.filter(s => s.enrollmentType === 'NI').length;
  const reinscriptions = filteredStudents.filter(s => s.enrollmentType === 'RI').length;
  const reactivations = filteredStudents.filter(s => s.enrollmentType === 'RA').length;
  const enrolledNext = filteredStudents.filter(s => s.nextCycleEnrolled).length;
  const toReinscribe = filteredStudents.filter(s => !s.nextCycleEnrolled && s.status === 'Activa').length;
  const projectedDropouts = Math.round(totalActive * 0.05); // 5% estimado
  const projectedGraduations = Math.round(totalActive * 0.08); // 8% estimado

  // Agrupar por programa
  const programSummary = filteredStudents.reduce((acc, student) => {
    const key = `${student.program}-${student.campus}-${student.modality}`;
    if (!acc[key]) {
      acc[key] = {
        program: student.program,
        campus: student.campus,
        modality: student.modality,
        total: 0,
        active: 0,
        risk: 0,
        noCxC: 0,
        notEnrolledNext: 0,
        newEnrollments: 0,
        reinscriptions: 0,
        reactivations: 0
      };
    }
    acc[key].total++;
    if (student.status === 'Activa') acc[key].active++;
    if (student.status === 'Activa en Riesgo') acc[key].risk++;
    if (student.status === 'Activa sin CxC') acc[key].noCxC++;
    if (!student.nextCycleEnrolled) acc[key].notEnrolledNext++;
    if (student.enrollmentType === 'NI') acc[key].newEnrollments++;
    if (student.enrollmentType === 'RI') acc[key].reinscriptions++;
    if (student.enrollmentType === 'RA') acc[key].reactivations++;
    return acc;
  }, {} as any);

  // Calcular proyección de ingresos basada en matrícula
  const calculateRevenueProjection = (enrollmentCount: number, avgPrice: number = 12000) => {
    return enrollmentCount * avgPrice;
  };

  // Datos de conexión con ingresos
  const revenueConnection = {
    currentEnrollment: totalActive,
    avgPricePerStudent: 12000,
    currentMonthRevenue: calculateRevenueProjection(totalActive),
    projectedNextMonth: calculateRevenueProjection(enrolledNext + (toReinscribe * 0.8)), // 80% de los por reinscribir
    variance: calculateRevenueProjection(enrolledNext + (toReinscribe * 0.8)) - calculateRevenueProjection(totalActive)
  };

  const toggleHierarchy = (level: string) => {
    setExpandedHierarchy(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  const updateMonthlyParam = (monthIndex: number, field: string, value: number) => {
    setMultiMonthProjection(prev => ({
      ...prev,
      monthlyParams: prev.monthlyParams.map((param, index) => 
        index === monthIndex ? { ...param, [field]: value } : param
      )
    }));
  };

  const addProjectionMonth = () => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const currentLength = multiMonthProjection.monthlyParams.length;
    const nextMonthIndex = currentLength % 12;
    
    setMultiMonthProjection(prev => ({
      ...prev,
      monthlyParams: [...prev.monthlyParams, {
        month: months[nextMonthIndex],
        intercycleRetention: 85,
        intracycleRetention: 95
      }]
    }));
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activa': return 'bg-green-100 text-green-800 border-green-200';
      case 'Activa en Riesgo': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Activa sin CxC': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEnrollmentTypeColor = (type: string) => {
    switch (type) {
      case 'NI': return 'bg-purple-100 text-purple-800';
      case 'RI': return 'bg-blue-100 text-blue-800';
      case 'RA': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const saveMultiMonthProjection = () => {
    // Aquí se guardarían los parámetros de proyección múltiple
    console.log('Guardando proyección multi-mes:', multiMonthProjection);
    setShowProjectionModal(false);
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'students', name: 'Lista de Estudiantes', icon: Users },
    { id: 'programs', name: 'Por Programa', icon: TrendingUp },
    { id: 'projections', name: 'Proyecciones', icon: Calendar },
    { id: 'cuts', name: 'Cortes Mensuales', icon: Settings },
    { id: 'revenue-connection', name: 'Conexión Ingresos', icon: DollarSign }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Matrícula Activa</h1>
        <p className="text-gray-600 mt-2">Gestión integral de matrícula activa, proyecciones y análisis de retención</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filtros globales */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <select
              value={selectedFilters.brand}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, brand: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las marcas</option>
              <option value="Lottus">Lottus</option>
              <option value="UVM">UVM</option>
              <option value="UNITEC">UNITEC</option>
            </select>

            <select
              value={selectedFilters.campus}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, campus: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los campus</option>
              <option value="Ciudad de México">Ciudad de México</option>
              <option value="Guadalajara">Guadalajara</option>
              <option value="Monterrey">Monterrey</option>
            </select>

            <select
              value={selectedFilters.program}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, program: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los programas</option>
              <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
              <option value="Administración de Empresas">Administración</option>
              <option value="Derecho">Derecho</option>
              <option value="Medicina">Medicina</option>
              <option value="Psicología">Psicología</option>
            </select>

            <select
              value={selectedFilters.modality}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, modality: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las modalidades</option>
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
              <option value="Sabatina">Sabatina</option>
            </select>

            <select
              value={selectedFilters.enrollmentType}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, enrollmentType: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="NI">Nuevo Ingreso</option>
              <option value="RI">Reinscripción</option>
              <option value="RA">Reactivación</option>
            </select>

            <select
              value={selectedFilters.status}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="Activa">Activa</option>
              <option value="Activa en Riesgo">En Riesgo</option>
              <option value="Activa sin CxC">Sin CxC</option>
            </select>

            <select
              value={selectedFilters.nextCycleEnrolled}
              onChange={(e) => setSelectedFilters(prev => ({ ...prev, nextCycleEnrolled: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Próximo ciclo</option>
              <option value="enrolled">Inscrito</option>
              <option value="not-enrolled">No inscrito</option>
            </select>
          </div>
        </div>

        {/* Contenido de tabs */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div>
              {/* Dashboard Jerárquico */}
              <div className="space-y-6 mb-8">
                {/* Nivel 1: Matrícula Total Activa */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleHierarchy('total')}
                  >
                    <div className="flex items-center">
                      {expandedHierarchy.total ? <ChevronDown className="w-5 h-5 text-gray-400 mr-2" /> : <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />}
                      <Users className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Matrícula Total Activa</h2>
                        <p className="text-sm text-gray-600">Todos los estudiantes activos en el sistema</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">{totalActive}</p>
                      <p className="text-sm text-gray-600">estudiantes</p>
                    </div>
                  </div>

                  {expandedHierarchy.total && (
                    <div className="mt-6 pl-8 space-y-4">
                      {/* Nivel 2: RI / NI / Reactivación */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer mb-4"
                          onClick={() => toggleHierarchy('enrollmentTypes')}
                        >
                          <div className="flex items-center">
                            {expandedHierarchy.enrollmentTypes ? <ChevronDown className="w-4 h-4 text-gray-400 mr-2" /> : <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />}
                            <h3 className="text-lg font-semibold text-gray-800">Por Tipo de Matrícula</h3>
                          </div>
                        </div>
                        
                        {expandedHierarchy.enrollmentTypes && (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-blue-600">{reinscriptions}</p>
                                  <p className="text-sm text-gray-600">Reinscripción (RI)</p>
                                </div>
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-purple-600">{newEnrollments}</p>
                                  <p className="text-sm text-gray-600">Nuevo Ingreso (NI)</p>
                                </div>
                                <Plus className="w-6 h-6 text-purple-600" />
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-green-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-green-600">{reactivations}</p>
                                  <p className="text-sm text-gray-600">Reactivación (RA)</p>
                                </div>
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Nivel 3: Activa, En Riesgo, Sin CxC */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer mb-4"
                          onClick={() => toggleHierarchy('status')}
                        >
                          <div className="flex items-center">
                            {expandedHierarchy.status ? <ChevronDown className="w-4 h-4 text-gray-400 mr-2" /> : <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />}
                            <h3 className="text-lg font-semibold text-gray-800">Por Estado de Matrícula</h3>
                          </div>
                        </div>
                        
                        {expandedHierarchy.status && (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-green-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-green-600">{activeStudents}</p>
                                  <p className="text-sm text-gray-600">Activa</p>
                                </div>
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-orange-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-orange-600">{riskStudents}</p>
                                  <p className="text-sm text-gray-600">Activa en Riesgo</p>
                                </div>
                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-blue-600">{noCxCStudents}</p>
                                  <p className="text-sm text-gray-600">Activa sin CxC</p>
                                </div>
                                <Target className="w-6 h-6 text-blue-600" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Nivel 4: Próximo Ciclo */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer mb-4"
                          onClick={() => toggleHierarchy('nextCycle')}
                        >
                          <div className="flex items-center">
                            {expandedHierarchy.nextCycle ? <ChevronDown className="w-4 h-4 text-gray-400 mr-2" /> : <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />}
                            <h3 className="text-lg font-semibold text-gray-800">Proyección Próximo Ciclo</h3>
                          </div>
                        </div>
                        
                        {expandedHierarchy.nextCycle && (
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-green-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-green-600">{enrolledNext}</p>
                                  <p className="text-sm text-gray-600">Inscritos</p>
                                </div>
                                <UserCheck className="w-6 h-6 text-green-600" />
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-yellow-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-yellow-600">{toReinscribe}</p>
                                  <p className="text-sm text-gray-600">Por Reinscribir</p>
                                </div>
                                <Calendar className="w-6 h-6 text-yellow-600" />
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-red-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-red-600">{projectedDropouts}</p>
                                  <p className="text-sm text-gray-600">Bajas Proyectadas</p>
                                </div>
                                <UserX className="w-6 h-6 text-red-600" />
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-2xl font-bold text-purple-600">{projectedGraduations}</p>
                                  <p className="text-sm text-gray-600">Graduación Proyectada</p>
                                </div>
                                <GraduationCap className="w-6 h-6 text-purple-600" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gráfica de tendencias */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Matrícula Activa</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Gráfica de tendencias - Matrícula proyectada vs real</p>
                </div>
              </div>

              {/* Alertas importantes */}
              {notEnrolledNext > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-900 mb-2">
                        Alerta: Estudiantes sin inscripción próximo ciclo
                      </h3>
                      <p className="text-red-700 mb-4">
                        {notEnrolledNext} estudiantes activos no están inscritos para el siguiente ciclo. 
                        Se requiere seguimiento inmediato para evitar pérdida de matrícula.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Ver Lista Detallada
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lista Individual de Estudiantes</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programa</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campus</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modalidad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próximo Ciclo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Pagado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {student.brand}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.programLevel}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.program}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.campus}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.modality}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getEnrollmentTypeColor(student.enrollmentType)}`}>
                            {student.enrollmentType}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            student.nextCycleEnrolled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.nextCycleEnrolled ? 'Inscrito' : 'No inscrito'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${student.totalPaid.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => setSelectedStudent(student)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Consolidado por Programa</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </button>
              </div>

              <div className="space-y-4">
                {Object.values(programSummary).map((program: any, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{program.program}</h4>
                        <p className="text-sm text-gray-600">{program.campus} - {program.modality}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{program.total}</p>
                        <p className="text-sm text-gray-600">Total estudiantes</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{program.active}</p>
                        <p className="text-xs text-green-700">Activa</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">{program.risk}</p>
                        <p className="text-xs text-orange-700">En Riesgo</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{program.noCxC}</p>
                        <p className="text-xs text-blue-700">Sin CxC</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{program.newEnrollments}</p>
                        <p className="text-xs text-purple-700">Nuevo Ingreso</p>
                      </div>
                      <div className="text-center p-3 bg-teal-50 rounded-lg">
                        <p className="text-2xl font-bold text-teal-600">{program.reinscriptions}</p>
                        <p className="text-xs text-teal-700">Reinscripción</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{program.notEnrolledNext}</p>
                        <p className="text-xs text-red-700">No Inscrito</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projections' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Proyecciones de Matrícula</h3>
                <button 
                  onClick={() => setShowProjectionModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Configurar Proyección Multi-Mes
                </button>
              </div>

              {/* Proyección Multi-Mes Actual */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Proyección Configurada</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Campus</p>
                    <p className="font-medium">{multiMonthProjection.campus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Programa</p>
                    <p className="font-medium">{multiMonthProjection.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Inicio</p>
                    <p className="font-medium">{multiMonthProjection.startMonth} {multiMonthProjection.startYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Meses proyectados</p>
                    <p className="font-medium">{multiMonthProjection.monthlyParams.length}</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retención Interciclo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retención Intraciclo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula Proyectada</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingreso Proyectado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {multiMonthProjection.monthlyParams.map((param, index) => {
                        const projectedEnrollment = Math.round(totalActive * (param.intercycleRetention / 100) * (param.intracycleRetention / 100));
                        const projectedRevenue = calculateRevenueProjection(projectedEnrollment);
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                              {param.month}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {param.intercycleRetention}%
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                              {param.intracycleRetention}%
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {projectedEnrollment}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              ${projectedRevenue.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Gráfica de proyecciones vs reales */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Matrícula Proyectada vs Real</h4>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Gráfica comparativa - Proyecciones vs datos reales</p>
                </div>
              </div>

              {/* Tabla de proyecciones */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900">Historial de Proyecciones</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campus</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programa</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modalidad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyectado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Real</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Varianza</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {mockEnrollmentProjections.map((projection) => (
                        <tr key={projection.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {projection.month} {projection.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {projection.campus}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {projection.program}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {projection.modality}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {projection.projectedEnrollment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {projection.actualEnrollment || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {projection.variance ? (
                              <span className={projection.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {projection.variance >= 0 ? '+' : ''}{projection.variance}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              projection.isReal 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {projection.isReal ? 'Real' : 'Proyectado'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cuts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Cortes Mensuales de Matrícula</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  Generar Corte
                </button>
              </div>

              <div className="space-y-6">
                {mockMonthlyEnrollmentCuts.map((cut) => (
                  <div key={cut.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Corte {cut.month} {cut.year}</h4>
                        <p className="text-sm text-gray-600">Fecha de corte: {new Date(cut.cutDate).toLocaleDateString('es-MX')}</p>
                      </div>
                      <button className="flex items-center px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{cut.totalActive}</p>
                        <p className="text-xs text-blue-700">Total Activa</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">{cut.totalRisk}</p>
                        <p className="text-xs text-orange-700">En Riesgo</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{cut.totalNoCxC}</p>
                        <p className="text-xs text-purple-700">Sin CxC</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{cut.newEnrollments}</p>
                        <p className="text-xs text-green-700">Nuevo Ingreso</p>
                      </div>
                      <div className="text-center p-3 bg-teal-50 rounded-lg">
                        <p className="text-2xl font-bold text-teal-600">{cut.reinscriptions}</p>
                        <p className="text-xs text-teal-700">Reinscripción</p>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">{cut.reactivations}</p>
                        <p className="text-xs text-indigo-700">Reactivación</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{cut.dropouts}</p>
                        <p className="text-xs text-red-700">Bajas</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'revenue-connection' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Conexión Matrícula - Ingresos</h3>
                <p className="text-sm text-gray-600 mt-1">Relación directa entre proyecciones de matrícula e ingresos devengados</p>
              </div>

              {/* Conexión Visual */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-6">Flujo Matrícula → Ingresos</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Matrícula Actual */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="text-center">
                      <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                      <h5 className="font-semibold text-blue-900 mb-2">Matrícula Actual</h5>
                      <p className="text-3xl font-bold text-blue-600 mb-2">{revenueConnection.currentEnrollment}</p>
                      <p className="text-sm text-blue-700">estudiantes activos</p>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-sm text-blue-700">Precio promedio</p>
                        <p className="text-lg font-semibold text-blue-900">${revenueConnection.avgPricePerStudent.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Flecha de conexión */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <ArrowRight className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Genera</p>
                    </div>
                  </div>

                  {/* Ingresos Actuales */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                      <h5 className="font-semibold text-green-900 mb-2">Ingresos Actuales</h5>
                      <p className="text-3xl font-bold text-green-600 mb-2">${(revenueConnection.currentMonthRevenue / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-green-700">mes actual</p>
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="text-sm text-green-700">Por estudiante</p>
                        <p className="text-lg font-semibold text-green-900">${revenueConnection.avgPricePerStudent.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proyección Futura */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-6">Proyección Próximo Mes</h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Matrícula Proyectada */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="text-center">
                      <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                      <h5 className="font-semibold text-purple-900 mb-2">Matrícula Proyectada</h5>
                      <p className="text-3xl font-bold text-purple-600 mb-2">{Math.round(enrolledNext + (toReinscribe * 0.8))}</p>
                      <p className="text-sm text-purple-700">estudiantes estimados</p>
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <p className="text-xs text-purple-600">
                          {enrolledNext} inscritos + {Math.round(toReinscribe * 0.8)} reinscripciones (80%)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Flecha de conexión */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <ArrowRight className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Proyecta</p>
                    </div>
                  </div>

                  {/* Ingresos Proyectados */}
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                      <h5 className="font-semibold text-orange-900 mb-2">Ingresos Proyectados</h5>
                      <p className="text-3xl font-bold text-orange-600 mb-2">${(revenueConnection.projectedNextMonth / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-orange-700">próximo mes</p>
                      <div className="mt-4 pt-4 border-t border-orange-200">
                        <p className="text-sm text-orange-700">Varianza vs actual</p>
                        <p className={`text-lg font-semibold ${revenueConnection.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {revenueConnection.variance >= 0 ? '+' : ''}${(revenueConnection.variance / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de Conexión Detallada */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900">Detalle de Conexión por Mes</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula Proyectada</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula Real</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos Proyectados</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos Reales</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Varianza</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {multiMonthProjection.monthlyParams.map((param, index) => {
                        const projectedEnrollment = Math.round(totalActive * (param.intercycleRetention / 100) * (param.intracycleRetention / 100));
                        const projectedRevenue = calculateRevenueProjection(projectedEnrollment);
                        const isHistorical = index < 2; // Primeros 2 meses son históricos
                        const realEnrollment = isHistorical ? projectedEnrollment + Math.round((Math.random() - 0.5) * 20) : null;
                        const realRevenue = realEnrollment ? calculateRevenueProjection(realEnrollment) : null;
                        const variance = realRevenue ? realRevenue - projectedRevenue : null;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {param.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                              {projectedEnrollment}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {realEnrollment || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                              ${projectedRevenue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {realRevenue ? `$${realRevenue.toLocaleString()}` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {variance ? (
                                <span className={variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {variance >= 0 ? '+' : ''}${variance.toLocaleString()}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                isHistorical 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isHistorical ? 'Real' : 'Proyectado'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para configurar proyección multi-mes */}
      {showProjectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Configurar Proyección Multi-Mes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Configuración General */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mes Inicio</label>
                    <select
                      value={multiMonthProjection.startMonth}
                      onChange={(e) => setMultiMonthProjection(prev => ({ ...prev, startMonth: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Marzo</option>
                      <option>Abril</option>
                      <option>Mayo</option>
                      <option>Junio</option>
                      <option>Julio</option>
                      <option>Agosto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                    <input
                      type="number"
                      value={multiMonthProjection.startYear}
                      onChange={(e) => setMultiMonthProjection(prev => ({ ...prev, startYear: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>




                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                    <select
                      value={multiMonthProjection.campus}
                      onChange={(e) => setMultiMonthProjection(prev => ({ ...prev, campus: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Ciudad de México</option>
                      <option>Guadalajara</option>
                      <option>Monterrey</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Programa</label>
                    <select
                      value={multiMonthProjection.program}
                      onChange={(e) => setMultiMonthProjection(prev => ({ ...prev, program: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Ingeniería en Sistemas</option>
                      <option>Administración de Empresas</option>
                      <option>Derecho</option>
                    </select>
                  </div>
                </div>

                {/* Parámetros por Mes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-900">Parámetros por Mes</h4>
                    <button 
                      onClick={addProjectionMonth}
                      className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Mes
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {multiMonthProjection.monthlyParams.map((param, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Mes: {param.month}
                            </label>
                            <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900">
                              {param.month}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Retención Interciclo: {param.intercycleRetention}%
                            </label>
                            <input
                              type="range"
                              min="50"
                              max="100"
                              value={param.intercycleRetention}
                              onChange={(e) => updateMonthlyParam(index, 'intercycleRetention', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Retención Intraciclo: {param.intracycleRetention}%
                            </label>
                            <input
                              type="range"
                              min="50"
                              max="100"
                              value={param.intracycleRetention}
                              onChange={(e) => updateMonthlyParam(index, 'intracycleRetention', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Matrícula Proyectada:</p>
                              <p className="font-medium text-blue-600">
                                {Math.round(totalActive * (param.intercycleRetention / 100) * (param.intracycleRetention / 100))}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Ingreso Proyectado:</p>
                              <p className="font-medium text-green-600">
                                ${calculateRevenueProjection(Math.round(totalActive * (param.intercycleRetention / 100) * (param.intracycleRetention / 100))).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowProjectionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={saveMultiMonthProjection}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Proyección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle del estudiante */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detalle del Estudiante</h3>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <p className="text-sm text-gray-900">{selectedStudent.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <p className="text-sm text-gray-900">{selectedStudent.brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                  <p className="text-sm text-gray-900">{selectedStudent.program}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                  <p className="text-sm text-gray-900">{selectedStudent.programLevel}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                  <p className="text-sm text-gray-900">{selectedStudent.campus}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                  <p className="text-sm text-gray-900">{selectedStudent.modality}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Matrícula</label>
                  <span className={`px-2 py-1 text-xs rounded-full ${getEnrollmentTypeColor(selectedStudent.enrollmentType)}`}>
                    {selectedStudent.enrollmentType === 'NI' ? 'Nuevo Ingreso' : 
                     selectedStudent.enrollmentType === 'RI' ? 'Reinscripción' : 'Reactivación'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(selectedStudent.status)}`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Materias Activas</label>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.subjects.map((subject, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Historial de Pagos Cash-In</label>
                <div className="space-y-2">
                  {selectedStudent.cashInPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{payment.concept}</p>
                        <p className="text-sm text-gray-600">{payment.date} - {payment.method}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          payment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Pagado:</span>
                    <span className="text-lg font-bold text-green-600">${selectedStudent.totalPaid.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveEnrollment;