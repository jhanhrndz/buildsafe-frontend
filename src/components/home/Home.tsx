import { 
  ArrowRight, Building2, Shield, BarChart3, Users2, Camera, 
  CheckCircle2, HardHat, TrendingUp, Layout, FileText, Warehouse 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { useEstadisticasGlobal} from '../../hooks/features/useEstadisticasGlobal';
import React from 'react';

const features = [
	{
		title: 'Gestión de Obras',
		description: 'Administra todos tus proyectos de construcción desde una única plataforma centralizada.',
		icon: Building2,
		color: 'blue'
	},
	{
		title: 'Monitoreo en Tiempo Real',
		description: 'Sistema de vigilancia continua con cámaras inteligentes para máxima seguridad.',
		icon: Camera,
		color: 'emerald'
	},
	{
		title: 'Reportes Detallados',
		description: 'Genera y gestiona reportes de seguridad con evidencia fotográfica y seguimiento.',
		icon: BarChart3,
		color: 'orange'
	},
	{
		title: 'Control personal',
		description: 'Gestión avanzada de supervisores y personal en cada área.',
		icon: Users2,
		color: 'violet'
	}
];

const Home = () => { 
	const { user } = useUserContext();
  const { totalAreas, totalObras, totalReportes, totalSupervisores } = useEstadisticasGlobal();

  // Modificamos el array stats para incluir los iconos
  const stats = [
    { 
      label: 'Obras creadas', 
      value: totalObras,
      icon: Warehouse,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'Supervisores registrados', 
      value: totalSupervisores,
      icon: Users2,
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      label: 'Reportes Generados', 
      value: totalReportes,
      icon: FileText,
      color: 'from-orange-500 to-orange-600'
    },
    { 
      label: 'Áreas creadas', 
      value: totalAreas,
      icon: Layout,
      color: 'from-violet-500 to-violet-600'
    }
  ];

	return (
		<div className="min-h-screen xl:mx-30 relative px-4 sm:px-6 lg:px-8">
			{/* Fondo fijo mejorado */}
			<div className="fixed inset-0 z-[-2] h-full w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" />
			
			{/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

			<div className="relative z-10">
				{/* Header mejorado y responsive */}
				<header className="pt-6 pb-12 sm:pt-8 sm:pb-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Logo y nombre */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 rounded-2xl blur-xl group-hover:bg-blue-600/30 transition-all duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50 group-hover:shadow-xl group-hover:scale-105 transition-all duration-500">
                  <HardHat className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800 tracking-tight">
                  Build<span className="text-blue-600">Safe</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-500 font-medium">Sistema de Gestión</p>
              </div>
            </div>

            {/* Tarjeta de usuario mejorada */}
            <div className="w-full lg:w-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:bg-white/90">
              <div className="flex items-center gap-6 p-4 sm:p-6">
                {/* Foto de perfil */}
                <div className="relative flex-shrink-0">
                  {user?.picture ? (
                    <div className="relative w-14 h-14 sm:w-12 sm:h-12">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-50"></div>
                      <img
                        src={user.picture}
                        alt={user?.nombres || 'Usuario'}
                        className="relative w-full h-full object-cover rounded-2xl border-2 border-white shadow-lg"
                      />
                    </div>
                  ) : (
                    <div className="relative w-14 h-14 sm:w-12 sm:h-12">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-50"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-xl sm:text-2xl font-bold text-white">
                          {user?.nombres?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Información del usuario */}
                <div className="flex-grow">
                  <p className="text-sm sm:text-base text-gray-500 font-medium">
                    Bienvenido al panel
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                    {user?.nombres || 'Usuario'}
                  </p>
                </div>

                {/* Indicador de estado */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Activo</span>
                </div>
              </div>
            </div>
          </div>
        </header>

				{/* Hero Section mejorado */}
				<section className="py-16">
					<div className="grid grid-cols-1 xl:grid-cols-5 gap-12 items-center">
						<div className="xl:col-span-3 space-y-8">
							<div className="space-y-6">
								<h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight">
									Panel de
									<span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
										Control
									</span>
								</h1>
								<p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
									Gestiona la seguridad de tus obras con herramientas avanzadas y monitoreo en tiempo real
								</p>
							</div>
							
							<div className="flex flex-col sm:flex-row gap-4 pt-4">
								<Link
									to="/obras"
									className="group relative overflow-hidden inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
								>
									<span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
									<span className="relative flex items-center">
										Ver Obras Activas
										<ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
									</span>
								</Link>
								
								<Link
									to="/estadisticas"
									className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm text-gray-700 font-bold border-2 border-gray-200/50 hover:border-blue-300 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
								>
									<span className="flex items-center">
										Ver Estadísticas
										<TrendingUp className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
									</span>
								</Link>
							</div>
						</div>
						
						{/* Stats Cards mejoradas */}
						<div className="xl:col-span-2">
							<div className="grid grid-cols-2 gap-4">
								{stats.map((stat, index) => (
									<div
										key={stat.label}
										className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
										style={{ animationDelay: `${index * 100}ms` }}
									>
										<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
										<div className="relative">
											<div className="flex items-center justify-between mb-3">
												<div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
													<stat.icon className="h-5 w-5 text-white" />
												</div>
												<div className="text-2xl lg:text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
													{stat.value}
												</div>
											</div>
											<p className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
												{stat.label}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Features Section completamente rediseñada */}
				<section className="py-20">
					<div className="text-center mb-16">
						<h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
							Funcionalidades
							<span className="block text-blue-600">Principales</span>
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
							Herramientas avanzadas para mantener tus obras seguras y optimizadas
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div
								key={feature.title}
								className="group relative h-full"
								style={{ animationDelay: `${index * 150}ms` }}
							>
								{/* Glow effect */}
								<div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
								
								<div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group-hover:bg-white h-full flex flex-col">
									{/* Icon container */}
									<div className="relative mb-6">
										<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
										<div className={`relative w-16 h-16 bg-gradient-to-br ${
											feature.color === 'blue' ? 'from-blue-500 to-blue-600' :
											feature.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
											feature.color === 'orange' ? 'from-orange-500 to-orange-600' :
											'from-violet-500 to-violet-600'
										} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
											<feature.icon className="h-8 w-8 text-white" />
										</div>
									</div>
									
									<div className="space-y-4 flex-grow flex flex-col">
										<h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
											{feature.title}
										</h3>
										<p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 flex-grow">
											{feature.description}
										</p>
									</div>
									
									{/* Decorative element */}
									<div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* CTA Section rediseñada */}
				<section className="py-20">
					<div className="relative">
						{/* Background gradient */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl"></div>
						<div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-700/90 rounded-3xl"></div>
						
						{/* Decorative elements */}
						<div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl">
							<div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
							<div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
						</div>
						
						<div className="relative p-8 lg:p-12">
							<div className="flex flex-col lg:flex-row items-center justify-between gap-8">
								<div className="text-center lg:text-left">
									<h2 className="text-2xl lg:text-3xl font-black text-white mb-3">
										¿Necesitas ayuda?
									</h2>
									<p className="text-blue-100 text-lg leading-relaxed max-w-md">
										Nuestro equipo de soporte especializado está disponible 24/7 para asistirte
									</p>
								</div>
								
								<div className="flex flex-col sm:flex-row gap-4">
									<Link
										to="/#"
										className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
									>
										<span className="flex items-center">
											Contactar Soporte
											<Shield className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
										</span>
									</Link>
									
									<Link
										to="/#"
										className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
									>
										<span className="flex items-center">
											Ver Guía
											<CheckCircle2 className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
										</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Home;