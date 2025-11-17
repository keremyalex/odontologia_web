import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    Plus
} from 'lucide-react';
import apiService from '@/services/api';
import type { Paciente, HistoriaClinica } from '@/types';

const PatientDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [historias, setHistorias] = useState<HistoriaClinica[]>([]);
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
                            <Link to={`/patients/${paciente.id}/cuestionario`}>
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
                                            <Link to={`/patients/${paciente.id}/cuestionario`}>
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
                                                    <Link to={`/patients/${paciente.id}/cuestionario`}>
                                                        Ver
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Acciones Rápidas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <Link to={`/patients/${paciente.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar Información
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <Link to={`/appointments/new?pacienteId=${paciente.id}`}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Agendar Cita
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <Link to={`/patients/${paciente.id}/cuestionario`}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        {historias.length > 0 ? 'Actualizar Historia' : 'Crear Historia'}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PatientDetailPage;