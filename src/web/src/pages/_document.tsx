import { Children } from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

import { logoUrl } from '../components/Logo';
import { title, description, author, keywords, image, imageAlt } from '../config';
import { lightTheme } from '../theme';

// Reference: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en-CA">
        <Head>
          <link rel="icon" href={logoUrl} type="image/svg+xml" />
          <meta charSet="utf-8" />
          <meta name="theme-color" content={lightTheme.palette.primary.main} />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" sizes="180x180" href="/logoImages/apple-icon-180.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

          <meta name="description" content={description} />
          <meta name="author" content={author} />
          <meta name="keywords" content={keywords} />
          <meta name="application-name" content={title} />

          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image} />
          <meta property="og:image:alt" content={imageAlt} />
          <meta property="og:locale" content="en_CA" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={image} />
          <meta name="twitter:image:alt" content={imageAlt} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};

export default MyDocument;
