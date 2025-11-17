import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import CuestionarioMedico from '@/components/cuestionario/CuestionarioMedico';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import apiService from '@/services/api';
import type { Paciente, HistoriaClinica, CuestionarioCompleto, CuestionarioWrapper } from '@/types';

const CuestionarioPage: React.FC = () => {
    const { pacienteId } = useParams<{ pacienteId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [historiaExistente, setHistoriaExistente] = useState<HistoriaClinica | null>(null);

    useEffect(() => {
        if (pacienteId) {
            loadPacienteData(parseInt(pacienteId));
        }
    }, [pacienteId]);

    const loadPacienteData = async (id: number) => {
        try {
            setLoading(true);

            // Cargar datos del paciente
            const pacienteData = await apiService.getPaciente(id);
            setPaciente(pacienteData);

            // Verificar si ya existe una historia clínica
            try {
                const historias = await apiService.getHistoriasPorPaciente(id);
                if (historias.length > 0) {
                    const historia = historias[0];
                    
                    // Transformar datos del backend al formato del frontend
                    if (historia.cuestionario) {
                        const cuestionarioTransformado = transformarDesdeBackend(historia.cuestionario);
                        historia.cuestionario = cuestionarioTransformado;
                    }
                    
                    setHistoriaExistente(historia);
                }
            } catch (err) {
                // No existe historia clínica, esto es normal
                console.log('No hay historia clínica previa');
            }

        } catch (err: any) {
            console.error('Error loading patient data:', err);
            setError('Error al cargar los datos del paciente');
        } finally {
            setLoading(false);
        }
    };

    // Función para transformar datos del backend al formato del frontend
    const transformarDesdeBackend = (cuestionarioBackend: any): CuestionarioCompleto => {
        if (!cuestionarioBackend) return {};

        // Verificar si cuestionarioBackend es un string (JSON) y parsearlo
        let cuestionarioData: any;
        
        if (typeof cuestionarioBackend === 'string') {
            try {
                const parsed = JSON.parse(cuestionarioBackend);
                // Si tiene la estructura con "data", extraerla
                cuestionarioData = parsed.data || parsed;
            } catch (error) {
                console.error('Error parsing cuestionario JSON:', error);
                return {};
            }
        } else {
            // Si cuestionarioBackend tiene la estructura con "data", extraerla
            cuestionarioData = cuestionarioBackend.data || cuestionarioBackend;
        }

        console.log('Datos del cuestionario parseados:', JSON.stringify(cuestionarioData, null, 2));

        const transformarSeccion = (seccion: any) => {
            if (!seccion || typeof seccion !== 'object') return {};
            
            const transformed: any = {};
            
            for (const [key, value] of Object.entries(seccion)) {
                if (value !== null && value !== undefined) {
                    // Si es un boolean directo, convertir a RespuestaSiNo
                    if (typeof value === 'boolean') {
                        transformed[key] = { respuesta: value };
                    }
                    // Si es un string directo, convertir a RespuestaTexto
                    else if (typeof value === 'string') {
                        transformed[key] = { respuesta: value };
                    }
                    // Si es un objeto (RespuestaMixto), mantener tal como está
                    else if (typeof value === 'object' && 'respuesta' in value) {
                        transformed[key] = value;
                    }
                }
            }
            
            return transformed;
        };

        const cuestionarioTransformado: CuestionarioCompleto = {};
        
        if (cuestionarioData.antecedentesFamiliares) {
            cuestionarioTransformado.antecedentesFamiliares = transformarSeccion(cuestionarioData.antecedentesFamiliares);
        }
        
        if (cuestionarioData.habitosYAntecedentesMedicos) {
            cuestionarioTransformado.habitosYAntecedentesMedicos = transformarSeccion(cuestionarioData.habitosYAntecedentesMedicos);
        }

        console.log('Datos transformados desde backend:', JSON.stringify(cuestionarioTransformado, null, 2));
        
        return cuestionarioTransformado;
    };

    const handleSubmit = async (cuestionarioData: CuestionarioCompleto) => {
        if (!paciente || !user) return;

        setSaving(true);
        setError('');

        try {
            // Función para transformar respuestas al formato del backend
            const transformarRespuestas = (obj: any): any => {
                if (!obj || typeof obj !== 'object') return {};
                
                const transformed: any = {};
                
                for (const [key, value] of Object.entries(obj)) {
                    if (value && typeof value === 'object') {
                        // Si es una respuesta con estructura { respuesta: valor, detalle?: string }
                        if ('respuesta' in value) {
                            const resp = value as any;
                            
                            // Si hay detalle, es RespuestaMixto - mantener estructura
                            if (resp.detalle && typeof resp.detalle === 'string' && resp.detalle.trim()) {
                                transformed[key] = {
                                    respuesta: resp.respuesta,
                                    detalle: resp.detalle.trim()
                                };
                            } else {
                                // Para campos que el backend espera como RespuestaMixto pero sin detalle
                                const mixtoFields = [
                                    'hermanos', 'sufreEnfermedad', 'haceTratamientoMedico',
                                    'diabetesControlada', 'problemaCardiaco', 'problemaHepatico',
                                    'fueOperado', 'problemaRespiratorio', 'estaEmbarazada', 'tratamientoHomeopatico'
                                ];
                                
                                if (mixtoFields.includes(key)) {
                                    // Mantener como objeto para campos mixtos
                                    transformed[key] = { respuesta: resp.respuesta };
                                } else {
                                    // Para boolean simples, enviar valor directo
                                    if (typeof resp.respuesta === 'boolean') {
                                        transformed[key] = resp.respuesta;
                                    } else if (typeof resp.respuesta === 'string' && resp.respuesta.trim()) {
                                        transformed[key] = resp.respuesta.trim();
                                    } else {
                                        transformed[key] = null;
                                    }
                                }
                            }
                        }
                    } else {
                        // Si no es un objeto con respuesta, mantener valor directo
                        transformed[key] = value;
                    }
                }
                
                return transformed;
            };

            // Transformar los datos del cuestionario
            const cuestionarioTransformado: any = {};
            
            if (cuestionarioData.antecedentesFamiliares) {
                cuestionarioTransformado.antecedentesFamiliares = transformarRespuestas(cuestionarioData.antecedentesFamiliares);
            }
            
            if (cuestionarioData.habitosYAntecedentesMedicos) {
                cuestionarioTransformado.habitosYAntecedentesMedicos = transformarRespuestas(cuestionarioData.habitosYAntecedentesMedicos);
            }

            // Crear payload con el formato que espera el backend
            const payload: Partial<HistoriaClinica> = {
                pacienteId: paciente.id!,
                cuestionario: {
                    data: cuestionarioTransformado,
                    tipo: "directo",
                    version: "2.1",
                    fechaCreacion: new Date().toISOString()
                } as CuestionarioWrapper
            };

            console.log('Payload final a enviar:', JSON.stringify(payload, null, 2));

            if (historiaExistente) {
                await apiService.updateHistoriaClinica(historiaExistente.id!, payload);
            } else {
                await apiService.createHistoriaClinica(payload as HistoriaClinica);
            }

            navigate(`/patients/${paciente.id}`);
        } catch (err: any) {
            console.error('Error saving historia clínica:', err);
            console.error('Response data:', err.response?.data);
            setError(`Error al guardar el cuestionario: ${err.response?.data?.message || err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
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

    if (!paciente) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900">Paciente no encontrado</h2>
                    <p className="text-gray-600 mt-2">
                        No se pudo encontrar el paciente especificado.
                    </p>
                    <Button
                        onClick={() => navigate('/patients')}
                        className="mt-4"
                        variant="outline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Pacientes
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/patients/${paciente.id}`)}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Historia Clínica
                            </h1>
                            <p className="text-gray-600">
                                {paciente.nombre} {paciente.apellido} - CI: {paciente.ci}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <FileText className="mr-2 h-4 w-4" />
                        {historiaExistente ? 'Actualizar Historia' : 'Nueva Historia'}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {historiaExistente && (
                    <Alert>
                        <AlertDescription>
                            Este paciente ya tiene una historia clínica. Los datos serán actualizados.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Patient Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Información del Paciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Nombre:</span> {paciente.nombre} {paciente.apellido}
                            </div>
                            <div>
                                <span className="font-medium">CI:</span> {paciente.ci || 'No especificado'}
                            </div>
                            <div>
                                <span className="font-medium">Fecha de Nacimiento:</span> {
                                    paciente.fechaNac ? new Date(paciente.fechaNac).toLocaleDateString() : 'No especificada'
                                }
                            </div>
                            <div>
                                <span className="font-medium">Teléfono:</span> {paciente.telefono || 'No especificado'}
                            </div>
                            <div>
                                <span className="font-medium">Email:</span> {paciente.email || 'No especificado'}
                            </div>
                            <div>
                                <span className="font-medium">Sexo:</span> {
                                    paciente.sexo === 'M' ? 'Masculino' : paciente.sexo === 'F' ? 'Femenino' : 'No especificado'
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cuestionario */}
                <CuestionarioMedico
                    onSubmit={handleSubmit}
                    initialData={
                        historiaExistente?.cuestionario && typeof historiaExistente.cuestionario === 'object' && 'antecedentesFamiliares' in historiaExistente.cuestionario
                            ? historiaExistente.cuestionario as CuestionarioCompleto
                            : undefined
                    }
                    loading={saving}
                />
            </div>
        </DashboardLayout>
    );
};

export default CuestionarioPage;