import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import HistorialAtenciones from '@/components/atenciones/HistorialAtenciones';

const HistorialAtencionesPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Paciente no encontrado
                    </h2>
                    <p className="text-gray-600 mt-2">
                        No se pudo identificar al paciente.
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <HistorialAtenciones pacienteId={parseInt(id)} />
        </DashboardLayout>
    );
};

export default HistorialAtencionesPage;