import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, Download, AlertTriangle, Plus, X, Save } from 'lucide-react';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isEarnable: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

interface AcademicPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  brand: string;
  program: string;
  modality: string;
}

interface CustomHoliday {
  id: string;
  date: string;
  name: string;
  isCustom: boolean;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBrand, setSelectedBrand] = useState('lottus');
  const [selectedLevel, setSelectedLevel] = useState('licenciatura');
  const [selectedModality, setSelectedModality] = useState('presencial');
  const [selectedType, setSelectedType] = useState('semestral');
  const [selectedProgram, setSelectedProgram] = useState('ingenieria-sistemas');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const [customHolidays, setCustomHolidays] = useState<CustomHoliday[]>([]);
  const [newHoliday, setNewHoliday] = useState({ date: '', name: '' });

  // Días festivos oficiales (fijos)
  const officialHolidays = {
    '2025-01-01': 'Año Nuevo',
    '2025-02-03': 'Día de la Constitución',
    '2025-03-17': 'Natalicio de Benito Juárez',
    '2025-04-17': 'Jueves Santo',
    '2025-04-18': 'Viernes Santo',
    '2025-05-01': 'Día del Trabajo',
    '2025-09-16': 'Día de la Independencia',
    '2025-11-17': 'Día de la Revolución Mexicana',
    '2025-12-25': 'Navidad'
  };

  // Períodos académicos de ejemplo
  const academicPeriods: AcademicPeriod[] = [
    {
      id: '2025-1',
      name: '2025-1 (Enero - Mayo)',
      startDate: '2025-01-15',
      endDate: '2025-05-30',
      brand: 'Lottus',
      program: 'Ingeniería en Sistemas',
      modality: 'Presencial'
    },
    {
      id: '2025-2',
      name: '2025-2 (Agosto - Diciembre)',
      startDate: '2025-08-15',
      endDate: '2025-12-15',
      brand: 'Lottus',
      program: 'Ingeniería en Sistemas',
      modality: 'Presencial'
    },
    {
      id: '2025-cuatri-1',
      name: '2025 Cuatri-1 (Enero - Abril)',
      startDate: '2025-01-08',
      endDate: '2025-04-25',
      brand: 'UVM',
      program: 'Administración',
      modality: 'Online'
    }
  ];

  // Combinar días festivos oficiales y personalizados
  const allHolidays = {
    ...officialHolidays,
    ...customHolidays.reduce((acc, holiday) => {
      acc[holiday.date] = holiday.name;
      return acc;
    }, {} as Record<string, string>)
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Obtener período seleccionado
  const currentPeriod = academicPeriods.find(p => p.id === selectedPeriod);

  // Calcular datos del período
  const getPeriodData = () => {
    if (!currentPeriod) return null;

    const startDate = new Date(currentPeriod.startDate);
    const endDate = new Date(currentPeriod.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    let earnableDays = 0;
    const currentDateIter = new Date(startDate);
    
    while (currentDateIter <= endDate) {
      const dayOfWeek = currentDateIter.getDay();
      const dateString = currentDateIter.toISOString().split('T')[0];
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = allHolidays[dateString] !== undefined;
      
      let isEarnable = false;
      if (selectedModality === 'presencial') {
        isEarnable = !isWeekend && !isHoliday;
      } else if (selectedModality === 'online') {
        isEarnable = !isHoliday;
      } else if (selectedModality === 'sabatina') {
        isEarnable = dayOfWeek === 6 && !isHoliday;
      }
      
      if (isEarnable) earnableDays++;
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return {
      startDate: startDate.toLocaleDateString('es-MX'),
      endDate: endDate.toLocaleDateString('es-MX'),
      totalDays,
      earnableDays
    };
  };

  const periodData = getPeriodData();

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days: CalendarDay[] = [];
    
    // Días del mes anterior
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = prevMonth.getDate() - i;
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isEarnable: false,
        isWeekend: false,
        isHoliday: false
      });
    }
    
    // Días del mes actual
    for (let date = 1; date <= daysInMonth; date++) {
      const currentDay = new Date(year, month, date);
      const dayOfWeek = currentDay.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateString = currentDay.toISOString().split('T')[0];
      const isHoliday = allHolidays[dateString] !== undefined;
      
      // Lógica para días devengables según modalidad
      let isEarnable = false;
      if (selectedModality === 'presencial') {
        // Presencial: Lunes a Viernes, no fines de semana, no feriados
        isEarnable = !isWeekend && !isHoliday;
      } else if (selectedModality === 'online') {
        // Online: Todos los días excepto feriados
        isEarnable = !isHoliday;
      } else if (selectedModality === 'sabatina') {
        // Sabatina: Solo sábados, no feriados
        isEarnable = dayOfWeek === 6 && !isHoliday;
      }
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday: currentDay.toDateString() === today.toDateString(),
        isEarnable,
        isWeekend,
        isHoliday,
        holidayName: allHolidays[dateString]
      });
    }
    
    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length;
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isEarnable: false,
        isWeekend: false,
        isHoliday: false
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Calcular resumen
  const currentMonthDays = calendarDays.filter(day => day.isCurrentMonth);
  const earnableDays = currentMonthDays.filter(day => day.isEarnable).length;
  const weekendDays = currentMonthDays.filter(day => day.isWeekend).length;
  const holidayDays = currentMonthDays.filter(day => day.isHoliday).length;
  const totalDays = currentMonthDays.length;
  const nonEarnableDays = totalDays - earnableDays;

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDayClassName = (day: CalendarDay) => {
    let baseClass = "h-12 w-12 flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer ";
    
    if (!day.isCurrentMonth) {
      baseClass += "text-gray-300 ";
    } else if (day.isToday) {
      baseClass += "bg-blue-600 text-white font-bold ";
    } else if (day.isHoliday) {
      baseClass += "bg-red-100 text-red-800 font-medium ";
    } else if (day.isEarnable) {
      baseClass += "bg-green-100 text-green-800 font-medium hover:bg-green-200 ";
    } else if (day.isWeekend) {
      baseClass += "bg-gray-100 text-gray-600 ";
    } else {
      baseClass += "text-gray-700 hover:bg-gray-100 ";
    }
    
    return baseClass;
  };

  const handleAddHoliday = () => {
    if (newHoliday.date && newHoliday.name) {
      const holiday: CustomHoliday = {
        id: Date.now().toString(),
        date: newHoliday.date,
        name: newHoliday.name,
        isCustom: true
      };
      setCustomHolidays(prev => [...prev, holiday]);
      setNewHoliday({ date: '', name: '' });
      setShowHolidayForm(false);
    }
  };

  const handleRemoveHoliday = (id: string) => {
    setCustomHolidays(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendario de Devengo</h1>
            <p className="text-gray-600 mt-2">Visualización de días devengables por modalidad y programa</p>
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

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Devengo</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período Académico</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar período</option>
              {academicPeriods.map(period => (
                <option key={period.id} value={period.id}>{period.name}</option>
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
              <option value="lottus">Lottus</option>
              <option value="uvm">UVM</option>
              <option value="unitec">UNITEC</option>
              <option value="ula">ULA</option>
              <option value="uane">UANE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="licenciatura">Licenciatura</option>
              <option value="maestria">Maestría</option>
              <option value="doctorado">Doctorado</option>
              <option value="preparatoria">Preparatoria</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="sabatina">Sabatina</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="semestral">Semestral</option>
              <option value="cuatrimestral">Cuatrimestral</option>
              <option value="trimestral">Trimestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Programa</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ingenieria-sistemas">Ingeniería en Sistemas</option>
              <option value="administracion">Administración de Empresas</option>
              <option value="derecho">Derecho</option>
              <option value="medicina">Medicina</option>
              <option value="psicologia">Psicología</option>
            </select>
          </div>
        </div>
      </div>

      {/* Información del período seleccionado */}
      {currentPeriod && periodData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Período: {currentPeriod.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-700 mb-1">Fecha de Inicio</h3>
              <p className="text-lg font-bold text-blue-900">{periodData.startDate}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-700 mb-1">Fecha de Fin</h3>
              <p className="text-lg font-bold text-green-900">{periodData.endDate}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-700 mb-1">Días Naturales</h3>
              <p className="text-lg font-bold text-purple-900">{periodData.totalDays}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-orange-700 mb-1">Días Devengables</h3>
              <p className="text-lg font-bold text-orange-900">{periodData.earnableDays}</p>
              <p className="text-xs text-orange-600 mt-1">
                {((periodData.earnableDays / periodData.totalDays) * 100).toFixed(1)}% del período
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gestión de días asuetos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Gestión de Días Asuetos</h2>
          <button
            onClick={() => setShowHolidayForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Asueto
          </button>
        </div>

        {/* Lista de días asuetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Días oficiales */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Días Festivos Oficiales</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(officialHolidays).map(([date, name]) => (
                <div key={date} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-600">{new Date(date).toLocaleDateString('es-MX')}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Oficial</span>
                </div>
              ))}
            </div>
          </div>

          {/* Días personalizados */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-3">Asuetos Personalizados</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {customHolidays.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No hay asuetos personalizados</p>
              ) : (
                customHolidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{holiday.name}</p>
                      <p className="text-xs text-gray-600">{new Date(holiday.date).toLocaleDateString('es-MX')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Personal</span>
                      <button
                        onClick={() => handleRemoveHoliday(holiday.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Formulario para agregar asueto */}
        {showHolidayForm && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-3">Agregar Nuevo Asueto</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-green-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-green-700 mb-1">Nombre del Asueto</label>
                <input
                  type="text"
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Día del Maestro"
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleAddHoliday}
                  disabled={!newHoliday.date || !newHoliday.name}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setShowHolidayForm(false);
                    setNewHoliday({ date: '', name: '' });
                  }}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header del calendario */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                
                <h2 className="text-xl font-semibold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Grilla del calendario */}
            <div className="p-6">
              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={getDayClassName(day)}
                    title={day.holidayName || ''}
                  >
                    {day.date}
                  </div>
                ))}
              </div>

              {/* Leyenda */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Leyenda:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
                    <span>Días devengables</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded mr-2"></div>
                    <span>Fines de semana</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
                    <span>Días festivos</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                    <span>Hoy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
                    <span>Período académico</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Resumen del Mes</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Días Devengables</span>
                  <span className="text-2xl font-bold text-green-900">{earnableDays}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {((earnableDays / totalDays) * 100).toFixed(1)}% del mes
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Días No Devengables</span>
                  <span className="text-2xl font-bold text-gray-900">{nonEarnableDays}</span>
                </div>
                <div className="text-xs text-gray-600 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Fines de semana:</span>
                    <span>{weekendDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Días festivos:</span>
                    <span>{holidayDays}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Total Días</span>
                  <span className="text-2xl font-bold text-blue-900">{totalDays}</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Información de modalidad */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <Info className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Configuración Actual</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Modalidad:</span>
                <span className="font-medium capitalize">{selectedModality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nivel:</span>
                <span className="font-medium capitalize">{selectedLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium capitalize">{selectedType}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Reglas de Devengo Actuales:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                {selectedModality === 'presencial' && (
                  <p>• Lunes a Viernes (días hábiles)</p>
                )}
                {selectedModality === 'online' && (
                  <p>• Todos los días excepto festivos</p>
                )}
                {selectedModality === 'sabatina' && (
                  <p>• Solo sábados no festivos</p>
                )}
                <p>• Excluye días festivos oficiales</p>
              </div>
            </div>

            {currentPeriod && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Período Seleccionado:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• {currentPeriod.name}</p>
                  <p>• {currentPeriod.brand} - {currentPeriod.program}</p>
                  <p>• Modalidad: {currentPeriod.modality}</p>
                </div>
              </div>
            )}

            <button className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exportar Calendario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;