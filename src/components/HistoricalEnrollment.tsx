import React, { useState } from 'react';
import { Users, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, ChevronLeft, ChevronRight, Download, Search, Filter, Calculator, Settings, Save, Plus, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { mockActiveStudents } from '../data/mockData';
import { ActiveStudent } from '../types';

interface ProjectionConfig {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  intercycleRetention: number;
  intracycleRetention: number;
  tuitionDiscount: number;
  enrollmentDiscount: number;
  campus: string;
  program: string;
  modality: string;
  brand: string;
  createdAt: string;
}

interface ProjectionResult {
  month: string;
  students: number;
  tuitionCount: number;
  tuitionRevenue: number;
  enrollmentCount: number;
  enrollmentRevenue: number;
  totalRevenue: number;
}

const HistoricalEnrollment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = Sept 25 (presente)
  const [selectedMonth, setSelectedMonth] = useState('Sep 25');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProjection, setSelectedProjection] = useState<ProjectionConfig | null>(null);
  const [projectionMonth, setProjectionMonth] = useState('Oct 25');
  const [showNewProjection, setShowNewProjection] = useState(false);
  const [showSavedProjections, setShowSavedProjections] = useState(false);
  
  const [newProjection, setNewProjection] = useState<Partial<ProjectionConfig>>({
    name: '',
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    intercycleRetention: 85,
    intracycleRetention: 92,
    tuitionDiscount: 10,
    enrollmentDiscount: 15,
    campus: 'all',
    program: 'all',
    modality: 'all',
    brand: 'all'
  });

  const recordsPerPage = 50;

  // Mock de proyecciones guardadas
  const savedProjections: ProjectionConfig[] = [
    {
      id: '1',
      name: 'Proyección Q4 2025',
      startDate: '2025-10-01',
      endDate: '2025-12-31',
      intercycleRetention: 85,
      intracycleRetention: 92,
      tuitionDiscount: 10,
      enrollmentDiscount: 15,
      campus: 'Ciudad de México',
      program: 'Ingeniería en Sistemas',
      modality: 'Presencial',
      brand: 'Lottus',
      createdAt: '2025-09-15'
    },
    {
      id: '2',
      name: 'Proyección Anual 2026',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      intercycleRetention: 88,
      intracycleRetention: 94,
      tuitionDiscount: 12,
      enrollmentDiscount: 18,
      campus: 'all',
      program: 'all',
      modality: 'all',
      brand: 'all',
      createdAt: '2025-09-10'
    }
  ];

  // Generar meses desde Sept 25 hacia atrás
  const generateMonths = () => {
    const months = [];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let currentYear = 25;
    let currentMonth = 8; // Sept (0-indexed)

    for (let i = 0; i < 24; i++) { // 24 meses hacia atrás
      months.push(`${monthNames[currentMonth]} ${currentYear}`);
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
    }
    return months;
  };

  const months = generateMonths();
  const visibleMonths = months.slice(currentMonthIndex, currentMonthIndex + 12);

  // Generar meses futuros para proyecciones
  const generateFutureMonths = () => {
    const months = [];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    let currentYear = 25;
    let currentMonth = 9; // Oct (0-indexed)

    for (let i = 0; i < 24; i++) { // 24 meses hacia adelante
      months.push(`${monthNames[currentMonth]} ${currentYear}`);
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
    return months;
  };

  const futureMonths = generateFutureMonths();

  // Calcular proyecciones
  const calculateProjections = (config: Partial<ProjectionConfig>): ProjectionResult[] => {
    const baseStudents = 150;
    const baseTuitionPrice = 8500;
    const baseEnrollmentPrice = 12500;
    
    return futureMonths.slice(0, 12).map((month, index) => {
      const intercycleRetentionFactor = Math.pow((config.intercycleRetention || 85) / 100, index / 12);
      const intracycleRetentionFactor = (config.intracycleRetention || 92) / 100;
      const combinedRetentionFactor = intercycleRetentionFactor * intracycleRetentionFactor;
      const students = Math.round(baseStudents * combinedRetentionFactor);
      
      const tuitionDiscountFactor = 1 - (config.tuitionDiscount || 10) / 100;
      const enrollmentDiscountFactor = 1 - (config.enrollmentDiscount || 15) / 100;
      
      const effectiveTuitionPrice = baseTuitionPrice * tuitionDiscountFactor;
      const effectiveEnrollmentPrice = baseEnrollmentPrice * enrollmentDiscountFactor;
      
      const tuitionCount = students;
      const enrollmentCount = index === 0 ? students : Math.round(students * 0.1); // Solo 10% se inscribe en meses posteriores
      
      return {
        month,
        students,
        tuitionCount,
        tuitionRevenue: tuitionCount * effectiveTuitionPrice,
        enrollmentCount,
        enrollmentRevenue: enrollmentCount * effectiveEnrollmentPrice,
        totalRevenue: (tuitionCount * effectiveTuitionPrice) + (enrollmentCount * effectiveEnrollmentPrice)
      };
    });
  };

  // Función para generar datos simulados por mes
  const getDataForMonth = (month: string) => {
    // Simulamos variaciones en los datos según el mes
    const monthIndex = months.indexOf(month);
    const baseStudents = mockActiveStudents.length;
    
    // Variaciones simuladas por mes
    const variations = {
      total: Math.max(baseStudents - Math.floor(monthIndex * 0.5), baseStudents - 10),
      active: Math.max(Math.floor((baseStudents - monthIndex * 0.3) * 0.6), 1),
      risk: Math.max(Math.floor((baseStudents - monthIndex * 0.2) * 0.2), 0),
      noCxC: Math.max(Math.floor((baseStudents - monthIndex * 0.1) * 0.15), 0),
      dropouts: Math.min(Math.floor(monthIndex * 2 + 15), 60)
    };

    return variations;
  };

  // Función para generar estudiantes simulados por mes
  const getStudentsForMonth = (month: string) => {
    const monthIndex = months.indexOf(month);
    const data = getDataForMonth(month);
    
    // Crear una copia de los estudiantes base y ajustar según el mes
    let studentsForMonth = [...mockActiveStudents];
    
    // Simular cambios en el estado según el mes (más antiguos = más cambios)
    studentsForMonth = studentsForMonth.map((student, index) => {
      if (monthIndex > 6 && index % 3 === 0) {
        // Algunos estudiantes cambian de estado en meses más antiguos
        return {
          ...student,
          status: index % 2 === 0 ? 'Activa en Riesgo' : 'Activa sin CxC' as any
        };
      }
      return student;
    });

    // Ajustar la cantidad total según las variaciones
    if (data.total < studentsForMonth.length) {
      studentsForMonth = studentsForMonth.slice(0, data.total);
    }

    return studentsForMonth;
  };

  // Obtener datos para el mes seleccionado
  const currentMonthData = getDataForMonth(selectedMonth);
  const currentMonthStudents = getStudentsForMonth(selectedMonth);

  // Métricas para el mes seleccionado
  const totalStudents = currentMonthData.total;
  const activeStudents = currentMonthData.active;
  const riskStudents = currentMonthData.risk;
  const noCxCStudents = currentMonthData.noCxC;
  const dropouts = currentMonthData.dropouts;

  // Filtrar estudiantes del mes seleccionado
  const filteredStudents = currentMonthStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + recordsPerPage);

  // Reset página cuando cambia el mes o filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, searchTerm, statusFilter]);
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
      case 'NI': return 'bg-blue-100 text-blue-800';
      case 'RI': return 'bg-green-100 text-green-800';
      case 'RA': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnrollmentTypeLabel = (type: string) => {
    switch (type) {
      case 'NI': return 'Nuevo Ingreso';
      case 'RI': return 'Reinscripción';
      case 'RA': return 'Reactivación';
      default: return type;
    }
  };

  const navigateMonths = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    } else if (direction === 'prev' && currentMonthIndex < months.length - 12) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Matrícula Histórica</h1>
            <p className="text-gray-600 mt-2">Análisis histórico de matrícula por período</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => alert('Función de reporte de errores - En desarrollo')}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reportar Error
            </button>
          </div>
        </div>
      </div>

      {/* Tabs principales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('resumen')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'resumen'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('estudiantes')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'estudiantes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Lista de estudiantes
            </button>
            <button
              onClick={() => setActiveTab('proyecciones')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'proyecciones'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Proyecciones
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'resumen' && (
            <div>
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-900">{totalStudents}</h3>
                    <p className="text-gray-600 text-sm mt-1">Total Estudiantes</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-green-50">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-green-900">{activeStudents}</h3>
                    <p className="text-gray-600 text-sm mt-1">Matrícula Activa</p>
                    <p className="text-xs text-green-600 mt-1">
                      {Math.round((activeStudents / totalStudents) * 100)}% del total
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-orange-50">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-orange-900">{riskStudents}</h3>
                    <p className="text-gray-600 text-sm mt-1">En Riesgo</p>
                    <p className="text-xs text-orange-600 mt-1">Requiere seguimiento</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-purple-50">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-purple-900">{noCxCStudents}</h3>
                    <p className="text-gray-600 text-sm mt-1">Sin CxC</p>
                    <p className="text-xs text-purple-600 mt-1">Al corriente</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-red-50">
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-red-900">{dropouts}</h3>
                    <p className="text-gray-600 text-sm mt-1">Bajas</p>
                    <p className="text-xs text-red-600 mt-1">Este período</p>
                  </div>
                </div>
              </div>

              {/* Desglose por tipo de matrícula */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Desglose por Tipo de Matrícula</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-blue-900">2</h3>
                    <p className="text-sm text-blue-700">Nuevos Ingresos</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-900">2</h3>
                    <p className="text-sm text-green-700">Reinscripciones</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-purple-900">1</h3>
                    <p className="text-sm text-purple-700">Reactivaciones</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-red-900">{dropouts}</h3>
                    <p className="text-sm text-red-700">Bajas</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'estudiantes' && (
            <div>
              {/* Resumen de matrícula */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <h3 className="text-2xl font-bold text-blue-900">{totalStudents}</h3>
                  <p className="text-sm text-blue-700">Total</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <h3 className="text-2xl font-bold text-green-900">{activeStudents}</h3>
                  <p className="text-sm text-green-700">Activos</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <h3 className="text-2xl font-bold text-orange-900">{riskStudents}</h3>
                  <p className="text-sm text-orange-700">En Riesgo</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <h3 className="text-2xl font-bold text-purple-900">{noCxCStudents}</h3>
                  <p className="text-sm text-purple-700">Sin CxC</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <h3 className="text-2xl font-bold text-red-900">{dropouts}</h3>
                  <p className="text-sm text-red-700">Bajas</p>
                </div>
              </div>

              {/* Navegación de meses */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonths('prev')}
                    disabled={currentMonthIndex >= months.length - 12}
                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex space-x-2 overflow-x-auto">
                    {visibleMonths.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => setSelectedMonth(month)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedMonth === month
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-blue-50'
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => navigateMonths('next')}
                    disabled={currentMonthIndex <= 0}
                    className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 text-center">
                  Mostrando datos para: <span className="font-medium">{selectedMonth}</span>
                </p>
              </div>

              {/* Filtros */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o programa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="Activa">Activa</option>
                    <option value="Activa en Riesgo">En Riesgo</option>
                    <option value="Activa sin CxC">Sin CxC</option>
                  </select>

                  <div></div>

                  <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </button>
                </div>
              </div>

              {/* Tabla de estudiantes */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estudiante
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Programa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Campus
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modalidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo Matrícula
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Pagado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.programLevel}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.program}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Semestral
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.campus}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.modality}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEnrollmentTypeColor(student.enrollmentType)}`}>
                              {getEnrollmentTypeLabel(student.enrollmentType)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(student.status)}`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${student.totalPaid.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                          <span className="font-medium">{Math.min(startIndex + recordsPerPage, filteredStudents.length)}</span> de{' '}
                          <span className="font-medium">{filteredStudents.length}</span> resultados
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === pageNum
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'proyecciones' && (
            <div>
              {/* Barra desplegable de proyecciones guardadas */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 mb-6">
                <button
                  onClick={() => setShowSavedProjections(!showSavedProjections)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors rounded-xl"
                >
                  <div className="flex items-center">
                    <Calculator className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-medium text-gray-900">
                      Proyecciones Guardadas ({savedProjections.length})
                    </span>
                    {selectedProjection && (
                      <span className="ml-2 text-sm text-purple-600">
                        - {selectedProjection.name}
                      </span>
                    )}
                  </div>
                  {showSavedProjections ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {showSavedProjections && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedProjections.map((projection) => (
                        <div 
                          key={projection.id}
                          onClick={() => {
                            setSelectedProjection(projection);
                            setShowSavedProjections(false);
                          }}
                          className={`p-4 cursor-pointer transition-colors rounded-lg border-2 ${
                            selectedProjection?.id === projection.id 
                              ? 'bg-blue-50 border-blue-300' 
                              : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{projection.name}</h4>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600 mb-3">
                            <div className="flex justify-between">
                              <span>Retención Interciclo:</span>
                              <span className="font-medium">{projection.intercycleRetention}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Retención Intraciclo:</span>
                              <span className="font-medium">{projection.intracycleRetention}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Desc. Colegiaturas:</span>
                              <span className="font-medium">{projection.tuitionDiscount}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Desc. Inscripciones:</span>
                              <span className="font-medium">{projection.enrollmentDiscount}%</span>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              {projection.campus === 'all' ? 'Todos los campus' : projection.campus}
                            </p>
                            <p className="text-xs text-gray-500">
                              Creado: {new Date(projection.createdAt).toLocaleDateString('es-MX')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Panel principal de configuración */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calculator className="w-5 h-5 text-blue-600 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Configurar Proyección</h2>
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
                          onClick={() => setShowNewProjection(!showNewProjection)}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Nueva Proyección
                        </button>
                      </div>
                    </div>
                  </div>

                  {showNewProjection && (
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Proyección</label>
                          <input
                            type="text"
                            value={newProjection.name || ''}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Proyección Q1 2026"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                          <select
                            value={newProjection.campus || 'all'}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, campus: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">Todos los Campus</option>
                            <option value="Ciudad de México">Ciudad de México</option>
                            <option value="Guadalajara">Guadalajara</option>
                            <option value="Monterrey">Monterrey</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                          <input
                            type="date"
                            value={newProjection.startDate || ''}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                          <input
                            type="date"
                            value={newProjection.endDate || ''}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">% Retención Interciclo</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={newProjection.intercycleRetention || 85}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, intercycleRetention: parseFloat(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="85.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">% Retención Intraciclo</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={newProjection.intracycleRetention || 92}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, intracycleRetention: parseFloat(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="92.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">% Descuento en Colegiaturas</label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.1"
                            value={newProjection.tuitionDiscount || 10}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, tuitionDiscount: parseFloat(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="10.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">% Descuento en Inscripciones</label>
                          <input
                            type="number"
                            min="0"
                            max="50"
                            step="0.1"
                            value={newProjection.enrollmentDiscount || 15}
                            onChange={(e) => setNewProjection(prev => ({ ...prev, enrollmentDiscount: parseFloat(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="15.0"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => setShowNewProjection(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Save className="w-4 h-4 mr-2 inline" />
                          Guardar Proyección
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Resultados de proyección */}
                  {(selectedProjection || showNewProjection) && (
                    <div className="p-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Resultados: {selectedProjection?.name || 'Nueva Proyección'}
                        </h3>
                        
                        {/* Tabs por mes */}
                        <div className="flex space-x-2 overflow-x-auto mb-6">
                          {futureMonths.slice(0, 12).map((month) => (
                            <button
                              key={month}
                              onClick={() => setProjectionMonth(month)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                projectionMonth === month
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                              }`}
                            >
                              {month}
                            </button>
                          ))}
                        </div>

                        {/* Resultados del mes seleccionado */}
                        {(() => {
                          const config = selectedProjection || newProjection;
                          const projections = calculateProjections(config);
                          const monthData = projections.find(p => p.month === projectionMonth) || projections[0];
                          
                          return (
                            <div>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                  <h4 className="text-2xl font-bold text-blue-900">{monthData.students}</h4>
                                  <p className="text-sm text-blue-700">Estudiantes Proyectados</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                  <h4 className="text-2xl font-bold text-green-900">{monthData.tuitionCount}</h4>
                                  <p className="text-sm text-green-700">Colegiaturas</p>
                                  <p className="text-xs text-green-600">${monthData.tuitionRevenue.toLocaleString()}</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                  <h4 className="text-2xl font-bold text-purple-900">{monthData.enrollmentCount}</h4>
                                  <p className="text-sm text-purple-700">Inscripciones</p>
                                  <p className="text-xs text-purple-600">${monthData.enrollmentRevenue.toLocaleString()}</p>
                                </div>
                                <div className="bg-orange-50 rounded-lg p-4 text-center">
                                  <h4 className="text-2xl font-bold text-orange-900">${(monthData.totalRevenue / 1000000).toFixed(1)}M</h4>
                                  <p className="text-sm text-orange-700">Ingreso Total</p>
                                </div>
                              </div>

                              {/* Desglose por categorías */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Desglose por Categorías</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-600 mb-2">Por Campus:</p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span>Ciudad de México</span>
                                        <span className="font-medium">{Math.round(monthData.students * 0.4)} estudiantes</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Guadalajara</span>
                                        <span className="font-medium">{Math.round(monthData.students * 0.35)} estudiantes</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Monterrey</span>
                                        <span className="font-medium">{Math.round(monthData.students * 0.25)} estudiantes</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600 mb-2">Por Modalidad:</p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span>Presencial</span>
                                        <span className="font-medium">{Math.round(monthData.students * 0.5)} estudiantes</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Online</span>
                                        <span className="font-medium">{Math.round(monthData.students * 0.3)} estudiantes</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>Sabatina</span>
                                        <span className="font-medium">{Math.round(monthData.students * 0.2)} estudiantes</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Suma global */}
                              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">Resumen Global - {projectionMonth}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-900">{monthData.students}</p>
                                    <p className="text-sm text-blue-700">Total Estudiantes</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-900">{monthData.tuitionCount + monthData.enrollmentCount}</p>
                                    <p className="text-sm text-blue-700">Total Transacciones</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-900">${(monthData.totalRevenue / 1000000).toFixed(2)}M</p>
                                    <p className="text-sm text-blue-700">Ingreso Total Proyectado</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricalEnrollment;