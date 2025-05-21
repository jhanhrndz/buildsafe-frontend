import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './hooks/api';
import { Login } from './components/login/Login';
import { Register } from './components/register/Register';
import { PrivateRoute } from './components/routes/PrivateRoute';
import { AuthRoute } from './components/routes/AuthRoute';
import { CompleteRegistrationRoute } from './components/routes/CompleteRegistrationRoute';
import Home from './components/home/Home';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import NotFound from './components/shared/NotFound';
import ObrasPage from './components/obras/ObrasPage';
import ObraDetalle from './components/obras/ObraDetalle';
import { CompleteRegistration } from './components/login/CompleteRegistration';
import AreaDetallePage from './components/areas/AreaDetallesPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            
            {/* Rutas de autenticación: protegidas para usuarios ya autenticados */}
            <Route 
              path="/login" 
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              } 
            />

            {/* Ruta de completar registro */}
            <Route
              path="/complete-registration"
              element={
                <CompleteRegistrationRoute>
                  <CompleteRegistration />
                </CompleteRegistrationRoute>
              }
            /> 

            {/* Rutas privadas que requieren autenticación completa */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              {/* Rutas hijas del layout */}
              <Route index element={<Home />} />
              <Route path="obras" element={<ObrasPage />} />

              {/* Rutas de obra y sus subrecursos */}
              <Route path="obras/:id" element={<ObraDetalle />} />
              <Route path="obras/:id/supervisores" element={<ObraDetalle />} />
              <Route path="obras/:id/reportes" element={<ObraDetalle />} />
              <Route path="obras/:id/estadisticas" element={<ObraDetalle />} />
              <Route path="areas/:areaId" element={<AreaDetallePage />} />
              {/* Aquí puedes agregar más rutas hijas */}
            </Route> 

            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  )
}

export default App;