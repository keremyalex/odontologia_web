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

// Interfaces para el cuestionario odontológico
export interface DolorDental {
    ha_tenido_dolor?: boolean;
    dolor_tipo_intensidad?: string[];
    dolor_frecuencia?: string[];
    dolor_provocado?: string[];
    dolor_irradiado?: boolean;
    dolor_irradiado_hacia_donde?: string;
    dolor_puede_calmarlo_con_algo?: string;
}

export interface TipoLesionesDentales {
    manchas?: boolean;
    abultamiento_tejidos?: boolean;
    ulceraciones?: boolean;
    ampollas?: boolean;
    otros?: boolean;
}

export interface CuestionarioOdontologico {
    por_que_asistio_a_la_consulta?: string;
    consulto_antes_con_algun_otro_profesional?: boolean;
    tomo_algun_medicamento?: boolean;
    nombre_de_los_medicamentos?: string;
    desde_cuando_medicamentos?: string;
    obtuvo_resultados_medicamentos?: boolean;
    
    dolor?: DolorDental;
    
    sufrio_golpe_en_los_dientes?: boolean;
    golpe_en_dientes_cuando?: string;
    golpe_en_dientes_como_se_produjo?: string;
    se_le_fracturo_algun_diente?: boolean;
    fractura_diente_cual?: string;
    fractura_diente_recibio_tratamiento?: string;
    
    tiene_dificultad_para_hablar?: boolean;
    tiene_dificultad_para_masticar?: boolean;
    tiene_dificultad_para_abrir_la_boca?: boolean;
    tiene_dificultad_para_tragar_alimentos?: boolean;
    
    ha_observado_algo_anormal_labios?: string;
    ha_observado_algo_anormal_lengua?: string;
    ha_observado_algo_anormal_paladar?: string;
    ha_observado_algo_anormal_piso_boca?: string;
    ha_observado_algo_anormal_carrillos?: string;
    ha_observado_algo_anormal_otras_zonas?: string;
    
    tipo_de_lesiones_presenta?: TipoLesionesDentales;
    
    le_sangran_las_encias?: boolean;
    le_sangran_las_encias_cuando?: string;
    
    sale_pus_de_algun_lugar_de_su_boca?: boolean;
    sale_pus_de_donde?: string;
    
    tiene_movilidad_en_sus_dientes?: boolean;
    al_morder_siente_altos_los_dientes?: boolean;
    
    ha_tenido_la_cara_hinchada?: boolean;
    tratamiento_cara_hinchada?: string;
    
    momentos_de_azucar_diario?: string;
    indice_de_placa?: string;
    estado_de_la_higiene_bucal?: 'Muy bueno' | 'Bueno' | 'Deficiente' | 'Malo';
}

export interface HistoriaClinica {
    id?: number;
    pacienteId: number;
    cuestionario: CuestionarioCompleto | CuestionarioWrapper | string;
    cuestionarioOdontologico?: CuestionarioOdontologico | string; // camelCase como espera el backend
    odontograma?: any; // Campo para el odontograma
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

// Interfaces para Sistema de Especialidades y Horarios

export interface Especialidad {
    id: number;
    nombre: string;
    descripcion?: string;
    createdAt: Date;
    updatedAt: Date;
    franjasHorarias?: FranjaHoraria[];
}

export interface CreateEspecialidadDto {
    nombre: string;
    descripcion?: string;
}

export interface UpdateEspecialidadDto {
    nombre?: string;
    descripcion?: string;
}

export interface HorarioClinica {
    id: number;
    diasSemana: number[]; // Array de días [1,2,3,4,5] (1=Lunes, 7=Domingo)
    horaApertura: string; // Formato "HH:MM"
    horaCierre: string; // Formato "HH:MM"
    activo: boolean;
    descripcion?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateHorarioClinicaDto {
    diasSemana: number[];
    horaApertura: string;
    horaCierre: string;
    activo?: boolean;
    descripcion?: string;
}

export interface UpdateHorarioClinicaDto {
    diasSemana?: number[];
    horaApertura?: string;
    horaCierre?: string;
    activo?: boolean;
    descripcion?: string;
}

export interface FranjaHoraria {
    id: number;
    diaSemana: number; // Día específico (1-7)
    especialidadId: number;
    responsableId: number;
    horaInicio: string; // Formato "HH:MM"
    horaFin: string; // Formato "HH:MM"
    duracionCitaMin: number; // default: 30
    estado: 'activo' | 'inactivo' | 'suspendido';
    observaciones?: string;
    createdAt: Date;
    updatedAt: Date;
    especialidad?: Especialidad;
    responsable?: User;
}

export interface CreateFranjaHorariaDto {
    diaSemana: number;
    especialidadId: number;
    responsableId: number;
    horaInicio: string;
    horaFin: string;
    duracionCitaMin?: number;
    estado?: 'activo' | 'inactivo' | 'suspendido';
    observaciones?: string;
}

export interface UpdateFranjaHorariaDto {
    diaSemana?: number;
    especialidadId?: number;
    responsableId?: number;
    horaInicio?: string;
    horaFin?: string;
    duracionCitaMin?: number;
    estado?: 'activo' | 'inactivo' | 'suspendido';
    observaciones?: string;
}

export interface FranjaHorariaFilters {
    dia?: number;
    especialidad?: number;
    responsable?: number;
}

// Constantes para días de la semana
export const DIAS_SEMANA = {
    1: 'Lunes',
    2: 'Martes', 
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado',
    7: 'Domingo'
} as const;

export const ESTADOS_FRANJA = {
    activo: 'Activo',
    inactivo: 'Inactivo', 
    suspendido: 'Suspendido'
} as const;