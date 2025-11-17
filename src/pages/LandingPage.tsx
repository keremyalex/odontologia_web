import React from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Clock,
    ShieldCheck,
    GraduationCap,
    Heart,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Heart className="h-8 w-8 text-primary mr-2" />
                            <span className="text-2xl font-bold text-gray-900">
                                Clínica Odontológica UAGRM
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Iniciar Sesión
                            </Link>
                            <Button asChild>
                                <Link to="/login">
                                    Acceder al Sistema
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-linear-to-r from-primary to-primary/80">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Gestión Moderna de
                            <span className="block text-blue-200">Atención Odontológica</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Sistema integral para la gestión de pacientes, turnos y tratamientos
                            en la Clínica Odontológica de la Universidad Autónoma Gabriel René Moreno
                        </p>
                        <div className="space-x-4">
                            <Button asChild size="lg">
                                <Link to="/login">
                                    Acceder al Sistema
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                                <a href="#features">
                                    Conocer Más
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Características del Sistema
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Diseñado específicamente para optimizar los procesos de la clínica
                            odontológica universitaria
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                                <CardTitle className="text-center">
                                    Gestión de Pacientes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    Registro completo de pacientes con historial médico,
                                    datos de contacto y seguimiento personalizado.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                                <CardTitle className="text-center">
                                    Gestión de Turnos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    Sistema de citas inteligente con asignación de estudiantes,
                                    supervisores y consultorios disponibles.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                                <CardTitle className="text-center">
                                    Control Académico
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    Asignación de estudiantes a pacientes con supervisión
                                    docente para garantizar la calidad educativa.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
                                <CardTitle className="text-center">
                                    Seguridad y Roles
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    Sistema de autenticación con diferentes niveles de acceso
                                    para administradores, recepción, estudiantes y docentes.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                                <CardTitle className="text-center">
                                    Reportes y Estadísticas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    Generación automática de reportes de atención,
                                    estadísticas de consultorios y seguimiento de casos.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                                <CardTitle className="text-center">
                                    Interfaz Intuitiva
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center">
                                    Diseño moderno y fácil de usar, optimizado para el
                                    trabajo diario del personal clínico y administrativo.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Sobre Nuestra Clínica
                            </h2>
                            <p className="text-lg text-gray-600 mb-4">
                                La Clínica Odontológica de la UAGRM es un centro de formación
                                académica y atención dental que brinda servicios de calidad a
                                la comunidad, mientras forma a los futuros profesionales de la odontología.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                Nuestro sistema de gestión digital permite optimizar los procesos
                                de atención, mejorar la experiencia del paciente y facilitar el
                                seguimiento académico de los estudiantes.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Atención profesional supervisada</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Tecnología de última generación</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                                    <span className="text-gray-700">Precios accesibles para la comunidad</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-linear-to-br from-primary to-primary/80 rounded-lg p-8 text-white">
                            <h3 className="text-2xl font-bold mb-4">Información de Contacto</h3>
                            <div className="space-y-3">
                                <p><strong>Dirección:</strong> Campus Universitario, Santa Cruz</p>
                                <p><strong>Teléfono:</strong> +591 3 336-4000</p>
                                <p><strong>Email:</strong> clinica.odonto@uagrm.edu.bo</p>
                                <p><strong>Horarios:</strong> Lunes a Viernes 8:00 - 18:00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <Heart className="h-6 w-6 text-primary mr-2" />
                            <span className="text-lg font-semibold">
                                Clínica Odontológica UAGRM
                            </span>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-gray-400">
                                © 2024 Universidad Autónoma Gabriel René Moreno
                            </p>
                            <p className="text-gray-400 text-sm">
                                Sistema de Gestión Odontológica
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;