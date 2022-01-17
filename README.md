<h1 align="center">OBS Deeezer live preview</h1>
<p align="center">OBS Studio live preview of your Deezer music</p>

<p align="center"><img src="./.repo/widget-preview.jpg" alt="Widget preview"></p>

## Installation

1. Download the this repository source code
2. Open `env.js` in a text editor and set your userId & token.
3. In OBS, add the `index.html` file as a source : `Add Source > Browser > New source > Local Files > index.html`

### How to find your Deezer userId & token

- The Deezer documentation explains [how to find your userID](https://support.deezer.com/hc/en-gb/articles/360016118958-Managing-your-Deezer-information).
- The token is harder to get since the `Get Token` button in the Deezer documentation isn't working 🤷‍♂️. I made a simple video below showing the steps to retrieve the token with Browsers DevTools.

https://user-images.githubusercontent.com/45725915/149678720-69e8b907-5305-4798-8c41-8bbbca654359.mp4

## Customize the player

You can customize your player by setting a different theme name in your `env.js` configuration file.

There is currently only a single theme available : `default`.

### Small modifications

To apply tiny changes, you can edit `index.html` and the theme stylesheet in `themes/_THEME_NAME_.css`. If you simply need to override CSS rules, you can use the `override.css` file.

### Theme devlopment

If you have some basic knowledge about HTML & CSS you can easily create your own theme.

1. Create your player container inside the `<section id="themes">` with a `<template data-theme-name="_THEME_NAME_"></template>` tag.
2. Create your stylesheet file in `themes/_THEME_NAME_.css`.
3. Change the selected theme in the configuration file `env.js`.

To show API informations in your container, you have to provide an additionnal `data-api` attribute on your HTML elements with the corresponding path in the API response to access the desired data.

```html
<div data-api="album.title"></div>
```

If you need to set a special html attribute like `src` for images, you can do so by specifying the attribute with `data-attr`.

```html
<img data-api="album.cover" data-attr="src" />
```

### Disclaimer

The player is made by reverse engineering the Deezer WebSocket API. Any change on their side might broke the player. Feel free to contribute / open an issue.

> Most of the reverse engineering work has been made by [nSimon](https://github.com/nSimonFR/deezer-playing-notifications)
