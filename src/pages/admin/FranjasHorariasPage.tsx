import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Filter, Clock, Calendar, Loader2, Eye, EyeOff, Pause, User as UserIcon } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type {
    FranjaHoraria,
    CreateFranjaHorariaDto,
    UpdateFranjaHorariaDto,
    FranjaHorariaFilters,
    Especialidad,
    User
} from '@/types';
import { DIAS_SEMANA, ESTADOS_FRANJA } from '@/types';
import apiService from '@/services/api';

const FranjasHorariasPage: React.FC = () => {
    const [franjas, setFranjas] = useState<FranjaHoraria[]>([]);
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [docentes, setDocentes] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFranja, setEditingFranja] = useState<FranjaHoraria | null>(null);
    const [filters, setFilters] = useState<FranjaHorariaFilters>({});
    const [formData, setFormData] = useState<CreateFranjaHorariaDto>({
        diaSemana: 1,
        especialidadId: 0,
        responsableId: 0,
        horaInicio: '',
        horaFin: '',
        duracionCitaMin: 30,
        cuposMaximos: undefined,
        estado: 'activo',
        observaciones: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchFranjas();
    }, [filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [franjasData, especialidadesData, docentesData] = await Promise.all([
                apiService.getFranjasHorarias(),
                apiService.getEspecialidades(),
                apiService.getDocentes()
            ]);

            setFranjas(franjasData);
            setEspecialidades(especialidadesData);
            setDocentes(docentesData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            toast.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const fetchFranjas = async () => {
        try {
            const params = new URLSearchParams();

            if (filters.dia) params.append('dia', filters.dia.toString());
            if (filters.especialidad) params.append('especialidad', filters.especialidad.toString());
            if (filters.responsable) params.append('responsable', filters.responsable.toString());

            if (params.toString()) {
                const data = await apiService.getFranjasHorarias(Object.fromEntries(params));
                setFranjas(data);
            } else {
                const data = await apiService.getFranjasHorarias();
                setFranjas(data);
            }
        } catch (error) {
            console.error('Error al cargar franjas:', error);
            toast.error('Error al cargar las franjas horarias');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.especialidadId || !formData.responsableId) {
            toast.error('Debe seleccionar especialidad y responsable');
            return;
        }

        if (!formData.horaInicio || !formData.horaFin) {
            toast.error('Las horas de inicio y fin son requeridas');
            return;
        }

        if (formData.horaInicio >= formData.horaFin) {
            toast.error('La hora de inicio debe ser anterior a la hora de fin');
            return;
        }

        try {
            setSubmitting(true);

            if (editingFranja) {
                const updateData: UpdateFranjaHorariaDto = {
                    diaSemana: formData.diaSemana,
                    especialidadId: formData.especialidadId,
                    responsableId: formData.responsableId,
                    horaInicio: formData.horaInicio,
                    horaFin: formData.horaFin,
                    duracionCitaMin: formData.duracionCitaMin,
                    cuposMaximos: formData.cuposMaximos,
                    estado: formData.estado,
                    observaciones: formData.observaciones || undefined
                };
                await apiService.updateFranjaHoraria(editingFranja.id!, updateData);
                toast.success('Franja horaria actualizada correctamente');
            } else {
                await apiService.createFranjaHoraria(formData);
                toast.success('Franja horaria creada correctamente');
            }

            await fetchFranjas();
            handleCloseDialog();
        } catch (error: any) {
            console.error('Error al guardar franja:', error);
            const errorMessage = error.response?.data?.message || 'Error al guardar la franja horaria';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await apiService.deleteFranjaHoraria(id);
            toast.success('Franja horaria eliminada correctamente');
            await fetchFranjas();
        } catch (error: any) {
            console.error('Error al eliminar franja:', error);
            const errorMessage = error.response?.data?.message || 'Error al eliminar la franja horaria';
            toast.error(errorMessage);
        }
    };

    const handleEdit = (franja: FranjaHoraria) => {
        setEditingFranja(franja);
        setFormData({
            diaSemana: franja.diaSemana,
            especialidadId: franja.especialidadId,
            responsableId: franja.responsableId,
            horaInicio: franja.horaInicio,
            horaFin: franja.horaFin,
            duracionCitaMin: franja.duracionCitaMin,
            cuposMaximos: franja.cuposMaximos,
            estado: franja.estado,
            observaciones: franja.observaciones || ''
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingFranja(null);
        setFormData({
            diaSemana: 1,
            especialidadId: 0,
            responsableId: 0,
            horaInicio: '',
            horaFin: '',
            duracionCitaMin: 30,
            cuposMaximos: undefined,
            estado: 'activo',
            observaciones: ''
        });
    };

    const clearFilters = () => {
        setFilters({});
    };

    // Funciones helper para la vista de horario
    const getDiaName = (dia: number): string => {
        const dias = {
            1: 'Lunes',
            2: 'Martes', 
            3: 'Miércoles',
            4: 'Jueves',
            5: 'Viernes',
            6: 'Sábado',
            7: 'Domingo'
        };
        return dias[dia as keyof typeof dias] || '';
    };

    const groupFranjasByDay = () => {
        const grouped: { [key: number]: FranjaHoraria[] } = {};
        
        // Inicializar todos los días
        for (let i = 1; i <= 7; i++) {
            grouped[i] = [];
        }
        
        // Agrupar franjas por día y ordenar por hora
        franjas.forEach(franja => {
            if (!grouped[franja.diaSemana]) {
                grouped[franja.diaSemana] = [];
            }
            grouped[franja.diaSemana].push(franja);
        });
        
        // Ordenar cada día por hora de inicio
        Object.keys(grouped).forEach(dia => {
            grouped[parseInt(dia)].sort((a, b) => {
                return a.horaInicio.localeCompare(b.horaInicio);
            });
        });
        
        return grouped;
    };

    const getEspecialidadColor = (especialidadId: number): string => {
        const colors = [
            'bg-blue-100 text-blue-800 border-blue-200',
            'bg-green-100 text-green-800 border-green-200', 
            'bg-purple-100 text-purple-800 border-purple-200',
            'bg-orange-100 text-orange-800 border-orange-200',
            'bg-pink-100 text-pink-800 border-pink-200',
            'bg-indigo-100 text-indigo-800 border-indigo-200'
        ];
        return colors[especialidadId % colors.length];
    };

    const formatTime = (time: string) => {
        return time.slice(0, 5);
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'activo':
                return <Badge className="bg-green-500"><Eye className="w-3 h-3 mr-1" /> Activo</Badge>;
            case 'inactivo':
                return <Badge variant="secondary"><EyeOff className="w-3 h-3 mr-1" /> Inactivo</Badge>;
            case 'suspendido':
                return <Badge variant="destructive"><Pause className="w-3 h-3 mr-1" /> Suspendido</Badge>;
            default:
                return <Badge variant="outline">{estado}</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Franjas Horarias</h1>
                    <p className="text-muted-foreground">
                        Gestiona las franjas horarias específicas por especialidad y responsable
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingFranja(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Franja
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingFranja ? 'Editar Franja Horaria' : 'Nueva Franja Horaria'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingFranja
                                    ? 'Modifica los datos de la franja horaria'
                                    : 'Crea una nueva franja horaria para una especialidad'
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="diaSemana">Día de la Semana *</Label>
                                    <Select
                                        value={formData.diaSemana.toString()}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, diaSemana: parseInt(value) }))}
                                        disabled={submitting}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(DIAS_SEMANA).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado *</Label>
                                    <Select
                                        value={formData.estado}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value as any }))}
                                        disabled={submitting}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(ESTADOS_FRANJA).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="especialidad">Especialidad *</Label>
                                <Select
                                    value={formData.especialidadId.toString()}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, especialidadId: parseInt(value) }))}
                                    disabled={submitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar especialidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {especialidades.map((esp) => (
                                            <SelectItem key={esp.id} value={esp.id.toString()}>{esp.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="responsable">Docente Responsable *</Label>
                                <Select
                                    value={formData.responsableId.toString()}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, responsableId: parseInt(value) }))}
                                    disabled={submitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar docente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {docentes.map((docente) => (
                                            <SelectItem key={docente.id} value={docente.id.toString()}>{docente.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="horaInicio">Hora Inicio *</Label>
                                    <Input
                                        id="horaInicio"
                                        type="time"
                                        value={formData.horaInicio}
                                        onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
                                        disabled={submitting}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="horaFin">Hora Fin *</Label>
                                    <Input
                                        id="horaFin"
                                        type="time"
                                        value={formData.horaFin}
                                        onChange={(e) => setFormData(prev => ({ ...prev, horaFin: e.target.value }))}
                                        disabled={submitting}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duracion">Duración (min) *</Label>
                                    <Input
                                        id="duracion"
                                        type="number"
                                        min="15"
                                        max="120"
                                        value={formData.duracionCitaMin}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duracionCitaMin: parseInt(e.target.value) }))}
                                        disabled={submitting}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cuposMaximos">Cupos Máximos (opcional)</Label>
                                    <Input
                                        id="cuposMaximos"
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={formData.cuposMaximos || ''}
                                        onChange={(e) => setFormData(prev => ({ 
                                            ...prev, 
                                            cuposMaximos: e.target.value ? parseInt(e.target.value) : undefined 
                                        }))}
                                        placeholder="Automático si no se especifica"
                                        disabled={submitting}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Si no se especifica, se calculará automáticamente según la duración
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="observaciones">Observaciones</Label>
                                <Textarea
                                    id="observaciones"
                                    value={formData.observaciones}
                                    onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                                    placeholder="Notas adicionales (opcional)"
                                    rows={3}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={submitting}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {editingFranja ? 'Actualizar' : 'Crear'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Día de la Semana</Label>
                            <Select
                                value={filters.dia?.toString() || ''}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, dia: value === 'all' ? undefined : parseInt(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos los días" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los días</SelectItem>
                                    {Object.entries(DIAS_SEMANA).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Especialidad</Label>
                            <Select
                                value={filters.especialidad?.toString() || ''}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, especialidad: value === 'all' ? undefined : parseInt(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas las especialidades" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las especialidades</SelectItem>
                                    {especialidades.map(esp => (
                                        <SelectItem key={esp.id} value={esp.id.toString()}>{esp.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Docente</Label>
                            <Select
                                value={filters.responsable?.toString() || ''}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, responsable: value === 'all' ? undefined : parseInt(value) }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos los docentes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los docentes</SelectItem>
                                    {docentes.map(docente => (
                                        <SelectItem key={docente.id} value={docente.id.toString()}>{docente.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button variant="outline" onClick={clearFilters} className="w-full">
                                Limpiar Filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de franjas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Franjas Horarias</span>
                        <Badge variant="secondary">
                            {franjas.length} franja{franjas.length !== 1 ? 's' : ''}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <span>Cargando franjas horarias...</span>
                        </div>
                    ) : franjas.length === 0 ? (
                        <div className="text-center py-12">
                            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No hay franjas horarias</h3>
                            <p className="text-muted-foreground mb-4">
                                {Object.keys(filters).some(key => filters[key as keyof FranjaHorariaFilters])
                                    ? 'No se encontraron franjas con los filtros aplicados'
                                    : 'Crea la primera franja horaria para una especialidad'
                                }
                            </p>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Nueva Franja
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Tabla de Horarios por Día */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Día</th>
                                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Especialidad</th>
                                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Horario</th>
                                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Docente</th>
                                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Cupos</th>
                                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Estado</th>
                                            <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(groupFranjasByDay()).map(([dia, franjasDia]) => 
                                            franjasDia.length > 0 ? (
                                                franjasDia.map((franja, index) => {
                                                    const especialidad = especialidades.find(e => e.id === franja.especialidadId);
                                                    const responsable = docentes.find(d => d.id === franja.responsableId);
                                                    
                                                    return (
                                                        <tr key={franja.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                                                            {index === 0 && (
                                                                <td 
                                                                    className="border border-gray-200 px-4 py-3 font-medium bg-blue-50" 
                                                                    rowSpan={franjasDia.length}
                                                                >
                                                                    <div className="text-center">
                                                                        <div className="font-bold text-blue-900">{getDiaName(parseInt(dia))}</div>
                                                                        <Calendar className="w-4 h-4 mx-auto mt-1 text-blue-600" />
                                                                    </div>
                                                                </td>
                                                            )}
                                                            <td className="border border-gray-200 px-4 py-3">
                                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getEspecialidadColor(franja.especialidadId)}`}>
                                                                    {especialidad?.nombre || 'Especialidad no encontrada'}
                                                                </div>
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-3">
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                                    <span className="font-mono">
                                                                        {formatTime(franja.horaInicio)} - {formatTime(franja.horaFin)}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {franja.duracionCitaMin} min por cita
                                                                </div>
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <UserIcon className="w-4 h-4 text-gray-500" />
                                                                    <span>{responsable?.nombre || 'Responsable no encontrado'}</span>
                                                                </div>
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-3">
                                                                <div className="text-sm">
                                                                    <div className="font-medium text-blue-600">
                                                                        {franja.cuposMaximos !== null && franja.cuposMaximos !== undefined 
                                                                            ? `${franja.cuposMaximos} cupos` 
                                                                            : `${franja.cuposCalculados} cupos`
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {franja.cuposMaximos !== null && franja.cuposMaximos !== undefined 
                                                                            ? `Manual (calc: ${franja.cuposCalculados})` 
                                                                            : 'Automático'
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-3">
                                                                {getEstadoBadge(franja.estado)}
                                                            </td>
                                                            <td className="border border-gray-200 px-4 py-3">
                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleEdit(franja)}
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </Button>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>¿Eliminar franja horaria?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Esta acción no se puede deshacer. Se eliminará la franja horaria 
                                                                                    del {getDiaName(franja.diaSemana)} de {formatTime(franja.horaInicio)} a {formatTime(franja.horaFin)}.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction 
                                                                                    onClick={() => handleDelete(franja.id!)}
                                                                                    className="bg-red-600 hover:bg-red-700"
                                                                                >
                                                                                    Eliminar
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr key={`empty-${dia}`}>
                                                    <td className="border border-gray-200 px-4 py-3 font-medium bg-blue-50 text-center">
                                                        <div className="text-center">
                                                            <div className="font-bold text-blue-900">{getDiaName(parseInt(dia))}</div>
                                                            <Calendar className="w-4 h-4 mx-auto mt-1 text-blue-600" />
                                                        </div>
                                                    </td>
                                                    <td colSpan={6} className="border border-gray-200 px-4 py-6 text-center text-gray-500 italic">
                                                        Sin franjas horarias programadas
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        </DashboardLayout>
    );
};

export default FranjasHorariasPage;