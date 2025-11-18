import React, { useState, useEffect } from 'react';
import './odontogram.css';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Save,
    RefreshCw,
    AlertCircle,
    X
} from 'lucide-react';

// Tipos para el odontograma personalizado
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

interface OdontogramViewerProps {
    historiaId: string;
    readOnly?: boolean;
    odontograma?: any;
    onSave?: (data: any) => void;
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

// Herramientas disponibles para el odontograma
const toothTools = [
    { id: 'sano', label: 'Sano', color: 'bg-green-400', symbol: '✓', description: 'Diente sano' },
    { id: 'caries', label: 'Caries', color: 'bg-red-400', symbol: 'C', description: 'Caries dental' },
    { id: 'obturado', label: 'Obturado', color: 'bg-blue-400', symbol: 'O', description: 'Obturación' },
    { id: 'corona', label: 'Corona', color: 'bg-yellow-400', symbol: 'Co', description: 'Corona protésica' },
    { id: 'endodoncia', label: 'Endodoncia', color: 'bg-purple-400', symbol: 'E', description: 'Tratamiento endodóntico' },
    { id: 'implante', label: 'Implante', color: 'bg-gray-500', symbol: 'I', description: 'Implante dental' },
    { id: 'extraido', label: 'Extraído', color: 'bg-gray-800', symbol: 'X', description: 'Diente extraído' },
    { id: 'fractura', label: 'Fractura', color: 'bg-orange-400', symbol: 'F', description: 'Fractura dental' },
    { id: 'puente', label: 'Puente', color: 'bg-indigo-400', symbol: 'P', description: 'Prótesis fija' },
    { id: 'extraccion_indicada', label: 'Ext. Indicada', color: 'bg-red-600', symbol: 'Xi', description: 'Extracción indicada' }
];

// Componente para cada diente individual
const ToothComponent: React.FC<{
    tooth: Tooth;
    isSelected: boolean;
    readOnly?: boolean;
    onClick: (tooth: Tooth) => void;
}> = ({ tooth, isSelected, readOnly, onClick }) => {

    const getStatusColor = (status: string) => {
        const tool = toothTools.find(t => t.id === status);
        return tool ? tool.color : 'bg-green-200';
    };

    return (
        <div className="tooth-container flex flex-col items-center relative">
            {/* Número del diente */}
            <div className="text-xs text-blue-600 font-semibold mb-1">
                {tooth.number}
            </div>

            {/* Diente visual */}
            <div
                className={`
                    tooth relative w-12 h-12 border-2 rounded-lg cursor-pointer
                    ${isSelected 
                        ? 'selected border-blue-600 ring-4 ring-blue-300 ring-opacity-50 shadow-lg shadow-blue-200' 
                        : 'border-gray-300'
                    }
                    ${readOnly ? 'cursor-default' : 'hover:border-blue-400'}
                    ${getStatusColor(tooth.status)}
                    transition-all duration-300 ease-in-out
                `}
                onClick={() => !readOnly && onClick(tooth)}
            >
                {/* Superficies del diente */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px p-1">
                    {/* Superficie Vestibular (arriba centro) */}
                    <div></div>
                    <div
                        className={`surface ${getStatusColor(tooth.surfaces.vestibular)} rounded-sm flex items-center justify-center text-xs`}
                        title="Vestibular"
                    >
                    </div>
                    <div></div>

                    {/* Superficie Mesial (izquierda centro) */}
                    <div
                        className={`surface ${getStatusColor(tooth.surfaces.mesial)} rounded-sm flex items-center justify-center text-xs`}
                        title="Mesial"
                    >
                    </div>
                    <div
                        className={`surface ${getStatusColor(tooth.surfaces.oclusal)} rounded-sm flex items-center justify-center text-xs`}
                        title="Oclusal"
                    >
                    </div>
                    <div
                        className={`surface ${getStatusColor(tooth.surfaces.distal)} rounded-sm flex items-center justify-center text-xs`}
                        title="Distal"
                    >
                    </div>

                    {/* Superficie Lingual (abajo centro) */}
                    <div></div>
                    <div
                        className={`surface ${getStatusColor(tooth.surfaces.lingual)} rounded-sm flex items-center justify-center text-xs`}
                        title="Lingual"
                    >
                    </div>
                    <div></div>
                </div>

                {/* Status general del diente */}
                {tooth.status !== 'sano' && (
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs">
                    </div>
                )}
                
                {/* Indicador de selección */}
                {isSelected && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md z-10">
                        {tooth.number}
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente de panel lateral para detalles del diente
const ToothDetailPanel: React.FC<{
    tooth: Tooth;
    readOnly?: boolean;
    onToothUpdate: (toothId: number, updates: Partial<Tooth>) => void;
    onSurfaceUpdate: (toothId: number, surface: keyof ToothSurface, status: string) => void;
    onClose: () => void;
}> = ({ tooth, readOnly, onToothUpdate, onSurfaceUpdate, onClose }) => {
    const [activeTab, setActiveTab] = useState('estado');
    const [notes, setNotes] = useState(tooth.observations || '');
    const [selectedTool, setSelectedTool] = useState('caries');

    const handleStatusChange = (status: string) => {
        if (!readOnly) {
            // Actualizar estado general del diente
            onToothUpdate(tooth.id, { status });

            // También actualizar todas las superficies con el mismo estado
            const newSurfaces = {
                vestibular: status,
                oclusal: status,
                distal: status,
                lingual: status,
                mesial: status
            };
            onToothUpdate(tooth.id, { surfaces: newSurfaces });
        }
    };

    const handleSurfaceChange = (surface: keyof ToothSurface, status: string) => {
        if (!readOnly) {
            onSurfaceUpdate(tooth.id, surface, status);
        }
    };

    const handleNotesChange = () => {
        if (!readOnly) {
            onToothUpdate(tooth.id, { observations: notes });
        }
    };

    const getStatusColor = (status: string) => {
        const tool = toothTools.find(t => t.id === status);
        return tool ? tool.color : 'bg-white';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-80 p-4 flex flex-col h-full mr-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                            {tooth.number}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {tooth.number.startsWith('1') || tooth.number.startsWith('2') ? 'Molar' : 'Premolar/Incisivo'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {tooth.position} • Posición {tooth.number.split('.')[1]}
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                <button
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'estado' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                        }`}
                    onClick={() => setActiveTab('estado')}
                >
                    Estado
                </button>
                <button
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'notas' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                        }`}
                    onClick={() => setActiveTab('notas')}
                >
                    Notas
                </button>
                <button
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'historial' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'
                        }`}
                    onClick={() => setActiveTab('historial')}
                >
                    Historial
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Estado Tab */}
                {activeTab === 'estado' && (
                    <div className="space-y-6">
                        {/* Selector de herramienta */}
                        <div>
                            <h4 className="font-medium text-gray-700 mb-3">Selecciona un estado:</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {toothTools.map((tool) => (
                                    <button
                                        key={tool.id}
                                        disabled={readOnly}
                                        className={`p-2 rounded-lg border text-xs font-medium transition-all ${selectedTool === tool.id
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                            } ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        onClick={() => setSelectedTool(tool.id)}
                                        title={tool.description}
                                    >
                                        <div className={`w-4 h-4 mx-auto mb-1 rounded ${tool.color} flex items-center justify-center text-white text-xs`}>
                                            {tool.symbol}
                                        </div>
                                        {tool.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mensaje de instrucción */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Haz clic en cada superficie para aplicar:
                                <span className={`font-semibold ml-1 px-2 py-1 rounded text-white text-xs ${toothTools.find(t => t.id === selectedTool)?.color || 'bg-red-500'
                                    }`}>
                                    {toothTools.find(t => t.id === selectedTool)?.label || 'Caries'}
                                </span>
                            </p>
                        </div>

                        {/* Representación visual del diente */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                {/* Diente visual con superficies clickeables */}
                                <div className="tooth-visual relative w-32 h-32">
                                    {/* Superficie Vestibular (arriba) */}
                                    <button
                                        disabled={readOnly}
                                        onClick={() => handleSurfaceChange('vestibular', selectedTool)}
                                        className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-6 rounded-t-lg border-2 transition-all ${getStatusColor(tooth.surfaces.vestibular)
                                            } border-gray-400 ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex items-center justify-center text-xs font-medium text-white`}
                                        title={`Vestibular - ${toothTools.find(t => t.id === tooth.surfaces.vestibular)?.label || 'Sano'}`}
                                    >
                                        Vestibular
                                    </button>

                                    {/* Superficie Mesial (izquierda) */}
                                    <button
                                        disabled={readOnly}
                                        onClick={() => handleSurfaceChange('mesial', selectedTool)}
                                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-16 rounded-l-lg border-2 transition-all ${getStatusColor(tooth.surfaces.mesial)
                                            } border-gray-400 ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex items-center justify-center text-xs font-medium text-white`}
                                        title={`Mesial - ${toothTools.find(t => t.id === tooth.surfaces.mesial)?.label || 'Sano'}`}
                                        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
                                    >
                                        Mesial
                                    </button>

                                    {/* Superficie Oclusal (centro) */}
                                    <button
                                        disabled={readOnly}
                                        onClick={() => handleSurfaceChange('oclusal', selectedTool)}
                                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-lg border-2 transition-all ${getStatusColor(tooth.surfaces.oclusal)
                                            } border-gray-400 ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex items-center justify-center text-xs font-medium text-white text-center`}
                                        title={`Oclusal - ${toothTools.find(t => t.id === tooth.surfaces.oclusal)?.label || 'Sano'}`}
                                    >
                                        Oclusal
                                    </button>

                                    {/* Superficie Distal (derecha) */}
                                    <button
                                        disabled={readOnly}
                                        onClick={() => handleSurfaceChange('distal', selectedTool)}
                                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-16 rounded-r-lg border-2 transition-all ${getStatusColor(tooth.surfaces.distal)
                                            } border-gray-400 ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex items-center justify-center text-xs font-medium text-white`}
                                        title={`Distal - ${toothTools.find(t => t.id === tooth.surfaces.distal)?.label || 'Sano'}`}
                                        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
                                    >
                                        Distal
                                    </button>

                                    {/* Superficie Lingual (abajo) */}
                                    <button
                                        disabled={readOnly}
                                        onClick={() => handleSurfaceChange('lingual', selectedTool)}
                                        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-6 rounded-b-lg border-2 transition-all ${getStatusColor(tooth.surfaces.lingual)
                                            } border-gray-400 ${readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex items-center justify-center text-xs font-medium text-white`}
                                        title={`Lingual - ${toothTools.find(t => t.id === tooth.surfaces.lingual)?.label || 'Sano'}`}
                                    >
                                        Lingual
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Botón para aplicar a todo el diente */}
                        <div className="text-center">
                            <button
                                disabled={readOnly}
                                onClick={() => handleStatusChange(selectedTool)}
                                className={`w-full py-3 px-4 rounded-lg border-2 transition-all ${readOnly
                                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                                        : `bg-blue-50 border-blue-300 hover:bg-blue-100 cursor-pointer text-blue-700`
                                    } text-sm font-medium`}
                            >
                                Aplicar a todo el diente
                            </button>
                        </div>
                    </div>
                )}

                {/* Notas Tab */}
                {activeTab === 'notas' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Observaciones
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={handleNotesChange}
                                disabled={readOnly}
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:opacity-50"
                                placeholder="Agregar observaciones sobre este diente..."
                            />
                        </div>

                        {/* Información adicional */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-medium text-gray-700 mb-2">Información del Diente</h5>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Número:</span>
                                    <span className="font-medium">{tooth.number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Posición:</span>
                                    <span className="font-medium">{tooth.position}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cuadrante:</span>
                                    <span className="font-medium">Grupo {tooth.group}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tipo:</span>
                                    <span className="font-medium">
                                        {tooth.isTemporary ? 'Temporal' : 'Permanente'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Historial Tab */}
                {activeTab === 'historial' && (
                    <div className="space-y-4">
                        <div className="text-center text-gray-500 py-8">
                            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>Historial de tratamientos</p>
                            <p className="text-sm">Funcionalidad en desarrollo</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer con estado actual */}
            {!readOnly && (
                <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Estado actual:</span>
                        <Badge
                            className={`${getStatusColor(tooth.status)} text-white`}
                            variant="secondary"
                        >
                            {toothTools.find(t => t.id === tooth.status)?.label || 'Sano'}
                        </Badge>
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente principal del odontograma
const CustomOdontogram: React.FC<{
    teeth: Tooth[];
    selectedTooth: Tooth | null;
    readOnly?: boolean;
    onToothClick: (tooth: Tooth) => void;
}> = ({ teeth, selectedTooth, readOnly, onToothClick }) => {

    const getTeethByGroup = (group: number) => {
        return teeth.filter(tooth => tooth.group === group);
    };

    return (
        <div className="custom-odontogram">
            {/* Arcada Superior */}
            <div className="upper-arch mb-4">
                <div className="flex justify-center items-start gap-2">
                    {/* Grupo 1 - Molares superiores derechos */}
                    <div className="group-container">
                        <div className="text-center text-blue-600 font-medium mb-3">Grupo 1</div>
                        <div className="flex gap-1">
                            {getTeethByGroup(1).map((tooth) => (
                                <ToothComponent
                                    key={tooth.id}
                                    tooth={tooth}
                                    isSelected={selectedTooth?.id === tooth.id}
                                    readOnly={readOnly}
                                    onClick={onToothClick}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Grupo 2 - Premolares e incisivos superiores derechos */}
                    <div className="group-container">
                        <div className="text-center text-blue-600 font-medium mb-3">Grupo 2</div>
                        <div className="flex gap-1">
                            {getTeethByGroup(2).map(tooth => (
                                <ToothComponent
                                    key={tooth.id}
                                    tooth={tooth}
                                    isSelected={selectedTooth?.id === tooth.id}
                                    readOnly={readOnly}
                                    onClick={onToothClick}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Grupo 3 - Premolares e incisivos superiores izquierdos */}
                    <div className="group-container">
                        <div className="text-center text-blue-600 font-medium mb-3">Grupo 3</div>
                        <div className="flex gap-1">
                            {getTeethByGroup(3).map(tooth => (
                                <ToothComponent
                                    key={tooth.id}
                                    tooth={tooth}
                                    isSelected={selectedTooth?.id === tooth.id}
                                    readOnly={readOnly}
                                    onClick={onToothClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Arcada Inferior */}
            <div className="lower-arch">
                <div className="flex justify-center items-start gap-2">
                    {/* Grupo 4 - Molares y premolares inferiores derechos */}
                    <div className="group-container">
                        <div className="flex gap-1">
                            {getTeethByGroup(4).map(tooth => (
                                <ToothComponent
                                    key={tooth.id}
                                    tooth={tooth}
                                    isSelected={selectedTooth?.id === tooth.id}
                                    readOnly={readOnly}
                                    onClick={onToothClick}
                                />
                            ))}
                        </div>
                        <div className="text-center text-blue-600 font-medium mt-3">Grupo 4</div>
                    </div>

                    {/* Grupo 5 - Incisivos y caninos inferiores */}
                    <div className="group-container">
                        <div className="flex gap-1">
                            {getTeethByGroup(5).map(tooth => (
                                <ToothComponent
                                    key={tooth.id}
                                    tooth={tooth}
                                    isSelected={selectedTooth?.id === tooth.id}
                                    readOnly={readOnly}
                                    onClick={onToothClick}
                                />
                            ))}
                        </div>
                        <div className="text-center text-blue-600 font-medium mt-3">Grupo 5</div>
                    </div>

                    {/* Grupo 6 - Premolares y molares inferiores izquierdos */}
                    <div className="group-container">
                        <div className="flex gap-1">
                            {getTeethByGroup(6).map(tooth => (
                                <ToothComponent
                                    key={tooth.id}
                                    tooth={tooth}
                                    isSelected={selectedTooth?.id === tooth.id}
                                    readOnly={readOnly}
                                    onClick={onToothClick}
                                />
                            ))}
                        </div>
                        <div className="text-center text-blue-600 font-medium mt-3">Grupo 6</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente principal del visor de odontograma
const OdontogramViewer: React.FC<OdontogramViewerProps> = ({
    historiaId,
    readOnly = false,
    odontograma,
    onSave
}) => {
    // Estados del odontograma personalizado
    const [teeth, setTeeth] = useState<Tooth[]>(createInitialTeeth());
    const [selectedTooth, setSelectedTooth] = useState<Tooth | null>(null);
    const [currentTool] = useState('sano');
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar datos del odontograma al montar el componente
    useEffect(() => {
        if (odontograma?.dientes) {
            try {
                const loadedTeeth = typeof odontograma.dientes === 'string'
                    ? JSON.parse(odontograma.dientes)
                    : odontograma.dientes;
                setTeeth(loadedTeeth);
            } catch (error) {
                console.error('Error al cargar odontograma:', error);
            }
        }
    }, [odontograma]);

    // Manejar click en diente
    const handleToothClick = (tooth: Tooth) => {
        if (readOnly) {
            setSelectedTooth(tooth);
            return;
        }

        const updatedTeeth = teeth.map(t =>
            t.id === tooth.id
                ? { ...t, status: currentTool }
                : t
        );

        setTeeth(updatedTeeth);
        setSelectedTooth({ ...tooth, status: currentTool });
        setHasChanges(true);
    };

    // Manejar actualización de diente desde el panel lateral
    const handleToothUpdate = (toothId: number, updates: Partial<Tooth>) => {
        if (readOnly) return;

        const updatedTeeth = teeth.map(t =>
            t.id === toothId
                ? { ...t, ...updates }
                : t
        );

        setTeeth(updatedTeeth);

        // Actualizar el diente seleccionado si es el mismo
        if (selectedTooth && selectedTooth.id === toothId) {
            setSelectedTooth({ ...selectedTooth, ...updates });
        }

        setHasChanges(true);
    };

    // Manejar actualización de superficie desde el panel lateral
    const handleSurfaceUpdate = (toothId: number, surface: keyof ToothSurface, status: string) => {
        if (readOnly) return;

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

        // Actualizar el diente seleccionado si es el mismo
        if (selectedTooth && selectedTooth.id === toothId) {
            setSelectedTooth({
                ...selectedTooth,
                surfaces: {
                    ...selectedTooth.surfaces,
                    [surface]: status
                }
            });
        }

        setHasChanges(true);
    };

    // Guardar odontograma
    const handleSave = async () => {
        if (!onSave || isLoading) return;

        setIsLoading(true);
        try {
            const odontogramData = {
                historiaClinicaId: historiaId,
                dientes: JSON.stringify(teeth),
                fechaModificacion: new Date().toISOString(),
                observaciones: ''
            };

            await onSave(odontogramData);
            setHasChanges(false);
        } catch (error) {
            console.error('Error al guardar odontograma:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Resetear a estado inicial
    const handleReset = () => {
        setTeeth(createInitialTeeth());
        setSelectedTooth(null);
        setHasChanges(true);
    };

    return (
        <div className="odontogram-viewer space-y-6 max-w-7xl mx-auto px-4">
            {/* Solo mostrar controles de guardado cuando no es solo lectura */}
            {!readOnly && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Odontograma del Paciente</span>
                                {selectedTooth && (
                                    <Badge variant="secondary" className="text-blue-600">
                                        Diente {selectedTooth.number} seleccionado
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {hasChanges && (
                                    <Badge variant="secondary" className="text-orange-600">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Cambios sin guardar
                                    </Badge>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                    disabled={isLoading}
                                >
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                    Resetear
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!hasChanges || isLoading}
                                    className="bg-blue-600 hover:bg-blue-700"
                                    size="sm"
                                >
                                    <Save className="w-4 h-4 mr-1" />
                                    {isLoading ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Layout principal con odontograma y panel lateral */}
            <div className="flex gap-4">
                {/* Odontograma principal */}
                <div className="flex-1 overflow-hidden">
                    <Card>
                        <CardContent className="p-4">
                            <div className="odontogram-container bg-white">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-sm text-gray-600">
                                        Sistema de numeración: FDI
                                    </div>
                                    <div className="text-blue-600 font-medium">
                                        32 dientes permanentes
                                    </div>
                                </div>

                                {/* Odontograma */}
                                <div className="w-full">
                                    <CustomOdontogram
                                        teeth={teeth}
                                        selectedTooth={selectedTooth}
                                        readOnly={readOnly}
                                        onToothClick={handleToothClick}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Panel lateral - Siempre presente */}
                <div className="w-80 min-w-80">
                    {selectedTooth ? (
                        <ToothDetailPanel
                            tooth={selectedTooth}
                            readOnly={readOnly}
                            onToothUpdate={handleToothUpdate}
                            onSurfaceUpdate={handleSurfaceUpdate}
                            onClose={() => setSelectedTooth(null)}
                        />
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm w-80 p-8 flex flex-col items-center justify-center h-64 mr-4">
                            <div className="text-center text-gray-500">
                                <p className="text-lg font-medium mb-2">Selecciona un diente</p>
                                <p className="text-sm">Haz clic en cualquier diente del odontograma para ver sus detalles y herramientas</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OdontogramViewer;