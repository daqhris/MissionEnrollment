declare module 'envfile' {
  export function parse(content: string): Record<string, string>;
  export function stringify(object: Record<string, string>): string;
}
