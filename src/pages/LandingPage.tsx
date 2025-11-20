import React from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Clock,
    ShieldCheck,
    GraduationCap,
    Heart,
    Star,
    MapPin,
    Phone,
    Mail,
    Clock3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Importar imágenes
import clinicImage1 from '../assets/clinic1.jpg';
import clinicImage2 from '../assets/clinic2.jpg';
import dentistImage from '../assets/dentist1.jpg';
import uagrmLogo from '../assets/uagrm-escudo.png';
import odontoLogo from '../assets/odonto_escudo.jpg';
import facultadLogo from '../assets/facultad_escudo.jpg';
import uagrmEscudo from '@/assets/uagrm-escudo.png';
import odontoEscudo from '@/assets/odonto_escudo.jpg';
import facultadEscudo from '@/assets/facultad_escudo.jpg';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-lg backdrop-blur-sm bg-opacity-95 fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={uagrmEscudo} 
                                alt="UAGRM Escudo" 
                                className="h-12 w-12 object-contain"
                            />
                            <img 
                                src={odontoEscudo} 
                                alt="Odontología Escudo" 
                                className="h-10 w-10 object-contain"
                            />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Clínica Odontológica
                                </h1>
                                <p className="text-sm text-gray-600">UAGRM</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <a href="#features" className="text-gray-700 hover:text-primary transition-colors">
                                Servicios
                            </a>
                            <a href="#about" className="text-gray-700 hover:text-primary transition-colors">
                                Nosotros
                            </a>
                            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">
                                Contacto
                            </a>
                            <Button asChild variant="outline">
                                <Link to="/login">
                                    Iniciar Sesión
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link to="/login">
                                    <Heart className="w-4 h-4 mr-2" />
                                    Acceder al Sistema
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={clinicImage1} 
                        alt="Clínica Odontológica" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 via-blue-800/80 to-blue-600/70"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-8">
                        <img 
                            src={facultadEscudo} 
                            alt="Facultad de Odontología" 
                            className="h-24 w-24 mx-auto mb-6 rounded-full shadow-2xl border-4 border-white/20"
                        />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 leading-tight">
                        <span className="block">Clínica Odontológica</span>
                        <span className="block text-blue-200 text-3xl md:text-5xl mt-4">
                            Universidad UAGRM
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
                        Sistema integral de gestión para la atención odontológica académica.
                        <span className="block mt-2">Excelencia, innovación y compromiso social.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button asChild size="lg" className="text-lg px-8 py-4 bg-white text-blue-900 hover:bg-blue-50">
                            <Link to="/login">
                                <Heart className="mr-3 h-5 w-5" />
                                Acceder al Sistema
                            </Link>
                        </Button>
                        <Button 
                            asChild 
                            variant="outline" 
                            size="lg" 
                            className="text-lg px-8 py-4 bg-green-600 border-white text-white hover:bg-white hover:text-blue-900 transition-all"
                        >
                            <a href="#features">
                                <Star className="mr-3 h-5 w-5" />
                                Conocer Más
                            </a>
                        </Button>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">500+</div>
                            <div className="text-blue-200">Pacientes Atendidos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">50+</div>
                            <div className="text-blue-200">Estudiantes Formados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-white mb-2">15+</div>
                            <div className="text-blue-200">Especialidades</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Sistema Integral de Gestión
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Tecnología avanzada diseñada específicamente para optimizar 
                            los procesos académicos y clínicos de nuestra facultad
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-linear-to-br from-blue-50 to-white">
                            <CardHeader className="text-center pb-6">
                                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-8 w-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl">
                                    Gestión de Pacientes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600 leading-relaxed">
                                    Sistema completo de registro de pacientes con historial médico detallado,
                                    seguimiento de tratamientos y gestión de datos personales.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-linear-to-br from-green-50 to-white">
                            <CardHeader className="text-center pb-6">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="h-8 w-8 text-green-600" />
                                </div>
                                <CardTitle className="text-xl">
                                    Gestión de Citas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600 leading-relaxed">
                                    Calendario inteligente con asignación automática de estudiantes,
                                    supervisores y disponibilidad de consultorios.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-linear-to-br from-purple-50 to-white">
                            <CardHeader className="text-center pb-6">
                                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <GraduationCap className="h-8 w-8 text-purple-600" />
                                </div>
                                <CardTitle className="text-xl">
                                    Control Académico
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600 leading-relaxed">
                                    Supervisión académica con seguimiento de casos clínicos
                                    y evaluación del desempeño estudiantil.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-linear-to-br from-orange-50 to-white">
                            <CardHeader className="text-center pb-6">
                                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <ShieldCheck className="h-8 w-8 text-orange-600" />
                                </div>
                                <CardTitle className="text-xl">
                                    Seguridad y Roles
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600 leading-relaxed">
                                    Sistema robusto de autenticación con niveles de acceso
                                    diferenciados para cada tipo de usuario.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-linear-to-br from-red-50 to-white">
                            <CardHeader className="text-center pb-6">
                                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <Star className="h-8 w-8 text-red-600" />
                                </div>
                                <CardTitle className="text-xl">
                                    Odontograma Digital
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600 leading-relaxed">
                                    Herramientas digitales avanzadas para registro y seguimiento
                                    de tratamientos dentales especializados.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-linear-to-br from-teal-50 to-white">
                            <CardHeader className="text-center pb-6">
                                <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                    <Heart className="h-8 w-8 text-teal-600" />
                                </div>
                                <CardTitle className="text-xl">
                                    Interfaz Moderna
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600 leading-relaxed">
                                    Diseño intuitivo y responsivo optimizado para el trabajo diario
                                    del personal clínico y administrativo.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Content */}
                        <div className="order-2 lg:order-1">
                            <h2 className="text-4xl font-bold text-gray-900 mb-8">
                                Excelencia Académica y Atención de Calidad
                            </h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                La Clínica Odontológica de la UAGRM es un centro de excelencia que combina 
                                la formación académica de alto nivel con la atención dental de calidad para 
                                la comunidad cruceña.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Nuestro sistema digital revoluciona la gestión clínica, permitiendo un 
                                seguimiento preciso de cada caso, optimizando los procesos educativos 
                                y garantizando la mejor atención para nuestros pacientes.
                            </p>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                                    <span className="text-gray-700 text-lg">Supervisión docente especializada</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                                    <span className="text-gray-700 text-lg">Equipamiento de última generación</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                                    <span className="text-gray-700 text-lg">Atención integral y personalizada</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                                    <span className="text-gray-700 text-lg">Precios sociales para la comunidad</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                                    <div className="text-gray-600">Años de experiencia</div>
                                </div>
                                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
                                    <div className="text-gray-600">Pacientes atendidos</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Images */}
                        <div className="order-1 lg:order-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                        <img 
                                            src={clinicImage2} 
                                            alt="Instalaciones de la Clínica" 
                                            className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                        <img 
                                            src={dentistImage} 
                                            alt="Atención profesional" 
                                            className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                                <div className="pt-8">
                                    <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                                        <img 
                                            src={clinicImage1} 
                                            alt="Estudiantes en formación" 
                                            className="w-full h-80 object-cover transform hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-8">
                                Información de Contacto
                            </h2>
                            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                                ¿Necesitas más información sobre nuestros servicios o el sistema de gestión?
                                Estamos aquí para ayudarte.
                            </p>
                            
                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Dirección</h4>
                                        <p className="text-gray-600">Modulos Universitarios UAGRM<br />Santa Cruz de la Sierra, Bolivia</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                                        <Phone className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Teléfono</h4>
                                        <p className="text-gray-600">+591 3 336-4000<br />Ext. 2150 - 2151</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                                        <Mail className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Email</h4>
                                        <p className="text-gray-600">clinica.odonto@uagrm.edu.bo<br />info.dental@uagrm.edu.bo</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                                        <Clock3 className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Horarios de Atención</h4>
                                        <p className="text-gray-600">Lunes a Viernes: 7:00 - 19:00<br />Sábados: 8:00 - 12:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* CTA Card */}
                        <div className="flex items-center">
                            <Card className="w-full bg-linear-to-br from-blue-600 to-blue-800 text-white border-0 shadow-2xl">
                                <CardContent className="p-8">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Heart className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar?</h3>
                                        <p className="text-blue-100 leading-relaxed">
                                            Accede al sistema de gestión y descubre cómo podemos 
                                            optimizar los procesos de tu clínica odontológica.
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <Button 
                                            asChild 
                                            size="lg" 
                                            className="w-full bg-white text-blue-900 hover:bg-blue-50 text-lg py-4"
                                        >
                                            <Link to="/login">
                                                <Heart className="mr-3 h-5 w-5" />
                                                Acceder al Sistema
                                            </Link>
                                        </Button>
                                        
                                        <div className="text-center">
                                            <p className="text-blue-100 text-sm">
                                                ¿Necesitas una demostración?
                                            </p>
                                            <p className="text-white font-semibold">
                                                Contáctanos: +591 3 336-4000
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* Universidad */}
                        <div className="md:col-span-2">
                            <div className="flex items-center mb-6">
                                <img 
                                    src={uagrmLogo} 
                                    alt="UAGRM" 
                                    className="w-16 h-16 mr-4"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-white">Universidad Autónoma Gabriel René Moreno</h3>
                                    <p className="text-sm text-gray-400">Facultad de Odontología</p>
                                </div>
                            </div>
                            <p className="text-gray-400 mb-6 max-w-md">
                                Formando profesionales de excelencia en odontología con compromiso social 
                                y tecnología de vanguardia para el servicio de la comunidad cruceña.
                            </p>
                            <div className="flex space-x-4">
                                <img src={odontoLogo} alt="Facultad de Odontología" className="w-12 h-12" />
                                <img src={facultadLogo} alt="Escudo Facultad" className="w-12 h-12" />
                            </div>
                        </div>
                        
                        {/* Enlaces */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Enlaces</h4>
                            <ul className="space-y-2">
                                <li><Link to="/login" className="hover:text-blue-400 transition-colors">Iniciar Sesión</Link></li>
                                <li><a href="https://www.uagrm.edu.bo" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">UAGRM</a></li>
                                <li><a href="#about" className="hover:text-blue-400 transition-colors">Acerca de</a></li>
                                <li><a href="#services" className="hover:text-blue-400 transition-colors">Servicios</a></li>
                            </ul>
                        </div>
                        
                        {/* Contacto */}
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                                    Modulos Universitarios - UAGRM
                                </li>
                                <li className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-blue-400" />
                                    +591 3 336-4000
                                </li>
                                <li className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-blue-400" />
                                    clinica.odonto@uagrm.edu.bo
                                </li>
                                <li className="flex items-center">
                                    <Clock3 className="w-4 h-4 mr-2 text-blue-400" />
                                    Lun - Vie: 7:00 - 19:00
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-8 mt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-gray-400">
                                © {new Date().getFullYear()} Universidad Autónoma Gabriel René Moreno. Todos los derechos reservados.
                            </p>
                            <p className="text-sm text-gray-400 mt-2 md:mt-0">
                                Sistema de Gestión Clínica Odontológica v2.0
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;