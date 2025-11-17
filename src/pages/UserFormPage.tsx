import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/DashboardLayout';
import apiService from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import type { RegisterRequest } from '@/types';

interface UserFormData extends RegisterRequest {
    confirmPassword?: string;
}

const UserFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { hasRole } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<UserFormData>();

    const password = watch('password');

    useEffect(() => {
        if (isEdit && id) {
            loadUser(parseInt(id));
        }
    }, [isEdit, id]);

    const loadUser = async (userId: number) => {
        try {
            setLoading(true);
            // Note: Necesitaremos un endpoint para obtener un usuario específico
            // Por ahora, obtenemos todos y filtramos
            const users = await apiService.getUsers();
            const user = users.find(u => u.id === userId);

            if (user) {
                reset({
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                });
            } else {
                setError('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error loading user:', error);
            setError('Error al cargar los datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: UserFormData) => {
        setLoading(true);
        setError('');

        // Validar confirmación de contraseña solo si es creación o se está cambiando
        if (!isEdit || data.password) {
            if (data.password !== data.confirmPassword) {
                setError('Las contraseñas no coinciden');
                setLoading(false);
                return;
            }
        }

        try {
            const userData: RegisterRequest = {
                nombre: data.nombre,
                email: data.email,
                password: data.password || 'temp_password_123', // Default para edición
                rol: data.rol,
            };

            if (isEdit && id) {
                // TODO: Implementar endpoint para actualizar usuario
                console.log('Update user:', id, userData);
                // await apiService.updateUser(parseInt(id), userData);
                setError('La edición de usuarios no está implementada aún en la API');
                setLoading(false);
                return;
            } else {
                await apiService.register(userData);
            }

            navigate('/users');
        } catch (error: any) {
            console.error('Error saving user:', error);
            setError(
                error.response?.data?.message ||
                `Error al ${isEdit ? 'actualizar' : 'crear'} el usuario`
            );
        } finally {
            setLoading(false);
        }
    };

    // Verificar permisos
    if (!hasRole(['admin'])) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Alert className="max-w-md">
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                            No tienes permisos para gestionar usuarios.
                        </AlertDescription>
                    </Alert>
                </div>
            </DashboardLayout>
        );
    }

    if (loading && isEdit) {
        return (
            <DashboardLayout>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
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
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEdit
                            ? 'Modifica los datos del usuario'
                            : 'Crea un nuevo usuario del sistema'}
                    </p>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                        </CardTitle>
                        <CardDescription>
                            {isEdit
                                ? 'Actualiza la información del usuario. La contraseña solo se cambiará si proporcionas una nueva.'
                                : 'Ingresa la información del nuevo usuario. Todos los campos son obligatorios.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre Completo *</Label>
                                    <Input
                                        {...register('nombre', {
                                            required: 'El nombre es requerido',
                                            minLength: {
                                                value: 3,
                                                message: 'El nombre debe tener al menos 3 caracteres'
                                            }
                                        })}
                                        id="nombre"
                                        placeholder="Dr. Juan Pérez"
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-destructive">{errors.nombre.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        {...register('email', {
                                            required: 'El email es requerido',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Email inválido'
                                            }
                                        })}
                                        id="email"
                                        type="email"
                                        placeholder="usuario@clinica.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Rol */}
                                <div className="space-y-2">
                                    <Label htmlFor="rol">Rol *</Label>
                                    <select
                                        {...register('rol', {
                                            required: 'El rol es requerido'
                                        })}
                                        id="rol"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Seleccionar rol...</option>
                                        <option value="admin">Administrador</option>
                                        <option value="docente">Docente</option>
                                        <option value="estudiante">Estudiante</option>
                                        <option value="recepcion">Recepción</option>
                                    </select>
                                    {errors.rol && (
                                        <p className="text-sm text-destructive">{errors.rol.message}</p>
                                    )}
                                </div>

                                {/* Contraseña */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        {isEdit ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            {...register('password', {
                                                required: isEdit ? false : 'La contraseña es requerida',
                                                minLength: {
                                                    value: 6,
                                                    message: 'La contraseña debe tener al menos 6 caracteres'
                                                }
                                            })}
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder={isEdit ? 'Dejar vacío para mantener actual' : '••••••••'}
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center h-full"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password.message}</p>
                                    )}
                                </div>

                                {/* Confirmar contraseña */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        {isEdit ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña *'}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            {...register('confirmPassword', {
                                                required: !isEdit || !!password ? 'Confirma la contraseña' : false,
                                                validate: (value) => {
                                                    if (!isEdit || password) {
                                                        return value === password || 'Las contraseñas no coinciden';
                                                    }
                                                    return true;
                                                }
                                            })}
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder={isEdit ? 'Confirmar nueva contraseña' : '••••••••'}
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center h-full"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Información sobre roles */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 mb-2">Información sobre Roles</h4>
                                <div className="space-y-1 text-sm text-blue-800">
                                    <p><strong>Administrador:</strong> Acceso total al sistema</p>
                                    <p><strong>Docente:</strong> Supervisión de estudiantes y tratamientos</p>
                                    <p><strong>Estudiante:</strong> Atención de pacientes bajo supervisión</p>
                                    <p><strong>Recepción:</strong> Gestión de citas y pacientes</p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/users')}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {isEdit ? 'Actualizando...' : 'Creando...'}
                                        </>
                                    ) : (
                                        isEdit ? 'Actualizar Usuario' : 'Crear Usuario'
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

export default UserFormPage;