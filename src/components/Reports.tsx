import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, BarChart3, TrendingUp, Users } from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState('financial');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const reportTypes = [
    {
      id: 'financial',
      name: 'Reporte Financiero Consolidado',
      description: 'Análisis completo de ingresos, proyecciones y varianzas por campus y programa',
      icon: BarChart3,
      frequency: 'Mensual'
    },
    {
      id: 'enrollment',
      name: 'Análisis de Matrícula',
      description: 'Estado de matrícula activa, retención y reinscripción por modalidad',
      icon: Users,
      frequency: 'Semanal'
    },
    {
      id: 'projections',
      name: 'Proyecciones vs. Realidad',
      description: 'Comparación detallada entre proyecciones y ingresos reales',
      icon: TrendingUp,
      frequency: 'Mensual'
    },
    {
      id: 'discounts',
      name: 'Impacto de Descuentos',
      description: 'Análisis del impacto de descuentos por programa, campus y marca',
      icon: FileText,
      frequency: 'Trimestral'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Reporte Financiero - Enero 2024',
      type: 'Financiero Consolidado',
      date: '2024-02-01',
      size: '2.8 MB',
      format: 'PDF',
      status: 'Completado'
    },
    {
      id: 2,
      name: 'Análisis Matrícula - Sem 4 Enero',
      type: 'Análisis de Matrícula',
      date: '2024-01-28',
      size: '1.5 MB',
      format: 'Excel',
      status: 'Completado'
    },
    {
      id: 3,
      name: 'Proyecciones Q1 2024',
      type: 'Proyecciones vs. Realidad',
      date: '2024-01-31',
      size: '3.2 MB',
      format: 'PDF',
      status: 'En proceso'
    }
  ];

  const generateReport = () => {
    // Simulación de generación de reporte
    alert(`Generando reporte ${reportTypes.find(r => r.id === selectedReportType)?.name} en formato ${selectedFormat.toUpperCase()}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Centro de Reportes</h1>
        <p className="text-gray-600 mt-2">Generación y gestión de reportes detallados y consolidados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generador de reportes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generar Nuevo Reporte</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                <div className="grid grid-cols-3 gap-2">
                  {['pdf', 'excel', 'csv'].map(format => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        selectedFormat === format
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <input
                  type="month"
                  defaultValue="2024-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campus</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="all">Todos los Campus</option>
                  <option value="cdmx">Ciudad de México</option>
                  <option value="gdl">Guadalajara</option>
                  <option value="mty">Monterrey</option>
                </select>
              </div>

              <button 
                onClick={generateReport}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-6"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generar Reporte
              </button>
            </div>
          </div>

          {/* Información del reporte seleccionado */}
          {selectedReportType && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Detalles del Reporte</h3>
              {(() => {
                const report = reportTypes.find(r => r.id === selectedReportType);
                const Icon = report?.icon || FileText;
                return (
                  <div>
                    <div className="flex items-center mb-3">
                      <Icon className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium">{report?.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{report?.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      Frecuencia: {report?.frequency}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Historial de reportes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Reportes Recientes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentReports.map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{new Date(report.date).toLocaleDateString('es-MX')}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                          <span>•</span>
                          <span>{report.format}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'Completado' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                      
                      {report.status === 'Completado' && (
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Estadísticas de reportes */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-blue-50">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">47</h3>
                <p className="text-gray-600 text-sm mt-1">Reportes este mes</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-green-50">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">156.8 MB</h3>
                <p className="text-gray-600 text-sm mt-1">Tamaño total</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-purple-50">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">12</h3>
                <p className="text-gray-600 text-sm mt-1">Usuarios activos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;