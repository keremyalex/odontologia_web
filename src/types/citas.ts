// Interfaces para el sistema de citas

export const CitaEstado = {
  PROGRAMADA: 'programada',
  ATENDIDA: 'atendida',
  CANCELADA: 'cancelada',
  NO_ASISTIO: 'no_asistio',
  REPROGRAMADA: 'reprogramada'
} as const;

export type CitaEstado = typeof CitaEstado[keyof typeof CitaEstado];

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  ci: string;
  telefono?: string;
  email?: string;
}

export interface Cita {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: CitaEstado;
  motivoConsulta: string;
  observaciones?: string;
  pacienteId: number;
  franjaId: number;
  paciente: Paciente;
  franja: FranjaHorariaDetalle;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

export interface FranjaHorariaDetalle {
  id: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  duracionCitaMin: number;
  cuposMaximos?: number; // Límite manual opcional
  cuposCalculados: number; // Calculado automáticamente
  activo: boolean;
  especialidad: {
    id: number;
    nombre: string;
  };
  responsable: {
    id: number;
    nombre: string;
  };
}

export interface SlotDisponible {
  inicio: string;
  fin: string;
}

export interface SlotOcupado {
  inicio: string;
  fin: string;
  cita: {
    id: number;
    paciente: string;
  };
}

export interface DisponibilidadResponse {
  franja: {
    id: number;
    especialidad: string;
    horaInicio: string;
    horaFin: string;
    duracionCita: number;
  };
  fecha: string;
  totalSlots: number;
  slotsDisponibles: number;
  slotsOcupados: number;
  slots: {
    disponibles: SlotDisponible[];
    ocupados: SlotOcupado[];
  };
}

// DTOs para formularios
export interface CrearCitaDto {
  pacienteId: number;
  franjaId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivoConsulta: string;
  observaciones?: string;
}

export interface UpdateCitaDto {
  franjaId?: number;
  fecha?: string;
  horaInicio?: string;
  horaFin?: string;
  motivoConsulta?: string;
  observaciones?: string;
}

export interface ReagendarCitaDto {
  franjaId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivoReagendamiento: string;
}

export interface CambiarEstadoCitaDto {
  estado: CitaEstado;
  observaciones?: string;
}

// Filtros para consultas
export interface FiltrosCitas {
  especialidadId?: number;
  responsableId?: number;
  pacienteId?: number;
  estado?: CitaEstado;
  fechaInicio?: string;
  fechaFin?: string;
}

// Para el calendario
export interface CitaCalendario {
  id: number;
  title: string;
  start: string;
  end: string;
  color?: string;
  estado: CitaEstado;
  paciente: string;
  especialidad: string;
  responsable: string;
}

// Estadísticas
export interface EstadisticasCitas {
  totalCitas: number;
  citasProgramadas: number;
  citasAtendidas: number;
  citasCanceladas: number;
  citasNoAsistio: number;
  citasReprogramadas: number;
  porcentajeOcupacion: number;
}