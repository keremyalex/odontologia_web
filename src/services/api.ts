import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
    User,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    Paciente,
    Turno,
    HistoriaClinica
} from '@/types';

const API_BASE_URL = 'http://localhost:3000/api';

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
}

export const apiService = new ApiService();
export default apiService;