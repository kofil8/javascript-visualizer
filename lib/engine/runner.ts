export type LogType = 'log' | 'error' | 'warn' | 'info' | 'table';

export interface ExecutionLog {
  type: LogType;
  content: any[];
  timestamp: number;
}

export interface ExecutionResult {
  logs: ExecutionLog[];
  error: string | null;
  variables: Record<string, any>;
}

export async function executeCode(code: string): Promise<ExecutionResult> {
  const logs: ExecutionLog[] = [];
  const variables: Record<string, any> = {};

  // Create a custom console to capture logs
  const customConsole = {
    log: (...args: any[]) => logs.push({ type: 'log', content: args, timestamp: Date.now() }),
    error: (...args: any[]) => logs.push({ type: 'error', content: args, timestamp: Date.now() }),
    warn: (...args: any[]) => logs.push({ type: 'warn', content: args, timestamp: Date.now() }),
    info: (...args: any[]) => logs.push({ type: 'info', content: args, timestamp: Date.now() }),
    table: (...args: any[]) => logs.push({ type: 'table', content: args, timestamp: Date.now() }),
  };

  try {
    // We use a Function constructor to execute the code in a controlled scope
    // Note: This is client-side execution. For a production app, consider a Web Worker for safety.
    const runner = new Function('console', `
      try {
        ${code}
      } catch (err) {
        throw err;
      }
    `);

    runner(customConsole);

    return {
      logs,
      error: null,
      variables,
    };
  } catch (err: any) {
    return {
      logs,
      error: err.message || String(err),
      variables,
    };
  }
}
