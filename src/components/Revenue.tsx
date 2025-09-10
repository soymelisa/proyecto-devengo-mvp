import React, { useState } from 'react';
import { DollarSign, Calendar, TrendingUp, Download, Filter } from 'lucide-react';
import { mockRevenueData } from '../data/mockData';

const Revenue: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');

  const filteredData = mockRevenueData.filter(item => {
    return (
      item.period === selectedPeriod &&
      (selectedCampus === 'all' || item.campus === selectedCampus) &&
      (selectedProgram === 'all' || item.program === selectedProgram)
    );
  });

  const totalProjected = filteredData.reduce((sum, item) => sum + item.projected, 0);
  const totalActual = filteredData.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalProjected;
  const variancePercentage = ((totalVariance / totalProjected) * 100);

  // Datos para el cálculo de ingresos devengados
  const earnedRevenueData = [
    {
      campus: 'Ciudad de México',
      modality: 'Presencial',
      activeDays: 22,
      weekendDays: 8,
      holidays: 2,
      totalDays: 30,
      dailyRate: 2850,
      earnedRevenue: 62700
    },
    {
      campus: 'Guadalajara', 
      modality: 'Online',
      activeDays: 30,
      weekendDays: 0,
      holidays: 0,
      totalDays: 30,
      dailyRate: 1950,
      earnedRevenue: 58500
    },
    {
      campus: 'Monterrey',
      modality: 'Sabatina',
      activeDays: 4,
      weekendDays: 26,
      holidays: 0,
      totalDays: 30,
      dailyRate: 7200,
      earnedRevenue: 28800
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Análisis de Ingresos</h1>
        <p className="text-gray-600 mt-2">Ingresos reales vs. proyectados e ingresos devengados</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024-01">Enero 2024</option>
              <option value="2024-02">Febrero 2024</option>
              <option value="2024-03">Marzo 2024</option>
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
              <option value="Ciudad de México">Ciudad de México</option>
              <option value="Guadalajara">Guadalajara</option>
              <option value="Monterrey">Monterrey</option>
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
              <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
              <option value="Administración de Empresas">Administración de Empresas</option>
              <option value="Derecho">Derecho</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-50">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">${(totalProjected / 1000000).toFixed(1)}M</h3>
            <p className="text-gray-600 text-sm mt-1">Proyectado</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">${(totalActual / 1000000).toFixed(1)}M</h3>
            <p className="text-gray-600 text-sm mt-1">Real</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${totalVariance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <Calendar className={`w-6 h-6 ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {totalVariance >= 0 ? '+' : ''}${(totalVariance / 1000000).toFixed(1)}M
            </h3>
            <p className="text-gray-600 text-sm mt-1">Varianza</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${variancePercentage >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <Filter className={`w-6 h-6 ${variancePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-bold ${variancePercentage >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {variancePercentage >= 0 ? '+' : ''}{variancePercentage.toFixed(1)}%
            </h3>
            <p className="text-gray-600 text-sm mt-1">% Varianza</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de ingresos por programa */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ingresos por Programa</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyectado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Real</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Varianza</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.campus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.program}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(item.projected / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(item.actual / 1000000).toFixed(1)}M
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      item.variance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.variance >= 0 ? '+' : ''}${(item.variance / 1000).toFixed(0)}K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ingresos devengados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ingresos Devengados</h2>
            <p className="text-sm text-gray-600 mt-1">Basado en días activos por modalidad</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {earnedRevenueData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{item.campus}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {item.modality}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Días activos</p>
                      <p className="font-medium">{item.activeDays} de {item.totalDays}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tarifa diaria</p>
                      <p className="font-medium">${item.dailyRate.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">Ingreso devengado</p>
                      <p className="text-lg font-bold text-green-600">
                        ${item.earnedRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;