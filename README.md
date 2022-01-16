<h1 align="center">OBS Deeezer live preview</h1>
<p align="center">OBS Studio live preview of your Deezer music</p>

<p align="center"><img src="./.repo/widget-preview.jpg" alt="Widget preview"></p>

## Installation

1. Download the this repository source code
2. Open `env.js` in a text editor and set your userId & token.
3. In OBS, add the `index.html` file as a source : `Add Source > Browser > New source > Local Files > index.html`

### How to find your Deezer userId & token

// TODO

## Customize the player

You can freely edit the `index.html` & `style.css` files to match your desired design.

- If you want to show more information in the HTML, you just need to provide an additionnal `data-api` attribute on your element with its corresponding path in the API response.
- If you need to set a special html attribute like `src` for images, you can do so by specifying the attribute with `data-attr`.

### Showing the album title as text inside the HTML element

```html
<div data-api="album.title"></div>
```

### Showing the album image inside an element

```html
<img data-api="album.cover" data-attr="src" />
```

### Possible issues

- In order to use the Deezer API in the browser, each request needs to pass through a CORS Proxy. If the proxy gets down, you will encounter errors. You can configure another CORS proxy in the `env.js` file.

### Disclaimer

The player is made by reverse engineering the Deezer WebSocket API. Any change on their side might broke the player. Feel free to contribute / open an issue.

> Most of the reverse engineering work has been made by [nSimon](https://github.com/nSimonFR/deezer-playing-notifications)
