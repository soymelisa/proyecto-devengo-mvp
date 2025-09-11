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
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [activeResultsTab, setActiveResultsTab] = useState('summary');
  
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
  // Datos de ejemplo para proyección anual 2026
  const projectionResults2026 = {
    summary: {
      totalStudents: 2847,
      niStudents: 854,
      riStudents: 1993,
      totalGrossRevenue: 156800000,
      totalDiscounts: 18400000,
      totalNetRevenue: 138400000
    },
    monthlyData: [
      {
        month: 'Enero',
        students: { ni: 71, ri: 166, total: 237 },
        inscriptions: {
          price: 12500,
          discountPercent: 8,
          discountAmount: 237000,
          netAmount: 2725500
        },
        tuitions: {
          price: 8500,
          discountPercent: 12,
          discountAmount: 241560,
          netAmount: 1773440
        },
        totals: {
          grossRevenue: 4777500,
          totalDiscount: 478560,
          netRevenue: 4298940
        }
      },
      {
        month: 'Febrero',
        students: { ni: 45, ri: 192, total: 237 },
        inscriptions: {
          price: 12500,
          discountPercent: 8,
          discountAmount: 237000,
          netAmount: 2725500
        },
        tuitions: {
          price: 8500,
          discountPercent: 12,
          discountAmount: 241560,
          netAmount: 1773440
        },
        totals: {
          grossRevenue: 4777500,
          totalDiscount: 478560,
          netRevenue: 4298940
        }
      },
      {
        month: 'Marzo',
        students: { ni: 89, ri: 148, total: 237 },
        inscriptions: {
          price: 12500,
          discountPercent: 8,
          discountAmount: 237000,
          netAmount: 2725500
        },
        tuitions: {
          price: 8500,
          discountPercent: 12,
          discountAmount: 241560,
          netAmount: 1773440
        },
        totals: {
          grossRevenue: 4777500,
          totalDiscount: 478560,
          netRevenue: 4298940
        }
      },
      {
        month: 'Abril',
        students: { ni: 67, ri: 170, total: 237 },
        inscriptions: {
          price: 12500,
          discountPercent: 8,
          discountAmount: 237000,
          netAmount: 2725500
        },
        tuitions: {
          price: 8500,
          discountPercent: 12,
          discountAmount: 241560,
          netAmount: 1773440
        },
        totals: {
          grossRevenue: 4777500,
          totalDiscount: 478560,
          netRevenue: 4298940
        }
      },
      {
        month: 'Mayo',
        students: { ni: 52, ri: 185, total: 237 },
        inscriptions: {
          price: 12500,
          discountPercent: 8,
          discountAmount: 237000,
          netAmount: 2725500
        },
        tuitions: {
          price: 8500,
          discountPercent: 12,
          discountAmount: 241560,
          netAmount: 1773440
        },
        totals: {
          grossRevenue: 4777500,
          totalDiscount: 478560,
          netRevenue: 4298940
        }
      },
      {
        month: 'Junio',
        students: { ni: 78, ri: 159, total: 237 },
        inscriptions: {
          price: 12500,
          discountPercent: 8,
          discountAmount: 237000,
          netAmount: 2725500
        },
        tuitions: {
          price: 8500,
          discountPercent: 12,
          discountAmount: 241560,
          netAmount: 1773440
        },
        totals: {
          grossRevenue: 4777500,
          totalDiscount: 478560,
          netRevenue: 4298940
        }
      }
    ]
  };

  });

  // Función para calcular resultados detallados
  const calculateDetailedResults = (params: any) => {
    const baseEnrollment = params.activeEnrollment || 150;
    const intercycleRate = params.intercycleRetention / 100;
    const intracycleRate = params.intracycleRetention / 100;
    const tuitionDiscountRate = params.tuitionDiscount / 100;
    const enrollmentDiscountRate = params.enrollmentDiscount / 100;
    
    // Cálculo de estudiantes
    const totalRetained = Math.round(baseEnrollment * intercycleRate * intracycleRate);
    const newStudents = Math.round(totalRetained * 0.3); // 30% nuevos ingresos
    const returningStudents = totalRetained - newStudents; // RI (incluye RA)
    
    // Precios base
    const baseEnrollmentPrice = 12500;
    const baseTuitionPrice = 8500;
    
    // Cálculos de inscripciones
    const enrollmentRevenue = totalRetained * baseEnrollmentPrice;
    const enrollmentDiscountAmount = enrollmentRevenue * enrollmentDiscountRate;
    const netEnrollmentRevenue = enrollmentRevenue - enrollmentDiscountAmount;
    
    // Cálculos de colegiaturas (asumiendo 5 mensualidades por período)
    const tuitionRevenue = totalRetained * baseTuitionPrice * 5;
    const tuitionDiscountAmount = tuitionRevenue * tuitionDiscountRate;
    const netTuitionRevenue = tuitionRevenue - tuitionDiscountAmount;
    
    // Totales
    const totalRevenue = enrollmentRevenue + tuitionRevenue;
    const totalDiscount = enrollmentDiscountAmount + tuitionDiscountAmount;
    const totalNetRevenue = netEnrollmentRevenue + netTuitionRevenue;
    
    return {
      students: {
        total: totalRetained,
        newStudents: newStudents,
        returningStudents: returningStudents
      },
      enrollment: {
        price: baseEnrollmentPrice,
        discountPercent: params.enrollmentDiscount,
        revenue: enrollmentRevenue,
        discountAmount: enrollmentDiscountAmount,
        netRevenue: netEnrollmentRevenue
      },
      tuition: {
        price: baseTuitionPrice,
        discountPercent: params.tuitionDiscount,
        revenue: tuitionRevenue,
        discountAmount: tuitionDiscountAmount,
        netRevenue: netTuitionRevenue
      },
      totals: {
        totalRevenue,
        totalDiscount,
        totalNetRevenue
      }
    };
  };

  const detailedResults = calculateDetailedResults(newProjection);

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

                {/* Resultados detallados */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Resultados de Proyección</h3>
                    <button
                      onClick={() => setShowDetailedResults(!showDetailedResults)}
                      className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {showDetailedResults ? 'Ocultar Detalle' : 'Ver Detalle Completo'}
                      <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showDetailedResults ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {showDetailedResults && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      {/* Resumen de estudiantes */}
                      <div className="mb-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-3">Desglose de Estudiantes</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-600">Total Estudiantes</p>
                            <p className="text-2xl font-bold text-blue-600">{detailedResults.students.total}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-600">NI (Nuevo Ingreso)</p>
                            <p className="text-2xl font-bold text-green-600">{detailedResults.students.newStudents}</p>
                            <p className="text-xs text-gray-500">{((detailedResults.students.newStudents / detailedResults.students.total) * 100).toFixed(1)}%</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-600">RI (Reingreso + RA)</p>
                            <p className="text-2xl font-bold text-purple-600">{detailedResults.students.returningStudents}</p>
                            <p className="text-xs text-gray-500">{((detailedResults.students.returningStudents / detailedResults.students.total) * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Tabla detallada de ingresos */}
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
                          <h4 className="text-md font-semibold text-gray-800">Desglose Financiero Detallado</h4>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Base</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% Descuento</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">$ Ingreso Bruto</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">$ Descuento</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">$ Ingreso Neto</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {/* Inscripciones */}
                              <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Inscripciones</div>
                                      <div className="text-xs text-gray-500">{detailedResults.students.total} estudiantes</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                  ${detailedResults.enrollment.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-orange-600 font-medium">
                                  {detailedResults.enrollment.discountPercent}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                  ${detailedResults.enrollment.revenue.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">
                                  -${detailedResults.enrollment.discountAmount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                                  ${detailedResults.enrollment.netRevenue.toLocaleString()}
                                </td>
                              </tr>
                              
                              {/* Colegiaturas */}
                              <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">Colegiaturas</div>
                                      <div className="text-xs text-gray-500">{detailedResults.students.total} × 5 meses</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                  ${detailedResults.tuition.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-orange-600 font-medium">
                                  {detailedResults.tuition.discountPercent}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                  ${detailedResults.tuition.revenue.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">
                                  -${detailedResults.tuition.discountAmount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                                  ${detailedResults.tuition.netRevenue.toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                            
                            {/* Totales */}
                            <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                  TOTALES
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                  -
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                  -
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-blue-600">
                                  ${detailedResults.totals.totalRevenue.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-red-600">
                                  -${detailedResults.totals.totalDiscount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-700 text-lg">
                                  ${detailedResults.totals.totalNetRevenue.toLocaleString()}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      {/* Resumen ejecutivo */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-blue-700 mb-1">Ingreso Total Bruto</h5>
                          <p className="text-xl font-bold text-blue-900">${detailedResults.totals.totalRevenue.toLocaleString()}</p>
                          <p className="text-xs text-blue-600 mt-1">Antes de descuentos</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-red-700 mb-1">Descuento Total</h5>
                          <p className="text-xl font-bold text-red-900">${detailedResults.totals.totalDiscount.toLocaleString()}</p>
                          <p className="text-xs text-red-600 mt-1">
                            {((detailedResults.totals.totalDiscount / detailedResults.totals.totalRevenue) * 100).toFixed(1)}% del ingreso bruto
                          </p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-green-700 mb-1">Ingreso Neto Final</h5>
                          <p className="text-xl font-bold text-green-900">${detailedResults.totals.totalNetRevenue.toLocaleString()}</p>
                          <p className="text-xs text-green-600 mt-1">Después de descuentos</p>
                        </div>
                      </div>
                    </div>
                  )}
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

        {/* Sección de Resultados - Proyección Anual 2026 */}
        {activeTab === 'projections' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Resultados - Proyección Anual 2026</h2>
                  <p className="text-sm text-gray-600 mt-1">Desglose detallado de ingresos y estudiantes proyectados</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveResultsTab('summary')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeResultsTab === 'summary'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Resumen
                  </button>
                  <button
                    onClick={() => setActiveResultsTab('monthly')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeResultsTab === 'monthly'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Detalle Mes a Mes
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {activeResultsTab === 'summary' && (
                <div>
                  {/* Resumen Ejecutivo */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-blue-700 mb-2">Total Estudiantes</h3>
                      <p className="text-3xl font-bold text-blue-900">{projectionResults2026.summary.totalStudents.toLocaleString()}</p>
                      <div className="mt-3 text-sm text-blue-600">
                        <p>NI: {projectionResults2026.summary.niStudents.toLocaleString()} ({Math.round((projectionResults2026.summary.niStudents / projectionResults2026.summary.totalStudents) * 100)}%)</p>
                        <p>RI: {projectionResults2026.summary.riStudents.toLocaleString()} ({Math.round((projectionResults2026.summary.riStudents / projectionResults2026.summary.totalStudents) * 100)}%)</p>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-red-700 mb-2">Descuentos Totales</h3>
                      <p className="text-3xl font-bold text-red-900">${(projectionResults2026.summary.totalDiscounts / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-red-600 mt-1">
                        {Math.round((projectionResults2026.summary.totalDiscounts / projectionResults2026.summary.totalGrossRevenue) * 100)}% del ingreso bruto
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-green-700 mb-2">Ingreso Neto</h3>
                      <p className="text-3xl font-bold text-green-900">${(projectionResults2026.summary.totalNetRevenue / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-green-600 mt-1">
                        Después de descuentos
                      </p>
                    </div>
                  </div>

                  {/* Tabla Resumen Anual */}
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Concepto
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Cantidad/Porcentaje
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Monto
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="bg-blue-50">
                          <td className="px-6 py-4 text-sm font-medium text-blue-900" colSpan={3}>
                            ESTUDIANTES
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">NI (Nuevo Ingreso)</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">{projectionResults2026.summary.niStudents.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">-</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">RI (Reingreso)</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">{projectionResults2026.summary.riStudents.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">-</td>
                        </tr>
                        <tr className="bg-orange-50">
                          <td className="px-6 py-4 text-sm font-medium text-orange-900" colSpan={3}>
                            INGRESOS BRUTOS
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">Inscripciones</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">-</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">${(projectionResults2026.summary.totalGrossRevenue * 0.4 / 1000000).toFixed(1)}M</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">Colegiaturas</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">-</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">${(projectionResults2026.summary.totalGrossRevenue * 0.6 / 1000000).toFixed(1)}M</td>
                        </tr>
                        <tr className="bg-red-50">
                          <td className="px-6 py-4 text-sm font-medium text-red-900" colSpan={3}>
                            DESCUENTOS
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">Descuento Inscripciones</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">8%</td>
                          <td className="px-6 py-4 text-sm text-right text-red-600">${(projectionResults2026.summary.totalDiscounts * 0.4 / 1000000).toFixed(1)}M</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">Descuento Colegiaturas</td>
                          <td className="px-6 py-4 text-sm text-right text-gray-900">12%</td>
                          <td className="px-6 py-4 text-sm text-right text-red-600">${(projectionResults2026.summary.totalDiscounts * 0.6 / 1000000).toFixed(1)}M</td>
                        </tr>
                        <tr className="bg-green-50 font-medium">
                          <td className="px-6 py-4 text-sm text-green-900">INGRESO NETO TOTAL</td>
                          <td className="px-6 py-4 text-sm text-right text-green-900">-</td>
                          <td className="px-6 py-4 text-sm text-right text-green-900">${(projectionResults2026.summary.totalNetRevenue / 1000000).toFixed(1)}M</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeResultsTab === 'monthly' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Desglose Mes a Mes - 2026</h3>
                  
                  <div className="space-y-8">
                    {projectionResults2026.monthlyData.map((monthData, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                          <h4 className="text-md font-semibold text-gray-900">{monthData.month} 2026</h4>
                        </div>
                        
                        <div className="p-6">
                          {/* Resumen del mes */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h5 className="text-xs font-medium text-blue-700 mb-1">Total Estudiantes</h5>
                              <p className="text-xl font-bold text-blue-900">{monthData.students.total}</p>
                              <div className="text-xs text-blue-600 mt-1">
                                <p>NI: {monthData.students.ni} | RI: {monthData.students.ri}</p>
                              </div>
                            </div>
                            
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <h5 className="text-xs font-medium text-orange-700 mb-1">Ingreso Bruto</h5>
                              <p className="text-xl font-bold text-orange-900">${(monthData.totals.grossRevenue / 1000000).toFixed(2)}M</p>
                            </div>
                            
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <h5 className="text-xs font-medium text-red-700 mb-1">Descuentos</h5>
                              <p className="text-xl font-bold text-red-900">${(monthData.totals.totalDiscount / 1000).toFixed(0)}K</p>
                            </div>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h5 className="text-xs font-medium text-green-700 mb-1">Ingreso Neto</h5>
                              <p className="text-xl font-bold text-green-900">${(monthData.totals.netRevenue / 1000000).toFixed(2)}M</p>
                            </div>
                          </div>
        </div>
                          {/* Tabla detallada del mes */}
                          <div className="overflow-x-auto">
                            <table className="w-full border border-gray-200 rounded-lg">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Concepto
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Precio Base
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    % Descuento
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    $ Descuento
                                  </th>
                                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    $ Neto
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="bg-blue-50">
                                  <td className="px-4 py-3 text-sm font-medium text-blue-900" colSpan={5}>
                                    DESGLOSE DE ESTUDIANTES
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 text-sm text-gray-900">NI (Nuevo Ingreso)</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">{monthData.students.ni} estudiantes</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">-</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">-</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">-</td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 text-sm text-gray-900">RI (Reingreso)</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">{monthData.students.ri} estudiantes</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">-</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">-</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">-</td>
                                </tr>
                                
                                <tr className="bg-purple-50">
                                  <td className="px-4 py-3 text-sm font-medium text-purple-900" colSpan={5}>
                                    INSCRIPCIONES
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 text-sm text-gray-900">Inscripciones</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">${monthData.inscriptions.price.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">{monthData.inscriptions.discountPercent}%</td>
                                  <td className="px-4 py-3 text-sm text-right text-red-600">${monthData.inscriptions.discountAmount.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-sm text-right text-green-600">${monthData.inscriptions.netAmount.toLocaleString()}</td>
                                </tr>
                                
                                <tr className="bg-yellow-50">
                                  <td className="px-4 py-3 text-sm font-medium text-yellow-900" colSpan={5}>
                                    COLEGIATURAS
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-4 py-3 text-sm text-gray-900">Colegiaturas</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">${monthData.tuitions.price.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">{monthData.tuitions.discountPercent}%</td>
                                  <td className="px-4 py-3 text-sm text-right text-red-600">${monthData.tuitions.discountAmount.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-sm text-right text-green-600">${monthData.tuitions.netAmount.toLocaleString()}</td>
                                </tr>
                                
                                <tr className="bg-gray-100 font-medium">
                                  <td className="px-4 py-3 text-sm text-gray-900">TOTALES DEL MES</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">${monthData.totals.grossRevenue.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-sm text-right text-gray-900">-</td>
                                  <td className="px-4 py-3 text-sm text-right text-red-600">${monthData.totals.totalDiscount.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-sm text-right text-green-600">${monthData.totals.netRevenue.toLocaleString()}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalEnrollment;