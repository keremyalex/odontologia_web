import React, { useState, useEffect } from 'react';
import {
    CalendarDaysIcon,
    PlusIcon,
    CheckCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import apiService from '../services/api';
import type { Turno, Paciente } from '../types';

const AppointmentsPage: React.FC = () => {
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [filteredTurnos, setFilteredTurnos] = useState<Turno[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterTurnos();
    }, [turnos, filterStatus]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [turnosData, pacientesData] = await Promise.all([
                apiService.getTurnos(),
                apiService.getPacientes(),
            ]);

            setTurnos(turnosData);
            setPacientes(pacientesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterTurnos = () => {
        if (filterStatus === 'all') {
            setFilteredTurnos(turnos);
        } else {
            setFilteredTurnos(turnos.filter(turno => turno.estado === filterStatus));
        }
    };

    const handleCheckin = async (turnoId: number) => {
        try {
            await apiService.checkinTurno(turnoId);
            await loadData();
        } catch (error) {
            console.error('Error during check-in:', error);
            alert('Error al realizar el check-in');
        }
    };

    const getPacienteNombre = (pacienteId: number): string => {
        const paciente = pacientes.find(p => p.id === pacienteId);
        return paciente ? `${paciente.nombre} ${paciente.apellido}` : `Paciente #${pacienteId}`;
    };

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
        return {
            date: date.toLocaleDateString('es-ES'),
            time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="card p-6">
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Turnos</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Administra los turnos y citas de la clínica.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            disabled
                            className="btn-primary inline-flex items-center opacity-50 cursor-not-allowed"
                            title="Funcionalidad en desarrollo"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Nuevo Turno (Próximamente)
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="card p-6">
                    <div className="sm:flex sm:items-center sm:space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filtrar por estado:
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="input-field"
                            >
                                <option value="all">Todos los turnos</option>
                                <option value="pendiente">Pendientes</option>
                                <option value="confirmado">Confirmados</option>
                                <option value="atendido">Atendidos</option>
                                <option value="cancelado">Cancelados</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card p-6">
                        <div className="flex items-center">
                            <ClockIcon className="h-8 w-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {turnos.filter(t => t.estado === 'pendiente').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center">
                            <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Confirmados</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {turnos.filter(t => t.estado === 'confirmado').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Atendidos</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {turnos.filter(t => t.estado === 'atendido').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <div className="flex items-center">
                            <CalendarDaysIcon className="h-8 w-8 text-gray-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {turnos.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments Table */}
                <div className="card overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            {filteredTurnos.length} turno(s) encontrado(s)
                        </h3>
                        {filteredTurnos.length === 0 ? (
                            <div className="text-center py-8">
                                <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay turnos</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {filterStatus === 'all'
                                        ? 'No hay turnos registrados en el sistema.'
                                        : `No hay turnos con estado "${filterStatus}".`}
                                </p>
                            </div>
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
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estudiante
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredTurnos.map((turno) => {
                                            const { date, time } = formatDateTime(turno.fechaInicio);
                                            const { time: endTime } = formatDateTime(turno.fechaFin);

                                            return (
                                                <tr key={turno.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {getPacienteNombre(turno.pacienteId)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{date}</div>
                                                        <div className="text-sm text-gray-500">{time} - {endTime}</div>
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
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {turno.estudianteId ? `Estudiante #${turno.estudianteId}` : 'No asignado'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {turno.estado === 'confirmado' && (
                                                            <button
                                                                onClick={() => handleCheckin(turno.id!)}
                                                                className="text-green-600 hover:text-green-900 text-sm bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                                                            >
                                                                Check-in
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AppointmentsPage;