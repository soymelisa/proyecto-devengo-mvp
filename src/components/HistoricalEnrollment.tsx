import React, { useState } from 'react';
import { Users, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, ChevronLeft, ChevronRight, Download, Search, Filter, Calculator, Settings, Save, Plus, Eye, ChevronDown, ChevronUp, DollarSign, Calendar } from 'lucide-react';
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
  });

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
            )
            }
            <div>
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
  )
}