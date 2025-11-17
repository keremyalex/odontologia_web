import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PreguntaSiNo, PreguntaTexto, PreguntaMixto } from './PreguntaComponents';
import type {
    AntecedentesFamiliares,
    HabitosYAntecedentesMedicos,
    CuestionarioCompleto
} from '@/types';

interface CuestionarioMedicoProps {
    onSubmit: (data: CuestionarioCompleto) => Promise<void>;
    initialData?: CuestionarioCompleto;
    loading?: boolean;
}

const CuestionarioMedico: React.FC<CuestionarioMedicoProps> = ({
    onSubmit,
    initialData,
    loading = false
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [antecedentesFamiliares, setAntecedentesFamiliares] = useState<AntecedentesFamiliares>(
        initialData?.antecedentesFamiliares || {}
    );
    const [habitosYAntecedentes, setHabitosYAntecedentes] = useState<HabitosYAntecedentesMedicos>(
        initialData?.habitosYAntecedentesMedicos || {}
    );

    const totalSteps = 2;
    const progress = (currentStep / totalSteps) * 100;

    const handleSubmit = async () => {
        // Limpiar objetos vacíos antes de enviar
        const cleanAntecedentesFamiliares = Object.keys(antecedentesFamiliares).length > 0 ? antecedentesFamiliares : undefined;
        const cleanHabitosYAntecedentes = Object.keys(habitosYAntecedentes).length > 0 ? habitosYAntecedentes : undefined;
        
        const data: CuestionarioCompleto = {
            antecedentesFamiliares: cleanAntecedentesFamiliares,
            habitosYAntecedentesMedicos: cleanHabitosYAntecedentes
        };

        // Eliminar campos undefined para enviar solo lo que tiene datos
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        ) as CuestionarioCompleto;

        console.log('Datos del cuestionario a enviar:', JSON.stringify(cleanData, null, 2));
        
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

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return 'Antecedentes Familiares';
            case 2:
                return 'Hábitos y Antecedentes Médicos';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Paso {currentStep} de {totalSteps}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Paso 1: Antecedentes Familiares */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <Alert>
                                <AlertDescription>
                                    Complete la información sobre los antecedentes familiares del paciente.
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PreguntaSiNo
                                    label="¿Padre con vida?"
                                    value={antecedentesFamiliares.padreConVida}
                                    onChange={(value) => setAntecedentesFamiliares({
                                        ...antecedentesFamiliares,
                                        padreConVida: value
                                    })}
                                />

                                <PreguntaTexto
                                    label="Enfermedad que padece o padeció (padre)"
                                    value={antecedentesFamiliares.enfermedadPadre}
                                    onChange={(value) => setAntecedentesFamiliares({
                                        ...antecedentesFamiliares,
                                        enfermedadPadre: value
                                    })}
                                    placeholder="Ejemplo: Diabetes, hipertensión, etc."
                                />

                                <PreguntaSiNo
                                    label="¿Madre con vida?"
                                    value={antecedentesFamiliares.madreConVida}
                                    onChange={(value) => setAntecedentesFamiliares({
                                        ...antecedentesFamiliares,
                                        madreConVida: value
                                    })}
                                />

                                <PreguntaTexto
                                    label="Enfermedad que padece o padeció (madre)"
                                    value={antecedentesFamiliares.enfermedadMadre}
                                    onChange={(value) => setAntecedentesFamiliares({
                                        ...antecedentesFamiliares,
                                        enfermedadMadre: value
                                    })}
                                    placeholder="Ejemplo: Cáncer, problemas cardíacos, etc."
                                />
                            </div>

                            <PreguntaMixto
                                label="¿Tiene hermanos?"
                                detalleLabel="¿Están sanos? ¿Alguna enfermedad?"
                                value={antecedentesFamiliares.hermanos}
                                onChange={(value) => setAntecedentesFamiliares({
                                    ...antecedentesFamiliares,
                                    hermanos: value
                                })}
                                placeholder="Describa el estado de salud de los hermanos"
                            />

                            <PreguntaMixto
                                label="¿Sufre de alguna enfermedad?"
                                detalleLabel="¿De qué?"
                                value={antecedentesFamiliares.sufreEnfermedad}
                                onChange={(value) => setAntecedentesFamiliares({
                                    ...antecedentesFamiliares,
                                    sufreEnfermedad: value
                                })}
                                placeholder="Especifique qué enfermedad"
                            />

                            <PreguntaMixto
                                label="¿Hace algún tratamiento médico?"
                                detalleLabel="¿Cuál?"
                                value={antecedentesFamiliares.haceTratamientoMedico}
                                onChange={(value) => setAntecedentesFamiliares({
                                    ...antecedentesFamiliares,
                                    haceTratamientoMedico: value
                                })}
                                placeholder="Especifique el tratamiento"
                            />

                            <PreguntaTexto
                                label="¿Qué medicamentos consume habitualmente?"
                                value={antecedentesFamiliares.medicamentosHabituales}
                                onChange={(value) => setAntecedentesFamiliares({
                                    ...antecedentesFamiliares,
                                    medicamentosHabituales: value
                                })}
                                placeholder="Liste los medicamentos habituales"
                            />

                            <PreguntaTexto
                                label="¿Qué medicamentos ha consumido en los últimos 5 años?"
                                value={antecedentesFamiliares.medicamentosUltimos5Anos}
                                onChange={(value) => setAntecedentesFamiliares({
                                    ...antecedentesFamiliares,
                                    medicamentosUltimos5Anos: value
                                })}
                                placeholder="Liste los medicamentos de los últimos 5 años"
                            />
                        </div>
                    )}

                    {/* Paso 2: Hábitos y Antecedentes Médicos */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <Alert>
                                <AlertDescription>
                                    Complete la información sobre los hábitos y antecedentes médicos del paciente.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <PreguntaSiNo
                                        label="¿Realiza algún deporte?"
                                        value={habitosYAntecedentes.realizaDeporte}
                                        onChange={(value) => setHabitosYAntecedentes({
                                            ...habitosYAntecedentes,
                                            realizaDeporte: value
                                        })}
                                    />

                                    <PreguntaSiNo
                                        label="¿Nota algún malestar al realizarlo?"
                                        value={habitosYAntecedentes.malestarDeporte}
                                        onChange={(value) => setHabitosYAntecedentes({
                                            ...habitosYAntecedentes,
                                            malestarDeporte: value
                                        })}
                                    />

                                    <PreguntaSiNo
                                        label="¿Es alérgico a alguna droga?"
                                        value={habitosYAntecedentes.alergiaDroga}
                                        onChange={(value) => setHabitosYAntecedentes({
                                            ...habitosYAntecedentes,
                                            alergiaDroga: value
                                        })}
                                    />

                                    <PreguntaSiNo
                                        label="¿Es alérgico a la anestesia?"
                                        value={habitosYAntecedentes.alergiaAnestesia}
                                        onChange={(value) => setHabitosYAntecedentes({
                                            ...habitosYAntecedentes,
                                            alergiaAnestesia: value
                                        })}
                                    />

                                    <PreguntaSiNo
                                        label="¿Es alérgico a la penicilina?"
                                        value={habitosYAntecedentes.alergiaPenicilina}
                                        onChange={(value) => setHabitosYAntecedentes({
                                            ...habitosYAntecedentes,
                                            alergiaPenicilina: value
                                        })}
                                    />

                                    <PreguntaSiNo
                                        label="¿Es diabético?"
                                        value={habitosYAntecedentes.esDiabetico}
                                        onChange={(value) => setHabitosYAntecedentes({
                                            ...habitosYAntecedentes,
                                            esDiabetico: value
                                        })}
                                    />

                                    <PreguntaSiNo
                                        label="¿Fuma?"
                                        value={habitosYAntecedentes.fuma}
                                        onChange={(value) => setHabitosYAntecedentes({
                                            ...habitosYAntecedentes,
                                            fuma: value
                                        })}
                                    />

                                    <PreguntaSiNo
                                        label="¿Tiene presión alta?"
                                        value={habitosYAntecedentes.presionAlta}
                                        onChange={(value) => setHabitosYAntecedentes({
                                            ...habitosYAntecedentes,
                                            presionAlta: value
                                        })}
                                    />
                                </div>

                                <PreguntaTexto
                                    label="¿Es alérgico a otros medicamentos?"
                                    value={habitosYAntecedentes.alergiaOtrosMedicamentos}
                                    onChange={(value) => setHabitosYAntecedentes({
                                        ...habitosYAntecedentes,
                                        alergiaOtrosMedicamentos: value
                                    })}
                                    placeholder="Especifique otros medicamentos"
                                />

                                <PreguntaTexto
                                    label="¿Se encuentra con alguna medicación?"
                                    value={habitosYAntecedentes.seEncuentraConMedicacion}
                                    onChange={(value) => setHabitosYAntecedentes({
                                        ...habitosYAntecedentes,
                                        seEncuentraConMedicacion: value
                                    })}
                                    placeholder="Indique medicación actual"
                                />

                                <PreguntaMixto
                                    label="¿Está controlado? (Diabetes)"
                                    detalleLabel="¿Con qué medicamento?"
                                    value={habitosYAntecedentes.diabetesControlada}
                                    onChange={(value) => setHabitosYAntecedentes({
                                        ...habitosYAntecedentes,
                                        diabetesControlada: value
                                    })}
                                    placeholder="Metformina, insulina, etc."
                                />

                                <PreguntaMixto
                                    label="¿Tiene algún problema cardíaco?"
                                    detalleLabel="¿Cuál?"
                                    value={habitosYAntecedentes.problemaCardiaco}
                                    onChange={(value) => setHabitosYAntecedentes({
                                        ...habitosYAntecedentes,
                                        problemaCardiaco: value
                                    })}
                                    placeholder="Arritmia, hipertensión, etc."
                                />

                                <PreguntaMixto
                                    label="¿Está embarazada?"
                                    detalleLabel="¿De cuántos meses?"
                                    value={habitosYAntecedentes.estaEmbarazada}
                                    onChange={(value) => setHabitosYAntecedentes({
                                        ...habitosYAntecedentes,
                                        estaEmbarazada: value
                                    })}
                                    placeholder="Número de meses de gestación"
                                />

                                <PreguntaTexto
                                    label="Médico clínico"
                                    value={habitosYAntecedentes.medicoClinico}
                                    onChange={(value) => setHabitosYAntecedentes({
                                        ...habitosYAntecedentes,
                                        medicoClinico: value
                                    })}
                                    placeholder="Nombre del médico clínico"
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                        >
                            Anterior
                        </Button>

                        <div className="flex space-x-4">
                            {currentStep < totalSteps ? (
                                <Button onClick={nextStep}>
                                    Siguiente
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar Cuestionario'}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CuestionarioMedico;