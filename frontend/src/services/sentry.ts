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
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  });
}

/**
 * Capturar mensagem
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  Sentry.captureMessage(message, level);
}

/**
 * Configurar usuário
 */
export function setUser(userId: string, email?: string, username?: string) {
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
export function addBreadcrumb(message: string, category: string, level: "info" | "warning" | "error" = "info") {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
}
