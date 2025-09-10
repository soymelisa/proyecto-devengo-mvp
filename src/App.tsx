import React, { useState } from 'react';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Projections from './components/Projections';
import Reports from './components/Reports';
import Campuses from './components/Campuses';
import Settings from './components/Settings';
import HistoricalEnrollment from './components/HistoricalEnrollment';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para manejar el login exitoso
  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentSection('dashboard'); // Asegurar que inicie en dashboard
  };

  // Move useEffect to top level - hooks must always be called in the same order
  React.useEffect(() => {
    if (!isAuthenticated) {
      (window as any).onLogin = handleLogin;
      return () => {
        delete (window as any).onLogin;
      };
    }
  }, [isAuthenticated]);

  // Simulación de autenticación - en producción esto vendría de un contexto de auth
  if (!isAuthenticated) {
    return <Login />;
  }

  // Componente temporal para secciones no implementadas
  const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">Esta sección está en desarrollo</p>
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <span className="text-sm">Próximamente disponible</span>
        </div>
      </div>
    </div>
  );
  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'programs-catalog':
        return <ComingSoon title="Catálogo de programas" />;
      case 'campuses':
        return <Campuses />;
      case 'calendar':
        return <ComingSoon title="Calendario" />;
      case 'historical-enrollment':
        return <HistoricalEnrollment />;
      case 'projections':
        return <Projections />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentSection={currentSection} onSectionChange={setCurrentSection}>
      {renderContent()}
    </Layout>
  );
}

export default App;