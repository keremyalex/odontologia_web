import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import apiService from '@/services/api';
import type { CreateAtencionDto, EstadoBucalGeneral, CitaPendienteAtencion } from '@/types/atenciones';

interface FormularioAtencionProps {
    cita: CitaPendienteAtencion;
    onAtencionCreada?: (atencion: any) => void;
    onCancel?: () => void;
}

const FormularioAtencion: React.FC<FormularioAtencionProps> = ({
    cita,
    onAtencionCreada,
    onCancel
}) => {
    const [formData, setFormData] = useState<CreateAtencionDto>({
        citaId: cita.id,
        diagnosticoPresuntivo: '',
        planTratamiento: '',
        observaciones: '',
        estadoBucalGeneral: {
            presenciaSarro: false,
            enfermedadPeriodontal: false,
            presenciaCaries: false,
            higieneBucal: 'bueno',
            otros: ''
        },
        signosVitales: {
            presionArterial: '120/80',
            temperatura: 36.5,
            frecuenciaCardiaca: 70,
            observaciones: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.diagnosticoPresuntivo.trim()) {
            newErrors.diagnosticoPresuntivo = 'El diagnóstico presuntivo es requerido';
        }

        if (!formData.planTratamiento.trim()) {
            newErrors.planTratamiento = 'El plan de tratamiento es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEstadoBucalChange = (field: keyof EstadoBucalGeneral, value: any) => {
        setFormData(prev => ({
            ...prev,
            estadoBucalGeneral: {
                ...prev.estadoBucalGeneral,
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Por favor corrige los errores en el formulario');
            return;
        }

        setLoading(true);

        try {
            console.log('📝 Datos del formulario antes de enviar:', JSON.stringify(formData, null, 2));
            
            const response = await apiService.createAtencion(formData);
            
            console.log('✅ Respuesta del servidor:', response);
            
            if (response && (response.success !== false)) {
                toast.success('Atención registrada exitosamente');
                onAtencionCreada?.(response);
            } else {
                toast.error('Error al registrar la atención');
            }
        } catch (error: any) {
            console.error('❌ Error al crear atención:', error);
            console.error('Error details:', error.response?.data);
            
            // Mostrar mensaje de error más específico
            const errorMessage = error.response?.data?.message || error.message || 'Error al registrar la atención';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Registro de Atención Clínica
                </CardTitle>
                <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Paciente:</strong> {cita.paciente.nombres} {cita.paciente.apellidos}</p>
                    <p><strong>CI:</strong> {cita.paciente.ci}</p>
                    <p><strong>Fecha:</strong> {new Date(cita.fecha).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {cita.horaInicio} - {cita.horaFin}</p>
                    <p><strong>Especialidad:</strong> {cita.franja.especialidad.nombre}</p>
                    <p><strong>Responsable:</strong> {cita.franja.responsable.nombres} {cita.franja.responsable.apellidos}</p>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Diagnóstico Presuntivo */}
                    <div className="space-y-2">
                        <Label htmlFor="diagnostico">
                            Diagnóstico Presuntivo <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="diagnostico"
                            value={formData.diagnosticoPresuntivo}
                            onChange={(e) => setFormData(prev => ({ ...prev, diagnosticoPresuntivo: e.target.value }))}
                            placeholder="Ingrese el diagnóstico presuntivo..."
                            rows={3}
                            className={errors.diagnosticoPresuntivo ? 'border-red-500' : ''}
                        />
                        {errors.diagnosticoPresuntivo && (
                            <p className="text-red-500 text-sm">{errors.diagnosticoPresuntivo}</p>
                        )}
                    </div>

                    {/* Plan de Tratamiento */}
                    <div className="space-y-2">
                        <Label htmlFor="planTratamiento">
                            Plan de Tratamiento <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="planTratamiento"
                            value={formData.planTratamiento}
                            onChange={(e) => setFormData(prev => ({ ...prev, planTratamiento: e.target.value }))}
                            placeholder="Describe el plan de tratamiento..."
                            rows={4}
                            className={errors.planTratamiento ? 'border-red-500' : ''}
                        />
                        {errors.planTratamiento && (
                            <p className="text-red-500 text-sm">{errors.planTratamiento}</p>
                        )}
                    </div>

                    {/* Estado Bucal General */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Estado Bucal General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Presencia de Sarro */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="presenciaSarro"
                                    checked={formData.estadoBucalGeneral.presenciaSarro}
                                    onCheckedChange={(checked) => 
                                        handleEstadoBucalChange('presenciaSarro', checked)
                                    }
                                />
                                <Label htmlFor="presenciaSarro">Presencia de Sarro</Label>
                            </div>

                            {/* Enfermedad Periodontal */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="enfermedadPeriodontal"
                                    checked={formData.estadoBucalGeneral.enfermedadPeriodontal}
                                    onCheckedChange={(checked) => 
                                        handleEstadoBucalChange('enfermedadPeriodontal', checked)
                                    }
                                />
                                <Label htmlFor="enfermedadPeriodontal">Enfermedad Periodontal</Label>
                            </div>

                            {/* Higiene Bucal */}
                            <div className="space-y-2">
                                <Label htmlFor="higieneBucal">Higiene Bucal</Label>
                                <Select
                                    value={formData.estadoBucalGeneral.higieneBucal}
                                    onValueChange={(value) => 
                                        handleEstadoBucalChange('higieneBucal', value as any)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el estado de higiene bucal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="muy_bueno">Muy Bueno</SelectItem>
                                        <SelectItem value="bueno">Bueno</SelectItem>
                                        <SelectItem value="deficiente">Deficiente</SelectItem>
                                        <SelectItem value="malo">Malo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Otros */}
                            <div className="space-y-2">
                                <Label htmlFor="otros">Otros hallazgos</Label>
                                <Textarea
                                    id="otros"
                                    value={formData.estadoBucalGeneral.otros || ''}
                                    onChange={(e) => handleEstadoBucalChange('otros', e.target.value)}
                                    placeholder="Otros hallazgos relevantes del estado bucal..."
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Observaciones */}
                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                        <Textarea
                            id="observaciones"
                            value={formData.observaciones || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                            placeholder="Observaciones adicionales sobre la atención..."
                            rows={3}
                        />
                    </div>

                    {/* Información importante */}
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Importante:</strong> Una vez registrada la atención, la cita cambiará automáticamente al estado "ATENDIDA" y no se podrá modificar sin autorización del docente.
                        </AlertDescription>
                    </Alert>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Registrar Atención
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default FormularioAtencion;