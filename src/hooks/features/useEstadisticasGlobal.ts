import { useEffect, useState } from 'react';
import { useObrasContext } from '../../context/ObrasContext';
import { useUserContext } from '../../context/UserContext';
import { useAreasContext } from '../../context/AreasContext';
import { useSupervisores } from '../../context/SupervisoresContext';
import { useCamarasContext } from '../../context/CamarasContext';
import { useReportsContext } from '../../context/ReportsContext';
import type { Area } from '../../types/entities';

export function useEstadisticasGlobal() {
  const { user } = useUserContext();
  const { obras, refresh: refreshObras } = useObrasContext();
  const { fetchAreasAndReturn } = useAreasContext();
  const { fetchSupervisoresAndReturn } = useSupervisores();
  const { fetchCamarasAndReturn } = useCamarasContext();
  const { fetchReportesAndReturn } = useReportsContext();

  const [areas, setAreas] = useState<any[]>([]);
  const [supervisores, setSupervisores] = useState<any[]>([]);
  const [camaras, setCamaras] = useState<any[]>([]);
  const [reportes, setReportes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refresca las obras cuando cambia el usuario
  useEffect(() => {
    if (user?.id_usuario) {
      refreshObras();
    }
    // eslint-disable-next-line
  }, [user?.id_usuario]);

  // Carga todos los datos relacionados a las obras del coordinador
  useEffect(() => {
    const cargarTodo = async () => {
      setIsLoading(true);
      const misObras = obras.filter(o => o.id_coordinador === user?.id_usuario);

      let todasAreas: any[] = [];
      let todosSupervisores: any[] = [];
      let todasCamaras: any[] = [];
      let todosReportes: any[] = [];

      for (const obra of misObras) {
        // Áreas
        const areasObra = await fetchAreasAndReturn(obra.id_obra);
        todasAreas = [...todasAreas, ...areasObra];

        // Supervisores
        const supervisoresObra = await fetchSupervisoresAndReturn(obra.id_obra);
        todosSupervisores = [...todosSupervisores, ...supervisoresObra];

        // Cámaras
        const camarasObra = await fetchCamarasAndReturn(obra.id_obra);
        todasCamaras = [...todasCamaras, ...camarasObra];

        // Reportes
        const reportesObra = await fetchReportesAndReturn(obra.id_obra);
        todosReportes = [...todosReportes, ...reportesObra];
      }

      setAreas(todasAreas);
      setSupervisores(todosSupervisores);
      setCamaras(todasCamaras);
      setReportes(todosReportes);
      setIsLoading(false);
    };

    if (user?.id_usuario && obras.length > 0) {
      cargarTodo();
    }
    // eslint-disable-next-line
  }, [user?.id_usuario, obras]);

  // Procesamiento de estadísticas después de cargar los datos
  const processStats = () => {
    if (!areas.length || !supervisores.length || !reportes.length) return;

    // 1. Estadísticas de Reportes
    const reportesPorEstado = reportes.reduce((acc: Record<string, number>, r: any) => {
      acc[r.estado] = (acc[r.estado] || 0) + 1;
      return acc;
    }, {});

    const reportesPorObra = obras.map(obra => ({
      obra,
      total: reportes.filter(r => r.id_obra === obra.id_obra).length
    }));

    const reportesPorArea = areas.map(area => ({
      area,
      total: reportes.filter(r => r.id_area === area.id_area).length
    }));

    const reportesPorSupervisor = supervisores.map(supervisor => ({
      supervisor,
      total: reportes.filter(r => r.id_usuario === supervisor.id_usuario).length
    }));

    // 2. Estadísticas de Obras
    const obrasPorEstado = obras.reduce((acc: Record<string, number>, o: any) => {
      acc[o.estado] = (acc[o.estado] || 0) + 1;
      return acc;
    }, {});

    const obrasStats = obras.map(obra => {
      const areasObra = areas.filter(a => a.id_obra === obra.id_obra);
      const supervisoresObra = supervisores.filter(s => 
        s.areas.some((a: Area) => areasObra.some(ao => ao.id_area === a.id_area))
      );
      const camarasObra = camaras.filter(c => 
        areasObra.some(a => a.id_area === c.id_area)
      );
      const reportesObra = reportes.filter(r => r.id_obra === obra.id_obra);

      return {
        ...obra,
        totalAreas: areasObra.length,
        totalSupervisores: supervisoresObra.length,
        totalCamaras: camarasObra.length,
        totalReportes: reportesObra.length,
        reportesPendientes: reportesObra.filter(r => r.estado === 'pendiente').length
      };
    });

    // 3. Estadísticas de Áreas
    const areasStats = areas.map(area => {
      const obra = obras.find(o => o.id_obra === area.id_obra);
      const supervisor = supervisores.find(s => 
        s.areas.some((a: Area) => a.id_area === area.id_area)
      );
      const camarasArea = camaras.filter(c => c.id_area === area.id_area);
      const reportesArea = reportes.filter(r => r.id_area === area.id_area);

      return {
        ...area,
        nombreObra: obra?.nombre || 'Sin obra',
        supervisor: supervisor ? `${supervisor.nombres} ${supervisor.apellidos}` : 'Sin asignar',
        totalCamaras: camarasArea.length,
        camarasActivas: camarasArea.filter(c => c.estado === 'activa').length,
        totalReportes: reportesArea.length,
        reportesPendientes: reportesArea.filter(r => r.estado === 'pendiente').length,
        ultimoReporte: reportesArea.length > 0 
          ? Math.max(...reportesArea.map(r => new Date(r.fecha_hora).getTime()))
          : null
      };
    });

    // 4. Estadísticas de Supervisores
    const supervisoresStats = supervisores.map(supervisor => {
      const areasAsignadas = supervisor.areas || [];
      const reportesSupervisor = reportes.filter(r => r.id_usuario === supervisor.id_usuario);

      return {
        ...supervisor,
        totalAreas: areasAsignadas.length,
        totalReportes: reportesSupervisor.length,
        reportesPendientes: reportesSupervisor.filter(r => r.estado === 'pendiente').length,
        ultimoReporte: reportesSupervisor.length > 0 
          ? Math.max(...reportesSupervisor.map(r => new Date(r.fecha_hora).getTime()))
          : null
      };
    });

    return {
      // Estadísticas generales
      totalReportes: reportes.length,
      totalObras: obras.length,
      totalAreas: areas.length,
      totalSupervisores: supervisores.length,
      totalCamaras: camaras.length,

      // Reportes
      reportesPorEstado,
      reportesPorObra,
      reportesPorArea,
      reportesPorSupervisor,

      // Obras
      obrasPorEstado,
      obrasStats,

      // Áreas
      areasStats,

      // Supervisores
      supervisoresStats
    };
  };

  // Procesar estadísticas cuando los datos estén listos
  const stats = processStats();

  return {
    isLoading,
    misObras: obras,
    areasDeMisObras: areas,
    supervisoresDeMisObras: supervisores,
    camaras,
    reportesDeMisObras: reportes,
    ...stats // Incluir todas las estadísticas procesadas
  };
}