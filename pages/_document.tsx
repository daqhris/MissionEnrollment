import React from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  override render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
