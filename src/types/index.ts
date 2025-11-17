export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'recepcion' | 'estudiante' | 'docente';
    creado_at?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface RegisterRequest {
    nombre: string;
    email: string;
    password: string;
    rol: 'admin' | 'recepcion' | 'estudiante' | 'docente';
}

export interface Paciente {
    id?: number;
    nombre: string;
    apellido: string;
    ci?: string;
    fechaNac?: string;
    estadoCivil?: string;
    sexo?: 'M' | 'F';
    telefono?: string;
    email?: string;
    direccion?: string;
    nacionalidad?: string;
    fechaRegistro?: string;
    tieneHistoriaClinica?: boolean;
}

export interface Turno {
    id?: number;
    pacienteId: number;
    fechaInicio: string;
    fechaFin: string;
    estado: 'pendiente' | 'confirmado' | 'atendido' | 'cancelado';
    estudianteId?: number;
    supervisorId?: number;
    consultorio?: string;
    creadoAt?: string;
    // Datos relacionados para mostrar
    paciente?: Paciente;
    estudiante?: User;
    supervisor?: User;
}

// Tipos para el cuestionario médico
export type TipoRespuesta = 'si_no' | 'texto' | 'mixto';

export interface RespuestaSiNo {
    respuesta: boolean;
}

export interface RespuestaTexto {
    respuesta?: string;
}

export interface RespuestaMixto {
    respuesta: boolean;
    detalle?: string;
}

export interface AntecedentesFamiliares {
    padreConVida?: RespuestaSiNo;
    enfermedadPadre?: RespuestaTexto;
    madreConVida?: RespuestaSiNo;
    enfermedadMadre?: RespuestaTexto;
    hermanos?: RespuestaMixto;
    sufreEnfermedad?: RespuestaMixto;
    haceTratamientoMedico?: RespuestaMixto;
    medicamentosHabituales?: RespuestaTexto;
    medicamentosUltimos5Anos?: RespuestaTexto;
}

export interface HabitosYAntecedentesMedicos {
    realizaDeporte?: RespuestaSiNo;
    malestarDeporte?: RespuestaSiNo;
    alergiaDroga?: RespuestaSiNo;
    alergiaAnestesia?: RespuestaSiNo;
    alergiaPenicilina?: RespuestaSiNo;
    alergiaOtrosMedicamentos?: RespuestaTexto;
    cicatrizaBien?: RespuestaSiNo;
    sangraMucho?: RespuestaSiNo;
    problemaColageno?: RespuestaSiNo;
    fiebreReumatica?: RespuestaSiNo;
    seEncuentraConMedicacion?: RespuestaTexto;
    esDiabetico?: RespuestaSiNo;
    diabetesControlada?: RespuestaMixto;
    problemaCardiaco?: RespuestaMixto;
    tomaAspirinaAnticoagulante?: RespuestaMixto;
    presionAlta?: RespuestaSiNo;
    chagas?: RespuestaSiNo;
    tratamientoChagas?: RespuestaSiNo;
    problemasRenales?: RespuestaSiNo;
    ulceraGastrica?: RespuestaSiNo;
    tuvoHepatitis?: RespuestaSiNo;
    tipoHepatitis?: RespuestaTexto;
    problemaHepatico?: RespuestaMixto;
    tuvoConvulsiones?: RespuestaSiNo;
    esEpileptico?: RespuestaSiNo;
    medicacionQueToma?: RespuestaTexto;
    sifilis?: RespuestaSiNo;
    otraEnfermedadInfectocontagiosa?: RespuestaSiNo;
    tuvoTransfusiones?: RespuestaSiNo;
    fueOperado?: RespuestaMixto;
    problemaRespiratorio?: RespuestaMixto;
    fuma?: RespuestaSiNo;
    estaEmbarazada?: RespuestaMixto;
    otraEnfermedadRecomendacion?: RespuestaTexto;
    tratamientoHomeopatico?: RespuestaMixto;
    medicoClinico?: RespuestaTexto;
    clinicaHospital?: RespuestaTexto;
}

export interface CuestionarioCompleto {
    antecedentesFamiliares?: AntecedentesFamiliares;
    habitosYAntecedentesMedicos?: HabitosYAntecedentesMedicos;
}

export interface CuestionarioWrapper {
    data: CuestionarioCompleto;
    tipo: string;
    version: string;
    fechaCreacion: string;
}

export interface HistoriaClinica {
    id?: number;
    pacienteId: number;
    cuestionario: CuestionarioCompleto | CuestionarioWrapper | string;
    fecha?: string;
    profesionalId?: number;
    observaciones?: string;
    paciente?: Paciente;
    profesional?: User;
}

export interface ApiError {
    message: string;
    statusCode: number;
}