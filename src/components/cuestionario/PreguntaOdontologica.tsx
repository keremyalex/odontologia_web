import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Componente para selección múltiple
interface PreguntaSeleccionMultipleProps {
    label: string;
    value?: string[];
    onChange: (value: string[]) => void;
    opciones: string[];
    required?: boolean;
}

export const PreguntaSeleccionMultiple: React.FC<PreguntaSeleccionMultipleProps> = ({
    label,
    value = [],
    onChange,
    opciones,
    required = false
}) => {
    const handleChange = (opcion: string, checked: boolean) => {
        if (checked) {
            onChange([...value, opcion]);
        } else {
            onChange(value.filter(v => v !== opcion));
        }
    };

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <div className="space-y-2">
                {opciones.map((opcion) => (
                    <div key={opcion} className="flex items-center space-x-2">
                        <Checkbox
                            id={`${label}-${opcion}`}
                            checked={value.includes(opcion)}
                            onCheckedChange={(checked: boolean) => handleChange(opcion, checked)}
                        />
                        <Label htmlFor={`${label}-${opcion}`}>{opcion}</Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente para selección única
interface PreguntaSeleccionUnicaProps {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    opciones: string[];
    required?: boolean;
}

export const PreguntaSeleccionUnica: React.FC<PreguntaSeleccionUnicaProps> = ({
    label,
    value,
    onChange,
    opciones,
    required = false
}) => {
    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={value || ''} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                    {opciones.map((opcion) => (
                        <SelectItem key={opcion} value={opcion}>
                            {opcion}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

// Componente para preguntas Sí/No simples
interface PreguntaSiNoSimpleProps {
    label: string;
    value?: boolean;
    onChange: (value: boolean) => void;
    required?: boolean;
}

export const PreguntaSiNoSimple: React.FC<PreguntaSiNoSimpleProps> = ({
    label,
    value,
    onChange,
    required = false
}) => {
    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <RadioGroup
                value={value !== undefined ? value.toString() : ''}
                onValueChange={(val: string) => onChange(val === 'true')}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`${label}-si`} />
                    <Label htmlFor={`${label}-si`}>Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`${label}-no`} />
                    <Label htmlFor={`${label}-no`}>No</Label>
                </div>
            </RadioGroup>
        </div>
    );
};

// Componente para texto simple
interface PreguntaTextoSimpleProps {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    required?: boolean;
}

export const PreguntaTextoSimple: React.FC<PreguntaTextoSimpleProps> = ({
    label,
    value,
    onChange,
    placeholder,
    multiline = false,
    required = false
}) => {
    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            {multiline ? (
                <Textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                />
            ) : (
                <Input
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

// Componente para grupo de preguntas Sí/No
interface PreguntaGrupoSiNoProps {
    title: string;
    items: Array<{
        key: string;
        label: string;
        value?: boolean;
    }>;
    onChange: (key: string, value: boolean) => void;
}

export const PreguntaGrupoSiNo: React.FC<PreguntaGrupoSiNoProps> = ({
    title,
    items,
    onChange
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((item) => (
                    <PreguntaSiNoSimple
                        key={item.key}
                        label={item.label}
                        value={item.value}
                        onChange={(value) => onChange(item.key, value)}
                    />
                ))}
            </CardContent>
        </Card>
    );
};