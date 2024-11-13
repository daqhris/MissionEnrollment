declare module 'tailwind-styled-components' {
  import { ComponentType, PropsWithChildren, HTMLAttributes, AnchorHTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

  export interface TwComponent extends ComponentType<any> {
    tw: string;
  }

  type TemplateFn<P = {}> = (strings: TemplateStringsArray, ...values: any[]) => ComponentType<P>;

  type HTMLElementProps<T> = T & { children?: React.ReactNode; className?: string };

  interface TwElements {
    div: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLDivElement>>>;
    p: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLParagraphElement>>>;
    h1: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLHeadingElement>>>;
    h2: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLHeadingElement>>>;
    h3: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLHeadingElement>>>;
    input: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<InputHTMLAttributes<HTMLInputElement>>>;
    button: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<ButtonHTMLAttributes<HTMLButtonElement>>>;
    span: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLSpanElement>>>;
    a: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<AnchorHTMLAttributes<HTMLAnchorElement>>>;
    ul: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLUListElement>>>;
    li: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLLIElement>>>;
    nav: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLElement>>>;
    footer: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLElement>>>;
    label: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLLabelElement>>>;
    [key: string]: (strings: TemplateStringsArray, ...values: any[]) => ComponentType<any>;
  }

  type StyledComponent = <T>(Component: ComponentType<T>) => ComponentType<T & { className?: string }>;

  const tw: TwElements & StyledComponent;
  export default tw;
}
