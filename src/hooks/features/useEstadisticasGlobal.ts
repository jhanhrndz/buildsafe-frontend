import { useObrasContext } from '../../context/ObrasContext';
import { useAreasContext } from '../../context/AreasContext';
import { useCamarasContext } from '../../context/CamarasContext';
import { useReportsContext } from '../../context/ReportsContext';
import { useSupervisores } from '../../context/SupervisoresContext';
import { useUserContext } from '../../context/UserContext';

export function useEstadisticasGlobal() {
  const { obras } = useObrasContext();
  const { areas } = useAreasContext();
  const { camaras } = useCamarasContext();
  const { reportes } = useReportsContext();
  const { supervisores } = useSupervisores();
  const { user } = useUserContext();

  // Filtra solo las obras del coordinador
  const misObras = obras.filter(o => o.id_coordinador === user?.id_usuario);

  // Áreas de mis obras
  const areasDeMisObras = areas.filter(a => misObras.some(o => o.id_obra === a.id_obra));

  // Reportes de mis obras
  const reportesDeMisObras = reportes.filter(r => misObras.some(o => o.id_obra === r.id_obra));

  // Supervisores de mis obras
  const supervisoresDeMisObras = supervisores;

  // Estadísticas generales
  const totalReportes = reportesDeMisObras.length;
  const reportesPorEstado = {
    pendiente: reportesDeMisObras.filter(r => r.estado === 'pendiente').length,
    'en revisión': reportesDeMisObras.filter(r => r.estado === 'en revisión').length,
    cerrado: reportesDeMisObras.filter(r => r.estado === 'cerrado').length,
  };

  // Reportes por área
  const reportesPorArea = areasDeMisObras.map(area => ({
    area,
    total: reportesDeMisObras.filter(r => r.id_area === area.id_area).length,
  }));

  // Reportes por obra
  const reportesPorObra = misObras.map(obra => ({
    obra,
    total: reportesDeMisObras.filter(r => r.id_obra === obra.id_obra).length,
  }));

  // Reportes por supervisor
  const reportesPorSupervisor = supervisoresDeMisObras.map(sup => ({
    supervisor: sup,
    total: reportesDeMisObras.filter(r => r.id_usuario === sup.id_usuario).length,
  })).sort((a, b) => b.total - a.total);

  return {
    misObras,
    areasDeMisObras,
    camaras,
    reportesDeMisObras,
    supervisoresDeMisObras,
    totalReportes,
    reportesPorEstado,
    reportesPorArea,
    reportesPorObra,
    reportesPorSupervisor,
  };
}