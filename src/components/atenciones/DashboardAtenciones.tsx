import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    TrendingUp, 
    Stethoscope, 
    Activity, 
    Clock, 
    FileText, 
    AlertTriangle,
    RefreshCw,
    Loader2,
    BarChart3,
    PieChart
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import type { Atencion, CitaPendienteAtencion } from '@/types/atenciones';

interface EstadisticasAtencion {
    totalAtenciones: number;
    atencionesHoy: number;
    atencionesSemana: number;
    atencionesMes: number;
    citasPendientes: number;
    especialidadesActivas: number;
    promedioAtencionesDiarias: number;
}

interface EspecialidadStats {
    especialidad: string;
    cantidad: number;
    porcentaje: number;
}

const DashboardAtenciones: React.FC = () => {
    const [estadisticas, setEstadisticas] = useState<EstadisticasAtencion | null>(null);
    const [atencionesPorEspecialidad, setAtencionesPorEspecialidad] = useState<EspecialidadStats[]>([]);
    const [atencionesRecientes, setAtencionesRecientes] = useState<Atencion[]>([]);
    const [citasPendientes, setCitasPendientes] = useState<CitaPendienteAtencion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            
            // Cargar datos en paralelo
            const [atencionesResponse, citasResponse] = await Promise.all([
                apiService.getAtenciones(),
                apiService.getCitasPendientesAtencion()
            ]);

            console.log('Respuesta atenciones:', atencionesResponse);
            console.log('Respuesta citas:', citasResponse);

            if (atencionesResponse.success) {
                const atenciones = atencionesResponse.data || [];
                console.log('Atenciones procesadas:', atenciones, 'Es array:', Array.isArray(atenciones));
                processEstadisticas(atenciones);
                setAtencionesRecientes(Array.isArray(atenciones) ? atenciones.slice(0, 5) : []);
            } else {
                console.error('Error en respuesta de atenciones:', atencionesResponse.error);
                processEstadisticas([]);
                setAtencionesRecientes([]);
            }

            if (citasResponse.success) {
                setCitasPendientes(Array.isArray(citasResponse.data) ? citasResponse.data : []);
            } else {
                console.error('Error en respuesta de citas:', citasResponse.error);
                setCitasPendientes([]);
            }

        } catch (error: any) {
            console.error('Error al cargar datos del dashboard:', error);
            toast.error('Error al cargar datos del dashboard');
            // Establecer valores por defecto en caso de error
            processEstadisticas([]);
            setAtencionesRecientes([]);
            setCitasPendientes([]);
        } finally {
            setLoading(false);
        }
    };

    const processEstadisticas = (atenciones: Atencion[]) => {
        // Verificar que atenciones sea un array
        if (!Array.isArray(atenciones)) {
            console.error('processEstadisticas: atenciones no es un array:', atenciones);
            setEstadisticas({
                totalAtenciones: 0,
                atencionesHoy: 0,
                atencionesSemana: 0,
                atencionesMes: 0,
                citasPendientes: 0,
                especialidadesActivas: 0,
                promedioAtencionesDiarias: 0
            });
            return;
        }

        const ahora = new Date();
        const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        const semanaAtras = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
        const mesAtras = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

        const atencionesHoy = atenciones.filter(a => {
            const fechaAtencion = new Date(a.fechaAtencion);
            return fechaAtencion >= hoy;
        }).length;

        const atencionesSemana = atenciones.filter(a => {
            const fechaAtencion = new Date(a.fechaAtencion);
            return fechaAtencion >= semanaAtras;
        }).length;

        const atencionesMes = atenciones.filter(a => {
            const fechaAtencion = new Date(a.fechaAtencion);
            return fechaAtencion >= mesAtras;
        }).length;

        // Calcular estadísticas por especialidad
        const especialidadCount: { [key: string]: number } = {};
        atenciones.forEach(a => {
            const especialidad = a.cita?.franja?.especialidad?.nombre;
            if (especialidad) {
                especialidadCount[especialidad] = (especialidadCount[especialidad] || 0) + 1;
            }
        });

        const especialidadesStats = Object.entries(especialidadCount)
            .map(([especialidad, cantidad]) => ({
                especialidad,
                cantidad,
                porcentaje: (cantidad / atenciones.length) * 100
            }))
            .sort((a, b) => b.cantidad - a.cantidad);

        setAtencionesPorEspecialidad(especialidadesStats);

        setEstadisticas({
            totalAtenciones: atenciones.length,
            atencionesHoy,
            atencionesSemana,
            atencionesMes,
            citasPendientes: 0, // Se actualizará con las citas pendientes
            especialidadesActivas: new Set(atenciones.filter(a => a.cita?.franja?.especialidad).map(a => a.cita!.franja!.especialidad!.id)).size,
            promedioAtencionesDiarias: atencionesMes > 0 ? Math.round(atencionesMes / 30 * 10) / 10 : 0
        });
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading || !estadisticas) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mr-3" />
                    <span className="text-lg">Cargando dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard de Atenciones</h1>
                    <p className="text-muted-foreground">
                        Resumen y estadísticas del sistema de atención a pacientes
                    </p>
                </div>
                <Button onClick={loadDashboardData} variant="outline" disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
                
                {/* Botón de debug temporal */}
                <Button 
                    onClick={async () => {
                        console.log('=== DEBUG DASHBOARD API ===');
                        try {
                            // Probar endpoint de atenciones directamente
                            const directResponse = await fetch('/api/atenciones', {
                                headers: { 
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                    'Content-Type': 'application/json'
                                }
                            });
                            console.log('Response atenciones directa:', directResponse.status, directResponse.statusText);
                            if (directResponse.ok) {
                                const data = await directResponse.json();
                                console.log('Datos atenciones directa:', data);
                                console.log('Es array:', Array.isArray(data));
                            } else {
                                const errorText = await directResponse.text();
                                console.error('Error response:', errorText);
                            }
                        } catch (err) {
                            console.error('Error al probar API directa:', err);
                        }
                    }}
                    variant="secondary"
                    size="sm"
                >
                    🔍 Debug
                </Button>
            </div>

            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Atenciones</p>
                                <p className="text-2xl font-bold text-blue-600">{estadisticas.totalAtenciones}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Activity className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Atenciones Hoy</p>
                                <p className="text-2xl font-bold text-green-600">{estadisticas.atencionesHoy}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Citas Pendientes</p>
                                <p className="text-2xl font-bold text-orange-600">{citasPendientes.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Stethoscope className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Especialidades</p>
                                <p className="text-2xl font-bold text-purple-600">{estadisticas.especialidadesActivas}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Estadísticas Adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Esta Semana</p>
                                <p className="text-xl font-bold text-indigo-600">{estadisticas.atencionesSemana}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-pink-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Este Mes</p>
                                <p className="text-xl font-bold text-pink-600">{estadisticas.atencionesMes}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-100 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Promedio Diario</p>
                                <p className="text-xl font-bold text-teal-600">{estadisticas.promedioAtencionesDiarias}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Atenciones por Especialidad */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-blue-600" />
                            Atenciones por Especialidad
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {atencionesPorEspecialidad.length > 0 ? (
                            <div className="space-y-3">
                                {atencionesPorEspecialidad.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full bg-blue-${(index + 1) * 100}`} />
                                            <span className="text-sm font-medium">{item.especialidad}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{item.cantidad}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                ({item.porcentaje.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">
                                No hay datos de especialidades disponibles
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Atenciones Recientes */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-600" />
                            Atenciones Recientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {atencionesRecientes.length > 0 ? (
                            <div className="space-y-3">
                                {atencionesRecientes.map((atencion) => (
                                    <div key={atencion.id} className="flex items-center justify-between p-2 border rounded">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {atencion.cita?.paciente?.nombres} {atencion.cita?.paciente?.apellidos}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {atencion.cita?.franja?.especialidad?.nombre} • {formatearFecha(atencion.fechaAtencion)}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            Atendido
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">
                                No hay atenciones registradas
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Alertas y Recordatorios */}
            {citasPendientes.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-800">
                            <AlertTriangle className="w-5 h-5" />
                            Citas Pendientes de Atención
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-orange-700 mb-3">
                            Tienes <strong>{citasPendientes.length}</strong> cita{citasPendientes.length !== 1 ? 's' : ''} pendiente{citasPendientes.length !== 1 ? 's' : ''} de atención.
                        </p>
                        <div className="space-y-2">
                            {citasPendientes.slice(0, 3).map((cita) => (
                                <div key={cita.id} className="text-sm text-orange-700">
                                    • <strong>{cita.paciente.nombres} {cita.paciente.apellidos}</strong> - 
                                    {cita.franja.especialidad.nombre} - 
                                    {new Date(cita.fecha).toLocaleDateString()} {cita.horaInicio}
                                </div>
                            ))}
                            {citasPendientes.length > 3 && (
                                <div className="text-sm text-orange-600">
                                    ... y {citasPendientes.length - 3} más
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default DashboardAtenciones;