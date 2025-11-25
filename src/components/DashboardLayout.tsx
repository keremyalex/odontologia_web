import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UagrmChat from './UagrmChat';
import './chat-styles.css';
import {
    HomeIcon,
    UserGroupIcon,
    CalendarDaysIcon,
    UsersIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    HeartIcon,
    ClockIcon,
    AcademicCapIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, hasRole } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['admin', 'recepcion', 'estudiante', 'docente'] },
        { name: 'Usuarios', href: '/users', icon: UsersIcon, roles: ['admin'] },
        { name: 'Horarios Clínica', href: '/admin/horarios-clinica', icon: ClockIcon, roles: ['admin'] },
        { name: 'Especialidades', href: '/admin/especialidades', icon: AcademicCapIcon, roles: ['admin'] },
        { name: 'Franjas Horarias', href: '/admin/franjas-horarias', icon: CalendarDaysIcon, roles: ['admin', 'docente'] },
        { name: 'Pacientes', href: '/patients', icon: UserGroupIcon, roles: ['admin', 'recepcion', 'estudiante', 'docente'] },
        // { name: 'Turnos', href: '/appointments', icon: CalendarDaysIcon, roles: ['admin', 'recepcion', 'estudiante', 'docente'] },
        { name: 'Citas Médicas', href: '/admin/citas', icon: CalendarDaysIcon, roles: ['admin', 'recepcion', 'docente'] },
        { name: 'Atenciones', href: '/atenciones', icon: DocumentTextIcon, roles: ['admin', 'estudiante', 'docente'] },
    ];

    const filteredNavigation = navigation.filter(item =>
        item.roles.some(role => hasRole(role))
    );

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
                <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <XMarkIcon className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="shrink-0 flex items-center px-4">
                                <HeartIcon className="h-8 w-8 text-primary-600" />
                                <span className="ml-2 text-lg font-semibold text-gray-900">
                                    Clínica UAGRM
                                </span>
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {filteredNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`${location.pathname === item.href
                                                ? 'bg-primary-100 text-primary-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon
                                            className={`${location.pathname === item.href
                                                    ? 'text-primary-500'
                                                    : 'text-gray-400 group-hover:text-gray-500'
                                                } mr-4 h-6 w-6`}
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="shrink-0 flex border-t border-gray-200 p-4">
                            <div className="shrink-0 group block">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                            {user?.nombre}
                                        </p>
                                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                                            {user?.rol}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center shrink-0 px-4">
                            <HeartIcon className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-lg font-semibold text-gray-900">
                                Clínica UAGRM
                            </span>
                        </div>
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {filteredNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`${location.pathname === item.href
                                            ? 'bg-primary-100 text-primary-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                >
                                    <item.icon
                                        className={`${location.pathname === item.href
                                                ? 'text-primary-500'
                                                : 'text-gray-400 group-hover:text-gray-500'
                                            } mr-3 h-6 w-6`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="shrink-0 flex border-t border-gray-200 p-4">
                        <div className="shrink-0 w-full group block">
                            <div className="flex items-center">
                                <div>
                                    <div className="inline-block h-9 w-9 rounded-full bg-primary-100">
                                        <span className="flex h-full w-full items-center justify-center text-primary-600 font-medium">
                                            {user?.nombre.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        {user?.nombre}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                                        {user?.rol}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-3 shrink-0 p-1 text-gray-400 hover:text-gray-600"
                                    title="Cerrar sesión"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
                    <button
                        type="button"
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Chat Widget - Solo dentro del sistema */}
            <UagrmChat 
                webhookUrl={import.meta.env.VITE_N8N_WEBHOOK_URL || ''}
                mode="window"
                showWelcomeScreen={true}
                enableStreaming={false}
                initialMessages={[
                    '¡Hola! 👨‍⚕️',
                    'Soy el asistente de la Clínica Odontológica UAGRM.',
                    'Puedo ayudarte con información sobre horarios, especialidades, citas y más.',
                    '¿En qué puedo asistirte hoy?'
                ]}
            />
        </div>
    );
};

export default DashboardLayout;