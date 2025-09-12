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

  const recordsPerPage = 50;


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
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'resumen' && (
            <div>
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                      <p className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Activos</p>
                      <p className="text-2xl font-bold text-gray-900">{activeStudents.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">En Riesgo</p>
                      <p className="text-2xl font-bold text-gray-900">{riskStudents.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <XCircle className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sin CxC</p>
                      <p className="text-2xl font-bold text-gray-900">{noCxCStudents.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <TrendingDown className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bajas</p>
                      <p className="text-2xl font-bold text-gray-900">{dropouts.toLocaleString()}</p>
                    </div>
                  </div>
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