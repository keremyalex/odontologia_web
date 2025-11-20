import React, { useState, useEffect } from 'react';
import {
    UserGroupIcon,
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    HeartIcon,
    // ChartBarIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    CogIcon
} from '@heroicons/react/24/outline';
import {
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/solid';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import apiService from '../services/api';

interface DashboardStats {
    totalPacientes: number;
    citasHoy: number;
    citasPendientes: number;
    atencionesMes: number;
    especialidades: number;
    usuarios: number;
    citasCompletadas: number;
    citasCanceladas: number;
    citasAtendidasHoy: number; // Nueva métrica para eficiencia
}

interface CitaReciente {
    id: number;
    fecha: string;
    hora: string;
    paciente: {
        nombres: string;
        apellidos: string;
        ci: string;
    };
    especialidad: string;
    responsable: string;
    estado: string;
}

interface AtencionReciente {
    id: number;
    fecha: string;
    paciente: string;
    especialidad: string;
    diagnostico: string;
}

const DashboardPage: React.FC = () => {
    const { user, hasRole } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalPacientes: 0,
        citasHoy: 0,
        citasPendientes: 0,
        atencionesMes: 0,
        especialidades: 0,
        usuarios: 0,
        citasCompletadas: 0,
        citasCanceladas: 0,
        citasAtendidasHoy: 0,
    });
    const [citasRecientes, setCitasRecientes] = useState<CitaReciente[]>([]);
    const [atencionesRecientes, setAtencionesRecientes] = useState<AtencionReciente[]>([]);
    const [citasPendientesAtencion, setCitasPendientesAtencion] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                
                // Cargar datos en paralelo
                const [
                    pacientesResponse,
                    citasResponse,
                    atencionesResponse,
                    especialidadesResponse,
                    usuariosResponse,
                    citasPendientesResponse
                ] = await Promise.all([
                    apiService.getPacientes().catch(() => []),
                    apiService.getCitas().catch(() => []),
                    apiService.getAtenciones().catch(() => ({ data: [] })),
                    apiService.getEspecialidades().catch(() => []),
                    hasRole(['admin']) ? apiService.getUsers().catch(() => []) : Promise.resolve([]),
                    apiService.getCitasPendientesAtencion().catch(() => ({ data: [] }))
                ]);

                // Procesar citas
                const citas = Array.isArray(citasResponse) ? citasResponse : [];
                const citasHoy = citas.filter(cita => 
                    cita.fecha && cita.fecha.startsWith(today)
                );
                
                // Calcular citas atendidas hoy para eficiencia
                const citasAtendidasHoy = citasHoy.filter(cita => cita.estado === 'atendida');
                
                // Calcular todas las citas completadas (históricas) para el card
                const todasCitasCompletadas = citas.filter(cita => cita.estado === 'atendida');
                
                // Procesar atenciones
                const atenciones = atencionesResponse.data || [];
                
                // Contar citas atendidas este mes (más preciso que atenciones creadas)
                const citasAtendidasEsteMes = citas.filter(cita => {
                    if (!cita.fecha || cita.estado !== 'atendida') return false;
                    const citaDate = new Date(cita.fecha);
                    const now = new Date();
                    return citaDate.getMonth() === now.getMonth() && 
                           citaDate.getFullYear() === now.getFullYear();
                });

                // Obtener citas pendientes de atención
                const pendientes = citasPendientesResponse.data || [];

                setStats({
                    totalPacientes: pacientesResponse.length,
                    citasHoy: citasHoy.length,
                    citasPendientes: citas.filter(c => c.estado === 'programada').length,
                    atencionesMes: citasAtendidasEsteMes.length,
                    especialidades: especialidadesResponse.length,
                    usuarios: usuariosResponse.length,
                    citasCompletadas: todasCitasCompletadas.length, // Todas las citas atendidas históricamente
                    citasCanceladas: citas.filter(c => c.estado === 'cancelada').length,
                    citasAtendidasHoy: citasAtendidasHoy.length, // Para calcular eficiencia
                });

                // Procesar citas recientes con mejor mapeo de datos
                const citasFormateadas = citas
                    .slice(0, 5)
                    .map((cita: any) => {
                        console.log('🔍 Debug cita:', cita); // Para debugging
                        
                        return {
                            id: cita.id,
                            fecha: cita.fecha,
                            hora: cita.hora || cita.franja?.horaInicio || 'N/A',
                            paciente: {
                                nombres: cita.paciente?.nombres || cita.paciente?.nombre || 'Sin nombre',
                                apellidos: cita.paciente?.apellidos || cita.paciente?.apellido || '',
                                ci: cita.paciente?.ci || cita.paciente?.cedula || 'Sin CI'
                            },
                            especialidad: cita.franja?.especialidad?.nombre || 'No especificada',
                            responsable: cita.franja?.responsable?.nombres || 
                                       cita.franja?.responsable?.nombre || 
                                       cita.responsable?.nombres ||
                                       cita.responsable?.nombre ||
                                       'No asignado',
                            estado: cita.estado || 'programada'
                        };
                    });

                // Procesar atenciones recientes
                const atencionesFormateadas = atenciones
                    .slice(0, 5)
                    .map((atencion: any) => ({
                        id: atencion.id,
                        fecha: atencion.createdAt ? new Date(atencion.createdAt).toLocaleDateString('es-ES') : 'N/A',
                        paciente: `${atencion.cita?.paciente?.nombres || 'Sin nombre'} ${atencion.cita?.paciente?.apellidos || ''}`,
                        especialidad: atencion.cita?.franja?.especialidad?.nombre || 'No especificada',
                        diagnostico: atencion.diagnosticoPresuntivo || 'Sin diagnóstico'
                    }));

                setCitasRecientes(citasFormateadas);
                setAtencionesRecientes(atencionesFormateadas);
                setCitasPendientesAtencion(pendientes.slice(0, 5));

            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, [hasRole]);

    const getEstadoColor = (estado: string) => {
        const colors = {
            'programada': 'bg-blue-100 text-blue-800 border-blue-200',
            'atendida': 'bg-green-100 text-green-800 border-green-200',
            'cancelada': 'bg-red-100 text-red-800 border-red-200',
            'reprogramada': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'no_asistio': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getEstadoText = (estado: string) => {
        const texts = {
            'programada': 'Programada',
            'atendida': 'Atendida',
            'cancelada': 'Cancelada',
            'reprogramada': 'Reprogramada',
            'no_asistio': 'No Asistió'
        };
        return texts[estado as keyof typeof texts] || estado;
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="space-y-3">
                                        {[...Array(3)].map((_, j) => (
                                            <div key={j} className="h-16 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        ¡Bienvenido, {user?.nombre}! 👋
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Sistema de Gestión Odontológica - UAGRM
                    </p>
                    <p className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>

                {/* Stats principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalPacientes}</p>
                                </div>
                                <div className="shrink-0">
                                    <UserGroupIcon className="h-8 w-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-green-600">
                                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                Registro activo
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.citasHoy}</p>
                                </div>
                                <div className="shrink-0">
                                    <CalendarDaysIcon className="h-8 w-8 text-green-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-blue-600">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {stats.citasPendientes} pendientes
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Citas Atendidas (Mes)</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.atencionesMes}</p>
                                </div>
                                <div className="shrink-0">
                                    <HeartIcon className="h-8 w-8 text-red-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-green-600">
                                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                                Crecimiento mensual
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Especialidades</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.especialidades}</p>
                                </div>
                                <div className="shrink-0">
                                    <AcademicCapIcon className="h-8 w-8 text-purple-500" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-gray-600">
                                <DocumentTextIcon className="h-4 w-4 mr-1" />
                                Áreas activas
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats secundarios */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Completadas</p>
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{stats.citasCompletadas}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Canceladas</p>
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                            </div>
                            <p className="text-2xl font-bold text-red-600">{stats.citasCanceladas}</p>
                        </CardContent>
                    </Card>

                    {hasRole(['admin']) && (
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Usuarios</p>
                                    <CogIcon className="h-5 w-5 text-gray-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stats.usuarios}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Eficiencia</p>
                                <ChartBarIcon className="h-5 w-5 text-blue-500" />
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                {stats.citasHoy > 0 ? Math.round((stats.citasAtendidasHoy / stats.citasHoy) * 100) : 0}%
                            </p>
                        </CardContent>
                    </Card> */}
                </div>

                {/* Citas pendientes de atención */}
                {citasPendientesAtencion.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                                Citas Pendientes de Atención
                                <Badge variant="destructive">{citasPendientesAtencion.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                {citasPendientesAtencion.map((cita) => (
                                    <div key={cita.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {cita.paciente?.nombres} {cita.paciente?.apellidos}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {cita.fecha} - {cita.franja?.especialidad?.nombre}
                                            </p>
                                        </div>
                                        <Button size="sm" asChild>
                                            <a href={`/atenciones/nueva/${cita.id}`}>
                                                Atender
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Contenido principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Citas recientes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                                Citas Recientes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {citasRecientes.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No hay citas registradas</p>
                            ) : (
                                <div className="space-y-4">
                                    {citasRecientes.map((cita) => (
                                        <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">
                                                    {cita.paciente.nombres} {cita.paciente.apellidos}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {cita.fecha} {cita.hora} - {cita.especialidad}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Dr. {cita.responsable}
                                                </p>
                                            </div>
                                            <Badge className={getEstadoColor(cita.estado)}>
                                                {getEstadoText(cita.estado)}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Atenciones recientes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HeartIcon className="h-5 w-5 text-red-500" />
                                Atenciones Recientes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {atencionesRecientes.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No hay atenciones registradas</p>
                            ) : (
                                <div className="space-y-4">
                                    {atencionesRecientes.map((atencion) => (
                                        <div key={atencion.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium text-gray-900">{atencion.paciente}</p>
                                                <span className="text-xs text-gray-500">{atencion.fecha}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{atencion.especialidad}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {atencion.diagnostico.length > 50 
                                                    ? atencion.diagnostico.substring(0, 50) + '...'
                                                    : atencion.diagnostico
                                                }
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Acciones rápidas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Button asChild className="h-20 flex-col">
                                <a href="/patients/new">
                                    <UserGroupIcon className="h-6 w-6 mb-2" />
                                    Nuevo Paciente
                                </a>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex-col">
                                <a href="/atenciones">
                                    <HeartIcon className="h-6 w-6 mb-2" />
                                    Ver Atenciones
                                </a>
                            </Button>
                            {hasRole(['admin']) && (
                                <Button asChild variant="outline" className="h-20 flex-col">
                                    <a href="/admin/especialidades">
                                        <CogIcon className="h-6 w-6 mb-2" />
                                        Especialidades
                                    </a>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Progreso del día */}
                <Card>
                    <CardHeader>
                        <CardTitle>Progreso del Día</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Citas atendidas hoy</span>
                                    <span>{stats.citasAtendidasHoy}/{stats.citasHoy}</span>
                                </div>
                                <Progress 
                                    value={stats.citasHoy > 0 ? (stats.citasAtendidasHoy / stats.citasHoy) * 100 : 0} 
                                    className="w-full" 
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Citas atendidas este mes</span>
                                    <span>{stats.atencionesMes}</span>
                                </div>
                                <Progress 
                                    value={Math.min((stats.atencionesMes / 50) * 100, 100)} 
                                    className="w-full" 
                                />
                                <p className="text-xs text-gray-500 mt-1">Meta: 50 citas/mes</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;