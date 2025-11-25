import React, { useEffect, useRef } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

interface UagrmChatProps {
    webhookUrl: string;
    mode?: 'window' | 'fullscreen';
    showWelcomeScreen?: boolean;
    initialMessages?: string[];
    target?: string;
    enableStreaming?: boolean;
}

const UagrmChat: React.FC<UagrmChatProps> = ({
    webhookUrl,
    mode = 'window',
    showWelcomeScreen = false,
    initialMessages,
    target = '#n8n-chat',
    enableStreaming = false
}) => {
    const chatInitialized = useRef(false);

    useEffect(() => {
        if (chatInitialized.current) return;

        try {
            // Configurar el chat con un webhook URL temporal que será interceptado
            createChat({
                webhookUrl: `${webhookUrl}`,
                mode: mode,
                showWelcomeScreen: showWelcomeScreen,
                target: target,
                enableStreaming: enableStreaming,
                initialMessages: initialMessages || [
                    '¡Hola! 👋',
                    'Soy el asistente de la Clínica Odontológica UAGRM.',
                    '¿En qué puedo ayudarte hoy?'
                ],
                i18n: {
                    en: {
                        title: '¡Hola! 👨‍⚕️',
                        subtitle: 'Asistente virtual de la Clínica Odontológica UAGRM',
                        footer: 'Universidad Autónoma Gabriel René Moreno',
                        getStarted: 'Iniciar Conversación',
                        inputPlaceholder: 'Escribe tu consulta aquí...',
                        closeButtonTooltip: 'Cerrar chat'
                    }
                },
                webhookConfig: {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            });

            chatInitialized.current = true;
            console.log('✅ Chat UAGRM inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error al inicializar el chat UAGRM:', error);
        }

        return () => {
            // Cleanup automático
        };
    }, [webhookUrl, mode, showWelcomeScreen, target, enableStreaming, initialMessages]);

    return (
        <div 
            id={target.replace('#', '')} 
            style={{ 
                width: mode === 'fullscreen' ? '100%' : 'auto', 
                height: mode === 'fullscreen' ? '100%' : 'auto' 
            }}
        ></div>
    );
};

export default UagrmChat;