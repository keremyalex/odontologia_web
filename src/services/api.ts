import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
    User,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    Paciente,
    Turno,
    HistoriaClinica,
    Especialidad
} from '@/types';

import type {
    Cita,
    CrearCitaDto,
    UpdateCitaDto,
    ReagendarCitaDto,
    CambiarEstadoCitaDto,
    FiltrosCitas,
    DisponibilidadResponse
} from '@/types/citas';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para agregar el token JWT
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Interceptor para manejar errores de autenticación
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Métodos de autenticación
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', data);
        return response.data;
    }

    async register(data: RegisterRequest): Promise<LoginResponse> {
        const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/register', data);
        return response.data;
    }

    async setupAdmin(data: RegisterRequest): Promise<LoginResponse> {
        const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/setup-admin', data);
        return response.data;
    }

    async getUsers(): Promise<User[]> {
        const response: AxiosResponse<any> = await this.api.get('/auth/users');
        console.log('🔍 Respuesta getUsers del backend:', response.data);
        
        // El backend puede devolver {success: true, data: [...]} o directamente un array
        let users = [];
        if (response.data) {
            if (response.data.success && Array.isArray(response.data.data)) {
                users = response.data.data;
            } else if (Array.isArray(response.data)) {
                users = response.data;
            }
        }
        
        // Mapear y normalizar los datos de usuarios
        const usuariosMapeados = users.map((user: any) => ({
            id: user.id,
            nombre: user.nombre || user.name || 'Sin nombre',
            email: user.email,
            rol: user.rol || user.role || 'estudiante',
            creado_at: user.creadoAt || user.creado_at || user.createdAt || user.created_at || user.fechaRegistro || user.fechaCreacion
        }));
        
        console.log('✅ Usuarios mapeados:', usuariosMapeados);
        return usuariosMapeados;
    }

    // Métodos de pacientes
    async getPacientes(search?: string): Promise<Paciente[]> {
        const params = search ? { search } : {};
        const response: AxiosResponse<Paciente[]> = await this.api.get('/pacientes', { params });
        return response.data;
    }

    async getPaciente(id: number): Promise<Paciente> {
        const response: AxiosResponse<Paciente> = await this.api.get(`/pacientes/${id}`);
        return response.data;
    }

    async createPaciente(data: Paciente): Promise<Paciente> {
        const response: AxiosResponse<Paciente> = await this.api.post('/pacientes', data);
        return response.data;
    }

    async updatePaciente(id: number, data: Partial<Paciente>): Promise<Paciente> {
        const response: AxiosResponse<Paciente> = await this.api.patch(`/pacientes/${id}`, data);
        return response.data;
    }

    async deletePaciente(id: number): Promise<void> {
        await this.api.delete(`/pacientes/${id}`);
    }

    // Métodos de turnos
    async getTurnos(): Promise<Turno[]> {
        const response: AxiosResponse<Turno[]> = await this.api.get('/turnos');
        return response.data;
    }

    async getTurno(id: number): Promise<Turno> {
        const response: AxiosResponse<Turno> = await this.api.get(`/turnos/${id}`);
        return response.data;
    }

    async createTurno(data: Turno): Promise<Turno> {
        const response: AxiosResponse<Turno> = await this.api.post('/turnos', data);
        return response.data;
    }

    async updateTurno(id: number, data: Partial<Turno>): Promise<Turno> {
        const response: AxiosResponse<Turno> = await this.api.patch(`/turnos/${id}`, data);
        return response.data;
    }

    async checkinTurno(id: number): Promise<Turno> {
        const response: AxiosResponse<Turno> = await this.api.patch(`/turnos/${id}/checkin`);
        return response.data;
    }

    async deleteTurno(id: number): Promise<void> {
        await this.api.delete(`/turnos/${id}`);
    }

    // Métodos de historias clínicas
    async getHistoriasClinicas(): Promise<HistoriaClinica[]> {
        const response: AxiosResponse<HistoriaClinica[]> = await this.api.get('/historias');
        return response.data;
    }

    async getHistoriaClinica(id: number): Promise<HistoriaClinica> {
        const response: AxiosResponse<HistoriaClinica> = await this.api.get(`/historias/${id}`);
        return response.data;
    }

    async getHistoriasPorPaciente(pacienteId: number): Promise<HistoriaClinica[]> {
        const response: AxiosResponse<HistoriaClinica[]> = await this.api.get(`/historias/paciente/${pacienteId}`);
        return response.data;
    }

    async createHistoriaClinica(data: HistoriaClinica): Promise<HistoriaClinica> {
        const response: AxiosResponse<HistoriaClinica> = await this.api.post('/historias', data);
        return response.data;
    }

    async updateHistoriaClinica(id: number, data: Partial<HistoriaClinica>): Promise<HistoriaClinica> {
        const response: AxiosResponse<HistoriaClinica> = await this.api.patch(`/historias/${id}`, data);
        return response.data;
    }

    // Métodos de especialidades
    async getEspecialidades(): Promise<Especialidad[]> {
        const response = await this.api.get('/especialidades');
        return response.data;
    }

    async getEspecialidad(id: number): Promise<any> {
        const response = await this.api.get(`/especialidades/${id}`);
        return response.data;
    }

    async createEspecialidad(data: any): Promise<any> {
        const response = await this.api.post('/especialidades', data);
        return response.data;
    }

    async updateEspecialidad(id: number, data: any): Promise<any> {
        const response = await this.api.patch(`/especialidades/${id}`, data);
        return response.data;
    }

    async deleteEspecialidad(id: number): Promise<void> {
        await this.api.delete(`/especialidades/${id}`);
    }

    // Métodos de horarios de clínica
    async getHorariosClinica(): Promise<any[]> {
        const response = await this.api.get('/horarios/clinica');
        return response.data;
    }

    async getHorarioClinica(id: number): Promise<any> {
        const response = await this.api.get(`/horarios/clinica/${id}`);
        return response.data;
    }

    async createHorarioClinica(data: any): Promise<any> {
        const response = await this.api.post('/horarios/clinica', data);
        return response.data;
    }

    async updateHorarioClinica(id: number, data: any): Promise<any> {
        const response = await this.api.patch(`/horarios/clinica/${id}`, data);
        return response.data;
    }

    async deleteHorarioClinica(id: number): Promise<void> {
        await this.api.delete(`/horarios/clinica/${id}`);
    }

    // Métodos de franjas horarias
    async getFranjasHorarias(params?: any): Promise<any[]> {
        const response = await this.api.get('/horarios/franjas', { params });
        return response.data;
    }

    async getFranjaHoraria(id: number): Promise<any> {
        const response = await this.api.get(`/horarios/franjas/${id}`);
        return response.data;
    }

    async createFranjaHoraria(data: any): Promise<any> {
        const response = await this.api.post('/horarios/franjas', data);
        return response.data;
    }

    async updateFranjaHoraria(id: number, data: any): Promise<any> {
        const response = await this.api.patch(`/horarios/franjas/${id}`, data);
        return response.data;
    }

    async deleteFranjaHoraria(id: number): Promise<void> {
        await this.api.delete(`/horarios/franjas/${id}`);
    }

    // Método para obtener usuarios docentes
    async getDocentes(): Promise<any[]> {
        const response = await this.api.get('/auth/users?rol=docente');
        return response.data;
    }

    // === MÉTODOS DE CITAS ===

    // Obtener todas las citas con filtros opcionales
    async getCitas(filtros?: FiltrosCitas): Promise<Cita[]> {
        const params: any = {};
        if (filtros?.especialidadId) params.especialidadId = filtros.especialidadId;
        if (filtros?.responsableId) params.responsableId = filtros.responsableId;
        if (filtros?.pacienteId) params.pacienteId = filtros.pacienteId;
        if (filtros?.estado) params.estado = filtros.estado;
        if (filtros?.fechaInicio) params.fechaInicio = filtros.fechaInicio;
        if (filtros?.fechaFin) params.fechaFin = filtros.fechaFin;

        console.log('API getCitas - Parámetros enviados:', params);
        const response: AxiosResponse<Cita[]> = await this.api.get('/citas', { params });
        console.log('API getCitas - Respuesta recibida:', response.data);
        return response.data;
    }

    // Obtener una cita específica
    async getCita(id: number): Promise<Cita> {
        const response: AxiosResponse<Cita> = await this.api.get(`/citas/${id}`);
        return response.data;
    }

    // Crear nueva cita
    async createCita(data: CrearCitaDto): Promise<Cita> {
        const response: AxiosResponse<Cita> = await this.api.post('/citas', data);
        return response.data;
    }

    // Actualizar cita existente
    async updateCita(id: number, data: UpdateCitaDto): Promise<Cita> {
        const response: AxiosResponse<Cita> = await this.api.patch(`/citas/${id}`, data);
        return response.data;
    }

    // Eliminar cita
    async deleteCita(id: number): Promise<void> {
        await this.api.delete(`/citas/${id}`);
    }

    // Verificar disponibilidad de una franja horaria
    async getDisponibilidad(franjaId: number, fecha: string): Promise<DisponibilidadResponse> {
        const response: AxiosResponse<DisponibilidadResponse> = await this.api.get(`/citas/disponibilidad/${franjaId}?fecha=${fecha}`);
        return response.data;
    }

    // Obtener citas de un paciente específico
    async getCitasPorPaciente(pacienteId: number): Promise<Cita[]> {
        const response: AxiosResponse<Cita[]> = await this.api.get(`/citas/paciente/${pacienteId}`);
        return response.data;
    }

    // Obtener citas de una fecha específica
    async getCitasPorFecha(fecha: string): Promise<Cita[]> {
        const response: AxiosResponse<Cita[]> = await this.api.get(`/citas/fecha/${fecha}`);
        return response.data;
    }

    // Obtener citas de un responsable
    async getCitasPorResponsable(responsableId: number, fecha?: string): Promise<Cita[]> {
        const params = fecha ? { fecha } : {};
        const response: AxiosResponse<Cita[]> = await this.api.get(`/citas/responsable/${responsableId}`, { params });
        return response.data;
    }

    // Obtener citas en un rango de fechas
    async getCitasRango(fechaInicio: string, fechaFin: string): Promise<Cita[]> {
        const response: AxiosResponse<Cita[]> = await this.api.get(`/citas/rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
        return response.data;
    }

    // Reagendar una cita
    async reagendarCita(id: number, data: ReagendarCitaDto): Promise<Cita> {
        const response: AxiosResponse<Cita> = await this.api.patch(`/citas/${id}/reagendar`, data);
        return response.data;
    }

    // Cambiar estado de una cita
    async cambiarEstadoCita(id: number, data: CambiarEstadoCitaDto): Promise<Cita> {
        const response: AxiosResponse<Cita> = await this.api.patch(`/citas/${id}/estado`, data);
        return response.data;
    }

    // === MÉTODOS DE ODONTOGRAMA ===

    // Obtener odontograma de una historia clínica
    async getOdontograma(historiaId: number): Promise<any> {
        const response = await this.api.get(`/odontogramas/historia/${historiaId}/latest`);
        return response.data;
    }

    // Guardar/actualizar odontograma
    async saveOdontograma(historiaId: number, data: { dientes: any[], observaciones?: string }): Promise<any> {
        const response = await this.api.post(`/odontogramas/historia/${historiaId}/guardar`, data);
        return response.data;
    }

    // Obtener estadísticas del odontograma
    async getOdontogramaEstadisticas(historiaId: number): Promise<any> {
        const response = await this.api.get(`/odontogramas/historia/${historiaId}/estadisticas`);
        return response.data;
    }

    // Obtener historial de versiones del odontograma
    async getOdontogramaHistorial(historiaId: number): Promise<any> {
        const response = await this.api.get(`/odontogramas/historia/${historiaId}`);
        return response.data;
    }

    // === MÉTODOS DE ATENCIONES ===

    // Obtener todas las atenciones
    async getAtenciones(): Promise<any> {
        try {
            // Intentar primero con populate
            let response;
            try {
                response = await this.api.get('/atenciones?populate=true');
            } catch (populateError) {
                // Si falla, intentar con include
                try {
                    response = await this.api.get('/atenciones?include=cita,paciente,franja,especialidad,responsable');
                } catch (includeError) {
                    // Si falla, usar el endpoint básico
                    response = await this.api.get('/atenciones');
                }
            }
            
            console.log('getAtenciones - Respuesta completa:', response.data);
            
            // El backend devuelve {success: true, data: [...]} o directamente un array
            let atenciones = [];
            if (response.data) {
                if (response.data.success && Array.isArray(response.data.data)) {
                    atenciones = response.data.data;
                } else if (Array.isArray(response.data)) {
                    atenciones = response.data;
                }
            }
            
            // Debug: Verificar estructura de datos
            if (atenciones.length > 0) {
                console.log('Primera atención para debug:', JSON.stringify(atenciones[0], null, 2));
                if (atenciones[0].cita) {
                    console.log('Estructura de cita:', JSON.stringify(atenciones[0].cita, null, 2));
                    if (atenciones[0].cita.franja) {
                        console.log('Estructura de franja:', JSON.stringify(atenciones[0].cita.franja, null, 2));
                    }
                }
            }
            
            // Obtener solo especialidades para mapear correctamente
            let especialidades: any[] = [];
            
            try {
                especialidades = await this.getEspecialidades();
            } catch (error) {
                console.log('No se pudieron obtener especialidades para mapeo');
            }
            
            // Mapear y normalizar los datos para consistencia
            const atencionesMapeadas = atenciones.map((atencion: any) => {
                let especialidad = null;
                
                // Buscar especialidad - manejar diferentes estructuras de datos
                let especialidadId = null;
                
                // Intentar obtener el ID de especialidad de diferentes lugares
                if (atencion.cita?.franja?.especialidadId) {
                    especialidadId = atencion.cita.franja.especialidadId;
                } else if (atencion.cita?.franja?.especialidad?.id) {
                    especialidadId = atencion.cita.franja.especialidad.id;
                } else if (atencion.cita?.especialidadId) {
                    especialidadId = atencion.cita.especialidadId;
                }
                
                // Si ya existe el objeto especialidad completo, usarlo
                if (atencion.cita?.franja?.especialidad?.nombre) {
                    especialidad = atencion.cita.franja.especialidad;
                } else if (especialidadId && especialidades.length > 0) {
                    // Buscar en la lista de especialidades obtenida
                    especialidad = especialidades.find((esp: any) => esp.id === especialidadId) || {
                        id: especialidadId,
                        nombre: 'Especialidad no disponible'
                    };
                }

                return {
                    ...atencion,
                    cita: atencion.cita ? {
                        ...atencion.cita,
                        paciente: atencion.cita.paciente ? {
                            ...atencion.cita.paciente,
                            // Normalizar campos de nombre (el backend usa singular, el frontend espera plural)
                            nombres: atencion.cita.paciente.nombre || atencion.cita.paciente.nombres,
                            apellidos: atencion.cita.paciente.apellido || atencion.cita.paciente.apellidos
                        } : null,
                        franja: atencion.cita.franja ? {
                            ...atencion.cita.franja,
                            especialidad,
                            // Para el responsable, usar los datos de atencionPor como fallback
                            responsable: atencion.atencionPor ? {
                                id: atencion.atencionPor.id,
                                nombres: atencion.atencionPor.nombre || atencion.atencionPor.nombres,
                                apellidos: atencion.atencionPor.apellido || atencion.atencionPor.apellidos || ''
                            } : {
                                id: atencion.cita.franja.responsableId || 0,
                                nombres: 'Responsable',
                                apellidos: 'no disponible'
                            }
                        } : null
                    } : null,
                    // Normalizar el campo atencionPor también
                    atencionPor: atencion.atencionPor ? {
                        ...atencion.atencionPor,
                        nombres: atencion.atencionPor.nombre || atencion.atencionPor.nombres,
                        apellidos: atencion.atencionPor.apellido || atencion.atencionPor.apellidos || ''
                    } : null
                };
            });
            
            return {
                success: true,
                data: atencionesMapeadas
            };
        } catch (error: any) {
            console.error('Error al obtener atenciones:', error);
            console.error('Error response:', error.response);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cargar atenciones',
                data: []
            };
        }
    }

    // Obtener atención específica
    async getAtencion(id: number): Promise<any> {
        const response = await this.api.get(`/atenciones/${id}`);
        return response.data;
    }

    // Crear nueva atención
    async createAtencion(data: any): Promise<any> {
        console.log('📤 Enviando datos de atención al backend:', JSON.stringify(data, null, 2));
        
        // Transformar los datos para que coincidan con el formato del backend
        const backendData = {
            citaId: data.citaId,
            diagnosticoPresuntivo: data.diagnosticoPresuntivo,
            planTratamiento: data.planTratamiento,
            observaciones: data.observaciones,
            estadoBucalGeneral: {
                presenciaSarro: data.estadoBucalGeneral.presenciaSarro,
                enfermedadPeriodontal: data.estadoBucalGeneral.enfermedadPeriodontal,
                higieneBucal: data.estadoBucalGeneral.higieneBucal,
                otros: data.estadoBucalGeneral.otros
            }
        };
        
        console.log('🔄 Datos transformados para el backend:', JSON.stringify(backendData, null, 2));
        
        try {
            const response = await this.api.post('/atenciones', backendData);
            console.log('✅ Atención creada exitosamente:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Error al crear atención:');
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Error Data:', error.response?.data);
            console.error('Request Data:', JSON.stringify(backendData, null, 2));
            
            // Si hay detalles del error del backend, los mostramos
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            
            throw error;
        }
    }

    // Actualizar atención
    async updateAtencion(id: number, data: any): Promise<any> {
        const response = await this.api.patch(`/atenciones/${id}`, data);
        return response.data;
    }

    // Eliminar atención
    async deleteAtencion(id: number): Promise<void> {
        await this.api.delete(`/atenciones/${id}`);
    }

    // Obtener atenciones por paciente
    async getAtencionesPorPaciente(pacienteId: number): Promise<any> {
        console.log('📤 Solicitando atenciones para paciente ID:', pacienteId);
        
        try {
            const response = await this.api.get(`/atenciones/paciente/${pacienteId}`);
            console.log('✅ Respuesta del backend - atenciones por paciente:');
            console.log('Status:', response.status);
            console.log('Data:', JSON.stringify(response.data, null, 2));
            console.log('Tipo de data:', typeof response.data);
            console.log('Es array:', Array.isArray(response.data));
            
            // El backend devuelve { success: true, data: [...] }
            // Necesitamos extraer solo el array 'data'
            if (response.data && response.data.success && response.data.data) {
                console.log('🔄 Extrayendo array de datos:', response.data.data);
                return response.data.data;
            }
            
            // Fallback si el formato es diferente
            return Array.isArray(response.data) ? response.data : [];
        } catch (error: any) {
            console.error('❌ Error al obtener atenciones por paciente:');
            console.error('Status:', error.response?.status);
            console.error('Error Data:', error.response?.data);
            throw error;
        }
    }

    // Obtener atenciones por historia clínica
    async getAtencionesPorHistoria(historiaId: number): Promise<any> {
        const response = await this.api.get(`/atenciones/historia/${historiaId}`);
        return response.data;
    }

    // Obtener atención por cita
    async getAtencionPorCita(citaId: number): Promise<any> {
        const response = await this.api.get(`/atenciones/cita/${citaId}`);
        return response.data;
    }

    // Obtener mis atenciones (del usuario logueado)
    async getMisAtenciones(): Promise<any> {
        const response = await this.api.get('/atenciones/mis-atenciones');
        return response.data;
    }

    // Obtener estadísticas de atenciones
    async getEstadisticasAtenciones(): Promise<any> {
        const response = await this.api.get('/atenciones/estadisticas');
        return response.data;
    }

    // Obtener citas pendientes de atención
    async getCitasPendientesAtencion(): Promise<any> {
        try {
            // Intentar primero con el endpoint específico
            const response = await this.api.get('/citas/pendientes-atencion');
            console.log('Respuesta citas pendientes:', response.data);
            
            // Extraer datos según la estructura del backend
            let citas = [];
            if (response.data) {
                if (response.data.success && Array.isArray(response.data.data)) {
                    citas = response.data.data;
                } else if (Array.isArray(response.data)) {
                    citas = response.data;
                }
            }
            
            // Mapear los datos para asegurar consistencia
            const citasMapeadas = citas.map((cita: any) => ({
                ...cita,
                paciente: {
                    ...cita.paciente,
                    nombres: cita.paciente?.nombres || cita.paciente?.nombre || 'Sin nombre',
                    apellidos: cita.paciente?.apellidos || cita.paciente?.apellido || 'Sin apellido',
                    ci: cita.paciente?.ci || cita.paciente?.cedula || '',
                    telefono: cita.paciente?.telefono || ''
                },
                franja: {
                    ...cita.franja,
                    especialidad: {
                        ...cita.franja?.especialidad,
                        nombre: cita.franja?.especialidad?.nombre || 'No especificada'
                    },
                    responsable: {
                        ...cita.franja?.responsable,
                        nombres: cita.franja?.responsable?.nombres || cita.franja?.responsable?.nombre || 'N/A',
                        apellidos: cita.franja?.responsable?.apellidos || cita.franja?.responsable?.apellido || ''
                    }
                }
            }));
            
            return {
                success: true,
                data: citasMapeadas
            };
        } catch (error: any) {
            // Si falla, usar el endpoint de citas con filtro de estado
            console.log('Endpoint pendientes-atencion no disponible, usando filtro por estado');
            try {
                const response = await this.api.get('/citas', {
                    params: { estado: 'programada' }
                });
                
                console.log('Respuesta citas con filtro:', response.data);
                
                // Extraer datos según la estructura del backend
                let citas = [];
                if (response.data) {
                    if (response.data.success && Array.isArray(response.data.data)) {
                        citas = response.data.data;
                    } else if (Array.isArray(response.data)) {
                        citas = response.data;
                    }
                }
                
                // Mapear los datos al formato esperado por CitaPendienteAtencion
                const citasMapeadas = citas.map((cita: any) => ({
                    ...cita,
                    paciente: {
                        ...cita.paciente,
                        nombres: cita.paciente?.nombres || cita.paciente?.nombre || 'Sin nombre',
                        apellidos: cita.paciente?.apellidos || cita.paciente?.apellido || 'Sin apellido',
                        ci: cita.paciente?.ci || cita.paciente?.cedula || '',
                        telefono: cita.paciente?.telefono || ''
                    },
                    franja: {
                        ...cita.franja,
                        especialidad: {
                            ...cita.franja?.especialidad,
                            nombre: cita.franja?.especialidad?.nombre || 'No especificada'
                        },
                        responsable: {
                            ...cita.franja?.responsable,
                            nombres: cita.franja?.responsable?.nombres || cita.franja?.responsable?.nombre || 'N/A',
                            apellidos: cita.franja?.responsable?.apellidos || cita.franja?.responsable?.apellido || ''
                        }
                    }
                }));
                
                return {
                    success: true,
                    data: citasMapeadas
                };
            } catch (fallbackError: any) {
                console.error('Error al cargar citas pendientes:', fallbackError);
                return {
                    success: false,
                    error: fallbackError.response?.data?.message || 'Error al cargar citas pendientes',
                    data: []
                };
            }
        }
    }
}

export const apiService = new ApiService();
export default apiService;