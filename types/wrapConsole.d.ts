/**
 * wrap console logging functions like
 * console.log, console.info, console.warn, console.error
 * @return unwrap function
 */
export function wrapConsole(log: any, { level4log }?: {
    level4log?: string | undefined;
}): () => void;
