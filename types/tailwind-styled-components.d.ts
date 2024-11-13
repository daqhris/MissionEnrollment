declare module 'tailwind-styled-components' {
  import { ComponentType, PropsWithChildren, HTMLAttributes, AnchorHTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

  export interface TwComponent extends ComponentType<any> {
    tw: string;
  }

  type TemplateFn<P = {}> = (strings: TemplateStringsArray, ...values: any[]) => ComponentType<P>;

  type HTMLElementProps<T, P = {}> = T & P & { children?: React.ReactNode; className?: string };

  interface TwElements {
    div: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLDivElement>, P>>;
    p: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLParagraphElement>, P>>;
    h1: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLHeadingElement>, P>>;
    h2: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLHeadingElement>, P>>;
    h3: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLHeadingElement>, P>>;
    input: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<InputHTMLAttributes<HTMLInputElement>, P>>;
    button: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<ButtonHTMLAttributes<HTMLButtonElement>, P>>;
    span: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLSpanElement>, P>>;
    a: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<AnchorHTMLAttributes<HTMLAnchorElement>, P>>;
    ul: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLUListElement>, P>>;
    li: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLLIElement>, P>>;
    nav: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLElement>, P>>;
    footer: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLElement>, P>>;
    label: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<HTMLElementProps<HTMLAttributes<HTMLLabelElement>, P>>;
    [key: string]: <P = {}>(strings: TemplateStringsArray, ...values: any[]) => ComponentType<any>;
  }

  type StyledComponent = <T, P = {}>(Component: ComponentType<T>) => ComponentType<T & P & { className?: string }>;

  const tw: TwElements & StyledComponent;
  export default tw;
}
