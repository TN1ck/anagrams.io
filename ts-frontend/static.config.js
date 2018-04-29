import React from "react";
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
  // siteRoot: "https://tomnick.org",
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
        is404: true,
        component: "src/pages/404",
      },
    ];
  },
  Document: ({ Html, Head, Body, children, siteData, renderMeta }) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Tom Nick. Developer by heart. Trying to build great products." />

        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <link href="https://fonts.googleapis.com/css?family=Source+Code+Pro:400,700" rel="stylesheet" />

        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#9B9B9B" />
        <meta name="msapplication-TileImage" content="/images/mstile-150x150.png" />
        <meta name="theme-color" content="#9B9B9B" />

      </Head>
      <Body>{children}</Body>
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-58665819-4" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-58665819-4');
        ` }}
      />
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
          {
            test: /\.s(a|c)ss$/,
            use:
              stage === "dev"
                ? [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
                : ExtractTextPlugin.extract({
                  use: [
                    {
                      loader: "css-loader",
                      options: {
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: false,
                      },
                    },
                    {
                      loader: "sass-loader",
                      options: { includePaths: ["src/"] },
                    },
                  ],
                }),
          },
          defaultLoaders.cssLoader,
          {
            test: /\.worker\.ts$/,
            use: [
              {
                loader: 'worker-loader',
              }
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

    // small react-static bug, make sure to use their extract text plugin config
    config.plugins.push(
      new ExtractTextPlugin({
        filename: "styles.[hash:8].css",
        disable: stage === "dev",
      }),
    );
    return config;
  },
};
