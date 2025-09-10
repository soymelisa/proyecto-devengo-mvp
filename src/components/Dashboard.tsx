import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');

  // Determinar si el mes es pasado o futuro
  const currentDate = new Date();
  const selectedDate = new Date(selectedMonth + '-01');
  const isPastMonth = selectedDate < currentDate;
  const isFutureMonth = selectedDate > currentDate;

  // Generar opciones de meses (6 meses atrás y 6 meses adelante)
  const generateMonthOptions = () => {
    const options = [];
    const current = new Date();
    
    // 6 meses atrás
    for (let i = 6; i >= 1; i--) {
      const date = new Date(current.getFullYear(), current.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
      options.push({ value, label, type: 'past' });
    }
    
    // Mes actual
    const currentValue = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    const currentLabel = current.toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
    options.push({ value: currentValue, label: currentLabel, type: 'current' });
    
    // 6 meses adelante
    for (let i = 1; i <= 6; i++) {
      const date = new Date(current.getFullYear(), current.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
      options.push({ value, label, type: 'future' });
    }
    
    return options;
  };

  const monthOptions = generateMonthOptions();
  const selectedMonthData = monthOptions.find(m => m.value === selectedMonth);

  // Datos simulados basados en el mes seleccionado
  const getDataForMonth = () => {
    const baseData = {
      students: 2847,
      revenue: 18200000,
      intercycleRetention: 85.2,
      intracycleRetention: 92.8,
      daysToAccrue: 22
    };

    if (isPastMonth) {
      // Datos reales para meses pasados
      return {
        ...baseData,
        revenue: baseData.revenue * (0.9 + Math.random() * 0.2), // Variación realista
        students: Math.floor(baseData.students * (0.95 + Math.random() * 0.1)),
        intercycleRetention: 87.5,
        intracycleRetention: 94.2,
        daysToAccrue: 0 // Ya devengado
      };
    } else if (isFutureMonth) {
      // Datos proyectados para meses futuros
      return {
        ...baseData,
        revenue: baseData.revenue * (1.05 + Math.random() * 0.1), // Proyección optimista
        students: Math.floor(baseData.students * (1.02 + Math.random() * 0.08)),
        intercycleRetention: 88.0,
        intracycleRetention: 93.5,
        daysToAccrue: 30
      };
    } else {
      // Mes actual
      return baseData;
    }
  };

  const monthData = getDataForMonth();

  const metrics = [
    {
      label: 'Matrícula Activa',
      value: monthData.students.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      label: isPastMonth ? 'Ingresos Reales' : isFutureMonth ? 'Ingresos Proyectados' : 'Ingresos del Mes',
      value: `$${(monthData.revenue / 1000000).toFixed(1)}M`,
      change: isPastMonth ? '+8.2%' : isFutureMonth ? '+15.3%' : '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Retención Interciclo',
      value: `${monthData.intercycleRetention}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      label: 'Retención Intraciclo',
      value: `${monthData.intracycleRetention}%`,
      change: '+1.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'indigo'
    },
    {
      label: 'Días a Devengar',
      value: monthData.daysToAccrue.toString(),
      change: monthData.daysToAccrue === 0 ? 'Completado' : `${monthData.daysToAccrue} días`,
      trend: monthData.daysToAccrue === 0 ? 'neutral' : 'neutral',
      icon: Calendar,
      color: 'orange'
    }
  ];

  const campusData = [
    { name: 'Ciudad de México', students: 1247, revenue: 7850000, growth: 12.3 },
    { name: 'Guadalajara', students: 892, revenue: 5420000, growth: 8.7 },
    { name: 'Monterrey', students: 708, revenue: 4930000, growth: 15.2 }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Resumen Ejecutivo</h1>
        <p className="text-gray-600 mt-2">Análisis financiero y operativo del sistema educativo</p>
      </div>

      {/* Selector de mes y filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mes a Analizar</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.type === 'past' ? '(Real)' : option.type === 'future' ? '(Proyectado)' : '(Actual)'}
                </option>
              ))}
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
              <option value="lottus">Lottus</option>
              <option value="uvm">UVM</option>
              <option value="unitec">UNITEC</option>
              <option value="ula">ULA</option>
              <option value="uane">UANE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plantel</label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los Planteles</option>
              <option value="cdmx">Ciudad de México</option>
              <option value="guadalajara">Guadalajara</option>
              <option value="monterrey">Monterrey</option>
              <option value="puebla">Puebla</option>
              <option value="tijuana">Tijuana</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Programa</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los Programas</option>
              <option value="ingenieria">Ingeniería en Sistemas</option>
              <option value="administracion">Administración de Empresas</option>
              <option value="derecho">Derecho</option>
              <option value="medicina">Medicina</option>
              <option value="psicologia">Psicología</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Aplicar
            </button>
          </div>
        </div>

        {/* Indicador del tipo de datos */}
        <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center justify-center">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPastMonth 
                ? 'bg-green-100 text-green-800' 
                : isFutureMonth 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isPastMonth 
                ? '📊 Mostrando datos reales' 
                : isFutureMonth 
                  ? '🔮 Mostrando proyecciones' 
                  : '⏱️ Mostrando datos actuales'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          const isNeutral = metric.trend === 'neutral';
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-${metric.color}-50`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                {!isNeutral && (
                  <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {metric.change}
                  </div>
                )}
                {isNeutral && (
                  <div className="text-sm text-gray-600">
                    {metric.change}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
                <p className="text-gray-600 text-sm mt-1">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Análisis por Campus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Desempeño por Campus</h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedMonthData?.label} - {isPastMonth ? 'Datos reales' : isFutureMonth ? 'Proyecciones' : 'Datos actuales'}
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {campusData.map((campus, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{campus.name}</h3>
                    <p className="text-sm text-gray-600">{campus.students.toLocaleString()} estudiantes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(campus.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-green-600">+{campus.growth}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Indicadores de Retención</h2>
            <p className="text-sm text-gray-600 mt-1">Métricas de permanencia estudiantil</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Retención Interciclo</span>
                  <span className="text-sm font-bold text-purple-600">{monthData.intercycleRetention}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${monthData.intercycleRetention}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Estudiantes que continúan entre ciclos</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Retención Intraciclo</span>
                  <span className="text-sm font-bold text-indigo-600">{monthData.intracycleRetention}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${monthData.intracycleRetention}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Estudiantes que permanecen durante el ciclo</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-orange-900">Días a Devengar</h4>
                    <p className="text-sm text-orange-700">
                      {monthData.daysToAccrue === 0 
                        ? 'Mes completamente devengado' 
                        : `${monthData.daysToAccrue} días restantes en el mes`
                      }
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {monthData.daysToAccrue}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;