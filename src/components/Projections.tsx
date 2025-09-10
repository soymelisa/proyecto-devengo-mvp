import React, { useState } from 'react';
import { Calculator, TrendingUp, Settings, Save, RotateCcw } from 'lucide-react';

interface ProjectionParams {
  activeEnrollment: number;
  retentionRate: number;
  reinscriptionRate: number;
  discountRate: number;
  basePrice: number;
}

const Projections: React.FC = () => {
  const [currentParams, setCurrentParams] = useState<ProjectionParams>({
    activeEnrollment: 150,
    retentionRate: 85,
    reinscriptionRate: 90,
    discountRate: 10,
    basePrice: 12500
  });

  const [originalParams] = useState<ProjectionParams>({ ...currentParams });
  const [selectedCampus, setSelectedCampus] = useState('Ciudad de México');
  const [selectedProgram, setSelectedProgram] = useState('Ingeniería en Sistemas');

  const calculateProjections = (params: ProjectionParams) => {
    const retainedStudents = Math.round(params.activeEnrollment * (params.retentionRate / 100));
    const reinscribedStudents = Math.round(retainedStudents * (params.reinscriptionRate / 100));
    const discountAmount = params.basePrice * (params.discountRate / 100);
    const effectivePrice = params.basePrice - discountAmount;
    const projectedRevenue = reinscribedStudents * effectivePrice;
    
    return {
      retainedStudents,
      reinscribedStudents,
      effectivePrice,
      projectedRevenue,
      discountImpact: reinscribedStudents * discountAmount
    };
  };

  const results = calculateProjections(currentParams);
  const originalResults = calculateProjections(originalParams);
  const variance = results.projectedRevenue - originalResults.projectedRevenue;

  const handleParamChange = (field: keyof ProjectionParams, value: number) => {
    setCurrentParams(prev => ({ ...prev, [field]: value }));
  };

  const resetParams = () => {
    setCurrentParams({ ...originalParams });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Proyecciones Financieras</h1>
        <p className="text-gray-600 mt-2">Cálculo automático y análisis de escenarios</p>
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
                <h3 className="text-sm font-medium text-orange-700 mb-1">Ingreso Proyectado</h3>
                <p className="text-2xl font-bold text-orange-900">${results.projectedRevenue.toLocaleString()}</p>
                <p className={`text-sm ${variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {variance >= 0 ? '+' : ''}${variance.toLocaleString()} vs. original
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Impacto de Descuentos</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  Pérdida por descuentos: <span className="font-medium">${results.discountImpact.toLocaleString()}</span>
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {((results.discountImpact / (results.projectedRevenue + results.discountImpact)) * 100).toFixed(1)}% 
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
                <p className="font-semibold text-gray-900">${results.projectedRevenue.toLocaleString()}</p>
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
      </div>
    </div>
  );
};

export default Projections;