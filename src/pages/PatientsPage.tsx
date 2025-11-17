import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/DashboardLayout';
import apiService from '../services/api';
import type { Paciente } from '../types';

const PatientsPage: React.FC = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPacientes();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = pacientes.filter(
                (paciente) =>
                    paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    paciente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    paciente.ci?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    paciente.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPacientes(filtered);
        } else {
            setFilteredPacientes(pacientes);
        }
    }, [searchTerm, pacientes]);

    const loadPacientes = async () => {
        try {
            setIsLoading(true);
            const data = await apiService.getPacientes();
            setPacientes(data);
            setFilteredPacientes(data);
        } catch (error) {
            console.error('Error loading patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este paciente?')) {
            try {
                await apiService.deletePaciente(id);
                await loadPacientes();
            } catch (error) {
                console.error('Error deleting patient:', error);
                alert('Error al eliminar el paciente');
            }
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="card p-6">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
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
                        <h1 className="text-2xl font-semibold text-gray-900">Pacientes</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Lista de todos los pacientes registrados en el sistema.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <Link
                            to="/patients/new"
                            className="btn-primary inline-flex items-center"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Nuevo Paciente
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="card p-6">
                    <div className="sm:flex sm:items-center sm:space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar pacientes por nombre, apellido, CI o email..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patients Table */}
                <div className="card overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            {filteredPacientes.length} paciente(s) encontrado(s)
                        </h3>
                        {filteredPacientes.length === 0 ? (
                            <div className="text-center py-8">
                                <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pacientes</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {searchTerm
                                        ? 'No se encontraron pacientes con ese criterio de búsqueda.'
                                        : 'Comienza registrando el primer paciente.'}
                                </p>
                                {!searchTerm && (
                                    <div className="mt-6">
                                        <Link
                                            to="/patients/new"
                                            className="btn-primary inline-flex items-center"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Nuevo Paciente
                                        </Link>
                                    </div>
                                )}
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
                                                CI
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha Nacimiento
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contacto
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Registro
                                            </th>
                                            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPacientes.map((paciente) => (
                                            <tr key={paciente.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {paciente.nombre} {paciente.apellido}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : ''}
                                                            {paciente.sexo && paciente.estadoCivil && ' • '}
                                                            {paciente.estadoCivil}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {paciente.ci || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(paciente.fechaNac || '')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{paciente.telefono || '-'}</div>
                                                    <div className="text-sm text-gray-500">{paciente.email || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(paciente.fechaRegistro || '')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            to={`/patients/${paciente.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Ver detalles"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            to={`/patients/${paciente.id}/edit`}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                            title="Editar"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(paciente.id!)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Eliminar"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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

export default PatientsPage;