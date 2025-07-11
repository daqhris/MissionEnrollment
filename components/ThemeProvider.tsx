"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const ThemeProvider: React.FC<React.PropsWithChildren<object>> = ({ children }): React.JSX.Element => {
  return <NextThemesProvider>{children}</NextThemesProvider>;
};
