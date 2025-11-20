import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ArrowLeft,
    Edit,
    FileText,
    Calendar,
    Phone,
    Mail,
    User,
    MapPin,
    Clock,
    Plus,
    Stethoscope,
    Eye,
    Activity
} from 'lucide-react';
import apiService from '@/services/api';
import type { Paciente, HistoriaClinica } from '@/types';

const PatientDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [historias, setHistorias] = useState<HistoriaClinica[]>([]);
    const [atenciones, setAtenciones] = useState<any[]>([]);
    const [citas, setCitas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (id) {
            loadPatientData(parseInt(id));
        }
    }, [id]);

    const loadPatientData = async (pacienteId: number) => {
        try {
            setLoading(true);

            // Cargar datos del paciente
            const pacienteData = await apiService.getPaciente(pacienteId);
            setPaciente(pacienteData);

            // Cargar historias clínicas
            try {
                const historiasData = await apiService.getHistoriasPorPaciente(pacienteId);
                setHistorias(historiasData);
            } catch (err) {
                // No hay historias clínicas, esto es normal
                setHistorias([]);
            }

            // Cargar historial de atenciones
            try {
                const atencionesData = await apiService.getAtencionesPorPaciente(pacienteId);
                console.log('🔍 Atenciones cargadas en PatientDetailPage:', atencionesData);
                console.log('🔍 Es array en PatientDetailPage:', Array.isArray(atencionesData));
                setAtenciones(Array.isArray(atencionesData) ? atencionesData : []);
            } catch (err) {
                console.log('ℹ️ No hay atenciones o error al cargar:', err);
                setAtenciones([]);
            }

            // Cargar citas del paciente
            try {
                const citasData = await apiService.getCitasPorPaciente(pacienteId);
                console.log('📅 Citas cargadas en PatientDetailPage:', citasData);
                console.log('📅 Es array las citas:', Array.isArray(citasData));
                
                // Filtrar citas programadas
                const citasProgramadas = Array.isArray(citasData) ? 
                    citasData.filter(cita => cita.estado === 'programada') : [];
                setCitas(citasProgramadas);
            } catch (err) {
                console.log('ℹ️ No hay citas o error al cargar:', err);
                setCitas([]);
            }

        } catch (err: any) {
            console.error('Error loading patient data:', err);
            setError('Error al cargar los datos del paciente');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateAge = (birthDate: string | undefined) => {
        if (!birthDate) return 'No especificada';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return `${age} años`;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !paciente) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {error || 'Paciente no encontrado'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        No se pudo cargar la información del paciente.
                    </p>
                    <Button
                        onClick={() => navigate('/patients')}
                        className="mt-4"
                        variant="outline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Pacientes
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/patients')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {paciente.nombre} {paciente.apellido}
                            </h1>
                            <p className="text-gray-600">
                                Detalles del paciente
                            </p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                        >
                            <Link to={`/patients/${paciente.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Link>
                        </Button>

                        <Button
                            asChild
                            size="sm"
                        >
                            <Link to={`/patients/${paciente.id}/historia-completa`}>
                                <FileText className="h-4 w-4 mr-2" />
                                {historias.length > 0 ? 'Ver Historia' : 'Crear Historia'}
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información Personal */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="mr-2 h-5 w-5" />
                                    Información Personal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                                        <p className="text-sm font-medium">{paciente.nombre} {paciente.apellido}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Cédula de Identidad</label>
                                        <p className="text-sm">{paciente.ci || 'No especificada'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                                        <p className="text-sm">{formatDate(paciente.fechaNac)}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Edad</label>
                                        <p className="text-sm">{calculateAge(paciente.fechaNac)}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Sexo</label>
                                        <p className="text-sm">
                                            {paciente.sexo === 'M' ? 'Masculino' :
                                                paciente.sexo === 'F' ? 'Femenino' : 'No especificado'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Estado Civil</label>
                                        <p className="text-sm">{paciente.estadoCivil || 'No especificado'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información de Contacto */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Phone className="mr-2 h-5 w-5" />
                                    Información de Contacto
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Teléfono</label>
                                        <p className="text-sm flex items-center">
                                            <Phone className="mr-2 h-4 w-4 text-gray-400" />
                                            {paciente.telefono || 'No especificado'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <p className="text-sm flex items-center">
                                            <Mail className="mr-2 h-4 w-4 text-gray-400" />
                                            {paciente.email || 'No especificado'}
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-500">Dirección</label>
                                        <p className="text-sm flex items-center">
                                            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                                            {paciente.direccion || 'No especificada'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Panel Lateral */}
                    <div className="space-y-6">
                        {/* Estado */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Estado del Paciente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Historia Clínica:</span>
                                        <Badge variant={historias.length > 0 ? "default" : "secondary"}>
                                            {historias.length > 0 ? 'Completada' : 'Pendiente'}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Citas Programadas:</span>
                                        <Badge variant={citas.length > 0 ? "default" : "secondary"}>
                                            {citas.length} pendientes
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Atenciones:</span>
                                        <Badge variant={atenciones.length > 0 ? "default" : "secondary"}>
                                            {atenciones.length} registradas
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Registro:</span>
                                        <span className="text-sm text-gray-600">
                                            {formatDate(paciente.fechaRegistro)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Historia Clínica */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center">
                                        <FileText className="mr-2 h-5 w-5" />
                                        Historia Clínica
                                    </span>
                                    <Badge variant="outline">
                                        {historias.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {historias.length === 0 ? (
                                    <div className="text-center py-6">
                                        <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600 mb-4">
                                            Este paciente no tiene historia clínica registrada.
                                        </p>
                                        <Button
                                            asChild
                                            size="sm"
                                            className="w-full"
                                        >
                                            <Link to={`/patients/${paciente.id}/historia-completa`}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Crear Historia
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {historias.map((historia, index) => (
                                            <div
                                                key={historia.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Historia #{index + 1}
                                                    </p>
                                                    <p className="text-xs text-gray-600 flex items-center">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        {formatDate(historia.fecha)}
                                                    </p>
                                                </div>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link to={`/patients/${paciente.id}/historia-completa`}>
                                                        Ver
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
                
                {/* Sección de Tablas - Área Principal */}
                <div className="space-y-6">
                    {/* Tabla de Citas Programadas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Citas Programadas
                                </span>
                                <Badge variant="outline">
                                    {citas.length} citas
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {citas.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No hay citas programadas
                                    </h3>
                                    <p className="text-gray-600">
                                        Este paciente no tiene citas programadas.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[120px]">Fecha</TableHead>
                                                <TableHead className="w-[100px]">Hora</TableHead>
                                                <TableHead>Motivo de Consulta</TableHead>
                                                <TableHead>Observaciones</TableHead>
                                                <TableHead className="w-[100px]">Estado</TableHead>
                                                <TableHead className="w-20">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {citas.map((cita, index) => {
                                                if (!cita) return null;

                                                return (
                                                    <TableRow key={cita.id || index} className="hover:bg-gray-50">
                                                        <TableCell className="font-medium">
                                                            {cita.fecha ? new Date(cita.fecha).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit'
                                                            }) : 'N/A'}
                                                        </TableCell>
                                                        
                                                        <TableCell>
                                                            <span className="text-sm">
                                                                {cita.horaInicio || cita.hora_inicio} - {cita.horaFin || cita.hora_fin}
                                                            </span>
                                                        </TableCell>
                                                        
                                                        <TableCell>
                                                            <div className="max-w-xs">
                                                                <span className="text-sm truncate block">
                                                                    {cita.motivoConsulta || cita.motivo_consulta || 'No especificado'}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        
                                                        <TableCell>
                                                            <div className="max-w-xs">
                                                                <span className="text-sm truncate block text-gray-600">
                                                                    {cita.observaciones || 'Sin observaciones'}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        
                                                        <TableCell>
                                                            <Badge variant="default" className="bg-blue-100 text-blue-800">
                                                                Programada
                                                            </Badge>
                                                        </TableCell>
                                                        
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
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
                            )}
                        </CardContent>
                    </Card>

                    {/* Tabla de Historial de Atenciones */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center">
                                    <Stethoscope className="mr-2 h-5 w-5" />
                                    Historial de Atenciones Médicas
                                </span>
                                <Badge variant="outline">
                                    {atenciones.length} atenciones
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {atenciones.length === 0 ? (
                                <div className="text-center py-8">
                                    <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No hay atenciones registradas
                                    </h3>
                                    <p className="text-gray-600">
                                        Este paciente no tiene atenciones médicas registradas.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[120px]">Fecha</TableHead>
                                                    <TableHead>Diagnóstico</TableHead>
                                                    <TableHead>Plan de Tratamiento</TableHead>
                                                    <TableHead>Observaciones</TableHead>
                                                    <TableHead className="w-[140px]">Responsable</TableHead>
                                                    <TableHead className="w-20">Acciones</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {atenciones.map((atencion, index) => {
                                                    if (!atencion) return null;

                                                    const fechaAtencion = atencion.fechaAtencion || atencion.createdAt;
                                                    const atencionPor = atencion.atencionPor || atencion.atendidoPor || {};

                                                    return (
                                                        <TableRow key={atencion.id || index} className="hover:bg-gray-50">
                                                            <TableCell className="font-medium">
                                                                {fechaAtencion ? new Date(fechaAtencion).toLocaleDateString('es-ES', {
                                                                    year: '2-digit',
                                                                    month: '2-digit',
                                                                    day: '2-digit'
                                                                }) : 'N/A'}
                                                            </TableCell>
                                                            
                                                            <TableCell>
                                                                <div className="max-w-xs">
                                                                    <span className="text-sm truncate block">
                                                                        {atencion.diagnosticoPresuntivo || 'No especificado'}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            
                                                            <TableCell>
                                                                <div className="max-w-xs">
                                                                    <span className="text-sm truncate block">
                                                                        {atencion.planTratamiento || 'No especificado'}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            
                                                            <TableCell>
                                                                <div className="max-w-xs">
                                                                    <span className="text-sm truncate block text-gray-600">
                                                                        {atencion.observaciones || 'Sin observaciones'}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            
                                                            <TableCell>
                                                                <span className="text-sm">
                                                                    {atencionPor.nombre || atencionPor.nombres || 'N/A'}
                                                                </span>
                                                            </TableCell>
                                                            
                                                            <TableCell>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => navigate(`/patients/${paciente.id}/atenciones`)}
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
                                    
                                    {atenciones.length > 10 && (
                                        <div className="text-center pt-3 border-t border-gray-200">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/patients/${paciente.id}/atenciones`)}
                                            >
                                                Ver historial completo ({atenciones.length} atenciones)
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PatientDetailPage;