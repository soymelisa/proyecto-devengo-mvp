import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const metrics = [
    {
      label: 'Matrícula Activa',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Ingresos del Mes',
      value: '$18.2M',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Proyección Anual',
      value: '$242.5M',
      change: '+5.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      label: 'Alumnos en Riesgo',
      value: '89',
      change: '-15.3%',
      trend: 'down',
      icon: AlertTriangle,
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financiero</h1>
        <p className="text-gray-600 mt-2">Resumen ejecutivo del sistema educativo</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-${metric.color}-50`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {metric.change}
                </div>
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
            <h2 className="text-lg font-semibold text-gray-900">Alertas y Notificaciones</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">89 alumnos en riesgo</h4>
                  <p className="text-sm text-orange-700">Requieren seguimiento inmediato</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Proyección actualizada</h4>
                  <p className="text-sm text-blue-700">Nueva versión V2024.02 disponible</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Meta mensual alcanzada</h4>
                  <p className="text-sm text-green-700">108% del objetivo cumplido</p>
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