import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './hooks/api';
import { Login } from './components/login/Login';
import { RegisterForm } from './components/register/Register';
import { PrivateRoute } from './components/shared/PrivateRoute';
import { NotAuthorized } from './components/shared/NotAuthorized';
import Home from './components/home/Home';

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* Rutas privadas */}
            <Route path="/" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }/>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  )
}
export default App;
