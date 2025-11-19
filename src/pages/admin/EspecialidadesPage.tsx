import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Especialidad, CreateEspecialidadDto, UpdateEspecialidadDto } from '@/types';
import apiService from '@/services/api';

const EspecialidadesPage: React.FC = () => {
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEspecialidad, setEditingEspecialidad] = useState<Especialidad | null>(null);
    const [formData, setFormData] = useState<CreateEspecialidadDto>({
        nombre: '',
        descripcion: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEspecialidades();
    }, []);

    const fetchEspecialidades = async () => {
        try {
            setLoading(true);
            const data = await apiService.getEspecialidades();
            setEspecialidades(data);
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
            // Mantener array vacío para permitir crear nuevas especialidades
            setEspecialidades([]);
            // No mostrar error toast ya que es normal no tener datos al inicio
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nombre.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        try {
            setSubmitting(true);
            
            if (editingEspecialidad) {
                // Actualizar especialidad existente
                const updateData: UpdateEspecialidadDto = {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion || undefined
                };
                await apiService.updateEspecialidad(editingEspecialidad.id!, updateData);
                toast.success('Especialidad actualizada correctamente');
            } else {
                // Crear nueva especialidad
                await apiService.createEspecialidad(formData);
                toast.success('Especialidad creada correctamente');
            }

            await fetchEspecialidades();
            handleCloseDialog();
        } catch (error: any) {
            console.error('Error al guardar especialidad:', error);
            const errorMessage = error.response?.data?.message || 'Error al guardar la especialidad';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await apiService.deleteEspecialidad(id);
            toast.success('Especialidad eliminada correctamente');
            await fetchEspecialidades();
        } catch (error: any) {
            console.error('Error al eliminar especialidad:', error);
            const errorMessage = error.response?.data?.message || 'Error al eliminar la especialidad';
            toast.error(errorMessage);
        }
    };

    const handleEdit = (especialidad: Especialidad) => {
        setEditingEspecialidad(especialidad);
        setFormData({
            nombre: especialidad.nombre,
            descripcion: especialidad.descripcion || ''
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingEspecialidad(null);
        setFormData({ nombre: '', descripcion: '' });
    };

    const filteredEspecialidades = especialidades.filter(especialidad =>
        especialidad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (especialidad.descripcion && especialidad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Especialidades</h1>
                    <p className="text-muted-foreground">
                        Gestiona las especialidades médicas de la clínica
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingEspecialidad(null)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Especialidad
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingEspecialidad ? 'Editar Especialidad' : 'Nueva Especialidad'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingEspecialidad 
                                    ? 'Modifica los datos de la especialidad' 
                                    : 'Crea una nueva especialidad médica'
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre *</Label>
                                <Input
                                    id="nombre"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                    placeholder="Ej: Endodoncia"
                                    disabled={submitting}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                    placeholder="Descripción detallada de la especialidad"
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
                                    {editingEspecialidad ? 'Actualizar' : 'Crear'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Lista de Especialidades</span>
                        <Badge variant="secondary">
                            {filteredEspecialidades.length} especialidad{filteredEspecialidades.length !== 1 ? 'es' : ''}
                        </Badge>
                    </CardTitle>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar especialidades..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <span>Cargando especialidades...</span>
                        </div>
                    ) : filteredEspecialidades.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                {searchTerm ? 'No se encontraron resultados' : 'No hay especialidades'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm 
                                    ? 'Intenta con otros términos de búsqueda'
                                    : 'Comienza creando tu primera especialidad'
                                }
                            </p>
                            {!searchTerm && (
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Especialidad
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredEspecialidades.map((especialidad) => (
                                <div key={especialidad.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{especialidad.nombre}</h3>
                                            {especialidad.descripcion && (
                                                <p className="text-muted-foreground mt-1">{especialidad.descripcion}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                                                <span>
                                                    Creada: {new Date(especialidad.createdAt).toLocaleDateString()}
                                                </span>
                                                {especialidad.franjasHorarias && (
                                                    <Badge variant="outline">
                                                        {especialidad.franjasHorarias.length} franja{especialidad.franjasHorarias.length !== 1 ? 's' : ''}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(especialidad)}
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
                                                            Esta acción no se puede deshacer. Se eliminará permanentemente la especialidad "{especialidad.nombre}".
                                                            {especialidad.franjasHorarias && especialidad.franjasHorarias.length > 0 && (
                                                                <span className="block mt-2 text-destructive">
                                                                    ⚠️ Esta especialidad tiene franjas horarias asociadas que también serán eliminadas.
                                                                </span>
                                                            )}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(especialidad.id)}
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

export default EspecialidadesPage;