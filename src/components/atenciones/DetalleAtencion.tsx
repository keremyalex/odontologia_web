import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    User, 
    Stethoscope, 
    FileText, 
    Heart, 
    Thermometer,
    Activity,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    Smile,
    UserCheck
} from 'lucide-react';
import type { Atencion } from '@/types/atenciones';

interface DetalleAtencionProps {
    atencion: Atencion;
    onClose: () => void;
}

const DetalleAtencion: React.FC<DetalleAtencionProps> = ({ atencion, onClose }) => {
    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEstadoIcon = (estado: boolean) => {
        return estado ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
            <XCircle className="w-4 h-4 text-red-600" />
        );
    };

    const getEstadoText = (estado: boolean) => {
        return estado ? 'Sí' : 'No';
    };

    const getNivelIcon = (nivel: 'muy_bueno' | 'bueno' | 'deficiente' | 'malo') => {
        switch (nivel) {
            case 'muy_bueno':
            case 'bueno':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'deficiente':
                return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
            case 'malo':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    const getNivelColor = (nivel: 'muy_bueno' | 'bueno' | 'deficiente' | 'malo') => {
        switch (nivel) {
            case 'muy_bueno':
            case 'bueno':
                return 'bg-green-100 text-green-800';
            case 'deficiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'malo':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getNivelText = (nivel: 'muy_bueno' | 'bueno' | 'deficiente' | 'malo') => {
        switch (nivel) {
            case 'muy_bueno':
                return 'Muy Bueno';
            case 'bueno':
                return 'Bueno';
            case 'deficiente':
                return 'Deficiente';
            case 'malo':
                return 'Malo';
            default:
                return nivel;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button onClick={onClose} variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Detalle de Atención Médica</h1>
                    <p className="text-muted-foreground">
                        Información completa de la atención registrada
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información del Paciente */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Información del Paciente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg">
                                {atencion.cita?.paciente?.nombres} {atencion.cita?.paciente?.apellidos}
                            </h3>
                            <p className="text-muted-foreground">CI: {atencion.cita?.paciente?.ci}</p>
                        </div>
                        
                        {atencion.cita?.paciente?.telefono && (
                            <div>
                                <p className="text-sm font-medium">Teléfono</p>
                                <p className="text-muted-foreground">{atencion.cita.paciente.telefono}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Información de la Cita */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-green-600" />
                            Información de la Cita y Atención
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Fecha de Atención
                                </p>
                                <p className="text-muted-foreground">{formatearFecha(atencion.fechaAtencion)}</p>
                            </div>
                            
                            <div>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4" />
                                    Especialidad
                                </p>
                                <Badge variant="default">{atencion.cita?.franja?.especialidad?.nombre}</Badge>
                            </div>
                            
                            <div>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <UserCheck className="w-4 h-4" />
                                    Profesional Responsable
                                </p>
                                <p className="text-muted-foreground">
                                    Dr/a. {atencion.cita?.franja?.responsable?.nombres} {atencion.cita?.franja?.responsable?.apellidos}
                                </p>
                            </div>
                            
                            <div>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Horario de Cita
                                </p>
                                <p className="text-muted-foreground">
                                    {atencion.cita?.horaInicio} - {atencion.cita?.horaFin}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Signos Vitales */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-600" />
                        Signos Vitales
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Heart className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Presión Arterial</p>
                                <p className="text-lg font-semibold">{atencion.signosVitales.presionArterial}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Thermometer className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Temperatura</p>
                                <p className="text-lg font-semibold">{atencion.signosVitales.temperatura}°C</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Frecuencia Cardíaca</p>
                                <p className="text-lg font-semibold">{atencion.signosVitales.frecuenciaCardiaca} bpm</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Estado Bucal General */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smile className="w-5 h-5 text-purple-600" />
                        Estado Bucal General
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                                {getEstadoIcon(atencion.estadoBucalGeneral.presenciaSarro)}
                                <span className="text-sm font-medium">Presencia de Sarro</span>
                            </div>
                            <span className="text-sm">{getEstadoText(atencion.estadoBucalGeneral.presenciaSarro)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                                {getEstadoIcon(atencion.estadoBucalGeneral.enfermedadPeriodontal)}
                                <span className="text-sm font-medium">Enf. Periodontal</span>
                            </div>
                            <span className="text-sm">{getEstadoText(atencion.estadoBucalGeneral.enfermedadPeriodontal)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                                {getEstadoIcon(atencion.estadoBucalGeneral.presenciaCaries)}
                                <span className="text-sm font-medium">Presencia de Caries</span>
                            </div>
                            <span className="text-sm">{getEstadoText(atencion.estadoBucalGeneral.presenciaCaries)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-2">
                                {getNivelIcon(atencion.estadoBucalGeneral.higieneBucal)}
                                <span className="text-sm font-medium">Higiene Bucal</span>
                            </div>
                            <Badge className={getNivelColor(atencion.estadoBucalGeneral.higieneBucal)}>
                                {getNivelText(atencion.estadoBucalGeneral.higieneBucal)}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Diagnóstico y Tratamiento */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-blue-600" />
                            Diagnóstico Presuntivo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed">{atencion.diagnosticoPresuntivo}</p>
                    </CardContent>
                </Card>

                {atencion.planTratamiento && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                Plan de Tratamiento
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{atencion.planTratamiento}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Observaciones */}
            {atencion.observaciones && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-orange-600" />
                            Observaciones Adicionales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed">{atencion.observaciones}</p>
                    </CardContent>
                </Card>
            )}

            {/* Información de Registro */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">Información del Registro</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                        <p><strong>Atención ID:</strong> {atencion.id}</p>
                        <p><strong>Cita ID:</strong> {atencion.cita?.id}</p>
                        <p><strong>Fecha de registro:</strong> {formatearFecha(atencion.fechaAtencion)}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DetalleAtencion;