import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import CuestionarioMedico from '@/components/cuestionario/CuestionarioMedico';
import CuestionarioOdontologicoComponent from '@/components/cuestionario/CuestionarioOdontologico';
import OdontogramViewer from '@/components/odontograma/OdontogramViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Stethoscope, Activity, Smile } from 'lucide-react';
import apiService from '@/services/api';
import axios from 'axios';
import type { 
    Paciente, 
    HistoriaClinica, 
    CuestionarioCompleto, 
    CuestionarioOdontologico 
} from '@/types';

const CuestionarioCompletePage: React.FC = () => {
    const { pacienteId } = useParams<{ pacienteId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>('');
    const [historiaExistente, setHistoriaExistente] = useState<HistoriaClinica | null>(null);
    const [odontograma, setOdontograma] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('medico');

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
                    
                    console.log('Historia cargada del backend:', historia);
                    
                    // Verificar ambos nombres de campo (camelCase y snake_case)
                    const cuestionarioOdont = historia.cuestionarioOdontologico || (historia as any).cuestionario_odontologico;
                    console.log('Cuestionario odontológico raw:', cuestionarioOdont);
                    
                    if (cuestionarioOdont) {
                        const odontologicoTransformado = transformarOdontologicoDesdeBackend(cuestionarioOdont);
                        console.log('Cuestionario odontológico transformado:', odontologicoTransformado);
                        historia.cuestionarioOdontologico = odontologicoTransformado;
                    }
                    
                    // Cargar odontograma si existe
                    if (historia.odontograma) {
                        setOdontograma(historia.odontograma);
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

    // Función para transformar datos del cuestionario odontológico desde el backend
    const transformarOdontologicoDesdeBackend = (cuestionarioBackend: any): CuestionarioOdontologico => {
        if (!cuestionarioBackend) return {};

        // Si es un string, parsearlo
        if (typeof cuestionarioBackend === 'string') {
            try {
                const parsed = JSON.parse(cuestionarioBackend);
                console.log('Cuestionario odontológico parseado:', parsed);
                
                // Si tiene la estructura envolvente con data, extraer solo la data
                if (parsed.data) {
                    console.log('Extrayendo data del cuestionario odontológico:', parsed.data);
                    return parsed.data;
                }
                
                return parsed;
            } catch (error) {
                console.error('Error parsing cuestionario odontológico JSON:', error);
                return {};
            }
        }

        // Si es un objeto que ya tiene la estructura envolvente, extraer data
        if (cuestionarioBackend.data) {
            return cuestionarioBackend.data;
        }

        return cuestionarioBackend;
    };

    // Función para transformar datos del backend al formato del frontend (médico)
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
            // Si no tiene "data", entonces es directamente el objeto (nuevo formato)
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

    const handleSubmitMedico = async (cuestionarioData: CuestionarioCompleto) => {
        if (!paciente || !user) return;

        setSaving(true);
        setError('');

        try {
            // [Mantener toda la lógica de transformación existente para el cuestionario médico]
            const transformarRespuestas = (obj: any): any => {
                if (!obj || typeof obj !== 'object') return {};
                
                const transformed: any = {};
                
                for (const [key, value] of Object.entries(obj)) {
                    if (value && typeof value === 'object') {
                        if ('respuesta' in value) {
                            const resp = value as any;
                            
                            if (resp.detalle && typeof resp.detalle === 'string' && resp.detalle.trim()) {
                                transformed[key] = {
                                    respuesta: resp.respuesta,
                                    detalle: resp.detalle.trim()
                                };
                            } else {
                                const mixtoFields = [
                                    'hermanos', 'sufreEnfermedad', 'haceTratamientoMedico',
                                    'diabetesControlada', 'problemaCardiaco', 'problemaHepatico',
                                    'fueOperado', 'problemaRespiratorio', 'estaEmbarazada', 'tratamientoHomeopatico'
                                ];
                                
                                if (mixtoFields.includes(key)) {
                                    transformed[key] = { respuesta: resp.respuesta };
                                } else {
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
                        transformed[key] = value;
                    }
                }
                
                return transformed;
            };

            const cuestionarioTransformado: any = {};
            
            if (cuestionarioData.antecedentesFamiliares) {
                cuestionarioTransformado.antecedentesFamiliares = transformarRespuestas(cuestionarioData.antecedentesFamiliares);
            }
            
            if (cuestionarioData.habitosYAntecedentesMedicos) {
                cuestionarioTransformado.habitosYAntecedentesMedicos = transformarRespuestas(cuestionarioData.habitosYAntecedentesMedicos);
            }

            // El backend quiere objeto/array, NO string JSON
            // Y NO quiere wrapper con data/tipo/version
            const payload: any = {
                pacienteId: paciente.id!,
                cuestionario: cuestionarioTransformado // Directamente el objeto
            };

            // Agregar cuestionarioOdontologico solo si existe
            if (historiaExistente?.cuestionarioOdontologico) {
                payload.cuestionarioOdontologico = historiaExistente.cuestionarioOdontologico;
            }

            console.log('Payload médico completo:', JSON.stringify(payload, null, 2));

            if (historiaExistente) {
                console.log('Actualizando historia existente ID:', historiaExistente.id);
                await apiService.updateHistoriaClinica(historiaExistente.id!, payload);
            } else {
                console.log('Creando nueva historia clínica');
                const nuevaHistoria = await apiService.createHistoriaClinica(payload as HistoriaClinica);
                console.log('Historia creada:', nuevaHistoria);
                setHistoriaExistente(nuevaHistoria);
            }

            setActiveTab('odontologico'); // Cambiar a la pestaña odontológica
            
        } catch (err: any) {
            console.error('Error saving historia clínica:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            console.error('Error response status:', err.response?.status);
            console.error('Mensajes específicos del backend:', err.response?.data?.message);
            
            let errorMessage = 'Error desconocido al guardar el cuestionario médico';
            
            if (err.response?.data?.message) {
                // Si es un array de mensajes, convertirlo a string
                if (Array.isArray(err.response.data.message)) {
                    errorMessage = err.response.data.message.join(', ');
                } else {
                    errorMessage = err.response.data.message;
                }
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(`Error al guardar el cuestionario médico: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmitOdontologico = async (cuestionarioOdontologico: CuestionarioOdontologico) => {
        if (!paciente || !user) return;

        setSaving(true);
        setError('');

        try {
            // El backend espera cuestionarioOdontologico (camelCase) como objeto directo
            const payload = {
                pacienteId: paciente.id!,
                cuestionario: historiaExistente?.cuestionario || {},
                cuestionarioOdontologico: cuestionarioOdontologico // Objeto directo
            };

            console.log('Payload con cuestionarioOdontologico como objeto:', JSON.stringify(payload, null, 2));

            if (historiaExistente) {
                console.log('Actualizando historia con cuestionario odontológico ID:', historiaExistente.id);
                const token = localStorage.getItem('token');
                const response = await axios.patch(
                    `http://localhost:3000/api/historias/${historiaExistente.id}`, 
                    {
                        cuestionarioOdontologico: cuestionarioOdontologico
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                console.log('Respuesta del backend:', response.data);
                setHistoriaExistente(response.data);
            } else {
                console.log('Creando nueva historia con cuestionario odontológico');
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    'http://localhost:3000/api/historias', 
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setHistoriaExistente(response.data);
                console.log('Nueva historia creada:', response.data);
            }

            // Redirigir al perfil del paciente
            navigate(`/patients/${paciente.id}`);
            
        } catch (err: any) {
            console.error('Error saving cuestionario odontológico:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            console.error('Error response status:', err.response?.status);
            console.error('Mensajes específicos del backend:', err.response?.data?.message);
            
            let errorMessage = 'Error desconocido al guardar el cuestionario odontológico';
            
            if (err.response?.data?.message) {
                // Si es un array de mensajes, convertirlo a string
                if (Array.isArray(err.response.data.message)) {
                    errorMessage = err.response.data.message.join(', ');
                } else {
                    errorMessage = err.response.data.message;
                }
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(`Error al guardar el cuestionario odontológico: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveOdontograma = async (odontogramData: any) => {
        if (!paciente || !user) return;

        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            
            if (historiaExistente) {
                // Actualizar historia existente con odontograma
                const response = await axios.patch(
                    `http://localhost:3000/api/historias/${historiaExistente.id}`,
                    {
                        odontograma: odontogramData
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setHistoriaExistente(response.data);
                setOdontograma(response.data.odontograma);
            } else {
                // Crear nueva historia con odontograma
                const payload = {
                    pacienteId: paciente.id!,
                    cuestionario: {},
                    cuestionarioOdontologico: {},
                    odontograma: odontogramData
                };

                const response = await axios.post(
                    'http://localhost:3000/api/historias',
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setHistoriaExistente(response.data);
                setOdontograma(response.data.odontograma);
            }

            console.log('Odontograma guardado exitosamente');
            
        } catch (err: any) {
            console.error('Error guardando odontograma:', err);
            
            let errorMessage = 'Error desconocido al guardar el odontograma';
            
            if (err.response?.data?.message) {
                if (Array.isArray(err.response.data.message)) {
                    errorMessage = err.response.data.message.join(', ');
                } else {
                    errorMessage = err.response.data.message;
                }
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(`Error al guardar el odontograma: ${errorMessage}`);
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
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/patients/${paciente.id}`)}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Historia Clínica
                            </h1>
                            <p className="text-gray-600">
                                {paciente.nombre} {paciente.apellido}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <FileText className="mr-2 h-4 w-4" />
                        {historiaExistente ? 'Editando historia existente' : 'Nueva historia clínica'}
                    </div>
                </div>

                {error && (
                    <Alert>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Tabs para los cuestionarios */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="medico" className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Cuestionario Médico
                        </TabsTrigger>
                        <TabsTrigger value="odontologico" className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Cuestionario Dental
                        </TabsTrigger>
                        <TabsTrigger value="odontograma" className="flex items-center gap-2">
                            <Smile className="h-4 w-4" />
                            Odontograma
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="medico" className="mt-6">
                        <CuestionarioMedico
                            onSubmit={handleSubmitMedico}
                            initialData={
                                historiaExistente?.cuestionario && 
                                typeof historiaExistente.cuestionario === 'object' && 
                                'antecedentesFamiliares' in historiaExistente.cuestionario
                                    ? historiaExistente.cuestionario as CuestionarioCompleto
                                    : undefined
                            }
                            loading={saving}
                        />
                    </TabsContent>

                    <TabsContent value="odontologico" className="mt-6">
                        <CuestionarioOdontologicoComponent
                            onSubmit={handleSubmitOdontologico}
                            initialData={
                                historiaExistente?.cuestionarioOdontologico && 
                                typeof historiaExistente.cuestionarioOdontologico === 'object'
                                    ? historiaExistente.cuestionarioOdontologico as CuestionarioOdontologico
                                    : undefined
                            }
                            loading={saving}
                        />
                    </TabsContent>

                    <TabsContent value="odontograma" className="mt-6">
                        <OdontogramViewer
                            historiaId={historiaExistente?.id?.toString() || 'nuevo'}
                            readOnly={false}
                            odontograma={odontograma}
                            onSave={handleSaveOdontograma}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default CuestionarioCompletePage;