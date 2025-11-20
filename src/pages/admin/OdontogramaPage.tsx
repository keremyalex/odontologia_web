import React from 'react';
import OdontogramViewer from '@/components/odontograma/OdontogramViewer';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const OdontogramaPage: React.FC = () => {
    const navigate = useNavigate();
    const { historiaId } = useParams<{ historiaId: string }>();

    const handleGoBack = () => {
        navigate(`/admin/historias/${historiaId}`);
    };

    // Convertir historiaId a número
    const historiaIdNumber = parseInt(historiaId || '0', 10);

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleGoBack}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a Historia Clínica
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Odontograma</h1>
                            <p className="text-muted-foreground">
                                Historia Clínica #{historiaId}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Información del Odontograma */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Sistema de Odontograma Dental
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="font-medium text-blue-900">Sistema FDI</div>
                                <div className="text-blue-700">Notación internacional estándar</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <div className="font-medium text-green-900">32 Dientes Permanentes</div>
                                <div className="text-green-700">Análisis por superficies</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                                <div className="font-medium text-purple-900">10 Estados Diagnósticos</div>
                                <div className="text-purple-700">Seguimiento detallado</div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-medium mb-2">Instrucciones de Uso:</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Haz clic en cualquier diente para seleccionarlo y ver su panel de edición</li>
                                <li>• Usa las herramientas del panel lateral para cambiar estados por superficie</li>
                                <li>• Los cambios se guardan automáticamente al hacer clic en "Guardar"</li>
                                <li>• Cada superficie puede tener un estado diferente para máxima precisión</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Componente del Odontograma */}
                {historiaIdNumber > 0 ? (
                    <OdontogramViewer 
                        historiaId={historiaIdNumber}
                        readOnly={false}
                    />
                ) : (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="text-red-500 mb-2">Error</div>
                                <p>ID de historia clínica inválido</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Información adicional */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leyenda de Estados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-400 rounded"></div>
                                <span className="text-sm">Sano</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-400 rounded"></div>
                                <span className="text-sm">Caries</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                                <span className="text-sm">Obturado</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                                <span className="text-sm">Corona</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-400 rounded"></div>
                                <span className="text-sm">Endodoncia</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                                <span className="text-sm">Implante</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-800 rounded"></div>
                                <span className="text-sm">Extraído</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                                <span className="text-sm">Fractura</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-indigo-400 rounded"></div>
                                <span className="text-sm">Puente</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-600 rounded"></div>
                                <span className="text-sm">Ext. Indicada</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default OdontogramaPage;