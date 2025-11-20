import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  User as UserIcon,
  CalendarDays,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import { CitaEstado, type Cita, type FiltrosCitas } from '@/types/citas';
import type { Especialidad } from '@/types';

const ESTADOS_CITA = {
  [CitaEstado.PROGRAMADA]: { label: 'Programada', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Calendar },
  [CitaEstado.ATENDIDA]: { label: 'Atendida', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  [CitaEstado.CANCELADA]: { label: 'Cancelada', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  [CitaEstado.NO_ASISTIO]: { label: 'No Asistió', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle },
  [CitaEstado.REPROGRAMADA]: { label: 'Reprogramada', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: RefreshCw }
};

interface CitasListProps {
  onNuevaCita: () => void;
  onEditarCita: (cita: Cita) => void;
}

export default function CitasList({ onNuevaCita: _onNuevaCita, onEditarCita }: CitasListProps) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<FiltrosCitas>({});
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  
  // Usar onNuevaCita para evitar warning
  
  const { toast } = useToast();

  useEffect(() => {
    cargarDatos();
  }, [filtros]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [citasData, especialidadesData] = await Promise.all([
        apiService.getCitas(filtros),
        apiService.getEspecialidades()
      ]);
      
      setCitas(citasData);
      setEspecialidades(especialidadesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast({
        title: "Error",
        description: "Error al cargar las citas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarCita = async (citaId: number) => {
    try {
      await apiService.deleteCita(citaId);
      setCitas(citas.filter(cita => cita.id !== citaId));
      toast({
        title: "Éxito",
        description: "Cita eliminada correctamente"
      });
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      toast({
        title: "Error",
        description: "Error al eliminar la cita",
        variant: "destructive"
      });
    }
  };

  const handleCambiarEstado = async (citaId: number, nuevoEstado: CitaEstado) => {
    try {
      const citaActualizada = await apiService.cambiarEstadoCita(citaId, {
        estado: nuevoEstado,
        observaciones: `Estado cambiado a ${nuevoEstado}`
      });
      
      setCitas(citas.map(cita => 
        cita.id === citaId ? citaActualizada : cita
      ));
      
      toast({
        title: "Éxito",
        description: `Cita marcada como ${ESTADOS_CITA[nuevoEstado].label.toLowerCase()}`
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast({
        title: "Error",
        description: "Error al cambiar el estado de la cita",
        variant: "destructive"
      });
    }
  };

  const citasFiltradas = citas.filter(cita => {
    if (!searchTerm) return true;
    
    const termino = searchTerm.toLowerCase();
    return (
      cita.paciente.nombre.toLowerCase().includes(termino) ||
      cita.paciente.apellido.toLowerCase().includes(termino) ||
      cita.paciente.ci.includes(termino) ||
      cita.motivoConsulta.toLowerCase().includes(termino) ||
      cita.franja.especialidad.nombre.toLowerCase().includes(termino)
    );
  });

  const formatearFecha = (fecha: string) => {
    // Evitar problemas de zona horaria agregando la hora del mediodía
    const fechaConHora = new Date(fecha + 'T12:00:00');
    return fechaConHora.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearHora = (hora: string) => {
    return hora.substring(0, 5);
  };

  const getEstadoBadge = (estado: CitaEstado) => {
    const config = ESTADOS_CITA[estado];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border`} variant="outline">
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Cargando citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
          <CardDescription>
            Utiliza los filtros para encontrar las citas que necesitas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente, CI o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filtros.especialidadId?.toString() || 'all'}
              onValueChange={(value) => 
                setFiltros(prev => ({ 
                  ...prev, 
                  especialidadId: value === 'all' ? undefined : parseInt(value)
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las especialidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las especialidades</SelectItem>
                {especialidades.map(esp => (
                  <SelectItem key={esp.id} value={esp.id.toString()}>
                    {esp.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filtros.estado || 'all'}
              onValueChange={(value) => 
                setFiltros(prev => ({ 
                  ...prev, 
                  estado: value === 'all' ? undefined : value as CitaEstado
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(ESTADOS_CITA).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setFiltros({});
                setSearchTerm('');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de citas */}
      <div className="grid gap-4">
        {citasFiltradas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay citas disponibles</h3>
              <p className="text-muted-foreground">
                {searchTerm || Object.keys(filtros).length > 0
                  ? "No se encontraron citas que coincidan con los filtros aplicados."
                  : "Aún no hay citas registradas en el sistema."}
              </p>
            </CardContent>
          </Card>
        ) : (
          citasFiltradas.map((cita) => (
            <Card key={cita.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-lg">
                          {formatearFecha(cita.fecha)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {formatearHora(cita.horaInicio)} - {formatearHora(cita.horaFin)}
                        </span>
                      </div>
                      {getEstadoBadge(cita.estado)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Paciente</span>
                        </div>
                        <p className="font-semibold">
                          {cita.paciente.nombre} {cita.paciente.apellido}
                        </p>
                        <p className="text-sm text-gray-500">CI: {cita.paciente.ci}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Especialidad</span>
                        </div>
                        <p className="font-medium">{cita.franja.especialidad.nombre}</p>
                        <p className="text-sm text-gray-500">Dr. {cita.franja.responsable.nombre}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Motivo</span>
                        </div>
                        <p className="font-medium">{cita.motivoConsulta}</p>
                      </div>
                    </div>

                    {cita.observaciones && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Observaciones:</span> {cita.observaciones}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Dialog open={mostrarDetalles && citaSeleccionada?.id === cita.id} 
                           onOpenChange={(open) => {
                             setMostrarDetalles(open);
                             if (!open) setCitaSeleccionada(null);
                           }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCitaSeleccionada(cita);
                          setMostrarDetalles(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Detalles de la Cita</DialogTitle>
                          <DialogDescription>
                            Información completa de la cita seleccionada
                          </DialogDescription>
                        </DialogHeader>
                        {citaSeleccionada && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">Paciente</h4>
                              <p>{citaSeleccionada.paciente.nombre} {citaSeleccionada.paciente.apellido}</p>
                              <p className="text-sm text-gray-500">CI: {citaSeleccionada.paciente.ci}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Fecha y Hora</h4>
                              <p>{formatearFecha(citaSeleccionada.fecha)}</p>
                              <p>{formatearHora(citaSeleccionada.horaInicio)} - {formatearHora(citaSeleccionada.horaFin)}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Estado</h4>
                              {getEstadoBadge(citaSeleccionada.estado)}
                            </div>
                            <div>
                              <h4 className="font-medium">Motivo de Consulta</h4>
                              <p>{citaSeleccionada.motivoConsulta}</p>
                            </div>
                            {citaSeleccionada.observaciones && (
                              <div>
                                <h4 className="font-medium">Observaciones</h4>
                                <p>{citaSeleccionada.observaciones}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm" onClick={() => onEditarCita(cita)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>

                    {cita.estado === CitaEstado.PROGRAMADA && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCambiarEstado(cita.id, CitaEstado.ATENDIDA)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCambiarEstado(cita.id, CitaEstado.CANCELADA)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={cita.estado === CitaEstado.ATENDIDA}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar cita?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la cita del {formatearFecha(cita.fecha)} para {cita.paciente.nombre} {cita.paciente.apellido}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleEliminarCita(cita.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}