const $head = document.querySelector("head");
const $player = document.querySelector("#player");
const $themes = document.querySelector("#themes");

console.log("Player theme : " + window.env.THEME);
const $selectedTheme = $themes.querySelector(`[data-theme-name="${window.env.THEME}"]`);

if ($selectedTheme) {
  $player.appendChild(document.importNode($selectedTheme.content, true));
  $themes.remove();

  const $link = document.createElement("link");
  $link.setAttribute("rel", "stylesheet");
  $link.setAttribute("href", `./themes/${window.env.THEME}.css`);
  $head.prepend($link);
} else {
  console.error("Theme not valid, couldn't find it in the DOM.");
}
