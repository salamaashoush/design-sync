import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { CLIError, handleCommandError, withErrorHandling } from '../../src/utils/errors';

describe('CLIError', () => {
  it('should create an error with default exit code', () => {
    const error = new CLIError('Something went wrong');

    expect(error.message).toBe('Something went wrong');
    expect(error.exitCode).toBe(1);
    expect(error.name).toBe('CLIError');
  });

  it('should create an error with custom exit code', () => {
    const error = new CLIError('Not found', 2);

    expect(error.message).toBe('Not found');
    expect(error.exitCode).toBe(2);
  });

  it('should be an instance of Error', () => {
    const error = new CLIError('Test');

    expect(error).toBeInstanceOf(Error);
  });
});

describe('handleCommandError', () => {
  let exitSpy: ReturnType<typeof spyOn>;

  afterEach(() => {
    exitSpy?.mockRestore();
  });

  it('should log CLIError message and exit with its code', () => {
    const mockLogger = {
      error: mock(() => {}),
    };
    exitSpy = spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    const error = new CLIError('CLI error message', 42);

    expect(() => handleCommandError(error, mockLogger as any)).toThrow('process.exit called');
    expect(mockLogger.error).toHaveBeenCalledWith('CLI error message');
    expect(exitSpy).toHaveBeenCalledWith(42);
  });

  it('should handle regular Error instances', () => {
    const mockLogger = {
      error: mock(() => {}),
    };
    exitSpy = spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    const error = new Error('Regular error');

    expect(() => handleCommandError(error, mockLogger as any)).toThrow('process.exit called');
    expect(mockLogger.error).toHaveBeenCalledWith('Regular error');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should handle non-Error objects', () => {
    const mockLogger = {
      error: mock(() => {}),
    };
    exitSpy = spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    expect(() => handleCommandError('string error', mockLogger as any)).toThrow('process.exit called');
    expect(mockLogger.error).toHaveBeenCalledWith('An unexpected error occurred:', 'string error');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('should log stack trace when DEBUG env is set', () => {
    const originalDebug = process.env.DEBUG;
    process.env.DEBUG = 'true';

    const mockLogger = {
      error: mock(() => {}),
    };
    exitSpy = spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    const error = new Error('Error with stack');

    expect(() => handleCommandError(error, mockLogger as any)).toThrow('process.exit called');
    expect(mockLogger.error).toHaveBeenCalledTimes(2);

    process.env.DEBUG = originalDebug;
  });
});

describe('withErrorHandling', () => {
  let exitSpy: ReturnType<typeof spyOn>;

  afterEach(() => {
    exitSpy?.mockRestore();
  });

  it('should wrap async function and handle errors', async () => {
    const mockLogger = {
      error: mock(() => {}),
    };
    exitSpy = spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });

    const failingHandler = async () => {
      throw new CLIError('Handler failed', 3);
    };

    const wrappedHandler = withErrorHandling(failingHandler, mockLogger as any);

    await expect(wrappedHandler()).rejects.toThrow('process.exit called');
    expect(mockLogger.error).toHaveBeenCalledWith('Handler failed');
    expect(exitSpy).toHaveBeenCalledWith(3);
  });

  it('should pass through successful handler', async () => {
    const mockLogger = {
      error: mock(() => {}),
    };

    let called = false;
    const successHandler = async () => {
      called = true;
    };

    const wrappedHandler = withErrorHandling(successHandler, mockLogger as any);
    await wrappedHandler();

    expect(called).toBe(true);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should preserve handler arguments', async () => {
    const mockLogger = {
      error: mock(() => {}),
    };

    let receivedArgs: unknown[] = [];
    const handler = async (...args: unknown[]) => {
      receivedArgs = args;
    };

    const wrappedHandler = withErrorHandling(handler, mockLogger as any);
    await wrappedHandler('arg1', 'arg2', 123);

    expect(receivedArgs).toEqual(['arg1', 'arg2', 123]);
  });
});
