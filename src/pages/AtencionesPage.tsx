import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SistemaAtenciones from '@/components/atenciones/SistemaAtenciones';

const AtencionesPage: React.FC = () => {
    return (
        <DashboardLayout>
            <SistemaAtenciones />
        </DashboardLayout>
    );
};

export default AtencionesPage;