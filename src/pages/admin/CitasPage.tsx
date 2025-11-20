import { useState } from 'react';
import { List, Grid3X3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import CitasList from '@/components/citas/CitasList';
import CalendarioCitas from '@/components/citas/CalendarioCitas';
import FormularioCita from '@/components/citas/FormularioCita';
import type { Cita } from '@/types/citas';

export default function CitasPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'create' | 'edit'>('create');
  const [citaEdicion, setCitaEdicion] = useState<Cita | null>(null);
  const [vistaActiva, setVistaActiva] = useState('lista');

  const handleNuevaCita = () => {
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
    // Esta función se maneja en cada componente hijo
    console.log('Cita guardada:', citaGuardada);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Citas Médicas</h1>
            <p className="text-muted-foreground">
              Administra las citas médicas de la clínica odontológica
            </p>
          </div>
        </div>

        {/* Tabs para cambiar entre vistas */}
        <Card>
          <CardHeader>
            <CardTitle>Citas Médicas</CardTitle>
            <CardDescription>
              Visualiza y gestiona las citas desde diferentes perspectivas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={vistaActiva} onValueChange={setVistaActiva} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lista" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Vista de Lista
                </TabsTrigger>
                <TabsTrigger value="calendario" className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Vista de Calendario
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lista" className="mt-6">
                <CitasList 
                  onNuevaCita={handleNuevaCita}
                  onEditarCita={handleEditarCita}
                />
              </TabsContent>

              <TabsContent value="calendario" className="mt-6">
                <CalendarioCitas onNuevaCita={handleNuevaCita} />
              </TabsContent>
            </Tabs>
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
    </DashboardLayout>
  );
}