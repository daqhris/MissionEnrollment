declare module 'tailwind-styled-components' {
  import { ComponentType, PropsWithChildren, HTMLAttributes, AnchorHTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

  export interface TwComponent extends ComponentType<any> {
    tw: string;
  }

  type TemplateFn<P = {}> = (strings: TemplateStringsArray, ...values: any[]) => ComponentType<P>;

  interface TwElementFn {
    <P = {}>(strings: TemplateStringsArray, ...values: any[]): ComponentType<P & { children?: React.ReactNode }>;
    <P>(component: ComponentType<P>): ComponentType<P & { className?: string }>;
  }

  interface TwElements {
    div: TwElementFn & ComponentType<HTMLAttributes<HTMLDivElement>>;
    p: TwElementFn & ComponentType<HTMLAttributes<HTMLParagraphElement>>;
    h1: TwElementFn & ComponentType<HTMLAttributes<HTMLHeadingElement>>;
    h2: TwElementFn & ComponentType<HTMLAttributes<HTMLHeadingElement>>;
    h3: TwElementFn & ComponentType<HTMLAttributes<HTMLHeadingElement>>;
    input: TwElementFn & ComponentType<InputHTMLAttributes<HTMLInputElement>>;
    button: TwElementFn & ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>;
    span: TwElementFn & ComponentType<HTMLAttributes<HTMLSpanElement>>;
    a: TwElementFn & ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>;
    ul: TwElementFn & ComponentType<HTMLAttributes<HTMLUListElement>>;
    li: TwElementFn & ComponentType<HTMLAttributes<HTMLLIElement>>;
    nav: TwElementFn & ComponentType<HTMLAttributes<HTMLElement>>;
    footer: TwElementFn & ComponentType<HTMLAttributes<HTMLElement>>;
    label: TwElementFn & ComponentType<HTMLAttributes<HTMLLabelElement>>;
    [key: string]: TwElementFn;
  }

  type StyledComponent = <T>(Component: ComponentType<T>) => ComponentType<T & { className?: string }>;

  const tw: TwElements & StyledComponent;
  export default tw;
}
