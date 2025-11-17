import React, { useState, useEffect } from 'react';
import {
    UserGroupIcon,
    CalendarDaysIcon,
    ClockIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import type { Turno } from '../types';

const DashboardPage: React.FC = () => {
    const { user, hasRole } = useAuth();
    const [stats, setStats] = useState({
        totalPacientes: 0,
        turnosHoy: 0,
        turnosPendientes: 0,
        turnosCompletados: 0,
    });
    const [recentTurnos, setRecentTurnos] = useState<Turno[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [pacientes, turnos] = await Promise.all([
                    apiService.getPacientes(),
                    apiService.getTurnos(),
                ]);

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const turnosHoy = turnos.filter(turno => {
                    const fechaTurno = new Date(turno.fechaInicio);
                    return fechaTurno >= today && fechaTurno < tomorrow;
                });

                setStats({
                    totalPacientes: pacientes.length,
                    turnosHoy: turnosHoy.length,
                    turnosPendientes: turnos.filter(t => t.estado === 'pendiente').length,
                    turnosCompletados: turnos.filter(t => t.estado === 'atendido').length,
                });

                // Mostrar los turnos más recientes
                const recentTurnos = turnos
                    .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())
                    .slice(0, 5);

                setRecentTurnos(recentTurnos);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'confirmado':
                return 'bg-blue-100 text-blue-800';
            case 'atendido':
                return 'bg-green-100 text-green-800';
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="card p-6">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
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
                        Bienvenido, {user?.nombre}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Panel de control - Clínica Odontológica UAGRM
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card p-6">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <UserGroupIcon className="h-8 w-8 text-primary-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Total Pacientes
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.totalPacientes}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Turnos Hoy
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.turnosHoy}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <ClockIcon className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Pendientes
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.turnosPendientes}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        Completados
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stats.turnosCompletados}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="card">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Turnos Recientes
                        </h3>
                        {recentTurnos.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No hay turnos registrados
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Paciente
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha y Hora
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Consultorio
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentTurnos.map((turno) => (
                                            <tr key={turno.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    Paciente #{turno.pacienteId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDateTime(turno.fechaInicio)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {turno.consultorio || 'No asignado'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(
                                                            turno.estado
                                                        )}`}
                                                    >
                                                        {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                {hasRole(['admin', 'recepcion']) && (
                    <div className="card">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Acciones Rápidas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <a
                                    href="/patients/new"
                                    className="btn-primary text-center block"
                                >
                                    Registrar Paciente
                                </a>
                                <a
                                    href="/appointments/new"
                                    className="btn-outline text-center block"
                                >
                                    Nuevo Turno
                                </a>
                                <a
                                    href="/patients"
                                    className="btn-secondary text-center block"
                                >
                                    Ver Pacientes
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;