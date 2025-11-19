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
        const response: AxiosResponse<User[]> = await this.api.get('/auth/users');
        return response.data;
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
}

export const apiService = new ApiService();
export default apiService;