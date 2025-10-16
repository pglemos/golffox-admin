interface LogPayload {
  context?: Record<string, unknown>;
  error?: unknown;
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function formatMessage(level: LogLevel, message: string, payload?: LogPayload) {
  const timestamp = new Date().toISOString();
  const serializedPayload = payload
    ? JSON.stringify(
        {
          ...payload.context,
          ...(payload.error instanceof Error
            ? { error: { name: payload.error.name, message: payload.error.message, stack: payload.error.stack } }
            : payload.error
            ? { error: payload.error }
            : {}),
        },
        null,
        2,
      )
    : undefined;

  return serializedPayload ? `[${timestamp}] [${level.toUpperCase()}] ${message} -> ${serializedPayload}` : `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

function emit(level: LogLevel, message: string, payload?: LogPayload) {
  const formatted = formatMessage(level, message, payload);

  switch (level) {
    case 'debug':
      console.debug(formatted);
      break;
    case 'info':
      console.info(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'error':
      console.error(formatted);
      break;
  }
}

export const logger = {
  debug(message: string, payload?: LogPayload) {
    emit('debug', message, payload);
  },
  info(message: string, payload?: LogPayload) {
    emit('info', message, payload);
  },
  warn(message: string, payload?: LogPayload) {
    emit('warn', message, payload);
  },
  error(message: string, payload?: LogPayload) {
    emit('error', message, payload);
  },
};
