import * as Sentry from "@sentry/react";
/**
 * Inicializar Sentry para tracking de erros
 * Captura erros não tratados e performance
 */
export function initSentry() {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    const environment = import.meta.env.MODE;
    if (!dsn) {
        console.warn("Sentry DSN não configurado");
        return;
    }
    Sentry.init({
        dsn,
        environment,
        integrations: [
            new Sentry.Replay({
                maskAllText: true,
                blockAllMedia: true,
            }),
        ],
        tracesSampleRate: environment === "production" ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        beforeSend(event, hint) {
            // Filtrar erros de rede temporários
            if (event.exception) {
                const error = hint.originalException;
                if (error instanceof Error) {
                    if (error.message.includes("Network request failed")) {
                        return null;
                    }
                }
            }
            return event;
        },
    });
}
/**
 * Capturar erro manualmente
 */
export function captureException(error, context) {
    Sentry.captureException(error, {
        contexts: {
            custom: context,
        },
    });
}
/**
 * Capturar mensagem
 */
export function captureMessage(message, level = "info") {
    Sentry.captureMessage(message, level);
}
/**
 * Configurar usuário
 */
export function setUser(userId, email, username) {
    Sentry.setUser({
        id: userId,
        email,
        username,
    });
}
/**
 * Limpar usuário (logout)
 */
export function clearUser() {
    Sentry.setUser(null);
}
/**
 * Adicionar breadcrumb (rastreamento de eventos)
 */
export function addBreadcrumb(message, category, level = "info") {
    Sentry.addBreadcrumb({
        message,
        category,
        level,
        timestamp: Date.now() / 1000,
    });
}
