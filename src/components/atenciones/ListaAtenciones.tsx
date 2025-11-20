import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Calendar, 
    Clock, 
    User, 
    Stethoscope, 
    Search, 
    RefreshCw, 
    Loader2,
    AlertCircle,
    Eye,
    FileText,
    Activity,
    TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import DetalleAtencion from './DetalleAtencion';
import type { Atencion } from '@/types/atenciones';

interface FiltrosAtencion {
    pacienteId?: number;
    especialidadId?: number;
    fechaInicio?: string;
    fechaFin?: string;
}

const ListaAtenciones: React.FC = () => {
    const [atenciones, setAtenciones] = useState<Atencion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAtencion, setSelectedAtencion] = useState<Atencion | null>(null);
    const [showDetalle, setShowDetalle] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosAtencion>({});

    useEffect(() => {
        loadAtenciones();
    }, [filtros]);

    const loadAtenciones = async () => {
        try {
            setLoading(true);
            const response = await apiService.getAtenciones();
            
            if (response.success) {
                setAtenciones(response.data || []);
            } else {
                setAtenciones([]);
                toast.error('Error al cargar atenciones');
            }
        } catch (error: any) {
            console.error('Error al cargar atenciones:', error);
            setAtenciones([]);
            toast.error('Error al cargar atenciones');
        } finally {
            setLoading(false);
        }
    };

    const handleVerDetalle = (atencion: Atencion) => {
        setSelectedAtencion(atencion);
        setShowDetalle(true);
    };

    const handleCloseDetalle = () => {
        setShowDetalle(false);
        setSelectedAtencion(null);
    };

    const filteredAtenciones = atenciones.filter(atencion => {
        const searchLower = searchTerm.toLowerCase();
        return (
            atencion.cita?.paciente?.nombres?.toLowerCase().includes(searchLower) ||
            atencion.cita?.paciente?.apellidos?.toLowerCase().includes(searchLower) ||
            atencion.cita?.paciente?.ci?.includes(searchTerm) ||
            atencion.cita?.franja?.especialidad?.nombre?.toLowerCase().includes(searchLower) ||
            atencion.diagnosticoPresuntivo?.toLowerCase().includes(searchLower) ||
            (atencion.observaciones && atencion.observaciones.toLowerCase().includes(searchLower))
        );
    });

    const estadisticas = {
        total: atenciones.length,
        hoy: atenciones.filter(a => {
            const today = new Date().toDateString();
            const atencionDate = new Date(a.fechaAtencion).toDateString();
            return today === atencionDate;
        }).length,
        esteMes: atenciones.filter(a => {
            const now = new Date();
            const atencionDate = new Date(a.fechaAtencion);
            return atencionDate.getMonth() === now.getMonth() && 
                   atencionDate.getFullYear() === now.getFullYear();
        }).length,
        especialidades: new Set(atenciones.filter(a => a.cita?.franja?.especialidad).map(a => a.cita!.franja!.especialidad!.id)).size
    };

    if (showDetalle && selectedAtencion) {
        return (
            <div className="space-y-6">
                <DetalleAtencion
                    atencion={selectedAtencion}
                    onClose={handleCloseDetalle}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Historial de Atenciones</h1>
                    <p className="text-muted-foreground">
                        Revisa todas las atenciones médicas registradas en el sistema
                    </p>
                </div>
                <Button onClick={loadAtenciones} variant="outline" disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Buscar Atenciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                placeholder="Buscar por paciente, CI, especialidad, diagnóstico..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Input
                            type="date"
                            placeholder="Fecha inicio"
                            value={filtros.fechaInicio || ''}
                            onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                        />
                        <Input
                            type="date"
                            placeholder="Fecha fin"
                            value={filtros.fechaFin || ''}
                            onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Atenciones</p>
                                <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
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
                                <p className="text-sm text-muted-foreground">Hoy</p>
                                <p className="text-2xl font-bold text-green-600">{estadisticas.hoy}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Este Mes</p>
                                <p className="text-2xl font-bold text-orange-600">{estadisticas.esteMes}</p>
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
                                <p className="text-2xl font-bold text-purple-600">{estadisticas.especialidades}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de Atenciones */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Atenciones Registradas</span>
                        <Badge variant="secondary">
                            {filteredAtenciones.length} atención{filteredAtenciones.length !== 1 ? 'es' : ''}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <span>Cargando atenciones...</span>
                        </div>
                    ) : filteredAtenciones.length === 0 ? (
                        <div className="text-center py-12">
                            {searchTerm || filtros.fechaInicio || filtros.fechaFin ? (
                                <>
                                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                                    <p className="text-muted-foreground">
                                        Intenta con otros filtros de búsqueda
                                    </p>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No hay atenciones registradas</h3>
                                    <p className="text-muted-foreground">
                                        Las atenciones aparecerán aquí una vez que se registren
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAtenciones.map((atencion) => (
                                <div 
                                    key={atencion.id} 
                                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-3">
                                            {/* Header de la atención */}
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-600" />
                                                <span className="font-semibold">
                                                    {atencion.cita?.paciente?.nombres} {atencion.cita?.paciente?.apellidos}
                                                </span>
                                                <Badge variant="outline">CI: {atencion.cita?.paciente?.ci}</Badge>
                                                <Badge variant="default">
                                                    {atencion.cita?.franja?.especialidad?.nombre}
                                                </Badge>
                                            </div>

                                            {/* Información de fecha y hora */}
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(atencion.fechaAtencion).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{new Date(atencion.fechaAtencion).toLocaleTimeString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Stethoscope className="w-4 h-4" />
                                                    <span>
                                                        Dr/a. {atencion.cita?.franja?.responsable?.nombres} {atencion.cita?.franja?.responsable?.apellidos}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Diagnóstico y observaciones */}
                                            <div className="space-y-1">
                                                <div className="flex items-start gap-2">
                                                    <span className="text-sm font-medium text-muted-foreground min-w-fit">
                                                        Diagnóstico:
                                                    </span>
                                                    <span className="text-sm">{atencion.diagnosticoPresuntivo}</span>
                                                </div>
                                                {atencion.observaciones && (
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-fit">
                                                            Observaciones:
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {atencion.observaciones.length > 100 
                                                                ? `${atencion.observaciones.substring(0, 100)}...`
                                                                : atencion.observaciones
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                {atencion.planTratamiento && (
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-sm font-medium text-muted-foreground min-w-fit">
                                                            Plan de Tratamiento:
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {atencion.planTratamiento.length > 100 
                                                                ? `${atencion.planTratamiento.substring(0, 100)}...`
                                                                : atencion.planTratamiento
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botón de acción */}
                                        <Button
                                            onClick={() => handleVerDetalle(atencion)}
                                            variant="outline"
                                            className="ml-4 shrink-0"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Ver Detalle
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ListaAtenciones;