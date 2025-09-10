import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen,
  Building2,
  Calendar,
  History,
  Calculator,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programs-catalog', label: 'Catálogo de programas', icon: BookOpen },
    { id: 'campuses', label: 'Catálogo de planteles', icon: Building2 },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'historical-enrollment', label: 'Matrícula histórica', icon: History },
    { id: 'projections', label: 'Proyecciones', icon: Calculator },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 ease-in-out relative`}>
        {/* Header with Lottus Logo */}
        <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-gray-200 flex items-center justify-between transition-all duration-300`}>
          {!isCollapsed && (
            <div className="flex items-center">
              <svg width="120" height="27" viewBox="0 0 120 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_lottus_logo)">
                  <path d="M27.0839 26.8913V0H4.87886H0V22.0316V26.8913H4.87886H13.5419V22.0316H4.87886V4.85969L27.0839 26.8913Z" fill="#00A994"/>
                  <path d="M37.686 16.1335V0.28125H40.9073V13.0903H49.0075V16.1335H37.686Z" fill="#13294B"/>
                  <path d="M51.8227 14.0512C50.2433 12.483 49.4458 10.5578 49.4458 8.25989C49.4458 5.96205 50.2433 4.00575 51.8383 2.40656C53.4646 0.791687 55.4349 0 57.7649 0C60.0948 0 62.0651 0.791687 63.6602 2.40656C65.2864 4.02144 66.0839 5.94637 66.0839 8.22851C66.0839 10.4957 65.2864 12.4364 63.6602 14.0201C62.0651 15.6038 60.0948 16.3956 57.7336 16.3956C55.388 16.3956 53.402 15.6194 51.8227 14.0512ZM61.2989 4.59574C60.3294 3.63312 59.1566 3.13628 57.7493 3.13628C56.3419 3.13628 55.1847 3.63312 54.1996 4.59574C53.2301 5.55836 52.7453 6.78493 52.7453 8.22851C52.7453 9.67209 53.2144 11.1157 54.1683 12.0783C55.1378 13.0409 56.3263 13.5249 57.7336 13.5249C59.141 13.5249 60.3294 13.0591 61.2989 12.0783C62.2684 11.1157 62.7532 9.65709 62.7219 8.22851C62.7532 6.75389 62.2841 5.55836 61.2989 4.59574Z" fill="#13294B"/>
                  <path d="M70.6339 3.35543H66.0835V0.28125H81.2047V3.35543H73.8865V16.1335H70.6339V3.35543Z" fill="#13294B"/>
                  <path d="M84.2227 3.35543H79.6567V0.28125H92.01V3.35543H87.4597V16.1335H84.2227V3.35543Z" fill="#13294B"/>
                  <path d="M93.5742 0.28125H96.7956V10.1248C96.7956 12.2519 97.9371 13.3232 99.8137 13.3232C101.627 13.3232 102.785 12.1898 102.785 10.1248V0.28125H106.022V10.3423C106.022 12.3298 105.427 13.8356 104.255 14.8758C103.081 15.9006 101.597 16.4284 99.8137 16.4284C98.0153 16.4284 96.5298 15.9161 95.3571 14.8758C94.1844 15.8506 93.5742 12.3453 93.5742 10.3423V0.28125Z" fill="#13294B"/>
                  <path d="M107.366 13.4282L109.196 11.2238C110.243 12.6674 111.822 13.4282 113.433 13.4282C114.746 13.4282 115.621 12.745 115.621 11.736C115.621 11.1082 115.151 10.5405 114.184 10.0901C113.964 9.98156 113.443 9.79525 112.698 9.48192C111.985 9.16859 111.244 8.89814 110.806 8.66057C109.133 7.65267 108.281 6.33292 108.281 4.67147C108.281 3.33634 108.782 2.24953 109.8 1.36355C110.819 0.477563 112.135 0.0292969 113.746 0.0292969C115.825 0.0292969 117.592 0.743501 119.001 2.17208L117.279 4.48541C116.357 3.53817 114.965 3.01038 113.777 3.01038C112.464 3.01038 111.728 3.61588 111.728 4.53151C111.728 5.15292 112.151 5.66533 113.026 6.09997L114.621 6.78318C115.527 7.15576 116.169 7.41983 116.576 7.61614C118.391 8.50675 119.266 9.81112 119.266 11.5651C119.266 12.9778 118.718 14.1425 117.64 15.0431C116.561 15.9437 115.151 16.3939 113.401 16.3939C110.884 16.3939 108.688 15.3378 107.366 13.4282Z" fill="#13294B"/>
                  <path d="M37.8105 26.8929V20.8066H41.5009V21.2879H38.3131V23.5711H41.2821V24.0516H38.3131V26.4116H41.5166V26.8929H37.8105Z" fill="#13294B"/>
                  <path d="M46.9439 26.8929V20.8066H49.0549C49.9306 20.8066 50.6031 21.0861 51.1034 21.6295C51.6037 22.1729 51.8696 22.9179 51.8696 23.8647C51.8696 24.7969 51.6194 25.5419 51.1034 26.0853C50.5874 26.6287 49.8836 26.9082 49.0078 26.9082H46.9439V26.8929ZM47.4442 26.4116H48.9921C49.7116 26.4116 50.2903 26.1782 50.7281 25.7122C51.1659 25.2471 51.3879 24.6261 51.3879 23.8498C51.3879 23.0735 51.1659 22.4525 50.7281 21.9866C50.3059 21.5208 49.7429 21.2879 48.9764 21.2879H47.4442V26.4116Z" fill="#13294B"/>
                  <path d="M57.2329 20.8066H57.7332V24.8279C57.7332 25.8836 58.3119 26.4894 59.297 26.4894C60.2821 26.4894 60.8608 25.8682 60.8608 24.8279V20.8066H61.3612V24.9056C61.3612 25.5577 61.1705 26.07 60.7891 26.4432C60.4079 26.8164 59.8919 26.986 59.297 26.986C58.7021 26.986 58.1861 26.7997 57.8049 26.4432C57.4237 26.07 57.2329 25.5577 57.2329 24.9056V20.8066Z" fill="#13294B"/>
                  <path d="M67.6161 26.1321C67.0056 25.526 66.7084 24.7967 66.7084 23.8802C66.7084 22.9642 67.0212 22.2034 67.6317 21.6142C68.2572 21.0079 69.0017 20.7129 69.8618 20.7129C70.415 20.7129 70.9467 20.8374 71.4315 21.0864C71.9162 21.3354 72.2759 21.66 72.5261 22.0481L72.1449 22.3431C71.6915 21.6447 70.8471 21.1944 69.8618 21.1944C69.1173 21.1944 68.4761 21.4434 67.9758 21.955C67.4755 22.4511 67.2222 23.1031 67.2222 23.8802C67.2222 24.6418 67.4755 25.2776 67.9758 25.7737C68.4761 26.2698 69.1173 26.5188 69.8618 26.5188C70.7906 26.5188 71.6351 26.0849 72.1606 25.3865L72.5261 25.6813C72.1918 26.2231 71.4628 26.7357 69.8461 26.7357C69.0017 26.7665 68.2415 26.5498 67.6161 26.1321Z" fill="#13294B"/>
                  <path d="M81.6113 26.8929L80.8918 25.0455H78.3516L77.6321 26.8929H77.1162L79.6564 20.8066H79.9379L82.4625 26.8929H81.6113ZM79.4065 21.7074L78.2338 24.5641H80.5792L79.4065 21.7074Z" fill="#13294B"/>
                  <path d="M87.8662 21.2879H86.0059V20.8066H90.2297V21.2879H88.3694V26.8929H87.8662V21.2879Z" fill="#13294B"/>
                  <path d="M95.8252 20.8066H95.325V26.8929H95.8252V20.8066Z" fill="#13294B"/>
                  <path d="M102.144 26.0679C101.518 25.4616 101.236 24.7163 101.236 23.8627C101.236 22.9932 101.534 22.2479 102.16 21.6261C102.785 21.0058 103.545 20.7203 104.396 20.7203C105.247 20.7203 105.991 21.0058 106.616 21.6113C107.257 22.2324 107.562 22.9622 107.562 23.8316C107.562 24.701 107.241 25.4308 106.616 26.0519C105.991 26.673 105.231 26.9679 104.38 26.9679C103.514 26.9834 102.769 26.6884 102.144 26.0679ZM106.24 25.7267C106.74 25.2291 107.006 24.5925 107.006 23.8627C107.006 23.1174 106.74 22.4808 106.24 21.9832C105.74 21.4856 105.103 21.2212 104.38 21.2212C103.657 21.2212 103.019 21.4856 102.504 21.9832C102.003 22.4808 101.737 23.1174 101.737 23.8471C101.737 24.5925 101.987 25.2135 102.504 25.7258C103.004 26.2234 103.641 26.4616 104.38 26.4616C105.103 26.4771 105.74 26.2389 106.24 25.7267Z" fill="#13294B"/>
                  <path d="M117.124 20.8066H117.639V26.8929H117.374L113.436 21.9677V26.8929H112.918V20.8066H113.152L117.124 25.8061V20.8066Z" fill="#13294B"/>
                </g>
                <defs>
                  <clipPath id="clip0_lottus_logo">
                    <rect width="119.266" height="27" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          )}
          
          {isCollapsed && (
            <svg width="24" height="18" viewBox="0 0 24 18" className="mx-auto">
              <path d="M18.0559 17.9275V0H3.25257H0V14.6878V17.9275H3.25257H9.02795V14.6878H3.25257V3.23979L18.0559 17.9275Z" fill="#00A994"/>
            </svg>
          )}
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>
        
        <nav className={`${isCollapsed ? 'mt-4' : 'mt-6'} transition-all duration-300`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'px-4 py-3 justify-center' : 'px-6 py-3'} text-left transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700 border-r-3 border-teal-500' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} transition-all duration-200`} />
                {!isCollapsed && (
                  <span className="transition-all duration-200">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Footer info when expanded */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-6 right-6">
            <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
              <p className="font-medium">Sistema Financiero</p>
              <p>Versión 2024.01</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export default Layout;