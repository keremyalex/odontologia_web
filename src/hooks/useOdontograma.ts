import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import apiService from '@/services/api';

// Tipos para el hook del odontograma
interface ToothSurface {
    vestibular: string;
    oclusal: string;
    distal: string;
    lingual: string;
    mesial: string;
}

interface Tooth {
    id: number;
    number: string;
    position: string;
    group: number;
    status: string;
    surfaces: ToothSurface;
    isTemporary: boolean;
    observations?: string;
}

// Función para crear dientes iniciales (todos sanos)
const createInitialTeeth = (): Tooth[] => {
    const permanentTeeth = [
        // Grupo 1 - Molares y premolares superiores derechos (1.8 al 1.4)
        { id: 18, number: '1.8', position: 'Superior Derecho', group: 1 },
        { id: 17, number: '1.7', position: 'Superior Derecho', group: 1 },
        { id: 16, number: '1.6', position: 'Superior Derecho', group: 1 },
        { id: 15, number: '1.5', position: 'Superior Derecho', group: 1 },
        { id: 14, number: '1.4', position: 'Superior Derecho', group: 1 },

        // Grupo 2 - Incisivos y caninos superiores (1.3 al 2.3)
        { id: 13, number: '1.3', position: 'Superior Derecho', group: 2 },
        { id: 12, number: '1.2', position: 'Superior Derecho', group: 2 },
        { id: 11, number: '1.1', position: 'Superior Derecho', group: 2 },
        { id: 21, number: '2.1', position: 'Superior Izquierdo', group: 2 },
        { id: 22, number: '2.2', position: 'Superior Izquierdo', group: 2 },
        { id: 23, number: '2.3', position: 'Superior Izquierdo', group: 2 },

        // Grupo 3 - Premolares y molares superiores izquierdos (2.4 al 2.8)
        { id: 24, number: '2.4', position: 'Superior Izquierdo', group: 3 },
        { id: 25, number: '2.5', position: 'Superior Izquierdo', group: 3 },
        { id: 26, number: '2.6', position: 'Superior Izquierdo', group: 3 },
        { id: 27, number: '2.7', position: 'Superior Izquierdo', group: 3 },
        { id: 28, number: '2.8', position: 'Superior Izquierdo', group: 3 },

        // Grupo 4 - Molares y premolares inferiores derechos (4.8 al 4.4)
        { id: 48, number: '4.8', position: 'Inferior Derecho', group: 4 },
        { id: 47, number: '4.7', position: 'Inferior Derecho', group: 4 },
        { id: 46, number: '4.6', position: 'Inferior Derecho', group: 4 },
        { id: 45, number: '4.5', position: 'Inferior Derecho', group: 4 },
        { id: 44, number: '4.4', position: 'Inferior Derecho', group: 4 },

        // Grupo 5 - Incisivos y caninos inferiores (4.3 al 3.3)
        { id: 43, number: '4.3', position: 'Inferior Derecho', group: 5 },
        { id: 42, number: '4.2', position: 'Inferior Derecho', group: 5 },
        { id: 41, number: '4.1', position: 'Inferior Derecho', group: 5 },
        { id: 31, number: '3.1', position: 'Inferior Izquierdo', group: 5 },
        { id: 32, number: '3.2', position: 'Inferior Izquierdo', group: 5 },
        { id: 33, number: '3.3', position: 'Inferior Izquierdo', group: 5 },

        // Grupo 6 - Premolares y molares inferiores izquierdos (3.4 al 3.8)
        { id: 34, number: '3.4', position: 'Inferior Izquierdo', group: 6 },
        { id: 35, number: '3.5', position: 'Inferior Izquierdo', group: 6 },
        { id: 36, number: '3.6', position: 'Inferior Izquierdo', group: 6 },
        { id: 37, number: '3.7', position: 'Inferior Izquierdo', group: 6 },
        { id: 38, number: '3.8', position: 'Inferior Izquierdo', group: 6 }
    ];

    return permanentTeeth.map(tooth => ({
        ...tooth,
        status: 'sano',
        isTemporary: false,
        surfaces: {
            vestibular: 'sano',
            oclusal: 'sano',
            distal: 'sano',
            lingual: 'sano',
            mesial: 'sano'
        }
    }));
};

interface UseOdontogramaResult {
    teeth: Tooth[];
    loading: boolean;
    hasChanges: boolean;
    saveOdontograma: (observaciones?: string) => Promise<boolean>;
    updateTooth: (toothId: number, updates: Partial<Tooth>) => void;
    updateSurface: (toothId: number, surface: keyof ToothSurface, status: string) => void;
    resetToInitial: () => void;
    loadOdontograma: () => Promise<void>;
}

export const useOdontograma = (historiaId: number): UseOdontogramaResult => {
    const [teeth, setTeeth] = useState<Tooth[]>(createInitialTeeth());
    const [loading, setLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Cargar odontograma desde la API
    const loadOdontograma = async () => {
        if (!historiaId) return;
        
        try {
            setLoading(true);
            const response = await apiService.getOdontograma(historiaId);
            
            if (response.success && response.data?.dientes) {
                const loadedTeeth = Array.isArray(response.data.dientes) 
                    ? response.data.dientes 
                    : JSON.parse(response.data.dientes);
                setTeeth(loadedTeeth);
                setHasChanges(false);
            } else {
                // Si no hay odontograma, usar dientes iniciales
                setTeeth(createInitialTeeth());
                setHasChanges(false);
            }
        } catch (error) {
            console.error('Error al cargar odontograma:', error);
            // En caso de error, usar dientes iniciales
            setTeeth(createInitialTeeth());
            setHasChanges(false);
            toast.error('Error al cargar odontograma. Se mostrará un odontograma inicial.');
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        loadOdontograma();
    }, [historiaId]);

    // Guardar odontograma
    const saveOdontograma = async (observaciones = 'Odontograma actualizado'): Promise<boolean> => {
        if (loading) return false;

        setLoading(true);
        try {
            const odontogramData = {
                dientes: teeth,
                observaciones
            };

            const response = await apiService.saveOdontograma(historiaId, odontogramData);
            
            if (response.success) {
                setHasChanges(false);
                toast.success('Odontograma guardado correctamente');
                return true;
            } else {
                toast.error('Error al guardar el odontograma');
                return false;
            }
        } catch (error: any) {
            console.error('Error al guardar odontograma:', error);
            const errorMessage = error.response?.data?.message || 'Error al guardar el odontograma';
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar un diente completo
    const updateTooth = (toothId: number, updates: Partial<Tooth>) => {
        const updatedTeeth = teeth.map(t =>
            t.id === toothId
                ? { ...t, ...updates }
                : t
        );

        setTeeth(updatedTeeth);
        setHasChanges(true);
    };

    // Actualizar una superficie específica
    const updateSurface = (toothId: number, surface: keyof ToothSurface, status: string) => {
        const updatedTeeth = teeth.map(t =>
            t.id === toothId
                ? {
                    ...t,
                    surfaces: {
                        ...t.surfaces,
                        [surface]: status
                    }
                }
                : t
        );

        setTeeth(updatedTeeth);
        setHasChanges(true);
    };

    // Resetear a estado inicial
    const resetToInitial = () => {
        setTeeth(createInitialTeeth());
        setHasChanges(true);
    };

    return {
        teeth,
        loading,
        hasChanges,
        saveOdontograma,
        updateTooth,
        updateSurface,
        resetToInitial,
        loadOdontograma
    };
};

export type { Tooth, ToothSurface };
export { createInitialTeeth };