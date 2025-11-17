import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import apiService from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    UserPlus,
    Search,
    Edit,
    Trash2,
    Shield,
    Users,
    GraduationCap,
    UserCheck
} from 'lucide-react';
import type { User } from '@/types';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const { hasRole } = useAuth();

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, selectedRole]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await apiService.getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error('Error loading users:', error);
            setError('Error al cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedRole) {
            filtered = filtered.filter(user => user.rol === selectedRole);
        }

        setFilteredUsers(filtered);
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="h-4 w-4" />;
            case 'docente':
                return <GraduationCap className="h-4 w-4" />;
            case 'estudiante':
                return <Users className="h-4 w-4" />;
            case 'recepcion':
                return <UserCheck className="h-4 w-4" />;
            default:
                return <Users className="h-4 w-4" />;
        }
    };

    const getRoleVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'docente':
                return 'default';
            case 'estudiante':
                return 'secondary';
            case 'recepcion':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Administrador';
            case 'docente':
                return 'Docente';
            case 'estudiante':
                return 'Estudiante';
            case 'recepcion':
                return 'Recepción';
            default:
                return role;
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    // Verificar permisos - solo admin puede ver usuarios
    if (!hasRole(['admin'])) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Alert className="max-w-md">
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                            No tienes permisos para acceder a la gestión de usuarios.
                        </AlertDescription>
                    </Alert>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                        <p className="text-gray-600 mt-1">
                            Administra usuarios, roles y permisos del sistema
                        </p>
                    </div>
                    <Button asChild>
                        <Link to="/users/new">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Nuevo Usuario
                        </Link>
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Buscar por nombre o email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <div className="md:w-48">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Todos los roles</option>
                                    <option value="admin">Administrador</option>
                                    <option value="docente">Docente</option>
                                    <option value="estudiante">Estudiante</option>
                                    <option value="recepcion">Recepción</option>
                                </select>
                            </div>
                            {(searchTerm || selectedRole) && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedRole('');
                                    }}
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-primary" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Shield className="h-8 w-8 text-red-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Administradores</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {users.filter(u => u.rol === 'admin').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <GraduationCap className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Docentes</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {users.filter(u => u.rol === 'docente').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <UserCheck className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Estudiantes</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {users.filter(u => u.rol === 'estudiante').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla de usuarios */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Lista de Usuarios ({filteredUsers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 mb-2">
                                    {searchTerm || selectedRole ? 'No se encontraron usuarios con los filtros aplicados' : 'No hay usuarios registrados'}
                                </p>
                                {!searchTerm && !selectedRole && (
                                    <Button asChild>
                                        <Link to="/users/new">
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Crear primer usuario
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Usuario</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Fecha de Registro</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {getRoleIcon(user.rol)}
                                                    <span className="ml-2 font-medium">{user.nombre}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleVariant(user.rol) as any}>
                                                    {getRoleLabel(user.rol)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.creado_at ? new Date(user.creado_at).toLocaleDateString('es-ES') : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link to={`/users/${user.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            // TODO: Implementar eliminación de usuario
                                                            console.log('Delete user:', user.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default UsersPage;