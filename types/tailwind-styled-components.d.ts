declare module 'tailwind-styled-components' {
  import { ComponentType } from 'react';

  export interface TwComponent extends ComponentType<any> {
    tw: string;
  }

  export default function tw<T extends keyof JSX.IntrinsicElements | ComponentType<any>>(
    component: T,
    styles?: string
  ): T extends keyof JSX.IntrinsicElements ? ComponentType<JSX.IntrinsicElements[T]> : T;

  export function styled<T extends keyof JSX.IntrinsicElements | ComponentType<any>>(
    component: T
  ): (strings: TemplateStringsArray, ...interpolations: any[]) => T extends keyof JSX.IntrinsicElements
    ? ComponentType<JSX.IntrinsicElements[T]>
    : T;
}
