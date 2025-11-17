import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/DashboardLayout';
import apiService from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import type { Paciente } from '@/types';

const PatientFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Paciente>();

    useEffect(() => {
        if (isEdit && id) {
            loadPaciente(parseInt(id));
        }
    }, [isEdit, id]);

    const loadPaciente = async (pacienteId: number) => {
        try {
            setIsLoading(true);
            const paciente = await apiService.getPaciente(pacienteId);

            // Convert date to YYYY-MM-DD format for input
            if (paciente.fechaNac) {
                paciente.fechaNac = new Date(paciente.fechaNac).toISOString().split('T')[0];
            }

            reset(paciente);
        } catch (error) {
            console.error('Error loading patient:', error);
            setError('Error al cargar los datos del paciente');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: Paciente) => {
        setIsLoading(true);
        setError('');

        try {
            if (isEdit && id) {
                await apiService.updatePaciente(parseInt(id), data);
            } else {
                await apiService.createPaciente(data);
            }
            navigate('/patients');
        } catch (error: any) {
            console.error('Error saving patient:', error);
            setError(
                error.response?.data?.message ||
                `Error al ${isEdit ? 'actualizar' : 'crear'} el paciente`
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && isEdit) {
        return (
            <DashboardLayout>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {isEdit ? 'Editar Paciente' : 'Nuevo Paciente'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        {isEdit
                            ? 'Modifica los datos del paciente'
                            : 'Ingresa los datos del nuevo paciente'}
                    </p>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isEdit ? 'Editar Paciente' : 'Nuevo Paciente'}
                        </CardTitle>
                        <CardDescription>
                            {isEdit
                                ? 'Modifica los datos del paciente'
                                : 'Ingresa los datos del nuevo paciente'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Información Personal */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Información Personal
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre">Nombre *</Label>
                                        <Input
                                            {...register('nombre', {
                                                required: 'El nombre es requerido',
                                                minLength: {
                                                    value: 2,
                                                    message: 'El nombre debe tener al menos 2 caracteres'
                                                }
                                            })}
                                            id="nombre"
                                            placeholder="Juan"
                                        />
                                        {errors.nombre && (
                                            <p className="text-sm text-destructive">{errors.nombre.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="apellido">Apellido *</Label>
                                        <Input
                                            {...register('apellido', {
                                                required: 'El apellido es requerido',
                                                minLength: {
                                                    value: 2,
                                                    message: 'El apellido debe tener al menos 2 caracteres'
                                                }
                                            })}
                                            id="apellido"
                                            placeholder="Pérez"
                                        />
                                        {errors.apellido && (
                                            <p className="text-sm text-destructive">{errors.apellido.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ci">Cédula de Identidad</Label>
                                        <Input
                                            {...register('ci')}
                                            id="ci"
                                            placeholder="12345678"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fechaNac">Fecha de Nacimiento</Label>
                                        <Input
                                            {...register('fechaNac')}
                                            id="fechaNac"
                                            type="date"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sexo">Sexo</Label>
                                        <select 
                                            {...register('sexo')} 
                                            id="sexo"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="estadoCivil">Estado Civil</Label>
                                        <select 
                                            {...register('estadoCivil')} 
                                            id="estadoCivil"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Soltero">Soltero</option>
                                            <option value="Casado">Casado</option>
                                            <option value="Divorciado">Divorciado</option>
                                            <option value="Viudo">Viudo</option>
                                            <option value="Unión Libre">Unión Libre</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nacionalidad">Nacionalidad</Label>
                                        <Input
                                            {...register('nacionalidad')}
                                            id="nacionalidad"
                                            placeholder="Boliviana"
                                            defaultValue="Boliviana"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Información de Contacto */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Información de Contacto
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="telefono">Teléfono</Label>
                                        <Input
                                            {...register('telefono')}
                                            id="telefono"
                                            type="tel"
                                            placeholder="555-1234"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo Electrónico</Label>
                                        <Input
                                            {...register('email', {
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Email inválido'
                                                }
                                            })}
                                            id="email"
                                            type="email"
                                            placeholder="juan.perez@email.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="direccion">Dirección</Label>
                                        <Textarea
                                            {...register('direccion')}
                                            id="direccion"
                                            rows={3}
                                            placeholder="Av. Siempre Viva 123, Barrio Central"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/patients')}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {isEdit ? 'Actualizando...' : 'Guardando...'}
                                        </>
                                    ) : (
                                        isEdit ? 'Actualizar Paciente' : 'Crear Paciente'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default PatientFormPage;