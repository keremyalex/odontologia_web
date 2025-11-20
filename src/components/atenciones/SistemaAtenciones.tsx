import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    FileText, 
    BarChart3, 
    UserCheck,
    Clock,
    Eye,
    Activity
} from 'lucide-react';

// Importar los componentes de atenciones
import DashboardAtenciones from './DashboardAtenciones';
import CitasPendientesAtencion from './CitasPendientesAtencion';
import ListaAtenciones from './ListaAtenciones';

type TabValue = 'dashboard' | 'pendientes' | 'historial';

const SistemaAtenciones: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabValue>('dashboard');

    const tabs = [
        {
            value: 'dashboard' as const,
            label: 'Dashboard',
            icon: BarChart3,
            description: 'Resumen y estadísticas generales'
        },
        {
            value: 'pendientes' as const,
            label: 'Citas Pendientes',
            icon: Clock,
            description: 'Pacientes en espera de atención'
        },
        {
            value: 'historial' as const,
            label: 'Historial de Atenciones',
            icon: FileText,
            description: 'Todas las atenciones registradas'
        }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardAtenciones />;
            case 'pendientes':
                return <CitasPendientesAtencion />;
            case 'historial':
                return <ListaAtenciones />;
            default:
                return <DashboardAtenciones />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Principal */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            Sistema de Atención a Pacientes
                        </h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            Gestión integral de consultas médicas y atención clínica
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="px-3 py-1">
                            <Activity className="w-4 h-4 mr-1" />
                            Sistema Activo
                        </Badge>
                    </div>
                </div>

                {/* Navegación por Pestañas */}
                <Card className="mb-6">
                    <CardContent className="p-0">
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
                            <TabsList className="grid w-full grid-cols-3 h-auto p-2 bg-muted rounded-lg">
                                {tabs.map((tab) => {
                                    const IconComponent = tab.icon;
                                    return (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className="flex flex-col items-center gap-2 py-4 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <div className="text-center">
                                                <div className="font-medium">{tab.label}</div>
                                                <div className="text-xs text-muted-foreground hidden sm:block">
                                                    {tab.description}
                                                </div>
                                            </div>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Accesos Rápidos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer" 
                          onClick={() => setActiveTab('pendientes')}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <UserCheck className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Atender Pacientes</p>
                                    <p className="text-sm text-muted-foreground">
                                        Registrar nuevas atenciones médicas
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setActiveTab('historial')}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Ver Historial</p>
                                    <p className="text-sm text-muted-foreground">
                                        Consultar atenciones anteriores
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setActiveTab('dashboard')}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Ver Estadísticas</p>
                                    <p className="text-sm text-muted-foreground">
                                        Dashboard y métricas
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contenido Principal */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default SistemaAtenciones;