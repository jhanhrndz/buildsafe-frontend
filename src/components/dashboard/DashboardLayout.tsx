import { Outlet, useOutletContext } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';

// Definir el tipo para el contexto
type DashboardContextType = {
    updateTitle: (title: string) => void;
};

export const DashboardLayout = () => {
    const [pageTitle, setPageTitle] = useState('Dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const updateTitle = (title: string) => {
        setPageTitle(title);
    };

    // Cerrar menú móvil cuando cambia la ventana
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Contenido principal */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar superior */}
                <Navbar setPageTitle={setPageTitle} />


                {/* Contenido de la página actual */}
                <div className="flex-1 overflow-auto p-6">
                    <Outlet context={{ updateTitle } as DashboardContextType} />
                </div>

                {/* Footer */}
                <footer className="bg-white px-6 py-4 border-t border-gray-200 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} BuildSafe - Todos los derechos reservados
                </footer>
            </main>
        </div>
    );
};

export function useDashboardContext() {
    return useOutletContext<DashboardContextType>();
}