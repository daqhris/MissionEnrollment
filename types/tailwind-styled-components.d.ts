declare module 'tailwind-styled-components' {
  import { ComponentType, PropsWithChildren, HTMLAttributes } from 'react';

  export interface TwComponent extends ComponentType<any> {
    tw: string;
  }

  type TemplateFn<P = {}> = (strings: TemplateStringsArray, ...values: any[]) => ComponentType<P>;

  interface TwElementFn {
    <P = {}>(strings: TemplateStringsArray, ...values: any[]): ComponentType<P & { children?: React.ReactNode }>;
    <P>(component: ComponentType<P>): ComponentType<P & { className?: string }>;
  }

  interface TwElements {
    div: TwElementFn;
    p: TwElementFn;
    h1: TwElementFn;
    h2: TwElementFn;
    h3: TwElementFn;
    input: TwElementFn;
    button: TwElementFn;
    span: TwElementFn;
    a: TwElementFn;
    ul: TwElementFn;
    li: TwElementFn;
    nav: TwElementFn;
    footer: TwElementFn;
    label: TwElementFn;
    [key: string]: TwElementFn;
  }

  type StyledComponent = <T>(Component: ComponentType<T>) => ComponentType<T & { className?: string }>;

  const tw: TwElements & StyledComponent;
  export default tw;
}
