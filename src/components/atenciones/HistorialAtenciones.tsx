import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Calendar,
    User,
    Stethoscope,
    Activity,
    ArrowLeft,
    FileText,
    Eye
} from 'lucide-react';
import apiService from '@/services/api';
import type { Paciente } from '@/types';

interface HistorialAtencionesProps {
    pacienteId: number;
    paciente?: Paciente;
}

const HistorialAtenciones: React.FC<HistorialAtencionesProps> = ({ 
    pacienteId, 
    paciente: pacienteProp 
}) => {
    const navigate = useNavigate();
    const [atenciones, setAtenciones] = useState<any[]>([]);
    const [paciente, setPaciente] = useState<Paciente | null>(pacienteProp || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadData();
    }, [pacienteId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            // Cargar datos del paciente si no se proporcionaron
            if (!paciente) {
                const pacienteData = await apiService.getPaciente(pacienteId);
                setPaciente(pacienteData);
            }

            // Cargar atenciones
            const atencionesData = await apiService.getAtencionesPorPaciente(pacienteId);
            console.log('🔍 Datos de atenciones recibidos en componente:', atencionesData);
            console.log('🔍 Tipo:', typeof atencionesData);
            console.log('🔍 Es array:', Array.isArray(atencionesData));
            
            if (Array.isArray(atencionesData)) {
                console.log('🔍 Cantidad de atenciones:', atencionesData.length);
                if (atencionesData.length > 0) {
                    console.log('🔍 Primera atención (sample):', JSON.stringify(atencionesData[0], null, 2));
                }
                setAtenciones(atencionesData);
            } else {
                console.log('⚠️ Los datos no son un array, estableciendo array vacío');
                setAtenciones([]);
            }

        } catch (err: any) {
            console.error('Error cargando historial de atenciones:', err);
            setError('Error al cargar el historial de atenciones');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'Fecha no disponible';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="mb-4">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="h-4 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/patients/${pacienteId}`)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Historial de Atenciones
                        </h1>
                        {paciente && (
                            <p className="text-gray-600">
                                {paciente.nombre} {paciente.apellido} - CI: {paciente.ci || 'No especificado'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    {atenciones.length} atenciones registradas
                </div>
            </div>

            {/* Resumen */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Resumen de Atenciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {atenciones.length}
                            </div>
                            <div className="text-sm text-blue-800">
                                Total de Atenciones
                            </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {atenciones.length > 0 ? formatDate(atenciones[0]?.fechaAtencion || atenciones[0]?.createdAt) : 'N/A'}
                            </div>
                            <div className="text-sm text-green-800">
                                Última Atención
                            </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {atenciones.length > 0 ? formatDate(atenciones[atenciones.length - 1]?.fechaAtencion || atenciones[atenciones.length - 1]?.createdAt) : 'N/A'}
                            </div>
                            <div className="text-sm text-purple-800">
                                Primera Atención
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Atenciones en Tabla */}
            {atenciones.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No hay atenciones registradas
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Este paciente no tiene atenciones médicas registradas.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Registro de Atenciones Médicas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Fecha</TableHead>
                                        <TableHead>Diagnóstico</TableHead>
                                        <TableHead>Plan de Tratamiento</TableHead>
                                        <TableHead className="w-[150px]">Estado Bucal</TableHead>
                                        <TableHead className="w-[150px]">Responsable</TableHead>
                                        <TableHead className="w-[100px]">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {atenciones.map((atencion, index) => {
                                        // Verificación defensiva
                                        if (!atencion) return null;

                                        const fechaAtencion = atencion.fechaAtencion || atencion.createdAt;
                                        const atencionPor = atencion.atencionPor || atencion.atendidoPor || {};
                                        const estadoBucal = atencion.estadoBucalGeneral || {};

                                        return (
                                            <TableRow key={atencion.id || index}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <div className="text-sm">
                                                            {fechaAtencion ? formatDate(fechaAtencion) : 'N/A'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="max-w-xs">
                                                        <p className="text-sm font-medium truncate">
                                                            {atencion.diagnosticoPresuntivo || 'No especificado'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="max-w-xs">
                                                        <p className="text-sm truncate">
                                                            {atencion.planTratamiento || 'No especificado'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex gap-1 flex-wrap">
                                                            {estadoBucal.presenciaSarro && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    Sarro
                                                                </Badge>
                                                            )}
                                                            {estadoBucal.enfermedadPeriodontal && (
                                                                <Badge variant="destructive" className="text-xs">
                                                                    Periodontal
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            Higiene: {estadoBucal.higieneBucal || 'N/A'}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-3 w-3 text-gray-500" />
                                                        <span className="text-sm truncate">
                                                            {atencionPor.nombre || atencionPor.nombres || 'N/A'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            // Expandir detalles o navegar a detalle
                                                            console.log('Ver detalles de atención:', atencion);
                                                        }}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }).filter(Boolean)}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Información adicional */}
                        {atenciones.length > 0 && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <strong>Total de atenciones:</strong> {atenciones.length} | 
                                    <strong> Última atención:</strong> {formatDate(atenciones[0]?.fechaAtencion || atenciones[0]?.createdAt)}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default HistorialAtenciones;