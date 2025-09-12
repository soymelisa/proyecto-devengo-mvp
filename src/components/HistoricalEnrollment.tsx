import React, { useState } from 'react';
import { 
  History, 
  TrendingUp, 
  Calculator, 
  Calendar, 
  AlertTriangle, 
  Users, 
  DollarSign,
  Settings,
  Save,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { mockActiveStudents, mockEnrollmentProjections, mockMonthlyEnrollmentCuts } from '../data/mockData';

interface ProjectionParams {
  activeEnrollment: number;
  retentionRate: number;
  reinscriptionRate: number;
  discountRate: number;
  basePrice: number;
  selectedMonth: string;
  selectedModality: 'presencial' | 'online' | 'sabatina';
}

const HistoricalEnrollment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');

  // Estados para proyecciones
  const [projectionParams, setProjectionParams] = useState<ProjectionParams>({
    activeEnrollment: 150,
    retentionRate: 85,
    reinscriptionRate: 90,
    discountRate: 10,
    basePrice: 12500,
    selectedMonth: '2025-02',
    selectedModality: 'presencial'
  });

  const [originalParams] = useState<ProjectionParams>({ ...projectionParams });

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: History },
    { id: 'projections', name: 'Proyecciones', icon: Calculator },
    { id: 'trends', name: 'Tendencias', icon: TrendingUp }
  ];

  // Función para calcular días devengables por mes según modalidad
  const calculateAccrualDays = (month: string, modality: 'presencial' | 'online' | 'sabatina') => {
    const [year, monthNum] = month.split('-').map(Number);
    const daysInMonth = new Date(year, monthNum, 0).getDate();
    
    // Días festivos fijos para 2025
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

  // Función para calcular proyecciones con días devengables
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

  // Generar opciones de meses ordenados cronológicamente
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // 6 meses atrás hasta 6 meses adelante, ordenados cronológicamente
    for (let i = -6; i <= 6; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
      options.push({ value, label });
    }
    
    return options;
  };

  // Datos históricos ordenados cronológicamente (Ene -> Dic)
  const getOrderedMonthlyData = () => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return monthNames.map((month, index) => ({
      month,
      monthNumber: index + 1,
      active: 2800 + Math.floor(Math.random() * 200),
      risk: 80 + Math.floor(Math.random() * 40),
      noCxC: 120 + Math.floor(Math.random() * 60),
      newEnrollments: 200 + Math.floor(Math.random() * 100),
      reinscriptions: 2400 + Math.floor(Math.random() * 200),
      revenue: 15000000 + Math.floor(Math.random() * 3000000)
    }));
  };

  const monthlyData = getOrderedMonthlyData();
  const monthOptions = generateMonthOptions();
  const projectionResults = calculateProjections(projectionParams);
  const originalResults = calculateProjections(originalParams);
  const variance = projectionResults.accruedRevenue - originalResults.accruedRevenue;

  const handleParamChange = (field: keyof ProjectionParams, value: any) => {
    setProjectionParams(prev => ({ 
      ...prev, 
      [field]: field === 'selectedMonth' || field === 'selectedModality' ? value : Number(value)
    }));
  };

  const resetParams = () => {
    setProjectionParams({ ...originalParams });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Matrícula Histórica</h1>
            <p className="text-gray-600 mt-2">Análisis histórico, proyecciones y tendencias de matrícula</p>
          </div>
          <button 
            onClick={() => alert('Función de reporte de errores - En desarrollo')}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Reportar Error
          </button>
        </div>
      </div>

      {/* Filtros generales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los Campus</option>
              <option value="cdmx">Ciudad de México</option>
              <option value="guadalajara">Guadalajara</option>
              <option value="monterrey">Monterrey</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Programa</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los Programas</option>
              <option value="ingenieria">Ingeniería en Sistemas</option>
              <option value="administracion">Administración</option>
              <option value="derecho">Derecho</option>
            </select>
          </div>
        </div>
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

        <div className="p-6">
          {/* Tab: Resumen */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Resumen Anual {selectedYear}</h2>
              
              {/* Visualización mensual ordenada cronológicamente */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-semibold text-gray-900">Evolución Mensual (Ene → Dic)</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600">{selectedYear}</span>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-12 gap-2">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-center border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="text-xs font-medium text-gray-600 mb-2">{data.month}</div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-green-600">{data.active}</div>
                        <div className="text-xs text-orange-600">{data.risk}</div>
                        <div className="text-xs text-purple-600">{data.noCxC}</div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-500">${(data.revenue / 1000000).toFixed(1)}M</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Activos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span>En Riesgo</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    <span>Sin CxC</span>
                  </div>
                </div>
              </div>

              {/* Métricas anuales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">+12.5%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900">33,640</h3>
                  <p className="text-blue-700 text-sm">Total Matrícula {selectedYear}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">+8.7%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-900">87.2%</h3>
                  <p className="text-green-700 text-sm">Retención Promedio</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                    <span className="text-sm text-purple-600 font-medium">+15.3%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-900">$218.4M</h3>
                  <p className="text-purple-700 text-sm">Ingresos Totales</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="w-8 h-8 text-orange-600" />
                    <span className="text-sm text-orange-600 font-medium">92.1%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-900">334</h3>
                  <p className="text-orange-700 text-sm">Días Devengados</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Proyecciones */}
          {activeTab === 'projections' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Proyecciones con Días por Devengar</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel de configuración */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <Settings className="w-5 h-5 text-blue-600 mr-2" />
                      <h3 className="text-md font-semibold text-gray-900">Parámetros de Proyección</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Configuración de devengo */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                          Configuración de Devengo
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mes de Proyección</label>
                            <select
                              value={projectionParams.selectedMonth}
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
                              value={projectionParams.selectedModality}
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
                          Matrícula Activa: {projectionParams.activeEnrollment}
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          value={projectionParams.activeEnrollment}
                          onChange={(e) => handleParamChange('activeEnrollment', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          % Retención: {projectionParams.retentionRate}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={projectionParams.retentionRate}
                          onChange={(e) => handleParamChange('retentionRate', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          % Reinscripción: {projectionParams.reinscriptionRate}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={projectionParams.reinscriptionRate}
                          onChange={(e) => handleParamChange('reinscriptionRate', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          % Descuento: {projectionParams.discountRate}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={projectionParams.discountRate}
                          onChange={(e) => handleParamChange('discountRate', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Precio Base</label>
                        <input
                          type="number"
                          value={projectionParams.basePrice}
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
                  <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                    <div className="flex items-center mb-4">
                      <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                      <h3 className="text-md font-semibold text-gray-900">Análisis de Días por Devengar</h3>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-medium text-purple-700 mb-1">Días por Devengar</h4>
                        <p className="text-2xl font-bold text-purple-900">{projectionResults.accrualData.accrualDays}</p>
                        <p className="text-sm text-purple-600">
                          de {projectionResults.accrualData.totalDays} días del mes
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <h4 className="text-sm font-medium text-indigo-700 mb-1">% de Devengo</h4>
                        <p className="text-2xl font-bold text-indigo-900">
                          {projectionResults.accrualData.accrualPercentage.toFixed(1)}%
                        </p>
                        <p className="text-sm text-indigo-600">
                          Modalidad: {projectionParams.selectedModality}
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Mes Seleccionado</h4>
                        <p className="text-lg font-bold text-gray-900">
                          {monthOptions.find(m => m.value === projectionParams.selectedMonth)?.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          {projectionParams.selectedMonth}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Reglas de Devengo:</strong> 
                        {projectionParams.selectedModality === 'presencial' && ' Lunes a Viernes (días hábiles)'}
                        {projectionParams.selectedModality === 'online' && ' Todos los días excepto festivos'}
                        {projectionParams.selectedModality === 'sabatina' && ' Solo sábados no festivos'}
                      </p>
                    </div>
                  </div>

                  {/* Resultados de proyección */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <Calculator className="w-5 h-5 text-green-600 mr-2" />
                      <h3 className="text-md font-semibold text-gray-900">Resultados de Proyección</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-700 mb-1">Estudiantes Retenidos</h4>
                        <p className="text-2xl font-bold text-blue-900">{projectionResults.retainedStudents}</p>
                        <p className="text-sm text-blue-600">
                          {projectionParams.retentionRate}% de {projectionParams.activeEnrollment}
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="text-sm font-medium text-green-700 mb-1">Estudiantes Reinscritos</h4>
                        <p className="text-2xl font-bold text-green-900">{projectionResults.reinscribedStudents}</p>
                        <p className="text-sm text-green-600">
                          {projectionParams.reinscriptionRate}% de retenidos
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-medium text-purple-700 mb-1">Precio Efectivo</h4>
                        <p className="text-2xl font-bold text-purple-900">${projectionResults.effectivePrice.toLocaleString()}</p>
                        <p className="text-sm text-purple-600">
                          Después de {projectionParams.discountRate}% descuento
                        </p>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="text-sm font-medium text-orange-700 mb-1">Ingreso por Devengar</h4>
                        <p className="text-2xl font-bold text-orange-900">${projectionResults.accruedRevenue.toLocaleString()}</p>
                        <p className="text-sm text-orange-600">
                          {projectionResults.accrualData.accrualPercentage.toFixed(1)}% de ${projectionResults.monthlyRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Comparación mensual vs devengado */}
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Comparación de Ingresos</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">Ingreso Mensual Completo</p>
                          <p className="text-lg font-bold text-gray-900">${projectionResults.monthlyRevenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-sm text-purple-600">Ingreso por Devengar</p>
                          <p className="text-lg font-bold text-purple-900">${projectionResults.accruedRevenue.toLocaleString()}</p>
                          <p className={`text-sm ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {variance >= 0 ? '+' : ''}${variance.toLocaleString()} vs. original
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Impacto de Descuentos</h4>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700">
                          Pérdida por descuentos: <span className="font-medium">${projectionResults.discountImpact.toLocaleString()}</span>
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {((projectionResults.discountImpact / (projectionResults.monthlyRevenue + projectionResults.discountImpact)) * 100).toFixed(1)}% 
                          del ingreso potencial
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Tendencias */}
          {activeTab === 'trends' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Análisis de Tendencias</h2>
              
              <div className="bg-gray-50 rounded-xl p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Análisis de Tendencias</h3>
                <p className="text-gray-600">
                  Visualización de tendencias históricas y proyecciones futuras
                </p>
                <p className="text-sm text-gray-500 mt-2">Próximamente disponible</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricalEnrollment;