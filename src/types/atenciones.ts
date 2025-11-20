// Tipos para el sistema de atenciones

export interface SignosVitales {
    presionArterial: string;
    temperatura: number;
    frecuenciaCardiaca: number;
    observaciones?: string;
}

export interface EstadoBucalGeneral {
    presenciaSarro: boolean;
    enfermedadPeriodontal: boolean;
    presenciaCaries: boolean;
    higieneBucal: 'muy_bueno' | 'bueno' | 'deficiente' | 'malo';
    otros?: string;
}

export interface Atencion {
    id: number;
    citaId: number;
    historiaId: number;
    diagnosticoPresuntivo: string;
    planTratamiento: string;
    observaciones?: string;
    estadoBucalGeneral: EstadoBucalGeneral;
    signosVitales?: SignosVitales; // Opcional porque el backend odontológico puede no enviarlo
    atendidoPor: number;
    fechaAtencion: string;
    actualizadoAt: string;
    
    // Relaciones expandidas (cuando vienen del backend)
    cita?: {
        id: number;
        fecha: string;
        horaInicio: string;
        horaFin: string;
        estado: string;
        paciente?: {
            id: number;
            nombres: string;
            apellidos: string;
            ci: string;
            telefono?: string;
        };
        franja?: {
            id: number;
            especialidad: {
                id: number;
                nombre: string;
            };
            responsable: {
                id: number;
                nombres: string;
                apellidos: string;
            };
        };
    };
    atencionPor?: {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        rol: string;
    };
    historia?: {
        id: number;
        pacienteId: number;
    };
}

export interface CreateAtencionDto {
    citaId: number;
    diagnosticoPresuntivo: string;
    planTratamiento: string;
    observaciones?: string;
    estadoBucalGeneral: EstadoBucalGeneral;
    signosVitales?: SignosVitales; // Opcional para atenciones odontológicas
}

export interface UpdateAtencionDto {
    diagnosticoPresuntivo?: string;
    planTratamiento?: string;
    observaciones?: string;
    estadoBucalGeneral?: EstadoBucalGeneral;
    signosVitales?: SignosVitales;
}

export interface CitaPendienteAtencion {
    id: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado: string;
    motivoConsulta?: string;
    observaciones?: string;
    paciente: {
        id: number;
        nombres: string;
        apellidos: string;
        ci: string;
        telefono?: string;
    };
    franja: {
        id: number;
        especialidad: {
            id: number;
            nombre: string;
        };
        responsable: {
            id: number;
            nombres: string;
            apellidos: string;
        };
    };
}

export interface EstadisticasAtenciones {
    totalAtenciones: number;
    atencionesPorMes: Array<{
        mes: string;
        cantidad: number;
    }>;
    atencionesPorEspecialidad: Array<{
        especialidad: string;
        cantidad: number;
    }>;
    estadoBucalStats: {
        presenciaSarro: {
            si: number;
            no: number;
        };
        enfermedadPeriodontal: {
            si: number;
            no: number;
        };
        presenciaCaries: {
            si: number;
            no: number;
        };
        higieneBucal: {
            muy_bueno: number;
            bueno: number;
            deficiente: number;
            malo: number;
        };
    };
}