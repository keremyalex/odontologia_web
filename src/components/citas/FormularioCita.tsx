import { useState, useEffect } from 'react';
import { CalendarDays, Clock, User, Save, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import type { Cita, CrearCitaDto, UpdateCitaDto, SlotDisponible } from '@/types/citas';
import type { Paciente } from '@/types';
import type { Especialidad } from '@/types';

interface FormularioCitaProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (cita: Cita) => void;
    citaInicial?: Cita | null;
    mode: 'create' | 'edit';
}

export default function FormularioCita({
    isOpen,
    onClose,
    onSave,
    citaInicial,
    mode
}: FormularioCitaProps) {
    const [formData, setFormData] = useState({
        pacienteId: 0,
        franjaId: 0,
        fecha: '',
        horaInicio: '',
        horaFin: '',
        motivoConsulta: '',
        observaciones: ''
    });

    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [franjas, setFranjas] = useState<any[]>([]);
    const [slotsDisponibles, setSlotsDisponibles] = useState<SlotDisponible[]>([]);
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<number>(0);
    const [fechaSeleccionada, setFechaSeleccionada] = useState('');
    const [franjaSeleccionada, setFranjaSeleccionada] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            cargarDatosIniciales();
            if (mode === 'edit' && citaInicial) {
                cargarDatosCita();
            }
        }
    }, [isOpen, citaInicial, mode]);

    useEffect(() => {
        if (especialidadSeleccionada && fechaSeleccionada) {
            cargarFranjasPorEspecialidad();
        }
    }, [especialidadSeleccionada, fechaSeleccionada]);

    useEffect(() => {
        console.log('useEffect verificarDisponibilidad:', { franjaSeleccionada, fechaSeleccionada });
        if (franjaSeleccionada && fechaSeleccionada) {
            console.log('Llamando a verificarDisponibilidad...');
            verificarDisponibilidad();
        }
    }, [franjaSeleccionada, fechaSeleccionada]);

    const cargarDatosIniciales = async () => {
        try {
            setLoading(true);
            const [pacientesData, especialidadesData] = await Promise.all([
                apiService.getPacientes(),
                apiService.getEspecialidades()
            ]);

            setPacientes(pacientesData);
            // No filtrar por activo ya que las especialidades del backend no lo incluyen
            setEspecialidades(especialidadesData);
        } catch (error) {
            console.error('FormularioCita - Error al cargar datos:', error);

            // Fallback: usar especialidades de localStorage
            try {
                const especialidadesLocal = localStorage.getItem('especialidades');
                if (especialidadesLocal) {
                    const especialidadesParsed = JSON.parse(especialidadesLocal);
                    const especialidadesActivas = especialidadesParsed.filter((esp: any) => esp.activo !== false);
                    setEspecialidades(especialidadesActivas);
                } else {
                    setEspecialidades([]);
                }
            } catch (localError) {
                console.error('FormularioCita - Error al cargar desde localStorage:', localError);
                setEspecialidades([]);
            }

            toast({
                title: "Error",
                description: "Error al cargar los datos iniciales",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const cargarDatosCita = () => {
        if (!citaInicial) return;

        setFormData({
            pacienteId: citaInicial.pacienteId,
            franjaId: citaInicial.franjaId,
            fecha: citaInicial.fecha,
            horaInicio: citaInicial.horaInicio,
            horaFin: citaInicial.horaFin,
            motivoConsulta: citaInicial.motivoConsulta,
            observaciones: citaInicial.observaciones || ''
        });

        setEspecialidadSeleccionada(citaInicial.franja.especialidad.id);
        setFranjaSeleccionada(citaInicial.franjaId);
        setFechaSeleccionada(citaInicial.fecha);
    };

    const cargarFranjasPorEspecialidad = async () => {
        if (!especialidadSeleccionada || !fechaSeleccionada) return;

        try {
            // Calcular el día de la semana correctamente (1=Lunes, 7=Domingo)
            const fecha = new Date(fechaSeleccionada + 'T12:00:00'); // Agregar hora para evitar problemas de zona horaria
            let diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado

            // Convertir a formato backend: 1=Lunes, 2=Martes, ..., 7=Domingo
            diaSemana = diaSemana === 0 ? 7 : diaSemana;

            console.log('Debug fecha:', {
                fechaSeleccionada,
                fechaObj: fecha,
                getDay: fecha.getDay(),
                diaSemanaCalculado: diaSemana,
                diaSemanaString: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][fecha.getDay()]
            });

            console.log('Cargando franjas:', {
                especialidad: especialidadSeleccionada,
                dia: diaSemana,
                fecha: fechaSeleccionada
            });

            // Usar los parámetros correctos según la página de administración
            const franjasData = await apiService.getFranjasHorarias({
                especialidad: especialidadSeleccionada,
                dia: diaSemana
            });

            console.log('Franjas encontradas:', franjasData);
            console.log('Cantidad de franjas:', franjasData?.length || 0);

            setFranjas(franjasData || []);
        } catch (error) {
            console.error('Error al cargar franjas:', error);
            setFranjas([]);
            toast({
                title: "Error",
                description: "Error al cargar las franjas horarias",
                variant: "destructive"
            });
        }
    };

    const verificarDisponibilidad = async () => {
        if (!franjaSeleccionada || !fechaSeleccionada) {
            console.log('verificarDisponibilidad: faltan datos', { franjaSeleccionada, fechaSeleccionada });
            return;
        }

        console.log('verificarDisponibilidad: iniciando', { franjaSeleccionada, fechaSeleccionada });

        try {
            setLoadingDisponibilidad(true);
            console.log('Consultando disponibilidad para franja:', franjaSeleccionada, 'fecha:', fechaSeleccionada);

            const disponibilidad = await apiService.getDisponibilidad(franjaSeleccionada, fechaSeleccionada);
            console.log('Respuesta de disponibilidad completa:', JSON.stringify(disponibilidad, null, 2));

            // Usar los campos reales de la API
            if (disponibilidad) {
                console.log('Información de cupos:', {
                    totalSlots: disponibilidad.totalSlots,
                    slotsOcupados: disponibilidad.slotsOcupados,
                    slotsDisponibles: disponibilidad.slotsDisponibles
                });

                // Usar los slots del objeto slots.disponibles
                const slots = disponibilidad.slots?.disponibles || [];
                console.log('Slots disponibles del backend:', slots);
                setSlotsDisponibles(slots);

                // Mostrar mensaje si no hay cupos disponibles
                if (disponibilidad.slotsDisponibles === 0) {
                    toast({
                        title: "Sin cupos disponibles",
                        description: `No hay cupos disponibles para esta fecha. Cupos ocupados: ${disponibilidad.slotsOcupados}/${disponibilidad.totalSlots}`,
                        variant: "destructive"
                    });
                }
            } else {
                console.warn('No se recibió respuesta de disponibilidad');
                setSlotsDisponibles([]);
            }

        } catch (error: any) {
            console.error('Error al verificar disponibilidad:', error);
            console.error('Detalles del error:', error.response?.data || error.message);
            setSlotsDisponibles([]);

            toast({
                title: "Error",
                description: "Error al verificar disponibilidad de la franja",
                variant: "destructive"
            });
        } finally {
            setLoadingDisponibilidad(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.pacienteId || !formData.franjaId || !formData.fecha ||
            !formData.horaInicio || !formData.horaFin || !formData.motivoConsulta) {
            toast({
                title: "Error",
                description: "Todos los campos obligatorios deben estar completos",
                variant: "destructive"
            });
            return;
        }

        if (formData.horaInicio >= formData.horaFin) {
            toast({
                title: "Error",
                description: "La hora de inicio debe ser anterior a la hora de fin",
                variant: "destructive"
            });
            return;
        }

        try {
            setLoading(true);

            let citaResultado: Cita;

            if (mode === 'create') {
                const datosCreacion: CrearCitaDto = {
                    pacienteId: formData.pacienteId,
                    franjaId: formData.franjaId,
                    fecha: formData.fecha,
                    horaInicio: formData.horaInicio,
                    horaFin: formData.horaFin,
                    motivoConsulta: formData.motivoConsulta,
                    observaciones: formData.observaciones
                };
                console.log('Datos que se envían al crear cita:', JSON.stringify(datosCreacion, null, 2));
                citaResultado = await apiService.createCita(datosCreacion);
            } else {
                const datosActualizacion: UpdateCitaDto = {
                    franjaId: formData.franjaId,
                    fecha: formData.fecha,
                    horaInicio: formData.horaInicio,
                    horaFin: formData.horaFin,
                    motivoConsulta: formData.motivoConsulta,
                    observaciones: formData.observaciones
                };
                console.log('Datos que se envían al actualizar cita:', JSON.stringify(datosActualizacion, null, 2));
                citaResultado = await apiService.updateCita(citaInicial!.id, datosActualizacion);
            }

            onSave(citaResultado);
            handleClose();

            toast({
                title: "Éxito",
                description: `Cita ${mode === 'create' ? 'creada' : 'actualizada'} correctamente`
            });
        } catch (error: any) {
            console.error('Error al guardar cita:', error);
            console.error('Detalles del error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            console.error('Mensaje del servidor:', error.response?.data?.message);
            console.error('Error completo del servidor:', JSON.stringify(error.response?.data, null, 2));

            const errorMessage = error.response?.data?.message || error.message || "Error al guardar la cita";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            pacienteId: 0,
            franjaId: 0,
            fecha: '',
            horaInicio: '',
            horaFin: '',
            motivoConsulta: '',
            observaciones: ''
        });
        setEspecialidadSeleccionada(0);
        setFranjaSeleccionada(0);
        setFechaSeleccionada('');
        setSlotsDisponibles([]);
        setFranjas([]);
        onClose();
    };

    const seleccionarSlot = (slot: SlotDisponible) => {
        setFormData(prev => ({
            ...prev,
            horaInicio: slot.inicio,
            horaFin: slot.fin
        }));
    };

    const getDiaSemana = (fecha: string) => {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[new Date(fecha + 'T00:00:00').getDay()];
    };

    // Usar las franjas que ya vienen filtradas del backend
    const franjasDelDia = franjas.filter(franja => {
        // Solo verificar que la franja esté activa
        return franja.estado === 'activo';
    });

    console.log('Franjas después del filtro local:', franjasDelDia);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Nueva Cita' : 'Editar Cita'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Complete los datos para programar una nueva cita médica'
                            : 'Modifique los datos de la cita médica'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Información del Paciente */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Información del Paciente
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="paciente">Paciente *</Label>
                                    <Select
                                        value={formData.pacienteId > 0 ? formData.pacienteId.toString() : ''}
                                        onValueChange={(value) =>
                                            setFormData(prev => ({ ...prev, pacienteId: parseInt(value) }))
                                        }
                                        disabled={mode === 'edit'}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un paciente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pacientes.map(paciente => (
                                                <SelectItem key={paciente.id} value={paciente.id?.toString() || `temp-${paciente.id}`}>
                                                    {paciente.nombre} {paciente.apellido} - CI: {paciente.ci}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="motivoConsulta">Motivo de Consulta *</Label>
                                    <Input
                                        id="motivoConsulta"
                                        value={formData.motivoConsulta}
                                        onChange={(e) =>
                                            setFormData(prev => ({ ...prev, motivoConsulta: e.target.value }))
                                        }
                                        placeholder="Ej: Limpieza dental, consulta general..."
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <Textarea
                                        id="observaciones"
                                        value={formData.observaciones}
                                        onChange={(e) =>
                                            setFormData(prev => ({ ...prev, observaciones: e.target.value }))
                                        }
                                        placeholder="Información adicional sobre la cita..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información de la Cita */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5" />
                                    Programación
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="especialidad">Especialidad *</Label>
                                    <Select
                                        value={especialidadSeleccionada > 0 ? especialidadSeleccionada.toString() : ''}
                                        onValueChange={(value) => {
                                            const nuevaEspecialidad = parseInt(value);
                                            setEspecialidadSeleccionada(nuevaEspecialidad);
                                            // Resetear franjas y slots cuando cambie la especialidad
                                            setFranjas([]);
                                            setFranjaSeleccionada(0);
                                            setSlotsDisponibles([]);
                                            setFormData(prev => ({ ...prev, franjaId: 0, horaInicio: '', horaFin: '' }));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una especialidad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {especialidades.length === 0 ? (
                                                <SelectItem value="loading" disabled>
                                                    {loading ? 'Cargando especialidades...' : 'No hay especialidades disponibles'}
                                                </SelectItem>
                                            ) : (
                                                especialidades.map(esp => (
                                                    <SelectItem key={esp.id} value={esp.id.toString()}>
                                                        {esp.nombre}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="fecha">Fecha *</Label>
                                    <Input
                                        id="fecha"
                                        type="date"
                                        value={formData.fecha}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, fecha: e.target.value }));
                                            setFechaSeleccionada(e.target.value);
                                            // Resetear franjas y slots cuando cambie la fecha
                                            setFranjas([]);
                                            setFranjaSeleccionada(0);
                                            setSlotsDisponibles([]);
                                            setFormData(prev => ({ ...prev, franjaId: 0, horaInicio: '', horaFin: '' }));
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                    {fechaSeleccionada && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {getDiaSemana(fechaSeleccionada)}
                                        </p>
                                    )}
                                </div>

                                {fechaSeleccionada && especialidadSeleccionada > 0 && (
                                    <div>
                                        <Label>Franja Horaria *</Label>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {franjasDelDia.length === 0 ? (
                                                <div className="text-center py-4 text-muted-foreground">
                                                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                                    <p className="font-medium">No hay franjas disponibles</p>
                                                    <p className="text-sm">
                                                        No se encontraron franjas horarias para <strong>{especialidades.find(e => e.id === especialidadSeleccionada)?.nombre}</strong>
                                                        {fechaSeleccionada && (
                                                            <span> el día <strong>{getDiaSemana(fechaSeleccionada)}</strong></span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs mt-1">
                                                        Verifica que existan franjas horarias configuradas en la administración
                                                    </p>
                                                </div>
                                            ) : (
                                                franjasDelDia.map(franja => (
                                                    <div
                                                        key={franja.id}
                                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${franjaSeleccionada === franja.id
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        onClick={() => {
                                                            console.log('Seleccionando franja:', franja.id);
                                                            setFranjaSeleccionada(franja.id);
                                                            setFormData(prev => ({ ...prev, franjaId: franja.id }));
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium">
                                                                    {franja.horaInicio.substring(0, 5)} - {franja.horaFin.substring(0, 5)}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Dr. {franja.responsable.nombre}
                                                                </p>
                                                            </div>
                                                            <Badge variant="outline">
                                                                {franja.duracionCitaMin} min
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Slots Disponibles */}
                    {franjaSeleccionada > 0 && fechaSeleccionada && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Horarios Disponibles
                                </CardTitle>
                                <CardDescription>
                                    Selecciona un horario disponible para la cita
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingDisponibilidad ? (
                                    <div className="text-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                        <p className="text-muted-foreground">Verificando disponibilidad...</p>
                                    </div>
                                ) : !Array.isArray(slotsDisponibles) || slotsDisponibles.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                        <p>No hay horarios disponibles para esta fecha y franja</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                        {slotsDisponibles.map((slot, index) => (
                                            <Button
                                                key={index}
                                                type="button"
                                                variant={
                                                    formData.horaInicio === slot.inicio && formData.horaFin === slot.fin
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={() => seleccionarSlot(slot)}
                                                className="text-xs"
                                            >
                                                {slot.inicio.substring(0, 5)} - {slot.fin.substring(0, 5)}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="min-w-[120px]"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {mode === 'create' ? 'Crear Cita' : 'Guardar Cambios'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}