import React, { useEffect, useRef } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

interface ChatWidgetProps {
    webhookUrl: string;
    mode?: 'window' | 'fullscreen';
    showWelcomeScreen?: boolean;
    initialMessages?: string[];
    target?: string;
    enableStreaming?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
    webhookUrl,
    mode = 'window',
    showWelcomeScreen = false,
    initialMessages,
    target = '#n8n-chat',
    enableStreaming = false
}) => {
    const chatInitialized = useRef(false);

    useEffect(() => {
        // Evitar inicializar múltiples veces
        if (chatInitialized.current) return;

        try {
            createChat({
                webhookUrl: webhookUrl,
                mode: mode,
                showWelcomeScreen: showWelcomeScreen,
                target: target,
                enableStreaming: enableStreaming,
                initialMessages: initialMessages || [
                    '¡Hola! 👋',
                    'Soy el asistente de la Clínica Odontológica UAGRM. ¿En qué puedo ayudarte hoy?'
                ],
                i18n: {
                    en: {
                        title: '¡Hola! 👋',
                        subtitle: 'Inicia una conversación. Estamos aquí para ayudarte 24/7.',
                        footer: 'Clínica Odontológica UAGRM',
                        getStarted: 'Nueva Conversación',
                        inputPlaceholder: 'Escribe tu pregunta aquí...',
                        closeButtonTooltip: 'Cerrar chat'
                    }
                },
                // Personalización de colores para el sistema odontológico
                webhookConfig: {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            });

            chatInitialized.current = true;
        } catch (error) {
            console.error('Error al inicializar el chat:', error);
        }

        // Cleanup function
        return () => {
            // El widget se limpia automáticamente al desmontar
        };
    }, [webhookUrl, mode, showWelcomeScreen, target, enableStreaming, initialMessages]);

    return (
        <div id="n8n-chat" style={{ 
            width: mode === 'fullscreen' ? '100%' : 'auto', 
            height: mode === 'fullscreen' ? '100%' : 'auto' 
        }}></div>
    );
};

export default ChatWidget;