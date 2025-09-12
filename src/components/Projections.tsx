import React, { useState } from 'react';
import { Calculator, TrendingUp, Settings, Save, RotateCcw, Calendar, AlertTriangle, Plus, Eye, X } from 'lucide-react';

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

interface ProjectionParams {
  activeEnrollment: number;
  retentionRate: number;
  reinscriptionRate: number;
  discountRate: number;
  basePrice: number;
  selectedMonth: string;
  selectedModality: 'presencial' | 'online' | 'sabatina';
}

const Projections: React.FC = () => {
  const [currentParams, setCurrentParams] = useState<ProjectionParams>({
    activeEnrollment: 150,
    retentionRate: 85,
    reinscriptionRate: 90,
    discountRate: 10,
    basePrice: 12500,
    selectedMonth: '2025-02',
    selectedModality: 'presencial'
  });

  const [originalParams] = useState<ProjectionParams>({ 
    ...currentParams,
    selectedMonth: '2025-02',
    selectedModality: 'presencial'
  });
  const [selectedCampus, setSelectedCampus] = useState('Ciudad de México');
  const [selectedProgram, setSelectedProgram] = useState('Ingeniería en Sistemas');
  const [selectedProjection, setSelectedProjection] = useState<ProjectionConfig | null>(null);
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

  // Función para calcular días devengables por mes según modalidad
  const calculateAccrualDays = (month: string, modality: 'presencial' | 'online' | 'sabatina') => {
    const [year, monthNum] = month.split('-').map(Number);
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    
    // Días festivos fijos para 2025 (simplificado)
    const holidays = {
      '2025-01': [1], // Año Nuevo
      '2025-02': [3], // Día de la Constitución
      '2025-03': [17], // Natalicio de Benito Juárez
      '2025-04': [17, 18], // Semana Santa
      '2025-05': [1], // Día del Trabajo
      '2025-09': [16], // Independencia
      '2025-11': [17], // Revolución
      '2025-12': [25] // Navidad
    };
    
    const monthHolidays = holidays[month as keyof typeof holidays] || [];
    let accrualDays = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum - 1, day);
      const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
      const isHoliday = monthHolidays.includes(day);
      
      if (modality === 'presencial') {
        // Lunes a Viernes, no feriados
        if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isHoliday) {
          accrualDays++;
        }
      } else if (modality === 'online') {
        // Todos los días excepto feriados
        if (!isHoliday) {
          accrualDays++;
        }
      } else if (modality === 'sabatina') {
        // Solo sábados no feriados
        if (dayOfWeek === 6 && !isHoliday) {
          accrualDays++;
        }
      }
    }
    
    return {
      accrualDays,
      totalDays: daysInMonth,
      accrualPercentage: (accrualDays / daysInMonth) * 100
    };
  };
  const calculateProjections = (params: ProjectionParams) => {
    const retainedStudents = Math.round(params.activeEnrollment * (params.retentionRate / 100));
    const reinscribedStudents = Math.round(retainedStudents * (params.reinscriptionRate / 100));
    const discountAmount = params.basePrice * (params.discountRate / 100);
    const effectivePrice = params.basePrice - discountAmount;
    
    // Calcular días devengables para el mes seleccionado
    const accrualData = calculateAccrualDays(params.selectedMonth, params.selectedModality);
    const accrualFactor = accrualData.accrualPercentage / 100;
    
    // Aplicar factor de devengo a los ingresos
    const monthlyRevenue = reinscribedStudents * effectivePrice;
    const accruedRevenue = monthlyRevenue * accrualFactor;
    
    return {
      retainedStudents,
      reinscribedStudents,
      effectivePrice,
      monthlyRevenue,
      accruedRevenue,
      discountImpact: reinscribedStudents * discountAmount,
      accrualData
    };
  };

  const results = calculateProjections(currentParams);
  const originalResults = calculateProjections(originalParams);
  const variance = results.accruedRevenue - originalResults.accruedRevenue;

  const handleParamChange = (field: keyof ProjectionParams, value: number) => {
    setCurrentParams(prev => ({ 
      ...prev, 
      [field]: field === 'selectedMonth' || field === 'selectedModality' ? value : Number(value)
    }));
  };

  const resetParams = () => {
    setCurrentParams({ ...originalParams });
  };

  // Generar opciones de meses
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = -3; i <= 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Proyecciones Financieras</h1>
            <p className="text-gray-600 mt-2">Cálculo automático con días devengables y análisis de escenarios</p>
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
              onClick={() => setShowNewProjection(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Proyección
            </button>
            <button 
              onClick={() => setShowSavedProjections(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Proyecciones Guardadas
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de configuración */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Parámetros</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
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
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option>Ingeniería en Sistemas</option>
                  <option>Administración de Empresas</option>
                  <option>Derecho</option>
                </select>
              </div>

              {/* Nuevos campos para cálculo de devengo */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                  Configuración de Devengo
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mes de Proyección</label>
                    <select
                      value={currentParams.selectedMonth}
                      onChange={(e) => handleParamChange('selectedMonth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {monthOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
                    <select
                      value={currentParams.selectedModality}
                      onChange={(e) => handleParamChange('selectedModality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="presencial">Presencial</option>
                      <option value="online">Online</option>
                      <option value="sabatina">Sabatina</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matrícula Activa: {currentParams.activeEnrollment}
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={currentParams.activeEnrollment}
                  onChange={(e) => handleParamChange('activeEnrollment', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  % Retención: {currentParams.retentionRate}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={currentParams.retentionRate}
                  onChange={(e) => handleParamChange('retentionRate', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  % Reinscripción: {currentParams.reinscriptionRate}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={currentParams.reinscriptionRate}
                  onChange={(e) => handleParamChange('reinscriptionRate', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  % Descuento: {currentParams.discountRate}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={currentParams.discountRate}
                  onChange={(e) => handleParamChange('discountRate', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio Base</label>
                <input
                  type="number"
                  value={currentParams.basePrice}
                  onChange={(e) => handleParamChange('basePrice', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <button 
                onClick={resetParams}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
              <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2">
          {/* Panel de días devengables */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Análisis de Días Devengables</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-sm font-medium text-purple-700 mb-1">Días Devengables</h3>
                <p className="text-2xl font-bold text-purple-900">{results.accrualData.accrualDays}</p>
                <p className="text-sm text-purple-600">
                  de {results.accrualData.totalDays} días del mes
                </p>
              </div>
              
              <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="text-sm font-medium text-indigo-700 mb-1">% de Devengo</h3>
                <p className="text-2xl font-bold text-indigo-900">
                  {results.accrualData.accrualPercentage.toFixed(1)}%
                </p>
                <p className="text-sm text-indigo-600">
                  Modalidad: {currentParams.selectedModality}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Mes Seleccionado</h3>
                <p className="text-lg font-bold text-gray-900">
                  {monthOptions.find(m => m.value === currentParams.selectedMonth)?.label}
                </p>
                <p className="text-sm text-gray-600">
                  {currentParams.selectedMonth}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Reglas de Devengo:</strong> 
                {currentParams.selectedModality === 'presencial' && ' Lunes a Viernes (días hábiles)'}
                {currentParams.selectedModality === 'online' && ' Todos los días excepto festivos'}
                {currentParams.selectedModality === 'sabatina' && ' Solo sábados no festivos'}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Calculator className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Resultados de Proyección</h2>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-700 mb-1">Estudiantes Retenidos</h3>
                <p className="text-2xl font-bold text-blue-900">{results.retainedStudents}</p>
                <p className="text-sm text-blue-600">
                  {currentParams.retentionRate}% de {currentParams.activeEnrollment}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-700 mb-1">Estudiantes Reinscritos</h3>
                <p className="text-2xl font-bold text-green-900">{results.reinscribedStudents}</p>
                <p className="text-sm text-green-600">
                  {currentParams.reinscriptionRate}% de retenidos
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-sm font-medium text-purple-700 mb-1">Precio Efectivo</h3>
                <p className="text-2xl font-bold text-purple-900">${results.effectivePrice.toLocaleString()}</p>
                <p className="text-sm text-purple-600">
                  Después de {currentParams.discountRate}% descuento
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-sm font-medium text-orange-700 mb-1">Ingreso Devengado</h3>
                <p className="text-2xl font-bold text-orange-900">${results.accruedRevenue.toLocaleString()}</p>
                <p className="text-sm text-orange-600">
                  {results.accrualData.accrualPercentage.toFixed(1)}% de ${results.monthlyRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Comparación mensual vs devengado */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Comparación de Ingresos</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Ingreso Mensual Completo</p>
                  <p className="text-lg font-bold text-gray-900">${results.monthlyRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-sm text-purple-600">Ingreso Devengado</p>
                  <p className="text-lg font-bold text-purple-900">${results.accruedRevenue.toLocaleString()}</p>
                  <p className={`text-sm ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {variance >= 0 ? '+' : ''}${variance.toLocaleString()} vs. original
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Impacto de Descuentos</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  Pérdida por descuentos: <span className="font-medium">${results.discountImpact.toLocaleString()}</span>
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {((results.discountImpact / (results.monthlyRevenue + results.discountImpact)) * 100).toFixed(1)}% 
                  del ingreso potencial
                </p>
              </div>
            </div>
          </div>

          {/* Comparación histórica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Comparación vs. Versiones Anteriores</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">V2024.01 (Actual)</p>
                  <p className="text-sm text-gray-600">15 Enero 2024</p>
                </div>
                <p className="font-semibold text-gray-900">${results.accruedRevenue.toLocaleString()}</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">V2023.12</p>
                  <p className="text-sm text-gray-600">15 Diciembre 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$1,435,500</p>
                  <p className="text-sm text-green-600">+8.2% vs actual</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">V2023.11</p>
                  <p className="text-sm text-gray-600">15 Noviembre 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$1,382,200</p>
                  <p className="text-sm text-green-600">+12.5% vs actual</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gestión de Proyecciones Guardadas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Proyecciones Guardadas</h2>
            <button 
              onClick={() => setShowDetailedResults(!showDetailedResults)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {showDetailedResults ? 'Ocultar' : 'Ver'} Resultados Detallados
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedProjections.map((projection) => (
              <div key={projection.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{projection.name}</h3>
                  <button 
                    onClick={() => setSelectedProjection(projection)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Campus: {projection.campus}</p>
                  <p>Programa: {projection.program}</p>
                  <p>Período: {projection.startDate} - {projection.endDate}</p>
                  <p>Creado: {new Date(projection.createdAt).toLocaleDateString('es-MX')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resultados Detallados */}
        {showDetailedResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Resultados Detallados</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveResultsTab('summary')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeResultsTab === 'summary'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Resumen
                </button>
                <button
                  onClick={() => setActiveResultsTab('monthly')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeResultsTab === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Mensual
                </button>
              </div>
            </div>

            {activeResultsTab === 'summary' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-700 mb-2">Estudiantes Proyectados</h3>
                  <p className="text-2xl font-bold text-blue-900">{detailedResults.students.total}</p>
                  <div className="text-xs text-blue-600 mt-2 space-y-1">
                    <p>NI: {detailedResults.students.newStudents}</p>
                    <p>RI: {detailedResults.students.returningStudents}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-700 mb-2">Ingresos Netos</h3>
                  <p className="text-2xl font-bold text-green-900">
                    ${(detailedResults.totals.totalNetRevenue / 1000000).toFixed(1)}M
                  </p>
                  <div className="text-xs text-green-600 mt-2 space-y-1">
                    <p>Inscripciones: ${(detailedResults.enrollment.netRevenue / 1000000).toFixed(1)}M</p>
                    <p>Colegiaturas: ${(detailedResults.tuition.netRevenue / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-700 mb-2">Descuentos Totales</h3>
                  <p className="text-2xl font-bold text-red-900">
                    ${(detailedResults.totals.totalDiscount / 1000000).toFixed(1)}M
                  </p>
                  <div className="text-xs text-red-600 mt-2 space-y-1">
                    <p>Inscripciones: {detailedResults.enrollment.discountPercent}%</p>
                    <p>Colegiaturas: {detailedResults.tuition.discountPercent}%</p>
                  </div>
                </div>
              </div>
            )}

            {activeResultsTab === 'monthly' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiantes</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscripciones</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Colegiaturas</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Neto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.from({ length: 6 }, (_, i) => {
                      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{monthNames[i]}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{detailedResults.students.total}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            ${(detailedResults.enrollment.netRevenue / 1000).toLocaleString()}K
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            ${(detailedResults.tuition.netRevenue / 1000).toLocaleString()}K
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">
                            ${((detailedResults.totals.totalNetRevenue / 6) / 1000).toLocaleString()}K
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para nueva proyección */}
      {showNewProjection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Nueva Proyección</h3>
                <button 
                  onClick={() => setShowNewProjection(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={newProjection.name}
                    onChange={(e) => setNewProjection(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Nombre de la proyección"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                  <select
                    value={newProjection.campus}
                    onChange={(e) => setNewProjection(prev => ({ ...prev, campus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todos los Campus</option>
                    <option value="Ciudad de México">Ciudad de México</option>
                    <option value="Guadalajara">Guadalajara</option>
                    <option value="Monterrey">Monterrey</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewProjection(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  console.log('Crear proyección:', newProjection);
                  setShowNewProjection(false);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Crear Proyección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para proyecciones guardadas */}
      {showSavedProjections && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Proyecciones Guardadas</h3>
                <button 
                  onClick={() => setShowSavedProjections(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {savedProjections.map((projection) => (
                  <div key={projection.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{projection.name}</h4>
                        <p className="text-sm text-gray-600">
                          {projection.campus} - {projection.program}
                        </p>
                        <p className="text-xs text-gray-500">
                          Creado: {new Date(projection.createdAt).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedProjection(projection)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Ver Detalle
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle de proyección */}
      {selectedProjection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedProjection.name}</h3>
                <button 
                  onClick={() => setSelectedProjection(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
                  <p className="text-sm text-gray-900">{selectedProjection.campus}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                  <p className="text-sm text-gray-900">{selectedProjection.program}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                  <p className="text-sm text-gray-900">{selectedProjection.modality}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <p className="text-sm text-gray-900">{selectedProjection.brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retención Interciclo</label>
                  <p className="text-sm text-gray-900">{selectedProjection.intercycleRetention}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retención Intraciclo</label>
                  <p className="text-sm text-gray-900">{selectedProjection.intracycleRetention}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuento Colegiaturas</label>
                  <p className="text-sm text-gray-900">{selectedProjection.tuitionDiscount}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuento Inscripciones</label>
                  <p className="text-sm text-gray-900">{selectedProjection.enrollmentDiscount}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projections;