import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import type { RespuestaSiNo, RespuestaTexto, RespuestaMixto } from '@/types';

interface PreguntaSiNoProps {
    label: string;
    value?: RespuestaSiNo;
    onChange: (value: RespuestaSiNo) => void;
    required?: boolean;
}

export const PreguntaSiNo: React.FC<PreguntaSiNoProps> = ({
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
                value={value?.respuesta?.toString() || ''}
                onValueChange={(val: string) => onChange({ respuesta: val === 'true' })}
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

interface PreguntaTextoProps {
    label: string;
    value?: RespuestaTexto;
    onChange: (value: RespuestaTexto) => void;
    placeholder?: string;
    multiline?: boolean;
    required?: boolean;
}

export const PreguntaTexto: React.FC<PreguntaTextoProps> = ({
    label,
    value,
    onChange,
    placeholder,
    multiline = false,
    required = false
}) => {
    const handleChange = (text: string) => {
        onChange({ respuesta: text });
    };

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            {multiline ? (
                <Textarea
                    value={value?.respuesta || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                />
            ) : (
                <Input
                    value={value?.respuesta || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

interface PreguntaMixtoProps {
    label: string;
    detalleLabel: string;
    value?: RespuestaMixto;
    onChange: (value: RespuestaMixto) => void;
    placeholder?: string;
    required?: boolean;
}

export const PreguntaMixto: React.FC<PreguntaMixtoProps> = ({
    label,
    detalleLabel,
    value,
    onChange,
    placeholder,
    required = false
}) => {
    const handleRespuestaChange = (respuesta: boolean) => {
        onChange({
            respuesta,
            detalle: respuesta ? value?.detalle || '' : ''
        });
    };

    const handleDetalleChange = (detalle: string) => {
        onChange({
            respuesta: value?.respuesta || false,
            detalle
        });
    };

    return (
        <Card className="p-4">
            <CardContent className="p-0 space-y-4">
                <div className="space-y-3">
                    <Label className="text-sm font-medium">
                        {label} {required && <span className="text-destructive">*</span>}
                    </Label>
                    <RadioGroup
                        value={value?.respuesta?.toString() || ''}
                        onValueChange={(val: string) => handleRespuestaChange(val === 'true')}
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

                {value?.respuesta && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary">
                        <Label className="text-sm font-medium text-muted-foreground">
                            {detalleLabel}
                        </Label>
                        <Input
                            value={value?.detalle || ''}
                            onChange={(e) => handleDetalleChange(e.target.value)}
                            placeholder={placeholder}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};