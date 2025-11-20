import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import FormularioAtencion from './FormularioAtencion';
import type { CitaPendienteAtencion } from '@/types/atenciones';

const CitasPendientesAtencion: React.FC = () => {
    const [citas, setCitas] = useState<CitaPendienteAtencion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCita, setSelectedCita] = useState<CitaPendienteAtencion | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadCitasPendientes();
    }, []);

    const loadCitasPendientes = async () => {
        try {
            setLoading(true);
            console.log('Cargando citas pendientes...');
            const response = await apiService.getCitasPendientesAtencion();
            console.log('Respuesta getCitasPendientesAtencion:', response);
            
            if (response.success) {
                setCitas(response.data || []);
                console.log('Citas cargadas:', response.data?.length || 0);
                console.log('Primera cita (estructura):', response.data?.[0]);
            } else {
                setCitas([]);
                console.error('Error en respuesta:', response.error);
                toast.error(response.error || 'Error al cargar citas pendientes');
            }
        } catch (error: any) {
            console.error('Error al cargar citas pendientes:', error);
            setCitas([]);
            toast.error('Error al cargar citas pendientes');
        } finally {
            setLoading(false);
        }
    };

    const handleAtencionCreada = async () => {
        // Remover la cita de la lista ya que fue atendida
        setCitas(prev => prev.filter(c => c.id !== selectedCita?.id));
        setShowForm(false);
        setSelectedCita(null);
        toast.success('La cita ha sido marcada como atendida');
    };

    const handleAtenderCita = (cita: CitaPendienteAtencion) => {
        setSelectedCita(cita);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setSelectedCita(null);
    };

    const filteredCitas = citas.filter(cita => {
        if (!cita) return false;
        
        const searchLower = searchTerm.toLowerCase();
        const pacienteNombres = cita.paciente?.nombres || '';
        const pacienteApellidos = cita.paciente?.apellidos || '';
        const pacienteCi = cita.paciente?.ci || '';
        const especialidadNombre = cita.franja?.especialidad?.nombre || '';
        
        return (
            pacienteNombres.toLowerCase().includes(searchLower) ||
            pacienteApellidos.toLowerCase().includes(searchLower) ||
            pacienteCi.includes(searchTerm) ||
            especialidadNombre.toLowerCase().includes(searchLower)
        );
    });

    if (showForm && selectedCita) {
        return (
            <div className="space-y-6">
                <FormularioAtencion
                    cita={selectedCita}
                    onAtencionCreada={handleAtencionCreada}
                    onCancel={handleCancelForm}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Citas Pendientes de Atención</h1>
                    <p className="text-muted-foreground">
                        Gestiona las citas programadas que están listas para ser atendidas
                    </p>
                </div>
                <Button onClick={loadCitasPendientes} variant="outline" disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Buscar Citas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar por nombre, apellido, CI o especialidad..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pendientes</p>
                                <p className="text-2xl font-bold text-blue-600">{citas.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Clock className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Citas de Hoy</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {citas.filter(c => {
                                        const today = new Date().toDateString();
                                        const citaDate = new Date(c.fecha).toDateString();
                                        return today === citaDate;
                                    }).length}
                                </p>
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
                                <p className="text-2xl font-bold text-purple-600">
                                    {new Set(citas.map(c => c.franja.especialidad.id)).size}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de Citas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Citas por Atender</span>
                        <Badge variant="secondary">
                            {filteredCitas.length} cita{filteredCitas.length !== 1 ? 's' : ''}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <span>Cargando citas pendientes...</span>
                        </div>
                    ) : filteredCitas.length === 0 ? (
                        <div className="text-center py-12">
                            {searchTerm ? (
                                <>
                                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                                    <p className="text-muted-foreground">
                                        Intenta con otros términos de búsqueda
                                    </p>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No hay citas pendientes</h3>
                                    <p className="text-muted-foreground">
                                        Todas las citas programadas han sido atendidas
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredCitas.map((cita) => {
                                // Verificación defensiva de la estructura de datos
                                if (!cita || !cita.id) {
                                    console.warn('Cita inválida encontrada:', cita);
                                    return null;
                                }

                                const paciente = cita.paciente || {};
                                const franja = cita.franja || {};
                                const especialidad = franja.especialidad || {};
                                const responsable = franja.responsable || {};

                                return (
                                    <div 
                                        key={cita.id} 
                                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 space-y-2">
                                                {/* Información del Paciente */}
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                    <span className="font-semibold">
                                                        {paciente.nombres || 'Sin nombre'} {paciente.apellidos || 'Sin apellido'}
                                                    </span>
                                                    {paciente.ci && (
                                                        <Badge variant="outline">CI: {paciente.ci}</Badge>
                                                    )}
                                                    {paciente.telefono && (
                                                        <Badge variant="secondary">📞 {paciente.telefono}</Badge>
                                                    )}
                                                </div>

                                                {/* Información de la Cita */}
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{cita.fecha ? new Date(cita.fecha).toLocaleDateString() : 'Fecha no disponible'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{cita.horaInicio || 'N/A'} - {cita.horaFin || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Stethoscope className="w-4 h-4" />
                                                        <span>{especialidad.nombre || 'Especialidad no especificada'}</span>
                                                    </div>
                                                </div>

                                                {/* Responsable */}
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <UserCheck className="w-4 h-4" />
                                                    <span>
                                                        Responsable: {responsable.nombres || 'N/A'} {responsable.apellidos || ''}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Botón de Acción */}
                                            <Button
                                                onClick={() => handleAtenderCita(cita)}
                                                className="ml-4"
                                            >
                                                <UserCheck className="w-4 h-4 mr-2" />
                                                Atender Paciente
                                            </Button>
                                        </div>
                                    </div>
                                );
                            }).filter(Boolean) /* Filtrar elementos null */}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Información adicional */}
            {!loading && citas.length > 0 && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Nota:</strong> Las citas mostradas están en estado "PROGRAMADA" y listas para ser atendidas. 
                        Una vez que registres la atención, la cita cambiará automáticamente a estado "ATENDIDA".
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default CitasPendientesAtencion;