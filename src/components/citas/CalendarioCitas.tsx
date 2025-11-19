import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import FormularioCita from './FormularioCita';
import { CitaEstado, type Cita, type FiltrosCitas } from '@/types/citas';
import type { Especialidad } from '@/types';

const ESTADOS_CITA = {
  [CitaEstado.PROGRAMADA]: { label: 'Programada', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  [CitaEstado.ATENDIDA]: { label: 'Atendida', color: 'bg-green-100 text-green-800 border-green-200' },
  [CitaEstado.CANCELADA]: { label: 'Cancelada', color: 'bg-red-100 text-red-800 border-red-200' },
  [CitaEstado.NO_ASISTIO]: { label: 'No Asistió', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  [CitaEstado.REPROGRAMADA]: { label: 'Reprogramada', color: 'bg-purple-100 text-purple-800 border-purple-200' }
};

interface CalendarioCitasProps {
  onNuevaCita?: () => void;
}

export default function CalendarioCitas({ onNuevaCita }: CalendarioCitasProps) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [filtros, setFiltros] = useState<FiltrosCitas>({});
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'create' | 'edit'>('create');
  const [citaEdicion, setCitaEdicion] = useState<Cita | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    cargarCitasDelMes();
  }, [fechaActual, filtros]);

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    try {
      const especialidadesData = await apiService.getEspecialidades();
      // No filtrar por activo ya que las especialidades del backend no lo incluyen
      setEspecialidades(especialidadesData);
    } catch (error) {
      console.error('Error al cargar especialidades:', error);
      
      // Fallback: usar especialidades de localStorage
      try {
        const especialidadesLocal = localStorage.getItem('especialidades');
        if (especialidadesLocal) {
          const especialidadesParsed = JSON.parse(especialidadesLocal);
          const especialidadesActivas = especialidadesParsed.filter((esp: any) => esp.activo !== false);
          setEspecialidades(especialidadesActivas);
        } else {
          setEspecialidades([]);
        }
      } catch (localError) {
        console.error('Error al cargar desde localStorage:', localError);
        setEspecialidades([]);
      }
      
      toast({
        title: "Error",
        description: "Error al cargar las especialidades",
        variant: "destructive"
      });
    }
  };

  const cargarCitasDelMes = async () => {
    try {
      setLoading(true);
      const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
      const ultimoDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
      
      const filtrosConFecha = {
        ...filtros,
        fechaInicio: primerDia.toISOString().split('T')[0],
        fechaFin: ultimoDia.toISOString().split('T')[0]
      };

      console.log('Cargando citas con filtros:', filtrosConFecha);
      const citasData = await apiService.getCitas(filtrosConFecha);
      console.log('Citas cargadas:', citasData);
      setCitas(citasData);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      toast({
        title: "Error",
        description: "Error al cargar las citas del calendario",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cambiarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual);
    if (direccion === 'anterior') {
      nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    }
    setFechaActual(nuevaFecha);
  };

  const obtenerDiasDelMes = () => {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const primerDiaSemana = primerDia.getDay();
    
    const dias = [];
    
    // Días del mes anterior para completar la primera semana
    for (let i = primerDiaSemana; i > 0; i--) {
      const dia = new Date(año, mes, 1 - i);
      dias.push({
        fecha: dia,
        esDelMesActual: false,
        citas: []
      });
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fecha = new Date(año, mes, dia);
      const fechaString = fecha.toISOString().split('T')[0];
      const citasDelDia = citas.filter(cita => cita.fecha === fechaString);
      
      dias.push({
        fecha,
        esDelMesActual: true,
        citas: citasDelDia
      });
    }
    
    // Días del mes siguiente para completar la última semana
    const diasCompletos = Math.ceil(dias.length / 7) * 7;
    for (let i = dias.length; i < diasCompletos; i++) {
      const dia: Date = new Date(año, mes + 1, i - dias.length + 1);
      dias.push({
        fecha: dia,
        esDelMesActual: false,
        citas: []
      });
    }
    
    return dias;
  };

  const formatearMesAño = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const esHoy = (fecha: Date) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  const handleNuevaCitaFecha = (_fecha: Date) => {
    setModoFormulario('create');
    setCitaEdicion(null);
    setMostrarFormulario(true);
  };

  const handleEditarCita = (cita: Cita) => {
    setModoFormulario('edit');
    setCitaEdicion(cita);
    setMostrarFormulario(true);
  };

  const handleGuardarCita = (citaGuardada: Cita) => {
    if (modoFormulario === 'create') {
      setCitas([...citas, citaGuardada]);
    } else {
      setCitas(citas.map(cita => 
        cita.id === citaGuardada.id ? citaGuardada : cita
      ));
    }
  };

  const diasDelMes = obtenerDiasDelMes();
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="space-y-6">
      {/* Header del Calendario */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => cambiarMes('anterior')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-2xl font-bold capitalize">
            {formatearMesAño(fechaActual)}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => cambiarMes('siguiente')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Select
            value={filtros.especialidadId?.toString() || 'all'}
            onValueChange={(value) => 
              setFiltros(prev => ({ 
                ...prev, 
                especialidadId: value === 'all' ? undefined : parseInt(value)
              }))
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por especialidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las especialidades</SelectItem>
              {especialidades.length === 0 ? (
                <SelectItem value="loading" disabled>Cargando especialidades...</SelectItem>
              ) : (
                especialidades.map(esp => (
                  <SelectItem key={esp.id} value={esp.id.toString()}>
                    {esp.nombre}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Button onClick={onNuevaCita}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Calendario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendario de Citas
          </CardTitle>
          <CardDescription>
            Vista mensual de todas las citas programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Cargando calendario...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {/* Encabezados de días de la semana */}
              {diasSemana.map(dia => (
                <div key={dia} className="p-3 text-center font-medium text-muted-foreground border-b">
                  {dia}
                </div>
              ))}

              {/* Días del calendario */}
              {diasDelMes.map((diaInfo, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-gray-200 transition-colors ${
                    diaInfo.esDelMesActual 
                      ? 'bg-white hover:bg-gray-50' 
                      : 'bg-gray-50 text-gray-400'
                  } ${
                    esHoy(diaInfo.fecha) 
                      ? 'bg-blue-50 border-blue-200' 
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${
                      esHoy(diaInfo.fecha) ? 'text-blue-600' : ''
                    }`}>
                      {diaInfo.fecha.getDate()}
                    </span>
                    
                    {diaInfo.esDelMesActual && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={() => handleNuevaCitaFecha(diaInfo.fecha)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    {diaInfo.citas.slice(0, 3).map((cita) => (
                      <div
                        key={cita.id}
                        className={`p-1 rounded text-xs cursor-pointer ${ESTADOS_CITA[cita.estado].color} border`}
                        onClick={() => handleEditarCita(cita)}
                        title={`${cita.horaInicio.substring(0, 5)} - ${cita.paciente.nombre} ${cita.paciente.apellido}`}
                      >
                        <div className="font-medium truncate">
                          {cita.horaInicio.substring(0, 5)} {cita.paciente.nombre}
                        </div>
                        <div className="truncate opacity-75">
                          {cita.franja.especialidad.nombre}
                        </div>
                      </div>
                    ))}
                    
                    {diaInfo.citas.length > 3 && (
                      <div className="text-xs text-center text-muted-foreground p-1">
                        +{diaInfo.citas.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leyenda de estados */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Estados:</span>
            {Object.entries(ESTADOS_CITA).map(([estado, config]) => (
              <Badge key={estado} className={`${config.color} border`} variant="outline">
                {config.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de cita */}
      <FormularioCita
        isOpen={mostrarFormulario}
        onClose={() => setMostrarFormulario(false)}
        onSave={handleGuardarCita}
        citaInicial={citaEdicion}
        mode={modoFormulario}
      />
    </div>
  );
}