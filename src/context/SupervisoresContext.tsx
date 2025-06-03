import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SupervisorWithAreas } from '../types/entities';
import { obraUsuarioService } from '../services/obraUsuario';

interface SupervisoresContextProps {
    supervisores: SupervisorWithAreas[];
    loading: boolean;
    error: string | null;
    fetchSupervisores: (obraId: number) => Promise<void>;
    asignarSupervisor: (obraId: number, email: string) => Promise<void>;
    quitarSupervisor: (obraId: number, usuarioId: number) => Promise<void>; // <-- cambia aquí
    fetchSupervisoresAndReturn: (obraId: number) => Promise<SupervisorWithAreas[]>;
}

const SupervisoresContext = createContext<SupervisoresContextProps | undefined>(undefined);

export const SupervisoresProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [supervisores, setSupervisores] = useState<SupervisorWithAreas[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSupervisores = useCallback(async (obraId: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await obraUsuarioService.getSupervisoresConAreas(obraId);
            setSupervisores(data);
        } catch (err: any) {
            setError('Error al cargar supervisores');
        } finally {
            setLoading(false);
        }
    }, []);

    const asignarSupervisor = useCallback(async (obraId: number, email: string) => {
        setLoading(true);
        setError(null);
        try {
            await obraUsuarioService.assignSupervisorByEmail(obraId, email);
            await fetchSupervisores(obraId);
        } catch (err: any) {
            setError('Error al asignar supervisor');
        } finally {
            setLoading(false);
        }
    }, [fetchSupervisores]);

    const quitarSupervisor = useCallback(
        async (obraId: number, usuarioId: number) => {
            setLoading(true);
            setError(null);
            try {
                await obraUsuarioService.removeSupervisorById(obraId, usuarioId);
                await fetchSupervisores(obraId);
            } catch (err: any) {
                setError('Error al quitar supervisor');
            } finally {
                setLoading(false);
            }
        },
        [fetchSupervisores]
    );

    const fetchSupervisoresAndReturn = useCallback(async (obraId: number) => {
        try {
            const data = await obraUsuarioService.getSupervisoresConAreas(obraId);
            return data;
        } catch (e) {
            return [];
        }
    }, []);

    return (
        <SupervisoresContext.Provider value={{
            supervisores,
            loading,
            error,
            fetchSupervisores,
            asignarSupervisor,
            quitarSupervisor,
            fetchSupervisoresAndReturn
        }}>
            {children}
        </SupervisoresContext.Provider>
    );
};

export const useSupervisores = () => {
    const ctx = useContext(SupervisoresContext);
    if (!ctx) throw new Error('useSupervisores debe usarse dentro de SupervisoresProvider');
    return ctx;
};