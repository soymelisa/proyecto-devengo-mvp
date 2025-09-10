import React, { useState } from 'react';
import { Users, TrendingDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { mockStudents } from '../data/mockData';

const EnrollmentAnalysis: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Cálculo de métricas de matrícula
  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(s => s.status === 'Activo').length;
  const riskStudents = mockStudents.filter(s => s.status === 'En Riesgo').length;
  const noCxCStudents = mockStudents.filter(s => s.status === 'Sin CxC').length;
  const notEnrolledNext = mockStudents.filter(s => !s.nextCycleEnrolled).length;

  // Análisis por modalidad
  const modalityAnalysis = [
    { name: 'Presencial', active: 1, risk: 0, noCxC: 0, retention: 100 },
    { name: 'Online', active: 0, risk: 1, noCxC: 0, retention: 80 },
    { name: 'Sabatina', active: 0, risk: 0, noCxC: 1, retention: 95 }
  ];

  // Análisis por campus
  const campusAnalysis = [
    { name: 'Ciudad de México', active: 1, risk: 0, noCxC: 0, total: 1, retentionRate: 100 },
    { name: 'Guadalajara', active: 0, risk: 1, noCxC: 0, total: 1, retentionRate: 80 },
    { name: 'Monterrey', active: 0, risk: 0, noCxC: 1, total: 1, retentionRate: 95 }
  ];

  const filteredStudents = selectedStatus === 'all' 
    ? mockStudents 
    : mockStudents.filter(s => s.status === selectedStatus);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Análisis de Matrícula</h1>
        <p className="text-gray-600 mt-2">Seguimiento y análisis de matrícula activa, en riesgo y sin cuentas por cobrar</p>
      </div>

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
              <TrendingDown className="w-6 h-6 text-purple-600" />
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
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-red-900">{notEnrolledNext}</h3>
            <p className="text-gray-600 text-sm mt-1">No Inscritos Próximo</p>
            <p className="text-xs text-red-600 mt-1">Ciclo siguiente</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Análisis por modalidad */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Análisis por Modalidad</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {modalityAnalysis.map((modality, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{modality.name}</h3>
                    <span className="text-sm font-medium text-gray-600">{modality.retention}% Retención</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{modality.active}</p>
                      <p className="text-xs text-gray-600">Activos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{modality.risk}</p>
                      <p className="text-xs text-gray-600">En Riesgo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{modality.noCxC}</p>
                      <p className="text-xs text-gray-600">Sin CxC</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${modality.retention}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análisis por campus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Análisis por Campus</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">En Riesgo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Retención</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campusAnalysis.map((campus, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {campus.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {campus.active}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                        {campus.risk}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">
                          {campus.retentionRate}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${campus.retentionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alerta de estudiantes no inscritos */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Estudiantes sin inscripción para próximo ciclo
            </h3>
            <p className="text-red-700 mb-4">
              {notEnrolledNext} estudiantes del ciclo actual no están inscritos para el siguiente periodo. 
              Se requiere seguimiento inmediato para evitar pérdida de matrícula.
            </p>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Ver Lista Detallada
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentAnalysis;