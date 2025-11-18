import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
    PreguntaSiNoSimple, 
    PreguntaTextoSimple, 
    PreguntaSeleccionMultiple, 
    PreguntaSeleccionUnica,
    PreguntaGrupoSiNo
} from './PreguntaOdontologica';
import type { CuestionarioOdontologico, DolorDental, TipoLesionesDentales } from '@/types';

interface CuestionarioOdontologicoProps {
    onSubmit: (data: CuestionarioOdontologico) => Promise<void>;
    initialData?: CuestionarioOdontologico;
    loading?: boolean;
}

const CuestionarioOdontologicoComponent: React.FC<CuestionarioOdontologicoProps> = ({
    onSubmit,
    initialData,
    loading = false
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<CuestionarioOdontologico>(
        initialData || {}
    );

    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    const updateFormData = (field: keyof CuestionarioOdontologico, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateDolorData = (field: keyof DolorDental, value: any) => {
        setFormData(prev => ({
            ...prev,
            dolor: {
                ...prev.dolor,
                [field]: value
            }
        }));
    };

    const updateLesionesData = (field: keyof TipoLesionesDentales, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            tipo_de_lesiones_presenta: {
                ...prev.tipo_de_lesiones_presenta,
                [field]: value
            }
        }));
    };

    const handleSubmit = async () => {
        // Limpiar datos vacíos
        const cleanData = Object.fromEntries(
            Object.entries(formData).filter(([_, v]) => 
                v !== undefined && v !== null && v !== ''
            )
        ) as CuestionarioOdontologico;

        console.log('Datos del cuestionario odontológico a enviar:', JSON.stringify(cleanData, null, 2));
        await onSubmit(cleanData);
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Motivo de Consulta y Medicamentos</h3>
            
            <PreguntaTextoSimple
                label="¿Por qué asistió a la consulta?"
                value={formData.por_que_asistio_a_la_consulta}
                onChange={(value) => updateFormData('por_que_asistio_a_la_consulta', value)}
                multiline
                placeholder="Describa el motivo de su visita..."
            />

            <PreguntaSiNoSimple
                label="¿Consultó antes con algún otro profesional?"
                value={formData.consulto_antes_con_algun_otro_profesional}
                onChange={(value) => updateFormData('consulto_antes_con_algun_otro_profesional', value)}
            />

            <PreguntaSiNoSimple
                label="¿Tomó algún medicamento?"
                value={formData.tomo_algun_medicamento}
                onChange={(value) => updateFormData('tomo_algun_medicamento', value)}
            />

            {formData.tomo_algun_medicamento && (
                <>
                    <PreguntaTextoSimple
                        label="Nombre de los medicamentos"
                        value={formData.nombre_de_los_medicamentos}
                        onChange={(value) => updateFormData('nombre_de_los_medicamentos', value)}
                        placeholder="Especifique los medicamentos..."
                    />

                    <PreguntaTextoSimple
                        label="¿Desde cuándo?"
                        value={formData.desde_cuando_medicamentos}
                        onChange={(value) => updateFormData('desde_cuando_medicamentos', value)}
                        placeholder="Tiempo tomando los medicamentos..."
                    />

                    <PreguntaSiNoSimple
                        label="¿Obtuvo resultados?"
                        value={formData.obtuvo_resultados_medicamentos}
                        onChange={(value) => updateFormData('obtuvo_resultados_medicamentos', value)}
                    />
                </>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Dolor Dental</h3>
            
            <Card>
                <CardHeader>
                    <CardTitle>Información sobre el dolor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <PreguntaSiNoSimple
                        label="¿Ha tenido dolor?"
                        value={formData.dolor?.ha_tenido_dolor}
                        onChange={(value) => updateDolorData('ha_tenido_dolor', value)}
                    />

                    {formData.dolor?.ha_tenido_dolor && (
                        <>
                            <PreguntaSeleccionMultiple
                                label="¿De qué tipo de intensidad?"
                                value={formData.dolor?.dolor_tipo_intensidad || []}
                                onChange={(value) => updateDolorData('dolor_tipo_intensidad', value)}
                                opciones={['Suave', 'Moderado', 'Intenso']}
                            />

                            <PreguntaSeleccionMultiple
                                label="Frecuencia del dolor"
                                value={formData.dolor?.dolor_frecuencia || []}
                                onChange={(value) => updateDolorData('dolor_frecuencia', value)}
                                opciones={['Temporal', 'Intermitente', 'Continuo', 'Espontáneo']}
                            />

                            <PreguntaSeleccionMultiple
                                label="Dolor provocado"
                                value={formData.dolor?.dolor_provocado || []}
                                onChange={(value) => updateDolorData('dolor_provocado', value)}
                                opciones={['Al frío', 'Al calor', 'Localizado', 'Difuso']}
                            />

                            <PreguntaSiNoSimple
                                label="¿Irradiado?"
                                value={formData.dolor?.dolor_irradiado}
                                onChange={(value) => updateDolorData('dolor_irradiado', value)}
                            />

                            {formData.dolor?.dolor_irradiado && (
                                <PreguntaTextoSimple
                                    label="¿Hacia dónde?"
                                    value={formData.dolor?.dolor_irradiado_hacia_donde}
                                    onChange={(value) => updateDolorData('dolor_irradiado_hacia_donde', value)}
                                    placeholder="Describa hacia dónde se irradia el dolor..."
                                />
                            )}

                            <PreguntaTextoSimple
                                label="¿Puede calmarlo con algo?"
                                value={formData.dolor?.dolor_puede_calmarlo_con_algo}
                                onChange={(value) => updateDolorData('dolor_puede_calmarlo_con_algo', value)}
                                placeholder="¿Qué le ayuda a calmar el dolor?"
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Traumatismos */}
            <div className="space-y-4">
                <h4 className="font-medium">Traumatismos</h4>
                
                <PreguntaSiNoSimple
                    label="¿Sufrió algún golpe en los dientes?"
                    value={formData.sufrio_golpe_en_los_dientes}
                    onChange={(value) => updateFormData('sufrio_golpe_en_los_dientes', value)}
                />

                {formData.sufrio_golpe_en_los_dientes && (
                    <>
                        <PreguntaTextoSimple
                            label="¿Cuándo?"
                            value={formData.golpe_en_dientes_cuando}
                            onChange={(value) => updateFormData('golpe_en_dientes_cuando', value)}
                        />

                        <PreguntaTextoSimple
                            label="¿Cómo se produjo?"
                            value={formData.golpe_en_dientes_como_se_produjo}
                            onChange={(value) => updateFormData('golpe_en_dientes_como_se_produjo', value)}
                            multiline
                        />
                    </>
                )}

                <PreguntaSiNoSimple
                    label="¿Se le fracturó algún diente?"
                    value={formData.se_le_fracturo_algun_diente}
                    onChange={(value) => updateFormData('se_le_fracturo_algun_diente', value)}
                />

                {formData.se_le_fracturo_algun_diente && (
                    <>
                        <PreguntaTextoSimple
                            label="¿Cuál?"
                            value={formData.fractura_diente_cual}
                            onChange={(value) => updateFormData('fractura_diente_cual', value)}
                        />

                        <PreguntaTextoSimple
                            label="¿Recibió algún tratamiento?"
                            value={formData.fractura_diente_recibio_tratamiento}
                            onChange={(value) => updateFormData('fractura_diente_recibio_tratamiento', value)}
                        />
                    </>
                )}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Funciones y Observaciones</h3>
            
            {/* Dificultades funcionales */}
            <div className="space-y-4">
                <h4 className="font-medium">Dificultades funcionales</h4>
                
                <PreguntaSiNoSimple
                    label="¿Tiene dificultad para hablar?"
                    value={formData.tiene_dificultad_para_hablar}
                    onChange={(value) => updateFormData('tiene_dificultad_para_hablar', value)}
                />

                <PreguntaSiNoSimple
                    label="¿Tiene dificultad para masticar?"
                    value={formData.tiene_dificultad_para_masticar}
                    onChange={(value) => updateFormData('tiene_dificultad_para_masticar', value)}
                />

                <PreguntaSiNoSimple
                    label="¿Tiene dificultad para abrir la boca?"
                    value={formData.tiene_dificultad_para_abrir_la_boca}
                    onChange={(value) => updateFormData('tiene_dificultad_para_abrir_la_boca', value)}
                />

                <PreguntaSiNoSimple
                    label="¿Tiene dificultad para tragar los alimentos?"
                    value={formData.tiene_dificultad_para_tragar_alimentos}
                    onChange={(value) => updateFormData('tiene_dificultad_para_tragar_alimentos', value)}
                />
            </div>

            {/* Observaciones anormales */}
            <div className="space-y-4">
                <h4 className="font-medium">¿Ha observado algo anormal en:</h4>
                
                <PreguntaTextoSimple
                    label="Los labios"
                    value={formData.ha_observado_algo_anormal_labios}
                    onChange={(value) => updateFormData('ha_observado_algo_anormal_labios', value)}
                />

                <PreguntaTextoSimple
                    label="La lengua"
                    value={formData.ha_observado_algo_anormal_lengua}
                    onChange={(value) => updateFormData('ha_observado_algo_anormal_lengua', value)}
                />

                <PreguntaTextoSimple
                    label="El paladar"
                    value={formData.ha_observado_algo_anormal_paladar}
                    onChange={(value) => updateFormData('ha_observado_algo_anormal_paladar', value)}
                />

                <PreguntaTextoSimple
                    label="El piso de boca"
                    value={formData.ha_observado_algo_anormal_piso_boca}
                    onChange={(value) => updateFormData('ha_observado_algo_anormal_piso_boca', value)}
                />

                <PreguntaTextoSimple
                    label="Los carrillos"
                    value={formData.ha_observado_algo_anormal_carrillos}
                    onChange={(value) => updateFormData('ha_observado_algo_anormal_carrillos', value)}
                />

                <PreguntaTextoSimple
                    label="Otras zonas (parótidas, trígono retromolar, etc.)"
                    value={formData.ha_observado_algo_anormal_otras_zonas}
                    onChange={(value) => updateFormData('ha_observado_algo_anormal_otras_zonas', value)}
                />
            </div>

            {/* Tipo de lesiones */}
            <Card>
                <CardHeader>
                    <CardTitle>¿Qué tipo de lesiones presenta?</CardTitle>
                </CardHeader>
                <CardContent>
                    <PreguntaGrupoSiNo
                        title=""
                        items={[
                            {
                                key: 'manchas',
                                label: 'Manchas',
                                value: formData.tipo_de_lesiones_presenta?.manchas
                            },
                            {
                                key: 'abultamiento_tejidos',
                                label: 'Abultamiento de los tejidos',
                                value: formData.tipo_de_lesiones_presenta?.abultamiento_tejidos
                            },
                            {
                                key: 'ulceraciones',
                                label: 'Ulceraciones',
                                value: formData.tipo_de_lesiones_presenta?.ulceraciones
                            },
                            {
                                key: 'ampollas',
                                label: 'Ampollas',
                                value: formData.tipo_de_lesiones_presenta?.ampollas
                            },
                            {
                                key: 'otros',
                                label: 'Otros',
                                value: formData.tipo_de_lesiones_presenta?.otros
                            }
                        ]}
                        onChange={(key, value) => updateLesionesData(key as keyof TipoLesionesDentales, value)}
                    />
                </CardContent>
            </Card>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium">Estado General y Hábitos</h3>
            
            {/* Sangrado de encías */}
            <PreguntaSiNoSimple
                label="¿Le sangran las encías?"
                value={formData.le_sangran_las_encias}
                onChange={(value) => updateFormData('le_sangran_las_encias', value)}
            />

            {formData.le_sangran_las_encias && (
                <PreguntaTextoSimple
                    label="¿Cuándo?"
                    value={formData.le_sangran_las_encias_cuando}
                    onChange={(value) => updateFormData('le_sangran_las_encias_cuando', value)}
                />
            )}

            {/* Pus */}
            <PreguntaSiNoSimple
                label="¿Sale pus de algún lugar de su boca?"
                value={formData.sale_pus_de_algun_lugar_de_su_boca}
                onChange={(value) => updateFormData('sale_pus_de_algun_lugar_de_su_boca', value)}
            />

            {formData.sale_pus_de_algun_lugar_de_su_boca && (
                <PreguntaTextoSimple
                    label="¿De dónde?"
                    value={formData.sale_pus_de_donde}
                    onChange={(value) => updateFormData('sale_pus_de_donde', value)}
                />
            )}

            {/* Movilidad dental */}
            <PreguntaSiNoSimple
                label="¿Tiene movilidad en sus dientes?"
                value={formData.tiene_movilidad_en_sus_dientes}
                onChange={(value) => updateFormData('tiene_movilidad_en_sus_dientes', value)}
            />

            <PreguntaSiNoSimple
                label="¿Al morder siente altos los dientes?"
                value={formData.al_morder_siente_altos_los_dientes}
                onChange={(value) => updateFormData('al_morder_siente_altos_los_dientes', value)}
            />

            {/* Inflamación */}
            <PreguntaSiNoSimple
                label="¿Ha tenido la cara hinchada?"
                value={formData.ha_tenido_la_cara_hinchada}
                onChange={(value) => updateFormData('ha_tenido_la_cara_hinchada', value)}
            />

            {formData.ha_tenido_la_cara_hinchada && (
                <PreguntaTextoSimple
                    label="¿Qué hizo? (hielo, calor, otros)"
                    value={formData.tratamiento_cara_hinchada}
                    onChange={(value) => updateFormData('tratamiento_cara_hinchada', value)}
                />
            )}

            {/* Hábitos */}
            <PreguntaTextoSimple
                label="Momentos de azúcar diario"
                value={formData.momentos_de_azucar_diario}
                onChange={(value) => updateFormData('momentos_de_azucar_diario', value)}
                placeholder="Ej: 2-3 veces al día"
            />

            <PreguntaTextoSimple
                label="Índice de placa"
                value={formData.indice_de_placa}
                onChange={(value) => updateFormData('indice_de_placa', value)}
                placeholder="Ej: Moderado, Alto, Bajo"
            />

            <PreguntaSeleccionUnica
                label="Estado de la higiene bucal"
                value={formData.estado_de_la_higiene_bucal}
                onChange={(value) => updateFormData('estado_de_la_higiene_bucal', value as any)}
                opciones={['Muy bueno', 'Bueno', 'Deficiente', 'Malo']}
            />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Cuestionario Odontológico
                    </CardTitle>
                    <div className="space-y-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground text-center">
                            Paso {currentStep} de {totalSteps}
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Renderizar paso actual */}
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}

                    {/* Botones de navegación */}
                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                        >
                            Anterior
                        </Button>

                        <div className="flex space-x-2">
                            {currentStep < totalSteps ? (
                                <Button type="button" onClick={nextStep}>
                                    Siguiente
                                </Button>
                            ) : (
                                <Button 
                                    type="button" 
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Finalizar'}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CuestionarioOdontologicoComponent;