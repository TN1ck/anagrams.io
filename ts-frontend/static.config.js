import React from "react";
import { ServerStyleSheet } from 'styled-components'
import path from "path";
import fs from "fs";
import ExtractTextPlugin from "extract-text-webpack-plugin";
const convPaths = require("convert-tsconfig-paths-to-webpack-aliases").default;

const typescriptWebpackPaths = require("./webpack.config.js");

export default {
  entry: path.join(__dirname, "src", "index.tsx"),
  getSiteData: () => ({
    title: "Anagrams.io",
  }),
  siteRoot: "https://anagrams.io",
  getRoutes: () => {
    return [
      {
        path: "/",
        component: "src/pages/Anagramania",
      },
      {
        path: "/about",
        component: "src/pages/About",
      },
      {
        path: "/share",
        component: "src/pages/Share",
      },
      {
        path: "/performance",
        component: "src/pages/Performance",
      },
      {
        path: "/styleguide",
        component: "src/pages/Styleguide",
      },
      {
        path: "/bestof",
        component: "src/pages/BestOf",
      },
      {
        is404: true,
        component: "src/pages/404",
      },
    ];
  },
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet();
    const html = render(sheet.collectStyles(<Comp />));
    meta.styleTags = sheet.getStyleElement();
    return html;
  },
  Document: ({ Html, Head, Body, children, siteData, renderMeta }) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <title>anagrams.io</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, shrink-to-fit=no, user-scalable=no" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <link rel="icon" href="favicon.ico" type="image/x-icon" />
        <meta name="description" content="Find anagrams with the best anagram finder in the world!"/>
        <meta name="keywords" content="Anagrams,Anagram,Subanagram,Anagram Sentences,Wordplays"/>
        <meta property="og:title" content="anagrams.io"/>
        <meta property="og:site_name" content="anagrams.io"/>
        <meta property="og:type" content="website"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://anagrams.io"/>
        <meta property="og:description" content="Find anagrams with the best anagram finder in the world!"/>
        <meta property="og:image" content="https://anagrams.io/logo-512.png"/>
        <meta property="og:image:type" content="image/png"/>
        <meta property="og:image:width" content="512"/>
        <meta property="og:image:height" content="512"/>

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#999999" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link href="https://fonts.googleapis.com/css?family=Source+Code+Pro:400,700" rel="stylesheet" />
        {renderMeta.styleTags}
      </Head>
      <Body>{children}</Body>
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-58665819-3" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-58665819-3', { 'anonymize_ip': true });
        ` }}
      />
      <script src="https://cdn.ravenjs.com/3.22.2/raven.min.js" crossOrigin="anonymous"></script>
      <script dangerouslySetInnerHTML={{__html: `Raven.config('https://ca404d6267644f978c26ee64994a5066@sentry.io/286292').install();`}} />
    </Html>
  ),
  webpack: (config, { defaultLoaders, stage }) => {
    // Add .ts and .tsx extension to resolver
    config.resolve.extensions.push(".ts", ".tsx");

    const tsconfig = require("./tsconfig.json");

    config.resolve.alias = convPaths(tsconfig);

    // We replace the existing JS rule with one, that allows us to use
    // both TypeScript and JavaScript interchangeably
    config.module.rules = [
      {
        oneOf: [
          defaultLoaders.cssLoader,
          {
            test: /\.worker\.ts$/,
            use: [
              {
                loader: 'worker-loader',
              },
              {
                loader: "babel-loader",
              },
              {
                loader: require.resolve("ts-loader"),
                options: {
                  transpileOnly: true,
                },
              },
            ]
          },
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: defaultLoaders.jsLoader.exclude, // as std jsLoader exclude
            use: [
              {
                loader: "babel-loader",
              },
              {
                loader: require.resolve("ts-loader"),
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          defaultLoaders.fileLoader,
        ],
      },
    ];

    return config;
  },
};
