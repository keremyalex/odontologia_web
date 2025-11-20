import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Loader2, Calendar, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { HorarioClinica, CreateHorarioClinicaDto, UpdateHorarioClinicaDto } from '@/types';
import { DIAS_SEMANA } from '@/types';
import apiService from '@/services/api';

const HorariosClinicaPage: React.FC = () => {
    const [horarios, setHorarios] = useState<HorarioClinica[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHorario, setEditingHorario] = useState<HorarioClinica | null>(null);
    const [formData, setFormData] = useState<CreateHorarioClinicaDto>({
        diasSemana: [],
        horaApertura: '',
        horaCierre: '',
        activo: true,
        descripcion: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchHorarios();
    }, []);

    const fetchHorarios = async () => {
        try {
            setLoading(true);
            const data = await apiService.getHorariosClinica();
            setHorarios(data);
        } catch (error) {
            console.error('Error al cargar horarios:', error);
            // Mantener array vacío para permitir crear nuevos horarios
            setHorarios([]);
            // No mostrar error toast ya que es normal no tener datos al inicio
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.diasSemana.length === 0) {
            toast.error('Debe seleccionar al menos un día de la semana');
            return;
        }

        if (!formData.horaApertura || !formData.horaCierre) {
            toast.error('Las horas de apertura y cierre son requeridas');
            return;
        }

        if (formData.horaApertura >= formData.horaCierre) {
            toast.error('La hora de apertura debe ser anterior a la hora de cierre');
            return;
        }

        try {
            setSubmitting(true);

            if (editingHorario) {
                const updateData: UpdateHorarioClinicaDto = {
                    diasSemana: formData.diasSemana,
                    horaApertura: formData.horaApertura,
                    horaCierre: formData.horaCierre,
                    activo: formData.activo,
                    descripcion: formData.descripcion || undefined
                };
                await apiService.updateHorarioClinica(editingHorario.id!, updateData);
                toast.success('Horario actualizado correctamente');
            } else {
                await apiService.createHorarioClinica(formData);
                toast.success('Horario creado correctamente');
            }

            await fetchHorarios();
            handleCloseDialog();
        } catch (error: any) {
            console.error('Error al guardar horario:', error);
            const errorMessage = error.response?.data?.message || 'Error al guardar el horario';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await apiService.deleteHorarioClinica(id);
            toast.success('Horario eliminado correctamente');
            await fetchHorarios();
        } catch (error: any) {
            console.error('Error al eliminar horario:', error);
            const errorMessage = error.response?.data?.message || 'Error al eliminar el horario';
            toast.error(errorMessage);
        }
    };

    const handleEdit = (horario: HorarioClinica) => {
        setEditingHorario(horario);
        setFormData({
            diasSemana: [...horario.diasSemana],
            horaApertura: horario.horaApertura,
            horaCierre: horario.horaCierre,
            activo: horario.activo,
            descripcion: horario.descripcion || ''
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingHorario(null);
        setFormData({
            diasSemana: [],
            horaApertura: '',
            horaCierre: '',
            activo: true,
            descripcion: ''
        });
    };

    const handleDayChange = (day: number, checked: boolean) => {
        if (checked) {
            setFormData(prev => ({
                ...prev,
                diasSemana: [...prev.diasSemana, day].sort()
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                diasSemana: prev.diasSemana.filter(d => d !== day)
            }));
        }
    };

    const getDaysString = (days: number[]) => {
        return days.map(day => DIAS_SEMANA[day as keyof typeof DIAS_SEMANA]).join(', ');
    };

    const formatTime = (time: string) => {
        return time.slice(0, 5); // Quitar segundos si los hay
    };

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Horarios de Clínica</h1>
                    <p className="text-muted-foreground">
                        Configura los horarios generales de funcionamiento de la clínica
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingHorario(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Horario
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editingHorario ? 'Editar Horario' : 'Nuevo Horario de Clínica'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingHorario
                                    ? 'Modifica los datos del horario de clínica'
                                    : 'Configura un nuevo horario general para la clínica'
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <Label>Días de la Semana *</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(DIAS_SEMANA).map(([value, label]) => (
                                        <div key={value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`dia-${value}`}
                                                checked={formData.diasSemana.includes(parseInt(value))}
                                                onCheckedChange={(checked) =>
                                                    handleDayChange(parseInt(value), checked as boolean)
                                                }
                                                disabled={submitting}
                                            />
                                            <Label htmlFor={`dia-${value}`} className="text-sm font-normal">
                                                {label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="horaApertura">Hora Apertura *</Label>
                                    <Input
                                        id="horaApertura"
                                        type="time"
                                        value={formData.horaApertura}
                                        onChange={(e) => setFormData(prev => ({ ...prev, horaApertura: e.target.value }))}
                                        disabled={submitting}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="horaCierre">Hora Cierre *</Label>
                                    <Input
                                        id="horaCierre"
                                        type="time"
                                        value={formData.horaCierre}
                                        onChange={(e) => setFormData(prev => ({ ...prev, horaCierre: e.target.value }))}
                                        disabled={submitting}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="activo"
                                    checked={formData.activo}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, activo: checked }))}
                                    disabled={submitting}
                                />
                                <Label htmlFor="activo">Horario activo</Label>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                    placeholder="Descripción del horario (opcional)"
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
                                    {editingHorario ? 'Actualizar' : 'Crear'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Horarios Configurados</span>
                        <Badge variant="secondary">
                            {horarios.length} horario{horarios.length !== 1 ? 's' : ''}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <span>Cargando horarios...</span>
                        </div>
                    ) : horarios.length === 0 ? (
                        <div className="text-center py-12">
                            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No hay horarios configurados</h3>
                            <p className="text-muted-foreground mb-4">
                                Configura el primer horario general de la clínica
                            </p>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Horario
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {horarios.map((horario) => (
                                <div key={horario.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                    <span className="font-semibold text-lg">
                                                        {formatTime(horario.horaApertura)} - {formatTime(horario.horaCierre)}
                                                    </span>
                                                </div>
                                                <Badge variant={horario.activo ? 'default' : 'secondary'}>
                                                    {horario.activo ? (
                                                        <><Eye className="w-3 h-3 mr-1" /> Activo</>
                                                    ) : (
                                                        <><EyeOff className="w-3 h-3 mr-1" /> Inactivo</>
                                                    )}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    {getDaysString(horario.diasSemana)}
                                                </span>
                                            </div>

                                            {horario.descripcion && (
                                                <p className="text-muted-foreground mt-1">{horario.descripcion}</p>
                                            )}

                                            <div className="text-sm text-muted-foreground mt-2">
                                                Creado: {horario.created_at || horario.createdAt ? 
                                                    new Date(horario.created_at || horario.createdAt!).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(horario)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="outline">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Se eliminará permanentemente este horario de clínica.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(horario.id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        </DashboardLayout>
    );
};

export default HorariosClinicaPage;