# anagrams.io

Anagrams.io is a client side anagrams finder. The goal was to make it easy to find good anagrams for any word length.
Due to the calculations happening client side, the whole search space can be explored.

## Getting started

1. To run it you need node.js, see their guides on [how to install](https://nodejs.dev/en/learn/how-to-install-nodejs/).

2. Run `npm install`

3. Run `npm start` for local development

4. Run `npm build` to create the production build in the `dist` folder. Use `npm run preview` to preview it.

## Technologies

The project is quite old and is using some technologies I wouldn't use now, but it works.

1. React for the UI. This was written before hooks were a thing so component lifecycle is mostly done with classes and usage of now deprecated functionality.
2. mobx for state management. The state manipulations are quite complex as we have to deal with a lot of anagrams calculated per second and want to keep it performant.
3. Styled components for theming. It's not super consistent, there also inline styles here and there.
4. Netlify for deployment.

## Contributing

Fork & Make a pull request! Any contributions are welcome (especially improving the dictionaries).
