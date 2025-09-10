import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Shield, Database, Bell, Globe, X } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    group: '',
    role: '',
    brand: '',
    studentType: '',
    permissions: {
      projections: {
        create: false
      },
      campuses: {
        manage: false,
        addByBrand: {
          ULA: false,
          UANE: false,
          UTEG: false,
          UTC: false,
          INDO: false
        }
      },
      users: {
        create: false,
        view: false,
        deactivate: false
      },
      budgets: {
        assign: false,
        modify: false
      }
    }
  });

  const tabs = [
    { id: 'users', name: 'Usuarios', icon: Users },
    { id: 'permissions', name: 'Permisos', icon: Shield },
    { id: 'integrations', name: 'Integraciones', icon: Database },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'system', name: 'Sistema', icon: Globe }
  ];

  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@lottus.edu', role: 'Administrador', status: 'Activo' },
    { id: 2, name: 'María García', email: 'maria.garcia@lottus.edu', role: 'Director General', status: 'Activo' },
    { id: 3, name: 'Carlos López', email: 'carlos.lopez@lottus.edu', role: 'Finanzas', status: 'Activo' },
    { id: 4, name: 'Ana Martínez', email: 'ana.martinez@lottus.edu', role: 'Corporativo', status: 'Inactivo' }
  ];

  const roles = [
    {
      name: 'Corporativo',
      permissions: ['Ver Dashboard', 'Reportes Consolidados', 'Análisis Global', 'Crear Proyecciones'],
      description: 'Acceso a información consolidada de todos los campus'
    },
    {
      name: 'Finanzas',
      permissions: ['Proyecciones', 'Ingresos', 'Reportes Financieros', 'Modificar Parámetros', 'Gestión de Planteles'],
      description: 'Control total sobre análisis financiero y proyecciones'
    },
    {
      name: 'Director General',
      permissions: ['Dashboard Campus', 'Estudiantes', 'Reportes Campus', 'Gestionar Planteles'],
      description: 'Gestión específica de su campus asignado'
    },
    {
      name: 'Administrador',
      permissions: ['Acceso Completo', 'Gestión Usuarios', 'Configuración Sistema', 'Crear Proyecciones', 'Gestión de Planteles'],
      description: 'Control total del sistema'
    }
  ];

  const handlePermissionChange = (category: string, permission: string, value: boolean) => {
    setNewUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category as keyof typeof prev.permissions],
          [permission]: value
        }
      }
    }));
  };

  const handleBrandPermissionChange = (brand: string, value: boolean) => {
    setNewUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        campuses: {
          ...prev.permissions.campuses,
          addByBrand: {
            ...prev.permissions.campuses.addByBrand,
            [brand]: value
          }
        }
      }
    }));
  };

  const handleCreateUser = () => {
    console.log('Crear usuario:', newUser);
    setShowAddUserModal(false);
    // Reset form
    setNewUser({
      fullName: '',
      email: '',
      group: '',
      role: '',
      brand: '',
      studentType: '',
      permissions: {
        projections: { create: false },
        campuses: {
          manage: false,
          addByBrand: { ULA: false, UANE: false, UTEG: false, UTC: false, INDO: false }
        },
        users: { create: false, view: false, deactivate: false },
        budgets: { assign: false, modify: false }
      }
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600 mt-2">Gestión de usuarios, permisos e integraciones</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs */}
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

        {/* Content */}
        <div className="p-6">
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h2>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Agregar Usuario
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            user.status === 'Activo' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">Editar</button>
                            <button className="text-red-600 hover:text-red-800">Desactivar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Control de Permisos</h2>
              
              <div className="space-y-6">
                {roles.map((role, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-md font-semibold text-gray-900">{role.name}</h3>
                      <button className="text-blue-600 hover:text-blue-800">Editar</button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Permisos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission, pIndex) => (
                          <span key={pIndex} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Integraciones de Sistemas</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Sistema Banner</h3>
                      <p className="text-sm text-gray-600">Integración para datos de matrícula y estudiantes</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Conectado</span>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Configurar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">SIUANE</h3>
                      <p className="text-sm text-gray-600">Sistema de información universitaria y administrativa</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Conectado</span>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Configurar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">SIAFF</h3>
                      <p className="text-sm text-gray-600">Sistema integral de administración financiera federal</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">En configuración</span>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Configurar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuración de Notificaciones</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Alertas de Matrícula</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-sm">Notificar cuando hay estudiantes en riesgo</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-sm">Alertar sobre estudiantes no inscritos para próximo ciclo</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-sm">Resumen diario de matrícula</span>
                    </label>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Reportes Automáticos</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-sm">Reporte mensual de ingresos</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-sm">Análisis semanal de proyecciones</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-sm">Notificaciones de varianzas significativas</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuración del Sistema</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Parámetros Generales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Moneda del Sistema</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>Peso Mexicano (MXN)</option>
                        <option>Dólar Estadounidense (USD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option>América/México_Central</option>
                        <option>América/Cancún</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Backup y Restauración</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Último backup: 01/02/2024 08:30</span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Crear Backup
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backups automáticos: Activos</span>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Configurar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Control de Versiones</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Versión actual del sistema: V2024.01</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Vigente</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>• Solo una versión vigente permitida</p>
                      <p>• Modificaciones a datos históricos restringidas</p>
                      <p>• Control de usuario en cada cambio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar usuario */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Crear miembro</h3>
                </div>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Completa la siguiente información</h4>
                
                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Ingresa el nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="correo@lottus.edu"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grupo <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newUser.group}
                      onChange={(e) => setNewUser(prev => ({ ...prev, group: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      <option value="">Seleccionar grupo</option>
                      <option value="Administradores">Administradores</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Directores">Directores</option>
                      <option value="Corporativo">Corporativo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      <option value="">Seleccionar rol</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Director General">Director General</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Corporativo">Corporativo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newUser.brand}
                      onChange={(e) => setNewUser(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      <option value="">Seleccionar marca</option>
                      <option value="Lottus">Lottus</option>
                      <option value="ULA">ULA</option>
                      <option value="UANE">UANE</option>
                      <option value="UTEG">UTEG</option>
                      <option value="UTC">UTC</option>
                      <option value="INDO">INDO</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Alumno <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newUser.studentType}
                      onChange={(e) => setNewUser(prev => ({ ...prev, studentType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Nuevo Ingreso">Nuevo Ingreso</option>
                      <option value="Reinscripción">Reinscripción</option>
                      <option value="Reactivación">Reactivación</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Permisos */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Permisos</h4>
                
                {/* Proyecciones */}
                <div className="mb-6">
                  <h5 className="text-md font-medium text-gray-800 mb-3">Proyecciones en Matrícula Histórica</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.projections.create}
                        onChange={(e) => handlePermissionChange('projections', 'create', e.target.checked)}
                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Crear proyecciones</span>
                    </label>
                  </div>
                </div>

                {/* Gestión de Planteles */}
                <div className="mb-6">
                  <h5 className="text-md font-medium text-gray-800 mb-3">Gestión de Planteles</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.campuses.manage}
                        onChange={(e) => handlePermissionChange('campuses', 'manage', e.target.checked)}
                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Gestionar planteles</span>
                    </label>
                  </div>
                  
                  {/* Agregar campuses por marca */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h6 className="text-sm font-medium text-gray-700 mb-3">Agregar campuses por marca</h6>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {['ULA', 'UANE', 'UTEG', 'UTC', 'INDO'].map((brand) => (
                        <label key={brand} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newUser.permissions.campuses.addByBrand[brand as keyof typeof newUser.permissions.campuses.addByBrand]}
                            onChange={(e) => handleBrandPermissionChange(brand, e.target.checked)}
                            className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Usuarios */}
                <div className="mb-6">
                  <h5 className="text-md font-medium text-gray-800 mb-3">Usuarios</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.users.create}
                        onChange={(e) => handlePermissionChange('users', 'create', e.target.checked)}
                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Crear miembro</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.users.view}
                        onChange={(e) => handlePermissionChange('users', 'view', e.target.checked)}
                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Ver miembro</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.users.deactivate}
                        onChange={(e) => handlePermissionChange('users', 'deactivate', e.target.checked)}
                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Inactivar miembro</span>
                    </label>
                  </div>
                </div>

                {/* Presupuestos */}
                <div className="mb-6">
                  <h5 className="text-md font-medium text-gray-800 mb-3">Presupuestos</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.budgets.assign}
                        onChange={(e) => handlePermissionChange('budgets', 'assign', e.target.checked)}
                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Asignar presupuesto</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.budgets.modify}
                        onChange={(e) => handlePermissionChange('budgets', 'modify', e.target.checked)}
                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Modificar presupuesto</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Link para crear enlace de invitación */}
              <div className="mb-6">
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                  <span className="mr-2">🔗</span>
                  Crear enlace de invitación
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateUser}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Confirmar nuevo usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;