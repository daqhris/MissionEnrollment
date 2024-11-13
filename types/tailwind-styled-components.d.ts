declare module 'tailwind-styled-components' {
  import { ComponentType, PropsWithChildren } from 'react';

  export interface TwComponent extends ComponentType<any> {
    tw: string;
  }

  type TemplateFn = (strings: TemplateStringsArray, ...values: any[]) => ComponentType<any>;

  interface TwElementFn {
    (strings: TemplateStringsArray, ...values: any[]): ComponentType<any>;
    (component: ComponentType<any>): ComponentType<any>;
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
    a: TwElementFn;  // Add anchor element type
    [key: string]: TwElementFn;
  }

  const tw: TwElements & TwElementFn;
  export default tw;
}
