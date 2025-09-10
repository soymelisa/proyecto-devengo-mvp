import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de proceso de autenticación
    setIsLoading(true);
    
    // Simular delay de autenticación (opcional para UX realista)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Aceptar cualquier combinación de email y contraseña
    if (email.trim() && password.trim()) {
      console.log('Login successful:', { email, rememberMe });
      // Llamar función de autenticación del componente padre
      if (window.onLogin) {
        window.onLogin();
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header con logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg width="160" height="36" viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2425_3935)">
              <path d="M36.1119 35.8551V0H6.50514H0V29.3755V35.8551H6.50514H18.0559V29.3755H6.50514V6.47959L36.1119 35.8551Z" fill="#00A994"/>
              <path d="M50.248 21.5113V0.375H54.5431V17.4538H65.3433V21.5113H50.248Z" fill="#13294B"/>
              <path d="M69.0969 18.7349C66.9911 16.644 65.9277 14.0771 65.9277 11.0132C65.9277 7.9494 66.9911 5.341 69.1178 3.20874C71.2861 1.05578 73.9132 0 77.0198 0C80.1265 0 82.7535 1.05578 84.8802 3.20874C87.0486 5.3617 88.1119 7.92869 88.1119 10.9718C88.1119 13.9943 87.0486 16.5819 84.8802 18.6935C82.7535 20.8051 80.1265 21.8608 76.9781 21.8608C73.8507 21.8608 71.2027 20.8258 69.0969 18.7349ZM81.7319 6.12766C80.4392 4.84416 78.8755 4.18171 76.999 4.18171C75.1225 4.18171 73.5796 4.84416 72.2661 6.12766C70.9734 7.41116 70.327 9.04658 70.327 10.9718C70.327 12.8971 70.9525 14.4911 72.2244 15.7746C73.5171 17.0581 75.1017 17.6998 76.9781 17.6998C78.8546 17.6998 80.4392 17.0788 81.7319 15.7746C83.0246 14.4911 83.6709 12.8764 83.6292 10.9718C83.6709 9.00518 83.0454 7.41116 81.7319 6.12766Z" fill="#13294B"/>
              <path d="M94.1786 4.47391H88.1113V0.375H108.273V4.47391H98.5154V21.5113H94.1786V4.47391Z" fill="#13294B"/>
              <path d="M112.297 4.47391H106.209V0.375H122.68V4.47391H116.613V21.5113H112.297V4.47391Z" fill="#13294B"/>
              <path d="M124.766 0.375H129.061V13.4998C129.061 16.3359 130.583 17.7643 133.085 17.7643C135.503 17.7643 137.046 16.2531 137.046 13.4998V0.375H141.362V13.7896C141.362 16.4394 140.591 18.4475 139.006 19.8345C137.442 21.2008 135.462 21.9046 133.085 21.9046C130.687 21.9046 128.706 21.2215 127.122 19.8345C125.537 18.4682 124.766 16.4601 124.766 13.7896V0.375Z" fill="#13294B"/>
              <path d="M143.154 17.9045L145.594 14.9649C146.97 16.8901 149.055 17.9045 151.244 17.9045C152.995 17.9045 154.288 16.9936 154.288 15.648C154.288 14.7993 153.663 14.054 152.37 13.4537C152.078 13.3088 151.39 13.0603 150.264 12.6256C149.18 12.1909 148.325 11.7975 147.762 11.487C145.51 10.2035 144.384 8.44389 144.384 6.22883C144.384 4.44849 145.052 2.99938 146.407 1.8194C147.762 0.639408 149.513 0.0390625 151.661 0.0390625C154.434 0.0390625 156.748 0.991334 158.667 2.89588L156.373 5.98041C155.185 4.71761 153.287 4.01376 151.703 4.01376C149.993 4.01376 148.971 4.82112 148.971 6.04251C148.971 6.87057 149.555 7.55373 150.702 8.13337L152.808 9.04424C153.996 9.54107 154.851 9.893 155.393 10.1621C157.812 11.3421 159.021 13.081 159.021 15.4203C159.021 17.3042 158.291 18.8568 156.853 20.0575C155.414 21.2582 153.538 21.8585 151.202 21.8585C147.908 21.8585 144.906 20.4508 143.154 17.9045Z" fill="#13294B"/>
              <path d="M50.4141 35.8572V27.7422H55.3346V28.3839H51.0813V31.4271H55.0427V32.0688H51.0813V35.2155H55.3555V35.8572H50.4141Z" fill="#13294B"/>
              <path d="M62.5918 35.8572V27.7422H65.4065C66.5741 27.7422 67.4706 28.1148 68.1378 28.8394C68.805 29.5639 69.1595 30.5576 69.1595 31.8204C69.1595 33.0625 68.8259 34.0562 68.1378 34.7807C67.4498 35.5053 66.5116 35.8779 65.3231 35.8779H62.5918V35.8572ZM63.259 35.2154H65.3023C66.2822 35.2154 67.0537 34.9049 67.6166 34.2839C68.1795 33.6628 68.4506 32.8348 68.4506 31.7997C68.4506 30.7646 68.1795 29.9366 67.6166 29.3155C67.0745 28.6945 66.3239 28.3839 65.3648 28.3839H63.259V35.2154Z" fill="#13294B"/>
              <path d="M76.3105 27.7422H76.9777V33.1039C76.9777 34.5116 77.7492 35.319 79.0627 35.319C80.3763 35.319 81.1477 34.4909 81.1477 33.1039V27.7422H81.8149V33.2074C81.8149 34.0769 81.5647 34.76 81.0643 35.2568C80.5639 35.7537 79.8967 35.9814 79.0627 35.9814C78.2287 35.9814 77.5615 35.733 77.0611 35.2568C76.5607 34.76 76.3105 34.0769 76.3105 33.2074V27.7422Z" fill="#13294B"/>
              <path d="M90.1546 34.8213C89.3415 34.0347 88.9453 33.0617 88.9453 31.8403C88.9453 30.6189 89.3623 29.6045 90.1755 28.8179C91.0095 28.0105 91.9894 27.6172 93.157 27.6172C93.8867 27.6172 94.5956 27.7828 95.242 28.114C95.8883 28.4453 96.3679 28.88 96.7015 29.3975L96.1802 29.7909C95.5756 28.8593 94.4288 28.2589 93.157 28.2589C92.1562 28.2589 91.3014 28.5902 90.6342 29.2733C89.967 29.9358 89.6334 30.8052 89.6334 31.8403C89.6334 32.8547 89.967 33.7035 90.6342 34.3659C91.3014 35.0284 92.1562 35.3596 93.157 35.3596C94.3871 35.3596 95.513 34.7799 96.2219 33.8484L96.7015 34.2417C95.9092 35.2975 94.6165 35.9806 93.1361 35.9806C91.9477 35.9806 90.9469 35.5873 90.1546 34.8213Z" fill="#13294B"/>
              <path d="M108.815 35.8572L107.835 33.3937H104.395L103.415 35.8572H102.686L105.938 27.7422H106.313L109.545 35.8572H108.815ZM106.126 28.9429L104.625 32.7727H107.627L106.126 28.9429Z" fill="#13294B"/>
              <path d="M117.155 28.3839H114.674V27.7422H120.303V28.3839H117.822V35.8572H117.155V28.3839Z" fill="#13294B"/>
              <path d="M127.767 27.7422H127.1V35.8572H127.767V27.7422Z" fill="#13294B"/>
              <path d="M136.192 34.7565C135.379 33.9491 134.982 32.9554 134.982 31.8169C134.982 30.6576 135.399 29.6639 136.213 28.8358C137.026 28.0078 138.026 27.5938 139.194 27.5938C140.362 27.5938 141.342 28.0078 142.155 28.8151C142.989 29.6432 143.385 30.6162 143.385 31.7755C143.385 32.9347 142.968 33.9077 142.155 34.7358C141.342 35.5638 140.341 35.9572 139.173 35.9572C137.985 35.9779 137.005 35.5845 136.192 34.7565ZM141.654 34.3218C142.322 33.6386 142.676 32.7898 142.676 31.8169C142.676 30.8232 142.322 29.9744 141.654 29.2913C140.987 28.6081 140.153 28.2562 139.173 28.2562C138.193 28.2562 137.359 28.6081 136.671 29.2913C136.004 29.9744 135.65 30.8232 135.65 31.7962C135.65 32.7898 135.983 33.6179 136.671 34.3011C137.338 34.9842 138.172 35.3154 139.173 35.3154C140.153 35.3361 140.987 35.0049 141.654 34.3218Z" fill="#13294B"/>
              <path d="M156.165 27.7422H156.853V35.8572H156.499L151.245 29.2534V35.8572H150.557V27.7422H150.869L156.165 34.4081V27.7422Z" fill="#13294B"/>
            </g>
            <defs>
              <clipPath id="clip0_2425_3935">
                <rect width="159.022" height="36" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Accede a tu cuenta del sistema financiero
        </p>
      </div>

      {/* Formulario de login */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                  placeholder="correo@lottus.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !email.trim() || !password.trim()}
                className="flex w-full justify-center rounded-lg bg-teal-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </div>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">¿Necesitas ayuda?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Contacta al administrador del sistema para obtener acceso
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Sistema Financiero Lottus Education © 2024
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Versión 2024.01
        </p>
      </div>
    </div>
  );
};

export default Login;